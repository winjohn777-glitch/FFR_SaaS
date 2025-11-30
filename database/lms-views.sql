-- LMS Database Views and Reporting Queries
-- Florida First Roofing LLC - Training & Compliance Reporting

-- =====================================================
-- CORE LMS REPORTING VIEWS
-- =====================================================

-- Comprehensive user progress view
CREATE VIEW lms_user_progress_summary AS
SELECT
    u.id as user_id,
    u.first_name || ' ' || u.last_name as full_name,
    u.email,
    u.job_title,
    u.department,
    r.role_name,
    COUNT(e.id) as total_enrollments,
    COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as completed_courses,
    COUNT(CASE WHEN e.status = 'in-progress' THEN 1 END) as in_progress_courses,
    COUNT(CASE WHEN c.is_required = TRUE THEN 1 END) as required_courses_assigned,
    COUNT(CASE WHEN c.is_required = TRUE AND e.status = 'completed' THEN 1 END) as required_courses_completed,
    ROUND(AVG(e.progress_percentage), 2) as average_progress,
    SUM(e.total_time_spent) as total_training_minutes,
    COUNT(cert.id) as certificates_earned,
    COUNT(CASE WHEN cert.expiration_date IS NOT NULL AND cert.expiration_date > DATE('now') THEN 1 END) as active_certifications,
    COUNT(CASE WHEN cert.expiration_date IS NOT NULL AND cert.expiration_date <= DATE('now', '+30 days') THEN 1 END) as expiring_soon,
    MAX(e.completed_at) as last_completion_date,
    u.is_active,
    u.last_login
FROM lms_users u
LEFT JOIN lms_user_roles r ON u.role_id = r.id
LEFT JOIN lms_enrollments e ON u.id = e.user_id
LEFT JOIN lms_courses c ON e.course_id = c.id
LEFT JOIN lms_certifications cert ON u.id = cert.user_id AND cert.is_valid = TRUE
GROUP BY u.id, u.first_name, u.last_name, u.email, u.job_title, u.department, r.role_name, u.is_active, u.last_login;

-- Course performance and analytics view
CREATE VIEW lms_course_analytics AS
SELECT
    c.id as course_id,
    c.course_code,
    c.title,
    cat.category_name,
    i.instructor_name,
    c.difficulty_level,
    c.duration_hours,
    c.is_required,
    c.is_osha_compliant,
    COUNT(e.id) as total_enrollments,
    COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as total_completions,
    COUNT(CASE WHEN e.status = 'in-progress' THEN 1 END) as in_progress_count,
    COUNT(CASE WHEN e.status = 'enrolled' THEN 1 END) as not_started_count,
    ROUND(
        (COUNT(CASE WHEN e.status = 'completed' THEN 1 END) * 100.0 / NULLIF(COUNT(e.id), 0)), 2
    ) as completion_rate,
    ROUND(AVG(e.progress_percentage), 2) as average_progress,
    ROUND(AVG(e.total_time_spent), 0) as average_time_spent_minutes,
    ROUND(AVG(CASE WHEN qa.percentage_score IS NOT NULL THEN qa.percentage_score END), 2) as average_quiz_score,
    COUNT(DISTINCT qa.id) as total_quiz_attempts,
    COUNT(CASE WHEN qa.passed = TRUE THEN 1 END) as passed_attempts,
    COUNT(cr.id) as total_reviews,
    ROUND(AVG(cr.rating), 2) as average_rating,
    c.created_at,
    c.published_at,
    c.is_active
FROM lms_courses c
LEFT JOIN lms_course_categories cat ON c.category_id = cat.id
LEFT JOIN lms_instructors i ON c.instructor_id = i.id
LEFT JOIN lms_enrollments e ON c.id = e.course_id
LEFT JOIN lms_quiz_attempts qa ON e.id = qa.enrollment_id
LEFT JOIN lms_course_reviews cr ON c.id = cr.course_id
GROUP BY c.id, c.course_code, c.title, cat.category_name, i.instructor_name,
         c.difficulty_level, c.duration_hours, c.is_required, c.is_osha_compliant,
         c.created_at, c.published_at, c.is_active;

