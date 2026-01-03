-- Florida First Roofing - Construction Accounting Database Schema
-- Comprehensive schema for CRM, Project Management, SOP Integration, and Accounting

-- =====================================================
-- CUSTOMERS & CRM MANAGEMENT
-- =====================================================

CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id TEXT UNIQUE,
    customer_number TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT DEFAULT 'FL',
    county TEXT,
    zip_code TEXT,
    customer_type TEXT DEFAULT 'residential', -- residential, commercial, insurance
    lead_source TEXT, -- website, referral, advertising, etc.
    acquisition_date TEXT,
    total_value REAL DEFAULT 0,
    status TEXT DEFAULT 'active', -- active, inactive, converted, archived
    converted_at TEXT,
    credit_limit REAL DEFAULT 0,
    payment_terms TEXT DEFAULT 'Net 30',
    preferences TEXT, -- JSON
    metadata TEXT, -- JSON for additional data
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- =====================================================
-- PROJECTS & JOB MANAGEMENT
-- =====================================================

CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    lead_id TEXT,
    project_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- roof-replacement, roof-repair, commercial, maintenance, emergency
    status TEXT DEFAULT 'estimation', -- estimation, active, completed, on-hold, cancelled
    priority TEXT DEFAULT 'medium', -- low, medium, high, emergency
    address TEXT,
    county TEXT,
    hvhz_zone BOOLEAN DEFAULT FALSE, -- High Velocity Hurricane Zone
    estimated_value REAL DEFAULT 0,
    actual_value REAL DEFAULT 0,
    contract_value REAL DEFAULT 0,
    start_date TEXT,
    end_date TEXT,
    completion_percentage REAL DEFAULT 0,
    description TEXT,
    weather_delays INTEGER DEFAULT 0,
    permit_number TEXT,
    insurance_claim_number TEXT,
    warranty_start_date TEXT,
    warranty_end_date TEXT,
    metadata TEXT, -- JSON
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- =====================================================
-- SOP MANAGEMENT SYSTEM
-- =====================================================

CREATE TABLE IF NOT EXISTS sop_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_code TEXT UNIQUE NOT NULL, -- 1000-1999, 2000-2999, etc.
    name TEXT NOT NULL,
    description TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sop_procedures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sop_number TEXT UNIQUE NOT NULL, -- SOP-1001, SOP-2005, etc.
    category_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    version TEXT DEFAULT '1.0',
    status TEXT DEFAULT 'active', -- active, inactive, draft, archived
    priority TEXT DEFAULT 'medium',
    applicable_roles TEXT, -- JSON array
    florida_specific BOOLEAN DEFAULT FALSE,
    hvhz_required BOOLEAN DEFAULT FALSE,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES sop_categories(id)
);

CREATE TABLE IF NOT EXISTS sop_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sop_number TEXT,
    step_number INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    estimated_duration INTEGER, -- minutes
    required BOOLEAN DEFAULT TRUE,
    dependencies TEXT, -- JSON array of step IDs
    emergency_hours INTEGER DEFAULT 2,
    high_priority_hours INTEGER DEFAULT 8,
    medium_priority_hours INTEGER DEFAULT 24,
    standard_hours INTEGER DEFAULT 48,
    created_at TEXT NOT NULL,
    FOREIGN KEY (sop_number) REFERENCES sop_procedures(sop_number)
);

-- =====================================================
-- SOP WORKFLOW AUTOMATION
-- =====================================================

CREATE TABLE IF NOT EXISTS sop_workflows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workflow_id TEXT UNIQUE NOT NULL,
    sop_id TEXT,
    lead_id TEXT,
    project_id INTEGER,
    trigger_type TEXT, -- lead_integration, project_milestone, manual, scheduled
    status TEXT DEFAULT 'active', -- active, completed, paused, cancelled
    urgency TEXT DEFAULT 'medium', -- emergency, high, medium, low
    service_type TEXT,
    assigned_to TEXT,
    started_at TEXT,
    completed_at TEXT,
    metadata TEXT, -- JSON
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (sop_id) REFERENCES sop_procedures(sop_number)
);

