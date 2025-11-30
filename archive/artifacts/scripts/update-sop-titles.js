#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// Database connection
const dbPath = path.join(__dirname, '../database.sqlite');
const db = new Database(dbPath);

console.log('🚀 Starting SOP title and content update...');

// Function to extract title from markdown content
function extractSOPTitle(content) {
    const titleMatch = content.match(/^# FFR SOP-(\d+):\s*(.+)$/m);
    if (titleMatch) {
        const sopNumber = titleMatch[1].padStart(4, '0');
        return `FFR SOP-${sopNumber}: ${titleMatch[2]}`;
    }
    return null;
}

// Function to extract purpose from markdown content
function extractPurpose(content) {
    const purposeMatch = content.match(/## BLOCK 1: PURPOSE[\s\S]*?\n\n([\s\S]*?)(?=\n\n|\n##|$)/);
    if (purposeMatch) {
        return purposeMatch[1]
            .replace(/\*\*[^*]+\*\*/g, '') // Remove bold formatting
            .replace(/^To establish/, 'Establish') // Clean up "To establish" start
            .trim()
            .substring(0, 500); // Limit length
    }
    return null;
}

// Function to extract scope from markdown content
function extractScope(content) {
    const scopeMatch = content.match(/## BLOCK 2: SCOPE[\s\S]*?\n\n([\s\S]*?)(?=### 2\.1|### 2\.2|\n##|$)/);
    if (scopeMatch) {
        return scopeMatch[1]
            .replace(/\*\*[^*]+\*\*/g, '') // Remove bold formatting
            .trim()
            .substring(0, 500); // Limit length
    }
    return null;
}

async function updateSOPTitles() {
    try {
        // Test with just a few SOPs first
        const testFiles = [
            'database/sop-content/SOPs/0000-Foundation-and-Governance/SOP-0000-Universal-SOP-Framework-Master-Index.md',
            'database/sop-content/SOPs/0000-Foundation-and-Governance/SOP-0001-14-Block-Template-Standards.md'
        ];

        console.log('📄 Testing with sample SOP files...');

        const updateSOP = db.prepare(`
            UPDATE sop_procedures
            SET title = ?, purpose = ?, scope = ?, content_file_path = ?
            WHERE sop_number = ?
        `);

        let updateCount = 0;

        for (const filePath of testFiles) {
            const fullPath = path.join(__dirname, '..', filePath);

            if (!fs.existsSync(fullPath)) {
                console.log(`⚠️ File not found: ${fullPath}`);
                continue;
            }

            console.log(`📖 Processing: ${path.basename(filePath)}`);

            const content = fs.readFileSync(fullPath, 'utf8');
            const title = extractSOPTitle(content);
            const purpose = extractPurpose(content);
            const scope = extractScope(content);

            if (!title) {
                console.log(`⚠️ Could not extract title from: ${filePath}`);
                continue;
            }

            // Extract SOP number from title
            const sopNumberMatch = title.match(/FFR SOP-(\d+):/);
            if (!sopNumberMatch) {
                console.log(`⚠️ Could not extract SOP number from title: ${title}`);
                continue;
            }

            const sopNumber = sopNumberMatch[1];

            // Update the SOP in database
            const result = updateSOP.run(
                title,
                purpose || 'Comprehensive procedure for operational excellence and regulatory compliance',
                scope || 'All applicable personnel, operations, and business processes',
                filePath,
                sopNumber
            );

            if (result.changes > 0) {
                console.log(`✅ Updated SOP-${sopNumber}: ${title}`);
                updateCount++;
            } else {
                console.log(`⚠️ No SOP found in database with number: ${sopNumber}`);
            }
        }

        console.log(`\n📊 Update Summary:`);
        console.log(`✅ Successfully updated: ${updateCount} SOPs`);

        // Verify the updates
        const samples = db.prepare(`
            SELECT sop_number, title, purpose
            FROM sop_procedures
            WHERE sop_number IN ('0000', '0001')
            ORDER BY sop_number
        `).all();

        console.log('\n📋 Updated SOPs:');
        samples.forEach(sop => {
            console.log(`  ${sop.sop_number}: ${sop.title}`);
            console.log(`    Purpose: ${sop.purpose.substring(0, 100)}...`);
        });

    } catch (error) {
        console.error('💥 Error during update:', error);
        throw error;
    } finally {
        db.close();
    }
}

// Run the update
if (require.main === module) {
    updateSOPTitles()
        .then(() => {
            console.log('🎉 SOP title update completed successfully!');
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Update failed:', error);
            process.exit(1);
        });
}

module.exports = { updateSOPTitles };