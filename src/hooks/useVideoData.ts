// Hook for fetching video data from Firebase
import { useState, useEffect } from 'react';
import { VideoService, VideoData } from '../services/firebaseService';
import { SNOWBOARD_PAGE_CONSTANTS } from '../constants/snowboardPageConstants';
import { SURF_PAGE_CONSTANTS } from '../constants/surfPageConstants';

interface VideoUrls {
  snowboard: string;
  surf: string;
}

interface UseVideoDataReturn {
  videoUrls: VideoUrls;
  loading: boolean;
  error: string | null;
  snowboardVideo: VideoData | null;
  surfVideo: VideoData | null;
}

export const useVideoData = (): UseVideoDataReturn => {
  const [videoUrls, setVideoUrls] = useState<VideoUrls>({
    snowboard: SNOWBOARD_PAGE_CONSTANTS.assets.videos.snowboard,
    surf: SURF_PAGE_CONSTANTS.assets.videos.surf,
  });
  const [snowboardVideo, setSnowboardVideo] = useState<VideoData | null>(null);
  const [surfVideo, setSurfVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch active videos for both types
        const [activeSnowboardVideo, activeSurfVideo] = await Promise.all([
          VideoService.getActiveVideo('snowboard'),
          VideoService.getActiveVideo('surf'),
        ]);

        // Update state with video data
        setSnowboardVideo(activeSnowboardVideo);
        setSurfVideo(activeSurfVideo);

        // Update video URLs - use Firebase URLs if available, otherwise fallback to constants
        setVideoUrls({
          snowboard: activeSnowboardVideo?.url || SNOWBOARD_PAGE_CONSTANTS.assets.videos.snowboard,
          surf: activeSurfVideo?.url || SURF_PAGE_CONSTANTS.assets.videos.surf,
        });

      } catch (err: any) {
        console.error('Error fetching video data:', err);
        setError(err.message || 'Error loading video data');
        
        // Fallback to constants on error
        setVideoUrls({
          snowboard: SNOWBOARD_PAGE_CONSTANTS.assets.videos.snowboard,
          surf: SURF_PAGE_CONSTANTS.assets.videos.surf,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, []);

  return {
    videoUrls,
    loading,
    error,
    snowboardVideo,
    surfVideo,
  };
};

// Hook for getting a specific video type
export const useVideoByType = (type: 'snowboard' | 'surf') => {
  const [video, setVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const activeVideo = await VideoService.getActiveVideo(type);
        setVideo(activeVideo);
        
      } catch (err: any) {
        console.error(`Error fetching ${type} video:`, err);
        setError(err.message || `Error loading ${type} video`);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [type]);

  // Get fallback URL from constants
  const getFallbackUrl = () => {
    return type === 'snowboard' 
      ? SNOWBOARD_PAGE_CONSTANTS.assets.videos.snowboard
      : SURF_PAGE_CONSTANTS.assets.videos.surf;
  };

  return {
    video,
    videoUrl: video?.url || getFallbackUrl(),
    loading,
    error,
  };
};

export default useVideoData;
