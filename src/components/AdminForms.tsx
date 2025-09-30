// Additional form components for the admin panel
import React from "react";
import {
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Home,
  Utensils,
  Shield,
  BookOpen,
  Activity,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Calendar,
  Users,
  Check,
  Upload,
} from "lucide-react";
import { CloudinaryService } from "../services/cloudinaryService";

// Type definitions
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

interface NewPackage {
  name: string;
  description: string;
  price: number | string;
  duration: string;
  featured: boolean;
  type: "surf" | "snowboard";
}

interface AddPackageFormProps {
  newPackage: NewPackage;
  setNewPackage: React.Dispatch<React.SetStateAction<NewPackage>>;
  handleAddPackage: () => void;
  setShowAddPackageForm: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

interface PackageItemProps {
  pkg: any;
  type: string;
  isEditing: boolean;
  onEdit: (id: string) => void;
  onSave: (id: string, data: any, type: string) => void;
  onCancel: () => void;
  onDelete: (packageId: string, type: string) => void;
  onEditDetails: (id: string) => void;
  onManageDateRanges?: (id: string, type: string) => void;
  onManageTripMembers?: (id: string, type: string) => void;
  loading: boolean;
}

// Removed unused interfaces - they are defined inline where used

// Modal Component
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "lg",
}) => {
  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-6xl",
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-[#00000099] bg-opacity-20 flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg shadow-xl ${sizeClasses[size]} w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate pr-4">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
        <div className="overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

// Package Form Components
export const AddPackageForm: React.FC<AddPackageFormProps> = ({
  newPackage,
  setNewPackage,
  handleAddPackage,
  setShowAddPackageForm,
  loading,
}) => (
  <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 mb-6">
    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
      Agregar Nuevo Paquete
    </h3>
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Paquete
          </label>
          <input
            type="text"
            value={newPackage.name}
            onChange={(e) =>
              setNewPackage({ ...newPackage, name: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
            placeholder="Ej: Paquete Básico de Surf"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo
          </label>
          <select
            value={newPackage.type}
            onChange={(e) =>
              setNewPackage({
                ...newPackage,
                type: e.target.value as "surf" | "snowboard",
              })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="surf">Surf</option>
            <option value="snowboard">Snowboard</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción
        </label>
        <textarea
          value={newPackage.description}
          onChange={(e) =>
            setNewPackage({ ...newPackage, description: e.target.value })
          }
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          placeholder="Describe el paquete y lo que incluye..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio (USD)
          </label>
          <input
            type="number"
            value={newPackage.price}
            onChange={(e) =>
              setNewPackage({ ...newPackage, price: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
            placeholder="299"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duración
          </label>
          <input
            type="text"
            value={newPackage.duration}
            onChange={(e) =>
              setNewPackage({ ...newPackage, duration: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
            placeholder="3 días"
          />
        </div>
        <div className="flex items-center sm:col-span-2 lg:col-span-1">
          <label className="flex items-center space-x-2 mt-0 sm:mt-6">
            <input
              type="checkbox"
              checked={newPackage.featured}
              onChange={(e) =>
                setNewPackage({ ...newPackage, featured: e.target.checked })
              }
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Paquete Destacado
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
        <button
          onClick={handleAddPackage}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 text-sm sm:text-base"
        >
          <Plus className="h-4 w-4" />
          <span>Agregar Paquete</span>
        </button>
        <button
          onClick={() => {
            setShowAddPackageForm(false);
            setNewPackage({
              name: "",
              description: "",
              price: "",
              duration: "",
              featured: false,
              type: "surf",
            });
          }}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 sm:px-6 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm sm:text-base"
        >
          <X className="h-4 w-4" />
          <span>Cancelar</span>
        </button>
      </div>
    </div>
  </div>
);

// Package Item Component
export const PackageItem: React.FC<PackageItemProps> = ({
  pkg,
  type,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onEditDetails,
  onManageDateRanges,
  onManageTripMembers,
  loading,
}) => {
  const [editData, setEditData] = React.useState({
    id: pkg.id,
    name: pkg.name,
    description: pkg.description,
    price: pkg.price,
    duration: pkg.duration,
    featured: pkg.featured,
    image: pkg.image,
    highlights: pkg.highlights || [],
    dateRanges: pkg.dateRanges || [], // Use dateRanges array instead of single dateRange
  });

  const handleSave = () => {
    onSave(pkg.id, editData, type);
  };

  const [newHighlight, setNewHighlight] = React.useState("");
  const [editingHighlightIndex, setEditingHighlightIndex] = React.useState<
    number | null
  >(null);
  const [editingHighlightText, setEditingHighlightText] = React.useState("");

  const handleAddHighlight = () => {
    console.log("handleAddHighlight called with:", newHighlight);
    console.log("Current highlights:", editData.highlights);
    if (newHighlight.trim()) {
      setEditData((prev) => {
        const newHighlights = [...prev.highlights, newHighlight.trim()];
        console.log("Adding highlight, new highlights array:", newHighlights);
        return {
          ...prev,
          highlights: newHighlights,
        };
      });
      setNewHighlight("");
    } else {
      console.log("newHighlight is empty or whitespace only");
    }
  };

  const handleStartEditHighlight = (index: number) => {
    setEditingHighlightIndex(index);
    setEditingHighlightText(editData.highlights[index]);
  };

  const handleSaveEditHighlight = () => {
    if (editingHighlightText.trim()) {
      setEditData((prev) => ({
        ...prev,
        highlights: prev.highlights.map((h: string, i: number) =>
          i === editingHighlightIndex ? editingHighlightText.trim() : h
        ),
      }));
    }
    setEditingHighlightIndex(null);
    setEditingHighlightText("");
  };

  const handleCancelEditHighlight = () => {
    setEditingHighlightIndex(null);
    setEditingHighlightText("");
  };

  const handleDeleteHighlight = (index: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este elemento?")) {
      setEditData((prev) => ({
        ...prev,
        highlights: prev.highlights.filter(
          (_: string, i: number) => i !== index
        ),
      }));
    }
  };

  if (isEditing) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Paquete
            </label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio (USD)
              </label>
              <input
                type="number"
                value={editData.price}
                onChange={(e) =>
                  setEditData({ ...editData, price: parseInt(e.target.value) })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración
              </label>
              <input
                type="text"
                value={editData.duration}
                onChange={(e) =>
                  setEditData({ ...editData, duration: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center space-x-2 mt-6">
                <input
                  type="checkbox"
                  checked={editData.featured}
                  onChange={(e) =>
                    setEditData({ ...editData, featured: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Destacado
                </span>
              </label>
            </div>
          </div>

          {/* Highlights Management */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Elementos Incluidos
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {editData.highlights.map((highlight: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  {editingHighlightIndex === index ? (
                    <>
                      <input
                        type="text"
                        value={editingHighlightText}
                        onChange={(e) =>
                          setEditingHighlightText(e.target.value)
                        }
                        className="flex-1 text-sm p-1 border border-gray-300 rounded"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEditHighlight();
                          if (e.key === "Escape") handleCancelEditHighlight();
                        }}
                        autoFocus
                      />
                      <button
                        onClick={handleSaveEditHighlight}
                        className="text-green-600 hover:text-green-800 p-1"
                        title="Guardar"
                      >
                        <Save className="h-3 w-3" />
                      </button>
                      <button
                        onClick={handleCancelEditHighlight}
                        className="text-gray-600 hover:text-gray-800 p-1"
                        title="Cancelar"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm text-gray-700">
                        {highlight}
                      </span>
                      <button
                        onClick={() => handleStartEditHighlight(index)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Editar"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteHighlight(index)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Eliminar"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </>
                  )}
                </div>
              ))}
              {editData.highlights.length === 0 && (
                <p className="text-gray-500 text-sm italic">
                  No hay elementos agregados
                </p>
              )}
            </div>

            {/* Add new highlight */}
            <div className="flex space-x-2 mt-3">
              <input
                type="text"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                placeholder="Nuevo elemento incluido..."
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleAddHighlight()}
              />
              <button
                onClick={() => {
                  console.log("Agregar button clicked!");
                  handleAddHighlight();
                }}
                disabled={!newHighlight.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg flex items-center space-x-1 text-sm transition-colors"
              >
                <Plus className="h-3 w-3" />
                <span>Agregar</span>
              </button>
            </div>
          </div>

          {/* Date Range Management */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="checkbox"
                checked={editData.dateRanges?.length > 0}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    dateRanges: e.target.checked ? [] : [],
                  }))
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Fechas Específicas Disponibles
              </label>
            </div>
            {editData.dateRanges.available && (
              <div className="grid md:grid-cols-2 gap-4 ml-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    value={editData.dateRanges.start}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        dateRange: {
                          ...prev.dateRanges,
                          start: e.target.value,
                        },
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Fin
                  </label>
                  <input
                    type="date"
                    value={editData.dateRanges.end}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        dateRange: { ...prev.dateRanges, end: e.target.value },
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>Guardar</span>
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
      {/* Header with title and status */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 space-y-2 sm:space-y-0">
        <h4 className="text-base sm:text-lg font-semibold text-gray-900 pr-2">
          {pkg.name}
        </h4>
        <div className="flex items-center justify-between sm:justify-end">
          <span
            className={`px-2 py-1 rounded text-xs sm:text-sm flex-shrink-0 ${
              pkg.featured
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {pkg.featured ? "Destacado" : "Regular"}
          </span>
        </div>
      </div>

      {/* Action buttons - responsive layout */}
      <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
        <button
          onClick={() => onEdit(pkg.id)}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded text-xs sm:text-sm transition-colors"
          title="Editar Información Básica"
        >
          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Editar</span>
        </button>
        <button
          onClick={() => onEditDetails(pkg.id)}
          className="flex items-center space-x-1 text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded text-xs sm:text-sm transition-colors"
          title="Editar Detalles Completos"
        >
          <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Detalles</span>
        </button>
        {onManageDateRanges && (
          <button
            onClick={() => onManageDateRanges(pkg.id, type)}
            className="flex items-center space-x-1 text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-2 py-1 rounded text-xs sm:text-sm transition-colors"
            title="Gestionar Fechas"
          >
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Fechas</span>
          </button>
        )}
        {onManageTripMembers && (
          <button
            onClick={() => onManageTripMembers(pkg.id, type)}
            className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded text-xs sm:text-sm transition-colors"
            title="Administrar Participantes"
          >
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Miembros</span>
          </button>
        )}
        <button
          onClick={() => onDelete(pkg.id, type)}
          className="flex items-center space-x-1 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2 py-1 rounded text-xs sm:text-sm transition-colors"
          title="Eliminar"
        >
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Eliminar</span>
        </button>
      </div>

      <p className="text-sm sm:text-base text-gray-600 mb-3 leading-relaxed">
        {pkg.description}
      </p>

      {/* Highlights Display */}
      {pkg.highlights && pkg.highlights.length > 0 && (
        <div className="mb-3 sm:mb-4">
          <h5 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Incluye:
          </h5>
          <div className="space-y-1">
            {pkg.highlights
              .slice(0, 3)
              .map((highlight: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start space-x-2 text-xs sm:text-sm text-gray-600"
                >
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>
                  <span className="leading-relaxed">{highlight}</span>
                </div>
              ))}
            {pkg.highlights.length > 3 && (
              <div className="text-xs text-gray-500 ml-3.5">
                +{pkg.highlights.length - 3} elementos más
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <span className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">
          ${pkg.price}
        </span>
        <span className="text-xs sm:text-sm text-gray-500">{pkg.duration}</span>
      </div>
      <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500">
        ID: {pkg.id}
      </div>
    </div>
  );
};

// Review Form Components
interface AddReviewFormProps {
  newReview: any;
  setNewReview: React.Dispatch<React.SetStateAction<any>>;
  handleAddReview: () => void;
  setShowAddReviewForm: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

export const AddReviewForm: React.FC<AddReviewFormProps> = ({
  newReview,
  setNewReview,
  handleAddReview,
  setShowAddReviewForm,
  loading,
}) => (
  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">
      Agregar Nueva Reseña
    </h3>
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Cliente
          </label>
          <input
            type="text"
            value={newReview.name}
            onChange={(e) =>
              setNewReview({ ...newReview, name: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Ej: María González"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ubicación
          </label>
          <input
            type="text"
            value={newReview.location}
            onChange={(e) =>
              setNewReview({ ...newReview, location: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Ej: Buenos Aires, Argentina"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación
          </label>
          <select
            value={newReview.rating}
            onChange={(e) =>
              setNewReview({ ...newReview, rating: parseInt(e.target.value) })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value={5}>⭐⭐⭐⭐⭐ (5 estrellas)</option>
            <option value={4}>⭐⭐⭐⭐ (4 estrellas)</option>
            <option value={3}>⭐⭐⭐ (3 estrellas)</option>
            <option value={2}>⭐⭐ (2 estrellas)</option>
            <option value={1}>⭐ (1 estrella)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Viaje
          </label>
          <select
            value={newReview.trip}
            onChange={(e) =>
              setNewReview({ ...newReview, trip: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="Surf Trip">Surf Trip</option>
            <option value="Snowboard Trip">Snowboard Trip</option>
            <option value="Adventure Package">Adventure Package</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Año
          </label>
          <input
            type="text"
            value={newReview.date}
            onChange={(e) =>
              setNewReview({ ...newReview, date: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="2024"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comentario
        </label>
        <textarea
          value={newReview.text}
          onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          placeholder="Escribe el comentario del cliente..."
        />
      </div>

      <div className="flex space-x-3">
        <button
          onClick={handleAddReview}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          <span>Agregar Reseña</span>
        </button>
        <button
          onClick={() => {
            setShowAddReviewForm(false);
            setNewReview({
              name: "",
              location: "",
              rating: 5,
              text: "",
              trip: "Surf Trip",
              date: new Date().getFullYear().toString(),
            });
          }}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
        >
          <X className="h-4 w-4" />
          <span>Cancelar</span>
        </button>
      </div>
    </div>
  </div>
);

// Review Item Component
interface ReviewItemProps {
  review: any;
  isEditing: boolean;
  onEdit: (id: string) => void;
  onSave: (id: string, data: any) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  loading,
}) => {
  const [editData, setEditData] = React.useState({
    id: review.id,
    name: review.name,
    location: review.location,
    rating: review.rating,
    text: review.text,
    trip: review.trip,
    date: review.date,
  });

  const handleSave = () => {
    onSave(review.id, editData);
  };

  if (isEditing) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Cliente
              </label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación
              </label>
              <input
                type="text"
                value={editData.location}
                onChange={(e) =>
                  setEditData({ ...editData, location: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calificación
              </label>
              <select
                value={editData.rating}
                onChange={(e) =>
                  setEditData({ ...editData, rating: parseInt(e.target.value) })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 estrellas)</option>
                <option value={4}>⭐⭐⭐⭐ (4 estrellas)</option>
                <option value={3}>⭐⭐⭐ (3 estrellas)</option>
                <option value={2}>⭐⭐ (2 estrellas)</option>
                <option value={1}>⭐ (1 estrella)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Viaje
              </label>
              <select
                value={editData.trip}
                onChange={(e) =>
                  setEditData({ ...editData, trip: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Surf Trip">Surf Trip</option>
                <option value="Snowboard Trip">Snowboard Trip</option>
                <option value="Adventure Package">Adventure Package</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año
              </label>
              <input
                type="text"
                value={editData.date}
                onChange={(e) =>
                  setEditData({ ...editData, date: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentario
            </label>
            <textarea
              value={editData.text}
              onChange={(e) =>
                setEditData({ ...editData, text: e.target.value })
              }
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>Guardar</span>
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-lg font-semibold text-gray-900">{review.name}</h4>
          <p className="text-sm text-gray-500">
            {review.location} • {review.date}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`text-lg ${
                  i < review.rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ⭐
              </span>
            ))}
          </div>
          <button
            onClick={() => onEdit(review.id)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(review.id)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed">{review.text}</p>
      <div className="mt-3 text-sm text-gray-500">
        Viaje: {review.trip} • ID: {review.id}
      </div>
    </div>
  );
};

// Gallery Form Components
interface AddImageFormProps {
  newImage: any;
  setNewImage: React.Dispatch<React.SetStateAction<any>>;
  handleAddImage: () => void;
  setShowAddImageForm: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

export const AddImageForm: React.FC<AddImageFormProps> = ({
  newImage,
  setNewImage,
  handleAddImage,
  setShowAddImageForm,
  loading,
}) => (
  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">
      Agregar Nueva Imagen
    </h3>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL de la Imagen
        </label>
        <input
          type="url"
          value={newImage.src}
          onChange={(e) => setNewImage({ ...newImage, src: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="https://ejemplo.com/imagen.jpg"
        />
        <p className="text-sm text-gray-500 mt-1">
          Puedes usar URLs de Unsplash, tu servidor, o cualquier imagen pública
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción de la Imagen
          </label>
          <input
            type="text"
            value={newImage.alt}
            onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Ej: Surfista en ola perfecta en Necochea"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            value={newImage.category}
            onChange={(e) =>
              setNewImage({ ...newImage, category: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="Surf">Surf</option>
            <option value="Snowboard">Snowboard</option>
          </select>
        </div>
      </div>

      {/* Image Preview */}
      {newImage.src && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vista Previa
          </label>
          <div className="border border-gray-300 rounded-lg p-2">
            <img
              src={newImage.src}
              alt={newImage.alt || "Vista previa"}
              className="w-full h-48 object-cover rounded"
              onError={(e: any) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <div className="hidden text-center py-12 text-gray-500">
              <p>Error cargando la imagen</p>
              <p className="text-sm">Verifica que la URL sea correcta</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={handleAddImage}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          <span>Agregar Imagen</span>
        </button>
        <button
          onClick={() => {
            setShowAddImageForm(false);
            setNewImage({
              src: "",
              alt: "",
              category: "Surf",
            });
          }}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
        >
          <X className="h-4 w-4" />
          <span>Cancelar</span>
        </button>
      </div>
    </div>
  </div>
);

// Gallery Image Item Component
interface ImageItemProps {
  image: any;
  isEditing: boolean;
  onEdit: (id: string) => void;
  onSave: (id: string, data: any) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export const ImageItem: React.FC<ImageItemProps> = ({
  image,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  loading,
}) => {
  const [editData, setEditData] = React.useState({
    id: image.id,
    src: image.src,
    alt: image.alt,
    category: image.category,
  });

  const handleSave = () => {
    onSave(image.id, editData);
  };

  if (isEditing) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de la Imagen
            </label>
            <input
              type="url"
              value={editData.src}
              onChange={(e) =>
                setEditData({ ...editData, src: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <input
                type="text"
                value={editData.alt}
                onChange={(e) =>
                  setEditData({ ...editData, alt: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={editData.category}
                onChange={(e) =>
                  setEditData({ ...editData, category: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Surf">Surf</option>
                <option value="Snowboard">Snowboard</option>
              </select>
            </div>
          </div>

          {/* Image Preview */}
          {editData.src && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vista Previa
              </label>
              <img
                src={editData.src}
                alt={editData.alt}
                className="w-full h-32 object-cover rounded border"
              />
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>Guardar</span>
            </button>
            <button
              onClick={onCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={image.src}
          alt={image.alt}
          className="w-full h-32 object-cover"
        />
        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            onClick={() => onEdit(image.id)}
            className="bg-white/80 hover:bg-white text-blue-600 p-1 rounded"
            title="Editar"
          >
            <Edit className="h-3 w-3" />
          </button>
          <button
            onClick={() => onDelete(image.id)}
            className="bg-white/80 hover:bg-white text-red-600 p-1 rounded"
            title="Eliminar"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900 truncate">
          {image.alt}
        </p>
        <div className="flex justify-between items-center mt-2">
          <span
            className={`px-2 py-1 rounded text-xs ${
              image.category === "Surf"
                ? "bg-blue-100 text-blue-800"
                : "bg-cyan-100 text-cyan-800"
            }`}
          >
            {image.category}
          </span>
          <span className="text-xs text-gray-500">ID: {image.id}</span>
        </div>
      </div>
    </div>
  );
};

// Sponsors Management Components
interface SponsorsEditorProps {
  sponsorsData: any;
  onUpdate: (data: any) => void;
  loading: boolean;
}

export const SponsorsEditor: React.FC<SponsorsEditorProps> = ({
  sponsorsData,
  onUpdate,
  loading,
}) => {
  const [editData, setEditData] = React.useState({
    title: sponsorsData?.title || "Patrocinadores",
    message:
      sponsorsData?.message ||
      "Nuestros patrocinadores nos acompañan en cada aventura épica 🏄‍♂️🏂",
    sponsors: sponsorsData?.sponsors || [],
  });

  const [newSponsor, setNewSponsor] = React.useState({
    id: "",
    name: "",
    logo: "",
    alt: "",
    website: "",
    publicId: "",
  });

  const [showAddForm, setShowAddForm] = React.useState(false);
  const [uploadingLogo, setUploadingLogo] = React.useState(false);

  const handleAddSponsor = () => {
    if (!newSponsor.name.trim() || !newSponsor.logo.trim()) {
      alert("Por favor completa el nombre y logo del patrocinador");
      return;
    }

    const sponsorId = newSponsor.id || Date.now().toString();
    const sponsor = {
      ...newSponsor,
      id: sponsorId,
      name: newSponsor.name.trim(),
      logo: newSponsor.logo.trim(),
      alt: newSponsor.alt.trim() || `${newSponsor.name} - Patrocinador`,
      website: newSponsor.website.trim(),
    };

    const updatedSponsors = [...editData.sponsors, sponsor];
    setEditData({ ...editData, sponsors: updatedSponsors });
    setNewSponsor({
      id: "",
      name: "",
      logo: "",
      alt: "",
      website: "",
      publicId: "",
    });
    setShowAddForm(false);
  };

  const handleRemoveSponsor = (sponsorId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este patrocinador?")) {
      const updatedSponsors = editData.sponsors.filter(
        (s: any) => s.id !== sponsorId
      );
      setEditData({ ...editData, sponsors: updatedSponsors });
    }
  };

  const handleUpdateSponsor = (sponsorId: string, updatedSponsor: any) => {
    const updatedSponsors = editData.sponsors.map((s: any) =>
      s.id === sponsorId ? { ...s, ...updatedSponsor } : s
    );
    setEditData({ ...editData, sponsors: updatedSponsors });
  };

  const handleLogoUpload = async (file: File) => {
    setUploadingLogo(true);
    try {
      const uploadOptions = {
        folder: "sponsors",
        tags: ["sponsor", "logo", "admin-upload"],
        context: {
          alt: newSponsor.alt || `${newSponsor.name} - Logo`,
          sponsor: newSponsor.name || "Sponsor",
        },
      };

      const result = await CloudinaryService.uploadImage(file, uploadOptions);

      setNewSponsor({
        ...newSponsor,
        logo: result.secureUrl,
        alt: newSponsor.alt || `${newSponsor.name} - Logo`,
        publicId: result.publicId, // Store for potential deletion
      });
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      alert("Error subiendo el logo: " + error.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = () => {
    onUpdate(editData);
  };

  return (
    <div className="space-y-6">
      {/* Section Configuration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Configuración de la Sección
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título de la Sección
            </label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensaje de la Sección
            </label>
            <textarea
              value={editData.message}
              onChange={(e) =>
                setEditData({ ...editData, message: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Sponsors List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Patrocinadores ({editData.sponsors.length})
          </h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Agregar Patrocinador</span>
          </button>
        </div>

        {/* Add Sponsor Form */}
        {showAddForm && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">
              Nuevo Patrocinador
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={newSponsor.name}
                  onChange={(e) =>
                    setNewSponsor({ ...newSponsor, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nombre del patrocinador"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo del Patrocinador *
                </label>

                {/* Photo Upload Area */}
                {!newSponsor.logo ? (
                  <div className="space-y-3">
                    {/* File Upload */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleLogoUpload(file);
                          }
                        }}
                        className="hidden"
                        id="sponsor-logo-upload"
                        disabled={uploadingLogo}
                      />
                      <label
                        htmlFor="sponsor-logo-upload"
                        className={`cursor-pointer flex flex-col items-center space-y-2 ${
                          uploadingLogo ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {uploadingLogo ? (
                          <>
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            <span className="text-sm text-gray-600">
                              Subiendo logo...
                            </span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Haz clic para subir el logo
                            </span>
                            <span className="text-xs text-gray-500">
                              PNG, JPG, WEBP hasta 10MB
                            </span>
                          </>
                        )}
                      </label>
                    </div>

                    {/* URL Input Alternative */}
                    <div className="text-center text-sm text-gray-500">
                      <span>o ingresa una URL</span>
                    </div>
                    <input
                      type="url"
                      value={newSponsor.logo}
                      onChange={(e) =>
                        setNewSponsor({ ...newSponsor, logo: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="https://ejemplo.com/logo.png"
                      disabled={uploadingLogo}
                    />
                  </div>
                ) : (
                  /* Logo Preview */
                  <div className="space-y-3">
                    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-center mb-3">
                        <img
                          src={newSponsor.logo}
                          alt={newSponsor.alt || "Logo preview"}
                          className="h-16 w-auto max-w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiM5OTkiPkxvZ288L3RleHQ+PC9zdmc+";
                          }}
                        />
                      </div>
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setNewSponsor({ ...newSponsor, logo: "" })
                          }
                          className="text-red-600 hover:text-red-800 text-sm flex items-center space-x-1 mx-auto"
                        >
                          <X className="h-4 w-4" />
                          <span>Cambiar logo</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Texto Alternativo
                </label>
                <input
                  type="text"
                  value={newSponsor.alt}
                  onChange={(e) =>
                    setNewSponsor({ ...newSponsor, alt: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Descripción del logo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sitio Web (opcional)
                </label>
                <input
                  type="url"
                  value={newSponsor.website}
                  onChange={(e) =>
                    setNewSponsor({ ...newSponsor, website: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://sitio-web.com"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleAddSponsor}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Agregar</span>
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewSponsor({
                    id: "",
                    name: "",
                    logo: "",
                    alt: "",
                    website: "",
                    publicId: "",
                  });
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancelar</span>
              </button>
            </div>
          </div>
        )}

        {/* Sponsors Grid */}
        {editData.sponsors.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">🤝</div>
            <h3 className="text-lg font-medium mb-2">No hay patrocinadores</h3>
            <p>Agrega tu primer patrocinador para comenzar</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {editData.sponsors.map((sponsor: any) => (
              <SponsorItem
                key={sponsor.id}
                sponsor={sponsor}
                onUpdate={handleUpdateSponsor}
                onRemove={handleRemoveSponsor}
              />
            ))}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>Guardar Cambios</span>
        </button>
      </div>
    </div>
  );
};

// Individual Sponsor Item Component
interface SponsorItemProps {
  sponsor: any;
  onUpdate: (id: string, data: any) => void;
  onRemove: (id: string) => void;
}

export const SponsorItem: React.FC<SponsorItemProps> = ({
  sponsor,
  onUpdate,
  onRemove,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editData, setEditData] = React.useState({
    name: sponsor.name,
    logo: sponsor.logo,
    alt: sponsor.alt,
    website: sponsor.website || "",
    publicId: sponsor.publicId || "",
  });
  const [uploadingLogo, setUploadingLogo] = React.useState(false);

  const handleLogoUpload = async (file: File) => {
    setUploadingLogo(true);
    try {
      const uploadOptions = {
        folder: "sponsors",
        tags: ["sponsor", "logo", "admin-upload"],
        context: {
          alt: editData.alt || `${editData.name} - Logo`,
          sponsor: editData.name || "Sponsor",
        },
      };

      const result = await CloudinaryService.uploadImage(file, uploadOptions);

      setEditData({
        ...editData,
        logo: result.secureUrl,
        alt: editData.alt || `${editData.name} - Logo`,
        publicId: result.publicId, // Store for potential deletion
      });
    } catch (error: any) {
      console.error("Error uploading logo:", error);
      alert("Error subiendo el logo: " + error.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = () => {
    onUpdate(sponsor.id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      name: sponsor.name,
      logo: sponsor.logo,
      alt: sponsor.alt,
      website: sponsor.website || "",
      publicId: sponsor.publicId || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Logo del Patrocinador
            </label>

            {/* Photo Upload Area */}
            {!editData.logo ? (
              <div className="space-y-2">
                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded p-3 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleLogoUpload(file);
                      }
                    }}
                    className="hidden"
                    id={`sponsor-logo-edit-${sponsor.id}`}
                    disabled={uploadingLogo}
                  />
                  <label
                    htmlFor={`sponsor-logo-edit-${sponsor.id}`}
                    className={`cursor-pointer flex flex-col items-center space-y-1 ${
                      uploadingLogo ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {uploadingLogo ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="text-xs text-gray-600">
                          Subiendo...
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          Subir logo
                        </span>
                      </>
                    )}
                  </label>
                </div>

                {/* URL Input Alternative */}
                <div className="text-center text-xs text-gray-500">
                  <span>o ingresa una URL</span>
                </div>
                <input
                  type="url"
                  value={editData.logo}
                  onChange={(e) =>
                    setEditData({ ...editData, logo: e.target.value })
                  }
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://ejemplo.com/logo.png"
                  disabled={uploadingLogo}
                />
              </div>
            ) : (
              /* Logo Preview */
              <div className="space-y-2">
                <div className="border border-gray-300 rounded p-2 bg-white">
                  <div className="flex items-center justify-center mb-2">
                    <img
                      src={editData.logo}
                      alt={editData.alt || "Logo preview"}
                      className="h-12 w-auto max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiM5OTkiPkxvZ288L3RleHQ+PC9zdmc+";
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setEditData({ ...editData, logo: "" })}
                      className="text-red-600 hover:text-red-800 text-xs flex items-center space-x-1 mx-auto"
                    >
                      <X className="h-3 w-3" />
                      <span>Cambiar</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Texto Alternativo
            </label>
            <input
              type="text"
              value={editData.alt}
              onChange={(e) =>
                setEditData({ ...editData, alt: e.target.value })
              }
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Sitio Web
            </label>
            <input
              type="url"
              value={editData.website}
              onChange={(e) =>
                setEditData({ ...editData, website: e.target.value })
              }
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
            >
              <Save className="h-3 w-3" />
              <span>Guardar</span>
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
            >
              <X className="h-3 w-3" />
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-center mb-3">
            <img
              src={sponsor.logo}
              alt={sponsor.alt}
              className="h-12 w-auto max-w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiM5OTkiPkxvZ288L3RleHQ+PC9zdmc+";
              }}
            />
          </div>
          <div className="text-center">
            <h4 className="font-medium text-gray-900 text-sm mb-1">
              {sponsor.name}
            </h4>
            {sponsor.website && (
              <a
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Visitar sitio web
              </a>
            )}
          </div>
          <div className="flex justify-center space-x-2 mt-3">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs flex items-center space-x-1"
            >
              <Edit className="h-3 w-3" />
              <span>Editar</span>
            </button>
            <button
              onClick={() => onRemove(sponsor.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs flex items-center space-x-1"
            >
              <Trash2 className="h-3 w-3" />
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Basic Package Editor Component
interface BasicPackageEditorProps {
  editData: any;
  setEditData: React.Dispatch<React.SetStateAction<any>>;
}

export const BasicPackageEditor: React.FC<BasicPackageEditorProps> = ({
  editData,
  setEditData,
}) => {
  const [newHighlight, setNewHighlight] = React.useState("");
  const [editingHighlightIndex, setEditingHighlightIndex] = React.useState<
    number | null
  >(null);
  const [editingHighlightText, setEditingHighlightText] = React.useState("");

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setEditData((prev: any) => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()],
      }));
      setNewHighlight("");
    }
  };

  const handleStartEditHighlight = (index: number) => {
    setEditingHighlightIndex(index);
    setEditingHighlightText(editData.highlights[index]);
  };

  const handleSaveEditHighlight = () => {
    if (editingHighlightText.trim()) {
      setEditData((prev: any) => ({
        ...prev,
        highlights: prev.highlights.map((h: any, i: number) =>
          i === editingHighlightIndex ? editingHighlightText.trim() : h
        ),
      }));
    }
    setEditingHighlightIndex(null);
    setEditingHighlightText("");
  };

  const handleCancelEditHighlight = () => {
    setEditingHighlightIndex(null);
    setEditingHighlightText("");
  };

  const handleDeleteHighlight = (index: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este elemento?")) {
      setEditData((prev: any) => ({
        ...prev,
        highlights: prev.highlights.filter((_: any, i: number) => i !== index),
      }));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del Paquete
        </label>
        <input
          type="text"
          value={editData.name}
          onChange={(e) => setEditData({ ...editData, name: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descripción
        </label>
        <textarea
          value={editData.description}
          onChange={(e) =>
            setEditData({ ...editData, description: e.target.value })
          }
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio
          </label>
          <input
            type="number"
            value={editData.price}
            onChange={(e) =>
              setEditData({ ...editData, price: parseInt(e.target.value) || 0 })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duración
          </label>
          <input
            type="text"
            value={editData.duration}
            onChange={(e) =>
              setEditData({ ...editData, duration: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          URL de Imagen
        </label>
        <input
          type="url"
          value={editData.image}
          onChange={(e) => setEditData({ ...editData, image: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="featured"
          checked={editData.featured}
          onChange={(e) =>
            setEditData({ ...editData, featured: e.target.checked })
          }
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
          Paquete Destacado
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Características Destacadas
        </label>
        <div className="space-y-2">
          {editData.highlights.map((highlight: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              {editingHighlightIndex === index ? (
                <>
                  <input
                    type="text"
                    value={editingHighlightText}
                    onChange={(e) => setEditingHighlightText(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSaveEditHighlight();
                      }
                    }}
                  />
                  <button
                    onClick={handleSaveEditHighlight}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleCancelEditHighlight}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-gray-700">{highlight}</span>
                  <button
                    onClick={() => handleStartEditHighlight(index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteHighlight(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              placeholder="Nueva característica..."
              className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddHighlight();
                }
              }}
            />
            <button
              onClick={handleAddHighlight}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Agregar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Basic Package Edit Modal Wrapper
interface BasicPackageEditModalProps {
  isOpen: boolean;
  pkg: any;
  type: string;
  onSave: (packageId: string, data: any, type: string) => void;
  onCancel: () => void;
  loading: boolean;
}

export const BasicPackageEditModal: React.FC<BasicPackageEditModalProps> = ({
  isOpen,
  pkg,
  type,
  onSave,
  onCancel,
  loading,
}) => {
  const [editData, setEditData] = React.useState({
    id: pkg?.id || "",
    name: pkg?.name || "",
    description: pkg?.description || "",
    price: pkg?.price || "",
    duration: pkg?.duration || "",
    featured: pkg?.featured || false,
    image: pkg?.image || "",
    highlights: pkg?.highlights || [],
    dateRanges: pkg?.dateRanges || [],
  });

  React.useEffect(() => {
    if (pkg) {
      setEditData({
        id: pkg.id,
        name: pkg.name,
        description: pkg.description,
        price: pkg.price,
        duration: pkg.duration,
        featured: pkg.featured,
        image: pkg.image,
        highlights: pkg.highlights || [],
        dateRanges: pkg.dateRanges || [],
      });
    }
  }, [pkg]);

  const handleSave = () => {
    onSave(pkg.id, editData, type);
  };

  if (!pkg) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={`Editar Paquete - ${pkg.name}`}
      size="lg"
    >
      <div className="p-6">
        <BasicPackageEditor editData={editData} setEditData={setEditData} />
      </div>
      <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
        <button
          onClick={onCancel}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
        >
          <X className="h-4 w-4" />
          <span>Cancelar</span>
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>Guardar Cambios</span>
        </button>
      </div>
    </Modal>
  );
};

// Package Details Editor Modal Wrapper
interface PackageDetailsModalProps {
  isOpen: boolean;
  pkg: any;
  type: string;
  packageDetailCategories: any[];
  onSave: (
    packageId: string,
    data: any,
    type: string,
    categories: any[]
  ) => void;
  onCancel: () => void;
  loading: boolean;
  onToggleCategory: (id: string) => void;
  onDeleteCategory: (id: string) => void;
  onAddCategory: (category: any) => void;
  onUpdateCategoryFields: (id: string, fields: string[]) => void;
}

export const PackageDetailsModal: React.FC<PackageDetailsModalProps> = ({
  isOpen,
  pkg,
  type,
  packageDetailCategories,
  onSave,
  onCancel,
  loading,
  onToggleCategory: _onToggleCategory,
  onDeleteCategory: _onDeleteCategory,
  onAddCategory: _onAddCategory,
  onUpdateCategoryFields: _onUpdateCategoryFields, // New prop for updating category fields
}) => {
  const [editData, setEditData] = React.useState<any>(null);
  const [localCategories, setLocalCategories] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (pkg && packageDetailCategories) {
      // Initialize local categories state
      setLocalCategories([...packageDetailCategories]);

      const initializeDetails = () => {
        const details: { [key: string]: any } = {};
        packageDetailCategories.forEach((category: any) => {
          details[category.id] = {};
          category.fields.forEach((field: string) => {
            details[category.id][field] =
              pkg.details?.[category.id]?.[field] || "";
          });
        });
        return details;
      };

      setEditData({
        ...pkg,
        details: initializeDetails(),
      });
    }
  }, [pkg, packageDetailCategories]);

  // Local handlers for category management (only update local state)
  const handleLocalToggleCategory = (categoryId: string) => {
    setLocalCategories((prev: any[]) =>
      prev.map((cat: any) =>
        cat.id === categoryId ? { ...cat, enabled: !cat.enabled } : cat
      )
    );
  };

  const handleLocalDeleteCategory = (categoryId: string) => {
    if (
      !confirm(
        "¿Estás seguro de que quieres eliminar esta categoría? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    setLocalCategories((prev: any[]) =>
      prev.filter((cat: any) => cat.id !== categoryId)
    );

    // Also remove the category data from editData
    setEditData((prev: any) => {
      const newDetails = { ...prev.details };
      delete newDetails[categoryId];
      return {
        ...prev,
        details: newDetails,
      };
    });
  };

  const handleLocalAddCategory = () => {
    const categoryName = prompt("Ingresa el nombre de la nueva categoría:");
    if (!categoryName || !categoryName.trim()) return;

    const categoryId = categoryName.toLowerCase().replace(/\s+/g, "");

    // Check if category already exists
    const existingCategory = localCategories.find(
      (cat) => cat.id === categoryId
    );
    if (existingCategory) {
      alert("Ya existe una categoría con ese nombre");
      return;
    }

    const newCategory = {
      id: categoryId,
      title: categoryName.trim(),
      iconName: "Home", // Default icon
      gradient: "from-blue-500 to-purple-500", // Default gradient
      textColor: "text-blue-300", // Default text color
      enabled: true,
      fields: ["descripcion"], // Default field
    };

    setLocalCategories((prev: any[]) => [...prev, newCategory]);

    // Initialize the category in editData
    setEditData((prev: any) => ({
      ...prev,
      details: {
        ...prev.details,
        [categoryId]: {
          descripcion: "",
        },
      },
    }));
  };

  const handleLocalUpdateCategoryFields = (
    categoryId: string,
    updatedFields: string[]
  ) => {
    setLocalCategories((prev: any[]) =>
      prev.map((cat: any) =>
        cat.id === categoryId ? { ...cat, fields: updatedFields } : cat
      )
    );

    // Update editData to match the new fields
    setEditData((prev: any) => {
      const newDetails = { ...prev.details };
      const categoryDetails = newDetails[categoryId] || {};

      // Keep existing values for fields that still exist, initialize new fields
      const updatedCategoryDetails: { [key: string]: any } = {};
      updatedFields.forEach((field: string) => {
        updatedCategoryDetails[field] = categoryDetails[field] || "";
      });

      newDetails[categoryId] = updatedCategoryDetails;

      return {
        ...prev,
        details: newDetails,
      };
    });
  };

  const handleSave = () => {
    if (editData) {
      // Save both package details and category changes
      onSave(pkg.id, editData, type, localCategories);
    }
  };

  if (!editData) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={`Editar Detalles - ${pkg?.name || "Paquete"}`}
      size="xl"
    >
      <div className="p-3 sm:p-4 md:p-6">
        <PackageDetailsEditor
          editData={editData}
          setEditData={setEditData}
          packageDetailCategories={localCategories}
          showCategoryManagement={true}
          onToggleCategory={handleLocalToggleCategory}
          onDeleteCategory={handleLocalDeleteCategory}
          onAddCategory={handleLocalAddCategory}
          onUpdateCategoryFields={handleLocalUpdateCategoryFields}
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-3 sm:p-4 md:p-6 border-t border-gray-200 bg-gray-50">
        <button
          onClick={onCancel}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center space-x-2 text-sm sm:text-base"
        >
          <X className="h-4 w-4" />
          <span>Cancelar</span>
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 text-sm sm:text-base"
        >
          <Save className="h-4 w-4" />
          <span>Guardar Detalles</span>
        </button>
      </div>
    </Modal>
  );
};

// Package Details Editor Component
interface PackageDetailsEditorProps {
  editData: any;
  setEditData: React.Dispatch<React.SetStateAction<any>>;
  packageDetailCategories: any[];
  showCategoryManagement?: boolean;
  onToggleCategory: (id: string) => void;
  onDeleteCategory: (id: string) => void;
  onAddCategory: (category: any) => void;
  onUpdateCategoryFields: (id: string, fields: string[]) => void;
}

export const PackageDetailsEditor: React.FC<PackageDetailsEditorProps> = ({
  editData,
  setEditData,
  packageDetailCategories,
  showCategoryManagement = false,
  onToggleCategory,
  onDeleteCategory,
  onAddCategory,
  onUpdateCategoryFields, // New prop for updating category fields
}) => {
  const [editingCategoryFields, setEditingCategoryFields] =
    React.useState(null);
  const [newFieldName, setNewFieldName] = React.useState("");

  const handleDetailChange = (
    categoryId: string,
    field: string,
    value: string
  ) => {
    setEditData((prev: any) => ({
      ...prev,
      details: {
        ...prev.details,
        [categoryId]: {
          ...prev.details[categoryId],
          [field]: value,
        },
      },
    }));
  };

  const handleAddField = (categoryId: string) => {
    if (newFieldName.trim() && onUpdateCategoryFields) {
      const category = packageDetailCategories.find(
        (cat: any) => cat.id === categoryId
      );
      if (category) {
        const updatedFields = [...category.fields, newFieldName.trim()];
        onUpdateCategoryFields(categoryId, updatedFields);
        setNewFieldName("");

        // Also update the editData to include the new field
        setEditData((prev: any) => ({
          ...prev,
          details: {
            ...prev.details,
            [categoryId]: {
              ...prev.details[categoryId],
              [newFieldName.trim()]: "",
            },
          },
        }));
      }
    }
  };

  const handleRemoveField = (categoryId: string, fieldToRemove: string) => {
    if (onUpdateCategoryFields) {
      const category = packageDetailCategories.find(
        (cat: any) => cat.id === categoryId
      );
      if (category) {
        const updatedFields = category.fields.filter(
          (field: string) => field !== fieldToRemove
        );
        onUpdateCategoryFields(categoryId, updatedFields);

        // Also remove the field from editData
        setEditData((prev: any) => {
          const newDetails = { ...prev.details };
          if (newDetails[categoryId]) {
            delete newDetails[categoryId][fieldToRemove];
          }
          return {
            ...prev,
            details: newDetails,
          };
        });
      }
    }
  };

  // Icon mapping for categories
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Home,
      Utensils,
      Shield,
      BookOpen,
      Activity,
      AlertTriangle,
    };

    // Handle both string names and actual icon components
    if (typeof iconName === "string") {
      return iconMap[iconName] || Home;
    }

    // If it's already a component, return it
    return iconName || Home;
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 md:p-6">
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          Editar Detalles del Paquete: {editData.name}
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          Configura los detalles completos que se mostrarán en la página del
          paquete
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6 md:space-y-8">
        {packageDetailCategories.map((category: any) => {
          const IconComponent = getIconComponent(
            category.iconName || category.icon
          );
          const isDisabled = category.enabled === false;
          return (
            <div
              key={category.id}
              className={`bg-white rounded-lg p-3 sm:p-4 md:p-6 border ${
                isDisabled ? "border-gray-300 opacity-60" : "border-gray-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${category.gradient} rounded-lg flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0`}
                  >
                    <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 flex flex-col sm:flex-row sm:items-center">
                    <span>{category.title}</span>
                    {isDisabled && (
                      <span className="mt-1 sm:mt-0 sm:ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                        Deshabilitada
                      </span>
                    )}
                  </h4>
                </div>

                {showCategoryManagement && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onToggleCategory(category.id)}
                      className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${
                        isDisabled
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      }`}
                      title={
                        isDisabled
                          ? "Habilitar categoría"
                          : "Deshabilitar categoría"
                      }
                    >
                      {isDisabled ? "Habilitar" : "Deshabilitar"}
                    </button>
                    <button
                      onClick={() => onDeleteCategory(category.id)}
                      className="px-2 sm:px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-xs sm:text-sm font-medium transition-colors"
                      title="Eliminar categoría"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {category.fields.map((field: string) => (
                  <div key={field} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 capitalize">
                        {field.replace(/([A-Z])/g, " $1").trim()}
                      </label>
                      {showCategoryManagement && (
                        <button
                          onClick={() => handleRemoveField(category.id, field)}
                          className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
                          title="Eliminar subcategoría"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={editData.details[category.id][field] || ""}
                      onChange={(e) =>
                        handleDetailChange(category.id, field, e.target.value)
                      }
                      placeholder={`Ingresa ${field.toLowerCase()}`}
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>
                ))}
              </div>

              {/* Add new subcategory section */}
              {showCategoryManagement && (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      type="text"
                      value={
                        editingCategoryFields === category.id
                          ? newFieldName
                          : ""
                      }
                      onChange={(e) => {
                        setNewFieldName(e.target.value);
                        setEditingCategoryFields(category.id);
                      }}
                      placeholder="Nombre de nueva subcategoría"
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddField(category.id);
                          setEditingCategoryFields(null);
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        handleAddField(category.id);
                        setEditingCategoryFields(null);
                      }}
                      disabled={
                        !newFieldName.trim() ||
                        editingCategoryFields !== category.id
                      }
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-2 sm:px-3 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors text-xs sm:text-sm"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Agregar</span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Agrega nuevas subcategorías para personalizar los campos de
                    esta sección
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {showCategoryManagement && (
          <div className="mt-6">
            <button
              onClick={onAddCategory}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Agregar Nueva Categoría</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Category Structure Manager Component
interface CategoryStructureManagerProps {
  categories: any[];
  type: string;
  onSave: (categories: any[]) => void;
  onCancel: () => void;
  loading: boolean;
}

export const CategoryStructureManager: React.FC<
  CategoryStructureManagerProps
> = ({ categories, type, onSave, onCancel, loading }) => {
  const [editData, setEditData] = React.useState({
    packageDetailCategories: [...categories],
  });

  const [editingCategory, setEditingCategory] = React.useState(null);
  const [showAddCategoryForm, setShowAddCategoryForm] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState({
    id: "",
    title: "",
    iconName: "Home",
    gradient: "from-blue-500 to-cyan-500",
    textColor: "text-slate-200",
    fields: [],
    enabled: true,
  });

  // Available icons for categories
  const availableIcons = [
    { name: "Home", component: Home },
    { name: "Utensils", component: Utensils },
    { name: "Shield", component: Shield },
    { name: "BookOpen", component: BookOpen },
    { name: "Activity", component: Activity },
    { name: "AlertTriangle", component: AlertTriangle },
  ];

  // Available gradients
  const availableGradients = [
    { name: "Azul", value: "from-blue-500 to-cyan-500" },
    { name: "Verde", value: "from-emerald-500 to-teal-500" },
    { name: "Púrpura", value: "from-purple-500 to-pink-500" },
    { name: "Naranja", value: "from-orange-500 to-red-500" },
    { name: "Índigo", value: "from-indigo-500 to-purple-500" },
    { name: "Rojo", value: "from-red-500 to-pink-500" },
  ];

  const handleAddCategory = () => {
    if (!newCategory.id || !newCategory.title) {
      alert("Por favor completa el ID y título de la categoría");
      return;
    }

    const categoryData = {
      ...newCategory,
      id: newCategory.id.toLowerCase().replace(/\s+/g, ""),
      fields: newCategory.fields.length > 0 ? newCategory.fields : ["campo1"],
    };

    setEditData((prev) => ({
      ...prev,
      packageDetailCategories: [...prev.packageDetailCategories, categoryData],
    }));

    setNewCategory({
      id: "",
      title: "",
      iconName: "Home",
      gradient: "from-blue-500 to-cyan-500",
      textColor: "text-slate-200",
      fields: [],
      enabled: true,
    });
    setShowAddCategoryForm(false);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
      return;
    }

    setEditData((prev: any) => ({
      ...prev,
      packageDetailCategories: prev.packageDetailCategories.filter(
        (cat: any) => cat.id !== categoryId
      ),
    }));
  };

  const handleToggleCategory = (categoryId: string) => {
    setEditData((prev: any) => ({
      ...prev,
      packageDetailCategories: prev.packageDetailCategories.map((cat: any) =>
        cat.id === categoryId ? { ...cat, enabled: !cat.enabled } : cat
      ),
    }));
  };

  const handleMoveCategory = (categoryId: string, direction: string) => {
    const categories = [...editData.packageDetailCategories];
    const index = categories.findIndex((cat: any) => cat.id === categoryId);

    if (direction === "up" && index > 0) {
      [categories[index], categories[index - 1]] = [
        categories[index - 1],
        categories[index],
      ];
    } else if (direction === "down" && index < categories.length - 1) {
      [categories[index], categories[index + 1]] = [
        categories[index + 1],
        categories[index],
      ];
    }

    setEditData((prev: any) => ({
      ...prev,
      packageDetailCategories: categories,
    }));
  };

  const handleEditCategory = (categoryId: string, updatedCategory: any) => {
    console.log(
      "CategoryStructureManager: Editing category:",
      categoryId,
      "with data:",
      updatedCategory
    );
    setEditData((prev: any) => {
      const updatedData = {
        ...prev,
        packageDetailCategories: prev.packageDetailCategories.map((cat: any) =>
          cat.id === categoryId ? updatedCategory : cat
        ),
      };
      console.log(
        "CategoryStructureManager: Updated structure data:",
        updatedData
      );
      return updatedData;
    });
    setEditingCategory(null);
  };

  const handleSave = () => {
    console.log(
      "CategoryStructureManager: Saving entire structure with data:",
      editData
    );
    onSave(editData.packageDetailCategories);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Gestionar Estructura de Categorías -{" "}
          {type === "surf" ? "Surf" : "Snowboard"}
        </h3>
        <p className="text-gray-600">
          Administra las secciones y subcategorías que aparecen en los paquetes
        </p>
      </div>

      {/* Add Category Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddCategoryForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Agregar Sección</span>
        </button>
      </div>

      {/* Add Category Form */}
      {showAddCategoryForm && (
        <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Nueva Sección
          </h4>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID de la Sección
              </label>
              <input
                type="text"
                value={newCategory.id}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, id: e.target.value })
                }
                placeholder="ej: accommodation"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                value={newCategory.title}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, title: e.target.value })
                }
                placeholder="ej: Alojamiento"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icono
              </label>
              <select
                value={newCategory.iconName}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, iconName: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {availableIcons.map((icon) => (
                  <option key={icon.name} value={icon.name}>
                    {icon.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gradiente
              </label>
              <select
                value={newCategory.gradient}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, gradient: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {availableGradients.map((gradient) => (
                  <option key={gradient.value} value={gradient.value}>
                    {gradient.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleAddCategory}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Crear Sección</span>
            </button>
            <button
              onClick={() => setShowAddCategoryForm(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-4 mb-8">
        {editData.packageDetailCategories.map((category, index) => (
          <CategoryItem
            key={category.id}
            category={category}
            index={index}
            totalCategories={editData.packageDetailCategories.length}
            isEditing={editingCategory === category.id}
            onEdit={() => setEditingCategory(category.id)}
            onSave={(updatedCategory: any) =>
              handleEditCategory(category.id, updatedCategory)
            }
            onCancel={() => setEditingCategory(null)}
            onDelete={() => handleDeleteCategory(category.id)}
            onToggle={() => handleToggleCategory(category.id)}
            onMove={(direction: string) =>
              handleMoveCategory(category.id, direction)
            }
            availableIcons={availableIcons}
            availableGradients={availableGradients}
          />
        ))}
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-yellow-800 mb-1">
              ¡Importante! Paso final requerido
            </h4>
            <p className="text-sm text-yellow-700">
              Después de editar las secciones individuales, debes hacer clic en
              <strong> "Guardar Estructura Completa" </strong>
              para aplicar todos los cambios a la base de datos.
            </p>
          </div>
        </div>
      </div>

      {/* Save/Cancel Buttons */}
      <div className="flex space-x-3 pt-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg flex items-center space-x-2 disabled:opacity-50 font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
        >
          <Save className="h-5 w-5" />
          <span>Guardar Estructura Completa</span>
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
        >
          <X className="h-4 w-4" />
          <span>Cancelar</span>
        </button>
      </div>
    </div>
  );
};

// Category Item Component for managing individual categories
interface CategoryItemProps {
  category: any;
  index: number;
  totalCategories: number;
  isEditing: boolean;
  onEdit: (id: string, data: any) => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onMove: (direction: string) => void;
  availableIcons: any[];
  availableGradients: any[];
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  index,
  totalCategories,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onToggle,
  onMove,
  availableIcons,
  availableGradients,
}) => {
  const [editData, setEditData] = React.useState({ ...category });
  const [newFieldName, setNewFieldName] = React.useState("");
  const [fieldAddedMessage, setFieldAddedMessage] = React.useState("");

  // Update editData when category changes
  React.useEffect(() => {
    setEditData({ ...category });
  }, [category]);

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Home,
      Utensils,
      Shield,
      BookOpen,
      Activity,
      AlertTriangle,
    };
    return iconMap[iconName] || Home;
  };

  const handleSave = () => {
    console.log("CategoryItem: Saving category with data:", editData);
    onSave(editData);
  };

  const handleAddField = () => {
    if (newFieldName.trim()) {
      const newField = newFieldName.trim();
      console.log("CategoryItem: Adding new field:", newField);
      setEditData((prev: any) => {
        const updatedData = {
          ...prev,
          fields: [...prev.fields, newField],
        };
        console.log(
          "CategoryItem: Updated editData after adding field:",
          updatedData
        );
        return updatedData;
      });
      setNewFieldName("");

      // Show success message
      setFieldAddedMessage(`Campo "${newField}" agregado`);
      setTimeout(() => setFieldAddedMessage(""), 3000);
    } else {
      console.warn("CategoryItem: Attempted to add empty field");
    }
  };

  const handleRemoveField = (fieldIndex: number) => {
    setEditData((prev: any) => ({
      ...prev,
      fields: prev.fields.filter(
        (_: any, index: number) => index !== fieldIndex
      ),
    }));
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg p-6 border border-blue-300 shadow-md">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icono
            </label>
            <select
              value={editData.iconName}
              onChange={(e) =>
                setEditData({ ...editData, iconName: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {availableIcons.map((icon) => (
                <option key={icon.name} value={icon.name}>
                  {icon.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gradiente
            </label>
            <select
              value={editData.gradient}
              onChange={(e) =>
                setEditData({ ...editData, gradient: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {availableGradients.map((gradient) => (
                <option key={gradient.value} value={gradient.value}>
                  {gradient.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Fields Management */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subcategorías (Campos)
          </label>
          <div className="space-y-2 mb-3">
            {editData.fields.map((field: string, fieldIndex: number) => (
              <div key={fieldIndex} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={field}
                  readOnly
                  className="flex-1 p-2 border border-gray-300 rounded bg-gray-50"
                />
                <button
                  onClick={() => handleRemoveField(fieldIndex)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Eliminar campo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              placeholder="Nombre del nuevo campo"
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddField();
                }
              }}
            />
            <button
              onClick={handleAddField}
              disabled={!newFieldName.trim()}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Agregar</span>
            </button>
          </div>
          {fieldAddedMessage && (
            <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">
              ✓ {fieldAddedMessage}
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-700">
            <strong>Importante:</strong> Después de guardar esta sección,
            recuerda hacer clic en "Guardar Estructura Completa" al final para
            aplicar todos los cambios.
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Guardar Sección</span>
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Cancelar</span>
          </button>
        </div>
      </div>
    );
  }

  const IconComponent = getIconComponent(category.iconName);

  return (
    <div
      className={`bg-white rounded-lg p-4 border border-gray-200 shadow-sm ${
        !category.enabled ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 bg-gradient-to-br ${category.gradient} rounded-lg flex items-center justify-center`}
          >
            <IconComponent className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">
              {category.title}
            </h4>
            <p className="text-sm text-gray-500">
              {category.fields.length} campos: {category.fields.join(", ")}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Enable/Disable Toggle */}
          <button
            onClick={() => onToggle(category.id)}
            className={`p-2 rounded-lg ${
              category.enabled
                ? "text-green-600 hover:bg-green-50"
                : "text-gray-400 hover:bg-gray-50"
            }`}
            title={
              category.enabled ? "Deshabilitar sección" : "Habilitar sección"
            }
          >
            {category.enabled ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </button>

          {/* Move Up */}
          <button
            onClick={() => onMove("up")}
            disabled={index === 0}
            className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Mover arriba"
          >
            <ChevronUp className="h-4 w-4" />
          </button>

          {/* Move Down */}
          <button
            onClick={() => onMove("down")}
            disabled={index === totalCategories - 1}
            className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Mover abajo"
          >
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(category.id, category)}
            className="p-2 text-blue-600 hover:text-blue-800"
            title="Editar sección"
          >
            <Edit className="h-4 w-4" />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(category.id)}
            className="p-2 text-red-600 hover:text-red-800"
            title="Eliminar sección"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
