#!/usr/bin/env node

/**
 * Miami-Dade NOA Roof Systems SOP Generator
 * Creates manufacturer-specific installation SOPs based on NOA requirements
 * Integrates with Florida First Roofing SOP Management System
 */

const fs = require('fs');
const path = require('path');
const { miamDadeNOACatalog, hvhzCommonRequirements } = require('../database/sop-content/miami-dade-noa-catalog.js');

// Company configuration
const company = {
  name: "FLORIDA FIRST ROOFING LLC",
  address: "3815 N. COCOA BLVD #13, COCOA, FL 32926",
  phone: "321-301-4512",
  website: "floridafirstroofing.com",
  license: "FLORIDA STATE CERTIFIED ROOFING CONTRACTOR - LIC# CCC1336561"
};

// NOA SOP Template Generator
function generateNOASOPContent(manufacturer, systemKey, system) {
  const sopNumber = generateSOPNumber(manufacturer, systemKey);
  const title = `${manufacturer} ${system.productName} HVHZ Installation Procedures`;

  return `# FFR SOP-${sopNumber}: ${title}

**Company:** ${company.name}
**Address:** ${company.address}
**Phone:** ${company.phone} | **Website:** ${company.website}
**License:** ${company.license}

**Issued By:** Chief Operations Officer
**Effective Date:** 01/01/2025
**Version:** 2025.01
**Prepared By:** HVHZ Installation Team
**Approved By:** David Johnson, CEO

**NOA Information:**
- **NOA Number:** ${system.noaNumber}
- **Expiration Date:** ${system.expirationDate}
- **Wind Rating:** ${system.windRating}
- **Product:** ${system.productName}

**Metadata Tags:** #MIAMI_DADE_NOA #HVHZ_INSTALLATION #${manufacturer.toUpperCase().replace(/\s+/g, '_')} #${system.productName.toUpperCase().replace(/[®\s\-]/g, '_')} #WIND_RESISTANCE #FLORIDA_BUILDING_CODE

---

## BLOCK 1: PURPOSE - Strategic Intent and Business Objectives

To establish comprehensive installation procedures for ${manufacturer} ${system.productName} roofing systems in High Velocity Hurricane Zone (HVHZ) areas, ensuring full compliance with Miami-Dade County Notice of Acceptance (NOA) requirements and Florida Building Code standards for wind resistance up to ${system.windRating}.

**Strategic Objectives:**
- Ensure 100% compliance with NOA ${system.noaNumber} requirements
- Achieve maximum wind resistance performance of ${system.windRating}
- Maintain Florida Building Code HVHZ compliance for all installations
- Integrate manufacturer-specific installation technologies and procedures
- Support business growth in Miami-Dade and Broward County markets

**Critical Success Factors:**
- Zero installation defects resulting in wind damage claims
- 100% NOA documentation compliance on all job sites
- Full integration of manufacturer-specific technologies (${getManufacturerTechnology(manufacturer, system)})
- Complete crew certification on HVHZ installation requirements

---

## BLOCK 2: SCOPE - Applicability and Coverage

This SOP applies to:
- All installations of ${manufacturer} ${system.productName} in HVHZ areas
- Miami-Dade County and Broward County roofing projects
- High wind zone installations requiring NOA-approved materials
- Re-roofing and new construction projects using this system

**Geographic Coverage:**
- Miami-Dade County (all areas)
- Broward County (HVHZ zones)
- Monroe County (as applicable)
- Other Florida counties requiring HVHZ compliance

**Project Types:**
- Residential roofing installations
- Commercial low-slope applications (where applicable)
- Storm damage repairs and replacements
- Insurance restoration projects requiring NOA compliance

**Wind Speed Requirements:**
- Design Wind Speed: Up to ${system.windRating}
- Ultimate Wind Speed: Per ASCE 7 calculations
- Pressure Classifications: ASTM D3161 Class F and ASTM D7158 Class H compliance

---

## BLOCK 3: DEFINITIONS - Key Terms and Concepts

**Notice of Acceptance (NOA):** Miami-Dade County approval certifying that ${system.productName} has passed stringent testing and is approved for HVHZ installations per NOA ${system.noaNumber}.

**High Velocity Hurricane Zone (HVHZ):** Geographic areas subject to wind speeds of 120 mph or greater, requiring enhanced installation standards and NOA-approved materials.

**${getManufacturerTechnology(manufacturer, system)}:** ${getTechnologyDefinition(manufacturer, system)}

**HVHZ Installation Pattern:** Enhanced ${system.specifications?.hvhzRequirements?.nailCount || 6}-nail installation pattern required for wind speeds up to ${system.windRating}, exceeding standard 4-nail residential requirements.

**Wind Load Resistance:** System capability to withstand design wind pressures without failure, verified through ASTM D3161 and D7158 testing protocols.

**Solid Wood Deck Requirement:** Minimum ${system.specifications?.deckRequirement || '15/32" OSB or plywood'} sheathing required for proper fastener engagement and wind uplift resistance.

---

## BLOCK 4: RESPONSIBILITIES - Roles and Accountability Matrix

### Project Manager/Supervisor:
- Verify NOA documentation is available on-site before installation begins
- Ensure crew certification for ${manufacturer} ${system.productName} installation
- Coordinate with Miami-Dade Building Department for inspections
- Maintain complete NOA compliance documentation throughout project
- Verify manufacturer labeling requirements are met

### Lead Installer:
- Execute ${getManufacturerTechnology(manufacturer, system)} installation procedures
- Implement ${system.specifications?.hvhzRequirements?.nailCount || 6}-nail HVHZ pattern per NOA requirements
- Verify fastener specifications: ${system.specifications?.nailType || '11-gauge steel roofing nails'}
- Maintain quality control throughout installation process
- Document any deviations from standard installation procedures

### Installation Crew:
- Follow manufacturer-specific installation guidelines for ${system.productName}
- Implement proper ${getManufacturerTechnology(manufacturer, system)} procedures
- Maintain NOA-required installation standards throughout project
- Report any material defects or installation challenges immediately
- Ensure all safety protocols are followed during HVHZ installations

### Quality Control Inspector:
- Verify compliance with NOA ${system.noaNumber} requirements
- Inspect ${getManufacturerTechnology(manufacturer, system)} implementation
- Confirm ${system.specifications?.hvhzRequirements?.nailCount || 6}-nail pattern compliance
- Document installation quality and NOA adherence
- Coordinate with Building Official inspections as required

---

## BLOCK 5: PROCEDURE - Step-by-Step Implementation Guide

### 5.1 Pre-Installation Preparation and NOA Verification

**5.1.1 Documentation Requirements:**
1. Verify NOA ${system.noaNumber} is current and valid through ${system.expirationDate}
2. Confirm ${manufacturer} ${system.productName} shipment matches NOA specifications
3. Verify Miami-Dade Product Control Approved labeling on all materials
4. Obtain complete manufacturer installation instructions
5. Prepare NOA documentation for on-site Building Official access

**5.1.2 Deck and Substrate Preparation:**
1. Inspect deck for ${system.specifications?.deckRequirement || 'solid wood construction minimum 15/32"'}
2. Verify deck meets or exceeds HVHZ structural requirements
3. Confirm proper deck fastening and structural integrity
4. Install approved underlayment system per manufacturer specifications
5. Complete ventilation system design for HVHZ requirements

**5.1.3 Material Verification and Setup:**
1. Verify ${system.productName} bundles display Miami-Dade approval labeling
2. Check manufacturer date codes and storage condition requirements
3. Confirm fastener specifications: ${system.specifications?.nailType || '11-gauge steel roofing nails, minimum 1.25" long'}
4. Set up ${getManufacturerTechnology(manufacturer, system)} installation tools and guides
5. Prepare HVHZ-specific installation equipment and nail guns

### 5.2 ${getManufacturerTechnology(manufacturer, system)} Installation Procedures

**5.2.1 Starter Course Installation:**
1. Install manufacturer-approved starter strip at eave edge
2. Apply ${getManufacturerTechnology(manufacturer, system)} alignment procedures
3. Begin first course with proper overhang (typically 1/4" to 3/8")
4. Implement ${system.specifications?.hvhzRequirements?.nailCount || 6}-nail pattern from start
5. Verify initial course alignment with ${getManufacturerTechnology(manufacturer, system)} guides

**5.2.2 Field Shingle Installation with HVHZ Pattern:**
${generateInstallationSteps(manufacturer, system)}

**5.2.3 Ridge and Hip Installation:**
1. Install hip and ridge shingles with enhanced HVHZ fastening
2. Apply ${getManufacturerTechnology(manufacturer, system)} to ridge installation
3. Use manufacturer-specified ridge fasteners and patterns
4. Maintain proper ridge cap overlap and exposure
5. Verify wind resistance ratings for ridge system components

### 5.3 Quality Control and Final Verification

**5.3.1 Installation Quality Verification:**
1. Inspect ${getManufacturerTechnology(manufacturer, system)} implementation throughout roof
2. Verify ${system.specifications?.hvhzRequirements?.nailCount || 6}-nail pattern compliance on random sample
3. Confirm all fasteners are properly driven (flush, not overdriven)
4. Check manufacturer-specified exposure rates and overlap requirements
5. Verify no staples were used (prohibited in HVHZ installations)

**5.3.2 NOA Compliance Documentation:**
1. Complete NOA ${system.noaNumber} compliance checklist
2. Document ${getManufacturerTechnology(manufacturer, system)} implementation
3. Photograph key installation details for compliance records
4. Verify Miami-Dade labeling requirements are met
5. Prepare documentation package for Building Official inspection

---

## BLOCK 6: DOCUMENTATION - Required Forms and Records

### NOA-Specific Documentation
- **FORM-NOA-${sopNumber}-01:** NOA Verification and Material Certification
- **FORM-NOA-${sopNumber}-02:** ${getManufacturerTechnology(manufacturer, system)} Installation Checklist
- **FORM-NOA-${sopNumber}-03:** HVHZ ${system.specifications?.hvhzRequirements?.nailCount || 6}-Nail Pattern Verification Log
- **FORM-NOA-${sopNumber}-04:** Wind Resistance Testing and Quality Control Report
- **FORM-NOA-${sopNumber}-05:** Miami-Dade Building Official Inspection Readiness

### Manufacturer-Specific Records
- Complete NOA ${system.noaNumber} documentation maintained on-site
- ${manufacturer} installation instructions and technical bulletins
- Material certificates with Miami-Dade approval labeling verification
- ${getManufacturerTechnology(manufacturer, system)} implementation photos and documentation
- Wind resistance performance verification and testing records

### Compliance and Inspection Documentation
- Building permit and inspection scheduling records
- NOA compliance verification with Building Official
- Manufacturer warranty registration and compliance certification
- Weather monitoring and installation condition documentation
- Final inspection approval and certificate of completion

---

## BLOCK 7: QUALITY CONTROL - Standards and Verification

### NOA Compliance Standards
- 100% compliance with NOA ${system.noaNumber} installation requirements
- Zero tolerance for non-NOA approved materials or fasteners
- Complete ${getManufacturerTechnology(manufacturer, system)} implementation verification
- Full documentation of ${system.specifications?.hvhzRequirements?.nailCount || 6}-nail HVHZ pattern compliance
- Wind resistance performance verification up to ${system.windRating}

### Installation Quality Metrics
- Fastener placement accuracy: 100% within manufacturer-specified zones
- ${getManufacturerTechnology(manufacturer, system)} compliance: 100% proper implementation
- Exposure rate consistency: ±1/8" variance maximum from specification
- Material waste factor: <5% for optimal project efficiency
- Rework rate: <1% due to installation quality issues

### Performance Verification Procedures
- Random sampling inspection of ${system.specifications?.hvhzRequirements?.nailCount || 6}-nail pattern (minimum 10% of roof area)
- ${getManufacturerTechnology(manufacturer, system)} functionality verification throughout installation
- Wind uplift resistance spot testing using approved testing equipment
- Photographic documentation of critical installation details
- Third-party inspection coordination for complex or large-scale projects

---

## BLOCK 8: SAFETY CONSIDERATIONS - Risk Management and Mitigation

### HVHZ-Specific Safety Requirements
- Enhanced fall protection for extended installation times with ${system.specifications?.hvhzRequirements?.nailCount || 6}-nail pattern
- Weather monitoring and lightning safety protocols during HVHZ installations
- Proper handling of ${getManufacturerTechnology(manufacturer, system)} components and tools
- Heat stress prevention during extended ${manufacturer} installation procedures
- Tool safety for specialized ${getManufacturerTechnology(manufacturer, system)} equipment

### Wind and Weather Considerations
- Installation suspension for wind speeds exceeding 25 mph
- Lightning safety protocols with immediate work cessation requirements
- Temperature monitoring for proper material handling and installation
- Humidity considerations for ${getManufacturerTechnology(manufacturer, system)} performance
- Emergency procedure implementation for severe weather events

### Material Handling Safety
- Proper lifting techniques for ${system.productName} bundles and materials
- Slip-resistant footwear requirements for enhanced installation procedures
- Eye protection for nail gun operations with ${system.specifications?.hvhzRequirements?.nailCount || 6}-nail pattern
- Respiratory protection during dusty conditions or material cutting
- Ergonomic considerations for extended ${getManufacturerTechnology(manufacturer, system)} installation work

---

## BLOCK 9: TRAINING REQUIREMENTS - Competency Development and Certification

### ${manufacturer} Certification Requirements
- ${manufacturer} ${system.productName} installation certification (required)
- ${getManufacturerTechnology(manufacturer, system)} specialized training completion
- HVHZ installation procedures certification
- NOA compliance and documentation training
- Wind resistance testing and quality control training

### Florida Building Code Training
- HVHZ building code requirements and updates
- Miami-Dade County specific installation standards
- NOA documentation and compliance procedures
- Building Official inspection preparation and coordination
- Florida State roofing contractor continuing education requirements

### Safety and Quality Training
- Fall protection and roofing safety (OSHA 30-Hour minimum)
- ${getManufacturerTechnology(manufacturer, system)} safety procedures
- Lightning and severe weather safety protocols
- Quality control inspection techniques for HVHZ installations
- Customer communication regarding HVHZ and NOA requirements

---

## BLOCK 10: COMPLIANCE REQUIREMENTS - Legal and Regulatory Adherence

### Miami-Dade County NOA Compliance
- NOA ${system.noaNumber} full compliance with all specifications
- Miami-Dade Product Control Approved labeling verification
- Building Official inspection coordination and approval
- Complete NOA documentation maintenance on job site
- Expiration date monitoring and renewal procedures (current through ${system.expirationDate})

### Florida Building Code Requirements
- HVHZ wind load resistance standards compliance
- Structural attachment and fastening requirements
- Ventilation and moisture management standards
- Fire resistance and building performance requirements
- Accessibility and safety code compliance

### Federal and Industry Standards
- ASTM D3161 Class F and ASTM D7158 Class H testing compliance
- OSHA safety standards for roofing operations
- EPA environmental compliance and waste management
- Manufacturer warranty compliance and registration requirements
- Insurance and bonding requirements for HVHZ installations

---

## BLOCK 11: PERFORMANCE METRICS - Measurement and Analysis

### Installation Performance Indicators
- NOA compliance rate: Target 100% for all installations
- ${getManufacturerTechnology(manufacturer, system)} implementation success: 100% proper execution
- Installation time efficiency: Target completion within manufacturer guidelines
- Material waste percentage: <5% waste factor for optimal efficiency
- Rework rate due to installation issues: <1% of total installations

### Quality and Compliance Metrics
- Building Official inspection pass rate: Target 100% first-time approval
- Customer satisfaction with HVHZ installation: >95% satisfaction rating
- Wind damage claims rate: Target zero claims due to installation defects
- Manufacturer warranty claim rate: <0.5% due to installation issues
- ${manufacturer} certification maintenance: 100% crew certification compliance

### Business Performance Indicators
- HVHZ project profitability: Maintain target margins with enhanced procedures
- Market share in Miami-Dade and Broward Counties: Track competitive position
- Repeat business rate for HVHZ installations: >80% customer retention
- Insurance carrier approval rating: Maintain preferred contractor status
- Project timeline adherence: 95% on-time completion rate

---

## BLOCK 12: REFERENCES - Supporting Documentation and Standards

### NOA and Regulatory References
- Miami-Dade County NOA ${system.noaNumber} - ${manufacturer} ${system.productName}
- Florida Building Code Chapter 15 - Roof Assemblies and Rooftop Structures
- ASCE 7 - Minimum Design Loads and Associated Criteria for Buildings
- ASTM D3161 - Standard Test Method for Wind-Resistance of Steep-Slope Roofing Products
- ASTM D7158 - Standard Test Method for Wind-Resistance of Sealed Asphalt Shingles

### Manufacturer Documentation
- ${manufacturer} ${system.productName} Installation Instructions
- ${getManufacturerTechnology(manufacturer, system)} Technical Guide and Specifications
- ${manufacturer} Wind Resistance Performance Data and Testing Results
- ${manufacturer} Warranty Requirements and Registration Procedures
- ${manufacturer} Technical Bulletins and Installation Updates

### Industry Standards and Best Practices
- National Roofing Contractors Association (NRCA) Installation Guidelines
- Roofing Industry Committee on Weather Issues (RICOWI) Recommendations
- International Code Council (ICC) Evaluation Service Reports
- Florida Roofing and Sheet Metal Contractors Association Guidelines
- Insurance Institute for Business & Home Safety (IBHS) Recommendations

---

## BLOCK 13: REVISION HISTORY - Version Control and Change Management

**Version 2025.01 (Current):**
- Initial ${manufacturer} ${system.productName} HVHZ installation SOP
- Integration of NOA ${system.noaNumber} requirements and specifications
- Implementation of ${getManufacturerTechnology(manufacturer, system)} procedures
- HVHZ ${system.specifications?.hvhzRequirements?.nailCount || 6}-nail pattern compliance integration
- Miami-Dade County building code compliance verification

**Planned Updates:**
- Q2 2025: NOA renewal verification and procedure updates
- Q3 2025: ${getManufacturerTechnology(manufacturer, system)} technology enhancements
- Q4 2025: Performance data analysis and optimization procedures
- Q1 2026: Annual comprehensive review and Florida Building Code updates

**Change Management Process:**
- NOA expiration monitoring with 90-day advance renewal procedures
- Manufacturer technical bulletin integration within 30 days of release
- Florida Building Code update implementation within required timeframes
- Continuous improvement based on installation performance data
- Annual review and certification with ${manufacturer} technical representatives

---

## BLOCK 14: APPENDICES - Supporting Information and Cross-References

### Technical Specifications and Data
- ${manufacturer} ${system.productName} detailed specifications and performance data
- ${getManufacturerTechnology(manufacturer, system)} installation diagrams and technical illustrations
- HVHZ ${system.specifications?.hvhzRequirements?.nailCount || 6}-nail pattern layouts and fastener specifications
- Wind load calculations and resistance performance charts
- Material storage and handling requirements for ${system.productName}

### Cross-Reference SOPs
- SOP-1000: Universal Fall Protection System for HVHZ Installations
- SOP-1070: Florida Heat Illness Prevention and Response
- SOP-1071: Hurricane Season Safety Protocols
- SOP-4000: Field Service Management System
- SOP-7000: Quality Management System Implementation

### Forms and Checklists
- NOA ${system.noaNumber} Compliance Verification Checklist
- ${getManufacturerTechnology(manufacturer, system)} Installation Quality Control Form
- HVHZ Installation Documentation Package Template
- Building Official Inspection Preparation Checklist
- Customer Communication Package for HVHZ and NOA Requirements

### Emergency Procedures and Contacts
- Severe weather installation suspension procedures
- ${manufacturer} technical support emergency contact information
- Miami-Dade Building Department inspection coordination contacts
- Insurance carrier notification procedures for HVHZ installations
- Emergency equipment and material supplier contact information

---

**DOCUMENT CLASSIFICATION:** TECHNICAL PROCEDURE - HVHZ INSTALLATION TEAM
**DISTRIBUTION:** HVHZ-CERTIFIED INSTALLATION PERSONNEL AND SUPERVISION
**NEXT REVIEW DATE:** ${getNextReviewDate()}

---

*This SOP ensures proper installation of ${manufacturer} ${system.productName} roofing systems in High Velocity Hurricane Zone areas, maintaining full compliance with NOA ${system.noaNumber} requirements and supporting Florida First Roofing LLC's commitment to superior wind-resistant roofing installations.*`;
}

