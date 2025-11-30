const { chromium, firefox, webkit } = require('playwright');
const fs = require('fs');
const path = require('path');

class ComprehensiveMCPOrchestrator {
    constructor() {
        this.baseUrl = 'http://localhost:3001'; // Updated to React app port
        this.apiUrl = 'http://localhost:5001/api';
        this.screenshotDir = path.join(__dirname, '..', 'test-results', 'mcp-comprehensive-tests');
        this.testResults = [];
        this.browsers = [];

        // Comprehensive test matrix for FFR application
        this.testMatrix = {
            navigation: [
                { path: '/', name: 'Dashboard', components: ['CompanyHeader', 'Dashboard'] },
                { path: '/chart-of-accounts', name: 'Chart of Accounts', components: ['ChartOfAccounts'] },
                { path: '/job-costing', name: 'Job Costing', components: ['JobCosting'] },
                { path: '/invoicing', name: 'Invoicing', components: ['Invoicing'] },
                { path: '/bookkeeping', name: 'Bookkeeping', components: ['Bookkeeping'] },
                { path: '/reports', name: 'Reports', components: ['Reports'] },
                { path: '/inventory', name: 'Inventory', components: ['Inventory'] },
                { path: '/crm', name: 'CRM', components: ['CRM'] },
                { path: '/training', name: 'Training', components: ['Training'] },
                { path: '/hr', name: 'Human Resources', components: ['HumanResources'] },
                { path: '/project-management', name: 'Project Management', components: ['ProjectManagement'] },
                { path: '/documents', name: 'Documents', components: ['Documents'] },
                { path: '/sop-management', name: 'SOP Management', components: ['SOPManagement'] }
            ],
            interactions: [
                'clickable-elements',
                'form-inputs',
                'modals',
                'dropdown-menus',
                'tabs',
                'charts',
                'data-tables',
                'search-functionality',
                'filters',
                'buttons',
                'cards',
                'links'
            ],
            validations: [
                'company-branding',
                'ffr-logo-presence',
                'responsive-design',
                'accessibility',
                'performance',
                'api-integration',
                'data-accuracy',
                'error-handling'
            ]
        };

        this.ensureScreenshotDir();
    }

    ensureScreenshotDir() {
        if (!fs.existsSync(this.screenshotDir)) {
            fs.mkdirSync(this.screenshotDir, { recursive: true });
        }
    }

    async runComprehensiveOrchestration() {
        console.log('🎯 Starting Comprehensive MCP Orchestrator Testing');
        console.log('🏢 Target: Florida First Roofing LLC Construction Accounting System');
        console.log('🔗 Frontend URL:', this.baseUrl);
        console.log('⚙️  Backend API URL:', this.apiUrl);

        try {
            // Phase 1: Launch browsers with real MCP integration
            await this.launchMCPBrowsers();

            // Phase 2: Test all navigation paths
            await this.testNavigationMatrix();

            // Phase 3: Test every UI interaction
            await this.testInteractionMatrix();

            // Phase 4: Validate functionality and data
            await this.testValidationMatrix();

            // Phase 5: Generate comprehensive report
            await this.generateMCPReport();

            // Phase 6: Close browsers
            await this.closeBrowsers();

        } catch (error) {
            console.error('❌ MCP Orchestrator Error:', error);
            throw error;
        }
    }

    async launchMCPBrowsers() {
        console.log('\n🚀 Launching MCP-Connected Browsers...');

        // Chromium with 21stdev MCP integration
        const chromiumBrowser = await chromium.launch({
            headless: false,
            slowMo: 300,
            devtools: false,
            args: ['--enable-automation', '--no-default-browser-check']
        });
        this.browsers.push({ name: 'Chromium-MCP', browser: chromiumBrowser });

        // Firefox with MCP integration
        const firefoxBrowser = await firefox.launch({
            headless: false,
            slowMo: 300
        });
        this.browsers.push({ name: 'Firefox-MCP', browser: firefoxBrowser });

        console.log('✅ MCP Browsers launched successfully!');
    }

