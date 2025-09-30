import React from "react";
import { motion } from "framer-motion";
import { Mountain, Waves, Users, Award, Shield, Heart } from "lucide-react";
import { useFirebaseDocument } from "../hooks/useFirebaseData";
import { COLLECTIONS } from "../services/firebaseService";
import LoadingSpinner from "./LoadingSpinner";

const About: React.FC = () => {
  // Fetch about data from Firebase
  const {
    data: aboutData,
    loading,
    error,
  } = useFirebaseDocument(COLLECTIONS.ABOUT_FEATURES, "main");

  // Extract data with fallbacks
  const aboutFeatures = (aboutData as { features?: any[] } | null)
    ?.features || [
    {
      id: 1,
      title: "Guías Expertos",
      description:
        "Instructores certificados con años de experiencia en montañas y océanos de todo el mundo.",
      icon: "Users",
      gradient: "from-blue-500 to-cyan-500",
      hoverColor: "blue-400",
    },
    {
      id: 2,
      title: "Equipo Premium",
      description:
        "Material de última generación para garantizar tu seguridad y máximo rendimiento.",
      icon: "Award",
      gradient: "from-emerald-500 to-teal-500",
      hoverColor: "emerald-400",
    },
    {
      id: 3,
      title: "Seguridad Total",
      description:
        "Protocolos de seguridad rigurosos y seguros integrales para tu tranquilidad.",
      icon: "Shield",
      gradient: "from-purple-500 to-pink-500",
      hoverColor: "purple-400",
    },
    {
      id: 4,
      title: "Experiencias Únicas",
      description:
        "Aventuras personalizadas que crean recuerdos inolvidables para toda la vida.",
      icon: "Heart",
      gradient: "from-red-500 to-orange-500",
      hoverColor: "red-400",
    },
  ];

  // Animation variants for travel-themed effects
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

  const itemVariants: any = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Icon mapping
  const iconMap: any = {
    Mountain,
    Waves,
    Users,
    Award,
    Shield,
    Heart,
  };

  // Show loading state
  if (loading) {
    return (
      <section id="about" className="section-padding bg-gray-50">
        <div className="container-max">
          <LoadingSpinner
            size="lg"
            text="Cargando información sobre nosotros..."
          />
        </div>
      </section>
    );
  }

  // Show error state with fallback content
  if (error) {
    console.warn("About data not available, using fallbacks:", error);
  }

  return (
    <section id="about" className="section-padding bg-gray-50">
      <div className="container-max">
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          {aboutFeatures.map((feature) => {
            const IconComponent = iconMap[feature.icon] || Users;

            return (
              <motion.div
                key={feature.id}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className={`w-16 h-16 bg-gradient-to-br ${
                    feature.gradient || "from-blue-500 to-cyan-500"
                  } rounded-2xl flex items-center justify-center mb-6`}
                  whileHover={{
                    rotate: [0, -10, 10, -10, 0],
                    scale: 1.1,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <IconComponent className="h-8 w-8 text-white" />
                </motion.div>
                <motion.h4
                  className="text-xl font-semibold text-gray-900 mb-4"
                  variants={itemVariants}
                >
                  {feature.title}
                </motion.h4>
                <motion.p
                  className="text-gray-600 leading-relaxed"
                  variants={itemVariants}
                >
                  {feature.description}
                </motion.p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
