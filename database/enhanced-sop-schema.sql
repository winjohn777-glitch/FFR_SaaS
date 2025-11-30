-- =====================================================
-- ENHANCED SOP SCHEMA FOR LEGAL COMPLIANCE
-- Supporting comprehensive regulatory compliance tracking
-- =====================================================

-- Add regulatory compliance tracking fields
ALTER TABLE sop_procedures ADD COLUMN regulatory_compliance TEXT; -- JSON array of applicable regulations
ALTER TABLE sop_procedures ADD COLUMN cross_references TEXT; -- JSON array of related SOPs and documents
ALTER TABLE sop_procedures ADD COLUMN legal_citations TEXT; -- JSON array of legal codes and standards
ALTER TABLE sop_procedures ADD COLUMN verification_sources TEXT; -- JSON array of authoritative sources
ALTER TABLE sop_procedures ADD COLUMN last_legal_review DATE; -- Date of last legal compliance review
ALTER TABLE sop_procedures ADD COLUMN content_file_path VARCHAR(500); -- Path to detailed SOP content

-- Regulatory Compliance Reference Table
CREATE TABLE IF NOT EXISTS regulatory_compliance_matrix (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    regulation_code VARCHAR(50) NOT NULL UNIQUE,
    regulation_name VARCHAR(200) NOT NULL,
    agency VARCHAR(100) NOT NULL,
    jurisdiction VARCHAR(50) NOT NULL, -- federal, state, local, county
    citation VARCHAR(200),
    effective_date DATE,
    last_updated DATE,
    compliance_url VARCHAR(500),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Legal Citations and Standards Reference
CREATE TABLE IF NOT EXISTS legal_citations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    citation_code VARCHAR(50) NOT NULL UNIQUE,
    citation_type VARCHAR(50) NOT NULL, -- CFR, Florida_Statute, Building_Code, OSHA, etc.
    title VARCHAR(300) NOT NULL,
    section VARCHAR(100),
    subsection VARCHAR(100),
    authority VARCHAR(200),
    effective_date DATE,
    citation_url VARCHAR(500),
    full_text TEXT,
    summary TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- SOP Legal Compliance Mapping
CREATE TABLE IF NOT EXISTS sop_legal_compliance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sop_id INTEGER NOT NULL,
    regulation_id INTEGER,
    citation_id INTEGER,
    compliance_type VARCHAR(50) NOT NULL, -- mandatory, recommended, best_practice
    compliance_status VARCHAR(50) DEFAULT 'compliant', -- compliant, non_compliant, under_review
    last_verified DATE,
    verified_by VARCHAR(100),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sop_id) REFERENCES sop_procedures(id),
    FOREIGN KEY (regulation_id) REFERENCES regulatory_compliance_matrix(id),
    FOREIGN KEY (citation_id) REFERENCES legal_citations(id)
);

-- Document Sources and References
CREATE TABLE IF NOT EXISTS sop_document_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sop_id INTEGER NOT NULL,
    source_type VARCHAR(50) NOT NULL, -- standard, regulation, best_practice, manufacturer
    source_name VARCHAR(200) NOT NULL,
    document_title VARCHAR(300),
    document_url VARCHAR(500),
    document_date DATE,
    version VARCHAR(20),
    page_reference VARCHAR(50),
    relevance_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sop_id) REFERENCES sop_procedures(id)
);

-- =====================================================
-- POPULATE REGULATORY COMPLIANCE MATRIX
-- =====================================================

INSERT OR REPLACE INTO regulatory_compliance_matrix (regulation_code, regulation_name, agency, jurisdiction, citation, effective_date, compliance_url, description) VALUES

-- Federal OSHA Regulations
('OSHA_1926', 'OSHA Construction Standards', 'Occupational Safety and Health Administration', 'federal', '29 CFR 1926', '1971-05-29', 'https://www.osha.gov/laws-regs/regulations/standardnumber/1926', 'Federal safety standards for construction industry'),
('OSHA_1926_95', 'Personal Protective Equipment', 'OSHA', 'federal', '29 CFR 1926.95', '1971-05-29', 'https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.95', 'PPE requirements for construction workers'),
('OSHA_1926_501', 'Fall Protection', 'OSHA', 'federal', '29 CFR 1926.501', '1994-02-06', 'https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.501', 'Fall protection requirements for construction'),
('OSHA_1926_1053', 'Ladders', 'OSHA', 'federal', '29 CFR 1926.1053', '1990-11-14', 'https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1053', 'Ladder safety requirements'),

