import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();
    
    return data.map(product => ({
      id: product.id,
      name: product.title,
      image: product.image,
      price: `$${(product.price * 1.2).toFixed(2)}`,
      discountPrice: `$${product.price.toFixed(2)}`,
      gender: Math.random() > 0.5 ? 'men' : 'women',
      category: ['Tshirts', 'Shirts', 'Jeans', 'Casual Shoes', 'Trousers', 'Sweatshirts', 'Jackets', 'Shorts'][Math.floor(Math.random() * 8)],
      brand: ['Friskers', 'WOOSTRO', 'FBAR', 'DISPENSER', 'Pepe jeans', 'Masch Sports'][Math.floor(Math.random() * 6)],
      color: ['Black', 'White', 'Blue', 'Navy Blue', 'Red', 'Grey', 'Maroon', 'Brown'][Math.floor(Math.random() * 8)]
    }));
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    filteredItems: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    searchProducts: (state, action) => {
      const searchTerm = action.payload.toLowerCase().trim();
      if (!searchTerm) {
        state.filteredItems = state.items;
      } else {
        state.filteredItems = state.items.filter(product => 
          product.name.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm) ||
          product.color.toLowerCase().includes(searchTerm) ||
          product.gender.toLowerCase().includes(searchTerm)
        );
      }
    },
    filterProducts: (state, action) => {
      const params = action.payload;
      let filtered = [...state.items];
      
      // Gender filter - handle multiple selections
      if (params.gender && params.gender.length > 0) {
        filtered = filtered.filter(p => 
          params.gender.some(g => p.gender.toLowerCase() === g.toLowerCase())
        );
      }
      
      // Category filter - handle multiple selections
      if (params.category && params.category.length > 0) {
        filtered = filtered.filter(p => 
          params.category.some(c => 
            p.category.toLowerCase() === c.toLowerCase()
          )
        );
      }
      
      // Brand filter - handle multiple selections
      if (params.brand && params.brand.length > 0) {
        filtered = filtered.filter(p => 
          params.brand.some(b => 
            p.brand.toLowerCase() === b.toLowerCase()
          )
        );
      }
      
      // Color filter - handle multiple selections
      if (params.color && params.color.length > 0) {
        filtered = filtered.filter(p => 
          params.color.some(col => 
            p.color.toLowerCase() === col.toLowerCase()
          )
        );
      }
      
      // Sorting
      if (params.sort === 'low-high') {
        filtered.sort((a, b) => 
          parseFloat(a.discountPrice.replace("$", "")) - 
          parseFloat(b.discountPrice.replace("$", ""))
        );
      } else if (params.sort === 'high-low') {
        filtered.sort((a, b) => 
          parseFloat(b.discountPrice.replace("$", "")) - 
          parseFloat(a.discountPrice.replace("$", ""))
        );
      }
      
      state.filteredItems = filtered;
      state.status = 'succeeded';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
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

export const { searchProducts, filterProducts } = productsSlice.actions;
export default productsSlice.reducer;