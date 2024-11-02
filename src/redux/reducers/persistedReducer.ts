import { IinitialState } from "@/src/lib/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: IinitialState = {
  transactions: [],
  selectedMonthTransactions: 0,
  selectedMonthRevenue: 0,
};

const rootSlice = createSlice({
  initialState,
  name: "rootSlice",
  reducers: {
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    setSelectedMonthTransactions: (state, action) => {
      state.selectedMonthTransactions = action.payload;
    },
    setSelectedMonthRevenue: (state, action) => {
      state.selectedMonthRevenue = action.payload;
    },
  },
});

export default rootSlice.reducer;

export const {
  setTransactions,
  setSelectedMonthTransactions,
  setSelectedMonthRevenue,
} = rootSlice.actions;
