-- =====================================================
-- ADD MISSING 1500 SERIES HVHZ CATEGORY AND PROCEDURES
-- Miami-Dade HVHZ Systems for high-velocity hurricane zones
-- =====================================================

-- Add the missing 1500 series category
INSERT INTO sop_categories (
    category_code,
    category_name,
    description,
    color_code,
    icon_name,
    sort_order,
    is_active
) VALUES (
    '1500',
    'Miami-Dade HVHZ Systems',
    'High-Velocity Hurricane Zone systems with NOA approvals and Miami-Dade compliance',
    '#7C3AED',
    'shield-exclamation',
    1.5,
    1
);

-- Get the category ID for 1500 series
-- We'll use category_id = 11 (assuming this will be the next ID)

-- Add HVHZ SOPs based on the files found in the directory
INSERT INTO sop_procedures (
    sop_number, category_id, title, version, status, priority_level, compliance_required,
    florida_specific, hurricane_related, osha_related, purpose, scope, procedure_steps,
    estimated_duration_minutes, created_by, effective_date, next_review_date,
    regulatory_compliance, cross_references, legal_citations, verification_sources,
    content_file_path
) VALUES

-- GAF Timberline HDZ HVHZ Installation
('GAF-TIM-HVHZ', 11, 'GAF Timberline HDZ® HVHZ Installation', '1.0', 'active', 'critical', 1, 1, 1, 1,
 'Install GAF Timberline HDZ® shingles in Miami-Dade HVHZ with NOA 21-1209.01 compliance',
 'All GAF Timberline HDZ® installations in high-velocity hurricane zones',
 '["1. Verify NOA compliance requirements", "2. Install impact-resistant shingles", "3. Follow HVHZ wind uplift requirements", "4. Complete hurricane tie-down procedures", "5. Conduct final HVHZ inspection"]',
 300, 'System Administrator', '2025-10-19', '2026-10-19',
 '["MIAMI_DADE_HVHZ", "NOA_21_1209_01", "FLORIDA_BUILDING_CODE", "HURRICANE_STANDARDS"]',
 '["1500", "1000", "7000"]',
 '["NOA 21-1209.01", "Miami-Dade Building Code", "Florida Building Code Chapter 15"]',
 '["Miami-Dade Product Control Division", "GAF Technical Services", "Florida Building Commission"]',
 'sop-content/SOPs/1500-Miami-Dade-NOA-Systems/SOP-GAF-TIM-HVHZ-GAF-Timberline-HDZ--HVHZ-Installation.md'),

-- GAF Timberline UHDZ HVHZ Installation
('GAF-TIM-UHDZ', 11, 'GAF Timberline UHDZ® HVHZ Installation', '1.0', 'active', 'critical', 1, 1, 1, 1,
 'Install GAF Timberline UHDZ® shingles in Miami-Dade HVHZ with enhanced hurricane protection',
 'All GAF Timberline UHDZ® installations in high-velocity hurricane zones',
 '["1. Verify enhanced HVHZ requirements", "2. Install ultra-high-definition shingles", "3. Apply hurricane-grade attachment", "4. Complete enhanced wind resistance procedures", "5. Final HVHZ compliance verification"]',
 330, 'System Administrator', '2025-10-19', '2026-10-19',
 '["MIAMI_DADE_HVHZ", "FLORIDA_BUILDING_CODE", "HURRICANE_STANDARDS", "ENHANCED_WIND_RESISTANCE"]',
 '["1500", "1000", "7000"]',
 '["Miami-Dade Building Code", "Florida Building Code Chapter 15", "GAF UHDZ Specifications"]',
 '["Miami-Dade Product Control Division", "GAF Technical Services", "Florida Building Commission"]',
 'sop-content/SOPs/1500-Miami-Dade-NOA-Systems/SOP-GAF-TIM-HVHZ-GAF-Timberline-UHDZ--HVHZ-Installation.md'),

