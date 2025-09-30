import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  Check,
  X,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { TripMemberService } from "../services/firebaseService";
import { Modal } from "./AdminForms";

interface TripMemberManagerProps {
  packageData: any;
  type: string;
  onClose: () => void;
  loading: boolean;
  showMessage: (message: string, type: string) => void;
  onRefreshPackages: () => void;
}

const TripMemberManager: React.FC<TripMemberManagerProps> = ({
  packageData,
  type,
  onClose: _onClose, // Renamed to indicate it's intentionally unused
  loading: _parentLoading, // Renamed to indicate it's intentionally unused
  showMessage,
  onRefreshPackages,
}) => {
  const [members, setMembers] = useState<any[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  const [newMember, setNewMember] = useState({
    name: "",
    phone: "",
    email: "",
    totalAmount: packageData?.price || 0,
    amountPaid: 0,
    notes: "",
  });

  useEffect(() => {
    if (packageData?.dateRanges?.length > 0) {
      setSelectedDateRange(packageData.dateRanges[0]);
    }
  }, [packageData]);

  useEffect(() => {
    if (selectedDateRange) {
      loadMembers();
      loadStats();
    }
  }, [selectedDateRange]);

  const loadMembers = async () => {
    if (!selectedDateRange) return;

    setLoading(true);
    try {
      const memberList = await TripMemberService.getMembersByDateRange(
        packageData.id,
        selectedDateRange.id
      );
      setMembers(
        memberList.sort(
          (a, b) =>
            new Date(b.registrationDate).getTime() -
            new Date(a.registrationDate).getTime()
        )
      );
    } catch (error) {
      console.error("Error loading members:", error);
      showMessage(
        "Error cargando miembros: " +
          (error instanceof Error ? error.message : String(error)),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!selectedDateRange) return;

    try {
      const memberStats = await TripMemberService.getMemberStats(
        packageData.id,
        selectedDateRange.id
      );
      setStats(memberStats);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleAddMember = async () => {
    if (!newMember.name.trim() || !newMember.phone.trim()) {
      alert("Por favor completa el nombre y teléfono");
      return;
    }

    if (!selectedDateRange) {
      alert("Por favor selecciona un rango de fechas");
      return;
    }

    // Check capacity
    const currentCount = members.length;
    if (
      selectedDateRange.maxParticipants &&
      currentCount >= selectedDateRange.maxParticipants
    ) {
      alert(
        `Este viaje ya está lleno (${selectedDateRange.maxParticipants} participantes máximo)`
      );
      return;
    }

    setLoading(true);
    try {
      const memberData = {
        ...newMember,
        packageId: packageData.id,
        packageName: packageData.name,
        packageType: type as "surf" | "snowboard",
        dateRangeId: selectedDateRange.id,
        startDate: selectedDateRange.startDate,
        endDate: selectedDateRange.endDate,
        totalAmount: parseFloat(newMember.totalAmount) || 0,
        amountPaid: parseFloat(newMember.amountPaid.toString()) || 0,
      };

      await TripMemberService.addMember(memberData);

      // Reset form
      setNewMember({
        name: "",
        phone: "",
        email: "",
        totalAmount: packageData?.price || 0,
        amountPaid: 0,
        notes: "",
      });

      setShowAddForm(false);
      await loadMembers();
      await loadStats();

      // Refresh packages in parent component to update participant counts
      if (onRefreshPackages) {
        await onRefreshPackages();
      }

      showMessage("Miembro agregado exitosamente", "success");
    } catch (error) {
      console.error("Error adding member:", error);
      showMessage(
        "Error agregando miembro: " +
          (error instanceof Error ? error.message : String(error)),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMember = async (memberId: string, updates: any) => {
    setLoading(true);
    try {
      await TripMemberService.updateMember(memberId, {
        ...updates,
        totalAmount: parseFloat(updates.totalAmount) || 0,
        amountPaid: parseFloat(updates.amountPaid) || 0,
      });

      setEditingMember(null);
      await loadMembers();
      await loadStats();

      // Refresh packages in parent component to update participant counts
      if (onRefreshPackages) {
        await onRefreshPackages();
      }

      showMessage("Miembro actualizado exitosamente", "success");
    } catch (error) {
      console.error("Error updating member:", error);
      showMessage(
        "Error actualizando miembro: " +
          (error instanceof Error ? error.message : String(error)),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este miembro?")) {
      return;
    }

    setLoading(true);
    try {
      await TripMemberService.deleteMember(memberId);
      await loadMembers();
      await loadStats();

      // Refresh packages in parent component to update participant counts
      if (onRefreshPackages) {
        await onRefreshPackages();
      }

      showMessage("Miembro eliminado exitosamente", "success");
    } catch (error) {
      console.error("Error deleting member:", error);
      showMessage(
        "Error eliminando miembro: " +
          (error instanceof Error ? error.message : String(error)),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getAvailableSpots = () => {
    if (!selectedDateRange?.maxParticipants) return "Ilimitado";
    return selectedDateRange.maxParticipants - members.length;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 space-y-3 sm:space-y-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600 flex-shrink-0" />
            <span className="truncate">
              Administrar Participantes - {packageData?.name}
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Gestiona los miembros inscritos en este viaje
          </p>
        </div>
      </div>

      {/* Date Range Selection */}
      {packageData?.dateRanges?.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Seleccionar Fecha del Viaje
          </label>
          <select
            value={selectedDateRange?.id || ""}
            onChange={(e) => {
              const dateRange = packageData.dateRanges.find(
                (dr: any) =>
                  dr.id === parseInt((e.target as HTMLSelectElement).value)
              );
              setSelectedDateRange(dateRange);
            }}
            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            {packageData.dateRanges.map((dateRange: any) => (
              <option key={dateRange.id} value={dateRange.id}>
                {formatDate(dateRange.startDate)} -{" "}
                {formatDate(dateRange.endDate)}
                {dateRange.maxParticipants &&
                  ` (Máx: ${dateRange.maxParticipants})`}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedDateRange && (
        <>
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0" />
                  <div className="ml-2 sm:ml-3 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-blue-600">
                      Participantes
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-blue-900">
                      {stats.totalMembers}
                      {selectedDateRange.maxParticipants && (
                        <span className="text-xs sm:text-sm font-normal">
                          /{selectedDateRange.maxParticipants}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center">
                  <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
                  <div className="ml-2 sm:ml-3 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-green-600">
                      Ingresos Totales
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-green-900 truncate">
                      {formatCurrency(stats.totalRevenue)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center">
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600 flex-shrink-0" />
                  <div className="ml-2 sm:ml-3 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-yellow-600">
                      Pagado
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-yellow-900 truncate">
                      {formatCurrency(stats.totalPaid)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600 flex-shrink-0" />
                  <div className="ml-2 sm:ml-3 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-red-600">
                      Pendiente
                    </p>
                    <p className="text-lg sm:text-2xl font-bold text-red-900 truncate">
                      {formatCurrency(stats.pendingPayment)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Available Spots Alert */}
          <div className="mb-4">
            <div
              className={`p-3 rounded-lg border ${
                getAvailableSpots() === 0
                  ? "bg-red-50 border-red-200 text-red-800"
                  : Number(getAvailableSpots()) <= 2 &&
                    selectedDateRange.maxParticipants
                  ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                  : "bg-green-50 border-green-200 text-green-800"
              }`}
            >
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">
                  {getAvailableSpots() === 0
                    ? "Viaje completo - No hay lugares disponibles"
                    : `Lugares disponibles: ${getAvailableSpots()}`}
                </span>
              </div>
            </div>
          </div>

          {/* Add Member Button */}
          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              disabled={loading || getAvailableSpots() === 0}
              className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Agregar Participante</span>
            </button>
          </div>

          {/* Members List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Cargando participantes...</p>
              </div>
            ) : members.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No hay participantes registrados</p>
                <p className="text-sm">
                  Agrega el primer participante para este viaje
                </p>
              </div>
            ) : (
              members.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  isEditing={editingMember === member.id}
                  onEdit={() => setEditingMember(member.id)}
                  onSave={(updates: any) =>
                    handleUpdateMember(member.id, updates)
                  }
                  onCancel={() => setEditingMember(null)}
                  onDelete={() => handleDeleteMember(member.id)}
                  loading={loading}
                  formatCurrency={formatCurrency}
                />
              ))
            )}
          </div>
        </>
      )}

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        newMember={newMember}
        setNewMember={setNewMember}
        onSave={handleAddMember}
        loading={loading}
        packageData={packageData}
        selectedDateRange={selectedDateRange}
      />
    </div>
  );
};

// Member Card Component
interface MemberCardProps {
  member: any;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updates: any) => void;
  onCancel: () => void;
  onDelete: () => void;
  loading: boolean;
  formatCurrency: (amount: number) => string;
}

const MemberCard = ({
  member,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  loading,
  formatCurrency,
}: MemberCardProps) => {
  const [editData, setEditData] = useState({
    name: member.name,
    phone: member.phone,
    email: member.email || "",
    totalAmount: member.totalAmount,
    amountPaid: member.amountPaid,
    notes: member.notes || "",
  });

  const handleSave = () => {
    onSave(editData);
  };

  const getPaymentStatusColor = () => {
    if (member.paymentStatus === "paid") return "bg-green-100 text-green-800";
    return "bg-yellow-100 text-yellow-800";
  };

  const getPaymentStatusText = () => {
    if (member.paymentStatus === "paid") return "Pagado";
    return "Pendiente";
  };

  if (isEditing) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
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
              Teléfono
            </label>
            <input
              type="tel"
              value={editData.phone}
              onChange={(e) =>
                setEditData({ ...editData, phone: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (Opcional)
            </label>
            <input
              type="email"
              value={editData.email}
              onChange={(e) =>
                setEditData({ ...editData, email: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total a Pagar (USD)
            </label>
            <input
              type="number"
              value={editData.totalAmount}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  totalAmount: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monto Pagado (USD)
            </label>
            <input
              type="number"
              value={editData.amountPaid}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  amountPaid: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas
            </label>
            <textarea
              value={editData.notes}
              onChange={(e) =>
                setEditData({ ...editData, notes: e.target.value })
              }
              rows={2}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>
        <div className="flex space-x-3 mt-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
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
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <h4 className="text-lg font-semibold text-gray-900">
              {member.name}
            </h4>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor()}`}
            >
              {getPaymentStatusText()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <span>{member.phone}</span>
            </div>
            {member.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>{member.email}</span>
              </div>
            )}
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>Total: {formatCurrency(member.totalAmount)}</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              <span>Pagado: {formatCurrency(member.amountPaid)}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>
                Registrado:{" "}
                {new Date(member.registrationDate).toLocaleDateString("es-AR")}
              </span>
            </div>
            {member.notes && (
              <div className="md:col-span-2 flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{member.notes}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
            title="Editar participante"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
            title="Eliminar participante"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Add Member Modal Component
interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  newMember: any;
  setNewMember: (member: any) => void;
  onSave: () => void;
  loading: boolean;
  packageData: any;
  selectedDateRange: any;
}

const AddMemberModal = ({
  isOpen,
  onClose,
  newMember,
  setNewMember,
  onSave,
  loading,
  packageData,
  selectedDateRange,
}: AddMemberModalProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Agregar Nuevo Participante"
      size="lg"
    >
      <div className="p-3 sm:p-4 md:p-6">
        {selectedDateRange && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2 text-sm sm:text-base">
              Detalles del Viaje
            </h4>
            <div className="text-xs sm:text-sm text-blue-700 space-y-1">
              <p>
                <strong>Paquete:</strong> {packageData?.name}
              </p>
              <p>
                <strong>Fechas:</strong>{" "}
                {formatDate(selectedDateRange.startDate)} -{" "}
                {formatDate(selectedDateRange.endDate)}
              </p>
              {selectedDateRange.maxParticipants && (
                <p>
                  <strong>Capacidad:</strong>{" "}
                  {selectedDateRange.maxParticipants} participantes
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              value={newMember.name}
              onChange={(e) =>
                setNewMember({ ...newMember, name: e.target.value })
              }
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Nombre y apellido del participante"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Teléfono *
            </label>
            <input
              type="tel"
              value={newMember.phone}
              onChange={(e) =>
                setNewMember({ ...newMember, phone: e.target.value })
              }
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="+54 9 11 1234-5678"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Email (Opcional)
            </label>
            <input
              type="email"
              value={newMember.email}
              onChange={(e) =>
                setNewMember({ ...newMember, email: e.target.value })
              }
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="email@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Total a Pagar (USD)
            </label>
            <input
              type="number"
              value={newMember.totalAmount}
              onChange={(e) =>
                setNewMember({
                  ...newMember,
                  totalAmount: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Monto Pagado (USD)
            </label>
            <input
              type="number"
              value={newMember.amountPaid}
              onChange={(e) =>
                setNewMember({
                  ...newMember,
                  amountPaid: parseFloat(e.target.value) || 0,
                })
              }
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="0"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Notas (Opcional)
            </label>
            <textarea
              value={newMember.notes}
              onChange={(e) =>
                setNewMember({ ...newMember, notes: e.target.value })
              }
              rows={3}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              placeholder="Información adicional sobre el participante..."
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-3 sm:p-4 md:p-6 border-t border-gray-200 bg-gray-50">
        <button
          onClick={onClose}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center space-x-2 text-sm sm:text-base"
        >
          <X className="h-4 w-4" />
          <span>Cancelar</span>
        </button>
        <button
          onClick={onSave}
          disabled={
            loading || !newMember.name.trim() || !newMember.phone.trim()
          }
          className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 text-sm sm:text-base"
        >
          <Plus className="h-4 w-4" />
          <span>Agregar Participante</span>
        </button>
      </div>
    </Modal>
  );
};

// Trip Member Manager Modal Wrapper
interface TripMemberModalProps {
  isOpen: boolean;
  packageData: any;
  type: string;
  onClose: () => void;
  loading: boolean;
  showMessage: (message: string, type: string) => void;
  onRefreshPackages: () => void;
}

export const TripMemberModal = ({
  isOpen,
  packageData,
  type,
  onClose,
  loading,
  showMessage,
  onRefreshPackages,
}: TripMemberModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Administrar Participantes - ${packageData?.name || "Paquete"}`}
      size="full"
    >
      <TripMemberManager
        packageData={packageData}
        type={type}
        onClose={onClose}
        loading={loading}
        showMessage={showMessage}
        onRefreshPackages={onRefreshPackages}
      />
    </Modal>
  );
};

export default TripMemberManager;
