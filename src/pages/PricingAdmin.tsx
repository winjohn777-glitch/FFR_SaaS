import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Save, RefreshCw, DollarSign, Settings, Plus, Trash2, Edit3 } from 'lucide-react';
import pricingConfigData from '../data/pricingConfig.json';
import { formatCurrency } from '../utils/currencyFormatter';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Section = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const ServiceCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background};
`;

const ServiceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ServiceTitle = styled.h3`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ServiceDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const PriceDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ variant, theme }) => {
    switch (variant) {
      case 'danger':
        return `
          background: ${theme.colors.error};
          color: white;
          &:hover { background: ${theme.colors.error}dd; }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.background};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.border};
          &:hover { background: ${theme.colors.border}; }
        `;
      default:
        return `
          background: ${theme.colors.primary};
          color: white;
          &:hover { background: ${theme.colors.primary}dd; }
        `;
    }
  }}
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const AlertBox = styled.div<{ type: 'success' | 'error' | 'info' }>`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  ${({ type, theme }) => {
    switch (type) {
      case 'success':
        return `
          background: ${theme.colors.secondary}20;
          border: 1px solid ${theme.colors.secondary};
          color: ${theme.colors.secondary};
        `;
      case 'error':
        return `
          background: ${theme.colors.error}20;
          border: 1px solid ${theme.colors.error};
          color: ${theme.colors.error};
        `;
      default:
        return `
          background: ${theme.colors.primary}20;
          border: 1px solid ${theme.colors.primary};
          color: ${theme.colors.primary};
        `;
    }
  }}
`;

interface PricingConfig {
  services: Array<{
    id: string;
    title: string;
    description: string;
    basePrice: number;
    category: string;
  }>;
  materials: {
    costPerSquareFoot: number;
    description: string;
  };
  labor: {
    costPerSquareFoot: number;
    description: string;
  };
  fixedCosts: {
    permits: {
      amount: number;
      description: string;
    };
    disposal: {
      amount: number;
      description: string;
    };
  };
  materialTypes: Record<string, {
    name: string;
    multiplier: number;
    description: string;
  }>;
  complexityMultipliers: Record<string, {
    name: string;
    multiplier: number;
    description: string;
  }>;
}

