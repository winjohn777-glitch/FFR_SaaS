import React from 'react';
import EditableModal from '../EditableModal';
import { ModalField } from '../ModalStructureEditor';

interface AddBudgetItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budgetData: BudgetItemFormData) => void;
}

interface BudgetItemFormData {
  projectId: string;
  category: 'materials' | 'labor' | 'permits' | 'equipment' | 'disposal' | 'overhead' | 'profit' | 'miscellaneous';
  itemName: string;
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  vendor: string;
  dateEstimated: string;
  dateActual: string;
  status: 'estimated' | 'quoted' | 'ordered' | 'delivered' | 'paid' | 'disputed';
  notes: string;
  invoiceNumber: string;
  phase: string;
}

// Default fields for Add Budget Item Modal
const defaultBudgetItemFields: ModalField[] = [
  {
    id: 'projectId',
    type: 'select',
    label: 'Project',
    placeholder: 'Select project',
    required: true,
    order: 0,
    options: ['Residential Roof Replacement - Johnson Family', 'Commercial TPO Installation - Tampa Business Center', 'Metal Roof Repair - Smith Residence']
  },
  {
    id: 'category',
    type: 'select',
    label: 'Budget Category',
    placeholder: 'Select budget category',
    required: true,
    order: 1,
    options: [
      'Materials (Shingles, Underlayment, Flashing)',
      'Labor (Installation, Supervision, Specialty)',
      'Permits (Building, Electrical, Special)',
      'Equipment (Rental, Delivery, Fuel)',
      'Disposal (Dumpster, Haul-off, Recycling)',
      'Overhead (Insurance, Admin, Transportation)',
      'Profit Margin (Base Profit, Risk Premium)',
      'Miscellaneous (Unexpected, Change Orders)'
    ]
  },
  {
    id: 'itemName',
    type: 'text',
    label: 'Item Name',
    placeholder: 'Enter item name (e.g., Architectural Shingles)',
    required: true,
    order: 2
  },
  {
    id: 'description',
    type: 'textarea',
    label: 'Description',
    placeholder: 'Enter detailed description of the item',
    required: false,
    order: 3
  },
  {
    id: 'quantity',
    type: 'number',
    label: 'Quantity',
    placeholder: 'Enter quantity',
    required: true,
    order: 4
  },
  {
    id: 'unitCost',
    type: 'number',
    label: 'Unit Cost ($)',
    placeholder: 'Enter cost per unit',
    required: true,
    order: 5
  },
  {
    id: 'totalCost',
    type: 'number',
    label: 'Total Cost ($)',
    placeholder: 'Total will calculate automatically',
    required: false,
    order: 6
  },
  {
    id: 'vendor',
    type: 'select',
    label: 'Vendor/Supplier',
    placeholder: 'Select vendor or supplier',
    required: false,
    order: 7,
    options: [
      'ABC Supply Co.',
      'Home Depot Pro',
      'Lowe\'s Commercial',
      'GAF Materials',
      'Owens Corning',
      'CertainTeed',
      'IKO Roofing',
      'Local Supplier',
      'Direct from Manufacturer',
      'Subcontractor',
      'Internal Labor',
      'Other'
    ]
  },
  {
    id: 'dateEstimated',
    type: 'date',
    label: 'Estimated Date',
    placeholder: 'Select estimated date',
    required: false,
    order: 8
  },
  {
    id: 'dateActual',
    type: 'date',
    label: 'Actual Date',
    placeholder: 'Select actual date (if completed)',
    required: false,
    order: 9
  },
  {
    id: 'status',
    type: 'select',
    label: 'Purchase Status',
    placeholder: 'Select current status',
    required: true,
    order: 10,
    options: ['estimated', 'quoted', 'ordered', 'delivered', 'paid', 'disputed']
  },
  {
    id: 'phase',
    type: 'select',
    label: 'Project Phase',
    placeholder: 'Select project phase',
    required: false,
    order: 11,
    options: [
      'Pre-Construction',
      'Mobilization',
      'Tear-Off',
      'Dry-In',
      'Installation',
      'Completion',
      'Closeout'
    ]
  },
  {
    id: 'invoiceNumber',
    type: 'text',
    label: 'Invoice/PO Number',
    placeholder: 'Enter invoice or purchase order number',
    required: false,
    order: 12
  },
  {
    id: 'notes',
    type: 'textarea',
    label: 'Notes',
    placeholder: 'Enter any additional notes or special instructions',
    required: false,
    order: 13
  }
];

const AddBudgetItemModal: React.FC<AddBudgetItemModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const handleSave = (data: Record<string, any>) => {
    // Calculate total cost if not provided
    const quantity = parseFloat(data.quantity) || 0;
    const unitCost = parseFloat(data.unitCost) || 0;
    const totalCost = data.totalCost ? parseFloat(data.totalCost) : quantity * unitCost;

    // Format the data into BudgetItemFormData structure
    const budgetData: BudgetItemFormData = {
      projectId: data.projectId || '1',
      category: data.category || 'materials',
      itemName: data.itemName || '',
      description: data.description || '',
      quantity: quantity,
      unitCost: unitCost,
      totalCost: totalCost,
      vendor: data.vendor || '',
      dateEstimated: data.dateEstimated || '',
      dateActual: data.dateActual || '',
      status: data.status || 'estimated',
      notes: data.notes || '',
      invoiceNumber: data.invoiceNumber || '',
      phase: data.phase || 'Pre-Construction'
    };

    onSave(budgetData);
  };

  return (
    <EditableModal
      isOpen={isOpen}
      onClose={onClose}
      modalId="add-budget-item"
      title="Add Budget Item"
      size="xl"
      category="project-management"
      customFields={defaultBudgetItemFields}
      onSubmit={handleSave}
      allowEdit={true}
      showEditButton={true}
    />
  );
};

export default AddBudgetItemModal;
export type { BudgetItemFormData };