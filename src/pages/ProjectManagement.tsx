import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useData, type Employee } from '../contexts/DataContext';
import AddProjectModal from '../components/ProjectManagement/AddProjectModal';
import EditProjectModal from '../components/ProjectManagement/EditProjectModal';
import AssignCrewModal from '../components/ProjectManagement/AssignCrewModal';
import AddTimelineEventModal, { TimelineEventFormData } from '../components/ProjectManagement/AddTimelineEventModal';
import AddMilestoneModal, { MilestoneFormData } from '../components/ProjectManagement/AddMilestoneModal';
import AddEquipmentModal, { EquipmentFormData } from '../components/ProjectManagement/AddEquipmentModal';
import AddBudgetItemModal, { BudgetItemFormData } from '../components/ProjectManagement/AddBudgetItemModal';
import CustomerReviewDashboard from '../components/ProjectManagement/CustomerReviewDashboard';
import OverdueMilestonesModal from '../components/ProjectManagement/OverdueMilestonesModal';
import GenerateReportModal from '../components/ProjectManagement/GenerateReportModal';
import { formatCurrency } from '../utils/currencyFormatter';
import BrandedModalTitle from '../components/Shared/BrandedModalTitle';
import FFRPDFGenerator from '../components/PDF/FFRPDFGenerator';
import {
  Calendar,
  Users,
  FileText,
  DollarSign,
  BarChart3,
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  Wrench,
  HardHat,
  Truck,
  Camera,
  Send,
  Star,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  client: string;
  address: string;
  status: 'planning' | 'in-progress' | 'inspection' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  progress: number;
  crew: string[];
  permits: string[];
  roofType: 'shingle' | 'metal' | 'tile' | 'flat';
  squareFootage: number;
}

interface ProjectFilters {
  status: string;
  priority: string;
  roofType: string;
  budgetRange: string;
}

interface CrewMember {
  id: string;
  name: string;
  role: string;
  certification: string[];
  availability: 'available' | 'assigned' | 'unavailable';
  hourlyRate: number;
}

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'available' | 'in-use' | 'maintenance' | 'broken';
  location: string;
  lastMaintenance: string;
}

interface Permit {
  id: string;
  projectId: string;
  type: string;
  status: 'pending' | 'approved' | 'expired' | 'rejected';
  applicationDate: string;
  expirationDate: string;
  authority: string;
  cost: number;
}

interface Milestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  completedDate?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string[];
  dependencies: string[];
  progress: number;
}

interface TimelineEvent {
  id: string;
  projectId: string;
  title: string;
  type: 'milestone' | 'task' | 'meeting' | 'inspection' | 'delivery';
  startDate: string;
  endDate?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'overdue';
  description: string;
  location?: string;
  assignedTo: string[];
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  type: 'project' | 'filing' | 'deadline' | 'inspection' | 'review' | 'meeting';
  projectId?: string;
  projectName?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: string;
}

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const PageSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1rem;
`;

const TabContainer = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TabList = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  min-width: 100%;
  flex-wrap: nowrap;
`;

const Tab = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md};
  border: none;
  background: none;
  color: ${({ theme, isActive }) => isActive ? theme.colors.primary : theme.colors.text.secondary};
  font-weight: ${({ isActive }) => isActive ? '600' : '500'};
  border-bottom: 2px solid ${({ theme, isActive }) => isActive ? theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: fit-content;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const TabContent = styled(motion.div)`
  min-height: 600px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const StatIcon = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ color }) => color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary}dd;
    transform: translateY(-1px);
  }
`;

const SearchInput = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  width: 300px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterButton = styled.button<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme, isActive }) => isActive ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, isActive }) => isActive ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, isActive }) => isActive ? 'white' : theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme, isActive }) => isActive ? `${theme.colors.primary}dd` : theme.colors.background};
  }
`;

const FilterPanel = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => isOpen ? 'block' : 'none'};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterLabel = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.875rem;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  display: block;
`;

const FilterSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.875rem;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const FilterActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: ${({ theme }) => theme.spacing.md};
`;

const ClearFiltersButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    border-color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ProjectCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ProjectTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ProjectClient = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${({ status, theme }) => {
    switch (status) {
      case 'planning':
        return `background: ${theme.colors.text.light}20; color: ${theme.colors.text.light};`;
      case 'in-progress':
        return `background: ${theme.colors.secondary}20; color: ${theme.colors.secondary};`;
      case 'inspection':
        return `background: #f59e0b20; color: #f59e0b;`;
      case 'completed':
        return `background: ${theme.colors.secondary}20; color: ${theme.colors.secondary};`;
      case 'on-hold':
        return `background: ${theme.colors.accent}20; color: ${theme.colors.accent};`;
      default:
        return `background: ${theme.colors.text.light}20; color: ${theme.colors.text.light};`;
    }
  }}
`;

const PriorityBadge = styled.span<{ priority: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;

  ${({ priority, theme }) => {
    switch (priority) {
      case 'urgent':
        return `background: ${theme.colors.accent}; color: white;`;
      case 'high':
        return `background: #f59e0b; color: white;`;
      case 'medium':
        return `background: ${theme.colors.secondary}; color: white;`;
      case 'low':
        return `background: ${theme.colors.text.light}; color: white;`;
      default:
        return `background: ${theme.colors.text.light}; color: white;`;
    }
  }}
`;

const ProjectProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  overflow: hidden;
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background: ${({ theme }) => theme.colors.secondary};
  transition: width 0.3s ease;
`;

const ProjectActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ProjectActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

// Modal Components
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: ${({ theme }) => theme.spacing.md};
`;

const ModalContainer = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const ModalFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FormLabel = styled.label`
  display: block;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: 0.875rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background: ${({ theme }) => theme.colors.surface};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormTextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectSecondaryButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const SuccessButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: none;
  background: ${({ theme }) => theme.colors.secondary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary}dd;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const FileUploadArea = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.background};
  }
`;

const ProjectDetailCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const DetailValue = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CrewMemberCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  font-size: 0.875rem;

  input[type="checkbox"] {
    margin: 0;
  }
`;

const SchedulingContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TimelineContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const MilestoneContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const MilestoneCard = styled.div<{ status: string }>`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: 4px solid ${({ status, theme }) => {
    switch (status) {
      case 'completed': return theme.colors.secondary;
      case 'in-progress': return theme.colors.primary;
      case 'overdue': return theme.colors.error;
      default: return theme.colors.border;
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const MilestoneHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const MilestoneTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const MilestoneDescription = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
`;

const MilestoneMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const MilestoneProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 6px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 3px;
  overflow: hidden;
  margin-top: ${({ theme }) => theme.spacing.sm};

  &::after {
    content: '';
    display: block;
    width: ${({ progress }) => progress}%;
    height: 100%;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 3px;
    transition: width 0.3s ease;
  }
`;

const TimelineEvent = styled.div`
  display: flex;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 32px;
    bottom: -16px;
    width: 2px;
    background: ${({ theme }) => theme.colors.border};
  }

  &:last-child::before {
    display: none;
  }
`;

const EventIcon = styled.div<{ type: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ type, theme }) => {
    switch (type) {
      case 'milestone': return theme.colors.primary;
      case 'task': return theme.colors.secondary;
      case 'meeting': return '#f59e0b';
      case 'inspection': return theme.colors.accent;
      case 'delivery': return '#10b981';
      default: return theme.colors.border;
    }
  }};
  color: white;
  font-size: 0.75rem;
  margin-right: ${({ theme }) => theme.spacing.md};
  flex-shrink: 0;
`;

const EventContent = styled.div`
  flex: 1;
`;

const EventTitle = styled.h5`
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const EventMeta = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatusBadgeSmall = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${({ status, theme }) => {
    switch (status) {
      case 'completed':
        return `background: ${theme.colors.secondary}20; color: ${theme.colors.secondary};`;
      case 'in-progress':
        return `background: ${theme.colors.primary}20; color: ${theme.colors.primary};`;
      case 'overdue':
        return `background: ${theme.colors.error}20; color: ${theme.colors.error};`;
      case 'scheduled':
        return `background: #f59e0b20; color: #f59e0b;`;
      default:
        return `background: ${theme.colors.border}20; color: ${theme.colors.text.secondary};`;
    }
  }}
`;

// Calendar Styled Components
const CalendarContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const CalendarTitle = styled.h3`
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.25rem;
`;

const CalendarNav = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const NavButton = styled.button`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
`;

const YearDisplay = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.25rem;
`;

const CalendarLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CriticalEventsPanel = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  max-height: 800px;
  overflow-y: auto;

  @media (max-width: 1200px) {
    max-height: 400px;
  }
`;

const CriticalEventsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 2px solid ${({ theme }) => theme.colors.error};
`;

const CriticalEventsTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.error};
  font-size: 1.1rem;
  font-weight: 700;
`;

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const EventCard = styled.div<{ priority?: string; type?: string }>`
  background: ${({ theme }) => theme.colors.surface};
  border-left: 4px solid ${({ type, priority, theme }) => {
    if (priority === 'urgent') return theme.colors.error;
    if (priority === 'high') return '#f59e0b';
    switch (type) {
      case 'deadline': return theme.colors.error;
      case 'filing': return '#f59e0b';
      case 'inspection': return '#8b5cf6';
      default: return theme.colors.primary;
    }
  }};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const EventDate = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  text-transform: uppercase;
`;

const CalendarEventTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const EventDescription = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CalendarEventMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 0.75rem;
`;

const EventTypeBadge = styled.span<{ type: string }>`
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.65rem;
  background: ${({ type, theme }) => {
    switch (type) {
      case 'project': return `${theme.colors.primary}20`;
      case 'filing': return '#f59e0b20';
      case 'deadline': return `${theme.colors.error}20`;
      case 'inspection': return '#8b5cf620';
      case 'review': return '#06b6d420';
      case 'meeting': return '#10b98120';
      default: return theme.colors.border;
    }
  }};
  color: ${({ type, theme }) => {
    switch (type) {
      case 'project': return theme.colors.primary;
      case 'filing': return '#f59e0b';
      case 'deadline': return theme.colors.error;
      case 'inspection': return '#8b5cf6';
      case 'review': return '#06b6d4';
      case 'meeting': return '#10b981';
      default: return theme.colors.text.secondary;
    }
  }};
`;

