// Firebase service for data operations
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  QuerySnapshot,
  DocumentSnapshot,
  Unsubscribe,
  DocumentData,
} from "firebase/firestore";
import { db } from "../config/firebase";
import type {
  ContactInfo,
  Package,
  HeroContent,
  NavigationData,
  TripInfo,
  Review,
  GalleryImage,
  FAQItem,
  SponsorsData,
  TripMember,
} from "../types";

// Video interface
export interface VideoData {
  id: string;
  url: string;
  title: string;
  description?: string;
  type: "snowboard" | "surf";
  publicId: string;
  width?: number;
  height?: number;
  duration?: number;
  size?: number;
  format?: string;
  uploadedAt: string;
  isActive: boolean;
}

// Collection names
export const COLLECTIONS = {
  CONTACT_INFO: "contactInfo",
  SURF_PACKAGES: "surfPackages",
  SNOWBOARD_PACKAGES: "snowboardPackages",
  SURF_INFO: "surfInfo",
  SNOWBOARD_INFO: "snowboardInfo",
  HERO_CONTENT: "heroContent",
  NAVIGATION: "navigation",
  ABOUT_FEATURES: "aboutFeatures",
  FAQ_DATA: "faqData",
  GALLERY_IMAGES: "galleryImages",
  REVIEWS_DATA: "reviewsData",
  PACKAGE_OPTIONS: "packageOptions",
  SPONSORS_DATA: "sponsorsData",
  TRIP_MEMBERS: "tripMembers",
  SURF_VIDEOS: "surfVideos",
  SNOWBOARD_VIDEOS: "snowboardVideos",
} as const;

// Type for collection names
export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

// Generic document type with ID
export interface FirebaseDocument {
  id: string;
  [key: string]: any;
}

// Date range interface for packages
export interface PackageDateRange {
  id: string;
  startDate: string;
  endDate: string;
  available: boolean;
  maxParticipants: number;
  currentParticipants: number;
  notes: string;
  availableSpots: number;
  totalSpots: number;
}

// Trip member data interface
export interface TripMemberData {
  name: string;
  phone: string;
  email?: string;
  packageId: string;
  packageName: string;
  packageType: "surf" | "snowboard";
  dateRangeId: number;
  startDate: string;
  endDate: string;
  totalAmount: number;
  amountPaid?: number;
  notes?: string;
}

// Trip member stats interface
export interface TripMemberStats {
  totalMembers: number;
  totalRevenue: number;
  totalPaid: number;
  pendingPayment: number;
  fullyPaidMembers: number;
  pendingPaymentMembers: number;
}

// Generic CRUD operations
export class FirebaseService {
  // Get all documents from a collection
  static async getCollection<T = FirebaseDocument>(
    collectionName: string
  ): Promise<T[]> {
    try {
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
        collection(db, collectionName)
      );
      const documents: T[] = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() } as T);
      });
      return documents;
    } catch (error) {
      console.error(`Error getting collection ${collectionName}:`, error);
      throw error;
    }
  }

  // Get a single document
  static async getDocument<T = FirebaseDocument>(
    collectionName: string,
    docId: string
  ): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap: DocumentSnapshot<DocumentData> = await getDoc(docRef);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      } else {
        console.log(`No document found with ID: ${docId}`);
        return null;
      }
    } catch (error) {
      console.error(`Error getting document ${docId}:`, error);
      throw error;
    }
  }

  // Create or update a document
  static async setDocument<T = FirebaseDocument>(
    collectionName: string,
    docId: string,
    data: Partial<T>
  ): Promise<T> {
    try {
      console.log(
        `FirebaseService: Setting document ${docId} in collection ${collectionName}`,
        data
      );
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, data, { merge: true });
      console.log(`FirebaseService: Successfully saved document ${docId}`);
      return { id: docId, ...data } as T;
    } catch (error) {
      console.error(`Error setting document ${docId}:`, error);
      throw error;
    }
  }

  // Update a document
  static async updateDocument<T = FirebaseDocument>(
    collectionName: string,
    docId: string,
    data: Partial<T>
  ): Promise<T> {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, data);
      return { id: docId, ...data } as T;
    } catch (error) {
      console.error(`Error updating document ${docId}:`, error);
      throw error;
    }
  }

  // Delete a document
  static async deleteDocument(
    collectionName: string,
    docId: string
  ): Promise<string> {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return docId;
    } catch (error) {
      console.error(`Error deleting document ${docId}:`, error);
      throw error;
    }
  }

  // Real-time listener for a collection
  static subscribeToCollection<T = FirebaseDocument>(
    collectionName: string,
    callback: (documents: T[]) => void
  ): Unsubscribe {
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const documents: T[] = [];
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() } as T);
        });
        callback(documents);
      },
      (error) => {
        console.error(
          `Error listening to collection ${collectionName}:`,
          error
        );
      }
    );
    return unsubscribe;
  }

  // Real-time listener for a document
  static subscribeToDocument<T = FirebaseDocument>(
    collectionName: string,
    docId: string,
    callback: (document: T | null) => void
  ): Unsubscribe {
    const unsubscribe = onSnapshot(
      doc(db, collectionName, docId),
      (doc: DocumentSnapshot<DocumentData>) => {
        if (doc.exists()) {
          callback({ id: doc.id, ...doc.data() } as T);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error(`Error listening to document ${docId}:`, error);
      }
    );
    return unsubscribe;
  }
}

