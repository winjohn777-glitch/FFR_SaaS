-- Florida First Roofing LLC - Accounting Database Schema
-- Created for Claude Code accounting system

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Users table for authentication
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Chart of Accounts table
CREATE TABLE chart_of_accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_code VARCHAR(10) NOT NULL UNIQUE,
    account_name VARCHAR(100) NOT NULL,
    account_type VARCHAR(50) NOT NULL, -- Asset, Liability, Equity, Revenue, Expense
    parent_account_id INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_account_id) REFERENCES chart_of_accounts(id)
);

-- Customers table
CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    customer_type VARCHAR(20) DEFAULT 'Residential', -- Residential, Commercial, Insurance
    contact_first_name VARCHAR(50),
    contact_last_name VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    address_line1 VARCHAR(100),
    address_line2 VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(2) DEFAULT 'FL',
    zip_code VARCHAR(10),
    insurance_company VARCHAR(100),
    insurance_claim_number VARCHAR(50),
    tax_exempt BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Jobs/Projects table
CREATE TABLE jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_number VARCHAR(20) NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL,
    job_name VARCHAR(100) NOT NULL,
    job_type VARCHAR(50) NOT NULL, -- Re-Roof, Repair, New Construction, Maintenance
    roof_type VARCHAR(50), -- Shingle, Metal, Tile, TPO, EPDM
    job_status VARCHAR(20) DEFAULT 'Estimate', -- Estimate, Approved, In Progress, Completed, Invoiced, Paid
    estimated_start_date DATE,
    actual_start_date DATE,
    estimated_completion_date DATE,
    actual_completion_date DATE,
    contract_amount DECIMAL(12,2),
    estimated_cost DECIMAL(12,2),
    actual_cost DECIMAL(12,2),
    square_footage INTEGER,
    property_address VARCHAR(200),
    permit_required BOOLEAN DEFAULT FALSE,
    permit_number VARCHAR(50),
    inspection_required BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Vendors/Suppliers table
CREATE TABLE vendors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vendor_name VARCHAR(100) NOT NULL,
    vendor_type VARCHAR(50), -- Material Supplier, Subcontractor, Service Provider
    contact_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address_line1 VARCHAR(100),
    address_line2 VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    tax_id VARCHAR(20),
    payment_terms VARCHAR(50), -- Net 30, Net 15, COD, etc.
    is_1099_vendor BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Materials/Inventory table
CREATE TABLE materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    material_code VARCHAR(20) NOT NULL UNIQUE,
    material_name VARCHAR(100) NOT NULL,
    category VARCHAR(50), -- Shingles, Underlayment, Flashing, Fasteners, etc.
    unit_of_measure VARCHAR(20), -- SQ, Bundle, Sheet, Box, LF, etc.
    unit_cost DECIMAL(10,2),
    current_stock INTEGER DEFAULT 0,
    minimum_stock INTEGER DEFAULT 0,
    preferred_vendor_id INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (preferred_vendor_id) REFERENCES vendors(id)
);

-- General Ledger Transactions
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_date DATE NOT NULL,
    transaction_type VARCHAR(20) NOT NULL, -- Journal Entry, Invoice, Payment, etc.
    reference_number VARCHAR(50),
    description TEXT,
    job_id INTEGER,
    vendor_id INTEGER,
    customer_id INTEGER,
    total_amount DECIMAL(12,2) NOT NULL,
    created_by VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Transaction Line Items (Double-entry bookkeeping)
