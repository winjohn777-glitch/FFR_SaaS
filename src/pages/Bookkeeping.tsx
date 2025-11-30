import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BookOpen, Plus, Calendar, Calculator, FileText, DollarSign, BarChart3, CheckSquare, Save, X, Trash2, Edit, CreditCard, Truck, Receipt, ArrowDownRight, ArrowUpRight, Zap, Home, Shield, Car } from 'lucide-react';
import { useData, JournalEntry as DataContextJournalEntry, JournalEntryLine as DataContextJournalEntryLine } from '../contexts/DataContext';
import chartOfAccountsData from '../data/chartOfAccounts.json';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TabsContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TabsList = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  overflow-x: auto;

  @media (max-width: 768px) {
    gap: 0;
  }
`;

const Tab = styled.button<{ isActive: boolean }>`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: none;
  background: none;
  color: ${({ theme, isActive }) => isActive ? theme.colors.primary : theme.colors.text.secondary};
  font-weight: ${({ isActive }) => isActive ? '600' : '500'};
  cursor: pointer;
  border-bottom: 2px solid ${({ theme, isActive }) => isActive ? theme.colors.primary : 'transparent'};
  transition: all 0.2s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const TabContent = styled.div`
  min-height: 400px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ActionCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ActionIcon = styled.div`
  width: 48px;
  height: 48px;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.primary}15;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
`;

const ActionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ActionDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const DataList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const DataItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const InfoBox = styled.div`
  background: ${({ theme }) => theme.colors.primary}10;
  border: 1px solid ${({ theme }) => theme.colors.primary}30;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const InfoTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const InfoText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const PlaceholderCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
  border: 2px dashed ${({ theme }) => theme.colors.border};
`;

const PlaceholderIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.text.light}20;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.light};
`;

const PlaceholderText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.125rem;
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background-color: ${({ theme }) => theme.colors.surface};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background-color: ${({ theme }) => theme.colors.surface};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background-color: ${({ theme }) => theme.colors.surface};
  min-height: 80px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  background-color: ${({ theme, variant = 'primary' }) => {
    switch (variant) {
      case 'secondary': return theme.colors.background;
      case 'danger': return theme.colors.error;
      default: return theme.colors.primary;
    }
  }};
  color: ${({ theme, variant = 'primary' }) =>
    variant === 'secondary' ? theme.colors.text.primary : 'white'
  };
  border: 1px solid ${({ theme, variant = 'primary' }) => {
    switch (variant) {
      case 'secondary': return theme.colors.border;
      case 'danger': return theme.colors.error;
      default: return theme.colors.primary;
    }
  }};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme, variant = 'primary' }) => {
      switch (variant) {
        case 'secondary': return theme.colors.border;
        case 'danger': return `${theme.colors.error}dd`;
        default: return `${theme.colors.primary}dd`;
      }
    }};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const JournalLineItem = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: end;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const JournalContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const JournalHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Summary = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryItem = styled.div`
  text-align: center;
`;

const SummaryLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SummaryValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

interface JournalLine {
  account: string;
  debit: number;
  credit: number;
  description?: string;
}

interface TransactionTemplate {
  type: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
  accounts: {
    debit: string;
    credit: string;
  };
  prompts: {
    amount: string;
    description?: string;
    vendor?: string;
    reference?: string;
  };
  autoDescription?: (data: any) => string;
}

interface QuickEntryData {
  type: string;
  amount: number;
  description: string;
  vendor?: string;
  reference?: string;
  account_override?: string;
}

// Local interface for form management (different from DataContext)
interface LocalJournalEntry {
  id: string;
  date: string;
  description: string;
  lines: JournalLine[];
  total: number;
  status: 'draft' | 'posted';
}

