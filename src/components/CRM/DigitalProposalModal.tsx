import React, { useState } from 'react';
import styled from 'styled-components';
import { X, FileText, Upload, Download, Share2, Calculator, MapPin, Calendar, DollarSign, CheckCircle, Clock, Edit3, Mail, CreditCard, Shield, AlertCircle, RefreshCw } from 'lucide-react';
import PricingService from '../../services/PricingService';
import { formatCurrency } from '../../utils/currencyFormatter';

interface DigitalProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerData: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  onSave: (proposalData: any) => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 95vw;
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.xl};
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: white;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Tab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  font-weight: 600;
  color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.text.secondary};
  border-bottom: 2px solid ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormField = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
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

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const ServiceCard = styled.div<{ selected: boolean }>`
  border: 2px solid ${({ selected, theme }) => selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${({ selected, theme }) => selected ? `${theme.colors.primary}10` : theme.colors.surface};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => `${theme.colors.primary}05`};
  }
`;

const ServiceTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ServicePrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ServiceDescription = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const CalculatorGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const CalculatorSection = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const CostBreakdown = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
    font-weight: 700;
    font-size: 1.125rem;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const PreviewCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const PreviewHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary};
`;

const CompanyLogo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: flex-start;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  line-height: 1.4;

  input {
    margin-right: ${({ theme }) => theme.spacing.sm};
    margin-top: 0.125rem;
  }
`;

const ComplianceNotice = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
`;

const ComplianceTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ComplianceText = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
`;

const FinanceTermsCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TermsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const TermItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'success' }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  ${({ variant, theme }) => {
    switch (variant) {
      case 'success':
        return `
          border: 1px solid ${theme.colors.secondary};
          background-color: ${theme.colors.secondary};
          color: white;
          &:hover { background-color: ${theme.colors.secondary}dd; }
        `;
      case 'primary':
        return `
          border: 1px solid ${theme.colors.primary};
          background-color: ${theme.colors.primary};
          color: white;
          &:hover { background-color: ${theme.colors.primary}dd; }
        `;
      default:
        return `
          border: 1px solid ${theme.colors.border};
          background-color: ${theme.colors.surface};
          color: ${theme.colors.text.primary};
          &:hover { background-color: ${theme.colors.background}; }
        `;
    }
  }}
