# Decision Log — Calder County HSP Policy Assistant

## 1. Project Purpose
The Calder County HSP Policy Assistant is a policy-grounded question-answering system designed to answer Household Support Program (HSP) policy questions strictly using the official policy manual and amendments as its sole evidence source. 

The system prioritizes:
- Grounded answers over unverified generation
- Explicit clause-level citations
- Temporal and version-aware policy resolution
- Contradiction detection
- Refusal when evidence is insufficient
- Human escalation when the system cannot safely determine an answer

## 2. Core Architectural Decision
The end-to-end architecture follows a strict deterministic verification pipeline before invoking any generative AI. The flow is:

User Query
→ Query Parsing / Date Extraction
→ Hybrid Retrieval
→ Temporal / Version Resolution
→ Evidence Verification
→ Answer Generation
→ Structured Response State
→ Frontend Presentation

- **Query Parsing**: Extracts explicit and implicit temporal constraints (e.g., event dates, determination dates).
- **Hybrid Retrieval**: Fetches a broad set of candidate clauses using lexical and semantic search.
- **Temporal Resolution**: Filters the candidate set based on extracted dates and amendment effective dates to ensure only the temporally correct version of a policy is used.
- **Evidence Verification**: Evaluates if the resolved evidence is sufficient, conflicting, or insufficient to answer the query.
- **Answer Generation**: Synthesizes a response strictly from verified evidence.
- **Structured Response**: Packages the result into deterministic states for presentation.

Gemini is NOT the source of truth. The policy corpus and the deterministic verification pipeline act as the source of truth.

## 3. Evidence-First Decision
The system is explicitly designed so that it should never answer solely from the LLM's pretrained knowledge. Answers must be firmly grounded in retrieved policy clauses. 

This architecture was chosen because it:
- Prevents hallucinated policy rules
- Makes all answers auditable
- Enables precise citations
- Allows users to inspect the underlying evidence directly in the UI
- Decouples retrieval accuracy from generation capabilities

## 4. Evidence Thresholds
The system uses deterministic logic to decide whether retrieved evidence is sufficient to generate a response. The following verification states dictate the pipeline's behavior:

### SUFFICIENT
Evidence supports a single applicable policy interpretation. The answer can be safely generated based on the retrieved clauses.

### CONFLICTING
Multiple applicable policy provisions contradict each other, and the system cannot safely choose one over the other based on the current context.

### TEMPORALLY_AMBIGUOUS
The answer depends on a date (such as a determination or event date) that was not supplied by the user or cannot be unambiguously resolved.

### INSUFFICIENT / NOT COVERED
The policy corpus does not provide enough relevant evidence to answer the question.

These states are significantly safer than forcing the LLM to guess or produce an ungrounded answer.

## 5. Refusal Boundaries
The assistant MUST NOT provide a definitive answer when it operates outside safe boundaries. Refusal triggers include:
- Insufficient evidence found in the corpus
- Unresolved temporal context (e.g., missing event date)
- Unresolved policy contradictions
- Questions entirely outside the scope of the policy corpus
- Evidence that is topically related but does not support a specific requested conclusion

The guiding principle is: *"When evidence is insufficient, the system should refuse or request clarification rather than guess."*

When refusing, the UI provides an appropriate next action, such as requesting the missing date, consulting a supervisor, or referring the question to appropriate staff.

## 6. Contradiction Handling
The system proactively handles conflicting policy provisions rather than hiding them. 
- Conflicting clauses are retained as evidence.
- The system does not arbitrarily select one provision over the other.
- Contradictions produce a `CONFLICTING` response state.
- The conflicting provisions (e.g., the conflict between §4.3.2 and §9.1.4 regarding reporting timelines) are explicitly shown to the user.
- Human escalation is recommended when the conflict cannot be deterministically resolved by the system.

## 7. Data-Aware / Temporal Policy Resolution
Policy interpretation is deeply dependent on dates. The system explicitly distinguishes between:
- **Event date**: When a change of circumstances occurred
- **Determination date**: When an official assessment was made
- **Policy/amendment effective date**: When a rule change becomes active

Policy applicability often depends on when an event occurred or when a determination was made. For example, Amendment No. 2026-01 amends the income thresholds in §6.6.1 effective 1 March 2026. The system's temporal resolver ensures that an amended provision like **§6.6.1-2026-01** must be selected when its effective period applies (e.g., for an April 2026 determination), instead of blindly using the historical §6.6.1 provision. 

