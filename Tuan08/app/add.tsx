import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";

export default function AddTaskScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams();
  const [job, setJob] = useState("");

  const handleAdd = async () => {
    if (!job.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập công việc!");
      return;
    }

    try {
      const db = await SQLite.openDatabaseAsync("test.db");
      await db.runAsync(
        "INSERT INTO tasks (value, intValue) VALUES (?, ?)",
        job.trim(),
        0
      );
      router.back();
    } catch (error) {
      console.error("Error adding task:", error);
      Alert.alert("Lỗi", "Không thể thêm công việc!");
    }
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
          <Text style={{ color: "gray" }}>Have a grate day ahead</Text>
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
          style={{ flex: 1, paddingVertical: 10, color: "#333" }}
        />
      </View>

      {/* Finish Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#00BFFF",
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 30,
        }}
        onPress={handleAdd}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>FINISH ➜</Text>
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
