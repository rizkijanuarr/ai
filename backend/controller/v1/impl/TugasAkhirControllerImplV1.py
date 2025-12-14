from flask import request, jsonify
from dataclasses import asdict
from backend.controller.advices.BaseControllerImpl import BaseControllerImpl
from backend.controller.v1.TugasAkhirControllerV1 import TugasAkhirControllerV1
from backend.service.v1.impl.TugasAkhirServiceImplV1 import TugasAkhirServiceImplV1
from backend.request.v1.ScrapeRequestV1 import ScrapeRequestV1
from backend.utils.Exceptions import ScrapingFailedException

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