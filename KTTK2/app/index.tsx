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
      loadTodos(); // Refresh lại danh sách
    } catch (err) {
      console.error("❌ Insert todo error:", err);
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
            <Text style={{ marginTop: 12 }}>Đang kiểm tra kết nối DB...</Text>
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
                  </View>
                )}
              />
            )}

            <Button title="🔄 Tải lại" onPress={loadTodos} />

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
  },
  todoText: { fontSize: 16 },
  doneText: { textDecorationLine: "line-through", color: "gray" },
  empty: { fontSize: 16, color: "#777", marginVertical: 12 },

  // Modal
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

  // Nút thêm
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
