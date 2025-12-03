import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DollarSign, FileText, Users, Truck, Receipt, Zap, Home, Shield, Car, CreditCard, Building, ArrowRight, Check, AlertTriangle, Info } from 'lucide-react';
import chartOfAccountsData from '../../data/chartOfAccounts.json';

// Transaction template types for roofing business
export interface TransactionTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
  category: 'revenue' | 'expense' | 'asset' | 'liability' | 'equity';
  entries: {
    description: string;
    accountCode: string;
    accountName: string;
    type: 'debit' | 'credit';
    isAmount?: boolean; // Whether this entry gets the main amount
    percentage?: number; // For automatic calculations (e.g., taxes)
    prompt?: string; // Custom prompt for this field
  }[];
  prompts?: {
    amount: string;
    reference?: string;
    description?: string;
    additionalFields?: {
      label: string;
      key: string;
      type: 'text' | 'number' | 'select';
      options?: string[];
      required?: boolean;
    }[];
  };
}

// Pre-built transaction templates for roofing business
const TRANSACTION_TEMPLATES: TransactionTemplate[] = [
  {
    id: 'customer-payment',
    name: 'Customer Payment Received',
    description: 'Record payment received from customer for invoice',
    icon: DollarSign,
    category: 'asset',
    entries: [
      {
        description: 'Cash received from customer',
        accountCode: '1010',
        accountName: 'Checking Account - Operating',
        type: 'debit',
        isAmount: true
      },
      {
        description: 'Reduce customer receivable',
        accountCode: '1100',
        accountName: 'Accounts Receivable',
        type: 'credit',
        isAmount: true
      }
    ],
    prompts: {
      amount: 'Payment amount received',
      reference: 'Check number or payment reference',
      description: 'Customer name or invoice reference'
    }
  },
  {
    id: 'cash-sale',
    name: 'Cash Sale',
    description: 'Record immediate cash payment for completed work',
    icon: Receipt,
    category: 'revenue',
    entries: [
      {
        description: 'Cash received for services',
        accountCode: '1010',
        accountName: 'Checking Account - Operating',
        type: 'debit',
        isAmount: true
      },
      {
        description: 'Revenue from roofing work',
        accountCode: '4010',
        accountName: 'Roofing Revenue - Residential',
        type: 'credit',
        isAmount: true
      }
    ],
    prompts: {
      amount: 'Cash sale amount',
      description: 'Job description or customer name',
      additionalFields: [
        {
          label: 'Revenue Type',
          key: 'revenueType',
          type: 'select',
          options: ['Residential', 'Commercial', 'Repair', 'Emergency'],
          required: true
        }
      ]
    }
  },
  {
    id: 'material-purchase',
    name: 'Material Purchase',
    description: 'Record purchase of roofing materials from supplier',
    icon: Building,
    category: 'expense',
    entries: [
      {
        description: 'Roofing materials purchased',
        accountCode: '1200',
        accountName: 'Job Materials Inventory',
        type: 'debit',
        isAmount: true
      },
      {
        description: 'Amount owed to supplier',
        accountCode: '2100',
        accountName: 'Accounts Payable',
        type: 'credit',
        isAmount: true
      }
    ],
    prompts: {
      amount: 'Invoice amount',
      reference: 'Invoice number',
      description: 'Supplier name and materials description',
      additionalFields: [
        {
          label: 'Material Type',
          key: 'materialType',
          type: 'select',
          options: ['Shingles', 'Underlayment', 'Flashing', 'Fasteners', 'Metal Roofing', 'TPO Membrane', 'Tiles'],
          required: true
        }
      ]
    }
  },
  {
    id: 'fuel-expense',
    name: 'Vehicle Fuel',
    description: 'Record fuel expense for company vehicles',
    icon: Car,
    category: 'expense',
    entries: [
      {
        description: 'Vehicle fuel expense',
        accountCode: '5700',
        accountName: 'Vehicle Fuel',
        type: 'debit',
        isAmount: true
      },
      {
        description: 'Cash paid for fuel',
        accountCode: '1010',
        accountName: 'Checking Account - Operating',
        type: 'credit',
        isAmount: true
      }
    ],
    prompts: {
      amount: 'Fuel cost',
      description: 'Vehicle and date'
    }
  },
  {
    id: 'loan-payment',
    name: 'Equipment Loan Payment',
    description: 'Record monthly equipment loan payment',
    icon: Truck,
    category: 'liability',
    entries: [
      {
        description: 'Interest expense portion',
        accountCode: '7300',
        accountName: 'Interest Expense',
        type: 'debit',
        prompt: 'Interest portion of payment'
      },
      {
        description: 'Principal payment',
        accountCode: '2300',
        accountName: 'Equipment Loans',
        type: 'debit',
        prompt: 'Principal portion of payment'
      },
      {
        description: 'Cash paid to lender',
        accountCode: '1010',
        accountName: 'Checking Account - Operating',
        type: 'credit',
        isAmount: true
      }
    ],
    prompts: {
      amount: 'Total payment amount',
      description: 'Lender and loan reference',
      additionalFields: [
        {
          label: 'Interest Amount',
          key: 'interestAmount',
          type: 'number',
          required: true
        }
      ]
    }
  },
  {
    id: 'utility-bill',
    name: 'Utility Bill Payment',
    description: 'Record payment of utility bills',
    icon: Zap,
    category: 'expense',
    entries: [
      {
        description: 'Utilities expense',
        accountCode: '6400',
        accountName: 'Utilities',
        type: 'debit',
        isAmount: true
      },
      {
        description: 'Cash paid for utilities',
        accountCode: '1010',
        accountName: 'Checking Account - Operating',
        type: 'credit',
        isAmount: true
      }
    ],
    prompts: {
      amount: 'Utility bill amount',
      description: 'Utility company and service period'
    }
  },
  {
    id: 'payroll',
    name: 'Employee Payroll',
    description: 'Record employee payroll expenses',
    icon: Users,
    category: 'expense',
    entries: [
      {
        description: 'Gross wages',
        accountCode: '5100',
        accountName: 'Labor Wages',
        type: 'debit',
        isAmount: true
      },
      {
        description: 'Payroll taxes',
        accountCode: '6100',
        accountName: 'Payroll Taxes',
        type: 'debit',
        percentage: 7.65 // FICA taxes
      },
      {
        description: 'Cash paid to employees (net)',
        accountCode: '1020',
        accountName: 'Checking Account - Payroll',
        type: 'credit',
        prompt: 'Net pay amount'
      },
      {
        description: 'Payroll taxes payable',
        accountCode: '2200',
        accountName: 'Payroll Taxes Payable',
        type: 'credit',
        percentage: 7.65
      }
    ],
    prompts: {
      amount: 'Gross payroll amount',
      description: 'Payroll period',
      additionalFields: [
        {
          label: 'Net Pay Amount',
          key: 'netPayAmount',
          type: 'number',
          required: true
        }
      ]
    }
  },
  {
    id: 'insurance-payment',
    name: 'Insurance Payment',
    description: 'Record insurance premium payment',
    icon: Shield,
    category: 'expense',
    entries: [
      {
        description: 'Insurance expense',
        accountCode: '6300',
        accountName: 'Insurance',
        type: 'debit',
        isAmount: true
      },
      {
        description: 'Cash paid for insurance',
        accountCode: '1010',
        accountName: 'Checking Account - Operating',
        type: 'credit',
        isAmount: true
      }
    ],
    prompts: {
      amount: 'Insurance premium amount',
      description: 'Insurance type and coverage period',
      additionalFields: [
        {
          label: 'Insurance Type',
          key: 'insuranceType',
          type: 'select',
          options: ['General Liability', 'Workers Compensation', 'Vehicle Insurance', 'Professional Liability'],
          required: true
        }
      ]
    }
  }
];

