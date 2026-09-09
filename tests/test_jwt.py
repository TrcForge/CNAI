from security.jwt_handler import create_access_token, decode_access_token


def test_create_and_decode_token():
    data = {
        "user_id": "USR001",
        "role": "investigator"
    }

    token = create_access_token(data)

    assert isinstance(token, str)
    assert len(token) > 0

    decoded = decode_access_token(token)

    assert decoded is not None
    assert decoded["user_id"] == "USR001"
    assert decoded["role"] == "investigator"


def test_invalid_token_is_rejected():
    invalid_token = "this.is.not.a.valid.token"

    decoded = decode_access_token(invalid_token)

    assert decoded is None