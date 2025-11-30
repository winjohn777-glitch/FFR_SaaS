/**
 * SOP Content Generation Helper Functions
 * Provides detailed content for each section of the 14-block SOP format
 */

// Helper functions for generating specific SOP content sections

function getDefinitions(categoryCode, title) {
  const definitions = {
    "1000": `**Safety Management System:** The comprehensive framework for identifying, assessing, and controlling workplace hazards to prevent injuries and ensure OSHA compliance in all roofing operations.

**Personal Protective Equipment (PPE):** All safety equipment required for roofing work including fall protection harnesses, hard hats, safety glasses, steel-toed boots, and high-visibility clothing.

**Fall Protection System:** The complete system of equipment and procedures designed to prevent falls from elevated work surfaces including guardrails, safety nets, and personal fall arrest systems.`,

    "2000": `**Enterprise Software System:** The integrated technology platform managing core business functions including customer relationships, financial operations, and project management for optimal business performance.

**System Integration:** The process of connecting disparate software systems to enable seamless data flow and unified business operations across all departments and functions.

**Business Process Automation:** The use of technology to execute recurring business processes with minimal human intervention, improving efficiency and reducing errors.`,

    "3000": `**Information Security Framework:** The comprehensive set of policies, procedures, and technologies designed to protect digital assets and sensitive information from unauthorized access and cyber threats.

**Cybersecurity Incident:** Any event that compromises or potentially compromises the confidentiality, integrity, or availability of information systems or data.

**Access Control:** The security mechanism that restricts user access to systems and data based on role, responsibility, and business need principles.`,

    "4000": `**Field Service Management:** The comprehensive system for coordinating mobile workforce activities, managing customer service delivery, and ensuring quality standards in field operations.

**Mobile Workforce:** Field personnel who perform roofing services at customer locations using mobile technology for communication, documentation, and workflow management.

**Real-Time Coordination:** The immediate communication and data synchronization between field personnel, dispatch, and office operations for optimal service delivery.`,

    "5000": `**Customer Relationship Management (CRM):** The integrated system for managing all customer interactions, sales processes, and service delivery to maximize customer satisfaction and business growth.

**Sales Process Automation:** The systematic approach to managing sales activities from lead generation through contract closure using technology and standardized procedures.

**Customer Experience Management:** The comprehensive strategy for optimizing every customer touchpoint to ensure satisfaction, retention, and referral generation.`,

    "6000": `**Human Resource Management System:** The comprehensive platform for managing all aspects of employee lifecycle from recruitment through separation, ensuring compliance and optimal workforce development.

**Employee Development Program:** The structured approach to enhancing employee skills, knowledge, and capabilities through training, mentoring, and professional growth opportunities.

**Performance Management System:** The systematic process for setting expectations, monitoring progress, and evaluating employee performance to support individual and organizational success.`,

    "7000": `**Quality Management System:** The comprehensive framework for ensuring consistent quality in all products, services, and processes while maintaining compliance with regulatory and customer requirements.

**Compliance Management:** The systematic approach to ensuring adherence to all applicable laws, regulations, standards, and internal policies governing business operations.

**Continuous Improvement Process:** The ongoing effort to enhance products, services, and processes through incremental and breakthrough improvements based on data analysis and feedback.`,

    "8000": `**System Integration Architecture:** The technical framework for connecting disparate systems and applications to enable seamless data flow and unified business operations across the enterprise.

**Application Programming Interface (API):** The set of protocols and tools that enable different software applications to communicate and share data in a standardized manner.

**Workflow Automation:** The technology-driven approach to automating business processes and workflows to improve efficiency, reduce errors, and ensure consistency.`,

    "9000": `**Business Intelligence System:** The comprehensive platform for collecting, analyzing, and presenting business data to support informed decision-making and strategic planning.

**Key Performance Indicator (KPI):** The measurable values that demonstrate how effectively an organization is achieving key business objectives and operational goals.

**Data Analytics Framework:** The systematic approach to examining data sets to draw conclusions about the information they contain using specialized software and statistical methods.`
  };

  return definitions[categoryCode] || `**${title}:** The systematic approach to implementing and managing ${title.toLowerCase()} procedures for optimal operational effectiveness and compliance with Florida First Roofing LLC standards.`;
}

