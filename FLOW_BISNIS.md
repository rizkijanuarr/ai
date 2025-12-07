## Langkah Detail

1. **User & Input URL**  
   Pengguna mengirim URL melalui antarmuka (web / REST).

2. **Flask API**  
   Endpoint Flask menerima URL, mem-validasi, lalu meneruskannya ke modul scraping.

3. **Scrape Konten**  
   • Mengambil HTML.  
   • Mengekstraksi `<meta property="og:*">`, `<meta name="description">`, dsb.  
   • Menyusun dokumen teks (meta-graph atau standar meta-tag).

4. **Pre-processing**  
   • Normalisasi (lower-case, remove punctuation, dsb).  
   • Tokenisasi sesuai vocab IndoBERT.  
   • Padding & encoding.

5. **IndoBERT**  
   • Fine-tuned untuk klasifikasi legalitas konten.  
   • Menghasilkan probabilitas kelas.

6. **Output**  
   Threshold > 0.5 → “Legal”, else “Ilegal”.  
   Respons dikirim kembali ke klien.

---

## Evaluasi Model

| Metric         | Rumus                                         |
| ---------------| --------------------------------------------- |
| Accuracy       | (TP + TN) / (TP + FP + TN + FN)               |
| Precision      | TP / (TP + FP)                                |
| Recall         | TP / (TP + FN)                                |
| F1-Score       | 2 × Precision × Recall / (Precision + Recall) |

## NOTE IMPLEMENTATION FLOW

Proses di atas diimplementasikan dalam arsitektur MVC (Model-View-Controller) layer sebagai berikut:

1. **Request Handling (`TugasAkhirControllerV1` & `ScrapeRequestV1`)**
    * Endpoint `/api/v1/scrape` (POST) menerima JSON body berisi `url`.
    * `ScrapeRequestV1` bertindak sebagai DTO (Data Transfer Object) untuk memvalidasi input URL dari user.

2. **Service Processing (`TugasAkhirServiceImplV1`)**
    * Controller meneruskan request ke layer Service.
    * Service menjadi perantara (logic layer), memanggil Repository untuk proses berat, lalu memformat hasilnya.

3. **Core Logic / Repository (`TugasAkhirRepositoriesV1`)**
    * **Scraping**: Fungsi `_scrape_meta` mengambil konten website (Title, Meta Description, H1/H2) menggunakan `requests` dan `BeautifulSoup4`. SSL verification di-disable (`verify=False`) untuk menangani error sertifikat pada beberapa situs.
    * **Preprocessing**: Text dibersihkan dari HTML tags dan URL pattern menggunakan RegEx, lalu di-lowercase.
    * **Prediction**: Menggunakan model `indobenchmark/indobert-base-p2` dan `BertTokenizer`.
    * **Classification**: Probabilitas prediksi dikonversi menjadi label "Legal" atau "Ilegal" (Threshold 0.5).

4. **Response (`ScrapeResponseV1`)**
    * Service membungkus hasil analisis (label, probability, snippet) ke dalam objek `ScrapeResponseV1`.
    * Controller mengembalikan response ini ke user dalam format JSON standard (`DataResponseParameter`).

## NOTE: ALUR PROSES DETAIL (Penjelasan Mudah)

Berikut adalah perjalanan data ketika Anda mengirim URL (contoh: `https://www.wd33x2.com/`) ke sistem:

### A. Pintu Masuk (Controller & Service)

1. **Controller (`TugasAkhirController` & `Impl`)**
    * Ibarat **"Resepsionis"**.
    * Tugasnya menerima kiriman surat (JSON) dari User yang berisi URL.
    * Dia ngecek, "Oh ini ada permintaan untuk scan URL", lalu suratnya diserahkan ke bagian pemrosesan (Service).

2. **Service (`TugasAkhirService` & `Impl`)**
    * Ibarat **"Manajer"**.
    * Dia menerima perintah dari Resepsionis.
    * Dia tidak mengerjakan teknis "bongkar mesin", tapi dia yang menyuruh tukang (Repository) untuk bekerja: *"Tolong analisa URL ini, nanti hasilnya lapor ke saya rapi-rapi ya."*
    * Setelah tukang selesai, Manajer merapikan laporannya (format JSON) untuk dikembalikan ke Resepsionis.

---

### B. Dapur Teknis (Repository)

Di sinilah **`TugasAkhirRepositoriesV1`** bekerja sebagai **"Tukang Analisa"**. Berikut rincian kerjanya per fungsi:

