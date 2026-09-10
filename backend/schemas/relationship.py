from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class Relationship(BaseModel):
    relationship_id: str = Field(min_length=1)
    source_entity_id: str = Field(min_length=1)
    target_entity_id: str = Field(min_length=1)

    relationship_type: str = Field(min_length=1)

    confidence: float = Field(default=0.0, ge=0.0, le=1.0)

    source: str = Field(min_length=1)
    source_record: str | None = None

    observed_at: datetime | None = None

    verification_status: str = "unverified"

    evidence_id: str | None = None

    metadata: dict[str, Any] = {}