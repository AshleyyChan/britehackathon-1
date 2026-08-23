from typing import List, Tuple, Set
from core.models.schemas import ScoredClause, Query

def resolve_temporal_evidence(query: Query, retrieved_clauses: List[ScoredClause]) -> Tuple[List[ScoredClause], Set[str]]:
    resolved = []
    ambiguous_ids = set()
    
    amended_bases = set(c.base_clause_id for c in retrieved_clauses if c.is_amendment and c.base_clause_id)
    
    for clause in retrieved_clauses:
        # Normal clause without amendments
        if not clause.is_amendment and clause.id not in amended_bases:
            resolved.append(clause)
            continue
            
        # Amended clause
        if clause.is_amendment:
            rule = clause.applicability_rule
            applies = False
            ambiguous = False
            
            has_relevant_date = False
            for dtype in rule.date_type:
                if dtype == "DETERMINATION_DATE" and (query.determination_date or query.period_start):
                    has_relevant_date = True
                elif dtype == "EVENT_DATE" and query.event_date:
                    has_relevant_date = True
                elif dtype == "PERIOD_DATE" and query.period_start and query.period_end:
                    has_relevant_date = True
                    
            if not has_relevant_date:
                ambiguous = True
            else:
                for dtype in rule.date_type:
                    if dtype == "DETERMINATION_DATE" and query.determination_date:
                        if query.determination_date >= rule.effective_date:
                            applies = True
                    elif dtype == "EVENT_DATE" and query.event_date:
                        if query.event_date >= rule.effective_date:
                            applies = True
                    elif dtype == "PERIOD_DATE" and query.period_start and query.period_end:
                        if query.period_start < rule.effective_date and query.period_end >= rule.effective_date:
                            applies = True
                        elif query.period_start >= rule.effective_date:
                            applies = True
                            
            if ambiguous:
                ambiguous_ids.add(clause.id)
                resolved.append(clause)
            elif applies:
                resolved.append(clause)
                
        # Base clause that has an amendment
        if not clause.is_amendment and clause.id in amended_bases:
            amendments = [a for a in retrieved_clauses if a.is_amendment and a.base_clause_id == clause.id]
            
            base_applies = True
            ambiguous = False
            for a in amendments:
                rule = a.applicability_rule
                a_applies = False
                spans = False
                
                has_relevant_date = False
                for dtype in rule.date_type:
                    if dtype == "DETERMINATION_DATE" and (query.determination_date or query.period_start):
                        has_relevant_date = True
                    elif dtype == "EVENT_DATE" and query.event_date:
                        has_relevant_date = True
                    elif dtype == "PERIOD_DATE" and query.period_start and query.period_end:
                        has_relevant_date = True
                        
                if not has_relevant_date:
                    ambiguous = True
                else:
                    for dtype in rule.date_type:
                        if dtype == "DETERMINATION_DATE" and query.determination_date:
                            if query.determination_date >= rule.effective_date:
                                a_applies = True
                        elif dtype == "EVENT_DATE" and query.event_date:
                            if query.event_date >= rule.effective_date:
                                a_applies = True
                        elif dtype == "PERIOD_DATE" and query.period_start and query.period_end:
                            if query.period_start < rule.effective_date and query.period_end >= rule.effective_date:
                                spans = True
                            elif query.period_start >= rule.effective_date:
                                a_applies = True
                                
                    if a_applies and not spans:
                        base_applies = False
                    
            if ambiguous:
                ambiguous_ids.add(clause.id)
                resolved.append(clause)
            elif base_applies:
                resolved.append(clause)

    # Remove duplicates
    final_resolved = []
    seen = set()
    for r in resolved:
        if r.id not in seen:
            seen.add(r.id)
            final_resolved.append(r)
            
    return final_resolved, ambiguous_ids
