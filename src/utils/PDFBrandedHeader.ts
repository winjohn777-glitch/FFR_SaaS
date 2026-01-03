import jsPDF from 'jspdf';
import { FFR_UNIFIED_BRAND } from '../components/Shared/UnifiedFFRBranding';

/**
 * FLORIDA FIRST ROOFING - Branded PDF Header Utility
 *
 * This utility provides a consistent branded header for all PDF documents
 * with the blue-to-teal gradient background and FFR state logo.
 *
 * Features:
 * - Blue-to-teal gradient background
 * - Florida state logo with FFR branding
 * - Company name and tagline
 * - Complete contact information
 * - Rounded corners
 * - Professional "INVOICE" (or other document type) badge
 */

// Base64-encoded FFR logo fallback (64x64 PNG)
const FFR_LOGO_BASE64 = 'data:image/png;base64,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';

interface BrandedHeaderOptions {
  documentType?: string; // e.g., "INVOICE", "ESTIMATE", "PROPOSAL", "REPORT"
  showLogo?: boolean;
  showContactInfo?: boolean;
  logoPath?: string;
  printable?: boolean; // If true, no gradient background and black text
}

const DEFAULT_OPTIONS: BrandedHeaderOptions = {
  documentType: 'INVOICE',
  showLogo: true,
  showContactInfo: true,
  logoPath: '/assets/logos/ffr-logo-250x250.png' // Default to PNG logo
};

/**
 * Adds the branded FFR header to a PDF document
 *
 * @param pdf - jsPDF instance
 * @param options - Header customization options
 * @returns The Y position where content can start after the header
 */
export const addBrandedPDFHeader = async (
  pdf: jsPDF,
  options: BrandedHeaderOptions = {}
): Promise<number> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const pageWidth = pdf.internal.pageSize.getWidth();
  const headerHeight = 60;

  // ===== GRADIENT BACKGROUND (only for non-printable) =====
  if (!opts.printable) {
    // Create HORIZONTAL blue-to-teal gradient effect using multiple rectangles
    // Since jsPDF doesn't support gradients directly, we simulate it with color bands
    const gradientSteps = 50; // More steps for smoother horizontal gradient
    const stepWidth = pageWidth / gradientSteps;

    // Define gradient colors (blue to teal, LEFT to RIGHT)
    const startColor = { r: 46, g: 90, b: 172 };   // Royal Blue #2E5AAC (LEFT)
    const endColor = { r: 32, g: 156, b: 149 };     // Teal #209C95 (RIGHT)

    // Draw horizontal gradient by layering vertical rectangles
    for (let i = 0; i < gradientSteps; i++) {
      const ratio = i / gradientSteps;
      const r = Math.round(startColor.r + (endColor.r - startColor.r) * ratio);
      const g = Math.round(startColor.g + (endColor.g - startColor.g) * ratio);
      const b = Math.round(startColor.b + (endColor.b - startColor.b) * ratio);

      pdf.setFillColor(r, g, b);
      pdf.rect(i * stepWidth, 0, stepWidth, headerHeight, 'F');
    }
  } else {
    // For printable version: simple white background with thin border
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.rect(0, 0, pageWidth, headerHeight);
  }

  // ===== FFR LOGO =====
  const logoX = 15;  // Far left margin
  const logoY = 18;   // Fine-tuned alignment
  const logoWidth = 15;  // Reduced by 40% (25 * 0.6 = 15)
  const logoHeight = 15; // Reduced by 40%

  if (opts.showLogo) {
    try {
      // Try to load the logo from path first, fall back to embedded base64
      const logoPath = opts.logoPath || '/FFR logo 64x64.png';
      let logoImage: string;

      try {
        logoImage = await loadImageAsBase64(logoPath);
      } catch {
        // Use embedded base64 fallback if loading fails
        logoImage = FFR_LOGO_BASE64;
      }

      // Add the FFR logo image
      pdf.addImage(logoImage, 'PNG', logoX, logoY, logoWidth, logoHeight);
    } catch (error) {
      console.warn('FFR logo could not be loaded:', error);
      // Still try with the fallback base64
      try {
        pdf.addImage(FFR_LOGO_BASE64, 'PNG', logoX, logoY, logoWidth, logoHeight);
      } catch (fallbackError) {
        console.warn('Fallback logo also failed:', fallbackError);
      }
    }
  }

  // ===== COMPANY NAME AND INFO =====
  // Use white text for gradient background, black text for printable
  pdf.setTextColor(opts.printable ? 0 : 255, opts.printable ? 0 : 255, opts.printable ? 0 : 255);

  // Company name - starts right after logo
  const companyNameX = logoX + logoWidth + 5; // Logo end + small gap (15 + 15 + 5 = 35)
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text(
    FFR_UNIFIED_BRAND.company.name.toUpperCase(),
    companyNameX,
    25  // Aligned with logo
  );

  if (opts.showContactInfo) {
    // Contact information - aligned with company name
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');

    // Address
    pdf.text(
      FFR_UNIFIED_BRAND.contact.address.formatted,
      companyNameX,
      35
    );

    // License and Phone
    pdf.text(
      `License #${FFR_UNIFIED_BRAND.contact.license} | ${FFR_UNIFIED_BRAND.contact.phone}`,
      companyNameX,
      42
    );

    // Email
    pdf.text(
      FFR_UNIFIED_BRAND.contact.email,
      companyNameX,
      49
    );
  }

  // Reset text color to black for document body
  pdf.setTextColor(0, 0, 0);

  // Return the Y position where content can start (after header + margin)
  return headerHeight + 10;
};

