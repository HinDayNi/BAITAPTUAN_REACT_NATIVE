import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function ChatShop() {
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
      <View style={styles.screen}>
        <View style={styles.container}>
          <View style={styles.conTitle}>
            <Text style={styles.title}>
              Bạn có thắc mắc với sản phẩm vừa xem đừng ngại chát với shop!
            </Text>
          </View>
          <FlatList
            data={DATA}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Item item={item} />}
            scrollEnabled
            showsVerticalScrollIndicator={true}
          />
        </View>
      </View>
    </SafeAreaProvider>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  conTitle: {},
  title: {
    fontSize: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  f1: {
    flex: 1,
    marginLeft: 10,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  itemContent: {},
  itemTitle: {},
  itemShop: {},
  chatButton: {
    backgroundColor: "#F31111",
    width: 88,
    height: 38,
  },
  chatButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 35,
    fontWeight: "bold",
  },
  shopchat: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
