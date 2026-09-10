from backend.osint.normalization import (
    normalize_finding,
    deduplicate_findings,
    normalize_and_deduplicate,
)


def main():

    print("=" * 60)
    print("CNAI OSINT NORMALIZATION TEST")
    print("=" * 60)

    raw_data = [
        {
            "finding_type": "web_result",
            "platform": "web",
            "value": "Example Public Page",
            "content": "Public information about an entity.",
            "source": "searxng",
            "source_url": (
                "https://example.com/page"
                "?utm_source=google"
            ),
            "confidence": 0.50,
            "query": "Example Person",
            "collector": "searxng",
        },
        {
            "finding_type": "web_result",
            "platform": "web",
            "value": "Example Public Page",
            "content": "Public information about an entity.",
            "source": "searxng",
            "source_url": (
                "https://example.com/page"
            ),
            "confidence": 0.80,
            "query": "Example Person",
            "collector": "searxng",
        },
    ]

    print("\n[1] Testing normalization...")

    finding = normalize_finding(
        raw_data[0]
    )

    print("Finding ID :", finding.finding_id)
    print("Type       :", finding.finding_type.value)
    print("Platform   :", finding.platform)
    print("Value      :", finding.value)
    print("URL        :", finding.source_url)
    print("Confidence :", finding.confidence)
    print("Normalized :", finding.metadata["normalized"])

    print("\n[2] Testing deduplication...")

    findings = [
        normalize_finding(item)
        for item in raw_data
    ]

    print(
        "Before:",
        len(findings)
    )

    unique = deduplicate_findings(
        findings
    )

    print(
        "After:",
        len(unique)
    )

    if len(unique) == 1:
        print("✅ Deduplication successful")

    else:
        print("❌ Deduplication failed")

    print("\n[3] Testing complete pipeline...")

    final_results = normalize_and_deduplicate(
        raw_data
    )

    print(
        "Final findings:",
        len(final_results)
    )

    print("\n" + "=" * 60)
    print("NORMALIZATION + DEDUPLICATION COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    main()