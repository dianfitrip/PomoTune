import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Video, PomodoroSettings, PlaylistData, PomodoroStats } from '../types';
import confetti from 'canvas-confetti';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface StoreState {
  // Pomodoro State
  isRunning: boolean;
  currentSession: 'work' | 'break';
  timeRemaining: number;
  pomodoroSettings: PomodoroSettings;
  pomodoroStats: PomodoroStats;
  timer: number | null;
  
  // Tasks State
  tasks: Task[];
  
  // Playlist State
  playlist: PlaylistData;
  
  // Actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  updateSettings: (settings: Partial<PomodoroSettings>) => void;
  updatePomodoroStats: (minutes: number) => void;
  clearAllData: () => void;
  
  // Task Actions
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  
  // Playlist Actions
  setPlaylist: (playlist: PlaylistData) => void;
  setCurrentVideo: (index: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setAudioOnly: (audioOnly: boolean) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25 * 60,
  breakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  longBreakInterval: 4,
};

const DEFAULT_STATE = {
  isRunning: false,
  currentSession: 'work' as const,
  timeRemaining: DEFAULT_SETTINGS.workDuration,
  pomodoroSettings: DEFAULT_SETTINGS,
  pomodoroStats: {
    totalMinutesToday: 0,
    sessionsCompleted: 0,
  },
  timer: null,
  tasks: [],
  playlist: {
    videos: [],
    currentIndex: 0,
    isPlaying: false,
    volume: 70,
    audioOnly: false,
    shuffle: false,
    repeat: false,
  },
};

// Fisher-Yates shuffle algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,
      
      startTimer: () => {
        const state = get();
        if (state.isRunning) return;

        if (state.timer) {
          clearInterval(state.timer);
        }
        
        const timer = setInterval(() => {
          const currentState = get();
          
          if (currentState.timeRemaining <= 0) {
            if (currentState.currentSession === 'work') {
              const completedMinutes = Math.floor(currentState.pomodoroSettings.workDuration / 60);
              set((state) => ({
                pomodoroStats: {
                  ...state.pomodoroStats,
                  totalMinutesToday: state.pomodoroStats.totalMinutesToday + completedMinutes,
                  sessionsCompleted: state.pomodoroStats.sessionsCompleted + 1,
                },
              }));
            }
            
            const nextSession = currentState.currentSession === 'work' ? 'break' : 'work';
            const nextDuration = nextSession === 'work' 
              ? currentState.pomodoroSettings.workDuration 
              : currentState.pomodoroSettings.breakDuration;
            
            set({
              currentSession: nextSession,
              timeRemaining: nextDuration,
              isRunning: false,
            });
            
            clearInterval(timer);
            return;
          }
          
          set((state) => ({
            timeRemaining: state.timeRemaining - 1,
          }));
        }, 1000);
        
        set({
          isRunning: true,
          timer,
        });
      },
      
      pauseTimer: () => {
        const { timer } = get();
        if (timer) {
          clearInterval(timer);
        }
        set({
          isRunning: false,
          timer: null,
        });
      },
      
      resetTimer: () => {
        const { timer, pomodoroSettings, currentSession } = get();
        if (timer) {
          clearInterval(timer);
        }
        
        const duration = currentSession === 'work' 
          ? pomodoroSettings.workDuration 
          : pomodoroSettings.breakDuration;
        
        set({
          isRunning: false,
          timeRemaining: duration,
          timer: null,
        });
      },
      
      updateSettings: (settings) => {
        const { timer } = get();
        if (timer) {
          clearInterval(timer);
        }
        
        set((state) => ({
          pomodoroSettings: { ...state.pomodoroSettings, ...settings },
          timeRemaining: settings.workDuration || state.timeRemaining,
          isRunning: false,
          timer: null,
        }));
      },
      
      updatePomodoroStats: (minutes) => {
        set((state) => ({
          pomodoroStats: {
            ...state.pomodoroStats,
            totalMinutesToday: state.pomodoroStats.totalMinutesToday + minutes,
          },
        }));
      },

      clearAllData: () => {
        const { timer } = get();
        if (timer) {
          clearInterval(timer);
        }
        set(DEFAULT_STATE);
      },
      
      // Task Actions
      addTask: (text) => {
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              id: crypto.randomUUID(),
              text,
              completed: false,
            },
          ],
        }));
      },
      
      toggleTask: (id) => {
        set((state) => {
          const task = state.tasks.find(t => t.id === id);
          if (task && !task.completed) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#1DB954', '#ffffff', '#191414'],
            });
          }
          return {
            tasks: state.tasks.map((task) =>
              task.id === id ? { ...task, completed: !task.completed } : task
            ),
          };
        });
      },
      
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },
      
      // Playlist Actions
      setPlaylist: (playlist) => set({ playlist }),
      
      setCurrentVideo: (index) => {
        const state = get();
        const { videos, shuffle } = state.playlist;
        
        if (shuffle) {
          // If shuffling, create a new shuffled array and update the playlist
          const shuffledVideos = shuffleArray(videos);
          set({
            playlist: {
              ...state.playlist,
              videos: shuffledVideos,
              currentIndex: 0,
            },
          });
        } else {
          set({
            playlist: {
              ...state.playlist,
              currentIndex: index,
            },
          });
        }
      },
      
      setIsPlaying: (isPlaying) => {
        set((state) => ({
          playlist: {
            ...state.playlist,
            isPlaying,
          },
        }));
      },
      
      setVolume: (volume) => {
        set((state) => ({
          playlist: {
            ...state.playlist,
            volume,
          },
        }));
      },

      setAudioOnly: (audioOnly) => {
        set((state) => ({
          playlist: {
            ...state.playlist,
            audioOnly,
          },
        }));
      },

      toggleShuffle: () => {
        const state = get();
        const { videos, shuffle } = state.playlist;
        
        if (!shuffle) {
          // When enabling shuffle, create a shuffled copy of the videos
          const shuffledVideos = shuffleArray(videos);
          set({
            playlist: {
              ...state.playlist,
              videos: shuffledVideos,
              currentIndex: 0,
              shuffle: true,
            },
          });
        } else {
          // When disabling shuffle, restore original order
          set({
            playlist: {
              ...state.playlist,
              shuffle: false,
              currentIndex: 0,
            },
          });
        }
      },

      toggleRepeat: () => {
        set((state) => ({
          playlist: {
            ...state.playlist,
            repeat: !state.playlist.repeat,
          },
        }));
      },
    }),
    {
      name: 'focus-app-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any) => {
        // Ensure all required fields exist with defaults
        return {
          ...DEFAULT_STATE,
          ...persistedState,
          playlist: {
            ...DEFAULT_STATE.playlist,
            ...persistedState?.playlist,
          },
        };
      },
    }
  )
);