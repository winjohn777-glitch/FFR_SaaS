import React from 'react';
import styled from 'styled-components';
import { SOPDocument } from '../Templates/PrintableDocument';
import { FFR_UNIFIED_BRAND } from '../Shared/UnifiedFFRBranding';
// import { PDFDownloadButton } from '../PDF/FFRPDFGenerator'; // TODO: Enable when PDF generator is fixed

const SOPContainer = styled.div`
  max-width: 8.5in;
  margin: 0 auto;
  padding: 1rem;
`;

const Section = styled.section`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${FFR_UNIFIED_BRAND.colors.primary};
  margin-bottom: 1rem;
  border-bottom: 2px solid ${FFR_UNIFIED_BRAND.colors.lightBlue};
  padding-bottom: 0.5rem;
`;

const StepList = styled.ol`
  list-style: none;
  counter-reset: step-counter;
  padding: 0;

  li {
    counter-increment: step-counter;
    margin-bottom: 1rem;
    position: relative;
    padding-left: 3rem;

    &::before {
      content: counter(step-counter);
      position: absolute;
      left: 0;
      top: 0;
      background: ${FFR_UNIFIED_BRAND.colors.primary};
      color: white;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 0.875rem;
    }
  }
`;

const SafetyAlert = styled.div`
  background: linear-gradient(135deg, #FEF3C7, #FDE68A);
  border: 2px solid #F59E0B;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;

  &::before {
    content: '⚠️';
    font-size: 1.5rem;
    flex-shrink: 0;
  }
`;

const QualityCheckpoint = styled.div`
  background: linear-gradient(135deg, #D1FAE5, #A7F3D0);
  border: 2px solid #059669;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;

  &::before {
    content: '✅';
    font-size: 1.5rem;
    flex-shrink: 0;
  }
`;

const FloridaSpecific = styled.div`
  background: linear-gradient(135deg, #FEE2E2, #FECACA);
  border: 2px solid #DC2626;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;

  &::before {
    content: '🏖️';
    font-size: 1.5rem;
    flex-shrink: 0;
  }
`;

const MaterialsList = styled.ul`
  list-style-type: none;
  padding: 0;

  li {
    padding: 0.5rem 0;
    border-bottom: 1px solid ${FFR_UNIFIED_BRAND.colors.lightBlue};
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:last-child {
      border-bottom: none;
    }
  }
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const ToolItem = styled.div`
  background: ${FFR_UNIFIED_BRAND.colors.lightBlue}20;
  padding: 0.75rem;
  border-radius: 0.375rem;
  border-left: 4px solid ${FFR_UNIFIED_BRAND.colors.primary};
`;

const ComplianceNote = styled.div`
  background: ${FFR_UNIFIED_BRAND.colors.primary}10;
  border: 1px solid ${FFR_UNIFIED_BRAND.colors.primary};
  border-radius: 0.375rem;
  padding: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: ${FFR_UNIFIED_BRAND.colors.darkBlue};
`;

const ActionBar = styled.div`
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
  padding: 1rem;
  background: ${FFR_UNIFIED_BRAND.colors.background};
  border-radius: 0.5rem;
  border: 1px solid ${FFR_UNIFIED_BRAND.colors.border};

  @media print {
    display: none;
  }
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  background: ${FFR_UNIFIED_BRAND.colors.primary};
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${FFR_UNIFIED_BRAND.colors.darkBlue};
  }
