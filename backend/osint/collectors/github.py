import httpx

from backend.osint.collectors.base import OSINTCollector


class GitHubCollector(OSINTCollector):

    name = "github"

    BASE_URL = "https://api.github.com"

    def search(self, query: str) -> list[dict]:

        url = f"{self.BASE_URL}/search/users"

        params = {
            "q": query,
            "per_page": 10
        }

        headers = {
            "Accept": "application/vnd.github+json"
        }

        response = httpx.get(
            url,
            params=params,
            headers=headers,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        findings = []

        for user in data.get("items", []):

            findings.append({
                "finding_type": "github_account",
                "value": user.get("login"),
                "source": "github",
                "source_url": user.get("html_url"),
                "confidence": 0.50,
                "metadata": {
                    "github_id": user.get("id"),
                    "avatar_url": user.get("avatar_url"),
                    "profile_url": user.get("html_url")
                }
            })

        return findings