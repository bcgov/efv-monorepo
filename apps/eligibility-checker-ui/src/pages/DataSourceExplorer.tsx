import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Callout } from '@bcgov/design-system-react-components';
import './DataSourceExplorer.css';

interface Contact {
  name: string;
  title: string;
  email: string;
  phone: string;
}

interface DataShape {
  id: string;
  label: string;
  description: string;
  attributes: string[];
  purpose: string;
}

interface IntegrationOption {
  id: number;
  label: string;
  summary: string;
  meetsRequirements: 'Full' | 'Partial' | 'No' | 'Future';
  cost: string;
  feasibility: string;
  recommended: boolean;
  description: string;
  risks: string[];
  advantages?: string[];
}

interface GlossaryEntry {
  term: string;
  definition: string;
}

interface IncomeCode {
  code: string;
  description: string;
  inMOU: boolean;
}

interface RecordType {
  code: string;
  label: string;
  direction: string;
  description: string;
}

interface CostTier {
  range: string;
  cost: string;
}

interface AccessMethod {
  id: string;
  label: string;
  tag: string;
  tagVariant: 'success' | 'warning' | 'info';
  flow: string[];
  description: string;
}

interface KnownConstraint {
  label: string;
  detail: string;
  severity: 'high' | 'medium' | 'info';
}

interface MatchingConsideration {
  title: string;
  description: string;
}

interface BackgroundItem {
  title: string;
  content: string;
}

interface OwnershipType {
  type: string;
  definition: string;
}

interface PlateStatus {
  status: string;
  description: string;
}

interface DataSourceProfile {
  id: string;
  name: string;
  shortName: string;
  description: string;
  category: 'provincial' | 'federal' | 'utility' | 'other';
  relatedFactors: string[];
  overview: {
    mandate: string;
    relevance: string;
    keyPoints: string[];
  };
  contacts: {
    primary: Contact[];
    secondary: Contact[];
  };
  dataRequirements: DataShape[];
  integrationOptions: IntegrationOption[];
  glossary: GlossaryEntry[];
  extraTabs?: string[];
  // CRA-specific
  incomeCodes?: IncomeCode[];
  recordTypes?: RecordType[];
  costTiers?: CostTier[];
  matchingCriteria?: { primary: string; secondary: string[]; note: string };
  processSteps?: { step: number; title: string; description: string }[];
  validationSteps?: string[];
  painPoints?: string[];
  // ICBC-specific
  accessMethods?: AccessMethod[];
  sdprCurrentState?: string;
  knownConstraints?: KnownConstraint[];
  matchingKeys?: { label: string; keys: string[] }[];
  matchingConsiderations?: MatchingConsideration[];
  comparisonTable?: { headers: string[]; rows: string[][] };
  backgroundItems?: BackgroundItem[];
  openQuestions?: string[];
  businessRules?: string[];
  ownershipTypes?: OwnershipType[];
  plateStatuses?: PlateStatus[];
  existingChannels?: { title: string; description: string; note?: string }[];
  dataTypesSummary?: { label: string; who: string; needed: boolean }[];
  scopeCards?: { title: string; description: string }[];
  // BCSC-specific
  purposeConditions?: { num: number; description: string }[];
  iasSources?: { label: string; note: string }[];
  scopeIn?: string[];
  scopeOut?: string[];
  policyAuthority?: { title: string; description: string };
  attributeMap?: { sdpr: string; ias: string; note: string }[];
  dataDictionary?: { term: string; definition: string }[];
  attributePurposes?: { attr: string; icon: string; purpose: string }[];
  bcscConstraints?: { label: string; detail: string; severity: 'high' | 'medium' | 'info' }[];
  architectureFlows?: { from: string; to: string; detail: string }[];
  bpsPatterns?: { title: string; items: string[] }[];
  bpsNote?: string;
  advantages?: string[];
}

type SectionId = 'overview' | 'contacts' | 'requirements' | 'options' | 'glossary' | 'income' | 'technical' | 'process' | 'matching' | 'background';

const baseSections: { id: SectionId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'requirements', label: 'Data Requirements' },
  { id: 'options', label: 'Integration Options' },
  { id: 'glossary', label: 'Glossary' },
];

const extraTabDefs: Record<string, { id: SectionId; label: string }> = {
  'income': { id: 'income', label: 'Income Data' },
  'technical': { id: 'technical', label: 'Technical' },
  'process': { id: 'process', label: 'SDPR Process' },
  'matching': { id: 'matching', label: 'Matching' },
  'background': { id: 'background', label: 'Background' },
};

