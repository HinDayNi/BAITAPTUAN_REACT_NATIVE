import { Stack } from "expo-router";
import { useEffect } from "react";
import { initDatabase } from "../database/db";

export default function RootLayout() {
  useEffect(() => {
    // Q2: Initialize database when app starts
    initDatabase().catch((err) => {
      console.error("Failed to initialize database:", err);
    });
  }, []);

  return <Stack />;
}
