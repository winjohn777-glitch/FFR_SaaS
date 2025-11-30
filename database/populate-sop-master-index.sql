-- =====================================================
-- SOP MASTER INDEX DATA POPULATION
-- Based on Florida First Roofing LLC Complete SOP Framework
-- =====================================================

-- Clear existing SOP data (if any)
DELETE FROM sop_compliance;
DELETE FROM sop_assignments;
DELETE FROM sop_procedures;
DELETE FROM sop_categories;

-- =====================================================
-- SOP CATEGORIES (Based on Master Index Sections)
-- =====================================================

INSERT INTO sop_categories (category_code, category_name, description, color_code, icon_name, sort_order) VALUES
('0000', 'Foundation and Governance SOPs', 'Master framework, document control, and governance procedures', '#1e40af', 'shield-check', 1),
('1000', 'Safety and Compliance SOPs', 'Fall protection, PPE, electrical safety, and emergency management', '#dc2626', 'hard-hat', 2),
('2000', 'Enterprise Software Systems', 'Core business applications, financial systems, and project management', '#059669', 'monitor', 3),
('3000', 'IT Infrastructure and Security', 'Network management, security protocols, and data management', '#7c3aed', 'server', 4),
('4000', 'Operations and Field Systems', 'Field operations technology and inventory management', '#f59e0b', 'truck', 5),
('5000', 'Customer and Sales Systems', 'Sales automation, marketing, and customer service systems', '#10b981', 'users', 6),
('6000', 'Human Resources and Training', 'HR systems and learning management platforms', '#06b6d4', 'user-check', 7),
('7000', 'Compliance and Quality Systems', 'Regulatory compliance and quality management procedures', '#8b5cf6', 'clipboard-check', 8),
('8000', 'Integration and Automation', 'System integration and process automation workflows', '#ef4444', 'zap', 9),
('9000', 'Reporting and Documentation', 'Enterprise reporting and document management systems', '#6b7280', 'file-text', 10);

-- =====================================================
-- SAFETY AND COMPLIANCE SOPs (1000-1999)
-- =====================================================

-- Fall Protection Systems (1000-1009)
INSERT INTO sop_procedures (sop_number, category_id, title, purpose, scope, procedure_steps, status, priority_level, compliance_required, florida_specific, hurricane_related, osha_related, safety_requirements, estimated_duration_minutes) VALUES
('1000', 2, 'Universal Fall Protection System', 'Comprehensive fall protection procedures for all roofing operations', 'All roofing work above 6 feet in height', '["Pre-work safety inspection", "Equipment verification", "Harness and anchor point setup", "Work execution with fall protection", "Post-work equipment inspection"]', 'active', 'critical', true, true, false, true, 'Full body harness, shock-absorbing lanyard, secure anchor points, hard hat, safety shoes', 45),
('1001', 2, 'Personal Fall Arrest System (PFAS) Selection and Use', 'Proper selection, inspection, and use of PFAS equipment', 'All employees working at heights requiring fall protection', '["Equipment selection criteria", "Pre-use inspection checklist", "Proper donning procedures", "Anchor point evaluation", "Emergency rescue procedures"]', 'active', 'critical', true, true, false, true, 'PFAS equipment, inspection tags, emergency communication device', 30),
('1003', 2, 'Safety Net System Deployment and Inspection', 'Installation and maintenance of safety net systems', 'Large commercial projects and complex roof configurations', '["Net system design verification", "Installation procedures", "Daily inspection requirements", "Load testing protocols", "Maintenance schedules"]', 'active', 'high', true, true, false, true, 'Safety nets, installation hardware, load testing equipment', 60),

-- Ladder and Access Equipment (1010-1019)
('1011', 2, 'Extension Ladder Setup and Safety Protocols', 'Safe setup and use of extension ladders', 'All ladder access to roofs and elevated work areas', '["Ladder inspection", "Proper angle setup (4:1 ratio)", "Securing procedures", "Three-point contact maintenance", "Weather considerations"]', 'active', 'high', true, true, false, true, 'Extension ladder, ladder stabilizer, tie-off equipment, level indicator', 25),

-- Electrical Safety (1020-1029)
('1021', 2, 'Ground Fault Circuit Interrupter (GFCI) Requirements', 'GFCI protection for electrical tools and equipment', 'All electrical equipment use in roofing operations', '["GFCI device inspection", "Proper installation", "Testing procedures", "Tool connection protocols", "Troubleshooting procedures"]', 'active', 'critical', true, true, false, true, 'GFCI devices, electrical tester, proper extension cords', 20),