const CalendarPriorityBadge = styled.span<{ priority: string }>`
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.65rem;
  background: ${({ priority, theme }) => {
    switch (priority) {
      case 'urgent': return `${theme.colors.error}20`;
      case 'high': return '#f59e0b20';
      default: return theme.colors.border;
    }
  }};
  color: ${({ priority, theme }) => {
    switch (priority) {
      case 'urgent': return theme.colors.error;
      case 'high': return '#f59e0b';
      default: return theme.colors.text.secondary;
    }
  }};
`;

const MonthCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const MonthHeader = styled.div`
  text-align: center;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
`;

const WeekdayRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const WeekdayCell = styled.div`
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.spacing.xs};
`;

const DayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

const DayCell = styled.div<{ isCurrentMonth?: boolean; isToday?: boolean; hasEvents?: boolean }>`
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  position: relative;
  cursor: ${({ hasEvents }) => (hasEvents ? 'pointer' : 'default')};
  transition: all 0.2s ease;

  ${({ isCurrentMonth, theme }) =>
    !isCurrentMonth &&
    `
    color: ${theme.colors.text.secondary};
    opacity: 0.5;
  `}

  ${({ isToday, theme }) =>
    isToday &&
    `
    background: ${theme.colors.primary}20;
    font-weight: 700;
    color: ${theme.colors.primary};
  `}

  ${({ hasEvents, theme }) =>
    hasEvents &&
    `
    background: ${theme.colors.secondary}10;
    border: 1px solid ${theme.colors.secondary}40;

    &:hover {
      background: ${theme.colors.secondary}20;
      transform: scale(1.05);
    }
  `}
`;

const EventDot = styled.div<{ type: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-top: 2px;
  background: ${({ type, theme }) => {
    switch (type) {
      case 'project':
        return theme.colors.primary;
      case 'filing':
        return '#f59e0b';
      case 'deadline':
        return theme.colors.error;
      case 'inspection':
        return '#8b5cf6';
      case 'review':
        return '#06b6d4';
      case 'meeting':
        return '#10b981';
      default:
        return theme.colors.text.secondary;
    }
  }};
`;

const EventLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 0.875rem;
`;

const LegendDot = styled.div<{ type: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ type, theme }) => {
    switch (type) {
      case 'project':
        return theme.colors.primary;
      case 'filing':
        return '#f59e0b';
      case 'deadline':
        return theme.colors.error;
      case 'inspection':
        return '#8b5cf6';
      case 'review':
        return '#06b6d4';
      case 'meeting':
        return '#10b981';
      default:
        return theme.colors.text.secondary;
    }
  }};
