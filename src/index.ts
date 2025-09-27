import express, {Request, Response} from 'express';
import cors from 'cors';
import 'dotenv/config';
import {Client} from 'pg';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  ChatSession,
} from '@google/generative-ai';

const app = express();
const port: number = Number(process.env.PORT) || 3001;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

const chatModel = genAI.getGenerativeModel({
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
6.  **BATASAN TOPIK YANG TEGAS:** Jika pengguna bertanya di luar topik kuliner, **tolak dengan sopan** dan arahkan kembali percakapan ke tema makanan.
`,
});

const embeddingModel = genAI.getGenerativeModel({model: 'text-embedding-004'});

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

app.use(cors());
app.use(express.json());

interface ChatMessage {
  role: 'user' | 'model';
  parts: {text: string}[];
}

interface ChatRequestBody {
  message: string;
  history?: ChatMessage[];
}

async function retrieveKnowledge(query: string): Promise<string[]> {
  const pgClient = new Client({connectionString: process.env.DATABASE_URL});

  try {
    await pgClient.connect();

    const queryEmbeddingResult = await embeddingModel.embedContent(query);
    const queryEmbedding = queryEmbeddingResult.embedding.values;

    const relevanceThreshold = 0.35;

    const searchResult = await pgClient.query(
      `SELECT content, embedding <=> $1 AS distance 
       FROM documents 
       WHERE embedding <=> $1 < $2 
       ORDER BY distance 
       LIMIT 3`,
      [`[${queryEmbedding.join(',')}]`, relevanceThreshold]
    );

    if (searchResult.rows.length > 0) {
      return searchResult.rows.map((row) => row.content);
    } else {
      return [];
    }
  } catch (error) {
    return [];
  } finally {
    await pgClient.end();
  }
}

async function searchYoutubeVideo({
  searchQuery,
}: {
  searchQuery: string;
}): Promise<string> {
  console.log(`▶️ [TOOL] Mencari video di YouTube untuk: "${searchQuery}"`);
  const videoUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    searchQuery
  )}`;
  return `Ditemukan video yang relevan, Anda bisa melihatnya di: ${videoUrl}`;
}

app.post(
  '/chat',
  async (req: Request<{}, {}, ChatRequestBody>, res: Response) => {
    try {
      const {message, history = []} = req.body;

      if (!message) {
        return res.status(400).json({error: 'Message is required'});
      }
      const relevantKnowledge = await retrieveKnowledge(message);

      let augmentedMessage = '';

      if (relevantKnowledge.length > 0) {
        const context = relevantKnowledge.join('\n\n---\n\n');
        augmentedMessage = `Anda adalah Chef Rasa. Anda telah menemukan resep yang relevan dengan pertanyaan pengguna di dalam koleksi resep andalan Anda. Tugas Anda adalah menyajikan resep ini kepada pengguna. 
        PENTING: Mulailah jawaban Anda dengan antusias dan sebutkan bahwa Anda menemukan resep andalan yang cocok. 
        Contoh frasa pembuka: "Tentu saja! Saya punya resep andalan yang pas sekali untukmu..." atau "Wah, pas sekali! Saya punya resep andalan ala Chef Rasa.". 
        Gunakan informasi dari 'Konteks Resep Andalan' di bawah ini sebagai sumber utama jawaban Anda.
        
        ## Konteks Resep Andalan:
        ${context}
        
        ## Pertanyaan Pengguna:
        ${message}`;
      } else {
        augmentedMessage = `Tugas Anda adalah menjawab pertanyaan pengguna tentang: "${message}".
        Resep ini tidak ditemukan dalam koleksi resep andalanmu.
        Oleh karena itu, jawablah pertanyaan ini menggunakan pengetahuan kuliner umum Anda yang luas.
        
        PENTING: Rangkai jawabanmu dengan nada yang ramah dan alami.
        Mulailah dengan mengatakan bahwa resep tersebut belum ada di dalam 'koleksi resep andalanmu', tapi kamu tetap akan memberikan resep lezat berdasarkan keahlianmu.
        Hindari kata-kata teknis seperti 'database', 'sumber', 'pengetahuan umum', atau 'fallback'. Buatlah terdengar seolah-olah Anda adalah seorang koki sungguhan yang sedang membantu.
        
        ## Pertanyaan Pengguna:
        ${message}`;
      }

      const chat: ChatSession = chatModel.startChat({
        generationConfig,
        safetySettings,
        history: history,
      });

      const result = await chat.sendMessage(augmentedMessage);
      const response = result.response;
      const text = response.text();

      res.json({reply: text});
    } catch (error) {
      res.status(500).json({error: 'Terjadi kesalahan pada server'});
    }
  }
);

app.listen(port, () => {
  console.log(`Server chatbot "Rasa" berjalan di http://localhost:${port}`);
});
