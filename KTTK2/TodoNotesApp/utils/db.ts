import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) {
    return db;
  }

  try {
    db = await SQLite.openDatabaseAsync("todonotesapp.db");
    console.log("✓ Database connected successfully");
    return db;
  } catch (error) {
    console.error("✗ Database connection error:", error);
    throw error;
  }
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error("Database not initialized. Call initDatabase first.");
  }
  return db;
};

export const closeDatabase = async () => {
  if (db) {
    await db.closeAsync();
    db = null;
    console.log("Database closed");
  }
};
