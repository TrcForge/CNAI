CNAI / SIH 26189 - Required Synthetic Data Bundle
=======================================================

Purpose
-------
This bundle provides the additional structured/synthetic data required to build and
demonstrate an integrated Criminal Network Analysis System.

IMPORTANT
---------
- Files ending in *_synthetic or containing source="synthetic_*" are demo data.
- FIR_details.json is OCR output from the supplied source and is reconstructed into
  fir_records_extracted.csv. OCR person names are intentionally NOT auto-linked to
  the synthetic Person master.
- Raw source files should remain unchanged. The intended flow is:
  RAW -> NORMALIZE -> ENTITY RESOLUTION -> GRAPH + VECTOR INDEX.

Core files
----------
persons_normalized.csv       Canonical person records.
phones.csv                   Phone/SIM records derived from persons.
cases.csv                    Case master derived from persons.
calls_normalized.csv         CDR normalized to person IDs + synthetic cell tower.
locations_normalized.csv     Location records normalized to person IDs.
fir_records_extracted.csv    One reconstructed FIR record per OCR image.
police_stations.csv          Station master derived from FIR OCR.
crime_sections.csv           Recognized section codes from FIR OCR.
entity_mapping.csv           Entity-resolution audit table.
graph_nodes_seed.csv         Starter graph nodes.
graph_relationships_seed.csv Starter graph relationships.

Additional SIH-demo data
------------------------
cell_towers.csv              Synthetic cell-tower catalogue.
vehicles.csv                 Vehicle associations.
financial_transactions.csv  Synthetic financial links.
osint_records.csv            Synthetic public posts/comments/events/mentions.
intelligence_reports.csv     Synthetic intelligence notes.
vector_documents.csv         Text records waiting for embedding/vectorization.

Recommended graph relationships
--------------------------------
Person -[:USES]-> Phone
Person -[:INVOLVED_IN]-> Case
Person -[:LOCATED_AT]-> Location
Person -[:CALLED]-> Person (or Phone -[:CALLED]-> Phone)
Person -[:OWNS/USES]-> Vehicle
Person -[:SENT_TO]-> Person for financial transactions
Person -[:HAS_OSINT]-> OSINTPost
Person -[:MENTIONED_IN]-> FIR
FIR -[:REGISTERED_AT]-> PoliceStation
FIR -[:HAS_SECTION]-> CrimeSection
Person -[:HAS_INTELLIGENCE]-> IntelligenceReport

Vectorization
-------------
Vectorize textual records (FIR reconstructed text, OSINT content, intelligence
reports). Keep structured relationships in Neo4j. Use hybrid retrieval:
vector search -> relevant documents -> Neo4j relationship expansion.

No fabricated FIR-person match
--------------------------------
The OCR names in the FIR source are not assumed to equal synthetic person names.
Use entity resolution later when reliable identifiers are available.

All data is synthetic except the supplied OCR-derived FIR reconstruction.
