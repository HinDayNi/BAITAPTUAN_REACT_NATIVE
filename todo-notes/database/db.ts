// db.ts
import { openDatabaseSync } from "expo-sqlite";

let db: any = null;

export const getDB = () => {
  if (!db) {
    db = openDatabaseSync("todos.db");
  }
  return db;
};

export const initDB = () => {
  try {
    const database = getDB();

    // Create todos table if not exists
    database.execAsync(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        done INTEGER DEFAULT 0,
        created_at INTEGER
      );
    `);

    // Seed sample data if table is empty
    database.execAsync(`
      INSERT INTO todos (title, done, created_at)
      SELECT 'Việc mẫu 1', 0, strftime('%s','now')
      WHERE NOT EXISTS (SELECT 1 FROM todos);
    `);

    // Add second sample record if table has only one record
    database.execAsync(`
      INSERT INTO todos (title, done, created_at)
      SELECT 'Việc mẫu 2', 0, strftime('%s','now')
      WHERE (SELECT COUNT(*) FROM todos) < 2;
    `);
  } catch (error) {
    console.error("Database initialization error:", error);
  }
};
