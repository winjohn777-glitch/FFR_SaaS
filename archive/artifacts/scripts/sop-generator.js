#!/usr/bin/env node

/**
 * Automated SOP Generation System
 * Generates all 1,667 SOPs for Florida First Roofing LLC
 * Based on the master index analysis and 14-block template structure
 */

const fs = require('fs');
const path = require('path');
const {
  getDefinitions,
  getResponsibilities,
  getProcedureSteps,
  getDocumentation,
  getQualityControl,
  getSafetyConsiderations,
  getTrainingRequirements,
  getComplianceDetails,
  getPerformanceMetrics,
  getReferences,
  getAppendices,
  getClassification,
  getDistribution
} = require('./sop-content-helpers');

// SOP Database and Configuration
const sopConfig = {
  company: {
    name: "FLORIDA FIRST ROOFING LLC",
    address: "3815 N. COCOA BLVD #13, COCOA, FL 32926",
    phone: "321-301-4512",
    website: "floridafirstroofing.com",
    license: "FLORIDA STATE CERTIFIED ROOFING CONTRACTOR - LIC# CCC1336561"
  },

  categories: {
    "0000": {
      name: "Foundation and Governance",
      range: [0, 99],
      count: 25,
      priority: "critical",
      approver: "David Johnson, CEO",
      florida_specific: true,
      hurricane_related: false,
      osha_related: false
    },
    "1000": {
      name: "Safety & OSHA Compliance",
      range: [1000, 1999],
      count: 84,
      priority: "critical",
      approver: "Safety Manager",
      florida_specific: true,
      hurricane_related: true,
      osha_related: true
    },
    "2000": {
      name: "Enterprise Software Systems",
      range: [2000, 2999],
      count: 500,
      priority: "high",
      approver: "COO Winston Johnson",
      florida_specific: false,
      hurricane_related: false,
      osha_related: false
    },
    "3000": {
      name: "IT Infrastructure & Security",
      range: [3000, 3999],
      count: 294,
      priority: "critical",
      approver: "IT Security Administrator",
      florida_specific: false,
      hurricane_related: false,
      osha_related: false
    },
    "4000": {
      name: "Operations & Field Systems",
      range: [4000, 4999],
      count: 164,
      priority: "high",
      approver: "Operations Manager",
      florida_specific: true,
      hurricane_related: true,
      osha_related: true
    },
    "5000": {
      name: "Customer & Sales Systems",
      range: [5000, 5999],
      count: 140,
      priority: "high",
      approver: "Sales Manager",
      florida_specific: false,
      hurricane_related: false,
      osha_related: false
    },
    "6000": {
      name: "Human Resources & Training",
      range: [6000, 6999],
      count: 140,
      priority: "standard",
      approver: "HR Manager",
      florida_specific: true,
      hurricane_related: false,
      osha_related: true
    },
    "7000": {
      name: "Compliance & Quality Systems",
      range: [7000, 7999],
      count: 140,
      priority: "critical",
      approver: "Quality Manager",
      florida_specific: true,
      hurricane_related: false,
      osha_related: true
    },
    "8000": {
      name: "Integration & Automation",
      range: [8000, 8999],
      count: 140,
      priority: "standard",
      approver: "IT Manager",
      florida_specific: false,
      hurricane_related: false,
      osha_related: false
    },
    "9000": {
      name: "Reporting & Documentation",
      range: [9000, 9999],
      count: 140,
      priority: "standard",
      approver: "Operations Manager",
      florida_specific: false,
      hurricane_related: false,
      osha_related: false
    }
  },

  // SOP Title Templates by Category
  sopTemplates: {
    "1000": [
      "Fall Protection System Implementation",
      "Personal Protective Equipment Standards",
      "Ladder Safety and Inspection Procedures",
      "Electrical Safety and LOTO Procedures",
      "Heat Stress Prevention and Management",
      "Emergency Response and Evacuation",
      "Tool and Equipment Safety Inspection",
      "Hazard Communication and Material Safety",
      "Incident Reporting and Investigation",
      "Safety Training and Competency Verification"
    ],
    "2000": [
      "Customer Relationship Management System",
      "Enterprise Resource Planning Integration",
      "Financial Management and Accounting Systems",
      "Project Management Platform Configuration",
      "Document Management and Version Control",
      "Business Intelligence and Analytics",
      "Communication and Collaboration Platforms",
      "Mobile Application Management",
      "System Integration and API Management",
      "Data Backup and Recovery Procedures"
    ],
    "3000": [
      "Network Infrastructure Management",
      "Information Security Policy Framework",
      "Cybersecurity Incident Response",
      "Data Protection and Privacy Controls",
      "Access Control and Identity Management",
      "System Monitoring and Performance",
      "Disaster Recovery and Business Continuity",
      "Cloud Services Management",
      "Software Installation and Updates",
      "IT Asset Management and Inventory"
    ],
    "4000": [
      "Field Service Management System",
      "Mobile Workforce Coordination",
      "GPS Tracking and Route Optimization",
      "Work Order Management and Dispatch",
      "Inventory Management and Materials",
      "Equipment Maintenance and Inspection",
      "Customer Site Safety Protocols",
      "Quality Control and Field Inspection",
      "Weather Monitoring and Response",
      "Emergency Field Response Procedures"
    ],
    "5000": [
      "Sales Process Management and CRM",
      "Lead Generation and Qualification",
      "Customer Onboarding and Setup",
      "Proposal Development and Approval",
      "Contract Management and Execution",
      "Customer Service and Support",
      "Marketing Campaign Management",
      "Customer Feedback and Satisfaction",
      "Sales Performance Tracking",
      "Customer Retention and Loyalty"
    ],
    "6000": [
      "Employee Recruitment and Hiring",
      "Onboarding and Orientation Programs",
      "Performance Management and Reviews",
      "Training and Development Programs",
      "Compensation and Benefits Administration",
      "Employee Relations and Conflict Resolution",
      "Attendance and Time Management",
      "Disciplinary Actions and Termination",
      "OSHA Training and Certification",
      "Professional Development and Advancement"
    ],
    "7000": [
      "Quality Management System Implementation",
      "Regulatory Compliance Monitoring",
      "Audit Planning and Execution",
      "Corrective and Preventive Actions",
      "Document Control and Management",
      "Process Improvement and Optimization",
      "Customer Complaint Resolution",
      "Supplier Quality Management",
      "Risk Assessment and Management",
      "Compliance Reporting and Documentation"
    ],
    "8000": [
      "System Integration Architecture",
      "API Development and Management",
      "Workflow Automation Design",
      "Data Integration and ETL Processes",
      "Business Process Automation",
      "Third-Party Integration Management",
      "Legacy System Migration",
      "Integration Testing and Validation",
      "Performance Monitoring and Optimization",
      "Change Management for Integrations"
    ],
    "9000": [
      "Business Intelligence Reporting",
      "Dashboard Design and Implementation",
      "Data Analytics and Visualization",
      "Report Generation and Distribution",
      "Documentation Standards and Templates",
      "Knowledge Management Systems",
      "Performance Metrics and KPIs",
      "Executive Dashboard Management",
      "Compliance Reporting Automation",
      "Document Archival and Retention"
    ]
  }
};

