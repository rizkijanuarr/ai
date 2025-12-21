from backend.controller.advices.BaseControllerImpl import BaseControllerImpl
from backend.controller.v1.EvaluationControllerV1 import EvaluationControllerV1
from backend.repositories.v1.TugasAkhirRepositoriesV1 import TugasAkhirRepositoriesV1
from backend.service.v1.EvaluationServiceV1 import EvaluationServiceV1
from backend.utils.ResponseHelper import ResponseHelper


@BaseControllerImpl
class EvaluationControllerImplV1(EvaluationControllerV1):

    def __init__(self):
        self.repository = TugasAkhirRepositoriesV1()
        self.evaluation_service = EvaluationServiceV1()


    def getEvaluationMetrics(self):
        """
        Get complete evaluation metrics for the entire dataset

        Returns:
            DataResponseParameter with evaluation metrics
        """
        # Load all data from merged CSV
        import csv
        import os

        # Get project root (go up 4 levels from this file)
        project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))))
        csv_file = os.path.join(
            project_root,
            'output/data/crawl_serper/ALL_DATA_COMBINED_MERGED.csv'
        )

        # Read all data
        all_data = []
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                all_data.append({
                    'no': int(row['No']),
                    'keyword': row['Keyword'],
                    'title': row['Title'],
                    'link': row['Link'],
                    'description': row['Description'],
                    'is_legal': int(row['is_legal']),
                    'is_ilegal': int(row['is_ilegal'])
                })

        # Get full evaluation
        evaluation_result = self.evaluation_service.get_full_evaluation(all_data)

        # Return response
        return ResponseHelper.create_response_data(evaluation_result)
