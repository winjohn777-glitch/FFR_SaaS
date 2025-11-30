import React, { useState } from 'react';
import styled from 'styled-components';

interface PDFExportOptionsProps {
  onExport: (forExternalUse: boolean) => void;
  documentType: string;
  isVisible: boolean;
  onClose: () => void;
}

const OptionsContainer = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.visible ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const OptionsCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-width: 400px;
  width: 90%;
`;

const Title = styled.h3`
  color: #2E5AAC;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
`;

const Description = styled.p`
  color: #666;
  margin: 0 0 1.5rem 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const OptionButton = styled.button<{ variant: 'external' | 'internal' }>`
  width: 100%;
  padding: 1rem;
  margin: 0.5rem 0;
  border: 2px solid ${props => props.variant === 'external' ? '#2E5AAC' : '#209C95'};
  background: ${props => props.variant === 'external' ? '#2E5AAC' : '#209C95'};
  color: white;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.variant === 'external' ? '#1e3d73' : '#147067'};
    border-color: ${props => props.variant === 'external' ? '#1e3d73' : '#147067'};
  }

  &:active {
    transform: translateY(1px);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #333;
  }
`;

const OptionInfo = styled.div`
  background: #f8f9fa;
  padding: 0.75rem;
  border-radius: 4px;
  margin: 0.5rem 0;
  font-size: 0.85rem;
  color: #555;
  border-left: 3px solid #209C95;
`;

/**
 * PDF Export Options Component
 *
 * Allows users to select whether a PDF is for:
 * - External use (customers/clients) - includes branded footer
 * - Internal use (company records) - no branded footer
 */
export const PDFExportOptions: React.FC<PDFExportOptionsProps> = ({
  onExport,
  documentType,
  isVisible,
  onClose
}) => {
  const [selectedOption, setSelectedOption] = useState<'external' | 'internal' | null>(null);

  const handleExport = (forExternalUse: boolean) => {
    setSelectedOption(forExternalUse ? 'external' : 'internal');
    onExport(forExternalUse);
    onClose();
  };

  const isReportType = documentType.toLowerCase().includes('report');

  return (
    <OptionsContainer visible={isVisible} onClick={onClose}>
      <OptionsCard onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>

        <Title>Export {documentType}</Title>

        <Description>
          Choose how you want to export this {documentType.toLowerCase()}:
        </Description>

        <OptionButton
          variant="external"
          onClick={() => handleExport(true)}
        >
          <strong>📤 External Use</strong>
          <br />
          For customers, clients, or external sharing
        </OptionButton>

        <OptionInfo>
          Includes branded footer with "Thank you for choosing Florida First Roofing" message
        </OptionInfo>

        <OptionButton
          variant="internal"
          onClick={() => handleExport(false)}
        >
          <strong>📁 Internal Use</strong>
          <br />
          For company records and internal documentation
        </OptionButton>

        <OptionInfo>
          Clean format without promotional footer - ideal for internal reports and records
        </OptionInfo>

        {isReportType && (
          <Description style={{ marginTop: '1rem', fontStyle: 'italic' }}>
            💡 Most reports are typically for internal use, but you can choose external
            if sharing with clients or partners.
          </Description>
        )}
      </OptionsCard>
    </OptionsContainer>
  );
};

export default PDFExportOptions;