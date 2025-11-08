import * as SQLite from "expo-sqlite";

// 🔹 Kết nối DB
let db: SQLite.SQLiteDatabase | null = null;

export async function openDB() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("todo_notes.db");
    console.log("✅ Database connected");
  }
  return db;
}

// 🔹 Tạo bảng và seed mẫu
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

    // Kiểm tra có dữ liệu chưa
    const rows = await database.getAllAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM todos"
    );
    const count = rows[0]?.count ?? 0;

    // Seed nếu rỗng
    if (count === 0) {
      await database.runAsync(
        "INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)",
        ["Học React Native", 0, Date.now()]
      );
      await database.runAsync(
        "INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)",
        ["Ôn bài kiểm tra", 1, Date.now()]
      );
      console.log("✅ Seeded sample todos");
    }

    console.log("✅ Database initialized successfully");
  } catch (err) {
    console.error("❌ Database init error:", err);
    throw err;
  }
}

// 🔹 Lấy tất cả todos
export async function getTodos() {
  const database = await openDB();
  return await database.getAllAsync<{
    id: number;
    title: string;
    done: number;
    created_at: number;
  }>("SELECT * FROM todos ORDER BY done ASC, created_at DESC");
}

// 🔹 Thêm mới
export async function addTodo(title: string) {
  const database = await openDB();
  await database.runAsync(
    "INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)",
    [title, 0, Date.now()]
  );
}

// 🔹 Cập nhật todo (chỉ sửa title hoặc done)
export async function updateTodo(todo: {
  id: number;
  title?: string;
  done?: number;
}) {
  const database = await openDB();
  if (todo.title !== undefined) {
    await database.runAsync("UPDATE todos SET title = ? WHERE id = ?", [
      todo.title,
      todo.id,
    ]);
  }
  if (todo.done !== undefined) {
    await database.runAsync("UPDATE todos SET done = ? WHERE id = ?", [
      todo.done,
      todo.id,
    ]);
  }
}

// 🔹 Xóa todo
export async function deleteTodo(id: number) {
  const database = await openDB();
  await database.runAsync("DELETE FROM todos WHERE id = ?", [id]);
}

// 🔹 Hàm SQL tiện ích
export async function execSqlAsync(sql: string, params: any[] = []) {
  const database = await openDB();
  return await database.runAsync(sql, params);
}

export default {
  openDB,
  initDatabase,
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
};
