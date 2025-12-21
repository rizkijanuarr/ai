from backend.response.advices.ListResponseParameter import ListResponseParameter
from backend.controller.advices.BaseController import BaseController
from backend.annotations.method.PostEndpoint import PostEndpoint
from backend.request.v1.ScrapeRequestV1 import ScrapeRequestV1
from backend.response.v1.ScrapeResponseV1 import ScrapeResponseV1
from backend.response.advices.DataResponseParameter import DataResponseParameter
from backend.request.v1.ScrapeSerperRequestV1 import ScrapeSerperRequestV1
from backend.response.v1.ScrapeSerperResponseV1 import ScrapeSerperResponseV1
from backend.annotations.method.SwaggerTypeGroup import SwaggerTypeGroup
from abc import ABC, abstractmethod

@BaseController(value="/api/v1/scrape")
class TugasAkhirControllerV1(ABC):

    @PostEndpoint(
        value="",
        tagName="Tugas Akhir Management",
        description="Scrape and analyze a URL",
        group=SwaggerTypeGroup.APPS_WEB
    )
    @abstractmethod
    def getScrapeUrl(self, validation_request: ScrapeRequestV1) -> DataResponseParameter[ScrapeResponseV1]:
        pass


    @PostEndpoint(
        value="/serper",
        tagName="Tugas Akhir Management",
        description="Scrape With Serper API",
        group=SwaggerTypeGroup.APPS_WEB
    )
    @abstractmethod
    def getScrapeSerper(self, validation_request: ScrapeSerperRequestV1) -> ListResponseParameter[ScrapeSerperResponseV1]:
        pass
