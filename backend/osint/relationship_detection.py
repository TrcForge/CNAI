from backend.osint.schemas import (
    OSINTRelationship,
    OSINTFinding,
)


def detect_osint_relationships(
    entity_id: str,
    findings: list[OSINTFinding]
):

    relationships = []

    relationship_mapping = {
        "social_account": "HAS_SOCIAL_ACCOUNT",
        "organization": "ASSOCIATED_WITH",
        "public_location": "LOCATED_IN",
    }

    for finding in findings:

        relationship_type = relationship_mapping.get(
            finding.finding_type
        )

        if not relationship_type:
            continue

        if finding.confidence < 0.50:
            continue

        reason = (
            f"OSINT finding '{finding.finding_type}' "
            f"identified from {finding.source}"
        )

        relationship = OSINTRelationship(
            relationship_id=(
                f"OSINT-REL-{finding.finding_id}"
            ),
            source_entity_id=entity_id,
            target_value=finding.value,
            relationship_type=relationship_type,
            confidence=finding.confidence,
            source=finding.source,
            source_finding_id=finding.finding_id,
            reason=reason,
            verification_status="review_required",
        )

        relationships.append(relationship)

    return relationships