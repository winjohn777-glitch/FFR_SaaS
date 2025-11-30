-- =====================================================
-- SOP MANAGEMENT SYSTEM DATABASE SCHEMA
-- Standard Operating Procedures for Florida First Roofing
-- =====================================================

-- SOP Categories (0000-9999 numbering system)
CREATE TABLE sop_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_code VARCHAR(4) NOT NULL UNIQUE, -- 0000, 1000, 2000, etc.
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    color_code VARCHAR(7) DEFAULT '#1e40af', -- Hex color for UI
    icon_name VARCHAR(50), -- Icon identifier for UI
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- SOP Procedures (350+ procedures)
CREATE TABLE sop_procedures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sop_number VARCHAR(10) NOT NULL UNIQUE, -- 0001, 1015, 2050, etc.
    category_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    version VARCHAR(10) DEFAULT '1.0',
    status VARCHAR(20) DEFAULT 'draft', -- draft, active, under_review, archived
    priority_level VARCHAR(10) DEFAULT 'standard', -- critical, high, standard, low
    compliance_required BOOLEAN DEFAULT FALSE,
    florida_specific BOOLEAN DEFAULT FALSE,
    hurricane_related BOOLEAN DEFAULT FALSE,
    osha_related BOOLEAN DEFAULT FALSE,

    -- Content fields
    purpose TEXT NOT NULL,
    scope TEXT NOT NULL,
    procedure_steps TEXT NOT NULL, -- JSON array of steps
    required_materials TEXT, -- JSON array of materials/tools
    safety_requirements TEXT,
    quality_checkpoints TEXT, -- JSON array of checkpoints
    forms_required TEXT, -- JSON array of form IDs
    estimated_duration_minutes INTEGER,

    -- Metadata
    created_by VARCHAR(100),
    approved_by VARCHAR(100),
    approval_date DATE,
    effective_date DATE,
    review_date DATE,
    next_review_date DATE,

    -- File attachments
    attachments TEXT, -- JSON array of file paths

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES sop_categories(id)
);

-- SOP Forms and Checklists (350+ forms)
CREATE TABLE sop_forms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    form_code VARCHAR(20) NOT NULL UNIQUE, -- FORM-SAF-001, FORM-QC-015, etc.
    form_name VARCHAR(200) NOT NULL,
    form_type VARCHAR(50) NOT NULL, -- checklist, inspection, safety, quality, training
    category_id INTEGER,
    related_sop_id INTEGER,

    -- Form structure
    form_fields TEXT NOT NULL, -- JSON structure of form fields
    validation_rules TEXT, -- JSON validation rules
    auto_populate_fields TEXT, -- JSON array of auto-populated fields

    -- Configuration
    is_required BOOLEAN DEFAULT FALSE,
    requires_signature BOOLEAN DEFAULT FALSE,
    requires_photos BOOLEAN DEFAULT FALSE,
    mobile_friendly BOOLEAN DEFAULT TRUE,
    offline_capable BOOLEAN DEFAULT TRUE,

    -- Compliance
    compliance_type VARCHAR(50), -- OSHA, Florida_Building_Code, Insurance, Internal
    retention_period_days INTEGER DEFAULT 2555, -- 7 years default

    version VARCHAR(10) DEFAULT '1.0',
    status VARCHAR(20) DEFAULT 'active',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES sop_categories(id),
    FOREIGN KEY (related_sop_id) REFERENCES sop_procedures(id)
);

-- SOP Manuals (15 comprehensive manuals)
CREATE TABLE sop_manuals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    manual_code VARCHAR(20) NOT NULL UNIQUE, -- MANUAL-SAF-001, MANUAL-FL-001, etc.
    manual_name VARCHAR(200) NOT NULL,
    manual_type VARCHAR(50) NOT NULL, -- safety, quality, employee, operations, etc.
    description TEXT,

    -- Content organization
    table_of_contents TEXT, -- JSON structure of chapters/sections
    included_sops TEXT, -- JSON array of SOP IDs included in manual
    included_forms TEXT, -- JSON array of form IDs included in manual

    -- File management
    file_path VARCHAR(500), -- Path to PDF or document file
    file_size_mb DECIMAL(10,2),
    file_hash VARCHAR(64), -- For version control

    -- Publishing
    version VARCHAR(10) DEFAULT '1.0',
    status VARCHAR(20) DEFAULT 'draft',
    published_date DATE,
    effective_date DATE,

    -- Access control
    access_level VARCHAR(20) DEFAULT 'all_employees', -- all_employees, supervisors, managers, executives
    florida_specific BOOLEAN DEFAULT FALSE,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- SOP Assignments (automated assignment to projects/employees)