// Specific service methods for each data type
export const ContactService = {
  async getContactInfo(): Promise<ContactInfo | null> {
    return await FirebaseService.getDocument<ContactInfo>(
      COLLECTIONS.CONTACT_INFO,
      "main"
    );
  },

  async updateContactInfo(data: Partial<ContactInfo>): Promise<ContactInfo> {
    return await FirebaseService.setDocument<ContactInfo>(
      COLLECTIONS.CONTACT_INFO,
      "main",
      data
    );
  },
};

export const PackageService = {
  async getSurfPackages(): Promise<Package[]> {
    return await FirebaseService.getCollection<Package>(
      COLLECTIONS.SURF_PACKAGES
    );
  },

  async getSnowboardPackages(): Promise<Package[]> {
    return await FirebaseService.getCollection<Package>(
      COLLECTIONS.SNOWBOARD_PACKAGES
    );
  },

  async getFeaturedSurfPackage(): Promise<Package | null> {
    const packages = await this.getSurfPackages();
    return packages.find((pkg) => pkg.featured) || packages[0] || null;
  },

  async getFeaturedSnowboardPackage(): Promise<Package | null> {
    const packages = await this.getSnowboardPackages();
    return packages.find((pkg) => pkg.featured) || packages[0] || null;
  },

  // Date range management methods
  async addDateRange(
    packageId: string,
    type: "surf" | "snowboard",
    dateRange: Omit<PackageDateRange, "id">
  ): Promise<Package> {
    const collectionName =
      type === "surf"
        ? COLLECTIONS.SURF_PACKAGES
        : COLLECTIONS.SNOWBOARD_PACKAGES;
    const pkg = await FirebaseService.getDocument<Package>(
      collectionName,
      packageId.toString()
    );

    if (!pkg) {
      throw new Error("Package not found");
    }

    // Initialize dateRanges array if it doesn't exist
    const dateRanges = (pkg.dateRanges as PackageDateRange[]) || [];

    // Generate new ID for the date range
    const newId =
      dateRanges.length > 0
        ? Math.max(...dateRanges.map((dr) => parseInt(dr.id.toString()))) + 1
        : 1;

    const newDateRange: PackageDateRange = {
      id: newId.toString(),
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      available: dateRange.available !== undefined ? dateRange.available : true,
      maxParticipants: dateRange.maxParticipants || 0,
      currentParticipants: dateRange.currentParticipants || 0,
      notes: dateRange.notes || "",
      availableSpots:
        (dateRange.maxParticipants || 0) - (dateRange.currentParticipants || 0),
      totalSpots: dateRange.maxParticipants || 0,
    };

    const updatedPackage = {
      ...pkg,
      dateRanges: [...dateRanges, newDateRange] as PackageDateRange[],
    };

    return await FirebaseService.setDocument<Package>(
      collectionName,
      packageId.toString(),
      updatedPackage
    );
  },

  async updateDateRange(
    packageId: string,
    type: "surf" | "snowboard",
    dateRangeId: string,
    updatedDateRange: Partial<PackageDateRange>
  ): Promise<Package> {
    const collectionName =
      type === "surf"
        ? COLLECTIONS.SURF_PACKAGES
        : COLLECTIONS.SNOWBOARD_PACKAGES;
    const pkg = await FirebaseService.getDocument<Package>(
      collectionName,
      packageId.toString()
    );

    if (!pkg || !pkg.dateRanges) {
      throw new Error("Package or date ranges not found");
    }

    const updatedDateRanges = (pkg.dateRanges as PackageDateRange[]).map((dr) =>
      dr.id === dateRangeId
        ? { ...dr, ...updatedDateRange, id: dateRangeId }
        : dr
    );

    const updatedPackage = {
      ...pkg,
      dateRanges: updatedDateRanges,
    };

    return await FirebaseService.setDocument<Package>(
      collectionName,
      packageId.toString(),
      updatedPackage
    );
  },

  async deleteDateRange(
    packageId: string,
    type: "surf" | "snowboard",
    dateRangeId: string
  ): Promise<Package> {
    const collectionName =
      type === "surf"
        ? COLLECTIONS.SURF_PACKAGES
        : COLLECTIONS.SNOWBOARD_PACKAGES;
    const pkg = await FirebaseService.getDocument<Package>(
      collectionName,
      packageId.toString()
    );

    if (!pkg || !pkg.dateRanges) {
      throw new Error("Package or date ranges not found");
    }

    const updatedDateRanges = (pkg.dateRanges as PackageDateRange[]).filter(
      (dr) => dr.id !== dateRangeId
    );

    const updatedPackage = {
      ...pkg,
      dateRanges: updatedDateRanges,
    };

    return await FirebaseService.setDocument<Package>(
      collectionName,
      packageId.toString(),
      updatedPackage
    );
  },

  async getAvailableDateRanges(
    packageId: string,
    type: "surf" | "snowboard"
  ): Promise<PackageDateRange[]> {
    const collectionName =
      type === "surf"
        ? COLLECTIONS.SURF_PACKAGES
        : COLLECTIONS.SNOWBOARD_PACKAGES;
    const pkg = await FirebaseService.getDocument<Package>(
      collectionName,
      packageId.toString()
    );

    if (!pkg || !pkg.dateRanges) {
      return [];
    }

    // Return only available date ranges that haven't passed
    const now = new Date();
    return (pkg.dateRanges as PackageDateRange[])
      .filter((dr) => {
        const endDate = new Date(dr.endDate);
        return dr.available && endDate >= now;
      })
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      );
  },

  // Update current participants count for a date range
  async updateParticipantCount(
    packageId: string,
    type: "surf" | "snowboard",
    dateRangeId: string,
    count: number
  ): Promise<Package> {
    const collectionName =
      type === "surf"
        ? COLLECTIONS.SURF_PACKAGES
        : COLLECTIONS.SNOWBOARD_PACKAGES;
    const pkg = await FirebaseService.getDocument<Package>(
      collectionName,
      packageId.toString()
    );

    if (!pkg || !pkg.dateRanges) {
      throw new Error("Package or date ranges not found");
    }

    const updatedDateRanges = (pkg.dateRanges as PackageDateRange[]).map((dr) =>
      dr.id === dateRangeId ? { ...dr, currentParticipants: count } : dr
    );

    const updatedPackage = {
      ...pkg,
      dateRanges: updatedDateRanges,
    };

    return await FirebaseService.setDocument<Package>(
      collectionName,
      packageId.toString(),
      updatedPackage
    );
  },
};

