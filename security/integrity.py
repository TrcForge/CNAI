import hashlib
from pathlib import Path


def calculate_sha256(file_path: str) -> str:
    """
    Calculate the SHA-256 hash of a file.
    """

    sha256 = hashlib.sha256()

    path = Path(file_path)

    with path.open("rb") as file:
        for chunk in iter(lambda: file.read(8192), b""):
            sha256.update(chunk)

    return sha256.hexdigest()


def verify_sha256(file_path: str, expected_hash: str) -> bool:
    """
    Verify that a file matches its previously recorded SHA-256 hash.
    """

    actual_hash = calculate_sha256(file_path)

    return actual_hash.lower() == expected_hash.lower()