import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, DollarSign, Calendar, User, Building2, Target, FileText } from 'lucide-react';

interface Deal {
  id: string;
  customerName: string;
  value: number;
  stage: string;
  probability: number;
  expectedClose: string;
  lastContact: string;
  notes: string;
  assignedTo: string;
}

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deal: Deal) => void;
  deal?: Deal | null;
  mode: 'add' | 'edit';
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: ${({ theme }) => theme.spacing.md};
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg} 0 0;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const FormGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  transition: border-color 0.2s ease;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  transition: border-color 0.2s ease;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  transition: border-color 0.2s ease;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const ProbabilitySlider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.border};
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
`;

const ProbabilityDisplay = styled.div`
  text-align: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${({ variant, theme }) => variant === 'primary' ? theme.colors.primary : theme.colors.border};
  background-color: ${({ variant, theme }) => variant === 'primary' ? theme.colors.primary : theme.colors.surface};
  color: ${({ variant, theme }) => variant === 'primary' ? 'white' : theme.colors.text.primary};
  font-size: 1rem;

  &:hover {
    background-color: ${({ variant, theme }) => variant === 'primary' ? `${theme.colors.primary}dd` : theme.colors.background};
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const DealModal: React.FC<DealModalProps> = ({
  isOpen,
  onClose,
  onSave,
  deal,
  mode
}) => {
  const [formData, setFormData] = useState<Deal>({
    id: '',
    customerName: '',
    value: 0,
    stage: 'lead',
    probability: 50,
    expectedClose: '',
    lastContact: '',
    notes: '',
    assignedTo: ''
  });

  useEffect(() => {
    if (mode === 'edit' && deal) {
      setFormData(deal);
    } else if (mode === 'add') {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        id: '',
        customerName: '',
        value: 0,
        stage: 'lead',
        probability: 50,
        expectedClose: '',
        lastContact: today,
        notes: '',
        assignedTo: 'Mike Rodriguez'
      });
    }
  }, [mode, deal, isOpen]);

  const handleInputChange = (field: keyof Deal, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName.trim() || formData.value <= 0) {
      alert('Please fill in all required fields');
      return;
    }

    const dealToSave = {
      ...formData,
      id: mode === 'add' ? `deal_${Date.now()}` : formData.id
    };

    onSave(dealToSave);
    onClose();
  };

  const stages = [
    { id: 'lead', title: 'Lead' },
    { id: 'qualified', title: 'Qualified' },
    { id: 'proposal', title: 'Proposal Sent' },
    { id: 'negotiation', title: 'Negotiation' },
    { id: 'closed_won', title: 'Closed Won' },
    { id: 'closed_lost', title: 'Closed Lost' }
  ];

  const salesTeam = [
    'Mike Rodriguez',
    'Sarah Chen',
    'Tom Wilson',
    'Jessica Martinez',
    'David Park'
  ];

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <img src="/FFR logo 32x32.png" alt="FFR" style={{ height: '24px', marginRight: '8px' }} />
            {mode === 'add' ? 'Add New Deal' : 'Edit Deal'}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup>
                <Label>
                  <Building2 size={14} />
                  Customer/Project Name *
                </Label>
                <Input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder="e.g., Johnson Family - Complete Re-roof"
                  required
                />
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label>
                    <DollarSign size={14} />
                    Deal Value *
                  </Label>
                  <Input
                    type="number"
                    value={formData.value}
                    onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
                    placeholder="18500"
                    min="0"
                    step="100"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <Target size={14} />
                    Current Stage
                  </Label>
                  <Select
                    value={formData.stage}
                    onChange={(e) => handleInputChange('stage', e.target.value)}
                  >
                    {stages.map(stage => (
                      <option key={stage.id} value={stage.id}>
                        {stage.title}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label>
                  <Target size={14} />
                  Win Probability: {formData.probability}%
                </Label>
                <ProbabilitySlider
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.probability}
                  onChange={(e) => handleInputChange('probability', parseInt(e.target.value))}
                />
                <ProbabilityDisplay>{formData.probability}%</ProbabilityDisplay>
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label>
                    <Calendar size={14} />
                    Expected Close Date
                  </Label>
                  <Input
                    type="date"
                    value={formData.expectedClose}
                    onChange={(e) => handleInputChange('expectedClose', e.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <User size={14} />
                    Assigned To
                  </Label>
                  <Select
                    value={formData.assignedTo}
                    onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                  >
                    {salesTeam.map(person => (
                      <option key={person} value={person}>
                        {person}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label>
                  <Calendar size={14} />
                  Last Contact Date
                </Label>
                <Input
                  type="date"
                  value={formData.lastContact}
                  onChange={(e) => handleInputChange('lastContact', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <FileText size={14} />
                  Notes
                </Label>
                <TextArea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Add any relevant notes about this deal..."
                />
              </FormGroup>
            </FormGrid>

            <ButtonGroup>
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {mode === 'add' ? 'Add Deal' : 'Save Changes'}
              </Button>
            </ButtonGroup>
          </form>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default DealModal;