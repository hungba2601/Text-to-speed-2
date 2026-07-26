import { Language, Scenario, Voice } from './types';

// Gemini TTS Voices: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
// We map these to local personas for a better UX.

export const VOICES: Record<string, Voice[]> = {
  'vi-VN': [
    { id: 'Charon', name: 'Minh Quang (Miền Bắc)', gender: 'Male', style: 'Rõ ràng, Dứt khoát', description: 'Phù hợp cho tin tức, tài liệu.' },
    { id: 'Puck', name: 'Thu Hà (Miền Nam)', gender: 'Female', style: 'Nhẹ nhàng, Truyền cảm', description: 'Tuyệt vời cho kể chuyện và trợ lý ảo.' },
    { id: 'Fenrir', name: 'Thanh Long (Miền Nam)', gender: 'Male', style: 'Trầm ấm, Tự nhiên', description: 'Thích hợp cho phim tài liệu.' },
    { id: 'Kore', name: 'Linh Chi (Miền Bắc)', gender: 'Female', style: 'Ngọt ngào, Truyền cảm', description: 'Giọng đọc truyền cảm, sâu lắng.' },
    { id: 'Aoide', name: 'Mai Phương (Đối thoại)', gender: 'Female', style: 'Vui vẻ, Tự nhiên', description: 'Phù hợp cho hội thoại đời thường.' },
  ],
  'en-US': [
    { id: 'Fenrir', name: 'David', gender: 'Male', style: 'Energetic', description: 'Good for sports or action.' },
    { id: 'Kore', name: 'Emily', gender: 'Female', style: 'Calm, Soothing', description: 'Wellness and meditation.' },
    { id: 'Charon', name: 'Michael', gender: 'Male', style: 'Deep, Authoritative', description: 'Movie trailer style.' },
    { id: 'Aoide', name: 'Sarah', gender: 'Female', style: 'Professional', description: 'Standard American accent.' },
    { id: 'Puck', name: 'Jessica', gender: 'Female', style: 'Warm, Engaging', description: 'Friendly conversational tone.' },
  ],
  'zh-CN': [
    { id: 'Fenrir', name: 'Li Ming', gender: 'Male', style: 'Standard Mandarin', description: 'Clear business tone.' },
    { id: 'Kore', name: 'Wang Fang', gender: 'Female', style: 'Sweet, Clear', description: 'Good for commercial ads.' },
    { id: 'Puck', name: 'Xiao Chen', gender: 'Male', style: 'Young, Dynamic', description: 'Casual conversation.' },
  ],
  'ja-JP': [
    { id: 'Puck', name: 'Taro', gender: 'Male', style: 'Natural, Friendly', description: 'Anime protagonist style.' },
    { id: 'Kore', name: 'Hanako', gender: 'Female', style: 'Soft, Elegant', description: 'Polite customer service.' },
    { id: 'Fenrir', name: 'Kenji', gender: 'Male', style: 'Serious', description: 'News anchor.' },
  ],
  'es-ES': [
    { id: 'Fenrir', name: 'Carlos', gender: 'Male', style: 'Neutral Spanish', description: 'International broadcast.' },
    { id: 'Puck', name: 'María', gender: 'Female', style: 'Warm, Expressive', description: 'Telenovela drama.' },
    { id: 'Charon', name: 'Alejandro', gender: 'Male', style: 'Fast, Energetic', description: 'Sports commentary.' },
  ]
};

export const LANGUAGES: Language[] = [
  { code: 'vi-VN', name: 'Tiếng Việt', flag: '🇻🇳', defaultVoiceId: 'Fenrir' },
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸', defaultVoiceId: 'Puck' },
  { code: 'zh-CN', name: '中文 (Mandarin)', flag: '🇨🇳', defaultVoiceId: 'Kore' },
  { code: 'ja-JP', name: '日本語 (Japanese)', flag: '🇯🇵', defaultVoiceId: 'Puck' },
  { code: 'es-ES', name: 'Español', flag: '🇪🇸', defaultVoiceId: 'Fenrir' },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 'sales',
    icon: '🛍️',
    title: 'Quảng cáo',
    text: 'Chỉ trong 30 giây, bạn sẽ hiểu tại sao sản phẩm này thay đổi cuộc sống của bạn. Hãy tưởng tượng một buổi sáng thức dậy tràn đầy năng lượng và sẵn sàng chinh phục mọi thử thách.'
  },
  {
    id: 'news',
    icon: '📰',
    title: 'Bản tin',
    text: 'Bản tin AI hôm nay: Google vừa ra mắt mô hình mới với khả năng xử lý ngôn ngữ vượt trội. Đây là những gì bạn cần biết trong 60 giây tới về tương lai của công nghệ.'
  },
  {
    id: 'review',
    icon: '🎬',
    title: 'Review phim',
    text: 'Bộ phim bom tấn mới khiến khán giả đứng ngồi không yên. Ngay từ cảnh mở đầu, không khí hồi hộp đã bao trùm, khiến người xem không thể rời mắt khỏi màn hình.'
  },
  {
    id: 'story',
    icon: '📖',
    title: 'Kể chuyện',
    text: 'Ngày xửa ngày xưa, ở một vương quốc công nghệ xa xôi, có một chú robot nhỏ bé mang trong mình ước mơ thay đổi thế giới bằng giọng nói của mình.'
  },
];
