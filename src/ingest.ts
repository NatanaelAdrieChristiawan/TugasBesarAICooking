import {GoogleGenerativeAI} from '@google/generative-ai';
import * as dotenv from 'dotenv';
import {Client} from 'pg';

dotenv.config();

const dataToIngest = [
  // Resep 1: Nasi Goreng Sederhana
  `Resep Nasi Goreng Sederhana:
Bahan: 2 piring nasi putih dingin, 3 siung bawang putih cincang, 2 butir telur, 2 sdm kecap manis, 1 sdm saus tiram, garam dan merica secukupnya, daun bawang iris.
Cara Membuat:
1. Tumis bawang putih hingga harum. Masukkan telur dan orak-arik hingga matang.
2. Masukkan nasi putih, aduk rata dengan bumbu dan telur.
3. Tambahkan kecap manis, saus tiram, garam, dan merica. Aduk hingga semua bahan tercampur sempurna dan nasi sedikit kering.
4. Terakhir, masukkan irisan daun bawang, aduk sebentar, lalu sajikan selagi hangat.
Tips: Gunakan nasi yang sudah didiamkan semalaman di kulkas agar teksturnya lebih bagus saat digoreng.`,

  // Resep 2: Rendang Daging Sapi
  `Resep Rendang Daging Sapi Khas Minang:
Bahan Utama: 500 gr daging sapi (potong sesuai selera), 500 ml santan kental, 200 ml santan encer.
Bumbu Halus: 12 siung bawang merah, 6 siung bawang putih, 3 cm jahe, 3 cm lengkuas, 1 sdt ketumbar, 1/2 sdt jintan, 5 buah cabai merah keriting.
Bumbu Cemplung: 2 lembar daun kunyit, 4 lembar daun jeruk, 2 batang serai (memarkan).
Cara Membuat:
1. Tumis bumbu halus hingga wangi. Masukkan daging sapi, aduk hingga berubah warna.
2. Tuang santan encer dan masukkan semua bumbu cemplung. Masak dengan api kecil hingga santan menyusut.
3. Tuang santan kental, tambahkan garam dan gula secukupnya. Lanjutkan memasak sambil terus diaduk perlahan hingga santan mengering dan mengeluarkan minyak, serta daging menjadi empuk. Proses ini bisa memakan waktu 2-3 jam.
Tingkat Kesulitan: Sulit. Estimasi Waktu: 3-4 jam.`,

  // Resep 3: Soto Ayam Lamongan
  `Resep Soto Ayam Lamongan Bening:
Bahan: 1/2 ekor ayam kampung, 2 liter air, 2 batang serai (memarkan), 3 lembar daun jeruk.
Bumbu Halus: 6 siung bawang putih, 4 siung bawang merah, 2 cm kunyit bakar, 2 cm jahe, 1 sdt merica butiran.
Pelengkap: Soun, tauge, irisan seledri, bawang goreng, telur rebus, sambal, dan koya.
Cara Membuat:
1. Rebus ayam hingga empuk. Angkat ayam, suwir-suwir dagingnya, sisihkan tulangnya. Masukkan kembali tulang ke dalam kaldu.
2. Tumis bumbu halus, serai, dan daun jeruk hingga harum. Masukkan tumisan bumbu ke dalam air kaldu.
3. Masak kuah soto dengan api kecil selama sekitar 30 menit agar bumbu meresap. Bumbui dengan garam dan sedikit gula.
4. Sajikan soto dengan menata nasi, soun, tauge, suwiran ayam, dan pelengkap lainnya di mangkuk, lalu siram dengan kuah panas.`,

  // Tips & Trik Kuliner
  `Tips Memasak Daging Sapi Agar Cepat Empuk:
1. Gunakan teknik marinasi dengan buah nanas. Enzim bromelain pada nanas dapat memecah serat daging. Jangan terlalu lama, cukup 15-30 menit.
2. Rebus dengan metode 5-30-7. Rebus daging selama 5 menit, matikan api dan diamkan panci tertutup selama 30 menit, lalu rebus kembali selama 7 menit.
3. Memotong daging melawan serat akan membuat daging lebih mudah dikunyah.`,

  // Informasi Bahan
  `Informasi Bahan - Lengkuas vs Jahe:
Meskipun terlihat mirip, lengkuas dan jahe memiliki fungsi berbeda. Jahe (ginger) memberikan rasa hangat dan sedikit pedas, cocok untuk minuman dan tumisan. Lengkuas (galangal) memiliki aroma yang lebih tajam seperti pinus dan rasa yang lebih kuat, sering digunakan sebagai bumbu dasar untuk masakan berkuah seperti soto, rendang, dan kari untuk memberikan aroma khas.`,
];

async function ingestData() {
  const pgClient = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/gdgoc',
  });
  await pgClient.connect();
  console.log('Terhubung ke database PostgreSQL.');

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const embeddingModel = genAI.getGenerativeModel({
    model: 'text-embedding-004',
  });

  console.log('Indexing start');

  for (const text of dataToIngest) {
    const result = await embeddingModel.embedContent(text);
    const embedding = result.embedding.values;

    await pgClient.query(
      'INSERT INTO documents (content, embedding) VALUES ($1, $2)',
      [text, `[${embedding.join(',')}]`]
    );
  }

  await pgClient.end();
  console.log('Success');
}

ingestData().catch(console.error);