interface TransactionWizardProps {
  onSubmit: (journalEntry: any) => void;
  onCancel: () => void;
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const Step = styled.div<{ isActive: boolean }>`
  opacity: ${({ isActive }) => isActive ? 1 : 0.6};
  pointer-events: ${({ isActive }) => isActive ? 'auto' : 'none'};
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const StepNumber = styled.div`
  width: 24px;
  height: 24px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
`;

const StepTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
`;

const TemplateCard = styled.button<{ isSelected: boolean }>`
  background: ${({ theme, isSelected }) => isSelected ? `${theme.colors.primary}10` : theme.colors.surface};
  border: 2px solid ${({ theme, isSelected }) => isSelected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const TemplateIcon = styled.div<{ isSelected: boolean }>`
  width: 40px;
  height: 40px;
  background: ${({ theme, isSelected }) => isSelected ? theme.colors.primary : `${theme.colors.primary}20`};
  color: ${({ theme, isSelected }) => isSelected ? 'white' : theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
`;

const TemplateName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const TemplateDescription = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.4;
`;

const FormSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;
  margin: 1.5rem 0;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}15;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background: white;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}15;
  }
`;

const PreviewSection = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;
  margin: 1.5rem 0;
`;

const PreviewTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EntryRow = styled.div<{ isBalanced: boolean }>`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
  padding: 0.75rem;
  border: 1px solid ${({ theme, isBalanced }) => isBalanced ? theme.colors.border : '#ef4444'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 0.5rem;
  background: ${({ theme }) => theme.colors.surface};
`;

