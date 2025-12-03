# Validation Rules and GAAP Compliance Framework

## Overview
Comprehensive validation and GAAP compliance system for the Florida First Roofing journal entries system, ensuring accuracy, preventing errors, and maintaining audit-quality standards.

## Core GAAP Principles Implementation

### 1. Double-Entry Bookkeeping Validation

```typescript
interface DoubleEntryValidation {
  validateBalance(lines: JournalEntryLine[]): ValidationResult;
  validateMinimumLines(lines: JournalEntryLine[]): ValidationResult;
  validateAmountPrecision(amount: Decimal): ValidationResult;
}

class DoubleEntryValidator implements DoubleEntryValidation {
  validateBalance(lines: JournalEntryLine[]): ValidationResult {
    const totalDebits = lines.reduce((sum, line) => sum + Number(line.debit), 0);
    const totalCredits = lines.reduce((sum, line) => sum + Number(line.credit), 0);
    const difference = Math.abs(totalDebits - totalCredits);

    // Allow for minor rounding differences (< 1 cent)
    const tolerance = 0.005;

    return {
      isValid: difference < tolerance,
      errorCode: difference >= tolerance ? 'BALANCE_ERROR' : null,
      message: difference >= tolerance
        ? `Entry is out of balance by $${difference.toFixed(2)}. Total debits: $${totalDebits.toFixed(2)}, Total credits: $${totalCredits.toFixed(2)}`
        : 'Entry is in balance',
      severity: difference >= tolerance ? 'error' : 'success',
      suggestions: difference >= tolerance ? [
        'Check all amounts for accuracy',
        'Ensure each debit has a corresponding credit',
        'Verify decimal places are correct'
      ] : []
    };
  }

  validateMinimumLines(lines: JournalEntryLine[]): ValidationResult {
    return {
      isValid: lines.length >= 2,
      errorCode: lines.length < 2 ? 'INSUFFICIENT_LINES' : null,
      message: lines.length < 2
        ? 'Journal entries must have at least 2 lines for proper double-entry bookkeeping'
        : 'Sufficient journal lines present',
      severity: lines.length < 2 ? 'error' : 'success'
    };
  }

  validateAmountPrecision(amount: Decimal): ValidationResult {
    const decimalPlaces = amount.toString().split('.')[1]?.length || 0;

    return {
      isValid: decimalPlaces <= 2,
      errorCode: decimalPlaces > 2 ? 'PRECISION_ERROR' : null,
      message: decimalPlaces > 2
        ? 'Amounts cannot have more than 2 decimal places'
        : 'Amount precision is valid',
      severity: decimalPlaces > 2 ? 'error' : 'success'
    };
  }
}
```

### 2. Revenue Recognition Compliance (ASC 606)

```typescript
interface RevenueRecognitionRules {
  validateCompletionCriteria(entry: JournalEntry): ValidationResult;
  validatePerformanceObligation(entry: JournalEntry): ValidationResult;
  validateContractEvidence(entry: JournalEntry): ValidationResult;
}

class RevenueRecognitionValidator implements RevenueRecognitionRules {
  validateCompletionCriteria(entry: JournalEntry): ValidationResult {
    const revenueLines = entry.lines.filter(line =>
      line.account.type === AccountType.REVENUE &&
      Number(line.credit) > 0
    );

    if (revenueLines.length === 0) {
      return { isValid: true, message: 'No revenue recognition validation needed' };
    }

    // For roofing business: Revenue should be recognized when work is substantially complete
    const hasCompletionEvidence = this.checkCompletionEvidence(entry);
    const hasCustomerAcceptance = this.checkCustomerAcceptance(entry);

    return {
      isValid: hasCompletionEvidence && hasCustomerAcceptance,
      errorCode: !hasCompletionEvidence || !hasCustomerAcceptance ? 'REVENUE_RECOGNITION_ERROR' : null,
      message: !hasCompletionEvidence
        ? 'Revenue recognition requires evidence of work completion'
        : !hasCustomerAcceptance
        ? 'Revenue recognition requires customer acceptance'
        : 'Revenue recognition criteria met',
      severity: !hasCompletionEvidence || !hasCustomerAcceptance ? 'warning' : 'success',
      requiredDocuments: [
        'Completion certificate',
        'Customer sign-off',
        'Final inspection report',
        'Photos of completed work'
      ]
    };
  }

  private checkCompletionEvidence(entry: JournalEntry): boolean {
    // Check for attached completion documents
    return entry.attachments?.some(att =>
      att.filename.toLowerCase().includes('completion') ||
      att.filename.toLowerCase().includes('certificate') ||
      att.filename.toLowerCase().includes('inspection')
    ) || false;
  }

  private checkCustomerAcceptance(entry: JournalEntry): boolean {
    // Check for customer acceptance documentation
    return entry.attachments?.some(att =>
      att.filename.toLowerCase().includes('acceptance') ||
      att.filename.toLowerCase().includes('signoff') ||
      att.filename.toLowerCase().includes('approved')
    ) || false;
  }
}
```

