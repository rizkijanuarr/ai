from backend.service.v1.TugasAkhirServiceV1 import TugasAkhirServiceV1
from backend.repositories.v1.TugasAkhirRepositoriesV1 import TugasAkhirRepositoriesV1
from backend.request.v1.ScrapeSerperRequestV1 import ScrapeSerperRequestV1
from backend.response.v1.ScrapeSerperResponseV1 import ScrapeSerperResponseV1
from backend.request.v1.ListDatasetRequestV1 import ListDatasetRequestV1
from backend.response.v1.ListDatasetResponseV1 import ListDatasetResponseV1
from backend.response.v1.DetailDatasetResponseV1 import DetailDatasetResponseV1

class TugasAkhirServiceImplV1(TugasAkhirServiceV1):

    def __init__(self):
        self.repository = TugasAkhirRepositoriesV1()

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

        response = self.responsesSerper(data)
        return response

    def getListDataset(self, request: ListDatasetRequestV1) -> dict:
        """Get list of datasets from repository with metadata"""
        repo_response = self.repository.getListDataset(
            request.is_legal,
            request.limit_data,
            request.page
        )

        # Extract data and metadata
        data_list = repo_response['data']
        total_count = repo_response['total_count']
        has_more = repo_response['has_more']
        current_page = repo_response.get('current_page', request.page)

        # Transform list of dicts to list of DTOs
        transformed_data = [self.responsesListDataset(item) for item in data_list]

        # Calculate pagination metadata
        returned_count = len(transformed_data)
        is_first = current_page == 1 and returned_count == total_count  # True if page 1 and all data fits
        is_last = not has_more  # True if no more data available

        # Create message
        category = "legal" if request.is_legal == 1 else "ilegal"
        message = f"Successfully retrieved {returned_count} of {total_count} {category} dataset records (page {current_page})"

        # Return dict with data and metadata
        return {
            'data': transformed_data,
            'total_data': total_count,
            'has_next': has_more,
            'is_first': is_first,
            'is_last': is_last,
            'current_page': current_page,
            'message': message
        }

    def getDetailDataset(self, id: int) -> DetailDatasetResponseV1:
        """Get single dataset detail by ID"""
        data = self.repository.getDetailDataset(id)
        return self.responsesDetailDataset(data)

    def searchDataset(self, request) -> dict:
        """Search datasets with metadata"""
        repo_response = self.repository.searchDataset(
            search_query=request.search_query,
            is_legal=request.is_legal,
            limit_data=request.limit_data,
            page=request.page
        )

        # Extract data and metadata
        data_list = repo_response['data']
        total_count = repo_response['total_count']
        has_more = repo_response['has_more']
        current_page = repo_response.get('current_page', request.page)
        search_query = repo_response.get('search_query', request.search_query)

        # Transform list of dicts to list of DTOs
        transformed_data = [self.responsesListDataset(item) for item in data_list]

        # Calculate pagination metadata
        returned_count = len(transformed_data)
        is_first = current_page == 1 and returned_count == total_count
        is_last = not has_more

        # Create message
        filter_text = f" (legal only)" if request.is_legal == 1 else f" (illegal only)" if request.is_legal == 0 else ""
        message = f"Found {total_count} results for '{search_query}'{filter_text} (page {current_page})"

        # Return dict with data and metadata
        return {
            'data': transformed_data,
            'total_data': total_count,
            'has_next': has_more,
            'is_first': is_first,
            'is_last': is_last,
            'current_page': current_page,
            'message': message
        }


    def getDatasetByLink(self, link: str) -> DetailDatasetResponseV1:
        """Get single dataset detail by link URL"""
        data = self.repository.getDatasetByLink(link)
        return self.responsesDetailDataset(data)


    def responsesDetailDataset(self, entity: dict) -> DetailDatasetResponseV1:
        """Transform single dict to DetailDatasetResponseV1"""
        return DetailDatasetResponseV1(
            id=entity.get("id"),
            keyword=entity.get("keyword"),
            title=entity.get("title"),
            link=entity.get("link"),
            description=entity.get("description"),
            is_legal=entity.get("is_legal"),
            is_ilegal=entity.get("is_ilegal")
        )

    def responsesSerper(self, entity: dict) -> ScrapeSerperResponseV1:
        """
        Transform dict dari repository ke Response DTO
        """
        from backend.response.v1.ScrapeSerperResponseV1 import SerperOrganicItem

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

        response = ScrapeSerperResponseV1(
            query=entity.get("query", ""),
            total_results=entity.get("total_results", 0),
            organic=organic_items,
            csv_path=entity.get("csv_path", ""),
            message=f"Successfully crawled {entity.get('total_results', 0)} results"
        )

        return response

    def responsesListDataset(self, entity: dict) -> ListDatasetResponseV1:
        """Transform single dict to ListDatasetResponseV1"""
        return ListDatasetResponseV1(
            id=entity.get("no"),
            keyword=entity.get("keyword"),
            title=entity.get("title"),
            link=entity.get("link"),
            description=entity.get("description"),
            is_legal=entity.get("is_legal"),
            is_ilegal=entity.get("is_ilegal")
        )
