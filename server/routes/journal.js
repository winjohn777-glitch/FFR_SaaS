const express = require('express');
const { authMiddleware, requireRole } = require('../middleware/auth');
const prisma = require('../db');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/journal - Get all journal entries
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', dateFrom, dateTo } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      createdBy: {
        organizationId: req.user.organizationId
      },
      ...(search && {
        OR: [
          { number: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { reference: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(dateFrom && { date: { gte: new Date(dateFrom) } }),
      ...(dateTo && { date: { lte: new Date(dateTo) } })
    };

    const [entries, total] = await Promise.all([
      prisma.journalEntry.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          lines: {
            include: {
              account: true
            }
          },
          createdBy: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { date: 'desc' }
      }),
      prisma.journalEntry.count({ where })
    ]);

    res.json({
      success: true,
      data: entries,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch journal entries'
    });
  }
});

// GET /api/journal/:id - Get single journal entry
router.get('/:id', async (req, res) => {
  try {
    const entry = await prisma.journalEntry.findFirst({
      where: {
        id: req.params.id,
        createdBy: {
          organizationId: req.user.organizationId
        }
      },
      include: {
        lines: {
          include: {
            account: true
          }
        },
        createdBy: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        error: 'Journal entry not found'
      });
    }

    res.json({
      success: true,
      data: entry
    });
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch journal entry'
    });
  }
});

// POST /api/journal - Create new journal entry
router.post('/', async (req, res) => {
  try {
    const {
      date,
      description,
      reference,
      lines
    } = req.body;

    if (!date || !description || !lines || !Array.isArray(lines)) {
      return res.status(400).json({
        success: false,
        error: 'Date, description, and lines are required'
      });
    }

    // Validate double-entry accounting: debits = credits
    const totalDebits = lines.reduce((sum, line) => sum + (parseFloat(line.debit) || 0), 0);
    const totalCredits = lines.reduce((sum, line) => sum + (parseFloat(line.credit) || 0), 0);

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      return res.status(400).json({
        success: false,
        error: 'Journal entry must balance: total debits must equal total credits'
      });
    }

    // Validate each line has either debit or credit (not both, not neither)
    for (const line of lines) {
      const hasDebit = line.debit && parseFloat(line.debit) > 0;
      const hasCredit = line.credit && parseFloat(line.credit) > 0;

      if (!hasDebit && !hasCredit) {
        return res.status(400).json({
          success: false,
          error: 'Each journal entry line must have either a debit or credit amount'
        });
      }

      if (hasDebit && hasCredit) {
        return res.status(400).json({
          success: false,
          error: 'Journal entry line cannot have both debit and credit amounts'
        });
      }

      if (!line.accountId) {
        return res.status(400).json({
          success: false,
          error: 'Each journal entry line must specify an account'
        });
      }
    }

    // Generate journal entry number
    const lastEntry = await prisma.journalEntry.findFirst({
      where: {
        createdBy: {
          organizationId: req.user.organizationId
        }
      },
      orderBy: { number: 'desc' }
    });

    const nextNumber = lastEntry
      ? `JE-${String(parseInt(lastEntry.number.split('-')[1]) + 1).padStart(6, '0')}`
      : 'JE-000001';

    const entry = await prisma.journalEntry.create({
      data: {
        number: nextNumber,
        date: new Date(date),
        description,
        reference,
        createdById: req.user.id,
        lines: {
          create: lines.map(line => ({
            accountId: line.accountId,
            debit: parseFloat(line.debit) || 0,
            credit: parseFloat(line.credit) || 0,
            memo: line.memo
          }))
        }
      },
      include: {
        lines: {
          include: {
            account: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: entry,
      message: 'Journal entry created successfully'
    });
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create journal entry'
    });
  }
});

// PUT /api/journal/:id - Update journal entry (only if not posted)
router.put('/:id', async (req, res) => {
  try {
    const existingEntry = await prisma.journalEntry.findFirst({
      where: {
        id: req.params.id,
        createdBy: {
          organizationId: req.user.organizationId
        }
      }
    });

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        error: 'Journal entry not found'
      });
    }

    if (existingEntry.isPosted) {
      return res.status(400).json({
        success: false,
        error: 'Cannot modify posted journal entry'
      });
    }

    const {
      date,
      description,
      reference,
      lines
    } = req.body;

    // Validate double-entry accounting if lines are provided
    if (lines && Array.isArray(lines)) {
      const totalDebits = lines.reduce((sum, line) => sum + (parseFloat(line.debit) || 0), 0);
      const totalCredits = lines.reduce((sum, line) => sum + (parseFloat(line.credit) || 0), 0);

      if (Math.abs(totalDebits - totalCredits) > 0.01) {
        return res.status(400).json({
          success: false,
          error: 'Journal entry must balance: total debits must equal total credits'
        });
      }
    }

    const entry = await prisma.journalEntry.update({
      where: { id: req.params.id },
      data: {
        ...(date && { date: new Date(date) }),
        ...(description && { description }),
        ...(reference !== undefined && { reference }),
        ...(lines && {
          lines: {
            deleteMany: {},
            create: lines.map(line => ({
              accountId: line.accountId,
              debit: parseFloat(line.debit) || 0,
              credit: parseFloat(line.credit) || 0,
              memo: line.memo
            }))
          }
        })
      },
      include: {
        lines: {
          include: {
            account: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: entry,
      message: 'Journal entry updated successfully'
    });
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update journal entry'
    });
  }
});

// POST /api/journal/:id/post - Post journal entry
router.post('/:id/post', requireRole(['ADMIN', 'ACCOUNTANT']), async (req, res) => {
  try {
    const existingEntry = await prisma.journalEntry.findFirst({
      where: {
        id: req.params.id,
        createdBy: {
          organizationId: req.user.organizationId
        }
      },
      include: {
        lines: true
      }
    });

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        error: 'Journal entry not found'
      });
    }

    if (existingEntry.isPosted) {
      return res.status(400).json({
        success: false,
        error: 'Journal entry is already posted'
      });
    }

    const entry = await prisma.journalEntry.update({
      where: { id: req.params.id },
      data: { isPosted: true },
      include: {
        lines: {
          include: {
            account: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: entry,
      message: 'Journal entry posted successfully'
    });
  } catch (error) {
    console.error('Error posting journal entry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to post journal entry'
    });
  }
});

// DELETE /api/journal/:id - Delete journal entry (only if not posted)
router.delete('/:id', requireRole(['ADMIN', 'ACCOUNTANT']), async (req, res) => {
  try {
    const existingEntry = await prisma.journalEntry.findFirst({
      where: {
        id: req.params.id,
        createdBy: {
          organizationId: req.user.organizationId
        }
      }
    });

    if (!existingEntry) {
      return res.status(404).json({
        success: false,
        error: 'Journal entry not found'
      });
    }

    if (existingEntry.isPosted) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete posted journal entry'
      });
    }

    await prisma.journalEntry.delete({
      where: { id: req.params.id }
    });

    res.json({
      success: true,
      message: 'Journal entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete journal entry'
    });
  }
});

module.exports = router;