-- Learning Management System (LMS) Database Schema
-- Florida First Roofing LLC - Training & Certification Management
-- Integrated with main accounting system

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- =====================================================
-- USER MANAGEMENT TABLES
-- =====================================================

-- User Roles for LMS access control
CREATE TABLE lms_user_roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    role_description TEXT,
    can_create_courses BOOLEAN DEFAULT FALSE,
    can_edit_courses BOOLEAN DEFAULT FALSE,
    can_view_all_progress BOOLEAN DEFAULT FALSE,
    can_manage_users BOOLEAN DEFAULT FALSE,
    can_generate_reports BOOLEAN DEFAULT FALSE,
    can_issue_certificates BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- LMS Users (extends employees table or standalone users)
CREATE TABLE lms_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER, -- Links to existing employees table
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role_id INTEGER NOT NULL,
    job_title VARCHAR(100),
    department VARCHAR(50),
    hire_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    password_hash VARCHAR(255), -- For authentication
    profile_image_url VARCHAR(500),
    phone VARCHAR(20),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (role_id) REFERENCES lms_user_roles(id)
);

-- =====================================================
-- COURSE MANAGEMENT TABLES
-- =====================================================

-- Course Categories
CREATE TABLE lms_course_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name VARCHAR(50) NOT NULL UNIQUE,
    category_code VARCHAR(10) NOT NULL UNIQUE,
    description TEXT,
    color_hex VARCHAR(7) DEFAULT '#1e40af', -- For UI theming
    icon_name VARCHAR(50), -- Lucide icon name
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Instructors (can be internal or external)
CREATE TABLE lms_instructors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER, -- Links to employees if internal instructor
    instructor_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    bio TEXT,
    qualifications TEXT,
    specializations TEXT, -- JSON array of specialization areas
    is_internal BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    profile_image_url VARCHAR(500),
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_students INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Main Courses Table
CREATE TABLE lms_courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_code VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    instructor_id INTEGER NOT NULL,
    difficulty_level VARCHAR(20) NOT NULL DEFAULT 'Beginner', -- Beginner, Intermediate, Advanced
    duration_hours DECIMAL(5,2) NOT NULL,
    is_required BOOLEAN DEFAULT FALSE,
    is_osha_compliant BOOLEAN DEFAULT FALSE,
    osha_standard_reference VARCHAR(100), -- e.g., "29 CFR 1926.501"
    certificate_available BOOLEAN DEFAULT FALSE,
    certificate_template_url VARCHAR(500),
    expiration_months INTEGER, -- NULL for non-expiring
    minimum_score_pass INTEGER DEFAULT 80, -- Percentage required to pass
    max_attempts INTEGER DEFAULT 3,
    course_materials_url VARCHAR(500), -- Link to materials storage
    video_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    prerequisites TEXT, -- JSON array of prerequisite course IDs
    tags TEXT, -- JSON array of searchable tags
    is_active BOOLEAN DEFAULT TRUE,
    published_at DATETIME,
    created_by INTEGER,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_enrollments INTEGER DEFAULT 0,
    total_completions INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES lms_course_categories(id),
    FOREIGN KEY (instructor_id) REFERENCES lms_instructors(id),
    FOREIGN KEY (created_by) REFERENCES lms_users(id)
);

-- Course Content/Modules
CREATE TABLE lms_course_modules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    module_title VARCHAR(200) NOT NULL,
    module_description TEXT,
    sort_order INTEGER NOT NULL,
    content_type VARCHAR(50) NOT NULL, -- video, document, quiz, interactive
    content_url VARCHAR(500),
    content_text TEXT, -- For text-based content
    duration_minutes INTEGER,
    is_required BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES lms_courses(id) ON DELETE CASCADE
);

-- =====================================================
-- ENROLLMENT AND PROGRESS TRACKING
-- =====================================================

-- User Course Enrollments
CREATE TABLE lms_enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    enrollment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    assigned_by INTEGER, -- Who assigned/enrolled the user
    due_date DATE, -- For required courses
    started_at DATETIME,
    completed_at DATETIME,
    status VARCHAR(20) DEFAULT 'enrolled', -- enrolled, in-progress, completed, dropped, expired
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    current_module_id INTEGER,
    total_time_spent INTEGER DEFAULT 0, -- minutes
    attempt_count INTEGER DEFAULT 0,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES lms_users(id),
    FOREIGN KEY (course_id) REFERENCES lms_courses(id),
    FOREIGN KEY (assigned_by) REFERENCES lms_users(id),
    FOREIGN KEY (current_module_id) REFERENCES lms_course_modules(id),
    UNIQUE(user_id, course_id) -- Prevent duplicate enrollments
);

