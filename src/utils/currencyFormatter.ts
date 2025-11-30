/**
 * Utility for consistent currency formatting throughout the application
 */

/**
 * Formats a number as currency with consistent 2 decimal places
 * @param amount - The numeric amount to format
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export const formatCurrency = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '$0.00';
  }

  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Formats a number as currency without the dollar sign
 * @param amount - The numeric amount to format
 * @returns Formatted number string (e.g., "1,234.56")
 */
export const formatAmount = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0.00';
  }

  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

/**
 * Parses a currency string back to a number
 * @param currencyString - Currency string to parse
 * @returns Parsed number
 */
export const parseCurrency = (currencyString: string): number => {
  if (!currencyString) return 0;

  // Remove dollar sign, commas, and any other non-numeric characters except decimal point
  const cleaned = currencyString.replace(/[$,]/g, '');
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? 0 : parsed;
};