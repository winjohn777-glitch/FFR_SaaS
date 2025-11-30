-- LMS Seed Data for Florida First Roofing LLC
-- Sample training courses, users, and compliance data

-- =====================================================
-- USER ROLES SETUP
-- =====================================================

INSERT INTO lms_user_roles (role_name, role_description, can_create_courses, can_edit_courses, can_view_all_progress, can_manage_users, can_generate_reports, can_issue_certificates) VALUES
('Admin', 'Full system administration access', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE),
('Training Manager', 'Manages training programs and courses', TRUE, TRUE, TRUE, FALSE, TRUE, TRUE),
('Instructor', 'Creates and delivers training content', TRUE, TRUE, FALSE, FALSE, FALSE, TRUE),
('Supervisor', 'Views team progress and assigns training', FALSE, FALSE, TRUE, FALSE, TRUE, FALSE),
('Employee', 'Takes courses and views own progress', FALSE, FALSE, FALSE, FALSE, FALSE, FALSE);

-- =====================================================
-- COURSE CATEGORIES
-- =====================================================

INSERT INTO lms_course_categories (category_name, category_code, description, color_hex, icon_name, sort_order) VALUES
('Safety', 'SAFE', 'OSHA compliance and safety training courses', '#dc2626', 'AlertTriangle', 1),
('Technical', 'TECH', 'Roofing installation and technical skills', '#1e40af', 'Wrench', 2),
('Business', 'BIZ', 'Customer service and business operations', '#059669', 'Briefcase', 3),
('Certifications', 'CERT', 'Professional certifications and licensing', '#8b4513', 'Award', 4),
('Equipment', 'EQUIP', 'Equipment operation and maintenance', '#7c2d12', 'Settings', 5);

-- =====================================================
-- INSTRUCTORS
-- =====================================================

INSERT INTO lms_instructors (instructor_name, email, phone, bio, qualifications, specializations, is_internal, rating) VALUES
('Safety Director', 'safety@floridafirstroofing.com', '(555) 001-0001', 'Certified OSHA trainer with 15+ years of roofing safety experience', 'OSHA 30-Hour Certified, CSP (Certified Safety Professional)', '["Fall Protection", "PPE Training", "Hazard Recognition"]', TRUE, 4.9),
('Master Roofer', 'master@floridafirstroofing.com', '(555) 001-0002', 'Master roofer with expertise in all roofing systems', '25+ years experience, Florida Licensed Roofing Contractor', '["Shingle Installation", "Metal Roofing", "Tile Systems"]', TRUE, 4.8),
('Business Manager', 'business@floridafirstroofing.com', '(555) 001-0003', 'Business operations and customer service expert', 'MBA, Customer Service Excellence Certification', '["Customer Relations", "Project Management", "Sales Training"]', TRUE, 4.7),
('License Specialist', 'licensing@floridafirstroofing.com', '(555) 001-0004', 'Florida roofing license preparation specialist', 'Florida Licensed Roofing Contractor, Business Law Certificate', '["Licensing Prep", "Code Compliance", "Regulations"]', TRUE, 4.6),
('Metal Specialist', 'metal@floridafirstroofing.com', '(555) 001-0005', 'Specialized metal roofing installation expert', 'Metal Roofing Alliance Certification, NRCA Member', '["Metal Installation", "Standing Seam", "Fastening Systems"]', TRUE, 4.8),
('Tile Expert', 'tile@floridafirstroofing.com', '(555) 001-0006', 'Clay and concrete tile installation specialist', 'Tile Roofing Institute Certification, 20+ years experience', '["Clay Tile", "Concrete Tile", "Underlayment Systems"]', TRUE, 4.7),
('Equipment Trainer', 'equipment@floridafirstroofing.com', '(555) 001-0007', 'Heavy equipment and tool safety instructor', 'Equipment Operation Certification, NCCCO Certified', '["Crane Operation", "Aerial Lifts", "Power Tools"]', TRUE, 4.5);

-- =====================================================
-- SAMPLE USERS (Based on existing employees)
-- =====================================================

