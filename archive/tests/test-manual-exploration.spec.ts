import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

test.describe('Manual App Exploration - All Interactive Elements', () => {
  test.use({
    baseURL: BASE_URL,
  });

  test('Full Application Exploration Report', async ({ page }) => {
    const report: any = {
      timestamp: new Date().toISOString(),
      baseUrl: BASE_URL,
      pages: [],
      errors: [],
      summary: {}
    };

    const pagesToTest = [
      { path: '/', name: 'Home' },
      { path: '/dashboard', name: 'Dashboard' },
      { path: '/crm', name: 'CRM - Customer Management' },
      { path: '/project-management', name: 'Project Management' },
      { path: '/invoicing', name: 'Invoicing' },
      { path: '/hr', name: 'Human Resources' },
      { path: '/accounting', name: 'Accounting' },
      { path: '/sop-management', name: 'SOP Management' },
      { path: '/learning', name: 'Learning Management' },
      { path: '/documents', name: 'Documents' },
      { path: '/reports', name: 'Reports' },
    ];

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║  FLORIDA FIRST ROOFING - FUNCTIONALITY TEST REPORT   ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    for (const pageInfo of pagesToTest) {
      console.log(`\n📄 Testing: ${pageInfo.name} (${pageInfo.path})`);
      console.log('─'.repeat(60));

      try {
        await page.goto(pageInfo.path, { waitUntil: 'networkidle', timeout: 15000 });

        const pageData: any = {
          name: pageInfo.name,
          path: pageInfo.path,
          loaded: true,
          elements: {},
          screenshots: []
        };

        // Count all interactive elements
        const buttons = await page.locator('button:visible').count();
        const links = await page.locator('a:visible').count();
        const inputs = await page.locator('input:visible').count();
        const selects = await page.locator('select:visible').count();
        const textareas = await page.locator('textarea:visible').count();

        pageData.elements = {
          buttons,
          links,
          inputs,
          selects,
          textareas,
          total: buttons + links + inputs + selects + textareas
        };

        console.log(`  ✓ Buttons: ${buttons}`);
        console.log(`  ✓ Links: ${links}`);
        console.log(`  ✓ Inputs: ${inputs}`);
        console.log(`  ✓ Selects: ${selects}`);
        console.log(`  ✓ Textareas: ${textareas}`);
        console.log(`  ━ Total Interactive Elements: ${pageData.elements.total}`);

        // Get all button labels
        const buttonElements = await page.locator('button:visible').all();
        const buttonLabels: string[] = [];
        for (const btn of buttonElements.slice(0, 20)) { // First 20 buttons
          const text = (await btn.textContent())?.trim();
          if (text) buttonLabels.push(text);
        }
        if (buttonLabels.length > 0) {
          console.log(`  📋 Button Labels: ${buttonLabels.slice(0, 10).join(', ')}${buttonLabels.length > 10 ? '...' : ''}`);
        }
        pageData.buttonLabels = buttonLabels;

        // Test clicking "Add" or "New" buttons to open modals
        const addButtons = await page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("Create")').all();
        pageData.addButtonCount = addButtons.length;

        if (addButtons.length > 0) {
          console.log(`  🔘 Found ${addButtons.length} "Add/New/Create" buttons`);

          // Try clicking first add button
          try {
            const firstAddBtn = addButtons[0];
            const btnText = await firstAddBtn.textContent();
            await firstAddBtn.click({ timeout: 5000 });
            await page.waitForTimeout(1000);

            // Check for modal
            const modal = page.locator('[role="dialog"], .modal, [class*="Modal"]').first();
            const modalVisible = await modal.isVisible({ timeout: 3000 }).catch(() => false);

            if (modalVisible) {
              console.log(`  ✓ Modal opened from "${btnText}" button`);
              pageData.modalTest = 'Success';

              // Count form fields in modal
              const modalInputs = await page.locator('[role="dialog"] input, .modal input').count();
              console.log(`    - Modal has ${modalInputs} input fields`);

              // Try to close modal
              const closeBtn = page.locator('button:has-text("Cancel"), button:has-text("Close"), [aria-label*="close"]').first();
              if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                await closeBtn.click();
                await page.waitForTimeout(500);
                console.log(`  ✓ Modal closed successfully`);
              }
            } else {
              console.log(`  ⚠ No modal appeared after clicking "${btnText}"`);
              pageData.modalTest = 'No modal detected';
            }
          } catch (err: any) {
            console.log(`  ⚠ Error testing modal: ${err.message}`);
            pageData.modalTest = `Error: ${err.message}`;
          }
        }

        // Test navigation links
        const navLinks = await page.locator('nav a, aside a').all();
        pageData.navigationLinks = navLinks.length;
        console.log(`  🔗 Navigation links: ${navLinks.length}`);

        // Check for tables/lists
        const tables = await page.locator('table').count();
        const lists = await page.locator('ul, ol').count();
        pageData.dataDisplays = { tables, lists };
        if (tables > 0) console.log(`  📊 Tables found: ${tables}`);
        if (lists > 0) console.log(`  📝 Lists found: ${lists}`);

        // Take screenshot
        const screenshotPath = `test-results/exploration-${pageInfo.path.replace(/\//g, '-')}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        pageData.screenshots.push(screenshotPath);
        console.log(`  📸 Screenshot saved: ${screenshotPath}`);

        report.pages.push(pageData);

      } catch (error: any) {
        console.log(`  ❌ Error loading page: ${error.message}`);
        report.errors.push({
          page: pageInfo.name,
          path: pageInfo.path,
          error: error.message
        });
      }
    }

    // Generate summary
    const totalButtons = report.pages.reduce((sum: number, p: any) => sum + (p.elements?.buttons || 0), 0);
    const totalLinks = report.pages.reduce((sum: number, p: any) => sum + (p.elements?.links || 0), 0);
    const totalInputs = report.pages.reduce((sum: number, p: any) => sum + (p.elements?.inputs || 0), 0);
    const totalInteractive = report.pages.reduce((sum: number, p: any) => sum + (p.elements?.total || 0), 0);

    report.summary = {
      pagesLoaded: report.pages.length,
      totalPages: pagesToTest.length,
      totalButtons,
      totalLinks,
      totalInputs,
      totalInteractive,
      errors: report.errors.length
    };

    console.log('\n\n╔════════════════════════════════════════════════════════╗');
    console.log('║                   SUMMARY REPORT                      ║');
    console.log('╚═════════════════════════════════════���══════════════════╝');
    console.log(`\n📊 Pages Tested: ${report.summary.pagesLoaded}/${report.summary.totalPages}`);
    console.log(`🔘 Total Buttons: ${report.summary.totalButtons}`);
    console.log(`🔗 Total Links: ${report.summary.totalLinks}`);
    console.log(`📝 Total Input Fields: ${report.summary.totalInputs}`);
    console.log(`⚡ Total Interactive Elements: ${report.summary.totalInteractive}`);
    console.log(`❌ Errors Encountered: ${report.summary.errors}`);

    if (report.errors.length > 0) {
      console.log('\n❌ ERRORS:');
      report.errors.forEach((err: any) => {
        console.log(`  - ${err.page}: ${err.error}`);
      });
    }

    // Save full report
    await page.evaluate((reportData) => {
      console.log('FULL_REPORT_JSON:', JSON.stringify(reportData, null, 2));
    }, report);

    console.log('\n✅ Exploration complete!\n');
  });

  test('Test API Endpoints', async ({ page }) => {
    console.log('\n📡 Testing Backend API Endpoints');
    console.log('─'.repeat(60));

    const endpoints = [
      '/api/customers',
      '/api/jobs',
      '/api/invoices',
      '/api/employees',
      '/api/sops',
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await page.request.get(`http://localhost:5001${endpoint}`);
        console.log(`  ${response.ok() ? '✓' : '❌'} ${endpoint} - Status: ${response.status()}`);
      } catch (err: any) {
        console.log(`  ❌ ${endpoint} - Error: ${err.message}`);
      }
    }
  });

  test('Test Database Operations', async ({ page }) => {
    console.log('\n💾 Testing Database Operations');
    console.log('─'.repeat(60));

    try {
      const healthResponse = await page.request.get('http://localhost:5001/health');
      const health = await healthResponse.json();
      console.log('  ✓ Backend Health:', health.message);
      console.log('  ✓ Database:', health.database);
      console.log('  ✓ Uptime:', Math.floor(health.uptime), 'seconds');
    } catch (err: any) {
      console.log('  ❌ Database test failed:', err.message);
    }
  });
});
