import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { initDatabase, getTodos, execSqlAsync } from "../database/db";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState<boolean | null>(null);
  const [todos, setTodos] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");

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

  // 🔹 Thêm mới todo
  const addTodo = async () => {
    if (!title.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tiêu đề công việc!");
      return;
    }
    try {
      await execSqlAsync(
        "INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)",
        [title.trim(), 0, Date.now()]
      );
      setTitle("");
      setModalVisible(false);
      loadTodos();
    } catch (err) {
      console.error("❌ Insert todo error:", err);
    }
  };

  // 🔹 Toggle trạng thái done
  const toggleDone = async (id: number, current: number) => {
    try {
      await execSqlAsync("UPDATE todos SET done = ? WHERE id = ?", [
        current ? 0 : 1,
        id,
      ]);
      loadTodos();
    } catch (err) {
      console.error("❌ Toggle error:", err);
    }
  };

  // 🔹 Xóa todo
  const deleteTodo = async (id: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa công việc này?", [
      { text: "Hủy" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await execSqlAsync("DELETE FROM todos WHERE id = ?", [id]);
            loadTodos();
          } catch (err) {
            console.error("❌ Delete error:", err);
          }
        },
      },
    ]);
  };

  // 🔹 Đồng bộ API (1 lần)
  const syncFromAPI = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=5"
      );
      const data = await response.json();

      for (const item of data) {
        await execSqlAsync(
          "INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)",
          [item.title, item.completed ? 1 : 0, Date.now()]
        );
      }
      Alert.alert("✅ Đồng bộ xong", "Đã thêm 5 bản ghi từ API");
      loadTodos();
    } catch (err) {
      console.error("❌ Sync error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

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
                  <TouchableOpacity
                    onPress={() => toggleDone(item.id, item.done)}
                  >
                    <View style={styles.todoItem}>
                      <Text
                        style={[
                          styles.todoText,
                          item.done ? styles.doneText : null,
                        ]}
                      >
                        {item.title}
                      </Text>
                      <Button title="🗑️" onPress={() => deleteTodo(item.id)} />
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}

            <View style={styles.bottomActions}>
              <Button title="🌐 Đồng bộ API" onPress={syncFromAPI} />
              <Button title="🔄 Tải lại" onPress={loadTodos} />
            </View>

            {/* 🔹 Nút thêm mới */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addText}>＋</Text>
            </TouchableOpacity>

            {/* 🔹 Modal thêm mới */}
            <Modal
              visible={modalVisible}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.modalBox}>
                  <Text style={styles.modalTitle}>Thêm công việc mới</Text>
                  <TextInput
                    placeholder="Nhập tiêu đề..."
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                  />
                  <View style={styles.modalActions}>
                    <Button
                      title="Hủy"
                      onPress={() => setModalVisible(false)}
                    />
                    <Button title="Lưu" onPress={addTodo} />
                  </View>
                </View>
              </View>
            </Modal>
          </>
        ) : (
          <>
            <Text style={{ fontSize: 18, marginBottom: 12 }}>
              ❌ Không thể kết nối DB
            </Text>
            <Button title="Thử lại" onPress={loadTodos} />
          </>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  todoItem: {
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 8,
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  todoText: { fontSize: 16 },
  doneText: { textDecorationLine: "line-through", color: "gray" },
  empty: { fontSize: 16, color: "#777", marginVertical: 12 },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "90%",
    marginVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addButton: {
    position: "absolute",
    right: 25,
    bottom: 25,
    backgroundColor: "#007bff",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
  addText: { color: "#fff", fontSize: 30, fontWeight: "bold" },
});
