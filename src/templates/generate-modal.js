#!/usr/bin/env node

/**
 * Modal Generator Utility
 *
 * This script helps generate new customizable modals from the template.
 *
 * Usage:
 *   node src/templates/generate-modal.js <ModalName> [options]
 *
 * Examples:
 *   node src/templates/generate-modal.js AddEmployee --category=hr --path=src/components/HR
 *   node src/templates/generate-modal.js EditInvoice --category=accounting --size=xl
 *   node src/templates/generate-modal.js CreateTask --category=project-management
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log(`
🏗️  Modal Generator

Usage:
  node src/templates/generate-modal.js <ModalName> [options]

Options:
  --category=<category>    Modal category (hr, accounting, crm, etc.)
  --path=<path>           Output directory (default: src/components)
  --size=<size>           Modal size (sm, md, lg, xl)
  --fields=<fields>       Comma-separated list of default fields

Examples:
  node src/templates/generate-modal.js AddEmployee --category=hr
  node src/templates/generate-modal.js EditInvoice --category=accounting --size=xl
  node src/templates/generate-modal.js CreateTask --category=project-management --path=src/components/Tasks
  `);
  process.exit(0);
}

const modalName = args[0];
const options = {};

// Parse options
args.slice(1).forEach(arg => {
  if (arg.startsWith('--')) {
    const [key, value] = arg.substring(2).split('=');
    options[key] = value || true;
  }
});

// Set defaults
const category = options.category || 'other';
const outputPath = options.path || 'src/components';
const size = options.size || 'md';
const fields = options.fields ? options.fields.split(',') : ['name', 'description'];

// Generate modal ID from name
const modalId = modalName
  .replace(/([A-Z])/g, '-$1')
  .toLowerCase()
  .substring(1);

// Generate interface name and file name
const interfaceName = modalName.replace(/Modal$/, '') + 'FormData';
const fileName = modalName + '.tsx';
const filePath = path.join(outputPath, fileName);

console.log(`🚀 Generating modal: ${modalName}`);
console.log(`📁 Output path: ${filePath}`);
console.log(`🏷️  Modal ID: ${modalId}`);
console.log(`📋 Category: ${category}`);
console.log(`📏 Size: ${size}`);
console.log(`🔧 Fields: ${fields.join(', ')}`);

// Read template file
const templatePath = path.join(__dirname, 'CustomizableModalTemplate.tsx');
if (!fs.existsSync(templatePath)) {
  console.error('❌ Template file not found:', templatePath);
  process.exit(1);
}

let templateContent = fs.readFileSync(templatePath, 'utf8');

// Replace template placeholders
templateContent = templateContent
  // Replace component name
  .replace(/TemplateModal/g, modalName)
  .replace(/TemplateModalProps/g, modalName + 'Props')
  .replace(/TemplateFormData/g, interfaceName)

  // Replace modal configuration
  .replace(/modalId="template-modal"/g, `modalId="${modalId}"`)
  .replace(/title="Template Modal"/g, `title="${modalName.replace(/([A-Z])/g, ' $1').trim()}"`)
  .replace(/category="template"/g, `category="${category}"`)
  .replace(/size="lg"/g, `size="${size}"`)

  // Replace default fields variable name
  .replace(/defaultTemplateFields/g, `default${modalName.replace(/Modal$/, '')}Fields`)

  // Update comments
  .replace(/TODO: Rename this component to match your use case/g, `Component: ${modalName}`)
  .replace(/Examples: AddEmployeeModal, EditInvoiceModal, CreateTaskModal/g, `Generated: ${modalName}`);

// Generate custom fields based on provided field names
if (fields.length > 0) {
  const customFields = fields.map((field, index) => {
    const fieldType = getFieldType(field);
    const fieldLabel = field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1');

    return `  {
    id: '${field}',
    type: '${fieldType}',
    label: '${fieldLabel}',
    placeholder: 'Enter ${field.toLowerCase()}',
    required: ${index < 2 ? 'true' : 'false'},
    order: ${index}
  }`;
  }).join(',\n');

  // Replace the default fields array
  const fieldsArrayRegex = /const defaultTemplateFields: ModalField\[\] = \[([\s\S]*?)\];/;
  const replacement = `const default${modalName.replace(/Modal$/, '')}Fields: ModalField[] = [
${customFields}
];`;

  templateContent = templateContent.replace(fieldsArrayRegex, replacement);
}

// Create output directory if it doesn't exist
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
  console.log(`📁 Created directory: ${outputPath}`);
}

// Write the file
fs.writeFileSync(filePath, templateContent);

console.log(`✅ Modal generated successfully!`);
console.log(`\n📝 Next steps:`);
console.log(`1. Review and customize the generated file: ${filePath}`);
console.log(`2. Update the interface properties to match your needs`);
console.log(`3. Implement the handleSubmit function logic`);
console.log(`4. Import and use your modal in your component`);
console.log(`\n🔧 Example usage:`);
console.log(`import ${modalName} from '${filePath.replace('src/', './')}'`);
console.log(`
<${modalName}
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onSave={(data) => handleSave(data)}
/>`);

// Helper function to determine field type based on field name
function getFieldType(fieldName) {
  const name = fieldName.toLowerCase();

  if (name.includes('email')) return 'email';
  if (name.includes('phone')) return 'phone';
  if (name.includes('date')) return 'date';
  if (name.includes('amount') || name.includes('price') || name.includes('cost') || name.includes('salary')) return 'currency';
  if (name.includes('count') || name.includes('quantity') || name.includes('number') || name.includes('age')) return 'number';
  if (name.includes('description') || name.includes('notes') || name.includes('comment') || name.includes('address')) return 'textarea';
  if (name.includes('status') || name.includes('type') || name.includes('category') || name.includes('priority')) return 'select';
  if (name.includes('agree') || name.includes('accept') || name.includes('enable') || name.includes('active')) return 'checkbox';

  return 'text';
}