import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { initDatabase, getTodos, deleteTodo } from "../database/db";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState<boolean | null>(null);
  const [todos, setTodos] = useState<any[]>([]);

  // 🔹 Load danh sách todos
  const loadTodos = async () => {
    try {
      await initDatabase();
      const data = await getTodos();
      setTodos(data);
      setOk(true);
    } catch (e) {
      console.error("❌ Load todos error:", e);
      setOk(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  // 🔹 Xử lý xóa với xác nhận
  const handleDelete = (id: number) => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc muốn xóa công việc này không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTodo(id);
            await loadTodos(); // Refresh danh sách
          } catch (e) {
            console.error("❌ Delete error:", e);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {loading ? (
          <>
            <ActivityIndicator />
            <Text style={{ marginTop: 12 }}>Đang tải dữ liệu...</Text>
          </>
        ) : ok ? (
          <>
            <Text style={styles.title}>📋 Danh sách công việc</Text>

            {todos.length === 0 ? (
              <Text style={styles.empty}>Chưa có việc nào</Text>
            ) : (
              <FlatList
                data={todos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.todoItem}>
                    <Text
                      style={[
                        styles.todoText,
                        item.done ? styles.doneText : null,
                      ]}
                    >
                      {item.title}
                    </Text>

                    {/* 🔹 Nút xóa */}
                    <TouchableOpacity
                      onPress={() => handleDelete(item.id)}
                      style={styles.deleteButton}
                    >
                      <Text style={{ color: "white" }}>Xóa</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}

            <Button title="🔄 Tải lại" onPress={loadTodos} />
          </>
        ) : (
          <Text>❌ Không thể kết nối DB</Text>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  todoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 8,
    width: "90%",
  },
  todoText: { fontSize: 16 },
  doneText: { textDecorationLine: "line-through", color: "gray" },
  empty: { fontSize: 16, color: "#777", marginVertical: 12 },
  deleteButton: {
    backgroundColor: "red",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
});
