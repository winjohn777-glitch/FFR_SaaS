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

// GET /api/customers - Get all customers
router.get('/', async (req, res) => {
  try {
    const { organizationId, status } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    const where: any = { organizationId: organizationId as string };

    if (status) {
      where.status = status;
    }

    const customers = await prisma.customer.findMany({
      where,
      include: {
        leads: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        opportunities: {
          where: { status: { notIn: ['closed_lost', 'closed_won'] } },
          orderBy: { createdAt: 'desc' }
        },
        jobs: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        documents: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }]
    });

    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET /api/customers/:id - Get single customer
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        leads: {
          orderBy: { createdAt: 'desc' }
        },
        opportunities: {
          orderBy: { createdAt: 'desc' }
        },
        jobs: {
          include: {
            inventoryItems: true,
            documents: true
          },
          orderBy: { createdAt: 'desc' }
        },
        documents: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// POST /api/customers - Create new customer
router.post('/', async (req, res) => {
  try {
    const {
      organizationId,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      notes,
      source,
      status = 'active'
    } = req.body;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const customer = await prisma.customer.create({
      data: {
        organizationId,
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        notes,
        source,
        status
      },
      include: {
        leads: true,
        opportunities: true,
        jobs: true,
        documents: true
      }
    });

    await createAuditLog(
      organizationId,
      'CUSTOMER',
      customer.id,
      'CREATE',
      userId,
      null,
      customer,
      ipAddress,
      userAgent
    );

    res.status(201).json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// PUT /api/customers/:id - Update customer
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const currentCustomer = await prisma.customer.findUnique({
      where: { id },
      include: { leads: true, opportunities: true, jobs: true, documents: true }
    });

    if (!currentCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: updates,
      include: {
        leads: true,
        opportunities: true,
        jobs: true,
        documents: true
      }
    });

    await createAuditLog(
      currentCustomer.organizationId,
      'CUSTOMER',
      id,
      'UPDATE',
      userId,
      currentCustomer,
      updatedCustomer,
      ipAddress,
      userAgent
    );

    res.json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// DELETE /api/customers/:id - Delete customer
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { leads: true, opportunities: true, jobs: true, documents: true }
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    await prisma.customer.delete({
      where: { id }
    });

    await createAuditLog(
      customer.organizationId,
      'CUSTOMER',
      id,
      'DELETE',
      userId,
      customer,
      null,
      ipAddress,
      userAgent
    );

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

export default router;