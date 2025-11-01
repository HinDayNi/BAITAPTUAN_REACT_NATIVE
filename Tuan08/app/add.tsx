import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { taskDatabase } from "../database/db";
export default function AddTaskScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams();
  const [job, setJob] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = () => {
    const trimmedJob = job.trim();

    // Enhanced validation
    if (!trimmedJob) {
      Alert.alert("Lỗi", "Vui lòng nhập công việc!");
      return;
    }

    if (trimmedJob.length > 500) {
      Alert.alert("Lỗi", "Công việc không được vượt quá 500 ký tự!");
      return;
    }

    console.log("🚀 Starting handleAdd with job:", trimmedJob);
    setIsLoading(true);

    // Thêm timeout để tránh UI bị khóa
    setTimeout(() => {
      try {
        console.log("🔍 Checking if database is ready...");

        // Khởi tạo database nếu chưa sẵn sàng (đồng bộ)
        if (!taskDatabase.isReady()) {
          console.log("⚡ Initializing database synchronously...");
          taskDatabase.initialize();
          console.log("✅ Database initialized");
        } else {
          console.log("✅ Database already ready");
        }

        console.log("💾 Adding task to database synchronously...");
        const taskId = taskDatabase.addTask(trimmedJob);
        console.log("✅ Task added successfully with ID:", taskId);

        // Verify task was added (đồng bộ)
        const count = taskDatabase.getTaskCount();
        console.log("📊 Total tasks after adding:", count);

        setIsLoading(false);

        // Thông báo thành công
        Alert.alert(
          "Thành công! ✅",
          `Đã thêm công việc:\n"${trimmedJob}"\n\nID: ${taskId}\nTổng số: ${count} công việc`,
          [
            {
              text: "OK",
              onPress: () => {
                setJob(""); // Reset form
                router.back();
              },
            },
          ]
        );
      } catch (error) {
        setIsLoading(false);

        console.error("❌ Error adding task:", error);
        console.error("Error details:", {
          message: error instanceof Error ? error.message : "Unknown error",
          type: typeof error,
          error: error,
          stack: error instanceof Error ? error.stack : "No stack trace",
        });

        // Xử lý các loại lỗi khác nhau với thông báo chi tiết
        let errorMessage = "Không thể thêm công việc! Chi tiết lỗi:\n\n";

        if (error instanceof Error) {
          if (error.message.includes("Database not initialized")) {
            errorMessage += "Lỗi khởi tạo cơ sở dữ liệu. Vui lòng thử lại.";
          } else if (error.message.includes("cannot be empty")) {
            errorMessage += "Công việc không được để trống!";
          } else if (error.message.includes("cannot exceed")) {
            errorMessage += "Công việc không được vượt quá 500 ký tự!";
          } else if (error.message.includes("already exists")) {
            errorMessage += "Công việc này đã tồn tại!";
          } else {
            errorMessage += `Lỗi: ${error.message}`;
          }
        } else {
          errorMessage += "Lỗi không xác định. Vui lòng thử lại.";
        }

        Alert.alert("Lỗi ❌", errorMessage, [
          {
            text: "Thử lại",
            onPress: () => {
              // Không làm gì, để user thử lại
            },
          },
          {
            text: "Hủy",
            style: "cancel",
          },
        ]);
      }
    }, 100); // Delay ngắn để UI được cập nhật trước
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      {/* Header */}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 30 }}
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

      {/* Title */}
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
        ADD YOUR JOB
      </Text>

      {/* Input */}
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
          name="document-text-outline"
          size={20}
          color="#aaa"
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder="Input your job"
          placeholderTextColor="#aaa"
          value={job}
          onChangeText={setJob}
          editable={!isLoading}
          multiline={false}
          style={{
            flex: 1,
            paddingVertical: 10,
            color: isLoading ? "#ccc" : "#333",
          }}
        />
      </View>

      {/* Character Count */}
      <Text
        style={{
          textAlign: "right",
          color: job.length > 500 ? "red" : "#666",
          fontSize: 12,
          marginBottom: 10,
        }}
      >
        {job.length}/500 ký tự
      </Text>

      {/* Finish Button */}
      <TouchableOpacity
        style={{
          backgroundColor: isLoading || !job.trim() ? "#ccc" : "#00BFFF",
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 30,
          flexDirection: "row",
          justifyContent: "center",
          opacity: isLoading || !job.trim() ? 0.6 : 1,
        }}
        onPress={handleAdd}
        disabled={isLoading || !job.trim()}
      >
        {isLoading && (
          <ActivityIndicator
            size="small"
            color="#fff"
            style={{ marginRight: 8 }}
          />
        )}
        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
          {isLoading ? "ĐANG THÊM ĐỒNG BỘ..." : "THÊM ĐỒNG BỘ ➜"}
        </Text>
      </TouchableOpacity>

      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/2921/2921222.png",
        }}
        style={{
          width: 160,
          height: 160,
          alignSelf: "center",
          marginTop: 40,
        }}
      />
    </View>
  );
}