### 3. Matching Principle Validation

```typescript
interface MatchingPrincipleRules {
  validateExpenseMatching(entry: JournalEntry): ValidationResult;
  validatePeriodAssignment(entry: JournalEntry): ValidationResult;
  validateAccrualBasis(entry: JournalEntry): ValidationResult;
}

class MatchingPrincipleValidator implements MatchingPrincipleRules {
  validateExpenseMatching(entry: JournalEntry): ValidationResult {
    const expenseLines = entry.lines.filter(line =>
      line.account.type === AccountType.EXPENSE &&
      Number(line.debit) > 0
    );

    if (expenseLines.length === 0) {
      return { isValid: true, message: 'No expense matching validation needed' };
    }

    // Check if expenses are properly matched to revenue period
    const validations = expenseLines.map(line =>
      this.validateExpenseToRevenuePeriod(line, entry)
    );

    const allValid = validations.every(v => v.isValid);

    return {
      isValid: allValid,
      errorCode: !allValid ? 'MATCHING_PRINCIPLE_ERROR' : null,
      message: !allValid
        ? 'Expenses should be matched to the period when related revenue is recognized'
        : 'Expense matching criteria met',
      severity: !allValid ? 'warning' : 'success',
      suggestions: !allValid ? [
        'Consider accruing expenses in the correct period',
        'Use prepaid expense accounts for future period costs',
        'Document the relationship between expenses and revenue'
      ] : []
    };
  }

  private validateExpenseToRevenuePeriod(line: JournalEntryLine, entry: JournalEntry): ValidationResult {
    // Roofing-specific logic: Material costs should match job completion period
    if (line.projectId) {
      const project = this.getProject(line.projectId);
      const entryPeriod = this.getFiscalPeriod(entry.entryDate);
      const projectCompletionPeriod = this.getFiscalPeriod(project.completedDate);

      return {
        isValid: entryPeriod.id === projectCompletionPeriod.id,
        message: entryPeriod.id === projectCompletionPeriod.id
          ? 'Expense properly matched to project completion period'
          : 'Expense period does not match project completion period'
      };
    }

    return { isValid: true, message: 'No project-specific matching required' };
  }
}
```

### 4. Fiscal Period and Cutoff Validation

```typescript
interface FiscalPeriodRules {
  validatePeriodStatus(entry: JournalEntry): ValidationResult;
  validateCutoffDates(entry: JournalEntry): ValidationResult;
  validatePriorPeriodAdjustments(entry: JournalEntry): ValidationResult;
}

class FiscalPeriodValidator implements FiscalPeriodRules {
  validatePeriodStatus(entry: JournalEntry): ValidationResult {
    const fiscalPeriod = this.getFiscalPeriod(entry.entryDate);

    if (!fiscalPeriod) {
      return {
        isValid: false,
        errorCode: 'PERIOD_NOT_FOUND',
        message: 'No fiscal period found for the entry date',
        severity: 'error'
      };
    }

    switch (fiscalPeriod.status) {
      case FiscalPeriodStatus.CLOSED:
        return {
          isValid: false,
          errorCode: 'PERIOD_CLOSED',
          message: `Fiscal period ${fiscalPeriod.name} is closed. Entries cannot be posted.`,
          severity: 'error',
          suggestions: [
            'Use current period entry date',
            'Request period reopening from administrator',
            'Create reversing entry in current period'
          ]
        };

      case FiscalPeriodStatus.LOCKED:
        return {
          isValid: false,
          errorCode: 'PERIOD_LOCKED',
          message: `Fiscal period ${fiscalPeriod.name} is locked for audit. No changes allowed.`,
          severity: 'error'
        };

      case FiscalPeriodStatus.OPEN:
      default:
        return {
          isValid: true,
          message: `Entry can be posted to ${fiscalPeriod.name}`,
          severity: 'success'
        };
    }
  }

  validateCutoffDates(entry: JournalEntry): ValidationResult {
    const entryDate = new Date(entry.entryDate);
    const documentDate = entry.documentDate ? new Date(entry.documentDate) : null;
    const today = new Date();

    // Validate entry is not in the future
    if (entryDate > today) {
      return {
        isValid: false,
        errorCode: 'FUTURE_DATE_ERROR',
        message: 'Entry date cannot be in the future',
        severity: 'error'
      };
    }

    // Validate document date consistency
    if (documentDate && Math.abs(entryDate.getTime() - documentDate.getTime()) > (30 * 24 * 60 * 60 * 1000)) {
      return {
        isValid: false,
        errorCode: 'DATE_VARIANCE_WARNING',
        message: 'Entry date and document date are more than 30 days apart',
        severity: 'warning',
        suggestions: [
          'Verify the correct dates',
          'Consider using document date as entry date',
          'Add explanation in description'
        ]
      };
    }

    return {
      isValid: true,
      message: 'Cutoff dates are appropriate',
      severity: 'success'
    };
  }
}
```

