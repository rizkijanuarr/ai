from abc import ABC, abstractmethod
from backend.request.v1.ScrapeRequestV1 import ScrapeRequestV1
from backend.response.v1.ScrapeResponseV1 import ScrapeResponseV1
from backend.request.v1.ScrapeSerperRequestV1 import ScrapeSerperRequestV1
from backend.response.v1.ScrapeSerperResponseV1 import ScrapeSerperResponseV1

class TugasAkhirServiceV1(ABC):

    @abstractmethod
    def getScrapeUrl(self, request: ScrapeRequestV1) -> ScrapeResponseV1:
        pass

    @abstractmethod
    def getScrapeSerper(self, request: ScrapeSerperRequestV1) -> ScrapeSerperResponseV1:
        pass
