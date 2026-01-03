import jsPDF from 'jspdf';
import { FFR_UNIFIED_BRAND } from '../Shared/UnifiedFFRBranding';
import { createContractPDF } from '../../utils/UnifiedPDFGenerator';

interface FinanceContract {
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

  // Co-Applicant Information
  coApplicantName?: string;
  coApplicantAddress?: string;
  coApplicantPhone?: string;
  coApplicantSSN?: string;
  coApplicantDOB?: string;

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

  // Custom fields
  customFields?: Record<string, any>;
}

export const generateFinanceContractPDF = async (contract: FinanceContract) => {
  const pdfGenerator = createContractPDF(contract.customerName);
  const pdf = pdfGenerator.getPDF();
  const { width: pageWidth, height: pageHeight } = pdfGenerator.getPageDimensions();
  const contentArea = pdfGenerator.getContentArea();
  const margin = contentArea.leftMargin;
  let currentY = contentArea.startY;

  // Helper function to add new page if needed
  const checkPageBreak = (spaceNeeded: number) => {
    if (currentY + spaceNeeded > contentArea.endY) {
      pdfGenerator.addPage();
      currentY = contentArea.startY;
    }
  };

  // Add contract details to the document title area
  pdf.setTextColor(30, 58, 138); // FFR blue
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  currentY = pdfGenerator.addSectionHeader('FINANCE CONTRACT AGREEMENT', currentY);

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Contract #: ${contract.contractNumber}`, margin, currentY);
  pdf.text(`Date: ${new Date(contract.contractDate).toLocaleDateString()}`, pageWidth - margin, currentY, { align: 'right' });
  currentY += 15;

  // Reset text color for body
  pdf.setTextColor(0, 0, 0);

  // Section helper
  const addSection = (title: string, content: () => void) => {
    checkPageBreak(20);
    currentY = pdfGenerator.addSectionHeader(title, currentY);

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    content();
    currentY += 5;
  };

  // Customer Information
  addSection('CUSTOMER INFORMATION', () => {
    pdf.text(`Name: ${contract.customerName}`, margin, currentY);
    currentY += 5;
    pdf.text(`Address: ${contract.customerAddress}, ${contract.customerCity}, ${contract.customerState} ${contract.customerZip}`, margin, currentY);
    currentY += 5;
    pdf.text(`Phone: ${contract.customerPhone} | Email: ${contract.customerEmail}`, margin, currentY);
    currentY += 5;
    pdf.text(`SSN: ${contract.socialSecurityNumber} | DOB: ${contract.dateOfBirth}`, margin, currentY);
    currentY += 5;
    pdf.text(`Driver's License: ${contract.driversLicense}`, margin, currentY);
    currentY += 5;
  });

  // Co-Applicant Information (if applicable)
  if (contract.coApplicantName && contract.coApplicantName.trim()) {
    addSection('CO-APPLICANT INFORMATION', () => {
      pdf.text(`Name: ${contract.coApplicantName}`, margin, currentY);
      currentY += 5;
      pdf.text(`Address: ${contract.coApplicantAddress}`, margin, currentY);
      currentY += 5;
      pdf.text(`Phone: ${contract.coApplicantPhone} | SSN: ${contract.coApplicantSSN}`, margin, currentY);
      currentY += 5;
      pdf.text(`Date of Birth: ${contract.coApplicantDOB}`, margin, currentY);
      currentY += 5;
    });
  }

  // Employment Information
  addSection('EMPLOYMENT INFORMATION', () => {
    pdf.text(`Employer: ${contract.employerName}`, margin, currentY);
    currentY += 5;
    pdf.text(`Address: ${contract.employerAddress}`, margin, currentY);
    currentY += 5;
    pdf.text(`Phone: ${contract.employerPhone}`, margin, currentY);
    currentY += 5;
    pdf.text(`Position: ${contract.jobTitle} | Monthly Income: $${parseFloat(contract.monthlyIncome).toLocaleString()}`, margin, currentY);
    currentY += 5;
    pdf.text(`Years Employed: ${contract.yearsEmployed}`, margin, currentY);
    currentY += 5;
  });

  // Project Information
  addSection('PROJECT INFORMATION', () => {
    pdf.text(`Property Address: ${contract.propertyAddress}`, margin, currentY);
    currentY += 5;
    pdf.text(`Contractor: ${contract.contractorName} | License: ${contract.contractorLicense}`, margin, currentY);
    currentY += 7;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Project Description:', margin, currentY);
    currentY += 4;
    pdf.setFont('helvetica', 'normal');

    const descriptionLines = pdf.splitTextToSize(contract.projectDescription, pageWidth - 2 * margin);
    descriptionLines.forEach((line: string) => {
      checkPageBreak(5);
      pdf.text(line, margin, currentY);
      currentY += 4;
    });
  });

  // Financial Terms - Create a table
  checkPageBreak(60);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('FINANCIAL TERMS', margin, currentY);
  currentY += 8;

  // Financial terms table
  const tableData = [
    ['Total Contract Amount:', `$${parseFloat(contract.totalContractAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`],
    ['Down Payment:', `$${parseFloat(contract.downPayment).toLocaleString('en-US', { minimumFractionDigits: 2 })}`],
    ['Amount Financed:', `$${parseFloat(contract.amountFinanced).toLocaleString('en-US', { minimumFractionDigits: 2 })}`],
    ['Interest Rate:', `${contract.interestRate}%`],
    ['Number of Payments:', contract.numberOfPayments],
    ['Monthly Payment Amount:', `$${parseFloat(contract.monthlyPaymentAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`],
    ['Total of Payments:', `$${parseFloat(contract.totalPayments).toLocaleString('en-US', { minimumFractionDigits: 2 })}`],
    ['Total Interest:', `$${parseFloat(contract.totalInterest).toLocaleString('en-US', { minimumFractionDigits: 2 })}`],
    ['APR:', `${contract.apr}%`],
    ['First Payment Date:', new Date(contract.firstPaymentDate).toLocaleDateString()]
  ];

  pdf.setFontSize(10);
  tableData.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(label, margin, currentY);
    pdf.setFont('helvetica', 'normal');
    pdf.text(value, margin + 60, currentY);
    currentY += 5;
  });

  // Additional Terms
  checkPageBreak(30);
  currentY += 5;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ADDITIONAL TERMS', margin, currentY);
  currentY += 8;

  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`• Late Payment Fee: $${parseFloat(contract.latePaymentFee).toFixed(2)}`, margin, currentY);
  currentY += 5;
  pdf.text(`• Prepayment Penalty: ${contract.prepaymentPenalty ? 'Applicable' : 'Not Applicable'}`, margin, currentY);
  currentY += 5;
  pdf.text(`• Default Interest Rate: ${contract.defaultInterestRate}%`, margin, currentY);
  currentY += 5;
  pdf.text(`• Insurance Required: ${contract.requiresInsurance ? 'Yes' : 'No'}`, margin, currentY);
  currentY += 5;
  pdf.text(`• Warranty Period: ${contract.warrantyPeriod}`, margin, currentY);
  currentY += 10;

  // Legal Terms and Conditions
  checkPageBreak(80);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TERMS AND CONDITIONS', margin, currentY);
  currentY += 8;

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');

  const legalTerms = [
    '1. PAYMENT TERMS: Monthly payments are due on the same date each month as specified above. Payments received after the due date will be subject to a late fee.',

    '2. DEFAULT: Customer will be in default if any payment is more than 15 days past due. In case of default, the entire remaining balance becomes immediately due and payable.',

    '3. SECURITY INTEREST: Florida First Roofing LLC retains a security interest in the improvements made to the property until all payments are made in full.',

    '4. INSURANCE: Customer agrees to maintain adequate property insurance covering the improvements made under this contract.',

    '5. WARRANTIES: All work is warranted against defects in materials and workmanship for the period specified above.',

    '6. GOVERNING LAW: This contract is governed by the laws of the State of Florida.',

    '7. DISPUTE RESOLUTION: Any disputes arising under this contract shall be resolved through binding arbitration in accordance with Florida law.',

    '8. ENTIRE AGREEMENT: This contract represents the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements.'
  ];

  legalTerms.forEach(term => {
    const termLines = pdf.splitTextToSize(term, pageWidth - 2 * margin);
    termLines.forEach((line: string) => {
      checkPageBreak(4);
      pdf.text(line, margin, currentY);
      currentY += 3.5;
    });
    currentY += 2;
  });

  // Custom Fields
  if (contract.customFields && Object.keys(contract.customFields).length > 0) {
    checkPageBreak(30);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ADDITIONAL INFORMATION', margin, currentY);
    currentY += 8;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    Object.entries(contract.customFields).forEach(([key, value]) => {
      if (value && value !== '') {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        pdf.text(`${label}: ${value}`, margin, currentY);
        currentY += 5;
      }
    });
  }

  // Signature Section
  checkPageBreak(60);
  currentY += 10;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SIGNATURES', margin, currentY);
  currentY += 15;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');

  // Customer signature
  pdf.line(margin, currentY, margin + 70, currentY);
  pdf.text('Customer Signature', margin, currentY + 5);
  pdf.text('Date: _______________', margin + 75, currentY + 5);
  currentY += 20;

  pdf.text(contract.customerName, margin, currentY);
  pdf.text('Print Name', margin, currentY + 4);
  currentY += 15;

  // Co-Applicant signature if applicable
  if (contract.coApplicantName && contract.coApplicantName.trim()) {
    pdf.line(margin, currentY, margin + 70, currentY);
    pdf.text('Co-Applicant Signature', margin, currentY + 5);
    pdf.text('Date: _______________', margin + 75, currentY + 5);
    currentY += 20;

    pdf.text(contract.coApplicantName, margin, currentY);
    pdf.text('Print Name', margin, currentY + 4);
    currentY += 15;
  }

  // Contractor signature
  pdf.line(margin, currentY, margin + 70, currentY);
  pdf.text('Contractor Signature', margin, currentY + 5);
  pdf.text('Date: _______________', margin + 75, currentY + 5);
  currentY += 20;

  pdf.text(contract.contractorName, margin, currentY);
  pdf.text('Print Name', margin, currentY + 4);

  // Note about electronic signature
  checkPageBreak(15);
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  pdf.text('This contract has been generated electronically and is valid without handwritten signatures when electronically signed.',
           pageWidth / 2, currentY, { align: 'center' });

  return pdfGenerator.finalize();
};

export const downloadFinanceContractPDF = async (contract: FinanceContract) => {
  const pdf = await generateFinanceContractPDF(contract);
  pdf.save(`FFR-Finance-Contract-${contract.contractNumber}.pdf`);
};

export const emailFinanceContractPDF = async (contract: FinanceContract) => {
  const pdf = await generateFinanceContractPDF(contract);
  const pdfBlob = pdf.output('blob');

  // In a real application, integrate with email service
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `FFR-Finance-Contract-${contract.contractNumber}.pdf`;
  link.click();
  URL.revokeObjectURL(url);

  alert(`Finance Contract ${contract.contractNumber} PDF generated. In production, this would be sent via email.`);
};