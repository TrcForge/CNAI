from security.password import hash_password, verify_password
from security.jwt_handler import create_access_token
from security.api_security import get_current_user, require_permission
from security.rbac import Permission


def main():
    print("=" * 60)
    print("CRIMINAL NETWORK INTELLIGENCE SYSTEM")
    print("MEMBER 6 SECURITY DEMONSTRATION")
    print("=" * 60)

    # 1. Password Security
    print("\n[1] PASSWORD SECURITY")

    password = "DemoPassword@123"
    password_hash = hash_password(password)

    print("Password stored as hash:", password_hash != password)
    print("Correct password:", verify_password(password, password_hash))
    print("Wrong password:", verify_password("WrongPassword", password_hash))

    # 2. JWT
    print("\n[2] JWT AUTHENTICATION")

    token = create_access_token({
        "user_id": "USR001",
        "role": "investigator",
    })

    print("JWT generated:", bool(token))

    user = get_current_user(token)

    print("Authenticated user:", user["user_id"])
    print("User role:", user["role"].value)

    # 3. Permission
    print("\n[3] ROLE-BASED ACCESS CONTROL")

    allowed = require_permission(
        user,
        Permission.VIEW_EVIDENCE,
    )

    print("VIEW_EVIDENCE permission:", allowed)

    print("\n" + "=" * 60)
    print("SECURITY DEMONSTRATION COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    main()