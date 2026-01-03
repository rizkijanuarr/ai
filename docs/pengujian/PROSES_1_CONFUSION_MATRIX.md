# ENDPOINT: PROSES 1 - CONFUSION MATRIX

---

## 📌 OVERVIEW

Endpoint ini mengimplementasikan **Proses 1** dari dokumentasi PENGUJIAN_DATA.md yaitu **Confusion Matrix** beserta metrik evaluasi (Accuracy, Precision, Recall, F1-Score) untuk klasifikasi website ilegal vs legal.

**Fungsi Utama:**
- Menghitung Confusion Matrix (TP, TN, FP, FN)
- Menghitung metrik evaluasi model
- Mendukung filtering berdasarkan kategori (legal/illegal)

---

## 🔗 ENDPOINT

**Method:** `POST`
**Path:** `/api/v1/confusion-matrix`
**Tag:** `Evaluation Metrics`
**Description:** Get Confusion Matrix and Evaluation Metrics

---

## 📥 REQUEST

### Request Body

```json
{
    "is_legal": 0
}
```

**Parameter:**
- `is_legal` (Optional, Integer): Filter data berdasarkan kategori
  - `0` = Illegal only
  - `1` = Legal only
  - `null` atau tidak diisi = Semua data

### Validasi

- `is_legal` harus bernilai `0` atau `1` (jika diisi)
- Jika nilai selain 0 atau 1, akan return error 400

---

## 📤 RESPONSE

### 200 - Success

```json
{
  "success": true,
  "message": null,
  "data": {
    "total_samples": 1142,
    "legal_count": 0,
    "illegal_count": 1142,
    "true_positive": 1133,
    "true_negative": 0,
    "false_positive": 0,
    "false_negative": 9,
    "accuracy": 0.992,
    "precision": 1.0,
    "recall": 0.992,
    "f1_score": 0.996,
    "message": "Confusion matrix calculated for 1142 samples (filtered: illegal only)"
  },
  "errors": null
}
```

### 400 - Bad Request

```json
{
  "success": false,
  "message": "Invalid request parameters",
  "data": null,
  "errors": [{
    "code": "INVALID_PARAMETERS",
    "title": "Invalid Parameters",
    "message": "is_legal must be 0 or 1"
  }]
}
```

### 404 - Not Found

```json
{
  "success": false,
  "message": "Dataset file not found",
  "data": null,
  "errors": [{
    "code": "FILE_NOT_FOUND",
    "title": "Dataset File Not Found",
    "message": "The merged dataset CSV file could not be found"
  }]
}
```

### 500 - Internal Server Error

```json
{
  "success": false,
  "message": "Confusion Matrix calculation failed",
  "data": null,
  "errors": [{
    "code": "CONFUSION_MATRIX_ERROR",
    "title": "Confusion Matrix Error",
    "message": "Error details..."
  }]
}
```

---

## 🔄 DATA FLOW

```
┌──────────┐
│  CLIENT  │
└────┬─────┘
     │ POST /api/v1/confusion-matrix
     │ Body: { is_legal }
     ▼
┌─────────────────────────────────────────┐
│ TugasAkhirControllerImplV1              │
│ ├─ Validate request                     │
│ └─ Create ConfusionMatrixRequestV1      │
└────┬────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│ TugasAkhirServiceImplV1                 │
│ └─ getConfusionMatrix()                 │
└────┬────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│ Load Data from CSV                      │
│ ├─ Read ALL_DATA_COMBINED_MERGED.csv    │
│ └─ Filter by is_legal (if specified)    │
└────┬────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│ EvaluationServiceV1                     │
│ ├─ calculate_confusion_matrix()         │
│ │  • Loop through data                  │
│ │  • Predict each record                │
│ │  • Count TP, TN, FP, FN               │
│ │                                        │
│ └─ calculate_metrics()                  │
│    • Accuracy = (TP+TN)/(TP+TN+FP+FN)   │
│    • Precision = TP/(TP+FP)             │
│    • Recall = TP/(TP+FN)                │
│    • F1 = 2×(P×R)/(P+R)                 │
└────┬────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│ Transform to Response DTO               │
│ ConfusionMatrixResponseV1               │
└────┬────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│ Return JSON Response                    │
│ DataResponseParameter                   │
└─────────────────────────────────────────┘
```

---

## 🧮 RUMUS INTI

### Confusion Matrix Table

|                    | **Prediksi Ilegal (0)** | **Prediksi Legal (1)** |
|--------------------|-------------------------|------------------------|
| **Aktual Ilegal (0)** | **TP** ✅            | **FN** ❌              |
| **Aktual Legal (1)**  | **FP** ❌            | **TN** ✅              |

### Accuracy

