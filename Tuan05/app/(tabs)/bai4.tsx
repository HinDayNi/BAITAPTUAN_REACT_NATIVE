import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Bai4() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const goBack = () => {
    router.back();
  };

  // Lấy dữ liệu từ API: https://mockapi.io/
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://68d7245ac2a1754b426cb505.mockapi.io/users"
      );

      if (!response.ok) {
        throw new Error("Không thể tải dữ liệu từ server");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Mỗi item: hiển thị name (in đậm) và email
  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
    </View>
  );

  // Trong lúc đang tải dữ liệu: hiển thị ActivityIndicator
  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={goBack} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Bài 4: Horizontal List</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#9C27B0" />
            <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Sau khi tải xong: hiển thị danh sách dạng ngang (HorizontalList)
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Bài 4: Horizontal List ({users.length})
          </Text>
          <TouchableOpacity onPress={fetchUsers} style={styles.refreshButton}>
            <Feather name="refresh-cw" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Danh sách User dạng HorizontalList</Text>
          <Text style={styles.subtitle}>Danh sách ngang - Cuộn ngang →</Text>

          <FlatList
            data={users}
            renderItem={renderUser}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3e5f5",
  },
  header: {
    backgroundColor: "#9C27B0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  refreshButton: {
    padding: 4,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#4A148C",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#7B1FA2",
    fontStyle: "italic",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#7B1FA2",
    fontWeight: "500",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  userItem: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 8,
    borderRadius: 12,
    minWidth: 200,
    maxWidth: 250,
    borderWidth: 2,
    borderColor: "#CE93D8",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold", // name (in đậm)
    color: "#4A148C",
    marginBottom: 8,
    textAlign: "center",
  },
  userEmail: {
    fontSize: 14,
    color: "#7B1FA2",
    textAlign: "center",
    lineHeight: 20,
  },
});
