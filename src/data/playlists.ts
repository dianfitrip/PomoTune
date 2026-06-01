import { PlaylistCategory } from '../types';

export const playlistCategories: PlaylistCategory[] = [
  {
    id: 'coding-focus',
    name: 'Coding & Focus',
    description: 'Music to help you stay focused while coding',
    icon: '💻',
    thumbnail: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    playlists: [
      {
        id: '1',
        title: 'Lofi Coding Mix',
        url: 'https://www.youtube.com/playlist?list=PLq1G6UjzVsqgMKJ-ee6J_2opPO5g7DLQ5'
      }
    ]
  },
  {
    id: 'reading',
    name: 'Reading Time',
    description: 'Perfect background music for reading sessions',
    icon: '📖',
    thumbnail: 'https://images.pexels.com/photos/1472841/pexels-photo-1472841.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    playlists: [
      {
        id: '1',
        title: 'Reading Music Mix',
        url: 'https://www.youtube.com/playlist?list=PL_G54xR2lrTuqjSaGjTxmGJzSCKwyUycs'
      }
    ]
  },
  {
    id: 'study-revision',
    name: 'Revision & Study',
    description: 'Perfect background music for study sessions',
    icon: '📚',
    thumbnail: 'https://images.pexels.com/photos/267582/pexels-photo-267582.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    playlists: [
      {
        id: '1',
        title: 'Study Focus Mix',
        url: 'https://www.youtube.com/playlist?list=PLq1G6UjzVsqgrvkZ-cIq_XSLbdIQDT0Zu'
      }
    ]
  },
  {
    id: 'sleep-relax',
    name: 'Sleeping & Relaxation',
    description: 'Calming music for better sleep and relaxation',
    icon: '😴',
    thumbnail: 'https://images.pexels.com/photos/62640/pexels-photo-62640.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    playlists: [
      {
        id: '1',
        title: 'Sleep & Relaxation',
        url: 'https://www.youtube.com/watch?v=rA7m3iKpuko'
      }
    ]
  },
  {
    id: 'gym-workout',
    name: 'Gym & Workout',
    description: 'High-energy music for intense workouts',
    icon: '💪',
    thumbnail: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    playlists: [
      {
        id: '1',
        title: 'Workout Mix',
        url: 'https://www.youtube.com/playlist?list=PLq1G6UjzVsqg5MJHhhPeGi7R1zPT5UN1e'
      }
    ]
  },
  {
    id: 'chill-vibes',
    name: 'Chill & Vibes',
    description: 'Laid-back music for relaxed moments',
    icon: '🎵',
    thumbnail: 'https://images.pexels.com/photos/928447/pexels-photo-928447.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    playlists: [
      {
        id: '1',
        title: 'Chill Mix',
        url: 'https://www.youtube.com/playlist?list=PLq1G6UjzVsqiS0hSGhNp15tltfYsnkpqA'
      }
    ]
  },
  {
    id: 'road-trip',
    name: 'Road Trip & Travel',
    description: 'Perfect soundtrack for your adventures',
    icon: '🚗',
    thumbnail: 'https://images.pexels.com/photos/386009/pexels-photo-386009.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    playlists: [
      {
        id: '1',
        title: 'Road Trip Mix',
        url: 'https://www.youtube.com/watch?v=nO2um5nQmAA'
      }
    ]
  },
  {
    id: 'party',
    name: 'Party & Celebration',
    description: 'Upbeat music for celebrations',
    icon: '🎉',
    thumbnail: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    playlists: [
      {
        id: '1',
        title: 'Party Mix',
        url: 'https://www.youtube.com/playlist?list=PLq1G6UjzVsqjh0p-wvybs5rxVb9GucJWb'
      }
    ]
  },
  {
    id: 'motivation',
    name: 'Motivation & Inspiration',
    description: 'Music to keep you motivated',
    icon: '🔥',
    thumbnail: 'https://images.pexels.com/photos/461593/pexels-photo-461593.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    playlists: [
      {
        id: '1',
        title: 'Motivational Mix',
        url: 'https://www.youtube.com/playlist?list=PLq1G6UjzVsqhdA1UtHfyKmJA8dKcOefnT'
      }
    ]
  },
  {
    id: 'rainy-day',
    name: 'Rainy Day & Cozy',
    description: 'Cozy tunes for rainy days',
    icon: '🌧️',
    thumbnail: 'https://images.pexels.com/photos/125510/pexels-photo-125510.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    playlists: [
      {
        id: '1',
        title: 'Rainy Day Mix',
        url: 'https://www.youtube.com/watch?v=3MBTtuEXMpc'
      }
    ]
  },
  {
    id: 'podcast',
    name: 'Podcast & Audiobooks',
    description: 'Educational and entertaining content',
    icon: '🎙️',
    thumbnail: 'https://images.pexels.com/photos/7983617/pexels-photo-7983617.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    playlists: [
      {
        id: '1',
        title: 'Best Podcasts',
        url: 'https://www.youtube.com/watch?v=Tuw8hxrFBH8'
      }
    ]
  },
  {
    id: 'meditation',
    name: 'Meditation & Healing',
    description: 'Peaceful music for meditation',
    icon: '🧘‍♀️',
    thumbnail: 'https://images.pexels.com/photos/1051449/pexels-photo-1051449.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    playlists: [
      {
        id: '1',
        title: 'Meditation Mix',
        url: 'https://www.youtube.com/watch?v=5PIBMLvcAzc'
      }
    ]
  },
  {
    id: 'retro',
    name: 'Retro & Old School',
    description: '80s, 90s, and golden classics',
    icon: '🎸',
    thumbnail: 'https://images.pexels.com/photos/3920847/pexels-photo-3920847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    playlists: [
      {
        id: '1',
        title: 'Retro Mix',
        url: 'https://www.youtube.com/watch?v=sCIiVN0zIGE'
      }
    ]
  }
];