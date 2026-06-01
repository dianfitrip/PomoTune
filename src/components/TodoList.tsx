import React, { useState } from 'react';
import { Plus, Check, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import confetti from 'canvas-confetti';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export const TodoList: React.FC = () => {
  const [newTask, setNewTask] = useState('');
  const { tasks, addTask, toggleTask, deleteTask } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      addTask(newTask.trim());
      setNewTask('');
    }
  };

  const handleToggleTask = (id: string, completed: boolean) => {
    toggleTask(id);
    if (!completed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1DB954', '#ffffff', '#191414'],
      });
    }
  };

  return (
    <div className="bg-[#282828] rounded-xl p-8">
      <h2 className="text-xl font-semibold mb-6">Tasks</h2>
      
      <form onSubmit={handleSubmit} className="flex gap-4 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-3 bg-[#404040] text-white rounded-lg border border-[#505050] focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954] outline-none transition-all"
        />
        <button
          type="submit"
          className="px-4 py-3 bg-[#1DB954] hover:bg-[#1ed760] text-black rounded-lg shadow-lg hover:shadow-xl transition-all"
        >
          <Plus size={20} />
        </button>
      </form>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        {tasks.map((task: Task) => (
          <div
            key={task.id}
            className="flex items-center gap-4 p-4 bg-[#404040] rounded-lg group hover:bg-[#505050] transition-all"
          >
            <button
              onClick={() => handleToggleTask(task.id, task.completed)}
              className={`p-2 rounded-full transition-all ${
                task.completed
                  ? 'bg-[#1DB954] text-black'
                  : 'bg-[#606060] text-gray-300 hover:bg-[#707070]'
              }`}
            >
              <Check size={16} />
            </button>
            
            <span
              className={`flex-1 text-sm ${
                task.completed
                  ? 'text-gray-400 line-through'
                  : 'text-white'
              }`}
            >
              {task.text}
            </span>
            
            <button
              onClick={() => deleteTask(task.id)}
              className="p-2 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};