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
    filterProducts: (state, action) => {
      const { gender, category, brand, color, sort } = action.payload;
      let filtered = [...state.items];
      
      if (gender) filtered = filtered.filter(p => p.gender.toLowerCase() === gender.toLowerCase());
      if (category) filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
      if (brand) filtered = filtered.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
      if (color) filtered = filtered.filter(p => p.color.toLowerCase() === color.toLowerCase());
      
      if (sort === 'low-high') {
        filtered.sort((a, b) => parseFloat(a.discountPrice.replace("$", "")) - parseFloat(b.discountPrice.replace("$", "")));
      } else if (sort === 'high-low') {
        filtered.sort((a, b) => parseFloat(b.discountPrice.replace("$", "")) - parseFloat(a.discountPrice.replace("$", "")));
      }
      
      state.filteredItems = filtered;
    },
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

export const { filterProducts } = productsSlice.actions;
export default productsSlice.reducer;