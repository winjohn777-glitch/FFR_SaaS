import apiClient from './ApiClient';
import { Customer } from '../types/crm';

export interface CustomerCreateData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface CustomerResponse {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class CustomerService {
  private static instance: CustomerService;

  public static getInstance(): CustomerService {
    if (!CustomerService.instance) {
      CustomerService.instance = new CustomerService();
    }
    return CustomerService.instance;
  }

  async getCustomers(): Promise<Customer[]> {
    try {
      const response = await apiClient.get<CustomerResponse[]>('/api/customers');

      if (response.error) {
        console.error('Error fetching customers:', response.error);
        return [];
      }

      // Convert API response to CRM Customer format
      return (response.data || []).map(this.convertApiToCustomer);
    } catch (error) {
      console.error('Error in getCustomers:', error);
      return [];
    }
  }

  async createCustomer(customerData: CustomerCreateData): Promise<Customer | null> {
    try {
      const response = await apiClient.post<CustomerResponse>('/api/customers', customerData);

      if (response.error) {
        console.error('Error creating customer:', response.error);
        return null;
      }

      if (response.data) {
        return this.convertApiToCustomer(response.data);
      }

      return null;
    } catch (error) {
      console.error('Error in createCustomer:', error);
      return null;
    }
  }

  async updateCustomer(id: string, customerData: Partial<CustomerCreateData>): Promise<Customer | null> {
    try {
      const response = await apiClient.put<CustomerResponse>(`/api/customers/${id}`, customerData);

      if (response.error) {
        console.error('Error updating customer:', response.error);
        return null;
      }

      if (response.data) {
        return this.convertApiToCustomer(response.data);
      }

      return null;
    } catch (error) {
      console.error('Error in updateCustomer:', error);
      return null;
    }
  }

  async deleteCustomer(id: string): Promise<boolean> {
    try {
      const response = await apiClient.delete(`/api/customers/${id}`);

      if (response.error) {
        console.error('Error deleting customer:', response.error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteCustomer:', error);
      return false;
    }
  }

  private convertApiToCustomer(apiCustomer: CustomerResponse): Customer {
    // Convert the simple API customer format to the complex CRM Customer format
    const nameParts = apiCustomer.name.split(' ');
    const firstName = nameParts[0] || apiCustomer.name;
    const lastName = nameParts.slice(1).join(' ') || '';

    return {
      id: apiCustomer.id,
      firstName,
      lastName,
      companyName: '',
      email: apiCustomer.email || '',
      phone: apiCustomer.phone || '',
      alternatePhone: '',
      address: {
        street: apiCustomer.address || '',
        city: apiCustomer.city || '',
        state: apiCustomer.state || '',
        zipCode: apiCustomer.zip || '',
        county: ''
      },
      type: 'Residential' as const,
      status: 'Active' as const,
      propertyType: 'Single Family',
      roofType: 'Unknown',
      leadSource: 'Other',
      creditRating: 'Good',
      dateAdded: apiCustomer.createdAt.split('T')[0],
      lastContact: apiCustomer.updatedAt.split('T')[0],
      notes: '',
      tags: []
    };
  }

  convertCustomerToApiFormat(customer: Customer): CustomerCreateData {
    return {
      name: `${customer.firstName} ${customer.lastName}`.trim(),
      email: customer.email || undefined,
      phone: customer.phone || undefined,
      address: customer.address.street || undefined,
      city: customer.address.city || undefined,
      state: customer.address.state || undefined,
      zip: customer.address.zipCode || undefined,
    };
  }
}

export default CustomerService;