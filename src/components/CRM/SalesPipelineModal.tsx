import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, TrendingUp, Users, DollarSign, Calendar, Target, ArrowRight, Plus, Edit, Trash2, BarChart3 } from 'lucide-react';

interface SalesPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pipelineData: any) => void;
}

interface Deal {
  id: string;
  customerName: string;
  value: number;
  stage: string;
  probability: number;
  expectedClose: string;
  lastContact: string;
  notes: string;
  assignedTo: string;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 95vw;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: white;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const PipelineStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
`;

const StatIcon = styled.div<{ color: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ color }) => color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  color: ${({ color }) => color};
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const PipelineContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  overflow-x: auto;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.md};
`;

const PipelineStage = styled.div`
  min-width: 280px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const StageHeader = styled.div<{ color: string }>`
  background: linear-gradient(135deg, ${({ color }) => color}, ${({ color }) => color}dd);
  color: white;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg} 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StageTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
`;

const StageValue = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
`;

const StageBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  min-height: 400px;
`;

const DealCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-1px);
  }
`;

const DealHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const DealName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.875rem;
  flex: 1;
`;

const DealValue = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 0.875rem;
`;

const DealMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const ProbabilityBar = styled.div<{ probability: number }>`
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: 2px;
  margin: ${({ theme }) => theme.spacing.xs} 0;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${({ probability }) => probability}%;
    background-color: ${({ probability, theme }) =>
      probability >= 75 ? theme.colors.secondary :
      probability >= 50 ? '#f59e0b' :
      probability >= 25 ? '#ef4444' : theme.colors.text.light
    };
    border-radius: 2px;
    transition: width 0.3s ease;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const SmallButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          border-color: ${theme.colors.primary};
          background-color: ${theme.colors.primary};
          color: white;
          &:hover { background-color: ${theme.colors.primary}dd; }
        `;
      case 'danger':
        return `
          border-color: ${theme.colors.accent};
          background-color: transparent;
          color: ${theme.colors.accent};
          &:hover { background-color: ${theme.colors.accent}10; }
        `;
      default:
        return `
          border-color: ${theme.colors.border};
          background-color: transparent;
          color: ${theme.colors.text.secondary};
          &:hover { background-color: ${theme.colors.background}; }
        `;
    }
  }}
`;

const AddDealButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px dashed ${({ theme }) => theme.colors.border};
  background: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primary}05;
  }
`;

const ChartSection = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${({ variant, theme }) => variant === 'primary' ? theme.colors.primary : theme.colors.border};
  background-color: ${({ variant, theme }) => variant === 'primary' ? theme.colors.primary : theme.colors.surface};
  color: ${({ variant, theme }) => variant === 'primary' ? 'white' : theme.colors.text.primary};

  &:hover {
    background-color: ${({ variant, theme }) => variant === 'primary' ? `${theme.colors.primary}dd` : theme.colors.background};
  }
