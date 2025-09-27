import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
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

export default function Explore() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const goBack = () => {
    router.back();
  };

  const goToChatShop = () => {
    router.push("/(tabs)/chatshop");
  };

  const goToShop = () => {
    router.push("/(tabs)/shop");
  };

  // Lấy dữ liệu từ API: https://mockapi.io/
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://68d7245ac2a1754b426cb505.mockapi.io/users"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (error: any) {
      console.error("Fetch Error:", error);
      Alert.alert("Lỗi", error.message || "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Render user cho Bài 3 (Vertical) - mỗi item gồm: name + email
  const renderUserVertical = ({ item }: { item: User }) => (
    <View style={styles.userItemVertical}>
      <Text style={styles.userNameVertical}>{item.name}</Text>
      <Text style={styles.userEmailVertical}>{item.email}</Text>
    </View>
  );

  // Render user cho Bài 4 (Horizontal) - name (in đậm) và email
  const renderUserHorizontal = ({ item }: { item: User }) => (
    <View style={styles.userItemHorizontal}>
      <Text style={styles.userNameHorizontal}>{item.name}</Text>
      <Text style={styles.userEmailHorizontal}>{item.email}</Text>
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
            <Text style={styles.headerTitle}>Bài tập 3: API Users</Text>
            <View style={styles.placeholder} />
          </View>

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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Bài tập 3: API Users ({users.length})
          </Text>
          <TouchableOpacity onPress={fetchUsers} style={styles.refreshButton}>
            <Feather name="refresh-cw" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Navigation Header */}
          <View style={styles.headerContent}>
            <Text style={styles.headerSubtitle}>
              Bài tập 3: Danh sách người dùng từ MockAPI
            </Text>

            <View style={styles.navButtons}>
              <TouchableOpacity style={styles.shopButton} onPress={goToShop}>
                <Feather name="shopping-bag" size={20} color="white" />
                <Text style={styles.navButtonText}>Bài 2: Shop</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.chatButton}
                onPress={goToChatShop}
              >
                <Feather name="message-circle" size={20} color="white" />
                <Text style={styles.navButtonText}>Bài 1: Chat Shop</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.separator} />
          </View>

          {/* BÀI TẬP 3: VERTICAL LIST */}
          <View style={styles.section}>
            <FlatList
              data={users}
              renderItem={renderUserVertical}
              keyExtractor={(item) => `vertical-${item.id}`}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
              style={styles.verticalList}
            />
          </View>

          {/* BÀI TẬP 4: HORIZONTAL LIST */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bài tập 4: Horizontal List</Text>
            <Text style={styles.sectionSubtitle}>
              Danh sách ngang - Cuộn ngang →
            </Text>

            <FlatList
              data={users}
              renderItem={renderUserHorizontal}
              keyExtractor={(item) => `horizontal-${item.id}`}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalContent}
            />
          </View>
        </ScrollView>
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
  backButton: {
    padding: 4,
  },
  refreshButton: {
    padding: 4,
  },
  placeholder: {
    width: 32,
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
  section: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#4A148C",
    marginTop: 20,
  },
  sectionSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    color: "#7B1FA2",
    fontStyle: "italic",
  },
  // STYLES CHO BÀI 3 - VERTICAL LIST
  verticalList: {
    maxHeight: 400,
  },
  userItemVertical: {
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
  userNameVertical: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userEmailVertical: {
    fontSize: 14,
    color: "#666",
  },
  // STYLES CHO BÀI 4 - HORIZONTAL LIST
  horizontalContent: {
    paddingVertical: 8,
  },
  userItemHorizontal: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 8,
    borderRadius: 12,
    minWidth: 200,
    maxWidth: 250,
    borderWidth: 2,
    borderColor: "#9C27B0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  userNameHorizontal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A148C",
    marginBottom: 8,
    textAlign: "center",
  },
  userEmailHorizontal: {
    fontSize: 14,
    color: "#7B1FA2",
    textAlign: "center",
    lineHeight: 20,
  },
});