`;

const DigitalProposalModal: React.FC<DigitalProposalModalProps> = ({
  isOpen,
  onClose,
  customerData,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'services' | 'calculator' | 'financing' | 'preview'>('details');
  const [proposalData, setProposalData] = useState({
    title: 'Roofing Services Proposal',
    description: '',
    validUntil: '',
    services: [] as string[],
    customServices: [] as any[],
    materials: {
      type: 'asphalt_shingles',
      grade: 'architectural',
      color: 'charcoal',
      warranty: '25_years'
    },
    measurements: {
      squareFootage: '',
      stories: '1',
      pitch: 'standard',
      complexity: 'standard'
    },
    pricing: {
      materialCost: 0,
      laborCost: 0,
      permitCost: 0,
      disposal: 0,
      total: 0
    },
    timeline: {
      startDate: '',
      estimatedDuration: '3-5 days',
      weatherDependent: true
    },
    terms: {
      paymentTerms: '50% deposit, 50% on completion',
      warranty: '2 years labor, 25 years materials',
      insurance: 'Fully licensed and insured'
    },
    financing: {
      // Personal Information
      applicantName: '',
      socialSecurityNumber: '',
      dateOfBirth: '',
      driversLicense: '',
      maritalStatus: 'single',

      // Contact Information
      homeAddress: '',
      city: '',
      state: 'FL',
      zipCode: '',
      homePhone: '',
      cellPhone: '',
      email: '',
      yearsAtAddress: '',

      // Employment Information
      employerName: '',
      employerAddress: '',
      employerPhone: '',
      jobTitle: '',
      monthlyIncome: '',
      yearsEmployed: '',

      // Co-Applicant Information
      coApplicantName: '',
      coApplicantSSN: '',
      coApplicantDOB: '',
      coApplicantAddress: '',
      coApplicantPhone: '',
      coApplicantIncome: '',

      // Property Information
      propertyAddress: '',
      propertyType: 'primary_residence',
      propertyValue: '',
      mortgageBalance: '',
      monthlyPayment: '',

      // Financial Information
      bankName: '',
      accountType: 'checking',
      checkingBalance: '',
      savingsBalance: '',

      // Credit References
      creditCard1: '',
      creditCard1Balance: '',
      creditCard1Limit: '',
      creditCard2: '',
      creditCard2Balance: '',
      creditCard2Limit: '',

      // Additional Information
      bankruptcy: false,
      bankruptcyDate: '',
      judgments: false,
      judgmentsDetails: '',
      monthlyDebtPayments: '',
      otherMonthlyIncome: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      insuranceProvider: '',

      // Finance Terms
      requestedAmount: '',
      downPayment: '',
      interestRate: '12.00',
      numberOfPayments: '60',

      // Legal Acknowledgments
      creditAuthorizationConsent: false,
      accuracyAffirmation: false,
      electronicSignatureConsent: false,

      // Application Status
      applicationStatus: 'draft',
      submittedDate: '',
      reviewedDate: '',
      approvedDate: ''
    }
  });

  const pricingService = PricingService.getInstance();
  const [services, setServices] = useState(pricingService.getServices());
  const [pricingRefreshKey, setPricingRefreshKey] = useState(0);

  // Refresh pricing configuration when needed
  const refreshPricing = () => {
    pricingService.refreshConfiguration();
    setServices(pricingService.getServices());
    setPricingRefreshKey(prev => prev + 1);
  };

  const calculateTotal = () => {
    const squareFootage = parseInt(proposalData.measurements.squareFootage) || 0;
    const materialType = proposalData.materials.type || 'asphalt_shingles';
    const complexity = proposalData.measurements.complexity || 'standard';

    // Refresh pricing service to get latest configuration
    pricingService.refreshConfiguration();

    return pricingService.calculateProjectCost(
      proposalData.services,
      proposalData.customServices,
      squareFootage,
      materialType,
      complexity
    );
  };

  const costs = calculateTotal();

  // Listen for pricing configuration changes
  React.useEffect(() => {
    const handlePricingUpdate = () => {
      refreshPricing();
    };

    window.addEventListener('pricingConfigUpdated', handlePricingUpdate);
    return () => window.removeEventListener('pricingConfigUpdated', handlePricingUpdate);
  }, []);

  // Refresh pricing when modal opens
  React.useEffect(() => {
    if (isOpen) {
      refreshPricing();
    }
  }, [isOpen]);

  // Auto-populate finance application with customer and project data
  React.useEffect(() => {
    setProposalData(prev => ({
      ...prev,
      financing: {
        ...prev.financing,
        applicantName: customerData.name,
        email: customerData.email,
        homePhone: customerData.phone,
        cellPhone: customerData.phone,
        homeAddress: customerData.address?.street || '',
        city: customerData.address?.city || '',
        state: customerData.address?.state || '',
        zipCode: customerData.address?.zipCode || '',
        propertyAddress: customerData.address ? `${customerData.address.street}, ${customerData.address.city}, ${customerData.address.state} ${customerData.address.zipCode}` : '',
        requestedAmount: costs.total.toString()
      }
    }));
  }, [costs.total, customerData]);

  const calculateFinanceTerms = () => {
    const requestedAmount = parseFloat(proposalData.financing.requestedAmount) || costs.total;
    const downPayment = parseFloat(proposalData.financing.downPayment) || 0;
    const amountFinanced = requestedAmount - downPayment;
    const interestRate = parseFloat(proposalData.financing.interestRate) / 100 / 12; // Monthly rate
    const numberOfPayments = parseInt(proposalData.financing.numberOfPayments);

    // Calculate monthly payment using standard loan formula
    const monthlyPayment = amountFinanced *
      (interestRate * Math.pow(1 + interestRate, numberOfPayments)) /
      (Math.pow(1 + interestRate, numberOfPayments) - 1);

    const totalPayments = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayments - amountFinanced;

    return {
      amountFinanced,
      monthlyPayment: isNaN(monthlyPayment) ? 0 : monthlyPayment,
      totalPayments: isNaN(totalPayments) ? 0 : totalPayments,
      totalInterest: isNaN(totalInterest) ? 0 : totalInterest
    };
  };

  const financeTerms = calculateFinanceTerms();

  const updateFinancingField = (field: string, value: any) => {
    setProposalData(prev => ({
      ...prev,
      financing: {
        ...prev.financing,
        [field]: value
      }
    }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setProposalData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  // Convert finance application to finance contract data format
  const generateFinanceContractData = () => {
    const financing = proposalData.financing;
    const contractData = {
      // Contract Details
      contractNumber: `FFR-FIN-${Date.now().toString().slice(-6)}`,
      contractDate: new Date().toISOString().split('T')[0],

      // Customer Information (from application)
      customerName: financing.applicantName,
      customerAddress: financing.homeAddress,
      customerCity: financing.city,
      customerState: financing.state,
      customerZip: financing.zipCode,
      customerPhone: financing.cellPhone || financing.homePhone,
      customerEmail: financing.email,
      socialSecurityNumber: financing.socialSecurityNumber,
      dateOfBirth: financing.dateOfBirth,
      driversLicense: financing.driversLicense,

      // Co-Applicant Information
      coApplicantName: financing.coApplicantName,
      coApplicantAddress: financing.coApplicantAddress || financing.homeAddress,
      coApplicantPhone: financing.coApplicantPhone,
      coApplicantSSN: financing.coApplicantSSN,
      coApplicantDOB: financing.coApplicantDOB,

      // Employment Information
      employerName: financing.employerName,
      employerAddress: financing.employerAddress,
      employerPhone: financing.employerPhone,
      jobTitle: financing.jobTitle,
      monthlyIncome: financing.monthlyIncome,
      yearsEmployed: financing.yearsEmployed,

      // Property/Project Information
      propertyAddress: financing.propertyAddress,
      projectDescription: proposalData.description || 'Professional roofing services',
      contractorName: 'Florida First Roofing LLC',
      contractorLicense: 'CCC1336561',

      // Financial Terms
      totalContractAmount: financing.requestedAmount || costs.total.toString(),
      downPayment: financing.downPayment || '0',
      amountFinanced: financeTerms.amountFinanced.toString(),
      interestRate: financing.interestRate,
      numberOfPayments: financing.numberOfPayments,
      monthlyPaymentAmount: financeTerms.monthlyPayment.toFixed(2),
      totalPayments: financeTerms.totalPayments.toFixed(2),
      totalInterest: financeTerms.totalInterest.toFixed(2),
      apr: financing.interestRate, // Simplified APR
      firstPaymentDate: '', // To be set when contract is signed

      // Additional Terms
      latePaymentFee: '25.00',
      prepaymentPenalty: false,
      defaultInterestRate: '18.00',

      // Insurance and Warranties
      requiresInsurance: true,
      warrantyPeriod: proposalData.terms?.warranty || '10 Years',

      // Application metadata
      applicationData: financing,
      sourceType: 'digital_proposal'
    };

    return contractData;
  };

  const handleSave = () => {
    const finalProposal = {
      ...proposalData,
      customerId: customerData.id,
      pricing: costs,
      financeTerms: financeTerms,
      status: 'draft',
      createdAt: new Date().toISOString(),
      financeContractData: null as any // Initialize as null, will be populated if finance application is complete
    };

    // If financing application is complete and all consents are given,
    // mark it ready for finance contract generation
    const financeComplete = activeTab === 'financing' &&
      proposalData.financing.creditAuthorizationConsent &&
      proposalData.financing.accuracyAffirmation &&
      proposalData.financing.electronicSignatureConsent &&
      proposalData.financing.applicantName &&
      proposalData.financing.socialSecurityNumber &&
      proposalData.financing.dateOfBirth;

    if (financeComplete) {
      finalProposal.financing.applicationStatus = 'submitted';
      finalProposal.financing.submittedDate = new Date().toISOString();

      // Generate finance contract data for auto-population
      const financeContractData = generateFinanceContractData();
      finalProposal.financeContractData = financeContractData;

      // Finance application data prepared for submission (removed localStorage dependency)
      try {
        const applicationRecord = {
          id: `FFR-APP-${Date.now()}`,
          customerId: customerData.id,
          customerName: customerData.name,
          submittedDate: new Date().toISOString(),
          status: 'submitted',
          applicationData: proposalData.financing,
          contractData: financeContractData,
          projectAmount: costs.total,
          requestedAmount: financeTerms.amountFinanced,
          monthlyPayment: financeTerms.monthlyPayment
        };

        console.log('💳 Finance Application Submitted:', applicationRecord);
        console.log('📋 Finance application ready for backend integration');

        // In production, this would be sent to the backend API
        // await submitFinanceApplication(applicationRecord);
      } catch (error) {
        console.error('Error preparing finance application:', error);
      }
    }

    onSave(finalProposal);

    // Show success message based on what was saved
    if (financeComplete) {
      alert('Finance application submitted successfully! Ready for approval and contract generation.');
    } else if (activeTab === 'financing') {
      alert('Finance application draft saved. Complete all required fields and legal consents to submit.');
    } else {
      alert('Proposal saved successfully!');
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <img src="/FFR logo 32x32.png" alt="FFR" style={{ height: '20px', marginRight: '8px' }} />
            Digital Proposal Builder
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <TabsContainer>
            <Tab active={activeTab === 'details'} onClick={() => setActiveTab('details')}>
              Project Details
            </Tab>
            <Tab active={activeTab === 'services'} onClick={() => setActiveTab('services')}>
              Services & Materials
            </Tab>
            <Tab active={activeTab === 'calculator'} onClick={() => setActiveTab('calculator')}>
              Price Calculator
            </Tab>
            <Tab active={activeTab === 'financing'} onClick={() => setActiveTab('financing')}>
              Finance Application
            </Tab>
            <Tab active={activeTab === 'preview'} onClick={() => setActiveTab('preview')}>
              Preview & Send
            </Tab>
          </TabsContainer>

          {activeTab === 'details' && (
            <>
              <Section>
                <SectionTitle>
                  <MapPin size={16} />
                  Customer & Property Information
                </SectionTitle>
                <FormGrid>
                  <FormField>
                    <Label>Customer Name</Label>
                    <Input value={customerData.name} disabled />
                  </FormField>
                  <FormField>
                    <Label>Email</Label>
                    <Input value={customerData.email} disabled />
                  </FormField>
                  <FormField>
                    <Label>Property Address</Label>
                    <Input value={customerData.address ? `${customerData.address.street}, ${customerData.address.city}, ${customerData.address.state}` : 'Address not available'} disabled />
                  </FormField>
                  <FormField>
                    <Label>Phone</Label>
                    <Input value={customerData.phone} disabled />
                  </FormField>
                </FormGrid>
              </Section>

              <Section>
                <SectionTitle>
                  <Edit3 size={16} />
                  Proposal Details
                </SectionTitle>
                <FormGrid>
                  <FormField>
                    <Label>Proposal Title</Label>
                    <Input
                      value={proposalData.title}
                      onChange={(e) => setProposalData({...proposalData, title: e.target.value})}
                      placeholder="Enter proposal title..."
                    />
                  </FormField>
                  <FormField>
                    <Label>Valid Until</Label>
                    <Input
                      type="date"
                      value={proposalData.validUntil}
                      onChange={(e) => setProposalData({...proposalData, validUntil: e.target.value})}
                    />
                  </FormField>
                </FormGrid>
                <FormField>
                  <Label>Project Description</Label>
                  <TextArea
                    value={proposalData.description}
                    onChange={(e) => setProposalData({...proposalData, description: e.target.value})}
                    placeholder="Describe the roofing project and key requirements..."
                  />
                </FormField>
              </Section>
            </>
          )}

          {activeTab === 'services' && (
            <>
              <Section>
                <SectionTitle>
                  <CheckCircle size={16} />
                  Select Services
                </SectionTitle>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      selected={proposalData.services.includes(service.id)}
                      onClick={() => handleServiceToggle(service.id)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <ServiceTitle>{service.title}</ServiceTitle>
                          <ServiceDescription>{service.description}</ServiceDescription>
                        </div>
                        <ServicePrice>{formatCurrency(service.basePrice)}</ServicePrice>
                      </div>
                    </ServiceCard>
                  ))}
                </div>
              </Section>

              <Section>
                <SectionTitle>Materials & Specifications</SectionTitle>
                <FormGrid>
                  <FormField>
                    <Label>Roofing Material</Label>
                    <Select
                      value={proposalData.materials.type}
                      onChange={(e) => setProposalData({
                        ...proposalData,
                        materials: {...proposalData.materials, type: e.target.value}
                      })}
                    >
                      <option value="asphalt_shingles">Asphalt Shingles</option>
                      <option value="metal">Metal Roofing</option>
                      <option value="tile">Tile Roofing</option>
                      <option value="slate">Slate</option>
                    </Select>
                  </FormField>
                  <FormField>
                    <Label>Grade/Quality</Label>
                    <Select
                      value={proposalData.materials.grade}
                      onChange={(e) => setProposalData({
                        ...proposalData,
                        materials: {...proposalData.materials, grade: e.target.value}
                      })}
                    >
                      <option value="basic">Basic (3-tab)</option>
                      <option value="architectural">Architectural</option>
                      <option value="premium">Premium Designer</option>
                    </Select>
                  </FormField>
                  <FormField>
                    <Label>Warranty Period</Label>
                    <Select
                      value={proposalData.materials.warranty}
                      onChange={(e) => setProposalData({
                        ...proposalData,
                        materials: {...proposalData.materials, warranty: e.target.value}
                      })}
                    >
                      <option value="15_years">15 Years</option>
                      <option value="25_years">25 Years</option>
                      <option value="30_years">30 Years</option>
                      <option value="50_years">50 Years</option>
                      <option value="lifetime">Lifetime</option>
                    </Select>
                  </FormField>
                </FormGrid>
              </Section>
            </>
          )}

          {activeTab === 'calculator' && (
            <CalculatorGrid>
              <div>
                <Section>
                  <SectionTitle>
                    <Calculator size={16} />
                    Property Measurements
                  </SectionTitle>
                  <FormGrid>
                    <FormField>
                      <Label>Square Footage</Label>
                      <Input
                        type="number"
                        value={proposalData.measurements.squareFootage}
                        onChange={(e) => setProposalData({
                          ...proposalData,
                          measurements: {...proposalData.measurements, squareFootage: e.target.value}
                        })}
                        placeholder="Enter roof square footage..."
                      />
                    </FormField>
                    <FormField>
                      <Label>Number of Stories</Label>
                      <Select
                        value={proposalData.measurements.stories}
                        onChange={(e) => setProposalData({
                          ...proposalData,
                          measurements: {...proposalData.measurements, stories: e.target.value}
                        })}
                      >
                        <option value="1">1 Story</option>
                        <option value="2">2 Story</option>
                        <option value="3">3+ Stories</option>
                      </Select>
                    </FormField>
                    <FormField>
                      <Label>Roof Pitch</Label>
                      <Select
                        value={proposalData.measurements.pitch}
                        onChange={(e) => setProposalData({
                          ...proposalData,
                          measurements: {...proposalData.measurements, pitch: e.target.value}
                        })}
                      >
                        <option value="low">Low Pitch (0/12 - 3/12)</option>
                        <option value="standard">Standard (4/12 - 7/12)</option>
                        <option value="steep">Steep (8/12+)</option>
                      </Select>
                    </FormField>
                    <FormField>
                      <Label>Project Complexity</Label>
                      <Select
                        value={proposalData.measurements.complexity}
                        onChange={(e) => setProposalData({
                          ...proposalData,
                          measurements: {...proposalData.measurements, complexity: e.target.value}
                        })}
                      >
                        <option value="simple">Simple (Rectangle, few penetrations)</option>
                        <option value="standard">Standard (Multiple angles, dormers)</option>
                        <option value="complex">Complex (Multiple levels, skylights)</option>
                      </Select>
                    </FormField>
                  </FormGrid>
                </Section>
              </div>

              <CalculatorSection>
                <SectionTitle>
                  <DollarSign size={16} />
                  Cost Breakdown
                  <button
                    onClick={refreshPricing}
                    style={{
                      marginLeft: 'auto',
                      background: 'none',
                      border: 'none',
                      color: '#1e40af',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.875rem'
                    }}
                    title="Refresh pricing from admin settings"
                  >
                    <RefreshCw size={14} />
                    Refresh
                  </button>
                </SectionTitle>
                <CostBreakdown>
                  <span>Selected Services</span>
                  <span>{formatCurrency(costs.servicesTotal)}</span>
                </CostBreakdown>
                <CostBreakdown>
                  <span>Materials</span>
                  <span>{formatCurrency(costs.materialCost)}</span>
                </CostBreakdown>
                <CostBreakdown>
                  <span>Labor</span>
                  <span>{formatCurrency(costs.laborCost)}</span>
                </CostBreakdown>
                <CostBreakdown>
                  <span>Permits</span>
                  <span>{formatCurrency(costs.permitCost)}</span>
                </CostBreakdown>
                <CostBreakdown>
                  <span>Disposal</span>
                  <span>{formatCurrency(costs.disposal)}</span>
                </CostBreakdown>
                <CostBreakdown>
                  <span>Total Investment</span>
                  <span>{formatCurrency(costs.total)}</span>
                </CostBreakdown>
              </CalculatorSection>
            </CalculatorGrid>
          )}

          {activeTab === 'financing' && (
            <>
              <ComplianceNotice>
                <ComplianceTitle>
                  <Shield size={16} />
                  FFR Financing Application - TILA Compliant
                </ComplianceTitle>
                <ComplianceText>
                  This application is compliant with the Truth in Lending Act (TILA) and Florida state regulations.
                  All information provided will be used solely for credit evaluation purposes and will be kept confidential.
                  By completing this application, you authorize Florida First Roofing LLC to obtain credit reports and verify employment information.
                </ComplianceText>
              </ComplianceNotice>

              <Section>
                <SectionTitle>
                  <CreditCard size={16} />
                  Finance Terms & Project Amount
                </SectionTitle>
                <FinanceTermsCard>
                  <TermsGrid>
                    <FormField>
                      <Label>Project Total Amount</Label>
                      <Input
                        value={formatCurrency(costs.total)}
                        disabled
                      />
                    </FormField>
                    <FormField>
                      <Label>Requested Financing Amount</Label>
                      <Input
                        type="number"
                        value={proposalData.financing.requestedAmount}
                        onChange={(e) => updateFinancingField('requestedAmount', e.target.value)}
                        placeholder="Enter amount to finance"
                      />
                    </FormField>
                    <FormField>
                      <Label>Down Payment (Optional)</Label>
                      <Input
                        type="number"
                        value={proposalData.financing.downPayment}
                        onChange={(e) => updateFinancingField('downPayment', e.target.value)}
                        placeholder="Enter down payment amount"
                      />
                    </FormField>
                    <FormField>
                      <Label>Interest Rate (%)</Label>
                      <Input
                        value={proposalData.financing.interestRate}
                        disabled
                        style={{ backgroundColor: '#f5f5f5' }}
                      />
                    </FormField>
                  </TermsGrid>

                  <div>
                    <h4 style={{ marginBottom: '1rem', color: '#059669' }}>Estimated Payment Terms</h4>
                    <TermItem>
                      <span>Amount Financed:</span>
                      <span>{formatCurrency(financeTerms.amountFinanced)}</span>
                    </TermItem>
                    <TermItem>
                      <span>Monthly Payment:</span>
                      <span>{formatCurrency(financeTerms.monthlyPayment)}</span>
                    </TermItem>
                    <TermItem>
                      <span>Number of Payments:</span>
                      <span>{proposalData.financing.numberOfPayments}</span>
                    </TermItem>
                    <TermItem>
                      <span>Total Interest:</span>
                      <span>{formatCurrency(financeTerms.totalInterest)}</span>
                    </TermItem>
                    <TermItem>
                      <span>Total of Payments:</span>
                      <span>{formatCurrency(financeTerms.totalPayments)}</span>
                    </TermItem>
                  </div>
                </FinanceTermsCard>
              </Section>

              <Section>
                <SectionTitle>
                  Personal Information
                </SectionTitle>
                <FormGrid>
                  <FormField>
                    <Label>Full Legal Name *</Label>
                    <Input
                      value={proposalData.financing.applicantName}
                      onChange={(e) => updateFinancingField('applicantName', e.target.value)}
                      placeholder="Enter full legal name"
                      required
                    />
                  </FormField>
                  <FormField>
                    <Label>Social Security Number *</Label>
                    <Input
                      value={proposalData.financing.socialSecurityNumber}
                      onChange={(e) => updateFinancingField('socialSecurityNumber', e.target.value)}
                      placeholder="XXX-XX-XXXX"
                      required
                    />
                  </FormField>
                  <FormField>
                    <Label>Date of Birth *</Label>
                    <Input
                      type="date"
                      value={proposalData.financing.dateOfBirth}
                      onChange={(e) => updateFinancingField('dateOfBirth', e.target.value)}
                      required
                    />
                  </FormField>
                  <FormField>
                    <Label>Driver's License Number *</Label>
                    <Input
                      value={proposalData.financing.driversLicense}
                      onChange={(e) => updateFinancingField('driversLicense', e.target.value)}
                      placeholder="Enter driver's license number"
                      required
                    />
                  </FormField>
                  <FormField>
                    <Label>Marital Status</Label>
                    <Select
                      value={proposalData.financing.maritalStatus}
                      onChange={(e) => updateFinancingField('maritalStatus', e.target.value)}
                    >
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                      <option value="divorced">Divorced</option>
                      <option value="widowed">Widowed</option>
                    </Select>
                  </FormField>
                </FormGrid>
              </Section>

              <Section>
                <SectionTitle>
                  Contact Information
                </SectionTitle>
                <FormGrid>
                  <FormField>
                    <Label>Home Address *</Label>
                    <Input
                      value={proposalData.financing.homeAddress}
                      onChange={(e) => updateFinancingField('homeAddress', e.target.value)}
                      placeholder="Street address"
                      required
                    />
                  </FormField>
                  <FormField>
                    <Label>City *</Label>
                    <Input
                      value={proposalData.financing.city}
                      onChange={(e) => updateFinancingField('city', e.target.value)}
                      placeholder="City"
                      required
                    />
                  </FormField>
                  <FormField>
                    <Label>State *</Label>
                    <Select
                      value={proposalData.financing.state}
                      onChange={(e) => updateFinancingField('state', e.target.value)}
                      required
                    >
                      <option value="FL">Florida</option>
                      <option value="AL">Alabama</option>
                      <option value="GA">Georgia</option>
                      <option value="SC">South Carolina</option>
                      <option value="NC">North Carolina</option>
                    </Select>
                  </FormField>
                  <FormField>
                    <Label>ZIP Code *</Label>
                    <Input
                      value={proposalData.financing.zipCode}
                      onChange={(e) => updateFinancingField('zipCode', e.target.value)}
                      placeholder="ZIP Code"
                      required
                    />
                  </FormField>
                  <FormField>
                    <Label>Home Phone</Label>
                    <Input
                      value={proposalData.financing.homePhone}
                      onChange={(e) => updateFinancingField('homePhone', e.target.value)}
                      placeholder="(XXX) XXX-XXXX"
                    />
                  </FormField>
                  <FormField>
                    <Label>Cell Phone *</Label>
                    <Input
                      value={proposalData.financing.cellPhone}
                      onChange={(e) => updateFinancingField('cellPhone', e.target.value)}
                      placeholder="(XXX) XXX-XXXX"
                      required
                    />
                  </FormField>
                  <FormField>
                    <Label>Email Address *</Label>
                    <Input
                      type="email"
                      value={proposalData.financing.email}
                      onChange={(e) => updateFinancingField('email', e.target.value)}
                      placeholder="email@example.com"
                      required
                    />
                  </FormField>
                  <FormField>
                    <Label>Years at Current Address</Label>
                    <Input
                      type="number"
                      value={proposalData.financing.yearsAtAddress}
                      onChange={(e) => updateFinancingField('yearsAtAddress', e.target.value)}
                      placeholder="Number of years"
                    />
                  </FormField>
                </FormGrid>
              </Section>

              <Section>
                <SectionTitle>
                  Employment Information
                </SectionTitle>
                <FormGrid>
                  <FormField>
                    <Label>Employer Name *</Label>
                    <Input
                      value={proposalData.financing.employerName}
                      onChange={(e) => updateFinancingField('employerName', e.target.value)}
                      placeholder="Current employer name"
                      required
                    />
                  </FormField>
                  <FormField>
                    <Label>Employer Address *</Label>
                    <Input
                      value={proposalData.financing.employerAddress}
                      onChange={(e) => updateFinancingField('employerAddress', e.target.value)}
                      placeholder="Employer street address"
                      required
                    />
                  </FormField>
                  <FormField>
                    <Label>Employer Phone *</Label>
                    <Input
                      value={proposalData.financing.employerPhone}
                      onChange={(e) => updateFinancingField('employerPhone', e.target.value)}
                      placeholder="(XXX) XXX-XXXX"
                      required
                    />
                  </FormField>
                  <FormField>
                    <Label>Job Title/Position *</Label>
                    <Input
                      value={proposalData.financing.jobTitle}
                      onChange={(e) => updateFinancingField('jobTitle', e.target.value)}
                      placeholder="Your job title"
                      required
                    />
                  </FormField>
                  <FormField>
                    <Label>Monthly Gross Income *</Label>
                    <Input
                      type="number"
                      value={proposalData.financing.monthlyIncome}
                      onChange={(e) => updateFinancingField('monthlyIncome', e.target.value)}
                      placeholder="Monthly income before taxes"
                      required
                    />
                  </FormField>
                  <FormField>
                    <Label>Years with Current Employer *</Label>
                    <Input
                      type="number"
                      value={proposalData.financing.yearsEmployed}
                      onChange={(e) => updateFinancingField('yearsEmployed', e.target.value)}
                      placeholder="Years employed"
                      required
                    />
                  </FormField>
                </FormGrid>
              </Section>

              <Section>
                <SectionTitle>
                  Property Information
                </SectionTitle>
                <FormGrid>
                  <FormField>
                    <Label>Property Address *</Label>
                    <Input
                      value={proposalData.financing.propertyAddress}
                      onChange={(e) => updateFinancingField('propertyAddress', e.target.value)}
                      placeholder="Property address"
                      required
                    />
                  </FormField>
                  <FormField>
                    <Label>Property Type</Label>
                    <Select
                      value={proposalData.financing.propertyType}
                      onChange={(e) => updateFinancingField('propertyType', e.target.value)}
                    >
                      <option value="primary_residence">Primary Residence</option>
                      <option value="secondary_residence">Secondary Residence</option>
                      <option value="investment_property">Investment Property</option>
                    </Select>
                  </FormField>
                  <FormField>
                    <Label>Estimated Property Value</Label>
                    <Input
                      type="number"
                      value={proposalData.financing.propertyValue}
                      onChange={(e) => updateFinancingField('propertyValue', e.target.value)}
                      placeholder="Current property value"
                    />
                  </FormField>
                  <FormField>
                    <Label>Mortgage Balance</Label>
                    <Input
                      type="number"
                      value={proposalData.financing.mortgageBalance}
                      onChange={(e) => updateFinancingField('mortgageBalance', e.target.value)}
                      placeholder="Outstanding mortgage balance"
                    />
                  </FormField>
                  <FormField>
                    <Label>Monthly Mortgage Payment</Label>
                    <Input
                      type="number"
                      value={proposalData.financing.monthlyPayment}
                      onChange={(e) => updateFinancingField('monthlyPayment', e.target.value)}
                      placeholder="Monthly mortgage payment"
                    />
                  </FormField>
                </FormGrid>
              </Section>

              <Section>
                <SectionTitle>
                  Banking Information
                </SectionTitle>
                <FormGrid>
                  <FormField>
                    <Label>Bank Name</Label>
                    <Input
                      value={proposalData.financing.bankName}
                      onChange={(e) => updateFinancingField('bankName', e.target.value)}
                      placeholder="Primary bank name"
                    />
                  </FormField>
                  <FormField>
                    <Label>Account Type</Label>
                    <Select
                      value={proposalData.financing.accountType}
                      onChange={(e) => updateFinancingField('accountType', e.target.value)}
                    >
                      <option value="checking">Checking</option>
                      <option value="savings">Savings</option>
                      <option value="both">Both</option>
                    </Select>
                  </FormField>
                  <FormField>
                    <Label>Checking Balance</Label>
                    <Input
                      type="number"
                      value={proposalData.financing.checkingBalance}
                      onChange={(e) => updateFinancingField('checkingBalance', e.target.value)}
                      placeholder="Current checking balance"
                    />
                  </FormField>
                  <FormField>
                    <Label>Savings Balance</Label>
                    <Input
                      type="number"
                      value={proposalData.financing.savingsBalance}
                      onChange={(e) => updateFinancingField('savingsBalance', e.target.value)}
                      placeholder="Current savings balance"
                    />
                  </FormField>
                </FormGrid>
              </Section>

              <Section>
                <SectionTitle>
                  Co-Applicant Information (if applicable)
                </SectionTitle>
                <FormGrid>
                  <FormField>
                    <Label>Co-Applicant Name</Label>
                    <Input
                      value={proposalData.financing.coApplicantName}
                      onChange={(e) => updateFinancingField('coApplicantName', e.target.value)}
                      placeholder="Co-applicant full name"
                    />
                  </FormField>
                  <FormField>
                    <Label>Co-Applicant SSN</Label>
                    <Input
                      value={proposalData.financing.coApplicantSSN}
                      onChange={(e) => updateFinancingField('coApplicantSSN', e.target.value)}
                      placeholder="XXX-XX-XXXX"
                    />
                  </FormField>
                  <FormField>
                    <Label>Co-Applicant Date of Birth</Label>
                    <Input
                      type="date"
                      value={proposalData.financing.coApplicantDOB}
                      onChange={(e) => updateFinancingField('coApplicantDOB', e.target.value)}
                    />
                  </FormField>
                  <FormField>
                    <Label>Co-Applicant Phone</Label>
                    <Input
                      value={proposalData.financing.coApplicantPhone}
                      onChange={(e) => updateFinancingField('coApplicantPhone', e.target.value)}
                      placeholder="(XXX) XXX-XXXX"
                    />
                  </FormField>
                  <FormField>
                    <Label>Co-Applicant Monthly Income</Label>
                    <Input
                      type="number"
                      value={proposalData.financing.coApplicantIncome}
                      onChange={(e) => updateFinancingField('coApplicantIncome', e.target.value)}
                      placeholder="Monthly income"
                    />
                  </FormField>
                </FormGrid>
              </Section>

              <Section>
                <SectionTitle>
                  Additional Financial Information
                </SectionTitle>
                <FormGrid>
                  <FormField>
                    <Label>Monthly Debt Payments</Label>
                    <Input
                      type="number"
                      value={proposalData.financing.monthlyDebtPayments}
                      onChange={(e) => updateFinancingField('monthlyDebtPayments', e.target.value)}
                      placeholder="Total monthly debt obligations"
                    />
                  </FormField>
                  <FormField>
                    <Label>Other Monthly Income</Label>
                    <Input
                      type="number"
                      value={proposalData.financing.otherMonthlyIncome}
                      onChange={(e) => updateFinancingField('otherMonthlyIncome', e.target.value)}
                      placeholder="Rental, pension, etc."
                    />
                  </FormField>
                  <FormField>
                    <Label>Emergency Contact Name</Label>
                    <Input
                      value={proposalData.financing.emergencyContactName}
                      onChange={(e) => updateFinancingField('emergencyContactName', e.target.value)}
                      placeholder="Emergency contact full name"
                    />
                  </FormField>
                  <FormField>
                    <Label>Emergency Contact Phone</Label>
                    <Input
                      value={proposalData.financing.emergencyContactPhone}
                      onChange={(e) => updateFinancingField('emergencyContactPhone', e.target.value)}
                      placeholder="(XXX) XXX-XXXX"
                    />
                  </FormField>
                  <FormField>
                    <Label>Homeowners Insurance Provider</Label>
                    <Input
                      value={proposalData.financing.insuranceProvider}
                      onChange={(e) => updateFinancingField('insuranceProvider', e.target.value)}
                      placeholder="Insurance company name"
                    />
                  </FormField>
                </FormGrid>
              </Section>

              <Section>
                <SectionTitle>
                  <AlertCircle size={16} />
                  Legal Acknowledgments & Consent
                </SectionTitle>

                <CheckboxLabel>
                  <Checkbox
                    checked={proposalData.financing.creditAuthorizationConsent}
                    onChange={(e) => updateFinancingField('creditAuthorizationConsent', e.target.checked)}
                    required
                  />
                  <span>
                    <strong>Credit Authorization:</strong> I authorize Florida First Roofing LLC and its designated agents
                    to obtain information from my credit profile from one or more consumer reporting agencies.
                    I understand that this may include obtaining my credit score and credit report information.
                    This authorization will remain in effect until this application is withdrawn or a credit decision is made.
                  </span>
                </CheckboxLabel>

                <CheckboxLabel>
                  <Checkbox
                    checked={proposalData.financing.accuracyAffirmation}
                    onChange={(e) => updateFinancingField('accuracyAffirmation', e.target.checked)}
                    required
                  />
                  <span>
                    <strong>Accuracy Affirmation:</strong> I certify that all information provided in this application
                    is true, complete, and accurate to the best of my knowledge. I understand that any false statements
                    may result in denial of credit or legal action. I agree to notify Florida First Roofing LLC immediately
                    of any changes to the information provided.
                  </span>
                </CheckboxLabel>

                <CheckboxLabel>
                  <Checkbox
                    checked={proposalData.financing.electronicSignatureConsent}
                    onChange={(e) => updateFinancingField('electronicSignatureConsent', e.target.checked)}
                    required
                  />
                  <span>
                    <strong>Electronic Signature Consent:</strong> I consent to use electronic signatures, records,
                    and disclosures in connection with this application and any resulting agreement. I understand
                    that I may request paper copies of any electronic documents by contacting Florida First Roofing LLC
                    at 321-301-4512.
                  </span>
                </CheckboxLabel>

                <ComplianceNotice>
                  <ComplianceTitle>
                    <Shield size={16} />
                    Important Privacy & Legal Information
                  </ComplianceTitle>
                  <ComplianceText>
                    <strong>Equal Credit Opportunity:</strong> Federal law prohibits creditors from discriminating against credit applicants on the basis of race, color, religion, national origin, sex, marital status, age, or because you receive public assistance.
                    <br /><br />
                    <strong>Privacy Notice:</strong> Information collected in this application may be shared with credit reporting agencies and other financial institutions as permitted by law. We maintain physical, electronic, and procedural safeguards to protect your information.
                    <br /><br />
                    <strong>Florida Contractor Information:</strong> Florida First Roofing LLC - License #CCC1336561 - 3815 HWY 1 #13, Cocoa, FL 32926
                  </ComplianceText>
                </ComplianceNotice>
              </Section>
            </>
          )}

          {activeTab === 'preview' && (
            <>
              <PreviewCard>
                <PreviewHeader>
                  <CompanyLogo>
                    <img src="/FFR logo 32x32.png" alt="FFR" style={{ height: '24px', marginRight: '8px', verticalAlign: 'middle' }} />
                    Florida First Roofing LLC
                  </CompanyLogo>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    3815 HWY 1 #13, Cocoa, FL 32926 • 321-301-4512 • License: CCC1336561
                  </div>
                </PreviewHeader>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {proposalData.title}
                  </h2>
                  <div style={{ color: '#6b7280' }}>
                    Prepared for: {customerData.name}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    {customerData.address ? `${customerData.address.street}, ${customerData.address.city}, ${customerData.address.state}` : 'Address not available'}
                  </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Project Overview</h3>
                  <p>{proposalData.description || 'Professional roofing services for your property.'}</p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Investment Summary</h3>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#059669', textAlign: 'center' }}>
                    {formatCurrency(costs.total)}
                  </div>
                </div>
              </PreviewCard>

              <Section>
                <SectionTitle>
                  <Share2 size={16} />
                  Delivery Options
                </SectionTitle>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Button variant="secondary">
                    <Download size={16} />
                    Download PDF
                  </Button>
                  <Button variant="secondary">
                    <Mail size={16} />
                    Email to Customer
                  </Button>
                  <Button variant="secondary">
                    <Share2 size={16} />
                    Share Link
                  </Button>
                </div>
              </Section>
            </>
          )}

          <ButtonGroup>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            {activeTab === 'preview' && (
              <Button variant="success" onClick={handleSave}>
                <CheckCircle size={16} />
                Save & Send Proposal
              </Button>
            )}
            {activeTab === 'financing' && (
              <>
                <Button variant="primary" onClick={handleSave}>
                  <CreditCard size={16} />
                  {proposalData.financing.creditAuthorizationConsent &&
                   proposalData.financing.accuracyAffirmation &&
                   proposalData.financing.electronicSignatureConsent &&
                   proposalData.financing.applicantName &&
                   proposalData.financing.socialSecurityNumber &&
                   proposalData.financing.dateOfBirth
                    ? 'Submit Finance Application'
                    : 'Save Application Draft'
                  }
                </Button>
              </>
            )}
            {activeTab !== 'preview' && activeTab !== 'financing' && (
              <Button variant="primary" onClick={handleSave}>
                Save Draft
              </Button>
            )}
          </ButtonGroup>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default DigitalProposalModal;