-- OSHA Compliance Dashboard View
CREATE VIEW lms_osha_compliance_dashboard AS
SELECT
    u.id as user_id,
    u.first_name || ' ' || u.last_name as employee_name,
    u.job_title,
    u.department,
    oc.osha_standard,
    c.title as course_title,
    oc.compliance_date,
    oc.expiration_date,
    oc.compliance_status,
    CASE
        WHEN oc.expiration_date IS NULL THEN 'No Expiration'
        WHEN oc.expiration_date <= DATE('now') THEN 'Expired'
        WHEN oc.expiration_date <= DATE('now', '+30 days') THEN 'Expires Soon'
        WHEN oc.expiration_date <= DATE('now', '+90 days') THEN 'Expires in 90 Days'
        ELSE 'Current'
    END as expiration_status,
    julianday(oc.expiration_date) - julianday('now') as days_until_expiration,
    cert.certificate_number,
    cert.issued_date as certificate_issued_date,
    u.is_active as employee_active
FROM lms_users u
LEFT JOIN lms_osha_compliance oc ON u.id = oc.user_id
LEFT JOIN lms_courses c ON oc.course_id = c.id
LEFT JOIN lms_certifications cert ON oc.certification_id = cert.id
WHERE u.is_active = TRUE
ORDER BY oc.expiration_date ASC, u.last_name, u.first_name;

-- Training schedule and due dates view
CREATE VIEW lms_training_schedule AS
SELECT
    u.id as user_id,
    u.first_name || ' ' || u.last_name as employee_name,
    u.email,
    u.job_title,
    c.course_code,
    c.title as course_title,
    cat.category_name,
    e.enrollment_date,
    e.due_date,
    e.started_at,
    e.completed_at,
    e.status,
    e.progress_percentage,
    CASE
        WHEN e.due_date IS NULL THEN 'No Due Date'
        WHEN e.due_date < DATE('now') AND e.status != 'completed' THEN 'Overdue'
        WHEN e.due_date <= DATE('now', '+7 days') AND e.status != 'completed' THEN 'Due This Week'
        WHEN e.due_date <= DATE('now', '+30 days') AND e.status != 'completed' THEN 'Due This Month'
        ELSE 'On Schedule'
    END as schedule_status,
    julianday(e.due_date) - julianday('now') as days_until_due,
    c.duration_hours,
    c.is_required,
    assigned_by_user.first_name || ' ' || assigned_by_user.last_name as assigned_by_name
FROM lms_enrollments e
JOIN lms_users u ON e.user_id = u.id
JOIN lms_courses c ON e.course_id = c.id
JOIN lms_course_categories cat ON c.category_id = cat.id
LEFT JOIN lms_users assigned_by_user ON e.assigned_by = assigned_by_user.id
WHERE u.is_active = TRUE AND c.is_active = TRUE
ORDER BY e.due_date ASC, schedule_status, u.last_name;

-- Certification expiration tracking view
CREATE VIEW lms_certification_expiration_tracking AS
SELECT
    u.id as user_id,
    u.first_name || ' ' || u.last_name as employee_name,
    u.email,
    u.job_title,
    u.department,
    cert.certificate_number,
    c.title as course_title,
    c.course_code,
    cert.issued_date,
    cert.expiration_date,
    CASE
        WHEN cert.expiration_date IS NULL THEN 'Never Expires'
        WHEN cert.expiration_date <= DATE('now') THEN 'Expired'
        WHEN cert.expiration_date <= DATE('now', '+30 days') THEN 'Expires in 30 Days'
        WHEN cert.expiration_date <= DATE('now', '+60 days') THEN 'Expires in 60 Days'
        WHEN cert.expiration_date <= DATE('now', '+90 days') THEN 'Expires in 90 Days'
        ELSE 'Current'
    END as expiration_status,
    julianday(cert.expiration_date) - julianday('now') as days_until_expiration,
    cert.is_valid,
    cert.osha_compliant,
    issued_by_user.first_name || ' ' || issued_by_user.last_name as issued_by_name,
    c.expiration_months as renewal_period_months
