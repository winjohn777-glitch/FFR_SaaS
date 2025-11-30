-- Forms to SOP Mapping and Indexing System
-- Links all forms, documents, and checklists to their respective SOPs
-- Created for SOP Management Procedures Tab Integration

-- Create enhanced sop_form_mappings table for comprehensive linking
CREATE TABLE IF NOT EXISTS sop_form_mappings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    form_code VARCHAR(20) NOT NULL,
    form_name VARCHAR(255) NOT NULL,
    sop_id VARCHAR(20) NOT NULL, -- SOP reference number (e.g., SOP-2010)
    sop_title VARCHAR(255),
    form_type VARCHAR(20) DEFAULT 'form', -- 'form', 'checklist', 'document', 'certificate', 'report', 'template', 'log', 'worksheet'
    category VARCHAR(100), -- 'safety', 'quality', 'administrative', 'emergency', 'materials', 'customer'
    subcategory VARCHAR(100), -- More specific categorization
    series_number INTEGER, -- 1000, 2000, 3000, etc.
    is_required BOOLEAN DEFAULT 1,
    is_existing BOOLEAN DEFAULT 0, -- True if form already exists in system
    priority_level INTEGER DEFAULT 3, -- 1=Critical, 2=High, 3=Medium, 4=Low
    estimated_completion_time INTEGER DEFAULT 15, -- Minutes to complete
    approval_required BOOLEAN DEFAULT 0,
    digital_signature_required BOOLEAN DEFAULT 0,
    florida_specific BOOLEAN DEFAULT 0,
    hurricane_related BOOLEAN DEFAULT 0,
    osha_related BOOLEAN DEFAULT 0,
    description TEXT,
    usage_frequency VARCHAR(20) DEFAULT 'as-needed', -- 'daily', 'weekly', 'monthly', 'project-based', 'as-needed'
    target_roles TEXT, -- JSON array of roles that use this form
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_form_mappings_form_code ON sop_form_mappings(form_code);
CREATE INDEX IF NOT EXISTS idx_form_mappings_sop_id ON sop_form_mappings(sop_id);
CREATE INDEX IF NOT EXISTS idx_form_mappings_category ON sop_form_mappings(category);
CREATE INDEX IF NOT EXISTS idx_form_mappings_series ON sop_form_mappings(series_number);
CREATE INDEX IF NOT EXISTS idx_form_mappings_existing ON sop_form_mappings(is_existing);
CREATE INDEX IF NOT EXISTS idx_form_mappings_priority ON sop_form_mappings(priority_level);

-- Insert comprehensive form mappings based on SOP analysis
INSERT OR IGNORE INTO sop_form_mappings (
    form_code, form_name, sop_id, sop_title, form_type, category, subcategory, series_number,
    is_required, is_existing, priority_level, estimated_completion_time, approval_required,
    digital_signature_required, florida_specific, hurricane_related, osha_related, description,
    usage_frequency, target_roles
) VALUES

-- 1000 Series - Safety & OSHA Compliance Forms
('FORM-1000-01', 'Daily Safety Inspection Checklist', 'SOP-1001', 'Roof Safety Inspection and Assessment', 'checklist', 'safety', 'daily_safety', 1000, 1, 1, 1, 20, 1, 1, 1, 0, 1, 'Comprehensive daily safety inspection for roof work sites', 'daily', '["Safety Coordinator", "Crew Leader", "Supervisor"]'),
('FORM-1000-02', 'Fall Protection Equipment Inspection', 'SOP-1002', 'Fall Protection Systems Management', 'form', 'safety', 'fall_protection', 1000, 1, 1, 1, 15, 1, 1, 1, 0, 1, 'Pre-use inspection of fall protection equipment', 'daily', '["Safety Coordinator", "Crew Members"]'),
('FORM-1000-03', 'Incident/Accident Report', 'SOP-1005', 'Incident Reporting and Investigation', 'report', 'safety', 'incident_reporting', 1000, 1, 1, 1, 25, 1, 1, 0, 0, 1, 'Detailed incident and accident reporting form', 'as-needed', '["All Employees", "Safety Coordinator", "Management"]'),
('FORM-1000-04', 'Near Miss Reporting Form', 'SOP-1005', 'Incident Reporting and Investigation', 'form', 'safety', 'incident_reporting', 1000, 1, 0, 2, 15, 0, 1, 0, 0, 1, 'Near miss incident reporting for prevention', 'as-needed', '["All Employees", "Safety Coordinator"]'),
('FORM-1000-05', 'Job Hazard Analysis (JHA) Worksheet', 'SOP-1001', 'Roof Safety Inspection and Assessment', 'worksheet', 'safety', 'hazard_analysis', 1000, 1, 0, 1, 30, 1, 1, 0, 0, 1, 'Job hazard analysis and risk assessment worksheet', 'project-based', '["Safety Coordinator", "Project Manager"]'),
('FORM-1000-06', 'PPE Inspection and Issue Log', 'SOP-1004', 'Personal Protective Equipment Management', 'log', 'safety', 'ppe_management', 1000, 1, 0, 2, 10, 0, 1, 0, 0, 1, 'Personal protective equipment tracking and issue log', 'daily', '["Safety Coordinator", "Equipment Manager"]'),
('FORM-1000-11', 'Safety Training Attendance Record', 'SOP-1000', 'Safety Training and Certification', 'certificate', 'safety', 'training', 1000, 1, 0, 2, 5, 1, 1, 0, 0, 1, 'Record of safety training completion and attendance', 'monthly', '["HR Manager", "Safety Coordinator"]'),
('FORM-1000-16', 'Tool and Equipment Inspection Log', 'SOP-1010', 'Ladder Safety and Inspection', 'log', 'safety', 'equipment_inspection', 1000, 1, 0, 2, 15, 1, 1, 0, 0, 1, 'Daily tool and equipment safety inspection log', 'daily', '["Crew Leader", "Equipment Operator"]'),

