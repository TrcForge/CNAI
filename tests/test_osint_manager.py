from backend.osint.collector_manager import (
    OSINTCollectorManager
)

from backend.osint.query_generator import (
    generate_queries
)

from backend.osint.schemas import (
    OSINTSearchRequest
)


def main():

    request = OSINTSearchRequest(
        name="torvalds"
    )

    queries = generate_queries(request)

    manager = OSINTCollectorManager()

    results = manager.search(queries)

    print("\nMULTI-SOURCE OSINT RESULTS")
    print("=" * 60)

    for result in results:

        print("Source:", result.get("source"))
        print("Type:", result.get("finding_type"))
        print("Value:", result.get("value"))
        print("URL:", result.get("source_url"))
        print("Query:", result.get("query"))
        print("-" * 60)


if __name__ == "__main__":
    main()