-- ABCD Numbering System Implementation for Florida First Roofing
-- A = Category (0-9), B = Sub-category (0-9), CD = Subject (00-99)

-- Create sub-categories table
CREATE TABLE IF NOT EXISTS sop_sub_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    sub_category_code INTEGER NOT NULL,
    sub_category_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES sop_categories(id)
);

-- Add sub_category_id column to sop_procedures if it doesn't exist
ALTER TABLE sop_procedures ADD COLUMN sub_category_id INTEGER DEFAULT 0;

-- Clear and insert sub-categories
DELETE FROM sop_sub_categories;

-- Insert sub-categories for each main category
INSERT INTO sop_sub_categories (category_id, sub_category_code, sub_category_name, description) VALUES
-- Category 0: Safety and OSHA Compliance (category_id: 1)
(1, 0, 'General Safety Protocols', 'Basic safety requirements and general protocols'),
(1, 1, 'Personal Protective Equipment', 'PPE requirements, selection, and maintenance'),
(1, 2, 'Fall Protection Systems', 'Fall protection equipment and procedures'),
(1, 3, 'Hazard Assessment', 'Risk assessment and hazard identification'),
(1, 4, 'OSHA Compliance', 'OSHA regulatory compliance requirements'),
(1, 5, 'Emergency Procedures', 'Emergency response and evacuation procedures'),
(1, 6, 'Tool and Equipment Safety', 'Safe operation of tools and equipment'),
(1, 7, 'Site Safety Management', 'Job site safety coordination and management'),
(1, 8, 'Training and Certification', 'Safety training programs and certifications'),
(1, 9, 'Incident Response', 'Accident reporting and incident management'),

-- Category 1: Materials and Products (category_id: 2)
(2, 0, 'Material Selection', 'Material specification and selection criteria'),
(2, 1, 'Quality Inspection', 'Material quality control and inspection procedures'),
(2, 2, 'Storage and Handling', 'Proper storage and handling of materials'),
(2, 3, 'Shingles and Tiles', 'Shingle and tile products and specifications'),
(2, 4, 'Underlayment Systems', 'Underlayment materials and installation'),
(2, 5, 'Flashing and Sealants', 'Flashing materials and sealant applications'),
(2, 6, 'Fasteners and Hardware', 'Fastening systems and hardware components'),
(2, 7, 'Ventilation Products', 'Ventilation systems and components'),
(2, 8, 'Insulation Materials', 'Insulation products and specifications'),
(2, 9, 'Specialty Products', 'Specialty and custom roofing materials'),

-- Category 2: Installation Procedures (category_id: 3)
(3, 0, 'Pre-Installation Setup', 'Site preparation and pre-installation procedures'),
(3, 1, 'Roof Deck Preparation', 'Deck inspection, repair, and preparation'),
(3, 2, 'Underlayment Installation', 'Underlayment installation procedures'),
(3, 3, 'Shingle Installation', 'Shingle installation techniques and methods'),
(3, 4, 'Tile Installation', 'Tile installation procedures and best practices'),
(3, 5, 'Flashing Installation', 'Flashing installation and sealing procedures'),
(3, 6, 'Ventilation Installation', 'Ventilation system installation'),
(3, 7, 'Ridge and Hip Installation', 'Ridge cap and hip installation procedures'),
(3, 8, 'Specialty Installation', 'Specialty installation techniques'),
(3, 9, 'Final Inspection', 'Installation completion and final inspection'),

-- Category 3: Repair and Maintenance (category_id: 4)
(4, 0, 'Damage Assessment', 'Roof damage assessment and evaluation'),
(4, 1, 'Leak Diagnosis', 'Leak detection and source identification'),
(4, 2, 'Emergency Repairs', 'Emergency repair procedures and temporary fixes'),
(4, 3, 'Shingle Repairs', 'Shingle replacement and repair procedures'),
(4, 4, 'Tile Repairs', 'Tile repair and replacement methods'),
(4, 5, 'Flashing Repairs', 'Flashing repair and replacement procedures'),
(4, 6, 'Structural Repairs', 'Structural damage repair procedures'),
(4, 7, 'Preventive Maintenance', 'Routine maintenance and prevention programs'),
(4, 8, 'Gutter Systems', 'Gutter repair and maintenance procedures'),
(4, 9, 'Warranty Work', 'Warranty claim procedures and repairs'),

