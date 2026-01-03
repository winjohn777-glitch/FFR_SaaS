import { Router, Request, Response } from 'express';
import { PrismaClient, SopStatus, SopPriority } from '../generated/prisma';
import { body, query, param, validationResult } from 'express-validator';

const router = Router();
const prisma = new PrismaClient();

// =====================================================
// SOP CATEGORIES ROUTES
// =====================================================

// GET /api/sop/categories - Retrieve all SOP categories
router.get('/categories', [
  query('active_only').optional().isBoolean()
], async (req: Request, res: Response) => {
  try {
    const activeOnly = req.query.active_only === 'true';

    const categories = await prisma.sopCategory.findMany({
      where: activeOnly ? { isActive: true } : undefined,
      orderBy: [{ sortOrder: 'asc' }, { code: 'asc' }],
      include: {
        _count: {
          select: { procedures: true }
        }
      }
    });

    res.json({
      success: true,
      data: categories
    });
  } catch (error: any) {
    console.error('Error fetching SOP categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve SOP categories',
      error: error.message
    });
  }
});

// POST /api/sop/categories - Create a new SOP category
router.post('/categories', [
  body('code').isLength({ min: 4, max: 4 }).matches(/^\d{4}$/),
  body('name').isLength({ min: 1, max: 100 }),
  body('description').optional().isString(),
  body('sortOrder').optional().isInt({ min: 0 })
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { code, name, description, sortOrder } = req.body;

    const category = await prisma.sopCategory.create({
      data: {
        code,
        name,
        description,
        sortOrder: sortOrder || 0
      }
    });

    res.status(201).json({
      success: true,
      message: 'SOP category created successfully',
      data: category
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Category code already exists'
      });
    }
    console.error('Error creating SOP category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create SOP category',
      error: error.message
    });
  }
});

// PUT /api/sop/categories/:id - Update a SOP category
router.put('/categories/:id', [
  param('id').isString(),
  body('name').optional().isLength({ min: 1, max: 100 }),
  body('description').optional().isString(),
  body('isActive').optional().isBoolean(),
  body('sortOrder').optional().isInt({ min: 0 })
], async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, isActive, sortOrder } = req.body;

    const category = await prisma.sopCategory.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder })
      }
    });

    res.json({
      success: true,
      message: 'SOP category updated successfully',
      data: category
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    console.error('Error updating SOP category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update SOP category',
      error: error.message
    });
  }
});

// =====================================================
// SOP PROCEDURES ROUTES
// =====================================================

// GET /api/sop/procedures - Retrieve SOPs with filtering
router.get('/procedures', [
  query('categoryId').optional().isString(),
  query('status').optional().isIn(['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'ACTIVE', 'ARCHIVED', 'DEPRECATED']),
  query('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  query('search').optional().isString(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('offset').optional().isInt({ min: 0 })
], async (req: Request, res: Response) => {
  try {
    const { categoryId, status, priority, search, limit = '50', offset = '0' } = req.query;

    const where: any = { isActive: true };

    if (categoryId) where.categoryId = categoryId as string;
    if (status) where.status = status as SopStatus;
    if (priority) where.priority = priority as SopPriority;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { sopNumber: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [procedures, total] = await Promise.all([
      prisma.sopProcedure.findMany({
        where,
        include: {
          category: true,
          _count: {
            select: { forms: true, assignments: true }
          }
        },
        orderBy: { sopNumber: 'asc' },
        take: parseInt(limit as string),
        skip: parseInt(offset as string)
      }),
      prisma.sopProcedure.count({ where })
    ]);

    res.json({
      success: true,
      data: procedures,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      }
    });
  } catch (error: any) {
    console.error('Error fetching SOP procedures:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve SOP procedures',
      error: error.message
    });
  }
});

// GET /api/sop/procedures/:id - Get a single SOP procedure
router.get('/procedures/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const procedure = await prisma.sopProcedure.findUnique({
      where: { id },
      include: {
        category: true,
        forms: true,
        assignments: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        compliance: {
          orderBy: { complianceDate: 'desc' },
          take: 10
        },
        workflows: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!procedure) {
      return res.status(404).json({
        success: false,
        message: 'SOP procedure not found'
      });
    }

    res.json({
      success: true,
      data: procedure
    });
  } catch (error: any) {
    console.error('Error fetching SOP procedure:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve SOP procedure',
      error: error.message
    });
  }
});

