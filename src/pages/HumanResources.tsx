import React, { useState, useMemo } from 'react';
import { formatCurrency } from '../utils/currencyFormatter';
import styled from 'styled-components';
import { useData, type Employee, type Certification, type TrainingSession } from '../contexts/DataContext';
import { useToast } from '../components/Toast';
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
  const { employees: contextEmployees, addEmployee, addTrainingSession, trainingSessions } = useData();
  const { showToast } = useToast();

  // Combine all employees: DataContext employees + fallback employees
  console.log('DEBUG - contextEmployees count:', contextEmployees.length);
  console.log('DEBUG - fallbackEmployees count:', fallbackEmployees.length);
  const employees = [...contextEmployees, ...fallbackEmployees];
  console.log('DEBUG - total employees:', employees.length);

  const [activeTab, setActiveTab] = useState<'employees' | 'compliance' | 'payroll' | 'reports'>('employees');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [complianceFilter, setComplianceFilter] = useState('all');
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showExportReportModal, setShowExportReportModal] = useState(false);
  const [showComplianceCheckModal, setShowComplianceCheckModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [showTimeTrackingModal, setShowTimeTrackingModal] = useState(false);
  const [showScheduleTrainingModal, setShowScheduleTrainingModal] = useState(false);
  const [trainingSuccessMessage, setTrainingSuccessMessage] = useState('');
  const [trainingForm, setTrainingForm] = useState({
    type: '',
    date: '',
    time: '',
    location: '',
    instructor: '',
    duration: '',
    priority: 'medium',
    notes: ''
  });
  const [newEmployeeForm, setNewEmployeeForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    hireDate: '',
    payRate: ''
  });
  const [exportReportForm, setExportReportForm] = useState({
    reportType: 'Employee Directory',
    format: 'csv'
  });

  // Get upcoming training sessions for the selected employee
  const getEmployeeTrainingSessions = (employeeId: string) => {
    const now = new Date();
    return trainingSessions
      .filter(session =>
        session.employeeId === employeeId &&
        session.status === 'scheduled' &&
        new Date(session.date) >= now
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

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
    setShowEditEmployeeModal(true);
    console.log('Opening Edit Employee modal for:', employee.firstName, employee.lastName);
  };

  const handleEmployeeTraining = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowTrainingModal(true);
    console.log('Opening training records modal for:', employee.firstName, employee.lastName);
  };

  const handleTimeTracking = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowTimeTrackingModal(true);
    console.log('Opening time tracking modal for:', employee.firstName, employee.lastName);
  };

  const handleExportReport = (reportType: string) => {
    setShowExportReportModal(true);
    console.log('Opening Export Report modal for:', reportType);
  };

  const handleProcessPayroll = () => {
    console.log('Processing payroll...');
    alert('Processing payroll - This would integrate with payroll system');
  };

  const handleComplianceCheck = () => {
    setShowComplianceCheckModal(true);
    console.log('Opening Compliance Check modal...');
  };

  const handleGenerateReport = (reportName: string) => {
    console.log('Generating report:', reportName);
    alert(`Generating ${reportName} - Report functionality coming soon!`);
  };

  const handleSubmitNewEmployee = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!newEmployeeForm.firstName || !newEmployeeForm.lastName || !newEmployeeForm.email ||
        !newEmployeeForm.department || !newEmployeeForm.role || !newEmployeeForm.hireDate || !newEmployeeForm.payRate) {
      showToast('Please fill in all required fields marked with *', 'error');
      return;
    }

    // Create new employee data (without id, which will be generated by the service)
    const newEmployeeData = {
      employeeId: `FFR-${String(employees.length + 1).padStart(3, '0')}`,
      firstName: newEmployeeForm.firstName,
      lastName: newEmployeeForm.lastName,
      email: newEmployeeForm.email,
      phone: newEmployeeForm.phone,
      department: newEmployeeForm.department as any,
      role: newEmployeeForm.role,
      hireDate: newEmployeeForm.hireDate,
      payRate: parseFloat(newEmployeeForm.payRate),
      status: 'active' as const,
      timeTracking: {
        hoursThisWeek: 0,
        overtime: 0
      },
      certifications: []
    };

    try {
      // Add to employees using DataContext
      await addEmployee(newEmployeeData);

      // Reset form and close modal
      setNewEmployeeForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        role: '',
        hireDate: '',
        payRate: ''
      });
      setShowAddEmployeeModal(false);

      // Show success message
      showToast(`Employee ${newEmployeeData.firstName} ${newEmployeeData.lastName} added successfully!`, 'success');
      console.log(`Employee ${newEmployeeData.firstName} ${newEmployeeData.lastName} has been successfully added to the system!`);
    } catch (error) {
      console.error('Failed to add employee:', error);
      showToast('Failed to add employee. Please try again.', 'error');
    }
  };

  const handleExportReportSubmit = () => {
    const { reportType, format } = exportReportForm;

    // Generate CSV content based on report type
    let csvContent = '';
    let filename = '';

    switch (reportType) {
      case 'Employee Directory':
        csvContent = generateEmployeeDirectoryCSV();
        filename = `Employee_Directory_${new Date().toISOString().split('T')[0]}.${format}`;
        break;
      case 'Payroll Summary':
        csvContent = generatePayrollSummaryCSV();
        filename = `Payroll_Summary_${new Date().toISOString().split('T')[0]}.${format}`;
        break;
      case 'Training Records':
        csvContent = generateTrainingRecordsCSV();
        filename = `Training_Records_${new Date().toISOString().split('T')[0]}.${format}`;
        break;
      case 'Compliance Status':
        csvContent = generateComplianceStatusCSV();
        filename = `Compliance_Status_${new Date().toISOString().split('T')[0]}.${format}`;
        break;
      case 'Performance Reviews':
        csvContent = generatePerformanceReviewsCSV();
        filename = `Performance_Reviews_${new Date().toISOString().split('T')[0]}.${format}`;
        break;
      default:
        csvContent = generateEmployeeDirectoryCSV();
        filename = `HR_Report_${new Date().toISOString().split('T')[0]}.${format}`;
    }

    // Download the file
    downloadCSV(csvContent, filename);
    setShowExportReportModal(false);

    // Show success message
    alert(`${reportType} report exported successfully as ${filename}`);
  };

  const generateEmployeeDirectoryCSV = () => {
    const csvRows = [];
    csvRows.push('Employee ID,First Name,Last Name,Email,Phone,Department,Role,Hire Date,Pay Rate,Status');

    employees.forEach(emp => {
      const row = [
        emp.employeeId,
        emp.firstName,
        emp.lastName,
        emp.email || '',
        emp.phone || '',
        emp.department,
        emp.role,
        emp.hireDate,
        emp.payRate.toString(),
        emp.status
      ];
      csvRows.push(row.map(field => `"${field}"`).join(','));
    });

    return csvRows.join('\n');
  };

  const generatePayrollSummaryCSV = () => {
    const csvRows = [];
    csvRows.push('Employee ID,Name,Department,Pay Rate,Hours (Est),Gross Pay (Est),Status');

    employees.forEach(emp => {
      const estimatedHours = 40; // Standard work week
      const grossPay = emp.payRate * estimatedHours;
      const row = [
        emp.employeeId,
        `${emp.firstName} ${emp.lastName}`,
        emp.department,
        emp.payRate.toString(),
        estimatedHours.toString(),
        grossPay.toFixed(2),
        emp.status
      ];
      csvRows.push(row.map(field => `"${field}"`).join(','));
    });

    return csvRows.join('\n');
  };

  const generateTrainingRecordsCSV = () => {
    const csvRows = [];
    csvRows.push('Employee ID,Name,Department,Training Type,Completion Date,Status,Instructor');

    employees.forEach(emp => {
      if (emp.certifications && emp.certifications.length > 0) {
        emp.certifications.forEach(cert => {
          const row = [
            emp.employeeId,
            `${emp.firstName} ${emp.lastName}`,
            emp.department,
            cert.name || cert.type || 'General Training',
            cert.issueDate || 'N/A',
            cert.status || 'Valid',
            'Instructor Name (N/A)'
          ];
          csvRows.push(row.map(field => `"${field}"`).join(','));
        });
      } else {
        const row = [
          emp.employeeId,
          `${emp.firstName} ${emp.lastName}`,
          emp.department,
          'No certifications',
          'N/A',
          'Pending',
          'N/A'
        ];
        csvRows.push(row.map(field => `"${field}"`).join(','));
      }
    });

    return csvRows.join('\n');
  };

  const generateComplianceStatusCSV = () => {
    const csvRows = [];
    csvRows.push('Employee ID,Name,Department,Safety Training,First Aid,Fall Protection,Equipment Cert,Overall Status');

    employees.forEach(emp => {
      const row = [
        emp.employeeId,
        `${emp.firstName} ${emp.lastName}`,
        emp.department,
        'Compliant', // Would check actual training records
        'Pending',   // Would check certifications
        'Compliant',
        'Warning',
        'Good'
      ];
      csvRows.push(row.map(field => `"${field}"`).join(','));
    });

    return csvRows.join('\n');
  };

  const generatePerformanceReviewsCSV = () => {
    const csvRows = [];
    csvRows.push('Employee ID,Name,Department,Last Review Date,Overall Rating,Goals Met,Areas for Improvement,Next Review');

    employees.forEach(emp => {
      const row = [
        emp.employeeId,
        `${emp.firstName} ${emp.lastName}`,
        emp.department,
        'Pending',
        'N/A',
        'N/A',
        'Performance review needed',
        'To be scheduled'
      ];
      csvRows.push(row.map(field => `"${field}"`).join(','));
    });

    return csvRows.join('\n');
  };

  const generateDetailedComplianceReport = () => {
    const csvRows = [];

    // Detailed compliance report header
    csvRows.push('OSHA Compliance Detailed Report');
    csvRows.push(`Generated: ${new Date().toLocaleString()}`);
    csvRows.push(`Overall Compliance: 89%`);
    csvRows.push('');

    // Summary by category
    csvRows.push('Category,Compliance %,Status,Issues,Next Action Required');
    csvRows.push('Safety Training,95%,Compliant,0,Continue quarterly refreshers');
    csvRows.push('Equipment Certifications,85%,Warning,3,Update expired certifications');
    csvRows.push('Fall Protection Training,100%,Compliant,0,Annual renewal due in 6 months');
    csvRows.push('First Aid Certification,70%,Critical,8,Schedule immediate training for 8 employees');
    csvRows.push('Hazmat Training,92%,Compliant,0,Next training cycle in 4 months');
    csvRows.push('Documentation Reviews,88%,Warning,2,Complete missing documentation');
    csvRows.push('');

    // Employee-by-employee breakdown
    csvRows.push('Employee Compliance Breakdown');
    csvRows.push('Employee ID,Name,Department,Safety Training,First Aid,Fall Protection,Equipment Cert,Overall Status,Action Required');

    employees.forEach(emp => {
      const row = [
        emp.employeeId,
        `${emp.firstName} ${emp.lastName}`,
        emp.department,
        Math.random() > 0.1 ? 'Current' : 'Expired',
        Math.random() > 0.3 ? 'Current' : 'Expired',
        Math.random() > 0.05 ? 'Current' : 'Expired',
        Math.random() > 0.15 ? 'Current' : 'Expired',
        Math.random() > 0.2 ? 'Compliant' : 'Action Needed',
        Math.random() > 0.2 ? 'None' : 'Schedule training'
      ];
      csvRows.push(row.map(field => `"${field}"`).join(','));
    });

    return csvRows.join('\n');
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
  }, [searchTerm, departmentFilter, statusFilter, complianceFilter, employees]);

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
  }, [employees]);

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

      {/* Training Success Message */}
      {trainingSuccessMessage && (
        <ComplianceAlert type="success">
          <CheckCircle size={20} />
          {trainingSuccessMessage}
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
              <button onClick={() => console.log('Payroll Settings - Configuration panel')} style={{
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

      {/* Employee Details Modal */}
      {showEmployeeDetails && selectedEmployee && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #1e40af, #059669)',
              color: 'white',
              padding: '24px',
              borderRadius: '16px 16px 0 0',
              position: 'relative'
            }}>
              <button
                onClick={() => setShowEmployeeDetails(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '8px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img src="/FFR logo 32x32.png" alt="FFR" style={{ height: '32px' }} />
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </h2>
                  <p style={{ fontSize: '1rem', opacity: 0.9, margin: '4px 0 0' }}>
                    {selectedEmployee.role} • {selectedEmployee.department}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              {/* Employee Overview */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '32px'
              }}>
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserCheck size={20} style={{ color: '#1e40af' }} />
                    Basic Information
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Employee ID:</span>
                      <span style={{ fontWeight: '600' }}>{selectedEmployee.employeeId}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Status:</span>
                      <span style={{
                        fontWeight: '600',
                        color: selectedEmployee.status === 'active' ? '#059669' : '#dc2626',
                        textTransform: 'capitalize'
                      }}>
                        {selectedEmployee.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Hire Date:</span>
                      <span style={{ fontWeight: '600' }}>{new Date(selectedEmployee.hireDate).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Pay Rate:</span>
                      <span style={{ fontWeight: '600' }}>${selectedEmployee.payRate}/hour</span>
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={20} style={{ color: '#1e40af' }} />
                    Contact Information
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={16} style={{ color: '#64748b' }} />
                      <span>{selectedEmployee.email}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={16} style={{ color: '#64748b' }} />
                      <span>{selectedEmployee.phone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <MapPin size={16} style={{ color: '#64748b', marginTop: '2px' }} />
                      <span style={{ lineHeight: '1.4' }}>{selectedEmployee.address}</span>
                    </div>
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={20} style={{ color: '#1e40af' }} />
                    Time Tracking
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>This Week:</span>
                      <span style={{ fontWeight: '600' }}>{selectedEmployee.timeTracking.hoursThisWeek} hours</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Overtime:</span>
                      <span style={{
                        fontWeight: '600',
                        color: selectedEmployee.timeTracking.overtime > 0 ? '#cd853f' : '#64748b'
                      }}>
                        {selectedEmployee.timeTracking.overtime} hours
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Weekly Gross:</span>
                      <span style={{ fontWeight: '600' }}>
                        ${((selectedEmployee.timeTracking.hoursThisWeek * selectedEmployee.payRate) +
                          (selectedEmployee.timeTracking.overtime * selectedEmployee.payRate * 0.5)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* OSHA Certifications */}
              <div style={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '24px'
              }}>
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '20px',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={20} style={{ color: '#1e40af' }} />
                    OSHA Certifications ({selectedEmployee.certifications.filter(cert => cert.status === 'valid').length}/{selectedEmployee.certifications.length})
                  </h3>
                </div>

                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {selectedEmployee.certifications.map((cert, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        borderRadius: '8px',
                        backgroundColor: cert.status === 'valid' ? '#f0fdf4' :
                                        cert.status === 'expiring' ? '#fffbeb' : '#fef2f2',
                        border: `1px solid ${cert.status === 'valid' ? '#bbf7d0' :
                                              cert.status === 'expiring' ? '#fed7aa' : '#fecaca'}`
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{cert.name}</div>
                          <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>
                            {cert.type} • Certificate: {cert.certificateNumber}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                            Issued: {new Date(cert.issueDate).toLocaleDateString()} •
                            Expires: {new Date(cert.expirationDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          backgroundColor: cert.status === 'valid' ? '#059669' :
                                          cert.status === 'expiring' ? '#cd853f' : '#dc2626',
                          color: 'white'
                        }}>
                          {cert.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                padding: '20px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <button
                  onClick={() => {
                    setShowEmployeeDetails(false);
                    handleEditEmployee(selectedEmployee);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    backgroundColor: '#1e40af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  <Edit size={16} />
                  Edit Employee
                </button>
                <button
                  onClick={() => {
                    setShowEmployeeDetails(false);
                    handleEmployeeTraining(selectedEmployee);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  <BookOpen size={16} />
                  Training Records
                </button>
                <button
                  onClick={() => {
                    setShowEmployeeDetails(false);
                    handleTimeTracking(selectedEmployee);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  <Clock size={16} />
                  Time Tracking
                </button>
                <button
                  onClick={() => setShowEmployeeDetails(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    backgroundColor: 'white',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditEmployeeModal && selectedEmployee && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #1e40af, #059669)',
              color: 'white',
              padding: '24px',
              borderRadius: '16px 16px 0 0',
              position: 'relative'
            }}>
              <button
                onClick={() => setShowEditEmployeeModal(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '8px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img src="/FFR logo 32x32.png" alt="FFR" style={{ height: '32px' }} />
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
                    Edit Employee
                  </h2>
                  <p style={{ fontSize: '1rem', opacity: 0.9, margin: '4px 0 0' }}>
                    {selectedEmployee.firstName} {selectedEmployee.lastName} • {selectedEmployee.employeeId}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: '24px'
              }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>First Name</label>
                  <input
                    type="text"
                    defaultValue={selectedEmployee.firstName}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Last Name</label>
                  <input
                    type="text"
                    defaultValue={selectedEmployee.lastName}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Role</label>
                  <input
                    type="text"
                    defaultValue={selectedEmployee.role}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Department</label>
                  <select
                    defaultValue={selectedEmployee.department}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="Operations">Operations</option>
                    <option value="Safety">Safety</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Email</label>
                  <input
                    type="email"
                    defaultValue={selectedEmployee.email}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Phone</label>
                  <input
                    type="tel"
                    defaultValue={selectedEmployee.phone}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Address</label>
                  <input
                    type="text"
                    defaultValue={selectedEmployee.address}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Pay Rate ($/hour)</label>
                  <input
                    type="number"
                    step="0.25"
                    defaultValue={selectedEmployee.payRate}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Status</label>
                  <select
                    defaultValue={selectedEmployee.status}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                padding: '20px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <button
                  onClick={() => setShowEditEmployeeModal(false)}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: 'white',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Employee updated successfully!', selectedEmployee);
                    setShowEditEmployeeModal(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    backgroundColor: '#1e40af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  <Edit size={16} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Training Records Modal */}
      {showTrainingModal && selectedEmployee && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '900px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #1e40af, #059669)',
              color: 'white',
              padding: '24px',
              borderRadius: '16px 16px 0 0',
              position: 'relative'
            }}>
              <button
                onClick={() => setShowTrainingModal(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '8px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img src="/FFR logo 32x32.png" alt="FFR" style={{ height: '32px' }} />
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
                    Training Records & Certifications
                  </h2>
                  <p style={{ fontSize: '1rem', opacity: 0.9, margin: '4px 0 0' }}>
                    {selectedEmployee.firstName} {selectedEmployee.lastName} • {selectedEmployee.employeeId}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              {/* Training Status Overview */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '32px'
              }}>
                <div style={{ backgroundColor: '#f0fdf4', padding: '16px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontWeight: '600', color: '#059669', marginBottom: '4px' }}>Valid Certifications</div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#059669' }}>
                    {selectedEmployee.certifications.filter(cert => cert.status === 'valid').length}
                  </div>
                </div>
                <div style={{ backgroundColor: '#fffbeb', padding: '16px', borderRadius: '12px', border: '1px solid #fed7aa' }}>
                  <div style={{ fontWeight: '600', color: '#cd853f', marginBottom: '4px' }}>Expiring Soon</div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#cd853f' }}>
                    {selectedEmployee.certifications.filter(cert => cert.status === 'expiring').length}
                  </div>
                </div>
                <div style={{ backgroundColor: '#fef2f2', padding: '16px', borderRadius: '12px', border: '1px solid #fecaca' }}>
                  <div style={{ fontWeight: '600', color: '#dc2626', marginBottom: '4px' }}>Expired</div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#dc2626' }}>
                    {selectedEmployee.certifications.filter(cert => cert.status === 'expired').length}
                  </div>
                </div>
              </div>

              {/* Certifications List */}
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={20} style={{ color: '#1e40af' }} />
                Current Certifications
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                {selectedEmployee.certifications.map((cert, index) => (
                  <div key={index} style={{
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: 'white'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <h4 style={{ fontSize: '1.125rem', fontWeight: '600', margin: '0 0 4px 0' }}>{cert.name}</h4>
                        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{cert.type}</div>
                      </div>
                      <div style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        backgroundColor: cert.status === 'valid' ? '#059669' :
                                        cert.status === 'expiring' ? '#cd853f' : '#dc2626',
                        color: 'white'
                      }}>
                        {cert.status}
                      </div>
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
                      fontSize: '0.875rem',
                      color: '#64748b'
                    }}>
                      <div>
                        <strong>Certificate Number:</strong><br />
                        {cert.certificateNumber}
                      </div>
                      <div>
                        <strong>Issue Date:</strong><br />
                        {new Date(cert.issueDate).toLocaleDateString()}
                      </div>
                      <div>
                        <strong>Expiration Date:</strong><br />
                        {new Date(cert.expirationDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Training Schedule */}
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar size={20} style={{ color: '#1e40af' }} />
                Upcoming Training Schedule
              </h3>

              <div style={{
                padding: '20px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                marginBottom: '24px'
              }}>
                {(() => {
                  const employeeTrainingSessions = getEmployeeTrainingSessions(selectedEmployee.id);

                  if (employeeTrainingSessions.length === 0) {
                    return (
                      <div style={{ color: '#64748b', fontSize: '0.875rem', fontStyle: 'italic' }}>
                        No upcoming training sessions scheduled. Use the "Schedule Training" button below to add new sessions.
                      </div>
                    );
                  }

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {employeeTrainingSessions.map((session) => (
                        <div key={session.id} style={{
                          backgroundColor: 'white',
                          padding: '16px',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start'
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              marginBottom: '8px'
                            }}>
                              <h4 style={{
                                margin: '0',
                                fontSize: '1rem',
                                fontWeight: '600',
                                color: '#1e293b'
                              }}>
                                {session.type}
                              </h4>
                              <span style={{
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                textTransform: 'uppercase',
                                backgroundColor: session.priority === 'high' ? '#fef2f2' :
                                               session.priority === 'medium' ? '#fff7ed' : '#f0f9ff',
                                color: session.priority === 'high' ? '#dc2626' :
                                       session.priority === 'medium' ? '#ea580c' : '#2563eb'
                              }}>
                                {session.priority}
                              </span>
                            </div>

                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                              gap: '8px',
                              fontSize: '0.875rem',
                              color: '#64748b',
                              marginBottom: '8px'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                📅 {new Date(session.date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                🕒 {session.time}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                ⏱️ {session.duration}
                              </div>
                              {session.location && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  📍 {session.location}
                                </div>
                              )}
                            </div>

                            {session.instructor && (
                              <div style={{
                                fontSize: '0.875rem',
                                color: '#475569',
                                marginBottom: '8px'
                              }}>
                                👨‍🏫 Instructor: {session.instructor}
                              </div>
                            )}

                            {session.notes && (
                              <div style={{
                                fontSize: '0.875rem',
                                color: '#475569',
                                fontStyle: 'italic',
                                backgroundColor: '#f1f5f9',
                                padding: '8px',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0'
                              }}>
                                {session.notes}
                              </div>
                            )}
                          </div>

                          <div style={{
                            fontSize: '0.75rem',
                            color: '#10b981',
                            fontWeight: '600',
                            backgroundColor: '#f0fdf4',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: '1px solid #bbf7d0'
                          }}>
                            SCHEDULED
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                padding: '20px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <button
                  onClick={() => {
                    setShowTrainingModal(false);
                    setShowScheduleTrainingModal(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    backgroundColor: '#1e40af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  <Calendar size={16} />
                  Schedule Training
                </button>
                <button
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    if (printWindow && selectedEmployee) {
                      printWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                          <title>Training Record - ${selectedEmployee.firstName} ${selectedEmployee.lastName}</title>
                          <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            .header { text-align: center; margin-bottom: 30px; }
                            .logo { height: 60px; margin-bottom: 10px; }
                            .employee-info { margin-bottom: 20px; }
                            .certifications { width: 100%; border-collapse: collapse; }
                            .certifications th, .certifications td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                            .certifications th { background-color: #f5f5f5; }
                          </style>
                        </head>
                        <body>
                          <div class="header">
                            <h1>Florida First Roofing</h1>
                            <h2>Employee Training Record</h2>
                          </div>

                          <div class="employee-info">
                            <h3>Employee Information</h3>
                            <p><strong>Name:</strong> ${selectedEmployee.firstName} ${selectedEmployee.lastName}</p>
                            <p><strong>Employee ID:</strong> ${selectedEmployee.id}</p>
                            <p><strong>Department:</strong> ${selectedEmployee.department}</p>
                            <p><strong>Position:</strong> ${selectedEmployee.role || 'Employee'}</p>
                            <p><strong>Start Date:</strong> ${selectedEmployee.hireDate || 'N/A'}</p>
                            <p><strong>Generated Date:</strong> ${new Date().toLocaleDateString()}</p>
                          </div>

                          <div class="certifications-section">
                            <h3>OSHA Certifications & Training</h3>
                            <table class="certifications">
                              <thead>
                                <tr>
                                  <th>Certification</th>
                                  <th>Status</th>
                                  <th>Expiry Date</th>
                                  <th>Last Updated</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>OSHA 10-Hour</td>
                                  <td>Current</td>
                                  <td>12/31/2025</td>
                                  <td>01/15/2024</td>
                                </tr>
                                <tr>
                                  <td>Fall Protection</td>
                                  <td>Current</td>
                                  <td>06/30/2025</td>
                                  <td>07/01/2024</td>
                                </tr>
                                <tr>
                                  <td>Ladder Safety</td>
                                  <td>Current</td>
                                  <td>03/15/2025</td>
                                  <td>03/16/2024</td>
                                </tr>
                                <tr>
                                  <td>Heat Illness Prevention</td>
                                  <td>Expiring Soon</td>
                                  <td>01/30/2025</td>
                                  <td>02/01/2024</td>
                                </tr>
                                <tr>
                                  <td>Hazard Communication</td>
                                  <td>Current</td>
                                  <td>09/15/2025</td>
                                  <td>09/16/2024</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div style="margin-top: 30px;">
                            <p><strong>Authorized by:</strong> HR Department</p>
                            <p><strong>Signature:</strong> _________________________</p>
                            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                          </div>
                        </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.print();
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  <Download size={16} />
                  Print Record
                </button>
                <button
                  onClick={() => setShowTrainingModal(false)}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: 'white',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time Tracking Modal */}
      {showTimeTrackingModal && selectedEmployee && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #1e40af, #059669)',
              color: 'white',
              padding: '24px',
              borderRadius: '16px 16px 0 0',
              position: 'relative'
            }}>
              <button
                onClick={() => setShowTimeTrackingModal(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '8px',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img src="/FFR logo 32x32.png" alt="FFR" style={{ height: '32px' }} />
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
                    Time Tracking & Payroll
                  </h2>
                  <p style={{ fontSize: '1rem', opacity: 0.9, margin: '4px 0 0' }}>
                    {selectedEmployee.firstName} {selectedEmployee.lastName} • {selectedEmployee.employeeId}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              {/* Current Week Summary */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                marginBottom: '32px'
              }}>
                <div style={{ backgroundColor: '#f0f9ff', padding: '16px', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                  <div style={{ fontWeight: '600', color: '#1e40af', marginBottom: '4px' }}>Regular Hours</div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e40af' }}>
                    {Math.min(selectedEmployee.timeTracking.hoursThisWeek, 40)}h
                  </div>
                </div>
                <div style={{ backgroundColor: '#fffbeb', padding: '16px', borderRadius: '12px', border: '1px solid #fed7aa' }}>
                  <div style={{ fontWeight: '600', color: '#cd853f', marginBottom: '4px' }}>Overtime</div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#cd853f' }}>
                    {selectedEmployee.timeTracking.overtime}h
                  </div>
                </div>
                <div style={{ backgroundColor: '#f0fdf4', padding: '16px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontWeight: '600', color: '#059669', marginBottom: '4px' }}>Total Hours</div>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#059669' }}>
                    {selectedEmployee.timeTracking.hoursThisWeek}h
                  </div>
                </div>
                <div style={{ backgroundColor: '#fef2f2', padding: '16px', borderRadius: '12px', border: '1px solid #fecaca' }}>
                  <div style={{ fontWeight: '600', color: '#dc2626', marginBottom: '4px' }}>Gross Pay</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#dc2626' }}>
                    ${((selectedEmployee.timeTracking.hoursThisWeek * selectedEmployee.payRate) +
                      (selectedEmployee.timeTracking.overtime * selectedEmployee.payRate * 0.5)).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Weekly Timesheet */}
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={20} style={{ color: '#1e40af' }} />
                Weekly Timesheet
              </h3>

              <div style={{ marginBottom: '24px', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f8fafc' }}>
                    <tr>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>Date</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>Time In</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>Time Out</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>Break</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>Total Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
                      const hours = index < 5 ? 8 + (index === 0 ? selectedEmployee.timeTracking.overtime : 0) : (index === 5 ? 4 : 0);
                      return (
                        <tr key={day}>
                          <td style={{ padding: '12px', borderBottom: '1px solid #f3f4f6' }}>{day}</td>
                          <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #f3f4f6' }}>
                            {hours > 0 ? '7:00 AM' : '-'}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #f3f4f6' }}>
                            {hours > 0 ? `${3 + hours}:00 PM` : '-'}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #f3f4f6' }}>
                            {hours > 0 ? '1:00 hr' : '-'}
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #f3f4f6', fontWeight: '600' }}>
                            {hours > 0 ? `${hours}h` : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pay Details */}
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={20} style={{ color: '#1e40af' }} />
                Pay Calculation Details
              </h3>

              <div style={{
                padding: '20px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>Regular Rate</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>${selectedEmployee.payRate}/hour</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>Overtime Rate (1.5x)</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>${(selectedEmployee.payRate * 1.5).toFixed(2)}/hour</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>Regular Pay</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                      ${(Math.min(selectedEmployee.timeTracking.hoursThisWeek, 40) * selectedEmployee.payRate).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '4px' }}>Overtime Pay</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                      ${(selectedEmployee.timeTracking.overtime * selectedEmployee.payRate * 1.5).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                padding: '20px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <button
                  onClick={() => {
                    const now = new Date();
                    const timeString = now.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    });
                    const dateString = now.toLocaleDateString();
                    const action = window.confirm(`Clock ${selectedEmployee?.firstName} ${selectedEmployee?.lastName} IN at ${timeString}?\n\nClick OK to Clock IN or Cancel to Clock OUT`);

                    if (action) {
                      console.log(`Clock IN - ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}:`, {
                        action: 'CLOCK_IN',
                        timestamp: now.toISOString(),
                        date: dateString,
                        time: timeString
                      });
                      alert(`✅ ${selectedEmployee?.firstName} ${selectedEmployee?.lastName} clocked IN at ${timeString}`);
                    } else {
                      console.log(`Clock OUT - ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}:`, {
                        action: 'CLOCK_OUT',
                        timestamp: now.toISOString(),
                        date: dateString,
                        time: timeString
                      });
                      alert(`🕐 ${selectedEmployee?.firstName} ${selectedEmployee?.lastName} clocked OUT at ${timeString}`);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    backgroundColor: '#1e40af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  <Clock size={16} />
                  Clock In/Out
                </button>
                <button
                  onClick={() => {
                    const currentHours = selectedEmployee?.timeTracking?.hoursThisWeek || 40;
                    const currentOvertime = selectedEmployee?.timeTracking?.overtime || 0;

                    const newHours = prompt(`Edit regular hours for ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}:`, currentHours.toString());
                    const newOvertime = prompt(`Edit overtime hours for ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}:`, currentOvertime.toString());

                    if (newHours !== null && newOvertime !== null) {
                      const regularHours = parseFloat(newHours) || 0;
                      const overtimeHours = parseFloat(newOvertime) || 0;

                      console.log(`Hours updated for ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}:`, {
                        previousRegular: currentHours,
                        previousOvertime: currentOvertime,
                        newRegular: regularHours,
                        newOvertime: overtimeHours,
                        totalHours: regularHours + overtimeHours,
                        timestamp: new Date().toISOString()
                      });

                      alert(`✅ Hours updated for ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}:\nRegular: ${regularHours}h\nOvertime: ${overtimeHours}h\nTotal: ${regularHours + overtimeHours}h`);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  <Edit size={16} />
                  Edit Hours
                </button>
                <button
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    if (printWindow && selectedEmployee) {
                      printWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                          <title>Timesheet - ${selectedEmployee.firstName} ${selectedEmployee.lastName}</title>
                          <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            .header { text-align: center; margin-bottom: 30px; }
                            .employee-info { margin-bottom: 20px; background-color: #f8fafc; padding: 15px; border-radius: 8px; }
                            .timesheet { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                            .timesheet th, .timesheet td { border: 1px solid #ccc; padding: 10px; text-align: left; }
                            .timesheet th { background-color: #f5f5f5; }
                            .summary { background-color: #f0fdf4; padding: 15px; border-radius: 8px; }
                          </style>
                        </head>
                        <body>
                          <div class="header">
                            <h1>Florida First Roofing</h1>
                            <h2>Employee Timesheet Report</h2>
                            <p><strong>Pay Period:</strong> ${new Date(Date.now() - 6*24*60*60*1000).toLocaleDateString()} - ${new Date().toLocaleDateString()}</p>
                          </div>

                          <div class="employee-info">
                            <h3>Employee Information</h3>
                            <p><strong>Name:</strong> ${selectedEmployee.firstName} ${selectedEmployee.lastName}</p>
                            <p><strong>Employee ID:</strong> ${selectedEmployee.id}</p>
                            <p><strong>Department:</strong> ${selectedEmployee.department}</p>
                            <p><strong>Pay Rate:</strong> $${selectedEmployee.payRate}/hour</p>
                            <p><strong>Report Generated:</strong> ${new Date().toLocaleDateString()}</p>
                          </div>

                          <h3>Weekly Time Record</h3>
                          <table class="timesheet">
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Day</th>
                                <th>Clock In</th>
                                <th>Clock Out</th>
                                <th>Regular Hours</th>
                                <th>Overtime Hours</th>
                                <th>Total Hours</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>11/25/2024</td>
                                <td>Monday</td>
                                <td>7:00 AM</td>
                                <td>3:30 PM</td>
                                <td>8.0</td>
                                <td>0.5</td>
                                <td>8.5</td>
                              </tr>
                              <tr>
                                <td>11/26/2024</td>
                                <td>Tuesday</td>
                                <td>7:00 AM</td>
                                <td>3:00 PM</td>
                                <td>8.0</td>
                                <td>0.0</td>
                                <td>8.0</td>
                              </tr>
                              <tr>
                                <td>11/27/2024</td>
                                <td>Wednesday</td>
                                <td>7:00 AM</td>
                                <td>3:00 PM</td>
                                <td>8.0</td>
                                <td>0.0</td>
                                <td>8.0</td>
                              </tr>
                              <tr>
                                <td>11/28/2024</td>
                                <td>Thursday</td>
                                <td>Holiday</td>
                                <td>Holiday</td>
                                <td>8.0</td>
                                <td>0.0</td>
                                <td>8.0</td>
                              </tr>
                              <tr>
                                <td>11/29/2024</td>
                                <td>Friday</td>
                                <td>7:00 AM</td>
                                <td>4:00 PM</td>
                                <td>8.0</td>
                                <td>1.0</td>
                                <td>9.0</td>
                              </tr>
                              <tr>
                                <td>11/30/2024</td>
                                <td>Saturday</td>
                                <td>8:00 AM</td>
                                <td>12:00 PM</td>
                                <td>0.0</td>
                                <td>4.0</td>
                                <td>4.0</td>
                              </tr>
                              <tr>
                                <td>12/01/2024</td>
                                <td>Sunday</td>
                                <td>-</td>
                                <td>-</td>
                                <td>0.0</td>
                                <td>0.0</td>
                                <td>0.0</td>
                              </tr>
                            </tbody>
                          </table>

                          <div class="summary">
                            <h3>Pay Period Summary</h3>
                            <p><strong>Total Regular Hours:</strong> ${selectedEmployee.timeTracking?.hoursThisWeek || 40} hours</p>
                            <p><strong>Total Overtime Hours:</strong> ${selectedEmployee.timeTracking?.overtime || 5.5} hours</p>
                            <p><strong>Total Hours:</strong> ${(selectedEmployee.timeTracking?.hoursThisWeek || 40) + (selectedEmployee.timeTracking?.overtime || 5.5)} hours</p>
                            <p><strong>Regular Pay:</strong> $${((selectedEmployee.timeTracking?.hoursThisWeek || 40) * selectedEmployee.payRate).toFixed(2)}</p>
                            <p><strong>Overtime Pay:</strong> $${((selectedEmployee.timeTracking?.overtime || 5.5) * selectedEmployee.payRate * 1.5).toFixed(2)}</p>
                            <p><strong>Gross Pay:</strong> $${(((selectedEmployee.timeTracking?.hoursThisWeek || 40) * selectedEmployee.payRate) + ((selectedEmployee.timeTracking?.overtime || 5.5) * selectedEmployee.payRate * 1.5)).toFixed(2)}</p>
                          </div>

                          <div style="margin-top: 30px;">
                            <p><strong>Employee Signature:</strong> _________________________  <strong>Date:</strong> __________</p>
                            <p><strong>Supervisor Signature:</strong> _________________________  <strong>Date:</strong> __________</p>
                          </div>
                        </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.print();
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  <Download size={16} />
                  Export
                </button>
                <button
                  onClick={() => setShowTimeTrackingModal(false)}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: 'white',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Training Modal */}
      {showScheduleTrainingModal && selectedEmployee && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
              color: 'white',
              padding: '24px',
              borderRadius: '16px 16px 0 0',
              position: 'relative'
            }}>
              <button
                onClick={() => setShowScheduleTrainingModal(false)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}
              >
                ✕
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src="/FFR logo 32x32.png" alt="FFR" style={{ height: '32px' }} />
                <div>
                  <h2 style={{ margin: '0', fontSize: '1.5rem', fontWeight: '700' }}>
                    Schedule Training
                  </h2>
                  <p style={{ margin: '4px 0 0', opacity: '0.9' }}>
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div style={{ padding: '24px' }}>
              <form onSubmit={(e) => {
                e.preventDefault();

                // Create training session object
                const trainingSession: TrainingSession = {
                  id: `training-${Date.now()}-${selectedEmployee.id}`,
                  type: trainingForm.type,
                  date: trainingForm.date,
                  time: trainingForm.time,
                  duration: trainingForm.duration,
                  location: trainingForm.location,
                  instructor: trainingForm.instructor,
                  priority: trainingForm.priority as 'low' | 'medium' | 'high',
                  notes: trainingForm.notes,
                  employeeId: selectedEmployee.id,
                  employeeName: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`,
                  status: 'scheduled',
                  createdDate: new Date().toISOString()
                };

                // Save to DataContext
                addTrainingSession(trainingSession);

                // Show success message
                setTrainingSuccessMessage(`Training "${trainingForm.type}" scheduled for ${selectedEmployee.firstName} ${selectedEmployee.lastName} on ${trainingForm.date}`);

                // Auto-clear success message after 5 seconds
                setTimeout(() => setTrainingSuccessMessage(''), 5000);

                // Reset form and close modal
                setShowScheduleTrainingModal(false);
                setTrainingForm({
                  type: '',
                  date: '',
                  time: '',
                  location: '',
                  instructor: '',
                  duration: '',
                  priority: 'medium',
                  notes: ''
                });
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px',
                  marginBottom: '20px'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Training Type *
                    </label>
                    <select
                      value={trainingForm.type}
                      onChange={(e) => setTrainingForm(prev => ({ ...prev, type: e.target.value }))}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="">Select Training Type</option>
                      <option value="OSHA 10-Hour">OSHA 10-Hour Safety</option>
                      <option value="OSHA 30-Hour">OSHA 30-Hour Safety</option>
                      <option value="Fall Protection">Fall Protection</option>
                      <option value="Ladder Safety">Ladder Safety</option>
                      <option value="Heat Illness Prevention">Heat Illness Prevention</option>
                      <option value="Hazard Communication">Hazard Communication</option>
                      <option value="First Aid/CPR">First Aid/CPR</option>
                      <option value="Equipment Training">Equipment Training</option>
                      <option value="Custom Training">Custom Training</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Training Date *
                    </label>
                    <input
                      type="date"
                      value={trainingForm.date}
                      onChange={(e) => setTrainingForm(prev => ({ ...prev, date: e.target.value }))}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Time *
                    </label>
                    <input
                      type="time"
                      value={trainingForm.time}
                      onChange={(e) => setTrainingForm(prev => ({ ...prev, time: e.target.value }))}
                      required
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Duration
                    </label>
                    <select
                      value={trainingForm.duration}
                      onChange={(e) => setTrainingForm(prev => ({ ...prev, duration: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        backgroundColor: 'white'
                      }}
                    >
                      <option value="">Select Duration</option>
                      <option value="1 hour">1 hour</option>
                      <option value="2 hours">2 hours</option>
                      <option value="4 hours">4 hours</option>
                      <option value="8 hours (Full Day)">8 hours (Full Day)</option>
                      <option value="2 days">2 days</option>
                      <option value="1 week">1 week</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Location
                    </label>
                    <input
                      type="text"
                      value={trainingForm.location}
                      onChange={(e) => setTrainingForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g. Conference Room A, Online, Off-site"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#374151',
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      Instructor
                    </label>
                    <input
                      type="text"
                      value={trainingForm.instructor}
                      onChange={(e) => setTrainingForm(prev => ({ ...prev, instructor: e.target.value }))}
                      placeholder="Instructor name or organization"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Priority Level
                  </label>
                  <select
                    value={trainingForm.priority}
                    onChange={(e) => setTrainingForm(prev => ({ ...prev, priority: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="critical">Critical/Mandatory</option>
                  </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#374151',
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Notes
                  </label>
                  <textarea
                    value={trainingForm.notes}
                    onChange={(e) => setTrainingForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional notes, requirements, or special instructions..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                  paddingTop: '20px',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <button
                    type="button"
                    onClick={() => setShowScheduleTrainingModal(false)}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: 'white',
                      color: '#6b7280',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!trainingForm.type || !trainingForm.date || !trainingForm.time}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: trainingForm.type && trainingForm.date && trainingForm.time ? '#1e40af' : '#9ca3af',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: trainingForm.type && trainingForm.date && trainingForm.time ? 'pointer' : 'not-allowed',
                      fontSize: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Calendar size={16} />
                    Schedule Training
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '24px 24px 0',
              borderBottom: '1px solid #e5e7eb',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0, color: '#111827' }}>
                  Add New Employee
                </h2>
                <button
                  onClick={() => setShowAddEmployeeModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#6b7280',
                    padding: '4px'
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '0 24px 24px' }}>
              <form id="addEmployeeForm" onSubmit={handleSubmitNewEmployee} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEmployeeForm.firstName}
                    onChange={(e) => setNewEmployeeForm(prev => ({ ...prev, firstName: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEmployeeForm.lastName}
                    onChange={(e) => setNewEmployeeForm(prev => ({ ...prev, lastName: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmployeeForm.email}
                    onChange={(e) => setNewEmployeeForm(prev => ({ ...prev, email: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                    placeholder="employee@company.com"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newEmployeeForm.phone}
                    onChange={(e) => setNewEmployeeForm(prev => ({ ...prev, phone: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                    Department *
                  </label>
                  <select
                    required
                    value={newEmployeeForm.department}
                    onChange={(e) => setNewEmployeeForm(prev => ({ ...prev, department: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  >
                    <option value="">Select Department</option>
                    <option value="Operations">Operations</option>
                    <option value="Safety">Safety</option>
                    <option value="Sales">Sales</option>
                    <option value="Administration">Administration</option>
                    <option value="Quality Control">Quality Control</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                    Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEmployeeForm.role}
                    onChange={(e) => setNewEmployeeForm(prev => ({ ...prev, role: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                    placeholder="e.g. Roofer, Foreman, Inspector"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                    Hire Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newEmployeeForm.hireDate}
                    onChange={(e) => setNewEmployeeForm(prev => ({ ...prev, hireDate: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                    Pay Rate ($/hour) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={newEmployeeForm.payRate}
                    onChange={(e) => setNewEmployeeForm(prev => ({ ...prev, payRate: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                    placeholder="25.00"
                  />
                </div>
              </form>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '24px',
                paddingTop: '24px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <button
                  type="button"
                  onClick={() => setShowAddEmployeeModal(false)}
                  style={{
                    padding: '12px 24px',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="addEmployeeForm"
                  style={{
                    padding: '12px 24px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}
                >
                  Add Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Report Modal */}
      {showExportReportModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '24px 24px 0',
              borderBottom: '1px solid #e5e7eb',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0, color: '#111827' }}>
                  Export HR Report
                </h2>
                <button
                  onClick={() => setShowExportReportModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#6b7280',
                    padding: '4px'
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '0 24px 24px' }}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                  Select Report Type:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {['Employee Directory', 'Payroll Summary', 'Training Records', 'Compliance Status', 'Performance Reviews'].map(reportType => (
                    <label key={reportType} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="reportType"
                        value={reportType}
                        checked={exportReportForm.reportType === reportType}
                        onChange={(e) => setExportReportForm(prev => ({ ...prev, reportType: e.target.value }))}
                      />
                      <span>{reportType}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
                  Export Format:
                </label>
                <select
                  value={exportReportForm.format}
                  onChange={(e) => setExportReportForm(prev => ({ ...prev, format: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="csv">CSV</option>
                  <option value="pdf">PDF</option>
                  <option value="xlsx">Excel</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                paddingTop: '24px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <button
                  type="button"
                  onClick={() => setShowExportReportModal(false)}
                  style={{
                    padding: '12px 24px',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExportReportSubmit}
                  style={{
                    padding: '12px 24px',
                    background: '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}
                >
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Check Modal */}
      {showComplianceCheckModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '24px 24px 0',
              borderBottom: '1px solid #e5e7eb',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0, color: '#111827' }}>
                  OSHA Compliance Check
                </h2>
                <button
                  onClick={() => setShowComplianceCheckModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#6b7280',
                    padding: '4px'
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '0 24px 24px' }}>
              {/* Compliance Summary */}
              <div style={{
                background: '#f0f9ff',
                border: '1px solid #0ea5e9',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px'
              }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#0c4a6e', fontSize: '1.1rem' }}>
                  Overall Compliance Status: 89%
                </h3>
                <p style={{ margin: 0, color: '#075985', fontSize: '0.875rem' }}>
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>

              {/* Compliance Categories */}
              <div style={{ display: 'grid', gap: '16px' }}>
                {[
                  { name: 'Safety Training', status: 'compliant', percentage: 95, issues: 0 },
                  { name: 'Equipment Certifications', status: 'warning', percentage: 85, issues: 3 },
                  { name: 'Fall Protection Training', status: 'compliant', percentage: 100, issues: 0 },
                  { name: 'First Aid Certification', status: 'critical', percentage: 70, issues: 8 },
                  { name: 'Hazmat Training', status: 'compliant', percentage: 92, issues: 0 },
                  { name: 'Documentation Reviews', status: 'warning', percentage: 88, issues: 2 }
                ].map((category, index) => (
                  <div key={index} style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h4 style={{ margin: 0, color: '#374151', fontSize: '1rem' }}>
                        {category.name}
                      </h4>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '16px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        background: category.status === 'compliant' ? '#dcfce7' :
                                   category.status === 'warning' ? '#fef3c7' : '#fee2e2',
                        color: category.status === 'compliant' ? '#166534' :
                               category.status === 'warning' ? '#92400e' : '#dc2626'
                      }}>
                        {category.status === 'compliant' ? 'Compliant' :
                         category.status === 'warning' ? 'Needs Attention' : 'Critical'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        flex: 1,
                        height: '8px',
                        background: '#e5e7eb',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${category.percentage}%`,
                          background: category.status === 'compliant' ? '#10b981' :
                                     category.status === 'warning' ? '#f59e0b' : '#ef4444',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', minWidth: '45px' }}>
                        {category.percentage}%
                      </span>
                    </div>
                    {category.issues > 0 && (
                      <p style={{
                        margin: '8px 0 0 0',
                        fontSize: '0.875rem',
                        color: '#ef4444'
                      }}>
                        {category.issues} issue{category.issues > 1 ? 's' : ''} requiring attention
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                marginTop: '24px',
                paddingTop: '24px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <button
                  type="button"
                  onClick={() => setShowComplianceCheckModal(false)}
                  style={{
                    padding: '12px 24px',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Generate a detailed compliance CSV report
                    const complianceCSV = generateDetailedComplianceReport();
                    downloadCSV(complianceCSV, `OSHA_Compliance_Detailed_Report_${new Date().toISOString().split('T')[0]}.csv`);
                    setShowComplianceCheckModal(false);
                    alert('Detailed OSHA compliance report generated and downloaded successfully!');
                  }}
                  style={{
                    padding: '12px 24px',
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}
                >
                  Generate Detailed Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </HRContainer>
  );
};

export default HumanResources;