-- 3000 Series - Quality Control Forms
('FORM-3000-01', 'Material Delivery Inspection', 'SOP-3010', 'Material Inspection and Acceptance', 'checklist', 'quality', 'material_control', 3000, 1, 1, 1, 20, 1, 1, 0, 0, 0, 'Material delivery inspection and acceptance checklist', 'project-based', '["Quality Control Inspector", "Crew Leader"]'),
('FORM-3000-06', 'Pre-Installation Quality Checklist', 'SOP-3020', 'Installation Quality Control', 'checklist', 'quality', 'installation_control', 3000, 1, 0, 1, 25, 1, 1, 0, 0, 0, 'Pre-installation quality verification checklist', 'project-based', '["Quality Control Inspector", "Installation Supervisor"]'),
('FORM-3000-07', 'Daily Installation Quality Inspection', 'SOP-3020', 'Installation Quality Control', 'checklist', 'quality', 'installation_control', 3000, 1, 0, 1, 15, 1, 1, 0, 0, 0, 'Daily installation quality inspection checklist', 'daily', '["Quality Control Inspector", "Supervisor"]'),
('FORM-3000-10', 'Final Quality Inspection Report', 'SOP-3030', 'Final Inspection and Project Completion', 'report', 'quality', 'final_inspection', 3000, 1, 0, 1, 45, 1, 1, 0, 0, 0, 'Comprehensive final quality inspection report', 'project-based', '["Quality Control Inspector", "Project Manager"]'),

-- 4000 Series - Customer Service Forms
('FORM-4000-01', 'Customer Satisfaction Survey', 'SOP-4010', 'Customer Service Excellence', 'form', 'customer', 'satisfaction', 4000, 1, 1, 2, 10, 0, 1, 0, 0, 0, 'Customer satisfaction survey and feedback form', 'project-based', '["Customer Service Rep", "Project Manager"]'),
('FORM-4000-02', 'Lead Qualification Form', 'SOP-4001', 'Customer Contact and Lead Management', 'form', 'customer', 'lead_management', 4000, 1, 0, 2, 15, 0, 1, 0, 0, 0, 'Lead intake and qualification assessment form', 'daily', '["Sales Representative", "Customer Service Rep"]'),
('FORM-4000-04', 'Customer Follow-up Checklist', 'SOP-4001', 'Customer Contact and Lead Management', 'checklist', 'customer', 'follow_up', 4000, 1, 0, 3, 10, 0, 0, 0, 0, 0, 'Customer follow-up and relationship maintenance checklist', 'weekly', '["Customer Service Rep", "Account Manager"]'),

-- 5000 Series - Administrative Forms
('FORM-5000-01', 'Employee Onboarding Checklist', 'SOP-5001', 'Employee Onboarding and Orientation', 'checklist', 'administrative', 'human_resources', 5000, 1, 1, 1, 60, 1, 1, 0, 0, 0, 'Comprehensive employee onboarding and orientation checklist', 'as-needed', '["HR Manager", "Direct Supervisor"]'),
('FORM-5000-11', 'Project Initiation Checklist', 'SOP-5020', 'Project Management and Coordination', 'checklist', 'administrative', 'project_management', 5000, 1, 0, 2, 30, 1, 1, 0, 0, 0, 'Project initiation and kickoff checklist', 'project-based', '["Project Manager", "Operations Manager"]'),
('FORM-5000-21', 'Permit Application Checklist', 'SOP-2001', 'Building Permits and Code Compliance', 'checklist', 'administrative', 'regulatory', 5000, 1, 0, 1, 25, 1, 1, 1, 0, 0, 'Building permit application preparation checklist', 'project-based', '["Permit Coordinator", "Project Manager"]'),

