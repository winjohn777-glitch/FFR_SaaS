-- =====================================================
-- ADDITIONAL SOP PROCEDURES FROM MASTER INDEX
-- Expanding the SOP database with comprehensive procedures
-- =====================================================

-- Additional Enterprise Software Systems SOPs
INSERT INTO sop_procedures (sop_number, category_id, title, purpose, scope, procedure_steps, status, priority_level, compliance_required, florida_specific, hurricane_related, osha_related, safety_requirements, estimated_duration_minutes) VALUES

-- CRM Systems (2002-2009)
('2002', 3, 'CRM Data Entry Standards and Validation', 'Standardized data entry procedures for customer information', 'All customer-facing personnel and data entry', '["Data validation rules", "Required field completion", "Duplicate prevention", "Data quality checks", "Regular data audits"]', 'active', 'high', true, false, false, false, 'Data validation tools, CRM access, quality control checklists', 60),
('2003', 3, 'CRM Workflow Automation and Business Rules', 'Configuration of automated workflows in CRM system', 'Sales processes and customer communication', '["Workflow design", "Trigger configuration", "Automation testing", "Performance monitoring", "Rule maintenance"]', 'active', 'standard', false, false, false, false, 'CRM administrative access, workflow design tools', 180),
('2004', 3, 'CRM Integration with External Systems', 'Integration procedures for CRM with other business systems', 'Data synchronization and system interoperability', '["Integration mapping", "Data flow configuration", "Error handling setup", "Testing procedures", "Monitoring protocols"]', 'active', 'high', true, false, false, false, 'Integration tools, system access, testing environment', 300),

-- ERP Systems (2010-2019)
('2010', 3, 'ERP System Configuration and Setup', 'Enterprise Resource Planning system implementation', 'All business operations and resource management', '["System architecture design", "Module configuration", "User setup", "Data migration", "Testing and validation"]', 'active', 'critical', true, false, false, false, 'ERP system access, configuration tools, data migration utilities', 480),
('2011', 3, 'ERP Financial Module Management', 'Financial module configuration and management', 'Accounting, budgeting, and financial reporting', '["Chart of accounts setup", "Financial controls", "Approval workflows", "Reporting configuration", "Audit trail setup"]', 'active', 'critical', true, false, false, false, 'ERP financial module access, accounting knowledge', 360),
('2012', 3, 'ERP Inventory and Supply Chain Module', 'Inventory management and supply chain optimization', 'Materials management and procurement', '["Inventory categorization", "Reorder point setup", "Supplier integration", "Tracking procedures", "Performance metrics"]', 'active', 'high', true, false, false, false, 'ERP inventory module, barcode scanners, integration tools', 240),

-- Business Intelligence and Analytics (2400-2499)
('2400', 3, 'BI Platform Implementation and Configuration', 'Business Intelligence platform setup and management', 'Data analysis and reporting across all departments', '["Platform installation", "Data source configuration", "User access setup", "Dashboard creation", "Performance optimization"]', 'active', 'high', true, false, false, false, 'BI platform software, database access, visualization tools', 420),
('2401', 3, 'Data Warehouse Design and Management', 'Design and management of enterprise data warehouse', 'Centralized data storage and analytics', '["Data model design", "ETL process setup", "Data quality management", "Performance tuning", "Security implementation"]', 'active', 'high', true, false, false, false, 'Data warehouse tools, ETL software, database management', 600),

