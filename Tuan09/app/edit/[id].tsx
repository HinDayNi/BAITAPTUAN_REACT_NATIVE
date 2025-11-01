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
import * as DB from "../../database/db";

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

  // Sử dụng useRef để quản lý input
  const titleInputRef = useRef<TextInput>(null);
  const amountInputRef = useRef<TextInput>(null);

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

  const handleSave = async () => {
    if (!editTitle.trim() || !editAmount.trim()) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin");
      return;
    }

    const numAmount = parseFloat(editAmount);
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
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa giao dịch</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Thông tin gốc */}
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Ngày tạo</Text>
          <Text style={styles.infoValue}>{createdAt}</Text>
        </View>

        {/* Form chỉnh sửa */}
        <View style={styles.formCard}>
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
            value={editTitle}
            onChangeText={setEditTitle}
          />

          <Text style={styles.inputLabel}>Số tiền (₫)</Text>
          <TextInput
            ref={amountInputRef}
            style={styles.input}
            placeholder="0"
            placeholderTextColor="#999"
            value={editAmount}
            onChangeText={setEditAmount}
            keyboardType="numeric"
          />

          <Text style={styles.inputLabel}>Danh mục</Text>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  selectedCategory === cat && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={styles.categoryChipIcon}>
                  {getCategoryIcon(cat)}
                </Text>
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === cat && styles.categoryChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Lưu</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "300",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
  },
  formCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    marginBottom: 8,
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
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  button: {
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
