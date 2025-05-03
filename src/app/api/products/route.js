// app/api/products/route.js
import { NextResponse } from 'next/server';
import connectMongoDB from '../../../../lib/connectMongoDB ';
import Product from '../../../../model/product';
import { writeFile } from 'fs/promises';
import path from 'path';
import { promises as fs } from 'fs';


export async function GET(request) {
  try {
    await connectMongoDB();
    
    const { searchParams } = new URL(request.url);
    const gender = searchParams.get('gender');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const featured = searchParams.get('featured');
    const showInCarousel = searchParams.get('showInCarousel');
    const showInBrowseCategories = searchParams.get('showInBrowseCategories');
    const showInShopByCategory = searchParams.get('showInShopByCategory');
    
    const query = {};
    if (gender) query.gender = gender.toLowerCase();
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (featured) query.featured = featured === 'true';
    
    // Add filters for display flags
    if (showInCarousel) query.showInCarousel = showInCarousel === 'true';
    if (showInBrowseCategories) query.showInBrowseCategories = showInBrowseCategories === 'true';
    if (showInShopByCategory) query.showInShopByCategory = showInShopByCategory === 'true';

    const products = await Product.find(query).limit(50).lean();
    
    return NextResponse.json({ 
      success: true, 
      count: products.length,
      products: products || [] 
    });
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectMongoDB();
    const formData = await request.formData();
    
    // Log received form data for debugging
    console.log('Received form data:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Validate required fields
    const title = formData.get('title');
    if (!title) throw new Error('Title is required');
    
    const price = parseFloat(formData.get('price'));
    if (isNaN(price)) throw new Error('Invalid price');
    
    // Process image upload
    const imageFile = formData.get('image');
    if (!imageFile || imageFile.size === 0) throw new Error('Product image is required');
    
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    
    const ext = path.extname(imageFile.name);
    const filename = `${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, filename);
    
    await writeFile(filePath, buffer);
    const imagePath = `/uploads/${filename}`;

    // Create new product with all fields including display settings
    const productData = {
      title,
      image: imagePath,
      price,
      discountPrice: parseFloat(formData.get('discountPrice') || price),
      gender: formData.get('gender'),
      category: formData.get('category'),
      brand: formData.get('brand'),
      color: formData.get('color'),
      showInCarousel: formData.get('showInCarousel') === 'true',
      showInBrowseCategories: formData.get('showInBrowseCategories') === 'true',
      showInShopByCategory: formData.get('showInShopByCategory') === 'true',
      createdAt: new Date()
    };

    console.log('Creating product with data:', productData); 

    const product = new Product(productData);
    await product.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product created successfully',
      product 
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) throw new Error('Product ID is required');
    
    const formData = await request.formData();
    const updates = {};
    
    // Process each field
    const fields = ['title', 'price', 'discountPrice', 'gender', 'category', 'brand', 'color', 'featured'];
    fields.forEach(field => {
      const value = formData.get(field);
      if (value !== null) {
        if (field === 'price' || field === 'discountPrice') {
          updates[field] = parseFloat(value);
        } else if (field === 'featured') {
          updates[field] = value === 'true';
        } else {
          updates[field] = value;
        }
      }
    });
    
    // Handle image update if provided
    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });
      
      const ext = path.extname(imageFile.name);
      const filename = `${Date.now()}${ext}`;
      const filePath = path.join(uploadDir, filename);
      
      await writeFile(filePath, buffer);
      updates.image = `/uploads/${filename}`;
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );
    
    if (!updatedProduct) throw new Error('Product not found');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product updated successfully',
      product: updatedProduct 
    });
    
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) throw new Error('Product ID is required');
    
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) throw new Error('Product not found');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}