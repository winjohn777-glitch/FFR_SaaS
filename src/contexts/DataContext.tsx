import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer, Lead, Opportunity } from '../types/crm';
import { InventoryItem } from '../types/inventory';
import crmData from '../data/crmData.json';
import CustomerReviewService from '../services/CustomerReviewService';

// Sample inventory items for initial data
const sampleInventory: InventoryItem[] = [
  {
    id: '1',
    sku: 'SHG-GAF-HDZ-001',
    name: 'GAF HDZ Shingles - Charcoal',
    category: 'Shingles',
    description: 'High Definition architectural shingles with enhanced granule adhesion',
    currentStock: 50,
    reorderPoint: 20,
    reorderQuantity: 100,
    unit: 'Bundle',
    unitCost: 45.00,
    supplier: 'ABC Roofing Supply',
    supplierSku: 'GAF-HDZ-CHAR',
    location: 'Warehouse A - Bay 3',
    lastOrderDate: '2024-01-15',
    lastStockUpdate: '2024-01-20',
    status: 'In Stock',
    requiresPpe: false,
    requiredPpe: [],
    storageInstructions: 'Store in dry, covered area. Stack no more than 15 bundles high.',
    handlingPrecautions: 'Use proper lifting techniques. Each bundle weighs approximately 75 lbs.',
    hazardousWaste: false,
    qualityGrade: 'Premium',
    warrantyPeriod: '50 years'
  },
  {
    id: '2',
    sku: 'UND-SYNTH-001',
    name: 'Synthetic Underlayment Roll',
    category: 'Underlayment',
    description: 'Waterproof synthetic roofing underlayment, 10 sq per roll',
    currentStock: 15,
    reorderPoint: 10,
    reorderQuantity: 50,
    unit: 'Roll',
    unitCost: 120.00,
    supplier: 'ABC Roofing Supply',
    supplierSku: 'SYNTH-UND-10SQ',
    location: 'Warehouse A - Bay 1',
    lastOrderDate: '2024-01-10',
    lastStockUpdate: '2024-01-22',
    status: 'In Stock',
    requiresPpe: false,
    requiredPpe: [],
    storageInstructions: 'Store flat or on end in dry area. Keep out of direct sunlight.',
    handlingPrecautions: 'Handle with care to avoid tearing. Use sharp utility knife for cutting.',
    hazardousWaste: false,
    qualityGrade: 'Premium',
    warrantyPeriod: '30 years'
  },
  {
    id: '3',
    sku: 'FLASH-ALU-001',
    name: 'Aluminum Flashing 10" x 50ft',
    category: 'Flashing',
    description: 'Aluminum step flashing roll, 0.019" thickness',
    currentStock: 8,
    reorderPoint: 5,
    reorderQuantity: 25,
    unit: 'Roll',
    unitCost: 85.00,
    supplier: 'Metal Works Inc',
    supplierSku: 'ALU-FLASH-10-50',
    location: 'Warehouse B - Rack 2',
    lastOrderDate: '2024-01-12',
    lastStockUpdate: '2024-01-21',
    status: 'Low Stock',
    requiresPpe: true,
    requiredPpe: [
      { type: 'Gloves', specification: 'Cut-resistant gloves', required: true },
      { type: 'Eye Protection', specification: 'Safety glasses', required: true }
    ],
    storageInstructions: 'Store in dry location. Keep away from acids and corrosive materials.',
    handlingPrecautions: 'Sharp edges - wear cut-resistant gloves. Use proper shears for cutting.',
    hazardousWaste: false,
    recyclingInstructions: 'Aluminum is fully recyclable. Collect scraps for recycling.',
    qualityGrade: 'Premium'
  }
];

// Sample invoice data
const sampleInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    customerName: 'Johnson Family Residence',
    customerAddress: '123 Oak Street, Cocoa, FL 32926',
    jobName: 'Complete Roof Replacement',
    amount: 12500.00,
    dueDate: '2024-02-15',
    status: 'sent',
    issueDate: '2024-01-15',
    paymentTerms: 'Net 30',
    lineItems: [
      { id: '1', description: 'Architectural Shingles - Complete Roof Replacement', quantity: 28, rate: 350.00, amount: 9800.00 },
      { id: '2', description: 'Underlayment and Flashing', quantity: 1, rate: 1200.00, amount: 1200.00 },
      { id: '3', description: 'Labor and Installation', quantity: 1, rate: 1500.00, amount: 1500.00 }
    ],
    notes: 'Includes 5-year workmanship warranty. Materials warranty per manufacturer.'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    customerName: 'Smith Commercial Properties',
    customerAddress: '456 Business Blvd, Melbourne, FL 32901',
    jobName: 'Emergency Roof Repair',
    amount: 8500.00,
    dueDate: '2024-02-10',
    status: 'paid',
    issueDate: '2024-01-10',
    paymentTerms: 'Net 15',
    lineItems: [
      { id: '1', description: 'Emergency Leak Repair - Commercial Building', quantity: 1, rate: 8500.00, amount: 8500.00 }
    ]
  }
];

