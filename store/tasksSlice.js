import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";

const initialState = {
  tasks: [], // Array to hold tasks
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload.map((task) => ({
        ...task,
        dateOnly: moment(task.date).format("YYYY-MM-DD"), // Add YYYY-MM-DD version
        timestamp: moment(task.date).valueOf(), // Milliseconds since epoch
      }));
    },
    addTask: (state, action) => {
      const task = action.payload;
      state.tasks.push({
        ...task,
        dateOnly: moment(task.date).format("YYYY-MM-DD"),
        timestamp: moment(task.date).valueOf(),
      }); // Adding the new task with formatted date
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload); // Remove task by id
    },
  },
});

export const { setTasks, addTask, deleteTask } = tasksSlice.actions;

export default tasksSlice.reducer;