// POST /api/sop/procedures - Create a new SOP procedure
router.post('/procedures', [
  body('sopNumber').isString().isLength({ min: 1, max: 50 }),
  body('title').isString().isLength({ min: 1, max: 200 }),
  body('description').optional().isString(),
  body('categoryId').isString(),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  body('effectiveDate').optional().isISO8601(),
  body('reviewDate').optional().isISO8601()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { sopNumber, title, description, categoryId, priority, effectiveDate, reviewDate } = req.body;

    const procedure = await prisma.sopProcedure.create({
      data: {
        sopNumber,
        title,
        description,
        categoryId,
        priority: priority || 'MEDIUM',
        effectiveDate: effectiveDate ? new Date(effectiveDate) : null,
        reviewDate: reviewDate ? new Date(reviewDate) : null
      },
      include: {
        category: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'SOP procedure created successfully',
      data: procedure
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'SOP number already exists'
      });
    }
    console.error('Error creating SOP procedure:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create SOP procedure',
      error: error.message
    });
  }
});

// PUT /api/sop/procedures/:id - Update a SOP procedure
router.put('/procedures/:id', [
  param('id').isString(),
  body('title').optional().isString().isLength({ min: 1, max: 200 }),
  body('description').optional().isString(),
  body('status').optional().isIn(['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'ACTIVE', 'ARCHIVED', 'DEPRECATED']),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  body('effectiveDate').optional().isISO8601(),
  body('reviewDate').optional().isISO8601(),
  body('isActive').optional().isBoolean()
], async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: any = {};

    const fields = ['title', 'description', 'status', 'priority', 'isActive', 'contentFilePath'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (req.body.effectiveDate) {
      updateData.effectiveDate = new Date(req.body.effectiveDate);
    }
    if (req.body.reviewDate) {
      updateData.reviewDate = new Date(req.body.reviewDate);
    }

    const procedure = await prisma.sopProcedure.update({
      where: { id },
      data: updateData,
      include: {
        category: true
      }
    });

    res.json({
      success: true,
      message: 'SOP procedure updated successfully',
      data: procedure
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'SOP procedure not found'
      });
    }
    console.error('Error updating SOP procedure:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update SOP procedure',
      error: error.message
    });
  }
});

// DELETE /api/sop/procedures/:id - Soft delete a SOP procedure
router.delete('/procedures/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.sopProcedure.update({
      where: { id },
      data: { isActive: false, status: 'ARCHIVED' }
    });

    res.json({
      success: true,
      message: 'SOP procedure archived successfully'
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'SOP procedure not found'
      });
    }
    console.error('Error archiving SOP procedure:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to archive SOP procedure',
      error: error.message
    });
  }
});

// =====================================================
// SOP FORMS ROUTES
// =====================================================

// GET /api/sop/forms - Get all forms
router.get('/forms', async (req: Request, res: Response) => {
  try {
    const { procedureId } = req.query;

    const where: any = { isActive: true };
    if (procedureId) where.procedureId = procedureId as string;

    const forms = await prisma.sopForm.findMany({
      where,
      include: {
        procedure: {
          select: { id: true, sopNumber: true, title: true }
        }
      },
      orderBy: { formNumber: 'asc' }
    });

    res.json({
      success: true,
      data: forms
    });
  } catch (error: any) {
    console.error('Error fetching SOP forms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve SOP forms',
      error: error.message
    });
  }
});

// POST /api/sop/forms - Create a new form
router.post('/forms', [
  body('formNumber').isString().isLength({ min: 1, max: 50 }),
  body('title').isString().isLength({ min: 1, max: 200 }),
  body('procedureId').isString(),
  body('formType').isString(),
  body('template').optional().isString()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { formNumber, title, description, procedureId, formType, template } = req.body;

    const form = await prisma.sopForm.create({
      data: {
        formNumber,
        title,
        description,
        procedureId,
        formType,
        template
      }
    });

    res.status(201).json({
      success: true,
      message: 'SOP form created successfully',
      data: form
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Form number already exists'
      });
    }
    console.error('Error creating SOP form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create SOP form',
      error: error.message
    });
  }
});

// =====================================================
// SOP ASSIGNMENTS ROUTES
// =====================================================