// Sample transaction data for bookkeeping
const sampleTransactions: Transaction[] = [
  {
    id: 1,
    transaction_date: '2024-01-15',
    description: 'Johnson Residence - Shingle Installation',
    reference: 'JE-001',
    total_amount: 15000,
    transaction_type: 'Journal Entry'
  },
  {
    id: 2,
    transaction_date: '2024-01-20',
    description: 'Material Purchase - ABC Supply',
    reference: 'JE-002',
    total_amount: 5500,
    transaction_type: 'Journal Entry'
  },
  {
    id: 3,
    transaction_date: '2024-01-25',
    description: 'Labor Payment - Week 3',
    reference: 'JE-003',
    total_amount: 3200,
    transaction_type: 'Journal Entry'
  }
];

// Sample Chart of Accounts
const sampleAccounts: Account[] = [
  // Assets
  { code: '1010', name: 'Checking Account - Operating', type: 'Asset', category: 'Current Assets', description: 'Primary business checking account', is_active: true, balance: 45000 },
  { code: '1020', name: 'Checking Account - Payroll', type: 'Asset', category: 'Current Assets', description: 'Dedicated payroll account', is_active: true, balance: 12000 },
  { code: '1100', name: 'Accounts Receivable', type: 'Asset', category: 'Current Assets', description: 'Customer invoices pending payment', is_active: true, balance: 28500 },
  { code: '1200', name: 'Job Materials Inventory', type: 'Asset', category: 'Current Assets', description: 'Roofing materials on hand', is_active: true, balance: 15000 },
  { code: '1500', name: 'Equipment', type: 'Asset', category: 'Fixed Assets', description: 'Roofing equipment and tools', is_active: true, balance: 35000 },
  { code: '1600', name: 'Vehicles', type: 'Asset', category: 'Fixed Assets', description: 'Company trucks and vehicles', is_active: true, balance: 85000 },

  // Liabilities
  { code: '2010', name: 'Accounts Payable', type: 'Liability', category: 'Current Liabilities', description: 'Amounts owed to suppliers', is_active: true, balance: 12000 },
  { code: '2020', name: 'Payroll Liabilities', type: 'Liability', category: 'Current Liabilities', description: 'Payroll taxes and withholdings', is_active: true, balance: 5500 },
  { code: '2100', name: 'Vehicle Loan', type: 'Liability', category: 'Long-term Liabilities', description: 'Truck financing', is_active: true, balance: 45000 },

  // Equity
  { code: '3010', name: 'Owner\'s Equity', type: 'Equity', category: 'Equity', description: 'Owner\'s capital investment', is_active: true, balance: 100000 },
  { code: '3020', name: 'Retained Earnings', type: 'Equity', category: 'Equity', description: 'Accumulated profits', is_active: true, balance: 48000 },

  // Revenue
  { code: '4010', name: 'Roofing Services Revenue', type: 'Revenue', category: 'Operating Revenue', description: 'Revenue from roofing installations', is_active: true, balance: 0 },
  { code: '4020', name: 'Repair Services Revenue', type: 'Revenue', category: 'Operating Revenue', description: 'Revenue from roof repairs', is_active: true, balance: 0 },
  { code: '4030', name: 'Inspection Services Revenue', type: 'Revenue', category: 'Operating Revenue', description: 'Revenue from roof inspections', is_active: true, balance: 0 },

  // Expenses
  { code: '5010', name: 'Cost of Materials', type: 'Expense', category: 'Cost of Goods Sold', description: 'Direct material costs', is_active: true, balance: 0 },
  { code: '5020', name: 'Direct Labor', type: 'Expense', category: 'Cost of Goods Sold', description: 'Installation crew wages', is_active: true, balance: 0 },
  { code: '6010', name: 'Office Rent', type: 'Expense', category: 'Operating Expenses', description: 'Monthly office rent', is_active: true, balance: 0 },
  { code: '6020', name: 'Utilities', type: 'Expense', category: 'Operating Expenses', description: 'Electric, water, internet', is_active: true, balance: 0 },
  { code: '6030', name: 'Insurance - General Liability', type: 'Expense', category: 'Operating Expenses', description: 'Business liability insurance', is_active: true, balance: 0 },
  { code: '6040', name: 'Vehicle Fuel', type: 'Expense', category: 'Operating Expenses', description: 'Fuel for company vehicles', is_active: true, balance: 0 },
  { code: '6050', name: 'Marketing & Advertising', type: 'Expense', category: 'Operating Expenses', description: 'Marketing expenses', is_active: true, balance: 0 }
];

