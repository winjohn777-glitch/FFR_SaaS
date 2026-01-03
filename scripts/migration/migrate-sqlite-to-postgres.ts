/**
 * SQLite to PostgreSQL Data Migration Script
 * Florida First Roofing Accounting System
 *
 * This script migrates data from the SQLite database to PostgreSQL.
 * Run with: npx ts-node scripts/migration/migrate-sqlite-to-postgres.ts
 */

import Database from 'better-sqlite3';
import { PrismaClient } from '../../backend/src/generated/prisma';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

const prisma = new PrismaClient();

// SQLite database paths
const SQLITE_MAIN_DB = path.join(__dirname, '../../database.sqlite');
const SQLITE_ACCOUNTING_DB = path.join(__dirname, '../../database/accounting.db');

interface MigrationResult {
  table: string;
  sourceCount: number;
  migratedCount: number;
  errors: string[];
}

const results: MigrationResult[] = [];

// Helper to generate cuid-like IDs
function generateId(): string {
  return uuidv4().replace(/-/g, '').substring(0, 25);
}

// Helper to convert SQLite datetime to JS Date
function parseDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

// Helper to safely parse JSON
function parseJson(jsonStr: string | null): string | null {
  if (!jsonStr) return null;
  try {
    JSON.parse(jsonStr);
    return jsonStr;
  } catch {
    return JSON.stringify({ raw: jsonStr });
  }
}

async function migrateCountyRequirements(db: Database.Database) {
  console.log('\n📍 Migrating County Requirements...');
  const result: MigrationResult = {
    table: 'county_requirements',
    sourceCount: 0,
    migratedCount: 0,
    errors: []
  };

  try {
    const rows = db.prepare('SELECT * FROM county_requirements').all() as any[];
    result.sourceCount = rows.length;

    for (const row of rows) {
      try {
        await prisma.countyRequirement.upsert({
          where: { county: row.county },
          update: {},
          create: {
            county: row.county,
            permitRequired: row.permit_required === 1,
            permitOfficeName: row.permit_office_name,
            permitOfficePhone: row.permit_office_phone,
            permitOfficeAddress: row.permit_office_address,
            permitFeesRange: row.permit_fees_range,
            inspectionProcess: parseJson(row.inspection_process),
            hvhzZone: row.hvhz_zone === 1,
            specialRequirements: parseJson(row.special_requirements),
            notes: row.notes,
          }
        });
        result.migratedCount++;
      } catch (err: any) {
        result.errors.push(`Row ${row.id}: ${err.message}`);
      }
    }
  } catch (err: any) {
    result.errors.push(`Table error: ${err.message}`);
  }

  results.push(result);
  console.log(`   ✓ Migrated ${result.migratedCount}/${result.sourceCount} records`);
}

async function migrateMarketingCampaigns(db: Database.Database) {
  console.log('\n📢 Migrating Marketing Campaigns...');
  const result: MigrationResult = {
    table: 'marketing_campaigns',
    sourceCount: 0,
    migratedCount: 0,
    errors: []
  };

  try {
    const rows = db.prepare('SELECT * FROM marketing_campaigns').all() as any[];
    result.sourceCount = rows.length;

    for (const row of rows) {
      try {
        await prisma.marketingCampaign.upsert({
          where: { campaignId: row.campaign_id },
          update: {},
          create: {
            campaignId: row.campaign_id,
            name: row.name,
            type: row.type,
            status: row.status || 'active',
            budget: row.budget,
            costPerLead: row.cost_per_lead,
            targetCounties: parseJson(row.target_counties),
            targetServices: parseJson(row.target_services),
            startDate: parseDate(row.start_date),
            endDate: parseDate(row.end_date),
            leadsGenerated: row.leads_generated || 0,
            conversions: row.conversions || 0,
            revenueGenerated: row.revenue_generated,
            roiPercentage: row.roi_percentage,
            metadata: parseJson(row.metadata),
          }
        });
        result.migratedCount++;
      } catch (err: any) {
        result.errors.push(`Row ${row.id}: ${err.message}`);
      }
    }
  } catch (err: any) {
    result.errors.push(`Table error: ${err.message}`);
  }

  results.push(result);
  console.log(`   ✓ Migrated ${result.migratedCount}/${result.sourceCount} records`);
}

