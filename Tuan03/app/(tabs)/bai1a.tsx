// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";

// export default function FirstScreen() {
//   return (
//     <LinearGradient
//       colors={["#E0F7FA", "#00ACC1"]}
//       style={styles.container}
//       locations={[0.85, 1]}
//     >
//       {/* Logo */}
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <View style={styles.logo} />
//       </View>

//       {/* Title + Subtitle */}
//       <View style={{ flex: 1, justifyContent: "center" }}>
//         <Text style={styles.title}>GROW {"\n"} YOUR BUSINESS</Text>
//         <Text style={styles.subtitle}>
//           We will help you to grow your business using{"\n"}online server
//         </Text>
//       </View>

//       {/* Buttons */}
//       <View style={styles.buttonContainer}>
//         <TouchableOpacity style={styles.button}>
//           <Text style={styles.text}>LOGIN</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={styles.button}>
//           <Text style={styles.text}>SIGN UP</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Footer */}
//       <View style={{ marginBottom: 40 }}>
//         <Text style={styles.textWork}>HOW WE WORK?</Text>
//       </View>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   logo: {
//     width: 150,
//     height: 150,
//     borderRadius: 80,
//     borderWidth: 15,
//     borderColor: "black",
//     borderStyle: "solid",
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     textAlign: "center",
//     paddingBottom: 80,
//   },
//   subtitle: {
//     fontSize: 14,
//     textAlign: "center",
//     color: "#333",
//     lineHeight: 20,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     gap: 20,
//     marginBottom: 80,
//   },
//   button: {
//     width: 120,
//     height: 50,
//     borderRadius: 10,
//     backgroundColor: "#E3C000",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   text: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   textWork: {
//     fontSize: 16,
//     fontWeight: "bold",
//     paddingBottom: 60,
//   },
// });
