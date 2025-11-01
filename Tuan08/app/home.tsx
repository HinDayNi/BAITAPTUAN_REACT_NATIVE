import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { taskDatabase, Task } from "../database/db";

export default function HomeScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks từ database đồng bộ
  const loadTasks = useCallback(() => {
    try {
      setIsLoading(true);
      console.log("📖 Loading tasks...");

      // Đảm bảo database được khởi tạo
      if (!taskDatabase.isReady()) {
        console.log("⚡ Initializing database...");
        taskDatabase.initialize();
      }

      const allTasks = taskDatabase.getAllTasks();

      setTasks(allTasks);
      console.log(`✅ Loaded ${allTasks.length} tasks`);
    } catch (error) {
      console.error("❌ Error loading tasks:", error);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Toggle task status đồng bộ
  const toggleTask = (id: number, currentValue: number) => {
    try {
      console.log(
        `🔄 Toggling task ${id} from ${currentValue} to ${
          currentValue === 1 ? 0 : 1
        }`
      );

      const newValue = currentValue === 1 ? 0 : 1;
      taskDatabase.updateTaskStatus(id, newValue);

      // Reload tasks để cập nhật UI
      loadTasks();

      console.log(`✅ Task ${id} toggled successfully`);
    } catch (error) {
      console.error("❌ Error toggling task:", error);
    }
  };

  // Delete task đồng bộ
  const deleteTask = (id: number) => {
    try {
      console.log(`🗑️ Deleting task ${id}...`);

      taskDatabase.deleteTask(id);

      // Reload tasks để cập nhật UI
      loadTasks();

      console.log(`✅ Task ${id} deleted successfully`);
    } catch (error) {
      console.error("❌ Error deleting task:", error);
    }
  };

  // Filter tasks theo search
  const filtered = tasks.filter((task) =>
    task.value.toLowerCase().includes(search.toLowerCase())
  );

  // Load tasks khi screen focus
  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      {/* Header */}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#000" />
        </TouchableOpacity>
        <Image
          source={{ uri: "https://i.pravatar.cc/100?img=12" }}
          style={{ width: 50, height: 50, borderRadius: 25, marginLeft: 15 }}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Hi {name}</Text>
          <Text style={{ color: "gray" }}>Have a great day ahead</Text>
        </View>
      </View>

      {/* Search */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          paddingHorizontal: 10,
          marginBottom: 20,
        }}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color="#999"
          style={{ marginRight: 6 }}
        />
        <TextInput
          placeholder="Search tasks..."
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
          style={{ flex: 1, paddingVertical: 8, color: "#333" }}
        />
      </View>

      {/* Task Statistics */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 15,
          paddingHorizontal: 10,
        }}
      >
        <Text style={{ color: "#666", fontSize: 14 }}>
          Total: {tasks.length}
        </Text>
        <Text style={{ color: "#666", fontSize: 14 }}>
          Completed: {tasks.filter((t) => t.intValue === 1).length}
        </Text>
        <Text style={{ color: "#666", fontSize: 14 }}>
          Pending: {tasks.filter((t) => t.intValue === 0).length}
        </Text>
      </View>

      {/* Task List */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 50,
            }}
          >
            <Text style={{ color: "#666", fontSize: 16 }}>
              📖 Đang tải danh sách công việc...
            </Text>
          </View>
        ) : filtered.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 50,
            }}
          >
            <Ionicons name="clipboard-outline" size={64} color="#ccc" />
            <Text style={{ color: "#666", fontSize: 16, marginTop: 10 }}>
              {search
                ? "Không tìm thấy công việc nào"
                : "Chưa có công việc nào"}
            </Text>
            <Text style={{ color: "#999", fontSize: 14, marginTop: 5 }}>
              {search ? "Thử từ khóa khác" : "Nhấn nút + để thêm công việc mới"}
            </Text>
          </View>
        ) : (
          filtered.map((task) => (
            <View
              key={task.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: task.intValue === 1 ? "#f0f9ff" : "#f5f5f5",
                padding: 14,
                borderRadius: 15,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: task.intValue === 1 ? "#bfdbfe" : "#e5e5e5",
              }}
            >
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
                onPress={() => toggleTask(task.id, task.intValue)}
              >
                <Ionicons
                  name={
                    task.intValue === 1 ? "checkmark-circle" : "ellipse-outline"
                  }
                  size={24}
                  color={task.intValue === 1 ? "#10b981" : "#6b7280"}
                  style={{ marginRight: 12 }}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: task.intValue === 1 ? "#374151" : "#111827",
                      textDecorationLine:
                        task.intValue === 1 ? "line-through" : "none",
                      fontWeight: task.intValue === 1 ? "normal" : "500",
                    }}
                  >
                    {task.value}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#9ca3af",
                      marginTop: 2,
                    }}
                  >
                    ID: {task.id}
                    {task.created_at
                      ? " • " + new Date(task.created_at).toLocaleDateString()
                      : ""}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Action Buttons */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => deleteTask(task.id)}
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: "#fef2f2",
                  }}
                >
                  <Ionicons name="trash-outline" size={18} color="#dc2626" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
          backgroundColor: "#3b82f6",
          width: 65,
          height: 65,
          borderRadius: 35,
          justifyContent: "center",
          alignItems: "center",
          elevation: 8,
          shadowColor: "#3b82f6",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        }}
        onPress={() => (router as any).push("/add", { name })}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
