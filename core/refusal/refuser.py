from typing import List
from core.models.schemas import Clause, Query, Refusal, VerificationResult, VerificationStatus

class RefusalEngine:
    def __init__(self):
        pass

    def refuse(self, query: Query, verification_result: VerificationResult, evidence: List[Clause]) -> Refusal:
        """
        Deterministically constructs a refusal response based on the structured output
        already provided by the EvidenceVerifier, saving an LLM call.
        """
        if verification_result.status == VerificationStatus.TEMPORALLY_AMBIGUOUS:
            reason = (
                f"The answer depends on a date that was not provided.\n"
                f"Reasoning: {verification_result.reasoning}"
            )
        elif verification_result.status == VerificationStatus.INSUFFICIENT:
            reason = (
                f"The policy manual does not establish an answer to the query.\n"
                f"Reasoning: {verification_result.reasoning}"
            )
        elif verification_result.status == VerificationStatus.CONFLICTING:
            conflict_ids = ", ".join([f"§{cid}" for cid in verification_result.conflicting_clause_ids])
            if not conflict_ids:
                conflict_ids = "multiple provisions"
                
            reason = (
                f"The policy manual contains conflicting provisions regarding this query "
                f"(see {conflict_ids}).\n"
                f"Reasoning: {verification_result.reasoning}"
            )
        else:
            reason = "An unknown error prevented generating a grounded answer."

        return Refusal(
            reason=reason,
            next_step=verification_result.recommended_next_step,
            status=verification_result.status.value,
            conflicting_clause_ids=verification_result.conflicting_clause_ids if verification_result.status == VerificationStatus.CONFLICTING else None
        )
