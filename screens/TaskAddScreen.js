import React, { useState } from "react";
import { TextInput, Button, Alert, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { addTask } from "../store/tasksSlice"; // Redux action
import { addTask as addTaskToFirebase } from "../services/firebaseConfig"; // Firebase'teki addTask fonksiyonu
import { auth } from "../services/firebaseConfig"; // Firebase auth'ı import et
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { Platform } from "react-native";

const AddTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mode, setMode] = useState("date"); // 'date' or 'time'

  const dispatch = useDispatch();

  const showPicker = (currentMode) => {
    setMode(currentMode);
    setShowDatePicker(true);
  };

  const handleAddTask = async () => {
    if (!title || !description) {
      Alert.alert("Hata", "Başlık ve açıklama zorunludur!");
      return;
    }
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert("Hata", "Kullanıcı oturumu açık değil.");
        return;
      }

      const formattedDate = date.toISOString(); // '2025-07-31T14:00:00.000Z'
      const newTask = { title, description, date: formattedDate, userId };
      const docRef = await addTaskToFirebase(userId, newTask);
      dispatch(addTask({ id: docRef.id, ...newTask }));

      setTitle("");
      setDescription("");
      navigation.goBack();
    } catch (error) {
      console.error("Görev eklerken hata:", error);
      Alert.alert(
        "Hata",
        "Görev eklerken bir hata oluştu. Lütfen tekrar deneyin."
      );
    }
  };
const onChange = (event, selectedValue) => {
  if (event?.type === 'dismissed') {
    setShowDatePicker(false);
    return;
  }

  setShowDatePicker(false);

  if (mode === 'date') {
    const currentDate = selectedValue || date;
    setDate(currentDate);
    showPicker('time'); // Launch time picker next
  } else if (mode === 'time') {
    const selectedTime = selectedValue || date;
    // Merge time with the existing date
    const updatedDate = new Date(date);
    updatedDate.setHours(selectedTime.getHours());
    updatedDate.setMinutes(selectedTime.getMinutes());
    setDate(updatedDate);
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
<Button
  title={`Tarih ve Saat Seç: ${moment(date).format('YYYY-MM-DD HH:mm')}`}
  onPress={() => showPicker('date')}
/>

{showDatePicker && (
  <DateTimePicker
    value={date}
    mode={mode}
    is24Hour={true}
    display="default"
    onChange={onChange}
  />
)}
      <Button title="Görev Ekle" onPress={handleAddTask} />
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
});

export default AddTaskScreen;
