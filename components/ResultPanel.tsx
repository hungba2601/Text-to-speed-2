import React, { useRef, useState, useEffect } from 'react';
import { AudioResult, GenerationSettings, Voice } from '../types';
import { VOICES } from '../constants';
import Button from './Button';

interface ResultPanelProps {
  result: AudioResult | null;
  settings: GenerationSettings;
}

const ResultPanel: React.FC<ResultPanelProps> = ({ result, settings }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentVoice: Voice | undefined = VOICES[settings.languageCode]?.find(v => v.id === settings.voiceId);

  useEffect(() => {
    if (result && audioRef.current) {
      audioRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [result]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = (format: 'wav' | 'mp3') => {
      if(!result) return;
      const a = document.createElement('a');
      a.href = result.url;
      a.download = `speech_${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  };

  if (!result) {
      return (
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xl flex flex-col items-center justify-center text-center h-full opacity-60">
               <div className="text-6xl mb-4 grayscale opacity-50">🎧</div>
               <h3 className="text-xl font-bold text-slate-700">Sẵn sàng tạo</h3>
               <p className="text-slate-500 max-w-sm mt-2">Cấu hình cài đặt và nhập văn bản để tạo giọng đọc AI chuyên nghiệp.</p>
          </div>
      );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xl animate-fade-in-up">
      <div className="flex items-center space-x-2 mb-6 border-b border-slate-100 pb-4">
        <span className="text-2xl">🎧</span>
        <h2 className="text-xl font-bold text-slate-800">Kết quả & Điều khiển</h2>
      </div>

      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
        <audio
            ref={audioRef}
            src={result.url}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            className="hidden"
        />

        {/* Custom Player UI */}
        <div className="flex items-center space-x-4 mb-6">
            <button 
                onClick={togglePlay}
                className="w-14 h-14 flex items-center justify-center rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30 transition-colors"
            >
                {isPlaying ? (
                     <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                ) : (
                    <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                )}
            </button>
            
            <div className="flex-grow">
                <div className="flex justify-between text-xs text-slate-500 mb-2 font-mono">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration || 0)}</span>
                </div>
                <div className="relative w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                        className="absolute top-0 left-0 h-full bg-emerald-500"
                        style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                    />
                </div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
             <Button variant="secondary" onClick={() => handleDownload('mp3')} className="w-full text-sm">
                📥 Tải xuống MP3
             </Button>
             <Button variant="outline" onClick={() => handleDownload('wav')} className="w-full text-sm">
                📥 Tải xuống WAV
             </Button>
        </div>

        <div className="bg-white rounded-lg p-4 text-sm space-y-2 border border-slate-200 text-slate-600">
            <div className="flex justify-between">
                <span className="text-slate-400">Ngôn ngữ</span>
                <span className="font-medium text-slate-800">{settings.languageCode}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-slate-400">Giọng đọc</span>
                <span className="font-medium text-slate-800">{currentVoice?.name} ({currentVoice?.gender === 'Male' ? 'Nam' : 'Nữ'})</span>
            </div>
            <div className="flex justify-between">
                <span className="text-slate-400">Tốc độ / Cao độ</span>
                <span className="font-medium text-slate-800">{settings.speed}x / {settings.pitch}st</span>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ResultPanel;