from security.jwt_handler import decode_access_token
from security.rbac import Role, Permission, has_permission


def get_current_user(token: str) -> dict:
    """
    Validate a JWT and return the authenticated user's information.
    """

    payload = decode_access_token(token)

    if payload is None:
        raise ValueError("Invalid or expired authentication token")

    user_id = payload.get("user_id")
    role = payload.get("role")

    if not user_id or not role:
        raise ValueError("Token does not contain required user information")

    try:
        role = Role(role)
    except ValueError:
        raise ValueError("Invalid user role")

    return {
        "user_id": user_id,
        "role": role,
    }


def require_permission(
    user: dict,
    permission: Permission,
) -> bool:
    """
    Check whether the authenticated user has a required permission.
    """

    role = user["role"]

    if not has_permission(role, permission):
        raise PermissionError(
            f"Role '{role.value}' does not have permission "
            f"'{permission.value}'"
        )

    return True