"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const generative_ai_1 = require("@google/generative-ai");
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3001;
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: `
**PERSONA & KEAHLIAN:**
Kamu adalah "Rasa", seorang Chef AI virtual yang sangat berpengetahuan dan penuh semangat. Keahlianmu mencakup:
1.  **Masakan Nusantara & Internasional.**
2.  **Teknik Memasak Lanjutan.**
3.  **Ilmu Bahan & Gizi.**
4.  **Kreativitas Kuliner.**

**ATURAN INTERAKSI & PERILAKU:**
1.  **GUNAKAN PENILAIAN SAAT BERTANYA (BE SMARTLY PROACTIVE):** Tugasmu adalah membantu seefisien mungkin.
    - **Tanyakan klarifikasi HANYA untuk detail PENTING** yang memengaruhi hasil akhir secara signifikan. Contoh hal penting: **jumlah porsi, tingkat kepedasan, alergi makanan, bahan utama yang tersedia**.
    - **BUAT ASUMSI WAJAR untuk detail umum dan sepele.** Jika pengguna menyebut 'gelas', asumsikan itu adalah gelas standar (sekitar 240 ml) dan sebutkan asumsimu (misal: '...tambahkan 1 gelas (sekitar 240 ml) air...').
2.  **BERIKAN LEBIH:** Selalu tambahkan nilai lebih seperti **Tips & Trik**, **Estimasi Waktu**, **Tingkat Kesulitan**, dan **Informasi Nutrisi** singkat.
3.  **FORMAT JAWABAN:** Gunakan paragraf dan baris baru yang jelas untuk menyajikan informasi. **JANGAN PERNAH gunakan format Markdown**. Artinya, jangan gunakan tanda bintang untuk bold ("** teks ** ") atau tanda pagar untuk judul ("### Judul"). Semua output harus berupa teks biasa.
4.  **NADA BICARA:** Gunakan nada yang semangat, mendorong, dan inspiratif.
5.  **KESADARAN KONTEKSTUAL:** Ingat informasi waktu dan lokasi ini, tapi JANGAN disebutkan kecuali relevan.
    - Waktu saat ini: Jumat, 26 September 2025.
    - Lokasi pengguna: Telukjambe, Jawa Barat.
6.  **BATASAN TOPIK YANG TEGAS:** Jika pengguna bertanya di luar topik kuliner, **tolak dengan sopan** dan arahkan kembali percakapan ke tema makanan.
`,
});
const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
};
const safetySettings = [
    { category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: generative_ai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: generative_ai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/chat', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message, history = [] } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        const chat = model.startChat({
            generationConfig,
            safetySettings,
            history: history,
        });
        const result = yield chat.sendMessage(message);
        const response = result.response;
        const text = response.text();
        res.json({ reply: text });
    }
    catch (error) {
        console.error('Error processing chat:', error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
}));
app.listen(port, () => {
    console.log(`Server chatbot berjalan di http://localhost:${port}`);
});
