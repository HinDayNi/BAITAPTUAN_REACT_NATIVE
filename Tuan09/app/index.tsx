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
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router, useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";

import * as DB from "../database/db";

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
};

interface Transaction {
  id?: number;
  title: string;
  amount: number;
  category: string;
  createdAt: string;
  type: "Thu" | "Chi";
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

  const titleInputRef = useRef<TextInput>(null);
  const amountInputRef = useRef<TextInput>(null);

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

  const getFilteredTransactions = () => {
    let filtered = transactions;

    // Áp dụng bộ lọc Thu/Chi
    if (filterType !== "Tất cả") {
      filtered = filtered.filter((txn) => txn.type === filterType);
    }

    // Áp dụng tìm kiếm
    if (searchText.trim() !== "") {
      const searchLower = searchText.trim().toLowerCase();
      filtered = filtered.filter(
        (txn) =>
          txn.title.toLowerCase().includes(searchLower) ||
          txn.category.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  };

  const handleSearch = async (text: string) => {
    setSearchText(text);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTransactions();
    setSearchText(""); // Reset tìm kiếm khi làm mới
    setFilterType("Tất cả"); // Reset bộ lọc khi làm mới
    setRefreshing(false);
  }, []);

  const addTransaction = async () => {
    if (!title.trim() || !amount.trim()) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    const numAmount = parseFloat(amount.replace(/,/g, "")); // Xử lý nếu người dùng nhập có dấu phẩy
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ");
      return;
    }

    try {
      const newTransaction: Transaction = {
        title: title.trim(),
        amount: numAmount,
        category: selectedCategory,
        createdAt: new Date().toISOString(),
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

  const formatViDate = (value: string) => {
    const opts: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    const tryParse = (v: string) => {
      const d1 = new Date(v);
      if (!isNaN(d1.getTime())) return d1;
      const m = v.match(
        /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:[,\s]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/
      );
      if (m) {
        const day = Number(m[1]);
        const mon = Number(m[2]) - 1;
        const year = Number(m[3]);
        const hour = Number(m[4] || 0);
        const minute = Number(m[5] || 0);
        const second = Number(m[6] || 0);
        return new Date(year, mon, day, hour, minute, second);
      }
      return new Date();
    };

    const d = tryParse(value);
    return d.toLocaleString("vi-VN", opts);
  };

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setSelectedCategory(CATEGORIES[0]);
    setSelectedType("Chi");
    setModalVisible(false);

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
        text: "Chỉnh sửa",
        onPress: () => editTransaction(transaction),
      },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => deleteTransaction(transaction.id),
      },
    ]);
  };

  const editTransaction = (transaction: Transaction) => {
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
    const icons: { [key: string]: { name: string; set: string } } = {
      "Ăn uống": { name: "fast-food-outline", set: "Ionicons" },
      "Di chuyển": { name: "car-outline", set: "Ionicons" },
      "Mua sắm": { name: "basket-outline", set: "Ionicons" },
      "Hóa đơn": { name: "receipt-outline", set: "Ionicons" },
      "Giải trí": { name: "game-controller-outline", set: "Ionicons" },
      Khác: { name: "cube-outline", set: "Ionicons" },
    };
    return icons[category] || { name: "cube-outline", set: "Ionicons" };
  };

  const filteredTransactions = getFilteredTransactions();

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const iconData = getCategoryIcon(item.category);
    return (
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => editTransaction(item)}
        onLongPress={() => showDeleteMenu(item)}
        activeOpacity={0.8}
      >
        <View style={styles.transactionLeft}>
          <View style={styles.categoryIconContainer}>
            {iconData.set === "Ionicons" ? (
              <Ionicons
                name={iconData.name as any}
                size={24}
                color={COLORS.text}
              />
            ) : (
              <Feather
                name={iconData.name as any}
                size={24}
                color={COLORS.text}
              />
            )}
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.transactionMeta}>
              <Text style={styles.transactionCategory}>{item.category}</Text>
              <Text style={styles.transactionDot}>•</Text>
              <Text style={styles.transactionDate}>
                {formatViDate(item.createdAt)}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.transactionRight}>
          <Text
            style={[
              styles.transactionAmount,
              item.type === "Thu" ? styles.incomeAmount : styles.expenseAmount,
            ]}
            numberOfLines={1}
          >
            {item.type === "Thu" ? "+" : "-"}₫
            {item.amount.toLocaleString("vi-VN")}
          </Text>
          <Text
            style={[
              styles.amountTypeLabel,
              item.type === "Thu"
                ? styles.incomeTypeLabel
                : styles.expenseTypeLabel,
            ]}
          >
            {item.type === "Thu" ? "Thu" : "Chi"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Xin chào!</Text>
            <Text style={styles.subGreeting}>Quản lý chi tiêu của bạn</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push("/statistics")}
            >
              <Ionicons
                name="stats-chart-outline"
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push("/trash")}
            >
              <Ionicons name="trash-outline" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push("/settings")}
            >
              <Ionicons
                name="settings-outline"
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>
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
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            allowFontScaling
          >
            ₫{Math.abs(getBalance()).toLocaleString("vi-VN")}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <View style={styles.summaryIconWrapper}>
              <View style={styles.incomeIconBg}>
                <Feather
                  name="arrow-up-right"
                  size={20}
                  color={COLORS.income}
                />
              </View>
              <Text style={styles.summaryLabel}>Thu nhập</Text>
            </View>
            <Text style={[styles.summaryAmount, styles.incomeAmount]}>
              +₫{getTotalIncome().toLocaleString("vi-VN")}
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <View style={styles.summaryIconWrapper}>
              <Feather
                name="arrow-down-left"
                size={20}
                color={COLORS.expense}
              />
              <Text style={styles.summaryLabel}>Chi tiêu</Text>
            </View>
            <Text style={[styles.summaryAmount, styles.expenseAmount]}>
              -₫{getTotalExpense().toLocaleString("vi-VN")}
            </Text>
          </View>
        </View>

        <Text style={styles.summaryCount}>
          Tổng {filteredTransactions.length} giao dịch
        </Text>
      </View>

      {/* Transaction List */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={COLORS.textLight}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm tiêu đề hoặc danh mục..."
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
                style={styles.clearIcon}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {(["Tất cả", "Thu", "Chi"] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterTab,
                filterType === type && styles.filterTabActive,
              ]}
              onPress={() => setFilterType(type)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filterType === type && styles.filterTabTextActive,
                  filterType === "Thu" &&
                    type === "Thu" && { color: COLORS.income },
                  filterType === "Chi" &&
                    type === "Chi" && { color: COLORS.expense },
                ]}
              >
                {type === "Thu" ? (
                  <Ionicons
                    name="arrow-up-circle-outline"
                    size={14}
                    color={
                      filterType === "Thu" ? COLORS.income : COLORS.textLight
                    }
                  />
                ) : type === "Chi" ? (
                  <Ionicons
                    name="arrow-down-circle-outline"
                    size={14}
                    color={
                      filterType === "Chi" ? COLORS.expense : COLORS.textLight
                    }
                  />
                ) : null}{" "}
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredTransactions.length === 0 ? (
          <ScrollView
            contentContainerStyle={styles.emptyContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }
          >
            <Ionicons
              name={searchText ? "alert-circle-outline" : "cash-outline"}
              size={64}
              color={COLORS.textLight}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyText}>
              {searchText ? "Không tìm thấy kết quả" : "Chưa có giao dịch nào"}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchText
                ? "Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc"
                : "Nhấn nút + để thêm giao dịch đầu tiên"}
            </Text>
          </ScrollView>
        ) : (
          <FlatList
            data={filteredTransactions}
            renderItem={renderTransactionItem}
            keyExtractor={(item) =>
              item.id?.toString() || new Date().getTime().toString()
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
                title="Đang tải..."
                titleColor={COLORS.textLight}
              />
            }
          />
        )}
      </View>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="add-outline" size={40} color={COLORS.white} />
      </TouchableOpacity>

      {/* Add/Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={resetForm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thêm giao dịch mới</Text>
              <TouchableOpacity onPress={resetForm} style={styles.closeButton}>
                <Ionicons
                  name="close-outline"
                  size={24}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Type Selection */}
              <Text style={styles.inputLabel}>Loại giao dịch</Text>
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
                      selectedType === "Thu"
                        ? styles.typeButtonTextIncome
                        : null,
                    ]}
                  >
                    <Ionicons name="cash-outline" size={16} /> Thu nhập
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
                      selectedType === "Chi"
                        ? styles.typeButtonTextExpense
                        : null,
                    ]}
                  >
                    <Ionicons name="card-outline" size={16} /> Chi tiêu
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Inputs */}
              <Text style={styles.inputLabel}>Tiêu đề</Text>
              <TextInput
                ref={titleInputRef}
                style={styles.input}
                placeholder="VD: Ăn trưa tại nhà hàng"
                placeholderTextColor={COLORS.textLight}
                value={title}
                onChangeText={setTitle}
              />

              <Text style={styles.inputLabel}>Số tiền (₫)</Text>
              <TextInput
                ref={amountInputRef}
                style={styles.input}
                placeholder="0"
                placeholderTextColor={COLORS.textLight}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />

              {/* Category Chips */}
              <Text style={styles.inputLabel}>Danh mục</Text>
              <View style={styles.categoryContainer}>
                {CATEGORIES.map((category) => {
                  const iconData = getCategoryIcon(category);
                  return (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryChip,
                        selectedCategory === category &&
                          styles.categoryChipActive,
                      ]}
                      onPress={() => setSelectedCategory(category)}
                      activeOpacity={0.7}
                    >
                      {iconData.set === "Ionicons" ? (
                        <Ionicons
                          name={iconData.name as any}
                          size={18}
                          color={
                            selectedCategory === category
                              ? COLORS.primary
                              : COLORS.textLight
                          }
                          style={styles.categoryChipIcon}
                        />
                      ) : (
                        <Feather
                          name={iconData.name as any}
                          size={18}
                          color={
                            selectedCategory === category
                              ? COLORS.primary
                              : COLORS.textLight
                          }
                          style={styles.categoryChipIcon}
                        />
                      )}
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
                  );
                })}
              </View>
            </ScrollView>

            {/* Modal Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={resetForm}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={addTransaction}
                activeOpacity={0.8}
              >
                <Text style={styles.saveButtonText}>Lưu giao dịch</Text>
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
    backgroundColor: COLORS.background,
  },
  flatListContent: {
    paddingBottom: 100,
  },
  // --- Header ---
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: COLORS.primaryLight,
  },
  headerRight: {
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconButtonText: {
    fontSize: 20,
    color: COLORS.white,
  },
  // --- Summary Card ---
  summaryCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: -30, // Tạo hiệu ứng nổi
    marginBottom: 12,
    padding: 16,
    borderRadius: 24,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  balanceContainer: {
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  balanceLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 6,
    fontWeight: "600",
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -1,
    lineHeight: 36,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  summaryIconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  incomeIconBg: {
    // Không cần nền riêng nếu icon đã có màu
    // backgroundColor: COLORS.incomeLight,
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  expenseIconBg: {
    // Không cần nền riêng nếu icon đã có màu
    // backgroundColor: COLORS.expenseLight,
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryIcon: {
    fontSize: 18,
    fontWeight: "bold",
  },
  summaryDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 10,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: "700",
  },
  incomeAmount: {
    color: COLORS.income,
  },
  expenseAmount: {
    color: COLORS.expense,
  },
  summaryCount: {
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: 8,
  },
  // --- Transaction List & Search/Filter ---
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
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
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterTabActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textLight,
  },
  filterTabTextActive: {
    color: COLORS.primaryDark,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 0,
  },
  clearIcon: {
    color: COLORS.textLight,
    paddingLeft: 8,
  },
  // --- Transaction Item ---
  transactionItem: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 6,
    borderColor: COLORS.border, // Sẽ được override
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 2,
    marginRight: 10,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionCategory: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  transactionDot: {
    fontSize: 12,
    color: COLORS.border,
    marginHorizontal: 6,
  },
  transactionDate: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  transactionRight: {
    alignItems: "flex-end",
    flex: 1,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  amountTypeLabel: {
    fontSize: 11,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  incomeTypeLabel: {
    backgroundColor: COLORS.incomeLight,
    color: COLORS.income,
  },
  expenseTypeLabel: {
    backgroundColor: COLORS.expenseLight,
    color: COLORS.expense,
  },
  // --- Empty State ---
  emptyContainer: {
    flexGrow: 1,
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
    color: COLORS.textLight,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  // --- Add Button ---
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  addButtonText: {
    fontSize: 36,
    color: COLORS.white,
    fontWeight: "300",
  },
  // --- Modal ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 20,
    color: COLORS.textLight,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  // --- Type/Category Selection ---
  typeContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  typeButtonIncome: {
    backgroundColor: COLORS.incomeLight,
    borderColor: COLORS.income,
  },
  typeButtonExpense: {
    backgroundColor: COLORS.expenseLight,
    borderColor: COLORS.expense,
  },
  typeButtonText: {
    fontSize: 15,
    color: COLORS.textLight,
    fontWeight: "600",
  },
  typeButtonTextIncome: {
    color: COLORS.income,
  },
  typeButtonTextExpense: {
    color: COLORS.expense,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
    marginTop: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  categoryChipIcon: {
    marginRight: 6,
  },
  categoryChipText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  categoryChipTextActive: {
    color: COLORS.primaryDark,
    fontWeight: "600",
  },
  // --- Modal Buttons ---
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: COLORS.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textLight,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
});