CREATE TABLE sop_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    assignment_type VARCHAR(20) NOT NULL, -- project, employee, job_type, event

    -- Assignment targets
    project_id INTEGER,
    employee_id INTEGER,
    job_type VARCHAR(50), -- triggers for specific job types
    event_trigger VARCHAR(50), -- hurricane_warning, safety_incident, etc.

    -- SOP references
    sop_id INTEGER NOT NULL,
    form_id INTEGER,

    -- Assignment details
    assigned_date DATE NOT NULL,
    due_date DATE,
    priority VARCHAR(10) DEFAULT 'standard',
    status VARCHAR(20) DEFAULT 'assigned', -- assigned, in_progress, completed, overdue

    -- Completion tracking
    completed_date DATE,
    completed_by INTEGER, -- employee_id
    completion_notes TEXT,
    compliance_verified BOOLEAN DEFAULT FALSE,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES jobs(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (sop_id) REFERENCES sop_procedures(id),
    FOREIGN KEY (form_id) REFERENCES sop_forms(id),
    FOREIGN KEY (completed_by) REFERENCES employees(id)
);

-- SOP Compliance Tracking
CREATE TABLE sop_compliance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    employee_id INTEGER,
    sop_id INTEGER NOT NULL,

    -- Compliance measurement
    compliance_date DATE NOT NULL,
    compliance_score DECIMAL(5,2), -- 0.00 to 100.00
    compliance_status VARCHAR(20) NOT NULL, -- compliant, non_compliant, partial, not_assessed

    -- Assessment details
    assessor_id INTEGER, -- employee who performed assessment
    assessment_method VARCHAR(50), -- self_assessment, supervisor_review, audit, automatic
    findings TEXT,
    corrective_actions TEXT,

    -- Performance correlation
    quality_impact_score DECIMAL(5,2), -- Impact on quality metrics
    safety_impact_score DECIMAL(5,2), -- Impact on safety metrics
    efficiency_impact_score DECIMAL(5,2), -- Impact on efficiency metrics

    -- Follow-up
    requires_retraining BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    follow_up_completed BOOLEAN DEFAULT FALSE,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES jobs(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (sop_id) REFERENCES sop_procedures(id),
    FOREIGN KEY (assessor_id) REFERENCES employees(id)
);

-- SOP Workflows (automated business rules)
CREATE TABLE sop_workflows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workflow_name VARCHAR(100) NOT NULL,
    workflow_type VARCHAR(50) NOT NULL, -- project_start, employee_onboard, incident_response, etc.

    -- Trigger conditions
    trigger_conditions TEXT NOT NULL, -- JSON rules for when workflow activates

    -- Workflow steps
    workflow_steps TEXT NOT NULL, -- JSON array of workflow steps

    -- Configuration
    is_active BOOLEAN DEFAULT TRUE,
    auto_execute BOOLEAN DEFAULT TRUE,
    requires_approval BOOLEAN DEFAULT FALSE,
    approval_role VARCHAR(50), -- supervisor, manager, safety_officer

    -- Performance tracking
    execution_count INTEGER DEFAULT 0,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    average_completion_time_hours DECIMAL(8,2),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- SOP Workflow Executions (tracking individual workflow runs)
