import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

// Sample employee data from localStorage (converted from DataContext)
const sampleEmployees = [
  {
    id: '1',
    firstName: 'Miguel',
    lastName: 'Rodriguez',
    role: 'Lead Roofer',
    department: 'Operations',
    email: 'miguel.rodriguez@floridafirstroofing.com',
    phone: '321-555-0101',
    address: '123 Orange Ave, Melbourne, FL 32901',
    hireDate: '2023-01-15',
    employeeId: 'FFR001',
    status: 'active',
    payRate: 28.50,
    certifications: [
      {
        name: 'OSHA 1926 Fall Protection',
        type: 'OSHA',
        issueDate: '2023-02-01',
        expirationDate: '2026-02-01',
        certNumber: 'FP-2023-001',
        status: 'valid'
      },
      {
        name: 'Florida State Roofing License',
        type: 'State License',
        issueDate: '2022-12-15',
        expirationDate: '2024-12-15',
        certNumber: 'FL-RF-45678',
        status: 'expiring'
      }
    ]
  },
  {
    id: '2',
    firstName: 'Carlos',
    lastName: 'Mendez',
    role: 'Roofer',
    department: 'Operations',
    email: 'carlos.mendez@floridafirstroofing.com',
    phone: '321-555-0102',
    address: '456 Palm St, Orlando, FL 32803',
    hireDate: '2023-03-20',
    employeeId: 'FFR002',
    status: 'active',
    payRate: 24.00,
    certifications: [
      {
        name: 'OSHA 1926 Fall Protection',
        type: 'OSHA',
        issueDate: '2023-04-10',
        expirationDate: '2026-04-10',
        certNumber: 'FP-2023-002',
        status: 'valid'
      }
    ]
  },
  {
    id: '3',
    firstName: 'Ana',
    lastName: 'Santos',
    role: 'Safety Inspector',
    department: 'Safety',
    email: 'ana.santos@floridafirstroofing.com',
    phone: '321-555-0103',
    address: '789 Miami Ave, Tampa, FL 33601',
    hireDate: '2022-08-10',
    employeeId: 'FFR003',
    status: 'active',
    payRate: 32.00,
    certifications: [
      {
        name: 'OSHA 30-Hour Construction',
        type: 'OSHA',
        issueDate: '2022-09-01',
        expirationDate: '2025-09-01',
        certNumber: 'OSH30-2022-005',
        status: 'valid'
      },
      {
        name: 'Certified Safety Professional',
        type: 'Safety Training',
        issueDate: '2022-10-15',
        expirationDate: '2025-10-15',
        certNumber: 'CSP-2022-FL-089',
        status: 'valid'
      }
    ]
  },
  {
    id: '4',
    firstName: 'Roberto',
    lastName: 'Silva',
    role: 'Apprentice Roofer',
    department: 'Operations',
    email: 'roberto.silva@floridafirstroofing.com',
    phone: '321-555-0104',
    address: '321 Beach Blvd, Daytona Beach, FL 32118',
    hireDate: '2024-01-08',
    employeeId: 'FFR004',
    status: 'active',
    payRate: 18.50,
    certifications: [
      {
        name: 'Basic Safety Training',
        type: 'Safety Training',
        issueDate: '2024-01-15',
        expirationDate: '2025-01-15',
        certNumber: 'BST-2024-001',
        status: 'valid'
      }
    ]
  },
  {
    id: '5',
    firstName: 'Elena',
    lastName: 'Morales',
    role: 'Project Coordinator',
    department: 'Administration',
    email: 'elena.morales@floridafirstroofing.com',
    phone: '321-555-0105',
    address: '654 Coral Way, Miami, FL 33145',
    hireDate: '2023-06-12',
    employeeId: 'FFR005',
    status: 'active',
    payRate: 26.00,
    certifications: [
      {
        name: 'Project Management Professional',
        type: 'Technical',
        issueDate: '2023-07-01',
        expirationDate: '2026-07-01',
        certNumber: 'PMP-2023-FL-001',
        status: 'valid'
      }
    ]
  },
  {
    id: '6',
    firstName: 'Luis',
    lastName: 'Herrera',
    role: 'Quality Control Inspector',
    department: 'Operations',
    email: 'luis.herrera@floridafirstroofing.com',
    phone: '321-555-0106',
    address: '987 Sunshine Blvd, Jacksonville, FL 32205',
    hireDate: '2022-11-30',
    employeeId: 'FFR006',
    status: 'active',
    payRate: 29.50,
    certifications: [
      {
        name: 'Quality Control Certification',
        type: 'Technical',
        issueDate: '2023-01-10',
        expirationDate: '2026-01-10',
        certNumber: 'QC-2023-001',
        status: 'valid'
      },
      {
        name: 'Florida Building Inspector License',
        type: 'State License',
        issueDate: '2022-12-01',
        expirationDate: '2024-12-01',
        certNumber: 'FL-BI-12345',
        status: 'expiring'
      }
    ]
  }
];

