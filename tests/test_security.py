import pytest

from security.password import hash_password, verify_password
from security.jwt_handler import create_access_token
from security.api_security import get_current_user, require_permission
from security.rbac import Role, Permission
from security.evidence import (
    EvidenceClassification,
    can_access_evidence,
)
from security.audit import record_audit_event
from security.integrity import calculate_sha256, verify_sha256
from security.blockchain import EvidenceLedger


def test_password_cannot_be_used_as_plaintext():
    password = "SecurePassword@123"

    password_hash = hash_password(password)

    assert password_hash != password
    assert verify_password(password, password_hash)
    assert not verify_password("WrongPassword", password_hash)


def test_tampered_jwt_is_rejected():
    token = create_access_token({
        "user_id": "USR001",
        "role": "investigator",
    })

    tampered_token = token[:-1] + (
        "A" if token[-1] != "A" else "B"
    )

    with pytest.raises(ValueError):
        get_current_user(tampered_token)


def test_invalid_role_is_rejected():
    token = create_access_token({
        "user_id": "USR001",
        "role": "unknown_role",
    })

    with pytest.raises(ValueError):
        get_current_user(token)


def test_analyst_cannot_manage_users():
    token = create_access_token({
        "user_id": "USR002",
        "role": "analyst",
    })

    user = get_current_user(token)

    with pytest.raises(PermissionError):
        require_permission(
            user,
            Permission.MANAGE_USERS,
        )


def test_restricted_evidence_requires_clearance():
    assert not can_access_evidence(
        Role.INVESTIGATOR,
        EvidenceClassification.CONFIDENTIAL,
        EvidenceClassification.RESTRICTED,
    )


def test_audit_event_records_denied_action():
    event = record_audit_event(
        user_id="USR002",
        action="VIEW_EVIDENCE",
        resource="EVD001",
        result="DENIED",
    )

    assert event["result"] == "DENIED"
    assert event["user_id"] == "USR002"


def test_modified_file_fails_integrity_check(tmp_path):
    evidence_file = tmp_path / "evidence.txt"

    evidence_file.write_text(
        "Original evidence",
        encoding="utf-8",
    )

    original_hash = calculate_sha256(
        str(evidence_file)
    )

    evidence_file.write_text(
        "Modified evidence",
        encoding="utf-8",
    )

    assert not verify_sha256(
        str(evidence_file),
        original_hash,
    )


def test_blockchain_tampering_is_detected():
    ledger = EvidenceLedger()

    ledger.add_evidence_record(
        evidence_id="EVD001",
        evidence_hash="hash001",
        recorded_by="USR001",
    )

    ledger.add_evidence_record(
        evidence_id="EVD002",
        evidence_hash="hash002",
        recorded_by="USR001",
    )

    assert ledger.verify_chain()

    # Simulate tampering
    ledger.chain[0]["evidence_hash"] = "tampered_hash"

    assert not ledger.verify_chain()