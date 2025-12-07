from dataclasses import dataclass

@dataclass
class ScrapeURLRequestV1:
    keyword: str
    num_results: int = 20