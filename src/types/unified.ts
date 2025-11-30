/**
 * Unified Data Types for Florida First Roofing
 * Central type definitions that eliminate data duplication across modules
 */

// Common types
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  county: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export type CreditRating = 'Excellent' | 'Good' | 'Fair' | 'Poor';
export type ProjectStatus = 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
export type ProjectType = 'New Installation' | 'Re-roof' | 'Repair' | 'Maintenance' | 'Emergency' | 'Insurance Restoration';
export type RoofType = 'Shingle' | 'Metal' | 'TPO' | 'Tile' | 'Modified Bitumen' | 'Other';
export type PropertyType = 'Single Family' | 'Multi Family' | 'Townhouse' | 'Condo' | 'Commercial Building' | 'Industrial' | 'Other';

// Unified Customer Entity - The single source of truth for all customer data
export interface UnifiedCustomer {
  // Core Identity
  id: string;
  type: 'Residential' | 'Commercial';
  status: 'Active' | 'Inactive' | 'Prospect';

  // Personal/Business Information
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  phone: string;
  alternatePhone?: string;

  // Address
  address: Address;

  // Property Information
  propertyType: PropertyType;
  roofType: RoofType;
  roofAge?: number;
  lastInspectionDate?: string;

  // CRM Specific
  leadSource: string;
  referredBy?: string;
  marketingCampaign?: string;
  creditRating?: CreditRating;
  tags: string[];

  // Accounting Integration
  accountsReceivableId: string;
  paymentTerms: string;
  taxExempt: boolean;
  creditLimit?: number;
  totalLifetimeValue: number;
  outstandingBalance: number;

  // Project History
  projectIds: string[];
  invoiceIds: string[];

  // Communication
  communicationHistory: Communication[];
  notes: string;

  // Timestamps
  dateAdded: string;
  lastContact: string;
  nextFollowUp?: string;
  updatedAt: string;
}

// Unified Employee Entity - Single source for all employee data
export interface UnifiedEmployee {
  // Core Identity
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;

  // Employment Details
  position: string;
  department: string;
  hireDate: string;
  status: 'Active' | 'Inactive' | 'Terminated';
  terminationDate?: string;

  // Compensation
  hourlyRate: number;
  salary?: number;
  payrollId: string;
  overtimeRate?: number;

  // Contact Information
  phone: string;
  email: string;
  address: Address;
  emergencyContact: EmergencyContact;

  // Certifications & Training
  certifications: Certification[];
  trainingEnrollments: TrainingEnrollment[];
  oshaCompliance: OSHACompliance;
  licenseExpirations: LicenseExpiration[];

  // Project Assignment
  currentProjectIds: string[];
  availability: EmployeeAvailability;
  skills: string[];
  certifiedEquipment: string[];

  // Time Tracking
  timeTrackingId: string;
  defaultHoursPerWeek: number;

  // Document Access
  documentPermissions: DocumentPermission[];
  securityClearance: string;

  // Performance
  performanceRating?: number;
  lastReviewDate?: string;
  nextReviewDate?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Unified Project Entity - Central project data for all modules
export interface UnifiedProject {
  // Core Identity
  id: string;
  projectNumber: string;
  name: string;

  // Customer Link
  customerId: string;
  opportunityId?: string;

  // Project Details
  type: ProjectType;
  status: ProjectStatus;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  description: string;

  // Location & Property
  address: Address;
  propertyType: PropertyType;
  roofType: RoofType;
  squareFootage: number;
  stories: number;

  // Timeline
  estimatedStartDate: string;
  estimatedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;

  // Financial
  contractAmount: number;
  estimatedCost: number;
  actualCost: number;
  profitMargin: number;
  billingType: 'Fixed Price' | 'Time and Materials' | 'Cost Plus';

  // Team Assignment
  projectManagerId: string;
  assignedEmployees: EmployeeAssignment[];
  subcontractors: SubcontractorAssignment[];

  // Resources
  materials: MaterialAllocation[];
  equipment: EquipmentAllocation[];

  // Permits & Compliance
  permits: Permit[];
  inspections: Inspection[];
  insuranceClaim?: InsuranceClaim;

  // Documents
  documentIds: string[];
  contractId?: string;

  // Job Costing
  jobCostingId: string;
  costEntries: JobCostEntry[];

  // Invoicing
  invoiceIds: string[];
  billingSchedule: BillingSchedule[];

  // Progress Tracking
  milestones: ProjectMilestone[];
  progressPercentage: number;
  photos: ProjectPhoto[];

