from dataclasses import dataclass
from typing import Optional

@dataclass
class ScrapeResponseV1:
    url: str
    label: str
    probability: float
    snippet: Optional[str] = None
    message: Optional[str] = None