CREATE TABLE sop_workflow_executions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workflow_id INTEGER NOT NULL,

    -- Execution context
    triggered_by VARCHAR(50), -- project_creation, employee_hire, weather_alert, etc.
    triggered_by_user_id INTEGER,
    project_id INTEGER,
    employee_id INTEGER,

    -- Execution tracking
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    status VARCHAR(20) DEFAULT 'running', -- running, completed, failed, cancelled

    -- Step tracking
    current_step INTEGER DEFAULT 1,
    total_steps INTEGER NOT NULL,
    completed_steps INTEGER DEFAULT 0,
    failed_steps INTEGER DEFAULT 0,

    -- Results
    success BOOLEAN DEFAULT FALSE,
    error_message TEXT,
    execution_log TEXT, -- JSON log of all steps

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workflow_id) REFERENCES sop_workflows(id),
    FOREIGN KEY (triggered_by_user_id) REFERENCES employees(id),
    FOREIGN KEY (project_id) REFERENCES jobs(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- SOP Training Integration (connects to existing LMS)
CREATE TABLE sop_training_requirements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sop_id INTEGER NOT NULL,

    -- Training requirements
    training_required BOOLEAN DEFAULT FALSE,
    certification_required BOOLEAN DEFAULT FALSE,
    recertification_period_months INTEGER,

    -- LMS integration
    lms_course_id INTEGER, -- Links to existing courses table
    prerequisite_courses TEXT, -- JSON array of course IDs
    competency_level_required VARCHAR(20), -- basic, intermediate, advanced, expert

    -- Role requirements
    required_for_roles TEXT, -- JSON array of employee positions
    florida_license_required BOOLEAN DEFAULT FALSE,
    osha_certification_required BOOLEAN DEFAULT FALSE,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sop_id) REFERENCES sop_procedures(id)
);

-- SOP Performance Analytics
CREATE TABLE sop_performance_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sop_id INTEGER NOT NULL,
    project_id INTEGER,

    -- Time period
    measurement_date DATE NOT NULL,
    measurement_period VARCHAR(20) NOT NULL, -- daily, weekly, monthly, project

    -- Performance metrics
    usage_count INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    average_completion_time_minutes DECIMAL(8,2),
    compliance_rate DECIMAL(5,2) DEFAULT 0.00,

    -- Quality correlation
    quality_score DECIMAL(5,2), -- 0.00 to 100.00
    customer_satisfaction_impact DECIMAL(5,2),
    rework_reduction_percentage DECIMAL(5,2),

    -- Safety correlation
    safety_incidents_count INTEGER DEFAULT 0,
    safety_score_improvement DECIMAL(5,2),

    -- Efficiency correlation
    time_savings_percentage DECIMAL(5,2),
    cost_savings_amount DECIMAL(12,2),
    productivity_improvement DECIMAL(5,2),

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sop_id) REFERENCES sop_procedures(id),
    FOREIGN KEY (project_id) REFERENCES jobs(id)
);