FROM lms_certifications cert
JOIN lms_users u ON cert.user_id = u.id
JOIN lms_courses c ON cert.course_id = c.id
LEFT JOIN lms_users issued_by_user ON cert.issued_by = issued_by_user.id
WHERE cert.is_valid = TRUE AND u.is_active = TRUE
ORDER BY cert.expiration_date ASC, u.last_name;

-- Instructor performance view
CREATE VIEW lms_instructor_performance AS
SELECT
    i.id as instructor_id,
    i.instructor_name,
    i.email,
    i.is_internal,
    COUNT(DISTINCT c.id) as courses_taught,
    COUNT(DISTINCT e.user_id) as unique_students_taught,
    COUNT(e.id) as total_enrollments,
    COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as students_completed,
    ROUND(
        (COUNT(CASE WHEN e.status = 'completed' THEN 1 END) * 100.0 / NULLIF(COUNT(e.id), 0)), 2
    ) as completion_rate,
    ROUND(AVG(cr.rating), 2) as average_course_rating,
    COUNT(cr.id) as total_reviews,
    SUM(c.duration_hours) as total_content_hours,
    COUNT(CASE WHEN c.is_osha_compliant = TRUE THEN 1 END) as osha_courses_count,
    COUNT(cert.id) as certificates_issued,
    i.rating as instructor_rating,
    i.is_active,
    MAX(e.completed_at) as last_student_completion
FROM lms_instructors i
LEFT JOIN lms_courses c ON i.id = c.instructor_id
LEFT JOIN lms_enrollments e ON c.id = e.course_id
LEFT JOIN lms_course_reviews cr ON c.id = cr.course_id
LEFT JOIN lms_certifications cert ON c.id = cert.course_id
GROUP BY i.id, i.instructor_name, i.email, i.is_internal, i.rating, i.is_active
ORDER BY completion_rate DESC, average_course_rating DESC;

-- Department training summary view
CREATE VIEW lms_department_training_summary AS
SELECT
    u.department,
    COUNT(DISTINCT u.id) as total_employees,
    COUNT(DISTINCT e.id) as total_enrollments,
    COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as completed_enrollments,
    ROUND(
        (COUNT(CASE WHEN e.status = 'completed' THEN 1 END) * 100.0 / NULLIF(COUNT(DISTINCT e.id), 0)), 2
    ) as department_completion_rate,
    COUNT(CASE WHEN c.is_required = TRUE THEN 1 END) as required_course_enrollments,
    COUNT(CASE WHEN c.is_required = TRUE AND e.status = 'completed' THEN 1 END) as required_courses_completed,
    ROUND(
        (COUNT(CASE WHEN c.is_required = TRUE AND e.status = 'completed' THEN 1 END) * 100.0 /
         NULLIF(COUNT(CASE WHEN c.is_required = TRUE THEN 1 END), 0)), 2
    ) as required_compliance_rate,
    COUNT(CASE WHEN c.is_osha_compliant = TRUE AND e.status = 'completed' THEN 1 END) as osha_courses_completed,
    COUNT(cert.id) as total_certificates,
    SUM(e.total_time_spent) as total_training_minutes,
    ROUND(AVG(e.total_time_spent), 0) as average_time_per_employee,
    COUNT(CASE WHEN oc.compliance_status = 'compliant' THEN 1 END) as osha_compliant_employees,
    COUNT(CASE WHEN oc.compliance_status = 'expired' OR oc.compliance_status = 'non-compliant' THEN 1 END) as non_compliant_employees
