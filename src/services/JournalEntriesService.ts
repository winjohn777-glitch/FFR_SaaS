import ApiClient from './ApiClient';

export interface JournalEntryLine {
  id?: string;
  accountId: string;
  account?: {
    id: string;
    code: string;
    name: string;
    type: string;
  };
  description: string;
  memo?: string;
  debit: number;
  credit: number;
  contactId?: string;
  contact?: {
    name: string;
    type: string;
  };
  projectId?: string;
  project?: {
    name: string;
  };
  reference?: string;
  lineNumber?: number;
}

export interface JournalEntry {
  id: string;
  number: string;
  date: string;
  description: string;
  reference?: string;
  status: JournalEntryStatus;
  sourceModule: SourceModule;
  quickEntryTemplate?: string;
  totalDebit: number;
  totalCredit: number;
  notes?: string;
  isPosted: boolean;
  isReversing: boolean;
  isRecurring: boolean;
  recurringFrequency?: RecurringFrequency;
  recurringEndDate?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  postedAt?: string;
  organizationId: string;
  fiscalPeriodId: string;
  createdById: string;
  approvedByUserId?: string;
  postedByUserId?: string;
  reversedByEntryId?: string;
  originalEntryId?: string;
  lines: JournalEntryLine[];
  fiscalPeriod?: FiscalPeriod;
  createdBy?: User;
  approvedBy?: User;
  postedBy?: User;
}

export interface FiscalPeriod {
  id: string;
  name: string;
  type: PeriodType;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isClosed: boolean;
  year: number;
  period: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export enum JournalEntryStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  POSTED = 'POSTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

export enum SourceModule {
  MANUAL = 'MANUAL',
  ACCOUNTS_PAYABLE = 'ACCOUNTS_PAYABLE',
  ACCOUNTS_RECEIVABLE = 'ACCOUNTS_RECEIVABLE',
  PAYROLL = 'PAYROLL',
  INVENTORY = 'INVENTORY',
  BANK_RECONCILIATION = 'BANK_RECONCILIATION',
  DEPRECIATION = 'DEPRECIATION',
  ACCRUALS = 'ACCRUALS',
  ADJUSTMENTS = 'ADJUSTMENTS',
  YEAR_END = 'YEAR_END',
  INTEGRATION = 'INTEGRATION'
}

export enum RecurringFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY'
}

export enum PeriodType {
  MONTH = 'MONTH',
  QUARTER = 'QUARTER',
  YEAR = 'YEAR'
}

export interface JournalEntryFilters {
  page?: number;
  limit?: number;
  status?: JournalEntryStatus;
  fiscalPeriodId?: string;
  sourceModule?: SourceModule;
  startDate?: string;
  endDate?: string;
}

export interface QuickEntryData {
  organizationId: string;
  fiscalPeriodId: string;
  template: string;
  amount: number;
  description: string;
  reference?: string;
  vendor?: string;
  createdById: string;
}

export interface CreateJournalEntryData {
  organizationId: string;
  fiscalPeriodId: string;
  entryDate: string;
  description: string;
  reference?: string;
  sourceModule?: SourceModule;
  notes?: string;
  isRecurring?: boolean;
  recurringFrequency?: RecurringFrequency;
  recurringEndDate?: string;
  createdById: string;
  lines: Omit<JournalEntryLine, 'id' | 'account' | 'contact' | 'project' | 'lineNumber'>[];
}

export class JournalEntriesService {
  private apiClient: typeof ApiClient;
  private organizationId: string;

  constructor() {
    this.apiClient = ApiClient;
    this.organizationId = 'org_default'; // Default organization
  }

  // Set the organization ID for multi-tenant support
  setOrganizationId(orgId: string): void {
    this.organizationId = orgId;
  }

