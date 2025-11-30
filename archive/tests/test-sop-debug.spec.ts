/**
 * Debug Test for SOP Management Interface
 * Identifies why the interface is not showing correct data
 */

import { test, expect } from '@playwright/test';

test.describe('SOP Management Debug Investigation', () => {
  test('should debug SOP data loading issues', async ({ page }) => {
    console.log('🔍 Starting SOP Management debug investigation...');

    // Enable console logging
    page.on('console', msg => {
      console.log(`BROWSER: ${msg.type()}: ${msg.text()}`);
    });

    // Enable network request logging
    page.on('request', request => {
      if (request.url().includes('sop')) {
        console.log(`REQUEST: ${request.method()} ${request.url()}`);
      }
    });

    page.on('response', response => {
      if (response.url().includes('sop')) {
        console.log(`RESPONSE: ${response.status()} ${response.url()}`);
      }
    });

    // Navigate to the application
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Take initial screenshot
    await page.screenshot({
      path: 'test-results/debug-initial-page.png',
      fullPage: true
    });

    console.log('📱 Navigating to SOP Management...');

    // Navigate to SOP Management and wait for requests
    await page.click('text=SOP Management');
    await page.waitForTimeout(5000); // Wait for all requests to complete

    // Take screenshot after navigation
    await page.screenshot({
      path: 'test-results/debug-sop-management.png',
      fullPage: true
    });

    // Check for any error messages
    const errorElements = await page.locator('.error, [class*="error"], [data-testid*="error"]').count();
    console.log(`❌ Error elements found: ${errorElements}`);

    // Check what API requests were made
    console.log('🌐 Checking API endpoints...');

    // Try to find the statistics display
    const statsElements = await page.locator('text=/\\d+/').all();
    for (let i = 0; i < Math.min(statsElements.length, 10); i++) {
      const text = await statsElements[i].textContent();
      console.log(`📊 Stats element ${i}: "${text}"`);
    }

    // Check for loading states
    const loadingElements = await page.locator('[class*="loading"], [data-testid*="loading"], text=Loading').count();
    console.log(`⏳ Loading elements: ${loadingElements}`);

    // Check console for errors
    await page.evaluate(() => {
      console.log('Frontend state check - looking for window.debugInfo');
      if (window.localStorage) {
        console.log('LocalStorage keys:', Object.keys(window.localStorage));
      }
    });

    // Try to manually trigger a refresh of data
    console.log('🔄 Attempting to refresh data...');
    await page.keyboard.press('F5');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await page.screenshot({
      path: 'test-results/debug-after-refresh.png',
      fullPage: true
    });

    console.log('✅ Debug investigation completed');
  });

  test('should test API endpoints directly', async ({ page }) => {
    console.log('🔍 Testing API endpoints directly...');

    // Test statistics endpoint
    const statsResponse = await page.request.get('http://localhost:5001/api/sop/statistics');
    console.log(`📊 Statistics API Status: ${statsResponse.status()}`);
    if (statsResponse.ok()) {
      const statsData = await statsResponse.json();
      console.log('📊 Statistics Data:', JSON.stringify(statsData, null, 2));
    }

    // Test procedures endpoint
    const proceduresResponse = await page.request.get('http://localhost:5001/api/sop/procedures?limit=5');
    console.log(`📋 Procedures API Status: ${proceduresResponse.status()}`);
    if (proceduresResponse.ok()) {
      const proceduresData = await proceduresResponse.json();
      console.log(`📋 Procedures Count: ${proceduresData.data?.length || 0}`);
      console.log(`📋 Total: ${proceduresData.pagination?.total || 'unknown'}`);
    }

    // Test categories endpoint
    const categoriesResponse = await page.request.get('http://localhost:5001/api/sop/categories');
    console.log(`📁 Categories API Status: ${categoriesResponse.status()}`);
    if (categoriesResponse.ok()) {
      const categoriesData = await categoriesResponse.json();
      console.log(`📁 Categories Count: ${categoriesData.data?.length || 0}`);
    }

    console.log('✅ API endpoint testing completed');
  });
});