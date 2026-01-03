/**
 * Database Initialization Script
 * Florida First Roofing - Construction Accounting System
 */

const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'accounting.db');
const schemaPath = path.join(__dirname, 'schema.sql');

/**
 * Initialize the database with the complete schema
 */
async function initializeDatabase() {
    return new Promise((resolve, reject) => {
        try {
            console.log('🗄️  Initializing Florida First Roofing database...');

            // Create database connection
            const db = new Database(dbPath);
            console.log('✅ Connected to SQLite database');

            // Read and execute schema file
            const sql = fs.readFileSync(schemaPath, 'utf8');

            // Execute SQL schema
            db.exec(sql);
            console.log('✅ Database schema created successfully');

            // Insert sample data for testing
            insertSampleData(db);

            db.close();
            console.log('✅ Database initialization completed');
            resolve();
        } catch (err) {
            console.error('❌ Error initializing database:', err.message);
            reject(err);
        }
    });
}

/**
 * Insert sample data for testing and demonstration
 */
function insertSampleData(db) {
    console.log('📊 Inserting sample data...');

    const sampleData = `
    -- Sample customers
    INSERT OR REPLACE INTO customers (
      customer_number, first_name, last_name, email, phone, address, city, county, zip_code,
      customer_type, lead_source, acquisition_date, status, created_at, updated_at
    ) VALUES
    ('CUST-001', 'John', 'Doe', 'john.doe@email.com', '407-555-0123', '123 Main St', 'Orlando', 'Orange', '32801', 'residential', 'website', datetime('now', '-5 days'), 'active', datetime('now', '-5 days'), datetime('now')),
    ('CUST-002', 'Jane', 'Smith', 'jane.smith@email.com', '321-555-0456', '456 Oak Ave', 'Melbourne', 'Brevard', '32901', 'residential', 'referral', datetime('now', '-3 days'), 'active', datetime('now', '-3 days'), datetime('now')),
    ('CUST-003', 'ABC Construction', 'Manager', 'contact@abcconstruction.com', '386-555-0789', '789 Business Blvd', 'Daytona Beach', 'Volusia', '32114', 'commercial', 'advertising', datetime('now', '-1 day'), 'active', datetime('now', '-1 day'), datetime('now'));

    -- Sample projects
    INSERT OR REPLACE INTO projects (
      customer_id, project_number, name, type, status, priority, address, county, estimated_value,
      hvhz_zone, description, created_at, updated_at
    ) VALUES
    (1, 'PRJ-2024-001', 'Residential Roof Replacement', 'roof-replacement', 'active', 'medium', '123 Main St, Orlando, FL', 'Orange', 15000.00, FALSE, 'Complete shingle roof replacement', datetime('now', '-4 days'), datetime('now')),
    (2, 'PRJ-2024-002', 'Emergency Roof Repair', 'roof-repair', 'active', 'emergency', '456 Oak Ave, Melbourne, FL', 'Brevard', 3500.00, FALSE, 'Storm damage repair - urgent', datetime('now', '-2 days'), datetime('now')),
    (3, 'PRJ-2024-003', 'Commercial Roof Installation', 'commercial', 'estimation', 'high', '789 Business Blvd, Daytona Beach, FL', 'Volusia', 85000.00, FALSE, 'New commercial building roof installation', datetime('now'), datetime('now'));

    -- Sample vendors
    INSERT OR REPLACE INTO vendors (
      vendor_number, company_name, contact_person, email, phone, vendor_type, status, created_at, updated_at
    ) VALUES
    ('VEND-001', 'Quality Roofing Supplies', 'Mike Wilson', 'mike@qualityroofing.com', '407-555-1000', 'supplier', 'active', datetime('now'), datetime('now')),
    ('VEND-002', 'Elite Subcontractors', 'Sarah Johnson', 'sarah@elitesubs.com', '321-555-2000', 'subcontractor', 'active', datetime('now'), datetime('now')),
    ('VEND-003', 'Florida Equipment Rental', 'David Brown', 'david@flequipment.com', '386-555-3000', 'equipment_rental', 'active', datetime('now'), datetime('now'));

    -- Sample SOP workflow for testing
    INSERT OR REPLACE INTO sop_workflows (
      workflow_id, sop_id, lead_id, project_id, trigger_type, status, urgency, service_type,
      metadata, created_at, updated_at
    ) VALUES
    ('WF-TEST-001', 'SOP-4001', 'LEAD-001', 1, 'lead_integration', 'active', 'high', 'roof-replacement',
     '{"test": true, "automated": true}', datetime('now', '-1 hour'), datetime('now'));

    -- Sample materials
    INSERT OR REPLACE INTO materials (
      material_code, name, category, unit, cost_per_unit, min_stock_level, current_stock,
      florida_approved, hvhz_rated, status, created_at, updated_at
    ) VALUES
    ('MAT-001', 'Architectural Shingles - Premium', 'shingles', 'square', 150.00, 50, 120, TRUE, TRUE, 'active', datetime('now'), datetime('now')),
    ('MAT-002', 'Synthetic Underlayment', 'underlayment', 'square', 45.00, 25, 80, TRUE, TRUE, 'active', datetime('now'), datetime('now')),
    ('MAT-003', 'Galvanized Flashing', 'flashing', 'linear_foot', 3.50, 100, 250, TRUE, TRUE, 'active', datetime('now'), datetime('now'));

    -- Sample integration logs
    INSERT OR REPLACE INTO integration_logs (
      event_type, source_system, event_data, status, processing_time_ms, timestamp, created_at
    ) VALUES
    ('customer_created', 'website', '{"customer_id": 1, "lead_source": "website"}', 'success', 150, datetime('now', '-5 days'), datetime('now', '-5 days')),
    ('project_created', 'crm', '{"project_id": 1, "customer_id": 1}', 'success', 200, datetime('now', '-4 days'), datetime('now', '-4 days')),
    ('sop_triggered', 'automation', '{"workflow_id": "WF-TEST-001", "sop_id": "SOP-4001"}', 'success', 50, datetime('now', '-1 hour'), datetime('now', '-1 hour'));
  `;

    db.exec(sampleData);
    console.log('✅ Sample data inserted successfully');
}

