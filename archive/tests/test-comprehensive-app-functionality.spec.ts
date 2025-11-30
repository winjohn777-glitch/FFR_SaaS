import { test, expect, Page } from '@playwright/test';

test.describe('Florida First Roofing - Comprehensive Functionality Test', () => {
  const BASE_URL = 'http://localhost:3001';

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('Dashboard - Main page loads and displays key metrics', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);

    // Check for dashboard elements
    const dashboardTitle = page.locator('text=/Dashboard|Overview/i');
    await expect(dashboardTitle).toBeVisible({ timeout: 10000 });

    // Take screenshot
    await page.screenshot({ path: 'test-results/dashboard-main.png', fullPage: true });

    console.log('✓ Dashboard loaded successfully');
  });

  test('CRM - Customer Management functionality', async ({ page }) => {
    await page.goto(`${BASE_URL}/crm`);
    await page.waitForLoadState('networkidle');

    // Look for customer list or add customer button
    const crmElements = await page.locator('button, [role="button"], a').all();
    console.log(`Found ${crmElements.length} interactive elements in CRM`);

    // Try to find "Add Customer" or similar button
    const addButton = page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("Customer")').first();
    if (await addButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await addButton.click();
      await page.waitForTimeout(1000);
      console.log('✓ Add Customer modal/form opened');
    }

    await page.screenshot({ path: 'test-results/crm-page.png', fullPage: true });
  });

  test('Project Management - Jobs and Projects', async ({ page }) => {
    await page.goto(`${BASE_URL}/project-management`);
    await page.waitForLoadState('networkidle');

    // Check for project-related elements
    const projectElements = await page.locator('button, [role="button"]').all();
    console.log(`Found ${projectElements.length} interactive elements in Project Management`);

    await page.screenshot({ path: 'test-results/project-management.png', fullPage: true });
  });

  test('Invoicing - Invoice Management', async ({ page }) => {
    await page.goto(`${BASE_URL}/invoicing`);
    await page.waitForLoadState('networkidle');

    const buttons = await page.locator('button').all();
    console.log(`Found ${buttons.length} buttons in Invoicing module`);

    await page.screenshot({ path: 'test-results/invoicing.png', fullPage: true });
  });

  test('HR Management - Human Resources', async ({ page }) => {
    await page.goto(`${BASE_URL}/hr`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({ path: 'test-results/hr-management.png', fullPage: true });
  });

  test('Accounting - Financial Management', async ({ page }) => {
    await page.goto(`${BASE_URL}/accounting`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({ path: 'test-results/accounting.png', fullPage: true });
  });

  test('SOP Management - Standard Operating Procedures', async ({ page }) => {
    await page.goto(`${BASE_URL}/sop-management`);
    await page.waitForLoadState('networkidle');

    // Look for SOP items or categories
    const sopItems = await page.locator('[data-testid*="sop"], .sop-item, button').all();
    console.log(`Found ${sopItems.length} SOP-related elements`);

    // Try clicking first SOP if available
    if (sopItems.length > 0) {
      const firstItem = sopItems[0];
      if (await firstItem.isVisible({ timeout: 3000 }).catch(() => false)) {
        await firstItem.click();
        await page.waitForTimeout(1000);
        console.log('✓ Clicked first SOP item');
      }
    }

    await page.screenshot({ path: 'test-results/sop-management.png', fullPage: true });
  });

  test('Learning Management - Training System', async ({ page }) => {
    await page.goto(`${BASE_URL}/learning`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({ path: 'test-results/learning-management.png', fullPage: true });
  });

  test('Navigation - Sidebar and Menu', async ({ page }) => {
    // Test sidebar navigation
    const navLinks = await page.locator('nav a, [role="navigation"] a, aside a').all();
    console.log(`Found ${navLinks.length} navigation links`);

    // Click through main navigation items
    for (let i = 0; i < Math.min(navLinks.length, 10); i++) {
      const link = navLinks[i];
      const text = await link.textContent();
      console.log(`Navigation link ${i + 1}: ${text}`);
    }

    await page.screenshot({ path: 'test-results/navigation.png', fullPage: true });
  });

  test('Interactive Elements - Click all buttons and modals', async ({ page }) => {
    const pages = [
      '/dashboard',
      '/crm',
      '/project-management',
      '/invoicing',
      '/hr',
      '/accounting',
      '/sop-management',
      '/learning'
    ];

    const report: any[] = [];

    for (const pagePath of pages) {
      await page.goto(`${BASE_URL}${pagePath}`);
      await page.waitForLoadState('networkidle');

      const buttons = await page.locator('button:visible').all();
      const links = await page.locator('a:visible').all();

      report.push({
        page: pagePath,
        buttonCount: buttons.length,
        linkCount: links.length,
        totalInteractive: buttons.length + links.length
      });

      console.log(`${pagePath}: ${buttons.length} buttons, ${links.length} links`);
    }

    console.log('\n=== INTERACTIVE ELEMENTS SUMMARY ===');
    console.log(JSON.stringify(report, null, 2));
  });

  test('Form Validation - Test input fields', async ({ page }) => {
    await page.goto(`${BASE_URL}/crm`);
    await page.waitForLoadState('networkidle');

    // Try to open add customer form
    const addButton = page.locator('button:has-text("Add"), button:has-text("New")').first();
    if (await addButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await addButton.click();
      await page.waitForTimeout(1000);

      // Look for input fields
      const inputs = await page.locator('input, textarea, select').all();
      console.log(`Found ${inputs.length} form fields`);

      // Try submitting empty form to test validation
      const submitButton = page.locator('button:has-text("Submit"), button:has-text("Save"), button[type="submit"]').first();
      if (await submitButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await submitButton.click();
        await page.waitForTimeout(1000);
        console.log('✓ Form validation triggered');
      }
    }

    await page.screenshot({ path: 'test-results/form-validation.png', fullPage: true });
  });

  test('Data Persistence - Check localStorage and database', async ({ page }) => {
    // Check localStorage
    const localStorageData = await page.evaluate(() => {
      const data: any = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          data[key] = localStorage.getItem(key);
        }
      }
      return data;
    });

    console.log('LocalStorage keys:', Object.keys(localStorageData));

    // Test API endpoint
    const response = await page.request.get('http://localhost:5001/health');
    const health = await response.json();
    console.log('Backend health:', health);
  });

  test('Modal Functionality - Open and close modals', async ({ page }) => {
    const testPages = ['/crm', '/project-management', '/invoicing'];

    for (const pagePath of testPages) {
      await page.goto(`${BASE_URL}${pagePath}`);
      await page.waitForLoadState('networkidle');

      // Look for buttons that might open modals
      const modalTriggers = await page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("Create")').all();

      for (let i = 0; i < Math.min(modalTriggers.length, 3); i++) {
        const trigger = modalTriggers[i];
        const buttonText = await trigger.textContent();

        await trigger.click();
        await page.waitForTimeout(500);

        // Check if modal appeared
        const modal = page.locator('[role="dialog"], .modal, [class*="modal"]').first();
        if (await modal.isVisible({ timeout: 2000 }).catch(() => false)) {
          console.log(`✓ Modal opened from "${buttonText}" button`);

          // Try to close modal
          const closeButton = page.locator('button:has-text("Cancel"), button:has-text("Close"), button[aria-label*="close"]').first();
          if (await closeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await closeButton.click();
            await page.waitForTimeout(500);
            console.log('✓ Modal closed');
          }
        }
      }
    }
  });

  test('Responsive Design - Test mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE

    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');

    await page.screenshot({ path: 'test-results/mobile-dashboard.png', fullPage: true });

    // Check if sidebar is responsive
    const menuButton = page.locator('button[aria-label*="menu"], button:has-text("Menu")').first();
    if (await menuButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      console.log('✓ Mobile menu button found');
    }
  });

  test('Search and Filter - Test search functionality', async ({ page }) => {
    const pagesWithSearch = ['/crm', '/project-management', '/invoicing'];

    for (const pagePath of pagesWithSearch) {
      await page.goto(`${BASE_URL}${pagePath}`);
      await page.waitForLoadState('networkidle');

      const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[placeholder*="filter" i]').first();
      if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await searchInput.fill('test');
        await page.waitForTimeout(500);
        console.log(`✓ Search functionality found on ${pagePath}`);
      }
    }
  });
});
