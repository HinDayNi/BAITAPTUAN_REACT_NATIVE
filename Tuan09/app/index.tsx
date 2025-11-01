import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
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
  type: "Thu" | "Chi"; // Thu = Income, Chi = Expense
}

const CATEGORIES = [
  "Ăn uống",
  "Di chuyển",
  "Mua sắm",
  "Hóa đơn",
  "Giải trí",
  "Khác",
];

export default function Index() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [selectedType, setSelectedType] = useState<"Thu" | "Chi">("Chi");
  const [searchText, setSearchText] = useState("");

  // Sử dụng useRef để quản lý input
  const titleInputRef = useRef<TextInput>(null);
  const amountInputRef = useRef<TextInput>(null);

  // Khởi tạo database và load dữ liệu
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await DB.initDatabase();
        await loadTransactions();
      } catch (error) {
        console.error("Error initializing app:", error);
        Alert.alert("Lỗi", "Không thể khởi tạo ứng dụng");
      }
    };

    initializeApp();
  }, []);

  // Load lại dữ liệu khi quay lại từ màn hình edit
  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  const loadTransactions = async () => {
    try {
      const data = await DB.getAllTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu");
    }
  };

  const handleSearch = async (text: string) => {
    setSearchText(text);
    try {
      if (text.trim() === "") {
        await loadTransactions();
      } else {
        const results = await DB.searchTransactions(text.trim());
        setTransactions(results);
      }
    } catch (error) {
      console.error("Error searching transactions:", error);
      Alert.alert("Lỗi", "Không thể tìm kiếm");
    }
  };

  const addTransaction = async () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ");
      return;
    }

    try {
      // Add new transaction only
      const newTransaction: Transaction = {
        title: title.trim(),
        amount: numAmount,
        category: selectedCategory,
        createdAt: new Date().toLocaleString("vi-VN"),
        type: selectedType,
      };
      await DB.addTransaction(newTransaction);

      await loadTransactions();
      resetForm();
      Alert.alert("Thành công", "Giao dịch đã được lưu");
    } catch (error) {
      console.error("Error saving transaction:", error);
      Alert.alert("Lỗi", "Không thể lưu giao dịch");
    }
  };

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setSelectedCategory(CATEGORIES[0]);
    setSelectedType("Chi");
    setModalVisible(false);

    // Clear input sử dụng useRef
    titleInputRef.current?.clear();
    amountInputRef.current?.clear();
  };

  const deleteTransaction = async (id?: number) => {
    if (!id) return;

    Alert.alert(
      "Xóa giao dịch",
      "Bạn có chắc chắn muốn xóa giao dịch này? Bạn có thể khôi phục từ thùng rác.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await DB.deleteTransaction(id);
              await loadTransactions();
              Alert.alert(
                "Thành công",
                "Giao dịch đã được chuyển vào thùng rác"
              );
            } catch (error) {
              console.error("Error deleting transaction:", error);
              Alert.alert("Lỗi", "Không thể xóa giao dịch");
            }
          },
        },
      ]
    );
  };

  const showDeleteMenu = (transaction: Transaction) => {
    Alert.alert("Tùy chọn", `Bạn muốn làm gì với "${transaction.title}"?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => deleteTransaction(transaction.id),
      },
    ]);
  };

  const editTransaction = (transaction: Transaction) => {
    // Chuyển sang màn hình edit với các tham số
    router.push({
      pathname: "/edit/[id]",
      params: {
        id: transaction.id?.toString() || "0",
        title: transaction.title,
        amount: transaction.amount.toString(),
        category: transaction.category,
        type: transaction.type,
        createdAt: transaction.createdAt,
      },
    });
  };

  const getBalance = () => {
    return transactions.reduce((sum, txn) => {
      return txn.type === "Thu" ? sum + txn.amount : sum - txn.amount;
    }, 0);
  };

  const getTotalIncome = () => {
    return transactions
      .filter((txn) => txn.type === "Thu")
      .reduce((sum, txn) => sum + txn.amount, 0);
  };

  const getTotalExpense = () => {
    return transactions
      .filter((txn) => txn.type === "Chi")
      .reduce((sum, txn) => sum + txn.amount, 0);
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      "Ăn uống": "🍔",
      "Di chuyển": "🚗",
      "Mua sắm": "🛍️",
      "Hóa đơn": "📄",
      "Giải trí": "🎬",
      Khác: "📦",
    };
    return icons[category] || "📦";
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() => editTransaction(item)}
      onLongPress={() => showDeleteMenu(item)}
      activeOpacity={0.7}
    >
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
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>QUẢN LÝ THU CHI</Text>
        <TouchableOpacity
          style={styles.trashButton}
          onPress={() => router.push("/trash")}
        >
          <Text style={styles.trashButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      {/* Total Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Thu</Text>
            <Text style={[styles.summaryAmount, styles.incomeAmount]}>
              +₫{getTotalIncome().toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Chi</Text>
            <Text style={[styles.summaryAmount, styles.expenseAmount]}>
              -₫{getTotalExpense().toLocaleString()}
            </Text>
          </View>
        </View>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Số dư</Text>
          <Text
            style={[
              styles.balanceAmount,
              getBalance() >= 0 ? styles.incomeAmount : styles.expenseAmount,
            ]}
          >
            ₫{getBalance().toLocaleString()}
          </Text>
        </View>
        <Text style={styles.summaryCount}>{transactions.length} giao dịch</Text>
      </View>

      {/* Transaction List */}
      <View style={styles.listContainer}>
        <View style={styles.searchHeader}>
          <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm theo tên hoặc danh mục..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={handleSearch}
          />
          {searchText !== "" && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {transactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>{searchText ? "�" : "�📊"}</Text>
            <Text style={styles.emptyText}>
              {searchText ? "Không tìm thấy kết quả" : "Chưa có giao dịch nào"}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchText
                ? "Thử tìm kiếm với từ khóa khác"
                : "Nhấn nút + để thêm giao dịch đầu tiên"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={transactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item) => item.id?.toString() || "0"}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Add/Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          resetForm();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm giao dịch mới</Text>

            <Text style={styles.inputLabel}>Loại</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  selectedType === "Thu" && styles.typeButtonIncome,
                ]}
                onPress={() => setSelectedType("Thu")}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    selectedType === "Thu" && styles.typeButtonTextActive,
                  ]}
                >
                  💰 Thu
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  selectedType === "Chi" && styles.typeButtonExpense,
                ]}
                onPress={() => setSelectedType("Chi")}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    selectedType === "Chi" && styles.typeButtonTextActive,
                  ]}
                >
                  💸 Chi
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Tiêu đề</Text>
            <TextInput
              ref={titleInputRef}
              style={styles.input}
              placeholder="VD: Ăn trưa tại nhà hàng"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.inputLabel}>Số tiền (₫)</Text>
            <TextInput
              ref={amountInputRef}
              style={styles.input}
              placeholder="0"
              placeholderTextColor="#999"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Danh mục</Text>
            <View style={styles.categoryContainer}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category && styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={styles.categoryChipIcon}>
                    {getCategoryIcon(category)}
                  </Text>
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategory === category &&
                        styles.categoryChipTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  resetForm();
                }}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={addTransaction}
              >
                <Text style={styles.saveButtonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#6366f1",
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
  trashButton: {
    position: "absolute",
    right: 20,
    padding: 8,
  },
  trashButtonText: {
    fontSize: 24,
  },
  summaryCard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryDivider: {
    width: 1,
    backgroundColor: "#e5e5e5",
    marginHorizontal: 16,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  balanceContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "600",
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
  },
  incomeAmount: {
    color: "#10b981",
  },
  expenseAmount: {
    color: "#ef4444",
  },
  summaryCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  clearIcon: {
    fontSize: 20,
    color: "#999",
    paddingHorizontal: 8,
  },
  transactionItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
  },
  transactionRight: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    padding: 4,
  },
  editButtonText: {
    fontSize: 16,
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 16,
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
  addButton: {
    position: "absolute",
    right: 24,
    bottom: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "300",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "85%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  typeContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    borderWidth: 2,
    borderColor: "#f5f5f5",
    alignItems: "center",
  },
  typeButtonIncome: {
    backgroundColor: "#d1fae5",
    borderColor: "#10b981",
  },
  typeButtonExpense: {
    backgroundColor: "#fee2e2",
    borderColor: "#ef4444",
  },
  typeButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  typeButtonTextActive: {
    color: "#333",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    borderWidth: 2,
    borderColor: "#f5f5f5",
  },
  categoryChipActive: {
    backgroundColor: "#e0e7ff",
    borderColor: "#6366f1",
  },
  categoryChipIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  categoryChipTextActive: {
    color: "#6366f1",
    fontWeight: "600",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  saveButton: {
    backgroundColor: "#6366f1",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
