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