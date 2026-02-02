'use server'

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadEditorImage(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<{ success: boolean; url?: string; error?: string }>((resolve) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'swiftlink-blog', // Keep your folder organization
          // Optional: You can resize huge images upon upload here if needed
          // transformation: [{ width: 1200, crop: "limit" }] 
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary Upload Error:', error);
            resolve({ success: false, error: 'Cloudinary upload failed' });
          } else {
            // --- OPTIMIZATION MAGIC ---
            // We construct a specific URL that forces:
            // 1. f_auto (Best Format): Serves AVIF to Chrome, WebP to Edge, etc.
            // 2. q_auto (Best Quality): Smart compression that saves bytes without visible pixelation.
            
            const optimizedUrl = cloudinary.url(result?.public_id || '', {
              fetch_format: 'auto',
              quality: 'auto',
              secure: true, // Always use HTTPS
              version: result?.version // Include version for better caching performance
            });

            resolve({ success: true, url: optimizedUrl });
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    console.error('Server Upload Error:', error);
    return { success: false, error: 'Server upload error' };
  }
}