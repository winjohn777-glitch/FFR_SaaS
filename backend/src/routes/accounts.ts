import express from 'express';
import { PrismaClient } from '../generated/prisma';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/accounts - List chart of accounts
router.get('/', async (req, res) => {
  try {
    const { organizationId, type, active = 'true' } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'organizationId is required' });
    }

    const where: any = { organizationId };
    if (type) where.type = type;
    if (active) where.isActive = active === 'true';

    const accounts = await prisma.account.findMany({
      where,
      include: {
        _count: {
          select: {
            journalEntryLines: true
          }
        }
      },
      orderBy: [
        { type: 'asc' },
        { code: 'asc' }
      ]
    });

    // Group by account type for easier frontend consumption
    const groupedAccounts = accounts.reduce((acc: any, account) => {
      if (!acc[account.type]) {
        acc[account.type] = [];
      }
      acc[account.type].push(account);
      return acc;
    }, {});

    res.json({
      accounts,
      groupedAccounts,
      summary: {
        total: accounts.length,
        active: accounts.filter(a => a.active).length,
        byType: Object.keys(groupedAccounts).reduce((acc: any, type) => {
          acc[type] = groupedAccounts[type].length;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/accounts/:id - Get specific account
router.get('/:id', async (req, res) => {
  try {
    const account = await prisma.account.findUnique({
      where: { id: req.params.id },
      include: {
        parentAccount: { select: { code: true, name: true } },
        children: { select: { id: true, code: true, name: true, type: true } },
        journalLines: {
          include: {
            journalEntry: {
              select: {
                entryNumber: true,
                entryDate: true,
                description: true,
                status: true
              }
            }
          },
          orderBy: { journalEntry: { entryDate: 'desc' } },
          take: 50
        }
      }
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Calculate account balance
    const balance = account.journalLines.reduce((sum, line) => {
      if (account.normalBalance === NormalBalance.DEBIT) {
        return sum + line.debit - line.credit;
      } else {
        return sum + line.credit - line.debit;
      }
    }, 0);

    res.json({ ...account, balance });
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/accounts - Create new account
router.post('/', async (req, res) => {
  try {
    const {
      organizationId,
      code,
      name,
      description,
      type,
      subtype,
      normalBalance,
      parentAccountId,
      isBankAccount = false,
      currency = 'USD'
    } = req.body;

    // Validate account type
    if (!Object.values(AccountType).includes(type)) {
      return res.status(400).json({ error: 'Invalid account type' });
    }

    // Validate normal balance
    if (!Object.values(NormalBalance).includes(normalBalance)) {
      return res.status(400).json({ error: 'Invalid normal balance' });
    }

    // Check if code already exists
    const existingAccount = await prisma.account.findFirst({
      where: { organizationId, code }
    });

    if (existingAccount) {
      return res.status(400).json({ error: 'Account code already exists' });
    }

    const account = await prisma.account.create({
      data: {
        organizationId,
        code,
        name,
        description,
        type,
        subtype,
        normalBalance,
        parentAccountId,
        isBankAccount,
        currency
      },
      include: {
        parentAccount: { select: { code: true, name: true } }
      }
    });

    res.status(201).json(account);
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/accounts/:id - Update account
router.put('/:id', async (req, res) => {
  try {
    const { name, description, subtype, active, isBankAccount } = req.body;

    // Check if account exists
    const existingAccount = await prisma.account.findUnique({
      where: { id: req.params.id }
    });

    if (!existingAccount) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Check if account has transactions before allowing major changes
    const transactionCount = await prisma.journalLine.count({
      where: { accountId: req.params.id }
    });

    if (transactionCount > 0 && active === false) {
      return res.status(400).json({
        error: 'Cannot deactivate account with transactions',
        message: 'Account has existing transactions and cannot be deactivated'
      });
    }

    const updatedAccount = await prisma.account.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        subtype,
        active,
        isBankAccount,
        updatedAt: new Date()
      },
      include: {
        parentAccount: { select: { code: true, name: true } }
      }
    });

    res.json(updatedAccount);
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/accounts/:id/balance - Get account balance
router.get('/:id/balance', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const account = await prisma.account.findUnique({
      where: { id: req.params.id },
      select: { normalBalance: true, name: true, code: true, type: true }
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const where: any = { accountId: req.params.id };
    if (startDate || endDate) {
      where.journalEntry = {};
      if (startDate) where.journalEntry.entryDate = { gte: new Date(startDate as string) };
      if (endDate) where.journalEntry.entryDate = { lte: new Date(endDate as string) };
    }

    const lines = await prisma.journalLine.findMany({
      where,
      include: {
        journalEntry: {
          select: { entryDate: true, status: true }
        }
      }
    });

    // Calculate balance based on normal balance
    const balance = lines.reduce((sum, line) => {
      if (account.normalBalance === NormalBalance.DEBIT) {
        return sum + line.debit - line.credit;
      } else {
        return sum + line.credit - line.debit;
      }
    }, 0);

    const totalDebits = lines.reduce((sum, line) => sum + line.debit, 0);
    const totalCredits = lines.reduce((sum, line) => sum + line.credit, 0);

    res.json({
      account,
      balance,
      totalDebits,
      totalCredits,
      transactionCount: lines.length,
      period: {
        startDate: startDate || null,
        endDate: endDate || null
      }
    });
  } catch (error) {
    console.error('Error calculating account balance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/accounts/search - Search accounts
router.get('/search', async (req, res) => {
  try {
    const { organizationId, query, type, limit = 20 } = req.query;

    if (!organizationId || !query) {
      return res.status(400).json({ error: 'organizationId and query are required' });
    }

    const where: any = {
      organizationId,
      active: true,
      OR: [
        { code: { contains: query as string } },
        { name: { contains: query as string, mode: 'insensitive' } },
        { description: { contains: query as string, mode: 'insensitive' } }
      ]
    };

    if (type) {
      where.type = type;
    }

    const accounts = await prisma.account.findMany({
      where,
      select: {
        id: true,
        code: true,
        name: true,
        type: true,
        normalBalance: true,
        isBankAccount: true
      },
      orderBy: [
        { code: 'asc' }
      ],
      take: Number(limit)
    });

    res.json(accounts);
  } catch (error) {
    console.error('Error searching accounts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;