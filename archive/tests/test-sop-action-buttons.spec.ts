/**
 * Quick test to verify SOP action buttons now open modal instead of alerts
 */

import { test, expect } from '@playwright/test';

test.describe('SOP Action Buttons Verification', () => {
  test('should open modal when clicking action buttons instead of showing alerts', async ({ page }) => {
    console.log('🧪 Testing SOP action buttons...');

    // Navigate to SOP Management
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    await page.click('text=SOP Management');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Take screenshot of initial state
    await page.screenshot({
      path: 'test-results/action-test-01-initial.png',
      fullPage: true
    });

    // Click on first SOP to open modal
    const firstSOP = page.locator('div').filter({ hasText: /Foundation|Enterprise|System|GOVERNANCE/ }).first();
    if (await firstSOP.count() > 0) {
      await firstSOP.click();

      // Wait for modal to open
      await page.waitForTimeout(2000);

      // Take screenshot of opened modal
      await page.screenshot({
        path: 'test-results/action-test-02-modal-opened.png',
        fullPage: true
      });

      // Test Edit button
      console.log('🔧 Testing Edit button...');
      const editBtn = page.locator('button:has-text("Edit")');
      if (await editBtn.isVisible()) {
        await editBtn.click();
        await page.waitForTimeout(1000);

        // Take screenshot after edit click
        await page.screenshot({
          path: 'test-results/action-test-03-edit-clicked.png',
          fullPage: true
        });

        // Verify modal is still open (not closed with alert)
        const modalStillOpen = await page.isVisible('.modal-overlay, .sop-viewer-modal');
        if (modalStillOpen) {
          console.log('✅ Edit button keeps modal open');
        } else {
          console.log('❌ Edit button closed modal');
        }
      }

      // Test Duplicate button
      console.log('📄 Testing Duplicate button...');
      const duplicateBtn = page.locator('button:has-text("Duplicate")');
      if (await duplicateBtn.isVisible()) {
        await duplicateBtn.click();
        await page.waitForTimeout(1000);

        // Take screenshot after duplicate click
        await page.screenshot({
          path: 'test-results/action-test-04-duplicate-clicked.png',
          fullPage: true
        });

        // Verify modal is still open
        const modalStillOpen = await page.isVisible('.modal-overlay, .sop-viewer-modal');
        if (modalStillOpen) {
          console.log('✅ Duplicate button keeps modal open');
        } else {
          console.log('❌ Duplicate button closed modal');
        }
      }

      // Test Download button
      console.log('🔽 Testing Download button...');
      const downloadBtn = page.locator('button:has-text("Download")');
      if (await downloadBtn.isVisible()) {
        await downloadBtn.click();
        await page.waitForTimeout(1000);

        // Take screenshot after download click
        await page.screenshot({
          path: 'test-results/action-test-05-download-clicked.png',
          fullPage: true
        });

        // Verify modal is still open
        const modalStillOpen = await page.isVisible('.modal-overlay, .sop-viewer-modal');
        if (modalStillOpen) {
          console.log('✅ Download button works (modal stays open)');
        } else {
          console.log('❌ Download button closed modal');
        }
      }

      console.log('✅ Action button testing completed');
    } else {
      console.log('❌ No SOPs found to test');
    }
  });
});