  // Weather & Environment
  weatherDependencies: string[];
  seasonalConstraints: string[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// Supporting Interfaces
export interface Communication {
  id: string;
  type: 'Phone Call' | 'Email' | 'Text Message' | 'In-Person' | 'Site Visit' | 'Proposal' | 'Follow-up' | 'Other';
  direction: 'Inbound' | 'Outbound';
  date: string;
  duration?: number;
  subject: string;
  notes: string;
  outcome: string;
  followUpRequired: boolean;
  followUpDate?: string;
  createdBy: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  certificationNumber: string;
  issueDate: string;
  expirationDate: string;
  status: 'Active' | 'Expired' | 'Suspended';
  renewalRequired: boolean;
}

export interface TrainingEnrollment {
  id: string;
  courseId: string;
  courseName: string;
  enrollmentDate: string;
  completionDate?: string;
  status: 'Enrolled' | 'In Progress' | 'Completed' | 'Failed';
  score?: number;
  certificateId?: string;
}

export interface OSHACompliance {
  osha10Certified: boolean;
  osha30Certified: boolean;
  lastSafetyTraining: string;
  safetyViolations: SafetyViolation[];
  nextTrainingDue: string;
}

export interface LicenseExpiration {
  licenseType: string;
  licenseNumber: string;
  expirationDate: string;
  renewalNotificationSent: boolean;
}

export interface EmployeeAvailability {
  status: 'Available' | 'Assigned' | 'Unavailable' | 'On Leave';
  availableHours: number;
  workSchedule: WorkSchedule;
  timeOffRequests: TimeOffRequest[];
}

export interface WorkSchedule {
  monday: WorkDay;
  tuesday: WorkDay;
  wednesday: WorkDay;
  thursday: WorkDay;
  friday: WorkDay;
  saturday: WorkDay;
  sunday: WorkDay;
}

export interface WorkDay {
  available: boolean;
  startTime?: string;
  endTime?: string;
  totalHours: number;
}

export interface TimeOffRequest {
  id: string;
  startDate: string;
  endDate: string;
  type: 'Vacation' | 'Sick' | 'Personal' | 'Emergency';
  status: 'Pending' | 'Approved' | 'Denied';
  reason?: string;
}

export interface DocumentPermission {
  documentType: string;
  permissions: ('read' | 'write' | 'delete' | 'share')[];
  grantedDate: string;
  expirationDate?: string;
}

export interface EmployeeAssignment {
  employeeId: string;
  role: string;
  assignedDate: string;
  estimatedHours: number;
  actualHours: number;
  status: 'Assigned' | 'Active' | 'Completed';
}

export interface SubcontractorAssignment {
  vendorId: string;
  contractAmount: number;
  scope: string;
  status: 'Pending' | 'Active' | 'Completed';
}

export interface MaterialAllocation {
  materialId: string;
  materialName: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  status: 'Planned' | 'Ordered' | 'Delivered' | 'Used';
  supplierId?: string;
}

export interface EquipmentAllocation {
  equipmentId: string;
  equipmentName: string;
  assignedDate: string;
  returnDate?: string;
  status: 'Assigned' | 'In Use' | 'Returned';
}

export interface Permit {
  id: string;
  type: string;
  permitNumber?: string;
  applicationDate: string;
  approvalDate?: string;
  expirationDate?: string;
  status: 'Applied' | 'Approved' | 'Expired' | 'Denied';
  issuingAuthority: string;
  cost: number;
}

export interface Inspection {
  id: string;
  type: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'Scheduled' | 'Passed' | 'Failed' | 'Cancelled';
  inspector: string;
  notes?: string;
  photos: string[];
}

export interface InsuranceClaim {
  claimNumber: string;
  insuranceCompany: string;
  adjusterId: string;
  adjusterPhone: string;
  dateOfLoss: string;
  claimAmount: number;
  deductible: number;
  status: 'Filed' | 'Under Review' | 'Approved' | 'Denied' | 'Paid';
}

export interface JobCostEntry {
  id: string;
  category: 'Materials' | 'Labor' | 'Equipment' | 'Subcontractor' | 'Permit' | 'Other';
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  date: string;
  vendorId?: string;
  invoiceNumber?: string;
}

export interface BillingSchedule {
  id: string;
  milestone: string;
  percentage: number;
  amount: number;
  dueDate: string;
  invoiceId?: string;
  status: 'Pending' | 'Invoiced' | 'Paid';
}

export interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  targetDate: string;
  completedDate?: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  dependencies: string[];
}

export interface ProjectPhoto {
  id: string;
  url: string;
  caption: string;
  dateTaken: string;
  takenBy: string;
  category: 'Before' | 'Progress' | 'After' | 'Damage' | 'Quality';
}

export interface SafetyViolation {
  id: string;
  date: string;
  type: string;
  description: string;
  severity: 'Minor' | 'Major' | 'Critical';
  resolved: boolean;
  resolutionDate?: string;
}

// Central Data Store Interface
export interface CentralDataStore {
  // Core Entities
  customers: Map<string, UnifiedCustomer>;
  employees: Map<string, UnifiedEmployee>;
  projects: Map<string, UnifiedProject>;

  // Supporting Entities
  leads: Map<string, any>; // Import from CRM types
  opportunities: Map<string, any>;
  invoices: Map<string, any>;
  materials: Map<string, any>;
  equipment: Map<string, any>;
  documents: Map<string, any>;

  // Lookup Tables
  chartOfAccounts: Map<string, any>;
  vendors: Map<string, any>;

  // Configuration
  systemSettings: SystemSettings;
  userPermissions: Map<string, UserPermission[]>;
}

export interface SystemSettings {
  companyInfo: CompanyInfo;
  defaultSettings: DefaultSettings;
  integrationSettings: IntegrationSettings;
}

export interface CompanyInfo {
  name: string;
  address: Address;
  phone: string;
  email: string;
  website: string;
  licenseNumber: string;
  taxId: string;
}

export interface DefaultSettings {
  defaultPaymentTerms: string;
  defaultTaxRate: number;
  defaultWarrantyPeriod: number;
  defaultMarkupPercentage: number;
}

export interface IntegrationSettings {
  accountingSystemId: string;
  crmSystemId: string;
  documentManagementEnabled: boolean;
  timeTrackingEnabled: boolean;
  inventoryTrackingEnabled: boolean;
}

export interface UserPermission {
  module: string;
  permissions: string[];
  restrictions: string[];
}

// Event Types for Data Synchronization
export interface DataEvent<T = any> {
  type: string;
  entityId: string;
  entityType: 'customer' | 'employee' | 'project';
  data: T;
  timestamp: string;
  userId: string;
  source: string;
}

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ConsistencyReport {
  isConsistent: boolean;
  issues: ConsistencyIssue[];
  checkedAt: string;
}

export interface ConsistencyIssue {
  type: 'data_mismatch' | 'missing_reference' | 'duplicate_entry' | 'constraint_violation';
  entity: string;
  entityId: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestedResolution: string;
}