1. **`analyze_url(url)`** (Sang Koordinator)
    * Ini adalah fungsi utama yang dipanggil oleh Manajer.
    * Perintahnya urut: "Ambil datanya dulu (`scrape`), terus bersihkan (`clean`), baru tebak (`predict`), lalu rangkum hasilnya."

2. **`_scrape_meta(url)`** (Si Pengumpul Data)
    * Tugasnya jalan-jalan ke website target (`https://www.wd33x2.com/`).
    * Dia mencoba masuk (bypass SSL kalau ada peringatan keamanan).
    * Dia mengambil semua **Judul**, **Meta Deskripsi**, **Header**, dan **Paragraf** penting.
    * Hasilnya: Teks mentah berisi info tentang website tersebut.

3. **`_clean_text(text)`** (Si Pembersih)
    * Data mentah tadi masih kotor (banyak kode HTML, spasi ganda, huruf besar-kecil campur).
    * Fungsi ini nge-laundry teksnya:
        * Hapus link `http://...`
        * Hapus kode-kode aneh `<div...>`
        * Kecilkan semua huruf (lowercase).
    * Hasilnya: Teks bersih yang siap dibaca mesin.

4. **`_predict(text)`** (Si Peramal/AI)
    * Teks bersih tadi diserahkan ke "Otak AI" (IndoBERT).
    * AI akan menghitung skor probabilitas (kemungkinan).
    * Contoh mikirnya: *"Hmm, teks ini banyak kata 'Join', 'Bonus', 'Slot'. Kemungkinan 80% ini Ilegal."*
    * Dia memutuskan label akhirnya: **Legal** atau **Ilegal**.

5. **`_get_model_instance()`** (Persiapan Otak)
    * Ini fungsi yang nyiapin otak AI-nya.
    * Kalau otaknya belum bangun, dia bangunin (load model `indobert-base-p2` dari memori).
    * Supaya setiap ada request baru, nggak perlu "beli otak baru" (hemat waktu & memori).

### C. Di Balik Layar (File Model & Cache)

Agar si "Peramal" (AI) bisa bekerja, dia butuh otak dan kamus. File-file ini **TIDAK** ada di dalam folder project kita, melainkan disimpan oleh sistem secara otomatis (cache).

1. **File Penting & Fungsinya:**
    * **`pytorch_model.bin`** (±400MB): Ini adalah **Otak Fisik**-nya. Isinya adalah angka-angka matriks (neuron) hasil belajar AI selama ini. Tanpa ini, AI tidak punya pengetahuan.
    * **`config.json`**: Ini **Manual Book**-nya. Berisi spesifikasi otak (berapa lapis layer-nya, berapa ukuran memorinya, dll).
    * **`vocab.txt`**: Ini **Kamus Bahasa**-nya. Daftar kata-kata yang dimengerti oleh model (misal: "hutan", "judi", "indonesia").

2. **Kapan File Ini Didapat?**
    * **Pertama Kali Run**: Saat Anda pertama kali menjalankan aplikasi dan script memanggil `BertTokenizer.from_pretrained('indobenchmark/indobert-base-p2')`.
    * **Otomatis Download**: Codingan (Library `transformers`) akan mengecek ke dalam laptop:
        * *"Hei laptop, kamu udah punya otak `indobert` belum?"*
        * Jika **BELUM**: Dia akan download otomatis dari internet (HuggingFace Hub) dan menyimpannya.
        * Jika **SUDAH**: Dia akan langsung pakai file yang ada (Load from Cache).

3. **Di Mana Lokasinya?**
    * Tersembunyi di folder user sistem (Home Directory), bukan di folder project aplikasi ini.
    * Path Mac/Linux: `~/.cache/huggingface/hub/models--indobenchmark--indobert-base-p2/...`
    * **Kenapa dipisah?** Supaya kalau Anda bikin 10 aplikasi berbeda tapi pakai otak yang sama, laptop tidak perlu menyimpan 10 otak yang sama (hemat harddisk).

4. **Cara Mengecek Lokasi Folder Cache (Manual):**

    Untuk memastikan apakah file tersebut benar-benar ada, Anda bisa mengeceknya secara manual:

    * **Mac / Linux (via Terminal):**
        Ketik perintah berikut di terminal:

        ```bash
        ls -R ~/.cache/huggingface/hub
        ```

    * **Windows (via File Explorer / Run):**
        1. Tekan tombol `Windows + R` di keyboard.
        2. Ketik `%USERPROFILE%\.cache\huggingface\hub` lalu Enter.
        3. Folder akan terbuka dan Anda bisa melihat folder model-model yang sudah didownload.
