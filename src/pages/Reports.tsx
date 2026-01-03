import React, { useState } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Download, FileText, Mail, X } from 'lucide-react';
import BrandedModalTitle from '../components/Shared/BrandedModalTitle';
import { createReportPDF } from '../utils/UnifiedPDFGenerator';

const PageContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ReportFilters = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const FilterRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: end;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
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

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}dd;
  }
`;

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ReportCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ReportTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FinancialStatementsSection = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatementTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Tab = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  font-weight: 600;
  color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.text.secondary};
  border-bottom: 2px solid ${({ theme, active }) => active ? theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const StatementTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing.md};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Amount = styled.span<{ negative?: boolean }>`
  color: ${({ theme, negative }) => negative ? theme.colors.accent : theme.colors.text.primary};
  font-weight: 600;
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
  max-width: 600px;
  width: 90%;
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

const Checkbox = styled.input`
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  flex-wrap: wrap;
`;

const SecondaryButton = styled.button`
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [selectedJob, setSelectedJob] = useState('all');
  const [activeStatement, setActiveStatement] = useState('profit-loss');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('comprehensive');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeFinancials, setIncludeFinancials] = useState(true);
  const [includeJobAnalysis, setIncludeJobAnalysis] = useState(true);
  const [includeProfitability, setIncludeProfitability] = useState(true);

  // Sample data for charts
  const monthlyRevenue = [
    { month: 'Jan', revenue: 125000, costs: 87500, profit: 37500 },
    { month: 'Feb', revenue: 142000, costs: 95400, profit: 46600 },
    { month: 'Mar', revenue: 168000, costs: 117600, profit: 50400 },
    { month: 'Apr', revenue: 189000, costs: 132300, profit: 56700 },
    { month: 'May', revenue: 205000, costs: 143500, profit: 61500 },
    { month: 'Jun', revenue: 234000, costs: 163800, profit: 70200 },
  ];

  const jobProfitability = [
    { name: 'Residential Re-Roof', jobs: 12, revenue: 285000, profit: 68400, margin: 24 },
    { name: 'Commercial Repair', jobs: 8, revenue: 164000, profit: 32800, margin: 20 },
    { name: 'New Construction', jobs: 5, revenue: 340000, profit: 85000, margin: 25 },
    { name: 'Insurance Claims', jobs: 15, revenue: 195000, profit: 39000, margin: 20 },
  ];

  const expenseBreakdown = [
    { name: 'Materials', value: 40, amount: 425000 },
    { name: 'Labor', value: 35, amount: 371250 },
    { name: 'Equipment', value: 8, amount: 84800 },
    { name: 'Insurance', value: 6, amount: 63600 },
    { name: 'Other', value: 11, amount: 116600 },
  ];

  const COLORS = ['#1e40af', '#059669', '#dc2626', '#d97706', '#7c3aed'];

  // Sample financial statement data
  const profitLossData = [
    { category: 'Revenue', account: 'Roofing Services Revenue', amount: 1062000 },
    { category: 'Revenue', account: 'Emergency Repair Revenue', amount: 148000 },
    { category: 'Revenue', account: 'Materials Markup', amount: 89000 },
    { category: 'Cost of Goods Sold', account: 'Materials Expense', amount: -425000 },
    { category: 'Cost of Goods Sold', account: 'Subcontractor Costs', amount: -187000 },
    { category: 'Operating Expenses', account: 'Labor Expense', amount: -371250 },
    { category: 'Operating Expenses', account: 'Equipment Rental', amount: -84800 },
    { category: 'Operating Expenses', account: 'Insurance Expense', amount: -63600 },
    { category: 'Operating Expenses', account: 'Vehicle Expenses', amount: -45200 },
    { category: 'Operating Expenses', account: 'Office Expenses', amount: -28400 },
  ];

  const balanceSheetData = {
    assets: [
      { category: 'Current Assets', account: 'Cash and Cash Equivalents', amount: 125000 },
      { category: 'Current Assets', account: 'Accounts Receivable', amount: 285000 },
      { category: 'Current Assets', account: 'Materials Inventory', amount: 95000 },
      { category: 'Current Assets', account: 'Prepaid Insurance', amount: 18000 },
      { category: 'Fixed Assets', account: 'Equipment and Tools', amount: 185000 },
      { category: 'Fixed Assets', account: 'Vehicles', amount: 265000 },
      { category: 'Fixed Assets', account: 'Office Equipment', amount: 25000 },
      { category: 'Fixed Assets', account: 'Accumulated Depreciation', amount: -85000 },
    ],
    liabilities: [
      { category: 'Current Liabilities', account: 'Accounts Payable', amount: 125000 },
      { category: 'Current Liabilities', account: 'Accrued Expenses', amount: 45000 },
      { category: 'Current Liabilities', account: 'Customer Deposits', amount: 65000 },
      { category: 'Current Liabilities', account: 'Short-term Debt', amount: 35000 },
      { category: 'Long-term Liabilities', account: 'Equipment Loans', amount: 145000 },
      { category: 'Long-term Liabilities', account: 'Vehicle Loans', amount: 185000 },
    ],
    equity: [
      { category: 'Equity', account: 'Owner\'s Capital', amount: 300000 },
      { category: 'Equity', account: 'Retained Earnings', amount: 93000 },
    ]
  };

  const cashFlowData = [
    { category: 'Operating Activities', account: 'Net Income', amount: 93750 },
    { category: 'Operating Activities', account: 'Depreciation', amount: 12500 },
    { category: 'Operating Activities', account: 'Accounts Receivable Change', amount: -35000 },
    { category: 'Operating Activities', account: 'Inventory Change', amount: -8000 },
    { category: 'Operating Activities', account: 'Accounts Payable Change', amount: 15000 },
    { category: 'Operating Activities', account: 'Accrued Expenses Change', amount: 5000 },
    { category: 'Investing Activities', account: 'Equipment Purchase', amount: -25000 },
    { category: 'Investing Activities', account: 'Vehicle Purchase', amount: -45000 },
    { category: 'Financing Activities', account: 'Loan Proceeds', amount: 50000 },
    { category: 'Financing Activities', account: 'Loan Payments', amount: -35000 },
    { category: 'Financing Activities', account: 'Owner Draws', amount: -25000 },
  ];

  const revenueData = [
    { month: 'January', revenue: 125000, jobs: 15 },
    { month: 'February', revenue: 98000, jobs: 12 },
    { month: 'March', revenue: 145000, jobs: 18 },
    { month: 'April', revenue: 156000, jobs: 22 },
    { month: 'May', revenue: 189000, jobs: 25 },
    { month: 'June', revenue: 195000, jobs: 28 },
    { month: 'July', revenue: 220000, jobs: 32 },
    { month: 'August', revenue: 210000, jobs: 30 },
    { month: 'September', revenue: 185000, jobs: 26 },
    { month: 'October', revenue: 165000, jobs: 24 },
    { month: 'November', revenue: 145000, jobs: 20 },
    { month: 'December', revenue: 135000, jobs: 18 }
  ];

  const expenseData = [
    { category: 'Materials & Supplies', amount: 75000 },
    { category: 'Labor Costs', amount: 125000 },
    { category: 'Equipment & Tools', amount: 25000 },
    { category: 'Vehicle & Fuel', amount: 18000 },
    { category: 'Insurance', amount: 24000 },
    { category: 'Permits & Licenses', amount: 8500 },
    { category: 'Marketing & Advertising', amount: 12000 },
    { category: 'Office & Administrative', amount: 15000 },
    { category: 'Professional Services', amount: 8500 },
    { category: 'Utilities & Communications', amount: 6000 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleGenerateReport = () => {
    setShowReportModal(true);
  };

  const generateReportHTML = () => {
    const periodText = selectedPeriod === 'custom' ? `${startDate} to ${endDate}` :
                      selectedPeriod === 'month' ? 'This Month' :
                      selectedPeriod === 'quarter' ? 'This Quarter' : 'This Year';

    let reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Florida First Roofing - Financial Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          .header { display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 40px; padding: 20px; background: linear-gradient(135deg, #1e40af, #059669); color: white; border-radius: 8px; }
          .header-logo { width: 60px; height: 60px; border-radius: 8px; object-fit: contain; background-color: rgba(255,255,255,0.1); padding: 8px; }
          .header-content { text-align: left; }
          .company-name { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
          .company-info { font-size: 14px; opacity: 0.9; }
          .report-title { font-size: 24px; margin: 30px 0; color: #1e40af; }
          .section { margin: 30px 0; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f8f9fa; font-weight: bold; }
          .amount { text-align: right; font-weight: bold; }
          .negative { color: #dc2626; }
          .positive { color: #059669; }
          .summary-box { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .metrics { display: flex; justify-content: space-around; margin: 20px 0; }
          .metric { text-align: center; }
          .metric-value { font-size: 24px; font-weight: bold; color: #1e40af; }
          .metric-label { font-size: 14px; color: #666; }
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-content">
            <div class="company-name">
              <img src="/FFR logo 32x32.png" alt="FFR" style="height: 24px; margin-right: 8px; vertical-align: middle;">
              FLORIDA FIRST ROOFING LLC
            </div>
            <div class="company-info">
              3815 N. HWY 1 #13, Cocoa, FL 32926<br>
              License #CCC1336561 | (321) 301-4512<br>
              admin@floridafirstroofing.com
            </div>
          </div>
        </div>

        <h1 class="report-title">${reportType.charAt(0).toUpperCase() + reportType.slice(1).replace('-', ' ')} Report</h1>
        <div class="summary-box">
          <strong>Report Period:</strong> ${periodText}<br>
          <strong>Job Filter:</strong> ${selectedJob === 'all' ? 'All Jobs' : selectedJob.charAt(0).toUpperCase() + selectedJob.slice(1)}<br>
          <strong>Generated:</strong> ${new Date().toLocaleString()}
        </div>
    `;

    // Key Metrics Section
    const totalRevenue = monthlyRevenue.reduce((sum, month) => sum + month.revenue, 0);
    const totalProfit = monthlyRevenue.reduce((sum, month) => sum + month.profit, 0);
    const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);
    const avgJobValue = totalRevenue / jobProfitability.reduce((sum, job) => sum + job.jobs, 0);

    reportContent += `
      <div class="section">
        <div class="section-title">Executive Summary</div>
        <div class="metrics">
          <div class="metric">
            <div class="metric-value">${formatCurrency(totalRevenue)}</div>
            <div class="metric-label">Total Revenue</div>
          </div>
          <div class="metric">
            <div class="metric-value">${formatCurrency(totalProfit)}</div>
            <div class="metric-label">Total Profit</div>
          </div>
          <div class="metric">
            <div class="metric-value">${profitMargin}%</div>
            <div class="metric-label">Profit Margin</div>
          </div>
          <div class="metric">
            <div class="metric-value">${formatCurrency(avgJobValue)}</div>
            <div class="metric-label">Avg Job Value</div>
          </div>
        </div>
      </div>
    `;

    // Monthly Performance Section
    if (includeCharts) {
      reportContent += `
        <div class="section">
          <div class="section-title">Monthly Performance</div>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th class="amount">Revenue</th>
                <th class="amount">Costs</th>
                <th class="amount">Profit</th>
                <th class="amount">Margin %</th>
              </tr>
            </thead>
            <tbody>
      `;

      monthlyRevenue.forEach(month => {
        const margin = ((month.profit / month.revenue) * 100).toFixed(1);
        reportContent += `
          <tr>
            <td>${month.month}</td>
            <td class="amount">${formatCurrency(month.revenue)}</td>
            <td class="amount negative">${formatCurrency(month.costs)}</td>
            <td class="amount positive">${formatCurrency(month.profit)}</td>
            <td class="amount">${margin}%</td>
          </tr>
        `;
      });

      reportContent += `
            </tbody>
          </table>
        </div>
      `;
    }

    // Job Analysis Section
    if (includeJobAnalysis) {
      reportContent += `
        <div class="section">
          <div class="section-title">Job Type Analysis</div>
          <table>
            <thead>
              <tr>
                <th>Job Type</th>
                <th class="amount">Jobs Count</th>
                <th class="amount">Revenue</th>
                <th class="amount">Profit</th>
                <th class="amount">Margin %</th>
              </tr>
            </thead>
            <tbody>
      `;

      jobProfitability.forEach(job => {
        reportContent += `
          <tr>
            <td>${job.name}</td>
            <td class="amount">${job.jobs}</td>
            <td class="amount">${formatCurrency(job.revenue)}</td>
            <td class="amount positive">${formatCurrency(job.profit)}</td>
            <td class="amount">${job.margin}%</td>
          </tr>
        `;
      });

      reportContent += `
            </tbody>
          </table>
        </div>
      `;
    }

    // Financial Statements Section
    if (includeFinancials) {
      reportContent += `
        <div class="section">
          <div class="section-title">Profit & Loss Statement</div>
          <table>
            <thead>
              <tr>
                <th>Account</th>
                <th class="amount">Amount</th>
              </tr>
            </thead>
            <tbody>
      `;

      profitLossData.forEach(item => {
        reportContent += `
          <tr>
            <td>${item.account}</td>
            <td class="amount ${item.amount < 0 ? 'negative' : 'positive'}">${formatCurrency(Math.abs(item.amount))}</td>
          </tr>
        `;
      });

      reportContent += `
              <tr style="border-top: 2px solid #1e40af; font-weight: bold;">
                <td>Net Income</td>
                <td class="amount positive">${formatCurrency(93750)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }

    // Expense Breakdown Section
    if (includeProfitability) {
      reportContent += `
        <div class="section">
          <div class="section-title">Expense Breakdown</div>
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th class="amount">Amount</th>
                <th class="amount">Percentage</th>
              </tr>
            </thead>
            <tbody>
      `;

      expenseBreakdown.forEach(expense => {
        reportContent += `
          <tr>
            <td>${expense.name}</td>
            <td class="amount">${formatCurrency(expense.amount)}</td>
            <td class="amount">${expense.value}%</td>
          </tr>
        `;
      });

      reportContent += `
            </tbody>
          </table>
        </div>
      `;
    }

    reportContent += `
        <div class="footer">
          <p><strong>Florida First Roofing LLC</strong> | Licensed, Bonded & Insured | License #CCC1336561</p>
          <p>This report was generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        </div>
      </body>
      </html>
    `;

    return reportContent;
  };

  const handleDownloadReport = () => {
    const reportTitle = `${reportType.charAt(0).toUpperCase() + reportType.slice(1).replace('-', ' ')} Report - ${selectedPeriod}`;
    const pdfGenerator = createReportPDF(reportTitle);
    const pdf = pdfGenerator.getPDF();
    const contentArea = pdfGenerator.getContentArea();

    let currentY = contentArea.startY + 10;

    // Add report period info
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Report Period: ${selectedPeriod}`, contentArea.leftMargin, currentY);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, contentArea.leftMargin, currentY + 8);
    currentY += 25;

    // Add financial summary based on report type
    if (reportType === 'invoice-summary') {
      currentY = pdfGenerator.addSectionHeader('Invoice Summary', currentY);

      // Sample invoice data for PDF generation
      const sampleInvoices = [
        { invoiceNumber: 'INV-001', customerName: 'Customer 1', amount: 15000, status: 'paid', dueDate: '2024-01-15' },
        { invoiceNumber: 'INV-002', customerName: 'Customer 2', amount: 8500, status: 'pending', dueDate: '2024-02-15' },
        { invoiceNumber: 'INV-003', customerName: 'Customer 3', amount: 12000, status: 'paid', dueDate: '2024-03-15' }
      ];

      const invoiceData = [
        ['Total Invoices', sampleInvoices.length.toString()],
        ['Total Revenue', `$${sampleInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}`],
        ['Paid Invoices', sampleInvoices.filter(inv => inv.status === 'paid').length.toString()],
        ['Outstanding Amount', `$${sampleInvoices.filter(inv => inv.status !== 'paid').reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}`]
      ];

      currentY = pdfGenerator.addTable(['Metric', 'Value'], invoiceData, currentY);
      currentY += 15;

      // Add invoice details table
      currentY = pdfGenerator.addSectionHeader('Invoice Details', currentY);
      const invoiceTableData = sampleInvoices.slice(0, 20).map(invoice => [
        invoice.invoiceNumber,
        invoice.customerName,
        `$${invoice.amount.toLocaleString()}`,
        invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1),
        new Date(invoice.dueDate).toLocaleDateString()
      ]);

      currentY = pdfGenerator.addTable(
        ['Invoice #', 'Customer', 'Amount', 'Status', 'Due Date'],
        invoiceTableData,
        currentY
      );
    } else if (reportType === 'revenue-analysis') {
      currentY = pdfGenerator.addSectionHeader('Revenue Analysis', currentY);

      const revenueTotal = revenueData.reduce((sum, item) => sum + item.revenue, 0);
      const monthlyAverage = revenueTotal / revenueData.length;

      const revenueStats = [
        ['Total Revenue', `$${revenueTotal.toLocaleString()}`],
        ['Monthly Average', `$${monthlyAverage.toLocaleString()}`],
        ['Best Month', revenueData.reduce((max, item) => item.revenue > max.revenue ? item : max).month],
        ['Growth Trend', revenueTotal > 100000 ? 'Positive' : 'Moderate']
      ];

      currentY = pdfGenerator.addTable(['Metric', 'Value'], revenueStats, currentY);
      currentY += 15;

      // Add monthly breakdown
      currentY = pdfGenerator.addSectionHeader('Monthly Breakdown', currentY);
      const revenueTableData = revenueData.map(item => [
        item.month,
        `$${item.revenue.toLocaleString()}`,
        item.jobs.toString(),
        `$${(item.revenue / item.jobs).toLocaleString()}`
      ]);

      currentY = pdfGenerator.addTable(
        ['Month', 'Revenue', 'Jobs', 'Avg/Job'],
        revenueTableData,
        currentY
      );
    } else if (reportType === 'expense-breakdown') {
      currentY = pdfGenerator.addSectionHeader('Expense Analysis', currentY);

      const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);

      const expenseStats = [
        ['Total Expenses', `$${totalExpenses.toLocaleString()}`],
        ['Largest Category', expenseData.reduce((max, item) => item.amount > max.amount ? item : max).category],
        ['Number of Categories', expenseData.length.toString()],
        ['Average per Category', `$${(totalExpenses / expenseData.length).toLocaleString()}`]
      ];

      currentY = pdfGenerator.addTable(['Metric', 'Value'], expenseStats, currentY);
      currentY += 15;

      // Add expense breakdown
      currentY = pdfGenerator.addSectionHeader('Expense Categories', currentY);
      const expenseTableData = expenseData.map(item => [
        item.category,
        `$${item.amount.toLocaleString()}`,
        `${((item.amount / totalExpenses) * 100).toFixed(1)}%`
      ]);

      currentY = pdfGenerator.addTable(
        ['Category', 'Amount', 'Percentage'],
        expenseTableData,
        currentY
      );
    }

    // Add notes section
    if (currentY < contentArea.endY - 40) {
      currentY += 20;
      currentY = pdfGenerator.addSectionHeader('Report Notes', currentY);
      currentY = pdfGenerator.addWrappedText(
        'This report was generated by the Florida First Roofing accounting system. All financial data is based on recorded transactions and may be subject to reconciliation adjustments.',
        contentArea.leftMargin,
        currentY,
        contentArea.rightMargin - contentArea.leftMargin
      );
    }

    // Save the PDF
    pdfGenerator.save(`FFR-${reportType}-Report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.pdf`);
    setShowReportModal(false);
  };

  const handleEmailReport = () => {
    const reportHTML = generateReportHTML();
    const subject = `Florida First Roofing - ${reportType.charAt(0).toUpperCase() + reportType.slice(1).replace('-', ' ')} Report`;
    const body = `Please find the attached financial report for Florida First Roofing LLC.\n\nReport Details:\n- Type: ${reportType}\n- Period: ${selectedPeriod}\n- Generated: ${new Date().toLocaleString()}\n\nBest regards,\nFlorida First Roofing LLC`;

    // Create mailto link with report content
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body + '\n\n--- Report Content ---\n' + reportHTML.replace(/<[^>]*>/g, ''))}`;
    window.open(mailtoLink);
    setShowReportModal(false);
  };

  const handleViewReport = () => {
    const reportHTML = generateReportHTML();
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(reportHTML);
      newWindow.document.close();
    }
    setShowReportModal(false);
  };

  return (
    <PageContainer>
      <PageTitle>Financial Reports & Analytics</PageTitle>

      <ReportFilters>
        <FilterRow>
          <FilterGroup>
            <Label>Report Period</Label>
            <Select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </Select>
          </FilterGroup>

          {selectedPeriod === 'custom' && (
            <>
              <FilterGroup>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </FilterGroup>

              <FilterGroup>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </FilterGroup>
            </>
          )}

          <FilterGroup>
            <Label>Job Filter</Label>
            <Select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)}>
              <option value="all">All Jobs</option>
              <option value="residential">Residential Only</option>
              <option value="commercial">Commercial Only</option>
              <option value="insurance">Insurance Claims</option>
            </Select>
          </FilterGroup>

          <Button onClick={handleGenerateReport}>Generate Report</Button>
        </FilterRow>
      </ReportFilters>

      <ReportsGrid>
        <ReportCard className="report-card">
          <ReportTitle>Monthly Revenue vs Profit</ReportTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="revenue" fill="#1e40af" name="Revenue" />
              <Bar dataKey="profit" fill="#059669" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </ReportCard>

        <ReportCard className="report-card">
          <ReportTitle>Job Type Profitability</ReportTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={jobProfitability} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => `${value}%`} />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip
                formatter={(value, name) => [
                  name === 'margin' ? `${value}%` : formatCurrency(Number(value)),
                  name
                ]}
              />
              <Bar dataKey="margin" fill="#059669" name="Profit Margin %" />
            </BarChart>
          </ResponsiveContainer>
        </ReportCard>

        <ReportCard className="report-card">
          <ReportTitle>Expense Breakdown</ReportTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [
                formatCurrency(props.payload.amount),
                name
              ]} />
            </PieChart>
          </ResponsiveContainer>
        </ReportCard>

        <ReportCard className="report-card">
          <ReportTitle>Revenue Trend</ReportTitle>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#1e40af"
                strokeWidth={3}
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#059669"
                strokeWidth={3}
                name="Profit"
              />
            </LineChart>
          </ResponsiveContainer>
        </ReportCard>
      </ReportsGrid>

      <FinancialStatementsSection>
        <ReportTitle>Financial Statements</ReportTitle>

        <StatementTabs>
          <Tab
            active={activeStatement === 'profit-loss'}
            onClick={() => setActiveStatement('profit-loss')}
          >
            Profit & Loss
          </Tab>
          <Tab
            active={activeStatement === 'balance-sheet'}
            onClick={() => setActiveStatement('balance-sheet')}
          >
            Balance Sheet
          </Tab>
          <Tab
            active={activeStatement === 'cash-flow'}
            onClick={() => setActiveStatement('cash-flow')}
          >
            Cash Flow
          </Tab>
        </StatementTabs>

        {activeStatement === 'profit-loss' && (
          <StatementTable>
            <thead>
              <tr>
                <TableHeader>Account</TableHeader>
                <TableHeader style={{ textAlign: 'right' }}>Amount</TableHeader>
              </tr>
            </thead>
            <tbody>
              {profitLossData.map((item, index) => (
                <tr key={index}>
                  <TableCell>{item.account}</TableCell>
                  <TableCell style={{ textAlign: 'right' }}>
                    <Amount negative={item.amount < 0}>
                      {formatCurrency(Math.abs(item.amount))}
                    </Amount>
                  </TableCell>
                </tr>
              ))}
              <tr style={{ borderTop: '2px solid #e5e7eb', fontWeight: 'bold' }}>
                <TableCell>Net Income</TableCell>
                <TableCell style={{ textAlign: 'right' }}>
                  <Amount>{formatCurrency(93750)}</Amount>
                </TableCell>
              </tr>
            </tbody>
          </StatementTable>
        )}

        {activeStatement === 'balance-sheet' && (
          <StatementTable>
            <thead>
              <tr>
                <TableHeader>Account</TableHeader>
                <TableHeader style={{ textAlign: 'right' }}>Amount</TableHeader>
              </tr>
            </thead>
            <tbody>
              <tr style={{ backgroundColor: '#f8fafc', fontWeight: 'bold' }}>
                <TableCell colSpan={2}>ASSETS</TableCell>
              </tr>
              {balanceSheetData.assets.map((item, index) => (
                <tr key={`asset-${index}`}>
                  <TableCell style={{ paddingLeft: '2rem' }}>{item.account}</TableCell>
                  <TableCell style={{ textAlign: 'right' }}>
                    <Amount negative={item.amount < 0}>
                      {formatCurrency(Math.abs(item.amount))}
                    </Amount>
                  </TableCell>
                </tr>
              ))}
              <tr style={{ borderTop: '2px solid #e5e7eb', fontWeight: 'bold' }}>
                <TableCell>Total Assets</TableCell>
                <TableCell style={{ textAlign: 'right' }}>
                  <Amount>{formatCurrency(913000)}</Amount>
                </TableCell>
              </tr>

              <tr style={{ backgroundColor: '#f8fafc', fontWeight: 'bold' }}>
                <TableCell colSpan={2}>LIABILITIES</TableCell>
              </tr>
              {balanceSheetData.liabilities.map((item, index) => (
                <tr key={`liability-${index}`}>
                  <TableCell style={{ paddingLeft: '2rem' }}>{item.account}</TableCell>
                  <TableCell style={{ textAlign: 'right' }}>
                    <Amount>{formatCurrency(item.amount)}</Amount>
                  </TableCell>
                </tr>
              ))}
              <tr style={{ borderTop: '1px solid #e5e7eb', fontWeight: 'bold' }}>
                <TableCell>Total Liabilities</TableCell>
                <TableCell style={{ textAlign: 'right' }}>
                  <Amount>{formatCurrency(600000)}</Amount>
                </TableCell>
              </tr>

              <tr style={{ backgroundColor: '#f8fafc', fontWeight: 'bold' }}>
                <TableCell colSpan={2}>EQUITY</TableCell>
              </tr>
              {balanceSheetData.equity.map((item, index) => (
                <tr key={`equity-${index}`}>
                  <TableCell style={{ paddingLeft: '2rem' }}>{item.account}</TableCell>
                  <TableCell style={{ textAlign: 'right' }}>
                    <Amount>{formatCurrency(item.amount)}</Amount>
                  </TableCell>
                </tr>
              ))}
              <tr style={{ borderTop: '2px solid #e5e7eb', fontWeight: 'bold' }}>
                <TableCell>Total Equity</TableCell>
                <TableCell style={{ textAlign: 'right' }}>
                  <Amount>{formatCurrency(393000)}</Amount>
                </TableCell>
              </tr>

              <tr style={{ borderTop: '3px solid #1e40af', fontWeight: 'bold', backgroundColor: '#eff6ff' }}>
                <TableCell>Total Liabilities & Equity</TableCell>
                <TableCell style={{ textAlign: 'right' }}>
                  <Amount>{formatCurrency(993000)}</Amount>
                </TableCell>
              </tr>
            </tbody>
          </StatementTable>
        )}

        {activeStatement === 'cash-flow' && (
          <StatementTable>
            <thead>
              <tr>
                <TableHeader>Cash Flow Activity</TableHeader>
                <TableHeader style={{ textAlign: 'right' }}>Amount</TableHeader>
              </tr>
            </thead>
            <tbody>
              <tr style={{ backgroundColor: '#f8fafc', fontWeight: 'bold' }}>
                <TableCell colSpan={2}>OPERATING ACTIVITIES</TableCell>
              </tr>
              {cashFlowData.filter(item => item.category === 'Operating Activities').map((item, index) => (
                <tr key={`operating-${index}`}>
                  <TableCell style={{ paddingLeft: '2rem' }}>{item.account}</TableCell>
                  <TableCell style={{ textAlign: 'right' }}>
                    <Amount negative={item.amount < 0}>
                      {formatCurrency(Math.abs(item.amount))}
                    </Amount>
                  </TableCell>
                </tr>
              ))}
              <tr style={{ borderTop: '1px solid #e5e7eb', fontWeight: 'bold' }}>
                <TableCell>Net Cash from Operating Activities</TableCell>
                <TableCell style={{ textAlign: 'right' }}>
                  <Amount>{formatCurrency(83250)}</Amount>
                </TableCell>
              </tr>

              <tr style={{ backgroundColor: '#f8fafc', fontWeight: 'bold' }}>
                <TableCell colSpan={2}>INVESTING ACTIVITIES</TableCell>
              </tr>
              {cashFlowData.filter(item => item.category === 'Investing Activities').map((item, index) => (
                <tr key={`investing-${index}`}>
                  <TableCell style={{ paddingLeft: '2rem' }}>{item.account}</TableCell>
                  <TableCell style={{ textAlign: 'right' }}>
                    <Amount negative={item.amount < 0}>
                      {formatCurrency(Math.abs(item.amount))}
                    </Amount>
                  </TableCell>
                </tr>
              ))}
              <tr style={{ borderTop: '1px solid #e5e7eb', fontWeight: 'bold' }}>
                <TableCell>Net Cash from Investing Activities</TableCell>
                <TableCell style={{ textAlign: 'right' }}>
                  <Amount negative={true}>{formatCurrency(70000)}</Amount>
                </TableCell>
              </tr>

              <tr style={{ backgroundColor: '#f8fafc', fontWeight: 'bold' }}>
                <TableCell colSpan={2}>FINANCING ACTIVITIES</TableCell>
              </tr>
              {cashFlowData.filter(item => item.category === 'Financing Activities').map((item, index) => (
                <tr key={`financing-${index}`}>
                  <TableCell style={{ paddingLeft: '2rem' }}>{item.account}</TableCell>
                  <TableCell style={{ textAlign: 'right' }}>
                    <Amount negative={item.amount < 0}>
                      {formatCurrency(Math.abs(item.amount))}
                    </Amount>
                  </TableCell>
                </tr>
              ))}
              <tr style={{ borderTop: '1px solid #e5e7eb', fontWeight: 'bold' }}>
                <TableCell>Net Cash from Financing Activities</TableCell>
                <TableCell style={{ textAlign: 'right' }}>
                  <Amount negative={true}>{formatCurrency(10000)}</Amount>
                </TableCell>
              </tr>

              <tr style={{ borderTop: '3px solid #1e40af', fontWeight: 'bold', backgroundColor: '#eff6ff' }}>
                <TableCell>Net Change in Cash</TableCell>
                <TableCell style={{ textAlign: 'right' }}>
                  <Amount>{formatCurrency(3250)}</Amount>
                </TableCell>
              </tr>

              <tr style={{ fontWeight: 'bold' }}>
                <TableCell>Cash at Beginning of Period</TableCell>
                <TableCell style={{ textAlign: 'right' }}>
                  <Amount>{formatCurrency(121750)}</Amount>
                </TableCell>
              </tr>

              <tr style={{ borderTop: '2px solid #e5e7eb', fontWeight: 'bold' }}>
                <TableCell>Cash at End of Period</TableCell>
                <TableCell style={{ textAlign: 'right' }}>
                  <Amount>{formatCurrency(125000)}</Amount>
                </TableCell>
              </tr>
            </tbody>
          </StatementTable>
        )}
      </FinancialStatementsSection>

      {/* Generate Report Modal */}
      <Modal show={showReportModal}>
        <ModalContent>
          <ModalHeader>
            <BrandedModalTitle>Generate Custom Report</BrandedModalTitle>
            <CloseButton onClick={() => setShowReportModal(false)}>
              <X size={20} />
            </CloseButton>
          </ModalHeader>

          <FormGrid>
            <FormGroup>
              <Label>Report Type</Label>
              <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                <option value="comprehensive">Comprehensive Report</option>
                <option value="financial">Financial Statements Only</option>
                <option value="performance">Performance Analytics</option>
                <option value="job-analysis">Job Cost Analysis</option>
                <option value="tax-summary">Tax Summary Report</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Report Period</Label>
              <Select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
              </Select>
            </FormGroup>

            {selectedPeriod === 'custom' && (
              <>
                <FormGroup>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </FormGroup>
              </>
            )}

            <FormGroup>
              <Label>Job Filter</Label>
              <Select value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)}>
                <option value="all">All Jobs</option>
                <option value="residential">Residential Only</option>
                <option value="commercial">Commercial Only</option>
                <option value="insurance">Insurance Claims</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Format</Label>
              <Select>
                <option value="pdf">PDF Document</option>
                <option value="excel">Excel Spreadsheet</option>
                <option value="csv">CSV Data</option>
              </Select>
            </FormGroup>
          </FormGrid>

          <CheckboxGroup>
            <Label style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Report Sections to Include:
            </Label>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={includeCharts}
                onChange={(e) => setIncludeCharts(e.target.checked)}
              />
              Charts & Visualizations
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={includeFinancials}
                onChange={(e) => setIncludeFinancials(e.target.checked)}
              />
              Financial Statements
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={includeJobAnalysis}
                onChange={(e) => setIncludeJobAnalysis(e.target.checked)}
              />
              Job Cost Analysis
            </CheckboxLabel>
            <CheckboxLabel>
              <Checkbox
                type="checkbox"
                checked={includeProfitability}
                onChange={(e) => setIncludeProfitability(e.target.checked)}
              />
              Profitability Analysis
            </CheckboxLabel>
          </CheckboxGroup>

          <ActionButtons>
            <Button onClick={handleViewReport}>
              <FileText size={16} />
              View Report
            </Button>
            <Button onClick={handleDownloadReport}>
              <Download size={16} />
              Download PDF
            </Button>
            <SecondaryButton onClick={handleEmailReport}>
              <Mail size={16} />
              Email Report
            </SecondaryButton>
            <SecondaryButton onClick={() => setShowReportModal(false)}>
              Cancel
            </SecondaryButton>
          </ActionButtons>
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};

export default Reports;