
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.OrganizationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  address: 'address',
  phone: 'phone',
  email: 'email',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  passwordHash: 'passwordHash',
  firstName: 'firstName',
  lastName: 'lastName',
  role: 'role',
  isActive: 'isActive',
  lastLogin: 'lastLogin',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  organizationId: 'organizationId'
};

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  type: 'type',
  category: 'category',
  description: 'description',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  organizationId: 'organizationId'
};

exports.Prisma.JournalEntryScalarFieldEnum = {
  id: 'id',
  number: 'number',
  date: 'date',
  description: 'description',
  reference: 'reference',
  status: 'status',
  isPosted: 'isPosted',
  sourceModule: 'sourceModule',
  quickEntryTemplate: 'quickEntryTemplate',
  totalDebit: 'totalDebit',
  totalCredit: 'totalCredit',
  notes: 'notes',
  reversedByEntryId: 'reversedByEntryId',
  originalEntryId: 'originalEntryId',
  isReversing: 'isReversing',
  isRecurring: 'isRecurring',
  recurringFrequency: 'recurringFrequency',
  recurringEndDate: 'recurringEndDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  approvedAt: 'approvedAt',
  postedAt: 'postedAt',
  organizationId: 'organizationId',
  fiscalPeriodId: 'fiscalPeriodId',
  createdById: 'createdById',
  approvedByUserId: 'approvedByUserId',
  postedByUserId: 'postedByUserId'
};

exports.Prisma.JournalEntryLineScalarFieldEnum = {
  id: 'id',
  debit: 'debit',
  credit: 'credit',
  memo: 'memo',
  reference: 'reference',
  lineNumber: 'lineNumber',
  journalEntryId: 'journalEntryId',
  accountId: 'accountId',
  contactId: 'contactId',
  projectId: 'projectId'
};

exports.Prisma.CustomerScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  phone: 'phone',
  address: 'address',
  city: 'city',
  state: 'state',
  zip: 'zip',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  organizationId: 'organizationId'
};

exports.Prisma.LeadScalarFieldEnum = {
  id: 'id',
  source: 'source',
  status: 'status',
  notes: 'notes',
  value: 'value',
  probability: 'probability',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  customerId: 'customerId'
};

exports.Prisma.OpportunityScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  status: 'status',
  value: 'value',
  probability: 'probability',
  expectedDate: 'expectedDate',
  closedDate: 'closedDate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  customerId: 'customerId',
  leadId: 'leadId'
};

exports.Prisma.ProjectScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  status: 'status',
  startDate: 'startDate',
  endDate: 'endDate',
  budget: 'budget',
  actualCost: 'actualCost',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  organizationId: 'organizationId',
  customerId: 'customerId',
  opportunityId: 'opportunityId'
};

exports.Prisma.ProjectTaskScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  status: 'status',
  startDate: 'startDate',
  endDate: 'endDate',
  estimatedHours: 'estimatedHours',
  actualHours: 'actualHours',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  projectId: 'projectId'
};

exports.Prisma.InventoryItemScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  sku: 'sku',
  category: 'category',
  unit: 'unit',
  cost: 'cost',
  price: 'price',
  quantity: 'quantity',
  minQuantity: 'minQuantity',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  organizationId: 'organizationId'
};

exports.Prisma.InvoiceScalarFieldEnum = {
  id: 'id',
  number: 'number',
  date: 'date',
  dueDate: 'dueDate',
  status: 'status',
  subtotal: 'subtotal',
  tax: 'tax',
  total: 'total',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  organizationId: 'organizationId',
  customerId: 'customerId',
  projectId: 'projectId',
  createdById: 'createdById'
};

exports.Prisma.InvoiceItemScalarFieldEnum = {
  id: 'id',
  description: 'description',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  total: 'total',
  invoiceId: 'invoiceId',
  inventoryItemId: 'inventoryItemId'
};

exports.Prisma.BillScalarFieldEnum = {
  id: 'id',
  number: 'number',
  vendorName: 'vendorName',
  date: 'date',
  dueDate: 'dueDate',
  status: 'status',
  subtotal: 'subtotal',
  tax: 'tax',
  total: 'total',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  organizationId: 'organizationId',
  createdById: 'createdById'
};

