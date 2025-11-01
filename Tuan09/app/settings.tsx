import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DB from "../database/db";

const API_URL_KEY = "@api_url";

export default function Settings() {
  const [apiUrl, setApiUrl] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadApiUrl();
  }, []);

  const loadApiUrl = async () => {
    try {
      const savedUrl = await AsyncStorage.getItem(API_URL_KEY);
      if (savedUrl) {
        setApiUrl(savedUrl);
      }
    } catch (error) {
      console.error("Error loading API URL:", error);
    }
  };

  const saveApiUrl = async () => {
    try {
      if (!apiUrl.trim()) {
        Alert.alert("Lỗi", "Vui lòng nhập URL API");
        return;
      }

      // Kiểm tra URL hợp lệ
      if (!apiUrl.startsWith("http://") && !apiUrl.startsWith("https://")) {
        Alert.alert("Lỗi", "URL phải bắt đầu bằng http:// hoặc https://");
        return;
      }

      // Kiểm tra kết nối đến API
      try {
        const response = await fetch(apiUrl);
        // Chấp nhận cả 200 và 404 (404 có nghĩa là endpoint tồn tại nhưng chưa có data)
        if (!response.ok && response.status !== 404) {
          Alert.alert(
            "Cảnh báo",
            `Không thể kết nối đến API (status: ${response.status}). Bạn vẫn muốn lưu URL này?`,
            [
              { text: "Hủy", style: "cancel" },
              {
                text: "Lưu",
                onPress: async () => {
                  await AsyncStorage.setItem(API_URL_KEY, apiUrl.trim());
                  Alert.alert("Thành công", "Đã lưu URL API");
                },
              },
            ]
          );
          return;
        }
      } catch {
        Alert.alert(
          "Cảnh báo",
          "Không thể kết nối đến API. Vui lòng kiểm tra lại URL và kết nối mạng.",
          [
            { text: "Hủy", style: "cancel" },
            {
              text: "Lưu",
              onPress: async () => {
                await AsyncStorage.setItem(API_URL_KEY, apiUrl.trim());
                Alert.alert("Thành công", "Đã lưu URL API");
              },
            },
          ]
        );
        return;
      }

      await AsyncStorage.setItem(API_URL_KEY, apiUrl.trim());
      Alert.alert(
        "Thành công",
        "Đã lưu URL API và xác nhận kết nối thành công"
      );
    } catch (error) {
      console.error("Error saving API URL:", error);
      Alert.alert("Lỗi", "Không thể lưu URL API");
    }
  };

  const handleSync = async () => {
    try {
      const savedUrl = await AsyncStorage.getItem(API_URL_KEY);
      const urlToUse = savedUrl || apiUrl;

      if (!urlToUse.trim()) {
        Alert.alert("Lỗi", "Vui lòng nhập và lưu URL API trước khi đồng bộ");
        return;
      }

      Alert.alert(
        "Xác nhận đồng bộ",
        "Thao tác này sẽ xóa toàn bộ dữ liệu trên API và upload lại từ thiết bị. Bạn có chắc chắn?",
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Đồng bộ",
            style: "destructive",
            onPress: async () => {
              setIsSyncing(true);
              try {
                const count = await DB.syncToApi(urlToUse);
                Alert.alert(
                  "Thành công",
                  `Đã đồng bộ ${count} giao dịch lên API`
                );
              } catch (error: any) {
                console.error("Sync error:", error);
                Alert.alert(
                  "Lỗi đồng bộ",
                  error.message ||
                    "Không thể đồng bộ dữ liệu. Vui lòng kiểm tra URL API."
                );
              } finally {
                setIsSyncing(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error in handleSync:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi đồng bộ");
      setIsSyncing(false);
    }
  };

  const openMockApiGuide = () => {
    Linking.openURL("https://mockapi.io/");
  };

  const showApiStructure = () => {
    Alert.alert(
      "Cấu trúc API",
      `Endpoint MockAPI cần có cấu trúc:

📋 Resource name: transactions (hoặc tương tự)

🔧 Schema:
• title: string
• amount: number
• category: string
• createdAt: string
• type: string

📝 Ví dụ URL:
https://[your-id].mockapi.io/transactions

⚠️ Lưu ý:
- Không cần trường id, isDeleted, deletedAt
- Chỉ đồng bộ giao dịch chưa xóa`,
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt đồng bộ</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔗 Cấu hình API</Text>

          <Text style={styles.label}>URL API MockAPI:</Text>
          <TextInput
            style={styles.input}
            value={apiUrl}
            onChangeText={setApiUrl}
            placeholder="https://your-id.mockapi.io/transactions"
            placeholderTextColor="#94a3b8"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity style={styles.saveButton} onPress={saveApiUrl}>
            <Text style={styles.saveButtonText}>💾 Lưu URL</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.helpButton}
            onPress={showApiStructure}
          >
            <Text style={styles.helpButtonText}>📋 Xem cấu trúc API</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={openMockApiGuide}
          >
            <Text style={styles.linkButtonText}>
              🌐 Mở MockAPI.io (tạo API mới)
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔄 Đồng bộ dữ liệu</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              • Xóa toàn bộ dữ liệu trên API{"\n"}• Upload tất cả giao dịch từ
              thiết bị{"\n"}• Chỉ đồng bộ giao dịch chưa xóa
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.syncButton, isSyncing && styles.syncButtonDisabled]}
            onPress={handleSync}
            disabled={isSyncing}
          >
            <Text style={styles.syncButtonText}>
              {isSyncing ? "⏳ Đang đồng bộ..." : "🔄 Đồng bộ lên API"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ Hướng dẫn</Text>

          <View style={styles.guideBox}>
            <Text style={styles.guideText}>
              <Text style={styles.guideStep}>Bước 1:</Text> Truy cập MockAPI.io
              và tạo project mới{"\n\n"}
              <Text style={styles.guideStep}>Bước 2:</Text> Tạo resource
              transactions với schema theo cấu trúc{"\n\n"}
              <Text style={styles.guideStep}>Bước 3:</Text> Copy URL endpoint và
              paste vào ô trên{"\n\n"}
              <Text style={styles.guideStep}>Bước 4:</Text> Nhấn Lưu URL sau đó
              nhấn Đồng bộ lên API
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1e293b",
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: "#60a5fa",
    fontSize: 16,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  placeholder: {
    width: 80,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#0f172a",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginBottom: 8,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  helpButton: {
    backgroundColor: "#475569",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  helpButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  linkButton: {
    backgroundColor: "#334155",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  linkButtonText: {
    color: "#60a5fa",
    fontSize: 14,
  },
  infoBox: {
    backgroundColor: "#0f172a",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  infoText: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 22,
  },
  syncButton: {
    backgroundColor: "#10b981",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  syncButtonDisabled: {
    backgroundColor: "#475569",
  },
  syncButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  guideBox: {
    backgroundColor: "#0f172a",
    borderRadius: 8,
    padding: 16,
  },
  guideText: {
    color: "#cbd5e1",
    fontSize: 14,
    lineHeight: 24,
  },
  guideStep: {
    color: "#60a5fa",
    fontWeight: "bold",
  },
});
