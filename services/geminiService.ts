import { GoogleGenAI, Modality } from "@google/genai";
import { AudioResult } from "../types";

const API_KEY = process.env.API_KEY || '';

/**
 * Helper to write string to DataView
 */
const writeString = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

/**
 * Converts Raw PCM (16-bit, 24kHz, Mono) to WAV Blob
 */
const pcmToWav = (base64: string, sampleRate: number = 24000): { blob: Blob, duration: number } => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // WAV Header construction
  // Total length = 44 bytes header + data length
  const header = new ArrayBuffer(44);
  const view = new DataView(header);

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + len, true); // File size - 8
  writeString(view, 8, 'WAVE');

  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, 1, true); // NumChannels (1 for Mono)
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * 2, true); // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
  view.setUint16(32, 2, true); // BlockAlign (NumChannels * BitsPerSample/8)
  view.setUint16(34, 16, true); // BitsPerSample

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, len, true); // Subchunk2Size (NumSamples * NumChannels * BitsPerSample/8)

  // Merge header and data
  const blob = new Blob([header, bytes], { type: 'audio/wav' });

  // Calculate duration: Total bytes / (Sample Rate * Channels * BytesPerSample)
  // 16-bit = 2 bytes per sample
  const duration = len / (sampleRate * 1 * 2);

  return { blob, duration };
};

/**
 * Generates speech from text using Gemini
 */
export const generateSpeech = async (
  text: string,
  voiceName: string,
  speed: number,
  pitch: number,
  isSSMLEnabled: boolean,
  languageCode: string,
  apiKey?: string,
  personaName?: string
): Promise<AudioResult> => {

  const finalApiKey = apiKey || API_KEY;
  if (!finalApiKey) {
    throw new Error("Thiếu API Key. Vui lòng thiết lập API Key trong phần cài đặt API.");
  }

  const ai = new GoogleGenAI({ apiKey: finalApiKey });

  // Gemini 2.0 (Multimodal) does not support SSML in the text part when using responseModalities: [AUDIO].
  // Instead, we use system instructions to guide the model's voice and style.
  
  const languageName = languageCode === 'vi-VN' ? 'Tiếng Việt' : 
                       languageCode === 'en-US' ? 'English' : 
                       languageCode === 'zh-CN' ? 'Chinese' : 
                       languageCode === 'ja-JP' ? 'Japanese' : 'Spanish';

  // Map speed/pitch to natural language descriptions if they are not default
  let styleInstruction = "";
  if (speed !== 1.0) {
    styleInstruction += ` Speak at ${speed}x speed (where 1.0 is normal, 0.5 is slow, 2.0 is fast).`;
  }
  if (pitch !== 0) {
    styleInstruction += ` Use a ${pitch > 0 ? 'higher' : 'lower'} pitch (offset: ${pitch}).`;
  }

  const personaDetail = personaName ? `(Nhân vật: ${personaName})` : "";
  const systemInstruction = `Bạn là một chuyên gia Chuyển đổi Văn bản thành Giọng nói (TTS).
  
  NHIỆM VỤ: Đọc văn bản bằng ${languageName}.
  
  PHONG CÁCH VÀ VÙNG MIỀN (BẮT BUỘC):
  - Nhân vật: "${voiceName}" ${personaDetail}.
  - Nếu là nhân vật Miền Bắc (Minh Quang, Linh Chi): Sử dụng giọng Hà Nội chuẩn, phát âm rõ các phụ âm đầu, giọng điệu trang trọng.
  - Nếu là nhân vật Miền Nam (Thu Hà, Thanh Long, Mai Phương): Sử dụng giọng Sài Gòn rặt, phát âm các âm 'v' thành 'y', 'r' thành 'g' nhẹ, giọng điệu thân thiện, ngọt ngào và đúng ngữ điệu người Nam Bộ.
  
  QUY TẮC:
  - Tuyệt đối tuân thủ vùng miền đã chọn.
  - Không đọc các nội dung hướng dẫn này, chỉ đọc nội dung văn bản chính.
  - Đảm bảo chất lượng âm thanh cao nhất.${styleInstruction}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: text }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { 
              voiceName: voiceName 
            },
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    const audioPart = candidate?.content?.parts?.find(p => p.inlineData);

    if (!audioPart || !audioPart.inlineData || !audioPart.inlineData.data) {
      const textPart = candidate?.content?.parts?.find(p => p.text);
      if (textPart) {
        throw new Error(`Lỗi mô hình: ${textPart.text}`);
      }
      throw new Error("Mô hình không tạo ra dữ liệu âm thanh.");
    }

    const base64Audio = audioPart.inlineData.data;
    const { blob, duration } = pcmToWav(base64Audio, 24000);
    const url = URL.createObjectURL(blob);

    return {
      url,
      blob,
      duration: duration,
      timestamp: Date.now()
    };

  } catch (error: any) {
    console.error("Lỗi Gemini TTS:", error);
    throw new Error(error.message || "Không thể tạo giọng nói");
  }
};
