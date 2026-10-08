import React, { useState, useEffect } from 'react';
import { Plus, Bell, Clock, Calendar as CalIcon, CheckCircle, AlertCircle, Search } from 'lucide-react';
import { bridge } from '../services/bridge';

export function HomeDashboard({ onOpenCreate, onOpenSearch, onOpenNotifications, i18n }) {
  const [tasks, setTasks] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [userName, setUserName] = useState('Victor');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const taskData = bridge.query("SELECT * FROM tasks WHERE due_date = date('now')");
    const apptData = bridge.query("SELECT * FROM appointments WHERE start_time LIKE date('now') || '%'");
    const settings = bridge.query("SELECT value FROM settings WHERE key = 'user_name'");
    
    setTasks(taskData || []);
    setAppointments(apptData || []);
    if (settings && settings[0]) setUserName(settings[0].value);
  };

  const toggleTask = (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    bridge.execute("UPDATE tasks SET completed = ? WHERE id = ?", [newStatus, id]);
    loadData();
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#F5F5F7]">
            {i18n.t('home.greeting_afternoon')}, {userName}
          </h1>
          <p className="text-sm text-[#9296A3]">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div className="flex space-x-2">
          <button onClick={onOpenSearch} className="p-2.5 rounded-xl bg-[#11131A] text-[#9296A3] hover:text-white border border-[#171A22]">
            <Search className="w-5 h-5" />
          </button>
          <button onClick={onOpenNotifications} className="p-2.5 rounded-xl bg-[#11131A] text-[#9296A3] hover:text-white border border-[#171A22] relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#7C5CFC] rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Next Up Hero Card */}
      <div className="bg-gradient-to-br from-[#7C5CFC] to-[#5A38FD] p-5 rounded-2xl shadow-xl text-white space-y-3">
        <div className="flex justify-between items-center text-xs font-semibold tracking-wider opacity-80">
          <span>{i18n.t('home.next_up')}</span>
          <span className="bg-white/20 px-2.5 py-1 rounded-full">In 1h 15m</span>
        </div>
        <div>
          <h2 className="text-xl font-bold">Team Strategy Sync</h2>
          <p className="text-sm opacity-90 flex items-center mt-1">
            <Clock className="w-4 h-4 mr-1.5" /> 04:30 PM - 05:30 PM
          </p>
        </div>
        <div className="flex space-x-3 pt-2">
          <button className="flex-1 bg-white text-[#7C5CFC] font-semibold py-2 px-4 rounded-xl text-sm shadow">
            View Details
          </button>
          <button className="bg-white/20 hover:bg-white/30 font-semibold py-2 px-4 rounded-xl text-sm">
            Snooze 10m
          </button>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#11131A] border border-[#171A22] p-3.5 rounded-2xl text-center">
          <span className="text-2xl font-bold text-[#7C5CFC]">{tasks.length}</span>
          <p className="text-xs text-[#9296A3] mt-1">{i18n.t('home.tasks')}</p>
        </div>
        <div className="bg-[#11131A] border border-[#171A22] p-3.5 rounded-2xl text-center">
          <span className="text-2xl font-bold text-[#3B82F6]">{appointments.length}</span>
          <p className="text-xs text-[#9296A3] mt-1">{i18n.t('home.appointments')}</p>
        </div>
        <div className="bg-[#11131A] border border-[#171A22] p-3.5 rounded-2xl text-center">
          <span className="text-2xl font-bold text-[#10B981]">3</span>
          <p className="text-xs text-[#9296A3] mt-1">{i18n.t('home.reminders')}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-[#9296A3] mb-3">{i18n.t('home.quick_actions')}</h3>
        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => onOpenCreate('task')} className="bg-[#11131A] border border-[#171A22] p-3 rounded-xl flex flex-col items-center space-y-1.5 text-xs text-[#F5F5F7] hover:border-[#7C5CFC]">
            <CheckCircle className="w-5 h-5 text-[#7C5CFC]" />
            <span>Task</span>
          </button>
          <button onClick={() => onOpenCreate('appointment')} className="bg-[#11131A] border border-[#171A22] p-3 rounded-xl flex flex-col items-center space-y-1.5 text-xs text-[#F5F5F7] hover:border-[#3B82F6]">
            <CalIcon className="w-5 h-5 text-[#3B82F6]" />
            <span>Event</span>
          </button>
          <button onClick={() => onOpenCreate('alarm')} className="bg-[#11131A] border border-[#171A22] p-3 rounded-xl flex flex-col items-center space-y-1.5 text-xs text-[#F5F5F7] hover:border-[#EF4444]">
            <Clock className="w-5 h-5 text-[#EF4444]" />
            <span>Alarm</span>
          </button>
          <button onClick={() => onOpenCreate('reminder')} className="bg-[#11131A] border border-[#171A22] p-3 rounded-xl flex flex-col items-center space-y-1.5 text-xs text-[#F5F5F7] hover:border-[#10B981]">
            <AlertCircle className="w-5 h-5 text-[#10B981]" />
            <span>Reminder</span>
          </button>
        </div>
      </div>

      {/* Today Schedule Timeline */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-base font-bold text-[#F5F5F7]">Today's Schedule</h3>
          <span className="text-xs text-[#7C5CFC] font-medium">Smart Plan</span>
        </div>
        <div className="space-y-2.5">
          {tasks.map((task) => (
            <div key={task.id} className="bg-[#11131A] border border-[#171A22] p-3.5 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleTask(task.id, task.completed)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                    task.completed ? 'bg-[#10B981] border-[#10B981]' : 'border-[#9296A3]'
                  }`}
                >
                  {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
                </button>
                <div>
                  <h4 className={`text-sm font-medium ${task.completed ? 'line-through text-[#9296A3]' : 'text-[#F5F5F7]'}`}>
                    {task.title}
                  </h4>
                  <p className="text-xs text-[#9296A3]">{task.due_time || 'All Day'}</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                task.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
