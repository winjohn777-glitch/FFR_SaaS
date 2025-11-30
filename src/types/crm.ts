export interface Customer {
  id: string;
  type: 'Residential' | 'Commercial';
  status: 'Active' | 'Inactive' | 'Prospect';

  // Basic Information
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  phone: string;
  alternatePhone?: string;

  // Address Information
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    county: string;
  };

  // Roofing Specific
  propertyType: 'Single Family' | 'Multi Family' | 'Townhouse' | 'Condo' | 'Commercial Building' | 'Industrial' | 'Other';
  roofType: 'Shingle' | 'Metal' | 'TPO' | 'Tile' | 'Modified Bitumen' | 'Other' | 'Unknown';
  roofAge?: number;
  lastInspectionDate?: string;

  // Lead Source & Marketing
  leadSource: 'Referral' | 'Website' | 'Google Ads' | 'Facebook' | 'Door to Door' | 'Insurance Claim' | 'Repeat Customer' | 'Trade Show' | 'Other';
  referredBy?: string;
  marketingCampaign?: string;

  // Financial
  creditRating?: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  paymentTerms?: string;

  // Dates
  dateAdded: string;
  lastContact: string;
  nextFollowUp?: string;

  // Notes & Communication
  notes: string;
  tags: string[];

  // Relationships
  assignedSalesperson?: string;
  accountManager?: string;
}

export interface Lead {
  id: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Negotiating' | 'Won' | 'Lost';
  priority: 'Hot' | 'Warm' | 'Cold';

  // Basic Information
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  phone: string;

  // Address
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    county: string;
  };

  // Lead Details
  serviceNeeded: 'New Roof' | 'Roof Repair' | 'Roof Inspection' | 'Emergency Repair' | 'Maintenance' | 'Insurance Claim' | 'Other';
  roofType: 'Shingle' | 'Metal' | 'TPO' | 'Tile' | 'Modified Bitumen' | 'Other' | 'Unknown';
  propertyType: 'Residential' | 'Commercial';
  estimatedValue: number;
  timeframe: 'Immediate' | 'Within 30 days' | 'Within 3 months' | 'Within 6 months' | 'Planning ahead';

  // Lead Source
  source: 'Website' | 'Google Ads' | 'Facebook' | 'Referral' | 'Door to Door' | 'Insurance Claim' | 'Cold Call' | 'Trade Show' | 'Other';
  campaign?: string;
  referredBy?: string;

  // Dates & Tracking
  dateCreated: string;
  lastContact: string;
  nextFollowUp?: string;
  expectedCloseDate?: string;

  // Notes & Communication
  notes: string;
  communications: Communication[];

  // Assignment
  assignedTo: string;

  // Weather/Emergency Related
  isStormLead: boolean;
  insuranceClaimNumber?: string;
  insuranceCompany?: string;
}

export interface Communication {
  id: string;
  type: 'Phone Call' | 'Email' | 'Text Message' | 'In-Person' | 'Site Visit' | 'Proposal' | 'Follow-up' | 'Other';
  direction: 'Inbound' | 'Outbound';
  date: string;
  duration?: number; // minutes
  subject: string;
  notes: string;
  outcome: 'Successful' | 'No Answer' | 'Voicemail' | 'Callback Requested' | 'Meeting Scheduled' | 'Proposal Requested' | 'Not Interested' | 'Other';
  followUpRequired: boolean;
  followUpDate?: string;
  createdBy: string;
}

export interface Opportunity {
  id: string;
  customerId: string;
  leadId?: string;

  // Basic Information
  name: string;
  description: string;
  stage: 'Prospecting' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Closed Lost';
  probability: number; // 0-100

  // Financial
  estimatedValue: number;
  actualValue?: number;

  // Project Details
  projectType: 'New Installation' | 'Re-roof' | 'Repair' | 'Maintenance' | 'Emergency' | 'Insurance Restoration';
  roofingMaterial: 'Shingle' | 'Metal' | 'TPO' | 'Tile' | 'Modified Bitumen' | 'Other';
  squareFootage?: number;

  // Timeline
  estimatedStartDate?: string;
  estimatedCompletionDate?: string;
  actualStartDate?: string;
  actualCompletionDate?: string;

  // Dates
  dateCreated: string;
  expectedCloseDate?: string;
  actualCloseDate?: string;

  // Assignment
  assignedTo: string;

  // Competitors & Pricing
  competitors?: string[];
  ourProposal?: number;
  competitorPricing?: { competitor: string; price: number }[];

  // Reasons
  lostReason?: 'Price' | 'Timeline' | 'Competitor' | 'Budget' | 'Timing' | 'Quality Concerns' | 'Other';
  winReason?: 'Price' | 'Quality' | 'Timeline' | 'Relationship' | 'Reputation' | 'Other';

