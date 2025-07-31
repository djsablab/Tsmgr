import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, Image } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import RoundedButton from "../components/RoundedButton";
const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle user registration
  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Error :", "Please enter a valid email and password.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Registration successful!");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Hata", error.message);
    }
  };

  // Render the registration form
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <Image
        source={require("../assets/splash-icon.png")}
        style={{
          width: 175,
          height: 175,
          alignSelf: "center",
          marginBottom: 20,
        }}
      />
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Register
      </Text>
      <Text style={{ marginBottom: 10 }}>Please enter your credentials:</Text>
      <TextInput
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{
          marginBottom: 20,
          borderWidth: 1,
          padding: 10,
          borderRadius: 12,
        }}
      />
      <TextInput
        placeholder="Enter Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          marginBottom: 20,
          borderWidth: 1,
          padding: 10,
          borderRadius: 12,
        }}
      />

      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <RoundedButton
          title="<"
          onPress={() => navigation.goBack()}
          style={{
            marginBottom: 20,
            width: "15%",
            backgroundColor: "#70d7c7",
            alignItems: "center",
          }}
        />
        <RoundedButton
          title="Register"
          onPress={handleRegister}
          style={{
            marginBottom: 20,
            width: "75%",
            backgroundColor: "#3fb5a8",
            alignItems: "center",
          }}
        />
      </View>
    </View>
  );
};

export default RegisterScreen;
