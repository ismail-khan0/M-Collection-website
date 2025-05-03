import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  image: {
    type: String,
    required: [true, "Image is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  discountPrice: {
    type: Number,
    min: [0, "Discount price cannot be negative"],
  },
  gender: {
    type: String,
    enum: ["men", "women", "kids", "unisex"],
    required: [true, "Gender is required"],
    lowercase: true,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true,
  },
  brand: {
    type: String,
    required: [true, "Brand is required"],
    trim: true,
  },
  color: {
    type: String,
    required: [true, "Color is required"],
    trim: true,
    lowercase: true,
  },
  // Display settings
  showInCarousel: {
    type: Boolean,
    default: false,
  },
  showInBrowseCategories: {
    type: Boolean,
    default: false,
  },
  showInShopByCategory: {
    type: Boolean,
    default: false,
  },
  // Kids section specific settings
  showInKidsFavoriteBrands: {
    type: Boolean,
    default: false,
  },
  showInKidsIconicBrands: {
    type: Boolean,
    default: false,
  },
  showInKidsCategories: {
    type: Boolean,
    default: false,
  },
  showInKidsExploreMore: {
    type: Boolean,
    default: false,
  },
  featuredInKidsSection: {
    type: Boolean,
    default: false,
  },
  kidsSectionOrder: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);