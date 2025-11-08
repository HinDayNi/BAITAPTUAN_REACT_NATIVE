import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useTodos } from "../hooks/useTodos";

export default function App() {
  const {
    todos,
    loading,
    refreshing,
    searchText,
    setSearchText,
    add,
    edit,
    remove,
    toggleDone,
    importFromAPI,
    onRefresh,
  } = useTodos();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<any | null>(null);
  const [titleInput, setTitleInput] = useState("");

  const openModal = (todo?: any) => {
    if (todo) {
      setEditingTodo(todo);
      setTitleInput(todo.title);
    } else {
      setEditingTodo(null);
      setTitleInput("");
    }
    setModalVisible(true);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>📋 Todo Notes</Text>

        <TextInput
          placeholder="🔍 Tìm kiếm công việc..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#4CAF50" }]}
            onPress={() => openModal()}
            disabled={loading}
          >
            <Text style={styles.buttonText}>➕ Thêm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#2196F3" }]}
            onPress={importFromAPI}
            disabled={loading}
          >
            <Text style={styles.buttonText}>🌐 Đồng bộ</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={{ marginTop: 8 }}>Đang tải dữ liệu...</Text>
          </View>
        ) : todos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>✨</Text>
            <Text style={styles.emptyText}>Chưa có công việc nào!</Text>
          </View>
        ) : (
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id.toString()}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{ paddingBottom: 80 }}
            renderItem={({ item }) => (
              <View style={styles.todoItem}>
                <TouchableOpacity
                  onPress={() => toggleDone(item.id, item.done)}
                  style={[
                    styles.doneBox,
                    item.done ? styles.doneChecked : styles.doneUnchecked,
                  ]}
                >
                  {item.done ? <Text>✅</Text> : <Text>⬜</Text>}
                </TouchableOpacity>

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

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    onPress={() => openModal(item)}
                    style={styles.editButton}
                  >
                    <Text style={styles.editText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => remove(item.id)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteText}>🗑</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}

        {/* Modal thêm/sửa */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {editingTodo ? "✏️ Sửa công việc" : "➕ Thêm công việc"}
              </Text>

              <TextInput
                placeholder="Nhập tiêu đề công việc..."
                value={titleInput}
                onChangeText={setTitleInput}
                style={styles.input}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: "#4CAF50" }]}
                  onPress={() => {
                    editingTodo
                      ? edit(editingTodo.id, titleInput)
                      : add(titleInput);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalBtnText}>💾 Lưu</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: "#999" }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalBtnText}>❌ Đóng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: "white",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  actionButton: {
    flex: 0.48,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  doneBox: {
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 28,
  },
  doneChecked: {
    opacity: 0.8,
  },
  doneUnchecked: {
    opacity: 0.4,
  },
  todoText: {
    fontSize: 16,
    color: "#333",
  },
  doneText: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  deleteButton: {
    backgroundColor: "#E53935",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  deleteText: {
    color: "white",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
    marginTop: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalBtn: {
    flex: 0.48,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  modalBtnText: {
    color: "white",
    fontWeight: "bold",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: "#FFC107",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 6,
  },
  editText: {
    color: "white",
    fontSize: 16,
  },
});