-- Personal Protective Equipment (1030-1039)
('1030', 2, 'PPE Assessment and Selection Procedures', 'Assessment and selection of appropriate PPE for roofing tasks', 'All employees and job sites', '["Job hazard analysis", "PPE selection matrix", "Fit testing procedures", "Training requirements", "Documentation protocols"]', 'active', 'critical', true, true, false, true, 'Various PPE options, fit testing equipment, documentation forms', 40),
('1031', 2, 'Hard Hat Requirements and Compliance', 'Hard hat selection, use, and maintenance standards', 'All job sites and work areas', '["Hard hat classification", "Proper fit and adjustment", "Inspection procedures", "Replacement criteria", "Compliance monitoring"]', 'active', 'critical', true, true, false, true, 'Hard hats, adjustment tools, inspection forms', 15),

-- Emergency Management (1050-1069)
('1050', 2, 'Emergency Action Plan Implementation', 'Comprehensive emergency response procedures', 'All job sites and company facilities', '["Emergency contact procedures", "Evacuation routes", "Assembly points", "Communication protocols", "Emergency equipment locations"]', 'active', 'critical', true, true, true, true, 'Emergency communication devices, first aid supplies, evacuation plans', 90),
('1060', 2, 'Incident Reporting and Investigation Procedures', 'Systematic incident reporting and investigation process', 'All workplace incidents and near-miss events', '["Immediate response procedures", "Documentation requirements", "Investigation protocols", "Root cause analysis", "Corrective action implementation"]', 'active', 'critical', true, true, false, true, 'Incident report forms, investigation tools, camera, measuring equipment', 120);

-- =====================================================
-- ENTERPRISE SOFTWARE SYSTEMS (2000-2999)
-- =====================================================

-- Core Business Applications (2000-2099)
INSERT INTO sop_procedures (sop_number, category_id, title, purpose, scope, procedure_steps, status, priority_level, compliance_required, florida_specific, hurricane_related, osha_related, safety_requirements, estimated_duration_minutes) VALUES
('2000', 3, 'CRM System Administration and Configuration', 'Setup and management of Customer Relationship Management system', 'All customer data and sales process management', '["System access and security setup", "Customer data entry standards", "Sales pipeline configuration", "Reporting setup", "Integration with other systems"]', 'active', 'high', true, false, false, false, 'Administrative access, backup procedures, data validation protocols', 180),
('2001', 3, 'CRM User Management and Access Control', 'Management of CRM user accounts and permissions', 'All sales and customer service personnel', '["User account creation", "Role-based permissions", "Access level assignment", "Regular access reviews", "Account deactivation procedures"]', 'active', 'high', true, false, false, false, 'Administrative privileges, user management documentation', 90),

-- Financial and Accounting Systems (2100-2199)
('2100', 3, 'Accounting Software Configuration and Setup', 'Initial setup and ongoing configuration of accounting systems', 'All financial operations and reporting', '["Chart of accounts setup", "User permissions configuration", "Integration parameters", "Backup and security protocols", "Audit trail maintenance"]', 'active', 'critical', true, false, false, false, 'Administrative access, financial system documentation, backup procedures', 240),
('2112', 3, 'Cost Accounting and Job Costing', 'Accurate tracking of project costs and profitability', 'All roofing projects and cost centers', '["Job setup procedures", "Cost allocation methods", "Time tracking integration", "Material cost capture", "Profitability analysis"]', 'active', 'high', true, false, false, false, 'Cost tracking tools, integration with field systems', 120),

-- Project Management Systems (2200-2299)
('2200', 3, 'Project Management Software Implementation', 'Setup and deployment of project management systems', 'All construction projects and resource management', '["System configuration", "Project template creation", "Resource allocation setup", "Integration with accounting", "Mobile app deployment"]', 'active', 'high', true, false, false, false, 'Project management software, integration tools, mobile devices', 300);

-- =====================================================
-- ROOFING-SPECIFIC FLORIDA SOPs
-- =====================================================

-- Florida Building Code Compliance
INSERT INTO sop_procedures (sop_number, category_id, title, purpose, scope, procedure_steps, status, priority_level, compliance_required, florida_specific, hurricane_related, osha_related, safety_requirements, estimated_duration_minutes) VALUES
('7010', 8, 'OSHA 10-Hour Construction Training Program', 'Mandatory OSHA training for all construction workers', 'All field personnel and new hires', '["Training schedule coordination", "Curriculum delivery", "Assessment procedures", "Certification tracking", "Renewal requirements"]', 'active', 'critical', true, false, false, true, 'OSHA training materials, assessment tools, certification tracking', 600),

