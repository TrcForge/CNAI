from backend.osint.collector_manager import (
    OSINTCollectorManager,
)
from backend.osint.intelligence import (
    analyze_findings,
)


def main():

    print("=" * 70)
    print("CNAI - REAL OSINT PIPELINE TEST")
    print("=" * 70)

    queries = [
        "Linus Torvalds"
    ]

    print("\nQueries:")
    for query in queries:
        print(" -", query)

    manager = OSINTCollectorManager()

    print("\nCollecting from:")
    print(" - GitHub")
    print(" - SearXNG")

    findings = manager.search(
        queries
    )

    print(
        f"\nUnique normalized findings: "
        f"{len(findings)}"
    )

    if not findings:
        print(
            "\n⚠ No findings returned."
        )
        return

    print("\n" + "=" * 70)
    print("NORMALIZED FINDINGS")
    print("=" * 70)

    for index, finding in enumerate(
        findings[:10],
        start=1,
    ):

        print(
            f"\n[{index}] "
            f"{finding.finding_id}"
        )

        print(
            "Type       :",
            finding.finding_type.value,
        )

        print(
            "Platform   :",
            finding.platform,
        )

        print(
            "Value      :",
            finding.value,
        )

        print(
            "Source     :",
            finding.source,
        )

        print(
            "URL        :",
            finding.source_url,
        )

        print(
            "Confidence :",
            finding.confidence,
        )

    print("\n" + "=" * 70)
    print("INTELLIGENCE ANALYSIS")
    print("=" * 70)

    intelligence = analyze_findings(
        findings
    )

    relevant = 0

    for result in intelligence:

        if (
            result["assessment"]
            == "potentially_relevant"
        ):
            relevant += 1

            print(
                "\nFinding:",
                result["finding_id"],
            )

            for indicator in result[
                "indicators"
            ]:

                print(
                    "\nCategory:",
                    indicator["category"],
                )

                print(
                    "Matched:",
                    indicator[
                        "matched_terms"
                    ],
                )

                print(
                    "Explanation:",
                    indicator[
                        "explanation"
                    ],
                )

                print(
                    "Confidence:",
                    indicator[
                        "confidence"
                    ],
                )

    print(
        "\nPotentially relevant findings:",
        relevant,
    )

    print("\n" + "=" * 70)
    print("OSINT PIPELINE TEST COMPLETE")
    print("=" * 70)


if __name__ == "__main__":
    main()