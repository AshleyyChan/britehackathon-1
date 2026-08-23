# The Grounded Answer

## Overview
This is a production-ready RAG application that answers questions based on the Calder County Household Support Program policy manual. The system features a highly robust, date-aware temporal inference engine, ensuring that answers dynamically conform to the rules in force at the time of a given event, claim, or determination.

## Architecture & Decisions
- **Core RAG Pipeline:** `Parser -> Hybrid Retriever -> Verifier -> Answer Generator / Refusal Engine`.
- **Temporal Resolution:** The system extracts structured dates and applicability rules. If an amendment changes a policy threshold (e.g., Amendment No. 2026-01), the engine deterministically retrieves and verifies the correct clauses based on the `DETERMINATION_DATE` or `EVENT_DATE`. 
- **Missing Dates:** Queries without required dates trigger a `TEMPORALLY_AMBIGUOUS` state rather than making assumptions.
- **Historical Conflicts:** Pre-amendment contradictions (e.g., 10 days vs 30 days for reporting) correctly trigger a `CONFLICTING` state. 

## Source Documents
- `policy-manual.md`: The base policy corpus.
- `Amendment No. 2026-01.md`: Temporal amendments taking effect on 1 March 2026.

## Running the Project
1. Navigate to the backend directory: `cd backend`
2. Copy `.env.example` to `.env` and provide a fresh `GEMINI_API_KEY`.
3. Install dependencies: `pip install -r requirements.txt`.
4. Start the backend: `uvicorn api.main:app --host 0.0.0.0 --port 8000`.
5. Run tests: `python -m unittest discover tests`.
