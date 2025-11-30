#!/usr/bin/env node

/**
 * Miami-Dade NOA SOP Database Integration Script
 * Integrates generated NOA SOPs into the SOP Management database
 */

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// Database setup
const dbPath = path.join(__dirname, '../database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// NOA Category Configuration
const noaCategory = {
  id: 11,
  categoryCode: '1500',
  name: 'Miami-Dade NOA Roof Systems',
  description: 'HVHZ-approved roof system installation procedures by manufacturer',
  priority: 'critical',
  florida_specific: 1,
  hurricane_related: 1,
  osha_related: 1
};

// Main bulk insert function for NOA SOPs
async function insertNOASOPs() {
  console.log('🚀 Starting NOA SOP database integration...');

  // Prepare database statements
  const insertSOP = db.prepare(`
    INSERT OR REPLACE INTO sop_procedures (
      sop_number, title, description, category_id, status, priority_level,
      compliance_required, florida_specific, hurricane_related, osha_related,
      estimated_duration_minutes, version, effective_date, review_date,
      content_file_path, created_by, updated_by, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);

  const insertMetadata = db.prepare(`
    INSERT OR REPLACE INTO sop_metadata (sop_id, metadata_key, metadata_value)
    VALUES (?, ?, ?)
  `);

  const insertTraining = db.prepare(`
    INSERT OR REPLACE INTO sop_training_requirements (
      sop_id, role_name, required_training_hours, certification_required, recertification_period_months
    ) VALUES (?, ?, ?, ?, ?)
  `);

  const insertCompliance = db.prepare(`
    INSERT OR REPLACE INTO sop_compliance_tracking (
      sop_id, compliance_period_start, compliance_period_end, compliance_rate
    ) VALUES (?, ?, ?, ?)
  `);

  let totalInserted = 0;
  let totalErrors = 0;

  // Process NOA SOP directory
  const noaSOPDir = path.join(__dirname, '../database/sop-content/SOPs/1500-Miami-Dade-NOA-Systems');

  if (!fs.existsSync(noaSOPDir)) {
    console.error('❌ NOA SOP directory not found:', noaSOPDir);
    return;
  }

  const sopFiles = fs.readdirSync(noaSOPDir).filter(file =>
    file.endsWith('.md') && file.startsWith('SOP-')
  );

  console.log(`📁 Found ${sopFiles.length} NOA SOP files to process...`);

  // Start transaction for bulk insert
  const insertTransaction = db.transaction(() => {
    for (const sopFile of sopFiles) {
      try {
        // Extract SOP information from filename
        const sopMatch = sopFile.match(/SOP-([A-Z]{3}-[A-Z]{3}-HVHZ)-(.+)-HVHZ-Installation\.md$/);
        if (!sopMatch) {
          console.log(`⚠️  Skipping file with unexpected format: ${sopFile}`);
          continue;
        }

        const sopNumber = sopMatch[1];
        const sopTitle = sopMatch[2].replace(/-/g, ' ').replace(/®/g, '®');

        // Read SOP content for description
        const sopContent = fs.readFileSync(path.join(noaSOPDir, sopFile), 'utf8');

        // Extract description from content
        const descriptionMatch = sopContent.match(/## BLOCK 1: PURPOSE[^#]*?\n\n([^#]+)/);
        const description = descriptionMatch ?
          descriptionMatch[1].substring(0, 500).trim() :
          `HVHZ installation procedures for ${sopTitle} roofing systems.`;

        // Extract manufacturer and product info
        const manufacturerMatch = sopContent.match(/\*\*Product:\*\* (.+)/);
        const manufacturer = manufacturerMatch ? manufacturerMatch[1] : 'Unknown';

        // Extract NOA number
        const noaMatch = sopContent.match(/\*\*NOA Number:\*\* (.+)/);
        const noaNumber = noaMatch ? noaMatch[1] : 'Unknown';

        // Extract wind rating
        const windMatch = sopContent.match(/\*\*Wind Rating:\*\* (.+)/);
        const windRating = windMatch ? windMatch[1] : 'Unknown';

        // Calculate estimated duration (longer for HVHZ installations)
        const estimatedDuration = 180; // 3 hours for HVHZ installations

        // Insert SOP procedure
        const sopResult = insertSOP.run(
          sopNumber,
          sopTitle,
          description,
          noaCategory.id,
          'active',
          noaCategory.priority,
          1, // compliance_required
          noaCategory.florida_specific,
          noaCategory.hurricane_related,
          noaCategory.osha_related,
          estimatedDuration,
          '2025.01',
          '2025-01-01',
          '2025-12-31',
          `SOPs/1500-Miami-Dade-NOA-Systems/${sopFile}`,
          'NOA SOP Generator',
          'NOA SOP Generator'
        );

        const sopId = sopResult.lastInsertRowid;

        // Insert NOA-specific metadata
        insertMetadata.run(sopId, 'noa_number', noaNumber);
        insertMetadata.run(sopId, 'manufacturer', manufacturer);
        insertMetadata.run(sopId, 'wind_rating', windRating);
        insertMetadata.run(sopId, 'hvhz_required', 'true');
        insertMetadata.run(sopId, 'miami_dade_approved', 'true');
        insertMetadata.run(sopId, 'installation_type', 'HVHZ Enhanced');
        insertMetadata.run(sopId, 'nail_count', '6');
        insertMetadata.run(sopId, 'file_location', `1500-Miami-Dade-NOA-Systems/${sopFile}`);
        insertMetadata.run(sopId, 'auto_generated', 'true');
        insertMetadata.run(sopId, 'generation_date', new Date().toISOString());

        // Insert HVHZ-specific training requirements
        insertTraining.run(sopId, 'HVHZ Installer', 16, 1, 12);
        insertTraining.run(sopId, 'Crew Leader', 24, 1, 12);
        insertTraining.run(sopId, 'Quality Control Inspector', 12, 1, 6);
        insertTraining.run(sopId, 'Project Manager', 8, 1, 12);

        // Insert compliance tracking with high standards
        const complianceRate = 98.5; // High compliance rate for NOA requirements
        insertCompliance.run(
          sopId,
          '2025-01-01',
          '2025-12-31',
          complianceRate
        );

        totalInserted++;
        console.log(`✅ Inserted: ${sopTitle} (NOA: ${noaNumber})`);

      } catch (error) {
        console.error(`❌ Error processing ${sopFile}:`, error.message);
        totalErrors++;
      }
    }
  });

  // Execute transaction
  try {
    insertTransaction();
    console.log(`\n🎉 NOA SOP integration complete!`);
    console.log(`✅ Total NOA SOPs inserted: ${totalInserted}`);
    console.log(`❌ Total errors: ${totalErrors}`);

    // Verify insertion
    const totalInDB = db.prepare('SELECT COUNT(*) as count FROM sop_procedures WHERE category_id = ?').get(noaCategory.id);
    console.log(`📊 Total NOA SOPs in database: ${totalInDB.count}`);

    // Update overall statistics
    const overallTotal = db.prepare('SELECT COUNT(*) as count FROM sop_procedures').get();
    console.log(`📊 Total SOPs in database: ${overallTotal.count}`);

  } catch (error) {
    console.error('❌ Transaction failed:', error);
    throw error;
  }
}

// Run the integration
if (require.main === module) {
  insertNOASOPs()
    .then(() => {
      console.log('✅ NOA SOP database integration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ NOA SOP integration failed:', error);
      process.exit(1);
    });
}

module.exports = { insertNOASOPs };