import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, 'layout-inspection-screenshots');
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

test.describe('Customer Review Tab Layout Inspection', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the application
        await page.goto('http://localhost:3000');

        // Wait for the application to load
        await page.waitForLoadState('networkidle');

        // Wait for React to render
        await page.waitForSelector('[data-testid="app-root"], .App, #root > div', { timeout: 10000 });
    });

    test('Comprehensive Customer Review Tab Layout Analysis', async ({ page }) => {
        console.log('🚀 Starting Customer Review Tab Layout Analysis...');

        // Take initial screenshot of the homepage
        await page.screenshot({
            path: path.join(screenshotsDir, '01-homepage-initial.png'),
            fullPage: true
        });

        // Navigate to Project Management
        console.log('📂 Navigating to Project Management...');
        await page.click('text=Project Management', { timeout: 5000 });
        await page.waitForTimeout(2000);

        await page.screenshot({
            path: path.join(screenshotsDir, '02-project-management-page.png'),
            fullPage: true
        });

        // Look for Customer Review tab and click it
        console.log('🔍 Looking for Customer Review tab...');

        // Try multiple selectors to find the Customer Review tab
        const customerReviewSelectors = [
            'text=Customer Review',
            '[data-testid="customer-review-tab"]',
            'button:has-text("Customer Review")',
            '.tab:has-text("Customer Review")',
            '[role="tab"]:has-text("Customer Review")'
        ];

        let customerReviewTab = null;
        for (const selector of customerReviewSelectors) {
            try {
                customerReviewTab = await page.locator(selector).first();
                if (await customerReviewTab.isVisible()) {
                    console.log(`✅ Found Customer Review tab with selector: ${selector}`);
                    break;
                }
            } catch (e) {
                console.log(`❌ Selector "${selector}" not found`);
            }
        }

        if (customerReviewTab && await customerReviewTab.isVisible()) {
            await customerReviewTab.click();
            await page.waitForTimeout(2000);

            console.log('🎯 Customer Review tab clicked successfully');

            // Take screenshot of Customer Review tab content
            await page.screenshot({
                path: path.join(screenshotsDir, '03-customer-review-tab-active.png'),
                fullPage: true
            });

            // Analyze layout at different viewport sizes
            const viewports = [
                { width: 1920, height: 1080, name: 'desktop-large' },
                { width: 1366, height: 768, name: 'desktop-standard' },
                { width: 1024, height: 768, name: 'tablet-landscape' },
                { width: 768, height: 1024, name: 'tablet-portrait' },
                { width: 375, height: 667, name: 'mobile' }
            ];

            for (const viewport of viewports) {
                console.log(`📱 Testing viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);

                await page.setViewportSize({ width: viewport.width, height: viewport.height });
                await page.waitForTimeout(1000);

                await page.screenshot({
                    path: path.join(screenshotsDir, `04-customer-review-${viewport.name}.png`),
                    fullPage: true
                });

                // Measure key elements
                const measurements = await page.evaluate(() => {
                    const results = {
                        viewport: {
                            width: window.innerWidth,
                            height: window.innerHeight
                        },
                        elements: {}
                    };

                    // Find main content container
                    const mainContent = document.querySelector('.main-content, [data-testid="main-content"], .tab-content, .customer-review-content');
                    if (mainContent) {
                        const rect = mainContent.getBoundingClientRect();
                        results.elements.mainContent = {
                            width: rect.width,
                            height: rect.height,
                            left: rect.left,
                            right: rect.right,
                            overflowX: rect.right > window.innerWidth,
                            overflowY: rect.bottom > window.innerHeight
                        };
                    }

                    // Find stats grid
                    const statsGrid = document.querySelector('.stats-grid, [data-testid="stats-grid"], .grid');
                    if (statsGrid) {
                        const rect = statsGrid.getBoundingClientRect();
                        results.elements.statsGrid = {
                            width: rect.width,
                            height: rect.height,
                            left: rect.left,
                            right: rect.right,
                            overflowX: rect.right > window.innerWidth,
                            overflowY: rect.bottom > window.innerHeight
                        };
                    }

                    // Find action buttons
                    const actionButtons = document.querySelector('.action-buttons, [data-testid="action-buttons"], .buttons-container');
                    if (actionButtons) {
                        const rect = actionButtons.getBoundingClientRect();
                        results.elements.actionButtons = {
                            width: rect.width,
                            height: rect.height,
                            left: rect.left,
                            right: rect.right,
                            overflowX: rect.right > window.innerWidth,
                            overflowY: rect.bottom > window.innerHeight
                        };
                    }

                    // Check for any elements with overflow
                    const allElements = document.querySelectorAll('*');
                    const overflowingElements = [];
                    allElements.forEach((el, index) => {
                        const rect = el.getBoundingClientRect();
                        if (rect.right > window.innerWidth || rect.bottom > window.innerHeight) {
                            overflowingElements.push({
                                tagName: el.tagName,
                                className: el.className,
                                id: el.id,
                                rect: {
                                    width: rect.width,
                                    height: rect.height,
                                    right: rect.right,
                                    bottom: rect.bottom
                                },
                                overflowX: rect.right > window.innerWidth,
                                overflowY: rect.bottom > window.innerHeight
                            });
                        }
                    });

                    results.overflowingElements = overflowingElements.slice(0, 10); // Limit to first 10

                    return results;
                });

                // Save measurements to file
                const measurementsFile = path.join(screenshotsDir, `measurements-${viewport.name}.json`);
                fs.writeFileSync(measurementsFile, JSON.stringify(measurements, null, 2));

                console.log(`📊 Measurements saved for ${viewport.name}`);
                if (measurements.elements.mainContent?.overflowX) {
                    console.log(`⚠️  Main content overflows horizontally on ${viewport.name}`);
                }
                if (measurements.overflowingElements.length > 0) {
                    console.log(`⚠️  ${measurements.overflowingElements.length} elements overflow on ${viewport.name}`);
                }
            }

            // Test other tabs for comparison
            console.log('🔄 Testing other tabs for comparison...');

            const otherTabs = ['Budget', 'Permits', 'Timeline', 'Documents'];
            for (const tabName of otherTabs) {
                try {
                    const tab = page.locator(`text=${tabName}`).first();
                    if (await tab.isVisible()) {
                        await tab.click();
                        await page.waitForTimeout(1000);

                        await page.screenshot({
                            path: path.join(screenshotsDir, `05-${tabName.toLowerCase()}-tab-comparison.png`),
                            fullPage: true
                        });

                        console.log(`✅ Captured ${tabName} tab for comparison`);
                    }
                } catch (e) {
                    console.log(`❌ Could not capture ${tabName} tab: ${e.message}`);
                }
            }

            // Return to Customer Review tab for final analysis
            await customerReviewTab.click();
            await page.waitForTimeout(1000);

            // Check for specific CSS properties that might cause issues
            const cssAnalysis = await page.evaluate(() => {
                const results = {
                    bodyStyles: {},
                    mainContentStyles: {},
                    issuesFound: []
                };

                // Check body styles
                const body = document.body;
                const bodyStyles = window.getComputedStyle(body);
                results.bodyStyles = {
                    overflow: bodyStyles.overflow,
                    overflowX: bodyStyles.overflowX,
                    overflowY: bodyStyles.overflowY,
                    width: bodyStyles.width,
                    minWidth: bodyStyles.minWidth,
                    maxWidth: bodyStyles.maxWidth
                };

                // Check main content area
                const mainContent = document.querySelector('.main-content, [data-testid="main-content"], .tab-content, .customer-review-content');
                if (mainContent) {
                    const mainStyles = window.getComputedStyle(mainContent);
                    results.mainContentStyles = {
                        display: mainStyles.display,
                        flexDirection: mainStyles.flexDirection,
                        flexWrap: mainStyles.flexWrap,
                        overflow: mainStyles.overflow,
                        overflowX: mainStyles.overflowX,
                        overflowY: mainStyles.overflowY,
                        width: mainStyles.width,
                        minWidth: mainStyles.minWidth,
                        maxWidth: mainStyles.maxWidth,
                        padding: mainStyles.padding,
                        margin: mainStyles.margin,
                        boxSizing: mainStyles.boxSizing
                    };

                    // Check for common CSS issues
                    if (mainStyles.overflowX === 'visible') {
                        results.issuesFound.push('Main content has overflow-x: visible which may cause horizontal scroll');
                    }
                    if (mainStyles.width === 'auto' && !mainStyles.maxWidth) {
                        results.issuesFound.push('Main content has no max-width constraint');
                    }
                    if (mainStyles.boxSizing !== 'border-box') {
                        results.issuesFound.push('Main content not using border-box sizing');
                    }
                }

                return results;
            });

            // Save CSS analysis
            const cssAnalysisFile = path.join(screenshotsDir, 'css-analysis.json');
            fs.writeFileSync(cssAnalysisFile, JSON.stringify(cssAnalysis, null, 2));

            console.log('🎨 CSS analysis completed');
            console.log(`📁 All screenshots and analysis saved to: ${screenshotsDir}`);

        } else {
            console.log('❌ Customer Review tab not found. Taking screenshot of current state...');
            await page.screenshot({
                path: path.join(screenshotsDir, '03-customer-review-tab-not-found.png'),
                fullPage: true
            });

            // Log all visible text elements to help debug
            const visibleText = await page.evaluate(() => {
                const elements = document.querySelectorAll('*');
                const textElements = [];
                elements.forEach(el => {
                    if (el.textContent && el.textContent.trim() && window.getComputedStyle(el).display !== 'none') {
                        textElements.push({
                            tagName: el.tagName,
                            text: el.textContent.trim().substring(0, 50),
                            className: el.className
                        });
                    }
                });
                return textElements.slice(0, 20); // First 20 elements
            });

            console.log('🔍 Visible text elements on page:', JSON.stringify(visibleText, null, 2));
        }
    });
});