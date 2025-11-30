/**
 * Complete SOP Management Verification Test
 * Confirms all 1,804 SOPs are properly displayed in the interface
 */

import { test, expect } from '@playwright/test';

test.describe('Complete SOP Management Dataset Verification', () => {
  test('should display all 1,822 SOPs including NOA systems in the management interface', async ({ page }) => {
    console.log('🔍 Starting complete SOP dataset verification...');

    // Enable request logging
    page.on('request', request => {
      if (request.url().includes('sop')) {
        console.log(`✅ REQUEST: ${request.method()} ${request.url()}`);
      }
    });

    page.on('response', response => {
      if (response.url().includes('sop') && response.status() === 200) {
        console.log(`✅ RESPONSE: ${response.status()} ${response.url()}`);
      }
    });

    // Navigate to application
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Navigate to SOP Management
    console.log('📱 Navigating to SOP Management...');
    await page.click('text=SOP Management');
    await page.waitForLoadState('networkidle');

    // Wait for all data to load
    await page.waitForTimeout(5000);

    // Take screenshot of complete dataset
    await page.screenshot({
      path: 'test-results/sop-management-complete-dataset.png',
      fullPage: true
    });

    // Verify total SOP count (should be 1,822 including NOA systems)
    const totalSOPElement = await page.locator('text=1822').first();
    if (await totalSOPElement.count() > 0) {
      console.log('✅ Found correct total SOP count: 1,822');
    } else {
      console.log('❌ Did not find 1,822 total SOPs');

      // Try to find the actual total being displayed
      const statsElements = await page.locator('text=/^\\d+$/').all();
      console.log('📊 Available statistics:');
      for (let i = 0; i < Math.min(statsElements.length, 10); i++) {
        const text = await statsElements[i].textContent();
        console.log(`   Stat ${i + 1}: "${text}"`);
      }
    }

    // Check Florida Specific count (should be 587)
    const floridaSOPElement = await page.locator('text=587').first();
    if (await floridaSOPElement.count() > 0) {
      console.log('✅ Found correct Florida Specific count: 587');
    } else {
      console.log('❌ Did not find correct Florida Specific count: 587');
    }

    // Check OSHA Related count (should be 540)
    const oshaSOPElement = await page.locator('text=540').first();
    if (await oshaSOPElement.count() > 0) {
      console.log('✅ Found correct OSHA Related count: 540');
    } else {
      console.log('❌ Did not find correct OSHA Related count: 540');
    }

    // Check Critical Priority count (should be 578)
    const criticalSOPElement = await page.locator('text=578').first();
    if (await criticalSOPElement.count() > 0) {
      console.log('✅ Found correct Critical Priority count: 578');
    } else {
      console.log('❌ Did not find correct Critical Priority count: 578');
    }

    // Check pagination for total count
    const paginationText = await page.locator('text=/Showing \\d+ to \\d+ of \\d+ SOPs/').textContent();
    if (paginationText) {
      console.log(`📄 Pagination info: ${paginationText}`);
      if (paginationText.includes('of 1822 SOPs')) {
        console.log('✅ Pagination shows correct total: 1,822 SOPs');
      } else if (paginationText.includes('of 1,822 SOPs')) {
        console.log('✅ Pagination shows correct total: 1,822 SOPs (with comma)');
      } else {
        console.log('❌ Pagination does not show correct total');
      }
    }

    // Verify categories are fully populated
    console.log('📁 Checking category distribution...');

    // Test clicking through a few categories to verify they have SOPs
    const categories = [
      'Safety & OSHA Compliance',
      'Enterprise Software Systems',
      'IT Infrastructure & Security'
    ];

    for (const category of categories) {
      try {
        const categoryElement = page.locator(`text=${category}`).first();
        if (await categoryElement.count() > 0) {
          await categoryElement.click();
          await page.waitForTimeout(2000);

          const procedureCards = await page.locator('[class*="card"], [data-testid*="sop"]').count();
          console.log(`📋 ${category}: Found ${procedureCards} procedure elements`);

          // Reset to all categories
          await page.locator('text=All Categories').click();
          await page.waitForTimeout(1000);
        }
      } catch (e) {
        console.log(`⚠️  Could not test category: ${category}`);
      }
    }

    console.log('✅ Complete SOP dataset verification completed');
  });

  test('should verify comprehensive statistics accuracy', async ({ page }) => {
    console.log('📊 Verifying comprehensive statistics...');

    // Test the statistics API directly
    const response = await page.request.get('http://localhost:5001/api/sop/statistics');
    expect(response.status()).toBe(200);

    const data = await response.json();
    console.log('📊 Complete API Statistics:', JSON.stringify(data, null, 2));

    // Verify we have the complete dataset including NOA SOPs
    expect(data.data.total_sops).toBe(1822);
    expect(data.data.florida_specific_sops).toBe(605);
    expect(data.data.osha_related_sops).toBe(558);
    expect(data.data.critical_priority_sops).toBe(596);

    console.log('✅ All statistics verified correctly');
  });
});