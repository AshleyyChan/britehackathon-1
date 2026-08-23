from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from core.models.schemas import Clause

class QueryRequest(BaseModel):
    question: str
    event_date: Optional[date] = None
    claim_date: Optional[date] = None
    determination_date: Optional[date] = None
    period_start: Optional[date] = None
    period_end: Optional[date] = None

class QueryResponse(BaseModel):
    status: str
    
    # SUFFICIENT
    answer: Optional[str] = None
    cited_clause_ids: Optional[List[str]] = None
    confidence: Optional[float] = None
    
    # CONFLICTING / INSUFFICIENT
    reason: Optional[str] = None
    next_step: Optional[str] = None
    conflicting_clause_ids: Optional[List[str]] = None
    
    # TEMPORALLY_AMBIGUOUS
    message: Optional[str] = None
    required_temporal_field: Optional[str] = None
    
    # Common
    evidence: Optional[List[Clause]] = None
