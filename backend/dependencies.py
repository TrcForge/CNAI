from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from security.api_security import get_current_user
from security.rbac import Permission, has_permission


bearer_scheme = HTTPBearer()


def get_authenticated_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)
):
    token = credentials.credentials

    try:
        user = get_current_user(token)
    except ValueError as error:
        raise HTTPException(
            status_code=401,
            detail=str(error)
        )

    return user


def require_permission(permission: Permission):

    def permission_dependency(
        user=Depends(get_authenticated_user)
    ):
        if not has_permission(user["role"], permission):
            raise HTTPException(
                status_code=403,
                detail=(
                    f"Role '{user['role'].value}' does not have "
                    f"permission '{permission.value}'"
                )
            )

        return user

    return permission_dependency