-- IT Infrastructure and Security (3000-3199)
('3000', 4, 'Network Architecture and Design Standards', 'Enterprise network design and implementation', 'All network infrastructure and connectivity', '["Network topology design", "Security architecture", "Performance requirements", "Scalability planning", "Documentation standards"]', 'active', 'critical', true, false, false, false, 'Network design tools, security protocols, documentation systems', 480),
('3100', 4, 'Information Security Policy Framework', 'Comprehensive information security policies', 'All IT systems and data protection', '["Security policy development", "Risk assessment", "Control implementation", "Compliance monitoring", "Incident response"]', 'active', 'critical', true, false, false, false, 'Security assessment tools, policy documentation, compliance monitoring', 360),
('3101', 4, 'User Access Management and Provisioning', 'User account management and access control', 'All system users and access permissions', '["Account provisioning", "Role-based access control", "Regular access reviews", "Deprovisioning procedures", "Audit logging"]', 'active', 'critical', true, false, false, false, 'Identity management system, access control tools', 180),

-- Field Operations Technology (4000-4099)
('4001', 5, 'Mobile Work Order Management', 'Mobile technology for work order processing', 'Field crews and job site management', '["Mobile app configuration", "Work order synchronization", "Status updates", "Photo documentation", "Time tracking"]', 'active', 'high', true, false, false, false, 'Mobile devices, work order system, communication tools', 120),
('4002', 5, 'GPS Tracking and Fleet Management', 'Vehicle tracking and fleet optimization', 'Company vehicles and equipment', '["GPS device installation", "Tracking system setup", "Route optimization", "Maintenance scheduling", "Performance reporting"]', 'active', 'standard', false, false, false, false, 'GPS devices, fleet management software, maintenance tools', 240),

-- Customer Service and Support (5100-5199)
('5100', 6, 'Help Desk System Configuration', 'Customer support ticket management system', 'All customer service and technical support', '["Ticket system setup", "Routing configuration", "SLA management", "Knowledge base integration", "Performance metrics"]', 'active', 'high', true, false, false, false, 'Help desk software, ticketing system, knowledge base tools', 300),

-- HR Information Systems (6000-6099)
('6000', 7, 'HRIS Implementation and Configuration', 'Human Resources Information System setup', 'Employee data management and HR processes', '["System configuration", "Employee data migration", "Workflow setup", "Reporting configuration", "Security implementation"]', 'active', 'high', true, false, false, false, 'HRIS software, data migration tools, workflow configuration', 480),

-- Learning Management Systems (6100-6199)
('6100', 7, 'LMS Platform Administration', 'Learning Management System administration', 'Employee training and certification tracking', '["Platform configuration", "Course creation", "User management", "Progress tracking", "Compliance reporting"]', 'active', 'high', true, false, false, false, 'LMS platform, content creation tools, tracking systems', 360),

-- Quality Management Systems (7100-7199)
('7100', 8, 'Quality Management System Configuration', 'Quality management system implementation', 'Quality control and assurance processes', '["System setup", "Process documentation", "Quality metrics", "Audit procedures", "Continuous improvement"]', 'active', 'critical', true, false, false, false, 'Quality management software, documentation tools, audit checklists', 420),

-- Reporting Systems (9000-9099)
('9000', 10, 'Enterprise Reporting Platform Management', 'Enterprise-wide reporting system management', 'All business reporting and analytics', '["Report server setup", "Data source configuration", "Report design standards", "Distribution setup", "Performance monitoring"]', 'active', 'high', true, false, false, false, 'Reporting platform, design tools, distribution systems', 360);

-- =====================================================
-- FLORIDA-SPECIFIC ROOFING SOPs
-- =====================================================

-- Additional Florida Building Code SOPs
INSERT INTO sop_procedures (sop_number, category_id, title, purpose, scope, procedure_steps, status, priority_level, compliance_required, florida_specific, hurricane_related, osha_related, safety_requirements, estimated_duration_minutes) VALUES
('3102', 2, 'Florida Energy Code Compliance for Roofing', 'Energy efficiency requirements for roofing systems', 'All roofing installations affecting building energy performance', '["Energy code requirements", "Insulation standards", "Reflectivity requirements", "Documentation procedures", "Inspection coordination"]', 'active', 'high', true, true, false, false, 'Energy code reference, reflectivity testing equipment, documentation forms', 180),
('3103', 2, 'Miami-Dade County Product Approval Verification', 'Verification of Miami-Dade approved products', 'All roofing projects in Miami-Dade County', '["Product approval lookup", "NOA verification", "Installation compliance", "Documentation requirements", "Inspection preparation"]', 'active', 'critical', true, true, true, false, 'Miami-Dade NOA database access, product documentation, compliance checklist', 90),

