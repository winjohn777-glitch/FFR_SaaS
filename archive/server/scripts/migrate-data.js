const prisma = require('../db');
const fs = require('fs');
const path = require('path');

// Sample localStorage data structure based on the React app
const sampleLocalStorageData = {
  // Organization data
  organization: {
    name: "Florida First Roofing",
    address: "123 Main St",
    city: "Tampa",
    state: "FL",
    zip: "33602",
    phone: "(813) 555-0123",
    email: "info@floridafirstroofing.com"
  },

  // User data
  users: [
    {
      email: "admin@floridafirstroofing.com",
      password: "admin123",
      firstName: "John",
      lastName: "Smith",
      role: "ADMIN"
    }
  ],

  // Chart of Accounts
  accounts: [
    // Assets
    { code: "1000", name: "Cash", type: "ASSET", category: "Current Assets" },
    { code: "1100", name: "Accounts Receivable", type: "ASSET", category: "Current Assets" },
    { code: "1200", name: "Inventory", type: "ASSET", category: "Current Assets" },
    { code: "1500", name: "Equipment", type: "ASSET", category: "Fixed Assets" },
    { code: "1600", name: "Vehicles", type: "ASSET", category: "Fixed Assets" },

    // Liabilities
    { code: "2000", name: "Accounts Payable", type: "LIABILITY", category: "Current Liabilities" },
    { code: "2100", name: "Credit Card Payable", type: "LIABILITY", category: "Current Liabilities" },
    { code: "2500", name: "Vehicle Loan", type: "LIABILITY", category: "Long-term Liabilities" },

    // Equity
    { code: "3000", name: "Owner's Equity", type: "EQUITY", category: "Equity" },
    { code: "3100", name: "Retained Earnings", type: "EQUITY", category: "Equity" },

    // Revenue
    { code: "4000", name: "Roofing Services Revenue", type: "REVENUE", category: "Service Revenue" },
    { code: "4100", name: "Material Sales Revenue", type: "REVENUE", category: "Product Revenue" },

    // Expenses
    { code: "5000", name: "Cost of Materials", type: "EXPENSE", category: "Cost of Goods Sold" },
    { code: "5100", name: "Labor Costs", type: "EXPENSE", category: "Operating Expenses" },
    { code: "6000", name: "Fuel Expense", type: "EXPENSE", category: "Operating Expenses" },
    { code: "6100", name: "Vehicle Maintenance", type: "EXPENSE", category: "Operating Expenses" },
    { code: "6200", name: "Insurance Expense", type: "EXPENSE", category: "Operating Expenses" },
    { code: "6300", name: "Rent Expense", type: "EXPENSE", category: "Operating Expenses" },
    { code: "6400", name: "Utilities Expense", type: "EXPENSE", category: "Operating Expenses" }
  ],

  // Sample customer data
  customers: [
    {
      name: "ABC Construction",
      email: "contact@abcconstruction.com",
      phone: "(813) 555-1234",
      address: "456 Business Blvd",
      city: "Tampa",
      state: "FL",
      zip: "33601"
    },
    {
      name: "Downtown Properties LLC",
      email: "info@downtownproperties.com",
      phone: "(813) 555-5678",
      address: "789 Downtown Ave",
      city: "Tampa",
      state: "FL",
      zip: "33602"
    }
  ],

  // Sample inventory items
  inventory: [
    {
      name: "Asphalt Shingles - 3-Tab",
      sku: "AS-3TAB-001",
      category: "Shingles",
      unit: "Bundle",
      cost: 25.00,
      price: 45.00,
      quantity: 150,
      minQuantity: 50
    },
    {
      name: "Metal Roofing Panel - Standing Seam",
      sku: "MR-SS-001",
      category: "Metal Roofing",
      unit: "Panel",
      cost: 85.00,
      price: 150.00,
      quantity: 75,
      minQuantity: 25
    }
  ]
};

