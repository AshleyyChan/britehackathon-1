import { PolicyQueryRequest, PolicyQueryResponse, ResponseStatus } from '../types/policy';
import { PRESET_MOCK_RESPONSES, resolveMockQuery } from '../data/mockPolicyData';

/**
 * Configuration for the API Service layer.
 * In development / frontend preview mode, mock data is used.
 * When a real backend is mounted, USE_MOCK can be flipped to false or driven by environment config.
 */
const USE_MOCK = false;
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://britehackathon-1.onrender.com/api';

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

      const data: PolicyQueryResponse = await response.json();
      return data;
    } catch (error) {
      console.warn('Backend API request failed or not yet reachable, falling back to mock provider:', error);
      return resolveMockQuery(request.question, request.eventDate);
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
