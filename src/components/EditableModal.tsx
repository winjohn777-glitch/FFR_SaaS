import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, Edit3, Settings, Download, Upload, FileText } from 'lucide-react';
import ModalStructureEditor, { ModalStructure, ModalField } from './ModalStructureEditor';
import DynamicFormGenerator from './DynamicFormGenerator';
import DocumentGenerationService from '../services/DocumentGenerationService';

interface EditableModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalId: string;
  title: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onSubmit?: (data: Record<string, any>) => void;
  initialData?: Record<string, any>;
  category?: string;
  allowEdit?: boolean;
  customFields?: ModalField[];
  showEditButton?: boolean;
}

// Styled Components
const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ModalContainer = styled.div<{ size: string; isOpen: boolean }>`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-20px)')};
  transition: transform 0.3s ease;

  ${({ size }) => {
    switch (size) {
      case 'sm':
        return 'max-width: 400px;';
      case 'md':
        return 'max-width: 600px;';
      case 'lg':
        return 'max-width: 800px;';
      case 'xl':
        return 'max-width: 1200px;';
      default:
        return 'max-width: 600px;';
    }
  }}
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  img {
    height: 24px;
    margin-right: 8px;
    vertical-align: middle;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &.primary {
    color: ${({ theme }) => theme.colors.primary};

    &:hover {
      background-color: ${({ theme }) => theme.colors.primary}20;
    }
  }
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ModalContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ModeToggle = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 4px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ModeButton = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  background-color: ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => active ? 'white' : theme.colors.text.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  &:hover {
    color: ${({ active, theme }) => active ? 'white' : theme.colors.text.primary};
  }
`;

const ImportExportActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ImportExportButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const HiddenFileInput = styled.input.attrs({ type: 'file', accept: '.json' })`
  display: none;
`;

type Mode = 'view' | 'edit-structure';

