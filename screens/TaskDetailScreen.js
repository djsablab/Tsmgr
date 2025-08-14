import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask as deleteTaskFromStore } from "../store/tasksSlice";
import { auth, deleteTask } from "../services/firebaseConfig";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../components/CustomHeader";

const TaskDetailScreen = ({ route, navigation }) => {
  const { taskId } = route.params;
  const dispatch = useDispatch();

  const task = useSelector((state) =>
    state.tasks.tasks.find((t) => t.id === taskId)
  );

  const handleDelete = async () => {
    try {
      await deleteTask(auth.currentUser.uid, taskId);
      dispatch(deleteTaskFromStore(taskId));
      Alert.alert("Deleted", "Task removed successfully.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to delete task.");
    }
  };

  if (!task) {
    return (
      <View style={styles.container}>
        <CustomHeader title="Task Detail" />
        <Text style={styles.emptyText}>Task not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="Task Detail" />

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {task.title}{" "}
          </Text>
          <View style={styles.iconRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate("TaskEdit", { taskId })}
              style={styles.iconButton}
            >
              <Ionicons name="pencil-outline" size={25} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
              <Ionicons name="trash-outline" size={25} color="#FF5555" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.date}>
          {moment(task.date).format("YYYY-MM-DD HH:mm")}
        </Text>

        {task.description ? (
          <Text style={styles.description}>{task.description}</Text>
        ) : (
          <Text style={styles.noDescription}>No description</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "right",
    flexWrap: "wrap",
  },
  iconRow: { flexDirection: "row", gap: 12 },
  iconButton: { padding: 4 },
  title: { fontSize: 22, fontWeight: "600", color: "#222" },
  date: { fontSize: 14, color: "#888", marginTop: 4 },
  description: { fontSize: 16, color: "#444", marginTop: 20, lineHeight: 22 },
  noDescription: {
    fontSize: 16,
    color: "#bbb",
    marginTop: 20,
    fontStyle: "italic",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
    fontSize: 16,
  },
});

export default TaskDetailScreen;
