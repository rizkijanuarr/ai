from backend.response.advices.ListResponseParameter import ListResponseParameter
import backend.response.v1.ScrapeURLResponseV1
import backend.request.v1.ScrapeURLRequestV1
from abc import ABC, abstractmethod
from typing import List
from backend.request.v1.ScrapeRequestV1 import ScrapeRequestV1
from backend.response.v1.ScrapeResponseV1 import ScrapeResponseV1
from backend.response.advices.DataResponseParameter import DataResponseParameter

class TugasAkhirServiceV1(ABC):
    
    @abstractmethod
    def scrape_url(self, request: ScrapeRequestV1) -> ScrapeResponseV1:
        pass

    @abstractmethod
    def get_scrape_url(self, request: ScrapeURLRequestV1) -> List[ScrapeURLResponseV1]:
        pass