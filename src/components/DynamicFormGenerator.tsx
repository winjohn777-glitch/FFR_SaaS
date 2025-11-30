import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ModalField, ModalStructure } from './ModalStructureEditor';
import {
  Upload,
  AlertCircle
} from 'lucide-react';

interface DynamicFormGeneratorProps {
  structure: ModalStructure;
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

interface ValidationError {
  field: string;
  message: string;
}

// Styled Components
const FormContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const FormGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div<{ span?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  grid-column: span ${({ span }) => span || 1};

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const Label = styled.label<{ required?: boolean }>`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.875rem;

  ${({ required }) => required && `
    &::after {
      content: ' *';
      color: red;
    }
  `}
`;

const Input = styled.input<{ hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme, hasError }) => hasError ? theme.colors.accent : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) => hasError ? theme.colors.accent : theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme, hasError }) => hasError ? theme.colors.accent : theme.colors.primary}20;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.secondary};
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea<{ hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme, hasError }) => hasError ? theme.colors.accent : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) => hasError ? theme.colors.accent : theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme, hasError }) => hasError ? theme.colors.accent : theme.colors.primary}20;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.secondary};
    cursor: not-allowed;
  }
`;

const Select = styled.select<{ hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme, hasError }) => hasError ? theme.colors.accent : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background-color: ${({ theme }) => theme.colors.surface};
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) => hasError ? theme.colors.accent : theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme, hasError }) => hasError ? theme.colors.accent : theme.colors.primary}20;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.secondary};
    cursor: not-allowed;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })<{ hasError?: boolean }>`
  width: 16px;
  height: 16px;
  accent-color: ${({ theme }) => theme.colors.primary};

  ${({ hasError, theme }) => hasError && `
    outline: 2px solid ${theme.colors.accent};
    outline-offset: 2px;
  `}
`;

const CheckboxLabel = styled.label`
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  font-size: 0.875rem;
`;

const FileInputContainer = styled.div`
  position: relative;
`;

const FileInput = styled.input.attrs({ type: 'file' })`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const FileInputDisplay = styled.div<{ hasError?: boolean; hasFile?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px dashed ${({ theme, hasError }) => hasError ? theme.colors.accent : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
  background-color: ${({ theme, hasFile }) => hasFile ? theme.colors.primary + '10' : theme.colors.background};
  color: ${({ theme, hasFile }) => hasFile ? theme.colors.primary : theme.colors.text.secondary};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme, hasError }) => hasError ? theme.colors.accent : theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primary}10;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.accent};
  font-size: 0.75rem;
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-width: 100px;

  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background-color: ${theme.colors.primary};
          color: white;
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary}dd;
          }
        `;
      default:
        return `
          background-color: ${theme.colors.border};
          color: ${theme.colors.text.primary};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.border}dd;
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const DynamicFormGenerator: React.FC<DynamicFormGeneratorProps> = ({
  structure,
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Set<string>>(new Set());

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const validateField = (field: ModalField, value: any): string | null => {
    // Required field validation
    if (field.required) {
      if (value === undefined || value === null || value === '') {
        return `${field.label} is required`;
      }
      if (field.type === 'checkbox' && !value) {
        return `${field.label} must be checked`;
      }
    }

    // Skip other validations if field is empty and not required
    if (!value && !field.required) return null;

    // Type-specific validations
    switch (field.type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Please enter a valid email address';
        }
        break;

      case 'phone':
        const phoneRegex = /^[+]?[(]?[+]?\d{0,3}[)]?[-\s.]?\d{3,4}[-\s.]?\d{4,6}$/;
        if (!phoneRegex.test(value.replace(/\s/g, ''))) {
          return 'Please enter a valid phone number';
        }
        break;

      case 'number':
      case 'currency':
        if (isNaN(Number(value))) {
          return 'Please enter a valid number';
        }
        if (field.validation?.min !== undefined && Number(value) < field.validation.min) {
          return `Minimum value is ${field.validation.min}`;
        }
        if (field.validation?.max !== undefined && Number(value) > field.validation.max) {
          return `Maximum value is ${field.validation.max}`;
        }
        break;

      case 'date':
        if (isNaN(Date.parse(value))) {
          return 'Please enter a valid date';
        }
        break;
    }

    // Custom pattern validation
    if (field.validation?.pattern && !new RegExp(field.validation.pattern).test(value)) {
      return 'Invalid format';
    }

    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];

    structure.fields.forEach(field => {
      const value = formData[field.id];
      const error = validateField(field, value);
      if (error) {
        newErrors.push({ field: field.id, message: error });
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    setTouched(prev => new Set(prev).add(fieldId));

    // Remove error for this field if it exists
    setErrors(prev => prev.filter(error => error.field !== fieldId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched(new Set(structure.fields.map(f => f.id)));

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getFieldError = (fieldId: string): string | undefined => {
    return errors.find(error => error.field === fieldId)?.message;
  };

  const renderField = (field: ModalField) => {
    const value = formData[field.id] || '';
    const error = getFieldError(field.id);
    const hasError = !!error && touched.has(field.id);

    const commonProps = {
      id: field.id,
      name: field.id,
      placeholder: field.placeholder,
      disabled: isLoading,
      hasError
    };

    switch (field.type) {
      case 'textarea':
        return (
          <TextArea
            {...commonProps}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );

      case 'select':
        return (
          <Select
            {...commonProps}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          >
            <option value="">Select an option...</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </Select>
        );

      case 'checkbox':
        return (
          <CheckboxContainer>
            <Checkbox
              {...commonProps}
              checked={!!value}
              hasError={hasError}
              onChange={(e) => handleFieldChange(field.id, e.target.checked)}
            />
            <CheckboxLabel htmlFor={field.id}>
              {field.placeholder || field.label}
            </CheckboxLabel>
          </CheckboxContainer>
        );

      case 'file':
        return (
          <FileInputContainer>
            <FileInput
              {...commonProps}
              onChange={(e) => handleFieldChange(field.id, e.target.files?.[0] || null)}
            />
            <FileInputDisplay hasError={hasError} hasFile={!!value}>
              <Upload size={24} style={{ marginBottom: '8px' }} />
              <div>
                {value ? value.name : 'Click to upload file or drag and drop'}
              </div>
            </FileInputDisplay>
          </FileInputContainer>
        );

      case 'currency':
        return (
          <Input
            {...commonProps}
            type="number"
            step="0.01"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            style={{ paddingLeft: '24px' }}
          />
        );

      case 'date':
        return (
          <Input
            {...commonProps}
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );

      case 'number':
        return (
          <Input
            {...commonProps}
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );

      default: // text, email, phone
        return (
          <Input
            {...commonProps}
            type={field.type === 'email' ? 'email' : field.type === 'phone' ? 'tel' : 'text'}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormContainer>
        <FormGrid>
          {structure.fields
            .sort((a, b) => a.order - b.order)
            .map(field => (
              <FormGroup key={field.id} span={field.type === 'textarea' ? 2 : 1}>
                {field.type !== 'checkbox' && (
                  <Label htmlFor={field.id} required={field.required}>
                    {field.label}
                  </Label>
                )}

                {renderField(field)}

                {getFieldError(field.id) && touched.has(field.id) && (
                  <ErrorMessage>
                    <AlertCircle size={12} />
                    {getFieldError(field.id)}
                  </ErrorMessage>
                )}
              </FormGroup>
            ))}
        </FormGrid>

        <ButtonGroup>
          <Button type="button" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Processing...' : submitLabel}
          </Button>
        </ButtonGroup>
      </FormContainer>
    </form>
  );
};

export default DynamicFormGenerator;