import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, Plus, Edit, Trash2, ChevronDown, ChevronRight, X, Eye, Save } from 'lucide-react';
import chartOfAccountsData from '../data/chartOfAccounts.json';
import { motion, AnimatePresence } from 'framer-motion';
import { useDataSync } from '../hooks/useDataSync';
import { useData } from '../contexts/DataContext';
import BrandedModalTitle from '../components/Shared/BrandedModalTitle';

const PageContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    align-items: stretch;
  }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  min-width: 300px;

  @media (max-width: 768px) {
    min-width: auto;
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  padding-left: 2.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background-color: ${({ theme }) => theme.colors.surface};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.light};
`;

const AddButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}dd;
  }
`;

const AccountsContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const CategorySection = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const CategoryHeader = styled.div<{ expanded: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
  }
`;

const CategoryIcon = styled.div`
  margin-right: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const CategoryTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  flex: 1;
`;

const CategorySummary = styled.div`
  text-align: right;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const AccountsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: ${({ theme }) => theme.colors.background};
`;

const TableHeaderCell = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TableRow = styled.tr`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const AccountCode = styled.span`
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const AccountType = styled.span<{ type: string }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${({ type, theme }) => {
    switch (type) {
      case 'Bank':
        return `
          background-color: ${theme.colors.secondary}20;
          color: ${theme.colors.secondary};
        `;
      case 'Inventory':
        return `
          background-color: ${theme.colors.roofing.shingle}20;
          color: ${theme.colors.roofing.shingle};
        `;
      case 'Fixed Asset':
        return `
          background-color: ${theme.colors.roofing.metal}20;
          color: ${theme.colors.roofing.metal};
        `;
      case 'Income':
        return `
          background-color: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
        `;
      default:
        return `
          background-color: ${theme.colors.text.light}20;
          color: ${theme.colors.text.secondary};
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.light};
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ModalContainer = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ModalContent = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  overflow-y: auto;
  flex: 1;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  .full-width {
    grid-column: 1 / -1;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FormLabel = styled.label`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.875rem;
`;

const FormInput = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text.secondary};
    cursor: not-allowed;
  }
`;

const FormSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const FormTextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}dd;
  }
`;

const SecondaryButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  .full-width {
    grid-column: 1 / -1;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DetailValue = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 0.875rem;
`;

interface AccountFormData {
  code: string;
  name: string;
  type: string;
  description: string;
  category: string;
  subCategory: string;
}

const ChartOfAccounts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    '1000': true, // Assets expanded by default
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<AccountFormData>({
    code: '',
    name: '',
    type: '',
    description: '',
    category: '',
    subCategory: ''
  });
  const { syncAccountData } = useDataSync();
  const { addAccount, updateAccount, deleteAccount } = useData();

  const toggleCategory = (categoryCode: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryCode]: !prev[categoryCode]
    }));
  };

  const filteredAccounts = React.useMemo(() => {
    if (!searchTerm) return chartOfAccountsData.chartOfAccounts;

    const filtered: any = {};
    Object.entries(chartOfAccountsData.chartOfAccounts).forEach(([categoryCode, category]: [string, any]) => {
      const matchingAccounts: any = {};
      Object.entries(category.accounts).forEach(([accountCode, account]: [string, any]) => {
        if (
          accountCode.includes(searchTerm) ||
          account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.description.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          matchingAccounts[accountCode] = account;
        }
      });

      if (Object.keys(matchingAccounts).length > 0) {
        filtered[categoryCode] = {
          ...category,
          accounts: matchingAccounts
        };
      }
    });

    return filtered;
  }, [searchTerm]);

  const handleAddAccount = () => {
    setFormData({
      code: '',
      name: '',
      type: '',
      description: '',
      category: '',
      subCategory: ''
    });
    setIsEditMode(false);
    setShowAddModal(true);
  };

  const handleViewAccount = (accountCode: string, account: any, category: any) => {
    setSelectedAccount({ ...account, code: accountCode, category: category.category, subCategory: category.subcategory });
    setShowViewModal(true);
    setIsEditMode(false);
  };

  const handleEditAccount = (accountCode: string, account: any, category: any) => {
    setFormData({
      code: accountCode,
      name: account.name,
      type: account.type,
      description: account.description,
      category: category.category,
      subCategory: category.subcategory
    });
    setSelectedAccount({ ...account, code: accountCode });
    setIsEditMode(true);
    setShowAddModal(true);
  };

  const handleSaveAccount = async () => {
    try {
      // Create account object for DataContext
      const accountData = {
        code: formData.code,
        name: formData.name,
        type: (formData.type === 'Revenue' ? 'income' : formData.type.toLowerCase()) as 'asset' | 'liability' | 'equity' | 'income' | 'expense',
        category: formData.category,
        subCategory: formData.subCategory,
        description: formData.description,
        parentAccount: undefined,
        isActive: true,
        balance: 0
      };

      if (isEditMode) {
        // Update existing account
        updateAccount(formData.code, accountData);
        console.log('📊 Chart of Accounts: Updated account in DataContext', formData.code);
      } else {
        // Add new account
        addAccount(accountData);
        console.log('📊 Chart of Accounts: Added new account to DataContext', formData.code);
      }

      // Also sync with unified data flow
      await syncAccountData({
        code: formData.code,
        name: formData.name,
        type: formData.type,
        description: formData.description,
        category: formData.category,
        subCategory: formData.subCategory,
        balance: 0,
        lastUpdated: new Date().toISOString()
      });

      // Emit event to notify other modules about account changes
      const accountUpdateEvent = new CustomEvent('accountDataUpdated', {
        detail: {
          action: isEditMode ? 'updated' : 'created',
          accountCode: formData.code,
          accountName: formData.name,
          timestamp: new Date().toISOString()
        }
      });
      window.dispatchEvent(accountUpdateEvent);
      console.log('📊 Chart of Accounts: Dispatched account update event', {
        action: isEditMode ? 'updated' : 'created',
        code: formData.code,
        name: formData.name
      });

      setShowAddModal(false);
    } catch (error) {
      console.error('Error saving account:', error);
    }
  };

  const handleDeleteAccount = async (accountCode: string) => {
    const account = Object.entries(chartOfAccountsData.chartOfAccounts)
      .flatMap(([categoryCode, category]: [string, any]) =>
        Object.entries(category.accounts).map(([code, accountInfo]: [string, any]) => ({
          code,
          name: accountInfo.name
        }))
      )
      .find(acc => acc.code === accountCode);

    const accountName = account ? account.name : accountCode;

    if (window.confirm(`Are you sure you want to delete account ${accountCode} - ${accountName}?\n\nThis will remove the account from new transactions but preserve historical data.`)) {
      try {
        // Remove from DataContext
        deleteAccount(accountCode);
        console.log('📊 Chart of Accounts: Deleted account from DataContext', accountCode);

        // Emit event to notify other modules about account deletion
        const accountDeleteEvent = new CustomEvent('accountDataUpdated', {
          detail: {
            action: 'deleted',
            accountCode: accountCode,
            accountName: accountName,
            timestamp: new Date().toISOString()
          }
        });
        window.dispatchEvent(accountDeleteEvent);
        console.log('📊 Chart of Accounts: Dispatched account deletion event', accountCode);
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Chart of Accounts</PageTitle>
        <HeaderActions>
          <SearchContainer>
            <SearchIcon>
              <Search size={16} />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          <AddButton onClick={handleAddAccount}>
            <Plus size={16} />
            Add Account
          </AddButton>
        </HeaderActions>
      </PageHeader>

      <AccountsContainer>
        {Object.entries(filteredAccounts).map(([categoryCode, category]: [string, any]) => (
          <CategorySection key={categoryCode}>
            <CategoryHeader
              expanded={expandedCategories[categoryCode]}
              onClick={() => toggleCategory(categoryCode)}
            >
              <CategoryIcon>
                {expandedCategories[categoryCode] ? (
                  <ChevronDown size={20} />
                ) : (
                  <ChevronRight size={20} />
                )}
              </CategoryIcon>
              <CategoryTitle>
                {category.category} - {category.subcategory}
              </CategoryTitle>
              <CategorySummary>
                {Object.keys(category.accounts).length} accounts
              </CategorySummary>
            </CategoryHeader>

            {expandedCategories[categoryCode] && (
              <AccountsTable>
                <TableHeader>
                  <tr>
                    <TableHeaderCell>Account Code</TableHeaderCell>
                    <TableHeaderCell>Account Name</TableHeaderCell>
                    <TableHeaderCell>Type</TableHeaderCell>
                    <TableHeaderCell>Description</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </tr>
                </TableHeader>
                <tbody>
                  {Object.entries(category.accounts).map(([accountCode, account]: [string, any]) => (
                    <TableRow key={accountCode}>
                      <TableCell>
                        <AccountCode>{accountCode}</AccountCode>
                      </TableCell>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>
                        <AccountType type={account.type}>{account.type}</AccountType>
                      </TableCell>
                      <TableCell>{account.description}</TableCell>
                      <TableCell>
                        <ActionButtons>
                          <ActionButton
                            onClick={() => handleViewAccount(accountCode, account, category)}
                            title="View Details"
                          >
                            <Eye size={16} />
                          </ActionButton>
                          <ActionButton
                            onClick={() => handleEditAccount(accountCode, account, category)}
                            title="Edit Account"
                          >
                            <Edit size={16} />
                          </ActionButton>
                          <ActionButton
                            onClick={() => handleDeleteAccount(accountCode)}
                            title="Delete Account"
                          >
                            <Trash2 size={16} />
                          </ActionButton>
                        </ActionButtons>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </AccountsTable>
            )}
          </CategorySection>
        ))}
      </AccountsContainer>

      {/* Add/Edit Account Modal */}
      <AnimatePresence>
        {showAddModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
          >
            <ModalContainer
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <BrandedModalTitle>{isEditMode ? 'Edit Account' : 'Add New Account'}</BrandedModalTitle>
                <CloseButton onClick={() => setShowAddModal(false)}>
                  <X size={20} />
                </CloseButton>
              </ModalHeader>

              <ModalContent>
                <FormGrid>
                  <FormGroup>
                    <FormLabel>Account Code</FormLabel>
                    <FormInput
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                      placeholder="e.g., 1010"
                      disabled={isEditMode}
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Account Name</FormLabel>
                    <FormInput
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Checking Account"
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Account Type</FormLabel>
                    <FormSelect
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <option value="">Select Type</option>
                      <option value="Bank">Bank</option>
                      <option value="Inventory">Inventory</option>
                      <option value="Fixed Asset">Fixed Asset</option>
                      <option value="Income">Income</option>
                      <option value="Expense">Expense</option>
                      <option value="Liability">Liability</option>
                      <option value="Equity">Equity</option>
                    </FormSelect>
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Category</FormLabel>
                    <FormSelect
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="">Select Category</option>
                      <option value="Assets">Assets</option>
                      <option value="Liabilities">Liabilities</option>
                      <option value="Equity">Equity</option>
                      <option value="Revenue">Revenue</option>
                      <option value="Expenses">Expenses</option>
                    </FormSelect>
                  </FormGroup>

                  <FormGroup className="full-width">
                    <FormLabel>Description</FormLabel>
                    <FormTextArea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Account description..."
                      rows={3}
                    />
                  </FormGroup>
                </FormGrid>

                <ModalActions>
                  <SecondaryButton onClick={() => setShowAddModal(false)}>
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton onClick={handleSaveAccount}>
                    <Save size={16} />
                    {isEditMode ? 'Update Account' : 'Create Account'}
                  </PrimaryButton>
                </ModalActions>
              </ModalContent>
            </ModalContainer>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* View Account Modal */}
      <AnimatePresence>
        {showViewModal && selectedAccount && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowViewModal(false)}
          >
            <ModalContainer
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <BrandedModalTitle>Account Details</BrandedModalTitle>
                <CloseButton onClick={() => setShowViewModal(false)}>
                  <X size={20} />
                </CloseButton>
              </ModalHeader>

              <ModalContent>
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>Account Code:</DetailLabel>
                    <DetailValue>
                      <AccountCode>{selectedAccount.code}</AccountCode>
                    </DetailValue>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabel>Account Name:</DetailLabel>
                    <DetailValue>{selectedAccount.name}</DetailValue>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabel>Type:</DetailLabel>
                    <DetailValue>
                      <AccountType type={selectedAccount.type}>
                        {selectedAccount.type}
                      </AccountType>
                    </DetailValue>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabel>Category:</DetailLabel>
                    <DetailValue>{selectedAccount.category}</DetailValue>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabel>Sub-Category:</DetailLabel>
                    <DetailValue>{selectedAccount.subCategory}</DetailValue>
                  </DetailItem>

                  <DetailItem className="full-width">
                    <DetailLabel>Description:</DetailLabel>
                    <DetailValue>{selectedAccount.description}</DetailValue>
                  </DetailItem>
                </DetailGrid>

                <ModalActions>
                  <SecondaryButton onClick={() => setShowViewModal(false)}>
                    Close
                  </SecondaryButton>
                  <PrimaryButton
                    onClick={() => {
                      setShowViewModal(false);
                      handleEditAccount(selectedAccount.code, selectedAccount, {
                        category: selectedAccount.category,
                        subcategory: selectedAccount.subCategory
                      });
                    }}
                  >
                    <Edit size={16} />
                    Edit Account
                  </PrimaryButton>
                </ModalActions>
              </ModalContent>
            </ModalContainer>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default ChartOfAccounts;