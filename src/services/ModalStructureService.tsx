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

  private constructor() {}

  static getInstance(): ModalStructureService {
    if (!ModalStructureService.instance) {
      ModalStructureService.instance = new ModalStructureService();
    }
    return ModalStructureService.instance;
  }

  // Load modal structure from localStorage
  getModalStructure(modalId: string): ModalStructure | null {
    try {
      const savedStructures = localStorage.getItem('modalStructures');
      if (savedStructures) {
        const structures = JSON.parse(savedStructures);
        return structures[modalId] || null;
      }
    } catch (error) {
      console.error('Error loading modal structure:', error);
    }
    return null;
  }

  // Get all modal structures
  getAllModalStructures(): Record<string, ModalStructure> {
    try {
      const savedStructures = localStorage.getItem('modalStructures');
      if (savedStructures) {
        return JSON.parse(savedStructures);
      }
    } catch (error) {
      console.error('Error loading modal structures:', error);
    }
    return {};
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

  // Subscribe to modal structure changes
  onModalStructureChange(callback: (modalId: string, structure: ModalStructure) => void): () => void {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'modalStructures') {
        try {
          const structures = JSON.parse(e.newValue || '{}');
          Object.keys(structures).forEach(modalId => {
            callback(modalId, structures[modalId]);
          });
        } catch (error) {
          console.error('Error parsing modal structure change:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }
}

export default ModalStructureService;