// Sample Journal Entries with proper debits and credits
const sampleJournalEntries: JournalEntry[] = [
  {
    id: 'JE-001',
    entry_number: 'JE-2024-001',
    date: '2024-01-15',
    description: 'Johnson Residence - Shingle Installation Revenue Recognition',
    reference: 'INV-2024-001',
    status: 'posted',
    created_date: '2024-01-15',
    posted_date: '2024-01-15',
    lines: [
      {
        id: 'JE-001-L1',
        account_id: '1100',
        account_name: 'Accounts Receivable',
        account_code: '1100',
        debit_amount: 15000,
        credit_amount: 0,
        description: 'Invoice for roofing services'
      },
      {
        id: 'JE-001-L2',
        account_id: '4010',
        account_name: 'Roofing Services Revenue',
        account_code: '4010',
        debit_amount: 0,
        credit_amount: 15000,
        description: 'Revenue from Johnson residence project'
      }
    ]
  },
  {
    id: 'JE-002',
    entry_number: 'JE-2024-002',
    date: '2024-01-20',
    description: 'Material Purchase - ABC Supply',
    reference: 'PO-2024-015',
    status: 'posted',
    created_date: '2024-01-20',
    posted_date: '2024-01-20',
    lines: [
      {
        id: 'JE-002-L1',
        account_id: '1200',
        account_name: 'Job Materials Inventory',
        account_code: '1200',
        debit_amount: 5500,
        credit_amount: 0,
        description: 'Shingles and underlayment purchased'
      },
      {
        id: 'JE-002-L2',
        account_id: '2010',
        account_name: 'Accounts Payable',
        account_code: '2010',
        debit_amount: 0,
        credit_amount: 5500,
        description: 'ABC Supply invoice #12345'
      }
    ]
  },
  {
    id: 'JE-003',
    entry_number: 'JE-2024-003',
    date: '2024-01-25',
    description: 'Labor Payment - Week 3',
    reference: 'PAYROLL-2024-W3',
    status: 'posted',
    created_date: '2024-01-25',
    posted_date: '2024-01-25',
    lines: [
      {
        id: 'JE-003-L1',
        account_id: '5020',
        account_name: 'Direct Labor',
        account_code: '5020',
        debit_amount: 3200,
        credit_amount: 0,
        description: 'Crew wages for week 3'
      },
      {
        id: 'JE-003-L2',
        account_id: '1010',
        account_name: 'Checking Account - Operating',
        account_code: '1010',
        debit_amount: 0,
        credit_amount: 3200,
        description: 'Payment via check #1234'
      }
    ]
  }
];

// Sample projects data from Project Management (to be converted to Jobs)
const sampleProjects = [
  {
    id: '1',
    name: 'Residential Roof Replacement',
    client: 'Johnson Family',
    address: '123 Oak Street, Orlando, FL',
    status: 'in-progress' as const,
    priority: 'high' as const,
    startDate: '2024-01-15',
    endDate: '2024-02-01',
    budget: 15000,
    spent: 8500,
    progress: 65,
    crew: ['John Smith', 'Mike Rodriguez'],
    permits: ['Building Permit #2024-001'],
    roofType: 'shingle' as const,
    squareFootage: 2400
  },
  {
    id: '2',
    name: 'Commercial Metal Roof',
    client: 'ABC Manufacturing',
    address: '456 Industrial Blvd, Tampa, FL',
    status: 'planning' as const,
    priority: 'urgent' as const,
    startDate: '2024-02-05',
    endDate: '2024-03-15',
    budget: 75000,
    spent: 2000,
    progress: 15,
    crew: ['Carlos Martinez', 'David Wilson'],
    permits: ['Commercial Permit #2024-010'],
    roofType: 'metal' as const,
    squareFootage: 12000
  },
  {
    id: '3',
    name: 'Tile Roof Repair',
    client: 'Historic Downtown Property',
    address: '789 Heritage Lane, St. Augustine, FL',
    status: 'inspection' as const,
    priority: 'medium' as const,
    startDate: '2024-01-20',
    endDate: '2024-01-28',
    budget: 8500,
    spent: 7200,
    progress: 90,
    crew: ['Sarah Thompson'],
    permits: ['Historical Permit #2024-005'],
    roofType: 'tile' as const,
    squareFootage: 1800
  }
];

