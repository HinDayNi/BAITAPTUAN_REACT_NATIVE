import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getDB, initDB } from "../database/db"; // import file db.ts

export default function Index() {
  const [todos, setTodos] = useState([]);

  const loadTodos = () => {
    try {
      const db = getDB();
      const results = db.getAllAsync("SELECT * FROM todos ORDER BY id DESC;");
      setTodos(results);
    } catch (error) {
      console.error("Error loading todos:", error);
    }
  };

  useEffect(() => {
    initDB();
    loadTodos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Danh sách công việc</Text>

      {todos.length === 0 ? (
        <Text style={styles.empty}>Chưa có việc nào</Text>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }: { item: any }) => (
            <Text style={[styles.item, item.done ? styles.done : null]}>
              {item.title}
            </Text>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  item: { fontSize: 18, paddingVertical: 6 },
  done: { textDecorationLine: "line-through", color: "gray" },
  empty: { color: "gray", fontStyle: "italic" },
});
