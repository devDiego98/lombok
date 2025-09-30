import React from "react";
import { motion } from "framer-motion";
import { usePreloadedSponsorsData } from "../contexts/DataContext";
import LoadingSpinner from "./LoadingSpinner";

const Sponsors: React.FC = () => {
  // Get preloaded sponsors data from context
  const { data: sponsorsData, loading, error } = usePreloadedSponsorsData();

  // Use Firebase data or fallback
  const sponsors = sponsorsData?.sponsors || [];
  const sectionTitle = sponsorsData?.title || "Patrocinadores";
  const sectionMessage =
    sponsorsData?.message ||
    "Nuestros patrocinadores nos acompaña en cada aventura épica 🏄‍♂️🏂";
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const logoVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Show loading state
  if (loading) {
    return (
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <LoadingSpinner size="lg" text="Cargando patrocinadores..." />
        </div>
      </section>
    );
  }

  // Show error state or empty state
  if (error || !sponsors || sponsors.length === 0) {
    if (error) {
      console.warn("Sponsors data not available:", error);
    }

    return (
      <section className="section-padding bg-gray-50">
        <div className="container-max text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4">
            {sectionTitle}
          </h2>
          <p className="text-gray-600">
            Los patrocinadores aparecerán aquí una vez que estén disponibles.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-max">
        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* Section Title */}
          <motion.h2
            className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-8"
            variants={itemVariants}
          >
            {sectionTitle}
          </motion.h2>

          {/* Sponsors Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center"
            variants={containerVariants}
          >
            {sponsors.map((sponsor, index) => (
              <motion.div
                key={sponsor.id || index}
                className="bg-white rounded-xl shadow-md p-6 md:p-8 hover:shadow-lg transition-shadow duration-300 w-full max-w-xs"
                variants={logoVariants}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.img
                  src={sponsor.logo}
                  alt={sponsor.alt || `${sponsor.name} - Patrocinador`}
                  className="h-12 md:h-16 w-auto mx-auto"
                  whileHover={{
                    scale: 1.05,
                  }}
                  transition={{ duration: 0.2 }}
                />
                {sponsor.name && (
                  <motion.p
                    className="text-gray-700 text-sm mt-3 font-medium text-center"
                    variants={itemVariants}
                  >
                    {sponsor.name}
                  </motion.p>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Additional sponsor message */}
          <motion.p
            className="text-gray-500 text-sm mt-8 italic"
            variants={itemVariants}
          >
            {sectionMessage}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default Sponsors;
