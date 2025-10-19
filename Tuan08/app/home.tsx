import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams();
  const [tasks, setTasks] = useState<{ title: string; completed: boolean }[]>(
    []
  );
  const [search, setSearch] = useState("");

  useFocusEffect(
    useCallback(() => {
      const loadTasks = async () => {
        const stored = await AsyncStorage.getItem("tasks");
        if (stored) setTasks(JSON.parse(stored));
      };
      loadTasks();
    }, [])
  );

  const toggleTask = async (index: number) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
    await AsyncStorage.setItem("tasks", JSON.stringify(updated));
  };

  const deleteTask = async (index: number) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
    await AsyncStorage.setItem("tasks", JSON.stringify(updated));
  };

  const filtered = tasks.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
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
          source={{ uri: "https://i.pravatar.cc/100" }}
          style={{ width: 50, height: 50, borderRadius: 25, marginLeft: 15 }}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Hi {name}</Text>
          <Text style={{ color: "gray" }}>Have a grate day ahead</Text>
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
          placeholder="Search"
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
          style={{ flex: 1, paddingVertical: 8, color: "#333" }}
        />
      </View>

      {/* Task List */}
      <FlatList
        data={filtered}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#f5f5f5",
              padding: 14,
              borderRadius: 15,
              marginBottom: 12,
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              onPress={() => toggleTask(index)}
            >
              <Ionicons
                name={item.completed ? "checkbox" : "square-outline"}
                size={22}
                color={item.completed ? "#00BFFF" : "#bbb"}
                style={{ marginRight: 10 }}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: item.completed ? "#777" : "#333",
                  textDecorationLine: item.completed ? "line-through" : "none",
                }}
              >
                {item.title}
              </Text>
            </TouchableOpacity>

            {/* Nút delete & edit */}
            <TouchableOpacity onPress={() => deleteTask(index)}>
              <Ionicons name="trash-outline" size={22} color="#ff4d4d" />
            </TouchableOpacity>
            <Ionicons
              name="create-outline"
              size={22}
              color="#888"
              style={{ marginLeft: 10 }}
            />
          </View>
        )}
      />

      {/* Nút + */}
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 30,
          right: 30,
          backgroundColor: "#00BFFF",
          width: 65,
          height: 65,
          borderRadius: 35,
          justifyContent: "center",
          alignItems: "center",
          elevation: 5,
        }}
        onPress={() => router.push("/add")}
      >
        <Ionicons name="add" size={36} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