exports.Prisma.BillItemScalarFieldEnum = {
  id: 'id',
  description: 'description',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  total: 'total',
  billId: 'billId',
  inventoryItemId: 'inventoryItemId'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  amount: 'amount',
  date: 'date',
  method: 'method',
  reference: 'reference',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  createdById: 'createdById',
  invoiceId: 'invoiceId',
  billId: 'billId'
};

exports.Prisma.EmployeeScalarFieldEnum = {
  id: 'id',
  employeeId: 'employeeId',
  firstName: 'firstName',
  lastName: 'lastName',
  role: 'role',
  department: 'department',
  email: 'email',
  phone: 'phone',
  address: 'address',
  hireDate: 'hireDate',
  status: 'status',
  payRate: 'payRate',
  hoursThisWeek: 'hoursThisWeek',
  overtime: 'overtime',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  organizationId: 'organizationId'
};

exports.Prisma.CertificationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  issueDate: 'issueDate',
  expirationDate: 'expirationDate',
  status: 'status',
  certificateNumber: 'certificateNumber',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  employeeId: 'employeeId'
};

exports.Prisma.FiscalPeriodScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  startDate: 'startDate',
  endDate: 'endDate',
  isActive: 'isActive',
  isClosed: 'isClosed',
  closedAt: 'closedAt',
  closedById: 'closedById',
  year: 'year',
  period: 'period',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  organizationId: 'organizationId'
};

exports.Prisma.ContactScalarFieldEnum = {
  id: 'id',
  name: 'name',
  type: 'type',
  email: 'email',
  phone: 'phone',
  address: 'address',
  city: 'city',
  state: 'state',
  zip: 'zip',
  taxId: 'taxId',
  isActive: 'isActive',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  organizationId: 'organizationId'
};

