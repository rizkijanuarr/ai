from backend.service.v1.TugasAkhirServiceV1 import TugasAkhirServiceV1
from backend.repositories.v1.TugasAkhirRepositoriesV1 import TugasAkhirRepositoriesV1
from backend.request.v1.ScrapeRequestV1 import ScrapeRequestV1
from backend.response.v1.ScrapeResponseV1 import ScrapeResponseV1
from backend.response.advices.DataResponseParameter import DataResponseParameter
from backend.utils.ResponseHelper import ResponseHelper

class TugasAkhirServiceImplV1(TugasAkhirServiceV1):
    
    # Inject repository
    def __init__(self):
        self.repository = TugasAkhirRepositoriesV1()

    def scrape_url(self, request: ScrapeRequestV1) -> ScrapeResponseV1:
        data = self.repository.analyze_url(request.url)
        return self.responses(data)

    # Transform dict/entity to Response DTO
    def responses(self, entity: ScrapeResponseV1) -> ScrapeResponseV1:
        return ScrapeResponseV1(
            url=entity.url,
            label=entity.label,
            probability=entity.probability,
            snippet=entity.snippet,
            message="Analysis Successful"
        )