// Trip Member Service for managing trip participants
export const TripMemberService = {
  // Add a new member to a trip
  async addMember(memberData: TripMemberData): Promise<TripMember> {
    const newMember: TripMember = {
      id: Date.now().toString(), // Simple ID generation
      name: memberData.name,
      phone: memberData.phone,
      hasPaid: (memberData.amountPaid || 0) >= memberData.totalAmount,
      packageId: memberData.packageId,
      dateRangeId: memberData.dateRangeId.toString(),
      adventureType: memberData.packageType,
      registrationDate: new Date().toISOString(),
    };

    await FirebaseService.setDocument<TripMember>(
      COLLECTIONS.TRIP_MEMBERS,
      newMember.id,
      newMember
    );

    // Update participant count in the package
    await this.updateParticipantCount(
      memberData.packageId,
      memberData.packageType,
      memberData.dateRangeId.toString()
    );

    return newMember;
  },

  // Get all members for a specific trip/date range
  async getMembersByDateRange(
    packageId: string,
    dateRangeId: string
  ): Promise<TripMember[]> {
    const allMembers = await FirebaseService.getCollection<TripMember>(
      COLLECTIONS.TRIP_MEMBERS
    );
    return allMembers.filter(
      (member) =>
        member.packageId === packageId &&
        member.dateRangeId === dateRangeId.toString()
    );
  },

  // Get all members for a package (all date ranges)
  async getMembersByPackage(packageId: string): Promise<TripMember[]> {
    const allMembers = await FirebaseService.getCollection<TripMember>(
      COLLECTIONS.TRIP_MEMBERS
    );
    return allMembers.filter((member) => member.packageId === packageId);
  },

  // Update member information
  async updateMember(
    memberId: string,
    updates: Partial<TripMember>
  ): Promise<TripMember> {
    const member = await FirebaseService.getDocument<TripMember>(
      COLLECTIONS.TRIP_MEMBERS,
      memberId
    );
    if (!member) {
      throw new Error("Member not found");
    }

    const updatedMember = {
      ...member,
      ...updates,
    };

    await FirebaseService.setDocument<TripMember>(
      COLLECTIONS.TRIP_MEMBERS,
      memberId,
      updatedMember
    );

    return updatedMember;
  },

  // Delete/Cancel a member
  async deleteMember(memberId: string): Promise<boolean> {
    const member = await FirebaseService.getDocument<TripMember>(
      COLLECTIONS.TRIP_MEMBERS,
      memberId
    );
    if (!member) {
      throw new Error("Member not found");
    }

    // Delete the member document
    await FirebaseService.deleteDocument(COLLECTIONS.TRIP_MEMBERS, memberId);

    // Update participant count
    await this.updateParticipantCount(
      member.packageId,
      member.adventureType,
      member.dateRangeId
    );

    return true;
  },

  // Update participant count for a date range
  async updateParticipantCount(
    packageId: string,
    packageType: "surf" | "snowboard",
    dateRangeId: string
  ): Promise<number> {
    const activeMembers = await this.getMembersByDateRange(
      packageId,
      dateRangeId
    );
    const count = activeMembers.length;

    // Update the count in the package's date range
    await PackageService.updateParticipantCount(
      packageId,
      packageType,
      dateRangeId,
      count
    );

    return count;
  },

  // Get member statistics
  async getMemberStats(
    packageId: string,
    dateRangeId: string | null = null
  ): Promise<TripMemberStats> {
    const members = dateRangeId
      ? await this.getMembersByDateRange(packageId, dateRangeId)
      : await this.getMembersByPackage(packageId);

    const totalMembers = members.length;
    const fullyPaidMembers = members.filter((member) => member.hasPaid).length;

    return {
      totalMembers,
      totalRevenue: 0, // This would need to be calculated based on package prices
      totalPaid: 0, // This would need to be calculated based on payment records
      pendingPayment: 0, // This would need to be calculated
      fullyPaidMembers,
      pendingPaymentMembers: totalMembers - fullyPaidMembers,
    };
  },
};

