import type { FinanceContractData } from '../components/Financing/FinanceContractModal';
import apiClient from './ApiClient';

interface JournalEntry {
  id: string;
  date: string;
  description: string;
  reference: string;
  entries: {
    accountCode: string;
    accountName: string;
    debit: number;
    credit: number;
  }[];
  totalDebits: number;
  totalCredits: number;
  type: 'finance-contract' | 'payment' | 'interest-accrual' | 'late-fee';
  contractId?: string;
}

interface PaymentScheduleEntry {
  contractId: string;
  paymentNumber: number;
  dueDate: string;
  principalAmount: number;
  interestAmount: number;
  totalPayment: number;
  remainingBalance: number;
  status: 'pending' | 'paid' | 'overdue';
}

class FinanceContractBookkeepingService {
  private static instance: FinanceContractBookkeepingService;

  private constructor() {}

  static getInstance(): FinanceContractBookkeepingService {
    if (!FinanceContractBookkeepingService.instance) {
      FinanceContractBookkeepingService.instance = new FinanceContractBookkeepingService();
    }
    return FinanceContractBookkeepingService.instance;
  }

  // Create initial journal entry when finance contract is approved
  async createFinanceContractJournalEntry(contractData: FinanceContractData): Promise<JournalEntry> {
    const contractAmount = parseFloat(contractData.totalContractAmount);
    const downPayment = parseFloat(contractData.downPayment || '0');
    const amountFinanced = parseFloat(contractData.amountFinanced);

    const journalEntry: JournalEntry = {
      id: `JE-FC-${Date.now()}`,
      date: contractData.contractDate,
      description: `Finance Contract - ${contractData.customerName}`,
      reference: contractData.contractNumber,
      type: 'finance-contract',
      contractId: contractData.contractNumber,
      entries: [
        // Debit: Notes Receivable for the amount financed
        {
          accountCode: '1650',
          accountName: 'Notes Receivable - Finance Contracts',
          debit: amountFinanced,
          credit: 0
        },
        // Debit: Cash/Checking for down payment (if any)
        ...(downPayment > 0 ? [{
          accountCode: '1010',
          accountName: 'Checking Account - Operating',
          debit: downPayment,
          credit: 0
        }] : []),
        // Credit: Revenue account for total contract amount
        {
          accountCode: this.getRevenueAccountForProject(contractData.projectDescription),
          accountName: this.getRevenueAccountName(contractData.projectDescription),
          debit: 0,
          credit: contractAmount
        }
      ],
      totalDebits: amountFinanced + downPayment,
      totalCredits: contractAmount
    };

    // Save journal entry to database
    try {
      const result = await apiClient.post('/api/finance/journal-entries', journalEntry);
      if (result.error) {
        console.error('Failed to save journal entry:', result.error);
        // Fallback to localStorage temporarily
        await this.saveJournalEntry(journalEntry);
      } else {
        console.log('Journal entry saved to database successfully');
      }
    } catch (error) {
      console.error('Database save failed, using localStorage fallback:', error);
      await this.saveJournalEntry(journalEntry);
    }

    // Create payment schedule
    await this.createPaymentSchedule(contractData);

    return journalEntry;
  }

  // Create payment schedule for the finance contract
  async createPaymentSchedule(contractData: FinanceContractData): Promise<PaymentScheduleEntry[]> {
    const amountFinanced = parseFloat(contractData.amountFinanced);
    const interestRate = parseFloat(contractData.interestRate) / 100 / 12; // Monthly rate
    const numberOfPayments = parseInt(contractData.numberOfPayments);
    const monthlyPayment = parseFloat(contractData.monthlyPaymentAmount);

    const schedule: PaymentScheduleEntry[] = [];
    let remainingBalance = amountFinanced;
    const firstPaymentDate = new Date(contractData.firstPaymentDate);

    for (let i = 1; i <= numberOfPayments; i++) {
      const interestAmount = remainingBalance * interestRate;
      const principalAmount = monthlyPayment - interestAmount;
      remainingBalance = Math.max(0, remainingBalance - principalAmount);

      const dueDate = new Date(firstPaymentDate);
      dueDate.setMonth(firstPaymentDate.getMonth() + (i - 1));

      schedule.push({
        contractId: contractData.contractNumber,
        paymentNumber: i,
        dueDate: dueDate.toISOString().split('T')[0],
        principalAmount: Math.round(principalAmount * 100) / 100,
        interestAmount: Math.round(interestAmount * 100) / 100,
        totalPayment: monthlyPayment,
        remainingBalance: Math.round(remainingBalance * 100) / 100,
        status: 'pending'
      });
    }

    // Save payment schedule to database
    try {
      const result = await apiClient.post('/api/finance/payment-schedules', {
        contractId: contractData.contractNumber,
        schedule
      });
      if (result.error) {
        console.error('Failed to save payment schedule:', result.error);
        // Fallback to localStorage temporarily
        await this.savePaymentSchedule(contractData.contractNumber, schedule);
      } else {
        console.log('Payment schedule saved to database successfully');
      }
    } catch (error) {
      console.error('Database save failed, using localStorage fallback:', error);
      await this.savePaymentSchedule(contractData.contractNumber, schedule);
    }

    return schedule;
  }

