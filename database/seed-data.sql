-- Florida First Roofing LLC - Sample Data
-- Seed data for development and testing

-- Insert Users (passwords are hashed versions of 'admin123', 'supervisor123', 'user123')
INSERT INTO users (email, password_hash, role, first_name, last_name, is_active) VALUES
('admin@floridafirstroofing.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/0s1LcEJNdSaoCw/hy', 'admin', 'David', 'Johnson', TRUE),
('supervisor@floridafirstroofing.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/0s1LcEJNdSaoCw/hy', 'supervisor', 'Maria', 'Rodriguez', TRUE),
('manager@floridafirstroofing.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/0s1LcEJNdSaoCw/hy', 'manager', 'John', 'Smith', TRUE),
('user@floridafirstroofing.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/0s1LcEJNdSaoCw/hy', 'user', 'Sarah', 'Wilson', TRUE);

-- Insert Chart of Accounts based on the JSON structure
INSERT INTO chart_of_accounts (account_code, account_name, account_type, description) VALUES
-- ASSETS
('1000', 'Cash - Operating Account', 'Asset', 'Primary business checking account'),
('1010', 'Cash - Payroll Account', 'Asset', 'Dedicated payroll checking account'),
('1020', 'Petty Cash', 'Asset', 'Small cash on hand for minor expenses'),
('1100', 'Accounts Receivable', 'Asset', 'Money owed by customers'),
('1110', 'Allowance for Doubtful Accounts', 'Asset', 'Estimated uncollectible receivables'),
('1200', 'Materials Inventory', 'Asset', 'Roofing materials on hand'),
('1210', 'Work in Progress', 'Asset', 'Costs accumulated for jobs in progress'),
('1300', 'Prepaid Insurance', 'Asset', 'Insurance premiums paid in advance'),
('1310', 'Prepaid Licenses & Permits', 'Asset', 'Business licenses and permits'),
('1400', 'Vehicles', 'Asset', 'Company trucks and vehicles'),
('1410', 'Accumulated Depreciation - Vehicles', 'Asset', 'Depreciation on vehicles'),
('1500', 'Equipment & Tools', 'Asset', 'Roofing equipment and tools'),
('1510', 'Accumulated Depreciation - Equipment', 'Asset', 'Depreciation on equipment'),

-- LIABILITIES
('2000', 'Accounts Payable', 'Liability', 'Money owed to suppliers and vendors'),
('2100', 'Credit Card Payable', 'Liability', 'Business credit card balances'),
('2200', 'Accrued Wages', 'Liability', 'Wages earned but not yet paid'),
('2210', 'Payroll Taxes Payable', 'Liability', 'Federal and state payroll taxes'),
('2220', 'Workers Comp Insurance Payable', 'Liability', 'Workers compensation premiums'),
('2300', 'Florida Sales Tax Payable', 'Liability', 'Sales tax collected and owed to state'),
('2400', 'Customer Deposits', 'Liability', 'Advance payments from customers'),
('2500', 'Equipment Loan', 'Liability', 'Loan for roofing equipment'),
('2600', 'Vehicle Loan', 'Liability', 'Loans on company vehicles'),

-- EQUITY
('3000', 'Owner Equity', 'Equity', 'Owner investment in business'),
('3100', 'Retained Earnings', 'Equity', 'Accumulated profits retained in business'),
('3200', 'Owner Draws', 'Equity', 'Owner withdrawals from business'),

-- REVENUE
('4000', 'Roofing Services Revenue', 'Revenue', 'Revenue from roofing installation and repair'),
('4100', 'Emergency Repair Revenue', 'Revenue', 'Revenue from emergency roofing repairs'),
('4200', 'Insurance Claim Revenue', 'Revenue', 'Revenue from insurance claim work'),
('4300', 'Materials Markup Revenue', 'Revenue', 'Markup on materials sold to customers'),
('4400', 'Maintenance Contract Revenue', 'Revenue', 'Revenue from ongoing maintenance contracts'),

