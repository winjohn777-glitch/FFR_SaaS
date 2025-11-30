# Florida First Roofing - Development Workflow Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- Git
- Docker (optional)

### Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd florida-first-roofing-accounting

# Setup environment
cp .env.example .env.development
npm run setup

# Start development
npm run dev
```

## 📋 Available Scripts

### Development
```bash
npm run dev           # Start frontend + backend concurrently
npm run start         # Frontend only (React dev server)
npm run backend       # Backend only (Express server)
npm run full-stack    # Reset DB + start full stack
```

### Database
```bash
npm run setup-db      # Initialize database
npm run seed-data     # Load sample data
npm run reset-db      # Complete database reset
```

### Code Quality
```bash
npm run lint          # Check code style
npm run lint:fix      # Fix linting issues
npm run format        # Format code with Prettier
npm run type-check    # TypeScript validation
```

### Testing
```bash
npm run test          # Interactive test runner
npm run test:unit     # Unit tests with coverage
npm run test:e2e      # End-to-end tests
npm run test:all      # All tests
```

### Build & Deployment
```bash
npm run build         # Production build
npm run build:analyze # Bundle analysis
npm run health-check  # Application health check
```

### Docker
```bash
# Development
docker-compose --profile dev up

# Production
docker-compose up
```

## 🔄 Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/new-feature

# Start development environment
npm run dev

# Make changes, commit frequently
git add .
git commit -m "feat: add new feature"
```

### 2. Pre-Commit Quality Gates
Automatic checks run on each commit:
- ✅ ESLint code style
- ✅ Prettier formatting
- ✅ TypeScript validation
- ✅ Unit tests

### 3. Push & CI/CD
```bash
git push origin feature/new-feature
```

Triggers automated pipeline:
- 🔍 Code quality check
- 🧪 Unit tests
- 🏗️ Build verification
- 🔍 Security audit
- 🎭 E2E tests
- 🐳 Docker build

### 4. Deployment
- Merge to `main` triggers production deployment
- All quality gates must pass
- Automatic rollback on failure

## 📁 Project Structure

```
florida-first-roofing-accounting/
├── .github/workflows/     # CI/CD pipelines
├── .husky/               # Git hooks
├── backend/              # Express.js API
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth & security
│   └── server.js        # Main server
├── database/            # SQLite database
├── src/                 # React frontend
│   ├── components/     # UI components
│   ├── pages/          # Application pages
│   ├── hooks/          # Custom hooks
│   └── stores/         # State management
├── public/             # Static assets
├── logs/               # Application logs
├── uploads/            # File uploads
├── .env.*              # Environment configs
├── Dockerfile          # Container definition
└── docker-compose.yml  # Multi-container setup
```

## 🔧 Configuration Files

### Environment Variables
- `.env.development` - Local development
- `.env.production` - Production deployment
- `.env.example` - Template file

### Code Quality
- `.eslintrc.js` - ESLint configuration
- `.prettierrc` - Prettier formatting
- `tsconfig.json` - TypeScript config

### Docker
- `Dockerfile` - Container image
- `docker-compose.yml` - Multi-service setup
- `.dockerignore` - Build exclusions

## 🎯 Quality Gates

### Pre-Commit (Local)
- ✅ Linting passes
- ✅ Formatting correct
- ✅ Types valid
- ✅ Tests pass

### CI Pipeline (Remote)
- ✅ All quality checks
- ✅ Security audit
- ✅ Build successful
- ✅ E2E tests pass
- ✅ Docker build

### Deployment Gates
- ✅ All CI checks pass
- ✅ Manual approval (production)
- ✅ Health checks pass
- ✅ Monitoring alerts clear

## 🚨 Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Kill processes on ports 3000/5000
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
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

**Docker issues:**
```bash
# Clean Docker cache
docker system prune -a
docker-compose down --volumes
```

### Development Environment
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Health Check: http://localhost:5000/health

### Getting Help
1. Check this documentation
2. Review error logs in `./logs/`
3. Run `npm run health-check`
4. Check GitHub Issues

## 📊 Monitoring & Metrics

### Health Endpoints
- `/health` - Service status
- `/ready` - Readiness check
- `/live` - Liveness probe

### Logs
- `./logs/development.log` - Dev logs
- `./logs/production.log` - Prod logs
- Console output during development

### Performance
- Bundle analysis: `npm run build:analyze`
- Lighthouse audits in CI
- Core Web Vitals monitoring

## 🔄 Maintenance

### Weekly Tasks
- [ ] Update dependencies: `npm update`
- [ ] Review security alerts: `npm audit`
- [ ] Clean Docker cache: `docker system prune`
- [ ] Backup database: Copy `database.sqlite`

### Monthly Tasks
- [ ] Review and update environment variables
- [ ] Update Docker base images
- [ ] Review and archive old logs
- [ ] Performance audit and optimization

---

**🏗️ This workflow ensures high-quality, reliable, and maintainable code for Florida First Roofing's business operations.**