import { Customer, Lead, Opportunity } from '../types/crm';

export interface AccountingCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  accountsReceivableId: string;
  creditLimit?: number;
  paymentTerms: string;
  taxId?: string;
  createdDate: string;
  lastInvoiceDate?: string;
  totalInvoiced: number;
  outstandingBalance: number;
}

export interface Invoice {
  id: string;
  customerId: string;
  opportunityId?: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  accountCode: string;
}

export class CRMIntegrationService {

  /**
   * Convert a CRM Lead to an Accounting Customer
   */
  static convertLeadToCustomer(lead: Lead): AccountingCustomer {
    const customerId = `CUST-${Date.now()}`;
    const accountsReceivableId = this.generateAccountsReceivableId(customerId);

    return {
      id: customerId,
      name: lead.companyName || `${lead.firstName} ${lead.lastName}`,
      email: lead.email,
      phone: lead.phone,
      address: {
        street: lead.address.street,
        city: lead.address.city,
        state: lead.address.state,
        zipCode: lead.address.zipCode
      },
      accountsReceivableId,
      paymentTerms: this.getDefaultPaymentTerms(lead.propertyType),
      createdDate: new Date().toISOString(),
      totalInvoiced: 0,
      outstandingBalance: 0
    };
  }

  /**
   * Convert a CRM Customer to Accounting Customer
   */
  static convertCRMToAccountingCustomer(customer: Customer): AccountingCustomer {
    const accountsReceivableId = this.generateAccountsReceivableId(customer.id);

    return {
      id: customer.id,
      name: customer.companyName || `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      phone: customer.phone,
      address: {
        street: customer.address.street,
        city: customer.address.city,
        state: customer.address.state,
        zipCode: customer.address.zipCode
      },
      accountsReceivableId,
      paymentTerms: customer.paymentTerms || this.getDefaultPaymentTerms(customer.propertyType),
      createdDate: customer.dateAdded,
      totalInvoiced: 0,
      outstandingBalance: 0
    };
  }

  /**
   * Generate an invoice from an opportunity
   */
  static generateInvoiceFromOpportunity(opportunity: Opportunity, customer: AccountingCustomer): Invoice {
    const invoiceNumber = this.generateInvoiceNumber();
    const dueDate = this.calculateDueDate(customer.paymentTerms);

    const items: InvoiceItem[] = this.createInvoiceItemsFromOpportunity(opportunity);
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = this.calculateTax(subtotal, customer.address.state);
    const total = subtotal + taxAmount;

    return {
      id: `INV-${Date.now()}`,
      customerId: customer.id,
      opportunityId: opportunity.id,
      invoiceNumber,
      date: new Date().toISOString(),
      dueDate,
      items,
      subtotal,
      taxAmount,
      total,
      status: 'Draft',
      notes: `Generated from opportunity: ${opportunity.name}`
    };
  }

  /**
   * Create invoice items based on opportunity details
   */
  private static createInvoiceItemsFromOpportunity(opportunity: Opportunity): InvoiceItem[] {
    const items: InvoiceItem[] = [];

    // Main roofing work item
    const mainItem: InvoiceItem = {
      id: `ITEM-${Date.now()}-1`,
      description: this.getServiceDescription(opportunity),
      quantity: opportunity.squareFootage || 1,
      unitPrice: this.calculateUnitPrice(opportunity),
      total: opportunity.estimatedValue,
      accountCode: this.getRevenueAccountCode(opportunity.roofingMaterial)
    };

    items.push(mainItem);

    // Add permit fees if applicable
    if (opportunity.projectType === 'New Installation' || opportunity.projectType === 'Re-roof') {
      items.push({
        id: `ITEM-${Date.now()}-2`,
        description: 'Building Permit and Inspection Fees',
        quantity: 1,
        unitPrice: 150,
        total: 150,
        accountCode: '6100' // Permit and License Expense
      });
    }

    // Add disposal fees for re-roofing
    if (opportunity.projectType === 'Re-roof') {
      const disposalFee = (opportunity.squareFootage || 2000) * 0.50;
      items.push({
        id: `ITEM-${Date.now()}-3`,
        description: 'Old Roofing Material Disposal',
        quantity: 1,
        unitPrice: disposalFee,
        total: disposalFee,
        accountCode: '6200' // Subcontractor Expense
      });
    }

    return items;
  }

  /**
   * Get service description based on opportunity
   */
  private static getServiceDescription(opportunity: Opportunity): string {
    const material = opportunity.roofingMaterial;
    const type = opportunity.projectType;
    const sqft = opportunity.squareFootage ? ` - ${opportunity.squareFootage} sq ft` : '';

    return `${type} - ${material} Roofing${sqft}`;
  }

  /**
   * Calculate unit price from opportunity
   */
  private static calculateUnitPrice(opportunity: Opportunity): number {
    if (opportunity.squareFootage && opportunity.squareFootage > 0) {
      return Math.round((opportunity.estimatedValue / opportunity.squareFootage) * 100) / 100;
    }
    return opportunity.estimatedValue;
  }

  /**
   * Get revenue account code based on roofing material
   */
  private static getRevenueAccountCode(material: string): string {
    const accountCodes = {
      'Shingle': '4090', // Shingle Roofing Revenue
      'Metal': '4091',   // Metal Roofing Revenue
      'TPO': '4092',     // TPO Roofing Revenue
      'Tile': '4093',    // Tile Roofing Revenue
      'Modified Bitumen': '4094' // Modified Bitumen Revenue
    };

    return accountCodes[material as keyof typeof accountCodes] || '4000'; // General Revenue
  }

  /**
   * Generate accounts receivable account ID
   */
  private static generateAccountsReceivableId(customerId: string): string {
    return `1200-${customerId}`;
  }

  /**
   * Get default payment terms based on property type
   */
  private static getDefaultPaymentTerms(propertyType: string): string {
    return propertyType === 'Commercial' ? 'Net 15' : 'Net 30';
  }

  /**
   * Generate invoice number
   */
  private static generateInvoiceNumber(): string {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-6);
    return `FFR-${year}${month}-${timestamp}`;
  }

  /**
   * Calculate due date based on payment terms
   */
  private static calculateDueDate(paymentTerms: string): string {
    const today = new Date();
    let days = 30; // Default

    if (paymentTerms.includes('15')) days = 15;
    else if (paymentTerms.includes('30')) days = 30;
    else if (paymentTerms.includes('45')) days = 45;
    else if (paymentTerms.includes('60')) days = 60;

    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + days);

    return dueDate.toISOString();
  }

  /**
   * Calculate tax amount (Florida sales tax)
   */
  private static calculateTax(subtotal: number, state: string): number {
    // Florida sales tax rates (simplified - actual rates vary by county)
    const taxRates = {
      'FL': 0.06, // 6% base rate
      'Florida': 0.06
    };

    const rate = taxRates[state as keyof typeof taxRates] || 0;
    return Math.round(subtotal * rate * 100) / 100;
  }

  /**
   * Sync CRM customer data with accounting records
   */
  static syncCustomerData(crmCustomer: Customer, accountingCustomer: AccountingCustomer): Customer {
    return {
      ...crmCustomer,
      // Update CRM with accounting-specific data
      paymentTerms: accountingCustomer.paymentTerms,
      creditRating: this.determineCreditRating(accountingCustomer),
      notes: `${crmCustomer.notes}\n\nAccounting Integration:\n- AR Account: ${accountingCustomer.accountsReceivableId}\n- Total Invoiced: $${accountingCustomer.totalInvoiced.toLocaleString()}\n- Outstanding: $${accountingCustomer.outstandingBalance.toLocaleString()}`
    };
  }

  /**
   * Determine credit rating based on accounting history
   */
  private static determineCreditRating(accountingCustomer: AccountingCustomer): 'Excellent' | 'Good' | 'Fair' | 'Poor' {
    const { totalInvoiced, outstandingBalance } = accountingCustomer;

    if (totalInvoiced === 0) return 'Good'; // New customer

    const balanceRatio = outstandingBalance / totalInvoiced;

    if (balanceRatio === 0) return 'Excellent'; // Pays on time
    if (balanceRatio < 0.1) return 'Good';      // Less than 10% outstanding
    if (balanceRatio < 0.25) return 'Fair';     // Less than 25% outstanding
    return 'Poor';                              // High outstanding balance
  }

  /**
   * Generate accounting entries for CRM activities
   */
  static generateAccountingEntries(opportunity: Opportunity, invoice: Invoice) {
    const entries = [];

    // When opportunity is won - create accounts receivable
    if (opportunity.stage === 'Closed Won') {
      entries.push({
        date: new Date().toISOString(),
        description: `Invoice ${invoice.invoiceNumber} - ${opportunity.name}`,
        entries: [
          {
            account: '1200', // Accounts Receivable
            debit: invoice.total,
            credit: 0
          },
          {
            account: this.getRevenueAccountCode(opportunity.roofingMaterial),
            debit: 0,
            credit: invoice.subtotal
          },
          {
            account: '2300', // Sales Tax Payable
            debit: 0,
            credit: invoice.taxAmount
          }
        ]
      });
    }

    return entries;
  }

  /**
   * Update opportunity probability based on accounting history
   */
  static updateOpportunityProbability(opportunity: Opportunity, customerHistory: AccountingCustomer): number {
    let probability = opportunity.probability;

    // Adjust based on customer payment history
    if (customerHistory.outstandingBalance === 0) {
      probability = Math.min(100, probability + 10); // Increase for good payers
    } else if (customerHistory.outstandingBalance > customerHistory.totalInvoiced * 0.3) {
      probability = Math.max(0, probability - 20); // Decrease for poor payers
    }

    // Adjust based on customer relationship length
    const accountAge = new Date().getTime() - new Date(customerHistory.createdDate).getTime();
    const daysOld = accountAge / (1000 * 60 * 60 * 24);

    if (daysOld > 365) {
      probability = Math.min(100, probability + 5); // Long-term customers more likely
    }

    return probability;
  }
}

// Export types and service
export default CRMIntegrationService;