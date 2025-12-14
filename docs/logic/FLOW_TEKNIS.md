# ⚙️ FLOW TEKNIS

## 📖 Overview

Dokumen ini menjelaskan alur kerja sistem klasifikasi website **dari sudut pandang teknis** dengan detail implementasi, algoritma, dan code flow.

---

## 🔄 Complete Request Flow

```python
HTTP POST /api/v1/scrape
    ↓
TugasAkhirControllerImplV1.getScrapeUrl()
    ├─ Validate ScrapeRequestV1
    ├─ try-except ScrapingFailedException
    └─ ResponseHelper.create_response_data()
        ↓
TugasAkhirServiceImplV1.getScrapeUrl()
    ├─ Call repository.analyzeUrl()
    └─ Transform to ScrapeResponseV1
        ↓
TugasAkhirRepositoriesV1.analyzeUrl()
    ├─ 1. scrapeMeta(url)
    ├─ 2. cleanText(content)
    ├─ 3. getPredictModel(url, text)
    ├─ 4. getNetworkInfo(url)
    ├─ 5. saveLogToFile(result)
    └─ 6. autoUpdateKeywords(result)
        ↓
HTTP 200 OK / 422 Unprocessable Entity
```

---

## 🎯 Detailed Function Flow

### **1. analyzeUrl(url: str) → dict**

**Entry point utama untuk analisa URL.**

```python
def analyzeUrl(self, url: str) -> dict:
    # 1. Scrape website
    scrapeContent = self.scrapeMeta(url)
    
    # 2. Clean text
    cleanedTextContent = self.cleanText(scrapeContent)
    
    # 2.5. Check scraping failure
    if not cleanedTextContent or len(cleanedTextContent.strip()) < 10:
        return self.handleScrapingFailure(url, scrapeContent)
    
    # 3. AI Prediction + Keyword Validation
    prediction = self.getPredictModel(url, cleanedTextContent)
    
    # 4. Get network info (IP & Location)
    net_info = self.getNetworkInfo(url)
    
    # 5. Build result
    result = {
        "url": url,
        "raw_content": scrapeContent,
        "cleaned_content": prediction["cleaned_content"],
        "label": prediction["label"],
        "probability": prediction["probability"],
        "ip": net_info["ip"],
        "location": net_info["location"]
    }
    
    # 6. Save to cache
    self.saveLogToFile(result)
    
    # 7. Transfer learning
    self.autoUpdateKeywords(result)
    
    return result
```

---

### **2. scrapeMeta(url: str) → str**

**Scraping Title dan Meta Description dari website.**

```python
def scrapeMeta(self, url: str, timeout: int = 10) -> str:
    # Suppress SSL warnings
    requests.packages.urllib3.disable_warnings()
    
    try:
        # HTTP GET request
        resp = requests.get(
            url, 
            headers=self._DEFAULT_HEADERS, 
            timeout=timeout, 
            verify=False  # Bypass SSL verification
        )
        resp.raise_for_status()
    except requests.RequestException as exc:
        # Log error dan return empty string
        logger.warning(f"[SCRAPING ERROR] Failed to fetch {url}: {exc}")
        return ""
    
    # Parse HTML
    soup = BeautifulSoup(resp.text, "lxml")
    content_parts: List[str] = []
    
    # 1. Extract Title
    if soup.title and soup.title.string:
        content_parts.append(soup.title.string.strip())
    
    # 2. Extract Meta Description
    for tag in soup.find_all("meta"):
        name = tag.get("name") or tag.get("property")
        if name and any(key in name.lower() for key in 
            ["description", "og:description", "twitter:description"]):
            content = tag.get("content", "").strip()
            if content:
                content_parts.append(content)
    
    return " ".join(content_parts)
```

**Headers yang Digunakan:**

```python
_DEFAULT_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ...",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,...",
    "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
}
```

---

### **3. cleanText(text: str) → str**

**Text preprocessing dengan regex.**

```python
def cleanText(self, text: str) -> str:
    # Remove URLs
    text = self._URL_PATTERN.sub("", text)
    # Pattern: r"https?://\S+"
    
    # Remove HTML tags
    text = self._HTML_TAG_PATTERN.sub("", text)
    # Pattern: r"<[^>]+>"
    
    # Lowercase
    text = text.lower()
    
    # Remove multiple spaces
    text = self._MULTI_SPACE_PATTERN.sub(" ", text)
    # Pattern: r"\s+"
    
    # Trim
    text = text.strip()
    
    return text
```

