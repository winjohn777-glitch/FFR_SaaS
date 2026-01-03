# GitHub Actions Workflows

This directory contains CI/CD workflows for the Florida First Roofing Accounting application.

## Workflows

### CI (`ci.yml`)

**Triggered by:** Push or pull request to `main` or `develop` branches

**Jobs:**
1. **Lint** - Runs ESLint on frontend and backend code
2. **Test Frontend** - Runs Jest tests with coverage
3. **Test Backend** - Runs tests against PostgreSQL service container
4. **Build Frontend** - Creates production React build
5. **Build Backend** - Compiles TypeScript
6. **Docker Build Test** - Validates Docker images build (PR only)

### Database Migration (`migrate.yml`)

**Triggered by:** Manual dispatch only

**Inputs:**
- `environment` - Target environment (staging/production)
- `dry_run` - Preview changes without applying (default: true)

**Usage:**
1. Go to Actions tab in GitHub
2. Select "Database Migration" workflow
3. Click "Run workflow"
4. Choose environment and dry run option
5. Review migration status before applying

### Deploy (`deploy.yml`)

**Triggered by:** Push to `main` or manual dispatch

**Jobs:**
1. **Build and Push** - Creates and pushes Docker images to GitHub Container Registry
2. **Deploy Staging** - Deploys to staging environment
3. **Deploy Production** - Deploys to production (manual trigger only)

## Required Secrets

### CI Workflow
- No secrets required (uses GitHub Token automatically)

### Migration Workflow
| Secret | Description |
|--------|-------------|
| `DATABASE_URL` | PostgreSQL connection string for target environment |

### Deploy Workflow
| Secret | Description |
|--------|-------------|
| `STAGING_HOST` | Staging server hostname or IP |
| `STAGING_USER` | SSH username for staging |
| `PRODUCTION_HOST` | Production server hostname or IP |
| `PRODUCTION_USER` | SSH username for production |
| `SSH_PRIVATE_KEY` | SSH private key for deployment |

## Environment Setup

### GitHub Environments

Create two environments in repository settings:

1. **staging**
   - URL: `https://staging.floridafirstroofing.com`
   - No protection rules required

2. **production**
   - URL: `https://app.floridafirstroofing.com`
   - Add required reviewers
   - Enable "Wait timer" (optional)

### Server Requirements

Each deployment target needs:
- Docker and Docker Compose installed
- Application directory at `/opt/ffr-accounting`
- `docker-compose.yml` configured for the environment
- PostgreSQL database accessible
- Port 5001 (backend) and 3000 (frontend) available

## Local Testing

Test workflows locally using [act](https://github.com/nektos/act):

```bash
# Install act
brew install act

# Run CI workflow
act push

# Run specific job
act -j lint
```

## Troubleshooting

### CI Fails on Lint
- Check ESLint configuration in `package.json`
- Ensure `.eslintrc` is present and valid

### Backend Tests Fail
- PostgreSQL service container needs time to start
- Check `DATABASE_URL` format in test job

### Docker Build Fails
- Verify `Dockerfile` exists in root and `backend/` directories
- Check that all required files are not in `.dockerignore`

### Deployment Fails
- Verify SSH key has correct permissions
- Check server firewall allows connections
- Ensure Docker Compose file is valid on server
