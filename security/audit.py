import logging
from datetime import datetime, timezone


logger = logging.getLogger("security.audit")


def record_audit_event(
    user_id: str,
    action: str,
    resource: str,
    result: str,
) -> dict:
    """
    Create and log a security audit event.
    """

    event = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "user_id": user_id,
        "action": action,
        "resource": resource,
        "result": result,
    }

    logger.info(
        "AUDIT | user=%s | action=%s | resource=%s | result=%s",
        user_id,
        action,
        resource,
        result,
    )

    return event