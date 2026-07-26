import React from 'react';
import { SCENARIOS } from '../constants';
import Button from './Button';
import { GenerationSettings } from '../types';

interface InputPanelProps {
  text: string;
  setText: (text: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  settings: GenerationSettings;
}

const InputPanel: React.FC<InputPanelProps> = ({ text, setText, onGenerate, isLoading, settings }) => {
  const charCount = text.length;
  // Estimated cost placeholder logic from prompt: $0.000016 per char
  const estCost = (charCount * 0.000016).toFixed(6);

  const insertSSMLTag = (tag: string) => {
    setText(text + tag);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">📝</span>
          <h2 className="text-xl font-bold text-slate-800">Nội dung</h2>
        </div>
        <div className="text-xs font-mono text-slate-500">
           {charCount} ký tự | Ước tính: ${estCost}
        </div>
      </div>

      <div className="flex-grow flex flex-col space-y-4">
        
        {settings.isSSMLEnabled && (
           <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300">
             <button onClick={() => insertSSMLTag('<break time="500ms"/>')} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs rounded text-slate-600 whitespace-nowrap transition-colors">Nghỉ 500ms</button>
             <button onClick={() => insertSSMLTag('<emphasis>text</emphasis>')} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs rounded text-slate-600 whitespace-nowrap transition-colors">Nhấn mạnh</button>
             <button onClick={() => insertSSMLTag('<prosody rate="slow">text</prosody>')} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs rounded text-slate-600 whitespace-nowrap transition-colors">Chậm</button>
           </div>
        )}

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={settings.isSSMLEnabled ? "<speak>Nhập SSML tại đây...</speak>" : "Nhập văn bản tại đây để chuyển thành giọng nói..."}
          className="w-full flex-grow bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 p-4 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none font-mono leading-relaxed transition-all"
          style={{ minHeight: '200px' }}
        />

        {/* Scenarios */}
        <div>
            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-bold">Kịch bản nhanh</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {SCENARIOS.map((scenario) => (
                    <button
                        key={scenario.id}
                        onClick={() => setText(scenario.text)}
                        className="bg-white border border-slate-200 hover:border-emerald-500/50 hover:bg-slate-50 p-3 rounded-lg text-left transition-all group shadow-sm hover:shadow-md"
                    >
                        <div className="text-xl mb-1 group-hover:scale-110 transition-transform">{scenario.icon}</div>
                        <div className="text-xs font-medium text-slate-600 group-hover:text-emerald-700"> {scenario.title}</div>
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="pt-6 mt-4 border-t border-slate-100">
        <Button onClick={onGenerate} isLoading={isLoading} className="w-full py-4 text-lg shadow-emerald-500/20">
           Tạo giọng nói
        </Button>
      </div>
    </div>
  );
};

export default InputPanel;