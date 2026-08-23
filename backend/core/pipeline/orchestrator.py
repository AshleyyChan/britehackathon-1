from typing import Union
from pathlib import Path
import traceback

from core.models.schemas import Query, Answer, Refusal, PipelineResult, VerificationStatus, VerificationResult
from core.parser.manual_parser import parse_manual
from core.parser.amendment_parser import parse_amendment_2026_01
from core.parser.date_extractor import extract_dates
from core.retrieval.retriever import PolicyRetriever
from core.verification.verifier import EvidenceVerifier
from core.verification.temporal_resolver import resolve_temporal_evidence
from core.answering.generator import AnswerGenerator
from core.refusal.refuser import RefusalEngine

class GroundedAnswerPipeline:
    def __init__(self, manual_path: str | Path, amendment_path: str | Path = None):
        # 1. Parse manual
        self.clauses = parse_manual(manual_path)
        if amendment_path:
            self.clauses.extend(parse_amendment_2026_01(amendment_path))
        
        # 2. Initialize components
        self.retriever = PolicyRetriever(self.clauses)
        self.verifier = EvidenceVerifier()
        self.generator = AnswerGenerator()
        self.refusal_engine = RefusalEngine()

    def process_query(self, query_or_text: Union[str, Query]) -> PipelineResult:
        if isinstance(query_or_text, str):
            query = extract_dates(query_or_text)
        else:
            query = query_or_text
        
        # Step 1: Retrieval
        evidence = self.retriever.retrieve(query, top_k=5)
        
        # Step 1.5: Temporal Resolution
        resolved_evidence, ambiguous_ids = resolve_temporal_evidence(query, evidence)
        
        # Step 2: Verification
        verification = self.verifier.verify(query, resolved_evidence)
        
        # Step 2.5: Ambiguity Override
        used_ids = set(verification.supporting_clause_ids + verification.conflicting_clause_ids)
        if used_ids.intersection(ambiguous_ids):
            v_result = VerificationResult(
                status=VerificationStatus.TEMPORALLY_AMBIGUOUS,
                reasoning="The answer depends on a date (e.g. determination or event date) that was not provided.",
                supporting_clause_ids=[],
                conflicting_clause_ids=[],
                confidence=1.0,
                recommended_next_step="Please provide the required date."
            )
            refusal = self.refusal_engine.refuse(query, v_result, evidence)
            return PipelineResult(refusal=refusal, evidence=evidence)
        
        # Step 3: Answering or Refusal
        if verification.status == VerificationStatus.SUFFICIENT:
            supporting = [c for c in resolved_evidence if c.id in verification.supporting_clause_ids]
            if not supporting:
                supporting = resolved_evidence
            answer = self.generator.generate(query, supporting, verification)
            return PipelineResult(answer=answer, evidence=resolved_evidence)
        else:
            refusal = self.refusal_engine.refuse(query, verification, resolved_evidence)
            return PipelineResult(refusal=refusal, evidence=resolved_evidence)
