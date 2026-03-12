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
}

type SectionId = 'overview' | 'contacts' | 'requirements' | 'options' | 'glossary';

const sections: { id: SectionId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'requirements', label: 'Data Requirements' },
  { id: 'options', label: 'Integration Options' },
  { id: 'glossary', label: 'Glossary' },
];

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

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'contacts': return renderContacts();
      case 'requirements': return renderRequirements();
      case 'options': return renderOptions();
      case 'glossary': return renderGlossary();
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
            {sections.map(section => (
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
