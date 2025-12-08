import re
import requests
import torch
import socket
from urllib.parse import urlparse
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
        "delegasi",
        "pelimpahan",
        "pengawasan",
        "belanja",
        "toko",
        "jual",
        "beli",
        "produk",
        "gratis",
        "murah",
        "diskon",
        "promo",
        "voucher",
        "keranjang",
        "checkout",
        "pembayaran",
        "pengiriman",
        "kurir",
        "ongkir",
        "ulasan",
        "rating",
        "deskripsi produk",
        "kategori",
        "merk",
        "brand",
        "original",
        "garansi",
        "retur",
        "refund",
        "customer service",
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

    _KNOWN_LEGAL_DOMAINS = [
        "shopee", "tokopedia", "bukalapak", "lazada", "blibli", "zalora",
        "youtube", "facebook", "instagram", "tiktok", "twitter", "x.com",
        "google", "whatsapp", "linkedin", "gojek", "grab", "traveloka",
        "tiket", "halodoc", "alodokter", "kompas", "detik", "cnnindonesia"
    ]

    # --- SCRAPER CONFIGURATION ---
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

    """
        Orchestrates the scraping, preprocessing, and prediction for a given URL.
        Returns a dictionary with details.
    """
    def analyze_url(self, url: str) -> dict:
        # 0. Check Whitelist Domain (Instant Pass)
        # Useful for strong-security sites (Shopee, etc) that block scraping
        parsed_domain = urlparse(url).netloc.lower()
        is_whitelisted = any(d in parsed_domain for d in self._KNOWN_LEGAL_DOMAINS)
        
        # 1. Scrape
        raw_content = self._scrape_meta(url)

        # 2. Preprocess
        cleaned_content = self._clean_text(raw_content)

        # 3. Predict
        if is_whitelisted and not cleaned_content:
             # Fallback if scraping failed but domain is trusted
             prediction = {"label": "Legal (Trusted)", "probability": 0.99}
             cleaned_content = f"Trusted Domain Content: {parsed_domain}"
        else:
             prediction = self._predict(cleaned_content)
             
             # Double check whitelist override for safety
             if is_whitelisted and prediction["label"] == "Ilegal":
                 prediction = {"label": "Legal (Trusted)", "probability": 0.95}
        
        # 4. Network Info (IP & Location)
        net_info = self._get_network_info(url)

        return {
            "url": url,
            "raw_content": raw_content or "Scraping Blocked/Empty",
            "cleaned_content": cleaned_content,
            "label": prediction["label"],
            "probability": prediction["probability"],
            "ip": net_info["ip"],
            "location": net_info["location"]
        }

    def _get_network_info(self, url: str) -> Dict[str, str]:
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
            print(f"[WARN] Network info failed for {url}: {e}")
            
        return info

    
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

        # Langkah 1: Analisa Keyword (Legal vs Ilegal)
        text_lower = text.lower()
        
        legal_matches = [w for w in self._LEGAL_KEYWORDS if w in text_lower]
        ilegal_matches = [w for w in self._ILEGAL_KEYWORDS if w in text_lower]
        
        n_legal = len(legal_matches)
        n_ilegal = len(ilegal_matches)

        # Langkah 2: Prediksi Model AI (IndoBERT)
        tokenizer, model = self._get_model_instance()
        encoded = tokenizer(text, truncation=True, padding=True, return_tensors="pt")
        
        with torch.no_grad():
            logits = model(**encoded).logits
            probs = torch.softmax(logits, dim=1).squeeze()

        if probs.dim() == 0:
            prob_legal_model = float(probs)
        else:
            prob_legal_model = float(probs[1]) # Probabilitas kelas Legal

        # Langkah 3: Logika Keputusan Hibrid
        # Mulai dari pendapat Model
        label = "Legal" if prob_legal_model >= 0.5 else "Ilegal"
        final_prob = prob_legal_model

        # Kondisi A: Dominasi Keyword Ilegal (Override Model)
        # Jika keyword ileal lebih banyak, biasanya model salah konteks
        if n_ilegal > n_legal:
            # Jika model bilang Legal, tapi keyword Ilegal banyak -> Balik jadi Ilegal
            if label == "Legal":
                label = "Ilegal (Keyword)"
                # Turunkan probabilitas jadi di bawah 0.5
                final_prob = 0.4 
        


        # Kondisi B: Dominasi Keyword Legal (Koreksi Model)
        # Jika Model bilang Ilegal (False Positive) tapi banyak keyword Legal dan NOL keyword Ilegal
        if label == "Ilegal" and n_legal >= 3 and n_ilegal == 0:
            label = "Legal (Keyword)"
            final_prob = 0.85

        # Format output
        return {
            "label": label, 
            "probability": final_prob,
            "keyword_stats": {
                "legal": n_legal, 
                "ilegal": n_ilegal,
                "matches": {
                    "legal": legal_matches[:5], # Show top 5 for debug
                    "ilegal": ilegal_matches[:5]
                }
            }
        }

    @classmethod
    def _get_model_instance(cls):
        if cls._tokenizer is None or cls._model is None:
            # Explicitly using BertTokenizer here as imported above
            cls._tokenizer = BertTokenizer.from_pretrained(cls._MODEL_NAME)
            cls._model = AutoModelForSequenceClassification.from_pretrained(cls._MODEL_NAME, num_labels=2)
            cls._model.eval()
        return cls._tokenizer, cls._model