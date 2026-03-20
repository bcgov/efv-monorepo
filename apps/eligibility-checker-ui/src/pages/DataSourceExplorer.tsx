import React, { useState } from 'react';
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
  incomeCodes?: IncomeCode[];
  recordTypes?: RecordType[];
  costTiers?: CostTier[];
  matchingCriteria?: { primary: string; secondary: string[]; note: string };
  processSteps?: { step: number; title: string; description: string }[];
  validationSteps?: string[];
  painPoints?: string[];
}

type SectionId = 'overview' | 'contacts' | 'requirements' | 'options' | 'glossary' | 'income' | 'technical' | 'process';

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
    relatedFactors: ['Identity Confirmation', 'BC Residency Verification'],
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
  {
    id: 'msp',
    name: 'Medical Services Plan',
    shortName: 'MSP',
    description: 'British Columbia\'s publicly funded health care coverage plan administered by Health Insurance BC.',
    category: 'provincial',
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
  const [selectedSourceId, setSelectedSourceId] = useState<string>('ltsa');
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

                {option.risks.length > 0 && (
                  <div className="option-risks">
                    <h5>Risks</h5>
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
        </>
      )}
    </div>
  );

  const renderGlossary = () => (
    <div className="dse-section">
      {selectedSource.glossary.length > 0 ? (
        <div className="dse-glossary-list">
          {selectedSource.glossary.map((entry, i) => (
            <div key={i} className="dse-glossary-item">
              <dt>{entry.term}</dt>
              <dd>{entry.definition}</dd>
            </div>
          ))}
        </div>
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
        Each data source profile documents the authority, data requirements, integration options,
        and contacts for systems used in eligibility factor verification. This supports transparent,
        auditable connections between eligibility decisions and their underlying data.
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
