import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, Platform, Text } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const TaskEditScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const [task, setTask] = useState({ title: '', description: '', date: new Date().toISOString() });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mode, setMode] = useState('date'); // 'date' or 'time'
  const [dateObj, setDateObj] = useState(new Date());

  // Fetch the task data
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const auth = getAuth();
        const db = getFirestore();
        const taskDocRef = doc(db, 'users', auth.currentUser.uid, 'tasks', taskId);
        const taskDoc = await getDoc(taskDocRef);

        if (taskDoc.exists()) {
          const data = taskDoc.data();
          setTask(data);
          setDateObj(new Date(data.date));
        } else {
          Alert.alert('Hata', 'Görev bulunamadı.');
        }
      } catch (error) {
        Alert.alert('Hata', 'Görev alınırken bir hata oluştu.');
        console.error(error);
      }
    };

    fetchTask();
  }, [taskId]);

  // Show picker by mode
  const showPicker = (currentMode) => {
    setMode(currentMode);
    setShowDatePicker(true);
  };

  // Handle picker change
  const onChange = (event, selectedValue) => {
    if (event?.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }

    setShowDatePicker(false);

    if (mode === 'date') {
      const currentDate = selectedValue || dateObj;
      setDateObj(currentDate);
      showPicker('time'); // Show time picker after date
    } else if (mode === 'time') {
      const selectedTime = selectedValue || dateObj;
      const updatedDate = new Date(dateObj);
      updatedDate.setHours(selectedTime.getHours());
      updatedDate.setMinutes(selectedTime.getMinutes());
      setDateObj(updatedDate);
      setTask({ ...task, date: updatedDate.toISOString() }); // Update task with full datetime
    }
  };

  const handleUpdateTask = async () => {
    if (!task.title || !task.description) {
      Alert.alert('Hata', 'Başlık ve açıklama boş olamaz.');
      return;
    }

    try {
      const auth = getAuth();
      const db = getFirestore();
      const taskDocRef = doc(db, 'users', auth.currentUser.uid, 'tasks', taskId);
      await updateDoc(taskDocRef, task);
      Alert.alert('Başarılı', 'Görev başarıyla güncellendi.');
      navigation.goBack();
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
      
      <Button
        title={`Tarih ve Saat Seç: ${moment(dateObj).format('YYYY-MM-DD HH:mm')}`}
        onPress={() => showPicker('date')}
      />

      {showDatePicker && (
        <DateTimePicker
          value={dateObj}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Görevi Güncelle" onPress={handleUpdateTask} />
      </View>
    </View>
  );
};

export default TaskEditScreen;
