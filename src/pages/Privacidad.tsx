import { Shield, Database, Eye, Lock, Mail, CheckCircle2 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Privacidad = () => {
  const sections = [
    {
      number: "1",
      title: "Información que recopilamos",
      icon: Database,
      content:
        "Recopilamos información como tu nombre, número de teléfono y mensajes enviados a través de WhatsApp para poder brindarte asistencia y soporte.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      number: "2",
      title: "Uso de la información",
      icon: Eye,
      content:
        "La información se utiliza únicamente para responder consultas, ofrecer soporte y mejorar nuestro servicio.",
      color: "from-cyan-500 to-teal-500",
    },
    {
      number: "3",
      title: "Compartición de información",
      icon: Shield,
      content: "No compartimos tus datos con terceros, salvo obligación legal.",
      color: "from-teal-500 to-emerald-500",
    },
    {
      number: "4",
      title: "Seguridad de los datos",
      icon: Lock,
      content:
        "Implementamos medidas técnicas y organizativas para proteger tu información frente a accesos no autorizados.",
      color: "from-emerald-500 to-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-300 to-gray-50 pt-20">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8 border border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Política de Privacidad
            </h1>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed">
            En <strong className="text-gray-900">Lombok</strong> nos
            comprometemos a proteger tu privacidad. Esta política explica cómo
            recopilamos, usamos y protegemos la información que compartís al
            comunicarte con nuestro bot de WhatsApp.
          </p>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`p-3 bg-gradient-to-br ${section.color} rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {section.number}
                        </span>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {section.title}
                        </h2>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed ml-16">
                    {section.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-md p-8 md:p-10 border border-blue-100">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg shadow-md flex-shrink-0">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                5. Contacto
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Para consultas o solicitudes de eliminación de datos, escribí a:
              </p>
              <a
                href="mailto:lombok.arg@gmail.com"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors group"
              >
                <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                <span className="underline decoration-2 underline-offset-2 hover:decoration-blue-700">
                  lombok.arg@gmail.com
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-600 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span>
            Tu información está protegida y se maneja con total confidencialidad
          </span>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacidad;
