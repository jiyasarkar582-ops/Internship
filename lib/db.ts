import { createClient, Client, InValue } from '@libsql/client';
import path from 'path';
import { getAppConfig } from './config-parser';
import { syncDatabaseSchema } from './schema-generator';

function createDbClient(): Client {
  // On Vercel: use in-memory SQLite (serverless - no persistent disk)
  // Locally: use file-based SQLite
  if (process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN) {
    // Production: Turso remote database (persistent)
    return createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }

  if (process.env.VERCEL) {
    // Vercel without Turso: use in-memory (resets on cold start, good for demo)
    return createClient({ url: 'file::memory:?cache=shared' });
  }

  // Local development: file-based SQLite
  const dbPath = path.join(process.cwd(), 'c2a_database.sqlite');
  return createClient({ url: `file:${dbPath}` });
}

let clientInstance: Client | null = null;
let initialized = false;

export async function getDb(): Promise<DbWrapper> {
  if (!clientInstance) {
    clientInstance = createDbClient();
  }

  if (!initialized) {
    const config = getAppConfig();
    await syncDatabaseSchema(clientInstance, config);

    // Create users table
    await clientInstance.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    initialized = true;
  }

  return new DbWrapper(clientInstance);
}

// Compatibility wrapper matching the existing async sqlite API
class DbWrapper {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async get(sql: string, params?: InValue[]): Promise<any> {
    const result = await this.client.execute({ sql, args: params ?? [] });
    if (result.rows.length === 0) return null;
    return Object.fromEntries(
      result.columns.map((col, i) => [col, result.rows[0][i]])
    );
  }

  async run(sql: string, params?: InValue[]): Promise<{ changes: number }> {
    const result = await this.client.execute({ sql, args: params ?? [] });
    return { changes: result.rowsAffected };
  }

  async all(sql: string, params?: InValue[]): Promise<any[]> {
    const result = await this.client.execute({ sql, args: params ?? [] });
    return result.rows.map(row =>
      Object.fromEntries(result.columns.map((col, i) => [col, row[i]]))
    );
  }

  async exec(sql: string): Promise<void> {
    // Split multi-statement SQL and execute each
    const statements = sql.split(';').map(s => s.trim()).filter(Boolean);
    for (const stmt of statements) {
      await this.client.execute(stmt);
    }
  }
}
