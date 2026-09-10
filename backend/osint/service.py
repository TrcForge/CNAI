from datetime import datetime, timezone

from backend.osint.schemas import (
    OSINTFinding,
    OSINTSearchRequest,
    OSINTSearchResponse,
)
from backend.osint.resolution import (
    calculate_name_similarity,
    mobile_matches,
)

DEMO_ENTITIES = [
    {
        "entity_id": "PER-001",
        "name": "Rahul Sharma",
        "mobile": "9999999999",
    },
    {
        "entity_id": "PER-002",
        "name": "Rohit Sharma",
        "mobile": "8888888888",
    },
    {
        "entity_id": "PER-003",
        "name": "Sameer Khan",
        "mobile": "7777777777",
    },
]


DEMO_OSINT_DATA = [
    {
        "name": "Rahul Sharma",
        "mobile": "9999999999",
        "finding_type": "social_account",
        "value": "@rahul_demo",
        "source": "public_osint_demo",
        "confidence": 0.82,
    },
    {
        "name": "Rahul Sharma",
        "mobile": "9999999999",
        "finding_type": "organization",
        "value": "Demo Technologies",
        "source": "public_osint_demo",
        "confidence": 0.76,
    },
    {
        "name": "Rahul Sharma",
        "mobile": "9999999999",
        "finding_type": "public_location",
        "value": "Ahmedabad",
        "source": "public_osint_demo",
        "confidence": 0.71,
    },
]


def search_osint(request: OSINTSearchRequest):

    if not request.name and not request.mobile:
        return OSINTSearchResponse(
            query_name=request.name,
            query_mobile=request.mobile,
            findings=[]
        )

    findings = []

    for index, record in enumerate(DEMO_OSINT_DATA, start=1):

        name_match = (
            request.name
            and record["name"].lower()
            == request.name.lower()
        )

        mobile_match = (
            request.mobile
            and record["mobile"]
            == request.mobile
        )

        if name_match or mobile_match:

            findings.append(
                OSINTFinding(
                    finding_id=f"OSINT-{index:03d}",
                    entity_id=None,
                    finding_type=record["finding_type"],
                    value=record["value"],
                    source=record["source"],
                    confidence=record["confidence"],
                    verification_status="unverified",
                    observed_at=datetime.now(timezone.utc),
                    metadata={
                        "matched_by": (
                            "name"
                            if name_match
                            else "mobile"
                        )
                    }
                )
            )

    return OSINTSearchResponse(
    query_name=request.name,
    query_mobile=request.mobile,
    findings=findings,
    potential_entity_matches=resolve_entities(request)
)

def resolve_entities(request: OSINTSearchRequest):

    matches = []

    for entity in DEMO_ENTITIES:

        reasons = []

        name_score = 0.0

        if request.name:

            name_score = calculate_name_similarity(
                request.name,
                entity["name"]
            )

            if name_score >= 0.80:
                reasons.append(
                    f"name similarity: {name_score:.2f}"
                )

        if request.mobile:

            if mobile_matches(
                request.mobile,
                entity["mobile"]
            ):
                reasons.append("mobile number match")

        if not reasons:
            continue

        score = name_score

        if "mobile number match" in reasons:
            score = max(score, 1.0)

        matches.append(
            {
                "entity_id": entity["entity_id"],
                "similarity_score": round(score, 2),
                "match_reasons": reasons,
                "verification_status": "review_required",
            }
        )

    return matches