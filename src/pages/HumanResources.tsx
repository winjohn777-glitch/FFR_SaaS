import React, { useState, useMemo } from 'react';
import { formatCurrency } from '../utils/currencyFormatter';
import styled from 'styled-components';
import { useData, type Employee, type Certification } from '../contexts/DataContext';
import {
  UserCheck,
  Users,
  Clock,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Award,
  FileText,
  Phone,
  Mail,
  MapPin,
  Shield,
  HardHat,
  Eye,
  Edit,
  Plus,
  Download,
  TrendingUp,
  BarChart3,
  Activity,
  RefreshCw,
  Settings,
  DollarSign,
  Briefcase,
  BookOpen,
  Star,
  X
} from 'lucide-react';

// Styled Components
const HRContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PageSubtitle = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ComplianceAlert = styled.div<{ type: 'warning' | 'error' | 'success' }>`
  background-color: ${({ type, theme }) => {
    switch (type) {
      case 'warning': return `${theme.colors.roofing.tile}20`;
      case 'error': return `${theme.colors.accent}20`;
      case 'success': return `${theme.colors.secondary}20`;
      default: return `${theme.colors.primary}20`;
    }
  }};
  border: 1px solid ${({ type, theme }) => {
    switch (type) {
      case 'warning': return theme.colors.roofing.tile;
      case 'error': return theme.colors.accent;
      case 'success': return theme.colors.secondary;
      default: return theme.colors.primary;
    }
  }};
  color: ${({ type, theme }) => {
    switch (type) {
      case 'warning': return theme.colors.roofing.tile;
      case 'error': return theme.colors.accent;
      case 'success': return theme.colors.secondary;
      default: return theme.colors.primary;
    }
  }};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
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
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ color, theme }) => color || theme.colors.primary}20;
  color: ${({ color, theme }) => color || theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatChange = styled.div<{ positive?: boolean }>`
  font-size: 0.875rem;
  color: ${({ positive, theme }) => 
    positive === undefined 
      ? theme.colors.text.secondary 
      : positive 
        ? theme.colors.secondary 
        : theme.colors.accent
  };
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TabsContainer = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TabsList = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.spacing.sm};

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.border};
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 2px;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: none;
  background: none;
  border-bottom: 3px solid ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.text.secondary};
  font-weight: ${({ active }) => active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const ControlsSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md} 3rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.light};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FilterContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const FilterSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const QuickActionsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}dd;
    transform: translateY(-1px);
  }

  &.secondary {
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text.primary};
    border: 1px solid ${({ theme }) => theme.colors.border};

    &:hover {
      background-color: ${({ theme }) => theme.colors.border};
    }
  }

  &.warning {
    background-color: ${({ theme }) => theme.colors.accent};

    &:hover {
      background-color: ${({ theme }) => theme.colors.accent}dd;
    }
  }
`;

const EmployeesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const EmployeeCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const EmployeeHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: white;
  position: relative;
`;

const EmployeeName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const EmployeeRole = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const EmployeeMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: 0.75rem;
  opacity: 0.8;
`;

const EmployeeContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ComplianceSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ComplianceTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CertificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CertificationItem = styled.div<{ status: 'valid' | 'expiring' | 'expired' }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ status, theme }) => {
    switch (status) {
      case 'valid': return `${theme.colors.secondary}10`;
      case 'expiring': return `${theme.colors.roofing.tile}10`;
      case 'expired': return `${theme.colors.accent}10`;
      default: return theme.colors.background;
    }
  }};
  border: 1px solid ${({ status, theme }) => {
    switch (status) {
      case 'valid': return `${theme.colors.secondary}30`;
      case 'expiring': return `${theme.colors.roofing.tile}30`;
      case 'expired': return `${theme.colors.accent}30`;
      default: return theme.colors.border;
    }
  }};
`;

const CertificationInfo = styled.div`
  flex: 1;
`;

const CertificationName = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CertificationDate = styled.div`
  font-size: 0.7rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StatusBadge = styled.span<{ status: 'valid' | 'expiring' | 'expired' }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${({ status, theme }) => {
    switch (status) {
      case 'valid':
        return `
          background-color: ${theme.colors.secondary};
          color: white;
        `;
      case 'expiring':
        return `
          background-color: ${theme.colors.roofing.tile};
          color: white;
        `;
      case 'expired':
        return `
          background-color: ${theme.colors.accent};
          color: white;
        `;
      default:
        return `
          background-color: ${theme.colors.text.light};
          color: white;
        `;
    }
  }}
`;

const EmployeeFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OverallCompliance = styled.div<{ compliant: boolean }>`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ compliant, theme }) => compliant ? theme.colors.secondary : theme.colors.accent};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const EmployeeActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionIcon = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

// Note: Employee and Certification types are imported from DataContext
// Employee data is now managed centrally through DataContext

// Mock Data (keeping temporarily for fallback)
const fallbackEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'Miguel',
    lastName: 'Rodriguez',
    role: 'Lead Roofer',
    department: 'Operations',
    email: 'miguel.rodriguez@floridafirstroofing.com',
    phone: '321-555-0101',
    address: '123 Orange Ave, Melbourne, FL 32901',
    hireDate: '2023-01-15',
    employeeId: 'FFR001',
    status: 'active',
    payRate: 28.50,
    timeTracking: {
      hoursThisWeek: 42,
      overtime: 2
    },
    certifications: [
      {
        name: 'OSHA 1926 Fall Protection',
        type: 'OSHA',
        issueDate: '2023-12-01',
        expirationDate: '2024-12-01',
        status: 'valid',
        certificateNumber: 'OSHA-FP-2023-001'
      },
      {
        name: 'FL Roofing License',
        type: 'State License',
        issueDate: '2023-06-15',
        expirationDate: '2025-06-15',
        status: 'valid',
        certificateNumber: 'FL-ROOF-2023-001'
      },
      {
        name: 'PPE Safety Training',
        type: 'Safety Training',
        issueDate: '2024-01-15',
        expirationDate: '2024-07-15',
        status: 'expiring',
        certificateNumber: 'PPE-2024-001'
      }
    ]
  },
  {
    id: '2',
    firstName: 'James',
    lastName: 'Thompson',
    role: 'Safety Coordinator',
    department: 'Safety',
    email: 'james.thompson@floridafirstroofing.com',
    phone: '321-555-0102',
    address: '456 Pine St, Cocoa, FL 32926',
    hireDate: '2022-08-20',
    employeeId: 'FFR002',
    status: 'active',
    payRate: 32.00,
    timeTracking: {
      hoursThisWeek: 40,
      overtime: 0
    },
    certifications: [
      {
        name: 'OSHA 1926 Competent Person',
        type: 'OSHA',
        issueDate: '2023-03-10',
        expirationDate: '2025-03-10',
        status: 'valid',
        certificateNumber: 'OSHA-CP-2023-002'
      },
      {
        name: 'First Aid/CPR',
        type: 'Safety Training',
        issueDate: '2023-11-01',
        expirationDate: '2024-11-01',
        status: 'valid',
        certificateNumber: 'FA-CPR-2023-002'
      },
      {
        name: 'Ladder Safety Instructor',
        type: 'Technical',
        issueDate: '2022-10-15',
        expirationDate: '2024-04-15',
        status: 'expired',
        certificateNumber: 'LSI-2022-002'
      }
    ]
  },
  {
    id: '3',
    firstName: 'Sarah',
    lastName: 'Martinez',
    role: 'Administrative Assistant',
    department: 'Administration',
    email: 'sarah.martinez@floridafirstroofing.com',
    phone: '321-555-0103',
    address: '789 Oak Blvd, Palm Bay, FL 32905',
    hireDate: '2023-05-10',
    employeeId: 'FFR003',
    status: 'active',
    payRate: 18.00,
    timeTracking: {
      hoursThisWeek: 40,
      overtime: 0
    },
    certifications: [
      {
        name: 'Office Safety Training',
        type: 'Safety Training',
        issueDate: '2023-05-15',
        expirationDate: '2024-05-15',
        status: 'valid',
        certificateNumber: 'OST-2023-003'
      }
    ]
  },
  {
    id: '4',
    firstName: 'Carlos',
    lastName: 'Hernandez',
    role: 'Roofing Specialist',
    department: 'Operations',
    email: 'carlos.hernandez@floridafirstroofing.com',
    phone: '321-555-0104',
    address: '321 Maple Dr, Titusville, FL 32780',
    hireDate: '2023-09-01',
    employeeId: 'FFR004',
    status: 'active',
    payRate: 24.00,
    timeTracking: {
      hoursThisWeek: 38,
      overtime: 0
    },
    certifications: [
      {
        name: 'OSHA 1926 Fall Protection',
        type: 'OSHA',
        issueDate: '2023-09-15',
        expirationDate: '2024-09-15',
        status: 'valid',
        certificateNumber: 'OSHA-FP-2023-004'
      },
      {
        name: 'Metal Roofing Certification',
        type: 'Technical',
        issueDate: '2023-10-01',
        expirationDate: '2025-10-01',
        status: 'valid',
        certificateNumber: 'MRC-2023-004'
      }
    ]
  },
  {
    id: '5',
    firstName: 'David',
    lastName: 'Wilson',
    role: 'Apprentice Roofer',
    department: 'Operations',
    email: 'david.wilson@floridafirstroofing.com',
    phone: '321-555-0105',
    address: '654 Beach Ave, Cape Canaveral, FL 32920',
    hireDate: '2024-01-08',
    employeeId: 'FFR005',
    status: 'active',
    payRate: 16.50,
    timeTracking: {
      hoursThisWeek: 40,
      overtime: 0
    },
    certifications: [
      {
        name: 'Basic Safety Orientation',
        type: 'Safety Training',
        issueDate: '2024-01-08',
        expirationDate: '2024-07-08',
        status: 'expiring',
        certificateNumber: 'BSO-2024-005'
      },
      {
        name: 'Tool Safety Training',
        type: 'Safety Training',
        issueDate: '2024-01-15',
        expirationDate: '2024-01-15',
        status: 'expired',
        certificateNumber: 'TST-2024-005'
      }
    ]
  }
];

const HumanResources: React.FC = () => {
  // Get employees from DataContext
  const { employees: contextEmployees } = useData();

  // Use employees from DataContext, fallback to fallbackEmployees if needed
  const employees = contextEmployees.length > 0 ? contextEmployees : fallbackEmployees;

  const [activeTab, setActiveTab] = useState<'employees' | 'compliance' | 'payroll' | 'reports'>('employees');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [complianceFilter, setComplianceFilter] = useState('all');
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);

  // Event handlers
  const handleAddEmployee = () => {
    setShowAddEmployeeModal(true);
    console.log('Opening Add Employee modal...');
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowEmployeeDetails(true);
    console.log('Viewing employee:', employee.firstName, employee.lastName);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    console.log('Editing employee:', employee.firstName, employee.lastName);
    alert(`Editing ${employee.firstName} ${employee.lastName} - Feature coming soon!`);
  };

  const handleEmployeeTraining = (employee: Employee) => {
    console.log('Opening training records for:', employee.firstName, employee.lastName);
    alert(`Training records for ${employee.firstName} ${employee.lastName} - Redirecting to Training module...`);
  };

  const handleTimeTracking = (employee: Employee) => {
    console.log('Opening time tracking for:', employee.firstName, employee.lastName);
    alert(`Time tracking for ${employee.firstName} ${employee.lastName} - Feature coming soon!`);
  };

  const handleExportReport = (reportType: string) => {
    console.log('Exporting report:', reportType);
    alert(`Exporting ${reportType} report - Feature coming soon!`);
  };

  const handleProcessPayroll = () => {
    console.log('Processing payroll...');
    alert('Processing payroll - This would integrate with payroll system');
  };

  const handleComplianceCheck = () => {
    console.log('Running compliance check...');
    alert('Running comprehensive OSHA compliance check - Feature coming soon!');
  };

  const handleGenerateReport = (reportName: string) => {
    console.log('Generating report:', reportName);
    alert(`Generating ${reportName} - Report functionality coming soon!`);
  };

  // Filter employees based on search and filters
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const matchesSearch = 
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
      const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
      
      const complianceStatus = employee.certifications.every(cert => cert.status === 'valid');
      const matchesCompliance = complianceFilter === 'all' || 
        (complianceFilter === 'compliant' && complianceStatus) ||
        (complianceFilter === 'non-compliant' && !complianceStatus);

      return matchesSearch && matchesDepartment && matchesStatus && matchesCompliance;
    });
  }, [searchTerm, departmentFilter, statusFilter, complianceFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalEmployees = employees.filter(e => e.status === 'active').length;
    const compliantEmployees = employees.filter(e => 
      e.status === 'active' && e.certifications.every(cert => cert.status === 'valid')
    ).length;
    const expiringCerts = employees.reduce((acc, emp) => 
      acc + emp.certifications.filter(cert => cert.status === 'expiring').length, 0
    );
    const expiredCerts = employees.reduce((acc, emp) => 
      acc + emp.certifications.filter(cert => cert.status === 'expired').length, 0
    );
    const totalPayroll = employees
      .filter(e => e.status === 'active')
      .reduce((acc, emp) => acc + (emp.payRate * emp.timeTracking.hoursThisWeek), 0);
    const overtimeHours = employees
      .filter(e => e.status === 'active')
      .reduce((acc, emp) => acc + emp.timeTracking.overtime, 0);

    return {
      totalEmployees,
      complianceRate: Math.round((compliantEmployees / totalEmployees) * 100),
      expiringCerts,
      expiredCerts,
      totalPayroll: Math.round(totalPayroll),
      overtimeHours
    };
  }, []);

  // Check for critical compliance issues
  const criticalIssues = useMemo(() => {
    const issues = [];
    if (stats.expiredCerts > 0) {
      issues.push(`${stats.expiredCerts} expired certification${stats.expiredCerts > 1 ? 's' : ''} require immediate attention`);
    }
    if (stats.expiringCerts > 0) {
      issues.push(`${stats.expiringCerts} certification${stats.expiringCerts > 1 ? 's' : ''} expiring soon`);
    }
    if (stats.complianceRate < 80) {
      issues.push(`Overall compliance rate (${stats.complianceRate}%) below minimum threshold`);
    }
    return issues;
  }, [stats]);

  const tabs = [
    { id: 'employees', label: 'Employee Directory', icon: Users },
    { id: 'compliance', label: 'OSHA Compliance', icon: Shield },
    { id: 'payroll', label: 'Payroll & Time', icon: DollarSign },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 }
  ];

  return (
    <HRContainer>
      <HeaderSection>
        <HeaderContent>
          <PageTitle>
            <UserCheck size={32} />
            Human Resources Management
          </PageTitle>
          <PageSubtitle>
            Manage workforce, ensure OSHA compliance, and maintain safety standards for Florida First Roofing
          </PageSubtitle>
        </HeaderContent>
      </HeaderSection>

      {/* Critical Compliance Alerts */}
      {criticalIssues.length > 0 && (
        <ComplianceAlert type={stats.expiredCerts > 0 ? 'error' : 'warning'}>
          <AlertTriangle size={20} />
          <div>
            <strong>Compliance Alert:</strong>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
              {criticalIssues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
          </div>
        </ComplianceAlert>
      )}

      {/* Statistics Overview */}
      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatTitle>Active Employees</StatTitle>
            <StatIcon color="#1e40af">
              <Users size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.totalEmployees}</StatValue>
          <StatChange>
            <Activity size={16} />
            Current workforce
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>OSHA Compliance</StatTitle>
            <StatIcon color={stats.complianceRate >= 80 ? "#059669" : "#dc2626"}>
              <Shield size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.complianceRate}%</StatValue>
          <StatChange positive={stats.complianceRate >= 80}>
            <TrendingUp size={16} />
            Safety compliance rate
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Certifications Alert</StatTitle>
            <StatIcon color="#cd853f">
              <AlertTriangle size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{stats.expiringCerts + stats.expiredCerts}</StatValue>
          <StatChange positive={false}>
            <RefreshCw size={16} />
            Require attention
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Weekly Payroll</StatTitle>
            <StatIcon color="#8b4513">
              <DollarSign size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{formatCurrency(stats.totalPayroll)}</StatValue>
          <StatChange>
            <Clock size={16} />
            {stats.overtimeHours}h overtime
          </StatChange>
        </StatCard>
      </StatsGrid>

      {/* Navigation Tabs */}
      <TabsContainer>
        <TabsList>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <Tab
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
              >
                <IconComponent size={18} />
                {tab.label}
              </Tab>
            );
          })}
        </TabsList>
      </TabsContainer>

      {/* Tab Content */}
      {activeTab === 'employees' && (
        <>
          {/* Search and Filter Controls */}
          <ControlsSection>
            <SearchContainer>
              <SearchIcon>
                <Search size={20} />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search employees by name, role, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchContainer>

            <FilterContainer>
              <FilterSelect
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="all">All Departments</option>
                <option value="Operations">Operations</option>
                <option value="Safety">Safety</option>
                <option value="Administration">Administration</option>
              </FilterSelect>

              <FilterSelect
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="terminated">Terminated</option>
              </FilterSelect>

              <FilterSelect
                value={complianceFilter}
                onChange={(e) => setComplianceFilter(e.target.value)}
              >
                <option value="all">All Compliance</option>
                <option value="compliant">Compliant</option>
                <option value="non-compliant">Non-Compliant</option>
              </FilterSelect>
            </FilterContainer>

            <QuickActionsContainer>
              <ActionButton onClick={handleAddEmployee}>
                <Plus size={16} />
                Add Employee
              </ActionButton>
              <ActionButton className="secondary" onClick={() => handleExportReport('Employee Directory')}>
                <Download size={16} />
                Export Report
              </ActionButton>
              <ActionButton className="warning" onClick={handleComplianceCheck}>
                <AlertTriangle size={16} />
                Compliance Check
              </ActionButton>
            </QuickActionsContainer>
          </ControlsSection>

          {/* Employees Grid */}
          <EmployeesGrid>
            {filteredEmployees.map((employee) => {
              const fullName = `${employee.firstName} ${employee.lastName}`;
              const validCerts = employee.certifications.filter(cert => cert.status === 'valid').length;
              const totalCerts = employee.certifications.length;
              const isCompliant = employee.certifications.every(cert => cert.status === 'valid');

              return (
                <EmployeeCard key={employee.id}>
                  <EmployeeHeader>
                    <EmployeeName>{fullName}</EmployeeName>
                    <EmployeeRole>{employee.role} • {employee.department}</EmployeeRole>
                    <EmployeeMeta>
                      <span>ID: {employee.employeeId}</span>
                      <span>•</span>
                      <span>Hired: {new Date(employee.hireDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>${employee.payRate}/hr</span>
                    </EmployeeMeta>
                  </EmployeeHeader>

                  <EmployeeContent>
                    <ContactInfo>
                      <ContactItem>
                        <Mail size={14} />
                        {employee.email}
                      </ContactItem>
                      <ContactItem>
                        <Phone size={14} />
                        {employee.phone}
                      </ContactItem>
                      <ContactItem>
                        <MapPin size={14} />
                        {employee.address}
                      </ContactItem>
                      <ContactItem>
                        <Clock size={14} />
                        {employee.timeTracking.hoursThisWeek}h this week
                        {employee.timeTracking.overtime > 0 && ` (${employee.timeTracking.overtime}h OT)`}
                      </ContactItem>
                    </ContactInfo>

                    <ComplianceSection>
                      <ComplianceTitle>
                        <HardHat size={16} />
                        OSHA Certifications ({validCerts}/{totalCerts})
                      </ComplianceTitle>
                      <CertificationsList>
                        {employee.certifications.map((cert, index) => (
                          <CertificationItem key={index} status={cert.status}>
                            <CertificationInfo>
                              <CertificationName>{cert.name}</CertificationName>
                              <CertificationDate>
                                Expires: {new Date(cert.expirationDate).toLocaleDateString()}
                              </CertificationDate>
                            </CertificationInfo>
                            <StatusBadge status={cert.status}>
                              {cert.status}
                            </StatusBadge>
                          </CertificationItem>
                        ))}
                      </CertificationsList>
                    </ComplianceSection>
                  </EmployeeContent>

                  <EmployeeFooter>
                    <OverallCompliance compliant={isCompliant}>
                      {isCompliant ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                      {isCompliant ? 'OSHA Compliant' : 'Compliance Issues'}
                    </OverallCompliance>
                    <EmployeeActions>
                      <ActionIcon title="View Details" onClick={() => handleViewEmployee(employee)}>
                        <Eye size={16} />
                      </ActionIcon>
                      <ActionIcon title="Edit Employee" onClick={() => handleEditEmployee(employee)}>
                        <Edit size={16} />
                      </ActionIcon>
                      <ActionIcon title="Training Records" onClick={() => handleEmployeeTraining(employee)}>
                        <BookOpen size={16} />
                      </ActionIcon>
                      <ActionIcon title="Time Tracking" onClick={() => handleTimeTracking(employee)}>
                        <Clock size={16} />
                      </ActionIcon>
                    </EmployeeActions>
                  </EmployeeFooter>
                </EmployeeCard>
              );
            })}
          </EmployeesGrid>

          {filteredEmployees.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem 2rem',
              color: '#64748b'
            }}>
              <Users size={48} style={{ marginBottom: '1rem' }} />
              <h3>No employees found</h3>
              <p>Try adjusting your search terms or filters to find relevant employees.</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'compliance' && (
        <>
          {/* OSHA Compliance Overview */}
          <StatsGrid>
            <StatCard>
              <StatHeader>
                <StatTitle>Overall Compliance</StatTitle>
                <StatIcon color={stats.complianceRate >= 80 ? "#059669" : "#dc2626"}>
                  <Shield size={20} />
                </StatIcon>
              </StatHeader>
              <StatValue>{stats.complianceRate}%</StatValue>
              <StatChange positive={stats.complianceRate >= 80}>
                <TrendingUp size={16} />
                {stats.complianceRate >= 80 ? 'Meeting standards' : 'Below threshold'}
              </StatChange>
            </StatCard>

            <StatCard>
              <StatHeader>
                <StatTitle>Expired Certifications</StatTitle>
                <StatIcon color="#dc2626">
                  <AlertTriangle size={20} />
                </StatIcon>
              </StatHeader>
              <StatValue>{stats.expiredCerts}</StatValue>
              <StatChange positive={false}>
                <RefreshCw size={16} />
                Immediate action required
              </StatChange>
            </StatCard>

            <StatCard>
              <StatHeader>
                <StatTitle>Expiring Soon (30 days)</StatTitle>
                <StatIcon color="#cd853f">
                  <Calendar size={20} />
                </StatIcon>
              </StatHeader>
              <StatValue>{stats.expiringCerts}</StatValue>
              <StatChange>
                <Calendar size={16} />
                Schedule renewals
              </StatChange>
            </StatCard>

            <StatCard>
              <StatHeader>
                <StatTitle>Training Sessions</StatTitle>
                <StatIcon color="#1e40af">
                  <BookOpen size={20} />
                </StatIcon>
              </StatHeader>
              <StatValue>12</StatValue>
              <StatChange positive={true}>
                <TrendingUp size={16} />
                This quarter
              </StatChange>
            </StatCard>
          </StatsGrid>

          {/* Compliance Action Items */}
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', fontSize: '1.25rem', fontWeight: '600' }}>
              <AlertTriangle size={24} style={{ color: '#dc2626' }} />
              Priority Compliance Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px' }}>
                <div style={{ fontWeight: '600', color: '#dc2626' }}>David Wilson - Tool Safety Training Expired</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
                  Certification expired on January 15, 2024. Employee cannot operate power tools until renewed.
                </div>
              </div>
              <div style={{ padding: '16px', background: '#fffbeb', border: '1px solid #fed7aa', borderRadius: '8px' }}>
                <div style={{ fontWeight: '600', color: '#cd853f' }}>Miguel Rodriguez - PPE Safety Training Expiring</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
                  Certification expires July 15, 2024. Schedule renewal within 30 days.
                </div>
              </div>
              <div style={{ padding: '16px', background: '#fffbeb', border: '1px solid #fed7aa', borderRadius: '8px' }}>
                <div style={{ fontWeight: '600', color: '#cd853f' }}>David Wilson - Basic Safety Orientation Expiring</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>
                  Certification expires July 8, 2024. Required for all active employees.
                </div>
              </div>
            </div>
          </div>

          {/* OSHA Requirements Checklist */}
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', fontSize: '1.25rem', fontWeight: '600' }}>
              <CheckCircle size={24} style={{ color: '#059669' }} />
              OSHA 1926 Requirements for Roofing
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
                <CheckCircle size={20} style={{ color: '#059669' }} />
                <span>Fall Protection Training (1926.501)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
                <CheckCircle size={20} style={{ color: '#059669' }} />
                <span>PPE Requirements (1926.95)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
                <CheckCircle size={20} style={{ color: '#059669' }} />
                <span>Ladder Safety (1926.1053)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
                <CheckCircle size={20} style={{ color: '#059669' }} />
                <span>Competent Person Training</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
                <CheckCircle size={20} style={{ color: '#059669' }} />
                <span>Hazard Communication (1926.59)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
                <CheckCircle size={20} style={{ color: '#059669' }} />
                <span>First Aid/CPR Certification</span>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'payroll' && (
        <>
          {/* Payroll Overview */}
          <StatsGrid>
            <StatCard>
              <StatHeader>
                <StatTitle>Weekly Payroll</StatTitle>
                <StatIcon color="#1e40af">
                  <DollarSign size={20} />
                </StatIcon>
              </StatHeader>
              <StatValue>{formatCurrency(stats.totalPayroll)}</StatValue>
              <StatChange>
                <Clock size={16} />
                Current pay period
              </StatChange>
            </StatCard>

            <StatCard>
              <StatHeader>
                <StatTitle>Overtime Hours</StatTitle>
                <StatIcon color="#cd853f">
                  <Clock size={20} />
                </StatIcon>
              </StatHeader>
              <StatValue>{stats.overtimeHours}</StatValue>
              <StatChange positive={stats.overtimeHours < 10}>
                <Activity size={16} />
                This week
              </StatChange>
            </StatCard>

            <StatCard>
              <StatHeader>
                <StatTitle>Average Pay Rate</StatTitle>
                <StatIcon color="#059669">
                  <TrendingUp size={20} />
                </StatIcon>
              </StatHeader>
              <StatValue>${(stats.totalPayroll / employees.filter(e => e.status === 'active').reduce((acc, emp) => acc + emp.timeTracking.hoursThisWeek, 0)).toFixed(2)}</StatValue>
              <StatChange>
                <DollarSign size={16} />
                Per hour
              </StatChange>
            </StatCard>

            <StatCard>
              <StatHeader>
                <StatTitle>Total Hours</StatTitle>
                <StatIcon color="#8b4513">
                  <Briefcase size={20} />
                </StatIcon>
              </StatHeader>
              <StatValue>{employees.filter(e => e.status === 'active').reduce((acc, emp) => acc + emp.timeTracking.hoursThisWeek, 0)}</StatValue>
              <StatChange>
                <Clock size={16} />
                This week
              </StatChange>
            </StatCard>
          </StatsGrid>

          {/* Weekly Timesheet Summary */}
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', fontSize: '1.25rem', fontWeight: '600' }}>
              <Clock size={24} style={{ color: '#1e40af' }} />
              Weekly Timesheet Summary
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Employee</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Role</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Regular Hours</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Overtime</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Rate</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Gross Pay</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.filter(e => e.status === 'active').map((employee, index) => {
                    const regularHours = Math.min(employee.timeTracking.hoursThisWeek, 40);
                    const overtimeHours = employee.timeTracking.overtime;
                    const grossPay = (regularHours * employee.payRate) + (overtimeHours * employee.payRate * 1.5);

                    return (
                      <tr key={employee.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '12px', fontWeight: '500' }}>{employee.firstName} {employee.lastName}</td>
                        <td style={{ padding: '12px', color: '#64748b' }}>{employee.role}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>{regularHours}h</td>
                        <td style={{ padding: '12px', textAlign: 'right', color: overtimeHours > 0 ? '#cd853f' : '#64748b' }}>
                          {overtimeHours > 0 ? `${overtimeHours}h` : '-'}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>${employee.payRate.toFixed(2)}</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>${grossPay.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payroll Actions */}
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', fontSize: '1.25rem', fontWeight: '600' }}>
              <Settings size={24} style={{ color: '#1e40af' }} />
              Payroll Actions
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <button onClick={handleProcessPayroll} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: '#1e40af',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                <DollarSign size={20} />
                Process Payroll
              </button>
              <button onClick={() => handleExportReport('Timesheets')} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: '#ffffff',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                <Download size={20} />
                Export Timesheets
              </button>
              <button onClick={() => handleGenerateReport('Payroll Reports')} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: '#ffffff',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                <FileText size={20} />
                Generate Reports
              </button>
              <button onClick={() => alert('Payroll Settings - Configuration panel coming soon!')} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                background: '#ffffff',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                <Settings size={20} />
                Payroll Settings
              </button>
            </div>
          </div>
        </>
      )}

      {activeTab === 'reports' && (
        <>
          {/* Quick Report Stats */}
          <StatsGrid>
            <StatCard>
              <StatHeader>
                <StatTitle>Compliance Rate Trend</StatTitle>
                <StatIcon color="#059669">
                  <TrendingUp size={20} />
                </StatIcon>
              </StatHeader>
              <StatValue>+5%</StatValue>
              <StatChange positive={true}>
                <TrendingUp size={16} />
                vs last quarter
              </StatChange>
            </StatCard>

            <StatCard>
              <StatHeader>
                <StatTitle>Training Completion</StatTitle>
                <StatIcon color="#1e40af">
                  <BookOpen size={20} />
                </StatIcon>
              </StatHeader>
              <StatValue>87%</StatValue>
              <StatChange positive={true}>
                <CheckCircle size={16} />
                On schedule
              </StatChange>
            </StatCard>

            <StatCard>
              <StatHeader>
                <StatTitle>Payroll Variance</StatTitle>
                <StatIcon color="#cd853f">
                  <BarChart3 size={20} />
                </StatIcon>
              </StatHeader>
              <StatValue>2.3%</StatValue>
              <StatChange>
                <Activity size={16} />
                vs budget
              </StatChange>
            </StatCard>

            <StatCard>
              <StatHeader>
                <StatTitle>Incident Rate</StatTitle>
                <StatIcon color="#059669">
                  <Shield size={20} />
                </StatIcon>
              </StatHeader>
              <StatValue>0.00</StatValue>
              <StatChange positive={true}>
                <Shield size={16} />
                Zero incidents YTD
              </StatChange>
            </StatCard>
          </StatsGrid>

          {/* Available Reports */}
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', fontSize: '1.25rem', fontWeight: '600' }}>
              <FileText size={24} style={{ color: '#1e40af' }} />
              Available Reports
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>

              {/* OSHA Compliance Reports */}
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '1rem', fontWeight: '600' }}>
                  <Shield size={20} style={{ color: '#059669' }} />
                  OSHA Compliance
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={() => handleGenerateReport('Certification Status Report')} style={{ padding: '8px 12px', background: 'none', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem' }}>
                    📋 Certification Status Report
                  </button>
                  <button onClick={() => handleGenerateReport('Expired Certifications')} style={{ padding: '8px 12px', background: 'none', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem' }}>
                    ⚠️ Expired Certifications
                  </button>
                  <button onClick={() => handleGenerateReport('Training Schedule')} style={{ padding: '8px 12px', background: 'none', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem' }}>
                    📅 Training Schedule
                  </button>
                  <button onClick={() => handleGenerateReport('Safety Incident Log')} style={{ padding: '8px 12px', background: 'none', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem' }}>
                    🛡️ Safety Incident Log
                  </button>
                </div>
              </div>

              {/* Payroll Reports */}
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '1rem', fontWeight: '600' }}>
                  <DollarSign size={20} style={{ color: '#1e40af' }} />
                  Payroll & Time
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={() => handleGenerateReport('Weekly Payroll Summary')} style={{ padding: '8px 12px', background: 'none', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem' }}>
                    💰 Weekly Payroll Summary
                  </button>
                  <button onClick={() => handleGenerateReport('Overtime Analysis')} style={{ padding: '8px 12px', background: 'none', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem' }}>
                    ⏰ Overtime Analysis
                  </button>
                  <button onClick={() => handleGenerateReport('Labor Cost by Project')} style={{ padding: '8px 12px', background: 'none', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem' }}>
                    📊 Labor Cost by Project
                  </button>
                  <button onClick={() => handleGenerateReport('Pay Rate Analysis')} style={{ padding: '8px 12px', background: 'none', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem' }}>
                    📈 Pay Rate Analysis
                  </button>
                </div>
              </div>

              {/* Employee Reports */}
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '1rem', fontWeight: '600' }}>
                  <Users size={20} style={{ color: '#8b4513' }} />
                  Employee Analytics
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={() => handleGenerateReport('Employee Directory')} style={{ padding: '8px 12px', background: 'none', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem' }}>
                    👥 Employee Directory
                  </button>
                  <button onClick={() => handleGenerateReport('Performance Reviews')} style={{ padding: '8px 12px', background: 'none', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem' }}>
                    📋 Performance Reviews
                  </button>
                  <button onClick={() => handleGenerateReport('Training Progress')} style={{ padding: '8px 12px', background: 'none', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem' }}>
                    🎯 Training Progress
                  </button>
                  <button onClick={() => handleGenerateReport('Workforce Demographics')} style={{ padding: '8px 12px', background: 'none', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem' }}>
                    📊 Workforce Demographics
                  </button>
                </div>
              </div>

              {/* Management Reports */}
              <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '1rem', fontWeight: '600' }}>
                  <BarChart3 size={20} style={{ color: '#cd853f' }} />
                  Management Dashboard
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={() => handleGenerateReport('KPI Dashboard')} style={{ padding: '8px 12px', background: 'none', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem' }}>
                    📈 KPI Dashboard
                  </button>
                  <button onClick={() => handleGenerateReport('Department Summary')} style={{ padding: '8px 12px', background: 'none', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem' }}>
                    💼 Department Summary
                  </button>
                  <button onClick={() => handleGenerateReport('Executive Summary')} style={{ padding: '8px 12px', background: 'none', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem' }}>
                    📊 Executive Summary
                  </button>
                  <button onClick={() => handleGenerateReport('Compliance Scorecard')} style={{ padding: '8px 12px', background: 'none', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem' }}>
                    🎯 Compliance Scorecard
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', fontSize: '1.25rem', fontWeight: '600' }}>
              <Activity size={24} style={{ color: '#1e40af' }} />
              Recent HR Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ width: '8px', height: '8px', background: '#059669', borderRadius: '50%' }}></div>
                <span style={{ fontSize: '0.875rem' }}>Miguel Rodriguez completed Fall Protection recertification</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: 'auto' }}>2 hours ago</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ width: '8px', height: '8px', background: '#1e40af', borderRadius: '50%' }}></div>
                <span style={{ fontSize: '0.875rem' }}>Weekly payroll processed for 5 employees</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: 'auto' }}>1 day ago</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ width: '8px', height: '8px', background: '#cd853f', borderRadius: '50%' }}></div>
                <span style={{ fontSize: '0.875rem' }}>David Wilson training reminder sent for expired certifications</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: 'auto' }}>2 days ago</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ width: '8px', height: '8px', background: '#059669', borderRadius: '50%' }}></div>
                <span style={{ fontSize: '0.875rem' }}>James Thompson updated safety protocols documentation</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: 'auto' }}>3 days ago</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <div style={{ width: '8px', height: '8px', background: '#1e40af', borderRadius: '50%' }}></div>
                <span style={{ fontSize: '0.875rem' }}>Quarterly compliance report generated and filed</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: 'auto' }}>1 week ago</span>
              </div>
            </div>
          </div>
        </>
      )}
    </HRContainer>
  );
};

export default HumanResources;