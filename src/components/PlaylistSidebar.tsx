import React, { memo } from 'react';
import { useStore } from '../store/useStore';
import { Play } from 'lucide-react';

const PlaylistSidebar: React.FC = () => {
  const { playlist, setCurrentVideo } = useStore();
  const { videos, currentIndex } = playlist;

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#181818] rounded-xl overflow-hidden">
      <div className="p-4 border-b border-[#282828]">
        <h3 className="font-medium text-sm text-gray-400">
          Playlist • {videos.length} videos
        </h3>
      </div>
      
      <div className="h-[400px] overflow-y-auto custom-scrollbar">
        {videos.map((video, index) => (
          <button
            key={video.id}
            onClick={() => setCurrentVideo(index)}
            className={`w-full p-3 flex items-start gap-3 hover:bg-[#282828]/50 transition-colors ${
              currentIndex === index ? 'bg-[#282828]' : ''
            }`}
          >
            <div className="relative flex-shrink-0">
              <img
                src={`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
                alt=""
                className="w-20 h-12 object-cover rounded"
                loading="lazy"
              />
              {currentIndex === index && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded">
                  <Play size={16} className="text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-medium text-white line-clamp-2 mb-1">
                {video.title}
              </p>
              <p className="text-[10px] text-gray-400">
                {video.duration}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default memo(PlaylistSidebar);