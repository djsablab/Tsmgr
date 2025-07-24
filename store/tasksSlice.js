// store/tasksSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],  // Görevlerin tutulduğu array
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;  // Payload'daki görevleri Redux store'a set ediyoruz
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);  // Yeni bir görev ekliyoruz
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);  // Silinen görev hariç, tüm görevleri tutuyoruz
    },
  },
});

export const { setTasks, addTask, deleteTask } = tasksSlice.actions;

export default tasksSlice.reducer;
