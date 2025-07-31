import { configureStore } from '@reduxjs/toolkit';
import tasksSlice from './tasksSlice'; // Import the tasks slice

const store = configureStore({
  reducer: {
    tasks: tasksSlice,
  },
});

export default store;
