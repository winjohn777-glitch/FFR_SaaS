/**
 * SOP Management Service
 * Handles all API calls related to Standard Operating Procedures
 */

import {
  SOPCategory,
  SOPProcedure,
  SOPContent,
  SOPListResponse,
  SOPContentResponse,
  SOPCategoryResponse
} from '../types/sop';

export interface SOPAssignment {
  id: number;
  assignment_type: 'project' | 'employee' | 'job_type' | 'event';
  sop_id: number;
  project_id?: number;
  employee_id?: number;
  job_type?: string;
  event_trigger?: string;
  assigned_date: string;
  due_date?: string;
  priority: 'critical' | 'high' | 'standard' | 'low';
  status: 'assigned' | 'in_progress' | 'completed' | 'overdue';
  completed_date?: string;
  completed_by?: number;
  completion_notes?: string;
  compliance_verified?: boolean;
  form_id?: number;
  sop_title?: string;
  sop_number?: string;
}

export interface ComplianceMetrics {
  total_assignments: number;
  completed_assignments: number;
  overdue_assignments: number;
  completion_rate: number;
  avg_compliance_rate: number;
  total_sops?: number;
  active_sops?: number;
  florida_specific_sops?: number;
  hurricane_related_sops?: number;
  osha_related_sops?: number;
  critical_priority_sops?: number;
  high_priority_sops?: number;
}

export interface SOPAPIFilters {
  category_id?: number;
  status?: string;
  florida_specific?: boolean;
  hurricane_related?: boolean;
  osha_related?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

class SOPService {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
  }

  // =====================================================
  // SOP CATEGORIES
  // =====================================================

  async getCategories(activeOnly: boolean = true): Promise<SOPCategory[]> {
    try {
      const response = await fetch(
        `${this.baseURL}/sop/categories?active_only=${activeOnly}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: APIResponse<SOPCategory[]> = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch categories');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching SOP categories:', error);
      throw error;
    }
  }

  async createCategory(categoryData: Partial<SOPCategory>): Promise<SOPCategory> {
    try {
      const response = await fetch(`${this.baseURL}/sop/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: APIResponse<SOPCategory> = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to create category');
      }

      return result.data;
    } catch (error) {
      console.error('Error creating SOP category:', error);
      throw error;
    }
  }

  // =====================================================
  // SOP PROCEDURES
  // =====================================================

  async getProcedures(filters: SOPAPIFilters = {}): Promise<PaginatedResponse<SOPProcedure>> {
    try {
      const searchParams = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(
        `${this.baseURL}/sop/procedures?${searchParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch procedures');
      }

      return result;
    } catch (error) {
      console.error('Error fetching SOP procedures:', error);
      throw error;
    }
  }

  async getProcedureById(id: number): Promise<SOPProcedure> {
    try {
      const response = await fetch(`${this.baseURL}/sop/procedures/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: APIResponse<SOPProcedure> = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch procedure');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching SOP procedure:', error);
      throw error;
    }
  }

  async getProcedureContent(idOrNumber: number | string): Promise<{
    id: number;
    sop_number: string;
    title: string;
    content: string;
    content_type: string;
    file_path?: string;
  }> {
    try {
      // If it's a number (ID), first get the procedure to find the SOP number
      let sopNumber: string;

      if (typeof idOrNumber === 'number') {
        const procedure = await this.getProcedureById(idOrNumber);
        sopNumber = procedure.sop_number;
      } else {
        sopNumber = idOrNumber;
      }

      // Use the enhanced content endpoint that reads from markdown files
      const response = await fetch(`${this.baseURL}/sop/content/${sopNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: APIResponse<{
        id: number;
        sop_number: string;
        title: string;
        content: string;
        content_type: string;
        file_path?: string;
      }> = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch procedure content');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching SOP procedure content:', error);
      throw error;
    }
  }

  async createProcedure(procedureData: Partial<SOPProcedure>): Promise<SOPProcedure> {
    try {
      const response = await fetch(`${this.baseURL}/sop/procedures`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(procedureData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: APIResponse<SOPProcedure> = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to create procedure');
      }

      return result.data;
    } catch (error) {
      console.error('Error creating SOP procedure:', error);
      throw error;
    }
  }

  // =====================================================
  // SOP ASSIGNMENTS
  // =====================================================

  async createAssignment(assignmentData: Partial<SOPAssignment>): Promise<SOPAssignment> {
    try {
      const response = await fetch(`${this.baseURL}/sop/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignmentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: APIResponse<SOPAssignment> = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to create assignment');
      }

      return result.data;
    } catch (error) {
      console.error('Error creating SOP assignment:', error);
      throw error;
    }
  }

