import { Client } from '@libsql/client';
import { AppConfig } from './config-parser';

function mapTypeToSqlite(type: string): string {
  switch (type) {
    case 'number':
      return 'REAL';
    case 'boolean':
      return 'INTEGER';
    case 'string':
    case 'text':
    case 'email':
    case 'date':
    case 'select':
    default:
      return 'TEXT';
  }
}

export async function syncDatabaseSchema(db: Client, config: AppConfig) {
  for (const entity of config.entities) {
    const tableName = entity.slug;

    const columns = entity.fields.map(field => {
      const dbType = mapTypeToSqlite(field.type);
      let colDef = `"${field.name}" ${dbType}`;
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

    await db.execute(createTableQuery);

    // Schema evolution: add new columns
    const tableInfoResult = await db.execute(`PRAGMA table_info("${tableName}")`);
    const existingColumns = new Set(
      tableInfoResult.rows.map(row => row[1] as string)
    );

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
        await db.execute(alterQuery);
      }
    }
  }
}
