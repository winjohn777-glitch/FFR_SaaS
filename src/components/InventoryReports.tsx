import jsPDF from 'jspdf';
import { addBrandedPDFHeader, addBrandedPDFFooter } from '../utils/PDFBrandedHeader';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'Metal' | 'Shingles' | 'TPO' | 'Tile' | 'Modified Bitumen' | 'Underlayment' | 'Flashing' | 'Fasteners' | 'Tools' | 'Safety' | 'Other';
  description: string;
  currentStock: number;
  reorderPoint: number;
  reorderQuantity: number;
  unit: string;
  unitCost: number;
  supplier: string;
  supplierSku: string;
  location: string;
  lastOrderDate: string;
  lastStockUpdate: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'On Order';
}

export const generateStockReport = async (
  inventoryItems: InventoryItem[],
  printable: boolean = false,
  forExternalUse: boolean = false
) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Add branded FFR header with gradient and logo
  const contentStartY = await addBrandedPDFHeader(pdf, {
    documentType: 'REPORT',
    showLogo: true,
    showContactInfo: true,
    printable
  });

  // Report Header
  let currentY = contentStartY + 5;
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INVENTORY STOCK REPORT', 20, currentY);

  currentY += 10;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, currentY);
  currentY += 7;
  pdf.text(`Total Items: ${inventoryItems.length}`, 20, currentY);

  // Summary Statistics
  const inStockItems = inventoryItems.filter(item => item.status === 'In Stock').length;
  const lowStockItems = inventoryItems.filter(item => item.status === 'Low Stock').length;
  const outOfStockItems = inventoryItems.filter(item => item.status === 'Out of Stock').length;
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0);

  currentY += 7;
  pdf.text(`In Stock: ${inStockItems} | Low Stock: ${lowStockItems} | Out of Stock: ${outOfStockItems}`, 20, currentY);
  currentY += 7;
  pdf.text(`Total Inventory Value: $${totalValue.toLocaleString()}`, 20, currentY);

  // Table Headers
  currentY += 14;
  const tableStartY = currentY;
  const tableHeaders = ['SKU', 'Item Name', 'Category', 'Stock', 'Status', 'Value'];
  const columnWidths = [25, 50, 25, 20, 25, 25];
  const columnX = [20, 45, 95, 120, 140, 165];

  // Table Header
  pdf.setFillColor(248, 249, 250);
  pdf.rect(20, tableStartY, 170, 10, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  tableHeaders.forEach((header, index) => {
    const align = index === 1 ? 'left' : 'center';
    const x = index === 1 ? columnX[index] + 2 : columnX[index] + columnWidths[index] / 2;
    pdf.text(header, x, tableStartY + 7, { align });
  });

  // Table Rows
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  let tableCurrentY = tableStartY + 10;

  inventoryItems.forEach((item, index) => {
    if (tableCurrentY > pageHeight - 30) {
      pdf.addPage();
      tableCurrentY = 20;
    }

    const rowHeight = 8;

    // Alternate row background
    if (index % 2 === 0) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(20, tableCurrentY, 170, rowHeight, 'F');
    }

    // Set text color based on status
    if (item.status === 'Out of Stock') {
      pdf.setTextColor(220, 53, 69);
    } else if (item.status === 'Low Stock') {
      pdf.setTextColor(255, 193, 7);
    } else {
      pdf.setTextColor(0, 0, 0);
    }

    // SKU
    pdf.text(item.sku, columnX[0] + columnWidths[0] / 2, tableCurrentY + 5, { align: 'center' });

    // Item Name (left aligned, truncated if too long)
    const itemName = item.name.length > 25 ? item.name.substring(0, 22) + '...' : item.name;
    pdf.text(itemName, columnX[1] + 2, tableCurrentY + 5);

    // Category
    pdf.text(item.category, columnX[2] + columnWidths[2] / 2, tableCurrentY + 5, { align: 'center' });

    // Stock
    pdf.text(`${item.currentStock} ${item.unit}`, columnX[3] + columnWidths[3] / 2, tableCurrentY + 5, { align: 'center' });

    // Status
    pdf.text(item.status, columnX[4] + columnWidths[4] / 2, tableCurrentY + 5, { align: 'center' });

    // Value
    const itemValue = item.currentStock * item.unitCost;
    pdf.text(`$${itemValue.toFixed(0)}`, columnX[5] + columnWidths[5] / 2, tableCurrentY + 5, { align: 'center' });

    tableCurrentY += rowHeight;
  });

  // Reset text color
  pdf.setTextColor(0, 0, 0);

  // Add footer based on intended use
  addBrandedPDFFooter(pdf, forExternalUse);

  return pdf;
};

