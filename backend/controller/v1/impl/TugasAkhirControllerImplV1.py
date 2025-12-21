from flask import request, jsonify
from dataclasses import asdict
from backend.controller.advices.BaseControllerImpl import BaseControllerImpl
from backend.controller.v1.TugasAkhirControllerV1 import TugasAkhirControllerV1
from backend.service.v1.impl.TugasAkhirServiceImplV1 import TugasAkhirServiceImplV1
from backend.request.v1.ScrapeSerperRequestV1 import ScrapeSerperRequestV1
from backend.request.v1.ListDatasetRequestV1 import ListDatasetRequestV1
from backend.request.v1.SearchDatasetRequestV1 import SearchDatasetRequestV1
from backend.request.v1.GetDatasetByLinkRequestV1 import GetDatasetByLinkRequestV1


from backend.utils.ResponseHelper import ResponseHelper

@BaseControllerImpl
class TugasAkhirControllerImplV1(TugasAkhirControllerV1):

    def __init__(self):
        self.service = TugasAkhirServiceImplV1()


    def getScrapeSerper(self, validation_request: ScrapeSerperRequestV1):
        try:
            service_response = self.service.getScrapeSerper(validation_request)

            final_response = ResponseHelper.create_response_list(service_response)

            return final_response
        except Exception as e:
            return jsonify({
                "success": False,
                "message": "Serper API Failed",
                "data": None,
                "errors": [{
                    "code": "SERPER_API_ERROR",
                    "title": "Serper Crawling Failed",
                    "message": str(e)
                }]
            }), 500


    def getListDataset(self, validation_request: ListDatasetRequestV1):
        service_response = self.service.getListDataset(validation_request)
        data = service_response['data']
        total_data = service_response.get('total_data')
        has_next = service_response.get('has_next', False)
        is_first = service_response.get('is_first', False)
        is_last = service_response.get('is_last', False)
        current_page = service_response.get('current_page')
        message = service_response.get('message')

        final_response = ResponseHelper.create_response_slice(
            data=data,
            total_data=total_data,
            has_next=has_next,
            is_first=is_first,
            is_last=is_last,
            current_page=current_page,
            message=message
        )

        return final_response


    def getDetailDataset(self, id: int):
        try:
            id_int = int(id)
            service_response = self.service.getDetailDataset(id_int)

            final_response = ResponseHelper.create_response_data(service_response)

            return final_response
        except ValueError:
            return jsonify({
                "success": False,
                "message": "Invalid ID format",
                "data": None,
                "errors": [{
                    "code": "INVALID_ID",
                    "title": "Invalid ID",
                    "message": f"ID must be a valid integer, got: {id}"
                }]
            }), 400
        except Exception as e:
            return jsonify({
                "success": False,
                "message": "Detail Dataset Failed",
                "data": None,
                "errors": [{
                    "code": "DETAIL_DATASET_ERROR",
                    "title": "Detail Dataset Failed",
                    "message": str(e)
                }]
            }), 500


    def getDatasetByLink(self, validation_request: GetDatasetByLinkRequestV1):
        try:
            service_response = self.service.getDatasetByLink(validation_request.link)

            final_response = ResponseHelper.create_response_data(service_response)

            return final_response
        except ValueError as ve:
            return jsonify({
                "success": False,
                "message": "Dataset Not Found",
                "data": None,
                "errors": [{
                    "code": "NOT_FOUND",
                    "title": "Dataset Not Found",
                    "message": str(ve)
                }]
            }), 404
        except Exception as e:
            return jsonify({
                "success": False,
                "message": "Get Dataset by Link Failed",
                "data": None,
                "errors": [{
                    "code": "DATASET_BY_LINK_ERROR",
                    "title": "Get Dataset by Link Failed",
                    "message": str(e)
                }]
            }), 500


    def searchDataset(self, validation_request: SearchDatasetRequestV1):
        service_response = self.service.searchDataset(validation_request)

        data = service_response['data']
        total_data = service_response.get('total_data')
        has_next = service_response.get('has_next', False)
        is_first = service_response.get('is_first', False)
        is_last = service_response.get('is_last', False)
        current_page = service_response.get('current_page')
        message = service_response.get('message')

        final_response = ResponseHelper.create_response_slice(
            data=data,
            total_data=total_data,
            has_next=has_next,
            is_first=is_first,
            is_last=is_last,
            current_page=current_page,
            message=message
        )

        return final_response
