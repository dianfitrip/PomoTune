import React, { Suspense, useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, ListTodo, BarChart2, Headphones, Music, 
  Settings, Plus, Play, Pause, Volume2, Brain, Activity, Clock, X, Trash2, Disc3
} from 'lucide-react';
import { PomodoroTimer } from './components/PomodoroTimer';
import { TodoList } from './components/TodoList';
import { useStore } from './store/useStore';

function App() {
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });

  const [activeView, setActiveView] = useState('dashboard');
  const [audioMode, setAudioMode] = useState<'binaural' | 'ambient' | 'campuran'>('binaural');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  // STATE BARU: Untuk Modal "Mulai Sesi Fokus"
  const [startModalTaskId, setStartModalTaskId] = useState<string | null>(null);
  const [startDuration, setStartDuration] = useState(25);
  const [startAudioId, setStartAudioId] = useState<string>('');
  const [isCustomStart, setIsCustomStart] = useState(false); // State untuk kontrol input kustom

  const [newMusicTitle, setNewMusicTitle] = useState('');
  const [newMusicCategory, setNewMusicCategory] = useState<'binaural' | 'ambient' | 'campuran'>('binaural');
  const [newMusicFile, setNewMusicFile] = useState<File | null>(null);

  const { 
    tasks, addTask, 
    binauralTracks, addBinauralTrack, deleteBinauralTrack, 
    activeTrackId, isPlaying, playTrack, pauseTrack,
    setActiveTask, setSessionConfig
  } = useStore();

  const audioRef = useRef<HTMLAudioElement>(null);
  const activeTrack = binauralTracks.find(t => t.id === activeTrackId);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Menunggu interaksi user untuk play"));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, activeTrackId]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim());
      setNewTaskTitle('');
      setIsModalOpen(false);
    }
  };

  const handleAddMusic = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMusicTitle.trim() && newMusicFile) {
      const audioUrl = URL.createObjectURL(newMusicFile);
      addBinauralTrack(newMusicTitle.trim(), audioUrl, newMusicCategory);
      setNewMusicTitle('');
      setNewMusicFile(null);
      setNewMusicCategory('binaural');
      const fileInput = document.getElementById('audio-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const getNavClass = (viewName: string) => `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === viewName ? 'bg-white text-emerald-700 shadow-sm border border-emerald-100 font-semibold' : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 font-medium'}`;

  const filteredTracks = binauralTracks.filter(track => track.category === audioMode);
  const taskToStart = tasks.find(t => t.id === startModalTaskId);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-800 font-sans flex justify-center relative">
      <audio ref={audioRef} src={activeTrack?.url} loop />

      <div className="max-w-[1400px] w-full flex bg-white shadow-xl my-4 rounded-3xl overflow-hidden border border-gray-100 relative">
        {/* PANEL KIRI */}
        <aside className="w-64 bg-[#F2F5F3] p-6 flex flex-col border-r border-gray-200">
          <div className="flex items-center gap-3 mb-10 text-emerald-700">
            <Brain size={28} className="font-bold" />
            <h1 className="text-2xl font-bold tracking-tight">FocusFlow</h1>
          </div>
          <nav className="flex-1 space-y-8">
            <div>
              <ul className="space-y-2">
                <li><button onClick={() => setActiveView('dashboard')} className={getNavClass('dashboard')}><LayoutDashboard size={20} /> Dashboard</button></li>
                <li><button onClick={() => setActiveView('tasks')} className={getNavClass('tasks')}><ListTodo size={20} /> Tugas Saya</button></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-4">Audio</p>
              <ul className="space-y-2">
                <li><button onClick={() => setActiveView('audio-manager')} className={getNavClass('audio-manager')}><Disc3 size={20} /> Kelola Audio</button></li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* PANEL TENGAH: Dashboard & Tugas */}
        {(activeView === 'dashboard' || activeView === 'tasks') && (
          <main className={`p-8 flex flex-col bg-[#FAFCFB] ${activeView === 'dashboard' ? 'flex-1 border-r border-gray-200' : 'flex-1'}`}>
            <header className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold text-gray-800">{activeView === 'dashboard' ? `Hari ini · ${today}` : 'Semua Tugas Saya'}</h2>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-full font-medium hover:bg-gray-50 shadow-sm transition-all"><Plus size={18} /> Tambah Tugas</button>
            </header>
            <div className="flex-1 overflow-y-auto pr-2">
              <Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded-xl"></div>}>
                <TodoList onStartTask={(id) => {
                  setStartModalTaskId(id);
                  setStartDuration(25);
                  setIsCustomStart(false);
                }} />
              </Suspense>
            </div>
          </main>
        )}

        {/* PANEL TENGAH: Kelola Audio */}
        {activeView === 'audio-manager' && (
          <main className="p-8 flex flex-col bg-[#FAFCFB] flex-1">
            <header className="mb-8"><h2 className="text-xl font-bold text-gray-800">Kelola Koleksi Audio</h2></header>
            <form onSubmit={handleAddMusic} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
              <h3 className="font-semibold mb-4 text-gray-700">Tambah Track Audio Baru</h3>
              <div className="flex gap-4 mb-4">
                <input type="text" value={newMusicTitle} onChange={(e) => setNewMusicTitle(e.target.value)} placeholder="Judul (misal: Delta Focus)" className="flex-1 px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-emerald-500" />
                <select value={newMusicCategory} onChange={(e) => setNewMusicCategory(e.target.value as any)} className="px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-emerald-500 bg-white text-gray-700">
                  <option value="binaural">Binaural Beats</option>
                  <option value="ambient">Ambient Music</option>
                  <option value="campuran">Campuran</option>
                </select>
              </div>
              <div className="flex gap-4 items-center">
                <input id="audio-upload" type="file" accept="audio/mp3, audio/wav, audio/ogg" onChange={(e) => { if (e.target.files && e.target.files.length > 0) setNewMusicFile(e.target.files[0]); }} className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer transition-colors" />
                <button type="submit" disabled={!newMusicTitle || !newMusicFile} className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white px-8 py-2.5 rounded-xl font-medium shadow-sm transition-all">Simpan Audio</button>
              </div>
            </form>
            <div className="space-y-3">
              {binauralTracks.map(track => (
                <div key={track.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-emerald-200 transition-all shadow-sm group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">{track.category === 'ambient' ? <Music size={20} /> : <Activity size={20} />}</div>
                    <div>
                      <h4 className="font-semibold text-gray-700">{track.title}</h4>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md capitalize border border-gray-200">{track.category}</span>
                    </div>
                  </div>
                  <button onClick={() => deleteBinauralTrack(track.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* PANEL KANAN: AUDIO & TIMER */}
        {(activeView === 'dashboard') && (
          <aside className="w-[380px] bg-white p-8 flex flex-col overflow-y-auto">
            <section className="mb-8">
              <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-4"><Headphones size={18} /> Mode Audio</h3>
              <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                <button onClick={() => setAudioMode('binaural')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${audioMode === 'binaural' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>Binaural</button>
                <button onClick={() => setAudioMode('ambient')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${audioMode === 'ambient' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>Ambient</button>
                <button onClick={() => setAudioMode('campuran')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${audioMode === 'campuran' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>Campuran</button>
              </div>
              <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2">
                {filteredTracks.map(track => {
                  const isTrackActive = activeTrackId === track.id;
                  return (
                    <div key={track.id} className={`border rounded-2xl p-4 transition-all shadow-sm ${isTrackActive ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 bg-white hover:border-emerald-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isTrackActive ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-600'}`}>{track.category === 'ambient' ? <Music size={20} /> : <Activity size={20} />}</div>
                          <h4 className="text-sm font-bold text-gray-800 truncate max-w-[120px]">{track.title}</h4>
                        </div>
                        <button onClick={() => { isTrackActive && isPlaying ? pauseTrack() : playTrack(track.id) }} className={`w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${isTrackActive && isPlaying ? 'bg-emerald-600 text-white shadow-md hover:bg-emerald-700' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                          {isTrackActive && isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                        </button>
                      </div>
                      {isTrackActive && isPlaying && (
                        <div className="flex items-center gap-2 text-emerald-500 mt-3 pl-1">
                          <Volume2 size={14} />
                          <div className="h-1 flex-1 bg-emerald-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 w-full animate-pulse"></div></div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
            <hr className="border-gray-200 mb-8" />
            <section>
              <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-4"><Clock size={18} /> Pomodoro Timer</h3>
              <div className="bg-[#FAFCFB] border border-gray-100 rounded-3xl p-6 flex flex-col items-center">
                <Suspense fallback={<div className="animate-pulse bg-gray-200 h-48 w-48 rounded-full"></div>}>
                  <PomodoroTimer />
                </Suspense>
              </div>
            </section>
          </aside>
        )}
      </div>

      {/* 1. MODAL TAMBAH TUGAS */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Tambah Tugas Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddTask}>
              <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="Tuliskan nama tugas di sini..." className="w-full px-4 py-3 bg-gray-50 text-gray-800 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none mb-8 transition-colors" autoFocus />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">Batal</button>
                <button type="submit" disabled={!newTaskTitle.trim()} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-medium rounded-xl shadow-sm transition-colors">Simpan Tugas</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. MODAL MULAI SESI FOKUS (Dengan Fitur Kustom Inline) */}
      {startModalTaskId && taskToStart && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Mulai Sesi Fokus</h3>
              <button onClick={() => { setStartModalTaskId(null); setIsCustomStart(false); }} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="mb-6">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Tugas Saat Ini</p>
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 font-semibold break-words">
                {taskToStart.text}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Pilih Waktu (Menit)</p>
              <div className="flex gap-2">
                {[25, 45, 60].map(m => (
                  <button 
                    key={m} 
                    onClick={() => { setStartDuration(m); setIsCustomStart(false); }} 
                    className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${startDuration === m && !isCustomStart ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'}`}
                  >
                    {m}
                  </button>
                ))}
                <button 
                  onClick={() => setIsCustomStart(true)} 
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${isCustomStart || (![25, 45, 60].includes(startDuration)) ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'}`}
                >
                  {(![25, 45, 60].includes(startDuration) && !isCustomStart) ? `${startDuration}m` : 'Kustom'}
                </button>
              </div>

              {/* Tampilan Input Kustom Inline */}
              {isCustomStart && (
                <div className="mt-3 flex items-center justify-center gap-3 bg-emerald-50 p-3 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-top-2">
                  <label className="text-sm font-semibold text-emerald-700">Waktu Kustom:</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={startDuration} 
                    onChange={(e) => setStartDuration(parseInt(e.target.value) || 1)} 
                    className="w-20 px-3 py-1.5 text-center font-bold text-gray-800 rounded-lg border border-emerald-200 outline-none focus:border-emerald-500"
                    autoFocus
                  />
                  <span className="text-sm font-semibold text-emerald-700">menit</span>
                </div>
              )}
            </div>

            <div className="mb-8">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">Pilih Pendamping Audio</p>
              <select value={startAudioId} onChange={(e) => setStartAudioId(e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-emerald-500 text-sm font-medium text-gray-700">
                <option value="">Tanpa Audio</option>
                {binauralTracks.map(t => (
                  <option key={t.id} value={t.id}>{t.title} ({t.category})</option>
                ))}
              </select>
            </div>

            <button onClick={() => {
              setActiveTask(taskToStart.id);
              setSessionConfig({ duration: startDuration, audioId: startAudioId || null });
              setStartModalTaskId(null);
              setIsCustomStart(false);
              setActiveView('dashboard');
            }} className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex justify-center items-center gap-2 transform hover:scale-[1.02]">
              <Play size={18} fill="currentColor" /> Mulai Sekarang
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;