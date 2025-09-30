// Video Upload Component for Admin Panel
import React, { useState, useRef } from "react";
import { Upload, X, Loader2, AlertCircle, Play, Pause } from "lucide-react";
import { CloudinaryService } from "../services/cloudinaryService";

interface VideoUploadProps {
  onPreviewChange?: (preview: any) => void;
  maxFileSize?: number;
  acceptedTypes?: string[];
  className?: string;
}

const VideoUpload = React.forwardRef<HTMLInputElement, VideoUploadProps>(
  (
    {
      onPreviewChange,
      maxFileSize = 100 * 1024 * 1024, // 100MB default for videos
      acceptedTypes = ["video/mp4", "video/webm", "video/ogg", "video/avi", "video/mov"],
      className = "",
    },
    ref
  ) => {
    const [preview, setPreview] = useState<any>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string>("");
    const [isPlaying, setIsPlaying] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const validateFile = (file: File): string | null => {
      if (!acceptedTypes.includes(file.type)) {
        return `Tipo de archivo no soportado. Formatos aceptados: ${acceptedTypes.join(", ")}`;
      }

      if (file.size > maxFileSize) {
        const maxSizeMB = Math.round(maxFileSize / (1024 * 1024));
        return `El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`;
      }

      return null;
    };

    const handleFileSelect = (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError("");
      const videoUrl = URL.createObjectURL(file);
      const newPreview = {
        file,
        url: videoUrl,
        name: file.name,
        size: file.size,
        type: file.type,
      };

      setPreview(newPreview);
      onPreviewChange?.(newPreview);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    };

    const removePreview = () => {
      if (preview?.url) {
        URL.revokeObjectURL(preview.url);
      }
      setPreview(null);
      setError("");
      setIsPlaying(false);
      onPreviewChange?.(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    const togglePlayPause = () => {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
      <div className={`w-full ${className}`}>
        {!preview ? (
          <div
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
              ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
              ${error ? "border-red-300 bg-red-50" : ""}
            `}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
          >
            <input
              ref={ref || fileInputRef}
              type="file"
              accept={acceptedTypes.join(",")}
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 text-gray-400">
                <Upload className="w-full h-full" />
              </div>

              <div>
                <p className="text-lg font-medium text-gray-900">
                  Arrastra un video aquí o haz clic para seleccionar
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Formatos soportados: {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(", ")}
                </p>
                <p className="text-sm text-gray-500">
                  Tamaño máximo: {Math.round(maxFileSize / (1024 * 1024))}MB
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-4 flex items-center justify-center text-red-600">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Video Preview */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                src={preview.url}
                className="w-full h-64 object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />
              
              {/* Play/Pause Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={togglePlayPause}
                  className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3 transition-all"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-1" />
                  )}
                </button>
              </div>
            </div>

            {/* File Info */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {preview.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(preview.size)} • {preview.type}
                </p>
              </div>
              
              <button
                onClick={removePreview}
                className="ml-4 p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Eliminar video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

VideoUpload.displayName = "VideoUpload";

// Video Upload Form Component with metadata
interface VideoUploadFormProps {
  onUploadSuccess: (result: any) => void;
  onUploadError: (error: any) => void;
  onCancel: () => void;
  videoType: "snowboard" | "surf";
}

export const VideoUploadForm: React.FC<VideoUploadFormProps> = ({
  onUploadSuccess,
  onUploadError,
  onCancel,
  videoType,
}) => {
  const [preview, setPreview] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
  });

  const handleUpload = async () => {
    if (!preview) {
      onUploadError(new Error("Por favor selecciona un video"));
      return;
    }

    if (!videoData.title.trim()) {
      onUploadError(new Error("Por favor ingresa un título para el video"));
      return;
    }

    setUploading(true);

    try {
      const uploadOptions = {
        folder: `videos/${videoType}`,
        tags: [videoType, "video", "admin-upload"],
        context: {
          title: videoData.title || "",
          description: videoData.description || "",
          type: videoType,
        },
      };

      const result = await CloudinaryService.uploadVideo(
        preview.file,
        uploadOptions
      );

      // Call success callback with video data
      if (onUploadSuccess) {
        onUploadSuccess({
          url: result.secureUrl,
          title: videoData.title || preview.name,
          description: videoData.description || "",
          type: videoType,
          publicId: result.publicId,
          width: result.width,
          height: result.height,
          duration: result.duration,
          size: result.bytes,
          format: result.format,
        });
      }
    } catch (error: any) {
      console.error("Video upload error:", error);
      onUploadError(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <VideoUpload
        onPreviewChange={setPreview}
        maxFileSize={100 * 1024 * 1024} // 100MB
      />

      {preview && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título del Video *
            </label>
            <input
              type="text"
              value={videoData.title}
              onChange={(e) =>
                setVideoData({ ...videoData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Video de ${videoType === "snowboard" ? "Snowboard" : "Surf"}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (Opcional)
            </label>
            <textarea
              value={videoData.description}
              onChange={(e) =>
                setVideoData({ ...videoData, description: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción del video..."
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleUpload}
              disabled={uploading || !videoData.title.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subiendo...
                </>
              ) : (
                "Subir Video"
              )}
            </button>

            <button
              onClick={onCancel}
              disabled={uploading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
