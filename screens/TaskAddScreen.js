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
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('Hata', 'Kullanıcı oturumu açık değil.');
      return;
    }

    const newTask = { title, description, userId };
    const docRef = await addTaskToFirebase(userId, newTask); // Pass userId correctly

    dispatch(addTask({ id: docRef.id, ...newTask }));

    setTitle('');
    setDescription('');
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
