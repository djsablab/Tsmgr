import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  setTasks,
  deleteTask as deleteTaskFromStore,
} from "../store/tasksSlice";
import { fetchTasks, deleteTask } from "../services/firebaseConfig";
import { auth } from "../services/firebaseConfig";
import { useFocusEffect } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import CustomHeader from "../components/CustomHeader";

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks); // Redux store tasks
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  // Function to load tasks from Firebase and set them in Redux store
  const loadTasks = async () => {
    try {
      const fetchedTasks = await fetchTasks(auth.currentUser.uid);
      // Sort tasks by date (ascending)
      const sortedTasks = fetchedTasks.sort(
        (a, b) => moment(a.date).valueOf() - moment(b.date).valueOf()
      );
      dispatch(setTasks(sortedTasks));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [dispatch]);

  // This will make sure the tasks are reloaded when the user navigates back from TaskEdit
  useFocusEffect(
    React.useCallback(() => {
      loadTasks(); // Reload tasks when the screen is focused
    }, [])
  );

  // Delete task handler
  const handleDeleteTask = async (taskId) => {
    try {
      // Delete from Firebase
      await deleteTask(auth.currentUser.uid, taskId);
      // Delete from Redux store
      dispatch(deleteTaskFromStore(taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      Alert.alert("Error", "Failed to delete task. Please try again.");
    }
  };
  // Filter tasks by selected date
  const filteredTasks = tasks
    .filter((task) => moment(task.date).format("YYYY-MM-DD") === selectedDate)
    .sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());

  // Handle date selection in the calendar
  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  // Get marked dates for the calendar
  const getMarkedDates = () => {
    const marked = {};
    tasks.forEach((task) => {
      const date = moment(task.date).format("YYYY-MM-DD");
      marked[date] = {
        marked: true,
        dotColor: "#70d7c7",
      };
    });
    marked[selectedDate] = {
      ...(marked[selectedDate] || {}),
      selected: true,
      selectedColor: "#70d7c7",
    };
    return marked;
  };

  // FlatList render item function
  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        margin: 10,
        padding: 15,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
      }}
      onPress={() => navigation.navigate("TaskDetail", { taskId: item.id })}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>{item.title}</Text>
        <Text>{moment(item.date).format("YYYY-MM-DD HH:mm")}</Text>
      </View>

      <Text>{item.description}</Text>

      <TouchableOpacity
        onPress={() => handleDeleteTask(item.id)}
        style={{
          marginTop: 10,
          backgroundColor: "#ff5555",
          padding: 10,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Sil</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  // Add task navigation handler
  const handleAddTask = () => {
    navigation.navigate("AddTask"); // Goto AddTask screen
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader
        title={`Hello, ${auth.currentUser?.displayName || "Kullanıcı"}`}
        onAddPress={handleAddTask}
        onUserPress={() => navigation.navigate("UserProfile")}
      />

      <View style={{ flex: 1, padding: 12 }}>
        {tasks.length === 0 ? (
          <Text>Henüz görev yok.</Text>
        ) : (
          <View>
            <Calendar
              onDayPress={onDayPress}
              markedDates={getMarkedDates()}
              markingType="period"
              minDate={new Date().toISOString().split("T")[0]}
            />
            <FlatList
              data={filteredTasks}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default HomeScreen;