`;

const SampleSOP: React.FC = () => {
  return (
    <SOPContainer>
      <ActionBar className="no-print">
        {/* TODO: Re-enable when PDF generator is fixed
        <PDFDownloadButton
          elementId="sop-content"
          filename="SOP-1001-Pre-Job-Safety-Inspection.pdf"
          title="Pre-Job Safety Inspection Checklist"
          subtitle="Standard Operating Procedure"
          documentType="SOP"
          showWatermark={true}
        >
          <ActionButton>Download PDF</ActionButton>
        </PDFDownloadButton>
        */}
        <ActionButton onClick={() => window.print()}>
          Print Document
        </ActionButton>
      </ActionBar>

      <div id="sop-content">
        <SOPDocument
          sopNumber="SOP-1001"
          title="Pre-Job Safety Inspection Checklist"
          version="2.1"
        >
          <Section>
            <SectionTitle>Purpose</SectionTitle>
            <p>
              This Standard Operating Procedure (SOP) establishes mandatory safety inspection requirements
              for all roofing projects performed by Florida First Roofing LLC. This procedure ensures
              compliance with OSHA regulations, Florida Building Code requirements, and industry best
              practices for worker safety and job site preparation.
            </p>
          </Section>

          <Section>
            <SectionTitle>Scope</SectionTitle>
            <p>
              This SOP applies to all roofing projects including residential re-roofs, commercial installations,
              repairs, maintenance, and emergency services throughout Florida. All field supervisors, crew
              leaders, and safety coordinators must follow this procedure before commencing any roofing work.
            </p>
          </Section>

          <FloridaSpecific>
            <div>
              <strong>Florida-Specific Requirements:</strong> This procedure includes additional safety
              considerations for Florida's unique climate conditions including hurricane season preparations,
              heat illness prevention, and wildlife hazard awareness specific to Central Florida operations.
            </div>
          </FloridaSpecific>

          <Section>
            <SectionTitle>Required Materials & Tools</SectionTitle>

            <h4>Safety Equipment:</h4>
            <MaterialsList>
              <li><span>Personal Fall Arrest Systems (PFAS)</span> <strong>Required for all personnel</strong></li>
              <li><span>Hard hats with chin straps</span> <strong>ANSI Z89.1 certified</strong></li>
              <li><span>Safety glasses/goggles</span> <strong>UV protection required</strong></li>
              <li><span>Non-slip work boots</span> <strong>Electrical hazard rated</strong></li>
              <li><span>High-visibility safety vests</span> <strong>Class 2 minimum</strong></li>
            </MaterialsList>

            <h4>Inspection Tools:</h4>
            <ToolsGrid>
              <ToolItem>
                <strong>Digital Camera/Tablet</strong><br />
                Photo documentation
              </ToolItem>
              <ToolItem>
                <strong>Measuring Tape</strong><br />
                25ft minimum
              </ToolItem>
              <ToolItem>
                <strong>Voltage Tester</strong><br />
                Electrical hazard detection
              </ToolItem>
              <ToolItem>
                <strong>Moisture Meter</strong><br />
                Structural integrity check
              </ToolItem>
              <ToolItem>
                <strong>Ladder/Equipment Check Forms</strong><br />
                Equipment certification
              </ToolItem>
              <ToolItem>
                <strong>Weather Monitoring App</strong><br />
                Florida weather tracking
              </ToolItem>
            </ToolsGrid>
          </Section>

          <Section>
            <SectionTitle>Safety Inspection Procedure</SectionTitle>

            <StepList>
              <li>
                <strong>Site Access & Arrival Safety</strong><br />
                Conduct initial site assessment for vehicle parking, equipment staging, and
                emergency access routes. Identify and mark underground utilities using Florida 811
                location services. Document any site-specific hazards or access restrictions.
              </li>

              <li>
                <strong>Weather Condition Evaluation</strong><br />
                Check current weather conditions and 24-hour forecast using approved weather
                monitoring applications. Verify wind speeds are below 25 mph for roofing operations.
                Confirm no precipitation expected during work period.
              </li>

              <li>
                <strong>Structural Assessment</strong><br />
                Inspect roof structure for load-bearing capacity, existing damage, and stability.
                Check for signs of water damage, rot, or pest infestation. Verify structural
                adequacy for crew and material loads using Florida Building Code standards.
              </li>

              <li>
                <strong>Electrical Hazard Identification</strong><br />
                Locate and mark all electrical service lines, overhead wires, and electrical
                equipment within 10 feet of work area. Test for presence of electrical current
                using voltage tester. Establish minimum clearance distances per OSHA 1926.95.
              </li>

              <li>
                <strong>Fall Protection System Setup</strong><br />
                Install and test all fall protection anchor points, guardrails, and safety net
                systems. Verify proper installation of Personal Fall Arrest Systems (PFAS) for
                all crew members. Document anchor point load testing results.
              </li>

              <li>
                <strong>Equipment & Tool Inspection</strong><br />
                Perform daily inspection of all ladders, scaffolding, power tools, and safety
                equipment per manufacturer specifications. Complete equipment check forms and
                tag any defective items for removal from service.
              </li>
            </StepList>

            <SafetyAlert>
              <div>
                <strong>STOP WORK CONDITIONS:</strong> Work must be immediately suspended if any of the
                following conditions are present: wind speeds exceed 25 mph, precipitation begins,
                electrical hazards cannot be controlled, structural integrity is compromised, or
                required safety equipment is not available or functional.
              </div>
            </SafetyAlert>
          </Section>

          <Section>
            <SectionTitle>Quality Control Checkpoints</SectionTitle>

            <QualityCheckpoint>
              <div>
                <strong>Checkpoint 1 - Pre-Work Documentation:</strong><br />
                All safety inspection forms completed and signed by certified supervisor.
                Photo documentation of site conditions, hazards, and safety setup uploaded
                to project management system with timestamp and GPS coordinates.
              </div>
            </QualityCheckpoint>

            <QualityCheckpoint>
              <div>
                <strong>Checkpoint 2 - Crew Safety Briefing:</strong><br />
                Conduct mandatory safety briefing with all crew members covering site-specific
                hazards, emergency procedures, and fall protection requirements. Document
                attendance and understanding verification for all personnel.
              </div>
            </QualityCheckpoint>

            <QualityCheckpoint>
              <div>
                <strong>Checkpoint 3 - Supervisor Final Approval:</strong><br />
                Licensed supervisor must provide written approval before work commencement.
                Verify all safety systems are in place and crew is properly equipped and
                trained for specific project requirements.
              </div>
            </QualityCheckpoint>
          </Section>

          <Section>
            <SectionTitle>Florida-Specific Considerations</SectionTitle>

            <h4>Heat Illness Prevention (April - October):</h4>
            <ul>
              <li>Schedule work during cooler morning hours (6:00 AM - 11:00 AM)</li>
              <li>Implement mandatory hydration breaks every 30 minutes</li>
              <li>Establish shaded rest areas with cooling stations</li>
              <li>Monitor crew for heat exhaustion symptoms</li>
            </ul>

            <h4>Wildlife Hazard Awareness:</h4>
            <ul>
              <li>Inspect for bee/wasp nests, particularly in soffits and attics</li>
              <li>Check for snake presence in yard areas and material storage</li>
              <li>Be aware of fire ant colonies near work areas</li>
              <li>Identify potential nesting birds (protected species considerations)</li>
            </ul>

            <h4>Hurricane Season Protocols (June 1 - November 30):</h4>
            <ul>
              <li>Monitor hurricane tracking systems daily</li>
              <li>Maintain 72-hour work suspension capability</li>
              <li>Secure all materials and equipment against high winds</li>
              <li>Follow emergency evacuation procedures for weather warnings</li>
            </ul>
          </Section>

          <Section>
            <SectionTitle>Documentation Requirements</SectionTitle>

            <h4>Required Forms:</h4>
            <ul>
              <li><strong>FORM-SAF-001:</strong> Daily Safety Inspection Checklist</li>
              <li><strong>FORM-SAF-002:</strong> Equipment Inspection Log</li>
              <li><strong>FORM-SAF-003:</strong> Crew Safety Briefing Record</li>
              <li><strong>FORM-SAF-004:</strong> Hazard Identification Report</li>
              <li><strong>FORM-FL-001:</strong> Florida Weather Monitoring Log</li>
            </ul>

            <h4>Photo Documentation Requirements:</h4>
            <ul>
              <li>Overall site conditions and access points</li>
              <li>Identified hazards and mitigation measures</li>
              <li>Fall protection system installation</li>
              <li>Weather monitoring screenshot with timestamp</li>
              <li>Crew safety briefing attendance</li>
            </ul>
          </Section>

          <Section>
            <SectionTitle>Compliance & Training</SectionTitle>

            <ComplianceNote>
              All personnel performing safety inspections must hold current OSHA 30-Hour Construction
              certification and Florida-specific roofing safety training. Annual recertification
              required. This SOP must be reviewed and updated annually or following any safety incident.
            </ComplianceNote>

            <h4>Training Requirements:</h4>
            <ul>
              <li>OSHA 30-Hour Construction Safety certification</li>
              <li>Fall Protection Competent Person training</li>
              <li>Florida Building Code updates (annual)</li>
              <li>Heat illness prevention training (annual)</li>
              <li>Emergency response procedures (quarterly)</li>
            </ul>
          </Section>

          <Section>
            <SectionTitle>Review & Approval</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
              <div>
                <strong>Prepared by:</strong><br />
                Safety Coordinator<br />
                Date: {new Date().toLocaleDateString()}<br />
                Signature: ________________________
              </div>
              <div>
                <strong>Approved by:</strong><br />
                Operations Manager<br />
                Date: {new Date().toLocaleDateString()}<br />
                Signature: ________________________
              </div>
            </div>
          </Section>
        </SOPDocument>
      </div>
    </SOPContainer>
  );
};

export default SampleSOP;