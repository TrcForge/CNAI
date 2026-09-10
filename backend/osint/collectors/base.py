from abc import ABC, abstractmethod
from typing import Any


class OSINTCollector(ABC):

    name: str = "unknown"

    @abstractmethod
    def search(
        self,
        query: str
    ) -> list[dict[str, Any]]:
        """Collect publicly/authorized available information."""
        raise NotImplementedError