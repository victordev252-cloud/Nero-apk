import React, { useState, useEffect } from 'react';
import { HomeDashboard } from './components/HomeDashboard';
import { CalendarView } from './components/CalendarView';
import { TaskManager } from './components/TaskManager';
import { GoalTracker } from './components/GoalTracker';
import { SettingsView } from './components/SettingsView';
import { Navigation } from './components/Navigation';
import { CreateItemModal } from './components/CreateItemModal';
import { i18n } from './i18n';
import { bridge } from './services/bridge';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [createType, setCreateType] = useState(null);

  return (
    <div className="min-h-screen bg-[#08090D] text-[#F5F5F7] flex flex-col justify-between selection:bg-[#7C5CFC]">
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'home' && (
          <HomeDashboard
            onOpenCreate={(type) => setCreateType(type)}
            onOpenSearch={() => {}}
            onOpenNotifications={() => {}}
            i18n={i18n}
          />
        )}
        {activeTab === 'calendar' && <CalendarView onOpenCreate={(type) => setCreateType(type)} />}
        {activeTab === 'tasks' && <TaskManager onOpenCreate={(type) => setCreateType(type)} />}
        {activeTab === 'goals' && <GoalTracker />}
        {activeTab === 'profile' && <SettingsView />}
      </main>

      {createType && (
        <CreateItemModal
          type={createType}
          onClose={() => setCreateType(null)}
          onCreated={() => window.location.reload()}
        />
      )}

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} i18n={i18n} />
    </div>
  );
}
