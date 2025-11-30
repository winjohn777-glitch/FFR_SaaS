import React from 'react';
import EditableModal from '../EditableModal';
import { ModalField } from '../ModalStructureEditor';

interface AddTimelineEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: TimelineEventFormData) => void;
}

interface TimelineEventFormData {
  title: string;
  type: 'milestone' | 'task' | 'meeting' | 'inspection' | 'delivery';
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'overdue';
  description: string;
  location: string;
  assignedTo: string;
  projectId: string;
}

// Default fields for Add Timeline Event Modal
const defaultTimelineEventFields: ModalField[] = [
  {
    id: 'title',
    type: 'select',
    label: 'Workflow Step',
    placeholder: 'Select standardized workflow step',
    required: true,
    order: 0,
    options: [
      'EVENT 001: Initial Lead Response (4hr max)',
      'EVENT 002: Property Inspection & Assessment',
      'EVENT 003: Insurance Adjuster Meeting',
      'EVENT 004: Proposal Development',
      'EVENT 005: Contract Execution',
      'EVENT 101: Permit Package Preparation',
      'EVENT 102: Notice of Commencement Filing',
      'EVENT 103: Permit Submission',
      'EVENT 104: HOA Approval (if applicable)',
      'EVENT 105: Material Ordering',
      'EVENT 106: Crew Scheduling',
      'EVENT 107: Pre-Construction Meeting',
      'EVENT 201: Equipment Delivery',
      'EVENT 202: Material Delivery',
      'EVENT 203: Site Preparation',
      'EVENT 204: Safety Setup & OSHA Compliance',
      'EVENT 301: Existing Roof Removal',
      'EVENT 302: Deck Inspection',
      'EVENT 303: Deck Repairs (if needed)',
      'EVENT 304: Debris Removal',
      'EVENT 401: Secondary Water Barrier (HVHZ)',
      'EVENT 402: Underlayment Installation',
      'EVENT 403: Dry-In Inspection',
      'EVENT 404: Flashing Installation',
      'EVENT 501: Starter Strip & Drip Edge',
      'EVENT 502: Field Shingle Installation',
      'EVENT 503: Hip & Ridge Installation',
      'EVENT 504: Ventilation Installation',
      'EVENT 505: Detail Work',
      'EVENT 601: Final Cleanup',
      'EVENT 602: Quality Inspection',
      'EVENT 603: Final Municipal Inspection',
      'EVENT 604: Customer Walkthrough',
      'EVENT 701: Wind Mitigation Form',
      'EVENT 702: Final Documentation Package',
      'EVENT 703: Notice of Termination Filing',
      'EVENT 704: Final Payment Processing',
      'EVENT 705: Lien Waivers & Releases',
      'RISK EVENT A: Hurricane Watch Protocol',
      'RISK EVENT B: Failed Inspection Protocol',
      'RISK EVENT C: Material Defect/Shortage Protocol'
    ]
  },
  {
    id: 'type',
    type: 'select',
    label: 'Event Category',
    placeholder: 'Select event category',
    required: true,
    order: 1,
    options: ['phase-0-precontract', 'phase-1-preconstruction', 'phase-2-mobilization', 'phase-3-tearoff', 'phase-4-dryin', 'phase-5-installation', 'phase-6-completion', 'phase-7-closeout', 'risk-event']
  },
  {
    id: 'projectId',
    type: 'select',
    label: 'Project',
    placeholder: 'Select project',
    required: true,
    order: 2,
    options: ['Residential Roof Replacement - Johnson Family', 'Commercial TPO Installation - Tampa Business Center', 'Metal Roof Repair - Smith Residence']
  },
  {
    id: 'startDate',
    type: 'date',
    label: 'Start Date',
    placeholder: 'Select start date',
    required: true,
    order: 3
  },
  {
    id: 'startTime',
    type: 'text',
    label: 'Start Time',
    placeholder: 'Enter start time (e.g., 09:00 AM)',
    required: true,
    order: 4
  },
  {
    id: 'endDate',
    type: 'date',
    label: 'End Date',
    placeholder: 'Select end date',
    required: false,
    order: 5
  },
  {
    id: 'endTime',
    type: 'text',
    label: 'End Time',
    placeholder: 'Enter end time (e.g., 05:00 PM)',
    required: false,
    order: 6
  },
  {
    id: 'status',
    type: 'select',
    label: 'Status',
    placeholder: 'Select status',
    required: true,
    order: 7,
    options: ['scheduled', 'in-progress', 'completed', 'weather-hold', 'inspection-hold', 'material-hold', 'approval-pending', 'failed-inspection', 'cancelled', 'triggered-risk-event']
  },
  {
    id: 'description',
    type: 'textarea',
    label: 'Description',
    placeholder: 'Enter event description',
    required: true,
    order: 8
  },
  {
    id: 'location',
    type: 'text',
    label: 'Location',
    placeholder: 'Enter event location',
    required: false,
    order: 9
  },
  {
    id: 'assignedTo',
    type: 'select',
    label: 'Responsible Team/Role',
    placeholder: 'Select responsible team or role',
    required: true,
    order: 10,
    options: ['Sales Coordinator', 'Estimator/Inspector', 'Project Manager', 'Public Adjuster Liaison', 'Permit Coordinator', 'Administrative Staff', 'Purchasing Manager', 'Production Manager', 'Equipment Coordinator', 'Delivery Coordinator', 'Safety Officer', 'Crew Foreman', 'Installation Crew', 'Detail Specialist', 'Ventilation Specialist', 'Quality Control Manager', 'Municipal Inspector', 'Wind Mitigation Certified Inspector', 'Ground Crew']
  }
];

const AddTimelineEventModal: React.FC<AddTimelineEventModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const handleSave = (data: Record<string, any>) => {
    // Format the data into TimelineEventFormData structure
    const eventData: TimelineEventFormData = {
      title: data.title || '',
      type: data.type || 'task',
      startDate: data.startDate || '',
      startTime: data.startTime || '09:00',
      endDate: data.endDate || '',
      endTime: data.endTime || '17:00',
      status: data.status || 'scheduled',
      description: data.description || '',
      location: data.location || '',
      assignedTo: data.assignedTo || '',
      projectId: data.projectId || '1'
    };

    onSave(eventData);
  };

  return (
    <EditableModal
      isOpen={isOpen}
      onClose={onClose}
      modalId="add-timeline-event"
      title="Add Timeline Event"
      size="xl"
      category="project-management"
      customFields={defaultTimelineEventFields}
      onSubmit={handleSave}
      allowEdit={true}
      showEditButton={true}
    />
  );
};

export default AddTimelineEventModal;
export type { TimelineEventFormData };