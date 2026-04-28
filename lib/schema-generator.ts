import { Database } from 'sqlite';
import { AppConfig } from './config-parser';

function mapTypeToSqlite(type: string): string {
  switch (type) {
    case 'number':
      return 'REAL';
    case 'boolean':
      return 'INTEGER'; // 0 or 1
    case 'string':
    case 'text':
    case 'email':
    case 'date':
    case 'select':
    default:
      return 'TEXT';
  }
}

export async function syncDatabaseSchema(db: Database, config: AppConfig) {
  for (const entity of config.entities) {
    const tableName = entity.slug;
    
    // Build columns definition
    const columns = entity.fields.map(field => {
      const dbType = mapTypeToSqlite(field.type);
      let colDef = `"${field.name}" ${dbType}`;
      
      if (field.required) {
        // SQLite doesn't strictly enforce NOT NULL if we add columns later without defaults sometimes,
        // but for new tables it's fine.
        // We'll skip NOT NULL to make generic dynamic inserts easier if some fields are missing
        // but we enforce it at the application layer.
      }
      
      if (field.default !== undefined) {
        if (typeof field.default === 'string') {
          colDef += ` DEFAULT '${field.default.replace(/'/g, "''")}'`;
        } else {
          colDef += ` DEFAULT ${field.default}`;
        }
      }
      return colDef;
    });

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS "${tableName}" (
        "id" TEXT PRIMARY KEY,
        ${columns.join(',\n        ')},
        "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
        "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await db.exec(createTableQuery);

    // Check existing columns to add new ones (Schema Evolution)
    const tableInfo = await db.all(`PRAGMA table_info("${tableName}")`);
    const existingColumns = new Set(tableInfo.map(info => info.name));

    for (const field of entity.fields) {
      if (!existingColumns.has(field.name)) {
        const dbType = mapTypeToSqlite(field.type);
        let alterQuery = `ALTER TABLE "${tableName}" ADD COLUMN "${field.name}" ${dbType}`;
        if (field.default !== undefined) {
            if (typeof field.default === 'string') {
                alterQuery += ` DEFAULT '${field.default.replace(/'/g, "''")}'`;
            } else {
                alterQuery += ` DEFAULT ${field.default}`;
            }
        }
        await db.exec(alterQuery);
      }
    }
  }
}
