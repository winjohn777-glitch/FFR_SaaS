import React, { useState } from 'react';
import styled from 'styled-components';
import { X, Calendar, Mail, Phone, MessageSquare, Clock, Target, Settings } from 'lucide-react';

interface AutoFollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerData: {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    lastContact: string;
  };
  onSave: (followUpData: any) => void;
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
  width: 90vw;
  max-width: 800px;
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
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const FollowUpCard = styled.div<{ selected: boolean }>`
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

const FollowUpTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FollowUpDescription = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${({ variant, theme }) => variant === 'primary' ? theme.colors.primary : theme.colors.border};
  background-color: ${({ variant, theme }) => variant === 'primary' ? theme.colors.primary : theme.colors.surface};
  color: ${({ variant, theme }) => variant === 'primary' ? 'white' : theme.colors.text.primary};

  &:hover {
    background-color: ${({ variant, theme }) => variant === 'primary' ? `${theme.colors.primary}dd` : theme.colors.background};
  }
`;

const AutoFollowUpModal: React.FC<AutoFollowUpModalProps> = ({
  isOpen,
  onClose,
  customerData,
  onSave
}) => {
  const [followUpType, setFollowUpType] = useState('');
  const [schedule, setSchedule] = useState({
    startDate: '',
    frequency: 'weekly',
    duration: 'month'
  });
  const [content, setContent] = useState({
    subject: '',
    message: '',
    template: 'standard'
  });

  if (!isOpen) return null;

  const followUpTypes = [
    {
      id: 'post_estimate',
      title: 'Post-Estimate Follow-up',
      description: 'Automated sequence after providing estimate',
      icon: Target
    },
    {
      id: 'dormant_customer',
      title: 'Dormant Customer Re-engagement',
      description: 'Re-activate customers who haven\'t responded',
      icon: Clock
    },
    {
      id: 'maintenance_reminder',
      title: 'Maintenance Reminder',
      description: 'Annual roof inspection and maintenance reminders',
      icon: Calendar
    },
    {
      id: 'seasonal_outreach',
      title: 'Seasonal Outreach',
      description: 'Storm season preparation and winter maintenance',
      icon: MessageSquare
    }
  ];

  const handleSave = () => {
    const followUpData = {
      customerId: customerData.id,
      type: followUpType,
      schedule,
      content,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    onSave(followUpData);
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <img src="/FFR logo 32x32.png" alt="FFR" style={{ height: '20px', marginRight: '8px' }} />
            Automated Follow-up Setup
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Section>
            <SectionTitle>
              <Target size={16} />
              Customer Information
            </SectionTitle>
            <FormGrid>
              <FormField>
                <Label>Customer Name</Label>
                <Input value={customerData.name} disabled />
              </FormField>
              <FormField>
                <Label>Current Status</Label>
                <Input value={customerData.status} disabled />
              </FormField>
              <FormField>
                <Label>Email</Label>
                <Input value={customerData.email} disabled />
              </FormField>
              <FormField>
                <Label>Phone</Label>
                <Input value={customerData.phone} disabled />
              </FormField>
            </FormGrid>
          </Section>

          <Section>
            <SectionTitle>
              <MessageSquare size={16} />
              Follow-up Type
            </SectionTitle>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {followUpTypes.map((type) => (
                <FollowUpCard
                  key={type.id}
                  selected={followUpType === type.id}
                  onClick={() => setFollowUpType(type.id)}
                >
                  <FollowUpTitle>
                    <type.icon size={16} />
                    {type.title}
                  </FollowUpTitle>
                  <FollowUpDescription>{type.description}</FollowUpDescription>
                </FollowUpCard>
              ))}
            </div>
          </Section>

          <Section>
            <SectionTitle>
              <Calendar size={16} />
              Schedule Configuration
            </SectionTitle>
            <FormGrid>
              <FormField>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={schedule.startDate}
                  onChange={(e) => setSchedule({...schedule, startDate: e.target.value})}
                />
              </FormField>
              <FormField>
                <Label>Frequency</Label>
                <Select
                  value={schedule.frequency}
                  onChange={(e) => setSchedule({...schedule, frequency: e.target.value})}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </Select>
              </FormField>
              <FormField>
                <Label>Campaign Duration</Label>
                <Select
                  value={schedule.duration}
                  onChange={(e) => setSchedule({...schedule, duration: e.target.value})}
                >
                  <option value="week">1 Week</option>
                  <option value="month">1 Month</option>
                  <option value="quarter">3 Months</option>
                  <option value="half_year">6 Months</option>
                  <option value="year">1 Year</option>
                  <option value="ongoing">Ongoing</option>
                </Select>
              </FormField>
            </FormGrid>
          </Section>

          <Section>
            <SectionTitle>
              <Mail size={16} />
              Content Configuration
            </SectionTitle>
            <FormGrid>
              <FormField>
                <Label>Email Template</Label>
                <Select
                  value={content.template}
                  onChange={(e) => setContent({...content, template: e.target.value})}
                >
                  <option value="standard">Standard Follow-up</option>
                  <option value="personal">Personal Touch</option>
                  <option value="promotional">Promotional</option>
                  <option value="educational">Educational Content</option>
                  <option value="seasonal">Seasonal Reminder</option>
                </Select>
              </FormField>
              <FormField>
                <Label>Subject Line</Label>
                <Input
                  value={content.subject}
                  onChange={(e) => setContent({...content, subject: e.target.value})}
                  placeholder="Enter email subject..."
                />
              </FormField>
            </FormGrid>
            <FormField>
              <Label>Message Content</Label>
              <TextArea
                value={content.message}
                onChange={(e) => setContent({...content, message: e.target.value})}
                placeholder="Enter your follow-up message content..."
              />
            </FormField>
          </Section>

          <ButtonGroup>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Create Follow-up Campaign
            </Button>
          </ButtonGroup>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AutoFollowUpModal;