from fastapi import APIRouter, Depends, HTTPException

from backend.dependencies import require_permission
from backend.schemas.entity import Entity
from security.rbac import Permission


router = APIRouter(
    prefix="/api/entities",
    tags=["Entities"]
)


# Temporary development storage.
# Later this will be replaced by Neo4j/database storage.
entities: dict[str, Entity] = {}


@router.post(
    "",
    response_model=Entity,
    dependencies=[
        Depends(require_permission(Permission.CREATE_CASE))
    ]
)
def create_entity(entity: Entity):

    if entity.entity_id in entities:
        raise HTTPException(
            status_code=409,
            detail="Entity already exists"
        )

    entities[entity.entity_id] = entity

    return entity


@router.get(
    "/{entity_id}",
    response_model=Entity,
    dependencies=[
        Depends(require_permission(Permission.VIEW_CASES))
    ]
)
def get_entity(entity_id: str):

    entity = entities.get(entity_id)

    if entity is None:
        raise HTTPException(
            status_code=404,
            detail="Entity not found"
        )

    return entity