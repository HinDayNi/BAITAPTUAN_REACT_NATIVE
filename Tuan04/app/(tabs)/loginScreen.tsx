import { LinearGradient } from "expo-linear-gradient";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
export default function LoginScreen() {
  return (
    <LinearGradient colors={["#fceabb", "#f8b500"]} style={styles.container}>
      <View style={styles.title}>LOGIN</View>
      <View style={styles.ip}>
        <TextInput placeholder="Name" style={styles.input} />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
        />
      </View>
      <View style={styles.btn}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.link}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {},
  ip: {},
  input: {
    backgroundColor: "#fff",
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  btn: {},
  button: { backgroundColor: "#333", padding: 15, borderRadius: 5 },
  buttonText: { color: "#fff", textAlign: "center" },
  link: { marginTop: 10, color: "#000", textAlign: "center" },
});
