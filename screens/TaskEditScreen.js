import { useState, useEffect } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import CustomHeader from "../components/CustomHeader"; // Assuming you have the same custom header
import RoundedButton from "../components/RoundedButton"; // Assuming you have the same custom button

const TaskEditScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const [task, setTask] = useState({
    title: "",
    description: "",
    date: new Date().toISOString(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mode, setMode] = useState("date"); // 'date' or 'time'
  const [dateObj, setDateObj] = useState(new Date());

  // Fetch the task data
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const auth = getAuth();
        const db = getFirestore();
        const taskDocRef = doc(
          db,
          "users",
          auth.currentUser.uid,
          "tasks",
          taskId
        );
        const taskDoc = await getDoc(taskDocRef);

        if (taskDoc.exists()) {
          const data = taskDoc.data();
          setTask(data);
          setDateObj(new Date(data.date));
        } else {
          Alert.alert("Error", "Task not found.");
        }
      } catch (error) {
        Alert.alert("Error", "Error occurred while fetching the task.");
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
    if (event?.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }

    setShowDatePicker(false);

    if (mode === "date") {
      const currentDate = selectedValue || dateObj;
      setDateObj(currentDate);
      showPicker("time"); // Show time picker after date
    } else if (mode === "time") {
      const selectedTime = selectedValue || dateObj;
      const updatedDate = new Date(dateObj);
      updatedDate.setHours(selectedTime.getHours());
      updatedDate.setMinutes(selectedTime.getMinutes());
      setDateObj(updatedDate);
      setTask({ ...task, date: updatedDate.toISOString() }); // Update task with full datetime
    }
  };

  // Handle task update
  const handleUpdateTask = async () => {
    if (!task.title || !task.description) {
      Alert.alert("Error", "Title and description cannot be empty.");
      return;
    }

    try {
      const auth = getAuth();
      const db = getFirestore();
      const taskDocRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "tasks",
        taskId
      );
      await updateDoc(taskDocRef, task);
      navigation.goBack();
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  // Render the interface
  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginBottom: 5 }}>
        <CustomHeader title="Edit Task" />
      </View>

      <View style={{ padding: 10, flex: 1 }}>
        <TextInput
          id="title"
          style={[styles.input, { minHeight: 50, flexShrink: 1 }]}
          placeholder="Enter Task Title"
          value={task.title}
          onChangeText={(text) => setTask({ ...task, title: text })}
          textAlignVertical="top"
        />
        <TextInput
          id="description"
          style={[styles.input, { flexGrow: 1, minHeight: 150, flexShrink: 1 }]}
          placeholder="Enter Task Description"
          value={task.description}
          onChangeText={(text) => setTask({ ...task, description: text })}
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
            title={`Pick Date & Time`}
            onPress={() => showPicker("date")}
            style={{ backgroundColor: "#70d7c7" }}
          />
          <RoundedButton
            title="Update Task"
            onPress={handleUpdateTask}
            style={{ backgroundColor: "#3fb5a8" }}
          />
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dateObj}
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

export default TaskEditScreen;
