import React from 'react';
import styled from 'styled-components';
import { X, Target, DollarSign, Calendar, User, Building, TrendingUp, Award, AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { Opportunity } from '../../types/crm';

interface OpportunityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity | null;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.md};
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.light};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
`;

const InfoSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const InfoGridThree = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-block;

  ${({ status, theme }) => {
    switch (status) {
      case 'Prospecting':
        return `
          background-color: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
        `;
      case 'Qualification':
        return `
          background-color: #3b82f620;
          color: #3b82f6;
        `;
      case 'Proposal':
        return `
          background-color: #f59e0b20;
          color: #f59e0b;
        `;
      case 'Negotiation':
        return `
          background-color: #8b5cf620;
          color: #8b5cf6;
        `;
      case 'Closed Won':
        return `
          background-color: #10b98120;
          color: #10b981;
        `;
      case 'Closed Lost':
        return `
          background-color: #ef444420;
          color: #ef4444;
        `;
      default:
        return `
          background-color: ${theme.colors.text.light}20;
          color: ${theme.colors.text.secondary};
        `;
    }
  }}
`;

const ProbabilityBar = styled.div`
  width: 100%;
  height: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;
  position: relative;
`;

const ProbabilityFill = styled.div<{ probability: number }>`
  height: 100%;
  width: ${({ probability }) => probability}%;
  background: linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #10b981 100%);
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: width 0.3s ease;
`;

const ProbabilityText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 600;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CompetitorList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const CompetitorChip = styled.span`
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.875rem;
`;

const CommunicationList = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const CommunicationItem = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
`;

const CommunicationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CommunicationType = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.875rem;
`;