const Bookkeeping: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showJournalForm, setShowJournalForm] = useState(false);
  const [journalLines, setJournalLines] = useState<JournalLine[]>([
    { account: '', debit: 0, credit: 0, description: '' }
  ]);
  const [journalEntry, setJournalEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    reference: ''
  });
  const [transaction, setTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    account: '',
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: '',
    reference: ''
  });
  const [accountsUpdated, setAccountsUpdated] = useState(0);
  const [selectedJournalEntry, setSelectedJournalEntry] = useState<DataContextJournalEntry | null>(null);
  const [showJournalDetails, setShowJournalDetails] = useState(false);
  const [showQuickEntry, setShowQuickEntry] = useState(false);
  const [showTransactionWizard, setShowTransactionWizard] = useState(false);
  const [selectedTransactionType, setSelectedTransactionType] = useState<string>('');
  const [quickEntryData, setQuickEntryData] = useState<QuickEntryData>({
    type: '',
    amount: 0,
    description: '',
    vendor: '',
    reference: ''
  });

  const {
    journalEntries,
    transactions,
    accounts,
    addJournalEntry
  } = useData();

  // Transaction Templates for Common Entries
  const transactionTemplates: TransactionTemplate[] = [
    {
      type: 'truck_payment',
      name: 'Vehicle Loan Payment',
      description: 'Monthly truck or vehicle loan payment',
      icon: Truck,
      accounts: {
        debit: '2100', // Vehicle Loan (liability - reduces with debit)
        credit: '1010'  // Checking Account (asset - reduces with credit)
      },
      prompts: {
        amount: 'Enter payment amount',
        reference: 'Loan reference or check number',
        vendor: 'Lender name (optional)'
      },
      autoDescription: (data) => `Vehicle loan payment - ${data.vendor || 'monthly payment'} - ${data.reference || ''}`
    },
    {
      type: 'fuel_expense',
      name: 'Vehicle Fuel Purchase',
      description: 'Gas station fuel purchases',
      icon: Car,
      accounts: {
        debit: '6040', // Vehicle Fuel (expense - increases with debit)
        credit: '1010'  // Checking Account (asset - reduces with credit)
      },
      prompts: {
        amount: 'Enter fuel cost',
        vendor: 'Gas station name',
        reference: 'Receipt number (optional)'
      },
      autoDescription: (data) => `Fuel purchase - ${data.vendor} - ${data.reference || ''}`
    },
    {
      type: 'customer_payment',
      name: 'Customer Payment Received',
      description: 'Payment received from customer',
      icon: ArrowDownRight,
      accounts: {
        debit: '1010', // Checking Account (asset - increases with debit)
        credit: '1100'  // Accounts Receivable (asset - reduces with credit)
      },
      prompts: {
        amount: 'Enter payment amount',
        vendor: 'Customer name',
        reference: 'Invoice or check number'
      },
      autoDescription: (data) => `Payment received from ${data.vendor} - ${data.reference || ''}`
    },
    {
      type: 'utility_payment',
      name: 'Utility Payment',
      description: 'Electric, water, internet payments',
      icon: Zap,
      accounts: {
        debit: '6020', // Utilities (expense - increases with debit)
        credit: '1010'  // Checking Account (asset - reduces with credit)
      },
      prompts: {
        amount: 'Enter utility bill amount',
        vendor: 'Utility company name',
        reference: 'Bill number or account reference'
      },
      autoDescription: (data) => `Utility payment - ${data.vendor} - ${data.reference || ''}`
    },
    {
      type: 'rent_payment',
      name: 'Office Rent Payment',
      description: 'Monthly office rent payment',
      icon: Home,
      accounts: {
        debit: '6010', // Office Rent (expense - increases with debit)
        credit: '1010'  // Checking Account (asset - reduces with credit)
      },
      prompts: {
        amount: 'Enter rent amount',
        vendor: 'Landlord or property management',
        reference: 'Month/year or check number'
      },
      autoDescription: (data) => `Office rent payment - ${data.reference || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
    },
    {
      type: 'insurance_payment',
      name: 'Insurance Payment',
      description: 'Business insurance payments',
      icon: Shield,
      accounts: {
        debit: '6030', // Insurance - General Liability (expense - increases with debit)
        credit: '1010'  // Checking Account (asset - reduces with credit)
      },
      prompts: {
        amount: 'Enter insurance premium',
        vendor: 'Insurance company name',
        reference: 'Policy number or period'
      },
      autoDescription: (data) => `Insurance payment - ${data.vendor} - ${data.reference || ''}`
    },
    {
      type: 'supplier_payment',
      name: 'Supplier Payment',
      description: 'Payment to material suppliers',
      icon: Receipt,
      accounts: {
        debit: '2010', // Accounts Payable (liability - reduces with debit)
        credit: '1010'  // Checking Account (asset - reduces with credit)
      },
      prompts: {
        amount: 'Enter payment amount',
        vendor: 'Supplier name',
        reference: 'Invoice or check number'
      },
      autoDescription: (data) => `Supplier payment - ${data.vendor} - ${data.reference || ''}`
    }
  ];

  // Get accounts from DataContext (dynamic) or fallback to static JSON
  const getAvailableAccounts = () => {
    // If DataContext has accounts, use those (they are dynamically managed)
    if (accounts && accounts.length > 0) {
      return accounts
        .filter(account => account.is_active)
        .map(account => ({
          code: account.code,
          name: account.name,
          category: account.category,
          type: account.type
        }))
        .sort((a, b) => a.code.localeCompare(b.code));
    }

    // Fallback to static JSON data if DataContext is empty
    const flatAccounts: Array<{code: string, name: string, category: string, type: string}> = [];
    Object.entries(chartOfAccountsData.chartOfAccounts).forEach(([categoryCode, category]: [string, any]) => {
      Object.entries(category.accounts).forEach(([accountCode, account]: [string, any]) => {
        flatAccounts.push({
          code: accountCode,
          name: account.name,
          category: category.category,
          type: account.type || category.category
        });
      });
    });
    return flatAccounts.sort((a, b) => a.code.localeCompare(b.code));
  };

  const availableAccounts = getAvailableAccounts();

  // Listen for account updates from Chart of Accounts
  useEffect(() => {
    const handleAccountUpdate = (event: CustomEvent) => {
      console.log('📊 Bookkeeping: Received account update notification', event.detail);
      // Force re-render to pick up new accounts
      setAccountsUpdated(prev => prev + 1);
    };

    // Listen for custom events from Chart of Accounts
    window.addEventListener('accountDataUpdated' as any, handleAccountUpdate);

    return () => {
      window.removeEventListener('accountDataUpdated' as any, handleAccountUpdate);
    };
  }, []);

  // Listen for changes in accounts from DataContext
  useEffect(() => {
    console.log('📊 Bookkeeping: Accounts in DataContext updated, count:', accounts.length);
    setAccountsUpdated(prev => prev + 1);
  }, [accounts]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'journal', label: 'Journal Entries', icon: BookOpen },
    { id: 'reconciliation', label: 'Reconciliation', icon: CheckSquare },
    { id: 'reports', label: 'Financial Reports', icon: FileText },
    { id: 'closing', label: 'Period Closing', icon: Calendar }
  ];

  // Helper functions for journal entry management
  const addJournalLine = () => {
    setJournalLines([...journalLines, { account: '', debit: 0, credit: 0, description: '' }]);
  };

  const removeJournalLine = (index: number) => {
    if (journalLines.length > 1) {
      setJournalLines(journalLines.filter((_, i) => i !== index));
    }
  };

  const updateJournalLine = (index: number, field: keyof JournalLine, value: string | number) => {
    const updatedLines = journalLines.map((line, i) => {
      if (i === index) {
        return { ...line, [field]: value };
      }
      return line;
    });
    setJournalLines(updatedLines);
  };

  // Smart Entry Functions
  const handleQuickEntryOpen = (transactionType: string) => {
    const template = transactionTemplates.find(t => t.type === transactionType);
    if (template) {
      setSelectedTransactionType(transactionType);
      setQuickEntryData({
        type: transactionType,
        amount: 0,
        description: '',
        vendor: '',
        reference: ''
      });
      setShowQuickEntry(true);
    }
  };

  const handleQuickEntrySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const template = transactionTemplates.find(t => t.type === quickEntryData.type);
    if (!template) {
      alert('Invalid transaction template');
      return;
    }

    if (!quickEntryData.amount || quickEntryData.amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // Get account information
    const debitAccount = availableAccounts.find(acc => acc.code === template.accounts.debit);
    const creditAccount = availableAccounts.find(acc => acc.code === template.accounts.credit);

    if (!debitAccount || !creditAccount) {
      alert('Required accounts not found in chart of accounts');
      return;
    }

    // Generate auto description if function provided
    const description = template.autoDescription
      ? template.autoDescription(quickEntryData)
      : quickEntryData.description;

    // Create journal entry with automatic double-entry
    const entryId = `QE-${Date.now()}`;
    const entryNumber = `JE-${new Date().getFullYear()}-${(journalEntries.length + 1).toString().padStart(3, '0')}`;

    const dataContextLines: DataContextJournalEntryLine[] = [
      {
        id: `${entryId}-L1`,
        account_id: template.accounts.debit,
        account_name: debitAccount.name,
        account_code: template.accounts.debit,
        debit_amount: quickEntryData.amount,
        credit_amount: 0,
        description: description
      },
      {
        id: `${entryId}-L2`,
        account_id: template.accounts.credit,
        account_name: creditAccount.name,
        account_code: template.accounts.credit,
        debit_amount: 0,
        credit_amount: quickEntryData.amount,
        description: description
      }
    ];

    const newEntry: DataContextJournalEntry = {
      id: entryId,
      entry_number: entryNumber,
      date: new Date().toISOString().split('T')[0],
      description: description,
      reference: quickEntryData.reference || '',
      lines: dataContextLines,
      status: 'posted',
      created_date: new Date().toISOString(),
      posted_date: new Date().toISOString()
    };

    // Save to DataContext
    addJournalEntry(newEntry);
    console.log('📘 Quick journal entry saved:', newEntry);

    // Success message with details
    alert(`✅ ${template.name} recorded successfully!\nEntry #: ${entryNumber}\nAmount: $${quickEntryData.amount.toLocaleString()}\n\nAccounts:\n• Debit: ${debitAccount.code} - ${debitAccount.name}\n• Credit: ${creditAccount.code} - ${creditAccount.name}`);

    // Close modal and reset
    setShowQuickEntry(false);
    setQuickEntryData({
      type: '',
      amount: 0,
      description: '',
      vendor: '',
      reference: ''
    });
  };

  const handleCloseQuickEntry = () => {
    setShowQuickEntry(false);
    setQuickEntryData({
      type: '',
      amount: 0,
      description: '',
      vendor: '',
      reference: ''
    });
  };

  const calculateTotals = () => {
    const totalDebits = journalLines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const totalCredits = journalLines.reduce((sum, line) => sum + (line.credit || 0), 0);
    return { totalDebits, totalCredits, difference: totalDebits - totalCredits };
  };

  const handleSaveJournalEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const { totalDebits, totalCredits } = calculateTotals();

    if (totalDebits !== totalCredits) {
      alert('Journal entry must balance! Total debits must equal total credits.');
      return;
    }

    if (!journalEntry.description.trim()) {
      alert('Please enter a description for this journal entry.');
      return;
    }

    // Filter and validate lines
    const validLines = journalLines.filter(line => line.account && (line.debit > 0 || line.credit > 0));

    if (validLines.length < 2) {
      alert('Please enter at least two account lines for a valid journal entry.');
      return;
    }

    // Generate entry number
    const entryId = `JE-${Date.now()}`;
    const entryNumber = `JE-${new Date().getFullYear()}-${(journalEntries.length + 1).toString().padStart(3, '0')}`;

    // Convert lines to DataContext format
    const dataContextLines: DataContextJournalEntryLine[] = validLines.map((line, index) => {
      const account = availableAccounts.find(acc => acc.code === line.account);
      return {
        id: `${entryId}-L${index + 1}`,
        account_id: line.account,
        account_name: account ? account.name : line.account,
        account_code: line.account,
        debit_amount: line.debit || 0,
        credit_amount: line.credit || 0,
        description: line.description || journalEntry.description
      };
    });

    // Create new journal entry for DataContext
    const newEntry: DataContextJournalEntry = {
      id: entryId,
      entry_number: entryNumber,
      date: journalEntry.date,
      description: journalEntry.description,
      reference: journalEntry.reference || '',
      lines: dataContextLines,
      status: 'posted',
      created_date: new Date().toISOString(),
      posted_date: new Date().toISOString()
    };

    // Save to DataContext
    addJournalEntry(newEntry);
    console.log('📘 Journal entry saved to DataContext:', newEntry);

    // Success message
    alert(`Journal entry saved successfully!\nEntry #: ${entryNumber}\nTotal: $${totalDebits.toLocaleString()}`);

    // Reset form
    setShowJournalForm(false);
    setJournalLines([{ account: '', debit: 0, credit: 0, description: '' }]);
    setJournalEntry({
      date: new Date().toISOString().split('T')[0],
      description: '',
      reference: ''
    });
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();

    if (!transaction.description.trim() || !transaction.account || !transaction.amount) {
      alert('Please fill in all required fields.');
      return;
    }

    const newTransaction = {
      id: `TXN-${Date.now()}`,
      ...transaction,
      amount: parseFloat(transaction.amount),
      created: new Date().toISOString()
    };

    console.log('Saving transaction:', newTransaction);
    alert(`Transaction recorded successfully!\nAmount: $${newTransaction.amount}\nAccount: ${newTransaction.account}`);

    // Reset form
    setTransaction({
      date: new Date().toISOString().split('T')[0],
      description: '',
      account: '',
      amount: '',
      type: 'expense',
      category: '',
      reference: ''
    });
  };

  const handleJournalEntryClick = (entry: DataContextJournalEntry) => {
    setSelectedJournalEntry(entry);
    setShowJournalDetails(true);
  };

  const handleCloseJournalDetails = () => {
    setShowJournalDetails(false);
    setSelectedJournalEntry(null);
  };

  const renderDashboard = () => (
    <div>
      <InfoBox>
        <InfoTitle>Complete Bookkeeping System</InfoTitle>
        <InfoText>
          Comprehensive accounting functionality including journal entries, account reconciliation,
          financial reporting, and month-end closing procedures. Account data is synchronized with Chart of Accounts in real-time.
        </InfoText>
      </InfoBox>

      <Grid>
        <ActionCard onClick={() => { setActiveTab('journal'); setShowJournalForm(true); }}>
          <ActionIcon>
            <Plus size={24} />
          </ActionIcon>
          <ActionTitle>Record Journal Entry</ActionTitle>
          <ActionDescription>
            Create new journal entries with debits and credits
          </ActionDescription>
        </ActionCard>

        <ActionCard onClick={() => setActiveTab('reconciliation')}>
          <ActionIcon>
            <CheckSquare size={24} />
          </ActionIcon>
          <ActionTitle>Bank Reconciliation</ActionTitle>
          <ActionDescription>
            Reconcile bank accounts and resolve discrepancies
          </ActionDescription>
        </ActionCard>

        <ActionCard onClick={() => setActiveTab('reports')}>
          <ActionIcon>
            <BarChart3 size={24} />
          </ActionIcon>
          <ActionTitle>Trial Balance</ActionTitle>
          <ActionDescription>
            Generate trial balance and financial statements
          </ActionDescription>
        </ActionCard>

        <ActionCard onClick={() => setActiveTab('closing')}>
          <ActionIcon>
            <Calendar size={24} />
          </ActionIcon>
          <ActionTitle>Month-End Close</ActionTitle>
          <ActionDescription>
            Perform monthly closing procedures and adjustments
          </ActionDescription>
        </ActionCard>
      </Grid>

      <Card>
        <SectionTitle>Quick Entry - Common Transactions</SectionTitle>
        <InfoText style={{ marginBottom: '20px' }}>
          Fast entry for common transactions with automatic double-entry bookkeeping.
          Select a transaction type below and we'll handle the account selection for you.
        </InfoText>
        <Grid style={{ marginBottom: '0' }}>
          {transactionTemplates.slice(0, 6).map((template) => {
            const IconComponent = template.icon;
            return (
              <ActionCard key={template.type} onClick={() => handleQuickEntryOpen(template.type)}>
                <ActionIcon>
                  <IconComponent size={20} />
                </ActionIcon>
                <ActionTitle style={{ fontSize: '14px' }}>{template.name}</ActionTitle>
                <ActionDescription style={{ fontSize: '12px' }}>
                  {template.description}
                </ActionDescription>
              </ActionCard>
            );
          })}
        </Grid>
      </Card>

      <Card>
        <SectionTitle>Recent Activity</SectionTitle>
        <DataList>
          {journalEntries.slice(0, 5).map((entry) => (
            <DataItem key={entry.id}>
              <strong>{entry.entry_number}</strong> - {entry.description}
              <br />
              <small>Date: {entry.date} | Status: {entry.status}</small>
            </DataItem>
          ))}
          {journalEntries.length === 0 && (
            <DataItem>
              <em>No recent journal entries</em>
            </DataItem>
          )}
        </DataList>
      </Card>
    </div>
  );

  const renderJournalEntries = () => {
    const { totalDebits, totalCredits, difference } = calculateTotals();

    return (
      <div>
        {/* New Journal Entry Form */}
        {showJournalForm && (
          <Card>
            <SectionTitle>Create New Journal Entry</SectionTitle>
            <Form onSubmit={handleSaveJournalEntry}>
              <FormRow>
                <FormGroup>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={journalEntry.date}
                    onChange={(e) => setJournalEntry({...journalEntry, date: e.target.value})}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Reference</Label>
                  <Input
                    type="text"
                    placeholder="Reference number (optional)"
                    value={journalEntry.reference}
                    onChange={(e) => setJournalEntry({...journalEntry, reference: e.target.value})}
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label>Description</Label>
                <TextArea
                  placeholder="Describe this journal entry..."
                  value={journalEntry.description}
                  onChange={(e) => setJournalEntry({...journalEntry, description: e.target.value})}
                  required
                />
              </FormGroup>

              <JournalContainer>
                <JournalHeader>
                  <SectionTitle>Account Lines</SectionTitle>
                  <Button type="button" variant="secondary" onClick={addJournalLine}>
                    <Plus size={16} />
                    Add Line
                  </Button>
                </JournalHeader>

                {journalLines.map((line, index) => (
                  <JournalLineItem key={index}>
                    <FormGroup>
                      <Label>Account</Label>
                      <Select
                        value={line.account}
                        onChange={(e) => updateJournalLine(index, 'account', e.target.value)}
                        required
                      >
                        <option value="">Select Account</option>
                        {availableAccounts.map((account) => (
                          <option key={account.code} value={account.code}>
                            {account.code} - {account.name}
                          </option>
                        ))}
                      </Select>
                    </FormGroup>
                    <FormGroup>
                      <Label>Debit</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={line.debit || ''}
                        onChange={(e) => updateJournalLine(index, 'debit', parseFloat(e.target.value) || 0)}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Credit</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={line.credit || ''}
                        onChange={(e) => updateJournalLine(index, 'credit', parseFloat(e.target.value) || 0)}
                      />
                    </FormGroup>
                    {journalLines.length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => removeJournalLine(index)}
                        style={{ alignSelf: 'end' }}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </JournalLineItem>
                ))}

                <Summary>
                  <SummaryItem>
                    <SummaryLabel>Total Debits</SummaryLabel>
                    <SummaryValue>${totalDebits.toFixed(2)}</SummaryValue>
                  </SummaryItem>
                  <SummaryItem>
                    <SummaryLabel>Total Credits</SummaryLabel>
                    <SummaryValue>${totalCredits.toFixed(2)}</SummaryValue>
                  </SummaryItem>
                  <SummaryItem>
                    <SummaryLabel>Difference</SummaryLabel>
                    <SummaryValue style={{ color: difference === 0 ? '#22c55e' : '#ef4444' }}>
                      ${Math.abs(difference).toFixed(2)}
                    </SummaryValue>
                  </SummaryItem>
                </Summary>
              </JournalContainer>

              <ButtonGroup>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowJournalForm(false)}
                >
                  <X size={16} />
                  Cancel
                </Button>
                <Button type="submit" disabled={difference !== 0}>
                  <Save size={16} />
                  Save Entry
                </Button>
              </ButtonGroup>
            </Form>
          </Card>
        )}

        {/* Existing Journal Entries */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <SectionTitle>Journal Entries ({journalEntries.length})</SectionTitle>
            {!showJournalForm && (
              <Button onClick={() => setShowJournalForm(true)}>
                <Plus size={16} />
                New Entry
              </Button>
            )}
          </div>
          <DataList>
            {journalEntries.map((entry) => (
              <DataItem key={entry.id} onClick={() => handleJournalEntryClick(entry)} style={{ cursor: 'pointer' }}>
                <strong>{entry.entry_number}</strong> - {entry.description}
                <br />
                <small>Date: {entry.date} | Status: {entry.status} | Lines: {entry.lines.length}</small>
              </DataItem>
            ))}
            {journalEntries.length === 0 && (
              <PlaceholderCard>
                <PlaceholderIcon>
                  <BookOpen size={32} />
                </PlaceholderIcon>
                <PlaceholderText>No journal entries found</PlaceholderText>
                <Button
                  style={{ marginTop: '16px' }}
                  onClick={() => setShowJournalForm(true)}
                >
                  <Plus size={16} />
                  Create First Entry
                </Button>
              </PlaceholderCard>
            )}
          </DataList>
        </Card>

        {/* Journal Entry Details Modal */}
        {showJournalDetails && selectedJournalEntry && (
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <SectionTitle>Journal Entry Details</SectionTitle>
              <Button variant="secondary" onClick={handleCloseJournalDetails}>
                <X size={16} />
                Close
              </Button>
            </div>

            {/* Entry Header Information */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <div>
                <strong>Entry Number:</strong><br />
                {selectedJournalEntry.entry_number}
              </div>
              <div>
                <strong>Date:</strong><br />
                {selectedJournalEntry.date}
              </div>
              <div>
                <strong>Status:</strong><br />
                <span style={{ textTransform: 'capitalize', color: selectedJournalEntry.status === 'posted' ? '#28a745' : '#ffc107' }}>
                  {selectedJournalEntry.status}
                </span>
              </div>
              {selectedJournalEntry.reference && (
                <div>
                  <strong>Reference:</strong><br />
                  {selectedJournalEntry.reference}
                </div>
              )}
            </div>

            {/* Entry Description */}
            <div style={{ marginBottom: '1.5rem' }}>
              <strong>Description:</strong>
              <div style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                {selectedJournalEntry.description}
              </div>
            </div>

            {/* Account Lines Table */}
            <div style={{ marginBottom: '1rem' }}>
              <strong>Account Lines:</strong>
              <div style={{ marginTop: '0.5rem', overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #dee2e6' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}>
                      <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'left' }}>Account</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right' }}>Debit</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right' }}>Credit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedJournalEntry.lines.map((line, index) => {
                      const account = availableAccounts.find(acc => acc.code === line.account_code);
                      return (
                        <tr key={index}>
                          <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>
                            {line.account_code} - {account?.name || 'Unknown Account'}
                          </td>
                          <td style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right' }}>
                            {line.debit_amount > 0 ? `$${line.debit_amount.toFixed(2)}` : ''}
                          </td>
                          <td style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right' }}>
                            {line.credit_amount > 0 ? `$${line.credit_amount.toFixed(2)}` : ''}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                      <td style={{ padding: '0.75rem', border: '1px solid #dee2e6' }}>Totals:</td>
                      <td style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        ${selectedJournalEntry.lines.reduce((sum, line) => sum + line.debit_amount, 0).toFixed(2)}
                      </td>
                      <td style={{ padding: '0.75rem', border: '1px solid #dee2e6', textAlign: 'right' }}>
                        ${selectedJournalEntry.lines.reduce((sum, line) => sum + line.credit_amount, 0).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Balance Verification */}
            {(() => {
              const totalDebits = selectedJournalEntry.lines.reduce((sum, line) => sum + line.debit_amount, 0);
              const totalCredits = selectedJournalEntry.lines.reduce((sum, line) => sum + line.credit_amount, 0);
              const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

              return (
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '4px',
                  backgroundColor: isBalanced ? '#d4edda' : '#f8d7da',
                  color: isBalanced ? '#155724' : '#721c24',
                  border: `1px solid ${isBalanced ? '#c3e6cb' : '#f5c6cb'}`
                }}>
                  <strong>Entry Balance:</strong> {isBalanced ? '✓ Balanced' : '⚠ Unbalanced'}
                  {!isBalanced && (
                    <span style={{ marginLeft: '1rem' }}>
                      Difference: ${Math.abs(totalDebits - totalCredits).toFixed(2)}
                    </span>
                  )}
                </div>
              );
            })()}
          </Card>
        )}
      </div>
    );
  };

  const renderTransactionRecording = () => {
    return (
      <div>
        <Card>
          <SectionTitle>Record Transaction</SectionTitle>
          <Form onSubmit={handleSaveTransaction}>
            <FormRow>
              <FormGroup>
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={transaction.date}
                  onChange={(e) => setTransaction({...transaction, date: e.target.value})}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Type *</Label>
                <Select
                  value={transaction.type}
                  onChange={(e) => setTransaction({...transaction, type: e.target.value as 'income' | 'expense'})}
                  required
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </Select>
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>Account *</Label>
                <Select
                  value={transaction.account}
                  onChange={(e) => setTransaction({...transaction, account: e.target.value})}
                  required
                >
                  <option value="">Select Account</option>
                  {availableAccounts
                    .filter(account => transaction.type === 'income'
                      ? account.category === 'REVENUE' || account.category === 'Operating Revenue'
                      : account.category === 'OPERATING EXPENSES' || account.category === 'Operating Expenses')
                    .map((account) => (
                      <option key={account.code} value={account.code}>
                        {account.code} - {account.name}
                      </option>
                    ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Amount *</Label>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={transaction.amount}
                  onChange={(e) => setTransaction({...transaction, amount: e.target.value})}
                  required
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>Category</Label>
                <Select
                  value={transaction.category}
                  onChange={(e) => setTransaction({...transaction, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  <option value="materials">Materials</option>
                  <option value="labor">Labor</option>
                  <option value="equipment">Equipment</option>
                  <option value="vehicle">Vehicle</option>
                  <option value="office">Office</option>
                  <option value="insurance">Insurance</option>
                  <option value="marketing">Marketing</option>
                  <option value="other">Other</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>Reference</Label>
                <Input
                  type="text"
                  placeholder="Invoice#, Check#, etc."
                  value={transaction.reference}
                  onChange={(e) => setTransaction({...transaction, reference: e.target.value})}
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>Description *</Label>
              <TextArea
                placeholder="Describe this transaction..."
                value={transaction.description}
                onChange={(e) => setTransaction({...transaction, description: e.target.value})}
                required
              />
            </FormGroup>

            <ButtonGroup>
              <Button type="submit">
                <Save size={16} />
                Record Transaction
              </Button>
            </ButtonGroup>
          </Form>
        </Card>

        <Card>
          <SectionTitle>Recent Transactions ({transactions.length})</SectionTitle>
          <DataList>
            {transactions.slice(0, 10).map((transaction) => (
              <DataItem key={transaction.id}>
                <strong>${transaction.total_amount}</strong> - {transaction.description}
                <br />
                <small>
                  Date: {transaction.transaction_date} | Type: {transaction.transaction_type}
                </small>
              </DataItem>
            ))}
            {transactions.length === 0 && (
              <PlaceholderCard>
                <PlaceholderIcon>
                  <DollarSign size={32} />
                </PlaceholderIcon>
                <PlaceholderText>No transactions found</PlaceholderText>
              </PlaceholderCard>
            )}
          </DataList>
        </Card>
      </div>
    );
  };

  const renderTrialBalance = () => {
    // Generate sample account balances based on chart of accounts
    const accountBalances = availableAccounts.map(account => {
      // Generate some sample balances for demonstration
      let balance = 0;

      switch (account.category) {
        case 'Current Assets':
        case 'Fixed Assets':
        case 'Assets':
          balance = Math.random() * 50000 + 5000;
          break;
        case 'Current Liabilities':
        case 'Long-term Liabilities':
        case 'Liabilities':
          balance = Math.random() * 20000 + 1000;
          break;
        case 'Operating Revenue':
        case 'Revenue':
          balance = Math.random() * 100000 + 10000;
          break;
        case 'Operating Expenses':
        case 'Cost of Goods Sold':
        case 'Expenses':
          balance = Math.random() * 30000 + 2000;
          break;
        case 'Equity':
          balance = Math.random() * 25000 + 5000;
          break;
        default:
          balance = Math.random() * 10000;
      }

      // Determine if this should be a debit or credit balance
      const isDebitAccount = ['Current Assets', 'Fixed Assets', 'Assets', 'Operating Expenses', 'Cost of Goods Sold', 'Expenses'].includes(account.category);

      return {
        ...account,
        balance: Math.round(balance * 100) / 100,
        debitBalance: isDebitAccount ? Math.round(balance * 100) / 100 : 0,
        creditBalance: !isDebitAccount ? Math.round(balance * 100) / 100 : 0
      };
    });

    const totalDebits = accountBalances.reduce((sum, account) => sum + account.debitBalance, 0);
    const totalCredits = accountBalances.reduce((sum, account) => sum + account.creditBalance, 0);
    const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

    return (
      <div>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <SectionTitle>Trial Balance - {new Date().toLocaleDateString()}</SectionTitle>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span style={{
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: isBalanced ? '#22c55e' : '#ef4444',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                {isBalanced ? 'Balanced' : 'Out of Balance'}
              </span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: '600' }}>Account Code</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: '600' }}>Account Name</th>
                  <th style={{ textAlign: 'left', padding: '12px 8px', fontWeight: '600' }}>Category</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', fontWeight: '600' }}>Debit</th>
                  <th style={{ textAlign: 'right', padding: '12px 8px', fontWeight: '600' }}>Credit</th>
                </tr>
              </thead>
              <tbody>
                {accountBalances
                  .filter(account => account.balance > 0)
                  .sort((a, b) => a.code.localeCompare(b.code))
                  .map((account, index) => (
                    <tr key={account.code} style={{
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: index % 2 === 0 ? 'transparent' : '#f8fafc'
                    }}>
                      <td style={{ padding: '12px 8px', fontFamily: 'monospace' }}>{account.code}</td>
                      <td style={{ padding: '12px 8px' }}>{account.name}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: '#f1f5f9',
                          fontSize: '0.75rem',
                          color: '#64748b'
                        }}>
                          {account.category}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontFamily: 'monospace' }}>
                        {account.debitBalance > 0 ? `$${account.debitBalance.toLocaleString()}` : '-'}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right', fontFamily: 'monospace' }}>
                        {account.creditBalance > 0 ? `$${account.creditBalance.toLocaleString()}` : '-'}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
              <tfoot>
                <tr style={{ borderTop: '2px solid #e2e8f0', fontWeight: '600' }}>
                  <td colSpan={3} style={{ padding: '12px 8px' }}>TOTALS</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontFamily: 'monospace' }}>
                    ${totalDebits.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontFamily: 'monospace' }}>
                    ${totalCredits.toLocaleString()}
                  </td>
                </tr>
                <tr style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  <td colSpan={3} style={{ padding: '8px 8px' }}>Difference</td>
                  <td colSpan={2} style={{ padding: '8px 8px', textAlign: 'right', fontFamily: 'monospace' }}>
                    ${Math.abs(totalDebits - totalCredits).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>

        <InfoBox>
          <InfoTitle>Trial Balance Information</InfoTitle>
          <InfoText>
            This trial balance shows all account balances as of today. In a balanced system,
            total debits must equal total credits. This report helps identify posting errors
            and ensures the accounting equation (Assets = Liabilities + Equity) is maintained.
          </InfoText>
        </InfoBox>
      </div>
    );
  };

  const renderPlaceholder = (title: string, description: string, icon: any) => {
    const IconComponent = icon;
    return (
      <PlaceholderCard>
        <PlaceholderIcon>
          <IconComponent size={32} />
        </PlaceholderIcon>
        <PlaceholderText>{title}</PlaceholderText>
        <InfoText style={{ marginTop: '16px' }}>{description}</InfoText>
      </PlaceholderCard>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'journal':
        return renderJournalEntries();
      case 'reconciliation':
        return renderPlaceholder(
          'Bank Reconciliation',
          'Reconciliation functionality will be implemented to match bank statements with book records.',
          CreditCard
        );
      case 'reports':
        return renderPlaceholder(
          'Financial Reports',
          'Trial balance, income statement, and balance sheet generation capabilities coming soon.',
          BarChart3
        );
      case 'closing':
        return renderPlaceholder(
          'Period Closing',
          'Month-end and year-end closing procedures with automated adjusting entries.',
          Calendar
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <Container>
      <Header>
        <Title>
          <BookOpen size={32} />
          Bookkeeping
        </Title>
      </Header>

      <TabsContainer>
        <TabsList>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <Tab
                key={tab.id}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                <IconComponent size={18} />
                {tab.label}
              </Tab>
            );
          })}
        </TabsList>
      </TabsContainer>

      <TabContent>
        {renderTabContent()}
      </TabContent>

      {/* Quick Entry Modal */}
      {showQuickEntry && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <Card style={{ width: '90%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <SectionTitle>
                {transactionTemplates.find(t => t.type === selectedTransactionType)?.name || 'Quick Entry'}
              </SectionTitle>
              <Button variant="secondary" onClick={handleCloseQuickEntry}>
                <X size={16} />
                Close
              </Button>
            </div>

            {selectedTransactionType && (() => {
              const template = transactionTemplates.find(t => t.type === selectedTransactionType);
              if (!template) return null;

              const debitAccount = availableAccounts.find(acc => acc.code === template.accounts.debit);
              const creditAccount = availableAccounts.find(acc => acc.code === template.accounts.credit);

              return (
              <>
                <InfoText style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <strong>What this does:</strong><br />
                  {template.description}
                  <br /><br />
                  <strong>Accounts that will be updated:</strong><br />
                  • <strong>Debit:</strong> {debitAccount?.code} - {debitAccount?.name}<br />
                  • <strong>Credit:</strong> {creditAccount?.code} - {creditAccount?.name}
                </InfoText>

                <Form onSubmit={handleQuickEntrySubmit}>
                  <FormGroup>
                    <Label>Amount *</Label>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder={template.prompts.amount}
                      value={quickEntryData.amount || ''}
                      onChange={(e) => setQuickEntryData({
                        ...quickEntryData,
                        amount: parseFloat(e.target.value) || 0
                      })}
                      required
                    />
                  </FormGroup>

                  {template.prompts.vendor && (
                    <FormGroup>
                      <Label>
                        {template.prompts.vendor.includes('optional') ? 'Vendor/Payee' : 'Vendor/Payee *'}
                      </Label>
                      <Input
                        type="text"
                        placeholder={template.prompts.vendor}
                        value={quickEntryData.vendor || ''}
                        onChange={(e) => setQuickEntryData({
                          ...quickEntryData,
                          vendor: e.target.value
                        })}
                        required={!template.prompts.vendor.includes('optional')}
                      />
                    </FormGroup>
                  )}

                  {template.prompts.reference && (
                    <FormGroup>
                      <Label>
                        {template.prompts.reference.includes('optional') ? 'Reference' : 'Reference *'}
                      </Label>
                      <Input
                        type="text"
                        placeholder={template.prompts.reference}
                        value={quickEntryData.reference || ''}
                        onChange={(e) => setQuickEntryData({
                          ...quickEntryData,
                          reference: e.target.value
                        })}
                        required={!template.prompts.reference.includes('optional')}
                      />
                    </FormGroup>
                  )}

                  {template.prompts.description && (
                    <FormGroup>
                      <Label>Additional Description</Label>
                      <TextArea
                        placeholder="Additional details (optional - auto description will be generated)"
                        value={quickEntryData.description || ''}
                        onChange={(e) => setQuickEntryData({
                          ...quickEntryData,
                          description: e.target.value
                        })}
                      />
                    </FormGroup>
                  )}

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <Button type="submit" variant="primary" style={{ flex: 1 }}>
                      Record Transaction
                    </Button>
                    <Button type="button" variant="secondary" onClick={handleCloseQuickEntry}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              </>
              );
            })()}
          </Card>
        </div>
      )}
    </Container>
  );
};

export default Bookkeeping;