---

### **4. getPredictModel(url: str, text: str) → dict**

**Fungsi utama untuk prediksi menggunakan AI + Keyword.**

```python
def getPredictModel(self, url: str, text: str) -> dict:
    # ============================================================
    # STEP 0: CHECK CACHE
    # ============================================================
    cached_result = self.getDataFromRawJsonl(url)
    if cached_result is not None:
        logger.info(f"[CACHE] Menggunakan hasil cache untuk: {url}")
        return {
            "label": cached_result["label"],
            "probability": cached_result["probability"],
            "cleaned_content": cached_result["cleaned_content"],
            "keyword_stats": {...}
        }
    
    logger.info(f"[ANALYSIS] Cache tidak ditemukan, mulai analisa baru")
    
    # ============================================================
    # STEP 1: AI PREDICTION (IndoBERT)
    # ============================================================
    logger.info("[AI] Memulai prediksi menggunakan IndoBERT...")
    tokenizer, model = self.getModelInstanceIndoBert()
    
    # Tokenize text
    encoded = tokenizer(
        text, 
        max_length=512,  # BERT max length
        truncation=True, 
        padding=True, 
        return_tensors="pt"
    )
    
    # Predict
    with torch.no_grad():
        logits = model(**encoded).logits
        probs = torch.softmax(logits, dim=1).squeeze()
    
    # Extract probability for "Legal" class
    if probs.dim() == 0:
        prob_legal_model = float(probs)
    else:
        prob_legal_model = float(probs[1])  # Index 1 = Legal
    
    # Initial decision from AI
    label = "Legal" if prob_legal_model >= 0.5 else "Ilegal"
    final_prob = prob_legal_model
    
    logger.info(f"[AI RESULT] Model memprediksi: {label} ({final_prob:.2f})")
    
    # ============================================================
    # STEP 2: KEYWORD VALIDATION
    # ============================================================
    logger.debug("[KEYWORD] Memvalidasi dengan keyword analysis...")
    text_lower = text.lower()
    
    # Find keyword matches
    legal_matches = [w for w in self._LEGAL_KEYWORDS if w in text_lower]
    ilegal_matches = [w for w in self._ILEGAL_KEYWORDS if w in text_lower]
    
    n_legal = len(legal_matches)
    n_ilegal = len(ilegal_matches)
    
    logger.debug(f"[KEYWORD] Ditemukan → Legal: {n_legal}, Ilegal: {n_ilegal}")
    
    # ============================================================
    # STEP 3: HYBRID DECISION
    # ============================================================
    # Override A: Ilegal keyword dominan
    if n_ilegal > n_legal:
        if label == "Legal":
            logger.warning(f"[OVERRIDE] Keyword ilegal dominan → Ilegal")
            label = "Ilegal"
            final_prob = 0.4
    
    # Override B: Legal keyword dominan
    if label == "Ilegal" and n_legal >= 3 and n_ilegal == 0:
        logger.warning(f"[CORRECTION] Keyword legal dominan → Legal")
        label = "Legal"
        final_prob = 0.85
    
    logger.info(f"[FINAL DECISION] {label} dengan probabilitas {final_prob:.2f}")
    
    # ============================================================
    # STEP 4: RETURN RESULT
    # ============================================================
    return {
        "label": label,
        "probability": final_prob,
        "cleaned_content": text,
        "keyword_stats": {
            "legal": n_legal,
            "ilegal": n_ilegal,
            "matches": {
                "legal": legal_matches[:5],
                "ilegal": ilegal_matches[:5]
            }
        }
    }
```

---

### **5. getModelInstanceIndoBert() → (Tokenizer, Model)**

**Singleton pattern untuk load IndoBERT model.**