/**
 * Check if database exists and is properly initialized
 */
function isDatabaseInitialized() {
    return fs.existsSync(dbPath);
}

/**
 * Reset database (delete and recreate)
 */
async function resetDatabase() {
    if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
        console.log('🗑️  Existing database removed');
    }
    return initializeDatabase();
}

/**
 * Get database statistics
 */
async function getDatabaseStats() {
    try {
        const db = new Database(dbPath, {
            readonly: true
        });

        const stats = {};
        const queries = [{
                name: 'customers',
                query: 'SELECT COUNT(*) as count FROM customers'
            },
            {
                name: 'projects',
                query: 'SELECT COUNT(*) as count FROM projects'
            },
            {
                name: 'sop_procedures',
                query: 'SELECT COUNT(*) as count FROM sop_procedures'
            },
            {
                name: 'sop_workflows',
                query: 'SELECT COUNT(*) as count FROM sop_workflows'
            },
            {
                name: 'vendors',
                query: 'SELECT COUNT(*) as count FROM vendors'
            },
            {
                name: 'notifications',
                query: 'SELECT COUNT(*) as count FROM notifications'
            },
            {
                name: 'integration_logs',
                query: 'SELECT COUNT(*) as count FROM integration_logs'
            }
        ];

        queries.forEach(({
            name,
            query
        }) => {
            try {
                const row = db.prepare(query).get();
                stats[name] = row.count;
            } catch (err) {
                stats[name] = 0;
            }
        });

        db.close();
        return stats;
    } catch (err) {
        throw err;
    }
}

module.exports = {
    initializeDatabase,
    isDatabaseInitialized,
    resetDatabase,
    getDatabaseStats
};

// If this script is run directly, initialize the database
if (require.main === module) {
    initializeDatabase()
        .then(() => {
            console.log('🎉 Database initialization completed successfully!');
            process.exit(0);
        })
        .catch((err) => {
            console.error('💥 Database initialization failed:', err);
            process.exit(1);
        });
}