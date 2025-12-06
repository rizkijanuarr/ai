import re
import requests
import torch
from typing import List, Dict, Optional
from bs4 import BeautifulSoup
from transformers import AutoTokenizer, AutoModelForSequenceClassification

class TugasAkhirRepositoriesV1:

    # --- MODEL CONFIGURATION (Singleton approach for performance) ---
    _MODEL_NAME = "indobenchmark/indobert-base-p1"
    _tokenizer = None
    _model = None

    # --- PREPROCESS PATTERNS ---
    _URL_PATTERN = re.compile(r"https?://\S+")
    _HTML_TAG_PATTERN = re.compile(r"<[^>]+>")
    _MULTI_SPACE_PATTERN = re.compile(r"\s+")

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
        try:
            resp = requests.get(url, headers=self._DEFAULT_HEADERS, timeout=timeout)
            resp.raise_for_status()
        except requests.RequestException as exc:
            raise RuntimeError(f"Failed to fetch {url}: {exc}") from exc

        soup = BeautifulSoup(resp.text, "lxml")
        meta_tags: List[str] = []
        
        for tag in soup.find_all("meta"):
            name = tag.get("name") or tag.get("property")
            if name and any(key in name.lower() for key in ["description", "og:", "twitter:"]):
                content = tag.get("content", "").strip()
                if content:
                    meta_tags.append(content)
        
        return "\n".join(meta_tags)

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
            cls._tokenizer = AutoTokenizer.from_pretrained(cls._MODEL_NAME)
            cls._model = AutoModelForSequenceClassification.from_pretrained(cls._MODEL_NAME, num_labels=2)
            cls._model.eval()
        return cls._tokenizer, cls._model
