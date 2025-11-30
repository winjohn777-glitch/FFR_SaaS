-- =====================================================
-- FIX FOUNDATION SOP TITLES
-- Update database titles to match actual SOP content titles
-- =====================================================

-- Foundation SOPs with actual content files
UPDATE sop_procedures SET title = 'FFR SOP-0001: 14-Block Template Standards and Compliance Requirements' WHERE sop_number = '0001';
UPDATE sop_procedures SET title = 'FFR SOP-0002: Document Control Version Management System' WHERE sop_number = '0002';
UPDATE sop_procedures SET title = 'FFR SOP-0013: Access Control Security Management Sensitive Documents' WHERE sop_number = '0013';
UPDATE sop_procedures SET title = 'FFR SOP-0014: Backup Disaster Recovery Document Systems' WHERE sop_number = '0014';
UPDATE sop_procedures SET title = 'FFR SOP-0015: Document Retention Schedules Archive Management' WHERE sop_number = '0015';
UPDATE sop_procedures SET title = 'FFR SOP-0016: Electronic Signature Authentication Procedures' WHERE sop_number = '0016';
UPDATE sop_procedures SET title = 'FFR SOP-0017: Cross-Reference Linking Relationship Management' WHERE sop_number = '0017';
UPDATE sop_procedures SET title = 'FFR SOP-0018: Document Search Analytics System Operation' WHERE sop_number = '0018';
UPDATE sop_procedures SET title = 'FFR SOP-0019: Legal Document Protection Confidentiality Maintenance' WHERE sop_number = '0019';

-- SOPs in procedures directory
UPDATE sop_procedures SET title = 'FFR SOP-0001: Lead Intake' WHERE sop_number = '0001' AND content_file_path LIKE '%SOP-0001-LEAD-INTAKE%';
UPDATE sop_procedures SET title = 'FFR SOP-0010: Emergency Response' WHERE sop_number = '0010';
UPDATE sop_procedures SET title = 'FFR SOP-0020: Replacement Estimate' WHERE sop_number = '0020';
UPDATE sop_procedures SET title = 'FFR SOP-0025: Safety Protocols' WHERE sop_number = '0025';
UPDATE sop_procedures SET title = 'FFR SOP-0030: Customer Communication' WHERE sop_number = '0030';

-- Other Foundation SOPs (need to be created or updated based on the pattern)
UPDATE sop_procedures SET title = 'FFR SOP-0003: Foundation Governance Framework' WHERE sop_number = '0003';
UPDATE sop_procedures SET title = 'FFR SOP-0004: Policy Development Standards' WHERE sop_number = '0004';
UPDATE sop_procedures SET title = 'FFR SOP-0005: Compliance Monitoring Systems' WHERE sop_number = '0005';
UPDATE sop_procedures SET title = 'FFR SOP-0006: Leadership Training Programs' WHERE sop_number = '0006';
UPDATE sop_procedures SET title = 'FFR SOP-0007: Governance Effectiveness Review' WHERE sop_number = '0007';
UPDATE sop_procedures SET title = 'FFR SOP-0008: Regulatory Change Management' WHERE sop_number = '0008';
UPDATE sop_procedures SET title = 'FFR SOP-0009: Decision Documentation Process' WHERE sop_number = '0009';
UPDATE sop_procedures SET title = 'FFR SOP-0011: Records Management System' WHERE sop_number = '0011';
UPDATE sop_procedures SET title = 'FFR SOP-0012: Document Classification Standards' WHERE sop_number = '0012';

-- Verification query
SELECT 'Foundation SOP Titles Updated Successfully' as status;
SELECT sop_number, title FROM sop_procedures WHERE sop_number LIKE '00%' AND sop_number <> '0000' ORDER BY sop_number LIMIT 15;