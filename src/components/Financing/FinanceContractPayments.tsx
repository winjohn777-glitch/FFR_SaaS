import React, { useState, useEffect } from 'react';
import { formatCurrency } from '../../utils/currencyFormatter';
import styled from 'styled-components';
import { Calendar, DollarSign, CreditCard, Check, AlertCircle, Clock, Plus, Eye, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FinanceContractBookkeepingService, { PaymentScheduleEntry, JournalEntry } from '../../services/FinanceContractBookkeepingService';

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.875rem;

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
          background-color: transparent;
          color: ${theme.colors.text.secondary};
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

const PaymentTable = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 80px 120px 120px 120px 120px 100px 100px;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
  font-weight: 600;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};

  @media (max-width: 1024px) {
    grid-template-columns: 60px 100px 100px 100px 80px 80px;
    font-size: 0.75rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const TableRow = styled.div<{ overdue?: boolean; paid?: boolean }>`
  display: grid;
  grid-template-columns: 80px 120px 120px 120px 120px 100px 100px;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ paid, overdue, theme }) => {
    if (paid) return `${theme.colors.secondary}20`;
    if (overdue) return `${theme.colors.accent}20`;
    return theme.colors.surface;
  }};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }

  @media (max-width: 1024px) {
    grid-template-columns: 60px 100px 100px 100px 80px 80px;
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

const StatusBadge = styled.div<{ status: 'pending' | 'paid' | 'overdue' }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;

  ${({ status, theme }) => {
    switch (status) {
      case 'paid':
        return `
          background-color: ${theme.colors.secondary}20;
          color: ${theme.colors.secondary};
        `;
      case 'overdue':
        return `
          background-color: ${theme.colors.accent}20;
          color: ${theme.colors.accent};
        `;
      default:
        return `
          background-color: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
        `;
    }
  }}
`;

const SummaryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SummaryCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const SummaryTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SummaryValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

interface FinanceContractPaymentsProps {
  contractId: string;
}

const FinanceContractPayments: React.FC<FinanceContractPaymentsProps> = ({
  contractId
}) => {
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentScheduleEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRecordPayment, setShowRecordPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentScheduleEntry | null>(null);
  const bookkeepingService = FinanceContractBookkeepingService.getInstance();

  useEffect(() => {
    loadPaymentData();
  }, [contractId]);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      const schedule = await bookkeepingService.getPaymentSchedule(contractId);
      const entries = await bookkeepingService.getContractJournalEntries(contractId);

      // Mark overdue payments
      const today = new Date().toISOString().split('T')[0];
      const updatedSchedule = schedule.map(payment => ({
        ...payment,
        status: payment.status === 'pending' && payment.dueDate < today ? 'overdue' as const : payment.status
      }));

      setPaymentSchedule(updatedSchedule);
      setJournalEntries(entries);
    } catch (error) {
      console.error('Error loading payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (paymentAmount: number, paymentDate: string) => {
    try {
      await bookkeepingService.recordPayment(contractId, paymentAmount, paymentDate);
      await loadPaymentData();
      setShowRecordPayment(false);
      setSelectedPayment(null);
      alert(`Payment of ${formatCurrency(paymentAmount)} recorded successfully!`);
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Error recording payment. Please try again.');
    }
  };

  const handleRecordLateFee = async () => {
    try {
      const feeAmount = 25; // Standard late fee from contract
      const today = new Date().toISOString().split('T')[0];
      await bookkeepingService.recordLateFee(contractId, feeAmount, today);
      await loadPaymentData();
      alert(`Late fee of ${formatCurrency(feeAmount)} recorded successfully!`);
    } catch (error) {
      console.error('Error recording late fee:', error);
      alert('Error recording late fee. Please try again.');
    }
  };

  const calculateSummary = () => {
    const totalPayments = paymentSchedule.reduce((sum, p) => sum + p.totalPayment, 0);
    const paidPayments = paymentSchedule.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.totalPayment, 0);
    const pendingPayments = paymentSchedule.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.totalPayment, 0);
    const overduePayments = paymentSchedule.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.totalPayment, 0);
    const remainingBalance = paymentSchedule.find(p => p.status === 'pending' || p.status === 'overdue')?.remainingBalance || 0;

    return {
      totalPayments,
      paidPayments,
      pendingPayments,
      overduePayments,
      remainingBalance
    };
  };

  const summary = calculateSummary();

  if (loading) {
    return <Container>Loading payment schedule...</Container>;
  }

  if (paymentSchedule.length === 0) {
    return (
      <Container>
        <Title>
          <CreditCard size={24} />
          Payment Schedule
        </Title>
        <p>No payment schedule found for this contract.</p>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <CreditCard size={24} />
          Payment Schedule - Contract {contractId}
        </Title>
        <ActionButtons>
          <Button onClick={() => setShowRecordPayment(true)}>
            <Plus size={16} />
            Record Payment
          </Button>
          <Button variant="secondary" onClick={handleRecordLateFee}>
            <AlertCircle size={16} />
            Add Late Fee
          </Button>
          <Button variant="secondary">
            <FileText size={16} />
            View Journal Entries
          </Button>
        </ActionButtons>
      </Header>

      <SummaryCards>
        <SummaryCard>
          <SummaryTitle>Total Contract</SummaryTitle>
          <SummaryValue>{formatCurrency(summary.totalPayments)}</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryTitle>Paid Amount</SummaryTitle>
          <SummaryValue style={{ color: '#10b981' }}>{formatCurrency(summary.paidPayments)}</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryTitle>Pending Amount</SummaryTitle>
          <SummaryValue style={{ color: '#f59e0b' }}>{formatCurrency(summary.pendingPayments)}</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryTitle>Overdue Amount</SummaryTitle>
          <SummaryValue style={{ color: '#ef4444' }}>{formatCurrency(summary.overduePayments)}</SummaryValue>
        </SummaryCard>
      </SummaryCards>

      <PaymentTable>
        <TableHeader>
          <div>Payment #</div>
          <div>Due Date</div>
          <div>Principal</div>
          <div>Interest</div>
          <div>Total Payment</div>
          <div>Balance</div>
          <div>Status</div>
        </TableHeader>
        {paymentSchedule.map((payment) => (
          <TableRow
            key={payment.paymentNumber}
            paid={payment.status === 'paid'}
            overdue={payment.status === 'overdue'}
          >
            <div>{payment.paymentNumber}</div>
            <div>{new Date(payment.dueDate).toLocaleDateString()}</div>
            <div>{formatCurrency(payment.principalAmount)}</div>
            <div>{formatCurrency(payment.interestAmount)}</div>
            <div>{formatCurrency(payment.totalPayment)}</div>
            <div>{formatCurrency(payment.remainingBalance)}</div>
            <div>
              <StatusBadge status={payment.status}>
                {payment.status === 'paid' && <Check size={12} />}
                {payment.status === 'overdue' && <AlertCircle size={12} />}
                {payment.status === 'pending' && <Clock size={12} />}
                {payment.status}
              </StatusBadge>
            </div>
          </TableRow>
        ))}
      </PaymentTable>

      {/* Record Payment Modal would go here */}
      {showRecordPayment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '0.5rem',
            minWidth: '400px'
          }}>
            <h3>Record Payment</h3>
            <p>Payment recording form would be implemented here.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <Button onClick={() => handleRecordPayment(paymentSchedule.find(p => p.status === 'pending')?.totalPayment || 0, new Date().toISOString().split('T')[0])}>
                Record Next Payment
              </Button>
              <Button variant="secondary" onClick={() => setShowRecordPayment(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default FinanceContractPayments;