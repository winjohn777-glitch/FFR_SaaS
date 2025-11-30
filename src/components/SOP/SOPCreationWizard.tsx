import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  FileText,
  Layers,
  Settings,
  Shield,
  Eye,
  Save,
  Upload,
  Download,
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Wind,
  Users,
  Tag,
  Calendar,
  FileCheck,
  Camera,
  Link,
  PlayCircle,
  Plus,
  Trash2,
  Copy
} from 'lucide-react';
import sopService from '../../services/sopService';
import { SOPCategory } from '../../types/sop';

// Types
interface SOPFormData {
  title: string;
  category_id: number | null;
  sop_number: string;
  version: string;
  priority_level: 'critical' | 'high' | 'standard' | 'low';
  estimated_duration_minutes: number;
  florida_specific: boolean;
  hurricane_related: boolean;
  osha_related: boolean;
  hvhz_specific: boolean;
  description: string;
  purpose: string;
  scope: string;
  responsibilities: string;
  procedures: SOPStep[];
  safety_requirements: SafetyRequirement[];
  quality_checkpoints: QualityCheckpoint[];
  required_equipment: string[];
  required_materials: string[];
  forms_checklists: FormChecklistItem[];
  references: ReferenceItem[];
  revision_notes: string;
  tags: string[];
}

interface SOPStep {
  id: string;
  step_number: number;
  title: string;
  description: string;
  warnings: string[];
  quality_checks: string[];
  estimated_time_minutes: number;
  required_tools: string[];
  photos_required: boolean;
  substeps: SubStep[];
}

interface SubStep {
  id: string;
  description: string;
  critical: boolean;
}

interface SafetyRequirement {
  id: string;
  requirement: string;
  type: 'ppe' | 'environmental' | 'procedural' | 'emergency';
  severity: 'critical' | 'high' | 'medium' | 'low';
  compliance_notes: string;
}

interface QualityCheckpoint {
  id: string;
  checkpoint: string;
  measurement_criteria: string;
  acceptance_criteria: string;
  frequency: 'every_step' | 'milestone' | 'completion' | 'random';
}

interface FormChecklistItem {
  id: string;
  name: string;
  type: 'form' | 'checklist' | 'inspection_sheet';
  required: boolean;
  completion_stage: 'before' | 'during' | 'after';
}

interface ReferenceItem {
  id: string;
  title: string;
  type: 'document' | 'video' | 'website' | 'regulation';
  url: string;
  description: string;
}

interface SOPTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  estimated_steps: number;
  typical_duration: number;
  complexity: 'basic' | 'intermediate' | 'advanced';
  defaultData: Partial<SOPFormData>;
}

// Styled Components
const WizardOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const WizardContainer = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const WizardHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
`;

const WizardTitle = styled.div`
  flex: 1;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const CloseButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm};
  border: none;
  background: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ProgressBar = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.background};
`;

const ProgressTrack = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg} 0;
  position: relative;
`;

const ProgressStep = styled.div<{ active: boolean; completed: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  z-index: 2;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 20px;
    left: 60%;
    right: -40%;
    height: 2px;
    background: ${({ theme, completed }) =>
      completed ? theme.colors.secondary : theme.colors.border};
    z-index: 1;
  }
`;

const StepCircle = styled.div<{ active: boolean; completed: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  transition: all 0.2s ease;

  ${({ active, completed, theme }) => {
    if (completed) {
      return `
        background: ${theme.colors.secondary};
        color: white;
        border: 2px solid ${theme.colors.secondary};
      `;
    } else if (active) {
      return `
        background: ${theme.colors.primary};
        color: white;
        border: 2px solid ${theme.colors.primary};
      `;
    } else {
      return `
        background: ${theme.colors.surface};
        color: ${theme.colors.text.secondary};
        border: 2px solid ${theme.colors.border};
      `;
    }
  }}
`;

const StepLabel = styled.div<{ active: boolean }>`
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.text.secondary};
  max-width: 80px;
`;

const WizardContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const WizardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ variant = 'secondary', theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary};
          color: white;
          &:hover { background: ${theme.colors.primary}dd; }
          &:disabled { opacity: 0.5; cursor: not-allowed; }
        `;
      case 'danger':
        return `
          background: ${theme.colors.error};
          color: white;
          &:hover { background: ${theme.colors.error}dd; }
        `;
      default:
        return `
          background: ${theme.colors.surface};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.border};
          &:hover { background: ${theme.colors.background}; }
        `;
    }
  }}
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TemplateCard = styled(motion.div)<{ selected: boolean }>`
  border: 2px solid ${({ theme, selected }) =>
    selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ theme, selected }) =>
    selected ? theme.colors.primary + '10' : theme.colors.surface};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const TemplateIcon = styled.div<{ selected: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background: ${({ theme, selected }) =>
    selected ? theme.colors.primary : theme.colors.background};
  color: ${({ theme, selected }) =>
    selected ? 'white' : theme.colors.primary};
`;

const TemplateTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
`;

const TemplateDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  line-height: 1.5;
`;

const TemplateMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Input = styled.input`
  width: 100%;
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

const Select = styled.select`
  width: 100%;
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

const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.primary};

  input {
    margin: 0;
  }
`;

const StepList = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const StepItem = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
`;

const StepHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StepNumber = styled.span`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SmallButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  &:hover {
    background: ${({ theme }) => theme.colors.background};
  }
`;

const Badge = styled.span<{ variant?: string }>`
  font-size: 0.75rem;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  ${({ variant, theme }) => {
    switch (variant) {
      case 'critical':
        return `background: #DC2626; color: white;`;
      case 'high':
        return `background: #F59E0B; color: white;`;
      case 'standard':
        return `background: #10B981; color: white;`;
      case 'low':
        return `background: #6B7280; color: white;`;
      default:
        return `background: ${theme.colors.background}; color: ${theme.colors.text.secondary};`;
    }
  }}
`;

const ReviewSection = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
`;

const ReviewTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ReviewContent = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`;

// Component
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSOPCreated?: (sopData: SOPFormData) => void;
}

const SOPCreationWizard: React.FC<Props> = ({ isOpen, onClose, onSOPCreated }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [categories, setCategories] = useState<SOPCategory[]>([]);
  const [formData, setFormData] = useState<SOPFormData>({
    title: '',
    category_id: null,
    sop_number: '',
    version: '1.0',
    priority_level: 'standard',
    estimated_duration_minutes: 30,
    florida_specific: false,
    hurricane_related: false,
    osha_related: false,
    hvhz_specific: false,
    description: '',
    purpose: '',
    scope: '',
    responsibilities: '',
    procedures: [],
    safety_requirements: [],
    quality_checkpoints: [],
    required_equipment: [],
    required_materials: [],
    forms_checklists: [],
    references: [],
    revision_notes: '',
    tags: []
  });

  const steps = [
    {
      id: 'template',
      title: 'Template Selection',
      icon: <Layers size={16} />,
      description: 'Choose a template to get started'
    },
    {
      id: 'basic',
      title: 'Basic Information',
      icon: <FileText size={16} />,
      description: 'SOP details and categorization'
    },
    {
      id: 'content',
      title: 'Content & Procedures',
      icon: <Settings size={16} />,
      description: 'Define the step-by-step procedures'
    },
    {
      id: 'safety',
      title: 'Safety & Quality',
      icon: <Shield size={16} />,
      description: 'Safety requirements and quality checkpoints'
    },
    {
      id: 'review',
      title: 'Review & Publish',
      icon: <Eye size={16} />,
      description: 'Review and finalize your SOP'
    }
  ];

  const templates: SOPTemplate[] = [
    {
      id: 'roofing_installation',
      name: 'Roofing Installation',
      description: 'Standard roofing installation procedures for residential and commercial projects.',
      category: 'Installation',
      icon: <FileText size={24} />,
      estimated_steps: 12,
      typical_duration: 240,
      complexity: 'intermediate',
      defaultData: {
        title: 'Roofing Installation Standard Operating Procedure',
        priority_level: 'high',
        estimated_duration_minutes: 240,
        florida_specific: true,
        hurricane_related: true,
        purpose: 'To ensure safe and quality roofing installation following Florida building codes and hurricane preparedness standards.',
        scope: 'Applies to all residential and commercial roofing installation projects in Florida.',
        responsibilities: 'Site supervisor, lead installer, quality control inspector'
      }
    },
    {
      id: 'safety_inspection',
      name: 'Safety Inspection',
      description: 'Pre-job safety inspection and hazard assessment procedures.',
      category: 'Safety',
      icon: <Shield size={24} />,
      estimated_steps: 8,
      typical_duration: 45,
      complexity: 'basic',
      defaultData: {
        title: 'Pre-Job Safety Inspection Procedure',
        priority_level: 'critical',
        estimated_duration_minutes: 45,
        osha_related: true,
        purpose: 'To identify and mitigate safety hazards before beginning roofing work.',
        scope: 'Required for all roofing projects before work begins.',
        responsibilities: 'Safety officer, site supervisor'
      }
    },
    {
      id: 'hurricane_prep',
      name: 'Hurricane Preparation',
      description: 'Emergency procedures for hurricane season preparation and response.',
      category: 'Emergency',
      icon: <Wind size={24} />,
      estimated_steps: 15,
      typical_duration: 180,
      complexity: 'advanced',
      defaultData: {
        title: 'Hurricane Preparation and Response Procedure',
        priority_level: 'critical',
        estimated_duration_minutes: 180,
        florida_specific: true,
        hurricane_related: true,
        hvhz_specific: true,
        purpose: 'To prepare for and respond to hurricane threats and ensure worker and property safety.',
        scope: 'All Florida operations during hurricane season (June 1 - November 30).',
        responsibilities: 'Emergency coordinator, site supervisors, all field personnel'
      }
    },
    {
      id: 'quality_control',
      name: 'Quality Control Inspection',
      description: 'Quality control procedures and acceptance criteria for completed work.',
      category: 'Quality',
      icon: <CheckCircle size={24} />,
      estimated_steps: 10,
      typical_duration: 90,
      complexity: 'intermediate',
      defaultData: {
        title: 'Quality Control Inspection Procedure',
        priority_level: 'high',
        estimated_duration_minutes: 90,
        purpose: 'To ensure all completed work meets quality standards and customer expectations.',
        scope: 'All completed roofing installation and repair projects.',
        responsibilities: 'Quality control inspector, project manager'
      }
    },
    {
      id: 'material_handling',
      name: 'Material Handling',
      description: 'Safe material handling, storage, and inventory procedures.',
      category: 'Operations',
      icon: <FileCheck size={24} />,
      estimated_steps: 6,
      typical_duration: 60,
      complexity: 'basic',
      defaultData: {
        title: 'Material Handling and Storage Procedure',
        priority_level: 'standard',
        estimated_duration_minutes: 60,
        osha_related: true,
        purpose: 'To ensure safe and efficient material handling and storage practices.',
        scope: 'All personnel involved in material handling and storage operations.',
        responsibilities: 'Warehouse supervisor, material handlers, site supervisors'
      }
    },
    {
      id: 'custom',
      name: 'Custom SOP',
      description: 'Start from scratch with a blank template for custom procedures.',
      category: 'Custom',
      icon: <Plus size={24} />,
      estimated_steps: 0,
      typical_duration: 0,
      complexity: 'basic',
      defaultData: {
        title: '',
        priority_level: 'standard',
        estimated_duration_minutes: 30,
        purpose: '',
        scope: '',
        responsibilities: ''
      }
    }
  ];

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await sopService.getCategories(true);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) {
        setFormData(prev => ({ ...prev, ...template.defaultData }));
      }
    }
  }, [selectedTemplate]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormChange = (field: keyof SOPFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addProcedureStep = () => {
    const newStep: SOPStep = {
      id: `step-${Date.now()}`,
      step_number: formData.procedures.length + 1,
      title: '',
      description: '',
      warnings: [],
      quality_checks: [],
      estimated_time_minutes: 15,
      required_tools: [],
      photos_required: false,
      substeps: []
    };
    setFormData(prev => ({
      ...prev,
      procedures: [...prev.procedures, newStep]
    }));
  };

  const updateProcedureStep = (stepId: string, field: keyof SOPStep, value: any) => {
    setFormData(prev => ({
      ...prev,
      procedures: prev.procedures.map(step =>
        step.id === stepId ? { ...step, [field]: value } : step
      )
    }));
  };

  const removeProcedureStep = (stepId: string) => {
    setFormData(prev => ({
      ...prev,
      procedures: prev.procedures
        .filter(step => step.id !== stepId)
        .map((step, index) => ({ ...step, step_number: index + 1 }))
    }));
  };

  const addSafetyRequirement = () => {
    const newRequirement: SafetyRequirement = {
      id: `safety-${Date.now()}`,
      requirement: '',
      type: 'ppe',
      severity: 'medium',
      compliance_notes: ''
    };
    setFormData(prev => ({
      ...prev,
      safety_requirements: [...prev.safety_requirements, newRequirement]
    }));
  };

  const handleCreateSOP = () => {
    console.log('Creating SOP:', formData);
    onSOPCreated?.(formData);
    onClose();
  };

  const renderTemplateSelection = () => (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Choose a Template
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          Select a template that best matches your SOP type. You can customize all details in the following steps.
        </p>
      </div>

      <TemplateGrid>
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            selected={selectedTemplate === template.id}
            onClick={() => handleTemplateSelect(template.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <TemplateIcon selected={selectedTemplate === template.id}>
              {template.icon}
            </TemplateIcon>
            <TemplateTitle>{template.name}</TemplateTitle>
            <TemplateDescription>{template.description}</TemplateDescription>
            <TemplateMeta>
              <span>📋 {template.estimated_steps} steps</span>
              <span>⏱️ {template.typical_duration}min</span>
              <span>🎯 {template.complexity}</span>
            </TemplateMeta>
          </TemplateCard>
        ))}
      </TemplateGrid>
    </div>
  );

  const renderBasicInformation = () => (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Basic Information
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          Define the essential details and metadata for your SOP.
        </p>
      </div>

      <FormGrid>
        <div>
          <FormGroup>
            <Label>SOP Title *</Label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => handleFormChange('title', e.target.value)}
              placeholder="Enter SOP title"
            />
          </FormGroup>

          <FormGroup>
            <Label>Category *</Label>
            <Select
              value={formData.category_id || ''}
              onChange={(e) => handleFormChange('category_id', parseInt(e.target.value))}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.category_name}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>SOP Number</Label>
            <Input
              type="text"
              value={formData.sop_number}
              onChange={(e) => handleFormChange('sop_number', e.target.value)}
              placeholder="Auto-generated if left blank"
            />
          </FormGroup>

          <FormGroup>
            <Label>Version</Label>
            <Input
              type="text"
              value={formData.version}
              onChange={(e) => handleFormChange('version', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Priority Level</Label>
            <Select
              value={formData.priority_level}
              onChange={(e) => handleFormChange('priority_level', e.target.value)}
            >
              <option value="low">Low</option>
              <option value="standard">Standard</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Estimated Duration (minutes)</Label>
            <Input
              type="number"
              value={formData.estimated_duration_minutes}
              onChange={(e) => handleFormChange('estimated_duration_minutes', parseInt(e.target.value))}
              min="1"
            />
          </FormGroup>
        </div>

        <div>
          <FormGroup>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              placeholder="Brief description of this SOP"
            />
          </FormGroup>

          <FormGroup>
            <Label>Purpose</Label>
            <Textarea
              value={formData.purpose}
              onChange={(e) => handleFormChange('purpose', e.target.value)}
              placeholder="What is the purpose of this SOP?"
            />
          </FormGroup>

          <FormGroup>
            <Label>Scope</Label>
            <Textarea
              value={formData.scope}
              onChange={(e) => handleFormChange('scope', e.target.value)}
              placeholder="When and where does this SOP apply?"
            />
          </FormGroup>

          <FormGroup>
            <Label>Responsibilities</Label>
            <Textarea
              value={formData.responsibilities}
              onChange={(e) => handleFormChange('responsibilities', e.target.value)}
              placeholder="Who is responsible for executing this SOP?"
            />
          </FormGroup>
        </div>
      </FormGrid>

      <FormGroup>
        <Label>Compliance Requirements</Label>
        <CheckboxGroup>
          <CheckboxItem>
            <input
              type="checkbox"
              checked={formData.florida_specific}
              onChange={(e) => handleFormChange('florida_specific', e.target.checked)}
            />
            <MapPin size={16} />
            Florida Specific
          </CheckboxItem>
          <CheckboxItem>
            <input
              type="checkbox"
              checked={formData.hurricane_related}
              onChange={(e) => handleFormChange('hurricane_related', e.target.checked)}
            />
            <Wind size={16} />
            Hurricane Related
          </CheckboxItem>
          <CheckboxItem>
            <input
              type="checkbox"
              checked={formData.osha_related}
              onChange={(e) => handleFormChange('osha_related', e.target.checked)}
            />
            <Shield size={16} />
            OSHA Related
          </CheckboxItem>
          <CheckboxItem>
            <input
              type="checkbox"
              checked={formData.hvhz_specific}
              onChange={(e) => handleFormChange('hvhz_specific', e.target.checked)}
            />
            <AlertTriangle size={16} />
            HVHZ Specific
          </CheckboxItem>
        </CheckboxGroup>
      </FormGroup>
    </div>
  );

  const renderContentAndProcedures = () => (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Content & Procedures
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          Define the step-by-step procedures for this SOP. Add as many steps as needed.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Procedure Steps</h4>
        <Button onClick={addProcedureStep}>
          <Plus size={16} />
          Add Step
        </Button>
      </div>

      <StepList>
        {formData.procedures.map((step, index) => (
          <StepItem key={step.id}>
            <StepHeader>
              <StepNumber>Step {step.step_number}</StepNumber>
              <ActionButtons>
                <SmallButton onClick={() => removeProcedureStep(step.id)}>
                  <Trash2 size={12} />
                  Remove
                </SmallButton>
              </ActionButtons>
            </StepHeader>

            <FormGrid>
              <FormGroup>
                <Label>Step Title *</Label>
                <Input
                  type="text"
                  value={step.title}
                  onChange={(e) => updateProcedureStep(step.id, 'title', e.target.value)}
                  placeholder="Enter step title"
                />
              </FormGroup>

              <FormGroup>
                <Label>Estimated Time (minutes)</Label>
                <Input
                  type="number"
                  value={step.estimated_time_minutes}
                  onChange={(e) => updateProcedureStep(step.id, 'estimated_time_minutes', parseInt(e.target.value))}
                  min="1"
                />
              </FormGroup>
            </FormGrid>

            <FormGroup>
              <Label>Step Description *</Label>
              <Textarea
                value={step.description}
                onChange={(e) => updateProcedureStep(step.id, 'description', e.target.value)}
                placeholder="Detailed description of what needs to be done in this step"
              />
            </FormGroup>

            <CheckboxItem style={{ marginTop: '1rem' }}>
              <input
                type="checkbox"
                checked={step.photos_required}
                onChange={(e) => updateProcedureStep(step.id, 'photos_required', e.target.checked)}
              />
              <Camera size={16} />
              Photo documentation required for this step
            </CheckboxItem>
          </StepItem>
        ))}

        {formData.procedures.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#64748b',
            border: '2px dashed #e2e8f0',
            borderRadius: '0.5rem'
          }}>
            <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h4 style={{ marginBottom: '0.5rem' }}>No steps added yet</h4>
            <p style={{ marginBottom: '1rem' }}>Start by adding your first procedure step.</p>
            <Button onClick={addProcedureStep}>
              <Plus size={16} />
              Add First Step
            </Button>
          </div>
        )}
      </StepList>
    </div>
  );

  const renderSafetyAndQuality = () => (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Safety & Quality Requirements
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          Define safety requirements and quality checkpoints for this SOP.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>Safety Requirements</h4>
        <Button onClick={addSafetyRequirement}>
          <Plus size={16} />
          Add Safety Requirement
        </Button>
      </div>

      <StepList>
        {formData.safety_requirements.map((requirement) => (
          <StepItem key={requirement.id}>
            <StepHeader>
              <Badge variant={requirement.severity}>
                <Shield size={12} />
                {requirement.severity.toUpperCase()}
              </Badge>
              <ActionButtons>
                <SmallButton onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    safety_requirements: prev.safety_requirements.filter(r => r.id !== requirement.id)
                  }));
                }}>
                  <Trash2 size={12} />
                  Remove
                </SmallButton>
              </ActionButtons>
            </StepHeader>

            <FormGrid>
              <FormGroup>
                <Label>Safety Requirement *</Label>
                <Textarea
                  value={requirement.requirement}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      safety_requirements: prev.safety_requirements.map(r =>
                        r.id === requirement.id ? { ...r, requirement: e.target.value } : r
                      )
                    }));
                  }}
                  placeholder="Describe the safety requirement"
                />
              </FormGroup>

              <div>
                <FormGroup>
                  <Label>Type</Label>
                  <Select
                    value={requirement.type}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        safety_requirements: prev.safety_requirements.map(r =>
                          r.id === requirement.id ? { ...r, type: e.target.value as any } : r
                        )
                      }));
                    }}
                  >
                    <option value="ppe">Personal Protective Equipment</option>
                    <option value="environmental">Environmental</option>
                    <option value="procedural">Procedural</option>
                    <option value="emergency">Emergency</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Severity</Label>
                  <Select
                    value={requirement.severity}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        safety_requirements: prev.safety_requirements.map(r =>
                          r.id === requirement.id ? { ...r, severity: e.target.value as any } : r
                        )
                      }));
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </Select>
                </FormGroup>
              </div>
            </FormGrid>

            <FormGroup>
              <Label>Compliance Notes</Label>
              <Input
                type="text"
                value={requirement.compliance_notes}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    safety_requirements: prev.safety_requirements.map(r =>
                      r.id === requirement.id ? { ...r, compliance_notes: e.target.value } : r
                    )
                  }));
                }}
                placeholder="Additional compliance information or notes"
              />
            </FormGroup>
          </StepItem>
        ))}

        {formData.safety_requirements.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#64748b',
            border: '2px dashed #e2e8f0',
            borderRadius: '0.5rem'
          }}>
            <Shield size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h4 style={{ marginBottom: '0.5rem' }}>No safety requirements added</h4>
            <p style={{ marginBottom: '1rem' }}>Add safety requirements to ensure compliance.</p>
            <Button onClick={addSafetyRequirement}>
              <Plus size={16} />
              Add Safety Requirement
            </Button>
          </div>
        )}
      </StepList>
    </div>
  );

  const renderReviewAndPublish = () => (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Review & Publish
        </h3>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          Review your SOP details before publishing. You can always edit later.
        </p>
      </div>

      <ReviewSection>
        <ReviewTitle>
          <FileText size={20} />
          Basic Information
        </ReviewTitle>
        <ReviewContent>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Title:</strong> {formData.title || 'Untitled SOP'}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Category:</strong> {categories.find(c => c.id === formData.category_id)?.category_name || 'Not selected'}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Priority:</strong> <Badge variant={formData.priority_level}>{formData.priority_level}</Badge>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Duration:</strong> {formData.estimated_duration_minutes} minutes
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {formData.florida_specific && <Badge variant="florida">Florida Specific</Badge>}
            {formData.hurricane_related && <Badge variant="hurricane">Hurricane Related</Badge>}
            {formData.osha_related && <Badge variant="osha">OSHA Related</Badge>}
            {formData.hvhz_specific && <Badge>HVHZ Specific</Badge>}
          </div>
        </ReviewContent>
      </ReviewSection>

      <ReviewSection>
        <ReviewTitle>
          <Settings size={20} />
          Procedures ({formData.procedures.length} steps)
        </ReviewTitle>
        <ReviewContent>
          {formData.procedures.length > 0 ? (
            formData.procedures.map((step, index) => (
              <div key={step.id} style={{ marginBottom: '0.5rem' }}>
                <strong>Step {index + 1}:</strong> {step.title || 'Untitled step'}
                {step.photos_required && <span style={{ marginLeft: '0.5rem' }}><Camera size={12} /></span>}
              </div>
            ))
          ) : (
            <div style={{ color: '#f59e0b' }}>⚠️ No procedure steps defined</div>
          )}
        </ReviewContent>
      </ReviewSection>

      <ReviewSection>
        <ReviewTitle>
          <Shield size={20} />
          Safety Requirements ({formData.safety_requirements.length})
        </ReviewTitle>
        <ReviewContent>
          {formData.safety_requirements.length > 0 ? (
            formData.safety_requirements.map((req, index) => (
              <div key={req.id} style={{ marginBottom: '0.5rem' }}>
                <Badge variant={req.severity}>{req.severity}</Badge>
                <span style={{ marginLeft: '0.5rem' }}>{req.requirement}</span>
              </div>
            ))
          ) : (
            <div style={{ color: '#6b7280' }}>No safety requirements defined</div>
          )}
        </ReviewContent>
      </ReviewSection>

      <FormGroup>
        <Label>Revision Notes (Optional)</Label>
        <Textarea
          value={formData.revision_notes}
          onChange={(e) => handleFormChange('revision_notes', e.target.value)}
          placeholder="Add any notes about this SOP creation or changes"
        />
      </FormGroup>
    </div>
  );

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'template':
        return renderTemplateSelection();
      case 'basic':
        return renderBasicInformation();
      case 'content':
        return renderContentAndProcedures();
      case 'safety':
        return renderSafetyAndQuality();
      case 'review':
        return renderReviewAndPublish();
      default:
        return <div>Unknown step</div>;
    }
  };

  const canProceed = () => {
    switch (steps[currentStep].id) {
      case 'template':
        return selectedTemplate !== null;
      case 'basic':
        return formData.title && formData.category_id;
      case 'content':
        return formData.procedures.length > 0;
      case 'safety':
        return true; // Safety requirements are optional
      case 'review':
        return true;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <WizardOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <WizardContainer
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
      >
        <WizardHeader>
          <WizardTitle>
            <Title>SOP Creation Wizard</Title>
            <Subtitle>{steps[currentStep].description}</Subtitle>
          </WizardTitle>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </WizardHeader>

        <ProgressBar>
          <ProgressTrack>
            {steps.map((step, index) => (
              <ProgressStep
                key={step.id}
                active={index === currentStep}
                completed={index < currentStep}
              >
                <StepCircle
                  active={index === currentStep}
                  completed={index < currentStep}
                >
                  {index < currentStep ? <CheckCircle size={20} /> : index + 1}
                </StepCircle>
                <StepLabel active={index === currentStep}>
                  {step.title}
                </StepLabel>
              </ProgressStep>
            ))}
          </ProgressTrack>
        </ProgressBar>

        <WizardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </WizardContent>

        <WizardFooter>
          <div>
            {currentStep > 0 && (
              <Button onClick={handlePrevious}>
                <ChevronLeft size={16} />
                Previous
              </Button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button onClick={onClose}>
              Cancel
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Next
                <ChevronRight size={16} />
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleCreateSOP}
                disabled={!canProceed()}
              >
                <Save size={16} />
                Create SOP
              </Button>
            )}
          </div>
        </WizardFooter>
      </WizardContainer>
    </WizardOverlay>
  );
};

export default SOPCreationWizard;