-- Florida Building Code
('FBC_2020', 'Florida Building Code 2020', 'Florida Building Commission', 'state', 'Florida Building Code', '2020-12-31', 'https://floridabuilding.org/c/default.aspx', 'Comprehensive building standards for Florida'),
('FBC_ROOFING', 'Florida Building Code - Roofing', 'Florida Building Commission', 'state', 'FBC Chapter 15', '2020-12-31', 'https://floridabuilding.org/c/default.aspx', 'Roofing-specific requirements in Florida'),
('FBC_ENERGY', 'Florida Energy Conservation Code', 'Florida Building Commission', 'state', 'FECC', '2020-12-31', 'https://floridabuilding.org/c/default.aspx', 'Energy efficiency requirements for buildings'),

-- HVHZ Regulations
('HVHZ_MIAMIDADE', 'Miami-Dade HVHZ Requirements', 'Miami-Dade County', 'local', 'Miami-Dade County Code', '2002-06-01', 'https://www.miamidade.gov/building/standards.asp', 'High Velocity Hurricane Zone requirements'),
('HVHZ_BROWARD', 'Broward County HVHZ Requirements', 'Broward County', 'local', 'Broward County Code', '2002-06-01', 'https://www.broward.org/Building/Pages/default.aspx', 'High Velocity Hurricane Zone requirements'),

-- Environmental Regulations
('EPA_RRP', 'EPA Renovation, Repair, and Painting Rule', 'Environmental Protection Agency', 'federal', '40 CFR 745', '2010-04-22', 'https://www.epa.gov/lead/renovation-repair-and-painting-program', 'Lead-safe work practices'),
('FDEP_WASTE', 'Florida Solid Waste Management', 'Florida Department of Environmental Protection', 'state', 'Chapter 62-701, F.A.C.', '1988-01-01', 'https://floridadep.gov/waste/waste/content/solid-waste', 'Waste management requirements'),

-- Florida Licensing
('FL_ROOFING_LICENSE', 'Florida Roofing Contractor License', 'Florida Department of Business and Professional Regulation', 'state', 'Chapter 489, F.S.', '1992-07-01', 'https://www.myfloridalicense.com/DBPR/', 'Roofing contractor licensing requirements'),
('FL_CGC_LICENSE', 'Florida General Contractor License', 'Florida DBPR', 'state', 'Chapter 489, F.S.', '1992-07-01', 'https://www.myfloridalicense.com/DBPR/', 'General contractor licensing requirements'),

-- Building Codes and Standards
('IBC_2018', 'International Building Code 2018', 'International Code Council', 'federal', 'IBC 2018', '2018-01-01', 'https://codes.iccsafe.org/', 'International building standards'),
('IRC_2018', 'International Residential Code 2018', 'International Code Council', 'federal', 'IRC 2018', '2018-01-01', 'https://codes.iccsafe.org/', 'Residential construction standards'),
('NRCA_STANDARDS', 'NRCA Roofing Manual', 'National Roofing Contractors Association', 'federal', 'NRCA Manual', '2021-01-01', 'https://www.nrca.net/', 'Industry best practices for roofing'),

-- Insurance and Bonding
('FL_INSURANCE_REQ', 'Florida Contractor Insurance Requirements', 'Florida Office of Insurance Regulation', 'state', 'Chapter 627, F.S.', '1992-07-01', 'https://www.floir.com/', 'Required insurance coverage for contractors'),