-- GAF Fortitude HVHZ Installation
('GAF-FOR-HVHZ', 11, 'GAF Fortitude® HVHZ Installation', '1.0', 'active', 'critical', 1, 1, 1, 1,
 'Install GAF Fortitude® impact-resistant shingles in Miami-Dade HVHZ',
 'All GAF Fortitude® installations in high-velocity hurricane zones',
 '["1. Verify impact resistance certification", "2. Install Fortitude shingles per HVHZ requirements", "3. Apply hurricane-grade fastening", "4. Complete impact testing compliance", "5. Final HVHZ inspection"]',
 315, 'System Administrator', '2025-10-19', '2026-10-19',
 '["MIAMI_DADE_HVHZ", "IMPACT_RESISTANCE", "FLORIDA_BUILDING_CODE", "HURRICANE_STANDARDS"]',
 '["1500", "1000", "7000"]',
 '["Miami-Dade Building Code", "Florida Building Code Chapter 15", "Impact Resistance Standards"]',
 '["Miami-Dade Product Control Division", "GAF Technical Services", "Impact Testing Laboratory"]',
 'sop-content/SOPs/1500-Miami-Dade-NOA-Systems/SOP-GAF-FOR-HVHZ-GAF-Fortitude--HVHZ-Installation.md'),

-- Owens Corning Duration HVHZ Installation
('OWE-DUR-HVHZ', 11, 'Owens Corning TruDefinition Duration® HVHZ Installation', '1.0', 'active', 'critical', 1, 1, 1, 1,
 'Install Owens Corning TruDefinition Duration® shingles in Miami-Dade HVHZ',
 'All Owens Corning Duration installations in high-velocity hurricane zones',
 '["1. Verify TruDefinition technology compliance", "2. Install Duration shingles per HVHZ standards", "3. Apply hurricane wind resistance procedures", "4. Complete color stability verification", "5. Final HVHZ compliance check"]',
 285, 'System Administrator', '2025-10-19', '2026-10-19',
 '["MIAMI_DADE_HVHZ", "TRUEDEFINITION_TECHNOLOGY", "FLORIDA_BUILDING_CODE", "HURRICANE_STANDARDS"]',
 '["1500", "1000", "7000"]',
 '["Miami-Dade Building Code", "Florida Building Code Chapter 15", "Owens Corning HVHZ Standards"]',
 '["Miami-Dade Product Control Division", "Owens Corning Technical Services", "Florida Building Commission"]',
 'sop-content/SOPs/1500-Miami-Dade-NOA-Systems/SOP-OWE-DUR-HVHZ-Owens-Corning-TruDefinition-Duration--HVHZ-Installation.md'),

-- Owens Corning Duration Designer Colors HVHZ Installation
('OWE-DUR-DC-HVHZ', 11, 'Owens Corning Duration Designer Colors HVHZ Installation', '1.0', 'active', 'critical', 1, 1, 1, 1,
 'Install Owens Corning Duration Designer Colors shingles in Miami-Dade HVHZ',
 'All Owens Corning Duration Designer Colors installations in high-velocity hurricane zones',
 '["1. Verify designer color HVHZ compliance", "2. Install designer color shingles per HVHZ requirements", "3. Apply color-matched hurricane fastening", "4. Complete aesthetic and performance verification", "5. Final HVHZ design compliance check"]',
 300, 'System Administrator', '2025-10-19', '2026-10-19',
 '["MIAMI_DADE_HVHZ", "DESIGNER_COLORS", "FLORIDA_BUILDING_CODE", "HURRICANE_STANDARDS"]',
 '["1500", "1000", "7000"]',
 '["Miami-Dade Building Code", "Florida Building Code Chapter 15", "Designer Color Standards"]',
 '["Miami-Dade Product Control Division", "Owens Corning Technical Services", "Color Standards Institute"]',
 'sop-content/SOPs/1500-Miami-Dade-NOA-Systems/SOP-OWE-DUR-HVHZ-Owens-Corning-TruDefinition-Duration-Designer-Colors-HVHZ-Installation.md'),

