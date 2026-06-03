import { create } from 'zustand';

export interface Task {
  id: string | number;
  text: string;
  completed: boolean;
  category: string;
  priority: 'Tinggi' | 'Sedang' | 'Rendah';
  deadline: string | null;
}

export interface AudioTrack {
  id: string | number;
  title: string;
  file_path: string; 
  category: 'binaural' | 'ambient' | 'campuran'; 
}

interface ProgressStats {
  totalTasksCompleted: number;
  totalSessions: number;
  totalFocusMinutes: number;
}

interface StoreState {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  addTask: (taskData: Partial<Task>) => Promise<void>;
  toggleTask: (id: string | number) => Promise<void>;
  deleteTask: (id: string | number) => Promise<void>;

  binauralTracks: AudioTrack[];
  fetchAudioTracks: () => Promise<void>;
  addBinauralTrack: (formData: FormData) => Promise<void>; 
  deleteBinauralTrack: (id: string | number) => Promise<void>;

  activeTrackId: string | number | null;
  isPlaying: boolean;
  playTrack: (id: string | number) => void;
  pauseTrack: () => void;

  activeTaskId: string | null;
  setActiveTask: (id: string | null) => void;
  sessionConfig: { duration: number, audioId: string | null } | null;
  setSessionConfig: (config: { duration: number, audioId: string | null } | null) => void;

  saveFocusSession: (sessionData: { task_id?: string | null, audio_id?: string | null, duration_minutes: number, status: 'completed' | 'interrupted' }) => Promise<void>;

  // State untuk Statistik
  progressStats: ProgressStats | null;
  fetchProgressStats: () => Promise<void>;
}

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

const API_URL = 'http://localhost:5000/api/tasks';
const AUDIO_API_URL = 'http://localhost:5000/api/audio';
const SESSION_API_URL = 'http://localhost:5000/api/sessions';
const PROGRESS_API_URL = 'http://localhost:5000/api/progress';

const sortTasks = (tasks: Task[]): Task[] => {
  const priorityWeight = { 'Tinggi': 1, 'Sedang': 2, 'Rendah': 3 };
  
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
      return priorityWeight[a.priority] - priorityWeight[b.priority];
    }
    if (a.deadline && b.deadline) {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    if (a.deadline) return -1;
    if (b.deadline) return 1;
    return 0;
  });
};

export const useStore = create<StoreState>((set, get) => ({
  tasks: [],
  progressStats: null,
  
  fetchTasks: async () => {
    try {
      const response = await fetch(API_URL, { headers: getAuthHeaders() });
      if (response.ok) {
        const data = await response.json();
        set({ tasks: sortTasks(data) });
      }
    } catch (error) { console.error("Gagal memuat tugas", error); }
  },

  fetchProgressStats: async () => {
    try {
      const response = await fetch(PROGRESS_API_URL, { headers: getAuthHeaders() });
      if (response.ok) {
        set({ progressStats: await response.json() });
      }
    } catch (error) { console.error("Gagal memuat statistik", error); }
  },

  addTask: async (taskData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(taskData)
      });
      if (response.ok) {
        const newTask = await response.json();
        set((state) => ({ tasks: sortTasks([...state.tasks, newTask]) }));
      }
    } catch (error) { console.error("Gagal menambah tugas", error); }
  },

  toggleTask: async (id) => {
    const task = get().tasks.find(t => String(t.id) === String(id));
    if (!task) return;

    set((state) => ({
      tasks: sortTasks(state.tasks.map(t => String(t.id) === String(id) ? { ...t, completed: !t.completed } : t))
    }));

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ completed: !task.completed })
      });
      get().fetchProgressStats(); // Update stat ketika tugas selesai dicentang
    } catch (error) {
      set((state) => ({
        tasks: sortTasks(state.tasks.map(t => String(t.id) === String(id) ? { ...t, completed: task.completed } : t))
      }));
    }
  },

  deleteTask: async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (response.ok) {
        set((state) => ({
          tasks: state.tasks.filter(task => String(task.id) !== String(id)),
          activeTaskId: state.activeTaskId === String(id) ? null : state.activeTaskId
        }));
        get().fetchProgressStats(); // Update stat jika tugas terhapus
      }
    } catch (error) { console.error("Gagal menghapus tugas", error); }
  },

  binauralTracks: [],
  
  fetchAudioTracks: async () => {
    try {
      const response = await fetch(AUDIO_API_URL, { 
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
      });
      if (response.ok) set({ binauralTracks: await response.json() });
    } catch (error) { console.error("Gagal memuat audio", error); }
  },

  addBinauralTrack: async (formData) => {
    try {
      const response = await fetch(AUDIO_API_URL, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }, 
        body: formData
      });
      if (response.ok) {
        const newTrack = await response.json();
        set((state) => ({ binauralTracks: [...state.binauralTracks, newTrack] }));
      }
    } catch (error) { console.error("Gagal menambah audio", error); }
  },

  deleteBinauralTrack: async (id) => {
    try {
      const response = await fetch(`${AUDIO_API_URL}/${id}`, { 
        method: 'DELETE', 
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
      });
      if (response.ok) {
        set((state) => {
          const isDeletingActive = String(state.activeTrackId) === String(id);
          return {
            binauralTracks: state.binauralTracks.filter(track => String(track.id) !== String(id)),
            activeTrackId: isDeletingActive ? null : state.activeTrackId,
            isPlaying: isDeletingActive ? false : state.isPlaying
          };
        });
      }
    } catch (error) { console.error("Gagal menghapus audio", error); }
  },

  activeTrackId: null,
  isPlaying: false,
  playTrack: (id) => set({ activeTrackId: id, isPlaying: true }),
  pauseTrack: () => set({ isPlaying: false }),

  activeTaskId: null,
  setActiveTask: (id) => set({ activeTaskId: id }),
  sessionConfig: null,
  setSessionConfig: (config) => set({ sessionConfig: config }),

  saveFocusSession: async (sessionData) => {
    try {
      await fetch(SESSION_API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(sessionData)
      });
      get().fetchProgressStats(); // Update stat ketika sesi fokus selesai
    } catch (error) {
      console.error("Gagal menyimpan sesi fokus", error);
    }
  },
}));