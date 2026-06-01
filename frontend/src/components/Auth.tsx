import React, { useState } from 'react';
import { Brain, Lock, Mail, User } from 'lucide-react';

interface AuthProps {
  onLoginSuccess: (userData: any) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/login' : '/api/register';
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan');
      }

      if (isLogin) {
        // Simpan token ke localStorage dan update state utama
        localStorage.setItem('token', data.token);
        onLoginSuccess(data.user);
      } else {
        alert('Registrasi berhasil! Silakan login.');
        setIsLogin(true); // Pindah ke form login setelah daftar
        setPassword('');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-emerald-600 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full text-emerald-600 mb-4 shadow-sm">
            <Brain size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">FocusFlow</h1>
          <p className="text-emerald-100 text-sm">Masuk untuk menyimpan statistik fokusmu</p>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            {isLogin ? 'Selamat Datang Kembali!' : 'Buat Akun Baru'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User size={18} className="absolute left-4 top-3.5 text-gray-400" />
                <input type="text" placeholder="Nama Lengkap" value={name} onChange={(e) => setName(e.target.value)} required className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 transition-all text-sm" />
              </div>
            )}
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-3.5 text-gray-400" />
              <input type="email" placeholder="Alamat Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 transition-all text-sm" />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-3.5 text-gray-400" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 transition-all text-sm" />
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all mt-4 disabled:opacity-50">
              {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar Sekarang')}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-emerald-600 font-bold hover:underline">
              {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};