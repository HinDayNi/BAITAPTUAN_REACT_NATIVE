import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AntDesign, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { phoneApi, Phone, PhoneColor } from "../../services/phoneApi";

const phoneImages = {
  "#C5F1FB": require("../../assets/images/vs_silver (1).png"),
  "#F30D0D": require("../../assets/images/vs_red (1).png"),
  "#000000": require("../../assets/images/vs_black (1).png"),
  "#234896": require("../../assets/images/vs_blue (1).png"),
};

export default function Screen01() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [phone, setPhone] = useState<Phone | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState("#234896");
  const [selectedColorName, setSelectedColorName] = useState("Xanh");

  // Helper function - move before useEffect
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("vi-VN").format(parseInt(price)) + " đ";
  };

  // Load dữ liệu từ API
  useEffect(() => {
    loadPhoneData();
  }, []);

  // Update color when returning from screen02
  useEffect(() => {
    if (params.color) {
      setSelectedColor(params.color as string);
      setSelectedColorName(params.colorName as string);
    }
  }, [params.color, params.colorName]);

  const loadPhoneData = async () => {
    try {
      setLoading(true);
      const phoneData = await phoneApi.getPhone("1");
      setPhone(phoneData);
      console.log("Phone data loaded:", phoneData);
    } catch (error) {
      Alert.alert(
        "Lỗi",
        "Không thể tải dữ liệu sản phẩm. Sử dụng dữ liệu mặc định."
      );
      console.error("Failed to load phone data:", error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToColorSelect = () => {
    router.push({
      pathname: "/screen02",
      params: {
        selectedColor: selectedColor,
        phoneData: phone ? JSON.stringify(phone) : "",
      },
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  // Sử dụng dữ liệu từ API nếu có, nếu không thì dùng dữ liệu mặc định
  const displayName =
    phone?.name || "Điện Thoại Vsmart Joy 3 - Hàng chính hãng";
  const displayPrice = phone?.price ? formatPrice(phone.price) : "1.790.000 đ";
  const displayOriginalPrice = phone?.originalPrice
    ? formatPrice(phone.originalPrice)
    : "1.790.000 đ";
  const displayReviewCount = phone?.reviewCount || 828;
  const displayRating = phone?.rating || 5;
  const displayDiscount = phone?.discount || "Ở ĐÂU RẺ HƠN HOÀN TIỀN";
  const displayColorsCount = phone?.colors?.length || 4;

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={phoneImages[selectedColor as keyof typeof phoneImages]}
          style={styles.phoneImage}
        />
      </View>

      <Text style={styles.productTitle}>{displayName}</Text>

      <View style={styles.ratingContainer}>
        <View style={styles.stars}>
          {[...Array(displayRating)].map((_, index) => (
            <AntDesign key={index} name="star" size={18} color="#FFD700" />
          ))}
        </View>
        <Text style={styles.reviewText}>
          (Xem {displayReviewCount} đánh giá)
        </Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.currentPrice}>{displayPrice}</Text>
        <Text style={styles.originalPrice}>{displayOriginalPrice}</Text>
      </View>

      <View style={styles.discountContainer}>
        <Text style={styles.discountText}>{displayDiscount}</Text>
        <MaterialIcons name="help-outline" size={16} color="#000" />
      </View>

      <TouchableOpacity
        style={styles.colorButton}
        onPress={navigateToColorSelect}
      >
        <Text style={styles.colorButtonText}>
          {displayColorsCount} MÀU-CHỌN MÀU
        </Text>
        <View style={styles.colorInfo}>
          <Text style={styles.selectedColorText}></Text>
          <Ionicons name="chevron-forward" size={18} color="#000" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buyButton}>
        <Text style={styles.buyButtonText}>CHỌN MUA</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  centered: {
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  imageContainer: {
    padding: 10,
    marginBottom: 20,
  },
  phoneImage: {
    width: 200,
    height: 250,
    resizeMode: "contain",
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  stars: {
    flexDirection: "row",
    marginRight: 10,
    gap: 2,
  },
  reviewText: {
    fontSize: 14,
    color: "#666",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginRight: 15,
  },
  originalPrice: {
    fontSize: 16,
    color: "#999",
    textDecorationLine: "line-through",
  },
  discountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  discountText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FF0000",
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 5,
  },
  colorButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 12,
    width: "100%",
    marginBottom: 30,
  },
  colorButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  colorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  selectedColorText: {
    fontSize: 14,
    color: "#666",
  },
  buyButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
