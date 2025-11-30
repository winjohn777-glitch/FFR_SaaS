-- Manufacturer Installation Guides Database Schema
-- For tracking and storing roofing product installation guides

-- Table for manufacturer information
CREATE TABLE IF NOT EXISTS manufacturers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50) NOT NULL UNIQUE,
    website_url VARCHAR(500),
    support_phone VARCHAR(20),
    support_email VARCHAR(255),
    headquarters_location VARCHAR(255),
    founded_year INTEGER,
    specialties TEXT, -- JSON array of roofing specialties
    certifications TEXT, -- JSON array of certifications
    is_active BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for tracking installation guides
CREATE TABLE IF NOT EXISTS manufacturer_installation_guides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    manufacturer_id INTEGER NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_code VARCHAR(100),
    guide_title VARCHAR(500) NOT NULL,
    guide_type VARCHAR(50) DEFAULT 'installation', -- installation, maintenance, warranty, technical
    product_category VARCHAR(100), -- shingles, membrane, tile, metal, etc.
    hvhz_approved BOOLEAN DEFAULT 0,
    miami_dade_noa VARCHAR(50),
    florida_building_code_approved BOOLEAN DEFAULT 0,
    guide_url VARCHAR(1000), -- Original manufacturer URL
    local_file_path VARCHAR(500), -- Local storage path
    file_size_mb DECIMAL(10,2),
    file_format VARCHAR(10) DEFAULT 'pdf',
    version VARCHAR(20),
    published_date DATE,
    last_updated DATE,
    download_status VARCHAR(20) DEFAULT 'pending', -- pending, downloading, completed, failed
    download_attempts INTEGER DEFAULT 0,
    last_download_attempt TIMESTAMP,
    checksum VARCHAR(64), -- For file integrity verification
    is_current BOOLEAN DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manufacturer_id) REFERENCES manufacturers(id),
    INDEX idx_manufacturer_product (manufacturer_id, product_code),
    INDEX idx_download_status (download_status),
    INDEX idx_hvhz_approved (hvhz_approved)
);

-- Table linking SOPs to installation guides
CREATE TABLE IF NOT EXISTS sop_installation_guides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sop_id INTEGER NOT NULL,
    guide_id INTEGER NOT NULL,
    guide_type VARCHAR(50) DEFAULT 'primary', -- primary, supplementary, reference
    display_order INTEGER DEFAULT 1,
    is_required BOOLEAN DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sop_id) REFERENCES sop_procedures(id),
    FOREIGN KEY (guide_id) REFERENCES manufacturer_installation_guides(id),
    UNIQUE(sop_id, guide_id)
);

-- Table for tracking download logs
CREATE TABLE IF NOT EXISTS guide_download_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guide_id INTEGER NOT NULL,
    download_type VARCHAR(20) DEFAULT 'automatic', -- automatic, manual, scheduled
    download_status VARCHAR(20) NOT NULL, -- started, completed, failed
    file_size_downloaded BIGINT DEFAULT 0,
    download_duration_seconds INTEGER,
    error_message TEXT,
    user_id INTEGER, -- If manually triggered
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (guide_id) REFERENCES manufacturer_installation_guides(id)
);

-- Insert manufacturer data
INSERT OR IGNORE INTO manufacturers (name, short_name, website_url, specialties) VALUES
('Atlas Roofing Corporation', 'atlas', 'https://www.atlasroofing.com', '["asphalt shingles", "synthetic underlayment", "roof ventilation"]'),
('Bermuda Roof Tile', 'bermuda', 'https://www.bermudarooftile.com', '["clay tiles", "concrete tiles", "hurricane resistant"]'),
('Carlisle Construction Materials', 'carlisle', 'https://www.carlisle-ccm.com', '["TPO membrane", "EPDM", "commercial roofing"]'),
('CertainTeed Corporation', 'certainteed', 'https://www.certainteed.com', '["asphalt shingles", "modified bitumen", "commercial systems"]'),
('Eagle Roofing Tile', 'eagle', 'https://www.eagleroofing.com', '["concrete tiles", "clay tiles", "sustainable roofing"]'),
('Firestone Building Products', 'firestone', 'https://www.firestonebpe.com', '["EPDM", "TPO", "modified bitumen", "commercial roofing"]'),
('GAF Materials Corporation', 'gaf', 'https://www.gaf.com', '["asphalt shingles", "commercial roofing", "roof accessories"]'),
('Gulf Coast Supply', 'gulf-coast', 'https://www.gulfcoastsupply.com', '["metal roofing", "steel panels", "aluminum systems"]'),
('Malarkey Roofing Products', 'malarkey', 'https://www.malarkeyroofing.com', '["asphalt shingles", "sustainable roofing", "solar integration"]'),
('Owens Corning', 'owens-corning', 'https://www.owenscorning.com', '["asphalt shingles", "insulation", "roofing systems"]'),
('Soprema Inc.', 'soprema', 'https://www.soprema.us', '["modified bitumen", "self-adhered membranes", "liquid applied"]'),
('Tri County Metals', 'tri-county-metals', 'https://www.tricountymetals.com', '["standing seam", "metal tiles", "commercial metal"]'),
('Versico Roofing Systems', 'versico', 'https://www.versico.com', '["TPO", "EPDM", "modified bitumen", "energy efficient"]);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_manufacturers_short_name ON manufacturers(short_name);
CREATE INDEX IF NOT EXISTS idx_guides_manufacturer ON manufacturer_installation_guides(manufacturer_id);
CREATE INDEX IF NOT EXISTS idx_guides_product ON manufacturer_installation_guides(product_code);
CREATE INDEX IF NOT EXISTS idx_guides_status ON manufacturer_installation_guides(download_status);
CREATE INDEX IF NOT EXISTS idx_sop_guides_sop ON sop_installation_guides(sop_id);
CREATE INDEX IF NOT EXISTS idx_download_logs_guide ON guide_download_logs(guide_id);