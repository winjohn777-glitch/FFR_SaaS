# Journal Entries API Specification

## Overview
Comprehensive REST API for GAAP-compliant journal entries system with advanced workflow management, automation, and audit trail capabilities.

## Base URL
```
/api/journal-entries
```

## Authentication
All endpoints require valid JWT token with appropriate role permissions.

## Permission Levels
- **USER**: View own entries, create drafts
- **ACCOUNTANT**: Full CRUD, approve entries up to $10,000
- **MANAGER**: Approve entries up to $50,000
- **ADMIN**: All operations, no limits

---

## Core Journal Entry Endpoints

### 1. List Journal Entries
```
GET /api/journal-entries
```

**Query Parameters:**
- `page` (int, default: 1): Page number
- `limit` (int, default: 50): Items per page
- `status` (string): Filter by status (DRAFT, SUBMITTED, APPROVED, POSTED)
- `fiscalPeriodId` (string): Filter by fiscal period
- `dateFrom` (date): Start date filter
- `dateTo` (date): End date filter
- `sourceModule` (string): Filter by source module
- `createdById` (string): Filter by creator
- `search` (string): Search in description/reference

**Response:**
```json
{
  "entries": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "pages": 3
  },
  "summary": {
    "totalAmount": "150000.00",
    "statusCounts": {
      "DRAFT": 10,
      "SUBMITTED": 5,
      "APPROVED": 3,
      "POSTED": 32
    }
  }
}
```

### 2. Get Single Journal Entry
```
GET /api/journal-entries/:id
```

**Response:**
```json
{
  "id": "je_123456",
  "entryNumber": "JE000123",
  "entryDate": "2024-12-02",
  "description": "Roof installation materials purchase",
  "status": "APPROVED",
  "totalAmount": "5000.00",
  "fiscalPeriod": {...},
  "lines": [...],
  "auditTrail": [...],
  "attachments": [...]
}
```

### 3. Create Journal Entry
```
POST /api/journal-entries
```

**Request Body:**
```json
{
  "entryDate": "2024-12-02",
  "description": "Monthly utility payment",
  "reference": "INV-2024-001",
  "sourceModule": "MANUAL",
  "lines": [
    {
      "lineNumber": 1,
      "accountId": "acc_utilities",
      "description": "Electric bill - December",
      "debit": "450.00",
      "credit": "0.00",
      "contactId": "vendor_123"
    },
    {
      "lineNumber": 2,
      "accountId": "acc_checking",
      "description": "Payment from checking account",
      "debit": "0.00",
      "credit": "450.00"
    }
  ],
  "attachments": ["file1.pdf", "file2.jpg"]
}
```

### 4. Update Journal Entry (Draft Only)
```
PUT /api/journal-entries/:id
```

### 5. Submit for Approval
```
POST /api/journal-entries/:id/submit
```

**Request Body:**
```json
{
  "notes": "Ready for approval - all documentation attached"
}
```

### 6. Approve Journal Entry
```
POST /api/journal-entries/:id/approve
```

**Request Body:**
```json
{
  "approvalNotes": "Approved - documentation verified"
}
```

### 7. Reject Journal Entry
```
POST /api/journal-entries/:id/reject
```

**Request Body:**
```json
{
  "rejectionReason": "Missing supporting documentation",
  "requiredActions": ["Attach invoice", "Verify vendor"]
}
```

### 8. Post to Ledger
```
POST /api/journal-entries/:id/post
```

### 9. Reverse Entry
```
POST /api/journal-entries/:id/reverse
```

**Request Body:**
```json
{
  "reversalDate": "2024-12-03",
  "reversalReason": "Correction required - wrong account used",
  "createCorrection": true,
  "correctionData": {...}
}
```

---

## Quick Entry Templates

### 1. List Templates
```
GET /api/journal-entries/templates
```

**Response:**
```json
{
  "templates": [
    {
      "id": "tpl_roof_install",
      "name": "Roof Installation Revenue",
      "category": "Sales",
      "description": "Standard entry for completed roof installation",
      "isQuickEntry": true,
      "usageCount": 45
    }
  ]
}
```

### 2. Create from Template
```
POST /api/journal-entries/from-template
```

**Request Body:**
```json
{
  "templateId": "tpl_roof_install",
  "entryDate": "2024-12-02",
  "variables": {
    "customerName": "John Smith",
    "projectAmount": "15000.00",
    "taxAmount": "1200.00",
    "reference": "INV-2024-123"
  }
}
```

### 3. Roofing Business Quick Entries
```
POST /api/journal-entries/quick-entry
```