async function migrateHRData() {
  try {
    console.log('🚀 Starting HR data migration to PostgreSQL...');

    // Get or create default organization
    let organization = await prisma.organization.findFirst();

    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          legalName: process.env.DEFAULT_ORG_NAME || "Florida First Roofing LLC",
          taxId: process.env.DEFAULT_ORG_TAX_ID || "CCC1336561",
          baseCurrency: process.env.DEFAULT_ORG_CURRENCY || "USD",
          timeZone: process.env.DEFAULT_ORG_TIMEZONE || "America/New_York"
        }
      });
      console.log('✅ Created default organization');
    }

    // Create a default admin user for audit logs
    let adminUser = await prisma.user.findFirst({
      where: { email: 'admin@floridafirstroofing.com' }
    });

    if (!adminUser) {
      // Create admin role if it doesn't exist
      let adminRole = await prisma.role.findUnique({
        where: { id: 'ADMIN' }
      });

      if (!adminRole) {
        adminRole = await prisma.role.create({
          data: {
            id: 'ADMIN',
            description: 'System Administrator'
          }
        });
      }

      adminUser = await prisma.user.create({
        data: {
          organizationId: organization.id,
          name: 'System Administrator',
          email: 'admin@floridafirstroofing.com',
          passwordHash: 'temp-hash', // Will be set during proper auth setup
          roleId: adminRole.id,
          isActive: true
        }
      });
      console.log('✅ Created default admin user for audit logs');
    }

    // Migrate employees and certifications
    let employeeCount = 0;
    let certificationCount = 0;

    for (const empData of sampleEmployees) {
      // Check if employee already exists
      const existingEmployee = await prisma.employee.findFirst({
        where: {
          organizationId: organization.id,
          employeeId: empData.employeeId
        }
      });

      if (existingEmployee) {
        console.log(`⏭️ Employee ${empData.employeeId} already exists, skipping...`);
        continue;
      }

      // Create employee
      const employee = await prisma.employee.create({
        data: {
          organizationId: organization.id,
          firstName: empData.firstName,
          lastName: empData.lastName,
          role: empData.role,
          department: empData.department,
          email: empData.email,
          phone: empData.phone,
          address: empData.address,
          hireDate: new Date(empData.hireDate),
          employeeId: empData.employeeId,
          status: empData.status,
          payRate: empData.payRate,
          hoursThisWeek: 40, // Default
          overtimeHours: 0
        }
      });

      employeeCount++;
      console.log(`👤 Created employee: ${empData.firstName} ${empData.lastName} (${empData.employeeId})`);

      // Create certifications for this employee
      for (const certData of empData.certifications) {
        await prisma.certification.create({
          data: {
            organizationId: organization.id,
            employeeId: employee.id,
            name: certData.name,
            type: certData.type,
            issueDate: new Date(certData.issueDate),
            expirationDate: new Date(certData.expirationDate),
            certNumber: certData.certNumber,
            status: certData.status
          }
        });

        certificationCount++;
        console.log(`📜 Added certification: ${certData.name} for ${empData.firstName} ${empData.lastName}`);
      }

      // Create audit log for employee creation
      await prisma.auditLog.create({
        data: {
          organizationId: organization.id,
          entityType: 'EMPLOYEE',
          entityId: employee.id,
          action: 'CREATE',
          changedByUserId: adminUser.id,
          afterSnapshot: JSON.stringify(employee),
          ipAddress: '127.0.0.1',
          userAgent: 'Data Migration Script'
        }
      });
    }

    // Create some sample training sessions
    const trainingTypes = [
      'Fall Protection Refresher',
      'OSHA 10-Hour Construction',
      'Heat Illness Prevention',
      'Tool Safety Inspection',
      'Ladder Safety Training',
      'Personal Protective Equipment'
    ];

    const employees = await prisma.employee.findMany({
      where: { organizationId: organization.id }
    });

    let trainingCount = 0;

    // Create upcoming training sessions for each employee
    for (const employee of employees) {
      // Create 1-2 training sessions for each employee
      const sessionsToCreate = Math.floor(Math.random() * 2) + 1;

      for (let i = 0; i < sessionsToCreate; i++) {
        const randomTraining = trainingTypes[Math.floor(Math.random() * trainingTypes.length)];
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1); // 1-30 days from now

        await prisma.trainingSession.create({
          data: {
            organizationId: organization.id,
            employeeId: employee.id,
            employeeName: `${employee.firstName} ${employee.lastName}`,
            type: randomTraining,
            priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
            date: futureDate,
            time: ['9:00 AM', '10:00 AM', '2:00 PM'][Math.floor(Math.random() * 3)],
            duration: '2 hours',
            location: 'Training Room A',
            instructor: 'Safety Director',
            notes: `Scheduled ${randomTraining} training session`,
            status: 'scheduled'
          }
        });

        trainingCount++;
      }
    }

    console.log('\n🎉 HR Data Migration Complete!');
    console.log(`📊 Migration Summary:`);
    console.log(`   👥 Employees created: ${employeeCount}`);
    console.log(`   📜 Certifications created: ${certificationCount}`);
    console.log(`   📚 Training sessions created: ${trainingCount}`);
    console.log(`   🏢 Organization: ${organization.legalName}`);
    console.log(`   🔐 Database: PostgreSQL on localhost:5432`);

  } catch (error) {
    console.error('❌ Error during HR data migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateHRData()
    .then(() => {
      console.log('✅ Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

export default migrateHRData;