CREATE TABLE transaction_lines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    description TEXT,
    debit_amount DECIMAL(12,2) DEFAULT 0.00,
    credit_amount DECIMAL(12,2) DEFAULT 0.00,
    job_id INTEGER,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES chart_of_accounts(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

-- Invoices table
CREATE TABLE invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number VARCHAR(20) NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL,
    job_id INTEGER,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    tax_rate DECIMAL(5,4) DEFAULT 0.0700, -- 7% Florida sales tax
    tax_amount DECIMAL(12,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    amount_paid DECIMAL(12,2) DEFAULT 0.00,
    invoice_status VARCHAR(20) DEFAULT 'Sent', -- Draft, Sent, Partial, Paid, Overdue
    payment_terms VARCHAR(50) DEFAULT 'Net 30',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

-- Invoice Line Items
CREATE TABLE invoice_lines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    line_total DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

-- Purchase Orders
CREATE TABLE purchase_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    po_number VARCHAR(20) NOT NULL UNIQUE,
    vendor_id INTEGER NOT NULL,
    job_id INTEGER,
    po_date DATE NOT NULL,
    expected_delivery_date DATE,
    total_amount DECIMAL(12,2) NOT NULL,
    po_status VARCHAR(20) DEFAULT 'Pending', -- Pending, Sent, Received, Invoiced
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

-- Purchase Order Line Items
CREATE TABLE purchase_order_lines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    po_id INTEGER NOT NULL,
    material_id INTEGER,
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    line_total DECIMAL(12,2) NOT NULL,
    received_quantity DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (po_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES materials(id)
);

-- Job Cost Tracking
CREATE TABLE job_costs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id INTEGER NOT NULL,
    cost_type VARCHAR(50) NOT NULL, -- Materials, Labor, Subcontractor, Equipment, Other
    vendor_id INTEGER,
    description TEXT NOT NULL,
    quantity DECIMAL(10,2),
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(12,2) NOT NULL,
    cost_date DATE NOT NULL,
    invoice_number VARCHAR(50),
    is_billable BOOLEAN DEFAULT TRUE,
    markup_percentage DECIMAL(5,2) DEFAULT 0.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

-- Equipment table
CREATE TABLE equipment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    equipment_name VARCHAR(100) NOT NULL,
    equipment_type VARCHAR(50), -- Truck, Trailer, Ladder, Tools, etc.
    serial_number VARCHAR(50),
    purchase_date DATE,
    purchase_price DECIMAL(10,2),
    current_value DECIMAL(10,2),
    depreciation_method VARCHAR(20), -- Straight Line, MACRS
    useful_life_years INTEGER,
    maintenance_schedule VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Employee Time Tracking
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_number VARCHAR(10) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    position VARCHAR(50),
    hourly_rate DECIMAL(8,2),
    hire_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    phone VARCHAR(20),
    email VARCHAR(100),
    address_line1 VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Time Entries
CREATE TABLE time_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    job_id INTEGER,
    work_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    total_hours DECIMAL(4,2) NOT NULL,
    hourly_rate DECIMAL(8,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    work_description TEXT,
    is_overtime BOOLEAN DEFAULT FALSE,
    is_billable BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

-- Insurance Claims tracking
CREATE TABLE insurance_claims (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    claim_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id INTEGER NOT NULL,
    job_id INTEGER,
    insurance_company VARCHAR(100) NOT NULL,
    adjuster_name VARCHAR(100),
    adjuster_phone VARCHAR(20),
    adjuster_email VARCHAR(100),
    date_of_loss DATE,
    claim_amount DECIMAL(12,2),
    deductible_amount DECIMAL(12,2),
    approved_amount DECIMAL(12,2),
    claim_status VARCHAR(20) DEFAULT 'Filed', -- Filed, Under Review, Approved, Denied, Paid
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
);

-- Create indexes for better performance
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_job ON transactions(job_id);
CREATE INDEX idx_job_costs_job ON job_costs(job_id);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_date ON invoices(invoice_date);
CREATE INDEX idx_jobs_customer ON jobs(customer_id);
CREATE INDEX idx_jobs_status ON jobs(job_status);
CREATE INDEX idx_time_entries_employee ON time_entries(employee_id);
CREATE INDEX idx_time_entries_job ON time_entries(job_id);

-- =====================================================
-- LEARNING MANAGEMENT SYSTEM (LMS) INTEGRATION
-- =====================================================

-- Add LMS-related columns to existing employees table for integration
ALTER TABLE employees ADD COLUMN lms_user_id INTEGER;
ALTER TABLE employees ADD COLUMN training_status VARCHAR(20) DEFAULT 'not-assessed';
ALTER TABLE employees ADD COLUMN last_training_date DATE;
ALTER TABLE employees ADD COLUMN next_required_training DATE;
ALTER TABLE employees ADD COLUMN osha_compliance_status VARCHAR(20) DEFAULT 'non-compliant';

-- Training costs tracking (extends job_costs for training-related expenses)
CREATE TABLE training_costs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    course_name VARCHAR(200) NOT NULL,
    training_provider VARCHAR(100),
    cost_amount DECIMAL(10,2) NOT NULL,
    cost_date DATE NOT NULL,
    cost_category VARCHAR(50) DEFAULT 'Training', -- Training, Certification, Materials
    is_reimbursable BOOLEAN DEFAULT FALSE,
    reimbursement_percentage DECIMAL(5,2) DEFAULT 0.00,
    account_id INTEGER, -- Links to chart of accounts
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (account_id) REFERENCES chart_of_accounts(id)
);

-- Training-related equipment and materials
CREATE TABLE training_materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    material_name VARCHAR(100) NOT NULL,
    material_type VARCHAR(50), -- Books, Videos, Equipment, Software
    supplier_vendor_id INTEGER,
    unit_cost DECIMAL(10,2),
    current_inventory INTEGER DEFAULT 0,
    location VARCHAR(100),
    is_consumable BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_vendor_id) REFERENCES vendors(id)
);