`;

const SalesPipelineModal: React.FC<SalesPipelineModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [deals, setDeals] = useState<Deal[]>([
    {
      id: '1',
      customerName: 'Johnson Family - Complete Re-roof',
      value: 18500,
      stage: 'qualified',
      probability: 75,
      expectedClose: '2024-02-15',
      lastContact: '2024-01-28',
      notes: 'Ready to schedule, waiting for permit approval',
      assignedTo: 'Mike Rodriguez'
    },
    {
      id: '2',
      customerName: 'ABC Corp - Office Building',
      value: 45000,
      stage: 'proposal',
      probability: 60,
      expectedClose: '2024-02-28',
      lastContact: '2024-01-25',
      notes: 'Proposal sent, follow-up scheduled',
      assignedTo: 'Sarah Chen'
    },
    {
      id: '3',
      customerName: 'Smith Residence - Repair',
      value: 3200,
      stage: 'negotiation',
      probability: 85,
      expectedClose: '2024-02-10',
      lastContact: '2024-01-29',
      notes: 'Price agreed, scheduling crew',
      assignedTo: 'Mike Rodriguez'
    },
    {
      id: '4',
      customerName: 'Williams House - Gutters',
      value: 2800,
      stage: 'closed_won',
      probability: 100,
      expectedClose: '2024-01-30',
      lastContact: '2024-01-30',
      notes: 'Project completed successfully',
      assignedTo: 'Tom Wilson'
    }
  ]);

  const stages = [
    { id: 'lead', title: 'Leads', color: '#6b7280' },
    { id: 'qualified', title: 'Qualified', color: '#3b82f6' },
    { id: 'proposal', title: 'Proposal Sent', color: '#f59e0b' },
    { id: 'negotiation', title: 'Negotiation', color: '#ef4444' },
    { id: 'closed_won', title: 'Closed Won', color: '#10b981' },
    { id: 'closed_lost', title: 'Closed Lost', color: '#6b7280' }
  ];

  const getDealsForStage = (stageId: string) => {
    return deals.filter(deal => deal.stage === stageId);
  };

  const getStageValue = (stageId: string) => {
    const stageDeals = getDealsForStage(stageId);
    return stageDeals.reduce((sum, deal) => sum + deal.value, 0);
  };

  const calculateStats = () => {
    const totalPipeline = deals.reduce((sum, deal) => sum + (deal.stage !== 'closed_lost' ? deal.value : 0), 0);
    const wonDeals = deals.filter(deal => deal.stage === 'closed_won');
    const totalWon = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
    const activeDeals = deals.filter(deal => !['closed_won', 'closed_lost'].includes(deal.stage)).length;
    const averageDealSize = activeDeals > 0 ? Math.round(totalPipeline / activeDeals) : 0;

    return { totalPipeline, totalWon, activeDeals, averageDealSize };
  };

  const stats = calculateStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleMoveDeal = (dealId: string, newStage: string) => {
    setDeals(prev => prev.map(deal =>
      deal.id === dealId ? { ...deal, stage: newStage } : deal
    ));
  };

  const handleDeleteDeal = (dealId: string) => {
    setDeals(prev => prev.filter(deal => deal.id !== dealId));
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <img src="/FFR logo 32x32.png" alt="FFR" style={{ height: '20px', marginRight: '8px' }} />
            Sales Pipeline Management
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <PipelineStats>
            <StatCard>
              <StatIcon color="#3b82f6">
                <TrendingUp size={20} />
              </StatIcon>
              <StatValue>{formatCurrency(stats.totalPipeline)}</StatValue>
              <StatLabel>Total Pipeline</StatLabel>
            </StatCard>

            <StatCard>
              <StatIcon color="#10b981">
                <DollarSign size={20} />
              </StatIcon>
              <StatValue>{formatCurrency(stats.totalWon)}</StatValue>
              <StatLabel>Won This Month</StatLabel>
            </StatCard>

            <StatCard>
              <StatIcon color="#f59e0b">
                <Users size={20} />
              </StatIcon>
              <StatValue>{stats.activeDeals}</StatValue>
              <StatLabel>Active Deals</StatLabel>
            </StatCard>

            <StatCard>
              <StatIcon color="#ef4444">
                <Target size={20} />
              </StatIcon>
              <StatValue>{formatCurrency(stats.averageDealSize)}</StatValue>
              <StatLabel>Average Deal Size</StatLabel>
            </StatCard>
          </PipelineStats>

          <PipelineContainer>
            {stages.map((stage) => (
              <PipelineStage key={stage.id}>
                <StageHeader color={stage.color}>
                  <StageTitle>{stage.title}</StageTitle>
                  <StageValue>{formatCurrency(getStageValue(stage.id))}</StageValue>
                </StageHeader>
                <StageBody>
                  {getDealsForStage(stage.id).map((deal) => (
                    <DealCard key={deal.id}>
                      <DealHeader>
                        <DealName>{deal.customerName}</DealName>
                        <DealValue>{formatCurrency(deal.value)}</DealValue>
                      </DealHeader>

                      <ProbabilityBar probability={deal.probability} />

                      <DealMeta>
                        <span>{deal.probability}% • {formatDate(deal.expectedClose)}</span>
                        <span>{deal.assignedTo}</span>
                      </DealMeta>

                      <ActionButtons>
                        <SmallButton
                          variant="secondary"
                          onClick={() => alert(`Editing deal: ${deal.customerName}`)}
                        >
                          <Edit size={12} />
                          Edit
                        </SmallButton>
                        <SmallButton
                          variant="primary"
                          onClick={() => {
                            const nextStageIndex = stages.findIndex(s => s.id === deal.stage) + 1;
                            if (nextStageIndex < stages.length) {
                              handleMoveDeal(deal.id, stages[nextStageIndex].id);
                            }
                          }}
                        >
                          <ArrowRight size={12} />
                          Advance
                        </SmallButton>
                        <SmallButton
                          variant="danger"
                          onClick={() => {
                            // eslint-disable-next-line no-restricted-globals
                            if (confirm(`Delete deal: ${deal.customerName}?`)) {
                              handleDeleteDeal(deal.id);
                            }
                          }}
                        >
                          <Trash2 size={12} />
                        </SmallButton>
                      </ActionButtons>
                    </DealCard>
                  ))}

                  <AddDealButton onClick={() => alert('Add new deal modal would open here')}>
                    <Plus size={16} />
                    Add Deal
                  </AddDealButton>
                </StageBody>
              </PipelineStage>
            ))}
          </PipelineContainer>

          <ChartSection>
            <ChartTitle>
              <BarChart3 size={16} />
              Pipeline Analytics
            </ChartTitle>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              textAlign: 'center'
            }}>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                  {((stats.totalWon / (stats.totalWon + stats.totalPipeline)) * 100).toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Win Rate</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  14 days
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Avg. Sales Cycle</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                  {formatCurrency(85000)}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Monthly Target</div>
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>
                  {((stats.totalWon / 85000) * 100).toFixed(0)}%
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Target Achievement</div>
              </div>
            </div>
          </ChartSection>

          <ButtonGroup>
            <Button variant="secondary" onClick={onClose}>
              Close Pipeline
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onSave({ deals, stats });
                onClose();
              }}
            >
              Save Changes
            </Button>
          </ButtonGroup>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default SalesPipelineModal;