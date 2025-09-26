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

export default function Home() {
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
  const goToShop = () => {
    router.push("/(tabs)/shop");
  };

  const goToChatShop = () => {
    router.push("/(tabs)/chatshop");
  };

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <Text style={styles.headerSubtitle}>
        Bài tập 3: Danh sách người dùng từ MockAPI
      </Text>

      {/* Navigation Buttons*/}
      <View style={styles.navButtons}>
        <TouchableOpacity style={styles.shopButton} onPress={goToShop}>
          <Feather name="shopping-bag" size={20} color="white" />
          <Text style={styles.navButtonText}>Bài 2: Shop</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chatButton} onPress={goToChatShop}>
          <Feather name="message-circle" size={20} color="white" />
          <Text style={styles.navButtonText}>Bài 1: Chat Shop</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          {/* Header*/}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Bài tập 3: API Users</Text>
          </View>

          {renderHeader()}

          {/* ActivityIndicator */}
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1BA9FF" />
            <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header với refresh*/}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Bài tập 3: API Users ({users.length})
          </Text>
          <TouchableOpacity onPress={fetchUsers}>
            <Feather name="refresh-cw" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* FlatList với header navigation */}
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={fetchUsers}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E5E5",
  },
  // Header styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1BA9FF",
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
  // Navigation styles
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
    marginBottom: 16,
    textAlign: "center",
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  shopButton: {
    backgroundColor: "#1BA9FF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    flex: 1,
    justifyContent: "center",
    gap: 8,
  },
  chatButton: {
    backgroundColor: "#FF4444",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    flex: 1,
    justifyContent: "center",
    gap: 8,
  },
  navButtonText: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginTop: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  // Loading styles
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
  // User item styles
  userItem: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
});
