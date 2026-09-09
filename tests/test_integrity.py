from pathlib import Path

from security.integrity import calculate_sha256, verify_sha256


def test_sha256_hash_is_generated(tmp_path: Path):
    evidence_file = tmp_path / "evidence.txt"

    evidence_file.write_text(
        "Sample investigation evidence",
        encoding="utf-8",
    )

    file_hash = calculate_sha256(str(evidence_file))

    assert isinstance(file_hash, str)
    assert len(file_hash) == 64


def test_unchanged_evidence_passes_verification(tmp_path: Path):
    evidence_file = tmp_path / "evidence.txt"

    evidence_file.write_text(
        "Sample investigation evidence",
        encoding="utf-8",
    )

    original_hash = calculate_sha256(str(evidence_file))

    assert verify_sha256(
        str(evidence_file),
        original_hash,
    ) is True


def test_modified_evidence_fails_verification(tmp_path: Path):
    evidence_file = tmp_path / "evidence.txt"

    evidence_file.write_text(
        "Original evidence",
        encoding="utf-8",
    )

    original_hash = calculate_sha256(str(evidence_file))

    # Simulate evidence modification
    evidence_file.write_text(
        "Modified evidence",
        encoding="utf-8",
    )

    assert verify_sha256(
        str(evidence_file),
        original_hash,
    ) is False