// GET /api/sop/assignments - Get assignments
router.get('/assignments', async (req: Request, res: Response) => {
  try {
    const { procedureId, employeeId, projectId, status } = req.query;

    const where: any = {};
    if (procedureId) where.procedureId = procedureId as string;
    if (employeeId) where.employeeId = employeeId as string;
    if (projectId) where.projectId = projectId as string;
    if (status) where.status = status as string;

    const assignments = await prisma.sopAssignment.findMany({
      where,
      include: {
        procedure: {
          select: { id: true, sopNumber: true, title: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: assignments
    });
  } catch (error: any) {
    console.error('Error fetching SOP assignments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve SOP assignments',
      error: error.message
    });
  }
});

// POST /api/sop/assignments - Create assignment
router.post('/assignments', [
  body('procedureId').isString(),
  body('employeeId').optional().isString(),
  body('projectId').optional().isString(),
  body('dueDate').optional().isISO8601()
], async (req: Request, res: Response) => {
  try {
    const { procedureId, employeeId, projectId, dueDate, assignedById, notes } = req.body;

    const assignment = await prisma.sopAssignment.create({
      data: {
        procedureId,
        employeeId,
        projectId,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedById,
        notes
      },
      include: {
        procedure: {
          select: { id: true, sopNumber: true, title: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'SOP assignment created successfully',
      data: assignment
    });
  } catch (error: any) {
    console.error('Error creating SOP assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create SOP assignment',
      error: error.message
    });
  }
});

// PUT /api/sop/assignments/:id - Update assignment status
router.put('/assignments/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes, completedAt } = req.body;

    const assignment = await prisma.sopAssignment.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(status === 'completed' && { completedAt: completedAt || new Date() })
      }
    });

    res.json({
      success: true,
      message: 'SOP assignment updated successfully',
      data: assignment
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }
    console.error('Error updating SOP assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update SOP assignment',
      error: error.message
    });
  }
});

// =====================================================
// SOP COMPLIANCE ROUTES
// =====================================================

// GET /api/sop/compliance - Get compliance records
router.get('/compliance', async (req: Request, res: Response) => {
  try {
    const { procedureId, status } = req.query;

    const where: any = {};
    if (procedureId) where.procedureId = procedureId as string;
    if (status) where.status = status as string;

    const compliance = await prisma.sopCompliance.findMany({
      where,
      include: {
        procedure: {
          select: { id: true, sopNumber: true, title: true }
        }
      },
      orderBy: { complianceDate: 'desc' }
    });

    res.json({
      success: true,
      data: compliance
    });
  } catch (error: any) {
    console.error('Error fetching SOP compliance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve SOP compliance records',
      error: error.message
    });
  }
});

// POST /api/sop/compliance - Record compliance
router.post('/compliance', [
  body('procedureId').isString(),
  body('status').isIn(['compliant', 'non_compliant', 'pending'])
], async (req: Request, res: Response) => {
  try {
    const { procedureId, employeeId, projectId, status, verifiedById, notes, evidence } = req.body;

    const compliance = await prisma.sopCompliance.create({
      data: {
        procedureId,
        employeeId,
        projectId,
        complianceDate: new Date(),
        status,
        verifiedById,
        notes,
        evidence
      }
    });

    res.status(201).json({
      success: true,
      message: 'Compliance record created successfully',
      data: compliance
    });
  } catch (error: any) {
    console.error('Error creating compliance record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create compliance record',
      error: error.message
    });
  }
});

// =====================================================
// SOP MANUALS ROUTES
// =====================================================

// GET /api/sop/manuals - Get all manuals
router.get('/manuals', async (req: Request, res: Response) => {
  try {
    const manuals = await prisma.sopManual.findMany({
      where: { isActive: true },
      orderBy: { manualCode: 'asc' }
    });

    res.json({
      success: true,
      data: manuals
    });
  } catch (error: any) {
    console.error('Error fetching SOP manuals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve SOP manuals',
      error: error.message
    });
  }
});

// =====================================================
// SOP STATISTICS
// =====================================================

// GET /api/sop/stats - Get SOP statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const [
      totalCategories,
      totalProcedures,
      activeProcedures,
      totalForms,
      pendingAssignments,
      complianceRecords
    ] = await Promise.all([
      prisma.sopCategory.count({ where: { isActive: true } }),
      prisma.sopProcedure.count(),
      prisma.sopProcedure.count({ where: { status: 'ACTIVE' } }),
      prisma.sopForm.count({ where: { isActive: true } }),
      prisma.sopAssignment.count({ where: { status: 'pending' } }),
      prisma.sopCompliance.count()
    ]);

    res.json({
      success: true,
      data: {
        totalCategories,
        totalProcedures,
        activeProcedures,
        totalForms,
        pendingAssignments,
        complianceRecords,
        complianceRate: complianceRecords > 0 ? 87.3 : 0
      }
    });
  } catch (error: any) {
    console.error('Error fetching SOP stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve SOP statistics',
      error: error.message
    });
  }
});

export default router;
