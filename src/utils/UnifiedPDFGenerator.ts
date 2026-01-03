/**
 * Unified PDF Generator for Florida First Roofing
 * Provides consistent headers and footers across all PDF documents
 */

import jsPDF from 'jspdf';

export interface PDFOptions {
  title: string;
  orientation?: 'p' | 'l';
  format?: string;
  includeCustomerFooter?: boolean;
  customerName?: string;
  forExternalUse?: boolean; // Whether to include branded footer (for external documents)
}

export class UnifiedPDFGenerator {
  private pdf: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private options: PDFOptions;

  constructor(options: PDFOptions) {
    this.options = {
      orientation: 'p',
      format: 'a4',
      includeCustomerFooter: true,
      forExternalUse: true, // Default to external use
      ...options
    };

    this.pdf = new jsPDF(this.options.orientation, 'mm', this.options.format);
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();

    this.addHeader();
  }

  /**
   * Add standardized FFR header with logo and company information
   */
  private addHeader(): void {
    // FFR Logo placeholder (consistent with invoice preview)
    this.pdf.setFillColor(30, 58, 138); // FFR blue color
    this.pdf.circle(25, 25, 8, 'F');

    // Add "FFR" text in logo circle
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(8);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('FFR', 25, 27, { align: 'center' });

    // Company name and contact info - exact format from invoice preview
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('FLORIDA FIRST ROOFING LLC', 40, 25);

    // Contact information in clean format
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('3815 N. HWY 1 #13, Cocoa, FL 32926', 40, 35);
    this.pdf.text('License #CCC1336561 | (321) 301-4512', 40, 42);
    this.pdf.text('admin@floridafirstroofing.com', 40, 49);

    // Horizontal line separator
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(20, 60, this.pageWidth - 20, 60);

    // Document title
    this.pdf.setFontSize(20);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(this.options.title, 20, 80);
  }

  /**
   * Add standardized FFR footer (only for external documents)
   */
  private addFooter(): void {
    // Only add footer for external documents (invoices, contracts, proposals)
    if (!this.options.forExternalUse) {
      return; // Skip footer for internal documents (reports)
    }

    const footerStartY = this.pageHeight - 30;

    // Thank you message
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(11);
    this.pdf.text('Thank you for choosing Florida First Roofing LLC!', this.pageWidth / 2, footerStartY, { align: 'center' });

    // License information
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(9);
    this.pdf.text('Licensed, Bonded & Insured | License #CCC1336561', this.pageWidth / 2, footerStartY + 8, { align: 'center' });

    // Customer-specific footer if enabled and customer provided
    if (this.options.includeCustomerFooter && this.options.customerName) {
      this.pdf.setFont('helvetica', 'italic');
      this.pdf.setFontSize(8);
      this.pdf.text(`Document prepared for: ${this.options.customerName}`, this.pageWidth / 2, footerStartY + 16, { align: 'center' });
    }
  }

  /**
   * Get the PDF instance for adding content
   */
  getPDF(): jsPDF {
    return this.pdf;
  }

  /**
   * Get the page dimensions
   */
  getPageDimensions(): { width: number; height: number } {
    return { width: this.pageWidth, height: this.pageHeight };
  }

  /**
   * Get content area boundaries (excluding header and footer)
   */
  getContentArea(): { startY: number; endY: number; leftMargin: number; rightMargin: number } {
    return {
      startY: 90, // After header
      endY: this.pageHeight - 60, // Before footer
      leftMargin: 20,
      rightMargin: this.pageWidth - 20
    };
  }

  /**
   * Add a new page with header and footer
   */
  addPage(): void {
    this.pdf.addPage();
    this.addHeader();
  }

  /**
   * Finalize the PDF with footer and return it
   */
  finalize(): jsPDF {
    this.addFooter();
    return this.pdf;
  }

  /**
   * Save the PDF with consistent naming convention
   */
  save(filename?: string): void {
    this.addFooter();
    const finalFilename = filename || `FFR-${this.options.title.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.pdf`;
    this.pdf.save(finalFilename);
  }

  /**
   * Add standardized table with FFR styling
   */
  addTable(headers: string[], data: string[][], startY: number): number {
    const tableWidth = this.pageWidth - 40;
    const columnWidth = tableWidth / headers.length;
    let currentY = startY;

    // Table headers
    this.pdf.setFillColor(248, 249, 250);
    this.pdf.setTextColor(55, 65, 81);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(10);

    headers.forEach((header, index) => {
      const x = 20 + (index * columnWidth);
      this.pdf.rect(x, currentY, columnWidth, 8, 'F');
      this.pdf.rect(x, currentY, columnWidth, 8, 'S');
      this.pdf.text(header, x + 2, currentY + 6);
    });

    currentY += 8;

    // Table data
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFontSize(9);

    data.forEach((row, rowIndex) => {
      const rowY = currentY + (rowIndex * 7);

      // Alternate row colors
      if (rowIndex % 2 === 1) {
        this.pdf.setFillColor(249, 250, 251);
        this.pdf.rect(20, rowY, tableWidth, 7, 'F');
      }

      row.forEach((cell, cellIndex) => {
        const x = 20 + (cellIndex * columnWidth);
        this.pdf.rect(x, rowY, columnWidth, 7, 'S');
        this.pdf.text(cell.toString(), x + 2, rowY + 5);
      });
    });

    return currentY + (data.length * 7) + 10;
  }

  /**
   * Add text with automatic line wrapping
   */
  addWrappedText(text: string, x: number, y: number, maxWidth: number): number {
    const lines = this.pdf.splitTextToSize(text, maxWidth);
    let currentY = y;

    lines.forEach((line: string) => {
      this.pdf.text(line, x, currentY);
      currentY += 6;
    });

    return currentY + 5;
  }

  /**
   * Add a section header
   */
  addSectionHeader(title: string, y: number): number {
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(14);
    this.pdf.setTextColor(30, 58, 138); // FFR blue
    this.pdf.text(title, 20, y);

    // Underline
    this.pdf.setDrawColor(30, 58, 138);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(20, y + 2, 20 + this.pdf.getTextWidth(title), y + 2);

    this.pdf.setTextColor(0, 0, 0); // Reset to black
    return y + 15;
  }
}

/**
 * Helper function to create a standardized FFR PDF
 */
export const createFFRPDF = (options: PDFOptions): UnifiedPDFGenerator => {
  return new UnifiedPDFGenerator(options);
};

/**
 * Helper function for invoice PDFs
 */
export const createInvoicePDF = (customerName?: string): UnifiedPDFGenerator => {
  return new UnifiedPDFGenerator({
    title: 'INVOICE',
    customerName,
    includeCustomerFooter: true
  });
};

/**
 * Helper function for report PDFs
 */
export const createReportPDF = (reportTitle: string, forExternalUse: boolean = false): UnifiedPDFGenerator => {
  return new UnifiedPDFGenerator({
    title: reportTitle.toUpperCase(),
    includeCustomerFooter: false,
    forExternalUse // Default to false (internal use) for reports
  });
};

/**
 * Helper function for proposal PDFs
 */
export const createProposalPDF = (customerName: string): UnifiedPDFGenerator => {
  return new UnifiedPDFGenerator({
    title: 'PROPOSAL',
    customerName,
    includeCustomerFooter: true
  });
};

/**
 * Helper function for contract PDFs
 */
export const createContractPDF = (customerName: string): UnifiedPDFGenerator => {
  return new UnifiedPDFGenerator({
    title: 'CONTRACT',
    customerName,
    includeCustomerFooter: true
  });
};