-- COST OF GOODS SOLD
('5000', 'Materials - Shingles', 'Expense', 'Cost of asphalt and architectural shingles'),
('5010', 'Materials - Metal Roofing', 'Expense', 'Cost of metal roofing materials'),
('5020', 'Materials - Tile', 'Expense', 'Cost of tile roofing materials'),
('5030', 'Materials - Underlayment', 'Expense', 'Cost of roofing underlayment'),
('5040', 'Materials - Flashing', 'Expense', 'Cost of flashing materials'),
('5050', 'Materials - Fasteners', 'Expense', 'Cost of nails, screws, and fasteners'),
('5100', 'Subcontractor Costs', 'Expense', 'Payments to subcontractors'),
('5200', 'Direct Labor', 'Expense', 'Wages for roofing crew'),
('5300', 'Equipment Rental', 'Expense', 'Rental of specialized roofing equipment'),

-- OPERATING EXPENSES
('6000', 'Advertising & Marketing', 'Expense', 'Costs for advertising and promotion'),
('6100', 'Vehicle Expenses', 'Expense', 'Fuel, maintenance, and repairs for vehicles'),
('6200', 'Insurance - General Liability', 'Expense', 'General liability insurance premiums'),
('6210', 'Insurance - Workers Compensation', 'Expense', 'Workers compensation insurance'),
('6220', 'Insurance - Vehicle', 'Expense', 'Vehicle insurance premiums'),
('6300', 'Licenses & Permits', 'Expense', 'Business licenses and permit fees'),
('6400', 'Office Supplies', 'Expense', 'Office supplies and materials'),
('6500', 'Professional Fees', 'Expense', 'Accounting, legal, and consulting fees'),
('6600', 'Rent - Office', 'Expense', 'Office or warehouse rent'),
('6700', 'Telephone & Internet', 'Expense', 'Phone and internet services'),
('6800', 'Utilities', 'Expense', 'Electricity, water, and other utilities'),
('6900', 'Equipment Maintenance', 'Expense', 'Maintenance and repairs for equipment'),
('7000', 'Training & Education', 'Expense', 'Employee training and certification costs'),
('7100', 'Depreciation Expense', 'Expense', 'Depreciation on assets'),
('7200', 'Bad Debt Expense', 'Expense', 'Write-offs of uncollectible accounts'),
('7300', 'Bank Fees', 'Expense', 'Banking and credit card processing fees'),
('7400', 'Interest Expense', 'Expense', 'Interest on loans and credit cards');

-- Insert sample customers
INSERT INTO customers (customer_name, customer_type, contact_first_name, contact_last_name, email, phone, address_line1, city, state, zip_code, insurance_company, notes) VALUES
('Johnson Family Residence', 'Residential', 'Mike', 'Johnson', 'mjohnson@email.com', '321-555-0101', '123 Oak Street', 'Cocoa', 'FL', '32926', NULL, 'Repeat customer - very satisfied with previous work'),
('Smith Commercial Properties', 'Commercial', 'Sarah', 'Smith', 'sarah@smithcommercial.com', '321-555-0102', '456 Business Blvd', 'Melbourne', 'FL', '32901', NULL, 'Large commercial property management company'),
('Davis Insurance Claim', 'Insurance', 'Robert', 'Davis', 'rdavis@email.com', '321-555-0103', '789 Palm Avenue', 'Titusville', 'FL', '32780', 'State Farm Insurance', 'Hurricane damage claim - expedite work'),
('Martinez Residence', 'Residential', 'Carlos', 'Martinez', 'cmartinez@email.com', '321-555-0104', '321 Riverside Drive', 'Rockledge', 'FL', '32955', NULL, 'New construction - tile roof'),
('ABC Manufacturing', 'Commercial', 'Jennifer', 'Williams', 'jwilliams@abcmfg.com', '321-555-0105', '1000 Industrial Way', 'Cape Canaveral', 'FL', '32920', NULL, 'Metal roof replacement needed');

-- Insert sample vendors
INSERT INTO vendors (vendor_name, vendor_type, contact_name, email, phone, address_line1, city, state, zip_code, payment_terms, is_1099_vendor) VALUES
('ABC Roofing Supply', 'Material Supplier', 'Tom Anderson', 'tom@abcroofing.com', '321-555-1001', '500 Supply Street', 'Melbourne', 'FL', '32901', 'Net 30', FALSE),
('Quality Shingles Inc', 'Material Supplier', 'Lisa Chen', 'lisa@qualityshingles.com', '321-555-1002', '200 Material Blvd', 'Orlando', 'FL', '32801', 'Net 15', FALSE),
('Metal Roof Pros', 'Material Supplier', 'David Kim', 'david@metalroofpros.com', '321-555-1003', '300 Metal Way', 'Tampa', 'FL', '33601', 'COD', FALSE),
('Elite Subcontractors', 'Subcontractor', 'Maria Rodriguez', 'maria@elitesubs.com', '321-555-1004', '150 Contractor Lane', 'Cocoa', 'FL', '32926', 'Net 15', TRUE),
('Premium Equipment Rental', 'Service Provider', 'John White', 'john@premiumequip.com', '321-555-1005', '400 Equipment Dr', 'Melbourne', 'FL', '32901', 'Net 30', FALSE);

