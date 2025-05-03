// //app/api/ productsAdd
// import { NextResponse } from 'next/server';
// import connectMongoDB from "../../../../lib/connectMongoDB ";
// import Product from '../../../../model/product';
// import { writeFile } from 'fs/promises';
// import path from 'path';
// import { promises as fs } from 'fs';

// const connectDB = async () => {
//   if (mongoose.connection.readyState === 0) {
//     await mongoose.connect(process.env.MONGODB_URI);
//   }
// };

// export async function POST(request) {
//   try {
//     await connectMongoDB();
//     const formData = await request.formData();

//     const productData = {
//       title: formData.get('title'),
//       price: parseFloat(formData.get('price')),
//       discountPrice: parseFloat(formData.get('discountPrice')),
//       gender: formData.get('gender').toLowerCase(),
//       category: formData.get('category'),
//       brand: formData.get('brand'),
//       color: formData.get('color'),
//       image: '', // We'll handle image separately below
//       showInCarousel: formData.get('showInCarousel') === 'true', // 👈 Convert string to boolean
//       showInBrowseCategories: formData.get('showInBrowseCategories') === 'true', // 👈
//       showInShopByCategory: formData.get('showInShopByCategory') === 'true', // 👈
//     };

//     // Handle image upload
//     const file = formData.get('image');
//     if (file && typeof file === 'object' && file.arrayBuffer) {
//       const bytes = await file.arrayBuffer();
//       const buffer = Buffer.from(bytes);
//       const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
//       await fs.mkdir(uploadDir, { recursive: true });

//       const imageName = `${Date.now()}-${file.name}`;
//       const imagePath = path.join(uploadDir, imageName);
      
//       await writeFile(imagePath, buffer);

//       productData.image = `/uploads/${imageName}`;
//     }

//     const newProduct = await Product.create(productData);

//     return NextResponse.json({ message: 'Product added successfully!', product: newProduct }, { status: 201 });
//   } catch (error) {
//     console.error('POST error:', error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