const dataSourceProfiles: DataSourceProfile[] = [
  {
    id: 'ltsa',
    name: 'Land Title & Survey Authority',
    shortName: 'LTSA',
    description: 'British Columbia\'s land title and survey authority responsible for operating and maintaining the land title and survey systems.',
    category: 'provincial',
    relatedFactors: ['Asset Verification', 'Property Ownership', 'BC Residency Verification'],
    overview: {
      mandate: 'LTSA operates the land title and survey systems for British Columbia, maintaining records of property ownership, title transfers, mortgages, and legal survey information.',
      relevance: 'Property ownership data from LTSA is critical for eligibility verification. It enables determination of whether applicants or family unit members hold real property assets, identifies recent dispositions that may affect eligibility, and supports residency verification through property records.',
      keyPoints: [
        'Maintains Land Title Register (LTR) with current ownership records',
        'Maintains Legacy Owner Title Register (LOTR) for historical searches',
        'Property data includes PIDs, title numbers, registered owners, and mortgage details',
        'Name-based searches are available but subject to matching limitations',
        'Currently exploring verified transaction services linking people to parcels',
      ],
    },
    contacts: {
      primary: [
        { name: 'Carlos MacDonald', title: 'Director of Land Titles', email: 'carlos.macdonald@ltsa.ca', phone: '250-410-0598' },
        { name: 'Steve Carter', title: 'Director, Customer Support', email: 'steve.carter@ltsa.ca', phone: '604-630-9633' },
      ],
      secondary: [
        { name: 'Henry Lio', title: 'Manager, Customer Support', email: 'Henry.Lio@ltsa.ca', phone: '604-630-9630' },
        { name: 'Sonia Hobbs', title: 'Director, Business Solutions', email: 'Sonia.Hobbs@landsure.ca', phone: '—' },
        { name: 'Mark Parsons', title: 'Director, Policy and Legislation', email: 'Mark.Parsons@ltsa.ca', phone: '—' },
      ],
    },
    dataRequirements: [
      {
        id: 'person',
        label: 'Person',
        description: 'Represents the applicant and all members of their family unit.',
        attributes: [
          'First Name',
          'Middle Name',
          'Last Name',
          'Date of Birth',
          'Role in Family Unit (Applicant / Spouse / Dependant)',
        ],
        purpose: 'Used to identify individuals for searches, match ownership records, and interpret relationships.',
      },
      {
        id: 'current-property',
        label: 'Property (Current)',
        description: 'Represents properties currently owned by any member of the family unit.',
        attributes: [
          'Property Address',
          'Parcel Identifier (PID)',
          'Title Number',
          'Registered Owner(s)',
          'Ownership Percentage',
          'Monthly Property Tax',
        ],
        purpose: 'Determine whether the family unit holds non-exempt assets. Identify possible equity or rental income.',
      },
      {
        id: 'former-property',
        label: 'Property (Former)',
        description: 'Represents properties previously owned by family unit members.',
        attributes: [
          'Property Address',
          'Parcel Identifier (PID)',
          'Title Number',
          'Ownership Percentage prior to disposition',
          'Date of disposition',
          'Purchaser information',
          'Sale price',
        ],
        purpose: 'Identify asset transfers within the 2-year lookback period. Detect dispositions at less than fair market value.',
      },
      {
        id: 'mortgage',
        label: 'Mortgage',
        description: 'Represents registered mortgage information associated with owned properties.',
        attributes: [
          'Mortgage Reference Number',
          'Date of Mortgage',
          'Loan Amount (Principal)',
          'Current Balance',
          'Monthly Payments',
          'Borrower(s): Name, job title, address',
          'Lender(s): Bank name, address',
        ],
        purpose: 'Assess equity and encumbrances. Identify financial obligations relevant to eligibility.',
      },
    ],
    integrationOptions: [
      {
        id: 1,
        label: 'Option 1: Existing LTR + LOTR APIs',
        summary: 'Use existing LTR Title Direct Search API by PID/Title Number + LOTR API by Owner Name.',
        meetsRequirements: 'Partial',
        cost: 'Low',
        feasibility: 'High',
        recommended: false,
        description: 'Leverages existing API infrastructure with no new development needed from LTSA. However, requires the consuming system to already know the PID or Title Number.',
        risks: [
          'No person identifier forces consumer system to know PID',
          'False positives/negatives on name matching',
          'Per-consumer authentication setup required',
          'Not compliant with developing OpenAPI spec',
        ],
      },
      {
        id: 2,
        label: 'Option 2: New Connector API',
        summary: 'DIFT team builds a connector API emulating myLTSA search capabilities.',
        meetsRequirements: 'Full',
        cost: 'High',
        feasibility: 'Medium',
        recommended: false,
        description: 'Search by Civic Address, Owner Name, PID across LTR + LOTR. Provides comprehensive coverage but requires significant development effort.',
        risks: [
          'Name-to-property association still error prone',
          'Risk of large data dumps requiring human review',
          'Carries all risks from Option 1',
        ],
      },
      {
        id: 3,
        label: 'Option 3: Manual myLTSA Search',
        summary: 'Use myLTSA portal to manually search by PID, Title Number, Owner Name, Civic Address.',
        meetsRequirements: 'No',
        cost: '—',
        feasibility: '—',
        recommended: false,
        description: 'Status quo manual approach. Human data collection is not objective and bot collection is unreliable and fragile.',
        risks: [
          'Fully manual — status quo',
          'Human data collection is not objective',
          'Bot collection is unreliable and fragile',
        ],
      },
      {
        id: 4,
        label: 'Option 4: LTSA Builds New API (Recommended)',
        summary: 'LTSA develops a new standards-compliant API with name search, including DOB if available.',
        meetsRequirements: 'Full',
        cost: 'Medium',
        feasibility: 'Medium',
        recommended: true,
        description: 'Combines the benefits of Option 2 with LTSA ownership and maintenance. LTSA develops and maintains the API, ensuring data quality and long-term sustainability.',
        risks: [
          'Person Name search still requires fuzzy matching',
          'LTSA may not agree or timelines may be long',
        ],
      },
      {
        id: 5,
        label: 'Option 5: Verified Transaction (Future)',
        summary: 'LTSA\'s pilot Verified Transaction service links people with parcels/titles via credentials.',
        meetsRequirements: 'Future',
        cost: 'Medium',
        feasibility: 'Low (now)',
        recommended: false,
        description: 'Voluntary, currently in pilot. Uses verifiable credentials to link people with parcels and titles. Promising for the future but not ready for production.',
        risks: [
          'Not ready now',
          'Voluntary participation limits coverage',
        ],
      },
    ],
    glossary: [
      { term: 'PID (Parcel Identifier)', definition: 'A unique nine-digit number assigned to a parcel of land registered in the BC Land Title Office.' },
      { term: 'Title Number', definition: 'A unique number assigned to each certificate of title registered in the Land Title Register.' },
      { term: 'LTR (Land Title Register)', definition: 'The current electronic register of land titles maintained by LTSA.' },
      { term: 'LOTR (Legacy Owner Title Register)', definition: 'A historical register that enables searching by owner name for titles filed before electronic conversion.' },
      { term: 'Family Unit', definition: 'The applicant, their spouse (if any), and any dependants, as defined by program legislation.' },
      { term: 'Lookback Period', definition: 'The 2-year period preceding the application date during which property dispositions are examined for eligibility.' },
      { term: 'Fair Market Value', definition: 'The price that a property would sell for on the open market under normal conditions.' },
      { term: 'Disposition', definition: 'The transfer, sale, or other conveyance of property ownership from one party to another.' },
    ],
  },
  {
    id: 'cra',
    name: 'Canada Revenue Agency',
    shortName: 'CRA',
    description: 'Federal agency administering tax laws and delivering benefit programs for the Government of Canada.',
    category: 'federal',
    relatedFactors: ['Income Within Defined Range', 'BC Residency Verification'],
    extraTabs: ['income', 'technical', 'process'],
    overview: {
      mandate: 'CRA administers tax laws for the Government of Canada and most provinces and territories. It collects income tax returns and delivers various benefit and credit programs. The Income Verification Program (IVP) enables provinces and territories to verify taxpayer income data for eligibility determinations.',
      relevance: 'CRA data assists SDPR in verifying one core eligibility condition: the family unit income cannot equal or exceed the income assistance rates for a family unit of their size and circumstances, plus any recurring supplements for anyone already receiving assistance in the previous month who would still be eligible.',
      keyPoints: [
        'A Memorandum of Understanding (MOU) between the provincial body and CRA must be on file',
        'Individual consent is required at application time to authorize CRA to release taxpayer information',
        'Data is exchanged via SFTP using Entrust PKI encryption — responses typically returned within hours',
        'Primary identifier: Social Insurance Number (SIN) plus 2 of 3 secondary fields (surname, given name, DOB)',
        'Full onboarding process takes approximately 4–6 weeks to production',
        'Free for 1–499 requests per quarter; tiered pricing above that',
        'Multiple BC programs already use CRA data (SDPR, ECC, HLTH, FIN, BC Hydro, BC Housing)',
      ],
    },
    contacts: {
      primary: [
        { name: 'Treana Clarke', title: 'Manager, Intergovernmental Relations — Income Tax Advisory (FIN)', email: 'Treana.Clarke@gov.bc.ca', phone: '778-698-1764' },
      ],
      secondary: [
        { name: 'Isabelle Tremblay', title: 'Manager, Provincial & Territorial Partnerships (CRA)', email: 'Isabelle.Tremblay@cra-arc.gc.ca', phone: '(343) 542-4739' },
        { name: 'Angela Lacoste', title: 'Senior Programs Officer, P&T Partnerships (CRA)', email: 'Angela.Lacoste@cra-arc.gc.ca', phone: '(873) 355-5688' },
        { name: 'Samantha Clarke', title: 'Programs Officer, P&T Partnerships (CRA)', email: 'Samantha.Clarke2@cra-arc.gc.ca', phone: '(343) 575-6769' },
        { name: 'Curtis Bell', title: 'Director, Provincial & Territorial Affairs; Account Executive ON/Western (CRA)', email: 'Curtis.Bell@cra-arc.gc.ca', phone: '(613) 852-2098' },
        { name: 'Denis Rheaume', title: 'Assistant Director, Corporate Governance (CRA)', email: 'Denis.Rheaume@cra-arc.gc.ca', phone: '(613) 863-7508' },
      ],
    },
    dataRequirements: [
      {
        id: 'request',
        label: 'IVP Request (Record 0020)',
        description: 'Client identification data sent by the province to request a match and income data.',
        attributes: ['Social Insurance Number (SIN)', 'Legal Surname', 'Given Name', 'Date of Birth (YYYYMMDD)', 'Taxation Year(s) — up to 5 per record', 'Program Area Code'],
        purpose: 'Initiate the income verification exchange with CRA. Must include SIN as primary identifier plus secondary matching fields.',
      },
      {
        id: 'identification',
        label: 'Identification Response (Record 0001)',
        description: 'CRA returns client identification data — surname, given name, birth date, marital status.',
        attributes: ['Surname', 'Given Name', 'Date of Birth', 'Marital Status Code'],
        purpose: 'Verify the identity of the matched taxpayer and confirm demographic alignment.',
      },
      {
        id: 'location',
        label: 'Individual Location (Record 0002)',
        description: 'Client mailing address as held by CRA.',
        attributes: ['Street Address', 'City', 'Province Code', 'Postal Code'],
        purpose: 'Obtain address information for residency verification signal. Reflects address at time of tax filing.',
      },
      {
        id: 'income-data',
        label: 'T1 Income Fields',
        description: 'Income line items returned from the T1 General tax return, as defined in the MOU.',
        attributes: [
          'Line 101 — Employment income',
          'Line 113 — Old age security pension',
          'Line 114 — CPP/QPP benefits',
          'Line 119 — Employment insurance and other benefits',
          'Line 120 — Taxable amount of dividends',
          'Line 121 — Interest and other investments income',
          'Line 126 — Net rental income',
          'Line 127 — Taxable capital gains',
          'Line 129 — RRSP income',
          'Line 130 — Other income',
          'Line 135 — Net business income',
          'Line 144 — Workers compensation benefits',
          'Line 145 — Social assistance payments',
          'Line 146 — Net federal supplements',
          'Line 150 — Total income (Gross income)',
        ],
        purpose: 'Determine whether applicant income falls within program eligibility thresholds. Covers earned income (employment, self-employment, rental) and unearned income (pensions, EI, dividends, capital gains).',
      },
      {
        id: 'response',
        label: 'CRA Response (Record 0022)',
        description: 'Matching results returned by CRA including match status and SIN status codes.',
        attributes: ['Match Status Code', 'SIN Status', 'Surname Match Status', 'Given Name Match Status', 'DOB Match Status', 'RAP Count'],
        purpose: 'Confirm whether the submitted record matched a CRA taxpayer, and the quality of the match across fields.',
      },
    ],
    integrationOptions: [
      {
        id: 1,
        label: 'SFTP Batch Exchange (Current)',
        summary: 'Encrypted batch files exchanged via SFTP using Entrust PKI. Overnight processing with next-day results.',
        meetsRequirements: 'Full',
        cost: 'Low',
        feasibility: 'High',
        recommended: true,
        description: 'Established exchange pattern used by SDPR and multiple BC programs. MOU-governed. Files sent via encrypted SFTP to CRA, processed on IV mainframe (available 21 hrs/day), responses returned typically within hours (SLA: 24–48 hrs). No plans from CRA to replace SFTP with real-time API.',
        risks: [
          'Batch processing — results not available same day for current SDPR workflow',
          'Cannot verify income at point of application',
          'Manual consent verification step required',
          'Tax year data may be up to 16 months old',
        ],
      },
    ],
    incomeCodes: [
      { code: '101', description: 'Employment income', inMOU: true },
      { code: '104', description: 'Other employment income', inMOU: true },
      { code: '113', description: 'Old age security pension', inMOU: true },
      { code: '114', description: 'CPP/QPP benefits', inMOU: true },
      { code: '115', description: 'Other pensions or superannuation', inMOU: true },
      { code: '119', description: 'Employment insurance and other benefits', inMOU: true },
      { code: '120', description: 'Taxable amount of dividends', inMOU: true },
      { code: '121', description: 'Interest and other investments income', inMOU: true },
      { code: '122', description: 'Net partnership income', inMOU: true },
      { code: '160', description: 'Gross rental income', inMOU: true },
      { code: '126', description: 'Net rental income', inMOU: true },
      { code: '127', description: 'Taxable capital gains', inMOU: true },
      { code: '156', description: 'Gross support payments received', inMOU: true },
      { code: '129', description: 'RRSP income', inMOU: true },
      { code: '130', description: 'Other income', inMOU: true },
      { code: '162', description: 'Gross business income', inMOU: true },
      { code: '135', description: 'Net business income', inMOU: true },
      { code: '164', description: 'Gross professional income', inMOU: true },
      { code: '137', description: 'Net professional income', inMOU: true },
      { code: '166', description: 'Gross commission income', inMOU: true },
      { code: '139', description: 'Net commission income', inMOU: true },
      { code: '168', description: 'Gross farming income', inMOU: true },
      { code: '141', description: 'Net farming income', inMOU: true },
      { code: '170', description: 'Gross fishing income', inMOU: true },
      { code: '143', description: 'Net fishing income', inMOU: true },
      { code: '144', description: 'Workers compensation benefits', inMOU: true },
      { code: '145', description: 'Social assistance payments', inMOU: true },
      { code: '146', description: 'Net federal supplements', inMOU: true },
      { code: '150', description: 'Total income (Gross income)', inMOU: true },
      { code: '208', description: 'RRSP deduction / contributions', inMOU: true },
      { code: '303', description: 'Spouse or common-law partner amount', inMOU: true },
      { code: '305', description: 'Amount for eligible dependent', inMOU: true },
      { code: '326', description: 'Amount transferred from spouse/common-law partner', inMOU: true },
      { code: '484', description: 'Refund amount', inMOU: true },
      { code: '116', description: 'Elected Split-Pension Amount', inMOU: false },
      { code: '117', description: 'Universal Child Care Benefit (MCFD & CRA MOU)', inMOU: false },
      { code: '125', description: 'RDSP Amount', inMOU: false },
      { code: '128', description: 'Support Payments Received', inMOU: false },
      { code: '185', description: 'UCCB Amount designated to a Dependent', inMOU: false },
      { code: '213', description: 'UCCB Repayment Amount', inMOU: false },
      { code: '453', description: 'WITB Amount Calculated', inMOU: false },
      { code: '479', description: 'PROV-TAX-CR', inMOU: false },
      { code: '23600', description: 'Net income (widely used — may be needed)', inMOU: false },
    ],
    recordTypes: [
      { code: '0020', label: 'IVP Request', direction: 'P/T → CRA', description: 'Client identification data sent by the province to request a match and income data. Can request up to 5 tax years per record.' },
      { code: '0001', label: 'Identification', direction: 'CRA → P/T', description: 'Describes the Income Verification client — surname, given name, birth date, marital status.' },
      { code: '0002', label: 'Individual Location', direction: 'CRA → P/T', description: 'Client mailing address: street, city, province code, postal code.' },
      { code: '0011', label: 'Account Change', direction: 'CRA → P/T', description: 'Generated when CRA updates a client active SIN or TTN to a new number.' },
      { code: '0022', label: 'CRA Response', direction: 'CRA → P/T', description: 'Matching results: match status, SIN status, surname/name/DOB status codes, RAP count.' },
      { code: '0023', label: 'No Data Response', direction: 'CRA → P/T', description: 'Generated when no T1 assessment is available for the requested tax year.' },
    ],
    costTiers: [
      { range: '1 – 499', cost: 'No charge' },
      { range: '500 – 79,999', cost: '$1,000 / quarter' },
      { range: '80,000 – 500,000', cost: '$2,500 / quarter' },
      { range: 'Over 500,000', cost: '$5,000 / quarter' },
    ],
    matchingCriteria: {
      primary: 'SIN / TTN (must match + pass Mod-10 check)',
      secondary: ['Surname (first 5 characters)', 'Given Name (first 5 characters)', 'Date of Birth (with tolerance for transposition)'],
      note: 'CRA compares first 5 characters of surname/given name against any 5 consecutive characters in the P/T full name field. Birthdate: day/month transposition, year within ±5, and other partial matches are accepted.',
    },
    processSteps: [
      { step: 1, title: 'Verify client consent', description: 'Ensure the applicant has authorized CRA to release their taxpayer information.' },
      { step: 2, title: 'Verify accessible tax years', description: 'Identify which taxation years may be accessed under the MOU.' },
      { step: 3, title: 'Create tax request in ICM', description: 'Generate the income verification request in ICM. Report runs overnight and is available the next business day.' },
      { step: 4, title: 'Review reports', description: 'Review identification data, match status codes, and T1 income fields returned by CRA.' },
      { step: 5, title: 'Validate', description: 'Confirm person data, marital status, and address match. Review income lines for inconsistencies. Follow up with client on any discrepancies.' },
    ],
    validationSteps: [
      'Ensure person data, marital status, and address are correct/matched.',
      'Determine residency and jurisdiction for any earned income.',
      'Review income lines — identify inconsistencies and eligibility-impacting incomes.',
      'For tax credits, confirm relationship status, dependents, or home ownership status.',
      'If issues are identified, follow up with client to address discrepancies or provide documents.',
    ],
    painPoints: [
      'Overnight batch — results not available same day',
      'Manual consent verification step',
      'Manual matching and review',
      'No real-time verification capability',
      'ICM request creation is manual',
      'Cannot verify income at point of application',
    ],
    glossary: [
      { term: 'CRA', definition: 'Canada Revenue Agency' },
      { term: 'ICM', definition: 'Integrated Case Management' },
      { term: 'IVP', definition: 'Income Verification Program' },
      { term: 'MOU', definition: 'Memorandum of Understanding' },
      { term: 'PKI', definition: 'Public Key Infrastructure' },
      { term: 'SFTP', definition: 'Secure File Transfer Protocol' },
      { term: 'SIN', definition: 'Social Insurance Number' },
      { term: 'T1', definition: 'Individual Income Tax Return' },
      { term: 'TTN', definition: 'Temporary Taxation Number' },
      { term: 'CAW', definition: 'Certificate Agent for Windows (CRA-provided Entrust software)' },
      { term: 'PIA', definition: 'Privacy Impact Assessment' },
      { term: 'SDPR', definition: 'Ministry of Social Development and Poverty Reduction' },
      { term: 'DA', definition: 'Disability Assistance' },
      { term: 'IA', definition: 'Income Assistance' },
      { term: 'P/T', definition: 'Province / Territory' },
    ],
  },
  {
    id: 'icbc',
    name: 'Insurance Corporation of British Columbia',
    shortName: 'ICBC',
    description: 'Provincial Crown corporation providing universal auto insurance and driver licensing in British Columbia.',
    category: 'provincial',
    relatedFactors: ['Asset Verification (Vehicles)', 'BC Residency Verification'],
    extraTabs: ['technical', 'matching', 'background'],
    overview: {
      mandate: 'ICBC is a Crown corporation that provides universal auto insurance, driver licensing, and vehicle registration in British Columbia. It maintains comprehensive records on vehicle ownership, registration status, and historical transfers.',
      relevance: 'ICBC data assists SDPR in verifying vehicle asset eligibility conditions for Income Assistance and Disability Assistance applications. Two core conditions must be assessed: (1) the applicant\'s family unit does not hold non-exempt vehicle assets that exceed SDPR thresholds, and (2) the applicant has not transferred or sold vehicles at significantly less than fair market value within two years before applying for assistance.',
      keyPoints: [
        'Information is required for the applicant, spouse (if applicable), and any dependants',
        'Current vehicle ownership — all vehicles registered to any member of the family unit',
        'Former ownership (2-year lookback) — vehicles sold, transferred, or disposed of within two years prior to application',
        'Vehicle value — current book value and/or value at time of transfer or sale',
        'SDPR currently has no programmatic access to ICBC data — workers access the ICBC mainframe via terminal client',
        'No data connectivity exists between ICM, MIS, or ICBC — all data entry is manual',
        'ICBC API usage was contemplated in 2020 but set aside as low priority',
        'ICBC has historically built custom APIs per organization — a centralized API may be a better path',
      ],
    },
    contacts: { primary: [], secondary: [] },
    dataRequirements: [
      {
        id: 'current',
        label: 'Vehicle (Current Ownership)',
        description: 'All vehicles currently registered to any member of the family unit.',
        attributes: [
          'Licence Plate Number',
          'VIN (Vehicle Identification Number)',
          'Registration Number',
          'Vehicle Year',
          'Make',
          'Model',
          'Ownership Type (PODL / ODL, sole / joint)',
          'Registered Owner(s)',
          'Ownership Percentage (if applicable)',
          'Plate Status',
          'Plate Type',
          'Registration Details',
          'Vehicle Value (if available)',
        ],
        purpose: 'Determine whether the family unit holds non-exempt vehicle assets. Identify current vehicle equity and ownership structure.',
      },
      {
        id: 'former',
        label: 'Vehicle (Former Ownership / Transfers)',
        description: 'Vehicles sold, transferred, or disposed of within the two-year lookback period by any family unit member.',
        attributes: [
          'Licence Plate Number',
          'VIN',
          'Registration Number',
          'Ownership prior to disposition',
          'Date of transfer',
          'Transferee / new owner',
          'Transfer price',
          'Sale price',
          'Notes indicating disposal below fair market value (if available)',
        ],
        purpose: 'Identify asset transfers within the 2-year lookback. Detect potential dispositions at less than fair market value.',
      },
      {
        id: 'value',
        label: 'Vehicle Value',
        description: 'Current book value and/or value at time of transfer or sale.',
        attributes: [
          'Current book value',
          'Value at time of transfer/sale',
          'Source of valuation (if available)',
        ],
        purpose: 'Assess whether vehicle assets exceed SDPR thresholds. Determine if a transfer was at significantly less than market value.',
      },
    ],
    businessRules: [
      'Vehicle ownership (current and historical) must be determined for every person in the family unit — applicant, spouse, and dependants.',
      'Any vehicle transferred or sold within two years prior to application must be identified.',
      'Transfers at less than fair market value must be flagged where data is available.',
      'Vehicle value is required to assess whether assets exceed SDPR thresholds.',
      'Ownership type (sole vs. joint) and ownership percentage must be captured.',
      'Multiple registered owners must be recognized and evaluated.',
    ],
    integrationOptions: [],
    accessMethods: [
      {
        id: 'legacy',
        label: 'Legacy Path (Current)',
        tag: 'LEGACY',
        tagVariant: 'warning',
        flow: ['Application', 'MoTT CCW API', 'BC Gov Mainframe', 'ICBC Mainframe'],
        description: 'Existing legacy systems route through the MoTT CCW API and BC Gov mainframe to reach the ICBC mainframe. SDPR workers currently access the ICBC mainframe via the same terminal client used for MIS sessions — there is no data connectivity between ICM, MIS, or ICBC except by manual entry.',
      },
      {
        id: 'new',
        label: 'New Path (MoTT)',
        tag: 'NEW',
        tagVariant: 'success',
        flow: ['Application', 'MoTT ICBCS API', 'ICBC Web API'],
        description: 'A new ICBC Web API was built specifically for MoTT use. MoTT intends to migrate their CCW API to use this path. The API took ~4 years and several phases to build. ICBC would likely create a custom API per organization — there may be an opportunity for a centralized API.',
      },
    ],
    sdprCurrentState: 'SDPR workers use the same terminal client they use for MIS sessions to connect to the ICBC mainframe. There is no data connectivity between ICM, MIS, or ICBC — all data entry is manual. ICBC API usage was contemplated in 2020 but set aside as low priority.',
    existingChannels: [
      { title: 'PSSG + MoTT — Mainframe ISA', description: 'ICBC already shares vehicle registration data with PSSG and MoTT for policing/enforcement purposes via mainframe-to-mainframe integration with traditional ISAs.', note: 'This channel may be leverageable for SDPR\'s needs.' },
      { title: 'MoTT — ICBC Web API', description: 'A new ICBC Web API was built specifically for MoTT (~4 years, several phases). Used for Driver\'s Licence, Commercial Insurance, Contravention data. MoTT is migrating their CCW API to use this path.' },
    ],
    knownConstraints: [
      { label: 'No existing SDPR–ICBC data connection', detail: 'SDPR workers access the ICBC mainframe via terminal client (same as MIS sessions). No programmatic link exists between ICM, MIS, and ICBC — all data entry is manual.', severity: 'high' },
      { label: 'ICBC API usage deprioritized in 2020', detail: 'API integration was considered in 2020 but set aside as low priority. The new ICBC Web API was built for MoTT, not for SDPR use cases.', severity: 'medium' },
      { label: 'Custom API per organization (historically)', detail: 'ICBC has built custom APIs for specific partners (e.g., MoTT\'s 4-year project). A centralized API is a potential opportunity but not yet confirmed.', severity: 'medium' },
      { label: 'Existing mainframe-to-mainframe ISAs', detail: 'ICBC already shares vehicle registration data with PSSG and MoTT for policing/enforcement via mainframe-to-mainframe with traditional ISAs. This existing channel may be leveraged.', severity: 'info' },
    ],
    dataTypesSummary: [
      { label: 'Driver\'s Licence', who: 'MoTT (current)', needed: false },
      { label: 'Commercial Insurance', who: 'MoTT (current)', needed: false },
      { label: 'Contravention Information', who: 'MoTT (current)', needed: false },
      { label: 'Vehicle Registration', who: 'PSSG, MoTT (ISA)', needed: false },
      { label: 'NSC Score (SFTP sync)', who: 'MoTT (SFTP/FTPS)', needed: false },
      { label: 'Vehicle Ownership + History', who: 'SDPR (needed)', needed: true },
      { label: 'Vehicle Value / Book Value', who: 'SDPR (needed)', needed: true },
      { label: 'Transfer Records (2-yr lookback)', who: 'SDPR (needed)', needed: true },
    ],
    matchingKeys: [
      { label: 'Primary Keys', keys: ['Driver Licence Number', 'Licence Plate', 'VIN (Vehicle Identification Number)', 'Registration Number'] },
      { label: 'Secondary / Fallback Keys', keys: ['Last name + first name (or partial first name)', 'Date of birth — to resolve name variants', 'Address', 'Fuzzy matching required for name variations'] },
    ],
    matchingConsiderations: [
      { title: 'Name variation risk', description: 'Match quality may be affected by name variations between the assistance application and vehicle registration records. Fuzzy matching logic will be needed.' },
      { title: 'DOB improves confidence', description: 'Additional identifiers such as date of birth and address could improve match confidence when primary vehicle identifiers are not available.' },
      { title: 'Multiple registered owners', description: 'A vehicle may have multiple registered owners. All ownership relationships must be evaluated across the full family unit.' },
      { title: 'Two-year lookback requirement', description: 'Historical ownership data is required. The matching logic must handle both current and former ownership records for the same individual.' },
    ],
    comparisonTable: {
      headers: ['Aspect', 'LTSA (Property)', 'ICBC (Vehicle)'],
      rows: [
        ['Primary key', 'PID / Title Number', 'Driver Licence / Plate / VIN'],
        ['Name search available?', 'Yes (fuzzy needed)', 'Yes (fuzzy needed)'],
        ['DOB available in source?', 'No', 'Likely yes (via DL)'],
        ['Historical data?', 'Yes (historical name search)', 'TBC — 2-yr lookback needed'],
        ['Current API access?', 'Title Direct Search API', 'Web API (MoTT only)'],
        ['SDPR access today?', 'Manual via myLTSA', 'Manual via terminal/MIS'],
      ],
    },
    backgroundItems: [
      { title: 'Address Change BC (ACBC)', content: 'CITZ operates ACBC — a legacy application that lets people submit address changes. CITZ propagates updates to ICBC and Health. CITZ plans to modernize this app. Notes on data flow are documented from the Musqueamview street place name change experience.' },
      { title: 'Existing vehicle registration sharing (PSSG + MoTT)', content: 'ICBC already shares vehicle registration data with government (PSSG, MoTT) for policing and enforcement purposes via mainframe-to-mainframe integration using traditional ISAs. There may be an opportunity to leverage this existing channel for SDPR needs.' },
      { title: 'SDPR terminal access (no data link)', content: 'SDPR workers connect to the ICBC mainframe using the same terminal client as MIS sessions. There is no data connectivity between ICM, MIS, or ICBC — all data entry is manual. ICBC API usage was contemplated in 2020 but deprioritized.' },
      { title: 'MoTT\'s API experience (4 years)', content: 'ICBC wrote a new web API for MoTT\'s use case. It took approximately 4 years across several phases. This suggests a new ICBC API for SDPR would require significant lead time. A centralized API may be a better path than per-organization custom builds.' },
    ],
    openQuestions: [
      'Can the existing PSSG/MoTT mainframe ISA be extended or leveraged for SDPR use?',
      'Will ICBC build a centralized API or require a separate custom API for SDPR?',
      'Is historical vehicle ownership / transfer data available and searchable by person?',
      'Is vehicle value / book value accessible via ICBC systems?',
      'What ISA or MOU would be required for SDPR to access ICBC data programmatically?',
      'What is the expected timeline for any new ICBC API integration?',
    ],
    ownershipTypes: [
      { type: 'PODL', definition: 'Primary Owner Driver\'s Licence — the primary registered owner of the vehicle.' },
      { type: 'ODL', definition: 'Owner Driver\'s Licence — additional or joint registered owner.' },
      { type: 'Sole Ownership', definition: 'Vehicle is registered to one individual only.' },
      { type: 'Joint Ownership', definition: 'Vehicle is registered to two or more individuals. Ownership percentage may apply.' },
    ],
    plateStatuses: [
      { status: 'Active', description: 'Plate is currently registered and valid.' },
      { status: 'Cancelled', description: 'Registration has been cancelled.' },
      { status: 'Suspended', description: 'Registration is temporarily suspended.' },
      { status: 'Expired', description: 'Registration period has lapsed.' },
      { status: 'Transferred', description: 'Plate associated with a transferred vehicle.' },
      { status: 'Seized', description: 'Plate/vehicle subject to legal seizure.' },
    ],
    glossary: [
      { term: 'ICBC', definition: 'Insurance Corporation of British Columbia' },
      { term: 'ACBC', definition: 'Address Change BC (CITZ-operated address change application)' },
      { term: 'CCW API', definition: 'MoTT\'s legacy API routing through BC Gov mainframe to ICBC' },
      { term: 'ICBCS API', definition: 'New MoTT API connecting directly to ICBC Web API' },
      { term: 'ICM', definition: 'Integrated Case Management (SDPR system)' },
      { term: 'MIS', definition: 'Ministry Information System (legacy SDPR terminal)' },
      { term: 'MoTT', definition: 'Ministry of Transportation and Transit' },
      { term: 'NSC', definition: 'National Safety Code (carrier score, synced monthly via SFTP)' },
      { term: 'PODL', definition: 'Primary Owner Driver\'s Licence' },
      { term: 'ODL', definition: 'Owner Driver\'s Licence' },
      { term: 'PSSG', definition: 'Ministry of Public Safety and Solicitor General' },
      { term: 'SDPR', definition: 'Ministry of Social Development and Poverty Reduction' },
      { term: 'VIN', definition: 'Vehicle Identification Number' },
      { term: 'ISA', definition: 'Information Sharing Agreement' },
      { term: 'CITZ', definition: 'Ministry of Citizens\' Services' },
    ],
  },
  {
    id: 'bcsc',
    name: 'Identity Assurance Services',
    shortName: 'BCSC',
    description: 'BC Services Card — verified identity for SDPR eligibility and cross-system matching, operated by CITZ Identity Assurance Services.',
    category: 'provincial',
    relatedFactors: ['Identity Confirmation', 'Cross-System Matching'],
    extraTabs: ['technical'],
    overview: {
      mandate: 'The BC Services Card (BCSC) is a digital equivalent of a driver licence used to prove identity for online government services. It is an integrated program between HLTH, ICBC, and CITZ. BCSC is the authoritative source of basic person information. Identity Assurance Services (IAS) is CITZ\'s foundational identity system — it integrates data from multiple trusted provincial systems including the ICBC Drivers System and the Health Client Registry through a continuous, automated process. IAS performs daily quality checks and resolves duplicate identity records.',
      relevance: 'IAS / BC Services Card data assists SDPR with three purposes: (1) every adult in the family unit must verify their identity before their application can proceed, (2) verified identity attributes are used to match records across systems (LTSA, CRA, ICBC) during eligibility checks, and (3) basic person data supports the determination that the family unit\'s assets and income do not exceed eligibility thresholds.',
      keyPoints: [
        'BCSC is the authoritative source of basic person information (name, DOB, address, sex)',
        'IAS integrates data from ICBC Drivers System (daily feed) and Health Client Registry',
        'IAS performs daily quality checks and resolves duplicate identity records',
        'Identity data is available at the time of login only — no standalone API pull exists',
        'Identity attributes cannot be retrieved again if user is no longer present',
        'IAS does not maintain relationship or spousal records',
        'PHN is received from ICBC but cannot be shared — Health PCR is the authoritative source',
        'Address data is sourced from ICBC feed — physical vs. mailing address distinction TBD',
        'Policy authority: FOIPPA Section 69.2 — Provincial Identity Information Services Provider',
      ],
    },
    purposeConditions: [
      { num: 1, description: 'Every adult in the family unit must verify their identity before their application can proceed.' },
      { num: 2, description: 'Verified identity attributes are used to match records across systems (LTSA, CRA, ICBC) during eligibility checks.' },
      { num: 3, description: 'Basic person data supports the determination that the family unit\'s assets and income do not exceed eligibility thresholds.' },
    ],
    iasSources: [
      { label: 'ICBC Drivers System', note: 'Daily feed — name, address, DOB, sex' },
      { label: 'Health Client Registry', note: 'PHN linkage (not shareable via IAS)' },
      { label: 'BC Services Card Program', note: 'Credential issuance and authentication' },
    ],
    scopeIn: [
      'Basic person info for the Applicant',
      'Basic person info for the Spouse',
    ],
    scopeOut: [
      'Basic person info for Dependants',
      'Personal Health Number (PHN)',
      'Spousal / relationship linkages',
    ],
    policyAuthority: {
      title: 'FOIPPA — Section 69.2 · Provincial Identity Information Services Provider',
      description: 'Enables the Minister responsible to designate a Provincial Identity Information Services Provider (PIISP) and to issue directions regarding provision of credentials to citizens and the collection, use, and disclosure of personal identity information. Sets out the services a PIISP may provide.',
    },
    contacts: {
      primary: [
        { name: 'Pam Smith', title: 'A/Senior Executive Director, Cyber Security & Digital (Integrated Identity Service)', email: '—', phone: '—' },
        { name: 'Olena Mitovska', title: 'A/Executive Director, Digital Trust — Data Custodian', email: '—', phone: '—' },
        { name: 'Aaron Unger', title: 'Director, Product Development (Integrated Identity Service)', email: 'aaron.unger@gov.bc.ca', phone: '—' },
        { name: 'Irish Israel', title: 'IAS Product Owner', email: '—', phone: '—' },
        { name: 'Marcos A Carretero', title: 'Contractor', email: '—', phone: '—' },
      ],
      secondary: [],
    },
    dataRequirements: [
      {
        id: 'person-identity',
        label: 'Person Identity (IAS Attributes)',
        description: 'Core identity attributes available from IAS that map to SDPR application fields.',
        attributes: [
          'Surname (Primary Documented Surname from BCSC)',
          'Given Name (Primary Documented Given Name — first name only)',
          'Given Name(s) (All names other than surname — includes first + middle)',
          'Birth Date (Documented birth date from BCSC)',
          'Sex (Documented sex from BCSC — note: SDPR uses Gender)',
          'Verified Email (Email verified with delivery once)',
        ],
        purpose: 'Verify the identity of applicants and spouses. Provide verified attributes for cross-system matching against LTSA, CRA, and ICBC records.',
      },
      {
        id: 'address',
        label: 'Address (via ICBC Feed)',
        description: 'Residential address information sourced from ICBC daily feed into IAS.',
        attributes: [
          'Street Address (physical vs. mailing TBD)',
          'Locality (city/municipality)',
          'Province (two-letter code)',
          'Postal Code',
          'Country (two-letter code — not in SDPR application form)',
        ],
        purpose: 'Used to match records and verify residency across systems. Address type (physical vs. mailing) from ICBC feed needs confirmation.',
      },
    ],
    attributeMap: [
      { sdpr: 'Last name', ias: 'Surname', note: '' },
      { sdpr: 'First name', ias: 'Given Name', note: 'Returns first name only; may not include all portions.' },
      { sdpr: 'Middle name(s)', ias: 'Given Name(s)', note: 'Given Name(s) includes first + middle name in one field — semantics TBD.' },
      { sdpr: 'Date of Birth', ias: 'Birth Date', note: '' },
      { sdpr: 'Gender', ias: 'Sex', note: 'Gender and Sex may have different meanings and values — to be reviewed.' },
      { sdpr: 'Email', ias: 'Verified Email', note: 'Verified with email delivery once (personal or business).' },
      { sdpr: 'Street address — Unit number', ias: '—', note: 'Not explicitly mapped; may be within Street Address.' },
      { sdpr: 'Street address — Line 1', ias: 'Street Address', note: 'Source: ICBC feed. Physical vs. mailing address unclear — to be confirmed.' },
      { sdpr: 'Street address — Line 2', ias: 'Street Address', note: 'Source: ICBC feed.' },
      { sdpr: 'City', ias: 'Locality', note: '' },
      { sdpr: 'Province', ias: 'Province', note: 'Two-letter province code.' },
      { sdpr: 'Postal code', ias: 'Postal Code', note: '' },
      { sdpr: '—', ias: 'Country', note: 'Two-letter country code. Not in SDPR application form.' },
    ],
    dataDictionary: [
      { term: 'Surname', definition: 'Primary Documented Surname from the BCSC. The individual\'s documented surname recorded from valid identification.' },
      { term: 'Given Name', definition: 'Primary Documented Given Name from the BCSC. Returns first name only — may not include all portions of the first name.' },
      { term: 'Given Name(s)', definition: 'All of the names an individual has other than their surname. Includes first and middle names in one field.' },
      { term: 'Birth Date', definition: 'The individual\'s documented birth date recorded from valid identification (from BCSC).' },
      { term: 'Sex', definition: 'The individual\'s documented sex recorded from valid identification (from BCSC).' },
      { term: 'Street Address', definition: 'The street address lines of an individual\'s provided residential address. Sourced from ICBC feed.' },
      { term: 'Locality', definition: 'The city, municipality, or district of an individual\'s provided residential address.' },
      { term: 'Province', definition: 'The two-letter province code of an individual\'s provided residential address.' },
      { term: 'Postal Code', definition: 'The postal code of the individual\'s provided residential address.' },
      { term: 'Country', definition: 'The two-letter country code of an individual\'s provided residential address.' },
      { term: 'Verified Email', definition: 'The email address provided by an individual that has been verified with email delivery once (personal or business).' },
    ],
    attributePurposes: [
      { attr: 'Middle name(s)', icon: '🔗', purpose: 'Used to improve matching across systems, particularly where name variations exist (e.g., "Greg F. Duncan" vs. "Gregory Duncan").' },
      { attr: 'Birth Date + Sex', icon: '🎯', purpose: 'Demographic attributes used to disambiguate duplicate records that share the same first and last name.' },
      { attr: 'Address fields', icon: '📍', purpose: 'Used to match records and verify residency. Sourced from ICBC via daily IAS feed — address type to be confirmed.' },
      { attr: 'Verified Email', icon: '✉️', purpose: 'Supports communication during multi-step application processes (e.g., notifications, follow-ups).' },
    ],
    integrationOptions: [
      {
        id: 1,
        label: 'Option 1: Collect at the Digital Gateway (login)',
        summary: 'Collect verified identity information at the Single Digital Gateway (SDG) when the individual logs in using their BC Services Card.',
        meetsRequirements: 'Partial',
        cost: 'Low',
        feasibility: 'High',
        recommended: false,
        description: 'Store and share the data through the application lifecycle. Leverages the existing BCSC login flow with no new API required.',
        advantages: [
          'Leverages existing BCSC login flow',
          'No new API required',
          'Consent is implicit at login',
        ],
        risks: [
          'Applicant and Spouse must both have a BCSC',
          'Long-running transactions (e.g., PWD) may require identity data to be stored separately from IAS',
          'Architectural work needed to hold identity data across session',
        ],
      },
      {
        id: 2,
        label: 'Option 2: Collect directly from IAS via API',
        summary: 'Collect verified identity information directly from IAS via purpose-built APIs.',
        meetsRequirements: 'Full',
        cost: 'Medium',
        feasibility: 'Low',
        recommended: false,
        description: 'Supports long-running service transactions where verified identity data is needed for third-party validation checks. Cleaner separation of consent and data retrieval.',
        advantages: [
          'Supports long transactions like PWD',
          'Identity data available at validation checkpoints',
          'Cleaner separation of consent and data retrieval',
        ],
        risks: [
          'No existing API — would need to be built',
          'CS + BCSC team currently exploring feasibility',
          'Timeline uncertain',
        ],
      },
    ],
    bcscConstraints: [
      { label: 'No standalone API pull', detail: 'There is no API to retrieve identity data outside of the active login session. IAS APIs are real-time and require the individual to be present and consenting.', severity: 'high' },
      { label: 'No "look-up later" capability', detail: 'Identity attributes cannot be retrieved again during a long-running transaction if the user is no longer present. This is a significant constraint for multi-step processes like PWD.', severity: 'high' },
      { label: 'No spousal linkage in IAS', detail: 'IAS does not maintain relationship or spousal records. Spouse identity cannot be retrieved from IAS unless the spouse is physically present and consents.', severity: 'medium' },
      { label: 'Consent required', detail: 'Access to identity attributes depends on the consent model. CS is working with the BCSC team to define this and explore whether an API could be built.', severity: 'medium' },
      { label: 'PHN not shareable via IAS', detail: 'IAS receives PHN in the feed from ICBC but cannot share it — Health Provincial Client Registry is the authoritative source. PHN is out of scope.', severity: 'info' },
      { label: 'Address source ambiguity', detail: 'IAS receives address data from ICBC. It is unclear whether this represents a physical or mailing address. To be confirmed.', severity: 'info' },
    ],
    architectureFlows: [
      { from: 'ICBC Drivers System', to: 'IAS', detail: 'Daily automated feed — name, address, DOB, sex. Quality checks and deduplication performed by IAS.' },
      { from: 'Health Client Registry', to: 'IAS', detail: 'PHN linkage received but not shareable — Health is the authoritative source.' },
      { from: 'IAS', to: 'Government Services', detail: 'Real-time identity attributes released at login, with consent. No batch or deferred retrieval.' },
    ],
    bpsPatterns: [
      { title: 'Current BPS / Contracted Agency Pattern', items: ['Access patterns vary by sector', 'Typically org-to-org MOUs', 'Predicated on prior consent to collect', 'Info sharing commonly via exported CSV'] },
      { title: 'What\'s Being Explored', items: ['CS team working with BCSC team on API feasibility', 'Consent model yet to be finalized', 'Architectural conversations underway on temporary identity data storage (EFV or another component)'] },
    ],
    bpsNote: 'A PIA document for BCSC confirms what data attributes are accessible. Architectural conversations are required to explore options for retrieving IAS data and/or temporarily holding limited identity data across a long-running transaction.',
    openQuestions: [
      'Can the BCSC team build an API to support deferred or batch identity retrieval?',
      'What consent model is required — implicit at login, or explicit per data request?',
      'How will spouse identity be collected if IAS has no spousal linkage and the spouse is not present?',
      'Is temporary identity data storage in EFV (or similar) feasible and acceptable under PIA?',
      'Does address from ICBC represent physical or mailing address?',
      'How will Given Name(s) be split into first + middle for SDPR attribute mapping?',
    ],
    glossary: [
      { term: 'API', definition: 'Application Programming Interface' },
      { term: 'BCSC', definition: 'BC Services Card' },
      { term: 'BPS', definition: 'Broader Public Sector' },
      { term: 'CITZ', definition: 'Ministry of Citizens\' Services' },
      { term: 'HLTH', definition: 'Ministry of Health' },
      { term: 'IAS', definition: 'Identity Assurance Services' },
      { term: 'ICBC', definition: 'Insurance Corporation of British Columbia' },
      { term: 'PIA', definition: 'Privacy Impact Assessment' },
      { term: 'PIISP', definition: 'Provincial Identity Information Services Provider' },
      { term: 'PWD', definition: 'Persons With Disability' },
      { term: 'SDG', definition: 'Single Digital Gateway' },
      { term: 'SDPR', definition: 'Ministry of Social Development and Poverty Reduction' },
    ],
  },
  {
    id: 'bc-hydro',
    name: 'BC Hydro',
    shortName: 'BC Hydro',
    description: 'Provincial Crown corporation and the primary electric utility serving British Columbia.',
    category: 'utility',
    relatedFactors: ['BC Residency Verification'],
    overview: {
      mandate: 'Content will be added soon.',
      relevance: 'Content will be added soon.',
      keyPoints: [],
    },
    contacts: { primary: [], secondary: [] },
    dataRequirements: [],
    integrationOptions: [],
    glossary: [],
  },
];

