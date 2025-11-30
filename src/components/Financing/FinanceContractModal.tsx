import React from 'react';
import EditableModal from '../EditableModal';
import { ModalField } from '../ModalStructureEditor';

interface FinanceContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contractData: FinanceContractData) => void;
  initialData?: FinanceContractData;
  customerData?: any;
  projectData?: any;
}

interface FinanceContractData {
  // Contract Details
  contractNumber: string;
  contractDate: string;

  // Customer Information
  customerName: string;
  customerAddress: string;
  customerCity: string;
  customerState: string;
  customerZip: string;
  customerPhone: string;
  customerEmail: string;
  socialSecurityNumber: string;
  dateOfBirth: string;
  driversLicense: string;

  // Co-Applicant Information (if applicable)
  coApplicantName: string;
  coApplicantAddress: string;
  coApplicantPhone: string;
  coApplicantSSN: string;
  coApplicantDOB: string;

  // Employment Information
  employerName: string;
  employerAddress: string;
  employerPhone: string;
  jobTitle: string;
  monthlyIncome: string;
  yearsEmployed: string;

  // Property/Project Information
  propertyAddress: string;
  projectDescription: string;
  contractorName: string;
  contractorLicense: string;

  // Financial Terms
  totalContractAmount: string;
  downPayment: string;
  amountFinanced: string;
  interestRate: string;
  numberOfPayments: string;
  monthlyPaymentAmount: string;
  totalPayments: string;
  totalInterest: string;
  apr: string;
  firstPaymentDate: string;

  // Additional Terms
  latePaymentFee: string;
  prepaymentPenalty: boolean;
  defaultInterestRate: string;

  // Insurance and Warranties
  requiresInsurance: boolean;
  warrantyPeriod: string;

  // Signatures and Dates
  customerSignatureDate: string;
  coApplicantSignatureDate: string;
  contractorSignatureDate: string;

  // Custom fields for additional terms
  [key: string]: any;
}

