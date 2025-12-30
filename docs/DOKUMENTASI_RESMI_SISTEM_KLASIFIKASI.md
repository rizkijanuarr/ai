---
title: "Dokumentasi Resmi Sistem Klasifikasi Website Legal / Ilegal"
subtitle: "Menggunakan Model IndoBERT Menggunakan Teknologi Berbasis Flask (Python)"
author: "Rizki Januarr"
institution: "UNIVERSITAS NEGERI SURABAYA"
faculty: "FAKULTAS VOKASI"
program: "PROGRAM STUDI SARJANA TERAPAN MANAJEMEN INFORMATIKA"
year: "2025"
---

<div style="page-break-after: always;"></div>

# DAFTAR ISI

1. [DAFTAR ISI](#daftar-isi)
2. [ITERASI / TAHAPAN / URUTAN SECARA RUNTUN DALAM PEMBUATAN SISTEM](#iterasi--tahapan--urutan-secara-runtun-dalam-pembuatan-sistem)
   - [1. Tahapan Backend Menggunakan Teknologi Python / Flask](#1-tahapan-backend-menggunakan-teknologi-python--flask)
     - [1.a. Melakukan Pencarian Dataset dengan Range 500 - 2000 Data](#1a-melakukan-pencarian-dataset-dengan-range-500---2000-data)
       - [1.a.i. Integrasi Package Library Serper](#1ai-integrasi-package-library-serper)
       - [1.a.ii. Pengolahan Data dengan IndoBERT](#1aii-pengolahan-data-dengan-indobert)
       - [1.a.iii. Melakukan Proses Fitur Endpoint](#1aiii-melakukan-proses-fitur-endpoint)
   - [2. Tahapan Frontend Menggunakan Teknologi HTML / JINJA / JS](#2-tahapan-frontend-menggunakan-teknologi-html--jinja--js)

<div style="page-break-after: always;"></div>

# ITERASI / TAHAPAN / URUTAN SECARA RUNTUN DALAM PEMBUATAN SISTEM

## 1. Tahapan Backend Menggunakan Teknologi Python / Flask

### 1.a. Melakukan Pencarian Dataset dengan Range 500 - 2000 Data

#### 1.a.i. Integrasi Package Library Serper

**Link:** [https://serper.dev/](https://serper.dev/)

##### 1. Melakukan Proses Fitur Endpoint Serper

**Deskripsi:**
Fitur untuk crawling data dari Google Search menggunakan Serper.dev API. Data hasil crawling disimpan dalam format CSV untuk digunakan sebagai dataset training.

**Related Files:**

| Layer | File Path | Fungsi |
|-------|-----------|--------|
| **Request DTO** | `backend/request/v1/ScrapeSerperRequestV1.py` | Validasi input request dari user |
| **Response DTO** | `backend/response/v1/ScrapeSerperResponseV1.py` | Format output response ke user |
| **Repository** | `backend/repositories/v1/TugasAkhirRepositoriesV1.py` | Implementasi crawling & save CSV |
| **Service** | `backend/service/v1/impl/TugasAkhirServiceImplV1.py` | Business logic & transformation |
| **Controller** | `backend/controller/v1/impl/TugasAkhirControllerImplV1.py` | Handle HTTP request/response |

**Fungsi Utama:**

1. **`scrapeSerper(query, location, gl, hl, total_pages)`**
   - Melakukan HTTP POST request ke Serper API
   - Support multi-page crawling (1-100 pages)
   - Rate limiting dengan delay 200ms antar request
   - Return hasil dalam format dict

2. **`saveToCsv(keyword, data)`**
   - Menyimpan hasil crawling ke file CSV
   - Auto-create directory jika belum ada
   - Generate filename dengan timestamp
   - Format: `{keyword}_{timestamp}.csv`

3. **`getScrapeSerper(request)`**
   - Handle HTTP POST request dari client
   - Validasi input menggunakan Request DTO
   - Transform hasil ke Response DTO
   - Error handling dengan try-catch

**Flow Diagram:**

```
HTTP POST /api/v1/serper
    ↓
Controller (Validate Request)
    ↓
Service (Extract Parameters)
    ↓
Repository (Call Serper API)
    ↓
Loop through pages:
  - POST to google.serper.dev
  - Parse JSON response
  - Extract organic results
  - Delay 200ms
    ↓
Save to CSV
    ↓
Transform to Response DTO
    ↓
Return JSON Response
```

**Input/Output:**

- **Input:**
  - `query` (string): Keyword pencarian
  - `location` (string): Lokasi pencarian (default: "Indonesia")
  - `gl` (string): Country code (default: "id")
  - `hl` (string): Language code (default: "id")
  - `total_pages` (int): Total halaman (1-100)

- **Output:**
  - CSV File: `output/data/crawl_serper/{keyword}_{timestamp}.csv`
  - JSON Response dengan data: query, total_results, organic[], csv_path

**Contoh Request:**
```json
{
  "query": "SLOT",
  "location": "Indonesia",
  "gl": "id",
  "hl": "id",
  "total_pages": 10
}
```

**Contoh Response:**
```json
{
  "success": true,
  "message": "Successfully crawled 100 results",
  "data": {
    "query": "SLOT",
    "total_results": 100,
    "organic": [...],
    "csv_path": "output/data/crawl_serper/SLOT_20251228_054734.csv"
  }
}
```

---

##### 2. Pencarian Dataset Berdasarkan Keyword Legal + Serta Proses Penyimpanan Data Menggunakan Format .CSV

**Deskripsi:**
Melakukan crawling data untuk keyword yang termasuk kategori **Legal** (e-commerce, pemerintah, pendidikan, dll) dan menyimpan hasilnya dalam format CSV.

**Keyword Legal yang Digunakan:**
- "e-commerce indonesia"
- "toko online resmi"
- "marketplace terpercaya"
- "website pemerintah"
- "universitas indonesia"
- "berita online resmi"

**Proses:**
1. Loop untuk setiap keyword legal
2. Call endpoint `/api/v1/serper` dengan keyword
3. Simpan hasil ke CSV dengan nama: `{keyword}_legal_{timestamp}.csv`
4. Combine semua CSV menjadi 1 file: `ALL_LEGAL_DATA_COMBINED.csv`

**Output:**
- Multiple CSV files untuk setiap keyword
- 1 Combined CSV file dengan semua data legal
- Total target: 500-1000 data legal

---

##### 3. Pencarian Dataset Berdasarkan Keyword Ilegal + Serta Proses Penyimpanan Data Menggunakan Format .CSV

**Deskripsi:**
Melakukan crawling data untuk keyword yang termasuk kategori **Ilegal** (judi online, slot, scam, phishing, dll) dan menyimpan hasilnya dalam format CSV.

**Keyword Ilegal yang Digunakan:**
- "slot gacor"
- "judi online"
- "situs togel"
- "casino online"
- "maxwin slot"
- "bonus slot"

**Proses:**
1. Loop untuk setiap keyword ilegal
2. Call endpoint `/api/v1/serper` dengan keyword
3. Simpan hasil ke CSV dengan nama: `{keyword}_ilegal_{timestamp}.csv`
4. Combine semua CSV menjadi 1 file: `ALL_ILEGAL_DATA_COMBINED.csv`

**Output:**
- Multiple CSV files untuk setiap keyword
- 1 Combined CSV file dengan semua data ilegal
- Total target: 500-1000 data ilegal

---

#### 1.a.ii. Pengolahan Data dengan IndoBERT

**Deskripsi:**
Pengolahan data menggunakan pre-integration IndoBERT + Serta Validasi Pengujian Data Kembali dan Evaluasi Model dengan Perhitungan K-Fold dari Keseluruhan Dataset.

**Related Files:**
- Repository: `backend/repositories/v1/TugasAkhirRepositoriesV1.py`
  - Method: `getPredictModel()`, `getModelInstanceIndoBert()`

**Proses:**
1. Load IndoBERT model: `indobenchmark/indobert-base-p2`
2. Tokenize text dengan max_length=512
3. Predict menggunakan model (Legal/Ilegal)
4. Validasi dengan keyword analysis
5. Hybrid decision (AI + Keyword)
6. Evaluasi model dengan K-Fold Cross Validation

---

#### 1.a.iii. Melakukan Proses Fitur Endpoint

##### i. Integrasi SwaggerDocs

**Deskripsi:**
Dokumentasi API otomatis menggunakan Swagger UI untuk memudahkan testing dan dokumentasi endpoint.

**Related Files:**
- Annotations: `backend/annotations/method/SwaggerTypeGroup.py`
- Controller: Semua controller dengan decorator `@PostEndpoint`, `@GetEndpoint`

**Endpoint yang Didokumentasikan:**
- `POST /api/v1/serper` - Scrape With Serper API
- `GET /api/v1/list-dataset` - Get List Dataset
- `GET /api/v1/detail-dataset/{id}` - Get Detail Dataset
- `POST /api/v1/dataset-by-link` - Get Dataset by Link URL
- `POST /api/v1/search-dataset` - Search Dataset

**Akses Swagger UI:**
- URL: `http://localhost:5000/swagger`

---

##### ii. List Dataset

**Endpoint:** `GET /api/v1/list-dataset`

**Deskripsi:**
Mendapatkan list dataset dengan pagination dan filter berdasarkan tipe (legal/ilegal).

**Related Files:**
- Request: `backend/request/v1/ListDatasetRequestV1.py`
- Response: `backend/response/v1/ListDatasetResponseV1.py`
- Service: `backend/service/v1/impl/TugasAkhirServiceImplV1.py`
- Repository: `backend/repositories/v1/TugasAkhirRepositoriesV1.py`

**Parameters:**
- `is_legal` (int): 1 untuk legal, 0 untuk ilegal
- `limit_data` (int): Jumlah data per page
- `page` (int): Nomor halaman

**Response:**
```json
{
  "success": true,
  "data": [...],
  "total_data": 500,
  "has_next": true,
  "is_first": true,
  "is_last": false,
  "current_page": 1
}
```

---

##### iii. Detail Dataset

**Endpoint:** `GET /api/v1/detail-dataset/{id}`

**Deskripsi:**
Mendapatkan detail single dataset berdasarkan ID.

**Related Files:**
- Response: `backend/response/v1/DetailDatasetResponseV1.py`
- Service: `backend/service/v1/impl/TugasAkhirServiceImplV1.py`
- Repository: `backend/repositories/v1/TugasAkhirRepositoriesV1.py`

**Parameters:**
- `id` (int): ID dataset (dari kolom No di CSV)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "keyword": "SLOT",
    "title": "RAJA99: Situs Slot Gacor...",
    "link": "https://...",
    "description": "...",
    "is_legal": 0,
    "is_ilegal": 1
  }
}
```

---

##### iv. Search Dataset By Link - (Goals Utama)

**Endpoint:** `POST /api/v1/dataset-by-link`

**Deskripsi:**
**FITUR UTAMA** - Mencari dataset berdasarkan URL link untuk mengetahui apakah website tersebut termasuk legal atau ilegal.

**Related Files:**
- Request: `backend/request/v1/GetDatasetByLinkRequestV1.py`
- Response: `backend/response/v1/DetailDatasetResponseV1.py`
- Service: `backend/service/v1/impl/TugasAkhirServiceImplV1.py`
- Repository: `backend/repositories/v1/TugasAkhirRepositoriesV1.py`

**Request Body:**
```json
{
  "link": "https://www.example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "keyword": "SLOT",
    "title": "RAJA99: Situs Slot Gacor...",
    "link": "https://www.example.com",
    "description": "...",
    "is_legal": 0,
    "is_ilegal": 1
  }
}
```

**Use Case:**
- User input URL website yang ingin dicek
- Sistem search di dataset yang sudah di-crawl
- Return informasi apakah website legal/ilegal
- Jika tidak ditemukan di dataset, bisa trigger analisis baru

---

##### v. Search Dataset Berdasarkan Keyword dan Tipe Legal/Ilegal

**Endpoint:** `POST /api/v1/search-dataset`

**Deskripsi:**
Mencari dataset berdasarkan keyword (title, description, link) dengan filter tipe legal/ilegal.

**Related Files:**
- Request: `backend/request/v1/SearchDatasetRequestV1.py`
- Response: `backend/response/v1/ListDatasetResponseV1.py`
- Service: `backend/service/v1/impl/TugasAkhirServiceImplV1.py`
- Repository: `backend/repositories/v1/TugasAkhirRepositoriesV1.py`

**Request Body:**
```json
{
  "search_query": "slot",
  "is_legal": 0,
  "limit_data": 10,
  "page": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "total_data": 50,
  "has_next": true,
  "current_page": 1,
  "message": "Found 50 results for 'slot' (illegal only)"
}
```

---

##### vi. Evaluasi Model K-Fold

**Deskripsi:**
Evaluasi performa model IndoBERT menggunakan K-Fold Cross Validation untuk mengukur akurasi, precision, recall, dan F1-score.

**Related Files:**
- Repository: `backend/repositories/v1/TugasAkhirRepositoriesV1.py`
  - Method: `evaluateModelKFold()`

**Proses:**
1. Split dataset menjadi K folds (default: 5)
2. Training model pada K-1 folds
3. Testing pada 1 fold sisanya
4. Repeat untuk semua kombinasi folds
5. Calculate average metrics

**Metrics:**
- Accuracy
- Precision
- Recall
- F1-Score
- Confusion Matrix

---

## 2. Tahapan Frontend Menggunakan Teknologi HTML / JINJA / JS

### 2.a. Melakukan Pembuatan Komponen Re-usable

**Deskripsi:**
Membuat komponen-komponen yang dapat digunakan kembali (reusable) di berbagai halaman untuk konsistensi dan maintainability.

**Komponen yang Dibuat:**

#### i. Komponen Navbar
**File:** `frontend/components/navbar.html`

**Fungsi:**
- Navigation menu
- Logo aplikasi
- User profile (jika ada authentication)

---

#### ii. Komponen Hero Section
**File:** `frontend/components/hero.html`

**Fungsi:**
- Hero section dengan background video
- Search box untuk input URL
- Call-to-action button

---

#### iii. Komponen Search Bar
**File:** `frontend/components/search_bar.html`

**Fungsi:**
- Input field untuk URL/keyword
- Search button
- Integration dengan API `/api/v1/dataset-by-link`

---

#### iv. Komponen Button
**File:** `frontend/components/button.html`

**Fungsi:**
- Reusable button dengan berbagai variant
- Primary, secondary, danger, success

---

### 2.b. Implementasi Menggunakan Teknologi JavaScript [JS]

#### i. Proses Data Transfer Object [DTO] Data Response berdasarkan Fitur yang telah dilakukan pada Proses di Backend [1.c]

**File:** `frontend/static/js/api.js`

**Fungsi:**
- Fetch data dari backend API
- Transform response ke format yang dibutuhkan frontend
- Error handling untuk API calls

**Contoh:**
```javascript
async function getDatasetByLink(link) {
  const response = await fetch('/api/v1/dataset-by-link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ link: link })
  });

  const data = await response.json();
  return data;
}
```

---

#### ii. Pemanggilan Fitur Endpoint yang telah dilakukan pada Proses di Backend [1.c]

**File:** `frontend/static/js/main.js`

**Fungsi:**
- Event listeners untuk user interactions
- Call API endpoints
- Update UI berdasarkan response

**Endpoints yang Dipanggil:**
- `/api/v1/serper` - Crawl data baru
- `/api/v1/list-dataset` - List dataset
- `/api/v1/detail-dataset/{id}` - Detail dataset
- `/api/v1/dataset-by-link` - Search by link (UTAMA)
- `/api/v1/search-dataset` - Search by keyword

---

### 2.c. Implementasi User Interface / Tampilan Menggunakan Teknologi HTML & Jinja Flask

**Deskripsi:**
Implementasi tampilan website menggunakan HTML dengan template engine Jinja2 dari Flask.

**Main Pages:**

1. **`index.html`** - Homepage dengan search box
2. **`dataset.html`** - List dataset dengan pagination
3. **`detail.html`** - Detail single dataset
4. **`search.html`** - Search results page

**Features:**
- Responsive design (mobile-friendly)
- Modern UI dengan CSS
- Dynamic content dengan Jinja2
- Integration dengan JavaScript untuk interactivity

---

<div style="page-break-after: always;"></div>

# LAMPIRAN

## A. Struktur Folder Project

```
ai/
├── backend/
│   ├── annotations/
│   ├── controller/
│   │   └── v1/
│   │       ├── TugasAkhirControllerV1.py
│   │       └── impl/
│   │           └── TugasAkhirControllerImplV1.py
│   ├── repositories/
│   │   └── v1/
│   │       └── TugasAkhirRepositoriesV1.py
│   ├── request/
│   │   └── v1/
│   │       ├── ScrapeSerperRequestV1.py
│   │       ├── ListDatasetRequestV1.py
│   │       ├── SearchDatasetRequestV1.py
│   │       └── GetDatasetByLinkRequestV1.py
│   ├── response/
│   │   └── v1/
│   │       ├── ScrapeSerperResponseV1.py
│   │       ├── ListDatasetResponseV1.py
│   │       └── DetailDatasetResponseV1.py
│   ├── service/
│   │   └── v1/
│   │       ├── TugasAkhirServiceV1.py
│   │       └── impl/
│   │           └── TugasAkhirServiceImplV1.py
│   └── utils/
│       ├── ColoredLogger.py
│       ├── ResponseHelper.py
│       └── Exceptions.py
├── frontend/
│   ├── components/
│   │   ├── navbar.html
│   │   ├── hero.html
│   │   ├── search_bar.html
│   │   └── button.html
│   ├── static/
│   │   ├── css/
│   │   └── js/
│   │       ├── api.js
│   │       ├── main.js
│   │       └── config.js
│   └── templates/
│       ├── index.html
│       ├── dataset.html
│       ├── detail.html
│       └── search.html
├── output/
│   └── data/
│       └── crawl_serper/
│           ├── SLOT_20251228_054734.csv
│           ├── ALL_LEGAL_DATA_COMBINED.csv
│           └── ALL_ILEGAL_DATA_COMBINED.csv
├── docs/
│   └── DOKUMENTASI_RESMI_SISTEM_KLASIFIKASI.md
├── app.py
└── requirements.txt
```

---

## B. API Endpoints Summary

| Method | Endpoint | Deskripsi | Status |
|--------|----------|-----------|--------|
| POST | `/api/v1/serper` | Crawl data dengan Serper API | ✅ |
| GET | `/api/v1/list-dataset` | Get list dataset dengan pagination | ✅ |
| GET | `/api/v1/detail-dataset/{id}` | Get detail dataset by ID | ✅ |
| POST | `/api/v1/dataset-by-link` | **Search dataset by link (UTAMA)** | ✅ |
| POST | `/api/v1/search-dataset` | Search dataset by keyword | ✅ |

---

## C. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Backend Framework** | Flask | 2.x |
| **AI Model** | IndoBERT | indobenchmark/indobert-base-p2 |
| **Machine Learning** | PyTorch | 2.x |
| **API Documentation** | Swagger UI | Latest |
| **Data Crawling** | Serper API | Latest |
| **Frontend Template** | Jinja2 | 3.x |
| **Frontend JS** | Vanilla JavaScript | ES6+ |
| **Styling** | CSS | 3 |
| **Data Storage** | CSV Files | - |
| **Logging** | ColoredLogger | Custom |

---

**END OF DOCUMENT**

---

**Informasi Dokumen:**
- **Dibuat:** 28 Desember 2025
- **Terakhir Diupdate:** 28 Desember 2025
- **Versi:** 1.0.0
- **Status:** Production Ready ✅
