import re

from backend.osint.schemas import OSINTFinding


INDICATOR_RULES = {
    "meeting_coordination": [
        "meet",
        "meeting",
        "rendezvous",
        "tonight",
        "tomorrow",
        "meet at",
        "meet me",
    ],

    "financial_activity": [
        "payment",
        "pay",
        "transfer",
        "money",
        "cash",
        "account",
        "bank",
        "upi",
    ],

    "threat_or_intimidation": [
        "kill",
        "threat",
        "hurt",
        "attack",
        "revenge",
        "danger",
    ],

    "concealment_indicator": [
        "don't tell",
        "do not tell",
        "keep secret",
        "secret",
        "delete this",
        "delete message",
        "don't discuss",
        "do not discuss",
    ],

    "recruitment_indicator": [
        "join us",
        "recruit",
        "looking for people",
        "need people",
        "hiring",
    ],

    "location_coordination": [
        "location",
        "warehouse",
        "station",
        "airport",
        "hotel",
        "road",
        "address",
    ],

    "document_or_identity_activity": [
        "passport",
        "id card",
        "identity",
        "document",
        "fake id",
        "duplicate id",
    ],
}


def analyze_finding(
    finding: OSINTFinding,
) -> dict:

    text_parts = [
        finding.value or "",
        finding.content or "",
    ]

    text = " ".join(text_parts).lower()

    indicators = []

    for category, keywords in INDICATOR_RULES.items():

        matched_keywords = []

        for keyword in keywords:

            if re.search(
                rf"\b{re.escape(keyword)}\b",
                text,
            ):
                matched_keywords.append(
                    keyword
                )

        if not matched_keywords:
            continue

        explanations = {
            "meeting_coordination":
                "The public content contains language associated with planning or coordinating a meeting. This may become relevant when correlated with authorized case timelines, locations, or other independent evidence.",

            "financial_activity":
                "The content contains references to money, payment, transfer, banking, or financial activity. The context should be independently reviewed before drawing any conclusion.",

            "threat_or_intimidation":
                "The content contains language that may indicate a threat, intimidation, violence, or hostile intent. Context and surrounding communications require investigator review.",

            "concealment_indicator":
                "The content contains language associated with secrecy, deletion, or avoiding open discussion. This is only an investigative indicator and does not establish wrongdoing.",

            "recruitment_indicator":
                "The content appears to contain language associated with recruiting or seeking additional participants. The actual purpose and context require verification.",

            "location_coordination":
                "The content contains references to a location or movement-related place. This may be useful for temporal and geographic correlation with authorized investigation data.",

            "document_or_identity_activity":
                "The content references identity documents or identification-related activity. Additional evidence is required to determine whether the activity is legitimate or suspicious.",
        }

        confidence = min(
            0.95,
            0.55 + (0.08 * len(matched_keywords)),
        )

        indicators.append(
            {
                "category": category,
                "matched_terms": matched_keywords,
                "explanation": explanations[category],
                "confidence": round(
                    confidence,
                    2,
                ),
            }
        )

    if not indicators:

        return {
            "finding_id": finding.finding_id,
            "assessment": "no_relevant_indicator_detected",
            "indicators": [],
            "review_required": False,
        }

    return {
        "finding_id": finding.finding_id,
        "assessment": "potentially_relevant",
        "indicators": indicators,
        "review_required": True,
    }


def analyze_findings(
    findings: list[OSINTFinding],
) -> list[dict]:

    results = []

    for finding in findings:

        results.append(
            analyze_finding(finding)
        )

    return results