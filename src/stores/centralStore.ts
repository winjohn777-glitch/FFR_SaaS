/**
 * Central Data Store for Florida First Roofing
 * Zustand-based store that manages all unified data entities
 */

import { create } from 'zustand';
import { UnifiedCustomer, UnifiedEmployee, UnifiedProject, DataEvent } from '../types/unified';
import { eventBus } from '../events/eventBus';
import apiClient from '../services/ApiClient';

interface CentralState {
  // Data Collections
  customers: UnifiedCustomer[];
  employees: UnifiedEmployee[];
  projects: UnifiedProject[];

  // Loading States
  loading: {
    customers: boolean;
    employees: boolean;
    projects: boolean;
  };

  // Error States
  errors: {
    customers: string | null;
    employees: string | null;
    projects: string | null;
  };

  // Customer Actions
  addCustomer: (customer: UnifiedCustomer) => Promise<void>;
  updateCustomer: (id: string, updates: Partial<UnifiedCustomer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomer: (id: string) => UnifiedCustomer | undefined;
  getCustomersByStatus: (status: UnifiedCustomer['status']) => UnifiedCustomer[];

  // Employee Actions
  addEmployee: (employee: UnifiedEmployee) => void;
  updateEmployee: (id: string, updates: Partial<UnifiedEmployee>) => void;
  deleteEmployee: (id: string) => void;
  getEmployee: (id: string) => UnifiedEmployee | undefined;
  getAvailableEmployees: () => UnifiedEmployee[];
  getEmployeesByPosition: (position: string) => UnifiedEmployee[];

  // Project Actions
  addProject: (project: UnifiedProject) => void;
  updateProject: (id: string, updates: Partial<UnifiedProject>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => UnifiedProject | undefined;
  getProjectsByStatus: (status: UnifiedProject['status']) => UnifiedProject[];
  getProjectsByCustomer: (customerId: string) => UnifiedProject[];

  // Cross-Module Operations
  convertLeadToCustomer: (leadData: any) => UnifiedCustomer;
  createProjectFromOpportunity: (opportunityData: any, customerId: string) => UnifiedProject;
  assignEmployeeToProject: (employeeId: string, projectId: string, role: string) => void;
  removeEmployeeFromProject: (employeeId: string, projectId: string) => void;

  // Data Synchronization
  syncCustomerData: (customerId: string) => Promise<void>;
  syncEmployeeData: (employeeId: string) => Promise<void>;
  syncProjectData: (projectId: string) => Promise<void>;

  // Bulk Operations
  loadInitialData: () => Promise<void>;
  clearAllData: () => void;

  // Utility Actions
  setLoading: (entity: keyof CentralState['loading'], loading: boolean) => void;
  setError: (entity: keyof CentralState['errors'], error: string | null) => void;
}

export const useCentralStore = create<CentralState>()((set, get) => ({
      // Initial State
      customers: [],
      employees: [],
      projects: [],

      loading: {
        customers: false,
        employees: false,
        projects: false,
      },

      errors: {
        customers: null,
        employees: null,
        projects: null,
      },

      // Customer Actions
      addCustomer: async (customer) => {
        try {
          const response = await apiClient.post('/api/customers', customer);
          if (response.data) {
            set((state) => ({
              customers: [...state.customers, response.data],
            }));

            // Emit event for cross-module synchronization
            eventBus.emit('customer:created', response.data);
          }
        } catch (error) {
          console.error('Error adding customer to database:', error);
          get().setError('customers', 'Failed to add customer to database');
        }
      },

      updateCustomer: (id, updates) => {
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === id
              ? { ...customer, ...updates, updatedAt: new Date().toISOString() }
              : customer
          ),
        }));

        // Emit event for cross-module synchronization
        eventBus.emit('customer:updated', { id, updates });
      },

      deleteCustomer: (id) => {
        set((state) => ({
          customers: state.customers.filter((customer) => customer.id !== id),
        }));

        // Emit event for cross-module synchronization
        eventBus.emit('customer:deleted', { id });
      },

