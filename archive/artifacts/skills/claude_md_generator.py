#!/usr/bin/env python3
"""
Claude MD Generator - Creates and maintains the claude.md file
Ensures consistent development practices and prevents code quality issues.
"""

import os
import json
import argparse
from pathlib import Path
from typing import Dict, List, Any
from datetime import datetime

class ClaudeMDGenerator:
    def __init__(self, project_root: str):
        self.project_root = Path(project_root)
        self.package_json = self.project_root / "package.json"
        self.tsconfig = self.project_root / "tsconfig.json"
        self.claude_md = self.project_root / "claude.md"
        
    def analyze_project_structure(self) -> Dict[str, Any]:
        """Analyze the current project structure to generate accurate information"""
        structure = {
            "modules": [],
            "dependencies": {},
            "scripts": {},
            "typescript_config": {},
            "src_structure": {}
        }
        
        # Read package.json
        if self.package_json.exists():
            with open(self.package_json, 'r') as f:
                pkg = json.load(f)
                structure["dependencies"] = {
                    "dependencies": list(pkg.get("dependencies", {}).keys()),
                    "dev_dependencies": list(pkg.get("devDependencies", {}).keys())
                }
                structure["scripts"] = pkg.get("scripts", {})
        
        # Read TypeScript config
        if self.tsconfig.exists():
            with open(self.tsconfig, 'r') as f:
                ts_config = json.load(f)
                structure["typescript_config"] = ts_config
        
        # Analyze src directory structure
        src_dir = self.project_root / "src"
        if src_dir.exists():
            structure["src_structure"] = self._analyze_src_directory(src_dir)
        
        return structure
    
    def _analyze_src_directory(self, src_dir: Path) -> Dict[str, List[str]]:
        """Analyze source directory structure"""
        structure = {}
        
        for item in src_dir.iterdir():
            if item.is_dir():
                files = [f.name for f in item.rglob("*.tsx") if f.is_file()]
                structure[item.name] = files[:10]  # Limit to first 10 files
            elif item.suffix in ['.tsx', '.ts']:
                if 'files' not in structure:
                    structure['files'] = []
                structure['files'].append(item.name)
        
        return structure
    
    def generate_claude_md(self, structure: Dict[str, Any]) -> str:
        """Generate the claude.md content based on project analysis"""
        
        # Extract key information
        dependencies = structure["dependencies"].get("dependencies", [])
        dev_deps = structure["dependencies"].get("dev_dependencies", [])
        scripts = structure["scripts"]
        modules = list(structure["src_structure"].keys())
        
        # Identify key technologies
        react_version = "19" if any("react" in dep for dep in dependencies) else "Unknown"
        typescript = "Yes" if "typescript" in dev_deps else "No"
        
        claude_md_content = f"""# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Florida First Roofing Accounting is a comprehensive full-stack React application for roofing business management, combining customer relationship management, project tracking, invoicing, human resources, and accounting functionality. The application includes an integrated Learning Management System (LMS) and Standard Operating Procedures (SOP) management.

## Technology Stack

- **Frontend**: React {react_version} with TypeScript, styled-components, Framer Motion
- **Backend**: Express.js with better-sqlite3 database
- **State Management**: Zustand for complex state, React Context for unified data sharing
- **UI Framework**: Custom components with Headless UI and Lucide React icons
- **Routing**: React Router DOM
- **Charts**: Recharts for data visualization
- **PDF Generation**: jsPDF with html2canvas
- **Security**: Helmet, CORS, express-rate-limit, bcryptjs, jsonwebtoken
- **Testing**: Jest with React Testing Library, Playwright for E2E testing

## Common Commands

### Initial Setup
```bash
# Environment setup
cp .env.example .env.development
npm run setup                # Install dependencies and setup database
```

### Development
```bash
# Development servers
npm run dev                  # Start both frontend and backend concurrently
npm start                    # Frontend only (React dev server on :3000)
npm run backend              # Backend only (Express API on :5001)
npm run full-stack           # Reset database and start dev servers

# Database operations
npm run setup-db             # Initialize SQLite database from schema
npm run seed-data            # Add sample data to database
npm run reset-db             # Drop, recreate, and seed database
```

### Code Quality
```bash
# Linting and formatting
npm run lint                 # Check TypeScript/JavaScript code
npm run lint:fix             # Auto-fix linting issues
npm run format               # Format code with Prettier
npm run type-check           # TypeScript type checking without compilation

# Testing
npm run test                 # Interactive test runner with watch mode
npm run test:unit            # Unit tests with coverage (no watch mode)
npm run test:e2e             # Run Playwright end-to-end tests
npm run test:all             # Run all tests (unit + e2e)
```

### Production
```bash
npm run build                # Production build
npm run build:analyze        # Build with bundle analyzer
npm run health-check         # Check frontend and backend health
```

## Architecture Overview

### Application Structure
The application follows a modular full-stack architecture with clear separation between frontend and backend concerns. Key architectural patterns include:

**Data Flow**:
- Central data management through `DataContext` (src/contexts/DataContext.tsx) providing unified customer and job data across all modules
- LocalStorage persistence with automatic sync for client-side data
- Event bus pattern for cross-module communication (src/events/eventBus.ts)
- Automatic document generation when jobs are created

**Component Architecture**:
- Centralized theme system using styled-components `ThemeProvider`
- Responsive design with mobile-first approach
- Framer Motion animations for page transitions
- Fixed sidebar layout with responsive main content area

**Backend Structure**:
- Express.js server on port 5001 (configurable via PORT env var)
- SQLite database with better-sqlite3 for performance and typing
- Comprehensive middleware stack: authentication, logging, error handling, rate limiting
- RESTful API design with proper HTTP methods and status codes

### Project Structure
```
src/
├── components/             # Reusable UI components
│   ├── Layout/            # Sidebar, Header, navigation
│   ├── Forms/             # Form components and validation
│   └── Charts/            # Chart and visualization components
├── pages/                 # Main application pages/modules
├── contexts/              # React Context providers
│   └── DataContext.tsx    # Central data management
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── data/                  # Static data and JSON files
└── services/              # API and external service integrations

backend/
├── routes/                # Express route handlers
├── middleware/            # Authentication, validation, error handling
├── utils/                # Backend utilities
└── server.js             # Main Express server

database/
├── schema.sql             # Database schema
├── seed-data.sql          # Sample data
└── lms-*.sql              # Learning Management System tables
```

## CRITICAL DEVELOPMENT RULES

### 🚨 NEVER DO THESE THINGS:
1. **DO NOT** create backup files (.backup, .bak, etc.) - use git version control instead
2. **DO NOT** modify working code without understanding its full context and dependencies
3. **DO NOT** introduce TypeScript errors or break existing functionality
4. **DO NOT** create duplicate components or interfaces
5. **DO NOT** make "enhancements" that break existing workflows without approval

### ✅ ALWAYS FOLLOW THESE GUIDELINES:

#### Code Consistency & Maintenance
- **Read existing code thoroughly** before making any changes
- **Maintain existing patterns** and naming conventions
- **Update ALL related files** when changing interfaces or types
- **Use TypeScript strictly** - fix all type errors immediately
- **Test changes** before considering the task complete

#### File Management Rules
- **One source of truth** - eliminate duplicate files and content
- **Consistent naming** - use established conventions (PascalCase for components, camelCase for functions)
- **Proper imports** - use exact imports, avoid relative path inconsistencies
- **Clean up** - remove unused imports and dead code

#### State Management
- **Use Central Store** (`useCentralStore`) for cross-module data sharing
- **Event Bus** for inter-component communication
- **Local state** only for component-specific UI state
- **Proper state updates** - immutable updates, proper callbacks

#### TypeScript & Code Quality
- **Strict typing** - no `any` types in production code
- **Interface consistency** - ensure types match across all modules
- **Error handling** - implement proper try/catch and validation
- **ESLint compliance** - fix all warnings before committing changes

### Key Business Logic

#### Roofing-Specific Features
- **Job Types**: Re-Roof, Repair, New Construction, Maintenance
- **Material Tracking**: Shingle, Metal, Tile, TPO, EPDM materials
- **Customer Types**: Residential, Commercial, Insurance claim support
- **Document Workflow**: Automatic proposal and contract generation

#### Integration Points
- **CRM to Project Management**: Customer data flows to job creation
- **Project Management to Invoicing**: Job costs become invoice line items
- **Document Management**: Auto-generated PDFs with job and customer data
- **Training System**: Employee certification tracking integrated with HR
- **SOP Management**: Comprehensive standard operating procedures with database integration

### Environment Setup

#### Required Environment Files
- `.env.development` - Development configuration
- `.env.production` - Production configuration
- `.env.example` - Template with required variables

#### Port Configuration
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5001` (configurable via PORT env var)
- Health Check: `http://localhost:5001/health`

## Development Guidelines

### Database Commands
- Always use `npm run reset-db` when schema changes are made
- Use `npm run seed-data` to populate with sample data for development
- Database file: `database.sqlite` (ignored in git)

### Component Development
- Follow existing styled-components patterns for theming
- Use TypeScript interfaces from `/src/types/` directory
- Implement responsive design with theme breakpoints
- Add Framer Motion animations for page transitions

### Testing Strategy
- **Unit Tests**: Jest with React Testing Library (`npm run test:unit`)
- **E2E Tests**: Playwright integration
- **Integration Tests**: Cross-module data flow verification
- **Health Checks**: API endpoint monitoring

## Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Kill processes on ports 3000/5001
lsof -ti:3000 | xargs kill -9
lsof -ti:5001 | xargs kill -9
```

**Database issues:**
```bash
# Reset database completely
npm run reset-db
```

**Dependency conflicts:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Important Implementation Notes

### Code Style and Formatting
- **ESLint**: Extended from `react-app` and `react-app/jest`
- **Prettier**: Configured with custom rules for JSON and Markdown
- **TypeScript**: Strict mode enabled with React JSX transform

### Key Architectural Decisions
- **Database**: Uses better-sqlite3 instead of sqlite3 for better performance and typing
- **State Management**: Unified DataContext pattern with Zustand for complex state
- **Routing**: React Router DOM with animated page transitions
- **Styling**: styled-components with a comprehensive theme system
- **Component Structure**: Pages consume data from DataContext, components are stateless where possible

### Critical Development Patterns
- **LocalStorage Sync**: All data changes persist to localStorage automatically
- **Document Auto-Generation**: Jobs trigger automatic proposal/contract creation
- **Cross-Module Communication**: Event bus pattern for module integration
- **Responsive Design**: Mobile-first approach with styled-components breakpoints
- **Error Handling**: Comprehensive error boundaries and logging throughout the app

*Last Updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
"""
        
        return claude_md_content
    
    def update_claude_md(self) -> bool:
        """Update the claude.md file with current project information"""
        print("🔍 Analyzing project structure...")
        
        structure = self.analyze_project_structure()
        content = self.generate_claude_md(structure)
        
        try:
            with open(self.claude_md, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"✅ Updated {self.claude_md}")
            return True
            
        except Exception as e:
            print(f"❌ Error updating claude.md: {e}")
            return False

def main():
    parser = argparse.ArgumentParser(description="Generate or update claude.md file")
    parser.add_argument("--project-root", default=".", help="Project root directory")
    parser.add_argument("--analyze-only", action="store_true", help="Only analyze structure, don't update file")
    
    args = parser.parse_args()
    
    generator = ClaudeMDGenerator(args.project_root)
    
    if args.analyze_only:
        structure = generator.analyze_project_structure()
        print(json.dumps(structure, indent=2))
    else:
        success = generator.update_claude_md()
        if success:
            print("🎉 Claude.md updated successfully!")
        else:
            print("💥 Failed to update claude.md")
            return 1
    
    return 0

if __name__ == "__main__":
    exit(main())

