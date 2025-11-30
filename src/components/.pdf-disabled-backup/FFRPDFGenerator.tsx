import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FFR_UNIFIED_BRAND } from '../Shared/UnifiedFFRBranding';
import { UnifiedPDFGenerator, createFFRPDF } from '../../utils/UnifiedPDFGenerator';

interface PDFGeneratorProps {
  title: string;
  subtitle?: string;
  documentType: 'SOP' | 'Invoice' | 'Report' | 'Form' | 'Manual';
  content: React.ReactNode;
  filename?: string;
  showWatermark?: boolean;
  orientation?: 'portrait' | 'landscape';
}

interface LocalPDFOptions {
  title: string;
  subtitle?: string;
  documentType: string;
  showWatermark?: boolean;
  orientation?: 'portrait' | 'landscape';
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

class FFRPDFGenerator {
  private unifiedGenerator: UnifiedPDFGenerator;
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margins: { top: number; right: number; bottom: number; left: number };

  constructor(orientation: 'portrait' | 'landscape' = 'portrait', title: string = 'DOCUMENT') {
    this.unifiedGenerator = createFFRPDF({
      title,
      orientation: orientation === 'portrait' ? 'p' : 'l'
    });

    this.doc = this.unifiedGenerator.getPDF();
    const dimensions = this.unifiedGenerator.getPageDimensions();
    this.pageWidth = dimensions.width;
    this.pageHeight = dimensions.height;

    this.margins = {
      top: 72,  // 1 inch
      right: 54, // 0.75 inch
      bottom: 72, // 1 inch
      left: 54   // 0.75 inch
    };
  }

  public addLetterhead(): number {
    // Use unified generator's content area - header is already added in constructor
    const contentArea = this.unifiedGenerator.getContentArea();
    return contentArea.startY;
  }

  public addFooter(): void {
    // Footer is handled by unified generator when finalized
    // This method remains for backward compatibility but doesn't override unified footer
  }

  public addWatermark(): void {
    this.doc.setGState(this.doc.GState({ opacity: 0.1 }));
    this.doc.setTextColor(30, 64, 175);
    this.doc.setFontSize(60);
    this.doc.setFont('helvetica', 'bold');

    // Rotate and center the watermark
    const centerX = this.pageWidth / 2;
    const centerY = this.pageHeight / 2;

    this.doc.text('FLORIDA FIRST ROOFING', centerX, centerY, {
      align: 'center',
      angle: 45
    });

    // Reset opacity
    this.doc.setGState(this.doc.GState({ opacity: 1 }));
  }

  public async generateFromElement(elementId: string, options: LocalPDFOptions): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID '${elementId}' not found`);
    }

    try {
      // Add watermark if enabled
      if (options.showWatermark) {
        this.addWatermark();
      }

      // Add letterhead and get starting Y position for content
      const contentStartY = this.addLetterhead();

      // Convert HTML element to canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Calculate dimensions
      const imgWidth = this.pageWidth - this.margins.left - this.margins.right;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add content
      const imgData = canvas.toDataURL('image/png');
      this.doc.addImage(imgData, 'PNG', this.margins.left, contentStartY, imgWidth, imgHeight);

      // Add footer
      this.addFooter();

      // Check if content extends beyond page and add additional pages if needed
      if (contentStartY + imgHeight > this.pageHeight - this.margins.bottom - 60) {
        // Content is too long, split into multiple pages
        // This is a simplified version - in production, you'd want more sophisticated page breaking
        this.doc.addPage();
        if (options.showWatermark) {
          this.addWatermark();
        }
        this.addFooter();
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

  public addTextContent(text: string, startY: number): number {
    const lines = this.doc.splitTextToSize(text, this.pageWidth - this.margins.left - this.margins.right);
    this.doc.setTextColor(55, 65, 81);
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');

    let currentY = startY;
    lines.forEach((line: string) => {
      if (currentY > this.pageHeight - this.margins.bottom - 60) {
        this.doc.addPage();
        if (this.doc.internal.pages.length > 2) {
          this.addWatermark();
        }
        currentY = this.margins.top;
      }
      this.doc.text(line, this.margins.left, currentY);
      currentY += 14;
    });

    return currentY;
  }

  public save(filename: string): void {
    this.unifiedGenerator.save(filename);
  }

  public output(type: 'blob' | 'bloburl' | 'datauristring' = 'blob'): any {
    const finalizedPDF = this.unifiedGenerator.finalize();
    if (type === 'blob') {
      return finalizedPDF.output('blob');
    } else if (type === 'bloburl') {
      return finalizedPDF.output('bloburl');
    } else if (type === 'datauristring') {
      return finalizedPDF.output('datauristring');
    }
    return finalizedPDF.output('blob');
  }
}

// React component for easy PDF generation
export const PDFDownloadButton: React.FC<{
  elementId: string;
  filename: string;
  title: string;
  subtitle?: string;
  documentType: 'SOP' | 'Invoice' | 'Report' | 'Form' | 'Manual';
  showWatermark?: boolean;
  orientation?: 'portrait' | 'landscape';
  children: React.ReactNode;
  className?: string;
}> = ({
  elementId,
  filename,
  title,
  subtitle,
  documentType,
  showWatermark = true,
  orientation = 'portrait',
  children,
  className
}) => {
  const handleDownload = async () => {
    try {
      const pdfGenerator = new FFRPDFGenerator(orientation, title);

      await pdfGenerator.generateFromElement(elementId, {
        title,
        subtitle,
        documentType,
        showWatermark,
        orientation
      });

      pdfGenerator.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <button onClick={handleDownload} className={className}>
      {children}
    </button>
  );
};

// Utility functions for common PDF operations
export const generateSOPPDF = async (
  sopNumber: string,
  title: string,
  content: string,
  version: string = '1.0'
): Promise<Blob> => {
  const pdfGenerator = new FFRPDFGenerator('portrait', `SOP ${sopNumber} - ${title}`);

  const contentStartY = pdfGenerator.addLetterhead();
  const finalY = pdfGenerator.addTextContent(content, contentStartY + 20);

  return pdfGenerator.output('blob');
};

export const generateInvoicePDF = async (
  invoiceNumber: string,
  invoiceData: any
): Promise<Blob> => {
  const pdfGenerator = new FFRPDFGenerator('portrait', `INVOICE #${invoiceNumber}`);

  // Add invoice-specific content formatting here
  const contentStartY = pdfGenerator.addLetterhead();

  return pdfGenerator.output('blob');
};

export const generateReportPDF = async (
  reportTitle: string,
  reportData: any,
  orientation: 'portrait' | 'landscape' = 'landscape'
): Promise<Blob> => {
  const pdfGenerator = new FFRPDFGenerator(orientation, reportTitle.toUpperCase());

  // Add report-specific content formatting here
  const contentStartY = pdfGenerator.addLetterhead();

  return pdfGenerator.output('blob');
};

export default FFRPDFGenerator;

// CSS styles for print optimization
export const printStyles = `
  @media print {
    @page {
      margin: 0.5in;
      size: letter;
    }

    body {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .no-print {
      display: none !important;
    }

    .print-only {
      display: block !important;
    }

    .page-break {
      page-break-before: always;
    }

    .page-break-inside-avoid {
      page-break-inside: avoid;
    }
  }

  .print-only {
    display: none;
  }
`;