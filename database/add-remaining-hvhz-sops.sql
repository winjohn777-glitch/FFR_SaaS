-- =====================================================
-- ADD REMAINING 1500 SERIES HVHZ SOPs
-- Complete the Miami-Dade HVHZ Systems collection
-- =====================================================

INSERT INTO sop_procedures (
    sop_number, category_id, title, version, status, priority_level, compliance_required,
    florida_specific, hurricane_related, osha_related, purpose, scope, procedure_steps,
    estimated_duration_minutes, created_by, effective_date, next_review_date,
    regulatory_compliance, cross_references, legal_citations, verification_sources,
    content_file_path
) VALUES

-- Commercial and Industrial Systems
('VER-VER-HVHZ', 11, 'Versico VersiWeld TPO System HVHZ Installation', '1.0', 'active', 'critical', 1, 1, 1, 1,
 'Install Versico VersiWeld TPO system in Miami-Dade HVHZ for commercial and industrial applications',
 'All commercial/industrial VersiWeld TPO installations in high-velocity hurricane zones',
 '["1. Verify VersiWeld HVHZ certification", "2. Install TPO membrane per hurricane standards", "3. Apply hurricane-grade welding procedures", "4. Complete commercial wind uplift testing", "5. Final VersiWeld HVHZ inspection"]',
 480, 'System Administrator', '2025-10-19', '2026-10-19',
 '["MIAMI_DADE_HVHZ", "COMMERCIAL_TPO", "VERSIWELD_TECHNOLOGY", "FLORIDA_BUILDING_CODE"]',
 '["1500", "1000", "7000", "4000"]',
 '["Miami-Dade Building Code", "Florida Building Code Chapter 15", "Versico TPO Standards"]',
 '["Miami-Dade Product Control Division", "Versico Technical Services", "Commercial Roofing Institute"]',
 'sop-content/SOPs/1500-Miami-Dade-NOA-Systems/SOP-VER-VER-HVHZ-Versico-VersiWeld-TPO-System-HVHZ-Installation.md'),

('FIR-RUB-HVHZ', 11, 'Firestone RubberGard EPDM System HVHZ Installation', '1.0', 'active', 'critical', 1, 1, 1, 1,
 'Install Firestone RubberGard EPDM system in Miami-Dade HVHZ for long-lasting membrane protection',
 'All EPDM membrane installations in high-velocity hurricane zones',
 '["1. Verify EPDM HVHZ compliance", "2. Install RubberGard membrane per hurricane standards", "3. Apply hurricane-grade seaming", "4. Complete EPDM durability testing", "5. Final RubberGard HVHZ inspection"]',
 450, 'System Administrator', '2025-10-19', '2026-10-19',
 '["MIAMI_DADE_HVHZ", "EPDM_MEMBRANE", "RUBBЕРГARD_TECHNOLOGY", "FLORIDA_BUILDING_CODE"]',
 '["1500", "1000", "7000", "4000"]',
 '["Miami-Dade Building Code", "Florida Building Code Chapter 15", "EPDM Standards"]',
 '["Miami-Dade Product Control Division", "Firestone Technical Services", "EPDM Membrane Institute"]',
 'sop-content/SOPs/1500-Miami-Dade-NOA-Systems/SOP-FIR-RUB-HVHZ-Firestone-RubberGard-EPDM-System-HVHZ-Installation.md'),

