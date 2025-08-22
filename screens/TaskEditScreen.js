import { useState, useEffect } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomHeader from "../components/CustomHeader";
import Toast from "react-native-toast-message";
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
          Toast.show({
            type: "error",
            text1: "Task not found",
            text2: "The task you are trying to edit does not exist.",
          });
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error fetching task",
          text2: "Could not retrieve the task details. Please try again.",
        });
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
      Toast.show({
        type: "info",
        text1: "Please fill in all fields",
        text2: "Title and description cannot be empty.",
      });
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
      navigation.navigate("Home");
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error updating task",
        text2: "Could not update the task. Please try again.",
      });
    }
  };

  // Render the interface
  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginBottom: 5 }}>
        <CustomHeader
          title="Edit Task"
          onSavePress={handleUpdateTask}
          onDTPress={showPicker}
        />
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 16, flex: 1 }}>
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
        ></View>

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
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
});

export default TaskEditScreen;
