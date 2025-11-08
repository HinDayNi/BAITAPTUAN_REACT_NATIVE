import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("todo_notes.db");

export function execSqlAsync(sql: string, params: (string | number)[] = []) {
  return new Promise((resolve, reject) => {
    db.withTransactionAsync(async () => {
      try {
        const result = await (db as any).execAsync(sql, params);
        resolve(result);
      } catch (err) {
        reject(err);
        throw err;
      }
    }).catch((err: any) => reject(err));
  });
}

export async function testConnection() {
  try {
    await execSqlAsync("SELECT 1;");
    console.log("✅ SQLite connected successfully");
    return true;
  } catch (e) {
    console.error("❌ DB connection failed:", e);
    return false;
  }
}

export { db };
