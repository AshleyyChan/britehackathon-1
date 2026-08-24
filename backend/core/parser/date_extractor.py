import re
from datetime import date
from core.models.schemas import Query

MONTHS = {
    "january": 1, "february": 2, "march": 3, "april": 4, "may": 5, "june": 6,
    "july": 7, "august": 8, "september": 9, "october": 10, "november": 11, "december": 12
}

def extract_dates(query_text: str) -> Query:
    q = Query(text=query_text)
    lower_text = query_text.lower()
    
    # 1. Check for periods (e.g., "February through April 2026")
    span_match = re.search(r'(january|february|march|april|may|june|july|august|september|october|november|december)\s+through\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})', lower_text)
    if span_match:
        m1 = MONTHS[span_match.group(1)]
        m2 = MONTHS[span_match.group(2)]
        y = int(span_match.group(3))
        q.period_start = date(y, m1, 1)
        q.period_end = date(y, m2, 28)
        return q

    # 2. Check for single dates
    date_pattern = r'(?:(\d{1,2})\s+)?(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})'
    matches = list(re.finditer(date_pattern, lower_text))
    if len(matches) > 0:
        match = matches[0]
        day = int(match.group(1)) if match.group(1) else 15
        month = MONTHS[match.group(2)]
        year = int(match.group(3))
        extracted_date = date(year, month, day)
        
        if "determination" in lower_text:
            q.determination_date = extracted_date
        elif "change" in lower_text or "occurred" in lower_text:
            q.event_date = extracted_date
        elif "spanning" in lower_text: 
            # E.g. "spanning 1 March 2026"
            q.period_start = date(year, month, 1)
            q.period_end = date(year, month, 28)
            
    # 3. Check for ISO dates (YYYY-MM-DD)
    iso_pattern = r'(\d{4})-(\d{2})-(\d{2})'
    iso_matches = list(re.finditer(iso_pattern, lower_text))
    if len(iso_matches) > 0:
        match = iso_matches[0]
        year = int(match.group(1))
        month = int(match.group(2))
        day = int(match.group(3))
        extracted_date = date(year, month, day)
        
        if "determination" in lower_text:
            q.determination_date = extracted_date
        elif "occurrence:" in lower_text or "change" in lower_text or "occurred" in lower_text:
            q.event_date = extracted_date
        elif "spanning" in lower_text:
            q.period_start = date(year, month, 1)
            q.period_end = date(year, month, 28)

    return q