INSERT INTO lms_users (username, email, first_name, last_name, role_id, job_title, department, is_active) VALUES
('admin', 'admin@floridafirstroofing.com', 'System', 'Administrator', 1, 'System Administrator', 'IT', TRUE),
('jsmith', 'j.smith@floridafirstroofing.com', 'John', 'Smith', 4, 'Crew Supervisor', 'Operations', TRUE),
('mwilson', 'm.wilson@floridafirstroofing.com', 'Mike', 'Wilson', 5, 'Roofer', 'Operations', TRUE),
('sjohnson', 's.johnson@floridafirstroofing.com', 'Sarah', 'Johnson', 5, 'Apprentice Roofer', 'Operations', TRUE),
('dbrown', 'd.brown@floridafirstroofing.com', 'David', 'Brown', 2, 'Training Manager', 'HR', TRUE),
('lgarcia', 'l.garcia@floridafirstroofing.com', 'Lisa', 'Garcia', 5, 'Office Manager', 'Administration', TRUE),
('rthomas', 'r.thomas@floridafirstroofing.com', 'Robert', 'Thomas', 4, 'Lead Installer', 'Operations', TRUE),
('amartinez', 'a.martinez@floridafirstroofing.com', 'Ana', 'Martinez', 5, 'Quality Inspector', 'Operations', TRUE);

-- =====================================================
-- TRAINING COURSES
-- =====================================================

INSERT INTO lms_courses (
    course_code, title, description, category_id, instructor_id, difficulty_level,
    duration_hours, is_required, is_osha_compliant, osha_standard_reference,
    certificate_available, expiration_months, minimum_score_pass, tags
) VALUES
('SAFE-001', 'OSHA Fall Protection Standards',
 'Comprehensive training on OSHA fall protection requirements for roofing work. Covers proper equipment, setup procedures, and safety protocols required for all roofing personnel.',
 1, 1, 'Beginner', 4.0, TRUE, TRUE, '29 CFR 1926.501', TRUE, 12, 80,
 '["OSHA", "Fall Protection", "Safety", "Required", "PPE"]'),

('SAFE-002', 'PPE and Safety Equipment',
 'Complete guide to Personal Protective Equipment selection, maintenance, and proper usage in roofing environments. Essential for all field personnel.',
 1, 1, 'Beginner', 2.0, TRUE, TRUE, '29 CFR 1926.95', TRUE, 6, 85,
 '["PPE", "Safety Equipment", "OSHA", "Required"]'),

('TECH-001', 'Shingle Installation Techniques',
 'Master the art of professional shingle installation. Learn proper techniques, tools, and quality control measures for various shingle types including architectural and dimensional shingles.',
 2, 2, 'Intermediate', 6.0, FALSE, FALSE, NULL, TRUE, NULL, 75,
 '["Shingles", "Installation", "Asphalt", "Techniques"]'),

('TECH-002', 'Metal Roofing Installation',
 'Specialized training for metal roofing systems. Learn cutting techniques, fastening methods, and weatherproofing for commercial and residential applications.',
 2, 5, 'Advanced', 5.0, FALSE, FALSE, NULL, TRUE, NULL, 80,
 '["Metal Roofing", "Installation", "Commercial", "Residential"]'),

('TECH-003', 'Tile Roofing Systems',
 'Comprehensive training on clay and concrete tile installation. Covers underlayment, tile placement, ridge details, and repairs specific to Florida climate.',
 2, 6, 'Intermediate', 6.0, FALSE, FALSE, NULL, TRUE, NULL, 75,
 '["Tile", "Clay", "Concrete", "Installation", "Florida"]'),

('BIZ-001', 'Customer Service Excellence',
 'Develop exceptional customer service skills specific to the roofing industry. Handle complaints, manage expectations, and build lasting relationships with homeowners and commercial clients.',
 3, 3, 'Beginner', 3.0, TRUE, FALSE, NULL, FALSE, NULL, 70,
 '["Customer Service", "Communication", "Required"]'),

('BIZ-002', 'Project Estimation and Pricing',
 'Learn accurate estimation techniques for roofing projects. Understand material costs, labor calculations, and competitive pricing strategies for the Florida market.',
 3, 3, 'Intermediate', 4.0, FALSE, FALSE, NULL, FALSE, NULL, 75,
 '["Estimation", "Pricing", "Materials", "Labor"]'),

