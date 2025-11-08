import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  RefreshControl,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import {
  initDatabase,
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  openDB,
} from "../database/db";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState<boolean | null>(null);
  const [todos, setTodos] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<any | null>(null);
  const [titleInput, setTitleInput] = useState("");

  // ====================== LOAD TODOS ======================
  const loadTodos = useCallback(async () => {
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
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // ====================== PULL-TO-REFRESH ======================
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTodos();
  }, [loadTodos]);

  // ====================== MODAL: ADD / EDIT ======================
  const openModal = useCallback((todo?: any) => {
    if (todo) {
      setEditingTodo(todo);
      setTitleInput(todo.title);
    } else {
      setEditingTodo(null);
      setTitleInput("");
    }
    setModalVisible(true);
  }, []);

  const handleSave = useCallback(async () => {
    if (!titleInput.trim()) {
      Alert.alert("⚠️ Lỗi", "Vui lòng nhập tiêu đề công việc!");
      return;
    }
    try {
      if (editingTodo) {
        await updateTodo({ ...editingTodo, title: titleInput });
      } else {
        await addTodo(titleInput);
      }
      setModalVisible(false);
      await loadTodos();
    } catch (e) {
      console.error("❌ Save error:", e);
    }
  }, [editingTodo, titleInput, loadTodos]);

  // ====================== DELETE ======================
  const handleDelete = useCallback(
    (id: number) => {
      Alert.alert("Xác nhận xóa", "Bạn có chắc muốn xóa công việc này không?", [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTodo(id);
              await loadTodos();
            } catch (e) {
              console.error("❌ Delete error:", e);
            }
          },
        },
      ]);
    },
    [loadTodos]
  );

  // ====================== SEARCH FILTER ======================
  const filteredTodos = useMemo(() => {
    if (!search.trim()) return todos;
    const lower = search.toLowerCase();
    return todos.filter((t) => t.title.toLowerCase().includes(lower));
  }, [todos, search]);

  // ====================== FETCH + MERGE API ======================
  const syncFromApi = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://jsonplaceholder.typicode.com/todos?_limit=10"
      );
      const apiTodos = res.data.map((t: any) => ({
        title: t.title,
        done: t.completed ? 1 : 0,
        created_at: Date.now(),
      }));

      const db = await openDB();

      for (const todo of apiTodos) {
        const existing = await db.getFirstAsync<{ count: number }>(
          "SELECT COUNT(*) as count FROM todos WHERE title = ?",
          [todo.title]
        );
        if (!existing || existing.count === 0) {
          await db.runAsync(
            "INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)",
            [todo.title, todo.done, todo.created_at]
          );
        }
      }

      Alert.alert("✅ Thành công", "Đã đồng bộ dữ liệu từ API!");
      await loadTodos();
    } catch (e) {
      console.error("❌ Sync error:", e);
      Alert.alert("❌ Lỗi", "Không thể kết nối hoặc đồng bộ dữ liệu từ API!");
    } finally {
      setLoading(false);
    }
  }, [loadTodos]);

  // ====================== UI ======================
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

            {/* 🔍 Ô tìm kiếm */}
            <TextInput
              style={styles.searchInput}
              placeholder="🔍 Tìm kiếm công việc..."
              value={search}
              onChangeText={setSearch}
            />

            {/* 🔘 Thêm + Đồng bộ */}
            <View style={styles.buttonRow}>
              <Button title="➕ Thêm" onPress={() => openModal()} />
              <Button title="🌐 Đồng bộ API" onPress={syncFromApi} />
            </View>

            {/* 🔹 Danh sách công việc */}
            {filteredTodos.length === 0 ? (
              <Text style={styles.empty}>Không có kết quả phù hợp</Text>
            ) : (
              <FlatList
                data={filteredTodos}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                renderItem={({ item }) => (
                  <View style={styles.todoItem}>
                    <TouchableOpacity
                      onPress={() => openModal(item)}
                      style={{ flex: 1 }}
                    >
                      <Text
                        style={[
                          styles.todoText,
                          item.done ? styles.doneText : null,
                        ]}
                      >
                        {item.title}
                      </Text>
                    </TouchableOpacity>
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

            {/* 🪄 Modal thêm/sửa */}
            <Modal visible={modalVisible} transparent animationType="slide">
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>
                    {editingTodo ? "✏️ Sửa công việc" : "➕ Thêm công việc"}
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập tiêu đề công việc..."
                    value={titleInput}
                    onChangeText={setTitleInput}
                  />
                  <View style={styles.modalButtons}>
                    <Button title="💾 Lưu" onPress={handleSave} />
                    <Button
                      title="❌ Đóng"
                      onPress={() => setModalVisible(false)}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          </>
        ) : (
          <Text>❌ Không thể kết nối DB</Text>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ====================== STYLE ======================
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  searchInput: {
    width: "90%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginBottom: 10,
  },
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
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-around" },
});
