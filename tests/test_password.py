from security.password import hash_password, verify_password


def test_password_hashing():
    password = "TestPassword@123"

    password_hash = hash_password(password)

    # Password must not be stored as plaintext
    assert password_hash != password

    # Correct password should verify
    assert verify_password(password, password_hash) is True

    # Incorrect password should fail
    assert verify_password("WrongPassword", password_hash) is False


def test_same_password_has_different_hash():
    password = "TestPassword@123"

    hash1 = hash_password(password)
    hash2 = hash_password(password)

    # Argon2 uses a random salt
    assert hash1 != hash2