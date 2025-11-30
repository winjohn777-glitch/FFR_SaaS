import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Search, Plus, Users, TrendingUp, DollarSign, Calendar, Phone, Mail, MapPin, Edit, Trash2, Eye, Settings, FileText, Target, CreditCard } from 'lucide-react';
import AutoFollowUpModal from '../components/CRM/AutoFollowUpModal';
import DigitalProposalModal from '../components/CRM/DigitalProposalModal';
import SalesPipelineModal from '../components/CRM/SalesPipelineModal';
import AddCustomerModal from '../components/CRM/AddCustomerModal';
import CustomerDetailsModal from '../components/CRM/CustomerDetailsModal';
import FinanceContractModal from '../components/Financing/FinanceContractModal';
import FinanceContractBookkeepingService from '../services/FinanceContractBookkeepingService';
import crmData from '../data/crmData.json';
import { Customer, Lead, Opportunity, CRMFilters } from '../types/crm';
import { useData } from '../contexts/DataContext';

const PageContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    align-items: stretch;
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  min-width: 300px;

  @media (max-width: 768px) {
    min-width: auto;
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  padding-left: 2.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background-color: ${({ theme }) => theme.colors.surface};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.light};
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background-color: ${({ variant, theme }) =>
    variant === 'primary' ? theme.colors.primary : theme.colors.surface};
  color: ${({ variant, theme }) =>
    variant === 'primary' ? 'white' : theme.colors.text.primary};
  border: 1px solid ${({ variant, theme }) =>
    variant === 'primary' ? theme.colors.primary : theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ variant, theme }) =>
      variant === 'primary' ? `${theme.colors.primary}dd` : theme.colors.background};
  }
`;

const DashboardStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const StatIcon = styled.div<{ color: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ color }) => color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ color }) => color};
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const TabsContainer = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TabsList = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Tab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.md} 0;
  font-weight: 600;
  color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.text.secondary};
  border-bottom: 2px solid ${({ active, theme }) =>
    active ? theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ContentSection = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const FilterBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: ${({ theme }) => theme.colors.background};
`;

const TableHeaderCell = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TableRow = styled.tr`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${({ status, theme }) => {
    switch (status) {
      case 'Active':
      case 'Qualified':
      case 'Hot':
        return `
          background-color: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
        `;
      case 'Prospect':
      case 'Warm':
        return `
          background-color: #f59e0b20;
          color: #f59e0b;
        `;
      case 'Inactive':
      case 'Cold':
        return `
          background-color: ${theme.colors.text.light}20;
          color: ${theme.colors.text.secondary};
        `;
      default:
        return `
          background-color: ${theme.colors.text.light}20;
          color: ${theme.colors.text.secondary};
        `;
    }
  }}
`;

const PriorityBadge = styled.span<{ priority: string }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${({ priority }) => {
    switch (priority) {
      case 'Hot':
        return `
          background-color: #ef444420;
          color: #ef4444;
        `;
      case 'Warm':
        return `
          background-color: #f59e0b20;
          color: #f59e0b;
        `;
      case 'Cold':
        return `
          background-color: #6b728020;
          color: #6b7280;
        `;
      default:
        return `
          background-color: #6b728020;
          color: #6b7280;
        `;
    }
  }}
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ContactDetail = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SmallActionButton = styled.button<{ variant?: 'danger' }>`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ variant, theme }) =>
    variant === 'danger' ? theme.colors.accent : theme.colors.text.light};
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ variant, theme }) =>
      variant === 'danger' ? `${theme.colors.accent}dd` : theme.colors.primary};
  }
`;


