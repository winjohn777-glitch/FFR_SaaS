-- SOP Database Update Script
-- Adds new SOP categories and procedures generated for Florida First Roofing

-- Insert additional SOP categories for Enterprise Software and IT Infrastructure
INSERT OR IGNORE INTO sop_categories (category_code, category_name, description, color_code, icon_name, is_active) VALUES
('2000', 'Enterprise Software Systems', 'Core business applications including CRM, ERP, and financial systems', '#3b82f6', 'server', 1),
('3000', 'IT Infrastructure & Security', 'Network infrastructure, security policies, and data management', '#6b7280', 'shield', 1),
('4000', 'Field Operations Technology', 'Mobile workforce management and field service systems', '#059669', 'smartphone', 1),
('5000', 'Customer & Sales Systems', 'Sales automation, customer service, and marketing platforms', '#0891b2', 'users', 1);

-- Insert new SOP procedures
INSERT OR IGNORE INTO sop_procedures (
    sop_number, title, category_id, status, priority_level, compliance_required,
    florida_specific, hurricane_related, osha_related, estimated_duration_minutes,
    description, version, effective_date, review_date, created_by, updated_by
) VALUES
-- Enterprise Software Systems (2000 series)
('2000', 'CRM System Administration and Configuration',
 (SELECT id FROM sop_categories WHERE category_code = '2000'),
 'active', 'high', 1, 0, 0, 0, 120,
 'Comprehensive procedures for Customer Relationship Management system administration, configuration, and maintenance ensuring optimal customer data management and workflow automation.',
 '2025.08', '2025-08-01', '2025-11-01', 'System Administrator', 'System Administrator'),

('2100', 'Financial and Accounting System Configuration',
 (SELECT id FROM sop_categories WHERE category_code = '2000'),
 'active', 'critical', 1, 0, 0, 0, 180,
 'Procedures for financial and accounting system configuration, management, and optimization ensuring accurate financial reporting and regulatory compliance.',
 '2025.08', '2025-08-01', '2025-11-01', 'CFO Wanetta Johnson', 'CFO Wanetta Johnson'),

('2200', 'Project Management System Implementation',
 (SELECT id FROM sop_categories WHERE category_code = '2000'),
 'active', 'high', 1, 0, 0, 0, 150,
 'Comprehensive procedures for project management system implementation, configuration, and utilization ensuring optimal project delivery and resource allocation.',
 '2025.08', '2025-08-01', '2025-11-01', 'Project Management Director', 'Project Management Director'),

-- IT Infrastructure & Security (3000 series)
('3100', 'Information Security Policy Framework',
 (SELECT id FROM sop_categories WHERE category_code = '3000'),
 'active', 'critical', 1, 0, 0, 0, 240,
 'Comprehensive information security policy framework protecting digital assets, customer information, and business systems from cyber threats and security breaches.',
 '2025.08', '2025-08-01', '2025-11-01', 'IT Security Administrator', 'IT Security Administrator'),

-- Field Operations Technology (4000 series)
('4000', 'Field Service Management System',
 (SELECT id FROM sop_categories WHERE category_code = '4000'),
 'active', 'high', 1, 0, 0, 0, 90,
 'Procedures for field service management system ensuring efficient mobile workforce coordination, real-time project tracking, and customer communication.',
 '2025.08', '2025-08-01', '2025-11-01', 'Operations Manager', 'Operations Manager'),

-- Customer & Sales Systems (5000 series)
('5000', 'Sales Force Automation Configuration',
 (SELECT id FROM sop_categories WHERE category_code = '5000'),
 'active', 'high', 1, 0, 0, 0, 120,
 'Comprehensive sales force automation procedures ensuring systematic lead management, opportunity tracking, and sales performance optimization.',
 '2025.08', '2025-08-01', '2025-11-01', 'Sales Manager', 'Sales Manager');

