// Forms Service - Handles form data and SOP linking
// Provides bidirectional linking between forms and SOPs

export interface FormMapping {
  id: number;
  form_code: string;
  form_name: string;
  sop_id: string;
  sop_title: string;
  form_type: 'form' | 'checklist' | 'document' | 'certificate' | 'report' | 'template' | 'log' | 'worksheet';
  category: string;
  subcategory: string;
  series_number: number;
  is_required: boolean;
  is_existing: boolean;
  priority_level: number;
  estimated_completion_time: number;
  approval_required: boolean;
  digital_signature_required: boolean;
  florida_specific: boolean;
  hurricane_related: boolean;
  osha_related: boolean;
  description: string;
  usage_frequency: string;
  target_roles: string[];
  created_at?: string;
  updated_at?: string;
}

export interface SOPFormLink {
  sop_id: string;
  sop_title: string;
  forms: FormMapping[];
  total_forms: number;
  existing_forms: number;
  missing_forms: number;
  critical_forms: number;
}

export interface FormSeriesSummary {
  series_number: number;
  series_name: string;
  category: string;
  total_forms: number;
  existing_forms: number;
  critical_forms: number;
  description: string;
  color: string;
}

class FormsService {
  private baseURL = '/api';

  // Get all forms with optional filtering
  async getForms(filters?: {
    category?: string;
    form_type?: string;
    series_number?: number;
    is_existing?: boolean;
    priority_level?: number;
    search?: string;
  }): Promise<FormMapping[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, value.toString());
          }
        });
      }

      const response = await fetch(`${this.baseURL}/forms?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch forms');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching forms:', error);
      // Return mock data for development
      return this.getMockForms(filters);
    }
  }

  // Get forms associated with a specific SOP
  async getFormsBySOP(sopId: string): Promise<FormMapping[]> {
    try {
      const response = await fetch(`${this.baseURL}/sops/${sopId}/forms`);
      if (!response.ok) {
        throw new Error('Failed to fetch forms for SOP');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching forms for SOP:', error);
      // Return mock data for development
      return this.getMockForms({ search: sopId });
    }
  }

  // Get SOP information for a specific form
  async getSOPByForm(formCode: string): Promise<SOPFormLink | null> {
    try {
      const response = await fetch(`${this.baseURL}/forms/${formCode}/sop`);
      if (!response.ok) {
        throw new Error('Failed to fetch SOP for form');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching SOP for form:', error);
      return null;
    }
  }

  // Get all SOPs with their associated forms
  async getSOPsWithForms(): Promise<SOPFormLink[]> {
    try {
      const response = await fetch(`${this.baseURL}/sops/with-forms`);
      if (!response.ok) {
        throw new Error('Failed to fetch SOPs with forms');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching SOPs with forms:', error);
      return [];
    }
  }

  // Get form series summary
  async getFormSeriesSummary(): Promise<FormSeriesSummary[]> {
    try {
      const response = await fetch(`${this.baseURL}/forms/series-summary`);
      if (!response.ok) {
        throw new Error('Failed to fetch form series summary');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching form series summary:', error);
      return this.getMockSeriesSummary();
    }
  }

  // Get forms by priority level
  async getFormsByPriority(priorityLevel: number): Promise<FormMapping[]> {
    return this.getForms({ priority_level: priorityLevel });
  }

  // Get missing forms (not yet implemented)
  async getMissingForms(): Promise<FormMapping[]> {
    return this.getForms({ is_existing: false });
  }

  // Get critical forms
  async getCriticalForms(): Promise<FormMapping[]> {
    return this.getForms({ priority_level: 1 });
  }

  // Search forms
  async searchForms(query: string): Promise<FormMapping[]> {
    return this.getForms({ search: query });
  }

  // Create form submission
  async createFormSubmission(formCode: string, submissionData: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/forms/${formCode}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error('Failed to create form submission');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating form submission:', error);
      throw error;
    }
  }

  // Update form mapping
  async updateFormMapping(formCode: string, updateData: Partial<FormMapping>): Promise<FormMapping> {
    try {
      const response = await fetch(`${this.baseURL}/forms/${formCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update form mapping');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating form mapping:', error);
      throw error;
    }
  }

  // Mock data methods for development
  private getMockForms(filters?: any): FormMapping[] {
    const mockForms: FormMapping[] = [
      {
        id: 1,
        form_code: 'FORM-1000-01',
        form_name: 'Daily Safety Inspection Checklist',
        sop_id: 'SOP-1001',
        sop_title: 'Roof Safety Inspection and Assessment',
        form_type: 'checklist',
        category: 'safety',
        subcategory: 'daily_safety',
        series_number: 1000,
        is_required: true,
        is_existing: true,
        priority_level: 1,
        estimated_completion_time: 20,
        approval_required: true,
        digital_signature_required: true,
        florida_specific: true,
        hurricane_related: false,
        osha_related: true,
        description: 'Comprehensive daily safety inspection for roof work sites',
        usage_frequency: 'daily',
        target_roles: ['Safety Coordinator', 'Crew Leader', 'Supervisor']
      },
      {
        id: 2,
        form_code: 'FORM-3000-01',
        form_name: 'Material Delivery Inspection',
        sop_id: 'SOP-3010',
        sop_title: 'Material Inspection and Acceptance',
        form_type: 'checklist',
        category: 'operations',
        subcategory: 'material_control',
        series_number: 3000,
        is_required: true,
        is_existing: true,
        priority_level: 1,
        estimated_completion_time: 20,
        approval_required: true,
        digital_signature_required: true,
        florida_specific: false,
        hurricane_related: false,
        osha_related: false,
        description: 'Material delivery inspection and acceptance checklist',
        usage_frequency: 'project-based',
        target_roles: ['Quality Control Inspector', 'Crew Leader']
      }
    ];

    if (!filters) return mockForms;

    let filtered = mockForms;

    if (filters.category) {
      filtered = filtered.filter(f => f.category === filters.category);
    }
    if (filters.form_type) {
      filtered = filtered.filter(f => f.form_type === filters.form_type);
    }
    if (filters.series_number) {
      filtered = filtered.filter(f => f.series_number === filters.series_number);
    }
    if (filters.is_existing !== undefined) {
      filtered = filtered.filter(f => f.is_existing === filters.is_existing);
    }
    if (filters.priority_level) {
      filtered = filtered.filter(f => f.priority_level === filters.priority_level);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(f =>
        f.form_name.toLowerCase().includes(search) ||
        f.form_code.toLowerCase().includes(search) ||
        f.sop_id.toLowerCase().includes(search) ||
        f.description.toLowerCase().includes(search)
      );
    }

    return filtered;
  }

  private getMockSeriesSummary(): FormSeriesSummary[] {
    return [
      {
        series_number: 1000,
        series_name: "Safety & OSHA Compliance",
        category: "safety",
        total_forms: 20,
        existing_forms: 8,
        critical_forms: 15,
        description: "Essential safety forms for OSHA compliance and job site safety management",
        color: "#ef4444"
      },
      {
        series_number: 3000,
        series_name: "Quality Control",
        category: "operations",
        total_forms: 15,
        existing_forms: 3,
        critical_forms: 10,
        description: "Quality control forms for material inspection and installation verification",
        color: "#10b981"
      },
      {
        series_number: 4000,
        series_name: "Customer Service",
        category: "customer",
        total_forms: 10,
        existing_forms: 2,
        critical_forms: 5,
        description: "Customer interaction and satisfaction management forms",
        color: "#3b82f6"
      },
      {
        series_number: 5000,
        series_name: "Administrative",
        category: "administrative",
        total_forms: 25,
        existing_forms: 1,
        critical_forms: 8,
        description: "HR, financial, and operational administrative forms",
        color: "#8b5cf6"
      },
      {
        series_number: 6000,
        series_name: "Emergency Response",
        category: "emergency",
        total_forms: 10,
        existing_forms: 2,
        critical_forms: 8,
        description: "Hurricane preparedness and emergency response forms",
        color: "#f59e0b"
      }
    ];
  }

  // Utility methods
  getFormTypeIcon(formType: string): string {
    switch (formType) {
      case 'form': return 'FileText';
      case 'checklist': return 'CheckSquare';
      case 'report': return 'BarChart3';
      case 'certificate': return 'Award';
      case 'template': return 'FileCheck';
      case 'log': return 'ScrollText';
      case 'worksheet': return 'Calculator';
      default: return 'FileText';
    }
  }

  getPriorityLabel(priority: number): string {
    switch (priority) {
      case 1: return 'Critical';
      case 2: return 'High';
      case 3: return 'Medium';
      default: return 'Low';
    }
  }

  getPriorityColor(priority: number): string {
    switch (priority) {
      case 1: return '#ef4444';
      case 2: return '#f97316';
      case 3: return '#3b82f6';
      default: return '#6b7280';
    }
  }

  getSeriesColor(seriesNumber: number): string {
    switch (seriesNumber) {
      case 1000: return '#ef4444';
      case 2000: return '#f97316';
      case 3000: return '#10b981';
      case 4000: return '#3b82f6';
      case 5000: return '#8b5cf6';
      case 6000: return '#f59e0b';
      case 9000: return '#06b6d4';
      default: return '#6b7280';
    }
  }

  getSeriesName(seriesNumber: number): string {
    switch (seriesNumber) {
      case 1000: return 'Safety & OSHA Compliance';
      case 2000: return 'Operations & Materials';
      case 3000: return 'Quality Control';
      case 4000: return 'Customer Service';
      case 5000: return 'Administrative';
      case 6000: return 'Emergency Response';
      case 9000: return 'Advanced Systems';
      default: return 'General Forms';
    }
  }
}

// Export singleton instance
const formsService = new FormsService();
export default formsService;