FROM lms_users u
LEFT JOIN lms_enrollments e ON u.id = e.user_id
LEFT JOIN lms_courses c ON e.course_id = c.id
LEFT JOIN lms_certifications cert ON u.id = cert.user_id AND cert.is_valid = TRUE
LEFT JOIN lms_osha_compliance oc ON u.id = oc.user_id AND oc.compliance_status = 'compliant'
WHERE u.is_active = TRUE AND u.department IS NOT NULL
GROUP BY u.department
ORDER BY required_compliance_rate DESC, department_completion_rate DESC;

-- Training ROI and cost analysis view (integrates with accounting system)
CREATE VIEW lms_training_roi_analysis AS
SELECT
    tc.employee_id,
    e.first_name || ' ' || e.last_name as employee_name,
    e.position,
    e.hourly_rate,
    COUNT(tc.id) as training_courses_purchased,
    SUM(tc.cost_amount) as total_training_investment,
    AVG(tc.cost_amount) as average_course_cost,
    SUM(CASE WHEN tc.is_reimbursable = TRUE THEN tc.cost_amount * tc.reimbursement_percentage / 100 ELSE 0 END) as total_reimbursements,
    COUNT(lc.id) as lms_courses_completed,
    COUNT(cert.id) as certifications_earned,
    SUM(enroll.total_time_spent) as total_training_time_minutes,
    ROUND(SUM(enroll.total_time_spent) / 60.0, 2) as total_training_hours,
    ROUND((SUM(enroll.total_time_spent) / 60.0) * e.hourly_rate, 2) as training_time_cost,
    ROUND(SUM(tc.cost_amount) + ((SUM(enroll.total_time_spent) / 60.0) * e.hourly_rate), 2) as total_training_investment_with_time,
    MAX(tc.cost_date) as last_training_expense,
    e.osha_compliance_status
FROM training_costs tc
JOIN employees e ON tc.employee_id = e.id
LEFT JOIN lms_users lu ON e.lms_user_id = lu.id
LEFT JOIN lms_enrollments enroll ON lu.id = enroll.user_id AND enroll.status = 'completed'
LEFT JOIN lms_courses lc ON enroll.course_id = lc.id
LEFT JOIN lms_certifications cert ON lu.id = cert.user_id AND cert.is_valid = TRUE
WHERE e.is_active = TRUE
GROUP BY tc.employee_id, e.first_name, e.last_name, e.position, e.hourly_rate, e.osha_compliance_status
ORDER BY total_training_investment_with_time DESC;

-- =====================================================
-- COMPLIANCE AND AUDIT VIEWS
-- =====================================================

-- Audit trail view for training records
CREATE VIEW lms_audit_trail AS
SELECT
    tr.id as record_id,
    u.first_name || ' ' || u.last_name as employee_name,
    u.employee_number,
    c.course_code,
    c.title as course_title,
    tr.training_date,
    tr.completion_date,
    i.instructor_name,
    tr.location,
    tr.duration_hours,
    tr.score_achieved,
    tr.certification_issued,
    tr.record_type,
    tr.document_retention_years,
    DATE(tr.created_at, '+' || tr.document_retention_years || ' years') as retention_expires,
    tr.audit_trail,
    c.is_osha_compliant,
    c.osha_standard_reference
FROM lms_training_records tr
JOIN lms_users u ON tr.user_id = u.id
JOIN lms_courses c ON tr.course_id = c.id
JOIN lms_instructors i ON tr.instructor_id = i.id
ORDER BY tr.training_date DESC, u.last_name, u.first_name;

