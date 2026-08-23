import re
from typing import List
from pathlib import Path

from core.models.schemas import Clause

def parse_manual(filepath: str | Path) -> List[Clause]:
    """
    Parses the Markdown policy manual into structured Clause objects.
    Extracts Part, Section, and exact Clause IDs while preserving multi-line content.
    """
    clauses: List[Clause] = []
    
    current_part = ""
    current_section = ""
    
    current_clause_id = None
    current_clause_lines = []
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    for line in lines:
        line = line.strip()
        if not line:
            if current_clause_id:
                current_clause_lines.append("") # Keep paragraph breaks
            continue
            
        # Match Part
        # e.g., "# Part 1 — Scope and Definitions"
        part_match = re.match(r'^#\s+(Part\s+.*)', line)
        if part_match:
            # If we had an active clause, save it
            if current_clause_id:
                _save_clause(clauses, current_clause_id, current_clause_lines, current_part, current_section)
                current_clause_id = None
                current_clause_lines = []
            current_part = part_match.group(1).strip()
            continue
            
        # Match Section
        # e.g., "## 1.1 Purpose of the Program"
        section_match = re.match(r'^##\s+(.*)', line)
        if section_match:
            # Save active clause
            if current_clause_id:
                _save_clause(clauses, current_clause_id, current_clause_lines, current_part, current_section)
                current_clause_id = None
                current_clause_lines = []
            current_section = section_match.group(1).strip()
            continue
            
        # Match Clause start
        # e.g., "**1.1.1** The Household Support Program..."
        clause_match = re.match(r'^\*\*(\d+\.\d+\.\d+)\*\*\s+(.*)', line)
        if clause_match:
            # Save previous clause
            if current_clause_id:
                _save_clause(clauses, current_clause_id, current_clause_lines, current_part, current_section)
                
            current_clause_id = clause_match.group(1)
            current_clause_lines = [clause_match.group(2)]
            continue
            
        # Match end of document consolidated text notice
        if line.startswith('*End of consolidated text'):
            break
            
        # If it's a regular line and we are inside a clause, append it
        if current_clause_id:
            # Avoid appending header lines that might not match exactly or frontmatter
            if not line.startswith('#'):
                current_clause_lines.append(line)

    # Save the last clause if exists
    if current_clause_id:
        _save_clause(clauses, current_clause_id, current_clause_lines, current_part, current_section)
        
    return clauses

def _save_clause(clauses: List[Clause], clause_id: str, lines: List[str], part: str, section: str):
    # Join lines, remove trailing empty lines
    text = "\n".join(lines).strip()
    if text:
        clauses.append(Clause(
            id=clause_id,
            text=text,
            part=part,
            section=section
        ))
