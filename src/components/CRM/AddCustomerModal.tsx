import React from 'react';
import EditableModal from '../EditableModal';
import { ModalField } from '../ModalStructureEditor';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customerData: CustomerFormData) => void;
}

interface CustomerFormData {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    county: string;
  };
  type: 'Residential' | 'Commercial';
  status: 'Active' | 'Prospect' | 'Inactive';
  website?: string;
  notes?: string;
}

// Default fields for Add Customer Modal
const defaultCustomerFields: ModalField[] = [
  {
    id: 'firstName',
    type: 'text',
    label: 'First Name',
    placeholder: 'Enter first name',
    required: true,
    order: 0
  },
  {
    id: 'lastName',
    type: 'text',
    label: 'Last Name',
    placeholder: 'Enter last name',
    required: true,
    order: 1
  },
  {
    id: 'companyName',
    type: 'text',
    label: 'Company Name',
    placeholder: 'Enter company name (optional)',
    required: false,
    order: 2
  },
  {
    id: 'email',
    type: 'email',
    label: 'Email Address',
    placeholder: 'Enter email address',
    required: true,
    order: 3
  },
  {
    id: 'phone',
    type: 'phone',
    label: 'Phone Number',
    placeholder: 'Enter phone number',
    required: true,
    order: 4
  },
  {
    id: 'address_street',
    type: 'text',
    label: 'Street Address',
    placeholder: 'Enter street address',
    required: true,
    order: 5
  },
  {
    id: 'address_city',
    type: 'text',
    label: 'City',
    placeholder: 'Enter city',
    required: true,
    order: 6
  },
  {
    id: 'address_state',
    type: 'select',
    label: 'State',
    placeholder: 'Select state',
    required: true,
    options: [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
      'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
      'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
      'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
      'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
      'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
      'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ],
    order: 7
  },
  {
    id: 'address_zipCode',
    type: 'text',
    label: 'ZIP Code',
    placeholder: 'Enter ZIP code',
    required: true,
    order: 8
  },
  {
    id: 'address_county',
    type: 'text',
    label: 'County',
    placeholder: 'Enter county',
    required: false,
    order: 9
  },
  {
    id: 'type',
    type: 'select',
    label: 'Customer Type',
    placeholder: 'Select customer type',
    required: true,
    options: ['Residential', 'Commercial'],
    order: 10
  },
  {
    id: 'status',
    type: 'select',
    label: 'Customer Status',
    placeholder: 'Select customer status',
    required: true,
    options: ['Active', 'Prospect', 'Inactive'],
    order: 11
  },
  {
    id: 'website',
    type: 'text',
    label: 'Website',
    placeholder: 'Enter website URL (optional)',
    required: false,
    order: 12
  },
  {
    id: 'notes',
    type: 'textarea',
    label: 'Notes',
    placeholder: 'Enter any additional notes about the customer',
    required: false,
    order: 13
  }
];

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const handleSubmit = (data: Record<string, any>) => {
    // Transform flat form data back to nested structure for backward compatibility
    const customerData: CustomerFormData = {
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      companyName: data.companyName || '',
      email: data.email || '',
      phone: data.phone || '',
      address: {
        street: data.address_street || '',
        city: data.address_city || '',
        state: data.address_state || '',
        zipCode: data.address_zipCode || '',
        county: data.address_county || ''
      },
      type: data.type as 'Residential' | 'Commercial',
      status: data.status as 'Active' | 'Prospect' | 'Inactive',
      website: data.website || '',
      notes: data.notes || ''
    };

    onSave(customerData);
  };

  return (
    <EditableModal
      isOpen={isOpen}
      onClose={onClose}
      modalId="add-customer"
      title="Add New Customer"
      size="lg"
      category="crm"
      customFields={defaultCustomerFields}
      onSubmit={handleSubmit}
      allowEdit={true}
      showEditButton={true}
    />
  );
};

export default AddCustomerModal;