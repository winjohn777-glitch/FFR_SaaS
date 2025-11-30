import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import sopService, { ComplianceMetrics } from '../services/sopService';
import { SOPCategory, SOPProcedure } from '../types/sop';
import SOPViewerModal from '../components/SOP/SOPViewerModal';
import SOPCreationWizard from '../components/SOP/SOPCreationWizard';
import FormsChecklistsPage from '../components/Forms/FormsChecklistsPage';
import {
  BookOpen,
  FileText,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Filter,
  Plus,
  Download,
  Upload,
  Grid,
  List,
  Tag,
  Shield,
  MapPin,
  Wind,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Copy
} from 'lucide-react';

// Types
type ViewMode = 'grid' | 'list' | 'categories';

interface SOPStats {
  total_sops: number;
  active_sops: number;
  florida_specific: number;
  hurricane_related: number;
  osha_related: number;
  critical_priority: number;
  high_priority: number;
  compliance_rate: number;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Styled Components
const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
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


const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: ${({ color }) => color};
`;

const FilterBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 300px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const FilterSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background: white;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'icon'; active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme, variant }) => variant === 'icon' ? theme.spacing.sm : theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: ${({ variant }) => variant === 'icon' ? 'auto' : '100px'};

  ${({ variant = 'secondary', theme, active }) => {
    if (variant === 'primary') {
      return `
        background: ${theme.colors.primary};
        color: white;

        &:hover {
          background: ${theme.colors.primary}dd;
        }
      `;
    } else if (variant === 'icon') {
      return `
        background: ${active ? theme.colors.primary : theme.colors.surface};
        color: ${active ? 'white' : theme.colors.text.primary};
        border: 1px solid ${active ? theme.colors.primary : theme.colors.border};
        padding: ${theme.spacing.sm};
        width: 40px;
        height: 40px;
        justify-content: center;

        &:hover {
          background: ${active ? theme.colors.primary + 'dd' : theme.colors.background};
        }
      `;
    } else {
      return `
        background: ${theme.colors.surface};
        color: ${theme.colors.text.primary};
        border: 1px solid ${theme.colors.border};

        &:hover {
          background: ${theme.colors.background};
        }
      `;
    }
  }}
`;

const ViewModeToggle = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const StatsCard = styled(motion.div)<{ color: string }>`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border-left: 4px solid ${({ color }) => color};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 60px;
    background: ${({ color }) => color}15;
    border-radius: 0 0 0 100%;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  height: fit-content;
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CategoryItem = styled(motion.div)<{ active?: boolean; color?: string }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 4px solid ${({ color }) => color};

  ${({ active, theme, color }) => active ? `
    background: ${color}20;
    color: ${theme.colors.text.primary};
  ` : `
    background: transparent;
    color: ${theme.colors.text.secondary};

    &:hover {
      background: ${color}10;
      color: ${theme.colors.text.primary};
    }
  `}
`;

const MainContent = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Tab = styled.button<{ active?: boolean }>`
  padding: ${({ theme }) => theme.spacing.lg};
  border: none;
  background: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;

  ${({ active, theme }) => active ? `
    color: ${theme.colors.primary};

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: ${theme.colors.primary};
    }
  ` : `
    color: ${theme.colors.text.secondary};

    &:hover {
      color: ${theme.colors.text.primary};
    }
  `}
`;

const SOPGrid = styled.div<{ viewMode: ViewMode }>`
  display: ${({ viewMode }) => viewMode === 'categories' ? 'block' : 'grid'};
  grid-template-columns: ${({ viewMode }) => {
    if (viewMode === 'grid') return 'repeat(auto-fill, minmax(320px, 1fr))';
    if (viewMode === 'list') return '1fr';
    return 'none';
  }};
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const SOPList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SOPListItem = styled(motion.div)`
  display: grid;
  grid-template-columns: auto 1fr auto auto auto;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CategorySection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const CategoryHeader = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ color }) => color}15;
  border-left: 4px solid ${({ color }) => color};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CategoryTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const CategoryCount = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  margin-left: auto;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

