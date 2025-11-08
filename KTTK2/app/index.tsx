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
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  initDatabase,
  getTodos,
  deleteTodo,
  updateTodoTitle,
  execSqlAsync, // dùng để insert khi add
} from "../database/db";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState<boolean | null>(null);
  const [todos, setTodos] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  // Modal state (dùng chung cho Add + Edit)
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitleValue, setModalTitleValue] = useState("");
  const [editId, setEditId] = useState<number | null>(null); // null -> add mode

  // Load todos
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
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // Delete with confirm
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

  // Open add modal
  const openAddModal = () => {
    setEditId(null);
    setModalTitleValue("");
    setModalVisible(true);
  };

  // Open edit modal
  const openEditModal = (item: any) => {
    setEditId(item.id);
    setModalTitleValue(item.title);
    setModalVisible(true);
  };

  // Save (add or edit)
  const handleSaveModal = async () => {
    if (!modalTitleValue.trim()) {
      Alert.alert("Lỗi", "Tiêu đề không được để trống!");
      return;
    }
    try {
      if (editId === null) {
        // add
        await execSqlAsync(
          "INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)",
          [modalTitleValue.trim(), 0, Date.now()]
        );
      } else {
        // update
        await updateTodoTitle(editId, modalTitleValue.trim());
      }
      setModalVisible(false);
      setModalTitleValue("");
      setEditId(null);
      await loadTodos();
    } catch (e) {
      console.error("❌ Save modal error:", e);
      Alert.alert("Lỗi", "Lưu không thành công. Xem console.");
    }
  };

  // Real-time filter
  const filteredTodos = useMemo(() => {
    if (!search.trim()) return todos;
    const lower = search.toLowerCase();
    return todos.filter((t) => t.title.toLowerCase().includes(lower));
  }, [todos, search]);

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

            {/* Search */}
            <TextInput
              style={styles.searchInput}
              placeholder="🔍 Tìm kiếm công việc..."
              value={search}
              onChangeText={setSearch}
            />

            {filteredTodos.length === 0 ? (
              <Text style={styles.empty}>Không có kết quả phù hợp</Text>
            ) : (
              <FlatList
                data={filteredTodos}
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

                    <View style={styles.actions}>
                      <TouchableOpacity
                        onPress={() => openEditModal(item)}
                        style={[
                          styles.actionButton,
                          { backgroundColor: "#1976D2" },
                        ]}
                      >
                        <Text style={{ color: "white" }}>Sửa</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleDelete(item.id)}
                        style={[
                          styles.actionButton,
                          { backgroundColor: "#D32F2F" },
                        ]}
                      >
                        <Text style={{ color: "white" }}>Xóa</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            )}

            <View style={{ height: 16 }} />

            <Button title="🔄 Tải lại" onPress={loadTodos} />

            {/* Floating Add Button */}
            <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
              <Text style={styles.addText}>＋</Text>
            </TouchableOpacity>

            {/* Shared Modal (Add / Edit) */}
            <Modal visible={modalVisible} animationType="slide" transparent>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>
                    {editId === null ? "🆕 Thêm công việc" : "✏️ Sửa công việc"}
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={modalTitleValue}
                    onChangeText={setModalTitleValue}
                    placeholder="Nhập tiêu đề..."
                    autoFocus
                  />
                  <View style={{ flexDirection: "row", marginTop: 8 }}>
                    <View style={{ flex: 1, marginRight: 6 }}>
                      <Button title="Lưu" onPress={handleSaveModal} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 6 }}>
                      <Button
                        title="Hủy"
                        color="gray"
                        onPress={() => {
                          setModalVisible(false);
                          setEditId(null);
                          setModalTitleValue("");
                        }}
                      />
                    </View>
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
  todoText: { fontSize: 16, flex: 1 },
  doneText: { textDecorationLine: "line-through", color: "gray" },
  empty: { fontSize: 16, color: "#777", marginVertical: 12 },
  actions: { flexDirection: "row", gap: 8 },
  actionButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },

  // Floating add button
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 26,
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
    elevation: 6,
  },
  addText: { color: "#fff", fontSize: 30, fontWeight: "bold" },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "86%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 18,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    borderRadius: 8,
    padding: 10,
  },
});
