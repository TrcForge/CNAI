from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt

from security.config import settings


def create_access_token(data: dict) -> str:
    """
    Create a JWT access token.
    """

    payload = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )

    payload.update({"exp": expire})

    return jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm
    )


def decode_access_token(token: str) -> dict | None:
    """
    Decode and verify a JWT access token.
    Returns payload if valid, otherwise None.
    """

    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm]
        )

        return payload

    except JWTError:
        return None