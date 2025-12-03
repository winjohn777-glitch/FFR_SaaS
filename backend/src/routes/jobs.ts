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

// GET /api/jobs - Get all jobs
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

    const jobs = await prisma.job.findMany({
      where,
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            address: true,
            city: true,
            state: true,
            zipCode: true
          }
        },
        inventoryItems: {
          orderBy: { createdAt: 'desc' }
        },
        documents: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// GET /api/jobs/:id - Get single job
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        customer: true,
        inventoryItems: {
          orderBy: { createdAt: 'desc' }
        },
        documents: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// POST /api/jobs - Create new job
router.post('/', async (req, res) => {
  try {
    const {
      organizationId,
      customerId,
      title,
      description,
      type,
      priority = 'medium',
      status = 'pending',
      estimatedValue,
      actualCost,
      startDate,
      completionDate,
      estimatedCompletionDate,
      assignedTo,
      location,
      notes
    } = req.body;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const jobData: any = {
      organizationId,
      customerId,
      title,
      description,
      type,
      priority,
      status,
      assignedTo,
      location,
      notes
    };

    if (estimatedValue !== undefined) {
      jobData.estimatedValue = parseFloat(estimatedValue);
    }

    if (actualCost !== undefined) {
      jobData.actualCost = parseFloat(actualCost);
    }

    if (startDate) {
      jobData.startDate = new Date(startDate);
    }

    if (completionDate) {
      jobData.completionDate = new Date(completionDate);
    }

    if (estimatedCompletionDate) {
      jobData.estimatedCompletionDate = new Date(estimatedCompletionDate);
    }

    const job = await prisma.job.create({
      data: jobData,
      include: {
        customer: true,
        inventoryItems: true,
        documents: true
      }
    });

    await createAuditLog(
      organizationId,
      'JOB',
      job.id,
      'CREATE',
      userId,
      null,
      job,
      ipAddress,
      userAgent
    );

    res.status(201).json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// PUT /api/jobs/:id - Update job
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const currentJob = await prisma.job.findUnique({
      where: { id },
      include: { customer: true, inventoryItems: true, documents: true }
    });

    if (!currentJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const updateData: any = { ...updates };

    if (updates.estimatedValue !== undefined) {
      updateData.estimatedValue = parseFloat(updates.estimatedValue);
    }

    if (updates.actualCost !== undefined) {
      updateData.actualCost = parseFloat(updates.actualCost);
    }

    if (updates.startDate) {
      updateData.startDate = new Date(updates.startDate);
    }

    if (updates.completionDate) {
      updateData.completionDate = new Date(updates.completionDate);
    }

    if (updates.estimatedCompletionDate) {
      updateData.estimatedCompletionDate = new Date(updates.estimatedCompletionDate);
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        inventoryItems: true,
        documents: true
      }
    });

    await createAuditLog(
      currentJob.organizationId,
      'JOB',
      id,
      'UPDATE',
      userId,
      currentJob,
      updatedJob,
      ipAddress,
      userAgent
    );

    res.json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// DELETE /api/jobs/:id - Delete job
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const job = await prisma.job.findUnique({
      where: { id },
      include: { customer: true, inventoryItems: true, documents: true }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    await prisma.job.delete({
      where: { id }
    });

    await createAuditLog(
      job.organizationId,
      'JOB',
      id,
      'DELETE',
      userId,
      job,
      null,
      ipAddress,
      userAgent
    );

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

export default router;