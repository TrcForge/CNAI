from backend.osint.schemas import OSINTFinding, OSINTRelationship


RELATIONSHIP_MAPPING = {
    "profile": "HAS_PUBLIC_PROFILE",
    "organization": "ASSOCIATED_WITH_ORGANIZATION",
    "location": "PUBLICLY_ASSOCIATED_WITH_LOCATION",
    "event": "MENTIONED_IN_EVENT",
    "mention": "MENTIONED",
    "username": "USES_USERNAME",
    "link": "LINKED_TO",
    "media": "ASSOCIATED_WITH_MEDIA",
}


def detect_osint_relationships(
    entity_id: str,
    findings: list[OSINTFinding],
) -> list[OSINTRelationship]:

    relationships = []

    for finding in findings:

        finding_type = finding.finding_type.value

        relationship_type = RELATIONSHIP_MAPPING.get(
            finding_type
        )

        if not relationship_type:
            continue

        if finding.confidence < 0.50:
            continue

        relationship = OSINTRelationship(
            relationship_id=f"OSINT-REL-{finding.finding_id}",
            source_entity_id=entity_id,
            target_value=finding.value,
            relationship_type=relationship_type,
            confidence=finding.confidence,
            source=finding.source,
            source_finding_id=finding.finding_id,
            reason=(
                f"Public OSINT finding of type "
                f"'{finding_type}' was collected from "
                f"{finding.source}."
            ),
            verification_status="review_required",
        )

        relationships.append(relationship)

    return relationships