// 14-Block SOP Template Generator
function generateSOPContent(sopNumber, title, category, subcategory = '') {
  const categoryCode = sopNumber.toString().substring(0, 1) + "000";
  const categoryInfo = sopConfig.categories[categoryCode];

  const template = `# FFR SOP-${sopNumber}: ${title}

**Company:** ${sopConfig.company.name}
**Address:** ${sopConfig.company.address}
**Phone:** ${sopConfig.company.phone} | **Website:** ${sopConfig.company.website}
**License:** ${sopConfig.company.license}

**Issued By:** ${categoryInfo.approver}
**Effective Date:** 08/01/2025
**Version:** 2025.08
**Prepared By:** ${category} Team
**Approved By:** ${categoryInfo.approver}

**Metadata Tags:** #${category.toUpperCase().replace(/\s+/g, '_')} #${title.toUpperCase().replace(/\s+/g, '_')} #FLORIDA_ROOFING #COMPLIANCE_REQUIRED${categoryInfo.florida_specific ? ' #FLORIDA_SPECIFIC' : ''}${categoryInfo.hurricane_related ? ' #HURRICANE_RELATED' : ''}${categoryInfo.osha_related ? ' #OSHA_REQUIRED' : ''}

---

## BLOCK 1: PURPOSE - Strategic Intent and Business Objectives

To establish comprehensive procedures for ${title.toLowerCase()} ensuring optimal ${getBusinessObjective(categoryCode)} while maintaining compliance with all applicable regulations and Florida First Roofing LLC operational standards.

**Strategic Objectives:**
- Ensure consistent implementation of ${title.toLowerCase()} across all operations
- Maintain compliance with ${getComplianceRequirements(categoryCode)}
- Optimize efficiency and effectiveness of ${category.toLowerCase()} operations
- Support business growth and operational excellence
- Integrate with company-wide systems and processes

---

## BLOCK 2: SCOPE - Applicability and Coverage

This SOP applies to:
- ${getScopePersonnel(categoryCode)}
- ${getScopeOperations(categoryCode)}
- ${getScopeGeographic()}

${getSpecificScope(categoryCode)}

---

## BLOCK 3: DEFINITIONS - Key Terms and Concepts

${getDefinitions(categoryCode, title)}

---

## BLOCK 4: RESPONSIBILITIES - Roles and Accountability Matrix

${getResponsibilities(categoryCode, categoryInfo.approver)}

---

## BLOCK 5: PROCEDURE - Step-by-Step Implementation Guide

${getProcedureSteps(categoryCode, title)}

---

## BLOCK 6: DOCUMENTATION - Required Forms and Records

${getDocumentation(sopNumber)}

---

## BLOCK 7: QUALITY CONTROL - Standards and Verification

${getQualityControl(categoryCode)}

---

## BLOCK 8: SAFETY CONSIDERATIONS - Risk Management and Mitigation

${getSafetyConsiderations(categoryCode, categoryInfo.osha_related)}

---

## BLOCK 9: TRAINING REQUIREMENTS - Competency Development and Certification

${getTrainingRequirements(categoryCode, categoryInfo.osha_related)}

---

## BLOCK 10: COMPLIANCE REQUIREMENTS - Legal and Regulatory Adherence

${getComplianceDetails(categoryCode, categoryInfo.florida_specific, categoryInfo.osha_related)}

---

## BLOCK 11: PERFORMANCE METRICS - Measurement and Analysis

${getPerformanceMetrics(categoryCode)}

---

## BLOCK 12: REFERENCES - Supporting Documentation and Standards

${getReferences(categoryCode, categoryInfo.osha_related)}

---

## BLOCK 13: REVISION HISTORY - Version Control and Change Management

**Version 2025.08 (Current):**
- Initial comprehensive ${title.toLowerCase()} implementation
- Integration with Florida First Roofing operational systems
- Compliance verification and approval process completion

**Planned Updates:**
- Q4 2025: Performance optimization and process enhancement
- Q1 2026: Technology integration updates and improvements
- Q2 2026: Annual comprehensive review and update cycle

---

## BLOCK 14: APPENDICES - Supporting Information and Cross-References

${getAppendices(categoryCode, sopNumber)}

---

**DOCUMENT CLASSIFICATION:** ${getClassification(categoryCode)}
**DISTRIBUTION:** ${getDistribution(categoryCode)}
**NEXT REVIEW DATE:** November 1, 2025

---

*This SOP ensures effective ${title.toLowerCase()} and supports Florida First Roofing LLC's commitment to operational excellence and regulatory compliance.*`;

  return template;
}

