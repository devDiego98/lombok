// Improved admin panel for content management
import { useState, useEffect } from "react";
import {
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  RefreshCw,
  AlertCircle,
  Check,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  FirebaseService,
  COLLECTIONS,
  PackageService,
  VideoService,
  VideoData,
} from "../services/firebaseService";
import { CloudinaryService } from "../services/cloudinaryService";
import { DEFAULT_CATEGORY_STYLE } from "../constants/categoryStyles";
import { DateRangeModal } from "./DateRangeManager";
import { TripMemberModal } from "./TripMemberManager";
import {
  AddPackageForm,
  PackageItem,
  PackageDetailsModal,
  BasicPackageEditModal,
  AddReviewForm,
  ReviewItem,
  ImageItem,
  SponsorsEditor,
} from "./AdminForms";
import { CloudinaryUploadForm } from "./CloudinaryUpload";
import { VideoUploadForm } from "./VideoUpload";

const AdminPanel = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("faq");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  interface FAQItem {
    id: number;
    question: string;
    answer: string;
  }
  // FAQ specific states
  const [faqs, setFaqs] = useState<any[]>([]);
  const [editingFaq, setEditingFaq] = useState<string | null>(null);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [showAddForm, setShowAddForm] = useState(false);

  // Contact editing states
  const [editingContact, setEditingContact] = useState(false);
  const [contactEditData, setContactEditData] = useState<any>(null);

  // Package editing states
  const [showAddPackageForm, setShowAddPackageForm] = useState(false);

  // Modal states for package editing, details and date ranges
  const [basicPackageEditModal, setBasicPackageEditModal] = useState<{
    isOpen: boolean;
    packageId: string | null;
    type: string | null;
  }>({
    isOpen: false,
    packageId: null,
    type: null,
  });
  const [packageDetailsModal, setPackageDetailsModal] = useState<{
    isOpen: boolean;
    packageId: string | null;
    type: string | null;
  }>({
    isOpen: false,
    packageId: null,
    type: null,
  });
  const [dateRangeModal, setDateRangeModal] = useState<{
    isOpen: boolean;
    packageId: string | null;
    type: string | null;
  }>({
    isOpen: false,
    packageId: null,
    type: null,
  });
  const [tripMemberModal, setTripMemberModal] = useState<{
    isOpen: boolean;
    packageId: string | null;
    type: string | null;
  }>({
    isOpen: false,
    packageId: null,
    type: null,
  });
  const [newPackage, setNewPackage] = useState<{
    name: string;
    description: string;
    price: string | number;
    duration: string;
    featured: boolean;
    type: "surf" | "snowboard";
  }>({
    name: "",
    description: "",
    price: "",
    duration: "",
    featured: false,
    type: "surf",
  });

  // Review editing states
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    location: "",
    rating: 5,
    text: "",
    trip: "Surf Trip",
    date: new Date().getFullYear().toString(),
  });

  // Gallery editing states
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [showAddImageForm, setShowAddImageForm] = useState(false);
  const [_newImage, _setNewImage] = useState({
    src: "",
    alt: "",
    category: "Surf",
  });
  interface IHeroImages {
    main: {
      primary?: { src: string; alt: string } | null;
      fallback?: { src: string; alt: string } | null;
    };
    snowboard: {
      primary: { src: string; alt: string } | null;
      fallback: { src: string; alt: string } | null;
    };
    surf: {
      primary: { src: string; alt: string } | null;
      fallback: { src: string; alt: string } | null;
    };
  }
  // Hero images states
  const [heroImages, setHeroImages] = useState<IHeroImages>({
    main: { primary: null, fallback: null },
    snowboard: { primary: null, fallback: null },
    surf: { primary: null, fallback: null },
  });
  const [uploadingHero, setUploadingHero] = useState<string | null>(null);

  // Other sections data
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [surfPackages, setSurfPackages] = useState<any[]>([]);
  const [snowboardPackages, setSnowboardPackages] = useState<any[]>([]);
  const [surfInfo, setSurfInfo] = useState<any>(null);
  const [snowboardInfo, setSnowboardInfo] = useState<any>(null);
  const [sponsorsData, setSponsorsData] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [_siteConfig, _setSiteConfig] = useState<any>(null);

  // Video management states
  const [surfVideos, setSurfVideos] = useState<VideoData[]>([]);
  const [snowboardVideos, setSnowboardVideos] = useState<VideoData[]>([]);
  const [showVideoUploadForm, setShowVideoUploadForm] = useState<{
    show: boolean;
    type: "snowboard" | "surf" | null;
  }>({ show: false, type: null });
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const tabs = [
    { id: "faq", name: "Preguntas Frecuentes", icon: "❓" },
    { id: "contact", name: "Información de Contacto", icon: "📞" },
    { id: "packages", name: "Paquetes", icon: "🎿" },
    { id: "sponsors", name: "Patrocinadores", icon: "🤝" },
    { id: "reviews", name: "Reseñas", icon: "⭐" },
    { id: "gallery", name: "Galería", icon: "📸" },
    { id: "videos", name: "Videos", icon: "🎬" },
    { id: "hero", name: "Imágenes Hero", icon: "🖼️" },
  ];

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const showMessage = (msg: string, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  // Handle logout
  const handleLogout = async () => {
    if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      try {
        await signOut();
      } catch (error: any) {
        showMessage("Error al cerrar sesión: " + error.message, "error");
      }
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case "faq":
          await loadFAQs();
          break;
        case "contact":
          await loadContactInfo();
          break;
        case "packages":
          await loadPackages();
          break;
        case "sponsors":
          await loadSponsors();
          break;
        case "reviews":
          await loadReviews();
          break;
        case "gallery":
          await loadGallery();
          break;
        case "videos":
          await loadVideos();
          break;
        case "hero":
          await loadHeroImages();
          break;
        case "settings":
          await loadSiteConfig();
          break;
        default:
          break;
      }
    } catch (error: any) {
      console.error("Error loading data:", error);
      showMessage("Error cargando datos: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const loadFAQs = async () => {
    try {
      const faqCollection = await FirebaseService.getCollection(
        COLLECTIONS.FAQ_DATA
      );
      // Filter out non-FAQ documents (like 'content', 'contactCta')
      const faqItems = faqCollection.filter(
        (item) => item.question && item.answer && !isNaN(parseInt(item.id))
      );
      setFaqs(faqItems.sort((a, b) => parseInt(a.id) - parseInt(b.id)));
    } catch (error: any) {
      console.error("Error loading FAQs:", error);
      showMessage("Error cargando FAQs: " + error.message, "error");
    }
  };

  const loadContactInfo = async () => {
    try {
      const contact = await FirebaseService.getDocument(
        COLLECTIONS.CONTACT_INFO,
        "main"
      );
      setContactInfo(contact);
    } catch (error: any) {
      console.error("Error loading contact info:", error);
      showMessage(
        "Error cargando información de contacto: " + error.message,
        "error"
      );
    }
  };

  // Function to synchronize participant counts with actual trip members
  const syncParticipantCounts = async (packages: any[], _type: string) => {
    const { TripMemberService } = await import("../services/firebaseService");

    const updatedPackages = await Promise.all(
      packages.map(async (pkg) => {
        if (!pkg.dateRanges || pkg.dateRanges.length === 0) {
          return pkg;
        }

        const updatedDateRanges = await Promise.all(
          pkg.dateRanges.map(async (dateRange: any) => {
            try {
              const members = await TripMemberService.getMembersByDateRange(
                pkg.id,
                dateRange.id
              );
              return {
                ...dateRange,
                currentParticipants: members.length,
              };
            } catch (error) {
              console.error(
                `Error getting members for package ${pkg.id}, date range ${dateRange.id}:`,
                error
              );
              return dateRange;
            }
          })
        );

        return {
          ...pkg,
          dateRanges: updatedDateRanges,
        };
      })
    );

    return updatedPackages;
  };

  const loadPackages = async () => {
    try {
      const [surf, snowboard, surfInfoData, snowboardInfoData] =
        await Promise.all([
          FirebaseService.getCollection(COLLECTIONS.SURF_PACKAGES),
          FirebaseService.getCollection(COLLECTIONS.SNOWBOARD_PACKAGES),
          FirebaseService.getDocument(COLLECTIONS.SURF_INFO, "main"),
          FirebaseService.getDocument(COLLECTIONS.SNOWBOARD_INFO, "main"),
        ]);

      // Synchronize participant counts with actual trip members
      const [syncedSurf, syncedSnowboard] = await Promise.all([
        syncParticipantCounts(surf, "surf"),
        syncParticipantCounts(snowboard, "snowboard"),
      ]);

      setSurfPackages(
        syncedSurf.sort((a, b) => parseInt(a.id) - parseInt(b.id))
      );
      setSnowboardPackages(
        syncedSnowboard.sort((a, b) => parseInt(a.id) - parseInt(b.id))
      );
      setSurfInfo(surfInfoData);
      setSnowboardInfo(snowboardInfoData);
    } catch (error: any) {
      console.error("Error loading packages:", error);
      showMessage("Error cargando paquetes: " + error.message, "error");
    }
  };

  const loadSponsors = async () => {
    try {
      const data = await FirebaseService.getDocument(
        COLLECTIONS.SPONSORS_DATA,
        "main"
      );
      setSponsorsData(data);
    } catch (error: any) {
      console.error("Error loading sponsors:", error);
      showMessage("Error cargando patrocinadores: " + error.message, "error");
    }
  };

  const loadReviews = async () => {
    try {
      const reviewsCollection = await FirebaseService.getCollection(
        COLLECTIONS.REVIEWS_DATA
      );
      // Filter out config documents
      const reviewItems = reviewsCollection.filter(
        (item) => item.name && item.rating && !isNaN(parseInt(item.id))
      );
      setReviews(reviewItems.sort((a, b) => parseInt(a.id) - parseInt(b.id)));
    } catch (error: any) {
      console.error("Error loading reviews:", error);
      showMessage("Error cargando reseñas: " + error.message, "error");
    }
  };

  const loadGallery = async () => {
    try {
      const galleryCollection = await FirebaseService.getCollection(
        COLLECTIONS.GALLERY_IMAGES
      );
      // Filter out config documents
      const imageItems = galleryCollection.filter(
        (item) => item.src && item.alt && !isNaN(parseInt(item.id))
      );
      setGalleryImages(
        imageItems.sort((a, b) => parseInt(a.id) - parseInt(b.id))
      );
    } catch (error: any) {
      console.error("Error loading gallery:", error);
      showMessage("Error cargando galería: " + error.message, "error");
    }
  };

  // Load videos
  const loadVideos = async () => {
    try {
      const [surfVideosData, snowboardVideosData] = await Promise.all([
        VideoService.getVideosByType("surf"),
        VideoService.getVideosByType("snowboard"),
      ]);

      setSurfVideos(surfVideosData);
      setSnowboardVideos(snowboardVideosData);
    } catch (error: any) {
      console.error("Error loading videos:", error);
      showMessage("Error cargando videos: " + error.message, "error");
    }
  };

  // Load hero images
  const loadHeroImages = async () => {
    try {
      const [mainHero, snowboardInfo, surfInfo] = await Promise.all([
        FirebaseService.getDocument(COLLECTIONS.HERO_CONTENT, "main"),
        FirebaseService.getDocument(COLLECTIONS.SNOWBOARD_INFO, "main"),
        FirebaseService.getDocument(COLLECTIONS.SURF_INFO, "main"),
      ]);

      setHeroImages({
        main: mainHero?.backgrounds || { primary: null, fallback: null },
        snowboard: snowboardInfo?.heroBackground || {
          primary: null,
          fallback: null,
        },
        surf: surfInfo?.heroBackground || { primary: null, fallback: null },
      });
    } catch (error: any) {
      console.error("Error loading hero images:", error);
      showMessage("Error cargando imágenes hero: " + error.message, "error");
    }
  };

  const loadSiteConfig = async () => {
    try {
      const [hero, navigation, surfInfo] = await Promise.all([
        FirebaseService.getDocument(COLLECTIONS.HERO_CONTENT, "main"),
        FirebaseService.getDocument(COLLECTIONS.NAVIGATION, "main"),
        FirebaseService.getDocument(COLLECTIONS.SURF_INFO, "main"),
      ]);
      _setSiteConfig({
        hero,
        navigation,
        surfInfo,
      });
    } catch (error: any) {
      console.error("Error loading site config:", error);
      showMessage("Error cargando configuración: " + error.message, "error");
    }
  };

  // FAQ Management Functions
  const getNextFaqId = () => {
    if (faqs.length === 0) return "1";
    const maxId = Math.max(...faqs.map((faq) => parseInt(faq.id)));
    return (maxId + 1).toString();
  };

  const handleAddFaq = async () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) {
      showMessage(
        "Por favor completa tanto la pregunta como la respuesta",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      const faqId = getNextFaqId();
      const faqData = {
        id: parseInt(faqId),
        question: newFaq.question.trim(),
        answer: newFaq.answer.trim(),
      };

      await FirebaseService.setDocument(COLLECTIONS.FAQ_DATA, faqId, faqData);

      setFaqs([...faqs, faqData].sort((a, b) => a.id - b.id));
      setNewFaq({ question: "", answer: "" });
      setShowAddForm(false);
      showMessage("FAQ agregada exitosamente");
    } catch (error: any) {
      console.error("Error adding FAQ:", error);
      showMessage("Error agregando FAQ: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditFaq = async (faqId: string, updatedData: any) => {
    if (!updatedData.question.trim() || !updatedData.answer.trim()) {
      showMessage(
        "Por favor completa tanto la pregunta como la respuesta",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      const faqData = {
        id: parseInt(faqId),
        question: updatedData.question.trim(),
        answer: updatedData.answer.trim(),
      };

      await FirebaseService.setDocument(COLLECTIONS.FAQ_DATA, faqId, faqData);

      setFaqs(faqs.map((faq) => (faq.id === parseInt(faqId) ? faqData : faq)));
      setEditingFaq(null);
      showMessage("FAQ actualizada exitosamente");
    } catch (error: any) {
      console.error("Error updating FAQ:", error);
      showMessage("Error actualizando FAQ: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFaq = async (faqId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta FAQ?")) {
      return;
    }

    setLoading(true);
    try {
      await FirebaseService.deleteDocument(
        COLLECTIONS.FAQ_DATA,
        faqId.toString()
      );
      setFaqs(faqs.filter((faq) => faq.id !== faqId));
      showMessage("FAQ eliminada exitosamente");
    } catch (error: any) {
      console.error("Error deleting FAQ:", error);
      showMessage("Error eliminando FAQ: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Contact Management Functions
  const handleEditContact = () => {
    setContactEditData({ ...contactInfo });
    setEditingContact(true);
  };

  const handleSaveContact = async () => {
    setLoading(true);
    try {
      await FirebaseService.setDocument(
        COLLECTIONS.CONTACT_INFO,
        "main",
        contactEditData
      );
      setContactInfo(contactEditData);
      setEditingContact(false);
      showMessage("Información de contacto actualizada exitosamente");
    } catch (error: any) {
      console.error("Error updating contact info:", error);
      showMessage(
        "Error actualizando información de contacto: " + error.message,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancelContactEdit = () => {
    setEditingContact(false);
    setContactEditData(null);
  };

  // Package Management Functions
  const getNextPackageId = (packages: any[]) => {
    if (packages.length === 0) return "1";
    const maxId = Math.max(...packages.map((pkg: any) => parseInt(pkg.id)));
    return (maxId + 1).toString();
  };

  const handleAddPackage = async () => {
    if (
      !newPackage.name.trim() ||
      !newPackage.description.trim() ||
      !newPackage.price ||
      !newPackage.duration.trim()
    ) {
      showMessage("Por favor completa todos los campos del paquete", "error");
      return;
    }

    setLoading(true);
    try {
      const collection =
        newPackage.type === "surf"
          ? COLLECTIONS.SURF_PACKAGES
          : COLLECTIONS.SNOWBOARD_PACKAGES;
      const packages =
        newPackage.type === "surf" ? surfPackages : snowboardPackages;
      const packageId = getNextPackageId(packages);

      // Initialize basic details structure
      const initializePackageDetails = () => {
        const infoData = newPackage.type === "surf" ? surfInfo : snowboardInfo;
        const details: any = {};

        if (infoData?.packageDetailCategories) {
          infoData.packageDetailCategories.forEach((category: any) => {
            details[category.id] = {};
            category.fields.forEach((field: string) => {
              details[category.id][field] = "";
            });
          });
        }

        return details;
      };

      const packageData = {
        id: parseInt(packageId),
        name: newPackage.name.trim(),
        description: newPackage.description.trim(),
        price:
          typeof newPackage.price === "string"
            ? parseInt(newPackage.price)
            : newPackage.price,
        duration: newPackage.duration.trim(),
        featured: newPackage.featured,
        image:
          "https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        highlights: [
          "Nuevo paquete",
          "Experiencia única",
          "Guías profesionales",
        ],
        dateRanges: [], // Initialize empty array for multiple date ranges
        details: initializePackageDetails(),
      };

      await FirebaseService.setDocument(collection, packageId, packageData);

      if (newPackage.type === "surf") {
        setSurfPackages(
          [...surfPackages, packageData].sort((a, b) => a.id - b.id)
        );
      } else {
        setSnowboardPackages(
          [...snowboardPackages, packageData].sort((a, b) => a.id - b.id)
        );
      }

      setNewPackage({
        name: "",
        description: "",
        price: "",
        duration: "",
        featured: false,
        type: "surf",
      });
      setShowAddPackageForm(false);
      showMessage("Paquete agregado exitosamente");
    } catch (error: any) {
      console.error("Error adding package:", error);
      showMessage("Error agregando paquete: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBasicPackageEdit = (packageId: string, type: string) => {
    setBasicPackageEditModal({ isOpen: true, packageId, type });
  };

  const handleCloseBasicPackageEdit = () => {
    setBasicPackageEditModal({ isOpen: false, packageId: null, type: null });
  };

  const handleEditPackage = async (
    packageId: string,
    updatedData: any,
    type: string
  ) => {
    setLoading(true);
    try {
      const collection =
        type === "surf"
          ? COLLECTIONS.SURF_PACKAGES
          : COLLECTIONS.SNOWBOARD_PACKAGES;
      await FirebaseService.setDocument(
        collection,
        packageId.toString(),
        updatedData
      );

      if (type === "surf") {
        setSurfPackages(
          surfPackages.map((pkg) => (pkg.id === packageId ? updatedData : pkg))
        );
      } else {
        setSnowboardPackages(
          snowboardPackages.map((pkg) =>
            pkg.id === packageId ? updatedData : pkg
          )
        );
      }

      // Close the modal
      setBasicPackageEditModal({ isOpen: false, packageId: null, type: null });
      showMessage("Paquete actualizado exitosamente");
    } catch (error: any) {
      console.error("Error updating package:", error);
      showMessage("Error actualizando paquete: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePackage = async (packageId: string, type: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este paquete?")) {
      return;
    }

    setLoading(true);
    try {
      const collection =
        type === "surf"
          ? COLLECTIONS.SURF_PACKAGES
          : COLLECTIONS.SNOWBOARD_PACKAGES;
      await FirebaseService.deleteDocument(collection, packageId.toString());

      if (type === "surf") {
        setSurfPackages(surfPackages.filter((pkg) => pkg.id !== packageId));
      } else {
        setSnowboardPackages(
          snowboardPackages.filter((pkg) => pkg.id !== packageId)
        );
      }

      showMessage("Paquete eliminado exitosamente");
    } catch (error: any) {
      console.error("Error deleting package:", error);
      showMessage("Error eliminando paquete: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Date Range Management Functions
  const handleManageDateRanges = (packageId: string, type: string) => {
    setDateRangeModal({ isOpen: true, packageId, type });
  };

  // Trip Member Management Functions
  const handleManageTripMembers = (packageId: string, type: string) => {
    setTripMemberModal({ isOpen: true, packageId, type });
  };

  const handleAddDateRange = async (
    packageId: string,
    type: string,
    dateRange: any
  ) => {
    setLoading(true);
    try {
      await PackageService.addDateRange(
        packageId,
        type as "surf" | "snowboard",
        dateRange
      );

      // Reload packages to get updated data
      await loadPackages();

      showMessage("Rango de fechas agregado exitosamente");
    } catch (error: any) {
      console.error("Error adding date range:", error);
      showMessage("Error agregando rango de fechas: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDateRange = async (
    packageId: string,
    type: string,
    dateRangeId: string,
    updatedData: any
  ) => {
    setLoading(true);
    try {
      await PackageService.updateDateRange(
        packageId,
        type as "surf" | "snowboard",
        dateRangeId,
        updatedData
      );

      // Reload packages to get updated data
      await loadPackages();

      showMessage("Rango de fechas actualizado exitosamente");
    } catch (error) {
      console.error("Error updating date range:", error);
      showMessage(
        "Error actualizando rango de fechas: " + (error as any).message,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDateRange = async (
    packageId: string,
    type: string,
    dateRangeId: string
  ) => {
    setLoading(true);
    try {
      await PackageService.deleteDateRange(
        packageId,
        type as "surf" | "snowboard",
        dateRangeId
      );

      // Reload packages to get updated data
      await loadPackages();

      showMessage("Rango de fechas eliminado exitosamente");
    } catch (error: any) {
      console.error("Error deleting date range:", error);
      showMessage(
        "Error eliminando rango de fechas: " + error.message,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Package Details Management Functions
  const handleEditPackageDetails = (packageId: string, type: string) => {
    setPackageDetailsModal({ isOpen: true, packageId, type });
  };

  const handleSavePackageDetails = async (
    packageId: string,
    updatedData: any,
    type: string,
    updatedCategories: any
  ) => {
    setLoading(true);
    try {
      const packageCollection =
        type === "surf"
          ? COLLECTIONS.SURF_PACKAGES
          : COLLECTIONS.SNOWBOARD_PACKAGES;

      // Save package details
      await FirebaseService.setDocument(
        packageCollection,
        packageId.toString(),
        updatedData
      );

      // Save category changes if provided
      if (updatedCategories) {
        const infoCollection =
          type === "surf" ? COLLECTIONS.SURF_INFO : COLLECTIONS.SNOWBOARD_INFO;
        const currentInfo = type === "surf" ? surfInfo : snowboardInfo;

        const updatedInfo = {
          ...currentInfo,
          packageDetailCategories: updatedCategories,
        };

        await FirebaseService.setDocument(infoCollection, "main", updatedInfo);

        // Update local state for categories
        if (type === "surf") {
          setSurfInfo(updatedInfo);
        } else {
          setSnowboardInfo(updatedInfo);
        }
      }

      // Update package state
      if (type === "surf") {
        setSurfPackages(
          surfPackages.map((pkg) => (pkg.id === packageId ? updatedData : pkg))
        );
      } else {
        setSnowboardPackages(
          snowboardPackages.map((pkg) =>
            pkg.id === packageId ? updatedData : pkg
          )
        );
      }

      // Close the modal
      setPackageDetailsModal({ isOpen: false, packageId: null, type: null });
      showMessage("Detalles del paquete actualizados exitosamente");
    } catch (error: any) {
      console.error("Error updating package details:", error);
      showMessage("Error actualizando detalles: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPackageDetailsEdit = () => {
    setPackageDetailsModal({ isOpen: false, packageId: null, type: null });
  };

  // Category Management Functions (for use within Package Details Modal)
  const handleToggleCategory = async (categoryId: string) => {
    const type = packageDetailsModal.type;
    if (!type) return;

    setLoading(true);
    try {
      const collection =
        type === "surf" ? COLLECTIONS.SURF_INFO : COLLECTIONS.SNOWBOARD_INFO;
      const currentInfo = type === "surf" ? surfInfo : snowboardInfo;

      const updatedCategories = currentInfo.packageDetailCategories.map(
        (cat: any) =>
          cat.id === categoryId ? { ...cat, enabled: !cat.enabled } : cat
      );

      const updatedInfo = {
        ...currentInfo,
        packageDetailCategories: updatedCategories,
      };

      await FirebaseService.setDocument(collection, "main", updatedInfo);

      // Update local state
      if (type === "surf") {
        setSurfInfo(updatedInfo);
      } else {
        setSnowboardInfo(updatedInfo);
      }

      showMessage("Categoría actualizada exitosamente");
    } catch (error: any) {
      console.error("Error toggling category:", error);
      showMessage("Error actualizando categoría: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const type = packageDetailsModal.type;
    if (!type) return;

    if (
      !confirm(
        "¿Estás seguro de que quieres eliminar esta categoría? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const collection =
        type === "surf" ? COLLECTIONS.SURF_INFO : COLLECTIONS.SNOWBOARD_INFO;
      const currentInfo = type === "surf" ? surfInfo : snowboardInfo;

      const updatedCategories = currentInfo.packageDetailCategories.filter(
        (cat: any) => cat.id !== categoryId
      );

      const updatedInfo = {
        ...currentInfo,
        packageDetailCategories: updatedCategories,
      };

      await FirebaseService.setDocument(collection, "main", updatedInfo);

      // Update local state
      if (type === "surf") {
        setSurfInfo(updatedInfo);
      } else {
        setSnowboardInfo(updatedInfo);
      }

      showMessage("Categoría eliminada exitosamente");
    } catch (error: any) {
      console.error("Error deleting category:", error);
      showMessage("Error eliminando categoría: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    const type = packageDetailsModal.type;
    if (!type) return;

    const categoryName = prompt("Ingresa el nombre de la nueva categoría:");
    if (!categoryName || !categoryName.trim()) return;

    const categoryId = categoryName.toLowerCase().replace(/\s+/g, "");

    setLoading(true);
    try {
      const collection =
        type === "surf" ? COLLECTIONS.SURF_INFO : COLLECTIONS.SNOWBOARD_INFO;
      const currentInfo = type === "surf" ? surfInfo : snowboardInfo;

      // Check if category already exists
      const existingCategory = currentInfo.packageDetailCategories.find(
        (cat: any) => cat.id === categoryId
      );
      if (existingCategory) {
        alert("Ya existe una categoría con ese nombre");
        return;
      }

      const newCategory = {
        id: categoryId,
        title: categoryName.trim(),
        iconName: DEFAULT_CATEGORY_STYLE.iconName,
        gradient: DEFAULT_CATEGORY_STYLE.gradient,
        textColor: DEFAULT_CATEGORY_STYLE.textColor,
        enabled: true,
        fields: ["descripcion"], // Default field
      };

      const updatedCategories = [
        ...currentInfo.packageDetailCategories,
        newCategory,
      ];

      const updatedInfo = {
        ...currentInfo,
        packageDetailCategories: updatedCategories,
      };

      await FirebaseService.setDocument(collection, "main", updatedInfo);

      // Update local state
      if (type === "surf") {
        setSurfInfo(updatedInfo);
      } else {
        setSnowboardInfo(updatedInfo);
      }

      showMessage("Categoría agregada exitosamente");
    } catch (error: any) {
      console.error("Error adding category:", error);
      showMessage("Error agregando categoría: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // New function to handle updating category fields (subcategories)
  const handleUpdateCategoryFields = async (
    categoryId: string,
    updatedFields: any
  ) => {
    const type = packageDetailsModal.type;
    if (!type) return;

    setLoading(true);
    try {
      const collection =
        type === "surf" ? COLLECTIONS.SURF_INFO : COLLECTIONS.SNOWBOARD_INFO;
      const currentInfo = type === "surf" ? surfInfo : snowboardInfo;

      const updatedCategories = currentInfo.packageDetailCategories.map(
        (cat: any) =>
          cat.id === categoryId ? { ...cat, fields: updatedFields } : cat
      );

      const updatedInfo = {
        ...currentInfo,
        packageDetailCategories: updatedCategories,
      };

      await FirebaseService.setDocument(collection, "main", updatedInfo);

      // Update local state
      if (type === "surf") {
        setSurfInfo(updatedInfo);
      } else {
        setSnowboardInfo(updatedInfo);
      }

      showMessage("Subcategorías actualizadas exitosamente");
    } catch (error: any) {
      console.error("Error updating category fields:", error);
      showMessage(
        "Error actualizando subcategorías: " + error.message,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Sponsors Management Functions
  const handleUpdateSponsors = async (updatedSponsorsData: any) => {
    setLoading(true);
    try {
      await FirebaseService.setDocument(
        COLLECTIONS.SPONSORS_DATA,
        "main",
        updatedSponsorsData
      );
      setSponsorsData(updatedSponsorsData);
      showMessage("Patrocinadores actualizados exitosamente");
    } catch (error: any) {
      console.error("Error updating sponsors:", error);
      showMessage(
        "Error actualizando patrocinadores: " + error.message,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  const _handlePopulateSponsors = async () => {
    if (
      !confirm(
        "¿Estás seguro de que quieres cargar los patrocinadores por defecto?"
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const defaultSponsorsData = {
        title: "Patrocinadores",
        message:
          "Nuestros patrocinadores nos acompañan en cada aventura épica 🏄‍♂️🏂",
        sponsors: [
          {
            id: "1",
            name: "Corona",
            logo: "/assets/corona_logo.png",
            alt: "Corona - Patrocinador oficial",
            website: "https://corona.com",
          },
        ],
      };

      await FirebaseService.setDocument(
        COLLECTIONS.SPONSORS_DATA,
        "main",
        defaultSponsorsData
      );

      setSponsorsData(defaultSponsorsData);
      showMessage("Patrocinadores poblados exitosamente");
    } catch (error: any) {
      console.error("Error populating sponsors:", error);
      showMessage("Error poblando patrocinadores: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };
  */

  // Review Management Functions
  const getNextReviewId = () => {
    if (reviews.length === 0) return "1";
    const maxId = Math.max(...reviews.map((review) => parseInt(review.id)));
    return (maxId + 1).toString();
  };

  const handleAddReview = async () => {
    if (
      !newReview.name.trim() ||
      !newReview.text.trim() ||
      !newReview.location.trim()
    ) {
      showMessage("Por favor completa todos los campos de la reseña", "error");
      return;
    }

    setLoading(true);
    try {
      const reviewId = getNextReviewId();
      const reviewData = {
        id: parseInt(reviewId),
        name: newReview.name.trim(),
        location: newReview.location.trim(),
        rating:
          typeof newReview.rating === "string"
            ? parseInt(newReview.rating)
            : newReview.rating,
        text: newReview.text.trim(),
        trip: newReview.trip,
        date: newReview.date,
      };

      await FirebaseService.setDocument(
        COLLECTIONS.REVIEWS_DATA,
        reviewId,
        reviewData
      );

      setReviews([...reviews, reviewData].sort((a, b) => a.id - b.id));
      setNewReview({
        name: "",
        location: "",
        rating: 5,
        text: "",
        trip: "Surf Trip",
        date: new Date().getFullYear().toString(),
      });
      setShowAddReviewForm(false);
      showMessage("Reseña agregada exitosamente");
    } catch (error: any) {
      console.error("Error adding review:", error);
      showMessage("Error agregando reseña: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = async (reviewId: string, updatedData: any) => {
    setLoading(true);
    try {
      await FirebaseService.setDocument(
        COLLECTIONS.REVIEWS_DATA,
        reviewId.toString(),
        updatedData
      );
      setReviews(
        reviews.map((review) => (review.id === reviewId ? updatedData : review))
      );
      setEditingReview(null);
      showMessage("Reseña actualizada exitosamente");
    } catch (error: any) {
      console.error("Error updating review:", error);
      showMessage("Error actualizando reseña: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta reseña?")) {
      return;
    }

    setLoading(true);
    try {
      await FirebaseService.deleteDocument(
        COLLECTIONS.REVIEWS_DATA,
        reviewId.toString()
      );
      setReviews(reviews.filter((review) => review.id !== reviewId));
      showMessage("Reseña eliminada exitosamente");
    } catch (error: any) {
      console.error("Error deleting review:", error);
      showMessage("Error eliminando reseña: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Gallery Management Functions
  const getNextImageId = () => {
    if (galleryImages.length === 0) return "1";
    const maxId = Math.max(...galleryImages.map((img) => parseInt(img.id)));
    return (maxId + 1).toString();
  };

  // Handle Cloudinary image upload success
  const handleCloudinaryUploadSuccess = async (uploadResult: any) => {
    setLoading(true);
    try {
      const imageId = getNextImageId();
      const imageData = {
        id: parseInt(imageId),
        src: uploadResult.src,
        alt: uploadResult.alt,
        category: uploadResult.category,
        publicId: uploadResult.publicId, // Store Cloudinary public ID for deletion
        width: uploadResult.width,
        height: uploadResult.height,
        size: uploadResult.size,
      };

      await FirebaseService.setDocument(
        COLLECTIONS.GALLERY_IMAGES,
        imageId,
        imageData
      );

      setGalleryImages(
        [...galleryImages, imageData].sort((a, b) => a.id - b.id)
      );

      setShowAddImageForm(false);
      showMessage("Imagen subida y agregada exitosamente");
    } catch (error: any) {
      console.error("Error saving image to database:", error);
      showMessage("Error guardando imagen: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle Cloudinary upload error
  const handleCloudinaryUploadError = (error: any) => {
    console.error("Cloudinary upload error:", error);
    showMessage("Error subiendo imagen: " + error.message, "error");
  };

  // Legacy function for manual URL input (keeping for backward compatibility)
  /*
  const _handleAddImage = async () => {
    if (!newImage.src.trim() || !newImage.alt.trim()) {
      showMessage(
        "Por favor completa la URL y descripción de la imagen",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      const imageId = getNextImageId();
      const imageData = {
        id: parseInt(imageId),
        src: newImage.src.trim(),
        alt: newImage.alt.trim(),
        category: newImage.category,
      };

      await FirebaseService.setDocument(
        COLLECTIONS.GALLERY_IMAGES,
        imageId,
        imageData
      );

      setGalleryImages(
        [...galleryImages, imageData].sort((a, b) => a.id - b.id)
      );
      setNewImage({
        src: "",
        alt: "",
        category: "Surf",
      });
      setShowAddImageForm(false);
      showMessage("Imagen agregada exitosamente");
    } catch (error: any) {
      console.error("Error adding image:", error);
      showMessage("Error agregando imagen: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };
  */

  /*
  const _handlePopulateGallery = async () => {
    if (
      !confirm(
        "¿Estás seguro de que quieres cargar las imágenes locales? Esto reemplazará las imágenes existentes."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      // Gallery images data with correct paths
      const localGalleryImages = [
        {
          id: 1,
          src: "/assets/gallery/DSC_0676.jpg",
          alt: "Aventura en la montaña - Paisaje nevado",
          category: "Snowboard",
        },
        {
          id: 2,
          src: "/assets/gallery/SUR.PROD-15.jpg",
          alt: "Sesión de surf - Ola perfecta",
          category: "Surf",
        },
        {
          id: 3,
          src: "/assets/gallery/SUR.PROD-20.jpg",
          alt: "Surfista en acción - Maniobra espectacular",
          category: "Surf",
        },
        {
          id: 4,
          src: "/assets/gallery/SUR.PROD-21.jpg",
          alt: "Momento épico de surf",
          category: "Surf",
        },
        {
          id: 5,
          src: "/assets/gallery/SUR.PROD-32.jpg",
          alt: "Surf en aguas cristalinas",
          category: "Surf",
        },
        {
          id: 6,
          src: "/assets/gallery/SUR.PROD-36.jpg",
          alt: "Aventura de surf - Atardecer",
          category: "Surf",
        },
        {
          id: 7,
          src: "/assets/gallery/SUR.PROD-45.jpg",
          alt: "Sesión de surf profesional",
          category: "Surf",
        },
        {
          id: 8,
          src: "/assets/gallery/SUR.PROD-47.jpg",
          alt: "Surf en olas grandes",
          category: "Surf",
        },
        {
          id: 9,
          src: "/assets/gallery/SUR.PROD-61.jpg",
          alt: "Momento de surf increíble",
          category: "Surf",
        },
        {
          id: 10,
          src: "/assets/gallery/SUR.PROD-142.jpg",
          alt: "Surf épico - Lombok",
          category: "Surf",
        },
      ];

      for (const image of localGalleryImages) {
        await FirebaseService.setDocument(
          COLLECTIONS.GALLERY_IMAGES,
          image.id.toString(),
          image
        );
      }

      setGalleryImages(localGalleryImages);
      showMessage(
        `Galería poblada exitosamente con ${localGalleryImages.length} imágenes locales`
      );
    } catch (error: any) {
      console.error("Error populating gallery:", error);
      showMessage("Error poblando galería: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };
  */

  const handleEditImage = async (imageId: string, updatedData: any) => {
    setLoading(true);
    try {
      await FirebaseService.setDocument(
        COLLECTIONS.GALLERY_IMAGES,
        imageId.toString(),
        updatedData
      );
      setGalleryImages(
        galleryImages.map((img) => (img.id === imageId ? updatedData : img))
      );
      setEditingImage(null);
      showMessage("Imagen actualizada exitosamente");
    } catch (error: any) {
      console.error("Error updating image:", error);
      showMessage("Error actualizando imagen: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta imagen?")) {
      return;
    }

    setLoading(true);
    try {
      // Find the image to get its publicId for Cloudinary deletion
      const imageToDelete = galleryImages.find((img) => img.id === imageId);

      // Delete from Firebase first
      await FirebaseService.deleteDocument(
        COLLECTIONS.GALLERY_IMAGES,
        imageId.toString()
      );

      // If image has a Cloudinary publicId, delete from Cloudinary too
      if (imageToDelete?.publicId) {
        try {
          await CloudinaryService.deleteImage(imageToDelete.publicId);
          console.log("Image deleted from Cloudinary:", imageToDelete.publicId);
        } catch (cloudinaryError) {
          console.warn("Failed to delete from Cloudinary:", cloudinaryError);
          // Don't fail the entire operation if Cloudinary deletion fails
        }
      }

      setGalleryImages(galleryImages.filter((img) => img.id !== imageId));
      showMessage("Imagen eliminada exitosamente");
    } catch (error: any) {
      console.error("Error deleting image:", error);
      showMessage("Error eliminando imagen: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Hero Images Management Functions
  const handleHeroImageUpload = async (
    page: string,
    type: string,
    uploadResult: any
  ) => {
    setUploadingHero(`${page}-${type}`);
    try {
      const imageData = {
        src: uploadResult.src,
        alt: uploadResult.alt,
        publicId: uploadResult.publicId,
      };

      // Update the appropriate collection based on page
      if (page === "main") {
        const currentHero = await FirebaseService.getDocument(
          COLLECTIONS.HERO_CONTENT,
          "main"
        );
        const updatedBackgrounds = {
          ...currentHero?.backgrounds,
          [type]: imageData,
        };
        await FirebaseService.setDocument(COLLECTIONS.HERO_CONTENT, "main", {
          ...currentHero,
          backgrounds: updatedBackgrounds,
        });
      } else if (page === "snowboard") {
        const currentInfo = await FirebaseService.getDocument(
          COLLECTIONS.SNOWBOARD_INFO,
          "main"
        );
        const updatedBackground = {
          ...currentInfo?.heroBackground,
          [type]: imageData,
        };
        await FirebaseService.setDocument(COLLECTIONS.SNOWBOARD_INFO, "main", {
          ...currentInfo,
          heroBackground: updatedBackground,
        });
      } else if (page === "surf") {
        const currentInfo = await FirebaseService.getDocument(
          COLLECTIONS.SURF_INFO,
          "main"
        );
        const updatedBackground = {
          ...currentInfo?.heroBackground,
          [type]: imageData,
        };
        await FirebaseService.setDocument(COLLECTIONS.SURF_INFO, "main", {
          ...currentInfo,
          heroBackground: updatedBackground,
        });
      }

      // Update local state
      setHeroImages((prev) => ({
        ...prev,
        [page]: {
          ...(prev as any)[page],
          [type]: imageData,
        },
      }));

      showMessage(`Imagen hero ${type} de ${page} actualizada exitosamente`);
    } catch (error: any) {
      console.error("Error uploading hero image:", error);
      showMessage("Error subiendo imagen hero: " + error.message, "error");
    } finally {
      setUploadingHero(null);
    }
  };

  // Video Management Functions
  const handleVideoUploadSuccess = async (uploadResult: any) => {
    setUploadingVideo(true);
    try {
      const videoData = {
        url: uploadResult.url,
        title: uploadResult.title,
        description: uploadResult.description,
        type: uploadResult.type,
        publicId: uploadResult.publicId,
        width: uploadResult.width,
        height: uploadResult.height,
        duration: uploadResult.duration,
        size: uploadResult.size,
        format: uploadResult.format,
        isActive: false, // New videos are not active by default
      };

      await VideoService.addVideo(videoData);

      // Reload videos
      await loadVideos();

      setShowVideoUploadForm({ show: false, type: null });
      showMessage(`Video de ${uploadResult.type} subido exitosamente`);
    } catch (error: any) {
      console.error("Error saving video to database:", error);
      showMessage("Error guardando video: " + error.message, "error");
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleVideoUploadError = (error: any) => {
    console.error("Video upload error:", error);
    showMessage("Error subiendo video: " + error.message, "error");
    setUploadingVideo(false);
  };

  const handleSetActiveVideo = async (
    videoId: string,
    type: "snowboard" | "surf"
  ) => {
    try {
      await VideoService.setActiveVideo(videoId, type);
      await loadVideos();
      showMessage(`Video de ${type} activado exitosamente`);
    } catch (error: any) {
      console.error("Error setting active video:", error);
      showMessage("Error activando video: " + error.message, "error");
    }
  };

  const handleDeleteVideo = async (
    videoId: string,
    type: "snowboard" | "surf",
    publicId: string
  ) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este video?")) {
      return;
    }

    try {
      // Delete from Cloudinary
      await CloudinaryService.deleteVideo(publicId);

      // Delete from Firebase
      await VideoService.deleteVideo(videoId, type);

      // Reload videos
      await loadVideos();

      showMessage("Video eliminado exitosamente");
    } catch (error: any) {
      console.error("Error deleting video:", error);
      showMessage("Error eliminando video: " + error.message, "error");
    }
  };

  // FAQ Components
  interface FAQItemProps {
    faq: any;
    isEditing: boolean;
    onEdit: (id: string) => void;
    onSave: (id: string, data: any) => void;
    onCancel: () => void;
    onDelete: (id: string) => void;
  }

  const FAQItem: React.FC<FAQItemProps> = ({
    faq,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    onDelete,
  }) => {
    const [editData, setEditData] = useState({
      question: faq.question,
      answer: faq.answer,
    });

    const handleSave = () => {
      onSave(faq.id, editData);
    };

    if (isEditing) {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pregunta
              </label>
              <input
                type="text"
                value={editData.question}
                onChange={(e) =>
                  setEditData({ ...editData, question: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Escribe la pregunta..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Respuesta
              </label>
              <textarea
                value={editData.answer}
                onChange={(e) =>
                  setEditData({ ...editData, answer: e.target.value })
                }
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Escribe la respuesta..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>Guardar</span>
              </button>
              <button
                onClick={onCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <X className="h-4 w-4" />
                <span>Cancelar</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 pr-4">
            {faq.question}
          </h3>
          <div className="flex space-x-2 flex-shrink-0">
            <button
              onClick={() => onEdit(faq.id)}
              className="text-blue-600 hover:text-blue-800 p-1"
              title="Editar"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(faq.id)}
              className="text-red-600 hover:text-red-800 p-1"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
        <div className="mt-3 text-sm text-gray-500">ID: {faq.id}</div>
      </div>
    );
  };

  const AddFAQForm = () => (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Agregar Nueva FAQ
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pregunta
          </label>
          <input
            type="text"
            value={newFaq.question}
            onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="¿Cuál es tu pregunta?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Respuesta
          </label>
          <textarea
            value={newFaq.answer}
            onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            placeholder="Escribe la respuesta detallada..."
          />
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleAddFaq}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            <span>Agregar FAQ</span>
          </button>
          <button
            onClick={() => {
              setShowAddForm(false);
              setNewFaq({ question: "", answer: "" });
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Cancelar</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Contact Edit Form Component
  const ContactEditForm = () => (
    <div className="space-y-6">
      {/* Phone Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          📞 Teléfonos
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono para mostrar
            </label>
            <input
              type="text"
              value={contactEditData?.phone?.display || ""}
              onChange={(e) =>
                setContactEditData({
                  ...contactEditData,
                  phone: { ...contactEditData.phone, display: e.target.value },
                })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp
            </label>
            <input
              type="text"
              value={contactEditData?.whatsapp?.number || ""}
              onChange={(e) =>
                setContactEditData({
                  ...contactEditData,
                  whatsapp: {
                    ...contactEditData.whatsapp,
                    number: e.target.value,
                  },
                })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Email Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          📧 Emails
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Principal
            </label>
            <input
              type="email"
              value={contactEditData?.email?.primary || ""}
              onChange={(e) =>
                setContactEditData({
                  ...contactEditData,
                  email: { ...contactEditData.email, primary: e.target.value },
                })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email de Soporte
            </label>
            <input
              type="email"
              value={contactEditData?.email?.support || ""}
              onChange={(e) =>
                setContactEditData({
                  ...contactEditData,
                  email: { ...contactEditData.email, support: e.target.value },
                })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email de Reservas
            </label>
            <input
              type="email"
              value={contactEditData?.email?.bookings || ""}
              onChange={(e) =>
                setContactEditData({
                  ...contactEditData,
                  email: { ...contactEditData.email, bookings: e.target.value },
                })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          📍 Dirección
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dirección Completa
            </label>
            <input
              type="text"
              value={contactEditData?.address?.full || ""}
              onChange={(e) =>
                setContactEditData({
                  ...contactEditData,
                  address: { ...contactEditData.address, full: e.target.value },
                })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ciudad
              </label>
              <input
                type="text"
                value={contactEditData?.address?.city || ""}
                onChange={(e) =>
                  setContactEditData({
                    ...contactEditData,
                    address: {
                      ...contactEditData.address,
                      city: e.target.value,
                    },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Provincia
              </label>
              <input
                type="text"
                value={contactEditData?.address?.province || ""}
                onChange={(e) =>
                  setContactEditData({
                    ...contactEditData,
                    address: {
                      ...contactEditData.address,
                      province: e.target.value,
                    },
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          🕒 Horarios de Atención
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horario de Semana
            </label>
            <input
              type="text"
              value={contactEditData?.businessHours?.weekdays?.hours || ""}
              onChange={(e) =>
                setContactEditData({
                  ...contactEditData,
                  businessHours: {
                    ...contactEditData.businessHours,
                    weekdays: {
                      ...contactEditData.businessHours?.weekdays,
                      hours: e.target.value,
                    },
                  },
                })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="9:00 AM - 6:00 PM"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horario de Fin de Semana
            </label>
            <input
              type="text"
              value={contactEditData?.businessHours?.weekends?.hours || ""}
              onChange={(e) =>
                setContactEditData({
                  ...contactEditData,
                  businessHours: {
                    ...contactEditData.businessHours,
                    weekends: {
                      ...contactEditData.businessHours?.weekends,
                      hours: e.target.value,
                    },
                  },
                })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="10:00 AM - 4:00 PM"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleSaveContact}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>Guardar Cambios</span>
        </button>
        <button
          onClick={handleCancelContactEdit}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
        >
          <X className="h-4 w-4" />
          <span>Cancelar</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="border-b border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
                  Panel de Administración
                </h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  Gestiona el contenido de tu sitio web
                </p>
              </div>

              {/* User info and logout */}
              <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
                <div className="text-left sm:text-right flex-1 sm:flex-none min-w-0">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{user?.email}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Administrador
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm sm:text-base flex-shrink-0"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Cerrar Sesión</span>
                  <span className="sm:hidden">Salir</span>
                </button>
              </div>
            </div>
          </div>

          {message && (
            <div
              className={`mt-4 p-4 rounded-lg flex items-center space-x-2 ${
                messageType === "error"
                  ? "bg-red-100 text-red-700 border border-red-200"
                  : messageType === "info"
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-green-100 text-green-700 border border-green-200"
              }`}
            >
              {messageType === "error" && <AlertCircle className="h-5 w-5" />}
              {messageType === "success" && <Check className="h-5 w-5" />}
              {messageType === "info" && <RefreshCw className="h-5 w-5" />}
              <span>{message}</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="px-4 sm:px-6 mt-4">
            <div className="flex overflow-x-auto scrollbar-hide sm:justify-center">
              <div className="flex space-x-1 sm:space-x-2 min-w-max">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3 sm:py-4 cursor-pointer px-3 sm:px-4 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600 bg-blue-50"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-sm sm:text-lg">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.name}</span>
                    <span className="sm:hidden text-xs">
                      {tab.name.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Cargando...</span>
            </div>
          ) : (
            <div>
              {activeTab === "faq" && (
                <div>
                  {/* FAQ Header */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        Preguntas Frecuentes
                      </h2>
                      <p className="text-gray-600 mt-1 text-sm sm:text-base">
                        Gestiona las preguntas y respuestas de tu sitio web
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg flex items-center space-x-2 text-sm sm:text-base w-full sm:w-auto justify-center"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Agregar FAQ</span>
                    </button>
                  </div>

                  {/* Add FAQ Form */}
                  {showAddForm && <AddFAQForm />}

                  {/* FAQ Stats */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center sm:justify-start space-x-6 sm:space-x-8">
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">
                          {faqs.length}
                        </div>
                        <div className="text-xs sm:text-sm text-blue-700">
                          Total FAQs
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">
                          {faqs.length > 0
                            ? Math.max(...faqs.map((f) => f.id))
                            : 0}
                        </div>
                        <div className="text-xs sm:text-sm text-blue-700">
                          Último ID
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FAQ List */}
                  <div className="space-y-4">
                    {faqs.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <div className="text-6xl mb-4">❓</div>
                        <h3 className="text-lg font-medium mb-2">
                          No hay FAQs
                        </h3>
                        <p>
                          Agrega tu primera pregunta frecuente para comenzar
                        </p>
                      </div>
                    ) : (
                      faqs.map((faq) => (
                        <FAQItem
                          key={faq.id}
                          faq={faq}
                          isEditing={editingFaq === faq.id}
                          onEdit={(id) => setEditingFaq(id)}
                          onSave={handleEditFaq}
                          onCancel={() => setEditingFaq(null)}
                          onDelete={handleDeleteFaq}
                        />
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Contact Info Section */}
              {activeTab === "contact" && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        Información de Contacto
                      </h2>
                      <p className="text-gray-600 mt-1 text-sm sm:text-base">
                        Gestiona la información de contacto de tu empresa
                      </p>
                    </div>
                    {contactInfo && !editingContact && (
                      <button
                        onClick={handleEditContact}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg flex items-center space-x-2 text-sm sm:text-base w-full sm:w-auto justify-center"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Editar</span>
                      </button>
                    )}
                  </div>

                  {editingContact ? (
                    <ContactEditForm />
                  ) : contactInfo ? (
                    <div className="space-y-6">
                      {/* Phone Section */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          📞 Teléfonos
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Teléfono para mostrar
                            </label>
                            <p className="text-gray-900 bg-gray-50 p-2 rounded text-sm sm:text-base">
                              {contactInfo.phone?.display}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              WhatsApp
                            </label>
                            <p className="text-gray-900 bg-gray-50 p-2 rounded text-sm sm:text-base">
                              {contactInfo.whatsapp?.number}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Email Section */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          📧 Emails
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email Principal
                            </label>
                            <p className="text-gray-900 bg-gray-50 p-2 rounded text-sm sm:text-base break-all">
                              {contactInfo.email?.primary}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email de Soporte
                            </label>
                            <p className="text-gray-900 bg-gray-50 p-2 rounded text-sm sm:text-base break-all">
                              {contactInfo.email?.support}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email de Reservas
                            </label>
                            <p className="text-gray-900 bg-gray-50 p-2 rounded text-sm sm:text-base break-all">
                              {contactInfo.email?.bookings}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Address Section */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          📍 Dirección
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Dirección Completa
                            </label>
                            <p className="text-gray-900 bg-gray-50 p-2 rounded">
                              {contactInfo.address?.full}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Ciudad
                            </label>
                            <p className="text-gray-900 bg-gray-50 p-2 rounded">
                              {contactInfo.address?.city},{" "}
                              {contactInfo.address?.province}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Business Hours */}
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          🕒 Horarios de Atención
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Lunes a Viernes
                            </label>
                            <p className="text-gray-900 bg-gray-50 p-2 rounded">
                              {contactInfo.businessHours?.weekdays?.days}:{" "}
                              {contactInfo.businessHours?.weekdays?.hours}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Fines de Semana
                            </label>
                            <p className="text-gray-900 bg-gray-50 p-2 rounded">
                              {contactInfo.businessHours?.weekends?.days}:{" "}
                              {contactInfo.businessHours?.weekends?.hours}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-6xl mb-4">📞</div>
                      <h3 className="text-lg font-medium mb-2">
                        No hay información de contacto
                      </h3>
                      <p>
                        La información de contacto aparecerá aquí una vez
                        migrada
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Packages Section */}
              {activeTab === "packages" && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        Paquetes de Aventuras
                      </h2>
                      <p className="text-gray-600 mt-1 text-sm sm:text-base">
                        Gestiona los paquetes de surf y snowboard
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() =>
                          setShowAddPackageForm(!showAddPackageForm)
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg flex items-center space-x-2 text-sm sm:text-base w-full sm:w-auto justify-center"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Agregar Paquete</span>
                      </button>
                    </div>
                  </div>

                  {/* Add Package Form */}
                  {showAddPackageForm && (
                    <AddPackageForm
                      newPackage={newPackage}
                      setNewPackage={setNewPackage}
                      handleAddPackage={handleAddPackage}
                      setShowAddPackageForm={setShowAddPackageForm}
                      loading={loading}
                    />
                  )}

                  <div className="space-y-8">
                    {/* Surf Packages */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        🏄‍♂️ Paquetes de Surf ({surfPackages.length})
                      </h3>
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                        {surfPackages.length === 0 ? (
                          <div className="col-span-full text-center py-12 text-gray-500">
                            <div className="text-4xl sm:text-6xl mb-4">🏄‍♂️</div>
                            <h3 className="text-base sm:text-lg font-medium mb-2">
                              No hay paquetes de surf
                            </h3>
                            <p className="text-sm sm:text-base">
                              Agrega tu primer paquete de surf para comenzar
                            </p>
                          </div>
                        ) : (
                          surfPackages.map((pkg, index) => (
                            <PackageItem
                              key={pkg.id + "surf" + index}
                              pkg={pkg}
                              type="surf"
                              isEditing={false} // Always false since we use modals now
                              onEdit={(id) =>
                                handleOpenBasicPackageEdit(id, "surf")
                              }
                              onSave={handleEditPackage}
                              onCancel={handleCloseBasicPackageEdit}
                              onEditDetails={(id) =>
                                handleEditPackageDetails(id, "surf")
                              }
                              onManageDateRanges={handleManageDateRanges}
                              onManageTripMembers={handleManageTripMembers}
                              onDelete={handleDeletePackage}
                              loading={loading}
                            />
                          ))
                        )}
                      </div>
                    </div>

                    {/* Snowboard Packages */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        🏂 Paquetes de Snowboard ({snowboardPackages.length})
                      </h3>
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                        {snowboardPackages.length === 0 ? (
                          <div className="col-span-full text-center py-12 text-gray-500">
                            <div className="text-4xl sm:text-6xl mb-4">🏂</div>
                            <h3 className="text-base sm:text-lg font-medium mb-2">
                              No hay paquetes de snowboard
                            </h3>
                            <p className="text-sm sm:text-base">
                              Agrega tu primer paquete de snowboard para
                              comenzar
                            </p>
                          </div>
                        ) : (
                          snowboardPackages.map((pkg, index) => (
                            <PackageItem
                              key={pkg.id + "snowboard" + index}
                              pkg={pkg}
                              type="snowboard"
                              isEditing={false} // Always false since we use modals now
                              onEdit={(id) =>
                                handleOpenBasicPackageEdit(id, "snowboard")
                              }
                              onSave={handleEditPackage}
                              onCancel={handleCloseBasicPackageEdit}
                              onEditDetails={(id) =>
                                handleEditPackageDetails(id, "snowboard")
                              }
                              onManageDateRanges={handleManageDateRanges}
                              onManageTripMembers={handleManageTripMembers}
                              onDelete={handleDeletePackage}
                              loading={loading}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Package Details Modal */}
                  <PackageDetailsModal
                    isOpen={packageDetailsModal.isOpen}
                    pkg={
                      packageDetailsModal.type === "surf"
                        ? surfPackages.find(
                            (p) => p.id === packageDetailsModal.packageId
                          )
                        : snowboardPackages.find(
                            (p) => p.id === packageDetailsModal.packageId
                          )
                    }
                    type={packageDetailsModal.type || ""}
                    packageDetailCategories={
                      packageDetailsModal.type === "surf"
                        ? surfInfo?.packageDetailCategories
                        : snowboardInfo?.packageDetailCategories
                    }
                    onSave={handleSavePackageDetails}
                    onCancel={handleCancelPackageDetailsEdit}
                    onToggleCategory={handleToggleCategory}
                    onDeleteCategory={handleDeleteCategory}
                    onAddCategory={handleAddCategory}
                    onUpdateCategoryFields={handleUpdateCategoryFields}
                    loading={loading}
                  />

                  {/* Date Range Modal */}
                  <DateRangeModal
                    isOpen={dateRangeModal.isOpen}
                    packageData={
                      dateRangeModal.type === "surf"
                        ? surfPackages.find(
                            (pkg) => pkg.id === dateRangeModal.packageId
                          )
                        : snowboardPackages.find(
                            (pkg) => pkg.id === dateRangeModal.packageId
                          )
                    }
                    type={dateRangeModal.type || ""}
                    onAddDateRange={handleAddDateRange}
                    onUpdateDateRange={handleUpdateDateRange}
                    onDeleteDateRange={handleDeleteDateRange}
                    onClose={() =>
                      setDateRangeModal({
                        isOpen: false,
                        packageId: null,
                        type: null,
                      })
                    }
                    loading={loading}
                  />

                  {/* Trip Member Modal */}
                  <TripMemberModal
                    isOpen={tripMemberModal.isOpen}
                    packageData={
                      tripMemberModal.type === "surf"
                        ? surfPackages.find(
                            (pkg) => pkg.id === tripMemberModal.packageId
                          )
                        : snowboardPackages.find(
                            (pkg) => pkg.id === tripMemberModal.packageId
                          )
                    }
                    type={tripMemberModal.type || ""}
                    onClose={() =>
                      setTripMemberModal({
                        isOpen: false,
                        packageId: null,
                        type: null,
                      })
                    }
                    loading={loading}
                    showMessage={showMessage}
                    onRefreshPackages={loadPackages}
                  />

                  {/* Basic Package Edit Modal */}
                  <BasicPackageEditModal
                    isOpen={basicPackageEditModal.isOpen}
                    pkg={
                      basicPackageEditModal.type === "surf"
                        ? surfPackages.find(
                            (p) => p.id === basicPackageEditModal.packageId
                          )
                        : snowboardPackages.find(
                            (p) => p.id === basicPackageEditModal.packageId
                          )
                    }
                    type={basicPackageEditModal.type || ""}
                    onSave={handleEditPackage}
                    onCancel={handleCloseBasicPackageEdit}
                    loading={loading}
                  />
                </div>
              )}

              {/* Sponsors Section */}
              {activeTab === "sponsors" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        Gestión de Patrocinadores
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Gestiona los patrocinadores y su información
                      </p>
                    </div>
                  </div>

                  <SponsorsEditor
                    sponsorsData={sponsorsData}
                    onUpdate={handleUpdateSponsors}
                    loading={loading}
                  />
                </div>
              )}

              {/* Reviews Section */}
              {activeTab === "reviews" && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        Reseñas de Clientes
                      </h2>
                      <p className="text-gray-600 mt-1 text-sm sm:text-base">
                        Gestiona las reseñas y testimonios de tus clientes
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddReviewForm(!showAddReviewForm)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg flex items-center space-x-2 text-sm sm:text-base w-full sm:w-auto justify-center"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Agregar Reseña</span>
                    </button>
                  </div>

                  {/* Add Review Form */}
                  {showAddReviewForm && (
                    <AddReviewForm
                      newReview={newReview}
                      setNewReview={setNewReview}
                      handleAddReview={handleAddReview}
                      setShowAddReviewForm={setShowAddReviewForm}
                      loading={loading}
                    />
                  )}

                  {/* Reviews Stats */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {reviews.length}
                        </div>
                        <div className="text-sm text-yellow-700">
                          Total Reseñas
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {reviews.length > 0
                            ? (
                                reviews.reduce((sum, r) => sum + r.rating, 0) /
                                reviews.length
                              ).toFixed(1)
                            : "0"}
                        </div>
                        <div className="text-sm text-yellow-700">
                          Promedio ⭐
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <div className="text-6xl mb-4">⭐</div>
                        <h3 className="text-lg font-medium mb-2">
                          No hay reseñas
                        </h3>
                        <p>
                          Las reseñas de clientes aparecerán aquí una vez
                          migradas
                        </p>
                      </div>
                    ) : (
                      reviews.map((review) => (
                        <ReviewItem
                          key={review.id}
                          review={review}
                          isEditing={editingReview === review.id}
                          onEdit={(id) => setEditingReview(id)}
                          onSave={handleEditReview}
                          onCancel={() => setEditingReview(null)}
                          onDelete={handleDeleteReview}
                          loading={loading}
                        />
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Gallery Section */}
              {activeTab === "gallery" && (
                <div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                        Galería de Imágenes
                      </h2>
                      <p className="text-gray-600 mt-1 text-sm sm:text-base">
                        Gestiona las imágenes de tu galería
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddImageForm(!showAddImageForm)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 rounded-lg flex items-center space-x-2 text-sm sm:text-base w-full sm:w-auto justify-center"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Agregar Imagen</span>
                    </button>
                  </div>

                  {/* Add Image Form */}
                  {showAddImageForm && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Subir Nueva Imagen
                      </h3>
                      <CloudinaryUploadForm
                        onUploadSuccess={handleCloudinaryUploadSuccess}
                        onUploadError={handleCloudinaryUploadError}
                        onCancel={() => setShowAddImageForm(false)}
                      />
                    </div>
                  )}

                  {/* Gallery Stats */}
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center sm:justify-start space-x-4 sm:space-x-6">
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-purple-600">
                          {galleryImages.length}
                        </div>
                        <div className="text-xs sm:text-sm text-purple-700">
                          Total Imágenes
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-purple-600">
                          {
                            galleryImages.filter(
                              (img) => img.category === "Surf"
                            ).length
                          }
                        </div>
                        <div className="text-xs sm:text-sm text-purple-700">
                          Surf
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-purple-600">
                          {
                            galleryImages.filter(
                              (img) => img.category === "Snowboard"
                            ).length
                          }
                        </div>
                        <div className="text-xs sm:text-sm text-purple-700">
                          Snowboard
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {galleryImages.length === 0 ? (
                      <div className="col-span-full text-center py-12 text-gray-500">
                        <div className="text-4xl sm:text-6xl mb-4">📸</div>
                        <h3 className="text-base sm:text-lg font-medium mb-2">
                          No hay imágenes
                        </h3>
                        <p>
                          Las imágenes de la galería aparecerán aquí una vez
                          migradas
                        </p>
                      </div>
                    ) : (
                      galleryImages.map((image) => (
                        <ImageItem
                          key={image.id}
                          image={image}
                          isEditing={editingImage === image.id}
                          onEdit={(id) => setEditingImage(id)}
                          onSave={handleEditImage}
                          onCancel={() => setEditingImage(null)}
                          onDelete={handleDeleteImage}
                          loading={loading}
                        />
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Hero Images Section */}
              {activeTab === "hero" && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Imágenes Hero
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Gestiona las imágenes de fondo de las secciones hero
                    </p>
                  </div>

                  {/* Main Page Hero */}
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="mr-2">🏠</span>
                      Página Principal
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Primary Image */}
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">
                          Imagen Principal
                        </h4>
                        {heroImages.main?.primary?.src ? (
                          <div className="relative">
                            <img
                              src={heroImages.main.primary.src}
                              alt={heroImages.main.primary.alt}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <div className="mt-2 text-sm text-gray-600">
                              {heroImages.main.primary.alt}
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                            Sin imagen
                          </div>
                        )}
                        <div className="mt-4">
                          <HeroImageUploadButton
                            page="main"
                            type="primary"
                            onUpload={handleHeroImageUpload}
                            uploading={uploadingHero === "main-primary"}
                          />
                        </div>
                      </div>

                      {/* Fallback Image */}
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">
                          Imagen de Respaldo
                        </h4>
                        {heroImages.main?.fallback?.src ? (
                          <div className="relative">
                            <img
                              src={heroImages.main.fallback.src}
                              alt={heroImages.main.fallback.alt}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <div className="mt-2 text-sm text-gray-600">
                              {heroImages.main.fallback.alt}
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                            Sin imagen
                          </div>
                        )}
                        <div className="mt-4">
                          <HeroImageUploadButton
                            page="main"
                            type="fallback"
                            onUpload={handleHeroImageUpload}
                            uploading={uploadingHero === "main-fallback"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Snowboard Page Hero */}
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="mr-2">🏂</span>
                      Página de Snowboard
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Primary Image */}
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">
                          Imagen Principal
                        </h4>
                        {heroImages.snowboard?.primary?.src ? (
                          <div className="relative">
                            <img
                              src={heroImages.snowboard.primary.src}
                              alt={heroImages.snowboard.primary.alt}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <div className="mt-2 text-sm text-gray-600">
                              {heroImages.snowboard.primary.alt}
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                            Sin imagen
                          </div>
                        )}
                        <div className="mt-4">
                          <HeroImageUploadButton
                            page="snowboard"
                            type="primary"
                            onUpload={handleHeroImageUpload}
                            uploading={uploadingHero === "snowboard-primary"}
                          />
                        </div>
                      </div>

                      {/* Fallback Image */}
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">
                          Imagen de Respaldo
                        </h4>
                        {heroImages.snowboard?.fallback?.src ? (
                          <div className="relative">
                            <img
                              src={heroImages.snowboard.fallback.src}
                              alt={heroImages.snowboard.fallback.alt}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <div className="mt-2 text-sm text-gray-600">
                              {heroImages.snowboard.fallback.alt}
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                            Sin imagen
                          </div>
                        )}
                        <div className="mt-4">
                          <HeroImageUploadButton
                            page="snowboard"
                            type="fallback"
                            onUpload={handleHeroImageUpload}
                            uploading={uploadingHero === "snowboard-fallback"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Surf Page Hero */}
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="mr-2">🏄</span>
                      Página de Surf
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Primary Image */}
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">
                          Imagen Principal
                        </h4>
                        {heroImages.surf?.primary?.src ? (
                          <div className="relative">
                            <img
                              src={heroImages.surf.primary.src}
                              alt={heroImages.surf.primary.alt}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <div className="mt-2 text-sm text-gray-600">
                              {heroImages.surf.primary.alt}
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                            Sin imagen
                          </div>
                        )}
                        <div className="mt-4">
                          <HeroImageUploadButton
                            page="surf"
                            type="primary"
                            onUpload={handleHeroImageUpload}
                            uploading={uploadingHero === "surf-primary"}
                          />
                        </div>
                      </div>

                      {/* Fallback Image */}
                      <div>
                        <h4 className="font-medium text-gray-700 mb-3">
                          Imagen de Respaldo
                        </h4>
                        {heroImages.surf?.fallback?.src ? (
                          <div className="relative">
                            <img
                              src={heroImages.surf.fallback.src}
                              alt={heroImages.surf.fallback.alt}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <div className="mt-2 text-sm text-gray-600">
                              {heroImages.surf.fallback.alt}
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                            Sin imagen
                          </div>
                        )}
                        <div className="mt-4">
                          <HeroImageUploadButton
                            page="surf"
                            type="fallback"
                            onUpload={handleHeroImageUpload}
                            uploading={uploadingHero === "surf-fallback"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Videos Section */}
              {activeTab === "videos" && (
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Gestión de Videos
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Administra los videos de snowboard y surf que se muestran
                      en las páginas
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Snowboard Videos */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Videos de Snowboard
                        </h3>
                        <button
                          onClick={() =>
                            setShowVideoUploadForm({
                              show: true,
                              type: "snowboard",
                            })
                          }
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Subir Video
                        </button>
                      </div>

                      {snowboardVideos.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No hay videos de snowboard
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {snowboardVideos.map((video) => (
                            <VideoItem
                              key={video.id}
                              video={video}
                              onSetActive={() =>
                                handleSetActiveVideo(video.id, "snowboard")
                              }
                              onDelete={() =>
                                handleDeleteVideo(
                                  video.id,
                                  "snowboard",
                                  video.publicId
                                )
                              }
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Surf Videos */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Videos de Surf
                        </h3>
                        <button
                          onClick={() =>
                            setShowVideoUploadForm({ show: true, type: "surf" })
                          }
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Subir Video
                        </button>
                      </div>

                      {surfVideos.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No hay videos de surf
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {surfVideos.map((video) => (
                            <VideoItem
                              key={video.id}
                              video={video}
                              onSetActive={() =>
                                handleSetActiveVideo(video.id, "surf")
                              }
                              onDelete={() =>
                                handleDeleteVideo(
                                  video.id,
                                  "surf",
                                  video.publicId
                                )
                              }
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Video Upload Modal */}
                  {showVideoUploadForm.show && showVideoUploadForm.type && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-gray-900">
                              Subir Video de{" "}
                              {showVideoUploadForm.type === "snowboard"
                                ? "Snowboard"
                                : "Surf"}
                            </h3>
                            <button
                              onClick={() =>
                                setShowVideoUploadForm({
                                  show: false,
                                  type: null,
                                })
                              }
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-6 h-6" />
                            </button>
                          </div>

                          <VideoUploadForm
                            onUploadSuccess={handleVideoUploadSuccess}
                            onUploadError={handleVideoUploadError}
                            onCancel={() =>
                              setShowVideoUploadForm({
                                show: false,
                                type: null,
                              })
                            }
                            videoType={showVideoUploadForm.type}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Hero Image Upload Button Component
const HeroImageUploadButton = ({
  page,
  type,
  onUpload,
  uploading,
}: {
  page: string;
  type: string;
  onUpload: (page: string, type: string, uploadResult: any) => void;
  uploading: boolean;
}) => {
  const [showUploadForm, setShowUploadForm] = useState(false);

  const handleUploadSuccess = (uploadResult: any) => {
    onUpload(page, type, uploadResult);
    setShowUploadForm(false);
  };

  return (
    <div>
      {!showUploadForm ? (
        <button
          onClick={() => setShowUploadForm(true)}
          disabled={uploading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Subiendo..." : "Cambiar Imagen"}
        </button>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <CloudinaryUploadForm
            onUploadSuccess={handleUploadSuccess}
            onUploadError={(error) => {
              console.error("Upload error:", error);
              alert("Error al subir imagen: " + error.message);
            }}
            onCancel={() => setShowUploadForm(false)}
          />
        </div>
      )}
    </div>
  );
};

// Video Item Component
interface VideoItemProps {
  video: VideoData;
  onSetActive: () => void;
  onDelete: () => void;
}

const VideoItem: React.FC<VideoItemProps> = ({
  video,
  onSetActive,
  onDelete,
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={`border rounded-lg p-4 ${
        video.isActive ? "border-green-500 bg-green-50" : "border-gray-200"
      }`}
    >
      <div className="flex items-start space-x-4">
        {/* Video Thumbnail */}
        <div className="flex-shrink-0">
          <video
            src={video.url}
            className="w-24 h-16 object-cover rounded"
            muted
            preload="metadata"
          />
        </div>

        {/* Video Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {video.title}
            </h4>
            {video.isActive && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Activo
              </span>
            )}
          </div>

          {video.description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {video.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            {video.duration && <span>{formatDuration(video.duration)}</span>}
            {video.size && <span>{formatFileSize(video.size)}</span>}
            {video.format && <span>{video.format.toUpperCase()}</span>}
            {video.width && video.height && (
              <span>
                {video.width}x{video.height}
              </span>
            )}
          </div>

          <div className="text-xs text-gray-400 mt-1">
            Subido: {new Date(video.uploadedAt).toLocaleDateString()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-2">
          {!video.isActive && (
            <button
              onClick={onSetActive}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Activar
            </button>
          )}

          <button
            onClick={onDelete}
            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