const CRM: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'customers' | 'leads' | 'opportunities'>('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<CRMFilters>({});

  // Modal states
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);
  const [pipelineModalOpen, setPipelineModalOpen] = useState(false);
  const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
  const [customerDetailsModalOpen, setCustomerDetailsModalOpen] = useState(false);
  const [financeContractModalOpen, setFinanceContractModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  // Use shared data context
  const {
    customers,
    addCustomer,
    leads,
    addLead,
    updateLead,
    deleteLead,
    opportunities,
    addOpportunity,
    updateOpportunity,
    deleteOpportunity,
    addJob
  } = useData();
  const stats = crmData.dashboardStats;

  // Debug: Log current customers
  console.log('🔍 CRM: Current customers in component:', customers.length);
  console.log('🔍 CRM: Customer list:', customers.map(c => `${c.firstName} ${c.lastName}`));

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = searchTerm === '' ||
        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm);

      const matchesType = !filters.customerType || customer.type === filters.customerType;
      const matchesStatus = !filters.status || customer.status === filters.status;
      const matchesCounty = !filters.county || customer.address.county === filters.county;

      return matchesSearch && matchesType && matchesStatus && matchesCounty;
    });
  }, [customers, searchTerm, filters]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = searchTerm === '' ||
        lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm);

      return matchesSearch;
    });
  }, [leads, searchTerm]);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opportunity => {
      const matchesSearch = searchTerm === '' ||
        opportunity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [opportunities, searchTerm]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const openFollowUpModal = (customer: Customer) => {
    setSelectedCustomer({
      id: customer.id,
      name: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      phone: customer.phone,
      status: customer.status,
      lastContact: customer.lastContact
    });
    setFollowUpModalOpen(true);
  };

  const openProposalModal = (customer: Customer) => {
    setSelectedCustomer({
      id: customer.id,
      name: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    });
    setProposalModalOpen(true);
  };

  const openFinanceContractModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFinanceContractModalOpen(true);
  };

  const handleFollowUpSave = (followUpData: any) => {
    console.log('Follow-up campaign created:', followUpData);
  };

  const handleProposalSave = (proposalData: any) => {
    console.log('Digital proposal created:', proposalData);
  };

  const handleFinanceContractSave = async (contractData: any) => {
    console.log('Finance contract created:', contractData);

    try {
      // Store contract data in localStorage for document generation
      const contracts = JSON.parse(localStorage.getItem('finance-contracts') || '[]');
      const contractWithMetadata = {
        ...contractData,
        customerId: selectedCustomer?.id,
        createdDate: new Date().toISOString(),
        status: 'active'
      };
      contracts.push(contractWithMetadata);
      localStorage.setItem('finance-contracts', JSON.stringify(contracts));

      // Create bookkeeping entries
      const bookkeepingService = FinanceContractBookkeepingService.getInstance();
      const journalEntry = await bookkeepingService.createFinanceContractJournalEntry(contractData);

      console.log('Journal entry created:', journalEntry);

      alert(`Finance contract ${contractData.contractNumber} has been created and saved!\n\nBookkeeping entries:\n• Notes Receivable: $${parseFloat(contractData.amountFinanced).toLocaleString()}\n• Revenue: $${parseFloat(contractData.totalContractAmount).toLocaleString()}\n• Payment schedule created with ${contractData.numberOfPayments} payments`);

      setFinanceContractModalOpen(false);
    } catch (error) {
      console.error('Error creating finance contract:', error);
      alert('Error creating finance contract. Please try again.');
    }
  };

  const handlePipelineSave = (pipelineData: any) => {
    console.log('Sales pipeline updated:', pipelineData);
  };

  const handleAddCustomer = (customerData: any) => {
    console.log('🔄 CRM: Customer submission received:', customerData);

    // Create new customer object with proper structure
    const newCustomer: Customer = {
      id: `C${Date.now()}`,
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      companyName: customerData.companyName || '',
      email: customerData.email,
      phone: customerData.phone,
      alternatePhone: customerData.alternatePhone || '',
      address: {
        street: customerData.address.street,
        city: customerData.address.city,
        state: customerData.address.state,
        zipCode: customerData.address.zipCode,
        county: customerData.address.county
      },
      type: customerData.type as 'Residential' | 'Commercial',
      status: customerData.status as 'Active' | 'Prospect' | 'Inactive',
      propertyType: 'Single Family',
      roofType: 'Unknown',
      leadSource: 'Website',
      creditRating: 'Good',
      dateAdded: new Date().toISOString().split('T')[0],
      lastContact: new Date().toISOString().split('T')[0],
      notes: customerData.notes || '',
      tags: []
    };

    console.log('📝 CRM: New customer object created:', newCustomer);

    // Add customer to shared state
    addCustomer(newCustomer);

    console.log(`✅ CRM: Customer added to shared state: ${customerData.firstName} ${customerData.lastName}`);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Customer Relationship Management</PageTitle>
        <HeaderActions>
          <SearchContainer>
            <SearchIcon>
              <Search size={16} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search customers, leads, opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          <ActionButton variant="secondary" onClick={() => setPipelineModalOpen(true)}>
            <Target size={16} />
            Sales Pipeline
          </ActionButton>
          <ActionButton variant="primary" onClick={() => setAddCustomerModalOpen(true)}>
            <Plus size={16} />
            Add Customer
          </ActionButton>
        </HeaderActions>
      </PageHeader>

      <DashboardStats>
        <StatCard>
          <StatIcon color="#3b82f6">
            <Users size={24} />
          </StatIcon>
          <StatValue>{stats.totalCustomers}</StatValue>
          <StatLabel>Total Customers</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon color="#ef4444">
            <TrendingUp size={24} />
          </StatIcon>
          <StatValue>{stats.hotLeads}</StatValue>
          <StatLabel>Hot Leads</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon color="#10b981">
            <DollarSign size={24} />
          </StatIcon>
          <StatValue>{formatCurrency(stats.opportunityValue)}</StatValue>
          <StatLabel>Pipeline Value</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon color="#f59e0b">
            <Calendar size={24} />
          </StatIcon>
          <StatValue>{stats.followUpsNeeded}</StatValue>
          <StatLabel>Follow-ups Needed</StatLabel>
        </StatCard>
      </DashboardStats>

      <TabsContainer>
        <TabsList>
          <Tab
            active={activeTab === 'customers'}
            onClick={() => setActiveTab('customers')}
          >
            Customers ({customers.length})
          </Tab>
          <Tab
            active={activeTab === 'leads'}
            onClick={() => setActiveTab('leads')}
          >
            Leads ({leads.length})
          </Tab>
          <Tab
            active={activeTab === 'opportunities'}
            onClick={() => setActiveTab('opportunities')}
          >
            Opportunities ({opportunities.length})
          </Tab>
        </TabsList>
      </TabsContainer>

      <ContentSection>
        <FilterBar>
            <FilterSelect
              value={filters.customerType || ''}
              onChange={(e) => setFilters({...filters, customerType: e.target.value as any})}
            >
              <option value="">All Types</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
            </FilterSelect>

            <FilterSelect
              value={filters.status || ''}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Prospect">Prospect</option>
              <option value="Inactive">Inactive</option>
            </FilterSelect>

            <FilterSelect
              value={filters.county || ''}
              onChange={(e) => setFilters({...filters, county: e.target.value})}
            >
              <option value="">All Counties</option>
              <option value="Alachua">Alachua</option>
              <option value="Baker">Baker</option>
              <option value="Bay">Bay</option>
              <option value="Bradford">Bradford</option>
              <option value="Brevard">Brevard</option>
              <option value="Broward">Broward</option>
              <option value="Calhoun">Calhoun</option>
              <option value="Charlotte">Charlotte</option>
              <option value="Citrus">Citrus</option>
              <option value="Clay">Clay</option>
              <option value="Collier">Collier</option>
              <option value="Columbia">Columbia</option>
              <option value="DeSoto">DeSoto</option>
              <option value="Dixie">Dixie</option>
              <option value="Duval">Duval</option>
              <option value="Escambia">Escambia</option>
              <option value="Flagler">Flagler</option>
              <option value="Franklin">Franklin</option>
              <option value="Gadsden">Gadsden</option>
              <option value="Gilchrist">Gilchrist</option>
              <option value="Glades">Glades</option>
              <option value="Gulf">Gulf</option>
              <option value="Hamilton">Hamilton</option>
              <option value="Hardee">Hardee</option>
              <option value="Hendry">Hendry</option>
              <option value="Hernando">Hernando</option>
              <option value="Highlands">Highlands</option>
              <option value="Hillsborough">Hillsborough</option>
              <option value="Holmes">Holmes</option>
              <option value="Indian River">Indian River</option>
              <option value="Jackson">Jackson</option>
              <option value="Jefferson">Jefferson</option>
              <option value="Lafayette">Lafayette</option>
              <option value="Lake">Lake</option>
              <option value="Lee">Lee</option>
              <option value="Leon">Leon</option>
              <option value="Levy">Levy</option>
              <option value="Liberty">Liberty</option>
              <option value="Madison">Madison</option>
              <option value="Manatee">Manatee</option>
              <option value="Marion">Marion</option>
              <option value="Martin">Martin</option>
              <option value="Miami-Dade">Miami-Dade</option>
              <option value="Monroe">Monroe</option>
              <option value="Nassau">Nassau</option>
              <option value="Okaloosa">Okaloosa</option>
              <option value="Okeechobee">Okeechobee</option>
              <option value="Orange">Orange</option>
              <option value="Osceola">Osceola</option>
              <option value="Palm Beach">Palm Beach</option>
              <option value="Pasco">Pasco</option>
              <option value="Pinellas">Pinellas</option>
              <option value="Polk">Polk</option>
              <option value="Putnam">Putnam</option>
              <option value="Santa Rosa">Santa Rosa</option>
              <option value="Sarasota">Sarasota</option>
              <option value="Seminole">Seminole</option>
              <option value="St. Johns">St. Johns</option>
              <option value="St. Lucie">St. Lucie</option>
              <option value="Sumter">Sumter</option>
              <option value="Suwannee">Suwannee</option>
              <option value="Taylor">Taylor</option>
              <option value="Union">Union</option>
              <option value="Volusia">Volusia</option>
              <option value="Wakulla">Wakulla</option>
              <option value="Walton">Walton</option>
              <option value="Washington">Washington</option>
            </FilterSelect>
        </FilterBar>

        {activeTab === 'customers' && (
          <DataTable>
            <TableHeader>
              <tr>
                <TableHeaderCell>Customer</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Contact</TableHeaderCell>
                <TableHeaderCell>Location</TableHeaderCell>
                <TableHeaderCell>Last Contact</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </tr>
            </TableHeader>
            <tbody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="customer-card">
                  <TableCell>
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {customer.firstName} {customer.lastName}
                      </div>
                      {customer.companyName && (
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {customer.companyName}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={customer.type}>{customer.type}</StatusBadge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={customer.status}>{customer.status}</StatusBadge>
                  </TableCell>
                  <TableCell>
                    <ContactInfo>
                      <ContactDetail>
                        <Phone size={14} />
                        {customer.phone}
                      </ContactDetail>
                      <ContactDetail>
                        <Mail size={14} />
                        {customer.email}
                      </ContactDetail>
                    </ContactInfo>
                  </TableCell>
                  <TableCell>
                    <ContactDetail>
                      <MapPin size={14} />
                      {customer.address.city}, {customer.address.county}
                    </ContactDetail>
                  </TableCell>
                  <TableCell>{formatDate(customer.lastContact)}</TableCell>
                  <TableCell>
                    <ActionButtons>
                      <SmallActionButton
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setCustomerDetailsModalOpen(true);
                        }}
                        title="View customer details"
                      >
                        <Eye size={16} />
                      </SmallActionButton>
                      <SmallActionButton
                        onClick={() => openProposalModal(customer)}
                        title="Create digital proposal"
                      >
                        <FileText size={16} />
                      </SmallActionButton>
                      <SmallActionButton
                        onClick={() => openFinanceContractModal(customer)}
                        title="Create finance contract (12% @ 60 payments)"
                        style={{ color: '#059669' }}
                      >
                        <CreditCard size={16} />
                      </SmallActionButton>
                      <SmallActionButton
                        onClick={() => openFollowUpModal(customer)}
                        title="Setup automated follow-up"
                      >
                        <Settings size={16} />
                      </SmallActionButton>
                      <SmallActionButton
                        variant="danger"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete customer: ${customer.firstName} ${customer.lastName}?`)) {
                            alert('Customer deleted! (This is a demo - no actual deletion)');
                          }
                        }}
                        title="Delete customer"
                      >
                        <Trash2 size={16} />
                      </SmallActionButton>
                    </ActionButtons>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </DataTable>
        )}

        {activeTab === 'leads' && (
          <DataTable>
            <TableHeader>
              <tr>
                <TableHeaderCell>Lead</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Priority</TableHeaderCell>
                <TableHeaderCell>Service Needed</TableHeaderCell>
                <TableHeaderCell>Estimated Value</TableHeaderCell>
                <TableHeaderCell>Source</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </tr>
            </TableHeader>
            <tbody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {lead.firstName} {lead.lastName}
                      </div>
                      <ContactDetail>
                        <Phone size={14} />
                        {lead.phone}
                      </ContactDetail>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={lead.status}>{lead.status}</StatusBadge>
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={lead.priority}>{lead.priority}</PriorityBadge>
                  </TableCell>
                  <TableCell>{lead.serviceNeeded}</TableCell>
                  <TableCell>{formatCurrency(lead.estimatedValue)}</TableCell>
                  <TableCell>{lead.source}</TableCell>
                  <TableCell>
                    <ActionButtons>
                      <SmallActionButton
                        onClick={() => alert(`Viewing lead: ${lead.firstName} ${lead.lastName} - ${lead.source}`)}
                        title="View lead details"
                      >
                        <Eye size={16} />
                      </SmallActionButton>
                      <SmallActionButton
                        onClick={() => alert(`Editing lead: ${lead.firstName} ${lead.lastName}`)}
                        title="Edit lead"
                      >
                        <Edit size={16} />
                      </SmallActionButton>
                      <SmallActionButton
                        variant="danger"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete lead: ${lead.firstName} ${lead.lastName}?`)) {
                            alert(`Lead deleted: ${lead.firstName} ${lead.lastName}`);
                          }
                        }}
                        title="Delete lead"
                      >
                        <Trash2 size={16} />
                      </SmallActionButton>
                    </ActionButtons>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </DataTable>
        )}

        {activeTab === 'opportunities' && (
          <DataTable>
            <TableHeader>
              <tr>
                <TableHeaderCell>Opportunity</TableHeaderCell>
                <TableHeaderCell>Stage</TableHeaderCell>
                <TableHeaderCell>Value</TableHeaderCell>
                <TableHeaderCell>Probability</TableHeaderCell>
                <TableHeaderCell>Expected Close</TableHeaderCell>
                <TableHeaderCell>Assigned To</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </tr>
            </TableHeader>
            <tbody>
              {filteredOpportunities.map((opportunity) => (
                <TableRow key={opportunity.id}>
                  <TableCell>
                    <div>
                      <div style={{ fontWeight: 600 }}>{opportunity.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {opportunity.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={opportunity.stage}>{opportunity.stage}</StatusBadge>
                  </TableCell>
                  <TableCell>{formatCurrency(opportunity.estimatedValue)}</TableCell>
                  <TableCell>{opportunity.probability}%</TableCell>
                  <TableCell>
                    {opportunity.expectedCloseDate ? formatDate(opportunity.expectedCloseDate) : '-'}
                  </TableCell>
                  <TableCell>{opportunity.assignedTo}</TableCell>
                  <TableCell>
                    <ActionButtons>
                      <SmallActionButton
                        onClick={() => alert(`Viewing opportunity: ${opportunity.name} - ${formatCurrency(opportunity.estimatedValue)}`)}
                        title="View opportunity details"
                      >
                        <Eye size={16} />
                      </SmallActionButton>
                      <SmallActionButton
                        onClick={() => alert(`Editing opportunity: ${opportunity.name}`)}
                        title="Edit opportunity"
                      >
                        <Edit size={16} />
                      </SmallActionButton>
                      <SmallActionButton
                        variant="danger"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete opportunity: ${opportunity.name}?`)) {
                            alert(`Opportunity deleted: ${opportunity.name}`);
                          }
                        }}
                        title="Delete opportunity"
                      >
                        <Trash2 size={16} />
                      </SmallActionButton>
                    </ActionButtons>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </DataTable>
        )}
      </ContentSection>

      {/* Enhanced CRM Modals */}
      {selectedCustomer && (
        <AutoFollowUpModal
          isOpen={followUpModalOpen}
          onClose={() => {
            setFollowUpModalOpen(false);
            setSelectedCustomer(null);
          }}
          customerData={selectedCustomer}
          onSave={handleFollowUpSave}
        />
      )}

      {selectedCustomer && (
        <DigitalProposalModal
          isOpen={proposalModalOpen}
          onClose={() => {
            setProposalModalOpen(false);
            setSelectedCustomer(null);
          }}
          customerData={selectedCustomer}
          onSave={handleProposalSave}
        />
      )}

      <SalesPipelineModal
        isOpen={pipelineModalOpen}
        onClose={() => setPipelineModalOpen(false)}
        onSave={handlePipelineSave}
      />

      <AddCustomerModal
        isOpen={addCustomerModalOpen}
        onClose={() => setAddCustomerModalOpen(false)}
        onSave={handleAddCustomer}
      />

      <CustomerDetailsModal
        isOpen={customerDetailsModalOpen}
        onClose={() => {
          setCustomerDetailsModalOpen(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
      />

      <FinanceContractModal
        isOpen={financeContractModalOpen}
        onClose={() => {
          setFinanceContractModalOpen(false);
          setSelectedCustomer(null);
        }}
        onSave={handleFinanceContractSave}
        customerData={selectedCustomer}
      />
    </PageContainer>
  );
};

export default CRM;