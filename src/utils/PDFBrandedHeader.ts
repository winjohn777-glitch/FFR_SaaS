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
      // Load and embed the actual FFR Florida state logo
      const logoPath = opts.logoPath || '/FFR logo 64x64.png';
      const logoImage = await loadImageAsBase64(logoPath);

      // Add the actual FFR logo image
      pdf.addImage(logoImage, 'PNG', logoX, logoY, logoWidth, logoHeight);
    } catch (error) {
      console.warn('FFR logo could not be loaded, using fallback:', error);
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