## Industry-Specific Validation Rules

### 1. Roofing Business Validation

```typescript
interface RoofingBusinessRules {
  validateMaterialCosts(entry: JournalEntry): ValidationResult;
  validateLaborCosts(entry: JournalEntry): ValidationResult;
  validateInsuranceCompliance(entry: JournalEntry): ValidationResult;
  validateLicensingCompliance(entry: JournalEntry): ValidationResult;
}

class RoofingBusinessValidator implements RoofingBusinessRules {
  validateMaterialCosts(entry: JournalEntry): ValidationResult {
    const materialLines = entry.lines.filter(line =>
      line.account.category === 'MATERIALS' ||
      line.account.subtype?.includes('MATERIAL')
    );

    if (materialLines.length === 0) {
      return { isValid: true, message: 'No material cost validation needed' };
    }

    const validations = [];

    // Validate material costs have supporting documentation
    for (const line of materialLines) {
      if (Number(line.debit) > 100) { // Over $100 requires receipt
        const hasReceipt = this.hasReceiptAttachment(entry);
        if (!hasReceipt) {
          validations.push({
            isValid: false,
            message: `Material purchase over $100 requires receipt attachment`,
            lineNumber: line.lineNumber
          });
        }
      }

      // Validate material costs are assigned to projects
      if (Number(line.debit) > 50 && !line.projectId) {
        validations.push({
          isValid: false,
          message: `Material costs over $50 should be assigned to a project`,
          lineNumber: line.lineNumber
        });
      }

      // Validate vendor is approved
      if (line.contactId && !this.isApprovedVendor(line.contactId)) {
        validations.push({
          isValid: false,
          message: `Vendor must be in approved vendor list`,
          lineNumber: line.lineNumber
        });
      }
    }

    const hasErrors = validations.some(v => !v.isValid);

    return {
      isValid: !hasErrors,
      errorCode: hasErrors ? 'MATERIAL_VALIDATION_ERROR' : null,
      message: hasErrors
        ? 'Material cost validation failed'
        : 'Material cost validation passed',
      severity: hasErrors ? 'warning' : 'success',
      lineValidations: validations
    };
  }

  validateLaborCosts(entry: JournalEntry): ValidationResult {
    const laborLines = entry.lines.filter(line =>
      line.account.category === 'LABOR' ||
      line.account.subtype?.includes('LABOR')
    );

    if (laborLines.length === 0) {
      return { isValid: true, message: 'No labor cost validation needed' };
    }

    const validations = [];

    for (const line of laborLines) {
      // Validate labor costs have timesheet backup
      if (Number(line.debit) > 200) {
        const hasTimesheet = this.hasTimesheetAttachment(entry);
        if (!hasTimesheet) {
          validations.push({
            isValid: false,
            message: `Labor costs over $200 require timesheet documentation`,
            lineNumber: line.lineNumber
          });
        }
      }

      // Validate worker is properly classified
      if (line.contactId && line.contact?.type === 'EMPLOYEE') {
        const hasPayrollSetup = this.hasPayrollSetup(line.contactId);
        if (!hasPayrollSetup) {
          validations.push({
            isValid: false,
            message: `Employee labor requires proper payroll setup`,
            lineNumber: line.lineNumber
          });
        }
      }

      // Validate prevailing wage compliance (if applicable)
      if (line.projectId && this.isPrevailingWageProject(line.projectId)) {
        const meetsWageRequirement = this.validatePrevailingWage(line);
        if (!meetsWageRequirement) {
          validations.push({
            isValid: false,
            message: `Labor rate must meet prevailing wage requirements`,
            lineNumber: line.lineNumber
          });
        }
      }
    }

    const hasErrors = validations.some(v => !v.isValid);

    return {
      isValid: !hasErrors,
      errorCode: hasErrors ? 'LABOR_VALIDATION_ERROR' : null,
      message: hasErrors
        ? 'Labor cost validation failed'
        : 'Labor cost validation passed',
      severity: hasErrors ? 'warning' : 'success',
      lineValidations: validations
    };
  }

  validateInsuranceCompliance(entry: JournalEntry): ValidationResult {
    // Validate insurance requirements for roofing business
    const projectLines = entry.lines.filter(line => line.projectId);

    if (projectLines.length === 0) {
      return { isValid: true, message: 'No project-related insurance validation needed' };
    }

    const validations = [];

    for (const line of projectLines) {
      const project = this.getProject(line.projectId!);

      // Check liability insurance coverage
      if (Number(line.debit) > 10000) { // High-value projects
        const hasInsurance = this.hasValidInsurance(project.customerId);
        if (!hasInsurance) {
          validations.push({
            isValid: false,
            message: `Projects over $10,000 require current liability insurance`,
            projectId: line.projectId
          });
        }
      }

      // Check workers' compensation
      if (line.account.category === 'LABOR' && Number(line.debit) > 0) {
        const hasWorkersComp = this.hasWorkersCompensation();
        if (!hasWorkersComp) {
          validations.push({
            isValid: false,
            message: `Labor costs require workers' compensation insurance`,
            projectId: line.projectId
          });
        }
      }
    }

    const hasErrors = validations.some(v => !v.isValid);

    return {
      isValid: !hasErrors,
      errorCode: hasErrors ? 'INSURANCE_COMPLIANCE_ERROR' : null,
      message: hasErrors
        ? 'Insurance compliance validation failed'
        : 'Insurance compliance validation passed',
      severity: hasErrors ? 'error' : 'success',
      projectValidations: validations
    };
  }
}
```

### 2. Tax Compliance Validation

```typescript
interface TaxComplianceRules {
  validateSalesTax(entry: JournalEntry): ValidationResult;
  validatePayrollTaxes(entry: JournalEntry): ValidationResult;
  validate1099Reporting(entry: JournalEntry): ValidationResult;
}

