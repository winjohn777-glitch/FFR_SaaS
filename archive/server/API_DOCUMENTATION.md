# Florida First Roofing - Backend API Documentation

## Overview
This API provides comprehensive integration endpoints for the Florida First Roofing construction accounting system, including CRM integration, SOP workflow automation, team assignment, and notifications.

## Base URL
- Development: `http://localhost:5001`
- Health Check: `GET /api/health`

## Authentication
All endpoints (except health check and auth endpoints) require JWT authentication.

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@floridafirstroofing.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@floridafirstroofing.com",
    "name": "System Administrator",
    "role": "admin",
    "department": "Management"
  }
}
```

### Using Authentication
Include the JWT token in the Authorization header for all protected endpoints:
```http
Authorization: Bearer <your-jwt-token>
```

---

## Integration Endpoints

### 1. Customer Management

#### Create Customer from Lead
```http
POST /api/integration/customers
Authorization: Bearer <token>
Content-Type: application/json

{
  "leadId": "LEAD-123",
  "customerNumber": "CUST-004",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@email.com",
  "phone": "407-555-1234",
  "address": "123 Main St",
  "city": "Orlando",
  "county": "Orange",
  "zipCode": "32801",
  "customerType": "residential",
  "leadSource": "website",
  "totalValue": 15000,
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "customerId": 4,
  "customerNumber": "CUST-004",
  "message": "Customer created successfully"
}
```

#### Create Project from Lead
```http
POST /api/integration/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": 1,
  "leadId": "LEAD-123",
  "name": "Residential Roof Replacement",
  "type": "roof-replacement",
  "status": "estimation",
  "priority": "medium",
  "address": "123 Main St, Orlando, FL",
  "county": "Orange",
  "estimatedValue": 15000,
  "description": "Complete shingle roof replacement"
}
```

### 2. SOP Workflow Automation

#### Trigger SOP Workflow
```http
POST /api/integration/sop/workflows/trigger
Authorization: Bearer <token>
Content-Type: application/json

{
  "sopId": "SOP-4001",
  "leadId": "LEAD-123",
  "urgency": "emergency",
  "serviceType": "roof-repair",
  "metadata": {
    "source": "website",
    "automated": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "workflowId": "WF-1759193146592-3ATD",
  "sopId": "SOP-4001",
  "message": "SOP workflow triggered successfully"
}
```

#### Get Workflow Status
```http
GET /api/integration/sop/workflows/{workflowId}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "workflow": {
    "workflow_id": "WF-1759193146592-3ATD",
    "sop_id": "SOP-4001",
    "status": "active",
    "urgency": "emergency",
    "tasks": [
      {
        "id": 1,
        "title": "Initial Customer Contact",
        "status": "pending",
        "due_date": "2024-09-30T02:45:46.599Z"
      }
    ]
  }
}
```

### 3. Team Assignment

#### Assign Team to Lead
```http
POST /api/integration/team/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "leadId": "LEAD-123",
  "serviceType": "roof-replacement",
  "county": "Orange",
  "urgency": "high",
  "estimatedValue": 15000
}
```

**Response:**
```json
{
  "success": true,
  "assignment": {
    "salesRep": "mike.wilson@floridafirstroofing.com",
    "projectManager": "pm.lead@floridafirstroofing.com",
    "estimator": "estimator@floridafirstroofing.com",
    "rules": [
      "Sales rep assigned by county: Orange",
      "Project manager assigned for high-value project",
      "Estimator assigned for service type: roof-replacement"
    ]
  },
  "message": "Team assigned successfully"
}
```

### 4. Notifications

#### Send Lead Received Notification
```http
POST /api/integration/notifications/lead-received
Authorization: Bearer <token>
Content-Type: application/json

{
  "lead": {
    "firstName": "John",
    "lastName": "Doe",
    "serviceType": "roof-replacement",
    "county": "Orange",
    "description": "Complete roof replacement needed"
  },
  "integration": "website",
  "urgency": "high",
  "timestamp": "2024-09-30T00:45:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "notificationId": "NOTIF-1759193153839-MUPK",
  "message": "Notification sent successfully"
}
```

### 5. Analytics

#### Get Integration Analytics
```http
GET /api/integration/analytics/integration?start=2024-09-01&end=2024-09-30
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "analytics": {
    "leadTrends": [
      {
        "date": "2024-09-29",
        "total_leads": 3,
        "converted_leads": 1,
        "total_estimated_value": 45000,
        "avg_conversion_time_hours": 24.5
      }
    ],
    "sopPerformance": [
      {
        "sop_id": "SOP-4001",
        "triggered_count": 15,
        "avg_completion_time_hours": 2.3
      }
    ],
    "period": {
      "start": "2024-09-01T00:00:00.000Z",
      "end": "2024-09-30T23:59:59.999Z"
    }
  }
}
```

---

## Available SOP Procedures

### Safety & OSHA Compliance (1000-1999)
- `SOP-1001`: Pre-Job Safety Inspection
- `SOP-1002`: HVHZ Safety Protocols

### Field Operations (2000-2999)
- `SOP-2001`: Roof Inspection and Assessment
- `SOP-2002`: Emergency Roof Repair Protocol

### Customer Service (4000-4999)
- `SOP-4001`: Customer Lead Response
- `SOP-4002`: Insurance Claim Communication

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Service Types
- `roof-replacement`: Complete roof replacement
- `roof-repair`: Roof repair services
- `commercial`: Commercial roofing projects
- `maintenance`: Routine maintenance
- `emergency`: Emergency services

## Priority Levels
- `emergency`: Immediate response required (< 2 hours)
- `high`: High priority (< 8 hours)
- `medium`: Medium priority (< 24 hours)
- `low`: Low priority (< 48 hours)

## Florida Counties Supported
- Orange (Orlando)
- Brevard (Melbourne)
- Volusia (Daytona Beach)
- Seminole (Sanford)
- And all other Florida counties

---

## Database Schema

The API uses a comprehensive SQLite database with the following main tables:
- `customers` - Customer and lead information
- `projects` - Project and job management
- `sop_procedures` - Standard Operating Procedures
- `sop_workflows` - Workflow instances
- `sop_workflow_tasks` - Individual workflow tasks
- `notifications` - Notification tracking
- `vendors` - Vendor and subcontractor information
- `invoices` - Financial management
- `integration_logs` - API usage and analytics

---

## Rate Limiting
- General endpoints: 100 requests per 15 minutes per IP
- Authentication endpoints: 10 requests per 15 minutes per IP

## Development Setup

1. Install dependencies: `npm install`
2. Initialize database: `node backend/database/init.js`
3. Start server: `node backend/server.js`
4. Server runs on port 5001 by default

## Testing

Use curl or Postman to test endpoints:

```bash
# Health check
curl http://localhost:5001/api/health

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@floridafirstroofing.com", "password": "admin123"}'

# Test protected endpoint
curl -X GET http://localhost:5001/api/integration/analytics/integration \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```