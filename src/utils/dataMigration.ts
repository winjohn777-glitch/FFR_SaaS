/**
 * Data Migration Utility
 * Migrates localStorage data to database storage
 *
 * Created by: Winston <winstonj@floridafirstroofing.com>
 */

import apiClient from '../services/ApiClient';

export interface MigrationReport {
  success: boolean;
  migratedCounts: {
    customers: number;
    leads: number;
    opportunities: number;
    jobs: number;
    inventory: number;
    invoices: number;
    transactions: number;
    journalEntries: number;
    accounts: number;
    documents: number;
  };
  errors: string[];
  warnings: string[];
}

/**
 * Main migration function to transfer all localStorage data to database
 */
export async function migrateLocalStorageToDatabase(): Promise<MigrationReport> {
  const report: MigrationReport = {
    success: false,
    migratedCounts: {
      customers: 0,
      leads: 0,
      opportunities: 0,
      jobs: 0,
      inventory: 0,
      invoices: 0,
      transactions: 0,
      journalEntries: 0,
      accounts: 0,
      documents: 0
    },
    errors: [],
    warnings: []
  };

  try {
    console.log('🚀 Starting localStorage to database migration...');

    // Set organization ID for API calls
    apiClient.setOrganizationId('cmioq8ubf0000s920rbdmrn6i');

    // Migrate customers
    await migrateCustomers(report);

    // Migrate leads
    await migrateLeads(report);

    // Migrate opportunities
    await migrateOpportunities(report);

    // Migrate jobs
    await migrateJobs(report);

    // Migrate inventory
    await migrateInventory(report);

    // Migrate transactions
    await migrateTransactions(report);

    // Note: invoices, journalEntries, accounts, and documents would need
    // corresponding API endpoints to be implemented first

    report.success = true;
    console.log('✅ Migration completed successfully', report);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    report.errors.push(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return report;
}

async function migrateCustomers(report: MigrationReport): Promise<void> {
  try {
    const customersData = localStorage.getItem('ffr-customers');
    if (!customersData) {
      report.warnings.push('No customers data found in localStorage');
      return;
    }

    const customers = JSON.parse(customersData);
    console.log(`📋 Migrating ${customers.length} customers...`);

    for (const customer of customers) {
      try {
        const response = await apiClient.post('/api/customers', customer);
        if (response.data) {
          report.migratedCounts.customers++;
        }
      } catch (error) {
        console.error('Error migrating customer:', customer.id, error);
        report.errors.push(`Failed to migrate customer ${customer.id}`);
      }
    }
  } catch (error) {
    report.errors.push(`Customer migration error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}

async function migrateLeads(report: MigrationReport): Promise<void> {
  try {
    const leadsData = localStorage.getItem('ffr-leads');
    if (!leadsData) {
      report.warnings.push('No leads data found in localStorage');
      return;
    }

    const leads = JSON.parse(leadsData);
    console.log(`📋 Migrating ${leads.length} leads...`);

    for (const lead of leads) {
      try {
        const response = await apiClient.post('/api/leads', lead);
        if (response.data) {
          report.migratedCounts.leads++;
        }
      } catch (error) {
        console.error('Error migrating lead:', lead.id, error);
        report.errors.push(`Failed to migrate lead ${lead.id}`);
      }
    }
  } catch (error) {
    report.errors.push(`Lead migration error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}

async function migrateOpportunities(report: MigrationReport): Promise<void> {
  try {
    const opportunitiesData = localStorage.getItem('ffr-opportunities');
    if (!opportunitiesData) {
      report.warnings.push('No opportunities data found in localStorage');
      return;
    }

    const opportunities = JSON.parse(opportunitiesData);
    console.log(`📋 Migrating ${opportunities.length} opportunities...`);

    for (const opportunity of opportunities) {
      try {
        const response = await apiClient.post('/api/opportunities', opportunity);
        if (response.data) {
          report.migratedCounts.opportunities++;
        }
      } catch (error) {
        console.error('Error migrating opportunity:', opportunity.id, error);
        report.errors.push(`Failed to migrate opportunity ${opportunity.id}`);
      }
    }
  } catch (error) {
    report.errors.push(`Opportunity migration error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}

async function migrateJobs(report: MigrationReport): Promise<void> {
  try {
    const jobsData = localStorage.getItem('ffr-jobs');
    if (!jobsData) {
      report.warnings.push('No jobs data found in localStorage');
      return;
    }

    const jobs = JSON.parse(jobsData);
    console.log(`📋 Migrating ${jobs.length} jobs...`);

    for (const job of jobs) {
      try {
        const response = await apiClient.post('/api/jobs', job);
        if (response.data) {
          report.migratedCounts.jobs++;
        }
      } catch (error) {
        console.error('Error migrating job:', job.id, error);
        report.errors.push(`Failed to migrate job ${job.id}`);
      }
    }
  } catch (error) {
    report.errors.push(`Job migration error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}

async function migrateInventory(report: MigrationReport): Promise<void> {
  try {
    const inventoryData = localStorage.getItem('ffr-inventory');
    if (!inventoryData) {
      report.warnings.push('No inventory data found in localStorage');
      return;
    }

    const inventory = JSON.parse(inventoryData);
    console.log(`📋 Migrating ${inventory.length} inventory items...`);

    for (const item of inventory) {
      try {
        const response = await apiClient.post('/api/inventory', item);
        if (response.data) {
          report.migratedCounts.inventory++;
        }
      } catch (error) {
        console.error('Error migrating inventory item:', item.id, error);
        report.errors.push(`Failed to migrate inventory item ${item.id}`);
      }
    }
  } catch (error) {
    report.errors.push(`Inventory migration error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}

async function migrateTransactions(report: MigrationReport): Promise<void> {
  try {
    const transactionsData = localStorage.getItem('ffr-transactions');
    if (!transactionsData) {
      report.warnings.push('No transactions data found in localStorage');
      return;
    }

    const transactions = JSON.parse(transactionsData);
    console.log(`📋 Migrating ${transactions.length} transactions...`);

    for (const transaction of transactions) {
      try {
        const response = await apiClient.post('/api/transactions', transaction);
        if (response.data) {
          report.migratedCounts.transactions++;
        }
      } catch (error) {
        console.error('Error migrating transaction:', transaction.id, error);
        report.errors.push(`Failed to migrate transaction ${transaction.id}`);
      }
    }
  } catch (error) {
    report.errors.push(`Transaction migration error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }
}

/**
 * Clear localStorage after successful migration
 */
export function clearMigratedLocalStorageData(): void {
  const keysToRemove = [
    'ffr-customers',
    'ffr-leads',
    'ffr-opportunities',
    'ffr-jobs',
    'ffr-inventory',
    'ffr-invoices',
    'ffr-transactions',
    'ffr-journal-entries',
    'ffr-accounts',
    'ffr-documents',
    'finance-journal-entries',
    'finance-payment-schedules',
    'finance-contracts'
  ];

  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });

  console.log('🧹 Cleared migrated localStorage data');
}

/**
 * Run migration and cleanup
 */
export async function runMigration(): Promise<MigrationReport> {
  const report = await migrateLocalStorageToDatabase();

  if (report.success && report.errors.length === 0) {
    clearMigratedLocalStorageData();
  }

  return report;
}