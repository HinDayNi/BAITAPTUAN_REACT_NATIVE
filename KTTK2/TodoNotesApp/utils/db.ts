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

// Create todos table if not exists
export const createTodosTable = async (): Promise<void> => {
  const database = getDatabase();
  try {
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        done INTEGER DEFAULT 0,
        created_at INTEGER
      );
    `);
    console.log("✓ Todos table created successfully");
  } catch (error) {
    console.error("✗ Error creating todos table:", error);
    throw error;
  }
};

// Seed initial data if table is empty
export const seedTodos = async (): Promise<void> => {
  const database = getDatabase();
  try {
    // Check if table has any records
    const result = await database.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM todos"
    );

    if (result && result.count === 0) {
      const now = Date.now();
      await database.execAsync(`
        INSERT INTO todos (title, done, created_at) VALUES
        ('Learn React Native', 0, ${now}),
        ('Setup SQLite database', 1, ${now - 86400000});
      `);
      console.log("✓ Seeded 2 sample todos");
    }
  } catch (error) {
    console.error("✗ Error seeding todos:", error);
    throw error;
  }
};

// Get all todos
export const getAllTodos = async (): Promise<any[]> => {
  const database = getDatabase();
  try {
    const todos = await database.getAllAsync(
      "SELECT * FROM todos ORDER BY created_at DESC"
    );
    return todos;
  } catch (error) {
    console.error("✗ Error fetching todos:", error);
    throw error;
  }
};
