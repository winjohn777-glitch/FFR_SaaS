import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  CheckSquare,
  Shield,
  Wrench,
  AlertTriangle,
  Building,
  Download,
  Eye,
  Plus,
  User,
  MapPin,
  ExternalLink,
  Tag,
  Users,
  Clock,
  Wind,
  BookOpen
} from 'lucide-react';

// Enhanced FormData interface with SOP linking
interface FormData {
  id: string;
  form_code: string;
  form_name: string;
  description: string;
  category: string;
  subcategory: string;
  form_type: string;
  series_number: number;
  sop_id: string;
  sop_title: string;
  is_required: boolean;
  is_existing: boolean;
  priority_level: number;
  florida_specific: boolean;
  hurricane_related: boolean;
  osha_related: boolean;
  completion_time_minutes: number;
  digital_signature_required: boolean;
  approval_required: boolean;
  usage_frequency: string;
  target_roles: string[];
}

const PageContainer = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 30px;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
`;

const PageDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  gap: 15px;
`;

const StatIcon = styled.div<{ color: string }>`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: ${props => props.color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatNumber = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ControlsBar = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 300px;
  padding: 12px 16px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  background: white;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  ${({ variant = 'secondary', theme }) => {
    if (variant === 'primary') {
      return `
        background: ${theme.colors.primary};
        color: white;
        &:hover {
          background: ${theme.colors.primary}dd;
        }
      `;
    }
    return `
      background: white;
      color: ${theme.colors.text.primary};
      border: 2px solid ${theme.colors.border};
      &:hover {
        border-color: ${theme.colors.primary};
      }
    `;
  }}
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 25px;
  overflow-x: auto;
  padding: 4px;
`;

const CategoryTab = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  ${({ active, theme }) => {
    if (active) {
      return `
        background: ${theme.colors.primary};
        color: white;
      `;
    }
    return `
      background: white;
      color: ${theme.colors.text.secondary};
      border: 2px solid ${theme.colors.border};
      &:hover {
        border-color: ${theme.colors.primary};
        color: ${theme.colors.primary};
      }
    `;
  }}
`;

const FormsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
`;

const FormCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  transition: all 0.2s;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const FormCardHeader = styled.div<{ category: string }>`
  padding: 20px;
  background: ${({ category }) => {
    switch (category) {
      case 'safety': return '#fef2f2';
      case 'operations': return '#f0f9ff';
      case 'compliance': return '#faf5ff';
      case 'emergency': return '#fff7ed';
      case 'administrative': return '#f9fafb';
      default: return '#f9fafb';
    }
  }};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const FormTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
  line-height: 1.4;
`;

const FormCode = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.background};
  padding: 4px 8px;
  border-radius: 4px;
`;

const FormCardContent = styled.div`
  padding: 20px;
`;

const FormDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 15px;
  line-height: 1.5;
`;

const FormMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 15px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FormBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
`;

const Badge = styled.span<{ type: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;

  ${({ type }) => {
    switch (type) {
      case 'required':
        return 'background: #fef2f2; color: #dc2626;';
      case 'florida':
        return 'background: #f0f9ff; color: #0284c7;';
      case 'hurricane':
        return 'background: #fff7ed; color: #ea580c;';
      case 'osha':
        return 'background: #faf5ff; color: #9333ea;';
      case 'signature':
        return 'background: #f6ffed; color: #389e0d;';
      default:
        return 'background: #f9fafb; color: #6b7280;';
    }
  }}
`;

const SOPLink = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  margin-bottom: 15px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SOPLinkText = styled.div`
  flex: 1;
  line-height: 1.4;
`;

const SOPCode = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const PriorityBadge = styled.span<{ priority: number }>`
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;

  ${({ priority }) => {
    switch (priority) {
      case 1:
        return 'background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;';
      case 2:
        return 'background: #fff7ed; color: #ea580c; border: 1px solid #fed7aa;';
      case 3:
        return 'background: #f0f9ff; color: #0284c7; border: 1px solid #bae6fd;';
      default:
        return 'background: #f9fafb; color: #6b7280; border: 1px solid #e5e7eb;';
    }
  }}
`;

