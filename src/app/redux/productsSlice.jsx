// productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (gender = null) => {
    try {
      const url = gender 
        ? `/api/products?gender=${gender}`
        : '/api/products';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch products');
      }
      
      return data.products;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    filteredItems: [],
    searchResults: [], // Separate state for search results
    status: 'idle',
    error: null,
    searchQuery: '',
  },
  reducers: {
    searchProducts: (state, action) => {
      const searchTerm = action.payload.toLowerCase().trim();
      state.searchQuery = searchTerm;
      
      if (searchTerm) {
        state.searchResults = state.items.filter(product => 
          product.title.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm) ||
          product.color.toLowerCase().includes(searchTerm) ||
          product.gender.toLowerCase().includes(searchTerm)
        );
      } else {
        state.searchResults = [];
      }
    },
    clearSearch: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
  // In productsSlice.js
filterProducts: (state, action) => {
  const { gender, category, brand, color, sort } = action.payload;
  let filtered = [...state.items];
  
  if (gender?.length) {
    const genderLower = gender.map(g => g.toLowerCase());
    filtered = filtered.filter(p => 
      genderLower.includes(p.gender.toLowerCase())
    );
  }
  
  if (category?.length) {
    const categoryLower = category.map(c => c.toLowerCase());
    filtered = filtered.filter(p => 
      categoryLower.includes(p.category.toLowerCase())
    );
  }
  
  if (brand?.length) {
    const brandLower = brand.map(b => b.toLowerCase());
    filtered = filtered.filter(p => 
      brandLower.includes(p.brand.toLowerCase())
    );
  }
  
  if (color?.length) {
    const colorLower = color.map(c => c.toLowerCase());
    filtered = filtered.filter(p => 
      colorLower.includes(p.color.toLowerCase())
    );
  }
  
  if (sort === 'low-high') {
    filtered.sort((a, b) => a.discountPrice - b.discountPrice);
  } else if (sort === 'high-low') {
    filtered.sort((a, b) => b.discountPrice - a.discountPrice);
  }
  
  state.filteredItems = filtered;
}
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.filteredItems = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { searchProducts, filterProducts, clearSearch } = productsSlice.actions;
export default productsSlice.reducer;