-- SOP Management System Database Schema
-- Creates tables for Standard Operating Procedure management

-- Create SOP Categories table
CREATE TABLE IF NOT EXISTS sop_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_code VARCHAR(10) NOT NULL UNIQUE,
    category_name VARCHAR(255) NOT NULL,
    description TEXT,
    color_code VARCHAR(7) DEFAULT '#6b7280',
    icon_name VARCHAR(50) DEFAULT 'folder',
    is_active BOOLEAN DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create SOP Procedures table
CREATE TABLE IF NOT EXISTS sop_procedures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sop_number VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    category_id INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    priority_level VARCHAR(20) DEFAULT 'standard',
    compliance_required BOOLEAN DEFAULT 0,
    florida_specific BOOLEAN DEFAULT 0,
    hurricane_related BOOLEAN DEFAULT 0,
    osha_related BOOLEAN DEFAULT 0,
    hvhz_related BOOLEAN DEFAULT 0,
    estimated_duration_minutes INTEGER DEFAULT 0,
    version VARCHAR(20) DEFAULT '1.0',
    effective_date DATE,
    review_date DATE,
    content_file_path TEXT,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES sop_categories(id)
);

-- Create SOP Metadata table for additional key-value data
CREATE TABLE IF NOT EXISTS sop_metadata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sop_id INTEGER NOT NULL,
    metadata_key VARCHAR(100) NOT NULL,
    metadata_value TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sop_id) REFERENCES sop_procedures(id) ON DELETE CASCADE
);

-- Create SOP Assignments table for tracking who needs to complete SOPs
CREATE TABLE IF NOT EXISTS sop_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sop_id INTEGER NOT NULL,
    employee_id INTEGER NOT NULL,
    assigned_by INTEGER,
    assigned_date DATE NOT NULL,
    due_date DATE,
    completed_date DATE,
    status VARCHAR(20) DEFAULT 'assigned',
    priority VARCHAR(20) DEFAULT 'standard',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sop_id) REFERENCES sop_procedures(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (assigned_by) REFERENCES employees(id)
);

-- Create SOP Compliance Tracking table
CREATE TABLE IF NOT EXISTS sop_compliance_tracking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sop_id INTEGER NOT NULL,
    compliance_period_start DATE NOT NULL,
    compliance_period_end DATE NOT NULL,
    total_assignments INTEGER DEFAULT 0,
    completed_assignments INTEGER DEFAULT 0,
    overdue_assignments INTEGER DEFAULT 0,
    compliance_rate DECIMAL(5,2) DEFAULT 0.00,
    last_audit_date DATE,
    audit_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sop_id) REFERENCES sop_procedures(id)
);

-- Create SOP Training Requirements table
CREATE TABLE IF NOT EXISTS sop_training_requirements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sop_id INTEGER NOT NULL,
    role_name VARCHAR(100) NOT NULL,
    required_training_hours INTEGER DEFAULT 0,
    certification_required BOOLEAN DEFAULT 0,
    recertification_period_months INTEGER DEFAULT 12,
    training_materials TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sop_id) REFERENCES sop_procedures(id)
);

-- Create SOP System Settings table
CREATE TABLE IF NOT EXISTS sop_system_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial system settings
INSERT OR IGNORE INTO sop_system_settings (setting_key, setting_value, description) VALUES
('database_version', '2025.08.001', 'Current database schema version'),
('last_updated', DATETIME('now'), 'Last database update timestamp'),
('compliance_threshold', '95.0', 'Minimum compliance rate threshold percentage'),
('auto_assignment_enabled', '1', 'Enable automatic SOP assignment based on roles'),
('notification_enabled', '1', 'Enable email notifications for SOP assignments');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sop_procedures_category ON sop_procedures(category_id);
CREATE INDEX IF NOT EXISTS idx_sop_procedures_status ON sop_procedures(status);
CREATE INDEX IF NOT EXISTS idx_sop_procedures_priority ON sop_procedures(priority_level);
CREATE INDEX IF NOT EXISTS idx_sop_procedures_number ON sop_procedures(sop_number);
CREATE INDEX IF NOT EXISTS idx_sop_procedures_florida ON sop_procedures(florida_specific);
CREATE INDEX IF NOT EXISTS idx_sop_procedures_hurricane ON sop_procedures(hurricane_related);
CREATE INDEX IF NOT EXISTS idx_sop_procedures_osha ON sop_procedures(osha_related);
CREATE INDEX IF NOT EXISTS idx_sop_metadata_key ON sop_metadata(metadata_key);
CREATE INDEX IF NOT EXISTS idx_sop_metadata_sop ON sop_metadata(sop_id);
CREATE INDEX IF NOT EXISTS idx_sop_assignments_employee ON sop_assignments(employee_id);
CREATE INDEX IF NOT EXISTS idx_sop_assignments_status ON sop_assignments(status);
CREATE INDEX IF NOT EXISTS idx_sop_assignments_sop ON sop_assignments(sop_id);
CREATE INDEX IF NOT EXISTS idx_sop_compliance_sop ON sop_compliance_tracking(sop_id);
CREATE INDEX IF NOT EXISTS idx_sop_training_sop ON sop_training_requirements(sop_id);