-- Create views for common reports
CREATE VIEW job_profitability AS
SELECT
    j.id,
    j.job_number,
    j.job_name,
    j.job_type,
    j.contract_amount,
    COALESCE(SUM(jc.total_cost), 0) as total_costs,
    j.contract_amount - COALESCE(SUM(jc.total_cost), 0) as profit,
    CASE
        WHEN j.contract_amount > 0 THEN
            ROUND(((j.contract_amount - COALESCE(SUM(jc.total_cost), 0)) / j.contract_amount * 100), 2)
        ELSE 0
    END as profit_margin_percent
FROM jobs j
LEFT JOIN job_costs jc ON j.id = jc.job_id
GROUP BY j.id, j.job_number, j.job_name, j.job_type, j.contract_amount;

CREATE VIEW customer_aging AS
SELECT
    c.customer_name,
    i.invoice_number,
    i.invoice_date,
    i.due_date,
    i.total_amount,
    i.amount_paid,
    i.total_amount - i.amount_paid as balance_due,
    CASE
        WHEN julianday('now') - julianday(i.due_date) <= 0 THEN 'Current'
        WHEN julianday('now') - julianday(i.due_date) <= 30 THEN '1-30 Days'
        WHEN julianday('now') - julianday(i.due_date) <= 60 THEN '31-60 Days'
        WHEN julianday('now') - julianday(i.due_date) <= 90 THEN '61-90 Days'
        ELSE 'Over 90 Days'
    END as aging_bucket
FROM customers c
JOIN invoices i ON c.id = i.customer_id
WHERE i.amount_paid < i.total_amount;

-- Training cost summary view
CREATE VIEW training_cost_summary AS
SELECT
    e.first_name || ' ' || e.last_name as employee_name,
    e.position,
    COUNT(tc.id) as total_courses,
    SUM(tc.cost_amount) as total_training_cost,
    AVG(tc.cost_amount) as average_cost_per_course,
    MAX(tc.cost_date) as last_training_date,
    e.osha_compliance_status
FROM employees e
LEFT JOIN training_costs tc ON e.id = tc.employee_id
WHERE e.is_active = TRUE
GROUP BY e.id, e.first_name, e.last_name, e.position, e.osha_compliance_status;
-- Forms & Checklists Management System
-- Added for SOP Management System Integration
-- Forms & Checklists Management System Database Schema
-- Extends the SOP Management System for Florida First Roofing

