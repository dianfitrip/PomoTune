import React, { useState } from 'react';
import { Brain, ArrowRight } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/login' : '/api/register';

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan pada server');
      }

      // Karena endpoint login dan register sekarang sama-sama mengembalikan token,
      // kita bisa menggunakan logika penyimpanan dan pengalihan yang sama.
      localStorage.setItem('token', data.token);
      window.location.href = '/';

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-sans items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        
        {/* Header Bagian Atas */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3 text-emerald-700 mb-3">
            <Brain size={36} className="font-bold" />
            <h1 className="text-3xl font-bold tracking-tight">FocusFlow</h1>
          </div>
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-widest">
            {isLogin ? 'Selamat Datang Kembali' : 'Mulai Perjalanan Anda'}
          </h2>
        </div>

        {/* Form Area */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-xl bg-red-50 p-4 border border-red-100">
              <p className="text-sm font-medium text-red-800 text-center">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full appearance-none rounded-xl border border-gray-300 px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm transition-all"
              placeholder="Masukkan username Anda"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full appearance-none rounded-xl border border-gray-300 px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full justify-center items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Memproses...' : (isLogin ? 'Masuk ke Dashboard' : 'Daftar & Mulai')}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Footer Area */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-600 font-medium">
            {isLogin ? 'Belum memiliki akun? ' : 'Sudah memiliki akun? '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setUsername('');
                setPassword('');
              }}
              className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}