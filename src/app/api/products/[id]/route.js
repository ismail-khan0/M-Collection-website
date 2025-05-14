import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import dbConnect from '@/lib/dbConnect';
import { uploadImage } from '@/lib/cloudinary';

export async function GET() {
  await dbConnect();
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const formData = await request.formData();
    
    const productData = {
      title: formData.get('title'),
      price: parseFloat(formData.get('price')),
      discountPrice: formData.get('discountPrice') ? parseFloat(formData.get('discountPrice')) : null,
      gender: formData.get('gender'),
      category: formData.get('category'),
      brand: formData.get('brand'),
      color: formData.get('color'),
      featured: formData.get('featured') === 'true'
    };

    const imageFile = formData.get('image');
    if (imageFile) {
      const imageUrl = await uploadImage(imageFile);
      productData.image = imageUrl;
    }

    const product = await Product.create(productData);
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}