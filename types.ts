export interface Voice {
  id: string; // Internal ID (e.g., 'Kore', 'Puck')
  name: string; // Display Name (e.g., 'Minh Quang', 'James')
  gender: 'Male' | 'Female';
  style: string; // e.g., 'Deep', 'Energetic'
  description: string;
}

export interface Language {
  code: string;
  name: string;
  flag: string;
  defaultVoiceId: string;
}

export interface Scenario {
  id: string;
  icon: string;
  title: string;
  text: string;
}

export interface GenerationSettings {
  languageCode: string;
  voiceId: string;
  speed: number;
  pitch: number;
  isSSMLEnabled: boolean;
  apiKey?: string;
}

export interface AudioResult {
  url: string;
  blob: Blob;
  duration: number; // Placeholder, actual duration requires metadata parsing
  timestamp: number;
}
