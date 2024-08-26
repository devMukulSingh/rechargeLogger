import { configureStore } from "@reduxjs/toolkit";
import rootSlice from "./slice";

export const store = configureStore({
    reducer:{
        rootSlice,
    }
})

export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>;