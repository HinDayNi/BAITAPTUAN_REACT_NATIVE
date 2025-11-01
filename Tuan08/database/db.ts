import * as SQLite from "expo-sqlite";

// Định nghĩa interface cho Task
export interface Task {
  id: number;
  value: string;
  intValue: number;
  created_at: string;
  updated_at?: string;
}

// Định nghĩa interface cho database configuration
export interface DatabaseConfig {
  databaseName: string;
  version: number;
}

/**
 * Lớp quản lý SQLite database với các phương thức đồng bộ
 */
export class SQLiteDatabase {
  private static instance: SQLiteDatabase | null = null;
  private db: SQLite.SQLiteDatabase | null = null;
  private isInitialized: boolean = false;
  private config: DatabaseConfig;

  private constructor(config: DatabaseConfig) {
    this.config = config;
  }

  /**
   * Lấy instance singleton của database
   */
  public static getInstance(config?: DatabaseConfig): SQLiteDatabase {
    if (!SQLiteDatabase.instance) {
      const defaultConfig: DatabaseConfig = {
        databaseName: "test.db",
        version: 1,
      };
      SQLiteDatabase.instance = new SQLiteDatabase(config || defaultConfig);
    }
    return SQLiteDatabase.instance;
  }

  /**
   * Khởi tạo database và tạo các bảng cần thiết (đồng bộ)
   */
  public initialize(): void {
    if (this.isInitialized && this.db) {
      console.log("✅ Database already initialized:", this.config.databaseName);
      return;
    }

    try {
      console.log(
        "🚀 Initializing SQLite database synchronously:",
        this.config.databaseName
      );

      // Mở database đồng bộ
      console.log("📂 Opening database file...");
      this.db = SQLite.openDatabaseSync(this.config.databaseName);
      console.log("✅ Database file opened successfully");

      // Kiểm tra kết nối database
      console.log("🔍 Testing database connection...");
      const testResult = this.db.getFirstSync("SELECT 1 as test");
      console.log("✅ Database connection test passed:", testResult);

      // Bật foreign keys và WAL mode
      console.log("⚙️ Setting up database configuration...");
      this.db.execSync("PRAGMA foreign_keys = ON;");
      this.db.execSync("PRAGMA journal_mode = WAL;");
      console.log("✅ Database configuration completed");

      // Tạo bảng tasks
      console.log("📝 Creating tasks table...");
      this.createTasksTable();

      // Tạo các index để tối ưu hiệu suất
      console.log("🔗 Creating database indexes...");
      this.createIndexes();

      this.isInitialized = true;
      console.log("🎉 Database initialized successfully!");

      // Hiển thị thông tin database
      const count = this.getTaskCount();
      console.log(`📊 Current tasks in database: ${count}`);
    } catch (error) {
      console.error("❌ Error initializing database:", error);

      // Reset state nếu có lỗi
      this.db = null;
      this.isInitialized = false;

      throw new Error(
        `Failed to initialize SQLite database: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Tạo bảng tasks (đồng bộ)
   */
  private createTasksTable(): void {
    if (!this.db) throw new Error("Database not initialized");

    try {
      // Tạo bảng đơn giản trước, sau đó sẽ thêm cột nếu cần
      console.log("� Ensuring tasks table exists...");

      // Tạo bảng cơ bản nếu chưa có
      this.db.execSync(`
        CREATE TABLE IF NOT EXISTS tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          value TEXT NOT NULL,
          intValue INTEGER DEFAULT 0
        );
      `);

      console.log("✅ Basic tasks table ensured");

      // Kiểm tra và thêm cột created_at nếu chưa có
      try {
        this.db.execSync(
          "ALTER TABLE tasks ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP"
        );
        console.log("✅ Added created_at column");
      } catch (alterError: any) {
        if (alterError.message.includes("duplicate column")) {
          console.log("✅ created_at column already exists");
        } else {
          console.log(
            "⚠️ Could not add created_at column:",
            alterError.message
          );
        }
      }

      // Kiểm tra và thêm cột updated_at nếu chưa có
      try {
        this.db.execSync(
          "ALTER TABLE tasks ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP"
        );
        console.log("✅ Added updated_at column");
      } catch (alterError: any) {
        if (alterError.message.includes("duplicate column")) {
          console.log("✅ updated_at column already exists");
        } else {
          console.log(
            "⚠️ Could not add updated_at column:",
            alterError.message
          );
        }
      }

      // Verify table exists và có thể query được
      const verifyQuery = this.db.getFirstSync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='tasks'"
      );

      if (!verifyQuery) {
        throw new Error("Failed to create or verify tasks table");
      }

      // Test basic operations
      const testCount = this.db.getFirstSync(
        "SELECT COUNT(*) as count FROM tasks"
      );
      console.log(
        "✅ Table verification successful, current count:",
        testCount
      );
    } catch (error) {
      console.error("❌ Error creating tasks table:", error);
      throw new Error(
        `Failed to create tasks table: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Tạo các index để tối ưu hiệu suất (đồng bộ)
   */
  private createIndexes(): void {
    if (!this.db) throw new Error("Database not initialized");

    const indexes = [
      "CREATE INDEX IF NOT EXISTS idx_tasks_value ON tasks(value);",
      "CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);",
      "CREATE INDEX IF NOT EXISTS idx_tasks_intValue ON tasks(intValue);",
    ];

    try {
      for (const indexQuery of indexes) {
        this.db.execSync(indexQuery);
      }
      console.log("✅ Indexes created successfully");
    } catch (error) {
      console.error("❌ Error creating indexes:", error);
      // Không throw error cho indexes vì có thể cột chưa tồn tại
      console.log("⚠️ Some indexes may not be created due to missing columns");
    }
  }

  /**
   * Kiểm tra xem database đã được khởi tạo chưa
   */
  public isReady(): boolean {
    return this.isInitialized && this.db !== null;
  }

  /**
   * Thêm task mới với validation (đồng bộ)
   */
  public addTask(value: string): number {
    console.log("🔄 SQLite addTask called with value:", `"${value}"`);

    if (!this.isReady()) {
      console.error("❌ Database not ready for addTask");
      throw new Error(
        "Database not initialized. Please ensure database is properly initialized before adding tasks."
      );
    }

    const trimmedValue = value.trim();
    console.log("✂️ Trimmed value:", `"${trimmedValue}"`);

    // Enhanced validation
    if (!trimmedValue) {
      console.error("❌ Task value is empty after trim");
      throw new Error("Task value cannot be empty");
    }

    if (trimmedValue.length > 500) {
      console.error("❌ Task value too long:", trimmedValue.length);
      throw new Error("Task value cannot exceed 500 characters");
    }

    if (trimmedValue.length < 1) {
      console.error("❌ Task value too short");
      throw new Error("Task value must be at least 1 character");
    }

    console.log("✅ Task validation passed");

    try {
      console.log("💾 Adding task to database synchronously...");

      // Strategy: Thử các phương pháp insert khác nhau để đảm bảo tương thích
      let result;
      let insertSuccess = false;

      // Method 1: Thử insert với tất cả columns
      try {
        result = this.db!.runSync(
          "INSERT INTO tasks (value, intValue, created_at, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
          [trimmedValue, 0]
        );
        console.log(
          "✅ Method 1: Task added with full timestamps, ID:",
          result.lastInsertRowId
        );
        insertSuccess = true;
      } catch (insertError: any) {
        console.log("⚠️ Method 1 failed:", insertError.message);

        // Method 2: Thử insert với chỉ created_at
        try {
          result = this.db!.runSync(
            "INSERT INTO tasks (value, intValue, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)",
            [trimmedValue, 0]
          );
          console.log(
            "✅ Method 2: Task added with created_at only, ID:",
            result.lastInsertRowId
          );
          insertSuccess = true;
        } catch (insertError2: any) {
          console.log("⚠️ Method 2 failed:", insertError2.message);

          // Method 3: Fallback - insert cơ bản
          try {
            result = this.db!.runSync(
              "INSERT INTO tasks (value, intValue) VALUES (?, ?)",
              [trimmedValue, 0]
            );
            console.log(
              "✅ Method 3: Task added with basic fields only, ID:",
              result.lastInsertRowId
            );
            insertSuccess = true;
          } catch (insertError3: any) {
            console.error(
              "❌ All insert methods failed:",
              insertError3.message
            );
            throw new Error(`Failed to insert task: ${insertError3.message}`);
          }
        }
      }

      if (!insertSuccess || !result) {
        throw new Error("Failed to insert task - no result returned");
      }

      const taskId = result.lastInsertRowId;

      if (!taskId || taskId <= 0) {
        throw new Error("Invalid task ID returned from database");
      }

      // Verify task was actually saved
      console.log("🔍 Verifying task was added...");
      try {
        const verifyTask = this.db!.getFirstSync(
          "SELECT id, value, intValue FROM tasks WHERE id = ?",
          [taskId]
        ) as any;

        if (!verifyTask || verifyTask.id !== taskId) {
          throw new Error(
            "Task verification failed - task not found in database"
          );
        }

        if (verifyTask.value !== trimmedValue) {
          throw new Error(
            "Task verification failed - saved value does not match input"
          );
        }

        console.log("✅ Task verification successful:", {
          id: verifyTask.id,
          value: verifyTask.value,
          intValue: verifyTask.intValue,
        });
      } catch (verifyError: any) {
        console.error("❌ Task verification error:", verifyError.message);
        // Thử xóa task đã insert nhưng failed verification
        try {
          this.db!.runSync("DELETE FROM tasks WHERE id = ?", [taskId]);
          console.log("🗑️ Cleaned up failed task insert");
        } catch (cleanupError) {
          console.error("❌ Failed to cleanup invalid task:", cleanupError);
        }
        throw new Error(
          `Task was inserted but verification failed: ${verifyError.message}`
        );
      }

      console.log(
        `🎉 addTask completed successfully - ID: ${taskId}, Value: "${trimmedValue}"`
      );
      return taskId;
    } catch (error) {
      console.error("❌ Error in addTask:", error);

      // Provide detailed error context
      const errorContext = {
        originalValue: value,
        trimmedValue: trimmedValue,
        valueLength: trimmedValue.length,
        dbReady: this.isReady(),
        errorMessage: error instanceof Error ? error.message : String(error),
      };

      console.error("❌ AddTask error context:", errorContext);

      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Unexpected error adding task: ${String(error)}`);
      }
    }
  }

  /**
   * Lấy tất cả tasks với options sắp xếp (đồng bộ)
   */
  public getAllTasks(options?: { orderBy?: string; order?: string }): Task[] {
    if (!this.isReady()) {
      throw new Error("Database not initialized");
    }

    const { orderBy = "created_at", order = "DESC" } = options || {};

    try {
      // Thử query với orderBy trước, fallback nếu cột không tồn tại
      try {
        const query = `SELECT * FROM tasks ORDER BY ${orderBy} ${order}`;
        const tasks = this.db!.getAllSync(query) as Task[];
        return tasks;
      } catch (queryError: any) {
        if (queryError.message.includes("no such column")) {
          console.log(`⚠️ Column ${orderBy} not found, using id for ordering`);
          const fallbackQuery = `SELECT * FROM tasks ORDER BY id ${order}`;
          const tasks = this.db!.getAllSync(fallbackQuery) as Task[];
          return tasks;
        } else {
          throw queryError;
        }
      }
    } catch (error) {
      console.error("Error getting all tasks:", error);
      throw error;
    }
  }

  /**
   * Cập nhật trạng thái task (đồng bộ)
   */
  public updateTaskStatus(id: number, intValue: number): void {
    if (!this.isReady()) {
      throw new Error("Database not initialized");
    }

    try {
      let result;

      // Thử update với updated_at trước
      try {
        result = this.db!.runSync(
          "UPDATE tasks SET intValue = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
          [intValue, id]
        );
      } catch (updateError: any) {
        if (updateError.message.includes("no such column: updated_at")) {
          // Fallback: update chỉ intValue
          console.log("⚠️ Fallback: updating without updated_at column");
          result = this.db!.runSync(
            "UPDATE tasks SET intValue = ? WHERE id = ?",
            [intValue, id]
          );
        } else {
          throw updateError;
        }
      }

      if (result.changes === 0) {
        throw new Error(`Task with ID ${id} not found`);
      }

      console.log(`✅ Task ${id} status updated to ${intValue}`);
    } catch (error) {
      console.error("❌ Error updating task status:", error);
      throw error;
    }
  }

  /**
   * Xóa task theo ID (đồng bộ)
   */
  public deleteTask(id: number): void {
    if (!this.isReady()) {
      throw new Error("Database not initialized");
    }

    try {
      const result = this.db!.runSync("DELETE FROM tasks WHERE id = ?", [id]);

      if (result.changes === 0) {
        throw new Error(`Task with ID ${id} not found`);
      }

      console.log(`✅ Task ${id} deleted successfully`);
    } catch (error) {
      console.error("❌ Error deleting task:", error);
      throw error;
    }
  }

  /**
   * Đếm tổng số tasks (đồng bộ)
   */
  public getTaskCount(): number {
    if (!this.isReady()) {
      throw new Error("Database not initialized");
    }

    try {
      const result = this.db!.getFirstSync(
        "SELECT COUNT(*) as count FROM tasks"
      ) as { count: number };

      return result.count;
    } catch (error) {
      console.error("❌ Error getting task count:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const taskDatabase = SQLiteDatabase.getInstance({
  databaseName: "test.db",
  version: 1,
});
