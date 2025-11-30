-- LMS Database Setup Script
-- Florida First Roofing LLC - Complete LMS Implementation
-- Run this script to set up the complete Learning Management System

-- =====================================================
-- SETUP SEQUENCE
-- =====================================================

-- Step 1: Create LMS tables
.read lms-schema.sql

-- Step 2: Insert seed data
.read lms-seed-data.sql

-- Step 3: Create reporting views
.read lms-views.sql

-- =====================================================
-- CHART OF ACCOUNTS ENTRIES FOR TRAINING
-- =====================================================

-- Add training-related accounts to chart of accounts
INSERT OR IGNORE INTO chart_of_accounts (account_code, account_name, account_type, description) VALUES
('6100', 'Training and Development', 'Expense', 'Employee training and professional development expenses'),
('6110', 'OSHA Compliance Training', 'Expense', 'OSHA-required safety training costs'),
('6120', 'Technical Certification', 'Expense', 'Technical certification and licensing fees'),
('6130', 'Training Materials', 'Expense', 'Books, videos, and training materials'),
('6140', 'External Training Services', 'Expense', 'Third-party training providers'),
('1400', 'Training Materials Inventory', 'Asset', 'Training materials and equipment inventory'),
('2400', 'Training Payable', 'Liability', 'Accrued training expenses'),
('6150', 'Employee Reimbursements - Training', 'Expense', 'Training expense reimbursements to employees');

-- =====================================================
-- SAMPLE INTEGRATION DATA
-- =====================================================

-- Link existing employees to LMS users (sample data)
-- Note: This should be customized based on actual employee data
UPDATE employees SET
    lms_user_id = (SELECT id FROM lms_users WHERE email = employees.email),
    training_status = 'in-progress',
    osha_compliance_status = 'requires-assessment'
WHERE email IN (
    SELECT email FROM lms_users WHERE is_active = TRUE
);

-- Add sample training costs for budget tracking
INSERT OR IGNORE INTO training_costs (employee_id, course_name, training_provider, cost_amount, cost_date, cost_category, account_id) VALUES
(1, 'OSHA 30-Hour Construction Safety', 'OSHA Training Institute', 125.00, DATE('now', '-30 days'), 'Certification', (SELECT id FROM chart_of_accounts WHERE account_code = '6110')),
(2, 'Florida Roofing License Prep Course', 'Florida Roofing Academy', 350.00, DATE('now', '-45 days'), 'Certification', (SELECT id FROM chart_of_accounts WHERE account_code = '6120')),
(3, 'Metal Roofing Installation Workshop', 'Metal Roofing Alliance', 275.00, DATE('now', '-20 days'), 'Training', (SELECT id FROM chart_of_accounts WHERE account_code = '6100')),
(1, 'Safety Equipment and PPE Manual', 'Safety Supply Co', 45.00, DATE('now', '-60 days'), 'Materials', (SELECT id FROM chart_of_accounts WHERE account_code = '6130'));

-- Add training materials inventory
INSERT OR IGNORE INTO training_materials (material_name, material_type, supplier_vendor_id, unit_cost, current_inventory, location) VALUES
('OSHA Safety Manual 2024', 'Books', NULL, 25.00, 15, 'Training Room A'),
('Fall Protection Training Video Set', 'Videos', NULL, 150.00, 3, 'Training Room A'),
('PPE Training Kit', 'Equipment', NULL, 200.00, 5, 'Safety Storage'),
('Roofing Safety Simulator', 'Equipment', NULL, 2500.00, 1, 'Training Yard'),
('First Aid Training Supplies', 'Equipment', NULL, 75.00, 10, 'Medical Storage');

-- =====================================================
-- TRIGGERS FOR DATA INTEGRITY
-- =====================================================

-- Trigger to update course statistics when enrollments change
CREATE TRIGGER update_course_stats_on_enrollment
AFTER INSERT ON lms_enrollments
BEGIN
    UPDATE lms_courses SET
        total_enrollments = (SELECT COUNT(*) FROM lms_enrollments WHERE course_id = NEW.course_id),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.course_id;
END;

-- Trigger to update course completion statistics
CREATE TRIGGER update_course_stats_on_completion
AFTER UPDATE OF status ON lms_enrollments
WHEN NEW.status = 'completed' AND OLD.status != 'completed'
BEGIN
    UPDATE lms_courses SET
        total_completions = (SELECT COUNT(*) FROM lms_enrollments WHERE course_id = NEW.course_id AND status = 'completed'),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.course_id;

    -- Update instructor statistics
    UPDATE lms_instructors SET
        total_students = (
            SELECT COUNT(DISTINCT e.user_id)
            FROM lms_enrollments e
            JOIN lms_courses c ON e.course_id = c.id
            WHERE c.instructor_id = (SELECT instructor_id FROM lms_courses WHERE id = NEW.course_id)
        )
    WHERE id = (SELECT instructor_id FROM lms_courses WHERE id = NEW.course_id);
END;

