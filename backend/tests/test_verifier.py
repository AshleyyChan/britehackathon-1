import unittest
from core.models.schemas import Query, Clause, VerificationStatus
from core.verification.verifier import EvidenceVerifier

class TestVerifier(unittest.TestCase):
    def setUp(self):
        self.verifier = EvidenceVerifier()
        # Mock clauses for the tests based on policy manual
        self.clause_2_4_1 = Clause(id="2.4.1", text="A household is not eligible where the total countable resources of the household exceed $4,000.", part="Part 2", section="2.4 Resources")
        self.clause_4_3_2 = Clause(id="4.3.2", text="A recipient must report any change in household composition, income, address, or the circumstances of any household member within 10 calendar days of the change occurring...", part="Part 4", section="4.3")
        self.clause_9_1_4 = Clause(id="9.1.4", text="Where an overpayment has arisen from a change of circumstances, and the recipient reported the change within the 30 calendar days required under §4.3...", part="Part 9", section="9.1")
        self.clause_8_2_3 = Clause(id="8.2.3", text="The Department must give an applicant at least 14 days to supply requested evidence, and must extend that period on request where the applicant is taking reasonable steps to obtain it.", part="Part 8", section="8.2")
        self.clause_pet_1 = Clause(id="10.2.2", text="A suspension must be notified under §8.7 and must state what the recipient must do for the award to be reinstated.", part="Part 10", section="10.2")
        self.clause_review = Clause(id="11.2.2", text="The reviewing officer must consider the whole determination and is not limited to the matters raised by the person requesting the review.", part="Part 11", section="11.2")

    def test_1_sufficient_resources(self):
        query = Query(text="What is the maximum countable resources?")
        result = self.verifier.verify(query, [self.clause_2_4_1])
        print("\n--- TEST 1 ---")
        print(result.model_dump_json(indent=2))
        self.assertEqual(result.status, VerificationStatus.SUFFICIENT)
        self.assertIn("2.4.1", result.supporting_clause_ids)

    def test_2_insufficient_pet(self):
        query = Query(text="What happens if a recipient adopts a pet?")
        result = self.verifier.verify(query, [self.clause_pet_1])
        print("\n--- TEST 2 ---")
        print(result.model_dump_json(indent=2))
        self.assertEqual(result.status, VerificationStatus.INSUFFICIENT)

    def test_3_conflicting_reporting(self):
        query = Query(text="How many days does a recipient have to report a change?")
        result = self.verifier.verify(query, [self.clause_4_3_2, self.clause_9_1_4])
        print("\n--- TEST 3 ---")
        print(result.model_dump_json(indent=2))
        self.assertEqual(result.status, VerificationStatus.CONFLICTING)
        self.assertIn("4.3.2", result.conflicting_clause_ids)
        self.assertIn("9.1.4", result.conflicting_clause_ids)

    def test_4_sufficient_department_time(self):
        query = Query(text="How long must the Department give an applicant to provide requested evidence?")
        result = self.verifier.verify(query, [self.clause_8_2_3])
        print("\n--- TEST 4 ---")
        print(result.model_dump_json(indent=2))
        self.assertEqual(result.status, VerificationStatus.SUFFICIENT)

    def test_5_insufficient_superficially_relevant(self):
        query = Query(text="Does the reviewing officer check all matters?")
        result = self.verifier.verify(query, [self.clause_review])
        print("\n--- TEST 5 ---")
        print(result.model_dump_json(indent=2))
        self.assertEqual(result.status, VerificationStatus.INSUFFICIENT)

if __name__ == '__main__':
    unittest.main()