const DataSourceExplorer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSource = searchParams.get('source') || 'ltsa';
  const validSourceIds = dataSourceProfiles.map(s => s.id);
  const [selectedSourceId, setSelectedSourceId] = useState<string>(
    validSourceIds.includes(initialSource) ? initialSource : 'ltsa'
  );
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [expandedShapes, setExpandedShapes] = useState<Set<string>>(new Set());
  const [incomeFilter, setIncomeFilter] = useState<'all' | 'mou' | 'not'>('all');
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

  const selectedSource = dataSourceProfiles.find(s => s.id === selectedSourceId)!;

  const toggleShape = (id: string) => {
    setExpandedShapes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getCategoryLabel = (category: DataSourceProfile['category']) => {
    switch (category) {
      case 'provincial': return 'Provincial';
      case 'federal': return 'Federal';
      case 'utility': return 'Utility';
      default: return 'Other';
    }
  };

  const getRequirementBadge = (meets: IntegrationOption['meetsRequirements']) => {
    switch (meets) {
      case 'Full': return 'badge-success';
      case 'Partial': return 'badge-warning';
      case 'No': return 'badge-danger';
      case 'Future': return 'badge-info';
      default: return 'badge-secondary';
    }
  };

  const renderOverview = () => (
    <div className="dse-section">
      {selectedSource.overview.mandate === 'Content will be added soon.' ? (
        <div className="dse-coming-soon">
          <p>Detailed source profile content for <strong>{selectedSource.shortName}</strong> will be added soon.</p>
          <p>This data source has been identified as relevant to the following eligibility factors:</p>
          <div className="dse-related-factors" style={{ marginTop: '0.75rem' }}>
            {selectedSource.relatedFactors.map((factor, i) => (
              <span key={i} className="badge badge-primary">{factor}</span>
            ))}
          </div>
        </div>
      ) : (
        <>
          <h3>Mandate</h3>
          <p className="dse-text">{selectedSource.overview.mandate}</p>

          <h3>Relevance to Eligibility Verification</h3>
          <p className="dse-text">{selectedSource.overview.relevance}</p>

          <h3>Key Points</h3>
          <ul className="dse-key-points">
            {selectedSource.overview.keyPoints.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>

          <h3>Related Eligibility Factors</h3>
          <div className="dse-related-factors">
            {selectedSource.relatedFactors.map((factor, i) => (
              <span key={i} className="badge badge-primary">{factor}</span>
            ))}
          </div>

          {selectedSource.purposeConditions && selectedSource.purposeConditions.length > 0 && (
            <>
              <h3>Why This Data Is Needed</h3>
              <div className="bcsc-conditions">
                {selectedSource.purposeConditions.map((cond) => (
                  <div key={cond.num} className="bcsc-condition">
                    <span className="condition-num">{cond.num}</span>
                    <p>{cond.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {selectedSource.iasSources && selectedSource.iasSources.length > 0 && (
            <>
              <h3>IAS Data Sources</h3>
              <div className="bcsc-ias-sources">
                {selectedSource.iasSources.map((src, i) => (
                  <div key={i} className="ias-source-card">
                    <div className="ias-source-label">{src.label}</div>
                    <div className="ias-source-note">{src.note}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {selectedSource.scopeIn && selectedSource.scopeOut && (
            <>
              <h3>Scope</h3>
              <div className="bcsc-scope-grid">
                <div className="scope-card scope-in">
                  <div className="scope-header">✅ In Scope</div>
                  <ul>
                    {selectedSource.scopeIn.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="scope-card scope-out">
                  <div className="scope-header">❌ Out of Scope</div>
                  <ul>
                    {selectedSource.scopeOut.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}

          {selectedSource.policyAuthority && (
            <>
              <h3>Policy Authority</h3>
              <div className="bcsc-policy-authority">
                <div className="policy-title">{selectedSource.policyAuthority.title}</div>
                <p>{selectedSource.policyAuthority.description}</p>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );

  const renderContacts = () => (
    <div className="dse-section">
      {selectedSource.contacts.primary.length === 0 ? (
        <p className="dse-empty">Contact information for {selectedSource.shortName} will be added soon.</p>
      ) : (
        <>
          <h3>Primary Contacts</h3>
          <div className="dse-contacts-grid">
            {selectedSource.contacts.primary.map((contact, i) => (
              <div key={i} className="dse-contact-card">
                <div className="contact-name">{contact.name}</div>
                <div className="contact-title">{contact.title}</div>
                <div className="contact-detail">
                  <span className="contact-label">Email:</span> {contact.email}
                </div>
                {contact.phone !== '—' && (
                  <div className="contact-detail">
                    <span className="contact-label">Phone:</span> {contact.phone}
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedSource.contacts.secondary.length > 0 && (
            <>
              <h3>Secondary Contacts</h3>
              <div className="dse-contacts-grid">
                {selectedSource.contacts.secondary.map((contact, i) => (
                  <div key={i} className="dse-contact-card secondary">
                    <div className="contact-name">{contact.name}</div>
                    <div className="contact-title">{contact.title}</div>
                    <div className="contact-detail">
                      <span className="contact-label">Email:</span> {contact.email}
                    </div>
                    {contact.phone !== '—' && (
                      <div className="contact-detail">
                        <span className="contact-label">Phone:</span> {contact.phone}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );

  const renderRequirements = () => (
    <div className="dse-section">
      {selectedSource.dataRequirements.length === 0 ? (
        <p className="dse-empty">Data requirements for {selectedSource.shortName} will be added soon.</p>
      ) : (
        <>
          <p className="dse-subtitle">
            Data shapes describe the information structures needed to interact with {selectedSource.shortName}.
          </p>
          <div className="dse-shapes-list">
            {selectedSource.dataRequirements.map(shape => (
              <div key={shape.id} className="dse-shape-card">
                <div
                  className="shape-header"
                  onClick={() => toggleShape(shape.id)}
                >
                  <div className="shape-title">
                    <h4>{shape.label}</h4>
                    <p className="shape-desc">{shape.description}</p>
                  </div>
                  <span className="shape-toggle">
                    {expandedShapes.has(shape.id) ? '▲' : '▼'}
                  </span>
                </div>
                {expandedShapes.has(shape.id) && (
                  <div className="shape-body">
                    <div className="shape-attributes">
                      <h5>Attributes</h5>
                      <ul>
                        {shape.attributes.map((attr, i) => (
                          <li key={i}>{attr}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="shape-purpose">
                      <h5>Purpose</h5>
                      <p>{shape.purpose}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedSource.businessRules && selectedSource.businessRules.length > 0 && (
            <>
              <h3>Business Rules</h3>
              <div className="dse-business-rules">
                {selectedSource.businessRules.map((rule, i) => (
                  <div key={i} className="business-rule">
                    <span className="rule-number">{i + 1}</span>
                    <p>{rule}</p>
                  </div>
                ))}
              </div>
              <Callout variant="lightBlue">
                <strong>Note:</strong> Specific attributes and technical details are preliminary and will be confirmed during the requirements definition phase of the project.
              </Callout>
            </>
          )}

          {selectedSource.attributeMap && selectedSource.attributeMap.length > 0 && (
            <>
              <h3>Attribute Mapping: SDPR Application → IAS</h3>
              <p className="dse-subtitle">The table below maps the field names used in the SDPR application to the corresponding IAS / BC Services Card attribute names, including known semantic differences that require resolution.</p>
              <div className="dse-table-wrapper">
                <table className="dse-table bcsc-attr-table">
                  <thead>
                    <tr>
                      <th>SDPR Application Field</th>
                      <th>IAS / BCSC Attribute</th>
                      <th>Notes / Semantic Issues</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSource.attributeMap.map((row, i) => (
                      <tr key={i}>
                        <td className="attr-sdpr">{row.sdpr}</td>
                        <td className={`attr-ias ${row.ias === '—' ? 'attr-empty' : ''}`}>{row.ias}</td>
                        <td>{row.note ? <span className="attr-note">⚠️ {row.note}</span> : <span className="attr-no-note">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Callout variant="lightGold">
                <strong>Semantic issues to resolve:</strong> (1) Given Name(s) bundles first and middle name — SDPR needs them split. (2) Gender vs. Sex — different meanings and possible value sets. (3) Address type (physical vs. mailing) from ICBC feed — to be confirmed.
              </Callout>
            </>
          )}

          {selectedSource.attributePurposes && selectedSource.attributePurposes.length > 0 && (
            <>
              <h3>Purpose of Use for Each Attribute</h3>
              <div className="bcsc-attr-purposes">
                {selectedSource.attributePurposes.map((item, i) => (
                  <div key={i} className="attr-purpose-card">
                    <span className="attr-purpose-icon">{item.icon}</span>
                    <div>
                      <div className="attr-purpose-label">{item.attr}</div>
                      <p>{item.purpose}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {selectedSource.dataDictionary && selectedSource.dataDictionary.length > 0 && (
            <>
              <h3>Data Dictionary</h3>
              <div className="bcsc-data-dictionary">
                {selectedSource.dataDictionary.map((item, i) => (
                  <div key={i} className="data-dict-item">
                    <span className="data-dict-term">{item.term}</span>
                    <p>{item.definition}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );

  const renderOptions = () => (
    <div className="dse-section">
      {selectedSource.integrationOptions.length === 0 ? (
        <p className="dse-empty">Integration options for {selectedSource.shortName} will be added soon.</p>
      ) : (
        <>
          <p className="dse-subtitle">
            Potential approaches for integrating {selectedSource.shortName} data into the eligibility verification process.
          </p>
          <div className="dse-options-list">
            {selectedSource.integrationOptions.map(option => (
              <div
                key={option.id}
                className={`dse-option-card ${option.recommended ? 'recommended' : ''}`}
              >
                <div className="option-header">
                  <h4>
                    {option.label}
                    {option.recommended && <span className="recommended-badge">Recommended</span>}
                  </h4>
                </div>
                <p className="option-summary">{option.summary}</p>
                <p className="option-description">{option.description}</p>

                <div className="option-meta">
                  <div className="option-meta-item">
                    <span className="option-meta-label">Meets Requirements:</span>
                    <span className={`badge ${getRequirementBadge(option.meetsRequirements)}`}>
                      {option.meetsRequirements}
                    </span>
                  </div>
                  <div className="option-meta-item">
                    <span className="option-meta-label">Cost:</span>
                    <span className="option-meta-value">{option.cost}</span>
                  </div>
                  <div className="option-meta-item">
                    <span className="option-meta-label">Feasibility:</span>
                    <span className="option-meta-value">{option.feasibility}</span>
                  </div>
                </div>

                {option.advantages && option.advantages.length > 0 && (
                  <div className="option-advantages">
                    <h5>Advantages</h5>
                    <ul>
                      {option.advantages.map((adv, i) => (
                        <li key={i}>{adv}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {option.risks.length > 0 && (
                  <div className="option-risks">
                    <h5>Considerations / Risks</h5>
                    <ul>
                      {option.risks.map((risk, i) => (
                        <li key={i}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedSource.openQuestions && selectedSource.openQuestions.length > 0 && (
            <>
              <h3>Open Questions</h3>
              <div className="bcsc-open-questions">
                {selectedSource.openQuestions.map((q, i) => (
                  <div key={i} className="open-question-item">❓ {q}</div>
                ))}
              </div>
            </>
          )}

          {selectedSource.id === 'bcsc' && (
            <Callout variant="lightGold">
              <strong>Recommendation:</strong> TBD. Architectural conversations are ongoing. The recommendation will depend on consent model finalization, BCSC API feasibility assessment, and requirements for long-running transactions like PWD.
            </Callout>
          )}
        </>
      )}
    </div>
  );

  const renderGlossary = () => (
    <div className="dse-section">
      {selectedSource.glossary.length > 0 ? (
        <>
          <h3>Acronyms &amp; Terms</h3>
          <div className="dse-glossary-list">
            {selectedSource.glossary.map((entry, i) => (
              <div key={i} className="dse-glossary-item">
                <dt>{entry.term}</dt>
                <dd>{entry.definition}</dd>
              </div>
            ))}
          </div>

          {selectedSource.ownershipTypes && selectedSource.ownershipTypes.length > 0 && (
            <>
              <h3>Vehicle Ownership Types</h3>
              <div className="dse-ownership-types">
                {selectedSource.ownershipTypes.map((item, i) => (
                  <div key={i} className="ownership-type-card">
                    <div className="ownership-type-label">{item.type}</div>
                    <p>{item.definition}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {selectedSource.plateStatuses && selectedSource.plateStatuses.length > 0 && (
            <>
              <h3>Plate Status Values</h3>
              <div className="dse-plate-statuses">
                {selectedSource.plateStatuses.map((item, i) => (
                  <div key={i} className="plate-status-card">
                    <div className="plate-status-label">{item.status}</div>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <p className="dse-empty">No glossary entries for this data source.</p>
      )}
    </div>
  );

  const renderIncomeData = () => {
    if (!selectedSource.incomeCodes) return <p className="dse-empty">No income data for this source.</p>;
    const codes = incomeFilter === 'mou'
      ? selectedSource.incomeCodes.filter(c => c.inMOU)
      : incomeFilter === 'not'
        ? selectedSource.incomeCodes.filter(c => !c.inMOU)
        : selectedSource.incomeCodes;
    return (
      <div className="dse-section">
        <h3>Personal Income Definition</h3>
        <div className="dse-income-categories">
          <div className="income-category earned">
            <h5>Earned Income</h5>
            <p>Employment, self-employment, rental, commission, farming, fishing, etc.</p>
          </div>
          <div className="income-category unearned">
            <h5>Unearned Income</h5>
            <p>Pensions, CPP/OAS, EI, dividends, capital gains, RRSP, support payments, etc.</p>
          </div>
          <div className="income-category excluded">
            <h5>Not Considered Income</h5>
            <p>Certain exempted funds as defined by SDPR policy — not captured from CRA.</p>
          </div>
        </div>

        <h3>Income Codes</h3>
        <div className="dse-filter-bar">
          <span className="filter-label">Show:</span>
          {[
            { id: 'all' as const, label: 'All Codes' },
            { id: 'mou' as const, label: 'In MOU' },
            { id: 'not' as const, label: 'Not in MOU' },
          ].map(f => (
            <button
              key={f.id}
              className={`filter-btn ${incomeFilter === f.id ? 'active' : ''}`}
              onClick={() => setIncomeFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
          <span className="filter-count">{codes.length} codes</span>
        </div>

        <div className="dse-table-wrapper">
          <table className="dse-table">
            <thead>
              <tr>
                <th style={{ width: 80 }}>Code</th>
                <th>Description</th>
                <th style={{ width: 100 }}>In MOU</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((item, i) => (
                <tr key={`${item.code}-${i}`} className={i % 2 === 0 ? 'row-alt' : ''}>
                  <td className={`code-cell ${item.inMOU ? 'in-mou' : 'not-mou'}`}>{item.code}</td>
                  <td>{item.description}</td>
                  <td>
                    <span className={`badge ${item.inMOU ? 'badge-success' : 'badge-warning'}`}>
                      {item.inMOU ? 'Yes' : 'No'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout variant="lightGold">
          Note: Line 23600 (Net Income) is widely used and may be needed but is currently not in the existing MOU. This should be assessed for inclusion.
        </Callout>
      </div>
    );
  };

  const renderTechnical = () => {
    // ICBC-specific technical view
    if (selectedSource.accessMethods) {
      return (
        <div className="dse-section">
          <h3>How ICBC Data Is Currently Accessed</h3>
          <p className="dse-text">
            ICBC data is accessed in two ways depending on whether the calling system is legacy or new.
            SDPR currently has no programmatic access.
          </p>

          <div className="dse-access-methods">
            {selectedSource.accessMethods.map(method => (
              <div key={method.id} className={`access-method-card border-${method.tagVariant}`}>
                <div className="access-method-header">
                  <span className={`badge badge-${method.tagVariant}`}>{method.tag}</span>
                  <span className="access-method-label">{method.label}</span>
                </div>
                <div className="access-method-flow">
                  {method.flow.map((step, i) => (
                    <React.Fragment key={step}>
                      <div className="flow-step">{step}</div>
                      {i < method.flow.length - 1 && <span className="flow-arrow">→</span>}
                    </React.Fragment>
                  ))}
                </div>
                <p className="dse-text">{method.description}</p>
              </div>
            ))}
          </div>

          {selectedSource.sdprCurrentState && (
            <>
              <h3>SDPR Current State</h3>
              <div className="dse-sdpr-state">
                <div className="sdpr-state-header">⛔ No Programmatic Access</div>
                <p>{selectedSource.sdprCurrentState}</p>
              </div>
            </>
          )}

          {selectedSource.existingChannels && selectedSource.existingChannels.length > 0 && (
            <>
              <h3>Existing Access Channels (Other Ministries)</h3>
              <div className="dse-info-grid">
                {selectedSource.existingChannels.map((ch, i) => (
                  <div key={i} className="dse-info-card">
                    <h5>{ch.title}</h5>
                    <p className="dse-text">{ch.description}</p>
                    {ch.note && <p className="dse-note" style={{ margin: 0, fontStyle: 'normal' }}>⚡ {ch.note}</p>}
                  </div>
                ))}
              </div>
            </>
          )}

          {selectedSource.dataTypesSummary && selectedSource.dataTypesSummary.length > 0 && (
            <>
              <h3>Data Types Currently Shared by ICBC</h3>
              <div className="dse-data-types-grid">
                {selectedSource.dataTypesSummary.map((d, i) => (
                  <div key={i} className={`data-type-card ${d.needed ? 'needed' : ''}`}>
                    <div className="data-type-label">{d.label}</div>
                    <span className={`badge ${d.needed ? 'badge-warning' : 'badge-secondary'}`}>
                      {d.needed ? '⚠️ ' : ''}{d.who}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      );
    }

    // BCSC-specific technical view
    if (selectedSource.bcscConstraints) {
      return (
        <div className="dse-section">
          <h3>Current Access Pattern</h3>
          <p className="dse-text">
            IAS identity data is available <strong>at the time of login only</strong>. There is no API
            available to pull identity data independently of an active session.
          </p>

          <div className="bcsc-constraints">
            {selectedSource.bcscConstraints.map((c, i) => (
              <div key={i} className={`bcsc-constraint severity-${c.severity}`}>
                <div className="constraint-label">{c.label}</div>
                <p>{c.detail}</p>
              </div>
            ))}
          </div>

          {selectedSource.architectureFlows && selectedSource.architectureFlows.length > 0 && (
            <>
              <h3>IAS System Architecture (Summary)</h3>
              <div className="bcsc-architecture">
                {selectedSource.architectureFlows.map((flow, i) => (
                  <div key={i} className="arch-flow-row">
                    <div className="arch-flow-node">{flow.from}</div>
                    <span className="arch-flow-arrow">→</span>
                    <div className="arch-flow-node">{flow.to}</div>
                    <span className="arch-flow-arrow">→</span>
                    <div className="arch-flow-detail">{flow.detail}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {selectedSource.bpsPatterns && selectedSource.bpsPatterns.length > 0 && (
            <>
              <h3>Broader Public Sector (BPS) Access Patterns</h3>
              <div className="dse-info-grid">
                {selectedSource.bpsPatterns.map((pattern, i) => (
                  <div key={i} className="dse-info-card">
                    <h5>{pattern.title}</h5>
                    <ul className="bps-pattern-list">
                      {pattern.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          )}

          {selectedSource.bpsNote && (
            <Callout variant="lightBlue">
              {selectedSource.bpsNote}
            </Callout>
          )}
        </div>
      );
    }

    // CRA-specific technical view
    if (!selectedSource.recordTypes) return <p className="dse-empty">No technical details for this source.</p>;
    return (
      <div className="dse-section">
        <h3>Exchange Overview</h3>
        <p className="dse-text">
          Data is exchanged via Secure File Transfer Protocol (SFTP) with Entrust PKI encryption.
          There are no plans from CRA to replace SFTP with a real-time API.
        </p>

        <div className="dse-info-grid">
          <div className="dse-info-card">
            <h5>SFTP Servers</h5>
            <div className="server-entry">
              <span className="badge badge-success">PRODUCTION</span>
              <code>sftp-prod.cra-arc.gc.ca</code>
            </div>
            <div className="server-entry">
              <span className="badge badge-warning">TESTING</span>
              <code>sftp-test.cra-arc.gc.ca</code>
            </div>
          </div>
          <div className="dse-info-card">
            <h5>System Availability</h5>
            <ul className="dse-compact-list">
              <li><strong>SFTP:</strong> 24/7 (issues outside 7am–5pm EST resolved next day)</li>
              <li><strong>IV Mainframe:</strong> 7 days/week, 21 hrs/day (maintenance 3–6am)</li>
              <li><strong>Response time:</strong> Typically within hours; SLA 24–48 hrs</li>
            </ul>
          </div>
        </div>

        <h3>Transaction Record Types</h3>
        <div className="dse-record-types">
          {selectedSource.recordTypes.map(rec => (
            <div key={rec.code} className="record-type-card">
              <button
                className="record-type-header"
                onClick={() => setExpandedRecord(expandedRecord === rec.code ? null : rec.code)}
              >
                <code className="record-code">{rec.code}</code>
                <span className="record-label">{rec.label}</span>
                <span className={`badge ${rec.direction.includes('→') ? 'badge-info' : 'badge-success'}`}>
                  {rec.direction}
                </span>
                <span className="record-toggle">{expandedRecord === rec.code ? '▲' : '▼'}</span>
              </button>
              {expandedRecord === rec.code && (
                <div className="record-type-body">
                  <p>{rec.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedSource.matchingCriteria && (
          <>
            <h3>Matching Criteria</h3>
            <div className="dse-matching">
              <div className="matching-block primary">
                <div className="matching-label">PRIMARY</div>
                <div className="matching-value">{selectedSource.matchingCriteria.primary}</div>
              </div>
              <div className="matching-plus">+</div>
              <div className="matching-block secondary">
                <div className="matching-label">SECONDARY — 2 of 3</div>
                <div className="matching-fields">
                  {selectedSource.matchingCriteria.secondary.map((f, i) => (
                    <span key={i} className="matching-field">{f}</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="dse-note">{selectedSource.matchingCriteria.note}</p>
          </>
        )}

        {selectedSource.costTiers && (
          <>
            <h3>Costing Structure</h3>
            <div className="dse-table-wrapper">
              <table className="dse-table">
                <thead>
                  <tr>
                    <th>Requests per Quarter</th>
                    <th>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSource.costTiers.map((tier, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'row-alt' : ''}>
                      <td>{tier.range}</td>
                      <td className={tier.cost === 'No charge' ? 'cost-free' : ''}><strong>{tier.cost}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="dse-note">
              A request is counted per individual per tax year. Requesting 3 tax years for one client = 3 requests.
              Billed bi-annually (October Q1/Q2, February Q3/Q4).
            </p>
          </>
        )}
      </div>
    );
  };

  const renderProcess = () => {
    if (!selectedSource.processSteps) return <p className="dse-empty">No process information for this source.</p>;
    return (
      <div className="dse-section">
        <h3>Current Third-Party Check Process</h3>
        <div className="dse-process-steps">
          {selectedSource.processSteps.map((item, i) => (
            <div key={item.step} className="process-step-row">
              <div className="step-indicator">
                <div className="step-number">{item.step}</div>
                {i < selectedSource.processSteps!.length - 1 && <div className="step-line" />}
              </div>
              <div className="step-content">
                <h5>{item.title}</h5>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedSource.validationSteps && (
          <>
            <h3>Validation: What SDPR Looks For</h3>
            <div className="dse-validation-steps">
              {selectedSource.validationSteps.map((rule, i) => (
                <div key={i} className="validation-step">
                  <span className="validation-number">{i + 1}</span>
                  <p>{rule}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {selectedSource.painPoints && (
          <>
            <h3>Pain Points (Current State)</h3>
            <div className="dse-pain-points">
              {selectedSource.painPoints.map((p, i) => (
                <div key={i} className="pain-point">{p}</div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderMatching = () => {
    if (!selectedSource.matchingKeys) return <p className="dse-empty">No matching information for this source.</p>;
    return (
      <div className="dse-section">
        <h3>Matching &amp; Identification Strategy</h3>
        <p className="dse-text">
          Because {selectedSource.shortName} records may not align perfectly with data provided in an assistance application,
          the system must support multiple matching approaches.
        </p>

        <div className="dse-info-grid">
          {selectedSource.matchingKeys.map((group, i) => (
            <div key={i} className={`dse-info-card ${i === 0 ? 'border-top-success' : 'border-top-warning'}`}>
              <h5>{group.label}</h5>
              <ul className="dse-compact-list">
                {group.keys.map((k, j) => (
                  <li key={j}>{k}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {selectedSource.matchingConsiderations && selectedSource.matchingConsiderations.length > 0 && (
          <>
            <h3>Matching Considerations</h3>
            <div className="dse-considerations">
              {selectedSource.matchingConsiderations.map((item, i) => (
                <div key={i} className="consideration-item">
                  <div className="consideration-title">{item.title}</div>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {selectedSource.comparisonTable && (
          <>
            <h3>Comparison: LTSA vs ICBC Matching</h3>
            <div className="dse-table-wrapper">
              <table className="dse-table">
                <thead>
                  <tr>
                    {selectedSource.comparisonTable.headers.map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedSource.comparisonTable.rows.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'row-alt' : ''}>
                      {row.map((cell, j) => (
                        <td key={j}>{j === 0 ? <strong>{cell}</strong> : cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderBackground = () => {
    if (!selectedSource.backgroundItems) return <p className="dse-empty">No background information for this source.</p>;
    return (
      <div className="dse-section">
        <h3>What We Know</h3>
        <div className="dse-background-items">
          {selectedSource.backgroundItems.map((item, i) => (
            <div key={i} className="background-item">
              <div className="background-item-title">{item.title}</div>
              <p>{item.content}</p>
            </div>
          ))}
        </div>

        {selectedSource.knownConstraints && selectedSource.knownConstraints.length > 0 && (
          <>
            <h3>Key Known Constraints</h3>
            <div className="dse-constraints">
              {selectedSource.knownConstraints.map((c, i) => (
                <div key={i} className={`constraint-card severity-${c.severity}`}>
                  <div className="constraint-label">{c.label}</div>
                  <p>{c.detail}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {selectedSource.openQuestions && selectedSource.openQuestions.length > 0 && (
          <>
            <h3>Open Questions / TBD</h3>
            <div className="dse-open-questions">
              {selectedSource.openQuestions.map((q, i) => (
                <div key={i} className="open-question">❓ {q}</div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'contacts': return renderContacts();
      case 'requirements': return renderRequirements();
      case 'options': return renderOptions();
      case 'glossary': return renderGlossary();
      case 'income': return renderIncomeData();
      case 'technical': return renderTechnical();
      case 'process': return renderProcess();
      case 'matching': return renderMatching();
      case 'background': return renderBackground();
    }
  };

  return (
    <div className="data-source-explorer">
      <header className="dashboard-header">
        <div>
          <h1>Data Source Explorer</h1>
          <p>Authoritative data source profiles for eligibility verification</p>
        </div>
      </header>

      <Callout variant="lightGold">
        <strong>Internal Tool for EFV Team Use Only.</strong> This explorer is used by the Eligibility
        Factored Verification team to document and share authoritative data source profiles. Each
        profile captures the authority, data requirements, integration options, and contacts for
        systems used in eligibility factor verification — supporting transparent, auditable
        connections between eligibility decisions and their underlying data.
      </Callout>

      <div className="dse-layout">
        <aside className="dse-sidebar">
          <h2>Data Sources</h2>
          <div className="dse-source-list">
            {dataSourceProfiles.map(source => (
              <button
                key={source.id}
                className={`dse-source-item ${selectedSourceId === source.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedSourceId(source.id);
                  setActiveSection('overview');
                  setExpandedShapes(new Set());
                }}
              >
                <div className="source-item-name">{source.shortName}</div>
                <div className="source-item-category">
                  <span className={`badge badge-${source.category === 'federal' ? 'info' : source.category === 'utility' ? 'warning' : 'primary'}`}>
                    {getCategoryLabel(source.category)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="dse-main">
          <div className="dse-profile-header">
            <h2>{selectedSource.name}</h2>
            <p>{selectedSource.description}</p>
          </div>

          <nav className="dse-tabs">
            {[
              ...baseSections,
              ...(selectedSource.extraTabs || []).map(t => extraTabDefs[t]).filter(Boolean),
            ].map(section => (
              <button
                key={section.id}
                className={`dse-tab ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </nav>

          <div className="dse-content">
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DataSourceExplorer;
