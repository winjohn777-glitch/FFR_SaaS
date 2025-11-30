import { test, expect } from '@playwright/test';

test('Manual David Johnson customer creation test', async ({ page }) => {
  console.log('🎯 Starting manual David Johnson customer creation test...');

  // Navigate to the application
  await page.goto('http://localhost:3000');

  console.log('📍 Navigating to CRM section...');

  // Navigate to CRM
  await page.click('a[href="/crm"]', { timeout: 10000 });
  await page.waitForURL('**/crm');

  console.log('🔍 Looking for Add Customer button...');

  // Wait for and click Add Customer button
  await page.waitForSelector('button:has-text("Add Customer")', { timeout: 10000 });
  await page.click('button:has-text("Add Customer")');

  console.log('📝 Filling out David Johnson customer form...');

  // Wait for modal to appear
  await page.waitForSelector('h2:has-text("Add New Customer")', { timeout: 5000 });

  // Fill out David Johnson information
  await page.fill('input[placeholder="Enter first name"]', 'David');
  await page.fill('input[placeholder="Enter last name"]', 'Johnson');
  await page.fill('input[placeholder="customer@example.com"]', 'david.johnson@email.com');
  await page.fill('input[placeholder="(xxx) xxx-xxxx"]', '321-123-4567');
  await page.fill('input[placeholder="Street address"]', '3812 coopers corner');
  await page.fill('input[placeholder="City"]', 'abc');
  await page.fill('input[placeholder="State"]', 'FL');
  await page.fill('input[placeholder="ZIP Code"]', '33777');

  console.log('✅ Form filled, submitting...');

  // Submit the form
  await page.click('button:has-text("Add Customer")');

  console.log('⏳ Waiting for modal to close...');

  // Wait for modal to close
  await page.waitForSelector('h2:has-text("Add New Customer")', { state: 'hidden', timeout: 5000 });

  console.log('🔍 Checking if David Johnson appears in customer list...');

  // Check if David Johnson is now in the customer list
  const davidJohnsonExists = await page.locator('.customer-card:has-text("David Johnson")').count();

  console.log(`📊 David Johnson customer cards found: ${davidJohnsonExists}`);

  if (davidJohnsonExists > 0) {
    console.log('✅ SUCCESS: David Johnson customer was created and is visible in the list!');

    // Get customer details to verify
    const customerCard = page.locator('.customer-card:has-text("David Johnson")').first();
    const emailText = await customerCard.locator('text=david.johnson@email.com').count();
    const phoneText = await customerCard.locator('text=321-123-4567').count();

    console.log(`📧 Email found: ${emailText > 0 ? 'YES' : 'NO'}`);
    console.log(`📞 Phone found: ${phoneText > 0 ? 'YES' : 'NO'}`);

    expect(davidJohnsonExists).toBeGreaterThan(0);
    expect(emailText).toBeGreaterThan(0);
    expect(phoneText).toBeGreaterThan(0);

  } else {
    console.log('❌ FAILURE: David Johnson customer was NOT created or is not visible in the list!');

    // Take screenshot for debugging
    await page.screenshot({ path: 'debug-david-johnson-missing.png', fullPage: true });

    // Log the current customer list for debugging
    const allCustomers = await page.locator('.customer-card').allTextContents();
    console.log('📋 Current customers in list:', allCustomers);

    // Check if there are any customers at all
    const totalCustomers = await page.locator('.customer-card').count();
    console.log(`📊 Total customers found: ${totalCustomers}`);

    throw new Error('David Johnson customer was not created successfully');
  }

  console.log('🎯 Test completed successfully!');
});