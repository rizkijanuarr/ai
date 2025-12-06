from typing import List, TypeVar, Any
from backend.response.advices.DataResponseParameter import DataResponseParameter
from backend.response.advices.ListResponseParameter import ListResponseParameter

T = TypeVar('T')

class ResponseHelper:
    
    @staticmethod
    def create_response_data(data: T) -> DataResponseParameter[T]:
        return DataResponseParameter(data=data)

    @staticmethod
    def create_response_list(data: List[T]) -> ListResponseParameter[T]:
        return ListResponseParameter(data=data)