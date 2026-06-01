export interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

export interface PomodoroStats {
  totalMinutesToday: number;
  sessionsCompleted: number;
}

export interface PomodoroSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
}

export interface PlaylistData {
  videos: Video[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
  audioOnly: boolean;
  shuffle: boolean;
  repeat: boolean;
}

export interface PlaylistCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  thumbnail: string;
  playlists: CategoryPlaylist[];
}

export interface CategoryPlaylist {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
}