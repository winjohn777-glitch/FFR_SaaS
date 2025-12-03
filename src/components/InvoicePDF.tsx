import jsPDF from 'jspdf';
import { addBrandedPDFHeader, addBrandedPDFFooter } from '../utils/PDFBrandedHeader';

interface InvoiceLineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerAddress: string;
  customerPhone?: string;
  customerEmail?: string;
  jobName: string;
  amount: number;
  dueDate: string;
  issueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'pending';
  paymentTerms?: string;
  lineItems?: InvoiceLineItem[];
  items?: Array<{
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  notes?: string;
  customFields?: Record<string, any>;
}

export const generateInvoicePDF = async (invoice: Invoice, printable: boolean = false) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();

  // Add branded FFR header with gradient and logo
  const contentStartY = await addBrandedPDFHeader(pdf, {
    documentType: 'INVOICE',
    showLogo: true,
    showContactInfo: true,
    printable
  });

  // Invoice Header - positioned after the branded header
  let currentY = contentStartY + 10;

  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INVOICE', 20, currentY);

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Invoice #: ${invoice.invoiceNumber}`, 20, currentY + 10);
  pdf.text(`Date: ${new Date(invoice.issueDate).toLocaleDateString()}`, 20, currentY + 17);
  pdf.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 20, currentY + 24);

  // Bill To Section - Enhanced with custom fields
  pdf.setFont('helvetica', 'bold');
  pdf.text('Bill To:', pageWidth - 80, currentY);
  pdf.setFont('helvetica', 'normal');

  let billToY = currentY + 10;
  pdf.text(invoice.customerName, pageWidth - 80, billToY);
  billToY += 7;

  if (invoice.customerAddress) {
    pdf.text(invoice.customerAddress, pageWidth - 80, billToY);
    billToY += 7;
  }

  if (invoice.customerPhone) {
    pdf.text(`Phone: ${invoice.customerPhone}`, pageWidth - 80, billToY);
    billToY += 7;
  }

  if (invoice.customerEmail) {
    pdf.text(`Email: ${invoice.customerEmail}`, pageWidth - 80, billToY);
    billToY += 7;
  }

  // Line Items Table - positioned after invoice header section
  const tableStartY = currentY + 50;
  const tableHeaders = ['Description', 'Qty', 'Rate', 'Amount'];
  const tableWidth = 170; // Total table width
  const tableX = 20; // Table starting X position
  const columnWidths = [90, 20, 30, 30]; // Description, Qty, Rate, Amount
  const columnX = [20, 110, 130, 160]; // Start position of each column
  const rowHeight = 10;

  // Table Header
  pdf.setFillColor(248, 249, 250);
  pdf.rect(tableX, tableStartY, tableWidth, rowHeight, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  tableHeaders.forEach((header, index) => {
    const align = index === 0 ? 'left' : 'right';
    const x = index === 0 ? columnX[index] + 2 : columnX[index] + columnWidths[index] - 2;
    pdf.text(header, x, tableStartY + 7, { align });
  });

  // Table Rows
  pdf.setFont('helvetica', 'normal');
  let tableCurrentY = tableStartY + rowHeight;

  const invoiceItems = invoice.lineItems || invoice.items || [];
  invoiceItems.forEach((item, index) => {
    // Alternate row background
    if (index % 2 === 0) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(tableX, tableCurrentY, tableWidth, rowHeight, 'F');
    }

    // Description (left aligned)
    pdf.text(item.description, columnX[0] + 2, tableCurrentY + 7);

    // Quantity (right aligned)
    pdf.text(item.quantity.toString(), columnX[1] + columnWidths[1] - 2, tableCurrentY + 7, { align: 'right' });

    // Rate (right aligned)
    pdf.text(`$${item.rate.toFixed(2)}`, columnX[2] + columnWidths[2] - 2, tableCurrentY + 7, { align: 'right' });

    // Amount (right aligned)
    pdf.text(`$${item.amount.toFixed(2)}`, columnX[3] + columnWidths[3] - 2, tableCurrentY + 7, { align: 'right' });

    tableCurrentY += rowHeight;
  });

  // Draw complete table border with grid lines
  pdf.setDrawColor(222, 226, 230);
  pdf.setLineWidth(0.5);

  // Outer border
  pdf.rect(tableX, tableStartY, tableWidth, tableCurrentY - tableStartY);

  // Column separators (vertical lines)
  for (let i = 1; i < columnX.length; i++) {
    pdf.line(columnX[i], tableStartY, columnX[i], tableCurrentY);
  }

  // Header separator (horizontal line)
  pdf.line(tableX, tableStartY + rowHeight, tableX + tableWidth, tableStartY + rowHeight);

  // Totals Section
  const totalsY = tableCurrentY + 20;
  const subtotal = invoiceItems.reduce((sum, item) => sum + item.amount, 0);
  const taxRate = 0.07; // 7% Florida sales tax
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  pdf.setFont('helvetica', 'normal');
  pdf.text('Subtotal:', 140, totalsY);
  pdf.text(`$${subtotal.toFixed(2)}`, 185, totalsY, { align: 'right' });

  pdf.text('FL Sales Tax (7%):', 140, totalsY + 8);
  pdf.text(`$${taxAmount.toFixed(2)}`, 185, totalsY + 8, { align: 'right' });

  // Total line with bold font and border
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.line(140, totalsY + 12, 185, totalsY + 12);
  pdf.text('Total:', 140, totalsY + 20);
  pdf.text(`$${total.toFixed(2)}`, 185, totalsY + 20, { align: 'right' });

  // Payment Terms and Notes
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  const footerY = totalsY + 40;

  pdf.setFont('helvetica', 'bold');
  pdf.text('Payment Terms:', 20, footerY);
  pdf.setFont('helvetica', 'normal');
  pdf.text(invoice.paymentTerms || 'Net 30 days', 65, footerY);

  pdf.setFont('helvetica', 'bold');
  pdf.text('Payment Methods:', 20, footerY + 8);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Check, Cash, Credit Card, Financing', 65, footerY + 8);

  if (invoice.notes) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('Notes:', 20, footerY + 20);
    pdf.setFont('helvetica', 'normal');

    // Split long notes into multiple lines
    const noteLines = pdf.splitTextToSize(invoice.notes, 170);
    noteLines.forEach((line: string, index: number) => {
      pdf.text(line, 20, footerY + 28 + (index * 6));
    });
  }

  // Add custom fields section from modal structures
  let customFieldsY = footerY + (invoice.notes ? 50 : 20);
  if (invoice.customFields && Object.keys(invoice.customFields).length > 0) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('Additional Information:', 20, customFieldsY);
    customFieldsY += 8;

    pdf.setFont('helvetica', 'normal');
    Object.entries(invoice.customFields).forEach(([key, value]) => {
      if (value && value !== '') {
        // Convert camelCase or field IDs to readable labels
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        pdf.text(`${label}: ${value}`, 20, customFieldsY);
        customFieldsY += 6;
      }
    });
  }

  // Add branded footer (external document)
  addBrandedPDFFooter(pdf, true);

  return pdf;
};

export const downloadInvoicePDF = async (invoice: Invoice, printable: boolean = false) => {
  const pdf = await generateInvoicePDF(invoice, printable);
  const filename = printable
    ? `FFR-Invoice-${invoice.invoiceNumber}-Print.pdf`
    : `FFR-Invoice-${invoice.invoiceNumber}.pdf`;
  pdf.save(filename);
};

export const emailInvoicePDF = async (invoice: Invoice) => {
  const pdf = await generateInvoicePDF(invoice);
  const pdfBlob = pdf.output('blob');

  // In a real application, you would integrate with an email service
  // For now, we'll just download the PDF
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `FFR-Invoice-${invoice.invoiceNumber}.pdf`;
  link.click();
  URL.revokeObjectURL(url);

  // Show success message or integrate with email service
  alert(`Invoice ${invoice.invoiceNumber} PDF generated. In a production environment, this would be sent via email.`);
};