const CommunicationDate = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const OpportunityDetailsModal: React.FC<OpportunityDetailsModalProps> = ({
  isOpen,
  onClose,
  opportunity
}) => {
  if (!isOpen || !opportunity) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <img src="/FFR logo 32x32.png" alt="FFR" style={{ height: '24px', marginRight: '8px' }} />
            Opportunity Details
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {/* Basic Information */}
          <InfoSection>
            <SectionTitle>
              <Target size={18} />
              Opportunity Overview
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Opportunity Name</InfoLabel>
                <InfoValue>{opportunity.name}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Stage</InfoLabel>
                <StatusBadge status={opportunity.stage}>{opportunity.stage}</StatusBadge>
              </InfoItem>
            </InfoGrid>
            {opportunity.description && (
              <InfoItem style={{ marginTop: '1rem' }}>
                <InfoLabel>Description</InfoLabel>
                <InfoValue>{opportunity.description}</InfoValue>
              </InfoItem>
            )}
          </InfoSection>

          {/* Financial Information */}
          <InfoSection>
            <SectionTitle>
              <DollarSign size={18} />
              Financial Details
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Estimated Value</InfoLabel>
                <InfoValue style={{ fontSize: '1.25rem', fontWeight: '600', color: '#059669' }}>
                  {formatCurrency(opportunity.estimatedValue)}
                </InfoValue>
              </InfoItem>
              {opportunity.actualValue && (
                <InfoItem>
                  <InfoLabel>Actual Value</InfoLabel>
                  <InfoValue style={{ fontSize: '1.25rem', fontWeight: '600', color: '#059669' }}>
                    {formatCurrency(opportunity.actualValue)}
                  </InfoValue>
                </InfoItem>
              )}
            </InfoGrid>
            <InfoItem style={{ marginTop: '1rem' }}>
              <InfoLabel>Win Probability</InfoLabel>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <ProbabilityBar>
                  <ProbabilityFill probability={opportunity.probability} />
                  <ProbabilityText>{opportunity.probability}%</ProbabilityText>
                </ProbabilityBar>
              </div>
            </InfoItem>
          </InfoSection>

          {/* Project Information */}
          <InfoSection>
            <SectionTitle>
              <Building size={18} />
              Project Information
            </SectionTitle>
            <InfoGridThree>
              <InfoItem>
                <InfoLabel>Project Type</InfoLabel>
                <InfoValue>{opportunity.projectType}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Roofing Material</InfoLabel>
                <InfoValue>{opportunity.roofingMaterial}</InfoValue>
              </InfoItem>
              {opportunity.squareFootage && (
                <InfoItem>
                  <InfoLabel>Square Footage</InfoLabel>
                  <InfoValue>{opportunity.squareFootage.toLocaleString()} sq ft</InfoValue>
                </InfoItem>
              )}
            </InfoGridThree>
          </InfoSection>

          {/* Timeline */}
          <InfoSection>
            <SectionTitle>
              <Calendar size={18} />
              Timeline
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Date Created</InfoLabel>
                <InfoValue>{formatDate(opportunity.dateCreated)}</InfoValue>
              </InfoItem>
              {opportunity.expectedCloseDate && (
                <InfoItem>
                  <InfoLabel>Expected Close Date</InfoLabel>
                  <InfoValue>{formatDate(opportunity.expectedCloseDate)}</InfoValue>
                </InfoItem>
              )}
              {opportunity.estimatedStartDate && (
                <InfoItem>
                  <InfoLabel>Estimated Start Date</InfoLabel>
                  <InfoValue>{formatDate(opportunity.estimatedStartDate)}</InfoValue>
                </InfoItem>
              )}
              {opportunity.estimatedCompletionDate && (
                <InfoItem>
                  <InfoLabel>Estimated Completion</InfoLabel>
                  <InfoValue>{formatDate(opportunity.estimatedCompletionDate)}</InfoValue>
                </InfoItem>
              )}
            </InfoGrid>
            {opportunity.actualStartDate && (
              <InfoGrid style={{ marginTop: '1rem' }}>
                <InfoItem>
                  <InfoLabel>Actual Start Date</InfoLabel>
                  <InfoValue>{formatDate(opportunity.actualStartDate)}</InfoValue>
                </InfoItem>
                {opportunity.actualCompletionDate && (
                  <InfoItem>
                    <InfoLabel>Actual Completion Date</InfoLabel>
                    <InfoValue>{formatDate(opportunity.actualCompletionDate)}</InfoValue>
                  </InfoItem>
                )}
              </InfoGrid>
            )}
          </InfoSection>

          {/* Assignment */}
          <InfoSection>
            <SectionTitle>
              <User size={18} />
              Assignment
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Assigned To</InfoLabel>
                <InfoValue>{opportunity.assignedTo}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </InfoSection>

          {/* Competition & Pricing */}
          {(opportunity.competitors || opportunity.ourProposal || opportunity.competitorPricing) && (
            <InfoSection>
              <SectionTitle>
                <TrendingUp size={18} />
                Competition & Pricing
              </SectionTitle>
              <InfoGrid>
                {opportunity.ourProposal && (
                  <InfoItem>
                    <InfoLabel>Our Proposal</InfoLabel>
                    <InfoValue>{formatCurrency(opportunity.ourProposal)}</InfoValue>
                  </InfoItem>
                )}
              </InfoGrid>
              {opportunity.competitors && opportunity.competitors.length > 0 && (
                <InfoItem style={{ marginTop: '1rem' }}>
                  <InfoLabel>Competitors</InfoLabel>
                  <CompetitorList>
                    {opportunity.competitors.map((competitor, index) => (
                      <CompetitorChip key={index}>{competitor}</CompetitorChip>
                    ))}
                  </CompetitorList>
                </InfoItem>
              )}
              {opportunity.competitorPricing && opportunity.competitorPricing.length > 0 && (
                <InfoItem style={{ marginTop: '1rem' }}>
                  <InfoLabel>Competitor Pricing</InfoLabel>
                  <div style={{ marginTop: '0.5rem' }}>
                    {opportunity.competitorPricing.map((pricing, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                        <span>{pricing.competitor}</span>
                        <span style={{ fontWeight: '600' }}>{formatCurrency(pricing.price)}</span>
                      </div>
                    ))}
                  </div>
                </InfoItem>
              )}
            </InfoSection>
          )}

          {/* Insurance Information */}
          {opportunity.isInsuranceClaim && (
            <InfoSection>
              <SectionTitle>
                <Award size={18} />
                Insurance Claim Information
              </SectionTitle>
              <InfoGridThree>
                <InfoItem>
                  <InfoLabel>Insurance Company</InfoLabel>
                  <InfoValue>{opportunity.insuranceCompany || 'N/A'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Claim Number</InfoLabel>
                  <InfoValue>{opportunity.claimNumber || 'N/A'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Adjuster ID</InfoLabel>
                  <InfoValue>{opportunity.adjusterId || 'N/A'}</InfoValue>
                </InfoItem>
              </InfoGridThree>
            </InfoSection>
          )}

          {/* Outcome Information */}
          {(opportunity.stage === 'Closed Won' || opportunity.stage === 'Closed Lost') && (
            <InfoSection>
              <SectionTitle>
                {opportunity.stage === 'Closed Won' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                Outcome
              </SectionTitle>
              <InfoGrid>
                {opportunity.actualCloseDate && (
                  <InfoItem>
                    <InfoLabel>Close Date</InfoLabel>
                    <InfoValue>{formatDate(opportunity.actualCloseDate)}</InfoValue>
                  </InfoItem>
                )}
                {opportunity.winReason && (
                  <InfoItem>
                    <InfoLabel>Win Reason</InfoLabel>
                    <InfoValue>{opportunity.winReason}</InfoValue>
                  </InfoItem>
                )}
                {opportunity.lostReason && (
                  <InfoItem>
                    <InfoLabel>Lost Reason</InfoLabel>
                    <InfoValue>{opportunity.lostReason}</InfoValue>
                  </InfoItem>
                )}
              </InfoGrid>
            </InfoSection>
          )}

          {/* Notes */}
          {opportunity.notes && (
            <InfoSection>
              <SectionTitle>
                <AlertCircle size={18} />
                Notes
              </SectionTitle>
              <InfoValue>{opportunity.notes}</InfoValue>
            </InfoSection>
          )}

          {/* Communications */}
          {opportunity.communications && opportunity.communications.length > 0 && (
            <InfoSection>
              <SectionTitle>
                <Mail size={18} />
                Communication History
              </SectionTitle>
              <CommunicationList>
                {opportunity.communications.map((comm) => (
                  <CommunicationItem key={comm.id}>
                    <CommunicationHeader>
                      <CommunicationType>{comm.type} - {comm.direction}</CommunicationType>
                      <CommunicationDate>{formatDate(comm.date)}</CommunicationDate>
                    </CommunicationHeader>
                    <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>{comm.subject}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{comm.notes}</div>
                    {comm.outcome !== 'Other' && (
                      <div style={{ marginTop: '8px', fontSize: '0.875rem', color: '#059669' }}>
                        Outcome: {comm.outcome}
                      </div>
                    )}
                  </CommunicationItem>
                ))}
              </CommunicationList>
            </InfoSection>
          )}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default OpportunityDetailsModal;