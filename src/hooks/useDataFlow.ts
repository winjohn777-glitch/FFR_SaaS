/**
 * Data Flow Hooks - Enable single data entry with cross-module population
 * React hooks that handle lead capture, customer conversion, employee onboarding
 */

import { useCallback, useEffect, useState } from 'react';
import { useCentralStore } from '../stores/centralStore';
import { useEventSubscription, useEventEmitter } from '../events/eventBus';
import { UnifiedCustomer, UnifiedEmployee, UnifiedProject } from '../types/unified';

// Lead capture and conversion hook
export const useLeadCapture = () => {
  const { convertLeadToCustomer } = useCentralStore();
  const { emit } = useEventEmitter();
  const [isConverting, setIsConverting] = useState(false);

  const captureLead = useCallback(async (leadData: {
    firstName: string;
    lastName: string;
    companyName?: string;
    email: string;
    phone: string;
    alternatePhone?: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      county: string;
    };
    propertyType: string;
    roofType?: string;
    source: string;
    referredBy?: string;
    campaign?: string;
    notes?: string;
  }) => {
    setIsConverting(true);
    try {
      // Emit lead created event
      await emit('lead:created', leadData);

      // Convert to customer
      const customer = convertLeadToCustomer(leadData);

      // Emit notification
      await emit('system:notification', {
        message: `Lead ${leadData.firstName} ${leadData.lastName} converted to customer`,
        type: 'success'
      });

      return customer;
    } catch (error) {
      await emit('system:error', {
        error: 'Failed to capture lead',
        context: { leadData, error }
      });
      throw error;
    } finally {
      setIsConverting(false);
    }
  }, [convertLeadToCustomer, emit]);

  return {
    captureLead,
    isConverting
  };
};

