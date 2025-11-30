// Inventory Management Types with Safety and Regulatory Standards

export interface SafetyDataSheet {
  id: string;
  sdsNumber: string;
  version: string;
  revisionDate: string;
  fileName: string;
  fileUrl?: string;
  language: 'EN' | 'ES' | 'FR';
  supplier: string;
  emergencyContact: string;
  emergencyPhone: string;
  healthHazards: HealthHazard[];
  physicalHazards: PhysicalHazard[];
  environmentalHazards: EnvironmentalHazard[];
  disposalInstructions: string;
  storageRequirements: string;
  firstAidMeasures: FirstAidMeasures;
}

export interface HealthHazard {
  type: 'Acute' | 'Chronic' | 'Carcinogenic' | 'Mutagenic' | 'Reproductive' | 'Respiratory' | 'Skin' | 'Eye';
  severity: 'Low' | 'Moderate' | 'High' | 'Extreme';
  description: string;
  preventiveMeasures: string[];
}

export interface PhysicalHazard {
  type: 'Flammable' | 'Explosive' | 'Oxidizing' | 'Corrosive' | 'Pressure' | 'Temperature';
  classification: string;
  description: string;
  preventiveMeasures: string[];
}

export interface EnvironmentalHazard {
  type: 'Aquatic' | 'Terrestrial' | 'Atmospheric' | 'Waste';
  severity: 'Low' | 'Moderate' | 'High' | 'Extreme';
  description: string;
  mitigationMeasures: string[];
}

export interface FirstAidMeasures {
  inhalation: string;
  skinContact: string;
  eyeContact: string;
  ingestion: string;
  generalNotes: string;
}

export interface RegulatoryCompliance {
  astmStandards: ASTMStandard[];
  oshaClassifications: OSHAClassification[];
  epaRegulations: EPARegulation[];
  dotShipping: DOTShipping;
  stateRegulations: StateRegulation[];
  certifications: Certification[];
}

export interface ASTMStandard {
  standardNumber: string; // e.g., "ASTM D6083", "ASTM D6298"
  title: string;
  category: 'Material' | 'Testing' | 'Installation' | 'Performance' | 'Safety';
  complianceStatus: 'Compliant' | 'Non-Compliant' | 'Pending' | 'Not Applicable';
  testResults?: TestResult[];
  certificationDate?: string;
  expirationDate?: string;
  notes?: string;
}

export interface TestResult {
  testMethod: string;
  result: string;
  units: string;
  passedSpecification: boolean;
  testDate: string;
  laboratoryName: string;
  certificateNumber?: string;
}

export interface OSHAClassification {
  hazardClass: string;
  hazardCategory: string;
  label: string;
  pictogram: string[];
  signalWord: 'Danger' | 'Warning' | 'None';
  hazardStatements: string[];
  precautionaryStatements: string[];
}

export interface EPARegulation {
  regulationNumber: string;
  title: string;
  applicability: string;
  complianceStatus: 'Compliant' | 'Non-Compliant' | 'Pending';
  permitRequired: boolean;
  permitNumber?: string;
  expirationDate?: string;
}

export interface DOTShipping {
  hazardClass?: string;
  unNumber?: string;
  properShippingName?: string;
  packingGroup?: 'I' | 'II' | 'III';
  specialProvisions?: string[];
  limitedQuantity?: boolean;
  marineoPollutant?: boolean;
}

export interface StateRegulation {
  state: string;
  regulationType: string;
  requirement: string;
  complianceStatus: 'Compliant' | 'Non-Compliant' | 'Pending';
  licenseRequired: boolean;
  licenseNumber?: string;
  expirationDate?: string;
}

export interface Certification {
  type: 'UL' | 'FM' | 'ICC' | 'Energy Star' | 'Green Building' | 'ISO' | 'NRCA' | 'Other';
  number: string;
  issuingOrganization: string;
  certificationDate: string;
  expirationDate?: string;
  scope: string;
  status: 'Active' | 'Expired' | 'Suspended' | 'Pending';
}

export interface InventoryItem {
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