function getResponsibilities(categoryCode, approver) {
  const responsibilities = {
    "1000": `### Safety Manager:
- Overall safety program oversight and implementation
- OSHA compliance verification and reporting
- Safety training coordination and certification tracking
- Incident investigation and corrective action implementation
- Emergency response coordination and management

### Field Supervisors:
- Daily safety compliance verification and enforcement
- Crew safety training and competency assessment
- PPE inspection and maintenance oversight
- Hazard identification and risk mitigation
- Safety documentation and reporting

### All Employees:
- Personal safety responsibility and PPE compliance
- Hazard recognition and reporting
- Safety procedure adherence and implementation
- Emergency response participation and cooperation
- Continuous safety improvement contribution`,

    "2000": `### IT Administrator:
- System configuration, maintenance, and optimization
- User access management and security implementation
- Data backup and recovery procedures
- System integration and performance monitoring
- Technical support and troubleshooting

### Department Managers:
- User training and adoption oversight
- Process optimization and workflow management
- Data quality management and verification
- Performance monitoring and reporting
- Cross-departmental coordination

### System Users:
- Proper system usage and data entry
- Security protocol compliance
- Process adherence and documentation
- Issue reporting and feedback provision
- Continuous improvement participation`,

    "4000": `### Operations Manager:
- Field operations oversight and coordination
- Resource allocation and scheduling management
- Performance monitoring and quality assurance
- Customer satisfaction and service delivery
- Team development and training coordination

### Field Supervisors:
- Daily operations management and crew coordination
- Quality control and safety compliance
- Customer communication and relationship management
- Equipment and material management
- Performance reporting and documentation

### Field Technicians:
- Service delivery and customer interaction
- Quality standards adherence and verification
- Safety protocol compliance
- Equipment operation and maintenance
- Documentation and reporting completion`
  };

  return responsibilities[categoryCode] || `### ${approver}:
- Overall procedure oversight and implementation
- Compliance verification and performance monitoring
- Training coordination and competency assessment
- Process improvement and optimization
- Team coordination and communication

### Department Personnel:
- Procedure implementation and adherence
- Quality standards maintenance
- Documentation and reporting completion
- Issue identification and resolution
- Continuous improvement participation`;
}

function getProcedureSteps(categoryCode, title) {
  const procedures = {
    "1000": `### 5.1 Pre-Work Safety Assessment
1. Conduct comprehensive site safety evaluation
2. Identify potential hazards and risk factors
3. Implement appropriate safety controls and barriers
4. Verify all personnel have required PPE
5. Establish emergency communication procedures

### 5.2 Equipment Setup and Inspection
1. Inspect all safety equipment and PPE
2. Set up fall protection systems and barriers
3. Test communication devices and emergency equipment
4. Verify weather conditions and safety parameters
5. Document all safety preparations and inspections

### 5.3 Work Execution and Monitoring
1. Maintain continuous safety awareness and vigilance
2. Monitor weather conditions and environmental factors
3. Conduct regular safety checks and equipment inspections
4. Ensure proper PPE usage and safety compliance
5. Document any incidents or safety concerns immediately`,

    "2000": `### 5.1 System Configuration and Setup
1. Install and configure software platform
2. Establish user accounts and access permissions
3. Configure system settings and parameters
4. Test system functionality and integration
5. Document configuration and setup procedures

### 5.2 User Training and Adoption
1. Develop training materials and documentation
2. Conduct user training sessions and workshops
3. Provide hands-on practice and support
4. Assess user competency and certification
5. Establish ongoing support and assistance

### 5.3 Operations and Maintenance
1. Monitor system performance and usage
2. Conduct regular maintenance and updates
3. Manage user support and troubleshooting
4. Perform data backup and security procedures
5. Generate reports and performance analytics`,

    "4000": `### 5.1 Service Request Processing
1. Receive and evaluate customer service requests
2. Assign appropriate personnel and resources
3. Schedule service delivery and coordinate logistics
4. Communicate with customer regarding expectations
5. Prepare necessary equipment and materials

### 5.2 Field Service Delivery
1. Travel to customer location safely and efficiently
2. Conduct service delivery according to standards
3. Maintain communication with dispatch and management
4. Document service activities and customer interaction
5. Ensure customer satisfaction and quality completion

### 5.3 Service Completion and Follow-up
1. Complete all documentation and reporting
2. Process billing and payment procedures
3. Conduct customer satisfaction verification
4. Schedule any necessary follow-up activities
5. Update systems and close service orders`
  };

  return procedures[categoryCode] || `### 5.1 Planning and Preparation
1. Review requirements and specifications
2. Gather necessary resources and materials
3. Coordinate with relevant personnel and departments
4. Establish timeline and milestones
5. Document planning decisions and preparations

### 5.2 Implementation and Execution
1. Execute procedures according to established standards
2. Monitor progress and quality continuously
3. Maintain documentation and communication
4. Address issues and obstacles promptly
5. Ensure compliance with all requirements

### 5.3 Completion and Verification
1. Verify completion against requirements
2. Conduct quality control and testing
3. Document results and outcomes
4. Obtain necessary approvals and sign-offs
5. Archive documentation and update systems`;
}

