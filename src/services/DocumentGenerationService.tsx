import ModalStructureService from './ModalStructureService';
import { generateInvoicePDF } from '../components/InvoicePDF';
// import { generateFinanceContractPDF } from '../components/PDF/FinanceContractPDF'; // TODO: Enable when PDF generator is fixed

interface DocumentTemplate {
  id: string;
  name: string;
  type: 'invoice' | 'proposal' | 'contract' | 'report' | 'finance-contract';
  modalMappings: string[];
}

interface GenerateDocumentOptions {
  template: DocumentTemplate;
  customerData?: Record<string, any>;
  projectData?: Record<string, any>;
  jobData?: Record<string, any>;
  customData?: Record<string, any>;
  forExternalUse?: boolean; // Whether document is for external use (customers) or internal use
}

class DocumentGenerationService {
  private static instance: DocumentGenerationService;
  private modalService: ModalStructureService;

  private constructor() {
    this.modalService = ModalStructureService.getInstance();
  }

  static getInstance(): DocumentGenerationService {
    if (!DocumentGenerationService.instance) {
      DocumentGenerationService.instance = new DocumentGenerationService();
    }
    return DocumentGenerationService.instance;
  }

  // Helper to determine if document is for external use by default
  private isExternalDocumentType(templateType: string): boolean {
    const externalTypes = ['invoice', 'proposal', 'contract', 'finance-contract'];
    return externalTypes.includes(templateType);
  }

  // Generate document using modal data
  async generateDocument(options: GenerateDocumentOptions): Promise<void> {
    const { template, customerData, projectData, jobData, customData, forExternalUse } = options;

    // Determine if document is for external use
    const isExternal = forExternalUse !== undefined ?
      forExternalUse :
      this.isExternalDocumentType(template.type);

    switch (template.type) {
      case 'invoice':
        await this.generateInvoiceFromModalData({
          customerData,
          projectData,
          jobData,
          customData
        });
        break;
      case 'proposal':
        await this.generateProposal({
          customerData,
          projectData,
          jobData,
          customData
        });
        break;
      case 'contract':
        await this.generateContract({
          customerData,
          projectData,
          jobData,
          customData
        });
        break;
      case 'finance-contract':
        await this.generateFinanceContract({
          customerData,
          projectData,
          jobData,
          customData
        });
        break;
      default:
        console.warn(`Document type ${template.type} not yet implemented`);
    }
  }

  // Generate invoice using customized modal data
  private async generateInvoiceFromModalData(data: {
    customerData?: Record<string, any>;
    projectData?: Record<string, any>;
    jobData?: Record<string, any>;
    customData?: Record<string, any>;
  }): Promise<void> {
    const { customerData = {}, projectData = {}, jobData = {}, customData = {} } = data;

    // Transform modal data using structure service
    const customerTransformed = this.modalService.transformFormDataForDocument(
      'add-customer',
      customerData
    );
    const projectTransformed = this.modalService.transformFormDataForDocument(
      'add-project',
      projectData
    );

    // Get custom fields from all relevant modals
    const customerCustomFields = this.modalService.getCustomDocumentFields('add-customer');
    const projectCustomFields = this.modalService.getCustomDocumentFields('add-project');

    // Combine custom fields with their values
    const allCustomFields: Record<string, any> = {};

    customerCustomFields.forEach(field => {
      const value = customerData[field.id];
      if (value !== undefined && value !== '') {
        allCustomFields[field.label] = value;
      }
    });

    projectCustomFields.forEach(field => {
      const value = projectData[field.id];
      if (value !== undefined && value !== '') {
        allCustomFields[field.label] = value;
      }
    });

    // Add any additional custom data
    Object.assign(allCustomFields, customData);

    // Create invoice object with enhanced structure
    const invoice = {
      id: `INV-${Date.now()}`,
      invoiceNumber: `FFR-${Date.now().toString().slice(-6)}`,
      customerName: customerTransformed.customerName ||
                   `${customerData.firstName || ''} ${customerData.lastName || ''}`.trim() ||
                   'Customer Name',
      customerAddress: customerTransformed.customerAddress || customerData.address || '',
      customerPhone: customerTransformed.customerPhone || customerData.phone || '',
      customerEmail: customerTransformed.customerEmail || customerData.email || '',
      jobName: projectTransformed.jobName || projectData.name || jobData.name || 'Project',
      amount: parseFloat(projectTransformed.amount) ||
              parseFloat(projectData.budget) ||
              parseFloat(jobData.estimatedValue) || 0,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      issueDate: new Date().toISOString(),
      paymentTerms: 'Net 30 days',
      lineItems: [
        {
          description: projectData.description || jobData.description || 'Roofing Services',
          quantity: 1,
          rate: parseFloat(projectData.budget) || parseFloat(jobData.estimatedValue) || 0,
          amount: parseFloat(projectData.budget) || parseFloat(jobData.estimatedValue) || 0
        }
      ],
      notes: projectTransformed.notes || projectData.contractorNotes || '',
      customFields: allCustomFields
    };

    // Generate PDF
    const pdf = await generateInvoicePDF(invoice);
    pdf.save(`FFR-Invoice-${invoice.invoiceNumber}.pdf`);
  }

