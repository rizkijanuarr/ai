from flask import request, jsonify
from dataclasses import asdict
from backend.controller.advices.BaseControllerImpl import BaseControllerImpl
from backend.controller.v1.TugasAkhirControllerV1 import TugasAkhirControllerV1
from backend.service.v1.impl.TugasAkhirServiceImplV1 import TugasAkhirServiceImplV1
from backend.request.v1.ScrapeRequestV1 import ScrapeRequestV1
from backend.utils.Exceptions import ScrapingFailedException
from backend.request.v1.ScrapeSerperRequestV1 import ScrapeSerperRequestV1

from backend.utils.ResponseHelper import ResponseHelper

@BaseControllerImpl
class TugasAkhirControllerImplV1(TugasAkhirControllerV1):

    def __init__(self):
        self.service = TugasAkhirServiceImplV1()

    def getScrapeUrl(self, validation_request: ScrapeRequestV1):
        try:
            return ResponseHelper.create_response_data(
                self.service.getScrapeUrl(validation_request)
            )
        except ScrapingFailedException as e:
            # Return HTTP 422 Unprocessable Entity
            return jsonify({
                "success": False,
                "message": "Scraping Failed - Cannot analyze content",
                "data": None,
                "errors": [{
                    "code": "SCRAPING_FAILED",
                    "title": "Content Scraping Failed",
                    "message": e.message,
                    "url": e.url
                }]
            }), 422


    def getScrapeSerper(self, validation_request: ScrapeSerperRequestV1):
        try:
            print(f"[CONTROLLER DEBUG] Received request: {validation_request}")
            service_response = self.service.getScrapeSerper(validation_request)
            print(f"[CONTROLLER DEBUG] Service response: {service_response}")

            final_response = ResponseHelper.create_response_list(service_response)
            print(f"[CONTROLLER DEBUG] Final response: {final_response}")

            return final_response
        except Exception as e:
            import traceback
            print(f"[CONTROLLER ERROR] Exception caught: {e}")
            print(f"[CONTROLLER ERROR] Traceback: {traceback.format_exc()}")
            # Return HTTP 500 untuk error umum
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
