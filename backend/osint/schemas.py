from datetime import datetime

from pydantic import BaseModel, Field
from enum import Enum

class OSINTSearchRequest(BaseModel):
    name: str | None = None
    mobile: str | None = None

    source: str = "public_osint"


class OSINTFinding(BaseModel):

    finding_id: str

    entity_id: str | None = None

    finding_type: OSINTFindingType

    platform: str | None = None

    value: str

    content: str | None = None

    author: str | None = None

    author_entity_id: str | None = None

    source: str
    source_url: str | None = None
    source_record: str | None = None

    observed_at: datetime

    location: str | None = None

    mentioned_entities: list[str] = []

    related_event: str | None = None

    confidence: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0
    )

    verification_status: str = "unverified"

    metadata: dict = {}

class OSINTEvent(BaseModel):

    event_id: str

    name: str

    date: datetime | None = None

    location: str | None = None

    organizer: str | None = None

    source: str

    source_url: str | None = None

    confidence: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0
    )

    verification_status: str = "review_required"

    metadata: dict = {}

class OSINTComment(BaseModel):

    comment_id: str

    post_id: str

    platform: str

    author: str | None = None

    author_entity_id: str | None = None

    content: str

    commented_at: datetime | None = None

    mentions: list[str] = []

    source_url: str | None = None

    source: str

    confidence: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0
    )

    verification_status: str = "unverified"

    metadata: dict = {}

class OSINTSearchResponse(BaseModel):
    query_name: str | None = None
    query_mobile: str | None = None

    findings: list[OSINTFinding]

    potential_entity_matches: list[EntityMatch] = []

class EntityMatch(BaseModel):
    entity_id: str

    similarity_score: float = Field(
        ge=0.0,
        le=1.0
    )

    match_reasons: list[str]

    verification_status: str = "review_required"

class OSINTRelationship(BaseModel):
    relationship_id: str

    source_entity_id: str
    target_value: str

    relationship_type: str

    confidence: float = Field(
        ge=0.0,
        le=1.0
    )

    source: str
    source_finding_id: str

    reason: str

    verification_status: str = "review_required"


class OSINTRelationshipResponse(BaseModel):
    entity_id: str

    relationships: list[OSINTRelationship]

class OSINTFindingType(str, Enum):
    PROFILE = "profile"
    POST = "post"
    COMMENT = "comment"
    EVENT = "event"
    MENTION = "mention"
    LOCATION = "location"
    ORGANIZATION = "organization"
    USERNAME = "username"
    LINK = "link"
    MEDIA = "media"
    WEB_RESULT = "web_result"

class OSINTPost(BaseModel):

    post_id: str

    platform: str

    author: str | None = None

    author_entity_id: str | None = None

    content: str

    posted_at: datetime | None = None

    location: str | None = None

    hashtags: list[str] = []

    mentions: list[str] = []

    links: list[str] = []

    source_url: str | None = None

    source: str

    confidence: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0
    )

    verification_status: str = "unverified"

    metadata: dict = {}