async function migrateSopWorkflows(db: Database.Database) {
  console.log('\n🔄 Migrating SOP Workflows...');
  const result: MigrationResult = {
    table: 'sop_workflows',
    sourceCount: 0,
    migratedCount: 0,
    errors: []
  };

  try {
    const rows = db.prepare('SELECT * FROM sop_workflows').all() as any[];
    result.sourceCount = rows.length;

    // First, we need a default SOP procedure to link to
    // In a real migration, you'd map sop_id to actual procedure IDs

    for (const row of rows) {
      try {
        // Skip if no valid procedure reference
        // In production, you'd map these properly
        console.log(`   Skipping workflow ${row.workflow_id} - requires SOP procedure mapping`);
      } catch (err: any) {
        result.errors.push(`Row ${row.id}: ${err.message}`);
      }
    }
  } catch (err: any) {
    result.errors.push(`Table error: ${err.message}`);
  }

  results.push(result);
  console.log(`   ⚠ Workflows require manual SOP procedure ID mapping`);
}

async function migrateLeadAssignments(db: Database.Database) {
  console.log('\n👥 Migrating Lead Assignments...');
  const result: MigrationResult = {
    table: 'lead_assignments',
    sourceCount: 0,
    migratedCount: 0,
    errors: []
  };

  try {
    const rows = db.prepare('SELECT * FROM lead_assignments').all() as any[];
    result.sourceCount = rows.length;

    for (const row of rows) {
      try {
        await prisma.leadAssignment.create({
          data: {
            leadId: row.lead_id,
            customerId: row.customer_id?.toString(),
            projectId: row.project_id?.toString(),
            salesRep: row.sales_rep,
            projectManager: row.project_manager,
            estimator: row.estimator,
            assignmentDate: parseDate(row.assignment_date) || new Date(),
            assignmentRules: parseJson(row.assignment_rules),
            reassignmentHistory: parseJson(row.reassignment_history),
            status: row.status || 'active',
          }
        });
        result.migratedCount++;
      } catch (err: any) {
        result.errors.push(`Row ${row.id}: ${err.message}`);
      }
    }
  } catch (err: any) {
    result.errors.push(`Table error: ${err.message}`);
  }

  results.push(result);
  console.log(`   ✓ Migrated ${result.migratedCount}/${result.sourceCount} records`);
}

async function migrateLeadAnalytics(db: Database.Database) {
  console.log('\n📊 Migrating Lead Analytics...');
  const result: MigrationResult = {
    table: 'lead_analytics',
    sourceCount: 0,
    migratedCount: 0,
    errors: []
  };

  try {
    const rows = db.prepare('SELECT * FROM lead_analytics').all() as any[];
    result.sourceCount = rows.length;

    for (const row of rows) {
      try {
        await prisma.leadAnalytics.create({
          data: {
            leadId: row.lead_id,
            customerId: row.customer_id?.toString(),
            projectId: row.project_id?.toString(),
            leadSource: row.lead_source,
            serviceType: row.service_type,
            county: row.county,
            urgency: row.urgency,
            estimatedValue: row.estimated_value,
            actualValue: row.actual_value,
            leadScore: row.lead_score || 0,
            conversionStatus: row.conversion_status || 'new',
            conversionDate: parseDate(row.conversion_date),
            conversionValue: row.conversion_value,
            timeToContactMinutes: row.time_to_contact_minutes,
            timeToConversionHours: row.time_to_conversion_hours,
            touchpoints: row.touchpoints || 0,
            marketingCampaign: row.marketing_campaign,
            referrerUrl: row.referrer_url,
            deviceType: row.device_type,
          }
        });
        result.migratedCount++;
      } catch (err: any) {
        result.errors.push(`Row ${row.id}: ${err.message}`);
      }
    }
  } catch (err: any) {
    result.errors.push(`Table error: ${err.message}`);
  }

  results.push(result);
  console.log(`   ✓ Migrated ${result.migratedCount}/${result.sourceCount} records`);
}

async function migrateCustomerCommunications(db: Database.Database) {
  console.log('\n💬 Migrating Customer Communications...');
  const result: MigrationResult = {
    table: 'customer_communications',
    sourceCount: 0,
    migratedCount: 0,
    errors: []
  };

  try {
    const rows = db.prepare('SELECT * FROM customer_communications').all() as any[];
    result.sourceCount = rows.length;

    for (const row of rows) {
      try {
        await prisma.customerCommunication.create({
          data: {
            customerId: row.customer_id.toString(),
            leadId: row.lead_id,
            projectId: row.project_id?.toString(),
            communicationType: row.communication_type,
            direction: row.direction,
            subject: row.subject,
            content: row.content,
            channel: row.channel,
            fromContact: row.from_contact,
            toContact: row.to_contact,
            durationMinutes: row.duration_minutes,
            outcome: row.outcome,
            followUpRequired: row.follow_up_required === 1,
            followUpDate: parseDate(row.follow_up_date),
            attachments: parseJson(row.attachments),
            metadata: parseJson(row.metadata),
          }
        });
        result.migratedCount++;
      } catch (err: any) {
        result.errors.push(`Row ${row.id}: ${err.message}`);
      }
    }
  } catch (err: any) {
    result.errors.push(`Table error: ${err.message}`);
  }

  results.push(result);
  console.log(`   ✓ Migrated ${result.migratedCount}/${result.sourceCount} records`);
}

