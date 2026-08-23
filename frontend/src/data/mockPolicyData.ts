import { PolicyManualSection, PolicyQueryResponse } from '../types/policy';

export const OFFICIAL_POLICY_MANUAL: PolicyManualSection[] = [
  {
    id: 'sec-2-4-1',
    code: '§2.4.1',
    partNumber: 'Part 2',
    partTitle: 'Resource Limits',
    sectionTitle: 'Maximum Countable Resources',
    fullText:
      'A household is not eligible where total countable resources exceed $4,000 at the time of initial application or formal recertification. Countable resources include cash on hand, checking accounts, unrestricted savings accounts, certificates of deposit, and negotiable instruments held directly by an adult household member.',
    keywords: ['resource', 'asset', 'limit', '4000', 'countable', 'cash', 'savings', 'eligibility'],
  },
  {
    id: 'sec-2-4-2',
    code: '§2.4.2',
    partNumber: 'Part 2',
    partTitle: 'Resource Limits',
    sectionTitle: 'Elderly and Disabled Household Resource Exceptions',
    fullText:
      'Notwithstanding §2.4.1, if at least one qualifying household member is aged 60 or older or has an established permanent disability verified under HSP criteria, the maximum countable resource limit shall be increased to $5,500.',
    keywords: ['elderly', 'disabled', '5500', 'resource', 'asset', 'exception'],
  },
  {
    id: 'sec-2-4-3',
    code: '§2.4.3',
    partNumber: 'Part 2',
    partTitle: 'Resource Limits',
    sectionTitle: 'Non-Countable Resource Exemptions',
    fullText:
      'The following assets shall be entirely exempt from countable resource determinations: primary residential dwelling, one primary motor vehicle per adult licensed driver, designated qualified retirement accounts (including 401(k), 403(b), and IRAs), and essential household goods.',
    keywords: ['exempt', 'retirement', '401k', 'vehicle', 'home', 'house', 'car'],
  },
  {
    id: 'sec-4-3-2',
    code: '§4.3.2',
    partNumber: 'Part 4',
    partTitle: 'Participant Obligations',
    sectionTitle: 'Mandatory Change Reporting Window (Client Duties)',
    fullText:
      'Participating households must report any mandatory change in household composition, address, or gross monthly income exceeding $150 within 10 calendar days of the occurrence of the change. Failure to report within 10 calendar days may result in an overpayment claim.',
    keywords: ['report', 'change', '10 days', 'reporting', 'income', 'address', 'household'],
  },
  {
    id: 'sec-8-2-3',
    code: '§8.2.3',
    partNumber: 'Part 8',
    partTitle: 'Evidence and Verification',
    sectionTitle: 'Timeframe for Supplying Requested Evidence',
    fullText:
      'The Department must give an applicant at least 14 days to supply requested evidence, with an extension on request where the applicant is taking reasonable steps to obtain it.',
    keywords: ['evidence', '14 days', 'extension', 'supply', 'applicant', 'reasonable steps', 'verification'],
  },
  {
    id: 'sec-9-1-4',
    code: '§9.1.4',
    partNumber: 'Part 9',
    partTitle: 'Program Administration',
    sectionTitle: 'Standard Case Adjustment and Notification Timelines',
    fullText:
      'For ongoing case administration and household status updates, beneficiaries shall be afforded 30 calendar days from the date of a qualifying life event to submit standard adjustment documentation and status change notifications to the district office before adverse action is initiated.',
    keywords: ['report', 'change', '30 days', 'notification', 'adjustment', 'timeline'],
  },
  {
    id: 'sec-5-1-1',
    code: '§5.1.1',
    partNumber: 'Part 5',
    partTitle: 'Income Standards',
    sectionTitle: 'Gross Monthly Income Eligibility Limits',
    fullText:
      'To qualify for HSP monthly benefits, gross countable household income must not exceed 165% of the Calder County Adjusted Federal Poverty Level for the applicable household size at initial application.',
    keywords: ['income', 'gross', 'threshold', 'poverty', '165%'],
  },
];

