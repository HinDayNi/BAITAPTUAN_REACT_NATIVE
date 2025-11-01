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
  ActivityIndicator, // Thêm cho trạng thái loading
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DB from "../database/db";
import { Feather, MaterialIcons } from "@expo/vector-icons"; // Import Expo Icons

// --- Blue Pastel & Modern Colors ---
const PRIMARY_BLUE = "#8CB9E3"; // Blue Pastel chủ đạo
const PRIMARY_DARK = "#4A709E"; // Xanh đậm nhẹ
const BG_COLOR = "#F4F7FB"; // Màu nền trắng xám nhạt
const INPUT_BG_COLOR = "#FFFFFF"; // Màu nền input/card
const SUCCESS_COLOR = "#10B981"; // Xanh lá cho thành công/kết nối
const DANGER_COLOR = "#EF4444"; // Đỏ cho cảnh báo/xóa

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
    if (!apiUrl.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập URL API");
      return;
    }

    if (!apiUrl.startsWith("http://") && !apiUrl.startsWith("https://")) {
      Alert.alert("Lỗi", "URL phải bắt đầu bằng http:// hoặc https://");
      return;
    } // Thêm logic kiểm tra kết nối để tăng trải nghiệm người dùng

    let connectionStatus = false;
    try {
      const response = await fetch(apiUrl.trim());
      if (response.ok || response.status === 404) {
        connectionStatus = true;
      }
    } catch {}

    if (!connectionStatus) {
      Alert.alert(
        "Cảnh báo",
        "Không thể kết nối đến API. Vui lòng kiểm tra lại URL và kết nối mạng.",
        [
          { text: "Hủy", style: "cancel" },
          {
            text: "Vẫn Lưu",
            onPress: async () => {
              await AsyncStorage.setItem(API_URL_KEY, apiUrl.trim());
              Alert.alert("Thành công", "Đã lưu URL API");
            },
          },
        ]
      );
      return;
    }

    try {
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
    const savedUrl = await AsyncStorage.getItem(API_URL_KEY);
    const urlToUse = savedUrl || apiUrl;

    if (!urlToUse.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập và lưu URL API trước khi đồng bộ");
      return;
    }

    Alert.alert(
      "Xác nhận đồng bộ (Overwrite)",
      "Thao tác này sẽ XÓA toàn bộ dữ liệu trên API và upload lại từ thiết bị. Bạn có chắc chắn?",
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
  };

  const openMockApiGuide = () => {
    Linking.openURL("https://mockapi.io/");
  };

  const showApiStructure = () => {
    Alert.alert(
      "Cấu trúc API",
      `Endpoint MockAPI cần có cấu trúc:

📋 Resource name: transactions

🔧 Schema (Fields):
• title: string
• amount: number
• category: string
• createdAt: string
• type: "Thu" | "Chi" (string)

📝 Ví dụ URL:
https://[your-id].mockapi.io/transactions`,
      [{ text: "Đã hiểu" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
            <StatusBar style="light" />      {/* Header */}     {" "}
      <View style={styles.header}>
               {" "}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
                    <Feather name="arrow-left" size={24} color="#FFFFFF" />     
           {" "}
        </TouchableOpacity>
                <Text style={styles.headerTitle}>Cài đặt đồng bộ</Text>
                <View style={styles.headerPlaceholder} />     {" "}
      </View>
           {" "}
      <ScrollView style={styles.content}>
                        {/* Cấu hình API */}       {" "}
        <View style={styles.card}>
                   {" "}
          <Text style={styles.sectionTitle}>
                        <Feather name="link" size={20} color={PRIMARY_DARK} />{" "}
            Cấu hình API          {" "}
          </Text>
                    <Text style={styles.label}>URL API MockAPI:</Text>
                   {" "}
          <TextInput
            style={styles.input}
            value={apiUrl}
            onChangeText={setApiUrl}
            placeholder="https://your-id.mockapi.io/transactions"
            placeholderTextColor="#A9B5C8"
            autoCapitalize="none"
            autoCorrect={false}
          />
                   {" "}
          <TouchableOpacity style={styles.saveButton} onPress={saveApiUrl}>
                        <Feather name="save" size={20} color="#FFFFFF" />       
               {" "}
            <Text style={styles.saveButtonText}>
              Lưu URL & Kiểm tra kết nối
            </Text>
                     {" "}
          </TouchableOpacity>
                   {" "}
          <View style={styles.buttonGroup}>
                       {" "}
            <TouchableOpacity
              style={[styles.helpButton, { flex: 1 }]}
              onPress={showApiStructure}
            >
                           {" "}
              <Feather name="info" size={16} color={PRIMARY_DARK} />           
                <Text style={styles.helpButtonText}>Cấu trúc</Text>           {" "}
            </TouchableOpacity>
                       {" "}
            <TouchableOpacity
              style={[styles.linkButton, { flex: 1 }]}
              onPress={openMockApiGuide}
            >
                           {" "}
              <Feather name="external-link" size={16} color={PRIMARY_DARK} />   
                        <Text style={styles.helpButtonText}>Tạo MockAPI</Text> 
                       {" "}
            </TouchableOpacity>
                     {" "}
          </View>
                 {" "}
        </View>
                {/* Đồng bộ dữ liệu */}       {" "}
        <View style={styles.card}>
                   {" "}
          <Text style={styles.sectionTitle}>
                        <Feather name="repeat" size={20} color={PRIMARY_DARK} />{" "}
            Đồng bộ dữ liệu          {" "}
          </Text>
                   {" "}
          <View style={styles.infoBox}>
                       {" "}
            <MaterialIcons
              name="warning-amber"
              size={20}
              color={PRIMARY_DARK}
              style={{ marginRight: 8 }}
            />
                       {" "}
            <Text style={styles.infoText}>
                            **Cảnh báo:** Thao tác này sẽ **XÓA** toàn bộ dữ
              liệu giao dịch trên API và tải lại từ thiết bị.            {" "}
            </Text>
                     {" "}
          </View>
                   {" "}
          <TouchableOpacity
            style={[styles.syncButton, isSyncing && styles.syncButtonDisabled]}
            onPress={handleSync}
            disabled={isSyncing}
          >
                       {" "}
            {isSyncing ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Feather name="upload-cloud" size={20} color="#FFFFFF" />
            )}
                       {" "}
            <Text style={styles.syncButtonText}>
                            {isSyncing ? "Đang đồng bộ..." : "Đồng bộ lên API"} 
                       {" "}
            </Text>
                     {" "}
          </TouchableOpacity>
                 {" "}
        </View>
                {/* Hướng dẫn */}       {" "}
        <View style={styles.card}>
                   {" "}
          <Text style={styles.sectionTitle}>
                       {" "}
            <Feather name="help-circle" size={20} color={PRIMARY_DARK} /> Hướng
            dẫn          {" "}
          </Text>
                   {" "}
          <View style={styles.guideBox}>
                       {" "}
            <Text style={styles.guideText}>
                            <Text style={styles.guideStep}>1. Truy cập</Text>{" "}
              MockAPI.io và tạo project mới.{"\n\n"}             {" "}
              <Text style={styles.guideStep}>2. Tạo resource</Text>{" "}
              **transactions** với schema theo cấu trúc đã xem.{"\n\n"}         
                  <Text style={styles.guideStep}>3. Copy URL</Text> endpoint và
              paste vào ô cấu hình.{"\n\n"}             {" "}
              <Text style={styles.guideStep}>4. Lưu URL</Text> sau đó nhấn
              **Đồng bộ lên API** để sao lưu.            {" "}
            </Text>
                     {" "}
          </View>
                 {" "}
        </View>
             {" "}
      </ScrollView>
         {" "}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: PRIMARY_BLUE,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: PRIMARY_DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  backButtonText: {
    // Icon đã thay thế text
    display: "none",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  }, // --- Card Chung ---
  card: {
    marginBottom: 20,
    backgroundColor: INPUT_BG_COLOR,
    borderRadius: 20,
    padding: 24,
    shadowColor: PRIMARY_DARK,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: PRIMARY_DARK,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: PRIMARY_DARK,
    marginBottom: 10,
    fontWeight: "600",
  },
  input: {
    backgroundColor: BG_COLOR,
    borderRadius: 12,
    padding: 16,
    color: PRIMARY_DARK,
    fontSize: 14,
    borderWidth: 1,
    borderColor: PRIMARY_BLUE + "40", // Viền xanh pastel nhạt
    marginBottom: 16,
  }, // --- Nút Lưu (Chính) ---

  saveButton: {
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    shadowColor: PRIMARY_DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  }, // --- Nút Nhóm (Inline) ---

  buttonGroup: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 4,
  },
  helpButton: {
    backgroundColor: BG_COLOR,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: PRIMARY_BLUE + "40",
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  helpButtonText: {
    color: PRIMARY_DARK,
    fontSize: 14,
    fontWeight: "600",
  },
  linkButton: {
    backgroundColor: BG_COLOR,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: PRIMARY_BLUE + "40",
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  }, // --- Info Box (Cảnh báo) ---

  infoBox: {
    backgroundColor: PRIMARY_BLUE + "20",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: PRIMARY_BLUE,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoText: {
    color: PRIMARY_DARK,
    fontSize: 14,
    lineHeight: 22,
    flexShrink: 1,
  }, // --- Nút Đồng bộ (Chính) ---
  syncButton: {
    backgroundColor: PRIMARY_BLUE,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    shadowColor: PRIMARY_DARK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  syncButtonDisabled: {
    backgroundColor: "#D1D5DB",
    shadowOpacity: 0,
  },
  syncButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  }, // --- Hướng dẫn ---
  guideBox: {
    backgroundColor: BG_COLOR,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: PRIMARY_BLUE + "40",
  },
  guideText: {
    color: PRIMARY_DARK,
    fontSize: 14,
    lineHeight: 24,
  },
  guideStep: {
    color: PRIMARY_DARK,
    fontWeight: "700",
  },
});
