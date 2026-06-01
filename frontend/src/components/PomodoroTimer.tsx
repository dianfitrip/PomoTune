import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings2, X } from 'lucide-react';
import { useStore } from '../store/useStore';

export const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak'>('pomodoro');
  const [customFocus, setCustomFocus] = useState(25);
  const [customBreak, setCustomBreak] = useState(5);
  const [timeLeft, setTimeLeft] = useState(customFocus * 60);
  const [isRunning, setIsRunning] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'focus' | 'break'>('focus');
  const [tempInput, setTempInput] = useState('');

  // Menarik Data Session & Tugas dari Store
  const { pauseTrack, playTrack, sessionConfig, setSessionConfig, activeTaskId, tasks } = useStore();

  const playAlarm = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playBeep = (time: number, freq: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle'; 
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(1.0, time); 
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);
        osc.start(time);
        osc.stop(time + 0.4);
      };
      playBeep(ctx.currentTime, 900);
      playBeep(ctx.currentTime + 0.4, 750);
      playBeep(ctx.currentTime + 0.8, 900);
      playBeep(ctx.currentTime + 1.2, 750);
    } catch (e) {
      console.error("Audio API error");
    }
  };

  // EFEK PENERIMA PERINTAH MULAI DARI DAFTAR TUGAS
  useEffect(() => {
    if (sessionConfig) {
      setMode('pomodoro');
      setCustomFocus(sessionConfig.duration);
      setTimeLeft(sessionConfig.duration * 60);
      setIsRunning(true);
      
      if (sessionConfig.audioId) {
        playTrack(sessionConfig.audioId);
      } else {
        pauseTrack();
      }
      setSessionConfig(null); // Bersihkan perintah setelah dijalankan
    }
  }, [sessionConfig, playTrack, pauseTrack, setSessionConfig]);

  // Efek Timer Berjalan
  useEffect(() => {
    let interval: number | undefined;
    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      pauseTrack(); 
      playAlarm();  
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, pauseTrack]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'pomodoro') setTimeLeft(customFocus * 60);
    if (mode === 'shortBreak') setTimeLeft(customBreak * 60);
  };

  const switchMode = (newMode: 'pomodoro' | 'shortBreak') => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === 'pomodoro') setTimeLeft(customFocus * 60);
    if (newMode === 'shortBreak') setTimeLeft(customBreak * 60);
  };

  const handleFocusChange = (val: number) => {
    setCustomFocus(val);
    if (mode === 'pomodoro' && !isRunning) setTimeLeft(val * 60);
  };
  const handleBreakChange = (val: number) => {
    setCustomBreak(val);
    if (mode === 'shortBreak' && !isRunning) setTimeLeft(val * 60);
  };

  const openCustomModal = (type: 'focus' | 'break') => {
    setModalType(type);
    setTempInput(type === 'focus' ? customFocus.toString() : customBreak.toString());
    setShowModal(true);
  };

  const saveCustomModal = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(tempInput);
    if (!isNaN(val) && val > 0) {
      modalType === 'focus' ? handleFocusChange(val) : handleBreakChange(val);
      setShowModal(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const focusPresets = [25, 45, 60];
  const breakPresets = [5, 10, 15];

  const activeTask = tasks.find(t => t.id === activeTaskId);

  return (
    <div className="flex flex-col items-center w-full relative">
      
      {/* LABEL TUGAS AKTIF DI ATAS TIMER */}
      {activeTask && (
        <div className="w-full mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Sedang Mengerjakan</span>
          <span className="text-sm font-bold text-gray-800">{activeTask.text}</span>
        </div>
      )}

      {/* Pilihan Mode Timer */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-8 w-full max-w-sm">
        <button onClick={() => switchMode('pomodoro')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'pomodoro' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>Fokus</button>
        <button onClick={() => switchMode('shortBreak')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'shortBreak' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>Istirahat</button>
      </div>

      <div className="relative flex justify-center items-center w-48 h-48 rounded-full border-8 border-emerald-50 mb-8 shadow-inner bg-white">
        <div className="absolute inset-0 rounded-full border-8 border-emerald-500 opacity-20"></div>
        <div className="flex flex-col items-center">
          <span className="text-5xl font-bold text-gray-800 tracking-tight">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
          <span className="text-sm text-gray-500 font-medium mt-1">
            {mode === 'pomodoro' ? 'Sesi Fokus' : 'Waktu Santai'}
          </span>
        </div>
      </div>

      {/* Tombol Kontrol */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={toggleTimer} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold shadow-md transition-all transform hover:scale-105">
          {isRunning ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          {isRunning ? 'Jeda' : 'Mulai'}
        </button>
        <button onClick={resetTimer} className="p-3 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-emerald-600 rounded-full shadow-sm transition-all" title="Reset Timer">
          <RotateCcw size={20} />
        </button>
      </div>

      <div className="w-full pt-6 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Settings2 size={16} className="text-gray-400" />
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Atur Durasi (Menit)</h4>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-2">Fokus</p>
            <div className="flex gap-2">
              {focusPresets.map(m => (
                <button key={`focus-${m}`} onClick={() => handleFocusChange(m)} disabled={isRunning && mode === 'pomodoro'} className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all disabled:opacity-50 ${customFocus === m ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300'}`}>{m}m</button>
              ))}
              <button onClick={() => openCustomModal('focus')} disabled={isRunning && mode === 'pomodoro'} className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all disabled:opacity-50 ${!focusPresets.includes(customFocus) ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300'}`}>
                {!focusPresets.includes(customFocus) ? `${customFocus}m` : 'Kustom'}
              </button>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium mb-2">Istirahat</p>
            <div className="flex gap-2">
              {breakPresets.map(m => (
                <button key={`break-${m}`} onClick={() => handleBreakChange(m)} disabled={isRunning && mode === 'shortBreak'} className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all disabled:opacity-50 ${customBreak === m ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300'}`}>{m}m</button>
              ))}
              <button onClick={() => openCustomModal('break')} disabled={isRunning && mode === 'shortBreak'} className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all disabled:opacity-50 ${!breakPresets.includes(customBreak) ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-300'}`}>
                {!breakPresets.includes(customBreak) ? `${customBreak}m` : 'Kustom'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">Set Durasi {modalType === 'focus' ? 'Fokus' : 'Istirahat'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={saveCustomModal}>
              <div className="flex items-center justify-center gap-2 mb-8">
                <input type="number" min="1" value={tempInput} onChange={(e) => setTempInput(e.target.value)} className="w-24 px-4 py-3 bg-gray-50 text-gray-800 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-center text-2xl font-bold transition-colors" autoFocus />
                <span className="text-gray-500 font-medium">menit</span>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">Batal</button>
                <button type="submit" disabled={!tempInput.trim() || parseInt(tempInput) < 1} className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-medium rounded-xl shadow-sm transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};