from abc import ABC, abstractmethod
from backend.request.v1.ScrapeSerperRequestV1 import ScrapeSerperRequestV1
from backend.response.v1.ScrapeSerperResponseV1 import ScrapeSerperResponseV1
from backend.request.v1.ListDatasetRequestV1 import ListDatasetRequestV1
from backend.request.v1.SearchDatasetRequestV1 import SearchDatasetRequestV1
from backend.response.v1.ListDatasetResponseV1 import ListDatasetResponseV1
from backend.response.v1.DetailDatasetResponseV1 import DetailDatasetResponseV1

class TugasAkhirServiceV1(ABC):

    @abstractmethod
    def getScrapeSerper(self, request: ScrapeSerperRequestV1) -> ScrapeSerperResponseV1:
        pass

    @abstractmethod
    def getListDataset(self, request: ListDatasetRequestV1) -> ListDatasetResponseV1:
        pass

    @abstractmethod
    def getDetailDataset() -> DetailDatasetResponseV1:
        pass

    @abstractmethod
    def getDatasetByLink(self, link: str) -> DetailDatasetResponseV1:
        pass

    @abstractmethod
    def searchDataset(self, request: SearchDatasetRequestV1) -> dict:
        pass
