from enum import IntEnum


class EvidenceClassification(IntEnum):
    PUBLIC = 1
    INTERNAL = 2
    CONFIDENTIAL = 3
    RESTRICTED = 4


CLASSIFICATION_NAMES = {
    EvidenceClassification.PUBLIC: "Public",
    EvidenceClassification.INTERNAL: "Internal",
    EvidenceClassification.CONFIDENTIAL: "Confidential",
    EvidenceClassification.RESTRICTED: "Restricted",
}


def can_access_classification(
    user_clearance: EvidenceClassification,
    evidence_classification: EvidenceClassification,
) -> bool:
    """
    A user can access evidence when their clearance
    is equal to or higher than the evidence classification.
    """
    return user_clearance >= evidence_classification