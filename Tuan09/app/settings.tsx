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
    backgroundColor: "#FAFBF9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#7FCF9A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 5,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: "#fff",
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
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5B6B6A",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#5B6B6A",
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    color: "#333",
    fontSize: 14,
    borderWidth: 2,
    borderColor: "#E8F5E8",
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: "#65B57E",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#7FCF9A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  helpButton: {
    backgroundColor: "#E8F5E8",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#7FCF9A",
  },
  helpButtonText: {
    color: "#65B57E",
    fontSize: 14,
    fontWeight: "600",
  },
  linkButton: {
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7DD3FC",
  },
  linkButtonText: {
    color: "#0369A1",
    fontSize: 14,
    fontWeight: "600",
  },
  infoBox: {
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#7FCF9A",
  },
  infoText: {
    color: "#5B6B6A",
    fontSize: 14,
    lineHeight: 22,
  },
  syncButton: {
    backgroundColor: "#7FCF9A",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    shadowColor: "#65B57E",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  syncButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  syncButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  guideBox: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E8F5E8",
  },
  guideText: {
    color: "#5B6B6A",
    fontSize: 14,
    lineHeight: 24,
  },
  guideStep: {
    color: "#65B57E",
    fontWeight: "bold",
  },
});
