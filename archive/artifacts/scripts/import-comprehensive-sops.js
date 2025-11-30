#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// Database connection
const dbPath = path.join(__dirname, '../database.sqlite');
const db = new Database(dbPath);

// SOP content directory
const sopContentDir = path.join(__dirname, '../database/sop-content/SOPs');

console.log('🚀 Starting comprehensive SOP import...');
console.log(`📁 Source directory: ${sopContentDir}`);
console.log(`🗄️ Database: ${dbPath}`);

// Function to extract SOP metadata from markdown content
function extractSOPMetadata(content, filePath) {
    const lines = content.split('\n');
    const metadata = {
        title: '',
        purpose: '',
        scope: '',
        sopNumber: '',
        content: content,
        filePath: filePath
    };

    // Extract title (first heading)
    const titleMatch = content.match(/^# FFR SOP-(\d+):\s*(.+)$/m);
    if (titleMatch) {
        metadata.sopNumber = titleMatch[1].padStart(4, '0');
        metadata.title = `FFR SOP-${metadata.sopNumber}: ${titleMatch[2]}`;
    }

    // Extract purpose from BLOCK 1
    const purposeMatch = content.match(/## BLOCK 1: PURPOSE[\s\S]*?\n\n([\s\S]*?)(?=\n\n|\n##|$)/);
    if (purposeMatch) {
        metadata.purpose = purposeMatch[1].replace(/\*\*[^*]+\*\*/g, '').trim().substring(0, 500);
    }

    // Extract scope from BLOCK 2
    const scopeMatch = content.match(/## BLOCK 2: SCOPE[\s\S]*?\n\n([\s\S]*?)(?=\n\n|\n##|$)/);
    if (scopeMatch) {
        metadata.scope = scopeMatch[1].replace(/\*\*[^*]+\*\*/g, '').trim().substring(0, 500);
    }

    return metadata;
}

// Function to determine category based on SOP number
function getCategoryFromNumber(sopNumber) {
    const num = parseInt(sopNumber);
    if (num >= 0 && num <= 999) return 1;      // Foundation and Governance
    if (num >= 1000 && num <= 1499) return 2; // Safety and OSHA Compliance
    if (num >= 1500 && num <= 1599) return 3; // HVHZ (High Velocity Hurricane Zone)
    if (num >= 2000 && num <= 2999) return 4; // Enterprise Software Systems
    if (num >= 3000 && num <= 3999) return 5; // IT Infrastructure and Security
    if (num >= 4000 && num <= 4999) return 6; // Operations and Field Systems
    if (num >= 5000 && num <= 5999) return 7; // Customer and Sales Systems
    if (num >= 6000 && num <= 6999) return 8; // Human Resources and Training
    if (num >= 7000 && num <= 7999) return 9; // Compliance and Quality Systems
    if (num >= 8000 && num <= 8999) return 10; // Integration and Automation
    if (num >= 9000 && num <= 9999) return 10; // Reporting and Documentation
    return 1; // Default to Foundation
}

// Function to recursively find all markdown files
function findMarkdownFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            files.push(...findMarkdownFiles(fullPath));
        } else if (item.endsWith('.md') && item.startsWith('SOP-')) {
            files.push(fullPath);
        }
    }

    return files;
}

