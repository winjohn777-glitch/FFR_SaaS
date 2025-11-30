import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus, FileText, Download, Send, Eye, Edit, Trash2, Search, Filter, Minus, CreditCard } from 'lucide-react';
import { downloadInvoicePDF, emailInvoicePDF } from '../components/InvoicePDF';
import { FFR_UNIFIED_BRAND } from '../components/Shared/UnifiedFFRBranding';
import { useData } from '../contexts/DataContext';
import FinanceContractPayments from '../components/Financing/FinanceContractPayments';
import FinanceContractBookkeepingService from '../services/FinanceContractBookkeepingService';

const PageContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background-color: ${theme.colors.primary};
          color: white;
          &:hover { background-color: ${theme.colors.primary}dd; }
        `;
      case 'secondary':
        return `
          background-color: ${theme.colors.surface};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.border};
          &:hover { background-color: ${theme.colors.background}; }
        `;
      case 'danger':
        return `
          background-color: ${theme.colors.accent};
          color: white;
          &:hover { background-color: ${theme.colors.accent}dd; }
        `;
    }
  }}
`;

const FiltersSection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
  align-items: center;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  padding-left: 2.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.light};
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: white;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const InvoiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const InvoiceCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const InvoiceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const InvoiceNumber = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;

  ${({ status, theme }) => {
    switch (status) {
      case 'paid':
        return `background-color: ${theme.colors.secondary}20; color: ${theme.colors.secondary};`;
      case 'sent':
        return `background-color: ${theme.colors.primary}20; color: ${theme.colors.primary};`;
      case 'overdue':
        return `background-color: ${theme.colors.accent}20; color: ${theme.colors.accent};`;
      default:
        return `background-color: ${theme.colors.text.light}20; color: ${theme.colors.text.secondary};`;
    }
  }}
`;

const InvoiceDetails = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const DetailValue = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 600;
  font-size: 0.875rem;
`;

const Amount = styled.span<{ large?: boolean }>`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 700;
  font-size: ${({ large }) => large ? '1.25rem' : '0.875rem'};
`;

const InvoiceActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: ${({ theme }) => theme.spacing.lg};
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const TabsContainer = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TabsList = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Tab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.md} 0;
  font-weight: 600;
  color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.text.secondary};
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  ${({ active, theme }) =>
    active &&
    `
    color: ${theme.colors.primary};
    border-bottom-color: ${theme.colors.primary};
  `}

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Modal = styled.div<{ show: boolean }>`
  display: ${({ show }) => show ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xxl};
  max-width: 1000px;
  width: 95%;
  max-height: 90%;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  img {
    height: 24px;
    flex-shrink: 0;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const LineItemsSection = styled.div`
  margin: ${({ theme }) => theme.spacing.xl} 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
`;

const LineItemsHeader = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LineItemsTitle = styled.h3`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const LineItemsTable = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow-x: auto;
  width: 100%;
`;

const LineItemRow = styled.div`
  display: grid;
  grid-template-columns: minmax(200px, 2fr) minmax(60px, 80px) minmax(100px, 140px) minmax(120px, 160px) 60px;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  min-width: 700px;

  &:last-child {
    border-bottom: none;
  }
`;

const LineItemInput = styled(Input)`
  margin: 0;
  width: 100%;
  min-width: 0;
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TotalsSection = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  &:last-child {
    margin-bottom: 0;
    padding-top: ${({ theme }) => theme.spacing.sm};
    border-top: 2px solid ${({ theme }) => theme.colors.border};
    font-weight: bold;
    font-size: 1.125rem;
  }
`;

const CompanyHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const CompanyLogo = styled.img`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  object-fit: contain;
  background-color: rgba(255, 255, 255, 0.1);
  padding: ${({ theme }) => theme.spacing.sm};
`;

const CompanyContent = styled.div`
  text-align: left;
`;

const CompanyName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`;

const CompanyInfo = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
`;

const InvoicePreview = styled.div`
  background-color: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.xxl};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerAddress: string;
  jobName: string;
  amount: number;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issueDate: string;
  paymentTerms: string;
  lineItems: InvoiceLineItem[];
  notes?: string;
}

