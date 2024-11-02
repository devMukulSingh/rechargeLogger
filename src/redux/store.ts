import { configureStore } from "@reduxjs/toolkit";
import rootSlice from "./reducers/persistedReducer";

export const store = configureStore({
  reducer: {
    rootReducer:rootSlice,
  },
});

export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
