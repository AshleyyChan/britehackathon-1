import os
import sys
sys.path.insert(0, os.path.abspath('backend'))
from dotenv import load_dotenv
load_dotenv(r"c:\Users\ASWINI\OneDrive\Desktop\1\backend\.env")

from core.pipeline.orchestrator import GroundedAnswerPipeline
from core.models.schemas import Query
from pathlib import Path
import time

base_dir = Path(r"c:\Users\ASWINI\OneDrive\Desktop\1\backend")
manual_path = base_dir / "policy-manual.md"
amendment_path = base_dir / "Amendment No. 2026-01.md"
pipeline = GroundedAnswerPipeline(manual_path, amendment_path)

tests = [
    ("TEST A", "How many days do I have to report a change?"),
    ("TEST B", "How many days do I have to report a change? (Date of occurrence: 2025-11-01)"),
    ("TEST C", "How many days do I have to report a change? (Date of occurrence: 2026-08-25)"),
    ("TEST D", "How many days do I have to report a change? (Date of occurrence: 2026-08-26)"),
    ("TEST E", "How many days do I have to report a change? The change occurred on August 25, 2026.")
]

for name, q_text in tests:
    print(f"\n--- {name} ---")
    print(f"Query: {q_text}")
    res = pipeline.process_query(q_text)
    if res.answer:
        print(f"Status: SUFFICIENT")
        print(f"Answer: {res.answer.answer_text}")
        print(f"Cited: {res.answer.cited_clause_ids}")
    elif res.refusal:
        print(f"Status: {res.refusal.status}")
        print(f"Reason: {res.refusal.reason}")
    time.sleep(2)
