from backend.osint.collectors.github import GitHubCollector
from backend.osint.collectors.web import WebSearchCollector
from backend.osint.normalization import normalize_and_deduplicate


class OSINTCollectorManager:

    def __init__(self):

        self.collectors = [
            GitHubCollector(),
            WebSearchCollector(),
        ]

    def search(
        self,
        queries: list[str],
    ) -> list:

        raw_results = []

        for query in queries:

            for collector in self.collectors:

                try:

                    findings = collector.search(query)

                    for finding in findings:

                        finding["query"] = query
                        finding["collector"] = (
                            collector.name
                        )

                    raw_results.extend(
                        findings
                    )

                except Exception as error:

                    print(
                        f"[OSINT] "
                        f"{collector.name} failed "
                        f"for '{query}': {error}"
                    )

        # Normalize + deduplicate all
        # sources together.
        clean_results = (
            normalize_and_deduplicate(
                raw_results
            )
        )

        return clean_results