import { test, expect } from '@playwright/test';

test('Visual SOP Browser Test - Check Display', async ({ page }) => {
  // Navigate to the application
  await page.goto('http://localhost:3000');

  // Wait for page to load
  await page.waitForTimeout(3000);

  // Look for the sidebar and navigation
  await page.waitForSelector('nav, [data-testid="sidebar"], a[href*="sop"]', { timeout: 10000 });

  // Try to find and click SOPs link
  const sopLink = page.locator('text=SOPs').first();
  if (await sopLink.isVisible()) {
    await sopLink.click();
  } else {
    // Try alternative selectors
    const altSopLink = page.locator('a[href*="sop"], a[href*="SOP"]').first();
    await altSopLink.click();
  }

  // Wait for SOP page to load
  await page.waitForTimeout(2000);

  // Take a screenshot to see what's displayed
  await page.screenshot({ path: 'sop-current-display.png', fullPage: true });

  // Check for total count display
  const totalDisplay = page.locator('text=/Total.*SOPs?/i');
  if (await totalDisplay.isVisible()) {
    const totalText = await totalDisplay.textContent();
    console.log('📊 Total SOPs display:', totalText);
  } else {
    console.log('❌ No total SOPs display found');
  }

  // Check for any SOP cards or list items
  const sopCards = page.locator('[data-testid*="sop"], .sop-card, .sop-item');
  const cardCount = await sopCards.count();
  console.log(`📋 SOP cards/items found: ${cardCount}`);

  // Check for statistics display
  const statsElements = page.locator('text=/1889|1888|Total|Active/i');
  const statsCount = await statsElements.count();
  console.log(`📈 Statistics elements found: ${statsCount}`);

  // Look for error messages or empty states
  const errorMessages = page.locator('text=/error|failed|0 sops?/i');
  const errorCount = await errorMessages.count();
  console.log(`❌ Error/empty indicators: ${errorCount}`);

  // Log all visible text for debugging
  const bodyText = await page.locator('body').textContent();
  console.log('🔍 Page contains "1889":', bodyText?.includes('1889'));
  console.log('🔍 Page contains "Total":', bodyText?.includes('Total'));
  console.log('🔍 Page contains "SOP":', bodyText?.includes('SOP'));

  console.log('✅ Visual test completed - check sop-current-display.png');
});