from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class CaseCreate(BaseModel):
    case_id: str = Field(min_length=1)
    title: str = Field(min_length=1)
    description: Optional[str] = None


class CaseResponse(BaseModel):
    case_id: str
    title: str
    description: Optional[str] = None
    status: str
    created_at: datetime