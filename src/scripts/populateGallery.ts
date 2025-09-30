// Script to populate Firebase gallery with local images
import { FirebaseService, COLLECTIONS } from '../services/firebaseService';
import type { GalleryImage } from '../types';

// Gallery image interface for script data
interface GalleryImageData {
  id: number;
  src: string;
  alt: string;
  category: string;
}

// Gallery images data with correct paths
const galleryImages: GalleryImageData[] = [
  {
    id: 1,
    src: "/assets/gallery/DSC_0676.jpg",
    alt: "Aventura en la montaña - Paisaje nevado",
    category: "Snowboard"
  },
  {
    id: 2,
    src: "/assets/gallery/SUR.PROD-15.jpg",
    alt: "Sesión de surf - Ola perfecta",
    category: "Surf"
  },
  {
    id: 3,
    src: "/assets/gallery/SUR.PROD-20.jpg",
    alt: "Surfista en acción - Maniobra espectacular",
    category: "Surf"
  },
  {
    id: 4,
    src: "/assets/gallery/SUR.PROD-21.jpg",
    alt: "Momento épico de surf",
    category: "Surf"
  },
  {
    id: 5,
    src: "/assets/gallery/SUR.PROD-32.jpg",
    alt: "Surf en aguas cristalinas",
    category: "Surf"
  },
  {
    id: 6,
    src: "/assets/gallery/SUR.PROD-36.jpg",
    alt: "Aventura de surf - Atardecer",
    category: "Surf"
  },
  {
    id: 7,
    src: "/assets/gallery/SUR.PROD-45.jpg",
    alt: "Sesión de surf profesional",
    category: "Surf"
  },
  {
    id: 8,
    src: "/assets/gallery/SUR.PROD-47.jpg",
    alt: "Surf en olas grandes",
    category: "Surf"
  },
  {
    id: 9,
    src: "/assets/gallery/SUR.PROD-61.jpg",
    alt: "Momento de surf increíble",
    category: "Surf"
  },
  {
    id: 10,
    src: "/assets/gallery/SUR.PROD-142.jpg",
    alt: "Surf épico - Lombok",
    category: "Surf"
  }
];

// Function to populate gallery
export const populateGallery = async (): Promise<void> => {
  try {
    console.log('🖼️ Populating gallery with local images...');
    
    for (const image of galleryImages) {
      const galleryImageData: Partial<GalleryImage> = {
        src: image.src,
        alt: image.alt,
        category: image.category
      };
      
      await FirebaseService.setDocument(
        COLLECTIONS.GALLERY_IMAGES,
        image.id.toString(),
        galleryImageData
      );
      console.log(`✅ Added image ${image.id}: ${image.alt}`);
    }
    
    console.log('🎉 Gallery population completed successfully!');
    console.log(`📊 Total images added: ${galleryImages.length}`);
    
  } catch (error) {
    console.error('❌ Error populating gallery:', error);
    throw error;
  }
};

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  populateGallery()
    .then(() => {
      console.log('Gallery population script completed');
      process.exit(0);
    })
    .catch((error: Error) => {
      console.error('Gallery population script failed:', error);
      process.exit(1);
    });
}
