from security.evidence import (
    EvidenceClassification,
    can_access_classification,
)


def test_high_clearance_can_access_lower_classification():
    assert can_access_classification(
        EvidenceClassification.RESTRICTED,
        EvidenceClassification.PUBLIC,
    )

    assert can_access_classification(
        EvidenceClassification.RESTRICTED,
        EvidenceClassification.CONFIDENTIAL,
    )


def test_same_classification_is_allowed():
    assert can_access_classification(
        EvidenceClassification.CONFIDENTIAL,
        EvidenceClassification.CONFIDENTIAL,
    )


def test_lower_clearance_cannot_access_higher_classification():
    assert not can_access_classification(
        EvidenceClassification.INTERNAL,
        EvidenceClassification.CONFIDENTIAL,
    )

    assert not can_access_classification(
        EvidenceClassification.CONFIDENTIAL,
        EvidenceClassification.RESTRICTED,
    )