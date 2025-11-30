#!/usr/bin/env node
/**
 * Florida First Roofing - SOP Library Import Script
 * Imports the organized SOP content structure into the database
 * Respects directory organization and numbering system (0000-9000)
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

class FFRSOPImporter {
  constructor() {
    this.dbPath = path.join(__dirname, '../database/accounting.db');
    this.sopContentPath = path.join(__dirname, '../database/sop-content');
    this.db = new sqlite3.Database(this.dbPath);

    // Map directory structure to database categories
    this.categoryMapping = {
      '0000-System-Management': {
        code: '0000',
        name: 'System Management',
        description: 'Framework, templates, and system administration procedures',
        color: '#6B73FF',
        icon: 'settings'
      },
      '1000-Safety-OSHA': {
        code: '1000',
        name: 'Safety & OSHA',
        description: 'Safety protocols, OSHA compliance, and protective procedures',
        color: '#DC2626',
        icon: 'shield'
      },
      '2000-Field-Operations': {
        code: '2000',
        name: 'Field Operations',
        description: 'Installation, construction, and field execution procedures',
        color: '#059669',
        icon: 'hard-hat'
      },
      '3000-Quality-Control': {
        code: '3000',
        name: 'Quality Control',
        description: 'Inspection, verification, and quality assurance procedures',
        color: '#7C3AED',
        icon: 'check-circle'
      },
      '4000-Customer-Service': {
        code: '4000',
        name: 'Customer Service',
        description: 'CRM, communication, and customer relationship procedures',
        color: '#0891B2',
        icon: 'users'
      },
      '5000-Administrative': {
        code: '5000',
        name: 'Administrative',
        description: 'HR, business operations, and administrative procedures',
        color: '#EA580C',
        icon: 'file-text'
      },
      '6000-Emergency-Response': {
        code: '6000',
        name: 'Emergency Response',
        description: 'Crisis management and emergency response procedures',
        color: '#EF4444',
        icon: 'alert-triangle'
      },
      '7000-Training': {
        code: '7000',
        name: 'Training',
        description: 'Competency development and training procedures',
        color: '#8B5CF6',
        icon: 'book-open'
      },
      '8000-Regulatory-Compliance': {
        code: '8000',
        name: 'Regulatory Compliance',
        description: 'Legal requirements and regulatory compliance procedures',
        color: '#65A30D',
        icon: 'clipboard-check'
      },
      '9000-Innovation': {
        code: '9000',
        name: 'Innovation',
        description: 'Technology adoption and innovation procedures',
        color: '#0EA5E9',
        icon: 'lightbulb'
      }
    };

    this.stats = {
      categories: 0,
      procedures: 0,
      forms: 0,
      floridaSpecific: 0,
      hurricaneRelated: 0,
      oshaRelated: 0,
      errors: []
    };
  }

  async initialize() {
    console.log('🚀 Florida First Roofing - SOP Library Import');
    console.log('📁 Source:', this.sopContentPath);
    console.log('💾 Database:', this.dbPath);
    console.log('─'.repeat(60));

    // Clear existing SOP data
    await this.clearExistingData();
  }

  async clearExistingData() {
    console.log('🧹 Clearing existing SOP data...');

    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run('DELETE FROM sop_procedures');
        this.db.run('DELETE FROM sop_categories', (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });
  }

  async importCategories() {
    console.log('📂 Importing SOP categories...');

    const sopDirs = fs.readdirSync(path.join(this.sopContentPath, 'SOPs'))
      .filter(dir => fs.statSync(path.join(this.sopContentPath, 'SOPs', dir)).isDirectory());

    for (const dirName of sopDirs) {
      const categoryInfo = this.categoryMapping[dirName];
      if (categoryInfo) {
        await this.insertCategory(categoryInfo);
        this.stats.categories++;
      }
    }

    console.log(`✅ Imported ${this.stats.categories} categories`);
  }

  async insertCategory(categoryInfo) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO sop_categories (
          category_code, category_name, description, color_code,
          icon_name, sort_order, is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `);

      const sortOrder = parseInt(categoryInfo.code.substring(0, 1));

      stmt.run(
        categoryInfo.code,
        categoryInfo.name,
        categoryInfo.description,
        categoryInfo.color,
        categoryInfo.icon,
        sortOrder,
        1,
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );

      stmt.finalize();
    });
  }

  async importSOPs() {
    console.log('📋 Importing all SOP content...');

    // Import from SOPs directory
    await this.importFromDirectory('SOPs');

    // Import from Forms directory
    await this.importFromDirectory('Forms');

    // Import from procedures directory
    await this.importFromDirectory('procedures');

    // Import from Manuals directory
    await this.importFromDirectory('Manuals');

    // Import from compliance directory
    await this.importFromDirectory('compliance');

    // Import from county-variations directory
    await this.importFromDirectory('county-variations');

    console.log(`✅ Imported ${this.stats.procedures} total procedures`);
  }

  async importFromDirectory(baseDir) {
    const basePath = path.join(this.sopContentPath, baseDir);
    if (!fs.existsSync(basePath)) {
      console.log(`⚠️  Directory ${baseDir} not found, skipping...`);
      return;
    }

    console.log(`📁 Processing ${baseDir} directory...`);

    // Handle both categorized and direct content
    const items = fs.readdirSync(basePath);

    for (const item of items) {
      const itemPath = path.join(basePath, item);
      const itemStats = fs.statSync(itemPath);

      if (itemStats.isDirectory()) {
        // Check if it's a category directory
        const categoryInfo = this.categoryMapping[item];
        if (categoryInfo) {
          await this.importCategorySOPs(item, categoryInfo.code, baseDir);
        } else {
          // Try to map to closest category or use default
          const categoryCode = this.inferCategoryFromPath(item, baseDir);
          await this.importCategorySOPs(item, categoryCode, baseDir);
        }
      } else if (item.endsWith('.md')) {
        // Handle direct files in base directory
        const categoryCode = this.inferCategoryFromPath(baseDir, '');
        await this.processSingleFile(itemPath, categoryCode);
      }
    }
  }

  inferCategoryFromPath(dirName, baseDir) {
    // Map directory names to category codes
    const mappings = {
      'Forms': '5000',
      'procedures': '2000',
      'Manuals': '0000',
      'compliance': '8000',
      'county-variations': '2000',
      'system-management': '0000',
      'quick-reference': '0000'
    };

    // Check base directory first
    if (mappings[baseDir]) {
      return mappings[baseDir];
    }

    // Check for numeric prefixes
    const numericMatch = dirName.match(/^(\d{4})/);
    if (numericMatch) {
      return numericMatch[1];
    }

    // Check for keyword matches
    const lowerDir = dirName.toLowerCase();
    if (lowerDir.includes('safety') || lowerDir.includes('osha')) return '1000';
    if (lowerDir.includes('field') || lowerDir.includes('operation')) return '2000';
    if (lowerDir.includes('quality') || lowerDir.includes('control')) return '3000';
    if (lowerDir.includes('customer') || lowerDir.includes('service')) return '4000';
    if (lowerDir.includes('admin') || lowerDir.includes('forms')) return '5000';
    if (lowerDir.includes('emergency') || lowerDir.includes('response')) return '6000';
    if (lowerDir.includes('training')) return '7000';
    if (lowerDir.includes('compliance') || lowerDir.includes('regulatory')) return '8000';
    if (lowerDir.includes('innovation')) return '9000';

    // Default to System Management
    return '0000';
  }

  async importCategorySOPs(dirName, categoryCode, baseDir = 'SOPs') {
    const categoryPath = path.join(this.sopContentPath, baseDir, dirName);

    if (!fs.existsSync(categoryPath)) {
      console.log(`⚠️  Category path ${categoryPath} not found, skipping...`);
      return;
    }

    // Walk through all subdirectories and files
    await this.walkDirectory(categoryPath, categoryCode);
  }

  async processSingleFile(filePath, categoryCode) {
    try {
      console.log(`📄 Processing single file: ${path.basename(filePath)}`);

      const sopData = await this.parseSOPFile(filePath, categoryCode);
      await this.insertSOP(sopData);
      this.stats.procedures++;

      // Update statistics
      if (sopData.florida_specific) this.stats.floridaSpecific++;
      if (sopData.hurricane_related) this.stats.hurricaneRelated++;
      if (sopData.osha_related) this.stats.oshaRelated++;

      if (this.stats.procedures % 10 === 0) {
        console.log(`📈 Progress: ${this.stats.procedures} SOPs imported...`);
      }

    } catch (error) {
      this.stats.errors.push({
        file: path.basename(filePath),
        error: error.message
      });
      console.log(`❌ Error importing ${path.basename(filePath)}: ${error.message}`);
    }
  }

  async walkDirectory(dirPath, categoryCode) {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        // Recursively process subdirectories
        await this.walkDirectory(itemPath, categoryCode);
      } else if (item.endsWith('.md') && !item.startsWith('.')) {
        // Process SOP file
        await this.importSOPFile(itemPath, categoryCode);
      }
    }
  }

  async importSOPFile(filePath, categoryCode) {
    try {
      const sopData = await this.parseSOPFile(filePath, categoryCode);
      await this.insertSOP(sopData);
      this.stats.procedures++;

      // Update statistics
      if (sopData.florida_specific) this.stats.floridaSpecific++;
      if (sopData.hurricane_related) this.stats.hurricaneRelated++;
      if (sopData.osha_related) this.stats.oshaRelated++;

      if (this.stats.procedures % 10 === 0) {
        console.log(`📈 Progress: ${this.stats.procedures} SOPs imported...`);
      }

    } catch (error) {
      this.stats.errors.push({
        file: path.basename(filePath),
        error: error.message
      });
      console.error(`❌ Error importing ${path.basename(filePath)}:`, error.message);
    }
  }

  async parseSOPFile(filePath, categoryCode) {
    const content = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath, '.md');

    // Extract SOP number from filename or content
    let sopNumber = this.extractSOPNumber(content, filename);

    // Extract title
    let title = this.extractTitle(content, filename);

    // Extract purpose, scope, and procedure steps
    let purpose = this.extractPurpose(content);
    let scope = this.extractScope(content);
    let procedureSteps = this.extractProcedureSteps(content);

    // Extract sections
    const sections = this.extractSections(content);

    // Analyze content for flags
    const flags = this.analyzeContent(content);

    // Estimate duration
    const estimatedDuration = this.estimateDuration(content);

    // Determine priority
    const priority = this.determinePriority(content, categoryCode);

    return {
      sop_number: sopNumber,
      title: title,
      purpose: purpose,
      scope: scope,
      procedure_steps: procedureSteps,
      category_code: categoryCode,
      status: 'active',
      priority_level: priority,
      version: '1.0',
      estimated_duration_minutes: estimatedDuration,
      compliance_required: flags.compliance_required,
      florida_specific: flags.florida_specific,
      hurricane_related: flags.hurricane_related,
      osha_related: flags.osha_related
    };
  }

  extractSOPNumber(content, filename) {
    // Try to extract from first line
    const firstLine = content.split('\n')[0] || '';
    const contentMatch = firstLine.match(/SOP-(\d{4})/);
    if (contentMatch) return contentMatch[1];

    // Try to extract from filename
    const filenameMatch = filename.match(/SOP-(\d{4})/);
    if (filenameMatch) return filenameMatch[1];

    // Generate from filename if no explicit SOP number
    return filename.replace(/^SOP-/, '').substring(0, 4);
  }

  extractTitle(content, filename) {
    const lines = content.split('\n');
    const firstLine = lines[0] || '';

    if (firstLine.startsWith('# SOP-')) {
      return firstLine.replace(/^# SOP-\d{4}:\s*/, '').trim();
    } else if (firstLine.startsWith('# ')) {
      return firstLine.replace(/^# /, '').trim();
    }

    // Generate from filename
    return filename
      .replace(/^SOP-\d{4}-?/, '')
      .replace(/-/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .trim();
  }

  extractDescription(content) {
    const sections = this.extractSections(content);

    if (sections.purpose && sections.purpose.trim()) {
      return sections.purpose.trim().substring(0, 500);
    }

    if (sections.scope && sections.scope.trim()) {
      return sections.scope.trim().substring(0, 500);
    }

    // Extract first paragraph after title
    const lines = content.split('\n');
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith('#') && !line.startsWith('##')) {
        return line.substring(0, 500);
      }
    }

    return 'Florida First Roofing standard operating procedure';
  }

  extractPurpose(content) {
    const sections = this.extractSections(content);

    if (sections.purpose && sections.purpose.trim()) {
      return sections.purpose.trim();
    }

    // Fallback to extracting from content structure
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.toLowerCase().includes('purpose') && line.startsWith('#')) {
        // Find content after this heading
        for (let j = i + 1; j < lines.length; j++) {
          const nextLine = lines[j].trim();
          if (nextLine && !nextLine.startsWith('#')) {
            return nextLine;
          }
          if (nextLine.startsWith('#')) break;
        }
      }
    }

    return 'Standard operating procedure for Florida First Roofing operations';
  }

  extractScope(content) {
    const sections = this.extractSections(content);

    if (sections.scope && sections.scope.trim()) {
      return sections.scope.trim();
    }

    // Fallback to extracting from content structure
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.toLowerCase().includes('scope') && line.startsWith('#')) {
        // Find content after this heading
        for (let j = i + 1; j < lines.length; j++) {
          const nextLine = lines[j].trim();
          if (nextLine && !nextLine.startsWith('#')) {
            return nextLine;
          }
          if (nextLine.startsWith('#')) break;
        }
      }
    }

    return 'Applies to all Florida First Roofing construction projects and operations';
  }

  extractProcedureSteps(content) {
    const sections = this.extractSections(content);

    // Look for various step section names
    const stepSectionNames = [
      'procedure_steps', 'steps', 'procedure', 'process',
      'instructions', 'workflow', 'implementation'
    ];

    for (const sectionName of stepSectionNames) {
      if (sections[sectionName] && sections[sectionName].trim()) {
        return sections[sectionName].trim();
      }
    }

    // Extract numbered lists or bullet points
    const lines = content.split('\n');
    let stepsContent = [];
    let inStepsSection = false;

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Detect steps section
      if (trimmedLine.toLowerCase().includes('step') && trimmedLine.startsWith('#')) {
        inStepsSection = true;
        continue;
      }

      // Exit if we hit another section
      if (inStepsSection && trimmedLine.startsWith('#')) {
        break;
      }

      // Collect step content
      if (inStepsSection && (
        trimmedLine.match(/^\d+\./) ||
        trimmedLine.startsWith('- ') ||
        trimmedLine.startsWith('* ') ||
        (trimmedLine && !trimmedLine.startsWith('#'))
      )) {
        stepsContent.push(trimmedLine);
      }
    }

    if (stepsContent.length > 0) {
      return stepsContent.join('\n');
    }

    return 'Follow standard Florida First Roofing procedures and safety protocols';
  }

  extractSections(content) {
    const sections = {};
    const lines = content.split('\n');
    let currentSection = '';
    let currentContent = [];

    for (const line of lines) {
      if (line.startsWith('## ')) {
        if (currentSection) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        currentSection = line.replace('## ', '').trim()
          .toLowerCase()
          .replace(/\d+\.\s*/, '')
          .replace(/[^a-z0-9]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '');
        currentContent = [];
      } else if (currentSection) {
        currentContent.push(line);
      }
    }

    if (currentSection) {
      sections[currentSection] = currentContent.join('\n').trim();
    }

    return sections;
  }

  analyzeContent(content) {
    const lowerContent = content.toLowerCase();

    return {
      compliance_required: this.hasKeywords(lowerContent, [
        'compliance', 'regulation', 'requirement', 'mandatory', 'osha', 'legal'
      ]),
      florida_specific: this.hasKeywords(lowerContent, [
        'florida', 'fl', 'fbc', 'florida building code', 'miami-dade', 'broward'
      ]),
      hurricane_related: this.hasKeywords(lowerContent, [
        'hurricane', 'wind', 'storm', 'tropical', 'wind resistance', 'disaster'
      ]),
      osha_related: this.hasKeywords(lowerContent, [
        'osha', 'safety', 'fall protection', 'ppe', 'hazard', 'confined space'
      ]),
    };
  }

  hasKeywords(content, keywords) {
    return keywords.some(keyword => content.includes(keyword));
  }

  estimateDuration(content) {
    const wordCount = content.split(/\s+/).length;
    const steps = (content.match(/^\s*-\s/gm) || []).length;
    const checklists = (content.match(/^\s*\[\s*\]\s/gm) || []).length;

    let duration = Math.max(15, Math.floor(wordCount / 200) * 5);
    duration += steps * 3;
    duration += checklists * 2;

    return Math.min(duration, 480); // Cap at 8 hours
  }

  determinePriority(content, categoryCode) {
    const lowerContent = content.toLowerCase();

    // Critical priorities
    if (categoryCode === '1000' || categoryCode === '6000') return 'critical';
    if (this.hasKeywords(lowerContent, ['emergency', 'critical', 'immediate', 'urgent'])) return 'critical';

    // High priorities
    if (categoryCode === '8000') return 'high';
    if (this.hasKeywords(lowerContent, ['compliance', 'regulatory', 'hurricane', 'safety'])) return 'high';

    // Standard priorities
    if (this.hasKeywords(lowerContent, ['quality', 'training', 'standard'])) return 'standard';

    return 'low';
  }

  async insertSOP(sopData) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO sop_procedures (
          sop_number, title, purpose, scope, procedure_steps, category_id,
          status, priority_level, version,
          estimated_duration_minutes, compliance_required,
          florida_specific, hurricane_related, osha_related,
          created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?,
          (SELECT id FROM sop_categories WHERE category_code = ?),
          ?, ?, ?, ?, ?, ?, ?, ?,
          datetime('now'), datetime('now')
        )
      `);

      stmt.run(
        sopData.sop_number,
        sopData.title,
        sopData.purpose,
        sopData.scope,
        sopData.procedure_steps,
        sopData.category_code,
        sopData.status,
        sopData.priority_level,
        sopData.version,
        sopData.estimated_duration_minutes,
        sopData.compliance_required ? 1 : 0,
        sopData.florida_specific ? 1 : 0,
        sopData.hurricane_related ? 1 : 0,
        sopData.osha_related ? 1 : 0,
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );

      stmt.finalize();
    });
  }

  async generateSummary() {
    console.log('\n📊 Import Summary:');
    console.log('─'.repeat(60));
    console.log(`✅ Categories imported: ${this.stats.categories}`);
    console.log(`📋 Procedures imported: ${this.stats.procedures}`);
    console.log(`🏛️ Florida-specific: ${this.stats.floridaSpecific}`);
    console.log(`🌪️ Hurricane-related: ${this.stats.hurricaneRelated}`);
    console.log(`🦺 OSHA-related: ${this.stats.oshaRelated}`);

    if (this.stats.errors.length > 0) {
      console.log(`❌ Errors: ${this.stats.errors.length}`);
      this.stats.errors.forEach(error => {
        console.log(`   • ${error.file}: ${error.error}`);
      });
    }

    // Generate detailed category breakdown
    await this.generateCategoryBreakdown();
  }

  async generateCategoryBreakdown() {
    return new Promise((resolve) => {
      this.db.all(`
        SELECT
          sc.category_code,
          sc.category_name,
          COUNT(sp.id) as count,
          SUM(CASE WHEN sp.florida_specific = 1 THEN 1 ELSE 0 END) as florida_count,
          SUM(CASE WHEN sp.hurricane_related = 1 THEN 1 ELSE 0 END) as hurricane_count,
          SUM(CASE WHEN sp.osha_related = 1 THEN 1 ELSE 0 END) as osha_count
        FROM sop_categories sc
        LEFT JOIN sop_procedures sp ON sc.id = sp.category_id
        GROUP BY sc.id, sc.category_code, sc.category_name
        ORDER BY sc.category_code
      `, (err, rows) => {
        if (err) {
          console.error('Error generating breakdown:', err);
          resolve();
          return;
        }

        console.log('\n📈 Category Breakdown:');
        console.log('─'.repeat(60));
        console.log('Code Category                Count FL  Hur OSHA');
        console.log('─'.repeat(60));

        rows.forEach(row => {
          const code = row.category_code.padEnd(4);
          const name = row.category_name.padEnd(20);
          const count = String(row.count).padStart(3);
          const fl = String(row.florida_count).padStart(2);
          const hur = String(row.hurricane_count).padStart(3);
          const osha = String(row.osha_count).padStart(4);

          console.log(`${code} ${name} ${count}  ${fl}  ${hur}  ${osha}`);
        });

        console.log('─'.repeat(60));
        console.log('\n🎉 SOP Library import completed successfully!');
        resolve();
      });
    });
  }

  async run() {
    try {
      await this.initialize();
      await this.importCategories();
      await this.importSOPs();
      await this.generateSummary();

      console.log('\n🏁 Import process completed!');

    } catch (error) {
      console.error('\n💥 Import failed:', error);
      throw error;
    } finally {
      this.db.close();
    }
  }
}

// Run if executed directly
if (require.main === module) {
  const importer = new FFRSOPImporter();

  importer.run()
    .then(() => {
      console.log('\n✅ SOP Library is now ready for use!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Import failed:', error);
      process.exit(1);
    });
}

module.exports = FFRSOPImporter;