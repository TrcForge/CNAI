from fastapi import APIRouter, Depends

from backend.dependencies import require_permission
from backend.osint.schemas import (
    OSINTSearchRequest,
    OSINTSearchResponse,
)
from backend.osint.service import search_osint
from security.rbac import Permission

from backend.osint.relationship_detection import (
    detect_osint_relationships
)
from backend.osint.schemas import (
    OSINTSearchRequest,
    OSINTSearchResponse,
    OSINTRelationshipResponse,
    OSINTFinding,
)


router = APIRouter(
    prefix="/api/osint",
    tags=["OSINT"]
)


@router.post(
    "/search",
    response_model=OSINTSearchResponse,
    dependencies=[
        Depends(
            require_permission(
                Permission.VIEW_ANALYTICS
            )
        )
    ]
)
def osint_search(request: OSINTSearchRequest):

    return search_osint(request)

@router.post(
    "/relationships",
    response_model=OSINTRelationshipResponse,
    dependencies=[
        Depends(
            require_permission(
                Permission.VIEW_ANALYTICS
            )
        )
    ]
)
def detect_relationships(
    entity_id: str,
    findings: list[OSINTFinding]
):

    relationships = detect_osint_relationships(
        entity_id,
        findings
    )

    return OSINTRelationshipResponse(
        entity_id=entity_id,
        relationships=relationships
    )