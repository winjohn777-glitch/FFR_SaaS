import { Router, Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';
import { body, validationResult } from 'express-validator';

const router = Router();
const prisma = new PrismaClient();

// Helper to log integration events
async function logIntegrationEvent(
  eventType: string,
  eventData: Record<string, any>,
  success: boolean = true,
  errorMessage?: string
) {
  try {
    await prisma.integrationLog.create({
      data: {
        eventType,
        eventData: JSON.stringify(eventData),
        leadId: eventData.leadId || null,
        customerId: eventData.customerId || null,
        projectId: eventData.projectId || null,
        workflowId: eventData.workflowId || null,
        success,
        errorMessage,
        processingTimeMs: eventData.processingTimeMs || null
      }
    });
  } catch (error) {
    console.error('Failed to log integration event:', error);
  }
}

// ========================
// LEAD INTEGRATION ENDPOINTS
// ========================

// POST /api/integration/leads - Receive lead from website
// Creates a customer first, then a lead linked to that customer
router.post('/leads', [
  body('firstName').isString().isLength({ min: 1 }),
  body('lastName').isString().isLength({ min: 1 }),
  body('email').isEmail(),
  body('phone').optional().isString(),
  body('serviceType').optional().isString(),
  body('county').optional().isString(),
  body('urgency').optional().isIn(['low', 'medium', 'high', 'emergency'])
], async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      firstName, lastName, email, phone, address, city, county, zipCode,
      serviceType, urgency, notes, source, metadata
    } = req.body;

    // Get or create organization
    let org = await prisma.organization.findFirst();
    if (!org) {
      org = await prisma.organization.create({
        data: {
          name: 'Florida First Roofing LLC',
          address: '3815 HWY 1 #13, Cocoa, FL 32926',
          phone: '321-301-4512',
          email: 'info@floridafirstroofing.com'
        }
      });
    }

    // Create customer first (required for lead)
    const customer = await prisma.customer.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        phone,
        address: address || null,
        organizationId: org.id
      }
    });

    // Create lead record linked to customer
    const lead = await prisma.lead.create({
      data: {
        source: source || 'website',
        status: 'NEW',
        notes,
        customerId: customer.id
      }
    });

    // Create lead analytics record
    await prisma.leadAnalytics.create({
      data: {
        leadId: lead.id,
        customerId: customer.id,
        leadSource: source || 'website',
        serviceType: serviceType || 'general',
        county: county || 'unknown',
        urgency: urgency || 'medium',
        conversionStatus: 'new',
        deviceType: metadata?.deviceType || null,
        referrerUrl: metadata?.referrerUrl || null,
        marketingCampaign: metadata?.campaign || null
      }
    });

    // Log the integration event
    await logIntegrationEvent('lead_received', {
      leadId: lead.id,
      customerId: customer.id,
      source,
      serviceType,
      county,
      processingTimeMs: Date.now() - startTime
    });

    res.status(201).json({
      success: true,
      leadId: lead.id,
      customerId: customer.id,
      message: 'Lead received successfully'
    });
  } catch (error: any) {
    await logIntegrationEvent('lead_received', req.body, false, error.message);
    console.error('Lead integration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process lead',
      error: error.message
    });
  }
});

// POST /api/integration/customers - Create customer from lead
router.post('/customers', [
  body('leadId').optional().isString(),
  body('firstName').isString(),
  body('lastName').isString(),
  body('email').isEmail()
], async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const {
      leadId, firstName, lastName, email, phone,
      address, city, county, zipCode, customerType, source
    } = req.body;

    // Get organization ID (use default for now)
    const org = await prisma.organization.findFirst();
    if (!org) {
      return res.status(400).json({
        success: false,
        message: 'No organization configured'
      });
    }

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        phone,
        address,
        organizationId: org.id
      }
    });

    // Update lead analytics if leadId provided
    if (leadId) {
      await prisma.leadAnalytics.updateMany({
        where: { leadId },
        data: {
          customerId: customer.id,
          conversionStatus: 'qualified',
          conversionDate: new Date()
        }
      });
    }

    await logIntegrationEvent('customer_created', {
      customerId: customer.id,
      leadId,
      processingTimeMs: Date.now() - startTime
    });

    res.status(201).json({
      success: true,
      customerId: customer.id,
      message: 'Customer created successfully'
    });
  } catch (error: any) {
    await logIntegrationEvent('customer_created', req.body, false, error.message);
    console.error('Customer creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create customer',
      error: error.message
    });
  }
});

// POST /api/integration/projects - Create project from opportunity
router.post('/projects', [
  body('customerId').isString(),
  body('name').isString(),
  body('description').optional().isString()
], async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const {
      customerId, opportunityId, name, description,
      budget, startDate, endDate
    } = req.body;

    // Get organization ID
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: { organization: true }
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        budget: budget ? parseFloat(budget) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        customerId,
        opportunityId,
        organizationId: customer.organizationId
      }
    });

    // Update lead analytics
    const analytics = await prisma.leadAnalytics.findFirst({
      where: { customerId }
    });
    if (analytics) {
      await prisma.leadAnalytics.update({
        where: { id: analytics.id },
        data: {
          projectId: project.id,
          actualValue: budget ? parseFloat(budget) : null
        }
      });
    }

    await logIntegrationEvent('project_created', {
      projectId: project.id,
      customerId,
      opportunityId,
      processingTimeMs: Date.now() - startTime
    });

    res.status(201).json({
      success: true,
      projectId: project.id,
      message: 'Project created successfully'
    });
  } catch (error: any) {
    await logIntegrationEvent('project_created', req.body, false, error.message);
    console.error('Project creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
});

