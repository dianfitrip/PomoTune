import React, { useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export const MusicPlayer: React.FC = () => {
  const playerRef = useRef<any>(null);
  const {
    playlist,
    setIsPlaying,
    setCurrentVideo,
    setVolume,
  } = useStore();

  const { videos, currentIndex, isPlaying, volume } = playlist;
  const currentVideo = videos[currentIndex];

  const handleReady = (event: any) => {
    playerRef.current = event.target;
    event.target.setVolume(volume);
    if (isPlaying) {
      event.target.playVideo();
    }
  };

  const handlePlay = () => {
    if (playerRef.current) {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (playerRef.current) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentVideo(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentVideo(currentIndex + 1);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
    }
    setVolume(newVolume);
  };

  if (!currentVideo) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 rounded-2xl p-8">
        <p className="text-gray-400">No playlist loaded</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-8">
      <div className="hidden">
        <YouTube
          videoId={currentVideo.id}
          opts={{
            height: '0',
            width: '0',
            playerVars: {
              autoplay: 1,
              controls: 0,
              disablekb: 1,
              fs: 0,
              modestbranding: 1,
            },
          }}
          onReady={handleReady}
          onEnd={handleNext}
        />
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-white mb-2 line-clamp-2">
          {currentVideo.title}
        </h3>
        <p className="text-sm text-gray-400">
          {currentVideo.duration}
        </p>
      </div>

      <div className="flex items-center justify-center gap-6 mb-8">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="p-3 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 transition-all"
        >
          <SkipBack size={20} />
        </button>

        <button
          onClick={isPlaying ? handlePause : handlePlay}
          className="p-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-xl transition-all"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === videos.length - 1}
          className="p-3 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-50 transition-all"
        >
          <SkipForward size={20} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <Volume2 size={20} className="text-gray-400" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
};