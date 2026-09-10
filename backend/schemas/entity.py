from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class Entity(BaseModel):
    entity_id: str = Field(min_length=1)
    entity_type: str = Field(min_length=1)
    name: str | None = None

    source: str = Field(min_length=1)
    source_record: str | None = None

    confidence: float = Field(
        default=1.0,
        ge=0.0,
        le=1.0
    )

    verification_status: str = "unverified"

    observed_at: datetime | None = None

    metadata: dict[str, Any] = {}