import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Customer, Lead, Opportunity } from '../types/crm';
import { InventoryItem } from '../types/inventory';
import {
  TrainingService,
  CustomerService,
  LeadService,
  OpportunityService,
  JobService,
  InventoryService,
  TransactionService
} from '../services/apiService';
import EmployeeServiceInstance from '../services/EmployeeService';
import journalEntriesService, {
  JournalEntry as EnhancedJournalEntry,
  FiscalPeriod,
  JournalEntryStatus,
  SourceModule,
  RecurringFrequency,
  User,
  CreateJournalEntryData,
  QuickEntryData
} from '../services/JournalEntriesService';

// Export types for compatibility
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  email: string;
  phone?: string;
  address?: string;
  hireDate: string;
  employeeId: string;
  status: 'active' | 'inactive';
  payRate: number;
  timeTracking: {
    hoursThisWeek: number;
    overtime: number;
  };
  certifications: Certification[];
  // Backward compatibility properties
  position?: string; // Maps to role
  startDate?: string; // Maps to hireDate
}

export interface Certification {
  id?: string;
  name: string;
  type: string;
  issueDate: string;
  expirationDate: string;
  status: 'valid' | 'expiring' | 'expired';
  certificateNumber?: string;
}

export interface TrainingSession {
  id: string;
  employeeId: string;
  employeeName?: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  date: string;
  time?: string;
  duration?: string;
  location?: string;
  instructor?: string;
  notes?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  completionDate?: string;
  createdDate?: string;
}

interface Job {
  id: string;
  jobCode: string;
  title: string;
  // Backward compatibility properties
  name?: string; // Maps to title
  customer?: string; // Maps to customer.firstName + lastName
  projectType?: string; // Maps to type field
  actualCosts?: number; // Maps to actualCost
  laborCosts?: number; // For cost breakdown
  materialCosts?: number; // For cost breakdown
  equipmentCosts?: number; // For cost breakdown
  estimatedValue: number;
  progress?: number; // For compatibility with progress tracking
  profitMargin?: number; // For profit margin calculations

  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  type?: string;
  actualCost?: number;
  startDate: string;
  completionDate?: string;
  estimatedCompletionDate?: string;
  assignedTo?: string;
  location?: string;
  description: string;
  notes?: string;
  customerId: string;
  customerDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  inventoryItems?: InventoryItem[];
  documents?: Document[];
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerAddress: string;
  jobName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'pending';
  paymentTerms?: string;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  lineItems?: Array<{
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  notes?: string;
}

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  reference?: string;
  account: string;
  paymentMethod?: string;
  status: 'pending' | 'completed' | 'failed';
  notes?: string;
  attachments?: string[];
  // Backward compatibility properties for database schema
  totalAmount?: number; // Maps to amount
  transactionDate?: string; // Maps to date
  transactionType?: string; // Maps to type
}

// Journal Entry interfaces for DataContext (backward compatible)
export interface JournalEntryLine {
  id?: string;
  accountId: string;
  account?: string;
  description?: string;
  memo?: string;
  debit: number;
  credit: number;
  contactId?: string;
  projectId?: string;
  reference?: string;
  lineNumber?: number;
  // Backward compatibility properties
  account_id?: string;
  account_name?: string;
  account_code?: string;
  debit_amount?: number;
  credit_amount?: number;
  amount?: number;
}

export interface JournalEntry {
  id: string;
  number: string;
  date: string;
  description: string;
  reference?: string;
  status: JournalEntryStatus | 'draft' | 'posted';
  sourceModule?: SourceModule;
  quickEntryTemplate?: string;
  totalDebit: number;
  totalCredit: number;
  notes?: string;
  isPosted?: boolean;
  isReversing?: boolean;
  isRecurring?: boolean;
  recurringFrequency?: RecurringFrequency;
  recurringEndDate?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  postedAt?: string;
  organizationId: string;
  fiscalPeriodId: string;
  createdById?: string;
  approvedByUserId?: string;
  postedByUserId?: string;
  createdBy?: User | string;
  approvedBy?: User;
  postedBy?: User;
  fiscalPeriod?: FiscalPeriod;
  lines: JournalEntryLine[];
  // Backward compatibility properties
  entry_number?: string;
  created_date?: string;
  posted_date?: string;
  debits?: Array<{
    account: string;
    amount: number;
    description?: string;
  }>;
  credits?: Array<{
    account: string;
    amount: number;
    description?: string;
  }>;
  totalDebits?: number;
  totalCredits?: number;
  isBalanced?: boolean;
}

interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  category: string;
  subCategory?: string;
  balance: number;
  isActive: boolean;
  description?: string;
  parentAccount?: string;
  taxCode?: string;
}

interface DataContextType {
  // Data state
  customers: Customer[];
  leads: Lead[];
  opportunities: Opportunity[];
  jobs: Job[];
  inventory: InventoryItem[];
  inventoryItems: InventoryItem[]; // Backward compatibility
  invoices: Invoice[];
  transactions: Transaction[];
  journalEntries: JournalEntry[];
  accounts: Account[];
  employees: Employee[];
  trainingSessions: TrainingSession[];
  loading: boolean;
  error: string | null;

  // Data operations
  addCustomer: (customer: Omit<Customer, 'id'>) => Promise<void>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;

  addLead: (lead: Omit<Lead, 'id'>) => Promise<void>;
  updateLead: (id: string, lead: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;

  addOpportunity: (opportunity: Omit<Opportunity, 'id'>) => Promise<void>;
  updateOpportunity: (id: string, opportunity: Partial<Opportunity>) => Promise<void>;
  deleteOpportunity: (id: string) => Promise<void>;

  addJob: (job: Omit<Job, 'id'>) => Promise<void>;
  updateJob: (id: string, updates: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  generateJobFromOpportunity: (opportunityId: string, projectDetails: any) => Promise<void>;

  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => Promise<void>;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;
  adjustInventoryQuantity: (id: string, adjustment: number, reason: string) => Promise<void>;

  addInvoice: (invoice: Omit<Invoice, 'id'>) => Promise<void>;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;

  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => Promise<void>;
  updateJournalEntry: (id: string, entry: Partial<JournalEntry>) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;

  // Enhanced journal entry operations
  createEnhancedJournalEntry: (data: CreateJournalEntryData) => Promise<EnhancedJournalEntry>;
  approveJournalEntry: (id: string, approvedByUserId: string) => Promise<EnhancedJournalEntry>;
  postJournalEntry: (id: string, postedByUserId: string) => Promise<EnhancedJournalEntry>;
  reverseJournalEntry: (id: string, reversedByUserId: string, description?: string) => Promise<EnhancedJournalEntry>;
  createQuickEntry: (data: QuickEntryData) => Promise<EnhancedJournalEntry>;
  getJournalEntryTemplates: () => Promise<any>;

  // Fiscal period operations
  fiscalPeriods: FiscalPeriod[];
  getCurrentFiscalPeriod: () => Promise<FiscalPeriod | null>;
  createFiscalPeriod: (data: { name: string; type: any; year: number; period: number; startDate: string; endDate: string; }) => Promise<FiscalPeriod>;
  generateFiscalPeriodsForYear: (year: number) => Promise<FiscalPeriod[]>;

  addAccount: (account: Omit<Account, 'id'>) => Promise<void>;
  updateAccount: (id: string, account: Partial<Account>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;

  // Employee and Training methods
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  addTrainingSession: (session: Omit<TrainingSession, 'id'>) => Promise<void>;
  getUpcomingTrainingSessions: () => TrainingSession[];

  // Utility functions
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // State using database API
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [enhancedJournalEntries] = useState<EnhancedJournalEntry[]>([]);
  const [fiscalPeriods, setFiscalPeriods] = useState<FiscalPeriod[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load all data from API
  const refreshData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        customersResponse,
        leadsResponse,
        opportunitiesResponse,
        jobsResponse,
        inventoryResponse,
        // documentsResponse,
        transactionsResponse
      ] = await Promise.all([
        CustomerService.getAll(),
        LeadService.getAll(),
        OpportunityService.getAll(),
        JobService.getAll(),
        InventoryService.getAll(),
        // DocumentService.getAll(),
        TransactionService.getAll()
      ]);

      if (customersResponse.data) {
        setCustomers(customersResponse.data);
      }
      if (leadsResponse.data) {
        setLeads(leadsResponse.data);
      }
      if (opportunitiesResponse.data) {
        setOpportunities(opportunitiesResponse.data);
      }
      if (jobsResponse.data) {
        // Transform jobs to include backward compatibility properties
        const transformedJobs = jobsResponse.data.map((job: any) => ({
          ...job,
          name: job.title,
          customer: job.customer ? `${job.customer.firstName} ${job.customer.lastName}` : '',
          projectType: job.type,
          actualCosts: job.actualCost,
          progress: job.status === 'completed' ? 100 : job.status === 'in_progress' ? 50 : 0,
          customerDetails: job.customer
        }));
        setJobs(transformedJobs);
      }
      if (inventoryResponse.data) {
        setInventory(inventoryResponse.data);
      }
      if (transactionsResponse.data) {
        setTransactions(transactionsResponse.data);
      }

      // Load employees from database via API
      try {
        const employeeService = EmployeeServiceInstance.getInstance();
        const employeesData = await employeeService.getEmployees('cmioq8ubf0000s920rbdmrn6i');
        setEmployees(employeesData);
      } catch (error) {
        console.error('Error loading employees:', error);
        setEmployees([]);
      }

    } catch (err) {
      console.error('Error loading data from API:', err);
      setError('Failed to load data from database');
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    refreshData();
  }, []);

  // Customer operations
  const addCustomer = async (customerData: Omit<Customer, 'id'>) => {
    try {
      const response = await CustomerService.create(customerData);
      if (response.data) {
        setCustomers(prev => [...prev, response.data]);
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      const response = await CustomerService.update(id, updates);
      if (response.data) {
        setCustomers(prev => prev.map(customer =>
          customer.id === id ? response.data : customer
        ));
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await CustomerService.delete(id);
      setCustomers(prev => prev.filter(customer => customer.id !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  };

  // Lead operations
  const addLead = async (leadData: Omit<Lead, 'id'>) => {
    try {
      const response = await LeadService.create(leadData);
      if (response.data) {
        setLeads(prev => [...prev, response.data]);
      }
    } catch (error) {
      console.error('Error adding lead:', error);
      throw error;
    }
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    try {
      const response = await LeadService.update(id, updates);
      if (response.data) {
        setLeads(prev => prev.map(lead =>
          lead.id === id ? response.data : lead
        ));
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      throw error;
    }
  };

  const deleteLead = async (id: string) => {
    try {
      await LeadService.delete(id);
      setLeads(prev => prev.filter(lead => lead.id !== id));
    } catch (error) {
      console.error('Error deleting lead:', error);
      throw error;
    }
  };

  // Opportunity operations
  const addOpportunity = async (opportunityData: Omit<Opportunity, 'id'>) => {
    try {
      const response = await OpportunityService.create(opportunityData);
      if (response.data) {
        setOpportunities(prev => [...prev, response.data]);
      }
    } catch (error) {
      console.error('Error adding opportunity:', error);
      throw error;
    }
  };

  const updateOpportunity = async (id: string, updates: Partial<Opportunity>) => {
    try {
      const response = await OpportunityService.update(id, updates);
      if (response.data) {
        setOpportunities(prev => prev.map(opportunity =>
          opportunity.id === id ? response.data : opportunity
        ));
      }
    } catch (error) {
      console.error('Error updating opportunity:', error);
      throw error;
    }
  };

  const deleteOpportunity = async (id: string) => {
    try {
      await OpportunityService.delete(id);
      setOpportunities(prev => prev.filter(opportunity => opportunity.id !== id));
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      throw error;
    }
  };

  // Job operations
  const addJob = async (jobData: Omit<Job, 'id'>) => {
    try {
      const response = await JobService.create(jobData);
      if (response.data) {
        setJobs(prev => [...prev, response.data]);
      }
    } catch (error) {
      console.error('Error adding job:', error);
      throw error;
    }
  };

  const updateJob = async (id: string, updates: Partial<Job>) => {
    try {
      const response = await JobService.update(id, updates);
      if (response.data) {
        setJobs(prev => prev.map(job =>
          job.id === id ? response.data : job
        ));
      }
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  };

  const deleteJob = async (id: string) => {
    try {
      await JobService.delete(id);
      setJobs(prev => prev.filter(job => job.id !== id));
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  };

  const generateJobFromOpportunity = async (opportunityId: string, projectDetails: any) => {
    try {
      const opportunity = opportunities.find(opp => opp.id === opportunityId);
      if (!opportunity) {
        throw new Error('Opportunity not found');
      }

      const jobData = {
        jobCode: `JOB-${Date.now()}`, // Generate a unique job code
        title: opportunity.name || 'New Job',
        customerId: opportunity.customerId,
        description: opportunity.description || '',
        type: projectDetails.roofType || 'roof_replacement',
        priority: 'medium' as const, // Default priority since Opportunity doesn't have this field
        estimatedValue: opportunity.estimatedValue || 0,
        estimatedCompletionDate: opportunity.estimatedCompletionDate,
        notes: `Generated from opportunity: ${opportunity.name}`,
        status: 'pending' as const,
        startDate: new Date().toISOString()
      };

      await addJob(jobData);

      // Update opportunity stage to converted
      await updateOpportunity(opportunityId, {
        stage: 'Closed Won' as const,
        actualCloseDate: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error generating job from opportunity:', error);
      throw error;
    }
  };

  // Inventory operations
  const addInventoryItem = async (itemData: Omit<InventoryItem, 'id'>) => {
    try {
      const response = await InventoryService.create(itemData);
      if (response.data) {
        setInventory(prev => [...prev, response.data]);
      }
    } catch (error) {
      console.error('Error adding inventory item:', error);
      throw error;
    }
  };

  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      const response = await InventoryService.update(id, updates);
      if (response.data) {
        setInventory(prev => prev.map(item =>
          item.id === id ? response.data : item
        ));
      }
    } catch (error) {
      console.error('Error updating inventory item:', error);
      throw error;
    }
  };

  const deleteInventoryItem = async (id: string) => {
    try {
      await InventoryService.delete(id);
      setInventory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      throw error;
    }
  };

  const adjustInventoryQuantity = async (id: string, adjustment: number, reason: string) => {
    try {
      const response = await InventoryService.adjustQuantity(id, adjustment, reason);
      if (response.data) {
        setInventory(prev => prev.map(item =>
          item.id === id ? response.data : item
        ));
      }
    } catch (error) {
      console.error('Error adjusting inventory quantity:', error);
      throw error;
    }
  };

  // Invoice operations (placeholder - to be implemented when invoice API is ready)
  const addInvoice = async (invoiceData: Omit<Invoice, 'id'>) => {
    const newInvoice = {
      ...invoiceData,
      id: Date.now().toString()
    };
    setInvoices(prev => [...prev, newInvoice]);
  };

  const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(invoice =>
      invoice.id === id ? { ...invoice, ...updates } : invoice
    ));
  };

  const deleteInvoice = async (id: string) => {
    setInvoices(prev => prev.filter(invoice => invoice.id !== id));
  };

  // Transaction operations
  const addTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    try {
      const response = await TransactionService.create(transactionData);
      if (response.data) {
        setTransactions(prev => [...prev, response.data]);
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      const response = await TransactionService.update(id, updates);
      if (response.data) {
        setTransactions(prev => prev.map(transaction =>
          transaction.id === id ? response.data : transaction
        ));
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await TransactionService.delete(id);
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  };

  // Journal Entry operations (placeholder - to be implemented when journal API is ready)
  const addJournalEntry = async (entryData: Omit<JournalEntry, 'id'>) => {
    const newEntry = {
      ...entryData,
      id: Date.now().toString()
    };
    setJournalEntries(prev => [...prev, newEntry]);
  };

  const updateJournalEntry = async (id: string, updates: Partial<JournalEntry>) => {
    setJournalEntries(prev => prev.map(entry =>
      entry.id === id ? { ...entry, ...updates } : entry
    ));
  };

  const deleteJournalEntry = async (id: string) => {
    setJournalEntries(prev => prev.filter(entry => entry.id !== id));
  };

  // Account operations (placeholder - to be implemented when account API is ready)
  const addAccount = async (accountData: Omit<Account, 'id'>) => {
    const newAccount = {
      ...accountData,
      id: Date.now().toString()
    };
    setAccounts(prev => [...prev, newAccount]);
  };

  const updateAccount = async (id: string, updates: Partial<Account>) => {
    setAccounts(prev => prev.map(account =>
      account.id === id ? { ...account, ...updates } : account
    ));
  };

  const deleteAccount = async (id: string) => {
    setAccounts(prev => prev.filter(account => account.id !== id));
  };

  // Employee operations
  const addEmployee = async (employeeData: Omit<Employee, 'id'>) => {
    try {
      const employeeService = EmployeeServiceInstance.getInstance();
      const createData = employeeService.convertEmployeeToApiFormat({
        ...employeeData,
        id: `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });

      const newEmployee = await employeeService.createEmployee('cmioq8ubf0000s920rbdmrn6i', createData);

      if (newEmployee) {
        setEmployees(prev => [...prev, newEmployee]);
        console.log('✅ Employee added successfully:', newEmployee);
      } else {
        throw new Error('Failed to create employee');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      throw error;
    }
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    try {
      const employeeService = EmployeeServiceInstance.getInstance();
      const updateData = employeeService.convertEmployeeToApiFormat({
        id,
        ...updates
      } as Employee);

      const updatedEmployee = await employeeService.updateEmployee(id, updateData);

      if (updatedEmployee) {
        setEmployees(prev => prev.map(employee =>
          employee.id === id ? updatedEmployee : employee
        ));
      } else {
        throw new Error('Failed to update employee');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      const employeeService = EmployeeServiceInstance.getInstance();
      const success = await employeeService.deleteEmployee(id);

      if (success) {
        setEmployees(prev => prev.filter(employee => employee.id !== id));
      } else {
        throw new Error('Failed to delete employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  };

  // Training session operations
  const addTrainingSession = async (sessionData: Omit<TrainingSession, 'id'>) => {
    try {
      const response = await TrainingService.create(sessionData);
      if (response.data) {
        setTrainingSessions(prev => [...prev, response.data]);
      }
    } catch (error) {
      console.error('Error adding training session:', error);
      throw error;
    }
  };

  const getUpcomingTrainingSessions = (): TrainingSession[] => {
    const now = new Date();
    const nowStr = now.toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

    return trainingSessions.filter(session => {
      return session.date >= nowStr &&
             (session.status === 'scheduled' || session.status === 'in_progress');
    }).sort((a, b) => a.date.localeCompare(b.date));
  };

  const value: DataContextType = {
    // Data state
    customers,
    leads,
    opportunities,
    jobs,
    inventory,
    inventoryItems: inventory, // Backward compatibility
    invoices,
    transactions,
    journalEntries,
    accounts,
    employees,
    trainingSessions,
    loading,
    error,

    // Data operations
    addCustomer,
    updateCustomer,
    deleteCustomer,

    addLead,
    updateLead,
    deleteLead,

    addOpportunity,
    updateOpportunity,
    deleteOpportunity,

    addJob,
    updateJob,
    deleteJob,
    generateJobFromOpportunity,

    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    adjustInventoryQuantity,

    addInvoice,
    updateInvoice,
    deleteInvoice,

    addTransaction,
    updateTransaction,
    deleteTransaction,

    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,

    // Enhanced journal entry operations (placeholder implementations)
    createEnhancedJournalEntry: async (data: CreateJournalEntryData) => {
      return journalEntriesService.createJournalEntry(data);
    },
    approveJournalEntry: async (id: string, approvedByUserId: string) => {
      return journalEntriesService.approveJournalEntry(id, approvedByUserId);
    },
    postJournalEntry: async (id: string, postedByUserId: string) => {
      return journalEntriesService.postJournalEntry(id, postedByUserId);
    },
    reverseJournalEntry: async (id: string, reversedByUserId: string, description?: string) => {
      return journalEntriesService.reverseJournalEntry(id, reversedByUserId, description);
    },
    createQuickEntry: async (data: QuickEntryData) => {
      return journalEntriesService.createQuickEntry(data);
    },
    getJournalEntryTemplates: async () => {
      return journalEntriesService.getTemplates();
    },

    // Fiscal period operations
    fiscalPeriods,
    getCurrentFiscalPeriod: async () => {
      return journalEntriesService.getCurrentFiscalPeriod();
    },
    createFiscalPeriod: async (data: { name: string; type: any; year: number; period: number; startDate: string; endDate: string; }) => {
      const newPeriod = await journalEntriesService.createFiscalPeriod(data);
      setFiscalPeriods(prev => [...prev, newPeriod]);
      return newPeriod;
    },
    generateFiscalPeriodsForYear: async (year: number) => {
      const newPeriods = await journalEntriesService.generateFiscalPeriodsForYear(year);
      setFiscalPeriods(prev => [...prev, ...newPeriods]);
      return newPeriods;
    },

    addAccount,
    updateAccount,
    deleteAccount,

    // Employee and Training methods
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addTrainingSession,
    getUpcomingTrainingSessions,

    // Utility functions
    refreshData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};