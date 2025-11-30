#!/usr/bin/env python3
"""
Document Generator - Automated documentation creation for Florida First Roofing
Generates consistent documentation, forms, and content based on schemas.
"""

import os
import json
import argparse
from pathlib import Path
from typing import Dict, List, Any
from jinja2 import Template, Environment, FileSystemLoader

class DocumentGenerator:
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.src_dir = self.project_root / "src"
        self.templates_dir = Path(__file__).parent / "templates"
        
        # Ensure templates directory exists
        self.templates_dir.mkdir(exist_ok=True)
        
        # Setup Jinja2 environment
        self.env = Environment(
            loader=FileSystemLoader(str(self.templates_dir)),
            trim_blocks=True,
            lstrip_blocks=True
        )
    
    def generate_component_documentation(self, module_name: str) -> str:
        """Generate documentation for a React component"""
        template = """
# {{ module_name|title }} Module Documentation

## Overview
The {{ module_name }} module handles {{ description }} in the Florida First Roofing Accounting System.

## Components

{% for component in components %}
### {{ component.name }}
**Location:** `{{ component.path }}`
**Purpose:** {{ component.description }}

#### Props Interface
```typescript
interface {{ component.name }}Props {
{% for prop in component.props %}
  {{ prop.name }}: {{ prop.type }}{% if not prop.required %}?{% endif %};
{% endfor %}
}
```

#### Usage Example
```tsx
import { {{ component.name }} } from '{{ component.import_path }}';

function {{ module_name|title }}Page() {
  return (
    <{{ component.name }}
{% for prop in component.props %}
      {{ prop.name }}={/* your value */}
{% endfor %}
    />
  );
}
```

{% endfor %}

## Data Flow
This module integrates with the following systems:
{% for integration in integrations %}
- **{{ integration.name }}**: {{ integration.description }}
{% endfor %}

## State Management
{% if uses_central_store %}
Uses the central store for data management:
- Customers: `useCentralStore(state => state.customers)`
- Projects: `useCentralStore(state => state.projects)`
{% else %}
Uses local state management with the following patterns:
- Component state for UI interactions
- Props drilling for data flow
{% endif %}

## API Integration
{% for api in api_endpoints %}
### {{ api.name }}
**Endpoint:** `{{ api.endpoint }}`
**Method:** {{ api.method }}
**Description:** {{ api.description }}
{% endfor %}

## Testing
Test files should cover:
{% for test_case in test_cases %}
- {{ test_case }}
{% endfor %}
"""
        
        # This would be populated by analyzing the actual module
        context = {
            "module_name": module_name,
            "description": f"{module_name} functionality",
            "components": [],
            "integrations": [],
            "uses_central_store": True,
            "api_endpoints": [],
            "test_cases": []
        }
        
        # Analyze the actual module files
        module_path = self.src_dir / "pages" / f"{module_name}.tsx"
        if module_path.exists():
            # Parse the component file to extract information
            context.update(self._analyze_component_file(module_path, module_name))
        
        t = Template(template)
        return t.render(**context)
    
    def _analyze_component_file(self, file_path: Path, module_name: str) -> Dict[str, Any]:
        """Analyze a React component file to extract documentation info"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract component name and basic info
            import re
            
            components = []
            imports = []
            props = []
            
            # Find component definitions
            component_matches = re.findall(r'export\s+(?:default\s+)?(?:function|const)\s+(\w+)', content)
            
            # Find imports
            import_matches = re.findall(r'import.*?from\s+[\'"]([^\'"]+)[\'"]', content)
            
            # Find prop types (basic extraction)
            prop_matches = re.findall(r'(\w+):\s*([^;,}]+)', content)
            
            return {
                "components": [{"name": comp, "path": str(file_path), "description": f"Main component for {module_name}"} for comp in component_matches],
                "integrations": self._find_integrations(content),
                "api_endpoints": self._find_api_endpoints(content),
                "test_cases": self._generate_test_cases(module_name)
            }
            
        except Exception as e:
            print(f"Error analyzing {file_path}: {e}")
            return {}
    
    def _find_integrations(self, content: str) -> List[Dict[str, str]]:
        """Find integration points in component content"""
        integrations = []
        
        if 'useCentralStore' in content:
            integrations.append({
                "name": "Central Store",
                "description": "Uses centralized state management for data consistency"
            })
        
        if 'eventBus' in content:
            integrations.append({
                "name": "Event Bus",
                "description": "Communicates with other modules via event system"
            })
        
        return integrations
    
    def _find_api_endpoints(self, content: str) -> List[Dict[str, str]]:
        """Find API endpoints used in component"""
        endpoints = []
        
        # Basic extraction of fetch calls and axios calls
        import re
        fetch_matches = re.findall(r'fetch\([\'"]([^\'"]+)[\'"]', content)
        for endpoint in fetch_matches:
            endpoints.append({
                "name": f"API Call to {endpoint}",
                "endpoint": endpoint,
                "method": "GET",  # Would need more analysis for actual method
                "description": "API endpoint integration"
            })
        
        return endpoints
    
    def _generate_test_cases(self, module_name: str) -> List[str]:
        """Generate suggested test cases for a module"""
        base_cases = [
            "Component renders without crashing",
            "All required props are handled correctly",
            "User interactions work as expected",
            "Data loading states are handled properly"
        ]
        
        module_specific = {
            "CRM": ["Customer creation workflow", "Lead conversion process"],
            "ProjectManagement": ["Project assignment", "Timeline updates"],
            "Invoicing": ["Invoice generation", "Payment processing"],
            "HumanResources": ["Employee onboarding", "Certification tracking"]
        }
        
        return base_cases + module_specific.get(module_name, [])
    
    def generate_form_component(self, schema: Dict[str, Any]) -> str:
        """Generate React form component from JSON schema"""
        template = """
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

