-- Initial Forms & Checklists Data for Florida First Roofing
-- Populates the forms system with essential forms based on SOP analysis

-- Insert reusable form fields
INSERT OR IGNORE INTO sop_form_fields (field_code, field_name, field_type, field_category, validation_rules, is_required, display_order) VALUES
-- Basic information fields
('employee_name', 'Employee Name', 'text', 'basic', '{"minLength": 2, "maxLength": 100}', 1, 1),
('employee_id', 'Employee ID', 'text', 'basic', '{"pattern": "^[A-Z0-9]{4,10}$"}', 1, 2),
('date_completed', 'Date Completed', 'date', 'basic', '{"required": true}', 1, 3),
('supervisor_name', 'Supervisor Name', 'text', 'basic', '{"minLength": 2, "maxLength": 100}', 1, 4),
('project_number', 'Project Number', 'text', 'project', '{"pattern": "^[A-Z0-9-]{5,15}$"}', 0, 5),
('customer_name', 'Customer Name', 'text', 'customer', '{"minLength": 2, "maxLength": 100}', 0, 6),
('location_address', 'Location Address', 'textarea', 'location', '{"minLength": 10, "maxLength": 200}', 0, 7),

-- Safety fields
('ppe_worn', 'Personal Protective Equipment Worn', 'checkbox_group', 'safety', '{}', 1, 10),
('safety_hazards_identified', 'Safety Hazards Identified', 'textarea', 'safety', '{}', 0, 11),
('safety_measures_taken', 'Safety Measures Taken', 'textarea', 'safety', '{}', 0, 12),
('incident_occurred', 'Incident Occurred', 'radio', 'safety', '{}', 1, 13),
('incident_description', 'Incident Description', 'textarea', 'safety', '{}', 0, 14),

-- Quality control fields
('work_quality_rating', 'Work Quality Rating', 'radio', 'quality', '{}', 1, 20),
('defects_found', 'Defects Found', 'checkbox_group', 'quality', '{}', 0, 21),
('corrective_actions', 'Corrective Actions Taken', 'textarea', 'quality', '{}', 0, 22),
('materials_inspected', 'Materials Inspected', 'checkbox', 'quality', '{}', 1, 23),
('tools_inspected', 'Tools Inspected', 'checkbox', 'quality', '{}', 1, 24),

-- Customer satisfaction fields
('customer_satisfaction', 'Customer Satisfaction Rating', 'radio', 'customer', '{}', 0, 30),
('customer_feedback', 'Customer Feedback', 'textarea', 'customer', '{}', 0, 31),
('work_area_clean', 'Work Area Left Clean', 'checkbox', 'customer', '{}', 1, 32),

-- Weather and environmental fields
('weather_conditions', 'Weather Conditions', 'dropdown', 'environment', '{}', 1, 40),
('wind_speed', 'Wind Speed (mph)', 'number', 'environment', '{"min": 0, "max": 100}', 0, 41),
('temperature', 'Temperature (°F)', 'number', 'environment', '{"min": 0, "max": 130}', 0, 42),
('humidity_level', 'Humidity Level (%)', 'number', 'environment', '{"min": 0, "max": 100}', 0, 43),

-- Equipment and materials fields
('equipment_used', 'Equipment Used', 'checkbox_group', 'equipment', '{}', 0, 50),
('materials_used', 'Materials Used', 'textarea', 'materials', '{}', 0, 51),
('material_quantities', 'Material Quantities', 'table', 'materials', '{}', 0, 52),
('equipment_condition', 'Equipment Condition', 'radio', 'equipment', '{}', 1, 53),

-- Digital signature fields
('employee_signature', 'Employee Signature', 'signature', 'signature', '{}', 1, 90),
('supervisor_signature', 'Supervisor Signature', 'signature', 'signature', '{}', 0, 91),
('customer_signature', 'Customer Signature', 'signature', 'signature', '{}', 0, 92);

