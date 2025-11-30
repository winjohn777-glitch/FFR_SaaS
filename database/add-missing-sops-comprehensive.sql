-- =====================================================
-- ADD ALL MISSING SOPs TO DATABASE
-- Add Foundation SOPs and other missing content files
-- =====================================================

-- Foundation and Governance SOPs (0000-Foundation-and-Governance directory)
INSERT OR REPLACE INTO sop_procedures (sop_number, category_id, title, version, status, priority_level, compliance_required, florida_specific, hurricane_related, osha_related, purpose, scope, procedure_steps, estimated_duration_minutes, created_by, effective_date, next_review_date, content_file_path) VALUES
('SOP-0001', 1, '14-Block Template Standards', '1.0', 'active', 'critical', 1, 1, 0, 1, 'Establish 14-block template standards for all SOPs', 'All SOP development and documentation', '["Template structure verification", "Content standards compliance", "Format validation"]', 120, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0001-14-Block-Template-Standards.md'),

('SOP-0002', 1, 'Document Control Version Management System', '1.0', 'active', 'critical', 1, 1, 0, 1, 'Establish document control and version management system', 'All document control processes', '["Version control setup", "Change management", "Document lifecycle"]', 180, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0002-Document-Control-Version-Management-System.md'),

('SOP-0013', 1, 'Access Control Security Management Sensitive Documents', '1.0', 'active', 'high', 1, 1, 0, 1, 'Establish access control and security management for sensitive documents', 'All sensitive document management', '["Access control setup", "Security protocols", "Document protection"]', 150, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0013-Access-Control-Security-Management-Sensitive-Documents.md'),

('SOP-0014', 1, 'Backup Disaster Recovery Document Systems', '1.0', 'active', 'critical', 1, 1, 1, 1, 'Establish backup and disaster recovery for document systems', 'All backup and recovery procedures', '["Backup procedures", "Disaster recovery", "System restoration"]', 240, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0014-Backup-Disaster-Recovery-Document-Systems.md'),

('SOP-0015', 1, 'Document Retention Schedules Archive Management', '1.0', 'active', 'high', 1, 1, 0, 1, 'Establish document retention schedules and archive management', 'All document retention and archiving', '["Retention schedule setup", "Archive management", "Compliance verification"]', 120, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0015-Document-Retention-Schedules-Archive-Management.md'),

('SOP-0016', 1, 'Electronic Signature Authentication Procedures', '1.0', 'active', 'high', 1, 1, 0, 1, 'Establish electronic signature and authentication procedures', 'All electronic signature processes', '["E-signature setup", "Authentication protocols", "Legal compliance"]', 90, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0016-Electronic-Signature-Authentication-Procedures.md'),

('SOP-0017', 1, 'Cross-Reference Linking Relationship Management', '1.0', 'active', 'medium', 1, 1, 0, 0, 'Establish cross-reference linking and relationship management', 'All document cross-referencing', '["Cross-reference setup", "Link management", "Relationship tracking"]', 60, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0017-Cross-Reference-Linking-Relationship-Management.md'),

('SOP-0018', 1, 'Document Search Analytics System Operation', '1.0', 'active', 'medium', 1, 1, 0, 0, 'Establish document search and analytics system operation', 'All document search and analytics', '["Search system setup", "Analytics configuration", "Performance monitoring"]', 90, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0018-Document-Search-Analytics-System-Operation.md'),

('SOP-0019', 1, 'Legal Document Protection Confidentiality Maintenance', '1.0', 'active', 'high', 1, 1, 0, 1, 'Establish legal document protection and confidentiality maintenance', 'All legal document protection', '["Legal protection setup", "Confidentiality protocols", "Compliance monitoring"]', 120, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0019-Legal-Document-Protection-Confidentiality-Maintenance.md'),

('SOP-0020', 1, 'Document Version Control Change Management', '1.0', 'active', 'critical', 1, 1, 0, 1, 'Establish document version control and change management', 'All version control processes', '["Version control implementation", "Change management", "Approval workflows"]', 150, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0020-Document-Version-Control-Change-Management.md'),

('SOP-0021', 1, 'Document Template Creation Standardization', '1.0', 'active', 'medium', 1, 1, 0, 0, 'Establish document template creation and standardization', 'All template creation processes', '["Template design", "Standardization protocols", "Template management"]', 90, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0021-Document-Template-Creation-Standardization.md'),

('SOP-0022', 1, 'Document Distribution Communication Protocols', '1.0', 'active', 'medium', 1, 1, 0, 0, 'Establish document distribution and communication protocols', 'All document distribution', '["Distribution setup", "Communication protocols", "Tracking systems"]', 60, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0022-Document-Distribution-Communication-Protocols.md'),

('SOP-0023', 1, 'Document Audit Compliance Verification', '1.0', 'active', 'high', 1, 1, 0, 1, 'Establish document audit and compliance verification', 'All document auditing processes', '["Audit procedures", "Compliance verification", "Reporting protocols"]', 120, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0023-Document-Audit-Compliance-Verification.md'),

('SOP-0024', 1, 'Document Performance Analytics Optimization', '1.0', 'active', 'medium', 1, 1, 0, 0, 'Establish document performance analytics and optimization', 'All performance analytics', '["Analytics setup", "Performance monitoring", "Optimization procedures"]', 90, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0024-Document-Performance-Analytics-Optimization.md'),

('SOP-0025', 1, 'Document System Integration API Management', '1.0', 'active', 'high', 1, 1, 0, 0, 'Establish document system integration and API management', 'All system integration processes', '["API setup", "Integration protocols", "System management"]', 180, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0025-Document-System-Integration-API-Management.md'),

('SOP-0026', 1, 'CRM Database Setup Configuration', '1.0', 'active', 'critical', 1, 1, 0, 0, 'Establish CRM database setup and configuration', 'All CRM database management', '["CRM setup", "Database configuration", "Integration testing"]', 240, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0026-CRM-Database-Setup-Configuration.md'),

('SOP-0071', 1, 'Mobile Platform Optimization Field Crew Access', '1.0', 'active', 'high', 1, 1, 0, 0, 'Establish mobile platform optimization for field crew access', 'All mobile platform optimization', '["Mobile optimization", "Field access setup", "Performance tuning"]', 120, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0071-Mobile-Platform-Optimization-Field-Crew-Access.md'),

('SOP-0072', 1, 'Cloud Infrastructure Management Scalability', '1.0', 'active', 'critical', 1, 1, 0, 0, 'Establish cloud infrastructure management and scalability', 'All cloud infrastructure management', '["Cloud setup", "Infrastructure management", "Scalability planning"]', 180, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0072-Cloud-Infrastructure-Management-Scalability.md'),

('SOP-0073', 1, 'System Security Cybersecurity Management', '1.0', 'active', 'critical', 1, 1, 0, 1, 'Establish system security and cybersecurity management', 'All cybersecurity management', '["Security setup", "Cybersecurity protocols", "Threat management"]', 150, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0073-System-Security-Cybersecurity-Management.md'),

('SOP-0074', 1, 'Data Privacy GDPR CCPA Compliance', '1.0', 'active', 'critical', 1, 1, 0, 1, 'Establish data privacy GDPR and CCPA compliance', 'All data privacy compliance', '["Privacy compliance setup", "GDPR procedures", "CCPA protocols"]', 180, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0074-Data-Privacy-GDPR-CCPA-Compliance.md'),

('SOP-0080', 1, 'Disaster Recovery Business Continuity Systems', '1.0', 'active', 'critical', 1, 1, 1, 1, 'Establish disaster recovery and business continuity systems', 'All disaster recovery processes', '["Disaster recovery setup", "Business continuity planning", "Recovery testing"]', 240, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0080-Disaster-Recovery-Business-Continuity-Systems.md');

-- Additional SOPs from main SOPs directory
INSERT OR REPLACE INTO sop_procedures (sop_number, category_id, title, version, status, priority_level, compliance_required, florida_specific, hurricane_related, osha_related, purpose, scope, procedure_steps, estimated_duration_minutes, created_by, effective_date, next_review_date, content_file_path) VALUES
('SOP-0010', 1, 'Document Upload OCR', '1.0', 'active', 'medium', 1, 1, 0, 0, 'Establish document upload and OCR processing', 'All document upload processes', '["Upload procedures", "OCR processing", "Quality validation"]', 60, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/SOP-0010-DOCUMENT-UPLOAD-OCR.md'),

('SOP-0011', 1, 'Auto-Categorization Metadata', '1.0', 'active', 'medium', 1, 1, 0, 0, 'Establish auto-categorization and metadata management', 'All document categorization', '["Auto-categorization setup", "Metadata management", "Accuracy monitoring"]', 90, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/SOP-0011-AUTO-CATEGORIZATION-METADATA.md'),

('SOP-0012', 1, 'File Storage Organization', '1.0', 'active', 'medium', 1, 1, 0, 0, 'Establish file storage and organization systems', 'All file storage and organization', '["Storage setup", "Organization protocols", "Access management"]', 90, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/SOP-0012-FILE-STORAGE-ORGANIZATION.md'),

-- Safety SOPs
('SOP-1002', 2, 'Guardrail Systems', '1.0', 'active', 'critical', 1, 1, 0, 1, 'Establish guardrail system installation and maintenance', 'All guardrail safety systems', '["Guardrail installation", "Safety verification", "Maintenance procedures"]', 120, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/SOP-1002-GUARDRAIL-SYSTEMS.md'),

('SOP-1010', 2, 'Ladder Safety Standards', '1.0', 'active', 'critical', 1, 1, 0, 1, 'Establish ladder safety standards and procedures', 'All ladder safety protocols', '["Ladder selection", "Safety protocols", "Inspection procedures"]', 90, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/SOP-1010-LADDER-SAFETY-STANDARDS.md'),

('SOP-1020', 2, 'Electrical Hazard Control', '1.0', 'active', 'critical', 1, 1, 0, 1, 'Establish electrical hazard control procedures', 'All electrical safety protocols', '["Hazard identification", "Control procedures", "Safety verification"]', 120, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/SOP-1020-ELECTRICAL-HAZARD-CONTROL.md'),

-- Operations SOPs
('SOP-2001', 3, 'Permit Application Coordination', '1.0', 'active', 'high', 1, 1, 0, 0, 'Establish permit application and coordination procedures', 'All permit application processes', '["Permit applications", "Coordination procedures", "Approval tracking"]', 150, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/SOP-2001-PERMIT-APPLICATION-COORDINATION.md'),

('SOP-2010', 3, 'Material Procurement Vendor', '1.0', 'active', 'high', 1, 1, 0, 0, 'Establish material procurement and vendor management', 'All material procurement processes', '["Vendor selection", "Procurement procedures", "Quality verification"]', 120, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/SOP-2010-MATERIAL-PROCUREMENT-VENDOR.md'),

('SOP-2020', 3, 'Roof Assessment Documentation', '1.0', 'active', 'high', 1, 1, 0, 0, 'Establish roof assessment and documentation procedures', 'All roof assessment processes', '["Assessment procedures", "Documentation protocols", "Reporting systems"]', 180, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/SOP-2020-ROOF-ASSESSMENT-DOCUMENTATION.md'),

-- Quality Control SOPs
('SOP-3001', 4, 'Inspection Schedule Management', '1.0', 'active', 'high', 1, 1, 0, 1, 'Establish inspection schedule and management procedures', 'All inspection scheduling', '["Schedule management", "Inspection protocols", "Quality tracking"]', 90, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/SOP-3001-INSPECTION-SCHEDULE-MANAGEMENT.md'),

('SOP-3010', 4, 'Material Inspection Acceptance', '1.0', 'active', 'high', 1, 1, 0, 1, 'Establish material inspection and acceptance procedures', 'All material inspection processes', '["Inspection procedures", "Acceptance criteria", "Quality verification"]', 120, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/SOP-3010-MATERIAL-INSPECTION-ACCEPTANCE.md'),

-- Customer Service SOPs
('SOP-4001', 5, 'Customer Contact Lead Management', '1.0', 'active', 'high', 1, 1, 0, 0, 'Establish customer contact and lead management procedures', 'All customer contact processes', '["Contact management", "Lead tracking", "Follow-up procedures"]', 90, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/SOP-4001-CUSTOMER-CONTACT-LEAD-MANAGEMENT.md'),

('SOP-4010', 5, 'Sales Process Acquisition', '1.0', 'active', 'high', 1, 1, 0, 0, 'Establish sales process and acquisition procedures', 'All sales processes', '["Sales procedures", "Acquisition protocols", "Performance tracking"]', 120, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/SOP-4010-SALES-PROCESS-ACQUISITION.md'),

-- HR and Finance SOPs
('SOP-5000', 6, 'Employee Recruitment Hiring', '1.0', 'active', 'high', 1, 1, 0, 1, 'Establish employee recruitment and hiring procedures', 'All recruitment and hiring processes', '["Recruitment procedures", "Hiring protocols", "Onboarding processes"]', 180, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/SOP-5000-EMPLOYEE-RECRUITMENT-HIRING.md'),

('SOP-5010', 7, 'Accounting System Setup', '1.0', 'active', 'critical', 1, 1, 0, 0, 'Establish accounting system setup and configuration', 'All accounting system management', '["System setup", "Configuration procedures", "Integration testing"]', 240, 'System Administrator', '2025-10-19', '2026-10-19', 'sop-content/SOPs/SOP-5010-ACCOUNTING-SYSTEM-SETUP.md');

-- Verification queries
SELECT 'All Missing SOPs Added Successfully' as status;
SELECT COUNT(*) as total_sops_with_content FROM sop_procedures WHERE content_file_path IS NOT NULL;
SELECT category_name, COUNT(*) as sop_count
FROM sop_procedures sp
JOIN sop_categories sc ON sp.category_id = sc.id
WHERE sp.content_file_path IS NOT NULL
GROUP BY category_name
ORDER BY category_name;