CREATE TABLE IF NOT EXISTS sop_workflow_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workflow_id TEXT,
    step_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    sequence_number INTEGER,
    status TEXT DEFAULT 'pending', -- pending, in_progress, completed, skipped, failed
    priority TEXT DEFAULT 'medium',
    assigned_to TEXT,
    due_date TEXT,
    started_at TEXT,
    completed_at TEXT,
    notes TEXT,
    metadata TEXT, -- JSON
    created_at TEXT NOT NULL,
    FOREIGN KEY (workflow_id) REFERENCES sop_workflows(workflow_id),
    FOREIGN KEY (step_id) REFERENCES sop_steps(id)
);

-- =====================================================
-- TEAM ASSIGNMENT & MANAGEMENT
-- =====================================================

CREATE TABLE IF NOT EXISTS lead_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id TEXT,
    project_id INTEGER,
    sales_rep TEXT,
    project_manager TEXT,
    estimator TEXT,
    field_supervisor TEXT,
    assignment_date TEXT,
    assignment_rules TEXT, -- JSON
    created_at TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

-- =====================================================
-- NOTIFICATIONS & COMMUNICATION
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    notification_id TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL, -- lead_received, sop_triggered, project_milestone, payment_due, etc.
    title TEXT NOT NULL,
    message TEXT,
    urgency TEXT DEFAULT 'medium', -- emergency, high, medium, low
    recipient_type TEXT, -- internal_team, customer, vendor, all
    recipient_emails TEXT, -- JSON array
    channels TEXT, -- JSON array: email, sms, push, slack, etc.
    status TEXT DEFAULT 'sent', -- pending, sent, delivered, failed
    metadata TEXT, -- JSON
    created_at TEXT NOT NULL,
    read_at TEXT,
    delivered_at TEXT
);

-- =====================================================
-- VENDORS & SUBCONTRACTORS
-- =====================================================

CREATE TABLE IF NOT EXISTS vendors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vendor_number TEXT UNIQUE NOT NULL,
    company_name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT DEFAULT 'FL',
    zip_code TEXT,
    vendor_type TEXT, -- subcontractor, supplier, equipment_rental, professional_services
    tax_id TEXT,
    license_number TEXT,
    insurance_certificate_number TEXT,
    insurance_expiry_date TEXT,
    payment_terms TEXT DEFAULT 'Net 30',
    rating REAL DEFAULT 0, -- 0-5 star rating
    status TEXT DEFAULT 'active',
    metadata TEXT, -- JSON
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- =====================================================
-- ACCOUNTING & FINANCIAL MANAGEMENT
-- =====================================================

CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number TEXT UNIQUE NOT NULL,
    project_id INTEGER,
    customer_id INTEGER,
    invoice_type TEXT DEFAULT 'progress', -- progress, final, change_order, time_materials
    status TEXT DEFAULT 'draft', -- draft, sent, paid, overdue, cancelled
    invoice_date TEXT,
    due_date TEXT,
    subtotal REAL DEFAULT 0,
    tax_amount REAL DEFAULT 0,
    total_amount REAL DEFAULT 0,
    retention_percentage REAL DEFAULT 0,
    retention_amount REAL DEFAULT 0,
    amount_due REAL DEFAULT 0,
    completion_percentage REAL DEFAULT 0,
    aia_format BOOLEAN DEFAULT FALSE,
    notes TEXT,
    metadata TEXT, -- JSON
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS invoice_line_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER,
    description TEXT NOT NULL,
    quantity REAL DEFAULT 1,
    unit_price REAL DEFAULT 0,
    line_total REAL DEFAULT 0,
    cost_code TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);

-- =====================================================
-- CHANGE ORDERS
-- =====================================================

