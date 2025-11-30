import React from 'react';
import styled from 'styled-components';
import { FFR_UNIFIED_BRAND } from '../Shared/UnifiedFFRBranding';

interface FFRFormTemplateProps {
  formTitle: string;
  formCode: string;
  formCategory: string;
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

const FormContainer = styled.div`
  max-width: 8.5in;
  min-height: 11in;
  margin: 0 auto;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  font-family: ${FFR_UNIFIED_BRAND.fonts.primary};

  @media print {
    box-shadow: none;
    max-width: none;
    min-height: none;
  }
`;

const FormHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, ${FFR_UNIFIED_BRAND.colors.primary} 0%, ${FFR_UNIFIED_BRAND.colors.secondary} 100%);
  color: white;
  border-bottom: 3px solid ${FFR_UNIFIED_BRAND.colors.darkBlue};
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-right: auto;
`;

const Logo = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: white;
  padding: 4px;
`;

const CompanyInfo = styled.div`
  flex: 1;
`;

const CompanyName = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CompanyTagline = styled.p`
  margin: 2px 0 0 0;
  font-size: 0.875rem;
  opacity: 0.9;
  font-style: italic;
`;

const FormTitleSection = styled.div`
  text-align: right;
`;

const FormTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

const FormMeta = styled.div`
  margin-top: 4px;
  font-size: 0.75rem;
  opacity: 0.9;
`;

const FormContent = styled.div`
  flex: 1;
  padding: 30px;
  min-height: 600px;
`;

const FormFooter = styled.div`
  margin-top: auto;
  padding: 20px;
  background: ${FFR_UNIFIED_BRAND.colors.lightBlue};
  border-top: 2px solid ${FFR_UNIFIED_BRAND.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.875rem;
  color: ${FFR_UNIFIED_BRAND.colors.darkBlue};
`;

const ContactLine = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LicenseInfo = styled.div`
  background: ${FFR_UNIFIED_BRAND.colors.primary};
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
`;

const FormMetadata = styled.div`
  text-align: right;
  font-size: 0.75rem;
  color: ${FFR_UNIFIED_BRAND.colors.darkBlue};
  opacity: 0.8;
`;

const PageBreak = styled.div`
  @media print {
    page-break-after: always;
  }
`;

// Form field styling components
export const FormSection = styled.div`
  margin-bottom: 30px;
`;

export const SectionTitle = styled.h3`
  margin: 0 0 15px 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${FFR_UNIFIED_BRAND.colors.primary};
  border-bottom: 2px solid ${FFR_UNIFIED_BRAND.colors.lightBlue};
  padding-bottom: 8px;
`;

export const FieldGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

export const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

interface FieldLabelProps {
  required?: boolean;
}

export const FieldLabel = styled.label<FieldLabelProps>`
  font-weight: 600;
  color: ${FFR_UNIFIED_BRAND.colors.darkBlue};
  margin-bottom: 6px;
  font-size: 0.875rem;

  &::after {
    content: ${(props) => props.required ? '"*"' : '""'};
    color: #dc2626;
    margin-left: 4px;
  }
`;

export const FieldInput = styled.input`
  padding: 10px 12px;
  border: 2px solid ${FFR_UNIFIED_BRAND.colors.border};
  border-radius: 6px;
  font-size: 0.875rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${FFR_UNIFIED_BRAND.colors.secondary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  @media print {
    border: 1px solid #000;
    background: transparent;
  }
`;

export const FieldTextarea = styled.textarea`
  padding: 10px 12px;
  border: 2px solid ${FFR_UNIFIED_BRAND.colors.border};
  border-radius: 6px;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 80px;
  font-family: ${FFR_UNIFIED_BRAND.fonts.primary};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${FFR_UNIFIED_BRAND.colors.secondary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  @media print {
    border: 1px solid #000;
    background: transparent;
  }
`;

export const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 8px;
`;

export const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  cursor: pointer;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: ${FFR_UNIFIED_BRAND.colors.primary};
  }
`;

export const RadioGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 8px;
`;

export const RadioItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  cursor: pointer;

  input[type="radio"] {
    width: 16px;
    height: 16px;
    accent-color: ${FFR_UNIFIED_BRAND.colors.primary};
  }
`;

export const SignatureArea = styled.div`
  border: 2px dashed ${FFR_UNIFIED_BRAND.colors.border};
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  background: ${FFR_UNIFIED_BRAND.colors.background};
  margin-top: 10px;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${FFR_UNIFIED_BRAND.colors.darkBlue};
  font-style: italic;

  @media print {
    border: 1px solid #000;
    background: transparent;
  }
`;

export const DateSignatureRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid ${FFR_UNIFIED_BRAND.colors.border};
`;

const FFRFormTemplate: React.FC<FFRFormTemplateProps> = ({
  formTitle,
  formCode,
  formCategory,
  children,
  showHeader = true,
  showFooter = true,
  className
}) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <FormContainer className={className}>
      {showHeader && (
        <FormHeader>
          <LogoSection>
            <Logo
              src={FFR_UNIFIED_BRAND.logos.png}
              alt="Florida First Roofing LLC"
            />
            <CompanyInfo>
              <CompanyName>{FFR_UNIFIED_BRAND.contact.name}</CompanyName>
              <CompanyTagline>{FFR_UNIFIED_BRAND.contact.tagline}</CompanyTagline>
            </CompanyInfo>
          </LogoSection>

          <FormTitleSection>
            <FormTitle>{formTitle}</FormTitle>
            <FormMeta>
              Form Code: {formCode} | Category: {formCategory.toUpperCase()}
            </FormMeta>
          </FormTitleSection>
        </FormHeader>
      )}

      <FormContent>
        {children}
      </FormContent>

      {showFooter && (
        <FormFooter>
          <ContactInfo>
            <ContactLine>
              <span>📍</span>
              <span>{FFR_UNIFIED_BRAND.contact.address.formatted}</span>
            </ContactLine>
            <ContactLine>
              <span>📞</span>
              <span>{FFR_UNIFIED_BRAND.contact.phone}</span>
              <span>|</span>
              <span>✉️</span>
              <span>{FFR_UNIFIED_BRAND.contact.email}</span>
            </ContactLine>
          </ContactInfo>

          <LicenseInfo>
            Licensed, Bonded & Insured<br />
            License #{FFR_UNIFIED_BRAND.contact.license}
          </LicenseInfo>

          <FormMetadata>
            <div>Form Generated: {currentDate}</div>
            <div>Version: 2025.1</div>
            <div>Page 1 of 1</div>
          </FormMetadata>
        </FormFooter>
      )}
    </FormContainer>
  );
};

export default FFRFormTemplate;