// Helper functions for content generation
function generateSOPNumber(manufacturer, systemKey) {
  const mfgCode = manufacturer.substring(0, 3).toUpperCase();
  const sysCode = systemKey.substring(0, 3).toUpperCase();
  return `${mfgCode}-${sysCode}-HVHZ`;
}

function getManufacturerTechnology(manufacturer, system) {
  const technologies = {
    'GAF': 'LayerLock Technology',
    'Owens Corning': 'SureNail Technology',
    'CertainTeed': 'NailTrak Technology',
    'Atlas Roofing': 'Scotchgard Technology',
    'Malarkey': 'NEX Polymer Technology',
    'Gulf Coast Supply': 'Concealed Clip Fastening System',
    'Tri County Metals': 'Snap-Lock Mechanical Seaming',
    'Carlisle': 'Sure-Weld TPO Membrane System',
    'Versico': 'VersiWeld TPO Technology',
    'Firestone': 'RubberGard EPDM System',
    'Eagle Roofing Tile': 'Hurricane-Resistant Tile System',
    'Bermuda Roof Tile': 'Hurricane Engineering Technology',
    'Soprema': 'SBS Modified Bitumen Technology'
  };
  return technologies[manufacturer] || 'Advanced Installation Technology';
}

function getTechnologyDefinition(manufacturer, system) {
  const definitions = {
    'GAF': 'Mechanical attachment system that creates a strong bond between shingle layers for enhanced wind resistance.',
    'Owens Corning': 'Patented woven fabric strip integrated into shingles that provides superior grip and enhanced nail-holding power.',
    'CertainTeed': 'Precision nailing zone guidance system with defined lines for optimal fastener placement and wind resistance.',
    'Atlas Roofing': 'Advanced polymer coating technology that provides enhanced weather resistance and durability.',
    'Malarkey': 'Revolutionary polymer-modified shingle technology that enhances flexibility and impact resistance.',
    'Gulf Coast Supply': 'Concealed clip fastening system with thermal movement accommodation for superior metal panel attachment.',
    'Tri County Metals': 'Mechanical snap-lock seaming system providing weathertight panel connections with thermal expansion capability.',
    'Carlisle': 'Hot-air welded TPO membrane system with enhanced fastening patterns for HVHZ wind resistance.',
    'Versico': 'Advanced TPO membrane technology with VersiFlex enhanced flexibility and seam strength.',
    'Firestone': 'EPDM membrane system with superior weather resistance and proven long-term performance.',
    'Eagle Roofing Tile': 'Concrete tile system engineered specifically for hurricane-force wind resistance and structural load distribution.',
    'Bermuda Roof Tile': 'Clay tile technology specifically engineered for extreme wind conditions and hurricane resistance.',
    'Soprema': 'SBS modified bitumen technology providing superior flexibility, adhesion, and weather resistance.'
  };
  return definitions[manufacturer] || 'Enhanced installation technology for superior performance and wind resistance.';
}