// Sample employee data from HR Employee Directory
const sampleEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'Miguel',
    lastName: 'Rodriguez',
    role: 'Lead Roofer',
    department: 'Operations',
    email: 'miguel.rodriguez@floridafirstroofing.com',
    phone: '321-555-0101',
    address: '123 Orange Ave, Melbourne, FL 32901',
    hireDate: '2023-01-15',
    employeeId: 'FFR001',
    status: 'active',
    payRate: 28.50,
    timeTracking: {
      hoursThisWeek: 42,
      overtime: 2
    },
    certifications: [
      {
        name: 'OSHA 1926 Fall Protection',
        type: 'OSHA',
        issueDate: '2023-12-01',
        expirationDate: '2024-12-01',
        status: 'valid',
        certificateNumber: 'OSHA-FP-2023-001'
      },
      {
        name: 'FL Roofing License',
        type: 'State License',
        issueDate: '2023-06-15',
        expirationDate: '2025-06-15',
        status: 'valid',
        certificateNumber: 'FL-ROOF-2023-001'
      }
    ]
  },
  {
    id: '2',
    firstName: 'James',
    lastName: 'Thompson',
    role: 'Safety Coordinator',
    department: 'Safety',
    email: 'james.thompson@floridafirstroofing.com',
    phone: '321-555-0102',
    address: '456 Pine St, Cocoa, FL 32926',
    hireDate: '2022-08-20',
    employeeId: 'FFR002',
    status: 'active',
    payRate: 32.00,
    timeTracking: {
      hoursThisWeek: 40,
      overtime: 0
    },
    certifications: [
      {
        name: 'OSHA 1926 Competent Person',
        type: 'OSHA',
        issueDate: '2023-03-10',
        expirationDate: '2025-03-10',
        status: 'valid',
        certificateNumber: 'OSHA-CP-2023-002'
      },
      {
        name: 'First Aid/CPR',
        type: 'Safety Training',
        issueDate: '2023-11-01',
        expirationDate: '2024-11-01',
        status: 'valid',
        certificateNumber: 'FA-CPR-2023-002'
      }
    ]
  },
  {
    id: '3',
    firstName: 'Sarah',
    lastName: 'Martinez',
    role: 'Administrative Assistant',
    department: 'Administration',
    email: 'sarah.martinez@floridafirstroofing.com',
    phone: '321-555-0103',
    address: '789 Oak Dr, Titusville, FL 32780',
    hireDate: '2023-03-01',
    employeeId: 'FFR003',
    status: 'active',
    payRate: 22.00,
    timeTracking: {
      hoursThisWeek: 40,
      overtime: 0
    },
    certifications: []
  },
  {
    id: '4',
    firstName: 'Carlos',
    lastName: 'Garcia',
    role: 'Roofer',
    department: 'Operations',
    email: 'carlos.garcia@floridafirstroofing.com',
    phone: '321-555-0104',
    address: '321 Palm Way, Cocoa Beach, FL 32931',
    hireDate: '2023-06-15',
    employeeId: 'FFR004',
    status: 'active',
    payRate: 24.00,
    timeTracking: {
      hoursThisWeek: 45,
      overtime: 5
    },
    certifications: [
      {
        name: 'OSHA 1926 Fall Protection',
        type: 'OSHA',
        issueDate: '2023-09-15',
        expirationDate: '2024-09-15',
        status: 'valid',
        certificateNumber: 'OSHA-FP-2023-004'
      }
    ]
  },
  {
    id: '5',
    firstName: 'David',
    lastName: 'Wilson',
    role: 'Project Manager',
    department: 'Management',
    email: 'david.wilson@floridafirstroofing.com',
    phone: '321-555-0105',
    address: '654 Beach Blvd, Melbourne, FL 32901',
    hireDate: '2021-05-01',
    employeeId: 'FFR005',
    status: 'active',
    payRate: 45.00,
    timeTracking: {
      hoursThisWeek: 42,
      overtime: 2
    },
    certifications: [
      {
        name: 'Project Management Professional',
        type: 'Technical',
        issueDate: '2021-08-01',
        expirationDate: '2024-08-01',
        status: 'valid',
        certificateNumber: 'PMP-2021-005'
      },
      {
        name: 'FL Roofing Contractor License',
        type: 'State License',
        issueDate: '2021-06-01',
        expirationDate: '2025-06-01',
        status: 'valid',
        certificateNumber: 'FL-CONT-2021-005'
      }
    ]
  }
];

interface Job {
  id: string;
  jobCode: string;
  name: string;
  customer: string;
  projectType: string;
  type: string;
  startDate: string;
  estimatedValue: number;
  actualCosts: number;
  status: string;
  progress: number;
  profitMargin: number;
  laborCosts?: number;
  materialCosts?: number;
  equipmentCosts?: number;
  description?: string;
  // Finance-related properties
  pricing?: {
    materials: number;
    labor: number;
    permit: number;
    total: number;
  };
  financing?: {
    applicantName: string;
    monthlyPayment: string;
    loanAmount: string;
    totalPayments: string;
    totalInterest: string;
    interestRate: string;
    numberOfPayments: number;
    applicationStatus?: string;
    submittedDate?: string;
    [key: string]: any;
  };
  financeContractData?: any;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerAddress: string;
  customerPhone?: string;
  customerEmail?: string;
  jobName: string;
  amount: number;
  dueDate: string;
  issueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  paymentTerms: string;
  lineItems: {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  notes?: string;
  customFields?: Record<string, any>;
}

interface Transaction {
  id: number;
  transaction_date: string;
  description: string;
  reference: string;
  total_amount: number;
  transaction_type: string;
}

// Proper double-entry journal entry interface
interface JournalEntryLine {
  id: string;
  account_id: string;
  account_name: string;
  account_code: string;
  debit_amount: number;
  credit_amount: number;
  description: string;
}

interface JournalEntry {
  id: string;
  entry_number: string;
  date: string;
  description: string;
  reference: string;
  lines: JournalEntryLine[];
  status: 'draft' | 'posted' | 'void';
  created_by?: string;
  created_date?: string;
  posted_date?: string;
  notes?: string;
}

// Employee interfaces
interface Certification {
  name: string;
  type: 'OSHA' | 'State License' | 'Safety Training' | 'Technical';
  issueDate: string;
  expirationDate: string;
  status: 'valid' | 'expiring' | 'expired';
  certificateNumber: string;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  address: string;
  hireDate: string;
  employeeId: string;
  status: 'active' | 'inactive' | 'terminated';
  certifications: Certification[];
  payRate: number;
  timeTracking: {
    hoursThisWeek: number;
    overtime: number;
  };
}

// Chart of Accounts interface
interface Account {
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  category: string;
  subcategory?: string;
  description: string;
  parent_account?: string;
  is_active: boolean;
  balance?: number;
}

interface DataContextType {
  // Customer data
  customers: Customer[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;

  // Lead data
  leads: Lead[];
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;

  // Opportunity data
  opportunities: Opportunity[];
  addOpportunity: (opportunity: Opportunity) => void;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;

  // Job data
  jobs: Job[];
  addJob: (job: Job) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;

  // Inventory data
  inventoryItems: InventoryItem[];
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;

  // Invoice data
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;

  // Bookkeeping/Transaction data
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: number, updates: Partial<Transaction>) => void;

  // Journal Entry data (proper double-entry accounting)
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: JournalEntry) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;
  postJournalEntry: (id: string) => void;
  voidJournalEntry: (id: string) => void;

