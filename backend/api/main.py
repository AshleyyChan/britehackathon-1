import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError

from core.pipeline.orchestrator import GroundedAnswerPipeline
from core.models.schemas import Query
from api.schemas import QueryRequest, QueryResponse
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / '.env')

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
        
        # Diagnostic logs
        verifier_real = pipeline.verifier.api_key is not None
        generator_real = pipeline.generator.api_key is not None
        model_id = os.getenv("GEMINI_MODEL_ID", "gemini-3.1-pro-preview")
        print(f"REAL MODE active in Verifier: {verifier_real}")
        print(f"REAL MODE active in Generator: {generator_real}")
        print(f"TEST MODE disabled: {verifier_real and generator_real}")
        print(f"MODEL USED: {model_id}")
        
    return pipeline

@app.get("/health")
def health_check():
    return {"status": "ok"}

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
            conf_pct = round(result.answer.confidence * 100) if result.answer.confidence is not None else None
            return QueryResponse(
                status="SUFFICIENT",
                answer=result.answer.answer_text,
                cited_clause_ids=result.answer.cited_clause_ids,
                confidence=conf_pct,
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
        import traceback
        err_msg = "".join(traceback.format_exception(type(e), e, e.__traceback__))
        raise HTTPException(status_code=500, detail=err_msg)