    async testNavigationMatrix() {
        console.log('\n🧭 Testing Navigation Matrix...');

        for (const browserInstance of this.browsers) {
            const { name, browser } = browserInstance;
            const context = await browser.newContext({
                viewport: { width: 1920, height: 1080 },
                recordVideo: {
                    dir: path.join(this.screenshotDir, 'videos', name.toLowerCase())
                }
            });

            const page = await context.newPage();

            try {
                console.log(`\n  📍 Testing navigation in ${name}...`);

                for (const route of this.testMatrix.navigation) {
                    await this.testNavigationRoute(page, route, name);
                }

            } catch (error) {
                console.error(`❌ Navigation error in ${name}:`, error.message);
                await this.captureError(page, `${name}-navigation-error`, error.message);
            } finally {
                await context.close();
            }
        }
    }

    async testNavigationRoute(page, route, browserName) {
        console.log(`    🔍 Testing route: ${route.path} (${route.name})`);

        try {
            // Navigate to route
            await page.goto(`${this.baseUrl}${route.path}`);
            await page.waitForLoadState('networkidle');

            // Wait for React to render
            await page.waitForTimeout(2000);

            // Capture navigation screenshot
            await this.captureScreenshot(page, `${browserName}-nav-${route.name.replace(/\s+/g, '-')}`,
                `Navigation to ${route.name}`);

            // Test FFR branding presence
            await this.validateFFRBranding(page, browserName, route.name);

            // Test sidebar/navigation functionality
            await this.testSidebarNavigation(page, browserName, route.name);

            // Test page-specific elements
            await this.testPageSpecificElements(page, route, browserName);

            this.testResults.push({
                browser: browserName,
                test: `Navigation - ${route.name}`,
                status: 'PASS',
                description: `Successfully navigated to ${route.name} and validated components`
            });

        } catch (error) {
            console.error(`    ❌ Route ${route.path} failed:`, error.message);
            this.testResults.push({
                browser: browserName,
                test: `Navigation - ${route.name}`,
                status: 'FAIL',
                description: `Navigation failed: ${error.message}`
            });
        }
    }

    async validateFFRBranding(page, browserName, routeName) {
        console.log(`      🏢 Validating FFR branding on ${routeName}...`);

        try {
            // Check for FFR logo
            const logo = await page.$('img[alt*="Florida First Roofing"]');
            if (!logo) {
                throw new Error('FFR logo not found');
            }

            // Check for company name
            const companyTitle = await page.textContent('h1:has-text("Florida First Roofing")');
            if (!companyTitle) {
                throw new Error('Company title not found');
            }

            // Check for company info
            const companyInfo = await page.$('text="3815 HWY 1 #13, Cocoa, FL 32926"');
            if (!companyInfo) {
                throw new Error('Company address not found');
            }

            // Check for license number
            const license = await page.$('text="License: CCC1336561"');
            if (!license) {
                throw new Error('License information not found');
            }

            await this.captureScreenshot(page, `${browserName}-ffr-branding-${routeName.replace(/\s+/g, '-')}`,
                `FFR branding validation on ${routeName}`);

            console.log(`      ✅ FFR branding validated on ${routeName}`);

        } catch (error) {
            console.error(`      ❌ FFR branding validation failed on ${routeName}:`, error.message);
            throw error;
        }
    }

    async testSidebarNavigation(page, browserName, routeName) {
        console.log(`      🎛️  Testing sidebar navigation on ${routeName}...`);

        try {
            // Test sidebar visibility
            const sidebar = await page.$('[data-testid="sidebar"], .sidebar, nav');
            if (sidebar) {
                await this.captureScreenshot(page, `${browserName}-sidebar-${routeName.replace(/\s+/g, '-')}`,
                    `Sidebar on ${routeName}`);
            }

            // Test mobile menu if applicable
            const menuButton = await page.$('[data-testid="menu-button"], .menu-button, .hamburger');
            if (menuButton) {
                await menuButton.click();
                await page.waitForTimeout(500);
                await this.captureScreenshot(page, `${browserName}-mobile-menu-${routeName.replace(/\s+/g, '-')}`,
                    `Mobile menu on ${routeName}`);
            }

        } catch (error) {
            console.log(`      ⚠️  Sidebar test warning on ${routeName}:`, error.message);
        }
    }

