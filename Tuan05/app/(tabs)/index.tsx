import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

export default function Home() {
  const router = useRouter();

  // Navigation functions
  const goToChatShop = () => {
    router.push("/(tabs)/chatshop");
  };

  const goToShop = () => {
    router.push("/(tabs)/shop");
  };

  const goToBai3 = () => {
    router.push("/(tabs)/bai3");
  };

  const goToBai4 = () => {
    router.push("/(tabs)/bai4");
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Tuần 5 - FlatList Exercises</Text>
        <Text style={styles.subtitle}>Chọn bài tập để xem</Text>

        <View style={styles.menuContainer}>
          {/* Bài 1: Chat Shop */}
          <TouchableOpacity style={styles.menuItem} onPress={goToChatShop}>
            <View style={styles.menuItemContent}>
              <Feather name="message-circle" size={30} color="#F31111" />
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>Bài 1: Chat Shop</Text>
                <Text style={styles.menuDescription}>
                  Danh sách chat với shop
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          {/* Bài 2: Shop */}
          <TouchableOpacity style={styles.menuItem} onPress={goToShop}>
            <View style={styles.menuItemContent}>
              <Feather name="shopping-bag" size={30} color="#1BA9FF" />
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>Bài 2: Shop</Text>
                <Text style={styles.menuDescription}>Danh sách sản phẩm</Text>
              </View>
              <Feather name="chevron-right" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          {/* Bài 3: Vertical List */}
          <TouchableOpacity style={styles.menuItem} onPress={goToBai3}>
            <View style={styles.menuItemContent}>
              <Feather name="list" size={30} color="#0066CC" />
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>Bài 3: Vertical List</Text>
                <Text style={styles.menuDescription}>
                  Danh sách người dùng từ API
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          {/* Bài 4: Horizontal List */}
          <TouchableOpacity style={styles.menuItem} onPress={goToBai4}>
            <View style={styles.menuItemContent}>
              <Feather name="arrow-right" size={30} color="#9C27B0" />
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>Bài 4: Horizontal List</Text>
                <Text style={styles.menuDescription}>
                  Danh sách User cuộn ngang
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#666" />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 40,
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    backgroundColor: "white",
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    flex: 1,
    marginLeft: 16,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: "#666",
  },
});
