import unittest
import os
from pathlib import Path
from core.pipeline.orchestrator import GroundedAnswerPipeline
from core.models.schemas import PipelineResult

class TestIntegration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        base_dir = Path(__file__).parent.parent
        manual_path = base_dir / "policy-manual.md"
        amendment_path = base_dir / "Amendment No. 2026-01.md"
        cls.pipeline = GroundedAnswerPipeline(manual_path, amendment_path)

    def test_1_sufficient_resources(self):
        query = "What is the maximum countable resources a household can have?"
        print(f"\n[Running TEST 1] {query}")
        result = self.pipeline.process_query(query)
        self.assertIsNotNone(result.answer)
        self.assertIsNone(result.refusal)
        self.assertIn("2.4.1", result.answer.cited_clause_ids)
        print("-> Result: SUFFICIENT. Answer:", result.answer.answer_text)

    def test_2_insufficient_pet(self):
        query = "What happens if a recipient adopts a pet?"
        print(f"\n[Running TEST 2] {query}")
        result = self.pipeline.process_query(query)
        self.assertIsNone(result.answer)
        self.assertIsNotNone(result.refusal)
        self.assertIn("does not establish", result.refusal.reason.lower())
        print("-> Result: INSUFFICIENT. Refusal Reason:", result.refusal.reason)

    def test_3_conflicting_reporting(self):
        query = "How many days does a recipient have to report a change of circumstances?"
        print(f"\n[Running TEST 3] {query}")
        result = self.pipeline.process_query(query)
        self.assertIsNone(result.answer)
        self.assertIsNotNone(result.refusal)
        self.assertIn("depends on a date", result.refusal.reason.lower())
        print("-> Result: TEMPORALLY AMBIGUOUS. Refusal Reason:", result.refusal.reason)

    def test_4_sufficient_department_time(self):
        query = "How long must the Department give an applicant to provide requested evidence?"
        print(f"\n[Running TEST 4] {query}")
        result = self.pipeline.process_query(query)
        self.assertIsNotNone(result.answer)
        self.assertIsNone(result.refusal)
        self.assertIn("8.2.3", result.answer.cited_clause_ids)
        print("-> Result: SUFFICIENT. Answer:", result.answer.answer_text)

    # New Temporal Tests
    def test_temporal_1_historical_reporting(self):
        query = "How many days does a recipient have to report a change that occurred in February 2026?"
        result = self.pipeline.process_query(query)
        self.assertIsNotNone(result.refusal)
        self.assertIn("conflicting", result.refusal.reason.lower())
        self.assertIn("4.3.2", result.refusal.reason)
        self.assertIn("9.1.4", result.refusal.reason)

    def test_temporal_2_post_amendment_reporting(self):
        query = "How many days does a recipient have to report a change that occurred in April 2026?"
        result = self.pipeline.process_query(query)
        self.assertIsNotNone(result.answer)
        self.assertIn("4.3.2-2026-01", result.answer.cited_clause_ids)

    def test_temporal_3_missing_date(self):
        query = "How many days do I have to report a change?"
        result = self.pipeline.process_query(query)
        self.assertIsNotNone(result.refusal)
        self.assertIn("depends on a date", result.refusal.reason.lower())

    def test_temporal_4_february_determination(self):
        query = "What is the income threshold for a household of 3 for a determination made in February 2026?"
        result = self.pipeline.process_query(query)
        self.assertIsNotNone(result.answer)
        self.assertIn("6.6.1", result.answer.cited_clause_ids)
        self.assertNotIn("6.6.1-2026-01", result.answer.cited_clause_ids)
        self.assertIn("$2,000", result.answer.answer_text)

    def test_temporal_5_april_determination(self):
        query = "What is the income threshold for a household of 3 for a determination made in April 2026?"
        result = self.pipeline.process_query(query)
        self.assertIsNotNone(result.answer)
        self.assertIn("6.6.1-2026-01", result.answer.cited_clause_ids)
        self.assertNotIn("6.6.1", result.answer.cited_clause_ids)
        self.assertIn("$2,075", result.answer.answer_text)

    def test_temporal_6_claim_spanning(self):
        query = "What is the income threshold for a claim spanning 1 March 2026?"
        result = self.pipeline.process_query(query)
        self.assertIsNotNone(result.answer)
        self.assertIn("6.6.1", result.answer.cited_clause_ids)
        self.assertIn("6.6.1-2026-01", result.answer.cited_clause_ids)

    def test_temporal_7_historical_reporting_conflict_again(self):
        query = "If a change occurred in February 2026, how many days?"
        result = self.pipeline.process_query(query)
        self.assertIsNotNone(result.refusal)
        self.assertIn("conflicting", result.refusal.reason.lower())

    def test_temporal_8_post_amendment_again(self):
        query = "If a change occurred in April 2026, how many days?"
        result = self.pipeline.process_query(query)
        self.assertIsNotNone(result.answer)

if __name__ == '__main__':
    unittest.main()