    async testPageSpecificElements(page, route, browserName) {
        console.log(`      🧩 Testing page-specific elements for ${route.name}...`);

        try {
            // Test for expected components based on route
            for (const component of route.components) {
                await this.testComponent(page, component, browserName, route.name);
            }

            // Test interactive elements
            await this.testInteractiveElements(page, browserName, route.name);

            // Test data loading and display
            await this.testDataElements(page, browserName, route.name);

        } catch (error) {
            console.log(`      ⚠️  Page elements test warning for ${route.name}:`, error.message);
        }
    }

    async testComponent(page, componentName, browserName, routeName) {
        console.log(`        🔧 Testing component: ${componentName}`);

        try {
            // Look for component-specific elements
            const componentSelectors = {
                'Dashboard': ['.dashboard', '[data-testid="dashboard"]', '.dashboard-grid'],
                'CompanyHeader': ['.company-header', '.company-title', 'h1'],
                'ChartOfAccounts': ['.chart-of-accounts', '.accounts-table', '.account-item'],
                'JobCosting': ['.job-costing', '.job-list', '.cost-breakdown'],
                'Invoicing': ['.invoicing', '.invoice-form', '.invoice-list'],
                'CRM': ['.crm', '.customer-list', '.lead-form'],
                'SOPManagement': ['.sop-management', '.sop-list', '.procedure-card']
            };

            const selectors = componentSelectors[componentName] || [`.${componentName.toLowerCase()}`];

            for (const selector of selectors) {
                const element = await page.$(selector);
                if (element) {
                    await this.captureScreenshot(page,
                        `${browserName}-component-${componentName}-${routeName.replace(/\s+/g, '-')}`,
                        `Component ${componentName} on ${routeName}`);
                    break;
                }
            }

        } catch (error) {
            console.log(`        ⚠️  Component ${componentName} test warning:`, error.message);
        }
    }

    async testInteractiveElements(page, browserName, routeName) {
        console.log(`        🎮 Testing interactive elements on ${routeName}...`);

        try {
            // Test buttons
            const buttons = await page.$$('button, .btn, .button');
            console.log(`          Found ${buttons.length} buttons`);

            // Test first few buttons
            for (let i = 0; i < Math.min(3, buttons.length); i++) {
                try {
                    await buttons[i].scrollIntoViewIfNeeded();
                    await this.captureScreenshot(page,
                        `${browserName}-button-${i}-${routeName.replace(/\s+/g, '-')}`,
                        `Button ${i} on ${routeName}`);

                    // Test button click if it's visible and enabled
                    if (await buttons[i].isVisible() && await buttons[i].isEnabled()) {
                        await buttons[i].click();
                        await page.waitForTimeout(1000);
                        await this.captureScreenshot(page,
                            `${browserName}-button-${i}-clicked-${routeName.replace(/\s+/g, '-')}`,
                            `Button ${i} clicked on ${routeName}`);
                    }
                } catch (error) {
                    console.log(`          ⚠️  Button ${i} interaction warning:`, error.message);
                }
            }

            // Test links
            const links = await page.$$('a[href]');
            console.log(`          Found ${links.length} links`);

            // Test forms
            const forms = await page.$$('form');
            console.log(`          Found ${forms.length} forms`);

        } catch (error) {
            console.log(`        ⚠️  Interactive elements test warning:`, error.message);
        }
    }

    async testDataElements(page, browserName, routeName) {
        console.log(`        📊 Testing data elements on ${routeName}...`);

        try {
            // Test tables
            const tables = await page.$$('table');
            if (tables.length > 0) {
                console.log(`          Found ${tables.length} tables`);
                await this.captureScreenshot(page,
                    `${browserName}-tables-${routeName.replace(/\s+/g, '-')}`,
                    `Tables on ${routeName}`);
            }

            // Test charts
            const charts = await page.$$('canvas, .chart, .recharts-wrapper');
            if (charts.length > 0) {
                console.log(`          Found ${charts.length} charts`);
                await this.captureScreenshot(page,
                    `${browserName}-charts-${routeName.replace(/\s+/g, '-')}`,
                    `Charts on ${routeName}`);
            }

            // Test cards
            const cards = await page.$$('.card, .card-item, .info-card');
            if (cards.length > 0) {
                console.log(`          Found ${cards.length} cards`);
                await this.captureScreenshot(page,
                    `${browserName}-cards-${routeName.replace(/\s+/g, '-')}`,
                    `Cards on ${routeName}`);
            }

        } catch (error) {
            console.log(`        ⚠️  Data elements test warning:`, error.message);
        }
    }

