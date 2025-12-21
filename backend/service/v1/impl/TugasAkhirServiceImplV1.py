from backend.service.v1.TugasAkhirServiceV1 import TugasAkhirServiceV1
from backend.repositories.v1.TugasAkhirRepositoriesV1 import TugasAkhirRepositoriesV1
from backend.request.v1.ScrapeRequestV1 import ScrapeRequestV1
from backend.response.v1.ScrapeResponseV1 import ScrapeResponseV1
from backend.utils.Exceptions import ScrapingFailedException
from backend.request.v1.ScrapeSerperRequestV1 import ScrapeSerperRequestV1
from backend.response.v1.ScrapeSerperResponseV1 import ScrapeSerperResponseV1

class TugasAkhirServiceImplV1(TugasAkhirServiceV1):

    # Inject repository
    def __init__(self):
        self.repository = TugasAkhirRepositoriesV1()

    def getScrapeUrl(self, request: ScrapeRequestV1) -> ScrapeResponseV1:
        # Exception akan propagate otomatis ke controller
        data = self.repository.analyzeUrl(request.url)
        return self.responses(data)

    def getScrapeSerper(self, request: ScrapeSerperRequestV1) -> ScrapeSerperResponseV1:
        # Call repository dengan parameter dari request
        print(f"[SERVICE DEBUG] Request: {request}")
        data = self.repository.scrapeSerper(
            query=request.query,
            location=request.location,
            gl=request.gl,
            hl=request.hl,
            total_pages=request.total_pages
        )
        print(f"[SERVICE DEBUG] Repository data type: {type(data)}")
        print(f"[SERVICE DEBUG] Repository data keys: {data.keys() if isinstance(data, dict) else 'N/A'}")

        response = self.responsesSerper(data)
        print(f"[SERVICE DEBUG] Response type: {type(response)}")
        print(f"[SERVICE DEBUG] Response: {response}")
        return response

    def responsesSerper(self, entity: dict) -> ScrapeSerperResponseV1:
        """
        Transform dict dari repository ke Response DTO
        """
        from backend.response.v1.ScrapeSerperResponseV1 import SerperOrganicItem

        print(f"[SERVICE DEBUG] Transform entity with {len(entity.get('organic', []))} organic items")

        # Transform organic results ke list of SerperOrganicItem
        organic_items = []
        for item in entity.get("organic", []):
            organic_items.append(SerperOrganicItem(
                title=item.get("title", ""),
                link=item.get("link", ""),
                snippet=item.get("snippet", ""),
                position=item.get("position", 0),
                rating=item.get("rating"),
                ratingCount=item.get("ratingCount")
            ))

        print(f"[SERVICE DEBUG] Created {len(organic_items)} SerperOrganicItem objects")

        response = ScrapeSerperResponseV1(
            query=entity.get("query", ""),
            total_results=entity.get("total_results", 0),
            organic=organic_items,
            csv_path=entity.get("csv_path", ""),
            message=f"Successfully crawled {entity.get('total_results', 0)} results"
        )

        print(f"[SERVICE DEBUG] Created ScrapeSerperResponseV1: {response}")
        return response

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
