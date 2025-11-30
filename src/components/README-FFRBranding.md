# FFR Branding Platform Documentation

## Overview
The FFR Branding Platform provides a comprehensive, consistent branding system for Florida First Roofing LLC across all modules, documentation, and applications.

## Components

### Main Component: `FFRBranding`
The core branding component that accepts various props to customize appearance for different contexts.

```tsx
import FFRBranding from './components/FFRBranding';

<FFRBranding
  variant="header"
  showTagline={true}
  showContactInfo={true}
  logoSize="medium"
/>
```

### Pre-built Components

#### `FFRHeaderBranding`
- **Use Case**: Application headers, main navigation areas
- **Features**: Full branding with logo, tagline, contact info
- **Style**: Blue gradient background, white text, professional appearance

```tsx
import { FFRHeaderBranding } from './components/FFRBranding';
<FFRHeaderBranding />
```

#### `FFRCompactBranding`
- **Use Case**: Sidebar navigation, compact spaces, mobile views
- **Features**: Logo and company name only
- **Style**: Minimal footprint, essential branding elements

```tsx
import { FFRCompactBranding } from './components/FFRBranding';
<FFRCompactBranding />
```

#### `FFRFooterBranding`
- **Use Case**: Page footers, document footers
- **Features**: Centered layout with complete company information
- **Style**: Clean, informational layout

```tsx
import { FFRFooterBranding } from './components/FFRBranding';
<FFRFooterBranding />
```

#### `FFRDocumentBranding`
- **Use Case**: PDF headers, printed materials, official documents
- **Features**: Professional document header with company details
- **Style**: Document-ready formatting with blue accents

```tsx
import { FFRDocumentBranding } from './components/FFRBranding';
<FFRDocumentBranding />
```

## Branding Constants

### `FFR_BRANDING` Object
Centralized branding constants for consistent usage across the platform:

```tsx
import { FFR_BRANDING } from './components/FFRBranding';

// Colors
FFR_BRANDING.colors.primary     // #1e40af (primary blue)
FFR_BRANDING.colors.secondary   // #3b82f6 (secondary blue)
FFR_BRANDING.colors.accent      // #60a5fa (accent blue)

// Contact Information
FFR_BRANDING.contact.name       // "Florida First Roofing LLC"
FFR_BRANDING.contact.phone      // "(321) 301-4512"
FFR_BRANDING.contact.email      // "admin@floridafirstroofing.com"
FFR_BRANDING.contact.license    // "CCC1336561"

// Logo Assets
FFR_BRANDING.logos.png          // "/assets/logos/ffr-logo-250x250.png"
FFR_BRANDING.logos.svg          // "/assets/logos/ffr-logo.svg"
```

## Variants

### Available Variants
- **`header`**: Blue gradient background, full branding with contact info
- **`compact`**: Minimal space usage, essential elements only
- **`footer`**: Centered layout for footer areas
- **`document`**: Professional formatting for documents and PDFs

### Logo Sizes
- **`small`**: 32x32px - For compact spaces
- **`medium`**: 48x48px - Standard size (default)
- **`large`**: 64x64px - For headers and emphasis

## Usage Examples

### Application Header
```tsx
// Full featured header with all branding elements
<FFRHeaderBranding />

// Or custom configuration
<FFRBranding
  variant="header"
  showTagline={true}
  showContactInfo={true}
  logoSize="large"
/>
```

### Navigation Sidebar
```tsx
// Compact branding for limited space
<FFRCompactBranding />
```

### Document/PDF Integration
```tsx
// For PDF reports and official documents
<FFRDocumentBranding />
```

### Custom Implementation
```tsx
<FFRBranding
  variant="custom"
  showTagline={false}
  showContactInfo={true}
  logoSize="small"
  className="custom-branding-styles"
/>
```

## Styling Integration

### Theme Integration
The branding components integrate with your existing styled-components theme:

```tsx
const theme = {
  colors: {
    primary: FFR_BRANDING.colors.primary,
    secondary: FFR_BRANDING.colors.secondary,
    // ... other theme colors
  }
};
```

### Custom Styling
Use the `className` prop to apply custom styles:

```tsx
const CustomBranding = styled(FFRHeaderBranding)`
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;
```

## Asset Management

### Logo Files
- **PNG**: `/assets/logos/ffr-logo-250x250.png` - For web usage
- **SVG**: `/assets/logos/ffr-logo.svg` - For scalable graphics

### Asset Requirements
Ensure logo files are properly placed in the public assets directory:
```
public/
  assets/
    logos/
      ffr-logo-250x250.png
      ffr-logo.svg
```

## Implementation Checklist

### Module Integration
- [ ] Import appropriate branding component
- [ ] Replace custom headers with FFR branding
- [ ] Update page layouts to accommodate branding
- [ ] Test responsive behavior
- [ ] Verify brand consistency

### PDF/Document Integration
- [ ] Update PDF generation with FFR branding constants
- [ ] Ensure proper spacing and layout
- [ ] Test print compatibility
- [ ] Verify logo quality in documents

### Color Scheme Integration
- [ ] Update theme colors with FFR branding colors
- [ ] Replace hardcoded color values
- [ ] Ensure accessibility compliance
- [ ] Test color contrast ratios

## Benefits

### Consistency
- Unified branding across all modules
- Consistent color schemes and typography
- Standardized logo usage and sizing

### Maintainability
- Centralized branding configuration
- Easy updates to company information
- Single source of truth for brand assets

### Flexibility
- Multiple variants for different use cases
- Customizable features and display options
- Easy integration with existing components

### Professional Appearance
- High-quality logo integration
- Professional color schemes
- Licensed, bonded, and insured messaging

## Best Practices

### Usage Guidelines
1. **Always use the branding constants** from `FFR_BRANDING` object
2. **Choose appropriate variants** based on context and space
3. **Maintain consistent spacing** around branding elements
4. **Test responsive behavior** across different screen sizes
5. **Verify logo quality** in all implementations

### Color Usage
- Use `FFR_BRANDING.colors.primary` for main CTAs and headers
- Use `FFR_BRANDING.colors.secondary` for secondary elements
- Use `FFR_BRANDING.colors.accent` for highlights and hover states

### Typography
- Company name should always be in uppercase: "FLORIDA FIRST ROOFING LLC"
- License information should include full text: "Licensed, Bonded & Insured | License #CCC1336561"
- Tagline should use the standardized version: "Premium Roofing Solutions Across Florida"

## Support

For questions about the FFR Branding Platform or to request new features:
- Review this documentation
- Check existing component implementations
- Follow the established patterns for consistency
- Test thoroughly across different contexts

The branding platform ensures Florida First Roofing LLC maintains a professional, consistent identity across all digital and printed materials.