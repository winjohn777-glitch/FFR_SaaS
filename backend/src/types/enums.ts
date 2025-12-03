// Enum definitions for accounting system
// These provide type safety and validation for string fields in SQLite

export enum FiscalYearStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  LOCKED = "LOCKED"
}

export enum FiscalPeriodStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  LOCKED = "LOCKED"
}

export enum AccountType {
  ASSET = "ASSET",
  LIABILITY = "LIABILITY",
  EQUITY = "EQUITY",
  REVENUE = "REVENUE",
  EXPENSE = "EXPENSE"
}

export enum NormalBalance {
  DEBIT = "DEBIT",
  CREDIT = "CREDIT"
}

export enum ContactType {
  CUSTOMER = "CUSTOMER",
  VENDOR = "VENDOR",
  EMPLOYEE = "EMPLOYEE",
  OTHER = "OTHER"
}

export enum JournalSourceModule {
  MANUAL = "MANUAL",
  ACCOUNTS_PAYABLE = "ACCOUNTS_PAYABLE",
  ACCOUNTS_RECEIVABLE = "ACCOUNTS_RECEIVABLE",
  PAYROLL = "PAYROLL",
  INVENTORY = "INVENTORY",
  BANK_RECONCILIATION = "BANK_RECONCILIATION",
  QUICK_ENTRY = "QUICK_ENTRY"
}

export enum JournalStatus {
  DRAFT = "DRAFT",
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED = "APPROVED",
  POSTED = "POSTED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED"
}

export enum InvoiceStatus {
  DRAFT = "DRAFT",
  SENT = "SENT",
  OVERDUE = "OVERDUE",
  PAID = "PAID",
  CANCELLED = "CANCELLED"
}

export enum BillStatus {
  DRAFT = "DRAFT",
  RECEIVED = "RECEIVED",
  APPROVED = "APPROVED",
  PAID = "PAID",
  CANCELLED = "CANCELLED"
}

export enum PaymentMethod {
  CASH = "CASH",
  CHECK = "CHECK",
  CREDIT_CARD = "CREDIT_CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
  ACH = "ACH",
  OTHER = "OTHER"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  CLEARED = "CLEARED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED"
}

export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE"
}

// Validation functions
export function isValidAccountType(value: string): value is AccountType {
  return Object.values(AccountType).includes(value as AccountType);
}

export function isValidJournalStatus(value: string): value is JournalStatus {
  return Object.values(JournalStatus).includes(value as JournalStatus);
}

export function isValidPaymentMethod(value: string): value is PaymentMethod {
  return Object.values(PaymentMethod).includes(value as PaymentMethod);
}

// Default values
export const DEFAULT_VALUES = {
  FISCAL_YEAR_STATUS: FiscalYearStatus.OPEN,
  FISCAL_PERIOD_STATUS: FiscalPeriodStatus.OPEN,
  JOURNAL_STATUS: JournalStatus.DRAFT,
  INVOICE_STATUS: InvoiceStatus.DRAFT,
  BILL_STATUS: BillStatus.DRAFT,
  PAYMENT_STATUS: PaymentStatus.PENDING,
  CONTACT_TYPE: ContactType.CUSTOMER,
  JOURNAL_SOURCE_MODULE: JournalSourceModule.MANUAL
} as const;