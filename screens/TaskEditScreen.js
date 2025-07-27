import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const TaskEditScreen = ({ route, navigation }) => {
  const { taskId } = route.params;  // Yönlendirme ile gelen taskId
  const [task, setTask] = useState({ title: '', description: '' });

  useEffect(() => {
    // Firestore'dan görevi alıyoruz
    const fetchTask = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const taskDocRef = doc(db, 'users', auth.currentUser.uid, 'tasks', taskId);
      const taskDoc = await getDoc(taskDocRef);
      
      if (taskDoc.exists()) {
        setTask(taskDoc.data());
      } else {
        Alert.alert('Hata', 'Görev bulunamadı.');
      }
    };

    fetchTask();
  }, [taskId]);

  const handleUpdateTask = async () => {
    if (!task.title || !task.description) {
      Alert.alert('Hata', 'Başlık ve açıklama boş olamaz.');
      return;
    }

    try {
      const auth = getAuth();
      const db = getFirestore();
      const taskDocRef = doc(db, 'users', auth.currentUser.uid, 'tasks', taskId);

      // Firestore'da görevi güncelleme
      await updateDoc(taskDocRef, task);
      Alert.alert('Başarılı', 'Görev başarıyla güncellendi.');
      navigation.goBack(); // Düzenleme işleminden sonra HomeScreen'e dön
    } catch (error) {
      Alert.alert('Hata', 'Görev güncellenirken bir hata oluştu.');
      console.error('Güncelleme hatası:', error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderBottomWidth: 1, marginBottom: 20 }}
        placeholder="Görev Başlığı"
        value={task.title}
        onChangeText={(text) => setTask({ ...task, title: text })}
      />
      <TextInput
        style={{ height: 80, borderColor: 'gray', borderBottomWidth: 1, marginBottom: 20 }}
        placeholder="Görev Açıklaması"
        value={task.description}
        onChangeText={(text) => setTask({ ...task, description: text })}
        multiline
      />
      <Button title="Görevi Güncelle" onPress={handleUpdateTask} />
    </View>
  );
};

export default TaskEditScreen;
