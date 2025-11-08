import * as SQLite from "expo-sqlite";

let db: any = null;

export const initDatabase = async (): Promise<any> => {
  if (db) {
    return db;
  }

  try {
    db = SQLite.openDatabase("todonotesapp.db");
    console.log("✓ Database connected successfully");
    return db;
  } catch (error) {
    console.error("✗ Database connection error:", error);
    throw error;
  }
};

export const getDatabase = (): any => {
  if (!db) {
    throw new Error("Database not initialized. Call initDatabase first.");
  }
  return db;
};

export const closeDatabase = async () => {
  if (db) {
    console.log("Database closed");
    db = null;
  }
};

// Create todos table if not exists
export const createTodosTable = async (): Promise<void> => {
  const database = getDatabase();
  return new Promise((resolve, reject) => {
    database.transaction((tx: any) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          done INTEGER DEFAULT 0,
          created_at INTEGER
        );`,
        [],
        () => {
          console.log("✓ Todos table created successfully");
          resolve();
        },
        (_: any, error: any) => {
          console.error("✗ Error creating todos table:", error);
          reject(error);
          return true;
        }
      );
    });
  });
};

// Seed initial data if table is empty
export const seedTodos = async (): Promise<void> => {
  const database = getDatabase();
  return new Promise((resolve, reject) => {
    database.transaction((tx: any) => {
      // Check if table has any records
      tx.executeSql(
        "SELECT COUNT(*) as count FROM todos",
        [],
        (_: any, result: any) => {
          if (result.rows.length > 0 && result.rows._array[0].count === 0) {
            const now = Date.now();
            tx.executeSql(
              `INSERT INTO todos (title, done, created_at) VALUES
              ('Learn React Native', 0, ?),
              ('Setup SQLite database', 1, ?)`,
              [now, now - 86400000],
              () => {
                console.log("✓ Seeded 2 sample todos");
                resolve();
              },
              (_: any, error: any) => {
                console.error("✗ Error seeding todos:", error);
                reject(error);
                return true;
              }
            );
          } else {
            resolve();
          }
        },
        (_: any, error: any) => {
          console.error("✗ Error checking todos count:", error);
          reject(error);
          return true;
        }
      );
    });
  });
};

// Get all todos
export const getAllTodos = async (): Promise<any[]> => {
  const database = getDatabase();
  return new Promise((resolve, reject) => {
    database.transaction((tx: any) => {
      tx.executeSql(
        "SELECT * FROM todos ORDER BY created_at DESC",
        [],
        (_: any, result: any) => {
          resolve(result.rows._array);
        },
        (_: any, error: any) => {
          console.error("✗ Error fetching todos:", error);
          reject(error);
          return true;
        }
      );
    });
  });
};

// Insert new todo
export const insertTodo = async (title: string): Promise<void> => {
  const database = getDatabase();
  return new Promise((resolve, reject) => {
    database.transaction((tx: any) => {
      tx.executeSql(
        "INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)",
        [title, 0, Date.now()],
        () => {
          resolve();
        },
        (_: any, error: any) => {
          console.error("✗ Error inserting todo:", error);
          reject(error);
          return true;
        }
      );
    });
  });
};

// Update todo
export const updateTodo = async (
  id: number,
  title: string,
  done: number
): Promise<void> => {
  const database = getDatabase();
  return new Promise((resolve, reject) => {
    database.transaction((tx: any) => {
      tx.executeSql(
        "UPDATE todos SET title = ?, done = ? WHERE id = ?",
        [title, done, id],
        () => {
          resolve();
        },
        (_: any, error: any) => {
          console.error("✗ Error updating todo:", error);
          reject(error);
          return true;
        }
      );
    });
  });
};

// Toggle done status
export const toggleTodo = async (
  id: number,
  currentDone: number
): Promise<void> => {
  const newDone = currentDone === 0 ? 1 : 0;
  return updateTodo(id, "", newDone);
};

// Delete todo
export const deleteTodo = async (id: number): Promise<void> => {
  const database = getDatabase();
  return new Promise((resolve, reject) => {
    database.transaction((tx: any) => {
      tx.executeSql(
        "DELETE FROM todos WHERE id = ?",
        [id],
        () => {
          resolve();
        },
        (_: any, error: any) => {
          console.error("✗ Error deleting todo:", error);
          reject(error);
          return true;
        }
      );
    });
  });
};