```python
@classmethod
def getModelInstanceIndoBert(cls):
    if cls._tokenizer is None or cls._model is None:
        logger.info("Loading IndoBERT model (first time)...")
        
        # Suppress warnings
        import warnings
        from transformers import logging as transformers_logging
        
        warnings.filterwarnings('ignore', category=UserWarning)
        transformers_logging.set_verbosity_error()
        
        # Load tokenizer dan model
        cls._tokenizer = BertTokenizer.from_pretrained(
            "indobenchmark/indobert-base-p2",
            clean_up_tokenization_spaces=True
        )
        cls._model = AutoModelForSequenceClassification.from_pretrained(
            "indobenchmark/indobert-base-p2", 
            num_labels=2  # Binary classification
        )
        cls._model.eval()  # Set to evaluation mode
        
        # Restore warnings
        warnings.filterwarnings('default', category=UserWarning)
        transformers_logging.set_verbosity_warning()
        
        logger.info("IndoBERT model loaded successfully!")
    
    return cls._tokenizer, cls._model
```

**Model Details:**

- **Name**: indobenchmark/indobert-base-p2
- **Type**: BERT (Bidirectional Encoder Representations from Transformers)
- **Language**: Indonesian
- **Size**: ~500 MB
- **Parameters**: ~110M
- **Max Sequence Length**: 512 tokens

---

### **6. getDataFromRawJsonl(url: str) → Optional[dict]**

**Check cache dari file JSONL.**

```python
def getDataFromRawJsonl(self, url: str) -> Optional[dict]:
    try:
        file_path = os.path.join(os.getcwd(), "output", "data", "raw_data.jsonl")
        
        if not os.path.exists(file_path):
            return None
        
        # Read file line by line
        with open(file_path, 'r', encoding='utf-8') as f:
            for line in f:
                if line.strip():
                    try:
                        record = json.loads(line)
                        data_obj = record.get('data', {})
                        
                        # Check URL match
                        if data_obj.get('url') == url:
                            logger.info(f"Cache HIT for URL: {url}")
                            return {
                                "url": data_obj.get("url"),
                                "raw_content": "Cached Result",
                                "cleaned_content": data_obj.get("snippet", ""),
                                "label": data_obj.get("label"),
                                "probability": data_obj.get("probability"),
                                "ip": data_obj.get("ip", "Unknown"),
                                "location": data_obj.get("location", "Unknown")
                            }
                    except json.JSONDecodeError:
                        continue
        
        logger.debug(f"Cache MISS for URL: {url}")
        return None
        
    except Exception as e:
        logger.error(f"Failed to read cache: {e}")
        return None
```

**Cache File Format (JSONL):**

```json
{"success": true, "data": {"url": "...", "label": "Legal", "probability": 0.85, ...}}
{"success": true, "data": {"url": "...", "label": "Ilegal", "probability": 0.35, ...}}
```

---

### **7. getNetworkInfo(url: str) → Dict[str, str]**

**Get IP address dan location dari URL.**

```python
def getNetworkInfo(self, url: str) -> Dict[str, str]:
    info = {"ip": "Unknown", "location": "Unknown"}
    
    try:
        # Parse URL
        parsed = urlparse(url)
        hostname = parsed.netloc
        
        if not hostname:
            return info
        
        # Resolve IP
        ip_address = socket.gethostbyname(hostname)
        info["ip"] = ip_address
        
        # Get location from IP-API
        try:
            geo_resp = requests.get(
                f"http://ip-api.com/json/{ip_address}", 
                timeout=3
            )
            if geo_resp.status_code == 200:
                geo_data = geo_resp.json()
                if geo_data.get("status") == "success":
                    city = geo_data.get("city", "")
                    country = geo_data.get("country", "")
                    info["location"] = f"{city}, {country}".strip(", ")
        except Exception:
            pass  # Location is optional
        
    except Exception as e:
        logger.warning(f"Network info failed for {url}: {e}")
    
    return info
```

**API Used**: <http://ip-api.com/json/{ip}>

---

### **8. saveLogToFile(data: dict)**

**Save hasil analisa ke raw_data.jsonl.**

```python
def saveLogToFile(self, data: dict):
    try:
        output_dir = os.path.join(os.getcwd(), "output", "data")
        os.makedirs(output_dir, exist_ok=True)
        file_path = os.path.join(output_dir, "raw_data.jsonl")
        
        url_to_check = data['url']
        
        # Check duplicate
        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip():
                        try:
                            record = json.loads(line)
                            if record.get('data', {}).get('url') == url_to_check:
                                logger.debug(f"URL already logged, skipping")
                                return
                        except json.JSONDecodeError:
                            continue
        
        # Prepare record in API response format
        record = {
            "success": True,
            "message": None,
            "data": {
                "url": data['url'],
                "label": data['label'],
                "probability": data['probability'],
                "snippet": data['cleaned_content'],
                "message": "Analysis Successful",
                "ip": data['ip'],
                "location": data['location']
            },
            "errors": None
        }
        
        # Append to file
        with open(file_path, "a", encoding="utf-8") as f:
            f.write(json.dumps(record) + "\n")
        
        logger.info(f"Logged new URL: {url_to_check}")
        
    except Exception as e:
        logger.error(f"Failed to save log: {e}")
```