Similarly, the temporal behavior for reporting changes (§4.3.2) dynamically switches between historical and amended rules based on the extracted event date. Date-aware resolution is necessary because the same question can legitimately have different answers depending on the relevant date.

## 8. Hybrid Retrieval Decision
The retriever combines lexical and semantic search to maximize recall and precision:
- **BM25 / Lexical Retrieval**: Captures exact policy terminology, section numbers, explicit dates, and keywords.
- **FastEmbed / all-MiniLM-L6-v2 Semantic Retrieval**: Captures meaning, intent, and paraphrased questions.

The current hybrid scoring rationale merges these signals:
`final_score = (0.5 × normalized BM25 score) + (0.5 × normalized semantic score)`

Combining both approaches improves evidence discovery compared to relying on only one retrieval method, ensuring that both specific section lookups and conceptual questions are handled robustly.

## 9. Policy Amendments and Versioning
Amendments are seamlessly incorporated into the corpus while maintaining a strict audit trail:
- Original policy clauses remain identifiable.
- Amended clauses have explicit identifiers (e.g., appending `-2026-01`).
- Amendment metadata (effective dates, rule types, base clause IDs) are injected into the pipeline and used during policy resolution.
- The system explicitly prevents mixing historical and amended provisions when determining the applicable rule.

## 10. LLM Responsibility Boundary
Gemini is utilized as an answer-generation layer, not the policy authority. 

Gemini MAY:
- Synthesize retrieved evidence into a readable answer
- Explain the applicable policy
- Provide concise reasoning based on supplied evidence
- Produce confidence information where supported by the implementation

Gemini MUST NOT:
- Invent policy provisions
- Override the verification state
- Select unsupported rules
- Use outside knowledge as policy evidence
- Resolve contradictions without supporting evidence

## 11. Confidence vs Accuracy
The UI metric is explicitly labeled as **"Answer Confidence"** rather than "Accuracy." 

Confidence represents how strongly the verified evidence supports the generated answer based on the backend pipeline's assessment. The backend converts the existing confidence value into a percentage for presentation. This is NOT a statistical guarantee that the answer is objectively correct, avoiding misleading claims about the system's infallibility.

## 12. Security Decision
The Gemini API key remains strictly backend-only. 
- The frontend communicates entirely with the backend API.
- API credentials are not embedded or leaked in the frontend code.
- The browser receives structured API responses containing evidence and synthesized text rather than the secret key.
- All LLM calls occur securely inside the backend `AnswerGenerator`.

## 13. Local Deployment Decision
The final demonstration is intended to run locally. The full FastEmbed semantic RAG architecture requires more memory than the Render free-tier 512 MB environment reliably provides. 

This is a deployment constraint for the free tier, not an architectural limitation of the application. The local environment safely supports FastEmbed, ONNX Runtime, semantic embeddings, and full hybrid retrieval without memory exhaustion.

## 14. Failure-Safe Design
The system is built on the principle that failure should degrade toward clarification or refusal rather than hallucination.

Example flows:
- **Evidence found + verified** → generate grounded answer
- **Evidence found but date missing** → request temporal clarification
- **Conflicting evidence** → trigger conflict state + recommend escalation
- **No sufficient evidence** → state policy is not covered / refusal
- **Backend/API failure** → throw a technical error rather than fabricate a policy answer

## 15. Technical Rationale

| Decision | Rationale |
|---|---|
| Hybrid BM25 + semantic retrieval | Combines exact terminology with semantic similarity |
| Policy corpus as source of truth | Prevents LLM knowledge from becoming policy authority |
| Temporal resolution | Policy rules can change by effective date |
| Explicit contradiction state | Prevents arbitrary selection between conflicting provisions |
| Evidence citations | Makes answers auditable |
| Structured verification states | Makes system behavior deterministic and explainable |
| Backend-only Gemini key | Protects credentials |
| FastEmbed | Enables local semantic retrieval without requiring PyTorch |
| Confidence rather than accuracy | Avoids misleading claims |
| Refusal/clarification boundaries | Reduces unsupported answers |

## 16. Judge-Facing Design Principle
The central design philosophy of the Calder County HSP Policy Assistant is simple:

**"The system is designed to know when it knows, when it needs more information, and when it should refuse to answer."**

The key innovation is not simply generating an answer. It is the ability to robustly determine whether the evidence is sufficient, unambiguous, and temporally applicable *before* allowing an answer to be presented as grounded policy guidance.
