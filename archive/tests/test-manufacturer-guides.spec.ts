import { test, expect } from '@playwright/test';

test('Manufacturer Guide System Integration Test', async ({ page }) => {
  // Navigate to the application
  await page.goto('http://localhost:3000');

  // Wait for page to load
  await page.waitForTimeout(3000);

  console.log('🔍 Testing Manufacturer Guide Integration...');

  // Step 1: Navigate to Documents page
  console.log('📂 Step 1: Navigating to Documents page');
  await page.locator('text=Documents').first().click();
  await page.waitForTimeout(2000);

  // Step 2: Check for Manufacturer Guides folder
  console.log('📋 Step 2: Checking for Manufacturer Guides folder');
  const mfgGuidesFolder = page.locator('text=Manufacturer Guides');
  const folderExists = await mfgGuidesFolder.isVisible();
  console.log(`✅ Manufacturer Guides folder found: ${folderExists}`);

  // Step 3: Click on Manufacturer Guides folder
  if (folderExists) {
    await mfgGuidesFolder.click();
    await page.waitForTimeout(1000);

    // Count manufacturer guide documents
    const guideCards = page.locator('[data-testid*="doc"], .document-card, [class*="DocumentCard"]');
    const guideCount = await guideCards.count();
    console.log(`📄 Manufacturer guide documents found: ${guideCount}`);
  }

  // Step 4: Check for Download Manufacturer Guides button
  console.log('⬇️ Step 4: Checking for Download Manufacturer Guides button');
  const downloadButton = page.locator('text=Download Mfg Guides');
  const downloadButtonExists = await downloadButton.isVisible();
  console.log(`🔽 Download Mfg Guides button found: ${downloadButtonExists}`);

  // Step 5: Navigate to SOPs page to test integration
  console.log('📋 Step 5: Navigating to SOPs page');
  await page.locator('text=SOPs').first().click();
  await page.waitForTimeout(3000);

  // Step 6: Look for 1500 series SOPs (roofing products)
  console.log('🏗️ Step 6: Looking for 1500 series SOPs');
  const category1500 = page.locator('text=Miami-Dade NOA Roof Systems');
  const category1500Exists = await category1500.isVisible();
  console.log(`🏠 1500 series category found: ${category1500Exists}`);

  if (category1500Exists) {
    await category1500.click();
    await page.waitForTimeout(2000);

    // Look for specific manufacturer SOPs
    const sopCards = page.locator('text=/GAF|Carlisle|Eagle|Firestone/');
    const sopCount = await sopCards.count();
    console.log(`🏷️ Manufacturer SOPs found: ${sopCount}`);

    // Try to click on a GAF SOP to test the integration
    const gafSop = page.locator('text=/GAF.*Timberline|GAF.*HDZ/').first();
    const gafSopExists = await gafSop.isVisible();

    if (gafSopExists) {
      console.log('🎯 Step 7: Testing GAF SOP integration');
      await gafSop.click();
      await page.waitForTimeout(2000);

      // Look for the "Installation Guide" button in the modal
      const installationGuideButton = page.locator('text=Installation Guide');
      const integrationButtonExists = await installationGuideButton.isVisible();
      console.log(`🔗 Installation Guide button found: ${integrationButtonExists}`);
    }
  }

  // Take a screenshot of the final state
  await page.screenshot({ path: 'manufacturer-guides-integration.png', fullPage: true });

  console.log('✅ Manufacturer Guide Integration Test completed');
  console.log('📸 Screenshot saved as manufacturer-guides-integration.png');
});