from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class APIResponse(BaseModel):
    success: bool
    message: str
    timestamp: datetime
    data: Optional[dict] = None