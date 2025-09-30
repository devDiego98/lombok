import React, { useState } from "react";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Users,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { Modal } from "./AdminForms";

interface DateRangeManagerProps {
  packageData: any;
  type: string;
  onAddDateRange: (
    packageId: string,
    type: string,
    dateRange: any
  ) => Promise<void>;
  onUpdateDateRange: (
    packageId: string,
    type: string,
    dateRangeId: string,
    updates: any
  ) => Promise<void>;
  onDeleteDateRange: (
    packageId: string,
    type: string,
    dateRangeId: string
  ) => Promise<void>;
  loading: boolean;
}

const DateRangeManager: React.FC<DateRangeManagerProps> = ({
  packageData,
  type,
  onAddDateRange,
  onUpdateDateRange,
  onDeleteDateRange,
  loading,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDateRange, setEditingDateRange] = useState(null);
  const [newDateRange, setNewDateRange] = useState({
    startDate: "",
    endDate: "",
    available: true,
    maxParticipants: "",
    notes: "",
  });

  const dateRanges = packageData?.dateRanges || [];

  const handleAddDateRange = async () => {
    if (!newDateRange.startDate || !newDateRange.endDate) {
      alert("Por favor completa las fechas de inicio y fin");
      return;
    }

    if (new Date(newDateRange.startDate) >= new Date(newDateRange.endDate)) {
      alert("La fecha de inicio debe ser anterior a la fecha de fin");
      return;
    }

    try {
      await onAddDateRange(packageData.id, type, {
        ...newDateRange,
        maxParticipants: newDateRange.maxParticipants
          ? parseInt(newDateRange.maxParticipants)
          : null,
      });

      setNewDateRange({
        startDate: "",
        endDate: "",
        available: true,
        maxParticipants: "",
        notes: "",
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding date range:", error);
      alert(
        "Error agregando rango de fechas: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  };

  const handleUpdateDateRange = async (
    dateRangeId: string,
    updatedData: any
  ) => {
    try {
      await onUpdateDateRange(packageData.id, type, dateRangeId, updatedData);
      setEditingDateRange(null);
    } catch (error) {
      console.error("Error updating date range:", error);
      alert(
        "Error actualizando rango de fechas: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  };

  const handleDeleteDateRange = async (dateRangeId: string) => {
    if (
      !confirm("¿Estás seguro de que quieres eliminar este rango de fechas?")
    ) {
      return;
    }

    try {
      await onDeleteDateRange(packageData.id, type, dateRangeId);
    } catch (error) {
      console.error("Error deleting date range:", error);
      alert(
        "Error eliminando rango de fechas: " +
          (error instanceof Error ? error.message : String(error))
      );
    }
  };

  // Utility functions (currently unused but may be needed for future features)
  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString("es-ES", {
  //     day: "2-digit",
  //     month: "2-digit",
  //     year: "numeric",
  //   });
  // };

  // const isDateRangePast = (endDate: string) => {
  //   return new Date(endDate) < new Date();
  // };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-3 sm:space-y-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-600 flex-shrink-0" />
          <span className="truncate">
            Rangos de Fechas - {packageData?.name}
          </span>
        </h3>
        <button
          onClick={() => setShowAddForm(true)}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Agregar Fechas</span>
        </button>
      </div>

      {/* Add Date Range Form */}
      {showAddForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4 mb-4">
          <h4 className="text-sm sm:text-base font-medium text-gray-900 mb-3">
            Nuevo Rango de Fechas
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Fecha de Inicio
              </label>
              <input
                type="date"
                value={newDateRange.startDate}
                onChange={(e) =>
                  setNewDateRange({
                    ...newDateRange,
                    startDate: e.target.value,
                  })
                }
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Fecha de Fin
              </label>
              <input
                type="date"
                value={newDateRange.endDate}
                onChange={(e) =>
                  setNewDateRange({ ...newDateRange, endDate: e.target.value })
                }
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Máximo de Participantes (opcional)
              </label>
              <input
                type="number"
                min="1"
                value={newDateRange.maxParticipants}
                onChange={(e) =>
                  setNewDateRange({
                    ...newDateRange,
                    maxParticipants: e.target.value,
                  })
                }
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Ej: 10"
              />
            </div>
            <div className="flex items-center justify-center sm:justify-start">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newDateRange.available}
                  onChange={(e) =>
                    setNewDateRange({
                      ...newDateRange,
                      available: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  Disponible
                </span>
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Notas (opcional)
            </label>
            <textarea
              value={newDateRange.notes}
              onChange={(e) =>
                setNewDateRange({ ...newDateRange, notes: e.target.value })
              }
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              rows={2}
              placeholder="Información adicional sobre este rango de fechas..."
            />
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleAddDateRange}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 text-sm"
            >
              <Check className="h-4 w-4" />
              <span>Guardar</span>
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewDateRange({
                  startDate: "",
                  endDate: "",
                  available: true,
                  maxParticipants: "",
                  notes: "",
                });
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 text-sm"
            >
              <X className="h-4 w-4" />
              <span>Cancelar</span>
            </button>
          </div>
        </div>
      )}

      {/* Date Ranges List */}
      <div className="space-y-3">
        {dateRanges.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No hay rangos de fechas configurados</p>
            <p className="text-sm">
              Agrega fechas para que los clientes puedan seleccionar cuándo
              viajar
            </p>
          </div>
        ) : (
          dateRanges.map((dateRange: any) => (
            <DateRangeItem
              key={dateRange.id}
              dateRange={dateRange}
              isEditing={editingDateRange === dateRange.id}
              onEdit={() => setEditingDateRange(dateRange.id)}
              onSave={(updatedData: any) =>
                handleUpdateDateRange(dateRange.id, updatedData)
              }
              onCancel={() => setEditingDateRange(null)}
              onDelete={() => handleDeleteDateRange(dateRange.id)}
              loading={loading}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Individual Date Range Item Component
interface DateRangeItemProps {
  dateRange: any;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: () => void;
  loading: boolean;
}

const DateRangeItem: React.FC<DateRangeItemProps> = ({
  dateRange,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  loading,
}) => {
  const [editData, setEditData] = useState(dateRange);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const isDateRangePast = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const handleSave = () => {
    if (!editData.startDate || !editData.endDate) {
      alert("Por favor completa las fechas de inicio y fin");
      return;
    }

    if (new Date(editData.startDate) >= new Date(editData.endDate)) {
      alert("La fecha de inicio debe ser anterior a la fecha de fin");
      return;
    }

    onSave({
      ...editData,
      maxParticipants: editData.maxParticipants
        ? parseInt(editData.maxParticipants)
        : null,
    });
  };

  if (isEditing) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Inicio
            </label>
            <input
              type="date"
              value={editData.startDate}
              onChange={(e) =>
                setEditData({ ...editData, startDate: e.target.value })
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
              value={editData.endDate}
              onChange={(e) =>
                setEditData({ ...editData, endDate: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Máximo de Participantes
            </label>
            <input
              type="number"
              min="1"
              value={editData.maxParticipants || ""}
              onChange={(e) =>
                setEditData({ ...editData, maxParticipants: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={editData.available}
                onChange={(e) =>
                  setEditData({ ...editData, available: e.target.checked })
                }
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Disponible
              </span>
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas
          </label>
          <textarea
            value={editData.notes || ""}
            onChange={(e) =>
              setEditData({ ...editData, notes: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={2}
          />
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1 disabled:opacity-50"
          >
            <Check className="h-3 w-3" />
            <span>Guardar</span>
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
          >
            <X className="h-3 w-3" />
            <span>Cancelar</span>
          </button>
        </div>
      </div>
    );
  }

  const isPast = isDateRangePast(dateRange.endDate);

  return (
    <div
      className={`border rounded-lg p-4 ${
        isPast
          ? "bg-gray-50 border-gray-200"
          : dateRange.available
          ? "bg-green-50 border-green-200"
          : "bg-red-50 border-red-200"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-2">
            <span className="font-medium text-gray-900">
              {formatDate(dateRange.startDate)} -{" "}
              {formatDate(dateRange.endDate)}
            </span>
            <div className="flex items-center space-x-2">
              {isPast ? (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                  Finalizado
                </span>
              ) : (
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    dateRange.available
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {dateRange.available ? "Disponible" : "No Disponible"}
                </span>
              )}
            </div>
          </div>

          {dateRange.maxParticipants && (
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Users className="h-4 w-4 mr-1" />
              <span>Máximo: {dateRange.maxParticipants} participantes</span>
              {dateRange.currentParticipants > 0 && (
                <span className="ml-2">
                  ({dateRange.currentParticipants} inscritos)
                </span>
              )}
            </div>
          )}

          {dateRange.notes && (
            <div className="flex items-start text-sm text-gray-600">
              <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
              <span>{dateRange.notes}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={onEdit}
            disabled={loading}
            className="text-blue-600 hover:text-blue-800 p-1 disabled:opacity-50"
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            disabled={loading}
            className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50"
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Date Range Manager Modal Wrapper
interface DateRangeModalProps {
  isOpen: boolean;
  packageData: any;
  type: string;
  onAddDateRange: (
    packageId: string,
    type: string,
    dateRange: any
  ) => Promise<void>;
  onUpdateDateRange: (
    packageId: string,
    type: string,
    dateRangeId: string,
    updates: any
  ) => Promise<void>;
  onDeleteDateRange: (
    packageId: string,
    type: string,
    dateRangeId: string
  ) => Promise<void>;
  onClose: () => void;
  loading: boolean;
}

export const DateRangeModal: React.FC<DateRangeModalProps> = ({
  isOpen,
  packageData,
  type,
  onAddDateRange,
  onUpdateDateRange,
  onDeleteDateRange,
  onClose,
  loading,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Gestión de Fechas - ${packageData?.name || "Paquete"}`}
      size="lg"
    >
      <div className="p-3 sm:p-4 md:p-6">
        <DateRangeManager
          packageData={packageData}
          type={type}
          onAddDateRange={onAddDateRange}
          onUpdateDateRange={onUpdateDateRange}
          onDeleteDateRange={onDeleteDateRange}
          loading={loading}
        />
      </div>
    </Modal>
  );
};

export default DateRangeManager;
