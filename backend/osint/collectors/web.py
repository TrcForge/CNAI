from typing import Any

from backend.osint.collectors.base import OSINTCollector


class WebSearchCollector(OSINTCollector):

    name = "web_search"

    def search(
        self,
        query: str
    ) -> list[dict[str, Any]]:

        # Provider integration will be added here.
        # The collector interface stays unchanged.

        return []