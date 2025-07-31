import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, Image } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import RoundedButton from "../components/RoundedButton";
import { withDecay } from "react-native-reanimated";
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle user login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter a valid email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // Render the login form
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
        Login
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
          title="Login"
          onPress={handleLogin}
          style={{ marginBottom: 20, width: "45%", backgroundColor: "#70d7c7" }}
        />

        <RoundedButton
          title="Register"
          onPress={() => navigation.navigate("Register")}
          style={{
            marginBottom: 20,
            width: "45%",
            backgroundColor: "#3fb5a8",
          }}
        />
      </View>
    </View>
  );
};

export default LoginScreen;
