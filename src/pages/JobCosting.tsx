import React, { useState } from 'react';
import styled from 'styled-components';
import {
  HardHat,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Calculator,
  TrendingUp,
  Clock,
  AlertCircle,
  X,
  Save
} from 'lucide-react';
import AddJobModal from '../components/JobCosting/AddJobModal';
import { useData } from '../contexts/DataContext';
import { formatCurrency } from '../utils/currencyFormatter';
import BrandedModalTitle from '../components/Shared/BrandedModalTitle';

const PageContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    align-items: stretch;
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex: 1;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background-color: ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, variant }) =>
    variant === 'primary' ? 'white' : theme.colors.text.primary};
  border: 1px solid ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.primary : theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme, variant }) =>
      variant === 'primary' ? theme.colors.primary + 'dd' : theme.colors.background};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StatTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatIcon = styled.div<{ color?: string }>`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ color, theme }) => color || theme.colors.primary}20;
  color: ${({ color, theme }) => color || theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatChange = styled.div<{ positive?: boolean }>`
  font-size: 0.875rem;
  color: ${({ positive, theme }) =>
    positive ? theme.colors.secondary : theme.colors.accent};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const JobsContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const JobsHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    align-items: stretch;
  }
`;

const JobsTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FilterContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const JobsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: ${({ theme }) => theme.colors.background};
`;

const TableHeaderCell = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TableRow = styled.tr`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const JobCode = styled.span`
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const JobStatus = styled.span<{ status: string }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${({ status, theme }) => {
    switch (status) {
      case 'active':
        return `
          background-color: ${theme.colors.secondary}20;
          color: ${theme.colors.secondary};
        `;
      case 'completed':
        return `
          background-color: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
        `;
      case 'pending':
        return `
          background-color: ${theme.colors.roofing.tile}20;
          color: ${theme.colors.roofing.tile};
        `;
      case 'on-hold':
        return `
          background-color: ${theme.colors.accent}20;
          color: ${theme.colors.accent};
        `;
      default:
        return `
          background-color: ${theme.colors.text.light}20;
          color: ${theme.colors.text.secondary};
        `;
    }
  }}
`;

const ProfitMargin = styled.span<{ margin: number }>`
  font-weight: 600;
  color: ${({ margin, theme }) =>
    margin >= 20 ? theme.colors.secondary :
    margin >= 10 ? theme.colors.roofing.tile : theme.colors.accent};
`;

const ActionsCell = styled(TableCell)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionIconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.light};
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

// Modal Components
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
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  &.full-width {
    grid-column: 1 / -1;
  }
`;

const FormLabel = styled.label`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.875rem;
`;

const FormInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.secondary};
    cursor: not-allowed;
  }
`;

const FormSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.secondary};
    cursor: not-allowed;
  }
`;

const FormTextarea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.secondary};
    cursor: not-allowed;
  }
