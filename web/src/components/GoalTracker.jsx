import React, { useState, useEffect } from 'react';
import { Target, Plus, Award } from 'lucide-react';
import { bridge } from '../services/bridge';

export function GoalTracker() {
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    const data = bridge.query("SELECT * FROM goals");
    setGoals(data || []);
  };

  const incrementProgress = (id, current, target) => {
    if (current >= target) return;
    const next = current + 1;
    bridge.execute("UPDATE goals SET progress = ? WHERE id = ?", [next, id]);
    loadGoals();
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-[#F5F5F7]">Goals & Routines</h1>
          <p className="text-xs text-[#9296A3]">Track consistency and build habits</p>
        </div>
        <button onClick={() => alert('Goal creation active')} className="bg-[#7C5CFC] p-2.5 rounded-xl text-white font-semibold text-xs flex items-center">
          <Plus className="w-4 h-4 mr-1" /> New Goal
        </button>
      </div>

      <div className="space-y-3">
        {goals.map((g) => {
          const percentage = Math.min(100, Math.round((g.progress / g.target) * 100));
          return (
            <div key={g.id} className="bg-[#11131A] border border-[#171A22] p-4 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-[#7C5CFC]/20 text-[#7C5CFC] rounded-xl">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F5F7]">{g.title}</h4>
                    <span className="text-[10px] text-[#9296A3] uppercase tracking-wider">{g.period}</span>
                  </div>
                </div>
                <button
                  onClick={() => incrementProgress(g.id, g.progress, g.target)}
                  className="px-3 py-1.5 bg-[#171A22] hover:bg-[#7C5CFC] hover:text-white border border-[#171A22] rounded-xl text-xs font-bold text-[#F5F5F7]"
                >
                  +1 Progress
                </button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-[#9296A3]">
                  <span>{g.progress} / {g.target} Completed</span>
                  <span className="font-bold text-[#7C5CFC]">{percentage}%</span>
                </div>
                <div className="w-full bg-[#171A22] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#7C5CFC] h-full transition-all duration-300" style={{ width: `${percentage}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