function getDocumentation(sopNumber) {
  return `### Required Forms and Records
- **FORM-${sopNumber}-01:** Procedure Initiation and Planning Checklist
- **FORM-${sopNumber}-02:** Implementation Progress Tracking Log
- **FORM-${sopNumber}-03:** Quality Control and Verification Report
- **FORM-${sopNumber}-04:** Completion Documentation and Sign-off
- **FORM-${sopNumber}-05:** Performance Metrics and Analysis Report

### Documentation Requirements
- All activities must be documented in real-time
- Forms must be completed accurately and completely
- Electronic records must be backed up and secured
- Physical documents must be filed according to retention policies
- Access to documentation must be controlled and logged`;
}

function getQualityControl(categoryCode) {
  const quality = {
    "1000": `### Safety Performance Standards
- Zero preventable injuries or incidents
- 100% PPE compliance verification
- 95% minimum safety training completion rate
- Monthly safety audits with corrective actions
- Immediate reporting of all safety concerns

### Verification Procedures
- Daily safety inspections and checklists
- Weekly safety performance reviews
- Monthly comprehensive safety audits
- Quarterly safety training assessments
- Annual safety program evaluation`,

    "2000": `### System Performance Standards
- 99.9% system uptime and availability
- <2 second response time for standard operations
- 98% user satisfaction rating
- Zero data loss or corruption incidents
- 95% user adoption and utilization rate

### Quality Verification
- Daily system performance monitoring
- Weekly user feedback collection and analysis
- Monthly system health assessments
- Quarterly user satisfaction surveys
- Annual system performance review`,

    "4000": `### Service Quality Standards
- 95% on-time service delivery
- 4.8/5 customer satisfaction rating
- 98% first-time completion rate
- Zero safety incidents during service
- 100% documentation completion

### Quality Monitoring
- Real-time service tracking and monitoring
- Daily performance metrics review
- Weekly customer feedback analysis
- Monthly quality control audits
- Quarterly service improvement planning`
  };

  return quality[categoryCode] || `### Performance Standards
- 95% compliance with established procedures
- 98% accuracy in documentation and reporting
- 90% efficiency improvement over baseline
- Zero critical errors or omissions
- 100% completion within specified timeframes

### Quality Verification
- Regular performance monitoring and assessment
- Periodic audits and compliance verification
- Continuous feedback collection and analysis
- Monthly performance review and improvement
- Annual procedure effectiveness evaluation`;
}

