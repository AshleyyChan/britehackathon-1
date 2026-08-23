import os
import unittest
from pathlib import Path

from core.pipeline.orchestrator import GroundedAnswerPipeline
from core.models.schemas import PipelineResult

class TestPipeline(unittest.TestCase):
    def setUp(self):
        base_dir = Path(__file__).parent.parent
        manual_path = base_dir / "policy-manual.md"
        
        if not manual_path.exists():
            self.skipTest(f"policy-manual.md not found at {manual_path}")
            
        self.pipeline = GroundedAnswerPipeline(manual_path)

    def test_pipeline_basic(self):
        query = "What is the purpose of the program?"
        result = self.pipeline.process_query(query)
        
        # In our mock, it should return a PipelineResult containing an answer or refusal
        self.assertIsInstance(result, PipelineResult)

if __name__ == '__main__':
    unittest.main()