const PaginationInfo = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const PaginationControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.surface};
  color: ${({ theme, active }) => active ? 'white' : theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  min-width: 40px;

  &:hover:not(:disabled) {
    background: ${({ theme, active }) => active ? theme.colors.primary + 'dd' : theme.colors.background};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};

  svg {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    opacity: 0.5;
  }

  h3 {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const SOPCard = styled(motion.div)`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SOPHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SOPNumber = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const SOPTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const SOPMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const Badge = styled.span<{ variant?: string }>`
  font-size: 0.75rem;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  white-space: nowrap;

  ${({ variant, theme }) => {
    switch (variant) {
      case 'florida':
        return `background: #FF6B35; color: white;`;
      case 'hurricane':
        return `background: #DC2626; color: white;`;
      case 'osha':
        return `background: #F59E0B; color: white;`;
      case 'hvhz':
        return `background: #7C3AED; color: white;`;
      case 'critical':
        return `background: #DC2626; color: white;`;
      case 'high':
        return `background: #F59E0B; color: white;`;
      case 'standard':
        return `background: #10B981; color: white;`;
      case 'low':
        return `background: #6B7280; color: white;`;
      case 'active':
        return `background: #10B981; color: white;`;
      case 'draft':
        return `background: #6B7280; color: white;`;
      case 'under_review':
        return `background: #F59E0B; color: white;`;
      case 'archived':
        return `background: #DC2626; color: white;`;
      default:
        return `background: ${theme.colors.background}; color: ${theme.colors.text.secondary};`;
    }
  }}
`;

const SOPActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  opacity: 0;
  transition: opacity 0.2s ease;
`;

const SOPCardContainer = styled.div`
  &:hover ${SOPActions} {
    opacity: 1;
  }
`;

const StatusIndicator = styled.div<{ status: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;

  ${({ status }) => {
    switch (status) {
      case 'active':
        return 'background: #10B981;';
      case 'draft':
        return 'background: #6B7280;';
      case 'under_review':
        return 'background: #F59E0B;';
      case 'archived':
        return 'background: #DC2626;';
      default:
        return 'background: #6B7280;';
    }
  }}
`;

const SOPManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('procedures');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [categories, setCategories] = useState<SOPCategory[]>([]);
  const [procedures, setProcedures] = useState<SOPProcedure[]>([]);
  const [sopStats, setSopStats] = useState<SOPStats | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 24,
    total: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [loadingProcedures, setLoadingProcedures] = useState(false);

  // Modal states
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [selectedProcedure, setSelectedProcedure] = useState<SOPProcedure | null>(null);
  const [creationWizardOpen, setCreationWizardOpen] = useState(false);

  // Load categories and initial data from API
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);

        // Load categories from API
        const categoriesData = await sopService.getCategories(true);
        setCategories(categoriesData);

        // Load SOP statistics from API
        const stats = await sopService.getSOPStatistics();
        setSopStats({
          total_sops: stats.total_sops || 0,
          active_sops: stats.active_sops || 0,
          florida_specific: stats.florida_specific_sops || 0,
          hurricane_related: stats.hurricane_related_sops || 0,
          osha_related: stats.osha_related_sops || 0,
          critical_priority: stats.critical_priority_sops || 0,
          high_priority: stats.high_priority_sops || 0,
          compliance_rate: Math.round(stats.avg_compliance_rate || 0)
        });

        setLoading(false);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Load procedures when filters change from API
  useEffect(() => {
    if (!loading) {
      const loadProcedures = async () => {
        try {
          setLoadingProcedures(true);

          const filters: any = {
            page: pagination.page,
            limit: pagination.limit
          };

          if (selectedCategory) {
            filters.category_id = selectedCategory;
          }

          if (statusFilter !== 'all') {
            filters.status = statusFilter;
          }

          if (searchTerm) {
            filters.search = searchTerm;
          }

          // Apply type filters
          if (typeFilter === 'florida') filters.florida_specific = true;
          else if (typeFilter === 'hurricane') filters.hurricane_related = true;
          else if (typeFilter === 'osha') filters.osha_related = true;

          // Get procedures from API
          const response = await sopService.getProcedures(filters);

          setProcedures(response.data);
          setPagination({
            page: response.pagination.page,
            limit: response.pagination.limit,
            total: response.pagination.total,
            totalPages: response.pagination.totalPages
          });

          setLoadingProcedures(false);
        } catch (error) {
          console.error('Error loading procedures:', error);
          setLoadingProcedures(false);
        }
      };

      loadProcedures();
    }
  }, [selectedCategory, statusFilter, typeFilter, searchTerm, pagination.page, pagination.limit, loading]);

  // Helper functions
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on search
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setSelectedCategory(null);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // SOP Action Handlers
  const handleViewSOP = (procedure: SOPProcedure) => {
    console.log('Viewing SOP:', procedure.sop_number, procedure.title);
    setSelectedProcedure(procedure);
    setViewerModalOpen(true);
  };

  const handleEditSOP = (procedure: SOPProcedure) => {
    console.log('Editing SOP:', procedure.sop_number, procedure.title);
    // Keep the modal open and show the SOP content instead of closing it
    setSelectedProcedure(procedure);
    setViewerModalOpen(true);
    // TODO: Future enhancement - add edit mode to the modal
  };

  const handleDuplicateSOP = (procedure: SOPProcedure) => {
    console.log('Duplicating SOP:', procedure.sop_number, procedure.title);
    // Keep the modal open and show the SOP content
    setSelectedProcedure(procedure);
    setViewerModalOpen(true);
    // TODO: Future enhancement - add duplicate functionality to the modal
  };

  const handleDownloadSOP = (procedure: SOPProcedure) => {
    console.log('Downloading SOP:', procedure.sop_number, procedure.title);
    // Keep the modal open and show the SOP content
    setSelectedProcedure(procedure);
    setViewerModalOpen(true);
    // TODO: Future enhancement - add download functionality to the modal
  };

  // Header Action Handlers
  const handleExportSOPs = () => {
    console.log('Exporting SOPs...');
    // TODO: Implement bulk SOP export functionality
    alert('Bulk SOP Export will be available in the next update.\n\nFeatures will include:\n- Export all SOPs to PDF collection\n- Create Excel summary report\n- Generate compliance documentation\n- Export filtered SOPs only\n- Include statistics and metrics');
  };

  const handleImportSOPs = () => {
    console.log('Importing SOPs...');
    // TODO: Implement SOP import functionality
    alert('SOP Import functionality will be available in the next update.\n\nSupported import formats:\n- Existing SOP documents (PDF, Word)\n- Excel templates with SOP data\n- Industry standard SOP formats\n- Bulk upload with validation\n- Automatic categorization');
  };

  const handleCreateNewSOP = () => {
    console.log('Opening SOP Creation Wizard...');
    setCreationWizardOpen(true);
  };

  const handleSOPCreated = (sopData: any) => {
    console.log('SOP Created:', sopData);
    // TODO: Implement actual SOP creation API call
    alert(`SOP "${sopData.title}" has been created successfully!\n\nThis will be saved to the database in the next update.`);
    // Refresh the procedures list to show the new SOP
    // For now, we'll just log it since the API isn't implemented yet
  };

  // Format SOP title with FFR_SOP-XXXX: Title format
  const formatSOPTitle = (procedure: SOPProcedure): string => {
    return `${procedure.sop_number}: ${procedure.title}`;
  };

  // Modal Handlers
  const closeViewerModal = () => {
    setViewerModalOpen(false);
    setSelectedProcedure(null);
  };

  const getVisiblePageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, pagination.page - delta);
         i <= Math.min(pagination.totalPages - 1, pagination.page + delta);
         i++) {
      range.push(i);
    }

    if (pagination.page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (pagination.page + delta < pagination.totalPages - 1) {
      rangeWithDots.push('...', pagination.totalPages);
    } else {
      rangeWithDots.push(pagination.totalPages);
    }

    return rangeWithDots;
  };

  const groupProceduresByCategory = () => {
    const grouped: { [key: string]: { category: SOPCategory; procedures: SOPProcedure[] } } = {};

    procedures.forEach(procedure => {
      const category = categories.find(c => c.id === procedure.category_id);
      if (category) {
        if (!grouped[category.id]) {
          grouped[category.id] = { category, procedures: [] };
        }
        grouped[category.id].procedures.push(procedure);
      }
    });

    return Object.values(grouped);
  };

  // Render components
  const RenderSOPCard = ({ procedure }: { procedure: SOPProcedure }) => (
    <SOPCardContainer>
      <SOPCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -2 }}
        onClick={() => handleViewSOP(procedure)}
      >
        <SOPHeader>
          <SOPNumber>{procedure.sop_number}</SOPNumber>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <StatusIndicator status={procedure.status} />
            <span style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>
              {procedure.status.replace('_', ' ')}
            </span>
          </div>
        </SOPHeader>

        <SOPTitle>{formatSOPTitle(procedure)}</SOPTitle>

        <SOPMeta>
          <Badge>{procedure.category_name}</Badge>
          {procedure.florida_specific && (
            <Badge variant="florida">
              <MapPin size={12} />
              Florida Specific
            </Badge>
          )}
          {procedure.hurricane_related && (
            <Badge variant="hurricane">
              <Wind size={12} />
              Hurricane Related
            </Badge>
          )}
          {procedure.osha_related && (
            <Badge variant="osha">
              <Shield size={12} />
              OSHA Required
            </Badge>
          )}
          <Badge variant={procedure.priority_level}>
            {procedure.priority_level === 'critical' && <AlertTriangle size={12} />}
            {procedure.priority_level.charAt(0).toUpperCase() + procedure.priority_level.slice(1)}
          </Badge>
          <Badge>
            <Calendar size={12} />
            {procedure.estimated_duration_minutes}min
          </Badge>
        </SOPMeta>

        <SOPActions>
          <ActionButton
            variant="icon"
            title="View SOP"
            onClick={(e) => {
              e.stopPropagation();
              handleViewSOP(procedure);
            }}
          >
            <Eye size={16} />
          </ActionButton>
          <ActionButton
            variant="icon"
            title="Edit SOP"
            onClick={(e) => {
              e.stopPropagation();
              handleEditSOP(procedure);
            }}
          >
            <Edit size={16} />
          </ActionButton>
          <ActionButton
            variant="icon"
            title="Duplicate SOP"
            onClick={(e) => {
              e.stopPropagation();
              handleDuplicateSOP(procedure);
            }}
          >
            <Copy size={16} />
          </ActionButton>
        </SOPActions>
      </SOPCard>
    </SOPCardContainer>
  );

  const RenderSOPListItem = ({ procedure }: { procedure: SOPProcedure }) => (
    <SOPListItem
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: 4 }}
      onClick={() => handleViewSOP(procedure)}
    >
      <SOPNumber>{procedure.sop_number}</SOPNumber>
      <div>
        <SOPTitle style={{ marginBottom: '4px' }}>{formatSOPTitle(procedure)}</SOPTitle>
        <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{procedure.category_name}</div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {procedure.florida_specific && (
          <Badge variant="florida">
            <MapPin size={10} />
            FL
          </Badge>
        )}
        {procedure.hurricane_related && (
          <Badge variant="hurricane">
            <Wind size={10} />
            Hurricane
          </Badge>
        )}
        {procedure.osha_related && (
          <Badge variant="osha">
            <Shield size={10} />
            OSHA
          </Badge>
        )}
      </div>
      <Badge variant={procedure.priority_level}>
        {procedure.priority_level.charAt(0).toUpperCase() + procedure.priority_level.slice(1)}
      </Badge>
      <SOPActions style={{ opacity: 1 }}>
        <ActionButton
          variant="icon"
          title="View SOP"
          onClick={(e) => {
            e.stopPropagation();
            handleViewSOP(procedure);
          }}
        >
          <Eye size={14} />
        </ActionButton>
        <ActionButton
          variant="icon"
          title="Edit SOP"
          onClick={(e) => {
            e.stopPropagation();
            handleEditSOP(procedure);
          }}
        >
          <Edit size={14} />
        </ActionButton>
        <ActionButton
          variant="icon"
          title="Duplicate SOP"
          onClick={(e) => {
            e.stopPropagation();
            handleDuplicateSOP(procedure);
          }}
        >
          <Copy size={14} />
        </ActionButton>
      </SOPActions>
    </SOPListItem>
  );

  if (loading) {
    return <Container>Loading SOP Management System...</Container>;
  }

  return (
    <Container>
      <Header>
        <Title>
          <BookOpen size={32} />
          SOP Management System
        </Title>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <ActionButton variant="secondary" onClick={handleExportSOPs}>
            <Download size={16} />
            Export
          </ActionButton>
          <ActionButton variant="secondary" onClick={handleImportSOPs}>
            <Upload size={16} />
            Import
          </ActionButton>
          <ActionButton variant="primary" onClick={handleCreateNewSOP}>
            <Plus size={16} />
            New SOP
          </ActionButton>
        </div>
      </Header>

      {sopStats && (
        <StatsGrid>
          <StatsCard
            color="#1e40af"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatValue>{sopStats?.total_sops || 0}</StatValue>
            <StatLabel>Total SOPs</StatLabel>
            <StatIcon color="#1e40af">
              <FileText size={24} />
            </StatIcon>
          </StatsCard>

          <StatsCard
            color="#FF6B35"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatValue>{sopStats?.florida_specific || 0}</StatValue>
            <StatLabel>Florida Specific</StatLabel>
            <StatIcon color="#FF6B35">
              <MapPin size={24} />
            </StatIcon>
          </StatsCard>

          <StatsCard
            color="#dc2626"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatValue>{sopStats?.hurricane_related || 0}</StatValue>
            <StatLabel>Hurricane Related</StatLabel>
            <StatIcon color="#dc2626">
              <Wind size={24} />
            </StatIcon>
          </StatsCard>

          <StatsCard
            color="#F59E0B"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StatValue>{sopStats?.osha_related || 0}</StatValue>
            <StatLabel>OSHA Related</StatLabel>
            <StatIcon color="#F59E0B">
              <Shield size={24} />
            </StatIcon>
          </StatsCard>

          <StatsCard
            color="#10B981"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <StatValue>{sopStats?.compliance_rate || 0}%</StatValue>
            <StatLabel>Compliance Rate</StatLabel>
            <StatIcon color="#10B981">
              <CheckCircle size={24} />
            </StatIcon>
          </StatsCard>

          <StatsCard
            color="#dc2626"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <StatValue>{sopStats?.critical_priority || 0}</StatValue>
            <StatLabel>Critical Priority</StatLabel>
            <StatIcon color="#dc2626">
              <AlertTriangle size={24} />
            </StatIcon>
          </StatsCard>
        </StatsGrid>
      )}

      <FilterBar>
        <SearchInput
          type="text"
          placeholder="Search SOPs by title or number..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FilterSelect value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="under_review">Under Review</option>
          <option value="archived">Archived</option>
        </FilterSelect>
        <FilterSelect value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="florida">Florida Specific</option>
          <option value="hurricane">Hurricane Related</option>
          <option value="osha">OSHA Related</option>
          <option value="critical">Critical Priority</option>
        </FilterSelect>
        <ViewModeToggle>
          <ActionButton
            variant="icon"
            active={viewMode === 'grid'}
            onClick={() => handleViewModeChange('grid')}
            title="Grid View"
          >
            <Grid size={16} />
          </ActionButton>
          <ActionButton
            variant="icon"
            active={viewMode === 'list'}
            onClick={() => handleViewModeChange('list')}
            title="List View"
          >
            <List size={16} />
          </ActionButton>
          <ActionButton
            variant="icon"
            active={viewMode === 'categories'}
            onClick={() => handleViewModeChange('categories')}
            title="Category View"
          >
            <Tag size={16} />
          </ActionButton>
        </ViewModeToggle>
        <ActionButton onClick={clearFilters}>
          <Filter size={16} />
          Clear Filters
        </ActionButton>
      </FilterBar>

      <ContentGrid>
        <Sidebar>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>Categories</h3>
          <CategoryList>
            <CategoryItem
              active={selectedCategory === null}
              color="#6b7280"
              onClick={() => setSelectedCategory(null)}
            >
              <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>All Categories</div>
            </CategoryItem>
            {categories.map((category) => (
              <CategoryItem
                key={category.id}
                active={selectedCategory === category.id}
                color={category.color_code}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '600' }}>
                    {category.category_code}
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                    {category.category_name}
                  </div>
                </div>
              </CategoryItem>
            ))}
          </CategoryList>
        </Sidebar>

        <MainContent>
          <TabBar>
            <Tab active={activeTab === 'procedures'} onClick={() => setActiveTab('procedures')}>
              Procedures
            </Tab>
            <Tab active={activeTab === 'forms'} onClick={() => setActiveTab('forms')}>
              Forms & Checklists
            </Tab>
            <Tab active={activeTab === 'manuals'} onClick={() => setActiveTab('manuals')}>
              Manuals
            </Tab>
            <Tab active={activeTab === 'compliance'} onClick={() => setActiveTab('compliance')}>
              Compliance Tracking
            </Tab>
            <Tab active={activeTab === 'workflows'} onClick={() => setActiveTab('workflows')}>
              Automated Workflows
            </Tab>
          </TabBar>

          <AnimatePresence mode="wait">
            {activeTab === 'procedures' && (
              <>
                {loadingProcedures ? (
                  <LoadingSpinner>
                    <div>Loading SOPs...</div>
                  </LoadingSpinner>
                ) : procedures.length === 0 ? (
                  <EmptyState>
                    <FileText size={64} />
                    <h3>No SOPs Found</h3>
                    <p>Try adjusting your filters or search criteria</p>
                  </EmptyState>
                ) : (
                  <>
                    <SOPGrid viewMode={viewMode}>
                      {viewMode === 'categories' ? (
                        groupProceduresByCategory().map(({ category, procedures: categoryProcedures }) => (
                          <CategorySection key={category.id}>
                            <CategoryHeader color={category.color_code}>
                              <CategoryTitle>{category.category_name}</CategoryTitle>
                              <CategoryCount>{categoryProcedures.length} SOPs</CategoryCount>
                            </CategoryHeader>
                            <SOPGrid viewMode="grid">
                              {categoryProcedures.map((procedure) => (
                                <RenderSOPCard key={procedure.id} procedure={procedure} />
                              ))}
                            </SOPGrid>
                          </CategorySection>
                        ))
                      ) : viewMode === 'list' ? (
                        <SOPList>
                          {procedures.map((procedure) => (
                            <RenderSOPListItem key={procedure.id} procedure={procedure} />
                          ))}
                        </SOPList>
                      ) : (
                        procedures.map((procedure) => (
                          <RenderSOPCard key={procedure.id} procedure={procedure} />
                        ))
                      )}
                    </SOPGrid>

                    {pagination.totalPages > 1 && (
                      <PaginationContainer>
                        <PaginationInfo>
                          Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                          {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                          {pagination.total} SOPs
                        </PaginationInfo>
                        <PaginationControls>
                          <PageButton
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                          >
                            <ChevronLeft size={16} />
                          </PageButton>
                          {getVisiblePageNumbers().map((pageNum, index) => (
                            pageNum === '...' ? (
                              <span key={`dots-${index}`} style={{ padding: '0 8px' }}>...</span>
                            ) : (
                              <PageButton
                                key={pageNum}
                                active={pageNum === pagination.page}
                                onClick={() => handlePageChange(pageNum as number)}
                              >
                                {pageNum}
                              </PageButton>
                            )
                          ))}
                          <PageButton
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                          >
                            <ChevronRight size={16} />
                          </PageButton>
                        </PaginationControls>
                      </PaginationContainer>
                    )}
                  </>
                )}
              </>
            )}

            {activeTab === 'forms' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <FormsChecklistsPage />
              </motion.div>
            )}

            {activeTab === 'manuals' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{ padding: '2rem' }}
              >
                <div style={{ textAlign: 'center', color: '#64748b' }}>
                  <BookOpen size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <h3 style={{ marginBottom: '0.5rem', color: '#1e293b' }}>Training Manuals</h3>
                  <p>Comprehensive training manuals and reference materials are being developed.</p>
                  <p>This section will include installation guides, safety manuals, and technical references.</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'compliance' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{ padding: '2rem' }}
              >
                <div style={{ textAlign: 'center', color: '#64748b' }}>
                  <Shield size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <h3 style={{ marginBottom: '0.5rem', color: '#1e293b' }}>Compliance Tracking</h3>
                  <p>Real-time compliance monitoring and reporting dashboard.</p>
                  <p>Track SOP completion, training compliance, and regulatory requirements.</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'workflows' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{ padding: '2rem' }}
              >
                <div style={{ textAlign: 'center', color: '#64748b' }}>
                  <CheckCircle size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <h3 style={{ marginBottom: '0.5rem', color: '#1e293b' }}>Automated Workflows</h3>
                  <p>Intelligent workflow automation for SOP assignments and compliance.</p>
                  <p>Automatic task assignment based on project type, location, and team expertise.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </MainContent>
      </ContentGrid>

      {/* SOP Viewer Modal */}
      {selectedProcedure && (
        <SOPViewerModal
          isOpen={viewerModalOpen}
          onClose={closeViewerModal}
          procedure={selectedProcedure}
          onEdit={handleEditSOP}
          onDuplicate={handleDuplicateSOP}
        />
      )}

      {/* SOP Creation Wizard */}
      <SOPCreationWizard
        isOpen={creationWizardOpen}
        onClose={() => setCreationWizardOpen(false)}
        onSOPCreated={handleSOPCreated}
      />
    </Container>
  );
};

export default SOPManagement;