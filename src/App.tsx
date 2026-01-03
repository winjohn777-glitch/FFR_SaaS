import React, { useState, Suspense, lazy } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy-loaded pages for better performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ChartOfAccounts = lazy(() => import('./pages/ChartOfAccounts'));
const JobCosting = lazy(() => import('./pages/JobCosting'));
const Invoicing = lazy(() => import('./pages/Invoicing'));
const Bookkeeping = lazy(() => import('./pages/Bookkeeping'));
const Reports = lazy(() => import('./pages/Reports'));
const Inventory = lazy(() => import('./pages/Inventory'));
const CRM = lazy(() => import('./pages/CRM'));
const Training = lazy(() => import('./pages/Training'));
const HumanResources = lazy(() => import('./pages/HumanResources'));
const ProjectManagement = lazy(() => import('./pages/ProjectManagement'));
const Documents = lazy(() => import('./pages/Documents'));
const SOPManagement = lazy(() => import('./pages/SOPManagement'));
const PricingAdmin = lazy(() => import('./pages/PricingAdmin'));

// Data Context
import { DataProvider } from './contexts/DataContext';

// Toast Provider
import { ToastProvider } from './components/Toast';

// Theme
import { DefaultTheme } from 'styled-components';

const theme: DefaultTheme = {
  colors: {
    primary: '#1e40af', // Professional blue
    secondary: '#059669', // Success green
    accent: '#dc2626', // Warning red
    error: '#dc2626', // Error red
    background: '#f8fafc',
    surface: '#ffffff',
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
      light: '#94a3b8'
    },
    border: '#e2e8f0',
    roofing: {
      shingle: '#8b4513',
      metal: '#708090',
      tile: '#cd853f'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  }
};

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${theme.colors.background};
    color: ${theme.colors.text.primary};
    line-height: 1.5;
  }

  #root {
    min-height: 100vh;
  }
`;

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 280px;

  @media (max-width: 1024px) {
    margin-left: 0;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const CompanyHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  color: white;
  padding: ${({ theme }) => theme.spacing.lg};
  margin: -${({ theme }) => theme.spacing.xl} -${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.xl};
  border-radius: 0 0 ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};

  @media (max-width: 768px) {
    margin: -${({ theme }) => theme.spacing.md} -${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md};
    flex-direction: column;
    text-align: center;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const CompanyLogo = styled.img`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  object-fit: contain;
  background-color: rgba(255, 255, 255, 0.1);
  padding: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }
`;

const CompanyContent = styled.div`
  flex: 1;
`;

const CompanyTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const CompanyInfo = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #2E5AAC;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: #64748b;
  font-size: 14px;
`;

const PageLoader = () => (
  <LoadingContainer>
    <LoadingSpinner />
    <LoadingText>Loading...</LoadingText>
  </LoadingContainer>
);

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DataProvider>
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <GlobalStyle />
          <Router>
          <AppContainer>
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <MainContent>
            <Header onMenuClick={() => setSidebarOpen(true)} />

            <ContentArea>
              <CompanyHeader>
                <CompanyContent>
                  <CompanyTitle>
                    <img src="/FFR logo 32x32.png" alt="FFR" style={{ height: '24px', marginRight: '8px', verticalAlign: 'middle' }} />
                    Florida First Roofing LLC
                  </CompanyTitle>
                  <CompanyInfo>
                    <span>3815 HWY 1 #13, Cocoa, FL 32926</span>
                    <span>321-301-4512</span>
                    <span>License: CCC1336561</span>
                  </CompanyInfo>
                </CompanyContent>
              </CompanyHeader>

              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route path="/" element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Dashboard />
                        </motion.div>
                      } />
                      <Route path="/chart-of-accounts" element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChartOfAccounts />
                        </motion.div>
                      } />
                      <Route path="/job-costing" element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <JobCosting />
                        </motion.div>
                      } />
                      <Route path="/invoicing" element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Invoicing />
                        </motion.div>
                      } />
                      <Route path="/bookkeeping" element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Bookkeeping />
                        </motion.div>
                      } />
                      <Route path="/inventory" element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Inventory />
                        </motion.div>
                      } />
                      <Route path="/reports" element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Reports />
                        </motion.div>
                      } />
                      <Route path="/crm" element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CRM />
                        </motion.div>
                      } />
                      <Route path="/documents" element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Documents />
                        </motion.div>
                      } />
                      <Route path="/training" element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Training />
                        </motion.div>
                      } />
                      <Route path="/hr" element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <HumanResources />
                        </motion.div>
                      } />
                      <Route path="/project-management" element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ProjectManagement />
                        </motion.div>
                      } />
                      <Route path="/sop-management" element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <SOPManagement />
                        </motion.div>
                      } />
                      <Route path="/pricing-admin" element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <PricingAdmin />
                        </motion.div>
                      } />
                    </Routes>
                  </AnimatePresence>
                </Suspense>
              </ErrorBoundary>
            </ContentArea>
          </MainContent>
        </AppContainer>
      </Router>
        </ToastProvider>
    </ThemeProvider>
    </DataProvider>
  );
}

export default App;