async function migrateNotifications(db: Database.Database) {
  console.log('\n🔔 Migrating Notifications...');
  const result: MigrationResult = {
    table: 'notifications',
    sourceCount: 0,
    migratedCount: 0,
    errors: []
  };

  try {
    const rows = db.prepare('SELECT * FROM notifications').all() as any[];
    result.sourceCount = rows.length;

    for (const row of rows) {
      try {
        await prisma.notification.upsert({
          where: { notificationId: row.notification_id },
          update: {},
          create: {
            notificationId: row.notification_id,
            type: row.type,
            title: row.title,
            message: row.message,
            urgency: row.urgency || 'medium',
            recipientType: row.recipient_type,
            recipientId: row.recipient_id,
            channels: parseJson(row.channels),
            leadId: row.lead_id,
            customerId: row.customer_id?.toString(),
            projectId: row.project_id?.toString(),
            workflowId: row.workflow_id,
            metadata: parseJson(row.metadata),
            sentAt: parseDate(row.sent_at),
            readAt: parseDate(row.read_at),
            acknowledgedAt: parseDate(row.acknowledged_at),
          }
        });
        result.migratedCount++;
      } catch (err: any) {
        result.errors.push(`Row ${row.id}: ${err.message}`);
      }
    }
  } catch (err: any) {
    result.errors.push(`Table error: ${err.message}`);
  }

  results.push(result);
  console.log(`   ✓ Migrated ${result.migratedCount}/${result.sourceCount} records`);
}

async function migrateIntegrationLogs(db: Database.Database) {
  console.log('\n📝 Migrating Integration Logs...');
  const result: MigrationResult = {
    table: 'integration_logs',
    sourceCount: 0,
    migratedCount: 0,
    errors: []
  };

  try {
    const rows = db.prepare('SELECT * FROM integration_logs').all() as any[];
    result.sourceCount = rows.length;

    for (const row of rows) {
      try {
        await prisma.integrationLog.create({
          data: {
            eventType: row.event_type,
            eventData: row.event_data || '{}',
            leadId: row.lead_id,
            customerId: row.customer_id?.toString(),
            projectId: row.project_id?.toString(),
            workflowId: row.workflow_id,
            success: row.success === 1,
            errorMessage: row.error_message,
            processingTimeMs: row.processing_time_ms,
            timestamp: parseDate(row.timestamp) || new Date(),
          }
        });
        result.migratedCount++;
      } catch (err: any) {
        result.errors.push(`Row ${row.id}: ${err.message}`);
      }
    }
  } catch (err: any) {
    result.errors.push(`Table error: ${err.message}`);
  }

  results.push(result);
  console.log(`   ✓ Migrated ${result.migratedCount}/${result.sourceCount} records`);
}

async function migrateHurricaneProcedures(db: Database.Database) {
  console.log('\n🌀 Migrating Hurricane Procedures...');
  const result: MigrationResult = {
    table: 'hurricane_procedures',
    sourceCount: 0,
    migratedCount: 0,
    errors: []
  };

  try {
    const stmt = db.prepare('SELECT name FROM sqlite_master WHERE type="table" AND name="hurricane_procedures"');
    const tableExists = stmt.get();

    if (!tableExists) {
      console.log('   ⚠ Table does not exist, skipping');
      results.push(result);
      return;
    }

    const rows = db.prepare('SELECT * FROM hurricane_procedures').all() as any[];
    result.sourceCount = rows.length;

    for (const row of rows) {
      try {
        await prisma.hurricaneProcedure.upsert({
          where: { procedureCode: row.procedure_code || `HP-${row.id}` },
          update: {},
          create: {
            procedureCode: row.procedure_code || `HP-${row.id}`,
            title: row.title,
            category: row.category || 'general',
            priority: row.priority || 0,
            description: row.description,
            steps: parseJson(row.steps),
            requiredEquipment: parseJson(row.required_equipment),
            safetyNotes: row.safety_notes,
            isActive: row.is_active !== 0,
          }
        });
        result.migratedCount++;
      } catch (err: any) {
        result.errors.push(`Row ${row.id}: ${err.message}`);
      }
    }
  } catch (err: any) {
    result.errors.push(`Table error: ${err.message}`);
  }

  results.push(result);
  console.log(`   ✓ Migrated ${result.migratedCount}/${result.sourceCount} records`);
}

