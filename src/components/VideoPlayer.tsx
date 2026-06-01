import React, { useRef, useCallback, memo } from 'react';
import YouTube from 'react-youtube';
import { Play, Pause, SkipBack, SkipForward, Volume2, Video, VideoOff, Shuffle, Repeat } from 'lucide-react';
import { useStore } from '../store/useStore';

const VideoPlayer: React.FC = () => {
  const playerRef = useRef<any>(null);
  const {
    playlist,
    setIsPlaying,
    setCurrentVideo,
    setVolume,
    setAudioOnly,
    toggleShuffle,
    toggleRepeat,
  } = useStore();

  const { videos, currentIndex, isPlaying, volume, audioOnly, shuffle, repeat } = playlist;
  const currentVideo = videos[currentIndex];

  const handleReady = useCallback((event: any) => {
    playerRef.current = event.target;
    event.target.setVolume(volume);
    if (isPlaying) {
      event.target.playVideo();
    }
  }, [volume, isPlaying]);

  const handlePlay = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  }, [setIsPlaying]);

  const handlePause = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    }
  }, [setIsPlaying]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentVideo(currentIndex - 1);
    }
  }, [currentIndex, setCurrentVideo]);

  const handleNext = useCallback(() => {
    if (currentIndex < videos.length - 1) {
      setCurrentVideo(currentIndex + 1);
    }
  }, [currentIndex, videos.length, setCurrentVideo]);

  const handleVideoEnd = useCallback(() => {
    if (repeat) {
      // If repeat is on, replay the current song
      if (playerRef.current) {
        playerRef.current.seekTo(0);
        playerRef.current.playVideo();
      }
    } else if (currentIndex < videos.length - 1) {
      // If not repeating, go to next song if available
      setCurrentVideo(currentIndex + 1);
    } else {
      // If at the end and not repeating, stop playing
      setIsPlaying(false);
    }
  }, [currentIndex, videos.length, repeat, setCurrentVideo, setIsPlaying]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
    }
    setVolume(newVolume);
  }, [setVolume]);

  const toggleAudioOnly = useCallback(() => {
    setAudioOnly(!audioOnly);
  }, [audioOnly, setAudioOnly]);

  if (!currentVideo) {
    return (
      <div className="flex flex-col items-center justify-center h-[225px] text-sm text-gray-400 bg-[#181818] rounded-lg">
        <p className="mb-2">No Music loaded</p>
        <p className="text-xs text-gray-500">Select a playlist or paste a YouTube URL above</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg ${
        audioOnly ? 'hidden' : ''
      }`}>
        <YouTube
          videoId={currentVideo.id}
          opts={{
            width: '100%',
            height: '100%',
            playerVars: {
              autoplay: 1,
              modestbranding: 1,
              rel: 0,
            },
          }}
          onReady={handleReady}
          onEnd={handleVideoEnd}
          className="w-full h-full"
          loading="lazy"
        />
      </div>

      {audioOnly && (
        <div className="flex items-center justify-center h-[225px] bg-[#181818] rounded-lg">
          <div className="text-center">
            <img
              src={`https://i.ytimg.com/vi/${currentVideo.id}/mqdefault.jpg`}
              alt=""
              className="w-48 h-28 object-cover rounded-lg mb-4 mx-auto opacity-50"
              loading="lazy"
            />
            <p className="text-sm text-gray-400 px-4 line-clamp-2">{currentVideo.title}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="p-2 rounded-lg bg-[#282828] text-gray-300 hover:bg-[#383838] disabled:opacity-50 transition-all"
          >
            <SkipBack size={18} />
          </button>

          <button
            onClick={isPlaying ? handlePause : handlePlay}
            className="p-2.5 rounded-lg bg-[#1DB954] hover:bg-[#1ed760] text-black transition-all"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === videos.length - 1}
            className="p-2 rounded-lg bg-[#282828] text-gray-300 hover:bg-[#383838] disabled:opacity-50 transition-all"
          >
            <SkipForward size={18} />
          </button>

          <button
            onClick={toggleAudioOnly}
            className={`p-2 rounded-lg ${
              audioOnly 
                ? 'bg-[#1DB954] text-black hover:bg-[#1ed760]' 
                : 'bg-[#282828] text-gray-300 hover:bg-[#383838]'
            } transition-all`}
            title={audioOnly ? "Show video" : "Audio only"}
          >
            {audioOnly ? <Video size={18} /> : <VideoOff size={18} />}
          </button>

          <button
            onClick={toggleShuffle}
            className={`p-2 rounded-lg ${
              shuffle
                ? 'bg-[#1DB954] text-black hover:bg-[#1ed760]'
                : 'bg-[#282828] text-gray-300 hover:bg-[#383838]'
            } transition-all`}
            title="Shuffle playlist"
          >
            <Shuffle size={18} />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-2 rounded-lg ${
              repeat
                ? 'bg-[#1DB954] text-black hover:bg-[#1ed760]'
                : 'bg-[#282828] text-gray-300 hover:bg-[#383838]'
            } transition-all`}
            title="Repeat current song"
          >
            <Repeat size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3 w-32">
          <Volume2 size={18} className="text-gray-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-1.5 bg-[#404040] rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(VideoPlayer);