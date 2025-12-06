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