/**
 * Adds branded footer to PDF document
 *
 * @param pdf - jsPDF instance
 * @param forExternalUse - Whether this document is for external use (customers/clients)
 */
export const addBrandedPDFFooter = (pdf: jsPDF, forExternalUse: boolean = true): void => {
  // Only add footer for external documents (invoices, contracts, proposals)
  if (!forExternalUse) {
    return; // Skip footer for internal documents
  }

  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const footerY = pageHeight - 20;

  // Thank you message
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  pdf.text(
    `Thank you for choosing ${FFR_UNIFIED_BRAND.company.name}!`,
    pageWidth / 2,
    footerY,
    { align: 'center' }
  );

  // License information
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  pdf.text(
    `Licensed, Bonded & Insured | License #${FFR_UNIFIED_BRAND.contact.license}`,
    pageWidth / 2,
    footerY + 6,
    { align: 'center' }
  );
};

/**
 * Helper to load and convert an image to base64 for embedding in PDFs
 * This is useful for embedding the actual FFR logo
 *
 * @param imagePath - Path to the image file
 * @returns Promise with base64 image data
 */
export const loadImageAsBase64 = async (imagePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      resolve(dataURL);
    };

    img.onerror = (error) => {
      reject(error);
    };

    img.src = imagePath;
  });
};

/**
 * Enhanced version of addBrandedPDFHeader that loads and embeds the actual FFR logo
 *
 * @param pdf - jsPDF instance
 * @param options - Header customization options
 * @returns Promise with the Y position where content can start
 */
export const addBrandedPDFHeaderWithLogo = async (
  pdf: jsPDF,
  options: BrandedHeaderOptions = {}
): Promise<number> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  try {
    // First, try to load the logo
    if (opts.showLogo && opts.logoPath) {
      const logoBase64 = await loadImageAsBase64(opts.logoPath);

      // Add the header with the loaded logo
      // For now, fall back to the basic header
      // TODO: Implement logo embedding once base64 loading is working
      return await addBrandedPDFHeader(pdf, options);
    }
  } catch (error) {
    console.warn('Could not load logo, falling back to basic header:', error);
  }

  // Fallback to basic header without logo
  return await addBrandedPDFHeader(pdf, options);
};

export default {
  addBrandedPDFHeader,
  addBrandedPDFFooter,
  loadImageAsBase64,
  addBrandedPDFHeaderWithLogo
};