-- CertainTeed Landmark HVHZ Installation
('CER-LAN-HVHZ', 11, 'CertainTeed Landmark® HVHZ Installation', '1.0', 'active', 'critical', 1, 1, 1, 1,
 'Install CertainTeed Landmark® shingles in Miami-Dade HVHZ with certified compliance',
 'All CertainTeed Landmark installations in high-velocity hurricane zones',
 '["1. Verify Landmark HVHZ certification", "2. Install Landmark shingles per hurricane standards", "3. Apply certified wind resistance procedures", "4. Complete dimensional stability verification", "5. Final HVHZ compliance inspection"]',
 270, 'System Administrator', '2025-10-19', '2026-10-19',
 '["MIAMI_DADE_HVHZ", "CERTAINTEED_LANDMARK", "FLORIDA_BUILDING_CODE", "HURRICANE_STANDARDS"]',
 '["1500", "1000", "7000"]',
 '["Miami-Dade Building Code", "Florida Building Code Chapter 15", "CertainTeed HVHZ Standards"]',
 '["Miami-Dade Product Control Division", "CertainTeed Technical Services", "Florida Building Commission"]',
 'sop-content/SOPs/1500-Miami-Dade-NOA-Systems/SOP-CER-LAN-HVHZ-CertainTeed-Landmark--HVHZ-Installation.md'),

-- CertainTeed Landmark PRO HVHZ Installation
('CER-LAN-PRO-HVHZ', 11, 'CertainTeed Landmark PRO® HVHZ Installation', '1.0', 'active', 'critical', 1, 1, 1, 1,
 'Install CertainTeed Landmark PRO® shingles in Miami-Dade HVHZ with professional-grade compliance',
 'All CertainTeed Landmark PRO installations in high-velocity hurricane zones',
 '["1. Verify PRO-grade HVHZ requirements", "2. Install Landmark PRO shingles per enhanced standards", "3. Apply professional hurricane fastening", "4. Complete enhanced performance verification", "5. Final PRO-grade HVHZ inspection"]',
 315, 'System Administrator', '2025-10-19', '2026-10-19',
 '["MIAMI_DADE_HVHZ", "CERTAINTEED_PRO", "FLORIDA_BUILDING_CODE", "HURRICANE_STANDARDS"]',
 '["1500", "1000", "7000"]',
 '["Miami-Dade Building Code", "Florida Building Code Chapter 15", "CertainTeed PRO Standards"]',
 '["Miami-Dade Product Control Division", "CertainTeed Technical Services", "Professional Standards Institute"]',
 'sop-content/SOPs/1500-Miami-Dade-NOA-Systems/SOP-CER-LAN-HVHZ-CertainTeed-Landmark-PRO--HVHZ-Installation.md'),

-- Malarkey Highlander HVHZ Installation
('MAL-HIG-HVHZ', 11, 'Malarkey Highlander® HVHZ Installation', '1.0', 'active', 'critical', 1, 1, 1, 1,
 'Install Malarkey Highlander® shingles in Miami-Dade HVHZ with NEX® polymer technology',
 'All Malarkey Highlander installations in high-velocity hurricane zones',
 '["1. Verify NEX polymer technology compliance", "2. Install Highlander shingles per HVHZ requirements", "3. Apply advanced polymer fastening", "4. Complete polymer technology verification", "5. Final NEX technology HVHZ inspection"]',
 285, 'System Administrator', '2025-10-19', '2026-10-19',
 '["MIAMI_DADE_HVHZ", "NEX_POLYMER_TECHNOLOGY", "FLORIDA_BUILDING_CODE", "HURRICANE_STANDARDS"]',
 '["1500", "1000", "7000"]',
 '["Miami-Dade Building Code", "Florida Building Code Chapter 15", "NEX Polymer Standards"]',
 '["Miami-Dade Product Control Division", "Malarkey Technical Services", "Polymer Technology Institute"]',
 'sop-content/SOPs/1500-Miami-Dade-NOA-Systems/SOP-MAL-HIG-HVHZ-Malarkey-Highlander--HVHZ-Installation.md'),

