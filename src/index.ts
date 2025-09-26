import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, ChatSession } from '@google/generative-ai';

const app = express();
const port: number = Number(process.env.PORT) || 3001;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
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
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

app.use(cors());
app.use(express.json());

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface ChatRequestBody {
  message: string;
  history?: ChatMessage[];
}

app.post('/chat', async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const chat: ChatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: history,
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    res.json({ reply: text });

  } catch (error) {
    console.error('Error processing chat:', error);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

app.listen(port, () => {
  console.log(`Server chatbot berjalan di http://localhost:${port}`);
});