-- Hurricane Season Operations
('1502', 2, 'Pre-Hurricane Project Securing Protocol', 'Securing active projects before hurricane impact', 'All active roofing projects during hurricane warnings', '["Project assessment", "Material securing", "Equipment removal", "Site preparation", "Safety measures"]', 'active', 'critical', true, true, true, true, 'Securing materials, tie-down equipment, safety equipment, communication devices', 240),
('1503', 2, 'Post-Hurricane Damage Assessment', 'Systematic damage assessment after hurricane events', 'All company properties and client projects', '["Safety assessment", "Structural evaluation", "Documentation procedures", "Insurance coordination", "Repair prioritization"]', 'active', 'critical', true, true, true, true, 'Safety equipment, documentation tools, camera, measuring equipment', 300),

-- Specialized Florida Roofing Systems
('3300', 2, 'Tile Roof Installation - Florida Standards', 'Clay and concrete tile installation per Florida requirements', 'All tile roofing installations in Florida', '["Substrate preparation", "Underlayment installation", "Tile laying procedures", "Fastening requirements", "Quality inspection"]', 'active', 'high', true, true, false, false, 'Tile installation tools, fastening equipment, quality control checklist', 480),
('3301', 2, 'Metal Roof Installation - Hurricane Resistance', 'Metal roofing installation for hurricane resistance', 'Metal roofing systems in high-wind zones', '["Panel selection", "Fastening patterns", "Seaming procedures", "Expansion joint installation", "Wind uplift testing"]', 'active', 'high', true, true, true, false, 'Metal roofing tools, seaming equipment, fastening tools, testing equipment', 360),

-- Specialty Installation Procedures
('3400', 2, 'Solar Panel Integration with Roofing Systems', 'Integration of solar panels with various roofing materials', 'Solar installations on roofing systems', '["Structural assessment", "Mounting system installation", "Weatherproofing procedures", "Electrical coordination", "Final inspection"]', 'active', 'standard', false, true, false, false, 'Solar mounting equipment, weatherproofing materials, electrical safety equipment', 420),
('3401', 2, 'Cool Roof Installation and Certification', 'Installation of cool roofing systems per Florida standards', 'Cool roof installations for energy efficiency', '["Product selection", "Installation procedures", "Testing requirements", "Certification process", "Performance verification"]', 'active', 'standard', false, true, false, false, 'Cool roof materials, testing equipment, certification documentation', 300);

-- Update timestamps
UPDATE sop_procedures SET created_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE sop_number IN (
SELECT sop_number FROM sop_procedures
WHERE created_at = updated_at AND created_at > datetime('now', '-1 minute')
);

-- Verify the additional data
SELECT 'Total SOPs After Addition' as status, COUNT(*) as count FROM sop_procedures
UNION ALL
SELECT 'Enterprise Software SOPs' as status, COUNT(*) as count FROM sop_procedures WHERE category_id = 3
UNION ALL
SELECT 'IT Infrastructure SOPs' as status, COUNT(*) as count FROM sop_procedures WHERE category_id = 4
UNION ALL
SELECT 'Florida Specific SOPs Total' as status, COUNT(*) as count FROM sop_procedures WHERE florida_specific = true
UNION ALL
SELECT 'Hurricane Related SOPs Total' as status, COUNT(*) as count FROM sop_procedures WHERE hurricane_related = true
UNION ALL
SELECT 'Active SOPs' as status, COUNT(*) as count FROM sop_procedures WHERE status = 'active';