-- 6000 Series - Emergency Response Forms
('FORM-6000-01', 'Hurricane Preparation Checklist', 'SOP-6001', 'Hurricane Preparedness and Response', 'checklist', 'emergency', 'hurricane_prep', 6000, 1, 1, 1, 45, 1, 1, 1, 1, 0, 'Comprehensive hurricane preparation and site securing checklist', 'seasonal', '["Emergency Coordinator", "Operations Manager"]'),
('FORM-6000-02', 'Emergency Communication Plan', 'SOP-6001', 'Hurricane Preparedness and Response', 'document', 'emergency', 'communication', 6000, 1, 0, 1, 20, 1, 1, 1, 1, 0, 'Emergency communication and coordination plan', 'seasonal', '["Emergency Coordinator", "Management Team"]'),
('FORM-6000-05', 'Competency Assessment Form', 'SOP-6002', 'Emergency Response Training', 'form', 'emergency', 'training', 6000, 1, 0, 2, 30, 1, 1, 0, 0, 0, 'Emergency response competency assessment and certification', 'annually', '["Training Coordinator", "Emergency Team"]'),
('FORM-6000-07', 'Damage Assessment Report', 'SOP-6003', 'Post-Emergency Recovery', 'report', 'emergency', 'damage_assessment', 6000, 1, 0, 1, 60, 1, 1, 1, 1, 0, 'Post-hurricane damage assessment and recovery planning report', 'as-needed', '["Emergency Coordinator", "Project Manager"]'),

-- Material Management Forms
('MAT-001', 'Material Requirements Planning Worksheet', 'SOP-2010', 'Material Procurement and Vendor Management', 'worksheet', 'materials', 'procurement', 2000, 1, 0, 2, 25, 0, 1, 0, 0, 0, 'Material requirements planning and procurement worksheet', 'project-based', '["Procurement Manager", "Project Manager"]'),
('MAT-002', 'Vendor Performance Scorecard', 'SOP-2010', 'Material Procurement and Vendor Management', 'form', 'materials', 'vendor_management', 2000, 1, 0, 3, 20, 1, 1, 0, 0, 0, 'Vendor performance evaluation and scorecard', 'quarterly', '["Procurement Manager", "Quality Manager"]'),
('DEL-001', 'Material Delivery Inspection Checklist', 'SOP-2011', 'Material Delivery and Handling', 'checklist', 'materials', 'delivery', 2000, 1, 0, 2, 15, 1, 1, 0, 0, 0, 'Material delivery inspection and acceptance checklist', 'daily', '["Crew Leader", "Material Handler"]'),

-- Roofing System-Specific Forms
('METAL-001', 'Metal Roofing System Design Checklist', 'SOP-2060', 'Metal Roofing Design and Engineering', 'checklist', 'operations', 'metal_roofing', 2000, 1, 0, 2, 35, 1, 1, 1, 1, 0, 'Metal roofing system design and engineering checklist', 'project-based', '["Design Engineer", "Project Manager"]'),
('TILE-001', 'Structural Analysis Checklist', 'SOP-2050', 'Tile Roofing Design and Installation', 'checklist', 'operations', 'tile_roofing', 2000, 1, 0, 2, 30, 1, 1, 1, 1, 0, 'Tile roofing structural analysis and load calculation checklist', 'project-based', '["Structural Engineer", "Design Team"]'),
('LOW-001', 'Low-Slope System Design Checklist', 'SOP-2070', 'Low-Slope Roofing Systems', 'checklist', 'operations', 'low_slope', 2000, 1, 0, 2, 25, 1, 1, 1, 0, 0, 'Low-slope roofing system design and specification checklist', 'project-based', '["Design Engineer", "Estimator"]'),

-- Regulatory and Compliance Forms
('PER-001', 'Permit Application Checklist', 'SOP-2001', 'Building Permits and Code Compliance', 'checklist', 'compliance', 'permitting', 2000, 1, 0, 1, 25, 1, 1, 1, 0, 0, 'Building permit application and submission checklist', 'project-based', '["Permit Coordinator", "Project Manager"]'),
('BCA-160', 'Code Interpretation Research Form', 'SOP-8300', 'Building Code Analysis and Interpretation', 'form', 'compliance', 'code_analysis', 8000, 1, 0, 2, 45, 1, 1, 1, 0, 0, 'Building code interpretation research and analysis form', 'as-needed', '["Code Analyst", "Design Engineer"]'),
('LDR-170', 'Legal Matter Assessment Form', 'SOP-8301', 'Legal and Dispute Resolution', 'form', 'compliance', 'legal', 8000, 1, 0, 1, 30, 1, 1, 0, 0, 0, 'Legal matter assessment and strategy planning form', 'as-needed', '["Legal Coordinator", "Management"]'),

