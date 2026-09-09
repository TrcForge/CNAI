from enum import IntEnum

from security.rbac import Role, Permission, has_permission


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
    Check whether the user's clearance is sufficient.
    """
    return user_clearance >= evidence_classification


def can_access_evidence(
    role: Role,
    user_clearance: EvidenceClassification,
    evidence_classification: EvidenceClassification,
) -> bool:
    """
    Check both role permission and evidence clearance.
    """

    # User must have permission to view evidence
    if not has_permission(role, Permission.VIEW_EVIDENCE):
        return False

    # User's clearance must be sufficient
    return can_access_classification(
        user_clearance,
        evidence_classification,
    )