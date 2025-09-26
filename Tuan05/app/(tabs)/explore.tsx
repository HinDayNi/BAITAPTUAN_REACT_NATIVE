import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Explore() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch users from MockAPI
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

  // Navigation functions
  const goToHome = () => {
    router.push("/(tabs)");
  };

  const goToShop = () => {
    router.push("/(tabs)/shop");
  };

  const goToChatShop = () => {
    router.push("/(tabs)/chatshop");
  };

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <Text style={styles.headerSubtitle}>
        Bài tập 4: HorizontalList từ MockAPI
      </Text>
      <Text style={styles.description}>
        Danh sách người dùng hiển thị theo chiều ngang
      </Text>

      {/* Navigation Buttons */}
      <View style={styles.navButtons}>
        <TouchableOpacity style={styles.homeButton} onPress={goToHome}>
          <Feather name="home" size={16} color="white" />
          <Text style={styles.navButtonText}>Bài 3: API</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shopButton} onPress={goToShop}>
          <Feather name="shopping-bag" size={16} color="white" />
          <Text style={styles.navButtonText}>Bài 2: Shop</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chatButton} onPress={goToChatShop}>
          <Feather name="message-circle" size={16} color="white" />
          <Text style={styles.navButtonText}>Bài 1: Chat</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Bài tập 4: Horizontal List</Text>
          </View>

          {renderHeader()}

          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#9C27B0" />
            <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Bài tập 4: Horizontal List ({users.length})
          </Text>
          <TouchableOpacity onPress={fetchUsers}>
            <Feather name="refresh-cw" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {renderHeader()}

          {/* Horizontal FlatList */}
          <View style={styles.horizontalListContainer}>
            <Text style={styles.listTitle}>
              Danh sách người dùng (Horizontal)
            </Text>
            <FlatList
              data={users}
              renderItem={renderUser}
              keyExtractor={(item) => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalContent}
            />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E5E5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#9C27B0",
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  headerContent: {
    backgroundColor: "white",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
    fontStyle: "italic",
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  homeButton: {
    backgroundColor: "#1BA9FF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    justifyContent: "center",
    gap: 6,
  },
  shopButton: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    justifyContent: "center",
    gap: 6,
  },
  chatButton: {
    backgroundColor: "#FF4444",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    justifyContent: "center",
    gap: 6,
  },
  navButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
    textAlign: "center",
  },
  horizontalListContainer: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  horizontalContent: {
    paddingHorizontal: 8,
  },
  userCard: {
    backgroundColor: "#F3E5F5",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    minWidth: 200,
    maxWidth: 250,
    borderWidth: 1,
    borderColor: "#E1BEE7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
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