{% for import in imports %}
import { {{ import }} } from '{{ imports[import] }}';
{% endfor %}

const FormContainer = styled(motion.div)`
  background: \${({ theme }) => theme.colors.surface};
  border-radius: \${({ theme }) => theme.borderRadius.lg};
  padding: \${({ theme }) => theme.spacing.xl};
  box-shadow: \${({ theme }) => theme.shadows.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: \${({ theme }) => theme.spacing.sm};
  margin-bottom: \${({ theme }) => theme.spacing.lg};
`;

const Label = styled.label`
  font-weight: 600;
  color: \${({ theme }) => theme.colors.text.primary};
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: \${({ theme }) => theme.spacing.md};
  border: 1px solid \${({ theme }) => theme.colors.border};
  border-radius: \${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: \${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  padding: \${({ theme }) => theme.spacing.md};
  border: 1px solid \${({ theme }) => theme.colors.border};
  border-radius: \${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  background: white;

  &:focus {
    outline: none;
    border-color: \${({ theme }) => theme.colors.primary};
  }
`;

interface {{ form_name }}Data {
{% for field in fields %}
  {{ field.name }}: {{ field.type }};
{% endfor %}
}

interface {{ form_name }}Props {
  onSubmit: (data: {{ form_name }}Data) => void;
  initialData?: Partial<{{ form_name }}Data>;
  isLoading?: boolean;
}

