from backend.osint.collectors.web import WebSearchCollector


def main():
    print("=" * 60)
    print("CNAI - SEARXNG OSINT COLLECTOR TEST")
    print("=" * 60)

    query = "Rashtriya Raksha University"

    print(f"\nSearching for: {query}")
    print("Connecting to SearXNG...")

    collector = WebSearchCollector()

    try:
        results = collector.search(query)

    except Exception as error:
        print("\n❌ SearXNG connection/search failed")
        print(f"Error: {error}")

        print("\nCheck:")
        print("1. Docker is running")
        print("2. searxng-core container is Up")
        print("3. SearXNG is available at http://localhost:8888")
        print("4. JSON format is enabled")

        return

    print("\n✅ SearXNG connection successful")
    print(f"Results found: {len(results)}")

    if not results:
        print("\n⚠ No results returned.")
        return

    print("\n" + "=" * 60)
    print("SEARCH RESULTS")
    print("=" * 60)

    for index, result in enumerate(results[:10], start=1):

        print(f"\n--- Result {index} ---")

        print(f"Type       : {result.get('finding_type')}")
        print(f"Platform   : {result.get('platform')}")
        print(f"Title      : {result.get('value')}")
        print(f"Source     : {result.get('source')}")
        print(f"URL        : {result.get('source_url')}")
        print(f"Confidence : {result.get('confidence')}")

        content = result.get("content")

        if content:
            print(f"Content    : {content[:500]}")
        else:
            print("Content    : No description available")

    print("\n" + "=" * 60)
    print("SEARXNG OSINT TEST COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    main()