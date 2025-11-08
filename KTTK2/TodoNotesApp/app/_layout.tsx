import { Stack } from "expo-router";
import { useEffect } from "react";
import { initDatabase, createTodosTable, seedTodos } from "@/utils/db";

export default function RootLayout() {
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        // Initialize database connection
        await initDatabase();
        // Create todos table if not exists
        await createTodosTable();
        // Seed sample data if empty
        await seedTodos();
        console.log("✓ Database setup completed");
      } catch (error) {
        console.error("✗ Failed to setup database:", error);
      }
    };

    setupDatabase();
  }, []);

  return <Stack />;
}
