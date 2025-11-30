import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  BookOpen,
  HardHat,
  FileText,
  Package,
  BarChart3,
  Calculator,
  Users,
  UserCheck,
  X,
  FolderOpen,
  GraduationCap,
  Clipboard,
  Shield,
  DollarSign
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarContainer = styled(motion.aside)<{ isOpen: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  width: 280px;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: 1000;
  display: flex;
  flex-direction: column;

  @media (max-width: 1024px) {
    transform: ${({ isOpen }) => isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  }
`;

const SidebarHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const LogoIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  object-fit: contain;
`;

const LogoText = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CloseButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 1024px) {
    display: flex;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const Navigation = styled.nav`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg} 0;
  overflow-y: auto;
  overflow-x: hidden;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const NavSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h3`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.text.light};
  padding: 0 ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const NavItem = styled(Link)<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  color: ${({ theme, isActive }) => isActive ? theme.colors.primary : theme.colors.text.secondary};
  text-decoration: none;
  font-weight: ${({ isActive }) => isActive ? '600' : '500'};
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.background};
  }

  ${({ isActive, theme }) => isActive && `
    background-color: ${theme.colors.background};
    border-right: 3px solid ${theme.colors.primary};
  `}
`;

const NavIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SidebarFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.light};
  text-align: center;
`;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FooterLogoIcon = styled.img`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  object-fit: contain;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;

  @media (max-width: 1024px) {
    display: block;
  }
`;

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigationItems = [
    {
      section: "Overview",
      items: [
        { path: '/', label: 'Dashboard', icon: Home }
      ]
    },
    {
      section: "Sales & Projects",
      items: [
        { path: '/crm', label: 'Customer CRM', icon: Users },
        { path: '/project-management', label: 'Project Management', icon: Clipboard }
      ]
    },
    {
      section: "Job Execution",
      items: [
        { path: '/job-costing', label: 'Job Costing', icon: HardHat },
        { path: '/inventory', label: 'Inventory', icon: Package }
      ]
    },
    {
      section: "Financial Management",
      items: [
        { path: '/chart-of-accounts', label: 'Chart of Accounts', icon: BookOpen },
        { path: '/invoicing', label: 'Invoicing', icon: FileText },
        { path: '/bookkeeping', label: 'Bookkeeping', icon: Calculator },
        { path: '/reports', label: 'Financial Reports', icon: BarChart3 },
        { path: '/pricing-admin', label: 'Pricing Administration', icon: DollarSign }
      ]
    },
    {
      section: "Business Operations",
      items: [
        { path: '/hr', label: 'Human Resources', icon: UserCheck },
        { path: '/training', label: 'Training & LMS', icon: GraduationCap },
        { path: '/sop-management', label: 'SOP Management', icon: Shield },
        { path: '/documents', label: 'Documents', icon: FolderOpen }
      ]
    }
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <SidebarContainer
        isOpen={isOpen}
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <SidebarHeader>
          <Logo>
            <LogoIcon src="/FFR logo 32x32.png" alt="Florida First Roofing Logo" />
            <LogoText>Florida First Roofing LLC</LogoText>
          </Logo>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </SidebarHeader>

        <Navigation>
          {navigationItems.map((section, index) => (
            <NavSection key={index}>
              <SectionTitle>{section.section}</SectionTitle>
              {section.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <NavItem
                    key={item.path}
                    to={item.path}
                    isActive={isActive}
                    onClick={() => window.innerWidth <= 1024 && onClose()}
                  >
                    <NavIcon>
                      <IconComponent size={20} />
                    </NavIcon>
                    {item.label}
                  </NavItem>
                );
              })}
            </NavSection>
          ))}
        </Navigation>

        <SidebarFooter>
          <FooterLogo>
            <FooterLogoIcon src="/FFR logo 32x32.png" alt="Florida First Roofing Logo" />
            <div>Florida First Roofing LLC</div>
          </FooterLogo>
          <div>State Certified Contractor</div>
          <div>CCC1336561</div>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;