// Florida First Roofing - Lead Integration API
// Backend integration endpoints for website-to-CRM pipeline

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const {
    authMiddleware
} = require('../middleware/auth');

// ========================
// LEAD INTEGRATION ENDPOINTS
// ========================

// Create customer from website lead
router.post('/customers', authMiddleware, async (req, res) => {
    try {
        const {
            leadId,
            customerNumber,
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            county,
            zipCode,
            customerType,
            leadSource,
            acquisitionDate,
            totalValue,
            status,
            preferences,
            metadata
        } = req.body;

        const query = `
      INSERT INTO customers (
        lead_id, customer_number, first_name, last_name, email, phone,
        address, city, county, zip_code, customer_type, lead_source,
        acquisition_date, total_value, status, preferences, metadata,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const values = [
            leadId,
            customerNumber,
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            county,
            zipCode,
            customerType,
            leadSource,
            acquisitionDate || new Date().toISOString(),
            totalValue || 0,
            status || 'active',
            JSON.stringify(preferences || {}),
            JSON.stringify(metadata || {}),
            new Date().toISOString(),
            new Date().toISOString()
        ];

        db.run(query, values, function(err) {
            if (err) {
                console.error('Customer creation error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create customer',
                    error: err.message
                });
            }

            // Log integration event
            logIntegrationEvent('customer_created', {
                customerId: this.lastID,
                leadId,
                customerNumber
            });

            res.status(201).json({
                success: true,
                customerId: this.lastID,
                customerNumber,
                message: 'Customer created successfully'
            });
        });

    } catch (error) {
        console.error('Customer creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Create project from lead
router.post('/projects', authMiddleware, async (req, res) => {
    try {
        const {
            customerId,
            leadId,
            name,
            type,
            status,
            priority,
            address,
            county,
            estimatedValue,
            description,
            metadata
        } = req.body;

        const projectNumber = generateProjectNumber();

        const query = `
      INSERT INTO projects (
        customer_id, lead_id, project_number, name, type, status,
        priority, address, county, estimated_value, actual_value,
        description, metadata, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const values = [
            customerId,
            leadId,
            projectNumber,
            name,
            type,
            status || 'estimation',
            priority,
            address,
            county,
            estimatedValue || 0,
            0, // actual_value
            description,
            JSON.stringify(metadata || {}),
            new Date().toISOString(),
            new Date().toISOString()
        ];

        db.run(query, values, function(err) {
            if (err) {
                console.error('Project creation error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create project',
                    error: err.message
                });
            }

            // Log integration event
            logIntegrationEvent('project_created', {
                projectId: this.lastID,
                customerId,
                leadId,
                projectNumber
            });

            res.status(201).json({
                success: true,
                projectId: this.lastID,
                projectNumber,
                message: 'Project created successfully'
            });
        });

    } catch (error) {
        console.error('Project creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// ========================
// SOP WORKFLOW AUTOMATION
// ========================

// Trigger SOP workflows
router.post('/sop/workflows/trigger', authMiddleware, async (req, res) => {
    try {
        const {
            sopId,
            leadId,
            urgency,
            serviceType,
            metadata
        } = req.body;

        // Create workflow instance
        const workflowId = generateWorkflowId();
        const workflowQuery = `
      INSERT INTO sop_workflows (
        workflow_id, sop_id, lead_id, trigger_type, status,
        urgency, service_type, metadata, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const workflowValues = [
            workflowId,
            sopId,
            leadId,
            'lead_integration',
            'active',
            urgency,
            serviceType,
            JSON.stringify(metadata || {}),
            new Date().toISOString(),
            new Date().toISOString()
        ];

        db.run(workflowQuery, workflowValues, function(err) {
            if (err) {
                console.error('Workflow creation error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create workflow',
                    error: err.message
                });
            }

            // Create workflow tasks based on SOP
            createWorkflowTasks(workflowId, sopId, urgency, (taskErr) => {
                if (taskErr) {
                    console.error('Task creation error:', taskErr);
                }
            });

            // Log integration event
            logIntegrationEvent('sop_triggered', {
                workflowId,
                sopId,
                leadId
            });

            res.status(201).json({
                success: true,
                workflowId,
                sopId,
                message: 'SOP workflow triggered successfully'
            });
        });

    } catch (error) {
        console.error('SOP trigger error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// Get workflow status
router.get('/sop/workflows/:workflowId', authMiddleware, (req, res) => {
    const {
        workflowId
    } = req.params;

    const query = `
    SELECT w.*, s.title as sop_title, s.category
    FROM sop_workflows w
    LEFT JOIN sop_procedures s ON w.sop_id = s.sop_number
    WHERE w.workflow_id = ?
  `;

    db.get(query, [workflowId], (err, workflow) => {
        if (err) {
            console.error('Workflow fetch error:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch workflow',
                error: err.message
            });
        }

        if (!workflow) {
            return res.status(404).json({
                success: false,
                message: 'Workflow not found'
            });
        }

        // Get workflow tasks
        const taskQuery = `
      SELECT * FROM sop_workflow_tasks
      WHERE workflow_id = ?
      ORDER BY sequence_number
    `;

        db.all(taskQuery, [workflowId], (taskErr, tasks) => {
            if (taskErr) {
                console.error('Task fetch error:', taskErr);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch tasks',
                    error: taskErr.message
                });
            }

            res.json({
                success: true,
                workflow: {
                    ...workflow,
                    metadata: JSON.parse(workflow.metadata || '{}'),
                    tasks: tasks.map(task => ({
                        ...task,
                        metadata: JSON.parse(task.metadata || '{}')
                    }))
                }
            });
        });
    });
});

// ========================
// TEAM ASSIGNMENT
// ========================

// Assign team members to lead
router.post('/team/assign', authMiddleware, async (req, res) => {
    try {
        const {
            leadId,
            serviceType,
            county,
            urgency,
            estimatedValue
        } = req.body;

        // Determine assignments based on business rules
        const assignment = await determineTeamAssignment({
            serviceType,
            county,
            urgency,
            estimatedValue
        });

        // Save assignments to database
        const assignmentQuery = `
      INSERT INTO lead_assignments (
        lead_id, sales_rep, project_manager, estimator,
        assignment_date, assignment_rules, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

        const assignmentValues = [
            leadId,
            assignment.salesRep,
            assignment.projectManager,
            assignment.estimator,
            new Date().toISOString(),
            JSON.stringify(assignment.rules),
            new Date().toISOString()
        ];

        db.run(assignmentQuery, assignmentValues, function(err) {
            if (err) {
                console.error('Assignment error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to assign team',
                    error: err.message
                });
            }

            // Log integration event
            logIntegrationEvent('team_assigned', {
                leadId,
                assignment
            });

            // Send notifications to assigned team members
            sendAssignmentNotifications(leadId, assignment);

            res.status(201).json({
                success: true,
                assignment,
                message: 'Team assigned successfully'
            });
        });

    } catch (error) {
        console.error('Team assignment error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// ========================
// NOTIFICATIONS
// ========================

// Send lead received notification
router.post('/notifications/lead-received', authMiddleware, async (req, res) => {
    try {
        const {
            lead,
            integration,
            urgency,
            timestamp
        } = req.body;

        // Create notification record
        const notificationId = generateNotificationId();
        const notificationQuery = `
      INSERT INTO notifications (
        notification_id, type, title, message, urgency,
        recipient_type, metadata, created_at, read_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const title = `New ${urgency.toUpperCase()} Lead: ${lead.firstName} ${lead.lastName}`;
        const message = `${lead.serviceType} in ${lead.county} County - ${lead.description}`;

        const notificationValues = [
            notificationId,
            'lead_received',
            title,
            message,
            urgency,
            'internal_team',
            JSON.stringify({
                lead,
                integration
            }),
            timestamp,
            null
        ];

        db.run(notificationQuery, notificationValues, function(err) {
            if (err) {
                console.error('Notification creation error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to create notification',
                    error: err.message
                });
            }

            // Send real-time notifications (WebSocket, email, SMS)
            sendRealTimeNotifications({
                id: notificationId,
                type: 'lead_received',
                title,
                message,
                urgency,
                lead
            });

            res.status(201).json({
                success: true,
                notificationId,
                message: 'Notification sent successfully'
            });
        });

    } catch (error) {
        console.error('Notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
});

// ========================
// INTEGRATION ANALYTICS
// ========================

// Get lead integration analytics
router.get('/analytics/integration', authMiddleware, (req, res) => {
    const {
        start,
        end
    } = req.query;
    const startDate = start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = end || new Date().toISOString();

    const analyticsQuery = `
    SELECT
      DATE(created_at) as date,
      COUNT(*) as total_leads,
      SUM(CASE WHEN status = 'converted' THEN 1 ELSE 0 END) as converted_leads,
      SUM(total_value) as total_estimated_value,
      AVG(CASE WHEN converted_at IS NOT NULL THEN
        (julianday(converted_at) - julianday(created_at)) * 24
      END) as avg_conversion_time_hours
    FROM customers
    WHERE created_at BETWEEN ? AND ?
    GROUP BY DATE(created_at)
    ORDER BY date DESC
  `;

    db.all(analyticsQuery, [startDate, endDate], (err, analytics) => {
        if (err) {
            console.error('Analytics error:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch analytics',
                error: err.message
            });
        }

        // Get SOP workflow analytics
        const sopQuery = `
      SELECT
        sop_id,
        COUNT(*) as triggered_count,
        AVG(CASE WHEN completed_at IS NOT NULL THEN
          (julianday(completed_at) - julianday(created_at)) * 24
        END) as avg_completion_time_hours
      FROM sop_workflows
      WHERE created_at BETWEEN ? AND ?
      GROUP BY sop_id
      ORDER BY triggered_count DESC
    `;

        db.all(sopQuery, [startDate, endDate], (sopErr, sopAnalytics) => {
            if (sopErr) {
                console.error('SOP analytics error:', sopErr);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to fetch SOP analytics',
                    error: sopErr.message
                });
            }

            res.json({
                success: true,
                analytics: {
                    leadTrends: analytics,
                    sopPerformance: sopAnalytics,
                    period: {
                        start: startDate,
                        end: endDate
                    }
                }
            });
        });
    });
});

// ========================
// UTILITY FUNCTIONS
// ========================

function generateProjectNumber() {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `FFR-${year}-PRJ-${random}`;
}

function generateWorkflowId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `WF-${timestamp}-${random}`;
}

function generateNotificationId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `NOTIF-${timestamp}-${random}`;
}

function logIntegrationEvent(eventType, data) {
    const logQuery = `
    INSERT INTO integration_logs (
      event_type, event_data, timestamp, created_at
    ) VALUES (?, ?, ?, ?)
  `;

    const now = new Date().toISOString();
    db.run(logQuery, [
        eventType,
        JSON.stringify(data),
        now,
        now
    ], (err) => {
        if (err) {
            console.error('Integration log error:', err);
        }
    });
}

async function determineTeamAssignment(criteria) {
    const {
        serviceType,
        county,
        urgency,
        estimatedValue
    } = criteria;

    const assignment = {
        salesRep: null,
        projectManager: null,
        estimator: null,
        rules: []
    };

    // County-based sales rep assignment
    const countyAssignments = {
        'brevard': 'sarah.johnson@floridafirstroofing.com',
        'orange': 'mike.wilson@floridafirstroofing.com',
        'volusia': 'jennifer.davis@floridafirstroofing.com',
        'seminole': 'david.brown@floridafirstroofing.com'
    };

    assignment.salesRep = countyAssignments[county.toLowerCase()] || 'admin@floridafirstroofing.com';
    assignment.rules.push(`Sales rep assigned by county: ${county}`);

    // Project manager for larger projects
    if (estimatedValue > 10000) {
        assignment.projectManager = 'pm.lead@floridafirstroofing.com';
        assignment.rules.push('Project manager assigned for high-value project');
    }

    // Estimator assignment
    if (['roof-replacement', 'roof-repair', 'commercial'].includes(serviceType)) {
        assignment.estimator = 'estimator@floridafirstroofing.com';
        assignment.rules.push(`Estimator assigned for service type: ${serviceType}`);
    }

    // Emergency overrides
    if (urgency === 'emergency') {
        assignment.projectManager = 'emergency.pm@floridafirstroofing.com';
        assignment.rules.push('Emergency project manager assigned');
    }

    return assignment;
}

function createWorkflowTasks(workflowId, sopId, urgency, callback) {
    // Get SOP steps
    const sopQuery = `
    SELECT * FROM sop_steps
    WHERE sop_number = ?
    ORDER BY step_number
  `;

    db.all(sopQuery, [sopId], (err, steps) => {
        if (err) {
            return callback(err);
        }

        if (steps.length === 0) {
            return callback(null);
        }

        // Create tasks for each step
        const taskPromises = steps.map((step, index) => {
            return new Promise((resolve, reject) => {
                const dueDate = calculateTaskDueDate(step, urgency);

                const taskQuery = `
          INSERT INTO sop_workflow_tasks (
            workflow_id, step_id, title, description, sequence_number,
            status, priority, due_date, metadata, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

                const taskValues = [
                    workflowId,
                    step.id,
                    step.title,
                    step.description,
                    step.step_number,
                    'pending',
                    urgency === 'emergency' ? 'high' : 'medium',
                    dueDate,
                    JSON.stringify({
                        originalStep: step
                    }),
                    new Date().toISOString()
                ];

                db.run(taskQuery, taskValues, function(taskErr) {
                    if (taskErr) {
                        reject(taskErr);
                    } else {
                        resolve(this.lastID);
                    }
                });
            });
        });

        Promise.all(taskPromises)
            .then(() => callback(null))
            .catch(callback);
    });
}

function calculateTaskDueDate(step, urgency) {
    const now = new Date();
    let hours = 24; // Default

    switch (urgency) {
        case 'emergency':
            hours = step.emergency_hours || 2;
            break;
        case 'high':
            hours = step.high_priority_hours || 8;
            break;
        case 'medium':
            hours = step.medium_priority_hours || 24;
            break;
        default:
            hours = step.standard_hours || 48;
    }

    return new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();
}

function sendAssignmentNotifications(leadId, assignment) {
    // Send emails/notifications to assigned team members
    // This would integrate with email service, Slack, etc.
    console.log('Assignment notifications sent for lead:', leadId, assignment);
}

function sendRealTimeNotifications(notification) {
    // Send WebSocket notifications, push notifications, etc.
    // This would integrate with WebSocket server, push notification service
    console.log('Real-time notification sent:', notification);
}

module.exports = router;