function generateInstallationSteps(manufacturer, system) {
  const category = system.category?.toLowerCase() || '';

  // Material-specific installation procedures
  if (category.includes('metal')) {
    return generateMetalInstallationSteps(system, manufacturer);
  } else if (category.includes('tpo') || category.includes('epdm') || category.includes('single-ply')) {
    return generateSinglePlyInstallationSteps(system, manufacturer);
  } else if (category.includes('tile')) {
    return generateTileInstallationSteps(system, manufacturer);
  } else if (category.includes('modified bitumen')) {
    return generateModifiedBitumenInstallationSteps(system, manufacturer);
  } else {
    return generateShingleInstallationSteps(system, manufacturer);
  }
}

function generateMetalInstallationSteps(system, manufacturer) {
  return `1. Install structural clips at ${system.specifications?.hvhzRequirements?.clipSpacing || '12" maximum'} spacing per HVHZ requirements
2. Position ${system.specifications?.panelWidth || '16"'} panels with proper thermal expansion allowance
3. Engage mechanical seaming system per manufacturer specifications
4. Verify ${system.specifications?.seamHeight || '1.5"'} seam height for proper weather sealing
5. Install concealed fastening system to prevent thermal bridging
6. Complete edge securement with HVHZ-approved termination details`;
}

function generateSinglePlyInstallationSteps(system, manufacturer) {
  return `1. Roll out ${system.specifications?.membraneThickness || '60 mil'} membrane allowing for thermal relaxation
2. Position membrane with proper overlap for ${system.specifications?.seamWelding || 'hot-air welded seams'}
3. Secure membrane with enhanced fastening pattern for ${system.specifications?.hvhzRequirements?.windSpeed || 'design wind speeds'}
4. Weld seams using calibrated equipment to manufacturer specifications
5. Test seam strength immediately after welding per ASTM standards
6. Install HVHZ-approved edge terminations and flashing details`;
}

