import express from 'express';
import { PrismaClient, JournalEntryStatus, SourceModule, PeriodType } from '../generated/prisma';

const router = express.Router();
const prisma = new PrismaClient();

// Validation middleware for double-entry
const validateDoubleEntry = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { lines } = req.body;

  if (!lines || !Array.isArray(lines) || lines.length < 2) {
    return res.status(400).json({
      error: 'Validation error',
      message: 'Journal entry must have at least 2 lines for double-entry bookkeeping'
    });
  }

  const totalDebits = lines.reduce((sum: number, line: any) => sum + (parseFloat(line.debit) || 0), 0);
  const totalCredits = lines.reduce((sum: number, line: any) => sum + (parseFloat(line.credit) || 0), 0);

  if (Math.abs(totalDebits - totalCredits) > 0.01) { // Allow for small rounding differences
    return res.status(400).json({
      error: 'Double-entry validation failed',
      message: `Total debits (${totalDebits.toFixed(2)}) must equal total credits (${totalCredits.toFixed(2)})`
    });
  }

  next();
};

// Middleware to validate fiscal period is open
const validateFiscalPeriod = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { fiscalPeriodId } = req.body;

    if (!fiscalPeriodId) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Fiscal period is required'
      });
    }

    const period = await prisma.fiscalPeriod.findUnique({
      where: { id: fiscalPeriodId },
      select: { isClosed: true, isActive: true }
    });

    if (!period) {
      return res.status(400).json({
        error: 'Invalid fiscal period',
        message: 'Fiscal period not found'
      });
    }

    if (period.isClosed) {
      return res.status(400).json({
        error: 'Period closed',
        message: 'Cannot post entries to a closed fiscal period'
      });
    }

    if (!period.isActive) {
      return res.status(400).json({
        error: 'Period inactive',
        message: 'Cannot post entries to an inactive fiscal period'
      });
    }

    next();
  } catch (error) {
    console.error('Error validating fiscal period:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/journal-entries - List journal entries with pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50, status, fiscalPeriodId, organizationId, sourceModule } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (organizationId) where.organizationId = organizationId;
    if (status) where.status = status;
    if (fiscalPeriodId) where.fiscalPeriodId = fiscalPeriodId;
    if (sourceModule) where.sourceModule = sourceModule;

    const entries = await prisma.journalEntry.findMany({
      where,
      include: {
        lines: {
          include: {
            account: { select: { code: true, name: true, type: true } },
            contact: { select: { name: true, type: true } },
            project: { select: { name: true } }
          },
          orderBy: { lineNumber: 'asc' }
        },
        fiscalPeriod: { select: { name: true, startDate: true, endDate: true, type: true } },
        createdBy: { select: { firstName: true, lastName: true, email: true } },
        approvedBy: { select: { firstName: true, lastName: true, email: true } },
        postedBy: { select: { firstName: true, lastName: true, email: true } }
      },
      orderBy: { date: 'desc' },
      skip: offset,
      take: Number(limit)
    });

    const total = await prisma.journalEntry.count({ where });

    res.json({
      entries,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/journal-entries/:id - Get specific journal entry
router.get('/:id', async (req, res) => {
  try {
    const entry = await prisma.journalEntry.findUnique({
      where: { id: req.params.id },
      include: {
        lines: {
          include: {
            account: { select: { code: true, name: true, type: true, normalBalance: true } },
            contact: { select: { name: true, type: true } }
          },
          orderBy: { lineNumber: 'asc' }
        },
        fiscalPeriod: {
          select: {
            periodNumber: true,
            startDate: true,
            endDate: true,
            fiscalYear: { select: { year: true } }
          }
        },
        createdBy: { select: { name: true, email: true } },
        approvedBy: { select: { name: true, email: true } },
        postedBy: { select: { name: true, email: true } }
      }
    });

    if (!entry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    res.json(entry);
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/journal-entries - Create new journal entry
router.post('/', validateDoubleEntry, validateFiscalPeriod, async (req, res) => {
  try {
    const {
      organizationId,
      fiscalPeriodId,
      entryDate,
      description,
      reference,
      sourceModule = SourceModule.MANUAL,
      quickEntryTemplate,
      createdById,
      notes,
      isRecurring = false,
      recurringFrequency,
      recurringEndDate,
      lines
    } = req.body;

    // Generate entry number
    const count = await prisma.journalEntry.count({
      where: { organizationId }
    });
    const entryNumber = `JE${String(count + 1).padStart(6, '0')}`;

    // Calculate totals
    const totalDebit = lines.reduce((sum: number, line: any) => sum + (parseFloat(line.debit) || 0), 0);
    const totalCredit = lines.reduce((sum: number, line: any) => sum + (parseFloat(line.credit) || 0), 0);

    const result = await prisma.$transaction(async (tx) => {
      // Create journal entry
      const entry = await tx.journalEntry.create({
        data: {
          organizationId,
          fiscalPeriodId,
          number: entryNumber,
          date: new Date(entryDate),
          description,
          reference: reference || null,
          sourceModule,
          status: JournalEntryStatus.DRAFT,
          quickEntryTemplate: quickEntryTemplate || null,
          totalDebit: totalDebit,
          totalCredit: totalCredit,
          notes: notes || null,
          isRecurring,
          recurringFrequency: recurringFrequency || null,
          recurringEndDate: recurringEndDate ? new Date(recurringEndDate) : null,
          createdById
        }
      });

      // Create journal lines
      const journalLines = await Promise.all(
        lines.map((line: any, index: number) =>
          tx.journalEntryLine.create({
            data: {
              journalEntryId: entry.id,
              lineNumber: index + 1,
              accountId: line.accountId,
              memo: line.description || line.memo,
              debit: parseFloat(line.debit) || 0,
              credit: parseFloat(line.credit) || 0,
              contactId: line.contactId || null,
              projectId: line.projectId || null,
              reference: line.reference || null
            }
          })
        )
      );

      return { ...entry, lines: journalLines };
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating journal entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/journal-entries/:id - Update journal entry (only if DRAFT status)
router.put('/:id', validateDoubleEntry, async (req, res) => {
  try {
    const entryId = req.params.id;
    const { description, documentDate, lines } = req.body;

    // Check if entry exists and is editable
    const existingEntry = await prisma.journalEntry.findUnique({
      where: { id: entryId },
      select: { status: true }
    });

    if (!existingEntry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    if (existingEntry.status !== JournalStatus.DRAFT) {
      return res.status(400).json({
        error: 'Cannot edit journal entry',
        message: 'Only draft entries can be edited'
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update journal entry
      const entry = await tx.journalEntry.update({
        where: { id: entryId },
        data: {
          description,
          documentDate: documentDate ? new Date(documentDate) : null,
          updatedAt: new Date()
        }
      });

      // Delete existing lines
      await tx.journalLine.deleteMany({
        where: { journalEntryId: entryId }
      });

      // Create new lines
      const journalLines = await Promise.all(
        lines.map((line: any, index: number) =>
          tx.journalLine.create({
            data: {
              journalEntryId: entryId,
              lineNumber: index + 1,
              accountId: line.accountId,
              description: line.description,
              debit: line.debit || 0,
              credit: line.credit || 0,
              contactId: line.contactId || null,
              reference: line.reference || null
            }
          })
        )
      );

      return { ...entry, lines: journalLines };
    });

    res.json(result);
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/journal-entries/:id/approve - Approve journal entry
router.post('/:id/approve', async (req, res) => {
  try {
    const entryId = req.params.id;
    const { approvedByUserId } = req.body;

    const entry = await prisma.journalEntry.findUnique({
      where: { id: entryId },
      select: { status: true, fiscalPeriod: { select: { isClosed: true } } }
    });

    if (!entry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    if (entry.fiscalPeriod.isClosed) {
      return res.status(400).json({
        error: 'Cannot approve journal entry',
        message: 'Cannot approve entries in a closed fiscal period'
      });
    }

    if (entry.status !== JournalEntryStatus.DRAFT) {
      return res.status(400).json({
        error: 'Cannot approve journal entry',
        message: 'Only draft entries can be approved'
      });
    }

    const updatedEntry = await prisma.journalEntry.update({
      where: { id: entryId },
      data: {
        status: JournalEntryStatus.APPROVED,
        approvedByUserId,
        approvedAt: new Date(),
        updatedAt: new Date()
      }
    });

    res.json(updatedEntry);
  } catch (error) {
    console.error('Error approving journal entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/journal-entries/:id/post - Post journal entry to ledger
router.post('/:id/post', async (req, res) => {
  try {
    const entryId = req.params.id;
    const { postedByUserId } = req.body;

    const entry = await prisma.journalEntry.findUnique({
      where: { id: entryId },
      select: { status: true, fiscalPeriod: { select: { isClosed: true } } }
    });

    if (!entry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    if (entry.fiscalPeriod.isClosed) {
      return res.status(400).json({
        error: 'Cannot post journal entry',
        message: 'Cannot post entries to a closed fiscal period'
      });
    }

    if (entry.status !== JournalEntryStatus.APPROVED) {
      return res.status(400).json({
        error: 'Cannot post journal entry',
        message: 'Only approved entries can be posted'
      });
    }

    const updatedEntry = await prisma.journalEntry.update({
      where: { id: entryId },
      data: {
        status: JournalEntryStatus.POSTED,
        isPosted: true,
        postedByUserId,
        postedAt: new Date(),
        updatedAt: new Date()
      }
    });

    res.json(updatedEntry);
  } catch (error) {
    console.error('Error posting journal entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/journal-entries/:id - Delete journal entry (only if DRAFT)
router.delete('/:id', async (req, res) => {
  try {
    const entryId = req.params.id;

    const entry = await prisma.journalEntry.findUnique({
      where: { id: entryId },
      select: { status: true }
    });

    if (!entry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    if (entry.status !== JournalStatus.DRAFT) {
      return res.status(400).json({
        error: 'Cannot delete journal entry',
        message: 'Only draft entries can be deleted'
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.journalLine.deleteMany({ where: { journalEntryId: entryId } });
      await tx.journalEntry.delete({ where: { id: entryId } });
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/journal-entries/quick-entry - Create journal entry from template
router.post('/quick-entry', async (req, res) => {
  try {
    const {
      organizationId,
      fiscalPeriodId,
      template,
      amount,
      description,
      reference,
      vendor,
      createdByUserId
    } = req.body;

    // Define quick entry templates matching frontend
    const templates: { [key: string]: any } = {
      truck_payment: {
        accounts: { debit: '2100', credit: '1010' },
        description: (data: any) => `Vehicle loan payment - ${data.vendor || 'monthly payment'} - ${data.reference || ''}`
      },
      fuel_purchase: {
        accounts: { debit: '6250', credit: '1010' },
        description: (data: any) => `Fuel purchase - ${data.vendor || 'fuel station'} - ${data.reference || ''}`
      },
      customer_payment: {
        accounts: { debit: '1010', credit: '1200' },
        description: (data: any) => `Customer payment received - ${data.vendor || 'customer'} - ${data.reference || ''}`
      },
      utility_bill: {
        accounts: { debit: '6300', credit: '2000' },
        description: (data: any) => `Utility payment - ${data.vendor || 'utility company'} - ${data.reference || ''}`
      },
      rent_payment: {
        accounts: { debit: '6100', credit: '1010' },
        description: (data: any) => `Rent payment - ${data.vendor || 'landlord'} - ${data.reference || ''}`
      },
      insurance_payment: {
        accounts: { debit: '6200', credit: '1010' },
        description: (data: any) => `Insurance payment - ${data.vendor || 'insurance company'} - ${data.reference || ''}`
      },
      supplier_payment: {
        accounts: { debit: '2000', credit: '1010' },
        description: (data: any) => `Supplier payment - ${data.vendor || 'supplier'} - ${data.reference || ''}`
      }
    };

    const templateConfig = templates[template];
    if (!templateConfig) {
      return res.status(400).json({ error: 'Invalid template' });
    }

    // Get the accounts by code
    const debitAccount = await prisma.account.findFirst({
      where: { organizationId, code: templateConfig.accounts.debit }
    });
    const creditAccount = await prisma.account.findFirst({
      where: { organizationId, code: templateConfig.accounts.credit }
    });

    if (!debitAccount || !creditAccount) {
      return res.status(400).json({ error: 'Template accounts not found' });
    }

    // Generate entry number
    const count = await prisma.journalEntry.count({ where: { organizationId } });
    const entryNumber = `JE${String(count + 1).padStart(6, '0')}`;

    // Create the journal entry
    const result = await prisma.$transaction(async (tx) => {
      const entry = await tx.journalEntry.create({
        data: {
          organizationId,
          fiscalPeriodId,
          entryNumber,
          entryDate: new Date(),
          description: templateConfig.description({ vendor, reference }),
          sourceModule: JournalSourceModule.QUICK_ENTRY,
          status: JournalStatus.DRAFT,
          quickEntryTemplate: template,
          createdByUserId
        }
      });

      const lines = await Promise.all([
        tx.journalLine.create({
          data: {
            journalEntryId: entry.id,
            lineNumber: 1,
            accountId: debitAccount.id,
            description: `${debitAccount.name} - ${description}`,
            debit: amount,
            credit: 0,
            reference
          }
        }),
        tx.journalLine.create({
          data: {
            journalEntryId: entry.id,
            lineNumber: 2,
            accountId: creditAccount.id,
            description: `${creditAccount.name} - ${description}`,
            debit: 0,
            credit: amount,
            reference
          }
        })
      ]);

      return { ...entry, lines };
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating quick entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/journal-entries/:id/reverse - Create reversing entry
router.post('/:id/reverse', async (req, res) => {
  try {
    const entryId = req.params.id;
    const { reversedByUserId, description } = req.body;

    const originalEntry = await prisma.journalEntry.findUnique({
      where: { id: entryId },
      include: {
        lines: true,
        fiscalPeriod: { select: { isClosed: true } }
      }
    });

    if (!originalEntry) {
      return res.status(404).json({ error: 'Journal entry not found' });
    }

    if (originalEntry.status !== JournalEntryStatus.POSTED) {
      return res.status(400).json({
        error: 'Cannot reverse entry',
        message: 'Only posted entries can be reversed'
      });
    }

    if (originalEntry.fiscalPeriod.isClosed) {
      return res.status(400).json({
        error: 'Cannot reverse entry',
        message: 'Cannot reverse entries in a closed fiscal period'
      });
    }

    if (originalEntry.isReversing || originalEntry.reversedByEntryId) {
      return res.status(400).json({
        error: 'Cannot reverse entry',
        message: 'Entry has already been reversed'
      });
    }

    // Generate reversal entry number
    const count = await prisma.journalEntry.count({
      where: { organizationId: originalEntry.organizationId }
    });
    const reversalNumber = `REV-${originalEntry.number}-${String(count + 1).padStart(3, '0')}`;

    const result = await prisma.$transaction(async (tx) => {
      // Create reversing entry with flipped debits/credits
      const reversalEntry = await tx.journalEntry.create({
        data: {
          organizationId: originalEntry.organizationId,
          fiscalPeriodId: originalEntry.fiscalPeriodId,
          number: reversalNumber,
          date: new Date(),
          description: description || `Reversal of ${originalEntry.description}`,
          reference: `REV-${originalEntry.number}`,
          sourceModule: SourceModule.MANUAL,
          status: JournalEntryStatus.POSTED,
          isPosted: true,
          isReversing: true,
          originalEntryId: originalEntry.id,
          totalDebit: originalEntry.totalCredit,
          totalCredit: originalEntry.totalDebit,
          createdById: reversedByUserId,
          postedByUserId: reversedByUserId,
          postedAt: new Date()
        }
      });

      // Create reversal lines with flipped amounts
      const reversalLines = await Promise.all(
        originalEntry.lines.map((line, index) =>
          tx.journalEntryLine.create({
            data: {
              journalEntryId: reversalEntry.id,
              lineNumber: index + 1,
              accountId: line.accountId,
              memo: `Reversal: ${line.memo}`,
              debit: line.credit, // Flip credit to debit
              credit: line.debit, // Flip debit to credit
              contactId: line.contactId,
              projectId: line.projectId,
              reference: `REV-${line.reference || ''}`
            }
          })
        )
      );

      // Update original entry to mark as reversed
      await tx.journalEntry.update({
        where: { id: entryId },
        data: {
          reversedByEntryId: reversalEntry.id,
          updatedAt: new Date()
        }
      });

      return { ...reversalEntry, lines: reversalLines };
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating reversal entry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/journal-entries/templates - Get available quick entry templates
router.get('/templates', async (req, res) => {
  try {
    const templates = {
      roofing_business: {
        truck_payment: {
          name: 'Vehicle Loan Payment',
          accounts: { debit: '2100', credit: '1010' },
          description: 'Vehicle loan payment'
        },
        fuel_purchase: {
          name: 'Fuel Purchase',
          accounts: { debit: '6250', credit: '1010' },
          description: 'Fuel purchase for vehicles'
        },
        customer_payment: {
          name: 'Customer Payment Received',
          accounts: { debit: '1010', credit: '1200' },
          description: 'Payment received from customer'
        },
        utility_bill: {
          name: 'Utility Payment',
          accounts: { debit: '6300', credit: '2000' },
          description: 'Utility bill payment'
        },
        rent_payment: {
          name: 'Rent Payment',
          accounts: { debit: '6100', credit: '1010' },
          description: 'Monthly rent payment'
        },
        insurance_payment: {
          name: 'Insurance Payment',
          accounts: { debit: '6200', credit: '1010' },
          description: 'Insurance premium payment'
        },
        supplier_payment: {
          name: 'Supplier Payment',
          accounts: { debit: '2000', credit: '1010' },
          description: 'Payment to supplier'
        },
        material_purchase: {
          name: 'Material Purchase',
          accounts: { debit: '1300', credit: '2000' },
          description: 'Roofing materials purchase'
        },
        subcontractor_payment: {
          name: 'Subcontractor Payment',
          accounts: { debit: '6400', credit: '1010' },
          description: 'Payment to subcontractor'
        },
        equipment_rental: {
          name: 'Equipment Rental',
          accounts: { debit: '6350', credit: '1010' },
          description: 'Equipment rental expense'
        }
      }
    };

    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/journal-entries/fiscal-periods - Get available fiscal periods
router.get('/fiscal-periods', async (req, res) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    const periods = await prisma.fiscalPeriod.findMany({
      where: {
        organizationId: organizationId as string,
        isActive: true
      },
      orderBy: [
        { year: 'desc' },
        { period: 'desc' }
      ]
    });

    res.json(periods);
  } catch (error) {
    console.error('Error fetching fiscal periods:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/journal-entries/fiscal-periods - Create fiscal period
router.post('/fiscal-periods', async (req, res) => {
  try {
    const { organizationId, name, type, year, period, startDate, endDate } = req.body;

    // Validate required fields
    if (!organizationId || !name || !type || !year || !period || !startDate || !endDate) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'organizationId, name, type, year, period, startDate, and endDate are required'
      });
    }

    // Check if period already exists
    const existingPeriod = await prisma.fiscalPeriod.findFirst({
      where: {
        organizationId,
        type: type as PeriodType,
        year: parseInt(year),
        period: parseInt(period)
      }
    });

    if (existingPeriod) {
      return res.status(400).json({
        error: 'Period already exists',
        message: `Fiscal period ${name} already exists for this organization`
      });
    }

    const fiscalPeriod = await prisma.fiscalPeriod.create({
      data: {
        organizationId,
        name,
        type: type as PeriodType,
        year: parseInt(year),
        period: parseInt(period),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: true,
        isClosed: false
      }
    });

    res.status(201).json(fiscalPeriod);
  } catch (error) {
    console.error('Error creating fiscal period:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;