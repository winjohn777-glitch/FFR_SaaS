#!/bin/bash
# Fix all FFRBranding imports to use UnifiedFFRBranding

echo "🔧 Updating FFRBranding imports to use UnifiedFFRBranding..."

# Update import statements
sed -i '' "s|from '../FFRBranding'|from '../Shared/UnifiedFFRBranding'|g" src/components/Forms/FFRFormTemplate.tsx
sed -i '' "s|from '../FFRBranding'|from '../Shared/UnifiedFFRBranding'|g" src/components/SOP/SampleSOP.tsx
sed -i '' "s|from '../FFRBranding'|from '../Shared/UnifiedFFRBranding'|g" src/components/SOP/SOPDashboard.tsx
sed -i '' "s|from './FFRBranding'|from './Shared/UnifiedFFRBranding'|g" src/components/InvoicePDF.tsx
sed -i '' "s|from '../FFRBranding'|from '../Shared/UnifiedFFRBranding'|g" src/components/PDF/FinanceContractPDF.tsx
sed -i '' "s|from '../FFRBranding'|from '../Shared/UnifiedFFRBranding'|g" src/components/PDF/FFRPDFGenerator.tsx
sed -i '' "s|from '../FFRBranding'|from '../Shared/UnifiedFFRBranding'|g" src/components/Templates/PrintableDocument.tsx
sed -i '' "s|from '../components/FFRBranding'|from '../components/Shared/UnifiedFFRBranding'|g" src/pages/Invoicing.tsx

# Update import names to use unified constants
sed -i '' "s|FFR_BRANDING|FFR_UNIFIED_BRAND|g" src/components/Forms/FFRFormTemplate.tsx
sed -i '' "s|FFR_BRANDING|FFR_UNIFIED_BRAND|g" src/components/SOP/SampleSOP.tsx
sed -i '' "s|FFR_BRANDING|FFR_UNIFIED_BRAND|g" src/components/InvoicePDF.tsx
sed -i '' "s|FFR_BRANDING|FFR_UNIFIED_BRAND|g" src/components/PDF/FinanceContractPDF.tsx
sed -i '' "s|FFR_BRANDING|FFR_UNIFIED_BRAND|g" src/components/PDF/FFRPDFGenerator.tsx
sed -i '' "s|FFR_BRANDING|FFR_UNIFIED_BRAND|g" src/components/Templates/PrintableDocument.tsx
sed -i '' "s|FFR_BRANDING|FFR_UNIFIED_BRAND|g" src/pages/Invoicing.tsx

# Update component names
sed -i '' "s|FFRHeaderBranding|FFRUnifiedBranding|g" src/components/SOP/SOPDashboard.tsx
sed -i '' "s|FFRDocumentBranding|FFRUnifiedBranding|g" src/components/Templates/PrintableDocument.tsx

echo "✅ Updated all FFRBranding imports to use UnifiedFFRBranding"