  // Get all journal entries with filtering and pagination
  async getJournalEntries(filters: JournalEntryFilters = {}): Promise<{
    entries: JournalEntry[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    try {
      const params = new URLSearchParams({
        organizationId: this.organizationId,
        page: (filters.page || 1).toString(),
        limit: (filters.limit || 50).toString()
      });

      if (filters.status) params.append('status', filters.status);
      if (filters.fiscalPeriodId) params.append('fiscalPeriodId', filters.fiscalPeriodId);
      if (filters.sourceModule) params.append('sourceModule', filters.sourceModule);

      const response = await this.apiClient.get(`/api/journal-entries?${params.toString()}`);
      return response.data as { entries: JournalEntry[]; pagination: { page: number; limit: number; total: number; pages: number; } };
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      throw new Error('Failed to fetch journal entries');
    }
  }

  // Get a specific journal entry by ID
  async getJournalEntry(id: string): Promise<JournalEntry> {
    try {
      const response = await this.apiClient.get(`/api/journal-entries/${id}`);
      return response.data as JournalEntry;
    } catch (error) {
      console.error('Error fetching journal entry:', error);
      throw new Error('Failed to fetch journal entry');
    }
  }

  // Create a new journal entry
  async createJournalEntry(data: CreateJournalEntryData): Promise<JournalEntry> {
    try {
      // Validate double-entry before sending
      this.validateDoubleEntry(data.lines);

      const response = await this.apiClient.post('/api/journal-entries', data);
      return response.data as JournalEntry;
    } catch (error) {
      console.error('Error creating journal entry:', error);
      throw error;
    }
  }

  // Update an existing journal entry (only if DRAFT)
  async updateJournalEntry(id: string, data: Partial<CreateJournalEntryData>): Promise<JournalEntry> {
    try {
      if (data.lines) {
        this.validateDoubleEntry(data.lines);
      }

      const response = await this.apiClient.put(`/api/journal-entries/${id}`, data);
      return response.data as JournalEntry;
    } catch (error) {
      console.error('Error updating journal entry:', error);
      throw error;
    }
  }

  // Delete a journal entry (only if DRAFT)
  async deleteJournalEntry(id: string): Promise<void> {
    try {
      await this.apiClient.delete(`/api/journal-entries/${id}`);
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      throw error;
    }
  }

  // Approve a journal entry
  async approveJournalEntry(id: string, approvedByUserId: string): Promise<JournalEntry> {
    try {
      const response = await this.apiClient.post(`/api/journal-entries/${id}/approve`, {
        approvedByUserId
      });
      return response.data as JournalEntry;
    } catch (error) {
      console.error('Error approving journal entry:', error);
      throw error;
    }
  }

  // Post a journal entry to the ledger
  async postJournalEntry(id: string, postedByUserId: string): Promise<JournalEntry> {
    try {
      const response = await this.apiClient.post(`/api/journal-entries/${id}/post`, {
        postedByUserId
      });
      return response.data as JournalEntry;
    } catch (error) {
      console.error('Error posting journal entry:', error);
      throw error;
    }
  }

  // Create a reversal entry
  async reverseJournalEntry(id: string, reversedByUserId: string, description?: string): Promise<JournalEntry> {
    try {
      const response = await this.apiClient.post(`/api/journal-entries/${id}/reverse`, {
        reversedByUserId,
        description
      });
      return response.data as JournalEntry;
    } catch (error) {
      console.error('Error reversing journal entry:', error);
      throw error;
    }
  }

  // Create a quick entry using predefined templates
  async createQuickEntry(data: QuickEntryData): Promise<JournalEntry> {
    try {
      const response = await this.apiClient.post('/api/journal-entries/quick-entry', data);
      return response.data as JournalEntry;
    } catch (error) {
      console.error('Error creating quick entry:', error);
      throw error;
    }
  }

  // Get available quick entry templates
  async getTemplates(): Promise<any> {
    try {
      const response = await this.apiClient.get('/api/journal-entries/templates');
      return response.data as JournalEntry;
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  }

  // Fiscal Period Management

  // Get available fiscal periods
  async getFiscalPeriods(): Promise<FiscalPeriod[]> {
    try {
      const response = await this.apiClient.get(`/api/journal-entries/fiscal-periods?organizationId=${this.organizationId}`);
      return response.data as FiscalPeriod[];
    } catch (error) {
      console.error('Error fetching fiscal periods:', error);
      throw error;
    }
  }

  // Create a new fiscal period
  async createFiscalPeriod(data: {
    name: string;
    type: PeriodType;
    year: number;
    period: number;
    startDate: string;
    endDate: string;
  }): Promise<FiscalPeriod> {
    try {
      const response = await this.apiClient.post('/api/journal-entries/fiscal-periods', {
        ...data,
        organizationId: this.organizationId
      });
      return response.data as FiscalPeriod;
    } catch (error) {
      console.error('Error creating fiscal period:', error);
      throw error;
    }
  }

  // Get the current active fiscal period
  async getCurrentFiscalPeriod(): Promise<FiscalPeriod | null> {
    try {
      const periods = await this.getFiscalPeriods();
      const currentDate = new Date();

      return periods.find(period => {
        const startDate = new Date(period.startDate);
        const endDate = new Date(period.endDate);
        return currentDate >= startDate && currentDate <= endDate && period.isActive && !period.isClosed;
      }) || null;
    } catch (error) {
      console.error('Error getting current fiscal period:', error);
      return null;
    }
  }

  // Validation and Helper Functions

  // Validate double-entry bookkeeping
  private validateDoubleEntry(lines: Omit<JournalEntryLine, 'id' | 'account' | 'contact' | 'project' | 'lineNumber'>[]): void {
    if (!lines || lines.length < 2) {
      throw new Error('Journal entry must have at least 2 lines for double-entry bookkeeping');
    }

    const totalDebits = lines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const totalCredits = lines.reduce((sum, line) => sum + (line.credit || 0), 0);

    if (Math.abs(totalDebits - totalCredits) > 0.01) {
      throw new Error(`Double-entry validation failed: Total debits (${totalDebits.toFixed(2)}) must equal total credits (${totalCredits.toFixed(2)})`);
    }
  }

  // Smart account suggestions based on description
  getAccountSuggestions(description: string, templates: any): string[] {
    const desc = description.toLowerCase();
    const suggestions: string[] = [];

    // Roofing business-specific account suggestions
    if (desc.includes('fuel') || desc.includes('gas')) {
      suggestions.push('6250'); // Vehicle Expenses
    }

    if (desc.includes('material') || desc.includes('shingle') || desc.includes('nail')) {
      suggestions.push('1300'); // Inventory
      suggestions.push('5000'); // Cost of Goods Sold
    }

    if (desc.includes('truck') || desc.includes('vehicle') || desc.includes('equipment')) {
      suggestions.push('1500'); // Equipment
      suggestions.push('2100'); // Equipment Loan
    }

    if (desc.includes('insurance')) {
      suggestions.push('6200'); // Insurance Expense
    }

    if (desc.includes('rent')) {
      suggestions.push('6100'); // Rent Expense
    }

    if (desc.includes('utility') || desc.includes('electric') || desc.includes('water')) {
      suggestions.push('6300'); // Utilities
    }

    if (desc.includes('payment received') || desc.includes('customer payment')) {
      suggestions.push('1010'); // Checking Account
      suggestions.push('1200'); // Accounts Receivable
    }

    if (desc.includes('subcontractor') || desc.includes('labor')) {
      suggestions.push('6400'); // Subcontractor Expense
    }

    return [...new Set(suggestions)]; // Remove duplicates
  }

  // Generate default fiscal periods for a year
  async generateFiscalPeriodsForYear(year: number): Promise<FiscalPeriod[]> {
    const periods: FiscalPeriod[] = [];

    try {
      // Create monthly periods
      for (let month = 1; month <= 12; month++) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0); // Last day of month

        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const period = await this.createFiscalPeriod({
          name: `${monthNames[month - 1]} ${year}`,
          type: PeriodType.MONTH,
          year,
          period: month,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        });

        periods.push(period);
      }

      // Create quarterly periods
      for (let quarter = 1; quarter <= 4; quarter++) {
        const startMonth = (quarter - 1) * 3 + 1;
        const startDate = new Date(year, startMonth - 1, 1);
        const endDate = new Date(year, startMonth + 2, 0); // Last day of quarter's last month

        const period = await this.createFiscalPeriod({
          name: `Q${quarter} ${year}`,
          type: PeriodType.QUARTER,
          year,
          period: quarter,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        });

        periods.push(period);
      }

      // Create annual period
      const yearPeriod = await this.createFiscalPeriod({
        name: `FY ${year}`,
        type: PeriodType.YEAR,
        year,
        period: 1,
        startDate: `${year}-01-01`,
        endDate: `${year}-12-31`
      });

      periods.push(yearPeriod);

      return periods;
    } catch (error) {
      console.error('Error generating fiscal periods:', error);
      throw error;
    }
  }

