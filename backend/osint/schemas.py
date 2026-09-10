from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


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

    mentioned_entities: list[str] = Field(default_factory=list)

    related_event: str | None = None

    confidence: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0
    )

    verification_status: str = "unverified"

    metadata: dict[str, Any] = Field(default_factory=dict)

class OSINTIntelligenceResult(BaseModel):
    finding_id: str

    assessment: str

    indicators: list[dict[str, Any]] = Field(
        default_factory=list
    )

    review_required: bool = False

class OSINTSearchResponse(BaseModel):
    query_name: str | None = None

    query_mobile: str | None = None

    findings: list[OSINTFinding] = Field(
        default_factory=list
    )

    potential_entity_matches: list[EntityMatch] = Field(
        default_factory=list
    )

    intelligence: list[OSINTIntelligenceResult] = Field(
        default_factory=list
    )

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

    metadata: dict[str, Any] = Field(default_factory=dict)


class OSINTPost(BaseModel):
    post_id: str

    platform: str

    author: str | None = None
    author_entity_id: str | None = None

    content: str

    posted_at: datetime | None = None

    location: str | None = None

    hashtags: list[str] = Field(default_factory=list)

    mentions: list[str] = Field(default_factory=list)

    links: list[str] = Field(default_factory=list)

    source_url: str | None = None

    source: str

    confidence: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0
    )

    verification_status: str = "unverified"

    metadata: dict[str, Any] = Field(default_factory=dict)


class OSINTComment(BaseModel):
    comment_id: str

    post_id: str

    platform: str

    author: str | None = None
    author_entity_id: str | None = None

    content: str

    commented_at: datetime | None = None

    mentions: list[str] = Field(default_factory=list)

    source_url: str | None = None

    source: str

    confidence: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0
    )

    verification_status: str = "unverified"

    metadata: dict[str, Any] = Field(default_factory=dict)


class EntityMatch(BaseModel):
    entity_id: str

    matched_name: str | None = None

    name_similarity: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0
    )

    mobile_match: bool = False

    confidence: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0
    )

    reason: str

    verification_status: str = "review_required"


class OSINTRelationship(BaseModel):
    relationship_id: str

    source_entity_id: str

    target_value: str

    relationship_type: str

    confidence: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0
    )

    source: str

    source_finding_id: str

    reason: str

    verification_status: str = "review_required"


class OSINTSearchResponse(BaseModel):
    query_name: str | None = None

    query_mobile: str | None = None

    findings: list[OSINTFinding] = Field(
        default_factory=list
    )

    potential_entity_matches: list[EntityMatch] = Field(
        default_factory=list
    )