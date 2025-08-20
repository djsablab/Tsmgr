import React, { useState } from "react";
import { TextInput, StyleSheet, View } from "react-native";
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
import Toast from "react-native-toast-message";

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
      Toast.show({
        type: "error",
        text1: "Please fill in all fields",
        text2: "Title and description cannot be empty.",
      });
      return;
    }
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Toast.show({
          type: "error",
          text1: "User not authenticated",
          text2: "Please log in to add tasks.",
        });
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
      Toast.show({
        type: "error",
        text1: "Error adding task",
        text2: error.message,
      });
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
      <Toast />
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