-- OSHA compliance summary by standard
CREATE VIEW lms_osha_standard_compliance AS
SELECT
    oc.osha_standard,
    c.title as required_course,
    COUNT(DISTINCT oc.user_id) as employees_with_training,
    COUNT(CASE WHEN oc.compliance_status = 'compliant' THEN 1 END) as compliant_employees,
    COUNT(CASE WHEN oc.compliance_status = 'expired' THEN 1 END) as expired_employees,
    COUNT(CASE WHEN oc.compliance_status = 'non-compliant' THEN 1 END) as non_compliant_employees,
    ROUND(
        (COUNT(CASE WHEN oc.compliance_status = 'compliant' THEN 1 END) * 100.0 /
         NULLIF(COUNT(DISTINCT oc.user_id), 0)), 2
    ) as compliance_percentage,
    MIN(oc.expiration_date) as earliest_expiration,
    COUNT(CASE WHEN oc.expiration_date <= DATE('now', '+30 days') THEN 1 END) as expiring_within_30_days,
    c.expiration_months as standard_renewal_period
FROM lms_osha_compliance oc
JOIN lms_courses c ON oc.course_id = c.id
GROUP BY oc.osha_standard, c.title, c.expiration_months
ORDER BY compliance_percentage ASC, earliest_expiration ASC;

-- =====================================================
-- PERFORMANCE METRICS VIEWS
-- =====================================================

-- Monthly training metrics
CREATE VIEW lms_monthly_metrics AS
SELECT
    strftime('%Y-%m', e.completed_at) as completion_month,
    COUNT(DISTINCT e.user_id) as unique_learners,
    COUNT(e.id) as total_completions,
    COUNT(CASE WHEN c.is_required = TRUE THEN 1 END) as required_completions,
    COUNT(CASE WHEN c.is_osha_compliant = TRUE THEN 1 END) as osha_completions,
    COUNT(cert.id) as certificates_issued,
    SUM(e.total_time_spent) as total_training_minutes,
    ROUND(AVG(e.total_time_spent), 0) as average_completion_time,
    COUNT(DISTINCT c.id) as unique_courses_completed,
    ROUND(AVG(qa.percentage_score), 2) as average_quiz_score
FROM lms_enrollments e
JOIN lms_courses c ON e.course_id = c.id
LEFT JOIN lms_certifications cert ON e.user_id = cert.user_id AND
    strftime('%Y-%m', cert.issued_date) = strftime('%Y-%m', e.completed_at)
LEFT JOIN lms_quiz_attempts qa ON e.id = qa.enrollment_id AND qa.passed = TRUE
WHERE e.status = 'completed'
    AND e.completed_at IS NOT NULL
    AND e.completed_at >= DATE('now', '-12 months')
GROUP BY strftime('%Y-%m', e.completed_at)
ORDER BY completion_month DESC;

-- Course popularity and engagement metrics
CREATE VIEW lms_course_engagement AS
SELECT
    c.id as course_id,
    c.course_code,
    c.title,
    cat.category_name,
    COUNT(e.id) as total_enrollments,
    COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as completions,
    COUNT(CASE WHEN e.status = 'in-progress' THEN 1 END) as active_learners,
    COUNT(CASE WHEN e.status = 'enrolled' THEN 1 END) as not_started,
    ROUND(AVG(e.progress_percentage), 2) as average_progress,
    ROUND(AVG(e.total_time_spent), 0) as average_time_spent,
    COUNT(cr.id) as total_reviews,
    ROUND(AVG(cr.rating), 2) as average_rating,
    COUNT(al.id) as total_activity_logs,
    MAX(e.enrollment_date) as last_enrollment,
    MAX(e.completed_at) as last_completion,
    c.created_at,
    julianday('now') - julianday(c.created_at) as days_since_creation
FROM lms_courses c
LEFT JOIN lms_course_categories cat ON c.category_id = cat.id
LEFT JOIN lms_enrollments e ON c.id = e.course_id
LEFT JOIN lms_course_reviews cr ON c.id = cr.course_id
LEFT JOIN lms_activity_log al ON c.id = al.course_id
WHERE c.is_active = TRUE
GROUP BY c.id, c.course_code, c.title, cat.category_name, c.created_at
ORDER BY total_enrollments DESC, average_rating DESC;