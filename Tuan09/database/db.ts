import * as SQLite from "expo-sqlite";

export interface Transaction {
  id?: number;
  title: string;
  amount: number;
  category: string;
  createdAt: string;
  type: "Thu" | "Chi";
  isDeleted?: number; // 0 = active, 1 = deleted
  deletedAt?: string;
}

let db: SQLite.SQLiteDatabase | null = null;

// Lấy instance database
const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("transactions.db");
  }
  return db;
};

// Khởi tạo database
export const initDatabase = async (): Promise<void> => {
  try {
    const database = await getDatabase();

    // Tạo bảng mới hoặc kiểm tra và thêm cột nếu thiếu
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        type TEXT NOT NULL,
        isDeleted INTEGER DEFAULT 0,
        deletedAt TEXT
      );
    `);

    // Migration: Thêm cột isDeleted và deletedAt nếu chưa có
    try {
      // Kiểm tra xem cột isDeleted đã tồn tại chưa
      const result = await database.getAllAsync(
        "PRAGMA table_info(transactions)"
      );

      const columns = result.map((col: any) => col.name);

      // Thêm cột isDeleted nếu chưa có
      if (!columns.includes("isDeleted")) {
        await database.execAsync(`
          ALTER TABLE transactions ADD COLUMN isDeleted INTEGER DEFAULT 0;
        `);
        console.log("Added isDeleted column");
      }

      // Thêm cột deletedAt nếu chưa có
      if (!columns.includes("deletedAt")) {
        await database.execAsync(`
          ALTER TABLE transactions ADD COLUMN deletedAt TEXT;
        `);
        console.log("Added deletedAt column");
      }
    } catch (migrationError) {
      console.log("Migration already done or not needed:", migrationError);
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

// Thêm giao dịch mới (bất đồng bộ)
export const addTransaction = async (
  transaction: Transaction
): Promise<number> => {
  try {
    const database = await getDatabase();

    const result = await database.runAsync(
      `INSERT INTO transactions (title, amount, category, createdAt, type, isDeleted) 
       VALUES (?, ?, ?, ?, ?, 0)`,
      [
        transaction.title,
        transaction.amount,
        transaction.category,
        transaction.createdAt,
        transaction.type,
      ]
    );

    console.log("Transaction added with ID:", result.lastInsertRowId);
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
};

// Lấy tất cả giao dịch chưa xóa (bất đồng bộ)
export const getAllTransactions = async (): Promise<Transaction[]> => {
  try {
    const database = await getDatabase();

    const allRows = await database.getAllAsync<Transaction>(
      "SELECT * FROM transactions WHERE isDeleted = 0 ORDER BY id DESC"
    );

    console.log("Fetched transactions:", allRows.length);
    return allRows;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

// Lấy tất cả giao dịch đã xóa (bất đồng bộ)
export const getDeletedTransactions = async (): Promise<Transaction[]> => {
  try {
    const database = await getDatabase();

    const allRows = await database.getAllAsync<Transaction>(
      "SELECT * FROM transactions WHERE isDeleted = 1 ORDER BY deletedAt DESC"
    );

    console.log("Fetched deleted transactions:", allRows.length);
    return allRows;
  } catch (error) {
    console.error("Error fetching deleted transactions:", error);
    throw error;
  }
};

// Cập nhật giao dịch (bất đồng bộ)
// Chỉ cập nhật các trường có thể chỉnh sửa, không động vào isDeleted và deletedAt
export const updateTransaction = async (
  id: number,
  transaction: Transaction
): Promise<void> => {
  try {
    const database = await getDatabase();

    await database.runAsync(
      `UPDATE transactions 
       SET title = ?, amount = ?, category = ?, type = ? 
       WHERE id = ? AND isDeleted = 0`,
      [
        transaction.title,
        transaction.amount,
        transaction.category,
        transaction.type,
        id,
      ]
    );

    console.log("Transaction updated:", id);
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

// Xóa mềm giao dịch (soft delete - bất đồng bộ)
export const deleteTransaction = async (id: number): Promise<void> => {
  try {
    const database = await getDatabase();

    const deletedAt = new Date().toLocaleString("vi-VN");
    await database.runAsync(
      "UPDATE transactions SET isDeleted = 1, deletedAt = ? WHERE id = ?",
      [deletedAt, id]
    );

    console.log("Transaction soft deleted:", id);
  } catch (error) {
    console.error("Error deleting transaction:", error);
    throw error;
  }
};

// Khôi phục giao dịch đã xóa (bất đồng bộ)
export const restoreTransaction = async (id: number): Promise<void> => {
  try {
    const database = await getDatabase();

    await database.runAsync(
      "UPDATE transactions SET isDeleted = 0, deletedAt = NULL WHERE id = ?",
      [id]
    );

    console.log("Transaction restored:", id);
  } catch (error) {
    console.error("Error restoring transaction:", error);
    throw error;
  }
};

// Xóa vĩnh viễn giao dịch (hard delete - bất đồng bộ)
export const permanentDeleteTransaction = async (id: number): Promise<void> => {
  try {
    const database = await getDatabase();

    await database.runAsync("DELETE FROM transactions WHERE id = ?", [id]);

    console.log("Transaction permanently deleted:", id);
  } catch (error) {
    console.error("Error permanently deleting transaction:", error);
    throw error;
  }
};

// Thêm dữ liệu mẫu (bất đồng bộ)
export const addSampleData = async (): Promise<void> => {
  try {
    const sampleTransactions: Transaction[] = [
      {
        title: "Lương tháng 10",
        amount: 15000000,
        category: "Khác",
        createdAt: "30/10/2025, 09:00:00",
        type: "Thu",
      },
      {
        title: "Mua sắm Lotte Mart",
        amount: 850000,
        category: "Mua sắm",
        createdAt: "31/10/2025, 14:30:00",
        type: "Chi",
      },
      {
        title: "Tiền điện tháng 10",
        amount: 450000,
        category: "Hóa đơn",
        createdAt: "1/11/2025, 08:15:00",
        type: "Chi",
      },
    ];

    for (const transaction of sampleTransactions) {
      await addTransaction(transaction);
    }

    console.log("Sample data added successfully");
  } catch (error) {
    console.error("Error adding sample data:", error);
    throw error;
  }
};
