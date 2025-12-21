from backend.controller.advices.BaseController import BaseController
from backend.annotations.method.GetEndpoint import GetEndpoint
from backend.annotations.method.SwaggerTypeGroup import SwaggerTypeGroup
from backend.response.advices.DataResponseParameter import DataResponseParameter
from abc import ABC, abstractmethod


@BaseController(value="/api/v1")
class EvaluationControllerV1(ABC):

    @GetEndpoint(
        value="/evaluation-metrics",
        tagName="Evaluation",
        description="Get Model Evaluation Metrics (Confusion Matrix, K-Fold, etc)",
        group=SwaggerTypeGroup.APPS_WEB
    )
    @abstractmethod
    def getEvaluationMetrics(self) -> DataResponseParameter:
        pass
