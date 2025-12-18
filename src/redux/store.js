import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import translateReducer from "./features/translateSlice";
import loaderReducer from "./features/loaderSlice";
import { apiSlice } from "./features/apiSlice"; // ✅ تأكد من المسار الصحيح
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import wishlistReducer from "./features/wishlistSlice";
const rootReducer = combineReducers({
  auth: authReducer,
  translate: translateReducer,
  loader: loaderReducer,
  wishlist: wishlistReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["translate", "auth", "wishlist"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);
export default store;