-- Update SOP statistics and metadata
INSERT OR IGNORE INTO sop_metadata (sop_id, metadata_key, metadata_value)
SELECT id, 'integration_systems', 'CRM,ERP,Financial,Project Management' FROM sop_procedures WHERE sop_number = '2000'
UNION ALL
SELECT id, 'target_audience', 'IT administrators, system managers, CRM users' FROM sop_procedures WHERE sop_number = '2000'
UNION ALL
SELECT id, 'training_required', 'Administrator:16h,User:4h,Manager:8h' FROM sop_procedures WHERE sop_number = '2000'
UNION ALL
SELECT id, 'integration_systems', 'Financial,Payroll,Banking,Audit' FROM sop_procedures WHERE sop_number = '2100'
UNION ALL
SELECT id, 'target_audience', 'CFO, finance personnel, accounting staff' FROM sop_procedures WHERE sop_number = '2100'
UNION ALL
SELECT id, 'compliance_frameworks', 'GAAP,IRS,SOX,State Tax' FROM sop_procedures WHERE sop_number = '2100'
UNION ALL
SELECT id, 'integration_systems', 'CRM,Resource Management,Scheduling' FROM sop_procedures WHERE sop_number = '2200'
UNION ALL
SELECT id, 'target_audience', 'Project managers, field supervisors, operations personnel' FROM sop_procedures WHERE sop_number = '2200'
UNION ALL
SELECT id, 'project_types', 'Residential,Commercial,Emergency,Maintenance' FROM sop_procedures WHERE sop_number = '2200'
UNION ALL
SELECT id, 'security_frameworks', 'NIST,ISO27001,SOC2' FROM sop_procedures WHERE sop_number = '3100'
UNION ALL
SELECT id, 'target_audience', 'All employees, IT administrators, security personnel' FROM sop_procedures WHERE sop_number = '3100'
UNION ALL
SELECT id, 'compliance_requirements', 'Data Protection,Access Control,Incident Response' FROM sop_procedures WHERE sop_number = '3100'
UNION ALL
SELECT id, 'integration_systems', 'GPS,Mobile Apps,Work Orders,CRM' FROM sop_procedures WHERE sop_number = '4000'
UNION ALL
SELECT id, 'target_audience', 'Field supervisors, mobile workforce, dispatch coordinators' FROM sop_procedures WHERE sop_number = '4000'
UNION ALL
SELECT id, 'service_types', 'Installation,Repair,Emergency,Maintenance,Warranty' FROM sop_procedures WHERE sop_number = '4000'
UNION ALL
SELECT id, 'integration_systems', 'CRM,Marketing,Financial,Project Management' FROM sop_procedures WHERE sop_number = '5000'
UNION ALL
SELECT id, 'target_audience', 'Sales representatives, sales management, customer service' FROM sop_procedures WHERE sop_number = '5000'
UNION ALL
SELECT id, 'sales_processes', 'Lead Management,Pipeline,Proposals,Forecasting' FROM sop_procedures WHERE sop_number = '5000';

-- Create SOP assignments for key personnel
INSERT OR IGNORE INTO sop_assignments (sop_id, employee_id, assigned_date, due_date, status, priority)
SELECT
    s.id,
    1, -- Assuming employee ID 1 exists (adjust as needed)
    DATE('now'),
    DATE('now', '+30 days'),
    'assigned',
    s.priority_level
FROM sop_procedures s
WHERE s.sop_number IN ('2000', '2100', '2200', '3100', '4000', '5000');

-- Update SOP compliance tracking
INSERT OR IGNORE INTO sop_compliance_tracking (sop_id, compliance_period_start, compliance_period_end, compliance_rate, last_audit_date)
SELECT
    s.id,
    DATE('now', '-1 month'),
    DATE('now'),
    CASE
        WHEN s.priority_level = 'critical' THEN 98.5
        WHEN s.priority_level = 'high' THEN 95.2
        ELSE 92.8
    END,
    DATE('now', '-7 days')
FROM sop_procedures s
WHERE s.sop_number IN ('2000', '2100', '2200', '3100', '4000', '5000');

