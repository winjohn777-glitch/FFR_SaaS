/**
 * Data Validation and Consistency Services
 * Ensures data integrity across all modules and prevents inconsistencies
 */

import { UnifiedCustomer, UnifiedEmployee, UnifiedProject, ValidationResult, ConsistencyReport, ConsistencyIssue } from '../types/unified';
import { eventBus } from '../events/eventBus';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (supports US phone numbers)
const PHONE_REGEX = /^(\+1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;

export class DataValidationService {
  /**
   * Validate customer data
   */
  static validateCustomer(customer: Partial<UnifiedCustomer>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!customer.firstName || customer.firstName.trim().length === 0) {
      errors.push('First name is required');
    }
    if (!customer.lastName || customer.lastName.trim().length === 0) {
      errors.push('Last name is required');
    }
    if (!customer.email || customer.email.trim().length === 0) {
      errors.push('Email is required');
    }
    if (!customer.phone || customer.phone.trim().length === 0) {
      errors.push('Phone number is required');
    }

    // Format validation
    if (customer.email && !EMAIL_REGEX.test(customer.email)) {
      errors.push('Email format is invalid');
    }
    if (customer.phone && !PHONE_REGEX.test(customer.phone)) {
      errors.push('Phone number format is invalid');
    }
    if (customer.alternatePhone && !PHONE_REGEX.test(customer.alternatePhone)) {
      warnings.push('Alternate phone number format is invalid');
    }

    // Address validation
    if (customer.address) {
      if (!customer.address.street || customer.address.street.trim().length === 0) {
        errors.push('Street address is required');
      }
      if (!customer.address.city || customer.address.city.trim().length === 0) {
        errors.push('City is required');
      }
      if (!customer.address.state || customer.address.state.trim().length === 0) {
        errors.push('State is required');
      }
      if (!customer.address.zipCode || customer.address.zipCode.trim().length === 0) {
        errors.push('ZIP code is required');
      } else if (!/^\d{5}(-\d{4})?$/.test(customer.address.zipCode)) {
        errors.push('ZIP code format is invalid (must be 12345 or 12345-6789)');
      }
    } else {
      errors.push('Address is required');
    }

    // Business rules
    if (customer.type === 'Commercial' && (!customer.companyName || customer.companyName.trim().length === 0)) {
      warnings.push('Company name should be provided for commercial customers');
    }
    if (customer.creditLimit && customer.creditLimit < 0) {
      errors.push('Credit limit cannot be negative');
    }
    if (customer.totalLifetimeValue && customer.totalLifetimeValue < 0) {
      errors.push('Total lifetime value cannot be negative');
    }
    if (customer.outstandingBalance && customer.outstandingBalance < 0) {
      warnings.push('Outstanding balance is negative (customer has credit)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate employee data
   */
  static validateEmployee(employee: Partial<UnifiedEmployee>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!employee.employeeNumber || employee.employeeNumber.trim().length === 0) {
      errors.push('Employee number is required');
    }
    if (!employee.firstName || employee.firstName.trim().length === 0) {
      errors.push('First name is required');
    }
    if (!employee.lastName || employee.lastName.trim().length === 0) {
      errors.push('Last name is required');
    }
    if (!employee.position || employee.position.trim().length === 0) {
      errors.push('Position is required');
    }
    if (!employee.department || employee.department.trim().length === 0) {
      errors.push('Department is required');
    }
    if (!employee.hireDate || employee.hireDate.trim().length === 0) {
      errors.push('Hire date is required');
    }
    if (!employee.email || employee.email.trim().length === 0) {
      errors.push('Email is required');
    }
    if (!employee.phone || employee.phone.trim().length === 0) {
      errors.push('Phone number is required');
    }

    // Format validation
    if (employee.email && !EMAIL_REGEX.test(employee.email)) {
      errors.push('Email format is invalid');
    }
    if (employee.phone && !PHONE_REGEX.test(employee.phone)) {
      errors.push('Phone number format is invalid');
    }
    if (employee.hireDate && isNaN(Date.parse(employee.hireDate))) {
      errors.push('Hire date format is invalid');
    }

    // Compensation validation
    if (employee.hourlyRate !== undefined && employee.hourlyRate < 0) {
      errors.push('Hourly rate cannot be negative');
    }
    if (employee.salary !== undefined && employee.salary < 0) {
      errors.push('Salary cannot be negative');
    }
    if (employee.overtimeRate !== undefined && employee.overtimeRate < 0) {
      errors.push('Overtime rate cannot be negative');
    }

    // Business rules
    const hireDate = employee.hireDate ? new Date(employee.hireDate) : null;
    const now = new Date();
    if (hireDate && hireDate > now) {
      warnings.push('Hire date is in the future');
    }

    if (employee.status === 'Terminated' && !employee.terminationDate) {
      warnings.push('Termination date should be provided for terminated employees');
    }

    if (employee.defaultHoursPerWeek && employee.defaultHoursPerWeek > 80) {
      warnings.push('Default hours per week seems unusually high (>80)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate project data
   */
  static validateProject(project: Partial<UnifiedProject>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!project.name || project.name.trim().length === 0) {
      errors.push('Project name is required');
    }
    if (!project.customerId || project.customerId.trim().length === 0) {
      errors.push('Customer ID is required');
    }
    if (!project.type) {
      errors.push('Project type is required');
    }

    // Financial validation
    if (project.contractAmount !== undefined && project.contractAmount < 0) {
      errors.push('Contract amount cannot be negative');
    }
    if (project.estimatedCost !== undefined && project.estimatedCost < 0) {
      errors.push('Estimated cost cannot be negative');
    }
    if (project.actualCost !== undefined && project.actualCost < 0) {
      errors.push('Actual cost cannot be negative');
    }
    if (project.profitMargin !== undefined && (project.profitMargin < -100 || project.profitMargin > 100)) {
      warnings.push('Profit margin should be between -100% and 100%');
    }

    // Date validation
    if (project.estimatedStartDate && isNaN(Date.parse(project.estimatedStartDate))) {
      errors.push('Estimated start date format is invalid');
    }
    if (project.estimatedEndDate && isNaN(Date.parse(project.estimatedEndDate))) {
      errors.push('Estimated end date format is invalid');
    }
    if (project.actualStartDate && isNaN(Date.parse(project.actualStartDate))) {
      errors.push('Actual start date format is invalid');
    }
    if (project.actualEndDate && isNaN(Date.parse(project.actualEndDate))) {
      errors.push('Actual end date format is invalid');
    }

    // Business rules
    if (project.estimatedStartDate && project.estimatedEndDate) {
      const startDate = new Date(project.estimatedStartDate);
      const endDate = new Date(project.estimatedEndDate);
      if (startDate >= endDate) {
        errors.push('Estimated end date must be after estimated start date');
      }
    }

    if (project.actualStartDate && project.actualEndDate) {
      const actualStart = new Date(project.actualStartDate);
      const actualEnd = new Date(project.actualEndDate);
      if (actualStart >= actualEnd) {
        errors.push('Actual end date must be after actual start date');
      }
    }

    if (project.squareFootage !== undefined && project.squareFootage <= 0) {
      errors.push('Square footage must be greater than 0');
    }

    if (project.progressPercentage !== undefined && (project.progressPercentage < 0 || project.progressPercentage > 100)) {
      errors.push('Progress percentage must be between 0 and 100');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

export class DataConsistencyService {
  /**
   * Check data consistency across all modules
   */
  static async checkConsistency(
    customers: UnifiedCustomer[],
    employees: UnifiedEmployee[],
    projects: UnifiedProject[]
  ): Promise<ConsistencyReport> {
    const issues: ConsistencyIssue[] = [];

    // Check customer-project relationships
    for (const customer of customers) {
      for (const projectId of customer.projectIds) {
        const project = projects.find(p => p.id === projectId);
        if (!project) {
          issues.push({
            type: 'missing_reference',
            entity: 'customer',
            entityId: customer.id,
            description: `Customer references non-existent project: ${projectId}`,
            severity: 'medium',
            suggestedResolution: `Remove project ID ${projectId} from customer ${customer.id} or create the missing project`
          });
        } else if (project.customerId !== customer.id) {
          issues.push({
            type: 'data_mismatch',
            entity: 'customer',
            entityId: customer.id,
            description: `Project ${projectId} customer ID mismatch`,
            severity: 'high',
            suggestedResolution: `Update project ${projectId} customer ID to ${customer.id} or remove from customer project list`
          });
        }
      }
    }

    // Check project-customer relationships
    for (const project of projects) {
      const customer = customers.find(c => c.id === project.customerId);
      if (!customer) {
        issues.push({
          type: 'missing_reference',
          entity: 'project',
          entityId: project.id,
          description: `Project references non-existent customer: ${project.customerId}`,
          severity: 'critical',
          suggestedResolution: `Create customer ${project.customerId} or assign project to existing customer`
        });
      } else if (!customer.projectIds.includes(project.id)) {
        issues.push({
          type: 'data_mismatch',
          entity: 'project',
          entityId: project.id,
          description: `Customer ${project.customerId} doesn't reference project ${project.id}`,
          severity: 'medium',
          suggestedResolution: `Add project ${project.id} to customer ${project.customerId} project list`
        });
      }
    }

    // Check employee-project assignments
    for (const project of projects) {
      for (const assignment of project.assignedEmployees) {
        const employee = employees.find(e => e.id === assignment.employeeId);
        if (!employee) {
          issues.push({
            type: 'missing_reference',
            entity: 'project',
            entityId: project.id,
            description: `Project assigns non-existent employee: ${assignment.employeeId}`,
            severity: 'high',
            suggestedResolution: `Remove employee assignment or create employee ${assignment.employeeId}`
          });
        } else if (!employee.currentProjectIds.includes(project.id)) {
          issues.push({
            type: 'data_mismatch',
            entity: 'project',
            entityId: project.id,
            description: `Employee ${assignment.employeeId} not assigned to project ${project.id}`,
            severity: 'medium',
            suggestedResolution: `Add project ${project.id} to employee ${assignment.employeeId} current projects`
          });
        }
      }
    }

    // Check for duplicate IDs
    const customerIds = customers.map(c => c.id);
    const duplicateCustomerIds = customerIds.filter((id, index) => customerIds.indexOf(id) !== index);
    for (const duplicateId of Array.from(new Set(duplicateCustomerIds))) {
      issues.push({
        type: 'duplicate_entry',
        entity: 'customer',
        entityId: duplicateId,
        description: `Duplicate customer ID: ${duplicateId}`,
        severity: 'critical',
        suggestedResolution: `Merge duplicate customers or assign unique IDs`
      });
    }

    const employeeIds = employees.map(e => e.id);
    const duplicateEmployeeIds = employeeIds.filter((id, index) => employeeIds.indexOf(id) !== index);
    for (const duplicateId of Array.from(new Set(duplicateEmployeeIds))) {
      issues.push({
        type: 'duplicate_entry',
        entity: 'employee',
        entityId: duplicateId,
        description: `Duplicate employee ID: ${duplicateId}`,
        severity: 'critical',
        suggestedResolution: `Merge duplicate employees or assign unique IDs`
      });
    }

    const projectIds = projects.map(p => p.id);
    const duplicateProjectIds = projectIds.filter((id, index) => projectIds.indexOf(id) !== index);
    for (const duplicateId of Array.from(new Set(duplicateProjectIds))) {
      issues.push({
        type: 'duplicate_entry',
        entity: 'project',
        entityId: duplicateId,
        description: `Duplicate project ID: ${duplicateId}`,
        severity: 'critical',
        suggestedResolution: `Merge duplicate projects or assign unique IDs`
      });
    }

    // Check business constraints
    for (const customer of customers) {
      if (customer.outstandingBalance > (customer.creditLimit || 0) && customer.creditLimit !== undefined) {
        issues.push({
          type: 'constraint_violation',
          entity: 'customer',
          entityId: customer.id,
          description: `Customer outstanding balance ($${customer.outstandingBalance}) exceeds credit limit ($${customer.creditLimit})`,
          severity: 'high',
          suggestedResolution: `Contact customer for payment or increase credit limit`
        });
      }
    }

    for (const employee of employees) {
      if (employee.status === 'Active' && employee.terminationDate) {
        issues.push({
          type: 'constraint_violation',
          entity: 'employee',
          entityId: employee.id,
          description: `Active employee has termination date: ${employee.terminationDate}`,
          severity: 'medium',
          suggestedResolution: `Update employee status to Terminated or remove termination date`
        });
      }
    }

    // Emit consistency check event
    eventBus.emit('system:notification', {
      message: `Consistency check completed: ${issues.length} issues found`,
      type: issues.length === 0 ? 'success' : issues.some(i => i.severity === 'critical') ? 'error' : 'warning'
    });

    return {
      isConsistent: issues.length === 0,
      issues,
      checkedAt: new Date().toISOString()
    };
  }

  /**
   * Auto-fix common consistency issues
   */
  static async autoFixIssues(
    issues: ConsistencyIssue[],
    customers: UnifiedCustomer[],
    employees: UnifiedEmployee[],
    projects: UnifiedProject[]
  ): Promise<{
    fixedIssues: ConsistencyIssue[];
    remainingIssues: ConsistencyIssue[];
  }> {
    const fixedIssues: ConsistencyIssue[] = [];
    const remainingIssues: ConsistencyIssue[] = [];

    for (const issue of issues) {
      let fixed = false;

      try {
        switch (issue.type) {
          case 'data_mismatch':
            if (issue.entity === 'customer' && issue.description.includes('Project') && issue.description.includes('customer ID mismatch')) {
              // Fix project customer ID mismatch
              const projectId = issue.description.match(/Project (\S+)/)?.[1];
              const project = projects.find(p => p.id === projectId);
              if (project) {
                project.customerId = issue.entityId;
                fixed = true;
              }
            } else if (issue.entity === 'project' && issue.description.includes("doesn't reference project")) {
              // Add project to customer's project list
              const customerId = issue.description.match(/Customer (\S+)/)?.[1];
              const customer = customers.find(c => c.id === customerId);
              if (customer && !customer.projectIds.includes(issue.entityId)) {
                customer.projectIds.push(issue.entityId);
                fixed = true;
              }
            }
            break;

          case 'missing_reference':
            // For missing references, we typically can't auto-fix without more context
            // These require manual intervention
            break;

          case 'duplicate_entry':
            // Duplicate entries require manual resolution to determine which to keep
            break;

          case 'constraint_violation':
            if (issue.entity === 'employee' && issue.description.includes('Active employee has termination date')) {
              // Remove termination date from active employee
              const employee = employees.find(e => e.id === issue.entityId);
              if (employee && employee.status === 'Active') {
                employee.terminationDate = undefined;
                fixed = true;
              }
            }
            break;
        }

        if (fixed) {
          fixedIssues.push(issue);
          await eventBus.emit('system:notification', {
            message: `Auto-fixed: ${issue.description}`,
            type: 'success'
          });
        } else {
          remainingIssues.push(issue);
        }
      } catch (error) {
        remainingIssues.push(issue);
        await eventBus.emit('system:error', {
          error: `Failed to auto-fix issue: ${issue.description}`,
          context: { issue, error }
        });
      }
    }

    return { fixedIssues, remainingIssues };
  }
}

// Export validation and consistency services
export const validateCustomer = DataValidationService.validateCustomer;
export const validateEmployee = DataValidationService.validateEmployee;
export const validateProject = DataValidationService.validateProject;
export const checkDataConsistency = DataConsistencyService.checkConsistency;
export const autoFixDataIssues = DataConsistencyService.autoFixIssues;