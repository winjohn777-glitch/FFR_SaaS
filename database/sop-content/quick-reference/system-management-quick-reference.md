# SYSTEM MANAGEMENT QUICK REFERENCE GUIDE

**FLORIDA FIRST ROOFING LLC**
**IT Administration and System Management**

---

## DOCUMENT INFORMATION
- **Guide ID:** System-Management-Quick-Reference
- **Version:** 1.0
- **Effective Date:** [Date]
- **Target Audience:** IT Administrators, System Managers, Technical Support
- **Review Date:** [Quarterly]
- **Approved By:** [IT Director]

---

## TABLE OF CONTENTS

1. [Emergency Contacts and Escalation](#emergency-contacts)
2. [System Management Overview](#system-overview)
3. [LMS Integration Systems](#lms-systems)
4. [Performance Measurement & KPI Systems](#performance-systems)
5. [Document Management](#document-management)
6. [Data Backup and Recovery](#backup-recovery)
7. [Troubleshooting Flowcharts](#troubleshooting)
8. [Common Commands and Procedures](#common-commands)
9. [Forms Quick Access](#forms-access)
10. [Security Procedures](#security-procedures)

---

## 1. EMERGENCY CONTACTS AND ESCALATION {#emergency-contacts}

### Emergency Response Team
| Role | Primary Contact | Phone | Email | Backup Contact |
|------|----------------|-------|-------|----------------|
| **IT Director** | [Name] | [Phone] | [Email] | [Backup Name] |
| **System Administrator** | [Name] | [Phone] | [Email] | [Backup Name] |
| **Network Administrator** | [Name] | [Phone] | [Email] | [Backup Name] |
| **Database Administrator** | [Name] | [Phone] | [Email] | [Backup Name] |
| **Security Officer** | [Name] | [Phone] | [Email] | [Backup Name] |

### Vendor Support Contacts
| System/Service | Vendor | Support Phone | Support Email | Account ID |
|----------------|--------|---------------|---------------|------------|
| **LMS Platform** | [Vendor] | [Phone] | [Email] | [Account] |
| **Business Intelligence** | [Vendor] | [Phone] | [Email] | [Account] |
| **Document Management** | [Vendor] | [Phone] | [Email] | [Account] |
| **Backup Solutions** | [Vendor] | [Phone] | [Email] | [Account] |
| **Network Infrastructure** | [Vendor] | [Phone] | [Email] | [Account] |

### Escalation Decision Tree
```
INCIDENT DETECTED
        ↓
   Level 1: Help Desk
   (Response: Immediate)
        ↓
   Level 2: System Admin
   (Response: 15 minutes)
        ↓
   Level 3: IT Manager
   (Response: 30 minutes)
        ↓
   Level 4: IT Director
   (Response: 1 hour)
        ↓
   Level 5: Executive Team
   (Response: 2 hours)
```

---

## 2. SYSTEM MANAGEMENT OVERVIEW {#system-overview}

### System Architecture Diagram
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Users/Clients │◄──►│  Application     │◄──►│   Data Layer    │
│                 │    │     Layer        │    │                 │
│ • Web Browsers  │    │ • LMS Platform   │    │ • Database      │
│ • Mobile Apps   │    │ • BI Tools       │    │ • File Storage  │
│ • Desktop Apps  │    │ • Document Mgmt  │    │ • Backup Systems│
└─────────────────┘    └──────────────────┘    └─────────────────┘
        ↓                        ↓                        ↓
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Network Layer  │    │ Security Layer   │    │Infrastructure   │
│                 │    │                  │    │                 │
│ • Firewalls     │    │ • Authentication │    │ • Servers       │
│ • Load Balancer │    │ • Authorization  │    │ • Storage       │
│ • VPN           │    │ • Encryption     │    │ • Networking    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Core System Components
| Component | Function | Status Monitoring | Primary Admin |
|-----------|----------|-------------------|---------------|
| **Active Directory** | User authentication & authorization | 24/7 monitoring | System Admin |
| **Exchange Server** | Email and calendar services | Business hours | Email Admin |
| **File Servers** | Document storage and sharing | 24/7 monitoring | System Admin |
| **Database Servers** | Business application data | 24/7 monitoring | DBA |
| **Backup Systems** | Data protection and recovery | Daily verification | Backup Admin |
| **Network Infrastructure** | Connectivity and communications | 24/7 monitoring | Network Admin |

### System Performance Baselines
| Metric | Target | Warning Threshold | Critical Threshold |
|--------|--------|-------------------|-------------------|
| **Server CPU Utilization** | <70% | 80% | 90% |
| **Memory Utilization** | <80% | 85% | 95% |
| **Disk Space Usage** | <70% | 80% | 90% |
| **Network Latency** | <50ms | 100ms | 200ms |
| **Application Response Time** | <3sec | 5sec | 10sec |
| **System Availability** | 99.9% | 99.5% | 99% |

---

## 3. LMS INTEGRATION SYSTEMS {#lms-systems}

### LMS Platform Quick Setup
**Reference SOPs:** SOP-0041 through SOP-0055

#### New User Setup Checklist
```
☐ 1. Create user account in Active Directory
☐ 2. Assign appropriate security groups
☐ 3. Complete FORM-0026-01 (if CRM access needed)
☐ 4. Configure LMS user profile
☐ 5. Assign role-based learning paths
☐ 6. Set up mobile access (if required)
☐ 7. Send welcome email with login instructions
☐ 8. Schedule initial training session
☐ 9. Document access in user tracking system
☐ 10. Follow up within 48 hours
```

#### LMS System Health Check
| Component | Check Frequency | Monitoring Tool | Alert Threshold |
|-----------|----------------|-----------------|-----------------|
| **User Login Success Rate** | Real-time | LMS Analytics | <95% |
| **Course Completion Rates** | Daily | Dashboard | <80% of target |
| **Assessment System** | Hourly | Automated testing | Any failure |
| **Mobile App Sync** | Every 4 hours | Mobile monitoring | Sync delays >1hr |
| **Content Delivery** | Continuous | CDN monitoring | Load time >5sec |

#### Common LMS Issues and Solutions
| Issue | Symptoms | Quick Fix | Escalation |
|-------|----------|-----------|------------|
| **Login Failures** | Users can't access system | Check AD sync, reset passwords | If affecting >10 users |
| **Course Access** | Content not loading | Clear browser cache, check permissions | If system-wide |
| **Assessment Errors** | Tests not submitting | Restart assessment engine | If affecting multiple courses |
| **Mobile Sync Issues** | App not updating | Force sync, restart app | If affecting multiple users |
| **Performance Issues** | Slow loading times | Check server resources | If response time >10sec |

### Content Development Workflow
```
CONTENT REQUEST (FORM-0041-01)
        ↓
   NEEDS ASSESSMENT
        ↓
   CONTENT PLANNING
        ↓
   SME COLLABORATION
        ↓
   CONTENT CREATION
        ↓
   QUALITY ASSURANCE
        ↓
   PILOT TESTING
        ↓
   FINAL APPROVAL
        ↓
   LMS UPLOAD
        ↓
   USER ENROLLMENT
        ↓
   PROGRESS MONITORING
```

---

## 4. PERFORMANCE MEASUREMENT & KPI SYSTEMS {#performance-systems}

### KPI Dashboard Administration
**Reference SOPs:** SOP-0056 through SOP-0070

#### Dashboard System Components
| Component | Platform | Admin Access | Backup Frequency |
|-----------|----------|--------------|------------------|
| **Executive Dashboards** | Power BI | IT Manager+ | Daily |
| **Operations Dashboards** | Tableau | Dept Managers+ | Daily |
| **Individual Scorecards** | Custom Portal | Self-service | Weekly |
| **Compliance Reporting** | SQL Reporting | Compliance Team | Daily |
| **Financial Analytics** | ERP Integration | Finance Team+ | Real-time |

#### KPI Data Sources Integration
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Data Sources  │───►│  ETL Processes   │───►│   Data Warehouse│
│                 │    │                  │    │                 │
│ • ERP System    │    │ • Data Cleaning  │    │ • Star Schema   │
│ • CRM System    │    │ • Transformation │    │ • Fact Tables   │
│ • Time Tracking │    │ • Validation     │    │ • Dimension     │
│ • Quality System│    │ • Error Handling │    │   Tables        │
│ • Safety System │    │ • Scheduling     │    │ • Aggregations  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        ↓                        ↓                        ↓
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  BI Platform    │◄───│  OLAP Cubes      │◄───│   Data Models   │
│                 │    │                  │    │                 │
│ • Dashboards    │    │ • Pre-calculated │    │ • Relationships │
│ • Reports       │    │   Measures       │    │ • Hierarchies   │
│ • Alerts        │    │ • Drill-down     │    │ • Calculations  │
│ • Mobile Views  │    │   Capabilities   │    │ • Security      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

#### KPI Performance Report Generation
**Standard Reports:** Use FORM-0056-01 KPI Performance Report Template

**Report Schedule:**
- **Daily Reports:** 6:00 AM (Previous day performance)
- **Weekly Reports:** Monday 8:00 AM (Previous week summary)
- **Monthly Reports:** 1st business day at 9:00 AM
- **Quarterly Reports:** Within 3 business days of quarter end
- **Annual Reports:** Within 10 business days of year end

#### Performance Alert Thresholds
| KPI Category | Green (Good) | Yellow (Warning) | Red (Critical) |
|--------------|--------------|------------------|----------------|
| **Financial Performance** | >Target | 90-100% of Target | <90% of Target |
| **Operational Efficiency** | >95% | 85-95% | <85% |
| **Quality Metrics** | <2% Defects | 2-5% Defects | >5% Defects |
| **Safety Performance** | Zero Incidents | 1-2 Near Misses | Any Incidents |
| **Customer Satisfaction** | >4.5/5 | 4.0-4.5/5 | <4.0/5 |

---

## 5. DOCUMENT MANAGEMENT {#document-management}

### Document Access Management
**Reference SOP:** SOP-0013 - Document Management System Administration

#### Access Request Process
```
USER SUBMITS FORM-0013-01
        ↓
SUPERVISOR REVIEW & APPROVAL
        ↓
SECURITY CLEARANCE VERIFICATION
        ↓
IT ADMIN CONFIGURES ACCESS
        ↓
USER NOTIFICATION & TRAINING
        ↓
ACCESS MONITORING & REVIEW
```

#### Document Classification Quick Reference
| Classification | Description | Access Control | Examples |
|----------------|-------------|----------------|----------|
| **Public** | Information available to public | No restrictions | Marketing materials, public SOPs |
| **Internal** | Company internal information | Employee access only | Internal procedures, schedules |
| **Confidential** | Sensitive business information | Authorized personnel only | Financial data, HR records |
| **Restricted** | Highly sensitive information | Limited authorized access | Executive documents, legal files |
| **Top Secret** | Critical business information | Minimal access, logging required | Strategic plans, M&A documents |

#### File Naming Conventions
| Document Type | Naming Convention | Example |
|---------------|-------------------|---------|
| **SOPs** | SOP-NNNN-Title-vN.N | SOP-0041-LMS-Platform-Setup-v1.0 |
| **Forms** | FORM-NNNN-NN-Title | FORM-0056-01-KPI-Performance-Report |
| **Policies** | POL-NNN-Title-vN.N | POL-001-Data-Security-Policy-v2.1 |
| **Procedures** | PROC-NNN-Title-vN.N | PROC-100-Backup-Verification-v1.5 |
| **Reports** | RPT-YYYY-MM-DD-Title | RPT-2024-12-01-Monthly-KPI-Report |

---

## 6. DATA BACKUP AND RECOVERY {#backup-recovery}

### Backup Verification Procedures
**Reference SOP:** SOP-0014 - Data Backup and Recovery Management

#### Daily Backup Checklist (FORM-0014-01)
```
☐ 1. Verify backup job completion status
☐ 2. Check backup log files for errors
☐ 3. Validate backup file integrity
☐ 4. Confirm off-site backup replication
☐ 5. Test random file restoration
☐ 6. Update backup status dashboard
☐ 7. Document any issues or exceptions
☐ 8. Notify management of critical issues
☐ 9. Plan next day's backup schedule
☐ 10. Archive backup logs and reports
```

#### Backup Schedule Matrix
| System | Backup Type | Frequency | Retention | Location |
|--------|-------------|-----------|-----------|----------|
| **Database Servers** | Full | Weekly | 12 months | On-site + Cloud |
| **Database Servers** | Incremental | Daily | 3 months | On-site + Cloud |
| **File Servers** | Full | Weekly | 6 months | On-site + Off-site |
| **File Servers** | Differential | Daily | 1 month | On-site |
| **Email System** | Full | Daily | 7 years | On-site + Cloud |
| **Application Servers** | Image | Weekly | 3 months | On-site + Off-site |
| **User Workstations** | Profile | Weekly | 1 month | Network storage |

#### Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO)
| System Priority | RTO Target | RPO Target | Business Impact |
|----------------|------------|------------|-----------------|
| **Critical (Tier 1)** | 2 hours | 15 minutes | Business stoppage |
| **Important (Tier 2)** | 8 hours | 1 hour | Significant impact |
| **Standard (Tier 3)** | 24 hours | 4 hours | Moderate impact |
| **Low Priority (Tier 4)** | 72 hours | 24 hours | Minimal impact |

---

## 7. TROUBLESHOOTING FLOWCHARTS {#troubleshooting}

### System Performance Issues
```
PERFORMANCE ISSUE REPORTED
        ↓
Is it affecting multiple users?
   ↓                    ↓
  YES                  NO
   ↓                    ↓
Check server          Check user
resources             workstation
   ↓                    ↓
CPU >90%?             Clear cache
   ↓                    ↓
  YES                 Restart
   ↓                 application
Scale resources         ↓
   ↓                 Issue
Monitor               resolved?
improvement             ↓
   ↓                   NO
Issue                   ↓
resolved?           Escalate to
   ↓               Level 2 Support
  NO
   ↓
Escalate to
Infrastructure Team
```

### Network Connectivity Issues
```
CONNECTIVITY ISSUE REPORTED
        ↓
Can user access internet?
   ↓                    ↓
  YES                  NO
   ↓                    ↓
Internal network      Check physical
issue                 connections
   ↓                    ↓
Can ping server?      Cable secure?
   ↓                    ↓
  NO                  YES
   ↓                    ↓
Check switch          Restart network
and router            adapter
   ↓                    ↓
Restart network       Still no
equipment             connection?
   ↓                    ↓
Test                  YES
connectivity            ↓
   ↓               Replace network
Escalate to         cable/adapter
Network Admin
```

### Application Access Issues
```
APPLICATION ACCESS ISSUE
        ↓
Can user login to system?
   ↓                    ↓
  NO                  YES
   ↓                    ↓
Check user           Application
credentials          specific issue
   ↓                    ↓
Account              Check
locked?              permissions
   ↓                    ↓
 YES                 Access to
   ↓                specific feature?
Unlock                 ↓
account               NO
   ↓                    ↓
Reset                Review role
password             assignments
   ↓                    ↓
Test                 Update
access               permissions
   ↓                    ↓
Working?             Test access
   ↓                    ↓
  NO                Working?
   ↓                    ↓
Escalate to         Document
Application          resolution
Admin
```

---

## 8. COMMON COMMANDS AND PROCEDURES {#common-commands}

### Windows Server Administration
#### System Information Commands
```powershell
# Check system information
Get-ComputerInfo

# Check CPU usage
Get-WmiObject -Class Win32_Processor | Measure-Object -Property LoadPercentage -Average

# Check memory usage
Get-WmiObject -Class Win32_OperatingSystem | Select TotalVisibleMemorySize, FreePhysicalMemory

# Check disk space
Get-WmiObject -Class Win32_LogicalDisk | Select DeviceID, @{Name="Size(GB)";Expression={[math]::Round($_.Size/1GB,2)}}, @{Name="FreeSpace(GB)";Expression={[math]::Round($_.FreeSpace/1GB,2)}}

# Check running services
Get-Service | Where-Object {$_.Status -eq "Running"}

# Check event logs for errors
Get-EventLog -LogName System -EntryType Error -Newest 10
```

#### User Account Management
```powershell
# Create new user account
New-ADUser -Name "John Doe" -SamAccountName "jdoe" -UserPrincipalName "jdoe@company.com" -Path "OU=Users,DC=company,DC=com" -AccountPassword (ConvertTo-SecureString "TempPassword123!" -AsPlainText -Force) -Enabled $true

# Add user to group
Add-ADGroupMember -Identity "Domain Users" -Members "jdoe"

# Reset user password
Set-ADAccountPassword -Identity "jdoe" -NewPassword (ConvertTo-SecureString "NewPassword123!" -AsPlainText -Force) -Reset

# Disable user account
Disable-ADAccount -Identity "jdoe"

# Check user group membership
Get-ADPrincipalGroupMembership -Identity "jdoe"
```

### Database Administration (SQL Server)
#### Database Health Checks
```sql
-- Check database status
SELECT name, state_desc, recovery_model_desc
FROM sys.databases
WHERE database_id > 4;

-- Check backup status
SELECT
    d.name AS DatabaseName,
    b.backup_start_date AS LastBackupDate,
    b.type AS BackupType
FROM sys.databases d
LEFT JOIN msdb.dbo.backupset b ON d.name = b.database_name
WHERE d.database_id > 4
ORDER BY b.backup_start_date DESC;

-- Check disk space usage
SELECT
    DB_NAME(database_id) AS DatabaseName,
    type_desc AS FileType,
    name AS LogicalName,
    physical_name AS PhysicalName,
    size * 8 / 1024 AS SizeMB,
    max_size * 8 / 1024 AS MaxSizeMB
FROM sys.master_files
ORDER BY database_id;

-- Check active connections
SELECT
    db_name(dbid) AS DatabaseName,
    COUNT(dbid) AS NumberOfConnections,
    loginame AS LoginName
FROM sys.sysprocesses
WHERE dbid > 0
GROUP BY dbid, loginame;
```

### Network Administration
#### Network Diagnostics
```cmd
# Test connectivity
ping google.com
ping 8.8.8.8

# Trace network route
tracert google.com

# Check DNS resolution
nslookup google.com
nslookup google.com 8.8.8.8

# Display network configuration
ipconfig /all

# Refresh network settings
ipconfig /release
ipconfig /renew
ipconfig /flushdns

# Check network ports
netstat -an | find "LISTENING"
netstat -an | find "ESTABLISHED"

# Test specific port connectivity
telnet server.company.com 80
Test-NetConnection -ComputerName server.company.com -Port 443
```

---

## 9. FORMS QUICK ACCESS {#forms-access}

### System Management Forms
| Form ID | Form Name | Purpose | Department | Digital Location |
|---------|-----------|---------|------------|------------------|
| **FORM-0013-01** | Document Access Request | Request system/document access | IT/All | \\server\forms\access\ |
| **FORM-0014-01** | Backup Verification Checklist | Daily backup verification | IT | \\server\forms\backup\ |
| **FORM-0026-01** | CRM User Setup Form | CRM system user configuration | Sales/IT | \\server\forms\crm\ |
| **FORM-0041-01** | Training Course Development | LMS content development request | Training | \\server\forms\training\ |
| **FORM-0056-01** | KPI Performance Report Template | Performance reporting | Management | \\server\forms\reporting\ |

### Form Processing Workflows
#### FORM-0013-01 Document Access Request
```
User completes form → Supervisor approval → Security review → IT implementation → User notification → Access granted
Timeline: 1-2 business days
```

#### FORM-0014-01 Backup Verification
```
Daily execution → Verification completion → Issue identification → Problem resolution → Management reporting
Timeline: Daily by 8:00 AM
```

#### FORM-0026-01 CRM User Setup
```
Form submission → Manager approval → License availability → Account creation → Training scheduling → Access activation
Timeline: 2-3 business days
```

### Form Submission Methods
| Method | Forms Accepted | Processing Time | Approval Required |
|--------|----------------|-----------------|-------------------|
| **Email** | All forms | 24-48 hours | Yes |
| **Help Desk Portal** | Access requests only | 4-8 hours | Yes |
| **SharePoint Workflow** | All forms | Real-time | Automated |
| **In-Person** | Urgent requests only | Immediate | Manager present |

---

## 10. SECURITY PROCEDURES {#security-procedures}

### Security Incident Response
#### Incident Classification
| Severity | Description | Response Time | Team Required |
|----------|-------------|---------------|---------------|
| **Critical** | Data breach, system compromise | Immediate | All hands |
| **High** | Suspected intrusion, malware | 15 minutes | Security team |
| **Medium** | Policy violation, suspicious activity | 1 hour | IT admin |
| **Low** | Password issues, access questions | 4 hours | Help desk |

#### Security Response Checklist
```
☐ 1. Identify and contain the threat
☐ 2. Assess the scope and impact
☐ 3. Notify appropriate personnel
☐ 4. Document all actions taken
☐ 5. Preserve evidence for investigation
☐ 6. Implement immediate countermeasures
☐ 7. Monitor for additional threats
☐ 8. Communication with stakeholders
☐ 9. Recovery and restoration
☐ 10. Post-incident review and lessons learned
```

### Access Control Procedures
#### User Access Levels
| Access Level | Permissions | Approval Required | Review Frequency |
|--------------|-------------|-------------------|------------------|
| **Read Only** | View documents/data | Supervisor | Annual |
| **Standard User** | Modify assigned data | Manager | Semi-annual |
| **Power User** | Advanced features | Department head | Quarterly |
| **Administrator** | System configuration | IT Director | Monthly |
| **Super Admin** | Full system access | Executive team | Weekly |

#### Password Policy Quick Reference
- **Minimum Length:** 12 characters
- **Complexity:** Upper, lower, number, special character
- **Expiration:** 90 days (privileged accounts: 60 days)
- **History:** Cannot reuse last 12 passwords
- **Account Lockout:** 5 failed attempts, 30-minute lockout
- **Multi-Factor Authentication:** Required for admin accounts

### Data Classification and Handling
| Classification | Handling Requirements | Storage Location | Transmission Method |
|----------------|----------------------|------------------|-------------------|
| **Public** | Standard care | Any approved location | Any method |
| **Internal** | Company personnel only | Company systems only | Encrypted email |
| **Confidential** | Authorized personnel | Secured systems | Encrypted channels |
| **Restricted** | Minimal access list | Secure vault | Certified encryption |

---

## QUICK CONTACT REFERENCE

### Emergency Numbers
- **IT Emergency Hotline:** [Phone Number]
- **Security Incident Hotline:** [Phone Number]
- **Management Emergency:** [Phone Number]

### Standard Support
- **Help Desk:** [Phone Number] / [Email]
- **System Administration:** [Email]
- **Network Support:** [Email]

### After-Hours Support
- **On-Call IT:** [Phone Number]
- **Emergency Management:** [Phone Number]

---

**Document Control:**
- Guide ID: System-Management-Quick-Reference
- Version: 1.0
- Effective Date: [Date]
- Review Date: [Quarterly]
- Approved By: [IT Director]
- Next Review: [Date + 3 Months]