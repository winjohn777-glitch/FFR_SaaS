-- =====================================================
-- COMPREHENSIVE FIX FOR SOP FILE PATHS
-- Update database to point to actual existing files
-- =====================================================

-- Clear all broken file paths first
UPDATE sop_procedures
SET content_file_path = NULL
WHERE content_file_path LIKE 'sop-content/sop-%';

-- Update paths for SOPs that have actual content files in procedures directory
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-0001-LEAD-INTAKE.md' WHERE sop_number = '0001';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-0010-EMERGENCY-RESPONSE.md' WHERE sop_number = '0010';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-0020-REPLACEMENT-ESTIMATE.md' WHERE sop_number = '0020';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-0025-SAFETY-PROTOCOLS.md' WHERE sop_number = '0025';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-0030-CUSTOMER-COMMUNICATION.md' WHERE sop_number = '0030';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-0150-INSURANCE-CLAIM-DOCUMENTATION.md' WHERE sop_number = '0150';

-- 2000 Series Operations SOPs
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-2085-SPECIALTY-COATING-APPLICATION.md' WHERE sop_number = 'SOP-2085';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-2086-ROOF-GARDEN-GREEN-ROOF-INSTALLATION.md' WHERE sop_number = 'SOP-2086';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-2087-SKYLIGHT-INSTALLATION-INTEGRATION.md' WHERE sop_number = 'SOP-2087';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-2088-SOLAR-PANEL-MOUNTING-SYSTEMS.md' WHERE sop_number = 'SOP-2088';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-2089-ROOF-ACCESS-SAFETY-SYSTEMS.md' WHERE sop_number = 'SOP-2089';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-2092-MULTI-FAMILY-HOUSING-ROOFING.md' WHERE sop_number = 'SOP-2092';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-2093-COMMERCIAL-FLAT-ROOF-INSTALLATION.md' WHERE sop_number = 'SOP-2093';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-2094-INDUSTRIAL-ROOFING-SYSTEMS.md' WHERE sop_number = 'SOP-2094';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-2096-ROOF-MAINTENANCE-REPAIR-PROCEDURES.md' WHERE sop_number = 'SOP-2096';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-2097-EMERGENCY-ROOF-REPAIR-PROCEDURES.md' WHERE sop_number = 'SOP-2097';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-2098-ROOF-INSPECTION-ASSESSMENT.md' WHERE sop_number = 'SOP-2098';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-2099-ROOF-WARRANTY-SERVICE-PROGRAMS.md' WHERE sop_number = 'SOP-2099';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-2100-MATERIAL-HANDLING-STORAGE-ON-SITE.md' WHERE sop_number = 'SOP-2100';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-2110-EQUIPMENT-SETUP-OPERATION.md' WHERE sop_number = 'SOP-2110';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-2120-SITE-CLEANUP-RESTORATION.md' WHERE sop_number = 'SOP-2120';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-2130-WEATHER-DELAY-CONTINGENCY-PROCEDURES.md' WHERE sop_number = 'SOP-2130';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-2140-SUBCONTRACTOR-COORDINATION-MANAGEMENT.md' WHERE sop_number = 'SOP-2140';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-2150-PROJECT-COMPLETION-CUSTOMER-HANDOVER.md' WHERE sop_number = 'SOP-2150';