class TaxComplianceValidator implements TaxComplianceRules {
  validateSalesTax(entry: JournalEntry): ValidationResult {
    const revenueLines = entry.lines.filter(line =>
      line.account.type === AccountType.REVENUE &&
      Number(line.credit) > 0
    );

    if (revenueLines.length === 0) {
      return { isValid: true, message: 'No sales tax validation needed' };
    }

    const validations = [];

    for (const line of revenueLines) {
      // Check if sales tax should be collected
      if (line.projectId) {
        const project = this.getProject(line.projectId);
        const customer = this.getCustomer(project.customerId);

        if (!customer.taxExempt && this.isTaxableService(line.account)) {
          const expectedTaxAmount = Number(line.credit) * this.getSalesTaxRate();
          const actualTaxAmount = this.findSalesTaxAmount(entry, line);

          if (Math.abs(expectedTaxAmount - actualTaxAmount) > 0.01) {
            validations.push({
              isValid: false,
              message: `Sales tax amount incorrect. Expected: $${expectedTaxAmount.toFixed(2)}, Found: $${actualTaxAmount.toFixed(2)}`,
              lineNumber: line.lineNumber
            });
          }
        }
      }
    }

    const hasErrors = validations.some(v => !v.isValid);

    return {
      isValid: !hasErrors,
      errorCode: hasErrors ? 'SALES_TAX_ERROR' : null,
      message: hasErrors
        ? 'Sales tax validation failed'
        : 'Sales tax validation passed',
      severity: hasErrors ? 'error' : 'success',
      lineValidations: validations
    };
  }

