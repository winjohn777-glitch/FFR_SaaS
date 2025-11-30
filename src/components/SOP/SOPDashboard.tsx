import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FFR_UNIFIED_BRAND } from '../Shared/UnifiedFFRBranding';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  MapPin,
  Cloud
} from 'lucide-react';

// Types
interface ComplianceMetric {
  sop_number: string;
  title: string;
  category_name: string;
  total_assignments: number;
  completed_assignments: number;
  overdue_assignments: number;
  completion_rate: number;
  avg_compliance_rate: number;
}

interface EmployeeTrainingStatus {
  employee_id: number;
  employee_name: string;
  position: string;
  required_sop_trainings: number;
  completed_trainings: number;
  overdue_trainings: number;
  training_completion_rate: number;
}

interface ProjectCompliance {
  project_id: number;
  job_number: string;
  job_name: string;
  job_status: string;
  total_sop_assignments: number;
  completed_sops: number;
  overdue_sops: number;
  sop_compliance_rate: number;
  avg_compliance_score: number;
}

// Styled Components
const Dashboard = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
`;

const DashboardHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1rem;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const MetricCard = styled(motion.div)<{ variant?: 'success' | 'warning' | 'danger' | 'info' }>`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border-left: 4px solid ${({ variant, theme }) => {
    switch (variant) {
      case 'success': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'danger': return '#DC2626';
      case 'info': return '#3B82F6';
      default: return theme.colors.primary;
    }
  }};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 60px;
    background: ${({ variant }) => {
      switch (variant) {
        case 'success': return '#10B98110';
        case 'warning': return '#F59E0B10';
        case 'danger': return '#DC262610';
        case 'info': return '#3B82F610';
        default: return '#1e40af10';
      }
    }};
    border-radius: 0 0 0 60px;
  }
`;

const MetricHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const MetricIcon = styled.div<{ variant?: 'success' | 'warning' | 'danger' | 'info' }>`
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ variant }) => {
    switch (variant) {
      case 'success': return '#10B98120';
      case 'warning': return '#F59E0B20';
      case 'danger': return '#DC262620';
      case 'info': return '#3B82F620';
      default: return '#1e40af20';
    }
  }};
  color: ${({ variant }) => {
    switch (variant) {
      case 'success': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'danger': return '#DC2626';
      case 'info': return '#3B82F6';
      default: return '#1e40af';
    }
  }};
`;

const MetricValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const MetricTrend = styled.div<{ positive?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ positive }) => positive ? '#10B981' : '#DC2626'};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const ChartTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TablesGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const TableCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
`;

const TableHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
`;

const TableTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: ${({ theme }) => theme.colors.background};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const TableHeader2 = styled.th`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ProgressBar = styled.div<{ percentage: number; variant?: 'success' | 'warning' | 'danger' }>`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${({ percentage }) => percentage}%;
    background: ${({ variant }) => {
      switch (variant) {
        case 'success': return '#10B981';
        case 'warning': return '#F59E0B';
        case 'danger': return '#DC2626';
        default: return '#3B82F6';
      }
    }};
    transition: width 0.3s ease;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 500;

  ${({ status }) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'compliant':
        return 'background: #10B98120; color: #10B981;';
      case 'in_progress':
      case 'partial':
        return 'background: #F59E0B20; color: #F59E0B;';
      case 'overdue':
      case 'non_compliant':
        return 'background: #DC262620; color: #DC2626;';
      default:
        return 'background: #6B728020; color: #6B7280;';
    }
  }}
`;

