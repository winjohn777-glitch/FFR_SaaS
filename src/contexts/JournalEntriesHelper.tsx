// Helper functions for integrating enhanced journal entries with DataContext
import journalEntriesService, {
  JournalEntry as EnhancedJournalEntry,
  JournalEntryLine as EnhancedJournalEntryLine,
  FiscalPeriod,
  JournalEntryStatus,
  CreateJournalEntryData,
  QuickEntryData
} from '../services/JournalEntriesService';

// Type definitions for backward compatibility
export interface LegacyJournalEntryLine {
  id?: string;
  account?: string;
  account_id?: string;
  account_name?: string;
  account_code?: string;
  debit_amount?: number;
  credit_amount?: number;
  amount?: number;
  description?: string;
}

export interface LegacyJournalEntry {
  id: string;
  date: string;
  reference: string;
  description: string;
  entry_number?: string;
  lines?: LegacyJournalEntryLine[];
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
  status: 'draft' | 'posted' | JournalEntryStatus;
  createdBy?: string;
  notes?: string;
}

// Helper class to manage journal entries state and operations
export class JournalEntriesManager {
  private enhancedEntries: EnhancedJournalEntry[] = [];
  private legacyEntries: LegacyJournalEntry[] = [];
  private fiscalPeriods: FiscalPeriod[] = [];

  // Conversion helpers
  convertToLegacyFormat(enhancedEntry: EnhancedJournalEntry): LegacyJournalEntry {
    return {
      ...enhancedEntry,
      reference: enhancedEntry.reference || '',
      entry_number: enhancedEntry.number,
      created_date: enhancedEntry.createdAt,
      posted_date: enhancedEntry.postedAt || '',
      totalDebits: enhancedEntry.totalDebit,
      totalCredits: enhancedEntry.totalCredit,
      isBalanced: Math.abs(enhancedEntry.totalDebit - enhancedEntry.totalCredit) < 0.01,
      status: enhancedEntry.status === JournalEntryStatus.POSTED ? 'posted' : 'draft',
      createdBy: typeof enhancedEntry.createdBy === 'string' ? enhancedEntry.createdBy : enhancedEntry.createdBy?.email || `${enhancedEntry.createdBy?.firstName} ${enhancedEntry.createdBy?.lastName}` || enhancedEntry.createdById,
      lines: enhancedEntry.lines?.map(line => ({
        ...line,
        account: line.account?.name,
        account_id: line.accountId,
        account_name: line.account?.name,
        account_code: line.account?.code,
        debit_amount: line.debit,
        credit_amount: line.credit,
        amount: line.debit || line.credit,
        description: line.memo || line.description
      }))
    };
  }

  convertLegacyToEnhancedFormat(legacyEntry: Omit<LegacyJournalEntry, 'id'>, fiscalPeriodId: string, createdById: string): CreateJournalEntryData {
    const lines = [];

    // Convert debits and credits arrays to lines
    if (legacyEntry.debits) {
      lines.push(...legacyEntry.debits.map(debit => ({
        accountId: debit.account, // Assuming this is account ID
        description: debit.description || legacyEntry.description,
        debit: debit.amount,
        credit: 0
      })));
    }

    if (legacyEntry.credits) {
      lines.push(...legacyEntry.credits.map(credit => ({
        accountId: credit.account, // Assuming this is account ID
        description: credit.description || legacyEntry.description,
        debit: 0,
        credit: credit.amount
      })));
    }

    // If using lines array instead
    if (legacyEntry.lines && !lines.length) {
      lines.push(...legacyEntry.lines.map(line => ({
        accountId: line.account_id || line.account || '',
        description: line.description || legacyEntry.description,
        debit: line.debit_amount || 0,
        credit: line.credit_amount || 0
      })));
    }

    return {
      organizationId: 'cmioq8ubf0000s920rbdmrn6i',
      fiscalPeriodId,
      entryDate: legacyEntry.date,
      description: legacyEntry.description,
      reference: legacyEntry.reference,
      notes: legacyEntry.notes,
      createdById,
      lines
    };
  }

