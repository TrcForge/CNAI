import hashlib
import json
from datetime import datetime, timezone


class EvidenceLedger:
    """
    Simple append-only ledger for recording evidence hashes.

    The actual evidence file is NOT stored in the ledger.
    Only integrity-related metadata is recorded.
    """

    def __init__(self):
        self.chain = []

    def _calculate_block_hash(self, block: dict) -> str:
        """
        Calculate the SHA-256 hash of a ledger block.
        """

        block_data = json.dumps(
            block,
            sort_keys=True,
        ).encode("utf-8")

        return hashlib.sha256(block_data).hexdigest()

    def add_evidence_record(
        self,
        evidence_id: str,
        evidence_hash: str,
        recorded_by: str,
    ) -> dict:
        """
        Add an evidence integrity record to the ledger.
        """

        previous_hash = (
            self.chain[-1]["block_hash"]
            if self.chain
            else "GENESIS"
        )

        block = {
            "index": len(self.chain),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "evidence_id": evidence_id,
            "evidence_hash": evidence_hash,
            "recorded_by": recorded_by,
            "previous_hash": previous_hash,
        }

        block["block_hash"] = self._calculate_block_hash(block)

        self.chain.append(block)

        return block

    def verify_chain(self) -> bool:
        """
        Verify that the ledger has not been tampered with.
        """

        for index, block in enumerate(self.chain):

            # Verify the block's own hash
            stored_hash = block["block_hash"]

            block_without_hash = {
                key: value
                for key, value in block.items()
                if key != "block_hash"
            }

            calculated_hash = self._calculate_block_hash(
                block_without_hash
            )

            if stored_hash != calculated_hash:
                return False

            # Verify link to previous block
            if index == 0:
                if block["previous_hash"] != "GENESIS":
                    return False
            else:
                if block["previous_hash"] != self.chain[index - 1]["block_hash"]:
                    return False

        return True