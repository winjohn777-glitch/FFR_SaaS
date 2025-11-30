import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  Type,
  Calendar,
  Hash,
  DollarSign,
  ToggleLeft,
  Mail,
  Phone,
  FileText,
  List,
  Upload
} from 'lucide-react';

// Types for modal structure
export interface ModalField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'number' | 'currency' | 'date' | 'textarea' | 'select' | 'checkbox' | 'file';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // for select fields
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  order: number;
}

export interface ModalStructure {
  id: string;
  title: string;
  description?: string;
  fields: ModalField[];
  category: string; // 'crm', 'accounting', 'hr', 'project', etc.
  lastModified: Date;
}

interface ModalStructureEditorProps {
  isOpen: boolean;
  onClose: () => void;
  modalStructure: ModalStructure;
  onSave: (structure: ModalStructure) => void;
}

// Styled Components
const EditorContainer = styled.div`
  max-height: 70vh;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.md};
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background-color: ${({ theme }) => theme.colors.surface};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const FieldsContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
`;

const FieldItem = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface};
`;

const FieldHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FieldInfo = styled.div`
  flex: 1;
`;

const FieldName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FieldType = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-left: ${({ theme }) => theme.spacing.sm};
`;

const FieldActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &.danger:hover {
    background-color: ${({ theme }) => theme.colors.accent}20;
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  transition: background-color 0.2s ease, color 0.2s ease;

  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background-color: ${theme.colors.primary};
          color: white;
          &:hover {
            background-color: ${theme.colors.primary}dd;
          }
        `;
      case 'danger':
        return `
          background-color: ${theme.colors.accent};
          color: white;
          &:hover {
            background-color: ${theme.colors.accent}dd;
          }
        `;
      default:
        return `
          background-color: ${theme.colors.border};
          color: ${theme.colors.text.primary};
          &:hover {
            background-color: ${theme.colors.border}dd;
          }
        `;
    }
  }}
`;

const AddFieldButton = styled(Button)`
  width: 100%;
  justify-content: center;
  border: 2px dashed ${({ theme }) => theme.colors.border};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primary}10;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
`;

// Field type icons mapping
const fieldTypeIcons = {
  text: Type,
  email: Mail,
  phone: Phone,
  number: Hash,
  currency: DollarSign,
  date: Calendar,
  textarea: FileText,
  select: List,
  checkbox: ToggleLeft,
  file: Upload
};

const ModalStructureEditor: React.FC<ModalStructureEditorProps> = ({
  isOpen,
  onClose,
  modalStructure,
  onSave
}) => {
  const [structure, setStructure] = useState<ModalStructure>(modalStructure);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [newField, setNewField] = useState<Partial<ModalField>>({
    type: 'text',
    label: '',
    required: false
  });

  useEffect(() => {
    setStructure(modalStructure);
  }, [modalStructure]);

  const handleBasicInfoChange = (field: keyof ModalStructure, value: string) => {
    setStructure(prev => ({
      ...prev,
      [field]: value,
      lastModified: new Date()
    }));
  };

  const handleAddField = () => {
    if (!newField.label?.trim()) return;

    const field: ModalField = {
      id: `field_${Date.now()}`,
      type: newField.type as ModalField['type'],
      label: newField.label,
      placeholder: newField.placeholder || '',
      required: newField.required || false,
      options: newField.options || [],
      order: structure.fields.length
    };

    setStructure(prev => ({
      ...prev,
      fields: [...prev.fields, field],
      lastModified: new Date()
    }));

    setNewField({
      type: 'text',
      label: '',
      required: false
    });
  };

  const handleUpdateField = (fieldId: string, updates: Partial<ModalField>) => {
    setStructure(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      ),
      lastModified: new Date()
    }));
  };

  const handleDeleteField = (fieldId: string) => {
    setStructure(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId),
      lastModified: new Date()
    }));
  };

  const handleMoveField = (fieldId: string, direction: 'up' | 'down') => {
    const currentIndex = structure.fields.findIndex(f => f.id === fieldId);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === structure.fields.length - 1)
    ) {
      return;
    }

    const newFields = [...structure.fields];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    [newFields[currentIndex], newFields[targetIndex]] = [newFields[targetIndex], newFields[currentIndex]];

    // Update order values
    newFields.forEach((field, index) => {
      field.order = index;
    });

    setStructure(prev => ({
      ...prev,
      fields: newFields,
      lastModified: new Date()
    }));
  };

  const handleSave = () => {
    onSave(structure);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <EditorContainer>
      <Section>
        <SectionTitle>
          <Edit3 size={20} />
          Modal Information
        </SectionTitle>

        <FormGroup>
          <Label>Modal Title</Label>
          <Input
            value={structure.title}
            onChange={(e) => handleBasicInfoChange('title', e.target.value)}
            placeholder="Enter modal title"
          />
        </FormGroup>

        <FormGroup>
          <Label>Description (Optional)</Label>
          <TextArea
            value={structure.description || ''}
            onChange={(e) => handleBasicInfoChange('description', e.target.value)}
            placeholder="Brief description of this modal's purpose"
          />
        </FormGroup>

        <FormGroup>
          <Label>Category</Label>
          <Select
            value={structure.category}
            onChange={(e) => handleBasicInfoChange('category', e.target.value)}
          >
            <option value="crm">CRM</option>
            <option value="accounting">Accounting</option>
            <option value="hr">Human Resources</option>
            <option value="project">Project Management</option>
            <option value="inventory">Inventory</option>
            <option value="documents">Documents</option>
            <option value="other">Other</option>
          </Select>
        </FormGroup>
      </Section>

      <Section>
        <SectionTitle>
          <List size={20} />
          Form Fields
        </SectionTitle>

        <FieldsContainer>
          {structure.fields.map((field, index) => {
            const IconComponent = fieldTypeIcons[field.type];
            return (
              <FieldItem key={field.id}>
                <FieldHeader>
                  <FieldInfo>
                    <FieldName>{field.label}</FieldName>
                    <FieldType>
                      <IconComponent size={12} style={{ marginRight: '4px' }} />
                      {field.type}
                      {field.required && ' (Required)'}
                    </FieldType>
                  </FieldInfo>
                  <FieldActions>
                    <ActionButton
                      onClick={() => handleMoveField(field.id, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp size={16} />
                    </ActionButton>
                    <ActionButton
                      onClick={() => handleMoveField(field.id, 'down')}
                      disabled={index === structure.fields.length - 1}
                    >
                      <ArrowDown size={16} />
                    </ActionButton>
                    <ActionButton onClick={() => setEditingField(field.id)}>
                      <Edit3 size={16} />
                    </ActionButton>
                    <ActionButton
                      className="danger"
                      onClick={() => handleDeleteField(field.id)}
                    >
                      <Trash2 size={16} />
                    </ActionButton>
                  </FieldActions>
                </FieldHeader>

                {editingField === field.id && (
                  <div>
                    <Row>
                      <FormGroup>
                        <Label>Label</Label>
                        <Input
                          value={field.label}
                          onChange={(e) => handleUpdateField(field.id, { label: e.target.value })}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Field Type</Label>
                        <Select
                          value={field.type}
                          onChange={(e) => handleUpdateField(field.id, { type: e.target.value as ModalField['type'] })}
                        >
                          <option value="text">Text</option>
                          <option value="email">Email</option>
                          <option value="phone">Phone</option>
                          <option value="number">Number</option>
                          <option value="currency">Currency</option>
                          <option value="date">Date</option>
                          <option value="textarea">Textarea</option>
                          <option value="select">Select</option>
                          <option value="checkbox">Checkbox</option>
                          <option value="file">File Upload</option>
                        </Select>
                      </FormGroup>
                    </Row>

                    <FormGroup>
                      <Label>Placeholder</Label>
                      <Input
                        value={field.placeholder || ''}
                        onChange={(e) => handleUpdateField(field.id, { placeholder: e.target.value })}
                        placeholder="Enter placeholder text"
                      />
                    </FormGroup>

                    {field.type === 'select' && (
                      <FormGroup>
                        <Label>Options (one per line)</Label>
                        <TextArea
                          value={field.options?.join('\n') || ''}
                          onChange={(e) => handleUpdateField(field.id, {
                            options: e.target.value.split('\n').filter(o => o.trim())
                          })}
                          placeholder="Option 1&#10;Option 2&#10;Option 3"
                        />
                      </FormGroup>
                    )}

                    <FormGroup>
                      <CheckboxLabel>
                        <Checkbox
                          checked={field.required}
                          onChange={(e) => handleUpdateField(field.id, { required: e.target.checked })}
                        />
                        Required field
                      </CheckboxLabel>
                    </FormGroup>

                    <ButtonGroup>
                      <Button onClick={() => setEditingField(null)}>
                        <Save size={16} />
                        Save Changes
                      </Button>
                    </ButtonGroup>
                  </div>
                )}
              </FieldItem>
            );
          })}

          <div style={{ marginTop: '1rem' }}>
            <FormGroup>
              <Label>Add New Field</Label>
              <Row>
                <Input
                  value={newField.label || ''}
                  onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="Field label"
                />
                <Select
                  value={newField.type || 'text'}
                  onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value as ModalField['type'] }))}
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="number">Number</option>
                  <option value="currency">Currency</option>
                  <option value="date">Date</option>
                  <option value="textarea">Textarea</option>
                  <option value="select">Select</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="file">File Upload</option>
                </Select>
              </Row>
              <AddFieldButton onClick={handleAddField}>
                <Plus size={16} />
                Add Field
              </AddFieldButton>
            </FormGroup>
          </div>
        </FieldsContainer>
      </Section>

      <ButtonGroup>
        <Button onClick={onClose}>
          <X size={16} />
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          <Save size={16} />
          Save Modal Structure
        </Button>
      </ButtonGroup>
    </EditorContainer>
  );
};

export default ModalStructureEditor;