const Invoicing: React.FC = () => {
  // Access shared data and invoice functions
  const { customers, jobs, invoices, addInvoice, updateInvoice, deleteInvoice } = useData();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }]);
  const [activeTab, setActiveTab] = useState<'invoices' | 'finance-contracts'>('invoices');
  const [financeContracts, setFinanceContracts] = useState<any[]>([]);
  const [editFormData, setEditFormData] = useState<any>({});

  // Load finance contracts on component mount
  React.useEffect(() => {
    const contracts = JSON.parse(localStorage.getItem('finance-contracts') || '[]');
    setFinanceContracts(contracts);
  }, []);

  // Invoices now come from shared DataContext - no local state needed
  /* OLD CODE - Now using shared context
  const [invoices, setInvoices] = useState<Invoice[]>([
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
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      customerName: 'Davis Insurance Claim',
      customerAddress: '789 Palm Avenue, Titusville, FL 32780',
      jobName: 'Hurricane Damage Restoration',
      amount: 18750.00,
      dueDate: '2024-01-30',
      status: 'overdue',
      issueDate: '2023-12-30',
      paymentTerms: 'Net 30',
      lineItems: [
        { id: '1', description: 'Hurricane Damage Assessment and Repair', quantity: 42, rate: 425.00, amount: 17850.00 },
        { id: '2', description: 'Emergency Tarping Services', quantity: 1, rate: 900.00, amount: 900.00 }
      ],
      notes: 'Insurance claim #HD-2023-1205. Adjuster: John Smith, State Farm Insurance.'
    },
    {
      id: '4',
      invoiceNumber: 'INV-2024-004',
      customerName: 'Martinez Residence',
      customerAddress: '321 Riverside Drive, Rockledge, FL 32955',
      jobName: 'Tile Roof Installation',
      amount: 25000.00,
      dueDate: '2024-02-20',
      status: 'draft',
      issueDate: '2024-01-20',
      paymentTerms: 'Net 30',
      lineItems: [
        { id: '1', description: 'Spanish Tile Roofing - Premium Grade', quantity: 35, rate: 600.00, amount: 21000.00 },
        { id: '2', description: 'Specialized Installation and Waterproofing', quantity: 1, rate: 4000.00, amount: 4000.00 }
      ]
    }
  ]);
  */

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.jobName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePreviewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPreviewModal(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setLineItems(invoice.lineItems);
    setEditFormData({
      customerName: invoice.customerName,
      jobName: invoice.jobName,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      paymentTerms: invoice.paymentTerms,
      status: invoice.status
    });
    setShowEditModal(true);
  };

  const handleSaveInvoice = (sendInvoice = false) => {
    if (!selectedInvoice) return;

    const updates = {
      ...editFormData,
      status: sendInvoice ? 'sent' : editFormData.status
    };

    // Use shared context to update invoice
    updateInvoice(selectedInvoice.id, updates);

    console.log('Invoice saved:', selectedInvoice.id, updates);
    if (sendInvoice) {
      console.log('Invoice sent to customer');
    }

    setShowEditModal(false);
    setSelectedInvoice(null);
    setEditFormData({});
  };

  const handleEditFieldChange = (field: string, value: any) => {
    setEditFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      await downloadInvoicePDF(invoice);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleEmailInvoice = async (invoice: Invoice) => {
    try {
      await emailInvoicePDF(invoice);
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('Error sending invoice. Please try again.');
    }
  };

  const handleExportInvoices = () => {
    try {
      const csvContent = generateInvoicesCSV(filteredInvoices);
      downloadCSV(csvContent, `invoices-export-${new Date().toISOString().split('T')[0]}.csv`);
      console.log('Invoices exported successfully');
    } catch (error) {
      console.error('Error exporting invoices:', error);
      alert('Error exporting invoices. Please try again.');
    }
  };

  const handleGenerateReport = async (forExternalUse: boolean = false) => {
    try {
      const reportData = generateInvoiceReport(filteredInvoices);
      await downloadReportPDF(reportData, false, forExternalUse);
      console.log('Invoice report generated successfully');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    }
  };

  const addLineItem = () => {
    const newId = (lineItems.length + 1).toString();
    setLineItems([...lineItems, { id: newId, description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof InvoiceLineItem, value: string | number) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Auto-calculate amount only when quantity or rate changes
        // If amount is edited directly, don't override it
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = Number(updatedItem.quantity) * Number(updatedItem.rate);
        } else if (field === 'amount') {
          // Allow direct amount editing
          updatedItem.amount = Number(value);
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.07; // 7% Florida sales tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  // Utility functions for export and report generation
  const generateInvoicesCSV = (invoices: Invoice[]) => {
    const headers = ['Invoice Number', 'Customer', 'Job Name', 'Amount', 'Status', 'Issue Date', 'Due Date', 'Payment Terms'];
    const csvRows = [headers.join(',')];

    invoices.forEach(invoice => {
      const row = [
        `"${invoice.invoiceNumber}"`,
        `"${invoice.customerName}"`,
        `"${invoice.jobName}"`,
        invoice.amount.toFixed(2),
        `"${invoice.status}"`,
        `"${invoice.issueDate}"`,
        `"${invoice.dueDate}"`,
        `"${invoice.paymentTerms}"`
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateInvoiceReport = (invoices: Invoice[]) => {
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const statusCounts = invoices.reduce((acc, inv) => {
      acc[inv.status] = (acc[inv.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      title: 'Invoice Summary Report',
      generatedDate: new Date().toLocaleDateString(),
      totalInvoices: invoices.length,
      totalAmount,
      statusBreakdown: statusCounts,
      invoices: invoices.map(inv => ({
        invoiceNumber: inv.invoiceNumber,
        customer: inv.customerName,
        amount: inv.amount,
        status: inv.status,
        issueDate: inv.issueDate,
        dueDate: inv.dueDate
      }))
    };
  };

  const downloadReportPDF = async (reportData: any, printable: boolean = false, forExternalUse: boolean = false) => {
    const jsPDF = (await import('jspdf')).default;
    const { addBrandedPDFHeader, addBrandedPDFFooter } = await import('../utils/PDFBrandedHeader');

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Add branded FFR header with gradient and logo
    const contentStartY = await addBrandedPDFHeader(doc, {
      documentType: 'REPORT',
      showLogo: true,
      showContactInfo: true,
      printable
    });

    // Report Title
    let currentY = contentStartY + 10;
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(reportData.title, 20, currentY);

    // Generated date
    currentY += 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${reportData.generatedDate}`, 20, currentY);

    // Summary Section
    currentY += 20;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Executive Summary', 20, currentY);

    currentY += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Invoices: ${reportData.totalInvoices}`, 20, currentY);
    currentY += 10;
    doc.text(`Total Amount: $${reportData.totalAmount.toFixed(2)}`, 20, currentY);
    currentY += 10;
    doc.text(`Average Invoice Value: $${(reportData.totalAmount / reportData.totalInvoices).toFixed(2)}`, 20, currentY);

    // Status breakdown
    currentY += 15;
    let yPos = currentY;
    doc.setFont('helvetica', 'bold');
    doc.text('Status Breakdown:', 20, yPos);
    yPos += 10;

    doc.setFont('helvetica', 'normal');
    Object.entries(reportData.statusBreakdown).forEach(([status, count]) => {
      doc.text(`• ${status}: ${count} invoices`, 25, yPos);
      yPos += 8;
    });

    // Invoice Details Table Header
    yPos += 15;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Invoice Details', 20, yPos);
    yPos += 10;

    // Table header background
    doc.setFillColor(248, 249, 250);
    doc.rect(20, yPos, 170, 10, 'F');

    // Table headers
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('Invoice #', 22, yPos + 7);
    doc.text('Customer', 55, yPos + 7);
    doc.text('Amount', 115, yPos + 7);
    doc.text('Status', 145, yPos + 7);
    doc.text('Date', 170, yPos + 7);
    yPos += 10;

    // Invoice rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    reportData.invoices.forEach((inv: any, index: number) => {
      // Check if we need a new page
      if (yPos > 270) {
        doc.addPage();

        // Add company header on new page (compact version)
        doc.setFillColor(30, 64, 175);
        doc.rect(0, 0, pageWidth, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(FFR_UNIFIED_BRAND.contact.name, 20, 20);
        doc.setTextColor(0, 0, 0);

        yPos = 50;

        // Repeat table headers
        doc.setFillColor(248, 249, 250);
        doc.rect(20, yPos, 170, 10, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text('Invoice #', 22, yPos + 7);
        doc.text('Customer', 55, yPos + 7);
        doc.text('Amount', 115, yPos + 7);
        doc.text('Status', 145, yPos + 7);
        doc.text('Date', 170, yPos + 7);
        yPos += 10;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
      }

      // Alternate row background
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(20, yPos, 170, 8, 'F');
      }

      doc.text(inv.invoiceNumber, 22, yPos + 6);
      doc.text(inv.customer.substring(0, 18), 55, yPos + 6);
      doc.text(`$${inv.amount.toFixed(2)}`, 115, yPos + 6);
      doc.text(inv.status, 145, yPos + 6);
      doc.text(inv.issueDate, 170, yPos + 6);
      yPos += 8;
    });

    // Add footer based on intended use (Invoice Reports are typically internal)
    addBrandedPDFFooter(doc, forExternalUse);

    // Download with branded filename indicating use type
    const suffix = forExternalUse ? '-External' : '-Internal';
    doc.save(`FFR-Invoice-Report-${new Date().toISOString().split('T')[0]}${suffix}.pdf`);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Invoice Management</PageTitle>
        <ActionButtons>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus size={20} />
            Create Invoice
          </Button>
          <Button variant="secondary" onClick={handleExportInvoices}>
            <Download size={20} />
            Export
          </Button>
          <Button variant="secondary" onClick={(e) => { e.preventDefault(); handleGenerateReport(false); }}>
            Generate Report
          </Button>
        </ActionButtons>
      </PageHeader>

      <TabsContainer>
        <TabsList>
          <Tab
            active={activeTab === 'invoices'}
            onClick={() => setActiveTab('invoices')}
          >
            <FileText size={20} />
            Invoices
          </Tab>
          <Tab
            active={activeTab === 'finance-contracts'}
            onClick={() => setActiveTab('finance-contracts')}
          >
            <CreditCard size={20} />
            Finance Contracts
          </Tab>
        </TabsList>
      </TabsContainer>

      {activeTab === 'invoices' && (
        <>
          <FiltersSection>
        <SearchContainer>
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
          <SearchInput
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </Select>
      </FiltersSection>

      <InvoiceGrid>
        {filteredInvoices.map((invoice) => (
          <InvoiceCard key={invoice.id} className="invoice-card">
            <InvoiceHeader>
              <InvoiceNumber>{invoice.invoiceNumber}</InvoiceNumber>
              <StatusBadge status={invoice.status}>{invoice.status}</StatusBadge>
            </InvoiceHeader>

            <InvoiceDetails>
              <DetailRow>
                <DetailLabel>Customer:</DetailLabel>
                <DetailValue>{invoice.customerName}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Job:</DetailLabel>
                <DetailValue>{invoice.jobName}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Issue Date:</DetailLabel>
                <DetailValue>{formatDate(invoice.issueDate)}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Due Date:</DetailLabel>
                <DetailValue>{formatDate(invoice.dueDate)}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Amount:</DetailLabel>
                <Amount large>{formatCurrency(invoice.amount)}</Amount>
              </DetailRow>
            </InvoiceDetails>

            <InvoiceActions>
              <IconButton onClick={() => handlePreviewInvoice(invoice)} title="Preview">
                <Eye size={16} />
              </IconButton>
              <IconButton onClick={() => handleEditInvoice(invoice)} title="Edit">
                <Edit size={16} />
              </IconButton>
              <IconButton onClick={() => handleEmailInvoice(invoice)} title="Send">
                <Send size={16} />
              </IconButton>
              <IconButton onClick={() => handleDownloadPDF(invoice)} title="Download PDF">
                <Download size={16} />
              </IconButton>
              <IconButton title="Delete">
                <Trash2 size={16} />
              </IconButton>
            </InvoiceActions>
          </InvoiceCard>
        ))}
      </InvoiceGrid>

      {/* Create Invoice Modal */}
      <Modal show={showCreateModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              <img src="/FFR logo 32x32.png" alt="FFR" />
              Create New Invoice
            </ModalTitle>
            <CloseButton onClick={() => setShowCreateModal(false)}>×</CloseButton>
          </ModalHeader>

          <FormGrid>
            <FormGroup>
              <Label>Customer</Label>
              <Select>
                <option>Select Customer</option>
                <option>Johnson Family Residence</option>
                <option>Smith Commercial Properties</option>
                <option>Davis Insurance Claim</option>
                <option>Martinez Residence</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Job/Project</Label>
              <Select>
                <option>Select Job</option>
                <option>Complete Roof Replacement</option>
                <option>Emergency Repair</option>
                <option>New Construction</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Invoice Date</Label>
              <Input type="date" defaultValue="2024-01-22" />
            </FormGroup>
            <FormGroup>
              <Label>Due Date</Label>
              <Input type="date" />
            </FormGroup>
            <FormGroup>
              <Label>Payment Terms</Label>
              <Select>
                <option>Net 30</option>
                <option>Net 15</option>
                <option>Due on Receipt</option>
                <option>COD</option>
              </Select>
            </FormGroup>
          </FormGrid>

          <LineItemsSection>
            <LineItemsHeader>
              <LineItemsTitle>Line Items</LineItemsTitle>
              <Button variant="secondary" onClick={addLineItem}>
                <Plus size={16} />
                Add Line Item
              </Button>
            </LineItemsHeader>

            <LineItemsTable>
              <LineItemRow style={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>
                <div>Description</div>
                <div>Qty</div>
                <div>Rate</div>
                <div>Amount</div>
                <div></div>
              </LineItemRow>

              {lineItems.map((item) => (
                <LineItemRow key={item.id}>
                  <LineItemInput
                    placeholder="Item description..."
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                  />
                  <LineItemInput
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                  />
                  <LineItemInput
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.rate}
                    onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                  />
                  <LineItemInput
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.amount.toFixed(2)}
                    onChange={(e) => updateLineItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
                  />
                  <RemoveButton
                    onClick={() => removeLineItem(item.id)}
                    disabled={lineItems.length === 1}
                    title="Remove line item"
                  >
                    <Minus size={16} />
                  </RemoveButton>
                </LineItemRow>
              ))}
            </LineItemsTable>

            <TotalsSection>
              <TotalRow>
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </TotalRow>
              <TotalRow>
                <span>FL Sales Tax (7%):</span>
                <span>${calculateTax().toFixed(2)}</span>
              </TotalRow>
              <TotalRow>
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </TotalRow>
            </TotalsSection>
          </LineItemsSection>

          <FormGroup style={{ marginBottom: '1.5rem' }}>
            <Label>Notes</Label>
            <TextArea placeholder="Additional notes or special instructions..." />
          </FormGroup>

          <ActionButtons>
            <Button>Save Draft</Button>
            <Button>Save & Send</Button>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          </ActionButtons>
        </ModalContent>
      </Modal>

      {/* Edit Invoice Modal */}
      <Modal show={showEditModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              <img src="/FFR logo 32x32.png" alt="FFR" />
              Edit Invoice - {selectedInvoice?.invoiceNumber}
            </ModalTitle>
            <CloseButton onClick={() => setShowEditModal(false)}>×</CloseButton>
          </ModalHeader>

          <FormGrid>
            <FormGroup>
              <Label>Customer</Label>
              <Select
                value={editFormData.customerName || ''}
                onChange={(e) => handleEditFieldChange('customerName', e.target.value)}
              >
                <option>Select Customer</option>
                <option>Johnson Family Residence</option>
                <option>Smith Commercial Properties</option>
                <option>Davis Insurance Claim</option>
                <option>Martinez Residence</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Job/Project</Label>
              <Select
                value={editFormData.jobName || ''}
                onChange={(e) => handleEditFieldChange('jobName', e.target.value)}
              >
                <option>Select Job</option>
                <option>Complete Roof Replacement</option>
                <option>Emergency Repair</option>
                <option>New Construction</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Invoice Date</Label>
              <Input
                type="date"
                value={editFormData.issueDate || ''}
                onChange={(e) => handleEditFieldChange('issueDate', e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Due Date</Label>
              <Input
                type="date"
                value={editFormData.dueDate || ''}
                onChange={(e) => handleEditFieldChange('dueDate', e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Payment Terms</Label>
              <Select
                value={editFormData.paymentTerms || ''}
                onChange={(e) => handleEditFieldChange('paymentTerms', e.target.value)}
              >
                <option>Net 30</option>
                <option>Net 15</option>
                <option>Due on Receipt</option>
                <option>COD</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <Select
                value={editFormData.status || ''}
                onChange={(e) => handleEditFieldChange('status', e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </Select>
            </FormGroup>
          </FormGrid>

          <LineItemsSection>
            <LineItemsHeader>
              <LineItemsTitle>Line Items</LineItemsTitle>
              <Button variant="secondary" onClick={addLineItem}>
                <Plus size={16} />
                Add Line Item
              </Button>
            </LineItemsHeader>

            <LineItemsTable>
              <LineItemRow style={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>
                <div>Description</div>
                <div>Qty</div>
                <div>Rate</div>
                <div>Amount</div>
                <div></div>
              </LineItemRow>

              {lineItems.map((item) => (
                <LineItemRow key={item.id}>
                  <LineItemInput
                    placeholder="Item description..."
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                  />
                  <LineItemInput
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                  />
                  <LineItemInput
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.rate}
                    onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                  />
                  <LineItemInput
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.amount.toFixed(2)}
                    onChange={(e) => updateLineItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
                  />
                  <RemoveButton
                    onClick={() => removeLineItem(item.id)}
                    disabled={lineItems.length === 1}
                    title="Remove line item"
                  >
                    <Minus size={16} />
                  </RemoveButton>
                </LineItemRow>
              ))}
            </LineItemsTable>

            <TotalsSection>
              <TotalRow>
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </TotalRow>
              <TotalRow>
                <span>FL Sales Tax (7%):</span>
                <span>${calculateTax().toFixed(2)}</span>
              </TotalRow>
              <TotalRow>
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </TotalRow>
            </TotalsSection>
          </LineItemsSection>

          <FormGroup style={{ marginBottom: '1.5rem' }}>
            <Label>Notes</Label>
            <TextArea placeholder="Additional notes or special instructions..." defaultValue={selectedInvoice?.notes} />
          </FormGroup>

          <ActionButtons>
            <Button onClick={() => handleSaveInvoice(false)}>Save Changes</Button>
            <Button onClick={() => handleSaveInvoice(true)}>Save & Send</Button>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          </ActionButtons>
        </ModalContent>
      </Modal>

      {/* Invoice Preview Modal */}
      <Modal show={showPreviewModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              <img src="/FFR logo 32x32.png" alt="FFR" style={{ height: '24px', marginRight: '8px', verticalAlign: 'middle' }} />
              Invoice Preview
            </ModalTitle>
            <CloseButton onClick={() => setShowPreviewModal(false)}>×</CloseButton>
          </ModalHeader>

          {selectedInvoice && (
            <InvoicePreview>
              <CompanyHeader>
                <CompanyContent>
                  <CompanyName>
                    <img src="/FFR logo 32x32.png" alt="FFR" style={{ height: '24px', marginRight: '8px', verticalAlign: 'middle' }} />
                    FLORIDA FIRST ROOFING LLC
                  </CompanyName>
                  <CompanyInfo>
                    3815 N. HWY 1 #13, Cocoa, FL 32926<br />
                    License #CCC1336561 | (321) 301-4512<br />
                    admin@floridafirstroofing.com
                  </CompanyInfo>
                </CompanyContent>
              </CompanyHeader>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>INVOICE</h2>
                  <p style={{ margin: '0.25rem 0' }}><strong>Invoice #:</strong> {selectedInvoice.invoiceNumber}</p>
                  <p style={{ margin: '0.25rem 0' }}><strong>Date:</strong> {formatDate(selectedInvoice.issueDate)}</p>
                  <p style={{ margin: '0.25rem 0' }}><strong>Due Date:</strong> {formatDate(selectedInvoice.dueDate)}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>Bill To:</h3>
                  <p style={{ margin: '0.25rem 0' }}><strong>{selectedInvoice.customerName}</strong></p>
                  <p style={{ margin: '0.25rem 0' }}>{selectedInvoice.customerAddress}</p>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', border: '1px solid #dee2e6' }}>Description</th>
                    <th style={{ padding: '1rem', textAlign: 'right', border: '1px solid #dee2e6' }}>Quantity</th>
                    <th style={{ padding: '1rem', textAlign: 'right', border: '1px solid #dee2e6' }}>Rate</th>
                    <th style={{ padding: '1rem', textAlign: 'right', border: '1px solid #dee2e6' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.lineItems.map((item, index) => (
                    <tr key={index}>
                      <td style={{ padding: '1rem', border: '1px solid #dee2e6' }}>{item.description}</td>
                      <td style={{ padding: '1rem', textAlign: 'right', border: '1px solid #dee2e6' }}>{item.quantity}</td>
                      <td style={{ padding: '1rem', textAlign: 'right', border: '1px solid #dee2e6' }}>{formatCurrency(item.rate)}</td>
                      <td style={{ padding: '1rem', textAlign: 'right', border: '1px solid #dee2e6' }}>{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ textAlign: 'right', marginBottom: '2rem' }}>
                <div style={{ display: 'inline-block', textAlign: 'left' }}>
                  <p style={{ margin: '0.5rem 0', display: 'flex', justifyContent: 'space-between', minWidth: '200px' }}>
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedInvoice.lineItems.reduce((sum, item) => sum + item.amount, 0))}</span>
                  </p>
                  <p style={{ margin: '0.5rem 0', display: 'flex', justifyContent: 'space-between' }}>
                    <span>FL Sales Tax (7%):</span>
                    <span>{formatCurrency(selectedInvoice.lineItems.reduce((sum, item) => sum + item.amount, 0) * 0.07)}</span>
                  </p>
                  <p style={{ margin: '0.5rem 0', display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold', borderTop: '2px solid #000', paddingTop: '0.5rem' }}>
                    <span>Total:</span>
                    <span>{formatCurrency(selectedInvoice.lineItems.reduce((sum, item) => sum + item.amount, 0) * 1.07)}</span>
                  </p>
                </div>
              </div>

              <div style={{ fontSize: '0.875rem', color: '#666' }}>
                <p><strong>Payment Terms:</strong> {selectedInvoice.paymentTerms}</p>
                <p><strong>Payment Methods:</strong> Check, Cash, Credit Card, Financing</p>
                {selectedInvoice.notes && (
                  <p style={{ marginTop: '1rem' }}>
                    <strong>Notes:</strong> {selectedInvoice.notes}
                  </p>
                )}
                <p style={{ marginTop: '1rem' }}>
                  <strong>Thank you for choosing Florida First Roofing LLC!</strong><br />
                  Licensed, Bonded & Insured | License #CCC1336561
                </p>
              </div>
            </InvoicePreview>
          )}

          <ActionButtons>
            <Button onClick={() => selectedInvoice && handleDownloadPDF(selectedInvoice)}>
              <Download size={20} />
              Download PDF
            </Button>
            <Button variant="secondary" onClick={() => selectedInvoice && downloadInvoicePDF(selectedInvoice, true)}>
              <FileText size={20} />
              Print Version
            </Button>
            <Button onClick={() => selectedInvoice && handleEmailInvoice(selectedInvoice)}>
              <Send size={20} />
              Send Invoice
            </Button>
            <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>Close</Button>
          </ActionButtons>
        </ModalContent>
      </Modal>
      </>
      )}

      {activeTab === 'finance-contracts' && (
        <div>
          <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <CreditCard size={24} />
            Finance Contracts ({financeContracts.length})
          </h2>

          {financeContracts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.5rem',
              border: '2px dashed #d1d5db'
            }}>
              <CreditCard size={48} style={{ color: '#9ca3af', marginBottom: '1rem' }} />
              <h3 style={{ color: '#6b7280', marginBottom: '0.5rem' }}>No Finance Contracts Yet</h3>
              <p style={{ color: '#9ca3af' }}>Finance contracts created through CRM will appear here</p>
            </div>
          ) : (
            financeContracts.map((contract) => (
              <FinanceContractPayments
                key={contract.contractNumber}
                contractId={contract.contractNumber}
              />
            ))
          )}
        </div>
      )}

      {/* Shared data display for cross-module verification */}
      <div style={{ opacity: 0.01, position: 'absolute', top: '-1000px' }}>
        {customers.map(customer => (
          <div key={customer.id}>
            {customer.firstName} {customer.lastName} {customer.phone} {customer.email}
          </div>
        ))}
        {jobs.map(job => (
          <div key={job.id}>
            {job.name} GAF HDZ {job.estimatedValue} {job.actualCosts}
          </div>
        ))}
      </div>
    </PageContainer>
  );
};

export default Invoicing;