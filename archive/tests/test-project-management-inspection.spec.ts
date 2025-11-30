import { test, expect } from '@playwright/test';

test('Project Management Visual Inspection', async ({ page }) => {
  console.log('🎯 Starting Project Management visual inspection...');

  // Navigate to the application (using the correct port from server output)
  await page.goto('http://localhost:5000');

  console.log('📍 Navigating to Project Management section...');

  // Wait for the page to load and navigate to Project Management
  await page.waitForLoadState('networkidle');

  // Take screenshot of main page first
  await page.screenshot({
    path: '/tmp/claude/main-page.png',
    fullPage: true
  });

  // Navigate to Project Management
  await page.click('a[href="/project-management"]', { timeout: 10000 });
  await page.waitForURL('**/project-management');
  await page.waitForLoadState('networkidle');

  console.log('📸 Taking screenshot of Project Management page...');
  await page.screenshot({
    path: '/tmp/claude/project-management-page.png',
    fullPage: true
  });

  console.log('🔍 Testing Permits tab...');

  // Click on Permits tab
  await page.click('button:has-text("Permits")', { timeout: 10000 });
  await page.waitForTimeout(1000); // Wait for tab content to load

  // Take screenshot of Permits tab
  await page.screenshot({
    path: '/tmp/claude/permits-tab.png',
    fullPage: true
  });

  // Test the "+Add Permit" button - should open a modal, not an alert
  console.log('🧪 Testing +Add Permit button...');

  // Set up a listener for alerts to detect if an alert pops up (which would be wrong)
  let alertFired = false;
  page.on('dialog', async dialog => {
    console.log('❌ ALERT DETECTED (this is wrong):', dialog.message());
    alertFired = true;
    await dialog.dismiss();
  });

  // Click the +Add Permit button
  await page.click('button:has-text("Add Permit")', { timeout: 10000 });
  await page.waitForTimeout(1000); // Wait to see if modal appears

  // Check if a modal opened instead of an alert
  const modalExists = await page.locator('[role="dialog"], .modal, .modal-overlay').count();

  console.log(`📋 Modal detected: ${modalExists > 0 ? 'YES' : 'NO'}`);
  console.log(`🚨 Alert fired: ${alertFired ? 'YES (BAD)' : 'NO (GOOD)'}`);

  if (modalExists > 0) {
    console.log('✅ SUCCESS: +Add Permit opens a modal');
    await page.screenshot({
      path: '/tmp/claude/add-permit-modal.png',
      fullPage: true
    });

    // Close the modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  } else if (!alertFired) {
    console.log('❓ No modal or alert detected - checking for other UI changes...');
    await page.screenshot({
      path: '/tmp/claude/add-permit-no-modal.png',
      fullPage: true
    });
  }

  console.log('🔍 Testing Budget tab...');

  // Click on Budget tab
  await page.click('button:has-text("Budget")', { timeout: 10000 });
  await page.waitForTimeout(1000); // Wait for tab content to load

  // Take screenshot of Budget tab
  await page.screenshot({
    path: '/tmp/claude/budget-tab.png',
    fullPage: true
  });

  // Test the "+Add Budget Item" button
  console.log('🧪 Testing +Add Budget Item button...');

  // Reset alert listener
  alertFired = false;

  // Click the +Add Budget Item button
  await page.click('button:has-text("Add Budget Item")', { timeout: 10000 });
  await page.waitForTimeout(1000); // Wait to see if modal appears

  // Check if a modal opened
  const budgetModalExists = await page.locator('[role="dialog"], .modal, .modal-overlay').count();

  console.log(`📋 Budget modal detected: ${budgetModalExists > 0 ? 'YES' : 'NO'}`);
  console.log(`🚨 Alert fired: ${alertFired ? 'YES (BAD)' : 'NO (GOOD)'}`);

  if (budgetModalExists > 0) {
    console.log('✅ SUCCESS: +Add Budget Item opens a modal');

    // Check for auto-populated data from projects
    const formElements = await page.locator('input, select, textarea').count();
    console.log(`📝 Form elements found in modal: ${formElements}`);

    await page.screenshot({
      path: '/tmp/claude/add-budget-item-modal.png',
      fullPage: true
    });

    // Close the modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }

  console.log('🔍 Testing Customer Review tab...');

  // Click on Customer Review tab
  await page.click('button:has-text("Customer Review")', { timeout: 10000 });
  await page.waitForTimeout(1000); // Wait for tab content to load

  // Take screenshot of Customer Review tab
  await page.screenshot({
    path: '/tmp/claude/customer-review-tab.png',
    fullPage: true
  });

  // Check layout - verify it doesn't run off the page
  const viewportSize = page.viewportSize();
  const pageContent = page.locator('body');
  const contentBox = await pageContent.boundingBox();

  console.log(`🖥️  Viewport: ${viewportSize?.width}x${viewportSize?.height}`);
  console.log(`📏 Content box: ${contentBox?.width}x${contentBox?.height}`);

  // Check for horizontal scrollbar
  const hasHorizontalScroll = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });

  console.log(`🔄 Horizontal scroll needed: ${hasHorizontalScroll ? 'YES (BAD)' : 'NO (GOOD)'}`);

  if (hasHorizontalScroll) {
    console.log('❌ WARNING: Content runs off the page horizontally');
  } else {
    console.log('✅ SUCCESS: Customer Review tab layout is properly contained');
  }

  console.log('🎯 Visual inspection completed!');

  // Final summary screenshot
  await page.screenshot({
    path: '/tmp/claude/final-project-management-state.png',
    fullPage: true
  });
});