-- Module Progress Tracking
CREATE TABLE lms_module_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    enrollment_id INTEGER NOT NULL,
    module_id INTEGER NOT NULL,
    started_at DATETIME,
    completed_at DATETIME,
    status VARCHAR(20) DEFAULT 'not-started', -- not-started, in-progress, completed
    time_spent INTEGER DEFAULT 0, -- minutes
    attempts INTEGER DEFAULT 0,
    notes TEXT,
    FOREIGN KEY (enrollment_id) REFERENCES lms_enrollments(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES lms_course_modules(id),
    UNIQUE(enrollment_id, module_id)
);

-- =====================================================
-- ASSESSMENT AND QUIZ SYSTEM
-- =====================================================

-- Quizzes/Assessments
CREATE TABLE lms_quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    module_id INTEGER, -- NULL if course-level quiz
    quiz_title VARCHAR(200) NOT NULL,
    quiz_description TEXT,
    quiz_type VARCHAR(20) DEFAULT 'assessment', -- assessment, knowledge-check, final-exam
    passing_score INTEGER DEFAULT 80,
    max_attempts INTEGER DEFAULT 3,
    time_limit_minutes INTEGER, -- NULL for unlimited time
    randomize_questions BOOLEAN DEFAULT FALSE,
    show_correct_answers BOOLEAN DEFAULT TRUE,
    is_required BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES lms_courses(id),
    FOREIGN KEY (module_id) REFERENCES lms_course_modules(id)
);

-- Quiz Questions
CREATE TABLE lms_quiz_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id INTEGER NOT NULL,
    question_type VARCHAR(20) NOT NULL, -- multiple-choice, true-false, short-answer
    question_text TEXT NOT NULL,
    correct_answer TEXT NOT NULL, -- JSON for multiple choice options
    options TEXT, -- JSON array of answer options
    explanation TEXT, -- Explanation for correct answer
    points INTEGER DEFAULT 1,
    sort_order INTEGER,
    FOREIGN KEY (quiz_id) REFERENCES lms_quizzes(id) ON DELETE CASCADE
);

-- Quiz Attempts and Results
CREATE TABLE lms_quiz_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    enrollment_id INTEGER NOT NULL,
    quiz_id INTEGER NOT NULL,
    attempt_number INTEGER NOT NULL,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    score_achieved DECIMAL(5,2),
    total_possible_points INTEGER,
    percentage_score DECIMAL(5,2),
    passed BOOLEAN DEFAULT FALSE,
    time_taken_minutes INTEGER,
    answers TEXT, -- JSON object with question_id: answer pairs
    FOREIGN KEY (enrollment_id) REFERENCES lms_enrollments(id),
    FOREIGN KEY (quiz_id) REFERENCES lms_quizzes(id)
);

-- =====================================================
-- CERTIFICATION SYSTEM
-- =====================================================

-- Certifications Earned
CREATE TABLE lms_certifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    certificate_number VARCHAR(50) NOT NULL UNIQUE,
    issued_date DATE NOT NULL,
    expiration_date DATE,
    issued_by INTEGER NOT NULL, -- Instructor or admin who issued
    certificate_url VARCHAR(500), -- Generated PDF location
    is_valid BOOLEAN DEFAULT TRUE,
    revoked_at DATETIME,
    revoked_by INTEGER,
    revocation_reason TEXT,
    osha_compliant BOOLEAN DEFAULT FALSE,
    continuing_education_hours DECIMAL(5,2),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES lms_users(id),
    FOREIGN KEY (course_id) REFERENCES lms_courses(id),
    FOREIGN KEY (issued_by) REFERENCES lms_users(id),
    FOREIGN KEY (revoked_by) REFERENCES lms_users(id)
);

-- Certification Renewals/Updates
CREATE TABLE lms_certification_renewals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    original_certification_id INTEGER NOT NULL,
    renewal_course_id INTEGER,
    renewed_date DATE NOT NULL,
    new_expiration_date DATE,
    renewed_by INTEGER NOT NULL,
    renewal_type VARCHAR(50) DEFAULT 'course-completion', -- course-completion, manual-renewal, continuing-education
    continuing_ed_hours DECIMAL(5,2),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (original_certification_id) REFERENCES lms_certifications(id),
    FOREIGN KEY (renewal_course_id) REFERENCES lms_courses(id),
    FOREIGN KEY (renewed_by) REFERENCES lms_users(id)
);

-- =====================================================
-- COMPLIANCE AND REPORTING
-- =====================================================

