import React from 'react';
import { Home, Calendar, CheckSquare, Target, User } from 'lucide-react';

export function Navigation({ activeTab, setActiveTab, i18n }) {
  const tabs = [
    { id: 'home', label: i18n.t('nav.home'), icon: Home },
    { id: 'calendar', label: i18n.t('nav.calendar'), icon: Calendar },
    { id: 'tasks', label: i18n.t('nav.tasks'), icon: CheckSquare },
    { id: 'goals', label: i18n.t('nav.goals'), icon: Target },
    { id: 'profile', label: i18n.t('nav.profile'), icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#11131A] border-t border-[#171A22] px-4 py-2 z-40">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${
                isActive ? 'text-[#7C5CFC]' : 'text-[#9296A3] hover:text-[#F5F5F7]'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
