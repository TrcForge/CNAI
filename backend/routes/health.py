from datetime import datetime, timezone

from fastapi import APIRouter

from backend.schemas.common import APIResponse


router = APIRouter(
    prefix="/api",
    tags=["System"]
)


@router.get("/health", response_model=APIResponse)
def health_check():
    return APIResponse(
        success=True,
        message="CNAI API is healthy",
        timestamp=datetime.now(timezone.utc),
        data={
            "service": "Criminal Network Intelligence System",
            "version": "1.0.0"
        }
    )