('CERT-001', 'Florida State Roofing License',
 'Prepare for the Florida state roofing license examination. Covers regulations, codes, and business practices required for certification in the state of Florida.',
 4, 4, 'Advanced', 8.0, TRUE, FALSE, NULL, TRUE, 24, 85,
 '["Florida License", "Regulations", "Codes", "Required"]'),

('EQUIP-001', 'Ladder and Scaffolding Safety',
 'Proper setup, inspection, and use of ladders and scaffolding systems. OSHA-compliant training for safe access to roofing work areas.',
 1, 1, 'Beginner', 2.5, TRUE, TRUE, '29 CFR 1926.1050', TRUE, 12, 80,
 '["Ladder Safety", "Scaffolding", "OSHA", "Access", "Required"]'),

('EQUIP-002', 'Power Tool Safety and Maintenance',
 'Safe operation and maintenance of power tools commonly used in roofing. Covers nail guns, saws, drills, and specialized roofing equipment.',
 5, 7, 'Beginner', 3.0, TRUE, FALSE, NULL, TRUE, 6, 75,
 '["Power Tools", "Safety", "Maintenance", "Required"]');

-- =====================================================
-- COURSE MODULES
-- =====================================================

-- OSHA Fall Protection modules
INSERT INTO lms_course_modules (course_id, module_title, module_description, sort_order, content_type, duration_minutes) VALUES
(1, 'Introduction to Fall Protection', 'Overview of OSHA requirements and statistics', 1, 'video', 30),
(1, 'Personal Fall Arrest Systems', 'Harnesses, lanyards, and anchor points', 2, 'video', 45),
(1, 'Guardrail Systems', 'Temporary and permanent guardrail installation', 3, 'video', 30),
(1, 'Safety Net Systems', 'When and how to use safety nets', 4, 'video', 25),
(1, 'Inspection and Maintenance', 'Equipment inspection procedures', 5, 'document', 20),
(1, 'Fall Protection Quiz', 'Assessment of fall protection knowledge', 6, 'quiz', 30);

-- PPE Training modules
INSERT INTO lms_course_modules (course_id, module_title, module_description, sort_order, content_type, duration_minutes) VALUES
(2, 'PPE Overview', 'Types of personal protective equipment', 1, 'video', 25),
(2, 'Hard Hat Selection and Use', 'Proper hard hat selection for roofing', 2, 'video', 20),
(2, 'Eye and Face Protection', 'Safety glasses and face shields', 3, 'video', 15),
(2, 'Respiratory Protection', 'When and how to use respirators', 4, 'video', 30),
(2, 'PPE Final Assessment', 'Comprehensive PPE knowledge test', 5, 'quiz', 20);

-- Shingle Installation modules
INSERT INTO lms_course_modules (course_id, module_title, module_description, sort_order, content_type, duration_minutes) VALUES
(3, 'Shingle Types and Materials', 'Overview of shingle varieties and selection', 1, 'video', 60),
(3, 'Underlayment Installation', 'Proper underlayment techniques', 2, 'video', 45),
(3, 'Starter Strip Installation', 'Critical first course installation', 3, 'video', 30),
(3, 'Field Shingle Installation', 'Proper nailing and alignment techniques', 4, 'video', 90),
(3, 'Ridge and Hip Installation', 'Finishing techniques for peaks and hips', 5, 'video', 60),
(3, 'Quality Control and Inspection', 'Final inspection procedures', 6, 'document', 30),
(3, 'Shingle Installation Assessment', 'Practical knowledge evaluation', 7, 'quiz', 45);

-- =====================================================
-- SAMPLE QUIZZES
-- =====================================================

INSERT INTO lms_quizzes (course_id, quiz_title, quiz_description, quiz_type, passing_score, max_attempts, time_limit_minutes) VALUES
(1, 'Fall Protection Final Exam', 'Comprehensive assessment of fall protection knowledge', 'final-exam', 80, 3, 60),
(2, 'PPE Knowledge Check', 'Assessment of PPE understanding', 'assessment', 85, 3, 30),
(3, 'Shingle Installation Test', 'Practical knowledge of shingle installation', 'final-exam', 75, 3, 45);

