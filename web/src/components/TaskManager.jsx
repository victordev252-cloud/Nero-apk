import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle, Trash2, Filter } from 'lucide-react';
import { bridge } from '../services/bridge';

export function TaskManager({ onOpenCreate }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    const data = bridge.query("SELECT * FROM tasks ORDER BY due_date ASC");
    setTasks(data || []);
  };

  const toggleTask = (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    bridge.execute("UPDATE tasks SET completed = ? WHERE id = ?", [newStatus, id]);
    loadTasks();
  };

  const deleteTask = (id) => {
    bridge.execute("DELETE FROM tasks WHERE id = ?", [id]);
    bridge.cancelSchedule(id);
    loadTasks();
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'PENDING') return t.completed === 0;
    if (filter === 'COMPLETED') return t.completed === 1;
    return true;
  });

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-[#F5F5F7]">Tasks</h1>
          <p className="text-xs text-[#9296A3]">Manage and conquer your day</p>
        </div>
        <button onClick={() => onOpenCreate('task')} className="bg-[#7C5CFC] p-2.5 rounded-xl text-white font-semibold text-xs flex items-center">
          <Plus className="w-4 h-4 mr-1" /> New Task
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 bg-[#11131A] p-1 rounded-xl border border-[#171A22]">
        {['ALL', 'PENDING', 'COMPLETED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
              filter === f ? 'bg-[#7C5CFC] text-white' : 'text-[#9296A3]'
            }`}
          >
            {f.toLowerCase()}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="bg-[#11131A] border border-[#171A22] p-8 rounded-2xl text-center text-[#9296A3] text-sm">
            No tasks found.
          </div>
        ) : (
          filteredTasks.map((t) => (
            <div key={t.id} className="bg-[#11131A] border border-[#171A22] p-3.5 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <button
                  onClick={() => toggleTask(t.id, t.completed)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                    t.completed ? 'bg-[#10B981] border-[#10B981]' : 'border-[#9296A3]'
                  }`}
                >
                  {t.completed === 1 && <CheckCircle className="w-4 h-4 text-white" />}
                </button>
                <div className="flex-1">
                  <h4 className={`text-sm font-medium ${t.completed ? 'line-through text-[#9296A3]' : 'text-[#F5F5F7]'}`}>
                    {t.title}
                  </h4>
                  <p className="text-xs text-[#9296A3]">{t.due_date} {t.due_time && `· ${t.due_time}`}</p>
                </div>
              </div>
              <button onClick={() => deleteTask(t.id)} className="p-2 text-[#9296A3] hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