-- Category 4: Business Operations (category_id: 5)
(5, 0, 'Customer Relations', 'Customer service and relationship management'),
(5, 1, 'Sales and Estimating', 'Sales processes and cost estimation'),
(5, 2, 'Project Management', 'Project planning and execution management'),
(5, 3, 'Scheduling and Logistics', 'Scheduling coordination and logistics management'),
(5, 4, 'Financial Management', 'Financial procedures and cost control'),
(5, 5, 'Insurance Claims', 'Insurance claim processing and documentation'),
(5, 6, 'Permit and Inspection', 'Permit application and inspection coordination'),
(5, 7, 'Vendor Management', 'Supplier and vendor relationship management'),
(5, 8, 'Employee Management', 'HR procedures and employee management'),
(5, 9, 'Marketing and Business Development', 'Marketing strategies and business growth'),

-- Category 5: Florida Building Compliance (category_id: 6)
(6, 0, 'Florida Building Code', 'Florida Building Code compliance requirements'),
(6, 1, 'Hurricane Standards', 'Hurricane-resistant construction standards'),
(6, 2, 'Wind Load Requirements', 'Wind load calculations and compliance'),
(6, 3, 'NOA Requirements', 'Notice of Acceptance compliance procedures'),
(6, 4, 'Local Code Variations', 'Local municipality code requirements'),
(6, 5, 'Inspection Requirements', 'State inspection procedures and requirements'),
(6, 6, 'Permit Procedures', 'Florida permit application and approval'),
(6, 7, 'Energy Code Compliance', 'Energy efficiency code compliance'),
(6, 8, 'Accessibility Requirements', 'ADA and accessibility compliance'),
(6, 9, 'Environmental Regulations', 'Environmental protection compliance'),

-- Category 6: Commercial Roofing (category_id: 7)
(7, 0, 'Commercial Planning', 'Commercial project planning and design'),
(7, 1, 'Membrane Systems', 'Commercial membrane roofing systems'),
(7, 2, 'Metal Roofing', 'Commercial metal roofing installation'),
(7, 3, 'Built-Up Systems', 'Built-up roofing system procedures'),
(7, 4, 'Modified Bitumen', 'Modified bitumen installation procedures'),
(7, 5, 'Single-Ply Systems', 'Single-ply membrane installation'),
(7, 6, 'Green Roof Systems', 'Green roof and sustainable systems'),
(7, 7, 'Equipment Integration', 'HVAC and equipment integration'),
(7, 8, 'Large Scale Management', 'Large-scale project management'),
(7, 9, 'Commercial Maintenance', 'Commercial roof maintenance programs'),

-- Category 7: Quality Control and Assurance (category_id: 8)
(8, 0, 'Quality Planning', 'Quality control planning and procedures'),
(8, 1, 'Inspection Protocols', 'Quality inspection protocols and standards'),
(8, 2, 'Testing Procedures', 'Material and installation testing procedures'),
(8, 3, 'Documentation Standards', 'Quality documentation requirements'),
(8, 4, 'Defect Management', 'Defect identification and correction procedures'),
(8, 5, 'Customer Satisfaction', 'Customer satisfaction measurement and improvement'),
(8, 6, 'Warranty Management', 'Warranty tracking and management procedures'),
(8, 7, 'Performance Metrics', 'Quality performance measurement and analysis'),
(8, 8, 'Continuous Improvement', 'Quality improvement processes'),
(8, 9, 'Certification Management', 'Quality certification and compliance tracking'),

