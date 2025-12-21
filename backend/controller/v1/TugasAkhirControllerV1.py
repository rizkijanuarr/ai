from backend.response.advices.ListResponseParameter import ListResponseParameter
from backend.response.advices.DataResponseParameter import DataResponseParameter
from backend.response.advices.SliceResponseParameter import SliceResponseParameter
from backend.controller.advices.BaseController import BaseController
from backend.annotations.method.PostEndpoint import PostEndpoint
from backend.annotations.method.GetEndpoint import GetEndpoint
from backend.annotations.method.SwaggerTypeGroup import SwaggerTypeGroup
from backend.request.v1.ScrapeSerperRequestV1 import ScrapeSerperRequestV1
from backend.response.v1.ScrapeSerperResponseV1 import ScrapeSerperResponseV1
from backend.request.v1.ListDatasetRequestV1 import ListDatasetRequestV1
from backend.request.v1.SearchDatasetRequestV1 import SearchDatasetRequestV1
from backend.request.v1.GetDatasetByLinkRequestV1 import GetDatasetByLinkRequestV1
from backend.response.v1.ListDatasetResponseV1 import ListDatasetResponseV1
from backend.response.v1.DetailDatasetResponseV1 import DetailDatasetResponseV1
from abc import ABC, abstractmethod

@BaseController(value="/api/v1")
class TugasAkhirControllerV1(ABC):

    @PostEndpoint(
        value="/serper",
        tagName="Tugas Akhir Management",
        description="Scrape With Serper API",
        group=SwaggerTypeGroup.APPS_WEB
    )
    def getScrapeSerper(self, validation_request: ScrapeSerperRequestV1) -> ListResponseParameter[ScrapeSerperResponseV1]:
        pass

    @GetEndpoint(
        value="/list-dataset",
        tagName="Tugas Akhir Management",
        description="Get List Dataset",
        group=SwaggerTypeGroup.APPS_WEB
    )
    @abstractmethod
    def getListDataset(self, validation_request: ListDatasetRequestV1) -> SliceResponseParameter[ListDatasetResponseV1]:
        pass

    @GetEndpoint(
        value="/detail-dataset/{id}",
        tagName="Tugas Akhir Management",
        description="Get Detail Dataset",
        group=SwaggerTypeGroup.APPS_WEB
    )
    @abstractmethod
    def getDetailDataset(self, id: int) -> DataResponseParameter[DetailDatasetResponseV1]:
        pass

    @PostEndpoint(
        value="/dataset-by-link",
        tagName="Tugas Akhir Management",
        description="Get Dataset by Link URL",
        group=SwaggerTypeGroup.APPS_WEB
    )
    @abstractmethod
    def getDatasetByLink(self, validation_request: GetDatasetByLinkRequestV1) -> DataResponseParameter[DetailDatasetResponseV1]:
        pass

    @PostEndpoint(
        value="/search-dataset",
        tagName="Tugas Akhir Management",
        description="Search Dataset by keyword, title, or description",
        group=SwaggerTypeGroup.APPS_WEB
    )
    @abstractmethod
    def searchDataset(self, validation_request: SearchDatasetRequestV1) -> SliceResponseParameter[ListDatasetResponseV1]:
        pass
