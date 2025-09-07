// import React, { useState } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
// } from "react-native";
// import { FontAwesome, Fontisto } from "@expo/vector-icons";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <View style={styles.container}>
//       <View style={styles.f1}>
//         <Text style={styles.title}>LOGIN</Text>
//       </View>

//       <View style={styles.f2}>
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           keyboardType="email-address"
//           placeholderTextColor="#A9A9A9"
//           value={email}
//           onChangeText={setEmail}
//         />
//         <View style={styles.inputWrapper}>
//           <TextInput
//             style={styles.input}
//             placeholder="Password"
//             secureTextEntry={!showPassword}
//             placeholderTextColor="#A9A9A9"
//             value={password}
//             onChangeText={setPassword}
//           />
//           <TouchableOpacity
//             style={styles.eyeIconInside}
//             onPress={() => setShowPassword(!showPassword)}
//           >
//             <FontAwesome
//               name={showPassword ? "eye-slash" : "eye"}
//               size={20}
//               color="#555"
//             />
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View style={styles.f3}>
//         <TouchableOpacity style={styles.button}>
//           <Text style={styles.textButton}>LOGIN</Text>
//         </TouchableOpacity>
//         <View style={styles.f3_1}>
//           <Text style={styles.termsText}>
//             When you agree to terms and conditions
//           </Text>
//           <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
//           <Text style={styles.orLoginText}>Or login with</Text>
//         </View>
//       </View>

//       <View style={styles.f4}>
//         <View style={styles.socialLogin}>
//           <TouchableOpacity
//             style={[styles.socialIconContainer, styles.facebookBg]}
//           >
//             <FontAwesome name="facebook" size={24} color="white" />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.socialIconContainer, styles.linkedinBg]}
//           >
//             <Fontisto name="linkedin" size={24} color="white" />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.socialIconContainer, styles.googleBg]}
//           >
//             <FontAwesome name="google" size={24} color="white" />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#e9ffe6",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   f1: {
//     flex: 1,
//     justifyContent: "flex-end",
//     marginBottom: 20,
//   },
//   f2: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     width: "80%",
//   },
//   passwordContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "100%",
//     marginVertical: 10,
//   },
//   eyeIcon: {
//     padding: 10,
//   },
//   f3: {
//     flex: 1,
//     justifyContent: "flex-start",
//     alignItems: "center",
//     width: "80%",
//     marginTop: 20,
//   },
//   f3_1: {
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 15,
//   },
//   f4: {
//     flex: 1,
//     justifyContent: "flex-start",
//     alignItems: "center",
//     width: "80%",
//     marginTop: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#555",
//   },
//   input: {
//     width: "100%",
//     height: 50,
//     backgroundColor: "#F2F2F2",
//     paddingHorizontal: 15,
//     borderRadius: 8,
//   },
//   button: {
//     width: "100%",
//     height: 50,
//     backgroundColor: "#E53935",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 8,
//   },
//   textButton: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   termsText: {
//     fontSize: 12,
//     color: "#888",
//     marginTop: 5,
//   },
//   forgotPasswordText: {
//     color: "#5D25FA",
//     marginTop: 5,
//   },
//   orLoginText: {
//     color: "#888",
//     marginTop: 5,
//   },
//   socialLogin: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//     marginTop: 10,
//   },
//   socialIconContainer: {
//     flex: 1,
//     height: 50,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 8,
//     marginHorizontal: 5,
//   },
//   facebookBg: {
//     backgroundColor: "#3B5998",
//   },
//   linkedinBg: {
//     backgroundColor: "#0077B5",
//   },
//   googleBg: {
//     backgroundColor: "#58b44bff",
//   },
//   inputWrapper: {
//     width: "100%",
//     position: "relative",
//     marginVertical: 10,
//   },

//   eyeIconInside: {
//     position: "absolute",
//     right: 15,
//     top: 15,
//     zIndex: 1,
//   },
// });
