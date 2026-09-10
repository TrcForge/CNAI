from rapidfuzz import fuzz


def normalize_text(value: str | None) -> str:
    if not value:
        return ""

    return " ".join(value.lower().strip().split())


def normalize_mobile(value: str | None) -> str:
    if not value:
        return ""

    return "".join(
        character
        for character in value
        if character.isdigit()
    )


def calculate_name_similarity(
    name1: str,
    name2: str
) -> float:

    name1 = normalize_text(name1)
    name2 = normalize_text(name2)

    if not name1 or not name2:
        return 0.0

    score = fuzz.ratio(name1, name2)

    return round(score / 100, 2)


def mobile_matches(
    mobile1: str | None,
    mobile2: str | None
) -> bool:

    first = normalize_mobile(mobile1)
    second = normalize_mobile(mobile2)

    if not first or not second:
        return False

    return first == second