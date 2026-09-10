from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class InvestigationFinding(BaseModel):
    finding_id: str = Field(min_length=1)

    case_id: str = Field(min_length=1)

    finding_type: str = Field(min_length=1)

    description: str = Field(min_length=1)

    source: str = Field(min_length=1)
    source_record: str | None = None

    confidence: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0
    )

    verification_status: str = "unverified"

    created_at: datetime

    metadata: dict[str, Any] = {}