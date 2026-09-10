from backend.osint.query_generator import generate_queries
from backend.osint.schemas import OSINTSearchRequest


def main():

    request = OSINTSearchRequest(
        name="Rahul Sharma",
        mobile="9999999999"
    )

    queries = generate_queries(request)

    print("\nGENERATED OSINT QUERIES")
    print("=" * 60)

    for query in queries:
        print(query)


if __name__ == "__main__":
    main()