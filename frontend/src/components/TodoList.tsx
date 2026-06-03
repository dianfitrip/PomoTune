import React from 'react';
import { Play, CheckCircle2, Circle, Clock, Tag, Flag, Trash2, Activity, X } from 'lucide-react';
import { useStore, Task } from '../store/useStore';

export function TodoList({ onStartTask }: { onStartTask: (id: string) => void }) {
  // Tambahkan setActiveTask di sini
  const { tasks, toggleTask, deleteTask, activeTaskId, setActiveTask } = useStore();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-2xl bg-white border border-gray-100 border-dashed">
        <p className="text-gray-400 font-medium text-sm">Belum ada tugas.</p>
        <p className="text-gray-400 font-medium text-sm">Klik tombol "+ Tambah Tugas" untuk mulai.</p>
      </div>
    );
  }

  const getPriorityColors = (priority: string) => {
    switch (priority) {
      case 'Tinggi': return 'text-red-600 bg-red-50 border-red-100';
      case 'Sedang': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Rendah': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const formatDeadline = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-3">
      {tasks.map((task: Task) => {
        const isActive = String(task.id) === String(activeTaskId);

        return (
          <div 
            key={task.id} 
            className={`relative group flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border transition-all ${
              task.completed 
                ? 'bg-white border-gray-100 opacity-60' 
                : isActive 
                  ? 'bg-emerald-50/50 border-emerald-400 shadow-md ring-1 ring-emerald-400' 
                  : 'bg-white border-gray-200 hover:border-emerald-200 hover:shadow-sm'
            }`}
          >
            {/* Animasi Titik Hijau untuk Tugas Aktif */}
            {isActive && !task.completed && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
              </span>
            )}

            <div className="flex-1 flex items-start gap-4">
              <button onClick={() => toggleTask(task.id)} className="mt-0.5 shrink-0 text-emerald-600 hover:text-emerald-700 transition-colors">
                {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} className="text-gray-300 group-hover:text-emerald-400" />}
              </button>
              
              <div className="flex-1">
                <h4 className={`text-base font-bold transition-all flex items-center gap-2 ${
                    task.completed ? 'text-gray-400 line-through' : isActive ? 'text-emerald-800' : 'text-gray-800'
                }`}>
                  {isActive && !task.completed && <Activity size={16} className="text-emerald-600 animate-pulse" />}
                  {task.text}
                </h4>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border ${getPriorityColors(task.priority)}`}>
                    <Flag size={12} /> {task.priority}
                  </span>
                  
                  {task.category && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold text-gray-500 bg-gray-100 border border-gray-200 uppercase tracking-wide">
                      <Tag size={12} /> {task.category}
                    </span>
                  )}
                  
                  {task.deadline && (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border ${new Date(task.deadline) < new Date() && !task.completed ? 'text-red-600 bg-red-50 border-red-100' : 'text-blue-600 bg-blue-50 border-blue-100'}`}>
                      <Clock size={12} /> {formatDeadline(task.deadline)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 shrink-0">
              {!task.completed && (
                isActive ? (
                  // Tombol Batalkan muncul hanya jika tugas sedang di-Fokus
                  <button 
                    onClick={() => {
                      // Memberikan sinyal ke timer agar berhenti dan mereset diri
                      window.dispatchEvent(new Event('cancel-focus-session'));
                      // Melepaskan status aktif pada tugas ini
                      setActiveTask(null);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 font-bold text-sm rounded-xl transition-colors bg-red-50 text-red-600 hover:bg-red-100 ring-1 ring-red-200 shadow-sm"
                  >
                    <X size={16} /> Batalkan
                  </button>
                ) : (
                  <button 
                    onClick={() => onStartTask(String(task.id))} 
                    className="flex items-center gap-1.5 px-4 py-2 font-bold text-sm rounded-xl transition-colors bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  >
                    <Play size={16} fill="currentColor" /> Fokus
                  </button>
                )
              )}
              <button onClick={() => deleteTask(task.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
            
          </div>
        );
      })}
    </div>
  );
}