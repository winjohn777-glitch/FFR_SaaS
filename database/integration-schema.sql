-- Florida First Roofing - Integration Database Schema
-- Tables for website-to-CRM lead integration pipeline

-- Enhanced customers table for CRM integration
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id VARCHAR(50) UNIQUE, -- Reference to website lead
    customer_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    county VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    customer_type VARCHAR(20) DEFAULT 'residential', -- residential, commercial
    lead_source VARCHAR(50) NOT NULL, -- website, google, referral, social, direct
    acquisition_date DATETIME NOT NULL,
    total_value DECIMAL(10,2) DEFAULT 0,
    project_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, archived
    assigned_sales_rep VARCHAR(255),
    assigned_project_manager VARCHAR(255),
    preferences TEXT, -- JSON: contact preferences, communication frequency
    metadata TEXT, -- JSON: original lead data, conversion info, lifetime value
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced projects table with lead integration
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    lead_id VARCHAR(50), -- Reference to original lead
    project_number VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL, -- roof-repair, roof-replacement, inspection, etc.
    status VARCHAR(20) DEFAULT 'estimation', -- estimation, scheduled, in-progress, completed, cancelled
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, emergency
    address TEXT NOT NULL,
    county VARCHAR(50) NOT NULL,
    estimated_value DECIMAL(10,2) DEFAULT 0,
    actual_value DECIMAL(10,2) DEFAULT 0,
    start_date DATE,
    completion_date DATE,
    description TEXT,
    metadata TEXT, -- JSON: roof details, damage info, insurance claim status
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- SOP workflow instances triggered by leads
CREATE TABLE IF NOT EXISTS sop_workflows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workflow_id VARCHAR(50) UNIQUE NOT NULL,
    sop_id VARCHAR(20) NOT NULL, -- References sop_procedures.sop_number
    lead_id VARCHAR(50), -- Reference to original lead
    customer_id INTEGER, -- Reference to customer record
    project_id INTEGER, -- Reference to project record
    trigger_type VARCHAR(30) NOT NULL, -- lead_integration, manual, scheduled
    status VARCHAR(20) DEFAULT 'active', -- active, completed, paused, cancelled
    urgency VARCHAR(20) DEFAULT 'medium', -- low, medium, high, emergency
    service_type VARCHAR(50),
    assigned_to VARCHAR(255),
    started_at DATETIME,
    completed_at DATETIME,
    metadata TEXT, -- JSON: trigger context, custom parameters
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (sop_id) REFERENCES sop_procedures(sop_number)
);

-- Individual tasks within SOP workflows
CREATE TABLE IF NOT EXISTS sop_workflow_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workflow_id VARCHAR(50) NOT NULL,
    step_id INTEGER, -- References sop_steps.id
    title VARCHAR(200) NOT NULL,
    description TEXT,
    sequence_number INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed, skipped, failed
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    assigned_to VARCHAR(255),
    due_date DATETIME,
    started_at DATETIME,
    completed_at DATETIME,
    completion_notes TEXT,
    metadata TEXT, -- JSON: task-specific data, attachments, etc.
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES sop_workflows(workflow_id),
    FOREIGN KEY (step_id) REFERENCES sop_steps(id)
);

-- Team assignments for leads and projects
CREATE TABLE IF NOT EXISTS lead_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id VARCHAR(50) NOT NULL,
    customer_id INTEGER,
    project_id INTEGER,
    sales_rep VARCHAR(255),
    project_manager VARCHAR(255),
    estimator VARCHAR(255),
    assignment_date DATETIME NOT NULL,
    assignment_rules TEXT, -- JSON: rules used for assignment
    reassignment_history TEXT, -- JSON: history of reassignments
    status VARCHAR(20) DEFAULT 'active', -- active, completed, reassigned
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Notifications and alerts
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    notification_id VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(30) NOT NULL, -- lead_received, sop_due, project_update, etc.
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    urgency VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    recipient_type VARCHAR(30) NOT NULL, -- internal_team, customer, vendor
    recipient_id VARCHAR(255), -- email, user_id, team_id
    channels TEXT, -- JSON: email, sms, push, webhook
    lead_id VARCHAR(50),
    customer_id INTEGER,
    project_id INTEGER,
    workflow_id VARCHAR(50),
    metadata TEXT, -- JSON: notification context, tracking info
    sent_at DATETIME,
    read_at DATETIME,
    acknowledged_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (workflow_id) REFERENCES sop_workflows(workflow_id)
);