-- Insert form templates
INSERT OR IGNORE INTO sop_form_templates (template_name, template_category, template_type, form_fields, validation_rules, branding_config, is_default, industry_specific) VALUES
-- Safety inspection template
('Safety Inspection Template', 'safety', 'inspection',
'[
  {"field": "employee_name", "required": true},
  {"field": "date_completed", "required": true},
  {"field": "location_address", "required": true},
  {"field": "ppe_worn", "required": true, "options": ["Hard Hat", "Safety Glasses", "Gloves", "Steel-Toe Boots", "Safety Harness", "High-Vis Vest"]},
  {"field": "safety_hazards_identified", "required": false},
  {"field": "safety_measures_taken", "required": false},
  {"field": "employee_signature", "required": true}
]',
'{"required_fields": ["employee_name", "date_completed", "ppe_worn", "employee_signature"]}',
'{"header": "Florida First Roofing LLC - Safety Inspection", "footer": "CCC1336561 | 321-301-4512"}',
1, 1),

-- Quality control template
('Quality Control Template', 'quality', 'inspection',
'[
  {"field": "employee_name", "required": true},
  {"field": "supervisor_name", "required": true},
  {"field": "date_completed", "required": true},
  {"field": "project_number", "required": true},
  {"field": "work_quality_rating", "required": true, "options": ["Excellent", "Good", "Satisfactory", "Needs Improvement", "Unsatisfactory"]},
  {"field": "defects_found", "required": false, "options": ["Material Defects", "Installation Issues", "Alignment Problems", "Missing Components", "Damage"]},
  {"field": "corrective_actions", "required": false},
  {"field": "supervisor_signature", "required": true}
]',
'{"required_fields": ["employee_name", "supervisor_name", "date_completed", "project_number", "work_quality_rating", "supervisor_signature"]}',
'{"header": "Florida First Roofing LLC - Quality Control Inspection", "footer": "CCC1336561 | 321-301-4512"}',
1, 1);

-- Insert core forms based on SOP requirements
INSERT OR IGNORE INTO sop_forms (
    form_code, form_name, description, category, form_type, sop_id, is_required, is_active,
    florida_specific, hurricane_related, osha_related, completion_time_minutes,
    digital_signature_required, approval_required, created_by
) VALUES

-- Safety & OSHA Compliance Forms (Category: safety)
('SAFETY-001', 'Roof Safety Inspection Checklist', 'Comprehensive roof safety inspection checklist for OSHA compliance', 'safety', 'checklist', NULL, 1, 1, 1, 0, 1, 20, 1, 1, 'System Administrator'),
('SAFETY-002', 'Fall Protection Equipment Verification Form', 'Daily verification of fall protection equipment condition and setup', 'safety', 'form', NULL, 1, 1, 1, 0, 1, 15, 1, 1, 'System Administrator'),
('SAFETY-003', 'Ladder Safety Inspection Checklist', 'Pre-use ladder safety inspection and setup verification', 'safety', 'checklist', NULL, 1, 1, 0, 0, 1, 10, 1, 0, 'System Administrator'),
('SAFETY-004', 'Personal Protective Equipment (PPE) Checklist', 'Daily PPE inspection and verification checklist', 'safety', 'checklist', NULL, 1, 1, 0, 0, 1, 5, 1, 0, 'System Administrator'),
('SAFETY-005', 'Job Site Safety Orientation Form', 'Safety orientation form for new workers and visitors', 'safety', 'form', NULL, 1, 1, 1, 0, 1, 30, 1, 1, 'System Administrator'),
('SAFETY-006', 'Incident/Accident Report Form', 'Comprehensive incident and accident reporting form', 'safety', 'report', NULL, 1, 1, 0, 0, 1, 25, 1, 1, 'System Administrator'),
('SAFETY-007', 'Daily Safety Huddle Form', 'Daily team safety meeting documentation form', 'safety', 'form', NULL, 1, 1, 0, 0, 1, 10, 1, 0, 'System Administrator'),

-- Florida Hurricane & Weather Forms (Category: emergency)
('WEATHER-001', 'Pre-Hurricane Preparation Checklist', 'Comprehensive pre-hurricane preparation and site securing checklist', 'emergency', 'checklist', NULL, 1, 1, 1, 1, 0, 45, 1, 1, 'System Administrator'),
('WEATHER-002', 'Post-Hurricane Damage Assessment Form', 'Post-storm damage assessment and recovery planning form', 'emergency', 'form', NULL, 1, 1, 1, 1, 0, 60, 1, 1, 'System Administrator'),
('WEATHER-003', 'Emergency Response Team Deployment Form', 'Emergency response team activation and deployment form', 'emergency', 'form', NULL, 1, 1, 1, 1, 0, 20, 1, 1, 'System Administrator'),
('WEATHER-004', 'Weather Delay Documentation Form', 'Weather-related work delay documentation for project tracking', 'emergency', 'form', NULL, 1, 1, 1, 1, 0, 15, 1, 0, 'System Administrator'),
('WEATHER-005', 'High Velocity Hurricane Zone (HVHZ) Compliance Checklist', 'HVHZ building code compliance verification checklist', 'compliance', 'checklist', NULL, 1, 1, 1, 1, 0, 30, 1, 1, 'System Administrator'),

