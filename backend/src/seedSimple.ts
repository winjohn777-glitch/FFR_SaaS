import { PrismaClient } from './generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting simple seed...');

  try {
    // Create organization
    console.log('📊 Creating organization...');
    const organization = await prisma.organization.create({
      data: {
        name: 'Florida First Roofing LLC',
        address: '123 Business Blvd, Orlando, FL 32801',
        phone: '(407) 555-0123',
        email: 'office@floridafirstroofing.com'
      }
    });

    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.create({
      data: {
        organizationId: organization.id,
        firstName: 'System',
        lastName: 'Administrator',
        email: 'admin@floridafirstroofing.com',
        passwordHash: hashedPassword,
        role: 'ADMIN',
        isActive: true
      }
    });

    // Create fiscal periods for current year
    console.log('📅 Creating fiscal periods...');
    const currentYear = new Date().getFullYear();

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(currentYear, month - 1, 1);
      const endDate = new Date(currentYear, month, 0);
      const monthName = startDate.toLocaleString('default', { month: 'long' });

      await prisma.fiscalPeriod.create({
        data: {
          organizationId: organization.id,
          name: `${monthName} ${currentYear}`,
          type: 'MONTH',
          startDate,
          endDate,
          year: currentYear,
          period: month
        }
      });
    }

    // Create basic chart of accounts
    console.log('📋 Creating chart of accounts...');

    // Assets
    const checkingAccount = await prisma.account.create({
      data: {
        organizationId: organization.id,
        code: '1010',
        name: 'Checking Account',
        description: 'Primary business checking account',
        type: 'ASSET',
        category: 'Cash and Cash Equivalents',
        isActive: true
      }
    });

    const accountsReceivable = await prisma.account.create({
      data: {
        organizationId: organization.id,
        code: '1200',
        name: 'Accounts Receivable',
        description: 'Customer invoices pending payment',
        type: 'ASSET',
        category: 'Current Assets',
        isActive: true
      }
    });

    // Liabilities
    const accountsPayable = await prisma.account.create({
      data: {
        organizationId: organization.id,
        code: '2000',
        name: 'Accounts Payable',
        description: 'Vendor bills pending payment',
        type: 'LIABILITY',
        category: 'Current Liabilities',
        isActive: true
      }
    });

    // Equity
    const ownersEquity = await prisma.account.create({
      data: {
        organizationId: organization.id,
        code: '3000',
        name: "Owner's Equity",
        description: "Owner's investment and retained earnings",
        type: 'EQUITY',
        category: 'Equity',
        isActive: true
      }
    });

    // Revenue
    const roofingRevenue = await prisma.account.create({
      data: {
        organizationId: organization.id,
        code: '4000',
        name: 'Roofing Services Revenue',
        description: 'Income from roofing installations and repairs',
        type: 'REVENUE',
        category: 'Service Revenue',
        isActive: true
      }
    });

    // Expenses
    const laborExpense = await prisma.account.create({
      data: {
        organizationId: organization.id,
        code: '6400',
        name: 'Labor Expense',
        description: 'Employee wages and contractor payments',
        type: 'EXPENSE',
        category: 'Operating Expenses',
        isActive: true
      }
    });

    // Create sample contacts
    console.log('👥 Creating sample contacts...');

    await prisma.contact.create({
      data: {
        organizationId: organization.id,
        name: 'ABC Roofing Supplies',
        type: 'VENDOR',
        email: 'orders@abcroofing.com',
        phone: '(555) 123-4567',
        address: '123 Industrial Blvd',
        city: 'Miami',
        state: 'FL',
        zip: '33101'
      }
    });

    await prisma.contact.create({
      data: {
        organizationId: organization.id,
        name: 'Johnson Family',
        type: 'CUSTOMER',
        email: 'mike.johnson@email.com',
        phone: '(555) 555-0123',
        address: '456 Oak Street',
        city: 'Tampa',
        state: 'FL',
        zip: '33602'
      }
    });

    console.log('✅ Simple seed completed successfully!');
    console.log(`📊 Organization: ${organization.name}`);
    console.log(`👤 Admin user: ${adminUser.email}`);
    console.log(`🔑 Password: admin123`);
    console.log(`📋 Chart of accounts created with ${await prisma.account.count()} accounts`);
    console.log(`📅 Created 12 fiscal periods for ${currentYear}`);

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });