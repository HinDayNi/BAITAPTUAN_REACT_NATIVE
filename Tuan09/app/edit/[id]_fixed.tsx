import React, { useState, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import * as DB from "../../database/db";

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

export default function EditTransaction() {
  const { id, title, amount, category, type, createdAt } =
    useLocalSearchParams();

  const [editTitle, setEditTitle] = useState((title as string) || "");
  const [editAmount, setEditAmount] = useState((amount as string) || "");
  const [selectedCategory, setSelectedCategory] = useState(
    (category as string) || CATEGORIES[0]
  );
  const [selectedType, setSelectedType] = useState<"Thu" | "Chi">(
    (type as "Thu" | "Chi") || "Chi"
  );

  const titleInputRef = useRef<TextInput>(null);
  const amountInputRef = useRef<TextInput>(null);

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

  const handleSave = async () => {
    if (!editTitle.trim() || !editAmount.trim()) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    const numAmount = parseFloat(editAmount.replace(/,/g, ""));
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ");
      return;
    }

    try {
      const updatedTransaction: Transaction = {
        title: editTitle.trim(),
        amount: numAmount,
        category: selectedCategory,
        type: selectedType,
        createdAt: createdAt as string,
      };

      await DB.updateTransaction(parseInt(id as string), updatedTransaction);

      Alert.alert("Thành công", "Giao dịch đã được cập nhật", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error updating transaction:", error);
      Alert.alert("Lỗi", "Không thể cập nhật giao dịch");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa giao dịch</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Thông tin gốc */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Feather name="calendar" size={16} color={COLORS.textLight} />
            <Text style={styles.infoLabel}>Ngày tạo:</Text>
            <Text style={styles.infoValue}>{createdAt}</Text>
          </View>
        </View>

        {/* Form chỉnh sửa */}
        <View style={styles.formCard}>
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
                  selectedType === "Thu" && styles.typeButtonTextIncome,
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
                  selectedType === "Chi" && styles.typeButtonTextExpense,
                ]}
              >
                <Ionicons name="card-outline" size={16} /> Chi tiêu
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>Tiêu đề</Text>
          <TextInput
            ref={titleInputRef}
            style={styles.input}
            placeholder="VD: Ăn trưa tại nhà hàng"
            placeholderTextColor={COLORS.textLight}
            value={editTitle}
            onChangeText={setEditTitle}
          />

          <Text style={styles.inputLabel}>Số tiền (₫)</Text>
          <TextInput
            ref={amountInputRef}
            style={styles.input}
            placeholder="0"
            placeholderTextColor={COLORS.textLight}
            value={editAmount}
            onChangeText={setEditAmount}
            keyboardType="numeric"
          />

          <Text style={styles.inputLabel}>Danh mục</Text>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map((cat) => {
              const iconData = getCategoryIcon(cat);
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    selectedCategory === cat && styles.categoryChipActive,
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.7}
                >
                  {iconData.set === "Ionicons" ? (
                    <Ionicons
                      name={iconData.name as any}
                      size={18}
                      color={
                        selectedCategory === cat
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
                        selectedCategory === cat
                          ? COLORS.primary
                          : COLORS.textLight
                      }
                      style={styles.categoryChipIcon}
                    />
                  )}
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategory === cat && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.white,
  },
  headerSpacer: {
    width: 44,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
    flex: 1,
  },
  formCard: {
    backgroundColor: COLORS.white,
    padding: 24,
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
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
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  button: {
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