export const ContentService = {
  async getHeroContent(): Promise<HeroContent | null> {
    return await FirebaseService.getDocument<HeroContent>(
      COLLECTIONS.HERO_CONTENT,
      "main"
    );
  },

  async getNavigationData(): Promise<NavigationData | null> {
    return await FirebaseService.getDocument<NavigationData>(
      COLLECTIONS.NAVIGATION,
      "main"
    );
  },

  async getSurfInfo(): Promise<TripInfo | null> {
    return await FirebaseService.getDocument<TripInfo>(
      COLLECTIONS.SURF_INFO,
      "main"
    );
  },

  async getSnowboardInfo(): Promise<TripInfo | null> {
    return await FirebaseService.getDocument<TripInfo>(
      COLLECTIONS.SNOWBOARD_INFO,
      "main"
    );
  },
};

export const ReviewsService = {
  async getReviews(): Promise<Review[]> {
    return await FirebaseService.getCollection<Review>(
      COLLECTIONS.REVIEWS_DATA
    );
  },
};

export const GalleryService = {
  async getGalleryImages(): Promise<GalleryImage[]> {
    return await FirebaseService.getCollection<GalleryImage>(
      COLLECTIONS.GALLERY_IMAGES
    );
  },
};

export const FAQService = {
  async getFAQData(): Promise<FAQItem[]> {
    return await FirebaseService.getCollection<FAQItem>(COLLECTIONS.FAQ_DATA);
  },
};

