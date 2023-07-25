import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalAmount: 0,
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setItems: (state, action) => {
      const { cartItems, totalAmount, totalQuantity } = action.payload;
      state.cartItems = cartItems;
      state.totalAmount = totalAmount;
      state.totalQuantity = totalQuantity;
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice.reducer;
