import React from 'react';
import EditableModal from '../EditableModal';
import { ModalField } from '../ModalStructureEditor';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: ProjectFormData) => void;
  initialData?: ProjectFormData;
}

interface ProjectFormData {
  name: string;
  client: string;
  address: string;
  roofType: 'shingle' | 'metal' | 'tile' | 'flat';
  squareFootage: string;
  startDate: string;
  endDate: string;
  budget: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  status: 'planning' | 'in-progress' | 'inspection' | 'completed' | 'on-hold';
  crew: string;
  permitRequired: boolean;
  materials: string;
  contractorNotes: string;
  progress: string;
  spent: string;
}

// Default fields for Edit Project Modal
const defaultEditProjectFields: ModalField[] = [
  {
    id: 'name',
    type: 'text',
    label: 'Project Name',
    placeholder: 'Enter project name',
    required: true,
    order: 0
  },
  {
    id: 'client',
    type: 'text',
    label: 'Client Name',
    placeholder: 'Enter client name',
    required: true,
    order: 1
  },
  {
    id: 'address',
    type: 'text',
    label: 'Project Address',
    placeholder: 'Enter project address',
    required: true,
    order: 2
  },
  {
    id: 'status',
    type: 'select',
    label: 'Project Status',
    placeholder: 'Select project status',
    required: true,
    options: ['planning', 'in-progress', 'inspection', 'completed', 'on-hold'],
    order: 3
  },
  {
    id: 'priority',
    type: 'select',
    label: 'Priority',
    placeholder: 'Select priority level',
    required: true,
    options: ['low', 'medium', 'high', 'urgent'],
    order: 4
  },
  {
    id: 'progress',
    type: 'number',
    label: 'Progress (%)',
    placeholder: 'Enter progress percentage (0-100)',
    required: false,
    validation: { min: 0, max: 100 },
    order: 5
  },
  {
    id: 'roofType',
    type: 'select',
    label: 'Roof Type',
    placeholder: 'Select roof type',
    required: true,
    options: ['shingle', 'metal', 'tile', 'flat'],
    order: 6
  },
  {
    id: 'squareFootage',
    type: 'number',
    label: 'Square Footage',
    placeholder: 'Enter square footage',
    required: true,
    order: 7
  },
  {
    id: 'startDate',
    type: 'date',
    label: 'Start Date',
    placeholder: 'Select start date',
    required: true,
    order: 8
  },
  {
    id: 'endDate',
    type: 'date',
    label: 'End Date',
    placeholder: 'Select end date',
    required: true,
    order: 9
  },
  {
    id: 'budget',
    type: 'currency',
    label: 'Budget',
    placeholder: 'Enter budget amount',
    required: true,
    order: 10
  },
  {
    id: 'spent',
    type: 'currency',
    label: 'Amount Spent',
    placeholder: 'Enter amount spent so far',
    required: false,
    order: 11
  },
  {
    id: 'crew',
    type: 'text',
    label: 'Assigned Crew',
    placeholder: 'Enter crew members (comma separated)',
    required: false,
    order: 12
  },
  {
    id: 'permitRequired',
    type: 'checkbox',
    label: 'Permit Required',
    placeholder: 'Check if permit is required for this project',
    required: false,
    order: 13
  },
  {
    id: 'materials',
    type: 'textarea',
    label: 'Materials List',
    placeholder: 'Enter required materials and quantities',
    required: false,
    order: 14
  },
  {
    id: 'description',
    type: 'textarea',
    label: 'Project Description',
    placeholder: 'Enter project details and special requirements',
    required: true,
    order: 15
  },
  {
    id: 'contractorNotes',
    type: 'textarea',
    label: 'Contractor Notes',
    placeholder: 'Internal notes for crew and project management',
    required: false,
    order: 16
  }
];

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const handleSubmit = (data: Record<string, any>) => {
    // Transform form data to match expected ProjectFormData structure
    const projectData: ProjectFormData = {
      name: data.name || '',
      client: data.client || '',
      address: data.address || '',
      roofType: data.roofType as 'shingle' | 'metal' | 'tile' | 'flat',
      squareFootage: data.squareFootage || '0',
      startDate: data.startDate || '',
      endDate: data.endDate || '',
      budget: data.budget || '0',
      spent: data.spent || '0',
      priority: data.priority as 'low' | 'medium' | 'high' | 'urgent',
      status: data.status as 'planning' | 'in-progress' | 'inspection' | 'completed' | 'on-hold',
      progress: data.progress || '0',
      crew: data.crew || '',
      permitRequired: !!data.permitRequired,
      materials: data.materials || '',
      description: data.description || '',
      contractorNotes: data.contractorNotes || ''
    };

    onSave(projectData);
  };

  return (
    <EditableModal
      isOpen={isOpen}
      onClose={onClose}
      modalId="edit-project"
      title="Edit Project"
      size="xl"
      category="project-management"
      customFields={defaultEditProjectFields}
      onSubmit={handleSubmit}
      initialData={initialData}
      allowEdit={true}
      showEditButton={true}
    />
  );
};

export default EditProjectModal;