  async getEmployeeAssignments(
    employeeId: number,
    status?: string
  ): Promise<SOPAssignment[]> {
    try {
      const searchParams = new URLSearchParams();
      if (status) {
        searchParams.append('status', status);
      }

      const response = await fetch(
        `${this.baseURL}/sop/assignments/employee/${employeeId}?${searchParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: APIResponse<SOPAssignment[]> = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch assignments');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching employee assignments:', error);
      throw error;
    }
  }

  async completeAssignment(
    assignmentId: number,
    completionData: {
      completed_by: number;
      completion_notes?: string;
      compliance_verified?: boolean;
    }
  ): Promise<SOPAssignment> {
    try {
      const response = await fetch(
        `${this.baseURL}/sop/assignments/${assignmentId}/complete`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(completionData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: APIResponse<SOPAssignment> = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to complete assignment');
      }

      return result.data;
    } catch (error) {
      console.error('Error completing assignment:', error);
      throw error;
    }
  }

  // =====================================================
  // COMPLIANCE & DASHBOARD
  // =====================================================

  async getComplianceDashboard(): Promise<ComplianceMetrics[]> {
    try {
      const response = await fetch(`${this.baseURL}/sop/compliance/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: APIResponse<ComplianceMetrics[]> = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch compliance dashboard');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching compliance dashboard:', error);
      throw error;
    }
  }

  async getProjectCompliance(projectId: number): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseURL}/sop/compliance/project/${projectId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch project compliance');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching project compliance:', error);
      throw error;
    }
  }

  // =====================================================
  // WORKFLOW AUTOMATION
  // =====================================================

  async triggerWorkflow(workflowData: {
    workflow_type: string;
    trigger_data: any;
    triggered_by_user_id: number;
  }): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/sop/workflows/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflowData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to trigger workflow');
      }

      return result.data;
    } catch (error) {
      console.error('Error triggering workflow:', error);
      throw error;
    }
  }

  // =====================================================
  // MOBILE SYNC
  // =====================================================

  async getMobileSync(employeeId: number): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseURL}/sop/mobile/sync/${employeeId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: APIResponse<any> = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to sync mobile data');
      }

      return result.data;
    } catch (error) {
      console.error('Error syncing mobile data:', error);
      throw error;
    }
  }

  // =====================================================
  // HELPER METHODS
  // =====================================================

  async getSOPStatistics(): Promise<ComplianceMetrics> {
    try {
      const response = await fetch(`${this.baseURL}/sop/statistics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Map backend response to frontend interface
      const stats: ComplianceMetrics = {
        total_assignments: 0, // These would come from assignments if implemented
        completed_assignments: 0,
        overdue_assignments: 0,
        completion_rate: result.data.avg_compliance_rate || 0,
        avg_compliance_rate: result.data.avg_compliance_rate || 0,
        total_sops: result.data.total_sops || 0,
        active_sops: result.data.active_sops || 0,
        florida_specific_sops: result.data.florida_specific_sops || 0,
        hurricane_related_sops: result.data.hurricane_related_sops || 0,
        osha_related_sops: result.data.osha_related_sops || 0,
        critical_priority_sops: result.data.critical_priority_sops || 0,
        high_priority_sops: result.data.high_priority_sops || 0,
      };

      return stats;
    } catch (error) {
      console.error('Error fetching SOP statistics:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const sopService = new SOPService();
export default sopService;