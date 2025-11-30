import React from 'react';
import styled from 'styled-components';
import { AlertTriangle, Package, X } from 'lucide-react';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  status: string;
}

interface InventoryAlertsProps {
  inventoryItems: InventoryItem[];
  onDismiss?: () => void;
}

const AlertsContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const AlertsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const AlertsTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const AlertsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AlertItem = styled.div<{ severity: 'urgent' | 'warning' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 4px solid;

  ${({ severity }) => {
    switch (severity) {
      case 'urgent':
        return `
          background-color: #fef2f2;
          border-left-color: #dc2626;
          color: #7f1d1d;
        `;
      case 'warning':
        return `
          background-color: #fffbeb;
          border-left-color: #d97706;
          color: #92400e;
        `;
      default:
        return `
          background-color: #f0f9ff;
          border-left-color: #2563eb;
          color: #1e40af;
        `;
    }
  }}
`;

const AlertIcon = styled.div<{ severity: 'urgent' | 'warning' }>`
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ severity }) => {
    switch (severity) {
      case 'urgent':
        return 'color: #dc2626;';
      case 'warning':
        return 'color: #d97706;';
      default:
        return 'color: #2563eb;';
    }
  }}
`;

const AlertContent = styled.div`
  flex: 1;
`;

const AlertText = styled.div`
  font-weight: 500;
  margin-bottom: 2px;
`;

const AlertDetails = styled.div`
  font-size: 0.875rem;
  opacity: 0.8;
`;

const NoAlertsMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const InventoryAlerts: React.FC<InventoryAlertsProps> = ({ inventoryItems, onDismiss }) => {
  // Get items that need attention
  const outOfStockItems = inventoryItems.filter(item => item.currentStock === 0);
  const lowStockItems = inventoryItems.filter(item =>
    item.currentStock > 0 && item.currentStock <= item.reorderPoint
  );

  const totalAlerts = outOfStockItems.length + lowStockItems.length;

  if (totalAlerts === 0) {
    return (
      <AlertsContainer>
        <NoAlertsMessage>
          <Package size={32} />
          <div>
            <strong>All inventory levels are good!</strong>
            <br />
            No items need immediate attention.
          </div>
        </NoAlertsMessage>
      </AlertsContainer>
    );
  }

  return (
    <AlertsContainer>
      <AlertsHeader>
        <AlertsTitle>
          <AlertTriangle size={20} />
          Inventory Alerts ({totalAlerts})
        </AlertsTitle>
        {onDismiss && (
          <CloseButton onClick={onDismiss}>
            <X size={16} />
          </CloseButton>
        )}
      </AlertsHeader>

      <AlertsList>
        {outOfStockItems.map((item) => (
          <AlertItem key={item.id} severity="urgent">
            <AlertIcon severity="urgent">
              <AlertTriangle size={16} />
            </AlertIcon>
            <AlertContent>
              <AlertText>Out of Stock: {item.name}</AlertText>
              <AlertDetails>
                SKU: {item.sku} | Category: {item.category} | Need to reorder immediately
              </AlertDetails>
            </AlertContent>
          </AlertItem>
        ))}

        {lowStockItems.map((item) => (
          <AlertItem key={item.id} severity="warning">
            <AlertIcon severity="warning">
              <Package size={16} />
            </AlertIcon>
            <AlertContent>
              <AlertText>Low Stock: {item.name}</AlertText>
              <AlertDetails>
                SKU: {item.sku} | Current: {item.currentStock} | Reorder at: {item.reorderPoint}
              </AlertDetails>
            </AlertContent>
          </AlertItem>
        ))}
      </AlertsList>
    </AlertsContainer>
  );
};

export default InventoryAlerts;