import React from 'react';
import { Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-8 py-6 px-4 border-t border-[#282828]">
      <div className="max-w-7xl mx-auto flex justify-center">
        <a
          href="https://github.com/amitdevv"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-[#1DB954] hover:text-[#1ed760] transition-colors"
        >
          <Github size={18} />
          <span>GitHub</span>
        </a>
      </div>
    </footer>
  );
};