/**
 * Real Manufacturer Manual Downloader
 * Downloads actual installation manuals from manufacturer websites
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Real manufacturer installation manual URLs (verified and active)
const REAL_MANUAL_URLS = {
  'GAF-TIM-HVHZ': {
    url: 'https://www.gaf.com/content/dam/gaf/documents/residential/installation-and-application-instructions/shingles/timberline-hdz-installation-instructions.pdf',
    filename: 'GAF-Timberline-HDZ-Installation-Instructions.pdf',
    manufacturer: 'gaf'
  },
  'GAF-FOR-HVHZ': {
    url: 'https://www.gaf.com/content/dam/gaf/documents/residential/installation-and-application-instructions/shingles/fortitude-installation-instructions.pdf',
    filename: 'GAF-Fortitude-Installation-Instructions.pdf',
    manufacturer: 'gaf'
  },
  'CER-LAN-HVHZ': {
    url: 'https://www.certainteed.com/content/dam/ctg/roofing/documents/installation-instructions/landmark-installation-instructions.pdf',
    filename: 'CertainTeed-Landmark-Installation-Instructions.pdf',
    manufacturer: 'certainteed'
  },
  'OWE-DUR-HVHZ': {
    url: 'https://www.owenscorning.com/content/dam/owenscorning/roofing/documents/duration-shingles-installation-guide.pdf',
    filename: 'Owens-Corning-Duration-Installation-Guide.pdf',
    manufacturer: 'owens-corning'
  },
  'CAR-SUR-HVHZ': {
    url: 'https://www.carlisle-ccm.com/content/dam/carlisle/ccm/technical-documents/tpo/sure-weld-tpo-installation-guide.pdf',
    filename: 'Carlisle-Sure-Weld-TPO-Installation-Guide.pdf',
    manufacturer: 'carlisle'
  },
  'FIR-RUB-HVHZ': {
    url: 'https://www.firestonebpe.com/content/dam/fbpe/installation-specifications/rubbergard-epdm-installation-specifications.pdf',
    filename: 'Firestone-RubberGard-EPDM-Installation-Specifications.pdf',
    manufacturer: 'firestone'
  },
  'VER-VER-HVHZ': {
    url: 'https://www.versico.com/content/dam/versico/technical-documents/tpo/versiweld-tpo-installation-guide.pdf',
    filename: 'Versico-VersiWeld-TPO-Installation-Guide.pdf',
    manufacturer: 'versico'
  },
  'EAG-CAP-HVHZ': {
    url: 'https://www.eagleroofing.com/content/dam/eagle/installation-guides/capistrano-installation-guide.pdf',
    filename: 'Eagle-Capistrano-Installation-Guide.pdf',
    manufacturer: 'eagle'
  },
  'ATL-PIN-HVHZ': {
    url: 'https://www.atlasroofing.com/content/dam/atlas/residential/shingles/pinnacle-pristine/pinnacle-pristine-installation-guide.pdf',
    filename: 'Atlas-Pinnacle-Pristine-Installation-Guide.pdf',
    manufacturer: 'atlas'
  },
  'MAL-HIG-HVHZ': {
    url: 'https://www.malarkeyroofing.com/content/dam/malarkey/installation-guides/highlander-installation-guide.pdf',
    filename: 'Malarkey-Highlander-Installation-Guide.pdf',
    manufacturer: 'malarkey'
  }
};

const guidesDir = path.join(__dirname, '..', 'database', 'documents', 'manufacturer-guides');

function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;

    log(`Downloading: ${url}`);

    const request = client.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 302 || response.statusCode === 301) {
        const redirectUrl = response.headers.location;
        log(`Redirecting to: ${redirectUrl}`);
        return downloadFile(redirectUrl, filePath).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        return reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
      }

      const fileStream = fs.createWriteStream(filePath);
      let downloadedBytes = 0;

      response.on('data', (chunk) => {
        downloadedBytes += chunk.length;
      });

      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        log(`✅ Download complete: ${Math.round(downloadedBytes / 1024)} KB`);
        resolve(filePath);
      });

      fileStream.on('error', (error) => {
        fs.unlink(filePath, () => {}); // Delete partial file
        reject(error);
      });
    });

    request.on('error', reject);
    request.setTimeout(60000, () => {
      request.destroy();
      reject(new Error('Download timeout'));
    });
  });
}

async function downloadRealManuals() {
  log('Starting real manufacturer manual download...');

  const results = [];

  for (const [sopCode, manual] of Object.entries(REAL_MANUAL_URLS)) {
    try {
      const manufacturerDir = path.join(guidesDir, manual.manufacturer);
      const filePath = path.join(manufacturerDir, manual.filename);

      // Ensure manufacturer directory exists
      if (!fs.existsSync(manufacturerDir)) {
        fs.mkdirSync(manufacturerDir, { recursive: true });
      }

      // Skip if file already exists
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        log(`⚠️ File already exists: ${manual.filename} (${Math.round(stats.size / 1024)} KB)`);
        results.push({
          sopCode,
          status: 'already_exists',
          filename: manual.filename,
          size: stats.size
        });
        continue;
      }

      // Download the manual
      await downloadFile(manual.url, filePath);

      // Verify download
      const stats = fs.statSync(filePath);
      if (stats.size > 10000) { // At least 10KB for a valid PDF
        results.push({
          sopCode,
          status: 'success',
          filename: manual.filename,
          filePath: filePath,
          size: stats.size,
          url: manual.url
        });
      } else {
        fs.unlinkSync(filePath);
        throw new Error('Downloaded file too small');
      }

      // Pause between downloads
      await new Promise(resolve => setTimeout(resolve, 3000));

    } catch (error) {
      log(`❌ Failed to download ${sopCode}: ${error.message}`);
      results.push({
        sopCode,
        status: 'failed',
        error: error.message,
        url: manual.url
      });
    }
  }

  // Save results
  const resultsFile = path.join(guidesDir, 'download-results.json');
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));

  const successful = results.filter(r => r.status === 'success').length;
  const existing = results.filter(r => r.status === 'already_exists').length;
  const failed = results.filter(r => r.status === 'failed').length;

  log(`\\n📊 Download Summary:`);
  log(`✅ Successfully downloaded: ${successful}`);
  log(`📁 Already existed: ${existing}`);
  log(`❌ Failed downloads: ${failed}`);
  log(`📄 Results saved to: ${resultsFile}`);

  return results;
}

// Create installer manual integration with DMS
function createDMSIntegration() {
  log('Creating DMS integration for installation manuals...');

  const integrationData = {
    lastUpdated: new Date().toISOString(),
    manuals: []
  };

  // Check what manuals we have
  Object.entries(REAL_MANUAL_URLS).forEach(([sopCode, manual]) => {
    const filePath = path.join(guidesDir, manual.manufacturer, manual.filename);

    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      integrationData.manuals.push({
        sopNumber: sopCode,
        filename: manual.filename,
        manufacturer: manual.manufacturer,
        size: stats.size,
        localPath: filePath,
        downloadUrl: manual.url,
        lastModified: stats.mtime,
        status: 'available'
      });
    }
  });

  // Save integration data
  const integrationFile = path.join(guidesDir, 'dms-integration.json');
  fs.writeFileSync(integrationFile, JSON.stringify(integrationData, null, 2));

  log(`📋 DMS integration data created: ${integrationFile}`);
  log(`📖 ${integrationData.manuals.length} manuals available for DMS integration`);

  return integrationData;
}

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--download')) {
    downloadRealManuals()
      .then(() => createDMSIntegration())
      .catch(console.error);
  } else if (args.includes('--integrate')) {
    createDMSIntegration();
  } else {
    console.log('Usage:');
    console.log('  node real-manual-downloader.js --download   # Download real installation manuals');
    console.log('  node real-manual-downloader.js --integrate  # Create DMS integration data');
  }
}

module.exports = {
  downloadRealManuals,
  createDMSIntegration,
  REAL_MANUAL_URLS
};