-- Forms and templates management
CREATE TABLE IF NOT EXISTS sop_forms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    form_code VARCHAR(20) NOT NULL UNIQUE,
    form_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- 'safety', 'operations', 'compliance', 'administrative'
    form_type VARCHAR(20) DEFAULT 'form', -- 'form', 'checklist', 'certificate', 'report'
    sop_id INTEGER, -- Links to SOP procedures
    is_required BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    florida_specific BOOLEAN DEFAULT 0,
    hurricane_related BOOLEAN DEFAULT 0,
    osha_related BOOLEAN DEFAULT 0,
    form_template_json TEXT, -- JSON structure for dynamic forms
    pdf_template_path TEXT, -- Path to PDF template file
    completion_time_minutes INTEGER DEFAULT 15,
    digital_signature_required BOOLEAN DEFAULT 0,
    approval_required BOOLEAN DEFAULT 0,
    retention_period_years INTEGER DEFAULT 7,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sop_id) REFERENCES sop_procedures(id)
);

-- Form submissions and completions
CREATE TABLE IF NOT EXISTS sop_form_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    form_id INTEGER NOT NULL,
    submission_reference VARCHAR(50) UNIQUE, -- Unique reference number
    submitted_by INTEGER NOT NULL,
    project_id INTEGER, -- Optional link to projects
    customer_id INTEGER, -- Optional link to customers
    job_id INTEGER, -- Optional link to job costing
    submission_data JSON, -- Form field data
    submission_status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'submitted', 'approved', 'rejected'
    submitted_date DATETIME,
    approved_by INTEGER,
    approved_date DATETIME,
    rejection_reason TEXT,
    pdf_file_path TEXT, -- Generated PDF location
    digital_signature_data TEXT, -- Electronic signature data
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    location_data TEXT, -- GPS/location data if captured
    device_info TEXT, -- Device used for submission
    ip_address VARCHAR(45), -- IP address for audit trail
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES sop_forms(id),
    FOREIGN KEY (submitted_by) REFERENCES employees(id),
    FOREIGN KEY (approved_by) REFERENCES employees(id)
);

-- Form templates for different purposes
CREATE TABLE IF NOT EXISTS sop_form_templates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    template_name VARCHAR(255) NOT NULL,
    template_category VARCHAR(100),
    template_type VARCHAR(50), -- 'inspection', 'safety', 'quality', 'compliance'
    form_fields JSON, -- Field definitions
    validation_rules JSON, -- Validation rules
    branding_config JSON, -- FFR branding settings
    conditional_logic JSON, -- Conditional field logic
    is_default BOOLEAN DEFAULT 0,
    industry_specific BOOLEAN DEFAULT 0, -- Roofing industry specific
    license_code VARCHAR(20), -- Related license/certification
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Form field definitions for reusable components
CREATE TABLE IF NOT EXISTS sop_form_fields (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    field_code VARCHAR(50) NOT NULL UNIQUE,
    field_name VARCHAR(255) NOT NULL,
    field_type VARCHAR(50), -- 'text', 'number', 'date', 'checkbox', 'dropdown', 'signature', 'file'
    field_category VARCHAR(100),
    validation_rules JSON,
    options_data JSON, -- For dropdown/radio options
    default_value TEXT,
    help_text TEXT,
    is_required BOOLEAN DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Form completion tracking and analytics
CREATE TABLE IF NOT EXISTS sop_form_analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    form_id INTEGER NOT NULL,
    analytics_date DATE NOT NULL,
    total_submissions INTEGER DEFAULT 0,
    completed_submissions INTEGER DEFAULT 0,
    approved_submissions INTEGER DEFAULT 0,
    rejected_submissions INTEGER DEFAULT 0,
    average_completion_time_minutes DECIMAL(8,2) DEFAULT 0.00,
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    approval_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES sop_forms(id),
    UNIQUE(form_id, analytics_date)
);

