/**
 * API Service Layer for Florida First Roofing Accounting
 * Handles communication with PostgreSQL backend via REST API
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

// Default organization ID - in production this would come from authentication
const DEFAULT_ORG_ID = '4d6eb8c6-95cc-41d8-bc8d-2f90be932a97';

export interface APIResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

// Generic API request helper
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<APIResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'x-user-id': 'admin-user-id', // In production, get from auth context
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers: defaultHeaders
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        message: errorData.message
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown API error'
    };
  }
}

// Employee API Service
export const EmployeeService = {
  async getAll() {
    return apiRequest(`/employees?organizationId=${DEFAULT_ORG_ID}`);
  },

  async create(employee: any) {
    return apiRequest(`/employees`, {
      method: 'POST',
      body: JSON.stringify({
        ...employee,
        organizationId: DEFAULT_ORG_ID
      })
    });
  },

  async update(id: string, updates: any) {
    return apiRequest(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async delete(id: string) {
    return apiRequest(`/employees/${id}`, {
      method: 'DELETE'
    });
  }
};

// Training Session API Service
export const TrainingService = {
  async getAll() {
    return apiRequest(`/training/sessions?organizationId=${DEFAULT_ORG_ID}`);
  },

  async getUpcoming() {
    return apiRequest(`/training/upcoming?organizationId=${DEFAULT_ORG_ID}`);
  },

  async getByEmployee(employeeId: string) {
    return apiRequest(`/training/sessions?organizationId=${DEFAULT_ORG_ID}&employeeId=${employeeId}`);
  },

  async create(session: any) {
    return apiRequest(`/training/sessions`, {
      method: 'POST',
      body: JSON.stringify({
        ...session,
        organizationId: DEFAULT_ORG_ID
      })
    });
  },

  async update(id: string, updates: any) {
    return apiRequest(`/training/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async delete(id: string) {
    return apiRequest(`/training/sessions/${id}`, {
      method: 'DELETE'
    });
  }
};

// Health Check Service
export const HealthService = {
  async check() {
    return apiRequest('/health');
  }
};

// Customer API Service
export const CustomerService = {
  async getAll() {
    return apiRequest(`/customers?organizationId=${DEFAULT_ORG_ID}`);
  },

  async getById(id: string) {
    return apiRequest(`/customers/${id}`);
  },

  async create(customer: any) {
    return apiRequest(`/customers`, {
      method: 'POST',
      body: JSON.stringify({
        ...customer,
        organizationId: DEFAULT_ORG_ID
      })
    });
  },

  async update(id: string, updates: any) {
    return apiRequest(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async delete(id: string) {
    return apiRequest(`/customers/${id}`, {
      method: 'DELETE'
    });
  }
};

// Lead API Service
export const LeadService = {
  async getAll() {
    return apiRequest(`/leads?organizationId=${DEFAULT_ORG_ID}`);
  },

  async getById(id: string) {
    return apiRequest(`/leads/${id}`);
  },

  async create(lead: any) {
    return apiRequest(`/leads`, {
      method: 'POST',
      body: JSON.stringify({
        ...lead,
        organizationId: DEFAULT_ORG_ID
      })
    });
  },

  async update(id: string, updates: any) {
    return apiRequest(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async delete(id: string) {
    return apiRequest(`/leads/${id}`, {
      method: 'DELETE'
    });
  }
};

// Opportunity API Service
export const OpportunityService = {
  async getAll() {
    return apiRequest(`/opportunities?organizationId=${DEFAULT_ORG_ID}`);
  },

  async getById(id: string) {
    return apiRequest(`/opportunities/${id}`);
  },

  async create(opportunity: any) {
    return apiRequest(`/opportunities`, {
      method: 'POST',
      body: JSON.stringify({
        ...opportunity,
        organizationId: DEFAULT_ORG_ID
      })
    });
  },

  async update(id: string, updates: any) {
    return apiRequest(`/opportunities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async delete(id: string) {
    return apiRequest(`/opportunities/${id}`, {
      method: 'DELETE'
    });
  }
};

// Job API Service
export const JobService = {
  async getAll() {
    return apiRequest(`/jobs?organizationId=${DEFAULT_ORG_ID}`);
  },

  async getById(id: string) {
    return apiRequest(`/jobs/${id}`);
  },

  async create(job: any) {
    return apiRequest(`/jobs`, {
      method: 'POST',
      body: JSON.stringify({
        ...job,
        organizationId: DEFAULT_ORG_ID
      })
    });
  },

  async update(id: string, updates: any) {
    return apiRequest(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async delete(id: string) {
    return apiRequest(`/jobs/${id}`, {
      method: 'DELETE'
    });
  }
};

// Inventory API Service
export const InventoryService = {
  async getAll() {
    return apiRequest(`/inventory?organizationId=${DEFAULT_ORG_ID}`);
  },

  async getById(id: string) {
    return apiRequest(`/inventory/${id}`);
  },

  async create(item: any) {
    return apiRequest(`/inventory`, {
      method: 'POST',
      body: JSON.stringify({
        ...item,
        organizationId: DEFAULT_ORG_ID
      })
    });
  },

  async update(id: string, updates: any) {
    return apiRequest(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async delete(id: string) {
    return apiRequest(`/inventory/${id}`, {
      method: 'DELETE'
    });
  },

  async adjustQuantity(id: string, adjustment: number, reason: string) {
    return apiRequest(`/inventory/${id}/adjust`, {
      method: 'POST',
      body: JSON.stringify({ adjustment, reason })
    });
  }
};

// Document API Service
export const DocumentService = {
  async getAll() {
    return apiRequest(`/documents?organizationId=${DEFAULT_ORG_ID}`);
  },

  async getById(id: string) {
    return apiRequest(`/documents/${id}`);
  },

  async create(document: any) {
    return apiRequest(`/documents`, {
      method: 'POST',
      body: JSON.stringify({
        ...document,
        organizationId: DEFAULT_ORG_ID
      })
    });
  },

  async update(id: string, updates: any) {
    return apiRequest(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async delete(id: string) {
    return apiRequest(`/documents/${id}`, {
      method: 'DELETE'
    });
  },

  async search(searchTerm: string, filters: any = {}) {
    return apiRequest(`/documents/search`, {
      method: 'POST',
      body: JSON.stringify({
        organizationId: DEFAULT_ORG_ID,
        searchTerm,
        filters
      })
    });
  }
};

// Transaction API Service
export const TransactionService = {
  async getAll() {
    return apiRequest(`/transactions?organizationId=${DEFAULT_ORG_ID}`);
  },

  async getById(id: string) {
    return apiRequest(`/transactions/${id}`);
  },

  async create(transaction: any) {
    return apiRequest(`/transactions`, {
      method: 'POST',
      body: JSON.stringify({
        ...transaction,
        organizationId: DEFAULT_ORG_ID
      })
    });
  },

  async update(id: string, updates: any) {
    return apiRequest(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  async delete(id: string) {
    return apiRequest(`/transactions/${id}`, {
      method: 'DELETE'
    });
  },

  async getSummary(period: 'week' | 'month' | 'quarter' | 'year') {
    return apiRequest(`/transactions/summary/${period}?organizationId=${DEFAULT_ORG_ID}`);
  }
};

// Generic Organization Service (for getting org ID in future)
export const OrganizationService = {
  async getDefault() {
    return apiRequest('/organizations');
  }
};

export default {
  EmployeeService,
  TrainingService,
  CustomerService,
  LeadService,
  OpportunityService,
  JobService,
  InventoryService,
  DocumentService,
  TransactionService,
  HealthService,
  OrganizationService
};