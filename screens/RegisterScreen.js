import React, { useState } from "react";
import { View, Text, TextInput, Image, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import RoundedButton from "../components/RoundedButton";
import { TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
const db = getFirestore();

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  // Handle user registration
  const handleRegister = async () => {
    if (!email || !password || !username) {
      Toast.show({
        type: "info",
        text1: "Please fill in all fields",
        text2: "Username, email, and password cannot be empty.",
      });
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get the user ID (UID)
      const userId = userCredential.user.uid;

      // Save the username to Firestore under the user's UID
      await setDoc(doc(db, "users", userId), {
        username: username,
        email: email,
      });

      Toast.show({
        type: "success",
        text1: "Registration successful",
        text2: "You can now log in with your credentials.",
      });
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Registration failed",
        text2: error.message,
      });
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
        placeholder="Enter Username"
        value={username}
        onChangeText={setUsername}
        style={{
          marginBottom: 20,
          borderWidth: 1,
          padding: 10,
          borderRadius: 12,
        }}
      />

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
          alignItems: "center",
          flexWrap: "wrap",
          gap: 4,
        }}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

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
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#70d7c7",
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
  },
});

export default RegisterScreen;
