import React from 'react';
import EditableModal from '../EditableModal';
import { ModalField } from '../ModalStructureEditor';
import { useData } from '../../contexts/DataContext';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (jobData: JobFormData) => void;
}

interface JobFormData {
  name: string;
  customer: string;
  projectType: string;
  description: string;
  startDate: string;
  estimatedEndDate: string;
  estimatedCost: string;
  laborCost: string;
  materialCost: string;
  equipmentCost: string;
  location: string;
  projectManager: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed';
  notes: string;
}

// Default fields for Add Job Modal
const defaultJobFields: ModalField[] = [
  {
    id: 'existingProject',
    type: 'select',
    label: 'Import from Existing Project (Optional)',
    placeholder: 'Select project to auto-populate data',
    required: false,
    options: [], // Will be populated from context
    order: 0
  },
  {
    id: 'name',
    type: 'text',
    label: 'Job Name',
    placeholder: 'Enter job name',
    required: true,
    order: 1
  },
  {
    id: 'customer',
    type: 'select',
    label: 'Customer',
    placeholder: 'Select customer',
    required: true,
    options: [], // Will be populated from context
    order: 2
  },
  {
    id: 'projectType',
    type: 'select',
    label: 'Project Type',
    placeholder: 'Select project type',
    required: true,
    options: [
      'Re-Roof',
      'New Construction',
      'Repair',
      'Maintenance',
      'Storm Damage',
      'Emergency',
      'Commercial',
      'Residential'
    ],
    order: 3
  },
  {
    id: 'description',
    type: 'textarea',
    label: 'Description',
    placeholder: 'Enter project description',
    required: true,
    order: 4
  },
  {
    id: 'startDate',
    type: 'date',
    label: 'Start Date',
    placeholder: 'Select start date',
    required: true,
    order: 5
  },
  {
    id: 'estimatedEndDate',
    type: 'date',
    label: 'Estimated End Date',
    placeholder: 'Select estimated end date',
    required: true,
    order: 6
  },
  {
    id: 'estimatedCost',
    type: 'currency',
    label: 'Estimated Total Cost',
    placeholder: 'Enter estimated total cost',
    required: true,
    order: 6
  },
  {
    id: 'laborCost',
    type: 'currency',
    label: 'Labor Cost',
    placeholder: 'Enter labor cost',
    required: false,
    order: 7
  },
  {
    id: 'materialCost',
    type: 'currency',
    label: 'Material Cost',
    placeholder: 'Enter material cost',
    required: false,
    order: 8
  },
  {
    id: 'equipmentCost',
    type: 'currency',
    label: 'Equipment Cost',
    placeholder: 'Enter equipment cost',
    required: false,
    order: 9
  },
  {
    id: 'location',
    type: 'text',
    label: 'Job Location',
    placeholder: 'Enter job location/address',
    required: true,
    order: 10
  },
  {
    id: 'projectManager',
    type: 'select',
    label: 'Project Manager',
    placeholder: 'Select project manager',
    required: false,
    options: [
      'John Doe',
      'Jane Smith',
      'Mike Johnson',
      'Sarah Wilson',
      'Unassigned'
    ],
    order: 11
  },
  {
    id: 'priority',
    type: 'select',
    label: 'Priority',
    placeholder: 'Select priority level',
    required: true,
    options: ['Low', 'Medium', 'High', 'Critical'],
    order: 12
  },
  {
    id: 'status',
    type: 'select',
    label: 'Status',
    placeholder: 'Select job status',
    required: true,
    options: ['Planning', 'In Progress', 'On Hold', 'Completed'],
    order: 13
  },
  {
    id: 'notes',
    type: 'textarea',
    label: 'Notes',
    placeholder: 'Enter any additional notes about the job',
    required: false,
    order: 14
  }
];