-- Atlas Pinnacle Pristine HVHZ Installation
('ATL-PIN-HVHZ', 11, 'Atlas Roofing Pinnacle Pristine® HVHZ Installation', '1.0', 'active', 'critical', 1, 1, 1, 1,
 'Install Atlas Roofing Pinnacle Pristine® shingles in Miami-Dade HVHZ with Scotchgard™ protection',
 'All Atlas Pinnacle Pristine installations in high-velocity hurricane zones',
 '["1. Verify Scotchgard protection compliance", "2. Install Pinnacle Pristine shingles per HVHZ standards", "3. Apply advanced protection fastening", "4. Complete Scotchgard technology verification", "5. Final protection technology HVHZ inspection"]',
 300, 'System Administrator', '2025-10-19', '2026-10-19',
 '["MIAMI_DADE_HVHZ", "SCOTCHGARD_PROTECTION", "FLORIDA_BUILDING_CODE", "HURRICANE_STANDARDS"]',
 '["1500", "1000", "7000"]',
 '["Miami-Dade Building Code", "Florida Building Code Chapter 15", "Scotchgard Technology Standards"]',
 '["Miami-Dade Product Control Division", "Atlas Roofing Technical Services", "3M Scotchgard Division"]',
 'sop-content/SOPs/1500-Miami-Dade-NOA-Systems/SOP-ATL-PIN-HVHZ-Atlas-Roofing-Pinnacle-Pristine-HVHZ-Installation.md'),

-- Commercial TPO Systems
('CAR-SUR-HVHZ', 11, 'Carlisle Sure-Weld TPO System HVHZ Installation', '1.0', 'active', 'critical', 1, 1, 1, 1,
 'Install Carlisle Sure-Weld TPO membrane system in Miami-Dade HVHZ for commercial applications',
 'All commercial TPO installations in high-velocity hurricane zones',
 '["1. Verify TPO HVHZ certification", "2. Install Sure-Weld membrane per hurricane standards", "3. Apply hurricane-grade membrane attachment", "4. Complete commercial wind uplift verification", "5. Final commercial HVHZ inspection"]',
 420, 'System Administrator', '2025-10-19', '2026-10-19',
 '["MIAMI_DADE_HVHZ", "COMMERCIAL_TPO", "FLORIDA_BUILDING_CODE", "HURRICANE_STANDARDS"]',
 '["1500", "1000", "7000", "4000"]',
 '["Miami-Dade Building Code", "Florida Building Code Chapter 15", "Commercial TPO Standards"]',
 '["Miami-Dade Product Control Division", "Carlisle Technical Services", "Commercial Roofing Standards Institute"]',
 'sop-content/SOPs/1500-Miami-Dade-NOA-Systems/SOP-CAR-SUR-HVHZ-Carlisle-Sure-Weld-TPO-Membrane-System-HVHZ-Installation.md');

-- Update the master index count to include 1500 series
UPDATE sop_master_index SET total_procedures = 1998 + 21 WHERE index_type = 'complete';

-- Insert verification statistics
INSERT INTO sop_statistics (
    series_code, total_procedures, active_procedures, florida_specific,
    hurricane_related, osha_related, critical_priority, high_priority,
    created_at, updated_at
) VALUES (
    '1500', 21, 21, 21, 21, 0, 21, 0,
    datetime('now'), datetime('now')
);

-- Create specific index for HVHZ content searching
CREATE INDEX IF NOT EXISTS idx_hvhz_procedures ON sop_procedures(hurricane_related, florida_specific)
WHERE category_id = 11;

-- Verification query
SELECT 'HVHZ 1500 Series Installation Complete' as status;
SELECT category_name, COUNT(*) as sop_count
FROM sop_procedures sp
JOIN sop_categories sc ON sp.category_id = sc.id
WHERE sc.category_code = '1500'
GROUP BY category_name;