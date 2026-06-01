import { create } from 'zustand';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface AudioTrack {
  id: string;
  title: string;
  url: string;
  category: 'binaural' | 'ambient' | 'campuran'; 
}

interface StoreState {
  tasks: Task[];
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string, newText: string) => void;

  binauralTracks: AudioTrack[];
  addBinauralTrack: (title: string, url: string, category: 'binaural' | 'ambient' | 'campuran') => void;
  deleteBinauralTrack: (id: string) => void;

  activeTrackId: string | null;
  isPlaying: boolean;
  playTrack: (id: string) => void;
  pauseTrack: () => void;

  // State untuk mengelola Sesi Fokus dari Tugas
  activeTaskId: string | null;
  setActiveTask: (id: string | null) => void;
  sessionConfig: { duration: number, audioId: string | null } | null;
  setSessionConfig: (config: { duration: number, audioId: string | null } | null) => void;
}

export const useStore = create<StoreState>((set) => ({
  tasks: [],
  addTask: (text) => set((state) => ({
    tasks: [...state.tasks, { id: Date.now().toString(), text, completed: false }]
  })),
  toggleTask: (id) => set((state) => ({
    tasks: state.tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task)
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id),
    activeTaskId: state.activeTaskId === id ? null : state.activeTaskId // Hapus status jika tugas dihapus
  })),
  editTask: (id, newText) => set((state) => ({
    tasks: state.tasks.map(task => task.id === id ? { ...task, text: newText } : task)
  })),

  binauralTracks: [
    { id: '1', title: 'Alpha Focus (8-12 Hz)', url: '/audio/alpha-focus.mp3', category: 'binaural' },
    { id: '2', title: 'Hujan Deras (Rain Sounds)', url: '/audio/rain-sounds.mp3', category: 'ambient' }
  ],
  addBinauralTrack: (title, url, category) => set((state) => ({
    binauralTracks: [...state.binauralTracks, { id: Date.now().toString(), title, url, category }]
  })),
  deleteBinauralTrack: (id) => set((state) => {
    const isDeletingActive = state.activeTrackId === id;
    return {
      binauralTracks: state.binauralTracks.filter(track => track.id !== id),
      activeTrackId: isDeletingActive ? null : state.activeTrackId,
      isPlaying: isDeletingActive ? false : state.isPlaying
    };
  }),

  activeTrackId: null,
  isPlaying: false,
  playTrack: (id) => set({ activeTrackId: id, isPlaying: true }),
  pauseTrack: () => set({ isPlaying: false }),

  activeTaskId: null,
  setActiveTask: (id) => set({ activeTaskId: id }),

  sessionConfig: null,
  setSessionConfig: (config) => set({ sessionConfig: config }),
}));