-- Florida First Roofing - Integration Test Data
-- Sample data for testing the lead-to-CRM integration pipeline

-- Insert test customers with various lead sources and types
INSERT INTO customers (
    lead_id, customer_number, first_name, last_name, email, phone,
    address, city, county, zip_code, customer_type, lead_source,
    acquisition_date, total_value, project_count, assigned_sales_rep,
    assigned_project_manager, preferences, metadata, notes
) VALUES
('LEAD-WEB-001', 'CUST-2024-001', 'John', 'Smith', 'john.smith@email.com', '(321) 555-0101',
 '123 Ocean Ave', 'Melbourne', 'brevard', '32901', 'residential', 'website',
 '2024-09-01 09:15:00', 12500.00, 1, 'Mike Johnson', 'Sarah Williams',
 '{"contact_time": "morning", "communication": "email", "frequency": "weekly"}',
 '{"original_urgency": "high", "roof_age": 15, "damage_type": "storm"}',
 'Storm damage from Hurricane Ian. Urgent repair needed.'),

('LEAD-WEB-002', 'CUST-2024-002', 'Maria', 'Rodriguez', 'maria.rodriguez@email.com', '(407) 555-0102',
 '456 Pine Street', 'Orlando', 'orange', '32801', 'residential', 'google',
 '2024-09-02 14:30:00', 18500.00, 1, 'David Chen', 'Robert Taylor',
 '{"contact_time": "evening", "communication": "phone", "frequency": "biweekly"}',
 '{"original_urgency": "medium", "roof_age": 20, "insurance_claim": true}',
 'Insurance claim for roof replacement. Preferred contractor program.'),

('LEAD-WEB-003', 'CUST-2024-003', 'Robert', 'Johnson', 'bob.johnson@business.com', '(386) 555-0103',
 '789 Commercial Blvd', 'Daytona Beach', 'volusia', '32114', 'commercial', 'referral',
 '2024-09-03 11:00:00', 45000.00, 1, 'Lisa Anderson', 'Mark Davis',
 '{"contact_time": "business_hours", "communication": "email", "frequency": "as_needed"}',
 '{"original_urgency": "medium", "building_size": "15000_sqft", "tenant_considerations": true}',
 'Commercial warehouse roof replacement. Multiple tenants, scheduling critical.'),

('LEAD-WEB-004', 'CUST-2024-004', 'Jennifer', 'Wilson', 'jenny.wilson@email.com', '(407) 555-0104',
 '321 Sunset Dr', 'Sanford', 'seminole', '32771', 'residential', 'facebook',
 '2024-09-04 16:45:00', 8500.00, 1, 'Tom Martinez', 'Sarah Williams',
 '{"contact_time": "afternoon", "communication": "text", "frequency": "minimal"}',
 '{"original_urgency": "low", "roof_age": 8, "maintenance_plan": true}',
 'Preventive maintenance and minor repairs. Looking for annual service plan.'),

('LEAD-WEB-005', 'CUST-2024-005', 'Michael', 'Davis', 'mike.davis@email.com', '(321) 555-0105',
 '654 Beach Road', 'Cocoa Beach', 'brevard', '32931', 'residential', 'website',
 '2024-09-05 08:20:00', 22000.00, 1, 'Mike Johnson', 'Robert Taylor',
 '{"contact_time": "morning", "communication": "email", "frequency": "weekly"}',
 '{"original_urgency": "emergency", "roof_age": 25, "leak_active": true}',
 'Active roof leak in master bedroom. Emergency response required.');

-- Insert corresponding projects
INSERT INTO projects (
    customer_id, lead_id, project_number, name, type, status, priority,
    address, county, estimated_value, actual_value, start_date, description, metadata
) VALUES
(1, 'LEAD-WEB-001', 'PROJ-2024-001', 'Smith Residence Storm Repair', 'storm-repair', 'in-progress', 'high',
 '123 Ocean Ave, Melbourne, FL 32901', 'brevard', 12500.00, 11800.00, '2024-09-15',
 'Storm damage repair from Hurricane Ian - missing shingles, damaged flashing',
 '{"damage_assessment": "moderate", "materials_ordered": true, "permit_status": "approved"}'),

(2, 'LEAD-WEB-002', 'PROJ-2024-002', 'Rodriguez Home Roof Replacement', 'roof-replacement', 'scheduled', 'medium',
 '456 Pine Street, Orlando, FL 32801', 'orange', 18500.00, 0, '2024-10-01',
 'Full roof replacement with architectural shingles, insurance claim',
 '{"insurance_claim": "approved", "adjuster_meeting": "2024-09-20", "materials_selected": true}'),

