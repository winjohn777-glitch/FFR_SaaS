/**
 * Florida First Roofing LLC - Complete County SOP Generator
 * Generates all 67 Florida county-specific SOPs
 */

const fs = require('fs');
const path = require('path');

// All 67 Florida Counties with detailed information
const floridaCounties = [
  // Priority 1: Major Population Centers
  { code: '8200', name: 'Alachua', seat: 'Gainesville', type: 'University', population: 'Large', region: 'North Central' },
  { code: '8201', name: 'Baker', seat: 'Macclenny', type: 'Rural', population: 'Small', region: 'Northeast' },
  { code: '8202', name: 'Bay', seat: 'Panama City', type: 'Coastal/Military', population: 'Medium', region: 'Panhandle' },
  { code: '8203', name: 'Bradford', seat: 'Starke', type: 'Rural/Correctional', population: 'Small', region: 'North Central' },
  { code: '8204', name: 'Brevard', seat: 'Viera', type: 'Space Coast/Tech', population: 'Large', region: 'East Central' },
  { code: '8205', name: 'Broward', seat: 'Fort Lauderdale', type: 'Metropolitan', population: 'Very Large', region: 'Southeast' },
  { code: '8206', name: 'Calhoun', seat: 'Blountstown', type: 'Rural/Agricultural', population: 'Small', region: 'Panhandle' },
  { code: '8207', name: 'Charlotte', seat: 'Punta Gorda', type: 'Coastal/Retirement', population: 'Medium', region: 'Southwest' },
  { code: '8208', name: 'Citrus', seat: 'Inverness', type: 'Coastal/Retirement', population: 'Medium', region: 'West Central' },
  { code: '8209', name: 'Clay', seat: 'Green Cove Springs', type: 'Suburban/Military', population: 'Large', region: 'Northeast' },

  { code: '8210', name: 'Collier', seat: 'Naples', type: 'Coastal/Luxury', population: 'Large', region: 'Southwest' },
  { code: '8211', name: 'Columbia', seat: 'Lake City', type: 'Rural/Mixed', population: 'Medium', region: 'North Central' },
  { code: '8212', name: 'DeSoto', seat: 'Arcadia', type: 'Agricultural/Cattle', population: 'Small', region: 'South Central' },
  { code: '8213', name: 'Dixie', seat: 'Cross City', type: 'Coastal/Rural', population: 'Small', region: 'North Central' },
  { code: '8214', name: 'Duval', seat: 'Jacksonville', type: 'Metropolitan/Port', population: 'Very Large', region: 'Northeast' },
  { code: '8215', name: 'Escambia', seat: 'Pensacola', type: 'Military/Coastal', population: 'Large', region: 'Panhandle' },
  { code: '8216', name: 'Flagler', seat: 'Bunnell', type: 'Coastal/Growth', population: 'Medium', region: 'Northeast' },
  { code: '8217', name: 'Franklin', seat: 'Apalachicola', type: 'Coastal/Fishing', population: 'Small', region: 'Panhandle' },
  { code: '8218', name: 'Gadsden', seat: 'Quincy', type: 'Rural/Agricultural', population: 'Small', region: 'Panhandle' },
  { code: '8219', name: 'Gilchrist', seat: 'Trenton', type: 'Rural/Agricultural', population: 'Small', region: 'North Central' },

  { code: '8220', name: 'Glades', seat: 'Moore Haven', type: 'Agricultural/Sugar', population: 'Small', region: 'South Central' },
  { code: '8221', name: 'Gulf', seat: 'Port St. Joe', type: 'Coastal/Hurricane Recovery', population: 'Small', region: 'Panhandle' },
  { code: '8222', name: 'Hamilton', seat: 'Jasper', type: 'Rural/Agricultural', population: 'Small', region: 'North Central' },
  { code: '8223', name: 'Hardee', seat: 'Wauchula', type: 'Agricultural/Cattle', population: 'Small', region: 'South Central' },
  { code: '8224', name: 'Hendry', seat: 'LaBelle', type: 'Agricultural/Sugar', population: 'Small', region: 'Southwest' },
  { code: '8225', name: 'Hernando', seat: 'Brooksville', type: 'Coastal/Growth', population: 'Medium', region: 'West Central' },
  { code: '8226', name: 'Highlands', seat: 'Sebring', type: 'Agricultural/Citrus', population: 'Medium', region: 'South Central' },
  { code: '8227', name: 'Hillsborough', seat: 'Tampa', type: 'Metropolitan/Port', population: 'Very Large', region: 'West Central' },
  { code: '8228', name: 'Holmes', seat: 'Bonifay', type: 'Rural/Agricultural', population: 'Small', region: 'Panhandle' },
  { code: '8229', name: 'Indian River', seat: 'Vero Beach', type: 'Coastal/Citrus', population: 'Medium', region: 'East Central' },

  { code: '8230', name: 'Jackson', seat: 'Marianna', type: 'Rural/Correctional', population: 'Small', region: 'Panhandle' },
  { code: '8231', name: 'Jefferson', seat: 'Monticello', type: 'Rural/Agricultural', population: 'Small', region: 'North Central' },
  { code: '8232', name: 'Lafayette', seat: 'Mayo', type: 'Rural/Agricultural', population: 'Small', region: 'North Central' },
  { code: '8233', name: 'Lake', seat: 'Tavares', type: 'Mixed/Citrus', population: 'Large', region: 'Central' },
  { code: '8234', name: 'Lee', seat: 'Fort Myers', type: 'Coastal/Tourist', population: 'Very Large', region: 'Southwest' },
  { code: '8235', name: 'Leon', seat: 'Tallahassee', type: 'Capital/University', population: 'Large', region: 'Panhandle' },
  { code: '8236', name: 'Levy', seat: 'Bronson', type: 'Coastal/Rural', population: 'Small', region: 'North Central' },
  { code: '8237', name: 'Liberty', seat: 'Bristol', type: 'Rural/Correctional', population: 'Small', region: 'Panhandle' },
  { code: '8238', name: 'Madison', seat: 'Madison', type: 'Rural/Agricultural', population: 'Small', region: 'North Central' },
  { code: '8239', name: 'Manatee', seat: 'Bradenton', type: 'Coastal/Mixed', population: 'Large', region: 'West Central' },

  { code: '8240', name: 'Marion', seat: 'Ocala', type: 'Equestrian/Mixed', population: 'Large', region: 'Central' },
  { code: '8241', name: 'Martin', seat: 'Stuart', type: 'Coastal/Environmental', population: 'Medium', region: 'Southeast' },
  { code: '8242', name: 'Miami-Dade', seat: 'Miami', type: 'Metropolitan/International', population: 'Very Large', region: 'Southeast' },
  { code: '8243', name: 'Monroe', seat: 'Key West', type: 'Keys/Special Requirements', population: 'Medium', region: 'South' },
  { code: '8244', name: 'Nassau', seat: 'Fernandina Beach', type: 'Coastal/Industrial', population: 'Medium', region: 'Northeast' },
  { code: '8245', name: 'Okaloosa', seat: 'Crestview', type: 'Military/Coastal', population: 'Large', region: 'Panhandle' },
  { code: '8246', name: 'Okeechobee', seat: 'Okeechobee', type: 'Agricultural/Lake', population: 'Small', region: 'South Central' },
  { code: '8247', name: 'Orange', seat: 'Orlando', type: 'Metropolitan/Tourism', population: 'Very Large', region: 'Central' },
  { code: '8248', name: 'Osceola', seat: 'Kissimmee', type: 'Tourism/Growth', population: 'Large', region: 'Central' },
  { code: '8249', name: 'Palm Beach', seat: 'West Palm Beach', type: 'Coastal/Luxury', population: 'Very Large', region: 'Southeast' },

  { code: '8250', name: 'Pasco', seat: 'Dade City', type: 'Growth/Mixed', population: 'Large', region: 'West Central' },
  { code: '8251', name: 'Pinellas', seat: 'Clearwater', type: 'Dense Coastal/Urban', population: 'Very Large', region: 'West Central' },
  { code: '8252', name: 'Polk', seat: 'Bartow', type: 'Agricultural/Citrus', population: 'Very Large', region: 'Central' },
  { code: '8253', name: 'Putnam', seat: 'Palatka', type: 'Rural/Forestry', population: 'Medium', region: 'Northeast' },
  { code: '8254', name: 'Santa Rosa', seat: 'Milton', type: 'Military/Coastal', population: 'Large', region: 'Panhandle' },
  { code: '8255', name: 'Sarasota', seat: 'Sarasota', type: 'Coastal/Luxury', population: 'Large', region: 'West Central' },
  { code: '8256', name: 'Seminole', seat: 'Sanford', type: 'Orlando Metro/Mixed', population: 'Large', region: 'Central' },
  { code: '8257', name: 'St. Johns', seat: 'St. Augustine', type: 'Historic/Coastal', population: 'Large', region: 'Northeast' },
  { code: '8258', name: 'St. Lucie', seat: 'Fort Pierce', type: 'Coastal/Mixed', population: 'Large', region: 'Southeast' },
  { code: '8259', name: 'Sumter', seat: 'Bushnell', type: 'Retirement/Villages', population: 'Medium', region: 'Central' },

  { code: '8260', name: 'Suwannee', seat: 'Live Oak', type: 'Rural/Agricultural', population: 'Small', region: 'North Central' },
  { code: '8261', name: 'Taylor', seat: 'Perry', type: 'Coastal/Forestry', population: 'Small', region: 'North Central' },
  { code: '8262', name: 'Union', seat: 'Lake Butler', type: 'Rural/Correctional', population: 'Small', region: 'North Central' },
  { code: '8263', name: 'Volusia', seat: 'DeLand', type: 'Coastal/Motorsports', population: 'Large', region: 'East Central' },
  { code: '8264', name: 'Wakulla', seat: 'Crawfordville', type: 'Coastal/Environmental', population: 'Small', region: 'Panhandle' },
  { code: '8265', name: 'Walton', seat: 'DeFuniak Springs', type: 'Coastal/Tourism', population: 'Medium', region: 'Panhandle' },
  { code: '8266', name: 'Washington', seat: 'Chipley', type: 'Rural/Agricultural', population: 'Small', region: 'Panhandle' }
];

