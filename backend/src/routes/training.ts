import { Router } from 'express';
import { PrismaClient } from '../generated/prisma';

const router = Router();
const prisma = new PrismaClient();

// Create audit log entry
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

// GET /api/training/sessions - Get all training sessions
router.get('/sessions', async (req, res) => {
  try {
    const { organizationId, status, employeeId } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    const where: any = { organizationId: organizationId as string };

    if (status) {
      where.status = status;
    }

    if (employeeId) {
      where.employeeId = employeeId;
    }

    const sessions = await prisma.trainingSession.findMany({
      where,
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
            department: true
          }
        }
      },
      orderBy: { date: 'asc' }
    });

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching training sessions:', error);
    res.status(500).json({ error: 'Failed to fetch training sessions' });
  }
});

// GET /api/training/upcoming - Get upcoming training sessions
router.get('/upcoming', async (req, res) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    const now = new Date();
    const sessions = await prisma.trainingSession.findMany({
      where: {
        organizationId: organizationId as string,
        date: { gte: now },
        status: { in: ['scheduled', 'in_progress'] }
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
            department: true
          }
        }
      },
      orderBy: { date: 'asc' },
      take: 50 // Limit to next 50 sessions
    });

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching upcoming training sessions:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming training sessions' });
  }
});

// POST /api/training/sessions - Create new training session
router.post('/sessions', async (req, res) => {
  try {
    const {
      organizationId,
      employeeId,
      employeeName,
      type,
      priority = 'medium',
      date,
      time,
      duration,
      location,
      instructor,
      notes,
      status = 'scheduled'
    } = req.body;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const session = await prisma.trainingSession.create({
      data: {
        organizationId,
        employeeId,
        employeeName,
        type,
        priority,
        date: new Date(date),
        time,
        duration,
        location,
        instructor,
        notes,
        status
      },
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
            department: true
          }
        }
      }
    });

    // Create audit log
    await createAuditLog(
      organizationId,
      'TRAINING_SESSION',
      session.id,
      'CREATE',
      userId,
      null,
      session,
      ipAddress,
      userAgent
    );

    res.status(201).json(session);
  } catch (error) {
    console.error('Error creating training session:', error);
    res.status(500).json({ error: 'Failed to create training session' });
  }
});

// PUT /api/training/sessions/:id - Update training session
router.put('/sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Get current session for audit trail
    const currentSession = await prisma.trainingSession.findUnique({
      where: { id },
      include: { employee: true }
    });

    if (!currentSession) {
      return res.status(404).json({ error: 'Training session not found' });
    }

    // Prepare update data
    const updateData: any = { ...updates };
    if (updates.date) {
      updateData.date = new Date(updates.date);
    }
    if (updates.completionDate) {
      updateData.completionDate = new Date(updates.completionDate);
    }

    // Update session
    const updatedSession = await prisma.trainingSession.update({
      where: { id },
      data: updateData,
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
            department: true
          }
        }
      }
    });

    // Create audit log
    await createAuditLog(
      currentSession.organizationId,
      'TRAINING_SESSION',
      id,
      'UPDATE',
      userId,
      currentSession,
      updatedSession,
      ipAddress,
      userAgent
    );

    res.json(updatedSession);
  } catch (error) {
    console.error('Error updating training session:', error);
    res.status(500).json({ error: 'Failed to update training session' });
  }
});

// DELETE /api/training/sessions/:id - Delete training session
router.delete('/sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Get session for audit trail
    const session = await prisma.trainingSession.findUnique({
      where: { id },
      include: { employee: true }
    });

    if (!session) {
      return res.status(404).json({ error: 'Training session not found' });
    }

    // Delete session
    await prisma.trainingSession.delete({
      where: { id }
    });

    // Create audit log
    await createAuditLog(
      session.organizationId,
      'TRAINING_SESSION',
      id,
      'DELETE',
      userId,
      session,
      null,
      ipAddress,
      userAgent
    );

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting training session:', error);
    res.status(500).json({ error: 'Failed to delete training session' });
  }
});

export default router;