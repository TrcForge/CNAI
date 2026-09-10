from backend.osint.collector_manager import OSINTCollectorManager
from backend.osint.intelligence import analyze_findings
from backend.osint.query_generator import generate_queries
from backend.osint.resolution import (
    calculate_name_similarity,
    mobile_matches,
)
from backend.osint.schemas import (
    EntityMatch,
    OSINTSearchRequest,
    OSINTSearchResponse,
)


# -------------------------------------------------------------------
# DEMO ENTITIES
# -------------------------------------------------------------------
# Temporary entities for testing entity resolution.
# Later these will come from Neo4j / the main entity database.
# -------------------------------------------------------------------

DEMO_ENTITIES = [
    {
        "entity_id": "PER-001",
        "name": "Rahul Sharma",
        "mobile": "9999999999",
    },
    {
        "entity_id": "PER-002",
        "name": "Rohit Sharma",
        "mobile": "8888888888",
    },
    {
        "entity_id": "PER-003",
        "name": "Sameer Khan",
        "mobile": "7777777777",
    },
]


# -------------------------------------------------------------------
# ENTITY RESOLUTION
# -------------------------------------------------------------------

def resolve_entities(
    request: OSINTSearchRequest,
) -> list[EntityMatch]:

    matches = []

    for entity in DEMO_ENTITIES:

        name_score = 0.0

        # Compare names when a name was supplied.
        if request.name:

            name_score = calculate_name_similarity(
                request.name,
                entity["name"],
            )

        mobile_match = False

        # Compare mobile numbers when supplied.
        if request.mobile:

            mobile_match = mobile_matches(
                request.mobile,
                entity["mobile"],
            )

        # -----------------------------------------------------------
        # Exact mobile match
        # -----------------------------------------------------------

        if mobile_match:

            confidence = 1.0

            reason = (
                "Mobile number matches exactly."
            )

        # -----------------------------------------------------------
        # Strong name similarity
        # -----------------------------------------------------------

        elif name_score >= 0.80:

            confidence = name_score

            reason = (
                "High name similarity; "
                "investigator verification required."
            )

        # -----------------------------------------------------------
        # Moderate name similarity
        # -----------------------------------------------------------

        elif name_score >= 0.60:

            confidence = name_score

            reason = (
                "Moderate name similarity; "
                "manual verification required."
            )

        else:

            continue

        matches.append(
            EntityMatch(
                entity_id=entity["entity_id"],
                matched_name=entity["name"],
                name_similarity=round(
                    name_score,
                    2,
                ),
                mobile_match=mobile_match,
                confidence=round(
                    confidence,
                    2,
                ),
                reason=reason,
                verification_status="review_required",
            )
        )

    return matches


# -------------------------------------------------------------------
# MAIN OSINT SEARCH SERVICE
# -------------------------------------------------------------------

def search_osint(
    request: OSINTSearchRequest,
) -> OSINTSearchResponse:

    # ---------------------------------------------------------------
    # 1. Generate search queries
    # ---------------------------------------------------------------

    queries = generate_queries(
        request
    )

    # ---------------------------------------------------------------
    # 2. Run all OSINT collectors
    #
    # Current collectors:
    #   - GitHub API
    #   - SearXNG public web search
    #
    # CollectorManager also performs:
    #   - normalization
    #   - deduplication
    # ---------------------------------------------------------------

    collector_manager = (
        OSINTCollectorManager()
    )

    findings = collector_manager.search(
        queries
    )

    # ---------------------------------------------------------------
    # 3. Resolve possible matches against known entities
    # ---------------------------------------------------------------

    entity_matches = resolve_entities(
        request
    )

    # ---------------------------------------------------------------
    # 4. Analyze collected OSINT findings
    #
    # This currently uses our prototype intelligence
    # indicator layer.
    #
    # Later this can be connected to the team's
    # ML/NLP/vectorization module.
    # ---------------------------------------------------------------

    intelligence_results = analyze_findings(
        findings
    )

    # ---------------------------------------------------------------
    # 5. Return unified OSINT response
    # ---------------------------------------------------------------

    return OSINTSearchResponse(
        query_name=request.name,
        query_mobile=request.mobile,

        findings=findings,

        potential_entity_matches=(
            entity_matches
        ),

        intelligence=(
            intelligence_results
        ),
    )