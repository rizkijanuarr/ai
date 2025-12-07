from backend.response.advices.ListResponseParameter import ListResponseParameter
from backend.service.v1.TugasAkhirServiceV1 import TugasAkhirServiceV1
from backend.repositories.v1.TugasAkhirRepositoriesV1 import TugasAkhirRepositoriesV1
from backend.request.v1.ScrapeRequestV1 import ScrapeRequestV1
from backend.response.v1.ScrapeResponseV1 import ScrapeResponseV1
from backend.response.advices.DataResponseParameter import DataResponseParameter
from backend.utils.ResponseHelper import ResponseHelper
from backend.request.v1.ScrapeURLRequestV1 import ScrapeURLRequestV1
from backend.response.v1.ScrapeURLResponseV1 import ScrapeURLResponseV1
from typing import List

class TugasAkhirServiceImplV1(TugasAkhirServiceV1):
    
    # Inject repository
    def __init__(self):
        self.repository = TugasAkhirRepositoriesV1()

    def scrape_url(self, request: ScrapeRequestV1) -> ScrapeResponseV1:
        data = self.repository.analyze_url(request.url)
        return self.responses(data)

    # Implementasi Google Search
    def get_scrape_url(self, request: ScrapeURLRequestV1) -> List[ScrapeURLResponseV1]:
        # Call Repository
        raw_results = self.repository.get_scrape_url(request.keyword, request.num_results)
        
        # Map to Response Objects
        response_list = []
        for item in raw_results:
            response_list.append(ScrapeURLResponseV1(
                url=item['url'],
                label=item['label'],
                title=item.get('title'),
                description=item.get('description'),
                h1=item.get('h1')
            ))
            
        return response_list

    # Transform dict/entity to Response DTO
    def responses(self, entity: dict) -> ScrapeResponseV1:
        return ScrapeResponseV1(
            url=entity.get("url"),
            label=entity.get("label"),
            probability=entity.get("probability"),
            snippet=entity.get("cleaned_content"),
            message="Analysis Successful"
        )