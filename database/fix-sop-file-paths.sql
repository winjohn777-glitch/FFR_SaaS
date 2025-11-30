-- =====================================================
-- FIX SOP FILE PATHS TO MATCH ACTUAL FILE LOCATIONS
-- Update database to point to correct SOP content files
-- =====================================================

-- First, let's see what actual files exist and build mappings

-- Update file paths for SOPs that exist in procedures directory
-- These need to be mapped from database entries to actual files

-- SOP-0001 LEAD INTAKE
UPDATE sop_procedures
SET content_file_path = 'sop-content/procedures/SOP-0001-LEAD-INTAKE.md'
WHERE sop_number = '0001';

-- SOP-0010 EMERGENCY RESPONSE
UPDATE sop_procedures
SET content_file_path = 'sop-content/procedures/SOP-0010-EMERGENCY-RESPONSE.md'
WHERE sop_number = '0010';

-- SOP-0020 REPLACEMENT ESTIMATE
UPDATE sop_procedures
SET content_file_path = 'sop-content/procedures/SOP-0020-REPLACEMENT-ESTIMATE.md'
WHERE sop_number = '0020';

-- SOP-0025 SAFETY PROTOCOLS
UPDATE sop_procedures
SET content_file_path = 'sop-content/procedures/SOP-0025-SAFETY-PROTOCOLS.md'
WHERE sop_number = '0025';

-- SOP-0030 CUSTOMER COMMUNICATION
UPDATE sop_procedures
SET content_file_path = 'sop-content/procedures/SOP-0030-CUSTOMER-COMMUNICATION.md'
WHERE sop_number = '0030';

-- For SOPs that don't have actual content files, set path to NULL
-- This will prevent the backend from trying to load non-existent files
UPDATE sop_procedures
SET content_file_path = NULL
WHERE content_file_path LIKE 'sop-content/sop-%'
AND sop_number NOT IN (
    SELECT SUBSTR(filename, 5, 4)
    FROM (
        SELECT 'SOP-0001-LEAD-INTAKE.md' as filename
        UNION SELECT 'SOP-0010-EMERGENCY-RESPONSE.md'
        UNION SELECT 'SOP-0020-REPLACEMENT-ESTIMATE.md'
        UNION SELECT 'SOP-0025-SAFETY-PROTOCOLS.md'
        UNION SELECT 'SOP-0030-CUSTOMER-COMMUNICATION.md'
    )
);

-- Verification queries
SELECT 'File Path Fixes Applied' as status;
SELECT COUNT(*) as sops_with_null_paths FROM sop_procedures WHERE content_file_path IS NULL;
SELECT COUNT(*) as sops_with_working_paths FROM sop_procedures WHERE content_file_path IS NOT NULL;
SELECT sop_number, content_file_path FROM sop_procedures WHERE content_file_path LIKE '%procedures%' LIMIT 10;