const {{ form_name }}: React.FC<{{ form_name }}Props> = ({ 
  onSubmit, 
  initialData = {}, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<{{ form_name }}Data>({
{% for field in fields %}
    {{ field.name }}: initialData.{{ field.name }} || {{ field.default }},
{% endfor %}
  });

  const [errors, setErrors] = useState<Partial<{{ form_name }}Data>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<{{ form_name }}Data> = {};

{% for field in fields %}
{% if field.required %}
    if (!formData.{{ field.name }}) {
      newErrors.{{ field.name }} = '{{ field.display_name }} is required';
    }
{% endif %}
{% endfor %}

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof {{ form_name }}Data, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <FormContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <form onSubmit={handleSubmit}>
{% for field in fields %}
        <FormGroup>
          <Label htmlFor="{{ field.name }}">{{ field.display_name }}{% if field.required %} *{% endif %}</Label>
{% if field.type == 'select' %}
          <Select
            id="{{ field.name }}"
            value={formData.{{ field.name }}}
            onChange={(e) => handleChange('{{ field.name }}', e.target.value)}
            disabled={isLoading}
          >
{% for option in field.options %}
            <option value="{{ option.value }}">{{ option.label }}</option>
{% endfor %}
          </Select>
{% else %}
          <Input
            id="{{ field.name }}"
            type="{{ field.input_type }}"
{% if field.type == 'number' %}
            min="{{ field.min or 0 }}"
{% endif %}
            value={formData.{{ field.name }}}
            onChange={(e) => handleChange('{{ field.name }}', 
              e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
            )}
            disabled={isLoading}
            placeholder="{{ field.placeholder }}"
          />
{% endif %}
{% if field.required %}
          {errors.{{ field.name }} && (
            <div style={{ color: 'red', fontSize: '0.75rem' }}>
              {errors.{{ field.name }}}
            </div>
          )}
{% endif %}
        </FormGroup>
{% endfor %}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '12px 24px',
            backgroundColor: '#1e40af',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          {isLoading ? 'Saving...' : '{{ submit_text }}'}
        </button>
      </form>
    </FormContainer>
  );
};

export default {{ form_name }};
"""
        
        # Process the schema to generate form fields
        fields = []
        imports = {"motion": "framer-motion"}
        
        for field_name, field_spec in schema.get("properties", {}).items():
            field_type = "string"
            input_type = "text"
            
            if field_spec.get("type") == "number":
                field_type = "number"
                input_type = "number"
            elif field_spec.get("enum"):
                field_type = "select"
                input_type = "select"
            
            fields.append({
                "name": field_name,
                "display_name": field_spec.get("title", field_name.replace("_", " ").title()),
                "type": field_type,
                "input_type": input_type,
                "required": field_name in schema.get("required", []),
                "placeholder": field_spec.get("description", ""),
                "default": field_spec.get("default", "" if field_type == "string" else 0),
                "options": [{"value": opt, "label": opt} for opt in field_spec.get("enum", [])]
            })
        
        t = Template(template)
        return t.render(
            form_name=schema.get("title", "Form"),
            fields=fields,
            imports=imports,
            submit_text=schema.get("submitText", "Submit")
        )

def main():
    parser = argparse.ArgumentParser(description="Document generator for Florida First Roofing")
    parser.add_argument("--module", help="Module name to generate documentation for")
    parser.add_argument("--output", help="Output directory for generated files")
    parser.add_argument("--form-schema", help="JSON schema file for form generation")
    parser.add_argument("--type", choices=["docs", "form"], default="docs", help="Type of generation")
    
    args = parser.parse_args()
    
    generator = DocumentGenerator(".")
    
    if args.type == "docs" and args.module:
        content = generator.generate_component_documentation(args.module)
        
        output_dir = Path(args.output or "docs")
        output_dir.mkdir(exist_ok=True)
        
        output_file = output_dir / f"{args.module}.md"
        with open(output_file, 'w') as f:
            f.write(content)
        
        print(f"✅ Generated documentation: {output_file}")
    
    elif args.type == "form" and args.form_schema:
        with open(args.form_schema, 'r') as f:
            schema = json.load(f)
        
        form_component = generator.generate_form_component(schema)
        
        output_dir = Path(args.output or "src/components/Forms")
        output_dir.mkdir(parents=True, exist_ok=True)
        
        form_name = schema.get("title", "Form")
        output_file = output_dir / f"{form_name}.tsx"
        
        with open(output_file, 'w') as f:
            f.write(form_component)
        
        print(f"✅ Generated form component: {output_file}")

if __name__ == "__main__":
    main()

