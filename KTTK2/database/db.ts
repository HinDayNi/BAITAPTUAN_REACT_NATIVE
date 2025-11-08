import * as SQLite from "expo-sqlite";

// 🔹 Biến lưu kết nối DB (mở 1 lần duy nhất)
let db: SQLite.SQLiteDatabase | null = null;

// 🔹 Mở database (đảm bảo chỉ mở 1 kết nối)
export async function openDB() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("todo_notes.db");
    console.log("✅ Database connected");
  }
  return db;
}

// 🔹 Hàm khởi tạo bảng + seed dữ liệu mẫu
export async function initDatabase() {
  const database = await openDB();
  try {
    // Tạo bảng nếu chưa có
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        done INTEGER DEFAULT 0,
        created_at INTEGER
      );
    `);

    // Đếm số lượng bản ghi
    const rows = await database.getAllAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM todos"
    );
    const count = rows[0]?.count ?? 0;

    // Nếu chưa có dữ liệu → thêm 2 dòng mẫu
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
  const todos = await database.getAllAsync<{
    id: number;
    title: string;
    done: number;
    created_at: number;
  }>("SELECT * FROM todos ORDER BY created_at DESC");
  return todos;
}

// 🔹 Thêm todo mới
export async function addTodo(title: string) {
  const database = await openDB();
  await database.runAsync(
    "INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)",
    [title, 0, Date.now()]
  );
}

// 🔹 Cập nhật todo (đổi title, done, …)
export async function updateTodo(todo: {
  id: number;
  title: string;
  done?: number;
}) {
  const database = await openDB();
  await database.runAsync("UPDATE todos SET title = ?, done = ? WHERE id = ?", [
    todo.title,
    todo.done ?? 0,
    todo.id,
  ]);
}

// 🔹 Cập nhật riêng title (nếu cần)
export async function updateTodoTitle(id: number, newTitle: string) {
  const database = await openDB();
  await database.runAsync("UPDATE todos SET title = ? WHERE id = ?", [
    newTitle,
    id,
  ]);
}

// 🔹 Xóa todo theo id
export async function deleteTodo(id: number) {
  const database = await openDB();
  await database.runAsync("DELETE FROM todos WHERE id = ?", [id]);
}

// ✅ Export default để tiện import
export default {
  openDB,
  initDatabase,
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
};
