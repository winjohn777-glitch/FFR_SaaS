import { ModalStructure, ModalField } from '../components/ModalStructureEditor';

export interface FieldMapping {
  modalId: string;
  fieldId: string;
  fieldLabel: string;
  fieldType: string;
  documentType: 'invoice' | 'proposal' | 'contract' | 'report';
  mappingPath: string; // JSON path in document data structure
}

class ModalStructureService {
  private static instance: ModalStructureService;
  private inMemoryStructures: Record<string, ModalStructure> = {};
  private changeListeners: ((modalId: string, structure: ModalStructure) => void)[] = [];

  private constructor() {
    // Initialize with default structures (removed localStorage migration)
    this.inMemoryStructures = this.getDefaultStructures();
    console.log('🏁 ModalStructureService initialized with default structures');
  }

  static getInstance(): ModalStructureService {
    if (!ModalStructureService.instance) {
      ModalStructureService.instance = new ModalStructureService();
    }
    return ModalStructureService.instance;
  }

  // Get modal structure from in-memory storage
  getModalStructure(modalId: string): ModalStructure | null {
    return this.inMemoryStructures[modalId] || null;
  }

  // Save modal structure to in-memory storage
  setModalStructure(modalId: string, structure: ModalStructure): void {
    this.inMemoryStructures[modalId] = structure;
    console.log(`💾 Modal structure updated for ${modalId}:`, structure.title);

    // Notify listeners of the change
    this.changeListeners.forEach(listener => {
      try {
        listener(modalId, structure);
      } catch (error) {
        console.error('Error notifying modal structure change listener:', error);
      }
    });
  }

  // Get all modal structures from in-memory storage
  getAllModalStructures(): Record<string, ModalStructure> {
    return { ...this.inMemoryStructures };
  }

  // Clear all modal structures
  clearAllModalStructures(): void {
    this.inMemoryStructures = {};
    console.log('🗺️ Cleared all modal structures from memory');
  }

  // Reset modal structures to default configurations
  resetToDefaults(): void {
    this.inMemoryStructures = this.getDefaultStructures();
    console.log('⚙️ Reset modal structures to default configurations');
  }

  // Get default modal structures
  private getDefaultStructures(): Record<string, ModalStructure> {
    // Return basic default structures that can be customized
    return {
      'add-customer': {
        id: 'add-customer',
        title: 'Add Customer',
        fields: [
          { id: 'firstName', label: 'First Name', type: 'text', required: true, order: 1 },
          { id: 'lastName', label: 'Last Name', type: 'text', required: true, order: 2 },
          { id: 'email', label: 'Email', type: 'email', required: false, order: 3 },
          { id: 'phone', label: 'Phone', type: 'phone', required: false, order: 4 },
          { id: 'address', label: 'Address', type: 'text', required: false, order: 5 }
        ]
      },
      'add-project': {
        id: 'add-project',
        title: 'Add Project',
        fields: [
          { id: 'name', label: 'Project Name', type: 'text', required: true, order: 1 },
          { id: 'client', label: 'Client', type: 'text', required: true, order: 2 },
          { id: 'budget', label: 'Budget', type: 'currency', required: false, order: 3 },
          { id: 'startDate', label: 'Start Date', type: 'date', required: false, order: 4 }
        ]
      }
    };
  }

  // Get fields that should be included in documents
  getDocumentRelevantFields(modalId: string): ModalField[] {
    const structure = this.getModalStructure(modalId);
    if (!structure) return [];

    // Define which field types are relevant for documents
    const documentRelevantTypes = [
      'text', 'email', 'phone', 'number', 'currency',
      'date', 'textarea', 'select'
    ];

    return structure.fields
      .filter(field => documentRelevantTypes.includes(field.type))
      .sort((a, b) => a.order - b.order);
  }

  // Generate field mappings for different document types
  generateFieldMappings(modalId: string): FieldMapping[] {
    const fields = this.getDocumentRelevantFields(modalId);
    const mappings: FieldMapping[] = [];

    fields.forEach(field => {
      // Create mappings based on modal type and field purpose
      if (modalId === 'add-customer' || modalId === 'edit-customer') {
        if (field.id.includes('name') || field.id.includes('Name')) {
          mappings.push({
            modalId,
            fieldId: field.id,
            fieldLabel: field.label,
            fieldType: field.type,
            documentType: 'invoice',
            mappingPath: 'customerName'
          });
        } else if (field.id.includes('address') || field.id.includes('Address')) {
          mappings.push({
            modalId,
            fieldId: field.id,
            fieldLabel: field.label,
            fieldType: field.type,
            documentType: 'invoice',
            mappingPath: 'customerAddress'
          });
        } else if (field.id.includes('phone') || field.id.includes('Phone')) {
          mappings.push({
            modalId,
            fieldId: field.id,
            fieldLabel: field.label,
            fieldType: field.type,
            documentType: 'invoice',
            mappingPath: 'customerPhone'
          });
        } else if (field.id.includes('email') || field.id.includes('Email')) {
          mappings.push({
            modalId,
            fieldId: field.id,
            fieldLabel: field.label,
            fieldType: field.type,
            documentType: 'invoice',
            mappingPath: 'customerEmail'
          });
        }
      } else if (modalId === 'add-project' || modalId === 'edit-project') {
        if (field.id.includes('name') || field.id.includes('Name')) {
          mappings.push({
            modalId,
            fieldId: field.id,
            fieldLabel: field.label,
            fieldType: field.type,
            documentType: 'invoice',
            mappingPath: 'jobName'
          });
        } else if (field.id.includes('budget') || field.id.includes('Budget')) {
          mappings.push({
            modalId,
            fieldId: field.id,
            fieldLabel: field.label,
            fieldType: field.type,
            documentType: 'invoice',
            mappingPath: 'amount'
          });
        } else if (field.id.includes('description') || field.id.includes('Description')) {
          mappings.push({
            modalId,
            fieldId: field.id,
            fieldLabel: field.label,
            fieldType: field.type,
            documentType: 'invoice',
            mappingPath: 'notes'
          });
        }
      }
    });

    return mappings;
  }