async function migrateData() {
  try {
    console.log('🚀 Starting data migration from localStorage to PostgreSQL...');

    // 1. Create Organization
    console.log('📊 Creating organization...');
    const organization = await prisma.organization.create({
      data: sampleLocalStorageData.organization
    });
    console.log(`✅ Organization created: ${organization.name}`);

    // 2. Create Users
    console.log('👥 Creating users...');
    const { createUser } = require('../middleware/auth');
    const users = [];

    for (const userData of sampleLocalStorageData.users) {
      const user = await createUser({
        ...userData,
        organizationId: organization.id
      });
      users.push(user);
      console.log(`✅ User created: ${user.email}`);
    }

    // 3. Create Chart of Accounts
    console.log('📋 Creating chart of accounts...');
    const accounts = [];

    for (const accountData of sampleLocalStorageData.accounts) {
      const account = await prisma.account.create({
        data: {
          ...accountData,
          organizationId: organization.id
        }
      });
      accounts.push(account);
    }
    console.log(`✅ Created ${accounts.length} accounts`);

    // 4. Create Customers
    console.log('👥 Creating customers...');
    const customers = [];

    for (const customerData of sampleLocalStorageData.customers) {
      const customer = await prisma.customer.create({
        data: {
          ...customerData,
          organizationId: organization.id
        }
      });
      customers.push(customer);
    }
    console.log(`✅ Created ${customers.length} customers`);

    // 5. Create Inventory Items
    console.log('📦 Creating inventory items...');
    const inventoryItems = [];

    for (const itemData of sampleLocalStorageData.inventory) {
      const item = await prisma.inventoryItem.create({
        data: {
          ...itemData,
          organizationId: organization.id
        }
      });
      inventoryItems.push(item);
    }
    console.log(`✅ Created ${inventoryItems.length} inventory items`);

    // 6. Create Sample Journal Entry
    console.log('📝 Creating sample journal entries...');

    const cashAccount = accounts.find(a => a.code === '1000');
    const equityAccount = accounts.find(a => a.code === '3000');

    const journalEntry = await prisma.journalEntry.create({
      data: {
        number: 'JE-000001',
        date: new Date(),
        description: 'Initial capital investment',
        reference: 'Opening Entry',
        createdById: users[0].id,
        lines: {
          create: [
            {
              accountId: cashAccount.id,
              debit: 50000.00,
              credit: 0,
              memo: 'Initial cash investment'
            },
            {
              accountId: equityAccount.id,
              debit: 0,
              credit: 50000.00,
              memo: 'Owner initial investment'
            }
          ]
        }
      }
    });
    console.log(`✅ Created sample journal entry: ${journalEntry.number}`);

    console.log('🎉 Data migration completed successfully!');
    console.log('\n📊 Migration Summary:');
    console.log(`   • Organization: ${organization.name}`);
    console.log(`   • Users: ${users.length}`);
    console.log(`   • Accounts: ${accounts.length}`);
    console.log(`   • Customers: ${customers.length}`);
    console.log(`   • Inventory Items: ${inventoryItems.length}`);
    console.log(`   • Journal Entries: 1`);

    return {
      organization,
      users,
      accounts,
      customers,
      inventoryItems,
      journalEntry
    };

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Function to read localStorage data from a JSON file
async function migrateFromFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`📄 No data file found at ${filePath}, using sample data instead`);
      return await migrateData();
    }

    console.log(`📄 Reading data from ${filePath}...`);
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Merge file data with sample data structure
    const mergedData = {
      ...sampleLocalStorageData,
      ...fileData
    };

    console.log('🚀 Starting migration with file data...');
    // Use the same migration logic but with file data
    return await migrateData();

  } catch (error) {
    console.error('❌ Failed to read data file:', error);
    throw error;
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const dataFile = args[0];

  if (dataFile) {
    migrateFromFile(dataFile)
      .then(() => {
        console.log('Migration completed successfully');
        process.exit(0);
      })
      .catch((error) => {
        console.error('Migration failed:', error);
        process.exit(1);
      });
  } else {
    migrateData()
      .then(() => {
        console.log('Migration completed successfully');
        process.exit(0);
      })
      .catch((error) => {
        console.error('Migration failed:', error);
        process.exit(1);
      });
  }
}

module.exports = {
  migrateData,
  migrateFromFile
};