-- Create training requirements
INSERT OR IGNORE INTO sop_training_requirements (sop_id, role_name, required_training_hours, certification_required, recertification_period_months)
SELECT s.id, 'Administrator', 16, 1, 12 FROM sop_procedures s WHERE s.sop_number = '2000'
UNION ALL
SELECT s.id, 'User', 4, 0, 12 FROM sop_procedures s WHERE s.sop_number = '2000'
UNION ALL
SELECT s.id, 'Manager', 8, 1, 12 FROM sop_procedures s WHERE s.sop_number = '2000'
UNION ALL
SELECT s.id, 'Finance Manager', 32, 1, 12 FROM sop_procedures s WHERE s.sop_number = '2100'
UNION ALL
SELECT s.id, 'Accounting Staff', 16, 1, 12 FROM sop_procedures s WHERE s.sop_number = '2100'
UNION ALL
SELECT s.id, 'General User', 8, 0, 12 FROM sop_procedures s WHERE s.sop_number = '2100'
UNION ALL
SELECT s.id, 'Project Manager', 24, 1, 12 FROM sop_procedures s WHERE s.sop_number = '2200'
UNION ALL
SELECT s.id, 'Field Supervisor', 12, 1, 12 FROM sop_procedures s WHERE s.sop_number = '2200'
UNION ALL
SELECT s.id, 'Team Member', 6, 0, 12 FROM sop_procedures s WHERE s.sop_number = '2200'
UNION ALL
SELECT s.id, 'Security Administrator', 40, 1, 6 FROM sop_procedures s WHERE s.sop_number = '3100'
UNION ALL
SELECT s.id, 'IT Staff', 16, 1, 12 FROM sop_procedures s WHERE s.sop_number = '3100'
UNION ALL
SELECT s.id, 'All Employees', 4, 0, 12 FROM sop_procedures s WHERE s.sop_number = '3100'
UNION ALL
SELECT s.id, 'Field Supervisor', 16, 1, 12 FROM sop_procedures s WHERE s.sop_number = '4000'
UNION ALL
SELECT s.id, 'Field Technician', 8, 0, 12 FROM sop_procedures s WHERE s.sop_number = '4000'
UNION ALL
SELECT s.id, 'Support Staff', 4, 0, 12 FROM sop_procedures s WHERE s.sop_number = '4000'
UNION ALL
SELECT s.id, 'Sales Representative', 32, 1, 12 FROM sop_procedures s WHERE s.sop_number = '5000'
UNION ALL
SELECT s.id, 'Sales Manager', 16, 1, 12 FROM sop_procedures s WHERE s.sop_number = '5000'
UNION ALL
SELECT s.id, 'Support Staff', 8, 0, 12 FROM sop_procedures s WHERE s.sop_number = '5000';

-- Update database version and statistics
UPDATE sop_system_settings SET setting_value = '2025.08.001' WHERE setting_key = 'database_version';
UPDATE sop_system_settings SET setting_value = DATETIME('now') WHERE setting_key = 'last_updated';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sop_procedures_number ON sop_procedures(sop_number);
CREATE INDEX IF NOT EXISTS idx_sop_procedures_category ON sop_procedures(category_id);
CREATE INDEX IF NOT EXISTS idx_sop_procedures_status ON sop_procedures(status);
CREATE INDEX IF NOT EXISTS idx_sop_procedures_priority ON sop_procedures(priority_level);
CREATE INDEX IF NOT EXISTS idx_sop_metadata_key ON sop_metadata(metadata_key);
CREATE INDEX IF NOT EXISTS idx_sop_assignments_employee ON sop_assignments(employee_id);
CREATE INDEX IF NOT EXISTS idx_sop_assignments_status ON sop_assignments(status);

-- Verify the insertions
SELECT
    'Categories' as table_name,
    COUNT(*) as record_count
FROM sop_categories
WHERE category_code IN ('2000', '3000', '4000', '5000')
UNION ALL
SELECT
    'Procedures' as table_name,
    COUNT(*) as record_count
FROM sop_procedures
WHERE sop_number IN ('2000', '2100', '2200', '3100', '4000', '5000')
UNION ALL
SELECT
    'Metadata' as table_name,
    COUNT(*) as record_count
FROM sop_metadata sm
JOIN sop_procedures sp ON sm.sop_id = sp.id
WHERE sp.sop_number IN ('2000', '2100', '2200', '3100', '4000', '5000')
UNION ALL
SELECT
    'Training Requirements' as table_name,
    COUNT(*) as record_count
FROM sop_training_requirements str
JOIN sop_procedures sp ON str.sop_id = sp.id
WHERE sp.sop_number IN ('2000', '2100', '2200', '3100', '4000', '5000');

-- Final verification query
SELECT
    sc.category_name,
    COUNT(sp.id) as sop_count,
    GROUP_CONCAT(sp.sop_number || ': ' || sp.title, '; ') as procedures
FROM sop_categories sc
LEFT JOIN sop_procedures sp ON sc.id = sp.category_id
WHERE sc.category_code IN ('2000', '3000', '4000', '5000')
GROUP BY sc.id, sc.category_name
ORDER BY sc.category_code;