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
  RefreshControl,
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
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<"Tất cả" | "Thu" | "Chi">(
    "Tất cả"
  );

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

  // Lọc giao dịch theo loại
  const getFilteredTransactions = () => {
    if (filterType === "Tất cả") {
      return transactions;
    }
    return transactions.filter((txn) => txn.type === filterType);
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (searchText.trim() === "") {
        await loadTransactions();
      } else {
        const results = await DB.searchTransactions(searchText.trim());
        setTransactions(results);
      }
    } catch (error) {
      console.error("Error refreshing transactions:", error);
      Alert.alert("Lỗi", "Không thể làm mới dữ liệu");
    } finally {
      setRefreshing(false);
    }
  }, [searchText]);

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
    const filtered = getFilteredTransactions();
    return filtered.reduce((sum, txn) => {
      return txn.type === "Thu" ? sum + txn.amount : sum - txn.amount;
    }, 0);
  };

  const getTotalIncome = () => {
    const filtered = getFilteredTransactions();
    return filtered
      .filter((txn) => txn.type === "Thu")
      .reduce((sum, txn) => sum + txn.amount, 0);
  };

  const getTotalExpense = () => {
    const filtered = getFilteredTransactions();
    return filtered
      .filter((txn) => txn.type === "Chi")
      .reduce((sum, txn) => sum + txn.amount, 0);
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      "Ăn uống": "�️",
      "Di chuyển": "�",
      "Mua sắm": "�",
      "Hóa đơn": "�",
      "Giải trí": "�",
      Khác: "�",
    };
    return icons[category] || "�";
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      style={styles.transactionItem}
      onPress={() => editTransaction(item)}
      onLongPress={() => showDeleteMenu(item)}
      activeOpacity={0.7}
    >
      <View style={styles.transactionLeft}>
        <View style={styles.categoryIconContainer}>
          <Text style={styles.categoryIconLarge}>
            {getCategoryIcon(item.category)}
          </Text>
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <View style={styles.transactionMeta}>
            <Text style={styles.transactionCategory}>{item.category}</Text>
            <Text style={styles.transactionDot}>•</Text>
            <Text style={styles.transactionDate}>{item.createdAt}</Text>
          </View>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <View
          style={[
            styles.amountBadge,
            item.type === "Thu" ? styles.incomeBadge : styles.expenseBadge,
          ]}
        >
          <Text style={styles.amountBadgeText}>
            {item.type === "Thu" ? "📈" : "📉"}
          </Text>
        </View>
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
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push("/settings")}
        >
          <Text style={styles.iconButtonText}>⚙️</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>EXPENSE TRACKER</Text>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.syncButton} onPress={onRefresh}>
            <Text style={styles.syncButtonText}>⟲</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/statistics")}
          >
            <Text style={styles.iconButtonText}>📊</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/trash")}
          >
            <Text style={styles.iconButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Total Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Số dư hiện tại</Text>
          <Text
            style={[
              styles.balanceAmount,
              getBalance() >= 0 ? styles.incomeAmount : styles.expenseAmount,
            ]}
          >
            {getBalance() >= 0 ? "+" : ""}₫
            {Math.abs(getBalance()).toLocaleString()}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <View style={styles.summaryIconContainer}>
              <Text style={styles.summaryIcon}>↗</Text>
              <Text style={styles.summaryLabel}>Thu nhập</Text>
            </View>
            <Text style={[styles.summaryAmount, styles.incomeAmount]}>
              +₫{getTotalIncome().toLocaleString()}
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <View style={styles.summaryIconContainer}>
              <Text style={styles.summaryIcon}>↙</Text>
              <Text style={styles.summaryLabel}>Chi tiêu</Text>
            </View>
            <Text style={[styles.summaryAmount, styles.expenseAmount]}>
              -₫{getTotalExpense().toLocaleString()}
            </Text>
          </View>
        </View>

        <Text style={styles.summaryCount}>
          Tổng {getFilteredTransactions().length} giao dịch
        </Text>
      </View>

      {/* Transaction List */}
      <View style={styles.listContainer}>
        <View style={styles.searchHeader}>
          <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterTab,
              filterType === "Tất cả" && styles.filterTabActive,
            ]}
            onPress={() => setFilterType("Tất cả")}
          >
            <Text
              style={[
                styles.filterTabText,
                filterType === "Tất cả" && styles.filterTabTextActive,
              ]}
            >
              Tất cả
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterTab,
              filterType === "Thu" && styles.filterTabIncome,
            ]}
            onPress={() => setFilterType("Thu")}
          >
            <Text
              style={[
                styles.filterTabText,
                filterType === "Thu" && styles.filterTabTextIncome,
              ]}
            >
              Thu nhập
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterTab,
              filterType === "Chi" && styles.filterTabExpense,
            ]}
            onPress={() => setFilterType("Chi")}
          >
            <Text
              style={[
                styles.filterTabText,
                filterType === "Chi" && styles.filterTabTextExpense,
              ]}
            >
              Chi tiêu
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm giao dịch..."
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
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#6366f1"]}
                tintColor="#6366f1"
                title="Đang tải..."
                titleColor="#666"
              />
            }
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
    backgroundColor: "#F9FBF9",
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: "#8FD6AA",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  headerIcon: {
    fontSize: 28,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 1.2,
    textAlign: "center",
    fontFamily: "System",
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
  menuButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuButtonText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E9F2EC",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
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
    fontSize: 11,
    color: "#6C7A72",
    marginBottom: 6,
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: "700",
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
    fontSize: 12,
    color: "#5B6B6A",
    marginBottom: 8,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  incomeAmount: {
    color: "#65B57E",
  },
  expenseAmount: {
    color: "#D44A4A",
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
    fontWeight: "700",
    color: "#1F2E25",
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E8F1EA",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  filterTabActive: {
    backgroundColor: "#7FCF9A",
    borderColor: "#65B57E",
  },
  filterTabIncome: {
    backgroundColor: "#BEECC9",
    borderColor: "#BEECC9",
  },
  filterTabExpense: {
    backgroundColor: "#F9C3C3",
    borderColor: "#F9C3C3",
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6C7A72",
  },
  filterTabTextActive: {
    color: "#fff",
  },
  filterTabTextIncome: {
    color: "#1F2E25",
  },
  filterTabTextExpense: {
    color: "#1F2E25",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E8F1EA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
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
    backgroundColor: "#E8F5E8",
  },
  expenseIndicator: {
    backgroundColor: "#FFE8E8",
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
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8F1EA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 36,
    color: "#6C7A72",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2E25",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6C7A72",
    textAlign: "center",
    lineHeight: 20,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#65B57E",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 6,
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
    backgroundColor: "#E8F5E8",
    borderColor: "#7FCF9A",
  },
  typeButtonExpense: {
    backgroundColor: "#FFE8E8",
    borderColor: "#F26C6C",
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
    backgroundColor: "#E8F5E8",
    borderColor: "#7FCF9A",
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
    color: "#65B57E",
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
    backgroundColor: "#65B57E",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  syncButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  syncButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E8F5E8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryIconLarge: {
    fontSize: 24,
  },
  transactionMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  transactionDot: {
    fontSize: 12,
    color: "#999",
    marginHorizontal: 6,
  },
  transactionDate: {
    fontSize: 12,
    color: "#999",
  },
  amountBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  incomeBadge: {
    backgroundColor: "#E8F5E8",
  },
  expenseBadge: {
    backgroundColor: "#FFE8E8",
  },
  amountBadgeText: {
    fontSize: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconButtonText: {
    fontSize: 20,
  },
  summaryIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  summaryIcon: {
    fontSize: 14,
    marginRight: 6,
    color: "#6C7A72",
  },
});
