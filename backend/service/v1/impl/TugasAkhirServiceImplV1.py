from backend.service.v1.TugasAkhirServiceV1 import TugasAkhirServiceV1
from backend.repositories.v1.TugasAkhirRepositoriesV1 import TugasAkhirRepositoriesV1
from backend.request.v1.ScrapeRequestV1 import ScrapeRequestV1
from backend.response.v1.ScrapeResponseV1 import ScrapeResponseV1
from backend.utils.Exceptions import ScrapingFailedException

class TugasAkhirServiceImplV1(TugasAkhirServiceV1):
    
    # Inject repository
    def __init__(self):
        self.repository = TugasAkhirRepositoriesV1()

    def getScrapeUrl(self, request: ScrapeRequestV1) -> ScrapeResponseV1:
        # Exception akan propagate otomatis ke controller
        data = self.repository.analyzeUrl(request.url)
        return self.responses(data)

    # Transform dict/entity to Response DTO
    def responses(self, entity: dict) -> ScrapeResponseV1:
        return ScrapeResponseV1(
            url=entity.get("url"),
            label=entity.get("label"),
            probability=entity.get("probability"),
            snippet=entity.get("cleaned_content"),
            message="Analysis Successful",
            ip=entity.get("ip"),
            location=entity.get("location")
        )