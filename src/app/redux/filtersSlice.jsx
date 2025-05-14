import { createSlice } from '@reduxjs/toolkit';

const filtersSlice = createSlice({
  name: 'filters',
  initialState: {
    gender: [],
    category: [],
    brand: [],
    color: [],
    sort: 'recommended',
  },
  // In your filtersSlice
reducers: {
  setGenderFilter: (state, action) => {
    state.gender = action.payload;
  },
  setCategoryFilter: (state, action) => {
    state.category = action.payload;
  },
  setBrandFilter: (state, action) => {
    state.brand = action.payload;
  },
  setColorFilter: (state, action) => {
    state.color = action.payload;
  },
  setSort: (state, action) => {
    state.sort = action.payload;
  },
  clearFilters: (state) => {
    state.gender = [];
    state.category = [];
    state.brand = [];
    state.color = [];
    state.sort = 'recommended';
  }
}
});

export const { 
  setGenderFilter, 
  setCategoryFilter, 
  setBrandFilter, 
  setColorFilter, 
  setSort,
  clearFilters 
} = filtersSlice.actions;
export default filtersSlice.reducer;