      getCustomer: (id) => {
        return get().customers.find((customer) => customer.id === id);
      },

      getCustomersByStatus: (status) => {
        return get().customers.filter((customer) => customer.status === status);
      },

      // Employee Actions
      addEmployee: (employee) => {
        set((state) => ({
          employees: [...state.employees, employee],
        }));

        // Emit event for cross-module synchronization
        eventBus.emit('employee:hired', employee);
      },

      updateEmployee: (id, updates) => {
        set((state) => ({
          employees: state.employees.map((employee) =>
            employee.id === id
              ? { ...employee, ...updates, updatedAt: new Date().toISOString() }
              : employee
          ),
        }));

        // Emit event for cross-module synchronization
        eventBus.emit('employee:updated', { id, updates });
      },

      deleteEmployee: (id) => {
        set((state) => ({
          employees: state.employees.filter((employee) => employee.id !== id),
        }));

        // Emit event for cross-module synchronization
        eventBus.emit('employee:deleted', { id });
      },

      getEmployee: (id) => {
        return get().employees.find((employee) => employee.id === id);
      },

      getAvailableEmployees: () => {
        return get().employees.filter((employee) =>
          employee.status === 'Active' &&
          employee.availability.status === 'Available'
        );
      },

      getEmployeesByPosition: (position) => {
        return get().employees.filter((employee) =>
          employee.position === position && employee.status === 'Active'
        );
      },

      // Project Actions
      addProject: (project) => {
        set((state) => ({
          projects: [...state.projects, project],
        }));

        // Update customer's project list
        get().updateCustomer(project.customerId, {
          projectIds: [...(get().getCustomer(project.customerId)?.projectIds || []), project.id]
        });

        // Emit event for cross-module synchronization
        eventBus.emit('project:created', project);
      },