-- Roofing Operations Forms (Category: operations)
('OPS-001', 'Roof Inspection Report Form', 'Comprehensive roof condition assessment and inspection report', 'operations', 'report', NULL, 1, 1, 1, 0, 0, 45, 1, 1, 'System Administrator'),
('OPS-002', 'Material Delivery Verification Checklist', 'Material delivery inspection and verification checklist', 'operations', 'checklist', NULL, 1, 1, 0, 0, 0, 15, 1, 0, 'System Administrator'),
('OPS-003', 'Quality Control Inspection Checklist', 'Work quality control inspection and verification checklist', 'operations', 'checklist', NULL, 1, 1, 0, 0, 0, 25, 1, 1, 'System Administrator'),
('OPS-004', 'Project Completion Verification Form', 'Project completion sign-off and verification form', 'operations', 'form', NULL, 1, 1, 0, 0, 0, 20, 1, 1, 'System Administrator'),
('OPS-005', 'Customer Satisfaction Survey Form', 'Customer satisfaction and feedback collection form', 'operations', 'form', NULL, 0, 1, 0, 0, 0, 10, 1, 0, 'System Administrator'),
('OPS-006', 'Warranty Documentation Form', 'Warranty information and documentation form', 'operations', 'form', NULL, 1, 1, 1, 0, 0, 15, 1, 0, 'System Administrator'),

-- Regulatory & Compliance Forms (Category: compliance)
('COMP-001', 'Florida Building Code Compliance Checklist', 'Florida Building Code compliance verification checklist', 'compliance', 'checklist', NULL, 1, 1, 1, 0, 0, 35, 1, 1, 'System Administrator'),
('COMP-002', 'Contractor License Verification Form', 'Contractor and subcontractor license verification form', 'compliance', 'form', NULL, 1, 1, 1, 0, 0, 10, 1, 1, 'System Administrator'),
('COMP-003', 'Insurance Verification Checklist', 'Insurance coverage verification and documentation checklist', 'compliance', 'checklist', NULL, 1, 1, 0, 0, 0, 15, 1, 1, 'System Administrator'),
('COMP-004', 'Environmental Compliance Form', 'Environmental protection and compliance documentation form', 'compliance', 'form', NULL, 1, 1, 1, 0, 0, 20, 1, 1, 'System Administrator'),
('COMP-005', 'Local Permit Requirements Checklist', 'Local building permit requirements verification checklist', 'compliance', 'checklist', NULL, 1, 1, 1, 0, 0, 25, 1, 1, 'System Administrator'),

-- SOP-Specific Forms (Category: administrative)
('SOP-2000-001', 'User Access Request Form', 'CRM system user access request and approval form', 'administrative', 'form', NULL, 1, 1, 0, 0, 0, 10, 1, 1, 'System Administrator'),
('SOP-2000-002', 'Data Migration Checklist', 'CRM data migration verification and sign-off checklist', 'administrative', 'checklist', NULL, 1, 1, 0, 0, 0, 30, 1, 1, 'System Administrator'),
('SOP-2100-001', 'Financial System Access Request Form', 'Financial system access request and approval form', 'administrative', 'form', NULL, 1, 1, 0, 0, 0, 10, 1, 1, 'System Administrator'),
('SOP-2100-002', 'Month-End Close Checklist', 'Month-end financial close process verification checklist', 'administrative', 'checklist', NULL, 1, 1, 0, 0, 0, 45, 1, 1, 'System Administrator'),
('SOP-2200-001', 'Project Initiation Form', 'Project management system project initiation form', 'administrative', 'form', NULL, 1, 1, 0, 0, 0, 20, 1, 1, 'System Administrator'),
('SOP-3100-001', 'Security Incident Report Form', 'Information security incident reporting form', 'administrative', 'report', NULL, 1, 1, 0, 0, 0, 25, 1, 1, 'System Administrator'),
('SOP-4000-001', 'Work Order Completion Checklist', 'Field service work order completion verification checklist', 'operations', 'checklist', NULL, 1, 1, 0, 0, 0, 15, 1, 0, 'System Administrator'),
('SOP-5000-001', 'Lead Qualification Form', 'Sales lead qualification and assessment form', 'administrative', 'form', NULL, 1, 1, 0, 0, 0, 15, 1, 0, 'System Administrator');

