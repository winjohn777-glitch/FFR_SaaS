# Finance Contract Workflow - Standard Operating Procedures (SOPs)

## Overview
This document outlines the standard operating procedures for managing finance contracts in the Florida First Roofing accounting system, from initial customer assessment through contract completion and collection.

## 📋 Table of Contents
1. [Customer Finance Assessment](#customer-finance-assessment)
2. [Finance Contract Creation](#finance-contract-creation)
3. [Contract Approval Process](#contract-approval-process)
4. [Bookkeeping Integration](#bookkeeping-integration)
5. [Payment Processing](#payment-processing)
6. [Collections Management](#collections-management)
7. [Compliance & Documentation](#compliance--documentation)
8. [Quality Control](#quality-control)

---

## 1. Customer Finance Assessment

### 1.1 Initial Customer Consultation
**Responsible**: Sales Team
**System Location**: CRM → Customer Details

**Steps**:
1. During project consultation, assess customer's financing needs
2. Review project scope and total contract amount
3. Determine if customer qualifies for financing (minimum $5,000 project)
4. Explain financing options: 12% interest, 60-month standard terms
5. Document customer interest in financing in CRM notes

**Required Information**:
- Project scope and estimated cost
- Customer financial capacity assessment
- Timeline for project completion

### 1.2 Pre-Qualification Assessment
**Responsible**: Office Manager/Finance Team
**Documentation**: Customer file

**Criteria**:
- ✅ Project value minimum $5,000
- ✅ Customer credit assessment (informal)
- ✅ Property ownership verification
- ✅ Income stability verification
- ✅ No active collections or liens

**Decision Points**:
- **Approve**: Proceed to contract creation
- **Conditional**: Require co-applicant or larger down payment
- **Decline**: Offer cash payment options only

---

## 2. Finance Contract Creation

### 2.1 Contract Initiation
**Responsible**: Office Manager
**System Location**: CRM → Customer Row → Finance Button (💳)

**Steps**:
1. Navigate to CRM page (`/crm`)
2. Locate customer in customer table
3. Click green finance button (💳) in Actions column
4. System auto-populates customer information
5. Complete remaining contract fields

### 2.2 Required Contract Information
**Customer Information** (Auto-populated from CRM):
- Full legal name
- Physical address
- Phone and email
- Social Security Number
- Date of birth
- Driver's license number

**Employment Information** (Staff Input Required):
- Current employer name and address
- Job title and length of employment
- Monthly gross income
- Employer phone number

**Co-Applicant Information** (If Required):
- Complete co-applicant details
- Same information as primary applicant
- Co-applicant employment verification

**Project Details**:
- Property address (may differ from customer address)
- Detailed project description
- Total contract amount
- Down payment amount (if any)

**Financial Terms** (Standard/Configurable):
- Interest Rate: 12.00% (standard)
- Number of Payments: 60 (standard)
- Late Payment Fee: $25.00
- Default Interest Rate: 18.00%
- First payment date (typically 30 days after completion)

### 2.3 Contract Customization
**Field Customization Available**:
- Add custom fields using gear (⚙️) button
- Modify field types, validation rules
- Reorder fields by dragging
- Export/import contract templates

**Standard Modifications**:
- Adjust payment terms for qualified customers
- Modify down payment requirements
- Add specific project details or conditions

---

## 3. Contract Approval Process

### 3.1 Internal Review
**Responsible**: Office Manager/Owner
**Review Checklist**:
- ✅ All required fields completed
- ✅ Financial calculations verified
- ✅ Customer information accuracy confirmed
- ✅ Project details match estimate
- ✅ Contract terms appropriate for customer

### 3.2 Customer Approval
**Process**:
1. Generate PDF contract using system
2. Review terms with customer in person or via video call
3. Explain payment schedule and terms
4. Obtain customer and co-applicant signatures (if applicable)
5. Provide copy to customer

**Required Signatures**:
- Primary customer signature and date
- Co-applicant signature and date (if applicable)
- Contractor signature (Florida First Roofing representative)

---

## 4. Bookkeeping Integration

### 4.1 Automatic Journal Entries
**Triggered Upon Contract Save**:

**Initial Contract Entry**:
```
Dr. Notes Receivable - Finance Contracts (1650)    $[Amount Financed]
Dr. Checking Account - Operating (1010)            $[Down Payment]
    Cr. Roofing Revenue - [Project Type] (40XX)        $[Total Contract]
```

**Payment Schedule Creation**:
- System automatically generates 60-month payment schedule
- Principal and interest calculated per payment
- Payment due dates established monthly

### 4.2 Chart of Accounts Integration
**New Accounts Added**:
- **1650**: Notes Receivable - Finance Contracts
- **1660**: Allowance for Credit Losses - Finance Contracts
- **1670**: Accrued Interest Receivable
- **4110**: Interest Income - Finance Contracts
- **4120**: Late Payment Fees - Finance Contracts
- **4130**: Finance Contract Processing Fees
- **6960**: Credit Loss Expense - Finance Contracts
- **6970**: Finance Contract Administration
- **6980**: Collection Costs - Finance Contracts

### 4.3 Monthly Reconciliation
**Responsible**: Bookkeeper/Accountant
**Frequency**: Monthly

**Process**:
1. Review all finance contract journal entries
2. Reconcile Notes Receivable balance
3. Verify payment schedule accuracy
4. Record any late fees or collection expenses
5. Update allowance for credit losses if needed

---

## 5. Payment Processing

### 5.1 Payment Collection Methods
**Accepted Payment Types**:
- Check (preferred)
- Cash
- Credit/debit card (with processing fee)
- ACH/Bank transfer (future implementation)

### 5.2 Recording Payments
**System Location**: Invoicing → Finance Contracts Tab → Contract → Record Payment

**Steps**:
1. Navigate to finance contracts section
2. Select appropriate contract
3. Click "Record Payment" button
4. Enter payment amount and date
5. Select payment method
6. System automatically creates journal entry

**Automatic Journal Entry for Payment**:
```
Dr. Checking Account - Operating (1010)           $[Payment Amount]
    Cr. Notes Receivable - Finance Contracts (1650)   $[Principal Portion]
    Cr. Interest Income - Finance Contracts (4110)    $[Interest Portion]
```

### 5.3 Payment Schedule Management
**System Features**:
- Automatic payment schedule generation
- Payment status tracking (pending/paid/overdue)
- Aging report generation
- Overdue payment identification

---

## 6. Collections Management

### 6.1 Late Payment Identification
**Automatic System Alerts**:
- Payments 1-15 days past due: Warning status
- Payments 16+ days past due: Overdue status
- Monthly aging report generation

### 6.2 Collections Process
**Timeline and Actions**:

**Days 1-15 Past Due**:
- Friendly reminder call
- Email payment reminder
- No late fee assessed

**Days 16-30 Past Due**:
- Apply $25 late fee (automatic in system)
- Written notice sent
- Follow-up phone call

**Days 31-60 Past Due**:
- Formal demand letter
- Consider payment plan options
- Owner involvement

**Days 61+ Past Due**:
- Legal consultation
- Potential lien filing (if applicable)
- Collection agency referral consideration

### 6.3 Late Fee Processing
**System Process**:
1. Navigate to contract payment schedule
2. Click "Add Late Fee" button
3. System records $25 late fee automatically
4. Journal entry created:
```
Dr. Notes Receivable - Finance Contracts (1650)     $25.00
    Cr. Late Payment Fees - Finance Contracts (4120)    $25.00
```

---

## 7. Compliance & Documentation

### 7.1 Required Documentation
**Contract File Must Contain**:
- Signed finance contract (original)
- Customer identification copies
- Proof of income documentation
- Property ownership verification
- Project completion documentation
- All payment records

### 7.2 Regulatory Compliance
**Florida Requirements**:
- Contractor license disclosure (CCC1336561)
- Truth in Lending Act compliance
- Right of cancellation (if applicable)
- Lien law notifications

### 7.3 Record Retention
**Retention Schedule**:
- Active contracts: Immediate access required
- Paid contracts: 7 years after final payment
- Defaulted contracts: 7 years after resolution
- Legal documents: Permanent retention

---

## 8. Quality Control

### 8.1 Monthly Review Process
**Responsible**: Owner/Office Manager
**Review Items**:
- All new contracts created
- Payment collection effectiveness
- Overdue account status
- System data accuracy
- Customer satisfaction

### 8.2 Performance Metrics
**Key Performance Indicators (KPIs)**:
- Contract approval rate
- Payment collection rate
- Average days to collect
- Customer satisfaction scores
- Default rate percentage

**Target Benchmarks**:
- Payment collection rate: >95%
- Average days past due: <5 days
- Customer satisfaction: >4.5/5
- Default rate: <2%

### 8.3 System Backup and Security
**Data Protection**:
- Daily backup of contract data
- Secure storage of sensitive information
- Access control for finance data
- Regular system updates and maintenance

---

## 🚨 Emergency Procedures

### Customer Disputes
1. Document all customer communications
2. Review contract terms and conditions
3. Involve owner for resolution
4. Document resolution in system
5. Update payment schedule if modified

### System Failures
1. Immediate notification to IT support
2. Use manual backup procedures
3. Document all transactions manually
4. Update system when restored
5. Verify data integrity

### Legal Issues
1. Immediate consultation with business attorney
2. Preserve all documentation
3. Suspend collection activities if advised
4. Document all legal proceedings
5. Update insurance carrier if needed

---

## 📞 Contact Information

**Internal Escalation**:
- Office Manager: [Phone/Email]
- Owner: [Phone/Email]
- Bookkeeper: [Phone/Email]

**External Support**:
- Business Attorney: [Contact Info]
- Insurance Agent: [Contact Info]
- IT Support: [Contact Info]

---

## 📝 Training Requirements

### New Staff Training
**Required Topics**:
- Finance contract creation process
- Customer service for financing inquiries
- Payment processing procedures
- Collections best practices
- System navigation and usage

**Training Duration**: 8 hours initial + 4 hours hands-on practice

### Ongoing Training
**Frequency**: Quarterly
**Topics**:
- System updates and new features
- Regulatory changes
- Customer service improvements
- Collection techniques
- Compliance updates

---

## 📊 Reporting and Analytics

### Daily Reports
- New contracts created
- Payments received
- Overdue accounts

### Weekly Reports
- Payment collection summary
- Aging report
- Contract pipeline status

### Monthly Reports
- Financial performance summary
- Collection effectiveness
- Customer satisfaction metrics
- System usage statistics

---

## 🔄 Process Improvement

### Continuous Improvement
**Review Schedule**: Monthly
**Focus Areas**:
- Process efficiency
- Customer satisfaction
- System enhancements
- Staff feedback implementation

### Documentation Updates
- Procedures reviewed quarterly
- Updates based on operational changes
- Staff input incorporated
- Version control maintained

---

*This SOP document is maintained by Florida First Roofing LLC and should be reviewed and updated quarterly to ensure accuracy and compliance with current business practices and regulatory requirements.*

**Document Version**: 1.0
**Last Updated**: [Current Date]
**Next Review Due**: [Quarterly Review Date]