  // Generate proposal (placeholder for future implementation)
  private async generateProposal(data: {
    customerData?: Record<string, any>;
    projectData?: Record<string, any>;
    jobData?: Record<string, any>;
    customData?: Record<string, any>;
  }): Promise<void> {
    console.log('Proposal generation will be implemented in future versions');
    // TODO: Implement proposal generation similar to invoice
  }

  // Generate contract (placeholder for future implementation)
  private async generateContract(data: {
    customerData?: Record<string, any>;
    projectData?: Record<string, any>;
    jobData?: Record<string, any>;
    customData?: Record<string, any>;
  }): Promise<void> {
    console.log('Contract generation will be implemented in future versions');
    // TODO: Implement contract generation similar to invoice
  }

  // Generate finance contract using customized modal data
  private async generateFinanceContract(data: {
    customerData?: Record<string, any>;
    projectData?: Record<string, any>;
    jobData?: Record<string, any>;
    customData?: Record<string, any>;
  }): Promise<void> {
    const { customerData = {}, projectData = {}, jobData = {}, customData = {} } = data;

    // Transform modal data using structure service
    const customerTransformed = this.modalService.transformFormDataForDocument(
      'add-customer',
      customerData
    );
    const projectTransformed = this.modalService.transformFormDataForDocument(
      'add-project',
      projectData
    );

    // Get custom fields from finance contract modal
    const financeCustomFields = this.modalService.getCustomDocumentFields('finance-contract');
    const allCustomFields: Record<string, any> = {};

    financeCustomFields.forEach(field => {
      const value = customData[field.id];
      if (value !== undefined && value !== '') {
        allCustomFields[field.label] = value;
      }
    });

    // Create finance contract object
    const contract = {
      // Contract Details
      contractNumber: customData.contractNumber || `FFR-FIN-${Date.now().toString().slice(-6)}`,
      contractDate: customData.contractDate || new Date().toISOString().split('T')[0],

      // Customer Information
      customerName: customData.customerName ||
                   customerTransformed.customerName ||
                   `${customerData.firstName || ''} ${customerData.lastName || ''}`.trim() ||
                   'Customer Name',
      customerAddress: customData.customerAddress || customerData.address || '',
      customerCity: customData.customerCity || customerData.city || '',
      customerState: customData.customerState || customerData.state || 'FL',
      customerZip: customData.customerZip || customerData.zipCode || '',
      customerPhone: customData.customerPhone || customerData.phone || '',
      customerEmail: customData.customerEmail || customerData.email || '',
      socialSecurityNumber: customData.socialSecurityNumber || '',
      dateOfBirth: customData.dateOfBirth || '',
      driversLicense: customData.driversLicense || '',

      // Co-Applicant Information
      coApplicantName: customData.coApplicantName || '',
      coApplicantAddress: customData.coApplicantAddress || '',
      coApplicantPhone: customData.coApplicantPhone || '',
      coApplicantSSN: customData.coApplicantSSN || '',
      coApplicantDOB: customData.coApplicantDOB || '',

      // Employment Information
      employerName: customData.employerName || '',
      employerAddress: customData.employerAddress || '',
      employerPhone: customData.employerPhone || '',
      jobTitle: customData.jobTitle || '',
      monthlyIncome: customData.monthlyIncome || '0',
      yearsEmployed: customData.yearsEmployed || '',

      // Property/Project Information
      propertyAddress: customData.propertyAddress || projectData.address || '',
      projectDescription: customData.projectDescription || projectData.description || 'Roofing project',
      contractorName: customData.contractorName || 'Florida First Roofing LLC',
      contractorLicense: customData.contractorLicense || 'CCC1336561',

      // Financial Terms
      totalContractAmount: customData.totalContractAmount || projectData.budget || '0',
      downPayment: customData.downPayment || '0',
      amountFinanced: customData.amountFinanced || '0',
      interestRate: customData.interestRate || '12.00',
      numberOfPayments: customData.numberOfPayments || '60',
      monthlyPaymentAmount: customData.monthlyPaymentAmount || '0',
      totalPayments: customData.totalPayments || '0',
      totalInterest: customData.totalInterest || '0',
      apr: customData.apr || '12.00',
      firstPaymentDate: customData.firstPaymentDate || '',

      // Additional Terms
      latePaymentFee: customData.latePaymentFee || '25.00',
      prepaymentPenalty: !!customData.prepaymentPenalty,
      defaultInterestRate: customData.defaultInterestRate || '18.00',

      // Insurance and Warranties
      requiresInsurance: !!customData.requiresInsurance,
      warrantyPeriod: customData.warrantyPeriod || '10 Years',

      // Custom Fields
      customFields: allCustomFields
    };

    // Generate PDF
    // TODO: Re-enable when generateFinanceContractPDF is fixed
    console.warn('PDF generation is currently disabled');
    alert('Finance contract PDF generation is temporarily unavailable. Please use browser print instead.');
    // const pdf = await generateFinanceContractPDF(contract);
    // pdf.save(`FFR-Finance-Contract-${contract.contractNumber}.pdf`);
  }