(3, 'LEAD-WEB-003', 'PROJ-2024-003', 'Commercial Warehouse Roof Replacement', 'roof-replacement', 'estimation', 'medium',
 '789 Commercial Blvd, Daytona Beach, FL 32114', 'volusia', 45000.00, 0, null,
 'Commercial TPO roof replacement with insulation upgrade',
 '{"building_type": "warehouse", "tenant_coordination": true, "engineering_required": true}'),

(4, 'LEAD-WEB-004', 'PROJ-2024-004', 'Wilson Home Maintenance', 'maintenance', 'completed', 'low',
 '321 Sunset Dr, Sanford, FL 32771', 'seminole', 8500.00, 7200.00, '2024-09-10',
 'Preventive maintenance, gutter cleaning, minor shingle replacement',
 '{"maintenance_plan": "annual", "inspection_complete": true, "warranty_extended": true}'),

(5, 'LEAD-WEB-005', 'PROJ-2024-005', 'Davis Emergency Leak Repair', 'emergency-repair', 'completed', 'emergency',
 '654 Beach Road, Cocoa Beach, FL 32931', 'brevard', 22000.00, 19500.00, '2024-09-05',
 'Emergency leak repair and partial roof replacement',
 '{"emergency_response": "same_day", "temporary_fix": "tarped", "full_repair_scheduled": true}');

-- Insert SOP workflow instances
INSERT INTO sop_workflows (
    workflow_id, sop_id, lead_id, customer_id, project_id, trigger_type,
    status, urgency, service_type, assigned_to, started_at, metadata
) VALUES
('WF-2024-001', 'SOP-001-LEAD-INTAKE', 'LEAD-WEB-001', 1, 1, 'lead_integration',
 'completed', 'high', 'storm-repair', 'Mike Johnson', '2024-09-01 09:30:00',
 '{"trigger_reason": "high_priority_storm_damage", "auto_assigned": true}'),

('WF-2024-002', 'SOP-200-INSURANCE-CLAIM', 'LEAD-WEB-002', 2, 2, 'lead_integration',
 'active', 'medium', 'roof-replacement', 'David Chen', '2024-09-02 15:00:00',
 '{"trigger_reason": "insurance_claim_detected", "adjuster_required": true}'),

('WF-2024-003', 'SOP-050-COMMERCIAL-PROCESS', 'LEAD-WEB-003', 3, 3, 'lead_integration',
 'active', 'medium', 'commercial', 'Lisa Anderson', '2024-09-03 11:30:00',
 '{"trigger_reason": "commercial_project", "engineering_review": true}'),

('WF-2024-004', 'SOP-001-LEAD-INTAKE', 'LEAD-WEB-004', 4, 4, 'lead_integration',
 'completed', 'low', 'maintenance', 'Tom Martinez', '2024-09-04 17:00:00',
 '{"trigger_reason": "maintenance_request", "annual_plan": true}'),

('WF-2024-005', 'SOP-010-EMERGENCY-RESPONSE', 'LEAD-WEB-005', 5, 5, 'lead_integration',
 'completed', 'emergency', 'emergency-repair', 'Mike Johnson', '2024-09-05 08:30:00',
 '{"trigger_reason": "emergency_leak", "immediate_response": true}');

-- Insert workflow tasks for active workflows
INSERT INTO sop_workflow_tasks (
    workflow_id, step_id, title, description, sequence_number, status,
    priority, assigned_to, due_date, completed_at, completion_notes, metadata
) VALUES
-- Tasks for WF-2024-002 (Insurance Claim Workflow - Active)
('WF-2024-002', 1, 'Initial Customer Contact', 'Contact customer within 2 hours of lead receipt', 1, 'completed',
 'high', 'David Chen', '2024-09-02 17:00:00', '2024-09-02 16:30:00',
 'Customer contacted. Appointment scheduled for assessment.', '{"contact_method": "phone", "customer_responsive": true}'),

('WF-2024-002', 2, 'Schedule Property Assessment', 'Schedule on-site property assessment', 2, 'completed',
 'high', 'David Chen', '2024-09-03 12:00:00', '2024-09-02 16:45:00',
 'Assessment scheduled for 2024-09-06 at 10:00 AM', '{"preferred_time": "morning", "access_confirmed": true}'),

('WF-2024-002', 3, 'Conduct Property Assessment', 'Perform detailed roof inspection and damage assessment', 3, 'pending',
 'high', 'Robert Taylor', '2024-09-06 12:00:00', null, null,
 '{"inspection_type": "comprehensive", "photos_required": true, "measurements_required": true}'),

('WF-2024-002', 4, 'Insurance Documentation', 'Prepare insurance claim documentation and photos', 4, 'pending',
 'medium', 'Robert Taylor', '2024-09-07 17:00:00', null, null,
 '{"documents_needed": ["photos", "measurements", "material_list"], "adjuster_meeting": "2024-09-20"}'),