const AddJobModal: React.FC<AddJobModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const { customers, jobs } = useData();

  // Create dynamic fields with customer and job options
  const getFieldsWithCustomers = (): ModalField[] => {
    const customerOptions = customers.map(customer =>
      `${customer.firstName} ${customer.lastName}${customer.companyName ? ` (${customer.companyName})` : ''}`
    );

    const projectOptions = jobs.map(job =>
      `${job.name} - ${job.customer} (${job.projectType})`
    );

    return defaultJobFields.map(field => {
      if (field.id === 'customer') {
        return {
          ...field,
          options: customerOptions.length > 0 ? customerOptions : ['No customers available']
        };
      }
      if (field.id === 'existingProject') {
        return {
          ...field,
          options: projectOptions.length > 0 ? ['-- None (Manual Entry) --', ...projectOptions] : ['No projects available']
        };
      }
      return field;
    });
  };

  const handleSubmit = (data: Record<string, any>) => {
    // Check if auto-populating from existing project
    let jobData: JobFormData;

    if (data.existingProject && data.existingProject !== '-- None (Manual Entry) --') {
      // Find the selected project and auto-populate data
      const selectedProjectIndex = jobs.findIndex(job =>
        `${job.name} - ${job.customer} (${job.projectType})` === data.existingProject
      );

      if (selectedProjectIndex !== -1) {
        const selectedProject = jobs[selectedProjectIndex];

        // Auto-populate job data from existing project
        jobData = {
          name: data.name || `${selectedProject.name} - Job Costing`,
          customer: data.customer || selectedProject.customer,
          projectType: data.projectType || selectedProject.projectType,
          description: data.description || selectedProject.description || `Job costing for ${selectedProject.name}`,
          startDate: data.startDate || selectedProject.startDate || '',
          estimatedEndDate: data.estimatedEndDate || '',
          estimatedCost: data.estimatedCost || selectedProject.estimatedValue?.toString() || '0',
          laborCost: data.laborCost || selectedProject.laborCosts?.toString() || '0',
          materialCost: data.materialCost || selectedProject.materialCosts?.toString() || '0',
          equipmentCost: data.equipmentCost || selectedProject.equipmentCosts?.toString() || '0',
          location: data.location || '',
          projectManager: data.projectManager || '',
          priority: (data.priority as 'Low' | 'Medium' | 'High' | 'Critical') || 'Medium',
          status: (data.status as 'Planning' | 'In Progress' | 'On Hold' | 'Completed') || 'Planning',
          notes: data.notes || `Auto-imported from project: ${selectedProject.name}`
        };

        console.log(`✅ Auto-populated job data from project: ${selectedProject.name}`);
      } else {
        // Fallback to manual entry
        jobData = createManualJobData(data);
      }
    } else {
      // Manual entry mode
      jobData = createManualJobData(data);
    }

    onSave(jobData);
  };

  // Helper function for manual job data creation
  const createManualJobData = (data: Record<string, any>): JobFormData => {
    return {
      name: data.name || '',
      customer: data.customer || '',
      projectType: data.projectType || '',
      description: data.description || '',
      startDate: data.startDate || '',
      estimatedEndDate: data.estimatedEndDate || '',
      estimatedCost: data.estimatedCost || '0',
      laborCost: data.laborCost || '0',
      materialCost: data.materialCost || '0',
      equipmentCost: data.equipmentCost || '0',
      location: data.location || '',
      projectManager: data.projectManager || '',
      priority: data.priority as 'Low' | 'Medium' | 'High' | 'Critical',
      status: data.status as 'Planning' | 'In Progress' | 'On Hold' | 'Completed',
      notes: data.notes || ''
    };
  };

  return (
    <EditableModal
      isOpen={isOpen}
      onClose={onClose}
      modalId="add-job"
      title="Add New Job"
      size="xl"
      category="project"
      customFields={getFieldsWithCustomers()}
      onSubmit={handleSubmit}
      allowEdit={true}
      showEditButton={true}
    />
  );
};

export default AddJobModal;