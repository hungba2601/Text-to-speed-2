import React from 'react';
import { GenerationSettings, Language, Voice } from '../types';
import { LANGUAGES, VOICES } from '../constants';

interface SettingsPanelProps {
  settings: GenerationSettings;
  onUpdate: (newSettings: GenerationSettings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdate }) => {
  
  const currentVoices = VOICES[settings.languageCode] || [];

  const handleChange = (key: keyof GenerationSettings, value: any) => {
    onUpdate({ ...settings, [key]: value });
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLangCode = e.target.value;
    const lang = LANGUAGES.find(l => l.code === newLangCode);
    const newVoice = VOICES[newLangCode]?.[0]?.id || ''; // Default to first voice
    
    onUpdate({
      ...settings,
      languageCode: newLangCode,
      voiceId: lang?.defaultVoiceId || newVoice
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xl">
      <div className="flex items-center space-x-2 mb-6 border-b border-slate-100 pb-4">
        <span className="text-2xl">⚙️</span>
        <h2 className="text-xl font-bold text-slate-800">Cài đặt</h2>
      </div>

      <div className="space-y-6">
        {/* Language Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-500 mb-2">
            🌍 Ngôn ngữ
          </label>
          <select
            value={settings.languageCode}
            onChange={handleLanguageChange}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Voice Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-500 mb-2">
            🎤 Giọng đọc
          </label>
          <div className="grid grid-cols-1 gap-2">
            {currentVoices.map((voice) => (
              <button
                key={voice.id}
                onClick={() => handleChange('voiceId', voice.id)}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  settings.voiceId === voice.id
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="text-left">
                  <div className="font-semibold">{voice.name}</div>
                  <div className="text-xs text-slate-500">{voice.style}</div>
                </div>
                {settings.voiceId === voice.id && (
                  <span className="text-emerald-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-6 pt-4 border-t border-slate-100">
           {/* Speed */}
          <div>
            <div className="flex justify-between mb-2">
               <label className="text-sm font-medium text-slate-500">⚡ Tốc độ ({settings.speed.toFixed(2)}x)</label>
               <span className="text-xs text-slate-400">0.5x - 2.0x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={settings.speed}
              disabled={settings.isSSMLEnabled}
              onChange={(e) => handleChange('speed', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* Pitch */}
          <div>
             <div className="flex justify-between mb-2">
               <label className="text-sm font-medium text-slate-500">🎵 Cao độ ({settings.pitch > 0 ? '+' : ''}{settings.pitch} st)</label>
               <span className="text-xs text-slate-400">-12 đến +12</span>
            </div>
            <input
              type="range"
              min="-12"
              max="12"
              step="1"
              value={settings.pitch}
              disabled={settings.isSSMLEnabled}
              onChange={(e) => handleChange('pitch', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
        </div>

        {/* SSML Toggle */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <label className="text-sm font-medium text-slate-600 cursor-pointer" htmlFor="ssml-toggle">
            🔧 Bật SSML nâng cao
          </label>
          <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
            <input 
              type="checkbox" 
              name="ssml-toggle" 
              id="ssml-toggle"
              checked={settings.isSSMLEnabled}
              onChange={(e) => handleChange('isSSMLEnabled', e.target.checked)}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out transform checked:translate-x-full checked:border-emerald-600"
              style={{
                right: settings.isSSMLEnabled ? '0' : 'auto',
                left: settings.isSSMLEnabled ? 'auto' : '0'
              }}
            />
            <label 
              htmlFor="ssml-toggle" 
              className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ${settings.isSSMLEnabled ? 'bg-emerald-600' : 'bg-slate-300'}`}
            ></label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;