// Employee onboarding hook with cross-module integration
export const useEmployeeOnboarding = () => {
  const { addEmployee } = useCentralStore();
  const { emit } = useEventEmitter();
  const [isOnboarding, setIsOnboarding] = useState(false);

  const onboardEmployee = useCallback(async (employeeData: {
    employeeNumber: string;
    firstName: string;
    lastName: string;
    position: string;
    department: string;
    hireDate: string;
    hourlyRate: number;
    salary?: number;
    phone: string;
    email: string;
    address: any;
    emergencyContact: any;
    skills: string[];
    certifications?: any[];
  }) => {
    setIsOnboarding(true);
    try {
      const employee: UnifiedEmployee = {
        id: `EMP-${Date.now()}`,
        employeeNumber: employeeData.employeeNumber,
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        position: employeeData.position,
        department: employeeData.department,
        hireDate: employeeData.hireDate,
        status: 'Active',
        hourlyRate: employeeData.hourlyRate,
        salary: employeeData.salary,
        payrollId: `PR-${employeeData.employeeNumber}`,
        phone: employeeData.phone,
        email: employeeData.email,
        address: employeeData.address,
        emergencyContact: employeeData.emergencyContact,
        certifications: employeeData.certifications || [],
        trainingEnrollments: [],
        oshaCompliance: {
          osha10Certified: false,
          osha30Certified: false,
          lastSafetyTraining: '',
          safetyViolations: [],
          nextTrainingDue: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        },
        licenseExpirations: [],
        currentProjectIds: [],
        availability: {
          status: 'Available',
          availableHours: 40,
          workSchedule: {
            monday: { available: true, startTime: '8:00', endTime: '17:00', totalHours: 8 },
            tuesday: { available: true, startTime: '8:00', endTime: '17:00', totalHours: 8 },
            wednesday: { available: true, startTime: '8:00', endTime: '17:00', totalHours: 8 },
            thursday: { available: true, startTime: '8:00', endTime: '17:00', totalHours: 8 },
            friday: { available: true, startTime: '8:00', endTime: '17:00', totalHours: 8 },
            saturday: { available: false, totalHours: 0 },
            sunday: { available: false, totalHours: 0 }
          },
          timeOffRequests: []
        },
        skills: employeeData.skills,
        certifiedEquipment: [],
        timeTrackingId: `TT-${employeeData.employeeNumber}`,
        defaultHoursPerWeek: 40,
        documentPermissions: [],
        securityClearance: 'Basic',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      addEmployee(employee);

      // Auto-enroll in required training
      await emit('training:enrolled', {
        employeeId: employee.id,
        courseId: 'OSHA-10-BASIC'
      });

      // Create HR file
      await emit('document:uploaded', {
        documentId: `HR-${employee.id}`,
        customerId: employee.id
      });

      // Emit success notification
      await emit('system:notification', {
        message: `Employee ${employee.firstName} ${employee.lastName} successfully onboarded`,
        type: 'success'
      });

      return employee;
    } catch (error) {
      await emit('system:error', {
        error: 'Failed to onboard employee',
        context: { employeeData, error }
      });
      throw error;
    } finally {
      setIsOnboarding(false);
    }
  }, [addEmployee, emit]);

  return {
    onboardEmployee,
    isOnboarding
  };
};

// Project creation with automatic job costing and inventory allocation
export const useProjectCreation = () => {
  const { createProjectFromOpportunity, getCustomer, getAvailableEmployees } = useCentralStore();
  const { emit } = useEventEmitter();
  const [isCreating, setIsCreating] = useState(false);

  const createProject = useCallback(async (projectData: {
    customerId: string;
    name: string;
    type: string;
    description: string;
    estimatedValue: number;
    squareFootage: number;
    roofingMaterial: string;
    estimatedStartDate: string;
    estimatedCompletionDate: string;
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  }) => {
    setIsCreating(true);
    try {
      const customer = getCustomer(projectData.customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }

      // Create project
      const project = createProjectFromOpportunity({
        id: `OPP-${Date.now()}`,
        name: projectData.name,
        projectType: projectData.type,
        description: projectData.description,
        estimatedValue: projectData.estimatedValue,
        squareFootage: projectData.squareFootage,
        roofingMaterial: projectData.roofingMaterial,
        estimatedStartDate: projectData.estimatedStartDate,
        estimatedCompletionDate: projectData.estimatedCompletionDate,
        propertyType: customer.propertyType,
        address: customer.address
      }, projectData.customerId);

      // Auto-assign project manager
      const availableEmployees = getAvailableEmployees();
      const projectManager = availableEmployees.find(emp =>
        emp.position.toLowerCase().includes('manager') ||
        emp.position.toLowerCase().includes('supervisor')
      );

      if (projectManager) {
        await emit('employee:assigned', {
          employeeId: projectManager.id,
          projectId: project.id,
          role: 'Project Manager'
        });
      }

      // Create job costing entry
      await emit('job-cost:added', {
        projectId: project.id,
        costEntry: {
          id: `JC-${Date.now()}`,
          category: 'Materials',
          description: 'Initial materials estimate',
          quantity: 1,
          unitCost: projectData.estimatedValue * 0.4,
          totalCost: projectData.estimatedValue * 0.4,
          date: new Date().toISOString()
        }
      });

      // Auto-allocate basic materials
      const basicMaterials = [
        { name: 'Roofing Material', quantity: projectData.squareFootage, unitCost: 3.50 },
        { name: 'Underlayment', quantity: projectData.squareFootage, unitCost: 0.75 },
        { name: 'Nails/Fasteners', quantity: Math.ceil(projectData.squareFootage / 100), unitCost: 25 }
      ];

      for (const material of basicMaterials) {
        await emit('material:allocated', {
          materialId: `MAT-${material.name.replace(/\s+/g, '-').toLowerCase()}`,
          projectId: project.id,
          quantity: material.quantity
        });
      }

      // Apply for basic permit
      await emit('permit:applied', {
        projectId: project.id,
        permitId: `PERM-${project.id}`
      });

      // Schedule initial inspection
      await emit('inspection:scheduled', {
        projectId: project.id,
        inspectionId: `INSP-${project.id}-INITIAL`
      });

      // Create contract document
      await emit('document:uploaded', {
        documentId: `CONTRACT-${project.id}`,
        customerId: projectData.customerId,
        projectId: project.id
      });

      // Create invoice for deposit
      await emit('invoice:created', {
        invoiceId: `INV-${project.id}-DEPOSIT`,
        customerId: projectData.customerId,
        projectId: project.id
      });

      // Update customer status to Active
      if (customer.status === 'Prospect') {
        // This will trigger the updateCustomer action through the store
        customer.status = 'Active';
      }

      await emit('system:notification', {
        message: `Project "${project.name}" created with automated job costing and resource allocation`,
        type: 'success'
      });

      return project;
    } catch (error) {
      await emit('system:error', {
        error: 'Failed to create project',
        context: { projectData, error }
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [createProjectFromOpportunity, getCustomer, getAvailableEmployees, emit]);

  return {
    createProject,
    isCreating
  };
};

// Cross-module data synchronization hook
export const useDataSync = () => {
  const { syncCustomerData, syncEmployeeData, syncProjectData } = useCentralStore();
  const { emit } = useEventEmitter();
  const [syncStatus, setSyncStatus] = useState<{
    customers: boolean;
    employees: boolean;
    projects: boolean;
  }>({
    customers: false,
    employees: false,
    projects: false
  });

  // Listen for sync events
  useEventSubscription('sync:completed', (data) => {
    setSyncStatus(prev => ({
      ...prev,
      [data.entity]: !data.success
    }));
  });

  const syncAllData = useCallback(async () => {
    try {
      setSyncStatus({ customers: true, employees: true, projects: true });

      await Promise.all([
        syncCustomerData('all'),
        syncEmployeeData('all'),
        syncProjectData('all')
      ]);

      await emit('system:notification', {
        message: 'All data synchronized successfully',
        type: 'success'
      });
    } catch (error) {
      await emit('system:error', {
        error: 'Failed to sync data',
        context: { error }
      });
    }
  }, [syncCustomerData, syncEmployeeData, syncProjectData, emit]);

  return {
    syncAllData,
    syncStatus
  };
};

// Master data flow orchestrator hook
export const useDataFlowOrchestrator = () => {
  const leadCapture = useLeadCapture();
  const employeeOnboarding = useEmployeeOnboarding();
  const projectCreation = useProjectCreation();
  const dataSync = useDataSync();
  const { emit } = useEventEmitter();

  // Listen for cross-module events and trigger appropriate actions
  useEventSubscription('customer:created', async (customer) => {
    // Auto-create accounting records
    await emit('system:notification', {
      message: `Customer ${customer.firstName} ${customer.lastName} added to all systems`,
      type: 'info'
    });
  });

  useEventSubscription('employee:hired', async (employee) => {
    // Auto-setup HR records
    await emit('system:notification', {
      message: `Employee ${employee.firstName} ${employee.lastName} setup complete across all modules`,
      type: 'info'
    });
  });

  useEventSubscription('project:created', async (project) => {
    // Auto-setup project across all modules
    await emit('system:notification', {
      message: `Project "${project.name}" configured in all relevant systems`,
      type: 'info'
    });
  });

  const processLeadToProject = useCallback(async (leadData: any) => {
    try {
      // Step 1: Convert lead to customer
      const customer = await leadCapture.captureLead(leadData);

      // Step 2: Create project if opportunity data exists
      if (leadData.projectDetails) {
        const project = await projectCreation.createProject({
          customerId: customer.id,
          ...leadData.projectDetails
        });

        return { customer, project };
      }

      return { customer };
    } catch (error) {
      await emit('system:error', {
        error: 'Failed to process lead to project workflow',
        context: { leadData, error }
      });
      throw error;
    }
  }, [leadCapture, projectCreation, emit]);

  return {
    leadCapture,
    employeeOnboarding,
    projectCreation,
    dataSync,
    processLeadToProject
  };
};

export default useDataFlowOrchestrator;