// Main import function
async function importComprehensiveSOPs() {
    try {
        // Disable foreign key constraints temporarily
        db.exec('PRAGMA foreign_keys = OFF');

        // Clear existing generic SOPs
        console.log('🗑️ Clearing existing generic SOP data...');
        db.exec('DELETE FROM sop_procedures');
        db.exec('DELETE FROM sqlite_sequence WHERE name = \'sop_procedures\'');

        // Ensure categories exist - restore them if needed
        console.log('🏗️ Ensuring SOP categories exist...');
        const categoryCount = db.prepare('SELECT COUNT(*) as count FROM sop_categories').get();
        if (categoryCount.count === 0) {
            console.log('📂 Creating SOP categories...');
            const categoryInsert = db.prepare(`
                INSERT OR IGNORE INTO sop_categories (id, category_code, category_name, description, color_code, icon_name, sort_order)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);

            const categories = [
                [1, '0000', 'Foundation and Governance', 'Corporate governance, policies, and foundational procedures', '#1e3a8a', 'building', 1],
                [2, '1000', 'Safety and Compliance', 'OSHA compliance, safety protocols, and regulatory procedures', '#dc2626', 'shield-check', 2],
                [3, '1500', 'High Velocity Hurricane Zone', 'HVHZ-specific procedures per Florida Building Code', '#7c3aed', 'wind', 3],
                [4, '2000', 'Enterprise Software Systems', 'CRM, ERP, financial systems, and enterprise applications', '#059669', 'computer-desktop', 4],
                [5, '3000', 'IT Infrastructure and Security', 'Network security, data protection, and IT operations', '#ea580c', 'shield-exclamation', 5],
                [6, '4000', 'Operations and Field Systems', 'Field operations, mobile systems, and service delivery', '#0891b2', 'truck', 6],
                [7, '5000', 'Customer and Sales Systems', 'CRM, sales processes, and customer management', '#be185d', 'users', 7],
                [8, '6000', 'Human Resources and Training', 'Employee management, training, and development', '#166534', 'academic-cap', 8],
                [9, '7000', 'Compliance and Quality Systems', 'Quality assurance, auditing, and compliance monitoring', '#b45309', 'clipboard-check', 9],
                [10, '8000', 'Integration and Automation', 'System integrations, workflow automation, and process optimization', '#4338ca', 'cog', 10]
            ];

            categories.forEach(cat => categoryInsert.run(...cat));
        }

        // Re-enable foreign key constraints
        db.exec('PRAGMA foreign_keys = ON');

        // Find all SOP markdown files
        console.log('🔍 Finding SOP markdown files...');
        const markdownFiles = findMarkdownFiles(sopContentDir);
        console.log(`📄 Found ${markdownFiles.length} SOP markdown files`);

        let importCount = 0;
        let errorCount = 0;

        // Prepare SQL statement
        const insertSOP = db.prepare(`
            INSERT INTO sop_procedures (
                sop_number, category_id, title, purpose, scope, content_file_path,
                detailed_content_path, status, priority_level, compliance_required,
                florida_specific, hurricane_related, osha_related, version,
                content_quality_score, professional_grade, content_type,
                estimated_duration_minutes, created_by, effective_date, next_review_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        // Process each markdown file
        for (const filePath of markdownFiles) {
            try {
                console.log(`📖 Processing: ${path.basename(filePath)}`);

                const content = fs.readFileSync(filePath, 'utf8');
                const metadata = extractSOPMetadata(content, filePath);

                if (!metadata.sopNumber || !metadata.title) {
                    console.log(`⚠️ Skipping ${filePath}: Could not extract SOP number or title`);
                    errorCount++;
                    continue;
                }

                const categoryId = getCategoryFromNumber(metadata.sopNumber);
                const relativePath = path.relative(path.join(__dirname, '..'), filePath);

                // Determine characteristics based on content
                const isFloridaSpecific = content.toLowerCase().includes('florida') ||
                                        content.toLowerCase().includes('hvhz') ||
                                        content.toLowerCase().includes('miami-dade');

                const isHurricaneRelated = content.toLowerCase().includes('hurricane') ||
                                         content.toLowerCase().includes('wind') ||
                                         content.toLowerCase().includes('hvhz');

                const isOSHARelated = content.toLowerCase().includes('osha') ||
                                    content.toLowerCase().includes('safety') ||
                                    content.toLowerCase().includes('fall protection');

                // Determine priority level based on content
                let priorityLevel = 'standard';
                if (content.toLowerCase().includes('critical') ||
                    content.toLowerCase().includes('emergency') ||
                    content.toLowerCase().includes('safety')) {
                    priorityLevel = 'critical';
                } else if (content.toLowerCase().includes('compliance') ||
                          content.toLowerCase().includes('regulatory')) {
                    priorityLevel = 'high';
                }

                // Insert SOP into database
                insertSOP.run(
                    metadata.sopNumber,                    // sop_number
                    categoryId,                           // category_id
                    metadata.title,                       // title
                    metadata.purpose || 'Comprehensive procedure for operational excellence', // purpose
                    metadata.scope || 'All applicable personnel and operations',  // scope
                    relativePath,                         // content_file_path
                    path.dirname(relativePath),          // detailed_content_path
                    'active',                            // status
                    priorityLevel,                       // priority_level
                    true,                               // compliance_required
                    isFloridaSpecific,                  // florida_specific
                    isHurricaneRelated,                 // hurricane_related
                    isOSHARelated,                      // osha_related
                    '2025.08',                          // version
                    98,                                 // content_quality_score
                    true,                               // professional_grade
                    'markdown',                         // content_type
                    120,                                // estimated_duration_minutes
                    'System Import',                    // created_by
                    '2025-10-20',                       // effective_date
                    '2026-10-20'                        // next_review_date
                );

                importCount++;

                if (importCount % 100 === 0) {
                    console.log(`✅ Imported ${importCount} SOPs...`);
                }

            } catch (error) {
                console.error(`❌ Error processing ${filePath}:`, error.message);
                errorCount++;
            }
        }

        // Final statistics
        console.log('\n📊 Import Complete!');
        console.log(`✅ Successfully imported: ${importCount} SOPs`);
        console.log(`❌ Errors encountered: ${errorCount}`);

        // Verify database
        const totalCount = db.prepare('SELECT COUNT(*) as count FROM sop_procedures').get();
        console.log(`🗄️ Total SOPs in database: ${totalCount.count}`);

        // Show sample of imported SOPs
        const samples = db.prepare(`
            SELECT sop_number, title, category_id, content_file_path
            FROM sop_procedures
            ORDER BY sop_number
            LIMIT 5
        `).all();

        console.log('\n📋 Sample imported SOPs:');
        samples.forEach(sop => {
            console.log(`  ${sop.sop_number}: ${sop.title}`);
        });

    } catch (error) {
        console.error('💥 Fatal error during import:', error);
        process.exit(1);
    } finally {
        db.close();
    }
}

// Run the import
if (require.main === module) {
    importComprehensiveSOPs()
        .then(() => {
            console.log('🎉 Comprehensive SOP import completed successfully!');
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Import failed:', error);
            process.exit(1);
        });
}

module.exports = { importComprehensiveSOPs };