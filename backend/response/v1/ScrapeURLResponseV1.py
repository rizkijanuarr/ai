from dataclasses import dataclass
from typing import Optional

@dataclass
class ScrapeURLResponseV1:
    url: str
    label: str = "Unknown"
    title: Optional[str] = None
    description: Optional[str] = None
    h1: Optional[str] = None