-- Sample quiz questions for Fall Protection
INSERT INTO lms_quiz_questions (quiz_id, question_type, question_text, correct_answer, options, explanation, points, sort_order) VALUES
(1, 'multiple-choice', 'At what height does OSHA require fall protection for roofing work?', 'B', '["A) 4 feet", "B) 6 feet", "C) 8 feet", "D) 10 feet"]', 'OSHA requires fall protection at 6 feet for roofing work under 29 CFR 1926.501(b)(10)', 2, 1),
(1, 'multiple-choice', 'What is the maximum arresting force allowed for personal fall arrest systems?', 'C', '["A) 900 lbs", "B) 1,350 lbs", "C) 1,800 lbs", "D) 2,000 lbs"]', 'The maximum arresting force is 1,800 lbs to prevent injury to the worker', 2, 2),
(1, 'true-false', 'Safety nets must be installed no more than 30 feet below the working surface.', 'True', '["True", "False"]', 'OSHA requires safety nets to be no more than 30 feet below the work surface', 1, 3);

-- Sample quiz questions for PPE
INSERT INTO lms_quiz_questions (quiz_id, question_type, question_text, correct_answer, options, explanation, points, sort_order) VALUES
(2, 'multiple-choice', 'What class of hard hat is required for electrical work?', 'B', '["A) Class G", "B) Class E", "C) Class C", "D) Class A"]', 'Class E hard hats provide electrical protection up to 20,000 volts', 2, 1),
(2, 'true-false', 'Safety glasses are required when cutting or grinding materials.', 'True', '["True", "False"]', 'Eye protection is mandatory when performing tasks that create flying particles', 1, 2);

-- =====================================================
-- SAMPLE ENROLLMENTS
-- =====================================================

-- Enroll all users in required safety courses
INSERT INTO lms_enrollments (user_id, course_id, assigned_by, due_date, status) VALUES
-- Fall Protection for all field personnel
(2, 1, 1, DATE('now', '+30 days'), 'enrolled'), -- John Smith
(3, 1, 1, DATE('now', '+30 days'), 'enrolled'), -- Mike Wilson
(4, 1, 1, DATE('now', '+30 days'), 'enrolled'), -- Sarah Johnson
(7, 1, 1, DATE('now', '+30 days'), 'enrolled'), -- Robert Thomas
(8, 1, 1, DATE('now', '+30 days'), 'enrolled'), -- Ana Martinez

-- PPE Training for all personnel
(2, 2, 1, DATE('now', '+15 days'), 'completed'), -- John Smith - completed
(3, 2, 1, DATE('now', '+15 days'), 'in-progress'), -- Mike Wilson - in progress
(4, 2, 1, DATE('now', '+15 days'), 'enrolled'), -- Sarah Johnson
(7, 2, 1, DATE('now', '+15 days'), 'completed'), -- Robert Thomas - completed
(8, 2, 1, DATE('now', '+15 days'), 'in-progress'), -- Ana Martinez

-- Customer Service for office and supervisory staff
(2, 6, 1, DATE('now', '+45 days'), 'completed'), -- John Smith - completed
(6, 6, 1, DATE('now', '+45 days'), 'in-progress'), -- Lisa Garcia
(5, 6, 1, DATE('now', '+45 days'), 'enrolled'), -- David Brown

-- Technical courses for experienced roofers
(3, 3, 1, NULL, 'in-progress'), -- Mike Wilson - Shingle Installation
(7, 4, 1, NULL, 'enrolled'), -- Robert Thomas - Metal Roofing
(3, 5, 1, NULL, 'enrolled'); -- Mike Wilson - Tile Systems

-- Update enrollment progress for completed/in-progress courses
UPDATE lms_enrollments SET
    progress_percentage = 100.0,
    completed_at = DATE('now', '-5 days'),
    status = 'completed',
    started_at = DATE('now', '-10 days')
WHERE user_id IN (2, 7) AND course_id = 2; -- PPE completed

UPDATE lms_enrollments SET
    progress_percentage = 100.0,
    completed_at = DATE('now', '-15 days'),
    status = 'completed',
    started_at = DATE('now', '-20 days')
WHERE user_id = 2 AND course_id = 6; -- Customer Service completed

UPDATE lms_enrollments SET
    progress_percentage = 75.0,
    status = 'in-progress',
    started_at = DATE('now', '-7 days')
WHERE user_id IN (3, 8) AND course_id = 2; -- PPE in progress

UPDATE lms_enrollments SET
    progress_percentage = 60.0,
    status = 'in-progress',
    started_at = DATE('now', '-14 days')
