// src/App.tsx
import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500 font-medium">
        Memuat data...
      </div>
    );
  }

  // Jika belum login, tampilkan halaman Login/Register
  if (!isAuthenticated) {
    return <Auth />;
  }

  // Jika sudah login, jalankan aplikasi utama
  return <Dashboard />;
}