const AccountInfo = styled.div``;

const AccountName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.875rem;
`;

const AccountCode = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Amount = styled.div<{ type: 'debit' | 'credit' }>`
  text-align: right;
  font-weight: 600;
  color: ${({ theme, type }) => type === 'debit' ? theme.colors.secondary : theme.colors.error};
`;

const BalanceInfo = styled.div<{ isBalanced: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: ${({ theme, isBalanced }) => isBalanced ? `${theme.colors.secondary}10` : `${theme.colors.error}10`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: 1rem;
`;

const BalanceText = styled.div<{ isBalanced: boolean }>`
  font-weight: 600;
  color: ${({ theme, isBalanced }) => isBalanced ? theme.colors.secondary : theme.colors.error};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${({ variant, theme }) =>
    variant === 'primary'
      ? `
        background: ${theme.colors.primary};
        color: white;
        border: none;
        &:hover {
          background: ${theme.colors.primary}dd;
        }
      `
      : `
        background: transparent;
        color: ${theme.colors.text.secondary};
        border: 1px solid ${theme.colors.border};
        &:hover {
          background: ${theme.colors.surface};
        }
      `}
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
`;

export const TransactionWizard: React.FC<TransactionWizardProps> = ({ onSubmit, onCancel }) => {
  const [step, setStep] = useState<'template' | 'details' | 'preview'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<TransactionTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleTemplateSelect = (template: TransactionTemplate) => {
    setSelectedTemplate(template);
    setFormData({});
    setErrors({});
    setStep('details');
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount is required and must be greater than 0';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    selectedTemplate?.prompts?.additionalFields?.forEach(field => {
      if (field.required && !formData[field.key]) {
        newErrors[field.key] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateJournalEntries = () => {
    if (!selectedTemplate) return [];

    const amount = parseFloat(formData.amount);
    const entries = selectedTemplate.entries.map(entry => {
      let entryAmount = 0;

      if (entry.isAmount) {
        entryAmount = amount;
      } else if (entry.percentage) {
        entryAmount = amount * (entry.percentage / 100);
      }

      // For loan payments, calculate principal as total - interest
      if (selectedTemplate.id === 'loan-payment' && entry.accountCode === '2300') {
        entryAmount = amount - (parseFloat(formData.interestAmount) || 0);
      }

      // For payroll, net pay is provided separately
      if (selectedTemplate.id === 'payroll' && entry.accountCode === '1020') {
        entryAmount = parseFloat(formData.netPayAmount) || 0;
      }

      return {
        account: entry.accountCode,
        description: entry.description,
        debit: entry.type === 'debit' ? entryAmount : 0,
        credit: entry.type === 'credit' ? entryAmount : 0
      };
    });

    return entries;
  };

  const entries = generateJournalEntries();
  const totalDebit = entries.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredit = entries.reduce((sum, entry) => sum + entry.credit, 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  const handleSubmit = () => {
    if (!validateForm() || !isBalanced) return;

    const journalEntry = {
      date: new Date().toISOString().split('T')[0],
      description: formData.description,
      reference: formData.reference || '',
      lines: entries
    };

    onSubmit(journalEntry);
  };

  const getAccountInfo = (code: string) => {
    const accounts = chartOfAccountsData.chartOfAccounts;
    for (const categoryCode in accounts) {
      const category = accounts[categoryCode];
      if (category.accounts && category.accounts[code]) {
        return {
          name: category.accounts[code].name,
          code: code
        };
      }
    }
    return { name: 'Unknown Account', code };
  };

  return (
    <Container>
      <Header>
        <Title>Transaction Wizard</Title>
        <Subtitle>Create journal entries easily with pre-built templates</Subtitle>
      </Header>

      {step === 'template' && (
        <Step isActive={true}>
          <StepHeader>
            <StepNumber>1</StepNumber>
            <StepTitle>Select Transaction Type</StepTitle>
          </StepHeader>

          <TemplateGrid>
            {TRANSACTION_TEMPLATES.map(template => {
              const IconComponent = template.icon;
              return (
                <TemplateCard
                  key={template.id}
                  isSelected={false}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <TemplateIcon isSelected={false}>
                    <IconComponent size={20} />
                  </TemplateIcon>
                  <TemplateName>{template.name}</TemplateName>
                  <TemplateDescription>{template.description}</TemplateDescription>
                </TemplateCard>
              );
            })}
          </TemplateGrid>
        </Step>
      )}

      {step === 'details' && selectedTemplate && (
        <Step isActive={true}>
          <StepHeader>
            <StepNumber>2</StepNumber>
            <StepTitle>Enter Transaction Details</StepTitle>
          </StepHeader>

          <FormSection>
            <FormGrid>
              <FormField>
                <Label>Amount *</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder={selectedTemplate.prompts?.amount || 'Amount'}
                  value={formData.amount || ''}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                />
                {errors.amount && <ErrorMessage><AlertTriangle size={16} />{errors.amount}</ErrorMessage>}
              </FormField>

              <FormField>
                <Label>Description *</Label>
                <Input
                  type="text"
                  placeholder={selectedTemplate.prompts?.description || 'Transaction description'}
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
                {errors.description && <ErrorMessage><AlertTriangle size={16} />{errors.description}</ErrorMessage>}
              </FormField>

              {selectedTemplate.prompts?.reference && (
                <FormField>
                  <Label>Reference</Label>
                  <Input
                    type="text"
                    placeholder={selectedTemplate.prompts.reference}
                    value={formData.reference || ''}
                    onChange={(e) => handleInputChange('reference', e.target.value)}
                  />
                </FormField>
              )}

              {selectedTemplate.prompts?.additionalFields?.map(field => (
                <FormField key={field.key}>
                  <Label>{field.label} {field.required && '*'}</Label>
                  {field.type === 'select' ? (
                    <Select
                      value={formData[field.key] || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </Select>
                  ) : (
                    <Input
                      type={field.type}
                      step={field.type === 'number' ? '0.01' : undefined}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                    />
                  )}
                  {errors[field.key] && <ErrorMessage><AlertTriangle size={16} />{errors[field.key]}</ErrorMessage>}
                </FormField>
              ))}
            </FormGrid>

            <Actions>
              <Button variant="secondary" onClick={() => setStep('template')}>
                Back
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (validateForm()) setStep('preview');
                }}
              >
                Preview <ArrowRight size={16} />
              </Button>
            </Actions>
          </FormSection>
        </Step>
      )}

      {step === 'preview' && selectedTemplate && (
        <Step isActive={true}>
          <StepHeader>
            <StepNumber>3</StepNumber>
            <StepTitle>Review & Submit</StepTitle>
          </StepHeader>

          <PreviewSection>
            <PreviewTitle>
              <Info size={16} />
              Journal Entry Preview
            </PreviewTitle>

            {entries.map((entry, index) => {
              const accountInfo = getAccountInfo(entry.account);
              return (
                <EntryRow key={index} isBalanced={isBalanced}>
                  <AccountInfo>
                    <AccountName>{accountInfo.name}</AccountName>
                    <AccountCode>{accountInfo.code}</AccountCode>
                  </AccountInfo>
                  <Amount type="debit">
                    {entry.debit > 0 ? `$${entry.debit.toLocaleString()}` : ''}
                  </Amount>
                  <Amount type="credit">
                    {entry.credit > 0 ? `$${entry.credit.toLocaleString()}` : ''}
                  </Amount>
                </EntryRow>
              );
            })}

            <BalanceInfo isBalanced={isBalanced}>
              <BalanceText isBalanced={isBalanced}>
                {isBalanced ? <Check size={16} /> : <AlertTriangle size={16} />}
                {isBalanced ? 'Entry is balanced' : `Out of balance: $${Math.abs(totalDebit - totalCredit).toFixed(2)}`}
              </BalanceText>
              <div>
                Total: ${Math.max(totalDebit, totalCredit).toLocaleString()}
              </div>
            </BalanceInfo>

            {!isBalanced && (
              <ErrorMessage>
                <AlertTriangle size={16} />
                The entry is not balanced. Please check your amounts and try again.
              </ErrorMessage>
            )}

            <Actions>
              <Button variant="secondary" onClick={() => setStep('details')}>
                Edit Details
              </Button>
              <Button variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!isBalanced}
              >
                Create Entry <Check size={16} />
              </Button>
            </Actions>
          </PreviewSection>
        </Step>
      )}
    </Container>
  );
};

export default TransactionWizard;