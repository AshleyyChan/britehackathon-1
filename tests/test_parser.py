import os
import re
import unittest
from pathlib import Path
from core.parser.manual_parser import parse_manual

class TestParser(unittest.TestCase):
    def test_parse_manual(self):
        # Determine paths
        base_dir = Path(__file__).parent.parent
        manual_path = base_dir / "policy-manual.md"
        
        if not manual_path.exists():
            self.skipTest(f"policy-manual.md not found at {manual_path}")
            
        clauses = parse_manual(manual_path)
        
        # Manually count all **X.Y.Z** in the file
        with open(manual_path, 'r', encoding='utf-8') as f:
            content = f.read()
        expected_ids = re.findall(r'^\*\*(\d+\.\d+\.\d+)\*\*', content, re.MULTILINE)
        
        # Test that all policy clauses are correctly extracted
        self.assertEqual(len(clauses), len(expected_ids))
        
        # Check specific clauses based on user feedback
        # 4.3.2, 4.3.3, 4.3.4
        clause_ids = [c.id for c in clauses]
        self.assertIn("4.3.2", clause_ids)
        self.assertIn("4.3.3", clause_ids)
        self.assertIn("4.3.4", clause_ids)
        
        # Check multi-line text logic in a clause
        c_212 = next(c for c in clauses if c.id == "2.1.2")
        self.assertIn("(a) is resident", c_212.text)
        self.assertIn("(f) has made a valid application", c_212.text)

if __name__ == '__main__':
    unittest.main()
