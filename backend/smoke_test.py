import os
import sys
from pathlib import Path

# Provide the model directly so we know it's in the environment
os.environ["GEMINI_MODEL_ID"] = "gemini-3.6-flash"

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

# Disable tenacity retries for the smoke test to fail fast on 429
try:
    import google.genai._api_client
    def fast_fail_retry(self, func, *args, **kwargs):
        return func(*args, **kwargs)
    google.genai._api_client.BaseApiClient._retry = fast_fail_retry
except ImportError:
    pass

from google.genai.errors import ClientError
from core.pipeline.orchestrator import GroundedAnswerPipeline
from core.models.schemas import Query

def run_tests():
    # 1. Confirm Key is detected
    api_key = os.getenv("GEMINI_API_KEY")
    if api_key:
        print("API Key detected: True")
        print("Is dummy key: ", api_key == "dummy")
    else:
        print("API Key detected: False")
        sys.exit(1)

    base_dir = Path(__file__).parent
    manual_path = base_dir / "policy-manual.md"
    amendment_path = base_dir / "Amendment No. 2026-01.md"
    pipeline = GroundedAnswerPipeline(manual_path, amendment_path)

    # 2. Confirm REAL MODE is active
    verifier_real = pipeline.verifier.api_key is not None
    generator_real = pipeline.generator.api_key is not None
    print(f"REAL MODE active in Verifier: {verifier_real}")
    print(f"REAL MODE active in Generator: {generator_real}")
    print(f"TEST MODE disabled: {verifier_real and generator_real}")
    print(f"MODEL USED: {os.getenv('GEMINI_MODEL_ID')}")

    queries = [
        # 1
        Query(text="What is the maximum countable resources?"),
        # 2
        Query(text="What happens if a recipient adopts a pet?"),
        # 3
        Query(text="How many days do I have to report a change?"),
    ]

    for i, q in enumerate(queries, 1):
        print(f"\n--- Query {i} ---")
        print(f"Text: {q.text}")
        try:
            result = pipeline.process_query(q)
        except ClientError as e:
            if "429" in str(e) or (hasattr(e, 'code') and e.code == 429):
                print("Status: QUOTA_EXHAUSTED (429 RESOURCE_EXHAUSTED)")
                print("Message: Project quota has been exhausted. Failing fast.")
                sys.exit(1)
            else:
                raise e
        
        if result.answer:
            print("Status: SUFFICIENT")
            print(f"Answer: {result.answer.answer_text}")
            print(f"Cited: {result.answer.cited_clause_ids}")
        elif result.refusal:
            print(f"Status: {result.refusal.status}")
            print(f"Refusal Reason: {result.refusal.reason}")
            if result.refusal.status == "CONFLICTING":
                print(f"Conflicting Clauses: {result.refusal.conflicting_clause_ids}")

if __name__ == "__main__":
    run_tests()
