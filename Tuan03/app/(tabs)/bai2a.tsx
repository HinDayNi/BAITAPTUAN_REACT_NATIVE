// import React, { useState } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Platform,
// } from "react-native";
// import { FontAwesome } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";

// export default function Login() {
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <LinearGradient
//       colors={["#FBCB00", "#BF9A00"]}
//       locations={[0.8, 1]}
//       style={styles.container}
//     >
//       <Text style={styles.title}>LOGIN</Text>

//       <View style={styles.inputWrapper}>
//         <FontAwesome
//           name="user"
//           size={20}
//           color="#555"
//           style={styles.iconLeft}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Name"
//           value={name}
//           onChangeText={setName}
//           placeholderTextColor="#A9A9A9"
//         />
//       </View>

//       <View style={styles.inputWrapper}>
//         <FontAwesome
//           name="lock"
//           size={20}
//           color="#555"
//           style={styles.iconLeft}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           secureTextEntry={!showPassword}
//           value={password}
//           onChangeText={setPassword}
//           placeholderTextColor="#A9A9A9"
//         />
//         <TouchableOpacity
//           style={styles.iconRight}
//           onPress={() => setShowPassword(!showPassword)}
//         >
//           <FontAwesome
//             name={showPassword ? "eye-slash" : "eye"}
//             size={20}
//             color="#555"
//           />
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity style={styles.button}>
//         <Text style={styles.buttonText}>LOGIN</Text>
//       </TouchableOpacity>

//       <TouchableOpacity>
//         <Text style={styles.createAccount}>CREATE ACCOUNT</Text>
//       </TouchableOpacity>
//     </LinearGradient>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#000",
//     width: "100%",
//     alignItems: "center",
//     marginBottom: 60,
//   },
//   inputWrapper: {
//     width: "100%",
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#C4C4C44D",
//     borderColor: "white",
//     borderWidth: 1,
//     borderRadius: 8,
//     marginVertical: 10,
//     paddingHorizontal: 10,
//     position: "relative",
//   },
//   iconLeft: {
//     marginRight: 10,
//   },
//   iconRight: {
//     position: "absolute",
//     right: 15,
//     top: Platform.OS === "ios" ? 15 : 13,
//   },
//   input: {
//     flex: 1,
//     height: 50,
//     fontSize: 16,
//     color: "#333",
//   },
//   button: {
//     width: "100%",
//     height: 50,
//     backgroundColor: "#000",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 20,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   createAccount: {
//     marginTop: 25,
//     fontSize: 25,
//     color: "#000",
//     fontWeight: "bold",
//   },
// });