function getSafetyConsiderations(categoryCode, oshaRequired) {
  let safety = `### General Safety Requirements
- All personnel must follow established safety protocols
- Personal protective equipment must be worn as required
- Safety hazards must be identified and mitigated immediately
- Emergency procedures must be understood and accessible
- Incident reporting must be completed promptly and accurately`;

  if (oshaRequired) {
    safety += `

### OSHA Compliance Requirements
- Compliance with applicable OSHA 29 CFR 1926 standards
- Required safety training and certification completion
- Proper use and maintenance of safety equipment
- Hazard communication and safety data sheet management
- Regular safety inspections and documentation`;
  }

  const categorySpecific = {
    "1000": `

### Roofing-Specific Safety Risks
- Fall hazards from elevated work surfaces
- Electrical hazards from power lines and equipment
- Weather-related hazards including lightning and wind
- Heat stress and dehydration during summer months
- Tool and equipment hazards during operation`,

    "4000": `

### Field Operations Safety Risks
- Vehicle operation and road safety hazards
- Customer site safety and access risks
- Tool and equipment operation hazards
- Weather and environmental exposure risks
- Lone worker safety and communication needs`
  };

  return safety + (categorySpecific[categoryCode] || '');
}

function getTrainingRequirements(categoryCode, oshaRequired) {
  let training = `### Required Training Programs
- Initial procedure training and orientation (4 hours)
- Annual refresher training and updates (2 hours)
- Competency assessment and certification
- Emergency procedure training and drills
- Continuous improvement and feedback training`;

  if (oshaRequired) {
    training += `

### OSHA Training Requirements
- OSHA 10-Hour Construction Safety Training
- Fall protection and ladder safety certification
- Hazard recognition and communication training
- Personal protective equipment training
- Emergency response and first aid training`;
  }

  const categorySpecific = {
    "1000": `

### Safety-Specific Training
- OSHA 30-Hour Construction Safety Training (supervisors)
- Fall protection competent person training
- First aid and CPR certification
- Emergency response and evacuation procedures
- Incident investigation and reporting`,

    "2000": `

### Technical Training Requirements
- Software platform administration (16 hours)
- User training and support procedures (8 hours)
- System integration and troubleshooting (12 hours)
- Data management and security training (8 hours)
- Advanced features and optimization (8 hours)`
  };

  return training + (categorySpecific[categoryCode] || '');
}

function getComplianceDetails(categoryCode, floridaSpecific, oshaRequired) {
  let compliance = `### Federal Regulatory Requirements
- Applicable federal laws and regulations
- Industry standards and best practices
- Environmental protection requirements
- Employment and labor law compliance
- Consumer protection and privacy laws`;

  if (floridaSpecific) {
    compliance += `

### Florida State Requirements
- Florida Building Code compliance and permitting
- State contractor licensing and certification
- Environmental and safety regulations
- Consumer protection and lien law compliance
- Hurricane and weather-related building standards`;
  }

  if (oshaRequired) {
    compliance += `

### OSHA Compliance Requirements
- 29 CFR 1926 Construction Standards compliance
- Required safety training and documentation
- Incident reporting and investigation procedures
- Safety equipment and PPE requirements
- Regular inspections and compliance verification`;
  }

  return compliance;
}

function getPerformanceMetrics(categoryCode) {
  const metrics = {
    "1000": `### Safety Performance Indicators
- Incident rate and severity tracking
- Safety training completion and compliance rates
- PPE usage and compliance verification
- Safety audit scores and corrective actions
- Near-miss reporting and trend analysis`,

    "2000": `### System Performance Metrics
- System uptime and availability percentages
- User adoption and utilization rates
- Response time and performance benchmarks
- Error rates and resolution times
- User satisfaction and feedback scores`,

    "4000": `### Service Performance Indicators
- On-time service delivery percentages
- Customer satisfaction ratings and feedback
- First-time completion and quality rates
- Response time and efficiency metrics
- Cost per service and profitability analysis`
  };

  return metrics[categoryCode] || `### Key Performance Indicators
- Compliance rate with established procedures
- Accuracy and completeness of documentation
- Efficiency and productivity improvements
- Cost-effectiveness and resource utilization
- Customer or stakeholder satisfaction ratings`;
}