  validate1099Reporting(entry: JournalEntry): ValidationResult {
    const contractorPayments = entry.lines.filter(line =>
      line.contactId &&
      line.contact?.type === 'VENDOR' &&
      Number(line.debit) > 0 &&
      this.isSubcontractor(line.contactId)
    );

    if (contractorPayments.length === 0) {
      return { isValid: true, message: 'No 1099 validation needed' };
    }

    const validations = [];

    for (const line of contractorPayments) {
      const annualTotal = this.getAnnualPaymentTotal(line.contactId!);

      if (annualTotal >= 600) { // 1099 threshold
        const hasValidTaxInfo = this.hasValidTaxInfo(line.contactId!);
        if (!hasValidTaxInfo) {
          validations.push({
            isValid: false,
            message: `Contractor payments over $600/year require W-9 form on file`,
            contactId: line.contactId
          });
        }
      }
    }

    const hasErrors = validations.some(v => !v.isValid);

    return {
      isValid: !hasErrors,
      errorCode: hasErrors ? '1099_COMPLIANCE_ERROR' : null,
      message: hasErrors
        ? '1099 compliance validation failed'
        : '1099 compliance validation passed',
      severity: hasErrors ? 'warning' : 'success',
      contractorValidations: validations
    };
  }
}
```

## Comprehensive Validation Framework

### Validation Engine

```typescript
class JournalEntryValidationEngine {
  private validators: BaseValidator[] = [
    new DoubleEntryValidator(),
    new RevenueRecognitionValidator(),
    new MatchingPrincipleValidator(),
    new FiscalPeriodValidator(),
    new RoofingBusinessValidator(),
    new TaxComplianceValidator(),
    new SecurityValidator(),
    new AuditTrailValidator()
  ];

  async validateEntry(entry: JournalEntry, context: ValidationContext): Promise<ValidationSummary> {
    const results: ValidationResult[] = [];

    // Run all validators
    for (const validator of this.validators) {
      try {
        const result = await validator.validate(entry, context);
        results.push(result);
      } catch (error) {
        results.push({
          isValid: false,
          errorCode: 'VALIDATOR_ERROR',
          message: `Validation error: ${error.message}`,
          severity: 'error',
          validatorName: validator.name
        });
      }
    }

    return this.summarizeResults(results);
  }

  private summarizeResults(results: ValidationResult[]): ValidationSummary {
    const errors = results.filter(r => !r.isValid && r.severity === 'error');
    const warnings = results.filter(r => !r.isValid && r.severity === 'warning');
    const infos = results.filter(r => r.severity === 'info');

    return {
      isValid: errors.length === 0,
      canSubmit: errors.length === 0,
      canPost: errors.length === 0 && warnings.length === 0,
      summary: {
        totalChecks: results.length,
        passed: results.filter(r => r.isValid).length,
        errors: errors.length,
        warnings: warnings.length,
        infos: infos.length
      },
      results,
      errors,
      warnings,
      recommendations: this.generateRecommendations(results)
    };
  }

  private generateRecommendations(results: ValidationResult[]): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Generate recommendations based on validation results
    results.forEach(result => {
      if (result.suggestions) {
        recommendations.push(...result.suggestions.map(suggestion => ({
          type: 'suggestion',
          message: suggestion,
          priority: result.severity === 'error' ? 'high' : 'medium'
        })));
      }
    });

    return recommendations;
  }
}
```

### Real-Time Validation Hooks

```typescript
// React hook for real-time validation
export function useJournalValidation(entry: JournalEntry) {
  const [validationResult, setValidationResult] = useState<ValidationSummary | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const debouncedValidate = useCallback(
    debounce(async (entry: JournalEntry) => {
      setIsValidating(true);
      try {
        const engine = new JournalEntryValidationEngine();
        const result = await engine.validateEntry(entry, {
          userRole: 'USER', // Get from context
          organizationId: 'org_123' // Get from context
        });
        setValidationResult(result);
      } catch (error) {
        console.error('Validation error:', error);
      } finally {
        setIsValidating(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (entry.lines.length > 0) {
      debouncedValidate(entry);
    }
  }, [entry, debouncedValidate]);

  return { validationResult, isValidating };
}
```

This comprehensive validation and compliance framework ensures that all journal entries meet GAAP standards while providing user-friendly guidance to prevent errors and maintain audit-quality documentation.