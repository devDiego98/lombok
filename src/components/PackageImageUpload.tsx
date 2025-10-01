// Package Image Upload Component for Admin Panel
import React, { useState, useRef } from "react";
import { Upload, X, Loader2, AlertCircle, Image as ImageIcon } from "lucide-react";
import { CloudinaryService } from "../services/cloudinaryService";

interface PackageImageUploadProps {
  currentImage?: string;
  onImageUpload: (imageData: {
    src: string;
    publicId: string;
    width: number;
    height: number;
    size: number;
  }) => void;
  onImageRemove?: () => void;
  packageType: "surf" | "snowboard";
  disabled?: boolean;
  className?: string;
}

interface PreviewData {
  file: File;
  url: string;
  name: string;
  size: number;
}

export const PackageImageUpload: React.FC<PackageImageUploadProps> = ({
  currentImage,
  onImageUpload,
  onImageRemove,
  packageType,
  disabled = false,
  className = "",
}) => {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const acceptedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return "Tipo de archivo no soportado. Usa JPG, PNG o WebP.";
    }
    if (file.size > maxFileSize) {
      return "El archivo es muy grande. Máximo 10MB.";
    }
    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    const url = URL.createObjectURL(file);
    setPreview({
      file,
      url,
      name: file.name,
      size: file.size,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!preview) return;

    setUploading(true);
    setError(null);

    try {
      const uploadOptions = {
        folder: `packages/${packageType}`,
        tags: ["package", packageType, "admin-upload"],
        context: {
          type: "package-image",
          packageType: packageType,
        },
      };

      const result = await CloudinaryService.uploadImage(
        preview.file,
        uploadOptions
      );

      onImageUpload({
        src: result.secureUrl,
        publicId: result.publicId,
        width: result.width,
        height: result.height,
        size: result.bytes,
      });

      // Reset preview
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      setError("Error al subir la imagen: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveCurrentImage = () => {
    if (onImageRemove) {
      onImageRemove();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`package-image-upload ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Imagen del Paquete
      </label>

      {/* Current Image Display */}
      {currentImage && !preview && (
        <div className="mb-4">
          <div className="relative inline-block">
            <img
              src={currentImage}
              alt="Imagen actual del paquete"
              className="w-full max-w-xs h-32 object-cover rounded-lg border border-gray-300"
            />
            {onImageRemove && (
              <button
                type="button"
                onClick={handleRemoveCurrentImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                title="Eliminar imagen actual"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Imagen actual</p>
        </div>
      )}

      {/* Upload Area */}
      {!preview ? (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
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
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={acceptedTypes.join(",")}
            onChange={handleInputChange}
            disabled={disabled}
          />
          
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium text-blue-600">Haz clic para subir</span> o arrastra una imagen aquí
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, WebP hasta 10MB
          </p>
        </div>
      ) : (
        /* Preview Area */
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex items-start space-x-4">
            <img
              src={preview.url}
              alt="Vista previa"
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {preview.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(preview.size)}
              </p>
              <div className="flex space-x-2 mt-3">
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs flex items-center space-x-1 disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Upload className="h-3 w-3" />
                  )}
                  <span>{uploading ? "Subiendo..." : "Subir"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={uploading}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-xs flex items-center space-x-1 disabled:opacity-50"
                >
                  <X className="h-3 w-3" />
                  <span>Cancelar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-2 flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-gray-500 mt-2">
        La imagen se usará como imagen principal del paquete en la galería y páginas de detalle.
      </p>
    </div>
  );
};