  // Record a payment on a finance contract
  async recordPayment(
    contractId: string,
    paymentAmount: number,
    paymentDate: string,
    paymentMethod: string = 'Check'
  ): Promise<JournalEntry> {
    const schedule = await this.getPaymentSchedule(contractId);
    const nextPayment = schedule.find(p => p.status === 'pending');

    if (!nextPayment) {
      throw new Error('No pending payments found for this contract');
    }

    const principalAmount = nextPayment.principalAmount;
    const interestAmount = nextPayment.interestAmount;

    const journalEntry: JournalEntry = {
      id: `JE-FC-PMT-${Date.now()}`,
      date: paymentDate,
      description: `Payment #${nextPayment.paymentNumber} - Contract ${contractId}`,
      reference: `${contractId}-PMT-${nextPayment.paymentNumber}`,
      type: 'payment',
      contractId,
      entries: [
        // Debit: Cash
        {
          accountCode: '1010',
          accountName: 'Checking Account - Operating',
          debit: paymentAmount,
          credit: 0
        },
        // Credit: Notes Receivable (principal portion)
        {
          accountCode: '1650',
          accountName: 'Notes Receivable - Finance Contracts',
          debit: 0,
          credit: principalAmount
        },
        // Credit: Interest Income (interest portion)
        {
          accountCode: '4110',
          accountName: 'Interest Income - Finance Contracts',
          debit: 0,
          credit: interestAmount
        }
      ],
      totalDebits: paymentAmount,
      totalCredits: principalAmount + interestAmount
    };

    // Update payment status
    nextPayment.status = 'paid';

    try {
      // Update payment status in database
      const result = await apiClient.put(`/api/finance/payment-schedules/${contractId}/payment/${nextPayment.paymentNumber}`, {
        status: 'paid'
      });
      if (result.error) {
        console.error('Failed to update payment status in database:', result.error);
        // Fallback to localStorage
        await this.savePaymentSchedule(contractId, schedule);
      }
    } catch (error) {
      console.error('Database update failed, using localStorage fallback:', error);
      await this.savePaymentSchedule(contractId, schedule);
    }

    // Save journal entry
    await this.saveJournalEntry(journalEntry);

    return journalEntry;
  }

  // Record late fee
  async recordLateFee(contractId: string, feeAmount: number, feeDate: string): Promise<JournalEntry> {
    const journalEntry: JournalEntry = {
      id: `JE-FC-LATE-${Date.now()}`,
      date: feeDate,
      description: `Late Payment Fee - Contract ${contractId}`,
      reference: `${contractId}-LATE-${Date.now()}`,
      type: 'late-fee',
      contractId,
      entries: [
        // Debit: Notes Receivable (add to customer balance)
        {
          accountCode: '1650',
          accountName: 'Notes Receivable - Finance Contracts',
          debit: feeAmount,
          credit: 0
        },
        // Credit: Late Payment Fee Income
        {
          accountCode: '4120',
          accountName: 'Late Payment Fees - Finance Contracts',
          debit: 0,
          credit: feeAmount
        }
      ],
      totalDebits: feeAmount,
      totalCredits: feeAmount
    };

    await this.saveJournalEntry(journalEntry);
    return journalEntry;
  }

  // Monthly interest accrual
  async recordInterestAccrual(contractId: string, accrualDate: string): Promise<JournalEntry | null> {
    const schedule = await this.getPaymentSchedule(contractId);
    const currentMonth = new Date(accrualDate);

    // Find payments due in current month
    const monthlyPayments = schedule.filter(p => {
      const paymentDate = new Date(p.dueDate);
      return paymentDate.getMonth() === currentMonth.getMonth() &&
             paymentDate.getFullYear() === currentMonth.getFullYear() &&
             p.status === 'pending';
    });

    if (monthlyPayments.length === 0) {
      return null;
    }

    const totalInterest = monthlyPayments.reduce((sum, p) => sum + p.interestAmount, 0);

    const journalEntry: JournalEntry = {
      id: `JE-FC-ACCRUE-${Date.now()}`,
      date: accrualDate,
      description: `Interest Accrual - Contract ${contractId}`,
      reference: `${contractId}-ACCRUE-${currentMonth.toISOString().slice(0, 7)}`,
      type: 'interest-accrual',
      contractId,
      entries: [
        // Debit: Accrued Interest Receivable
        {
          accountCode: '1670',
          accountName: 'Accrued Interest Receivable',
          debit: totalInterest,
          credit: 0
        },
        // Credit: Interest Income
        {
          accountCode: '4110',
          accountName: 'Interest Income - Finance Contracts',
          debit: 0,
          credit: totalInterest
        }
      ],
      totalDebits: totalInterest,
      totalCredits: totalInterest
    };

    await this.saveJournalEntry(journalEntry);
    return journalEntry;
  }

