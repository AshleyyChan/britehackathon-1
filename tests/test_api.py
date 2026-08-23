import unittest
from fastapi.testclient import TestClient
from api.main import app

class TestAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})

    def test_1_grounded_answer(self):
        response = self.client.post("/api/query", json={
            "question": "What is the maximum countable resources a household can have?"
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "SUFFICIENT")
        self.assertIn("answer", data)
        self.assertIn("cited_clause_ids", data)
        self.assertIn("confidence", data)
        self.assertIn("evidence", data)

    def test_2_policy_conflict(self):
        # We need a query that causes CONFLICTING.
        # "How many days do I have to report a change?" is TEMPORALLY_AMBIGUOUS without a date.
        # With an event_date before March 2026, it's CONFLICTING!
        response = self.client.post("/api/query", json={
            "question": "How many days do I have to report a change?",
            "event_date": "2026-02-15"
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "CONFLICTING")
        self.assertIn("reason", data)
        self.assertIn("next_step", data)
        self.assertIn("conflicting_clause_ids", data)
        self.assertIn("evidence", data)

    def test_3_not_covered(self):
        response = self.client.post("/api/query", json={
            "question": "Can I use the funds to adopt a pet?"
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "INSUFFICIENT")
        self.assertIn("reason", data)
        self.assertIn("next_step", data)
        self.assertIn("evidence", data)

    def test_4_temporally_ambiguous(self):
        response = self.client.post("/api/query", json={
            "question": "How many days do I have to report a change?"
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "TEMPORALLY_AMBIGUOUS")
        self.assertIn("message", data)
        self.assertEqual(data["required_temporal_field"], "event_date")
        self.assertIn("evidence", data)

    def test_5_temporal_follow_up(self):
        # Temporal follow-up with an explicit event_date after March 2026 => SUFFICIENT
        response = self.client.post("/api/query", json={
            "question": "How many days do I have to report a change?",
            "event_date": "2026-04-15"
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "SUFFICIENT")
        self.assertIn("answer", data)
        self.assertIn("cited_clause_ids", data)
        self.assertIn("evidence", data)

if __name__ == "__main__":
    unittest.main()