-- Insert sample materials
INSERT INTO materials (material_code, material_name, category, unit_of_measure, unit_cost, current_stock, minimum_stock, preferred_vendor_id) VALUES
('SH001', 'Architectural Shingles - Charcoal', 'Shingles', 'Bundle', 89.50, 150, 50, 1),
('SH002', 'Architectural Shingles - Weathered Wood', 'Shingles', 'Bundle', 89.50, 120, 50, 1),
('UL001', 'Synthetic Underlayment', 'Underlayment', 'Roll', 145.00, 25, 10, 1),
('FL001', 'Step Flashing - Aluminum', 'Flashing', 'LF', 2.75, 500, 100, 1),
('FL002', 'Drip Edge - White', 'Flashing', 'LF', 1.95, 300, 100, 1),
('FA001', 'Roofing Nails - 1.25 inch', 'Fasteners', 'Box', 18.50, 40, 15, 1),
('MR001', 'Standing Seam Metal - Charcoal', 'Metal Roofing', 'SQ', 850.00, 15, 5, 3),
('TL001', 'Spanish Tile - Terra Cotta', 'Tile', 'SQ', 450.00, 8, 3, 2);

-- Insert sample jobs
INSERT INTO jobs (job_number, customer_id, job_name, job_type, roof_type, job_status, estimated_start_date, contract_amount, estimated_cost, square_footage, property_address, permit_required) VALUES
('JOB-2024-001', 1, 'Johnson Residence Re-Roof', 'Re-Roof', 'Shingle', 'In Progress', '2024-01-15', 12500.00, 8750.00, 28, '123 Oak Street, Cocoa, FL', TRUE),
('JOB-2024-002', 2, 'Smith Commercial Repair', 'Repair', 'Metal', 'Completed', '2024-01-08', 8500.00, 5950.00, 15, '456 Business Blvd, Melbourne, FL', FALSE),
('JOB-2024-003', 3, 'Davis Insurance Claim', 'Re-Roof', 'Shingle', 'Approved', '2024-01-20', 18750.00, 13125.00, 42, '789 Palm Avenue, Titusville, FL', TRUE),
('JOB-2024-004', 4, 'Martinez New Construction', 'New Construction', 'Tile', 'Estimate', '2024-02-01', 25000.00, 17500.00, 35, '321 Riverside Drive, Rockledge, FL', TRUE),
('JOB-2024-005', 5, 'ABC Manufacturing Roof', 'Re-Roof', 'Metal', 'Approved', '2024-01-25', 45000.00, 31500.00, 120, '1000 Industrial Way, Cape Canaveral, FL', TRUE);

-- Insert sample employees
INSERT INTO employees (employee_number, first_name, last_name, position, hourly_rate, hire_date, phone, email) VALUES
('EMP001', 'Carlos', 'Rodriguez', 'Lead Roofer', 28.50, '2022-03-15', '321-555-2001', 'carlos@floridafirstroofing.com'),
('EMP002', 'James', 'Wilson', 'Roofer', 22.00, '2023-01-10', '321-555-2002', 'james@floridafirstroofing.com'),
('EMP003', 'Michael', 'Brown', 'Roofer', 20.00, '2023-06-01', '321-555-2003', 'michael@floridafirstroofing.com'),
('EMP004', 'David', 'Garcia', 'Equipment Operator', 25.00, '2022-08-20', '321-555-2004', 'david@floridafirstroofing.com');

-- Insert sample job costs
INSERT INTO job_costs (job_id, cost_type, vendor_id, description, quantity, unit_cost, total_cost, cost_date, is_billable) VALUES
(1, 'Materials', 1, 'Architectural Shingles - 30 bundles', 30, 89.50, 2685.00, '2024-01-15', TRUE),
(1, 'Materials', 1, 'Synthetic Underlayment - 3 rolls', 3, 145.00, 435.00, '2024-01-15', TRUE),
(1, 'Materials', 1, 'Flashing and accessories', 1, 285.50, 285.50, '2024-01-15', TRUE),
(1, 'Labor', NULL, 'Roofing crew - Day 1', 32, 24.00, 768.00, '2024-01-15', TRUE),
(2, 'Materials', 3, 'Metal roofing patches', 1, 425.00, 425.00, '2024-01-08', TRUE),
(2, 'Labor', NULL, 'Repair work - 16 hours', 16, 26.00, 416.00, '2024-01-08', TRUE);

