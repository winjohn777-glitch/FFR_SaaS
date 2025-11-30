import React from 'react';
import EditableModal from '../EditableModal';
import { ModalField } from '../ModalStructureEditor';

interface AssignCrewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignmentData: CrewAssignmentData) => void;
  projectName?: string;
}

interface CrewAssignmentData {
  projectId: string;
  projectName: string;
  foreman: string;
  leadRoofer: string;
  roofers: string;
  apprentices: string;
  startDate: string;
  estimatedDuration: string;
  specialInstructions: string;
  safetyRequirements: string;
  equipmentNeeded: string;
  contactInfo: string;
  workingHours: string;
  emergencyContact: string;
}

// Default fields for Assign Crew Modal
const defaultAssignCrewFields: ModalField[] = [
  {
    id: 'projectName',
    type: 'text',
    label: 'Project Name',
    placeholder: 'Project name (read-only)',
    required: true,
    order: 0
  },
  {
    id: 'foreman',
    type: 'select',
    label: 'Foreman',
    placeholder: 'Select foreman',
    required: true,
    options: [
      'Carlos Martinez',
      'David Wilson',
      'Mike Johnson',
      'Sarah Thompson',
      'John Smith'
    ],
    order: 1
  },
  {
    id: 'leadRoofer',
    type: 'select',
    label: 'Lead Roofer',
    placeholder: 'Select lead roofer',
    required: true,
    options: [
      'John Smith',
      'Mike Rodriguez',
      'Sarah Thompson',
      'Tom Anderson',
      'Lisa Garcia'
    ],
    order: 2
  },
  {
    id: 'roofers',
    type: 'text',
    label: 'Additional Roofers',
    placeholder: 'Enter roofer names (comma separated)',
    required: false,
    order: 3
  },
  {
    id: 'apprentices',
    type: 'text',
    label: 'Apprentices',
    placeholder: 'Enter apprentice names (comma separated)',
    required: false,
    order: 4
  },
  {
    id: 'startDate',
    type: 'date',
    label: 'Assignment Start Date',
    placeholder: 'Select start date',
    required: true,
    order: 5
  },
  {
    id: 'estimatedDuration',
    type: 'number',
    label: 'Estimated Duration (days)',
    placeholder: 'Enter estimated days to complete',
    required: true,
    order: 6
  },
  {
    id: 'workingHours',
    type: 'text',
    label: 'Working Hours',
    placeholder: 'e.g., 7:00 AM - 5:00 PM',
    required: true,
    order: 7
  },
  {
    id: 'contactInfo',
    type: 'text',
    label: 'Site Contact Information',
    placeholder: 'Primary contact phone number',
    required: true,
    order: 8
  },
  {
    id: 'emergencyContact',
    type: 'text',
    label: 'Emergency Contact',
    placeholder: 'Emergency contact name and phone',
    required: true,
    order: 9
  },
  {
    id: 'equipmentNeeded',
    type: 'textarea',
    label: 'Equipment Needed',
    placeholder: 'List required equipment and tools',
    required: false,
    order: 10
  },
  {
    id: 'safetyRequirements',
    type: 'textarea',
    label: 'Safety Requirements',
    placeholder: 'Special safety considerations for this project',
    required: true,
    order: 11
  },
  {
    id: 'specialInstructions',
    type: 'textarea',
    label: 'Special Instructions',
    placeholder: 'Additional instructions for the crew',
    required: false,
    order: 12
  }
];

const AssignCrewModal: React.FC<AssignCrewModalProps> = ({
  isOpen,
  onClose,
  onSave,
  projectName = ''
}) => {
  const handleSubmit = (data: Record<string, any>) => {
    // Transform form data to match expected CrewAssignmentData structure
    const assignmentData: CrewAssignmentData = {
      projectId: '', // This would be set by the parent component
      projectName: data.projectName || projectName,
      foreman: data.foreman || '',
      leadRoofer: data.leadRoofer || '',
      roofers: data.roofers || '',
      apprentices: data.apprentices || '',
      startDate: data.startDate || '',
      estimatedDuration: data.estimatedDuration || '0',
      workingHours: data.workingHours || '',
      contactInfo: data.contactInfo || '',
      emergencyContact: data.emergencyContact || '',
      equipmentNeeded: data.equipmentNeeded || '',
      safetyRequirements: data.safetyRequirements || '',
      specialInstructions: data.specialInstructions || ''
    };

    onSave(assignmentData);
  };

  // Pre-populate project name if provided
  const initialData = projectName ? { projectName } : {};

  return (
    <EditableModal
      isOpen={isOpen}
      onClose={onClose}
      modalId="assign-crew"
      title="Assign Crew to Project"
      size="lg"
      category="project-management"
      customFields={defaultAssignCrewFields}
      onSubmit={handleSubmit}
      initialData={initialData}
      allowEdit={true}
      showEditButton={true}
    />
  );
};

export default AssignCrewModal;