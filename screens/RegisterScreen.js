import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig'; // Doğru şekilde auth import edilmiştir

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen geçerli bir e-posta ve şifre girin.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Başarılı', 'Hesabınız başarıyla oluşturuldu!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text>Kayıt Ol</Text>
      <TextInput
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Kayıt Ol" onPress={handleRegister} />
      <Button title="Giriş Yap" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

export default RegisterScreen;
