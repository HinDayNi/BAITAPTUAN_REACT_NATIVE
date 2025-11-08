import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  initDatabase,
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  execSqlAsync,
} from "../database/db";

export function useTodos() {
  const [todos, setTodos] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 🔹 Load todos
  const loadTodos = useCallback(async () => {
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (e) {
      console.error("❌ Load todos error:", e);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await initDatabase();
      await loadTodos();
    })();
  }, [loadTodos]);

  // 🔹 Thêm mới
  const add = useCallback(
    async (title: string) => {
      if (!title.trim()) return;
      await addTodo(title.trim());
      await loadTodos();
    },
    [loadTodos]
  );

  // 🔹 Chỉnh sửa
  const edit = useCallback(
    async (id: number, newTitle: string) => {
      await updateTodo({ id, title: newTitle });
      await loadTodos();
    },
    [loadTodos]
  );

  // 🔹 Toggle done
  const toggleDone = useCallback(
    async (id: number, done: number) => {
      await updateTodo({ id, done: done === 0 ? 1 : 0 });
      await loadTodos();
    },
    [loadTodos]
  );

  // 🔹 Xóa
  const remove = useCallback(
    async (id: number) => {
      await deleteTodo(id);
      await loadTodos();
    },
    [loadTodos]
  );

  // 🔹 Đồng bộ API
  const importFromAPI = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://jsonplaceholder.typicode.com/todos?_limit=10"
      );
      const apiTodos = res.data;

      for (const item of apiTodos) {
        const exists = todos.find((t) => t.title === item.title);
        if (!exists) {
          await execSqlAsync(
            "INSERT INTO todos (title, done, created_at) VALUES (?, ?, ?)",
            [item.title, item.completed ? 1 : 0, Date.now()]
          );
        }
      }
      await loadTodos();
    } catch {
      alert("❌ Lỗi đồng bộ API!");
    } finally {
      setLoading(false);
    }
  }, [todos, loadTodos]);

  // 🔹 Refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTodos();
    setRefreshing(false);
  }, [loadTodos]);

  // 🔹 Filter
  const filtered = todos.filter((t) =>
    t.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return {
    todos: filtered,
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
  };
}
