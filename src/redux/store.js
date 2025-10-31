
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import translateReducer from './features/translateSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    translate: translateReducer,
  },
});

export default store;
