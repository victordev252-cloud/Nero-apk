import React, { useState } from 'react';
import { X, Calendar, Clock, Bell, Tag } from 'lucide-react';
import { bridge } from '../services/bridge';

export function CreateItemModal({ type, onClose, onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');
  const [priority, setPriority] = useState('MEDIUM');
  const [reminder, setReminder] = useState(15);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const id = 'item_' + Date.now();
    const now = new Date().toISOString();

    if (type === 'task') {
      bridge.execute(
        "INSERT INTO tasks (id, title, description, due_date, due_time, priority, completed, reminder_minutes, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?)",
        [id, title, description, date, time, priority, reminder, now, now]
      );
      
      // Schedule Native Android Reminder if time specified
      if (time) {
        const triggerMillis = new Date(`${date}T${time}:00`).getTime() - (reminder * 60 * 1000);
        if (triggerMillis > Date.now()) {
          bridge.scheduleReminder(id, triggerMillis, `Task: ${title}`, `Due in ${reminder} minutes`);
        }
      }
    } else if (type === 'alarm') {
      bridge.execute(
        "INSERT INTO alarms (id, title, time, repeat_days, enabled, created_at, updated_at) VALUES (?, ?, ?, '1,2,3,4,5', 1, ?, ?)",
        [id, title, time, now, now]
      );
      
      const [hours, minutes] = time.split(':');
      const target = new Date();
      target.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      if (target.getTime() < Date.now()) target.setDate(target.getDate() + 1);
      
      bridge.scheduleAlarm(id, target.getTime(), title);
    }

    if (onCreated) onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#11131A] border border-[#171A22] w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 space-y-5 animate-in slide-in-from-bottom duration-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#F5F5F7] capitalize">New {type}</h2>
          <button onClick={onClose} className="p-2 text-[#9296A3] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#9296A3] block mb-1">TITLE</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Doctor Appointment"
              className="w-full bg-[#171A22] border border-[#171A22] focus:border-[#7C5CFC] rounded-xl px-4 py-3 text-[#F5F5F7] outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#9296A3] block mb-1">DESCRIPTION</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              rows={2}
              className="w-full bg-[#171A22] border border-[#171A22] focus:border-[#7C5CFC] rounded-xl px-4 py-2.5 text-[#F5F5F7] outline-none text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#9296A3] block mb-1">DATE</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#171A22] border border-[#171A22] rounded-xl px-3 py-2.5 text-sm text-[#F5F5F7] outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#9296A3] block mb-1">TIME</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-[#171A22] border border-[#171A22] rounded-xl px-3 py-2.5 text-sm text-[#F5F5F7] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#9296A3] block mb-1">REMINDER BEFORE</label>
            <select
              value={reminder}
              onChange={(e) => setReminder(Number(e.target.value))}
              className="w-full bg-[#171A22] border border-[#171A22] rounded-xl px-3 py-2.5 text-sm text-[#F5F5F7] outline-none"
            >
              <option value={0}>At event time</option>
              <option value={5}>5 minutes before</option>
              <option value={15}>15 minutes before</option>
              <option value={30}>30 minutes before</option>
              <option value={60}>1 hour before</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#7C5CFC] hover:bg-[#6A49F2] text-white font-bold py-3.5 rounded-xl shadow-lg transition-all mt-2"
          >
            Save {type}
          </button>
        </form>
      </div>
    </div>
  );
}
