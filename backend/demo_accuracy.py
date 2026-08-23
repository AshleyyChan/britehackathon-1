import os
import json
from pathlib import Path
from core.pipeline.orchestrator import GroundedAnswerPipeline
from core.models.schemas import Query

# Manually load .env file from root
env_path = Path(__file__).parent / ".env"
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            if line.strip() and not line.startswith("#"):
                try:
                    key, val = line.strip().split("=", 1)
                    os.environ[key] = val.strip('"').strip("'")
                except ValueError:
                    pass

def run_accuracy_demo():
    base_dir = Path(__file__).parent
    manual_path = base_dir / "policy-manual.md"
    amendment_path = base_dir / "Amendment No. 2026-01.md"
    pipeline = GroundedAnswerPipeline(manual_path, amendment_path)

    print(f"=== ACCURACY DEMO (Model: {os.getenv('GEMINI_MODEL_ID')}) ===\n")

    test_cases = [
        {
            "desc": "1. Standard Grounded Question",
            "q": Query(text="What is the maximum countable resources?")
        },
        {
            "desc": "2. Out of Scope Question",
            "q": Query(text="What is the tax rate in Calder County?")
        },
        {
            "desc": "3. Temporally Ambiguous Question (Requires Date)",
            "q": Query(text="What is the income threshold for a household of 3?")
        },
        {
            "desc": "4. Pre-Amendment Question",
            "q": Query(
                text="What is the income threshold for a household of 3?",
                determination_date="2026-02-15"
            )
        },
        {
            "desc": "5. Post-Amendment Question",
            "q": Query(
                text="What is the income threshold for a household of 3?",
                determination_date="2026-04-15"
            )
        }
    ]

    for tc in test_cases:
        print(f"\\n--- {tc['desc']} ---")
        print(f"Query: {tc['q'].text}")
        if tc['q'].determination_date:
            print(f"Provided Date Context: {tc['q'].determination_date}")
        
        result = pipeline.process_query(tc['q'])
        
        if result.answer:
            print("Status: \033[92mSUFFICIENT\033[0m")
            print(f"Answer: {result.answer.answer_text}")
            print(f"Cited Clauses: {result.answer.cited_clause_ids}")
        elif result.refusal:
            color = "\033[93m" if result.refusal.status == "TEMPORALLY_AMBIGUOUS" else "\033[91m"
            print(f"Status: {color}{result.refusal.status}\033[0m")
            print(f"Reason: {result.refusal.reason}")

if __name__ == "__main__":
    run_accuracy_demo()