-- Modified Bitumen Systems
('CER-MOD-HVHZ', 11, 'CertainTeed Modified Bitumen System HVHZ Installation', '1.0', 'active', 'critical', 1, 1, 1, 1,
 'Install CertainTeed modified bitumen roofing system in Miami-Dade HVHZ',
 'All modified bitumen installations in high-velocity hurricane zones',
 '["1. Verify modified bitumen HVHZ compliance", "2. Install system per hurricane standards", "3. Apply hurricane-grade torching/adhesion", "4. Complete membrane integrity testing", "5. Final modified bitumen HVHZ inspection"]',
 360, 'System Administrator', '2025-10-19', '2026-10-19',
 '["MIAMI_DADE_HVHZ", "MODIFIED_BITUMEN", "CERTAINTEED_SYSTEMS", "FLORIDA_BUILDING_CODE"]',
 '["1500", "1000", "7000", "4000"]',
 '["Miami-Dade Building Code", "Florida Building Code Chapter 15", "Modified Bitumen Standards"]',
 '["Miami-Dade Product Control Division", "CertainTeed Technical Services", "Modified Bitumen Institute"]',
 'sop-content/SOPs/1500-Miami-Dade-NOA-Systems/SOP-CER-MOD-HVHZ-CertainTeed-Modified-Bitumen-Roof-Systems-HVHZ-Installation.md'),

('SOP-COL-HVHZ', 11, 'Soprema Colphene Self-Adhered Modified Bitumen HVHZ Installation', '1.0', 'active', 'critical', 1, 1, 1, 1,
 'Install Soprema Colphene self-adhered modified bitumen system in Miami-Dade HVHZ',
 'All self-adhered modified bitumen installations in high-velocity hurricane zones',
 '["1. Verify Colphene HVHZ certification", "2. Install self-adhered system per hurricane standards", "3. Apply hurricane-grade adhesion procedures", "4. Complete self-adhesion testing", "5. Final Colphene HVHZ inspection"]',
 390, 'System Administrator', '2025-10-19', '2026-10-19',
 '["MIAMI_DADE_HVHZ", "SELF_ADHERED_MODIFIED_BITUMEN", "COLPHENE_TECHNOLOGY", "FLORIDA_BUILDING_CODE"]',
 '["1500", "1000", "7000", "4000"]',
 '["Miami-Dade Building Code", "Florida Building Code Chapter 15", "Self-Adhered Membrane Standards"]',
 '["Miami-Dade Product Control Division", "Soprema Technical Services", "Self-Adhered Membrane Institute"]',
 'sop-content/SOPs/1500-Miami-Dade-NOA-Systems/SOP-SOP-COL-HVHZ-Soprema-Colphene-Self-Adhered-Modified-Bitumen-HVHZ-Installation.md'),

('SOP-SOP-HVHZ', 11, 'Soprema Sopralene Flam Modified Bitumen HVHZ Installation', '1.0', 'active', 'critical', 1, 1, 1, 1,
 'Install Soprema Sopralene Flam modified bitumen system in Miami-Dade HVHZ with torch application',
 'All torch-applied modified bitumen installations in high-velocity hurricane zones',
 '["1. Verify Sopralene Flam HVHZ compliance", "2. Install torch-applied system per hurricane standards", "3. Apply hurricane-grade torch procedures", "4. Complete flame adhesion testing", "5. Final Sopralene HVHZ inspection"]',
 420, 'System Administrator', '2025-10-19', '2026-10-19',
 '["MIAMI_DADE_HVHZ", "TORCH_APPLIED_MODIFIED_BITUMEN", "SOPRALENE_TECHNOLOGY", "FLORIDA_BUILDING_CODE"]',
 '["1500", "1000", "7000", "4000"]',
 '["Miami-Dade Building Code", "Florida Building Code Chapter 15", "Torch-Applied Membrane Standards"]',
 '["Miami-Dade Product Control Division", "Soprema Technical Services", "Torch Application Institute"]',
 'sop-content/SOPs/1500-Miami-Dade-NOA-Systems/SOP-SOP-SOP-HVHZ-Soprema-Sopralene-Flam-Modified-Bitumen-HVHZ-Installation.md'),

