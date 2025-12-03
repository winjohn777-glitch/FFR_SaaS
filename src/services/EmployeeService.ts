import apiClient from './ApiClient';
import { Employee, Certification } from '../contexts/DataContext';

export interface EmployeeCreateData {
  employeeId: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  email: string;
  phone?: string;
  address?: string;
  hireDate: string;
  payRate: number;
  certifications?: Certification[];
}

export interface EmployeeResponse {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string;
  email: string;
  phone: string | null;
  address: string | null;
  hireDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
  payRate: number;
  hoursThisWeek: number;
  overtime: number;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  certifications: Array<{
    id: string;
    name: string;
    type: string;
    issueDate: string;
    expirationDate: string;
    status: 'VALID' | 'EXPIRING' | 'EXPIRED';
    certificateNumber: string | null;
  }>;
}

class EmployeeService {
  private static instance: EmployeeService;

  public static getInstance(): EmployeeService {
    if (!EmployeeService.instance) {
      EmployeeService.instance = new EmployeeService();
    }
    return EmployeeService.instance;
  }

  async getEmployees(organizationId: string): Promise<Employee[]> {
    try {
      const response = await apiClient.get<EmployeeResponse[]>(`/api/employees?organizationId=${organizationId}`);

      if (response.error) {
        console.error('Error fetching employees:', response.error);
        return [];
      }

      // Convert API response to Employee format
      return (response.data || []).map(this.convertApiToEmployee);
    } catch (error) {
      console.error('Error in getEmployees:', error);
      return [];
    }
  }

  async createEmployee(organizationId: string, employeeData: EmployeeCreateData): Promise<Employee | null> {
    try {
      const response = await apiClient.post<EmployeeResponse>('/api/employees', {
        organizationId,
        ...employeeData,
        status: 'ACTIVE'
      });

      if (response.error) {
        console.error('Error creating employee:', response.error);
        return null;
      }

      if (response.data) {
        return this.convertApiToEmployee(response.data);
      }

      return null;
    } catch (error) {
      console.error('Error in createEmployee:', error);
      return null;
    }
  }

  async updateEmployee(id: string, employeeData: Partial<EmployeeCreateData>): Promise<Employee | null> {
    try {
      const response = await apiClient.put<EmployeeResponse>(`/api/employees/${id}`, employeeData);

      if (response.error) {
        console.error('Error updating employee:', response.error);
        return null;
      }

      if (response.data) {
        return this.convertApiToEmployee(response.data);
      }

      return null;
    } catch (error) {
      console.error('Error in updateEmployee:', error);
      return null;
    }
  }

  async deleteEmployee(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete(`/api/employees/${id}`);

      if (response.error) {
        console.error('Error deleting employee:', response.error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteEmployee:', error);
      return false;
    }
  }

  private convertApiToEmployee(apiEmployee: EmployeeResponse): Employee {
    return {
      id: apiEmployee.id,
      employeeId: apiEmployee.employeeId,
      firstName: apiEmployee.firstName,
      lastName: apiEmployee.lastName,
      role: apiEmployee.role,
      department: apiEmployee.department,
      email: apiEmployee.email,
      phone: apiEmployee.phone || '',
      address: apiEmployee.address || '',
      hireDate: apiEmployee.hireDate.split('T')[0],
      status: apiEmployee.status === 'ACTIVE' ? 'active' as const : 'inactive' as const,
      payRate: apiEmployee.payRate,
      timeTracking: {
        hoursThisWeek: apiEmployee.hoursThisWeek,
        overtime: apiEmployee.overtime
      },
      certifications: apiEmployee.certifications.map(cert => ({
        id: cert.id,
        name: cert.name,
        type: cert.type,
        issueDate: cert.issueDate.split('T')[0],
        expirationDate: cert.expirationDate.split('T')[0],
        status: cert.status === 'VALID' ? 'valid' as const :
               cert.status === 'EXPIRING' ? 'expiring' as const : 'expired' as const,
        certificateNumber: cert.certificateNumber || ''
      }))
    };
  }

  convertEmployeeToApiFormat(employee: Employee): EmployeeCreateData {
    return {
      employeeId: employee.employeeId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      role: employee.role,
      department: employee.department,
      email: employee.email,
      phone: employee.phone || undefined,
      address: employee.address || undefined,
      hireDate: employee.hireDate,
      payRate: employee.payRate,
      certifications: employee.certifications
    };
  }
}

export default EmployeeService;