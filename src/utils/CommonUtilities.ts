/**
 * COMMON UTILITIES - SINGLE SOURCE OF TRUTH
 * Consolidated utility functions to eliminate duplicates across the application
 */

/**
 * Format a date to a readable string
 * @param dateInput - Date object, string, or null
 * @param includeTime - Whether to include time in the output
 * @returns Formatted date string
 */
export const formatDate = (dateInput: Date | string | null, includeTime: boolean = false): string => {
  if (!dateInput) return 'N/A';

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'Invalid Date';

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
};

/**
 * Format a number as currency (USD)
 * @param amount - Number to format
 * @param showCents - Whether to show cents (default: true)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number | null | undefined, showCents: boolean = true): string => {
  if (amount === null || amount === undefined || isNaN(amount)) return '$0.00';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0
  }).format(amount);
};

/**
 * Calculate total amount from an array of numbers
 * @param amounts - Array of numbers to sum
 * @returns Total sum
 */
export const calculateTotal = (amounts: (number | null | undefined)[]): number => {
  return amounts.reduce((total: number, amount) => {
    const num = Number(amount) || 0;
    return total + num;
  }, 0);
};

/**
 * Download data as CSV file
 * @param data - Array of objects to export
 * @param filename - Name of the file (without .csv extension)
 * @param headers - Optional custom headers
 */
export const downloadCSV = (
  data: any[],
  filename: string,
  headers?: string[]
): void => {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Generate headers from first object keys if not provided
  const csvHeaders = headers || Object.keys(data[0]);

  // Convert data to CSV format
  const csvContent = [
    csvHeaders.join(','), // Header row
    ...data.map(row =>
      csvHeaders.map(header => {
        const value = row[header];
        // Escape values that contain commas, quotes, or newlines
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

/**
 * Generate a report and download as PDF
 * @param reportData - Data to include in the report
 * @param reportTitle - Title of the report
 * @param reportType - Type of report for formatting
 */
export const handleGenerateReport = (
  reportData: any[],
  reportTitle: string,
  reportType: 'financial' | 'project' | 'hr' | 'inventory' = 'financial'
): void => {
  // This is a consolidated function that would integrate with the PDF generator
  console.log(`Generating ${reportType} report: ${reportTitle}`, reportData);

  // For now, download as CSV. In production, this would generate a proper PDF
  downloadCSV(reportData, `${reportTitle.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}`);
};

/**
 * Clear all filters in a form or data view
 * @param setters - Object containing all the state setters to clear
 */
export const clearFilters = (setters: Record<string, (value: any) => void>): void => {
  Object.values(setters).forEach(setter => {
    setter(''); // Clear each filter
  });
};

/**
 * Handle form input changes with proper typing
 * @param setter - State setter function
 * @param value - Value to set (from event or direct value)
 */
export const handleInputChange = (
  setter: (value: string) => void,
  value: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
): void => {
  if (typeof value === 'string') {
    setter(value);
  } else {
    setter(value.target.value);
  }
};

/**
 * Generic save handler for modal forms
 * @param data - Data to save
 * @param onSave - Callback function to handle the save
 * @param onClose - Callback to close the modal
 */
export const handleSave = (
  data: any,
  onSave: (data: any) => void,
  onClose: () => void
): void => {
  try {
    onSave(data);
    onClose();
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

/**
 * Generic submit handler for forms
 * @param event - Form event
 * @param data - Form data to submit
 * @param onSubmit - Callback function to handle submission
 * @param onSuccess - Optional success callback
 */
export const handleSubmit = (
  event: React.FormEvent,
  data: any,
  onSubmit: (data: any) => void,
  onSuccess?: () => void
): void => {
  event.preventDefault();

  try {
    onSubmit(data);
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};

/**
 * Escape key handler for modals
 * @param event - Keyboard event
 * @param onClose - Function to call when escape is pressed
 */
export const handleEscape = (
  event: KeyboardEvent,
  onClose: () => void
): void => {
  if (event.key === 'Escape') {
    onClose();
  }
};

/**
 * Backdrop click handler for modals
 * @param event - Mouse event
 * @param onClose - Function to call when backdrop is clicked
 */
export const handleBackdropClick = (
  event: React.MouseEvent,
  onClose: () => void
): void => {
  if (event.target === event.currentTarget) {
    onClose();
  }
};

/**
 * Generate low stock alert for inventory
 * @param items - Inventory items to check
 * @param threshold - Low stock threshold
 * @returns Array of low stock items
 */
export const generateLowStockAlert = (
  items: Array<{ name: string; currentStock: number; minStock: number }>,
  threshold?: number
): Array<{ name: string; currentStock: number; minStock: number }> => {
  return items.filter(item => {
    const alertThreshold = threshold || item.minStock || 10;
    return item.currentStock <= alertThreshold;
  });
};

/**
 * Generate stock report data
 * @param items - Inventory items
 * @returns Formatted stock report data
 */
export const generateStockReport = (items: any[]): any[] => {
  return items.map(item => ({
    'Item Name': item.name,
    'Current Stock': item.currentStock,
    'Minimum Stock': item.minStock,
    'Value': formatCurrency(item.currentStock * item.unitPrice),
    'Status': item.currentStock <= item.minStock ? 'Low Stock' : 'In Stock'
  }));
};

/**
 * Generate reorder report data
 * @param items - Inventory items
 * @returns Items that need reordering
 */
export const generateReorderReport = (items: any[]): any[] => {
  return items
    .filter(item => item.currentStock <= item.minStock)
    .map(item => ({
      'Item Name': item.name,
      'Current Stock': item.currentStock,
      'Minimum Stock': item.minStock,
      'Suggested Reorder': item.reorderQuantity || item.minStock * 2,
      'Supplier': item.supplier || 'N/A',
      'Last Ordered': formatDate(item.lastOrdered)
    }));
};

/**
 * Generate invoice PDF data
 * @param invoiceData - Invoice information
 * @returns Formatted invoice data for PDF generation
 */
export const generateInvoicePDF = (invoiceData: any): any => {
  // This would integrate with the PDF generation system
  console.log('Generating invoice PDF:', invoiceData);
  return {
    ...invoiceData,
    formattedTotal: formatCurrency(invoiceData.total),
    formattedDate: formatDate(invoiceData.date),
    lineItems: invoiceData.lineItems?.map((item: any) => ({
      ...item,
      formattedAmount: formatCurrency(item.amount)
    }))
  };
};