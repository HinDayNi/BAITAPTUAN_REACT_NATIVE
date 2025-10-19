import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function IndexScreen() {
  const router = useRouter();
  const [name, setName] = useState("");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          color: "#7B68EE",
          marginBottom: 40,
        }}
      >
        MANAGE YOUR TASK
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 10,
          width: "75%",
          paddingHorizontal: 12,
          marginBottom: 30,
        }}
      >
        <Ionicons
          name="mail-outline"
          size={20}
          color="#aaa"
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder="Enter your name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
          style={{ flex: 1, paddingVertical: 10, color: "#333" }}
        />
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "#00BFFF",
          paddingHorizontal: 40,
          paddingVertical: 14,
          borderRadius: 10,
        }}
        onPress={() => router.push({ pathname: "/home", params: { name } })}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          GET STARTED ➜
        </Text>
      </TouchableOpacity>
    </View>
  );
}
