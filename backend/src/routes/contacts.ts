import express from 'express';
import { PrismaClient } from '../generated/prisma';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/contacts
router.get('/', async (req, res) => {
  try {
    const { organizationId, type } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'organizationId is required' });
    }

    const where: any = { organizationId };
    if (type) where.type = type;

    const contacts = await prisma.contact.findMany({
      where,
      orderBy: { name: 'asc' }
    });

    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;