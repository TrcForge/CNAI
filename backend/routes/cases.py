from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException

from backend.dependencies import require_permission
from backend.schemas.case import CaseCreate, CaseResponse
from security.rbac import Permission


router = APIRouter(
    prefix="/api/cases",
    tags=["Cases"]
)


# Temporary development storage.
# This will later be replaced by persistent database/Neo4j storage.
cases: dict[str, CaseResponse] = {}


@router.post(
    "",
    response_model=CaseResponse,
    dependencies=[
        Depends(require_permission(Permission.CREATE_CASE))
    ]
)
def create_case(case: CaseCreate):

    if case.case_id in cases:
        raise HTTPException(
            status_code=409,
            detail="Case already exists"
        )

    new_case = CaseResponse(
        case_id=case.case_id,
        title=case.title,
        description=case.description,
        status="open",
        created_at=datetime.now(timezone.utc)
    )

    cases[case.case_id] = new_case

    return new_case


@router.get(
    "/{case_id}",
    response_model=CaseResponse,
    dependencies=[
        Depends(require_permission(Permission.VIEW_CASES))
    ]
)
def get_case(case_id: str):

    case = cases.get(case_id)

    if case is None:
        raise HTTPException(
            status_code=404,
            detail="Case not found"
        )

    return case