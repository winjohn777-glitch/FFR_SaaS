import React from 'react';
import styled from 'styled-components';
import { FFR_UNIFIED_BRAND } from '../Shared/UnifiedFFRBranding';

interface PrintableDocumentProps {
  title: string;
  subtitle?: string;
  documentType: 'SOP' | 'Invoice' | 'Report' | 'Form' | 'Manual';
  documentNumber?: string;
  date?: string;
  version?: string;
  children: React.ReactNode;
  showFooter?: boolean;
  pageNumbers?: boolean;
  className?: string;
}

const DocumentContainer = styled.div`
  width: 8.5in;
  min-height: 11in;
  margin: 0 auto;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: relative;

  @media print {
    box-shadow: none;
    margin: 0;
    width: 100%;
    min-height: auto;
  }
`;

const Header = styled.header`
  border-bottom: 3px solid ${FFR_UNIFIED_BRAND.colors.primary};
  padding: 1in 0.75in 0.5in 0.75in;
  background: linear-gradient(135deg, ${FFR_UNIFIED_BRAND.colors.primary}05, ${FFR_UNIFIED_BRAND.colors.lightBlue}15);

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const DocumentMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const MetaLeft = styled.div`
  flex: 1;
`;

const MetaRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
`;

const DocumentTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${FFR_UNIFIED_BRAND.colors.primary};
  margin: 0;
  letter-spacing: 0.5px;
`;

const DocumentSubtitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 500;
  color: ${FFR_UNIFIED_BRAND.colors.secondary};
  margin: 0.25rem 0 0 0;
  font-style: italic;
`;

const DocumentBadge = styled.div<{ type: string }>`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${({ type }) => {
    switch (type) {
      case 'SOP':
        return `
          background: ${FFR_UNIFIED_BRAND.colors.primary};
          color: white;
        `;
      case 'Invoice':
        return `
          background: #059669;
          color: white;
        `;
      case 'Report':
        return `
          background: #7c3aed;
          color: white;
        `;
      case 'Form':
        return `
          background: #f59e0b;
          color: white;
        `;
      case 'Manual':
        return `
          background: #dc2626;
          color: white;
        `;
      default:
        return `
          background: #6b7280;
          color: white;
        `;
    }
  }}
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 0.875rem;
`;

const MetaLabel = styled.span`
  font-weight: 600;
  color: ${FFR_UNIFIED_BRAND.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MetaValue = styled.span`
  color: #374151;
  font-weight: 500;
`;

const Content = styled.main`
  padding: 1in 0.75in;
  line-height: 1.6;
  color: #374151;

  @page {
    margin: 0.5in;
    size: letter;
  }
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5in 0.75in;
  border-top: 2px solid ${FFR_UNIFIED_BRAND.colors.primary};
  background: ${FFR_UNIFIED_BRAND.colors.lightBlue}20;

  @media print {
    position: fixed;
    bottom: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #6b7280;
`;

const CompanyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

const PageInfo = styled.div`
  font-weight: 600;
  color: ${FFR_UNIFIED_BRAND.colors.primary};
`;

const Watermark = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  font-size: 4rem;
  font-weight: 100;
  color: ${FFR_UNIFIED_BRAND.colors.primary}08;
  z-index: -1;
  pointer-events: none;
  user-select: none;

  @media print {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
`;

const PrintableDocument: React.FC<PrintableDocumentProps> = ({
  title,
  subtitle,
  documentType,
  documentNumber,
  date = new Date().toLocaleDateString(),
  version,
  children,
  showFooter = true,
  pageNumbers = true,
  className
}) => {
  return (
    <DocumentContainer className={className}>
      <Watermark>FLORIDA FIRST ROOFING</Watermark>

      <Header>
        {/* <FFRUnifiedBranding /> - Component usage needs review */}

        <DocumentMeta>
          <MetaLeft>
            <DocumentTitle>{title}</DocumentTitle>
            {subtitle && <DocumentSubtitle>{subtitle}</DocumentSubtitle>}
          </MetaLeft>

          <MetaRight>
            <DocumentBadge type={documentType}>
              {documentType}
            </DocumentBadge>

            {documentNumber && (
              <MetaItem>
                <MetaLabel>Document #</MetaLabel>
                <MetaValue>{documentNumber}</MetaValue>
              </MetaItem>
            )}

            <MetaItem>
              <MetaLabel>Date</MetaLabel>
              <MetaValue>{date}</MetaValue>
            </MetaItem>

            {version && (
              <MetaItem>
                <MetaLabel>Version</MetaLabel>
                <MetaValue>{version}</MetaValue>
              </MetaItem>
            )}
          </MetaRight>
        </DocumentMeta>
      </Header>

      <Content>
        {children}
      </Content>

      {showFooter && (
        <Footer>
          <FooterContent>
            <CompanyInfo>
              <div><strong>Florida First Roofing LLC</strong> | License: CCC1336561</div>
              <div>3815 N. HWY 1 #13, Cocoa, FL 32926 | (321) 301-4512</div>
              <div>admin@floridafirstroofing.com | Premium Roofing Solutions Across Florida</div>
            </CompanyInfo>

            {pageNumbers && (
              <PageInfo>
                Page 1 of 1
              </PageInfo>
            )}
          </FooterContent>
        </Footer>
      )}
    </DocumentContainer>
  );
};

export default PrintableDocument;

// Pre-built document templates for specific use cases
export const SOPDocument: React.FC<{
  sopNumber: string;
  title: string;
  version?: string;
  children: React.ReactNode;
}> = ({ sopNumber, title, version = '1.0', children }) => (
  <PrintableDocument
    title={title}
    subtitle="Standard Operating Procedure"
    documentType="SOP"
    documentNumber={sopNumber}
    version={version}
  >
    {children}
  </PrintableDocument>
);

export const InvoiceDocument: React.FC<{
  invoiceNumber: string;
  title: string;
  children: React.ReactNode;
}> = ({ invoiceNumber, title, children }) => (
  <PrintableDocument
    title={title}
    subtitle="Invoice"
    documentType="Invoice"
    documentNumber={invoiceNumber}
  >
    {children}
  </PrintableDocument>
);

export const ReportDocument: React.FC<{
  reportTitle: string;
  reportType: string;
  children: React.ReactNode;
}> = ({ reportTitle, reportType, children }) => (
  <PrintableDocument
    title={reportTitle}
    subtitle={reportType}
    documentType="Report"
  >
    {children}
  </PrintableDocument>
);

export const FormDocument: React.FC<{
  formCode: string;
  formName: string;
  children: React.ReactNode;
}> = ({ formCode, formName, children }) => (
  <PrintableDocument
    title={formName}
    subtitle="Compliance Form"
    documentType="Form"
    documentNumber={formCode}
  >
    {children}
  </PrintableDocument>
);

export const ManualDocument: React.FC<{
  manualName: string;
  section: string;
  version?: string;
  children: React.ReactNode;
}> = ({ manualName, section, version = '1.0', children }) => (
  <PrintableDocument
    title={manualName}
    subtitle={section}
    documentType="Manual"
    version={version}
  >
    {children}
  </PrintableDocument>
);