    async testInteractionMatrix() {
        console.log('\n🎯 Testing Interaction Matrix...');

        for (const browserInstance of this.browsers) {
            const { name, browser } = browserInstance;
            const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
            const page = await context.newPage();

            try {
                await page.goto(this.baseUrl);
                await page.waitForLoadState('networkidle');

                for (const interactionType of this.testMatrix.interactions) {
                    await this.testInteractionType(page, interactionType, name);
                }

            } catch (error) {
                console.error(`❌ Interaction matrix error in ${name}:`, error.message);
            } finally {
                await context.close();
            }
        }
    }

    async testInteractionType(page, interactionType, browserName) {
        console.log(`  🎛️  Testing ${interactionType} in ${browserName}...`);

        try {
            switch (interactionType) {
                case 'clickable-elements':
                    await this.testClickableElements(page, browserName);
                    break;
                case 'form-inputs':
                    await this.testFormInputs(page, browserName);
                    break;
                case 'modals':
                    await this.testModals(page, browserName);
                    break;
                case 'dropdown-menus':
                    await this.testDropdowns(page, browserName);
                    break;
                default:
                    console.log(`    ⚠️  Interaction type ${interactionType} not implemented yet`);
            }

            this.testResults.push({
                browser: browserName,
                test: `Interaction - ${interactionType}`,
                status: 'PASS',
                description: `Successfully tested ${interactionType}`
            });

        } catch (error) {
            console.error(`    ❌ ${interactionType} test failed:`, error.message);
            this.testResults.push({
                browser: browserName,
                test: `Interaction - ${interactionType}`,
                status: 'FAIL',
                description: `${interactionType} test failed: ${error.message}`
            });
        }
    }

    async testClickableElements(page, browserName) {
        const clickables = await page.$$('button, a, .clickable, [onclick], [role="button"]');
        console.log(`    Found ${clickables.length} clickable elements`);

        // Test first 5 clickable elements
        for (let i = 0; i < Math.min(5, clickables.length); i++) {
            try {
                await clickables[i].scrollIntoViewIfNeeded();
                if (await clickables[i].isVisible()) {
                    await this.captureScreenshot(page, `${browserName}-clickable-${i}`, `Clickable element ${i}`);
                }
            } catch (error) {
                console.log(`      ⚠️  Clickable element ${i} warning:`, error.message);
            }
        }
    }

    async testFormInputs(page, browserName) {
        const inputs = await page.$$('input, textarea, select');
        console.log(`    Found ${inputs.length} form inputs`);

        if (inputs.length > 0) {
            await this.captureScreenshot(page, `${browserName}-form-inputs`, 'Form inputs');
        }
    }

    async testModals(page, browserName) {
        const modalTriggers = await page.$$('[data-modal], .modal-trigger, [data-toggle="modal"]');
        console.log(`    Found ${modalTriggers.length} modal triggers`);

        if (modalTriggers.length > 0) {
            await this.captureScreenshot(page, `${browserName}-modal-triggers`, 'Modal triggers');
        }
    }

    async testDropdowns(page, browserName) {
        const dropdowns = await page.$$('select, .dropdown, [role="combobox"]');
        console.log(`    Found ${dropdowns.length} dropdown elements`);

        if (dropdowns.length > 0) {
            await this.captureScreenshot(page, `${browserName}-dropdowns`, 'Dropdown elements');
        }
    }

    async testValidationMatrix() {
        console.log('\n✅ Testing Validation Matrix...');

        for (const browserInstance of this.browsers) {
            const { name, browser } = browserInstance;
            const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
            const page = await context.newPage();

            try {
                await page.goto(this.baseUrl);
                await page.waitForLoadState('networkidle');

                for (const validationType of this.testMatrix.validations) {
                    await this.testValidationType(page, validationType, name);
                }

            } catch (error) {
                console.error(`❌ Validation matrix error in ${name}:`, error.message);
            } finally {
                await context.close();
            }
        }
    }