-- SOP Mobile Sync (for offline access)
CREATE TABLE sop_mobile_sync (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER NOT NULL,
    device_id VARCHAR(100) NOT NULL,

    -- Sync content
    synced_sops TEXT, -- JSON array of SOP IDs downloaded
    synced_forms TEXT, -- JSON array of form IDs downloaded
    synced_manuals TEXT, -- JSON array of manual IDs downloaded

    -- Sync tracking
    last_sync_date DATETIME,
    sync_status VARCHAR(20) DEFAULT 'pending', -- pending, syncing, completed, failed
    sync_size_mb DECIMAL(10,2),

    -- Offline changes
    pending_uploads TEXT, -- JSON array of offline changes to upload
    conflict_resolution TEXT, -- JSON array of conflicts to resolve

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- =====================================================
-- FLORIDA-SPECIFIC SOP TABLES
-- =====================================================

-- Hurricane Season Management
CREATE TABLE hurricane_procedures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hurricane_category INTEGER, -- 1-5
    procedure_phase VARCHAR(20) NOT NULL, -- preparation, during, after

    -- Automatic triggers
    wind_speed_threshold INTEGER, -- mph trigger
    time_before_landfall_hours INTEGER,
    evacuation_zone VARCHAR(10), -- A, B, C, etc.

    -- SOP references
    required_sops TEXT, -- JSON array of SOP IDs
    emergency_forms TEXT, -- JSON array of emergency form IDs

    -- Project impact
    project_suspension_required BOOLEAN DEFAULT FALSE,
    equipment_securing_required BOOLEAN DEFAULT TRUE,
    material_protection_required BOOLEAN DEFAULT TRUE,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- HVHZ (High Velocity Hurricane Zone) Compliance
CREATE TABLE hvhz_compliance_procedures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    county VARCHAR(50) NOT NULL,
    zip_code VARCHAR(10),
    hvhz_designation VARCHAR(10) NOT NULL, -- A, B, C

    -- Compliance requirements
    required_sops TEXT, -- JSON array of HVHZ-specific SOPs
    required_inspections TEXT, -- JSON array of inspection types
    required_certifications TEXT, -- JSON array of certifications

    -- Installation standards
    wind_load_requirements INTEGER, -- psf
    fastener_specifications TEXT, -- JSON specifications
    material_restrictions TEXT, -- JSON material limitations

    effective_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_sop_procedures_category ON sop_procedures(category_id);
CREATE INDEX idx_sop_procedures_status ON sop_procedures(status);
CREATE INDEX idx_sop_procedures_florida ON sop_procedures(florida_specific);
CREATE INDEX idx_sop_procedures_hurricane ON sop_procedures(hurricane_related);
CREATE INDEX idx_sop_assignments_project ON sop_assignments(project_id);
CREATE INDEX idx_sop_assignments_employee ON sop_assignments(employee_id);
CREATE INDEX idx_sop_assignments_status ON sop_assignments(status);
CREATE INDEX idx_sop_compliance_project ON sop_compliance(project_id);
CREATE INDEX idx_sop_compliance_employee ON sop_compliance(employee_id);
CREATE INDEX idx_sop_compliance_date ON sop_compliance(compliance_date);
CREATE INDEX idx_sop_performance_sop ON sop_performance_metrics(sop_id);
CREATE INDEX idx_sop_performance_date ON sop_performance_metrics(measurement_date);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- SOP Compliance Dashboard
CREATE VIEW sop_compliance_dashboard AS
SELECT
    sp.sop_number,
    sp.title,
    sc.category_name,
    COUNT(sa.id) as total_assignments,
    COUNT(CASE WHEN sa.status = 'completed' THEN 1 END) as completed_assignments,
    COUNT(CASE WHEN sa.status = 'overdue' THEN 1 END) as overdue_assignments,
    ROUND(
        (COUNT(CASE WHEN sa.status = 'completed' THEN 1 END) * 100.0) /
        NULLIF(COUNT(sa.id), 0), 2
    ) as completion_rate,
    AVG(spm.compliance_rate) as avg_compliance_rate
FROM sop_procedures sp
JOIN sop_categories sc ON sp.category_id = sc.id
LEFT JOIN sop_assignments sa ON sp.id = sa.sop_id
LEFT JOIN sop_performance_metrics spm ON sp.id = spm.sop_id
WHERE sp.status = 'active'
GROUP BY sp.id, sp.sop_number, sp.title, sc.category_name;

-- Employee SOP Training Status
CREATE VIEW employee_sop_training_status AS
SELECT
    e.id as employee_id,
    e.first_name || ' ' || e.last_name as employee_name,
    e.position,
    COUNT(str.id) as required_sop_trainings,
    COUNT(CASE WHEN sa.status = 'completed' THEN 1 END) as completed_trainings,
    COUNT(CASE WHEN sa.status = 'overdue' THEN 1 END) as overdue_trainings,
    ROUND(
        (COUNT(CASE WHEN sa.status = 'completed' THEN 1 END) * 100.0) /
        NULLIF(COUNT(str.id), 0), 2
    ) as training_completion_rate
FROM employees e
LEFT JOIN sop_training_requirements str ON JSON_EXTRACT(str.required_for_roles, '$[*]') LIKE '%' || e.position || '%'
LEFT JOIN sop_assignments sa ON str.sop_id = sa.sop_id AND e.id = sa.employee_id
WHERE e.is_active = TRUE
GROUP BY e.id, e.first_name, e.last_name, e.position;

-- Project SOP Compliance Summary
CREATE VIEW project_sop_compliance AS
SELECT
    j.id as project_id,
    j.job_number,
    j.job_name,
    j.job_status,
    COUNT(sa.id) as total_sop_assignments,
    COUNT(CASE WHEN sa.status = 'completed' THEN 1 END) as completed_sops,
    COUNT(CASE WHEN sa.status = 'overdue' THEN 1 END) as overdue_sops,
    ROUND(
        (COUNT(CASE WHEN sa.status = 'completed' THEN 1 END) * 100.0) /
        NULLIF(COUNT(sa.id), 0), 2
    ) as sop_compliance_rate,
    AVG(sc.compliance_score) as avg_compliance_score
FROM jobs j
LEFT JOIN sop_assignments sa ON j.id = sa.project_id
LEFT JOIN sop_compliance sc ON j.id = sc.project_id
GROUP BY j.id, j.job_number, j.job_name, j.job_status;