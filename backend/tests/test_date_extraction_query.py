import unittest
from core.pipeline.orchestrator import GroundedAnswerPipeline
from core.models.schemas import Query
from datetime import date
from pathlib import Path
from core.parser.date_extractor import extract_dates

class TestDateExtractionQuery(unittest.TestCase):
    def setUp(self):
        # We can just initialize a dummy pipeline since we only care about process_query logic
        base_dir = Path(__file__).parent.parent
        manual_path = base_dir / "policy-manual.md"
        amendment_path = base_dir / "Amendment No. 2026-01.md"
        self.pipeline = GroundedAnswerPipeline(manual_path, amendment_path)

    def test_query_object_date_extraction(self):
        q_text = "How many days does a recipient have to report a change that occurred in April 2026?"
        # Simulate api/main.py creating a Query object with missing dates
        q = Query(text=q_text)
        self.pipeline.process_query(q)
        # Verify that the query object was mutated to have the extracted date
        self.assertEqual(q.event_date, date(2026, 4, 15))

    def test_extract_dates_direct(self):
        query1 = extract_dates("I was born in April 2026")
        self.assertEqual(query1.event_date, None)
        
        query2 = extract_dates("How many days do I have to report a change that occurred in February 2026?")
        self.assertEqual(query2.event_date, date(2026, 2, 15))
        
        query3 = extract_dates("What is the income threshold for a determination made in April 2026?")
        self.assertEqual(query3.determination_date, date(2026, 4, 15))

        # Test ISO Date Formats (YYYY-MM-DD)
        query4 = extract_dates("How many days do I have to report a change? (Date of occurrence: 2026-08-26)")
        self.assertEqual(query4.event_date, date(2026, 8, 26))

        query5 = extract_dates("What is the income threshold for a determination made on 2026-04-12?")
        self.assertEqual(query5.determination_date, date(2026, 4, 12))

if __name__ == '__main__':
    unittest.main()
