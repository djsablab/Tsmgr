import React, { useState } from 'react';
import { TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addTask } from '../store/tasksSlice';  // Redux action
import { addTask as addTaskToFirebase } from '../services/firebaseConfig'; // Firebase'teki addTask fonksiyonu
import { auth } from '../services/firebaseConfig';  // Firebase auth'ı import et

const AddTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();

  // Görev ekleme fonksiyonu
  const handleAddTask = async () => {
    if (!title || !description) {
      Alert.alert('Hata', 'Başlık ve açıklama zorunludur!');
      return;
    }

    try {
      const userId = auth.currentUser?.uid;  // Firebase Auth'dan geçerli kullanıcı ID'sini alıyoruz
      if (!userId) {
        Alert.alert('Hata', 'Kullanıcı oturumu açık değil.');
        return;
      }

      const newTask = { title, description, userId };  // Görevi userId ile birlikte ekliyoruz
      const docRef = await addTaskToFirebase(newTask);  // Firebase'e görev ekleme

      // Eğer addTask başarılıysa, Redux store'a ekliyoruz
      dispatch(addTask({ id: docRef.id, ...newTask }));  // Burada 'addTaskRedux' yerine 'addTask' kullanalım

      // Başarıyla görev eklendikten sonra formu sıfırlayalım
      setTitle('');
      setDescription('');

      // Görev ekledikten sonra geri dön
      navigation.goBack(); 
    } catch (error) {
      console.error('Görev eklerken hata:', error);
      Alert.alert('Hata', 'Görev eklerken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <>
      <TextInput 
        style={styles.input}
        placeholder="Başlık" 
        value={title} 
        onChangeText={setTitle} 
      />
      <TextInput 
        style={styles.input}
        placeholder="Açıklama" 
        value={description} 
        onChangeText={setDescription} 
      />
      <Button title="Görev Ekle" onPress={handleAddTask} />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
});

export default AddTaskScreen;
