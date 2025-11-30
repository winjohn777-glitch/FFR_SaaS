import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

test.describe('Modal and Form Interaction Tests', () => {
  test.use({ baseURL: BASE_URL });

  test('CRM - Add Customer Modal Interaction', async ({ page }) => {
    console.log('\n🔍 Testing CRM Add Customer Modal');
    console.log('─'.repeat(60));

    await page.goto('/crm');
    await page.waitForLoadState('networkidle');

    // Find and click Add Customer button
    const addCustomerBtn = page.locator('button:has-text("Add Customer")').first();
    const isVisible = await addCustomerBtn.isVisible({ timeout: 5000 }).catch(() => false);

    console.log(`Add Customer button visible: ${isVisible}`);

    if (isVisible) {
      await addCustomerBtn.click();
      await page.waitForTimeout(1000);

      // Take screenshot after click
      await page.screenshot({ path: 'test-results/crm-add-customer-clicked.png', fullPage: true });

      // Look for any modal/dialog/form that appeared
      const modal = page.locator('[role="dialog"], .modal, form, [class*="Modal"]').first();
      const modalVisible = await modal.isVisible({ timeout: 3000 }).catch(() => false);

      console.log(`Modal/Form appeared: ${modalVisible}`);

      if (!modalVisible) {
        // Check for any changes in the DOM
        const bodySnapshot = await page.locator('body').innerHTML();
        console.log('Body HTML length after click:', bodySnapshot.length);

        // Check if any new elements appeared
        const allDivs = await page.locator('div').count();
        console.log(`Total div elements: ${allDivs}`);
      } else {
        // Modal appeared - interact with it
        const inputs = await page.locator('[role="dialog"] input, form input, .modal input').all();
        console.log(`Form inputs in modal: ${inputs.length}`);

        for (let i = 0; i < Math.min(inputs.length, 5); i++) {
          const input = inputs[i];
          const placeholder = await input.getAttribute('placeholder');
          const type = await input.getAttribute('type');
          console.log(`  Input ${i + 1}: type="${type}", placeholder="${placeholder}"`);
        }
      }
    }
  });

  test('Project Management - New Project Button Test', async ({ page }) => {
    console.log('\n🔍 Testing Project Management - New Project');
    console.log('─'.repeat(60));

    await page.goto('/project-management');
    await page.waitForLoadState('networkidle');

    const newProjectBtn = page.locator('button:has-text("New Project")').first();
    const btnExists = await newProjectBtn.isVisible({ timeout: 5000 }).catch(() => false);

    console.log(`New Project button visible: ${btnExists}`);

    if (btnExists) {
      // Get button details
      const btnText = await newProjectBtn.textContent();
      const btnClasses = await newProjectBtn.getAttribute('class');
      console.log(`Button text: "${btnText}"`);
      console.log(`Button classes: ${btnClasses}`);

      await newProjectBtn.click();
      await page.waitForTimeout(1500);

      await page.screenshot({ path: 'test-results/project-new-project-clicked.png', fullPage: true });

      // Check what happened after click
      const url = page.url();
      console.log(`URL after click: ${url}`);
    }
  });

  test('Invoicing - Create Invoice Flow', async ({ page }) => {
    console.log('\n🔍 Testing Invoicing - Create Invoice');
    console.log('─'.repeat(60));

    await page.goto('/invoicing');
    await page.waitForLoadState('networkidle');

    const createInvoiceBtn = page.locator('button:has-text("Create Invoice")').first();
    const btnVisible = await createInvoiceBtn.isVisible({ timeout: 5000 }).catch(() => false);

    console.log(`Create Invoice button visible: ${btnVisible}`);

    if (btnVisible) {
      await createInvoiceBtn.click();
      await page.waitForTimeout(1000);

      await page.screenshot({ path: 'test-results/invoicing-create-clicked.png', fullPage: true });

      // Check for navigation or modal
      const currentUrl = page.url();
      console.log(`Current URL: ${currentUrl}`);

      // Look for form elements
      const forms = await page.locator('form').count();
      const modals = await page.locator('[role="dialog"]').count();
      console.log(`Forms visible: ${forms}`);
      console.log(`Modals visible: ${modals}`);
    }
  });

  test('SOP Management - New SOP Interaction', async ({ page }) => {
    console.log('\n🔍 Testing SOP Management - New SOP');
    console.log('─'.repeat(60));

    await page.goto('/sop-management');
    await page.waitForLoadState('networkidle');

    const newSOPBtn = page.locator('button:has-text("New SOP")').first();
    const btnVisible = await newSOPBtn.isVisible({ timeout: 5000 }).catch(() => false);

    console.log(`New SOP button visible: ${btnVisible}`);

    if (btnVisible) {
      await newSOPBtn.click();
      await page.waitForTimeout(1000);

      await page.screenshot({ path: 'test-results/sop-new-sop-clicked.png', fullPage: true });
    }
  });

  test('Documents - New Contract Interaction', async ({ page }) => {
    console.log('\n🔍 Testing Documents - New Contract');
    console.log('─'.repeat(60));

    await page.goto('/documents');
    await page.waitForLoadState('networkidle');

    const newContractBtn = page.locator('button:has-text("New Contract")').first();
    const btnVisible = await newContractBtn.isVisible({ timeout: 5000 }).catch(() => false);

    console.log(`New Contract button visible: ${btnVisible}`);

    if (btnVisible) {
      await newContractBtn.click();
      await page.waitForTimeout(1000);

      await page.screenshot({ path: 'test-results/documents-new-contract-clicked.png', fullPage: true });

      const currentUrl = page.url();
      console.log(`URL after click: ${currentUrl}`);
    }
  });

  test('SOP - Click on SOP Items', async ({ page }) => {
    console.log('\n🔍 Testing SOP Items - Clicking Individual SOPs');
    console.log('─'.repeat(60));

    await page.goto('/sop-management');
    await page.waitForLoadState('networkidle');

    // Look for clickable SOP items
    const sopButtons = await page.locator('button').all();
    console.log(`Total buttons found: ${sopButtons.length}`);

    // Try clicking buttons that might be SOP items (excluding nav/filter buttons)
    const testButtons = sopButtons.slice(10, 20); // Skip first 10 (likely nav/filters)

    for (let i = 0; i < Math.min(testButtons.length, 3); i++) {
      const btn = testButtons[i];
      const text = await btn.textContent();
      const classes = await btn.getAttribute('class');

      console.log(`\n  Testing button: "${text?.substring(0, 50)}..."`);

      try {
        await btn.click({ timeout: 3000 });
        await page.waitForTimeout(1000);

        // Check for modal
        const modal = page.locator('[role="dialog"], .modal').first();
        const modalVisible = await modal.isVisible({ timeout: 2000 }).catch(() => false);

        if (modalVisible) {
          console.log(`  ✓ Modal opened!`);

          // Get modal content
          const modalContent = await modal.textContent();
          console.log(`  Modal content preview: ${modalContent?.substring(0, 100)}...`);

          await page.screenshot({ path: `test-results/sop-modal-${i}.png`, fullPage: true });

          // Close modal
          const closeBtn = page.locator('[role="dialog"] button:has-text("Close"), [role="dialog"] button[aria-label*="close"]').first();
          if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await closeBtn.click();
            await page.waitForTimeout(500);
            console.log(`  ✓ Modal closed`);
          }
        } else {
          console.log(`  ⚠ No modal appeared`);
        }
      } catch (err: any) {
        console.log(`  ❌ Error clicking: ${err.message}`);
      }
    }
  });

  test('Test All Available API Endpoints', async ({ page }) => {
    console.log('\n📡 Testing All Available API Endpoints');
    console.log('─'.repeat(60));

    const endpoints = [
      { method: 'GET', path: '/api/health', description: 'Health check' },
      { method: 'GET', path: '/api/courses', description: 'LMS courses' },
      { method: 'GET', path: '/api/enrollments', description: 'Course enrollments' },
      { method: 'GET', path: '/api/progress', description: 'Learning progress' },
      { method: 'GET', path: '/api/quizzes', description: 'Quizzes' },
      { method: 'GET', path: '/api/certifications', description: 'Certifications' },
      { method: 'GET', path: '/api/osha', description: 'OSHA compliance' },
      { method: 'GET', path: '/api/reports', description: 'Reports' },
      { method: 'GET', path: '/api/sop/categories', description: 'SOP categories' },
      { method: 'GET', path: '/api/sop/procedures', description: 'SOP procedures' },
    ];

    const results: any[] = [];

    for (const endpoint of endpoints) {
      try {
        const response = await page.request.get(`http://localhost:5001${endpoint.path}`);
        const status = response.status();
        const statusText = response.ok() ? '✓' : '❌';

        console.log(`  ${statusText} ${endpoint.method} ${endpoint.path} - ${status} (${endpoint.description})`);

        results.push({
          ...endpoint,
          status,
          success: response.ok()
        });

        if (response.ok()) {
          const data = await response.json();
          if (Array.isArray(data)) {
            console.log(`    → Returned ${data.length} items`);
          } else if (data.message) {
            console.log(`    → ${data.message}`);
          }
        }
      } catch (err: any) {
        console.log(`  ❌ ${endpoint.path} - Error: ${err.message}`);
        results.push({
          ...endpoint,
          status: 0,
          success: false,
          error: err.message
        });
      }
    }

    console.log(`\n📊 API Summary: ${results.filter(r => r.success).length}/${results.length} endpoints working`);
  });
});
