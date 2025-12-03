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

// GET /api/opportunities - Get all opportunities
router.get('/', async (req, res) => {
  try {
    const { organizationId, status, customerId, stage } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    const where: any = { organizationId: organizationId as string };

    if (status) {
      where.status = status;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    if (stage) {
      where.stage = stage;
    }

    const opportunities = await prisma.opportunity.findMany({
      where,
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(opportunities);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    res.status(500).json({ error: 'Failed to fetch opportunities' });
  }
});

// GET /api/opportunities/:id - Get single opportunity
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        customer: true
      }
    });

    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    res.json(opportunity);
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    res.status(500).json({ error: 'Failed to fetch opportunity' });
  }
});

// POST /api/opportunities - Create new opportunity
router.post('/', async (req, res) => {
  try {
    const {
      organizationId,
      customerId,
      title,
      description,
      value,
      stage = 'prospecting',
      priority = 'medium',
      probability = 25,
      expectedCloseDate,
      assignedTo,
      notes,
      status = 'open'
    } = req.body;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const opportunityData: any = {
      organizationId,
      customerId,
      title,
      description,
      stage,
      priority,
      assignedTo,
      notes,
      status
    };

    if (value !== undefined) {
      opportunityData.value = parseFloat(value);
    }

    if (probability !== undefined) {
      opportunityData.probability = parseInt(probability);
    }

    if (expectedCloseDate) {
      opportunityData.expectedCloseDate = new Date(expectedCloseDate);
    }

    const opportunity = await prisma.opportunity.create({
      data: opportunityData,
      include: {
        customer: true
      }
    });

    await createAuditLog(
      organizationId,
      'OPPORTUNITY',
      opportunity.id,
      'CREATE',
      userId,
      null,
      opportunity,
      ipAddress,
      userAgent
    );

    res.status(201).json(opportunity);
  } catch (error) {
    console.error('Error creating opportunity:', error);
    res.status(500).json({ error: 'Failed to create opportunity' });
  }
});

// PUT /api/opportunities/:id - Update opportunity
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const currentOpportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: { customer: true }
    });

    if (!currentOpportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    const updateData: any = { ...updates };

    if (updates.value !== undefined) {
      updateData.value = parseFloat(updates.value);
    }

    if (updates.probability !== undefined) {
      updateData.probability = parseInt(updates.probability);
    }

    if (updates.expectedCloseDate) {
      updateData.expectedCloseDate = new Date(updates.expectedCloseDate);
    }

    if (updates.actualCloseDate) {
      updateData.actualCloseDate = new Date(updates.actualCloseDate);
    }

    const updatedOpportunity = await prisma.opportunity.update({
      where: { id },
      data: updateData,
      include: {
        customer: true
      }
    });

    await createAuditLog(
      currentOpportunity.organizationId,
      'OPPORTUNITY',
      id,
      'UPDATE',
      userId,
      currentOpportunity,
      updatedOpportunity,
      ipAddress,
      userAgent
    );

    res.json(updatedOpportunity);
  } catch (error) {
    console.error('Error updating opportunity:', error);
    res.status(500).json({ error: 'Failed to update opportunity' });
  }
});

// DELETE /api/opportunities/:id - Delete opportunity
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: { customer: true }
    });

    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    await prisma.opportunity.delete({
      where: { id }
    });

    await createAuditLog(
      opportunity.organizationId,
      'OPPORTUNITY',
      id,
      'DELETE',
      userId,
      opportunity,
      null,
      ipAddress,
      userAgent
    );

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    res.status(500).json({ error: 'Failed to delete opportunity' });
  }
});

export default router;