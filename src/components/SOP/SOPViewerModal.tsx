import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Printer, Edit, Copy, BookOpen, Clock, Shield, MapPin, Wind, AlertTriangle, Save, FileText } from 'lucide-react';
import sopService from '../../services/sopService';
import { SOPProcedure } from '../../types/sop';

// Types
interface SOPViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  procedure: SOPProcedure;
  onEdit?: (procedure: SOPProcedure) => void;
  onDuplicate?: (procedure: SOPProcedure) => void;
}

interface SOPContent {
  id: number;
  sop_number: string;
  title: string;
  content: string;
  content_type: string;
  file_path?: string;
}

// Styled Components
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ModalContainer = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const SOPTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SOPNumber = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.primary}15;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px solid ${({ theme }) => theme.colors.primary}30;
`;

const SOPMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const Badge = styled.span<{ variant?: string }>`
  font-size: 0.75rem;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  white-space: nowrap;

  ${({ variant, theme }) => {
    switch (variant) {
      case 'florida':
        return `background: #FF6B35; color: white;`;
      case 'hurricane':
        return `background: #DC2626; color: white;`;
      case 'osha':
        return `background: #F59E0B; color: white;`;
      case 'critical':
        return `background: #DC2626; color: white;`;
      case 'high':
        return `background: #F59E0B; color: white;`;
      case 'standard':
        return `background: #10B981; color: white;`;
      case 'low':
        return `background: #6B7280; color: white;`;
      default:
        return `background: ${theme.colors.background}; color: ${theme.colors.text.secondary};`;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ variant = 'secondary', theme }) => {
    if (variant === 'primary') {
      return `
        background: ${theme.colors.primary};
        color: white;

        &:hover {
          background: ${theme.colors.primary}dd;
        }
      `;
    } else {
      return `
        background: ${theme.colors.surface};
        color: ${theme.colors.text.primary};
        border: 1px solid ${theme.colors.border};

        &:hover {
          background: ${theme.colors.background};
        }
      `;
    }
  }}
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.error}15;
    color: ${({ theme }) => theme.colors.error};
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
  color: ${({ theme }) => theme.colors.error};

  svg {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    opacity: 0.5;
  }
