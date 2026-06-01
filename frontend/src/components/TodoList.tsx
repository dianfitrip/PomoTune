import React, { useState } from 'react';
import { Check, Trash2, Circle, Edit2, Play, Save, X } from 'lucide-react';
import { useStore } from '../store/useStore';

interface TodoListProps {
  onStartTask?: (taskId: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ onStartTask }) => {
  const { tasks, toggleTask, deleteTask, editTask } = useStore();
  
  // State untuk mode edit baris tugas
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleEditClick = (task: any) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const handleSaveEdit = (id: string) => {
    if (editText.trim()) {
      editTask(id, editText.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-3 overflow-y-auto pb-4 pr-2">
        {tasks.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-sm">Belum ada tugas. Klik tombol "+ Tambah Tugas" di atas.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-4 p-4 border rounded-2xl group transition-all ${
                task.completed ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200 hover:border-emerald-200 hover:shadow-sm'
              }`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`p-1 rounded-full flex items-center justify-center transition-colors ${
                  task.completed ? 'text-emerald-600 bg-emerald-100' : 'text-gray-300 hover:text-emerald-500'
                }`}
              >
                {task.completed ? <Check size={20} /> : <Circle size={20} />}
              </button>
              
              {/* MODE EDIT / TAMPILAN TEKS */}
              {editingId === task.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEdit(task.id) }}
                    className="flex-1 px-3 py-1.5 text-sm bg-white border border-emerald-300 rounded-lg outline-none focus:ring-1 focus:ring-emerald-500"
                    autoFocus
                  />
                  <button onClick={() => handleSaveEdit(task.id)} className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-md transition-colors"><Save size={16} /></button>
                  <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-400 hover:bg-gray-200 rounded-md transition-colors"><X size={16} /></button>
                </div>
              ) : (
                <>
                  <span className={`flex-1 text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                    {task.text}
                  </span>
                  
                  {/* TOMBOL AKSI: Mulai, Edit, Hapus */}
                  {!task.completed && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onStartTask?.(task.id)} title="Mulai Sesi Fokus" className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                        <Play size={16} />
                      </button>
                      <button onClick={() => handleEditClick(task)} title="Edit Tugas" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => deleteTask(task.id)} title="Hapus Tugas" className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};