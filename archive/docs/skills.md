# 🎯 Claude Code Skills & Best Practices Guide
## Florida First Roofing Accounting System

### 🚨 CRITICAL CONSISTENCY RULES

#### **NEVER** Do These Things:
1. **DO NOT** create `.backup` files or duplicate existing files
2. **DO NOT** modify working code without understanding its purpose
3. **DO NOT** introduce TypeScript errors or break existing functionality
4. **DO NOT** create inconsistent file structures or naming conventions
5. **DO NOT** make "enhancements" that break existing workflows

#### **ALWAYS** Follow These Guidelines:

### 1. Code Consistency & Maintenance
- **Read existing code** before making any changes
- **Maintain existing patterns** and conventions
- **Update ALL related files** when changing interfaces or types
- **Use TypeScript strictly** - fix all type errors immediately
- **Test changes** before considering the task complete

### 2. File Management Rules
- **One source of truth** - eliminate duplicate files and content
- **Consistent naming** - use established conventions (PascalCase for components, camelCase for functions)
- **Proper imports** - use exact imports, avoid relative path inconsistencies
- **Clean up** - remove unused imports and dead code

### 3. TypeScript & Code Quality
- **Strict typing** - no `any` types in production code
- **Interface consistency** - ensure types match across all modules
- **Error handling** - implement proper try/catch and validation
- **ESLint compliance** - fix all warnings before committing changes

### 4. React & Component Standards
- **Functional components** with proper hooks usage
- **Proper dependency arrays** in useEffect, useMemo, useCallback
- **Memoization** for expensive operations
- **Error boundaries** for component error handling

### 5. State Management
- **Use Central Store** (`useCentralStore`) for cross-module data
- **Event Bus** for inter-component communication
- **Local state** only for component-specific UI state
- **Proper state updates** - immutable updates, proper callbacks

---

## 🛠️ SKILLS NEEDED FOR PRODUCTION LAUNCH

### Core Development Skills
1. **TypeScript Mastery**
   - Strict type checking and interface consistency
   - Proper generic usage and type guards
   - Error handling with typed exceptions

2. **React 19 Best Practices**
   - Functional components with proper hooks
   - Performance optimization (memo, useMemo, useCallback)
   - Proper state lifecycle management

3. **State Management Architecture**
   - Zustand store patterns
   - Event-driven architecture
   - Data consistency validation

4. **Backend Integration**
   - Express.js API development
   - SQLite database optimization
   - Authentication and security

### Testing & Quality Assurance
1. **Unit Testing**
   - Jest and React Testing Library
   - Component testing patterns
   - Mock implementations

2. **Integration Testing**
   - API endpoint testing
   - Database integration tests
   - Cross-module data flow testing

3. **E2E Testing**
   - Playwright automation
   - User journey validation
   - Performance testing

### Security & Production Readiness
1. **Authentication System**
   - JWT token management
   - Role-based access control
   - Secure password handling

2. **Input Validation**
   - Client and server-side validation
   - SQL injection prevention
   - XSS protection

3. **Environment Management**
   - Proper configuration management
   - Secrets handling
   - Production environment setup

### DevOps & Deployment
1. **Docker Containerization**
   - Multi-stage builds
   - Environment-specific configurations
   - Health checks and monitoring

2. **CI/CD Pipeline**
   - Automated testing
   - Code quality gates
   - Deployment automation

3. **Database Management**
   - Migration scripts
   - Backup and recovery
   - Performance optimization

### Business Logic & Domain Knowledge
1. **Accounting Principles**
   - Double-entry bookkeeping
   - Chart of accounts management
   - Financial reporting

2. **Construction Industry**
   - Job costing and project management
   - Customer relationship management
   - Document and compliance management

3. **Florida Building Codes**
   - HVHZ (High-Velocity Hurricane Zone) compliance
   - Miami-Dade NOA requirements
   - Standard operating procedures

---

## 📋 DEVELOPMENT WORKFLOW

### Before Making Any Changes:
1. **Read the existing code** thoroughly
2. **Understand the business context** and requirements
3. **Identify all related files** that may need updates
4. **Plan the change** and its impact

### During Development:
1. **Make incremental changes** - one logical unit at a time
2. **Update all related interfaces** and types simultaneously
3. **Test immediately** after each change
4. **Fix TypeScript errors** as they appear

### After Changes:
1. **Run full test suite** to ensure nothing is broken
2. **Check for linting errors** and fix them
3. **Verify cross-module integration** still works
4. **Update documentation** if interfaces change

### Code Review Checklist:
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] All imports are correct and used
- [ ] No duplicate code or files created
- [ ] Existing functionality preserved
- [ ] New code follows established patterns
- [ ] Tests pass for affected components
- [ ] Cross-module integration verified

---

## 🎯 PRODUCTION READINESS CHECKLIST

### Security & Authentication
- [ ] Replace mock authentication with real system
- [ ] Implement secure JWT tokens
- [ ] Add proper input validation
- [ ] Configure CORS for production
- [ ] Set up environment variables properly

### Testing & Quality
- [ ] Achieve minimum 80% test coverage
- [ ] All critical user journeys tested
- [ ] API endpoints fully tested
- [ ] Database operations validated
- [ ] Error handling comprehensive

### Performance & Scalability
- [ ] Bundle size optimized
- [ ] Database queries optimized
- [ ] Implement proper caching
- [ ] Add performance monitoring
- [ ] Configure CDN for static assets

### Monitoring & Operations
- [ ] Set up error tracking
- [ ] Implement health checks
- [ ] Configure logging system
- [ ] Set up backup procedures
- [ ] Create deployment documentation

---

## 🔧 AUTOMATED TOOLS & SCRIPTS

### Available in `/skills/` folder:
1. **Document Generation** - Python scripts for automated content creation
2. **Form Builder** - Automated form generation from schemas
3. **Code Quality** - Automated linting and type checking
4. **Testing** - Automated test generation and execution
5. **Content Management** - SOP and template management

### Usage:
```bash
# Run quality checks
python skills/quality_check.py

# Generate documentation
python skills/generate_docs.py --module crm

# Create forms from schema
python skills/form_builder.py --input schema.json --output FormComponent.tsx
```

---

## 📚 REFERENCE MATERIALS

### Key Files to Understand:
- `/src/stores/centralStore.ts` - Central state management
- `/src/types/unified.ts` - Core type definitions
- `/src/contexts/DataContext.tsx` - Data sharing across modules
- `/backend/server.js` - API server setup
- `/database/schema.sql` - Database structure

### External Resources:
- [React 19 Documentation](https://react.dev/)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
- [Zustand State Management](https://zustand-demo.pmnd.rs/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)

---

## ⚠️ CRITICAL WARNINGS

### **DO NOT BREAK:**
1. **Central Store** - This manages all cross-module data
2. **Type Definitions** - These ensure consistency across modules
3. **Event Bus** - This handles inter-component communication
4. **Database Schema** - Any changes must be backward compatible

### **ALWAYS VERIFY:**
1. **Customer Data Flow** - CRM → Project → Invoice integration
2. **Employee Management** - HR → Project assignment workflows
3. **Document Generation** - PDF and form generation still works
4. **Authentication** - User login and permissions function correctly

---

*This guide ensures consistent, high-quality development practices for the Florida First Roofing Accounting System. Follow these guidelines to maintain code quality and prevent the issues described in the user's request.*

