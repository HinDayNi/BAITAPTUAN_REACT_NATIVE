import { View, Text, StyleSheet } from "react-native";
import ChatShop from "./chatshop";

export default function App() {
  return (
    <View style={styles.container}>
      <ChatShop />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
