import { Video } from '../types';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY?.trim();

const extractVideoId = (url: string): string => {
  if (!url) {
    throw new Error('Please provide a YouTube URL');
  }

  // Match patterns for both YouTube and YouTube Music:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://youtube.com/shorts/VIDEO_ID
  // - https://music.youtube.com/watch?v=VIDEO_ID
  const videoRegex = /(?:(?:youtube\.com|music\.youtube\.com)\/(?:watch\?v=|shorts\/)|youtu\.be\/)([^&?\/]+)/;
  const match = url.match(videoRegex);
  
  if (match) {
    return match[1];
  }
  
  return '';
};

const extractPlaylistId = (url: string): string => {
  if (!url) {
    throw new Error('Please provide a YouTube URL');
  }

  // Match both regular and radio/mix playlists:
  // - https://www.youtube.com/playlist?list=PLAYLIST_ID
  // - https://music.youtube.com/playlist?list=PLAYLIST_ID
  // - https://music.youtube.com/playlist?list=RDCLAK...
  const playlistRegex = /[?&]list=([^&]+)/;
  const match = url.match(playlistRegex);
  
  if (match) {
    return match[1];
  }
  
  return '';
};

const fetchVideoDetails = async (videoId: string): Promise<Video[]> => {
  if (!API_KEY) {
    throw new Error('YouTube API key is not configured');
  }

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${API_KEY}`
  );

  if (!response.ok) {
    const error = await response.json();
    if (error.error?.code === 403) {
      throw new Error('Invalid YouTube API key');
    }
    throw new Error(error.error?.message || 'Failed to fetch video');
  }

  const data = await response.json();
  
  if (!data.items || data.items.length === 0) {
    throw new Error('Video not found');
  }

  const video = data.items[0];
  return [{
    id: video.id,
    title: video.snippet.title,
    duration: formatDuration(video.contentDetails.duration),
    thumbnail: `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`,
  }];
};

const fetchYouTubeMusicMix = async (playlistId: string): Promise<Video[]> => {
  if (!API_KEY) {
    throw new Error('YouTube API key is not configured');
  }

  try {
    // For YouTube Music mixes, we'll search for songs in the same genre/mood
    const genreMatch = playlistId.match(/RDCLAK5uy_([^_]+)/);
    if (!genreMatch) {
      throw new Error('Invalid YouTube Music mix URL');
    }

    // Search for music videos in a similar genre
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoCategoryId=10&maxResults=25&key=${API_KEY}&q=music%20${genreMatch[1].replace(/_/g, ' ')}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch music mix');
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('No songs found in this mix');
    }

    // Get detailed info for each video
    const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds}&key=${API_KEY}`
    );

    const detailsData = await detailsResponse.json();

    return detailsData.items.map((video: any) => ({
      id: video.id,
      title: video.snippet.title,
      duration: formatDuration(video.contentDetails.duration),
      thumbnail: `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`,
    }));
  } catch (error) {
    console.error('Error fetching YouTube Music mix:', error);
    throw new Error('Failed to load YouTube Music mix. Please try a regular YouTube playlist instead.');
  }
};

export const fetchPlaylistVideos = async (url: string): Promise<Video[]> => {
  if (!API_KEY) {
    throw new Error('YouTube API key is not configured');
  }

  // First check if it's a single video
  const videoId = extractVideoId(url);
  if (videoId && !url.includes('list=')) {
    return fetchVideoDetails(videoId);
  }

  // Then check if it's a playlist
  const playlistId = extractPlaylistId(url);
  if (!playlistId) {
    throw new Error('Invalid URL. Please provide a valid YouTube or YouTube Music URL');
  }

  // Handle YouTube Music Radio/Mix playlists
  if (playlistId.startsWith('RDCLAK')) {
    return fetchYouTubeMusicMix(playlistId);
  }

  // Handle regular playlists
  try {
    const videos: Video[] = [];
    let nextPageToken = '';
    
    do {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${playlistId}&key=${API_KEY}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`
      );
      
      if (!response.ok) {
        const error = await response.json();
        if (error.error?.code === 403) {
          throw new Error('Invalid YouTube API key');
        }
        throw new Error(error.error?.message || 'Failed to fetch playlist');
      }
      
      const data = await response.json();
      
      const videoIds = data.items
        .map((item: any) => item.snippet.resourceId.videoId)
        .join(',');
      
      // Fetch video durations
      const durationResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${API_KEY}`
      );
      
      const durationData = await durationResponse.json();
      const durations = new Map(
        durationData.items.map((item: any) => [
          item.id,
          formatDuration(item.contentDetails.duration),
        ])
      );
      
      const newVideos = data.items
        .filter((item: any) => 
          item.snippet.title !== 'Private video' && 
          item.snippet.title !== 'Deleted video'
        )
        .map((item: any) => ({
          id: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          duration: durations.get(item.snippet.resourceId.videoId) || 'Unknown',
          thumbnail: `https://i.ytimg.com/vi/${item.snippet.resourceId.videoId}/mqdefault.jpg`,
        }));
      
      videos.push(...newVideos);
      nextPageToken = data.nextPageToken;
    } while (nextPageToken);
    
    return videos;
  } catch (error) {
    console.error('Error fetching content:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to load content');
  }
};

function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 'Unknown';

  const [, hours, minutes, seconds] = match;
  const parts = [];

  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds) parts.push(`${seconds}s`);

  return parts.join(' ') || '0s';
}