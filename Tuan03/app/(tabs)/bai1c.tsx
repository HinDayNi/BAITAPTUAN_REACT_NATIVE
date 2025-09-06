import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Hàm thay đổi giá trị từng ô OTP
  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  return (
    <LinearGradient
      colors={["#E0F7FA", "#00ACC1"]}
      style={styles.container}
      locations={[0.85, 1]}
    >
      <Text style={styles.title}>CODE</Text>
      <Text style={styles.subtitle}>VERIFICATION</Text>
      <Text style={styles.info}>
        Enter one-time password sent to {"\n"} +849092605798
      </Text>

      {/* OTP Input */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpBox}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
          />
        ))}
      </View>

      {/* Button */}
      <View style={styles.buttonCode}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>VERIFY CODE</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 50,
  },
  title: {
    fontSize: 60,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    paddingTop: 50,
  },
  info: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
    paddingTop: 50,
    fontWeight: "bold",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingTop: 50,
  },
  otpBox: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: "#000",
    marginHorizontal: 5,
    textAlign: "center",
    fontSize: 20,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#FFD600",
    width: 320,
    height: 60,
    justifyContent: "center",
    borderRadius: 8,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonCode: {
    paddingTop: 50,
  },
});