const EditableModal: React.FC<EditableModalProps> = ({
  isOpen,
  onClose,
  modalId,
  title,
  children,
  size = 'md',
  onSubmit,
  initialData = {},
  category = 'other',
  allowEdit = true,
  customFields = [],
  showEditButton = true
}) => {
  const [mode, setMode] = useState<Mode>('view');
  const [modalStructure, setModalStructure] = useState<ModalStructure>({
    id: modalId,
    title: title,
    description: '',
    fields: customFields,
    category,
    lastModified: new Date()
  });

  const [formData, setFormData] = useState<Record<string, any>>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [documentService] = useState(() => DocumentGenerationService.getInstance());

  // Initialize modal structure from props (removed localStorage dependency)
  useEffect(() => {
    // Modal structures now managed via component state
    // In production, this would be loaded from backend API
    console.log('Modal structure initialized from props/defaults');
  }, [modalId]);

  // Save modal structure to component state (removed localStorage dependency)
  const saveModalStructure = (structure: ModalStructure) => {
    try {
      // In production, this would be saved via API
      // await saveModalStructureToAPI(modalId, structure);
      setModalStructure(structure);
      console.log('Modal structure updated in component state');
    } catch (error) {
      console.error('Error updating modal structure:', error);
    }
  };

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleFormSubmit = (data: Record<string, any>) => {
    setIsLoading(true);
    setFormData(data);

    if (onSubmit) {
      onSubmit(data);
    }

    // Prepare form data for document generation (removed localStorage dependency)
    const timestamp = Date.now();
    const formDataWithTimestamp = { ...data, _timestamp: timestamp, _modalId: modalId };
    console.log('Form data prepared for processing:', formDataWithTimestamp);
    // In production, this would be sent to the backend API

    // Simulate async operation
    setTimeout(() => {
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  const handleExportStructure = () => {
    const dataStr = JSON.stringify(modalStructure, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${modalId}_structure.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportStructure = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        const importedStructure: ModalStructure = {
          ...imported,
          id: modalId, // Keep current modal ID
          lastModified: new Date()
        };
        saveModalStructure(importedStructure);
      } catch (error) {
        console.error('Error importing modal structure:', error);
        alert('Invalid structure file. Please check the file format.');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  const handleGenerateDocument = async () => {
    if (!formData || Object.keys(formData).length === 0) {
      alert('Please fill out the form before generating documents');
      return;
    }

    try {
      const templates = documentService.getDocumentTemplates();
      const relevantTemplate = templates.find(t =>
        t.modalMappings.includes(modalId) ||
        (modalId.includes('customer') && t.modalMappings.includes('add-customer')) ||
        (modalId.includes('project') && t.modalMappings.includes('add-project'))
      );

      if (relevantTemplate) {
        await documentService.generateDocument({
          template: relevantTemplate,
          customerData: modalId.includes('customer') ? formData : undefined,
          projectData: modalId.includes('project') ? formData : undefined,
          customData: formData
        });
      } else {
        alert('No document template available for this form type');
      }
    } catch (error) {
      console.error('Error generating document:', error);
      alert('Error generating document. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleBackdropClick}>
      <ModalContainer size={size} isOpen={isOpen}>
        <ModalHeader>
          <HeaderLeft>
            <ModalTitle>
              <img src="/FFR logo 32x32.png" alt="FFR" />
              {modalStructure.title}
            </ModalTitle>
          </HeaderLeft>

          <HeaderActions>
            {mode === 'view' && formData && Object.keys(formData).length > 0 && (
              <ActionButton
                className="primary"
                onClick={handleGenerateDocument}
                title="Generate Document"
              >
                <FileText size={18} />
              </ActionButton>
            )}

            {allowEdit && showEditButton && (
              <ActionButton
                className="primary"
                onClick={() => setMode(mode === 'edit-structure' ? 'view' : 'edit-structure')}
                title="Edit Modal Structure"
              >
                <Edit3 size={18} />
              </ActionButton>
            )}

            <CloseButton onClick={onClose}>
              <X size={20} />
            </CloseButton>
          </HeaderActions>
        </ModalHeader>

        <ModalContent>
          {mode === 'edit-structure' ? (
            <>
              <ModeToggle>
                <ModeButton active={false} onClick={() => setMode('view')}>
                  <Settings size={16} />
                  Form View
                </ModeButton>
                <ModeButton active={mode === 'edit-structure'} onClick={() => setMode('edit-structure')}>
                  <Edit3 size={16} />
                  Edit Structure
                </ModeButton>
              </ModeToggle>

              <ImportExportActions>
                <ImportExportButton onClick={handleExportStructure}>
                  <Download size={16} />
                  Export Structure
                </ImportExportButton>

                <ImportExportButton as="label">
                  <Upload size={16} />
                  Import Structure
                  <HiddenFileInput onChange={handleImportStructure} />
                </ImportExportButton>
              </ImportExportActions>

              <ModalStructureEditor
                isOpen={true}
                onClose={() => setMode('view')}
                modalStructure={modalStructure}
                onSave={saveModalStructure}
              />
            </>
          ) : (
            <>
              {modalStructure.description && (
                <p style={{
                  marginBottom: '1.5rem',
                  color: 'var(--text-secondary)',
                  fontSize: '0.875rem'
                }}>
                  {modalStructure.description}
                </p>
              )}

              {modalStructure.fields.length > 0 ? (
                <DynamicFormGenerator
                  structure={modalStructure}
                  initialData={formData}
                  onSubmit={handleFormSubmit}
                  onCancel={onClose}
                  isLoading={isLoading}
                  submitLabel="Save"
                  cancelLabel="Cancel"
                />
              ) : (
                <>
                  {children}
                  {allowEdit && (
                    <div style={{
                      textAlign: 'center',
                      padding: '2rem',
                      color: 'var(--text-secondary)'
                    }}>
                      <Edit3 size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                      <p>No custom fields defined.</p>
                      <p>Click the edit button to add fields and customize this modal.</p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EditableModal;