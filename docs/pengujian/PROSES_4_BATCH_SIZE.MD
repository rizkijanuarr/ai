# ENDPOINT: PROSES 4 - BATCH SIZE

---

## 📌 OVERVIEW

Endpoint ini mengimplementasikan **Proses 4** dari dokumentasi PENGUJIAN_DATA.md yaitu **Batch Size Analysis**.

**Fungsi Utama:**
- Menghitung jumlah iterasi per epoch untuk berbagai batch size
- Menganalisis trade-off antara kecepatan, memori, dan kualitas konvergensi
- Memberikan rekomendasi batch size optimal untuk dataset
- Menjelaskan karakteristik setiap batch size (memory efficiency, speed, convergence quality)

**Batch Sizes yang Dianalisis:**
- Default: [8, 16, 32, 64, 128, 256]
- Customizable: User dapat specify batch sizes sesuai kebutuhan

---

## 🔗 ENDPOINT

**Method:** `POST`
**Path:** `/api/v1/batch-size`
**Tag:** `Evaluation Metrics`
**Description:** Calculate Batch Size analysis for training optimization

---

## 📥 REQUEST

### Request Body

```json
{
    "is_legal": 0,
    "batch_sizes": [16, 32, 64, 128]
}
```

**Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `is_legal` | Integer | No | `null` | Filter data berdasarkan kategori:<br>• `0` = ILLEGAL only<br>• `1` = LEGAL only<br>• `null` = All data (ILLEGAL + LEGAL) |
| `batch_sizes` | Array[Integer] | No | `[8, 16, 32, 64, 128, 256]` | List of batch sizes to analyze:<br>• Min: 1<br>• Max: 10000<br>• Maximum 10 values<br>• Duplicates removed automatically |

### Validasi

**is_legal:**
- Harus bernilai `0` atau `1` (jika diisi)
- Jika nilai selain 0 atau 1, return error 400

**batch_sizes:**
- Harus berupa array of integers
- Minimal 1 value, maksimal 10 values
- Setiap batch size harus >= 1 dan <= 10000
- Batch size > total dataset akan di-skip otomatis
- Duplicates akan dihapus dan di-sort otomatis

---

## 📤 RESPONSE

### 200 - Success

```json
{
    "success": true,
    "message": null,
    "data": {
        "is_legal": 0,
        "keterangan_legal": "Filtered by ILLEGAL",
        "total_samples": 1142,
        "batch_size_results": [
            {
                "batch_size": 16,
                "iterations_per_epoch": 72,
                "last_batch_size": 6,
                "memory_efficiency": "very_high",
                "speed_category": "slow",
                "convergence_quality": "excellent"
            },
            {
                "batch_size": 32,
                "iterations_per_epoch": 36,
                "last_batch_size": 22,
                "memory_efficiency": "high",
                "speed_category": "moderate",
                "convergence_quality": "excellent"
            }
        ],
        "comparison": {
            "smallest_batch": { ... },
            "largest_batch": { ... },
            "recommended_batch": { ... }
        },
        "penjelasan": {
            "batch_size_concept": "...",
            "iterations_calculation": "...",
            "trade_offs": "...",
            "recommendation": "..."
        }
    },
    "errors": null
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `is_legal` | Integer/null | Filter yang digunakan |
| `keterangan_legal` | String | Deskripsi filter |
| `total_samples` | Integer | Total jumlah sampel dataset |
| `batch_size_results` | Array | Hasil analisis untuk setiap batch size |
| `comparison` | Object | Perbandingan smallest, largest, dan recommended batch |
| `penjelasan` | Object | Penjelasan lengkap dalam Bahasa Indonesia |

**Batch Size Result Fields:**

| Field | Type | Values | Description |
|-------|------|--------|-------------|
| `batch_size` | Integer | - | Ukuran batch |
| `iterations_per_epoch` | Integer | - | Jumlah iterasi per epoch |
| `last_batch_size` | Integer | - | Ukuran batch terakhir (sisa) |
| `memory_efficiency` | String | `very_high`, `high`, `medium`, `low`, `very_low` | Efisiensi penggunaan memori |
| `speed_category` | String | `slow`, `moderate`, `fast`, `very_fast` | Kategori kecepatan training |
| `convergence_quality` | String | `excellent`, `good`, `fair`, `poor` | Kualitas konvergensi model |

### 400 - Bad Request

```json
{
    "success": false,
    "message": "Invalid request parameters",
    "data": null,
    "errors": [{
        "code": "INVALID_PARAMETERS",
        "title": "Invalid Parameters",
        "message": "is_legal must be 0 (ILLEGAL) or 1 (LEGAL)"
    }]
}
```

### 404 - File Not Found

```json
{
    "success": false,
    "message": "Dataset file not found",
    "data": null,
    "errors": [{
        "code": "FILE_NOT_FOUND",
        "title": "Dataset File Not Found",
        "message": "Dataset file not found: ..."
    }]
}
```

### 500 - Internal Server Error

```json
{
    "success": false,
    "message": "Batch size calculation failed",
    "data": null,
    "errors": [{
        "code": "BATCH_SIZE_ERROR",
        "title": "Batch Size Error",
        "message": "..."
    }]
}
```

---

## 🔄 DATA FLOW

```
[Client Request]
      ↓
