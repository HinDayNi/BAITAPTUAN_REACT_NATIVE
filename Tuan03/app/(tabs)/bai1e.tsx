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

// export default function Register() {
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [birthday, setBirthday] = useState("");
//   const [gender, setGender] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>REGISTER</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Name"
//         value={name}
//         onChangeText={setName}
//         placeholderTextColor="#A9A9A9"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Phone"
//         value={phone}
//         onChangeText={setPhone}
//         keyboardType="phone-pad"
//         placeholderTextColor="#A9A9A9"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         placeholderTextColor="#A9A9A9"
//       />

//       <View style={styles.inputWrapper}>
//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           secureTextEntry={!showPassword}
//           value={password}
//           onChangeText={setPassword}
//           placeholderTextColor="#A9A9A9"
//         />
//         <TouchableOpacity
//           style={styles.eyeIconInside}
//           onPress={() => setShowPassword(!showPassword)}
//         >
//           <FontAwesome
//             name={showPassword ? "eye-slash" : "eye"}
//             size={20}
//             color="#555"
//           />
//         </TouchableOpacity>
//       </View>

//       <TextInput
//         style={styles.input}
//         placeholder="Birthday"
//         value={birthday}
//         onChangeText={setBirthday}
//         placeholderTextColor="#A9A9A9"
//       />

//       <View style={styles.genderContainer}>
//         <TouchableOpacity
//           style={styles.radioOption}
//           onPress={() => setGender("Male")}
//         >
//           <View style={styles.radioCircle}>
//             {gender === "Male" && <View style={styles.radioDot} />}
//           </View>
//           <Text style={styles.radioLabel}>Male</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.radioOption}
//           onPress={() => setGender("Female")}
//         >
//           <View style={styles.radioCircle}>
//             {gender === "Female" && <View style={styles.radioDot} />}
//           </View>
//           <Text style={styles.radioLabel}>Female</Text>
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity style={styles.button}>
//         <Text style={styles.buttonText}>REGISTER</Text>
//       </TouchableOpacity>

//       <Text style={styles.termsText}>
//         When you agree to terms and conditions
//       </Text>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#e9ffe6",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#555",
//     marginBottom: 20,
//   },
//   input: {
//     width: "100%",
//     height: 50,
//     backgroundColor: "#F2F2F2",
//     paddingHorizontal: 15,
//     borderRadius: 8,
//     marginVertical: 8,
//   },
//   inputWrapper: {
//     width: "100%",
//     position: "relative",
//   },
//   eyeIconInside: {
//     position: "absolute",
//     right: 15,
//     top: Platform.OS === "ios" ? 15 : 20,
//   },
//   genderContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     width: "100%",
//     marginVertical: 10,
//   },
//   radioOption: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   radioCircle: {
//     height: 20,
//     width: 20,
//     borderRadius: 10,
//     borderWidth: 2,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 8,
//   },
//   radioDot: {
//     height: 10,
//     width: 10,
//     borderRadius: 5,
//     backgroundColor: "black",
//   },
//   radioLabel: {
//     fontSize: 16,
//     color: "#555",
//     fontWeight: "bold",
//   },
//   button: {
//     width: "100%",
//     height: 50,
//     backgroundColor: "#E53935",
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 8,
//     marginTop: 20,
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   termsText: {
//     fontSize: 12,
//     color: "#888",
//     marginTop: 10,
//     textAlign: "center",
//   },
// });
