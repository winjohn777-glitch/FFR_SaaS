import React from 'react';
import styled from 'styled-components';

/**
 * UNIFIED FLORIDA FIRST ROOFING BRANDING SYSTEM
 *
 * This component provides consistent branding across:
 * - Website (customer-facing)
 * - Accounting System (business operations)
 * - Customer Portal (integrated experience)
 *
 * CRITICAL: This is the single source of truth for all brand elements
 */

// =====================================================
// UNIFIED BRAND CONSTANTS (SINGLE SOURCE OF TRUTH)
// =====================================================

export const FFR_UNIFIED_BRAND = {
  company: {
    name: 'Florida First Roofing LLC',
    legalName: 'Florida First Roofing LLC',
    tagline: 'Premium Roofing Solutions Across Florida',
    established: '2019',
  },
  contact: {
    // VERIFIED INFORMATION (Please confirm license number)
    phone: '(321) 301-4512',
    phoneRaw: '3213014512',
    email: 'admin@floridafirstroofing.com', // Standardized to admin@
    website: 'https://floridafirstroofing.com',
    license: 'CCC1336561', // TODO: VERIFY THIS IS CORRECT
    name: 'Florida First Roofing LLC', // Added for backward compatibility
    tagline: 'Premium Roofing Solutions Across Florida', // Added for backward compatibility

    address: {
      street: '3815 N. HWY 1 #13',
      city: 'Cocoa',
      state: 'FL',
      zip: '32926',
      formatted: '3815 N. HWY 1 #13, Cocoa, FL 32926'
    },

    // Emergency/After Hours
    emergencyPhone: '(321) 425-2709',

    // Business Details
    serviceArea: 'Statewide Florida',
    specialization: 'Hurricane-Resistant Roofing Systems',
    certifications: ['Licensed', 'Bonded', 'Insured']
  },

  // UNIFIED COLOR PALETTE
  colors: {
    // Primary Blues (Accounting system standard - more professional)
    primary: '#1e40af',        // Primary Blue (used in accounting system)
    primaryHover: '#1e3a8a',   // Darker blue for hover states
    secondary: '#3b82f6',      // Light Blue
    accent: '#60a5fa',         // Accent Blue
    darkBlue: '#1e3a8a',       // Dark Blue
    lightBlue: '#dbeafe',      // Light Blue Background
    border: '#e5e7eb',         // Added border color for styling

    // Legacy website color (being phased out)
    websiteLegacy: '#1a365d',  // Old website color - DO NOT USE

    // Neutral Colors
    white: '#ffffff',
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',

    // Status Colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',

    // Text Colors
    text: {
      primary: '#1f2937',     // Dark gray for primary text
      secondary: '#6b7280',   // Medium gray for secondary text
      light: '#9ca3af',       // Light gray for tertiary text
      white: '#ffffff'        // White text for dark backgrounds
    },

    // Background Colors (as object)
    background: {
      primary: '#ffffff',     // Main background
      secondary: '#f9fafb',   // Light background
      dark: '#1f2937',        // Dark background
      blue: '#dbeafe'         // Light blue background
    }
  },

  // BACKGROUND COLORS (backward compatibility as single color value)
  background: '#ffffff', // Backward compatibility with old usage

  // FONTS (backward compatibility)
  fonts: {
    primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },

  // LOGOS (backward compatibility)
  logos: {
    png: '/assets/logos/ffr-logo-250x250.png',
    svg: '/assets/logos/ffr-logo.svg',
    primary: '/assets/logos/ffr-logo-250x250.png'
  },

  // TYPOGRAPHY SYSTEM
  typography: {
    fontFamily: {
      primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      headings: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      monospace: '"SF Mono", Monaco, Inconsolata, "Roboto Mono", Consolas, "Courier New", monospace'
    },

    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem'    // 60px
    },

    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800'
    },

    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.625'
    }
  },

  // SPACING SYSTEM
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '2.5rem',  // 40px
    '3xl': '3rem',    // 48px
    '4xl': '4rem',    // 64px
    '5xl': '5rem'     // 80px
  },

  // BORDER RADIUS
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px'
  },

  // SHADOWS
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  },

  // LOGO ASSETS
  assets: {
    logos: {
      primary: '/assets/logos/ffr-logo-250x250.png',
      small: '/assets/logos/ffr-logo-64x64.png',
      medium: '/assets/logos/ffr-logo-128x128.png',
      large: '/assets/logos/ffr-logo-250x250.png',
      svg: '/assets/logos/ffr-logo.svg',
      white: '/assets/logos/ffr-logo-white.svg',
      favicon: '/assets/logos/favicon.ico'
    },

    // Business Assets
    businessCard: '/assets/brand/business-card-template.pdf',
    letterhead: '/assets/brand/letterhead-template.pdf',
    colorPalette: '/assets/brand/color-palette.ase'
  }
};

