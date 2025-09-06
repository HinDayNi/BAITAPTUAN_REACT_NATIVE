import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

export default function FirstScreen() {
  return (
    <LinearGradient
      colors={["#E0F7FA", "#00ACC1"]}
      style={styles.container}
      locations={[0.85, 1]}
    >
      {/* Logo */}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 60,
        }}
      >
        <FontAwesome5 name="shopping-bag" size={120} color="black" />
      </View>

      {/* Title + Subtitle */}
      <View style={{ justifyContent: "center" }}>
        <Text style={styles.title}>FORGET {"\n"} PASSWORD</Text>
        <Text style={styles.subtitle}>
          Provide your account’s email for which you want to reset your password
        </Text>
      </View>

      <View style={styles.emailContainer}>
        <MaterialIcons
          name="email"
          size={24}
          color="black"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#333"
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>NEXT</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 50,
    paddingTop: 30,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    lineHeight: 20,
    margin: 15,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C4C4C4",
    width: 320,
    height: 45,
    paddingHorizontal: 10,
    marginVertical: 50,
  },
  icon: {},
  input: {},
  buttonContainer: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 130,
  },
  button: {
    width: 320,
    height: 50,
    backgroundColor: "#E3C000",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textWork: {
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 60,
  },
});
