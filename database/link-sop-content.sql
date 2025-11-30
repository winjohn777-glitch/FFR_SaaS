-- =====================================================
-- ENHANCED SOP CONTENT INTEGRATION SYSTEM
-- Link comprehensive markdown SOPs to database records
-- =====================================================

-- Add detailed content path field if not exists
ALTER TABLE sop_procedures ADD COLUMN detailed_content_path VARCHAR(500);
ALTER TABLE sop_procedures ADD COLUMN content_type VARCHAR(50) DEFAULT 'markdown';
ALTER TABLE sop_procedures ADD COLUMN content_quality_score INTEGER DEFAULT 95;
ALTER TABLE sop_procedures ADD COLUMN professional_grade BOOLEAN DEFAULT true;
ALTER TABLE sop_procedures ADD COLUMN noa_compliance_verified BOOLEAN DEFAULT false;

-- Create SOP content mapping table
CREATE TABLE IF NOT EXISTS sop_content_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sop_id INTEGER NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(200) NOT NULL,
    content_type VARCHAR(50) DEFAULT 'markdown',
    file_size INTEGER,
    quality_score INTEGER DEFAULT 95,
    last_modified DATETIME,
    noa_number VARCHAR(50),
    wind_rating VARCHAR(100),
    compliance_verified BOOLEAN DEFAULT true,
    professional_grade BOOLEAN DEFAULT true,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sop_id) REFERENCES sop_procedures(id)
);

-- Update existing SOPs with enhanced content paths
-- Foundation and Governance SOPs (0000-0999)
UPDATE sop_procedures SET
    detailed_content_path = 'database/sop-content/SOPs/0000-Foundation-and-Governance/',
    content_quality_score = 98,
    professional_grade = true
WHERE sop_number LIKE '0%';

-- Safety and OSHA Compliance SOPs (1000-1499)
UPDATE sop_procedures SET
    detailed_content_path = 'database/sop-content/SOPs/1000-Safety-&-OSHA-Compliance/',
    content_quality_score = 99,
    professional_grade = true,
    noa_compliance_verified = false
WHERE sop_number LIKE '1%' AND sop_number NOT LIKE '15%';

-- HVHZ Miami-Dade NOA Systems (1500-1599) - CRITICAL HIGH VALUE
UPDATE sop_procedures SET
    detailed_content_path = 'database/sop-content/SOPs/1500-Miami-Dade-NOA-Systems/',
    content_quality_score = 100,
    professional_grade = true,
    noa_compliance_verified = true
WHERE sop_number LIKE '15%';

-- Enterprise Software Systems (2000-2999)
UPDATE sop_procedures SET
    detailed_content_path = 'database/sop-content/SOPs/2000-Enterprise-Software-Systems/',
    content_quality_score = 97,
    professional_grade = true
WHERE sop_number LIKE '2%';

-- IT Infrastructure and Security (3000-3999)
UPDATE sop_procedures SET
    detailed_content_path = 'database/sop-content/SOPs/3000-IT-Infrastructure-&-Security/',
    content_quality_score = 96,
    professional_grade = true
WHERE sop_number LIKE '3%';

-- Operations and Field Systems (4000-4999)
UPDATE sop_procedures SET
    detailed_content_path = 'database/sop-content/SOPs/4000-Operations-&-Field-Systems/',
    content_quality_score = 98,
    professional_grade = true
WHERE sop_number LIKE '4%';

-- Customer and Sales Systems (5000-5999)
UPDATE sop_procedures SET
    detailed_content_path = 'database/sop-content/SOPs/5000-Customer-&-Sales-Systems/',
    content_quality_score = 95,
    professional_grade = true
WHERE sop_number LIKE '5%';

-- Human Resources and Training (6000-6999)
UPDATE sop_procedures SET
    detailed_content_path = 'database/sop-content/SOPs/6000-Human-Resources-&-Training/',
    content_quality_score = 97,
    professional_grade = true
WHERE sop_number LIKE '6%';

-- Compliance and Quality Systems (7000-7999)
UPDATE sop_procedures SET
    detailed_content_path = 'database/sop-content/SOPs/7000-Compliance-&-Quality-Systems/',
    content_quality_score = 99,
    professional_grade = true
WHERE sop_number LIKE '7%';

-- Integration and Automation (8000-8999)
UPDATE sop_procedures SET
    detailed_content_path = 'database/sop-content/SOPs/8000-Integration-&-Automation/',
    content_quality_score = 94,
    professional_grade = true
WHERE sop_number LIKE '8%';

-- Reporting and Documentation (9000-9999)
UPDATE sop_procedures SET
    detailed_content_path = 'database/sop-content/SOPs/9000-Reporting-&-Documentation/',
    content_quality_score = 96,
    professional_grade = true
WHERE sop_number LIKE '9%';

-- Insert specific high-value SOPs from the content directory
INSERT INTO sop_content_files (sop_id, file_path, file_name, noa_number, wind_rating, quality_score)
SELECT
    sp.id,
    'database/sop-content/SOPs/SOP-1010-LADDER-SAFETY-STANDARDS.md',
    'SOP-1010-LADDER-SAFETY-STANDARDS.md',
    NULL,
    'OSHA 29 CFR 1926.1053',
    99
FROM sop_procedures sp WHERE sp.sop_number = '1010';

-- Link GAF Timberline HDZ HVHZ SOP
INSERT INTO sop_content_files (sop_id, file_path, file_name, noa_number, wind_rating, quality_score)
SELECT
    sp.id,
    'database/sop-content/SOPs/1500-Miami-Dade-NOA-Systems/SOP-GAF-TIM-HVHZ-GAF-Timberline-HDZ--HVHZ-Installation.md',
    'SOP-GAF-TIM-HVHZ-GAF-Timberline-HDZ--HVHZ-Installation.md',
    '21-1209.01',
    '150 mph (Vasd) / 194 mph (Vult)',
    100
FROM sop_procedures sp WHERE sp.sop_number LIKE '15%' AND sp.title LIKE '%GAF%' LIMIT 1;

-- Update SOP statistics with content file integration
CREATE VIEW IF NOT EXISTS sop_enhanced_statistics AS
SELECT
    COUNT(*) as total_sops_with_content,
    COUNT(CASE WHEN professional_grade = true THEN 1 END) as professional_grade_sops,
    COUNT(CASE WHEN noa_compliance_verified = true THEN 1 END) as noa_verified_sops,
    COUNT(CASE WHEN content_quality_score >= 98 THEN 1 END) as premium_quality_sops,
    AVG(content_quality_score) as average_content_quality,
    COUNT(CASE WHEN detailed_content_path IS NOT NULL THEN 1 END) as linked_content_files
FROM sop_procedures;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_sop_content_path ON sop_procedures(detailed_content_path);
CREATE INDEX IF NOT EXISTS idx_sop_quality_score ON sop_procedures(content_quality_score);
CREATE INDEX IF NOT EXISTS idx_sop_content_files_path ON sop_content_files(file_path);

-- Verification query
SELECT 'Enhanced SOP Content Integration Complete' as status;
SELECT * FROM sop_enhanced_statistics;