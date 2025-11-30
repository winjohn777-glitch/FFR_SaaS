/**
 * SOP Type Definitions - SINGLE SOURCE OF TRUTH
 * Consolidated type definitions for Standard Operating Procedures
 */

export interface SOPCategory {
  id: number;
  category_code: string;
  category_name: string;
  description: string;
  color_code: string;
  icon_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SOPProcedure {
  id: number;
  sop_number: string;
  title: string;
  description: string;
  category_id: number;
  category_name: string;
  status: 'draft' | 'active' | 'under_review' | 'archived';
  priority_level: 'critical' | 'high' | 'standard' | 'low';
  compliance_required: boolean;
  florida_specific: boolean;
  hurricane_related: boolean;
  osha_related: boolean;
  purpose?: string;
  scope?: string;
  procedure_steps?: string[];
  required_materials?: string[];
  safety_requirements?: string;
  quality_checkpoints?: string[];
  forms_required?: string[];
  estimated_duration_minutes: number;
  color_code: string;
  version?: string;
  created_by?: string;
  approved_by?: string;
  approval_date?: string;
  effective_date: string;
  review_date?: string;
  next_review_date?: string;
  attachments?: string[];
  created_at: string;
  updated_at: string;
  regulatory_compliance?: string[];
  cross_references?: string[];
  legal_citations?: string[];
  verification_sources?: string[];
  last_legal_review?: string;
  content_file_path?: string;
  content?: string;
}

export interface SOPContent {
  id: number;
  sop_number: string;
  title: string;
  category_name: string;
  content: string;
  filePath?: string;
  hasFileContent: boolean;
}

export interface SOPFilters {
  search: string;
  category: string;
  status: string;
  priority: string;
  compliance: string;
  florida_specific: string;
  hurricane_related: string;
  osha_related: string;
}

export interface SOPListResponse {
  success: boolean;
  data: SOPProcedure[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SOPContentResponse {
  success: boolean;
  data: SOPContent;
}

export interface SOPCategoryResponse {
  success: boolean;
  data: SOPCategory[];
}