-- Tasks for WF-2024-003 (Commercial Process Workflow - Active)
('WF-2024-003', 1, 'Commercial Lead Qualification', 'Qualify commercial lead and gather requirements', 1, 'completed',
 'medium', 'Lisa Anderson', '2024-09-03 17:00:00', '2024-09-03 14:00:00',
 'Lead qualified. Large commercial project confirmed.', '{"project_size": "large", "budget_confirmed": true}'),

('WF-2024-003', 2, 'Site Survey Scheduling', 'Schedule comprehensive site survey', 2, 'in_progress',
 'medium', 'Mark Davis', '2024-09-05 12:00:00', null, null,
 '{"survey_type": "comprehensive", "engineering_required": true, "tenant_coordination": true}'),

('WF-2024-003', 3, 'Engineering Assessment', 'Conduct structural engineering assessment', 3, 'pending',
 'medium', 'External Engineer', '2024-09-10 17:00:00', null, null,
 '{"assessment_type": "structural", "load_calculations": true, "compliance_review": true}');

-- Insert team assignments
INSERT INTO lead_assignments (
    lead_id, customer_id, project_id, sales_rep, project_manager, estimator,
    assignment_date, assignment_rules, status
) VALUES
('LEAD-WEB-001', 1, 1, 'Mike Johnson', 'Sarah Williams', 'Tom Martinez',
 '2024-09-01 09:20:00', '{"rule": "storm_damage_priority", "county": "brevard"}', 'active'),

('LEAD-WEB-002', 2, 2, 'David Chen', 'Robert Taylor', 'Lisa Anderson',
 '2024-09-02 14:35:00', '{"rule": "insurance_claim_specialist", "county": "orange"}', 'active'),

('LEAD-WEB-003', 3, 3, 'Lisa Anderson', 'Mark Davis', 'Mike Johnson',
 '2024-09-03 11:05:00', '{"rule": "commercial_team", "project_size": "large"}', 'active'),

('LEAD-WEB-004', 4, 4, 'Tom Martinez', 'Sarah Williams', 'David Chen',
 '2024-09-04 16:50:00', '{"rule": "maintenance_team", "county": "seminole"}', 'completed'),

('LEAD-WEB-005', 5, 5, 'Mike Johnson', 'Robert Taylor', 'Tom Martinez',
 '2024-09-05 08:25:00', '{"rule": "emergency_response", "urgency": "critical"}', 'completed');

-- Insert notifications
INSERT INTO notifications (
    notification_id, type, title, message, urgency, recipient_type,
    recipient_id, channels, lead_id, customer_id, project_id, workflow_id,
    sent_at, read_at
) VALUES
('NOTIF-2024-001', 'lead_received', 'New High Priority Lead', 'Storm damage lead received from John Smith in Brevard County',
 'high', 'internal_team', 'mike.johnson@ffr.com', '["email", "sms"]', 'LEAD-WEB-001', 1, 1, 'WF-2024-001',
 '2024-09-01 09:16:00', '2024-09-01 09:18:00'),

('NOTIF-2024-002', 'sop_due', 'Insurance Documentation Due', 'Insurance claim documentation due for Rodriguez project',
 'medium', 'internal_team', 'robert.taylor@ffr.com', '["email"]', 'LEAD-WEB-002', 2, 2, 'WF-2024-002',
 '2024-09-07 08:00:00', null),

('NOTIF-2024-003', 'emergency_alert', 'Emergency Lead Response Required', 'Active roof leak reported - immediate response needed',
 'critical', 'internal_team', 'emergency@ffr.com', '["email", "sms", "push"]', 'LEAD-WEB-005', 5, 5, 'WF-2024-005',
 '2024-09-05 08:21:00', '2024-09-05 08:23:00');

-- Insert integration logs
INSERT INTO integration_logs (
    event_type, event_data, lead_id, customer_id, project_id, workflow_id,
    success, processing_time_ms
) VALUES
('customer_created', '{"source": "website_form", "lead_score": 85, "auto_assignment": true}',
 'LEAD-WEB-001', 1, null, null, true, 145),

('sop_triggered', '{"sop_id": "SOP-001-LEAD-INTAKE", "trigger": "high_priority_storm_damage"}',
 'LEAD-WEB-001', 1, null, 'WF-2024-001', true, 89),

('team_assigned', '{"sales_rep": "Mike Johnson", "assignment_rule": "storm_damage_priority"}',
 'LEAD-WEB-001', 1, null, 'WF-2024-001', true, 67),

('project_created', '{"project_type": "storm-repair", "estimated_value": 12500}',
 'LEAD-WEB-001', 1, 1, 'WF-2024-001', true, 123),

