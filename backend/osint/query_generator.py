from backend.osint.schemas import OSINTSearchRequest


def generate_queries(
    request: OSINTSearchRequest
) -> list[str]:

    queries = []

    if request.name:
        name = request.name.strip()

        if name:
            queries.append(name)
            queries.append(f'"{name}"')

    if request.mobile:
        mobile = request.mobile.strip()

        if mobile:
            queries.append(mobile)

    if request.name and request.mobile:
        queries.append(
            f'"{request.name}" "{request.mobile}"'
        )

    # Remove duplicates while preserving order
    return list(dict.fromkeys(queries))