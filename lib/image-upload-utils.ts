/**
 * Production-grade image upload utilities
 * Handles image optimization, validation, and processing
 */

import sharp from 'sharp';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export interface ImageUploadOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  generateThumbnail?: boolean;
  thumbnailSize?: number;
  preserveOriginal?: boolean;
}

export interface ImageUploadResult {
  url: string;
  thumbnailUrl?: string;
  originalUrl?: string;
  filename: string;
  size: number;
  width: number;
  height: number;
  format: string;
  optimized: boolean;
}

export interface ImageValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

const DEFAULT_VALIDATION: ImageValidationOptions = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/avif'],
  minWidth: 50,
  minHeight: 50,
  maxWidth: 4000,
  maxHeight: 4000,
};

const DEFAULT_UPLOAD_OPTIONS: ImageUploadOptions = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 85,
  format: 'webp',
  generateThumbnail: true,
  thumbnailSize: 300,
  preserveOriginal: false,
};

/**
 * Validates an uploaded image file
 */
export async function validateImage(
  file: File,
  options: ImageValidationOptions = {}
): Promise<{ valid: boolean; error?: string; metadata?: any }> {
  const opts = { ...DEFAULT_VALIDATION, ...options };

  // Check file size
  if (file.size > opts.maxSize!) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${Math.round(opts.maxSize! / (1024 * 1024))}MB.`,
    };
  }

  // Check file type
  if (!opts.allowedTypes!.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${opts.allowedTypes!.join(', ')}`,
    };
  }

  try {
    // Get image metadata using Sharp
    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await sharp(buffer).metadata();

    // Check dimensions
    if (metadata.width && metadata.height) {
      if (metadata.width < opts.minWidth! || metadata.height < opts.minHeight!) {
        return {
          valid: false,
          error: `Image too small. Minimum dimensions: ${opts.minWidth}x${opts.minHeight}px`,
        };
      }

      if (metadata.width > opts.maxWidth! || metadata.height > opts.maxHeight!) {
        return {
          valid: false,
          error: `Image too large. Maximum dimensions: ${opts.maxWidth}x${opts.maxHeight}px`,
        };
      }
    }

    return {
      valid: true,
      metadata: {
        width: metadata.width,
        height: metadata.height,
        format: metadata.format,
        size: file.size,
        hasAlpha: metadata.hasAlpha,
        channels: metadata.channels,
      },
    };
  } catch (error) {
    return {
      valid: false,
      error: 'Invalid image file or corrupted data.',
    };
  }
}

/**
 * Processes and optimizes an uploaded image
 */
export async function processImage(
  file: File,
  options: ImageUploadOptions = {}
): Promise<ImageUploadResult> {
  const opts = { ...DEFAULT_UPLOAD_OPTIONS, ...options };
  
  // Validate image first
  const validation = await validateImage(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Date.now();
  const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  
  // Create upload directory
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const results: Partial<ImageUploadResult> = {
    optimized: true,
  };

  try {
    // Process main image
    const mainFileName = `${timestamp}-${nameWithoutExt}.${opts.format}`;
    const mainFilePath = join(uploadDir, mainFileName);
    
    let sharpInstance = sharp(buffer);
    
    // Resize if needed
    if (opts.maxWidth || opts.maxHeight) {
      sharpInstance = sharpInstance.resize(opts.maxWidth, opts.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Convert format and optimize
    switch (opts.format) {
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality: opts.quality });
        break;
      case 'jpeg':
        sharpInstance = sharpInstance.jpeg({ quality: opts.quality, progressive: true });
        break;
      case 'png':
        sharpInstance = sharpInstance.png({ quality: opts.quality, progressive: true });
        break;
      case 'avif':
        sharpInstance = sharpInstance.avif({ quality: opts.quality });
        break;
    }

    const processedBuffer = await sharpInstance.toBuffer();
    await writeFile(mainFilePath, processedBuffer);

    // Get processed image metadata
    const processedMetadata = await sharp(processedBuffer).metadata();
    
    results.url = `/uploads/${mainFileName}`;
    results.filename = mainFileName;
    results.size = processedBuffer.length;
    results.width = processedMetadata.width!;
    results.height = processedMetadata.height!;
    results.format = opts.format!;

    // Generate thumbnail if requested
    if (opts.generateThumbnail) {
      const thumbnailFileName = `${timestamp}-${nameWithoutExt}-thumb.${opts.format}`;
      const thumbnailFilePath = join(uploadDir, thumbnailFileName);
      
      const thumbnailBuffer = await sharp(buffer)
        .resize(opts.thumbnailSize, opts.thumbnailSize, {
          fit: 'cover',
          position: 'center',
        })
        .webp({ quality: 80 })
        .toBuffer();
      
      await writeFile(thumbnailFilePath, thumbnailBuffer);
      results.thumbnailUrl = `/uploads/${thumbnailFileName}`;
    }

    // Preserve original if requested
    if (opts.preserveOriginal) {
      const originalFileName = `${timestamp}-${originalName}`;
      const originalFilePath = join(uploadDir, originalFileName);
      await writeFile(originalFilePath, buffer);
      results.originalUrl = `/uploads/${originalFileName}`;
    }

    return results as ImageUploadResult;
  } catch (error) {
    console.error('Image processing error:', error);
    throw new Error('Failed to process image');
  }
}

/**
 * Deletes uploaded image files
 */
export async function deleteImage(filename: string): Promise<void> {
  try {
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadDir, filename);
    
    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    // Also try to delete thumbnail and original if they exist
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    const thumbnailPath = join(uploadDir, `${nameWithoutExt}-thumb.webp`);
    const originalPath = join(uploadDir, filename.replace(/^(\d+)-/, '$1-original-'));
    
    if (existsSync(thumbnailPath)) {
      await unlink(thumbnailPath);
    }
    
    if (existsSync(originalPath)) {
      await unlink(originalPath);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw error for cleanup operations
  }
}

/**
 * Generates responsive image srcset for Next.js Image component
 */
export function generateSrcSet(baseUrl: string, sizes: number[] = [640, 750, 828, 1080, 1200, 1920]): string {
  return sizes
    .map(size => `${baseUrl}?w=${size} ${size}w`)
    .join(', ');
}

/**
 * Extracts filename from URL for cleanup operations
 */
export function extractFilenameFromUrl(url: string): string | null {
  const match = url.match(/\/uploads\/(.+)$/);
  return match ? match[1] : null;
}