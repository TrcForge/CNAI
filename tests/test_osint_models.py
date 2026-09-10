from datetime import datetime, timezone

from backend.osint.schemas import (
    OSINTFinding,
    OSINTFindingType,
    OSINTEvent,
    OSINTPost,
    OSINTComment,
)


def main():

    now = datetime.now(timezone.utc)

    finding = OSINTFinding(
        finding_id="OSINT-001",
        finding_type=OSINTFindingType.POST,
        platform="public_social",
        value="POST-001",
        content=(
            "Attending ABC Conference "
            "in Ahmedabad."
        ),
        author="Rahul Sharma",
        source="public_osint_demo",
        source_url="https://example.com/post/001",
        observed_at=now,
        location="Ahmedabad",
        mentioned_entities=["ABC Conference"],
        confidence=0.82,
    )

    event = OSINTEvent(
        event_id="EVENT-001",
        name="ABC Conference",
        date=now,
        location="Ahmedabad",
        organizer="ABC Organization",
        source="public_osint_demo",
        confidence=0.80,
    )

    post = OSINTPost(
        post_id="POST-001",
        platform="public_social",
        author="Rahul Sharma",
        content="Attending ABC Conference.",
        posted_at=now,
        location="Ahmedabad",
        hashtags=["#conference"],
        mentions=["@abc"],
        links=[],
        source="public_osint_demo",
        confidence=0.82,
    )

    comment = OSINTComment(
        comment_id="COMMENT-001",
        post_id="POST-001",
        platform="public_social",
        author="Sameer Khan",
        content="See you there.",
        commented_at=now,
        source="public_osint_demo",
        confidence=0.70,
    )

    print("OSINT MODELS TEST")
    print("=" * 60)

    print("Finding:", finding.finding_type.value)
    print("Event:", event.name)
    print("Post:", post.post_id)
    print("Comment:", comment.comment_id)

    print("\nAll OSINT models created successfully.")


if __name__ == "__main__":
    main()