import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError

from core.pipeline.orchestrator import GroundedAnswerPipeline
from core.models.schemas import Query
from api.schemas import QueryRequest, QueryResponse

app = FastAPI(title="Policy RAG API")

# Setup CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lazy initialize pipeline
pipeline = None

def get_pipeline():
    global pipeline
    if pipeline is None:
        base_dir = Path(__file__).parent.parent
        manual_path = base_dir / "policy-manual.md"
        amendment_path = base_dir / "Amendment No. 2026-01.md"
        pipeline = GroundedAnswerPipeline(manual_path, amendment_path)
    return pipeline

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "bm25-only"}

@app.post("/api/query", response_model=QueryResponse, response_model_exclude_none=True)
async def process_query(request: QueryRequest):
    try:
        query = Query(
            text=request.question,
            event_date=request.event_date,
            claim_date=request.claim_date,
            determination_date=request.determination_date,
            period_start=request.period_start,
            period_end=request.period_end
        )
        
        result = get_pipeline().process_query(query)
        
        if result.answer:
            return QueryResponse(
                status="SUFFICIENT",
                answer=result.answer.answer_text,
                cited_clause_ids=result.answer.cited_clause_ids,
                confidence=result.answer.confidence,
                evidence=result.evidence
            )
        elif result.refusal:
            status = result.refusal.status
            if status == "TEMPORALLY_AMBIGUOUS":
                return QueryResponse(
                    status=status,
                    message=result.refusal.reason,
                    required_temporal_field="event_date",
                    evidence=result.evidence
                )
            elif status == "CONFLICTING":
                return QueryResponse(
                    status=status,
                    reason=result.refusal.reason,
                    next_step=result.refusal.next_step,
                    conflicting_clause_ids=result.refusal.conflicting_clause_ids,
                    evidence=result.evidence
                )
            else: # INSUFFICIENT
                return QueryResponse(
                    status=status,
                    reason=result.refusal.reason,
                    next_step=result.refusal.next_step,
                    evidence=result.evidence
                )
        else:
            raise HTTPException(status_code=500, detail="Pipeline returned an unknown state.")
            
    except HTTPException:
        raise
    except Exception as e:
        # Do not expose internal Python stack traces to the frontend
        raise HTTPException(status_code=500, detail="Internal Server Error")