  // Chart of Accounts data
  accounts: Account[];
  addAccount: (account: Account) => void;
  updateAccount: (code: string, updates: Partial<Account>) => void;
  deleteAccount: (code: string) => void;
  getAccountByCode: (code: string) => Account | undefined;

  // Employee data
  employees: Employee[];
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Sync functions
  syncData: () => void;
}

// Function to convert Project Management projects to Job format
const convertProjectsToJobs = (projects: typeof sampleProjects): Job[] => {
  return projects.map(project => {
    // Generate job code based on project type and ID
    const typePrefix = project.roofType === 'shingle' ? 'RR' :
                      project.roofType === 'metal' ? 'CM' :
                      project.roofType === 'tile' ? 'TR' : 'RF';

    // Convert project status to job status
    const statusMap: Record<string, string> = {
      'planning': 'pending',
      'in-progress': 'active',
      'inspection': 'active',
      'completed': 'completed',
      'on-hold': 'pending'
    };

    // Estimate labor/material/equipment costs based on budget
    const laborCosts = Math.round(project.budget * 0.35); // 35% for labor
    const materialCosts = Math.round(project.budget * 0.50); // 50% for materials
    const equipmentCosts = Math.round(project.budget * 0.15); // 15% for equipment

    return {
      id: `JOB-${project.id.padStart(3, '0')}`,
      jobCode: `${typePrefix}-2024-${project.id.padStart(3, '0')}`,
      name: project.name,
      customer: project.client,
      projectType: project.roofType === 'shingle' ? 'Re-Roof' :
                  project.roofType === 'metal' ? 'Commercial' :
                  project.roofType === 'tile' ? 'Repair' : 'Maintenance',
      type: project.roofType === 'metal' ? 'Commercial' : 'Residential Re-roof',
      startDate: project.startDate,
      estimatedValue: project.budget,
      actualCosts: project.spent,
      status: statusMap[project.status] || 'pending',
      progress: project.progress,
      profitMargin: project.budget > 0 ? ((project.budget - project.spent) / project.budget) * 100 : 0,
      laborCosts,
      materialCosts,
      equipmentCosts,
      description: `${project.roofType} roofing project for ${project.client} at ${project.address}. Square footage: ${project.squareFootage}sq ft.`
    };
  });
};

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // Initialize with data from localStorage or fallback to default data
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const savedCustomers = localStorage.getItem('ffr-customers');
      if (savedCustomers) {
        return JSON.parse(savedCustomers);
      }
    } catch (error) {
      console.warn('Failed to load customers from localStorage:', error);
    }
    return crmData.customers as Customer[];
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const savedLeads = localStorage.getItem('ffr-leads');
      if (savedLeads) {
        return JSON.parse(savedLeads);
      }
    } catch (error) {
      console.warn('Failed to load leads from localStorage:', error);
    }
    return crmData.leads as Lead[];
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    try {
      const savedOpportunities = localStorage.getItem('ffr-opportunities');
      if (savedOpportunities) {
        return JSON.parse(savedOpportunities);
      }
    } catch (error) {
      console.warn('Failed to load opportunities from localStorage:', error);
    }
    return crmData.opportunities as Opportunity[];
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const savedJobs = localStorage.getItem('ffr-jobs');
      if (savedJobs) {
        return JSON.parse(savedJobs);
      }
    } catch (error) {
      console.warn('Failed to load jobs from localStorage:', error);
    }
    // Initialize with converted project data from Project Management
    return convertProjectsToJobs(sampleProjects);
  });

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => {
    try {
      const savedInventory = localStorage.getItem('ffr-inventory');
      if (savedInventory) {
        return JSON.parse(savedInventory);
      }
    } catch (error) {
      console.warn('Failed to load inventory from localStorage:', error);
    }
    return sampleInventory;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const savedInvoices = localStorage.getItem('ffr-invoices');
      if (savedInvoices) {
        return JSON.parse(savedInvoices);
      }
    } catch (error) {
      console.warn('Failed to load invoices from localStorage:', error);
    }
    return sampleInvoices;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const savedTransactions = localStorage.getItem('ffr-transactions');
      if (savedTransactions) {
        return JSON.parse(savedTransactions);
      }
    } catch (error) {
      console.warn('Failed to load transactions from localStorage:', error);
    }
    return sampleTransactions;
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const savedEntries = localStorage.getItem('ffr-journal-entries');
      if (savedEntries) {
        return JSON.parse(savedEntries);
      }
    } catch (error) {
      console.warn('Failed to load journal entries from localStorage:', error);
    }
    return sampleJournalEntries;
  });

  const [accounts, setAccounts] = useState<Account[]>(() => {
    try {
      const savedAccounts = localStorage.getItem('ffr-accounts');
      if (savedAccounts) {
        return JSON.parse(savedAccounts);
      }
    } catch (error) {
      console.warn('Failed to load accounts from localStorage:', error);
    }
    return sampleAccounts;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const savedEmployees = localStorage.getItem('ffr-employees');
      if (savedEmployees) {
        return JSON.parse(savedEmployees);
      }
    } catch (error) {
      console.warn('Failed to load employees from localStorage:', error);
    }
    return sampleEmployees;
  });

  // Customer management
  const addCustomer = (customer: Customer) => {
    console.log('🏪 DataStore: Adding customer:', customer.firstName, customer.lastName);
    console.log('🏪 DataStore: Customer object:', customer);
    setCustomers(prev => {
      console.log('🏪 DataStore: Previous customers:', prev.length);
      console.log('🏪 DataStore: Previous customer list:', prev.map(c => `${c.firstName} ${c.lastName}`));
      const updated = [...prev, customer];
      console.log('🏪 DataStore: Updated customers:', updated.length);
      console.log('🏪 DataStore: Updated customer list:', updated.map(c => `${c.firstName} ${c.lastName}`));
      // Save to localStorage
      try {
        localStorage.setItem('ffr-customers', JSON.stringify(updated));
        console.log('🏪 DataStore: Customers saved to localStorage');
        console.log('🏪 DataStore: localStorage content:', localStorage.getItem('ffr-customers'));
      } catch (error) {
        console.warn('Failed to save customers to localStorage:', error);
      }
      return updated;
    });
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => {
      const updated = prev.map(customer =>
        customer.id === id ? { ...customer, ...updates } : customer
      );
      // Save to localStorage
      try {
        localStorage.setItem('ffr-customers', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save customers to localStorage:', error);
      }
      return updated;
    });
  };

  // Lead management
  const addLead = (lead: Lead) => {
    console.log('📞 DataStore: Adding lead:', lead.firstName, lead.lastName);
    setLeads(prev => {
      const updated = [...prev, lead];
      try {
        localStorage.setItem('ffr-leads', JSON.stringify(updated));
        console.log('📞 DataStore: Leads saved to localStorage');
      } catch (error) {
        console.warn('Failed to save leads to localStorage:', error);
      }
      return updated;
    });
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => {
      const updated = prev.map(lead =>
        lead.id === id ? { ...lead, ...updates } : lead
      );
      try {
        localStorage.setItem('ffr-leads', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save leads to localStorage:', error);
      }
      return updated;
    });
  };

  const deleteLead = (id: string) => {
    setLeads(prev => {
      const updated = prev.filter(lead => lead.id !== id);
      try {
        localStorage.setItem('ffr-leads', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save leads to localStorage:', error);
      }
      return updated;
    });
  };

  // Opportunity management
  const addOpportunity = (opportunity: Opportunity) => {
    console.log('💼 DataStore: Adding opportunity:', opportunity.name);
    setOpportunities(prev => {
      const updated = [...prev, opportunity];
      try {
        localStorage.setItem('ffr-opportunities', JSON.stringify(updated));
        console.log('💼 DataStore: Opportunities saved to localStorage');
      } catch (error) {
        console.warn('Failed to save opportunities to localStorage:', error);
      }
      return updated;
    });
  };

  const updateOpportunity = (id: string, updates: Partial<Opportunity>) => {
    setOpportunities(prev => {
      const updated = prev.map(opp =>
        opp.id === id ? { ...opp, ...updates } : opp
      );
      try {
        localStorage.setItem('ffr-opportunities', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save opportunities to localStorage:', error);
      }
      return updated;
    });
  };

  const deleteOpportunity = (id: string) => {
    setOpportunities(prev => {
      const updated = prev.filter(opp => opp.id !== id);
      try {
        localStorage.setItem('ffr-opportunities', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save opportunities to localStorage:', error);
      }
      return updated;
    });
  };

  // Job management
  const addJob = (job: Job) => {
    console.log('🏪 DataStore: Adding job:', job.name);
    setJobs(prev => {
      const updated = [...prev, job];
      console.log('🏪 DataStore: Total jobs now:', updated.length);

      // DMS Integration: Auto-generate documents for FFR jobs
      if (job.name.includes('GAF HDZ') || job.customer === 'David Johnson') {
        console.log('🗂️ DMS Integration: Auto-generating documents for FFR proposal/contract workflow');
        generateFFRDocuments(job);
      }

      // Save to localStorage
      try {
        localStorage.setItem('ffr-jobs', JSON.stringify(updated));
        console.log('🏪 DataStore: Jobs saved to localStorage');
      } catch (error) {
        console.warn('Failed to save jobs to localStorage:', error);
      }
      return updated;
    });
  };

  // DMS Integration: Generate FFR proposal and contract documents
  const generateFFRDocuments = (job: Job) => {
    console.log('📋 Generating FFR documents for job:', job.id);

    // Generate proposal document
    const proposalDoc = {
      id: `PROP-${job.id}-${Date.now()}`,
      name: `FFR Proposal - ${job.customer} - ${job.name}.pdf`,
      type: 'pdf',
      size: '1.2 MB',
      category: 'estimates',
      uploadedBy: 'System Generated',
      uploadedDate: new Date().toISOString().split('T')[0],
      tags: ['proposal', 'ffr', 'auto-generated', job.projectType.toLowerCase()],
      description: `Auto-generated FFR proposal for ${job.customer} - ${job.name}. Contract value: $${job.estimatedValue.toLocaleString()}`,
      jobId: job.id,
      customerId: customers.find(c => `${c.firstName} ${c.lastName}` === job.customer)?.id,
      contractStatus: 'draft' as const,
      contractValue: job.estimatedValue,
      priority: 'high' as const
    };

    // Generate contract document
    const contractDoc = {
      id: `CONT-${job.id}-${Date.now()}`,
      name: `FFR Contract - ${job.customer} - ${job.name}.pdf`,
      type: 'pdf',
      size: '2.1 MB',
      category: 'contracts',
      uploadedBy: 'System Generated',
      uploadedDate: new Date().toISOString().split('T')[0],
      tags: ['contract', 'ffr', 'auto-generated', job.projectType.toLowerCase()],
      description: `Auto-generated FFR service contract for ${job.customer}. ${job.description}`,
      jobId: job.id,
      customerId: customers.find(c => `${c.firstName} ${c.lastName}` === job.customer)?.id,
      contractStatus: 'draft' as const,
      contractValue: job.estimatedValue,
      priority: 'high' as const
    };

    // Store documents in localStorage (simulating DMS integration)
    try {
      const existingDocs = JSON.parse(localStorage.getItem('ffr-documents') || '[]');
      const updatedDocs = [...existingDocs, proposalDoc, contractDoc];
      localStorage.setItem('ffr-documents', JSON.stringify(updatedDocs));

      console.log('✅ FFR Documents generated and stored:');
      console.log('📄 Proposal:', proposalDoc.name);
      console.log('📋 Contract:', contractDoc.name);
      console.log('💾 Stored in DMS with auto-workflow routing');

      // Simulate workflow initiation
      console.log('🔄 DMS Workflow initiated:');
      console.log('  1. Legal review scheduled');
      console.log('  2. Client approval pending');
      console.log('  3. E-signature integration ready');
      console.log('  4. Document versioning enabled');

    } catch (error) {
      console.warn('Failed to store FFR documents:', error);
    }
  };

  const updateJob = (id: string, updates: Partial<Job>) => {
    setJobs(prev => {
      const jobIndex = prev.findIndex(job => job.id === id);
      if (jobIndex === -1) return prev;

      const oldJob = prev[jobIndex];
      const updatedJob = { ...oldJob, ...updates };

      // Check if job status changed to 'completed'
      const statusChanged = oldJob.status !== updatedJob.status;
      const isNowCompleted = updatedJob.status.toLowerCase() === 'completed';

      const updated = prev.map(job =>
        job.id === id ? updatedJob : job
      );

      // Trigger customer review request when job is completed
      if (statusChanged && isNowCompleted) {
        console.log('🎯 Job completed! Triggering customer review request for:', updatedJob.name);
        requestCustomerReview(updatedJob);
      }

      // Save to localStorage
      try {
        localStorage.setItem('ffr-jobs', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save jobs to localStorage:', error);
      }
      return updated;
    });
  };

  // Customer Review Integration: Request review when job is completed
  const requestCustomerReview = async (job: Job) => {
    try {
      const reviewService = CustomerReviewService.getInstance();

      // Find the customer associated with this job
      const customer = customers.find(c => `${c.firstName} ${c.lastName}` === job.customer);

      if (!customer) {
        console.warn('📧 Customer not found for review request:', job.customer);
        return;
      }

      console.log('📧 Requesting customer review for completed job:', {
        jobName: job.name,
        customer: job.customer,
        projectType: job.projectType
      });

      // Create review request
      const reviewRequest = await reviewService.requestReview(job.id, job, customer);

      console.log('✅ Customer review request created:', reviewRequest.id);
      console.log('📧 Review request status:', reviewRequest.status);
      console.log('🌐 Google review URL:', reviewRequest.reviewUrl);

      // Log the review request summary
      const summary = reviewService.generateJobCompletionSummary(job.id);
      console.log('📋 Review Summary:', summary);

    } catch (error) {
      console.error('❌ Failed to request customer review:', error);
    }
  };

  // Inventory management
  const addInventoryItem = (item: InventoryItem) => {
    console.log('🏪 DataStore: Adding inventory item:', item.name);
    setInventoryItems(prev => {
      const updated = [...prev, item];
      try {
        localStorage.setItem('ffr-inventory', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save inventory to localStorage:', error);
      }
      return updated;
    });
  };

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventoryItems(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, ...updates } : item
      );
      try {
        localStorage.setItem('ffr-inventory', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save inventory to localStorage:', error);
      }
      return updated;
    });
  };

  const deleteInventoryItem = (id: string) => {
    setInventoryItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem('ffr-inventory', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save inventory to localStorage:', error);
      }
      return updated;
    });
  };

  // Invoice management
  const addInvoice = (invoice: Invoice) => {
    console.log('🏪 DataStore: Adding invoice:', invoice.invoiceNumber);
    setInvoices(prev => {
      const updated = [...prev, invoice];
      try {
        localStorage.setItem('ffr-invoices', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save invoices to localStorage:', error);
      }
      return updated;
    });
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(prev => {
      const updated = prev.map(invoice =>
        invoice.id === id ? { ...invoice, ...updates } : invoice
      );
      try {
        localStorage.setItem('ffr-invoices', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save invoices to localStorage:', error);
      }
      return updated;
    });
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => {
      const updated = prev.filter(invoice => invoice.id !== id);
      try {
        localStorage.setItem('ffr-invoices', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save invoices to localStorage:', error);
      }
      return updated;
    });
  };

  // Transaction management
  const addTransaction = (transaction: Transaction) => {
    console.log('🏪 DataStore: Adding transaction:', transaction.description);
    setTransactions(prev => {
      const updated = [...prev, transaction];
      try {
        localStorage.setItem('ffr-transactions', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save transactions to localStorage:', error);
      }
      return updated;
    });
  };

  const updateTransaction = (id: number, updates: Partial<Transaction>) => {
    setTransactions(prev => {
      const updated = prev.map(transaction =>
        transaction.id === id ? { ...transaction, ...updates } : transaction
      );
      try {
        localStorage.setItem('ffr-transactions', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save transactions to localStorage:', error);
      }
      return updated;
    });
  };

  // Journal Entry management (proper double-entry accounting)
  const addJournalEntry = (entry: JournalEntry) => {
    console.log('📘 DataStore: Adding journal entry:', entry.entry_number);
    setJournalEntries(prev => {
      const updated = [...prev, entry];
      try {
        localStorage.setItem('ffr-journal-entries', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save journal entries to localStorage:', error);
      }
      return updated;
    });
  };

  const updateJournalEntry = (id: string, updates: Partial<JournalEntry>) => {
    setJournalEntries(prev => {
      const updated = prev.map(entry =>
        entry.id === id ? { ...entry, ...updates } : entry
      );
      try {
        localStorage.setItem('ffr-journal-entries', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save journal entries to localStorage:', error);
      }
      return updated;
    });
  };

  const deleteJournalEntry = (id: string) => {
    setJournalEntries(prev => {
      const updated = prev.filter(entry => entry.id !== id);
      try {
        localStorage.setItem('ffr-journal-entries', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save journal entries to localStorage:', error);
      }
      return updated;
    });
  };

  const postJournalEntry = (id: string) => {
    updateJournalEntry(id, {
      status: 'posted',
      posted_date: new Date().toISOString()
    });
  };

  const voidJournalEntry = (id: string) => {
    updateJournalEntry(id, { status: 'void' });
  };

  // Chart of Accounts management
  const addAccount = (account: Account) => {
    console.log('📊 DataStore: Adding account:', account.code, account.name);
    setAccounts(prev => {
      const updated = [...prev, account];
      try {
        localStorage.setItem('ffr-accounts', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save accounts to localStorage:', error);
      }
      return updated;
    });
  };

  const updateAccount = (code: string, updates: Partial<Account>) => {
    setAccounts(prev => {
      const updated = prev.map(account =>
        account.code === code ? { ...account, ...updates } : account
      );
      try {
        localStorage.setItem('ffr-accounts', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save accounts to localStorage:', error);
      }
      return updated;
    });
  };

  const deleteAccount = (code: string) => {
    setAccounts(prev => {
      const updated = prev.filter(account => account.code !== code);
      try {
        localStorage.setItem('ffr-accounts', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save accounts to localStorage:', error);
      }
      return updated;
    });
  };

  const getAccountByCode = (code: string): Account | undefined => {
    return accounts.find(account => account.code === code);
  };

  // Employee management
  const addEmployee = (employee: Employee) => {
    console.log('👤 DataStore: Adding employee:', employee.firstName, employee.lastName);
    setEmployees(prev => {
      const updated = [...prev, employee];
      try {
        localStorage.setItem('ffr-employees', JSON.stringify(updated));
        console.log('👤 DataStore: Employees saved to localStorage');
      } catch (error) {
        console.warn('Failed to save employees to localStorage:', error);
      }
      return updated;
    });
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => {
      const updated = prev.map(emp =>
        emp.id === id ? { ...emp, ...updates } : emp
      );
      try {
        localStorage.setItem('ffr-employees', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save employees to localStorage:', error);
      }
      return updated;
    });
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => {
      const updated = prev.filter(emp => emp.id !== id);
      try {
        localStorage.setItem('ffr-employees', JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save employees to localStorage:', error);
      }
      return updated;
    });
  };

  // Sync function to trigger re-renders
  const syncData = () => {
    console.log('🔄 DataStore: Syncing data across modules');
    // Force re-render by updating state
    setCustomers(prev => [...prev]);
    setLeads(prev => [...prev]);
    setOpportunities(prev => [...prev]);
    setJobs(prev => [...prev]);
    setInventoryItems(prev => [...prev]);
    setInvoices(prev => [...prev]);
    setTransactions(prev => [...prev]);
    setJournalEntries(prev => [...prev]);
    setAccounts(prev => [...prev]);
    setEmployees(prev => [...prev]);
  };

  // Debug logging
  useEffect(() => {
    console.log('🏪 DataStore: Customers updated, count:', customers.length);
    customers.forEach(customer => {
      console.log(`   - ${customer.firstName} ${customer.lastName} (${customer.id})`);
    });
  }, [customers]);

  useEffect(() => {
    console.log('🏪 DataStore: Jobs updated, count:', jobs.length);
    jobs.forEach(job => {
      console.log(`   - ${job.name} (${job.id})`);
    });
  }, [jobs]);

  const value: DataContextType = {
    customers,
    addCustomer,
    updateCustomer,
    leads,
    addLead,
    updateLead,
    deleteLead,
    opportunities,
    addOpportunity,
    updateOpportunity,
    deleteOpportunity,
    jobs,
    addJob,
    updateJob,
    inventoryItems,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    invoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    transactions,
    addTransaction,
    updateTransaction,
    journalEntries,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    postJournalEntry,
    voidJournalEntry,
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
    getAccountByCode,
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    syncData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Export types for use in other modules
export type { Invoice, Transaction, Job, JournalEntry, JournalEntryLine, Account, Lead, Opportunity, Employee, Certification };

export default DataContext;