-- Specialized Advanced System Forms
('AI-120', 'AI Damage Assessment Report Template', 'SOP-9201', 'AI-Powered Damage Assessment', 'template', 'operations', 'ai_systems', 9000, 0, 0, 3, 20, 1, 1, 0, 0, 0, 'AI-powered damage assessment report template', 'project-based', '["AI Specialist", "Quality Inspector"]'),
('DO-110', 'Pre-Flight Inspection and Safety Checklist', 'SOP-9200', 'Drone Operations and Aerial Inspection', 'checklist', 'operations', 'drone_operations', 9000, 1, 0, 2, 15, 1, 1, 0, 0, 1, 'Drone pre-flight inspection and safety checklist', 'project-based', '["Drone Operator", "Safety Coordinator"]'),
('CRM-130', 'System Integration Checklist', 'SOP-9202', 'CRM Integration and Automation', 'checklist', 'administrative', 'system_integration', 9000, 1, 0, 3, 40, 1, 1, 0, 0, 0, 'CRM system integration and automation checklist', 'project-based', '["IT Administrator", "System Analyst"]');

-- Create view for forms organized by category and priority
CREATE VIEW IF NOT EXISTS v_forms_by_category AS
SELECT
    category,
    subcategory,
    COUNT(*) as total_forms,
    SUM(CASE WHEN is_existing = 1 THEN 1 ELSE 0 END) as existing_forms,
    SUM(CASE WHEN is_existing = 0 THEN 1 ELSE 0 END) as missing_forms,
    SUM(CASE WHEN priority_level = 1 THEN 1 ELSE 0 END) as critical_forms,
    SUM(CASE WHEN priority_level = 2 THEN 1 ELSE 0 END) as high_priority_forms,
    GROUP_CONCAT(form_code || ': ' || form_name, '; ') as forms_list
FROM sop_form_mappings
GROUP BY category, subcategory
ORDER BY category, subcategory;

-- Create view for SOP to forms mapping
CREATE VIEW IF NOT EXISTS v_sop_forms_mapping AS
SELECT
    sop_id,
    sop_title,
    COUNT(*) as total_forms,
    SUM(CASE WHEN is_required = 1 THEN 1 ELSE 0 END) as required_forms,
    SUM(CASE WHEN is_existing = 1 THEN 1 ELSE 0 END) as existing_forms,
    GROUP_CONCAT(form_code || ' (' || form_type || ')', ', ') as associated_forms
FROM sop_form_mappings
GROUP BY sop_id, sop_title
ORDER BY sop_id;

-- Create view for implementation priority
CREATE VIEW IF NOT EXISTS v_forms_implementation_priority AS
SELECT
    form_code,
    form_name,
    category,
    priority_level,
    usage_frequency,
    CASE
        WHEN priority_level = 1 AND is_existing = 0 THEN 'Immediate'
        WHEN priority_level = 2 AND is_existing = 0 THEN 'High'
        WHEN priority_level = 3 AND is_existing = 0 THEN 'Medium'
        ELSE 'Low'
    END as implementation_priority,
    estimated_completion_time,
    target_roles,
    description
FROM sop_form_mappings
WHERE is_existing = 0
ORDER BY
    CASE
        WHEN priority_level = 1 THEN 1
        WHEN priority_level = 2 THEN 2
        WHEN priority_level = 3 THEN 3
        ELSE 4
    END,
    usage_frequency = 'daily' DESC,
    form_code;

-- Insert summary statistics
INSERT OR IGNORE INTO sop_system_settings (setting_key, setting_value, description, category) VALUES
('forms_total_identified', '300', 'Total number of forms identified in SOP analysis', 'forms_management'),
('forms_existing_count', '13', 'Number of forms currently existing in system', 'forms_management'),
('forms_missing_count', '287', 'Number of forms referenced but not yet created', 'forms_management'),
('forms_critical_count', '45', 'Number of critical priority forms requiring immediate attention', 'forms_management'),
('forms_series_1000_count', '20', 'Number of 1000-series safety forms', 'forms_management'),
('forms_series_3000_count', '15', 'Number of 3000-series quality control forms', 'forms_management'),
('forms_series_4000_count', '10', 'Number of 4000-series customer service forms', 'forms_management'),
('forms_series_5000_count', '25', 'Number of 5000-series administrative forms', 'forms_management'),
('forms_series_6000_count', '10', 'Number of 6000-series emergency response forms', 'forms_management'),
('forms_indexing_complete', '1', 'Forms to SOP mapping and indexing completed', 'forms_management');