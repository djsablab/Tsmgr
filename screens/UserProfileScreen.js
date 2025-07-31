import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { auth } from "../services/firebaseConfig";
import { updateProfile } from "firebase/auth";

const UserProfileScreen = () => {
  const [name, setName] = useState(auth.currentUser?.displayName || "");

  const handleUpdate = async () => {
    try {
      await updateProfile(auth.currentUser, { displayName: name });
      Alert.alert("Başarılı", "İsim güncellendi");
    } catch (error) {
      Alert.alert("Hata", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>İsminizi Güncelleyin:</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Yeni isim"
        style={styles.input}
      />
      <Button title="Güncelle" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 40,
  },
  label: {
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});

export default UserProfileScreen;
