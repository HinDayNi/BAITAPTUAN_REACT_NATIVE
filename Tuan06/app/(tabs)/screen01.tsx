import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";

const phoneImages = {
  "#C5F1FB": require("../../assets/images/vs_silver (1).png"),
  "#F30D0D": require("../../assets/images/vs_red.png"),
  "#000000": require("../../assets/images/vs_black.png"),
  "#234896": require("../../assets/images/vs_blue.png"),
};

export default function Screen01() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [selectedColor, setSelectedColor] = useState(
    (params.color as string) || "#234896"
  );
  const [selectedColorName, setSelectedColorName] = useState(
    (params.colorName as string) || "Xanh"
  );

  const navigateToColorSelect = () => {
    router.push({
      pathname: "/screen02",
      params: {
        selectedColor: selectedColor,
      },
    });
  };

  // Update color when returning from screen02
  if (params.color && params.color !== selectedColor) {
    setSelectedColor(params.color as string);
    setSelectedColorName(params.colorName as string);
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={phoneImages[selectedColor as keyof typeof phoneImages]}
          style={styles.phoneImage}
        />
      </View>

      <Text style={styles.productTitle}>
        Điện Thoại Vsmart Joy 3 - Hàng chính hãng
      </Text>

      <View style={styles.ratingContainer}>
        <View style={styles.stars}>
          <AntDesign name="star" size={18} color="#FFD700" />
          <AntDesign name="star" size={18} color="#FFD700" />
          <AntDesign name="star" size={18} color="#FFD700" />
          <AntDesign name="star" size={18} color="#FFD700" />
          <AntDesign name="star" size={18} color="#FFD700" />
        </View>
        <Text style={styles.reviewText}>(Xem 828 đánh giá)</Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.currentPrice}>1.790.000 đ</Text>
        <Text style={styles.originalPrice}>1.790.000 đ</Text>
      </View>

      <View style={styles.discountContainer}>
        <Text style={styles.discountText}>Ở ĐÂU RẺ HƠN HOÀN TIỀN</Text>
        <MaterialIcons name="help-outline" size={16} color="#000" />
      </View>

      <TouchableOpacity
        style={styles.colorButton}
        onPress={navigateToColorSelect}
      >
        <Text style={styles.colorButtonText}>4 MÀU-CHỌN MÀU</Text>
        <View style={styles.colorInfo}>
          <Text style={styles.selectedColorText}>Màu: {selectedColorName}</Text>
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