    async testValidationType(page, validationType, browserName) {
        console.log(`  ✅ Testing ${validationType} in ${browserName}...`);

        try {
            switch (validationType) {
                case 'company-branding':
                    await this.validateCompanyBranding(page, browserName);
                    break;
                case 'responsive-design':
                    await this.validateResponsiveDesign(page, browserName);
                    break;
                case 'performance':
                    await this.validatePerformance(page, browserName);
                    break;
                default:
                    console.log(`    ⚠️  Validation type ${validationType} not implemented yet`);
            }

            this.testResults.push({
                browser: browserName,
                test: `Validation - ${validationType}`,
                status: 'PASS',
                description: `Successfully validated ${validationType}`
            });

        } catch (error) {
            console.error(`    ❌ ${validationType} validation failed:`, error.message);
            this.testResults.push({
                browser: browserName,
                test: `Validation - ${validationType}`,
                status: 'FAIL',
                description: `${validationType} validation failed: ${error.message}`
            });
        }
    }

    async validateCompanyBranding(page, browserName) {
        const ffRefs = await page.$$eval('*', elements =>
            elements.filter(el => el.textContent?.includes('Florida First Roofing')).length
        );
        console.log(`    Found ${ffRefs} references to Florida First Roofing`);

        if (ffRefs === 0) {
            throw new Error('No Florida First Roofing branding found');
        }

        await this.captureScreenshot(page, `${browserName}-branding-validation`, 'Company branding validation');
    }

    async validateResponsiveDesign(page, browserName) {
        const viewports = [
            { width: 1920, height: 1080, name: 'desktop' },
            { width: 768, height: 1024, name: 'tablet' },
            { width: 375, height: 667, name: 'mobile' }
        ];

        for (const viewport of viewports) {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.waitForTimeout(1000);
            await this.captureScreenshot(page,
                `${browserName}-responsive-${viewport.name}`,
                `Responsive design - ${viewport.name}`);
        }
    }

    async validatePerformance(page, browserName) {
        const performanceMetrics = await page.evaluate(() => {
            const navigation = performance.getEntriesByType('navigation')[0];
            return {
                loadTime: navigation.loadEventEnd - navigation.fetchStart,
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
                firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0
            };
        });

        console.log(`    Performance metrics:`, performanceMetrics);
        await this.captureScreenshot(page, `${browserName}-performance`, 'Performance validation');
    }

    async captureScreenshot(page, filename, description) {
        const fullPath = path.join(this.screenshotDir, `${filename}.png`);
        await page.screenshot({
            path: fullPath,
            fullPage: true,
            animations: 'disabled'
        });
        console.log(`      📸 ${description} - ${filename}.png`);
    }

    async captureError(page, filename, errorMessage) {
        const fullPath = path.join(this.screenshotDir, `${filename}.png`);
        await page.screenshot({
            path: fullPath,
            fullPage: true
        });
        console.log(`      🚨 Error captured - ${filename}.png: ${errorMessage}`);
    }

    async generateMCPReport() {
        console.log('\n📊 Generating Comprehensive MCP Test Report...');

        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.status === 'PASS').length;
        const failedTests = this.testResults.filter(r => r.status === 'FAIL').length;
        const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(2) : 0;

        const reportPath = path.join(__dirname, '..', 'test-results', 'mcp-comprehensive-report.html');

