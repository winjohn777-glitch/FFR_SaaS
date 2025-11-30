import React, { useState } from 'react';
import FFRFormTemplate, {
  FormSection,
  SectionTitle,
  FieldGroup,
  FieldContainer,
  FieldLabel,
  FieldInput,
  FieldTextarea,
  CheckboxGroup,
  CheckboxItem,
  RadioGroup,
  RadioItem,
  SignatureArea,
  DateSignatureRow
} from '../FFRFormTemplate';

interface SafetyInspectionData {
  // Basic Information
  employeeName: string;
  employeeId: string;
  supervisorName: string;
  date: string;
  time: string;
  location: string;
  projectNumber: string;

  // Weather Conditions
  weatherConditions: string;
  windSpeed: string;
  temperature: string;
  visibility: string;

  // PPE Verification
  ppeWorn: string[];
  ppeCondition: string;
  ppeDefects: string;

  // Safety Equipment Check
  fallProtectionInspected: boolean;
  fallProtectionCondition: string;
  laddersInspected: boolean;
  ladderCondition: string;
  scaffoldingInspected: boolean;
  scaffoldingCondition: string;
  toolsInspected: boolean;
  toolsCondition: string;

  // Hazard Assessment
  hazardsIdentified: string[];
  hazardDescription: string;
  safeguardsMeasures: string;
  emergencyProcedures: string;

  // Compliance Verification
  oshaCompliant: string;
  complianceIssues: string;
  correctiveActions: string;

  // Signatures
  employeeSignature: string;
  supervisorSignature: string;
  signatureDate: string;
}

