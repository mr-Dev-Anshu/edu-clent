import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER, 
} from "redux-persist";
// import storage from "redux-persist/lib/storage";
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

import authReducer from "@/features/auth/slice/index";

const createNoopStorage = () => ({
  getItem() { return Promise.resolve(null) },
  setItem(_key: string, value: unknown) { return Promise.resolve(value) },
  removeItem() { return Promise.resolve() },
})

const storage = typeof window !== 'undefined'
  ? createWebStorage('local')
  : createNoopStorage()

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistConfig = {
  key: "sovereign_root",
  storage,
  whitelist: ["auth"], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;