  // Transform form data using custom field structure
  transformFormDataForDocument(modalId: string, formData: Record<string, any>): Record<string, any> {
    const mappings = this.generateFieldMappings(modalId);
    const transformedData: Record<string, any> = { ...formData };

    mappings.forEach(mapping => {
      const value = formData[mapping.fieldId];
      if (value !== undefined) {
        // Apply transformations based on field type
        switch (mapping.fieldType) {
          case 'currency':
            transformedData[mapping.mappingPath] = typeof value === 'string'
              ? parseFloat(value.replace(/[^\d.-]/g, '')) || 0
              : value;
            break;
          case 'phone':
            transformedData[mapping.mappingPath] = this.formatPhoneNumber(value);
            break;
          case 'date':
            transformedData[mapping.mappingPath] = new Date(value).toLocaleDateString();
            break;
          default:
            transformedData[mapping.mappingPath] = value;
        }
      }
    });

    return transformedData;
  }

  // Format phone number consistently
  private formatPhoneNumber(phone: string): string {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  }

  // Get custom fields that should be added to document sections
  getCustomDocumentFields(modalId: string): ModalField[] {
    const structure = this.getModalStructure(modalId);
    if (!structure) return [];

    // Return fields that are not in the default structure (i.e., custom fields)
    const defaultFieldIds = this.getDefaultFieldIds(modalId);
    return structure.fields.filter(field => !defaultFieldIds.includes(field.id));
  }

  // Define default field IDs for each modal type
  private getDefaultFieldIds(modalId: string): string[] {
    const defaultFields: Record<string, string[]> = {
      'add-customer': ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'],
      'add-job': ['name', 'customer', 'projectType', 'type', 'startDate', 'estimatedValue'],
      'add-project': ['name', 'client', 'address', 'roofType', 'squareFootage', 'startDate', 'budget'],
      'edit-project': ['name', 'client', 'address', 'roofType', 'squareFootage', 'startDate', 'budget', 'status', 'progress'],
      'assign-crew': ['projectName', 'foreman', 'leadRoofer', 'startDate', 'estimatedDuration']
    };

    return defaultFields[modalId] || [];
  }

  // Generate dynamic PDF section based on custom fields
  generateCustomPDFSection(modalId: string, data: Record<string, any>): string {
    const customFields = this.getCustomDocumentFields(modalId);
    if (customFields.length === 0) return '';

    let section = '\n\nCustom Information:\n';
    customFields.forEach(field => {
      const value = data[field.id];
      if (value !== undefined && value !== '') {
        section += `${field.label}: ${value}\n`;
      }
    });

    return section;
  }

  // Subscribe to modal structure changes (in-memory)
  onModalStructureChange(callback: (modalId: string, structure: ModalStructure) => void): () => void {
    this.changeListeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.changeListeners.indexOf(callback);
      if (index > -1) {
        this.changeListeners.splice(index, 1);
      }
    };
  }

  // Get statistics about modal structures
  getModalStructureStats(): {
    totalStructures: number;
    totalCustomFields: number;
    structuresByType: Record<string, number>;
  } {
    const structures = Object.values(this.inMemoryStructures);
    const defaultFieldIds = Object.keys(this.getDefaultStructures()).reduce((acc, modalId) => {
      acc[modalId] = this.getDefaultFieldIds(modalId);
      return acc;
    }, {} as Record<string, string[]>);

    let totalCustomFields = 0;
    const structuresByType: Record<string, number> = {};

    structures.forEach(structure => {
      const defaultFields = defaultFieldIds[structure.id] || [];
      const customFields = structure.fields.filter(field => !defaultFields.includes(field.id));
      totalCustomFields += customFields.length;

      const type = structure.id.includes('add') ? 'add' :
                   structure.id.includes('edit') ? 'edit' : 'other';
      structuresByType[type] = (structuresByType[type] || 0) + 1;
    });

    return {
      totalStructures: structures.length,
      totalCustomFields,
      structuresByType
    };
  }
}

export default ModalStructureService;