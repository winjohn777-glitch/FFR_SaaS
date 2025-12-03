import React from 'react';
import styled from 'styled-components';
import { X, User, Phone, MapPin, Calendar, Tag, Building } from 'lucide-react';
import { Customer } from '../../types/crm';

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
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
  max-width: 600px;
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
      case 'Active':
        return `
          background-color: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
        `;
      case 'Prospect':
        return `
          background-color: #f59e0b20;
          color: #f59e0b;
        `;
      case 'Inactive':
        return `
          background-color: ${theme.colors.text.light}20;
          color: ${theme.colors.text.secondary};
        `;
      default:
        return `
          background-color: ${theme.colors.text.light}20;
          color: ${theme.colors.text.secondary};
        `;
    }
  }}
`;

const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  isOpen,
  onClose,
  customer
}) => {
  if (!isOpen || !customer) return null;

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
            Customer Details
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
              Basic Information
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Customer Name</InfoLabel>
                <InfoValue>{customer.firstName} {customer.lastName}</InfoValue>
              </InfoItem>
              {customer.companyName && (
                <InfoItem>
                  <InfoLabel>Company</InfoLabel>
                  <InfoValue>{customer.companyName}</InfoValue>
                </InfoItem>
              )}
              <InfoItem>
                <InfoLabel>Customer Type</InfoLabel>
                <InfoValue>{customer.type}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Status</InfoLabel>
                <StatusBadge status={customer.status}>{customer.status}</StatusBadge>
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
                <InfoValue>{customer.email}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Phone</InfoLabel>
                <InfoValue>{customer.phone}</InfoValue>
              </InfoItem>
              {customer.alternatePhone && (
                <InfoItem>
                  <InfoLabel>Alternate Phone</InfoLabel>
                  <InfoValue>{customer.alternatePhone}</InfoValue>
                </InfoItem>
              )}
            </InfoGrid>
          </InfoSection>

          {/* Address Information */}
          <InfoSection>
            <SectionTitle>
              <MapPin size={18} />
              Address
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Street Address</InfoLabel>
                <InfoValue>{customer.address.street}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>City, State ZIP</InfoLabel>
                <InfoValue>{customer.address.city}, {customer.address.state} {customer.address.zipCode}</InfoValue>
              </InfoItem>
              {customer.address.county && (
                <InfoItem>
                  <InfoLabel>County</InfoLabel>
                  <InfoValue>{customer.address.county} County</InfoValue>
                </InfoItem>
              )}
            </InfoGrid>
          </InfoSection>

          {/* Property Information */}
          <InfoSection>
            <SectionTitle>
              <Building size={18} />
              Property Information
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Property Type</InfoLabel>
                <InfoValue>{customer.propertyType}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Roof Type</InfoLabel>
                <InfoValue>{customer.roofType}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Lead Source</InfoLabel>
                <InfoValue>{customer.leadSource}</InfoValue>
              </InfoItem>
              {customer.creditRating && (
                <InfoItem>
                  <InfoLabel>Credit Rating</InfoLabel>
                  <InfoValue>{customer.creditRating}</InfoValue>
                </InfoItem>
              )}
            </InfoGrid>
          </InfoSection>

          {/* Dates */}
          <InfoSection>
            <SectionTitle>
              <Calendar size={18} />
              Important Dates
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Date Added</InfoLabel>
                <InfoValue>{formatDate(customer.dateAdded)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Last Contact</InfoLabel>
                <InfoValue>{formatDate(customer.lastContact)}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </InfoSection>

          {/* Notes */}
          {customer.notes && (
            <InfoSection>
              <SectionTitle>
                <Tag size={18} />
                Notes
              </SectionTitle>
              <InfoValue>{customer.notes}</InfoValue>
            </InfoSection>
          )}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CustomerDetailsModal;