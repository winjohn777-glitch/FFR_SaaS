import React from 'react';
import EditableModal from '../components/EditableModal';
import { ModalField } from '../components/ModalStructureEditor';

/**
 * CUSTOMIZABLE MODAL TEMPLATE
 *
 * Use this template as a starting point for creating new modals with built-in customization.
 *
 * INSTRUCTIONS:
 * 1. Copy this file to your desired location (e.g., src/components/YourModule/YourModal.tsx)
 * 2. Rename the component and interface names to match your use case
 * 3. Update the modalId to be unique (e.g., 'add-employee', 'edit-invoice', etc.)
 * 4. Modify the defaultFields array to include your required fields
 * 5. Update the FormData interface to match your data structure
 * 6. Implement the handleSubmit function according to your business logic
 * 7. Update the category to match your module (e.g., 'hr', 'accounting', 'inventory')
 *
 * EXAMPLE USAGE:
 * ```tsx
 * <YourModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   onSave={(data) => handleSaveData(data)}
 *   initialData={existingData} // Optional for edit modals
 * />
 * ```
 */

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TemplateFormData) => void;
  initialData?: TemplateFormData; // Optional for edit modals
}

// TODO: Replace with your actual data structure
interface TemplateFormData {
  // Basic required fields
  name: string;
  description: string;

  // Optional fields - customize as needed
  category?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'active' | 'inactive' | 'pending';
  date?: string;
  amount?: string;

  // Contact information (common in many modals)
  email?: string;
  phone?: string;
  address?: string;

  // Custom fields - any additional fields added by users
  [key: string]: any;
}

/**
 * Default fields for the modal
 *
 * CUSTOMIZATION GUIDE:
 * - Add/remove fields based on your requirements
 * - Each field must have: id, type, label, required, order
 * - Optional properties: placeholder, options (for select), validation
 *
 * Available field types:
 * - 'text', 'email', 'phone', 'number', 'currency'
 * - 'date', 'textarea', 'select', 'checkbox', 'file'
 */
const defaultTemplateFields: ModalField[] = [
  {
    id: 'name',
    type: 'text',
    label: 'Name', // TODO: Update to your field label
    placeholder: 'Enter name', // TODO: Update placeholder text
    required: true,
    order: 0
  },
  {
    id: 'description',
    type: 'textarea',
    label: 'Description',
    placeholder: 'Enter description',
    required: true,
    order: 1
  },
  {
    id: 'category',
    type: 'select',
    label: 'Category',
    placeholder: 'Select category',
    required: false,
    options: [
      'Option 1', // TODO: Replace with your actual options
      'Option 2',
      'Option 3'
    ],
    order: 2
  },
  {
    id: 'priority',
    type: 'select',
    label: 'Priority',
    placeholder: 'Select priority level',
    required: false,
    options: ['low', 'medium', 'high', 'urgent'],
    order: 3
  },
  {
    id: 'status',
    type: 'select',
    label: 'Status',
    placeholder: 'Select status',
    required: true,
    options: ['active', 'inactive', 'pending'],
    order: 4
  },
  {
    id: 'date',
    type: 'date',
    label: 'Date',
    placeholder: 'Select date',
    required: false,
    order: 5
  },
  {
    id: 'amount',
    type: 'currency',
    label: 'Amount',
    placeholder: 'Enter amount',
    required: false,
    order: 6
  },
  {
    id: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter email address',
    required: false,
    order: 7
  },
  {
    id: 'phone',
    type: 'phone',
    label: 'Phone',
    placeholder: 'Enter phone number',
    required: false,
    order: 8
  },
  {
    id: 'address',
    type: 'textarea',
    label: 'Address',
    placeholder: 'Enter address',
    required: false,
    order: 9
  }
];

/**
 * TODO: Rename this component to match your use case
 * Examples: AddEmployeeModal, EditInvoiceModal, CreateTaskModal
 */
