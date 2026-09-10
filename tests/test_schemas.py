from datetime import datetime, timezone

from backend.schemas.entity import Entity
from backend.schemas.relationship import Relationship
from backend.schemas.finding import InvestigationFinding


def test_entity_schema():

    entity = Entity(
        entity_id="PER-001",
        entity_type="person",
        name="Demo Person",
        source="FIR",
        confidence=0.95
    )

    assert entity.entity_id == "PER-001"
    assert entity.entity_type == "person"
    assert entity.confidence == 0.95


def test_relationship_schema():

    relationship = Relationship(
        relationship_id="REL-001",
        source_entity_id="PER-001",
        target_entity_id="PER-002",
        relationship_type="COMMUNICATED_WITH",
        source="CDR",
        confidence=0.90
    )

    assert relationship.relationship_type == "COMMUNICATED_WITH"
    assert relationship.source_entity_id == "PER-001"


def test_finding_schema():

    finding = InvestigationFinding(
        finding_id="FIND-001",
        case_id="CASE-001",
        finding_type="potential_relationship",
        description="Potential relationship identified",
        source="OSINT",
        confidence=0.85,
        created_at=datetime.now(timezone.utc)
    )

    assert finding.case_id == "CASE-001"
    assert finding.source == "OSINT"