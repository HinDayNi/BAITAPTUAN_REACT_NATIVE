import * as SQLite from "expo-sqlite";

export interface Task {
  id: number;
  value: string;
  intValue: number;
  created_at: string;
}

export class DatabaseManager {
  private static instance: DatabaseManager | null = null;
  private db: SQLite.SQLiteDatabase | null = null;
  private isInitialized: boolean = false;

  private constructor() {}

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  /**
   * Khởi tạo database và tạo bảng nếu cần
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized && this.db) {
      return;
    }

    try {
      this.db = await SQLite.openDatabaseAsync("test.db");

      // Tạo bảng tasks nếu chưa tồn tại
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          value TEXT NOT NULL UNIQUE,
          intValue INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Tạo index để tăng hiệu suất tìm kiếm
      await this.db.execAsync(`
        CREATE INDEX IF NOT EXISTS idx_tasks_value ON tasks(value);
        CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
      `);

      this.isInitialized = true;
      console.log("Database initialized successfully");
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  }

  /**
   * Lấy database instance
   */
  public getDatabase(): SQLite.SQLiteDatabase {
    if (!this.db || !this.isInitialized) {
      throw new Error("Database not initialized. Call initialize() first.");
    }
    return this.db;
  }

  /**
   * Thêm task mới
   */
  public async addTask(value: string): Promise<number> {
    if (!this.db) throw new Error("Database not initialized");

    const trimmedValue = value.trim();

    // Validation
    if (!trimmedValue || trimmedValue.length < 3 || trimmedValue.length > 200) {
      throw new Error("Task value must be between 3 and 200 characters");
    }

    try {
      // Kiểm tra trùng lặp
      const existingTask = await this.db.getFirstAsync(
        "SELECT id FROM tasks WHERE LOWER(value) = LOWER(?)",
        [trimmedValue]
      );

      if (existingTask) {
        throw new Error("Task already exists");
      }

      // Thêm task mới với transaction
      let taskId: number = 0;
      await this.db.withTransactionAsync(async () => {
        const result = await this.db!.runAsync(
          "INSERT INTO tasks (value, intValue) VALUES (?, ?)",
          [trimmedValue, 0]
        );
        taskId = result.lastInsertRowId;
      });

      console.log("Task added successfully with ID:", taskId);
      return taskId;
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  }

  /**
   * Lấy tất cả tasks
   */
  public async getAllTasks(): Promise<Task[]> {
    if (!this.db) throw new Error("Database not initialized");

    try {
      const tasks = (await this.db.getAllAsync(
        "SELECT * FROM tasks ORDER BY created_at DESC"
      )) as Task[];

      return tasks;
    } catch (error) {
      console.error("Error getting all tasks:", error);
      throw error;
    }
  }

  /**
   * Cập nhật trạng thái task
   */
  public async updateTaskStatus(id: number, intValue: number): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    try {
      await this.db.withTransactionAsync(async () => {
        await this.db!.runAsync("UPDATE tasks SET intValue = ? WHERE id = ?", [
          intValue,
          id,
        ]);
      });

      console.log("Task status updated successfully");
    } catch (error) {
      console.error("Error updating task status:", error);
      throw error;
    }
  }

  /**
   * Xóa task
   */
  public async deleteTask(id: number): Promise<void> {
    if (!this.db) throw new Error("Database not initialized");

    try {
      await this.db.withTransactionAsync(async () => {
        await this.db!.runAsync("DELETE FROM tasks WHERE id = ?", [id]);
      });

      console.log("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }

  /**
   * Tìm kiếm tasks
   */
  public async searchTasks(query: string): Promise<Task[]> {
    if (!this.db) throw new Error("Database not initialized");

    try {
      const searchPattern = `%${query.trim()}%`;
      const tasks = (await this.db.getAllAsync(
        "SELECT * FROM tasks WHERE value LIKE ? ORDER BY created_at DESC",
        [searchPattern]
      )) as Task[];

      return tasks;
    } catch (error) {
      console.error("Error searching tasks:", error);
      throw error;
    }
  }

  /**
   * Đóng database connection
   */
  public async closeDatabase(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
      this.isInitialized = false;
      console.log("Database connection closed");
    }
  }
}

// Export singleton instance
export const dbManager = DatabaseManager.getInstance();