const StatusIndicator = styled.div<{ existing: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;

  ${({ existing }) =>
    existing
      ? 'background: #f6ffed; color: #389e0d; border: 1px solid #b7eb8f;'
      : 'background: #fff2f0; color: #cf1322; border: 1px solid #ffccc7;'
  }
`;

const SeriesBadge = styled.span<{ series: number }>`
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 600;
  background: ${({ series }) => {
    switch (series) {
      case 1000: return '#fef2f2';
      case 3000: return '#f0f9ff';
      case 4000: return '#f0fdf4';
      case 5000: return '#faf5ff';
      case 6000: return '#fff7ed';
      default: return '#f9fafb';
    }
  }};
  color: ${({ series }) => {
    switch (series) {
      case 1000: return '#dc2626';
      case 3000: return '#0284c7';
      case 4000: return '#16a34a';
      case 5000: return '#9333ea';
      case 6000: return '#ea580c';
      default: return '#6b7280';
    }
  }};
  border: 1px solid ${({ series }) => {
    switch (series) {
      case 1000: return '#fecaca';
      case 3000: return '#bae6fd';
      case 4000: return '#bbf7d0';
      case 5000: return '#e9d5ff';
      case 6000: return '#fed7aa';
      default: return '#e5e7eb';
    }
  }};
`;

const FormActions = styled.div`
  display: flex;
  gap: 8px;
`;

const FormActionButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background: white;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }

  &.primary {
    background: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    color: white;

    &:hover {
      background: ${({ theme }) => theme.colors.primary}dd;
    }
  }

  &.secondary {
    background: ${({ theme }) => theme.colors.background};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};

    &:hover {
      background: ${({ theme }) => theme.colors.primary};
      color: white;
    }
  }
`;

const FormsChecklistsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [forms, setForms] = useState<FormData[]>([]);

  // Enhanced sample data with comprehensive forms catalog and SOP linking
  useEffect(() => {
    const sampleForms: FormData[] = [
      // 1000 Series - Safety & OSHA Compliance
      {
        id: '1',
        form_code: 'FORM-1000-01',
        form_name: 'Daily Safety Inspection Checklist',
        description: 'Comprehensive daily safety inspection for roof work sites',
        category: 'safety',
        subcategory: 'daily_safety',
        form_type: 'checklist',
        series_number: 1000,
        sop_id: 'SOP-1001',
        sop_title: 'Roof Safety Inspection and Assessment',
        is_required: true,
        is_existing: true,
        priority_level: 1,
        florida_specific: true,
        hurricane_related: false,
        osha_related: true,
        completion_time_minutes: 20,
        digital_signature_required: true,
        approval_required: true,
        usage_frequency: 'daily',
        target_roles: ['Safety Coordinator', 'Crew Leader', 'Supervisor']
      },
      {
        id: '2',
        form_code: 'FORM-1000-02',
        form_name: 'Fall Protection Equipment Inspection',
        description: 'Pre-use inspection of fall protection equipment',
        category: 'safety',
        subcategory: 'fall_protection',
        form_type: 'form',
        series_number: 1000,
        sop_id: 'SOP-1002',
        sop_title: 'Fall Protection Systems Management',
        is_required: true,
        is_existing: true,
        priority_level: 1,
        florida_specific: true,
        hurricane_related: false,
        osha_related: true,
        completion_time_minutes: 15,
        digital_signature_required: true,
        approval_required: true,
        usage_frequency: 'daily',
        target_roles: ['Safety Coordinator', 'Crew Members']
      },
      {
        id: '3',
        form_code: 'FORM-1000-03',
        form_name: 'Incident/Accident Report',
        description: 'Detailed incident and accident reporting form',
        category: 'safety',
        subcategory: 'incident_reporting',
        form_type: 'report',
        series_number: 1000,
        sop_id: 'SOP-1005',
        sop_title: 'Incident Reporting and Investigation',
        is_required: true,
        is_existing: true,
        priority_level: 1,
        florida_specific: false,
        hurricane_related: false,
        osha_related: true,
        completion_time_minutes: 25,
        digital_signature_required: true,
        approval_required: true,
        usage_frequency: 'as-needed',
        target_roles: ['All Employees', 'Safety Coordinator', 'Management']
      },
      {
        id: '4',
        form_code: 'FORM-1000-06',
        form_name: 'PPE Inspection and Issue Log',
        description: 'Personal protective equipment tracking and issue log',
        category: 'safety',
        subcategory: 'ppe_management',
        form_type: 'log',
        series_number: 1000,
        sop_id: 'SOP-1004',
        sop_title: 'Personal Protective Equipment Management',
        is_required: true,
        is_existing: false,
        priority_level: 2,
        florida_specific: false,
        hurricane_related: false,
        osha_related: true,
        completion_time_minutes: 10,
        digital_signature_required: true,
        approval_required: false,
        usage_frequency: 'daily',
        target_roles: ['Safety Coordinator', 'Equipment Manager']
      },
      // 3000 Series - Quality Control
      {
        id: '5',
        form_code: 'FORM-3000-01',
        form_name: 'Material Delivery Inspection',
        description: 'Material delivery inspection and acceptance checklist',
        category: 'operations',
        subcategory: 'material_control',
        form_type: 'checklist',
        series_number: 3000,
        sop_id: 'SOP-3010',
        sop_title: 'Material Inspection and Acceptance',
        is_required: true,
        is_existing: true,
        priority_level: 1,
        florida_specific: false,
        hurricane_related: false,
        osha_related: false,
        completion_time_minutes: 20,
        digital_signature_required: true,
        approval_required: true,
        usage_frequency: 'project-based',
        target_roles: ['Quality Control Inspector', 'Crew Leader']
      },
      {
        id: '6',
        form_code: 'FORM-3000-07',
        form_name: 'Daily Installation Quality Inspection',
        description: 'Daily installation quality inspection checklist',
        category: 'operations',
        subcategory: 'installation_control',
        form_type: 'checklist',
        series_number: 3000,
        sop_id: 'SOP-3020',
        sop_title: 'Installation Quality Control',
        is_required: true,
        is_existing: false,
        priority_level: 1,
        florida_specific: false,
        hurricane_related: false,
        osha_related: false,
        completion_time_minutes: 15,
        digital_signature_required: true,
        approval_required: true,
        usage_frequency: 'daily',
        target_roles: ['Quality Control Inspector', 'Supervisor']
      },
      // 4000 Series - Customer Service
      {
        id: '7',
        form_code: 'FORM-4000-01',
        form_name: 'Customer Satisfaction Survey',
        description: 'Customer satisfaction survey and feedback form',
        category: 'customer',
        subcategory: 'satisfaction',
        form_type: 'form',
        series_number: 4000,
        sop_id: 'SOP-4010',
        sop_title: 'Customer Service Excellence',
        is_required: true,
        is_existing: true,
        priority_level: 2,
        florida_specific: false,
        hurricane_related: false,
        osha_related: false,
        completion_time_minutes: 10,
        digital_signature_required: true,
        approval_required: false,
        usage_frequency: 'project-based',
        target_roles: ['Customer Service Rep', 'Project Manager']
      },
      {
        id: '8',
        form_code: 'FORM-4000-02',
        form_name: 'Lead Qualification Form',
        description: 'Lead intake and qualification assessment form',
        category: 'customer',
        subcategory: 'lead_management',
        form_type: 'form',
        series_number: 4000,
        sop_id: 'SOP-4001',
        sop_title: 'Customer Contact and Lead Management',
        is_required: true,
        is_existing: false,
        priority_level: 2,
        florida_specific: false,
        hurricane_related: false,
        osha_related: false,
        completion_time_minutes: 15,
        digital_signature_required: true,
        approval_required: false,
        usage_frequency: 'daily',
        target_roles: ['Sales Representative', 'Customer Service Rep']
      },
      // 5000 Series - Administrative
      {
        id: '9',
        form_code: 'FORM-5000-01',
        form_name: 'Employee Onboarding Checklist',
        description: 'Comprehensive employee onboarding and orientation checklist',
        category: 'administrative',
        subcategory: 'human_resources',
        form_type: 'checklist',
        series_number: 5000,
        sop_id: 'SOP-5001',
        sop_title: 'Employee Onboarding and Orientation',
        is_required: true,
        is_existing: true,
        priority_level: 1,
        florida_specific: false,
        hurricane_related: false,
        osha_related: false,
        completion_time_minutes: 60,
        digital_signature_required: true,
        approval_required: true,
        usage_frequency: 'as-needed',
        target_roles: ['HR Manager', 'Direct Supervisor']
      },
      {
        id: '10',
        form_code: 'FORM-5000-21',
        form_name: 'Permit Application Checklist',
        description: 'Building permit application preparation checklist',
        category: 'compliance',
        subcategory: 'regulatory',
        form_type: 'checklist',
        series_number: 5000,
        sop_id: 'SOP-2001',
        sop_title: 'Building Permits and Code Compliance',
        is_required: true,
        is_existing: false,
        priority_level: 1,
        florida_specific: true,
        hurricane_related: false,
        osha_related: false,
        completion_time_minutes: 25,
        digital_signature_required: true,
        approval_required: true,
        usage_frequency: 'project-based',
        target_roles: ['Permit Coordinator', 'Project Manager']
      },
      // 6000 Series - Emergency Response
      {
        id: '11',
        form_code: 'FORM-6000-01',
        form_name: 'Hurricane Preparation Checklist',
        description: 'Comprehensive hurricane preparation and site securing checklist',
        category: 'emergency',
        subcategory: 'hurricane_prep',
        form_type: 'checklist',
        series_number: 6000,
        sop_id: 'SOP-6001',
        sop_title: 'Hurricane Preparedness and Response',
        is_required: true,
        is_existing: true,
        priority_level: 1,
        florida_specific: true,
        hurricane_related: true,
        osha_related: false,
        completion_time_minutes: 45,
        digital_signature_required: true,
        approval_required: true,
        usage_frequency: 'seasonal',
        target_roles: ['Emergency Coordinator', 'Operations Manager']
      },
      {
        id: '12',
        form_code: 'FORM-6000-07',
        form_name: 'Damage Assessment Report',
        description: 'Post-hurricane damage assessment and recovery planning report',
        category: 'emergency',
        subcategory: 'damage_assessment',
        form_type: 'report',
        series_number: 6000,
        sop_id: 'SOP-6003',
        sop_title: 'Post-Emergency Recovery',
        is_required: true,
        is_existing: false,
        priority_level: 1,
        florida_specific: true,
        hurricane_related: true,
        osha_related: false,
        completion_time_minutes: 60,
        digital_signature_required: true,
        approval_required: true,
        usage_frequency: 'as-needed',
        target_roles: ['Emergency Coordinator', 'Project Manager']
      },
      // Specialized Forms
      {
        id: '13',
        form_code: 'METAL-001',
        form_name: 'Metal Roofing System Design Checklist',
        description: 'Metal roofing system design and engineering checklist',
        category: 'operations',
        subcategory: 'metal_roofing',
        form_type: 'checklist',
        series_number: 2000,
        sop_id: 'SOP-2060',
        sop_title: 'Metal Roofing Design and Engineering',
        is_required: true,
        is_existing: false,
        priority_level: 2,
        florida_specific: true,
        hurricane_related: true,
        osha_related: false,
        completion_time_minutes: 35,
        digital_signature_required: true,
        approval_required: true,
        usage_frequency: 'project-based',
        target_roles: ['Design Engineer', 'Project Manager']
      },
      {
        id: '14',
        form_code: 'AI-120',
        form_name: 'AI Damage Assessment Report Template',
        description: 'AI-powered damage assessment report template',
        category: 'operations',
        subcategory: 'ai_systems',
        form_type: 'template',
        series_number: 9000,
        sop_id: 'SOP-9201',
        sop_title: 'AI-Powered Damage Assessment',
        is_required: false,
        is_existing: false,
        priority_level: 3,
        florida_specific: false,
        hurricane_related: false,
        osha_related: false,
        completion_time_minutes: 20,
        digital_signature_required: true,
        approval_required: true,
        usage_frequency: 'project-based',
        target_roles: ['AI Specialist', 'Quality Inspector']
      }
    ];
    setForms(sampleForms);
  }, []);

  const categories = [
    { id: 'all', name: 'All Forms', icon: FileText, color: '#6b7280' },
    { id: 'safety', name: 'Safety', icon: Shield, color: '#dc2626' },
    { id: 'operations', name: 'Operations', icon: Wrench, color: '#0284c7' },
    { id: 'emergency', name: 'Emergency', icon: AlertTriangle, color: '#ea580c' },
    { id: 'compliance', name: 'Compliance', icon: Building, color: '#9333ea' },
    { id: 'administrative', name: 'Administrative', icon: User, color: '#6b7280' }
  ];

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.form_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.form_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || form.category === selectedCategory;
    const matchesType = selectedType === 'all' || form.form_type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const stats = {
    total: forms.length,
    existing: forms.filter(f => f.is_existing).length,
    missing: forms.filter(f => !f.is_existing).length,
    critical: forms.filter(f => f.priority_level === 1).length,
    safety: forms.filter(f => f.category === 'safety').length,
    operations: forms.filter(f => f.category === 'operations').length,
    compliance: forms.filter(f => f.category === 'compliance').length,
    emergency: forms.filter(f => f.category === 'emergency').length,
    required: forms.filter(f => f.is_required).length,
    florida_specific: forms.filter(f => f.florida_specific).length,
    hurricane_related: forms.filter(f => f.hurricane_related).length,
    osha_related: forms.filter(f => f.osha_related).length
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Forms & Checklists</PageTitle>
        <PageDescription>
          Digital forms and checklists for Florida First Roofing operations, safety compliance, and quality assurance.
          All forms are FFR-branded and can be completed digitally with electronic signatures.
        </PageDescription>

        <StatsGrid>
          <StatCard
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <StatIcon color="#6b7280">
              <FileText size={24} />
            </StatIcon>
            <StatContent>
              <StatNumber>{stats.total}</StatNumber>
              <StatLabel>Total Forms</StatLabel>
            </StatContent>
          </StatCard>

          <StatCard
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <StatIcon color="#16a34a">
              <CheckSquare size={24} />
            </StatIcon>
            <StatContent>
              <StatNumber>{stats.existing}</StatNumber>
              <StatLabel>Existing Forms</StatLabel>
            </StatContent>
          </StatCard>

          <StatCard
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <StatIcon color="#dc2626">
              <AlertTriangle size={24} />
            </StatIcon>
            <StatContent>
              <StatNumber>{stats.critical}</StatNumber>
              <StatLabel>Critical Priority</StatLabel>
            </StatContent>
          </StatCard>

          <StatCard
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <StatIcon color="#ea580c">
              <Wind size={24} />
            </StatIcon>
            <StatContent>
              <StatNumber>{stats.hurricane_related}</StatNumber>
              <StatLabel>Hurricane Related</StatLabel>
            </StatContent>
          </StatCard>

          <StatCard
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <StatIcon color="#0284c7">
              <MapPin size={24} />
            </StatIcon>
            <StatContent>
              <StatNumber>{stats.florida_specific}</StatNumber>
              <StatLabel>Florida Specific</StatLabel>
            </StatContent>
          </StatCard>

          <StatCard
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <StatIcon color="#9333ea">
              <Shield size={24} />
            </StatIcon>
            <StatContent>
              <StatNumber>{stats.osha_related}</StatNumber>
              <StatLabel>OSHA Related</StatLabel>
            </StatContent>
          </StatCard>
        </StatsGrid>
      </PageHeader>

      <ControlsBar>
        <SearchInput
          type="text"
          placeholder="Search forms by name, code, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <FilterSelect
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="form">Forms</option>
          <option value="checklist">Checklists</option>
          <option value="report">Reports</option>
          <option value="certificate">Certificates</option>
        </FilterSelect>

        <ActionButton variant="primary">
          <Plus size={16} />
          Create New Form
        </ActionButton>

        <ActionButton>
          <Download size={16} />
          Export All
        </ActionButton>
      </ControlsBar>

      <CategoryTabs>
        {categories.map(category => {
          const IconComponent = category.icon;
          return (
            <CategoryTab
              key={category.id}
              active={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
            >
              <IconComponent size={16} />
              {category.name}
            </CategoryTab>
          );
        })}
      </CategoryTabs>

      <FormsGrid>
        <AnimatePresence>
          {filteredForms.map(form => (
            <FormCard
              key={form.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <FormCardHeader category={form.category}>
                <FormTitle>{form.form_name}</FormTitle>
                <FormCode>{form.form_code}</FormCode>
              </FormCardHeader>

              <FormCardContent>
                <FormDescription>{form.description}</FormDescription>

                <SOPLink onClick={() => window.open(`/sop/${form.sop_id}`, '_blank')}>
                  <BookOpen size={16} />
                  <SOPLinkText>
                    <SOPCode>{form.sop_id}</SOPCode>: {form.sop_title}
                  </SOPLinkText>
                  <ExternalLink size={14} />
                </SOPLink>

                <FormMeta>
                  <MetaItem>
                    <Clock size={12} />
                    {form.completion_time_minutes} min
                  </MetaItem>
                  <MetaItem>
                    <Users size={12} />
                    {form.target_roles.length} roles
                  </MetaItem>
                  <MetaItem>
                    <Tag size={12} />
                    {form.usage_frequency}
                  </MetaItem>
                  {form.florida_specific && (
                    <MetaItem>
                      <MapPin size={12} />
                      Florida Specific
                    </MetaItem>
                  )}
                  {form.hurricane_related && (
                    <MetaItem>
                      <Wind size={12} />
                      Hurricane Related
                    </MetaItem>
                  )}
                </FormMeta>

                <FormBadges>
                  <SeriesBadge series={form.series_number}>
                    {form.series_number} Series
                  </SeriesBadge>
                  <PriorityBadge priority={form.priority_level}>
                    {form.priority_level === 1 ? 'Critical' :
                     form.priority_level === 2 ? 'High' :
                     form.priority_level === 3 ? 'Medium' : 'Low'}
                  </PriorityBadge>
                  <StatusIndicator existing={form.is_existing}>
                    {form.is_existing ? '✓ Exists' : '○ Missing'}
                  </StatusIndicator>
                  {form.is_required && <Badge type="required">Required</Badge>}
                  {form.florida_specific && <Badge type="florida">Florida</Badge>}
                  {form.hurricane_related && <Badge type="hurricane">Hurricane</Badge>}
                  {form.osha_related && <Badge type="osha">OSHA</Badge>}
                  {form.digital_signature_required && <Badge type="signature">E-Signature</Badge>}
                </FormBadges>

                <FormActions>
                  <FormActionButton className="secondary" title="View Related SOP">
                    <BookOpen size={14} />
                    View SOP
                  </FormActionButton>
                  <FormActionButton>
                    <Eye size={14} />
                    Preview
                  </FormActionButton>
                  <FormActionButton className={form.is_existing ? "primary" : ""} disabled={!form.is_existing}>
                    <FileText size={14} />
                    {form.is_existing ? 'Complete Form' : 'Not Available'}
                  </FormActionButton>
                </FormActions>
              </FormCardContent>
            </FormCard>
          ))}
        </AnimatePresence>
      </FormsGrid>

      {filteredForms.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#6b7280'
        }}>
          <FileText size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <h3>No forms found</h3>
          <p>Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </PageContainer>
  );
};

export default FormsChecklistsPage;