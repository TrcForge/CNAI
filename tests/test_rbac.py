from security.rbac import Role, Permission, has_permission


def test_admin_has_full_access():
    assert has_permission(Role.ADMIN, Permission.MANAGE_USERS)
    assert has_permission(Role.ADMIN, Permission.VIEW_EVIDENCE)
    assert has_permission(Role.ADMIN, Permission.VIEW_AUDIT_LOGS)


def test_investigator_permissions():
    assert has_permission(Role.INVESTIGATOR, Permission.VIEW_CASES)
    assert has_permission(Role.INVESTIGATOR, Permission.VIEW_EVIDENCE)
    assert has_permission(Role.INVESTIGATOR, Permission.CREATE_CASE)


def test_analyst_permissions():
    assert has_permission(Role.ANALYST, Permission.VIEW_ANALYTICS)
    assert has_permission(Role.ANALYST, Permission.VIEW_CASES)

    assert not has_permission(Role.ANALYST, Permission.MANAGE_USERS)
    assert not has_permission(Role.ANALYST, Permission.VIEW_EVIDENCE)


def test_viewer_has_limited_access():
    assert has_permission(Role.VIEWER, Permission.VIEW_CASES)

    assert not has_permission(Role.VIEWER, Permission.VIEW_EVIDENCE)
    assert not has_permission(Role.VIEWER, Permission.MANAGE_USERS)