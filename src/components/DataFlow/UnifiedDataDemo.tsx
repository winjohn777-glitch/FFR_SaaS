/**
 * Unified Data Flow Demonstration Component
 * Shows how single data entry populates across all modules
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  UserPlus,
  Building,
  Clipboard,
  FileText,
  Users,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  Clock,
  Zap
} from 'lucide-react';
import { useDataFlowOrchestrator } from '../../hooks/useDataFlow';
import { useCustomers, useEmployees, useProjects } from '../../stores/centralStore';
import { useEventHistory } from '../../events/eventBus';

const DemoContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin: ${({ theme }) => theme.spacing.lg} 0;
`;

const DemoHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const DemoTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const DemoSubtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 600px;
  margin: 0 auto;
`;

const FlowSteps = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StepCard = styled(motion.div)<{ isActive: boolean; isCompleted: boolean }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme, isActive, isCompleted }) =>
    isCompleted ? theme.colors.secondary : isActive ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const StepIcon = styled.div<{ isCompleted: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme, isCompleted }) =>
    isCompleted ? theme.colors.secondary : theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StepTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StepDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`;

const StepStatus = styled.div<{ isCompleted: boolean; isActive: boolean }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  color: ${({ theme, isCompleted, isActive }) =>
    isCompleted ? theme.colors.secondary :
    isActive ? theme.colors.primary :
    theme.colors.text.light};
`;

const DemoForm = styled.form`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.875rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.875rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SubmitButton = styled.button<{ isLoading: boolean }>`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: ${({ isLoading }) => isLoading ? 'not-allowed' : 'pointer'};
  opacity: ${({ isLoading }) => isLoading ? 0.7 : 1};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }
`;

const ResultsSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const ResultCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ResultTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ResultContent = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`;

const EventHistory = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  max-height: 300px;
  overflow-y: auto;
`;

const EventItem = styled.div`
  padding: ${({ theme }) => theme.spacing.xs} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};

  &:last-child {
    border-bottom: none;
  }
`;

const UnifiedDataDemo: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: 'FL',
    zipCode: '',
    county: '',
    propertyType: 'Single Family',
    roofType: 'Shingle',
    source: 'Website',
    projectName: '',
    projectType: 'Re-roof',
    estimatedValue: '',
    squareFootage: '',
    priority: 'Medium' as const
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const { processLeadToProject } = useDataFlowOrchestrator();
  const customers = useCustomers();
  const employees = useEmployees();
  const projects = useProjects();
  const eventHistory = useEventHistory();

  const steps = [
    {
      icon: UserPlus,
      title: 'Lead Capture',
      description: 'Customer information is captured once from the website form or sales interaction.'
    },
    {
      icon: Building,
      title: 'Customer Creation',
      description: 'Lead data automatically creates customer record with accounting integration.'
    },
    {
      icon: Clipboard,
      title: 'Project Generation',
      description: 'Project is created with job costing, material allocation, and permit applications.'
    },
    {
      icon: FileText,
      title: 'Document Creation',
      description: 'Contracts, invoices, and permits are auto-generated and linked to all modules.'
    },
    {
      icon: Users,
      title: 'Team Assignment',
      description: 'Available employees are assigned based on skills and project requirements.'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setCurrentStep(0);
    setCompletedSteps([]);

    try {
      // Simulate step progression
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCompletedSteps(prev => [...prev, i]);
      }

      // Process the actual data flow
      await processLeadToProject({
        ...formData,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          county: formData.county
        },
        projectDetails: {
          name: formData.projectName,
          type: formData.projectType,
          description: `${formData.projectType} project for ${formData.propertyType} property`,
          estimatedValue: parseInt(formData.estimatedValue) || 0,
          squareFootage: parseInt(formData.squareFootage) || 0,
          roofingMaterial: formData.roofType,
          estimatedStartDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedCompletionDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
          priority: formData.priority
        }
      });

      setCurrentStep(steps.length);
    } catch (error) {
      console.error('Error processing lead to project:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const latestCustomer = customers[customers.length - 1];
  const latestProject = projects[projects.length - 1];
  const recentEvents = eventHistory.slice(-10);

  return (
    <DemoContainer>
      <DemoHeader>
        <DemoTitle>
          <Zap style={{ display: 'inline', marginRight: '8px' }} />
          Unified Data Flow Demonstration
        </DemoTitle>
        <DemoSubtitle>
          See how entering data once automatically populates across all modules -
          from lead capture to project creation, employee assignment, and document generation.
        </DemoSubtitle>
      </DemoHeader>

      <FlowSteps>
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          const isActive = currentStep === index && isProcessing;
          const isCompleted = completedSteps.includes(index);

          return (
            <StepCard
              key={index}
              isActive={isActive}
              isCompleted={isCompleted}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StepStatus isCompleted={isCompleted} isActive={isActive}>
                {isCompleted ? <CheckCircle size={20} /> :
                 isActive ? <Clock size={20} /> :
                 <AlertCircle size={20} />}
              </StepStatus>
              <StepIcon isCompleted={isCompleted}>
                <IconComponent size={24} />
              </StepIcon>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </StepCard>
          );
        })}
      </FlowSteps>

      <DemoForm onSubmit={handleSubmit}>
        <FormRow>
          <FormGroup>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="John"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Smith"
              required
            />
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john.smith@email.com"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(321) 555-0123"
              required
            />
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              placeholder="123 Main St"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Orlando"
              required
            />
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              placeholder="32801"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="county">County</Label>
            <Input
              id="county"
              name="county"
              value={formData.county}
              onChange={handleInputChange}
              placeholder="Orange"
              required
            />
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <Label htmlFor="propertyType">Property Type</Label>
            <Select
              id="propertyType"
              name="propertyType"
              value={formData.propertyType}
              onChange={handleInputChange}
            >
              <option value="Single Family">Single Family</option>
              <option value="Multi Family">Multi Family</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Condo">Condo</option>
              <option value="Commercial Building">Commercial Building</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="roofType">Roof Type</Label>
            <Select
              id="roofType"
              name="roofType"
              value={formData.roofType}
              onChange={handleInputChange}
            >
              <option value="Shingle">Shingle</option>
              <option value="Metal">Metal</option>
              <option value="TPO">TPO</option>
              <option value="Tile">Tile</option>
              <option value="Modified Bitumen">Modified Bitumen</option>
            </Select>
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              placeholder="Roof Replacement Project"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="projectType">Project Type</Label>
            <Select
              id="projectType"
              name="projectType"
              value={formData.projectType}
              onChange={handleInputChange}
            >
              <option value="New Installation">New Installation</option>
              <option value="Re-roof">Re-roof</option>
              <option value="Repair">Repair</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Emergency">Emergency</option>
              <option value="Insurance Restoration">Insurance Restoration</option>
            </Select>
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <Label htmlFor="estimatedValue">Estimated Value ($)</Label>
            <Input
              id="estimatedValue"
              name="estimatedValue"
              type="number"
              value={formData.estimatedValue}
              onChange={handleInputChange}
              placeholder="15000"
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="squareFootage">Square Footage</Label>
            <Input
              id="squareFootage"
              name="squareFootage"
              type="number"
              value={formData.squareFootage}
              onChange={handleInputChange}
              placeholder="2500"
            />
          </FormGroup>
        </FormRow>

        <SubmitButton type="submit" isLoading={isProcessing} disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Clock size={16} />
              Processing Data Flow...
            </>
          ) : (
            <>
              <ArrowRight size={16} />
              Demonstrate Unified Data Flow
            </>
          )}
        </SubmitButton>
      </DemoForm>

      {(latestCustomer || latestProject || recentEvents.length > 0) && (
        <ResultsSection>
          <h3 style={{ marginBottom: '16px', fontSize: '1.25rem', fontWeight: 600 }}>
            Results: Data Populated Across All Modules
          </h3>

          {latestCustomer && (
            <ResultCard>
              <ResultHeader>
                <UserPlus size={20} style={{ color: '#059669' }} />
                <ResultTitle>Customer Created</ResultTitle>
              </ResultHeader>
              <ResultContent>
                <strong>{latestCustomer.firstName} {latestCustomer.lastName}</strong> has been added to:
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  <li>CRM system with lead source tracking</li>
                  <li>Accounting system with A/R account: {latestCustomer.accountsReceivableId}</li>
                  <li>Communication history tracking</li>
                  <li>Payment terms: {latestCustomer.paymentTerms}</li>
                </ul>
              </ResultContent>
            </ResultCard>
          )}

          {latestProject && (
            <ResultCard>
              <ResultHeader>
                <Clipboard size={20} style={{ color: '#1e40af' }} />
                <ResultTitle>Project Created</ResultTitle>
              </ResultHeader>
              <ResultContent>
                <strong>{latestProject.name}</strong> has been setup with:
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  <li>Job costing account: {latestProject.jobCostingId}</li>
                  <li>Material allocations and inventory tracking</li>
                  <li>Employee assignments and scheduling</li>
                  <li>Permit applications and inspection scheduling</li>
                  <li>Contract and invoice generation</li>
                </ul>
              </ResultContent>
            </ResultCard>
          )}

          {recentEvents.length > 0 && (
            <ResultCard>
              <ResultHeader>
                <FileText size={20} style={{ color: '#dc2626' }} />
                <ResultTitle>Cross-Module Events (Last 10)</ResultTitle>
              </ResultHeader>
              <EventHistory>
                {recentEvents.map((event, index) => (
                  <EventItem key={index}>
                    <strong>{event.event}</strong> - {new Date(event.timestamp).toLocaleTimeString()}
                  </EventItem>
                ))}
              </EventHistory>
            </ResultCard>
          )}
        </ResultsSection>
      )}
    </DemoContainer>
  );
};

export default UnifiedDataDemo;