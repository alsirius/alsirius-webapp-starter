"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseManager = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class DatabaseManager {
    constructor(config) {
        this.db = null;
        this.config = config;
    }
    async initialize() {
        if (this.config.type === 'sqlite') {
            return this.initializeSQLite();
        }
        else {
            throw new Error(`Database type ${this.config.type} not yet implemented`);
        }
    }
    initializeSQLite() {
        try {
            const dbPath = this.config.path || './auth.db';
            // Create database directory if it doesn't exist
            const dbDir = path_1.default.dirname(dbPath);
            if (!fs_1.default.existsSync(dbDir)) {
                fs_1.default.mkdirSync(dbDir, { recursive: true });
            }
            // Open database connection
            this.db = new better_sqlite3_1.default(dbPath);
            // Enable foreign keys
            this.db.pragma('foreign_keys = ON');
            // Set WAL mode for better concurrency
            this.db.pragma('journal_mode = WAL');
            // Run schema migration
            this.runMigrations();
            console.log(`Database initialized successfully at: ${dbPath}`);
            return this.db;
        }
        catch (error) {
            console.error('Failed to initialize database:', error);
            throw new Error(`Database initialization failed: ${error}`);
        }
    }
    runMigrations() {
        if (!this.db) {
            throw new Error('Database not initialized');
        }
        try {
            // Create users table
            this.db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'user',
          permissions TEXT DEFAULT '[]',
          status TEXT NOT NULL DEFAULT 'pending',
          email_verified INTEGER DEFAULT 0,
          approval_code TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_login_at DATETIME,
          deleted INTEGER DEFAULT 0
        );
      `);
            // Create registration_codes table
            this.db.exec(`
        CREATE TABLE IF NOT EXISTS registration_codes (
          id TEXT PRIMARY KEY,
          code TEXT UNIQUE NOT NULL,
          created_by TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          used_by TEXT DEFAULT NULL,
          used_at DATETIME,
          usable_by TEXT DEFAULT 'anyone',
          max_uses INTEGER DEFAULT 1,
          expires_at DATETIME,
          FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
          FOREIGN KEY (used_by) REFERENCES users(id) ON DELETE SET NULL
        );
      `);
            // Create email_verification table
            this.db.exec(`
        CREATE TABLE IF NOT EXISTS email_verification (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL,
          verification_code TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          expires_at DATETIME NOT NULL,
          verified INTEGER DEFAULT 0,
          verified_at DATETIME,
          registration_data TEXT
        );
      `);
            // Create password_reset_tokens table
            this.db.exec(`
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
          id TEXT PRIMARY KEY,
          token TEXT UNIQUE NOT NULL,
          user_id TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          expires_at DATETIME NOT NULL,
          used INTEGER DEFAULT 0,
          used_at DATETIME,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `);
            // Create indexes
            this.db.exec(`
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
        CREATE INDEX IF NOT EXISTS idx_users_active ON users(deleted);
        CREATE INDEX IF NOT EXISTS idx_users_approval ON users(approval_code);
        CREATE INDEX IF NOT EXISTS idx_registration_codes_code ON registration_codes(code);
        CREATE INDEX IF NOT EXISTS idx_registration_codes_active ON registration_codes(used_by);
        CREATE INDEX IF NOT EXISTS idx_email_verification_email ON email_verification(email);
        CREATE INDEX IF NOT EXISTS idx_email_verification_code ON email_verification(verification_code);
        CREATE INDEX IF NOT EXISTS idx_password_reset_token ON password_reset_tokens(token);
      `);
            // Run specific migrations
            this.runSpecificMigrations();
            console.log('Database migrations completed successfully');
        }
        catch (error) {
            console.error('Failed to run migrations:', error);
            throw new Error(`Migration failed: ${error}`);
        }
    }
    runSpecificMigrations() {
        if (!this.db) {
            throw new Error('Database not initialized');
        }
        try {
            // Add max_uses column if it doesn't exist
            try {
                this.db.exec('ALTER TABLE registration_codes ADD COLUMN max_uses INTEGER DEFAULT 1');
                console.log('Added max_uses column to registration_codes');
            }
            catch (error) {
                console.log('max_uses column already exists or could not be added');
            }
            // Add expires_at column if it doesn't exist
            try {
                this.db.exec('ALTER TABLE registration_codes ADD COLUMN expires_at DATETIME');
                console.log('Added expires_at column to registration_codes');
            }
            catch (error) {
                console.log('expires_at column already exists or could not be added');
            }
        }
        catch (error) {
            console.log('Migration warnings (non-critical):', error);
        }
    }
    getDatabase() {
        if (!this.db) {
            throw new Error('Database not initialized. Call initialize() first.');
        }
        return this.db;
    }
    close() {
        if (this.db) {
            this.db.close();
            this.db = null;
            console.log('Database connection closed');
        }
    }
    backup(backupPath) {
        if (!this.db) {
            throw new Error('Database not initialized');
        }
        try {
            // Create backup directory if it doesn't exist
            const backupDir = path_1.default.dirname(backupPath);
            if (!fs_1.default.existsSync(backupDir)) {
                fs_1.default.mkdirSync(backupDir, { recursive: true });
            }
            // Perform backup
            this.db.backup(backupPath);
            console.log(`Database backup created at: ${backupPath}`);
        }
        catch (error) {
            console.error('Failed to create backup:', error);
            throw new Error(`Backup failed: ${error}`);
        }
    }
}
exports.DatabaseManager = DatabaseManager;
//# sourceMappingURL=DatabaseManager.js.map