CREATE TABLE IF NOT EXISTS change_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    change_order_number TEXT UNIQUE NOT NULL,
    project_id INTEGER,
    description TEXT NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected, completed
    original_amount REAL DEFAULT 0,
    change_amount REAL DEFAULT 0,
    new_total_amount REAL DEFAULT 0,
    requested_date TEXT,
    approved_date TEXT,
    requested_by TEXT,
    approved_by TEXT,
    sop_triggered BOOLEAN DEFAULT FALSE,
    workflow_id TEXT,
    metadata TEXT, -- JSON
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (workflow_id) REFERENCES sop_workflows(workflow_id)
);

-- =====================================================
-- MATERIALS & INVENTORY
-- =====================================================

CREATE TABLE IF NOT EXISTS materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    material_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT, -- shingles, underlayment, flashing, fasteners, etc.
    unit TEXT, -- square, linear_foot, each, pound, etc.
    cost_per_unit REAL DEFAULT 0,
    supplier_id INTEGER,
    min_stock_level INTEGER DEFAULT 0,
    current_stock INTEGER DEFAULT 0,
    waste_factor REAL DEFAULT 0.1, -- 10% default waste
    florida_approved BOOLEAN DEFAULT TRUE,
    hvhz_rated BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active',
    metadata TEXT, -- JSON
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (supplier_id) REFERENCES vendors(id)
);

-- =====================================================
-- PROJECT COSTS & JOB COSTING
-- =====================================================

CREATE TABLE IF NOT EXISTS project_costs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    cost_type TEXT, -- labor, materials, equipment, subcontractor, overhead
    cost_code TEXT,
    description TEXT,
    quantity REAL DEFAULT 0,
    unit_cost REAL DEFAULT 0,
    total_cost REAL DEFAULT 0,
    vendor_id INTEGER,
    invoice_number TEXT,
    cost_date TEXT,
    sop_compliance_verified BOOLEAN DEFAULT FALSE,
    metadata TEXT, -- JSON
    created_at TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

-- =====================================================
-- COMPLIANCE & DOCUMENTATION
-- =====================================================

CREATE TABLE IF NOT EXISTS compliance_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_type TEXT, -- permit, license, insurance, warranty, lien_waiver, inspection
    project_id INTEGER,
    vendor_id INTEGER,
    document_number TEXT,
    issued_date TEXT,
    expiry_date TEXT,
    status TEXT DEFAULT 'active', -- active, expired, pending_renewal
    file_path TEXT,
    florida_building_code_compliant BOOLEAN DEFAULT TRUE,
    osha_compliant BOOLEAN DEFAULT TRUE,
    metadata TEXT, -- JSON
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

-- =====================================================
-- INTEGRATION LOGS & ANALYTICS
-- =====================================================

CREATE TABLE IF NOT EXISTS integration_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL, -- customer_created, project_created, sop_triggered, etc.
    source_system TEXT, -- website, mobile_app, crm, manual
    event_data TEXT, -- JSON
    status TEXT DEFAULT 'success', -- success, error, warning
    error_message TEXT,
    processing_time_ms INTEGER,
    timestamp TEXT NOT NULL,
    created_at TEXT NOT NULL
);

-- =====================================================
-- WEATHER & EXTERNAL DATA
-- =====================================================

CREATE TABLE IF NOT EXISTS weather_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT, -- storm, hurricane, heavy_rain, extreme_heat
    severity TEXT, -- low, medium, high, severe
    start_date TEXT,
    end_date TEXT,
    affected_counties TEXT, -- JSON array
    project_impacts TEXT, -- JSON array of affected project IDs
    created_at TEXT NOT NULL
);

-- =====================================================
-- SYSTEM SETTINGS & CONFIGURATION
-- =====================================================

