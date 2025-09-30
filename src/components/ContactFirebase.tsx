// Updated Contact component using Firebase data
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  Clock,
  Calendar,
} from "lucide-react";
import {
  useContactInfo,
  useFirebaseDocument,
  useSurfPackages,
  useSnowboardPackages,
} from "../hooks/useFirebaseData";
import { COLLECTIONS, PackageService } from "../services/firebaseService";
import LoadingSpinner, { ErrorMessage } from "./LoadingSpinner";
import {
  ADVENTURE_TYPES,
  getAdventureTypeName,
  getAdventureTypeEmoji,
} from "../constants/adventureTypes";

const ContactFirebase = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    package: "", // Adventure type (surf/snowboard)
    tripPackage: "", // Specific trip package ID
    dateRange: "", // Selected date range ID
    message: "",
  });

  // State for available date ranges
  const [availableDateRanges, setAvailableDateRanges] = useState<any[]>([]);
  const [loadingDateRanges, setLoadingDateRanges] = useState(false);

  // Fetch data from Firebase
  const {
    contactInfo,
    loading: contactLoading,
    error: contactError,
  } = useContactInfo();
  const {
    data: packageOptions,
    loading: packageLoading,
    error: packageError,
  } = useFirebaseDocument(COLLECTIONS.PACKAGE_OPTIONS, "main");

  // Fetch packages for trip selection
  const { packages: surfPackages, loading: surfLoading } = useSurfPackages();
  const { packages: snowboardPackages, loading: snowboardLoading } =
    useSnowboardPackages();

  console.log(packageOptions);
  const loading =
    contactLoading || packageLoading || surfLoading || snowboardLoading;
  const error = contactError || packageError;

  // Helper function to format form data into a neat message
  const formatFormMessage = (isWhatsApp = false) => {
    const adventureType = getAdventureTypeName(formData.package);
    const adventureEmoji = getAdventureTypeEmoji(formData.package);
    const selectedPackage = getSelectedPackage();
    const selectedDateRange = getSelectedDateRange();

    if (isWhatsApp) {
      // WhatsApp message format (more concise)
      let message = `¡Hola! Soy ${formData.name} y estoy interesado en sus aventuras.`;

      if (adventureType && formData.package) {
        message += `\n\n${adventureEmoji} *Tipo de Aventura:* ${adventureType}`;
      }

      if (selectedPackage) {
        message += `\n🎒 *Paquete:* ${selectedPackage.name}`;
      }

      if (selectedDateRange) {
        const startDate = new Date(
          selectedDateRange.startDate
        ).toLocaleDateString("es-ES");
        const endDate = new Date(selectedDateRange.endDate).toLocaleDateString(
          "es-ES"
        );
        message += `\n📅 *Fechas:* ${startDate} - ${endDate}`;
      }

      if (formData.phone) {
        message += `\n📱 *Teléfono:* ${formData.phone}`;
      }

      if (formData.email) {
        message += `\n📧 *Email:* ${formData.email}`;
      }

      if (formData.message) {
        message += `\n\n💬 *Mensaje:*\n${formData.message}`;
      }

      message += `\n\n¡Espero su respuesta! 🌊🏔️`;

      return message;
    } else {
      // Email format (more formal and detailed)
      let message = `Estimado equipo de Lombok,\n\n`;
      message += `Mi nombre es ${formData.name} y me pongo en contacto con ustedes para consultar sobre sus servicios de aventuras.\n\n`;

      message += `DATOS DE CONTACTO:\n`;
      message += `• Nombre: ${formData.name}\n`;
      message += `• Email: ${formData.email}\n`;
      if (formData.phone) {
        message += `• Teléfono: ${formData.phone}\n`;
      }

      if (adventureType && formData.package) {
        message += `\nTIPO DE AVENTURA DE INTERÉS:\n`;
        message += `• ${adventureType}\n`;
      }

      if (selectedPackage) {
        message += `\nPAQUETE SELECCIONADO:\n`;
        message += `• ${selectedPackage.name}\n`;
        message += `• Precio: $${selectedPackage.price}\n`;
        message += `• Duración: ${selectedPackage.duration}\n`;
      }

      if (selectedDateRange) {
        const startDate = new Date(
          selectedDateRange.startDate
        ).toLocaleDateString("es-ES");
        const endDate = new Date(selectedDateRange.endDate).toLocaleDateString(
          "es-ES"
        );
        message += `\nFECHAS PREFERIDAS:\n`;
        message += `• ${startDate} - ${endDate}\n`;
        if (selectedDateRange.maxParticipants) {
          message += `• Máximo participantes: ${selectedDateRange.maxParticipants}\n`;
        }
      }

      if (formData.message) {
        message += `\nCONSULTA/MENSAJE:\n`;
        message += `${formData.message}\n`;
      }

      message += `\nQuedo a la espera de su respuesta para coordinar los detalles.\n\n`;
      message += `Saludos cordiales,\n${formData.name}`;

      return message;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset dependent fields when adventure type changes
    if (name === "package") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        tripPackage: "",
        dateRange: "",
      }));
      setAvailableDateRanges([]);
    }

    // Load date ranges when trip package changes
    if (name === "tripPackage" && value) {
      loadDateRanges(value, formData.package);
    }
  };

  // Function to load available date ranges for a specific package
  const loadDateRanges = async (packageId: string, adventureType: string) => {
    if (!packageId || !adventureType) return;

    setLoadingDateRanges(true);
    try {
      const dateRanges = await PackageService.getAvailableDateRanges(
        packageId,
        adventureType as "surf" | "snowboard"
      );
      setAvailableDateRanges(dateRanges);
    } catch (error) {
      console.error("Error loading date ranges:", error);
      setAvailableDateRanges([]);
    } finally {
      setLoadingDateRanges(false);
    }
  };

  // Get available packages based on selected adventure type
  const getAvailablePackages = () => {
    if (formData.package === "surf") {
      return surfPackages || [];
    } else if (formData.package === "snowboard") {
      return snowboardPackages || [];
    }
    return [];
  };

  // Get selected package details
  const getSelectedPackage = () => {
    if (!formData.tripPackage) return null;
    const packages = getAvailablePackages();
    return packages.find((pkg: any) => pkg.id === formData.tripPackage);
  };

  // Get selected date range details
  const getSelectedDateRange = () => {
    if (!formData.dateRange) return null;
    return availableDateRanges.find((dr: any) => dr.id === formData.dateRange);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      alert(
        "Por favor completa todos los campos requeridos (Nombre, Email y Mensaje)."
      );
      return;
    }

    // Create formatted email message
    const emailMessage = formatFormMessage(false);
    const adventureTypeName = getAdventureTypeName(formData.package);
    const subject = `Consulta de ${formData.name} - ${
      adventureTypeName || "Aventura"
    }`;

    // Create mailto link
    const mailtoUrl = `mailto:${
      contactInfo?.email?.primary || ""
    }?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      emailMessage
    )}`;

    // Open email client
    window.location.href = mailtoUrl;

    // Show success message
    alert(
      "¡Gracias por tu mensaje! Se abrirá tu cliente de email con el mensaje pre-formateado."
    );

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      package: "",
      tripPackage: "",
      dateRange: "",
      message: "",
    });
  };

  const handleWhatsApp = () => {
    if (!contactInfo) return;

    // Validate required fields for WhatsApp
    if (!formData.name.trim()) {
      alert(
        "Por favor ingresa tu nombre antes de enviar el mensaje por WhatsApp."
      );
      return;
    }

    // Create formatted WhatsApp message
    const whatsappMessage = formatFormMessage(true);

    // Build WhatsApp URL properly
    let whatsappUrl;

    if (contactInfo.whatsapp.url?.includes("wa.me/")) {
      // Extract phone number from wa.me URL
      const phoneMatch = contactInfo.whatsapp.url.match(/wa\.me\/([^?]+)/);
      if (phoneMatch) {
        const phoneNumber = phoneMatch[1];
        whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
          whatsappMessage
        )}`;
      } else {
        // Fallback: use the URL as is but replace any existing text parameter
        const baseUrl = contactInfo.whatsapp.url?.split("?")[0];
        whatsappUrl = `${baseUrl}?text=${encodeURIComponent(whatsappMessage)}`;
      }
    } else {
      // For other WhatsApp URL formats
      const baseUrl = contactInfo.whatsapp.url?.split("?")[0];
      whatsappUrl = `${baseUrl}?text=${encodeURIComponent(whatsappMessage)}`;
    }

    // Debug logging (only in development)
    if (process.env.NODE_ENV === "development") {
      console.log("Formatted WhatsApp message:", whatsappMessage);
      console.log("Contact info WhatsApp URL:", contactInfo.whatsapp.url);
      console.log("Final WhatsApp URL:", whatsappUrl);
    }
    window.open(whatsappUrl, "_blank");
  };

  // Show loading state
  if (loading) {
    return (
      <section id="contact" className="section-padding bg-white">
        <div className="container-max">
          <LoadingSpinner
            size="lg"
            text="Cargando información de contacto..."
          />
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section id="contact" className="section-padding bg-white">
        <div className="container-max">
          <ErrorMessage
            message="Error cargando información de contacto"
            onRetry={() => window.location.reload()}
          />
        </div>
      </section>
    );
  }

  // Show content when data is loaded
  if (!contactInfo) {
    return (
      <section id="contact" className="section-padding bg-white">
        <div className="container-max">
          <ErrorMessage message="No se pudo cargar la información de contacto" />
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            {(packageOptions as any)?.content?.title ||
              "¿Listo para Tu Aventura?"}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {(packageOptions as any)?.content?.description ||
              "Ponte en contacto con nosotros para comenzar a planificar tu aventura perfecta de snowboard o surf. Estamos aquí para responder todas tus preguntas y ayudarte a elegir el paquete correcto."}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {(packageOptions as any)?.content?.formTitle ||
                "Envíanos un Mensaje"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="+54 9 11 1234-5678"
                  />
                </div>

                <div>
                  <label
                    htmlFor="package"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Tipo de Aventura
                  </label>
                  <select
                    id="package"
                    name="package"
                    value={formData.package}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Selecciona una opción</option>
                    {ADVENTURE_TYPES.map((option) => (
                      <option key={option.id} value={option.value}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Trip Package Selection */}
              {formData.package && getAvailablePackages().length > 0 && (
                <div>
                  <label
                    htmlFor="tripPackage"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Paquete Específico (opcional)
                  </label>
                  <select
                    id="tripPackage"
                    name="tripPackage"
                    value={formData.tripPackage}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Selecciona un paquete</option>
                    {getAvailablePackages().map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} - ${pkg.price} ({pkg.duration})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Date Range Selection */}
              {formData.tripPackage && (
                <div>
                  <label
                    htmlFor="dateRange"
                    className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Fechas Disponibles (opcional)
                  </label>
                  {loadingDateRanges ? (
                    <div className="flex items-center justify-center py-3 text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      Cargando fechas...
                    </div>
                  ) : availableDateRanges.length > 0 ? (
                    <select
                      id="dateRange"
                      name="dateRange"
                      value={formData.dateRange}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Selecciona fechas</option>
                      {availableDateRanges.map((dateRange) => {
                        const startDate = new Date(
                          dateRange.startDate
                        ).toLocaleDateString("es-ES");
                        const endDate = new Date(
                          dateRange.endDate
                        ).toLocaleDateString("es-ES");

                        let availabilityInfo = "";
                        if (dateRange.maxParticipants) {
                          const availableSpots =
                            dateRange.maxParticipants -
                            (dateRange.currentParticipants || 0);
                          if (availableSpots === 0) {
                            availabilityInfo = " (Completo)";
                          } else if (availableSpots <= 2) {
                            availabilityInfo = ` (${availableSpots} lugares disponibles)`;
                          } else {
                            availabilityInfo = ` (${availableSpots} lugares disponibles)`;
                          }
                        }

                        return (
                          <option
                            key={dateRange.id}
                            value={dateRange.id}
                            disabled={
                              dateRange.maxParticipants &&
                              dateRange.maxParticipants -
                                (dateRange.currentParticipants || 0) ===
                                0
                            }
                          >
                            {startDate} - {endDate}
                            {availabilityInfo}
                          </option>
                        );
                      })}
                    </select>
                  ) : (
                    <div className="text-gray-500 text-sm py-2">
                      No hay fechas disponibles para este paquete
                    </div>
                  )}
                </div>
              )}

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mensaje <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Cuéntanos sobre tu aventura ideal..."
                />
              </div>

              <div className="text-sm text-gray-500 mb-4">
                <span className="text-red-500">*</span> Campos requeridos
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <Send className="h-5 w-5 mr-2" />
                  {(packageOptions as any)?.content?.submitButton ||
                    "Enviar Mensaje"}
                </button>

                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  {(packageOptions as any)?.content?.whatsappButton ||
                    "WhatsApp"}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {(packageOptions as any)?.content?.infoTitle ||
                  "Ponte en Contacto"}
              </h3>

              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Teléfono
                    </h4>
                    <p className="text-gray-600">{contactInfo.phone.display}</p>
                    <p className="text-sm text-gray-500">Llamadas y WhatsApp</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                    <p className="text-gray-600">{contactInfo.email.primary}</p>
                    <p className="text-sm text-gray-500">
                      {contactInfo.servicePromises.emailResponse}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Ubicación
                    </h4>
                    <p className="text-gray-600">{`${
                      contactInfo.address.street
                    }, ${contactInfo.address.city}, ${
                      contactInfo.address.province
                    }${
                      contactInfo.address.country
                        ? `, ${contactInfo.address.country}`
                        : ""
                    }`}</p>
                    <p className="text-sm text-gray-500">
                      {contactInfo.servicePromises.officeVisits}
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Horarios
                    </h4>
                    <p className="text-gray-600">
                      {contactInfo.businessHours.weekdays.days}:{" "}
                      {contactInfo.businessHours.weekdays.hours}
                    </p>
                    <p className="text-gray-600">
                      {contactInfo.businessHours.weekends.days}:{" "}
                      {contactInfo.businessHours.weekends.hours}
                    </p>
                    <p className="text-sm text-gray-500">
                      {contactInfo.businessHours.timezone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100">
              <h4 className="font-bold text-red-900 mb-2">
                Contacto de Emergencia
              </h4>
              <p className="text-red-700 text-sm">
                {contactInfo.servicePromises.emergency}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFirebase;
