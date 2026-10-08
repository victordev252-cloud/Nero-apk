import React, { useState, useEffect } from 'react';
import { HomeDashboard } from './components/HomeDashboard';
import { Navigation } from './components/Navigation';
import { CreateItemModal } from './components/CreateItemModal';
import { i18n } from './i18n';
import { bridge } from './services/bridge';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [createType, setCreateType] = useState(null);
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const userLang = bridge.query("SELECT value FROM settings WHERE key = 'language'");
    if (userLang && userLang[0]) {
      setLang(userLang[0].value);
      i18n.setLanguage(userLang[0].value);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#08090D] text-[#F5F5F7] flex flex-col justify-between selection:bg-[#7C5CFC] selection:text-white">
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'home' && (
          <HomeDashboard
            onOpenCreate={(type) => setCreateType(type)}
            onOpenSearch={() => alert('Search feature active')}
            onOpenNotifications={() => alert('Notifications feature active')}
            i18n={i18n}
          />
        )}
        {activeTab === 'calendar' && (
          <div className="p-6 text-center text-[#9296A3] mt-20">Calendar Timeline Module Active</div>
        )}
        {activeTab === 'tasks' && (
          <div className="p-6 text-center text-[#9296A3] mt-20">Task & Goal Management Active</div>
        )}
        {activeTab === 'goals' && (
          <div className="p-6 text-center text-[#9296A3] mt-20">Productivity Statistics Active</div>
        )}
        {activeTab === 'profile' && (
          <div className="p-6 text-center text-[#9296A3] mt-20">Local User Profile & Settings Active</div>
        )}
      </main>

      {createType && (
        <CreateItemModal
          type={createType}
          onClose={() => setCreateType(null)}
          onCreated={() => {}}
        />
      )}

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} i18n={i18n} />
    </div>
  );
}
