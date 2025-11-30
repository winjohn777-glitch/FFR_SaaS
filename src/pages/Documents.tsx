import React, { useState } from 'react';
import styled from 'styled-components';
import BrandedModalTitle from '../components/Shared/BrandedModalTitle';
import {
  FileText,
  Upload,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Folder,
  FolderOpen,
  Plus,
  X,
  Save,
  Calendar,
  User,
  Tag,
  FileImage,
  FileSpreadsheet,
  File,
  Image,
  Archive,
  Share,
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield,
  Users,
  Bell,
  Workflow,
  Activity,
  Target,
  Clipboard,
  Settings
} from 'lucide-react';

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

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  height: fit-content;
`;

const SidebarSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SidebarTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FolderItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ theme, active }) => active ? theme.colors.primary + '10' : 'transparent'};
  color: ${({ theme, active }) => active ? theme.colors.primary : theme.colors.text.primary};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const FolderCount = styled.span`
  margin-left: auto;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.light};
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const MainContent = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const ContentHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  padding-left: 2.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.light};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.light};
  pointer-events: none;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
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

const DocumentsGrid = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const DocumentCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const DocumentIcon = styled.div<{ fileType: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  ${({ fileType, theme }) => {
    switch (fileType) {
      case 'pdf':
        return `background-color: ${theme.colors.accent}20; color: ${theme.colors.accent};`;
      case 'image':
        return `background-color: ${theme.colors.secondary}20; color: ${theme.colors.secondary};`;
      case 'spreadsheet':
        return `background-color: ${theme.colors.primary}20; color: ${theme.colors.primary};`;
      case 'document':
        return `background-color: ${theme.colors.roofing.tile}20; color: ${theme.colors.roofing.tile};`;
      default:
        return `background-color: ${theme.colors.text.light}20; color: ${theme.colors.text.secondary};`;
    }
  }}
`;

const DocumentTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  line-height: 1.4;
`;

const DocumentMeta = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const DocumentActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DocumentSize = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.light};
`;

const ActionIcons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ActionIcon = styled.button`
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

// Modal Components (reusing from previous components)
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
  max-width: 500px;
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
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
`;

const UploadArea = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: ${({ theme }) => theme.spacing.md};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primary}05;
  }
`;

const UploadIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
`;

const UploadText = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const UploadSubtext = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
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

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  size: string;
  category: string;
  uploadedBy: string;
  uploadedDate: string;
  tags: string[];
  description?: string;
  jobId?: string;
  customerId?: string;
  contractStatus?: 'draft' | 'pending_review' | 'approved' | 'executed' | 'expired';
  permitStatus?: 'applied' | 'under_review' | 'approved' | 'denied' | 'expired';
  complianceStatus?: 'compliant' | 'non_compliant' | 'needs_review' | 'expired';
  expirationDate?: string;
  reviewDate?: string;
  approvedBy?: string;
  contractValue?: number;
  permitNumber?: string;
  complianceType?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

interface ContractWorkflow {
  id: string;
  documentId: string;
  status: 'draft' | 'legal_review' | 'client_review' | 'negotiation' | 'approved' | 'executed';
  currentStep: number;
  totalSteps: number;
  assignedTo: string;
  dueDate: string;
  comments: string[];
  history: WorkflowHistory[];
}

interface WorkflowHistory {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  comment?: string;
}

interface PermitTracking {
  id: string;
  permitNumber: string;
  permitType: string;
  applicationDate: string;
  expectedApproval: string;
  status: 'applied' | 'under_review' | 'approved' | 'denied' | 'expired';
  jurisdiction: string;
  fees: number;
  requirements: string[];
  inspections: Inspection[];
}

interface Inspection {
  id: string;
  type: string;
  scheduledDate: string;
  status: 'scheduled' | 'passed' | 'failed' | 'pending';
  inspector: string;
  notes?: string;
}

interface ComplianceItem {
  id: string;
  documentId: string;
  complianceType: string;
  status: 'compliant' | 'non_compliant' | 'needs_review' | 'expired';
  lastReview: string;
  nextReview: string;
  requirements: string[];
  violations?: string[];
  remediation?: string;
}

const Documents: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [showContractWorkflowModal, setShowContractWorkflowModal] = useState(false);
  const [showPermitTrackingModal, setShowPermitTrackingModal] = useState(false);
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [showCreateContractModal, setShowCreateContractModal] = useState(false);
  const [showPermitApplicationModal, setShowPermitApplicationModal] = useState(false);
  const [activeTab, setActiveTab] = useState('documents');

  // Sample document data - using state for deletion functionality
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 'DOC001',
      name: 'Insurance Certificate - ABC Corp.pdf',
      type: 'pdf',
      size: '2.4 MB',
      category: 'insurance',
      uploadedBy: 'John Smith',
      uploadedDate: '2024-02-15',
      tags: ['insurance', 'certificate', 'commercial'],
      description: 'Certificate of Insurance for ABC Corp commercial project',
      customerId: 'C001',
      complianceStatus: 'compliant',
      expirationDate: '2024-12-31',
      reviewDate: '2024-11-30',
      complianceType: 'Insurance Coverage',
      priority: 'high'
    },
    {
      id: 'DOC002',
      name: 'Roof Inspection Report - 123 Ocean Blvd.pdf',
      type: 'pdf',
      size: '1.8 MB',
      category: 'reports',
      uploadedBy: 'Mike Johnson',
      uploadedDate: '2024-02-14',
      tags: ['inspection', 'report', 'residential'],
      description: 'Pre-work inspection report for residential re-roof project',
      jobId: 'J001'
    },
    {
      id: 'DOC003',
      name: 'Material Receipt - Shingles.jpg',
      type: 'image',
      size: '856 KB',
      category: 'receipts',
      uploadedBy: 'Sarah Davis',
      uploadedDate: '2024-02-13',
      tags: ['receipt', 'materials', 'shingles'],
      description: 'Receipt for shingle materials delivery',
      jobId: 'J001'
    },
    {
      id: 'DOC004',
      name: 'Cost Estimate - Downtown Office.xlsx',
      type: 'spreadsheet',
      size: '324 KB',
      category: 'estimates',
      uploadedBy: 'John Smith',
      uploadedDate: '2024-02-12',
      tags: ['estimate', 'commercial', 'cost'],
      description: 'Detailed cost estimate for downtown office building project',
      customerId: 'C002'
    },
    {
      id: 'DOC005',
      name: 'Building Permit - City of Cocoa.pdf',
      type: 'pdf',
      size: '1.2 MB',
      category: 'permits',
      uploadedBy: 'Mike Johnson',
      uploadedDate: '2024-02-11',
      tags: ['permit', 'city', 'approval'],
      description: 'Building permit approved by City of Cocoa',
      jobId: 'J002',
      permitStatus: 'approved',
      permitNumber: 'BP-2024-0421',
      expirationDate: '2024-08-11',
      complianceStatus: 'compliant',
      priority: 'critical'
    },
    {
      id: 'DOC006',
      name: 'Before Photo - Williams Estate.jpg',
      type: 'image',
      size: '2.1 MB',
      category: 'photos',
      uploadedBy: 'Sarah Davis',
      uploadedDate: '2024-02-10',
      tags: ['photo', 'before', 'documentation'],
      description: 'Before photo of roof condition at Williams Estate',
      jobId: 'J004'
    },
    {
      id: 'DOC007',
      name: 'Service Contract - Johnson Residence.pdf',
      type: 'pdf',
      size: '1.5 MB',
      category: 'contracts',
      uploadedBy: 'John Smith',
      uploadedDate: '2024-02-09',
      tags: ['contract', 'service', 'residential'],
      description: 'Annual roofing service contract for Johnson Residence',
      customerId: 'C001',
      contractStatus: 'executed',
      contractValue: 25000,
      expirationDate: '2025-02-09',
      complianceStatus: 'compliant',
      priority: 'medium'
    },
    {
      id: 'DOC008',
      name: 'OSHA Safety Compliance Report.pdf',
      type: 'pdf',
      size: '3.2 MB',
      category: 'compliance',
      uploadedBy: 'Safety Officer',
      uploadedDate: '2024-02-08',
      tags: ['osha', 'safety', 'compliance'],
      description: 'Monthly OSHA safety compliance report',
      complianceStatus: 'compliant',
      complianceType: 'OSHA Safety Standards',
      reviewDate: '2024-03-08',
      priority: 'high'
    },
    {
      id: 'DOC009',
      name: 'CertainTeed Landmark Installation Instructions.pdf',
      type: 'pdf',
      size: '181 KB',
      category: 'manufacturer-guides',
      uploadedBy: 'System Auto-Download',
      uploadedDate: '2024-10-18',
      tags: ['certainteed', 'landmark', 'installation', 'shingles', 'hvhz'],
      description: '✅ AVAILABLE - Official CertainTeed installation guide for Landmark shingles in HVHZ areas',
      complianceStatus: 'compliant',
      complianceType: 'Manufacturer Specifications',
      priority: 'high'
    },
    {
      id: 'DOC010',
      name: 'GAF Timberline HDZ Installation Guide.pdf',
      type: 'pdf',
      size: 'Pending',
      category: 'manufacturer-guides',
      uploadedBy: 'Requires GAF Pro Portal Access',
      uploadedDate: 'Pending',
      tags: ['gaf', 'timberline hdz', 'installation', 'shingles', 'hvhz', 'requires-portal'],
      description: '⏳ REQUIRES ACCESS - GAF Professional Portal account needed (gaf.com/professionals)',
      complianceStatus: 'needs_review',
      complianceType: 'Manufacturer Portal Required',
      priority: 'high'
    },
    {
      id: 'DOC011',
      name: 'GAF Fortitude Installation Guide.pdf',
      type: 'pdf',
      size: 'Pending',
      category: 'manufacturer-guides',
      uploadedBy: 'Requires GAF Pro Portal Access',
      uploadedDate: 'Pending',
      tags: ['gaf', 'fortitude', 'installation', 'shingles', 'hvhz', 'requires-portal'],
      description: '⏳ REQUIRES ACCESS - GAF Professional Portal account needed (gaf.com/professionals)',
      complianceStatus: 'needs_review',
      complianceType: 'Manufacturer Portal Required',
      priority: 'high'
    },
    {
      id: 'DOC012',
      name: 'Owens Corning Duration Installation Guide.pdf',
      type: 'pdf',
      size: 'Pending',
      category: 'manufacturer-guides',
      uploadedBy: 'Requires OC Contractor Portal',
      uploadedDate: 'Pending',
      tags: ['owens-corning', 'duration', 'installation', 'shingles', 'hvhz', 'requires-portal'],
      description: '⏳ REQUIRES ACCESS - Owens Corning Contractor Portal account needed',
      complianceStatus: 'needs_review',
      complianceType: 'Manufacturer Portal Required',
      priority: 'high'
    },
    {
      id: 'DOC013',
      name: 'Carlisle Sure-Weld TPO Installation Guide.pdf',
      type: 'pdf',
      size: 'Pending',
      category: 'manufacturer-guides',
      uploadedBy: 'Requires Carlisle Contractor Portal',
      uploadedDate: 'Pending',
      tags: ['carlisle', 'sure-weld', 'tpo', 'membrane', 'commercial', 'requires-portal'],
      description: '⏳ REQUIRES ACCESS - Carlisle Authorized Contractor registration needed',
      complianceStatus: 'needs_review',
      complianceType: 'Manufacturer Portal Required',
      priority: 'high'
    },
    {
      id: 'DOC014',
      name: 'Firestone RubberGard EPDM Installation Guide.pdf',
      type: 'pdf',
      size: 'Pending',
      category: 'manufacturer-guides',
      uploadedBy: 'Requires Firestone Red Shield Portal',
      uploadedDate: 'Pending',
      tags: ['firestone', 'rubbergard', 'epdm', 'membrane', 'commercial', 'requires-portal'],
      description: '⏳ REQUIRES ACCESS - Firestone Red Shield Contractor Program required',
      complianceStatus: 'needs_review',
      complianceType: 'Manufacturer Portal Required',
      priority: 'high'
    },
    {
      id: 'DOC015',
      name: 'Atlas Pinnacle Pristine Installation Guide.pdf',
      type: 'pdf',
      size: 'Pending',
      category: 'manufacturer-guides',
      uploadedBy: 'Requires Atlas Pro Portal',
      uploadedDate: 'Pending',
      tags: ['atlas', 'pinnacle', 'pristine', 'shingles', 'hvhz', 'requires-portal'],
      description: '⏳ REQUIRES ACCESS - Atlas Pro Account needed (atlasroofing.com/contractors)',
      complianceStatus: 'needs_review',
      complianceType: 'Manufacturer Portal Required',
      priority: 'medium'
    },
    {
      id: 'DOC016',
      name: 'Eagle Capistrano Concrete Tile Installation Guide.pdf',
      type: 'pdf',
      size: 'Pending',
      category: 'manufacturer-guides',
      uploadedBy: 'Requires Eagle Contractor Hub',
      uploadedDate: 'Pending',
      tags: ['eagle', 'capistrano', 'concrete-tile', 'hurricane', 'hvhz', 'requires-portal'],
      description: '⏳ REQUIRES ACCESS - Eagle Contractor Hub registration needed',
      complianceStatus: 'needs_review',
      complianceType: 'Manufacturer Portal Required',
      priority: 'medium'
    },
    {
      id: 'DOC017',
      name: 'Bermuda Hurricane Clay Tile Installation Manual.pdf',
      type: 'pdf',
      size: 'Pending',
      category: 'manufacturer-guides',
      uploadedBy: 'Requires Bermuda Installer Portal',
      uploadedDate: 'Pending',
      tags: ['bermuda', 'hurricane', 'clay-tile', 'hurricane-rated', 'hvhz', 'requires-portal'],
      description: '⏳ REQUIRES ACCESS - Bermuda Certified Installer registration needed',
      complianceStatus: 'needs_review',
      complianceType: 'Manufacturer Portal Required',
      priority: 'medium'
    },
    {
      id: 'DOC018',
      name: 'CertainTeed Modified Bitumen Systems Installation Manual.pdf',
      type: 'pdf',
      size: 'Pending',
      category: 'manufacturer-guides',
      uploadedBy: 'Requires CertainTeed Professional Portal',
      uploadedDate: 'Pending',
      tags: ['certainteed', 'modified-bitumen', 'commercial', 'hvhz', 'requires-portal'],
      description: '⏳ REQUIRES ACCESS - CertainTeed Professional Portal account needed',
      complianceStatus: 'needs_review',
      complianceType: 'Manufacturer Portal Required',
      priority: 'high'
    },
    {
      id: 'DOC019',
      name: 'Gulf Coast Corrugated Steel Panel Installation Manual.pdf',
      type: 'pdf',
      size: 'Pending',
      category: 'manufacturer-guides',
      uploadedBy: 'Requires Gulf Coast Contractor Portal',
      uploadedDate: 'Pending',
      tags: ['gulf-coast', 'corrugated-steel', 'metal-roofing', 'hvhz', 'requires-portal'],
      description: '⏳ REQUIRES ACCESS - Gulf Coast Supply contractor account needed',
      complianceStatus: 'needs_review',
      complianceType: 'Manufacturer Portal Required',
      priority: 'medium'
    },
    {
      id: 'DOC020',
      name: 'Gulf Coast Standing Seam Aluminum Installation Guide.pdf',
      type: 'pdf',
      size: 'Pending',
      category: 'manufacturer-guides',
      uploadedBy: 'Requires Gulf Coast Contractor Portal',
      uploadedDate: 'Pending',
      tags: ['gulf-coast', 'standing-seam', 'aluminum', 'metal-roofing', 'hvhz', 'requires-portal'],
      description: '⏳ REQUIRES ACCESS - Gulf Coast Supply contractor account needed',
      complianceStatus: 'needs_review',
      complianceType: 'Manufacturer Portal Required',
      priority: 'medium'
    },
    {
      id: 'DOC021',
      name: 'Malarkey Highlander Shingle Installation Guide.pdf',
      type: 'pdf',
      size: 'Pending',
      category: 'manufacturer-guides',
      uploadedBy: 'Requires Malarkey Professional Portal',
      uploadedDate: 'Pending',
      tags: ['malarkey', 'highlander', 'shingles', 'asphalt', 'hvhz', 'requires-portal'],
      description: '⏳ REQUIRES ACCESS - Malarkey Professional Portal account needed',
      complianceStatus: 'needs_review',
      complianceType: 'Manufacturer Portal Required',
      priority: 'medium'
    },
    {
      id: 'DOC022',
      name: 'Soprema Colphene Self-Adhered Installation Manual.pdf',
      type: 'pdf',
      size: 'Pending',
      category: 'manufacturer-guides',
      uploadedBy: 'Requires Soprema Contractor Portal',
      uploadedDate: 'Pending',
      tags: ['soprema', 'colphene', 'self-adhered', 'modified-bitumen', 'hvhz', 'requires-portal'],
      description: '⏳ REQUIRES ACCESS - Soprema Approved Contractor registration needed',
      complianceStatus: 'needs_review',
      complianceType: 'Manufacturer Portal Required',
      priority: 'high'
    },
    {
      id: 'DOC023',
      name: 'Soprema Sopralene Flam Installation Manual.pdf',
      type: 'pdf',
      size: 'Pending',
      category: 'manufacturer-guides',
      uploadedBy: 'Requires Soprema Contractor Portal',
      uploadedDate: 'Pending',
      tags: ['soprema', 'sopralene-flam', 'modified-bitumen', 'torch-applied', 'hvhz', 'requires-portal'],
      description: '⏳ REQUIRES ACCESS - Soprema Approved Contractor registration needed',
      complianceStatus: 'needs_review',
      complianceType: 'Manufacturer Portal Required',
      priority: 'high'
    },
    {
      id: 'DOC024',
      name: 'Tri County Metal Tile Profile Installation Guide.pdf',
      type: 'pdf',
      size: 'Pending',
      category: 'manufacturer-guides',
      uploadedBy: 'Requires Tri County Trade Portal',
      uploadedDate: 'Pending',
      tags: ['tri-county', 'metal-tile', 'profile-system', 'metal-roofing', 'hvhz', 'requires-portal'],
      description: '⏳ REQUIRES ACCESS - Tri County Metals trade account needed',
      complianceStatus: 'needs_review',
      complianceType: 'Manufacturer Portal Required',
      priority: 'medium'
    },
    {
      id: 'DOC025',
      name: 'Tri County Snap Lock Standing Seam Installation Manual.pdf',
      type: 'pdf',
      size: 'Pending',
      category: 'manufacturer-guides',
      uploadedBy: 'Requires Tri County Trade Portal',
      uploadedDate: 'Pending',
      tags: ['tri-county', 'snap-lock', 'standing-seam', 'steel', 'hvhz', 'requires-portal'],
      description: '⏳ REQUIRES ACCESS - Tri County Metals trade account needed',
      complianceStatus: 'needs_review',
      complianceType: 'Manufacturer Portal Required',
      priority: 'medium'
    },
    {
      id: 'DOC026',
      name: 'Versico VersiWeld TPO Installation Manual.pdf',
      type: 'pdf',
      size: 'Pending',
      category: 'manufacturer-guides',
      uploadedBy: 'Requires Versico Contractor Portal',
      uploadedDate: 'Pending',
      tags: ['versico', 'versiweld', 'tpo', 'membrane', 'commercial', 'hvhz', 'requires-portal'],
      description: '⏳ REQUIRES ACCESS - Versico Contractor Portal account needed',
      complianceStatus: 'needs_review',
      complianceType: 'Manufacturer Portal Required',
      priority: 'high'
    }
  ]);

  const folders = [
    { id: 'all', name: 'All Documents', count: documents.length },
    { id: 'contracts', name: 'Contracts', count: documents.filter(d => d.category === 'contracts').length },
    { id: 'insurance', name: 'Insurance', count: documents.filter(d => d.category === 'insurance').length },
    { id: 'permits', name: 'Permits', count: documents.filter(d => d.category === 'permits').length },
    { id: 'compliance', name: 'Compliance', count: documents.filter(d => d.category === 'compliance').length },
    { id: 'reports', name: 'Reports', count: documents.filter(d => d.category === 'reports').length },
    { id: 'estimates', name: 'Estimates', count: documents.filter(d => d.category === 'estimates').length },
    { id: 'receipts', name: 'Receipts', count: documents.filter(d => d.category === 'receipts').length },
    { id: 'photos', name: 'Photos', count: documents.filter(d => d.category === 'photos').length },
    { id: 'manufacturer-guides', name: 'Manufacturer Guides', count: documents.filter(d => d.category === 'manufacturer-guides').length },
    { id: 'warranties', name: 'Warranties', count: 0 }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesFolder = selectedFolder === 'all' || doc.category === selectedFolder;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || doc.type === filterType;

    return matchesFolder && matchesSearch && matchesType;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText size={24} />;
      case 'image':
        return <Image size={24} />;
      case 'spreadsheet':
        return <FileSpreadsheet size={24} />;
      case 'document':
        return <File size={24} />;
      default:
        return <FileText size={24} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDownloadDocument = (doc: DocumentItem) => {
    // Create a simulated download - in a real app this would download the actual file
    const link = globalThis.document.createElement('a');
    link.href = '#'; // In real app: actual file URL
    link.download = doc.name;
    link.click();

    // Show feedback to user
    alert(`Downloading ${doc.name}\n\nFile size: ${doc.size}\nDownload started...`);
  };

  const handleDeleteDocument = (documentId: string) => {
    const doc = documents.find(d => d.id === documentId);
    if (doc && window.confirm(`Are you sure you want to delete "${doc.name}"?\n\nThis action cannot be undone.`)) {
      setDocuments(documents.filter(d => d.id !== documentId));
      alert(`Document "${doc.name}" has been deleted successfully.`);
    }
  };

  const handleViewDocument = (doc: DocumentItem) => {
    setSelectedDocument(doc);
    setShowViewModal(true);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          <FileText size={28} />
          Document Management
        </PageTitle>
        <HeaderActions>
          <ActionButton
            variant="secondary"
            onClick={() => setShowCreateContractModal(true)}
          >
            <FileText size={16} />
            New Contract
          </ActionButton>
          <ActionButton
            variant="secondary"
            onClick={() => setShowPermitApplicationModal(true)}
          >
            <Clipboard size={16} />
            Apply for Permit
          </ActionButton>
          <ActionButton
            variant="secondary"
            onClick={() => setShowComplianceModal(true)}
          >
            <Shield size={16} />
            Compliance Check
          </ActionButton>
          <ActionButton
            variant="secondary"
            onClick={() => alert('Organizing documents by folder...\n\n• Auto-categorization\n• Bulk operations\n• Archive old documents\n• Create new folders')}
          >
            <Archive size={16} />
            Organize
          </ActionButton>
          <ActionButton
            variant="secondary"
            onClick={() => {
              console.log('🗂️ Loading FFR auto-generated documents...');
              try {
                const ffrDocs = JSON.parse(localStorage.getItem('ffr-documents') || '[]');
                console.log('📋 FFR Documents found:', ffrDocs.length);
                ffrDocs.forEach((doc: any) => {
                  console.log(`  📄 ${doc.name} - ${doc.category} - $${doc.contractValue?.toLocaleString()}`);
                });

                if (ffrDocs.length > 0) {
                  alert(`📂 FFR Document Store Integration\n\nFound ${ffrDocs.length} auto-generated documents:\n\n${ffrDocs.map((doc: any) => `• ${doc.name}\n  Category: ${doc.category}\n  Value: $${doc.contractValue?.toLocaleString()}\n  Status: ${doc.contractStatus}\n`).join('\n')}\n\nDocuments are integrated with DMS workflow system.`);
                } else {
                  alert('📂 FFR Document Store\n\nNo auto-generated documents found yet.\n\nDocuments will be automatically created when:\n• David Johnson project is created\n• GAF HDZ jobs are added\n• Contract workflows are initiated');
                }
              } catch (error) {
                console.warn('Error loading FFR documents:', error);
              }
            }}
          >
            <FileText size={16} />
            FFR Documents
          </ActionButton>
          <ActionButton
            variant="secondary"
            onClick={() => {
              alert('📋 Manufacturer Installation Guide Access Summary\n\n1500 Series SOP Status (18 Total Systems):\n\n✅ AVAILABLE (1):\n• CertainTeed Landmark Installation Guide\n\n⏳ REQUIRES PORTAL ACCESS (17):\n• GAF Timberline HDZ & Fortitude (gaf.com/professionals)\n• Owens Corning Duration (owenscorning.com/contractors)\n• Carlisle Sure-Weld TPO (carlisle-ccm.com/contractors)\n• Firestone RubberGard EPDM (firestonebpe.com/contractors)\n• Atlas Pinnacle Pristine (atlasroofing.com/contractors)\n• Eagle Capistrano Tile (eagleroofing.com/contractors)\n• Bermuda Hurricane Clay Tiles (bermudarooftile.com/contractors)\n• CertainTeed Modified Bitumen (certainteed.com/professionals)\n• Gulf Coast Corrugated Steel & Standing Seam (gulfcoastsupply.com/contractors)\n• Malarkey Highlander (malarkeyroofing.com/professionals)\n• Soprema Colphene & Sopralene Flam (soprema.us/contractors)\n• Tri County Metal Tile & Snap Lock (tricountymetals.com/contractors)\n• Versico VersiWeld TPO (versico.com/contractors)\n\n📞 NEXT STEPS:\n1. Contact manufacturers to establish trade accounts\n2. Register for professional contractor portals\n3. Download installation guides quarterly\n4. See manufacturer-manual-guide.md for detailed instructions\n\nNote: Direct downloads are blocked by manufacturer security. Portal access required.');
            }}
          >
            <Download size={16} />
            Download Mfg Guides
          </ActionButton>
          <ActionButton
            variant="primary"
            onClick={() => setShowUploadModal(true)}
          >
            <Upload size={16} />
            Upload Documents
          </ActionButton>
        </HeaderActions>
      </PageHeader>

      <ContentGrid>
        <Sidebar>
          <SidebarSection>
            <SidebarTitle>Folders</SidebarTitle>
            {folders.map((folder) => (
              <FolderItem
                key={folder.id}
                active={selectedFolder === folder.id}
                onClick={() => setSelectedFolder(folder.id)}
              >
                {selectedFolder === folder.id ? <FolderOpen size={16} /> : <Folder size={16} />}
                {folder.name}
                <FolderCount>{folder.count}</FolderCount>
              </FolderItem>
            ))}
          </SidebarSection>

          <SidebarSection>
            <SidebarTitle>Workflows</SidebarTitle>
            <FolderItem onClick={() => setShowContractWorkflowModal(true)}>
              <Workflow size={16} />
              Contract Workflows
            </FolderItem>
            <FolderItem onClick={() => setShowPermitTrackingModal(true)}>
              <Activity size={16} />
              Permit Tracking
            </FolderItem>
            <FolderItem onClick={() => setShowComplianceModal(true)}>
              <Shield size={16} />
              Compliance Monitor
            </FolderItem>
          </SidebarSection>

          <SidebarSection>
            <SidebarTitle>Quick Actions</SidebarTitle>
            <FolderItem onClick={() => alert('Showing recent documents from last 7 days...')}>
              <Calendar size={16} />
              Recent
            </FolderItem>
            <FolderItem onClick={() => alert('Showing documents shared with team members...')}>
              <Share size={16} />
              Shared
            </FolderItem>
            <FolderItem onClick={() => alert('Showing documents tagged for current user...')}>
              <Tag size={16} />
              Tagged
            </FolderItem>
            <FolderItem onClick={() => alert('Showing documents expiring in next 30 days...')}>
              <AlertTriangle size={16} />
              Expiring Soon
            </FolderItem>
          </SidebarSection>
        </Sidebar>

        <MainContent>
          <ContentHeader>
            <SearchContainer>
              <SearchIcon>
                <Search size={16} />
              </SearchIcon>
              <SearchInput
                placeholder="Search documents, tags, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchContainer>

            <FilterContainer>
              <FilterSelect
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="pdf">PDF Documents</option>
                <option value="image">Images</option>
                <option value="spreadsheet">Spreadsheets</option>
                <option value="document">Word Documents</option>
              </FilterSelect>

              <ActionButton
                variant="secondary"
                onClick={() => alert(`Exporting ${filteredDocuments.length} filtered documents...\n\n• Document list with metadata\n• File links and locations\n• Category and tag information`)}
              >
                <Download size={16} />
                Export
              </ActionButton>
            </FilterContainer>
          </ContentHeader>

          <DocumentsGrid>
            {filteredDocuments.map((doc) => (
              <DocumentCard key={doc.id}>
                <DocumentIcon fileType={doc.type}>
                  {getFileIcon(doc.type)}
                </DocumentIcon>

                <DocumentTitle>{doc.name}</DocumentTitle>

                <DocumentMeta>
                  <div>Uploaded by {doc.uploadedBy}</div>
                  <div>{formatDate(doc.uploadedDate)}</div>
                  {doc.tags && (
                    <div style={{ marginTop: '4px' }}>
                      {doc.tags.map(tag => (
                        <span key={tag} style={{
                          background: '#e2e8f0',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.625rem',
                          marginRight: '4px'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </DocumentMeta>

                <DocumentActions>
                  <DocumentSize>{doc.size}</DocumentSize>
                  <ActionIcons>
                    <ActionIcon
                      onClick={() => handleViewDocument(doc)}
                      title="View document"
                    >
                      <Eye size={14} />
                    </ActionIcon>
                    <ActionIcon
                      onClick={() => {
                        setSelectedDocument(doc);
                        setShowEditModal(true);
                      }}
                      title="Edit document details"
                    >
                      <Edit size={14} />
                    </ActionIcon>
                    <ActionIcon
                      onClick={() => handleDownloadDocument(doc)}
                      title="Download document"
                    >
                      <Download size={14} />
                    </ActionIcon>
                    <ActionIcon
                      onClick={() => handleDeleteDocument(doc.id)}
                      title="Delete document"
                    >
                      <Trash2 size={14} />
                    </ActionIcon>
                  </ActionIcons>
                </DocumentActions>
              </DocumentCard>
            ))}
          </DocumentsGrid>
        </MainContent>
      </ContentGrid>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <ModalOverlay onClick={() => setShowUploadModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <BrandedModalTitle>Upload Documents</BrandedModalTitle>
              <ModalCloseButton onClick={() => setShowUploadModal(false)}>
                <X size={20} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <UploadArea onClick={() => alert('File browser would open here...\n\nSupported formats:\n• PDF, DOC, DOCX\n• JPG, PNG, GIF\n• XLS, XLSX\n• Max file size: 10MB')}>
                <UploadIcon>
                  <Upload size={24} />
                </UploadIcon>
                <UploadText>Click to upload or drag and drop</UploadText>
                <UploadSubtext>PDF, DOC, XLS, JPG up to 10MB</UploadSubtext>
              </UploadArea>

              <FormGroup>
                <FormLabel>Category</FormLabel>
                <FormSelect>
                  <option value="contracts">Contracts</option>
                  <option value="insurance">Insurance</option>
                  <option value="permits">Permits</option>
                  <option value="reports">Reports</option>
                  <option value="estimates">Estimates</option>
                  <option value="receipts">Receipts</option>
                  <option value="photos">Photos</option>
                  <option value="manufacturer-guides">Manufacturer Installation Guides</option>
                  <option value="warranties">Warranties</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>Tags (comma separated)</FormLabel>
                <FormInput
                  placeholder="e.g. insurance, commercial, urgent"
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Description</FormLabel>
                <FormTextarea
                  placeholder="Brief description of the document..."
                />
              </FormGroup>

              <FormGroup>
                <FormLabel>Link to Job (Optional)</FormLabel>
                <FormSelect>
                  <option value="">Select a job...</option>
                  <option value="J001">RR-2024-001 - 123 Ocean Blvd Re-roof</option>
                  <option value="J002">CM-2024-002 - Downtown Office Building</option>
                  <option value="J003">RP-2024-003 - 456 Palm St Repair</option>
                  <option value="J004">EM-2024-004 - 789 Beach Rd Emergency</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>Link to Customer (Optional)</FormLabel>
                <FormSelect>
                  <option value="">Select a customer...</option>
                  <option value="C001">Johnson Family</option>
                  <option value="C002">ABC Corp</option>
                  <option value="C003">Smith Residence</option>
                  <option value="C004">Williams Estate</option>
                </FormSelect>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <ModalButton
                variant="primary"
                onClick={() => {
                  alert('Documents uploaded successfully!\n\n• Files processed and categorized\n• OCR text extraction completed\n• Automatic tagging applied\n• Notifications sent to team');
                  setShowUploadModal(false);
                }}
              >
                <Upload size={16} />
                Upload
              </ModalButton>
              <ModalButton variant="secondary" onClick={() => setShowUploadModal(false)}>
                Cancel
              </ModalButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Edit Document Modal */}
      {showEditModal && selectedDocument && (
        <ModalOverlay onClick={() => setShowEditModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <BrandedModalTitle>Edit Document Details</BrandedModalTitle>
              <ModalCloseButton onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <FormLabel>Document Name</FormLabel>
                <FormInput defaultValue={selectedDocument.name} />
              </FormGroup>

              <FormGroup>
                <FormLabel>Category</FormLabel>
                <FormSelect defaultValue={selectedDocument.category}>
                  <option value="contracts">Contracts</option>
                  <option value="insurance">Insurance</option>
                  <option value="permits">Permits</option>
                  <option value="reports">Reports</option>
                  <option value="estimates">Estimates</option>
                  <option value="receipts">Receipts</option>
                  <option value="photos">Photos</option>
                  <option value="manufacturer-guides">Manufacturer Installation Guides</option>
                  <option value="warranties">Warranties</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>Tags (comma separated)</FormLabel>
                <FormInput defaultValue={selectedDocument.tags.join(', ')} />
              </FormGroup>

              <FormGroup>
                <FormLabel>Description</FormLabel>
                <FormTextarea defaultValue={selectedDocument.description} />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <ModalButton
                variant="primary"
                onClick={() => {
                  alert(`Document "${selectedDocument.name}" updated successfully!\n\n• Metadata updated\n• Search index refreshed\n• Team notifications sent`);
                  setShowEditModal(false);
                  setSelectedDocument(null);
                }}
              >
                <Save size={16} />
                Save Changes
              </ModalButton>
              <ModalButton variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </ModalButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Document Viewer Modal */}
      {showViewModal && selectedDocument && (
        <ModalOverlay onClick={() => setShowViewModal(false)}>
          <ModalContent
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '800px', maxHeight: '90vh' }}
          >
            <ModalHeader>
              <BrandedModalTitle>Document Viewer</BrandedModalTitle>
              <ModalCloseButton onClick={() => setShowViewModal(false)}>
                <X size={20} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{selectedDocument.name}</h3>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                  <span>Size: {selectedDocument.size}</span>
                  <span>Type: {selectedDocument.type.toUpperCase()}</span>
                  <span>Uploaded: {formatDate(selectedDocument.uploadedDate)}</span>
                </div>
                {selectedDocument.description && (
                  <p style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>{selectedDocument.description}</p>
                )}
                {selectedDocument.tags && selectedDocument.tags.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ fontSize: '0.875rem' }}>Tags: </strong>
                    {selectedDocument.tags.map(tag => (
                      <span key={tag} style={{
                        background: '#e2e8f0',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        marginRight: '4px'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Document Preview Area */}
              <div style={{
                border: '2px dashed #e2e8f0',
                borderRadius: '8px',
                padding: '3rem',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                minHeight: '300px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DocumentIcon fileType={selectedDocument.type} style={{ marginBottom: '1rem' }}>
                  {getFileIcon(selectedDocument.type)}
                </DocumentIcon>
                <h4 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Document Preview</h4>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  {selectedDocument.type === 'pdf' && 'PDF document preview would appear here'}
                  {selectedDocument.type === 'image' && 'Image preview would appear here'}
                  {selectedDocument.type === 'spreadsheet' && 'Spreadsheet preview would appear here'}
                  {selectedDocument.type === 'document' && 'Document preview would appear here'}
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <ModalButton
                    variant="primary"
                    onClick={() => handleDownloadDocument(selectedDocument)}
                  >
                    <Download size={16} />
                    Download
                  </ModalButton>
                  <ModalButton
                    variant="secondary"
                    onClick={() => {
                      setShowViewModal(false);
                      setShowEditModal(true);
                    }}
                  >
                    <Edit size={16} />
                    Edit Details
                  </ModalButton>
                </div>
              </div>

              {/* Document Metadata */}
              <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div><strong>Uploaded by:</strong> {selectedDocument.uploadedBy}</div>
                  <div><strong>Category:</strong> {selectedDocument.category}</div>
                  {selectedDocument.jobId && (
                    <div><strong>Job ID:</strong> {selectedDocument.jobId}</div>
                  )}
                  {selectedDocument.customerId && (
                    <div><strong>Customer ID:</strong> {selectedDocument.customerId}</div>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <ModalButton variant="secondary" onClick={() => setShowViewModal(false)}>
                Close
              </ModalButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Contract Workflow Management Modal */}
      {showContractWorkflowModal && (
        <ModalOverlay onClick={() => setShowContractWorkflowModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
            <ModalHeader>
              <BrandedModalTitle>Contract Workflow Management</BrandedModalTitle>
              <ModalCloseButton onClick={() => setShowContractWorkflowModal(false)}>
                <X size={20} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Workflow size={20} />
                  Active Contract Workflows
                </h3>

                {/* Contract Workflow Items */}
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1rem',
                    backgroundColor: '#fef7f0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontWeight: 600 }}>Service Contract - Johnson Residence</h4>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        backgroundColor: '#fbbf24',
                        color: 'white'
                      }}>
                        Client Review
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      <p>Step 3 of 5 • Due: Feb 25, 2024 • Assigned to: Legal Team</p>
                      <p>Contract value: $25,000 • Last updated: 2 hours ago</p>
                    </div>
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                      <button style={{
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px'
                      }}>
                        View Details
                      </button>
                      <button style={{
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px'
                      }}>
                        Advance Workflow
                      </button>
                    </div>
                  </div>

                  <div style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1rem',
                    backgroundColor: '#f0f9ff'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontWeight: 600 }}>Commercial Contract - ABC Corp</h4>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        backgroundColor: '#3b82f6',
                        color: 'white'
                      }}>
                        Legal Review
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      <p>Step 2 of 5 • Due: Feb 28, 2024 • Assigned to: John Smith</p>
                      <p>Contract value: $150,000 • Last updated: 1 day ago</p>
                    </div>
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                      <button style={{
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px'
                      }}>
                        View Details
                      </button>
                      <button style={{
                        padding: '4px 8px',
                        fontSize: '0.75rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px'
                      }}>
                        Advance Workflow
                      </button>
                    </div>
                  </div>
                </div>

                <h3 style={{ fontWeight: 600, margin: '1.5rem 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Target size={20} />
                  Workflow Statistics
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>12</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Active Contracts</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>3</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Pending Review</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af' }}>8</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Executed This Month</div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <ModalButton
                variant="primary"
                onClick={() => {
                  alert('Contract workflow management features:\n\n• Automated approval routing\n• Document versioning\n• E-signature integration\n• Deadline tracking\n• Stakeholder notifications');
                  setShowContractWorkflowModal(false);
                }}
              >
                <Settings size={16} />
                Configure Workflows
              </ModalButton>
              <ModalButton variant="secondary" onClick={() => setShowContractWorkflowModal(false)}>
                Close
              </ModalButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Permit Tracking Modal */}
      {showPermitTrackingModal && (
        <ModalOverlay onClick={() => setShowPermitTrackingModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
            <ModalHeader>
              <BrandedModalTitle>Permit Tracking Dashboard</BrandedModalTitle>
              <ModalCloseButton onClick={() => setShowPermitTrackingModal(false)}>
                <X size={20} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={20} />
                  Active Permit Applications
                </h3>

                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1rem',
                    backgroundColor: '#f0fdf4'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontWeight: 600 }}>Building Permit - City of Cocoa (BP-2024-0421)</h4>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        backgroundColor: '#10b981',
                        color: 'white'
                      }}>
                        Approved
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                      <p>Applied: Feb 1, 2024 • Approved: Feb 11, 2024 • Expires: Aug 11, 2024</p>
                      <p>Jurisdiction: City of Cocoa • Fees: $450.00 • Project: Downtown Office</p>
                    </div>
                    <div style={{ marginTop: '0.5rem' }}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Required Inspections:</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <CheckCircle size={14} style={{ color: '#10b981' }} />
                          <span style={{ fontSize: '0.75rem' }}>Foundation (Passed - Feb 15)</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock size={14} style={{ color: '#f59e0b' }} />
                          <span style={{ fontSize: '0.75rem' }}>Framing (Scheduled - Feb 28)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1rem',
                    backgroundColor: '#fef3c7'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontWeight: 600 }}>Roofing Permit - Brevard County (RP-2024-0134)</h4>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        backgroundColor: '#f59e0b',
                        color: 'white'
                      }}>
                        Under Review
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      <p>Applied: Feb 10, 2024 • Expected Approval: Feb 24, 2024</p>
                      <p>Jurisdiction: Brevard County • Fees: $275.00 • Project: Williams Estate</p>
                    </div>
                  </div>
                </div>

                <h3 style={{ fontWeight: 600, margin: '1.5rem 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Bell size={20} />
                  Permit Alerts & Reminders
                </h3>

                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: '#fef2f2',
                    borderLeft: '4px solid #dc2626',
                    borderRadius: '4px'
                  }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Building Permit BP-2024-0421 expires in 6 months</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Plan renewal process to avoid project delays</div>
                  </div>
                  <div style={{
                    padding: '0.75rem',
                    backgroundColor: '#fffbeb',
                    borderLeft: '4px solid #f59e0b',
                    borderRadius: '4px'
                  }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Framing inspection scheduled for Feb 28</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Ensure work is completed and site is ready</div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <ModalButton
                variant="primary"
                onClick={() => {
                  alert('Permit tracking features:\n\n• Automated status updates\n• Inspection scheduling\n• Expiration alerts\n• Fee tracking\n• Multi-jurisdiction support\n• Integration with project management');
                  setShowPermitTrackingModal(false);
                }}
              >
                <Activity size={16} />
                Manage Permits
              </ModalButton>
              <ModalButton variant="secondary" onClick={() => setShowPermitTrackingModal(false)}>
                Close
              </ModalButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Compliance Management Modal */}
      {showComplianceModal && (
        <ModalOverlay onClick={() => setShowComplianceModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
            <ModalHeader>
              <BrandedModalTitle>Compliance Management Center</BrandedModalTitle>
              <ModalCloseButton onClick={() => setShowComplianceModal(false)}>
                <X size={20} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={20} />
                  Compliance Dashboard
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669' }}>85%</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Overall Compliance</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>3</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Critical Issues</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#fffbeb', borderRadius: '8px' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>12</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Needs Review</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>7</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Expiring Soon</div>
                  </div>
                </div>

                <h4 style={{ fontWeight: 600, marginBottom: '1rem' }}>Compliance Categories</h4>

                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1rem',
                    backgroundColor: '#f0fdf4'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h5 style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Shield size={16} />
                        OSHA Safety Standards
                      </h5>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        backgroundColor: '#10b981',
                        color: 'white'
                      }}>
                        Compliant
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      <p>Last Review: Feb 8, 2024 • Next Review: Mar 8, 2024</p>
                      <p>Safety training up to date • PPE inventory sufficient • Incident reports filed</p>
                    </div>
                  </div>

                  <div style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1rem',
                    backgroundColor: '#fef2f2'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h5 style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertTriangle size={16} />
                        Insurance Coverage
                      </h5>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        backgroundColor: '#dc2626',
                        color: 'white'
                      }}>
                        Expires Soon
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      <p>Policy expires: Dec 31, 2024 • Coverage: $2M General Liability</p>
                      <p>Action needed: Renew policy before expiration</p>
                    </div>
                  </div>

                  <div style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1rem',
                    backgroundColor: '#fffbeb'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h5 style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={16} />
                        Employee Certifications
                      </h5>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        backgroundColor: '#f59e0b',
                        color: 'white'
                      }}>
                        Needs Review
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      <p>3 employees need safety recertification • 2 CDL renewals due</p>
                      <p>Schedule training sessions and renewal processes</p>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <ModalButton
                variant="primary"
                onClick={() => {
                  alert('Compliance management features:\n\n• Automated compliance monitoring\n• Expiration alerts\n• Regulatory updates\n• Audit trail maintenance\n• Certificate tracking\n• Violation remediation\n• Training schedule management');
                  setShowComplianceModal(false);
                }}
              >
                <Shield size={16} />
                Manage Compliance
              </ModalButton>
              <ModalButton variant="secondary" onClick={() => setShowComplianceModal(false)}>
                Close
              </ModalButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Create Contract Modal */}
      {showCreateContractModal && (
        <ModalOverlay onClick={() => setShowCreateContractModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <BrandedModalTitle>Create New Contract</BrandedModalTitle>
              <ModalCloseButton onClick={() => setShowCreateContractModal(false)}>
                <X size={20} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <FormLabel>Contract Type</FormLabel>
                <FormSelect>
                  <option value="service">Service Contract</option>
                  <option value="maintenance">Maintenance Agreement</option>
                  <option value="construction">Construction Contract</option>
                  <option value="repair">Repair Agreement</option>
                  <option value="emergency">Emergency Service</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>Customer</FormLabel>
                <FormSelect>
                  <option value="">Select customer...</option>
                  <option value="C001">Johnson Family</option>
                  <option value="C002">ABC Corp</option>
                  <option value="C003">Smith Residence</option>
                  <option value="C004">Williams Estate</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>Contract Value</FormLabel>
                <FormInput type="number" placeholder="Enter contract value" />
              </FormGroup>

              <FormGroup>
                <FormLabel>Contract Duration</FormLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <FormInput type="date" placeholder="Start Date" />
                  <FormInput type="date" placeholder="End Date" />
                </div>
              </FormGroup>

              <FormGroup>
                <FormLabel>Scope of Work</FormLabel>
                <FormTextarea placeholder="Describe the work to be performed..." />
              </FormGroup>

              <FormGroup>
                <FormLabel>Terms and Conditions</FormLabel>
                <FormSelect>
                  <option value="standard">Standard Terms</option>
                  <option value="commercial">Commercial Terms</option>
                  <option value="emergency">Emergency Terms</option>
                  <option value="custom">Custom Terms</option>
                </FormSelect>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <ModalButton
                variant="primary"
                onClick={() => {
                  alert('Contract created successfully!\n\n• Contract draft generated\n• Workflow initiated\n• Legal review scheduled\n• Stakeholders notified');
                  setShowCreateContractModal(false);
                }}
              >
                <FileText size={16} />
                Create Contract
              </ModalButton>
              <ModalButton variant="secondary" onClick={() => setShowCreateContractModal(false)}>
                Cancel
              </ModalButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Permit Application Modal */}
      {showPermitApplicationModal && (
        <ModalOverlay onClick={() => setShowPermitApplicationModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <BrandedModalTitle>Submit Permit Application</BrandedModalTitle>
              <ModalCloseButton onClick={() => setShowPermitApplicationModal(false)}>
                <X size={20} />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <FormLabel>Permit Type</FormLabel>
                <FormSelect>
                  <option value="building">Building Permit</option>
                  <option value="roofing">Roofing Permit</option>
                  <option value="electrical">Electrical Permit</option>
                  <option value="plumbing">Plumbing Permit</option>
                  <option value="demolition">Demolition Permit</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>Jurisdiction</FormLabel>
                <FormSelect>
                  <option value="">Select jurisdiction...</option>
                  <option value="cocoa">City of Cocoa</option>
                  <option value="brevard">Brevard County</option>
                  <option value="melbourne">City of Melbourne</option>
                  <option value="titusville">City of Titusville</option>
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel>Project Address</FormLabel>
                <FormTextarea placeholder="Enter complete project address..." />
              </FormGroup>

              <FormGroup>
                <FormLabel>Scope of Work</FormLabel>
                <FormTextarea placeholder="Describe the work requiring permits..." />
              </FormGroup>

              <FormGroup>
                <FormLabel>Estimated Project Value</FormLabel>
                <FormInput type="number" placeholder="Enter estimated value" />
              </FormGroup>

              <FormGroup>
                <FormLabel>Expected Start Date</FormLabel>
                <FormInput type="date" />
              </FormGroup>

              <FormGroup>
                <FormLabel>Link to Project</FormLabel>
                <FormSelect>
                  <option value="">Select project...</option>
                  <option value="J001">RR-2024-001 - 123 Ocean Blvd Re-roof</option>
                  <option value="J002">CM-2024-002 - Downtown Office Building</option>
                  <option value="J003">RP-2024-003 - 456 Palm St Repair</option>
                  <option value="J004">EM-2024-004 - 789 Beach Rd Emergency</option>
                </FormSelect>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <ModalButton
                variant="primary"
                onClick={() => {
                  alert('Permit application submitted successfully!\n\n• Application filed with jurisdiction\n• Tracking number assigned\n• Fees calculated and invoiced\n• Team notifications sent\n• Timeline estimates provided');
                  setShowPermitApplicationModal(false);
                }}
              >
                <Clipboard size={16} />
                Submit Application
              </ModalButton>
              <ModalButton variant="secondary" onClick={() => setShowPermitApplicationModal(false)}>
                Cancel
              </ModalButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default Documents;