import React from 'react';
import styled from 'styled-components';
import { X, AlertTriangle, Calendar, Clock, CheckCircle, Download } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  projectId: string;
  assignedTo: string[];
  progress: number;
}

interface Project {
  id: string;
  name: string;
  client: string;
}

interface OverdueMilestonesModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestones: Milestone[];
  projects: Project[];
  onDownloadReport: () => void;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.md};
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg} 0 0;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const StatusSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border-left: 4px solid #ef4444;
`;

const StatusIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: #ef444420;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
`;

const StatusText = styled.div`
  flex: 1;
`;

const StatusTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatusDescription = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const MilestoneList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const MilestoneCard = styled.div<{ priority: string }>`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border-left: 4px solid ${({ priority }) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      default: return '#6b7280';
    }
  }};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
  }
`;

const MilestoneHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const MilestoneTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const PriorityBadge = styled.span<{ priority: string }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: white;
  background-color: ${({ priority }) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      default: return '#6b7280';
    }
  }};
`;

const MilestoneDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const MilestoneDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
`;

const OverdueIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: #ef4444;
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyStateIcon = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: #10b98120;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #10b981;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${({ variant, theme }) => variant === 'primary' ? theme.colors.primary : theme.colors.border};
  background-color: ${({ variant, theme }) => variant === 'primary' ? theme.colors.primary : theme.colors.surface};
  color: ${({ variant, theme }) => variant === 'primary' ? 'white' : theme.colors.text.primary};
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover {
    background-color: ${({ variant, theme }) => variant === 'primary' ? `${theme.colors.primary}dd` : theme.colors.background};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const OverdueMilestonesModal: React.FC<OverdueMilestonesModalProps> = ({
  isOpen,
  onClose,
  milestones,
  projects,
  onDownloadReport
}) => {
  const overdueMilestones = milestones.filter(milestone => {
    const dueDate = new Date(milestone.dueDate);
    const now = new Date();
    return dueDate < now && milestone.status !== 'completed';
  });

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? `${project.name} (${project.client})` : 'Unknown Project';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysOverdue = (dateString: string) => {
    const dueDate = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <img src="/FFR logo 32x32.png" alt="FFR" style={{ height: '24px', marginRight: '8px' }} />
            Overdue Milestones Review
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <StatusSection>
            <StatusIcon>
              {overdueMilestones.length > 0 ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
            </StatusIcon>
            <StatusText>
              <StatusTitle>
                {overdueMilestones.length > 0
                  ? `${overdueMilestones.length} Overdue Milestone${overdueMilestones.length > 1 ? 's' : ''}`
                  : 'No Overdue Milestones'
                }
              </StatusTitle>
              <StatusDescription>
                {overdueMilestones.length > 0
                  ? 'The following milestones require immediate attention to keep projects on track.'
                  : 'All milestones are on schedule. Excellent project timeline management!'
                }
              </StatusDescription>
            </StatusText>
          </StatusSection>

          {overdueMilestones.length > 0 ? (
            <MilestoneList>
              {overdueMilestones
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .map((milestone) => (
                  <MilestoneCard key={milestone.id} priority={milestone.priority}>
                    <MilestoneHeader>
                      <MilestoneTitle>{milestone.title}</MilestoneTitle>
                      <PriorityBadge priority={milestone.priority}>{milestone.priority}</PriorityBadge>
                    </MilestoneHeader>

                    <MilestoneDetails>
                      <DetailItem>
                        <Calendar size={16} />
                        Due: {formatDate(milestone.dueDate)}
                      </DetailItem>
                      <DetailItem>
                        <Clock size={16} />
                        Progress: {milestone.progress}%
                      </DetailItem>
                    </MilestoneDetails>

                    <DetailItem style={{ marginBottom: '8px' }}>
                      Project: {getProjectName(milestone.projectId)}
                    </DetailItem>

                    <DetailItem style={{ marginBottom: '8px' }}>
                      Assigned to: {milestone.assignedTo.join(', ')}
                    </DetailItem>

                    {milestone.description && (
                      <MilestoneDescription>{milestone.description}</MilestoneDescription>
                    )}

                    <OverdueIndicator>
                      <AlertTriangle size={14} />
                      {getDaysOverdue(milestone.dueDate)} day{getDaysOverdue(milestone.dueDate) !== 1 ? 's' : ''} overdue
                    </OverdueIndicator>
                  </MilestoneCard>
                ))}
            </MilestoneList>
          ) : (
            <EmptyState>
              <EmptyStateIcon>
                <CheckCircle size={32} />
              </EmptyStateIcon>
              <h3 style={{ margin: '0 0 8px', color: '#10b981' }}>All Milestones On Track!</h3>
              <p style={{ margin: '0' }}>Your team is maintaining excellent project timelines.</p>
            </EmptyState>
          )}

          <ButtonGroup>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" onClick={onDownloadReport}>
              <Download size={16} />
              Download Report
            </Button>
          </ButtonGroup>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default OverdueMilestonesModal;