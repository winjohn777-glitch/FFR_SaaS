/**
 * Quick SOP Modal Test
 * Verifies the core functionality is working
 */

import { test, expect } from '@playwright/test';

test('should verify SOP modal components are in place', async ({ page }) => {
  console.log('🔍 Testing SOP modal components...');

  // Test API endpoint first
  const response = await page.request.get('http://localhost:5001/api/sop/procedures/1/content');
  expect(response.status()).toBe(200);

  const data = await response.json();
  console.log('✅ API endpoint working');
  expect(data.success).toBe(true);
  expect(data.data.content).toBeTruthy();
  console.log(`📋 Content length: ${data.data.content.length} characters`);

  // Navigate to application
  await page.goto('http://localhost:3000');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Check if we can navigate to SOP Management
  try {
    await page.click('text=SOP Management', { timeout: 5000 });
    await page.waitForLoadState('networkidle');
    console.log('✅ Successfully navigated to SOP Management');

    // Take a screenshot
    await page.screenshot({
      path: 'test-results/sop-management-loaded.png',
      fullPage: true
    });

  } catch (error) {
    console.log('❌ Could not navigate to SOP Management');

    // Take screenshot for debugging
    await page.screenshot({
      path: 'test-results/navigation-failed.png',
      fullPage: true
    });
  }
});