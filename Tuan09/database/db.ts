import * as SQLite from "expo-sqlite";

export interface Transaction {
  id?: number;
  title: string;
  amount: number;
  category: string;
  createdAt: string;
  type: "Thu" | "Chi";
}

let db: SQLite.SQLiteDatabase | null = null;

// Khởi tạo database
export const initDatabase = async (): Promise<void> => {
  try {
    db = await SQLite.openDatabaseAsync("transactions.db");

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        type TEXT NOT NULL
      );
    `);

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
    if (!db) {
      throw new Error("Database not initialized");
    }

    const result = await db.runAsync(
      `INSERT INTO transactions (title, amount, category, createdAt, type) 
       VALUES (?, ?, ?, ?, ?)`,
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

// Lấy tất cả giao dịch (bất đồng bộ)
export const getAllTransactions = async (): Promise<Transaction[]> => {
  try {
    if (!db) {
      throw new Error("Database not initialized");
    }

    const allRows = await db.getAllAsync<Transaction>(
      "SELECT * FROM transactions ORDER BY id DESC"
    );

    console.log("Fetched transactions:", allRows.length);
    return allRows;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};

// Cập nhật giao dịch (bất đồng bộ)
export const updateTransaction = async (
  id: number,
  transaction: Transaction
): Promise<void> => {
  try {
    if (!db) {
      throw new Error("Database not initialized");
    }

    await db.runAsync(
      `UPDATE transactions 
       SET title = ?, amount = ?, category = ?, type = ? 
       WHERE id = ?`,
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

// Xóa giao dịch (bất đồng bộ)
export const deleteTransaction = async (id: number): Promise<void> => {
  try {
    if (!db) {
      throw new Error("Database not initialized");
    }

    await db.runAsync("DELETE FROM transactions WHERE id = ?", [id]);

    console.log("Transaction deleted:", id);
  } catch (error) {
    console.error("Error deleting transaction:", error);
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
