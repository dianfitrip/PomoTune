import React, { Suspense } from 'react';
import { PomodoroTimer } from './components/PomodoroTimer';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { PomodoroShimmer, TodoShimmer } from './components/Shimmer';

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
          Terjadi kesalahan antarmuka. Silakan muat ulang halaman.
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulasi loading awal agar antarmuka terlihat mulus saat dimuat
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-[#121212]">
        <main className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="grid lg:grid-cols-[55%_45%] gap-6 lg:gap-8">
            <div className="space-y-6 lg:space-y-8">
              <TodoShimmer />
            </div>
            <div className="space-y-6 lg:space-y-8">
              <PomodoroShimmer />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid lg:grid-cols-[55%_45%] gap-6 lg:gap-8">
          
          {/* Panel Kiri: Manajemen Tugas */}
          <div className="space-y-6 lg:space-y-8">
            <ErrorBoundary>
              <Suspense fallback={<TodoShimmer />}>
                <TodoList />
              </Suspense>
            </ErrorBoundary>
          </div>
          
          {/* Panel Kanan: Timer Pomodoro & Audio */}
          <div className="space-y-6 lg:space-y-8">
            <ErrorBoundary>
              <Suspense fallback={<PomodoroShimmer />}>
                <PomodoroTimer />
              </Suspense>
            </ErrorBoundary>
            
            {/* Tempat untuk komponen Audio Binaural Beats (Dikerjakan Nanti) */}
            <div className="bg-[#282828] rounded-xl p-6 border border-[#383838]">
              <h2 className="text-lg font-semibold mb-4 text-gray-100">Pemutar Audio Entrainment</h2>
              <p className="text-sm text-gray-400">
                Komponen file audio lokal (Binaural Beats & Ambient Music) akan diintegrasikan di bagian ini.
              </p>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;