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

// GET /api/documents - Get all documents
router.get('/', async (req, res) => {
  try {
    const { organizationId, type, customerId, jobId, category } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    const where: any = { organizationId: organizationId as string };

    if (type) {
      where.type = type;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    if (jobId) {
      where.jobId = jobId;
    }

    if (category) {
      where.category = category;
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        job: {
          select: {
            title: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// GET /api/documents/:id - Get single document
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        customer: true,
        job: {
          include: {
            customer: true
          }
        }
      }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

// POST /api/documents - Create new document
router.post('/', async (req, res) => {
  try {
    const {
      organizationId,
      title,
      type,
      category,
      description,
      content,
      filePath,
      fileName,
      fileSize,
      mimeType,
      customerId,
      jobId,
      tags,
      status = 'active',
      isPublic = false
    } = req.body;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const documentData: any = {
      organizationId,
      title,
      type,
      category,
      description,
      content,
      filePath,
      fileName,
      mimeType,
      status,
      isPublic
    };

    if (fileSize !== undefined) {
      documentData.fileSize = parseInt(fileSize);
    }

    if (customerId) {
      documentData.customerId = customerId;
    }

    if (jobId) {
      documentData.jobId = jobId;
    }

    if (tags) {
      documentData.tags = Array.isArray(tags) ? tags.join(',') : tags;
    }

    const document = await prisma.document.create({
      data: documentData,
      include: {
        customer: true,
        job: {
          include: {
            customer: true
          }
        }
      }
    });

    await createAuditLog(
      organizationId,
      'DOCUMENT',
      document.id,
      'CREATE',
      userId,
      null,
      document,
      ipAddress,
      userAgent
    );

    res.status(201).json(document);
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: 'Failed to create document' });
  }
});

// PUT /api/documents/:id - Update document
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const currentDocument = await prisma.document.findUnique({
      where: { id },
      include: { customer: true, job: { include: { customer: true } } }
    });

    if (!currentDocument) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const updateData: any = { ...updates };

    if (updates.fileSize !== undefined) {
      updateData.fileSize = parseInt(updates.fileSize);
    }

    if (updates.tags) {
      updateData.tags = Array.isArray(updates.tags) ? updates.tags.join(',') : updates.tags;
    }

    const updatedDocument = await prisma.document.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        job: {
          include: {
            customer: true
          }
        }
      }
    });

    await createAuditLog(
      currentDocument.organizationId,
      'DOCUMENT',
      id,
      'UPDATE',
      userId,
      currentDocument,
      updatedDocument,
      ipAddress,
      userAgent
    );

    res.json(updatedDocument);
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Failed to update document' });
  }
});

// DELETE /api/documents/:id - Delete document
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const document = await prisma.document.findUnique({
      where: { id },
      include: { customer: true, job: { include: { customer: true } } }
    });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    await prisma.document.delete({
      where: { id }
    });

    await createAuditLog(
      document.organizationId,
      'DOCUMENT',
      id,
      'DELETE',
      userId,
      document,
      null,
      ipAddress,
      userAgent
    );

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// POST /api/documents/search - Search documents
router.post('/search', async (req, res) => {
  try {
    const { organizationId, searchTerm, filters = {} } = req.body;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    const where: any = { organizationId };

    // Add filters
    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters.jobId) {
      where.jobId = filters.jobId;
    }

    // Add search term
    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { content: { contains: searchTerm, mode: 'insensitive' } },
        { tags: { contains: searchTerm, mode: 'insensitive' } }
      ];
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        job: {
          select: {
            title: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.json(documents);
  } catch (error) {
    console.error('Error searching documents:', error);
    res.status(500).json({ error: 'Failed to search documents' });
  }
});

export default router;