async function migrateHvhzProcedures(db: Database.Database) {
  console.log('\n🏗️ Migrating HVHZ Compliance Procedures...');
  const result: MigrationResult = {
    table: 'hvhz_compliance_procedures',
    sourceCount: 0,
    migratedCount: 0,
    errors: []
  };

  try {
    const stmt = db.prepare('SELECT name FROM sqlite_master WHERE type="table" AND name="hvhz_compliance_procedures"');
    const tableExists = stmt.get();

    if (!tableExists) {
      console.log('   ⚠ Table does not exist, skipping');
      results.push(result);
      return;
    }

    const rows = db.prepare('SELECT * FROM hvhz_compliance_procedures').all() as any[];
    result.sourceCount = rows.length;

    for (const row of rows) {
      try {
        await prisma.hvhzComplianceProcedure.upsert({
          where: { procedureCode: row.procedure_code || `HVHZ-${row.id}` },
          update: {},
          create: {
            procedureCode: row.procedure_code || `HVHZ-${row.id}`,
            title: row.title,
            windZone: row.wind_zone || 'HVHZ',
            countyApplicable: parseJson(row.county_applicable),
            description: row.description,
            requirements: parseJson(row.requirements),
            inspectionCriteria: parseJson(row.inspection_criteria),
            documentationNeeded: parseJson(row.documentation_needed),
            isActive: row.is_active !== 0,
          }
        });
        result.migratedCount++;
      } catch (err: any) {
        result.errors.push(`Row ${row.id}: ${err.message}`);
      }
    }
  } catch (err: any) {
    result.errors.push(`Table error: ${err.message}`);
  }

  results.push(result);
  console.log(`   ✓ Migrated ${result.migratedCount}/${result.sourceCount} records`);
}

function printSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('MIGRATION SUMMARY');
  console.log('='.repeat(60));

  let totalSource = 0;
  let totalMigrated = 0;
  let totalErrors = 0;

  for (const r of results) {
    totalSource += r.sourceCount;
    totalMigrated += r.migratedCount;
    totalErrors += r.errors.length;

    const status = r.errors.length === 0 ? '✓' : '⚠';
    console.log(`${status} ${r.table}: ${r.migratedCount}/${r.sourceCount} migrated`);

    if (r.errors.length > 0) {
      console.log(`   Errors (${r.errors.length}):`);
      r.errors.slice(0, 3).forEach(e => console.log(`   - ${e}`));
      if (r.errors.length > 3) {
        console.log(`   ... and ${r.errors.length - 3} more`);
      }
    }
  }

  console.log('\n' + '-'.repeat(60));
  console.log(`TOTAL: ${totalMigrated}/${totalSource} records migrated`);
  console.log(`ERRORS: ${totalErrors}`);
  console.log('='.repeat(60));
}

async function main() {
  console.log('='.repeat(60));
  console.log('FLORIDA FIRST ROOFING - SQLite to PostgreSQL Migration');
  console.log('='.repeat(60));
  console.log(`\nSource: ${SQLITE_MAIN_DB}`);
  console.log(`Target: PostgreSQL (ffr_accounting)`);
  console.log('\nStarting migration...');

  let db: Database.Database;

  try {
    db = new Database(SQLITE_MAIN_DB, { readonly: true });
    console.log('\n✓ Connected to SQLite database');
  } catch (err) {
    console.error('Failed to connect to SQLite:', err);
    process.exit(1);
  }

  try {
    // Migrate tables in dependency order
    await migrateCountyRequirements(db);
    await migrateMarketingCampaigns(db);
    await migrateHurricaneProcedures(db);
    await migrateHvhzProcedures(db);
    await migrateLeadAssignments(db);
    await migrateLeadAnalytics(db);
    await migrateCustomerCommunications(db);
    await migrateNotifications(db);
    await migrateIntegrationLogs(db);
    await migrateSopWorkflows(db);

    printSummary();

  } catch (err) {
    console.error('\n❌ Migration failed:', err);
    process.exit(1);
  } finally {
    db.close();
    await prisma.$disconnect();
  }

  console.log('\n✓ Migration complete!');
}

main().catch(console.error);
