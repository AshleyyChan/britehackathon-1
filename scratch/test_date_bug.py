import os
import sys
from datetime import date
sys.path.insert(0, os.path.abspath('backend'))

from core.parser.date_extractor import extract_dates

q1 = "How many days do I have to report a change? (Date of occurrence: 2026-08-25)"
q2 = "How many days do I have to report a change? (Date of occurrence: 2026-08-26)"
q3 = "How many days do I have to report a change? The change occurred on August 25, 2026."

for q_text in [q1, q2, q3]:
    q = extract_dates(q_text)
    print(f"\nQuery: {q_text}")
    print(f"Event Date: {q.event_date}")
    print(f"Det Date: {q.determination_date}")