-- Insert form approvers for critical forms
INSERT OR IGNORE INTO sop_form_approvers (form_id, approver_employee_id, approval_level, can_delegate) VALUES
-- Safety forms require supervisor approval
((SELECT id FROM sop_forms WHERE form_code = 'SAFETY-001'), 1, 1, 1),
((SELECT id FROM sop_forms WHERE form_code = 'SAFETY-002'), 1, 1, 1),
((SELECT id FROM sop_forms WHERE form_code = 'SAFETY-005'), 1, 1, 1),
((SELECT id FROM sop_forms WHERE form_code = 'SAFETY-006'), 1, 1, 0),

-- Emergency forms require management approval
((SELECT id FROM sop_forms WHERE form_code = 'WEATHER-001'), 1, 1, 0),
((SELECT id FROM sop_forms WHERE form_code = 'WEATHER-002'), 1, 1, 0),
((SELECT id FROM sop_forms WHERE form_code = 'WEATHER-003'), 1, 1, 0),

-- Operations forms require project manager approval
((SELECT id FROM sop_forms WHERE form_code = 'OPS-001'), 1, 1, 1),
((SELECT id FROM sop_forms WHERE form_code = 'OPS-003'), 1, 1, 1),
((SELECT id FROM sop_forms WHERE form_code = 'OPS-004'), 1, 1, 0),

-- Compliance forms require compliance officer approval
((SELECT id FROM sop_forms WHERE form_code = 'COMP-001'), 1, 1, 0),
((SELECT id FROM sop_forms WHERE form_code = 'COMP-002'), 1, 1, 0),
((SELECT id FROM sop_forms WHERE form_code = 'COMP-003'), 1, 1, 0);

-- Insert notification settings for key forms
INSERT OR IGNORE INTO sop_form_notifications (form_id, notification_type, recipient_role, notification_template, send_email, send_sms, days_before_due) VALUES
-- Safety incident notifications
((SELECT id FROM sop_forms WHERE form_code = 'SAFETY-006'), 'submission', 'manager', 'Safety incident reported - immediate attention required', 1, 1, 0),
((SELECT id FROM sop_forms WHERE form_code = 'SAFETY-006'), 'approval', 'submitter', 'Your safety incident report has been reviewed', 1, 0, 0),

-- Emergency response notifications
((SELECT id FROM sop_forms WHERE form_code = 'WEATHER-002'), 'submission', 'manager', 'Post-hurricane damage assessment submitted', 1, 1, 0),
((SELECT id FROM sop_forms WHERE form_code = 'WEATHER-003'), 'submission', 'admin', 'Emergency response team deployment activated', 1, 1, 0),

-- Compliance notifications
((SELECT id FROM sop_forms WHERE form_code = 'COMP-001'), 'reminder', 'submitter', 'Building code compliance check due soon', 1, 0, 3),
((SELECT id FROM sop_forms WHERE form_code = 'COMP-002'), 'reminder', 'submitter', 'License verification due soon', 1, 0, 7);

-- Verify the insertions
SELECT 'Forms Created' as table_name, COUNT(*) as record_count FROM sop_forms
UNION ALL
SELECT 'Form Fields Created' as table_name, COUNT(*) as record_count FROM sop_form_fields
UNION ALL
SELECT 'Form Templates Created' as table_name, COUNT(*) as record_count FROM sop_form_templates
UNION ALL
SELECT 'Form Approvers Created' as table_name, COUNT(*) as record_count FROM sop_form_approvers
UNION ALL
SELECT 'Form Notifications Created' as table_name, COUNT(*) as record_count FROM sop_form_notifications;

-- Show forms by category
SELECT
    category,
    COUNT(*) as form_count,
    GROUP_CONCAT(form_code || ': ' || form_name, '; ') as forms
FROM sop_forms
WHERE is_active = 1
GROUP BY category
ORDER BY category;