  // Safety and Regulatory Information
  safetyDataSheet?: SafetyDataSheet;
  regulatoryCompliance?: RegulatoryCompliance;
  requiresPpe: boolean;
  requiredPpe: PPERequirement[];
  storageInstructions: string;
  handlingPrecautions: string;
  temperatureRequirements?: TemperatureRange;
  shelfLife?: ShelfLife;
  hazardousWaste: boolean;
  recyclingInstructions?: string;

  // Quality Control
  qualityGrade?: 'A' | 'B' | 'C' | 'Premium' | 'Standard' | 'Economy';
  warrantyPeriod?: string;
  installationInstructions?: string;
  technicalDataSheet?: string;

  // Roofing-Specific Properties
  weatherRating?: WeatherRating;
  fireRating?: FireRating;
  windRating?: WindRating;
  roofingApplication?: RoofingApplication[];
  colorOptions?: string[];
  dimensions?: ProductDimensions;
  coverage?: Coverage;
}

export interface PPERequirement {
  type: 'Respirator' | 'Gloves' | 'Eye Protection' | 'Hard Hat' | 'Safety Shoes' | 'Protective Clothing' | 'Fall Protection';
  specification: string;
  required: boolean;
  notes?: string;
}

export interface TemperatureRange {
  min: number;
  max: number;
  unit: 'F' | 'C';
  criticalRange?: boolean;
}

export interface ShelfLife {
  duration: number;
  unit: 'Days' | 'Months' | 'Years';
  conditions: string;
  expirationDate?: string;
}

export interface WeatherRating {
  uvResistance: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  thermalCycling: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  moistureResistance: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  climateZones: string[];
}

export interface FireRating {
  classification: 'Class A' | 'Class B' | 'Class C' | 'Unrated';
  testStandard: string;
  certifyingBody: string;
  certificateNumber?: string;
}

export interface WindRating {
  maxWindSpeed: number;
  unit: 'mph' | 'km/h';
  testStandard: string;
  certifyingBody: string;
  upliftRating?: string;
}

export interface RoofingApplication {
  type: 'New Construction' | 'Re-Roof' | 'Repair' | 'Maintenance';
  roofType: 'Steep Slope' | 'Low Slope' | 'Metal' | 'Membrane' | 'Modified Bitumen';
  substrate: string[];
  climate: 'Hot' | 'Cold' | 'Moderate' | 'Coastal' | 'Desert' | 'All';
}

export interface ProductDimensions {
  length: number;
  width: number;
  thickness: number;
  weight: number;
  lengthUnit: 'in' | 'ft' | 'mm' | 'cm' | 'm';
  weightUnit: 'lb' | 'kg' | 'oz' | 'g';
}

export interface Coverage {
  area: number;
  unit: 'sqft' | 'sqm';
  overlap?: number;
  wastePercentage?: number;
  installationNotes?: string;
}

// Form data interfaces for modals
export interface InventoryFormData {
  // Basic Information
  sku: string;
  name: string;
  category: string;
  description: string;

  // Stock Information
  currentStock: string;
  reorderPoint: string;
  reorderQuantity: string;
  unit: string;
  unitCost: string;

  // Supplier Information
  supplier: string;
  supplierSku: string;
  location: string;

  // Safety Information
  requiresPpe: boolean;
  storageInstructions: string;
  handlingPrecautions: string;
  hazardousWaste: boolean;

  // SDS Information
  sdsNumber?: string;
  sdsVersion?: string;
  sdsRevisionDate?: string;
  emergencyContact?: string;
  emergencyPhone?: string;

  // ASTM Standards
  astmStandards?: string;
  complianceStatus?: string;
  certificationDate?: string;

  // Quality Information
  qualityGrade?: string;
  warrantyPeriod?: string;

  // Roofing-Specific
  weatherRating?: string;
  fireRating?: string;
  windRating?: string;
  roofingApplication?: string;
}

// Safety alert types
export interface SafetyAlert {
  id: string;
  type: 'SDS_Expiring' | 'Certification_Expiring' | 'Hazardous_Storage' | 'PPE_Required' | 'Temperature_Critical';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  itemId: string;
  message: string;
  actionRequired: string;
  dueDate?: string;
  acknowledged: boolean;
}