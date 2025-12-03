import React, { useState } from 'react';
import styled from 'styled-components';
import { X, FileText, BarChart3, Calendar, CheckCircle, Download, Filter } from 'lucide-react';

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
  status: 'planning' | 'in-progress' | 'inspection' | 'completed' | 'on-hold';
  progress: number;
  startDate: string;
  endDate: string;
}

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  milestones: Milestone[];
  onGenerateReport: (options: ReportOptions) => void;
}

interface ReportOptions {
  reportType: 'milestone' | 'project' | 'comprehensive';
  dateRange: 'all' | 'current-month' | 'last-30-days' | 'last-quarter';
  includeOverdue: boolean;
  includeCompleted: boolean;
  projectFilter: string[];
  format: 'pdf' | 'excel' | 'both';
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
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
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

const FormSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  transition: border-color 0.2s ease;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  accent-color: ${({ theme }) => theme.colors.primary};
`;

const CheckboxLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StatsSection = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const GenerateReportModal: React.FC<GenerateReportModalProps> = ({
  isOpen,
  onClose,
  projects,
  milestones,
  onGenerateReport
}) => {
  const [reportOptions, setReportOptions] = useState<ReportOptions>({
    reportType: 'comprehensive',
    dateRange: 'current-month',
    includeOverdue: true,
    includeCompleted: true,
    projectFilter: [],
    format: 'pdf'
  });

  const handleOptionChange = (field: keyof ReportOptions, value: any) => {
    setReportOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProjectFilterChange = (projectId: string, checked: boolean) => {
    setReportOptions(prev => ({
      ...prev,
      projectFilter: checked
        ? [...prev.projectFilter, projectId]
        : prev.projectFilter.filter(id => id !== projectId)
    }));
  };

  const handleGenerate = () => {
    onGenerateReport(reportOptions);
    onClose();
  };

  const calculateStats = () => {
    const totalProjects = projects.length;
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(m => m.status === 'completed').length;
    const overdueMilestones = milestones.filter(m => {
      const dueDate = new Date(m.dueDate);
      const now = new Date();
      return dueDate < now && m.status !== 'completed';
    }).length;

    return {
      totalProjects,
      totalMilestones,
      completedMilestones,
      overdueMilestones,
      completionRate: totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0
    };
  };

  const stats = calculateStats();

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <img src="/FFR logo 32x32.png" alt="FFR" style={{ height: '24px', marginRight: '8px' }} />
            Generate Project Report
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <StatsSection>
            <SectionTitle>
              <BarChart3 size={18} />
              Current Portfolio Overview
            </SectionTitle>
            <StatsGrid>
              <StatItem>
                <StatValue>{stats.totalProjects}</StatValue>
                <StatLabel>Total Projects</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{stats.totalMilestones}</StatValue>
                <StatLabel>Total Milestones</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{stats.completedMilestones}</StatValue>
                <StatLabel>Completed</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{stats.overdueMilestones}</StatValue>
                <StatLabel>Overdue</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{stats.completionRate}%</StatValue>
                <StatLabel>Completion Rate</StatLabel>
              </StatItem>
            </StatsGrid>
          </StatsSection>

          <FormSection>
            <SectionTitle>
              <FileText size={18} />
              Report Configuration
            </SectionTitle>

            <FormGrid>
              <FormGroup>
                <Label>Report Type</Label>
                <Select
                  value={reportOptions.reportType}
                  onChange={(e) => handleOptionChange('reportType', e.target.value as ReportOptions['reportType'])}
                >
                  <option value="milestone">Milestone Report</option>
                  <option value="project">Project Summary</option>
                  <option value="comprehensive">Comprehensive Report</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Date Range</Label>
                <Select
                  value={reportOptions.dateRange}
                  onChange={(e) => handleOptionChange('dateRange', e.target.value as ReportOptions['dateRange'])}
                >
                  <option value="all">All Time</option>
                  <option value="current-month">Current Month</option>
                  <option value="last-30-days">Last 30 Days</option>
                  <option value="last-quarter">Last Quarter</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Output Format</Label>
                <Select
                  value={reportOptions.format}
                  onChange={(e) => handleOptionChange('format', e.target.value as ReportOptions['format'])}
                >
                  <option value="pdf">PDF Report</option>
                  <option value="excel">Excel Spreadsheet</option>
                  <option value="both">Both PDF & Excel</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Include Options</Label>
                <CheckboxGroup>
                  <CheckboxItem>
                    <Checkbox
                      type="checkbox"
                      checked={reportOptions.includeOverdue}
                      onChange={(e) => handleOptionChange('includeOverdue', e.target.checked)}
                    />
                    <CheckboxLabel>Include Overdue Items</CheckboxLabel>
                  </CheckboxItem>
                  <CheckboxItem>
                    <Checkbox
                      type="checkbox"
                      checked={reportOptions.includeCompleted}
                      onChange={(e) => handleOptionChange('includeCompleted', e.target.checked)}
                    />
                    <CheckboxLabel>Include Completed Items</CheckboxLabel>
                  </CheckboxItem>
                </CheckboxGroup>
              </FormGroup>
            </FormGrid>
          </FormSection>

          {projects.length > 0 && (
            <FormSection>
              <SectionTitle>
                <Filter size={18} />
                Project Filter (Optional)
              </SectionTitle>
              <CheckboxGroup>
                {projects.slice(0, 8).map(project => (
                  <CheckboxItem key={project.id}>
                    <Checkbox
                      type="checkbox"
                      checked={reportOptions.projectFilter.includes(project.id)}
                      onChange={(e) => handleProjectFilterChange(project.id, e.target.checked)}
                    />
                    <CheckboxLabel>{project.name} - {project.client}</CheckboxLabel>
                  </CheckboxItem>
                ))}
                {projects.length > 8 && (
                  <div style={{ fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic' }}>
                    + {projects.length - 8} more projects (leave blank to include all)
                  </div>
                )}
              </CheckboxGroup>
            </FormSection>
          )}

          <ButtonGroup>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleGenerate}>
              <Download size={16} />
              Generate Report
            </Button>
          </ButtonGroup>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default GenerateReportModal;