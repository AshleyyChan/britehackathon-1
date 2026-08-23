import re
from typing import List
from pathlib import Path
from datetime import date
from core.models.schemas import Clause, ApplicabilityRule

def parse_amendment_2026_01(filepath: str | Path) -> List[Clause]:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    clauses: List[Clause] = []

    def get_section_text(start_str, end_str=None):
        start_idx = content.find(start_str)
        if start_idx == -1: return ""
        start_idx += len(start_str)
        if end_str:
            end_idx = content.find(end_str, start_idx)
            return content[start_idx:end_idx].strip()
        return content[start_idx:].strip()

    amendment_name = "Amendment No. 2026-01"
    effective_date = date(2026, 3, 1)

    # 1. Earnings disregard (6.4.1)
    text_1 = get_section_text("## 1. Earnings disregard\n\n", "## 2.")
    clauses.append(Clause(
        id="6.4.1-2026-01",
        text=text_1,
        part="Part 6",
        section="6.4 Earnings disregard",
        is_amendment=True,
        base_clause_id="6.4.1",
        amendment_name=amendment_name,
        applicability_rule=ApplicabilityRule(date_type=["DETERMINATION_DATE", "PERIOD_DATE"], effective_date=effective_date)
    ))

    # 2. Reporting of changes of circumstances (4.3.2 and 9.1.4)
    text_2 = get_section_text("## 2. Reporting of changes of circumstances\n\n", "## 3.")
    t2_1 = re.search(r'\*\*2\.1\*\*.*?(?=\*\*2\.2\*\*|$)', text_2, re.DOTALL).group(0).strip()
    clauses.append(Clause(
        id="4.3.2-2026-01",
        text=t2_1,
        part="Part 4",
        section="4.3 Recipient obligations",
        is_amendment=True,
        base_clause_id="4.3.2",
        amendment_name=amendment_name,
        applicability_rule=ApplicabilityRule(date_type=["EVENT_DATE"], effective_date=effective_date)
    ))

    t2_2 = re.search(r'\*\*2\.2\*\*.*?(?=\*Note|$)', text_2, re.DOTALL).group(0).strip()
    clauses.append(Clause(
        id="9.1.4-2026-01",
        text=t2_2,
        part="Part 9",
        section="9.1 Establishing an overpayment",
        is_amendment=True,
        base_clause_id="9.1.4",
        amendment_name=amendment_name,
        applicability_rule=ApplicabilityRule(date_type=["EVENT_DATE"], effective_date=effective_date)
    ))

    # 3. Income thresholds (6.6.1)
    text_3 = get_section_text("## 3. Income thresholds\n\n", "## 4.")
    clauses.append(Clause(
        id="6.6.1-2026-01",
        text=text_3,
        part="Part 6",
        section="6.6 Income thresholds",
        is_amendment=True,
        base_clause_id="6.6.1",
        amendment_name=amendment_name,
        applicability_rule=ApplicabilityRule(date_type=["DETERMINATION_DATE", "PERIOD_DATE"], effective_date=effective_date)
    ))

    # 4. Sanctions (10.5.2 and 10.5.3A)
    text_4 = get_section_text("## 4. Sanctions\n\n", "## 5.")
    t4_1 = re.search(r'\*\*4\.1\*\*.*?(?=\*\*4\.2\*\*|$)', text_4, re.DOTALL).group(0).strip()
    clauses.append(Clause(
        id="10.5.2-2026-01",
        text=t4_1,
        part="Part 10",
        section="10.5 Sanctions",
        is_amendment=True,
        base_clause_id="10.5.2",
        amendment_name=amendment_name,
        applicability_rule=ApplicabilityRule(date_type=["DETERMINATION_DATE"], effective_date=effective_date)
    ))

    t4_2 = re.search(r'\*\*4\.2\*\*.*', text_4, re.DOTALL).group(0).strip()
    clauses.append(Clause(
        id="10.5.3A-2026-01",
        text=t4_2,
        part="Part 10",
        section="10.5 Sanctions",
        is_amendment=True,
        base_clause_id="10.5.3A",
        amendment_name=amendment_name,
        applicability_rule=ApplicabilityRule(date_type=["DETERMINATION_DATE"], effective_date=effective_date)
    ))

    return clauses
