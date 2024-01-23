import { createSlice } from '@reduxjs/toolkit'
import { getItemFromLocalStorage } from '../helpers'

export interface CartState {
  value: []
}

const initialState: CartState = {
  value: getItemFromLocalStorage('cart') || [],
}

export const cartSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    updateQuantity: (state, { payload }) => {
      console.log(payload);
      
      state.value = payload

    },
  },
})

// Action creators are generated for each case reducer function
export const { updateQuantity } = cartSlice.actions

export default cartSlice.reducer