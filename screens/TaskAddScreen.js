import React, { useState } from "react";
import { TextInput, Alert, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { addTask } from "../store/tasksSlice";
import { addTask as addTaskToFirebase, auth } from "../services/firebaseConfig";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomHeader from "../components/CustomHeader";
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import { Platform } from "react-native";

const AddTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mode, setMode] = useState("date");

  const dispatch = useDispatch();

  const showPicker = (currentMode) => {
    setMode(currentMode);
    setShowDatePicker(true);
  };

  const handleAddTask = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert("Error", "Title and description are required.");
      return;
    }
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert("Error", "Invalid session. Please log in again.");
        return;
      }

      const newTask = {
        title: title.trim(),
        description: description.trim(),
        date: date.toISOString(),
        userId,
      };
      const docRef = await addTaskToFirebase(userId, newTask);
      dispatch(addTask({ id: docRef.id, ...newTask }));

      setTitle("");
      setDescription("");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding task:", error);
      Alert.alert("Error", "Error adding task. Please try again later.");
    }
  };

  const onChange = (event, selectedValue) => {
    if (event?.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }

    setShowDatePicker(false);

    if (mode === "date") {
      setDate(selectedValue || date);
      showPicker("time");
    } else if (mode === "time") {
      const updatedDate = new Date(date);
      updatedDate.setHours(selectedValue.getHours());
      updatedDate.setMinutes(selectedValue.getMinutes());
      setDate(updatedDate);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <CustomHeader
        title="Add Task"
        onSavePress={handleAddTask}
        onDTPress={() => showPicker("date")}
      />

      <View style={styles.container}>
        <TextInput
          style={[styles.input, { minHeight: 50, flexShrink: 1 }]}
          placeholder="Task Title"
          value={title}
          onChangeText={setTitle}
        />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  { flexGrow: 1, minHeight: 150, flexShrink: 1 },
                ]}
                placeholder="Task Description"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode={mode}
            is24Hour
            display="default"
            onChange={onChange}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 40, // To avoid keyboard overlap
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  input_desc: {
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },

  textArea: {
    textAlignVertical: "top",
  },
});

export default AddTaskScreen;