-- Hurricane Preparedness SOPs
('1500', 2, 'Hurricane Preparedness and Response Protocol', 'Comprehensive hurricane preparation and response procedures', 'All Florida operations during hurricane season', '["72-hour preparation checklist", "Equipment securing procedures", "Project suspension protocols", "Communication plans", "Post-storm assessment"]', 'active', 'critical', true, true, true, true, 'Emergency supplies, communication equipment, securing materials, safety equipment', 180),
('1501', 2, 'High Velocity Hurricane Zone (HVHZ) Compliance', 'Special requirements for HVHZ designated areas', 'Projects in Miami-Dade and Broward counties', '["HVHZ permit requirements", "Enhanced fastening protocols", "Material certification", "Special inspection procedures", "Documentation requirements"]', 'active', 'critical', true, true, true, false, 'HVHZ-approved materials, enhanced fastening equipment, inspection tools', 240),

-- Florida Roofing Installation Procedures
('3100', 2, 'Florida Building Code Roofing Installation', 'Roofing installation per Florida Building Code requirements', 'All roofing installations in Florida', '["Code compliance verification", "Permit coordination", "Installation standards", "Inspection scheduling", "Final certification"]', 'active', 'critical', true, true, false, false, 'Florida Building Code reference, inspection checklist, measurement tools', 360),
('3101', 2, 'Wind Load Calculation and Fastener Requirements', 'Proper calculation and implementation of wind load requirements', 'All roofing installations subject to high wind loads', '["Wind zone determination", "Load calculation procedures", "Fastener selection criteria", "Installation pattern requirements", "Quality verification"]', 'active', 'critical', true, true, true, false, 'Wind load calculator, fastener specifications, installation tools', 120),

-- Waterproofing and Weatherproofing
('3200', 2, 'Secondary Water Barrier Installation', 'Installation of ice and water shield in critical areas', 'All shingle and tile roof installations', '["Critical area identification", "Product selection", "Installation procedures", "Overlap requirements", "Quality inspection"]', 'active', 'high', true, true, false, false, 'Ice and water shield, installation tools, measurement equipment', 90),
('3201', 2, 'Flashing Installation and Weatherproofing', 'Proper flashing installation for Florida weather conditions', 'All roof penetrations and transitions', '["Flashing material selection", "Installation sequences", "Sealant application", "Quality checkpoints", "Long-term maintenance"]', 'active', 'high', true, true, false, false, 'Flashing materials, sealants, installation tools, measuring equipment', 150);

-- =====================================================
-- TECHNOLOGY AND AUTOMATION SOPs
-- =====================================================

INSERT INTO sop_procedures (sop_number, category_id, title, purpose, scope, procedure_steps, status, priority_level, compliance_required, florida_specific, hurricane_related, osha_related, safety_requirements, estimated_duration_minutes) VALUES
-- Integration and Automation (8000-8099)
('8000', 9, 'API Management and Governance', 'Management of application programming interfaces', 'All system integrations and data exchanges', '["API inventory management", "Security protocols", "Version control", "Performance monitoring", "Documentation maintenance"]', 'active', 'high', true, false, false, false, 'API management tools, security protocols, monitoring systems', 240),
('8100', 9, 'Robotic Process Automation (RPA) Platform', 'Implementation and management of RPA solutions', 'Repetitive business processes and data entry tasks', '["Process identification", "Bot development", "Testing procedures", "Deployment protocols", "Performance monitoring"]', 'active', 'standard', false, false, false, false, 'RPA platform, development tools, testing environment', 480),

-- Mobile Technology SOPs
('4000', 5, 'Field Service Management System', 'Mobile technology for field operations', 'All field personnel and mobile operations', '["Mobile app deployment", "Offline synchronization", "Data collection procedures", "Real-time updates", "Troubleshooting protocols"]', 'active', 'high', true, false, false, false, 'Mobile devices, field apps, communication equipment', 180);

-- Update the created_at timestamps to current time
UPDATE sop_procedures SET created_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP;
UPDATE sop_categories SET created_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP;

-- =====================================================
-- PERFORMANCE OPTIMIZATION
-- =====================================================

-- Analyze tables for query optimization
ANALYZE sop_categories;
ANALYZE sop_procedures;

-- Verify data integrity
SELECT 'Categories Created' as status, COUNT(*) as count FROM sop_categories
UNION ALL
SELECT 'Procedures Created' as status, COUNT(*) as count FROM sop_procedures
UNION ALL
SELECT 'Florida Specific SOPs' as status, COUNT(*) as count FROM sop_procedures WHERE florida_specific = true
UNION ALL
SELECT 'Hurricane Related SOPs' as status, COUNT(*) as count FROM sop_procedures WHERE hurricane_related = true
UNION ALL
SELECT 'OSHA Required SOPs' as status, COUNT(*) as count FROM sop_procedures WHERE osha_related = true
UNION ALL
SELECT 'Critical Priority SOPs' as status, COUNT(*) as count FROM sop_procedures WHERE priority_level = 'critical';