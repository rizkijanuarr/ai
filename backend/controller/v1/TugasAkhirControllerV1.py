from backend.response.advices.ListResponseParameter import ListResponseParameter
from backend.controller.advices.BaseController import BaseController
from backend.annotations.method.PostEndpoint import PostEndpoint
from backend.annotations.method.GetEndpoint import GetEndpoint
from backend.request.v1.ScrapeRequestV1 import ScrapeRequestV1
from backend.response.v1.ScrapeResponseV1 import ScrapeResponseV1
from backend.response.advices.DataResponseParameter import DataResponseParameter
from backend.request.v1.ScrapeURLRequestV1 import ScrapeURLRequestV1
from backend.response.v1.ScrapeURLResponseV1 import ScrapeURLResponseV1
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
    def scrape_web(self, validation_request: ScrapeRequestV1) -> DataResponseParameter[ScrapeResponseV1]:
        pass


    # todo list
    @PostEndpoint(
        value="/url",
        tagName="Tugas Akhir Management",
        description="Scrape URL",
        group=SwaggerTypeGroup.APPS_WEB
    )
    @abstractmethod
    def get_scrape_url(self, validation_request: ScrapeURLRequestV1) -> ListResponseParameter[ScrapeURLResponseV1]:
        pass