-- Trigger to update OSHA compliance when certifications are issued
CREATE TRIGGER update_osha_compliance_on_cert
AFTER INSERT ON lms_certifications
WHEN NEW.osha_compliant = TRUE
BEGIN
    INSERT OR REPLACE INTO lms_osha_compliance (
        user_id,
        osha_standard,
        course_id,
        certification_id,
        compliance_date,
        expiration_date,
        compliance_status
    )
    SELECT
        NEW.user_id,
        c.osha_standard_reference,
        NEW.course_id,
        NEW.id,
        NEW.issued_date,
        NEW.expiration_date,
        'compliant'
    FROM lms_courses c
    WHERE c.id = NEW.course_id AND c.osha_standard_reference IS NOT NULL;
END;

-- Trigger to log activity when users complete courses
CREATE TRIGGER log_course_completion
AFTER UPDATE OF status ON lms_enrollments
WHEN NEW.status = 'completed' AND OLD.status != 'completed'
BEGIN
    INSERT INTO lms_activity_log (
        user_id,
        activity_type,
        activity_description,
        course_id,
        enrollment_id
    ) VALUES (
        NEW.user_id,
        'course-complete',
        'Completed course: ' || (SELECT title FROM lms_courses WHERE id = NEW.course_id),
        NEW.course_id,
        NEW.id
    );
END;

-- =====================================================
-- VALIDATION AND CONSTRAINTS
-- =====================================================

-- Additional check constraints for data validation
-- (SQLite has limited CHECK constraint support, but these document requirements)

-- Ensure enrollment progress is between 0 and 100
-- CHECK (progress_percentage >= 0 AND progress_percentage <= 100) -- Applied to lms_enrollments

-- Ensure quiz scores are valid percentages
-- CHECK (percentage_score >= 0 AND percentage_score <= 100) -- Applied to lms_quiz_attempts

-- Ensure course ratings are between 1 and 5
-- CHECK (rating >= 1 AND rating <= 5) -- Applied to lms_course_reviews

-- =====================================================
-- INITIAL CONFIGURATION
-- =====================================================

-- Set up default system configuration
INSERT OR IGNORE INTO lms_activity_log (
    user_id,
    activity_type,
    activity_description
) VALUES (
    1,
    'system-setup',
    'LMS database schema and seed data initialized'
);

-- Create default admin notifications for system setup
INSERT OR IGNORE INTO lms_activity_log (
    user_id,
    activity_type,
    activity_description,
    activity_data
) VALUES (
    1,
    'system-notification',
    'LMS setup completed - review user roles and course assignments',
    '{"setup_date": "' || DATE('now') || '", "total_users": ' ||
    (SELECT COUNT(*) FROM lms_users) || ', "total_courses": ' ||
    (SELECT COUNT(*) FROM lms_courses) || '}'
);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Verify setup with summary statistics
SELECT 'LMS Setup Summary' as component;
SELECT 'User Roles: ' || COUNT(*) as statistic FROM lms_user_roles;
SELECT 'Users: ' || COUNT(*) as statistic FROM lms_users;
SELECT 'Course Categories: ' || COUNT(*) as statistic FROM lms_course_categories;
SELECT 'Courses: ' || COUNT(*) as statistic FROM lms_courses;
SELECT 'Enrollments: ' || COUNT(*) as statistic FROM lms_enrollments;
SELECT 'Certifications: ' || COUNT(*) as statistic FROM lms_certifications;
SELECT 'OSHA Compliance Records: ' || COUNT(*) as statistic FROM lms_osha_compliance;
SELECT 'Activity Log Entries: ' || COUNT(*) as statistic FROM lms_activity_log;

-- Show sample data verification
SELECT 'Sample Course Progress:' as verification;
SELECT
    u.first_name || ' ' || u.last_name as employee,
    c.title as course,
    e.status,
    e.progress_percentage || '%' as progress
FROM lms_enrollments e
JOIN lms_users u ON e.user_id = u.id
JOIN lms_courses c ON e.course_id = c.id
LIMIT 5;

SELECT 'OSHA Compliance Status:' as verification;
SELECT
    compliance_status,
    COUNT(*) as employee_count
FROM lms_osha_compliance
GROUP BY compliance_status;

-- =====================================================
-- MAINTENANCE TASKS
-- =====================================================

-- Create a maintenance log for future reference
CREATE TABLE lms_maintenance_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    maintenance_date DATE DEFAULT (DATE('now')),
    maintenance_type VARCHAR(50), -- backup, cleanup, update, etc.
    description TEXT,
    performed_by VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO lms_maintenance_log (maintenance_type, description, performed_by) VALUES
('initial-setup', 'Complete LMS database schema and seed data installation', 'System Administrator');

-- Set up regular maintenance reminders (conceptual - would need application logic)
-- These are documented procedures, not automated tasks
INSERT INTO lms_activity_log (
    activity_type,
    activity_description,
    activity_data
) VALUES (
    'maintenance-schedule',
    'LMS maintenance schedule established',
    '{"monthly_tasks": ["Update course ratings", "Review expired certifications", "Clean activity logs"], "quarterly_tasks": ["Backup training records", "Review compliance reports", "Update course content"], "annual_tasks": ["Archive old training records", "Review retention policies", "Update OSHA requirements"]}'
);

PRAGMA user_version = 1; -- Mark database version for future migrations