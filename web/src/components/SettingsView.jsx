import React, { useState, useEffect } from 'react';
import { Globe, Moon, Shield, Download, Trash2 } from 'lucide-react';
import { bridge } from '../services/bridge';
import { i18n } from '../i18n';

export function SettingsView() {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const userLang = bridge.query("SELECT value FROM settings WHERE key = 'language'");
    if (userLang && userLang[0]) setLang(userLang[0].value);
  }, []);

  const handleLanguageChange = (newLang) => {
    setLang(newLang);
    bridge.execute("UPDATE settings SET value = ? WHERE key = 'language'", [newLang]);
    i18n.setLanguage(newLang);
    window.location.reload();
  };

  const exportData = () => {
    const tasks = bridge.query("SELECT * FROM tasks");
    const appointments = bridge.query("SELECT * FROM appointments");
    const alarms = bridge.query("SELECT * FROM alarms");
    
    const dump = JSON.stringify({ tasks, appointments, alarms }, null, 2);
    const blob = new Blob([dump], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nero-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto space-y-6">
      <h1 className="text-xl font-bold text-[#F5F5F7]">Settings</h1>

      <div className="bg-[#11131A] border border-[#171A22] rounded-2xl divide-y divide-[#171A22]">
        {/* Language Selection */}
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-[#7C5CFC]" />
            <span className="text-sm font-medium text-[#F5F5F7]">Language</span>
          </div>
          <select
            value={lang}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-[#171A22] border border-[#171A22] text-xs font-semibold text-[#F5F5F7] rounded-xl px-3 py-1.5 outline-none"
          >
            <option value="en">English</option>
            <option value="so">Somali</option>
            <option value="ar">Arabic (العربية)</option>
          </select>
        </div>

        {/* Data Backup */}
        <button onClick={exportData} className="w-full p-4 flex justify-between items-center text-left">
          <div className="flex items-center space-x-3">
            <Download className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-[#F5F5F7]">Export JSON Backup</span>
          </div>
        </button>

        {/* Clear Data */}
        <button
          onClick={() => {
            if (confirm("Are you sure you want to clear all tasks and alarms?")) {
              bridge.execute("DELETE FROM tasks");
              bridge.execute("DELETE FROM alarms");
              alert("Data cleared successfully.");
            }
          }}
          className="w-full p-4 flex justify-between items-center text-left text-red-400"
        >
          <div className="flex items-center space-x-3">
            <Trash2 className="w-5 h-5" />
            <span className="text-sm font-medium">Clear All Application Data</span>
          </div>
        </button>
      </div>

      <div className="text-center text-xs text-[#9296A3] pt-4">
        <p className="font-bold text-[#7C5CFC]">NERO v3.1.0</p>
        <p>Plan your time. Own your day.</p>
      </div>
    </div>
  );
}