exports.Prisma.SopCategoryScalarFieldEnum = {
  id: 'id',
  code: 'code',
  name: 'name',
  description: 'description',
  parentId: 'parentId',
  isActive: 'isActive',
  sortOrder: 'sortOrder',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SopProcedureScalarFieldEnum = {
  id: 'id',
  sopNumber: 'sopNumber',
  title: 'title',
  description: 'description',
  version: 'version',
  status: 'status',
  priority: 'priority',
  categoryId: 'categoryId',
  contentFilePath: 'contentFilePath',
  effectiveDate: 'effectiveDate',
  reviewDate: 'reviewDate',
  approvedById: 'approvedById',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SopFormScalarFieldEnum = {
  id: 'id',
  formNumber: 'formNumber',
  title: 'title',
  description: 'description',
  formType: 'formType',
  template: 'template',
  procedureId: 'procedureId',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SopManualScalarFieldEnum = {
  id: 'id',
  manualCode: 'manualCode',
  title: 'title',
  description: 'description',
  version: 'version',
  filePath: 'filePath',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SopAssignmentScalarFieldEnum = {
  id: 'id',
  procedureId: 'procedureId',
  employeeId: 'employeeId',
  projectId: 'projectId',
  dueDate: 'dueDate',
  status: 'status',
  assignedById: 'assignedById',
  completedAt: 'completedAt',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SopComplianceScalarFieldEnum = {
  id: 'id',
  procedureId: 'procedureId',
  employeeId: 'employeeId',
  projectId: 'projectId',
  complianceDate: 'complianceDate',
  status: 'status',
  verifiedById: 'verifiedById',
  notes: 'notes',
  evidence: 'evidence',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SopWorkflowScalarFieldEnum = {
  id: 'id',
  workflowId: 'workflowId',
  procedureId: 'procedureId',
  leadId: 'leadId',
  customerId: 'customerId',
  projectId: 'projectId',
  triggerType: 'triggerType',
  status: 'status',
  urgency: 'urgency',
  serviceType: 'serviceType',
  assignedTo: 'assignedTo',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SopWorkflowTaskScalarFieldEnum = {
  id: 'id',
  workflowId: 'workflowId',
  title: 'title',
  description: 'description',
  sequenceNumber: 'sequenceNumber',
  status: 'status',
  priority: 'priority',
  assignedTo: 'assignedTo',
  dueDate: 'dueDate',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  completionNotes: 'completionNotes',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SopWorkflowExecutionScalarFieldEnum = {
  id: 'id',
  workflowId: 'workflowId',
  executionNumber: 'executionNumber',
  status: 'status',
  startedAt: 'startedAt',
  completedAt: 'completedAt',
  result: 'result',
  errorMessage: 'errorMessage',
  createdAt: 'createdAt'
};

exports.Prisma.SopTrainingRequirementScalarFieldEnum = {
  id: 'id',
  procedureId: 'procedureId',
  roleRequired: 'roleRequired',
  departmentRequired: 'departmentRequired',
  frequencyDays: 'frequencyDays',
  isMandatory: 'isMandatory',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SopPerformanceMetricScalarFieldEnum = {
  id: 'id',
  procedureId: 'procedureId',
  metricDate: 'metricDate',
  executionCount: 'executionCount',
  completionRate: 'completionRate',
  avgCompletionTime: 'avgCompletionTime',
  complianceRate: 'complianceRate',
  createdAt: 'createdAt'
};

exports.Prisma.SopMobileSyncScalarFieldEnum = {
  id: 'id',
  deviceId: 'deviceId',
  userId: 'userId',
  lastSyncAt: 'lastSyncAt',
  syncStatus: 'syncStatus',
  syncedItems: 'syncedItems',
  pendingChanges: 'pendingChanges',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.HurricaneProcedureScalarFieldEnum = {
  id: 'id',
  procedureCode: 'procedureCode',
  title: 'title',
  category: 'category',
  priority: 'priority',
  description: 'description',
  steps: 'steps',
  requiredEquipment: 'requiredEquipment',
  safetyNotes: 'safetyNotes',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.HvhzComplianceProcedureScalarFieldEnum = {
  id: 'id',
  procedureCode: 'procedureCode',
  title: 'title',
  windZone: 'windZone',
  countyApplicable: 'countyApplicable',
  description: 'description',
  requirements: 'requirements',
  inspectionCriteria: 'inspectionCriteria',
  documentationNeeded: 'documentationNeeded',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CountyRequirementScalarFieldEnum = {
  id: 'id',
  county: 'county',
  permitRequired: 'permitRequired',
  permitOfficeName: 'permitOfficeName',
  permitOfficePhone: 'permitOfficePhone',
  permitOfficeAddress: 'permitOfficeAddress',
  permitFeesRange: 'permitFeesRange',
  inspectionProcess: 'inspectionProcess',
  hvhzZone: 'hvhzZone',
  specialRequirements: 'specialRequirements',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LeadAssignmentScalarFieldEnum = {
  id: 'id',
  leadId: 'leadId',
  customerId: 'customerId',
  projectId: 'projectId',
  salesRep: 'salesRep',
  projectManager: 'projectManager',
  estimator: 'estimator',
  assignmentDate: 'assignmentDate',
  assignmentRules: 'assignmentRules',
  reassignmentHistory: 'reassignmentHistory',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.LeadAnalyticsScalarFieldEnum = {
  id: 'id',
  leadId: 'leadId',
  customerId: 'customerId',
  projectId: 'projectId',
  leadSource: 'leadSource',
  serviceType: 'serviceType',
  county: 'county',
  urgency: 'urgency',
  estimatedValue: 'estimatedValue',
  actualValue: 'actualValue',
  leadScore: 'leadScore',
  conversionStatus: 'conversionStatus',
  conversionDate: 'conversionDate',
  conversionValue: 'conversionValue',
  timeToContactMinutes: 'timeToContactMinutes',
  timeToConversionHours: 'timeToConversionHours',
  touchpoints: 'touchpoints',
  marketingCampaign: 'marketingCampaign',
  referrerUrl: 'referrerUrl',
  deviceType: 'deviceType',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LeadCampaignAttributionScalarFieldEnum = {
  id: 'id',
  leadId: 'leadId',
  campaignId: 'campaignId',
  attributionType: 'attributionType',
  clickData: 'clickData',
  createdAt: 'createdAt'
};

exports.Prisma.CustomerCommunicationScalarFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  leadId: 'leadId',
  projectId: 'projectId',
  communicationType: 'communicationType',
  direction: 'direction',
  subject: 'subject',
  content: 'content',
  channel: 'channel',
  fromContact: 'fromContact',
  toContact: 'toContact',
  durationMinutes: 'durationMinutes',
  outcome: 'outcome',
  followUpRequired: 'followUpRequired',
  followUpDate: 'followUpDate',
  attachments: 'attachments',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.MarketingCampaignScalarFieldEnum = {
  id: 'id',
  campaignId: 'campaignId',
  name: 'name',
  type: 'type',
  status: 'status',
  budget: 'budget',
  costPerLead: 'costPerLead',
  targetCounties: 'targetCounties',
  targetServices: 'targetServices',
  startDate: 'startDate',
  endDate: 'endDate',
  leadsGenerated: 'leadsGenerated',
  conversions: 'conversions',
  revenueGenerated: 'revenueGenerated',
  roiPercentage: 'roiPercentage',
  metadata: 'metadata',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  notificationId: 'notificationId',
  type: 'type',
  title: 'title',
  message: 'message',
  urgency: 'urgency',
  recipientType: 'recipientType',
  recipientId: 'recipientId',
  channels: 'channels',
  leadId: 'leadId',
  customerId: 'customerId',
  projectId: 'projectId',
  workflowId: 'workflowId',
  metadata: 'metadata',
  sentAt: 'sentAt',
  readAt: 'readAt',
  acknowledgedAt: 'acknowledgedAt',
  createdAt: 'createdAt'
};

exports.Prisma.IntegrationLogScalarFieldEnum = {
  id: 'id',
  eventType: 'eventType',
  eventData: 'eventData',
  leadId: 'leadId',
  customerId: 'customerId',
  projectId: 'projectId',
  workflowId: 'workflowId',
  success: 'success',
  errorMessage: 'errorMessage',
  processingTimeMs: 'processingTimeMs',
  timestamp: 'timestamp'
};

exports.Prisma.WorkflowTriggerScalarFieldEnum = {
  id: 'id',
  triggerCode: 'triggerCode',
  name: 'name',
  description: 'description',
  triggerType: 'triggerType',
  conditions: 'conditions',
  actions: 'actions',
  sopProcedures: 'sopProcedures',
  isActive: 'isActive',
  priority: 'priority',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.UserRole = exports.$Enums.UserRole = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  ACCOUNTANT: 'ACCOUNTANT',
  USER: 'USER'
};

exports.AccountType = exports.$Enums.AccountType = {
  ASSET: 'ASSET',
  LIABILITY: 'LIABILITY',
  EQUITY: 'EQUITY',
  REVENUE: 'REVENUE',
  EXPENSE: 'EXPENSE'
};

exports.JournalEntryStatus = exports.$Enums.JournalEntryStatus = {
  DRAFT: 'DRAFT',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED: 'APPROVED',
  POSTED: 'POSTED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED'
};

exports.SourceModule = exports.$Enums.SourceModule = {
  MANUAL: 'MANUAL',
  ACCOUNTS_PAYABLE: 'ACCOUNTS_PAYABLE',
  ACCOUNTS_RECEIVABLE: 'ACCOUNTS_RECEIVABLE',
  PAYROLL: 'PAYROLL',
  INVENTORY: 'INVENTORY',
  BANK_RECONCILIATION: 'BANK_RECONCILIATION',
  DEPRECIATION: 'DEPRECIATION',
  ACCRUALS: 'ACCRUALS',
  ADJUSTMENTS: 'ADJUSTMENTS',
  YEAR_END: 'YEAR_END',
  INTEGRATION: 'INTEGRATION'
};

exports.RecurringFrequency = exports.$Enums.RecurringFrequency = {
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  BIWEEKLY: 'BIWEEKLY',
  MONTHLY: 'MONTHLY',
  QUARTERLY: 'QUARTERLY',
  ANNUALLY: 'ANNUALLY'
};

exports.LeadStatus = exports.$Enums.LeadStatus = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  QUALIFIED: 'QUALIFIED',
  CONVERTED: 'CONVERTED',
  LOST: 'LOST'
};

exports.OpportunityStatus = exports.$Enums.OpportunityStatus = {
  PROSPECTING: 'PROSPECTING',
  QUALIFICATION: 'QUALIFICATION',
  PROPOSAL: 'PROPOSAL',
  NEGOTIATION: 'NEGOTIATION',
  WON: 'WON',
  LOST: 'LOST'
};

exports.ProjectStatus = exports.$Enums.ProjectStatus = {
  PLANNING: 'PLANNING',
  IN_PROGRESS: 'IN_PROGRESS',
  ON_HOLD: 'ON_HOLD',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

exports.ProjectTaskStatus = exports.$Enums.ProjectTaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
};

exports.InvoiceStatus = exports.$Enums.InvoiceStatus = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  VIEWED: 'VIEWED',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED'
};

exports.BillStatus = exports.$Enums.BillStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED'
};

exports.PaymentMethod = exports.$Enums.PaymentMethod = {
  CASH: 'CASH',
  CHECK: 'CHECK',
  CREDIT_CARD: 'CREDIT_CARD',
  BANK_TRANSFER: 'BANK_TRANSFER',
  ACH: 'ACH'
};

exports.EmployeeStatus = exports.$Enums.EmployeeStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  TERMINATED: 'TERMINATED'
};

exports.CertificationStatus = exports.$Enums.CertificationStatus = {
  VALID: 'VALID',
  EXPIRING: 'EXPIRING',
  EXPIRED: 'EXPIRED'
};

exports.PeriodType = exports.$Enums.PeriodType = {
  MONTH: 'MONTH',
  QUARTER: 'QUARTER',
  YEAR: 'YEAR'
};

exports.ContactType = exports.$Enums.ContactType = {
  CUSTOMER: 'CUSTOMER',
  VENDOR: 'VENDOR',
  EMPLOYEE: 'EMPLOYEE',
  OTHER: 'OTHER'
};

exports.SopStatus = exports.$Enums.SopStatus = {
  DRAFT: 'DRAFT',
  PENDING_REVIEW: 'PENDING_REVIEW',
  APPROVED: 'APPROVED',
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
  DEPRECATED: 'DEPRECATED'
};

exports.SopPriority = exports.$Enums.SopPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

exports.WorkflowStatus = exports.$Enums.WorkflowStatus = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  PAUSED: 'PAUSED',
  CANCELLED: 'CANCELLED',
  FAILED: 'FAILED'
};

exports.Prisma.ModelName = {
  Organization: 'Organization',
  User: 'User',
  Account: 'Account',
  JournalEntry: 'JournalEntry',
  JournalEntryLine: 'JournalEntryLine',
  Customer: 'Customer',
  Lead: 'Lead',
  Opportunity: 'Opportunity',
  Project: 'Project',
  ProjectTask: 'ProjectTask',
  InventoryItem: 'InventoryItem',
  Invoice: 'Invoice',
  InvoiceItem: 'InvoiceItem',
  Bill: 'Bill',
  BillItem: 'BillItem',
  Payment: 'Payment',
  Employee: 'Employee',
  Certification: 'Certification',
  FiscalPeriod: 'FiscalPeriod',
  Contact: 'Contact',
  SopCategory: 'SopCategory',
  SopProcedure: 'SopProcedure',
  SopForm: 'SopForm',
  SopManual: 'SopManual',
  SopAssignment: 'SopAssignment',
  SopCompliance: 'SopCompliance',
  SopWorkflow: 'SopWorkflow',
  SopWorkflowTask: 'SopWorkflowTask',
  SopWorkflowExecution: 'SopWorkflowExecution',
  SopTrainingRequirement: 'SopTrainingRequirement',
  SopPerformanceMetric: 'SopPerformanceMetric',
  SopMobileSync: 'SopMobileSync',
  HurricaneProcedure: 'HurricaneProcedure',
  HvhzComplianceProcedure: 'HvhzComplianceProcedure',
  CountyRequirement: 'CountyRequirement',
  LeadAssignment: 'LeadAssignment',
  LeadAnalytics: 'LeadAnalytics',
  LeadCampaignAttribution: 'LeadCampaignAttribution',
  CustomerCommunication: 'CustomerCommunication',
  MarketingCampaign: 'MarketingCampaign',
  Notification: 'Notification',
  IntegrationLog: 'IntegrationLog',
  WorkflowTrigger: 'WorkflowTrigger'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