-- Integration event logs for tracking and debugging
CREATE TABLE IF NOT EXISTS integration_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type VARCHAR(50) NOT NULL, -- customer_created, sop_triggered, team_assigned, etc.
    event_data TEXT NOT NULL, -- JSON: complete event payload
    lead_id VARCHAR(50),
    customer_id INTEGER,
    project_id INTEGER,
    workflow_id VARCHAR(50),
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    processing_time_ms INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (workflow_id) REFERENCES sop_workflows(workflow_id)
);

-- Lead analytics and conversion tracking
CREATE TABLE IF NOT EXISTS lead_analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id VARCHAR(50) NOT NULL,
    customer_id INTEGER,
    project_id INTEGER,
    lead_source VARCHAR(50) NOT NULL,
    service_type VARCHAR(50) NOT NULL,
    county VARCHAR(50) NOT NULL,
    urgency VARCHAR(20) NOT NULL,
    estimated_value DECIMAL(10,2),
    actual_value DECIMAL(10,2),
    lead_score INTEGER DEFAULT 0, -- Calculated lead quality score
    conversion_status VARCHAR(30) DEFAULT 'new', -- new, contacted, qualified, proposal, won, lost
    conversion_date DATETIME,
    conversion_value DECIMAL(10,2),
    time_to_contact_minutes INTEGER,
    time_to_conversion_hours INTEGER,
    touchpoints INTEGER DEFAULT 0, -- Number of customer interactions
    marketing_campaign VARCHAR(100),
    referrer_url TEXT,
    device_type VARCHAR(20), -- desktop, mobile, tablet
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Customer communication history
CREATE TABLE IF NOT EXISTS customer_communications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    lead_id VARCHAR(50),
    project_id INTEGER,
    communication_type VARCHAR(30) NOT NULL, -- email, phone, text, meeting, site_visit
    direction VARCHAR(10) NOT NULL, -- inbound, outbound
    subject VARCHAR(200),
    content TEXT,
    channel VARCHAR(50), -- gmail, phone_system, sms_gateway, in_person
    from_contact VARCHAR(255),
    to_contact VARCHAR(255),
    duration_minutes INTEGER, -- for phone calls, meetings
    outcome VARCHAR(50), -- scheduled, info_gathered, proposal_sent, etc.
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATETIME,
    attachments TEXT, -- JSON: file references, links
    metadata TEXT, -- JSON: call recording, email thread, etc.
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- Marketing campaign tracking
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(30) NOT NULL, -- google_ads, facebook, email, referral, direct_mail
    status VARCHAR(20) DEFAULT 'active', -- active, paused, completed, cancelled
    budget DECIMAL(10,2),
    cost_per_lead DECIMAL(10,2),
    target_counties TEXT, -- JSON: array of target counties
    target_services TEXT, -- JSON: array of target services
    start_date DATE,
    end_date DATE,
    leads_generated INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue_generated DECIMAL(10,2) DEFAULT 0,
    roi_percentage DECIMAL(5,2),
    metadata TEXT, -- JSON: campaign settings, tracking codes
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Link leads to marketing campaigns
CREATE TABLE IF NOT EXISTS lead_campaign_attribution (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id VARCHAR(50) NOT NULL,
    campaign_id VARCHAR(50) NOT NULL,
    attribution_type VARCHAR(20) DEFAULT 'direct', -- direct, assisted, last_touch, first_touch
    click_data TEXT, -- JSON: utm parameters, referrer data
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES marketing_campaigns(campaign_id)
);

