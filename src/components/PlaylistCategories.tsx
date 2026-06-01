import React from 'react';
import { playlistCategories } from '../data/playlists';
import { useStore } from '../store/useStore';
import { fetchPlaylistVideos } from '../utils/youtube';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

interface PlaylistCategoriesProps {
  onSelect?: () => void;
}

export const PlaylistCategories: React.FC<PlaylistCategoriesProps> = ({ onSelect }) => {
  const { setPlaylist } = useStore();
  const [loading, setLoading] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [showAll, setShowAll] = React.useState(false);

  const handlePlaylistSelect = async (url: string, categoryId: string) => {
    setLoading(categoryId);
    setError(null);

    try {
      const videos = await fetchPlaylistVideos(url);
      setPlaylist({
        videos,
        currentIndex: 0,
        isPlaying: false,
        volume: 70,
        audioOnly: false,
        shuffle: false,
        repeat: false,
      });
      onSelect?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load playlist');
    } finally {
      setLoading(null);
    }
  };

  const visibleCategories = showAll ? playlistCategories : playlistCategories.slice(0, 5);

  return (
    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
      <div className="space-y-3 p-1">
        {visibleCategories.map((category) => (
          <div
            key={category.id}
            className="bg-[#282828] rounded-xl overflow-hidden hover:bg-[#323232] transition-colors"
          >
            <div className="p-4 flex gap-3">
              <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                <img 
                  src={category.thumbnail} 
                  alt={category.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="font-medium text-white">{category.name}</h3>
                </div>
                <p className="text-sm text-gray-400 mb-2">{category.description}</p>
                {loading === category.id && (
                  <Loader2 size={20} className="text-[#1DB954] animate-spin" />
                )}
              </div>
            </div>

            {category.playlists.length > 0 && (
              <div className="border-t border-[#383838]">
                {category.playlists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => handlePlaylistSelect(playlist.url, category.id)}
                    disabled={loading === category.id}
                    className="w-full p-4 text-left text-sm text-gray-300 hover:text-white hover:bg-[#383838] transition-colors disabled:opacity-50 flex items-center gap-3"
                  >
                    <div className="flex-1">
                      {playlist.title}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {error && category.id === loading && (
              <p className="px-4 py-2 text-sm text-red-400 bg-red-400/10">{error}</p>
            )}
          </div>
        ))}

        {playlistCategories.length > 5 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full py-3 px-4 bg-[#282828] hover:bg-[#323232] rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp size={16} />
              </>
            ) : (
              <>
                Show More Categories <ChevronDown size={16} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};