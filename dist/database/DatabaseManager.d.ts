import Database from 'better-sqlite3';
import { DatabaseConfig } from '../types/config';
export declare class DatabaseManager {
    private db;
    private config;
    constructor(config: DatabaseConfig);
    initialize(): Promise<Database.Database>;
    private initializeSQLite;
    private runMigrations;
    private runSpecificMigrations;
    getDatabase(): Database.Database;
    close(): void;
    backup(backupPath: string): void;
}
//# sourceMappingURL=DatabaseManager.d.ts.map