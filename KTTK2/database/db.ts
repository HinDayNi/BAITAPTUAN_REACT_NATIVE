import * as SQLite from "expo-sqlite";

/**
 * Q1: Todo Interface - Database schema definition
 * Represents a todo item with id, title, completion status, and creation timestamp
 */
export interface Todo {
  id?: number;
  title: string;
  done?: number;
  created_at?: number;
}

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Q1: Initialize database and open connection
 * Opens todos.db and creates todos table if it doesn't exist
 * Table schema:
 * - id: INTEGER PRIMARY KEY AUTOINCREMENT
 * - title: TEXT NOT NULL
 * - done: INTEGER DEFAULT 0 (0 = incomplete, 1 = complete)
 * - created_at: INTEGER (Unix timestamp)
 */
export const initDatabase = async (): Promise<void> => {
  try {
    db = await SQLite.openDatabaseAsync("todos.db");

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        done INTEGER DEFAULT 0,
        created_at INTEGER
      );
    `);

    console.log("✓ Database initialized successfully");

    // Q2: Optional seed - add sample data if table is empty
    await seedTodos();
  } catch (error) {
    console.error("✗ Error initializing database:", error);
    throw error;
  }
};

/**
 * Q2: Seed sample data into todos table if it's empty
 * Adds 2 sample todos for demonstration purposes
 */
export const seedTodos = async (): Promise<void> => {
  try {
    const database = getDatabase();

    // Check if table already has data
    const result = await database.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM todos"
    );

    if (result && result.count === 0) {
      const now = Date.now();

      await database.runAsync(
        "INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)",
        ["Welcome to Todo Notes", 0, now]
      );

      await database.runAsync(
        "INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)",
        ["Tap an item to mark it done", 0, now + 1000]
      );

      console.log("✓ Sample data seeded successfully");
    }
  } catch (error) {
    console.error("✗ Error seeding data:", error);
    // Don't throw - seeding is optional
  }
};

/**
 * Get database instance with null check
 * @throws Error if database not initialized
 */
export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error("Database not initialized. Call initDatabase first.");
  }
  return db;
};

/**
 * Q3-Q7: Get all todos from database
 */
export const getAllTodos = async (): Promise<Todo[]> => {
  try {
    const database = getDatabase();
    const todos = await database.getAllAsync<Todo>(
      "SELECT * FROM todos ORDER BY created_at DESC"
    );
    return todos;
  } catch (error) {
    console.error("✗ Error fetching todos:", error);
    return [];
  }
};

/**
 * Q4: Insert new todo
 */
export const insertTodo = async (title: string): Promise<number | null> => {
  try {
    const database = getDatabase();
    const now = Date.now();
    const result = await database.runAsync(
      "INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)",
      [title, 0, now]
    );
    return result.lastInsertRowId || null;
  } catch (error) {
    console.error("✗ Error inserting todo:", error);
    return null;
  }
};

/**
 * Q5: Toggle todo done state
 */
export const toggleTodoDone = async (id: number): Promise<boolean> => {
  try {
    const database = getDatabase();
    const todo = await database.getFirstAsync<Todo>(
      "SELECT * FROM todos WHERE id = ?",
      [id]
    );

    if (!todo) return false;

    const newDoneState = todo.done === 1 ? 0 : 1;
    await database.runAsync("UPDATE todos SET done = ? WHERE id = ?", [
      newDoneState,
      id,
    ]);
    return true;
  } catch (error) {
    console.error("✗ Error toggling todo:", error);
    return false;
  }
};

/**
 * Q6: Update todo title
 */
export const updateTodoTitle = async (
  id: number,
  newTitle: string
): Promise<boolean> => {
  try {
    const database = getDatabase();
    await database.runAsync("UPDATE todos SET title = ? WHERE id = ?", [
      newTitle,
      id,
    ]);
    return true;
  } catch (error) {
    console.error("✗ Error updating todo title:", error);
    return false;
  }
};

/**
 * Q7: Delete todo by id
 */
export const deleteTodo = async (id: number): Promise<boolean> => {
  try {
    const database = getDatabase();
    await database.runAsync("DELETE FROM todos WHERE id = ?", [id]);
    return true;
  } catch (error) {
    console.error("✗ Error deleting todo:", error);
    return false;
  }
};

/**
 * Q8: Search todos by title
 */
export const searchTodos = async (query: string): Promise<Todo[]> => {
  try {
    const database = getDatabase();
    const todos = await database.getAllAsync<Todo>(
      "SELECT * FROM todos WHERE title LIKE ? ORDER BY created_at DESC",
      [`%${query}%`]
    );
    return todos;
  } catch (error) {
    console.error("✗ Error searching todos:", error);
    return [];
  }
};

/**
 * Q9: Get all todos for API import comparison
 */
export const getTodosByTitle = async (title: string): Promise<Todo | null> => {
  try {
    const database = getDatabase();
    const todo = await database.getFirstAsync<Todo>(
      "SELECT * FROM todos WHERE title = ?",
      [title]
    );
    return todo || null;
  } catch (error) {
    console.error("✗ Error getting todo by title:", error);
    return null;
  }
};