**Supported Templates:**
- `material_purchase`: Material/inventory purchases
- `subcontractor_payment`: Payments to subcontractors
- `equipment_rental`: Equipment rental expenses
- `customer_payment`: Customer payment received
- `insurance_claim`: Insurance claim processing
- `warranty_expense`: Warranty work expenses
- `fuel_expense`: Vehicle fuel purchases
- `equipment_maintenance`: Equipment maintenance costs

---

## Fiscal Period Management

### 1. Get Current Fiscal Period
```
GET /api/fiscal-periods/current
```

### 2. List Fiscal Periods
```
GET /api/fiscal-periods
```

### 3. Close Fiscal Period
```
POST /api/fiscal-periods/:id/close
```

---

## Validation and Business Rules

### Double-Entry Validation
```
POST /api/journal-entries/validate
```

**Request Body:** Same as create entry
**Response:**
```json
{
  "isValid": true,
  "warnings": [],
  "errors": [],
  "totalDebits": "5000.00",
  "totalCredits": "5000.00",
  "imbalance": "0.00"
}
```

### Account Balance Check
```
GET /api/accounts/:id/balance-check
```

**Query Parameters:**
- `amount`: Proposed transaction amount
- `type`: Transaction type (debit/credit)

---

## Reporting Endpoints

### 1. Journal Entry Report
```
GET /api/reports/journal-entries
```

**Query Parameters:**
- `dateFrom`, `dateTo`: Date range
- `accounts[]`: Array of account IDs
- `format`: pdf, excel, csv

### 2. General Ledger
```
GET /api/reports/general-ledger
```

### 3. Trial Balance
```
GET /api/reports/trial-balance
```

---

## Audit and Compliance

### 1. Audit Trail
```
GET /api/journal-entries/:id/audit-trail
```

### 2. Compliance Check
```
GET /api/journal-entries/:id/compliance-check
```

**Response:**
```json
{
  "isCompliant": true,
  "checks": {
    "doubleEntryBalance": "PASS",
    "fiscalPeriodOpen": "PASS",
    "approvalRequired": "PASS",
    "supportingDocuments": "PASS"
  },
  "warnings": [],
  "recommendations": []
}
```

---

## Mobile API Endpoints

### 1. Mobile Quick Entry
```
POST /api/mobile/journal-entries/quick
```

**Request Body:**
```json
{
  "type": "expense",
  "amount": "125.50",
  "description": "Fuel for truck #3",
  "photo": "base64_image_data",
  "location": {
    "lat": 25.7617,
    "lng": -80.1918
  }
}
```

### 2. OCR Receipt Processing
```
POST /api/mobile/receipts/process
```

**Request Body:**
```json
{
  "image": "base64_image_data",
  "entryType": "expense"
}
```

**Response:**
```json
{
  "extractedData": {
    "vendor": "Home Depot",
    "amount": "234.56",
    "date": "2024-12-02",
    "items": [...]
  },
  "suggestedAccounts": [...],
  "confidence": 0.95
}
```

---

## Webhooks and Integrations

### 1. Bank Transaction Import
```
POST /api/integrations/bank/transactions
```

### 2. QuickBooks Export
```
POST /api/integrations/quickbooks/export
```

**Request Body:**
```json
{
  "entryIds": ["je_123", "je_124"],
  "exportFormat": "IIF"
}
```

---

## Error Handling

All endpoints return standardized error responses:

```json
{
  "error": true,
  "code": "VALIDATION_ERROR",
  "message": "Journal entry validation failed",
  "details": {
    "field": "lines",
    "issue": "Debits and credits must balance",
    "totalDebits": "1000.00",
    "totalCredits": "999.99"
  },
  "timestamp": "2024-12-02T10:30:00Z"
}
```

**Error Codes:**
- `VALIDATION_ERROR`: Input validation failed
- `PERMISSION_DENIED`: Insufficient permissions
- `PERIOD_CLOSED`: Fiscal period is closed
- `ALREADY_POSTED`: Entry already posted to ledger
- `BALANCE_ERROR`: Debits/credits don't balance
- `ACCOUNT_INACTIVE`: Referenced account is inactive

---

## Rate Limiting

- Standard users: 100 requests/minute
- API keys: 1000 requests/minute
- Bulk operations: 10 requests/minute

---

## Security Considerations

1. **Field-level encryption** for sensitive data
2. **Digital signatures** for posted entries
3. **IP whitelisting** for sensitive operations
4. **Session timeout** for inactive users
5. **Multi-factor authentication** for approvals