// ========================
// SOP WORKFLOW TRIGGER
// ========================

// POST /api/integration/trigger-sop - Trigger SOP workflow
router.post('/trigger-sop', [
  body('triggerType').isString(),
  body('procedureId').optional().isString()
], async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const {
      triggerType, procedureId, leadId, customerId, projectId,
      urgency, serviceType, metadata
    } = req.body;

    // Find matching workflow trigger
    const trigger = await prisma.workflowTrigger.findFirst({
      where: {
        triggerType,
        isActive: true
      },
      orderBy: { priority: 'desc' }
    });

    if (!trigger && !procedureId) {
      return res.status(404).json({
        success: false,
        message: 'No matching workflow trigger found'
      });
    }

    // Create workflow instance
    const workflow = await prisma.sopWorkflow.create({
      data: {
        workflowId: `WF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        procedureId: procedureId || (trigger?.sopProcedures ? JSON.parse(trigger.sopProcedures)[0] : null),
        leadId,
        customerId,
        projectId,
        triggerType,
        urgency: urgency || 'medium',
        serviceType,
        metadata: JSON.stringify(metadata || {}),
        startedAt: new Date()
      }
    });

    // Create workflow execution record
    await prisma.sopWorkflowExecution.create({
      data: {
        workflowId: workflow.id,
        executionNumber: 1,
        status: 'running'
      }
    });

    await logIntegrationEvent('sop_triggered', {
      workflowId: workflow.id,
      triggerType,
      procedureId: workflow.procedureId,
      leadId,
      customerId,
      projectId,
      processingTimeMs: Date.now() - startTime
    });

    res.status(201).json({
      success: true,
      workflowId: workflow.id,
      message: 'SOP workflow triggered successfully'
    });
  } catch (error: any) {
    await logIntegrationEvent('sop_triggered', req.body, false, error.message);
    console.error('SOP trigger error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to trigger SOP workflow',
      error: error.message
    });
  }
});

// ========================
// NOTIFICATION ENDPOINTS
// ========================

// POST /api/integration/notifications - Create notification
router.post('/notifications', [
  body('type').isString(),
  body('title').isString(),
  body('message').isString(),
  body('recipientType').isString()
], async (req: Request, res: Response) => {
  try {
    const {
      type, title, message, urgency, recipientType, recipientId,
      channels, leadId, customerId, projectId, workflowId, metadata
    } = req.body;

    const notification = await prisma.notification.create({
      data: {
        notificationId: `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
        title,
        message,
        urgency: urgency || 'medium',
        recipientType,
        recipientId,
        channels: JSON.stringify(channels || ['email']),
        leadId,
        customerId,
        projectId,
        workflowId,
        metadata: JSON.stringify(metadata || {})
      }
    });

    res.status(201).json({
      success: true,
      notificationId: notification.id,
      message: 'Notification created successfully'
    });
  } catch (error: any) {
    console.error('Notification creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message
    });
  }
});

// ========================
// COMMUNICATION LOG
// ========================

// POST /api/integration/communications - Log customer communication
router.post('/communications', [
  body('customerId').isString(),
  body('communicationType').isIn(['email', 'phone', 'text', 'meeting', 'site_visit']),
  body('direction').isIn(['inbound', 'outbound'])
], async (req: Request, res: Response) => {
  try {
    const {
      customerId, leadId, projectId, communicationType, direction,
      subject, content, channel, fromContact, toContact,
      durationMinutes, outcome, followUpRequired, followUpDate
    } = req.body;

    const communication = await prisma.customerCommunication.create({
      data: {
        customerId,
        leadId,
        projectId,
        communicationType,
        direction,
        subject,
        content,
        channel,
        fromContact,
        toContact,
        durationMinutes,
        outcome,
        followUpRequired: followUpRequired || false,
        followUpDate: followUpDate ? new Date(followUpDate) : null
      }
    });

    // Update lead analytics touchpoints
    if (leadId) {
      await prisma.leadAnalytics.updateMany({
        where: { leadId },
        data: { touchpoints: { increment: 1 } }
      });
    }

    res.status(201).json({
      success: true,
      communicationId: communication.id,
      message: 'Communication logged successfully'
    });
  } catch (error: any) {
    console.error('Communication log error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to log communication',
      error: error.message
    });
  }
});

// ========================
// INTEGRATION LOGS
// ========================

// GET /api/integration/logs - Get integration logs
router.get('/logs', async (req: Request, res: Response) => {
  try {
    const { eventType, success, limit = '50', offset = '0' } = req.query;

    const where: any = {};
    if (eventType) where.eventType = eventType as string;
    if (success !== undefined) where.success = success === 'true';

    const logs = await prisma.integrationLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    });

    res.json({
      success: true,
      data: logs
    });
  } catch (error: any) {
    console.error('Error fetching integration logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve integration logs',
      error: error.message
    });
  }
});

// GET /api/integration/stats - Get integration statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const [totalEvents, successfulEvents, failedEvents, recentEvents] = await Promise.all([
      prisma.integrationLog.count(),
      prisma.integrationLog.count({ where: { success: true } }),
      prisma.integrationLog.count({ where: { success: false } }),
      prisma.integrationLog.count({
        where: {
          timestamp: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        totalEvents,
        successfulEvents,
        failedEvents,
        successRate: totalEvents > 0 ? ((successfulEvents / totalEvents) * 100).toFixed(2) : 0,
        eventsLast24Hours: recentEvents
      }
    });
  } catch (error: any) {
    console.error('Error fetching integration stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve integration statistics',
      error: error.message
    });
  }
});

export default router;
