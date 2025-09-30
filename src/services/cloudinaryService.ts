// Cloudinary service for image upload and management
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";

// Cloudinary configuration interface
interface CloudinaryConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  uploadPreset: string;
}

// Upload options interface
interface UploadOptions {
  folder?: string;
  tags?: string | string[];
  context?: Record<string, string>;
}

// Upload result interface
interface UploadResult {
  publicId: string;
  secureUrl: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  createdAt: string;
  duration?: number; // Video-specific property
}

// Image optimization options interface
interface OptimizationOptions {
  width?: number;
  height?: number;
  transformations?: any; // Can be extended based on Cloudinary transformations
}

// Cloudinary configuration
const cloudinaryConfig: CloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "",
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || "",
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET || "",
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "",
};

// Initialize Cloudinary instance
const cld = new Cloudinary({
  cloud: {
    cloudName: cloudinaryConfig.cloudName,
  },
});

// Validate configuration
const validateConfig = (): boolean => {
  const requiredFields: (keyof CloudinaryConfig)[] = [
    "cloudName",
    "uploadPreset",
  ];
  const missingFields = requiredFields.filter(
    (field) => !cloudinaryConfig[field]
  );

  if (missingFields.length > 0) {
    console.warn("Missing Cloudinary configuration:", missingFields);
    return false;
  }
  return true;
};

// Upload image to Cloudinary
export const uploadImage = async (
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  if (!validateConfig()) {
    throw new Error("Cloudinary configuration is incomplete");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryConfig.uploadPreset);

  // Add optional parameters
  if (options.folder) {
    formData.append("folder", options.folder);
  }

  if (options.tags) {
    formData.append(
      "tags",
      Array.isArray(options.tags) ? options.tags.join(",") : options.tags
    );
  }

  if (options.context) {
    const contextString = Object.entries(options.context)
      .map(([key, value]) => `${key}=${value}`)
      .join("|");
    formData.append("context", contextString);
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Upload failed");
    }

    const result = await response.json();
    return {
      publicId: result.public_id,
      secureUrl: result.secure_url,
      url: result.url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      createdAt: result.created_at,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

// Upload video to Cloudinary
export const uploadVideo = async (
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  if (!validateConfig()) {
    throw new Error("Cloudinary configuration is incomplete");
  }

  // Validate file type
  const allowedVideoTypes = [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/avi",
    "video/mov",
  ];
  if (!allowedVideoTypes.includes(file.type)) {
    throw new Error(
      `Unsupported video format: ${
        file.type
      }. Supported formats: ${allowedVideoTypes.join(", ")}`
    );
  }

  // Validate file size (max 100MB for videos)
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    throw new Error(
      `Video file too large. Maximum size is ${maxSize / (1024 * 1024)}MB`
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryConfig.uploadPreset);
  formData.append("resource_type", "video");

  // Add optional parameters
  if (options.folder) {
    formData.append("folder", options.folder);
  }

  if (options.tags) {
    formData.append(
      "tags",
      Array.isArray(options.tags) ? options.tags.join(",") : options.tags
    );
  }

  if (options.context) {
    const contextString = Object.entries(options.context)
      .map(([key, value]) => `${key}=${value}`)
      .join("|");
    formData.append("context", contextString);
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/video/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Video upload failed");
    }

    const result = await response.json();
    return {
      publicId: result.public_id,
      secureUrl: result.secure_url,
      url: result.url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      createdAt: result.created_at,
      duration: result.duration, // Video-specific property
    };
  } catch (error) {
    console.error("Cloudinary video upload error:", error);
    throw error;
  }
};

// Delete image from Cloudinary
export const deleteImage = async (publicId: string): Promise<any> => {
  if (!validateConfig()) {
    throw new Error("Cloudinary configuration is incomplete");
  }

  if (!cloudinaryConfig.apiKey || !cloudinaryConfig.apiSecret) {
    throw new Error("API key and secret are required for delete operations");
  }

  try {
    // Generate timestamp and signature for authenticated request
    const timestamp = Math.round(new Date().getTime() / 1000);
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${cloudinaryConfig.apiSecret}`;

    // Simple hash function (for production, use crypto library)
    const signature = await generateSignature(stringToSign);

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("timestamp", timestamp.toString());
    formData.append("api_key", cloudinaryConfig.apiKey);
    formData.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/destroy`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Delete failed");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
};

// Delete video from Cloudinary
export const deleteVideo = async (publicId: string): Promise<any> => {
  if (!validateConfig()) {
    throw new Error("Cloudinary configuration is incomplete");
  }

  if (!cloudinaryConfig.apiKey || !cloudinaryConfig.apiSecret) {
    throw new Error("API key and secret are required for delete operations");
  }

  try {
    // Generate timestamp and signature for authenticated request
    const timestamp = Math.round(new Date().getTime() / 1000);
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${cloudinaryConfig.apiSecret}`;

    // Simple hash function (for production, use crypto library)
    const signature = await generateSignature(stringToSign);

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("timestamp", timestamp.toString());
    formData.append("api_key", cloudinaryConfig.apiKey);
    formData.append("signature", signature);
    formData.append("resource_type", "video");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/video/destroy`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Video delete failed");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Cloudinary video delete error:", error);
    throw error;
  }
};

// Generate optimized image URL
export const getOptimizedImageUrl = (
  publicId: string,
  options: OptimizationOptions = {}
): string | null => {
  if (!publicId) return null;

  try {
    let image = cld.image(publicId);

    // Apply default optimizations
    image = image.delivery(format("auto")).delivery(quality("auto"));

    // Apply resize if specified
    if (options.width || options.height) {
      let resizeTransform = auto().gravity(autoGravity());
      if (options.width) {
        resizeTransform = resizeTransform.width(options.width);
      }
      if (options.height) {
        resizeTransform = resizeTransform.height(options.height);
      }
      image = image.resize(resizeTransform);
    }

    // Apply custom transformations
    if (options.transformations) {
      // Custom transformations can be added here
    }

    return image.toURL();
  } catch (error) {
    console.error("Error generating optimized URL:", error);
    return null;
  }
};

// Generate thumbnail URL
export const getThumbnailUrl = (
  publicId: string,
  size: number = 300
): string | null => {
  return getOptimizedImageUrl(publicId, {
    width: size,
    height: size,
  });
};

// Simple signature generation (for production, use proper crypto library)
const generateSignature = async (stringToSign: string): Promise<string> => {
  // This is a simplified version. In production, you should use a proper crypto library
  // or handle signature generation on your backend for security
  const encoder = new TextEncoder();
  const data = encoder.encode(stringToSign);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

// Extract public ID from Cloudinary URL
export const extractPublicId = (cloudinaryUrl: string): string | null => {
  if (!cloudinaryUrl) return null;

  try {
    // Match pattern: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/image_name.jpg
    const match = cloudinaryUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
    return match ? match[1] : null;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
};

// Check if URL is a Cloudinary URL
export const isCloudinaryUrl = (url: string): boolean => {
  return Boolean(url && url.includes("cloudinary.com"));
};

// Cloudinary service object
export const CloudinaryService = {
  uploadImage,
  uploadVideo,
  deleteImage,
  deleteVideo,
  getOptimizedImageUrl,
  getThumbnailUrl,
  extractPublicId,
  isCloudinaryUrl,
  validateConfig,
};

export default CloudinaryService;
