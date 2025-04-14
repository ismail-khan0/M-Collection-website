// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import filtersReducer from './filtersSlice';
import wishlistReducer from './wishlistSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    filters: filtersReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
  },
});