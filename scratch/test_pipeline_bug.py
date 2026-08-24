import os
import sys
sys.path.insert(0, os.path.abspath('backend'))
from dotenv import load_dotenv
load_dotenv(r"c:\Users\ASWINI\OneDrive\Desktop\1\backend\.env")

from core.pipeline.orchestrator import GroundedAnswerPipeline
from core.models.schemas import Query
from pathlib import Path

base_dir = Path(r"c:\Users\ASWINI\OneDrive\Desktop\1\backend")
manual_path = base_dir / "policy-manual.md"
amendment_path = base_dir / "Amendment No. 2026-01.md"
pipeline = GroundedAnswerPipeline(manual_path, amendment_path)

q_text = "How many days do I have to report a change? (Date of occurrence: 2026-08-25)"
res = pipeline.process_query(q_text)

print(f"Query: {q_text}")
if res.answer:
    print(f"Status: SUFFICIENT")
    print(f"Answer: {res.answer.answer_text}")
    print(f"Cited: {res.answer.cited_clause_ids}")
elif res.refusal:
    print(f"Status: {res.refusal.status}")
    print(f"Reason: {res.refusal.reason}")
    print(f"Next step: {res.refusal.next_step}")
