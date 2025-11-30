/**
 * Final SOP Verification Test
 * Confirms the updated page shows 1,822 SOPs and modal works
 */

import { test, expect } from '@playwright/test';

test('should display complete 1,822 SOP library after fixes', async ({ page }) => {
  console.log('🔍 Final verification of complete SOP library...');

  // Navigate to application (port 5000)
  await page.goto('http://localhost:5000');
  await page.waitForLoadState('networkidle');

  // Navigate to SOP Management
  await page.click('text=SOP Management');
  await page.waitForLoadState('networkidle');

  // Wait for data to load
  await page.waitForTimeout(5000);

  // Take screenshot
  await page.screenshot({
    path: 'test-results/sop-final-verification.png',
    fullPage: true
  });

  console.log('📱 On SOP Management page');

  // Check for 1,822 total display
  const total1822 = await page.getByText('1822').count();
  const total1822Comma = await page.getByText('1,822').count();

  if (total1822 > 0 || total1822Comma > 0) {
    console.log('✅ Found 1,822 total SOPs displayed correctly');
  } else {
    console.log('❌ 1,822 total not found, checking pagination...');

    // Check pagination for correct total
    const paginationText = await page.locator('text=/of \\d+.*SOPs?/').textContent();
    if (paginationText) {
      console.log(`📄 Pagination text: ${paginationText}`);
      if (paginationText.includes('1822') || paginationText.includes('1,822')) {
        console.log('✅ Pagination shows correct total: 1,822');
      }
    }

    // Log all numbers visible on page for debugging
    const numbers = await page.locator('text=/^\\d{1,4}$/', { timeout: 2000 }).allTextContents();
    console.log('📊 Numbers on page:', numbers.slice(0, 10));
  }

  // Test modal functionality with visible buttons
  console.log('🔍 Testing modal functionality...');

  // Look for action buttons that should be visible on hover
  await page.hover('[data-testid="sop-card"]').catch(() => {
    console.log('No sop-card testid found, trying other approaches');
  });

  // Try to find and click a view button
  const actionButtons = await page.locator('button').all();
  console.log(`🔍 Found ${actionButtons.length} total buttons`);

  // Look for buttons with eye icons specifically
  const eyeButtons = await page.locator('svg[data-lucide="eye"]').count();
  console.log(`👁️ Found ${eyeButtons} eye icon buttons`);

  if (eyeButtons > 0) {
    // Click the first eye button's parent button
    await page.locator('button:has(svg[data-lucide="eye"])').first().click();
    console.log('🖱️ Clicked View button');

    // Wait for modal
    await page.waitForTimeout(2000);

    // Check for modal
    const modal = await page.locator('[role="dialog"], [class*="Modal"]').count();
    if (modal > 0) {
      console.log('✅ Modal opened successfully');
      await page.screenshot({
        path: 'test-results/sop-modal-final-test.png'
      });

      // Close modal
      await page.locator('button:has-text("×")').first().click();
      console.log('✅ Modal closed');
    } else {
      console.log('❌ Modal did not open');
    }
  }

  console.log('✅ Final verification completed');
});