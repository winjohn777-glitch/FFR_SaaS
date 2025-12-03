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

// GET /api/employees - Get all employees
router.get('/', async (req, res) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    const employees = await prisma.employee.findMany({
      where: { organizationId: organizationId as string },
      include: {
        certifications: true
      },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }]
    });

    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// POST /api/employees - Create new employee
router.post('/', async (req, res) => {
  try {
    const {
      organizationId,
      firstName,
      lastName,
      role,
      department,
      email,
      phone,
      address,
      hireDate,
      employeeId,
      status = 'ACTIVE',
      payRate,
      certifications = []
    } = req.body;

    const userId = req.headers['x-user-id'] as string || 'admin-user-id';
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Ensure organizationId is provided
    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    // Create employee
    const employee = await prisma.employee.create({
      data: {
        organizationId,
        firstName,
        lastName,
        role,
        department,
        email,
        phone,
        address,
        hireDate: new Date(hireDate),
        employeeId,
        status,
        payRate: parseFloat(payRate),
        hoursThisWeek: 0,
        overtime: 0
      },
      include: {
        certifications: true
      }
    });

    // Add certifications if provided
    if (certifications.length > 0) {
      await Promise.all(
        certifications.map((cert: any) =>
          prisma.certification.create({
            data: {
              employeeId: employee.id,
              name: cert.name,
              type: cert.type,
              issueDate: new Date(cert.issueDate),
              expirationDate: new Date(cert.expirationDate),
              certificateNumber: cert.certificateNumber,
              status: cert.status || 'valid'
            }
          })
        )
      );
    }

    // Create audit log - temporarily disabled until AuditLog model is added
    // await createAuditLog(
    //   organizationId,
    //   'EMPLOYEE',
    //   employee.id,
    //   'CREATE',
    //   userId,
    //   null,
    //   employee,
    //   ipAddress,
    //   userAgent
    // );

    // Fetch complete employee with certifications
    const completeEmployee = await prisma.employee.findUnique({
      where: { id: employee.id },
      include: {
        certifications: true
      }
    });

    res.status(201).json(completeEmployee);
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// PUT /api/employees/:id - Update employee
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Get current employee for audit trail
    const currentEmployee = await prisma.employee.findUnique({
      where: { id },
      include: { certifications: true, trainingSessions: true }
    });

    if (!currentEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Prepare update data
    const updateData: any = { ...updates };
    if (updates.hireDate) {
      updateData.hireDate = new Date(updates.hireDate);
    }
    if (updates.payRate) {
      updateData.payRate = parseFloat(updates.payRate);
    }
    if (updates.hoursThisWeek !== undefined) {
      updateData.hoursThisWeek = parseFloat(updates.hoursThisWeek);
    }
    if (updates.overtime !== undefined) {
      updateData.overtime = parseFloat(updates.overtime);
    }

    // Update employee
    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: updateData,
      include: {
        certifications: true
      }
    });

    // Create audit log
    await createAuditLog(
      currentEmployee.organizationId,
      'EMPLOYEE',
      id,
      'UPDATE',
      userId,
      currentEmployee,
      updatedEmployee,
      ipAddress,
      userAgent
    );

    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// DELETE /api/employees/:id - Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.headers['x-user-id'] as string;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Get employee for audit trail
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: { certifications: true, trainingSessions: true }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Delete employee (cascade will handle certifications and training sessions)
    await prisma.employee.delete({
      where: { id }
    });

    // Create audit log
    await createAuditLog(
      employee.organizationId,
      'EMPLOYEE',
      id,
      'DELETE',
      userId,
      employee,
      null,
      ipAddress,
      userAgent
    );

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

export default router;