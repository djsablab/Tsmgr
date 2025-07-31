import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask as deleteTaskFromStore } from "../store/tasksSlice";
import { auth, deleteTask } from "../services/firebaseConfig";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";
import CustomHeader from "../components/CustomHeader";

const TaskDetailScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const dispatch = useDispatch();

  // Get the task from Redux state (this is dynamic)
  const task = useSelector((state) =>
    state.tasks.tasks.find((t) => t.id === taskId)
  );

  // Use state to force refresh when task changes
  const [taskChanged, setTaskChanged] = useState(false);

  // Update state when task data changes in Redux store
  useEffect(() => {
    // Whenever the taskId is found in Redux store, reset the taskChanged flag
    if (taskId && task) {
      setTaskChanged(false);
    }
  }, [taskId, task]);

  // Force refresh on screen focus, re-fetching the task details
  useFocusEffect(
    React.useCallback(() => {
      setTaskChanged(true); // Force a refresh of task when screen is focused
    }, [])
  );

  // Handle task deletion
  const handleDelete = async () => {
    try {
      await deleteTask(auth.currentUser.uid, taskId); // Delete from Firebase
      dispatch(deleteTaskFromStore(taskId)); // Remove task from Redux store
      Alert.alert("Success", "Task deleted successfully.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Error deleting task. Please try again.");
    }
  };

  if (!task) {
    return (
      <View style={styles.container}>
        <CustomHeader title="Task Detail" />
        <Text>Task not found.</Text>
      </View>
    );
  }

  // Render the task details
  return (
    <View style={styles.container}>
      <CustomHeader
        title="Task Detail"
      />

      <View style={{ padding: 20 }}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.date}>
          {moment(task.date).format("YYYY-MM-DD HH:mm")}
        </Text>
        <Text style={styles.description}>{task.description}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => navigation.navigate("TaskEdit", { taskId })}
          >
            <Text style={styles.buttonText}>Düzenle</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={styles.buttonText}>Sil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 0, flex: 1 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  date: { fontSize: 16, color: "#666", marginBottom: 10 },
  description: { fontSize: 18, marginBottom: 30 },
  buttonRow: { flexDirection: "row", justifyContent: "space-between" },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  editButton: { backgroundColor: "#4CAF50" },
  deleteButton: { backgroundColor: "#FF5555" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

export default TaskDetailScreen;
