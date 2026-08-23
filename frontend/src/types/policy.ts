export type ResponseStatus =
  | 'SUFFICIENT'
  | 'CONFLICTING'
  | 'INSUFFICIENT'
  | 'TEMPORALLY_AMBIGUOUS';

export type RelevanceLevel = 'direct_authority' | 'supporting_provision' | 'contextual';

export type QualitativeScoreLabel = 'PRIMARY' | 'SUPPORTING' | 'CONTEXT';

export interface PolicyEvidenceClause {
  clauseId: string; // e.g. "§8.2.3"
  part: string;
  sectionTitle: string;
  exactText: string;
  relevance: RelevanceLevel;
  qualitativeLabel?: QualitativeScoreLabel;
  score?: number; // Internal retrieval score if available
}

export interface PolicyQueryRequest {
  question: string;
  eventDate?: string;
}

export interface PolicyQueryResponse {
  queryId: string;
  question: string;
  timestamp: string;
  manualVersion: string;
  status: ResponseStatus;
  confidence?: number;

  // Root-level message/field for TEMPORALLY_AMBIGUOUS (per API contract)
  message?: string;
  required_temporal_field?: string;

  // State 1: SUFFICIENT (Grounded Answer)
  groundedAnswer?: {
    summary: string;
    detailedText?: string;
    directCitation: string; // e.g. "§8.2.3"
  };

  // State 2: CONFLICTING (Policy Conflict Detected)
  conflictDetails?: {
    title: string;
    warningMessage: string;
    conflictingExcerpts: {
      clauseId: string;
      sectionTitle: string;
      excerpt: string;
      sourceSection: string;
    }[];
    supervisorGuidance: string;
  };

  // State 3: INSUFFICIENT (Not Covered by Policy Manual)
  notCoveredDetails?: {
    title: string;
    primaryMessage: string;
    nextStepGuidance: string;
  };

  // State 4: TEMPORALLY_AMBIGUOUS (Temporal Information Required)
  temporalDetails?: {
    title: string;
    generalMessage: string;
    specificMessage: string;
    requiredTemporalField: string;
    fieldLabel?: string;
  };

  // Retrieved evidence clauses for the Evidence Panel
  evidenceClauses: PolicyEvidenceClause[];
}

export interface PolicyManualSection {
  id: string;
  code: string; // e.g. "§8.2.3"
  partNumber: string;
  partTitle: string;
  sectionTitle: string;
  fullText: string;
  keywords: string[];
}