export const PRESET_MOCK_RESPONSES: Record<string, PolicyQueryResponse> = {
  // 1. STATE 1 — GROUNDED ANSWER (Evidence timeline: §8.2.3)
  'evidence-timeline': {
    queryId: 'qry-001',
    question: 'How long must the Department give an applicant to provide evidence?',
    timestamp: '2026-08-23T00:15:00.000Z',
    manualVersion: 'POLICY MANUAL · CONSOLIDATED 31 DEC 2025',
    status: 'SUFFICIENT',
    groundedAnswer: {
      summary:
        'The Department must give an applicant at least 14 days to supply requested evidence, with an extension on request where the applicant is taking reasonable steps to obtain it.',
      detailedText:
        'Pursuant to §8.2.3 of the policy manual, the Department is required to afford applicants a minimum period of 14 days to submit any requested verification or documentation. In cases where the applicant is actively taking reasonable steps to secure the required records, an extension must be granted upon request.',
      directCitation: '§8.2.3',
    },
    evidenceClauses: [
      {
        clauseId: '§8.2.3',
        part: 'Part 8: Evidence and Verification',
        sectionTitle: 'Timeframe for Supplying Requested Evidence',
        exactText:
          'The Department must give an applicant at least 14 days to supply requested evidence, with an extension on request where the applicant is taking reasonable steps to obtain it.',
        relevance: 'direct_authority',
        qualitativeLabel: 'PRIMARY',
        score: 18.45,
      },
    ],
  },

  // 1b. STATE 1 — GROUNDED ANSWER (Maximum countable resources: §2.4.1)
  'max-resources': {
    queryId: 'qry-002',
    question: 'What is the maximum countable resources?',
    timestamp: '2026-08-23T00:15:00.000Z',
    manualVersion: 'POLICY MANUAL · CONSOLIDATED 31 DEC 2025',
    status: 'SUFFICIENT',
    groundedAnswer: {
      summary: 'A household is not eligible where total countable resources exceed $4,000.',
      detailedText:
        'Under §2.4.1 of the policy manual, total countable resources—including cash, bank accounts, and certificates of deposit—must not exceed $4,000 at initial application or recertification.',
      directCitation: '§2.4.1',
    },
    evidenceClauses: [
      {
        clauseId: '§2.4.1',
        part: 'Part 2: Resource Limits',
        sectionTitle: 'Maximum Countable Resources',
        exactText:
          'A household is not eligible where total countable resources exceed $4,000 at the time of initial application or formal recertification. Countable resources include cash on hand, checking accounts, unrestricted savings accounts, certificates of deposit, and negotiable instruments held directly by an adult household member.',
        relevance: 'direct_authority',
        qualitativeLabel: 'PRIMARY',
        score: 16.92,
      },
      {
        clauseId: '§2.4.2',
        part: 'Part 2: Resource Limits',
        sectionTitle: 'Elderly and Disabled Household Resource Exceptions',
        exactText:
          'Notwithstanding §2.4.1, if at least one qualifying household member is aged 60 or older or has an established permanent disability verified under HSP criteria, the maximum countable resource limit shall be increased to $5,500.',
        relevance: 'supporting_provision',
        qualitativeLabel: 'SUPPORTING',
        score: 11.23,
      },
      {
        clauseId: '§2.4.3',
        part: 'Part 2: Resource Limits',
        sectionTitle: 'Non-Countable Resource Exemptions',
        exactText:
          'The following assets shall be entirely exempt from countable resource determinations: primary residential dwelling, one primary motor vehicle per adult licensed driver, designated qualified retirement accounts (including 401(k), 403(b), and IRAs), and essential household goods.',
        relevance: 'contextual',
        qualitativeLabel: 'CONTEXT',
        score: 7.84,
      },
    ],
  },

  // 2. STATE 2 — POLICY CONFLICT (How long do I have to report a change?)
  'reporting-conflict': {
    queryId: 'qry-003',
    question: 'How long do I have to report a change?',
    timestamp: '2026-08-23T00:16:00.000Z',
    manualVersion: 'POLICY MANUAL · CONSOLIDATED 31 DEC 2025',
    status: 'CONFLICTING',
    conflictDetails: {
      title: 'Policy Conflict Detected',
      warningMessage:
        'The policy manual contains conflicting provisions, so a definitive answer cannot be provided.',
      conflictingExcerpts: [
        {
          clauseId: '§4.3.2',
          sourceSection: 'Part 4: Participant Obligations',
          sectionTitle: 'Mandatory Change Reporting Window (Client Duties)',
          excerpt: '10 calendar days',
        },
        {
          clauseId: '§9.1.4',
          sourceSection: 'Part 9: Program Administration',
          sectionTitle: 'Standard Case Adjustment and Notification Timelines',
          excerpt: '30 calendar days',
        },
      ],
      supervisorGuidance: 'Next step: Consult a supervisor.',
    },
    evidenceClauses: [
      {
        clauseId: '§4.3.2',
        part: 'Part 4: Participant Obligations',
        sectionTitle: 'Mandatory Change Reporting Window (Client Duties)',
        exactText:
          'Participating households must report any mandatory change in household composition, address, or gross monthly income exceeding $150 within 10 calendar days of the occurrence of the change. Failure to report within 10 calendar days may result in an overpayment claim.',
        relevance: 'direct_authority',
        qualitativeLabel: 'PRIMARY',
        score: 15.12,
      },
      {
        clauseId: '§9.1.4',
        part: 'Part 9: Program Administration',
        sectionTitle: 'Standard Case Adjustment and Notification Timelines',
        exactText:
          'For ongoing case administration and household status updates, beneficiaries shall be afforded 30 calendar days from the date of a qualifying life event to submit standard adjustment documentation and status change notifications to the district office before adverse action is initiated.',
        relevance: 'direct_authority',
        qualitativeLabel: 'PRIMARY',
        score: 14.89,
      },
    ],
  },

  // 3. STATE 3 — NOT COVERED (Uncovered policy inquiry)
  'not-covered': {
    queryId: 'qry-004',
    question: 'Does the policy manual cover emergency lodging reimbursement?',
    timestamp: '2026-08-23T00:17:00.000Z',
    manualVersion: 'POLICY MANUAL · CONSOLIDATED 31 DEC 2025',
    status: 'INSUFFICIENT',
    notCoveredDetails: {
      title: 'Not Covered by the Policy Manual',
      primaryMessage: 'The policy manual does not establish an answer to this question.',
      nextStepGuidance: 'Next step: Refer the question to the appropriate program staff.',
    },
    evidenceClauses: [],
  },

  // 4. STATE 4 — TEMPORAL INFORMATION REQUIRED (Per API contract & prompt specification)
  'temporal-reporting': {
    queryId: 'qry-005',
    question: 'How many days do I have to report a change?',
    timestamp: '2026-08-23T00:18:00.000Z',
    manualVersion: 'POLICY MANUAL · CONSOLIDATED 31 DEC 2025',
    status: 'TEMPORALLY_AMBIGUOUS',
    message:
      'The reporting period depends on when the change of circumstances occurred. Please provide the date of the change.',
    required_temporal_field: 'event_date',
    temporalDetails: {
      title: 'Temporal Information Required',
      generalMessage:
        'The applicable policy depends on when the relevant event occurred.',
      specificMessage:
        'The reporting period depends on when the change of circumstances occurred. Please provide the date of the change.',
      requiredTemporalField: 'event_date',
      fieldLabel: 'Date of Change',
    },
    evidenceClauses: [
      {
        clauseId: '§4.3.2',
        part: 'Part 4: Participant Obligations',
        sectionTitle: 'Mandatory Change Reporting Window (Client Duties)',
        exactText:
          'Participating households must report any mandatory change in household composition, address, or gross monthly income exceeding $150 within 10 calendar days of the occurrence of the change. Failure to report within 10 calendar days may result in an overpayment claim.',
        relevance: 'direct_authority',
        qualitativeLabel: 'PRIMARY',
        score: 15.12,
      },
      {
        clauseId: '§9.1.4',
        part: 'Part 9: Program Administration',
        sectionTitle: 'Standard Case Adjustment and Notification Timelines',
        exactText:
          'For ongoing case administration and household status updates, beneficiaries shall be afforded 30 calendar days from the date of a qualifying life event to submit standard adjustment documentation and status change notifications to the district office before adverse action is initiated.',
        relevance: 'supporting_provision',
        qualitativeLabel: 'SUPPORTING',
        score: 13.85,
      },
    ],
  },
};

