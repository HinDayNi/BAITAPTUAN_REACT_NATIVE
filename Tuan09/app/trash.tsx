import React, { useState, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router, useFocusEffect } from "expo-router";
import * as DB from "../database/db";

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

export default function TrashScreen() {
  const [deletedTransactions, setDeletedTransactions] = useState<Transaction[]>(
    []
  );

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

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View
          style={[
            styles.typeIndicator,
            item.type === "Thu"
              ? styles.incomeIndicator
              : styles.expenseIndicator,
          ]}
        >
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionCategory}>
            {item.category} • {item.createdAt}
          </Text>
          <Text style={styles.deletedAt}>Đã xóa: {item.deletedAt}</Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text
          style={[
            styles.transactionAmount,
            item.type === "Thu" ? styles.incomeAmount : styles.expenseAmount,
          ]}
        >
          {item.type === "Thu" ? "+" : "-"}₫{item.amount.toLocaleString()}
        </Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.restoreButton}
            onPress={() => restoreTransaction(item.id)}
          >
            <Text style={styles.restoreButtonText}>↩️ Khôi phục</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => permanentDelete(item.id)}
          >
            <Text style={styles.deleteButtonText}>🗑️ Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>THÙNG RÁC</Text>
        <TouchableOpacity style={styles.emptyButton} onPress={emptyTrash}>
          <Text style={styles.emptyButtonText}>Xóa tất cả</Text>
        </TouchableOpacity>
      </View>

      {/* Transaction List */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>
          {deletedTransactions.length} giao dịch đã xóa
        </Text>
        {deletedTransactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🗑️</Text>
            <Text style={styles.emptyText}>Thùng rác trống</Text>
            <Text style={styles.emptySubtext}>
              Các giao dịch đã xóa sẽ xuất hiện ở đây
            </Text>
          </View>
        ) : (
          <FlatList
            data={deletedTransactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id?.toString() || "0"}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#ef4444",
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
  },
  emptyButton: {
    padding: 8,
  },
  emptyButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  transactionItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  typeIndicator: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 12,
  },
  incomeIndicator: {
    backgroundColor: "#d1fae5",
  },
  expenseIndicator: {
    backgroundColor: "#fee2e2",
  },
  typeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#333",
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  deletedAt: {
    fontSize: 11,
    color: "#ef4444",
    fontStyle: "italic",
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  incomeAmount: {
    color: "#10b981",
  },
  expenseAmount: {
    color: "#ef4444",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  restoreButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#10b981",
    borderRadius: 8,
  },
  restoreButtonText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  deleteButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#ef4444",
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
