import re
import requests
import torch
import socket
from urllib.parse import urlparse
from typing import List, Dict, Optional
from bs4 import BeautifulSoup
from transformers import BertTokenizer, AutoModelForSequenceClassification
import os
from datetime import datetime
import json
from backend.utils.ColoredLogger import setup_colored_logger
from backend.utils.Exceptions import ScrapingFailedException

# Setup colored logger
logger = setup_colored_logger(__name__)

# Set random seed untuk konsistensi hasil prediksi
import random
import numpy as np

def set_seed(seed=42):
    """Set random seed untuk reproducibility"""
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)
    # Untuk deterministic behavior di CUDA
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False

# Set seed saat module di-load
set_seed(42)
logger.info("Random seed set to 42 for reproducibility")

class TugasAkhirRepositoriesV1:


    #-----------------------------------------------------------
    # VARIABLES
    #-----------------------------------------------------------
    _DEFAULT_HEADERS = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Cache-Control": "max-age=0",
    }

    _CALL_MODEL_INDOBERT = "indobenchmark/indobert-base-p2"
    _tokenizer = None
    _model = None

    _URL_PATTERN = re.compile(r"https?://\S+")
    _HTML_TAG_PATTERN = re.compile(r"<[^>]+>")
    _MULTI_SPACE_PATTERN = re.compile(r"\s+")

    #-----------------------------------------------------------
    # CONSTRUCTOR
    #-----------------------------------------------------------
    def __init__(self):
        self._base_path = os.path.join(os.getcwd(), "output", "data", "transfer-learning")

        self._LEGAL_KEYWORDS = self.loadDataFromJsonl(os.path.join(self._base_path, "keyword_legal.jsonl"))
        self._ILEGAL_KEYWORDS = self.loadDataFromJsonl(os.path.join(self._base_path, "keyword_ilegal.jsonl"))

        # Fallback if files are empty or missing (keep basic functionality)
        if not self._LEGAL_KEYWORDS:
            self._LEGAL_KEYWORDS = {"resmi", "pemerintah", "hukum"}
        if not self._ILEGAL_KEYWORDS:
            self._ILEGAL_KEYWORDS = {"judi", "slot", "gacor"}


    #-----------------------------------------------------------
    # MAIN ENTRY
    #-----------------------------------------------------------
    def analyzeUrl(self, url: str) -> dict:
        # 1. Scrape
        scrapeContent = self.scrapeMeta(url)

        # 2. Preprocess
        cleanedTextContent = self.cleanText(scrapeContent)

        # 2.5. Check if scraping failed or content is empty/too short
        if not cleanedTextContent or len(cleanedTextContent.strip()) < 10:
            return self.handleScrapingFailure(url, scrapeContent)

        # 3. Predict (with cache check inside)
        prediction = self.getPredictModel(url, cleanedTextContent)

        cleanedContent = prediction.get(
            "cleaned_content",
            cleanedTextContent,
        )

        # 4. Network Info (IP & Location)
        net_info = self.getNetworkInfo(url)

        result = {
            "url": url,
            "raw_content": scrapeContent or "Scraping Blocked/Empty",
            "cleaned_content": cleanedContent,
            "label": prediction["label"],
            "probability": prediction["probability"],
            "ip": net_info["ip"],
            "location": net_info["location"]
        }

        # 5. Save Log
        self.saveLogToFile(result)

        # 6. Auto Transfer Learning (Feedback Loop)
        self.autoUpdateKeywords(result)

        return result

    #-----------------------------------------------------------
    # SCRAPE SERPER
    #-----------------------------------------------------------
    def scrapeSerper(self, query: str, location: str = "Indonesia", gl: str = "id", hl: str = "id", total_pages: int = 1) -> dict:
        """
        Crawl data menggunakan Serper API (Google Search)
        Dokumentasi: https://serper.dev/

        Args:
            query: Keyword pencarian
            location: Lokasi pencarian (default: Indonesia)
            gl: Country code (default: id)
            hl: Language code (default: id)
            total_pages: Total halaman yang akan di-crawl (default: 1)
                        1 page = 10 hasil, jadi total_pages=10 = 100 hasil

        Returns:
            dict: Hasil crawling dengan list organic results dari semua pages
        """
        import http.client

        logger.info(f"[SERPER] Memulai crawling untuk keyword: {query} ({total_pages} pages)")

        # API Configuration
        API_KEY = "70b6e0bfbc9079ef7860c4c088a777135e1bc68a"
        API_HOST = "google.serper.dev"
        API_PATH = "/search"

        all_organic_results = []

        try:
            # Loop through all pages
            for current_page in range(1, total_pages + 1):
                logger.info(f"[SERPER] Crawling page {current_page}/{total_pages}...")

                # 1. Prepare Request
                conn = http.client.HTTPSConnection(API_HOST)
                payload = json.dumps({
                    "q": query,
                    "location": location,
                    "gl": gl,
                    "hl": hl,
                    "page": current_page  # Current page number
                })
                headers = {
                    'X-API-KEY': API_KEY,
                    'Content-Type': 'application/json'
                }

                # 2. Send Request
                logger.debug(f"[SERPER] Sending request to {API_HOST}{API_PATH} (page {current_page})")
                conn.request("POST", API_PATH, payload, headers)
                res = conn.getresponse()
                data = res.read()

                # 3. Parse Response
                response_data = json.loads(data.decode("utf-8"))
                logger.info(f"[SERPER] Page {current_page} response received, status: {res.status}")

                # 4. Extract Organic Results
                organic_results = response_data.get("organic", [])
                logger.info(f"[SERPER] Page {current_page} found {len(organic_results)} results")

                # Add to combined results
                all_organic_results.extend(organic_results)

                # Close connection
                conn.close()

                # Small delay to avoid rate limiting (optional)
                if current_page < total_pages:
                    import time
                    time.sleep(0.2)  # 200ms delay between requests

            total_results = len(all_organic_results)
            logger.info(f"[SERPER] Total crawled: {total_results} results from {total_pages} pages")

            # 5. Prepare CSV Data
            csv_data = []
            for item in all_organic_results:
                csv_data.append({
                    "title": item.get("title", ""),
                    "link": item.get("link", ""),
                    "snippet": item.get("snippet", ""),
                    "position": item.get("position", 0),
                    "rating": item.get("rating"),
                    "ratingCount": item.get("ratingCount")
                })

            # 6. Save to CSV
            csv_path = self.saveToCsv(query, csv_data)

            logger.info(f"[SERPER] Data saved to: {csv_path}")

            return {
                "query": query,
                "total_results": total_results,
                "total_pages": total_pages,
                "organic": csv_data,
                "csv_path": csv_path,
                "raw_response": None  # Don't store all raw responses (too large)
            }

        except Exception as e:
            logger.error(f"[SERPER ERROR] Failed to crawl: {e}")
            raise Exception(f"Serper API Error: {str(e)}")

    def saveToCsv(self, keyword: str, data: List[dict]) -> str:
        """
        Save crawling results to CSV file

        Args:
            keyword: Keyword yang dicari (untuk nama file)
            data: List of dict hasil crawling

        Returns:
            str: Path file CSV yang disimpan
        """
        import csv

        # Create directory if not exists
        output_dir = os.path.join(os.getcwd(), "output", "data", "crawl_serper")
        os.makedirs(output_dir, exist_ok=True)

        # Generate filename (sanitize keyword)
        safe_keyword = re.sub(r'[^\w\s-]', '', keyword).strip().replace(' ', '_')
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{safe_keyword}_{timestamp}.csv"
        csv_path = os.path.join(output_dir, filename)

        # Write to CSV
        if data:
            fieldnames = ["title", "link", "snippet", "position", "rating", "ratingCount"]
            with open(csv_path, 'w', newline='', encoding='utf-8') as csvfile:
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                for row in data:
                    writer.writerow(row)

            logger.info(f"[CSV] Saved {len(data)} rows to {csv_path}")
        else:
            logger.warning(f"[CSV] No data to save for keyword: {keyword}")

        return csv_path



    #-----------------------------------------------------------
    # SCRAPPE META
    #-----------------------------------------------------------
    def scrapeMeta(self, url: str, timeout: int = 10) -> str:
        # Suppress SSL warnings for this request
        requests.packages.urllib3.disable_warnings()
        try:
            # Added verify=False to bypass SSL verification errors
            resp = requests.get(url, headers=self._DEFAULT_HEADERS, timeout=timeout, verify=False)
            resp.raise_for_status()
        except requests.RequestException as exc:
            # Log error tapi return empty string (akan di-handle sebagai scraping failure)
            logger.warning(f"[SCRAPING ERROR] Failed to fetch {url}: {exc}")
            return ""  # Return empty string instead of raising error

        soup = BeautifulSoup(resp.text, "lxml")
        content_parts: List[str] = []

        # 1. Get Title
        if soup.title and soup.title.string:
            content_parts.append(soup.title.string.strip())

        # 2. Get Meta Description tags
        for tag in soup.find_all("meta"):
            name = tag.get("name") or tag.get("property")
            if name and any(key in name.lower() for key in ["description", "og:description", "twitter:description"]):
                content = tag.get("content", "").strip()
                if content:
                    content_parts.append(content)

        return " ".join(content_parts)

    def cleanText(self, text: str) -> str:
        text = self._URL_PATTERN.sub("", text)
        text = self._HTML_TAG_PATTERN.sub("", text)
        text = text.lower()
        text = self._MULTI_SPACE_PATTERN.sub(" ", text)
        text = text.strip()
        return text

    def handleScrapingFailure(self, url: str, scrapeContent: str):
        """
        Handle kasus ketika scraping gagal atau content kosong.
        Website legal biasanya mudah di-scrape, website ilegal sering block scraping.

        Raises:
            ScrapingFailedException: Exception yang akan menghasilkan HTTP 422
        """
        logger.warning(f"[SCRAPING FAILED] Content kosong/terlalu pendek")
        logger.warning("[AUTO CLASSIFY] Scraping gagal → Raise exception (HTTP 422)")

        # Raise exception untuk menghasilkan HTTP 422
        raise ScrapingFailedException(
            url=url,
            message="Content tidak dapat di-scrape (kemungkinan anti-bot, JavaScript rendering, atau blocking)"
        )




    #-----------------------------------------------------------
    # PREDICTION
    #-----------------------------------------------------------
    def getPredictModel(self, url: str, text: str) -> dict:
        """
        Fungsi utama untuk memprediksi apakah website Legal atau Ilegal.

        Alur kerja:
        1. Cek cache terlebih dahulu (jika URL sudah pernah dianalisa)
        2. Jika cache tidak ada, lakukan analisa:
           - Hitung keyword legal vs ilegal
           - Prediksi menggunakan AI IndoBERT
           - Gabungkan hasil keyword + AI (Hybrid Decision)
        3. Return hasil prediksi
        """

        # ============================================================
        # STEP 0: CEK CACHE
        # ============================================================
        # Cek apakah URL ini sudah pernah dianalisa sebelumnya
        # Jika sudah ada di cache (raw_data.jsonl), langsung return hasilnya
        # Ini menghemat waktu karena tidak perlu scraping & AI lagi
        cached_result = self.getDataFromRawJsonl(url)
        if cached_result is not None:
            logger.info(f"[CACHE] Menggunakan hasil cache untuk: {url}")
            # Kembalikan dalam format prediction (extract dari cache)
            return {
                "label": cached_result["label"],
                "probability": cached_result["probability"],
                "cleaned_content": cached_result["cleaned_content"],
                "keyword_stats": {"legal": 0, "ilegal": 0, "matches": {"legal": [], "ilegal": []}}
            }


        logger.info(f"[ANALYSIS] Cache tidak ditemukan, mulai analisa baru untuk: {url}")

        # ============================================================
        # STEP 1: PREDIKSI MENGGUNAKAN AI MODEL (IndoBERT)
        # ============================================================
        # Load model IndoBERT (Indonesian BERT) untuk deep learning prediction
        logger.info("[AI] Memulai prediksi menggunakan IndoBERT...")
        tokenizer, model = self.getModelInstanceIndoBert()

        # Tokenisasi: Ubah teks menjadi angka yang bisa dibaca model
        # max_length=512: Maksimal 512 tokens (standar BERT)
        # truncation=True: Potong jika terlalu panjang
        # padding=True: Tambah padding jika terlalu pendek
        encoded = tokenizer(
            text,
            max_length=512,
            truncation=True,
            padding=True,
            return_tensors="pt"
        )

        # Prediksi menggunakan model (tanpa gradient untuk inference)
        with torch.no_grad():
            logits = model(**encoded).logits  # Raw output dari model
            probs = torch.softmax(logits, dim=1).squeeze()  # Konversi ke probabilitas

        # Extract probabilitas untuk kelas "Legal"
        if probs.dim() == 0:
            prob_legal_model = float(probs)
        else:
            prob_legal_model = float(probs[1])  # Index 1 = Legal, Index 0 = Ilegal

        # Keputusan awal dari AI model
        # Jika probabilitas >= 0.5 → Legal, jika < 0.5 → Ilegal
        label = "Legal" if prob_legal_model >= 0.5 else "Ilegal"
        final_prob = prob_legal_model

        logger.info(f"[AI RESULT] Model memprediksi: {label} (probabilitas: {final_prob:.2f})")

        # ============================================================
        # STEP 2: VALIDASI DENGAN KEYWORD ANALYSIS
        # ============================================================
        # Cari kata-kata kunci yang ada di dalam teks sebagai validator
        # Keyword legal: "resmi", "pemerintah", "hukum", dll
        # Keyword ilegal: "judi", "slot", "gacor", dll
        logger.debug("[KEYWORD] Memvalidasi dengan keyword analysis...")
        text_lower = text.lower()  # Ubah ke lowercase untuk matching

        # Cari semua keyword legal yang muncul di teks
        legal_matches = [w for w in self._LEGAL_KEYWORDS if w in text_lower]
        # Cari semua keyword ilegal yang muncul di teks
        ilegal_matches = [w for w in self._ILEGAL_KEYWORDS if w in text_lower]

        # Hitung jumlahnya
        n_legal = len(legal_matches)
        n_ilegal = len(ilegal_matches)

        logger.debug(f"[KEYWORD] Ditemukan → Legal: {n_legal} kata, Ilegal: {n_ilegal} kata")

        # ============================================================
        # STEP 3: HYBRID DECISION (Override jika perlu)
        # ============================================================
        # --- KONDISI A: Override jika Keyword Ilegal Dominan ---
        # Jika keyword ilegal lebih banyak dari legal, biasanya model salah konteks
        # Contoh: Model bilang "Legal" tapi banyak kata "judi", "slot" → Override jadi "Ilegal"
        if n_ilegal > n_legal:
            if label == "Legal":
                logger.warning(f"[OVERRIDE] Keyword ilegal dominan ({n_ilegal} vs {n_legal}), OVERRIDE AI → Ilegal")
                label = "Ilegal"
                final_prob = 0.4  # Turunkan probabilitas di bawah 0.5

        # --- KONDISI B: Koreksi jika Keyword Legal Dominan ---
        # Jika model bilang "Ilegal" tapi banyak keyword legal dan TIDAK ADA keyword ilegal
        # Kemungkinan False Positive → Koreksi jadi "Legal"
        if label == "Ilegal" and n_legal >= 3 and n_ilegal == 0:
            logger.warning(f"[CORRECTION] Keyword legal dominan ({n_legal}) tanpa keyword ilegal, KOREKSI AI → Legal")
            label = "Legal"
            final_prob = 0.85

        logger.info(f"[FINAL DECISION] {label} dengan probabilitas {final_prob:.2f}")

        # ============================================================
        # STEP 4: RETURN HASIL PREDIKSI
        # ============================================================
        return {
            "label": label,  # "Legal" atau "Ilegal"
            "probability": final_prob,  # 0.0 - 1.0
            "cleaned_content": text,  # Teks yang sudah dibersihkan
            "keyword_stats": {
                "legal": n_legal,  # Jumlah keyword legal
                "ilegal": n_ilegal,  # Jumlah keyword ilegal
                "matches": {
                    "legal": legal_matches[:5],  # 5 keyword legal pertama (untuk debug)
                    "ilegal": ilegal_matches[:5]  # 5 keyword ilegal pertama (untuk debug)
                }
            }
        }

    def getDataFromRawJsonl(self, url: str) -> Optional[dict]:
        """
        Check if URL already exists in raw_data.jsonl cache.
        Returns cached result if found, None otherwise.
        """
        try:
            file_path = os.path.join(os.getcwd(), "output", "data", "raw_data.jsonl")

            if not os.path.exists(file_path):
                return None

            with open(file_path, 'r', encoding='utf-8') as f:
                for line in f:
                    if line.strip():
                        try:
                            record = json.loads(line)
                            # Extract from nested structure
                            data_obj = record.get('data', {})

                            if data_obj.get('url') == url:
                                logger.info(f"Cache HIT for URL: {url}")
                                # Return in the same format as analyzeUrl result
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

    @classmethod
    def getModelInstanceIndoBert(cls):
        if cls._tokenizer is None or cls._model is None:
            logger.info("Loading IndoBERT model (first time, may take a while)...")

            # Suppress warning tentang model yang belum di-fine-tune
            # Warning ini normal karena kita pakai pre-trained model
            import warnings
            from transformers import logging as transformers_logging

            # Temporarily suppress warnings
            warnings.filterwarnings('ignore', category=UserWarning)
            transformers_logging.set_verbosity_error()

            # Load tokenizer dan model
            cls._tokenizer = BertTokenizer.from_pretrained(
                cls._CALL_MODEL_INDOBERT,
                clean_up_tokenization_spaces=True
            )
            cls._model = AutoModelForSequenceClassification.from_pretrained(
                cls._CALL_MODEL_INDOBERT,
                num_labels=2
            )
            cls._model.eval()

            # Restore warnings
            warnings.filterwarnings('default', category=UserWarning)
            transformers_logging.set_verbosity_warning()

            logger.info("IndoBERT model loaded successfully!")

        return cls._tokenizer, cls._model




    #-----------------------------------------------------------
    # NETWORK
    #-----------------------------------------------------------
    def getNetworkInfo(self, url: str) -> Dict[str, str]:
        info = {"ip": "Unknown", "location": "Unknown"}
        try:
            parsed = urlparse(url)
            hostname = parsed.netloc
            if not hostname:
                 return info

            # Resolve IP
            ip_address = socket.gethostbyname(hostname)
            info["ip"] = ip_address

            # Resolve Location (Simple free API)
            # Use short timeout to not block flow
            try:
                geo_resp = requests.get(f"http://ip-api.com/json/{ip_address}", timeout=3)
                if geo_resp.status_code == 200:
                    geo_data = geo_resp.json()
                    if geo_data.get("status") == "success":
                        city = geo_data.get("city", "")
                        country = geo_data.get("country", "")
                        info["location"] = f"{city}, {country}".strip(", ")
            except Exception:
                pass # Location is optional, don't fail

        except Exception as e:
            logger.warning(f"Network info failed for {url}: {e}")

        return info




    #-----------------------------------------------------------
    # PERSISTENCE
    #-----------------------------------------------------------
    def saveLogToFile(self, data: dict):
        try:
            # Define output path
            output_dir = os.path.join(os.getcwd(), "output", "data")
            os.makedirs(output_dir, exist_ok=True)
            file_path = os.path.join(output_dir, "raw_data.jsonl")

            url_to_check = data['url']

            # Check if URL already exists in file (prevent duplicates)
            if os.path.exists(file_path):
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        for line in f:
                            if line.strip():
                                try:
                                    record = json.loads(line)
                                    # Check in nested data structure
                                    if record.get('data', {}).get('url') == url_to_check:
                                        logger.debug(f"URL already logged, skipping: {url_to_check}")
                                        return
                                except json.JSONDecodeError:
                                    continue
                except Exception as e:
                    logger.warning(f"Failed to check for duplicate logs: {e}")

            # Prepare data record in API response format
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

            # Append to file as JSON Line
            with open(file_path, "a", encoding="utf-8") as f:
                f.write(json.dumps(record) + "\n")

            logger.info(f"Logged new URL: {url_to_check}")

        except Exception as e:
            logger.error(f"Failed to save log: {e}")




    #-----------------------------------------------------------
    # LEARNING
    #-----------------------------------------------------------
    def autoUpdateKeywords(self, data: dict):

        label = data["label"]
        text = data["cleaned_content"]
        url = data["url"]

        # 1. Handle Keywords
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
            # Split text into words (text is already cleaned/lowercased)
            words = text.split()

            for word in words:
                # Basic filter: ignore short words or numbers
                if len(word) < 3 or word.isdigit():
                    continue

                if word not in target_keyword_list:
                    target_keyword_list.add(word)
                    new_words.append(word)

            if new_words:
                self.appendKeywordsToFile(keyword_filename, new_words)
                logger.info(f"Transfer Learning: Added {len(new_words)} new keywords to {keyword_filename}")

    def appendKeywordsToFile(self, filename: str, words: List[str]):
        if not self._base_path:
            return

        path = os.path.join(self._base_path, filename)

        # Read existing values from file to prevent duplicates
        existing_values = set()
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    for line in f:
                        if line.strip():
                            try:
                                record = json.loads(line)
                                if "value" in record:
                                    existing_values.add(record["value"].lower())
                            except json.JSONDecodeError:
                                continue
            except Exception as e:
                logger.warning(f"Failed to read existing values from {filename}: {e}")

        # Only append new values that don't exist in file
        new_values = [w for w in words if w.lower() not in existing_values]

        if not new_values:
            return  # Nothing to add

        try:
            with open(path, "a", encoding="utf-8") as f:
                for w in new_values:
                    f.write(json.dumps({"value": w}) + "\n")
                    existing_values.add(w.lower())  # Update in-memory set
        except Exception as e:
            logger.error(f"Failed to update learning file {filename}: {e}")

    def loadDataFromJsonl(self, file_path: str) -> set:
        data = set()
        if not os.path.exists(file_path):
            logger.warning(f"File not found: {file_path}")
            return data

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                for line in f:
                    if line.strip():
                        try:
                            record = json.loads(line)
                            # We expect {"value": "keyword"}
                            if "value" in record:
                                # Ensure lowercase to prevent duplicates
                                data.add(record["value"].lower())
                        except json.JSONDecodeError:
                            continue
        except Exception as e:
            logger.error(f"Failed to load {file_path}: {e}")

        return data
