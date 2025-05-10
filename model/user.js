import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    addresses: [
      {
        fullName: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        isDefault: Boolean
      }
    ],
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true // includes createdAt and updatedAt automatically
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
