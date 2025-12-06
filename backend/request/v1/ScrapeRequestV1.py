from dataclasses import dataclass

@dataclass
class ScrapeRequestV1:
    url: str

    def __post_init__(self):
        if not self.url:
            raise ValueError("url is required and cannot be empty")