-- Category 8: Technical Engineering (category_id: 9)
(9, 0, 'Structural Analysis', 'Structural engineering and load calculations'),
(9, 1, 'Design Specifications', 'Technical design and specification development'),
(9, 2, 'Material Engineering', 'Material properties and engineering analysis'),
(9, 3, 'Environmental Calculations', 'Environmental load and impact calculations'),
(9, 4, 'CAD and Modeling', 'Computer-aided design and modeling procedures'),
(9, 5, 'Testing and Validation', 'Engineering testing and validation procedures'),
(9, 6, 'Code Compliance Analysis', 'Building code compliance analysis'),
(9, 7, 'Performance Analysis', 'System performance analysis and optimization'),
(9, 8, 'Innovation Development', 'New technology and innovation development'),
(9, 9, 'Peer Review Process', 'Engineering peer review and validation'),

-- Category 9: Documentation and Records (category_id: 10)
(10, 0, 'Project Documentation', 'Project documentation standards and procedures'),
(10, 1, 'Regulatory Compliance', 'Regulatory documentation and compliance records'),
(10, 2, 'Quality Records', 'Quality assurance documentation and records'),
(10, 3, 'Customer Records', 'Customer documentation and record management'),
(10, 4, 'Legal Documentation', 'Legal documents and compliance records'),
(10, 5, 'Training Records', 'Training documentation and certification records'),
(10, 6, 'Financial Records', 'Financial documentation and record keeping'),
(10, 7, 'Maintenance Records', 'Maintenance and service record documentation'),
(10, 8, 'Archive Management', 'Document archival and retrieval procedures'),
(10, 9, 'Digital Systems', 'Digital documentation systems and procedures');

-- Create backup before updating
CREATE TABLE IF NOT EXISTS sop_procedures_backup_abcd AS SELECT * FROM sop_procedures;

-- Check current categories
SELECT 'Current Categories:' as message;
SELECT id, name, description FROM sop_categories ORDER BY id;

-- Redistribute SOPs with ABCD numbering
-- This will update SOPs to follow the ABCD pattern where:
-- A = Category (category_id - 1, so 0-9)
-- B = Sub-category (0-9)
-- CD = Subject within sub-category (00-99)

-- Update SOPs with proper ABCD numbering
WITH numbered_sops AS (
    SELECT
        id,
        category_id,
        (category_id - 1) as category_index,  -- Convert to 0-based
        ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY id) - 1 as sop_index,
        ((ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY id) - 1) / 10) % 10 as sub_category_index,
        (ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY id) - 1) % 100 as subject_index
    FROM sop_procedures
)
UPDATE sop_procedures
SET
    sop_number = 'FFR_SOP-' ||
                 (SELECT category_index FROM numbered_sops WHERE numbered_sops.id = sop_procedures.id) ||
                 (SELECT sub_category_index FROM numbered_sops WHERE numbered_sops.id = sop_procedures.id) ||
                 printf('%02d', (SELECT subject_index FROM numbered_sops WHERE numbered_sops.id = sop_procedures.id)),
    sub_category_id = (SELECT sub_category_index FROM numbered_sops WHERE numbered_sops.id = sop_procedures.id)
WHERE EXISTS (SELECT 1 FROM numbered_sops WHERE numbered_sops.id = sop_procedures.id);

-- Verification query to check the ABCD structure
SELECT 'ABCD Structure Verification:' as message;
SELECT
    'Category: ' || category_id || ' | Sub-Cat: ' || COALESCE(sub_category_id, 'NULL') || ' | Count: ' || COUNT(*) || ' | Range: ' || MIN(sop_number) || ' to ' || MAX(sop_number) as structure
FROM sop_procedures
GROUP BY category_id, sub_category_id
ORDER BY category_id, sub_category_id
LIMIT 20;

-- Sample SOPs with new numbering
SELECT 'Sample SOPs with ABCD numbering:' as message;
SELECT sop_number || ': ' || title as sample_sops
FROM sop_procedures
ORDER BY sop_number
LIMIT 20;

-- Statistics
SELECT 'Total SOPs redistributed: ' || COUNT(*) as stats FROM sop_procedures;
SELECT 'Sub-categories created: ' || COUNT(*) as stats FROM sop_sub_categories;