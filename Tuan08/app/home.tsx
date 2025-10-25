import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useRouter,
  useLocalSearchParams,
  useFocusEffect,
  router,
} from "expo-router";
import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";
import {
  SQLiteProvider,
  useSQLiteContext,
  type SQLiteDatabase,
} from "expo-sqlite";

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
    <View style={styles.container}>
      <SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded}>
        <Content />
      </SQLiteProvider>
    </View>
  );
}
interface Todo {
  value: string;
  intValue: number;
}

export function Content() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { name } = useLocalSearchParams();
  const [tasks, setTasks] = useState<Todo[]>([]);

  const [search, setSearch] = useState("");

  const loadTasks = async () => {
    try {
      const result = await db.getAllAsync<Todo>("SELECT * FROM todos");
      setTasks(result);
    } catch (error) {
      console.error("Error loading todos:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const toggleTask = async (id: number, currentValue: number) => {
    try {
      await db.runAsync(
        "UPDATE todos SET intValue = ? WHERE id = ?",
        currentValue === 1 ? 0 : 1,
        id
      );
      loadTasks();
    } catch (error) {
      console.error("Error toggling task:", error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await db.runAsync("DELETE FROM todos WHERE id = ?", id);
      loadTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const filtered = tasks.filter((t) =>
    t.value.toLowerCase().includes(search.toLowerCase())
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
          placeholder="Search"
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
          style={{ flex: 1, paddingVertical: 8, color: "#333" }}
        />
      </View>

      {/* Task List */}
      <ScrollView style={{ flex: 1 }}>
        {filtered.map((task) => (
          <View
            key={task.id}
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
              onPress={() => toggleTask(task.id, task.intValue)}
            >
              <Ionicons
                name={task.intValue === 1 ? "checkbox" : "square-outline"}
                size={22}
                color={task.intValue === 1 ? "#00BFFF" : "#bbb"}
                style={{ marginRight: 10 }}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: task.intValue === 1 ? "#777" : "#333",
                  textDecorationLine:
                    task.intValue === 1 ? "line-through" : "none",
                }}
              >
                {task.value}
              </Text>
            </TouchableOpacity>

            {/* Nút delete & edit */}
            <TouchableOpacity onPress={() => deleteTask(task.id)}>
              <Ionicons name="trash-outline" size={22} color="#ff4d4d" />
            </TouchableOpacity>
            <Ionicons
              name="create-outline"
              size={22}
              color="#888"
              style={{ marginLeft: 10 }}
            />
          </View>
        ))}
      </ScrollView>

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
        onPress={() => router.push({ pathname: "/add", params: { name } })}
      >
        <Ionicons name="add" size={36} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  let { user_version: currentDbVersion } = await db.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version");
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }
  if (currentDbVersion === 0) {
    await db.execAsync(`
PRAGMA journal_mode = 'wal';
CREATE TABLE tasks (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
`);
    await db.runAsync(
      "INSERT INTO tasks (value, intValue) VALUES (?, ?)",
      "hello",
      1
    );
    await db.runAsync(
      "INSERT INTO tasks (value, intValue) VALUES (?, ?)",
      "world",
      2
    );
    currentDbVersion = 1;
  }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
};