-- 3000 Series Quality Control SOPs
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-3072-QUALITY-CONTROL-DOCUMENTATION-RECORDS.md' WHERE sop_number = 'SOP-3072';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-3073-SUPPLIER-QUALITY-ASSESSMENT-MANAGEMENT.md' WHERE sop_number = 'SOP-3073';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-3074-MATERIAL-TESTING-VERIFICATION-PROCEDURES.md' WHERE sop_number = 'SOP-3074';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-3075-INSTALLATION-QUALITY-VERIFICATION-STANDARDS.md' WHERE sop_number = 'SOP-3075';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-3076-QUALITY-AUDIT-ASSESSMENT-PROCEDURES.md' WHERE sop_number = 'SOP-3076';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-3077-NON-CONFORMANCE-MANAGEMENT-CORRECTIVE-ACTION.md' WHERE sop_number = 'SOP-3077';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-3078-QUALITY-TRAINING-COMPETENCY-DEVELOPMENT.md' WHERE sop_number = 'SOP-3078';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-3079-QUALITY-PERFORMANCE-MEASUREMENT-ANALYSIS.md' WHERE sop_number = 'SOP-3079';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-3080-CUSTOMER-QUALITY-FEEDBACK-IMPROVEMENT.md' WHERE sop_number = 'SOP-3080';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-3081-QUALITY-COST-MANAGEMENT-ANALYSIS.md' WHERE sop_number = 'SOP-3081';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-3082-QUALITY-SYSTEM-CONTINUOUS-IMPROVEMENT.md' WHERE sop_number = 'SOP-3082';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-3083-QUALITY-CERTIFICATION-STANDARDS-COMPLIANCE.md' WHERE sop_number = 'SOP-3083';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-3084-QUALITY-TECHNOLOGY-INNOVATION-INTEGRATION.md' WHERE sop_number = 'SOP-3084';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-3085-QUALITY-RISK-MANAGEMENT-MITIGATION.md' WHERE sop_number = 'SOP-3085';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-3086-QUALITY-VENDOR-PARTNER-MANAGEMENT.md' WHERE sop_number = 'SOP-3086';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-3090-QUALITY-CONTROL-AUTOMATION-TECHNOLOGY.md' WHERE sop_number = 'SOP-3090';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-3100-ADVANCED-QUALITY-ANALYTICS-REPORTING.md' WHERE sop_number = 'SOP-3100';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-3110-QUALITY-CONTROL-EQUIPMENT-CALIBRATION.md' WHERE sop_number = 'SOP-3110';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-3120-QUALITY-CONTROL-FINAL-VERIFICATION.md' WHERE sop_number = 'SOP-3120';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-3130-QUALITY-CONTROL-DATA-MANAGEMENT.md' WHERE sop_number = 'SOP-3130';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-3140-QUALITY-CONTROL-INTEGRATION-SYSTEMS.md' WHERE sop_number = 'SOP-3140';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-3150-QUALITY-CONTROL-STRATEGIC-PLANNING.md' WHERE sop_number = 'SOP-3150';

-- 4000 Series Customer Management SOPs
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-4071-CUSTOMER-RELATIONSHIP-MANAGEMENT-SYSTEM-OPERATION.md' WHERE sop_number = 'SOP-4071';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-4072-CUSTOMER-DATA-MANAGEMENT-PRIVACY-PROTECTION.md' WHERE sop_number = 'SOP-4072';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-4073-CUSTOMER-COMMUNICATION-AUTOMATION.md' WHERE sop_number = 'SOP-4073';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-4074-CUSTOMER-SATISFACTION-MONITORING-ANALYSIS.md' WHERE sop_number = 'SOP-4074';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-4075-CUSTOMER-RETENTION-LOYALTY-PROGRAMS.md' WHERE sop_number = 'SOP-4075';
UPDATE sop_procedures SET content_file_path = 'sop-content/procedures/SOP-4076-CUSTOMER-COMPLAINT-ESCALATION-MANAGEMENT.md' WHERE sop_number = 'SOP-4076';

-- Verification queries
SELECT 'SOP File Path Fixes Applied Successfully' as status;
SELECT COUNT(*) as total_sops FROM sop_procedures;
SELECT COUNT(*) as sops_with_content FROM sop_procedures WHERE content_file_path IS NOT NULL;
SELECT COUNT(*) as sops_without_content FROM sop_procedures WHERE content_file_path IS NULL;

-- Show some examples of fixed paths
SELECT sop_number, title, content_file_path
FROM sop_procedures
WHERE content_file_path IS NOT NULL
AND content_file_path LIKE '%procedures%'
ORDER BY sop_number
LIMIT 10;