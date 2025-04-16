import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session"; 
import {thunk} from "redux-thunk"; 
import userSlice from "../Store/userSlice.js"

const persistConfig = {
  key: "root",
  storage : storageSession,
  whitelist: ["user"], 
};

const rootReducer = combineReducers({
  user: userSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
      thunk,
    }),
});

export const persistor = persistStore(store);