function getReferences(categoryCode, oshaRequired) {
  let references = `### Industry Standards and Guidelines
- Relevant industry best practices and standards
- Professional association guidelines and recommendations
- Regulatory agency guidance and publications
- Equipment manufacturer specifications and requirements
- Academic and research publications`;

  if (oshaRequired) {
    references += `

### OSHA Standards and References
- 29 CFR 1926 - Construction Standards
- OSHA Technical Guidelines and Publications
- ANSI Standards for Construction Safety
- NIOSH Criteria Documents and Guidelines
- State OSHA Plan Requirements and Standards`;
  }

  const categorySpecific = {
    "1000": `

### Safety References
- National Institute for Occupational Safety and Health (NIOSH)
- American National Standards Institute (ANSI)
- National Roofing Contractors Association (NRCA) Safety Guidelines
- Florida Safety Standards and Regulations
- Emergency Response and First Aid Guidelines`,

    "2000": `

### Technical References
- Software vendor documentation and best practices
- Industry technology standards and protocols
- Cybersecurity frameworks and guidelines
- Data management and integration standards
- System administration and maintenance guides`
  };

  return references + (categorySpecific[categoryCode] || '');
}

function getAppendices(categoryCode, sopNumber) {
  return `### Supporting Documentation
- Related procedure cross-references and workflow diagrams
- Forms, checklists, and template libraries
- Training materials and certification requirements
- Performance monitoring and reporting templates
- Emergency contact information and escalation procedures

### Cross-Reference SOPs
- SOP-0000: Universal SOP Framework and Master Index
- SOP-0001: 14-Block Template Standards and Requirements
- Related category SOPs and procedures
- Integration points with other business processes
- Emergency and contingency procedure references

### Technical Specifications
- Equipment specifications and requirements
- Software configuration and setup guidelines
- Integration architecture and data flow diagrams
- Performance benchmarks and optimization parameters
- Troubleshooting guides and resolution procedures`;
}

function getClassification(categoryCode) {
  const classifications = {
    "0000": "EXECUTIVE LEVEL - CONFIDENTIAL",
    "1000": "SAFETY CRITICAL - MANDATORY COMPLIANCE",
    "2000": "TECHNICAL PROCEDURE - INTERNAL USE",
    "3000": "SECURITY SENSITIVE - RESTRICTED ACCESS",
    "4000": "OPERATIONAL PROCEDURE - FIELD OPERATIONS",
    "5000": "BUSINESS PROCEDURE - CUSTOMER FACING",
    "6000": "HR PROCEDURE - CONFIDENTIAL",
    "7000": "COMPLIANCE PROCEDURE - AUDIT REQUIRED",
    "8000": "TECHNICAL PROCEDURE - INTEGRATION TEAM",
    "9000": "BUSINESS PROCEDURE - MANAGEMENT REPORTING"
  };
  return classifications[categoryCode] || "STANDARD PROCEDURE - GENERAL USE";
}

function getDistribution(categoryCode) {
  const distributions = {
    "0000": "EXECUTIVE LEADERSHIP AND AUTHORIZED PERSONNEL ONLY",
    "1000": "ALL PERSONNEL - MANDATORY TRAINING REQUIRED",
    "2000": "IT PERSONNEL AND AUTHORIZED SYSTEM USERS",
    "3000": "IT SECURITY TEAM AND AUTHORIZED ADMINISTRATORS",
    "4000": "FIELD OPERATIONS PERSONNEL AND MANAGEMENT",
    "5000": "SALES AND CUSTOMER SERVICE TEAMS",
    "6000": "HR PERSONNEL AND MANAGEMENT TEAM",
    "7000": "QUALITY AND COMPLIANCE PERSONNEL",
    "8000": "IT INTEGRATION TEAM AND SYSTEM ADMINISTRATORS",
    "9000": "MANAGEMENT AND AUTHORIZED REPORT USERS"
  };
  return distributions[categoryCode] || "AUTHORIZED PERSONNEL AS REQUIRED";
}

module.exports = {
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
};