const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const handleSubmit = (data: Record<string, any>) => {
    // TODO: Transform form data to match your data structure
    const formattedData: TemplateFormData = {
      name: data.name || '',
      description: data.description || '',
      category: data.category || '',
      priority: data.priority as 'low' | 'medium' | 'high' | 'urgent',
      status: data.status as 'active' | 'inactive' | 'pending',
      date: data.date || '',
      amount: data.amount || '',
      email: data.email || '',
      phone: data.phone || '',
      address: data.address || '',

      // Include any additional custom fields
      ...Object.keys(data)
        .filter(key => !['name', 'description', 'category', 'priority', 'status', 'date', 'amount', 'email', 'phone', 'address'].includes(key))
        .reduce((acc, key) => ({ ...acc, [key]: data[key] }), {})
    };

    // TODO: Add any validation logic here
    if (!formattedData.name.trim()) {
      alert('Name is required');
      return;
    }

    // TODO: Add any additional business logic
    // Examples:
    // - Generate unique IDs
    // - Format dates
    // - Calculate derived values
    // - Validate business rules

    onSave(formattedData);
  };

  return (
    <EditableModal
      isOpen={isOpen}
      onClose={onClose}
      modalId="template-modal" // TODO: Replace with unique ID like 'add-employee' or 'edit-invoice'
      title="Template Modal" // TODO: Replace with your modal title
      size="lg" // Options: 'sm', 'md', 'lg', 'xl'
      category="template" // TODO: Replace with your module category
      customFields={defaultTemplateFields}
      onSubmit={handleSubmit}
      initialData={initialData}
      allowEdit={true}
      showEditButton={true}
    />
  );
};

export default TemplateModal;

/**
 * ADVANCED CUSTOMIZATION OPTIONS:
 *
 * 1. CONDITIONAL FIELDS:
 *    You can make fields appear/disappear based on other field values by
 *    implementing conditional logic in the DynamicFormGenerator.
 *
 * 2. FIELD VALIDATION:
 *    Add custom validation rules to fields:
 *    ```
 *    validation: {
 *      min: 0,
 *      max: 100,
 *      pattern: /^[A-Z0-9]+$/,
 *      custom: (value) => value.length >= 3 || 'Must be at least 3 characters'
 *    }
 *    ```
 *
 * 3. DEPENDENT OPTIONS:
 *    For select fields that depend on other field values:
 *    ```
 *    dependsOn: 'category',
 *    optionsMap: {
 *      'residential': ['Single Family', 'Townhouse', 'Condo'],
 *      'commercial': ['Office', 'Retail', 'Industrial']
 *    }
 *    ```
 *
 * 4. FIELD GROUPING:
 *    Group related fields together:
 *    ```
 *    group: 'contact-info',
 *    groupLabel: 'Contact Information'
 *    ```
 *
 * 5. HELP TEXT:
 *    Add helpful descriptions to fields:
 *    ```
 *    helpText: 'This field is used to...'
 *    ```
 *
 * 6. FIELD STYLING:
 *    Apply custom styling to specific fields:
 *    ```
 *    className: 'highlight-field',
 *    style: { backgroundColor: '#f0f8ff' }
 *    ```
 *
 * DOCUMENT INTEGRATION:
 * Your modal will automatically integrate with the document generation system.
 * The DocumentGenerationService will map your fields to appropriate document
 * templates based on the modalId and field names.
 *
 * TESTING:
 * 1. Test the modal in both view and edit modes
 * 2. Verify custom field functionality works
 * 3. Test document generation with your data
 * 4. Ensure form validation works correctly
 * 5. Test with various screen sizes for responsiveness
 *
 * DEPLOYMENT CHECKLIST:
 * □ Updated all TODO comments
 * □ Replaced template names with actual component names
 * □ Set unique modalId
 * □ Configured appropriate default fields
 * □ Implemented business logic in handleSubmit
 * □ Added proper TypeScript interfaces
 * □ Tested all functionality
 * □ Added to module imports/exports
 * □ Updated documentation if needed
 */