// Default fields for Finance Contract Modal with 12% interest and 60 payments standard
const defaultFinanceContractFields: ModalField[] = [
  // Contract Information
  {
    id: 'contractNumber',
    type: 'text',
    label: 'Contract Number',
    placeholder: 'Auto-generated if empty',
    required: false,
    order: 0
  },
  {
    id: 'contractDate',
    type: 'date',
    label: 'Contract Date',
    placeholder: 'Select contract date',
    required: true,
    order: 1
  },

  // Customer Information
  {
    id: 'customerName',
    type: 'text',
    label: 'Customer Name',
    placeholder: 'Enter full customer name',
    required: true,
    order: 2
  },
  {
    id: 'customerAddress',
    type: 'text',
    label: 'Customer Address',
    placeholder: 'Enter street address',
    required: true,
    order: 3
  },
  {
    id: 'customerCity',
    type: 'text',
    label: 'City',
    placeholder: 'Enter city',
    required: true,
    order: 4
  },
  {
    id: 'customerState',
    type: 'select',
    label: 'State',
    placeholder: 'Select state',
    required: true,
    options: ['FL', 'AL', 'GA', 'SC', 'NC', 'TN', 'MS', 'LA'],
    order: 5
  },
  {
    id: 'customerZip',
    type: 'text',
    label: 'ZIP Code',
    placeholder: 'Enter ZIP code',
    required: true,
    order: 6
  },
  {
    id: 'customerPhone',
    type: 'phone',
    label: 'Customer Phone',
    placeholder: 'Enter phone number',
    required: true,
    order: 7
  },
  {
    id: 'customerEmail',
    type: 'email',
    label: 'Customer Email',
    placeholder: 'Enter email address',
    required: true,
    order: 8
  },
  {
    id: 'socialSecurityNumber',
    type: 'text',
    label: 'Social Security Number',
    placeholder: 'XXX-XX-XXXX',
    required: true,
    order: 9
  },
  {
    id: 'dateOfBirth',
    type: 'date',
    label: 'Date of Birth',
    placeholder: 'Select date of birth',
    required: true,
    order: 10
  },
  {
    id: 'driversLicense',
    type: 'text',
    label: 'Driver\'s License Number',
    placeholder: 'Enter license number',
    required: true,
    order: 11
  },

  // Employment Information
  {
    id: 'employerName',
    type: 'text',
    label: 'Employer Name',
    placeholder: 'Enter employer name',
    required: true,
    order: 12
  },
  {
    id: 'employerAddress',
    type: 'text',
    label: 'Employer Address',
    placeholder: 'Enter employer address',
    required: true,
    order: 13
  },
  {
    id: 'employerPhone',
    type: 'phone',
    label: 'Employer Phone',
    placeholder: 'Enter employer phone',
    required: true,
    order: 14
  },
  {
    id: 'jobTitle',
    type: 'text',
    label: 'Job Title',
    placeholder: 'Enter job title',
    required: true,
    order: 15
  },
  {
    id: 'monthlyIncome',
    type: 'currency',
    label: 'Monthly Gross Income',
    placeholder: 'Enter monthly income',
    required: true,
    order: 16
  },
  {
    id: 'yearsEmployed',
    type: 'text',
    label: 'Years with Current Employer',
    placeholder: 'Enter years employed',
    required: true,
    order: 17
  },

  // Co-Applicant Information
  {
    id: 'coApplicantName',
    type: 'text',
    label: 'Co-Applicant Name (if applicable)',
    placeholder: 'Enter co-applicant name',
    required: false,
    order: 18
  },
  {
    id: 'coApplicantAddress',
    type: 'text',
    label: 'Co-Applicant Address',
    placeholder: 'Enter co-applicant address',
    required: false,
    order: 19
  },
  {
    id: 'coApplicantPhone',
    type: 'phone',
    label: 'Co-Applicant Phone',
    placeholder: 'Enter co-applicant phone',
    required: false,
    order: 20
  },
  {
    id: 'coApplicantSSN',
    type: 'text',
    label: 'Co-Applicant SSN',
    placeholder: 'XXX-XX-XXXX',
    required: false,
    order: 21
  },
  {
    id: 'coApplicantDOB',
    type: 'date',
    label: 'Co-Applicant Date of Birth',
    placeholder: 'Select date of birth',
    required: false,
    order: 22
  },

  // Project Information
  {
    id: 'propertyAddress',
    type: 'text',
    label: 'Property/Project Address',
    placeholder: 'Enter property address',
    required: true,
    order: 23
  },
  {
    id: 'projectDescription',
    type: 'textarea',
    label: 'Project Description',
    placeholder: 'Describe the roofing project in detail',
    required: true,
    order: 24
  },
  {
    id: 'contractorName',
    type: 'text',
    label: 'Contractor Name',
    placeholder: 'Florida First Roofing LLC',
    required: true,
    order: 25
  },
  {
    id: 'contractorLicense',
    type: 'text',
    label: 'Contractor License',
    placeholder: 'CCC1336561',
    required: true,
    order: 26
  },

  // Financial Terms (with 12% interest and 60 payments as standard)
  {
    id: 'totalContractAmount',
    type: 'currency',
    label: 'Total Contract Amount',
    placeholder: 'Enter total contract amount',
    required: true,
    order: 27
  },
  {
    id: 'downPayment',
    type: 'currency',
    label: 'Down Payment',
    placeholder: 'Enter down payment amount',
    required: false,
    order: 28
  },
  {
    id: 'amountFinanced',
    type: 'currency',
    label: 'Amount Financed',
    placeholder: 'Calculated automatically',
    required: true,
    order: 29
  },
  {
    id: 'interestRate',
    type: 'number',
    label: 'Interest Rate (%)',
    placeholder: '12.00',
    required: true,
    validation: { min: 0, max: 30 },
    order: 30
  },
  {
    id: 'numberOfPayments',
    type: 'number',
    label: 'Number of Payments',
    placeholder: '60',
    required: true,
    validation: { min: 1, max: 360 },
    order: 31
  },
  {
    id: 'monthlyPaymentAmount',
    type: 'currency',
    label: 'Monthly Payment Amount',
    placeholder: 'Calculated automatically',
    required: true,
    order: 32
  },
  {
    id: 'totalPayments',
    type: 'currency',
    label: 'Total of Payments',
    placeholder: 'Calculated automatically',
    required: true,
    order: 33
  },
  {
    id: 'totalInterest',
    type: 'currency',
    label: 'Total Interest',
    placeholder: 'Calculated automatically',
    required: true,
    order: 34
  },
  {
    id: 'apr',
    type: 'number',
    label: 'APR (%)',
    placeholder: 'Calculated automatically',
    required: true,
    order: 35
  },
  {
    id: 'firstPaymentDate',
    type: 'date',
    label: 'First Payment Date',
    placeholder: 'Select first payment date',
    required: true,
    order: 36
  },

  // Additional Terms
  {
    id: 'latePaymentFee',
    type: 'currency',
    label: 'Late Payment Fee',
    placeholder: '$25.00',
    required: false,
    order: 37
  },
  {
    id: 'prepaymentPenalty',
    type: 'checkbox',
    label: 'Prepayment Penalty Applies',
    placeholder: 'Check if prepayment penalty applies',
    required: false,
    order: 38
  },
  {
    id: 'defaultInterestRate',
    type: 'number',
    label: 'Default Interest Rate (%)',
    placeholder: '18.00',
    required: false,
    order: 39
  },

  // Insurance and Warranties
  {
    id: 'requiresInsurance',
    type: 'checkbox',
    label: 'Insurance Required',
    placeholder: 'Check if insurance is required',
    required: false,
    order: 40
  },
  {
    id: 'warrantyPeriod',
    type: 'select',
    label: 'Warranty Period',
    placeholder: 'Select warranty period',
    required: false,
    options: ['1 Year', '2 Years', '5 Years', '10 Years', '15 Years', '20 Years', '25 Years'],
    order: 41
  }
];