`;

const ContentContainer = styled.div`
  max-width: none;

  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.colors.text.primary};
    margin-top: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.md};

    &:first-child {
      margin-top: 0;
    }
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
    padding-bottom: ${({ theme }) => theme.spacing.sm};
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
  }

  p {
    color: ${({ theme }) => theme.colors.text.secondary};
    line-height: 1.6;
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  ul, ol {
    margin-bottom: ${({ theme }) => theme.spacing.md};
    padding-left: ${({ theme }) => theme.spacing.lg};

    li {
      color: ${({ theme }) => theme.colors.text.secondary};
      line-height: 1.6;
      margin-bottom: ${({ theme }) => theme.spacing.xs};
    }
  }

  strong {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: 600;
  }

  code {
    background: ${({ theme }) => theme.colors.background};
    padding: ${({ theme }) => theme.spacing.xs};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
  }

  pre {
    background: ${({ theme }) => theme.colors.background};
    padding: ${({ theme }) => theme.spacing.md};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    overflow-x: auto;
    margin-bottom: ${({ theme }) => theme.spacing.md};

    code {
      background: none;
      padding: 0;
    }
  }

  blockquote {
    border-left: 4px solid ${({ theme }) => theme.colors.primary};
    padding-left: ${({ theme }) => theme.spacing.md};
    margin: ${({ theme }) => theme.spacing.md} 0;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-style: italic;
  }

  hr {
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    margin: ${({ theme }) => theme.spacing.xl} 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: ${({ theme }) => theme.spacing.md};

    th, td {
      border: 1px solid ${({ theme }) => theme.colors.border};
      padding: ${({ theme }) => theme.spacing.sm};
      text-align: left;
    }

    th {
      background: ${({ theme }) => theme.colors.background};
      font-weight: 600;
      color: ${({ theme }) => theme.colors.text.primary};
    }

    td {
      color: ${({ theme }) => theme.colors.text.secondary};
    }
  }
`;

const EditContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TextEditor = styled.textarea`
  width: 100%;
  min-height: 400px;
  flex: 1;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
`;

const EditActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.primary};
    transform: translateY(-1px);
  }
`;

const SOPViewerModal: React.FC<SOPViewerModalProps> = ({
  isOpen,
  onClose,
  procedure,
  onEdit,
  onDuplicate
}) => {
  const [content, setContent] = useState<SOPContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editContent, setEditContent] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // Format SOP title - procedure.sop_number already contains FFR_SOP-XXXX
  const formatSOPTitle = (procedure: SOPProcedure): string => {
    return `${procedure.sop_number}: ${procedure.title}`;
  };

  useEffect(() => {
    if (isOpen && procedure) {
      loadSOPContent();
      setIsEditMode(false);
    }
  }, [isOpen, procedure]);

  const loadSOPContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const sopContent = await sopService.getProcedureContent(procedure.id);
      setContent(sopContent);
      setEditContent(sopContent.content);
    } catch (err) {
      console.error('Error loading SOP content:', err);
      setError('Failed to load SOP content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (content) {
      const blob = new Blob([content.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${content.sop_number}-${content.title.replace(/[^a-zA-Z0-9]/g, '-')}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handlePrint = () => {
    if (content) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${content.sop_number} - ${content.title}</title>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
                h1, h2, h3 { color: #333; }
                h1 { border-bottom: 2px solid #007bff; padding-bottom: 10px; }
                h2 { color: #007bff; }
                pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
                code { background: #f5f5f5; padding: 2px 4px; border-radius: 3px; }
                table { border-collapse: collapse; width: 100%; margin: 15px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background: #f5f5f5; }
              </style>
            </head>
            <body>
              ${content.content.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = async () => {
    if (!content) return;

    try {
      setSaving(true);
      // TODO: Implement API call to save SOP content
      // await sopService.updateProcedureContent(procedure.id, editContent);

      // For now, just update the local content
      setContent({
        ...content,
        content: editContent
      });

      setIsEditMode(false);
    } catch (err) {
      console.error('Error saving SOP content:', err);
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(content?.content || '');
    setIsEditMode(false);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <LoadingSpinner>
          <div>Loading SOP content...</div>
        </LoadingSpinner>
      );
    }

    if (error) {
      return (
        <ErrorMessage>
          <AlertTriangle size={64} />
          <h3>Error Loading SOP</h3>
          <p>{error}</p>
          <ActionButton onClick={loadSOPContent}>
            Try Again
          </ActionButton>
        </ErrorMessage>
      );
    }

    if (!content) {
      return (
        <ErrorMessage>
          <BookOpen size={64} />
          <h3>No Content Available</h3>
          <p>SOP content could not be loaded.</p>
        </ErrorMessage>
      );
    }

    // Edit mode
    if (isEditMode) {
      return (
        <EditContainer>
          <div style={{ marginBottom: '1rem' }}>
            <strong>📝 Edit Mode</strong> - Make changes to the SOP content below:
          </div>
          <TextEditor
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Enter SOP content in Markdown format..."
          />
          <EditActions>
            <SaveButton onClick={handleSave} disabled={saving}>
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Changes'}
            </SaveButton>
            <CancelButton onClick={handleCancelEdit}>
              <X size={16} />
              Cancel
            </CancelButton>
          </EditActions>
        </EditContainer>
      );
    }

    // View mode - Enhanced markdown rendering for professional SOP content
    const formattedContent = content.content
      // Headers with proper hierarchy
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')

      // Professional formatting
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')

      // Lists with proper structure
      .replace(/^- (.*$)/gim, '<ul><li>$1</li></ul>')
      .replace(/^\d+\. (.*$)/gim, '<ol><li>$1</li></ol>')

      // Merge consecutive list items
      .replace(/<\/ul>\s*<ul>/g, '')
      .replace(/<\/ol>\s*<ol>/g, '')

      // Blockquotes for important notices
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')

      // NOA and compliance information highlighting
      .replace(/NOA\s+(\d+-\d+\.\d+)/g, '<strong style="color: #7C3AED; background: #7C3AED15; padding: 2px 6px; border-radius: 4px;">NOA $1</strong>')
      .replace(/(\d+\s*mph\s*\([^)]+\))/gi, '<strong style="color: #DC2626; background: #DC262615; padding: 2px 6px; border-radius: 4px;">$1</strong>')
      .replace(/(OSHA\s+[\d\s\.CFR]+)/gi, '<strong style="color: #F59E0B; background: #F59E0B15; padding: 2px 6px; border-radius: 4px;">$1</strong>')

      // Florida-specific highlighting
      .replace(/(Florida Building Code|Miami-Dade|HVHZ)/gi, '<strong style="color: #FF6B35; background: #FF6B3515; padding: 2px 6px; border-radius: 4px;">$1</strong>')

      // Tables (basic support)
      .replace(/\|(.+)\|/g, (match, content) => {
        const cells = content.split('|').map((cell: string) => `<td>${cell.trim()}</td>`).join('');
        return `<tr>${cells}</tr>`;
      })

      // Horizontal rules
      .replace(/---+/g, '<hr>')

      // Paragraphs (only for lines that aren't already formatted)
      .replace(/^(?!<[^>]+>)(.*\S.*)$/gim, '<p>$1</p>')

      // Line breaks
      .replace(/\n/g, '<br>');

    return (
      <ContentContainer>
        <div dangerouslySetInnerHTML={{ __html: formattedContent }} />
      </ContentContainer>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ModalContainer
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader>
            <HeaderLeft>
              <SOPTitle>
                <BookOpen size={24} />
                {formatSOPTitle(procedure)}
                <SOPNumber>{procedure.sop_number}</SOPNumber>
              </SOPTitle>

              <SOPMeta>
                <Badge>{procedure.category_name}</Badge>
                {procedure.florida_specific && (
                  <Badge variant="florida">
                    <MapPin size={12} />
                    Florida Specific
                  </Badge>
                )}
                {procedure.hurricane_related && (
                  <Badge variant="hurricane">
                    <Wind size={12} />
                    Hurricane Related
                  </Badge>
                )}
                {procedure.osha_related && (
                  <Badge variant="osha">
                    <Shield size={12} />
                    OSHA Required
                  </Badge>
                )}
                <Badge variant={procedure.priority_level}>
                  {procedure.priority_level === 'critical' && <AlertTriangle size={12} />}
                  {procedure.priority_level.charAt(0).toUpperCase() + procedure.priority_level.slice(1)}
                </Badge>
                <Badge>
                  <Clock size={12} />
                  {procedure.estimated_duration_minutes}min
                </Badge>
              </SOPMeta>
            </HeaderLeft>

            <ActionButtons>
              <ActionButton onClick={handleDownload} disabled={!content}>
                <Download size={16} />
                Download
              </ActionButton>
              <ActionButton onClick={handlePrint} disabled={!content}>
                <Printer size={16} />
                Print
              </ActionButton>
              <ActionButton onClick={handleEdit} disabled={loading || !content}>
                <Edit size={16} />
                Edit
              </ActionButton>
              {procedure.category_id === 11 && ( // 1500 series SOPs (Manufacturer Guides)
                <ActionButton
                  onClick={() => {
                    // Extract manufacturer name from SOP number or title for navigation
                    const sopNumber = procedure.sop_number;
                    const title = procedure.title;
                    let manufacturerGuide = 'Unknown Product';

                    if (sopNumber.includes('GAF')) manufacturerGuide = 'GAF Timberline HDZ Installation Guide.pdf';
                    else if (sopNumber.includes('CAR')) manufacturerGuide = 'Carlisle Sure-Weld TPO Installation Manual.pdf';
                    else if (sopNumber.includes('EAG')) manufacturerGuide = 'Eagle Roofing Capistrano Tile Installation Guide.pdf';
                    else if (sopNumber.includes('FIR')) manufacturerGuide = 'Firestone RubberGard EPDM System Guide.pdf';
                    else if (title.includes('Atlas')) manufacturerGuide = 'Atlas Pinnacle Pristine Installation Guide.pdf';
                    else if (title.includes('CertainTeed')) manufacturerGuide = 'CertainTeed Installation Manual.pdf';
                    else if (title.includes('Owens Corning')) manufacturerGuide = 'Owens Corning Duration Installation Guide.pdf';
                    else if (title.includes('Malarkey')) manufacturerGuide = 'Malarkey Highlander Installation Guide.pdf';

                    alert(`🏗️ Manufacturer Installation Guide Integration\n\nRedirecting to Documents → Manufacturer Guides\n\nLooking for: ${manufacturerGuide}\n\nThis SOP (${procedure.sop_number}) is linked to:\n• Official manufacturer installation manual\n• Technical specifications\n• HVHZ compliance requirements\n• Step-by-step installation procedures\n\nClick OK to navigate to the Documents section...`);

                    // In a real implementation, this would navigate to the Documents page
                    // and filter to show the specific manufacturer guide
                  }}
                  title="View manufacturer installation guide for this product"
                >
                  <FileText size={16} />
                  Installation Guide
                </ActionButton>
              )}
              {onDuplicate && (
                <ActionButton onClick={() => onDuplicate(procedure)}>
                  <Copy size={16} />
                  Duplicate
                </ActionButton>
              )}
              <CloseButton onClick={onClose}>
                <X size={20} />
              </CloseButton>
            </ActionButtons>
          </ModalHeader>

          <ModalBody>
            {renderContent()}
          </ModalBody>
        </ModalContainer>
      </ModalOverlay>
    </AnimatePresence>
  );
};

export default SOPViewerModal;