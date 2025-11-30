/**
 * SOP Modal Functionality Test
 * Verifies that SOP View buttons open modal with content instead of alerts
 */

import { test, expect } from '@playwright/test';

test.describe('SOP Viewer Modal Functionality', () => {
  test('should open SOP viewer modal when View button is clicked', async ({ page }) => {
    console.log('🔍 Testing SOP modal functionality...');

    // Navigate to application
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Navigate to SOP Management
    console.log('📱 Navigating to SOP Management...');
    await page.click('text=SOP Management');
    await page.waitForLoadState('networkidle');

    // Wait for SOPs to load
    await page.waitForTimeout(3000);

    // Take screenshot of SOP management page
    await page.screenshot({
      path: 'test-results/sop-management-before-modal.png',
      fullPage: true
    });

    // Find the first SOP card with a View button (Eye icon)
    console.log('🔍 Looking for SOP cards with View buttons...');
    let viewButtons = await page.locator('button[data-testid*="view"], button:has([data-lucide="eye"]), button svg[data-lucide="eye"]').all();

    // Fallback: try to find any actionable buttons in SOP cards
    if (viewButtons.length === 0) {
      console.log('🔍 Trying fallback approach - looking for action buttons...');
      viewButtons = await page.locator('button').filter({ hasText: /^$/ }).all(); // Empty text buttons (icon-only)

      if (viewButtons.length === 0) {
        // Last resort - find any buttons within cards
        viewButtons = await page.locator('[class*="card"] button, [class*="Card"] button').all();
      }
    }

    if (viewButtons.length === 0) {
      console.log('❌ No View buttons found');

      // Debug: Take screenshot and check what's actually on the page
      await page.screenshot({
        path: 'test-results/sop-debug-no-buttons.png',
        fullPage: true
      });

      // Log available buttons
      const allButtons = await page.locator('button').all();
      console.log(`📊 Found ${allButtons.length} total buttons on page`);

      expect(viewButtons.length).toBeGreaterThan(0);
      return;
    }

    console.log(`✅ Found ${viewButtons.length} View buttons`);

    // Click the first View button
    console.log('🖱️ Clicking first View button...');
    await viewButtons[0].click();

    // Wait for modal to appear
    await page.waitForTimeout(2000);

    // Check if modal is open (look for modal overlay or modal container)
    const modalOverlay = page.locator('[class*="modal"], [role="dialog"], [class*="Modal"]').first();
    const isModalVisible = await modalOverlay.isVisible();

    if (isModalVisible) {
      console.log('✅ Modal is visible');

      // Take screenshot of open modal
      await page.screenshot({
        path: 'test-results/sop-modal-opened.png',
        fullPage: true
      });

      // Check for modal title
      const modalTitle = page.locator('h1, h2, h3').filter({ hasText: /SOP|Procedure/ }).first();
      if (await modalTitle.count() > 0) {
        const titleText = await modalTitle.textContent();
        console.log(`📋 Modal title: "${titleText}"`);
      }

      // Check for content
      const content = page.locator('div').filter({ hasText: /Purpose|Overview|Procedure|Steps/ }).first();
      if (await content.count() > 0) {
        console.log('✅ Modal contains SOP content');
      } else {
        console.log('❌ Modal does not contain expected SOP content');
      }

      // Check for action buttons (Download, Print, Edit, etc.)
      const downloadButton = page.locator('button:has-text("Download")');
      const printButton = page.locator('button:has-text("Print")');
      const closeButton = page.locator('button:has-text("×"), button[aria-label*="close"]').first();

      if (await downloadButton.count() > 0) {
        console.log('✅ Download button found');
      }
      if (await printButton.count() > 0) {
        console.log('✅ Print button found');
      }
      if (await closeButton.count() > 0) {
        console.log('✅ Close button found');

        // Test closing the modal
        await closeButton.click();
        await page.waitForTimeout(1000);

        const isModalStillVisible = await modalOverlay.isVisible();
        if (!isModalStillVisible) {
          console.log('✅ Modal closes properly');
        } else {
          console.log('❌ Modal did not close');
        }
      }

    } else {
      console.log('❌ Modal is not visible');

      // Check if an alert appeared instead (old behavior)
      const alertPresent = await page.locator('div:has-text("Alert"), div:has-text("SOP")').count();
      if (alertPresent > 0) {
        console.log('❌ Alert appeared instead of modal (old behavior)');
      }

      // Take screenshot for debugging
      await page.screenshot({
        path: 'test-results/sop-modal-not-visible.png',
        fullPage: true
      });

      expect(isModalVisible).toBe(true);
    }
  });

  test('should load SOP content from API', async ({ page }) => {
    console.log('🔍 Testing SOP content loading...');

    // Test the API directly
    const response = await page.request.get('http://localhost:5001/api/sop/procedures/1/content');
    expect(response.status()).toBe(200);

    const data = await response.json();
    console.log('📊 API Response status:', data.success);

    expect(data.success).toBe(true);
    expect(data.data.content).toBeTruthy();
    expect(data.data.content.length).toBeGreaterThan(0);

    console.log(`✅ API returns ${data.data.content.length} characters of content`);
    console.log(`📋 SOP Title: "${data.data.title}"`);
    console.log(`📄 SOP Number: "${data.data.sop_number}"`);
  });

  test('should handle different SOP categories with appropriate content', async ({ page }) => {
    console.log('🔍 Testing different SOP categories...');

    // Test Enterprise Software Systems category (should use specific template)
    const response1 = await page.request.get('http://localhost:5001/api/sop/procedures/1/content');
    const data1 = await response1.json();

    if (data1.success) {
      console.log('✅ Enterprise Systems SOP loaded');
      expect(data1.data.content).toContain('System Overview');
      expect(data1.data.content).toContain('Configuration Steps');
    }

    // Test Safety & OSHA Compliance category (should use safety template)
    const response2 = await page.request.get('http://localhost:5001/api/sop/procedures/54/content');
    const data2 = await response2.json();

    if (data2.success) {
      console.log('✅ Safety & OSHA SOP loaded');
      expect(data2.data.content).toContain('Personal Protective Equipment');
      expect(data2.data.content).toContain('OSHA Compliance');
    }
  });
});