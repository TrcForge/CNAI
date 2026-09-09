from security.audit import record_audit_event


def test_audit_event_contains_required_fields():
    event = record_audit_event(
        user_id="USR001",
        action="VIEW_EVIDENCE",
        resource="EVD0042",
        result="ALLOWED",
    )

    assert event["user_id"] == "USR001"
    assert event["action"] == "VIEW_EVIDENCE"
    assert event["resource"] == "EVD0042"
    assert event["result"] == "ALLOWED"
    assert "timestamp" in event


def test_denied_action_is_recorded():
    event = record_audit_event(
        user_id="USR007",
        action="VIEW_EVIDENCE",
        resource="EVD0042",
        result="DENIED",
    )

    assert event["result"] == "DENIED"