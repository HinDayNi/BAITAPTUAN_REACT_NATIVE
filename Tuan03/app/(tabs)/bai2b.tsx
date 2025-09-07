import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/image.png")}
        style={styles.eyeImage}
      />

      <View style={styles.inputWrapper}>
        <FontAwesome
          name="user"
          size={20}
          color="#555"
          style={styles.iconLeft}
        />
        <TextInput
          style={styles.input}
          placeholder="Please input user name"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#A9A9A9"
        />
      </View>

      <View style={styles.inputWrapper}>
        <FontAwesome
          name="lock"
          size={20}
          color="#555"
          style={styles.iconLeft}
        />
        <TextInput
          style={styles.input}
          placeholder="Please input password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#A9A9A9"
        />
      </View>

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <TouchableOpacity>
          <Text style={styles.linkText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.linkText}>Forgot Password</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.otherLoginText}>Other Login Methods</Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={[styles.socialIcon, { backgroundColor: "#2196F3" }]}
        >
          <FontAwesome name="user-plus" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.socialIcon, { backgroundColor: "#FF9800" }]}
        >
          <FontAwesome name="wifi" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.socialIcon, { backgroundColor: "#3B5998" }]}
        >
          <FontAwesome name="facebook" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  eyeImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  inputWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  iconLeft: {
    marginRight: 10,
  },
  iconRight: {
    position: "absolute",
    right: 15,
    top: Platform.OS === "ios" ? 15 : 13,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 20,
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
  linkText: {
    color: "#000",
  },
  otherLoginText: {
    marginTop: 25,
    fontSize: 14,
    color: "#555",
    fontWeight: "bold",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  socialIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
