#!/usr/bin/env node

/**
 * Bulk SOP Database Integration Script
 * Loads all generated SOPs into the database with proper metadata and relationships
 */

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// Database setup
const dbPath = path.join(__dirname, '../database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// SOP configuration and metadata
const sopCategories = {
  '0000': { id: 1, priority: 'critical', florida_specific: 1, hurricane_related: 0, osha_related: 0 },
  '1000': { id: 2, priority: 'critical', florida_specific: 1, hurricane_related: 1, osha_related: 1 },
  '2000': { id: 3, priority: 'high', florida_specific: 0, hurricane_related: 0, osha_related: 0 },
  '3000': { id: 4, priority: 'critical', florida_specific: 0, hurricane_related: 0, osha_related: 0 },
  '4000': { id: 5, priority: 'high', florida_specific: 1, hurricane_related: 1, osha_related: 1 },
  '5000': { id: 6, priority: 'high', florida_specific: 0, hurricane_related: 0, osha_related: 0 },
  '6000': { id: 7, priority: 'standard', florida_specific: 1, hurricane_related: 0, osha_related: 1 },
  '7000': { id: 8, priority: 'critical', florida_specific: 1, hurricane_related: 0, osha_related: 1 },
  '8000': { id: 9, priority: 'standard', florida_specific: 0, hurricane_related: 0, osha_related: 0 },
  '9000': { id: 10, priority: 'standard', florida_specific: 0, hurricane_related: 0, osha_related: 0 }
};

// Training requirements by role and category
const trainingRequirements = {
  '1000': [
    { role: 'All Employees', hours: 10, certification: true, recert_months: 12 },
    { role: 'Field Supervisor', hours: 30, certification: true, recert_months: 12 },
    { role: 'Safety Coordinator', hours: 40, certification: true, recert_months: 6 }
  ],
  '2000': [
    { role: 'System Administrator', hours: 16, certification: true, recert_months: 12 },
    { role: 'End User', hours: 4, certification: false, recert_months: 12 },
    { role: 'Department Manager', hours: 8, certification: true, recert_months: 12 }
  ],
  '3000': [
    { role: 'IT Administrator', hours: 24, certification: true, recert_months: 6 },
    { role: 'Security Administrator', hours: 40, certification: true, recert_months: 6 },
    { role: 'General User', hours: 2, certification: false, recert_months: 12 }
  ],
  '4000': [
    { role: 'Field Technician', hours: 8, certification: true, recert_months: 12 },
    { role: 'Field Supervisor', hours: 16, certification: true, recert_months: 12 },
    { role: 'Dispatcher', hours: 4, certification: false, recert_months: 12 }
  ]
};

// Metadata templates by category
const metadataTemplates = {
  '1000': {
    'osha_standards': '29 CFR 1926',
    'safety_equipment': 'PPE, Fall Protection, Safety Harness',
    'weather_dependent': 'true',
    'emergency_response': 'true',
    'florida_specific_hazards': 'Hurricane, Lightning, Heat Stress'
  },
  '2000': {
    'system_integration': 'CRM, ERP, Financial, Project Management',
    'user_access_required': 'Role-based permissions',
    'data_classification': 'Internal Business Use',
    'backup_frequency': 'Daily automated backup'
  },
  '3000': {
    'security_classification': 'Confidential - IT Personnel Only',
    'compliance_frameworks': 'NIST, ISO 27001, SOC 2',
    'incident_response': 'true',
    'monitoring_required': '24/7 system monitoring'
  },
  '4000': {
    'mobile_access': 'Required for field operations',
    'gps_tracking': 'Enabled for all field personnel',
    'customer_interaction': 'Direct customer-facing procedures',
    'weather_monitoring': 'Integration with weather services'
  }
};

// Main bulk insert function
async function bulkInsertSOPs() {
  console.log('🚀 Starting bulk SOP database integration...');

  // Prepare database statements
  const insertSOP = db.prepare(`
    INSERT INTO sop_procedures (
      sop_number, title, description, category_id, status, priority_level,
      compliance_required, florida_specific, hurricane_related, osha_related,
      estimated_duration_minutes, version, effective_date, review_date,
      content_file_path, created_by, updated_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMetadata = db.prepare(`
    INSERT INTO sop_metadata (sop_id, metadata_key, metadata_value)
    VALUES (?, ?, ?)
  `);

  const insertTraining = db.prepare(`
    INSERT INTO sop_training_requirements (
      sop_id, role_name, required_training_hours, certification_required, recertification_period_months
    ) VALUES (?, ?, ?, ?, ?)
  `);

  const insertCompliance = db.prepare(`
    INSERT INTO sop_compliance_tracking (
      sop_id, compliance_period_start, compliance_period_end, compliance_rate
    ) VALUES (?, ?, ?, ?)
  `);

  let totalInserted = 0;
  let totalErrors = 0;

  // Process each category directory
  const sopBaseDir = path.join(__dirname, '../database/sop-content/SOPs');
  const categoryDirs = fs.readdirSync(sopBaseDir).filter(dir =>
    fs.statSync(path.join(sopBaseDir, dir)).isDirectory()
  );

  // Start transaction for bulk insert
  const insertTransaction = db.transaction(() => {
    for (const categoryDir of categoryDirs) {
      const categoryCode = categoryDir.split('-')[0];
      const categoryConfig = sopCategories[categoryCode];

      if (!categoryConfig) {
        console.log(`⚠️  Unknown category: ${categoryCode}`);
        continue;
      }

      console.log(`📁 Processing category ${categoryCode} (${categoryDir})...`);

      const categoryPath = path.join(sopBaseDir, categoryDir);
      const sopFiles = fs.readdirSync(categoryPath).filter(file =>
        file.endsWith('.md') && file.startsWith('SOP-')
      );

      for (const sopFile of sopFiles) {
        try {
          // Extract SOP number from filename
          const sopMatch = sopFile.match(/SOP-(\d+)-(.+)\.md$/);
          if (!sopMatch) continue;

          const sopNumber = sopMatch[1];
          const sopTitle = sopMatch[2].replace(/-/g, ' ').replace(/\.md$/, '');

          // Read SOP content
          const sopContent = fs.readFileSync(path.join(categoryPath, sopFile), 'utf8');

          // Extract description from content (first purpose paragraph)
          const descriptionMatch = sopContent.match(/## BLOCK 1: PURPOSE[^#]*?\n\n([^#]+)/);
          const description = descriptionMatch ?
            descriptionMatch[1].substring(0, 500).trim() :
            `Comprehensive procedures for ${sopTitle.toLowerCase()}.`;

          // Calculate estimated duration based on category and complexity
          const estimatedDuration = getEstimatedDuration(categoryCode, sopTitle);

          // Insert SOP procedure
          const sopResult = insertSOP.run(
            sopNumber,
            sopTitle,
            description,
            categoryConfig.id,
            'active',
            categoryConfig.priority,
            1, // compliance_required
            categoryConfig.florida_specific,
            categoryConfig.hurricane_related,
            categoryConfig.osha_related,
            estimatedDuration,
            '2025.08',
            '2025-08-01',
            '2025-11-01',
            `SOPs/${categoryDir}/${sopFile}`,
            'SOP Generator',
            'SOP Generator'
          );

          const sopId = sopResult.lastInsertRowid;

          // Insert metadata
          const metadata = metadataTemplates[categoryCode] || {};
          for (const [key, value] of Object.entries(metadata)) {
            insertMetadata.run(sopId, key, value);
          }

          // Add SOP-specific metadata
          insertMetadata.run(sopId, 'file_location', `${categoryDir}/${sopFile}`);
          insertMetadata.run(sopId, 'content_blocks', '14');
          insertMetadata.run(sopId, 'auto_generated', 'true');
          insertMetadata.run(sopId, 'generation_date', new Date().toISOString());

          // Insert training requirements
          const trainingReqs = trainingRequirements[categoryCode] || [];
          for (const training of trainingReqs) {
            insertTraining.run(
              sopId,
              training.role,
              training.hours,
              training.certification ? 1 : 0,
              training.recert_months
            );
          }

          // Insert compliance tracking with mock data
          const complianceRate = getComplianceRate(categoryConfig.priority);
          insertCompliance.run(
            sopId,
            '2025-08-01',
            '2025-11-01',
            complianceRate
          );

          totalInserted++;

          if (totalInserted % 50 === 0) {
            console.log(`✅ Inserted ${totalInserted} SOPs...`);
          }

        } catch (error) {
          console.error(`❌ Error processing ${sopFile}:`, error.message);
          totalErrors++;
        }
      }

      console.log(`✅ Completed ${categoryCode}: ${sopFiles.length} SOPs processed`);
    }
  });

  // Execute transaction
  try {
    insertTransaction();
    console.log(`\n🎉 Bulk insert complete!`);
    console.log(`✅ Total SOPs inserted: ${totalInserted}`);
    console.log(`❌ Total errors: ${totalErrors}`);

    // Verify insertion
    const totalInDB = db.prepare('SELECT COUNT(*) as count FROM sop_procedures').get();
    console.log(`📊 Total SOPs in database: ${totalInDB.count}`);

    // Update statistics
    await updateSystemStatistics();

  } catch (error) {
    console.error('❌ Transaction failed:', error);
    throw error;
  }
}

// Helper functions
function getEstimatedDuration(categoryCode, title) {
  const baseDurations = {
    '0000': 60,  // Governance procedures
    '1000': 45,  // Safety procedures
    '2000': 90,  // Software systems
    '3000': 120, // IT infrastructure
    '4000': 60,  // Field operations
    '5000': 75,  // Customer/sales
    '6000': 90,  // HR procedures
    '7000': 105, // Compliance
    '8000': 135, // Integration
    '9000': 45   // Reporting
  };

  const base = baseDurations[categoryCode] || 60;

  // Adjust based on title complexity
  let multiplier = 1;
  if (title.includes('Advanced') || title.includes('Complex')) multiplier = 1.5;
  if (title.includes('Emergency') || title.includes('Critical')) multiplier = 1.3;
  if (title.includes('Basic') || title.includes('Simple')) multiplier = 0.7;

  return Math.round(base * multiplier);
}

function getComplianceRate(priority) {
  // Generate realistic compliance rates based on priority
  const baseRates = {
    'critical': 96,
    'high': 93,
    'standard': 89,
    'low': 85
  };

  const base = baseRates[priority] || 89;
  // Add some variance (+/- 3%)
  const variance = (Math.random() - 0.5) * 6;
  return Math.max(80, Math.min(100, base + variance));
}

async function updateSystemStatistics() {
  console.log('📊 Updating system statistics...');

  // Update system settings
  const updateVersion = db.prepare(`
    UPDATE sop_system_settings
    SET setting_value = ?, updated_at = CURRENT_TIMESTAMP
    WHERE setting_key = ?
  `);

  updateVersion.run('2025.08.002', 'database_version');
  updateVersion.run(new Date().toISOString(), 'last_updated');

  // Generate summary report
  const stats = db.prepare(`
    SELECT
      COUNT(*) as total_sops,
      COUNT(CASE WHEN status = 'active' THEN 1 END) as active_sops,
      COUNT(CASE WHEN priority_level = 'critical' THEN 1 END) as critical_sops,
      COUNT(CASE WHEN florida_specific = 1 THEN 1 END) as florida_specific,
      COUNT(CASE WHEN hurricane_related = 1 THEN 1 END) as hurricane_related,
      COUNT(CASE WHEN osha_related = 1 THEN 1 END) as osha_related,
      ROUND(AVG(estimated_duration_minutes), 1) as avg_duration
    FROM sop_procedures
  `).get();

  console.log('\n📋 Database Statistics:');
  console.log(`   Total SOPs: ${stats.total_sops}`);
  console.log(`   Active SOPs: ${stats.active_sops}`);
  console.log(`   Critical Priority: ${stats.critical_sops}`);
  console.log(`   Florida Specific: ${stats.florida_specific}`);
  console.log(`   Hurricane Related: ${stats.hurricane_related}`);
  console.log(`   OSHA Related: ${stats.osha_related}`);
  console.log(`   Avg Duration: ${stats.avg_duration} minutes`);
}

// Error handling and cleanup
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Main execution
if (require.main === module) {
  bulkInsertSOPs()
    .then(() => {
      console.log('✅ Bulk SOP integration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Bulk insert failed:', error);
      process.exit(1);
    });
}

module.exports = { bulkInsertSOPs };