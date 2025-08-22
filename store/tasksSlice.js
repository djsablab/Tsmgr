import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../services/firebaseConfig"; // Use your Firestore instance

// Initial state
const initialState = {
  tasks: [],
};

// Create the slice
const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload.map((task) => ({
        ...task,
        dateOnly: moment(task.date).format("YYYY-MM-DD"),
        timestamp: moment(task.date).valueOf(),
      }));
    },
    addTask: (state, action) => {
      const task = action.payload;
      state.tasks.push({
        ...task,
        dateOnly: moment(task.date).format("YYYY-MM-DD"),
        timestamp: moment(task.date).valueOf(),
      });
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
    updateTask: (state, action) => {
      const { taskId, updatedFields } = action.payload;
      const index = state.tasks.findIndex((task) => task.id === taskId);
      if (index !== -1) {
        state.tasks[index] = {
          ...state.tasks[index],
          ...updatedFields,
        };
      }
    },
  },
});

// Async thunk to update a task in Firestore
export const updateTaskInFirebase = (userId, updatedTask) => async (dispatch) => {
  try {
    const taskDoc = doc(firestore, "users", userId, "tasks", updatedTask.id);
    await updateDoc(taskDoc, updatedTask);

    dispatch(tasksSlice.actions.updateTask({ taskId: updatedTask.id, updatedFields: updatedTask }));
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

// Export the action creators
export const { setTasks, addTask, deleteTask, updateTask } = tasksSlice.actions;

export default tasksSlice.reducer;