[TugasAkhirControllerImplV1.getBatchSize()]
      ↓
[Parse & Validate BatchSizeRequestV1]
      ↓
[TugasAkhirServiceImplV1.getBatchSize()]
      ↓
[Load ALL_DATA_COMBINED_MERGED.csv]
      ↓
[Filter by is_legal (if specified)]
      ↓
[For each batch_size in batch_sizes:]
  ├─ Calculate iterations_per_epoch = ⌈total_samples / batch_size⌉
  ├─ Calculate last_batch_size = total_samples % batch_size
  ├─ Categorize memory_efficiency (based on batch_size)
  ├─ Categorize speed_category (based on batch_size)
  └─ Categorize convergence_quality (based on batch_size)
      ↓
[Generate comparison (smallest, largest, recommended)]
      ↓
[Generate penjelasan (Indonesian explanations)]
      ↓
[Return Response with batch_size_results, comparison, penjelasan]
      ↓
[Controller returns JSON response]
```

---

## 🧮 RUMUS INTI

### 1. Jumlah Iterasi per Epoch

Jika:
- Jumlah data = $N$
- Batch size = $B$

Maka jumlah iterasi per epoch:

$$\text{Iterasi} = \left\lceil \frac{N}{B} \right\rceil$$

**Contoh:**
- Dataset ILLEGAL: $N = 1142$, $B = 32$
- Iterasi = $\lceil 1142 \div 32 \rceil = \lceil 35.6875 \rceil = 36$ iterasi

### 2. Last Batch Size (Sisa)

$$\text{Last Batch Size} = N \bmod B$$

Jika hasil = 0, maka last batch size = $B$ (batch penuh)

**Contoh:**
- $1142 \bmod 32 = 22$ (batch terakhir berisi 22 sampel)

### 3. Kategori Karakteristik

**Memory Efficiency:**
- Batch ≤ 16: `very_high`
- Batch ≤ 32: `high`
- Batch ≤ 64: `medium`
- Batch ≤ 128: `low`
- Batch > 128: `very_low`

**Speed Category:**
- Batch ≤ 16: `slow`
- Batch ≤ 32: `moderate`
- Batch ≤ 64: `fast`
- Batch > 64: `very_fast`

**Convergence Quality:**
- Batch ≤ 32: `excellent`
- Batch ≤ 64: `good`
- Batch ≤ 128: `fair`
- Batch > 128: `poor`

---

## 📁 FILE-FILE TERKAIT

### REQUEST
**File:** `backend/request/v1/BatchSizeRequestV1.py`
**Class:** `BatchSizeRequestV1`

**Attributes:**
- `is_legal`: Optional[int] - Filter kategori
- `batch_sizes`: Optional[List[int]] - List batch sizes to test

### RESPONSE
**File:** `backend/response/v1/BatchSizeResponseV1.py`
**Class:** `BatchSizeResponseV1`

**Attributes:**
- `is_legal`: Optional[int]
- `keterangan_legal`: str
- `total_samples`: int
- `batch_size_results`: List[Dict]
- `comparison`: Dict
- `penjelasan`: Dict

### SERVICE

#### SERVICE INTERFACE
**File:** `backend/service/v1/TugasAkhirServiceV1.py`
**Method:** `getBatchSize(request: BatchSizeRequestV1) -> dict`

#### SERVICE IMPLEMENTATION
**File:** `backend/service/v1/impl/TugasAkhirServiceImplV1.py`
**Method:** `getBatchSize(request: BatchSizeRequestV1) -> dict`

**Logic:**
1. Load data dari CSV
2. Filter by is_legal (if specified)
3. For each batch size:
   - Calculate iterations & last batch
   - Categorize characteristics
4. Generate comparison
5. Generate Indonesian explanations
6. Return complete response

### CONTROLLER

#### CONTROLLER INTERFACE
**File:** `backend/controller/v1/TugasAkhirControllerV1.py`
**Method:** `getBatchSize(validation_request: BatchSizeRequestV1) -> DataResponseParameter[dict]`

**Endpoint:** `POST /api/v1/batch-size`

#### CONTROLLER IMPLEMENTATION
**File:** `backend/controller/v1/impl/TugasAkhirControllerImplV1.py`
**Method:** `getBatchSize(validation_request: BatchSizeRequestV1) -> Response`

**Error Handling:**
- FileNotFoundError → 404
- ValueError → 400
- Exception → 500

---

## 📊 PENGUJIAN

### Test Case 1: ILLEGAL dengan Default Batch Sizes

**Request:**
```json
{
    "is_legal": 0,
    "batch_sizes": [16, 32, 64, 128]
}
```

**Expected Result:**
- Total samples: 1142 (semua illegal)
- Batch sizes analyzed: [16, 32, 64, 128]
- Recommended batch: 32
- Penjelasan lengkap dalam bahasa Indonesia

**Actual Result:**

```json
{
  "is_legal": 0,
  "keterangan_legal": "Filtered by ILLEGAL",
  "total_samples": 1142,
  "batch_size_results": [
    {
      "batch_size": 16,
      "iterations_per_epoch": 72,
      "last_batch_size": 6,
      "memory_efficiency": "very_high",
      "speed_category": "slow",
      "convergence_quality": "excellent"
    },
    {
      "batch_size": 32,
      "iterations_per_epoch": 36,
      "last_batch_size": 22,
      "memory_efficiency": "high",
      "speed_category": "moderate",
      "convergence_quality": "excellent"
    },
    {
      "batch_size": 64,
      "iterations_per_epoch": 18,
      "last_batch_size": 54,
      "memory_efficiency": "medium",
      "speed_category": "fast",
      "convergence_quality": "good"
    },
    {
      "batch_size": 128,
      "iterations_per_epoch": 9,
      "last_batch_size": 118,
      "memory_efficiency": "low",
      "speed_category": "very_fast",
      "convergence_quality": "fair"
    }
  ],
  "comparison": {
    "smallest_batch": {
      "batch_size": 16,
      "iterations_per_epoch": 72,
      "last_batch_size": 6,
      "memory_efficiency": "very_high",
      "speed_category": "slow",
      "convergence_quality": "excellent"
    },
    "largest_batch": {
      "batch_size": 128,
      "iterations_per_epoch": 9,
      "last_batch_size": 118,
      "memory_efficiency": "low",
      "speed_category": "very_fast",
      "convergence_quality": "fair"
    },
    "recommended_batch": {
      "batch_size": 32,
      "iterations_per_epoch": 36,
      "last_batch_size": 22,
      "memory_efficiency": "high",
      "speed_category": "moderate",
      "convergence_quality": "excellent"
    }
  },
  "penjelasan": {
    "batch_size_concept": "Batch size adalah jumlah sampel yang diproses sekaligus dalam satu iterasi training. Dataset dengan 1142 sampel akan dibagi menjadi beberapa batch untuk diproses secara bertahap.",
    "iterations_calculation": "Jumlah iterasi per epoch dihitung dengan rumus: Iterasi = ⌈Total Sampel ÷ Batch Size⌉. Contoh: dengan batch size 32, diperlukan 36 iterasi per epoch.",
    "trade_offs": "Trade-off batch size: (1) Batch kecil (16): konvergensi lebih baik tapi lambat (72 iterasi). (2) Batch besar (128): lebih cepat (9 iterasi) tapi konvergensi kurang stabil. (3) Batch sedang (32): balance optimal antara kecepatan dan kualitas konvergensi.",
    "recommendation": "Untuk dataset dengan 1142 sampel, direkomendasikan menggunakan batch size 32 yang memberikan 36 iterasi per epoch dengan kualitas konvergensi excellent dan efisiensi memori high."
  }
}
```

**Analisis Hasil ILLEGAL:**

1. **Dataset Size:**
   - Total: 1142 website illegal (judi/slot/gacor)
   - Batch sizes tested: [16, 32, 64, 128]

2. **Batch Size 16 (Smallest):**
   - **Iterasi:** 72 iterasi per epoch
   - **Last Batch:** 6 sampel (1142 ÷ 16 = 71 batch penuh + 1 batch sisa 6)
   - **Memory Efficiency:** Very High (batch kecil = memori rendah)
   - **Speed:** Slow (banyak iterasi = lambat)
   - **Convergence:** Excellent (update gradient sering = konvergensi baik)

   **Perhitungan:**
   - Iterasi = ⌈1142 ÷ 16⌉ = ⌈71.375⌉ = 72
   - Last batch = 1142 mod 16 = 6

3. **Batch Size 32 (RECOMMENDED):**
   - **Iterasi:** 36 iterasi per epoch
   - **Last Batch:** 22 sampel (1142 ÷ 32 = 35 batch penuh + 1 batch sisa 22)
   - **Memory Efficiency:** High
   - **Speed:** Moderate (balance antara cepat dan lambat)
   - **Convergence:** Excellent

   **Perhitungan:**
   - Iterasi = ⌈1142 ÷ 32⌉ = ⌈35.6875⌉ = 36
   - Last batch = 1142 mod 32 = 22

   **Kenapa Recommended?**
   - ✅ Balance optimal antara speed dan convergence
   - ✅ Memory efficiency masih tinggi
   - ✅ Convergence quality excellent
   - ✅ Tidak terlalu lambat (36 iterasi vs 72)
   - ✅ Tidak terlalu cepat yang bisa mengorbankan konvergensi

4. **Batch Size 64:**
   - **Iterasi:** 18 iterasi per epoch (setengah dari batch 32)
   - **Last Batch:** 54 sampel
   - **Memory Efficiency:** Medium (mulai butuh memori lebih)
   - **Speed:** Fast (iterasi lebih sedikit)
   - **Convergence:** Good (masih bagus tapi mulai menurun)

   **Perhitungan:**
   - Iterasi = ⌈1142 ÷ 64⌉ = ⌈17.84⌉ = 18
   - Last batch = 1142 mod 64 = 54

5. **Batch Size 128 (Largest):**
   - **Iterasi:** 9 iterasi per epoch (paling sedikit)
   - **Last Batch:** 118 sampel (hampir 1 batch penuh)
   - **Memory Efficiency:** Low (butuh banyak memori)
   - **Speed:** Very Fast (iterasi sangat sedikit)
   - **Convergence:** Fair (konvergensi mulai kurang stabil)

   **Perhitungan:**
   - Iterasi = ⌈1142 ÷ 128⌉ = ⌈8.92⌉ = 9
   - Last batch = 1142 mod 128 = 118

**Trade-offs ILLEGAL:**
- **Batch 16:** Excellent convergence tapi slow (72 iterasi)
- **Batch 32:** Balance optimal ✅ (36 iterasi, excellent convergence)
- **Batch 64:** Fast tapi convergence turun ke good (18 iterasi)
- **Batch 128:** Very fast tapi convergence hanya fair (9 iterasi)

**Kesimpulan ILLEGAL:**
✅ Batch size 32 adalah pilihan terbaik untuk dataset ILLEGAL
✅ Memberikan balance optimal antara kecepatan dan kualitas
✅ 36 iterasi per epoch adalah sweet spot

---

### Test Case 2: LEGAL dengan Default Batch Sizes

**Request:**
```json
{
    "is_legal": 1,
    "batch_sizes": [16, 32, 64, 128]
}
```

**Expected Result:**
- Total samples: 2463 (semua legal)
- Batch sizes analyzed: [16, 32, 64, 128]
- Recommended batch: 32
- Iterasi lebih banyak karena dataset lebih besar

**Actual Result:**

```json
{
  "is_legal": 1,
  "keterangan_legal": "Filtered by LEGAL",
  "total_samples": 2463,
  "batch_size_results": [
    {
      "batch_size": 16,
      "iterations_per_epoch": 154,
      "last_batch_size": 15,
      "memory_efficiency": "very_high",
      "speed_category": "slow",
      "convergence_quality": "excellent"
    },
    {
      "batch_size": 32,
      "iterations_per_epoch": 77,
      "last_batch_size": 31,
      "memory_efficiency": "high",
      "speed_category": "moderate",
      "convergence_quality": "excellent"
    },
    {
      "batch_size": 64,
      "iterations_per_epoch": 39,
      "last_batch_size": 31,
      "memory_efficiency": "medium",
      "speed_category": "fast",
      "convergence_quality": "good"
    },
    {
      "batch_size": 128,
      "iterations_per_epoch": 20,
      "last_batch_size": 31,
      "memory_efficiency": "low",
      "speed_category": "very_fast",
      "convergence_quality": "fair"
    }
  ],
  "comparison": {
    "smallest_batch": {
      "batch_size": 16,
      "iterations_per_epoch": 154,
      "last_batch_size": 15,
      "memory_efficiency": "very_high",
      "speed_category": "slow",
      "convergence_quality": "excellent"
    },
    "largest_batch": {
      "batch_size": 128,
      "iterations_per_epoch": 20,
      "last_batch_size": 31,
      "memory_efficiency": "low",
      "speed_category": "very_fast",
      "convergence_quality": "fair"
    },
    "recommended_batch": {
      "batch_size": 32,
      "iterations_per_epoch": 77,
      "last_batch_size": 31,
      "memory_efficiency": "high",
      "speed_category": "moderate",
      "convergence_quality": "excellent"
    }
  },
  "penjelasan": {
    "batch_size_concept": "Batch size adalah jumlah sampel yang diproses sekaligus dalam satu iterasi training. Dataset dengan 2463 sampel akan dibagi menjadi beberapa batch untuk diproses secara bertahap.",
    "iterations_calculation": "Jumlah iterasi per epoch dihitung dengan rumus: Iterasi = ⌈Total Sampel ÷ Batch Size⌉. Contoh: dengan batch size 32, diperlukan 77 iterasi per epoch.",
    "trade_offs": "Trade-off batch size: (1) Batch kecil (16): konvergensi lebih baik tapi lambat (154 iterasi). (2) Batch besar (128): lebih cepat (20 iterasi) tapi konvergensi kurang stabil. (3) Batch sedang (32): balance optimal antara kecepatan dan kualitas konvergensi.",
    "recommendation": "Untuk dataset dengan 2463 sampel, direkomendasikan menggunakan batch size 32 yang memberikan 77 iterasi per epoch dengan kualitas konvergensi excellent dan efisiensi memori high."
  }
}
```

**Analisis Hasil LEGAL:**

1. **Dataset Size:**
   - Total: 2463 website legal (pendidikan, pemerintah, resmi)
   - Dataset 2x lebih besar dari ILLEGAL (2463 vs 1142)
   - Batch sizes tested: [16, 32, 64, 128]

2. **Batch Size 16 (Smallest):**
   - **Iterasi:** 154 iterasi per epoch (2x lebih banyak dari ILLEGAL)
   - **Last Batch:** 15 sampel (hampir penuh)
   - **Memory Efficiency:** Very High
   - **Speed:** Slow (154 iterasi sangat banyak)
   - **Convergence:** Excellent

   **Perhitungan:**
   - Iterasi = ⌈2463 ÷ 16⌉ = ⌈153.9375⌉ = 154
   - Last batch = 2463 mod 16 = 15

3. **Batch Size 32 (RECOMMENDED):**
   - **Iterasi:** 77 iterasi per epoch (2x lebih banyak dari ILLEGAL)
   - **Last Batch:** 31 sampel (hampir penuh)
   - **Memory Efficiency:** High
   - **Speed:** Moderate
   - **Convergence:** Excellent

   **Perhitungan:**
   - Iterasi = ⌈2463 ÷ 32⌉ = ⌈76.96875⌉ = 77
   - Last batch = 2463 mod 32 = 31

   **Kenapa Recommended?**
   - ✅ Konsisten dengan rekomendasi ILLEGAL
   - ✅ Balance optimal untuk dataset besar
   - ✅ 77 iterasi masih manageable
   - ✅ Convergence quality tetap excellent

4. **Batch Size 64:**
   - **Iterasi:** 39 iterasi per epoch
   - **Last Batch:** 31 sampel
   - **Memory Efficiency:** Medium
   - **Speed:** Fast
   - **Convergence:** Good

   **Perhitungan:**
   - Iterasi = ⌈2463 ÷ 64⌉ = ⌈38.48⌉ = 39
   - Last batch = 2463 mod 64 = 31

5. **Batch Size 128 (Largest):**
   - **Iterasi:** 20 iterasi per epoch
   - **Last Batch:** 31 sampel
   - **Memory Efficiency:** Low
   - **Speed:** Very Fast
   - **Convergence:** Fair

   **Perhitungan:**
   - Iterasi = ⌈2463 ÷ 128⌉ = ⌈19.24⌉ = 20
   - Last batch = 2463 mod 128 = 31

**Perbandingan LEGAL vs ILLEGAL:**

| Metric | ILLEGAL (1142) | LEGAL (2463) | Ratio |
|--------|----------------|--------------|-------|
| **Batch 16 - Iterasi** | 72 | 154 | 2.14x |
| **Batch 32 - Iterasi** | 36 | 77 | 2.14x |
| **Batch 64 - Iterasi** | 18 | 39 | 2.17x |
| **Batch 128 - Iterasi** | 9 | 20 | 2.22x |

**Observasi:**
- ✅ Iterasi LEGAL ~2x lebih banyak (sesuai dengan ukuran dataset)
- ✅ Rekomendasi batch size sama: **32** untuk kedua dataset
- ✅ Karakteristik (memory, speed, convergence) konsisten
- ✅ Last batch size LEGAL lebih besar (lebih efisien)

**Kesimpulan LEGAL:**
✅ Batch size 32 tetap optimal meskipun dataset 2x lebih besar
✅ 77 iterasi per epoch adalah jumlah yang reasonable
✅ Karakteristik batch size konsisten dengan ILLEGAL

---

## 📊 PERBANDINGAN ILLEGAL vs LEGAL

| Batch Size | ILLEGAL Iterasi | LEGAL Iterasi | Difference |
|------------|-----------------|---------------|------------|
| 16 | 72 | 154 | +82 (2.14x) |
| 32 | 36 | 77 | +41 (2.14x) |
| 64 | 18 | 39 | +21 (2.17x) |
| 128 | 9 | 20 | +11 (2.22x) |

**Key Insights:**

1. **Iterasi Proporsional dengan Dataset Size:**
   - LEGAL dataset 2.16x lebih besar (2463 vs 1142)
   - Iterasi juga ~2.14-2.22x lebih banyak
   - Proporsional dan konsisten ✅

2. **Rekomendasi Konsisten:**
   - Batch size 32 optimal untuk KEDUA dataset
   - Tidak terpengaruh ukuran dataset
   - Balance yang sama antara speed, memory, dan convergence

3. **Last Batch Efficiency:**
   - ILLEGAL: Last batch lebih bervariasi (6, 22, 54, 118)
   - LEGAL: Last batch lebih konsisten (~15, 31, 31, 31)
   - LEGAL lebih efisien (less waste)

4. **Trade-off Tetap Sama:**
   - Batch kecil: Excellent convergence, slow speed
   - Batch sedang: Balance optimal ✅
   - Batch besar: Fast speed, fair convergence

---

## 🔍 PENJELASAN DETAIL ANGKA-ANGKA

### **1. Kenapa Iterasi = ⌈Total ÷ Batch⌉?**

**Ceiling function (⌈⌉)** digunakan karena kita perlu **round up**:
- Jika 1142 ÷ 32 = 35.6875
- Kita tidak bisa punya 0.6875 iterasi
- Maka kita butuh 36 iterasi (35 batch penuh + 1 batch sisa)

**Contoh:**
- Batch 32: ⌈1142 ÷ 32⌉ = ⌈35.6875⌉ = **36 iterasi**
- Batch 64: ⌈1142 ÷ 64⌉ = ⌈17.84⌉ = **18 iterasi**

### **2. Kenapa Last Batch Size Penting?**

**Last batch** adalah batch terakhir yang mungkin tidak penuh:
- Jika 1142 ÷ 32 = 35 batch penuh + sisa 22 sampel
- Last batch hanya berisi 22 sampel (bukan 32)

**Rumus:** `Last Batch = Total mod Batch Size`

**Implikasi:**
- Last batch kecil (< 50% batch size) = kurang efisien
- Last batch besar (> 50% batch size) = lebih efisien
- Jika mod = 0, last batch = batch size (perfect!)

**Contoh ILLEGAL:**
- Batch 16: 1142 mod 16 = **6** (hanya 37.5% dari batch size) ❌
- Batch 32: 1142 mod 32 = **22** (68.75% dari batch size) ✅
- Batch 64: 1142 mod 64 = **54** (84.4% dari batch size) ✅✅

### **3. Kenapa Memory Efficiency Berbeda?**

**Memory usage** proporsional dengan batch size:
- Batch kecil = memori rendah (bisa jalan di hardware terbatas)
- Batch besar = memori tinggi (butuh GPU/RAM besar)

**Kategori:**
- ≤ 16: Very High (minimal memory, bisa di CPU)
- ≤ 32: High (moderate memory, GPU kecil OK)
- ≤ 64: Medium (butuh GPU decent)
- ≤ 128: Low (butuh GPU besar)
- \> 128: Very Low (butuh GPU high-end)

### **4. Kenapa Speed Category Berbeda?**

**Speed** berbanding terbalik dengan jumlah iterasi:
- Banyak iterasi = lambat (banyak forward-backward pass)
- Sedikit iterasi = cepat (sedikit forward-backward pass)

**Contoh ILLEGAL:**
- Batch 16: 72 iterasi = **Slow**
- Batch 32: 36 iterasi = **Moderate**
- Batch 64: 18 iterasi = **Fast**
- Batch 128: 9 iterasi = **Very Fast**

**Tapi:** Speed bukan satu-satunya faktor! Convergence juga penting!

### **5. Kenapa Convergence Quality Berbeda?**

**Convergence** = seberapa baik model belajar:
- Batch kecil: Update gradient sering = konvergensi smooth & stabil
- Batch besar: Update gradient jarang = konvergensi kasar & unstable

**Analogi:**
- Batch kecil = belajar sedikit-sedikit tapi sering (lebih paham)
- Batch besar = belajar banyak sekaligus tapi jarang (kurang paham)

**Kategori:**
- ≤ 32: Excellent (update sering, konvergensi smooth)
- ≤ 64: Good (masih OK, mulai kurang smooth)
- ≤ 128: Fair (mulai unstable)
- \> 128: Poor (sangat unstable, sulit converge)

### **6. Kenapa Batch 32 Recommended?**

**Batch 32 adalah sweet spot** karena:

1. **Convergence Excellent:**
   - Update gradient cukup sering (36-77 kali per epoch)
   - Model belajar dengan baik

2. **Speed Moderate:**
   - Tidak terlalu lambat seperti batch 16
   - Tidak terlalu cepat yang mengorbankan kualitas

3. **Memory High:**
   - Efisien untuk sebagian besar hardware
   - Bisa jalan di GPU consumer-grade

4. **Balance Optimal:**
   - Trade-off terbaik antara ketiga faktor
   - Proven best practice di industri

**Perbandingan:**
- Batch 16: Excellent convergence tapi **terlalu lambat** ❌
- Batch 32: Excellent convergence + moderate speed ✅✅✅
- Batch 64: Good convergence tapi **mulai unstable** ⚠️
- Batch 128: Fair convergence, **terlalu unstable** ❌

---

## 🎯 KESIMPULAN PENGUJIAN

### **Hasil Utama:**

1. **Batch Size 32 adalah Optimal:**
   - ✅ Recommended untuk ILLEGAL (1142 sampel)
   - ✅ Recommended untuk LEGAL (2463 sampel)
   - ✅ Balance terbaik: speed, memory, convergence

2. **Iterasi Proporsional dengan Dataset:**
   - ✅ ILLEGAL: 36 iterasi (batch 32)
   - ✅ LEGAL: 77 iterasi (batch 32)
   - ✅ Ratio ~2.14x sesuai dengan ukuran dataset

3. **Trade-offs Jelas:**
   - ✅ Batch kecil: Excellent convergence, slow speed
   - ✅ Batch sedang: Balance optimal
   - ✅ Batch besar: Fast speed, poor convergence

4. **Konsistensi Karakteristik:**
   - ✅ Memory efficiency konsisten untuk semua dataset
   - ✅ Speed category konsisten untuk semua dataset
   - ✅ Convergence quality konsisten untuk semua dataset

### **Rekomendasi:**

**Untuk Production:**
- Gunakan **batch size 32** sebagai default
- Untuk dataset kecil (< 1000): bisa coba batch 16
- Untuk dataset besar (> 5000): tetap batch 32
- Untuk hardware terbatas: batch 16 atau 8
- Untuk GPU high-end: bisa coba batch 64

**Untuk Penelitian:**
- Test berbagai batch sizes untuk comparison
- Monitor convergence curve untuk setiap batch
- Perhatikan trade-off antara speed dan quality
- Document hasil untuk reproducibility

**Status:** Endpoint **PRODUCTION READY** ✅🚀

---

**Dokumentasi dibuat:** 2026-01-02
**Dokumentasi diupdate:** 2026-01-02
**Proses:** 4 dari 5 (Batch Size) ✅
**Testing:** PASSED dengan hasil konsisten 🎉
