import hashlib
from urllib.parse import urlsplit, urlunsplit

from backend.osint.schemas import OSINTFinding, OSINTFindingType
from datetime import datetime, timezone

def normalize_text(value: str | None) -> str:
    if not value:
        return ""

    return " ".join(value.strip().split())


def normalize_url(url: str | None) -> str | None:
    if not url:
        return None

    try:
        from urllib.parse import (
            parse_qsl,
            urlencode,
            urlsplit,
            urlunsplit,
        )

        parts = urlsplit(url.strip())

        tracking_parameters = {
            "utm_source",
            "utm_medium",
            "utm_campaign",
            "utm_term",
            "utm_content",
            "fbclid",
            "gclid",
            "ref",
            "source",
        }

        clean_parameters = [
            (key, value)
            for key, value in parse_qsl(
                parts.query,
                keep_blank_values=True,
            )
            if key.lower() not in tracking_parameters
        ]

        clean_query = urlencode(
            clean_parameters
        )

        return urlunsplit(
            (
                parts.scheme.lower(),
                parts.netloc.lower(),
                parts.path.rstrip("/") or "/",
                clean_query,
                "",
            )
        )

    except ValueError:
        return url.strip()

def generate_finding_id(
    source: str,
    finding_type: str,
    value: str,
    source_url: str | None,
) -> str:

    raw = "|".join(
        [
            source,
            finding_type,
            normalize_text(value).lower(),
            normalize_url(source_url) or "",
        ]
    )

    digest = hashlib.sha256(
        raw.encode("utf-8")
    ).hexdigest()[:16]

    return f"OSINT-{digest}"


def normalize_finding(
    raw_finding: dict,
) -> OSINTFinding:

    finding_type = raw_finding.get(
        "finding_type",
        "web_result",
    )

    try:
        finding_type = OSINTFindingType(
            finding_type
        )
    except ValueError:
        finding_type = OSINTFindingType.WEB_RESULT

    source = raw_finding.get(
        "source",
        "unknown",
    )

    value = normalize_text(
        raw_finding.get("value")
    )

    content = normalize_text(
        raw_finding.get("content")
    )

    source_url = normalize_url(
        raw_finding.get("source_url")
    )

    metadata = dict(
        raw_finding.get("metadata") or {}
    )

    if raw_finding.get("query"):
        metadata["query"] = raw_finding["query"]

    if raw_finding.get("collector"):
        metadata["collector"] = raw_finding["collector"]

    metadata["normalized"] = True

    finding_id = generate_finding_id(
        source=source,
        finding_type=finding_type.value,
        value=value,
        source_url=source_url,
    )

    return OSINTFinding(
        finding_id=finding_id,
        entity_id=raw_finding.get("entity_id"),
        finding_type=finding_type,
        platform=raw_finding.get("platform"),
        value=value,
        content=content or None,
        author=raw_finding.get("author"),
        author_entity_id=raw_finding.get(
            "author_entity_id"
        ),
        source=source,
        source_url=source_url,
        source_record=raw_finding.get(
            "source_record"
        ),
        observed_at=raw_finding.get(
            "observed_at"
        ) or datetime.now(timezone.utc),
        location=raw_finding.get(
            "location"
        ),
        mentioned_entities=raw_finding.get(
            "mentioned_entities",
            [],
        ),
        related_event=raw_finding.get(
            "related_event"
        ),
        confidence=raw_finding.get(
            "confidence",
            0.0,
        ),
        verification_status=raw_finding.get(
            "verification_status",
            "unverified",
        ),
        metadata=metadata,
    )


def deduplicate_findings(
    findings: list[OSINTFinding],
) -> list[OSINTFinding]:

    unique = {}

    for finding in findings:

        if finding.source_url:

            key = (
                "url",
                normalize_url(
                    finding.source_url
                ),
            )

        else:

            raw_key = "|".join(
                [
                    finding.finding_type.value,
                    normalize_text(
                        finding.value
                    ).lower(),
                    normalize_text(
                        finding.content
                    ).lower(),
                ]
            )

            key = (
                "content",
                hashlib.sha256(
                    raw_key.encode("utf-8")
                ).hexdigest(),
            )

        if key not in unique:

            unique[key] = finding

        else:

            # Keep the finding having
            # the higher confidence.
            if (
                finding.confidence
                > unique[key].confidence
            ):
                unique[key] = finding

    return list(unique.values())


def normalize_and_deduplicate(
    raw_findings: list[dict],
) -> list[OSINTFinding]:

    normalized = []

    for raw_finding in raw_findings:

        try:

            finding = normalize_finding(
                raw_finding
            )

            normalized.append(finding)

        except Exception as error:

            print(
                f"[OSINT] Normalization failed: "
                f"{error}"
            )

    return deduplicate_findings(
        normalized
    )