-- Form approval workflow
CREATE TABLE IF NOT EXISTS sop_form_approvers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    form_id INTEGER NOT NULL,
    approver_employee_id INTEGER NOT NULL,
    approval_level INTEGER DEFAULT 1, -- 1=primary, 2=secondary, etc.
    can_delegate BOOLEAN DEFAULT 0,
    auto_approve_threshold DECIMAL(5,2), -- Auto-approve if score above threshold
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES sop_forms(id),
    FOREIGN KEY (approver_employee_id) REFERENCES employees(id)
);

-- Form notification settings
CREATE TABLE IF NOT EXISTS sop_form_notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    form_id INTEGER NOT NULL,
    notification_type VARCHAR(50), -- 'submission', 'approval', 'overdue', 'reminder'
    recipient_role VARCHAR(100), -- 'submitter', 'approver', 'manager', 'admin'
    notification_template TEXT,
    send_email BOOLEAN DEFAULT 1,
    send_sms BOOLEAN DEFAULT 0,
    days_before_due INTEGER DEFAULT 0, -- For reminder notifications
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES sop_forms(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sop_forms_category ON sop_forms(category);
CREATE INDEX IF NOT EXISTS idx_sop_forms_type ON sop_forms(form_type);
CREATE INDEX IF NOT EXISTS idx_sop_forms_sop ON sop_forms(sop_id);
CREATE INDEX IF NOT EXISTS idx_sop_forms_active ON sop_forms(is_active);
CREATE INDEX IF NOT EXISTS idx_sop_form_submissions_form ON sop_form_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_sop_form_submissions_submitter ON sop_form_submissions(submitted_by);
CREATE INDEX IF NOT EXISTS idx_sop_form_submissions_status ON sop_form_submissions(submission_status);
CREATE INDEX IF NOT EXISTS idx_sop_form_submissions_date ON sop_form_submissions(submitted_date);
CREATE INDEX IF NOT EXISTS idx_sop_form_templates_category ON sop_form_templates(template_category);
CREATE INDEX IF NOT EXISTS idx_sop_form_fields_type ON sop_form_fields(field_type);
CREATE INDEX IF NOT EXISTS idx_sop_form_analytics_date ON sop_form_analytics(analytics_date);

-- Create views for easier querying
CREATE VIEW IF NOT EXISTS v_form_submission_summary AS
SELECT
    f.form_code,
    f.form_name,
    f.category,
    f.form_type,
    COUNT(fs.id) as total_submissions,
    COUNT(CASE WHEN fs.submission_status = 'completed' THEN 1 END) as completed_submissions,
    COUNT(CASE WHEN fs.submission_status = 'approved' THEN 1 END) as approved_submissions,
    COUNT(CASE WHEN fs.submission_status = 'rejected' THEN 1 END) as rejected_submissions,
    ROUND(
        (COUNT(CASE WHEN fs.submission_status = 'completed' THEN 1 END) * 100.0) /
        NULLIF(COUNT(fs.id), 0), 2
    ) as completion_rate,
    ROUND(
        (COUNT(CASE WHEN fs.submission_status = 'approved' THEN 1 END) * 100.0) /
        NULLIF(COUNT(CASE WHEN fs.submission_status IN ('approved', 'rejected') THEN 1 END), 0), 2
    ) as approval_rate
FROM sop_forms f
LEFT JOIN sop_form_submissions fs ON f.id = fs.form_id
WHERE f.is_active = 1
GROUP BY f.id, f.form_code, f.form_name, f.category, f.form_type;

CREATE VIEW IF NOT EXISTS v_overdue_form_submissions AS
SELECT
    fs.*,
    f.form_name,
    f.category,
    e.first_name || ' ' || e.last_name as submitter_name,
    DATE('now') - DATE(fs.created_at) as days_overdue
FROM sop_form_submissions fs
JOIN sop_forms f ON fs.form_id = f.id
LEFT JOIN employees e ON fs.submitted_by = e.id
WHERE fs.submission_status = 'draft'
AND DATE('now') - DATE(fs.created_at) > 7; -- Forms not submitted after 7 days

-- Forms system is ready for initial data population
-- Initial forms data should be added via forms-initial-data.sql