import React, { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle, Send, Clock } from "lucide-react";
// Fallback constants (this component is not currently used - ContactFirebase is used instead)
const CONTACT_INFO = {
  phone: { display: "+54 9 11 1234-5678", raw: "5491112345678" },
  email: { primary: "info@lombok.com" },
  address: {
    street: "Calle Ejemplo 123",
    city: "Buenos Aires",
    province: "Argentina",
  },
  businessHours: {
    weekdays: { days: "Lunes a Viernes", hours: "9:00 - 18:00" },
    weekends: { days: "Sábados", hours: "10:00 - 14:00" },
    timezone: "GMT-3",
  },
  whatsapp: {
    number: "5491112345678",
    defaultMessage:
      "Hola, me interesa obtener más información sobre sus servicios.",
    url: "https://wa.me/5491112345678",
  },
  servicePromises: {
    emergency: "Respuesta inmediata en emergencias",
    emailResponse: "Respuesta en 24 horas",
    whatsappResponse: "Respuesta inmediata",
    officeVisits: "Visitas con cita previa",
  },
};

const getWhatsAppUrl = (message: string) =>
  `https://wa.me/5491112345678?text=${encodeURIComponent(message)}`;

const packageOptions = [
  { id: "surf", value: "surf", name: "Surf", label: "Surf" },
  {
    id: "snowboard",
    value: "snowboard",
    name: "Snowboard",
    label: "Snowboard",
  },
];
import { ContactFormData } from "../types";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    package: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    alert("¡Gracias por tu mensaje! Te responderemos pronto.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      package: "",
      message: "",
    });
  };

  const handleWhatsApp = () => {
    const message = `${CONTACT_INFO.whatsapp.defaultMessage} ${
      formData.package
        ? `Estoy particularmente interesado en ${formData.package}.`
        : ""
    }`;
    const whatsappUrl = getWhatsAppUrl(message);
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            ¿Listo para Tu Aventura?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ponte en contacto con nosotros para comenzar a planificar tu
            aventura perfecta de snowboard o surf. Estamos aquí para responder
            todas tus preguntas y ayudarte a elegir el paquete correcto.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Formulario de Contacto */}
          <div>
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-8">
              Envíanos un Mensaje
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
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
                    Número de Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                    placeholder={CONTACT_INFO.phone.display}
                  />
                </div>

                <div>
                  <label
                    htmlFor="package"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Paquete de Interés
                  </label>
                  <select
                    id="package"
                    name="package"
                    value={formData.package}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Selecciona un paquete</option>
                    {packageOptions.map((option) => (
                      <option key={option.id} value={option.value}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Cuéntanos sobre tus objetivos de aventura, nivel de experiencia, fechas preferidas, o cualquier pregunta que tengas..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="btn-primary flex items-center justify-center"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Enviar Mensaje
                </button>

                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  WhatsApp
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-8">
              Ponte en Contacto
            </h3>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Teléfono</h4>
                  <p className="text-gray-600">{CONTACT_INFO.phone.display}</p>
                  <p className="text-sm text-gray-500">
                    {CONTACT_INFO.servicePromises.emergency}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                  <p className="text-gray-600">{CONTACT_INFO.email.primary}</p>
                  <p className="text-sm text-gray-500">
                    {CONTACT_INFO.servicePromises.emailResponse}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">WhatsApp</h4>
                  <p className="text-gray-600">
                    {CONTACT_INFO.whatsapp.number}
                  </p>
                  <p className="text-sm text-gray-500">
                    {CONTACT_INFO.servicePromises.whatsappResponse}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Oficina</h4>
                  <p className="text-gray-600">
                    {CONTACT_INFO.address.street}
                    <br />
                    {CONTACT_INFO.address.city}, {CONTACT_INFO.address.province}
                  </p>
                  <p className="text-sm text-gray-500">
                    {CONTACT_INFO.servicePromises.officeVisits}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Horarios de Atención
                  </h4>
                  <p className="text-gray-600">
                    {CONTACT_INFO.businessHours.weekdays.days}:{" "}
                    {CONTACT_INFO.businessHours.weekdays.hours}
                    <br />
                    {CONTACT_INFO.businessHours.weekends.days}:{" "}
                    {CONTACT_INFO.businessHours.weekends.hours}
                  </p>
                  <p className="text-sm text-gray-500">
                    {CONTACT_INFO.businessHours.timezone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
