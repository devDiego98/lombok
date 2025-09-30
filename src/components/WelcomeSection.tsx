import React from "react";
import { motion } from "framer-motion";

const WelcomeSection: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 50,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section className="section-padding bg-gradient-to-br from-blue-50 via-white to-cyan-10">
      <div className="container-max">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* Welcome Title */}
          <motion.h2
            className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-12"
            variants={itemVariants}
          >
            WELCOME TO LOMBOK
          </motion.h2>

          {/* Main Content */}
          <motion.div
            className="space-y-8 text-lg md:text-xl text-gray-700 leading-relaxed mb-16"
            variants={itemVariants}
          >
            <p>
              Después de casi 7 meses en Indonesia, adoptamos un estilo de vida
              que marcará un antes y un después. Dos años más tarde ya en mi
              país, nace Lombok Argentina con fuerzas incansables de querer y
              poder compartir con cada una de las personas que se acerca a
              nuestro proyecto, la posibilidad de adoptar como suyo, nuestro
              estilo de vida.
            </p>

            <p>
              Lombok te presenta la combinación perfecta entre viaje, deportes y
              desconexión. Si estás buscando respuesta de lo que estás viviendo,
              queres un cambio de aire, reencontrarte, conocer gente o
              simplemente viajar... estás en el lugar correcto.
            </p>

            <p className="font-medium text-primary-600">
              Te invitamos a ser parte de la experiencia Lombok en el Mar o en
              la Montaña.
            </p>
          </motion.div>

          {/* Founder Section */}
          <motion.div className="mb-16" variants={itemVariants}>
            <h3 className="text-2xl md:text-3xl font-display font-semibold text-gray-800 mb-4">
              Y VOS? QUE CAMINO TOMARÍAS?
            </h3>
            <p className="text-xl text-gray-600 italic">
              Soy Agustín Boldini. Bienvenidos a Lombok Argentina.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WelcomeSection;
