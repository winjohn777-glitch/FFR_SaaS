# 🛠️ Skills Automation Tools
## Florida First Roofing Accounting System

This folder contains Python automation scripts and tools to maintain consistency, generate content, and manage the development workflow.

## 📁 Available Tools

### Content & Documentation Generation
- **`document_generator.py`** - Automated markdown and documentation creation
- **`sop_manager.py`** - Standard Operating Procedure content management
- **`form_builder.py`** - React form component generation from schemas

### Code Quality & Maintenance
- **`quality_checker.py`** - Automated code quality validation
- **`type_validator.py`** - TypeScript consistency checking
- **`duplicate_finder.py`** - Identify and resolve code duplication

### Testing & Validation
- **`test_generator.py`** - Automated test case generation
- **`integration_validator.py`** - Cross-module integration testing
- **`performance_monitor.py`** - Performance benchmarking

## 🚀 Quick Start

```bash
# Install Python dependencies
pip install -r requirements.txt

# Run quality checks
python skills/quality_checker.py --type all

# Generate documentation for a module
python skills/document_generator.py --module crm --output ../docs/

# Create new form component
python skills/form_builder.py --input schema.json --output ../src/components/Forms/
```

## 🔧 Configuration

Each script accepts command-line arguments and can be configured via environment variables or configuration files. See individual script documentation for details.

## 📋 Prerequisites

- Python 3.8+
- Node.js and npm (for TypeScript validation)
- Access to the project's src/ directory

