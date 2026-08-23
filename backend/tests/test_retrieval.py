import unittest
from pathlib import Path

from core.parser.manual_parser import parse_manual
from core.retrieval.retriever import PolicyRetriever
from core.models.schemas import Query

class TestRetrieval(unittest.TestCase):
    def setUp(self):
        base_dir = Path(__file__).parent.parent
        manual_path = base_dir / "policy-manual.md"
        
        if not manual_path.exists():
            self.skipTest(f"policy-manual.md not found at {manual_path}")
            
        self.clauses = parse_manual(manual_path)
        self.retriever = PolicyRetriever(self.clauses)

    def test_retrieval_returns_multiple_candidates(self):
        query = Query(text="What happens if a recipient is temporarily absent?")
        # The prompt mentioned we should return multiple candidates (top_k > 1)
        # We will request 5 candidates
        results = self.retriever.retrieve(query, top_k=5)
        
        self.assertTrue(len(results) >= 5)
        
        # Check if the text actually relates to the keywords "temporarily absent"
        found_relevant = False
        for c in results:
            if "temporarily absent" in c.text.lower() or "absence" in c.text.lower():
                found_relevant = True
                break
                
        self.assertTrue(found_relevant, "BM25 failed to retrieve clauses containing the keywords")

if __name__ == '__main__':
    unittest.main()
