// Cloudinary Upload Component for Admin Panel
import React, { useState, useRef } from "react";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import { CloudinaryService } from "../services/cloudinaryService";

interface CloudinaryUploadProps {
  onPreviewChange?: (preview: any) => void;
  maxFileSize?: number;
  acceptedTypes?: string[];
  className?: string;
}

const CloudinaryUpload = React.forwardRef<
  HTMLInputElement,
  CloudinaryUploadProps
>(
  (
    {
      onPreviewChange,
      maxFileSize = 10 * 1024 * 1024, // 10MB default
      acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
      className = "",
    },
    _ref
  ) => {
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle file selection
    const handleFileSelect = (files: FileList) => {
      const file = files[0];
      if (!file) return;

      // Validate file type
      if (!acceptedTypes.includes(file.type)) {
        setError(
          `Tipo de archivo no soportado. Use: ${acceptedTypes.join(", ")}`
        );
        return;
      }

      // Validate file size
      if (file.size > maxFileSize) {
        setError(
          `El archivo es muy grande. Máximo: ${Math.round(
            maxFileSize / 1024 / 1024
          )}MB`
        );
        return;
      }

      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const previewData = {
            url: e.target.result,
            name: file.name,
            size: file.size,
            file: file,
          };
          setPreview(previewData);
        }

        // Notify parent component about preview state
        if (onPreviewChange) {
          onPreviewChange(true);
        }
      };
      reader.readAsDataURL(file);
    };

    // Handle drag events
    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    // Handle drop
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files);
      }
    };

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelect(e.target.files);
      }
    };

    // Clear preview
    const clearPreview = () => {
      setPreview(null);
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Notify parent component about preview state
      if (onPreviewChange) {
        onPreviewChange(false);
      }
    };

    // Format file size
    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
      <div className={`cloudinary-upload ${className}`}>
        {!preview ? (
          // Upload area
          <div
            className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
            ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }
          `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={acceptedTypes.join(",")}
              onChange={handleInputChange}
            />

            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <Upload className="h-8 w-8 text-gray-600" />
              </div>

              <div>
                <p className="text-lg font-medium text-gray-900">
                  Arrastra una imagen aquí
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  o haz clic para seleccionar
                </p>
              </div>

              <div className="text-xs text-gray-400">
                <p>Formatos: JPG, PNG, WebP</p>
                <p>Tamaño máximo: {Math.round(maxFileSize / 1024 / 1024)}MB</p>
              </div>
            </div>
          </div>
        ) : (
          // Preview area
          <div className="space-y-4">
            <div className="relative bg-gray-50 rounded-lg p-4">
              <button
                onClick={clearPreview}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={preview.url}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {preview.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(preview.size)}
                  </p>

                  {error && (
                    <div className="mt-2 flex items-center space-x-1 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

// Simplified upload form component with internal state management
interface CloudinaryUploadFormProps {
  onUploadSuccess: (result: any) => void;
  onUploadError: (error: any) => void;
  onCancel: () => void;
}

export const CloudinaryUploadForm = ({
  onUploadSuccess,
  onUploadError,
  onCancel,
}: CloudinaryUploadFormProps) => {
  const [imageData, setImageData] = useState({
    alt: "",
    category: "Surf",
  });
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (files: FileList) => {
    const file = files[0];
    if (!file) return;

    // Validate file type
    const acceptedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (!acceptedTypes.includes(file.type)) {
      setError(
        `Tipo de archivo no soportado. Use: ${acceptedTypes.join(", ")}`
      );
      return;
    }

    // Validate file size (10MB)
    const maxFileSize = 10 * 1024 * 1024;
    if (file.size > maxFileSize) {
      setError(`El archivo es muy grande. Máximo: 10MB`);
      return;
    }

    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreview({
          url: e.target.result,
          name: file.name,
          size: file.size,
          file: file,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files);
    }
  };

  // Clear preview
  const clearPreview = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Handle upload
  const handleUpload = async () => {
    if (!preview) {
      alert("Por favor selecciona una imagen primero");
      return;
    }

    if (!imageData.alt.trim()) {
      alert("Por favor ingresa una descripción para la imagen");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploadOptions = {
        folder: "gallery",
        tags: ["gallery", "admin-upload"],
        context: {
          alt: imageData.alt || "",
          category: imageData.category || "Surf",
        },
      };

      const result = await CloudinaryService.uploadImage(
        preview.file,
        uploadOptions
      );

      // Call success callback with image data
      if (onUploadSuccess) {
        onUploadSuccess({
          src: result.secureUrl,
          alt: imageData.alt || preview.name,
          category: imageData.category || "Surf",
          publicId: result.publicId,
          width: result.width,
          height: result.height,
          size: result.bytes,
        });
      }

      // Reset form
      setPreview(null);
      setImageData({ alt: "", category: "Surf" });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError(
        error instanceof Error ? error.message : "Error al subir la imagen"
      );
      if (onUploadError) {
        onUploadError(error);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {!preview ? (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
            ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleInputChange}
          />

          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-gray-100 rounded-full">
              <Upload className="h-8 w-8 text-gray-600" />
            </div>

            <div>
              <p className="text-lg font-medium text-gray-900">
                Arrastra una imagen aquí
              </p>
              <p className="text-sm text-gray-500 mt-1">
                o haz clic para seleccionar
              </p>
            </div>

            <div className="text-xs text-gray-400">
              <p>Formatos: JPG, PNG, WebP</p>
              <p>Tamaño máximo: 10MB</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative bg-gray-50 rounded-lg p-4">
            <button
              onClick={clearPreview}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <img
                  src={preview.url}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {preview.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(preview.size)}
                </p>

                {error && (
                  <div className="mt-2 flex items-center space-x-1 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metadata inputs */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción de la imagen *
          </label>
          <input
            type="text"
            value={imageData.alt}
            onChange={(e) =>
              setImageData((prev) => ({ ...prev, alt: e.target.value }))
            }
            placeholder="Ej: Surfista en ola perfecta"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            value={imageData.category}
            onChange={(e) =>
              setImageData((prev) => ({ ...prev, category: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Surf">Surf</option>
            <option value="Snowboard">Snowboard</option>
          </select>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          disabled={uploading}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleUpload}
          disabled={!preview || !imageData.alt.trim() || uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Subiendo...</span>
            </>
          ) : (
            <span>Subir Imagen</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default CloudinaryUpload;