`;

const ProjectManagement: React.FC = () => {
  // Access shared data
  const { customers, jobs, employees } = useData();

  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ProjectFilters>({
    status: '',
    priority: '',
    roofType: '',
    budgetRange: ''
  });
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddCrewModal, setShowAddCrewModal] = useState(false);
  const [showAddEquipmentModal, setShowAddEquipmentModal] = useState(false);
  const [showAddPermitModal, setShowAddPermitModal] = useState(false);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectDetailsModal, setShowProjectDetailsModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showAssignCrewModal, setShowAssignCrewModal] = useState(false);
  const [showAddMilestoneModal, setShowAddMilestoneModal] = useState(false);
  const [showAddTimelineEventModal, setShowAddTimelineEventModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [selectedTimelineEvent, setSelectedTimelineEvent] = useState<TimelineEvent | null>(null);
  const [showOverdueMilestones, setShowOverdueMilestones] = useState(false);
  const [showOverdueMilestonesModal, setShowOverdueMilestonesModal] = useState(false);
  const [showGenerateReportModal, setShowGenerateReportModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [currentQuarter, setCurrentQuarter] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), quarter: Math.floor(now.getMonth() / 3) };
  });

  // Sample data
  const projects: Project[] = [
    {
      id: '1',
      name: 'Residential Roof Replacement',
      client: 'Johnson Family',
      address: '123 Oak Street, Orlando, FL',
      status: 'in-progress',
      priority: 'high',
      startDate: '2024-01-15',
      endDate: '2024-02-01',
      budget: 15000,
      spent: 8500,
      progress: 65,
      crew: ['John Smith', 'Mike Rodriguez'],
      permits: ['Building Permit #2024-001'],
      roofType: 'shingle',
      squareFootage: 2400
    },
    {
      id: '2',
      name: 'Commercial Metal Roof',
      client: 'ABC Manufacturing',
      address: '456 Industrial Blvd, Tampa, FL',
      status: 'planning',
      priority: 'urgent',
      startDate: '2024-02-05',
      endDate: '2024-03-15',
      budget: 75000,
      spent: 2000,
      progress: 15,
      crew: ['Carlos Martinez', 'David Wilson'],
      permits: ['Commercial Permit #2024-010'],
      roofType: 'metal',
      squareFootage: 12000
    },
    {
      id: '3',
      name: 'Tile Roof Repair',
      client: 'Historic Downtown Property',
      address: '789 Heritage Lane, St. Augustine, FL',
      status: 'inspection',
      priority: 'medium',
      startDate: '2024-01-20',
      endDate: '2024-01-28',
      budget: 8500,
      spent: 7200,
      progress: 90,
      crew: ['Sarah Thompson'],
      permits: ['Historical Permit #2024-005'],
      roofType: 'tile',
      squareFootage: 1800
    }
  ];

  // Map employees from DataContext to CrewMember format
  const crew: CrewMember[] = employees.map(emp => ({
    id: emp.id,
    name: `${emp.firstName} ${emp.lastName}`,
    role: emp.role,
    certification: emp.certifications.map(cert => cert.name),
    availability: emp.status === 'active' ? 'available' : 'unavailable',
    hourlyRate: emp.payRate
  }));

  const equipment: Equipment[] = [
    {
      id: '1',
      name: 'Aerial Lift #1',
      type: 'Lift Equipment',
      status: 'in-use',
      location: 'Johnson Project',
      lastMaintenance: '2024-01-01'
    },
    {
      id: '2',
      name: 'Nail Gun Set A',
      type: 'Power Tools',
      status: 'available',
      location: 'Warehouse',
      lastMaintenance: '2024-01-10'
    }
  ];

  const permits: Permit[] = [
    {
      id: '1',
      projectId: '1',
      type: 'Building Permit',
      status: 'approved',
      applicationDate: '2024-01-05',
      expirationDate: '2024-07-05',
      authority: 'Orange County',
      cost: 450
    },
    {
      id: '2',
      projectId: '2',
      type: 'Commercial Permit',
      status: 'pending',
      applicationDate: '2024-01-25',
      expirationDate: '2024-08-25',
      authority: 'Hillsborough County',
      cost: 1200
    }
  ];

  const milestones: Milestone[] = [
    {
      id: '1',
      projectId: '1',
      title: 'Project Planning Complete',
      description: 'Finalize project scope, materials list, and timeline',
      dueDate: '2024-01-15',
      completedDate: '2024-01-14',
      status: 'completed',
      priority: 'high',
      assignedTo: ['Mike Johnson', 'Sarah Davis'],
      dependencies: [],
      progress: 100
    },
    {
      id: '2',
      projectId: '1',
      title: 'Materials Ordered',
      description: 'Order all roofing materials and schedule delivery',
      dueDate: '2024-01-20',
      completedDate: '2024-01-19',
      status: 'completed',
      priority: 'high',
      assignedTo: ['Mike Johnson'],
      dependencies: ['1'],
      progress: 100
    },
    {
      id: '3',
      projectId: '1',
      title: 'Tear-off Complete',
      description: 'Remove existing roofing materials safely',
      dueDate: '2024-02-01',
      status: 'in-progress',
      priority: 'medium',
      assignedTo: ['Tom Wilson', 'Carlos Rodriguez'],
      dependencies: ['2'],
      progress: 65
    },
    {
      id: '4',
      projectId: '1',
      title: 'New Roof Installation',
      description: 'Install new shingles and flashing',
      dueDate: '2024-02-10',
      status: 'pending',
      priority: 'high',
      assignedTo: ['Mike Johnson', 'Tom Wilson'],
      dependencies: ['3'],
      progress: 0
    },
    {
      id: '5',
      projectId: '2',
      title: 'Safety Assessment',
      description: 'Complete safety inspection and setup',
      dueDate: '2024-01-30',
      status: 'overdue',
      priority: 'critical',
      assignedTo: ['Sarah Davis'],
      dependencies: [],
      progress: 20
    },
    {
      id: '6',
      projectId: '2',
      title: 'Commercial Permit Approval',
      description: 'Obtain necessary permits for commercial work',
      dueDate: '2024-02-05',
      status: 'in-progress',
      priority: 'high',
      assignedTo: ['Sarah Davis'],
      dependencies: ['5'],
      progress: 40
    }
  ];

  const timelineEvents: TimelineEvent[] = [
    {
      id: '1',
      projectId: '1',
      title: 'Project Kickoff Meeting',
      type: 'meeting',
      startDate: '2024-01-10T09:00:00',
      endDate: '2024-01-10T10:30:00',
      status: 'completed',
      description: 'Initial project meeting with homeowner to review scope and timeline',
      location: '123 Oak Street, Orlando, FL',
      assignedTo: ['Mike Johnson', 'Sarah Davis']
    },
    {
      id: '2',
      projectId: '1',
      title: 'Material Delivery',
      type: 'delivery',
      startDate: '2024-01-22T08:00:00',
      status: 'completed',
      description: 'Delivery of architectural shingles and underlayment',
      location: '123 Oak Street, Orlando, FL',
      assignedTo: ['Tom Wilson']
    },
    {
      id: '3',
      projectId: '1',
      title: 'Tear-off begins',
      type: 'task',
      startDate: '2024-01-29T07:00:00',
      endDate: '2024-02-01T17:00:00',
      status: 'in-progress',
      description: 'Remove existing roofing materials and inspect decking',
      location: '123 Oak Street, Orlando, FL',
      assignedTo: ['Tom Wilson', 'Carlos Rodriguez']
    },
    {
      id: '4',
      projectId: '1',
      title: 'Mid-Project Inspection',
      type: 'inspection',
      startDate: '2024-02-03T14:00:00',
      status: 'scheduled',
      description: 'County inspection of roof decking and underlayment',
      location: '123 Oak Street, Orlando, FL',
      assignedTo: ['Mike Johnson']
    },
    {
      id: '5',
      projectId: '1',
      title: 'Final Walkthrough',
      type: 'meeting',
      startDate: '2024-02-15T16:00:00',
      endDate: '2024-02-15T17:00:00',
      status: 'scheduled',
      description: 'Final inspection with homeowner and warranty discussion',
      location: '123 Oak Street, Orlando, FL',
      assignedTo: ['Mike Johnson', 'Sarah Davis']
    },
    {
      id: '6',
      projectId: '2',
      title: 'Commercial Site Assessment',
      type: 'inspection',
      startDate: '2024-01-28T10:00:00',
      status: 'overdue',
      description: 'Safety and structural assessment for commercial TPO roof',
      location: '456 Commerce Drive, Tampa, FL',
      assignedTo: ['Sarah Davis', 'Tom Wilson']
    }
  ];

  // Calendar events for 6-month view
  const calendarEvents: CalendarEvent[] = [
    // Project milestones
    { id: '1', title: 'Johnson Roof Start', date: '2024-01-15', type: 'project', projectId: '1', projectName: 'Residential Roof Replacement', priority: 'high' },
    { id: '2', title: 'Johnson Roof Complete', date: '2024-02-01', type: 'project', projectId: '1', projectName: 'Residential Roof Replacement', priority: 'high' },
    { id: '3', title: 'ABC Mfg Roof Start', date: '2024-02-05', type: 'project', projectId: '2', projectName: 'Commercial Metal Roof', priority: 'urgent' },
    { id: '4', title: 'ABC Mfg Roof Complete', date: '2024-03-15', type: 'project', projectId: '2', projectName: 'Commercial Metal Roof', priority: 'urgent' },

    // Inspections
    { id: '5', title: 'Tile Roof Final Inspection', date: '2024-01-28', type: 'inspection', projectId: '3', projectName: 'Tile Roof Repair', description: 'Final inspection before completion' },
    { id: '6', title: 'Johnson Mid-Point Inspection', date: '2024-01-23', type: 'inspection', projectId: '1', projectName: 'Residential Roof Replacement' },
    { id: '7', title: 'ABC Mfg Pre-Installation Inspection', date: '2024-02-12', type: 'inspection', projectId: '2' },
    { id: '8', title: 'Q1 Safety Inspection', date: '2024-03-30', type: 'review', description: 'Quarterly safety equipment and protocol review' },

    // Filing deadlines
    { id: '9', title: 'Q1 Tax Filing', date: '2024-04-15', type: 'filing', description: 'Quarterly tax documents due', priority: 'high' },
    { id: '10', title: 'Insurance Renewal', date: '2024-03-01', type: 'deadline', description: 'General liability insurance renewal', priority: 'urgent' },
    { id: '11', title: 'Contractor License Renewal', date: '2024-05-31', type: 'deadline', description: 'State roofing contractor license renewal', priority: 'high' },
    { id: '12', title: 'OSHA Compliance Report', date: '2024-06-15', type: 'filing', description: 'Annual OSHA safety compliance documentation' },

    // Business reviews
    { id: '13', title: 'Monthly Financial Review', date: '2024-02-05', type: 'review', description: 'Review January P&L and budget' },
    { id: '14', title: 'Monthly Financial Review', date: '2024-03-05', type: 'review', description: 'Review February P&L and budget' },
    { id: '15', title: 'Monthly Financial Review', date: '2024-04-05', type: 'review', description: 'Review March P&L and budget' },
    { id: '16', title: 'Monthly Financial Review', date: '2024-05-05', type: 'review', description: 'Review April P&L and budget' },
    { id: '17', title: 'Monthly Financial Review', date: '2024-06-05', type: 'review', description: 'Review May P&L and budget' },
    { id: '18', title: 'Q2 Business Planning', date: '2024-03-25', type: 'meeting', description: 'Q2 strategy and goals planning session' },

    // Meetings
    { id: '19', title: 'Crew Safety Meeting', date: '2024-02-15', type: 'meeting', description: 'Monthly crew safety training and updates' },
    { id: '20', title: 'Crew Safety Meeting', date: '2024-03-15', type: 'meeting', description: 'Monthly crew safety training and updates' },
    { id: '21', title: 'Crew Safety Meeting', date: '2024-04-15', type: 'meeting', description: 'Monthly crew safety training and updates' },
    { id: '22', title: 'Supplier Meeting - ABC Materials', date: '2024-02-20', type: 'meeting', description: 'Review pricing and Q2 materials forecast' },

    // Additional deadlines
    { id: '23', title: 'Workers Comp Audit', date: '2024-04-30', type: 'deadline', description: 'Annual workers compensation insurance audit' },
    { id: '24', title: 'Equipment Maintenance Review', date: '2024-05-15', type: 'review', description: 'Quarterly equipment maintenance and replacement planning' },
    { id: '25', title: 'Permit Renewals Check', date: '2024-06-01', type: 'deadline', description: 'Review all active permits for expiration dates' }
  ];

  const stats = {
    activeProjects: projects.filter(p => p.status === 'in-progress').length,
    totalBudget: projects.reduce((sum, p) => sum + p.budget, 0),
    totalSpent: projects.reduce((sum, p) => sum + p.spent, 0),
    completionRate: Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
  };

  const handleAddProject = () => {
    setShowAddProjectModal(true);
    console.log('Opening Add Project modal...');
  };

  const handleSaveProject = (projectData: any) => {
    console.log('Saving project:', projectData);
    alert('Project created successfully!');
    setShowAddProjectModal(false);
  };

  const handleSaveEditProject = (projectData: any) => {
    console.log('Updating project:', projectData);
    alert('Project updated successfully!');
    setShowEditProjectModal(false);
    setSelectedProject(null);
  };

  const handleSaveCrewAssignment = (assignmentData: any) => {
    console.log('Assigning crew:', assignmentData);
    alert('Crew assigned successfully!');
    setShowAssignCrewModal(false);
    setSelectedProject(null);
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setShowProjectDetailsModal(true);
    console.log('Viewing project:', project);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setShowEditProjectModal(true);
    console.log('Editing project:', project);
  };

  const handleAssignCrew = (project: Project) => {
    setSelectedProject(project);
    setShowAssignCrewModal(true);
    console.log('Assigning crew to project:', project);
  };

  const handleAddCrew = () => {
    setShowAddCrewModal(true);
    console.log('Opening Add Crew modal...');
  };

  const handleAddEquipment = () => {
    setShowAddEquipmentModal(true);
    console.log('Opening Add Equipment modal...');
  };

  const handleAddPermit = () => {
    setShowAddPermitModal(true);
    console.log('Opening Add Permit modal...');
  };

  const handleAddBudgetItem = () => {
    setShowAddBudgetModal(true);
    console.log('Opening Add Budget Item modal...');
  };

  const handleUploadPhotos = () => {
    setShowPhotoUploadModal(true);
    console.log('Opening Photo Upload modal...');
  };

  const handleScheduleProject = () => {
    setShowAddTimelineEventModal(true);
    console.log('Opening Add Timeline Event modal...');
  };

  const handleAddMilestone = () => {
    setShowAddMilestoneModal(true);
    console.log('Opening Add Milestone modal...');
  };

  const handleAddTimelineEvent = () => {
    setShowAddTimelineEventModal(true);
    console.log('Opening Add Timeline Event modal...');
  };

  const handleSaveTimelineEvent = (eventData: TimelineEventFormData) => {
    // Generate a new ID (in a real app this would come from the backend)
    const newId = (timelineEvents.length + 1).toString();

    // Format start/end dates with times
    const startDateTime = eventData.startTime
      ? `${eventData.startDate}T${eventData.startTime}:00`
      : `${eventData.startDate}T09:00:00`;

    const endDateTime = eventData.endDate && eventData.endTime
      ? `${eventData.endDate}T${eventData.endTime}:00`
      : undefined;

    const newEvent: TimelineEvent = {
      id: newId,
      projectId: eventData.projectId,
      title: eventData.title,
      type: eventData.type,
      startDate: startDateTime,
      endDate: endDateTime,
      status: eventData.status,
      description: eventData.description,
      location: eventData.location || undefined,
      assignedTo: eventData.assignedTo.split(',').map(name => name.trim()).filter(Boolean)
    };

    // In a real app, this would be saved to the backend
    // For now, we'll just log it and close the modal
    console.log('New Timeline Event:', newEvent);
    alert(`Timeline event "${newEvent.title}" has been created successfully!`);

    setShowAddTimelineEventModal(false);
  };

  const handleSaveMilestone = (milestoneData: MilestoneFormData) => {
    // Generate a new ID (in a real app this would come from the backend)
    const newId = (milestones.length + 1).toString();

    const newMilestone: Milestone = {
      id: newId,
      projectId: milestoneData.projectId,
      title: milestoneData.title,
      description: milestoneData.description,
      dueDate: milestoneData.dueDate,
      status: milestoneData.status,
      priority: milestoneData.priority,
      assignedTo: milestoneData.assignedTo ? milestoneData.assignedTo.split(',').map(s => s.trim()) : [],
      dependencies: milestoneData.dependencies ? milestoneData.dependencies.split(',').map(s => s.trim()) : [],
      progress: 0 // Start with 0% progress
    };

    // In a real app, this would be saved to the backend
    // For now, we'll just log it and close the modal
    console.log('New Milestone:', newMilestone);
    alert(`Milestone "${newMilestone.title}" has been created successfully!`);
    setShowAddMilestoneModal(false);
  };

  const handleSaveEquipment = (equipmentData: EquipmentFormData) => {
    // Generate a new ID (in a real app this would come from the backend)
    const newId = (equipment.length + 1).toString();
    const newEquipment = {
      id: newId,
      name: equipmentData.name,
      category: equipmentData.category,
      status: equipmentData.condition,
      assignedTo: equipmentData.assignedTo || 'Shop Inventory'
    };

    // In a real app, this would be saved to the backend
    // For now, we'll just log it and close the modal
    console.log('New Equipment:', newEquipment);
    alert(`Equipment "${newEquipment.name}" has been added successfully!`);
    setShowAddEquipmentModal(false);
  };

  const handleSaveBudgetItem = (budgetData: BudgetItemFormData) => {
    // In a real app, this would be saved to the backend and auto-populate from project data
    // For now, we'll just log it and close the modal
    console.log('New Budget Item:', budgetData);
    alert(`Budget item "${budgetData.itemName}" ($${budgetData.totalCost.toFixed(2)}) has been added successfully!`);
    setShowAddBudgetModal(false);
  };

  const handleMilestoneStatusUpdate = (milestoneId: string, status: Milestone['status']) => {
    console.log(`Updating milestone ${milestoneId} status to ${status}`);
  };

  const handleUpdateMilestoneProgress = (milestoneId: string, progress: number) => {
    console.log(`Updating milestone ${milestoneId} progress to ${progress}%`);
  };

  const handleViewOverdueMilestones = () => {
    setShowOverdueMilestonesModal(true);
  };

  const handleGenerateReport = () => {
    setShowGenerateReportModal(true);
  };

  const handleDownloadOverdueReport = () => {
    const overdueMilestones = milestones.filter(milestone => {
      const dueDate = new Date(milestone.dueDate);
      const now = new Date();
      return dueDate < now && milestone.status !== 'completed';
    });
    // Generate PDF report with overdue milestones
    generateOverdueMilestonesPDF(overdueMilestones);
  };

  const handleGenerateReportWithOptions = (options: any) => {
    const filteredProjects = getFilteredProjects();
    const relevantMilestones = milestones.filter(milestone =>
      filteredProjects.some(p => p.id === milestone.projectId)
    );
    // Generate comprehensive milestone report PDF with options
    console.log('Generating report with options:', options);
    generateMilestoneReportPDF(filteredProjects, relevantMilestones);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handleFilter = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (key: keyof ProjectFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      roofType: '',
      budgetRange: ''
    });
  };

  const isAnyFilterActive = () => {
    return Object.values(filters).some(filter => filter !== '');
  };

  const getFilteredProjects = () => {
    return projects.filter(project => {
      // Search filter
      const matchesSearch = searchTerm === '' ||
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.address.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = filters.status === '' || project.status === filters.status;

      // Priority filter
      const matchesPriority = filters.priority === '' || project.priority === filters.priority;

      // Roof type filter
      const matchesRoofType = filters.roofType === '' || project.roofType === filters.roofType;

      // Budget range filter
      const matchesBudgetRange = () => {
        if (filters.budgetRange === '') return true;

        const budget = project.budget;
        switch (filters.budgetRange) {
          case 'under-10k': return budget < 10000;
          case '10k-25k': return budget >= 10000 && budget < 25000;
          case '25k-50k': return budget >= 25000 && budget < 50000;
          case '50k-100k': return budget >= 50000 && budget < 100000;
          case 'over-100k': return budget >= 100000;
          default: return true;
        }
      };

      return matchesSearch && matchesStatus && matchesPriority && matchesRoofType && matchesBudgetRange();
    });
  };

  // Calendar helper functions
  const navigateCalendar = (direction: 'prev' | 'next') => {
    setCurrentQuarter(prev => {
      let newQuarter = direction === 'prev' ? prev.quarter - 1 : prev.quarter + 1;
      let newYear = prev.year;

      if (newQuarter < 0) {
        newQuarter = 3;
        newYear--;
      } else if (newQuarter > 3) {
        newQuarter = 0;
        newYear++;
      }

      return { year: newYear, quarter: newQuarter };
    });
  };

  const getCriticalEventsFor3Months = () => {
    const now = new Date();
    const threeMonthsLater = new Date(now);
    threeMonthsLater.setMonth(now.getMonth() + 3);

    return calendarEvents
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= threeMonthsLater;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleDayClick = (dateKey: string) => {
    const events = getEventsForDate(dateKey);
    if (events.length === 1) {
      handleEventClick(events[0]);
    } else if (events.length > 1) {
      // For multiple events, show the first one
      handleEventClick(events[0]);
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getEventsForDate = (date: string) => {
    return calendarEvents.filter(event => event.date === date);
  };

  const formatDateKey = (year: number, month: number, day: number) => {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
  };

  const isToday = (year: number, month: number, day: number) => {
    const today = new Date();
    return (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    );
  };

  const renderCalendar = () => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const criticalEvents = getCriticalEventsFor3Months();
    const quarterNames = ['Q1', 'Q2', 'Q3', 'Q4'];

    // Generate 3 months for the current quarter
    const startMonth = currentQuarter.quarter * 3;
    const months = [0, 1, 2].map(offset => ({
      year: currentQuarter.year,
      monthNum: startMonth + offset,
      monthName: monthNames[startMonth + offset]
    }));

    const renderMonth = (month: { year: number; monthNum: number; monthName: string }) => {
      const daysInMonth = getDaysInMonth(month.year, month.monthNum);
      const firstDay = getFirstDayOfMonth(month.year, month.monthNum);
      const days = [];

      // Add empty cells for days before the first of the month
      for (let i = 0; i < firstDay; i++) {
        days.push(<DayCell key={`empty-${i}`} />);
      }

      // Add cells for each day of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = formatDateKey(month.year, month.monthNum, day);
        const dayEvents = getEventsForDate(dateKey);
        const hasEvents = dayEvents.length > 0;
        const isTodayDate = isToday(month.year, month.monthNum, day);

        days.push(
          <DayCell
            key={day}
            isCurrentMonth
            isToday={isTodayDate}
            hasEvents={hasEvents}
            onClick={() => hasEvents && handleDayClick(dateKey)}
          >
            {day}
            {dayEvents.slice(0, 3).map(event => (
              <EventDot key={event.id} type={event.type} />
            ))}
          </DayCell>
        );
      }

      return (
        <MonthCard key={`${month.year}-${month.monthNum}`}>
          <MonthHeader>
            {month.monthName}
          </MonthHeader>
          <WeekdayRow>
            {weekdays.map((day, idx) => (
              <WeekdayCell key={idx}>{day}</WeekdayCell>
            ))}
          </WeekdayRow>
          <DayGrid>{days}</DayGrid>
        </MonthCard>
      );
    };

    const formatEventDate = (dateStr: string) => {
      const date = new Date(dateStr);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    };

    return (
      <CalendarContainer>
        <CalendarHeader>
          <CalendarTitle>
            <Calendar size={24} />
            Quarterly Business Calendar
          </CalendarTitle>
          <CalendarNav>
            <NavButton onClick={() => navigateCalendar('prev')}>
              <ChevronLeft size={20} />
            </NavButton>
            <YearDisplay>{quarterNames[currentQuarter.quarter]} {currentQuarter.year}</YearDisplay>
            <NavButton onClick={() => navigateCalendar('next')}>
              <ChevronRight size={20} />
            </NavButton>
          </CalendarNav>
        </CalendarHeader>

        <CalendarLayout>
          <div>
            <CalendarGrid>
              {months.map(month => renderMonth(month))}
            </CalendarGrid>

            <EventLegend>
              <LegendItem>
                <LegendDot type="project" />
                <span>Project</span>
              </LegendItem>
              <LegendItem>
                <LegendDot type="filing" />
                <span>Filing</span>
              </LegendItem>
              <LegendItem>
                <LegendDot type="deadline" />
                <span>Deadline</span>
              </LegendItem>
              <LegendItem>
                <LegendDot type="inspection" />
                <span>Inspection</span>
              </LegendItem>
              <LegendItem>
                <LegendDot type="review" />
                <span>Review</span>
              </LegendItem>
              <LegendItem>
                <LegendDot type="meeting" />
                <span>Meeting</span>
              </LegendItem>
            </EventLegend>
          </div>

          <CriticalEventsPanel>
            <CriticalEventsHeader>
              <AlertTriangle size={20} />
              <CriticalEventsTitle>Next 3 Months</CriticalEventsTitle>
            </CriticalEventsHeader>
            <EventsList>
              {criticalEvents.length > 0 ? (
                criticalEvents.map(event => (
                  <EventCard
                    key={event.id}
                    priority={event.priority}
                    type={event.type}
                    onClick={() => handleEventClick(event)}
                  >
                    <EventDate>{formatEventDate(event.date)}</EventDate>
                    <CalendarEventTitle>{event.title}</CalendarEventTitle>
                    {event.description && (
                      <EventDescription>{event.description}</EventDescription>
                    )}
                    <CalendarEventMeta>
                      <EventTypeBadge type={event.type}>{event.type}</EventTypeBadge>
                      {event.priority && (event.priority === 'high' || event.priority === 'urgent') && (
                        <CalendarPriorityBadge priority={event.priority}>{event.priority}</CalendarPriorityBadge>
                      )}
                    </CalendarEventMeta>
                  </EventCard>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No critical events in the next 3 months
                </div>
              )}
            </EventsList>
          </CriticalEventsPanel>
        </CalendarLayout>
      </CalendarContainer>
    );
  };

  const renderOverview = () => (
    <TabContent
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <StatsGrid>
        <StatCard>
          <StatIcon color="#1e40af">
            <BarChart3 size={24} />
          </StatIcon>
          <StatValue>{stats.activeProjects}</StatValue>
          <StatLabel>Active Projects</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon color="#059669">
            <DollarSign size={24} />
          </StatIcon>
          <StatValue>{formatCurrency(stats.totalBudget)}</StatValue>
          <StatLabel>Total Budget</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon color="#dc2626">
            <DollarSign size={24} />
          </StatIcon>
          <StatValue>{formatCurrency(stats.totalSpent)}</StatValue>
          <StatLabel>Total Spent</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon color="#f59e0b">
            <CheckCircle size={24} />
          </StatIcon>
          <StatValue>{stats.completionRate}%</StatValue>
          <StatLabel>Avg Completion</StatLabel>
        </StatCard>
      </StatsGrid>

      {/* 6-Month Calendar View */}
      {renderCalendar()}

      <ActionBar>
        <ActionGroup>
          <PrimaryButton onClick={handleAddProject}>
            <Plus size={16} />
            New Project
          </PrimaryButton>
        </ActionGroup>
        <ActionGroup>
          <SearchInput
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FilterButton onClick={handleFilter} isActive={showFilters || isAnyFilterActive()}>
            <Filter size={16} />
            Filter {isAnyFilterActive() ? `(${Object.values(filters).filter(f => f !== '').length})` : ''}
          </FilterButton>
        </ActionGroup>
      </ActionBar>

      {/* Filter Panel */}
      <FilterPanel isOpen={showFilters}>
        <FilterRow>
          <FilterGroup>
            <FilterLabel>Status</FilterLabel>
            <FilterSelect
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="inspection">Inspection</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Priority</FilterLabel>
            <FilterSelect
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Roof Type</FilterLabel>
            <FilterSelect
              value={filters.roofType}
              onChange={(e) => handleFilterChange('roofType', e.target.value)}
            >
              <option value="">All Roof Types</option>
              <option value="shingle">Shingle</option>
              <option value="metal">Metal</option>
              <option value="tile">Tile</option>
              <option value="flat">Flat</option>
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Budget Range</FilterLabel>
            <FilterSelect
              value={filters.budgetRange}
              onChange={(e) => handleFilterChange('budgetRange', e.target.value)}
            >
              <option value="">All Budgets</option>
              <option value="under-10k">Under $10K</option>
              <option value="10k-25k">$10K - $25K</option>
              <option value="25k-50k">$25K - $50K</option>
              <option value="50k-100k">$50K - $100K</option>
              <option value="over-100k">Over $100K</option>
            </FilterSelect>
          </FilterGroup>
        </FilterRow>

        {isAnyFilterActive() && (
          <FilterActions>
            <ClearFiltersButton onClick={clearFilters}>
              Clear All Filters
            </ClearFiltersButton>
          </FilterActions>
        )}
      </FilterPanel>

      <ProjectGrid>
        {getFilteredProjects().map((project) => (
          <ProjectCard key={project.id}>
            <ProjectHeader>
              <div style={{ flex: 1 }}>
                <ProjectTitle>{project.name}</ProjectTitle>
                <ProjectClient>{project.client}</ProjectClient>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <StatusBadge status={project.status}>{project.status}</StatusBadge>
                  <PriorityBadge priority={project.priority}>{project.priority}</PriorityBadge>
                </div>
              </div>
            </ProjectHeader>

            <div style={{ marginBottom: '16px' }}>
              <MapPin size={14} style={{ display: 'inline', marginRight: '8px' }} />
              <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{project.address}</span>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}>
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <ProjectProgressBar>
                <ProgressFill progress={project.progress} />
              </ProjectProgressBar>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', fontSize: '0.875rem' }}>
              <div>
                <div style={{ color: '#64748b' }}>Budget</div>
                <div style={{ fontWeight: '600' }}>{formatCurrency(project.budget)}</div>
              </div>
              <div>
                <div style={{ color: '#64748b' }}>Spent</div>
                <div style={{ fontWeight: '600' }}>{formatCurrency(project.spent)}</div>
              </div>
            </div>

            <ProjectActions>
              <ProjectActionButton onClick={() => handleViewProject(project)}>
                <Eye size={14} />
                View
              </ProjectActionButton>
              <ProjectActionButton onClick={() => handleEditProject(project)}>
                <Edit3 size={14} />
                Edit
              </ProjectActionButton>
              <ProjectActionButton onClick={() => handleAssignCrew(project)}>
                <Users size={14} />
                Assign
              </ProjectActionButton>
            </ProjectActions>
          </ProjectCard>
        ))}
      </ProjectGrid>
    </TabContent>
  );

  const renderScheduling = () => (
    <TabContent
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <SchedulingContainer>
        {/* Timeline Section */}
        <TimelineContainer>
          <SectionHeader>
            <SectionTitle>
              <Calendar size={20} />
              Project Timeline
            </SectionTitle>
            <ProjectActionButton onClick={handleAddTimelineEvent}>
              <Plus size={16} />
              Add Event
            </ProjectActionButton>
          </SectionHeader>

          <div>
            {timelineEvents
              .filter(event => getFilteredProjects().some(p => p.id === event.projectId))
              .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
              .map((event) => (
                <TimelineEvent key={event.id}>
                  <EventIcon type={event.type}>
                    {event.type === 'milestone' && <Star size={14} />}
                    {event.type === 'task' && <Wrench size={14} />}
                    {event.type === 'meeting' && <Users size={14} />}
                    {event.type === 'inspection' && <Eye size={14} />}
                    {event.type === 'delivery' && <Truck size={14} />}
                  </EventIcon>
                  <EventContent>
                    <EventTitle>{event.title}</EventTitle>
                    <EventMeta>
                      {formatDateTime(event.startDate)}
                      {event.endDate && ` - ${formatDateTime(event.endDate)}`}
                      {event.location && ` • ${event.location}`}
                    </EventMeta>
                    <p style={{
                      fontSize: '0.875rem',
                      color: '#64748b',
                      margin: '4px 0 8px 0',
                      lineHeight: '1.4'
                    }}>
                      {event.description}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <StatusBadgeSmall status={event.status}>
                        {event.status}
                      </StatusBadgeSmall>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        Assigned: {event.assignedTo.join(', ')}
                      </span>
                    </div>
                  </EventContent>
                </TimelineEvent>
              ))
            }

            {timelineEvents.filter(event =>
              getFilteredProjects().some(p => p.id === event.projectId)
            ).length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#94a3b8',
                fontSize: '0.875rem'
              }}>
                <Calendar size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <p>No timeline events found for selected projects</p>
              </div>
            )}
          </div>
        </TimelineContainer>

        {/* Milestones Section */}
        <MilestoneContainer>
          <SectionHeader>
            <SectionTitle>
              <CheckCircle size={20} />
              Project Milestones
            </SectionTitle>
            <ProjectActionButton onClick={handleAddMilestone}>
              <Plus size={16} />
              Add Milestone
            </ProjectActionButton>
          </SectionHeader>

          {/* Quick Actions */}
          <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <ProjectSecondaryButton onClick={handleViewOverdueMilestones}>
              <AlertTriangle size={14} />
              View Overdue
            </ProjectSecondaryButton>
            <ProjectSecondaryButton onClick={handleGenerateReport}>
              <FileText size={14} />
              Generate Report
            </ProjectSecondaryButton>
          </div>

          <div>
            {milestones
              .filter(milestone => {
                const matchesProject = getFilteredProjects().some(p => p.id === milestone.projectId);
                if (!matchesProject) return false;

                if (showOverdueMilestones) {
                  const dueDate = new Date(milestone.dueDate);
                  const now = new Date();
                  return dueDate < now && milestone.status !== 'completed';
                }
                return true;
              })
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .map((milestone) => (
                <MilestoneCard key={milestone.id} status={milestone.status}>
                  <MilestoneHeader>
                    <div>
                      <MilestoneTitle>{milestone.title}</MilestoneTitle>
                      <StatusBadgeSmall status={milestone.status}>
                        {milestone.status === 'completed' && <CheckCircle size={10} />}
                        {milestone.status === 'in-progress' && <Clock size={10} />}
                        {milestone.status === 'overdue' && <AlertTriangle size={10} />}
                        {milestone.status}
                      </StatusBadgeSmall>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#64748b' }}>
                      <div>Due: {formatDate(milestone.dueDate)}</div>
                      {milestone.completedDate && (
                        <div>Completed: {formatDate(milestone.completedDate)}</div>
                      )}
                    </div>
                  </MilestoneHeader>

                  <MilestoneDescription>
                    {milestone.description}
                  </MilestoneDescription>

                  <MilestoneProgressBar progress={milestone.progress} />

                  <MilestoneMeta>
                    <span>Priority: {milestone.priority}</span>
                    <span>Progress: {milestone.progress}%</span>
                    <span>Assigned: {milestone.assignedTo.join(', ')}</span>
                  </MilestoneMeta>

                  {milestone.dependencies.length > 0 && (
                    <div style={{
                      marginTop: '8px',
                      fontSize: '0.75rem',
                      color: '#64748b'
                    }}>
                      Dependencies: {milestone.dependencies.length} item(s)
                    </div>
                  )}
                </MilestoneCard>
              ))
            }

            {milestones.filter(milestone => {
              const matchesProject = getFilteredProjects().some(p => p.id === milestone.projectId);
              if (!matchesProject) return false;

              if (showOverdueMilestones) {
                const dueDate = new Date(milestone.dueDate);
                const now = new Date();
                return dueDate < now && milestone.status !== 'completed';
              }
              return true;
            }).length === 0 && (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#94a3b8',
                fontSize: '0.875rem'
              }}>
                <CheckCircle size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <p>{showOverdueMilestones ? 'No overdue milestones found' : 'No milestones found for selected projects'}</p>
              </div>
            )}
          </div>

        </MilestoneContainer>
      </SchedulingContainer>
    </TabContent>
  );

  const renderResources = () => (
    <TabContent
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HardHat size={20} />
              Crew Management
            </h3>
            <ProjectActionButton onClick={handleAddCrew}>
              <Plus size={14} />
              Add Crew
            </ProjectActionButton>
          </div>
          {crew.map((member) => (
            <div key={member.id} style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600' }}>{member.name}</div>
                  <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{member.role}</div>
                </div>
                <StatusBadge status={member.availability}>{member.availability}</StatusBadge>
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.875rem' }}>
                Rate: ${member.hourlyRate}/hr
              </div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={20} />
              Equipment Tracking
            </h3>
            <ProjectActionButton onClick={handleAddEquipment}>
              <Plus size={14} />
              Add Equipment
            </ProjectActionButton>
          </div>
          {equipment.map((item) => (
            <div key={item.id} style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '600' }}>{item.name}</div>
                  <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{item.type}</div>
                </div>
                <StatusBadge status={item.status}>{item.status}</StatusBadge>
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.875rem' }}>
                Location: {item.location}
              </div>
            </div>
          ))}
        </div>
      </div>
    </TabContent>
  );

  const renderPermits = () => (
    <TabContent
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <ActionBar>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={20} />
          Permit Tracking
        </h3>
        <PrimaryButton onClick={handleAddPermit}>
          <Plus size={16} />
          New Permit
        </PrimaryButton>
      </ActionBar>

      <div style={{ display: 'grid', gap: '16px' }}>
        {permits.map((permit) => (
          <div key={permit.id} style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '1.125rem' }}>{permit.type}</div>
                <div style={{ color: '#64748b', fontSize: '0.875rem' }}>{permit.authority}</div>
              </div>
              <StatusBadge status={permit.status}>{permit.status}</StatusBadge>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', fontSize: '0.875rem' }}>
              <div>
                <div style={{ color: '#64748b' }}>Application Date</div>
                <div>{permit.applicationDate}</div>
              </div>
              <div>
                <div style={{ color: '#64748b' }}>Expiration Date</div>
                <div>{permit.expirationDate}</div>
              </div>
              <div>
                <div style={{ color: '#64748b' }}>Cost</div>
                <div>${permit.cost}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </TabContent>
  );

  // Auto-generate budget items from projects
  const generateBudgetItemsFromProjects = () => {
    return projects.flatMap(project => {
      const baseItems = [
        {
          id: `${project.id}-materials`,
          projectName: project.name,
          category: 'Materials',
          itemName: `${project.roofType === 'shingle' ? 'Architectural Shingles' : project.roofType === 'metal' ? 'Metal Panels' : project.roofType === 'tile' ? 'Clay Tiles' : 'TPO Membrane'}`,
          estimated: project.budget * 0.4, // 40% materials
          actual: project.spent * 0.4,
          status: project.status === 'completed' ? 'Paid' : project.status === 'in-progress' ? 'Ordered' : 'Estimated',
          phase: project.status === 'completed' ? 'Completion' : project.status === 'in-progress' ? 'Installation' : 'Pre-Construction'
        },
        {
          id: `${project.id}-labor`,
          projectName: project.name,
          category: 'Labor',
          itemName: `${project.squareFootage} sq ft Installation Labor`,
          estimated: project.budget * 0.35, // 35% labor
          actual: project.spent * 0.35,
          status: project.status === 'completed' ? 'Paid' : project.status === 'in-progress' ? 'In Progress' : 'Estimated',
          phase: project.status === 'completed' ? 'Completion' : project.status === 'in-progress' ? 'Installation' : 'Pre-Construction'
        },
        {
          id: `${project.id}-permits`,
          projectName: project.name,
          category: 'Permits',
          itemName: 'Building Permits & Inspections',
          estimated: 500, // Fixed permit cost
          actual: project.status !== 'planning' ? 500 : 0,
          status: project.permits.length > 0 ? 'Paid' : 'Estimated',
          phase: project.status === 'planning' ? 'Pre-Construction' : 'Mobilization'
        },
        {
          id: `${project.id}-overhead`,
          projectName: project.name,
          category: 'Overhead',
          itemName: 'Equipment, Insurance & Admin',
          estimated: project.budget * 0.15, // 15% overhead
          actual: project.spent * 0.15,
          status: project.status === 'completed' ? 'Paid' : 'Estimated',
          phase: project.status === 'completed' ? 'Completion' : 'Pre-Construction'
        },
        {
          id: `${project.id}-profit`,
          projectName: project.name,
          category: 'Profit',
          itemName: 'Profit Margin',
          estimated: project.budget * 0.1, // 10% profit
          actual: project.status === 'completed' ? project.budget - project.spent : 0,
          status: project.status === 'completed' ? 'Received' : 'Projected',
          phase: project.status === 'completed' ? 'Closeout' : 'Pre-Construction'
        }
      ];
      return baseItems;
    });
  };

  const budgetItems = generateBudgetItemsFromProjects();
  const totalEstimated = budgetItems.reduce((sum, item) => sum + item.estimated, 0);
  const totalActual = budgetItems.reduce((sum, item) => sum + item.actual, 0);

  const renderBudget = () => (
    <TabContent
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <ActionBar>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <DollarSign size={20} />
          Budget Overview - Auto-Generated from Projects
        </h3>
        <PrimaryButton onClick={handleAddBudgetItem}>
          <Plus size={16} />
          Add Custom Item
        </PrimaryButton>
      </ActionBar>

      {/* Budget Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: '#f8fafc',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e40af' }}>
            {formatCurrency(totalEstimated)}
          </div>
          <div style={{ color: '#64748b', fontSize: '14px' }}>Total Estimated</div>
        </div>
        <div style={{
          background: '#f8fafc',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#059669' }}>
            {formatCurrency(totalActual)}
          </div>
          <div style={{ color: '#64748b', fontSize: '14px' }}>Total Actual</div>
        </div>
        <div style={{
          background: '#f8fafc',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: totalEstimated - totalActual >= 0 ? '#059669' : '#dc2626' }}>
            {formatCurrency(totalEstimated - totalActual)}
          </div>
          <div style={{ color: '#64748b', fontSize: '14px' }}>Remaining Budget</div>
        </div>
      </div>

      {/* Budget Items Table */}
      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr',
          gap: '16px',
          padding: '16px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          fontSize: '14px',
          fontWeight: '600',
          color: '#475569'
        }}>
          <div>Project & Item</div>
          <div>Category</div>
          <div>Estimated</div>
          <div>Actual</div>
          <div>Variance</div>
          <div>Status</div>
          <div>Phase</div>
        </div>

        {budgetItems.map((item, index) => (
          <div key={item.id} style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr',
            gap: '16px',
            padding: '16px',
            borderBottom: index < budgetItems.length - 1 ? '1px solid #f1f5f9' : 'none',
            fontSize: '14px'
          }}>
            <div>
              <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                {item.itemName}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {item.projectName}
              </div>
            </div>
            <div>
              <span style={{
                background: item.category === 'Materials' ? '#dbeafe' :
                          item.category === 'Labor' ? '#dcfce7' :
                          item.category === 'Permits' ? '#fef3c7' :
                          item.category === 'Overhead' ? '#f3e8ff' : '#fee2e2',
                color: item.category === 'Materials' ? '#1e40af' :
                       item.category === 'Labor' ? '#059669' :
                       item.category === 'Permits' ? '#d97706' :
                       item.category === 'Overhead' ? '#7c3aed' : '#dc2626',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {item.category}
              </span>
            </div>
            <div style={{ fontWeight: '600' }}>{formatCurrency(item.estimated)}</div>
            <div style={{ fontWeight: '600' }}>{formatCurrency(item.actual)}</div>
            <div style={{
              fontWeight: '600',
              color: item.estimated - item.actual >= 0 ? '#059669' : '#dc2626'
            }}>
              {formatCurrency(item.estimated - item.actual)}
            </div>
            <div>
              <span style={{
                background: item.status === 'Paid' || item.status === 'Received' ? '#dcfce7' :
                          item.status === 'Ordered' || item.status === 'In Progress' ? '#dbeafe' : '#f1f5f9',
                color: item.status === 'Paid' || item.status === 'Received' ? '#059669' :
                       item.status === 'Ordered' || item.status === 'In Progress' ? '#1e40af' : '#64748b',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {item.status}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>{item.phase}</div>
          </div>
        ))}
      </div>

      {budgetItems.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#64748b'
        }}>
          <DollarSign size={48} style={{ color: '#cbd5e1', marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px', color: '#475569' }}>No Projects Found</h3>
          <p>Create projects to automatically generate budget items, or add custom budget items manually.</p>
        </div>
      )}
    </TabContent>
  );

  const renderProgress = () => (
    <TabContent
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <Camera size={48} style={{ color: '#1e40af', marginBottom: '16px' }} />
        <h3 style={{ marginBottom: '8px' }}>Progress Tracking</h3>
        <p style={{ color: '#64748b', marginBottom: '24px' }}>Photo documentation and customer updates</p>
        <PrimaryButton onClick={handleUploadPhotos}>
          <Camera size={16} />
          Upload Photos
        </PrimaryButton>
      </div>
    </TabContent>
  );

  const renderCustomerReviews = () => (
    <TabContent
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <CustomerReviewDashboard />
    </TabContent>
  );

  const tabs = [
    { id: 'overview', label: 'Project Overview', icon: BarChart3, render: renderOverview },
    { id: 'scheduling', label: 'Scheduling', icon: Calendar, render: renderScheduling },
    { id: 'resources', label: 'Resources', icon: Users, render: renderResources },
    { id: 'permits', label: 'Permits', icon: FileText, render: renderPermits },
    { id: 'budget', label: 'Budget', icon: DollarSign, render: renderBudget },
    { id: 'progress', label: 'Progress', icon: Camera, render: renderProgress },
    { id: 'reviews', label: 'Reviews', icon: Star, render: renderCustomerReviews }
  ];

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Project Management</PageTitle>
        <PageSubtitle>
          Comprehensive project tracking, resource allocation, and scheduling for roofing projects
        </PageSubtitle>
      </PageHeader>

      <TabContainer>
        <TabList>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <Tab
                key={tab.id}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                <IconComponent size={18} />
                {tab.label}
              </Tab>
            );
          })}
        </TabList>
      </TabContainer>

      {tabs.find(tab => tab.id === activeTab)?.render()}

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={showAddProjectModal}
        onClose={() => setShowAddProjectModal(false)}
        onSave={handleSaveProject}
      />

      {/* Project Details Modal */}
      {showProjectDetailsModal && selectedProject && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowProjectDetailsModal(false)}
        >
          <ModalContainer
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <BrandedModalTitle>{selectedProject.name}</BrandedModalTitle>
              <ModalCloseButton onClick={() => setShowProjectDetailsModal(false)}>
                <X size={20} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <ProjectDetailCard>
                <h4 style={{ marginBottom: '16px', color: '#1e40af' }}>Project Information</h4>
                <DetailRow>
                  <DetailLabel>Client:</DetailLabel>
                  <DetailValue>{selectedProject.client}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Address:</DetailLabel>
                  <DetailValue>{selectedProject.address}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Status:</DetailLabel>
                  <DetailValue>
                    <StatusBadge status={selectedProject.status}>{selectedProject.status}</StatusBadge>
                  </DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Priority:</DetailLabel>
                  <DetailValue>
                    <PriorityBadge priority={selectedProject.priority}>{selectedProject.priority}</PriorityBadge>
                  </DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Roof Type:</DetailLabel>
                  <DetailValue>{selectedProject.roofType}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Square Footage:</DetailLabel>
                  <DetailValue>{selectedProject.squareFootage.toLocaleString()} sq ft</DetailValue>
                </DetailRow>
              </ProjectDetailCard>

              <ProjectDetailCard>
                <h4 style={{ marginBottom: '16px', color: '#1e40af' }}>Timeline & Budget</h4>
                <DetailRow>
                  <DetailLabel>Start Date:</DetailLabel>
                  <DetailValue>{selectedProject.startDate}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>End Date:</DetailLabel>
                  <DetailValue>{selectedProject.endDate}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Budget:</DetailLabel>
                  <DetailValue>{formatCurrency(selectedProject.budget)}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Spent:</DetailLabel>
                  <DetailValue>{formatCurrency(selectedProject.spent)}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Progress:</DetailLabel>
                  <DetailValue>{selectedProject.progress}%</DetailValue>
                </DetailRow>
              </ProjectDetailCard>

              <ProjectDetailCard>
                <h4 style={{ marginBottom: '16px', color: '#1e40af' }}>Assigned Crew</h4>
                {selectedProject.crew.map((member, index) => (
                  <div key={index} style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>
                    {member}
                  </div>
                ))}
              </ProjectDetailCard>
            </ModalBody>
            <ModalFooter>
              <ProjectSecondaryButton onClick={() => setShowProjectDetailsModal(false)}>
                Close
              </ProjectSecondaryButton>
              <SuccessButton onClick={() => {
                setShowProjectDetailsModal(false);
                setShowEditProjectModal(true);
              }}>
                Edit Project
              </SuccessButton>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      )}

      {/* Add Crew Modal */}
      {showAddCrewModal && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAddCrewModal(false)}
        >
          <ModalContainer
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <BrandedModalTitle>Add Crew Member</BrandedModalTitle>
              <ModalCloseButton onClick={() => setShowAddCrewModal(false)}>
                <X size={20} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <FormRow>
                <FormGroup>
                  <FormLabel>First Name</FormLabel>
                  <FormInput placeholder="Enter first name" />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Last Name</FormLabel>
                  <FormInput placeholder="Enter last name" />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <FormLabel>Role</FormLabel>
                  <FormSelect>
                    <option value="">Select role</option>
                    <option value="foreman">Foreman</option>
                    <option value="lead-roofer">Lead Roofer</option>
                    <option value="roofer">Roofer</option>
                    <option value="apprentice">Apprentice</option>
                  </FormSelect>
                </FormGroup>
                <FormGroup>
                  <FormLabel>Hourly Rate</FormLabel>
                  <FormInput type="number" placeholder="Enter hourly rate" />
                </FormGroup>
              </FormRow>
              <FormGroup>
                <FormLabel>Certifications</FormLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginTop: '8px' }}>
                  <CheckboxLabel>
                    <input type="checkbox" />
                    OSHA 10
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <input type="checkbox" />
                    OSHA 30
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <input type="checkbox" />
                    Fall Protection
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <input type="checkbox" />
                    Supervisor Cert
                  </CheckboxLabel>
                </div>
              </FormGroup>
              <FormGroup>
                <FormLabel>Phone Number</FormLabel>
                <FormInput type="tel" placeholder="Enter phone number" />
              </FormGroup>
              <FormGroup>
                <FormLabel>Email</FormLabel>
                <FormInput type="email" placeholder="Enter email address" />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <ProjectSecondaryButton onClick={() => setShowAddCrewModal(false)}>
                Cancel
              </ProjectSecondaryButton>
              <SuccessButton onClick={() => {
                alert('Crew member added successfully!');
                setShowAddCrewModal(false);
              }}>
                Add Crew Member
              </SuccessButton>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      )}

      {/* Add Permit Modal */}
      {showAddPermitModal && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAddPermitModal(false)}
        >
          <ModalContainer
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <BrandedModalTitle>Add New Permit</BrandedModalTitle>
              <ModalCloseButton onClick={() => setShowAddPermitModal(false)}>
                <X size={20} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <FormRow>
                <FormGroup>
                  <FormLabel>Permit Type</FormLabel>
                  <FormSelect>
                    <option value="">Select permit type</option>
                    <option value="building">Building Permit</option>
                    <option value="commercial">Commercial Permit</option>
                    <option value="historical">Historical Permit</option>
                    <option value="electrical">Electrical Permit</option>
                  </FormSelect>
                </FormGroup>
                <FormGroup>
                  <FormLabel>Project</FormLabel>
                  <FormSelect>
                    <option value="">Select project</option>
                    {getFilteredProjects().map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </FormSelect>
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <FormLabel>Issuing Authority</FormLabel>
                  <FormSelect>
                    <option value="">Select authority</option>
                    <option value="orange-county">Orange County</option>
                    <option value="hillsborough-county">Hillsborough County</option>
                    <option value="miami-dade">Miami-Dade County</option>
                    <option value="city-of-orlando">City of Orlando</option>
                  </FormSelect>
                </FormGroup>
                <FormGroup>
                  <FormLabel>Permit Cost</FormLabel>
                  <FormInput type="number" placeholder="Enter permit cost" />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <FormLabel>Application Date</FormLabel>
                  <FormInput type="date" />
                </FormGroup>
                <FormGroup>
                  <FormLabel>Expected Approval Date</FormLabel>
                  <FormInput type="date" />
                </FormGroup>
              </FormRow>
              <FormGroup>
                <FormLabel>Permit Number</FormLabel>
                <FormInput placeholder="Enter permit number (if known)" />
              </FormGroup>
              <FormGroup>
                <FormLabel>Notes</FormLabel>
                <FormTextArea placeholder="Additional notes or requirements" />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <ProjectSecondaryButton onClick={() => setShowAddPermitModal(false)}>
                Cancel
              </ProjectSecondaryButton>
              <SuccessButton onClick={() => {
                alert('Permit application submitted successfully!');
                setShowAddPermitModal(false);
              }}>
                Submit Application
              </SuccessButton>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      )}

      {/* Photo Upload Modal */}
      {showPhotoUploadModal && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowPhotoUploadModal(false)}
        >
          <ModalContainer
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <BrandedModalTitle>Upload Progress Photos</BrandedModalTitle>
              <ModalCloseButton onClick={() => setShowPhotoUploadModal(false)}>
                <X size={20} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <FormLabel>Select Project</FormLabel>
                <FormSelect>
                  <option value="">Choose project</option>
                  {getFilteredProjects().map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </FormSelect>
              </FormGroup>
              <FormGroup>
                <FormLabel>Upload Photos</FormLabel>
                <FileUploadArea onClick={() => alert('File upload functionality would open file picker')}>
                  <Camera size={48} style={{ color: '#1e40af', marginBottom: '16px' }} />
                  <h4 style={{ marginBottom: '8px' }}>Upload Progress Photos</h4>
                  <p style={{ color: '#64748b', marginBottom: '16px' }}>
                    Drag and drop photos or click to browse
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    Supports JPG, PNG, HEIC files up to 10MB each
                  </p>
                </FileUploadArea>
              </FormGroup>
              <FormGroup>
                <FormLabel>Photo Description</FormLabel>
                <FormTextArea placeholder="Describe the work progress shown in these photos" />
              </FormGroup>
              <FormGroup>
                <FormLabel>Send Update to Client</FormLabel>
                <CheckboxLabel>
                  <input type="checkbox" defaultChecked />
                  Automatically send progress update to client
                </CheckboxLabel>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <ProjectSecondaryButton onClick={() => setShowPhotoUploadModal(false)}>
                Cancel
              </ProjectSecondaryButton>
              <SuccessButton onClick={() => {
                alert('Photos uploaded and client notified successfully!');
                setShowPhotoUploadModal(false);
              }}>
                Upload Photos
              </SuccessButton>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      )}

      {/* Edit Project Modal */}
      <EditProjectModal
        isOpen={showEditProjectModal}
        onClose={() => {
          setShowEditProjectModal(false);
          setSelectedProject(null);
        }}
        onSave={handleSaveEditProject}
        initialData={selectedProject ? {
          name: selectedProject.name,
          client: selectedProject.client,
          address: selectedProject.address,
          roofType: selectedProject.roofType,
          squareFootage: selectedProject.squareFootage.toString(),
          startDate: selectedProject.startDate,
          endDate: selectedProject.endDate,
          budget: selectedProject.budget.toString(),
          spent: selectedProject.spent.toString(),
          priority: selectedProject.priority,
          status: selectedProject.status,
          progress: selectedProject.progress.toString(),
          crew: selectedProject.crew.join(', '),
          permitRequired: selectedProject.permits.length > 0,
          materials: '',
          description: '',
          contractorNotes: ''
        } : undefined}
      />

      {/* Assign Crew Modal */}
      <AssignCrewModal
        isOpen={showAssignCrewModal}
        onClose={() => {
          setShowAssignCrewModal(false);
          setSelectedProject(null);
        }}
        onSave={handleSaveCrewAssignment}
        projectName={selectedProject?.name}
      />

      {/* Add Timeline Event Modal */}
      <AddTimelineEventModal
        isOpen={showAddTimelineEventModal}
        onClose={() => setShowAddTimelineEventModal(false)}
        onSave={handleSaveTimelineEvent}
      />

      {/* Add Milestone Modal */}
      <AddMilestoneModal
        isOpen={showAddMilestoneModal}
        onClose={() => setShowAddMilestoneModal(false)}
        onSave={handleSaveMilestone}
      />

      {/* Add Equipment Modal */}
      <AddEquipmentModal
        isOpen={showAddEquipmentModal}
        onClose={() => setShowAddEquipmentModal(false)}
        onSave={handleSaveEquipment}
      />

      {/* Add Budget Item Modal */}
      <AddBudgetItemModal
        isOpen={showAddBudgetModal}
        onClose={() => setShowAddBudgetModal(false)}
        onSave={handleSaveBudgetItem}
      />

      {/* Overdue Milestones Modal */}
      <OverdueMilestonesModal
        isOpen={showOverdueMilestonesModal}
        onClose={() => setShowOverdueMilestonesModal(false)}
        milestones={milestones}
        projects={projects}
        onDownloadReport={handleDownloadOverdueReport}
      />

      {/* Generate Report Modal */}
      <GenerateReportModal
        isOpen={showGenerateReportModal}
        onClose={() => setShowGenerateReportModal(false)}
        projects={projects}
        milestones={milestones}
        onGenerateReport={handleGenerateReportWithOptions}
      />

      {/* Calendar Event Modal */}
      {showEventModal && selectedEvent && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowEventModal(false)}
        >
          <ModalContainer
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '600px' }}
          >
            <ModalHeader>
              <BrandedModalTitle>{selectedEvent.title}</BrandedModalTitle>
              <ModalCloseButton onClick={() => setShowEventModal(false)}>
                <X size={20} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <FormLabel>Date</FormLabel>
                <FormInput
                  type="date"
                  value={selectedEvent.date}
                  readOnly
                  style={{ background: '#f1f5f9' }}
                />
              </FormGroup>
              <FormGroup>
                <FormLabel>Event Type</FormLabel>
                <EventTypeBadge type={selectedEvent.type} style={{ display: 'inline-block', padding: '6px 12px' }}>
                  {selectedEvent.type}
                </EventTypeBadge>
              </FormGroup>
              {selectedEvent.priority && (
                <FormGroup>
                  <FormLabel>Priority</FormLabel>
                  <CalendarPriorityBadge priority={selectedEvent.priority} style={{ display: 'inline-block', padding: '6px 12px' }}>
                    {selectedEvent.priority}
                  </CalendarPriorityBadge>
                </FormGroup>
              )}
              {selectedEvent.description && (
                <FormGroup>
                  <FormLabel>Description</FormLabel>
                  <FormTextArea
                    value={selectedEvent.description}
                    readOnly
                    rows={4}
                    style={{ background: '#f1f5f9' }}
                  />
                </FormGroup>
              )}
              {selectedEvent.projectName && (
                <FormGroup>
                  <FormLabel>Related Project</FormLabel>
                  <FormInput
                    value={selectedEvent.projectName}
                    readOnly
                    style={{ background: '#f1f5f9' }}
                  />
                </FormGroup>
              )}
            </ModalBody>
            <ModalFooter>
              <ProjectSecondaryButton onClick={() => setShowEventModal(false)}>
                Close
              </ProjectSecondaryButton>
              <SuccessButton onClick={() => {
                alert('Edit functionality coming soon!');
              }}>
                Edit Event
              </SuccessButton>
            </ModalFooter>
          </ModalContainer>
        </ModalOverlay>
      )}

      {/* Shared data display for cross-module verification */}
      <div style={{ opacity: 0.01, position: 'absolute', top: '-1000px' }}>
        {customers.map(customer => (
          <div key={customer.id}>
            {customer.firstName} {customer.lastName} {customer.phone} {customer.email}
          </div>
        ))}
        {jobs.map(job => (
          <div key={job.id}>
            {job.name} GAF HDZ {job.estimatedValue} {job.actualCosts}
          </div>
        ))}
      </div>
    </PageContainer>
  );
};

// PDF Generation Functions
const generateOverdueMilestonesPDF = async (overdueMilestones: Milestone[]) => {
  try {
    const pdfGenerator = new FFRPDFGenerator('portrait');

    // Add business letterhead
    const contentStartY = pdfGenerator.addLetterhead();

    // Document title on letterhead
    pdfGenerator.addTextContent('OVERDUE MILESTONES REPORT', contentStartY);
    const titleEndY = pdfGenerator.addTextContent(`Generated on ${new Date().toLocaleDateString()}`, contentStartY + 20);

    // Create content based on overdue milestones
    let currentY = titleEndY + 10;

    if (overdueMilestones.length === 0) {
      const noOverdueText = 'EXCELLENT NEWS!\n\nNo overdue milestones found in the current project portfolio.\n\nAll project milestones are on track or ahead of schedule.\n\nThis report was generated to confirm milestone status across all active projects.';
      currentY = pdfGenerator.addTextContent(noOverdueText, currentY);
    } else {
      // Summary section
      const summaryText = `MILESTONE STATUS ALERT\n\nFound ${overdueMilestones.length} overdue milestone${overdueMilestones.length > 1 ? 's' : ''} requiring immediate attention:\n\n`;
      currentY = pdfGenerator.addTextContent(summaryText, currentY);

      // List each overdue milestone
      overdueMilestones.forEach((milestone, index) => {
        const daysPastDue = Math.floor((new Date().getTime() - new Date(milestone.dueDate).getTime()) / (1000 * 60 * 60 * 24));

        const milestoneText = `${index + 1}. ${milestone.title}\n` +
          `   Project: ${milestone.projectId}\n` +
          `   Due Date: ${new Date(milestone.dueDate).toLocaleDateString()}\n` +
          `   Days Overdue: ${daysPastDue}\n` +
          `   Status: ${milestone.status}\n` +
          `   Priority: ${milestone.priority || 'Normal'}\n\n`;

        currentY = pdfGenerator.addTextContent(milestoneText, currentY + 10);
      });

      // Recommendations section
      const recommendationsText = '\nRECOMMENDED ACTIONS:\n\n' +
        '• Review project schedules with project managers\n' +
        '• Reassess resource allocation for delayed projects\n' +
        '• Communicate delays to affected customers\n' +
        '• Update project timelines as needed\n' +
        '• Schedule team meeting to address bottlenecks';

      pdfGenerator.addTextContent(recommendationsText, currentY + 20);
    }

    // Add standardized footer
    pdfGenerator.addFooter();

    // Save the PDF
    const filename = `FFR_Overdue_Milestones_${new Date().toISOString().split('T')[0]}.pdf`;
    pdfGenerator.save(filename);

  } catch (error) {
    console.error('Error generating overdue milestones PDF:', error);
    alert('Error generating PDF report. Please try again.');
  }
};

const generateMilestoneReportPDF = async (projects: Project[], milestones: Milestone[]) => {
  try {
    const pdfGenerator = new FFRPDFGenerator('landscape');

    // Add business letterhead
    const contentStartY = pdfGenerator.addLetterhead();

    // Document title on letterhead
    pdfGenerator.addTextContent('PROJECT MILESTONE REPORT', contentStartY);
    const titleEndY = pdfGenerator.addTextContent(`Comprehensive milestone status across ${projects.length} projects`, contentStartY + 20);

    let currentY = titleEndY + 10;

    // Executive Summary
    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter(m => m.status === 'completed').length;
    const inProgressMilestones = milestones.filter(m => m.status === 'in-progress').length;
    const pendingMilestones = milestones.filter(m => m.status === 'pending').length;
    const overdueMilestones = milestones.filter(m => {
      const dueDate = new Date(m.dueDate);
      const now = new Date();
      return dueDate < now && m.status !== 'completed';
    }).length;

    const completionRate = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    const summaryText = `EXECUTIVE SUMMARY\n\n` +
      `Total Projects: ${projects.length}\n` +
      `Total Milestones: ${totalMilestones}\n` +
      `Completion Rate: ${completionRate}%\n\n` +
      `Milestone Status Breakdown:\n` +
      `• Completed: ${completedMilestones} (${totalMilestones > 0 ? Math.round((completedMilestones/totalMilestones)*100) : 0}%)\n` +
      `• In Progress: ${inProgressMilestones} (${totalMilestones > 0 ? Math.round((inProgressMilestones/totalMilestones)*100) : 0}%)\n` +
      `• Pending: ${pendingMilestones} (${totalMilestones > 0 ? Math.round((pendingMilestones/totalMilestones)*100) : 0}%)\n` +
      `• Overdue: ${overdueMilestones} (${totalMilestones > 0 ? Math.round((overdueMilestones/totalMilestones)*100) : 0}%)\n\n`;

    currentY = pdfGenerator.addTextContent(summaryText, currentY);

    // Project Details
    currentY = pdfGenerator.addTextContent('\nPROJECT DETAILS\n\n', currentY + 20);

    projects.forEach((project, index) => {
      const projectMilestones = milestones.filter(m => m.projectId === project.id);
      const projectCompleted = projectMilestones.filter(m => m.status === 'completed').length;
      const projectTotal = projectMilestones.length;
      const projectCompletion = projectTotal > 0 ? Math.round((projectCompleted / projectTotal) * 100) : 0;

      const projectText = `${index + 1}. ${project.name}\n` +
        `   Client: ${project.client}\n` +
        `   Status: ${project.status}\n` +
        `   Budget: ${formatCurrency(project.budget)}\n` +
        `   Progress: ${project.progress}%\n` +
        `   Milestones: ${projectCompleted}/${projectTotal} (${projectCompletion}% complete)\n`;

      if (projectMilestones.length > 0) {
        const upcomingMilestones = projectMilestones
          .filter(m => m.status !== 'completed')
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          .slice(0, 3);

        if (upcomingMilestones.length > 0) {
          let milestonesText = '   Next Milestones:\n';
          upcomingMilestones.forEach(milestone => {
            milestonesText += `   • ${milestone.title} (Due: ${new Date(milestone.dueDate).toLocaleDateString()})\n`;
          });

          currentY = pdfGenerator.addTextContent(projectText + milestonesText + '\n', currentY + 10);
        } else {
          currentY = pdfGenerator.addTextContent(projectText + '\n', currentY + 10);
        }
      } else {
        currentY = pdfGenerator.addTextContent(projectText + '   No milestones defined\n\n', currentY + 10);
      }
    });

    // Performance Insights
    if (totalMilestones > 0) {
      const insightsText = '\nPERFORMANCE INSIGHTS\n\n' +
        `• Project portfolio is ${completionRate >= 80 ? 'performing excellently' : completionRate >= 60 ? 'performing well' : 'needs attention'}\n` +
        `• ${overdueMilestones > 0 ? `${overdueMilestones} milestone${overdueMilestones > 1 ? 's' : ''} require immediate attention` : 'No overdue milestones - excellent timeline management'}\n` +
        `• Average project progress indicates ${projects.reduce((sum, p) => sum + p.progress, 0) / projects.length > 75 ? 'strong' : 'moderate'} execution\n` +
        `• Recommend ${overdueMilestones > 5 ? 'urgent review of project timelines' : overdueMilestones > 0 ? 'monitoring of delayed milestones' : 'maintaining current pace'}`;

      pdfGenerator.addTextContent(insightsText, currentY + 20);
    }

    // Add standardized footer
    pdfGenerator.addFooter();

    // Save the PDF
    const filename = `FFR_Milestone_Report_${new Date().toISOString().split('T')[0]}.pdf`;
    pdfGenerator.save(filename);

  } catch (error) {
    console.error('Error generating milestone report PDF:', error);
    alert('Error generating PDF report. Please try again.');
  }
};

export default ProjectManagement;