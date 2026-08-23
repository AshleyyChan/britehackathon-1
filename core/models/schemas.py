from pydantic import BaseModel
from typing import List, Optional, Union
from enum import Enum
from datetime import date
from enum import Enum

class ApplicabilityRule(BaseModel):
    date_type: List[str] # 'DETERMINATION_DATE', 'EVENT_DATE', 'PERIOD_DATE'
    effective_date: date

class Clause(BaseModel):
    """Represents a specific policy clause from the manual."""
    id: str         # e.g., "1.1.1" or "4.3.2" (For amendments, we can use "4.3.2-amended")
    text: str       # The textual content of the clause
    part: str       # e.g., "Part 1 — Scope and Definitions"
    section: str    # e.g., "1.1 Purpose of the Program"
    is_amendment: bool = False
    base_clause_id: Optional[str] = None
    amendment_name: Optional[str] = None
    applicability_rule: Optional[ApplicabilityRule] = None

class ScoredClause(Clause):
    """A clause augmented with retrieval scores and source metadata."""
    bm25_score: float = 0.0
    semantic_score: float = 0.0
    final_score: float = 0.0
    source: str = "Unknown"

class Query(BaseModel):
    """Represents a user's question with extracted temporal context."""
    text: str
    event_date: Optional[date] = None
    claim_date: Optional[date] = None
    determination_date: Optional[date] = None
    period_start: Optional[date] = None
    period_end: Optional[date] = None

class VerificationStatus(str, Enum):
    SUFFICIENT = "SUFFICIENT"
    INSUFFICIENT = "INSUFFICIENT"
    CONFLICTING = "CONFLICTING"
    TEMPORALLY_AMBIGUOUS = "TEMPORALLY_AMBIGUOUS"

class VerificationResult(BaseModel):
    """Result of verifying retrieved evidence against the query."""
    status: VerificationStatus
    reasoning: str
    supporting_clause_ids: List[str]
    conflicting_clause_ids: List[str]
    confidence: float
    recommended_next_step: str
    
    @property
    def is_sufficient(self) -> bool:
        return self.status == VerificationStatus.SUFFICIENT
    
    @property
    def has_contradiction(self) -> bool:
        return self.status == VerificationStatus.CONFLICTING

class Answer(BaseModel):
    """A generated answer with exact clause-level citations."""
    answer_text: str
    cited_clause_ids: List[str]
    confidence: float

class Refusal(BaseModel):
    """A polite refusal to answer, with reason and next steps."""
    reason: str
    next_step: str
    status: str = "INSUFFICIENT"
    conflicting_clause_ids: Optional[List[str]] = None
    
class PipelineResult(BaseModel):
    """The final result of the pipeline, either an Answer or a Refusal."""
    answer: Optional[Answer] = None
    refusal: Optional[Refusal] = None
    evidence: Optional[List[Clause]] = None
