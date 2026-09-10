from security.blockchain import EvidenceLedger


def test_add_evidence_record():
    ledger = EvidenceLedger()

    block = ledger.add_evidence_record(
        evidence_id="EVD001",
        evidence_hash="abc123",
        recorded_by="USR001",
    )

    assert block["evidence_id"] == "EVD001"
    assert block["evidence_hash"] == "abc123"
    assert block["recorded_by"] == "USR001"
    assert block["previous_hash"] == "GENESIS"


def test_chain_is_valid():
    ledger = EvidenceLedger()

    ledger.add_evidence_record(
        evidence_id="EVD001",
        evidence_hash="hash001",
        recorded_by="USR001",
    )

    ledger.add_evidence_record(
        evidence_id="EVD002",
        evidence_hash="hash002",
        recorded_by="USR002",
    )

    assert ledger.verify_chain() is True


def test_tampered_block_is_detected():
    ledger = EvidenceLedger()

    ledger.add_evidence_record(
        evidence_id="EVD001",
        evidence_hash="hash001",
        recorded_by="USR001",
    )

    # Simulate tampering
    ledger.chain[0]["evidence_hash"] = "modified_hash"

    assert ledger.verify_chain() is False