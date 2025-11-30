#!/usr/bin/env node

/**
 * Florida First Roofing - Database Performance Test Script
 * Validates database indexes and measures query performance
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'accounting.db');
const db = new sqlite3.Database(dbPath);

// Utility function to run SQL queries as promises with timing
function runQueryWithTiming(sql, params = []) {
    return new Promise((resolve, reject) => {
        const startTime = process.hrtime.bigint();
        db.all(sql, params, (err, rows) => {
            const endTime = process.hrtime.bigint();
            const executionTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds

            if (err) reject(err);
            else resolve({ rows, executionTime, rowCount: rows.length });
        });
    });
}

function runExplainQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(`EXPLAIN QUERY PLAN ${sql}`, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

class DatabasePerformanceTester {
    async runAllTests() {
        console.log('🔍 Florida First Roofing - Database Performance Analysis\n');

        try {
            await this.testIndexUsage();
            await this.testQueryPerformance();
            await this.testJoinPerformance();
            await this.testAggregationPerformance();
            await this.runDatabaseAnalysis();

            console.log('\n✅ Database performance testing completed successfully!');

        } catch (error) {
            console.error('\n❌ Performance test failed:', error.message);
            throw error;
        }
    }

    async testIndexUsage() {
        console.log('📊 === Testing Index Usage ===');

        const indexTests = [
            {
                name: 'Customer lookup by lead_id',
                query: 'SELECT * FROM customers WHERE lead_id = ?',
                params: ['LEAD-WEB-001'],
                expectedIndex: 'idx_customers_lead_id'
            },
            {
                name: 'Projects by county',
                query: 'SELECT * FROM projects WHERE county = ?',
                params: ['brevard'],
                expectedIndex: 'idx_projects_county'
            },
            {
                name: 'Active workflows',
                query: 'SELECT * FROM sop_workflows WHERE status = ?',
                params: ['active'],
                expectedIndex: 'idx_sop_workflows_status'
            },
            {
                name: 'Lead analytics by source',
                query: 'SELECT * FROM lead_analytics WHERE lead_source = ?',
                params: ['website'],
                expectedIndex: 'idx_lead_analytics_lead_source'
            },
            {
                name: 'Integration logs by event type',
                query: 'SELECT * FROM integration_logs WHERE event_type = ?',
                params: ['customer_created'],
                expectedIndex: 'idx_integration_logs_event_type'
            }
        ];

        for (const test of indexTests) {
            console.log(`\n  Testing: ${test.name}`);

            // Get query plan
            const plan = await runExplainQuery(test.query, test.params);

            // Execute query with timing
            const result = await runQueryWithTiming(test.query, test.params);

            console.log(`    ⏱️  Execution time: ${result.executionTime.toFixed(3)}ms`);
            console.log(`    📈 Rows returned: ${result.rowCount}`);

            // Check if index is being used
            const usingIndex = plan.some(step =>
                step.detail && step.detail.includes('USING INDEX')
            );

            if (usingIndex) {
                console.log(`    ✅ Using index: YES`);
            } else {
                console.log(`    ⚠️  Using index: NO (potential performance issue)`);
            }

            // Show query plan details
            console.log(`    🔍 Query plan:`);
            plan.forEach((step, index) => {
                console.log(`       ${index}: ${step.detail}`);
            });
        }
    }

    async testQueryPerformance() {
        console.log('\n\n⚡ === Query Performance Tests ===');

        const performanceTests = [
            {
                name: 'Complex customer search with joins',
                query: `
                    SELECT c.*, p.name as project_name, w.workflow_id
                    FROM customers c
                    LEFT JOIN projects p ON c.id = p.customer_id
                    LEFT JOIN sop_workflows w ON c.lead_id = w.lead_id
                    WHERE c.county = ? AND c.status = ?
                `,
                params: ['brevard', 'active']
            },
            {
                name: 'Active workflow summary',
                query: `
                    SELECT w.*, c.first_name, c.last_name, c.email
                    FROM sop_workflows w
                    JOIN customers c ON w.customer_id = c.id
                    WHERE w.status = 'active'
                    ORDER BY w.urgency DESC, w.created_at ASC
                `
            },
            {
                name: 'Lead conversion funnel analysis',
                query: `
                    SELECT
                        lead_source,
                        county,
                        COUNT(*) as total_leads,
                        SUM(CASE WHEN conversion_status = 'won' THEN 1 ELSE 0 END) as conversions,
                        AVG(estimated_value) as avg_value
                    FROM lead_analytics
                    GROUP BY lead_source, county
                    ORDER BY total_leads DESC
                `
            },
            {
                name: 'Pending tasks by urgency',
                query: `
                    SELECT
                        t.priority,
                        COUNT(*) as task_count,
                        AVG(julianday('now') - julianday(t.due_date)) as avg_overdue_days
                    FROM sop_workflow_tasks t
                    JOIN sop_workflows w ON t.workflow_id = w.workflow_id
                    WHERE t.status = 'pending' AND w.status = 'active'
                    GROUP BY t.priority
                    ORDER BY
                        CASE t.priority
                            WHEN 'critical' THEN 1
                            WHEN 'high' THEN 2
                            WHEN 'medium' THEN 3
                            WHEN 'low' THEN 4
                        END
                `
            }
        ];

        for (const test of performanceTests) {
            console.log(`\n  📊 ${test.name}`);

            const result = await runQueryWithTiming(test.query, test.params || []);

            console.log(`    ⏱️  Execution time: ${result.executionTime.toFixed(3)}ms`);
            console.log(`    📈 Rows returned: ${result.rowCount}`);

            if (result.executionTime > 100) {
                console.log(`    ⚠️  SLOW QUERY WARNING: >100ms execution time`);
            } else if (result.executionTime > 50) {
                console.log(`    ⚡ Query is moderately fast`);
            } else {
                console.log(`    ✅ Query is very fast`);
            }

            // Show sample results for smaller result sets
            if (result.rowCount <= 5 && result.rows.length > 0) {
                console.log(`    📋 Sample results:`);
                result.rows.forEach((row, index) => {
                    const preview = Object.keys(row).slice(0, 3).map(key =>
                        `${key}: ${row[key]}`
                    ).join(', ');
                    console.log(`       ${index + 1}: ${preview}...`);
                });
            }
        }
    }

    async testJoinPerformance() {
        console.log('\n\n🔗 === Join Performance Tests ===');

        const joinTests = [
            {
                name: 'Customer-Project-Workflow three-way join',
                query: `
                    SELECT
                        c.customer_number,
                        c.first_name,
                        c.last_name,
                        p.project_number,
                        p.type as project_type,
                        w.workflow_id,
                        w.status as workflow_status
                    FROM customers c
                    JOIN projects p ON c.id = p.customer_id
                    JOIN sop_workflows w ON c.lead_id = w.lead_id
                    WHERE c.created_at >= date('now', '-30 days')
                `
            },
            {
                name: 'Lead analytics with campaign attribution',
                query: `
                    SELECT
                        la.*,
                        lca.campaign_id,
                        mc.name as campaign_name,
                        mc.type as campaign_type
                    FROM lead_analytics la
                    LEFT JOIN lead_campaign_attribution lca ON la.lead_id = lca.lead_id
                    LEFT JOIN marketing_campaigns mc ON lca.campaign_id = mc.campaign_id
                    WHERE la.created_at >= date('now', '-30 days')
                `
            },
            {
                name: 'Workflow tasks with customer info',
                query: `
                    SELECT
                        t.title,
                        t.status,
                        t.priority,
                        t.assigned_to,
                        c.first_name,
                        c.last_name,
                        c.county,
                        w.urgency
                    FROM sop_workflow_tasks t
                    JOIN sop_workflows w ON t.workflow_id = w.workflow_id
                    JOIN customers c ON w.customer_id = c.id
                    WHERE t.status = 'pending'
                    ORDER BY t.priority, t.due_date
                `
            }
        ];

        for (const test of joinTests) {
            console.log(`\n  🔗 ${test.name}`);

            const result = await runQueryWithTiming(test.query);
            const plan = await runExplainQuery(test.query);

            console.log(`    ⏱️  Execution time: ${result.executionTime.toFixed(3)}ms`);
            console.log(`    📈 Rows returned: ${result.rowCount}`);

            // Analyze join strategy
            const joinStrategy = plan.filter(step =>
                step.detail && (step.detail.includes('JOIN') || step.detail.includes('SCAN'))
            );

            console.log(`    🔍 Join strategy:`);
            joinStrategy.forEach((step, index) => {
                console.log(`       ${index}: ${step.detail}`);
            });
        }
    }

    async testAggregationPerformance() {
        console.log('\n\n📈 === Aggregation Performance Tests ===');

        const aggregationTests = [
            {
                name: 'Monthly lead conversion summary',
                query: `
                    SELECT
                        DATE(created_at, 'start of month') as month,
                        COUNT(*) as total_leads,
                        COUNT(CASE WHEN conversion_status = 'won' THEN 1 END) as conversions,
                        SUM(estimated_value) as total_estimated_value,
                        SUM(actual_value) as total_actual_value,
                        AVG(time_to_contact_minutes) as avg_contact_time
                    FROM lead_analytics
                    GROUP BY DATE(created_at, 'start of month')
                    ORDER BY month DESC
                `
            },
            {
                name: 'County performance metrics',
                query: `
                    SELECT
                        county,
                        COUNT(DISTINCT customer_id) as unique_customers,
                        COUNT(*) as total_projects,
                        AVG(estimated_value) as avg_project_value,
                        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_projects
                    FROM projects
                    GROUP BY county
                    ORDER BY total_projects DESC
                `
            },
            {
                name: 'Workflow efficiency analysis',
                query: `
                    SELECT
                        sop_id,
                        urgency,
                        COUNT(*) as workflow_count,
                        AVG(CASE
                            WHEN completed_at IS NOT NULL
                            THEN julianday(completed_at) - julianday(started_at)
                            ELSE NULL
                        END) as avg_completion_days,
                        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count
                    FROM sop_workflows
                    GROUP BY sop_id, urgency
                    ORDER BY workflow_count DESC
                `
            }
        ];

        for (const test of aggregationTests) {
            console.log(`\n  📊 ${test.name}`);

            const result = await runQueryWithTiming(test.query);

            console.log(`    ⏱️  Execution time: ${result.executionTime.toFixed(3)}ms`);
            console.log(`    📈 Rows returned: ${result.rowCount}`);

            // Show aggregation results
            if (result.rows.length > 0) {
                console.log(`    📋 Results summary:`);
                result.rows.slice(0, 3).forEach((row, index) => {
                    const summary = Object.entries(row).slice(0, 4).map(([key, value]) =>
                        `${key}: ${value}`
                    ).join(', ');
                    console.log(`       ${index + 1}: ${summary}`);
                });
            }
        }
    }

    async runDatabaseAnalysis() {
        console.log('\n\n🔍 === Database Analysis ===');

        // Get table sizes
        const tableStats = await runQueryWithTiming(`
            SELECT
                name as table_name,
                COUNT(*) as row_count
            FROM sqlite_master
            WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
        `);

        console.log('\n  📊 Table Statistics:');

        // Get row counts for each table
        const tables = ['customers', 'projects', 'sop_workflows', 'sop_workflow_tasks',
                       'lead_assignments', 'notifications', 'integration_logs', 'lead_analytics'];

        for (const table of tables) {
            try {
                const result = await runQueryWithTiming(`SELECT COUNT(*) as count FROM ${table}`);
                console.log(`    ${table}: ${result.rows[0].count} rows`);
            } catch (error) {
                console.log(`    ${table}: Error - ${error.message}`);
            }
        }

        // Database integrity check
        console.log('\n  🔍 Database Integrity:');
        try {
            const integrityResult = await runQueryWithTiming('PRAGMA integrity_check');
            console.log(`    Integrity check: ${integrityResult.rows[0]['integrity_check']}`);
        } catch (error) {
            console.log(`    Integrity check failed: ${error.message}`);
        }

        // Foreign key check
        try {
            const fkResult = await runQueryWithTiming('PRAGMA foreign_key_check');
            if (fkResult.rows.length === 0) {
                console.log(`    Foreign key constraints: ✅ All valid`);
            } else {
                console.log(`    Foreign key violations: ${fkResult.rows.length}`);
            }
        } catch (error) {
            console.log(`    Foreign key check failed: ${error.message}`);
        }

        // Performance recommendations
        console.log('\n  💡 Performance Recommendations:');

        // Check for missing indexes on frequently queried columns
        const missingIndexChecks = [
            { table: 'customers', column: 'status', reason: 'frequently filtered' },
            { table: 'projects', column: 'type', reason: 'service type filtering' },
            { table: 'sop_workflow_tasks', column: 'status', reason: 'task status queries' },
            { table: 'notifications', column: 'sent_at', reason: 'time-based queries' }
        ];

        for (const check of missingIndexChecks) {
            // Simple heuristic: check if queries are scanning full table
            try {
                const plan = await runExplainQuery(
                    `SELECT * FROM ${check.table} WHERE ${check.column} = ?`,
                    ['dummy_value']
                );

                const isScanning = plan.some(step =>
                    step.detail && step.detail.includes('SCAN TABLE') &&
                    !step.detail.includes('USING INDEX')
                );

                if (isScanning) {
                    console.log(`    ⚠️  Consider adding index on ${check.table}.${check.column} (${check.reason})`);
                } else {
                    console.log(`    ✅ ${check.table}.${check.column} appears to be properly indexed`);
                }
            } catch (error) {
                // Ignore errors for this heuristic check
            }
        }
    }
}

// Main test runner
async function runPerformanceTests() {
    const tester = new DatabasePerformanceTester();

    try {
        await tester.runAllTests();
    } catch (error) {
        console.error('Performance test failed:', error.message);
        process.exit(1);
    } finally {
        db.close();
    }
}

// Run tests if called directly
if (require.main === module) {
    runPerformanceTests().catch(console.error);
}

module.exports = { DatabasePerformanceTester, runPerformanceTests };