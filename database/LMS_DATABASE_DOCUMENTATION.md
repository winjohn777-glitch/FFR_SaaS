# Learning Management System (LMS) Database Documentation
## Florida First Roofing LLC - Training & Compliance Management

### Overview
This documentation covers the comprehensive Learning Management System database schema designed specifically for Florida First Roofing LLC's training and compliance management needs. The system integrates with the existing accounting database and supports OSHA compliance tracking, certification management, and training ROI analysis.

---

## 📋 Table of Contents
1. [System Architecture](#system-architecture)
2. [Database Schema](#database-schema)
3. [Integration Points](#integration-points)
4. [Installation & Setup](#installation--setup)
5. [Key Features](#key-features)
6. [Reporting & Analytics](#reporting--analytics)
7. [OSHA Compliance](#osha-compliance)
8. [Maintenance & Operations](#maintenance--operations)

---

## 🏗️ System Architecture

### Core Components
- **User Management**: Role-based access control with employee integration
- **Course Management**: Comprehensive course creation and delivery system
- **Progress Tracking**: Real-time enrollment and completion monitoring
- **Assessment System**: Quizzes, tests, and knowledge validation
- **Certification Management**: Digital certificate issuance and tracking
- **Compliance Monitoring**: OSHA and regulatory requirement tracking
- **Reporting Dashboard**: Analytics and compliance reporting
- **Financial Integration**: Training cost tracking and ROI analysis

### Integration with Accounting System
- Links to existing `employees` table
- Training cost tracking integrated with Chart of Accounts
- Financial reporting for training investments
- Equipment and materials inventory management

---

## 📊 Database Schema

### Primary Tables

#### User Management
- **`lms_user_roles`**: System access roles and permissions
- **`lms_users`**: LMS user profiles (extends employees table)
- **`lms_instructors`**: Internal and external instructor profiles

#### Course Management
- **`lms_course_categories`**: Course organization (Safety, Technical, Business, Certifications)
- **`lms_courses`**: Master course catalog with OSHA compliance flags
- **`lms_course_modules`**: Individual learning modules within courses
- **`lms_quizzes`**: Assessment and testing framework
- **`lms_quiz_questions`**: Individual quiz questions and answers

#### Progress & Enrollment
- **`lms_enrollments`**: User course enrollments and progress tracking
- **`lms_module_progress`**: Detailed module-level progress
- **`lms_quiz_attempts`**: Quiz results and scoring history

#### Certification & Compliance
- **`lms_certifications`**: Digital certificates issued
- **`lms_certification_renewals`**: Certificate renewal tracking
- **`lms_osha_compliance`**: OSHA standard compliance status
- **`lms_training_records`**: Audit trail for compliance reporting

#### System Operations
- **`lms_activity_log`**: System activity and user actions
- **`lms_course_reviews`**: Course ratings and feedback

### Financial Integration Tables
- **`training_costs`**: Training expense tracking
- **`training_materials`**: Training material inventory

---

## 🔗 Integration Points

### Existing System Connections
1. **Employees Table**: Extended with LMS-specific fields
   - `lms_user_id`: Links to LMS user profile
   - `training_status`: Current training assessment status
   - `osha_compliance_status`: Overall OSHA compliance status

2. **Chart of Accounts**: Training-related expense accounts
   - 6100: Training and Development
   - 6110: OSHA Compliance Training
   - 6120: Technical Certification
   - 6130: Training Materials
   - 6140: External Training Services

3. **Vendors Table**: Training service providers
4. **Equipment Table**: Training equipment and tools

---

## 🚀 Installation & Setup

### Prerequisites
- SQLite database with existing accounting schema
- Admin access to database
- Backup of existing data (recommended)

### Installation Steps

1. **Run Setup Script**
   ```sql
   .read database/setup-lms.sql
   ```

2. **Verify Installation**
   ```sql
   SELECT COUNT(*) FROM lms_users;
   SELECT COUNT(*) FROM lms_courses;
   ```

3. **Configure User Roles**
   - Assign employees to appropriate LMS roles
   - Set up instructor permissions
   - Configure department-level access

### Manual Setup Commands
```bash
# Using npm scripts
npm run setup-db    # Initialize main database
sqlite3 database.sqlite < database/setup-lms.sql

# Verify setup
sqlite3 database.sqlite "SELECT 'Setup complete. Users:', COUNT(*) FROM lms_users;"
```

---

## ✨ Key Features

### 🎓 Course Management
- **Multi-modal Content**: Video, documents, interactive modules
- **Structured Learning**: Sequential module progression
- **Prerequisites**: Course dependency management
- **OSHA Compliance**: Built-in regulatory compliance tracking
- **Expiration Management**: Automatic renewal notifications

### 👥 User Management
- **Role-Based Access**: Admin, Training Manager, Instructor, Supervisor, Employee
- **Department Integration**: Aligned with organizational structure
- **Progress Dashboards**: Individual and team progress tracking
- **Mobile-Friendly**: Responsive design considerations

### 📊 Assessment System
- **Multiple Question Types**: Multiple choice, true/false, short answer
- **Adaptive Testing**: Configurable passing scores and attempts
- **Immediate Feedback**: Results and explanations
- **Progress Tracking**: Detailed attempt history

### 🏆 Certification Management
- **Digital Certificates**: Automated certificate generation
- **Expiration Tracking**: Renewal date monitoring
- **Compliance Integration**: OSHA standard alignment
- **Audit Trail**: Complete certification history

---

## 📈 Reporting & Analytics

### Pre-Built Views

#### User Progress Reporting
- **`lms_user_progress_summary`**: Individual progress overview
- **`lms_training_schedule`**: Due dates and scheduling
- **`lms_department_training_summary`**: Department-level metrics

#### Course Analytics
- **`lms_course_analytics`**: Course performance metrics
- **`lms_course_engagement`**: Usage and completion statistics
- **`lms_instructor_performance`**: Instructor effectiveness metrics

#### Financial Analysis
- **`lms_training_roi_analysis`**: Training investment and ROI
- **`training_cost_summary`**: Cost analysis by employee

#### Compliance Tracking
- **`lms_osha_compliance_dashboard`**: Real-time compliance status
- **`lms_certification_expiration_tracking`**: Upcoming expirations
- **`lms_osha_standard_compliance`**: Standards-based compliance view

### Sample Queries

#### Training Progress Report
```sql
SELECT
    full_name,
    department,
    completed_courses,
    required_compliance_rate,
    certificates_earned
FROM lms_user_progress_summary
WHERE is_active = TRUE
ORDER BY required_compliance_rate ASC;
```

#### OSHA Compliance Alert
```sql
SELECT
    employee_name,
    osha_standard,
    expiration_date,
    expiration_status
FROM lms_osha_compliance_dashboard
WHERE expiration_status IN ('Expired', 'Expires Soon')
ORDER BY expiration_date ASC;
```

---

## ⚖️ OSHA Compliance

### Supported Standards
- **29 CFR 1926.501**: Fall Protection Standards
- **29 CFR 1926.95**: Personal Protective Equipment
- **29 CFR 1926.1050**: Ladders and Scaffolding
- Custom standards as needed

### Compliance Features
- **Automatic Tracking**: Links training to OSHA standards
- **Expiration Alerts**: Proactive renewal notifications
- **Audit Documentation**: Compliance history preservation
- **Reporting Integration**: Ready-to-submit compliance reports

### Compliance Workflow
1. Employee enrolls in OSHA-required course
2. Completes training and assessment
3. Receives certification with expiration date
4. System tracks compliance status
5. Automatic alerts for upcoming renewals
6. Audit trail maintained for inspections

---

## 🔧 Maintenance & Operations

### Regular Maintenance Tasks

#### Monthly
- Review course ratings and feedback
- Update expired certifications
- Clean old activity log entries
- Generate compliance reports

#### Quarterly
- Backup training records
- Review completion rates
- Update course content
- Analyze training ROI

#### Annually
- Archive old training records
- Review data retention policies
- Update OSHA requirements
- Performance optimization

### Database Maintenance
```sql
-- Clean old activity logs (older than 1 year)
DELETE FROM lms_activity_log
WHERE created_at < DATE('now', '-1 year')
AND activity_type NOT IN ('certification-issued', 'compliance-update');

-- Update course statistics
UPDATE lms_courses SET
    total_enrollments = (SELECT COUNT(*) FROM lms_enrollments WHERE course_id = lms_courses.id),
    total_completions = (SELECT COUNT(*) FROM lms_enrollments WHERE course_id = lms_courses.id AND status = 'completed');
```

### Backup Strategy
1. **Daily**: Incremental backups of activity logs
2. **Weekly**: Full database backup
3. **Monthly**: Archive historical training records
4. **Quarterly**: Export compliance reports for external storage

---

## 📋 Data Dictionary

### Key Data Types
- **Enrollment Status**: `enrolled`, `in-progress`, `completed`, `dropped`, `expired`
- **Compliance Status**: `compliant`, `expired`, `non-compliant`
- **Course Categories**: `Safety`, `Technical`, `Business`, `Certifications`, `Equipment`
- **User Roles**: `Admin`, `Training Manager`, `Instructor`, `Supervisor`, `Employee`
- **Difficulty Levels**: `Beginner`, `Intermediate`, `Advanced`

### Important Business Rules
- All safety courses are required for field personnel
- OSHA-compliant courses must have expiration dates
- Certifications require passing scores (typically 80%+)
- Training costs must be linked to appropriate GL accounts
- Audit trails must be maintained for 7 years minimum

---

## 🚨 Troubleshooting

### Common Issues

#### Enrollment Problems
- **Duplicate Enrollments**: Check unique constraint on (user_id, course_id)
- **Progress Not Updating**: Verify enrollment status and module completion
- **Missing Prerequisites**: Validate prerequisite course completion

#### Compliance Issues
- **OSHA Status Not Updating**: Check certification issuance triggers
- **Expiration Alerts Missing**: Verify date calculations and notification settings
- **Audit Trail Gaps**: Ensure all training completion events are logged

#### Performance Issues
- **Slow Queries**: Review indexes on frequently queried columns
- **Large Activity Logs**: Implement regular cleanup procedures
- **Report Timeouts**: Consider view materialization for complex reports

### Support Contacts
- **Database Issues**: System Administrator
- **Training Content**: Training Manager
- **Compliance Questions**: Safety Director
- **Financial Integration**: Accounting Manager

---

## 📝 Change Log

### Version 1.0 (Initial Release)
- Complete LMS schema implementation
- Integration with existing accounting system
- OSHA compliance tracking
- Comprehensive reporting views
- Sample data and setup scripts

### Future Enhancements
- Mobile application integration
- Advanced analytics dashboard
- Automated compliance reporting
- Integration with external training providers
- Multi-language support

---

*This documentation is maintained by the Florida First Roofing LLC IT Department and Training Management Team. Last updated: [Current Date]*