/**
 * Manufacturer Installation Guide Downloader
 * Downloads actual manufacturer installation manuals for 1500 series SOPs
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Load manufacturer guide configuration
const guidesConfig = JSON.parse(fs.readFileSync('./manufacturer-guide-urls.json', 'utf8'));

// Create directories for storing guides
const guidesDir = path.join(__dirname, '..', 'database', 'documents', 'manufacturer-guides');
const logFile = path.join(guidesDir, 'download-log.txt');

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(guidesDir)) {
    fs.mkdirSync(guidesDir, { recursive: true });
  }

  // Create manufacturer-specific subdirectories
  const manufacturers = [
    'atlas', 'bermuda', 'carlisle', 'certainteed', 'eagle',
    'firestone', 'gaf', 'gulf-coast', 'malarkey', 'owens-corning',
    'soprema', 'tri-county-metals', 'versico'
  ];

  manufacturers.forEach(mfg => {
    const mfgDir = path.join(guidesDir, mfg);
    if (!fs.existsSync(mfgDir)) {
      fs.mkdirSync(mfgDir, { recursive: true });
    }
  });
}

// Log function
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage.trim());
  fs.appendFileSync(logFile, logMessage);
}

// Download function with retry logic
async function downloadFile(url, filePath, retries = 3) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;

    const request = client.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirects
        const redirectUrl = response.headers.location;
        log(`Redirecting to: ${redirectUrl}`);
        return downloadFile(redirectUrl, filePath, retries - 1).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        return reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
      }

      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve(filePath);
      });

      fileStream.on('error', reject);
    });

    request.on('error', (error) => {
      if (retries > 0) {
        log(`Retrying download (${retries} attempts left): ${url}`);
        setTimeout(() => {
          downloadFile(url, filePath, retries - 1).then(resolve).catch(reject);
        }, 2000);
      } else {
        reject(error);
      }
    });

    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Download timeout'));
    });
  });
}

// Search for actual PDF URLs on manufacturer websites
async function findInstallationManualUrl(guide) {
  log(`Searching for installation manual: ${guide.manualTitle}`);

  // For demonstration, we'll use common patterns for manufacturer installation guides
  // In production, this would involve web scraping or API calls to manufacturer sites

  const urlPatterns = {
    'gaf.com': [
      'https://www.gaf.com/document-library/documents/residential-roofing/',
      'https://www.gaf.com/content/dam/gaf/documents/residential/'
    ],
    'carlisle-ccm.com': [
      'https://www.carlisle-ccm.com/content/dam/carlisle/ccm/technical-documents/'
    ],
    'owenscorning.com': [
      'https://www.owenscorning.com/content/dam/owenscorning/roofing/documents/'
    ],
    'certainteed.com': [
      'https://www.certainteed.com/content/dam/ctg/roofing/documents/'
    ]
  };

  // Extract domain from search URL
  const domain = new URL(guide.searchUrl).hostname;

  // Return most likely URL pattern for this manufacturer
  if (domain.includes('gaf.com')) {
    return `https://www.gaf.com/content/dam/gaf/documents/residential/timberline-hdz-installation-instructions.pdf`;
  } else if (domain.includes('carlisle-ccm.com')) {
    return `https://www.carlisle-ccm.com/content/dam/carlisle/ccm/technical-documents/sure-weld-tpo-installation-manual.pdf`;
  } else if (domain.includes('owenscorning.com')) {
    return `https://www.owenscorning.com/content/dam/owenscorning/roofing/documents/trudefinition-duration-installation-guide.pdf`;
  } else if (domain.includes('certainteed.com')) {
    return `https://www.certainteed.com/content/dam/ctg/roofing/documents/landmark-installation-instructions.pdf`;
  } else {
    // For other manufacturers, construct a likely URL
    const filename = guide.manualTitle.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '') + '.pdf';
    return `${guide.resourcesUrl}${filename}`;
  }
}

// Main download function
async function downloadManufacturerGuides() {
  log('Starting manufacturer installation guide download process...');
  ensureDirectories();

  const downloadResults = [];

  for (const guide of guidesConfig.manufacturerGuides) {
    try {
      log(`Processing: ${guide.product} (${guide.sopNumber})`);

      // Find the actual PDF URL
      const pdfUrl = await findInstallationManualUrl(guide);

      // Create filename
      const manufacturerFolder = guide.manufacturer.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace('corporation', '')
        .replace('materials', '')
        .replace('inc', '')
        .replace('products', '')
        .replace('roofing', '')
        .replace('tile', '')
        .replace('building', '')
        .replace('systems', '')
        .trim();

      const filename = `${guide.sopNumber}-${guide.manualTitle.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}.pdf`;
      const filePath = path.join(guidesDir, manufacturerFolder, filename);

      // Download the file
      log(`Downloading: ${pdfUrl}`);
      await downloadFile(pdfUrl, filePath);

      // Verify file was downloaded and has content
      const stats = fs.statSync(filePath);
      if (stats.size > 1000) { // At least 1KB
        log(`✅ Successfully downloaded: ${filename} (${Math.round(stats.size / 1024)} KB)`);
        downloadResults.push({
          sopNumber: guide.sopNumber,
          product: guide.product,
          manufacturer: guide.manufacturer,
          filename: filename,
          filePath: filePath,
          size: stats.size,
          downloadUrl: pdfUrl,
          status: 'success'
        });
      } else {
        log(`❌ Download failed or file too small: ${filename}`);
        fs.unlinkSync(filePath); // Remove empty/invalid file
        downloadResults.push({
          sopNumber: guide.sopNumber,
          product: guide.product,
          status: 'failed',
          error: 'File too small or invalid'
        });
      }

    } catch (error) {
      log(`❌ Error downloading ${guide.product}: ${error.message}`);
      downloadResults.push({
        sopNumber: guide.sopNumber,
        product: guide.product,
        status: 'failed',
        error: error.message
      });
    }

    // Add delay between downloads to be respectful to servers
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Save download results
  const resultsFile = path.join(guidesDir, 'download-results.json');
  fs.writeFileSync(resultsFile, JSON.stringify(downloadResults, null, 2));

  log(`Download process completed. Results saved to: ${resultsFile}`);

  const successful = downloadResults.filter(r => r.status === 'success').length;
  const failed = downloadResults.filter(r => r.status === 'failed').length;

  log(`Summary: ${successful} successful downloads, ${failed} failed downloads`);

  return downloadResults;
}

// Alternative: Create demo installation guides for testing
function createDemoInstallationGuides() {
  log('Creating demo installation guides for testing...');
  ensureDirectories();

  const demoResults = [];

  guidesConfig.manufacturerGuides.forEach(guide => {
    try {
      const manufacturerFolder = guide.manufacturer.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace('corporation', '')
        .replace('materials', '')
        .replace('inc', '')
        .replace('products', '')
        .replace('roofing', '')
        .replace('tile', '')
        .replace('building', '')
        .replace('systems', '')
        .trim();

      const filename = `${guide.sopNumber}-${guide.manualTitle.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}.pdf`;
      const filePath = path.join(guidesDir, manufacturerFolder, filename);

      // Create demo PDF content placeholder
      const demoContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
(${guide.manualTitle}) Tj
0 -20 Td
(${guide.manufacturer}) Tj
0 -20 Td
(SOP Number: ${guide.sopNumber}) Tj
0 -20 Td
(Category: ${guide.category}) Tj
0 -20 Td
(HVHZ Approved: ${guide.hvhzApproved ? 'Yes' : 'No'}) Tj
0 -40 Td
(This is a demo installation guide.) Tj
0 -20 Td
(Actual manufacturer PDF would be downloaded from:) Tj
0 -20 Td
(${guide.searchUrl}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000215 00000 n
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
465
%%EOF`;

      fs.writeFileSync(filePath, demoContent);

      const stats = fs.statSync(filePath);
      log(`✅ Created demo guide: ${filename} (${Math.round(stats.size / 1024)} KB)`);

      demoResults.push({
        sopNumber: guide.sopNumber,
        product: guide.product,
        manufacturer: guide.manufacturer,
        filename: filename,
        filePath: filePath,
        size: stats.size,
        status: 'demo_created',
        actualUrl: guide.searchUrl
      });

    } catch (error) {
      log(`❌ Error creating demo guide for ${guide.product}: ${error.message}`);
    }
  });

  // Save demo results
  const resultsFile = path.join(guidesDir, 'demo-guides-created.json');
  fs.writeFileSync(resultsFile, JSON.stringify(demoResults, null, 2));

  log(`Demo guides created. Results saved to: ${resultsFile}`);
  log(`Created ${demoResults.length} demo installation guides`);

  return demoResults;
}

// Export functions
module.exports = {
  downloadManufacturerGuides,
  createDemoInstallationGuides,
  ensureDirectories,
  log
};

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--demo')) {
    createDemoInstallationGuides();
  } else if (args.includes('--download')) {
    downloadManufacturerGuides().catch(console.error);
  } else {
    console.log('Usage:');
    console.log('  node download-manufacturer-guides.js --demo     # Create demo guides');
    console.log('  node download-manufacturer-guides.js --download # Download actual guides');
  }
}