      updateProject: (id, updates) => {
        const currentProject = get().getProject(id);

        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, ...updates, updatedAt: new Date().toISOString() }
              : project
          ),
        }));

        // Emit event for status changes
        if (updates.status && currentProject?.status !== updates.status) {
          eventBus.emit('project:status-changed', { id, status: updates.status });
        }

        // Emit general update event
        eventBus.emit('project:updated', { id, updates });
      },

      deleteProject: (id) => {
        const project = get().getProject(id);

        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        }));

        // Remove from customer's project list
        if (project) {
          const customer = get().getCustomer(project.customerId);
          if (customer) {
            get().updateCustomer(project.customerId, {
              projectIds: customer.projectIds.filter((pid) => pid !== id)
            });
          }
        }

        // Emit event for cross-module synchronization
        eventBus.emit('project:deleted', { id });
      },

      getProject: (id) => {
        return get().projects.find((project) => project.id === id);
      },

      getProjectsByStatus: (status) => {
        return get().projects.filter((project) => project.status === status);
      },

      getProjectsByCustomer: (customerId) => {
        return get().projects.filter((project) => project.customerId === customerId);
      },

      // Cross-Module Operations
      convertLeadToCustomer: (leadData) => {
        const customerId = `CUST-${Date.now()}`;
        const customer: UnifiedCustomer = {
          id: customerId,
          type: leadData.propertyType === 'Commercial' ? 'Commercial' : 'Residential',
          status: 'Prospect',
          firstName: leadData.firstName,
          lastName: leadData.lastName,
          companyName: leadData.companyName,
          email: leadData.email,
          phone: leadData.phone,
          alternatePhone: leadData.alternatePhone,
          address: leadData.address,
          propertyType: leadData.propertyType,
          roofType: leadData.roofType || 'Unknown',
          leadSource: leadData.source,
          referredBy: leadData.referredBy,
          marketingCampaign: leadData.campaign,
          tags: [],
          accountsReceivableId: `AR-${customerId}`,
          paymentTerms: leadData.propertyType === 'Commercial' ? 'Net 15' : 'Net 30',
          taxExempt: false,
          totalLifetimeValue: 0,
          outstandingBalance: 0,
          projectIds: [],
          invoiceIds: [],
          communicationHistory: [],
          notes: leadData.notes || '',
          dateAdded: new Date().toISOString(),
          lastContact: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        get().addCustomer(customer);

        // Emit lead conversion event
        eventBus.emit('lead:converted', { leadId: leadData.id, customerId });

        return customer;
      },

      createProjectFromOpportunity: (opportunityData, customerId) => {
        const projectId = `PROJ-${Date.now()}`;
        const project: UnifiedProject = {
          id: projectId,
          projectNumber: `FFR-${new Date().getFullYear()}-${projectId.slice(-6)}`,
          name: opportunityData.name,
          customerId,
          opportunityId: opportunityData.id,
          type: opportunityData.projectType,
          status: 'Planning',
          priority: 'Medium',
          description: opportunityData.description || '',
          address: opportunityData.address || get().getCustomer(customerId)?.address!,
          propertyType: opportunityData.propertyType || 'Single Family',
          roofType: opportunityData.roofingMaterial,
          squareFootage: opportunityData.squareFootage || 0,
          stories: 1,
          estimatedStartDate: opportunityData.estimatedStartDate || '',
          estimatedEndDate: opportunityData.estimatedCompletionDate || '',
          contractAmount: opportunityData.estimatedValue,
          estimatedCost: opportunityData.estimatedValue * 0.7, // Assume 30% profit margin
          actualCost: 0,
          profitMargin: 30,
          billingType: 'Fixed Price',
          projectManagerId: '',
          assignedEmployees: [],
          subcontractors: [],
          materials: [],
          equipment: [],
          permits: [],
          inspections: [],
          documentIds: [],
          jobCostingId: `JC-${projectId}`,
          costEntries: [],
          invoiceIds: [],
          billingSchedule: [],
          milestones: [],
          progressPercentage: 0,
          photos: [],
          weatherDependencies: [],
          seasonalConstraints: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        get().addProject(project);

        // Emit opportunity won event
        eventBus.emit('opportunity:won', { opportunityId: opportunityData.id, projectId });

        return project;
      },

      assignEmployeeToProject: (employeeId, projectId, role) => {
        const project = get().getProject(projectId);
        const employee = get().getEmployee(employeeId);

        if (project && employee) {
          // Update project with new assignment
          const newAssignment = {
            employeeId,
            role,
            assignedDate: new Date().toISOString(),
            estimatedHours: 0,
            actualHours: 0,
            status: 'Assigned' as const,
          };

          get().updateProject(projectId, {
            assignedEmployees: [...project.assignedEmployees, newAssignment],
          });

          // Update employee with new project
          get().updateEmployee(employeeId, {
            currentProjectIds: [...employee.currentProjectIds, projectId],
            availability: {
              ...employee.availability,
              status: 'Assigned',
            },
          });

          // Emit assignment event
          eventBus.emit('employee:assigned', { employeeId, projectId, role });
        }
      },

      removeEmployeeFromProject: (employeeId, projectId) => {
        const project = get().getProject(projectId);
        const employee = get().getEmployee(employeeId);

        if (project && employee) {
          // Update project to remove assignment
          get().updateProject(projectId, {
            assignedEmployees: project.assignedEmployees.filter(
              (assignment) => assignment.employeeId !== employeeId
            ),
          });

          // Update employee to remove project
          const remainingProjects = employee.currentProjectIds.filter((id) => id !== projectId);
          get().updateEmployee(employeeId, {
            currentProjectIds: remainingProjects,
            availability: {
              ...employee.availability,
              status: remainingProjects.length > 0 ? 'Assigned' : 'Available',
            },
          });

          // Emit unassignment event
          eventBus.emit('employee:unassigned', { employeeId, projectId });
        }
      },

      // Data Synchronization
      syncCustomerData: async (customerId) => {
        get().setLoading('customers', true);
        try {
          // Here you would implement actual API calls to sync data
          // For now, we'll just emit an event
          eventBus.emit('sync:customer', { customerId });
        } catch (error) {
          get().setError('customers', `Failed to sync customer ${customerId}`);
        } finally {
          get().setLoading('customers', false);
        }
      },

      syncEmployeeData: async (employeeId) => {
        get().setLoading('employees', true);
        try {
          // Here you would implement actual API calls to sync data
          eventBus.emit('sync:employee', { employeeId });
        } catch (error) {
          get().setError('employees', `Failed to sync employee ${employeeId}`);
        } finally {
          get().setLoading('employees', false);
        }
      },

      syncProjectData: async (projectId) => {
        get().setLoading('projects', true);
        try {
          // Here you would implement actual API calls to sync data
          eventBus.emit('sync:project', { projectId });
        } catch (error) {
          get().setError('projects', `Failed to sync project ${projectId}`);
        } finally {
          get().setLoading('projects', false);
        }
      },

      // Bulk Operations
      loadInitialData: async () => {
        // Load customers
        get().setLoading('customers', true);
        get().setLoading('employees', true);
        get().setLoading('projects', true);

        try {
          // Load customers from database
          const customersResponse = await apiClient.get('/api/customers');
          if (customersResponse.data) {
            set((state) => ({
              customers: customersResponse.data,
            }));
          }

          // Load employees from database
          const employeesResponse = await apiClient.get('/api/employees');
          if (employeesResponse.data) {
            set((state) => ({
              employees: employeesResponse.data,
            }));
          }

          // Load jobs/projects from database
          const jobsResponse = await apiClient.get('/api/jobs');
          if (jobsResponse.data) {
            set((state) => ({
              projects: jobsResponse.data,
            }));
          }

          // Clear errors
          get().setError('customers', null);
          get().setError('employees', null);
          get().setError('projects', null);
        } catch (error) {
          console.error('Failed to load initial data from database:', error);
          get().setError('customers', 'Failed to load customer data');
          get().setError('employees', 'Failed to load employee data');
          get().setError('projects', 'Failed to load project data');
        } finally {
          get().setLoading('customers', false);
          get().setLoading('employees', false);
          get().setLoading('projects', false);
        }
      },

      clearAllData: () => {
        set({
          customers: [],
          employees: [],
          projects: [],
          errors: {
            customers: null,
            employees: null,
            projects: null,
          },
        });
      },

      // Utility Actions
      setLoading: (entity, loading) => {
        set((state) => ({
          loading: {
            ...state.loading,
            [entity]: loading,
          },
        }));
      },

      setError: (entity, error) => {
        set((state) => ({
          errors: {
            ...state.errors,
            [entity]: error,
          },
        }));
      },
    }));

// Export selectors for common use cases
export const useCustomers = () => useCentralStore((state) => state.customers);
export const useEmployees = () => useCentralStore((state) => state.employees);
export const useProjects = () => useCentralStore((state) => state.projects);

export const useCustomerById = (id: string) =>
  useCentralStore((state) => state.customers.find((customer) => customer.id === id));

export const useEmployeeById = (id: string) =>
  useCentralStore((state) => state.employees.find((employee) => employee.id === id));

export const useProjectById = (id: string) =>
  useCentralStore((state) => state.projects.find((project) => project.id === id));

export const useProjectsByCustomer = (customerId: string) =>
  useCentralStore((state) => state.projects.filter((project) => project.customerId === customerId));

export const useAvailableEmployees = () =>
  useCentralStore((state) => state.employees.filter((employee) =>
    employee.status === 'Active' && employee.availability.status === 'Available'
  ));

export const useActiveProjects = () =>
  useCentralStore((state) => state.projects.filter((project) =>
    project.status === 'In Progress'
  ));

export default useCentralStore;