const SafetyInspectionForm: React.FC = () => {
  const [formData, setFormData] = useState<SafetyInspectionData>({
    employeeName: '',
    employeeId: '',
    supervisorName: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    location: '',
    projectNumber: '',
    weatherConditions: '',
    windSpeed: '',
    temperature: '',
    visibility: '',
    ppeWorn: [],
    ppeCondition: '',
    ppeDefects: '',
    fallProtectionInspected: false,
    fallProtectionCondition: '',
    laddersInspected: false,
    ladderCondition: '',
    scaffoldingInspected: false,
    scaffoldingCondition: '',
    toolsInspected: false,
    toolsCondition: '',
    hazardsIdentified: [],
    hazardDescription: '',
    safeguardsMeasures: '',
    emergencyProcedures: '',
    oshaCompliant: '',
    complianceIssues: '',
    correctiveActions: '',
    employeeSignature: '',
    supervisorSignature: '',
    signatureDate: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (field: keyof SafetyInspectionData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field: 'ppeWorn' | 'hazardsIdentified', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const ppeOptions = [
    'Hard Hat',
    'Safety Glasses',
    'Work Gloves',
    'Steel-Toe Boots',
    'Safety Harness',
    'High-Visibility Vest',
    'Hearing Protection',
    'Respirator/Mask'
  ];

  const hazardOptions = [
    'Fall Hazards',
    'Electrical Hazards',
    'Sharp Objects',
    'Heavy Lifting',
    'Chemical Exposure',
    'Hot Surfaces',
    'Unstable Surfaces',
    'Weather-Related Hazards'
  ];

  const weatherOptions = [
    'Clear/Sunny',
    'Partly Cloudy',
    'Overcast',
    'Light Rain',
    'Heavy Rain',
    'Windy',
    'Storm Conditions'
  ];

  return (
    <FFRFormTemplate
      formTitle="Roof Safety Inspection Checklist"
      formCode="SAFETY-001"
      formCategory="safety"
    >
      {/* Basic Information Section */}
      <FormSection>
        <SectionTitle>Basic Information</SectionTitle>
        <FieldGroup>
          <FieldContainer>
            <FieldLabel>Employee Name</FieldLabel>
            <FieldInput
              type="text"
              value={formData.employeeName}
              onChange={(e) => handleInputChange('employeeName', e.target.value)}
              placeholder="Enter employee full name"
            />
          </FieldContainer>
          <FieldContainer>
            <FieldLabel>Employee ID</FieldLabel>
            <FieldInput
              type="text"
              value={formData.employeeId}
              onChange={(e) => handleInputChange('employeeId', e.target.value)}
              placeholder="Enter employee ID"
            />
          </FieldContainer>
          <FieldContainer>
            <FieldLabel>Supervisor Name</FieldLabel>
            <FieldInput
              type="text"
              value={formData.supervisorName}
              onChange={(e) => handleInputChange('supervisorName', e.target.value)}
              placeholder="Enter supervisor name"
            />
          </FieldContainer>
          <FieldContainer>
            <FieldLabel>Inspection Date</FieldLabel>
            <FieldInput
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
            />
          </FieldContainer>
          <FieldContainer>
            <FieldLabel>Time</FieldLabel>
            <FieldInput
              type="time"
              value={formData.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
            />
          </FieldContainer>
          <FieldContainer>
            <FieldLabel>Project/Location</FieldLabel>
            <FieldInput
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Job site address or project location"
            />
          </FieldContainer>
        </FieldGroup>
      </FormSection>

      {/* Weather Conditions Section */}
      <FormSection>
        <SectionTitle>Weather Conditions</SectionTitle>
        <FieldGroup>
          <FieldContainer>
            <FieldLabel>Weather Conditions</FieldLabel>
            <RadioGroup>
              {weatherOptions.map(option => (
                <RadioItem key={option}>
                  <input
                    type="radio"
                    name="weatherConditions"
                    value={option}
                    checked={formData.weatherConditions === option}
                    onChange={(e) => handleInputChange('weatherConditions', e.target.value)}
                  />
                  {option}
                </RadioItem>
              ))}
            </RadioGroup>
          </FieldContainer>
          <FieldContainer>
            <FieldLabel>Wind Speed (mph)</FieldLabel>
            <FieldInput
              type="number"
              value={formData.windSpeed}
              onChange={(e) => handleInputChange('windSpeed', e.target.value)}
              placeholder="0-100"
              min="0"
              max="100"
            />
          </FieldContainer>
          <FieldContainer>
            <FieldLabel>Temperature (°F)</FieldLabel>
            <FieldInput
              type="number"
              value={formData.temperature}
              onChange={(e) => handleInputChange('temperature', e.target.value)}
              placeholder="32-120"
              min="0"
              max="150"
            />
          </FieldContainer>
        </FieldGroup>
      </FormSection>

      {/* PPE Verification Section */}
      <FormSection>
        <SectionTitle>Personal Protective Equipment (PPE) Verification</SectionTitle>
        <FieldContainer>
          <FieldLabel>PPE Being Worn (Check all that apply)</FieldLabel>
          <CheckboxGroup>
            {ppeOptions.map(ppe => (
              <CheckboxItem key={ppe}>
                <input
                  type="checkbox"
                  checked={formData.ppeWorn.includes(ppe)}
                  onChange={(e) => handleCheckboxChange('ppeWorn', ppe, e.target.checked)}
                />
                {ppe}
              </CheckboxItem>
            ))}
          </CheckboxGroup>
        </FieldContainer>

        <FieldGroup>
          <FieldContainer>
            <FieldLabel>PPE Condition Assessment</FieldLabel>
            <RadioGroup>
              <RadioItem>
                <input
                  type="radio"
                  name="ppeCondition"
                  value="excellent"
                  checked={formData.ppeCondition === 'excellent'}
                  onChange={(e) => handleInputChange('ppeCondition', e.target.value)}
                />
                Excellent
              </RadioItem>
              <RadioItem>
                <input
                  type="radio"
                  name="ppeCondition"
                  value="good"
                  checked={formData.ppeCondition === 'good'}
                  onChange={(e) => handleInputChange('ppeCondition', e.target.value)}
                />
                Good
              </RadioItem>
              <RadioItem>
                <input
                  type="radio"
                  name="ppeCondition"
                  value="fair"
                  checked={formData.ppeCondition === 'fair'}
                  onChange={(e) => handleInputChange('ppeCondition', e.target.value)}
                />
                Fair
              </RadioItem>
              <RadioItem>
                <input
                  type="radio"
                  name="ppeCondition"
                  value="needs_replacement"
                  checked={formData.ppeCondition === 'needs_replacement'}
                  onChange={(e) => handleInputChange('ppeCondition', e.target.value)}
                />
                Needs Replacement
              </RadioItem>
            </RadioGroup>
          </FieldContainer>
        </FieldGroup>

        <FieldContainer>
          <FieldLabel>PPE Defects or Issues Noted</FieldLabel>
          <FieldTextarea
            value={formData.ppeDefects}
            onChange={(e) => handleInputChange('ppeDefects', e.target.value)}
            placeholder="Describe any defects, damage, or issues with PPE..."
          />
        </FieldContainer>
      </FormSection>

      {/* Safety Equipment Check Section */}
      <FormSection>
        <SectionTitle>Safety Equipment Inspection</SectionTitle>
        <FieldGroup>
          <FieldContainer>
            <CheckboxItem>
              <input
                type="checkbox"
                checked={formData.fallProtectionInspected}
                onChange={(e) => handleInputChange('fallProtectionInspected', e.target.checked)}
              />
              Fall Protection Equipment Inspected
            </CheckboxItem>
            <FieldInput
              type="text"
              value={formData.fallProtectionCondition}
              onChange={(e) => handleInputChange('fallProtectionCondition', e.target.value)}
              placeholder="Condition notes"
            />
          </FieldContainer>

          <FieldContainer>
            <CheckboxItem>
              <input
                type="checkbox"
                checked={formData.laddersInspected}
                onChange={(e) => handleInputChange('laddersInspected', e.target.checked)}
              />
              Ladders Inspected
            </CheckboxItem>
            <FieldInput
              type="text"
              value={formData.ladderCondition}
              onChange={(e) => handleInputChange('ladderCondition', e.target.value)}
              placeholder="Condition notes"
            />
          </FieldContainer>

          <FieldContainer>
            <CheckboxItem>
              <input
                type="checkbox"
                checked={formData.scaffoldingInspected}
                onChange={(e) => handleInputChange('scaffoldingInspected', e.target.checked)}
              />
              Scaffolding Inspected
            </CheckboxItem>
            <FieldInput
              type="text"
              value={formData.scaffoldingCondition}
              onChange={(e) => handleInputChange('scaffoldingCondition', e.target.value)}
              placeholder="Condition notes"
            />
          </FieldContainer>

          <FieldContainer>
            <CheckboxItem>
              <input
                type="checkbox"
                checked={formData.toolsInspected}
                onChange={(e) => handleInputChange('toolsInspected', e.target.checked)}
              />
              Tools and Equipment Inspected
            </CheckboxItem>
            <FieldInput
              type="text"
              value={formData.toolsCondition}
              onChange={(e) => handleInputChange('toolsCondition', e.target.value)}
              placeholder="Condition notes"
            />
          </FieldContainer>
        </FieldGroup>
      </FormSection>

      {/* Hazard Assessment Section */}
      <FormSection>
        <SectionTitle>Hazard Assessment</SectionTitle>
        <FieldContainer>
          <FieldLabel>Hazards Identified (Check all that apply)</FieldLabel>
          <CheckboxGroup>
            {hazardOptions.map(hazard => (
              <CheckboxItem key={hazard}>
                <input
                  type="checkbox"
                  checked={formData.hazardsIdentified.includes(hazard)}
                  onChange={(e) => handleCheckboxChange('hazardsIdentified', hazard, e.target.checked)}
                />
                {hazard}
              </CheckboxItem>
            ))}
          </CheckboxGroup>
        </FieldContainer>

        <FieldContainer>
          <FieldLabel>Detailed Hazard Description</FieldLabel>
          <FieldTextarea
            value={formData.hazardDescription}
            onChange={(e) => handleInputChange('hazardDescription', e.target.value)}
            placeholder="Describe identified hazards in detail..."
          />
        </FieldContainer>

        <FieldContainer>
          <FieldLabel>Safeguards and Control Measures Implemented</FieldLabel>
          <FieldTextarea
            value={formData.safeguardsMeasures}
            onChange={(e) => handleInputChange('safeguardsMeasures', e.target.value)}
            placeholder="Describe control measures and safeguards put in place..."
          />
        </FieldContainer>
      </FormSection>

      {/* OSHA Compliance Section */}
      <FormSection>
        <SectionTitle>OSHA Compliance Verification</SectionTitle>
        <FieldGroup>
          <FieldContainer>
            <FieldLabel>OSHA Standards Compliance</FieldLabel>
            <RadioGroup>
              <RadioItem>
                <input
                  type="radio"
                  name="oshaCompliant"
                  value="fully_compliant"
                  checked={formData.oshaCompliant === 'fully_compliant'}
                  onChange={(e) => handleInputChange('oshaCompliant', e.target.value)}
                />
                Fully Compliant
              </RadioItem>
              <RadioItem>
                <input
                  type="radio"
                  name="oshaCompliant"
                  value="minor_issues"
                  checked={formData.oshaCompliant === 'minor_issues'}
                  onChange={(e) => handleInputChange('oshaCompliant', e.target.value)}
                />
                Minor Issues Identified
              </RadioItem>
              <RadioItem>
                <input
                  type="radio"
                  name="oshaCompliant"
                  value="major_violations"
                  checked={formData.oshaCompliant === 'major_violations'}
                  onChange={(e) => handleInputChange('oshaCompliant', e.target.value)}
                />
                Major Violations Found
              </RadioItem>
            </RadioGroup>
          </FieldContainer>
        </FieldGroup>

        <FieldContainer>
          <FieldLabel>Compliance Issues Identified</FieldLabel>
          <FieldTextarea
            value={formData.complianceIssues}
            onChange={(e) => handleInputChange('complianceIssues', e.target.value)}
            placeholder="Detail any compliance issues found..."
          />
        </FieldContainer>

        <FieldContainer>
          <FieldLabel>Corrective Actions Required</FieldLabel>
          <FieldTextarea
            value={formData.correctiveActions}
            onChange={(e) => handleInputChange('correctiveActions', e.target.value)}
            placeholder="List corrective actions to be taken..."
          />
        </FieldContainer>
      </FormSection>

      {/* Signatures Section */}
      <FormSection>
        <SectionTitle>Certification and Signatures</SectionTitle>
        <DateSignatureRow>
          <FieldContainer>
            <FieldLabel>Employee Signature</FieldLabel>
            <SignatureArea>
              {formData.employeeSignature ?
                formData.employeeSignature :
                'Click here to sign digitally or print form for manual signature'
              }
            </SignatureArea>
          </FieldContainer>

          <FieldContainer>
            <FieldLabel>Supervisor Signature</FieldLabel>
            <SignatureArea>
              {formData.supervisorSignature ?
                formData.supervisorSignature :
                'Click here to sign digitally or print form for manual signature'
              }
            </SignatureArea>
          </FieldContainer>
        </DateSignatureRow>

        <FieldGroup>
          <FieldContainer>
            <FieldLabel>Signature Date</FieldLabel>
            <FieldInput
              type="date"
              value={formData.signatureDate}
              onChange={(e) => handleInputChange('signatureDate', e.target.value)}
            />
          </FieldContainer>
        </FieldGroup>
      </FormSection>
    </FFRFormTemplate>
  );
};

export default SafetyInspectionForm;