import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig'; // Doğru şekilde auth import edilmiştir

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen geçerli bir e-posta ve şifre girin.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Başarılı', 'Başarıyla giriş yaptınız!');
      navigation.navigate('Home'); // Başarıyla giriş yaptıktan sonra Home'a yönlendirme
    } catch (error) {
      Alert.alert('Hata', error.message); // Hata mesajını kullanıcıya gösterme
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <Text>Giriş Yap</Text>
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
      <Button title="Giriş Yap" onPress={handleLogin} />
      <Button title="Kayıt Ol" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

export default LoginScreen;
