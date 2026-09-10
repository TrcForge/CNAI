from pathlib import Path

import pandas as pd
from fastapi import APIRouter, Depends, HTTPException, Query

from backend.dependencies import require_permission
from security.rbac import Permission


router = APIRouter(
    prefix="/api/investigation",
    tags=["Investigation"],
)


# CNAI/
# ├── backend/
# └── data/
BASE_DIR = Path(__file__).resolve().parents[2]
DATA_DIR = BASE_DIR / "data" / "processed"


def load_csv(filename: str) -> pd.DataFrame:
    path = DATA_DIR / filename

    if not path.exists():
        return pd.DataFrame()

    try:
        return pd.read_csv(path, dtype=str).fillna("")
    except Exception as error:
        print(f"[INVESTIGATION] Failed to load {filename}: {error}")
        return pd.DataFrame()


def contains_value(
    df: pd.DataFrame,
    column: str,
    values: set[str],
) -> pd.DataFrame:

    if df.empty or column not in df.columns or not values:
        return pd.DataFrame(columns=df.columns)

    normalized_values = {
        str(value).strip().lower()
        for value in values
        if str(value).strip()
    }

    if not normalized_values:
        return pd.DataFrame(columns=df.columns)

    series = df[column].astype(str).str.strip().str.lower()

    return df[series.isin(normalized_values)]


def contains_text(
    df: pd.DataFrame,
    column: str,
    query: str,
) -> pd.DataFrame:

    if df.empty or column not in df.columns:
        return pd.DataFrame(columns=df.columns)

    if not query:
        return pd.DataFrame(columns=df.columns)

    mask = (
        df[column]
        .astype(str)
        .str.lower()
        .str.contains(query.lower(), regex=False, na=False)
    )

    return df[mask]


def records(df: pd.DataFrame, limit: int = 100) -> list[dict]:
    if df.empty:
        return []

    return df.head(limit).to_dict(orient="records")


