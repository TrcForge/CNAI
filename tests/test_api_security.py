import pytest

from security.api_security import (
    get_current_user,
    require_permission,
)

from security.jwt_handler import create_access_token
from security.rbac import Role, Permission


def test_valid_token_returns_user():
    token = create_access_token(
        {
            "user_id": "USR001",
            "role": "investigator",
        }
    )

    user = get_current_user(token)

    assert user["user_id"] == "USR001"
    assert user["role"] == Role.INVESTIGATOR


def test_invalid_token_is_rejected():
    with pytest.raises(ValueError):
        get_current_user("invalid.token.here")


def test_user_permission_is_allowed():
    token = create_access_token(
        {
            "user_id": "USR001",
            "role": "investigator",
        }
    )

    user = get_current_user(token)

    assert require_permission(
        user,
        Permission.VIEW_CASES,
    ) is True


def test_user_without_permission_is_rejected():
    token = create_access_token(
        {
            "user_id": "USR002",
            "role": "analyst",
        }
    )

    user = get_current_user(token)

    with pytest.raises(PermissionError):
        require_permission(
            user,
            Permission.MANAGE_USERS,
        )