('emergency_workflow_triggered', '{"urgency": "critical", "response_time": "immediate"}',
 'LEAD-WEB-005', 5, null, 'WF-2024-005', true, 234);

-- Insert lead analytics
INSERT INTO lead_analytics (
    lead_id, customer_id, project_id, lead_source, service_type, county,
    urgency, estimated_value, actual_value, lead_score, conversion_status,
    conversion_date, conversion_value, time_to_contact_minutes, time_to_conversion_hours,
    touchpoints, marketing_campaign, device_type
) VALUES
('LEAD-WEB-001', 1, 1, 'website', 'storm-repair', 'brevard',
 'high', 12500.00, 11800.00, 85, 'won', '2024-09-01 15:30:00', 11800.00,
 15, 6, 4, 'GOOGLE-2024-STORM', 'mobile'),

('LEAD-WEB-002', 2, 2, 'google', 'roof-replacement', 'orange',
 'medium', 18500.00, null, 92, 'qualified', null, null,
 30, null, 3, 'GOOGLE-2024-STORM', 'desktop'),

('LEAD-WEB-003', 3, 3, 'referral', 'commercial', 'volusia',
 'medium', 45000.00, null, 95, 'proposal', null, null,
 45, null, 2, 'REFERRAL-2024', 'desktop'),

('LEAD-WEB-004', 4, 4, 'facebook', 'maintenance', 'seminole',
 'low', 8500.00, 7200.00, 78, 'won', '2024-09-04 18:00:00', 7200.00,
 15, 2, 3, 'FB-2024-REPLACEMENT', 'mobile'),

('LEAD-WEB-005', 5, 5, 'website', 'emergency-repair', 'brevard',
 'emergency', 22000.00, 19500.00, 98, 'won', '2024-09-05 10:00:00', 19500.00,
 10, 2, 5, 'GOOGLE-2024-STORM', 'mobile');

-- Insert customer communications
INSERT INTO customer_communications (
    customer_id, lead_id, project_id, communication_type, direction,
    subject, content, channel, from_contact, to_contact, duration_minutes,
    outcome, follow_up_required, follow_up_date
) VALUES
(1, 'LEAD-WEB-001', 1, 'phone', 'outbound',
 'Initial Contact - Storm Damage Assessment', 'Called customer to schedule assessment. Customer confirmed damage from recent storm.',
 'phone_system', 'Mike Johnson', 'John Smith', 15, 'scheduled', true, '2024-09-15 10:00:00'),

(2, 'LEAD-WEB-002', 2, 'email', 'outbound',
 'Insurance Claim Process Information', 'Sent detailed information about our insurance claim process and documentation needed.',
 'gmail', 'David Chen', 'maria.rodriguez@email.com', null, 'info_sent', true, '2024-09-06 10:00:00'),

(3, 'LEAD-WEB-003', 3, 'meeting', 'outbound',
 'Commercial Project Consultation', 'Met with facility manager to discuss project scope and tenant coordination requirements.',
 'in_person', 'Lisa Anderson', 'Robert Johnson', 90, 'proposal_requested', true, '2024-09-10 14:00:00'),

(5, 'LEAD-WEB-005', 5, 'phone', 'inbound',
 'Emergency Leak Report', 'Customer called about active leak in master bedroom. Arranged immediate response.',
 'phone_system', 'Michael Davis', 'Emergency Line', 8, 'emergency_scheduled', false, null);

-- Insert campaign attribution
INSERT INTO lead_campaign_attribution (
    lead_id, campaign_id, attribution_type, click_data
) VALUES
('LEAD-WEB-001', 'GOOGLE-2024-STORM', 'direct',
 '{"utm_source": "google", "utm_medium": "cpc", "utm_campaign": "storm-damage", "keyword": "emergency roof repair"}'),

('LEAD-WEB-002', 'GOOGLE-2024-STORM', 'direct',
 '{"utm_source": "google", "utm_medium": "cpc", "utm_campaign": "storm-damage", "keyword": "roof replacement insurance"}'),

('LEAD-WEB-003', 'REFERRAL-2024', 'direct',
 '{"referrer": "Johnson Construction", "referral_code": "REF-JC-2024", "referral_bonus": 500}'),

('LEAD-WEB-004', 'FB-2024-REPLACEMENT', 'direct',
 '{"utm_source": "facebook", "utm_medium": "social", "utm_campaign": "roof-replacement", "ad_set": "seminole-county"}'),

('LEAD-WEB-005', 'GOOGLE-2024-STORM', 'direct',
 '{"utm_source": "google", "utm_medium": "cpc", "utm_campaign": "storm-damage", "keyword": "emergency roof leak repair"}');