const AlertCard = styled(motion.div)`
  background: linear-gradient(135deg, #FEF3C7, #FDE68A);
  border: 1px solid #F59E0B;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SOPDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<ComplianceMetric[]>([]);
  const [employeeStatus, setEmployeeStatus] = useState<EmployeeTrainingStatus[]>([]);
  const [projectCompliance, setProjectCompliance] = useState<ProjectCompliance[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const loadMockData = () => {
      const mockMetrics: ComplianceMetric[] = [
        {
          sop_number: '1001',
          title: 'Pre-Job Safety Inspection',
          category_name: 'Safety & OSHA Compliance',
          total_assignments: 45,
          completed_assignments: 38,
          overdue_assignments: 3,
          completion_rate: 84.4,
          avg_compliance_rate: 92.1
        },
        {
          sop_number: '1025',
          title: 'Hurricane Season Protocol',
          category_name: 'Safety & OSHA Compliance',
          total_assignments: 12,
          completed_assignments: 10,
          overdue_assignments: 1,
          completion_rate: 83.3,
          avg_compliance_rate: 95.8
        }
      ];

      const mockEmployeeStatus: EmployeeTrainingStatus[] = [
        {
          employee_id: 1,
          employee_name: 'John Smith',
          position: 'Field Supervisor',
          required_sop_trainings: 25,
          completed_trainings: 22,
          overdue_trainings: 2,
          training_completion_rate: 88.0
        },
        {
          employee_id: 2,
          employee_name: 'Maria Garcia',
          position: 'Safety Coordinator',
          required_sop_trainings: 35,
          completed_trainings: 33,
          overdue_trainings: 1,
          training_completion_rate: 94.3
        }
      ];

      const mockProjectCompliance: ProjectCompliance[] = [
        {
          project_id: 1,
          job_number: 'FFR-2024-001',
          job_name: 'Residential Re-Roof - 123 Main St',
          job_status: 'In Progress',
          total_sop_assignments: 15,
          completed_sops: 12,
          overdue_sops: 1,
          sop_compliance_rate: 80.0,
          avg_compliance_score: 87.5
        },
        {
          project_id: 2,
          job_number: 'FFR-2024-002',
          job_name: 'Commercial TPO Roof - Office Building',
          job_status: 'In Progress',
          total_sop_assignments: 22,
          completed_sops: 20,
          overdue_sops: 0,
          sop_compliance_rate: 90.9,
          avg_compliance_score: 93.2
        }
      ];

      setMetrics(mockMetrics);
      setEmployeeStatus(mockEmployeeStatus);
      setProjectCompliance(mockProjectCompliance);
      setLoading(false);
    };

    loadMockData();
  }, []);

  const overallStats = {
    totalSOPs: 127,
    activeSOPs: 115,
    complianceRate: 87.3,
    overdueAssignments: 23,
    employeesNeedingTraining: 8,
    criticalSOPs: 15
  };

  if (loading) {
    return <Dashboard>Loading SOP Dashboard...</Dashboard>;
  }

  return (
    <Dashboard>
      {/* <FFRUnifiedBranding /> - Component usage needs review */}
      <DashboardHeader>
        <Title>
          <BarChart3 size={32} />
          SOP Compliance Dashboard
        </Title>
        <Subtitle>
          Real-time monitoring of Standard Operating Procedures compliance and performance
        </Subtitle>
      </DashboardHeader>

      {/* Hurricane Season Alert */}
      <AlertCard
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Cloud size={24} color="#F59E0B" />
        <div>
          <strong>Hurricane Season Active:</strong> All hurricane-related SOPs are now in effect.
          Ensure compliance with weather monitoring and emergency response procedures.
        </div>
      </AlertCard>

      <MetricsGrid>
        <MetricCard
          variant="info"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MetricHeader>
            <MetricIcon variant="info">
              <FileText size={24} />
            </MetricIcon>
          </MetricHeader>
          <MetricValue>{overallStats.activeSOPs}</MetricValue>
          <MetricLabel>Active SOPs</MetricLabel>
          <MetricTrend positive>
            <TrendingUp size={14} />
            {overallStats.totalSOPs} total procedures
          </MetricTrend>
        </MetricCard>

        <MetricCard
          variant="success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MetricHeader>
            <MetricIcon variant="success">
              <CheckCircle size={24} />
            </MetricIcon>
          </MetricHeader>
          <MetricValue>{overallStats.complianceRate}%</MetricValue>
          <MetricLabel>Overall Compliance Rate</MetricLabel>
          <MetricTrend positive>
            <TrendingUp size={14} />
            +2.3% from last month
          </MetricTrend>
        </MetricCard>

        <MetricCard
          variant="danger"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MetricHeader>
            <MetricIcon variant="danger">
              <AlertTriangle size={24} />
            </MetricIcon>
          </MetricHeader>
          <MetricValue>{overallStats.overdueAssignments}</MetricValue>
          <MetricLabel>Overdue Assignments</MetricLabel>
          <MetricTrend>
            <TrendingDown size={14} />
            -5 from last week
          </MetricTrend>
        </MetricCard>

        <MetricCard
          variant="warning"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MetricHeader>
            <MetricIcon variant="warning">
              <Users size={24} />
            </MetricIcon>
          </MetricHeader>
          <MetricValue>{overallStats.employeesNeedingTraining}</MetricValue>
          <MetricLabel>Employees Needing Training</MetricLabel>
          <MetricTrend>
            <Clock size={14} />
            3 critical trainings pending
          </MetricTrend>
        </MetricCard>

        <MetricCard
          variant="danger"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <MetricHeader>
            <MetricIcon variant="danger">
              <Shield size={24} />
            </MetricIcon>
          </MetricHeader>
          <MetricValue>{overallStats.criticalSOPs}</MetricValue>
          <MetricLabel>Critical SOPs</MetricLabel>
          <MetricTrend positive>
            <CheckCircle size={14} />
            95% compliance rate
          </MetricTrend>
        </MetricCard>

        <MetricCard
          variant="info"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <MetricHeader>
            <MetricIcon variant="info">
              <MapPin size={24} />
            </MetricIcon>
          </MetricHeader>
          <MetricValue>42</MetricValue>
          <MetricLabel>Florida-Specific SOPs</MetricLabel>
          <MetricTrend positive>
            <Shield size={14} />
            HVHZ compliant
          </MetricTrend>
        </MetricCard>
      </MetricsGrid>

      <ChartsGrid>
        <ChartCard>
          <ChartTitle>
            <Activity size={20} />
            SOP Compliance Trends
          </ChartTitle>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
            Chart showing compliance trends over time would be rendered here
          </div>
        </ChartCard>

        <ChartCard>
          <ChartTitle>
            <PieChart size={20} />
            SOP Categories Distribution
          </ChartTitle>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
            Pie chart showing SOP distribution by category would be rendered here
          </div>
        </ChartCard>
      </ChartsGrid>

      <TablesGrid>
        <TableCard>
          <TableHeader>
            <TableTitle>
              <Users size={20} />
              Employee Training Status
            </TableTitle>
          </TableHeader>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader2>Employee</TableHeader2>
                <TableHeader2>Position</TableHeader2>
                <TableHeader2>Required Trainings</TableHeader2>
                <TableHeader2>Completed</TableHeader2>
                <TableHeader2>Overdue</TableHeader2>
                <TableHeader2>Completion Rate</TableHeader2>
                <TableHeader2>Status</TableHeader2>
              </TableRow>
            </TableHead>
            <tbody>
              {employeeStatus.map((employee) => (
                <TableRow key={employee.employee_id}>
                  <TableCell>
                    <strong>{employee.employee_name}</strong>
                  </TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.required_sop_trainings}</TableCell>
                  <TableCell>{employee.completed_trainings}</TableCell>
                  <TableCell>{employee.overdue_trainings}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ProgressBar
                        percentage={employee.training_completion_rate}
                        variant={employee.training_completion_rate >= 90 ? 'success' :
                               employee.training_completion_rate >= 75 ? 'warning' : 'danger'}
                      />
                      <span style={{ fontSize: '0.75rem', minWidth: '40px' }}>
                        {employee.training_completion_rate.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={employee.overdue_trainings > 0 ? 'overdue' : 'compliant'}>
                      {employee.overdue_trainings > 0 ? 'Overdue' : 'Compliant'}
                    </StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableCard>

        <TableCard>
          <TableHeader>
            <TableTitle>
              <FileText size={20} />
              Project SOP Compliance
            </TableTitle>
          </TableHeader>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader2>Project</TableHeader2>
                <TableHeader2>Status</TableHeader2>
                <TableHeader2>Total SOPs</TableHeader2>
                <TableHeader2>Completed</TableHeader2>
                <TableHeader2>Overdue</TableHeader2>
                <TableHeader2>Compliance Rate</TableHeader2>
                <TableHeader2>Quality Score</TableHeader2>
              </TableRow>
            </TableHead>
            <tbody>
              {projectCompliance.map((project) => (
                <TableRow key={project.project_id}>
                  <TableCell>
                    <div>
                      <strong>{project.job_number}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                        {project.job_name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={project.job_status}>
                      {project.job_status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{project.total_sop_assignments}</TableCell>
                  <TableCell>{project.completed_sops}</TableCell>
                  <TableCell>{project.overdue_sops}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ProgressBar
                        percentage={project.sop_compliance_rate}
                        variant={project.sop_compliance_rate >= 90 ? 'success' :
                               project.sop_compliance_rate >= 75 ? 'warning' : 'danger'}
                      />
                      <span style={{ fontSize: '0.75rem', minWidth: '40px' }}>
                        {project.sop_compliance_rate.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <strong>{project.avg_compliance_score?.toFixed(1) || 'N/A'}</strong>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableCard>
      </TablesGrid>
    </Dashboard>
  );
};

export default SOPDashboard;