-- County-specific business rules and requirements
CREATE TABLE IF NOT EXISTS county_requirements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    county VARCHAR(50) NOT NULL,
    permit_required BOOLEAN DEFAULT TRUE,
    permit_office_name VARCHAR(200),
    permit_office_phone VARCHAR(20),
    permit_office_address TEXT,
    permit_fees_range VARCHAR(50), -- "$150-$500"
    special_requirements TEXT, -- JSON: hurricane codes, coastal requirements
    avg_permit_time_days INTEGER,
    inspection_requirements TEXT, -- JSON: required inspections
    building_code_version VARCHAR(20),
    hvhz_zone BOOLEAN DEFAULT FALSE, -- High Velocity Hurricane Zone
    wind_load_requirements VARCHAR(50),
    material_restrictions TEXT, -- JSON: restricted materials
    contractor_license_required VARCHAR(100),
    insurance_requirements TEXT, -- JSON: coverage requirements
    seasonal_restrictions TEXT, -- JSON: seasonal work limitations
    metadata TEXT, -- JSON: additional county-specific data
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Automated workflow triggers and rules
CREATE TABLE IF NOT EXISTS workflow_triggers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trigger_name VARCHAR(100) NOT NULL,
    trigger_type VARCHAR(30) NOT NULL, -- lead_received, status_change, time_based, manual
    conditions TEXT NOT NULL, -- JSON: trigger conditions
    actions TEXT NOT NULL, -- JSON: actions to execute
    sop_to_trigger VARCHAR(20), -- SOP number to trigger
    priority VARCHAR(20) DEFAULT 'medium',
    active BOOLEAN DEFAULT TRUE,
    execution_count INTEGER DEFAULT 0,
    last_executed DATETIME,
    metadata TEXT, -- JSON: trigger settings, history
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sop_to_trigger) REFERENCES sop_procedures(sop_number)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_lead_id ON customers(lead_id);
CREATE INDEX IF NOT EXISTS idx_customers_county ON customers(county);
CREATE INDEX IF NOT EXISTS idx_customers_lead_source ON customers(lead_source);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);