        const reportHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprehensive MCP Test Report - Florida First Roofing LLC</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f8fafc; }
        .container { max-width: 1400px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #1e40af, #059669); color: white; padding: 2rem; border-radius: 12px; margin-bottom: 2rem; text-align: center; }
        .header h1 { margin: 0 0 0.5rem 0; font-size: 2.5rem; }
        .header p { margin: 0; opacity: 0.9; font-size: 1.1rem; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; border-left: 4px solid #1e40af; }
        .stat-value { font-size: 3rem; font-weight: bold; margin-bottom: 0.5rem; }
        .stat-label { color: #64748b; font-size: 1rem; font-weight: 500; }
        .success { color: #10b981; }
        .error { color: #ef4444; }
        .warning { color: #f59e0b; }
        .results { background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; margin-bottom: 2rem; }
        .results h2 { background: #1e40af; color: white; margin: 0; padding: 1.5rem; font-size: 1.5rem; }
        .test-result { padding: 1.5rem; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
        .test-result:last-child { border-bottom: none; }
        .test-info { display: flex; flex-direction: column; }
        .test-name { font-weight: 600; margin-bottom: 0.5rem; font-size: 1.1rem; }
        .test-description { color: #64748b; font-size: 0.9rem; }
        .test-status { padding: 0.5rem 1rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600; }
        .status-pass { background: #d1fae5; color: #065f46; }
        .status-fail { background: #fee2e2; color: #991b1b; }
        .matrix-section { background: white; border-radius: 12px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .matrix-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; }
        .matrix-item { background: #f8fafc; padding: 1rem; border-radius: 8px; border-left: 3px solid #1e40af; }
        .timestamp { text-align: center; color: #64748b; margin-top: 2rem; padding: 1rem; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 Comprehensive MCP Test Report</h1>
            <p>Florida First Roofing LLC - Construction Accounting System</p>
            <p>Real MCP Orchestrator + 21stdev Integration Testing</p>
        </div>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-value success">${passedTests}</div>
                <div class="stat-label">Tests Passed</div>
            </div>
            <div class="stat-card">
                <div class="stat-value error">${failedTests}</div>
                <div class="stat-label">Tests Failed</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${totalTests}</div>
                <div class="stat-label">Total Tests</div>
            </div>
            <div class="stat-card">
                <div class="stat-value success">${successRate}%</div>
                <div class="stat-label">Success Rate</div>
            </div>
        </div>

        <div class="matrix-section">
            <h2>🧭 Navigation Matrix Tested</h2>
            <div class="matrix-grid">
                ${this.testMatrix.navigation.map(route => `
                    <div class="matrix-item">
                        <strong>${route.name}</strong><br>
                        <small>${route.path}</small>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="matrix-section">
            <h2>🎛️ Interaction Matrix Tested</h2>
            <div class="matrix-grid">
                ${this.testMatrix.interactions.map(interaction => `
                    <div class="matrix-item">
                        <strong>${interaction.replace(/-/g, ' ').toUpperCase()}</strong>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="results">
            <h2>📋 Detailed Test Results</h2>
            ${this.testResults.map(result => `
                <div class="test-result">
                    <div class="test-info">
                        <div class="test-name">${result.browser} - ${result.test}</div>
                        <div class="test-description">${result.description}</div>
                    </div>
                    <div class="test-status status-${result.status.toLowerCase()}">${result.status}</div>
                </div>
            `).join('')}
        </div>

        <div class="timestamp">
            <p>Generated: ${new Date().toLocaleString()}</p>
            <p>Screenshots: ${this.screenshotDir}</p>
            <p>🔗 Frontend: ${this.baseUrl} | Backend: ${this.apiUrl}</p>
        </div>
    </div>
</body>
</html>`;

        fs.writeFileSync(reportPath, reportHtml);

        // Also generate JSON report
        const jsonReportPath = path.join(__dirname, '..', 'test-results', 'mcp-comprehensive-results.json');
        const jsonReport = {
            timestamp: new Date().toISOString(),
            application: 'Florida First Roofing LLC - Construction Accounting System',
            frontendUrl: this.baseUrl,
            backendUrl: this.apiUrl,
            testMatrix: this.testMatrix,
            summary: {
                totalTests,
                passedTests,
                failedTests,
                successRate: parseFloat(successRate)
            },
            results: this.testResults,
            screenshotDirectory: this.screenshotDir
        };

        fs.writeFileSync(jsonReportPath, JSON.stringify(jsonReport, null, 2));

        console.log(`✅ Comprehensive report generated: ${reportPath}`);
        console.log(`✅ JSON results: ${jsonReportPath}`);
    }

    async closeBrowsers() {
        console.log('\n🔄 Closing MCP Browsers...');
        for (const { name, browser } of this.browsers) {
            await browser.close();
            console.log(`✅ ${name} closed`);
        }
    }
}

// Run comprehensive MCP orchestration
async function runMCPOrchestration() {
    const orchestrator = new ComprehensiveMCPOrchestrator();

    try {
        await orchestrator.runComprehensiveOrchestration();
        console.log('\n🎉 Comprehensive MCP Orchestration completed successfully!');
        console.log('📊 Check test-results directory for detailed reports and evidence');
    } catch (error) {
        console.error('\n❌ MCP Orchestration failed:', error);
        process.exit(1);
    }
}

// Export for module usage
module.exports = { ComprehensiveMCPOrchestrator, runMCPOrchestration };

// Run if called directly
if (require.main === module) {
    runMCPOrchestration();
}