import React, { useState } from 'react';
import { formatCurrency } from '../utils/currencyFormatter';
import styled from 'styled-components';
import { Plus, Package, AlertTriangle, Search, Filter, Edit, Trash2, Eye, Download, TrendingUp, TrendingDown, BarChart3, FileText, Truck, Shield, FileCheck, Clipboard } from 'lucide-react';
import { downloadStockReport, downloadReorderReport, generateLowStockAlert } from '../components/InventoryReports';
import InventoryAlerts from '../components/InventoryAlerts';
import EditableModal from '../components/EditableModal';
import { ModalField } from '../components/ModalStructureEditor';
import { InventoryItem, InventoryFormData } from '../types/inventory';
import { useData } from '../contexts/DataContext';

// Interface now imported from types/inventory.ts

// Enhanced fields for Add Inventory Item Modal with SDS/ASTM integration
const defaultInventoryFields: ModalField[] = [
  {
    id: 'sku',
    type: 'text',
    label: 'SKU',
    placeholder: 'Enter SKU (e.g., SH-001)',
    required: true,
    order: 1
  },
  {
    id: 'name',
    type: 'text',
    label: 'Item Name',
    placeholder: 'Enter item name',
    required: true,
    order: 2
  },
  {
    id: 'category',
    type: 'select',
    label: 'Category',
    placeholder: 'Select category',
    required: true,
    options: ['Metal', 'Shingles', 'TPO', 'Tile', 'Modified Bitumen', 'Underlayment', 'Flashing', 'Fasteners', 'Tools', 'Safety', 'Other'],
    order: 3
  },
  {
    id: 'description',
    type: 'textarea',
    label: 'Description',
    placeholder: 'Enter item description',
    required: false,
    order: 4
  },
  {
    id: 'unit',
    type: 'text',
    label: 'Unit',
    placeholder: 'e.g., Bundle, Roll, Piece',
    required: true,
    order: 5
  },

  {
    id: 'currentStock',
    type: 'number',
    label: 'Current Stock',
    placeholder: 'Enter current stock quantity',
    required: true,
    order: 7
  },
  {
    id: 'unitCost',
    type: 'currency',
    label: 'Unit Cost',
    placeholder: 'Enter unit cost',
    required: true,
    order: 8
  },
  {
    id: 'reorderPoint',
    type: 'number',
    label: 'Reorder Point',
    placeholder: 'Minimum stock level',
    required: true,
    order: 9
  },
  {
    id: 'reorderQuantity',
    type: 'number',
    label: 'Reorder Quantity',
    placeholder: 'Quantity to reorder',
    required: true,
    order: 10
  },

  {
    id: 'supplier',
    type: 'text',
    label: 'Supplier',
    placeholder: 'Enter supplier name',
    required: false,
    order: 12
  },
  {
    id: 'supplierSku',
    type: 'text',
    label: 'Supplier SKU',
    placeholder: "Supplier's SKU",
    required: false,
    order: 13
  },
  {
    id: 'location',
    type: 'text',
    label: 'Storage Location',
    placeholder: 'Storage location',
    required: false,
    order: 14
  },

  {
    id: 'sdsNumber',
    type: 'text',
    label: 'SDS Number',
    placeholder: 'Safety Data Sheet number',
    required: false,
    order: 16
  },
  {
    id: 'sdsVersion',
    type: 'text',
    label: 'SDS Version',
    placeholder: 'e.g., 3.2, Rev 5',
    required: false,
    order: 17
  },
  {
    id: 'sdsRevisionDate',
    type: 'date',
    label: 'SDS Revision Date',
    placeholder: 'Latest revision date',
    required: false,
    order: 18
  },
  {
    id: 'emergencyContact',
    type: 'text',
    label: 'Emergency Contact',
    placeholder: 'Emergency contact person/company',
    required: false,
    order: 19
  },
  {
    id: 'emergencyPhone',
    type: 'phone',
    label: 'Emergency Phone',
    placeholder: '24-hour emergency phone number',
    required: false,
    order: 20
  },

  {
    id: 'requiresPpe',
    type: 'checkbox',
    label: 'Requires PPE',
    placeholder: 'Personal Protective Equipment required',
    required: false,
    order: 22
  },
  {
    id: 'storageInstructions',
    type: 'textarea',
    label: 'Storage Instructions',
    placeholder: 'Special storage requirements, temperature, etc.',
    required: false,
    order: 23
  },
  {
    id: 'handlingPrecautions',
    type: 'textarea',
    label: 'Handling Precautions',
    placeholder: 'Safety precautions for handling this material',
    required: false,
    order: 24
  },
  {
    id: 'hazardousWaste',
    type: 'checkbox',
    label: 'Hazardous Waste',
    placeholder: 'Requires special disposal',
    required: false,
    order: 25
  },

  {
    id: 'astmStandards',
    type: 'text',
    label: 'ASTM Standards',
    placeholder: 'e.g., ASTM D6083, ASTM D6298 (comma separated)',
    required: false,
    order: 27
  },
  {
    id: 'complianceStatus',
    type: 'select',
    label: 'Compliance Status',
    placeholder: 'Select compliance status',
    required: false,
    options: ['Compliant', 'Non-Compliant', 'Pending', 'Not Applicable'],
    order: 28
  },
  {
    id: 'certificationDate',
    type: 'date',
    label: 'Certification Date',
    placeholder: 'Date of compliance certification',
    required: false,
    order: 29
  },

  {
    id: 'qualityGrade',
    type: 'select',
    label: 'Quality Grade',
    placeholder: 'Select quality grade',
    required: false,
    options: ['Premium', 'A', 'B', 'C', 'Standard', 'Economy'],
    order: 31
  },
  {
    id: 'warrantyPeriod',
    type: 'text',
    label: 'Warranty Period',
    placeholder: 'e.g., 20 years, 10 years',
    required: false,
    order: 32
  },

  {
    id: 'weatherRating',
    type: 'select',
    label: 'Weather Rating',
    placeholder: 'UV and weather resistance',
    required: false,
    options: ['Excellent', 'Good', 'Fair', 'Poor'],
    order: 34
  },
  {
    id: 'fireRating',
    type: 'select',
    label: 'Fire Rating',
    placeholder: 'Fire resistance classification',
    required: false,
    options: ['Class A', 'Class B', 'Class C', 'Unrated'],
    order: 35
  },
  {
    id: 'windRating',
    type: 'text',
    label: 'Wind Rating',
    placeholder: 'Maximum wind speed (mph)',
    required: false,
    order: 36
  },
  {
    id: 'roofingApplication',
    type: 'select',
    label: 'Roofing Application',
    placeholder: 'Primary roofing application',
    required: false,
    options: ['New Construction', 'Re-Roof', 'Repair', 'Maintenance', 'All Applications'],
    order: 37
  }
];