export const generateReorderReport = async (inventoryItems: InventoryItem[], printable: boolean = false) => {
  const reorderItems = inventoryItems.filter(item => item.currentStock <= item.reorderPoint);

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Add branded FFR header with gradient and logo
  const contentStartY = await addBrandedPDFHeader(pdf, {
    documentType: 'REPORT',
    showLogo: true,
    showContactInfo: true,
    printable
  });

  // Report Header
  let currentY = contentStartY + 5;
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('REORDER REPORT', 20, currentY);

  currentY += 10;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, currentY);
  currentY += 7;
  pdf.text(`Items Needing Reorder: ${reorderItems.length}`, 20, currentY);

  if (reorderItems.length === 0) {
    currentY += 23;
    pdf.setFontSize(14);
    pdf.text('All items are adequately stocked!', 20, currentY);
    // No footer for internal reorder reports
    // addBrandedPDFFooter(pdf, false);
    return pdf;
  }

  // Table Headers
  currentY += 18;
  const tableStartY = currentY;
  const tableHeaders = ['SKU', 'Item Name', 'Current', 'Reorder Point', 'Order Qty', 'Supplier'];
  const columnWidths = [25, 50, 20, 25, 20, 30];
  const columnX = [20, 45, 95, 115, 140, 160];

  // Table Header
  pdf.setFillColor(248, 249, 250);
  pdf.rect(20, tableStartY, 170, 10, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  tableHeaders.forEach((header, index) => {
    const align = index === 1 ? 'left' : 'center';
    const x = index === 1 ? columnX[index] + 2 : columnX[index] + columnWidths[index] / 2;
    pdf.text(header, x, tableStartY + 7, { align });
  });

  // Table Rows
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  let tableCurrentY = tableStartY + 10;

  reorderItems.forEach((item, index) => {
    if (tableCurrentY > pageHeight - 40) {
      pdf.addPage();
      tableCurrentY = 20;
    }

    const rowHeight = 10;

    // Alternate row background
    if (index % 2 === 0) {
      pdf.setFillColor(250, 250, 250);
      pdf.rect(20, tableCurrentY, 170, rowHeight, 'F');
    }

    // Highlight urgent items (out of stock) in red
    if (item.currentStock === 0) {
      pdf.setTextColor(220, 53, 69);
      pdf.setFont('helvetica', 'bold');
    } else {
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');
    }

    // SKU
    pdf.text(item.sku, columnX[0] + columnWidths[0] / 2, tableCurrentY + 6, { align: 'center' });

    // Item Name
    const itemName = item.name.length > 25 ? item.name.substring(0, 22) + '...' : item.name;
    pdf.text(itemName, columnX[1] + 2, tableCurrentY + 6);

    // Current Stock
    pdf.text(`${item.currentStock}`, columnX[2] + columnWidths[2] / 2, tableCurrentY + 6, { align: 'center' });

    // Reorder Point
    pdf.text(`${item.reorderPoint}`, columnX[3] + columnWidths[3] / 2, tableCurrentY + 6, { align: 'center' });

    // Order Quantity
    pdf.text(`${item.reorderQuantity}`, columnX[4] + columnWidths[4] / 2, tableCurrentY + 6, { align: 'center' });

    // Supplier
    const supplier = item.supplier.length > 15 ? item.supplier.substring(0, 12) + '...' : item.supplier;
    pdf.text(supplier, columnX[5] + columnWidths[5] / 2, tableCurrentY + 6, { align: 'center' });

    // Add supplier SKU below
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(100, 100, 100);
    pdf.text(item.supplierSku, columnX[5] + columnWidths[5] / 2, tableCurrentY + 9, { align: 'center' });

    tableCurrentY += rowHeight;
  });

  // Summary
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  tableCurrentY += 10;
  pdf.text('SUMMARY:', 20, tableCurrentY);

  pdf.setFont('helvetica', 'normal');
  tableCurrentY += 8;
  const urgentItems = reorderItems.filter(item => item.currentStock === 0).length;
  const lowStockItems = reorderItems.filter(item => item.currentStock > 0).length;

  pdf.text(`• Urgent (Out of Stock): ${urgentItems} items`, 25, tableCurrentY);
  tableCurrentY += 6;
  pdf.text(`• Low Stock: ${lowStockItems} items`, 25, tableCurrentY);
  tableCurrentY += 6;

  const totalReorderValue = reorderItems.reduce((sum, item) =>
    sum + (item.reorderQuantity * item.unitCost), 0
  );
  pdf.text(`• Estimated Reorder Cost: $${totalReorderValue.toLocaleString()}`, 25, tableCurrentY);

  // No footer for internal reorder reports
  // addBrandedPDFFooter(pdf, false);

  return pdf;
};

export const generateLowStockAlert = (inventoryItems: InventoryItem[]) => {
  const lowStockItems = inventoryItems.filter(item =>
    item.currentStock <= item.reorderPoint && item.currentStock > 0
  );
  const outOfStockItems = inventoryItems.filter(item => item.currentStock === 0);

  return {
    lowStockItems,
    outOfStockItems,
    totalAlertsCount: lowStockItems.length + outOfStockItems.length,
    hasUrgentItems: outOfStockItems.length > 0
  };
};

export const downloadStockReport = async (
  inventoryItems: InventoryItem[],
  forExternalUse: boolean = false
) => {
  const pdf = await generateStockReport(inventoryItems, false, forExternalUse);
  const suffix = forExternalUse ? '-External' : '-Internal';
  pdf.save(`FFR-Stock-Report-${new Date().toISOString().split('T')[0]}${suffix}.pdf`);
};

export const downloadReorderReport = async (inventoryItems: InventoryItem[]) => {
  const pdf = await generateReorderReport(inventoryItems);
  pdf.save(`FFR-Reorder-Report-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const generateCategoryReport = async (inventoryItems: InventoryItem[], category: string, printable: boolean = false) => {
  const categoryItems = inventoryItems.filter(item =>
    category === 'All' || item.category === category
  );

  const pdf = new jsPDF('p', 'mm', 'a4');

  // Add branded FFR header with gradient and logo
  const contentStartY = await addBrandedPDFHeader(pdf, {
    documentType: 'REPORT',
    showLogo: true,
    showContactInfo: true,
    printable
  });

  // Report Header
  let currentY = contentStartY + 5;
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${category.toUpperCase()} INVENTORY REPORT`, 20, currentY);

  currentY += 10;
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, currentY);
  currentY += 7;
  pdf.text(`Items in Category: ${categoryItems.length}`, 20, currentY);

  const categoryValue = categoryItems.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0);
  currentY += 7;
  pdf.text(`Category Value: $${categoryValue.toLocaleString()}`, 20, currentY);

  // No footer for internal category reports
  // addBrandedPDFFooter(pdf, false);

  return pdf;
};