-- Insert sample invoices
INSERT INTO invoices (invoice_number, customer_id, job_id, invoice_date, due_date, subtotal, tax_amount, total_amount, payment_terms) VALUES
('INV-2024-001', 2, 2, '2024-01-10', '2024-02-09', 8500.00, 595.00, 9095.00, 'Net 30'),
('INV-2024-002', 1, 1, '2024-01-20', '2024-02-19', 6250.00, 437.50, 6687.50, 'Net 30');

-- Insert invoice line items
INSERT INTO invoice_lines (invoice_id, description, quantity, unit_price, line_total) VALUES
(1, 'Commercial roof repair - leak remediation', 1, 8500.00, 8500.00),
(2, 'Roofing work - Progress payment 50%', 1, 6250.00, 6250.00);

-- Insert sample time entries
INSERT INTO time_entries (employee_id, job_id, work_date, total_hours, hourly_rate, total_cost, work_description, is_billable) VALUES
(1, 1, '2024-01-15', 8.0, 28.50, 228.00, 'Lead crew for Johnson re-roof project', TRUE),
(2, 1, '2024-01-15', 8.0, 22.00, 176.00, 'Roofing work on Johnson project', TRUE),
(3, 1, '2024-01-15', 8.0, 20.00, 160.00, 'Roofing assistance on Johnson project', TRUE),
(1, 2, '2024-01-08', 6.0, 28.50, 171.00, 'Commercial repair at Smith Properties', TRUE),
(2, 2, '2024-01-08', 6.0, 22.00, 132.00, 'Assisted with commercial repair', TRUE);

-- Insert sample transactions for basic bookkeeping
INSERT INTO transactions (transaction_date, transaction_type, reference_number, description, customer_id, total_amount) VALUES
('2024-01-10', 'Invoice', 'INV-2024-001', 'Smith Commercial Properties - Roof Repair', 2, 9095.00),
('2024-01-15', 'Purchase', 'PO-001', 'Materials from ABC Roofing Supply', NULL, 3405.50),
('2024-01-20', 'Invoice', 'INV-2024-002', 'Johnson Residence - Progress Payment', 1, 6687.50);

-- Insert corresponding transaction lines (double-entry)
-- Invoice to Smith Commercial
INSERT INTO transaction_lines (transaction_id, account_id, description, debit_amount, credit_amount, job_id) VALUES
(1, (SELECT id FROM chart_of_accounts WHERE account_code = '1100'), 'Accounts Receivable - Smith Commercial', 9095.00, 0.00, 2),
(1, (SELECT id FROM chart_of_accounts WHERE account_code = '4000'), 'Roofing Services Revenue', 0.00, 8500.00, 2),
(1, (SELECT id FROM chart_of_accounts WHERE account_code = '2300'), 'Florida Sales Tax Payable', 0.00, 595.00, 2);

-- Purchase from ABC Roofing Supply
INSERT INTO transaction_lines (transaction_id, account_id, description, debit_amount, credit_amount, job_id) VALUES
(2, (SELECT id FROM chart_of_accounts WHERE account_code = '1200'), 'Materials Inventory', 3405.50, 0.00, 1),
(2, (SELECT id FROM chart_of_accounts WHERE account_code = '2000'), 'Accounts Payable - ABC Roofing', 0.00, 3405.50, 1);

-- Invoice to Johnson
INSERT INTO transaction_lines (transaction_id, account_id, description, debit_amount, credit_amount, job_id) VALUES
(3, (SELECT id FROM chart_of_accounts WHERE account_code = '1100'), 'Accounts Receivable - Johnson', 6687.50, 0.00, 1),
(3, (SELECT id FROM chart_of_accounts WHERE account_code = '4000'), 'Roofing Services Revenue', 0.00, 6250.00, 1),
(3, (SELECT id FROM chart_of_accounts WHERE account_code = '2300'), 'Florida Sales Tax Payable', 0.00, 437.50, 1);