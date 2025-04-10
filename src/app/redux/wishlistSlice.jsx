import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
  },
  reducers: {
    toggleWishlistItem: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);  // Remove if already exists
      } else {
        state.items.push(action.payload);  // Add if doesn't exist
      }
    },
  },
});

export const { toggleWishlistItem } = wishlistSlice.actions;
export default wishlistSlice.reducer;