  // State management
  setEnhancedEntries(entries: EnhancedJournalEntry[]) {
    this.enhancedEntries = entries;
    this.legacyEntries = entries.map(entry => this.convertToLegacyFormat(entry));
  }

  setFiscalPeriods(periods: FiscalPeriod[]) {
    this.fiscalPeriods = periods;
  }

  getEnhancedEntries(): EnhancedJournalEntry[] {
    return this.enhancedEntries;
  }

  getLegacyEntries(): LegacyJournalEntry[] {
    return this.legacyEntries;
  }

  getFiscalPeriods(): FiscalPeriod[] {
    return this.fiscalPeriods;
  }

  // CRUD Operations
  async loadJournalEntries(): Promise<{ enhanced: EnhancedJournalEntry[]; legacy: LegacyJournalEntry[] }> {
    try {
      const response = await journalEntriesService.getJournalEntries();
      const enhancedEntries = response.entries || [];

      this.setEnhancedEntries(enhancedEntries);

      return {
        enhanced: this.enhancedEntries,
        legacy: this.legacyEntries
      };
    } catch (error) {
      console.error('Error loading journal entries:', error);
      return { enhanced: [], legacy: [] };
    }
  }

  async loadFiscalPeriods(): Promise<FiscalPeriod[]> {
    try {
      const periods = await journalEntriesService.getFiscalPeriods();
      this.setFiscalPeriods(periods);
      return periods;
    } catch (error) {
      console.error('Error loading fiscal periods:', error);
      return [];
    }
  }

  async createJournalEntry(entryData: Omit<LegacyJournalEntry, 'id'>, createdById: string): Promise<{
    enhanced: EnhancedJournalEntry;
    legacy: LegacyJournalEntry;
  }> {
    try {
      // Get current fiscal period
      const currentPeriod = await this.getCurrentFiscalPeriodId();

      // Convert legacy format to enhanced
      const enhancedData = this.convertLegacyToEnhancedFormat(entryData, currentPeriod, createdById);

      // Create the entry
      const newEnhancedEntry = await journalEntriesService.createJournalEntry(enhancedData);
      const newLegacyEntry = this.convertToLegacyFormat(newEnhancedEntry);

      // Update local state
      this.enhancedEntries.push(newEnhancedEntry);
      this.legacyEntries.push(newLegacyEntry);

      return {
        enhanced: newEnhancedEntry,
        legacy: newLegacyEntry
      };
    } catch (error) {
      console.error('Error creating journal entry:', error);
      throw error;
    }
  }

  async updateJournalEntry(id: string, updates: Partial<LegacyJournalEntry>): Promise<{
    enhanced: EnhancedJournalEntry;
    legacy: LegacyJournalEntry;
  }> {
    try {
      const updatedEntry = await journalEntriesService.updateJournalEntry(id, {
        description: updates.description,
        reference: updates.reference,
        notes: updates.notes
      });

      const legacyEntry = this.convertToLegacyFormat(updatedEntry);

      // Update local state
      this.enhancedEntries = this.enhancedEntries.map(entry =>
        entry.id === id ? updatedEntry : entry
      );
      this.legacyEntries = this.legacyEntries.map(entry =>
        entry.id === id ? legacyEntry : entry
      );

      return {
        enhanced: updatedEntry,
        legacy: legacyEntry
      };
    } catch (error) {
      console.error('Error updating journal entry:', error);
      throw error;
    }
  }

  async deleteJournalEntry(id: string): Promise<void> {
    try {
      await journalEntriesService.deleteJournalEntry(id);

      // Update local state
      this.enhancedEntries = this.enhancedEntries.filter(entry => entry.id !== id);
      this.legacyEntries = this.legacyEntries.filter(entry => entry.id !== id);
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      throw error;
    }
  }

