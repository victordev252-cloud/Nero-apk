import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin } from 'lucide-react';
import { bridge } from '../services/bridge';

export function CalendarView({ onOpenCreate }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEventsForDate(selectedDate);
  }, [selectedDate]);

  const loadEventsForDate = (dateStr) => {
    const data = bridge.query(
      "SELECT * FROM appointments WHERE start_time LIKE ? || '%'",
      [dateStr]
    );
    setEvents(data || []);
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const changeMonth = (delta) => {
    const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1);
    setCurrentMonth(newMonth);
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = new Date(year, month, 1).getDay();

  const daysArray = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    daysArray.push({ dayNumber: d, fullDate: formattedDate });
  }

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-5">
      {/* Calendar Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#F5F5F7]">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h1>
        <div className="flex space-x-2">
          <button onClick={() => changeMonth(-1)} className="p-2 bg-[#11131A] border border-[#171A22] rounded-xl text-[#9296A3]">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => changeMonth(1)} className="p-2 bg-[#11131A] border border-[#171A22] rounded-xl text-[#9296A3]">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#9296A3]">
        <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {daysArray.map((item, idx) => {
          if (!item) return <div key={`empty-${idx}`} className="h-10" />;
          const isSelected = item.fullDate === selectedDate;
          const isToday = item.fullDate === new Date().toISOString().split('T')[0];

          return (
            <button
              key={item.fullDate}
              onClick={() => setSelectedDate(item.fullDate)}
              className={`h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-[#7C5CFC] text-white font-bold'
                  : isToday
                  ? 'border border-[#7C5CFC] text-[#7C5CFC]'
                  : 'bg-[#11131A] text-[#F5F5F7] hover:bg-[#171A22]'
              }`}
            >
              {item.dayNumber}
            </button>
          );
        })}
      </div>

      {/* Timeline Events for Selected Date */}
      <div className="pt-2">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-[#9296A3]">EVENTS ({selectedDate})</h3>
          <button onClick={() => onOpenCreate('appointment')} className="text-xs text-[#7C5CFC] flex items-center font-semibold">
            <Plus className="w-4 h-4 mr-1" /> Add Event
          </button>
        </div>

        {events.length === 0 ? (
          <div className="bg-[#11131A] border border-[#171A22] p-6 rounded-2xl text-center text-[#9296A3] text-sm">
            No events scheduled for this day.
          </div>
        ) : (
          <div className="space-y-2.5">
            {events.map((evt) => (
              <div key={evt.id} className="bg-[#11131A] border border-[#171A22] p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="text-base font-bold text-[#F5F5F7]">{evt.title}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">
                    {evt.priority || 'NORMAL'}
                  </span>
                </div>
                {evt.description && <p className="text-xs text-[#9296A3]">{evt.description}</p>}
                <div className="flex space-x-4 text-xs text-[#9296A3] pt-1">
                  <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-[#7C5CFC]" /> {evt.start_time.split(' ')[1] || evt.start_time}</span>
                  {evt.location && <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-blue-400" /> {evt.location}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
