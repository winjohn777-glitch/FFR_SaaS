# PROJECT REORGANIZATION PLAN

## Current Issues
- 74 test files scattered in root directory
- 4,858 markdown files throughout project
- 140 HTML files in wrong locations
- Multiple duplicate directory structures
- Root directory has 100+ files (should have <20)
- Production code mixed with development artifacts

## Target Production Structure

```
florida-first-roofing-accounting/
├── README.md                     # Main project documentation
├── package.json                  # Dependencies and scripts
├── package-lock.json            # Lock file
├── tsconfig.json                # TypeScript configuration
├── jest.config.js               # Test configuration
├── playwright.config.ts         # E2E test configuration
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── CHANGELOG.md                 # Version history
├── LICENSE                      # License file
│
├── src/                         # Frontend React application
│   ├── components/              # Reusable UI components
│   ├── pages/                   # Application pages/routes
│   ├── hooks/                   # Custom React hooks
│   ├── contexts/                # React Context providers
│   ├── types/                   # TypeScript type definitions
│   ├── utils/                   # Utility functions
│   ├── services/                # API services
│   ├── data/                    # Static data and constants
│   ├── App.tsx                  # Main App component
│   ├── index.tsx                # React entry point
│   └── index.css                # Global styles
│
├── server/                      # Backend Express application
│   ├── routes/                  # API route handlers
│   ├── middleware/              # Express middleware
│   ├── models/                  # Database models
│   ├── controllers/             # Business logic
│   ├── utils/                   # Backend utilities
│   ├── config/                  # Server configuration
│   └── server.js                # Express server entry
│
├── database/                    # Database schema and migrations
│   ├── schema.sql               # Database schema
│   ├── migrations/              # Database migrations
│   ├── seeds/                   # Sample data
│   └── backup/                  # Database backups
│
├── tests/                       # All test files
│   ├── unit/                    # Unit tests
│   ├── integration/             # Integration tests
│   ├── e2e/                     # End-to-end tests
│   ├── fixtures/                # Test data
│   └── utils/                   # Test utilities
│
├── docs/                        # Project documentation
│   ├── api/                     # API documentation
│   ├── deployment/              # Deployment guides
│   ├── development/             # Development setup
│   └── user-guide/              # User documentation
│
├── scripts/                     # Build and utility scripts
│   ├── build.sh                 # Production build
│   ├── deploy.sh                # Deployment script
│   ├── setup-db.sh              # Database setup
│   └── backup.sh                # Backup utilities
│
├── public/                      # Static assets
│   ├── images/                  # Image assets
│   ├── icons/                   # Icon files
│   └── index.html               # HTML template
│
├── content/                     # Business content (SOPs, etc.)
│   ├── sops/                    # Standard Operating Procedures
│   ├── templates/               # Document templates
│   ├── training/                # Training materials
│   └── policies/                # Company policies
│
├── config/                      # Configuration files
│   ├── .eslintrc.js             # ESLint configuration
│   ├── .prettierrc              # Prettier configuration
│   ├── docker/                  # Docker configurations
│   └── deployment/              # Deployment configurations
│
└── tools/                       # Development tools
    ├── generators/              # Code generators
    ├── analyzers/               # Code analysis tools
    └── migration/               # Migration utilities
```

## Implementation Steps

1. **Create new directory structure**
2. **Move core application files** to proper locations
3. **Consolidate all test files** into tests/ directory
4. **Move documentation** to docs/ directory
5. **Separate content** from application code
6. **Clean up root directory** to essential files only
7. **Update import paths** and configurations
8. **Test application functionality**
9. **Update documentation** with new structure

## Files to Archive/Remove

### Test Files (move to tests/)
- All test-*.spec.ts files in root
- All test-*.js files in root
- playwright.config.ts adjustments

### Documentation (move to docs/)
- All *.md files except README.md and CHANGELOG.md
- HTML content files
- Quality reports

### Content (move to content/)
- SOP files from database/
- Training materials
- Template files

### Development Artifacts (archive)
- Duplicate analysis files
- Build reports
- Screenshots
- Temporary files

## Configuration Updates Required

- Update package.json scripts
- Adjust jest.config.js paths
- Update playwright.config.ts
- Adjust tsconfig.json paths
- Update import statements
- Adjust API routes
- Update database connection paths

## Success Criteria

- Root directory has <20 files
- All tests in tests/ directory
- All documentation in docs/ directory
- Clear separation of concerns
- Application builds and runs successfully
- All tests pass
- Production deployment ready