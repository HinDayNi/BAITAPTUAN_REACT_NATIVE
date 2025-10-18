import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";

declare function require(path: string): any;

const phoneImages = {
  "#C5F1FB": require("../../assets/images/vs_silver (1).png"),
  "#F30D0D": require("../../assets/images/vs_red (1).png"),
  "#000000": require("../../assets/images/vs_black (1).png"),
  "#234896": require("../../assets/images/vs_blue (1).png"),
};

export default function Screen02() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [selectedColor, setSelectedColor] = useState(
    (params.selectedColor as string) || "#234896"
  );

  const colors = [
    { name: "Bạc", color: "#C5F1FB" },
    { name: "Đỏ", color: "#F30D0D" },
    { name: "Đen", color: "#000000" },
    { name: "Xanh", color: "#234896" },
  ];

  const handleDone = () => {
    const selectedColorObj = colors.find((c) => c.color === selectedColor);
    router.push({
      pathname: "/screen01",
      params: {
        color: selectedColor,
        colorName: selectedColorObj?.name || "Xanh",
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={phoneImages[selectedColor as keyof typeof phoneImages]}
          style={styles.phoneImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>Điện Thoại Vsmart Joy 3</Text>
          <Text style={styles.productSubtitle}>Hàng chính hãng</Text>
          <Text style={styles.selectedColorText}>
            Màu:{" "}
            <Text style={styles.colorName}>
              {colors.find((c) => c.color === selectedColor)?.name}
            </Text>
          </Text>
          <Text style={styles.supplierText}>
            Cung cấp bởi <Text style={styles.supplierName}>Tiki Trading</Text>
          </Text>
          <Text style={styles.priceText}>1.790.000 đ</Text>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.chooseColorText}>Chọn một màu bên dưới:</Text>

        <View style={styles.colorContainer}>
          {colors.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.colorBox,
                { backgroundColor: item.color },
                selectedColor === item.color && styles.selectedColorBox,
              ]}
              onPress={() => setSelectedColor(item.color)}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>XONG</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topSection: {
    height: 180,
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "flex-start",
  },
  phoneImage: {
    width: 120,
    height: 150,
    resizeMode: "contain",
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
    paddingTop: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  productSubtitle: {
    fontSize: 16,
    color: "#000",
    marginBottom: 10,
  },
  selectedColorText: {
    fontSize: 14,
    color: "#000",
    marginBottom: 5,
  },
  colorName: {
    fontWeight: "bold",
  },
  supplierText: {
    fontSize: 14,
    color: "#000",
    marginBottom: 5,
  },
  supplierName: {
    fontWeight: "bold",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#EE0D0D",
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "#C4C4C4",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  chooseColorText: {
    fontSize: 18,
    color: "#000",
    marginBottom: 20,
    fontWeight: "500",
  },
  colorContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  colorBox: {
    width: 80,
    height: 80,
    marginVertical: 8,
    borderRadius: 4,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedColorBox: {
    borderWidth: 3,
    borderColor: "#fff",
  },
  doneButton: {
    backgroundColor: "#1952E294",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
