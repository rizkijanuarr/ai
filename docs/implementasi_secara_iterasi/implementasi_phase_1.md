# 📊 Implementasi Phase 1 - Dataset API

## 🎯 Overview

Phase 1 fokus pada pembuatan API untuk mengakses dataset hasil crawling (Legal & Ilegal). Total dataset: **3,605 records** (2,463 legal + 1,142 ilegal).

---

## 📁 Struktur Dataset CSV

### File Locations

- **Legal**: `/output/data/crawl_serper/data_legal/ALL_DATA_COMBINED_LEGAL.csv`
- **Ilegal**: `/output/data/crawl_serper/data_ilegal/ALL_DATA_COMBINED_ILEGAL.csv`

### Struktur Kolom CSV

| No | Kolom | Tipe | Deskripsi |
|----|-------|------|-----------|
| 1 | No | Integer | ID unik (penomoran) |
| 2 | Keyword | String | Keyword crawling |
| 3 | Title | String | Judul hasil |
| 4 | Link | String | URL website |
| 5 | Description | String | Deskripsi konten |
| 6 | is_legal | Binary | 1 = Legal, 0 = Ilegal |
| 7 | is_ilegal | Binary | 1 = Ilegal, 0 = Legal |

---

## 🚀 Endpoint API

### 1️⃣ GET `/api/v1/list-dataset`

**Deskripsi**: Mendapatkan daftar dataset dengan filter dan limit

**Request Body**:

```json
{
    "is_legal": 1,
    "limit_data": 10
}
```

**Parameter**:

- `is_legal` (required): 1 = Legal, 0 = Ilegal
- `limit_data` (required): Jumlah data yang diambil (max: 1000)

**Response** (`ListResponseParameter`):

```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": [
        {
            "id": 1,
            "keyword": "kursus online terpercaya",
            "title": "Platform Kursus Online Terbaik",
            "link": "https://example.com",
            "description": "Kursus online dengan sertifikat...",
            "is_legal": 1,
            "is_ilegal": 0
        },
        {
            "id": 2,
            "keyword": "universitas terbaik indonesia",
            "title": "Universitas Indonesia",
            "link": "https://ui.ac.id",
            "description": "Universitas terbaik di Indonesia...",
            "is_legal": 1,
            "is_ilegal": 0
        }
    ]
}
```

---

### 2️⃣ GET `/api/v1/detail-dataset/{id}`

**Deskripsi**: Mendapatkan detail dataset berdasarkan ID

**Path Parameter**:

- `id` (required): ID dataset (dari kolom No)

**Response** (`DataResponseParameter`):

```json
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": {
        "id": 1,
        "keyword": "kursus online terpercaya",
        "title": "Platform Kursus Online Terbaik",
        "link": "https://example.com",
        "description": "Kursus online dengan sertifikat...",
        "is_legal": 1,
        "is_ilegal": 0
    }
}
```

---

### 3️⃣ GET `/api/v1/query-strings`

**Deskripsi**: Mendapatkan semua query strings unik dari dataset

**Query Strings**: Gabungan dari `keyword`, `title`, dan `description`

**Response** (`ListResponseParameter`):

```json
{
    "success": true,
    "message": "Query strings retrieved successfully",
    "data": [
        {
            "id": 1,
            "keyword": "kursus online terpercaya",
            "title": "Platform Kursus Online Terbaik",
            "link": "https://example.com",
            "description": "Kursus online dengan sertifikat...",
            "is_legal": 1,
            "is_ilegal": 0
        }
    ]
}
```

---

## 📂 File Structure & Implementation

### ✅ Files yang Sudah Dibuat (Marked with `TODO!!!`)

#### 1. **Request DTO**

- `backend/request/v1/ListDatasetRequestV1.py`

  ```python
  @dataclass
  class ListDatasetRequestV1:
      is_legal: int
      limit_data: int
  ```

#### 2. **Response DTO**

