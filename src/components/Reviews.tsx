import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useReviews } from "../hooks/useFirebaseData";
import LoadingSpinner from "./LoadingSpinner";

const Reviews: React.FC = () => {
  const [currentReview, setCurrentReview] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const reviewsLengthRef = useRef<number>(0);

  // Fetch reviews data from Firebase
  const { data: reviewsData, loading, error } = useReviews();

  // Filter and sort review items (exclude config documents)
  const reviews = reviewsData
    ? reviewsData
        .filter((item) => item.name && item.rating && !isNaN(parseInt(item.id)))
        .sort((a, b) => parseInt(a.id) - parseInt(b.id))
    : [];

  // Update ref when reviews change
  reviewsLengthRef.current = reviews.length;

  // Navigation functions
  const nextReview = React.useCallback(() => {
    if (reviewsLengthRef.current === 0) return;
    setCurrentReview((prev) => (prev + 1) % reviewsLengthRef.current);
  }, []);

  const prevReview = React.useCallback(() => {
    if (reviewsLengthRef.current === 0) return;
    setCurrentReview(
      (prev) => (prev - 1 + reviewsLengthRef.current) % reviewsLengthRef.current
    );
  }, []);

  const goToReview = React.useCallback((index: number): void => {
    setCurrentReview(index);
  }, []);

  // Main effect to manage the timer
  useEffect(() => {
    // Clear any existing interval
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    // Only start timer if we have reviews
    if (reviews && reviews.length > 0) {
      const newIntervalId = setInterval(() => {
        setCurrentReview((prev) => (prev + 1) % reviewsLengthRef.current);
      }, 10000); // 10 seconds
      setIntervalId(newIntervalId);
    }

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [reviews.length]);

  // Reset timer when user manually changes review
  useEffect(() => {
    if (intervalId && reviews.length > 0) {
      clearInterval(intervalId);
      const newIntervalId = setInterval(() => {
        setCurrentReview((prev) => (prev + 1) % reviewsLengthRef.current);
      }, 10000);
      setIntervalId(newIntervalId);
    }
  }, [currentReview]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  // Animation variants for travel-themed effects
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  const reviewVariants = {
    enter: {
      x: 300,
      opacity: 0,
      scale: 0.8,
      rotateY: 90,
    },
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      x: -300,
      opacity: 0,
      scale: 0.8,
      rotateY: -90,
      transition: {
        duration: 0.3,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  // Show loading state
  if (loading) {
    return (
      <section
        id="reviews"
        className="section-padding bg-gradient-to-br from-blue-50 to-indigo-100"
      >
        <div className="container-max">
          <LoadingSpinner size="lg" text="Cargando reseñas de clientes..." />
        </div>
      </section>
    );
  }

  // Show error state or empty state
  if (error || !reviews || reviews.length === 0) {
    if (error) {
      console.warn("Reviews data not available:", error);
    }

    return (
      <section
        id="reviews"
        className="section-padding bg-gradient-to-br from-blue-50 to-indigo-100"
      >
        <div className="container-max text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Reseñas de Clientes
          </h2>
          <p className="text-gray-600">
            Las reseñas aparecerán aquí una vez que estén disponibles.
          </p>
        </div>
      </section>
    );
  }

  const renderStars = (rating: number): React.ReactElement[] => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section
      id="reviews"
      className="section-padding bg-gradient-to-br from-gray-50 via-white to-primary-50/30 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-100 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-100 rounded-full blur-2xl"></div>
      </div>

      <div className="container-max relative">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={titleVariants}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-gray-900 via-primary-700 to-gray-900 bg-clip-text text-transparent mb-6"
            variants={titleVariants}
          >
            Lo Que Dicen Nuestros Aventureros
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            variants={titleVariants}
          >
            No solo tomes nuestra palabra. Esto es lo que nuestros huéspedes
            dicen sobre sus increíbles aventuras con Lombok.
          </motion.p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 overflow-hidden shadow-xl border border-white/20">
            {/* Card background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100/50 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute z-[-1] bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-100/50 to-transparent rounded-full blur-xl"></div>

            <motion.div
              initial={{ rotate: -10, scale: 0 }}
              whileInView={{ rotate: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5, ease: "backOut" }}
              className="relative z-10"
            >
              <Quote className="h-12 w-12 text-primary-400 mb-6 drop-shadow-sm" />
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentReview}
                variants={reviewVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="mb-8"
              >
                <motion.p
                  className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 relative z-10 font-medium italic"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  "{reviews[currentReview].text}"
                </motion.p>

                <div className="flex items-center justify-between relative z-10">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="font-bold text-gray-900 text-lg">
                      {reviews[currentReview].name}
                    </div>
                    <div className="text-gray-500 text-sm">
                      📍 {reviews[currentReview].location}
                    </div>
                    <div className="text-sm text-primary-600 font-semibold bg-primary-50 px-3 py-1 rounded-full mt-1 inline-block">
                      {reviews[currentReview].trip}
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    {renderStars(reviews[currentReview].rating)}
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevReview}
                className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl hover:bg-primary-50 transition-all duration-200 cursor-pointer group"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600 group-hover:text-primary-600 transition-colors duration-200" />
              </button>

              <div className="flex space-x-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToReview(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 cursor-pointer hover:scale-125 ${
                      index === currentReview
                        ? "bg-primary-600 shadow-lg"
                        : "bg-gray-300 hover:bg-primary-400"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextReview}
                className="p-3 rounded-full bg-white shadow-lg hover:shadow-xl hover:bg-primary-50 transition-all duration-200 cursor-pointer group"
              >
                <ChevronRight className="h-6 w-6 text-gray-600 group-hover:text-primary-600 transition-colors duration-200" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-16">
          <motion.div
            className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text mb-2 group-hover:scale-110 transition-transform duration-300">
              5/5
            </div>
            <div className="text-gray-600 font-medium">Valoración Media</div>
          </motion.div>
          <motion.div
            className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text  mb-2 group-hover:scale-110 transition-transform duration-300">
              100+
            </div>
            <div className="text-gray-600 font-medium">
              Clientes Satisfechos
            </div>
          </motion.div>
          <motion.div
            className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group col-span-2 md:col-span-1"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text  mb-2 group-hover:scale-110 transition-transform duration-300">
              98%
            </div>
            <div className="text-gray-600 font-medium">Lo Recomendarían</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
