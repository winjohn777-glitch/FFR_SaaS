-- =====================================================
-- CORRECT SOP MAPPING AND TITLES
-- Fix the database to match actual file structure and titles
-- =====================================================

-- Update SOP-0001 to point to correct Foundation file
UPDATE sop_procedures SET
    title = 'FFR SOP-0001: 14-Block Template Standards and Compliance Requirements',
    content_file_path = 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0001-14-Block-Template-Standards.md'
WHERE sop_number = '0001';

-- Update SOP-0002 to point to correct Foundation file
UPDATE sop_procedures SET
    title = 'FFR SOP-0002: Document Control Version Management System',
    content_file_path = 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0002-Document-Control-Version-Management-System.md'
WHERE sop_number = '0002';

-- Update root level SOPs
UPDATE sop_procedures SET
    title = 'FFR SOP-0010: Document Upload and OCR Processing Procedures',
    content_file_path = 'sop-content/SOPs/SOP-0010-DOCUMENT-UPLOAD-OCR.md'
WHERE sop_number = '0010';

UPDATE sop_procedures SET
    title = 'FFR SOP-0011: Auto-Categorization Metadata',
    content_file_path = 'sop-content/SOPs/SOP-0011-AUTO-CATEGORIZATION-METADATA.md'
WHERE sop_number = '0011';

UPDATE sop_procedures SET
    title = 'FFR SOP-0012: File Storage Organization',
    content_file_path = 'sop-content/SOPs/SOP-0012-FILE-STORAGE-ORGANIZATION.md'
WHERE sop_number = '0012';

-- Update Foundation SOPs with correct file paths
UPDATE sop_procedures SET
    title = 'FFR SOP-0013: Access Control Security Management Sensitive Documents',
    content_file_path = 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0013-Access-Control-Security-Management-Sensitive-Documents.md'
WHERE sop_number = '0013';

UPDATE sop_procedures SET
    title = 'FFR SOP-0014: Backup Disaster Recovery Document Systems',
    content_file_path = 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0014-Backup-Disaster-Recovery-Document-Systems.md'
WHERE sop_number = '0014';

UPDATE sop_procedures SET
    title = 'FFR SOP-0015: Document Retention Schedules Archive Management',
    content_file_path = 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0015-Document-Retention-Schedules-Archive-Management.md'
WHERE sop_number = '0015';

UPDATE sop_procedures SET
    title = 'FFR SOP-0016: Electronic Signature Authentication Procedures',
    content_file_path = 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0016-Electronic-Signature-Authentication-Procedures.md'
WHERE sop_number = '0016';

UPDATE sop_procedures SET
    title = 'FFR SOP-0017: Cross-Reference Linking Relationship Management',
    content_file_path = 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0017-Cross-Reference-Linking-Relationship-Management.md'
WHERE sop_number = '0017';

UPDATE sop_procedures SET
    title = 'FFR SOP-0018: Document Search Analytics System Operation',
    content_file_path = 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0018-Document-Search-Analytics-System-Operation.md'
WHERE sop_number = '0018';

UPDATE sop_procedures SET
    title = 'FFR SOP-0019: Legal Document Protection Confidentiality Maintenance',
    content_file_path = 'sop-content/SOPs/0000-Foundation-and-Governance/SOP-0019-Legal-Document-Protection-Confidentiality-Maintenance.md'
WHERE sop_number = '0019';

-- Operational SOPs remain pointing to procedures directory
-- These already have correct paths from previous fixes

-- Verification
SELECT 'Correct SOP Mapping Applied Successfully' as status;
SELECT sop_number, title, content_file_path FROM sop_procedures
WHERE sop_number IN ('0001', '0002', '0010', '0011', '0012', '0013', '0014', '0015')
ORDER BY sop_number;