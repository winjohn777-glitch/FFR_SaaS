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

// GET /api/leads - Get all leads
router.get('/', async (req, res) => {
  try {
    const { organizationId, status, customerId, priority } = req.query;

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

    if (priority) {
      where.priority = priority;
    }

    const leads = await prisma.lead.findMany({
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

    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// GET /api/leads/:id - Get single lead
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        customer: true
      }
    });

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
});

// POST /api/leads - Create new lead
router.post('/', async (req, res) => {
  try {
    const {
      organizationId,
      customerId,
      source,
      type,
      priority = 'medium',
      estimatedValue,
      description,
      notes,
      contactDate,
      followUpDate,
      status = 'new'
    } = req.body;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const leadData: any = {
      organizationId,
      customerId,
      source,
      type,
      priority,
      description,
      notes,
      status
    };

    if (estimatedValue !== undefined) {
      leadData.estimatedValue = parseFloat(estimatedValue);
    }

    if (contactDate) {
      leadData.contactDate = new Date(contactDate);
    }

    if (followUpDate) {
      leadData.followUpDate = new Date(followUpDate);
    }

    const lead = await prisma.lead.create({
      data: leadData,
      include: {
        customer: true
      }
    });

    await createAuditLog(
      organizationId,
      'LEAD',
      lead.id,
      'CREATE',
      userId,
      null,
      lead,
      ipAddress,
      userAgent
    );

    res.status(201).json(lead);
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// PUT /api/leads/:id - Update lead
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const currentLead = await prisma.lead.findUnique({
      where: { id },
      include: { customer: true }
    });

    if (!currentLead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const updateData: any = { ...updates };

    if (updates.estimatedValue !== undefined) {
      updateData.estimatedValue = parseFloat(updates.estimatedValue);
    }

    if (updates.contactDate) {
      updateData.contactDate = new Date(updates.contactDate);
    }

    if (updates.followUpDate) {
      updateData.followUpDate = new Date(updates.followUpDate);
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: updateData,
      include: {
        customer: true
      }
    });

    await createAuditLog(
      currentLead.organizationId,
      'LEAD',
      id,
      'UPDATE',
      userId,
      currentLead,
      updatedLead,
      ipAddress,
      userAgent
    );

    res.json(updatedLead);
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ error: 'Failed to update lead' });
  }
});

// DELETE /api/leads/:id - Delete lead
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: { customer: true }
    });

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    await prisma.lead.delete({
      where: { id }
    });

    await createAuditLog(
      lead.organizationId,
      'LEAD',
      id,
      'DELETE',
      userId,
      lead,
      null,
      ipAddress,
      userAgent
    );

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting lead:', error);
    res.status(500).json({ error: 'Failed to delete lead' });
  }
});

export default router;