// =====================================================
// STYLED COMPONENTS
// =====================================================

interface BrandingContainerProps {
  variant?: 'header' | 'footer' | 'compact' | 'document' | 'portal';
  theme?: 'light' | 'dark';
  size?: 'small' | 'medium' | 'large';
}

const BrandingContainer = styled.div<BrandingContainerProps>`
  display: flex;
  align-items: center;
  gap: ${FFR_UNIFIED_BRAND.spacing.lg};
  font-family: ${FFR_UNIFIED_BRAND.typography.fontFamily.primary};

  ${({ variant, theme = 'light' }) => {
    switch (variant) {
      case 'header':
        return `
          padding: ${FFR_UNIFIED_BRAND.spacing.lg} ${FFR_UNIFIED_BRAND.spacing.xl};
          background: ${theme === 'dark'
            ? `linear-gradient(135deg, ${FFR_UNIFIED_BRAND.colors.primary}, ${FFR_UNIFIED_BRAND.colors.secondary})`
            : FFR_UNIFIED_BRAND.colors.background.primary
          };
          color: ${theme === 'dark' ? FFR_UNIFIED_BRAND.colors.text.white : FFR_UNIFIED_BRAND.colors.text.primary};
          border-radius: ${FFR_UNIFIED_BRAND.borderRadius.lg};
          box-shadow: ${FFR_UNIFIED_BRAND.shadows.md};
        `;
      case 'footer':
        return `
          padding: ${FFR_UNIFIED_BRAND.spacing.xl};
          background-color: ${FFR_UNIFIED_BRAND.colors.background.secondary};
          border-top: 1px solid ${FFR_UNIFIED_BRAND.colors.gray200};
          justify-content: center;
          flex-direction: column;
          text-align: center;
        `;
      case 'compact':
        return `
          padding: ${FFR_UNIFIED_BRAND.spacing.sm} ${FFR_UNIFIED_BRAND.spacing.md};
          gap: ${FFR_UNIFIED_BRAND.spacing.md};
        `;
      case 'document':
        return `
          padding: ${FFR_UNIFIED_BRAND.spacing.md} 0;
          border-bottom: 2px solid ${FFR_UNIFIED_BRAND.colors.primary};
          margin-bottom: ${FFR_UNIFIED_BRAND.spacing.lg};
        `;
      case 'portal':
        return `
          padding: ${FFR_UNIFIED_BRAND.spacing.md} ${FFR_UNIFIED_BRAND.spacing.lg};
          background: ${FFR_UNIFIED_BRAND.colors.background.primary};
          border-bottom: 1px solid ${FFR_UNIFIED_BRAND.colors.gray200};
        `;
      default:
        return '';
    }
  }}
`;

const LogoContainer = styled.div<{ size?: string }>`
  ${({ size = 'medium' }) => {
    switch (size) {
      case 'small':
        return `width: 32px; height: 32px;`;
      case 'medium':
        return `width: 48px; height: 48px;`;
      case 'large':
        return `width: 64px; height: 64px;`;
      default:
        return `width: 48px; height: 48px;`;
    }
  }}
`;

