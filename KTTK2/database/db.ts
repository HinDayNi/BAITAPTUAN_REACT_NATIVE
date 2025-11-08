import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

// 🔹 Hàm mở kết nối database (gọi 1 lần duy nhất)
export async function openDB() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("todo_notes.db");
    console.log("✅ Database connected");
  }
  return db;
}

// 🔹 Hàm thực thi SQL
export async function execSqlAsync(sql: string, params: (string | number)[] = []) {
  const database = await openDB();
  try {
    // expo-sqlite's execAsync accepts only the SQL string; use runAsync for parameterized statements.
    if (params && params.length > 0 && typeof (database as any).runAsync === "function") {
      const result = await (database as any).runAsync(sql, params);
      return result;
    } else {
      const result = await database.execAsync(sql);
      return result;
    }
  } catch (err) {
    console.error("❌ SQL exec error:", err);
    throw err;
  }
}

// 🔹 Hàm tạo bảng + seed dữ liệu
export async function initDatabase() {
  const database = await openDB();

  try {
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        done INTEGER DEFAULT 0,
        created_at INTEGER
      );
    `);

    const res = await database.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM todos"
    );

    if (res && res.count === 0) {
      await database.runAsync(
        "INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)",
        ["Học React Native", 0, Date.now()]
      );
      await database.runAsync(
        "INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)",
        ["Ôn bài kiểm tra", 1, Date.now()]
      );
      console.log("✅ Seeded 2 sample todos");
    }

    console.log("✅ Database initialized successfully");
  } catch (err) {
    console.error("❌ Database init error:", err);
  }
}

export async function getTodos() {
  const database = await openDB();
  const todos = await database.getAllAsync<{
    id: number;
    title: string;
    done: number;
    created_at: number;
  }>("SELECT * FROM todos ORDER BY created_at DESC");
  return todos;
}

export default openDB;
