import { configureStore } from '@reduxjs/toolkit';
import tasksSlice from './tasksSlice'; // Import the tasks slice

const store = configureStore({
  reducer: {
    tasks: tasksSlice,
  },
  // No need to manually add thunk, as it's already included by default
});

export default store;