`;

const ModalButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background-color: ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, variant }) =>
    variant === 'primary' ? 'white' : theme.colors.text.primary};
  border: 1px solid ${({ theme, variant }) =>
    variant === 'primary' ? theme.colors.primary : theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme, variant }) =>
      variant === 'primary' ? theme.colors.primary + 'dd' : theme.colors.background};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const JobCosting: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');

  // Modal state
  const [showViewJobModal, setShowViewJobModal] = useState(false);
  const [showEditJobModal, setShowEditJobModal] = useState(false);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [editingJob, setEditingJob] = useState<any>(null);

  // Use shared data context
  const { customers, jobs, addJob } = useData();

  // Sample data - in real app, this would come from API - now using shared context

  const filteredJobs = jobs.filter(job => {
    return (statusFilter === 'all' || job.status === statusFilter) &&
           (jobTypeFilter === 'all' || job.projectType === jobTypeFilter);
  });

  const totalActiveJobs = jobs.filter(job => job.status === 'active').length;
  const totalRevenue = jobs.reduce((sum, job) => sum + job.estimatedValue, 0);
  const totalCosts = jobs.reduce((sum, job) => sum + job.actualCosts, 0);
  const averageMargin = jobs.length > 0 ? jobs.reduce((sum, job) => sum + (job.profitMargin || 0), 0) / jobs.length : 0;

  // CSV export helper functions
  const downloadCSV = (data: string, filename: string) => {
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJobsToCSV = () => {
    const headers = [
      'Job Code',
      'Job Name',
      'Customer',
      'Project Type',
      'Status',
      'Start Date',
      'Estimated Value',
      'Actual Costs',
      'Labor Costs',
      'Material Costs',
      'Equipment Costs',
      'Profit Margin (%)',
      'Progress (%)',
      'Description'
    ];

    const csvData = [
      headers.join(','),
      ...filteredJobs.map(job => [
        `"${job.jobCode}"`,
        `"${job.name}"`,
        `"${job.customer}"`,
        `"${job.projectType}"`,
        `"${job.status}"`,
        `"${job.startDate}"`,
        job.estimatedValue.toString(),
        job.actualCosts.toString(),
        (job.laborCosts || 0).toString(),
        (job.materialCosts || 0).toString(),
        (job.equipmentCosts || 0).toString(),
        job.profitMargin.toFixed(1),
        job.progress.toString(),
        `"${job.description || ''}"`
      ].join(','))
    ].join('\n');

    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `job-costing-data-${timestamp}.csv`;

    downloadCSV(csvData, filename);
    console.log(`✅ Exported ${filteredJobs.length} jobs to ${filename}`);
  };

  const exportJobCostingReport = () => {
    const reportData = [
      ['Florida First Roofing - Job Costing Summary Report'],
      ['Generated:', new Date().toLocaleDateString()],
      [''],
      ['SUMMARY METRICS'],
      ['Total Active Jobs:', totalActiveJobs.toString()],
      ['Total Job Value:', formatCurrency(totalRevenue)],
      ['Total Costs:', formatCurrency(totalCosts)],
      ['Average Margin:', `${averageMargin.toFixed(1)}%`],
      [''],
      ['JOB BREAKDOWN BY TYPE'],
      ...Object.entries(
        filteredJobs.reduce((acc, job) => {
          acc[job.projectType] = (acc[job.projectType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).map(([type, count]) => [type, count.toString()]),
      [''],
      ['JOB BREAKDOWN BY STATUS'],
      ...Object.entries(
        filteredJobs.reduce((acc, job) => {
          acc[job.status] = (acc[job.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).map(([status, count]) => [status, count.toString()])
    ];

    const csvData = reportData.map(row => row.join(',')).join('\n');
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `job-costing-report-${timestamp}.csv`;

    downloadCSV(csvData, filename);
    console.log(`✅ Exported job costing report to ${filename}`);
  };

  const handleAddJob = (jobData: any) => {
    console.log('New job added:', jobData);

    // Create new job object with proper structure
    const newJob = {
      id: `J${String(jobs.length + 1).padStart(3, '0')}`,
      jobCode: `${jobData.projectType.substring(0, 2).toUpperCase()}-2024-${String(jobs.length + 1).padStart(3, '0')}`,
      name: jobData.name,
      customer: jobData.customer,
      projectType: jobData.projectType,
      type: jobData.projectType,
      status: 'pending',
      startDate: jobData.startDate,
      estimatedValue: parseFloat(jobData.estimatedCost) || 0,
      actualCosts: 0,
      laborCosts: parseFloat(jobData.laborCost) || 0,
      materialCosts: parseFloat(jobData.materialCost) || 0,
      equipmentCosts: parseFloat(jobData.equipmentCost) || 0,
      profitMargin: 0,
      progress: 0,
      description: jobData.description || ''
    };

    // Add job to shared state
    addJob(newJob);

    console.log(`✅ JobCosting: Job added to shared state: ${jobData.name}`);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          <HardHat size={28} />
          Job Cost Management
        </PageTitle>
        <HeaderActions>
          <ActionButton
            variant="secondary"
            onClick={exportJobCostingReport}
          >
            <Filter size={16} />
            Export Report
          </ActionButton>
          <ActionButton
            variant="primary"
            onClick={() => setShowAddJobModal(true)}
          >
            <Plus size={16} />
            Add Job
          </ActionButton>
        </HeaderActions>
      </PageHeader>

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatTitle>Active Jobs</StatTitle>
            <StatIcon color="#059669">
              <HardHat size={18} />
            </StatIcon>
          </StatHeader>
          <StatValue>{totalActiveJobs}</StatValue>
          <StatChange positive={true}>
            <TrendingUp size={16} />
            +2 from last month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Total Job Value</StatTitle>
            <StatIcon color="#1e40af">
              <Calculator size={18} />
            </StatIcon>
          </StatHeader>
          <StatValue>{formatCurrency(totalRevenue)}</StatValue>
          <StatChange positive={true}>
            <TrendingUp size={16} />
            +15% from last month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Total Costs</StatTitle>
            <StatIcon color="#dc2626">
              <AlertCircle size={18} />
            </StatIcon>
          </StatHeader>
          <StatValue>{formatCurrency(totalCosts)}</StatValue>
          <StatChange positive={false}>
            <Clock size={16} />
            Track carefully
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Average Margin</StatTitle>
            <StatIcon color="#8b4513">
              <TrendingUp size={18} />
            </StatIcon>
          </StatHeader>
          <StatValue>{averageMargin.toFixed(1)}%</StatValue>
          <StatChange positive={averageMargin > 20}>
            {averageMargin > 20 ? <TrendingUp size={16} /> : <AlertCircle size={16} />}
            {averageMargin > 20 ? 'Healthy margin' : 'Monitor closely'}
          </StatChange>
        </StatCard>
      </StatsGrid>

      <JobsContainer>
        <JobsHeader>
          <JobsTitle>Current Jobs</JobsTitle>
          <FilterContainer>
            <FilterSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </FilterSelect>
            <FilterSelect
              value={jobTypeFilter}
              onChange={(e) => setJobTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Residential Re-roof">Residential Re-roof</option>
              <option value="Commercial">Commercial</option>
              <option value="Repair">Repair</option>
              <option value="Emergency">Emergency</option>
            </FilterSelect>
            <ActionButton
              variant="secondary"
              onClick={exportJobsToCSV}
            >
              <Download size={16} />
              Export
            </ActionButton>
          </FilterContainer>
        </JobsHeader>

        <JobsTable>
          <TableHeader>
            <tr>
              <TableHeaderCell>Job Code</TableHeaderCell>
              <TableHeaderCell>Job Name</TableHeaderCell>
              <TableHeaderCell>Customer</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Estimated Value</TableHeaderCell>
              <TableHeaderCell>Actual Costs</TableHeaderCell>
              <TableHeaderCell>Profit Margin</TableHeaderCell>
              <TableHeaderCell>Progress</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </tr>
          </TableHeader>
          <tbody>
            {filteredJobs.map((job) => (
              <TableRow key={job.id} className="job-card">
                <TableCell>
                  <JobCode>{job.jobCode}</JobCode>
                </TableCell>
                <TableCell>{job.name}</TableCell>
                <TableCell>{job.customer}</TableCell>
                <TableCell>{job.projectType}</TableCell>
                <TableCell>
                  <JobStatus status={job.status}>{job.status}</JobStatus>
                </TableCell>
                <TableCell className="cost-breakdown">{formatCurrency(job.estimatedValue)}</TableCell>
                <TableCell className="cost-breakdown">{formatCurrency(job.actualCosts)}</TableCell>
                <TableCell>
                  <ProfitMargin margin={job.profitMargin}>
                    {job.profitMargin.toFixed(1)}%
                  </ProfitMargin>
                </TableCell>
                <TableCell>{job.progress}%</TableCell>
                <ActionsCell>
                  <ActionIconButton
                    onClick={() => {
                      setSelectedJob(job);
                      setShowViewJobModal(true);
                    }}
                    title="View job details"
                  >
                    <Eye size={16} />
                  </ActionIconButton>
                  <ActionIconButton
                    onClick={() => {
                      setEditingJob({ ...job });
                      setShowEditJobModal(true);
                    }}
                    title="Edit job"
                  >
                    <Edit size={16} />
                  </ActionIconButton>
                  <ActionIconButton
                    onClick={() => alert(`Opening cost calculator for ${job.jobCode}\n\nEstimated Value: ${formatCurrency(job.estimatedValue)}\nActual Costs: ${formatCurrency(job.actualCosts)}\nProfit Margin: ${job.profitMargin.toFixed(1)}%`)}
                    title="Cost calculator"
                  >
                    <Calculator size={16} />
                  </ActionIconButton>
                </ActionsCell>
              </TableRow>
            ))}
          </tbody>
        </JobsTable>
      </JobsContainer>

      {/* View Job Modal */}
      {showViewJobModal && selectedJob && (
        <ModalOverlay onClick={() => setShowViewJobModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <BrandedModalTitle>View Job Details - {selectedJob.jobCode}</BrandedModalTitle>
              <ModalCloseButton onClick={() => setShowViewJobModal(false)}>
                <X size={20} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <FormGrid>
                <FormGroup>
                  <FormLabel>Job Code</FormLabel>
                  <FormInput value={selectedJob.jobCode} disabled />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Job Name</FormLabel>
                  <FormInput value={selectedJob.name} disabled />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Customer</FormLabel>
                  <FormInput value={selectedJob.customer} disabled />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Job Type</FormLabel>
                  <FormInput value={selectedJob.type} disabled />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Status</FormLabel>
                  <FormInput value={selectedJob.status} disabled />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Start Date</FormLabel>
                  <FormInput value={selectedJob.startDate} disabled />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Estimated Value</FormLabel>
                  <FormInput value={formatCurrency(selectedJob.estimatedValue)} disabled />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Actual Costs</FormLabel>
                  <FormInput value={formatCurrency(selectedJob.actualCosts)} disabled />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Labor Costs</FormLabel>
                  <FormInput value={formatCurrency(selectedJob.laborCosts)} disabled />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Material Costs</FormLabel>
                  <FormInput value={formatCurrency(selectedJob.materialCosts)} disabled />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Profit Margin</FormLabel>
                  <FormInput value={`${selectedJob.profitMargin.toFixed(1)}%`} disabled />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Progress</FormLabel>
                  <FormInput value={`${selectedJob.progress}%`} disabled />
                </FormGroup>
              </FormGrid>
            </ModalBody>
            <ModalFooter>
              <ModalButton
                variant="primary"
                onClick={() => {
                  setEditingJob({ ...selectedJob });
                  setShowViewJobModal(false);
                  setShowEditJobModal(true);
                }}
              >
                <Edit size={16} />
                Edit Job
              </ModalButton>
              <ModalButton variant="secondary" onClick={() => setShowViewJobModal(false)}>
                Close
              </ModalButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Edit Job Modal */}
      {showEditJobModal && editingJob && (
        <ModalOverlay onClick={() => setShowEditJobModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <BrandedModalTitle>Edit Job - {editingJob.jobCode}</BrandedModalTitle>
              <ModalCloseButton onClick={() => setShowEditJobModal(false)}>
                <X size={20} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <FormGrid>
                <FormGroup>
                  <FormLabel>Job Code</FormLabel>
                  <FormInput
                    value={editingJob.jobCode}
                    onChange={(e) => setEditingJob({...editingJob, jobCode: e.target.value})}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Job Name</FormLabel>
                  <FormInput
                    value={editingJob.name}
                    onChange={(e) => setEditingJob({...editingJob, name: e.target.value})}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Customer</FormLabel>
                  <FormInput
                    value={editingJob.customer}
                    onChange={(e) => setEditingJob({...editingJob, customer: e.target.value})}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Job Type</FormLabel>
                  <FormSelect
                    value={editingJob.type}
                    onChange={(e) => setEditingJob({...editingJob, type: e.target.value})}
                  >
                    <option value="Residential Re-roof">Residential Re-roof</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Repair">Repair</option>
                    <option value="Emergency">Emergency</option>
                    <option value="New Installation">New Installation</option>
                    <option value="Inspection">Inspection</option>
                  </FormSelect>
                </FormGroup>
                <FormGroup>
                  <FormLabel>Status</FormLabel>
                  <FormSelect
                    value={editingJob.status}
                    onChange={(e) => setEditingJob({...editingJob, status: e.target.value})}
                  >
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                  </FormSelect>
                </FormGroup>
                <FormGroup>
                  <FormLabel>Start Date</FormLabel>
                  <FormInput
                    type="date"
                    value={editingJob.startDate}
                    onChange={(e) => setEditingJob({...editingJob, startDate: e.target.value})}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Estimated Value</FormLabel>
                  <FormInput
                    type="number"
                    value={editingJob.estimatedValue}
                    onChange={(e) => setEditingJob({...editingJob, estimatedValue: parseFloat(e.target.value) || 0})}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Actual Costs</FormLabel>
                  <FormInput
                    type="number"
                    value={editingJob.actualCosts}
                    onChange={(e) => setEditingJob({...editingJob, actualCosts: parseFloat(e.target.value) || 0})}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Labor Costs</FormLabel>
                  <FormInput
                    type="number"
                    value={editingJob.laborCosts}
                    onChange={(e) => setEditingJob({...editingJob, laborCosts: parseFloat(e.target.value) || 0})}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Material Costs</FormLabel>
                  <FormInput
                    type="number"
                    value={editingJob.materialCosts}
                    onChange={(e) => setEditingJob({...editingJob, materialCosts: parseFloat(e.target.value) || 0})}
                  />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Progress (%)</FormLabel>
                  <FormInput
                    type="number"
                    min="0"
                    max="100"
                    value={editingJob.progress}
                    onChange={(e) => setEditingJob({...editingJob, progress: parseInt(e.target.value) || 0})}
                  />
                </FormGroup>
              </FormGrid>
            </ModalBody>
            <ModalFooter>
              <ModalButton
                variant="primary"
                onClick={() => {
                  // Calculate profit margin
                  const profitMargin = editingJob.estimatedValue > 0 ?
                    ((editingJob.estimatedValue - editingJob.actualCosts) / editingJob.estimatedValue) * 100 : 0;
                  setEditingJob({...editingJob, profitMargin});

                  alert(`Job ${editingJob.jobCode} updated successfully!\n\nUpdated Values:\n• Estimated Value: ${formatCurrency(editingJob.estimatedValue)}\n• Actual Costs: ${formatCurrency(editingJob.actualCosts)}\n• Calculated Profit Margin: ${profitMargin.toFixed(1)}%\n• Progress: ${editingJob.progress}%`);
                  setShowEditJobModal(false);
                }}
              >
                <Save size={16} />
                Save Changes
              </ModalButton>
              <ModalButton variant="secondary" onClick={() => setShowEditJobModal(false)}>
                Cancel
              </ModalButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      <AddJobModal
        isOpen={showAddJobModal}
        onClose={() => setShowAddJobModal(false)}
        onSave={handleAddJob}
      />
    </PageContainer>
  );
};

export default JobCosting;