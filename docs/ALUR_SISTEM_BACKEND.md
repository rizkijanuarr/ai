# DOKUMENTASI ALUR SISTEM BACKEND

## 📋 Daftar Isi

1. [Arsitektur Sistem](#arsitektur-sistem)
2. [Struktur Direktori](#struktur-direktori)
3. [Layer-by-Layer Explanation](#layer-by-layer-explanation)
4. [Alur Data Flow](#alur-data-flow)
5. [Endpoint API](#endpoint-api)
6. [Detail Implementasi](#detail-implementasi)

---

## 🏗️ Arsitektur Sistem

Sistem ini menggunakan **Clean Architecture** dengan pemisahan layer yang jelas:

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT REQUEST                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│               CONTROLLER LAYER                           │
│  • TugasAkhirControllerV1                               │
│  • EvaluationControllerV1                               │
│  • HealthControllerV1                                   │
│                                                          │
│  Tugas: Menerima HTTP Request, Validasi Input          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│            REQUEST DTO (Data Transfer Object)            │
│  • ScrapeSerperRequestV1                                │
│  • ListDatasetRequestV1                                 │
│  • SearchDatasetRequestV1                               │
│  • GetDatasetByLinkRequestV1                            │
│                                                          │
│  Tugas: Validasi & Struktur Data Input                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  SERVICE LAYER                           │
│  • TugasAkhirServiceImplV1                              │
│  • EvaluationServiceV1                                  │
│                                                          │
│  Tugas: Business Logic & Orchestration                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                REPOSITORY LAYER                          │
│  • TugasAkhirRepositoriesV1                             │
│                                                          │
│  Tugas: Data Access & External API Integration         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              DATA SOURCE                                 │
│  • Serper API (Google Search)                           │
│  • CSV File (ALL_DATA_COMBINED_MERGED.csv)              │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Struktur Direktori

```
backend/
├── request/v1/                    # Request DTOs
│   ├── ScrapeSerperRequestV1.py
│   ├── ListDatasetRequestV1.py
│   ├── SearchDatasetRequestV1.py
│   └── GetDatasetByLinkRequestV1.py
│
├── response/v1/                   # Response DTOs
│   ├── ScrapeSerperResponseV1.py
│   ├── ListDatasetResponseV1.py
│   └── DetailDatasetResponseV1.py
│
├── service/v1/                    # Service Interfaces
│   ├── TugasAkhirServiceV1.py
│   ├── EvaluationServiceV1.py
│   └── impl/                      # Service Implementations
│       └── TugasAkhirServiceImplV1.py
│
├── repositories/v1/               # Data Access Layer
│   └── TugasAkhirRepositoriesV1.py
│
└── controller/v1/                 # API Controllers
    ├── TugasAkhirControllerV1.py
    ├── EvaluationControllerV1.py
    ├── HealthControllerV1.py
    └── impl/                      # Controller Implementations
        ├── TugasAkhirControllerImplV1.py
        ├── EvaluationControllerImplV1.py
        └── HealthControllerImplV1.py
```

---

## 🔍 Layer-by-Layer Explanation

### 1️⃣ **REQUEST LAYER** (DTO - Data Transfer Object)

**Lokasi:** `backend/request/v1/`

**Fungsi:** Validasi dan struktur data input dari client

#### File-file:

##### `ScrapeSerperRequestV1.py`
```python
@dataclass
class ScrapeSerperRequestV1:
    query: str                          # Keyword pencarian (wajib)
    location: Optional[str] = "Indonesia"
    gl: Optional[str] = "id"            # Country code
    hl: Optional[str] = "id"            # Language code
    total_pages: Optional[int] = 1      # Max 100 pages
```

**Validasi:**
- `query` tidak boleh kosong
- `total_pages` maksimal 100 (1000 hasil)

##### `ListDatasetRequestV1.py`
```python
@dataclass
class ListDatasetRequestV1:
    is_legal: int                       # 0 = illegal, 1 = legal
    limit_data: int                     # Max 1000
    page: Optional[int] = 1
```

**Validasi:**
- `is_legal` harus 0 atau 1
- `limit_data` antara 1-1000
- `page` minimal 1

##### `SearchDatasetRequestV1.py`
```python
@dataclass
class SearchDatasetRequestV1:
    search_query: str                   # Keyword pencarian
    is_legal: Optional[int] = None      # Filter opsional
    limit_data: int = 10
    page: Optional[int] = 1
```

**Validasi:**
- `search_query` tidak boleh kosong
- `is_legal` jika ada harus 0 atau 1
- `limit_data` maksimal 1000

##### `GetDatasetByLinkRequestV1.py`
```python
@dataclass
class GetDatasetByLinkRequestV1:
    link: str                           # URL lengkap
```

**Validasi:**
- `link` harus dimulai dengan `http://` atau `https://`

---

### 2️⃣ **RESPONSE LAYER** (DTO)

**Lokasi:** `backend/response/v1/`

**Fungsi:** Struktur data output ke client

#### File-file:

##### `ScrapeSerperResponseV1.py`
```python
@dataclass
class SerperOrganicItem:
    title: str
    link: str
    snippet: str
    position: int
    rating: Optional[float] = None
    ratingCount: Optional[int] = None

@dataclass
class ScrapeSerperResponseV1:
    query: str
    total_results: int
    organic: List[SerperOrganicItem]
    csv_path: str
    message: str
```

##### `ListDatasetResponseV1.py`
```python
@dataclass
class ListDatasetResponseV1:
    id: int
    keyword: str
    title: str
    link: str
    description: str
    is_legal: int
    is_ilegal: int
```

##### `DetailDatasetResponseV1.py`
```python
@dataclass
class DetailDatasetResponseV1:
    id: int
    keyword: str
    title: str
    link: str
    description: str
    is_legal: int
    is_ilegal: int
```

---

### 3️⃣ **SERVICE LAYER**

**Lokasi:** `backend/service/v1/` dan `backend/service/v1/impl/`

**Fungsi:** Business logic dan orchestration

#### A. `TugasAkhirServiceV1.py` (Interface/Abstract)

Mendefinisikan kontrak untuk service:
- `getScrapeSerper()`
- `getListDataset()`
- `getDetailDataset()`
- `getDatasetByLink()`
- `searchDataset()`

#### B. `TugasAkhirServiceImplV1.py` (Implementation)

**Dependency:**
```python
self.repository = TugasAkhirRepositoriesV1()
```

**Method-method:**

##### 1. `getScrapeSerper(request)`
```
Flow:
1. Terima ScrapeSerperRequestV1
2. Panggil repository.scrapeSerper()
3. Transform hasil ke ScrapeSerperResponseV1
4. Return response
```

##### 2. `getListDataset(request)`
```
Flow:
1. Terima ListDatasetRequestV1
2. Panggil repository.getListDataset()
3. Transform data list ke ListDatasetResponseV1[]
4. Hitung metadata (pagination, total, has_more)
5. Return dict dengan data + metadata
```

##### 3. `getDetailDataset(id)`
```
Flow:
1. Terima ID integer
2. Panggil repository.getDetailDataset(id)
3. Transform ke DetailDatasetResponseV1
4. Return response
```

##### 4. `getDatasetByLink(link)`
```
Flow:
1. Terima link URL
2. Panggil repository.getDatasetByLink(link)
3. Transform ke DetailDatasetResponseV1
4. Return response
```

##### 5. `searchDataset(request)`
```
Flow:
1. Terima SearchDatasetRequestV1
2. Panggil repository.searchDataset()
3. Transform hasil ke ListDatasetResponseV1[]
4. Hitung metadata pagination
5. Return dict dengan data + metadata
```

#### C. `EvaluationServiceV1.py`

**Fungsi:** Menghitung metrik evaluasi model klasifikasi

**Komponen Utama:**

##### 1. **Classifier (Rule-Based)**
```python
illegal_keywords = [
    'judi', 'slot', 'gacor', 'togel', 'casino',
    'betting', 'poker', 'bandar', 'taruhan',
    'jackpot', 'maxwin', 'rtp', 'scatter',
    'bonus', 'deposit', 'withdraw'
]

legal_keywords = [
    'resmi', 'pemerintah', 'hukum', 'legal',
    'terpercaya', 'pendidikan', 'edukasi',
    'belajar', 'sekolah', 'universitas'
]
```

**Logika Prediksi:**
```
IF illegal_count > legal_count → Predict: ILLEGAL (0)
ELSE IF legal_count > illegal_count → Predict: LEGAL (1)
ELSE → Fallback ke label asli
```

##### 2. **Confusion Matrix**
```python
calculate_confusion_matrix(data):
    For each record:
        actual = record.is_legal
        predicted = predict(record)

        IF actual == 1 AND predicted == 1 → TP++
        ELIF actual == 0 AND predicted == 0 → TN++
        ELIF actual == 0 AND predicted == 1 → FP++
        ELSE → FN++
```

##### 3. **Metrics Calculation**
```python
Accuracy = (TP + TN) / (TP + TN + FP + FN)
Precision = TP / (TP + FP)
Recall = TP / (TP + FN)
F1-Score = 2 × (Precision × Recall) / (Precision + Recall)
```

##### 4. **K-Fold Cross Validation**
```python
k_fold_cross_validation(data, k=5):
    1. Shuffle data (seed=42)
    2. Split data menjadi k folds
    3. For each fold:
        - Gunakan fold sebagai test set
        - Hitung accuracy
    4. Return mean accuracy & std deviation
```

##### 5. **Full Evaluation**
```python
get_full_evaluation(data):
    1. Calculate confusion matrix
    2. Calculate metrics (Accuracy, Precision, Recall, F1)
    3. Perform K-Fold Cross Validation
    4. Generate interpretation & recommendations
    5. Return complete evaluation report
```

---

### 4️⃣ **REPOSITORY LAYER**

**Lokasi:** `backend/repositories/v1/TugasAkhirRepositoriesV1.py`

**Fungsi:** Data access & external API integration

**Komponen:**

#### A. **Serper API Integration**

##### `scrapeSerper(query, location, gl, hl, total_pages)`

**Flow:**
```
1. Setup API Connection
   - Host: google.serper.dev
   - API Key: 70b6e0bfbc9079ef7860c4c088a777135e1bc68a

2. Loop through pages (1 to total_pages):
   - Prepare request payload
   - Send POST request
   - Parse JSON response
   - Extract organic results
   - Add to combined results
   - Delay 200ms between requests

3. Save to CSV:
   - Path: output/data/crawl_serper/{keyword}_{timestamp}.csv
   - Fields: title, link, snippet, position, rating, ratingCount

4. Return:
   {
       query: str,
       total_results: int,
       total_pages: int,
       organic: List[dict],
       csv_path: str
   }
```

#### B. **CSV Data Access**

**File Target:** `output/data/crawl_serper/ALL_DATA_COMBINED_MERGED.csv`

**Struktur CSV:**
```
No, Keyword, Title, Link, Description, is_legal, is_ilegal
```

##### `getListDataset(is_legal, limit_data, page)`

**Flow:**
```
1. Open CSV file
2. Filter by is_legal (0 or 1)
3. Calculate pagination:
   - offset = (page - 1) × limit_data
   - end_index = offset + limit_data
4. Slice data [offset:end_index]
5. Return:
   {
       data: List[dict],
       total_count: int,
       returned_count: int,
       has_more: bool,
       current_page: int
   }
```

##### `getDetailDataset(id)`

**Flow:**
```
1. Open CSV file
2. Loop through rows
3. Find row where No == id
4. Return single record dict
5. Raise ValueError if not found
```

##### `getDatasetByLink(link)`

**Flow:**
```
1. Open CSV file
2. Loop through rows
3. Find row where Link == link (case-insensitive)
4. Return single record dict
5. Raise ValueError if not found
```

##### `searchDataset(search_query, is_legal, limit_data, page)`

**Flow:**
```
1. Open CSV file
2. For each row:
   - Filter by is_legal (if specified)
   - Search in Keyword, Title, Description (case-insensitive)
   - Add to results if match found
3. Apply pagination
4. Return:
   {
       data: List[dict],
       total_count: int,
       returned_count: int,
       has_more: bool,
       current_page: int,
       search_query: str
   }
```

---

### 5️⃣ **CONTROLLER LAYER**

**Lokasi:** `backend/controller/v1/` dan `backend/controller/v1/impl/`

**Fungsi:** HTTP endpoint handlers

#### A. `TugasAkhirControllerV1.py` (Interface)

**Base Path:** `/api/v1`

**Endpoints:**

| Method | Path | Description |
|--------|------|-------------|
| POST | `/serper` | Scrape dengan Serper API |
| GET | `/list-dataset` | Get list dataset |
| GET | `/detail-dataset/{id}` | Get detail by ID |
| POST | `/dataset-by-link` | Get detail by link |
| POST | `/search-dataset` | Search dataset |

#### B. `TugasAkhirControllerImplV1.py` (Implementation)

**Dependency:**
```python
self.service = TugasAkhirServiceImplV1()
```

##### 1. `POST /api/v1/serper`

**Request Body:**
```json
{
    "query": "judi online",
    "location": "Indonesia",
    "gl": "id",
    "hl": "id",
    "total_pages": 5
}
```

**Flow:**
```
1. Validate request → ScrapeSerperRequestV1
2. Call service.getScrapeSerper(request)
3. Transform to ListResponseParameter
4. Return JSON response
```

**Response:**
```json
{
    "success": true,
    "message": "Successfully crawled 50 results",
    "data": {
        "query": "judi online",
        "total_results": 50,
        "organic": [...],
        "csv_path": "output/data/crawl_serper/judi_online_20231230_123456.csv"
    }
}
```

##### 2. `GET /api/v1/list-dataset`

**Query Parameters:**
```
?is_legal=1&limit_data=10&page=1
```

**Flow:**
```
1. Validate params → ListDatasetRequestV1
2. Call service.getListDataset(request)
3. Transform to SliceResponseParameter
4. Return JSON with pagination metadata
```

**Response:**
```json
{
    "success": true,
    "message": "Successfully retrieved 10 of 150 legal dataset records (page 1)",
    "data": [...],
    "total_data": 150,
    "has_next": true,
    "is_first": true,
    "is_last": false,
    "current_page": 1
}
```

##### 3. `GET /api/v1/detail-dataset/{id}`

**Path Parameter:** `id` (integer)

**Flow:**
```
1. Parse id to integer
2. Call service.getDetailDataset(id)
3. Transform to DataResponseParameter
4. Return JSON response
```

**Response:**
```json
{
    "success": true,
    "message": "Success",
    "data": {
        "id": 1,
        "keyword": "judi online",
        "title": "Situs Judi Online Terpercaya",
        "link": "https://example.com",
        "description": "...",
        "is_legal": 0,
        "is_ilegal": 1
    }
}
```

##### 4. `POST /api/v1/dataset-by-link`

**Request Body:**
```json
{
    "link": "https://example.com/page"
}
```

**Flow:**
```
1. Validate request → GetDatasetByLinkRequestV1
2. Call service.getDatasetByLink(link)
3. Transform to DataResponseParameter
4. Return JSON response
```

##### 5. `POST /api/v1/search-dataset`

**Request Body:**
```json
{
    "search_query": "judi",
    "is_legal": 0,
    "limit_data": 20,
    "page": 1
}
```

**Flow:**
```
1. Validate request → SearchDatasetRequestV1
2. Call service.searchDataset(request)
3. Transform to SliceResponseParameter
4. Return JSON with pagination
```

**Response:**
```json
{
    "success": true,
    "message": "Found 45 results for 'judi' (illegal only) (page 1)",
    "data": [...],
    "total_data": 45,
    "has_next": true,
    "is_first": true,
    "is_last": false,
    "current_page": 1
}
```

#### C. `EvaluationControllerV1.py` & Implementation

**Base Path:** `/api/v1`

##### `GET /api/v1/evaluation-metrics`

**Flow:**
```
1. Load ALL data from CSV
2. Call evaluation_service.get_full_evaluation(data)
3. Return complete metrics
```

**Response:**
```json
{
    "success": true,
    "message": "Success",
    "data": {
        "total_samples": 300,
        "legal_count": 150,
        "illegal_count": 150,
        "confusion_matrix": {
            "true_positive": 140,
            "true_negative": 135,
            "false_positive": 15,
            "false_negative": 10
        },
        "metrics": {
            "accuracy": 0.917,
            "precision": 0.903,
            "recall": 0.933,
            "f1_score": 0.918
        },
        "k_fold_results": {
            "k": 5,
            "fold_scores": [0.920, 0.915, 0.910, 0.925, 0.915],
            "mean_accuracy": 0.917,
            "std_deviation": 0.006
        },
        "interpretation": {
            "performance_level": "Baik",
            "stability": "Sangat Stabil",
            "summary": "Model mencapai performa baik dengan akurasi 91.7%...",
            "recommendations": [...]
        }
    }
}
```

#### D. `HealthControllerV1.py` & Implementation

**Base Path:** `/api/v1`

##### `GET /api/v1/health`

**Response:**
```json
{
    "status": "ok"
}
```

---

## 🔄 Alur Data Flow

### Flow 1: Scraping Data dengan Serper API

```
┌──────────┐
│  CLIENT  │
└────┬─────┘
     │ POST /api/v1/serper
     │ Body: { query, location, gl, hl, total_pages }
     ▼
┌─────────────────────────────────┐
│ TugasAkhirControllerImplV1      │
│ ├─ Validate request             │
│ └─ Create ScrapeSerperRequestV1 │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ TugasAkhirServiceImplV1         │
│ └─ getScrapeSerper()            │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ TugasAkhirRepositoriesV1        │
│ ├─ Connect to Serper API        │
│ ├─ Loop through pages           │
│ ├─ Collect organic results      │
│ └─ Save to CSV                  │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ CSV File Created                │
│ output/data/crawl_serper/       │
│ {keyword}_{timestamp}.csv       │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Transform to Response DTO       │
│ ScrapeSerperResponseV1          │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Return JSON Response            │
│ ListResponseParameter           │
└─────────────────────────────────┘
```

### Flow 2: Get List Dataset

```
┌──────────┐
│  CLIENT  │
└────┬─────┘
     │ GET /api/v1/list-dataset?is_legal=1&limit_data=10&page=1
     ▼
┌─────────────────────────────────┐
│ TugasAkhirControllerImplV1      │
│ ├─ Parse query params           │
│ └─ Create ListDatasetRequestV1  │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ TugasAkhirServiceImplV1         │
│ └─ getListDataset()             │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ TugasAkhirRepositoriesV1        │
│ ├─ Open CSV file                │
│ ├─ Filter by is_legal           │
│ ├─ Apply pagination             │
│ └─ Return data + metadata       │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Transform to Response DTOs      │
│ List[ListDatasetResponseV1]     │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Return JSON Response            │
│ SliceResponseParameter          │
│ + Pagination Metadata           │
└─────────────────────────────────┘
```

### Flow 3: Search Dataset

```
┌──────────┐
│  CLIENT  │
└────┬─────┘
     │ POST /api/v1/search-dataset
     │ Body: { search_query, is_legal, limit_data, page }
     ▼
┌─────────────────────────────────┐
│ TugasAkhirControllerImplV1      │
│ ├─ Validate request             │
│ └─ Create SearchDatasetRequestV1│
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ TugasAkhirServiceImplV1         │
│ └─ searchDataset()              │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ TugasAkhirRepositoriesV1        │
│ ├─ Open CSV file                │
│ ├─ Filter by is_legal (optional)│
│ ├─ Search in keyword/title/desc │
│ ├─ Apply pagination             │
│ └─ Return results + metadata    │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Transform to Response DTOs      │
│ List[ListDatasetResponseV1]     │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Return JSON Response            │
│ SliceResponseParameter          │
│ + Search Metadata               │
└─────────────────────────────────┘
```

### Flow 4: Get Evaluation Metrics

```
┌──────────┐
│  CLIENT  │
└────┬─────┘
     │ GET /api/v1/evaluation-metrics
     ▼
┌─────────────────────────────────┐
│ EvaluationControllerImplV1      │
│ └─ getEvaluationMetrics()       │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Load ALL Data from CSV          │
│ ALL_DATA_COMBINED_MERGED.csv    │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ EvaluationServiceV1             │
│ ├─ Calculate Confusion Matrix   │
│ ├─ Calculate Metrics            │
│ │  • Accuracy                   │
│ │  • Precision                  │
│ │  • Recall                     │
│ │  • F1-Score                   │
│ ├─ K-Fold Cross Validation      │
│ └─ Generate Interpretation      │
└────┬────────────────────────────┘
     │
     ▼
┌─────────────────────────────────┐
│ Return Complete Evaluation      │
│ DataResponseParameter           │
│ {                               │
│   confusion_matrix,             │
│   metrics,                      │
│   k_fold_results,               │
│   interpretation                │
│ }                               │
└─────────────────────────────────┘
```

---

## 📊 Detail Implementasi

### 1. Error Handling

Setiap layer memiliki error handling:

**Controller Layer:**
```python
try:
    service_response = self.service.method()
    return ResponseHelper.create_response(...)
except ValueError as ve:
    return error_response(404, "NOT_FOUND", str(ve))
except Exception as e:
    return error_response(500, "INTERNAL_ERROR", str(e))
```

**Repository Layer:**
```python
try:
    # Data access logic
except FileNotFoundError:
    raise ValueError("Dataset file not found")
except Exception as e:
    logger.error(f"Error: {str(e)}")
    raise
```

### 2. Logging

Menggunakan `ColoredLogger` untuk tracking:

```python
logger.info(f"[SERPER] Crawling page {page}/{total}")
logger.debug(f"[DATASET] Reading from: {csv_file}")
logger.error(f"[ERROR] Failed: {error}")
```

### 3. Pagination

**Metadata yang dikembalikan:**
```python
{
    'data': [...],
    'total_data': int,
    'has_next': bool,      # Ada halaman berikutnya?
    'is_first': bool,      # Halaman pertama?
    'is_last': bool,       # Halaman terakhir?
    'current_page': int
}
```

**Perhitungan:**
```python
offset = (page - 1) × limit_data
end_index = offset + limit_data
has_more = end_index < total_count
```

### 4. Data Transformation

**Repository → Service:**
```python
# Repository returns dict
{
    'no': 1,
    'keyword': 'judi',
    'title': '...',
    'link': '...',
    'description': '...',
    'is_legal': 0,
    'is_ilegal': 1
}

# Service transforms to DTO
ListDatasetResponseV1(
    id=1,
    keyword='judi',
    title='...',
    link='...',
    description='...',
    is_legal=0,
    is_ilegal=1
)
```

### 5. CSV File Structure

**Path:** `output/data/crawl_serper/ALL_DATA_COMBINED_MERGED.csv`

**Columns:**
```
No, Keyword, Title, Link, Description, is_legal, is_ilegal
```

**Example:**
```csv
1,"judi online","Situs Judi Online","https://example.com","Deskripsi...",0,1
2,"pendidikan","Portal Pendidikan","https://edu.com","Deskripsi...",1,0
```

### 6. Serper API Configuration

**Endpoint:** `https://google.serper.dev/search`

**Headers:**
```python
{
    'X-API-KEY': '70b6e0bfbc9079ef7860c4c088a777135e1bc68a',
    'Content-Type': 'application/json'
}
```

**Payload:**
```json
{
    "q": "keyword",
    "location": "Indonesia",
    "gl": "id",
    "hl": "id",
    "page": 1
}
```

**Rate Limiting:**
- Delay 200ms antar request
- Max 100 pages per request

---

## 🎯 Kesimpulan

### Prinsip Arsitektur:

1. **Separation of Concerns**: Setiap layer punya tanggung jawab spesifik
2. **Dependency Injection**: Controller → Service → Repository
3. **DTO Pattern**: Request/Response terpisah dari business logic
4. **Interface-Based**: Abstract class untuk contract definition
5. **Error Handling**: Multi-layer error handling dengan logging
6. **Validation**: Input validation di Request DTO layer

### Data Flow Summary:

```
Client Request
  → Controller (HTTP Handler)
    → Request DTO (Validation)
      → Service (Business Logic)
        → Repository (Data Access)
          → Data Source (API/CSV)
        ← Repository
      ← Service
    ← Response DTO (Transformation)
  ← Controller
← JSON Response
```

### Key Features:

✅ **Scraping**: Serper API integration dengan multi-page support
✅ **Dataset Management**: CRUD operations dengan pagination
✅ **Search**: Full-text search di keyword/title/description
✅ **Evaluation**: Complete ML metrics (Confusion Matrix, K-Fold, etc)
✅ **Clean Architecture**: Maintainable & scalable code structure
✅ **Error Handling**: Comprehensive error handling & logging
✅ **Type Safety**: Dataclass untuk type checking

---

**Dokumentasi ini mencakup SEMUA file backend yang Anda sebutkan tanpa ada yang terlewat!** 🎉