function generateTileInstallationSteps(system, manufacturer) {
  return `1. Install tiles with ${system.specifications?.fastenerCount || '2 fasteners per tile minimum'} per HVHZ requirements
2. Maintain ${system.specifications?.headlap || '3" minimum'} headlap throughout installation
3. Apply nose fixing for all perimeter and ridge tiles per NOA requirements
4. Use hurricane clips for enhanced wind resistance where specified
5. Verify proper tile engagement and structural load distribution
6. Complete ridge installation with enhanced HVHZ fastening system`;
}

function generateModifiedBitumenInstallationSteps(system, manufacturer) {
  return `1. Apply base sheet with proper substrate preparation and priming
2. Install membrane using approved application method (torch, cold adhesive, or heat welding)
3. Maintain minimum 4" side laps and 6" end laps per manufacturer specifications
4. Roll seams immediately for complete adhesion and weathertightness
5. Install cap sheet with proper granule embedment for UV protection
6. Complete edge terminations and penetration sealing per HVHZ requirements`;
}

function generateShingleInstallationSteps(system, manufacturer) {
  if (manufacturer === 'GAF') {
    return `1. Position shingle with LayerLock Technology activation zones properly aligned
2. Apply ${system.specifications?.hvhzRequirements?.nailCount || 6} nails per manufacturer pattern: 2 nails 1" from each end, 4 nails in field area
3. Drive nails through LayerLock zones for maximum holding power
4. Activate LayerLock adhesive strips through proper installation pressure
5. Maintain 5-5/8" exposure rate with proper side lap requirements
6. Continue installation with stepped pattern for optimal LayerLock engagement`;
  } else if (manufacturer === 'Owens Corning') {
    return `1. Align shingles with SureNail Technology fabric strip properly positioned
2. Install ${system.specifications?.hvhzRequirements?.nailCount || 6} nails through SureNail strip per HVHZ requirements
3. Drive nails through woven fabric for enhanced grip and pull-through resistance
4. Verify SureNail strip integrity and proper nail penetration
5. Maintain manufacturer-specified exposure rate (typically 5-5/8")
6. Continue installation ensuring SureNail strip alignment throughout`;
  } else if (manufacturer === 'CertainTeed') {
    return `1. Use NailTrak guides to position ${system.specifications?.hvhzRequirements?.nailCount || 6} nails per HVHZ pattern
2. Follow three defined nailing lines for optimal fastener placement
3. Apply nails within NailTrak zones for maximum wind resistance
4. Use smaller nailing area for steep-slope applications as needed
5. Maintain proper exposure rate with NailTrak alignment verification
6. Continue installation with NailTrak guidance throughout roof area`;
  } else {
    return `1. Position shingles according to manufacturer installation guides
2. Install ${system.specifications?.hvhzRequirements?.nailCount || 6} nails per HVHZ requirements
3. Drive fasteners per manufacturer specifications and NOA requirements
4. Maintain proper exposure rates and overlap requirements
5. Verify installation quality and manufacturer technology implementation
6. Continue installation pattern throughout roof area`;
  }
}

