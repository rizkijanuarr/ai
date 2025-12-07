import re
import requests
import torch
from typing import List, Dict, Optional
from bs4 import BeautifulSoup
from transformers import BertTokenizer, AutoModelForSequenceClassification

print("DEBUG: Loading TugasAkhirRepositoriesV1 module. BertTokenizer is available.")

class TugasAkhirRepositoriesV1:

    # --- MODEL CONFIGURATION (Singleton approach for performance) ---
    _MODEL_NAME = "indobenchmark/indobert-base-p2"
    _tokenizer = None
    _model = None

    # --- PREPROCESS PATTERNS ---
    _URL_PATTERN = re.compile(r"https?://\S+")
    _HTML_TAG_PATTERN = re.compile(r"<[^>]+>")
    _MULTI_SPACE_PATTERN = re.compile(r"\s+")

    _LEGAL_KEYWORDS = [
        "resmi",
        "pemerintah",
        "undang-undang",
        "hukum",
        "pendidikan",
        "jurnal",
        "akademik",
        "nasional",
        "kementerian",
        "polisi",
        "pengadilan",
        "konstitusi",
        "regulasi",
        "sah",
        "peraturan",
        "negara",
        "rakyat",
        "demokrasi",
        "ekonomi",
        "kesehatan",
        "medis",
        "berita",
        "terpercaya",
        "valid",
        "akta",
        "sertifikat",
        "lisensi",
        "izin",
        "publik",
        "layanan",
        "birokrasi",
        "administrasi",
        "kebijakan",
        "prosedur",
        "transparansi",
        "akuntabilitas",
        "integritas",
        "moral",
        "etika",
        "budaya",
        "sosial",
        "masyarakat",
        "penelitian",
        "riset",
        "inovasi",
        "teknologi",
        "industri",
        "pembangunan",
        "kesejahteraan",
        "keamanan",
        "notaris",
        "advokat",
        "hakim",
        "jaksa",
        "mahkamah",
        "legislatif",
        "eksekutif",
        "yudikatif",
        "parlemen",
        "dpr",
        "dpd",
        "mpr",
        "presiden",
        "menteri",
        "gubernur",
        "bupati",
        "walikota",
        "camat",
        "lurah",
        "kepolisian",
        "kejaksaan",
        "perpajakan",
        "bea cukai",
        "imigrasi",
        "kependudukan",
        "ktp",
        "paspor",
        "visa",
        "sipil",
        "pidana",
        "perdata",
        "tata negara",
        "dokumentasi",
        "arsip",
        "legal",
        "legitimasi",
        "otorisasi",
        "verifikasi",
        "validasi",
        "ratifikasi",
        "standar",
        "kualifikasi",
        "kredensial",
        "akreditasi",
        "sertifikasi",
        "registrasi",
        "perpustakaan",
        "universitas",
        "sekolah",
        "kampus",
        "pengacara",
        "kuasa hukum",
        "panitera",
        "sekretaris",
        "bpk",
        "bpkp",
        "ombudsman",
        "komisi",
        "lembaga",
        "badan",
        "dinas",
        "instansi",
        "kantor",
        "satuan kerja",
        "unit",
        "divisi",
        "departemen",
        "direktorat",
        "inspektorat",
        "balai",
        "pusat",
        "institusi",
        "organisasi",
        "yayasan",
        "perkumpulan",
        "asosiasi",
        "federasi",
        "konsorsium",
        "koperasi",
        "pt",
        "cv",
        "firma",
        "perseroan",
        "tbk",
        "bumn",
        "bumd",
        "holding",
        "anak perusahaan",
        "subsidiaries",
        "keuangan",
        "bank",
        "ojk",
        "bi",
        "investasi",
        "saham",
        "obligasi",
        "reksadana",
        "asuransi",
        "pembiayaan",
        "kredit",
        "modal",
        "bursa efek",
        "perundangan",
        "legislasi",
        "yuridis",
        "konstitusional",
        "pasal",
        "ayat",
        "klausul",
        "perjanjian",
        "kontrak",
        "memorandum",
        "surat keputusan",
        "sk",
        "keputusan",
        "penetapan",
        "ketetapan",
        "instruksi",
        "edaran",
        "perintah",
        "mandat",
        "wewenang",
        "kewenangan",
        "yurisdiksi",
        "kompetensi",
        "atribusi",
        "delegasi",
        "pelimpahan",
        "pengawasan",
        "supervisi",
        "monitoring",
        "evaluasi",
        "audit",
        "pemeriksaan",
        "investigasi",
        "penyelidikan",
        "penyidikan",
        "penuntutan",
        "tuntutan",
        "gugatan",
        "permohonan",
        "banding",
        "kasasi",
        "peninjauan kembali",
        "eksekusi",
        "putusan",
        "vonis",
        "sanksi",
        "hukuman",
        "denda",
        "pidana penjara",
        "kurungan"
    ]

    _ILEGAL_KEYWORDS = [
        "slot",
        "gacor",
        "judi",
        "taruhan",
        "bandar",
        "togel",
        "poker",
        "casino",
        "bokep",
        "porno",
        "sex",
        "bugil",
        "hantai",
        "xxx",
        "18+",
        "dewasa",
        "bajakan",
        "crack",
        "patch",
        "keygen",
        "warez",
        "nulled",
        "hack",
        "cheat",
        "phishing",
        "malware",
        "virus",
        "trojan",
        "penipuan",
        "scam",
        "palsu",
        "ilegal",
        "dilarang",
        "selundupan",
        "narkoba",
        "sabu",
        "ganja",
        "ekstasi",
        "teroris",
        "radikal",
        "bom",
        "serangan",
        "kekerasan",
        "sadis",
        "gore",
        "darkweb",
        "carding",
        "spam",
        "hoax",
        "provokasi",
        "roulette",
        "baccarat",
        "blackjack",
        "sportbook",
        "maxwin",
        "jackpot",
        "deposit",
        "withdraw",
        "betting",
        "sportsbet",
        "livecasino",
        "slotgame",
        "pragmatic",
        "habanero",
        "joker123",
        "kingslot",
        "sabung ayam",
        "colok",
        "4d",
        "toto",
        "hongkong",
        "singapore",
        "sydney",
        "macau",
        "telanjang",
        "mesum",
        "selingkuh",
        "cabul",
        "asusila",
        "lucah",
        "pornografi",
        "memek",
        "kontol",
        "ngentot",
        "onlyfans",
        "camgirl",
        "escort",
        "psk",
        "prostitusi",
        "pelacur",
        "mucikari",
        "ransomware",
        "exploit",
        "botnet",
        "ddos",
        "sql injection",
        "brute force",
        "keylogger",
        "spyware",
        "pemalsuan",
        "dokumen palsu",
        "uang palsu",
        "identitas palsu",
        "korupsi",
        "suap",
        "gratifikasi",
        "pencucian uang",
        "money laundering",
        "terorisme",
        "separatis",
        "makar",
        "kudeta",
        "pemberontakan",
        "hasut",
        "adu domba",
        "fitnah",
        "pencemaran nama baik",
        "ujaran kebencian",
        "rasisme",
        "sara",
        "diskriminasi",
        "pelecehan",
        "harassment",
        "stalking",
        "doxing",
        "revenge porn",
        "perdagangan manusia",
        "trafficking",
        "penculikan",
        "penyanderaan",
        "pemerasan",
        "perampokan",
        "pembunuhan",
        "senjata api",
        "amunisi",
        "bahan peledak",
        "mortir",
        "granat",
        "nuklir",
        "kimia",
        "biologis",
        "heroin",
        "kokain",
        "metamfetamin",
        "shabu",
        "pil koplo",
        "zenith",
        "tramadol",
        "slots online",
        "situs judi",
        "agen judi",
        "bandar bola",
        "mix parlay",
        "handicap",
        "over under",
        "odds",
        "parlay",
        "judi bola",
        "taruhan bola",
        "prediksi judi",
        "bocoran slot",
        "rtp slot",
        "link slot",
        "daftar slot",
        "bonus slot",
        "freespin",
        "scatter",
        "wild",
        "megaways",
        "pg soft",
        "microgaming",
        "playtech",
        "spadegaming",
        "cq9",
        "live slot",
        "slot88",
        "slot777",
        "capsa",
        "domino",
        "ceme",
        "gaple",
        "sicbo",
        "dragon tiger",
        "fantan",
        "keno",
        "lottery",
        "angka jitu",
        "shio",
        "mimpi togel",
        "erek erek",
        "gengtoto",
        "jaya togel",
        "kambing",
        "buntut",
        "colok bebas",
        "colok jitu",
        "colok naga",
        "video porno",
        "film porno",
        "situs porno",
        "link bokep",
        "download bokep",
        "streaming bokep",
        "indo bokep",
        "jav",
        "av",
        "hentai",
        "doujin",
        "r18",
        "nsfw",
        "sange",
        "colmek",
        "coli",
        "onani",
        "masturbasi",
        "oral sex",
        "anal sex",
        "threesome",
        "gangbang",
        "milf",
        "jilbab mesum",
        "abg bugil",
        "tante girang",
        "live show",
        "video call sex",
        "bo",
        "open bo",
        "hijab bugil",
        "binor",
        "selingkuh tante",
        "crot",
        "spill",
        "desah",
        "cracker",
        "password cracker",
        "backdoor",
        "rootkit",
        "rat",
        "stealer",
        "loader",
        "crypter",
        "fud",
        "xss",
        "csrf",
        "lfi",
        "rfi",
        "shell",
        "webshell",
        "deface",
        "carder",
        "cvv",
        "dumps",
        "opium",
        "morfin",
        "pethidin",
        "metadon",
        "kodein",
        "lsd",
        "magic mushroom",
        "katinon",
        "mephedrone",
        "flakka",
        "krokodil",
        "baygon",
        "lem aibon",
        "dextro",
        "nipam",
        "riklona",
        "dumolid",
        "lexotan",
        "xanax",
        "alprazolam",
        "happy five",
        "liquid vape",
        "gorilla",
        "double l",
        "senjata tajam",
        "badik",
        "celurit",
        "golok",
        "pedang",
        "samurai",
        "revolver",
        "pistol",
        "senapan",
        "shotgun",
        "sniper",
        "peluru",
        "meriam",
        "tank",
        "rudal",
        "misil",
        "bom molotov",
        "bom pipa",
        "bom rakitan",
        "peledak",
        "c4",
        "tnt",
        "dinamit",
        "amunisi illegal",
        "senjata rakitan",
        "air soft gun ilegal",
        "bengkel senjata",
        "jual senjata"
    ]

    # --- SCRAPER CONFIGURATION ---
    _DEFAULT_HEADERS = {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        )
    }

    """
        Orchestrates the scraping, preprocessing, and prediction for a given URL.
        Returns a dictionary with details.
    """
    def analyze_url(self, url: str) -> dict:
        # 1. Scrape
        raw_content = self._scrape_meta(url)

        # 2. Preprocess
        cleaned_content = self._clean_text(raw_content)

        # 3. Predict
        prediction = self._predict(cleaned_content)

        return {
            "url": url,
            "raw_content": raw_content,
            "cleaned_content": cleaned_content,
            "label": prediction["label"],
            "probability": prediction["probability"]
        }

    
    def _scrape_meta(self, url: str, timeout: int = 10) -> str:
        # Suppress SSL warnings for this request
        requests.packages.urllib3.disable_warnings()
        try:
            # Added verify=False to bypass SSL verification errors
            resp = requests.get(url, headers=self._DEFAULT_HEADERS, timeout=timeout, verify=False)
            resp.raise_for_status()
        except requests.RequestException as exc:
            # We can log this better or just fail
            raise RuntimeError(f"Failed to fetch {url}: {exc}") from exc

        soup = BeautifulSoup(resp.text, "lxml")
        content_parts: List[str] = []

        # 1. Get Title
        if soup.title and soup.title.string:
            content_parts.append(soup.title.string.strip())

        # 2. Get Meta specific tags
        for tag in soup.find_all("meta"):
            name = tag.get("name") or tag.get("property")
            if name and any(key in name.lower() for key in ["description", "og:description", "twitter:description"]):
                content = tag.get("content", "").strip()
                if content:
                    content_parts.append(content)

        # 3. Fallback: Get Headers (H1, H2)
        for header in soup.find_all(["h1", "h2"]):
            text = header.get_text(strip=True)
            if text:
                content_parts.append(text)

        # 4. Fallback: Get Paragraphs if content is still sparse
        # We grab the first 3 paragraphs to avoid noise
        for p in soup.find_all("p", limit=3):
            text = p.get_text(strip=True)
            if text:
                content_parts.append(text)
        
        return " ".join(content_parts)

    def _clean_text(self, text: str) -> str:
        text = self._URL_PATTERN.sub("", text)
        text = self._HTML_TAG_PATTERN.sub("", text)
        text = text.lower()
        text = self._MULTI_SPACE_PATTERN.sub(" ", text)
        text = text.strip()
        return text

    def _predict(self, text: str) -> Dict[str, float]:
        if not text:
            return {"label": "Unknown", "probability": 0.0}

        tokenizer, model = self._get_model_instance()
        
        encoded = tokenizer(text, truncation=True, padding=True, return_tensors="pt")

        with torch.no_grad():
            logits = model(**encoded).logits
            probs = torch.softmax(logits, dim=1).squeeze()

        if probs.dim() == 0:
            prob_legal = float(probs)
        else:
            prob_legal = float(probs[1])

        label = "Legal" if prob_legal >= 0.5 else "Ilegal"
        return {"label": label, "probability": prob_legal}

    @classmethod
    def _get_model_instance(cls):
        if cls._tokenizer is None or cls._model is None:
            # Explicitly using BertTokenizer here as imported above
            cls._tokenizer = BertTokenizer.from_pretrained(cls._MODEL_NAME)
            cls._model = AutoModelForSequenceClassification.from_pretrained(cls._MODEL_NAME, num_labels=2)
            cls._model.eval()
        return cls._tokenizer, cls._model


    """
        SEARCH URLs (Using DuckDuckGo Only)
    """
    def get_scrape_url(self, keyword: str, num_results: int = 20) -> List[Dict[str, str]]:
        links = []
        collected_urls = set() # To store unique URLs
        
        # Helper to process and append URL
        def process_and_append(url_to_add):
            if url_to_add and url_to_add not in collected_urls:
                collected_urls.add(url_to_add)
                
                # DEEP ANALYZE: Try to scrape, but don't fail if it fails
                print(f"[DEBUG] Processing: {url_to_add}...") 
                scrape_data = {}
                try:
                    scrape_data = self._scrape_meta_for_url(url_to_add, timeout=10)
                except Exception as e:
                    print(f"[WARN] Failed to analyze {url_to_add}: {e}")
                    scrape_data = {"label": "Scrape Failed"}

                # ALWAYS append result even if scraping failed, so we know the URL exists
                entry = {
                    "url": url_to_add,
                    "label": scrape_data.get("label", "Unknown"),
                    "title": scrape_data.get("title"),
                    "description": scrape_data.get("description"),
                    "h1": scrape_data.get("h1")
                }
                links.append(entry)
                return True
            return False

        # --- STRATEGY: DuckDuckGo ---
        try:
            print("[INFO] Strategy: Trying DuckDuckGo...")
            from duckduckgo_search import DDGS
            
            # Enforce content in Indonesian context STRICTLY
            primary_query = f"{keyword} Indonesia" if "indonesia" not in keyword.lower() else keyword
            queries_to_try = [primary_query]
            
            # If keyword is generic (one word), add fallback without "Indonesia" 
            # but relying on region='id-id'
            if len(keyword.split()) <= 2 and "indonesia" not in keyword.lower():
                queries_to_try.append(keyword)

            # STRATEGY CHANGE: Manual Scraping of DuckDuckGo HTML Version
            # Why? Library/API blocks explicit keywords hard. The HTML version is looser.
            import requests
            from bs4 import BeautifulSoup
            
            # Robust Headers for DDG HTML
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Referer": "https://html.duckduckgo.com/",
                "Content-Type": "application/x-www-form-urlencoded",
                "Origin": "https://html.duckduckgo.com"
            }
            
            for q in queries_to_try:
                if len(links) >= num_results: break
                
                print(f"[INFO] Manual Scraping DDG HTML: {q}")
                
                # DDG HTML uses POST request usually
                payload = {
                    'q': q,
                    'kl': 'wt-wt', # Global Region
                    'kp': '-2',    # SafeSearch OFF (-2 is advanced off key)
                }
                
                try:
                    resp = requests.post("https://html.duckduckgo.com/html/", data=payload, headers=headers, timeout=15)
                    
                    if resp.status_code == 200:
                        soup = BeautifulSoup(resp.text, "html.parser")
                        
                        # Links are in class 'result__a'
                        for a in soup.select("a.result__a"):
                            url = a.get('href')
                            if url:
                                # Sometimes DDG wraps links/ads, but usually result__a is direct or redirect
                                # Clean up if needed
                                if "duckduckgo.com/l/?" in url:
                                    # Try to extract real URL if wrapped? Usually result__a is fine directly
                                    # But let's verify protocol
                                    pass
                                
                                if url.startswith("http"):
                                    # FILTER BLACKLIST
                                    if any(x in url for x in ["zhihu.com", "cash.ch", "quora.com", "pinterest", "digitalspy"]):
                                        continue
                                    
                                    if process_and_append(url):
                                        if len(links) >= num_results: 
                                            break
                    else:
                        print(f"[WARN] DDG HTML returned {resp.status_code}")
                except Exception as e:
                     print(f"[ERROR] Manual DDG request failed: {e}")

        except Exception as e:
            print(f"[ERROR] Strategy DuckDuckGo failed: {e}")

        # Final check
        if not links:
             links.append({"url": "NO RESULT", "label": "Search returned 0 results"})
            
        return links[:num_results]

    def _scrape_meta_for_url(self, url: str, timeout: int = 20) -> Dict[str, str]:
        # Suppress SSL warnings for this request
        requests.packages.urllib3.disable_warnings()
        
        # USE ROBUST HEADERS (Chrome 120)
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
            "Referer": "https://www.google.com/"
        }

        try:
            # Added verify=False to bypass SSL verification errors
            resp = requests.get(url, headers=headers, timeout=timeout, verify=False)
            
            # Simple status check helper
            if resp.status_code != 200:
                 print(f"[WARN] URL {url} returned status {resp.status_code}")
                 return {"label": f"Error Status {resp.status_code}"}
                 
        except requests.RequestException:
            # Silent fail for bulk scraping
            return {"label": "Connection Error"}

        soup = BeautifulSoup(resp.text, "lxml")
        
        # DATA EXTRACTION
        extracted_data = {
            "title": "",
            "description": "",
            "h1": "",
            "full_text": "" # for analysis
        }

        # 1. Get Title
        if soup.title and soup.title.string:
            extracted_data["title"] = soup.title.string.strip()

        # 2. Get Meta specific tags
        for tag in soup.find_all("meta"):
            name = tag.get("name") or tag.get("property")
            if name and any(key in name.lower() for key in ["description", "og:description", "twitter:description"]):
                content = tag.get("content", "").strip()
                if content and not extracted_data["description"]: # Take the first one found
                    extracted_data["description"] = content

        # 3. Get H1
        h1_tag = soup.find("h1")
        if h1_tag:
            extracted_data["h1"] = h1_tag.get_text(strip=True)

        # 4. Fallback content for Keyword Analysis (Paragraphs, Headers)
        content_parts = [extracted_data["title"], extracted_data["description"], extracted_data["h1"]]
        for p in soup.find_all("p", limit=5): 
            text = p.get_text(strip=True)
            if text: content_parts.append(text)
        
        extracted_data["full_text"] = " ".join(filter(None, content_parts))
        lower_text = extracted_data["full_text"].lower()
        
        # --- KEYWORD CHECKING LOGIC ---
        legal_score = sum(1 for word in self._LEGAL_KEYWORDS if word in lower_text)
        ilegal_score = sum(1 for word in self._ILEGAL_KEYWORDS if word in lower_text)
        
        label = "Unknown"
        if ilegal_score > legal_score and ilegal_score > 0:
            label = "Ilegal (Keyword)"
        elif legal_score > ilegal_score and legal_score > 0:
            label = "Legal (Keyword)"
        elif ilegal_score > 0 and ilegal_score == legal_score:
             label = "Ambiguous"
             
        extracted_data["label"] = label
        return extracted_data