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

// GET /api/inventory - Get all inventory items
router.get('/', async (req, res) => {
  try {
    const { organizationId, category, status, lowStock } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    const where: any = { organizationId: organizationId as string };

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    if (lowStock === 'true') {
      where.quantity = { lte: prisma.inventoryItem.fields.reorderLevel };
    }

    const items = await prisma.inventoryItem.findMany({
      where,
      include: {
        job: {
          select: {
            title: true,
            status: true,
            customer: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(items);
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    res.status(500).json({ error: 'Failed to fetch inventory items' });
  }
});

// GET /api/inventory/:id - Get single inventory item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const item = await prisma.inventoryItem.findUnique({
      where: { id },
      include: {
        job: {
          include: {
            customer: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true
              }
            }
          }
        }
      }
    });

    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({ error: 'Failed to fetch inventory item' });
  }
});

// POST /api/inventory - Create new inventory item
router.post('/', async (req, res) => {
  try {
    const {
      organizationId,
      name,
      description,
      category,
      sku,
      unitPrice,
      quantity,
      reorderLevel = 10,
      supplier,
      location,
      notes,
      jobId,
      status = 'in_stock'
    } = req.body;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const itemData: any = {
      organizationId,
      name,
      description,
      category,
      sku,
      supplier,
      location,
      notes,
      status
    };

    if (unitPrice !== undefined) {
      itemData.unitPrice = parseFloat(unitPrice);
    }

    if (quantity !== undefined) {
      itemData.quantity = parseInt(quantity);
    }

    if (reorderLevel !== undefined) {
      itemData.reorderLevel = parseInt(reorderLevel);
    }

    if (jobId) {
      itemData.jobId = jobId;
    }

    const item = await prisma.inventoryItem.create({
      data: itemData,
      include: {
        job: {
          include: {
            customer: true
          }
        }
      }
    });

    await createAuditLog(
      organizationId,
      'INVENTORY_ITEM',
      item.id,
      'CREATE',
      userId,
      null,
      item,
      ipAddress,
      userAgent
    );

    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating inventory item:', error);
    res.status(500).json({ error: 'Failed to create inventory item' });
  }
});

// PUT /api/inventory/:id - Update inventory item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const currentItem = await prisma.inventoryItem.findUnique({
      where: { id },
      include: { job: { include: { customer: true } } }
    });

    if (!currentItem) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    const updateData: any = { ...updates };

    if (updates.unitPrice !== undefined) {
      updateData.unitPrice = parseFloat(updates.unitPrice);
    }

    if (updates.quantity !== undefined) {
      updateData.quantity = parseInt(updates.quantity);
    }

    if (updates.reorderLevel !== undefined) {
      updateData.reorderLevel = parseInt(updates.reorderLevel);
    }

    const updatedItem = await prisma.inventoryItem.update({
      where: { id },
      data: updateData,
      include: {
        job: {
          include: {
            customer: true
          }
        }
      }
    });

    await createAuditLog(
      currentItem.organizationId,
      'INVENTORY_ITEM',
      id,
      'UPDATE',
      userId,
      currentItem,
      updatedItem,
      ipAddress,
      userAgent
    );

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ error: 'Failed to update inventory item' });
  }
});

// DELETE /api/inventory/:id - Delete inventory item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const item = await prisma.inventoryItem.findUnique({
      where: { id },
      include: { job: { include: { customer: true } } }
    });

    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    await prisma.inventoryItem.delete({
      where: { id }
    });

    await createAuditLog(
      item.organizationId,
      'INVENTORY_ITEM',
      id,
      'DELETE',
      userId,
      item,
      null,
      ipAddress,
      userAgent
    );

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ error: 'Failed to delete inventory item' });
  }
});

// POST /api/inventory/:id/adjust - Adjust inventory quantity
router.post('/:id/adjust', async (req, res) => {
  try {
    const { id } = req.params;
    const { adjustment, reason } = req.body;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    if (typeof adjustment !== 'number') {
      return res.status(400).json({ error: 'Adjustment must be a number' });
    }

    const currentItem = await prisma.inventoryItem.findUnique({
      where: { id },
      include: { job: { include: { customer: true } } }
    });

    if (!currentItem) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    const newQuantity = currentItem.quantity + adjustment;

    if (newQuantity < 0) {
      return res.status(400).json({ error: 'Insufficient inventory' });
    }

    const updatedItem = await prisma.inventoryItem.update({
      where: { id },
      data: { quantity: newQuantity },
      include: {
        job: {
          include: {
            customer: true
          }
        }
      }
    });

    await createAuditLog(
      currentItem.organizationId,
      'INVENTORY_ITEM',
      id,
      'ADJUST',
      userId,
      { ...currentItem, adjustment, reason },
      updatedItem,
      ipAddress,
      userAgent
    );

    res.json(updatedItem);
  } catch (error) {
    console.error('Error adjusting inventory:', error);
    res.status(500).json({ error: 'Failed to adjust inventory' });
  }
});

export default router;