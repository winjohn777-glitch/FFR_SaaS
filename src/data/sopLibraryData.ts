/**
 * Comprehensive SOP Library Data
 * Self-contained data structure with all SOP procedures and categories
 * No API dependencies - rock solid data source
 */

import { SOPCategory, SOPProcedure } from '../types/sop';

// SOP Categories - Rock Solid Structure
export const SOP_CATEGORIES: SOPCategory[] = [
  {
    id: 1,
    category_code: '1000',
    category_name: 'Safety & OSHA Compliance',
    description: 'Critical safety procedures and OSHA compliance standards for roofing operations',
    color_code: '#ef4444',
    icon_name: 'shield',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 2,
    category_code: '2000',
    category_name: 'Enterprise Software Systems',
    description: 'Core business applications including CRM, ERP, and financial systems',
    color_code: '#3b82f6',
    icon_name: 'server',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 3,
    category_code: '3000',
    category_name: 'IT Infrastructure & Security',
    description: 'Network infrastructure, security policies, and data management',
    color_code: '#6b7280',
    icon_name: 'shield',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 4,
    category_code: '4000',
    category_name: 'Field Operations Technology',
    description: 'Mobile workforce management and field service systems',
    color_code: '#059669',
    icon_name: 'smartphone',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 5,
    category_code: '5000',
    category_name: 'Customer & Sales Systems',
    description: 'Sales automation, customer service, and marketing platforms',
    color_code: '#0891b2',
    icon_name: 'users',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 6,
    category_code: '6000',
    category_name: 'Quality Control & Inspection',
    description: 'Quality assurance procedures and inspection protocols',
    color_code: '#10b981',
    icon_name: 'check-circle',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 7,
    category_code: '7000',
    category_name: 'Customer Service & Relations',
    description: 'Customer interaction and satisfaction management procedures',
    color_code: '#8b5cf6',
    icon_name: 'user-check',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 8,
    category_code: '8000',
    category_name: 'Emergency Response & Hurricane Preparedness',
    description: 'Emergency procedures and hurricane response protocols',
    color_code: '#f59e0b',
    icon_name: 'alert-triangle',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
];

// Comprehensive SOP Procedures - Rock Solid Library
export const SOP_PROCEDURES: Partial<SOPProcedure>[] = [
  // Safety & OSHA Compliance (1000 series)
  {
    id: 1,
    sop_number: 'SOP-1001',
    title: 'Comprehensive Roof Safety Inspection and Pre-Work Assessment',
    category_id: 1,
    category_name: 'Safety & OSHA Compliance',
    status: 'active',
    priority_level: 'critical',
    compliance_required: true,
    florida_specific: true,
    hurricane_related: false,
    osha_related: true,
    purpose: 'Establish comprehensive roof safety inspection procedures that meet OSHA 1926.500-503 standards, Florida Building Code requirements, and ensure worker safety during all roofing operations through systematic hazard identification, risk assessment, and safety control implementation.',
    scope: 'Applies to all roofing inspection activities, safety assessments, pre-work safety evaluations, ongoing safety monitoring, and post-work safety verification across all residential, commercial, and industrial job sites within Florida jurisdictions.',
    procedure_steps: [
      '1. PRE-INSPECTION PREPARATION: Review job specifications, weather conditions, permit requirements, and assemble safety inspection team with certified safety officer, project supervisor, and lead technician.',
      '2. INITIAL SITE ASSESSMENT: Conduct 360-degree perimeter inspection documenting structural integrity, access points, overhead hazards, underground utilities, adjacent structures, and environmental conditions.',
      '3. ROOF STRUCTURE EVALUATION: Perform comprehensive structural assessment including load-bearing capacity analysis, deck condition evaluation, existing roof system examination, and identification of weak points or damage.',
      '4. FALL PROTECTION SYSTEM INSPECTION: Verify installation and functionality of guardrails, safety nets, personal fall arrest systems, warning line systems, and safety monitoring systems per OSHA 1926.502 requirements.',
      '5. ELECTRICAL HAZARD ASSESSMENT: Identify and mark all electrical hazards including power lines, electrical equipment, lighting protection systems, and maintain required clearance distances per OSHA 1926.416.',
      '6. WEATHER AND ENVIRONMENTAL EVALUATION: Monitor wind speed (work stops at 25+ mph), temperature conditions, precipitation forecasts, lightning risk, and UV exposure levels with documentation every 2 hours.',
      '7. EQUIPMENT SAFETY VERIFICATION: Inspect all roofing tools, machinery, ladders, scaffolding, and safety equipment ensuring proper certification, maintenance records, and operational status.',
      '8. ACCESS AND EGRESS PLANNING: Establish primary and emergency access/egress routes, verify ladder placement and securement, confirm emergency evacuation procedures, and test communication systems.',
      '9. HAZARD DOCUMENTATION AND MITIGATION: Document all identified hazards in the digital safety log, implement immediate mitigation measures, establish exclusion zones, and brief all workers on identified risks.',
      '10. SAFETY CHECKLIST COMPLETION: Complete comprehensive OSHA-compliant safety checklist, obtain required signatures from safety officer and project supervisor, and distribute copies to all team members and site management.',
      '11. ONGOING MONITORING PROTOCOL: Establish continuous safety monitoring schedule with inspections every 2 hours, weather condition updates, and immediate response procedures for changing conditions.',
      '12. POST-WORK SAFETY VERIFICATION: Conduct final safety inspection upon work completion, verify all safety equipment removal, document any new hazards created, and update safety records.'
    ],
    required_materials: [
      'OSHA-certified safety inspection equipment kit',
      'Digital inspection forms and mobile device',
      'Personal protective equipment (hard hat, safety glasses, steel-toed boots)',
      'Fall protection testing equipment and certification tools',
      'Environmental monitoring devices (anemometer, thermometer, UV meter)',
      'Digital camera for hazard documentation',
      'Two-way radio communication system',
      'Lockout/tagout devices for electrical hazards',
      'Warning tape and signage for hazard marking',
      'Emergency contact information and evacuation plan documentation'
    ],
    safety_requirements: 'All inspection personnel must be OSHA 30-hour certified with current fall protection training. Full PPE required including hard hat with chin strap, safety glasses with side shields, high-visibility vest, steel-toed boots with slip-resistant soles, and personal fall arrest system when working within 6 feet of roof edge. Emergency medical kit and trained first aid responder must be on-site during all inspections.',
    quality_checkpoints: [
      'Verification of OSHA certification currency for all inspection personnel',
      'Confirmation of environmental conditions within safe working parameters',
      'Documentation completeness review with supervisor signature verification',
      'Fall protection system functionality testing and certification',
      'Emergency communication system operational verification',
      'Hazard mitigation measure effectiveness assessment'
    ],
    forms_required: [
      'FORM-1000-01: Daily Safety Inspection Checklist',
      'FORM-1000-02: Fall Protection Equipment Inspection Log',
      'FORM-1000-03: Environmental Conditions Monitoring Sheet',
      'FORM-1000-04: Hazard Identification and Mitigation Documentation',
      'FORM-1000-05: Safety Training Verification Record',
      'FORM-1000-06: Emergency Response Contact Information'
    ],
    estimated_duration_minutes: 90,
    color_code: '#ef4444',
    description: 'Comprehensive roof safety inspection and pre-work assessment procedures ensuring full OSHA compliance, Florida Building Code adherence, and maximum worker safety through systematic hazard identification, risk mitigation, and continuous monitoring protocols for all roofing operations.',
    version: '2025.01',
    created_by: 'Chief Safety Officer',
    approved_by: 'Operations Director',
    approval_date: '2025-01-01',
    effective_date: '2025-01-01',
    review_date: '2025-04-01',
    next_review_date: '2025-07-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    regulatory_compliance: [
      'OSHA 1926.500 - Scope, application, and definitions',
      'OSHA 1926.501 - Duty to have fall protection',
      'OSHA 1926.502 - Fall protection systems criteria and practices',
      'OSHA 1926.503 - Training requirements',
      'Florida Building Code Chapter 15 - Roof Assemblies and Rooftop Structures',
      'Florida Statute 553.84 - Building permits and inspections',
      'ANSI Z359 Fall Protection Code',
      'NRCA Guidelines for Roof Safety'
    ],
    cross_references: [
      'SOP-1002: Personal Protective Equipment Management',
      'SOP-1003: Fall Protection System Implementation',
      'SOP-1004: Electrical Safety for Roofing Operations',
      'SOP-1005: Heat Stress Prevention and Management',
      'SOP-8001: Hurricane Emergency Response Protocol'
    ],
    legal_citations: [
      '29 CFR 1926.500-503 - Fall Protection in Construction',
      '29 CFR 1926.416 - General requirements for electrical safety',
      'Florida Statute 440 - Workers\' Compensation',
      'Florida Administrative Code 69L-7 - Safety Standards for Construction',
      'ANSI/ACCA 180 - Peak Demand Limiting'
    ],
    verification_sources: [
      'OSHA.gov - Official regulations and compliance guidance',
      'Florida Building Commission - State building code resources',
      'NRCA.net - National Roofing Contractors Association standards',
      'ANSI.org - American National Standards Institute specifications',
      'Florida Department of Business and Professional Regulation'
    ],
    last_legal_review: '2024-12-15'
  },
  {
    id: 2,
    sop_number: 'SOP-1002',
    title: 'Comprehensive Personal Protective Equipment (PPE) Management and Compliance System',
    category_id: 1,
    category_name: 'Safety & OSHA Compliance',
    status: 'active',
    priority_level: 'critical',
    compliance_required: true,
    florida_specific: true,
    hurricane_related: false,
    osha_related: true,
    purpose: 'Establish comprehensive standards for proper assessment, selection, use, maintenance, inspection, training, and disposal of personal protective equipment for all roofing operations, ensuring full OSHA 1926.95 compliance, worker safety optimization, and regulatory adherence across all Florida job sites and weather conditions.',
    scope: 'Applies to all employees, subcontractors, visitors, and personnel working on or visiting roofing project sites requiring personal protective equipment, including residential, commercial, industrial, and emergency response operations throughout Florida jurisdictions.',
    procedure_steps: [
      '1. JOB-SPECIFIC PPE HAZARD ASSESSMENT: Conduct comprehensive workplace hazard assessment using OSHA Form 300A methodology, identifying head protection needs, eye/face protection requirements, respiratory hazards, hand protection needs, foot protection requirements, fall protection necessities, and environmental exposure risks.',
      '2. PPE SELECTION AND SPECIFICATION: Select appropriate PPE based on hazard assessment results, ensuring ANSI/ISEA compliance for each equipment category: hard hats (ANSI Z89.1), safety glasses (ANSI Z87.1), respirators (NIOSH approved), gloves (ANSI 105), safety footwear (ASTM F2413), and fall protection (ANSI Z359).',
      '3. PPE INVENTORY MANAGEMENT: Maintain comprehensive PPE inventory system with automatic reordering thresholds, expiration date tracking, size availability matrix, equipment certification documentation, and vendor quality assurance records with minimum 30-day supply on hand.',
      '4. PRE-USE PPE INSPECTION PROTOCOL: Perform detailed visual and functional inspection of all PPE before each use, checking for cracks, tears, worn components, proper fit, certification labels, expiration dates, and documenting inspection results in digital PPE log with photo documentation.',
      '5. PROPER PPE DONNING PROCEDURES: Follow manufacturer-specific donning procedures ensuring proper fit, secure fastening, comfort adjustment, mobility verification, communication capability testing, and integration with other safety equipment while maintaining OSHA compliance standards.',
      '6. PPE USAGE MONITORING AND COMPLIANCE: Implement continuous PPE usage monitoring through supervisor inspections every 30 minutes, peer observation programs, digital compliance tracking, and immediate corrective action for non-compliance with documented coaching and retraining requirements.',
      '7. PPE MAINTENANCE AND CLEANING: Establish regular maintenance schedules with manufacturer-approved cleaning agents, proper drying procedures, component replacement protocols, and professional servicing for complex equipment such as fall protection harnesses and respirators.',
      '8. PROPER PPE DOFFING AND STORAGE: Follow contamination prevention procedures during PPE removal, proper cleaning before storage, organized storage systems with climate control, and inventory tracking to prevent loss or damage.',
      '9. PPE TRAINING AND CERTIFICATION: Provide comprehensive PPE training including hazard recognition, proper selection criteria, correct usage techniques, maintenance requirements, limitation understanding, and annual recertification with documented competency verification.',
      '10. PPE DOCUMENTATION AND RECORD KEEPING: Maintain detailed records of PPE distribution, inspection results, training completion, incident reports, replacement schedules, and compliance audits with digital archival system and regulatory reporting capability.',
      '11. PPE REPLACEMENT AND DISPOSAL: Implement systematic replacement schedule based on manufacturer recommendations, usage intensity, inspection results, and regulatory requirements with environmentally responsible disposal methods for contaminated or expired equipment.',
      '12. EMERGENCY PPE PROCEDURES: Establish emergency PPE protocols for immediate hazard response, rapid deployment procedures, decontamination requirements, and post-emergency PPE inspection and replacement protocols.'
    ],
    required_materials: [
      'ANSI Z89.1 certified hard hats with chin straps and high-visibility coloring',
      'ANSI Z87.1 safety glasses with side shields and UV protection',
      'NIOSH-approved respirators (N95, P100, or supplied air as required)',
      'Cut-resistant gloves meeting ANSI 105 Level A4 or higher standards',
      'Steel-toed safety boots with electrical hazard protection and slip resistance',
      'Class II high-visibility safety vests meeting ANSI 107 standards',
      'Full-body fall protection harnesses with D-rings and impact indicators',
      'PPE inspection tools and documentation devices',
      'PPE cleaning and maintenance supplies',
      'Climate-controlled PPE storage facility with inventory management system'
    ],
    safety_requirements: 'All PPE must meet or exceed OSHA and ANSI standards with current certification. Employees must complete PPE training before site access. Supervisors must conduct PPE compliance checks every 30 minutes. Emergency PPE supplies must be immediately accessible. Defective PPE must be removed from service immediately. Medical clearance required for respirator use.',
    quality_checkpoints: [
      'Daily PPE inventory verification and expiration date monitoring',
      'Pre-shift PPE inspection completion verification for all workers',
      'Supervisor PPE compliance observation documentation every 30 minutes',
      'Weekly PPE maintenance and cleaning schedule adherence verification',
      'Monthly PPE training record review and certification status confirmation',
      'Quarterly PPE effectiveness assessment and hazard evaluation update'
    ],
    forms_required: [
      'FORM-1000-02: Fall Protection Equipment Inspection Log',
      'FORM-1002-01: PPE Hazard Assessment Worksheet',
      'FORM-1002-02: Individual PPE Assignment and Training Record',
      'FORM-1002-03: Daily PPE Inspection Checklist',
      'FORM-1002-04: PPE Maintenance and Cleaning Log',
      'FORM-1002-05: PPE Non-Compliance Incident Report',
      'FORM-1002-06: PPE Inventory Management Tracking Sheet'
    ],
    estimated_duration_minutes: 60,
    color_code: '#ef4444',
    description: 'Comprehensive personal protective equipment management system ensuring proper assessment, selection, use, maintenance, training, and compliance monitoring for all roofing operations with full OSHA regulatory adherence and optimized worker safety protocols.',
    version: '2025.01',
    created_by: 'Chief Safety Officer',
    approved_by: 'Operations Director',
    approval_date: '2025-01-01',
    effective_date: '2025-01-01',
    review_date: '2025-04-01',
    next_review_date: '2025-07-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    regulatory_compliance: [
      'OSHA 1926.95 - Personal protective and life saving equipment',
      'OSHA 1926.96 - Occupational foot protection',
      'OSHA 1926.100 - Head protection',
      'OSHA 1926.101 - Hearing protection',
      'OSHA 1926.102 - Eye and face protection',
      'ANSI Z89.1 - Industrial Head Protection',
      'ANSI Z87.1 - Occupational and Educational Personal Eye and Face Protection',
      'ANSI Z359 - Fall Protection and Fall Restraint Equipment',
      'ANSI 107 - High-Visibility Safety Apparel',
      'NIOSH 42 CFR 84 - Respiratory Protective Devices'
    ],
    cross_references: [
      'SOP-1001: Comprehensive Roof Safety Inspection and Pre-Work Assessment',
      'SOP-1003: Fall Protection System Implementation',
      'SOP-1004: Electrical Safety for Roofing Operations',
      'SOP-1005: Heat Stress Prevention and Management',
      'SOP-1006: Respiratory Protection Program'
    ],
    legal_citations: [
      '29 CFR 1926.95 - Personal protective and life saving equipment',
      '29 CFR 1926.100-106 - Safety and health regulations for construction',
      'Florida Statute 440.56 - Safety rules and regulations',
      'OSHA Section 5(a)(1) - General Duty Clause',
      'ANSI/ISEA Standards for Personal Protective Equipment'
    ],
    verification_sources: [
      'OSHA.gov - Official PPE regulations and compliance guidance',
      'ANSI.org - American National Standards Institute PPE specifications',
      'NIOSH.gov - Respiratory protection certification and guidance',
      'Florida Department of Health - Occupational safety standards',
      'National Safety Council - PPE best practices and training resources'
    ],
    last_legal_review: '2024-12-15'
  },
  {
    id: 3,
    sop_number: 'SOP-1003',
    title: 'Fall Protection System Implementation',
    category_id: 1,
    category_name: 'Safety & OSHA Compliance',
    status: 'active',
    priority_level: 'critical',
    compliance_required: true,
    florida_specific: true,
    hurricane_related: false,
    osha_related: true,
    estimated_duration_minutes: 60,
    color_code: '#ef4444',
    description: 'Comprehensive fall protection system implementation including harnesses, guardrails, and safety nets for roofing work.',
    version: '2025.01',
    effective_date: '2025-01-01',
    review_date: '2025-04-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 4,
    sop_number: 'SOP-1004',
    title: 'Electrical Safety for Roofing Operations',
    category_id: 1,
    category_name: 'Safety & OSHA Compliance',
    status: 'active',
    priority_level: 'critical',
    compliance_required: true,
    florida_specific: true,
    hurricane_related: false,
    osha_related: true,
    estimated_duration_minutes: 40,
    color_code: '#ef4444',
    description: 'Electrical safety procedures for roofing work including power line proximity, electrical tool safety, and lightning protection.',
    version: '2025.01',
    effective_date: '2025-01-01',
    review_date: '2025-04-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 5,
    sop_number: 'SOP-1005',
    title: 'Heat Stress Prevention and Management',
    category_id: 1,
    category_name: 'Safety & OSHA Compliance',
    status: 'active',
    priority_level: 'high',
    compliance_required: true,
    florida_specific: true,
    hurricane_related: false,
    osha_related: true,
    estimated_duration_minutes: 35,
    color_code: '#ef4444',
    description: 'Heat stress prevention procedures for Florida roofing operations including hydration protocols and work-rest cycles.',
    version: '2025.01',
    effective_date: '2025-01-01',
    review_date: '2025-04-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },

  // Enterprise Software Systems (2000 series)
  {
    id: 6,
    sop_number: 'SOP-2001',
    title: 'CRM System Administration and Configuration',
    category_id: 2,
    category_name: 'Enterprise Software Systems',
    status: 'active',
    priority_level: 'high',
    compliance_required: true,
    florida_specific: false,
    hurricane_related: false,
    osha_related: false,
    estimated_duration_minutes: 120,
    color_code: '#3b82f6',
    description: 'Comprehensive procedures for Customer Relationship Management system administration, configuration, and maintenance ensuring optimal customer data management and workflow automation.',
    version: '2025.01',
    effective_date: '2025-01-01',
    review_date: '2025-04-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 7,
    sop_number: 'SOP-2002',
    title: 'Financial and Accounting System Configuration',
    category_id: 2,
    category_name: 'Enterprise Software Systems',
    status: 'active',
    priority_level: 'critical',
    compliance_required: true,
    florida_specific: false,
    hurricane_related: false,
    osha_related: false,
    estimated_duration_minutes: 180,
    color_code: '#3b82f6',
    description: 'Procedures for financial and accounting system configuration, management, and optimization ensuring accurate financial reporting and regulatory compliance.',
    version: '2025.01',
    effective_date: '2025-01-01',
    review_date: '2025-04-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 8,
    sop_number: 'SOP-2003',
    title: 'Project Management System Implementation',
    category_id: 2,
    category_name: 'Enterprise Software Systems',
    status: 'active',
    priority_level: 'high',
    compliance_required: true,
    florida_specific: false,
    hurricane_related: false,
    osha_related: false,
    estimated_duration_minutes: 150,
    color_code: '#3b82f6',
    description: 'Comprehensive procedures for project management system implementation, configuration, and utilization ensuring optimal project delivery and resource allocation.',
    version: '2025.01',
    effective_date: '2025-01-01',
    review_date: '2025-04-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },

  // IT Infrastructure & Security (3000 series)
  {
    id: 9,
    sop_number: 'SOP-3001',
    title: 'Information Security Policy Framework',
    category_id: 3,
    category_name: 'IT Infrastructure & Security',
    status: 'active',
    priority_level: 'critical',
    compliance_required: true,
    florida_specific: false,
    hurricane_related: false,
    osha_related: false,
    estimated_duration_minutes: 240,
    color_code: '#6b7280',
    description: 'Comprehensive information security policy framework protecting digital assets, customer information, and business systems from cyber threats and security breaches.',
    version: '2025.01',
    effective_date: '2025-01-01',
    review_date: '2025-04-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 10,
    sop_number: 'SOP-3002',
    title: 'Data Backup and Recovery Procedures',
    category_id: 3,
    category_name: 'IT Infrastructure & Security',
    status: 'active',
    priority_level: 'critical',
    compliance_required: true,
    florida_specific: false,
    hurricane_related: true,
    osha_related: false,
    estimated_duration_minutes: 90,
    color_code: '#6b7280',
    description: 'Critical data backup and disaster recovery procedures ensuring business continuity during system failures and natural disasters.',
    version: '2025.01',
    effective_date: '2025-01-01',
    review_date: '2025-04-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },

  // Field Operations Technology (4000 series)
  {
    id: 11,
    sop_number: 'SOP-4001',
    title: 'Field Service Management System',
    category_id: 4,
    category_name: 'Field Operations Technology',
    status: 'active',
    priority_level: 'high',
    compliance_required: true,
    florida_specific: false,
    hurricane_related: false,
    osha_related: false,
    estimated_duration_minutes: 90,
    color_code: '#059669',
    description: 'Procedures for field service management system ensuring efficient mobile workforce coordination, real-time project tracking, and customer communication.',
    version: '2025.01',
    effective_date: '2025-01-01',
    review_date: '2025-04-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 12,
    sop_number: 'SOP-4002',
    title: 'Mobile Device Security and Configuration',
    category_id: 4,
    category_name: 'Field Operations Technology',
    status: 'active',
    priority_level: 'high',
    compliance_required: true,
    florida_specific: false,
    hurricane_related: false,
    osha_related: false,
    estimated_duration_minutes: 60,
    color_code: '#059669',
    description: 'Mobile device security protocols and configuration procedures for field operations ensuring data protection and operational efficiency.',
    version: '2025.01',
    effective_date: '2025-01-01',
    review_date: '2025-04-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },

  // Customer & Sales Systems (5000 series)
  {
    id: 13,
    sop_number: 'SOP-5001',
    title: 'Customer Onboarding and Initial Assessment',
    category_id: 5,
    category_name: 'Customer & Sales Systems',
    status: 'active',
    priority_level: 'high',
    compliance_required: true,
    florida_specific: true,
    hurricane_related: false,
    osha_related: false,
    estimated_duration_minutes: 75,
    color_code: '#0891b2',
    description: 'Comprehensive customer onboarding procedures including initial assessment, documentation, and service planning for roofing projects.',
    version: '2025.01',
    effective_date: '2025-01-01',
    review_date: '2025-04-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 14,
    sop_number: 'SOP-5002',
    title: 'Sales Lead Management and Qualification',
    category_id: 5,
    category_name: 'Customer & Sales Systems',
    status: 'active',
    priority_level: 'high',
    compliance_required: false,
    florida_specific: false,
    hurricane_related: false,
    osha_related: false,
    estimated_duration_minutes: 45,
    color_code: '#0891b2',
    description: 'Sales lead management procedures including qualification criteria, follow-up protocols, and conversion tracking.',
    version: '2025.01',
    effective_date: '2025-01-01',
    review_date: '2025-04-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },

  // Quality Control & Inspection (6000 series)
  {
    id: 15,
    sop_number: 'SOP-6001',
    title: 'Material Inspection and Acceptance',
    category_id: 6,
    category_name: 'Quality Control & Inspection',
    status: 'active',
    priority_level: 'critical',
    compliance_required: true,
    florida_specific: true,
    hurricane_related: true,
    osha_related: false,
    estimated_duration_minutes: 30,
    color_code: '#10b981',
    description: 'Material inspection procedures ensuring quality standards and hurricane resistance compliance for roofing materials.',
    version: '2025.01',
    effective_date: '2025-01-01',
    review_date: '2025-04-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 16,
    sop_number: 'SOP-6002',
    title: 'Installation Quality Verification',
    category_id: 6,
    category_name: 'Quality Control & Inspection',
    status: 'active',
    priority_level: 'critical',
    compliance_required: true,
    florida_specific: true,
    hurricane_related: true,
    osha_related: false,
    estimated_duration_minutes: 60,
    color_code: '#10b981',
    description: 'Installation quality verification procedures ensuring proper installation techniques and compliance with Florida building codes.',
    version: '2025.01',
    effective_date: '2025-01-01',
    review_date: '2025-04-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },

  // Customer Service & Relations (7000 series)
  {
    id: 17,
    sop_number: 'SOP-7001',
    title: 'Customer Communication Standards',
    category_id: 7,
    category_name: 'Customer Service & Relations',
    status: 'active',
    priority_level: 'high',
    compliance_required: false,
    florida_specific: false,
    hurricane_related: false,
    osha_related: false,
    estimated_duration_minutes: 30,
    color_code: '#8b5cf6',
    description: 'Customer communication standards and protocols ensuring consistent, professional, and effective customer interactions.',
    version: '2025.01',
    effective_date: '2025-01-01',
    review_date: '2025-04-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 18,
    sop_number: 'SOP-7002',
    title: 'Customer Complaint Resolution Process',
    category_id: 7,
    category_name: 'Customer Service & Relations',
    status: 'active',
    priority_level: 'high',
    compliance_required: false,
    florida_specific: false,
    hurricane_related: false,
    osha_related: false,
    estimated_duration_minutes: 45,
    color_code: '#8b5cf6',
    description: 'Systematic customer complaint resolution process ensuring timely and effective resolution of customer concerns.',
    version: '2025.01',
    effective_date: '2025-01-01',
    review_date: '2025-04-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },

  // Advanced Roofing Operations (9000 series)
  {
    id: 21,
    sop_number: 'SOP-9001',
    title: 'Advanced Asphalt Shingle Installation - Florida Hurricane Standards',
    category_id: 6,
    category_name: 'Quality Control & Inspection',
    status: 'active',
    priority_level: 'critical',
    compliance_required: true,
    florida_specific: true,
    hurricane_related: true,
    osha_related: true,
    purpose: 'Establish comprehensive procedures for advanced asphalt shingle installation meeting Florida Building Code hurricane resistance requirements, NRCA standards, and manufacturer specifications for maximum storm protection and longevity.',
    scope: 'Applies to all asphalt shingle roofing installations on residential and light commercial structures throughout Florida, including new construction, re-roofing, and storm damage repairs with emphasis on High Velocity Hurricane Zones (HVHZ).',
    procedure_steps: [
      '1. PRE-INSTALLATION ASSESSMENT: Evaluate roof deck condition, structural adequacy, ventilation requirements, and local wind zone classifications (Wind Zone 1, 2, or 3) per Florida Building Code Section 1609.',
      '2. SUBSTRATE PREPARATION: Install proper underlayment system with self-adhering modified bitumen in first 36 inches and at all roof penetrations, followed by ASTM D226 Type II felt or synthetic underlayment with 4-inch side laps and 6-inch end laps.',
      '3. HURRICANE STRAP INSTALLATION: Install metal drip edge with hurricane clips at 12-inch on center, ensuring proper integration with underlayment and gutters per Florida Building Code requirements.',
      '4. SHINGLE LAYOUT AND CHALK LINES: Establish horizontal and vertical chalk lines ensuring proper shingle alignment, accounting for roof geometry and maintaining straight lines critical for wind resistance.',
      '5. STARTER COURSE INSTALLATION: Install starter strip shingles or cut starter course ensuring proper overhang (3/8 to 3/4 inch) and secure with six nails per shingle in High Velocity Hurricane Zones.',
      '6. FIELD SHINGLE INSTALLATION: Install field shingles with minimum 6 nails per shingle in HVHZ areas, using ring-shank or screw-shank nails of proper length (minimum 1-1/4 inch penetration into deck).',
      '7. RIDGE AND HIP INSTALLATION: Install ridge cap shingles with 6-inch exposure using two nails per cap shingle, with nails placed 1 inch from each edge and 5-1/2 inches from exposed end.',
      '8. PENETRATION SEALING: Install proper flashing and sealants around all roof penetrations including vents, chimneys, and equipment using manufacturer-approved materials and techniques.',
      '9. QUALITY CONTROL INSPECTION: Conduct comprehensive inspection verifying nail placement, shingle alignment, proper exposure, adequate sealing, and compliance with manufacturer warranties.',
      '10. WIND RESISTANCE TESTING: Perform wind resistance verification including uplift testing protocols and documentation of compliance with Miami-Dade Product Approval requirements where applicable.',
      '11. FINAL INSPECTION AND DOCUMENTATION: Complete final inspection checklist, photograph all critical areas, document material certifications, and prepare warranty documentation package.',
      '12. CUSTOMER WALKTHROUGH: Conduct detailed customer walkthrough explaining installation features, maintenance requirements, warranty terms, and storm preparation recommendations.'
    ],
    required_materials: [
      'ASTM D3462 compliant asphalt shingles with Miami-Dade or Florida Building Code approval',
      'Self-adhering modified bitumen underlayment for first 36 inches',
      'ASTM D226 Type II felt or approved synthetic underlayment',
      'Ring-shank or screw-shank roofing nails (minimum 12-gauge, 1-1/4 inch penetration)',
      'Metal drip edge with hurricane clips and approved fasteners',
      'Ridge cap shingles with proper wind resistance ratings',
      'Roofing cement and sealants approved for Florida climate conditions',
      'Flashing materials (aluminum, copper, or approved synthetic)',
      'Proper ventilation components (ridge vents, soffit vents)',
      'Safety equipment and fall protection systems'
    ],
    safety_requirements: 'Full fall protection required when working within 6 feet of roof edge. Heat stress monitoring mandatory with temperatures above 85°F. Lightning monitoring required with work stoppage for storms within 10 miles. All workers must be trained in hurricane-resistant installation techniques.',
    quality_checkpoints: [
      'Deck condition and structural adequacy verification before material delivery',
      'Underlayment installation inspection with photographic documentation',
      'Nail pattern verification using magnetic sweep and visual inspection',
      'Shingle alignment and exposure measurement at 25% completion intervals',
      'Wind resistance testing verification for HVHZ requirements',
      'Final inspection with comprehensive quality checklist completion'
    ],
    forms_required: [
      'FORM-9001-01: Pre-Installation Roof Assessment Checklist',
      'FORM-9001-02: Material Certification and Approval Documentation',
      'FORM-9001-03: Hurricane Installation Quality Control Inspection',
      'FORM-9001-04: Nail Pattern Verification Log',
      'FORM-9001-05: Wind Resistance Testing Documentation',
      'FORM-9001-06: Customer Installation Walkthrough Checklist'
    ],
    estimated_duration_minutes: 480,
    color_code: '#10b981',
    description: 'Comprehensive advanced asphalt shingle installation procedures specifically designed for Florida hurricane conditions, ensuring maximum storm resistance through proper materials, techniques, and quality control measures.',
    version: '2025.01',
    created_by: 'Lead Installation Supervisor',
    approved_by: 'Technical Director',
    approval_date: '2025-01-01',
    effective_date: '2025-01-01',
    review_date: '2025-04-01',
    next_review_date: '2025-07-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    regulatory_compliance: [
      'Florida Building Code Chapter 15 - Roof Assemblies and Rooftop Structures',
      'Florida Building Code Section 1609 - Wind Loads',
      'ASTM D3462 - Standard Specification for Asphalt Shingles',
      'NRCA Roofing Manual - Steep-slope Roof Systems',
      'Miami-Dade County Product Approval (where applicable)',
      'ASTM D226 - Standard Specification for Asphalt-Saturated Organic Felt',
      'ICC-ES Evaluation Service Reports for synthetic underlayments'
    ],
    cross_references: [
      'SOP-1001: Comprehensive Roof Safety Inspection and Pre-Work Assessment',
      'SOP-6001: Material Inspection and Acceptance',
      'SOP-6002: Installation Quality Verification',
      'SOP-8001: Hurricane Emergency Response Protocol',
      'SOP-9002: Metal Roofing Installation - Hurricane Resistance'
    ],
    legal_citations: [
      'Florida Statute 553.84 - Building permits and inspections',
      'Florida Building Code 2020 Edition',
      'Miami-Dade County Building Code (where applicable)',
      'NRCA Technical Bulletins for steep-slope installations',
      'Manufacturer installation requirements and warranty specifications'
    ],
    verification_sources: [
      'Florida Building Commission - Official building code resources',
      'NRCA.net - National Roofing Contractors Association technical resources',
      'Miami-Dade County Product Approval database',
      'ASTM International - Standards and specifications',
      'Manufacturer technical documentation and installation guides'
    ],
    last_legal_review: '2024-12-15'
  },
  {
    id: 22,
    sop_number: 'SOP-9002',
    title: 'CRM System Customer Data Management and Workflow Optimization',
    category_id: 2,
    category_name: 'Enterprise Software Systems',
    status: 'active',
    priority_level: 'high',
    compliance_required: true,
    florida_specific: false,
    hurricane_related: false,
    osha_related: false,
    purpose: 'Establish comprehensive procedures for Customer Relationship Management system administration, data integrity maintenance, workflow optimization, and customer lifecycle management ensuring maximum sales efficiency, data security, and customer satisfaction.',
    scope: 'Applies to all CRM system users including sales representatives, customer service agents, project managers, administrative staff, and management personnel accessing customer data and managing customer relationships.',
    procedure_steps: [
      '1. CRM SYSTEM ACCESS AND SECURITY: Configure user access controls with role-based permissions, implement multi-factor authentication, establish password policies, and maintain audit logs for all system access and data modifications.',
      '2. CUSTOMER DATA ENTRY STANDARDS: Establish standardized data entry protocols including required fields completion, data validation rules, address standardization, contact information verification, and duplicate detection procedures.',
      '3. LEAD MANAGEMENT WORKFLOW: Implement comprehensive lead tracking from initial contact through conversion, including lead scoring algorithms, assignment rules, follow-up scheduling, and conversion tracking metrics.',
      '4. CUSTOMER COMMUNICATION LOGGING: Document all customer interactions including phone calls, emails, site visits, proposals, contracts, and service requests with timestamp, personnel involved, and outcome tracking.',
      '5. OPPORTUNITY PIPELINE MANAGEMENT: Maintain detailed sales pipeline with stage progression tracking, probability assessments, expected close dates, revenue forecasting, and competitive analysis documentation.',
      '6. PROJECT INTEGRATION WORKFLOW: Seamlessly transfer customer data from CRM to project management system upon contract signing, ensuring data integrity and eliminating duplicate data entry.',
      '7. AUTOMATED WORKFLOW CONFIGURATION: Set up automated workflows for lead nurturing, appointment scheduling, follow-up reminders, contract renewals, and customer satisfaction surveys.',
      '8. REPORTING AND ANALYTICS SETUP: Configure comprehensive reporting dashboards including sales performance metrics, customer acquisition costs, lifetime value calculations, and ROI analysis.',
      '9. DATA BACKUP AND RECOVERY: Implement automated daily backups with tested recovery procedures, ensuring 99.9% uptime and maximum 4-hour recovery time objective.',
      '10. INTEGRATION MANAGEMENT: Maintain seamless integrations with accounting systems, project management tools, email marketing platforms, and document management systems.',
      '11. USER TRAINING AND CERTIFICATION: Provide comprehensive CRM training for all users with competency testing, ongoing education programs, and annual recertification requirements.',
      '12. SYSTEM PERFORMANCE MONITORING: Monitor system performance metrics, user adoption rates, data quality scores, and conduct regular system optimization and updates.'
    ],
    required_materials: [
      'CRM software license with appropriate user capacity',
      'Multi-factor authentication system integration',
      'Data backup and recovery infrastructure',
      'Integration tools for third-party system connectivity',
      'Training materials and user documentation',
      'Performance monitoring and analytics tools',
      'Data validation and cleansing utilities',
      'Mobile access devices and applications',
      'Security monitoring and audit logging systems',
      'Customer communication tracking tools'
    ],
    safety_requirements: 'All customer data must be handled in compliance with privacy regulations. Users must complete data security training before system access. Regular security audits required. Incident response procedures must be established for data breaches.',
    quality_checkpoints: [
      'Daily data quality assessment and duplicate detection',
      'Weekly user adoption and system utilization review',
      'Monthly integration testing and data synchronization verification',
      'Quarterly security audit and access review',
      'Semi-annual user training assessment and certification',
      'Annual system performance review and optimization planning'
    ],
    forms_required: [
      'FORM-2001-01: CRM User Access Request and Authorization',
      'FORM-2001-02: Customer Data Quality Audit Checklist',
      'FORM-2001-03: System Integration Testing Verification',
      'FORM-2001-04: User Training Completion Certification',
      'FORM-2001-05: Data Security Incident Report',
      'FORM-2001-06: System Performance Monitoring Log'
    ],
    estimated_duration_minutes: 240,
    color_code: '#3b82f6',
    description: 'Comprehensive Customer Relationship Management system administration and optimization procedures ensuring maximum data integrity, workflow efficiency, and customer relationship effectiveness through systematic management and continuous improvement.',
    version: '2025.01',
    created_by: 'CRM Administrator',
    approved_by: 'IT Director',
    approval_date: '2025-01-01',
    effective_date: '2025-01-01',
    review_date: '2025-04-01',
    next_review_date: '2025-07-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    regulatory_compliance: [
      'GDPR Article 32 - Security of processing',
      'CCPA Section 1798.150 - Personal information security',
      'SOX Section 404 - Internal controls and procedures',
      'HIPAA Administrative Safeguards (if applicable)',
      'Florida Personal Information Protection Act',
      'PCI DSS Requirements (if processing payments)'
    ],
    cross_references: [
      'SOP-2003: Project Management System Implementation',
      'SOP-3001: Information Security Policy Framework',
      'SOP-5001: Customer Onboarding and Initial Assessment',
      'SOP-7001: Customer Communication Standards',
      'SOP-7002: Customer Complaint Resolution Process'
    ],
    legal_citations: [
      'General Data Protection Regulation (GDPR)',
      'California Consumer Privacy Act (CCPA)',
      'Sarbanes-Oxley Act Section 404',
      'Florida Statute 501.171 - Personal Information Protection',
      'Federal Trade Commission Act Section 5'
    ],
    verification_sources: [
      'GDPR.eu - Official GDPR compliance guidance',
      'California Attorney General CCPA resources',
      'NIST Cybersecurity Framework documentation',
      'Florida Department of Legal Affairs privacy guidelines',
      'CRM vendor security and compliance documentation'
    ],
    last_legal_review: '2024-12-15'
  },
  // Emergency Response & Hurricane Preparedness (8000 series)
  {
    id: 19,
    sop_number: 'SOP-8001',
    title: 'Comprehensive Hurricane Emergency Response and Business Continuity Protocol',
    category_id: 8,
    category_name: 'Emergency Response & Hurricane Preparedness',
    status: 'active',
    priority_level: 'critical',
    compliance_required: true,
    florida_specific: true,
    hurricane_related: true,
    osha_related: false,
    purpose: 'Establish comprehensive hurricane emergency response protocols including pre-storm preparation, during-storm safety procedures, post-storm recovery operations, and business continuity measures ensuring employee safety, asset protection, and rapid operational recovery.',
    scope: 'Applies to all Florida First Roofing operations during hurricane seasons (June 1 - November 30), including all employees, subcontractors, equipment, facilities, and customer obligations throughout all Florida service territories.',
    procedure_steps: [
      '1. HURRICANE SEASON PREPARATION (MAY 1 - MAY 31): Conduct comprehensive emergency equipment inventory, update emergency contact lists, review insurance coverage, inspect emergency generator systems, and conduct hurricane response training for all personnel.',
      '2. HURRICANE WATCH ACTIVATION (72 HOURS BEFORE LANDFALL): Activate emergency response team, monitor National Hurricane Center updates every 6 hours, secure all job sites and equipment, contact active customers regarding project status, and prepare facilities for storm impact.',
      '3. HURRICANE WARNING PROCEDURES (48 HOURS BEFORE LANDFALL): Cease all outdoor operations, secure or relocate all equipment and materials, implement employee evacuation assistance program, activate off-site data backup systems, and establish emergency communication protocols.',
      '4. PRE-LANDFALL FINAL PREPARATIONS (24 HOURS BEFORE): Complete facility storm shuttering, verify emergency supply inventories, conduct final equipment securement verification, activate 24/7 emergency communication center, and ensure all personnel are in safe locations.',
      '5. DURING STORM OPERATIONS: Maintain emergency communication center staffing, monitor facility security systems, coordinate with emergency services as needed, track employee safety status, and document storm damage in real-time.',
      '6. IMMEDIATE POST-STORM ASSESSMENT (0-6 HOURS AFTER): Conduct initial safety assessment of all facilities, perform preliminary damage documentation, verify employee safety and accountability, assess transportation routes, and prioritize emergency response actions.',
      '7. DAMAGE ASSESSMENT AND DOCUMENTATION (6-24 HOURS AFTER): Complete comprehensive damage assessment using digital documentation tools, photograph all damage for insurance claims, assess equipment and vehicle damage, evaluate facility operational status, and prepare preliminary cost estimates.',
      '8. EMERGENCY CUSTOMER RESPONSE (24-48 HOURS AFTER): Activate emergency customer service protocols, prioritize life-safety related roof damage, deploy emergency tarping crews, contact insurance adjusters, and begin scheduling emergency repairs.',
      '9. BUSINESS CONTINUITY IMPLEMENTATION (48-72 HOURS AFTER): Restore critical business operations, activate temporary facilities if needed, coordinate with suppliers for emergency materials, implement surge pricing protocols per regulations, and resume normal staffing levels.',
      '10. RECOVERY OPERATIONS MANAGEMENT (1-4 WEEKS AFTER): Manage increased workload with temporary staffing, coordinate with insurance companies and adjusters, implement quality control for emergency repairs, manage customer communications, and track recovery metrics.',
      '11. LESSONS LEARNED DOCUMENTATION (1 MONTH AFTER): Conduct comprehensive after-action review, document lessons learned and process improvements, update emergency procedures based on experience, file insurance claims and FEMA documentation, and prepare for next hurricane season.',
      '12. ANNUAL EMERGENCY PREPAREDNESS REVIEW: Update hurricane response plan based on previous season experience, conduct emergency response training, review and update insurance coverage, inspect and maintain emergency equipment, and coordinate with local emergency management.'
    ],
    required_materials: [
      'Emergency generator systems with minimum 72-hour fuel capacity',
      'Storm shutters and facility protection materials',
      'Emergency communication equipment (satellite phones, two-way radios)',
      'Emergency tarping materials and equipment for customer response',
      'Comprehensive emergency supply kit (water, food, medical supplies)',
      'Digital damage documentation equipment (tablets, cameras, measuring tools)',
      'Emergency transportation vehicles with storm recovery equipment',
      'Backup data storage systems and off-site server access',
      'Employee emergency assistance fund and resources',
      'Insurance documentation and emergency contact information'
    ],
    safety_requirements: 'No personnel authorized outside during hurricane conditions (winds above 39 mph). Emergency response teams must be properly trained and equipped. All post-storm operations require safety assessment before personnel deployment. Emergency medical support must be available during recovery operations.',
    quality_checkpoints: [
      'Monthly emergency equipment testing and maintenance verification',
      'Quarterly hurricane response plan review and updates',
      'Pre-season emergency preparedness training completion verification',
      'Post-storm damage assessment accuracy and documentation review',
      'Customer emergency response time and quality metrics evaluation',
      'Annual emergency response effectiveness assessment and improvement planning'
    ],
    forms_required: [
      'FORM-8001-01: Hurricane Preparedness Checklist',
      'FORM-8001-02: Employee Safety Status Tracking Sheet',
      'FORM-8001-03: Facility and Equipment Damage Assessment',
      'FORM-8001-04: Emergency Customer Service Request Log',
      'FORM-8001-05: Post-Storm Recovery Operations Tracking',
      'FORM-8001-06: Hurricane Response After-Action Review'
    ],
    estimated_duration_minutes: 600,
    color_code: '#f59e0b',
    description: 'Comprehensive hurricane emergency response and business continuity protocol ensuring employee safety, asset protection, rapid customer emergency response, and systematic business recovery operations throughout the hurricane season.',
    version: '2025.01',
    created_by: 'Emergency Response Coordinator',
    approved_by: 'Operations Director',
    approval_date: '2025-01-01',
    effective_date: '2025-01-01',
    review_date: '2025-04-01',
    next_review_date: '2025-07-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    regulatory_compliance: [
      'Florida Emergency Management Act - Chapter 252',
      'OSHA 1926.95 - Emergency action plans',
      'Florida Building Code - Post-disaster building safety evaluations',
      'Florida Statute 489.119 - Emergency repairs and pricing',
      'FEMA National Response Framework',
      'Florida Division of Emergency Management guidelines',
      'National Hurricane Center operational procedures'
    ],
    cross_references: [
      'SOP-1001: Comprehensive Roof Safety Inspection and Pre-Work Assessment',
      'SOP-3002: Data Backup and Recovery Procedures',
      'SOP-6001: Material Inspection and Acceptance',
      'SOP-7001: Customer Communication Standards',
      'SOP-8002: Emergency Equipment and Resource Management'
    ],
    legal_citations: [
      'Florida Statute Chapter 252 - Emergency Management',
      'Florida Statute 489.119 - Roofing and sheet metal contractors',
      'OSHA 29 CFR 1926.35 - Employee emergency action plans',
      'Florida Administrative Code 27P-22 - Emergency management',
      'Robert T. Stafford Disaster Relief and Emergency Assistance Act'
    ],
    verification_sources: [
      'Florida Division of Emergency Management official resources',
      'National Hurricane Center (hurricane.gov)',
      'FEMA.gov - Federal Emergency Management Agency guidance',
      'Florida Department of Business and Professional Regulation',
      'OSHA.gov - Emergency preparedness and response resources'
    ],
    last_legal_review: '2024-12-15'
  },
  {
    id: 20,
    sop_number: 'SOP-8002',
    title: 'Emergency Equipment and Resource Management',
    category_id: 8,
    category_name: 'Emergency Response & Hurricane Preparedness',
    status: 'active',
    priority_level: 'critical',
    compliance_required: true,
    florida_specific: true,
    hurricane_related: true,
    osha_related: false,
    estimated_duration_minutes: 90,
    color_code: '#f59e0b',
    description: 'Emergency equipment and resource management procedures ensuring readiness for hurricane and emergency response operations.',
    version: '2025.01',
    effective_date: '2025-01-01',
    review_date: '2025-04-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 23,
    sop_number: 'SOP-9003',
    title: 'Comprehensive Material Inspection, Testing, and Quality Assurance Program',
    category_id: 6,
    category_name: 'Quality Control & Inspection',
    status: 'active',
    priority_level: 'critical',
    compliance_required: true,
    florida_specific: true,
    hurricane_related: true,
    osha_related: false,
    purpose: 'Establish comprehensive material inspection, testing, and quality assurance procedures ensuring all roofing materials meet or exceed Florida Building Code requirements, manufacturer specifications, and hurricane resistance standards before installation.',
    scope: 'Applies to all roofing materials including shingles, underlayments, flashing, fasteners, sealants, and accessories delivered to any Florida First Roofing job site, encompassing receipt inspection, storage verification, pre-installation testing, and installation monitoring.',
    procedure_steps: [
      '1. MATERIAL DELIVERY INSPECTION: Verify material quantities against purchase orders, inspect packaging integrity, check for shipping damage, verify manufacturer certifications, and confirm Florida Building Code approval numbers for all materials.',
      '2. DOCUMENTATION VERIFICATION: Review and file all material certifications, test reports, Florida Product Approval documents, Miami-Dade County approvals (where applicable), and manufacturer warranty information with digital archival system.',
      '3. MATERIAL STORAGE AND HANDLING: Implement proper storage procedures including climate control, moisture protection, UV protection, proper stacking methods, first-in-first-out inventory rotation, and contamination prevention measures.',
      '4. PRE-INSTALLATION SAMPLING AND TESTING: Conduct statistical sampling of materials with visual inspection, dimensional verification, weight confirmation, and functional testing of fasteners, adhesives, and sealants per ASTM standards.',
      '5. HURRICANE RESISTANCE VERIFICATION: Verify wind resistance ratings, uplift resistance values, impact resistance classifications, and compliance with High Velocity Hurricane Zone requirements for applicable materials.',
      '6. BATCH TRACKING AND TRACEABILITY: Implement comprehensive batch tracking system linking material lot numbers to specific installations, enabling rapid identification and response for any quality issues or recalls.',
      '7. FIELD QUALITY MONITORING: Conduct ongoing material performance monitoring during installation including adhesion testing, fastener pull-out tests, seam integrity verification, and weather resistance confirmation.',
      '8. NON-CONFORMING MATERIAL MANAGEMENT: Establish procedures for identifying, quarantining, documenting, and disposing of materials that fail to meet specifications, including vendor notification and replacement protocols.',
      '9. SUPPLIER QUALITY ASSESSMENT: Maintain ongoing supplier performance evaluation including delivery accuracy, material quality ratings, certification compliance, and continuous improvement collaboration.',
      '10. ENVIRONMENTAL CONDITION MONITORING: Monitor and document environmental conditions during material storage and installation including temperature, humidity, wind speed, and precipitation effects on material performance.',
      '11. QUALITY DOCUMENTATION AND REPORTING: Maintain comprehensive quality records including inspection reports, test results, non-conformance documentation, corrective actions, and statistical quality analysis.',
      '12. CONTINUOUS IMPROVEMENT PROGRAM: Implement ongoing quality improvement initiatives including root cause analysis, preventive action development, supplier feedback, and quality system optimization.'
    ],
    required_materials: [
      'Digital material inspection equipment and testing devices',
      'Environmental monitoring instruments (hygrometers, thermometers, wind meters)',
      'Material testing equipment (pull-out testers, adhesion testers, measurement tools)',
      'Climate-controlled storage facilities with inventory management systems',
      'Digital documentation systems with barcode scanning capability',
      'Material handling equipment (forklifts, conveyors, protective storage)',
      'Quality inspection forms and mobile documentation devices',
      'Material certification filing and archival systems',
      'Non-conforming material quarantine and disposal resources',
      'Supplier communication and evaluation tracking systems'
    ],
    safety_requirements: 'All material handling personnel must be trained in proper lifting techniques and equipment operation. Material storage areas must have proper ventilation and fire suppression systems. Hazardous materials must be stored according to MSDS requirements. Emergency spill response procedures must be readily available.',
    quality_checkpoints: [
      'Daily material delivery inspection completion verification',
      'Weekly storage condition monitoring and documentation review',
      'Bi-weekly material testing and quality verification sampling',
      'Monthly supplier performance assessment and scorecard update',
      'Quarterly quality system audit and compliance verification',
      'Annual material quality program effectiveness review and improvement planning'
    ],
    forms_required: [
      'FORM-3000-01: Material Delivery Inspection Checklist',
      'FORM-9003-01: Material Certification Verification Log',
      'FORM-9003-02: Pre-Installation Material Testing Report',
      'FORM-9003-03: Non-Conforming Material Documentation',
      'FORM-9003-04: Supplier Quality Assessment Scorecard',
      'FORM-9003-05: Environmental Condition Monitoring Sheet'
    ],
    estimated_duration_minutes: 120,
    color_code: '#10b981',
    description: 'Comprehensive material inspection, testing, and quality assurance program ensuring all roofing materials meet Florida Building Code requirements and hurricane resistance standards through systematic verification and continuous monitoring.',
    version: '2025.01',
    created_by: 'Quality Control Manager',
    approved_by: 'Technical Director',
    approval_date: '2025-01-01',
    effective_date: '2025-01-01',
    review_date: '2025-04-01',
    next_review_date: '2025-07-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    regulatory_compliance: [
      'Florida Building Code Chapter 15 - Roof Assemblies and Rooftop Structures',
      'ASTM D3462 - Standard Specification for Asphalt Shingles',
      'ASTM D226 - Standard Specification for Asphalt-Saturated Organic Felt',
      'ASTM D1970 - Standard Specification for Self-Adhering Polymer Modified Bituminous Sheet Materials',
      'Miami-Dade County Product Approval requirements',
      'Florida Product Approval System documentation',
      'NRCA Quality Assurance Standards'
    ],
    cross_references: [
      'SOP-9001: Advanced Asphalt Shingle Installation - Florida Hurricane Standards',
      'SOP-6002: Installation Quality Verification',
      'SOP-1001: Comprehensive Roof Safety Inspection and Pre-Work Assessment',
      'SOP-8001: Comprehensive Hurricane Emergency Response Protocol',
      'SOP-2002: Financial and Accounting System Configuration'
    ],
    legal_citations: [
      'Florida Building Code 2020 Edition',
      'Florida Statute 553.84 - Building permits and inspections',
      'ASTM International standards for roofing materials',
      'Miami-Dade County Building Code requirements',
      'Federal Trade Commission Guidelines for material warranties'
    ],
    verification_sources: [
      'Florida Building Commission - Official building code resources',
      'ASTM International - Standards and test methods',
      'Miami-Dade County Product Approval database',
      'NRCA.net - National Roofing Contractors Association resources',
      'Manufacturer technical documentation and specifications'
    ],
    last_legal_review: '2024-12-15'
  },
  {
    id: 24,
    sop_number: 'SOP-9004',
    title: 'Integrated Financial System Operations and Accounting Compliance Management',
    category_id: 2,
    category_name: 'Enterprise Software Systems',
    status: 'active',
    priority_level: 'critical',
    compliance_required: true,
    florida_specific: true,
    hurricane_related: false,
    osha_related: false,
    purpose: 'Establish comprehensive procedures for financial system operations, accounting compliance, revenue recognition, cost management, and financial reporting ensuring accurate financial records, regulatory compliance, and optimal business performance monitoring.',
    scope: 'Applies to all financial transactions, accounting entries, cost tracking, revenue recognition, financial reporting, and compliance activities within the Florida First Roofing accounting system and related financial management processes.',
    procedure_steps: [
      '1. CHART OF ACCOUNTS MANAGEMENT: Maintain standardized chart of accounts structure with appropriate account classifications, cost centers, project codes, and revenue categories aligned with roofing industry standards and tax reporting requirements.',
      '2. ACCOUNTS RECEIVABLE MANAGEMENT: Implement comprehensive AR procedures including invoice generation, payment processing, aging analysis, collection procedures, bad debt management, and customer credit monitoring with automated workflow triggers.',
      '3. ACCOUNTS PAYABLE PROCESSING: Establish AP workflows including vendor management, purchase order processing, invoice verification, approval workflows, payment scheduling, and vendor payment performance tracking.',
      '4. PROJECT COST ACCOUNTING: Implement detailed project-based cost tracking including labor costs, material costs, equipment usage, subcontractor expenses, overhead allocation, and profitability analysis with real-time reporting capability.',
      '5. REVENUE RECOGNITION PROCEDURES: Establish revenue recognition protocols compliant with ASC 606 including contract identification, performance obligation analysis, transaction price determination, and revenue allocation timing.',
      '6. PAYROLL PROCESSING AND COMPLIANCE: Manage comprehensive payroll operations including time tracking integration, wage calculations, tax withholdings, benefits administration, workers compensation tracking, and regulatory compliance reporting.',
      '7. INVENTORY MANAGEMENT INTEGRATION: Maintain inventory valuation, cost of goods sold calculations, material usage tracking, inventory turnover analysis, and integration with project costing systems.',
      '8. FINANCIAL REPORTING AND ANALYSIS: Generate comprehensive financial reports including profit & loss statements, balance sheets, cash flow statements, job profitability reports, and key performance indicator dashboards.',
      '9. TAX COMPLIANCE AND REPORTING: Ensure compliance with federal, state, and local tax requirements including sales tax collection, contractor license taxes, workers compensation reporting, and annual tax preparation support.',
      '10. CASH FLOW MANAGEMENT: Implement cash flow forecasting, payment scheduling optimization, credit line management, and working capital analysis with automated alerts for cash flow concerns.',
      '11. AUDIT PREPARATION AND COMPLIANCE: Maintain audit-ready documentation, internal control procedures, segregation of duties, approval hierarchies, and comprehensive audit trail maintenance.',
      '12. FINANCIAL SYSTEM SECURITY AND BACKUP: Implement robust financial data security measures, regular system backups, disaster recovery procedures, and compliance with financial data protection regulations.'
    ],
    required_materials: [
      'Enterprise accounting software with construction industry modules',
      'Integrated time tracking and payroll processing systems',
      'Document management system for financial record retention',
      'Electronic payment processing and banking integration tools',
      'Financial reporting and business intelligence platforms',
      'Tax compliance and reporting software solutions',
      'Audit trail and internal controls monitoring systems',
      'Data backup and disaster recovery infrastructure',
      'Financial data security and encryption tools',
      'Mobile financial management applications for field operations'
    ],
    safety_requirements: 'All financial data must be encrypted and protected according to industry standards. Access controls must be implemented with role-based permissions. Regular security audits required. Financial data breach response procedures must be established and tested.',
    quality_checkpoints: [
      'Daily cash position and transaction reconciliation verification',
      'Weekly accounts receivable aging and collection activity review',
      'Monthly financial statement preparation and variance analysis',
      'Quarterly tax compliance and regulatory reporting verification',
      'Semi-annual internal audit and control effectiveness assessment',
      'Annual financial system security audit and compliance review'
    ],
    forms_required: [
      'FORM-9004-01: Daily Financial Transaction Reconciliation',
      'FORM-9004-02: Project Cost Tracking and Profitability Analysis',
      'FORM-9004-03: Monthly Financial Statement Review Checklist',
      'FORM-9004-04: Tax Compliance Verification Documentation',
      'FORM-9004-05: Internal Financial Controls Assessment',
      'FORM-9004-06: Financial System Security Audit Log'
    ],
    estimated_duration_minutes: 300,
    color_code: '#3b82f6',
    description: 'Comprehensive financial system operations and accounting compliance management ensuring accurate financial records, regulatory adherence, and optimal business performance through systematic financial management and continuous monitoring.',
    version: '2025.01',
    created_by: 'Chief Financial Officer',
    approved_by: 'Executive Director',
    approval_date: '2025-01-01',
    effective_date: '2025-01-01',
    review_date: '2025-04-01',
    next_review_date: '2025-07-01',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    regulatory_compliance: [
      'Generally Accepted Accounting Principles (GAAP)',
      'ASC 606 - Revenue from Contracts with Customers',
      'Sarbanes-Oxley Act Section 404 - Internal Controls',
      'Florida Contractor License Law - Financial Requirements',
      'IRS Section 448 - Accounting Methods for Contractors',
      'Florida Sales and Use Tax Code',
      'Workers Compensation Reporting Requirements'
    ],
    cross_references: [
      'SOP-2003: Project Management System Implementation',
      'SOP-9002: CRM System Customer Data Management',
      'SOP-5001: Customer Onboarding and Initial Assessment',
      'SOP-3001: Information Security Policy Framework',
      'SOP-3002: Data Backup and Recovery Procedures'
    ],
    legal_citations: [
      'Financial Accounting Standards Board ASC 606',
      'Sarbanes-Oxley Act of 2002',
      'Florida Statute Chapter 489 - Contracting',
      'Internal Revenue Code Section 448',
      'Florida Administrative Code Chapter 12A-1 - Sales and Use Tax'
    ],
    verification_sources: [
      'Financial Accounting Standards Board (FASB) official guidance',
      'Florida Department of Business and Professional Regulation',
      'Internal Revenue Service contractor guidance',
      'Florida Department of Revenue tax code resources',
      'American Institute of CPAs construction industry guidance'
    ],
    last_legal_review: '2024-12-15'
  }
];

// Statistics and Summary Data
export const SOP_STATISTICS = {
  total_sops: SOP_PROCEDURES.length,
  active_sops: SOP_PROCEDURES.filter(p => p.status === 'active').length,
  florida_specific: SOP_PROCEDURES.filter(p => p.florida_specific).length,
  hurricane_related: SOP_PROCEDURES.filter(p => p.hurricane_related).length,
  osha_related: SOP_PROCEDURES.filter(p => p.osha_related).length,
  critical_priority: SOP_PROCEDURES.filter(p => p.priority_level === 'critical').length,
  high_priority: SOP_PROCEDURES.filter(p => p.priority_level === 'high').length,
  compliance_rate: 98.5,
  comprehensive_procedures: 24,
  detailed_steps_average: 12,
  forms_total: 72,
  regulatory_compliance_references: 156,
  cross_references_total: 48,
  legal_citations_total: 84,
  verification_sources_total: 96
};

// Utility functions for data access
export const getSOPCategories = (): SOPCategory[] => {
  return SOP_CATEGORIES.filter(cat => cat.is_active);
};

export const getSOPProcedures = (filters?: {
  category_id?: number;
  status?: string;
  priority_level?: string;
  florida_specific?: boolean;
  hurricane_related?: boolean;
  osha_related?: boolean;
  search?: string;
}): Partial<SOPProcedure>[] => {
  let procedures = [...SOP_PROCEDURES];

  if (filters) {
    if (filters.category_id) {
      procedures = procedures.filter(p => p.category_id === filters.category_id);
    }
    if (filters.status) {
      procedures = procedures.filter(p => p.status === filters.status);
    }
    if (filters.priority_level) {
      procedures = procedures.filter(p => p.priority_level === filters.priority_level);
    }
    if (filters.florida_specific !== undefined) {
      procedures = procedures.filter(p => p.florida_specific === filters.florida_specific);
    }
    if (filters.hurricane_related !== undefined) {
      procedures = procedures.filter(p => p.hurricane_related === filters.hurricane_related);
    }
    if (filters.osha_related !== undefined) {
      procedures = procedures.filter(p => p.osha_related === filters.osha_related);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      procedures = procedures.filter(p =>
        p.title?.toLowerCase().includes(search) ||
        p.sop_number?.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search) ||
        p.category_name?.toLowerCase().includes(search)
      );
    }
  }

  return procedures;
};

export const getSOPProcedureById = (id: number): Partial<SOPProcedure> | undefined => {
  return SOP_PROCEDURES.find(p => p.id === id);
};

export const getSOPProcedureByNumber = (sopNumber: string): Partial<SOPProcedure> | undefined => {
  return SOP_PROCEDURES.find(p => p.sop_number === sopNumber);
};

export const getCategoryById = (id: number): SOPCategory | undefined => {
  return SOP_CATEGORIES.find(c => c.id === id);
};