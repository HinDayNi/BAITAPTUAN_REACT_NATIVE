import React, { useState, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  RefreshControl,
  Platform, // Import Platform để xử lý SafeAreaView
  StatusBar as RNStatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { router, useFocusEffect } from "expo-router";
import * as DB from "../database/db";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; // Import Expo Icons

interface Transaction {
  id?: number;
  title: string;
  amount: number;
  category: string;
  createdAt: string;
  type: "Thu" | "Chi";
  isDeleted?: number;
  deletedAt?: string;
}

const COLORS = {
  primary: "#6495ED",
  primaryDark: "#304674",
  primaryLight: "#EEF3FF",
  secondary: "#98AFC7",
  text: "#1F2937",
  textLight: "#6B7280",
  background: "#F9FAFB",
  white: "#FFFFFF",
  income: "#10B981",
  incomeLight: "#D1FAE5",
  expense: "#EF4444",
  expenseLight: "#FEE2E2",
  border: "#E5E7EB",
  shadowColor: "rgba(0, 0, 0, 0.1)",
  delete: "#EF4444",
  restore: "#10B981",
};

export default function TrashScreen() {
  const [deletedTransactions, setDeletedTransactions] = useState<Transaction[]>(
    []
  );
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Load deleted transactions when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadDeletedTransactions();
    }, [])
  );

  const loadDeletedTransactions = async () => {
    try {
      const data = await DB.getDeletedTransactions();
      setDeletedTransactions(data);
    } catch (error) {
      console.error("Error loading deleted transactions:", error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu");
    }
  };

  const handleSearch = async (text: string) => {
    setSearchText(text);
    try {
      if (text.trim() === "") {
        await loadDeletedTransactions();
      } else {
        const results = await DB.searchDeletedTransactions(text.trim());
        setDeletedTransactions(results);
      }
    } catch (error) {
      console.error("Error searching deleted transactions:", error);
      Alert.alert("Lỗi", "Không thể tìm kiếm");
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (searchText.trim() === "") {
        await loadDeletedTransactions();
      } else {
        const results = await DB.searchDeletedTransactions(searchText.trim());
        setDeletedTransactions(results);
      }
    } catch (error) {
      console.error("Error refreshing deleted transactions:", error);
      Alert.alert("Lỗi", "Không thể làm mới dữ liệu");
    } finally {
      setRefreshing(false);
    }
  }, [searchText]);

  const restoreTransaction = async (id?: number) => {
    if (!id) return;

    Alert.alert("Khôi phục giao dịch", "Bạn có muốn khôi phục giao dịch này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Khôi phục",
        onPress: async () => {
          try {
            await DB.restoreTransaction(id);
            await loadDeletedTransactions();
            Alert.alert("Thành công", "Giao dịch đã được khôi phục");
          } catch (error) {
            console.error("Error restoring transaction:", error);
            Alert.alert("Lỗi", "Không thể khôi phục giao dịch");
          }
        },
      },
    ]);
  };

  const showRestoreMenu = (transaction: Transaction) => {
    Alert.alert("Tùy chọn", `Bạn muốn làm gì với "${transaction.title}"?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Khôi phục",
        onPress: () => restoreTransaction(transaction.id),
      },
      {
        text: "Xóa vĩnh viễn",
        style: "destructive",
        onPress: () => permanentDelete(transaction.id),
      },
    ]);
  };

  const permanentDelete = async (id?: number) => {
    if (!id) return;

    Alert.alert(
      "Xóa vĩnh viễn",
      "Bạn có chắc chắn muốn xóa vĩnh viễn giao dịch này? Thao tác này không thể hoàn tác!",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa vĩnh viễn",
          style: "destructive",
          onPress: async () => {
            try {
              await DB.permanentDeleteTransaction(id);
              await loadDeletedTransactions();
              Alert.alert("Thành công", "Giao dịch đã được xóa vĩnh viễn");
            } catch (error) {
              console.error("Error permanently deleting transaction:", error);
              Alert.alert("Lỗi", "Không thể xóa giao dịch");
            }
          },
        },
      ]
    );
  };

  const emptyTrash = async () => {
    if (deletedTransactions.length === 0) {
      Alert.alert("Thông báo", "Thùng rác đã trống");
      return;
    }

    Alert.alert(
      "Xóa tất cả",
      "Bạn có chắc chắn muốn xóa vĩnh viễn tất cả giao dịch trong thùng rác? Thao tác này không thể hoàn tác!",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa tất cả",
          style: "destructive",
          onPress: async () => {
            try {
              for (const transaction of deletedTransactions) {
                if (transaction.id) {
                  await DB.permanentDeleteTransaction(transaction.id);
                }
              }
              await loadDeletedTransactions();
              Alert.alert(
                "Thành công",
                "Tất cả giao dịch đã được xóa vĩnh viễn"
              );
            } catch (error) {
              console.error("Error emptying trash:", error);
              Alert.alert("Lỗi", "Không thể xóa giao dịch");
            }
          },
        },
      ]
    );
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const isIncome = item.type === "Thu";
    const amountColor = isIncome ? COLORS.income : COLORS.expense;

    return (
      <TouchableOpacity
        style={styles.transactionItem}
        onLongPress={() => showRestoreMenu(item)}
        activeOpacity={0.8}
        onPress={() => showRestoreMenu(item)} // Thêm onPress để người dùng dễ dàng truy cập menu trên mobile
      >
        {/* Left Section: Icon, Title, Category, Deleted At */}
        <View style={styles.transactionContent}>
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: isIncome
                  ? COLORS.incomeLight
                  : COLORS.expenseLight,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={isIncome ? "arrow-up-right" : "arrow-down-left"}
              size={24}
              color={amountColor}
            />
          </View>

          <View style={styles.transactionInfo}>
            <Text style={styles.transactionTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.transactionCategory}>
              <Ionicons
                name="pricetag-outline"
                size={12}
                color={COLORS.textLight}
              />{" "}
              {item.category} • {item.createdAt}
            </Text>
            <Text style={styles.deletedAt}>
              <Ionicons name="trash-outline" size={11} color={COLORS.delete} />{" "}
              Đã xóa: {item.deletedAt}
            </Text>
          </View>

          {/* Right Section: Amount & Actions */}
          <View style={styles.transactionRight}>
            <Text style={[styles.transactionAmount, { color: amountColor }]}>
              {isIncome ? "+" : "-"}₫{item.amount.toLocaleString()}
            </Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.restoreButton}
                onPress={() => restoreTransaction(item.id)}
              >
                <Ionicons
                  name="arrow-undo-outline"
                  size={16}
                  color={COLORS.white}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => permanentDelete(item.id)}
              >
                <Ionicons
                  name="trash-bin-outline"
                  size={16}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ExpoStatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>THÙNG RÁC</Text>
        <TouchableOpacity style={styles.emptyButton} onPress={emptyTrash}>
          <Ionicons name="trash-bin" size={18} color={COLORS.white} />
          <Text style={styles.emptyButtonText}> Xóa tất cả</Text>
        </TouchableOpacity>
      </View>

      {/* List Content */}
      <View style={styles.listContainer}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm giao dịch đã xóa..."
            placeholderTextColor={COLORS.textLight}
            value={searchText}
            onChangeText={handleSearch}
          />
          {searchText !== "" && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={COLORS.textLight}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.searchHeader}>
          <Text style={styles.sectionTitle}>
            {deletedTransactions.length} Giao dịch (
            {searchText ? "Kết quả tìm kiếm" : "Tất cả"})
          </Text>
        </View>

        {deletedTransactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name={searchText ? "magnify-remove-outline" : "trash-can-outline"}
              size={80}
              color={COLORS.textLight}
            />
            <Text style={styles.emptyText}>
              {searchText ? "Không tìm thấy kết quả" : "Thùng rác trống"}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchText
                ? "Thử tìm kiếm với từ khóa khác"
                : "Các giao dịch đã xóa sẽ xuất hiện ở đây"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={deletedTransactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id?.toString() || "0"}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight || 0 : 0, // Thêm padding cho Android
  },

  // Header Section
  header: {
    backgroundColor: COLORS.primary, // Blue Pastel
    paddingHorizontal: 24,
    paddingVertical: 18,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20, // Bo tròn hoàn toàn
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  emptyButtonText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: "600",
    marginLeft: 4,
  },

  // List & Search Section
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingHorizontal: 10,
  },
  searchHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textLight,
    marginBottom: 8,
  },
  flatListContent: {
    paddingBottom: 20,
  },

  // Transaction Item
  transactionItem: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 18,
    marginBottom: 15,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  transactionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  transactionInfo: {
    flex: 1,
    marginRight: 10,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  deletedAt: {
    fontSize: 10,
    color: COLORS.delete,
    fontStyle: "italic",
    fontWeight: "600",
  },
  transactionRight: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  restoreButton: {
    padding: 8,
    backgroundColor: COLORS.income,
    borderRadius: 10,
    shadowColor: COLORS.income,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: COLORS.expense,
    borderRadius: 10,
    shadowColor: COLORS.expense,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textLight,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