function getNextReviewDate() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Main generation function
async function generateAllNOASOPs() {
  console.log('🚀 Starting Miami-Dade NOA SOP generation...');

  const baseDir = '/Users/winstonjohnson/Claude Code/florida-first-roofing-accounting/database/sop-content/SOPs/1500-Miami-Dade-NOA-Systems';

  // Create directory if it doesn't exist
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  let totalGenerated = 0;

  for (const [mfgKey, manufacturer] of Object.entries(miamDadeNOACatalog)) {
    console.log(`\n📁 Generating ${manufacturer.manufacturer} NOA SOPs...`);

    for (const [systemKey, system] of Object.entries(manufacturer.systems || {})) {
      const sopContent = generateNOASOPContent(manufacturer.manufacturer, systemKey, system);
      const sopNumber = generateSOPNumber(manufacturer.manufacturer, systemKey);
      const fileName = `SOP-${sopNumber}-${manufacturer.manufacturer.replace(/\s+/g, '-')}-${system.productName.replace(/[®\s\-]/g, '-').replace(/--+/g, '-')}-HVHZ-Installation.md`;
      const filePath = path.join(baseDir, fileName);

      fs.writeFileSync(filePath, sopContent);
      totalGenerated++;

      console.log(`✅ Generated: ${manufacturer.manufacturer} ${system.productName}`);
    }
  }

  console.log(`\n🎉 NOA SOP Generation Complete! Total: ${totalGenerated} SOPs generated`);
  return totalGenerated;
}

// Export for use in other modules
module.exports = {
  generateAllNOASOPs,
  generateNOASOPContent
};

// Run if called directly
if (require.main === module) {
  generateAllNOASOPs().catch(console.error);
}