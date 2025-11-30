import React from 'react';
import EditableModal from '../EditableModal';
import { ModalField } from '../ModalStructureEditor';

interface AddEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (equipmentData: EquipmentFormData) => void;
}

interface EquipmentFormData {
  name: string;
  category: 'safety' | 'roofing' | 'electrical' | 'lifting' | 'cutting' | 'measuring' | 'transportation' | 'tarping';
  manufacturer: string;
  model: string;
  serialNumber: string;
  condition: 'excellent' | 'good' | 'fair' | 'needs-repair' | 'out-of-service';
  purchaseDate: string;
  lastInspection: string;
  nextInspection: string;
  assignedTo: string;
  currentLocation: string;
  notes: string;
}

// Default fields for Add Equipment Modal
const defaultEquipmentFields: ModalField[] = [
  {
    id: 'name',
    type: 'text',
    label: 'Equipment Name',
    placeholder: 'Enter equipment name',
    required: true,
    order: 0
  },
  {
    id: 'category',
    type: 'select',
    label: 'Equipment Category',
    placeholder: 'Select equipment category',
    required: true,
    order: 1,
    options: [
      'Safety Equipment (Harnesses, Ropes, Anchors)',
      'Roofing Tools (Nail Guns, Hammers, Pry Bars)',
      'Electrical Tools (Drills, Saws, Grinders)',
      'Lifting Equipment (Hoists, Conveyors, Lifts)',
      'Cutting Tools (Shears, Cutters, Knives)',
      'Measuring Tools (Squares, Levels, Tape Measures)',
      'Transportation (Trucks, Trailers, Dollies)',
      'Tarping & Protection (Tarps, Plastic, Drop Cloths)'
    ]
  },
  {
    id: 'manufacturer',
    type: 'text',
    label: 'Manufacturer',
    placeholder: 'Enter manufacturer name',
    required: false,
    order: 2
  },
  {
    id: 'model',
    type: 'text',
    label: 'Model Number',
    placeholder: 'Enter model number',
    required: false,
    order: 3
  },
  {
    id: 'serialNumber',
    type: 'text',
    label: 'Serial Number',
    placeholder: 'Enter serial number',
    required: false,
    order: 4
  },
  {
    id: 'condition',
    type: 'select',
    label: 'Equipment Condition',
    placeholder: 'Select current condition',
    required: true,
    order: 5,
    options: ['excellent', 'good', 'fair', 'needs-repair', 'out-of-service']
  },
  {
    id: 'purchaseDate',
    type: 'date',
    label: 'Purchase Date',
    placeholder: 'Select purchase date',
    required: false,
    order: 6
  },
  {
    id: 'lastInspection',
    type: 'date',
    label: 'Last Inspection Date',
    placeholder: 'Select last inspection date',
    required: false,
    order: 7
  },
  {
    id: 'nextInspection',
    type: 'date',
    label: 'Next Inspection Due',
    placeholder: 'Select next inspection date',
    required: false,
    order: 8
  },
  {
    id: 'assignedTo',
    type: 'select',
    label: 'Assigned To',
    placeholder: 'Select crew member or team',
    required: false,
    order: 9,
    options: ['Shop Inventory', 'Crew Foreman', 'Installation Team', 'Safety Officer', 'Site Supervisor', 'Equipment Coordinator', 'Maintenance Crew']
  },
  {
    id: 'currentLocation',
    type: 'text',
    label: 'Current Location',
    placeholder: 'Enter current location (shop, job site, etc.)',
    required: false,
    order: 10
  },
  {
    id: 'notes',
    type: 'textarea',
    label: 'Notes',
    placeholder: 'Enter any additional notes about this equipment',
    required: false,
    order: 11
  }
];

const AddEquipmentModal: React.FC<AddEquipmentModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const handleSave = (data: Record<string, any>) => {
    // Format the data into EquipmentFormData structure
    const equipmentData: EquipmentFormData = {
      name: data.name || '',
      category: data.category || 'roofing',
      manufacturer: data.manufacturer || '',
      model: data.model || '',
      serialNumber: data.serialNumber || '',
      condition: data.condition || 'good',
      purchaseDate: data.purchaseDate || '',
      lastInspection: data.lastInspection || '',
      nextInspection: data.nextInspection || '',
      assignedTo: data.assignedTo || 'Shop Inventory',
      currentLocation: data.currentLocation || '',
      notes: data.notes || ''
    };

    onSave(equipmentData);
  };

  return (
    <EditableModal
      isOpen={isOpen}
      onClose={onClose}
      modalId="add-equipment"
      title="Add Equipment"
      size="xl"
      category="project-management"
      customFields={defaultEquipmentFields}
      onSubmit={handleSave}
      allowEdit={true}
      showEditButton={true}
    />
  );
};

export default AddEquipmentModal;
export type { EquipmentFormData };