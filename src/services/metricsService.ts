import { useState, useEffect } from 'react';

export interface MetricData {
  value: number;
  change: number;
  positive: boolean;
  formattedValue: string;
  trend: string;
}

export interface DashboardMetrics {
  monthlyRevenue: MetricData;
  activeJobs: MetricData;
  outstandingInvoices: MetricData;
  materialInventory: MetricData;
  sopCompliance: MetricData;
  teamTraining: MetricData;
  recentActivity: RecentActivity[];
  upcomingInspections: UpcomingInspection[];
  lastUpdated: string;
}

export interface RecentActivity {
  id: string;
  title: string;
  customer: string;
  value: string;
  status: string;
  progress: number;
}

export interface UpcomingInspection {
  date: string;
  address: string;
  type: string;
  jobName?: string;
}

export interface RevenueTrend {
  month: string;
  revenue: number;
  jobs: number;
  [key: string]: any;
}

export interface JobTypeDistribution {
  name: string;
  value: number;
  color: string;
  count: number;
  [key: string]: any;
}

class MetricsService {
  private baseUrl: string;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';
  }

  private async fetchWithCache<T>(endpoint: string): Promise<T> {
    const cached = this.cache.get(endpoint);
    const now = Date.now();

    if (cached && now - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.cache.set(endpoint, { data, timestamp: now });
      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);

      // Return cached data if available, even if expired
      if (cached) {
        console.warn(`Using expired cache for ${endpoint}`);
        return cached.data;
      }

      // Return fallback data
      return this.getFallbackData(endpoint);
    }
  }

  private getFallbackData(endpoint: string): any {
    switch (endpoint) {
      case '/metrics':
        return {
          monthlyRevenue: {
            value: 108250,
            change: 12.5,
            positive: true,
            formattedValue: '$108,250',
            trend: '+12.5% from last month'
          },
          activeJobs: {
            value: 12,
            change: 3,
            positive: true,
            formattedValue: '12',
            trend: '+3 new this week'
          },
          outstandingInvoices: {
            value: 24750,
            change: 5,
            positive: false,
            formattedValue: '$24,750',
            trend: '5 invoices overdue'
          },
          materialInventory: {
            value: 18200,
            change: 0,
            positive: true,
            formattedValue: '$18,200',
            trend: 'Well stocked'
          },
          sopCompliance: {
            value: 87.3,
            change: 23,
            positive: true,
            formattedValue: '87.3%',
            trend: '23 procedures completed'
          },
          teamTraining: {
            value: 94.2,
            change: 3,
            positive: false,
            formattedValue: '94.2%',
            trend: '3 trainings overdue'
          },
          recentActivity: [
            { id: '1', title: 'New Roof Installation', customer: 'Smith Family', value: '$8,500', status: 'active', progress: 65 },
            { id: '2', title: 'Tile Repair', customer: 'Johnson Home', value: '$2,300', status: 'completed', progress: 100 },
            { id: '3', title: 'Gutter Replacement', customer: 'Davis Property', value: '$1,800', status: 'pending', progress: 0 }
          ],
          upcomingInspections: [
            { date: 'Today 2:00 PM', address: '789 Beach Rd', type: 'Final Inspection' },
            { date: 'Tomorrow 10:00 AM', address: '321 Pine St', type: 'Progress Check' },
            { date: 'Thu 3:00 PM', address: '654 Oak Ave', type: 'Initial Assessment' }
          ],
          lastUpdated: new Date().toISOString()
        };

      case '/metrics/revenue-trends':
        return [
          { month: 'Jul', revenue: 85000, jobs: 15 },
          { month: 'Aug', revenue: 92000, jobs: 18 },
          { month: 'Sep', revenue: 78000, jobs: 14 },
          { month: 'Oct', revenue: 96000, jobs: 19 },
          { month: 'Nov', revenue: 108000, jobs: 22 },
          { month: 'Dec', revenue: 108250, jobs: 21 }
        ];

      case '/metrics/job-types':
        return [
          { name: 'New Installation', value: 45, color: '#1e40af', count: 9 },
          { name: 'Repair', value: 30, color: '#059669', count: 6 },
          { name: 'Maintenance', value: 15, color: '#dc2626', count: 3 },
          { name: 'Inspection', value: 10, color: '#8b4513', count: 2 }
        ];

      default:
        return null;
    }
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    return this.fetchWithCache<DashboardMetrics>('/metrics');
  }

  async getRevenueTrends(months = 6): Promise<RevenueTrend[]> {
    return this.fetchWithCache<RevenueTrend[]>(`/metrics/revenue-trends?months=${months}`);
  }

  async getJobTypeDistribution(): Promise<JobTypeDistribution[]> {
    return this.fetchWithCache<JobTypeDistribution[]>('/metrics/job-types');
  }

  // Clear cache manually if needed
  clearCache(): void {
    this.cache.clear();
  }

  // Update cache timeout
  setCacheTimeout(timeout: number): void {
    this.cacheTimeout = timeout;
  }
}

// Create a singleton instance
export const metricsService = new MetricsService();

// Custom hook for dashboard metrics
export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadMetrics = async () => {
      try {
        setLoading(true);
        const data = await metricsService.getDashboardMetrics();
        if (mounted) {
          setMetrics(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load metrics');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadMetrics();

    // Auto-refresh every 5 minutes
    const interval = setInterval(loadMetrics, 5 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const refresh = () => {
    metricsService.clearCache();
    setLoading(true);
    setError(null);
    metricsService.getDashboardMetrics()
      .then(data => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to refresh metrics');
        setLoading(false);
      });
  };

  return { metrics, loading, error, refresh };
}

// Custom hook for revenue trends
export function useRevenueTrends(months = 6) {
  const [trends, setTrends] = useState<RevenueTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    metricsService.getRevenueTrends(months).then(data => {
      if (mounted) {
        setTrends(Array.isArray(data) ? data : []);
        setLoading(false);
      }
    }).catch(error => {
      console.error('Error loading revenue trends:', error);
      if (mounted) {
        setTrends([]);
        setLoading(false);
      }
    });

    return () => { mounted = false; };
  }, [months]);

  return { trends, loading };
}

// Custom hook for job type distribution
export function useJobTypeDistribution() {
  const [distribution, setDistribution] = useState<JobTypeDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    metricsService.getJobTypeDistribution().then(data => {
      if (mounted) {
        setDistribution(Array.isArray(data) ? data : []);
        setLoading(false);
      }
    }).catch(error => {
      console.error('Error loading job type distribution:', error);
      if (mounted) {
        setDistribution([]);
        setLoading(false);
      }
    });

    return () => { mounted = false; };
  }, []);

  return { distribution, loading };
}

export default metricsService;