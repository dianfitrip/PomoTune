import React, { Suspense } from 'react';
import { Brain, ListTodo, Music2 } from 'lucide-react';
import { PomodoroTimer } from './components/PomodoroTimer';
import { TodoList } from './components/TodoList';
import { PlaylistCategories } from './components/PlaylistCategories';
import { Footer } from './components/Footer';
import { useStore } from './store/useStore';
import { fetchPlaylistVideos } from './utils/youtube';
import { PomodoroShimmer, TodoShimmer, VideoPlayerShimmer, PlaylistShimmer } from './components/Shimmer';

const VideoPlayer = React.lazy(() => import('./components/VideoPlayer'));
const PlaylistSidebar = React.lazy(() => import('./components/PlaylistSidebar'));

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
          Something went wrong. Please try refreshing the page.
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [url, setUrl] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const { setPlaylist, playlist } = useStore();
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [showCategories, setShowCategories] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setShowCategories(false);

    try {
      const videos = await fetchPlaylistVideos(url);
      setPlaylist({
        videos,
        currentIndex: 0,
        isPlaying: false,
        volume: 70,
        audioOnly: false,
      });
      setUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
    } finally {
      setLoading(false);
    }
  }, [url, setPlaylist]);

  const handleUrlChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (e.target.value.trim() === '') {
      setShowCategories(true);
    }
  }, []);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-[#121212]">
        <main className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="grid lg:grid-cols-[55%_45%] gap-6 lg:gap-8">
            <div className="space-y-6 lg:space-y-8">
              <PomodoroShimmer />
              <TodoShimmer />
            </div>
            <div className="bg-[#282828] rounded-xl overflow-hidden">
              <div className="p-6 border-b border-[#383838]">
                <div className="flex gap-4">
                  <div className="flex-1 h-10 bg-[#383838] rounded-full" />
                  <div className="w-24 h-10 bg-[#383838] rounded-full" />
                </div>
              </div>
              <div className="p-6">
                <VideoPlayerShimmer />
                <div className="mt-6">
                  <PlaylistShimmer />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl">
            {error}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid lg:grid-cols-[55%_45%] gap-6 lg:gap-8">
          <div className="space-y-6 lg:space-y-8">
            <ErrorBoundary>
              <Suspense fallback={<PomodoroShimmer />}>
                <PomodoroTimer />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary>
              <Suspense fallback={<TodoShimmer />}>
                <TodoList />
              </Suspense>
            </ErrorBoundary>
          </div>
          
          <div className="bg-[#282828] rounded-xl overflow-hidden">
            <div className="p-6 border-b border-[#383838]">
              <div className="flex flex-col gap-4">
                <form onSubmit={handleSubmit} className="flex gap-4">
                  <input
                    type="text"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="Paste YouTube or YouTube Music URL..."
                    className="flex-1 px-4 py-2 bg-[#383838] rounded-full text-sm border border-transparent focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954] outline-none transition-all"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCategories(!showCategories)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      showCategories
                        ? 'bg-[#1DB954] hover:bg-[#1ed760] text-black'
                        : 'bg-[#383838] hover:bg-[#404040] text-white'
                    }`}
                  >
                    {showCategories ? 'Hide Categories' : 'Browse Categories'}
                  </button>
                </form>
                
                {showCategories && !url && (
                  <div className="bg-[#1d1d1d] rounded-xl p-4 animate-fade-in">
                    <PlaylistCategories onSelect={() => setShowCategories(false)} />
                  </div>
                )}
              </div>
            </div>
            
            <ErrorBoundary>
              <Suspense fallback={
                <div className="p-6">
                  <VideoPlayerShimmer />
                  <div className="mt-6">
                    <PlaylistShimmer />
                  </div>
                </div>
              }>
                <div className="p-6">
                  {loading ? (
                    <>
                      <VideoPlayerShimmer />
                      <div className="mt-6">
                        <PlaylistShimmer />
                      </div>
                    </>
                  ) : (
                    <>
                      <VideoPlayer />
                      <div className="mt-6">
                        <PlaylistSidebar />
                      </div>
                    </>
                  )}
                </div>
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;