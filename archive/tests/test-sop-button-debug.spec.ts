/**
 * Debug test to see what happens with action buttons
 */

import { test, expect } from '@playwright/test';

test.describe('SOP Button Debug', () => {
  test('debug action button behavior', async ({ page }) => {
    console.log('🔍 Debug: Checking action button behavior...');

    // Navigate to SOP Management
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    await page.click('text=SOP Management');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    // Look for any SOP element to click
    const allDivs = await page.locator('div').count();
    console.log(`📊 Found ${allDivs} div elements on page`);

    // Try to find clickable SOPs
    const clickableSOPs = await page.locator('div[style*="cursor"]').count();
    console.log(`🖱️ Found ${clickableSOPs} potentially clickable elements`);

    // Try to click on first clickable element
    const sopElements = page.locator('div').filter({ hasText: /SOP|Foundation|Enterprise|Management|Safety/ });
    const sopCount = await sopElements.count();
    console.log(`📋 Found ${sopCount} SOP-related elements`);

    if (sopCount > 0) {
      const firstSOP = sopElements.first();
      const sopText = await firstSOP.textContent();
      console.log(`🎯 Clicking on: ${sopText?.substring(0, 100)}...`);

      await firstSOP.click();
      await page.waitForTimeout(3000);

      // Check if modal opened
      const modalVisible = await page.isVisible('.modal-overlay, [class*="Modal"], [data-testid*="modal"]');
      console.log(`📱 Modal visible: ${modalVisible}`);

      if (modalVisible) {
        // Look for action buttons
        const editBtn = page.locator('button').filter({ hasText: /Edit/i });
        const duplicateBtn = page.locator('button').filter({ hasText: /Duplicate|Copy/i });
        const downloadBtn = page.locator('button').filter({ hasText: /Download/i });

        const editCount = await editBtn.count();
        const duplicateCount = await duplicateBtn.count();
        const downloadCount = await downloadBtn.count();

        console.log(`🔧 Edit buttons found: ${editCount}`);
        console.log(`📄 Duplicate buttons found: ${duplicateCount}`);
        console.log(`🔽 Download buttons found: ${downloadCount}`);

        // Take screenshot of modal with buttons
        await page.screenshot({
          path: 'test-results/debug-modal-with-buttons.png',
          fullPage: true
        });

        // List all visible buttons
        const allButtons = await page.locator('button').allTextContents();
        console.log(`🔘 All buttons found: ${allButtons.join(', ')}`);

        // Test one button if available
        if (editCount > 0) {
          console.log('🧪 Testing Edit button...');
          await editBtn.first().click();
          await page.waitForTimeout(1000);

          const stillVisible = await page.isVisible('.modal-overlay, [class*="Modal"]');
          console.log(`📱 Modal still visible after edit click: ${stillVisible}`);

          await page.screenshot({
            path: 'test-results/debug-after-edit-click.png',
            fullPage: true
          });
        }
      } else {
        console.log('❌ Modal did not open');
        await page.screenshot({
          path: 'test-results/debug-no-modal.png',
          fullPage: true
        });
      }
    } else {
      console.log('❌ No SOP elements found to click');
      await page.screenshot({
        path: 'test-results/debug-no-sops.png',
        fullPage: true
      });
    }
  });
});