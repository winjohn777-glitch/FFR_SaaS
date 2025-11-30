# Customizable Modal System - Quick Start Guide

This directory contains templates and utilities for creating modals with built-in customization capabilities in the Florida First Roofing application.

## Features

- **Runtime Field Customization**: Users can add, remove, and modify form fields without code changes
- **Automatic Document Generation**: Modal data automatically integrates with PDF and document generation
- **Drag & Drop Field Ordering**: Visual editor for reordering form fields
- **Import/Export Structures**: Share modal configurations between environments
- **Validation & Type Safety**: Built-in validation for all field types
- **Responsive Design**: Mobile-first design with proper accessibility

## Quick Start

### 1. Copy the Template

```bash
cp src/templates/CustomizableModalTemplate.tsx src/components/YourModule/YourModal.tsx
```

### 2. Customize the Modal

Open `YourModal.tsx` and update:

```tsx
// 1. Update the modalId (must be unique)
modalId="add-employee" // Instead of "template-modal"

// 2. Update the title
title="Add Employee" // Instead of "Template Modal"

// 3. Update the category
category="hr" // Instead of "template"

// 4. Update the interface
interface EmployeeFormData {
  firstName: string;
  lastName: string;
  position: string;
  salary: string;
  startDate: string;
}

// 5. Update default fields
const defaultEmployeeFields: ModalField[] = [
  {
    id: 'firstName',
    type: 'text',
    label: 'First Name',
    placeholder: 'Enter first name',
    required: true,
    order: 0
  },
  // ... more fields
];
```

### 3. Use Your Modal

```tsx
import EmployeeModal from './components/HR/EmployeeModal';

function YourComponent() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Add Employee
      </button>

      <EmployeeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={(data) => {
          console.log('Employee data:', data);
          // Save to your data store
        }}
      />
    </>
  );
}
```

## Field Types Available

| Type | Description | Example |
|------|-------------|---------|
| `text` | Single-line text input | Name, Title |
| `email` | Email input with validation | user@example.com |
| `phone` | Phone number with formatting | (555) 123-4567 |
| `number` | Numeric input | Age, Quantity |
| `currency` | Money input with $ formatting | $1,234.56 |
| `date` | Date picker | 2024-01-15 |
| `textarea` | Multi-line text | Description, Notes |
| `select` | Dropdown selection | Categories, Status |
| `checkbox` | Boolean input | Agree to terms |
| `file` | File upload | Documents, Images |

## Modal Configuration Options

### Size Options
```tsx
size="sm"  // Small modal (400px)
size="md"  // Medium modal (600px) - default
size="lg"  // Large modal (800px)
size="xl"  // Extra large modal (1200px)
```

### Categories
Organize your modals by module:
- `crm` - Customer relationship management
- `project-management` - Project and job tracking
- `accounting` - Financial and invoicing
- `hr` - Human resources
- `inventory` - Material and equipment
- `other` - General purpose

## Document Integration

Your modal data automatically integrates with the document generation system:

1. **Customer modals** → Invoice generation
2. **Project modals** → Proposals and contracts
3. **Job modals** → Work orders and reports

Custom fields added by users will appear in the "Additional Information" section of generated documents.

## User Experience

### For End Users
1. **Add/Edit Data**: Use the modal normally to enter information
2. **Customize Fields**: Click the edit button (⚙️) in the modal header
3. **Add Fields**: Use the "Add Field" button in structure editor
4. **Reorder Fields**: Drag and drop fields to reorder
5. **Generate Documents**: Click the document button (📄) to create PDFs

### Field Customization Options
- **Field Type**: Choose from 10+ field types
- **Label**: Custom display name
- **Placeholder**: Helpful input hints
- **Required**: Mark fields as mandatory
- **Options**: For select fields, add custom choices
- **Validation**: Set min/max values, patterns
- **Order**: Drag to reposition

## Advanced Features

### Field Validation
```tsx
{
  id: 'salary',
  type: 'currency',
  label: 'Annual Salary',
  required: true,
  validation: {
    min: 30000,
    max: 200000
  }
}
```

### Conditional Fields
Fields can be shown/hidden based on other field values (future feature).

### Field Groups
Organize related fields together (future feature).

## Best Practices

1. **Unique IDs**: Always use unique modalId values
2. **Clear Labels**: Use descriptive field labels
3. **Logical Order**: Order fields in a natural sequence
4. **Required Fields**: Mark essential fields as required
5. **Help Text**: Add placeholders to guide users
6. **Validation**: Include appropriate validation rules

## Troubleshooting

### Modal Not Appearing
- Check that `isOpen={true}` is set
- Verify modal ID is unique
- Check console for JavaScript errors

### Fields Not Saving
- Ensure field IDs match your data interface
- Check that onSave callback is implemented
- Verify localStorage permissions

### Document Generation Issues
- Confirm modal data is populated
- Check that DocumentGenerationService can access the data
- Verify PDF generation dependencies are loaded

## Examples

### Simple Contact Modal
```tsx
const contactFields: ModalField[] = [
  {
    id: 'name',
    type: 'text',
    label: 'Full Name',
    required: true,
    order: 0
  },
  {
    id: 'email',
    type: 'email',
    label: 'Email Address',
    required: true,
    order: 1
  },
  {
    id: 'phone',
    type: 'phone',
    label: 'Phone Number',
    required: false,
    order: 2
  }
];
```

### Invoice Modal
```tsx
const invoiceFields: ModalField[] = [
  {
    id: 'invoiceNumber',
    type: 'text',
    label: 'Invoice Number',
    required: true,
    order: 0
  },
  {
    id: 'amount',
    type: 'currency',
    label: 'Amount',
    required: true,
    validation: { min: 0 },
    order: 1
  },
  {
    id: 'dueDate',
    type: 'date',
    label: 'Due Date',
    required: true,
    order: 2
  }
];
```

## Support

For questions or issues with the modal system:

1. Check this documentation first
2. Review the template comments
3. Look at existing modal implementations
4. Test in the browser developer tools

The customizable modal system is designed to grow with your application's needs while maintaining consistency and usability.