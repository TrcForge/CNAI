from fastapi import APIRouter, Depends, HTTPException

from backend.dependencies import require_permission
from backend.schemas.relationship import Relationship
from security.rbac import Permission


router = APIRouter(
    prefix="/api/relationships",
    tags=["Relationships"]
)


relationships: dict[str, Relationship] = {}


@router.post(
    "",
    response_model=Relationship,
    dependencies=[
        Depends(require_permission(Permission.CREATE_CASE))
    ]
)
def create_relationship(relationship: Relationship):

    if relationship.relationship_id in relationships:
        raise HTTPException(
            status_code=409,
            detail="Relationship already exists"
        )

    relationships[relationship.relationship_id] = relationship

    return relationship


@router.get(
    "/{relationship_id}",
    response_model=Relationship,
    dependencies=[
        Depends(require_permission(Permission.VIEW_CASES))
    ]
)
def get_relationship(relationship_id: str):

    relationship = relationships.get(relationship_id)

    if relationship is None:
        raise HTTPException(
            status_code=404,
            detail="Relationship not found"
        )

    return relationship