  // Helper function to determine revenue account based on project type
  private getRevenueAccountForProject(projectDescription: string): string {
    const description = projectDescription.toLowerCase();

    if (description.includes('metal')) return '4090'; // Metal Roofing Revenue
    if (description.includes('shingle')) return '4091'; // Shingle Roofing Revenue
    if (description.includes('tpo')) return '4092'; // TPO Roofing Revenue
    if (description.includes('tile')) return '4093'; // Tile Roofing Revenue
    if (description.includes('commercial')) return '4020'; // Commercial Revenue
    if (description.includes('repair')) return '4030'; // Repair Revenue

    return '4010'; // Default to Residential Revenue
  }

  private getRevenueAccountName(projectDescription: string): string {
    const accountCode = this.getRevenueAccountForProject(projectDescription);
    const accountMap: { [key: string]: string } = {
      '4010': 'Roofing Revenue - Residential',
      '4020': 'Roofing Revenue - Commercial',
      '4030': 'Roof Repair Revenue',
      '4090': 'Metal Roofing Revenue',
      '4091': 'Shingle Roofing Revenue',
      '4092': 'TPO Roofing Revenue',
      '4093': 'Tile Roofing Revenue'
    };
    return accountMap[accountCode] || 'Roofing Revenue - Residential';
  }

  // Storage helper functions (deprecated - use API calls instead)
  private async saveJournalEntry(entry: JournalEntry): Promise<void> {
    console.log('⚠️  saveJournalEntry: This method is deprecated. Use database API calls instead.');
    const existingEntries = JSON.parse(localStorage.getItem('finance-journal-entries') || '[]');
    existingEntries.push(entry);
    localStorage.setItem('finance-journal-entries', JSON.stringify(existingEntries));
  }

  private async savePaymentSchedule(contractId: string, schedule: PaymentScheduleEntry[]): Promise<void> {
    console.log('⚠️  savePaymentSchedule: This method is deprecated. Use database API calls instead.');
    const existingSchedules = JSON.parse(localStorage.getItem('finance-payment-schedules') || '{}');
    existingSchedules[contractId] = schedule;
    localStorage.setItem('finance-payment-schedules', JSON.stringify(existingSchedules));
  }

  async getPaymentSchedule(contractId: string): Promise<PaymentScheduleEntry[]> {
    try {
      const result = await apiClient.get<PaymentScheduleEntry[]>(`/api/finance/payment-schedules/${contractId}`);
      if (result.data) {
        return result.data;
      } else {
        console.error('Failed to fetch payment schedule from database:', result.error);
        // Fallback to localStorage
        console.log('⚠️  Using localStorage fallback for payment schedule');
        const schedules = JSON.parse(localStorage.getItem('finance-payment-schedules') || '{}');
        return schedules[contractId] || [];
      }
    } catch (error) {
      console.error('Database fetch failed:', error);
      console.log('⚠️  Using localStorage fallback for payment schedule');
      const schedules = JSON.parse(localStorage.getItem('finance-payment-schedules') || '{}');
      return schedules[contractId] || [];
    }
  }

  async getJournalEntries(): Promise<JournalEntry[]> {
    try {
      const result = await apiClient.get<JournalEntry[]>('/api/finance/journal-entries');
      if (result.data) {
        return result.data;
      } else {
        console.error('Failed to fetch journal entries from database:', result.error);
        // Fallback to localStorage
        console.log('⚠️  Using localStorage fallback for journal entries');
        return JSON.parse(localStorage.getItem('finance-journal-entries') || '[]');
      }
    } catch (error) {
      console.error('Database fetch failed:', error);
      console.log('⚠️  Using localStorage fallback for journal entries');
      return JSON.parse(localStorage.getItem('finance-journal-entries') || '[]');
    }
  }

