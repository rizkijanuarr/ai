# 📋 URUTAN - TugasAkhirRepositoriesV1

## Urutan Berdasarkan Proses Bisnis

### **SECTION 1: MAIN ENTRY POINT**

```python
def analyzeUrl(self, url: str) -> dict:
    """
    Entry point utama untuk analisa URL.
    Flow: Scrape → Clean → Predict → Network Info → Save → Learn
    """
```

---

### **SECTION 2: SCRAPING & PREPROCESSING**

```python
def scrapeMeta(self, url: str, timeout: int = 10) -> str:
    """
    Scrape Title dan Meta Description dari website.
    Return empty string jika gagal (403, timeout, dll)
    """

def cleanText(self, text: str) -> str:
    """
    Preprocessing: Remove URL, HTML tags, lowercase, trim whitespace
    """

def handleScrapingFailure(self, url: str, scrapeContent: str):
    """
    Handle scraping failure → Raise ScrapingFailedException (HTTP 422)
    """
```

---

### **SECTION 3: AI PREDICTION & ANALYSIS**

```python
def getPredictModel(self, url: str, text: str) -> dict:
    """
    Fungsi utama prediksi:
    1. Check cache
    2. AI prediction (IndoBERT)
    3. Keyword validation
    4. Hybrid decision
    """

def getDataFromRawJsonl(self, url: str) -> Optional[dict]:
    """
    Check cache: Apakah URL sudah pernah dianalisa?
    """

def getModelInstanceIndoBert(cls):
    """
    Singleton: Load IndoBERT model (sekali saja)
    """
```

---

### **SECTION 4: NETWORK INFORMATION**

```python
def getNetworkInfo(self, url: str) -> Dict[str, str]:
    """
    Get IP address dan location dari URL
    """
```

---

### **SECTION 5: DATA PERSISTENCE**

```python
def saveLogToFile(self, data: dict):
    """
    Save hasil analisa ke raw_data.jsonl (dengan anti-duplicate)
    """
```

---

### **SECTION 6: TRANSFER LEARNING**

```python
def autoUpdateKeywords(self, data: dict):
    """
    Auto-learning: Extract keywords dari hasil analisa
    """

def appendKeywordsToFile(self, filename: str, words: List[str]):
    """
    Helper: Append keywords ke file (dengan anti-duplicate)
    """

def loadDataFromJsonl(self, file_path: str) -> set:
    """
    Helper: Load keywords/domains dari file JSONL
    """
```

---

## 🎯 URUTAN LENGKAP (Top to Bottom)

1. `__init__()` - Constructor
2. **MAIN ENTRY**
   - `analyzeUrl()`
3. **SCRAPING**
   - `scrapeMeta()`
   - `cleanText()`
   - `handleScrapingFailure()`
4. **PREDICTION**
   - `getPredictModel()`
   - `getDataFromRawJsonl()`
   - `getModelInstanceIndoBert()`
5. **NETWORK**
   - `getNetworkInfo()`
6. **PERSISTENCE**
   - `saveLogToFile()`
7. **LEARNING**
   - `autoUpdateKeywords()`
   - `appendKeywordsToFile()`
   - `loadDataFromJsonl()`

---
