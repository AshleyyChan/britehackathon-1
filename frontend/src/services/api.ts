import { PolicyQueryRequest, PolicyQueryResponse, ResponseStatus } from '../types/policy';
import { PRESET_MOCK_RESPONSES, resolveMockQuery } from '../data/mockPolicyData';

/**
 * Configuration for the API Service layer.
 * In development / frontend preview mode, mock data is used.
 * When a real backend is mounted, USE_MOCK can be flipped to false or driven by environment config.
 */
const USE_MOCK = false;
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export class PolicyApiService {
  /**
   * Submit a policy question to the backend or mock provider.
   * Endpoint: POST /api/query
   */
  public static async queryPolicy(
    request: PolicyQueryRequest,
    forcedStatus?: ResponseStatus
  ): Promise<PolicyQueryResponse> {
    if (USE_MOCK) {
      // Realistic brief delay (200ms - 350ms)
      await new Promise((resolve) => setTimeout(resolve, 250));

      if (forcedStatus) {
        return this.getPresetByStatus(forcedStatus, request.question);
      }

      return resolveMockQuery(request.question, request.eventDate);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Policy API error: HTTP ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return mapBackendResponseToFrontend(data, request.question);
    } catch (error) {
      console.error('Backend API request failed:', error);
      throw error;
    }
  }

  /**
   * Quick utility to get canonical response fixtures for testing all 4 states:
   * SUFFICIENT | CONFLICTING | INSUFFICIENT | TEMPORALLY_AMBIGUOUS
   */
  public static getPresetByStatus(status: ResponseStatus, customQuestion?: string): PolicyQueryResponse {
    switch (status) {
      case 'SUFFICIENT': {
        const base = PRESET_MOCK_RESPONSES['evidence-timeline'];
        return {
          ...base,
          question: customQuestion || base.question,
          timestamp: new Date().toISOString(),
        };
      }
      case 'CONFLICTING': {
        const base = PRESET_MOCK_RESPONSES['reporting-conflict'];
        return {
          ...base,
          question: customQuestion || base.question,
          timestamp: new Date().toISOString(),
        };
      }
      case 'INSUFFICIENT': {
        const base = PRESET_MOCK_RESPONSES['not-covered'];
        return {
          ...base,
          question: customQuestion || base.question,
          timestamp: new Date().toISOString(),
        };
      }
      case 'TEMPORALLY_AMBIGUOUS': {
        const base = PRESET_MOCK_RESPONSES['temporal-reporting'];
        return {
          ...base,
          question: customQuestion || base.question,
          timestamp: new Date().toISOString(),
        };
      }
    }
  }
}

/**
 * Maps the raw backend response to the frontend PolicyQueryResponse interface.
 */
function mapBackendResponseToFrontend(data: any, question: string): PolicyQueryResponse {
  const evidenceClauses = (data.evidence || []).map((c: any) => ({
    clauseId: c.id,
    part: c.part || 'Policy Manual',
    sectionTitle: c.section || 'Section',
    exactText: c.text,
    relevance: 'direct_authority',
    isAmendment: c.is_amendment,
    baseClauseId: c.base_clause_id,
    amendmentName: c.amendment_name,
  }));

  const baseResponse: PolicyQueryResponse = {
    queryId: `qry-${Date.now()}`,
    question,
    timestamp: new Date().toISOString(),
    manualVersion: 'POLICY MANUAL · REV 4.2 · AMENDMENT 2026-01',
    status: data.status,
    confidence: data.confidence,
    evidenceClauses,
  };

  if (data.status === 'SUFFICIENT') {
    baseResponse.groundedAnswer = {
      summary: data.answer || '',
      directCitation: data.cited_clause_ids?.[0] || '',
    };
  } else if (data.status === 'CONFLICTING') {
    baseResponse.conflictDetails = {
      title: 'Policy Conflict Detected',
      warningMessage: 'The policy manual contains conflicting provisions.',
      supervisorGuidance: data.next_step || 'Next step: Consult a supervisor.',
      conflictingExcerpts: evidenceClauses.map((c: any) => ({
        clauseId: c.clauseId,
        sectionTitle: c.sectionTitle,
        excerpt: c.exactText,
        sourceSection: c.part,
      })),
    };
  } else if (data.status === 'INSUFFICIENT') {
    baseResponse.notCoveredDetails = {
      title: 'Not Covered by the Policy Manual',
      primaryMessage: data.reason || 'The policy manual does not establish an answer to this question.',
      nextStepGuidance: data.next_step || 'Next step: Refer the question to the appropriate program staff.',
    };
  } else if (data.status === 'TEMPORALLY_AMBIGUOUS') {
    baseResponse.temporalDetails = {
      title: 'Temporal Information Required',
      generalMessage: 'The applicable policy depends on when the relevant event occurred.',
      specificMessage: data.message || 'Please provide the date the change occurred so the applicable policy provision can be determined.',
      requiredTemporalField: data.required_temporal_field || 'event_date',
    };
  }

  return baseResponse;
}