  // Progressive UX Helpers

  // Get beginner-friendly quick entry options
  getBeginnerQuickEntries(): Array<{ key: string; name: string; description: string }> {
    return [
      { key: 'customer_payment', name: 'Customer Payment', description: 'Record payment received from customer' },
      { key: 'supplier_payment', name: 'Pay Supplier', description: 'Record payment made to supplier' },
      { key: 'material_purchase', name: 'Buy Materials', description: 'Record purchase of roofing materials' },
      { key: 'fuel_purchase', name: 'Buy Fuel', description: 'Record fuel purchase for vehicles' },
      { key: 'utility_bill', name: 'Pay Utilities', description: 'Record utility bill payment' }
    ];
  }

  // Get advanced transaction templates
  getAdvancedTemplates(): any {
    return {
      depreciation: {
        name: 'Equipment Depreciation',
        accounts: [
          { account: '6500', name: 'Depreciation Expense', debit: true },
          { account: '1550', name: 'Accumulated Depreciation', credit: true }
        ]
      },
      accruals: {
        name: 'Expense Accrual',
        accounts: [
          { account: '6000', name: 'Expense Account', debit: true },
          { account: '2200', name: 'Accrued Expenses', credit: true }
        ]
      },
      adjustment: {
        name: 'Adjusting Entry',
        accounts: [
          { account: '????', name: 'Select Account', debit: true },
          { account: '????', name: 'Select Account', credit: true }
        ]
      }
    };
  }

  // Format currency for display
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  // Format date for display
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Get status badge color for UI
  getStatusColor(status: JournalEntryStatus): string {
    switch (status) {
      case JournalEntryStatus.DRAFT:
        return 'gray';
      case JournalEntryStatus.PENDING_APPROVAL:
        return 'yellow';
      case JournalEntryStatus.APPROVED:
        return 'blue';
      case JournalEntryStatus.POSTED:
        return 'green';
      case JournalEntryStatus.REJECTED:
        return 'red';
      case JournalEntryStatus.CANCELLED:
        return 'red';
      default:
        return 'gray';
    }
  }
}

// Create and export a singleton instance
export const journalEntriesService = new JournalEntriesService();
export default journalEntriesService;