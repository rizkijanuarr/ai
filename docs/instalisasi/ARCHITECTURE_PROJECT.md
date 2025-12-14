# 🏗️ ARSITEKTUR PROJECT

## 📋 Overview

Project ini adalah **Sistem Klasifikasi Website Legal/Ilegal** menggunakan **AI (IndoBERT)** dan **Keyword Analysis** dengan arsitektur **Clean Architecture** berbasis **Flask**.

---

## 🎯 Tujuan Project

Mengklasifikasikan website Indonesia sebagai:

- ✅ **Legal** - Website resmi, e-commerce, pemerintah, dll
- ❌ **Ilegal** - Website judi, scam, phishing, dll

---

## 🏛️ Arsitektur Layered

```
┌─────────────────────────────────────────┐
│          PRESENTATION LAYER             │
│  (Controller - HTTP Request/Response)   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          APPLICATION LAYER              │
│     (Service - Business Logic)          │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         INFRASTRUCTURE LAYER            │
│  (Repository - Data Access & AI Model)  │
└─────────────────────────────────────────┘
```

---

## 📁 Struktur Direktori

```
ai/
├── app.py                          # Entry point aplikasi
├── requirements.txt                # Python dependencies
├── running_command.sh              # Script untuk run server
│
├── backend/
│   ├── controller/                 # Layer 1: HTTP Handlers
│   │   ├── advices/                # Decorators & Exception Handlers
│   │   │   ├── BaseController.py
│   │   │   └── BaseControllerImpl.py
│   │   └── v1/                     # API Version 1
│   │       ├── TugasAkhirControllerV1.py (Abstract)
│   │       └── impl/
│   │           └── TugasAkhirControllerImplV1.py
│   │
│   ├── service/                    # Layer 2: Business Logic
│   │   └── v1/
│   │       ├── TugasAkhirServiceV1.py (Abstract)
│   │       └── impl/
│   │           └── TugasAkhirServiceImplV1.py
│   │
│   ├── repositories/               # Layer 3: Data & AI Logic
│   │   └── v1/
│   │       └── TugasAkhirRepositoriesV1.py
│   │
│   ├── request/                    # Input DTOs
│   │   └── v1/
│   │       └── ScrapeRequestV1.py
│   │
│   ├── response/                   # Output DTOs
│   │   ├── advices/
│   │   │   ├── BaseResponse.py
│   │   │   ├── DataResponseParameter.py
│   │   │   └── ErrorResponse.py
│   │   └── v1/
│   │       └── ScrapeResponseV1.py
│   │
│   ├── annotations/                # Configuration & Decorators
│   │   ├── config/
│   │   │   ├── AppConfig.py
│   │   │   ├── PortConfig.py
│   │   │   ├── SwaggerConfig.py
│   │   │   └── RegisteredController.py
│   │   └── method/
│   │       └── PostEndpoint.py
│   │
│   └── utils/                      # Helper Functions
│       ├── ColoredLogger.py        # Logging dengan warna
│       ├── Exceptions.py           # Custom exceptions
│       └── ResponseHelper.py       # Response builders
│
├── output/                         # Data persistence
│   └── data/
│       ├── raw_data.jsonl          # Log hasil analisa
│       └── transfer-learning/
│           ├── keyword_legal.jsonl
│           └── keyword_ilegal.jsonl
│
├── docs/                           # Dokumentasi
│   ├── instalisasi/
│   │   ├── ARCHITECTURE_PROJECT.md
│   │   └── INSTALISASI_PACKAGE.md
│   └── logic/
│       ├── FLOW_NON_TEKNIS.md
│       └── FLOW_TEKNIS.md
│
└── frontend/                       # UI (minimal)
    ├── components/
    └── templates/
```

---

## 🔄 Flow Arsitektur

### **Request Flow:**

```
HTTP Request
    ↓
Controller (TugasAkhirControllerImplV1)
    ├─ Validate Request DTO
    ├─ Handle Exceptions
    └─ Format Response
        ↓
Service (TugasAkhirServiceImplV1)
    ├─ Business Logic
    └─ Call Repository
        ↓
Repository (TugasAkhirRepositoriesV1)
    ├─ Web Scraping
    ├─ AI Prediction (IndoBERT)
    ├─ Keyword Analysis
    ├─ Cache Management
    └─ Transfer Learning
        ↓
Response
```

---

## 🎨 Design Patterns

### **1. Layered Architecture**

- **Separation of Concerns** - Setiap layer punya tanggung jawab jelas
- **Dependency Injection** - Service di-inject ke Controller
- **Abstract Classes** - Interface untuk setiap layer

### **2. DTO Pattern**

