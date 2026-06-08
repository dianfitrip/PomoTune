// frontend/src/components/Settings.tsx
import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, HelpCircle } from 'lucide-react';

export function Settings() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [username, setUsername] = useState('');
  
  // State untuk Toast (Notifikasi Pojok)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  // State untuk Modal Konfirmasi
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        if (payload && payload.username) {
          setUsername(payload.username);
        }
      } catch (error) {
        console.error("Gagal membaca payload token:", error);
      }
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); // Hilang otomatis setelah 3 detik
  };

  // Fungsi saat tombol "Simpan" ditekan di form (Memunculkan Modal)
  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('Kata sandi baru dan konfirmasi tidak cocok.', 'error');
      return;
    }
    setShowConfirm(true); 
  };

  // Fungsi yang benar-benar mengirim API ubah password
  const executeChangePassword = async () => {
    setShowConfirm(false); 
    setIsChangingPassword(true);
    
    try {
      // PERHATIKAN: URL sudah diperbaiki menjadi /api/change-password
      const response = await fetch('http://localhost:5000/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showToast('Kata sandi berhasil diubah!', 'success');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(data.message || 'Gagal mengubah kata sandi.', 'error');
      }
    } catch (error) {
      showToast('Terjadi kesalahan pada server. Pastikan backend menyala.', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <main className="p-8 flex flex-col bg-[#FAFCFB] flex-1 overflow-y-auto relative">
      
      {/* 1. FLOATING TOAST NOTIFICATION */}
      {toast && (
        <div className={`fixed top-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border bg-white animate-in slide-in-from-top-5 fade-in duration-300 ${toast.type === 'success' ? 'border-emerald-500 text-emerald-800' : 'border-red-500 text-red-800'}`}>
          {toast.type === 'success' ? (
            <CheckCircle2 size={24} className="text-emerald-500" />
          ) : (
            <AlertCircle size={24} className="text-red-500" />
          )}
          <p className="font-semibold">{toast.message}</p>
          <button onClick={() => setToast(null)} className="ml-4 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>
      )}

      {/* 2. MODAL KONFIRMASI UBAH PASSWORD */}
      {showConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-5">
                <HelpCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Perubahan</h3>
              <p className="text-gray-600 mb-8 font-medium">Apakah kamu yakin ingin mengubah kata sandi untuk akun ini?</p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 text-gray-600 font-semibold bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Batal</button>
                <button onClick={executeChangePassword} className="flex-1 py-3 text-white font-semibold bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm">Ya, Ubah</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="mb-8">
        <h2 className="text-xl font-bold text-gray-800">Pengaturan Akun</h2>
        <p className="text-sm text-gray-500 mt-1 font-medium">Kelola profil dan keamanan akun Anda di sini.</p>
      </header>

      <div className="max-w-2xl bg-white p-8 rounded-3xl border border-gray-200 shadow-sm mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Profil Pengguna</h3>
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
          <input 
            type="text" 
            value={username || 'Memuat...'} 
            disabled 
            className="w-full px-4 py-3 bg-gray-50 text-gray-500 rounded-xl border border-gray-200 outline-none cursor-not-allowed font-medium" 
          />
          <p className="text-xs text-gray-500 mt-2">Username digunakan untuk masuk dan tidak dapat diubah.</p>
        </div>
      </div>

      <div className="max-w-2xl bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Ubah Kata Sandi</h3>
        
        <form onSubmit={handlePreSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Kata Sandi Lama</label>
            <input 
              type="password" 
              value={oldPassword} 
              onChange={(e) => setOldPassword(e.target.value)} 
              className="w-full px-4 py-3 bg-white text-gray-800 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Kata Sandi Baru</label>
            <input 
              type="password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              className="w-full px-4 py-3 bg-white text-gray-800 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Konfirmasi Kata Sandi Baru</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="w-full px-4 py-3 bg-white text-gray-800 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors" 
              required 
            />
          </div>
          <div className="pt-4">
            <button type="submit" disabled={isChangingPassword} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-medium rounded-xl shadow-sm transition-colors">
              {isChangingPassword ? 'Menyimpan...' : 'Simpan Kata Sandi'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}