  // Insurance
  isInsuranceClaim: boolean;
  insuranceCompany?: string;
  claimNumber?: string;
  adjusterId?: string;

  // Communication
  notes: string;
  communications: Communication[];
}

export interface SalesActivity {
  id: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Site Visit' | 'Proposal' | 'Follow-up' | 'Demo' | 'Other';
  customerId?: string;
  leadId?: string;
  opportunityId?: string;

  // Details
  subject: string;
  description: string;
  date: string;
  duration?: number; // minutes

  // Outcome
  outcome: string;
  nextAction?: string;
  nextActionDate?: string;

  // Assignment
  performedBy: string;

  // Location (for site visits)
  location?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface CRMDashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  totalLeads: number;
  hotLeads: number;
  totalOpportunities: number;
  opportunityValue: number;

  // Pipeline Stats
  pipelineByStage: {
    stage: string;
    count: number;
    value: number;
  }[];

  // Lead Sources
  leadsBySource: {
    source: string;
    count: number;
    conversionRate: number;
  }[];

  // Activity Stats
  callsThisWeek: number;
  meetingsThisWeek: number;
  proposalsSent: number;
  followUpsNeeded: number;

  // Revenue Stats
  revenueThisMonth: number;
  revenueLastMonth: number;
  projectedRevenue: number;
  avgDealSize: number;

  // Geographic Stats
  customersByCounty: {
    county: string;
    count: number;
    revenue: number;
  }[];
}

export interface CRMFilters {
  customerType?: 'Residential' | 'Commercial';
  status?: string;
  leadSource?: string;
  assignedTo?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  county?: string;
  roofType?: string;
  tags?: string[];
}

// Florida-specific data for roofing CRM
export const FLORIDA_COUNTIES = [
  'Alachua', 'Baker', 'Bay', 'Bradford', 'Brevard', 'Broward', 'Calhoun', 'Charlotte',
  'Citrus', 'Clay', 'Collier', 'Columbia', 'DeSoto', 'Dixie', 'Duval', 'Escambia',
  'Flagler', 'Franklin', 'Gadsden', 'Gilchrist', 'Glades', 'Gulf', 'Hamilton', 'Hardee',
  'Hendry', 'Hernando', 'Highlands', 'Hillsborough', 'Holmes', 'Indian River', 'Jackson',
  'Jefferson', 'Lafayette', 'Lake', 'Lee', 'Leon', 'Levy', 'Liberty', 'Madison', 'Manatee',
  'Marion', 'Martin', 'Miami-Dade', 'Monroe', 'Nassau', 'Okaloosa', 'Okeechobee', 'Orange',
  'Osceola', 'Palm Beach', 'Pasco', 'Pinellas', 'Polk', 'Putnam', 'St. Johns', 'St. Lucie',
  'Santa Rosa', 'Sarasota', 'Seminole', 'Sumter', 'Suwannee', 'Taylor', 'Union', 'Volusia',
  'Wakulla', 'Walton', 'Washington'
];

export const INSURANCE_COMPANIES = [
  'State Farm', 'Allstate', 'Progressive', 'GEICO', 'USAA', 'Farmers', 'Liberty Mutual',
  'Nationwide', 'Travelers', 'American Family', 'Auto-Owners', 'Erie Insurance',
  'Citizens Property Insurance', 'Universal Property & Casualty', 'Florida Peninsula Insurance',
  'Heritage Property & Casualty', 'Federated National Insurance', 'Tower Hill Insurance',
  'St. Johns Insurance', 'Homeowners Choice', 'Avatar Property & Casualty', 'Other'
];

export const ROOF_MATERIALS = [
  'Asphalt Shingles', 'Architectural Shingles', 'Metal - Standing Seam', 'Metal - Corrugated',
  'TPO Membrane', 'EPDM Membrane', 'Modified Bitumen', 'Concrete Tile', 'Clay Tile',
  'Slate', 'Cedar Shake', 'Built-up Roof', 'Other'
];

export const LEAD_SOURCES = [
  'Website Contact Form', 'Google Ads', 'Google Organic', 'Facebook Ads', 'Facebook Organic',
  'Yelp', 'Angie\'s List', 'HomeAdvisor', 'Thumbtack', 'Referral - Past Customer',
  'Referral - Insurance Agent', 'Referral - Real Estate Agent', 'Door to Door Canvassing',
  'Storm Chasing', 'Trade Show', 'Radio Ad', 'TV Commercial', 'Direct Mail', 'Cold Call',
  'Truck Wrap/Signage', 'Yard Sign', 'Other'
];