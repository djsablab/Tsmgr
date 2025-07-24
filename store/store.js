// store.js
import { configureStore } from '@reduxjs/toolkit';
import tasksSlice from './tasksSlice'; // Örnek taskSlice

const store = configureStore({
  reducer: {
    tasks: tasksSlice,
  },
});

export default store;
