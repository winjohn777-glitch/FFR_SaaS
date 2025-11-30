/**
 * Comprehensive Test Orchestrator
 * Florida First Roofing Accounting System
 *
 * Orchestrates complete application testing including:
 * - All modules and pages
 * - All tabs and actions
 * - Cross-module integration
 * - Performance validation
 * - Data consistency verification
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Comprehensive Application Verification');
console.log('=' .repeat(60));

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:5000',
  timeout: 300000, // 5 minutes total timeout
  headless: false, // Show browser for verification
  browsers: ['chromium'], // Can add 'firefox', 'webkit'
  retries: 1
};

// Application modules to verify
const MODULES_TO_TEST = [
  { name: 'Dashboard', url: '/dashboard', critical: true },
  { name: 'Customer Management (CRM)', url: '/customers', critical: true },
  { name: 'Project Management', url: '/jobs', critical: true },
  { name: 'Invoicing & Billing', url: '/invoicing', critical: true },
  { name: 'Human Resources', url: '/hr', critical: false },
  { name: 'Accounting & Finance', url: '/accounting', critical: false },
  { name: 'Standard Operating Procedures', url: '/sops', critical: true },
  { name: 'Document Management System', url: '/documents', critical: true }
];

// Test results tracking
let testResults = {
  timestamp: new Date().toISOString(),
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  skippedTests: 0,
  performanceIssues: [],
  functionalIssues: [],
  integrationIssues: [],
  modules: {},
  summary: ''
};

class TestOrchestrator {
  constructor() {
    this.startTime = Date.now();
    this.logFile = path.join(__dirname, 'test-results', `comprehensive-test-${Date.now()}.log`);
    this.ensureDirectories();
  }

  ensureDirectories() {
    const dirs = ['test-results', 'screenshots'];
    dirs.forEach(dir => {
      const dirPath = path.join(__dirname, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;
    console.log(logMessage);

    // Append to log file
    fs.appendFileSync(this.logFile, logMessage + '\\n');
  }

  async checkPrerequisites() {
    this.log('Checking test prerequisites...');

    try {
      // Check if application is running
      const response = await fetch(TEST_CONFIG.baseUrl);
      if (!response.ok) {
        throw new Error(`Application not responding at ${TEST_CONFIG.baseUrl}`);
      }
      this.log('✅ Application is running and accessible');

      // Check if Playwright is available
      try {
        execSync('npx playwright --version', { stdio: 'pipe' });
        this.log('✅ Playwright is available');
      } catch (e) {
        this.log('Installing Playwright...', 'WARN');
        execSync('npx playwright install', { stdio: 'inherit' });
      }

      return true;
    } catch (error) {
      this.log(`❌ Prerequisites check failed: ${error.message}`, 'ERROR');
      return false;
    }
  }

  async runComprehensiveTests() {
    this.log('Starting comprehensive test suite...');

    try {
      // Run Playwright tests
      const testCommand = [
        'npx',
        'playwright',
        'test',
        'test-comprehensive-application-verification.spec.ts',
        '--reporter=html,line',
        `--timeout=${TEST_CONFIG.timeout}`,
        '--headed', // Show browser
        '--project=chromium'
      ];

      this.log(`Executing: ${testCommand.join(' ')}`);

      const testProcess = spawn(testCommand[0], testCommand.slice(1), {
        stdio: 'pipe',
        cwd: __dirname
      });

      let testOutput = '';
      let testErrors = '';

      testProcess.stdout.on('data', (data) => {
        const output = data.toString();
        testOutput += output;
        console.log(output);
      });

      testProcess.stderr.on('data', (data) => {
        const error = data.toString();
        testErrors += error;
        console.error(error);
      });

      return new Promise((resolve, reject) => {
        testProcess.on('close', (code) => {
          if (code === 0) {
            this.log('✅ All tests completed successfully');
            this.parseTestResults(testOutput);
            resolve({ success: true, output: testOutput });
          } else {
            this.log(`❌ Tests completed with exit code: ${code}`, 'ERROR');
            this.parseTestResults(testOutput, testErrors);
            resolve({ success: false, output: testOutput, errors: testErrors });
          }
        });

        testProcess.on('error', (error) => {
          this.log(`❌ Test execution error: ${error.message}`, 'ERROR');
          reject(error);
        });
      });

    } catch (error) {
      this.log(`❌ Failed to run tests: ${error.message}`, 'ERROR');
      throw error;
    }
  }

  parseTestResults(output, errors = '') {
    this.log('Parsing test results...');

    // Extract test statistics from Playwright output
    const patterns = {
      passed: /(\d+) passed/g,
      failed: /(\d+) failed/g,
      skipped: /(\d+) skipped/g,
      total: /(\d+) tests? ran/g
    };

    Object.entries(patterns).forEach(([key, pattern]) => {
      const match = output.match(pattern);
      if (match) {
        const value = parseInt(match[0].match(/\d+/)[0]);
        testResults[`${key}Tests`] = value;
      }
    });

    testResults.totalTests = testResults.passedTests + testResults.failedTests + testResults.skippedTests;

    // Look for specific issues
    if (output.includes('Performance') || output.includes('slow')) {
      testResults.performanceIssues.push('Performance warnings detected in test output');
    }

    if (errors) {
      testResults.functionalIssues.push(`Test errors: ${errors.substring(0, 200)}...`);
    }

    this.log(`Test Results: ${testResults.passedTests} passed, ${testResults.failedTests} failed, ${testResults.skippedTests} skipped`);
  }

  async verifyModuleAccessibility() {
    this.log('Verifying module accessibility...');

    for (const module of MODULES_TO_TEST) {
      try {
        const startTime = Date.now();
        const response = await fetch(`${TEST_CONFIG.baseUrl}${module.url}`);
        const loadTime = Date.now() - startTime;

        testResults.modules[module.name] = {
          accessible: response.ok,
          loadTime: loadTime,
          critical: module.critical,
          status: response.status
        };

        if (response.ok) {
          this.log(`✅ ${module.name} accessible (${loadTime}ms)`);
        } else {
          this.log(`❌ ${module.name} not accessible (${response.status})`, 'ERROR');
        }

      } catch (error) {
        this.log(`❌ ${module.name} error: ${error.message}`, 'ERROR');
        testResults.modules[module.name] = {
          accessible: false,
          error: error.message,
          critical: module.critical
        };
      }
    }
  }

  async checkCodeQuality() {
    this.log('Checking code quality and warnings...');

    try {
      // Check for TypeScript errors
      const tsResult = execSync('npx tsc --noEmit --skipLibCheck', {
        stdio: 'pipe',
        encoding: 'utf8',
        cwd: __dirname
      });

      this.log('✅ No TypeScript errors found');
    } catch (error) {
      this.log(`⚠️ TypeScript warnings/errors found: ${error.stdout}`, 'WARN');
      testResults.functionalIssues.push(`TypeScript issues: ${error.stdout.substring(0, 200)}...`);
    }

    try {
      // Check for ESLint warnings
      const lintResult = execSync('npx eslint src/ --format compact', {
        stdio: 'pipe',
        encoding: 'utf8',
        cwd: __dirname
      });

      this.log('✅ No ESLint warnings found');
    } catch (error) {
      if (error.stdout) {
        this.log(`⚠️ ESLint warnings found: ${error.stdout}`, 'WARN');
        testResults.functionalIssues.push(`ESLint warnings: ${error.stdout.substring(0, 200)}...`);
      }
    }
  }

  generateSummaryReport() {
    const duration = Date.now() - this.startTime;
    const durationMin = Math.round(duration / 1000 / 60 * 100) / 100;

    testResults.summary = `
🎯 COMPREHENSIVE APPLICATION TEST SUMMARY
=============================================

Duration: ${durationMin} minutes
Timestamp: ${testResults.timestamp}

📊 TEST STATISTICS:
- Total Tests: ${testResults.totalTests}
- Passed: ${testResults.passedTests} ✅
- Failed: ${testResults.failedTests} ${testResults.failedTests > 0 ? '❌' : '✅'}
- Skipped: ${testResults.skippedTests}

🏗️ MODULE ACCESSIBILITY:
${Object.entries(testResults.modules).map(([name, data]) =>
  `- ${name}: ${data.accessible ? '✅' : '❌'} ${data.loadTime ? `(${data.loadTime}ms)` : ''}`
).join('\\n')}

⚡ PERFORMANCE ISSUES: ${testResults.performanceIssues.length}
${testResults.performanceIssues.map(issue => `- ${issue}`).join('\\n')}

🔧 FUNCTIONAL ISSUES: ${testResults.functionalIssues.length}
${testResults.functionalIssues.map(issue => `- ${issue}`).join('\\n')}

🔗 INTEGRATION ISSUES: ${testResults.integrationIssues.length}
${testResults.integrationIssues.map(issue => `- ${issue}`).join('\\n')}

${testResults.failedTests === 0 && testResults.functionalIssues.length === 0 ?
  '🎉 ALL SYSTEMS OPERATIONAL - APPLICATION FULLY VERIFIED!' :
  '⚠️ ISSUES DETECTED - REVIEW REQUIRED'}
`;

    // Save full report
    const reportPath = path.join(__dirname, 'test-results', `comprehensive-report-${Date.now()}.txt`);
    fs.writeFileSync(reportPath, testResults.summary);

    this.log('\\n' + testResults.summary);
    this.log(`Full report saved to: ${reportPath}`);

    return testResults;
  }

  async run() {
    try {
      this.log('🎬 Starting Comprehensive Application Verification');

      // Step 1: Check prerequisites
      const prerequisitesOk = await this.checkPrerequisites();
      if (!prerequisitesOk) {
        throw new Error('Prerequisites check failed');
      }

      // Step 2: Verify module accessibility
      await this.verifyModuleAccessibility();

      // Step 3: Check code quality
      await this.checkCodeQuality();

      // Step 4: Run comprehensive tests
      const testResult = await this.runComprehensiveTests();

      // Step 5: Generate summary report
      const finalResults = this.generateSummaryReport();

      return {
        success: testResult.success && testResults.failedTests === 0,
        results: finalResults,
        duration: Date.now() - this.startTime
      };

    } catch (error) {
      this.log(`❌ Orchestrator failed: ${error.message}`, 'ERROR');
      testResults.functionalIssues.push(`Orchestrator error: ${error.message}`);
      return {
        success: false,
        error: error.message,
        results: this.generateSummaryReport()
      };
    }
  }
}

// Self-executing orchestrator
if (require.main === module) {
  const orchestrator = new TestOrchestrator();

  orchestrator.run()
    .then(result => {
      console.log('\\n' + '='.repeat(60));
      console.log(result.success ?
        '🎉 COMPREHENSIVE VERIFICATION COMPLETED SUCCESSFULLY!' :
        '⚠️ VERIFICATION COMPLETED WITH ISSUES'
      );
      console.log('='.repeat(60));

      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ CRITICAL ERROR:', error.message);
      process.exit(1);
    });
}

module.exports = TestOrchestrator;