const FinanceContractModal: React.FC<FinanceContractModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  customerData,
  projectData
}) => {
  const handleSubmit = (data: Record<string, any>) => {
    // Calculate financial values automatically
    const totalContract = parseFloat(data.totalContractAmount?.replace(/[^\d.-]/g, '')) || 0;
    const downPayment = parseFloat(data.downPayment?.replace(/[^\d.-]/g, '')) || 0;
    const amountFinanced = totalContract - downPayment;

    // Standard terms: 12% interest, 60 payments
    const interestRate = parseFloat(data.interestRate) || 12.0;
    const numberOfPayments = parseInt(data.numberOfPayments) || 60;

    // Calculate monthly payment using standard loan formula
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = amountFinanced * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayments = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayments - amountFinanced;
    const apr = interestRate; // Simplified APR calculation

    // Auto-generate contract number if not provided
    const contractNumber = data.contractNumber || `FFR-FIN-${Date.now().toString().slice(-6)}`;

    const contractData: FinanceContractData = {
      // Contract Details
      contractNumber,
      contractDate: data.contractDate || new Date().toISOString().split('T')[0],

      // Customer Information
      customerName: data.customerName || customerData?.firstName + ' ' + customerData?.lastName || '',
      customerAddress: data.customerAddress || customerData?.address || '',
      customerCity: data.customerCity || customerData?.city || '',
      customerState: data.customerState || customerData?.state || 'FL',
      customerZip: data.customerZip || customerData?.zipCode || '',
      customerPhone: data.customerPhone || customerData?.phone || '',
      customerEmail: data.customerEmail || customerData?.email || '',
      socialSecurityNumber: data.socialSecurityNumber || '',
      dateOfBirth: data.dateOfBirth || '',
      driversLicense: data.driversLicense || '',

      // Co-Applicant Information
      coApplicantName: data.coApplicantName || '',
      coApplicantAddress: data.coApplicantAddress || '',
      coApplicantPhone: data.coApplicantPhone || '',
      coApplicantSSN: data.coApplicantSSN || '',
      coApplicantDOB: data.coApplicantDOB || '',

      // Employment Information
      employerName: data.employerName || '',
      employerAddress: data.employerAddress || '',
      employerPhone: data.employerPhone || '',
      jobTitle: data.jobTitle || '',
      monthlyIncome: data.monthlyIncome || '',
      yearsEmployed: data.yearsEmployed || '',

      // Property/Project Information
      propertyAddress: data.propertyAddress || projectData?.address || '',
      projectDescription: data.projectDescription || projectData?.description || '',
      contractorName: data.contractorName || 'Florida First Roofing LLC',
      contractorLicense: data.contractorLicense || 'CCC1336561',

      // Financial Terms (calculated values)
      totalContractAmount: totalContract.toFixed(2),
      downPayment: downPayment.toFixed(2),
      amountFinanced: amountFinanced.toFixed(2),
      interestRate: interestRate.toFixed(2),
      numberOfPayments: numberOfPayments.toString(),
      monthlyPaymentAmount: monthlyPayment.toFixed(2),
      totalPayments: totalPayments.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      apr: apr.toFixed(2),
      firstPaymentDate: data.firstPaymentDate || '',

      // Additional Terms
      latePaymentFee: data.latePaymentFee || '25.00',
      prepaymentPenalty: !!data.prepaymentPenalty,
      defaultInterestRate: data.defaultInterestRate || '18.00',

      // Insurance and Warranties
      requiresInsurance: !!data.requiresInsurance,
      warrantyPeriod: data.warrantyPeriod || '10 Years',

      // Signatures and Dates (to be filled when contract is signed)
      customerSignatureDate: '',
      coApplicantSignatureDate: '',
      contractorSignatureDate: '',

      // Include any additional custom fields
      ...Object.keys(data)
        .filter(key => !defaultFinanceContractFields.some(field => field.id === key))
        .reduce((acc, key) => ({ ...acc, [key]: data[key] }), {})
    };

    onSave(contractData);
  };

  // Pre-populate with customer and project data
  const initialFormData = {
    // Set defaults
    contractDate: new Date().toISOString().split('T')[0],
    interestRate: '12.00',
    numberOfPayments: '60',
    contractorName: 'Florida First Roofing LLC',
    contractorLicense: 'CCC1336561',
    customerState: 'FL',
    latePaymentFee: '25.00',
    defaultInterestRate: '18.00',
    warrantyPeriod: '10 Years',

    // Customer data if available
    ...(customerData && {
      customerName: `${customerData.firstName || ''} ${customerData.lastName || ''}`.trim(),
      customerAddress: customerData.address || '',
      customerCity: customerData.city || '',
      customerState: customerData.state || 'FL',
      customerZip: customerData.zipCode || '',
      customerPhone: customerData.phone || '',
      customerEmail: customerData.email || '',
    }),

    // Project data if available
    ...(projectData && {
      propertyAddress: projectData.address || '',
      projectDescription: projectData.description || '',
      totalContractAmount: projectData.budget || '',
    }),

    // Initial data overrides
    ...initialData
  };

  return (
    <EditableModal
      isOpen={isOpen}
      onClose={onClose}
      modalId="finance-contract"
      title="Finance Contract"
      size="xl"
      category="financing"
      customFields={defaultFinanceContractFields}
      onSubmit={handleSubmit}
      initialData={initialFormData}
      allowEdit={true}
      showEditButton={true}
    />
  );
};

export default FinanceContractModal;
export type { FinanceContractData };