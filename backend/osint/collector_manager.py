from backend.osint.collectors.github import GitHubCollector
from backend.osint.collectors.web import WebSearchCollector


class OSINTCollectorManager:

    def __init__(self):

        self.collectors = [
            GitHubCollector(),
            WebSearchCollector(),
        ]

    def search(
        self,
        queries: list[str]
    ) -> list[dict]:

        results = []

        for query in queries:

            for collector in self.collectors:

                try:

                    findings = collector.search(query)

                    for finding in findings:

                        finding["query"] = query
                        finding["collector"] = (
                            collector.name
                        )

                    results.extend(findings)

                except Exception as error:

                    print(
                        f"[OSINT] "
                        f"{collector.name} "
                        f"failed for '{query}': "
                        f"{error}"
                    )

        return results