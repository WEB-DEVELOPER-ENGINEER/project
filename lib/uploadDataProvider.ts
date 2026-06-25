import { DataProvider } from 'react-admin';
import { dataProvider } from './dataProvider';
import { ImageUploadOptions } from './image-upload-utils';

// Configuration for different resource types
const RESOURCE_IMAGE_CONFIG: Record<string, {
  imageFields: string[];
  uploadOptions: ImageUploadOptions;
}> = {
  clients: {
    imageFields: ['client_images'],
    uploadOptions: {
      maxWidth: 800,
      maxHeight: 600,
      quality: 85,
      format: 'webp',
      generateThumbnail: true,
      thumbnailSize: 200,
    },
  },
  projects: {
    imageFields: ['project_images'],
    uploadOptions: {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 90,
      format: 'webp',
      generateThumbnail: true,
      thumbnailSize: 400,
    },
  },
  'project-images': {
    imageFields: ['image_url'],
    uploadOptions: {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 90,
      format: 'webp',
      generateThumbnail: true,
      thumbnailSize: 400,
    },
  },
  'client-images': {
    imageFields: ['image_url'],
    uploadOptions: {
      maxWidth: 800,
      maxHeight: 600,
      quality: 85,
      format: 'webp',
      generateThumbnail: true,
      thumbnailSize: 200,
    },
  },
  'blog-authors': {
    imageFields: ['image_url'],
    uploadOptions: {
      maxWidth: 400,
      maxHeight: 400,
      quality: 85,
      format: 'webp',
      generateThumbnail: true,
      thumbnailSize: 150,
    },
  },
  'blog-posts': {
    imageFields: ['featured_image', 'og_image', 'twitter_image'],
    uploadOptions: {
      maxWidth: 1200,
      maxHeight: 630,
      quality: 85,
      format: 'webp',
      generateThumbnail: true,
      thumbnailSize: 300,
    },
  },
  posts: {
    imageFields: ['image_url', 'og_image', 'twitter_image'],
    uploadOptions: {
      maxWidth: 1200,
      maxHeight: 630,
      quality: 85,
      format: 'webp',
      generateThumbnail: true,
      thumbnailSize: 300,
    },
  },
  sliders: {
    imageFields: ['image_url'],
    uploadOptions: {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 90,
      format: 'webp',
      generateThumbnail: true,
      thumbnailSize: 400,
    },
  },
  testimonials: {
    imageFields: ['image_url'],
    uploadOptions: {
      maxWidth: 400,
      maxHeight: 400,
      quality: 85,
      format: 'webp',
      generateThumbnail: true,
      thumbnailSize: 150,
    },
  },
  'team-members': {
    imageFields: ['image_url'],
    uploadOptions: {
      maxWidth: 400,
      maxHeight: 400,
      quality: 85,
      format: 'webp',
      generateThumbnail: true,
      thumbnailSize: 150,
    },
  },
  'about-us': {
    imageFields: ['image_url'],
    uploadOptions: {
      maxWidth: 1200,
      maxHeight: 800,
      quality: 90,
      format: 'webp',
      generateThumbnail: true,
      thumbnailSize: 300,
    },
  },
};

/**
 * Uploads a single file with optimization
 */
async function uploadFile(file: File, uploadOptions: ImageUploadOptions) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('options', JSON.stringify(uploadOptions));

  const response = await fetch('/api/admin/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }

  return response.json();
}

/**
 * Processes image fields for a resource
 */
async function processImageFields(
  resource: string,
  data: any,
  config: typeof RESOURCE_IMAGE_CONFIG[string]
) {
  const processedData = { ...data };

  for (const fieldName of config.imageFields) {
    const fieldValue = data[fieldName];

    if (!fieldValue) continue;

    // Handle array of images (like client_images)
    if (Array.isArray(fieldValue)) {
      const newImages = fieldValue.filter((item: any) => item.rawFile instanceof File);
      const existingImages = fieldValue.filter((item: any) => !(item.rawFile instanceof File));

      if (newImages.length > 0) {
        const uploadResults = await Promise.all(
          newImages.map(async (image: any) => {
            const result = await uploadFile(image.rawFile, config.uploadOptions);
            return {
              ...image,
              src: result.data.url,
              thumbnail: result.data.thumbnailUrl,
              width: result.data.width,
              height: result.data.height,
              size: result.data.size,
              format: result.data.format,
            };
          })
        );

        processedData[fieldName] = [...existingImages, ...uploadResults];
      }
    }
    // Handle single image field
    else if (fieldValue && fieldValue.rawFile instanceof File) {
      const result = await uploadFile(fieldValue.rawFile, config.uploadOptions);
      processedData[fieldName] = result.data.url;
      
      // Also set thumbnail URL if available
      if (result.data.thumbnailUrl) {
        processedData[`${fieldName}_thumbnail`] = result.data.thumbnailUrl;
      }
    }
  }

  return processedData;
}

export const uploadDataProvider: DataProvider = {
  ...dataProvider,
  
  create: async (resource, params) => {
    const config = RESOURCE_IMAGE_CONFIG[resource];
    
    if (config) {
      try {
        const processedData = await processImageFields(resource, params.data, config);
        const newParams = {
          ...params,
          data: processedData,
        };
        return dataProvider.create(resource, newParams);
      } catch (error) {
        console.error(`Image upload failed for ${resource}:`, error);
        throw error;
      }
    }

    return dataProvider.create(resource, params);
  },

  update: async (resource, params) => {
    const config = RESOURCE_IMAGE_CONFIG[resource];
    
    if (config) {
      try {
        const processedData = await processImageFields(resource, params.data, config);
        const newParams = {
          ...params,
          data: processedData,
        };
        return dataProvider.update(resource, newParams);
      } catch (error) {
        console.error(`Image upload failed for ${resource}:`, error);
        throw error;
      }
    }

    return dataProvider.update(resource, params);
  },
};