  // Get available document templates
  getDocumentTemplates(): DocumentTemplate[] {
    return [
      {
        id: 'standard-invoice',
        name: 'Standard Invoice',
        type: 'invoice',
        modalMappings: ['add-customer', 'add-project', 'add-job']
      },
      {
        id: 'project-proposal',
        name: 'Project Proposal',
        type: 'proposal',
        modalMappings: ['add-customer', 'add-project']
      },
      {
        id: 'service-contract',
        name: 'Service Contract',
        type: 'contract',
        modalMappings: ['add-customer', 'add-project', 'assign-crew']
      },
      {
        id: 'finance-contract',
        name: 'Finance Contract Agreement',
        type: 'finance-contract',
        modalMappings: ['finance-contract', 'add-customer', 'add-project']
      }
    ];
  }

  // Auto-generate documents when modal data changes
  setupAutoGeneration(): void {
    this.modalService.onModalStructureChange((modalId, structure) => {
      console.log(`Modal structure changed for ${modalId}:`, structure.title);
      console.log('Custom fields:', this.modalService.getCustomDocumentFields(modalId));

      // Trigger regeneration of documents that use this modal
      // This could be configured based on user preferences
    });
  }

  // Generate document from existing data
  async generateDocumentFromExistingData(
    templateId: string,
    customerId: string,
    projectId?: string,
    jobId?: string
  ): Promise<void> {
    const template = this.getDocumentTemplates().find(t => t.id === templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    // Load data from localStorage or data context
    const customers = JSON.parse(localStorage.getItem('ffr-customers') || '[]');
    const projects = JSON.parse(localStorage.getItem('ffr-projects') || '[]');
    const jobs = JSON.parse(localStorage.getItem('ffr-jobs') || '[]');

    const customer = customers.find((c: any) => c.id === customerId);
    const project = projectId ? projects.find((p: any) => p.id === projectId) : null;
    const job = jobId ? jobs.find((j: any) => j.id === jobId) : null;

    if (!customer) {
      throw new Error(`Customer ${customerId} not found`);
    }

    await this.generateDocument({
      template,
      customerData: customer,
      projectData: project,
      jobData: job
    });
  }
}

export default DocumentGenerationService;