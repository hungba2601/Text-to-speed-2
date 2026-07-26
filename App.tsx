import React, { useState, useEffect } from 'react';
import SettingsPanel from './components/SettingsPanel';
import InputPanel from './components/InputPanel';
import ResultPanel from './components/ResultPanel';
import ApiSettingsModal from './components/ApiSettingsModal';
import { GenerationSettings, AudioResult } from './types';
import { generateSpeech } from './services/geminiService';
import { VOICES } from './constants';

const App: React.FC = () => {
  const [settings, setSettings] = useState<GenerationSettings>({
    languageCode: 'vi-VN',
    voiceId: 'Fenrir',
    speed: 1.0,
    pitch: 0,
    isSSMLEnabled: false,
    apiKey: localStorage.getItem('gemini_api_key') || '',
  });

  const [text, setText] = useState('');
  const [result, setResult] = useState<AudioResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError("Vui lòng nhập văn bản trước.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const currentVoice = VOICES[settings.languageCode]?.find(v => v.id === settings.voiceId);
      const audioResult = await generateSpeech(
        text,
        settings.voiceId,
        settings.speed,
        settings.pitch,
        settings.isSSMLEnabled,
        settings.languageCode,
        settings.apiKey,
        currentVoice?.name
      );
      setResult(audioResult);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi không mong muốn.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 text-slate-800 font-sans selection:bg-emerald-500/30">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm/50">
        <div className="w-full px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-600 w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-lg shadow-emerald-500/30 text-white">
              🎙️
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none mb-1">Text-to-Speech 2.0</h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Powered by Gemini 3.1 Flash</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsApiModalOpen(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 border border-slate-200 active:scale-95"
            >
              <span className="text-lg">🔑</span>
              <span>API Key</span>
              {settings.apiKey && (
                <span className="w-2 h-2 bg-emerald-500 rounded-full ml-1 animate-pulse"></span>
              )}
            </button>
            <div className="hidden md:block text-sm text-slate-400 font-medium border-l border-slate-200 pl-4">
              Chất lượng cao • Đa ngôn ngữ
            </div>
          </div>
        </div>
      </header>

      <ApiSettingsModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        settings={settings}
        onUpdate={setSettings}
      />

      {/* Main Content */}
      <main className="w-full px-6 py-8">

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex items-center animate-pulse">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Sidebar - Settings */}
          <div className="lg:col-span-4 space-y-6">
            <SettingsPanel settings={settings} onUpdate={setSettings} />

            <div className="hidden lg:block">
              <ResultPanel result={result} settings={settings} />
            </div>
          </div>

          {/* Right Content - Input & (Mobile) Result */}
          <div className="lg:col-span-8 flex flex-col space-y-6">
            <InputPanel
              text={text}
              setText={setText}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              settings={settings}
            />

            {/* Mobile Result Panel */}
            <div className="block lg:hidden">
              <ResultPanel result={result} settings={settings} />
            </div>
          </div>

        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 mt-12">
        <div className="w-full px-6 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Chuyển văn bản thành giọng nói. Bảo lưu mọi quyền.</p>
          <p className="mt-2 opacity-60">Made by Nguyễn Phi Hùng • Chạy trên nền tảng Gemini 3.1 Flash (Sử dụng API Key cá nhân)</p>
        </div>
      </footer>
    </div>
  );
};

export default App;