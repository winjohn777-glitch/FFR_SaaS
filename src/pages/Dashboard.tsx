import React, { useMemo } from 'react';
import styled from 'styled-components';
import {
  DollarSign,
  HardHat,
  TrendingUp,
  Users,
  Calendar,
  AlertTriangle,
  Package,
  Clock,
  Shield,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import UnifiedDataDemo from '../components/DataFlow/UnifiedDataDemo';
import { useData } from '../contexts/DataContext';
import { useDashboardMetrics, useRevenueTrends, useJobTypeDistribution } from '../services/metricsService';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}dd;
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text.secondary};
    cursor: not-allowed;
  }

  svg {
    animation: ${({ disabled }) => disabled ? 'spin 1s linear infinite' : 'none'};
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.accent}20;
  border: 1px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.accent};
  text-align: center;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const MetricCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const MetricHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const MetricTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MetricIcon = styled.div<{ color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ color, theme }) => color || theme.colors.primary}20;
  color: ${({ color, theme }) => color || theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const MetricChange = styled.div<{ positive: boolean }>`
  font-size: 0.875rem;
  color: ${({ positive, theme }) => positive ? theme.colors.secondary : theme.colors.accent};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ChartTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const RecentJobsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const JobCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const JobItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const JobInfo = styled.div`
  flex: 1;
`;

const JobTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const JobDetails = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
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
      default:
        return `
          background-color: ${theme.colors.accent}20;
          color: ${theme.colors.accent};
        `;
    }
  }}
`;

const Dashboard: React.FC = () => {
  // Get data from unified DataContext (keep for backward compatibility)
  const { customers, leads, opportunities, jobs, invoices, journalEntries, accounts, transactions, inventoryItems } = useData();

  // Use new dynamic metrics
  const { metrics, loading: metricsLoading, error: metricsError, refresh } = useDashboardMetrics();
  const { trends: revenueData, loading: trendsLoading } = useRevenueTrends(6);
  const { distribution: jobTypeData, loading: jobTypesLoading } = useJobTypeDistribution();

  // Fallback to computed data from context if metrics service fails
  const fallbackRevenueData = useMemo(() => {
    const monthlyData: { [key: string]: { revenue: number; jobs: number } } = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Initialize with zeros
    months.forEach(month => {
      monthlyData[month] = { revenue: 0, jobs: 0 };
    });

    // Aggregate invoice data by month
    invoices.forEach(invoice => {
      const month = new Date(invoice.issueDate).getMonth();
      const monthName = months[month];
      monthlyData[monthName].revenue += invoice.amount;
      monthlyData[monthName].jobs += 1;
    });

    return months.map(month => ({
      month,
      revenue: monthlyData[month].revenue,
      jobs: monthlyData[month].jobs
    })).filter(data => data.revenue > 0 || data.jobs > 0).slice(0, 6);
  }, [invoices]);

  const fallbackJobTypeData = useMemo(() => {
    const typeCounts: { [key: string]: number } = {};
    const totalJobs = jobs.length || 1;

    jobs.forEach(job => {
      const type = job.type || 'Other';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    const colors = ['#1e40af', '#059669', '#dc2626', '#8b4513', '#7c3aed', '#db2777'];
    return Object.entries(typeCounts).map(([name, count], index) => ({
      name,
      value: Math.round((count / totalJobs) * 100),
      color: colors[index % colors.length],
      count
    }));
  }, [jobs]);

  const fallbackRecentJobs = useMemo(() => {
    return jobs.slice(0, 5).map(job => ({
      id: job.id,
      title: job.name,
      customer: job.customer || 'Unknown Customer',
      value: `$${job.estimatedValue?.toLocaleString() || '0'}`,
      status: job.status || 'pending',
      progress: job.progress || 50
    }));
  }, [jobs]);

  // Use dynamic data if available, otherwise fallback
  const finalRevenueData = (revenueData && revenueData.length > 0) ? revenueData : fallbackRevenueData;
  const finalJobTypeData = (jobTypeData && jobTypeData.length > 0) ? jobTypeData : fallbackJobTypeData;
  const recentJobs = metrics?.recentActivity || fallbackRecentJobs;
  const upcomingInspections = metrics?.upcomingInspections || [
    { date: 'Today 2:00 PM', address: '789 Beach Rd', type: 'Final Inspection' },
    { date: 'Tomorrow 10:00 AM', address: '321 Pine St', type: 'Progress Check' },
    { date: 'Thu 3:00 PM', address: '654 Oak Ave', type: 'Initial Assessment' }
  ];

  if (metricsError && !metrics) {
    return (
      <DashboardContainer>
        <ErrorState>
          <AlertTriangle size={48} />
          <h2>Failed to Load Dashboard</h2>
          <p>{metricsError}</p>
          <RefreshButton onClick={refresh}>
            <RefreshCw size={16} />
            Retry
          </RefreshButton>
        </ErrorState>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <h1>Dashboard</h1>
        <RefreshButton onClick={refresh} disabled={metricsLoading}>
          <RefreshCw size={16} />
          {metricsLoading ? 'Updating...' : 'Refresh'}
        </RefreshButton>
      </DashboardHeader>

      {metricsLoading && !metrics ? (
        <LoadingState>Loading dashboard metrics...</LoadingState>
      ) : (
        <>
          <MetricsGrid className="metric-cards">
            <MetricCard className="metric-card">
              <MetricHeader>
                <MetricTitle>Monthly Revenue</MetricTitle>
                <MetricIcon color="#059669">
                  <DollarSign size={20} />
                </MetricIcon>
              </MetricHeader>
              <MetricValue>{metrics?.monthlyRevenue.formattedValue || '$0'}</MetricValue>
              <MetricChange positive={metrics?.monthlyRevenue.positive ?? true}>
                <TrendingUp size={16} />
                {metrics?.monthlyRevenue.trend || 'No data available'}
              </MetricChange>
            </MetricCard>

            <MetricCard className="metric-card">
              <MetricHeader>
                <MetricTitle>Active Jobs</MetricTitle>
                <MetricIcon color="#1e40af">
                  <HardHat size={20} />
                </MetricIcon>
              </MetricHeader>
              <MetricValue>{metrics?.activeJobs.formattedValue || '0'}</MetricValue>
              <MetricChange positive={metrics?.activeJobs.positive ?? true}>
                <TrendingUp size={16} />
                {metrics?.activeJobs.trend || 'No new jobs this week'}
              </MetricChange>
            </MetricCard>

            <MetricCard className="metric-card">
              <MetricHeader>
                <MetricTitle>Outstanding Invoices</MetricTitle>
                <MetricIcon color="#dc2626">
                  <AlertTriangle size={20} />
                </MetricIcon>
              </MetricHeader>
              <MetricValue>{metrics?.outstandingInvoices.formattedValue || '$0'}</MetricValue>
              <MetricChange positive={metrics?.outstandingInvoices.positive ?? false}>
                <Clock size={16} />
                {metrics?.outstandingInvoices.trend || 'No overdue invoices'}
              </MetricChange>
            </MetricCard>

            <MetricCard className="metric-card">
              <MetricHeader>
                <MetricTitle>Material Inventory</MetricTitle>
                <MetricIcon color="#8b4513">
                  <Package size={20} />
                </MetricIcon>
              </MetricHeader>
              <MetricValue>{metrics?.materialInventory.formattedValue || '$0'}</MetricValue>
              <MetricChange positive={metrics?.materialInventory.positive ?? true}>
                <Package size={16} />
                {metrics?.materialInventory.trend || 'No inventory data'}
              </MetricChange>
            </MetricCard>

            <MetricCard className="metric-card">
              <MetricHeader>
                <MetricTitle>SOP Compliance</MetricTitle>
                <MetricIcon color="#7c3aed">
                  <Shield size={20} />
                </MetricIcon>
              </MetricHeader>
              <MetricValue>{metrics?.sopCompliance.formattedValue || '0%'}</MetricValue>
              <MetricChange positive={metrics?.sopCompliance.positive ?? true}>
                <CheckCircle size={16} />
                {metrics?.sopCompliance.trend || 'No SOP data available'}
              </MetricChange>
            </MetricCard>

            <MetricCard className="metric-card">
              <MetricHeader>
                <MetricTitle>Team Training</MetricTitle>
                <MetricIcon color="#f59e0b">
                  <Users size={20} />
                </MetricIcon>
              </MetricHeader>
              <MetricValue>{metrics?.teamTraining.formattedValue || '0%'}</MetricValue>
              <MetricChange positive={metrics?.teamTraining.positive ?? true}>
                <AlertTriangle size={16} />
                {metrics?.teamTraining.trend || 'No training data available'}
              </MetricChange>
            </MetricCard>
          </MetricsGrid>
        </>
      )}

      <ChartsGrid>
        <ChartCard className="chart-container">
          <ChartTitle>Revenue & Job Trends</ChartTitle>
          {trendsLoading ? (
            <LoadingState>Loading revenue trends...</LoadingState>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={finalRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1e40af"
                  fill="#1e40af"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard className="chart-container">
          <ChartTitle>Job Types Distribution</ChartTitle>
          {jobTypesLoading ? (
            <LoadingState>Loading job types...</LoadingState>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={finalJobTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {finalJobTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </ChartsGrid>

      <RecentJobsGrid>
        <JobCard>
          <h2>Recent Activity</h2>
          {recentJobs.map((job) => (
            <JobItem key={job.id}>
              <JobInfo>
                <JobTitle>{job.title}</JobTitle>
                <JobDetails>
                  {job.customer} • {job.value}
                </JobDetails>
              </JobInfo>
              <JobStatus status={job.status}>{job.status}</JobStatus>
            </JobItem>
          ))}
        </JobCard>

        <JobCard>
          <ChartTitle>Upcoming Inspections</ChartTitle>
          {upcomingInspections.map((inspection, index) => (
            <JobItem key={index}>
              <JobInfo>
                <JobTitle>{inspection.type}</JobTitle>
                <JobDetails>
                  {inspection.address}<br />
                  {inspection.date}
                </JobDetails>
              </JobInfo>
              <MetricIcon color="#059669">
                <Calendar size={16} />
              </MetricIcon>
            </JobItem>
          ))}
        </JobCard>
      </RecentJobsGrid>

      <UnifiedDataDemo />
    </DashboardContainer>
  );
};

export default Dashboard;