// Hurricane zones and special requirements
const hurricaneZones = {
  'Southeast': { zone: 'Category 5', windSpeed: '185+ mph', hvhz: true },
  'Southwest': { zone: 'Category 4', windSpeed: '156-185 mph', hvhz: false },
  'West Central': { zone: 'Category 3', windSpeed: '130-155 mph', hvhz: false },
  'East Central': { zone: 'Category 4', windSpeed: '156-185 mph', hvhz: false },
  'Central': { zone: 'Category 2', windSpeed: '105-129 mph', hvhz: false },
  'Northeast': { zone: 'Category 2', windSpeed: '105-129 mph', hvhz: false },
  'North Central': { zone: 'Category 1', windSpeed: '85-104 mph', hvhz: false },
  'Panhandle': { zone: 'Category 3', windSpeed: '130-155 mph', hvhz: false },
  'South': { zone: 'Category 5', windSpeed: '185+ mph', hvhz: true }
};

// Generate SOP content for each county
function generateCountySOP(county) {
  const hurricane = hurricaneZones[county.region] || hurricaneZones['North Central']; // Default fallback
  const hvhzStatus = hurricane.hvhz ? 'YES - High Velocity Hurricane Zone' : 'NO - Standard Hurricane Zone';

  return `# FFR SOP-${county.code}: ${county.name.toUpperCase()} COUNTY OPERATIONS

**Company:** FLORIDA FIRST ROOFING LLC
**Address:** 3815 N. COCOA BLVD #13, COCOA, FL 32926
**Phone:** 321-301-4512 | **Website:** floridafirstroofing.com
**License:** FLORIDA STATE CERTIFIED ROOFING CONTRACTOR - LIC# CCC1336561

**County:** ${county.name} County
**County Seat:** ${county.seat}
**Type:** ${county.type}
**Population:** ${county.population}
**Region:** ${county.region}

**Issued By:** Winston Johnson, COO/Compliance Officer
**Effective Date:** 10/18/2025
**Version:** 2025.10
**Prepared By:** Compliance Department
**Approved By:** David Johnson, CEO & License Holder

**Metadata Tags:** #${county.name.toUpperCase()}_COUNTY #${county.type.toUpperCase().replace(/[^A-Z]/g, '_')} #${county.region.toUpperCase().replace(/[^A-Z]/g, '_')} #COUNTY_OPERATIONS #FLORIDA_ROOFING

---

## BLOCK 1: PURPOSE - Strategic Intent and Business Objectives

To establish comprehensive operational procedures for Florida First Roofing LLC operations within ${county.name} County, ensuring full compliance with local building codes, permit requirements, environmental regulations, and emergency protocols while delivering superior roofing services throughout the ${county.seat} area and all ${county.name} County municipalities.

**Strategic Business Objectives:**
- Ensure 100% compliance with ${county.name} County building codes and permit requirements
- Establish efficient operational workflows for ${county.type.toLowerCase()} environment operations
- Maintain superior customer service standards throughout ${county.name} County service area
- Develop strong relationships with local building officials, inspectors, and municipal authorities
- Position Florida First Roofing as the premier roofing contractor in ${county.name} County
- Support business expansion and market leadership in the ${county.region} Florida region

---

## BLOCK 2: SCOPE - Applicability and Coverage

This SOP applies to all Florida First Roofing LLC operations within ${county.name} County boundaries, including:

**Geographic Coverage:**
- ${county.seat} (County Seat) and all incorporated municipalities
- Unincorporated areas under ${county.name} County jurisdiction
- All residential, commercial, and industrial properties within county limits
- Emergency response operations throughout ${county.name} County

**Service Types:**
- New roof installations and replacements
- Roof repairs and maintenance
- Storm damage restoration and emergency services
- Commercial roofing projects
- Insurance claim support and coordination
- Preventive maintenance programs

**Personnel Coverage:**
- All field crews operating in ${county.name} County
- Project managers and supervisors
- Customer service representatives
- Administrative staff handling ${county.name} County operations

---

## BLOCK 3: DEFINITIONS - Key Terms and Concepts

**${county.name} County Operations:** All Florida First Roofing business activities conducted within ${county.name} County boundaries, including sales, installation, repair, maintenance, and customer service operations.

**Local Building Authority:** ${county.name} County Building Department and any municipal building departments within incorporated areas.

**Hurricane Zone Classification:** ${hurricane.zone} (${hurricane.windSpeed}) - ${hvhzStatus}

**${county.type} Environment:** Operational considerations specific to ${county.type.toLowerCase()} characteristics of ${county.name} County.

**County Permit Process:** Specific permit application, review, and inspection procedures required by ${county.name} County and local municipalities.

---

## BLOCK 4: RESPONSIBILITIES - Roles and Accountability Matrix

### David Johnson, CEO & License Holder:
- Overall ${county.name} County operations oversight and strategic direction
- Local government relations and community leadership
- Market expansion and business development
- Compliance verification and performance monitoring

### County Operations Manager:
- Day-to-day management of ${county.name} County operations
- Local permit coordination and building official relationships
- Project scheduling and resource allocation
- Customer service and quality assurance

### Field Crews:
- Professional service delivery throughout ${county.name} County
- Compliance with local building codes and safety requirements
- Customer site preparation and cleanup
- Quality workmanship and materials installation

### Administrative Team:
- Permit applications and processing
- Customer communication and scheduling
- Documentation and record keeping
- Local vendor and supplier coordination

---

## BLOCK 5: PROCEDURE - Step-by-Step Implementation Guide

### 5.1 Pre-Project Planning and Permits

**5.1.1 County Permit Research:**
1. Review ${county.name} County building code requirements
2. Identify applicable wind load requirements (${hurricane.zone})
3. Research HOA/community standards if applicable
4. Verify contractor licensing requirements
5. Check for historic district or environmental restrictions

**5.1.2 Permit Application Process:**
1. Complete ${county.name} County building permit application
2. Submit engineering plans and specifications
3. Pay required permit fees
4. Schedule plan review appointment if required
5. Address any plan review comments promptly

**5.1.3 Project Scheduling:**
1. Coordinate with ${county.name} County inspection schedule
2. Plan for local weather patterns and seasonal considerations
3. Schedule material delivery and crew assignments
4. Notify customer of project timeline and requirements
5. Prepare site access and safety protocols

### 5.2 Project Execution and Compliance

**5.2.1 Site Preparation:**
1. Conduct site safety assessment and setup
2. Install required safety barriers and signage
3. Protect customer property and landscaping
4. Establish material staging and waste disposal areas
5. Post required permits and contact information

**5.2.2 Installation Process:**
1. Follow ${county.name} County approved installation methods
2. Use specified materials meeting local wind load requirements
3. Install proper ventilation and drainage systems
4. Maintain clean and professional work environment
5. Document progress with photos and daily reports

**5.2.3 Quality Control and Inspections:**
1. Conduct internal quality inspections at key milestones
2. Schedule required ${county.name} County inspections
3. Address any inspection items promptly and professionally
4. Maintain inspection records and certificates
5. Ensure final approval before project completion

### 5.3 Project Completion and Follow-up

**5.3.1 Final Inspections and Approvals:**
1. Schedule final ${county.name} County building inspection
2. Obtain certificate of completion/occupancy as required
3. Complete final customer walkthrough and approval
4. Provide warranty documentation and maintenance instructions
5. Submit final project documentation to company records

**5.3.2 Customer Service and Follow-up:**
1. Conduct customer satisfaction survey
2. Schedule post-installation quality check
3. Provide ongoing maintenance reminders
4. Maintain customer relationship for future services
5. Request customer reviews and referrals

---

## BLOCK 6: DOCUMENTATION - Required Forms and Records

### ${county.name} County Specific Forms:
- **FORM-${county.code}-01:** ${county.name} County Permit Application Checklist
- **FORM-${county.code}-02:** Local Building Code Compliance Verification
- **FORM-${county.code}-03:** Wind Load Calculation and Material Specification
- **FORM-${county.code}-04:** ${county.name} County Inspection Coordination Log
- **FORM-${county.code}-05:** Customer Communication and Service Record

### Required Documentation:
- Valid Florida roofing contractor license
- ${county.name} County business registration
- Insurance certificates meeting local requirements
- Material certifications and warranties
- Installation photos and progress documentation
- Inspection records and approvals
- Customer contracts and change orders
- Warranty and maintenance documentation

---

## BLOCK 7: QUALITY CONTROL - Standards and Verification

### Performance Standards:
- 100% compliance with ${county.name} County building codes
- 98% first-time inspection pass rate
- 95% customer satisfaction rating
- Zero safety incidents or violations
- Complete project documentation within 48 hours

### Quality Verification Process:
- Daily quality inspections by crew supervisor
- Weekly project review by county operations manager
- Monthly performance analysis and improvement planning
- Quarterly customer satisfaction assessment
- Annual compliance audit and certification renewal

---

## BLOCK 8: SAFETY CONSIDERATIONS - Risk Management and Mitigation

### ${county.name} County Specific Safety Requirements:
- Compliance with local OSHA enforcement procedures
- ${county.type} environment safety protocols
- Hurricane season preparation and response procedures
- Local emergency services coordination
- Environmental protection requirements

### Emergency Procedures:
- Immediate notification of ${county.name} County emergency services
- Customer and crew evacuation procedures
- Property protection and securing protocols
- Insurance claim and documentation procedures
- Media and public relations coordination

---

## BLOCK 9: TRAINING REQUIREMENTS - Competency Development and Certification

### Required Training for ${county.name} County Operations:
- Local building code and permit process training (8 hours)
- ${county.type} environment safety and operational procedures (4 hours)
- Customer service and community relations (2 hours)
- Emergency response and hurricane preparedness (4 hours)
- Local vendor and supplier relationship training (2 hours)

### Certification Requirements:
- Florida roofing contractor license (active)
- ${county.name} County business registration
- OSHA safety certification
- Manufacturer product certifications
- Customer service excellence certification

---

## BLOCK 10: COMPLIANCE REQUIREMENTS - Legal and Regulatory Adherence

### Federal Requirements:
- OSHA workplace safety standards
- EPA environmental protection requirements
- Fair Labor Standards Act compliance
- Consumer protection and warranty laws

### Florida State Requirements:
- Florida Building Code compliance
- State contractor licensing requirements
- Workers' compensation insurance
- State tax and revenue requirements

### ${county.name} County Requirements:
- Local building code amendments and standards
- County business license and registration
- Local permit and inspection procedures
- Environmental protection ordinances
- Historic preservation requirements (if applicable)
- HOA and community standards coordination

---

## BLOCK 11: PERFORMANCE METRICS - Measurement and Analysis

### Key Performance Indicators:
- ${county.name} County market share and growth rate
- Permit approval and inspection pass rates
- Customer satisfaction and retention rates
- Project completion time and efficiency
- Revenue and profitability per county operation
- Safety incident rates and compliance scores

### Reporting and Analysis:
- Weekly operational performance reports
- Monthly customer satisfaction surveys
- Quarterly financial and market analysis
- Annual compliance and certification review
- Continuous improvement planning and implementation

---

## BLOCK 12: REFERENCES - Supporting Documentation and Standards

### ${county.name} County Resources:
- ${county.name} County Building Department contact information
- Local municipality building departments
- ${county.name} County Emergency Management Office
- Local business and contractor organizations
- Chamber of Commerce and economic development resources

### Technical References:
- ${county.name} County building code amendments
- Florida Building Code ${hurricane.zone} requirements
- Hurricane wind load specifications (${hurricane.windSpeed})
- Local environmental protection requirements
- Historic preservation guidelines (if applicable)

---

## BLOCK 13: REVISION HISTORY - Version Control and Change Management

**Version 2025.10 (Current):**
- Initial comprehensive ${county.name} County operations procedures
- Integration with Florida First Roofing operational systems
- ${county.type} environment specific protocol development
- ${hurricane.zone} hurricane preparedness procedures
- Local compliance verification and approval

**Planned Updates:**
- Q1 2026: Performance optimization based on operational data
- Q2 2026: Enhanced customer service and community relations
- Q3 2026: Technology integration and efficiency improvements
- Q4 2026: Annual comprehensive review and update cycle

---

## BLOCK 14: APPENDICES - Supporting Information and Cross-References

### Local Contact Information:
- **${county.name} County Building Department:** [To be updated with current contact]
- **${county.seat} Municipal Building Department:** [To be updated with current contact]
- **${county.name} County Emergency Management:** [To be updated with current contact]
- **Local Chamber of Commerce:** [To be updated with current contact]

### Cross-Reference SOPs:
- SOP-0000: Universal SOP Framework and Master Index
- SOP-1000: Universal Fall Protection System
- SOP-2000: Field Operations and Installation Procedures
- SOP-6000: Emergency Response and Hurricane Procedures
- SOP-7000: Customer Service Excellence Standards

### ${county.name} County Specific Considerations:
- **Population Density:** ${county.population} population county
- **Primary Industries:** ${county.type}
- **Hurricane Risk:** ${hurricane.zone} (${hurricane.windSpeed})
- **HVHZ Status:** ${hvhzStatus}
- **Regional Characteristics:** ${county.region} Florida operational environment

---

**DOCUMENT CLASSIFICATION:** COUNTY OPERATIONS - OPERATIONAL
**DISTRIBUTION:** ${county.name.toUpperCase()} COUNTY OPERATIONS TEAM AND AUTHORIZED PERSONNEL
**NEXT REVIEW DATE:** January 18, 2026

---

*This SOP ensures effective and compliant roofing operations throughout ${county.name} County and supports Florida First Roofing LLC's commitment to excellence in the ${county.region} Florida market.*`;
}

