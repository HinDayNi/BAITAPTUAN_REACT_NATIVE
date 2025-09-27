import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";

//Bài 1: Dùng Flatlist

export default function ChatShop() {
  const router = useRouter();

  const goToHome = () => {
    router.push("/(tabs)");
  };

  const goToShop = () => {
    router.push("/(tabs)/shop");
  };

  type ItemData = {
    id: string;
    title: string;
    shop: string;
    image: any;
  };
  const DATA: ItemData[] = [
    {
      id: "1",
      title: "Ca nấu lẩu, nấu mì mini",
      shop: "Shop Devang",
      image: require("../../assets/images/ca_nau_lau.png"),
    },
    {
      id: "2",
      title: "1KG GÀ KHÔ BƠ TỎI...",
      shop: "Shop LTD Food",
      image: require("../../assets/images/do_choi_dang_mo_hinh.png"),
    },
    {
      id: "3",
      title: "Xe cần cẩu đa năng",
      shop: "Shop Thế giới đồ chơi",
      image: require("../../assets/images/ga_bo_toi.png"),
    },
    {
      id: "5",
      title: "Lãnh đạo giản đơn",
      shop: "Shop Minh Long Book",
      image: require("../../assets/images/hieu_long_con_tre.png"),
    },
    {
      id: "6",
      title: "Hiếu lòng con trẻ",
      shop: "Shop Minh Long Book",
      image: require("../../assets/images/trump 1.png"),
    },
    {
      id: "7",
      title: "Hiếu lòng con trẻ",
      shop: "Shop Minh Long Book",
      image: require("../../assets/images/xa_can_cau.png"),
    },
  ];

  type ItemProps = {
    item: ItemData;
  };

  const Item = ({ item }: ItemProps) => (
    <View style={styles.item}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.f1}>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
        <View style={styles.shopchat}>
          <Text style={styles.itemShop}>{item.shop}</Text>
          <TouchableOpacity style={styles.chatButton}>
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goToHome}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chat</Text>
          <TouchableOpacity style={styles.cartButton}>
            <Feather
              name="shopping-cart"
              size={24}
              color="black"
              style={styles.cartButtonText}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <View style={styles.conTitle}>
            <Text style={styles.title}>
              Bạn có thắc mắc với sản phẩm vừa xem. Đừng ngại chát với shop!
            </Text>
          </View>
          <FlatList
            data={DATA}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Item item={item} />}
            scrollEnabled
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <Feather name="menu" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <Feather name="home" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <AntDesign name="rollback" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#E5E5E5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1BA9FF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  cartButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  cartButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  conTitle: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 16,
    borderRadius: 4,
  },
  title: {
    fontSize: 14,
    color: "#000000",
    lineHeight: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 8,
    borderRadius: 4,
  },
  f1: {
    flex: 1,
    marginLeft: 12,
  },
  image: {
    width: 74,
    height: 74,
    resizeMode: "cover",
    borderRadius: 4,
  },
  itemContent: {
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "500",
  },
  itemShop: {
    fontSize: 14,
    color: "#E53935",
  },
  chatButton: {
    backgroundColor: "#F31111",
    width: 88,
    height: 38,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  chatButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  shopchat: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1BA9FF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    height: 60,
  },
  footerButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
});
