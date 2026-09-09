from enum import Enum


class Role(str, Enum):
    ADMIN = "admin"
    INVESTIGATOR = "investigator"
    ANALYST = "analyst"
    VIEWER = "viewer"


class Permission(str, Enum):
    VIEW_CASES = "view_cases"
    CREATE_CASE = "create_case"
    UPDATE_CASE = "update_case"

    VIEW_ANALYTICS = "view_analytics"

    VIEW_EVIDENCE = "view_evidence"
    UPLOAD_EVIDENCE = "upload_evidence"
    VERIFY_EVIDENCE = "verify_evidence"

    VIEW_AUDIT_LOGS = "view_audit_logs"
    MANAGE_USERS = "manage_users"


ROLE_PERMISSIONS = {
    Role.ADMIN: {
        Permission.VIEW_CASES,
        Permission.CREATE_CASE,
        Permission.UPDATE_CASE,
        Permission.VIEW_ANALYTICS,
        Permission.VIEW_EVIDENCE,
        Permission.UPLOAD_EVIDENCE,
        Permission.VERIFY_EVIDENCE,
        Permission.VIEW_AUDIT_LOGS,
        Permission.MANAGE_USERS,
    },

    Role.INVESTIGATOR: {
        Permission.VIEW_CASES,
        Permission.CREATE_CASE,
        Permission.UPDATE_CASE,
        Permission.VIEW_ANALYTICS,
        Permission.VIEW_EVIDENCE,
        Permission.UPLOAD_EVIDENCE,
        Permission.VERIFY_EVIDENCE,
    },

    Role.ANALYST: {
        Permission.VIEW_CASES,
        Permission.VIEW_ANALYTICS,
    },

    Role.VIEWER: {
        Permission.VIEW_CASES,
    },
}


def has_permission(role: Role, permission: Permission) -> bool:
    """
    Check whether a role has a particular permission.
    """
    return permission in ROLE_PERMISSIONS.get(role, set())