import re
import numpy as np
from typing import List, Tuple, Dict
from core.models.schemas import Clause, Query, ScoredClause
from rank_bm25 import BM25Okapi
from fastembed import TextEmbedding

class PolicyRetriever:
    def __init__(self, clauses: List[Clause]):
        self.clauses = clauses
        self.clause_dict = {c.id: c for c in clauses}
        
        # 1. BM25 Setup
        tokenized_corpus = [clause.text.lower().split() for clause in self.clauses]
        self.bm25 = BM25Okapi(tokenized_corpus)
        
        # 2. Semantic Setup
        # Using ONNX Runtime via fastembed to stay within 512MB RAM
        self.encoder = TextEmbedding('sentence-transformers/all-MiniLM-L6-v2')
        # Fastembed returns a generator, so we convert it to a list and then to a numpy array
        self.corpus_embeddings = np.array(list(self.encoder.embed([c.text for c in self.clauses])))

    def retrieve(self, query: Query, top_k: int = 5) -> List[Clause]:
        """
        Retrieves the top_k most relevant clauses for a given query using Hybrid Retrieval and Reference Expansion.
        """
        return self._hybrid_retrieve(query, top_k)

    def retrieve_with_scores(self, query: Query, top_k: int = 5) -> List[Tuple[Clause, float]]:
        """Deprecated: use retrieve() which now returns ScoredClause."""
        results = self._hybrid_retrieve(query, top_k)
        return [(r, r.final_score) for r in results]
        
    def _hybrid_retrieve(self, query: Query, top_k: int = 5) -> List[ScoredClause]:
        # 1. BM25 Scores
        tokenized_query = query.text.lower().split()
        bm25_scores = self.bm25.get_scores(tokenized_query)
        max_bm25 = max(bm25_scores) if max(bm25_scores) > 0 else 1.0
        norm_bm25_scores = [s / max_bm25 for s in bm25_scores]

        # 2. Semantic Scores
        # embed() yields arrays; get the first one for our single query
        query_embedding = next(self.encoder.embed([query.text]))
        
        # Fastembed vectors are normalized. Cosine similarity = dot product.
        cos_scores = np.dot(self.corpus_embeddings, query_embedding)
        norm_semantic_scores = [(s + 1.0) / 2.0 for s in cos_scores]

        # 3. Combine Scores
        scored_candidates: Dict[str, ScoredClause] = {}
        for i, clause in enumerate(self.clauses):
            final_score = (norm_bm25_scores[i] * 0.5) + (norm_semantic_scores[i] * 0.5)
            scored_candidates[clause.id] = ScoredClause(
                **clause.model_dump(),
                bm25_score=round(norm_bm25_scores[i], 3),
                semantic_score=round(norm_semantic_scores[i], 3),
                final_score=round(final_score, 3),
                source="Hybrid (BM25 + Semantic)"
            )
            
        sorted_candidates = sorted(scored_candidates.values(), key=lambda x: x.final_score, reverse=True)
        top_candidates = sorted_candidates[:top_k]
        
        # 4. Policy-Reference Expansion
        expanded_results: Dict[str, ScoredClause] = {c.id: c for c in top_candidates}
        
        for candidate in top_candidates:
            refs = re.findall(r'§(\d+\.\d+(?:\.\d+)?)', candidate.text)
            for ref_id in refs:
                if ref_id not in expanded_results and ref_id in self.clause_dict:
                    referenced_clause = self.clause_dict[ref_id]
                    expanded_results[ref_id] = ScoredClause(
                        **referenced_clause.model_dump(),
                        bm25_score=0.0,
                        semantic_score=0.0,
                        final_score=candidate.final_score - 0.01,
                        source=f"Reference from §{candidate.id}"
                    )
                elif ref_id not in self.clause_dict:
                    # Match sections like §4.3
                    prefix = f"{ref_id}."
                    for cid, cobj in self.clause_dict.items():
                        if cid.startswith(prefix) and cid not in expanded_results:
                            expanded_results[cid] = ScoredClause(
                                **cobj.model_dump(),
                                bm25_score=0.0,
                                semantic_score=0.0,
                                final_score=candidate.final_score - 0.01,
                                source=f"Section {ref_id} Ref from §{candidate.id}"
                            )
                            
        # 5. Amendment Linking
        linked_results = dict(expanded_results)
        for cid in list(expanded_results.keys()):
            candidate = self.clause_dict[cid]
            if not candidate.is_amendment:
                # Base clause: pull in all its amendments
                for a_cid, a_obj in self.clause_dict.items():
                    if a_obj.is_amendment and a_obj.base_clause_id == candidate.id:
                        if a_cid not in linked_results:
                            linked_results[a_cid] = ScoredClause(
                                **a_obj.model_dump(),
                                bm25_score=0.0,
                                semantic_score=0.0,
                                final_score=expanded_results[cid].final_score - 0.02,
                                source=f"Amendment linked to base §{candidate.id}"
                            )
            elif candidate.is_amendment and candidate.base_clause_id:
                # Amendment: pull in its base clause
                b_cid = candidate.base_clause_id
                if b_cid in self.clause_dict and b_cid not in linked_results:
                    b_obj = self.clause_dict[b_cid]
                    linked_results[b_cid] = ScoredClause(
                        **b_obj.model_dump(),
                        bm25_score=0.0,
                        semantic_score=0.0,
                        final_score=expanded_results[cid].final_score - 0.02,
                        source=f"Base linked from amendment §{candidate.id}"
                    )
                    
        final_list = sorted(linked_results.values(), key=lambda x: x.final_score, reverse=True)
        return final_list
