import React from 'react';
import styled from 'styled-components';

/**
 * BRANDED MODAL TITLE COMPONENT
 *
 * This component provides a consistent modal title with FFR logo across the application.
 * All modals should use this component to maintain brand consistency.
 *
 * Usage:
 * <BrandedModalTitle>Your Title Here</BrandedModalTitle>
 */

interface BrandedModalTitleProps {
  children: React.ReactNode;
  className?: string;
}

const StyledModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  img {
    height: 24px;
    width: auto;
    flex-shrink: 0;
    object-fit: contain;
  }
`;

export const BrandedModalTitle: React.FC<BrandedModalTitleProps> = ({
  children,
  className
}) => {
  return (
    <StyledModalTitle className={className}>
      <img src="/FFR logo 32x32.png" alt="FFR Logo" />
      {children}
    </StyledModalTitle>
  );
};

export default BrandedModalTitle;