-- OSHA Compliance Tracking
CREATE TABLE lms_osha_compliance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    osha_standard VARCHAR(100) NOT NULL, -- e.g., "29 CFR 1926.501"
    course_id INTEGER NOT NULL,
    certification_id INTEGER,
    compliance_date DATE NOT NULL,
    expiration_date DATE,
    compliance_status VARCHAR(20) DEFAULT 'compliant', -- compliant, expired, non-compliant
    next_training_due DATE,
    inspector_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES lms_users(id),
    FOREIGN KEY (course_id) REFERENCES lms_courses(id),
    FOREIGN KEY (certification_id) REFERENCES lms_certifications(id)
);

-- Training Records for Audits
CREATE TABLE lms_training_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    enrollment_id INTEGER NOT NULL,
    training_date DATE NOT NULL,
    completion_date DATE,
    instructor_id INTEGER NOT NULL,
    location VARCHAR(100), -- classroom, online, job-site
    duration_hours DECIMAL(5,2) NOT NULL,
    score_achieved DECIMAL(5,2),
    certification_issued BOOLEAN DEFAULT FALSE,
    record_type VARCHAR(50) DEFAULT 'initial', -- initial, refresher, remedial
    audit_trail TEXT, -- JSON of important events
    document_retention_years INTEGER DEFAULT 7,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES lms_users(id),
    FOREIGN KEY (course_id) REFERENCES lms_courses(id),
    FOREIGN KEY (enrollment_id) REFERENCES lms_enrollments(id),
    FOREIGN KEY (instructor_id) REFERENCES lms_instructors(id)
);

-- =====================================================
-- SYSTEM ACTIVITY AND LOGGING
-- =====================================================

-- LMS Activity Log
CREATE TABLE lms_activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    activity_type VARCHAR(50) NOT NULL, -- login, course-start, course-complete, quiz-attempt, etc.
    activity_description TEXT,
    course_id INTEGER,
    enrollment_id INTEGER,
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(100),
    activity_data TEXT, -- JSON for additional context
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES lms_users(id),
    FOREIGN KEY (course_id) REFERENCES lms_courses(id),
    FOREIGN KEY (enrollment_id) REFERENCES lms_enrollments(id)
);

-- Course Ratings and Reviews
CREATE TABLE lms_course_reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    enrollment_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    helpful_votes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES lms_users(id),
    FOREIGN KEY (course_id) REFERENCES lms_courses(id),
    FOREIGN KEY (enrollment_id) REFERENCES lms_enrollments(id),
    UNIQUE(user_id, course_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User and enrollment indexes
CREATE INDEX idx_lms_users_employee_id ON lms_users(employee_id);
CREATE INDEX idx_lms_users_email ON lms_users(email);
CREATE INDEX idx_lms_users_active ON lms_users(is_active);
CREATE INDEX idx_lms_enrollments_user_course ON lms_enrollments(user_id, course_id);
CREATE INDEX idx_lms_enrollments_status ON lms_enrollments(status);
CREATE INDEX idx_lms_enrollments_due_date ON lms_enrollments(due_date);

-- Course indexes
CREATE INDEX idx_lms_courses_category ON lms_courses(category_id);
CREATE INDEX idx_lms_courses_instructor ON lms_courses(instructor_id);
CREATE INDEX idx_lms_courses_required ON lms_courses(is_required);
CREATE INDEX idx_lms_courses_osha ON lms_courses(is_osha_compliant);
CREATE INDEX idx_lms_courses_active ON lms_courses(is_active);

-- Progress and completion indexes
CREATE INDEX idx_lms_module_progress_enrollment ON lms_module_progress(enrollment_id);
CREATE INDEX idx_lms_module_progress_status ON lms_module_progress(status);

-- Certification indexes
CREATE INDEX idx_lms_certifications_user ON lms_certifications(user_id);
CREATE INDEX idx_lms_certifications_course ON lms_certifications(course_id);
CREATE INDEX idx_lms_certifications_expiration ON lms_certifications(expiration_date);
CREATE INDEX idx_lms_certifications_valid ON lms_certifications(is_valid);

-- Compliance indexes
CREATE INDEX idx_lms_osha_compliance_user ON lms_osha_compliance(user_id);
CREATE INDEX idx_lms_osha_compliance_status ON lms_osha_compliance(compliance_status);
CREATE INDEX idx_lms_osha_compliance_expiration ON lms_osha_compliance(expiration_date);

-- Activity log indexes
CREATE INDEX idx_lms_activity_log_user ON lms_activity_log(user_id);
CREATE INDEX idx_lms_activity_log_type ON lms_activity_log(activity_type);
CREATE INDEX idx_lms_activity_log_date ON lms_activity_log(created_at);

-- Quiz and assessment indexes
CREATE INDEX idx_lms_quiz_attempts_enrollment ON lms_quiz_attempts(enrollment_id, quiz_id);
CREATE INDEX idx_lms_quiz_attempts_score ON lms_quiz_attempts(percentage_score);