CREATE INDEX IF NOT EXISTS idx_projects_customer_id ON projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_projects_lead_id ON projects(lead_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_county ON projects(county);

CREATE INDEX IF NOT EXISTS idx_sop_workflows_lead_id ON sop_workflows(lead_id);
CREATE INDEX IF NOT EXISTS idx_sop_workflows_status ON sop_workflows(status);
CREATE INDEX IF NOT EXISTS idx_sop_workflows_sop_id ON sop_workflows(sop_id);

CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_urgency ON notifications(urgency);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON notifications(read_at);

CREATE INDEX IF NOT EXISTS idx_integration_logs_event_type ON integration_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_integration_logs_timestamp ON integration_logs(timestamp);

CREATE INDEX IF NOT EXISTS idx_lead_analytics_lead_source ON lead_analytics(lead_source);
CREATE INDEX IF NOT EXISTS idx_lead_analytics_conversion_status ON lead_analytics(conversion_status);
CREATE INDEX IF NOT EXISTS idx_lead_analytics_created_at ON lead_analytics(created_at);

-- Insert initial county requirements data for Florida counties
INSERT OR IGNORE INTO county_requirements (
    county, permit_required, permit_office_name, permit_office_phone,
    avg_permit_time_days, hvhz_zone, wind_load_requirements,
    contractor_license_required, building_code_version
) VALUES
('brevard', TRUE, 'Brevard County Building Department', '(321) 633-2090', 10, TRUE, '150+ MPH', 'State of Florida License Required', 'FBC 2020'),
('orange', TRUE, 'Orange County Building Department', '(407) 836-8550', 7, FALSE, '120 MPH', 'State of Florida License Required', 'FBC 2020'),
('volusia', TRUE, 'Volusia County Building Department', '(386) 736-5980', 8, TRUE, '130 MPH', 'State of Florida License Required', 'FBC 2020'),
('seminole', TRUE, 'Seminole County Building Department', '(407) 665-7200', 5, FALSE, '115 MPH', 'State of Florida License Required', 'FBC 2020'),
('osceola', TRUE, 'Osceola County Building Department', '(407) 742-0500', 6, FALSE, '120 MPH', 'State of Florida License Required', 'FBC 2020'),
('lake', TRUE, 'Lake County Building Department', '(352) 253-5600', 8, FALSE, '110 MPH', 'State of Florida License Required', 'FBC 2020'),
('polk', TRUE, 'Polk County Building Department', '(863) 534-6060', 9, FALSE, '115 MPH', 'State of Florida License Required', 'FBC 2020'),
('marion', TRUE, 'Marion County Building Department', '(352) 438-2500', 10, FALSE, '105 MPH', 'State of Florida License Required', 'FBC 2020'),
('flagler', TRUE, 'Flagler County Building Department', '(386) 313-4020', 7, TRUE, '140 MPH', 'State of Florida License Required', 'FBC 2020'),
('putnam', TRUE, 'Putnam County Building Department', '(386) 329-0365', 12, FALSE, '105 MPH', 'State of Florida License Required', 'FBC 2020');

-- Insert initial workflow triggers
INSERT OR IGNORE INTO workflow_triggers (
    trigger_name, trigger_type, conditions, actions, sop_to_trigger, priority
) VALUES
('Emergency Lead Response', 'lead_received',
 '{"urgency": "emergency", "serviceType": ["emergency", "storm-damage"]}',
 '{"notify_team": true, "assign_priority": "critical", "schedule_immediate": true}',
 'SOP-010-EMERGENCY-RESPONSE', 'critical'),

('High Priority Lead Assignment', 'lead_received',
 '{"urgency": "high", "estimatedValue": {"min": 5000}}',
 '{"assign_sales_rep": true, "schedule_assessment": "24_hours"}',
 'SOP-001-LEAD-INTAKE', 'high'),

('Insurance Claim Workflow', 'lead_received',
 '{"insuranceClaim": true}',
 '{"trigger_documentation": true, "assign_adjuster_liaison": true}',
 'SOP-200-INSURANCE-CLAIM', 'medium'),

('Commercial Project Workflow', 'lead_received',
 '{"serviceType": "commercial", "estimatedValue": {"min": 20000}}',
 '{"assign_commercial_team": true, "require_site_survey": true}',
 'SOP-050-COMMERCIAL-PROCESS', 'medium');

-- Initial marketing campaigns
INSERT OR IGNORE INTO marketing_campaigns (
    campaign_id, name, type, status, target_counties, target_services,
    start_date, leads_generated, conversions, cost_per_lead
) VALUES
('GOOGLE-2024-STORM', 'Google Ads - Storm Damage 2024', 'google_ads', 'active',
 '["brevard", "orange", "volusia", "seminole"]', '["emergency", "roof-repair", "storm-damage"]',
 '2024-01-01', 245, 87, 125.50),

('FB-2024-REPLACEMENT', 'Facebook - Roof Replacement 2024', 'facebook', 'active',
 '["brevard", "orange", "volusia"]', '["roof-replacement", "residential"]',
 '2024-01-01', 156, 34, 89.25),

('REFERRAL-2024', 'Customer Referral Program 2024', 'referral', 'active',
 '["brevard", "orange", "volusia", "seminole", "osceola"]',
 '["roof-repair", "roof-replacement", "inspection"]',
 '2024-01-01', 98, 78, 25.00);

-- Add triggers for automatic SOP assignments based on lead characteristics
-- This would be expanded with actual business logic