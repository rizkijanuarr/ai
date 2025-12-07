from abc import ABC, abstractmethod
from backend.request.v1.ScrapeRequestV1 import ScrapeRequestV1
from backend.response.v1.ScrapeResponseV1 import ScrapeResponseV1

class TugasAkhirServiceV1(ABC):
    
    @abstractmethod
    def scrape_url(self, request: ScrapeRequestV1) -> ScrapeResponseV1:
        pass