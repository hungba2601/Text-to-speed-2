import React, { useState } from 'react';
import { GenerationSettings } from '../types';

interface ApiSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: GenerationSettings;
    onUpdate: (newSettings: GenerationSettings) => void;
}

const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
    isOpen,
    onClose,
    settings,
    onUpdate
}) => {
    const [tempApiKey, setTempApiKey] = useState(settings.apiKey || '');

    if (!isOpen) return null;

    const handleSave = () => {
        onUpdate({ ...settings, apiKey: tempApiKey });
        localStorage.setItem('gemini_api_key', tempApiKey);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center">
                            <span className="mr-2">🔑</span> Thiết lập API Key
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>

                    <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                        API Key của bạn sẽ được lưu cục bộ trong trình duyệt này và được dùng để gọi mô hình <strong>Gemini 3.1 Flash</strong>.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="api-key" className="block text-sm font-semibold text-slate-700 mb-1.5 text-left">
                                Gemini API Key
                            </label>
                            <input
                                id="api-key"
                                type="password"
                                placeholder="Nhập API Key ở đây..."
                                value={tempApiKey}
                                onChange={(e) => setTempApiKey(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>

                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                            <div className="flex space-x-3">
                                <div className="text-amber-500 text-lg flex-shrink-0">⚠️</div>
                                <div className="text-xs text-amber-700 leading-normal">
                                    Lưu ý: Chúng tôi không lưu trữ API key của bạn trên server. API key chỉ tồn tại trên thiết bị này.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 flex space-x-3 justify-end border-t border-slate-200">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-5 py-2.5 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
                    >
                        Lưu thiết lập
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApiSettingsModal;
