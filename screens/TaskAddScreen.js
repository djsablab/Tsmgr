import React, { useState } from "react";
import { TextInput, Alert, StyleSheet, View, Platform } from "react-native";
import { useDispatch } from "react-redux";
import { addTask } from "../store/tasksSlice";
import { addTask as addTaskToFirebase } from "../services/firebaseConfig";
import { auth } from "../services/firebaseConfig";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomHeader from "../components/CustomHeader";
import RoundedButton from "../components/RoundedButton";

const AddTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mode, setMode] = useState("date");

  const dispatch = useDispatch();

  // Show date or time picker
  const showPicker = (currentMode) => {
    setMode(currentMode);
    setShowDatePicker(true);
  };

  // Handle date or time change
  const handleAddTask = async () => {
    if (!title || !description) {
      Alert.alert("Error", "Title and description are required.");
      return;
    }
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert("Error", "Invalid session. Please log in again.");
        return;
      }

      const formattedDate = date.toISOString();
      const newTask = { title, description, date: formattedDate, userId };
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

  // Handle date/time picker change
  const onChange = (event, selectedValue) => {
    if (event?.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }

    setShowDatePicker(false);

    if (mode === "date") {
      const currentDate = selectedValue || date;
      setDate(currentDate);
      showPicker("time");
    } else if (mode === "time") {
      const selectedTime = selectedValue || date;
      const updatedDate = new Date(date);
      updatedDate.setHours(selectedTime.getHours());
      updatedDate.setMinutes(selectedTime.getMinutes());
      setDate(updatedDate);
    }
  };

  // Render the add task form
  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginBottom: 5 }}>
        <CustomHeader title="Add Task" />
      </View>

      <View style={{ padding: 10, flex: 1 }}>
        <TextInput
          id="title"
          style={[styles.input, { minHeight: 50, flexShrink: 1 }]}
          placeholder="Enter Task Title"
          value={title}
          onChangeText={setTitle}
          textAlignVertical="top"
        />
        <TextInput
          id="description"
          style={[styles.input, { flexGrow: 1, minHeight: 150, flexShrink: 1 }]}
          placeholder="Enter Task Description"
          value={description}
          onChangeText={setDescription}
          textAlignVertical="top"
          multiline={true}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginBottom: 50,
            gap: 4,
            flexWrap: "wrap",
          }}
        >
          <RoundedButton
            title="Pick Date & Time"
            onPress={() => showPicker("date")}
            style={{ backgroundColor: "#70d7c7" }}
          ></RoundedButton>
          <RoundedButton
            title="Add to Tasks"
            onPress={handleAddTask}
            style={{ backgroundColor: "#3fb5a8" }}
          />
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    minHeight: 50, // Keeps the input area reasonable for small inputs
    paddingVertical: 10, // Add vertical padding for better spacing
  },
});

export default AddTaskScreen;
