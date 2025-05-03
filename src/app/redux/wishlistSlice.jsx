import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
  },
  reducers: {
    toggleWishlistItem: (state, action) => {
      const product = action.payload;
      // Use _id if available, otherwise fall back to id
      const productId = product._id || product.id;
      const index = state.items.findIndex(item => (item._id || item.id) === productId);
      
      if (index >= 0) {
        state.items.splice(index, 1);  // Remove if already exists
      } else {
        state.items.push(product);  // Add if doesn't exist
      }
    },
  },
});

export const { toggleWishlistItem } = wishlistSlice.actions;
export default wishlistSlice.reducer;