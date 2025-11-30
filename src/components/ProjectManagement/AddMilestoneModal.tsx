import React from 'react';
import EditableModal from '../EditableModal';
import { ModalField } from '../ModalStructureEditor';

interface AddMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (milestoneData: MilestoneFormData) => void;
}

interface MilestoneFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  assignedTo: string;
  dependencies: string;
  projectId: string;
}

// Default fields for Add Milestone Modal
const defaultMilestoneFields: ModalField[] = [
  {
    id: 'title',
    type: 'select',
    label: 'Milestone Checkpoint',
    placeholder: 'Select standardized milestone checkpoint',
    required: true,
    order: 0,
    options: [
      'M-001: Lead Qualified',
      'M-002: Inspection Completed',
      'M-003: Contract Signed',
      'M-004: Deposit Received',
      'M-005: Notice of Commencement Recorded',
      'M-006: Permit Application Submitted',
      'M-007: Permit Approved',
      'M-008: HOA Approval Received (Conditional)',
      'M-009: Insurance Approval Confirmed (If applicable)',
      'M-010: Materials Ordered',
      'M-011: Production Scheduled',
      'M-012: Materials Delivered',
      'M-013: Pre-Construction Customer Contact',
      'M-014: Crew Mobilized',
      'M-015: Safety Equipment Installed',
      'M-016: Permit Posted',
      'M-017: Tear-Off Started',
      'M-018: Deck Inspection Complete',
      'M-019: Wood Replacement Approved (If needed)',
      'M-020: Tear-Off Complete',
      'M-021: Dry-In Started',
      'M-022: Secondary Water Barrier Complete (HVHZ)',
      'M-023: Underlayment Complete',
      'M-024: Dry-In Inspection Requested',
      'M-025: Dry-In Inspection Passed',
      'M-026: Shingle Installation Started',
      'M-027: Field Installation Complete',
      'M-028: Ridge Vent/Ventilation Installed',
      'M-029: Hip & Ridge Complete',
      'M-030: All Flashings Complete',
      'M-031: Internal Quality Check Complete',
      'M-032: Cleanup Complete',
      'M-033: Final Inspection Scheduled',
      'M-034: Final Inspection Passed',
      'M-035: Customer Walkthrough Complete',
      'M-036: Final Invoice Sent',
      'M-037: Insurance Claim Supplemented (If needed)',
      'M-038: Final Payment Received',
      'M-039: Lien Waiver Issued',
      'M-040: Notice of Termination Filed',
      'M-041: Wind Mitigation Form Completed',
      'M-042: Manufacturer Warranty Registered',
      'M-043: Project Documentation Complete',
      'M-044: Customer Satisfaction Survey Sent',
      'M-045: Project Closed'
    ]
  },
  {
    id: 'projectId',
    type: 'select',
    label: 'Project',
    placeholder: 'Select project',
    required: true,
    order: 1,
    options: ['Residential Roof Replacement - Johnson Family', 'Commercial TPO Installation - Tampa Business Center', 'Metal Roof Repair - Smith Residence']
  },
  {
    id: 'description',
    type: 'textarea',
    label: 'Description',
    placeholder: 'Enter milestone description',
    required: true,
    order: 2
  },
  {
    id: 'dueDate',
    type: 'date',
    label: 'Due Date',
    placeholder: 'Select due date',
    required: true,
    order: 3
  },
  {
    id: 'priority',
    type: 'select',
    label: 'Critical Path Priority',
    placeholder: 'Select critical path priority',
    required: true,
    order: 4,
    options: ['contract-legal', 'permit-approval', 'material-scheduling', 'production-start', 'tearoff-phase', 'dryin-phase', 'installation-phase', 'quality-inspection', 'financial', 'warranty-documentation']
  },
  {
    id: 'status',
    type: 'select',
    label: 'Completion Status',
    placeholder: 'Select completion status',
    required: true,
    order: 5,
    options: ['not-started', 'scheduled', 'in-progress', 'complete', 'pending', 'approved', 'failed', 'cancelled', 'on-hold', 'rescheduled', 'weather-delay', 'inspection-hold', 'corrections-needed', 'past-due', 'n/a']
  },
  {
    id: 'assignedTo',
    type: 'select',
    label: 'Responsible Team/Role',
    placeholder: 'Select responsible team or role',
    required: false,
    order: 6,
    options: ['Sales Coordinator', 'Estimator/Inspector', 'Project Manager', 'Public Adjuster Liaison', 'Permit Coordinator', 'Administrative Staff', 'Purchasing Manager', 'Production Manager', 'Equipment Coordinator', 'Delivery Coordinator', 'Safety Officer', 'Crew Foreman', 'Installation Crew', 'Detail Specialist', 'Ventilation Specialist', 'Quality Control Manager', 'Municipal Inspector', 'Wind Mitigation Certified Inspector', 'Ground Crew']
  },
  {
    id: 'dependencies',
    type: 'text',
    label: 'Dependencies',
    placeholder: 'Enter dependent milestone IDs (comma separated)',
    required: false,
    order: 7
  }
];

const AddMilestoneModal: React.FC<AddMilestoneModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const handleSave = (data: Record<string, any>) => {
    // Format the data into MilestoneFormData structure
    const milestoneData: MilestoneFormData = {
      title: data.title || '',
      description: data.description || '',
      dueDate: data.dueDate || '',
      priority: data.priority || 'medium',
      status: data.status || 'pending',
      assignedTo: data.assignedTo || '',
      dependencies: data.dependencies || '',
      projectId: data.projectId || '1'
    };

    onSave(milestoneData);
  };

  return (
    <EditableModal
      isOpen={isOpen}
      onClose={onClose}
      modalId="add-milestone"
      title="Add Milestone"
      size="xl"
      category="project-management"
      customFields={defaultMilestoneFields}
      onSubmit={handleSave}
      allowEdit={true}
      showEditButton={true}
    />
  );
};

export default AddMilestoneModal;
export type { MilestoneFormData };