@router.get(
    "/search",
    dependencies=[
        Depends(require_permission(Permission.VIEW_CASES))
    ],
)
def investigation_search(
    q: str = Query(..., min_length=1),
):

    query = q.strip()

    if not query:
        raise HTTPException(
            status_code=400,
            detail="Search query cannot be empty",
        )

    # ---------------------------------------------------------
    # 1. PERSON SEARCH
    # ---------------------------------------------------------

    persons_df = load_csv("persons_normalized.csv")

    if persons_df.empty:
        raise HTTPException(
            status_code=500,
            detail="persons_normalized.csv could not be loaded",
        )

    person_mask = (
        persons_df["person_id"]
        .astype(str)
        .str.contains(query, case=False, regex=False, na=False)
        |
        persons_df["actor_id"]
        .astype(str)
        .str.contains(query, case=False, regex=False, na=False)
        |
        persons_df["person_name"]
        .astype(str)
        .str.contains(query, case=False, regex=False, na=False)
        |
        persons_df["phone_number"]
        .astype(str)
        .str.contains(query, case=False, regex=False, na=False)
    )

    matched_persons = persons_df[person_mask].copy()

    if matched_persons.empty:
        return {
            "found": False,
            "query": query,
            "person": None,
            "persons": [],
            "records": {
                "cdr": [],
                "cases": [],
                "fir": [],
                "transactions": [],
                "locations": [],
                "phones": [],
                "vehicles": [],
                "intelligence": [],
                "crime_sections": [],
            },
            "counts": {
                "cdr": 0,
                "cases": 0,
                "fir": 0,
                "transactions": 0,
                "locations": 0,
                "phones": 0,
                "vehicles": 0,
                "intelligence": 0,
                "crime_sections": 0,
            },
        }

    # ---------------------------------------------------------
    # 2. COLLECT PERSON IDS
    # ---------------------------------------------------------

    person_ids = set(
        matched_persons["person_id"]
        .astype(str)
        .str.strip()
    )

    actor_ids = set(
        matched_persons["actor_id"]
        .astype(str)
        .str.strip()
    )

    person_ids.discard("")
    actor_ids.discard("")

    names = set(
        matched_persons["person_name"]
        .astype(str)
        .str.strip()
    )

    names.discard("")

    case_ids = set(
        matched_persons["case_id"]
        .astype(str)
        .str.strip()
    )

    case_ids.discard("")

    # ---------------------------------------------------------
    # 3. CDR
    # ---------------------------------------------------------

    cdr_df = load_csv("calls_normalized.csv")

    cdr_records = pd.DataFrame()

    if not cdr_df.empty:

        caller_match = cdr_df["caller_id"].isin(actor_ids)

        receiver_match = cdr_df["receiver_id"].isin(actor_ids)

        cdr_records = cdr_df[
            caller_match | receiver_match
        ]

    # ---------------------------------------------------------
    # 4. CASES
    # ---------------------------------------------------------

    cases_df = load_csv("cases.csv")

    case_records = contains_value(
        cases_df,
        "case_id",
        case_ids,
    )

    # Also search cases by person ID / actor ID if available.
    if not cases_df.empty:

        extra_masks = pd.Series(
            False,
            index=cases_df.index,
        )

        for column in cases_df.columns:

            if column.lower() in {
                "person_id",
                "actor_id",
                "entity_id",
            }:

                extra_masks = (
                    extra_masks
                    |
                    cases_df[column].isin(actor_ids | person_ids)
                )

        if extra_masks.any():

            case_records = pd.concat(
                [case_records, cases_df[extra_masks]],
                ignore_index=True,
            ).drop_duplicates()

    # ---------------------------------------------------------
    # 5. FIR
    # ---------------------------------------------------------

    fir_df = load_csv("fir_records_extracted.csv")

    fir_records = pd.DataFrame()

    if not fir_df.empty:

        masks = pd.Series(
            False,
            index=fir_df.index,
        )

        # Search OCR names.
        if "person_names_ocr" in fir_df.columns:

            for name in names:

                masks = (
                    masks
                    |
                    fir_df["person_names_ocr"]
                    .astype(str)
                    .str.contains(
                        name,
                        case=False,
                        regex=False,
                        na=False,
                    )
                )

        # Search case IDs if the FIR dataset has one.
        for column in [
            "case_id",
            "person_id",
            "actor_id",
        ]:

            if column in fir_df.columns:

                masks = (
                    masks
                    |
                    fir_df[column].isin(
                        case_ids
                        | person_ids
                        | actor_ids
                    )
                )

        fir_records = fir_df[masks]

    # ---------------------------------------------------------
    # 6. FINANCIAL TRANSACTIONS
    # ---------------------------------------------------------

    transactions_df = load_csv(
        "financial_transactions.csv"
    )

    transaction_records = pd.DataFrame()

    if not transactions_df.empty:

        sender_match = pd.Series(
            False,
            index=transactions_df.index,
        )

        receiver_match = pd.Series(
            False,
            index=transactions_df.index,
        )

        if "sender_person_id" in transactions_df.columns:
            sender_match = transactions_df[
                "sender_person_id"
            ].isin(person_ids | actor_ids)

        if "receiver_person_id" in transactions_df.columns:
            receiver_match = transactions_df[
                "receiver_person_id"
            ].isin(person_ids | actor_ids)

        transaction_records = transactions_df[
            sender_match | receiver_match
        ]

    # ---------------------------------------------------------
    # 7. LOCATIONS
    # ---------------------------------------------------------

    locations_df = load_csv(
        "locations_normalized.csv"
    )

    location_records = pd.DataFrame()

    if not locations_df.empty:

        mask = pd.Series(
            False,
            index=locations_df.index,
        )

        if "person_id" in locations_df.columns:
            mask = (
                mask
                |
                locations_df["person_id"].isin(person_ids)
            )

        if "actor_id" in locations_df.columns:
            mask = (
                mask
                |
                locations_df["actor_id"].isin(actor_ids)
            )

        location_records = locations_df[mask]

    # ---------------------------------------------------------
    # 8. PHONES
    # ---------------------------------------------------------

    phones_df = load_csv("phones.csv")

    phone_records = pd.DataFrame()

    if not phones_df.empty:

        mask = pd.Series(
            False,
            index=phones_df.index,
        )

        if "actor_id" in phones_df.columns:
            mask = (
                mask
                |
                phones_df["actor_id"].isin(actor_ids)
            )

        if "phone_number" in phones_df.columns:

            for phone in matched_persons[
                "phone_number"
            ].astype(str):

                if phone.strip():

                    mask = (
                        mask
                        |
                        phones_df["phone_number"]
                        .astype(str)
                        .eq(phone.strip())
                    )

        phone_records = phones_df[mask]

    # ---------------------------------------------------------
    # 9. VEHICLES
    # ---------------------------------------------------------

    vehicles_df = load_csv("vehicles.csv")

    vehicle_records = pd.DataFrame()

    if not vehicles_df.empty:

        mask = pd.Series(
            False,
            index=vehicles_df.index,
        )

        if "actor_id" in vehicles_df.columns:
            mask = (
                mask
                |
                vehicles_df["actor_id"].isin(actor_ids)
            )

        if "person_id" in vehicles_df.columns:
            mask = (
                mask
                |
                vehicles_df["person_id"].isin(person_ids)
            )

        vehicle_records = vehicles_df[mask]

    # ---------------------------------------------------------
    # 10. INTELLIGENCE REPORTS
    # ---------------------------------------------------------

    intelligence_df = load_csv(
        "intelligence_reports.csv"
    )

    intelligence_records = pd.DataFrame()

    if not intelligence_df.empty:

        mask = pd.Series(
            False,
            index=intelligence_df.index,
        )

        if "person_id" in intelligence_df.columns:
            mask = (
                mask
                |
                intelligence_df["person_id"].isin(person_ids)
            )

        if "actor_id" in intelligence_df.columns:
            mask = (
                mask
                |
                intelligence_df["actor_id"].isin(actor_ids)
            )

        intelligence_records = intelligence_df[mask]

    # ---------------------------------------------------------
    # 11. CRIME SECTIONS
    # ---------------------------------------------------------

    crime_sections_df = load_csv(
        "crime_sections.csv"
    )

    crime_section_records = pd.DataFrame()

    if not crime_sections_df.empty and case_ids:

        # If case_id exists, connect through it.
        if "case_id" in crime_sections_df.columns:

            crime_section_records = (
                crime_sections_df)