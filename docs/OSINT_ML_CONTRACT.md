# CNAI OSINT → ML Integration Contract

## Purpose

The OSINT module collects publicly available or authorized
information and provides normalized findings to the ML/NLP
and intelligence modules.

## Input

Each OSINT finding follows the common OSINTFinding schema.

Important fields:

- finding_id
- entity_id
- finding_type
- platform
- value
- content
- author
- source
- source_url
- observed_at
- location
- mentioned_entities
- confidence
- verification_status
- metadata

## Processing

OSINT performs:

1. Query generation
2. Source collection
3. Normalization
4. Deduplication
5. Initial entity resolution

The ML/NLP module performs:

1. Entity extraction
2. Relationship extraction
3. Text analysis
4. Embedding/vectorization
5. Similarity analysis
6. Pattern analysis
7. Intelligence indicator generation

## Output

The ML/intelligence module should return:

- finding_id
- assessment
- indicators
- category
- explanation
- confidence
- review_required

## Responsible AI

The system must not classify an individual as
"criminal" based only on OSINT.

Results represent investigative leads or
potential intelligence indicators.

Final decisions require authorized
investigator review.