---

### **9. autoUpdateKeywords(data: dict)**

**Transfer learning: Extract keywords dari hasil analisa.**

```python
def autoUpdateKeywords(self, data: dict):
    label = data["label"]
    text = data["cleaned_content"]
    
    # Determine target keyword list
    target_keyword_list = None
    keyword_filename = None
    
    if "Ilegal" in label:
        target_keyword_list = self._ILEGAL_KEYWORDS
        keyword_filename = "keyword_ilegal.jsonl"
    elif "Legal" in label:
        target_keyword_list = self._LEGAL_KEYWORDS
        keyword_filename = "keyword_legal.jsonl"
    
    if target_keyword_list is not None and text:
        new_words = []
        words = text.split()
        
        for word in words:
            # Filter: ignore short words or numbers
            if len(word) < 3 or word.isdigit():
                continue
            
            # Add new keyword
            if word not in target_keyword_list:
                target_keyword_list.add(word)
                new_words.append(word)
        
        if new_words:
            self.appendKeywordsToFile(keyword_filename, new_words)
            logger.info(f"Transfer Learning: Added {len(new_words)} keywords")
```

---

### **10. handleScrapingFailure(url: str, scrapeContent: str)**

**Handle scraping failure → Raise exception untuk HTTP 422.**

```python
def handleScrapingFailure(self, url: str, scrapeContent: str):
    logger.warning(f"[SCRAPING FAILED] Content kosong/terlalu pendek")
    logger.warning("[AUTO CLASSIFY] Scraping gagal → Raise exception (HTTP 422)")
    
    # Raise exception
    raise ScrapingFailedException(
        url=url,
        message="Content tidak dapat di-scrape (kemungkinan anti-bot, JavaScript rendering, atau blocking)"
    )
```

**Exception Handling di Controller:**

```python
try:
    return ResponseHelper.create_response_data(
        self.service.getScrapeUrl(validation_request)
    )
except ScrapingFailedException as e:
    return jsonify({
        "success": False,
        "message": "Scraping Failed - Cannot analyze content",
        "data": None,
        "errors": [{
            "code": "SCRAPING_FAILED",
            "title": "Content Scraping Failed",
            "message": e.message,
            "url": e.url
        }]
    }), 422
```

---

## 🔐 Security & Performance

### **Random Seed (Reproducibility)**

```python
def set_seed(seed=42):
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

set_seed(42)  # Fixed seed untuk hasil konsisten
```

### **SSL Verification**

```python
# Disabled untuk scraping (dengan warning suppression)
requests.packages.urllib3.disable_warnings()
resp = requests.get(url, verify=False)
```

### **Timeout Protection**

```python
# Scraping timeout: 10 detik
resp = requests.get(url, timeout=10)

# Geo API timeout: 3 detik
geo_resp = requests.get(geo_url, timeout=3)
```

---

## 📊 Algorithm Complexity

| Function | Time Complexity | Space Complexity |
|----------|----------------|------------------|
| scrapeMeta | O(n) | O(n) |
| cleanText | O(n) | O(n) |
| getPredictModel | O(n²) | O(n) |
| getDataFromRawJsonl | O(m) | O(1) |
| saveLogToFile | O(m) | O(1) |
| autoUpdateKeywords | O(n) | O(n) |

**Where:**

- n = length of text
- m = number of cached URLs

---

## 🎯 Optimization Techniques

1. **Model Singleton** - Load IndoBERT sekali saja
2. **Cache System** - Avoid redundant analysis
3. **Early Return** - Stop jika scraping gagal
4. **Lazy Loading** - Model di-load saat pertama kali digunakan
5. **Batch Processing** - (Future) Process multiple URLs
6. **Async I/O** - (Future) Non-blocking file operations

---

**Last Updated**: 2025-12-14  
**Version**: 1.0.0  
**Author**: Tugas Akhir Team