// Generate SQL insert statements for database
function generateCountySOPSQL(county) {
  const sop = generateCountySOP(county);
  const filePath = `SOPs/8000-Regulatory-Compliance/County-Specific/SOP-${county.code}-${county.name.toUpperCase()}-COUNTY-OPERATIONS.md`;
  const hurricane = hurricaneZones[county.region] || hurricaneZones['North Central']; // Default fallback

  return `INSERT INTO sop_procedures (
    sop_number,
    category_id,
    title,
    version,
    status,
    priority_level,
    compliance_required,
    florida_specific,
    hurricane_related,
    osha_related,
    hvhz_related,
    purpose,
    scope,
    procedure_steps,
    safety_requirements,
    estimated_duration_minutes,
    created_by,
    approval_date,
    effective_date,
    review_date,
    next_review_date,
    content_file_path
  ) VALUES (
    '${county.code}',
    9,
    '${county.name.toUpperCase()} COUNTY OPERATIONS',
    '2025.10',
    'active',
    'high',
    1,
    1,
    1,
    1,
    ${hurricane.hvhz ? 1 : 0},
    'To establish comprehensive operational procedures for Florida First Roofing LLC operations within ${county.name} County',
    'All Florida First Roofing operations within ${county.name} County boundaries',
    '${JSON.stringify([
      'Pre-Project Planning and Permits',
      'Project Execution and Compliance',
      'Project Completion and Follow-up'
    ])}',
    '${county.name} County specific safety requirements and emergency procedures',
    240,
    'County Operations Generator',
    '2025-10-18',
    '2025-10-18',
    '2025-10-18',
    '2026-01-18',
    '${filePath}'
  );`;
}