const PricingAdmin: React.FC = () => {
  const [config, setConfig] = useState<PricingConfig>(pricingConfigData);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [editingService, setEditingService] = useState<string | null>(null);

  const showMessage = (type: 'success' | 'error' | 'info', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const savePricingConfig = async () => {
    setIsLoading(true);
    try {
      // Save to localStorage for persistence
      const updatedConfig = {
        ...config,
        lastUpdated: new Date().toISOString()
      };

      localStorage.setItem('pricingConfig', JSON.stringify(updatedConfig));

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('pricingConfigUpdated', {
        detail: updatedConfig
      }));

      showMessage('success', 'Pricing configuration saved successfully!');
    } catch (error) {
      showMessage('error', 'Failed to save pricing configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = () => {
    setConfig(pricingConfigData);
    localStorage.removeItem('pricingConfig');

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('pricingConfigUpdated', {
      detail: pricingConfigData
    }));

    showMessage('info', 'Pricing configuration reset to defaults.');
  };

  const updateServicePrice = (serviceId: string, newPrice: number) => {
    setConfig(prev => ({
      ...prev,
      services: prev.services.map(service =>
        service.id === serviceId
          ? { ...service, basePrice: newPrice }
          : service
      )
    }));
  };

  const updateMaterialCost = (newCost: number) => {
    setConfig(prev => ({
      ...prev,
      materials: {
        ...prev.materials,
        costPerSquareFoot: newCost
      }
    }));
  };

  const updateLaborCost = (newCost: number) => {
    setConfig(prev => ({
      ...prev,
      labor: {
        ...prev.labor,
        costPerSquareFoot: newCost
      }
    }));
  };

  const updateFixedCost = (type: 'permits' | 'disposal', newAmount: number) => {
    setConfig(prev => ({
      ...prev,
      fixedCosts: {
        ...prev.fixedCosts,
        [type]: {
          ...prev.fixedCosts[type],
          amount: newAmount
        }
      }
    }));
  };

  const updateMaterialMultiplier = (materialType: string, newMultiplier: number) => {
    setConfig(prev => ({
      ...prev,
      materialTypes: {
        ...prev.materialTypes,
        [materialType]: {
          ...prev.materialTypes[materialType],
          multiplier: newMultiplier
        }
      }
    }));
  };

  // Load saved config on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('pricingConfig');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Failed to load saved pricing config:', error);
      }
    }
  }, []);

  return (
    <Container>
      <Header>
        <Title>
          <DollarSign size={32} />
          Pricing Administration
        </Title>
      </Header>

      {message && (
        <AlertBox type={message.type}>
          {message.text}
        </AlertBox>
      )}

      {/* Service Base Prices */}
      <Section>
        <SectionTitle>
          <Settings size={20} />
          Service Base Prices
        </SectionTitle>
        <Grid>
          {config.services.map((service) => (
            <ServiceCard key={service.id}>
              <ServiceHeader>
                <div>
                  <ServiceTitle>{service.title}</ServiceTitle>
                  <ServiceDescription>{service.description}</ServiceDescription>
                </div>
                <PriceDisplay>{formatCurrency(service.basePrice)}</PriceDisplay>
              </ServiceHeader>
              <FormField>
                <Label>Base Price</Label>
                <Input
                  type="number"
                  value={service.basePrice}
                  onChange={(e) => updateServicePrice(service.id, parseFloat(e.target.value) || 0)}
                  step="100"
                  min="0"
                />
              </FormField>
            </ServiceCard>
          ))}
        </Grid>
      </Section>

      {/* Per-Square-Foot Costs */}
      <Section>
        <SectionTitle>
          <Edit3 size={20} />
          Per-Square-Foot Pricing
        </SectionTitle>
        <FormGrid>
          <FormField>
            <Label>Material Cost (per sq ft)</Label>
            <Input
              type="number"
              value={config.materials.costPerSquareFoot}
              onChange={(e) => updateMaterialCost(parseFloat(e.target.value) || 0)}
              step="0.25"
              min="0"
            />
          </FormField>
          <FormField>
            <Label>Labor Cost (per sq ft)</Label>
            <Input
              type="number"
              value={config.labor.costPerSquareFoot}
              onChange={(e) => updateLaborCost(parseFloat(e.target.value) || 0)}
              step="0.25"
              min="0"
            />
          </FormField>
        </FormGrid>
      </Section>

      {/* Fixed Costs */}
      <Section>
        <SectionTitle>
          <DollarSign size={20} />
          Fixed Costs
        </SectionTitle>
        <FormGrid>
          <FormField>
            <Label>Permit Costs</Label>
            <Input
              type="number"
              value={config.fixedCosts.permits.amount}
              onChange={(e) => updateFixedCost('permits', parseFloat(e.target.value) || 0)}
              step="25"
              min="0"
            />
          </FormField>
          <FormField>
            <Label>Disposal Costs</Label>
            <Input
              type="number"
              value={config.fixedCosts.disposal.amount}
              onChange={(e) => updateFixedCost('disposal', parseFloat(e.target.value) || 0)}
              step="25"
              min="0"
            />
          </FormField>
        </FormGrid>
      </Section>

      {/* Material Type Multipliers */}
      <Section>
        <SectionTitle>
          <RefreshCw size={20} />
          Material Type Multipliers
        </SectionTitle>
        <FormGrid>
          {Object.entries(config.materialTypes).map(([key, material]) => (
            <FormField key={key}>
              <Label>{material.name} Multiplier</Label>
              <Input
                type="number"
                value={material.multiplier}
                onChange={(e) => updateMaterialMultiplier(key, parseFloat(e.target.value) || 1)}
                step="0.1"
                min="0.1"
              />
            </FormField>
          ))}
        </FormGrid>
      </Section>

      <ButtonGroup>
        <Button variant="secondary" onClick={resetToDefaults}>
          <RefreshCw size={16} />
          Reset to Defaults
        </Button>
        <Button variant="primary" onClick={savePricingConfig} disabled={isLoading}>
          <Save size={16} />
          {isLoading ? 'Saving...' : 'Save Configuration'}
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default PricingAdmin;