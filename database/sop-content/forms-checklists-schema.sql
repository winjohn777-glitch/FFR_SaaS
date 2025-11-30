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

-- Insert initial form categories
INSERT OR IGNORE INTO sop_system_settings (setting_key, setting_value, description) VALUES
('forms_auto_save_interval', '30', 'Auto-save interval in seconds for form drafts'),
('forms_pdf_generation_enabled', '1', 'Enable PDF generation for form submissions'),
('forms_digital_signature_enabled', '1', 'Enable digital signature capture'),
('forms_mobile_optimization', '1', 'Enable mobile-optimized form rendering'),
('forms_audit_trail_enabled', '1', 'Enable comprehensive audit trail logging'),
('forms_max_file_upload_size', '10485760', 'Maximum file upload size in bytes (10MB)'),
('forms_retention_default_years', '7', 'Default retention period for form submissions'),
('forms_notification_enabled', '1', 'Enable email notifications for form events');