export const SponsorsService = {
  async getSponsorsData(): Promise<SponsorsData | null> {
    return await FirebaseService.getDocument<SponsorsData>(
      COLLECTIONS.SPONSORS_DATA,
      "main"
    );
  },

  async updateSponsorsData(data: Partial<SponsorsData>): Promise<SponsorsData> {
    return await FirebaseService.setDocument<SponsorsData>(
      COLLECTIONS.SPONSORS_DATA,
      "main",
      data
    );
  },
};

export const VideoService = {
  // Get all videos for a specific type
  async getVideosByType(type: "snowboard" | "surf"): Promise<VideoData[]> {
    const collectionName =
      type === "surf" ? COLLECTIONS.SURF_VIDEOS : COLLECTIONS.SNOWBOARD_VIDEOS;
    return await FirebaseService.getCollection<VideoData>(collectionName);
  },

  // Get active video for a specific type (the one currently being used)
  async getActiveVideo(type: "snowboard" | "surf"): Promise<VideoData | null> {
    const videos = await this.getVideosByType(type);
    return videos.find((video) => video.isActive) || null;
  },

  // Add a new video
  async addVideo(
    videoData: Omit<VideoData, "id" | "uploadedAt">
  ): Promise<VideoData> {
    const collectionName =
      videoData.type === "surf"
        ? COLLECTIONS.SURF_VIDEOS
        : COLLECTIONS.SNOWBOARD_VIDEOS;

    // Generate a unique ID
    const videoId = `video_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const newVideo: VideoData = {
      ...videoData,
      id: videoId,
      uploadedAt: new Date().toISOString(),
    };

    await FirebaseService.setDocument<VideoData>(
      collectionName,
      videoId,
      newVideo
    );
    return newVideo;
  },

  // Set a video as active (and deactivate others)
  async setActiveVideo(
    videoId: string,
    type: "snowboard" | "surf"
  ): Promise<void> {
    const collectionName =
      type === "surf" ? COLLECTIONS.SURF_VIDEOS : COLLECTIONS.SNOWBOARD_VIDEOS;
    const videos = await this.getVideosByType(type);

    // Deactivate all videos first
    const updatePromises = videos.map((video) =>
      FirebaseService.updateDocument<VideoData>(collectionName, video.id, {
        isActive: false,
      })
    );

    // Activate the selected video
    updatePromises.push(
      FirebaseService.updateDocument<VideoData>(collectionName, videoId, {
        isActive: true,
      })
    );

    await Promise.all(updatePromises);
  },

  // Update video metadata
  async updateVideo(
    videoId: string,
    type: "snowboard" | "surf",
    updates: Partial<VideoData>
  ): Promise<VideoData> {
    const collectionName =
      type === "surf" ? COLLECTIONS.SURF_VIDEOS : COLLECTIONS.SNOWBOARD_VIDEOS;
    return await FirebaseService.updateDocument<VideoData>(
      collectionName,
      videoId,
      updates
    );
  },

  // Delete a video
  async deleteVideo(
    videoId: string,
    type: "snowboard" | "surf"
  ): Promise<void> {
    const collectionName =
      type === "surf" ? COLLECTIONS.SURF_VIDEOS : COLLECTIONS.SNOWBOARD_VIDEOS;
    await FirebaseService.deleteDocument(collectionName, videoId);
  },

  // Get video by ID
  async getVideoById(
    videoId: string,
    type: "snowboard" | "surf"
  ): Promise<VideoData | null> {
    const collectionName =
      type === "surf" ? COLLECTIONS.SURF_VIDEOS : COLLECTIONS.SNOWBOARD_VIDEOS;
    return await FirebaseService.getDocument<VideoData>(
      collectionName,
      videoId
    );
  },
};
