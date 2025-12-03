import { Router } from 'express';
import { PrismaClient } from '../generated/prisma';

const router = Router();
const prisma = new PrismaClient();

async function createAuditLog(
  organizationId: string,
  entityType: string,
  entityId: string,
  action: string,
  changedByUserId: string,
  beforeSnapshot?: any,
  afterSnapshot?: any,
  ipAddress?: string,
  userAgent?: string
) {
  await prisma.auditLog.create({
    data: {
      organizationId,
      entityType,
      entityId,
      action,
      changedByUserId,
      beforeSnapshot: beforeSnapshot ? JSON.stringify(beforeSnapshot) : null,
      afterSnapshot: afterSnapshot ? JSON.stringify(afterSnapshot) : null,
      ipAddress,
      userAgent
    }
  });
}

// GET /api/transactions - Get all transactions
router.get('/', async (req, res) => {
  try {
    const { organizationId, type, category, status, startDate, endDate } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    const where: any = { organizationId: organizationId as string };

    if (type) {
      where.type = type;
    }

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.date.lte = new Date(endDate as string);
      }
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' }
    });

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// GET /api/transactions/:id - Get single transaction
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

// POST /api/transactions - Create new transaction
router.post('/', async (req, res) => {
  try {
    const {
      organizationId,
      type,
      category,
      description,
      amount,
      date,
      reference,
      account,
      paymentMethod,
      status = 'completed',
      notes,
      attachments
    } = req.body;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const transactionData: any = {
      organizationId,
      type,
      category,
      description,
      reference,
      account,
      paymentMethod,
      status,
      notes
    };

    if (amount !== undefined) {
      transactionData.amount = parseFloat(amount);
    }

    if (date) {
      transactionData.date = new Date(date);
    }

    if (attachments) {
      transactionData.attachments = Array.isArray(attachments) ? attachments.join(',') : attachments;
    }

    const transaction = await prisma.transaction.create({
      data: transactionData
    });

    await createAuditLog(
      organizationId,
      'TRANSACTION',
      transaction.id,
      'CREATE',
      userId,
      null,
      transaction,
      ipAddress,
      userAgent
    );

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// PUT /api/transactions/:id - Update transaction
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const currentTransaction = await prisma.transaction.findUnique({
      where: { id }
    });

    if (!currentTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    const updateData: any = { ...updates };

    if (updates.amount !== undefined) {
      updateData.amount = parseFloat(updates.amount);
    }

    if (updates.date) {
      updateData.date = new Date(updates.date);
    }

    if (updates.attachments) {
      updateData.attachments = Array.isArray(updates.attachments) ? updates.attachments.join(',') : updates.attachments;
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: updateData
    });

    await createAuditLog(
      currentTransaction.organizationId,
      'TRANSACTION',
      id,
      'UPDATE',
      userId,
      currentTransaction,
      updatedTransaction,
      ipAddress,
      userAgent
    );

    res.json(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const transaction = await prisma.transaction.findUnique({
      where: { id }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await prisma.transaction.delete({
      where: { id }
    });

    await createAuditLog(
      transaction.organizationId,
      'TRANSACTION',
      id,
      'DELETE',
      userId,
      transaction,
      null,
      ipAddress,
      userAgent
    );

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// GET /api/transactions/summary/:period - Get transaction summary
router.get('/summary/:period', async (req, res) => {
  try {
    const { period } = req.params;
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    let startDate = new Date();
    const endDate = new Date();

    switch (period) {
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        return res.status(400).json({ error: 'Invalid period. Use: week, month, quarter, year' });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        organizationId: organizationId as string,
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    const summary = {
      totalIncome: 0,
      totalExpenses: 0,
      netProfit: 0,
      transactionCount: transactions.length,
      byCategory: {} as Record<string, { income: number; expenses: number; count: number }>,
      byType: {} as Record<string, number>
    };

    transactions.forEach(transaction => {
      const amount = parseFloat(transaction.amount.toString());

      if (transaction.type === 'income') {
        summary.totalIncome += amount;
      } else {
        summary.totalExpenses += amount;
      }

      // By category
      if (!summary.byCategory[transaction.category]) {
        summary.byCategory[transaction.category] = { income: 0, expenses: 0, count: 0 };
      }

      if (transaction.type === 'income') {
        summary.byCategory[transaction.category].income += amount;
      } else {
        summary.byCategory[transaction.category].expenses += amount;
      }
      summary.byCategory[transaction.category].count += 1;

      // By type
      summary.byType[transaction.type] = (summary.byType[transaction.type] || 0) + amount;
    });

    summary.netProfit = summary.totalIncome - summary.totalExpenses;

    res.json(summary);
  } catch (error) {
    console.error('Error generating transaction summary:', error);
    res.status(500).json({ error: 'Failed to generate transaction summary' });
  }
});

export default router;