  async getContractJournalEntries(contractId: string): Promise<JournalEntry[]> {
    try {
      const result = await apiClient.get<JournalEntry[]>(`/api/finance/journal-entries/contract/${contractId}`);
      if (result.data) {
        return result.data;
      } else {
        console.error('Failed to fetch contract journal entries from database:', result.error);
        // Fallback to localStorage
        console.log('⚠️  Using localStorage fallback for contract journal entries');
        const allEntries = await this.getJournalEntries();
        return allEntries.filter(entry => entry.contractId === contractId);
      }
    } catch (error) {
      console.error('Database fetch failed:', error);
      console.log('⚠️  Using localStorage fallback for contract journal entries');
      const allEntries = await this.getJournalEntries();
      return allEntries.filter(entry => entry.contractId === contractId);
    }
  }

  // Get overdue payments for all contracts
  async getOverduePayments(): Promise<PaymentScheduleEntry[]> {
    try {
      const result = await apiClient.get<PaymentScheduleEntry[]>('/api/finance/payment-schedules/overdue');
      if (result.data) {
        return result.data;
      } else {
        console.error('Failed to fetch overdue payments from database:', result.error);
        // Fallback to localStorage
        console.log('⚠️  Using localStorage fallback for overdue payments');
        return this.getOverduePaymentsFallback();
      }
    } catch (error) {
      console.error('Database fetch failed:', error);
      console.log('⚠️  Using localStorage fallback for overdue payments');
      return this.getOverduePaymentsFallback();
    }
  }

  // Fallback method for localStorage overdue calculation
  private getOverduePaymentsFallback(): PaymentScheduleEntry[] {
    const allSchedules = JSON.parse(localStorage.getItem('finance-payment-schedules') || '{}');
    const today = new Date().toISOString().split('T')[0];
    const overduePayments: PaymentScheduleEntry[] = [];

    Object.values(allSchedules).forEach((schedule: any) => {
      const overdue = schedule.filter((payment: PaymentScheduleEntry) =>
        payment.status === 'pending' && payment.dueDate < today
      );
      overduePayments.push(...overdue);
    });

    return overduePayments;
  }

  // Generate aging report for finance contracts
  async generateAgingReport(): Promise<{
    current: PaymentScheduleEntry[];
    days30: PaymentScheduleEntry[];
    days60: PaymentScheduleEntry[];
    days90: PaymentScheduleEntry[];
    days90Plus: PaymentScheduleEntry[];
  }> {
    try {
      const result = await apiClient.get('/api/finance/aging-report');
      if (result.data && typeof result.data === 'object') {
        return result.data as {
          current: PaymentScheduleEntry[];
          days30: PaymentScheduleEntry[];
          days60: PaymentScheduleEntry[];
          days90: PaymentScheduleEntry[];
          days90Plus: PaymentScheduleEntry[];
        };
      } else {
        console.error('Failed to fetch aging report from database:', result.error);
        // Fallback to localStorage calculation
        console.log('⚠️  Using localStorage fallback for aging report');
        return this.generateAgingReportFallback();
      }
    } catch (error) {
      console.error('Database fetch failed:', error);
      console.log('⚠️  Using localStorage fallback for aging report');
      return this.generateAgingReportFallback();
    }
  }

  // Fallback method for localStorage aging report calculation
  private async generateAgingReportFallback(): Promise<{
    current: PaymentScheduleEntry[];
    days30: PaymentScheduleEntry[];
    days60: PaymentScheduleEntry[];
    days90: PaymentScheduleEntry[];
    days90Plus: PaymentScheduleEntry[];
  }> {
    const overduePayments = await this.getOverduePaymentsFallback();
    const today = new Date();

    return {
      current: overduePayments.filter(p => {
        const daysPastDue = Math.floor((today.getTime() - new Date(p.dueDate).getTime()) / (1000 * 60 * 60 * 24));
        return daysPastDue <= 0;
      }),
      days30: overduePayments.filter(p => {
        const daysPastDue = Math.floor((today.getTime() - new Date(p.dueDate).getTime()) / (1000 * 60 * 60 * 24));
        return daysPastDue >= 1 && daysPastDue <= 30;
      }),
      days60: overduePayments.filter(p => {
        const daysPastDue = Math.floor((today.getTime() - new Date(p.dueDate).getTime()) / (1000 * 60 * 60 * 24));
        return daysPastDue >= 31 && daysPastDue <= 60;
      }),
      days90: overduePayments.filter(p => {
        const daysPastDue = Math.floor((today.getTime() - new Date(p.dueDate).getTime()) / (1000 * 60 * 60 * 24));
        return daysPastDue >= 61 && daysPastDue <= 90;
      }),
      days90Plus: overduePayments.filter(p => {
        const daysPastDue = Math.floor((today.getTime() - new Date(p.dueDate).getTime()) / (1000 * 60 * 60 * 24));
        return daysPastDue > 90;
      })
    };
  }
}

export default FinanceContractBookkeepingService;
export type { JournalEntry, PaymentScheduleEntry };