```
Accuracy = (TP + TN) / (TP + TN + FP + FN)
```

**Keterangan:** Mengukur persentase prediksi yang benar dari total data.

### Precision

```
Precision = TP / (TP + FP)
```

**Keterangan:** Mengukur seberapa akurat prediksi "ilegal" (berapa banyak yang benar-benar ilegal).

### Recall

```
Recall = TP / (TP + FN)
```

**Keterangan:** Mengukur seberapa banyak data ilegal yang berhasil terdeteksi.

### F1-Score

```
F1-Score = 2 × (Precision × Recall) / (Precision + Recall)
```

**Keterangan:** Harmonic mean dari Precision dan Recall.

---

## 📁 FILE-FILE TERKAIT

### Request

**File:** `backend/request/v1/ConfusionMatrixRequestV1.py`

**Class:** `ConfusionMatrixRequestV1`
- Field: `is_legal` (Optional[int])
- Method: `__post_init__()` - Validasi is_legal

---

### Response

**File:** `backend/response/v1/ConfusionMatrixResponseV1.py`

**Class:** `ConfusionMatrixResponseV1`
- Fields: `total_samples`, `legal_count`, `illegal_count`
- Fields: `true_positive`, `true_negative`, `false_positive`, `false_negative`
- Fields: `accuracy`, `precision`, `recall`, `f1_score`
- Field: `message`

---

### Service

#### Service Interface

**File:** `backend/service/v1/TugasAkhirServiceV1.py`

**Method:** `getConfusionMatrix(request: ConfusionMatrixRequestV1) -> ConfusionMatrixResponseV1`

#### Service Implementation

**File:** `backend/service/v1/impl/TugasAkhirServiceImplV1.py`

**Method:** `getConfusionMatrix(request: ConfusionMatrixRequestV1) -> ConfusionMatrixResponseV1`
- Load data dari CSV
- Filter by is_legal (if specified)
- Calculate confusion matrix
- Calculate metrics
- Return ConfusionMatrixResponseV1

**Dependencies:**
- `EvaluationServiceV1.calculate_confusion_matrix()`
- `EvaluationServiceV1.calculate_metrics()`

---

### Controller

#### Controller Interface

**File:** `backend/controller/v1/TugasAkhirControllerV1.py`

**Endpoint:** `POST /confusion-matrix`
**Method:** `getConfusionMatrix(validation_request: ConfusionMatrixRequestV1) -> DataResponseParameter`

#### Controller Implementation

**File:** `backend/controller/v1/impl/TugasAkhirControllerImplV1.py`

**Method:** `getConfusionMatrix(validation_request: ConfusionMatrixRequestV1)`
- Call service.getConfusionMatrix()
- Handle FileNotFoundError (404)
- Handle ValueError (400)
- Handle Exception (500)
- Return ResponseHelper.create_response_data()

---

## 📊 PENGUJIAN


### Test: ILLEGAL (`is_legal = 0`)

**Request:**
```json
{
  "is_legal": 0
}
```

**Response:**
```json
{
    "success": true,
    "message": null,
    "data": {
        "is_legal": 0,
        "legal_count": 0,
        "illegal_count": 1142,
        "ts_count": 1142,
        "tp_count": 1133,
        "tn_count": 0,
        "fp_count": 0,
        "fn_count": 9,
        "accuracy_count": 0.992,
        "precision_count": 1,
        "recall_count": 0.992,
        "f1_score_count": 0.996,
        "keterangan_legal": "Filtered by ILLEGAL",
        "ts_penjelasan": "Total samples data (filtered: illegal only): 1142",
        "tp_penjelasan": "Model berhasil mendeteksi 1133 website illegal dengan benar",
        "tn_penjelasan": "Tidak ada data legal karena filter is_legal=0",
        "fp_penjelasan": "Tidak ada legal yang salah diprediksi illegal",
        "fn_penjelasan": "9 website illegal salah diprediksi sebagai legal (0.8% miss rate)",
        "accuracy_penjelasan": "Model sangat excellent dalam klasifikasi (1133/1142 benar)",
        "precision_penjelasan": "Sempurna! Semua prediksi illegal benar-benar illegal",
        "recall_penjelasan": "Sangat baik! 99.2% illegal berhasil terdeteksi",
        "f1_score_penjelasan": "Excellent! Balance sempurna antara precision & recall (99.6%)"
    },
    "errors": null
}
```

**Table:**