- **Request DTO** - Validasi input
- **Response DTO** - Format output konsisten
- **Immutable** - Data tidak berubah setelah dibuat

### **3. Repository Pattern**

- **Data Access Abstraction** - Business logic tidak tahu detail storage
- **Caching** - Built-in cache mechanism
- **Transfer Learning** - Auto-learning dari hasil analisa

### **4. Singleton Pattern**

- **AI Model** - IndoBERT di-load sekali saja
- **Tokenizer** - Shared instance

### **5. Exception Handling**

- **Custom Exceptions** - `ScrapingFailedException`
- **Centralized Handler** - Di controller layer
- **Proper HTTP Status** - 200, 422, 400, 500

---

## 🔧 Teknologi Stack

### **Backend:**

- **Framework**: Flask 2.x
- **AI Model**: IndoBERT (indobenchmark/indobert-base-p2)
- **ML Library**: PyTorch, Transformers (Hugging Face)
- **Web Scraping**: BeautifulSoup4, Requests
- **API Documentation**: Flasgger (Swagger)

### **Data Storage:**

- **Format**: JSONL (JSON Lines)
- **Cache**: File-based (raw_data.jsonl)
- **Transfer Learning**: File-based (keyword_*.jsonl)

### **Logging:**

- **Library**: colorlog
- **Levels**: DEBUG, INFO, WARNING, ERROR

---

## 🚀 Keunggulan Arsitektur

✅ **Scalable** - Easy to add new features  
✅ **Maintainable** - Clear separation of concerns  
✅ **Testable** - Each layer can be tested independently  
✅ **Versioned** - API versioning (v1, v2, ...)  
✅ **Documented** - Auto-generated Swagger docs  
✅ **Production-Ready** - Error handling, logging, caching  

---

## 📊 Component Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Flask Application                     │
│  ┌────────────────────────────────────────────────────┐ │
│  │              Controller Layer (v1)                 │ │
│  │  - TugasAkhirControllerImplV1                     │ │
│  │  - Exception Handling                             │ │
│  │  - Response Formatting                            │ │
│  └──────────────────┬─────────────────────────────────┘ │
│                     │                                    │
│  ┌──────────────────▼─────────────────────────────────┐ │
│  │              Service Layer (v1)                    │ │
│  │  - TugasAkhirServiceImplV1                        │ │
│  │  - Business Logic                                 │ │
│  └──────────────────┬─────────────────────────────────┘ │
│                     │                                    │
│  ┌──────────────────▼─────────────────────────────────┐ │
│  │           Repository Layer (v1)                    │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │  Web Scraping (BeautifulSoup)               │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │  AI Prediction (IndoBERT)                    │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │  Keyword Analysis                            │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │  Cache System (JSONL)                        │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────┐ │ │
│  │  │  Transfer Learning                           │ │ │
│  │  └──────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Considerations

- ✅ **Input Validation** - URL validation di Request DTO
- ✅ **SSL Verification** - Disabled untuk scraping (dengan warning suppression)
- ✅ **Timeout Protection** - Request timeout 10 detik
- ✅ **Error Handling** - Proper exception handling

---

## 📈 Future Improvements

1. **Database Integration** - JSONL untuk data persistance learning
2. **Async Processing** - Celery untuk batch analysis
3. **Rate Limiting** - Prevent abuse
4. **Authentication** - API key atau JWT
5. **Frontend Dashboard** - Visualisasi hasil
6. **Model Fine-tuning** - Train dengan dataset Indonesia
7. **Monitoring** - Prometheus + Grafana
8. **Docker** - Containerization
9. **CI/CD** - Automated testing & deployment

---

## 📡 API Usage

### **Request**

```bash
POST http://localhost:5002/api/v1/scrape
Content-Type: application/json

{
    "url": "https://giftline.my.id/"
}
```

### **Response (Success - Legal)**

```json
{
    "success": true,
    "message": null,
    "data": {
        "url": "https://giftline.my.id/",
        "label": "Legal",
        "probability": 0.85,
        "snippet": "giftline aplikasi penjualan online produk...",
        "message": "Analysis Successful",
        "ip": "103.xxx.xxx.xxx",
        "location": "Jakarta, Indonesia"
    },
    "errors": null
}
```

### **Response (Scraping Failed - Ilegal)**

```json
{
    "success": false,
    "message": "Scraping Failed - Cannot analyze content",
    "data": null,
    "errors": [{
        "code": "SCRAPING_FAILED",
        "title": "Content Scraping Failed",
        "message": "Content tidak dapat di-scrape (kemungkinan anti-bot...)",
        "url": "https://www.wd33x4.com/"
    }]
}
```

**Last Updated**: 2025-12-14  
**Version**: 1.0.0  
**Author**: Tugas Akhir Team
