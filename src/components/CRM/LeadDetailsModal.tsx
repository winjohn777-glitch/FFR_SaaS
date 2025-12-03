import React from 'react';
import styled from 'styled-components';
import { X, User, Mail, Phone, MapPin, Calendar, Target, TrendingUp, Building, Clock } from 'lucide-react';
import { Lead } from '../../types/crm';

interface LeadDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
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
  max-width: 700px;
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
      case 'New':
      case 'Contacted':
        return `
          background-color: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
        `;
      case 'Qualified':
      case 'Proposal Sent':
        return `
          background-color: #10b98120;
          color: #10b981;
        `;
      case 'Negotiating':
        return `
          background-color: #f59e0b20;
          color: #f59e0b;
        `;
      case 'Won':
        return `
          background-color: #059669 20;
          color: #059669;
        `;
      case 'Lost':
        return `
          background-color: #dc262620;
          color: #dc2626;
        `;
      default:
        return `
          background-color: ${theme.colors.text.light}20;
          color: ${theme.colors.text.secondary};
        `;
    }
  }}
`;

const PriorityBadge = styled.span<{ priority: string }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: inline-block;

  ${({ priority }) => {
    switch (priority) {
      case 'Hot':
        return `
          background-color: #ef444420;
          color: #ef4444;
        `;
      case 'Warm':
        return `
          background-color: #f59e0b20;
          color: #f59e0b;
        `;
      case 'Cold':
        return `
          background-color: #6b728020;
          color: #6b7280;
        `;
      default:
        return `
          background-color: #6b728020;
          color: #6b7280;
        `;
    }
  }}
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

const CommunicationSubject = styled.div`
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CommunicationNotes = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({
  isOpen,
  onClose,
  lead
}) => {
  if (!isOpen || !lead) return null;

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
            Lead Details
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {/* Basic Information */}
          <InfoSection>
            <SectionTitle>
              <User size={18} />
              Lead Information
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Lead Name</InfoLabel>
                <InfoValue>{lead.firstName} {lead.lastName}</InfoValue>
              </InfoItem>
              {lead.companyName && (
                <InfoItem>
                  <InfoLabel>Company</InfoLabel>
                  <InfoValue>{lead.companyName}</InfoValue>
                </InfoItem>
              )}
              <InfoItem>
                <InfoLabel>Status</InfoLabel>
                <StatusBadge status={lead.status}>{lead.status}</StatusBadge>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Priority</InfoLabel>
                <PriorityBadge priority={lead.priority}>{lead.priority}</PriorityBadge>
              </InfoItem>
            </InfoGrid>
          </InfoSection>

          {/* Contact Information */}
          <InfoSection>
            <SectionTitle>
              <Phone size={18} />
              Contact Information
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{lead.email}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Phone</InfoLabel>
                <InfoValue>{lead.phone}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </InfoSection>

          {/* Address Information */}
          <InfoSection>
            <SectionTitle>
              <MapPin size={18} />
              Property Address
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Street Address</InfoLabel>
                <InfoValue>{lead.address.street}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>City, State ZIP</InfoLabel>
                <InfoValue>{lead.address.city}, {lead.address.state} {lead.address.zipCode}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>County</InfoLabel>
                <InfoValue>{lead.address.county} County</InfoValue>
              </InfoItem>
            </InfoGrid>
          </InfoSection>

          {/* Project Information */}
          <InfoSection>
            <SectionTitle>
              <Building size={18} />
              Project Details
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Service Needed</InfoLabel>
                <InfoValue>{lead.serviceNeeded}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Property Type</InfoLabel>
                <InfoValue>{lead.propertyType}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Roof Type</InfoLabel>
                <InfoValue>{lead.roofType}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Estimated Value</InfoLabel>
                <InfoValue>{formatCurrency(lead.estimatedValue)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Timeframe</InfoLabel>
                <InfoValue>{lead.timeframe}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </InfoSection>

          {/* Lead Source & Assignment */}
          <InfoSection>
            <SectionTitle>
              <Target size={18} />
              Lead Source & Assignment
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Lead Source</InfoLabel>
                <InfoValue>{lead.source}</InfoValue>
              </InfoItem>
              {lead.campaign && (
                <InfoItem>
                  <InfoLabel>Campaign</InfoLabel>
                  <InfoValue>{lead.campaign}</InfoValue>
                </InfoItem>
              )}
              {lead.referredBy && (
                <InfoItem>
                  <InfoLabel>Referred By</InfoLabel>
                  <InfoValue>{lead.referredBy}</InfoValue>
                </InfoItem>
              )}
              <InfoItem>
                <InfoLabel>Assigned To</InfoLabel>
                <InfoValue>{lead.assignedTo}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </InfoSection>

          {/* Insurance Information */}
          {lead.isStormLead && (
            <InfoSection>
              <SectionTitle>
                <TrendingUp size={18} />
                Insurance Claim
              </SectionTitle>
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Insurance Company</InfoLabel>
                  <InfoValue>{lead.insuranceCompany || 'N/A'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Claim Number</InfoLabel>
                  <InfoValue>{lead.insuranceClaimNumber || 'N/A'}</InfoValue>
                </InfoItem>
                <InfoItem>
                  <InfoLabel>Storm Lead</InfoLabel>
                  <InfoValue>{lead.isStormLead ? 'Yes' : 'No'}</InfoValue>
                </InfoItem>
              </InfoGrid>
            </InfoSection>
          )}

          {/* Important Dates */}
          <InfoSection>
            <SectionTitle>
              <Calendar size={18} />
              Important Dates
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Date Created</InfoLabel>
                <InfoValue>{formatDate(lead.dateCreated)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Last Contact</InfoLabel>
                <InfoValue>{formatDate(lead.lastContact)}</InfoValue>
              </InfoItem>
              {lead.nextFollowUp && (
                <InfoItem>
                  <InfoLabel>Next Follow-up</InfoLabel>
                  <InfoValue>{formatDate(lead.nextFollowUp)}</InfoValue>
                </InfoItem>
              )}
              {lead.expectedCloseDate && (
                <InfoItem>
                  <InfoLabel>Expected Close</InfoLabel>
                  <InfoValue>{formatDate(lead.expectedCloseDate)}</InfoValue>
                </InfoItem>
              )}
            </InfoGrid>
          </InfoSection>

          {/* Notes */}
          {lead.notes && (
            <InfoSection>
              <SectionTitle>
                <Clock size={18} />
                Notes
              </SectionTitle>
              <InfoValue>{lead.notes}</InfoValue>
            </InfoSection>
          )}

          {/* Communications */}
          {lead.communications && lead.communications.length > 0 && (
            <InfoSection>
              <SectionTitle>
                <Mail size={18} />
                Communication History
              </SectionTitle>
              <CommunicationList>
                {lead.communications.map((comm) => (
                  <CommunicationItem key={comm.id}>
                    <CommunicationHeader>
                      <CommunicationType>{comm.type} - {comm.direction}</CommunicationType>
                      <CommunicationDate>{formatDate(comm.date)}</CommunicationDate>
                    </CommunicationHeader>
                    <CommunicationSubject>{comm.subject}</CommunicationSubject>
                    <CommunicationNotes>{comm.notes}</CommunicationNotes>
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

export default LeadDetailsModal;