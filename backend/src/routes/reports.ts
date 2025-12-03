import express from 'express';
import { PrismaClient } from '../generated/prisma';
import { AccountType, NormalBalance } from '../types/enums';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/reports/trial-balance
router.get('/trial-balance', async (req, res) => {
  try {
    const { organizationId, asOfDate = new Date() } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'organizationId is required' });
    }

    const accounts = await prisma.account.findMany({
      where: { organizationId: organizationId as string, active: true },
      include: {
        journalLines: {
          where: {
            journalEntry: {
              entryDate: { lte: new Date(asOfDate as string) },
              status: 'POSTED'
            }
          }
        }
      },
      orderBy: [{ type: 'asc' }, { code: 'asc' }]
    });

    const trialBalance = accounts.map(account => {
      const balance = account.journalLines.reduce((sum, line) => {
        if (account.normalBalance === NormalBalance.DEBIT) {
          return sum + line.debit - line.credit;
        } else {
          return sum + line.credit - line.debit;
        }
      }, 0);

      return {
        accountCode: account.code,
        accountName: account.name,
        accountType: account.type,
        balance: Math.abs(balance),
        debitBalance: account.normalBalance === NormalBalance.DEBIT && balance > 0 ? balance : 0,
        creditBalance: account.normalBalance === NormalBalance.CREDIT && balance > 0 ? balance : 0
      };
    }).filter(account => account.balance > 0);

    const totalDebits = trialBalance.reduce((sum, account) => sum + account.debitBalance, 0);
    const totalCredits = trialBalance.reduce((sum, account) => sum + account.creditBalance, 0);

    res.json({
      asOfDate,
      accounts: trialBalance,
      totals: {
        debits: totalDebits,
        credits: totalCredits,
        difference: Math.abs(totalDebits - totalCredits),
        balanced: Math.abs(totalDebits - totalCredits) < 0.01
      }
    });
  } catch (error) {
    console.error('Error generating trial balance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;