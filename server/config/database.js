/**
 * Database Configuration
 * Centralized database connection using better-sqlite3
 */

const Database = require('better-sqlite3');
const path = require('path');

// Database path
const dbPath = path.join(__dirname, '../database/accounting.db');

// Create and configure database connection
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

module.exports = db;

