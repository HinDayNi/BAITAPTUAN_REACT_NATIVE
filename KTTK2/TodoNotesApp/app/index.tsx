import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  SafeAreaView,
} from "react-native";
import { getAllTodos, insertTodo } from "@/utils/db";

interface Todo {
  id: number;
  title: string;
  done: number;
  created_at: number;
}

export default function TodoListScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch todos from database
  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await getAllTodos();
      setTodos(data);
    } catch (error) {
      console.error("Error loading todos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle add new todo
  const handleAddTodo = async () => {
    if (!newTodoTitle.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tiêu đề công việc");
      return;
    }

    try {
      setSubmitting(true);
      await insertTodo(newTodoTitle.trim());
      setNewTodoTitle("");
      setModalVisible(false);
      await loadTodos();
      Alert.alert("Thành công", "Công việc đã được thêm");
    } catch (error) {
      console.error("Error adding todo:", error);
      Alert.alert("Lỗi", "Không thể thêm công việc");
    } finally {
      setSubmitting(false);
    }
  };

  // Load todos on mount
  useEffect(() => {
    loadTodos();
  }, []);

  // Render empty state
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (todos.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>📝 Chưa có việc nào</Text>
        <Text style={styles.emptySubtext}>Nhấn nút + để thêm công việc</Text>
      </View>
    );
  }

  // Render todo item
  const renderTodoItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoItem}>
      <View style={styles.todoContent}>
        <View style={[styles.checkbox, item.done === 1 && styles.checkboxDone]}>
          {item.done === 1 && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text
          style={[styles.todoTitle, item.done === 1 && styles.todoTitleDone]}
        >
          {item.title}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Todo Notes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTodoItem}
        contentContainerStyle={styles.listContent}
      />

      {/* Add Todo Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm công việc mới</Text>

            <TextInput
              style={styles.input}
              placeholder="Nhập tiêu đề công việc..."
              value={newTodoTitle}
              onChangeText={setNewTodoTitle}
              editable={!submitting}
            />

            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setNewTodoTitle("");
                  setModalVisible(false);
                }}
                disabled={submitting}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.submitButton,
                  submitting && styles.disabledButton,
                ]}
                onPress={handleAddTodo}
                disabled={submitting}
              >
                <Text style={styles.submitButtonText}>
                  {submitting ? "Đang thêm..." : "Thêm"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#0066cc",
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  addButton: {
    backgroundColor: "#ff6b6b",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  listContent: {
    padding: 16,
  },
  todoItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  todoContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxDone: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },
  checkmark: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  todoTitle: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  todoTitleDone: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  emptyText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 60,
    color: "#333",
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
    color: "#999",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#4caf50",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
