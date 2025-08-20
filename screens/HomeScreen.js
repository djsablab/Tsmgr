import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  setTasks,
  deleteTask as deleteTaskFromStore,
  updateTaskInFirebase,
} from "../store/tasksSlice";
import {
  fetchTasks,
  deleteTask,
  getUserInfo,
} from "../services/firebaseConfig"; // Make sure to implement this service function
import { auth } from "../services/firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import CustomHeader from "../components/CustomHeader";
import { Ionicons } from "@expo/vector-icons"; // For edit/pen icon
import { MaterialIcons } from "@expo/vector-icons"; // For checkbox icons
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Firestore imports

const db = getFirestore();

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [username, setUsername] = useState(""); // State to store username

  // Fetch user data (username)
  const loadUserData = useCallback(async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUsername(userDoc.data().username); // Store username in state
      } else {
        console.log("No user document found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const loadTasks = useCallback(async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const fetchedTasks = await fetchTasks(uid);
      const sortedTasks = fetchedTasks.sort(
        (a, b) => moment(a.date).valueOf() - moment(b.date).valueOf()
      );
      dispatch(setTasks(sortedTasks));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
      loadUserData();
    }, [loadTasks])
  );

  const handleToggleComplete = (taskId) => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const taskToUpdate = tasks.find((task) => task.id === taskId);
      if (!taskToUpdate) {
        console.warn("Task not found:", taskId);
        return;
      }

      const updatedTask = {
        ...taskToUpdate,
        isCompleted: !taskToUpdate.isCompleted,
      };

      dispatch(updateTaskInFirebase(uid, updatedTask));
    } catch (error) {
      console.error("Error updating task:", error);
      Alert.alert("Error", "Failed to update task. Please try again.");
    }
  };

  const handleDeleteTask = (taskId) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const uid = auth.currentUser?.uid;
            if (!uid) return;
            await deleteTask(uid, taskId);
            dispatch(deleteTaskFromStore(taskId));
          } catch (error) {
            console.error("Error deleting task:", error);
            Alert.alert("Error", "Failed to delete task. Please try again.");
          }
        },
      },
    ]);
  };

  const filteredTasks = tasks
    .filter((task) => moment(task.date).format("YYYY-MM-DD") === selectedDate)
    .sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());

  const getMarkedDates = () => {
    const marked = {};
    tasks.forEach((task) => {
      const date = moment(task.date).format("YYYY-MM-DD");
      marked[date] = { marked: true, dotColor: "#70d7c7" };
    });
    marked[selectedDate] = {
      ...(marked[selectedDate] || {}),
      selected: true,
      selectedColor: "#70d7c7",
    };
    return marked;
  };

  const renderItem = ({ item }) => {
    const textStyle = item.isCompleted
      ? [styles.taskTitle, styles.completedText]
      : styles.taskTitle;

    const descStyle = item.isCompleted
      ? [styles.taskDesc, styles.completedText]
      : styles.taskDesc;

    return (
      <View style={styles.taskCard}>
        <View style={styles.taskHeader}>
          {/* Checkbox */}
          <TouchableOpacity
            onPress={() => handleToggleComplete(item.id)}
            activeOpacity={1}
          >
            {item.isCompleted ? (
              <MaterialIcons name="check-box" size={30} color="#70d7c7" />
            ) : (
              <MaterialIcons
                name="check-box-outline-blank"
                size={30}
                color="#999"
              />
            )}
          </TouchableOpacity>

          {/* Task Info */}
          <TouchableOpacity style={styles.taskContent} activeOpacity={1}>
            <Text style={textStyle}>{item.title}</Text>
            <Text style={styles.taskDate}>
              {moment(item.date).format("YYYY-MM-DD HH:mm")}
            </Text>
          </TouchableOpacity>

          {/* Edit Button */}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("TaskDetail", { taskId: item.id })
            }
          >
            <Ionicons name="pencil" size={22} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader
        title={`Hello, ${username || "User"}`}
        onAddPress={() => navigation.navigate("AddTask")}
        onUserPress={() => navigation.navigate("UserProfile")}
      />

      <View style={{ flex: 1, padding: 12 }}>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={getMarkedDates()}
          markingType="dot"
          theme={{
            todayTextColor: "#70d7c7",
            selectedDayBackgroundColor: "#70d7c7",
            arrowColor: "#70d7c7",
            monthTextColor: "#333",
            textDayFontSize: 16,
            textMonthFontSize: 20,
          }}
        />

        {tasks.length === 0 ? (
          <Text style={styles.emptyText}>
            No tasks available. Start adding tasks now!
          </Text>
        ) : filteredTasks.length === 0 ? (
          <Text style={styles.emptyText}>
            No tasks found for this date: {selectedDate}
          </Text>
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  taskCard: {
    marginVertical: 6,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskContent: {
    flex: 1,
    marginHorizontal: 10,
  },
  taskTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  taskDesc: {
    fontSize: 14,
    color: "#666",
  },
  taskDate: {
    fontSize: 12,
    color: "#999",
  },
  completedText: {
    color: "#999",
    textDecorationLine: "line-through",
  },
  emptyText: {
    marginTop: 20,
    textAlign: "center",
  },
});

export default HomeScreen;