// Helper functions for content generation
function getBusinessObjective(categoryCode) {
  const objectives = {
    "0000": "organizational governance and documentation control",
    "1000": "workplace safety and OSHA compliance",
    "2000": "enterprise software system management",
    "3000": "IT infrastructure security and performance",
    "4000": "field operations and service delivery",
    "5000": "customer relationship management and sales excellence",
    "6000": "human resource management and employee development",
    "7000": "quality management and regulatory compliance",
    "8000": "system integration and process automation",
    "9000": "business intelligence and performance reporting"
  };
  return objectives[categoryCode] || "operational excellence";
}

function getComplianceRequirements(categoryCode) {
  const requirements = {
    "0000": "corporate governance standards and documentation requirements",
    "1000": "OSHA 29 CFR 1926, ANSI standards, and Florida safety regulations",
    "2000": "software licensing, data protection, and system security standards",
    "3000": "cybersecurity frameworks, data privacy laws, and IT governance standards",
    "4000": "field safety regulations, equipment standards, and service quality requirements",
    "5000": "consumer protection laws, sales regulations, and customer privacy standards",
    "6000": "employment law, OSHA training requirements, and HR compliance standards",
    "7000": "quality management standards, regulatory compliance, and audit requirements",
    "8000": "system integration standards, API security, and data integrity requirements",
    "9000": "reporting standards, data governance, and documentation requirements"
  };
  return requirements[categoryCode] || "applicable industry standards";
}