-- Tile Systems
('BER-HUR-HVHZ', 11, 'Bermuda Roof Hurricane Clay Roof Tiles HVHZ Installation', '1.0', 'active', 'critical', 1, 1, 1, 1,
 'Install Bermuda Roof hurricane-rated clay tiles in Miami-Dade HVHZ with enhanced wind resistance',
 'All clay tile installations in high-velocity hurricane zones',
 '["1. Verify hurricane clay tile HVHZ certification", "2. Install tiles per hurricane wind standards", "3. Apply hurricane-grade fastening system", "4. Complete wind uplift testing", "5. Final clay tile HVHZ inspection"]',
 330, 'System Administrator', '2025-10-19', '2026-10-19',
 '["MIAMI_DADE_HVHZ", "HURRICANE_CLAY_TILES", "WIND_RESISTANCE", "FLORIDA_BUILDING_CODE"]',
 '["1500", "1000", "7000", "4000"]',
 '["Miami-Dade Building Code", "Florida Building Code Chapter 15", "Clay Tile Standards"]',
 '["Miami-Dade Product Control Division", "Bermuda Roof Technical Services", "Clay Tile Institute"]',
 'sop-content/SOPs/1500-Miami-Dade-NOA-Systems/SOP-BER-HUR-HVHZ-Bermuda-Roof-Tile-Hurricane-Clay-Roof-Tiles-HVHZ-Installation.md'),

('EAG-CAP-HVHZ', 11, 'Eagle Roofing Capistrano Concrete Roof Tiles HVHZ Installation', '1.0', 'active', 'critical', 1, 1, 1, 1,
 'Install Eagle Roofing Capistrano concrete tiles in Miami-Dade HVHZ with superior wind resistance',
 'All concrete tile installations in high-velocity hurricane zones',
 '["1. Verify Capistrano concrete tile HVHZ compliance", "2. Install tiles per hurricane standards", "3. Apply hurricane-grade concrete fastening", "4. Complete concrete durability testing", "5. Final Capistrano HVHZ inspection"]',
 345, 'System Administrator', '2025-10-19', '2026-10-19',
 '["MIAMI_DADE_HVHZ", "CONCRETE_ROOF_TILES", "CAPISTRANO_TECHNOLOGY", "FLORIDA_BUILDING_CODE"]',
 '["1500", "1000", "7000", "4000"]',
 '["Miami-Dade Building Code", "Florida Building Code Chapter 15", "Concrete Tile Standards"]',
 '["Miami-Dade Product Control Division", "Eagle Roofing Technical Services", "Concrete Tile Institute"]',
 'sop-content/SOPs/1500-Miami-Dade-NOA-Systems/SOP-EAG-CAP-HVHZ-Eagle-Roofing-Tile-Capistrano-Concrete-Roof-Tiles-HVHZ-Installation.md'),

-- Metal Systems
('GUL-COR-HVHZ', 11, 'Gulf Coast Supply Corrugated Steel Panel System HVHZ Installation', '1.0', 'active', 'critical', 1, 1, 1, 1,
 'Install Gulf Coast Supply corrugated steel panel system in Miami-Dade HVHZ',
 'All corrugated steel panel installations in high-velocity hurricane zones',
 '["1. Verify corrugated steel HVHZ compliance", "2. Install panels per hurricane standards", "3. Apply hurricane-grade steel fastening", "4. Complete metal expansion testing", "5. Final corrugated steel HVHZ inspection"]',
 390, 'System Administrator', '2025-10-19', '2026-10-19',
 '["MIAMI_DADE_HVHZ", "CORRUGATED_STEEL_PANELS", "METAL_ROOFING", "FLORIDA_BUILDING_CODE"]',
 '["1500", "1000", "7000", "4000"]',
 '["Miami-Dade Building Code", "Florida Building Code Chapter 15", "Metal Roofing Standards"]',
 '["Miami-Dade Product Control Division", "Gulf Coast Supply Technical Services", "Metal Roofing Alliance"]',
 'sop-content/SOPs/1500-Miami-Dade-NOA-Systems/SOP-GUL-COR-HVHZ-Gulf-Coast-Supply-Corrugated-Steel-Panel-System-HVHZ-Installation.md'),