const Logo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const BrandingContent = styled.div<{ variant?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${FFR_UNIFIED_BRAND.spacing.xs};

  ${({ variant }) => variant === 'footer' && `
    align-items: center;
    text-align: center;
  `}
`;

const CompanyName = styled.h1<{ variant?: string; size?: string }>`
  font-weight: ${FFR_UNIFIED_BRAND.typography.fontWeight.bold};
  margin: 0;
  letter-spacing: 0.5px;
  color: ${FFR_UNIFIED_BRAND.colors.primary};

  ${({ size = 'medium' }) => {
    switch (size) {
      case 'small':
        return `font-size: ${FFR_UNIFIED_BRAND.typography.fontSize.lg};`;
      case 'medium':
        return `font-size: ${FFR_UNIFIED_BRAND.typography.fontSize.xl};`;
      case 'large':
        return `font-size: ${FFR_UNIFIED_BRAND.typography.fontSize['2xl']};`;
      default:
        return `font-size: ${FFR_UNIFIED_BRAND.typography.fontSize.xl};`;
    }
  }}

  ${({ variant }) => variant === 'header' && `
    color: ${FFR_UNIFIED_BRAND.colors.text.white};
  `}
`;

const Tagline = styled.p<{ variant?: string }>`
  margin: 0;
  font-weight: ${FFR_UNIFIED_BRAND.typography.fontWeight.medium};
  font-style: italic;
  font-size: ${FFR_UNIFIED_BRAND.typography.fontSize.sm};
  color: ${FFR_UNIFIED_BRAND.colors.text.secondary};

  ${({ variant }) => variant === 'header' && `
    color: rgba(255, 255, 255, 0.9);
  `}
`;

const ContactInfo = styled.div<{ variant?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${FFR_UNIFIED_BRAND.spacing.xs};
  font-size: ${FFR_UNIFIED_BRAND.typography.fontSize.xs};
  color: ${FFR_UNIFIED_BRAND.colors.text.secondary};

  ${({ variant }) => {
    switch (variant) {
      case 'header':
        return `color: rgba(255, 255, 255, 0.85);`;
      case 'footer':
        return `
          align-items: center;
          color: ${FFR_UNIFIED_BRAND.colors.text.secondary};
        `;
      default:
        return '';
    }
  }}
`;

const ContactLine = styled.div`
  display: flex;
  align-items: center;
  gap: ${FFR_UNIFIED_BRAND.spacing.xs};
`;

const LicenseBadge = styled.span<{ variant?: string }>`
  display: inline-block;
  padding: ${FFR_UNIFIED_BRAND.spacing.xs} ${FFR_UNIFIED_BRAND.spacing.sm};
  border-radius: ${FFR_UNIFIED_BRAND.borderRadius.md};
  font-size: ${FFR_UNIFIED_BRAND.typography.fontSize.xs};
  font-weight: ${FFR_UNIFIED_BRAND.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: ${FFR_UNIFIED_BRAND.colors.primary};
  color: ${FFR_UNIFIED_BRAND.colors.text.white};

  ${({ variant }) => variant === 'header' && `
    background-color: rgba(255, 255, 255, 0.2);
    color: ${FFR_UNIFIED_BRAND.colors.text.white};
  `}
`;

// =====================================================
// MAIN COMPONENT
// =====================================================

interface UnifiedFFRBrandingProps {
  variant?: 'header' | 'footer' | 'compact' | 'document' | 'portal';
  theme?: 'light' | 'dark';
  size?: 'small' | 'medium' | 'large';
  showTagline?: boolean;
  showContactInfo?: boolean;
  showLicense?: boolean;
  className?: string;
}

export const UnifiedFFRBranding: React.FC<UnifiedFFRBrandingProps> = ({
  variant = 'header',
  theme = 'light',
  size = 'medium',
  showTagline = true,
  showContactInfo = true,
  showLicense = true,
  className
}) => {
  return (
    <BrandingContainer variant={variant} theme={theme} className={className}>
      <LogoContainer size={size}>
        <Logo
          src={FFR_UNIFIED_BRAND.assets.logos.primary}
          alt={`${FFR_UNIFIED_BRAND.company.name} Logo`}
        />
      </LogoContainer>

      <BrandingContent variant={variant}>
        <CompanyName variant={variant} size={size}>
          {FFR_UNIFIED_BRAND.company.name.toUpperCase()}
        </CompanyName>

        {showTagline && (
          <Tagline variant={variant}>
            {FFR_UNIFIED_BRAND.company.tagline}
          </Tagline>
        )}

        {showContactInfo && (
          <ContactInfo variant={variant}>
            <ContactLine>
              📍 {FFR_UNIFIED_BRAND.contact.address.formatted}
            </ContactLine>
            <ContactLine>
              📞 {FFR_UNIFIED_BRAND.contact.phone} | ✉️ {FFR_UNIFIED_BRAND.contact.email}
            </ContactLine>
            {showLicense && (
              <ContactLine>
                <LicenseBadge variant={variant}>
                  Licensed, Bonded & Insured | License #{FFR_UNIFIED_BRAND.contact.license}
                </LicenseBadge>
              </ContactLine>
            )}
          </ContactInfo>
        )}
      </BrandingContent>
    </BrandingContainer>
  );
};

// =====================================================
// PRE-BUILT VARIANTS
// =====================================================

export const FFRHeaderBranding: React.FC<{ className?: string; theme?: 'light' | 'dark' }> = ({
  className,
  theme = 'dark'
}) => (
  <UnifiedFFRBranding
    variant="header"
    theme={theme}
    size="medium"
    showTagline
    showContactInfo
    showLicense
    className={className}
  />
);

export const FFRFooterBranding: React.FC<{ className?: string }> = ({ className }) => (
  <UnifiedFFRBranding
    variant="footer"
    theme="light"
    size="medium"
    showTagline
    showContactInfo
    showLicense
    className={className}
  />
);

export const FFRCompactBranding: React.FC<{ className?: string }> = ({ className }) => (
  <UnifiedFFRBranding
    variant="compact"
    theme="light"
    size="small"
    showTagline={false}
    showContactInfo={false}
    showLicense={false}
    className={className}
  />
);

export const FFRDocumentBranding: React.FC<{ className?: string }> = ({ className }) => (
  <UnifiedFFRBranding
    variant="document"
    theme="light"
    size="large"
    showTagline
    showContactInfo={false}
    showLicense
    className={className}
  />
);

export const FFRPortalBranding: React.FC<{ className?: string }> = ({ className }) => (
  <UnifiedFFRBranding
    variant="portal"
    theme="light"
    size="medium"
    showTagline
    showContactInfo={false}
    showLicense={false}
    className={className}
  />
);

// =====================================================
// CSS CUSTOM PROPERTIES EXPORT
// =====================================================

export const generateCSSCustomProperties = (): string => {
  return `
    :root {
      /* Colors */
      --ffr-color-primary: ${FFR_UNIFIED_BRAND.colors.primary};
      --ffr-color-primary-hover: ${FFR_UNIFIED_BRAND.colors.primaryHover};
      --ffr-color-secondary: ${FFR_UNIFIED_BRAND.colors.secondary};
      --ffr-color-accent: ${FFR_UNIFIED_BRAND.colors.accent};

      /* Text Colors */
      --ffr-text-primary: ${FFR_UNIFIED_BRAND.colors.text.primary};
      --ffr-text-secondary: ${FFR_UNIFIED_BRAND.colors.text.secondary};
      --ffr-text-light: ${FFR_UNIFIED_BRAND.colors.text.light};

      /* Background Colors */
      --ffr-bg-primary: ${FFR_UNIFIED_BRAND.colors.background.primary};
      --ffr-bg-secondary: ${FFR_UNIFIED_BRAND.colors.background.secondary};

      /* Typography */
      --ffr-font-family: ${FFR_UNIFIED_BRAND.typography.fontFamily.primary};
      --ffr-font-size-base: ${FFR_UNIFIED_BRAND.typography.fontSize.base};

      /* Spacing */
      --ffr-spacing-xs: ${FFR_UNIFIED_BRAND.spacing.xs};
      --ffr-spacing-sm: ${FFR_UNIFIED_BRAND.spacing.sm};
      --ffr-spacing-md: ${FFR_UNIFIED_BRAND.spacing.md};
      --ffr-spacing-lg: ${FFR_UNIFIED_BRAND.spacing.lg};
      --ffr-spacing-xl: ${FFR_UNIFIED_BRAND.spacing.xl};

      /* Border Radius */
      --ffr-border-radius-sm: ${FFR_UNIFIED_BRAND.borderRadius.sm};
      --ffr-border-radius-base: ${FFR_UNIFIED_BRAND.borderRadius.base};
      --ffr-border-radius-lg: ${FFR_UNIFIED_BRAND.borderRadius.lg};

      /* Shadows */
      --ffr-shadow-sm: ${FFR_UNIFIED_BRAND.shadows.sm};
      --ffr-shadow-md: ${FFR_UNIFIED_BRAND.shadows.md};
      --ffr-shadow-lg: ${FFR_UNIFIED_BRAND.shadows.lg};
    }
  `;
};

export default UnifiedFFRBranding;