-- Technology and Data Protection
('SOX_COMPLIANCE', 'Sarbanes-Oxley Act Compliance', 'Securities and Exchange Commission', 'federal', 'SOX Act of 2002', '2002-07-30', 'https://www.sec.gov/about/laws/soa2002.pdf', 'Financial reporting and data protection'),
('GDPR_PRIVACY', 'General Data Protection Regulation', 'European Union', 'international', 'EU GDPR', '2018-05-25', 'https://gdpr.eu/', 'Data privacy and protection requirements'),
('FLORIDA_PRIVACY', 'Florida Personal Information Protection Act', 'Florida Legislature', 'state', 'Section 501.171, F.S.', '2014-07-01', 'https://www.flsenate.gov/', 'Personal information protection requirements');

-- =====================================================
-- POPULATE LEGAL CITATIONS
-- =====================================================

INSERT OR REPLACE INTO legal_citations (citation_code, citation_type, title, section, authority, effective_date, citation_url, summary) VALUES

-- OSHA Citations
('CFR_1926_501', 'CFR', 'Fall Protection in Construction', '1926.501', 'U.S. Department of Labor', '1994-02-06', 'https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.501', 'Requires fall protection systems for employees working at heights of 6 feet or more'),
('CFR_1926_95', 'CFR', 'Personal Protective Equipment', '1926.95', 'U.S. Department of Labor', '1971-05-29', 'https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.95', 'Requirements for head protection, eye and face protection, and respiratory protection'),
('CFR_1926_1053', 'CFR', 'Ladders', '1926.1053', 'U.S. Department of Labor', '1990-11-14', 'https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926.1053', 'General requirements for all ladders used in construction'),

-- Florida Building Code Citations
('FBC_CHAP15', 'Florida_Building_Code', 'Roof Assemblies and Rooftop Structures', 'Chapter 15', 'Florida Building Commission', '2020-12-31', 'https://floridabuilding.org/', 'Requirements for roof assemblies, rooftop structures, and roofing materials'),
('FBC_1504', 'Florida_Building_Code', 'Performance Requirements', '1504', 'Florida Building Commission', '2020-12-31', 'https://floridabuilding.org/', 'Weather resistance, fire classification, and wind resistance requirements'),
('FBC_1507', 'Florida_Building_Code', 'Requirements for Roof Coverings', '1507', 'Florida Building Commission', '2020-12-31', 'https://floridabuilding.org/', 'Specific requirements for different types of roof coverings'),

-- Florida Statutes
('FS_489', 'Florida_Statute', 'Contracting', 'Chapter 489', 'Florida Legislature', '1992-07-01', 'http://www.leg.state.fl.us/statutes/', 'Licensing and regulation of contractors in Florida'),
('FS_553', 'Florida_Statute', 'Building Construction Standards', 'Chapter 553', 'Florida Legislature', '1974-07-01', 'http://www.leg.state.fl.us/statutes/', 'Florida Building Code adoption and enforcement'),

-- Industry Standards
('NRCA_GUIDE', 'Industry_Standard', 'NRCA Roofing Manual', 'Complete Manual', 'National Roofing Contractors Association', '2021-01-01', 'https://www.nrca.net/', 'Comprehensive roofing industry best practices and standards'),
('ASTM_D6878', 'ASTM_Standard', 'Standard Specification for Thermoplastic Polyolefin Based Sheet Roofing', 'D6878', 'ASTM International', '2020-01-01', 'https://www.astm.org/', 'Specifications for TPO roofing materials'),

-- Miami-Dade NOAs
('MIAMIDADE_NOA', 'Local_Code', 'Notice of Acceptance Requirements', 'NOA', 'Miami-Dade County', '2002-06-01', 'https://www.miamidade.gov/building/library/roofing-manual.pdf', 'Product approval requirements for HVHZ areas');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sop_legal_compliance_sop ON sop_legal_compliance(sop_id);
CREATE INDEX IF NOT EXISTS idx_sop_legal_compliance_regulation ON sop_legal_compliance(regulation_id);
CREATE INDEX IF NOT EXISTS idx_sop_document_sources_sop ON sop_document_sources(sop_id);
CREATE INDEX IF NOT EXISTS idx_regulatory_compliance_jurisdiction ON regulatory_compliance_matrix(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_legal_citations_type ON legal_citations(citation_type);

-- Update existing procedures with content file paths
UPDATE sop_procedures SET content_file_path = 'sop-' || sop_number || '.md' WHERE content_file_path IS NULL;