('GUL-STA-HVHZ', 11, 'Gulf Coast Supply Standing Seam Aluminum Roof System HVHZ Installation', '1.0', 'active', 'critical', 1, 1, 1, 1,
 'Install Gulf Coast Supply standing seam aluminum roofing system in Miami-Dade HVHZ',
 'All standing seam aluminum installations in high-velocity hurricane zones',
 '["1. Verify standing seam aluminum HVHZ compliance", "2. Install system per hurricane standards", "3. Apply hurricane-grade seaming procedures", "4. Complete aluminum durability testing", "5. Final standing seam HVHZ inspection"]',
 420, 'System Administrator', '2025-10-19', '2026-10-19',
 '["MIAMI_DADE_HVHZ", "STANDING_SEAM_ALUMINUM", "METAL_ROOFING", "FLORIDA_BUILDING_CODE"]',
 '["1500", "1000", "7000", "4000"]',
 '["Miami-Dade Building Code", "Florida Building Code Chapter 15", "Standing Seam Standards"]',
 '["Miami-Dade Product Control Division", "Gulf Coast Supply Technical Services", "Aluminum Association"]',
 'sop-content/SOPs/1500-Miami-Dade-NOA-Systems/SOP-GUL-STA-HVHZ-Gulf-Coast-Supply-Standing-Seam-Aluminum-Roof-System-HVHZ-Installation.md'),

('TRI-MET-HVHZ', 11, 'Tri-County Metals Metal Tile Profile System HVHZ Installation', '1.0', 'active', 'critical', 1, 1, 1, 1,
 'Install Tri-County Metals metal tile profile system in Miami-Dade HVHZ',
 'All metal tile profile installations in high-velocity hurricane zones',
 '["1. Verify metal tile profile HVHZ compliance", "2. Install system per hurricane standards", "3. Apply hurricane-grade metal fastening", "4. Complete profile integrity testing", "5. Final metal tile HVHZ inspection"]',
 375, 'System Administrator', '2025-10-19', '2026-10-19',
 '["MIAMI_DADE_HVHZ", "METAL_TILE_PROFILE", "TRI_COUNTY_METALS", "FLORIDA_BUILDING_CODE"]',
 '["1500", "1000", "7000", "4000"]',
 '["Miami-Dade Building Code", "Florida Building Code Chapter 15", "Metal Tile Standards"]',
 '["Miami-Dade Product Control Division", "Tri-County Metals Technical Services", "Metal Tile Institute"]',
 'sop-content/SOPs/1500-Miami-Dade-NOA-Systems/SOP-TRI-MET-HVHZ-Tri-County-Metals-Metal-Tile-Profile-System-HVHZ-Installation.md'),

('TRI-SNA-HVHZ', 11, 'Tri-County Metals Snap-Lock Steel Standing Seam HVHZ Installation', '1.0', 'active', 'critical', 1, 1, 1, 1,
 'Install Tri-County Metals snap-lock steel standing seam system in Miami-Dade HVHZ',
 'All snap-lock steel standing seam installations in high-velocity hurricane zones',
 '["1. Verify snap-lock steel HVHZ compliance", "2. Install system per hurricane standards", "3. Apply hurricane-grade snap-lock procedures", "4. Complete steel integrity testing", "5. Final snap-lock HVHZ inspection"]',
 405, 'System Administrator', '2025-10-19', '2026-10-19',
 '["MIAMI_DADE_HVHZ", "SNAP_LOCK_STEEL", "STANDING_SEAM", "FLORIDA_BUILDING_CODE"]',
 '["1500", "1000", "7000", "4000"]',
 '["Miami-Dade Building Code", "Florida Building Code Chapter 15", "Snap-Lock Standards"]',
 '["Miami-Dade Product Control Division", "Tri-County Metals Technical Services", "Steel Roofing Institute"]',
 'sop-content/SOPs/1500-Miami-Dade-NOA-Systems/SOP-TRI-SNA-HVHZ-Tri-County-Metals-Snap-Lock-Steel-Standing-Seam-HVHZ-Installation.md');

-- Verification query
SELECT 'All HVHZ SOPs Added Successfully' as status;
SELECT COUNT(*) as total_hvhz_sops FROM sop_procedures WHERE category_id = 11;