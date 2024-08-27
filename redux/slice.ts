import { IinitialState } from "@/lib/types";
import { createSlice } from "@reduxjs/toolkit";

const initialState: IinitialState = {
  transactions: [],
};

export const rootSlice = createSlice({
  initialState,
  name: "rootSlice",
  reducers: {
    setTransactions: (state, action) => {
      
      state.transactions = action.payload;
    },
  },
});

export default rootSlice.reducer;

export const { setTransactions } = rootSlice.actions;
