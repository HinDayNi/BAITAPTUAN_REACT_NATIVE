import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Feather, AntDesign } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";

interface Product {
  id: string;
  name: string;
  price: string;
  discount: string;
  rating: number;
  reviews: number;
  image: any;
}

const DATA: Product[] = [
  {
    id: "1",
    name: "Cáp chuyển từ Cổng USB sang PS2...",
    price: "69.900 đ",
    discount: "-39%",
    rating: 4,
    reviews: 15,
    image: require("../../assets/images/daucam 1.png"),
  },
  {
    id: "2",
    name: "Cáp chuyển từ Cổng USB sang PS2...",
    price: "69.900 đ",
    discount: "-39%",
    rating: 4,
    reviews: 15,
    image: require("../../assets/images/giacchuyen 1.png"),
  },
  {
    id: "3",
    name: "Cáp chuyển từ Cổng USB sang PS2...",
    price: "69.900 đ",
    discount: "-39%",
    rating: 4,
    reviews: 15,
    image: require("../../assets/images/dauchuyendoipsps2 1.png"),
  },
  {
    id: "4",
    name: "Cáp chuyển từ Cổng USB sang PS2...",
    price: "69.900 đ",
    discount: "-39%",
    rating: 4,
    reviews: 15,
    image: require("../../assets/images/dauchuyendoi 1.png"),
  },
  {
    id: "5",
    name: "Cáp chuyển từ Cổng USB sang PS2...",
    price: "69.900 đ",
    discount: "-39%",
    rating: 4,
    reviews: 15,
    image: require("../../assets/images/carbusbtops2 1.png"),
  },
  {
    id: "6",
    name: "Cáp chuyển từ Cổng USB sang PS2...",
    price: "69.900 đ",
    discount: "-39%",
    rating: 4,
    reviews: 15,
    image: require("../../assets/images/daucam 1.png"),
  },
];

type ItemProps = {
  item: Product;
};

const ProductItem = ({ item }: ItemProps) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <AntDesign
          key={i}
          name="star"
          size={14}
          color={i < rating ? "#FFD700" : "#E0E0E0"}
          style={styles.starIcon}
        />
      );
    }
    return stars;
  };

  return (
    <TouchableOpacity style={styles.productItem}>
      <Image source={item.image} style={styles.productImage} />

      <Text style={styles.productName} numberOfLines={2}>
        {item.name}
      </Text>

      <View style={styles.ratingContainer}>
        <View style={styles.stars}>{renderStars(item.rating)}</View>
        <Text style={styles.reviewCount}>({item.reviews})</Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.discount}>{item.discount}</Text>
      </View>
    </TouchableOpacity>
  );
};
export default function Shop() {
  const router = useRouter();

  const goToHome = () => {
    router.push("/(tabs)");
  };

  const goToChatShop = () => {
    router.push("/(tabs)/chatshop");
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {/* Back button về Home */}
          <TouchableOpacity style={styles.backButton} onPress={goToHome}>
            <AntDesign name="arrow-left" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.searchContainer}>
            <Feather
              name="search"
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Dây cáp usb"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity style={styles.cartButton} onPress={goToChatShop}>
            <Feather name="shopping-cart" size={24} color="white" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>1</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton}>
            <Feather name="more-horizontal" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Product Grid */}
        <FlatList
          data={DATA}
          renderItem={({ item }) => <ProductItem item={item} />}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
        />

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <Feather name="menu" size={24} color="white" />
          </TouchableOpacity>

          {/* Home button */}
          <TouchableOpacity style={styles.footerButton} onPress={goToHome}>
            <Feather name="home" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.footerButton} onPress={goToChatShop}>
            <Feather name="message-circle" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E5E5E5",
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#1BA9FF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 4,
    alignItems: "center",
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  cartButton: {
    position: "relative",
    padding: 4,
  },
  cartBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#FF4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  menuButton: {
    padding: 4,
  },
  productList: {
    padding: 16,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  productItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    width: "48%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stars: {
    flexDirection: "row",
    marginRight: 6,
  },
  starIcon: {
    marginRight: 1,
  },
  reviewCount: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  discount: {
    fontSize: 12,
    color: "#999",
  },
  footer: {
    flexDirection: "row",
    backgroundColor: "#1BA9FF",
    paddingVertical: 12,
    justifyContent: "space-around",
    alignItems: "center",
  },
  footerButton: {
    padding: 8,
  },
});
