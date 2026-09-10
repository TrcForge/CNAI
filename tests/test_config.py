from security.config import settings


def test_configuration_loaded():
    assert settings.app_name == "Criminal Network Intelligence System"
    assert settings.jwt_algorithm == "HS256"
    assert settings.access_token_expire_minutes == 30