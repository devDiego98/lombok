// Updated FAQ component using Firebase data
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useFAQData } from "../hooks/useFirebaseData";
import { ErrorMessage, SkeletonLoader } from "./LoadingSpinner";

const FAQFirebase = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const { data: faqCollection, loading, error } = useFAQData();

  // Filter and sort FAQ items (exclude config documents)
  const faqData = faqCollection
    .filter((item) => item.question && item.answer && !isNaN(parseInt(item.id)))
    .sort((a, b) => parseInt(a.id) - parseInt(b.id));

  // Animation variants for FAQ items
  const itemVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  const iconVariants = {
    closed: {
      rotate: 0,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      rotate: 180,
      transition: {
        duration: 0.2,
      },
    },
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // Loading state
  if (loading) {
    return (
      <section
        id="faq"
        className="section-padding bg-gradient-to-br from-blue-50 via-white to-cyan-50"
      >
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Preguntas Frecuentes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Encuentra respuestas a las preguntas más comunes sobre nuestras
              aventuras
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                <SkeletonLoader lines={2} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section
        id="faq"
        className="section-padding bg-gradient-to-br from-blue-50 via-white to-cyan-50"
      >
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Preguntas Frecuentes
            </h2>
          </div>
          <ErrorMessage
            message="Error cargando las preguntas frecuentes"
            onRetry={() => window.location.reload()}
          />
        </div>
      </section>
    );
  }

  // No FAQs state
  if (faqData.length === 0) {
    return (
      <section
        id="faq"
        className="section-padding bg-gradient-to-br from-blue-50 via-white to-cyan-50"
      >
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Preguntas Frecuentes
            </h2>
          </div>
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">❓</div>
            <h3 className="text-lg font-medium mb-2">
              No hay preguntas frecuentes disponibles
            </h3>
            <p>
              Las preguntas frecuentes se mostrarán aquí una vez que sean
              agregadas
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="faq"
      className="section-padding bg-gradient-to-br from-blue-50 via-white to-cyan-50"
    >
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            Preguntas Frecuentes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre nuestras
            aventuras de snowboard y surf. Si no encuentras lo que buscas, no
            dudes en contactarnos.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <motion.div
                key={faq.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                  openFAQ === index
                    ? "shadow-xl ring-2 ring-blue-500/20 border-blue-500/20"
                    : "hover:shadow-xl hover:ring-2 hover:ring-blue-500/10"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`w-full px-8 py-6 text-left flex justify-between items-center transition-all duration-200 cursor-pointer group
                    ${openFAQ === index ? "bg-blue-50/50" : "hover:bg-gray-50"}
                    focus:outline-none focus:bg-blue-50/30 focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-white
                    active:scale-[0.998] active:bg-blue-100/50
                  `}
                >
                  <h3
                    className={`text-lg font-semibold pr-4 transition-colors duration-200 ${
                      openFAQ === index
                        ? "text-blue-900"
                        : "text-gray-900 group-hover:text-gray-800"
                    }`}
                  >
                    {faq.question}
                  </h3>
                  <motion.div
                    variants={iconVariants}
                    animate={openFAQ === index ? "open" : "closed"}
                    className="flex-shrink-0"
                  >
                    <ChevronDown
                      className={`h-6 w-6 transition-colors duration-200 ${
                        openFAQ === index
                          ? "text-blue-600"
                          : "text-gray-400 group-hover:text-blue-500"
                      }`}
                    />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openFAQ === index && (
                    <motion.div
                      variants={itemVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="overflow-hidden bg-blue-50/30"
                    >
                      <div className="px-8 pb-6">
                        <div className="border-t border-blue-200/50 pt-6">
                          <p className="text-gray-700 leading-relaxed text-base">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                ¿No encontraste lo que buscabas?
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Nuestro equipo está aquí para ayudarte. Contáctanos directamente
                y te responderemos todas tus preguntas sobre nuestras aventuras.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="#contact"
                  className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-xl transition-colors duration-300 inline-flex items-center justify-center"
                  onClick={(e) => {
                    e.preventDefault();
                    const contactSection = document.getElementById("contact");
                    if (contactSection) {
                      const headerHeight = 80;
                      const elementPosition =
                        contactSection.getBoundingClientRect().top;
                      const offsetPosition =
                        elementPosition + window.scrollY - headerHeight;
                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth",
                      });
                    }
                  }}
                >
                  Enviar Mensaje
                </a>
                <a
                  href="https://wa.me/5492914146383?text=¡Hola!%20Tengo%20una%20pregunta%20sobre%20las%20aventuras%20de%20Lombok"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-xl transition-colors duration-300 inline-flex items-center justify-center"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQFirebase;
