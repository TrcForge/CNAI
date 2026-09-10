from typing import Any

import httpx

from backend.osint.collectors.base import OSINTCollector


class WebSearchCollector(OSINTCollector):

    name = "searxng"

    BASE_URL = "http://localhost:8888/search"

    def search(self, query: str) -> list[dict[str, Any]]:

        params = {
            "q": query,
            "format": "json",
            "language": "en",
            "safesearch": 1,
        }

        response = httpx.get(
            self.BASE_URL,
            params=params,
            timeout=15,
        )

        response.raise_for_status()

        data = response.json()

        findings = []

        for result in data.get("results", []):

            title = result.get("title", "")
            url = result.get("url")

            if not title or not url:
                continue

            findings.append(
                {
                    "finding_type": "web_result",

                    "platform": "web",

                    "value": title,

                    "content": result.get("content"),

                    "source": "searxng",

                    "source_url": url,

                    "confidence": 0.50,

                    "metadata": {
                        "engine": result.get("engine"),
                        "category": result.get("category"),
                        "template": result.get("template"),
                    },
                }
            )

        return findings