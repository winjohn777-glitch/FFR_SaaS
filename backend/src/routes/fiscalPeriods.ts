import { Router } from 'express';
import { PrismaClient } from '../generated/prisma';

const router = Router();
const prisma = new PrismaClient();

// GET /api/fiscal-periods - Get fiscal periods for organization
router.get('/', async (req, res) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    const fiscalPeriods = await prisma.fiscalPeriod.findMany({
      where: { organizationId: organizationId as string },
      orderBy: [{ startDate: 'desc' }]
    });

    res.json(fiscalPeriods);
  } catch (error) {
    console.error('Error fetching fiscal periods:', error);
    res.status(500).json({ error: 'Failed to fetch fiscal periods' });
  }
});

// GET /api/fiscal-periods/current - Get current active fiscal period
router.get('/current', async (req, res) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    const currentDate = new Date();
    const currentPeriod = await prisma.fiscalPeriod.findFirst({
      where: {
        organizationId: organizationId as string,
        startDate: { lte: currentDate },
        endDate: { gte: currentDate },
        isActive: true,
        isClosed: false
      }
    });

    if (!currentPeriod) {
      return res.status(404).json({ error: 'No active fiscal period found for current date' });
    }

    res.json(currentPeriod);
  } catch (error) {
    console.error('Error fetching current fiscal period:', error);
    res.status(500).json({ error: 'Failed to fetch current fiscal period' });
  }
});

// POST /api/fiscal-periods - Create fiscal period
router.post('/', async (req, res) => {
  try {
    const {
      organizationId,
      name,
      type,
      startDate,
      endDate,
      year,
      period
    } = req.body;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    const fiscalPeriod = await prisma.fiscalPeriod.create({
      data: {
        organizationId,
        name,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        year,
        period
      }
    });

    res.status(201).json(fiscalPeriod);
  } catch (error) {
    console.error('Error creating fiscal period:', error);
    res.status(500).json({ error: 'Failed to create fiscal period' });
  }
});

// PUT /api/fiscal-periods/:id/close - Close fiscal period
router.put('/:id/close', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] as string || 'admin-user-id';

    const fiscalPeriod = await prisma.fiscalPeriod.update({
      where: { id },
      data: {
        isClosed: true,
        closedAt: new Date(),
        closedById: userId
      }
    });

    res.json(fiscalPeriod);
  } catch (error) {
    console.error('Error closing fiscal period:', error);
    res.status(500).json({ error: 'Failed to close fiscal period' });
  }
});

export default router;