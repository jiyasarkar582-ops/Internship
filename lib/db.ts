import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

import { getAppConfig } from './config-parser';
import { syncDatabaseSchema } from './schema-generator';

let dbInstance: Database | null = null;

export async function getDb() {
  if (!dbInstance) {
    dbInstance = await open({
      filename: path.join(process.cwd(), 'c2a_database.sqlite'),
      driver: sqlite3.Database
    });
    
    const config = getAppConfig();
    await syncDatabaseSchema(dbInstance, config);

    // Create the users table if it doesn't exist
    await dbInstance.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
  return dbInstance;
}
