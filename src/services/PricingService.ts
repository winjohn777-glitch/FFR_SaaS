import pricingConfigData from '../data/pricingConfig.json';

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

class PricingService {
  private static instance: PricingService;
  private config: PricingConfig;

  private constructor() {
    // Load saved configuration or use defaults
    this.config = this.loadConfiguration();
  }

  public static getInstance(): PricingService {
    if (!PricingService.instance) {
      PricingService.instance = new PricingService();
    }
    return PricingService.instance;
  }

  private loadConfiguration(): PricingConfig {
    // TODO: Replace with API call to fetch pricing configuration from database
    // For now, use default configuration from JSON file
    return pricingConfigData;
  }

  public refreshConfiguration(): void {
    this.config = this.loadConfiguration();
  }

  public getServices(): Array<{
    id: string;
    title: string;
    description: string;
    basePrice: number;
    category: string;
  }> {
    return this.config.services;
  }

  public getServiceById(serviceId: string): {
    id: string;
    title: string;
    description: string;
    basePrice: number;
    category: string;
  } | undefined {
    return this.config.services.find(service => service.id === serviceId);
  }

  public getMaterialCostPerSquareFoot(): number {
    return this.config.materials.costPerSquareFoot;
  }

  public getLaborCostPerSquareFoot(): number {
    return this.config.labor.costPerSquareFoot;
  }

  public getPermitCost(): number {
    return this.config.fixedCosts.permits.amount;
  }

  public getDisposalCost(): number {
    return this.config.fixedCosts.disposal.amount;
  }

  public getMaterialTypeMultiplier(materialType: string): number {
    return this.config.materialTypes[materialType]?.multiplier || 1.0;
  }

  public getComplexityMultiplier(complexity: string): number {
    return this.config.complexityMultipliers[complexity]?.multiplier || 1.0;
  }

  public getMaterialTypes(): Record<string, {
    name: string;
    multiplier: number;
    description: string;
  }> {
    return this.config.materialTypes;
  }

  public getComplexityMultipliers(): Record<string, {
    name: string;
    multiplier: number;
    description: string;
  }> {
    return this.config.complexityMultipliers;
  }

  public calculateProjectCost(
    selectedServiceIds: string[],
    customServices: Array<{ price: number }>,
    squareFootage: number,
    materialType: string = 'asphalt_shingles',
    complexity: string = 'standard'
  ): {
    servicesTotal: number;
    materialCost: number;
    laborCost: number;
    permitCost: number;
    disposal: number;
    total: number;
  } {
    // Calculate selected services total
    const selectedServices = this.config.services.filter(s => selectedServiceIds.includes(s.id));
    const servicesTotal = selectedServices.reduce((sum, service) => sum + service.basePrice, 0);

    // Add custom services
    const customTotal = customServices.reduce((sum, service) => sum + (service.price || 0), 0);

    // Calculate per-square-foot costs with multipliers
    const materialMultiplier = this.getMaterialTypeMultiplier(materialType);
    const complexityMultiplier = this.getComplexityMultiplier(complexity);

    const baseMaterialCost = squareFootage * this.config.materials.costPerSquareFoot;
    const baseLaborCost = squareFootage * this.config.labor.costPerSquareFoot;

    const materialCost = baseMaterialCost * materialMultiplier * complexityMultiplier;
    const laborCost = baseLaborCost * complexityMultiplier;

    const permitCost = this.config.fixedCosts.permits.amount;
    const disposal = this.config.fixedCosts.disposal.amount;

    const total = servicesTotal + customTotal + materialCost + laborCost + permitCost + disposal;

    return {
      servicesTotal: servicesTotal + customTotal,
      materialCost: Math.round(materialCost * 100) / 100,
      laborCost: Math.round(laborCost * 100) / 100,
      permitCost,
      disposal,
      total: Math.round(total * 100) / 100
    };
  }

  public updateConfiguration(newConfig: PricingConfig): void {
    this.config = newConfig;
    // TODO: Replace with API call to save pricing configuration to database
    console.log('Pricing configuration updated. Database persistence not yet implemented.');
  }

  public resetToDefaults(): void {
    this.config = pricingConfigData;
    // TODO: Replace with API call to reset pricing configuration in database
    console.log('Pricing configuration reset to defaults. Database persistence not yet implemented.');
  }
}

export default PricingService;