- `backend/response/v1/ListDatasetResponseV1.py`

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

- `backend/response/v1/DetailDatasetResponseV1.py`

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

#### 3. **Service Layer**

- `backend/service/v1/TugasAkhirServiceV1.py` (Abstract)
  - `getListDataset(request: ListDatasetRequestV1) -> ListDatasetResponseV1`
  - `getDetailDataset(id: int) -> DetailDatasetResponseV1`
  - `getQueryStrings() -> ListDatasetResponseV1`

- `backend/service/v1/impl/TugasAkhirServiceImplV1.py` (Implementation)
  - ✅ `getListDataset()` - Implemented
  - ✅ `getDetailDataset()` - Implemented
  - ✅ `getQueryStrings()` - Implemented

#### 4. **Repository Layer**

- `backend/repositories/v1/TugasAkhirRepositoriesV1.py`
  - ⏳ `getListDataset(is_legal: bool, limit_data: int)` - **TODO**
  - ⏳ `getDetailDataset(id: int)` - **TODO**
  - ⏳ `getQueryStrings()` - **TODO**

#### 5. **Controller Layer**

- `backend/controller/v1/TugasAkhirControllerV1.py` (Abstract)
  - ✅ Endpoint definitions added

- `backend/controller/v1/impl/TugasAkhirControllerImplV1.py` (Implementation)
  - ✅ `getListDataset()` - Implemented
  - ✅ `getDetailDataset()` - Implemented
  - ✅ `getQueryStrings()` - Implemented

---

## 📋 Implementation Checklist

### ✅ Completed

- [x] Create Request DTO (`ListDatasetRequestV1`)
- [x] Create Response DTOs (`ListDatasetResponseV1`, `DetailDatasetResponseV1`)
- [x] Define Service abstract methods
- [x] Implement Service layer
- [x] Define Controller endpoints
- [x] Implement Controller layer
- [x] Prepare CSV datasets (Legal & Ilegal)
- [x] Add `is_legal` and `is_ilegal` columns
- [x] Rename `Snippet` to `Description`
- [x] Remove unnecessary columns (Position, Rating, RatingCount)

### ⏳ In Progress

- [ ] **Implement Repository layer** (NEXT STEP!)
  - [ ] `getListDataset()` - Read CSV, filter by is_legal, apply limit
  - [ ] `getDetailDataset()` - Read CSV, find by ID
  - [ ] `getQueryStrings()` - Extract unique query strings

### 🔜 Next Steps

- [ ] Test endpoints dengan Postman/Swagger
- [ ] Add pagination support
- [ ] Add error handling untuk ID not found
- [ ] Add caching untuk performa
- [ ] Add logging

---

## 🎯 Implementation Priority

**NEXT: Implement Repository Methods**

Focus pada 3 method di `TugasAkhirRepositoriesV1.py`:

1. **`getListDataset(is_legal, limit_data)`**
   - Baca CSV berdasarkan `is_legal`
   - Filter data
   - Apply limit
   - Return list of dict

2. **`getDetailDataset(id)`**
   - Baca CSV (legal + ilegal)
   - Cari row dengan No == id
   - Return dict atau raise error jika tidak ada

3. **`getQueryStrings()`**
   - Baca semua CSV
   - Gabungkan keyword + title + description
   - Return unique query strings

---

## 📊 Dataset Statistics

- **Total Records**: 3,605
- **Legal Dataset**: 2,463 records (68.3%)
- **Ilegal Dataset**: 1,142 records (31.7%)
- **Total Keywords**: 24 unique keywords
- **File Size**: ~500KB (combined)

---

## 🔥 Expected Output

Setelah Phase 1 selesai:

- ✅ 3 endpoint API berfungsi
- ✅ User bisa browse dataset via API
- ✅ Data terfilter dengan benar (legal/ilegal)
- ✅ Response format konsisten
- ✅ Ready untuk Phase 2 (Search & Analytics)
