import React, { Suspense } from 'react';
import { 
  LayoutDashboard, ListTodo, BarChart2, Headphones, Music, 
  Settings, Plus, Play, Pause, Volume2, Brain, Activity, Clock 
} from 'lucide-react';
import { PomodoroTimer } from './components/PomodoroTimer';
import { TodoList } from './components/TodoList';

function App() {
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-800 font-sans flex justify-center">
      <div className="max-w-[1400px] w-full flex bg-white shadow-xl my-4 rounded-3xl overflow-hidden border border-gray-100">
        
        {/* PANEL KIRI: NAVIGASI */}
        <aside className="w-64 bg-[#F2F5F3] p-6 flex flex-col border-r border-gray-200">
          <div className="flex items-center gap-3 mb-10 text-emerald-700">
            <Brain size={28} className="font-bold" />
            <h1 className="text-2xl font-bold tracking-tight">FocusFlow</h1>
          </div>

          <nav className="flex-1 space-y-8">
            <div>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="flex items-center gap-3 bg-white text-emerald-700 px-4 py-3 rounded-xl font-semibold shadow-sm border border-emerald-100">
                    <LayoutDashboard size={20} /> Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-3 rounded-xl font-medium transition-colors">
                    <ListTodo size={20} /> Tugas Saya
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-3 rounded-xl font-medium transition-colors">
                    <BarChart2 size={20} /> Progres
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-4">Audio</p>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-3 rounded-xl font-medium transition-colors">
                    <Headphones size={20} /> Binaural Beats
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-3 rounded-xl font-medium transition-colors">
                    <Music size={20} /> Ambient Music
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-4">Akun</p>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-3 rounded-xl font-medium transition-colors">
                    <Settings size={20} /> Pengaturan
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* PANEL TENGAH: DAFTAR TUGAS */}
        <main className="flex-1 p-8 flex flex-col border-r border-gray-200 bg-[#FAFCFB]">
          <header className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-800">Hari ini · {today}</h2>
            <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-full font-medium hover:bg-gray-50 shadow-sm transition-all">
              <Plus size={18} /> Tambah Tugas
            </button>
          </header>

          <div className="flex-1 overflow-y-auto pr-2">
            <Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded-xl"></div>}>
              <TodoList />
            </Suspense>
          </div>
        </main>

        {/* PANEL KANAN: AUDIO & TIMER */}
        <aside className="w-[380px] bg-white p-8 flex flex-col overflow-y-auto">
          
          {/* Section: Mode Audio */}
          <section className="mb-8">
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-4">
              <Headphones size={18} /> Mode Audio
            </h3>
            
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
              <button className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold shadow-sm">Binaural</button>
              <button className="flex-1 text-gray-600 hover:text-gray-900 py-2 rounded-lg text-sm font-medium">Ambient</button>
              <button className="flex-1 text-gray-600 hover:text-gray-900 py-2 rounded-lg text-sm font-medium">Campuran</button>
            </div>

            {/* Audio Track 1 */}
            <div className="border border-emerald-200 bg-emerald-50 rounded-2xl p-4 mb-3 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center">
                    <Activity size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">Alpha Focus</h4>
                    <p className="text-xs text-gray-500">8-12 Hz · Fokus & Relaksasi</p>
                  </div>
                </div>
                <button className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center hover:bg-emerald-700">
                  <Pause size={14} fill="currentColor" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Volume2 size={16} />
                <div className="h-1.5 flex-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 w-2/3"></div>
                </div>
              </div>
            </div>

            {/* Audio Track 2 */}
            <div className="border border-gray-200 bg-white rounded-2xl p-4 hover:border-emerald-200 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                    <Activity size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">Beta Boost</h4>
                    <p className="text-xs text-gray-500">15-20 Hz · Konsentrasi Aktif</p>
                  </div>
                </div>
                <button className="w-8 h-8 border border-gray-300 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-50">
                  <Play size={14} fill="currentColor" className="ml-0.5" />
                </button>
              </div>
            </div>
          </section>

          <hr className="border-gray-200 mb-8" />

          {/* Section: Pomodoro Timer */}
          <section>
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-4">
              <Clock size={18} /> Pomodoro Timer
            </h3>
            
            <div className="bg-[#FAFCFB] border border-gray-100 rounded-3xl p-6 flex flex-col items-center">
              <Suspense fallback={<div className="animate-pulse bg-gray-200 h-48 w-48 rounded-full"></div>}>
                <PomodoroTimer />
              </Suspense>
            </div>
          </section>

        </aside>
      </div>
    </div>
  );
}

export default App;