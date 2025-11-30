/**
 * Data Synchronization Hooks
 * Custom hooks for managing cross-module data synchronization
 */

import { useCallback, useEffect, useState } from 'react';
import { useCentralStore } from '../stores/centralStore';
import { eventBus, useEventSubscription } from '../events/eventBus';
import { UnifiedCustomer, UnifiedEmployee, UnifiedProject, ProjectType, RoofType } from '../types/unified';
import { Customer, Lead, Opportunity } from '../types/crm';

// Import services (these would be implemented based on your backend)
// import { AccountingService } from '../services/accountingService';
// import { DocumentService } from '../services/documentService';
// import { TrainingService } from '../services/trainingService';
// import { PayrollService } from '../services/payrollService';
// import { TimeTrackingService } from '../services/timeTrackingService';
// import { JobCostingService } from '../services/jobCostingService';
// import { InventoryService } from '../services/inventoryService';
// import { PermitService } from '../services/permitService';

interface SyncResult {
  success: boolean;
  error?: string;
  data?: any;
}

/**
 * Main data synchronization hook
 */
export const useDataSync = () => {
  const {
    addCustomer,
    addEmployee,
    addProject,
    updateCustomer,
    updateEmployee,
    updateProject,
  } = useCentralStore();

  const [syncStatus, setSyncStatus] = useState<{
    customer: boolean;
    employee: boolean;
    project: boolean;
  }>({
    customer: false,
    employee: false,
    project: false,
  });

  /**
   * Convert CRM Lead to Unified Customer and sync across modules
   */
  const syncCustomerFromLead = useCallback(async (lead: Lead): Promise<SyncResult> => {
    setSyncStatus(prev => ({ ...prev, customer: true }));

    try {
      // Create unified customer from lead data
      const customer: UnifiedCustomer = {
        id: `CUST-${Date.now()}`,
        type: lead.propertyType === 'Commercial' ? 'Commercial' : 'Residential',
        status: 'Prospect',
        firstName: lead.firstName,
        lastName: lead.lastName,
        companyName: lead.companyName,
        email: lead.email,
        phone: lead.phone,
        alternatePhone: undefined,
        address: lead.address,
        propertyType: lead.propertyType as any,
        roofType: lead.roofType as any,
        leadSource: lead.source,
        referredBy: lead.referredBy,
        marketingCampaign: lead.campaign,
        tags: [],
        accountsReceivableId: `AR-${Date.now()}`,
        paymentTerms: lead.propertyType === 'Commercial' ? 'Net 15' : 'Net 30',
        taxExempt: false,
        totalLifetimeValue: 0,
        outstandingBalance: 0,
        projectIds: [],
        invoiceIds: [],
        communicationHistory: lead.communications.map(comm => ({
          id: comm.id,
          type: comm.type as any,
          direction: comm.direction,
          date: comm.date,
          duration: comm.duration,
          subject: comm.subject,
          notes: comm.notes,
          outcome: comm.outcome,
          followUpRequired: comm.followUpRequired,
          followUpDate: comm.followUpDate,
          createdBy: comm.createdBy,
        })),
        notes: lead.notes,
        dateAdded: lead.dateCreated,
        lastContact: lead.lastContact,
        nextFollowUp: lead.nextFollowUp,
        updatedAt: new Date().toISOString(),
      };

      // Add to central store
      addCustomer(customer);

      // Sync with accounting system
      // await AccountingService.createCustomerAccount(customer);

      // Create document folder structure
      // await DocumentService.createCustomerFolder(customer.id);

      console.log('Customer synced successfully from lead:', customer.id);

      return { success: true, data: customer };
    } catch (error) {
      console.error('Failed to sync customer from lead:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    } finally {
      setSyncStatus(prev => ({ ...prev, customer: false }));
    }
  }, [addCustomer]);

  /**
   * Employee onboarding with automatic module synchronization
   */
  const syncEmployeeOnboarding = useCallback(async (employeeData: Partial<UnifiedEmployee>): Promise<SyncResult> => {
    setSyncStatus(prev => ({ ...prev, employee: true }));

    try {
      const employee: UnifiedEmployee = {
        id: `EMP-${Date.now()}`,
        employeeNumber: employeeData.employeeNumber || `E${Date.now().toString().slice(-6)}`,
        firstName: employeeData.firstName!,
        lastName: employeeData.lastName!,
        position: employeeData.position!,
        department: employeeData.department || 'Operations',
        hireDate: employeeData.hireDate || new Date().toISOString(),
        status: 'Active',
        hourlyRate: employeeData.hourlyRate || 0,
        payrollId: `PAY-${Date.now()}`,
        phone: employeeData.phone || '',
        email: employeeData.email || '',
        address: employeeData.address || {
          street: '',
          city: '',
          state: 'FL',
          zipCode: '',
          county: '',
        },
        emergencyContact: employeeData.emergencyContact || {
          name: '',
          relationship: '',
          phone: '',
        },
        certifications: [],
        trainingEnrollments: [],
        oshaCompliance: {
          osha10Certified: false,
          osha30Certified: false,
          lastSafetyTraining: '',
          safetyViolations: [],
          nextTrainingDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        },
        licenseExpirations: [],
        currentProjectIds: [],
        availability: {
          status: 'Available',
          availableHours: 40,
          workSchedule: {
            monday: { available: true, startTime: '07:00', endTime: '15:30', totalHours: 8 },
            tuesday: { available: true, startTime: '07:00', endTime: '15:30', totalHours: 8 },
            wednesday: { available: true, startTime: '07:00', endTime: '15:30', totalHours: 8 },
            thursday: { available: true, startTime: '07:00', endTime: '15:30', totalHours: 8 },
            friday: { available: true, startTime: '07:00', endTime: '15:30', totalHours: 8 },
            saturday: { available: false, totalHours: 0 },
            sunday: { available: false, totalHours: 0 },
          },
          timeOffRequests: [],
        },
        skills: employeeData.skills || [],
        certifiedEquipment: [],
        timeTrackingId: `TT-${Date.now()}`,
        defaultHoursPerWeek: 40,
        documentPermissions: [],
        securityClearance: 'Basic',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to central store
      addEmployee(employee);

      // Auto-enroll in required training based on position
      // const requiredCourses = await TrainingService.getRequiredCourses(employee.position);
      // for (const course of requiredCourses) {
      //   await TrainingService.enrollEmployee(employee.id, course.id);
      // }

      // Create payroll entry
      // await PayrollService.createEmployeeRecord(employee);

      // Setup time tracking
      // await TimeTrackingService.setupEmployee(employee.id);

      // Grant document permissions based on position
      // const permissions = DocumentService.getPositionPermissions(employee.position);
      // await DocumentService.grantPermissions(employee.id, permissions);

      console.log('Employee onboarded successfully:', employee.id);

      return { success: true, data: employee };
    } catch (error) {
      console.error('Failed to onboard employee:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    } finally {
      setSyncStatus(prev => ({ ...prev, employee: false }));
    }
  }, [addEmployee]);

  /**
   * Project creation with cross-module synchronization
   */
  const syncProjectCreation = useCallback(async (
    projectData: Partial<UnifiedProject>,
    customerId: string
  ): Promise<SyncResult> => {
    setSyncStatus(prev => ({ ...prev, project: true }));

    try {
      const projectId = `PROJ-${Date.now()}`;
      const project: UnifiedProject = {
        id: projectId,
        projectNumber: `FFR-${new Date().getFullYear()}-${projectId.slice(-6)}`,
        name: projectData.name!,
        customerId,
        opportunityId: projectData.opportunityId,
        type: projectData.type || 'Repair',
        status: 'Planning',
        priority: projectData.priority || 'Medium',
        description: projectData.description || '',
        address: projectData.address!,
        propertyType: projectData.propertyType || 'Single Family',
        roofType: projectData.roofType || 'Shingle',
        squareFootage: projectData.squareFootage || 0,
        stories: projectData.stories || 1,
        estimatedStartDate: projectData.estimatedStartDate || '',
        estimatedEndDate: projectData.estimatedEndDate || '',
        contractAmount: projectData.contractAmount || 0,
        estimatedCost: projectData.estimatedCost || 0,
        actualCost: 0,
        profitMargin: projectData.profitMargin || 30,
        billingType: projectData.billingType || 'Fixed Price',
        projectManagerId: projectData.projectManagerId || '',
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

      // Add to central store
      addProject(project);

      // Create job costing structure
      // await JobCostingService.createProject(project);

      // Setup document structure
      // await DocumentService.createProjectStructure(project.id);

      // Allocate inventory if materials are specified
      // if (project.materials.length > 0) {
      //   await InventoryService.allocateProjectMaterials(project.id, project.materials);
      // }

      // Create permit applications if needed
      // if (project.permits.length > 0) {
      //   await PermitService.createApplications(project.id, project.permits);
      // }

      console.log('Project created successfully:', project.id);

      return { success: true, data: project };
    } catch (error) {
      console.error('Failed to create project:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    } finally {
      setSyncStatus(prev => ({ ...prev, project: false }));
    }
  }, [addProject]);

  /**
   * Opportunity to Project conversion
   */
  const syncOpportunityWon = useCallback(async (
    opportunity: Opportunity,
    customerId: string
  ): Promise<SyncResult> => {
    try {
      const projectData: Partial<UnifiedProject> = {
        name: opportunity.name,
        opportunityId: opportunity.id,
        type: opportunity.projectType as ProjectType,
        description: opportunity.description,
        contractAmount: opportunity.actualValue || opportunity.estimatedValue,
        estimatedCost: (opportunity.actualValue || opportunity.estimatedValue) * 0.7,
        roofType: opportunity.roofingMaterial as RoofType,
        squareFootage: opportunity.squareFootage,
        estimatedStartDate: opportunity.estimatedStartDate,
        estimatedEndDate: opportunity.estimatedCompletionDate,
      };

      return await syncProjectCreation(projectData, customerId);
    } catch (error) {
      console.error('Failed to convert opportunity to project:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }, [syncProjectCreation]);

  /**
   * Account data synchronization for Chart of Accounts
   */
  const syncAccountData = useCallback(async (accountData: {
    code: string;
    name: string;
    type: string;
    description: string;
    category: string;
    subCategory: string;
    balance: number;
    lastUpdated: string;
  }): Promise<SyncResult> => {
    try {
      console.log('Syncing account data:', accountData);

      // In a real implementation, this would sync with accounting system
      // await AccountingService.createOrUpdateAccount(accountData);

      // Emit event for cross-module synchronization
      eventBus.emit('data:account:updated' as any, {
        accountId: accountData.code,
        accountData,
        timestamp: new Date().toISOString(),
      });

      return { success: true, data: accountData };
    } catch (error) {
      console.error('Failed to sync account data:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }, []);

  return {
    syncCustomerFromLead,
    syncEmployeeOnboarding,
    syncProjectCreation,
    syncOpportunityWon,
    syncAccountData,
    syncStatus,
  };
};

/**
 * Hook for automatic data synchronization based on events
 */
export const useAutoSync = () => {
  const { syncCustomerFromLead, syncEmployeeOnboarding, syncOpportunityWon } = useDataSync();

  // Listen for lead conversion events
  useEventSubscription('lead:converted', async (data) => {
    console.log('Auto-syncing converted lead:', data.leadId);
    // In a real implementation, you would fetch the lead data and sync
  });

  // Listen for opportunity won events
  useEventSubscription('opportunity:won', async (data) => {
    console.log('Auto-syncing won opportunity:', data.opportunityId);
    // In a real implementation, you would fetch the opportunity data and sync
  });

  // Listen for employee hired events
  useEventSubscription('employee:hired', async (employee) => {
    console.log('Auto-processing new employee hire:', employee.id);
    // Additional processing could be done here
  });
};

/**
 * Hook for monitoring sync status across the application
 */
export const useSyncMonitor = () => {
  const [syncEvents, setSyncEvents] = useState<Array<{
    type: string;
    entityId: string;
    status: 'pending' | 'success' | 'error';
    timestamp: string;
    error?: string;
  }>>([]);

  useEventSubscription('sync:customer', (data) => {
    setSyncEvents(prev => [...prev, {
      type: 'customer',
      entityId: data.customerId,
      status: 'pending',
      timestamp: new Date().toISOString(),
    }]);
  });

  useEventSubscription('sync:employee', (data) => {
    setSyncEvents(prev => [...prev, {
      type: 'employee',
      entityId: data.employeeId,
      status: 'pending',
      timestamp: new Date().toISOString(),
    }]);
  });

  useEventSubscription('sync:project', (data) => {
    setSyncEvents(prev => [...prev, {
      type: 'project',
      entityId: data.projectId,
      status: 'pending',
      timestamp: new Date().toISOString(),
    }]);
  });

  useEventSubscription('sync:completed', (data) => {
    setSyncEvents(prev => prev.map(event =>
      event.entityId === data.entityId
        ? { ...event, status: data.success ? 'success' : 'error' }
        : event
    ));
  });

  const clearSyncHistory = useCallback(() => {
    setSyncEvents([]);
  }, []);

  return {
    syncEvents,
    clearSyncHistory,
    pendingSyncs: syncEvents.filter(e => e.status === 'pending').length,
    failedSyncs: syncEvents.filter(e => e.status === 'error').length,
  };
};

/**
 * Hook for data consistency validation
 */
export const useDataConsistency = () => {
  const { customers, employees, projects } = useCentralStore();
  const [issues, setIssues] = useState<Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    entityId: string;
  }>>([]);

  const validateConsistency = useCallback(() => {
    const newIssues: typeof issues = [];

    // Check for orphaned project assignments
    projects.forEach(project => {
      project.assignedEmployees.forEach(assignment => {
        const employee = employees.find(e => e.id === assignment.employeeId);
        if (!employee) {
          newIssues.push({
            type: 'orphaned_assignment',
            description: `Project ${project.name} has assignment to non-existent employee ${assignment.employeeId}`,
            severity: 'high',
            entityId: project.id,
          });
        }
      });

      // Check if customer exists
      const customer = customers.find(c => c.id === project.customerId);
      if (!customer) {
        newIssues.push({
          type: 'orphaned_project',
          description: `Project ${project.name} references non-existent customer ${project.customerId}`,
          severity: 'critical',
          entityId: project.id,
        });
      }
    });

    // Check for employees with invalid project assignments
    employees.forEach(employee => {
      employee.currentProjectIds.forEach(projectId => {
        const project = projects.find(p => p.id === projectId);
        if (!project) {
          newIssues.push({
            type: 'invalid_project_reference',
            description: `Employee ${employee.firstName} ${employee.lastName} references non-existent project ${projectId}`,
            severity: 'medium',
            entityId: employee.id,
          });
        }
      });
    });

    setIssues(newIssues);
    return newIssues;
  }, [customers, employees, projects]);

  useEffect(() => {
    validateConsistency();
  }, [validateConsistency]);

  return {
    issues,
    validateConsistency,
    hasIssues: issues.length > 0,
    criticalIssues: issues.filter(i => i.severity === 'critical').length,
  };
};

export default useDataSync;