// Create directory structure and generate all SOPs
function generateAllCountySOPs() {
  const outputDir = path.join(__dirname, '../SOPs/8000-Regulatory-Compliance/County-Specific');

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let sqlStatements = [];
  let summary = {
    total: floridaCounties.length,
    byRegion: {},
    byType: {},
    hvhzCounties: 0
  };

  console.log(`🏗️  Generating SOPs for all ${floridaCounties.length} Florida counties...`);

  floridaCounties.forEach((county, index) => {
    // Generate SOP content
    const sopContent = generateCountySOP(county);
    const fileName = `SOP-${county.code}-${county.name.toUpperCase()}-COUNTY-OPERATIONS.md`;
    const filePath = path.join(outputDir, fileName);

    // Write SOP file
    fs.writeFileSync(filePath, sopContent, 'utf8');

    // Generate SQL statement
    sqlStatements.push(generateCountySOPSQL(county));

    // Update summary statistics
    summary.byRegion[county.region] = (summary.byRegion[county.region] || 0) + 1;
    summary.byType[county.type] = (summary.byType[county.type] || 0) + 1;
    const hurricane = hurricaneZones[county.region] || hurricaneZones['North Central'];
    if (hurricane.hvhz) {
      summary.hvhzCounties++;
    }

    console.log(`✅ Generated SOP-${county.code}: ${county.name} County (${index + 1}/${floridaCounties.length})`);
  });

  // Write SQL file
  const sqlContent = `-- Florida First Roofing LLC - All 67 County SOPs
-- Generated: ${new Date().toISOString()}

${sqlStatements.join('\n\n')}`;

  fs.writeFileSync(path.join(outputDir, 'all-county-sops.sql'), sqlContent, 'utf8');

  // Write summary report
  const summaryContent = `# Florida County SOP Generation Summary

**Generated:** ${new Date().toISOString()}
**Total Counties:** ${summary.total}

## By Region:
${Object.entries(summary.byRegion).map(([region, count]) => `- ${region}: ${count} counties`).join('\n')}

## By Type:
${Object.entries(summary.byType).map(([type, count]) => `- ${type}: ${count} counties`).join('\n')}

## Special Classifications:
- HVHZ Counties: ${summary.hvhzCounties}
- Standard Hurricane Zone Counties: ${summary.total - summary.hvhzCounties}

## Files Generated:
- ${summary.total} county-specific SOP files
- 1 SQL insert file (all-county-sops.sql)
- This summary report

All 67 Florida counties now have comprehensive roofing operation SOPs!`;

  fs.writeFileSync(path.join(outputDir, 'GENERATION-SUMMARY.md'), summaryContent, 'utf8');

  return summary;
}

// Main execution
if (require.main === module) {
  try {
    const summary = generateAllCountySOPs();
    console.log('\n🎉 SUCCESS: All 67 Florida County SOPs generated!');
    console.log(`📊 Summary: ${summary.total} counties across ${Object.keys(summary.byRegion).length} regions`);
    console.log(`🌀 HVHZ Counties: ${summary.hvhzCounties}`);
    console.log('📁 Files created in database/sop-content/SOPs/8000-Regulatory-Compliance/County-Specific/');
  } catch (error) {
    console.error('❌ Error generating county SOPs:', error);
    process.exit(1);
  }
}

module.exports = { generateAllCountySOPs, generateCountySOP, floridaCounties };