| Metric | Nilai | Interpretasi |
|--------|-------|--------------|
| **TP** | 1133 | Website illegal berhasil terdeteksi sebagai illegal |
| **TN** | 0 | Tidak ada data legal (karena filter) |
| **FP** | 0 | Tidak ada legal yang salah diprediksi illegal |
| **FN** | 9 | Website illegal salah diprediksi sebagai legal |
| **Accuracy** | 99.2% | Model sangat akurat (1133/1142 benar) |
| **Precision** | 100% | Semua prediksi illegal benar-benar illegal |
| **Recall** | 99.2% | Hampir semua illegal berhasil terdeteksi |
| **F1-Score** | 99.6% | Balance sempurna antara precision & recall |

**Penjelasan:**
- **TP (1133)**: Model berhasil mendeteksi 1133 website illegal dengan benar
- **TN (0)**: Tidak ada data legal karena filter `is_legal=0`
- **FP (0)**: Tidak ada false alarm, semua prediksi illegal akurat
- **FN (9)**: 9 website illegal terlewat (0.8% miss rate)
- **Accuracy (99.2%)**: Model sangat baik dalam mendeteksi illegal
- **Precision (100%)**: Tidak ada kesalahan prediksi illegal
- **Recall (99.2%)**: Hampir semua illegal terdeteksi
- **F1-Score (99.6%)**: Performa sangat seimbang dan excellent

---

### Test: LEGAL (`is_legal = 1`)

**Request:**
```json
{
  "is_legal": 1
}
```

**Response:**
```json
{
    "success": true,
    "message": null,
    "data": {
        "is_legal": 1,
        "legal_count": 2463,
        "illegal_count": 0,
        "ts_count": 2463,
        "tp_count": 0,
        "tn_count": 2437,
        "fp_count": 26,
        "fn_count": 0,
        "accuracy_count": 0.989,
        "precision_count": 0,
        "recall_count": 0,
        "f1_score_count": 0,
        "keterangan_legal": "Filtered by LEGAL",
        "ts_penjelasan": "Total samples data (filtered: legal only): 2463",
        "tp_penjelasan": "Tidak ada data illegal karena filter is_legal=1",
        "tn_penjelasan": "Model berhasil mendeteksi 2437 website legal dengan benar",
        "fp_penjelasan": "26 website legal salah diprediksi sebagai illegal (1.1% error)",
        "fn_penjelasan": "Tidak ada illegal yang terlewat",
        "accuracy_penjelasan": "Model sangat baik dalam klasifikasi (2437/2463 benar)",
        "precision_penjelasan": "N/A karena tidak ada data illegal untuk dideteksi",
        "recall_penjelasan": "N/A karena tidak ada data illegal untuk dideteksi",
        "f1_score_penjelasan": "N/A karena Precision dan Recall tidak dapat dihitung"
    },
    "errors": null
}
```

**Table:**

| Metric | Nilai | Interpretasi |
|--------|-------|--------------|
| **TP** | 0 | Tidak ada data illegal (karena filter) |
| **TN** | 2437 | Website legal berhasil terdeteksi sebagai legal |
| **FP** | 26 | Website legal salah diprediksi sebagai illegal |
| **FN** | 0 | Tidak ada illegal yang terlewat |
| **Accuracy** | 98.9% | Model sangat akurat (2437/2463 benar) |
| **Precision** | 0% | N/A (tidak ada TP untuk dihitung) |
| **Recall** | 0% | N/A (tidak ada TP untuk dihitung) |
| **F1-Score** | 0% | N/A (tidak bisa dihitung karena TP=0) |

**Penjelasan:**
- **TP (0)**: Tidak ada data illegal karena filter `is_legal=1`
- **TN (2437)**: Model berhasil mendeteksi 2437 website legal dengan benar
- **FP (26)**: 26 website legal salah diprediksi sebagai illegal (1.1% error)
- **FN (0)**: Tidak ada illegal yang terlewat
- **Accuracy (98.9%)**: Model sangat baik dalam mendeteksi legal
- **Precision (0%)**: N/A karena tidak ada data illegal untuk dideteksi
- **Recall (0%)**: N/A karena tidak ada data illegal untuk dideteksi
- **F1-Score (0%)**: N/A karena Precision dan Recall tidak dapat dihitung

**Catatan:** Precision, Recall, F1 = 0 adalah **NORMAL** untuk filter legal-only karena tidak ada TP (True Positive).

---

## 🎯 KESIMPULAN

**Model Performance:**
- ✅ **Deteksi Illegal**: Accuracy 99.2%, Precision 100%, Recall 99.2%, F1 99.6%
- ✅ **Deteksi Legal**: Accuracy 98.9%, 26 false positive (1.1%)
- ✅ **Overall**: Model sangat baik dengan accuracy >98% untuk kedua kelas

**Status:** Endpoint **SIAP PRODUCTION** 🚀

---

**Dokumentasi dibuat:** 2025-12-30
**Dokumentasi diupdate:** 2025-12-31
**Proses:** 1 dari 5 (Confusion Matrix) ✅
