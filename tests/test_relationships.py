from datetime import datetime, timezone

from backend.schemas.relationship import Relationship


def test_relationship_schema():

    relationship = Relationship(
        relationship_id="REL-001",
        source_entity_id="PER-001",
        target_entity_id="PER-002",
        relationship_type="COMMUNICATED_WITH",
        confidence=0.90,
        source="CDR",
        source_record="CDR-001",
        observed_at=datetime.now(timezone.utc),
        verification_status="unverified"
    )

    assert relationship.relationship_id == "REL-001"
    assert relationship.source_entity_id == "PER-001"
    assert relationship.target_entity_id == "PER-002"
    assert relationship.relationship_type == "COMMUNICATED_WITH"
    assert relationship.confidence == 0.90