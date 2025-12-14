# 🎯 FLOW NON-TEKNIS

## 📖 Overview

Dokumen ini menjelaskan alur kerja sistem klasifikasi website **dari sudut pandang pengguna** dan **proses bisnis**, tanpa detail teknis programming.

---

## 🎬 Scenario Penggunaan

### **Scenario 1: Mengecek Website E-commerce**

**User**: Saya ingin mengecek apakah website `giftline.my.id` aman atau tidak.

**Sistem**:

1. ✅ Mengakses website tersebut
2. ✅ Membaca judul dan deskripsi website
3. ✅ Menganalisa menggunakan AI
4. ✅ Memeriksa kata-kata kunci
5. ✅ Memberikan hasil: **LEGAL** (E-commerce terpercaya)

---

### **Scenario 2: Mengecek Website Judi**

**User**: Saya mendapat link `wd33x4.com`, apakah ini aman?

**Sistem**:

1. ⚠️ Mencoba mengakses website
2. ⚠️ Website memblokir akses (403 Forbidden)
3. ⚠️ Tidak bisa membaca konten
4. ❌ Memberikan hasil: **ILEGAL** (Website mencurigakan karena memblokir akses)

---

### **Scenario 3: Mengecek Website yang Sama (Kedua Kali)**

**User**: Saya ingin cek `giftline.my.id` lagi.

**Sistem**:

1. ⚡ Mengecek database internal
2. ⚡ Menemukan hasil analisa sebelumnya
3. ⚡ Langsung memberikan hasil: **LEGAL** (dari cache, sangat cepat!)

---

## 🔄 Alur Proses Umum

```
┌─────────────────────────────────────────────────────────┐
│  1. USER MENGIRIM URL                                   │
│     "Apakah website ini legal atau ilegal?"             │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  2. SISTEM MENGECEK DATABASE                            │
│     "Apakah URL ini sudah pernah dicek sebelumnya?"     │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
    ✅ SUDAH              ❌ BELUM
        │                     │
        │          ┌──────────▼──────────────────────────┐
        │          │  3. SISTEM MENGAKSES WEBSITE        │
        │          │     - Membaca judul                 │
        │          │     - Membaca deskripsi             │
        │          └──────────┬──────────────────────────┘
        │                     │
        │          ┌──────────▼──────────────────────────┐
        │          │  4. SISTEM MENGANALISA              │
        │          │     A. AI (IndoBERT)                │
        │          │        - Membaca konteks            │
        │          │        - Memprediksi legal/ilegal   │
        │          │                                     │
        │          │     B. KEYWORD ANALYSIS             │
        │          │        - Cari kata "judi", "slot"   │
        │          │        - Cari kata "resmi", "legal" │
        │          │                                     │
        │          │     C. HYBRID DECISION              │
        │          │        - Gabungkan AI + Keyword     │
        │          │        - Tentukan hasil akhir       │
        │          └──────────┬──────────────────────────┘
        │                     │
        │          ┌──────────▼──────────────────────────┐
        │          │  5. SISTEM MENYIMPAN HASIL          │
        │          │     - Simpan ke database            │
        │          │     - Belajar kata-kata baru        │
        │          └──────────┬──────────────────────────┘
        │                     │
        └─────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│  6. SISTEM MEMBERIKAN HASIL                             │
│     ✅ LEGAL (Probabilitas: 85%)                        │
│     atau                                                │
│     ❌ ILEGAL (Probabilitas: 35%)                       │
└─────────────────────────────────────────────────────────┘
```

---

## 🧠 Cara Kerja AI

### **Analogi Sederhana:**

Bayangkan AI seperti **seorang ahli** yang sudah membaca **ribuan website** dan belajar membedakan:

**Website Legal:**

- Punya informasi jelas
- Deskripsi profesional
- Kontak resmi
- Tidak ada kata-kata mencurigakan

**Website Ilegal:**

- Informasi tidak jelas
- Banyak kata "bonus", "gacor", "maxwin"
- Sering block akses
- Konten mencurigakan

---

## 🎓 Transfer Learning (Sistem Belajar Otomatis)

### **Cara Kerja:**

1. **Analisa Pertama:**
   - Website: "Giftline - Aplikasi penjualan online produk"
   - Hasil: Legal
   - **Sistem Belajar**: Simpan kata ["giftline", "aplikasi", "penjualan", "online", "produk"]

2. **Analisa Kedua (Website Serupa):**
   - Website: "Tokopedia - Toko online penjualan produk elektronik"
   - **Sistem Mengenali**: Kata "online", "penjualan", "produk" (sudah pernah ketemu!)
   - Hasil: Legal (lebih yakin karena ada kata-kata yang dikenali)