-- Create views for easier querying
CREATE VIEW IF NOT EXISTS v_sop_procedures_with_categories AS
SELECT
    sp.*,
    sc.category_name,
    sc.color_code,
    sc.icon_name
FROM sop_procedures sp
LEFT JOIN sop_categories sc ON sp.category_id = sc.id;

CREATE VIEW IF NOT EXISTS v_sop_assignment_summary AS
SELECT
    sp.id as sop_id,
    sp.sop_number,
    sp.title,
    sp.priority_level,
    COUNT(sa.id) as total_assignments,
    COUNT(CASE WHEN sa.status = 'completed' THEN 1 END) as completed_assignments,
    COUNT(CASE WHEN sa.status = 'overdue' THEN 1 END) as overdue_assignments,
    ROUND(
        (COUNT(CASE WHEN sa.status = 'completed' THEN 1 END) * 100.0) /
        NULLIF(COUNT(sa.id), 0), 2
    ) as completion_rate
FROM sop_procedures sp
LEFT JOIN sop_assignments sa ON sp.id = sa.sop_id
GROUP BY sp.id, sp.sop_number, sp.title, sp.priority_level;

CREATE VIEW IF NOT EXISTS v_sop_statistics AS
SELECT
    COUNT(*) as total_sops,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_sops,
    COUNT(CASE WHEN florida_specific = 1 THEN 1 END) as florida_specific_sops,
    COUNT(CASE WHEN hurricane_related = 1 THEN 1 END) as hurricane_related_sops,
    COUNT(CASE WHEN osha_related = 1 THEN 1 END) as osha_related_sops,
    COUNT(CASE WHEN priority_level = 'critical' THEN 1 END) as critical_priority_sops,
    COUNT(CASE WHEN priority_level = 'high' THEN 1 END) as high_priority_sops,
    AVG(
        CASE WHEN ct.compliance_rate IS NOT NULL
        THEN ct.compliance_rate
        ELSE 0 END
    ) as avg_compliance_rate
FROM sop_procedures sp
LEFT JOIN sop_compliance_tracking ct ON sp.id = ct.sop_id;

-- Insert initial SOP categories
INSERT OR IGNORE INTO sop_categories (category_code, category_name, description, color_code, icon_name, sort_order) VALUES
('0000', 'System Management & Documentation Control', 'System management and documentation control procedures', '#1e40af', 'settings', 1),
('1000', 'Safety & OSHA Compliance', 'Safety procedures and OSHA compliance requirements', '#dc2626', 'shield', 2),
('2000', 'Enterprise Software Systems', 'Core business applications including CRM, ERP, and financial systems', '#3b82f6', 'server', 3),
('3000', 'IT Infrastructure & Security', 'Network infrastructure, security policies, and data management', '#6b7280', 'shield', 4),
('4000', 'Field Operations Technology', 'Mobile workforce management and field service systems', '#059669', 'smartphone', 5),
('5000', 'Customer & Sales Systems', 'Sales automation, customer service, and marketing platforms', '#0891b2', 'users', 6),
('6000', 'Emergency Response & Crisis Management', 'Emergency response and crisis management procedures', '#ef4444', 'alert', 7),
('7000', 'Training & Competency Development', 'Training and competency development programs', '#8b5cf6', 'book', 8),
('8000', 'Regulatory Compliance & Legal', 'Regulatory compliance and legal requirements', '#6b7280', 'scale', 9),
('9000', 'Special Projects & Innovation', 'Special projects and innovation initiatives', '#06b6d4', 'lightbulb', 10);