/**
 * Intelligent Mock Query Resolver:
 * Routes canonical questions or matches keywords to return rich, structured responses.
 */
export function resolveMockQuery(question: string, eventDate?: string): PolicyQueryResponse {
  const normalized = question.trim().toLowerCase();

  // If a clarified event date is attached (e.g. from the Ask Again action in Temporal state),
  // return a Grounded Answer evaluated against that specific event date.
  if (eventDate || normalized.includes('date of occurrence:') || normalized.includes('date:')) {
    const matchedDate = eventDate || question.match(/date.*?:?\s*([\d-]+)/i)?.[1] || 'selected date';
    return {
      queryId: `qry-${Date.now()}`,
      question,
      timestamp: new Date().toISOString(),
      manualVersion: 'POLICY MANUAL · CONSOLIDATED 31 DEC 2025',
      status: 'SUFFICIENT',
      groundedAnswer: {
        summary: `For changes occurring on ${matchedDate}, participating households must report mandatory changes within 10 calendar days of the occurrence pursuant to §4.3.2.`,
        detailedText: `Under §4.3.2 of the consolidated policy manual in effect for the occurrence date of ${matchedDate}, changes in household composition, address, or gross income exceeding $150 must be reported within 10 calendar days.`,
        directCitation: '§4.3.2',
      },
      evidenceClauses: [
        {
          clauseId: '§4.3.2',
          part: 'Part 4: Participant Obligations',
          sectionTitle: 'Mandatory Change Reporting Window (Client Duties)',
          exactText:
            'Participating households must report any mandatory change in household composition, address, or gross monthly income exceeding $150 within 10 calendar days of the occurrence of the change. Failure to report within 10 calendar days may result in an overpayment claim.',
          relevance: 'direct_authority',
          qualitativeLabel: 'PRIMARY',
          score: 17.5,
        },
      ],
    };
  }

  // 1. Evidence timeline inquiry -> Must be GROUNDED in §8.2.3
  if (
    normalized.includes('give an applicant to provide evidence') ||
    normalized.includes('provide evidence') ||
    normalized.includes('supply requested evidence') ||
    normalized.includes('supply evidence') ||
    normalized.includes('evidence deadline') ||
    normalized.includes('days to supply') ||
    normalized.includes('8.2.3') ||
    normalized.includes('14 days')
  ) {
    return {
      ...PRESET_MOCK_RESPONSES['evidence-timeline'],
      question,
      timestamp: new Date().toISOString(),
    };
  }

  // 2. Resource limit inquiry -> Grounded in §2.4.1
  if (
    normalized.includes('countable resource') ||
    normalized.includes('resource limit') ||
    normalized.includes('maximum resource') ||
    normalized.includes('asset limit') ||
    normalized.includes('4,000') ||
    normalized.includes('4000')
  ) {
    return {
      ...PRESET_MOCK_RESPONSES['max-resources'],
      question,
      timestamp: new Date().toISOString(),
    };
  }

  // 3. Temporal Inquiry: "How many days do I have to report a change?" per prompt specification
  if (
    normalized.includes('how many days do i have to report') ||
    normalized.includes('how many days to report') ||
    normalized.includes('temporal') ||
    normalized.includes('when did the change')
  ) {
    return {
      ...PRESET_MOCK_RESPONSES['temporal-reporting'],
      question,
      timestamp: new Date().toISOString(),
    };
  }

  // 4. Policy Conflict inquiry: "How long do I have to report a change?"
  if (
    normalized.includes('how long do i have to report') ||
    normalized.includes('report a change') ||
    normalized.includes('report change') ||
    normalized.includes('reporting change') ||
    normalized.includes('conflict')
  ) {
    return {
      ...PRESET_MOCK_RESPONSES['reporting-conflict'],
      question,
      timestamp: new Date().toISOString(),
    };
  }

  // 5. Retirement / 401(k) exemption -> Grounded in §2.4.3
  if (normalized.includes('retirement') || normalized.includes('401k') || normalized.includes('401(k)')) {
    return {
      queryId: `qry-${Date.now()}`,
      question,
      timestamp: new Date().toISOString(),
      manualVersion: 'POLICY MANUAL · CONSOLIDATED 31 DEC 2025',
      status: 'SUFFICIENT',
      groundedAnswer: {
        summary:
          'Qualified retirement accounts (including 401(k), 403(b), and IRAs) are exempt from countable resource determinations.',
        detailedText:
          'Under §2.4.3 of the policy manual, designated qualified retirement accounts are categorized as non-countable resource exemptions.',
        directCitation: '§2.4.3',
      },
      evidenceClauses: [
        {
          clauseId: '§2.4.3',
          part: 'Part 2: Resource Limits',
          sectionTitle: 'Non-Countable Resource Exemptions',
          exactText:
            'The following assets shall be entirely exempt from countable resource determinations: primary residential dwelling, one primary motor vehicle per adult licensed driver, designated qualified retirement accounts (including 401(k), 403(b), and IRAs), and essential household goods.',
          relevance: 'direct_authority',
          qualitativeLabel: 'PRIMARY',
          score: 15.6,
        },
      ],
    };
  }

  // 6. Default fallback for questions not covered by the policy manual
  return {
    queryId: `qry-${Date.now()}`,
    question,
    timestamp: new Date().toISOString(),
    manualVersion: 'POLICY MANUAL · CONSOLIDATED 31 DEC 2025',
    status: 'INSUFFICIENT',
    notCoveredDetails: {
      title: 'Not Covered by the Policy Manual',
      primaryMessage: 'The policy manual does not establish an answer to this question.',
      nextStepGuidance: 'Next step: Refer the question to the appropriate program staff.',
    },
    evidenceClauses: [],
  };
}
