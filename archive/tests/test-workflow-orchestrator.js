#!/usr/bin/env node

/**
 * Florida First Roofing - Workflow Orchestrator Test Script
 * Tests the lead-to-CRM integration pipeline and SOP workflow automation
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'accounting.db');
const db = new sqlite3.Database(dbPath);

// Utility function to run SQL queries as promises
function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function executeQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

// Simulate incoming lead data from website
const sampleLeads = [
    {
        leadId: 'LEAD-WEB-006',
        customerData: {
            firstName: 'Sarah',
            lastName: 'Thompson',
            email: 'sarah.thompson@email.com',
            phone: '(352) 555-0106',
            address: '789 Lake View Dr',
            city: 'Leesburg',
            county: 'lake',
            zipCode: '34748',
            serviceType: 'roof-inspection',
            urgency: 'medium',
            estimatedValue: 500.00,
            leadSource: 'website',
            insuranceClaim: false,
            roofAge: 12,
            description: 'Annual roof inspection requested'
        }
    },
    {
        leadId: 'LEAD-WEB-007',
        customerData: {
            firstName: 'Carlos',
            lastName: 'Martinez',
            email: 'carlos.martinez@business.com',
            phone: '(863) 555-0107',
            address: '1200 Industrial Pkwy',
            city: 'Lakeland',
            county: 'polk',
            zipCode: '33801',
            serviceType: 'commercial',
            urgency: 'high',
            estimatedValue: 75000.00,
            leadSource: 'referral',
            insuranceClaim: false,
            buildingType: 'manufacturing',
            description: 'Large manufacturing facility roof assessment needed'
        }
    },
    {
        leadId: 'LEAD-WEB-008',
        customerData: {
            firstName: 'Emily',
            lastName: 'Foster',
            email: 'emily.foster@email.com',
            phone: '(386) 555-0108',
            address: '456 Palm Coast Dr',
            city: 'Palm Coast',
            county: 'flagler',
            zipCode: '32137',
            serviceType: 'emergency',
            urgency: 'emergency',
            estimatedValue: 15000.00,
            leadSource: 'google',
            insuranceClaim: true,
            damageType: 'hurricane',
            description: 'Hurricane damage, multiple leaks, tarp needed immediately'
        }
    }
];

// Workflow automation logic
class WorkflowOrchestrator {
    async processLead(leadData) {
        console.log(`\n=== Processing Lead: ${leadData.leadId} ===`);

        try {
            // 1. Create customer record
            const customerId = await this.createCustomer(leadData);
            console.log(`✓ Customer created with ID: ${customerId}`);

            // 2. Determine appropriate SOP workflow
            const sopId = await this.determineSOP(leadData.customerData);
            console.log(`✓ Determined SOP: ${sopId}`);

            // 3. Create and trigger workflow
            const workflowId = await this.createWorkflow(leadData.leadId, customerId, sopId, leadData.customerData);
            console.log(`✓ Workflow created: ${workflowId}`);

            // 4. Assign team members
            const assignment = await this.assignTeam(leadData.leadId, customerId, leadData.customerData);
            console.log(`✓ Team assigned: ${assignment.sales_rep}, ${assignment.project_manager}`);

            // 5. Create workflow tasks
            await this.createWorkflowTasks(workflowId, sopId, leadData.customerData);
            console.log(`✓ Workflow tasks created`);

            // 6. Send notifications
            await this.sendNotifications(leadData.leadId, customerId, workflowId, leadData.customerData);
            console.log(`✓ Notifications sent`);

            // 7. Log the integration event
            await this.logIntegrationEvent('lead_processed', leadData.leadId, customerId, workflowId, leadData);
            console.log(`✓ Integration event logged`);

            // 8. Create analytics record
            await this.createAnalyticsRecord(leadData.leadId, customerId, leadData.customerData);
            console.log(`✓ Analytics record created`);

            return { customerId, workflowId };

        } catch (error) {
            console.error(`✗ Error processing lead ${leadData.leadId}:`, error.message);
            await this.logIntegrationEvent('lead_processing_error', leadData.leadId, null, null, leadData, false, error.message);
            throw error;
        }
    }

    async createCustomer(leadData) {
        const { leadId, customerData } = leadData;
        const customerNumber = await this.generateCustomerNumber();

        const result = await executeQuery(`
            INSERT INTO customers (
                lead_id, customer_number, first_name, last_name, email, phone,
                address, city, county, zip_code, customer_type, lead_source,
                acquisition_date, metadata, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, ?)
        `, [
            leadId, customerNumber, customerData.firstName, customerData.lastName,
            customerData.email, customerData.phone, customerData.address,
            customerData.city, customerData.county, customerData.zipCode,
            customerData.serviceType === 'commercial' ? 'commercial' : 'residential',
            customerData.leadSource, JSON.stringify(customerData), customerData.description
        ]);

        return result.lastID;
    }

    async determineSOP(customerData) {
        // Business logic for SOP selection
        if (customerData.urgency === 'emergency') {
            return 'SOP-010-EMERGENCY-RESPONSE';
        } else if (customerData.serviceType === 'commercial') {
            return 'SOP-050-COMMERCIAL-PROCESS';
        } else if (customerData.insuranceClaim) {
            return 'SOP-200-INSURANCE-CLAIM';
        } else if (customerData.serviceType === 'roof-inspection') {
            return 'SOP-100-INSPECTION-PROCESS';
        } else {
            return 'SOP-001-LEAD-INTAKE';
        }
    }

    async createWorkflow(leadId, customerId, sopId, customerData) {
        const workflowId = `WF-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

        await executeQuery(`
            INSERT INTO sop_workflows (
                workflow_id, sop_id, lead_id, customer_id, trigger_type,
                status, urgency, service_type, started_at, metadata
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?)
        `, [
            workflowId, sopId, leadId, customerId, 'lead_integration',
            'active', customerData.urgency, customerData.serviceType,
            JSON.stringify({ trigger_reason: 'automated_lead_processing', customerData })
        ]);

        return workflowId;
    }

    async assignTeam(leadId, customerId, customerData) {
        // Simple team assignment logic based on county and service type
        let salesRep, projectManager, estimator;

        if (customerData.urgency === 'emergency') {
            salesRep = 'Mike Johnson';  // Emergency lead
            projectManager = 'Robert Taylor';
        } else if (customerData.serviceType === 'commercial') {
            salesRep = 'Lisa Anderson';  // Commercial specialist
            projectManager = 'Mark Davis';
        } else if (['brevard', 'volusia'].includes(customerData.county)) {
            salesRep = 'Mike Johnson';  // East coast coverage
            projectManager = 'Sarah Williams';
        } else {
            salesRep = 'David Chen';  // Central Florida coverage
            projectManager = 'Robert Taylor';
        }

        estimator = 'Tom Martinez';  // Default estimator

        await executeQuery(`
            INSERT INTO lead_assignments (
                lead_id, customer_id, sales_rep, project_manager, estimator,
                assignment_date, assignment_rules, status
            ) VALUES (?, ?, ?, ?, ?, datetime('now'), ?, ?)
        `, [
            leadId, customerId, salesRep, projectManager, estimator,
            JSON.stringify({
                county: customerData.county,
                serviceType: customerData.serviceType,
                urgency: customerData.urgency
            }),
            'active'
        ]);

        return { sales_rep: salesRep, project_manager: projectManager, estimator };
    }

    async createWorkflowTasks(workflowId, sopId, customerData) {
        const tasks = this.getTasksForSOP(sopId, customerData);

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            await executeQuery(`
                INSERT INTO sop_workflow_tasks (
                    workflow_id, title, description, sequence_number,
                    status, priority, assigned_to, due_date, metadata
                ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now', ?), ?)
            `, [
                workflowId, task.title, task.description, i + 1,
                i === 0 ? 'pending' : 'pending', task.priority,
                task.assignedTo, task.dueDays + ' days', JSON.stringify(task.metadata || {})
            ]);
        }
    }

    getTasksForSOP(sopId, customerData) {
        const taskTemplates = {
            'SOP-010-EMERGENCY-RESPONSE': [
                { title: 'Immediate Response Call', description: 'Contact customer within 30 minutes', priority: 'critical', assignedTo: 'Emergency Team', dueDays: '0', metadata: { maxResponseTime: 30 } },
                { title: 'Emergency Assessment', description: 'On-site emergency assessment and temporary protection', priority: 'critical', assignedTo: 'Emergency Team', dueDays: '0' },
                { title: 'Temporary Repairs', description: 'Install tarps or temporary repairs to prevent further damage', priority: 'high', assignedTo: 'Field Team', dueDays: '1' }
            ],
            'SOP-050-COMMERCIAL-PROCESS': [
                { title: 'Commercial Lead Qualification', description: 'Verify project scope and decision makers', priority: 'high', assignedTo: 'Lisa Anderson', dueDays: '1' },
                { title: 'Site Survey Scheduling', description: 'Schedule comprehensive site survey with engineering', priority: 'medium', assignedTo: 'Mark Davis', dueDays: '3' },
                { title: 'Engineering Assessment', description: 'Structural and compliance assessment', priority: 'medium', assignedTo: 'External Engineer', dueDays: '7' }
            ],
            'SOP-200-INSURANCE-CLAIM': [
                { title: 'Insurance Claim Assessment', description: 'Review insurance coverage and claim requirements', priority: 'high', assignedTo: 'Insurance Specialist', dueDays: '2' },
                { title: 'Adjuster Coordination', description: 'Schedule meeting with insurance adjuster', priority: 'medium', assignedTo: 'Project Manager', dueDays: '5' },
                { title: 'Documentation Preparation', description: 'Prepare detailed damage documentation and estimates', priority: 'medium', assignedTo: 'Estimator', dueDays: '7' }
            ],
            'SOP-100-INSPECTION-PROCESS': [
                { title: 'Schedule Inspection', description: 'Schedule comprehensive roof inspection', priority: 'medium', assignedTo: 'Inspector', dueDays: '3' },
                { title: 'Conduct Inspection', description: 'Perform detailed roof inspection with photos', priority: 'medium', assignedTo: 'Inspector', dueDays: '5' },
                { title: 'Inspection Report', description: 'Generate detailed inspection report with recommendations', priority: 'medium', assignedTo: 'Inspector', dueDays: '7' }
            ],
            'SOP-001-LEAD-INTAKE': [
                { title: 'Initial Contact', description: 'Contact customer within 2 hours', priority: 'high', assignedTo: 'Sales Rep', dueDays: '0' },
                { title: 'Schedule Assessment', description: 'Schedule property assessment appointment', priority: 'medium', assignedTo: 'Sales Rep', dueDays: '2' },
                { title: 'Property Assessment', description: 'Conduct on-site property assessment', priority: 'medium', assignedTo: 'Project Manager', dueDays: '5' }
            ]
        };

        return taskTemplates[sopId] || taskTemplates['SOP-001-LEAD-INTAKE'];
    }

    async sendNotifications(leadId, customerId, workflowId, customerData) {
        const notificationId = `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

        let urgencyLevel = customerData.urgency;
        let title = `New ${customerData.urgency.toUpperCase()} Lead Received`;
        let message = `${customerData.serviceType} lead from ${customerData.firstName} ${customerData.lastName} in ${customerData.county} County`;

        await executeQuery(`
            INSERT INTO notifications (
                notification_id, type, title, message, urgency,
                recipient_type, recipient_id, channels, lead_id,
                customer_id, workflow_id, sent_at, metadata
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), ?)
        `, [
            notificationId, 'lead_received', title, message, urgencyLevel,
            'internal_team', 'team@ffr.com', JSON.stringify(['email', 'sms']),
            leadId, customerId, workflowId, JSON.stringify(customerData)
        ]);
    }

    async logIntegrationEvent(eventType, leadId, customerId, workflowId, eventData, success = true, errorMessage = null) {
        await executeQuery(`
            INSERT INTO integration_logs (
                event_type, event_data, lead_id, customer_id, workflow_id,
                success, error_message, processing_time_ms, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `, [
            eventType, JSON.stringify(eventData), leadId, customerId, workflowId,
            success, errorMessage, Math.floor(Math.random() * 500) + 100
        ]);
    }

    async createAnalyticsRecord(leadId, customerId, customerData) {
        await executeQuery(`
            INSERT INTO lead_analytics (
                lead_id, customer_id, lead_source, service_type, county,
                urgency, estimated_value, lead_score, conversion_status,
                time_to_contact_minutes, touchpoints, device_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            leadId, customerId, customerData.leadSource, customerData.serviceType,
            customerData.county, customerData.urgency, customerData.estimatedValue,
            this.calculateLeadScore(customerData), 'new',
            null, 0, 'mobile'  // Simplified for testing
        ]);
    }

    calculateLeadScore(customerData) {
        let score = 50;  // Base score

        // Urgency bonus
        if (customerData.urgency === 'emergency') score += 30;
        else if (customerData.urgency === 'high') score += 20;
        else if (customerData.urgency === 'medium') score += 10;

        // Value bonus
        if (customerData.estimatedValue > 50000) score += 25;
        else if (customerData.estimatedValue > 20000) score += 15;
        else if (customerData.estimatedValue > 10000) score += 10;

        // Source bonus
        if (customerData.leadSource === 'referral') score += 15;
        else if (customerData.leadSource === 'website') score += 10;

        // Insurance claim bonus
        if (customerData.insuranceClaim) score += 10;

        return Math.min(100, score);
    }

    async generateCustomerNumber() {
        const year = new Date().getFullYear();
        const result = await runQuery('SELECT COUNT(*) as count FROM customers WHERE customer_number LIKE ?', [`CUST-${year}-%`]);
        const nextNumber = (result[0].count + 1).toString().padStart(3, '0');
        return `CUST-${year}-${nextNumber}`;
    }
}

// Test runner
async function runWorkflowTests() {
    console.log('🔧 Florida First Roofing - Workflow Orchestrator Test\n');

    const orchestrator = new WorkflowOrchestrator();

    try {
        // Process sample leads
        for (const lead of sampleLeads) {
            await orchestrator.processLead(lead);
            await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between leads
        }

        console.log('\n📊 === Test Results Summary ===');

        // Query database for verification
        const customers = await runQuery('SELECT COUNT(*) as count FROM customers');
        const workflows = await runQuery('SELECT COUNT(*) as count FROM sop_workflows WHERE status = "active"');
        const tasks = await runQuery('SELECT COUNT(*) as count FROM sop_workflow_tasks WHERE status = "pending"');
        const notifications = await runQuery('SELECT COUNT(*) as count FROM notifications');
        const logs = await runQuery('SELECT COUNT(*) as count FROM integration_logs WHERE success = 1');

        console.log(`✓ Total Customers: ${customers[0].count}`);
        console.log(`✓ Active Workflows: ${workflows[0].count}`);
        console.log(`✓ Pending Tasks: ${tasks[0].count}`);
        console.log(`✓ Notifications Sent: ${notifications[0].count}`);
        console.log(`✓ Successful Integration Events: ${logs[0].count}`);

        // Show workflow distribution
        const workflowDistribution = await runQuery(`
            SELECT sop_id, COUNT(*) as count
            FROM sop_workflows
            GROUP BY sop_id
            ORDER BY count DESC
        `);

        console.log('\n📈 Workflow Distribution:');
        workflowDistribution.forEach(row => {
            console.log(`   ${row.sop_id}: ${row.count} instances`);
        });

        // Show urgency distribution
        const urgencyDistribution = await runQuery(`
            SELECT urgency, COUNT(*) as count
            FROM sop_workflows
            GROUP BY urgency
            ORDER BY count DESC
        `);

        console.log('\n⚡ Urgency Distribution:');
        urgencyDistribution.forEach(row => {
            console.log(`   ${row.urgency}: ${row.count} workflows`);
        });

        console.log('\n✅ Workflow orchestrator test completed successfully!');

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        process.exit(1);
    } finally {
        db.close();
    }
}

// Run the test if called directly
if (require.main === module) {
    runWorkflowTests().catch(console.error);
}

module.exports = { WorkflowOrchestrator, runWorkflowTests };