WHERE user_id = 3 AND course_id = 3; -- Shingle Installation in progress

UPDATE lms_enrollments SET
    progress_percentage = 45.0,
    status = 'in-progress',
    started_at = DATE('now', '-3 days')
WHERE user_id = 6 AND course_id = 6; -- Customer Service in progress

-- =====================================================
-- SAMPLE CERTIFICATIONS
-- =====================================================

INSERT INTO lms_certifications (user_id, course_id, certificate_number, issued_date, expiration_date, issued_by, is_valid, osha_compliant) VALUES
(2, 2, 'FFR-PPE-2024-001', DATE('now', '-5 days'), DATE('now', '+6 months'), 1, TRUE, TRUE), -- John Smith PPE
(7, 2, 'FFR-PPE-2024-002', DATE('now', '-5 days'), DATE('now', '+6 months'), 1, TRUE, TRUE), -- Robert Thomas PPE
(2, 6, 'FFR-CS-2024-001', DATE('now', '-15 days'), NULL, 1, TRUE, FALSE); -- John Smith Customer Service

-- =====================================================
-- OSHA COMPLIANCE RECORDS
-- =====================================================

INSERT INTO lms_osha_compliance (user_id, osha_standard, course_id, certification_id, compliance_date, expiration_date, compliance_status) VALUES
(2, '29 CFR 1926.95', 2, 1, DATE('now', '-5 days'), DATE('now', '+6 months'), 'compliant'), -- John Smith PPE
(7, '29 CFR 1926.95', 2, 2, DATE('now', '-5 days'), DATE('now', '+6 months'), 'compliant'), -- Robert Thomas PPE
(3, '29 CFR 1926.95', 2, NULL, DATE('now', '-30 days'), DATE('now', '+3 months'), 'expired'), -- Mike Wilson - needs renewal
(4, '29 CFR 1926.501', 1, NULL, NULL, DATE('now', '+25 days'), 'non-compliant'); -- Sarah Johnson - needs fall protection

-- =====================================================
-- SAMPLE COURSE REVIEWS
-- =====================================================

INSERT INTO lms_course_reviews (user_id, course_id, enrollment_id, rating, review_text) VALUES
(2, 2, 2, 5, 'Excellent PPE training. Very practical and well-explained safety procedures.'),
(7, 2, 5, 4, 'Good course content. Would benefit from more hands-on demonstrations.'),
(2, 6, 8, 5, 'Great customer service training. Really helped improve my communication skills with homeowners.');

-- =====================================================
-- SAMPLE ACTIVITY LOG ENTRIES
-- =====================================================

INSERT INTO lms_activity_log (user_id, activity_type, activity_description, course_id, enrollment_id) VALUES
(2, 'course-complete', 'Completed PPE and Safety Equipment course', 2, 2),
(2, 'certificate-issued', 'PPE certification issued', 2, 2),
(7, 'course-complete', 'Completed PPE and Safety Equipment course', 2, 5),
(7, 'certificate-issued', 'PPE certification issued', 2, 5),
(3, 'course-start', 'Started Shingle Installation Techniques course', 3, 9),
(6, 'course-start', 'Started Customer Service Excellence course', 6, 10),
(2, 'course-complete', 'Completed Customer Service Excellence course', 6, 8);

-- =====================================================
-- UPDATE COURSE STATISTICS
-- =====================================================

-- Update course enrollment and completion counts
UPDATE lms_courses SET
    total_enrollments = (SELECT COUNT(*) FROM lms_enrollments WHERE course_id = lms_courses.id),
    total_completions = (SELECT COUNT(*) FROM lms_enrollments WHERE course_id = lms_courses.id AND status = 'completed'),
    rating = (SELECT AVG(rating) FROM lms_course_reviews WHERE course_id = lms_courses.id);

-- Update instructor statistics
UPDATE lms_instructors SET
    total_students = (SELECT COUNT(DISTINCT e.user_id) FROM lms_enrollments e JOIN lms_courses c ON e.course_id = c.id WHERE c.instructor_id = lms_instructors.id),
    rating = (SELECT AVG(cr.rating) FROM lms_course_reviews cr JOIN lms_courses c ON cr.course_id = c.id WHERE c.instructor_id = lms_instructors.id);