import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { usePreloadedGalleryImages } from "../contexts/DataContext";
import LoadingSpinner from "./LoadingSpinner";

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [imagesPreloaded, setImagesPreloaded] = useState<boolean>(false);

  // Get preloaded gallery images from context
  const { data: galleryImages, loading, error } = usePreloadedGalleryImages();

  // Use Firebase data or fallback to empty array
  const images = galleryImages || [];

  // Define functions before useEffect that references them
  const openLightbox = (index: number): void => {
    setSelectedImage(images[index]);
    setCurrentIndex(index);
  };

  const closeLightbox = (): void => {
    setSelectedImage(null);
  };

  const nextImage = (): void => {
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
    setCurrentIndex(nextIndex);
  };

  const prevImage = (): void => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[prevIndex]);
    setCurrentIndex(prevIndex);
  };

  // Preload all images on page load
  useEffect(() => {
    // Only run if we have images
    if (!images || images.length === 0) return;

    let isMounted = true;
    let loadedImages = 0;

    const preloadImage = (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loadedImages++;
          resolve(src);
        };
        img.onerror = () => {
          reject(src);
        };
        img.src = src;
      });
    };

    const preloadAllImages = async () => {
      try {
        const imagePromises = images.map((image) => preloadImage(image.src));
        await Promise.allSettled(imagePromises);

        if (isMounted) {
          setImagesPreloaded(true);
        }
      } catch (error) {
        console.warn("Some images failed to preload:", error);
        if (isMounted) {
          setImagesPreloaded(true);
        }
      }
    };

    preloadAllImages();

    return () => {
      isMounted = false;
    };
  }, [images]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedImage) return;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          prevImage();
          break;
        case "ArrowRight":
          event.preventDefault();
          nextImage();
          break;
        case "Escape":
          event.preventDefault();
          closeLightbox();
          break;
        default:
          break;
      }
    };

    if (selectedImage) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when lightbox is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  // Animation variants for surf/snow themed effects
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const imageVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 4,
      },
    },
  };

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: -30,
    },
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
      <section id="gallery" className="section-padding bg-white">
        <div className="container-max">
          <LoadingSpinner size="lg" text="Cargando galería de imágenes..." />
        </div>
      </section>
    );
  }

  // Show error state or empty state
  if (error || !images || images.length === 0) {
    if (error) {
      console.warn("Gallery images not available:", error);
    }

    return (
      <section id="gallery" className="section-padding bg-white">
        <div className="container-max text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Galería de Aventuras
          </h2>
          <p className="text-gray-600">
            Las imágenes aparecerán aquí una vez que estén disponibles.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="section-padding bg-white">
      <div className="container-max">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={titleVariants}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6"
            variants={titleVariants}
          >
            Galería de Aventuras
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            variants={titleVariants}
          >
            Inspírate con los momentos increíbles que nuestros aventureros han
            vivido. Desde descensos en polvo hasta olas perfectas, cada viaje es
            una historia que vale la pena contar.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial="hidden"
          animate={imagesPreloaded ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {images.map((image, index) => (
            <motion.div
              key={index}
              className="group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl will-change-transform aspect-[4/3]"
              variants={imageVariants}
              whileTap={{ scale: 0.98 }}
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 will-change-transform"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="text-sm font-medium">{image.category}</div>
                  <div className="text-xs opacity-80">{image.alt}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Lightbox */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
              />

              {/* Close button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors cursor-pointer"
              >
                <X className="h-8 w-8" />
              </button>

              {/* Navigation buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors cursor-pointer"
              >
                <ChevronRight className="h-8 w-8" />
              </button>

              {/* Image info */}
              <div className="absolute bottom-4 left-4 text-white">
                <div className="text-lg font-medium">
                  {selectedImage.category}
                </div>
                <div className="text-sm opacity-80">{selectedImage.alt}</div>
                <div className="text-xs opacity-60 mt-1">
                  {currentIndex + 1} of {images.length}
                </div>
              </div>

              {/* Keyboard navigation hint */}
              <div className="absolute bottom-4 right-4 text-white text-xs opacity-60">
                <div>← → Navegar | ESC Cerrar</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