  async approveJournalEntry(id: string, approvedByUserId: string): Promise<EnhancedJournalEntry> {
    try {
      const updatedEntry = await journalEntriesService.approveJournalEntry(id, approvedByUserId);
      const legacyEntry = this.convertToLegacyFormat(updatedEntry);

      // Update local state
      this.enhancedEntries = this.enhancedEntries.map(entry =>
        entry.id === id ? updatedEntry : entry
      );
      this.legacyEntries = this.legacyEntries.map(entry =>
        entry.id === id ? legacyEntry : entry
      );

      return updatedEntry;
    } catch (error) {
      console.error('Error approving journal entry:', error);
      throw error;
    }
  }

  async postJournalEntry(id: string, postedByUserId: string): Promise<EnhancedJournalEntry> {
    try {
      const updatedEntry = await journalEntriesService.postJournalEntry(id, postedByUserId);
      const legacyEntry = this.convertToLegacyFormat(updatedEntry);

      // Update local state
      this.enhancedEntries = this.enhancedEntries.map(entry =>
        entry.id === id ? updatedEntry : entry
      );
      this.legacyEntries = this.legacyEntries.map(entry =>
        entry.id === id ? legacyEntry : entry
      );

      return updatedEntry;
    } catch (error) {
      console.error('Error posting journal entry:', error);
      throw error;
    }
  }

  async reverseJournalEntry(id: string, reversedByUserId: string, description?: string): Promise<EnhancedJournalEntry> {
    try {
      const reversalEntry = await journalEntriesService.reverseJournalEntry(id, reversedByUserId, description);
      const legacyEntry = this.convertToLegacyFormat(reversalEntry);

      // Update local state
      this.enhancedEntries.push(reversalEntry);
      this.legacyEntries.push(legacyEntry);

      return reversalEntry;
    } catch (error) {
      console.error('Error reversing journal entry:', error);
      throw error;
    }
  }

  async createQuickEntry(data: QuickEntryData): Promise<EnhancedJournalEntry> {
    try {
      const newEntry = await journalEntriesService.createQuickEntry(data);
      const legacyEntry = this.convertToLegacyFormat(newEntry);

      // Update local state
      this.enhancedEntries.push(newEntry);
      this.legacyEntries.push(legacyEntry);

      return newEntry;
    } catch (error) {
      console.error('Error creating quick entry:', error);
      throw error;
    }
  }

  // Fiscal Period helpers
  async getCurrentFiscalPeriodId(): Promise<string> {
    try {
      const currentPeriod = await journalEntriesService.getCurrentFiscalPeriod();
      if (!currentPeriod) {
        // Create default current period if none exists
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const startDate = new Date(currentYear, currentMonth - 1, 1);
        const endDate = new Date(currentYear, currentMonth, 0);

        const period = await journalEntriesService.createFiscalPeriod({
          name: `${startDate.toLocaleString('default', { month: 'long' })} ${currentYear}`,
          type: 'MONTH' as any,
          year: currentYear,
          period: currentMonth,
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        });

        this.fiscalPeriods.push(period);
        return period.id;
      }
      return currentPeriod.id;
    } catch (error) {
      console.error('Error getting current fiscal period:', error);
      return 'default_period'; // Fallback
    }
  }

  async createFiscalPeriod(data: {
    name: string;
    type: any;
    year: number;
    period: number;
    startDate: string;
    endDate: string;
  }): Promise<FiscalPeriod> {
    try {
      const newPeriod = await journalEntriesService.createFiscalPeriod(data);
      this.fiscalPeriods.push(newPeriod);
      return newPeriod;
    } catch (error) {
      console.error('Error creating fiscal period:', error);
      throw error;
    }
  }

  async generateFiscalPeriodsForYear(year: number): Promise<FiscalPeriod[]> {
    try {
      const newPeriods = await journalEntriesService.generateFiscalPeriodsForYear(year);
      this.fiscalPeriods.push(...newPeriods);
      return newPeriods;
    } catch (error) {
      console.error('Error generating fiscal periods:', error);
      throw error;
    }
  }

  // Utility functions
  async getTemplates(): Promise<any> {
    try {
      return await journalEntriesService.getTemplates();
    } catch (error) {
      console.error('Error fetching templates:', error);
      return {};
    }
  }
}

// Export a singleton instance
export const journalEntriesManager = new JournalEntriesManager();
export default journalEntriesManager;