3. **Semakin Banyak Analisa = Semakin Pintar!**

---

## 📊 Tingkat Kepercayaan (Probability)

Sistem memberikan **skor kepercayaan** 0-100%:

| Skor | Interpretasi | Contoh |
|------|-------------|--------|
| 90-100% | **Sangat Yakin** | Website pemerintah resmi |
| 70-89% | **Yakin** | E-commerce terkenal |
| 50-69% | **Cukup Yakin** | Website baru tapi tidak mencurigakan |
| 30-49% | **Tidak Yakin** | Website dengan konten ambigu |
| 0-29% | **Sangat Tidak Yakin** | Website judi, scam |

**Threshold**: 50%

- ≥ 50% → **LEGAL**
- < 50% → **ILEGAL**

---

## 🚫 Kasus Khusus: Scraping Gagal

### **Apa yang Terjadi?**

Jika website **memblokir akses** atau **tidak bisa dibaca**:

```
Website Judi → Block Akses (403 Forbidden)
    ↓
Sistem tidak bisa baca konten
    ↓
OTOMATIS DIANGGAP ILEGAL
    ↓
Alasan: Website legal jarang block akses
```

**Logika:**

- ✅ Website legal (e-commerce, pemerintah) → **Mudah diakses**
- ❌ Website ilegal (judi, scam) → **Sering block akses** (anti-bot)

---

## 🎯 Decision Making Process

### **Hybrid Decision (AI + Keyword):**

```
┌─────────────────────────────────────────────┐
│  AI PREDICTION                              │
│  "Website ini sepertinya LEGAL (55%)"       │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│  KEYWORD VALIDATION                         │
│  Legal: 0 kata                              │
│  Ilegal: 15 kata ("judi", "slot", "gacor")  │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│  OVERRIDE DECISION                          │
│  "AI salah! Banyak kata ilegal!"            │
│  FINAL: ILEGAL (40%)                        │
└─────────────────────────────────────────────┘
```

**Aturan Override:**

1. **Jika keyword ilegal > keyword legal** → Override ke ILEGAL
2. **Jika keyword legal ≥ 3 DAN keyword ilegal = 0** → Override ke LEGAL
3. **Jika seimbang** → Ikuti AI

---

## 💾 Penyimpanan Data

### **Apa yang Disimpan?**

Setiap analisa disimpan dengan informasi:

- ✅ URL website
- ✅ Hasil klasifikasi (Legal/Ilegal)
- ✅ Tingkat kepercayaan (%)
- ✅ Konten yang dianalisa
- ✅ IP Address
- ✅ Lokasi server
- ✅ Waktu analisa

### **Untuk Apa?**

1. **Cache** - Agar analisa kedua lebih cepat
2. **History** - Tracking website yang sudah dicek
3. **Learning** - Sistem belajar dari hasil analisa

---

## 🔄 Lifecycle Data

```
Analisa Baru
    ↓
Simpan ke Database
    ↓
Extract Keyword Baru
    ↓
Tambah ke Knowledge Base
    ↓
Sistem Makin Pintar
    ↓
Analisa Selanjutnya Lebih Akurat
```

---

## 📈 Improvement Over Time

**Minggu 1:**

- Keyword Database: 50 kata
- Akurasi: 70%

**Minggu 4:**

- Keyword Database: 500 kata
- Akurasi: 85%

**Bulan 3:**

- Keyword Database: 2000 kata
- Akurasi: 95%

**Semakin banyak digunakan = Semakin akurat!**

---

## 🎭 Contoh Kasus Nyata

### **Kasus 1: Website Pemerintah**

```
URL: kemenkumham.go.id
AI: Legal (95%)
Keyword: Legal 8 kata, Ilegal 0 kata
FINAL: LEGAL ✅ (95%)
```

### **Kasus 2: Website Judi**

```
URL: slot-gacor123.com
AI: Legal (52%) ← AI salah!
Keyword: Legal 0 kata, Ilegal 12 kata
OVERRIDE: ILEGAL ❌ (40%)
```

### **Kasus 3: Website E-commerce**

```
URL: tokopedia.com
AI: Legal (88%)
Keyword: Legal 5 kata, Ilegal 0 kata
FINAL: LEGAL ✅ (88%)
```

---

## ⚡ Performa

- **Analisa Pertama**: 2-5 detik
- **Analisa dari Cache**: < 0.1 detik (instant!)
- **Akurasi**: 85-95% (tergantung training data)

---

**Last Updated**: 2025-12-14  
**Version**: 1.0.0  
**Author**: Tugas Akhir Team
