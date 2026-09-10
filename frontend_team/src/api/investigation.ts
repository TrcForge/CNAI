export interface InvestigationResponse {
  found: boolean;
  query: string;
  person: Record<string, string> | null;
  persons: Record<string, string>[];

  records: {
    cdr: Record<string, string>[];
    cases: Record<string, string>[];
    fir: Record<string, string>[];
    transactions: Record<string, string>[];
    locations: Record<string, string>[];
    phones: Record<string, string>[];
    vehicles: Record<string, string>[];
    intelligence: Record<string, string>[];
    crime_sections: Record<string, string>[];
  };

  counts: Record<string, number>;
}

export async function searchInvestigation(
  query: string,
  token?: string
): Promise<InvestigationResponse> {

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `/api/investigation/search?q=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(
      error || `Investigation search failed (${response.status})`
    );
  }

  return response.json();
}