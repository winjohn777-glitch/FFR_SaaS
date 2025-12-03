import { PrismaClient } from './generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  try {
    // Create organization
    console.log('📊 Creating organization...');
    const organization = await prisma.organization.create({
      data: {
        legalName: process.env.DEFAULT_ORG_NAME || 'Florida First Roofing LLC',
        tradeName: 'Florida First Roofing',
        taxId: process.env.DEFAULT_ORG_TAX_ID || 'CCC1336561',
        baseCurrency: 'USD',
        country: 'USA',
        state: 'Florida',
        timeZone: 'America/New_York',
        fiscalYearStartMonth: 1
      }
    });

    // Create roles
    console.log('👥 Creating roles...');
    const adminRole = await prisma.role.create({
      data: {
        id: 'admin',
        description: 'Administrator with full system access'
      }
    });

    const accountantRole = await prisma.role.create({
      data: {
        id: 'accountant',
        description: 'Accountant with financial management access'
      }
    });

    // Create fiscal year and periods
    console.log('📅 Creating fiscal year...');
    const currentYear = new Date().getFullYear();
    const fiscalYear = await prisma.fiscalYear.create({
      data: {
        organizationId: organization.id,
        year: currentYear,
        status: FiscalYearStatus.OPEN
      }
    });

    // Create 12 monthly periods
    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(currentYear, month - 1, 1);
      const endDate = new Date(currentYear, month, 0);

      await prisma.fiscalPeriod.create({
        data: {
          fiscalYearId: fiscalYear.id,
          periodNumber: month,
          startDate,
          endDate,
          status: FiscalPeriodStatus.OPEN
        }
      });
    }

    // Create default admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.create({
      data: {
        organizationId: organization.id,
        name: 'System Administrator',
        email: 'admin@floridafirstroofing.com',
        passwordHash: hashedPassword,
        roleId: adminRole.id,
        isActive: true
      }
    });

    // Create Chart of Accounts for Roofing Business
    console.log('📋 Creating chart of accounts...');

    // ASSETS
    const checkingAccount = await prisma.account.create({
      data: {
        organizationId: organization.id,
        code: '1010',
        name: 'Checking Account',
        description: 'Primary business checking account',
        type: AccountType.ASSET,
        normalBalance: NormalBalance.DEBIT,
        isBankAccount: true
      }
    });

    const savingsAccount = await prisma.account.create({
      data: {
        organizationId: organization.id,
        code: '1020',
        name: 'Savings Account',
        description: 'Business savings account',
        type: AccountType.ASSET,
        normalBalance: NormalBalance.DEBIT,
        isBankAccount: true
      }
    });

    const accountsReceivable = await prisma.account.create({
      data: {
        organizationId: organization.id,
        code: '1200',
        name: 'Accounts Receivable',
        description: 'Customer invoices pending payment',
        type: AccountType.ASSET,
        normalBalance: NormalBalance.DEBIT
      }
    });

    const inventory = await prisma.account.create({
      data: {
        organizationId: organization.id,
        code: '1300',
        name: 'Roofing Materials Inventory',
        description: 'Shingles, nails, underlayment, and roofing materials',
        type: AccountType.ASSET,
        normalBalance: NormalBalance.DEBIT
      }
    });

    const equipment = await prisma.account.create({
      data: {
        organizationId: organization.id,
        code: '1500',
        name: 'Equipment',
        description: 'Roofing tools and equipment',
        type: AccountType.ASSET,
        normalBalance: NormalBalance.DEBIT
      }
    });

    const vehicles = await prisma.account.create({
      data: {
        organizationId: organization.id,
        code: '1600',
        name: 'Vehicles',
        description: 'Company trucks and vehicles',
        type: AccountType.ASSET,
        normalBalance: NormalBalance.DEBIT
      }
    });

    // LIABILITIES
    const accountsPayable = await prisma.account.create({
      data: {
        organizationId: organization.id,
        code: '2000',
        name: 'Accounts Payable',
        description: 'Vendor bills pending payment',
        type: AccountType.LIABILITY,
        normalBalance: NormalBalance.CREDIT
      }
    });

    const vehicleLoan = await prisma.account.create({
      data: {
        organizationId: organization.id,
        code: '2100',
        name: 'Vehicle Loan',
        description: 'Truck and vehicle financing',
        type: AccountType.LIABILITY,
        normalBalance: NormalBalance.CREDIT
      }
    });

    const equipmentLoan = await prisma.account.create({
      data: {
        organizationId: organization.id,
        code: '2200',
        name: 'Equipment Loan',
        description: 'Equipment financing',
        type: AccountType.LIABILITY,
        normalBalance: NormalBalance.CREDIT
      }
    });

    // EQUITY
    const ownersEquity = await prisma.account.create({
      data: {
        organizationId: organization.id,
        code: '3000',
        name: "Owner's Equity",
        description: "Owner's investment and retained earnings",
        type: AccountType.EQUITY,
        normalBalance: NormalBalance.CREDIT
      }
    });

    // REVENUE
    const roofingRevenue = await prisma.account.create({
      data: {
        organizationId: organization.id,
        code: '4000',
        name: 'Roofing Services Revenue',
        description: 'Income from roofing installations and repairs',
        type: AccountType.REVENUE,
        normalBalance: NormalBalance.CREDIT
      }
    });

    const gutterRevenue = await prisma.account.create({
      data: {
        organizationId: organization.id,
        code: '4100',
        name: 'Gutter Services Revenue',
        description: 'Income from gutter installation and cleaning',
        type: AccountType.REVENUE,
        normalBalance: NormalBalance.CREDIT
      }
    });

    // EXPENSES
    const rentExpense = await prisma.account.create({
      data: {
        organizationId: organization.id,
        code: '6100',
        name: 'Rent Expense',
        description: 'Office and warehouse rent',
        type: AccountType.EXPENSE,
        normalBalance: NormalBalance.DEBIT
      }
    });

    const insuranceExpense = await prisma.account.create({
      data: {
        organizationId: organization.id,
        code: '6200',
        name: 'Insurance Expense',
        description: 'Liability and vehicle insurance',
        type: AccountType.EXPENSE,
        normalBalance: NormalBalance.DEBIT
      }
    });

    const fuelExpense = await prisma.account.create({
      data: {
        organizationId: organization.id,
        code: '6250',
        name: 'Fuel Expense',
        description: 'Vehicle fuel and transportation costs',
        type: AccountType.EXPENSE,
        normalBalance: NormalBalance.DEBIT
      }
    });

    const utilitiesExpense = await prisma.account.create({
      data: {
        organizationId: organization.id,
        code: '6300',
        name: 'Utilities Expense',
        description: 'Electric, water, phone, internet',
        type: AccountType.EXPENSE,
        normalBalance: NormalBalance.DEBIT
      }
    });

    const laborExpense = await prisma.account.create({
      data: {
        organizationId: organization.id,
        code: '6400',
        name: 'Labor Expense',
        description: 'Employee wages and contractor payments',
        type: AccountType.EXPENSE,
        normalBalance: NormalBalance.DEBIT
      }
    });

    // Create sample contacts
    console.log('👥 Creating sample contacts...');

    await prisma.contact.create({
      data: {
        organizationId: organization.id,
        name: 'ABC Roofing Supplies',
        type: ContactType.VENDOR,
        email: 'orders@abcroofing.com',
        phone: '(555) 123-4567',
        billingAddress: '123 Industrial Blvd, Miami, FL 33101'
      }
    });

    await prisma.contact.create({
      data: {
        organizationId: organization.id,
        name: 'Home Depot Pro',
        type: ContactType.VENDOR,
        email: 'pro@homedepot.com',
        phone: '(555) 987-6543'
      }
    });

    await prisma.contact.create({
      data: {
        organizationId: organization.id,
        name: 'Johnson Family',
        type: ContactType.CUSTOMER,
        email: 'mike.johnson@email.com',
        phone: '(555) 555-0123',
        billingAddress: '456 Oak Street, Tampa, FL 33602'
      }
    });

    console.log('✅ Seed completed successfully!');
    console.log(`📊 Organization: ${organization.legalName}`);
    console.log(`👤 Admin user: ${adminUser.email}`);
    console.log(`🔑 Password: admin123`);
    console.log(`📋 Chart of accounts created with ${await prisma.account.count()} accounts`);

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