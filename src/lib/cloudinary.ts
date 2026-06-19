import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

export async function uploadImage(
  file: string | Buffer,
  folder: string = 'mjhs',
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: number | 'auto';
  }
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(
    typeof file === 'string' ? file : `data:image/jpeg;base64,${file.toString('base64')}`,
    {
      folder: `mjhs/${folder}`,
      transformation: [
        {
          width: options?.width || 1200,
          height: options?.height,
          crop: options?.crop || 'limit',
          quality: options?.quality || 'auto',
          fetch_format: 'auto',
        },
      ],
    }
  );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    size: result.bytes,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export function getOptimizedUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: number | 'auto';
    format?: string;
  }
): string {
  return cloudinary.url(publicId, {
    secure: true,
    transformation: [
      {
        width: options?.width,
        height: options?.height,
        crop: options?.crop || 'fill',
        quality: options?.quality || 'auto',
        fetch_format: options?.format || 'auto',
      },
    ],
  });
}

export { cloudinary };
