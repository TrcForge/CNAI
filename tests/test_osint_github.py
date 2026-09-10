from backend.osint.collectors.github import GitHubCollector


def main():

    collector = GitHubCollector()

    results = collector.search("torvalds")

    print("\nGitHub OSINT RESULTS")
    print("=" * 60)

    for result in results:

        print("Type:", result["finding_type"])
        print("Value:", result["value"])
        print("Source:", result["source"])
        print("URL:", result["source_url"])
        print("Confidence:", result["confidence"])
        print("-" * 60)


if __name__ == "__main__":
    main()