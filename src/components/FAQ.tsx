import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

// Fallback FAQ data (this component is not currently used - FAQFirebase is used instead)
const faqData = [
  {
    question: "¿Qué incluyen los paquetes?",
    answer:
      "Nuestros paquetes incluyen alojamiento, comidas, equipo y guías profesionales.",
  },
  {
    question: "¿Necesito experiencia previa?",
    answer:
      "No es necesario. Tenemos programas para todos los niveles, desde principiantes hasta expertos.",
  },
];

const FAQ: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

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

  const toggleFAQ = (index: number): void => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section id="faq" className="section-padding bg-gray-50">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
            Preguntas Frecuentes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ¿Tienes preguntas? ¡Tenemos respuestas! Aquí están las preguntas más
            comunes sobre nuestros paquetes de aventura y qué esperar.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqData.map(
              (faq: { question: string; answer: string }, index: number) => (
                <motion.div
                  key={index}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                    openFAQ === index
                      ? "shadow-xl ring-2 ring-blue-500/20 border-blue-500/20"
                      : "hover:shadow-xl hover:ring-2 hover:ring-blue-500/10"
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <motion.button
                    onClick={() => toggleFAQ(index)}
                    className={`w-full px-8 py-6 text-left flex items-center justify-between cursor-pointer group transition-all duration-200
                    ${openFAQ === index ? "bg-blue-50/50" : "hover:bg-gray-50"}
                    focus:outline-none focus:bg-blue-50/30 focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-white
                  `}
                    whileHover={{
                      backgroundColor:
                        openFAQ === index
                          ? "rgba(239, 246, 255, 0.7)"
                          : "rgba(249, 250, 251, 1)",
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.998 }}
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
                  </motion.button>

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
              )
            )}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            ¿Aún tienes preguntas? ¡Estamos aquí para ayudarte!
          </p>
          <a href="#contact" className="btn-primary">
            Contáctanos
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