CREATE TABLE IF NOT EXISTS system_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type TEXT DEFAULT 'string', -- string, number, boolean, json
    category TEXT, -- integration, notification, sop, billing, etc.
    description TEXT,
    updated_by TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- =====================================================
-- INITIAL DATA SETUP
-- =====================================================

-- Insert SOP Categories
INSERT OR REPLACE INTO sop_categories (category_code, name, description, created_at) VALUES
('1000-1999', 'Safety & OSHA Compliance', 'Safety procedures and OSHA compliance requirements', datetime('now')),
('2000-2999', 'Field Operations & Installation', 'Field operations and installation standards', datetime('now')),
('3000-3999', 'Quality Control & Inspection', 'Quality control and inspection protocols', datetime('now')),
('4000-4999', 'Customer Service & Communication', 'Customer service and communication excellence', datetime('now')),
('5000-5999', 'Administrative & Business Operations', 'Administrative and business operations', datetime('now')),
('6000-6999', 'Emergency Response & Crisis Management', 'Emergency response and crisis management', datetime('now')),
('7000-7999', 'Training & Competency Development', 'Training and competency development', datetime('now')),
('8000-8999', 'Regulatory Compliance & Legal', 'Regulatory compliance and legal requirements', datetime('now')),
('9000-9999', 'Special Projects & Innovation', 'Special projects and innovation initiatives', datetime('now'));

-- Insert sample SOP procedures
INSERT OR REPLACE INTO sop_procedures (sop_number, category_id, title, description, florida_specific, hvhz_required, created_at, updated_at) VALUES
('SOP-1001', 1, 'Pre-Job Safety Inspection', 'Comprehensive safety inspection before starting any roofing work', TRUE, FALSE, datetime('now'), datetime('now')),
('SOP-1002', 1, 'HVHZ Safety Protocols', 'Special safety protocols for High Velocity Hurricane Zone work', TRUE, TRUE, datetime('now'), datetime('now')),
('SOP-2001', 2, 'Roof Inspection and Assessment', 'Standard roof inspection and damage assessment procedure', FALSE, FALSE, datetime('now'), datetime('now')),
('SOP-2002', 2, 'Emergency Roof Repair Protocol', 'Emergency response protocol for urgent roof repairs', FALSE, FALSE, datetime('now'), datetime('now')),
('SOP-4001', 4, 'Customer Lead Response', 'Standard procedure for responding to new customer leads', FALSE, FALSE, datetime('now'), datetime('now')),
('SOP-4002', 4, 'Insurance Claim Communication', 'Communication protocol for insurance claim projects', TRUE, FALSE, datetime('now'), datetime('now'));

-- Insert default system settings
INSERT OR REPLACE INTO system_settings (setting_key, setting_value, setting_type, category, description, created_at, updated_at) VALUES
('default_retention_percentage', '10', 'number', 'billing', 'Default retention percentage for projects', datetime('now'), datetime('now')),
('florida_sales_tax_rate', '7.0', 'number', 'billing', 'Florida state sales tax rate', datetime('now'), datetime('now')),
('emergency_response_timeout', '2', 'number', 'sop', 'Emergency response timeout in hours', datetime('now'), datetime('now')),
('notification_channels', '["email", "sms"]', 'json', 'notification', 'Default notification channels', datetime('now'), datetime('now')),
('hvhz_counties', '["Miami-Dade", "Broward", "Monroe"]', 'json', 'compliance', 'High Velocity Hurricane Zone counties', datetime('now'), datetime('now'));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_lead_id ON customers(lead_id);
CREATE INDEX IF NOT EXISTS idx_projects_customer_id ON projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_county ON projects(county);
CREATE INDEX IF NOT EXISTS idx_sop_workflows_status ON sop_workflows(status);
CREATE INDEX IF NOT EXISTS idx_sop_workflows_urgency ON sop_workflows(urgency);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_urgency ON notifications(urgency);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_integration_logs_event_type ON integration_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_integration_logs_timestamp ON integration_logs(timestamp);