// Styled Components
const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  gap: ${({ theme }) => theme.spacing.md};
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  font-size: 1rem;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}dd;
  }

  &.secondary {
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text.primary};
    border: 1px solid ${({ theme }) => theme.colors.border};

    &:hover {
      background-color: ${({ theme }) => theme.colors.background};
    }
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 200px;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SearchInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background-color: ${({ theme }) => theme.colors.background};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background-color: ${({ theme }) => theme.colors.background};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StatTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const StatIcon = styled.div<{ variant: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: ${({ variant, theme }) => {
    switch (variant) {
      case 'primary': return theme.colors.primary;
      case 'success': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'danger': return '#EF4444';
      default: return theme.colors.text.secondary;
    }
  }};
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatChange = styled.div<{ positive: boolean }>`
  font-size: 0.875rem;
  color: ${({ positive }) => positive ? '#10B981' : '#EF4444'};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const InventoryTable = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr 1fr 1fr 100px;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-weight: 600;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr 1fr 1fr 100px;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ItemName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ItemDescription = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 2px;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${({ status }) => {
    switch (status) {
      case 'In Stock': return '#D1FAE5';
      case 'Low Stock': return '#FEF3C7';
      case 'Out of Stock': return '#FEE2E2';
      case 'On Order': return '#DBEAFE';
      default: return '#F3F4F6';
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case 'In Stock': return '#065F46';
      case 'Low Stock': return '#92400E';
      case 'Out of Stock': return '#991B1B';
      case 'On Order': return '#1E40AF';
      default: return '#374151';
    }
  }};
`;

const StockInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const CurrentStock = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ReorderPoint = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ActionButtonsGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &.edit {
    &:hover {
      background-color: ${({ theme }) => theme.colors.primary}20;
      color: ${({ theme }) => theme.colors.primary};
    }
  }

  &.delete {
    &:hover {
      background-color: #EF444420;
      color: #EF4444;
    }
  }
`;

const Inventory: React.FC = () => {
  // Get shared inventory data from DataContext
  const { inventoryItems, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Inventory items now come from shared DataContext
  // Remove local state - using shared context instead
  /* OLD CODE - Now using DataContext
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: '1',
      sku: 'SH-001',
      name: 'Architectural Shingles - Charcoal',
      category: 'Shingles',
      description: '30-year architectural shingles, charcoal color',
      currentStock: 45,
      reorderPoint: 20,
      reorderQuantity: 50,
      unit: 'Bundle',
      unitCost: 89.99,
      supplier: 'GAF Materials',
      supplierSku: 'GAF-TH-CH',
      location: 'Warehouse A-1',
      lastOrderDate: '2024-02-10',
      lastStockUpdate: '2024-02-15',
      status: 'In Stock',
      requiresPpe: false,
      requiredPpe: [],
      storageInstructions: 'Store in dry location',
      handlingPrecautions: 'Standard roofing safety practices',
      hazardousWaste: false
    },
    {
      id: '2',
      sku: 'MT-002',
      name: 'Standing Seam Metal Roofing',
      category: 'Metal',
      description: '24 gauge galvanized steel, 16" wide panels',
      currentStock: 8,
      reorderPoint: 10,
      reorderQuantity: 25,
      unit: 'Panel',
      unitCost: 12.50,
      supplier: 'Metal Sales',
      supplierSku: 'MS-SS-16-24G',
      location: 'Warehouse B-1',
      lastOrderDate: '2024-02-05',
      lastStockUpdate: '2024-02-14',
      status: 'Low Stock',
      requiresPpe: false,
      requiredPpe: [],
      storageInstructions: 'Store panels flat and dry. Avoid contact with dissimilar metals.',
      handlingPrecautions: 'Wear cut-resistant gloves. Use proper lifting techniques for heavy panels.',
      hazardousWaste: false
    },
    {
      id: '3',
      sku: 'TP-003',
      name: 'TPO Membrane 60mil',
      category: 'TPO',
      description: 'Single-ply TPO roofing membrane, 60mil thickness',
      currentStock: 3,
      reorderPoint: 5,
      reorderQuantity: 15,
      unit: 'Roll',
      unitCost: 245.00,
      supplier: 'Carlisle SynTec',
      supplierSku: 'CAR-TPO-60',
      location: 'Warehouse C-1',
      lastOrderDate: '2024-01-28',
      lastStockUpdate: '2024-02-16',
      status: 'Low Stock',
      requiresPpe: false,
      requiredPpe: [],
      storageInstructions: 'Store in cool, dry area away from direct sunlight. Keep rolls upright.',
      handlingPrecautions: 'Use proper lifting techniques. Avoid sharp objects that could puncture membrane.',
      hazardousWaste: false
    },
    {
      id: '4',
      sku: 'TL-004',
      name: 'Spanish Clay Tiles',
      category: 'Tile',
      description: 'Traditional Spanish clay roof tiles, terra cotta',
      currentStock: 120,
      reorderPoint: 50,
      reorderQuantity: 200,
      unit: 'Piece',
      unitCost: 2.75,
      supplier: 'Boral Roofing',
      supplierSku: 'BOR-SC-TC',
      location: 'Warehouse D-1',
      lastOrderDate: '2024-02-08',
      lastStockUpdate: '2024-02-17',
      status: 'In Stock',
      requiresPpe: false,
      requiredPpe: [],
      storageInstructions: 'Stack on wooden pallets, maximum 4 layers high. Protect from freezing.',
      handlingPrecautions: 'Handle with care to prevent breakage. Wear safety gloves when handling.',
      hazardousWaste: false
    },
    {
      id: '5',
      sku: 'MB-005',
      name: 'Modified Bitumen SBS',
      category: 'Modified Bitumen',
      description: 'SBS modified bitumen membrane, granulated surface',
      currentStock: 0,
      reorderPoint: 10,
      reorderQuantity: 20,
      unit: 'Roll',
      unitCost: 145.50,
      supplier: 'USA Supply',
      supplierSku: 'USA-MB-SBS',
      location: 'Warehouse B-2',
      lastOrderDate: '2024-02-01',
      lastStockUpdate: '2024-02-20',
      status: 'Out of Stock',
      requiresPpe: true,
      requiredPpe: [{ type: 'Respirator', specification: 'N95 minimum for dust protection', required: true }],
      storageInstructions: 'Store in cool, dry area. Avoid extreme temperatures. Keep away from ignition sources.',
      handlingPrecautions: 'Wear respirator during installation. Use proper ventilation. Avoid skin contact with hot material.',
      hazardousWaste: false
    },
    {
      id: '6',
      sku: 'UL-006',
      name: 'Synthetic Underlayment',
      category: 'Underlayment',
      description: 'Premium synthetic underlayment, 48" x 250\'',
      currentStock: 12,
      reorderPoint: 15,
      reorderQuantity: 30,
      unit: 'Roll',
      unitCost: 89.99,
      supplier: 'Home Depot',
      supplierSku: 'HD-SYN-UL',
      location: 'Warehouse A-3',
      lastOrderDate: '2024-02-12',
      lastStockUpdate: '2024-02-21',
      status: 'Low Stock',
      requiresPpe: false,
      requiredPpe: [],
      storageInstructions: 'Store rolls vertically in dry area. Protect from UV exposure.',
      handlingPrecautions: 'Use proper lifting techniques. Avoid dragging on rough surfaces.',
      hazardousWaste: false
    },
    {
      id: '7',
      sku: 'FL-007',
      name: 'Step Flashing 8"',
      category: 'Flashing',
      description: '8" galvanized step flashing',
      currentStock: 75,
      reorderPoint: 25,
      reorderQuantity: 100,
      unit: 'Piece',
      unitCost: 4.25,
      supplier: 'ABC Supply',
      supplierSku: 'ABC-SF-8',
      location: 'Warehouse A-2',
      lastOrderDate: '2024-02-13',
      lastStockUpdate: '2024-02-18',
      status: 'In Stock',
      requiresPpe: false,
      requiredPpe: [],
      storageInstructions: 'Store in dry area to prevent corrosion. Keep separated by type.',
      handlingPrecautions: 'Wear cut-resistant gloves when handling. Inspect for sharp edges.',
      hazardousWaste: false
    },
    {
      id: '8',
      sku: 'FS-008',
      name: 'Roofing Screws 1.5"',
      category: 'Fasteners',
      description: 'Self-drilling screws with neoprene washers',
      currentStock: 500,
      reorderPoint: 200,
      reorderQuantity: 1000,
      unit: 'Box',
      unitCost: 35.50,
      supplier: 'Fastenal',
      supplierSku: 'FAST-RS-15',
      location: 'Warehouse A-4',
      lastOrderDate: '2024-02-11',
      lastStockUpdate: '2024-02-19',
      status: 'In Stock',
      requiresPpe: false,
      requiredPpe: [],
      storageInstructions: 'Store in dry area to prevent rust. Keep in original packaging.',
      handlingPrecautions: 'Handle with care to avoid injury from sharp points. Wear safety gloves.',
      hazardousWaste: false
    },
    {
      id: '9',
      sku: 'TL-009',
      name: 'Pneumatic Nail Gun',
      category: 'Tools',
      description: 'Coil roofing nailer, adjustable depth',
      currentStock: 2,
      reorderPoint: 1,
      reorderQuantity: 3,
      unit: 'Each',
      unitCost: 289.99,
      supplier: 'Home Depot',
      supplierSku: 'HD-PNG-ADJ',
      location: 'Tool Room',
      lastOrderDate: '2024-01-25',
      lastStockUpdate: '2024-02-22',
      status: 'In Stock',
      requiresPpe: true,
      requiredPpe: [{ type: 'Eye Protection', specification: 'Safety glasses required', required: true }, { type: 'Hard Hat', specification: 'ANSI Z89.1 compliant', required: true }],
      storageInstructions: 'Store in locked tool room. Disconnect air supply when not in use.',
      handlingPrecautions: 'Follow manufacturer safety guidelines. Never point at people. Inspect before each use.',
      hazardousWaste: false
    },
    {
      id: '10',
      sku: 'SF-010',
      name: 'Safety Harness',
      category: 'Safety',
      description: 'Full body safety harness with D-rings',
      currentStock: 6,
      reorderPoint: 5,
      reorderQuantity: 10,
      unit: 'Each',
      unitCost: 145.00,
      supplier: '3M',
      supplierSku: '3M-SH-FB',
      location: 'Safety Storage',
      lastOrderDate: '2024-02-07',
      lastStockUpdate: '2024-02-20',
      status: 'In Stock',
      requiresPpe: false,
      requiredPpe: [],
      storageInstructions: 'Store in cool, dry area away from chemicals and UV light. Inspect regularly.',
      handlingPrecautions: 'Inspect before each use for cuts, fraying, or damage. Follow manufacturer guidelines.',
      hazardousWaste: false
    }
  ]);
  */

  const handleAddItem = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveItem = (itemData: Record<string, any>) => {
    const currentStockNum = parseInt(itemData.currentStock) || 0;
    const reorderPointNum = parseInt(itemData.reorderPoint) || 0;

    const newItem: InventoryItem = {
      id: `INV-${Date.now()}`,
      sku: itemData.sku || '',
      name: itemData.name || '',
      category: itemData.category || 'Other',
      description: itemData.description || '',
      currentStock: currentStockNum,
      reorderPoint: reorderPointNum,
      reorderQuantity: parseInt(itemData.reorderQuantity) || 0,
      unit: itemData.unit || '',
      unitCost: parseFloat(itemData.unitCost) || 0,
      supplier: itemData.supplier || '',
      supplierSku: itemData.supplierSku || '',
      location: itemData.location || '',
      lastOrderDate: new Date().toISOString().split('T')[0],
      lastStockUpdate: new Date().toISOString().split('T')[0],
      status: currentStockNum <= 0 ? 'Out of Stock' : (currentStockNum <= reorderPointNum ? 'Low Stock' : 'In Stock'),

      // Safety and Regulatory Information
      requiresPpe: itemData.requiresPpe || false,
      requiredPpe: [], // Could be populated from additional fields if needed
      storageInstructions: itemData.storageInstructions || '',
      handlingPrecautions: itemData.handlingPrecautions || '',
      hazardousWaste: itemData.hazardousWaste || false,

      // SDS Information (if provided)
      safetyDataSheet: itemData.sdsNumber ? {
        id: `SDS-${Date.now()}`,
        sdsNumber: itemData.sdsNumber,
        version: itemData.sdsVersion || '1.0',
        revisionDate: itemData.sdsRevisionDate || new Date().toISOString().split('T')[0],
        fileName: `${itemData.sdsNumber}.pdf`,
        language: 'EN',
        supplier: itemData.supplier || 'Unknown',
        emergencyContact: itemData.emergencyContact || '',
        emergencyPhone: itemData.emergencyPhone || '',
        healthHazards: [],
        physicalHazards: [],
        environmentalHazards: [],
        disposalInstructions: '',
        storageRequirements: itemData.storageInstructions || '',
        firstAidMeasures: {
          inhalation: '',
          skinContact: '',
          eyeContact: '',
          ingestion: '',
          generalNotes: ''
        }
      } : undefined,

      // Regulatory Compliance (if provided)
      regulatoryCompliance: itemData.astmStandards ? {
        astmStandards: itemData.astmStandards.split(',').map((std: string) => ({
          standardNumber: std.trim(),
          title: `ASTM Standard ${std.trim()}`,
          category: 'Material' as const,
          complianceStatus: itemData.complianceStatus || 'Pending' as const,
          certificationDate: itemData.certificationDate,
          notes: ''
        })),
        oshaClassifications: [],
        epaRegulations: [],
        dotShipping: {},
        stateRegulations: [],
        certifications: []
      } : undefined,

      // Quality Information
      qualityGrade: itemData.qualityGrade as any,
      warrantyPeriod: itemData.warrantyPeriod,

      // Roofing-Specific Properties
      weatherRating: itemData.weatherRating ? {
        uvResistance: itemData.weatherRating as any,
        thermalCycling: itemData.weatherRating as any,
        moistureResistance: itemData.weatherRating as any,
        climateZones: ['All']
      } : undefined,
      fireRating: itemData.fireRating ? {
        classification: itemData.fireRating as any,
        testStandard: 'UL 790',
        certifyingBody: 'Underwriters Laboratories'
      } : undefined,
      windRating: itemData.windRating ? {
        maxWindSpeed: parseInt(itemData.windRating) || 0,
        unit: 'mph',
        testStandard: 'ASTM D3161',
        certifyingBody: 'ASTM International'
      } : undefined,
      roofingApplication: itemData.roofingApplication ? [{
        type: itemData.roofingApplication as any,
        roofType: 'All' as any,
        substrate: ['All'],
        climate: 'All' as any
      }] : undefined
    };

    // Use shared context to add item
    addInventoryItem(newItem);
    setIsAddModalOpen(false);

    console.log('🏗️ New inventory item added with SDS/ASTM integration:', newItem);

    // Log safety and regulatory information
    if (newItem.safetyDataSheet) {
      console.log('🛡️ SDS Information:', newItem.safetyDataSheet.sdsNumber);
    }
    if (newItem.regulatoryCompliance?.astmStandards?.length) {
      console.log('📋 ASTM Standards:', newItem.regulatoryCompliance.astmStandards.map(s => s.standardNumber).join(', '));
    }
    if (newItem.requiresPpe) {
      console.log('⚠️ PPE Required for:', newItem.name);
    }
  };

  const generateStockReport = () => {
    downloadStockReport(inventoryItems);
  };

  const generateReorderReport = () => {
    const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.reorderPoint);
    downloadReorderReport(lowStockItems);
  };

  const generateLowStockAlerts = () => {
    const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.reorderPoint);
    generateLowStockAlert(lowStockItems);
  };

  // Inventory item actions
  const handleEditItem = (item: InventoryItem) => {
    console.log('Edit item:', item);
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleViewItem = (item: InventoryItem) => {
    console.log('View item details:', item);
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleDeleteItem = (item: InventoryItem) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${item.name}"?`);
    if (confirmDelete) {
      // Use shared context to delete item
      deleteInventoryItem(item.id);
      console.log('Deleted item:', item);
    }
  };

  const handleEditSave = (itemData: Record<string, any>) => {
    if (selectedItem) {
      const updatedItem: InventoryItem = {
        ...selectedItem,
        sku: itemData.sku || selectedItem.sku,
        name: itemData.name || selectedItem.name,
        category: itemData.category || selectedItem.category,
        description: itemData.description || selectedItem.description,
        currentStock: parseInt(itemData.currentStock) || selectedItem.currentStock,
        reorderPoint: parseInt(itemData.reorderPoint) || selectedItem.reorderPoint,
        reorderQuantity: parseInt(itemData.reorderQuantity) || selectedItem.reorderQuantity,
        unit: itemData.unit || selectedItem.unit,
        unitCost: parseFloat(itemData.unitCost) || selectedItem.unitCost,
        supplier: itemData.supplier || selectedItem.supplier,
        supplierSku: itemData.supplierSku || selectedItem.supplierSku,
        location: itemData.location || selectedItem.location,
        lastStockUpdate: new Date().toISOString().split('T')[0],
        status: itemData.currentStock <= itemData.reorderPoint ?
                (itemData.currentStock === 0 ? 'Out of Stock' : 'Low Stock') : 'In Stock'
      };

      // Use shared context to update item
      updateInventoryItem(selectedItem.id, updatedItem);
    }
    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  // Filter inventory items
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate statistics
  const totalItems = inventoryItems.length;
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.currentStock * item.unitCost), 0);
  const lowStockItems = inventoryItems.filter(item => item.currentStock <= item.reorderPoint).length;
  const outOfStockItems = inventoryItems.filter(item => item.currentStock === 0).length;

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Title>
            <Package size={32} />
            Inventory Management
          </Title>
          <Subtitle>Track and manage roofing materials and supplies</Subtitle>
        </HeaderLeft>
        <HeaderActions>
          <ActionButton className="secondary" onClick={generateStockReport}>
            <FileText size={18} />
            Stock Report
          </ActionButton>
          <ActionButton className="secondary" onClick={generateReorderReport}>
            <Download size={18} />
            Reorder Report
          </ActionButton>
          <ActionButton className="secondary" onClick={generateLowStockAlerts}>
            <AlertTriangle size={18} />
            Low Stock Alerts
          </ActionButton>
          <ActionButton onClick={handleAddItem}>
            <Plus size={18} />
            Add Item
          </ActionButton>
        </HeaderActions>
      </Header>

      <InventoryAlerts inventoryItems={inventoryItems} />

      <StatsGrid>
        <StatCard>
          <StatHeader>
            <StatTitle>Total Items</StatTitle>
            <StatIcon variant="primary">
              <Package size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{totalItems}</StatValue>
          <StatChange positive={true}>
            <TrendingUp size={14} />
            5 items added this month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Total Value</StatTitle>
            <StatIcon variant="success">
              <BarChart3 size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{formatCurrency(totalValue)}</StatValue>
          <StatChange positive={true}>
            <TrendingUp size={14} />
            12% increase from last month
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Low Stock Items</StatTitle>
            <StatIcon variant="warning">
              <AlertTriangle size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{lowStockItems}</StatValue>
          <StatChange positive={false}>
            <TrendingDown size={14} />
            3 items need reordering
          </StatChange>
        </StatCard>

        <StatCard>
          <StatHeader>
            <StatTitle>Out of Stock</StatTitle>
            <StatIcon variant="danger">
              <Truck size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{outOfStockItems}</StatValue>
          <StatChange positive={outOfStockItems === 0}>
            {outOfStockItems === 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {outOfStockItems === 0 ? 'All items in stock' : 'Immediate action required'}
          </StatChange>
        </StatCard>
      </StatsGrid>

      <FilterBar>
        <FilterGroup>
          <FilterLabel>Search</FilterLabel>
          <SearchInput
            type="text"
            placeholder="Search by name, SKU, or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Category</FilterLabel>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Metal">Metal</option>
            <option value="Shingles">Shingles</option>
            <option value="TPO">TPO</option>
            <option value="Tile">Tile</option>
            <option value="Modified Bitumen">Modified Bitumen</option>
            <option value="Underlayment">Underlayment</option>
            <option value="Flashing">Flashing</option>
            <option value="Fasteners">Fasteners</option>
            <option value="Tools">Tools</option>
            <option value="Safety">Safety</option>
            <option value="Other">Other</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Status</FilterLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="On Order">On Order</option>
          </Select>
        </FilterGroup>
      </FilterBar>

      <InventoryTable>
        <TableHeader>
          <div>SKU</div>
          <div>Item Details</div>
          <div>Category</div>
          <div>Stock</div>
          <div>Unit Cost</div>
          <div>Total Value</div>
          <div>Supplier</div>
          <div>Status</div>
          <div>Actions</div>
        </TableHeader>

        {filteredItems.map((item) => (
          <TableRow key={item.id}>
            <div>{item.sku}</div>
            <div>
              <ItemName>{item.name}</ItemName>
              <ItemDescription>{item.description}</ItemDescription>
            </div>
            <div>{item.category}</div>
            <div>
              <StockInfo>
                <CurrentStock>{item.currentStock} {item.unit}</CurrentStock>
                <ReorderPoint>Reorder at {item.reorderPoint}</ReorderPoint>
              </StockInfo>
            </div>
            <div>{formatCurrency(item.unitCost)}</div>
            <div>{formatCurrency(item.currentStock * item.unitCost)}</div>
            <div>{item.supplier}</div>
            <div>
              <StatusBadge status={item.status}>{item.status}</StatusBadge>
            </div>
            <div>
              <ActionButtonsGroup>
                <IconButton
                  className="edit"
                  title="Edit item"
                  onClick={() => handleEditItem(item)}
                >
                  <Edit size={14} />
                </IconButton>
                <IconButton
                  title="View details"
                  onClick={() => handleViewItem(item)}
                >
                  <Eye size={14} />
                </IconButton>
                <IconButton
                  className="delete"
                  title="Delete item"
                  onClick={() => handleDeleteItem(item)}
                >
                  <Trash2 size={14} />
                </IconButton>
              </ActionButtonsGroup>
            </div>
          </TableRow>
        ))}
      </InventoryTable>

      {/* Add New Item Modal */}
      <EditableModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        modalId="add-inventory-item"
        title="Add New Inventory Item"
        size="xl"
        category="inventory"
        customFields={defaultInventoryFields}
        onSubmit={handleSaveItem}
        allowEdit={true}
        showEditButton={true}
      />

      {/* Edit Item Modal */}
      {selectedItem && (
        <EditableModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedItem(null);
          }}
          modalId="edit-inventory-item"
          title={`Edit ${selectedItem.name}`}
          size="xl"
          category="inventory"
          customFields={defaultInventoryFields}
          initialData={{
            sku: selectedItem.sku,
            name: selectedItem.name,
            category: selectedItem.category,
            description: selectedItem.description,
            currentStock: selectedItem.currentStock.toString(),
            reorderPoint: selectedItem.reorderPoint.toString(),
            reorderQuantity: selectedItem.reorderQuantity.toString(),
            unit: selectedItem.unit,
            unitCost: selectedItem.unitCost.toString(),
            supplier: selectedItem.supplier,
            supplierSku: selectedItem.supplierSku,
            location: selectedItem.location
          }}
          onSubmit={handleEditSave}
          allowEdit={true}
          showEditButton={true}
        />
      )}

      {/* View Item Modal */}
      {selectedItem && (
        <EditableModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedItem(null);
          }}
          modalId="view-inventory-item"
          title={`View ${selectedItem.name}`}
          size="lg"
          category="inventory"
        >
          <div style={{ padding: '1rem' }}>
            <h3>Item Details</h3>
            <div style={{ marginBottom: '1rem' }}>
              <strong>SKU:</strong> {selectedItem.sku}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Name:</strong> {selectedItem.name}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Category:</strong> {selectedItem.category}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Description:</strong> {selectedItem.description}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Current Stock:</strong> {selectedItem.currentStock} {selectedItem.unit}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Reorder Point:</strong> {selectedItem.reorderPoint}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Reorder Quantity:</strong> {selectedItem.reorderQuantity}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Unit Cost:</strong> ${selectedItem.unitCost.toFixed(2)}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Total Value:</strong> ${(selectedItem.currentStock * selectedItem.unitCost).toFixed(2)}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Supplier:</strong> {selectedItem.supplier}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Supplier SKU:</strong> {selectedItem.supplierSku}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Location:</strong> {selectedItem.location}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Status:</strong> {selectedItem.status}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Last Stock Update:</strong> {selectedItem.lastStockUpdate}
            </div>

            {/* Safety and Regulatory Information */}
            {(selectedItem.safetyDataSheet || selectedItem.regulatoryCompliance || selectedItem.requiresPpe) && (
              <>
                <hr style={{ margin: '1.5rem 0', borderColor: '#e0e0e0' }} />
                <h4 style={{ color: '#1976d2', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🛡️ Safety & Regulatory Information
                </h4>
              </>
            )}

            {selectedItem.requiresPpe && (
              <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fff3cd', borderRadius: '4px', border: '1px solid #ffeaa7' }}>
                <strong style={{ color: '#856404' }}>⚠️ PPE Required:</strong>
                <span style={{ color: '#856404', marginLeft: '0.5rem' }}>Personal Protective Equipment must be worn when handling this material</span>
              </div>
            )}

            {selectedItem.storageInstructions && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>🏭 Storage Instructions:</strong> {selectedItem.storageInstructions}
              </div>
            )}

            {selectedItem.handlingPrecautions && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>⚠️ Handling Precautions:</strong> {selectedItem.handlingPrecautions}
              </div>
            )}

            {selectedItem.hazardousWaste && (
              <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f8d7da', borderRadius: '4px', border: '1px solid #f5c6cb' }}>
                <strong style={{ color: '#721c24' }}>☢️ Hazardous Waste:</strong>
                <span style={{ color: '#721c24', marginLeft: '0.5rem' }}>Requires special disposal procedures</span>
              </div>
            )}

            {selectedItem.safetyDataSheet && (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>🛡️ SDS Number:</strong> {selectedItem.safetyDataSheet.sdsNumber}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>📄 SDS Version:</strong> {selectedItem.safetyDataSheet.version}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>📅 SDS Revision Date:</strong> {selectedItem.safetyDataSheet.revisionDate}
                </div>
                {selectedItem.safetyDataSheet.emergencyContact && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>🚨 Emergency Contact:</strong> {selectedItem.safetyDataSheet.emergencyContact}
                  </div>
                )}
                {selectedItem.safetyDataSheet.emergencyPhone && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>📞 Emergency Phone:</strong> {selectedItem.safetyDataSheet.emergencyPhone}
                  </div>
                )}
              </>
            )}

            {selectedItem.regulatoryCompliance?.astmStandards?.length && (
              <>
                <hr style={{ margin: '1.5rem 0', borderColor: '#e0e0e0' }} />
                <h4 style={{ color: '#1976d2', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  📋 ASTM Standards & Compliance
                </h4>
                {selectedItem.regulatoryCompliance.astmStandards.map((std, index) => (
                  <div key={index} style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#e3f2fd', borderRadius: '4px', border: '1px solid #bbdefb' }}>
                    <div><strong>📋 Standard:</strong> {std.standardNumber}</div>
                    <div><strong>📊 Status:</strong>
                      <span style={{
                        marginLeft: '0.5rem',
                        color: std.complianceStatus === 'Compliant' ? '#2e7d32' :
                              std.complianceStatus === 'Pending' ? '#f57c00' : '#d32f2f'
                      }}>
                        {std.complianceStatus}
                      </span>
                    </div>
                    {std.certificationDate && <div><strong>📅 Certified:</strong> {std.certificationDate}</div>}
                  </div>
                ))}
              </>
            )}

            {(selectedItem.qualityGrade || selectedItem.warrantyPeriod || selectedItem.fireRating || selectedItem.windRating) && (
              <>
                <hr style={{ margin: '1.5rem 0', borderColor: '#e0e0e0' }} />
                <h4 style={{ color: '#1976d2', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🏆 Quality & Performance
                </h4>
              </>
            )}

            {selectedItem.qualityGrade && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>⭐ Quality Grade:</strong> {selectedItem.qualityGrade}
              </div>
            )}

            {selectedItem.warrantyPeriod && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>🛡️ Warranty:</strong> {selectedItem.warrantyPeriod}
              </div>
            )}

            {selectedItem.fireRating && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>🔥 Fire Rating:</strong> {selectedItem.fireRating.classification} ({selectedItem.fireRating.testStandard})
              </div>
            )}

            {selectedItem.windRating && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>💨 Wind Rating:</strong> {selectedItem.windRating.maxWindSpeed} {selectedItem.windRating.unit} ({selectedItem.windRating.testStandard})
              </div>
            )}

            {selectedItem.weatherRating && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>🌤️ Weather Rating:</strong> UV Resistance: {selectedItem.weatherRating.uvResistance}
              </div>
            )}
          </div>
        </EditableModal>
      )}
    </Container>
  );
};

export default Inventory;