function getScopePersonnel(categoryCode) {
  const personnel = {
    "0000": "Executive leadership, document control personnel, and governance teams",
    "1000": "All field personnel, safety coordinators, supervisors, and management",
    "2000": "IT administrators, system users, and department managers",
    "3000": "IT personnel, security administrators, and authorized system users",
    "4000": "Field operations teams, supervisors, dispatchers, and customer service",
    "5000": "Sales representatives, customer service teams, and management",
    "6000": "HR personnel, managers, supervisors, and all employees",
    "7000": "Quality personnel, auditors, managers, and process owners",
    "8000": "IT integration teams, developers, and system administrators",
    "9000": "Business analysts, report users, and management personnel"
  };
  return personnel[categoryCode] || "all applicable personnel";
}

function getScopeOperations(categoryCode) {
  const operations = {
    "0000": "All company operations requiring governance and documentation",
    "1000": "All field work, equipment operation, and safety-related activities",
    "2000": "All business software systems and enterprise applications",
    "3000": "All IT infrastructure, networks, and security systems",
    "4000": "All field operations, service delivery, and customer site activities",
    "5000": "All customer interactions, sales processes, and service delivery",
    "6000": "All employment-related activities and human resource functions",
    "7000": "All quality-related processes and compliance activities",
    "8000": "All system integrations and automated business processes",
    "9000": "All reporting, analytics, and documentation processes"
  };
  return operations[categoryCode] || "applicable operational areas";
}

function getScopeGeographic() {
  return "All Florida First Roofing LLC service areas including Central Florida operations and emergency response territories";
}

function getSpecificScope(categoryCode) {
  const specific = {
    "1000": `
**Weather Conditions:**
- Normal weather operations
- Severe weather protocols
- Hurricane season procedures
- Lightning safety requirements

**Work Types:**
- Residential roofing projects
- Commercial roofing operations
- Emergency repairs and service calls
- Maintenance and inspection activities`,
    "4000": `
**Service Areas:**
- Brevard County operations
- Orange County operations
- Volusia County operations
- Emergency response areas

**Project Types:**
- New construction roofing
- Re-roofing projects
- Repair and maintenance
- Emergency storm response`
  };
  return specific[categoryCode] || "";
}

// Main generation function
async function generateAllSOPs() {
  console.log("🚀 Starting automated SOP generation for 1,667 procedures...");

  let totalGenerated = 0;

  for (const [categoryCode, categoryInfo] of Object.entries(sopConfig.categories)) {
    console.log(`\n📁 Generating ${categoryInfo.name} SOPs (${categoryCode} series)...`);

    const baseDir = `/Users/winstonjohnson/Claude Code/florida-first-roofing-accounting/database/sop-content/SOPs/${categoryCode}-${categoryInfo.name.replace(/\s+/g, '-')}`;

    // Create directory if it doesn't exist
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }

    // Generate SOPs for this category
    const templates = sopConfig.sopTemplates[categoryCode] || [];
    const sopCount = categoryInfo.count; // Generate ALL SOPs for complete master index

    for (let i = 0; i < sopCount; i++) {
      const sopNumber = categoryInfo.range[0] + i;
      const templateIndex = i % templates.length;
      const baseTitle = templates[templateIndex] || `${categoryInfo.name} Procedure ${i + 1}`;

      // Create more specific and varied titles
      let title = baseTitle;
      if (i >= templates.length) {
        // Generate variations for additional procedures
        const variations = [
          'Advanced', 'Basic', 'Emergency', 'Specialized', 'Standard', 'Critical',
          'Routine', 'Enhanced', 'Updated', 'Comprehensive', 'Detailed', 'Quick',
          'Primary', 'Secondary', 'Backup', 'Alternative', 'Optimized', 'Integrated'
        ];
        const variationIndex = Math.floor((i - templates.length) / templates.length);
        const variation = variations[variationIndex % variations.length];
        title = `${variation} ${baseTitle}`;
      }

      const sopContent = generateSOPContent(sopNumber, title, categoryInfo.name);
      const fileName = `SOP-${sopNumber}-${baseTitle.replace(/\s+/g, '-').toUpperCase()}.md`;
      const filePath = path.join(baseDir, fileName);

      fs.writeFileSync(filePath, sopContent);
      totalGenerated++;

      if (totalGenerated % 50 === 0) {
        console.log(`✅ Generated ${totalGenerated} SOPs...`);
      }
    }

    console.log(`✅ Completed ${categoryInfo.name}: ${sopCount} SOPs generated`);
  }

  console.log(`\n🎉 SOP Generation Complete! Total: ${totalGenerated} SOPs generated`);
  return totalGenerated;
}

// Export for use in other modules
module.exports = {
  generateAllSOPs,
  generateSOPContent,
  sopConfig
};

// Run if called directly
if (require.main === module) {
  generateAllSOPs().catch(console.error);
}