import React, { useState } from 'react';
import { Button, Callout } from '@bcgov/design-system-react-components';
import './CaseWorkerDashboard.css';

interface VerificationFactor {
  id: string;
  title: string;
  description: string;
  status: 'verified' | 'failed' | 'pending' | 'manual-review';
  dataSource: string;
  authorityLevel: 'high' | 'medium' | 'low';
  subCriteriaCount: number;
  expanded: boolean;
  submittedAddress?: string;
  residencySources?: ResidencySource[];
}

interface ResidencySource {
  source: string;
  address: string;
  lastUpdated: string;
  authorityLevel: 'high' | 'medium' | 'low';
  matches: boolean;
  note?: string;
  interpretation?: string;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  factor: string;
  details: string;
  type: 'verification' | 'review';
}

const CaseWorkerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'verification' | 'audit'>('verification');
  
  const [verificationFactors, setVerificationFactors] = useState<VerificationFactor[]>([
    {
      id: 'income',
      title: 'Income Within Defined Range',
      description: 'Verify that applicant annual income falls within the program eligibility range',
      status: 'verified',
      dataSource: 'Canada Revenue Agency (CRA) - T1 General',
      authorityLevel: 'high',
      subCriteriaCount: 3,
      expanded: false
    },
    {
      id: 'identity',
      title: 'Identity Confirmation',
      description: 'Identity must be verified before other eligibility factors can be assessed',
      status: 'verified',
      dataSource: 'BC Services Card (digital) with in-person document verification',
      authorityLevel: 'high',
      subCriteriaCount: 5,
      expanded: false
    },
    {
      id: 'residency',
      title: 'BC Residency Verification',
      description: 'Verify British Columbia residency through multiple authoritative sources',
      status: 'manual-review',
      dataSource: 'Multiple sources (ICBC, MSP, BC Hydro, CRA)',
      authorityLevel: 'medium',
      subCriteriaCount: 5,
      expanded: false,
      submittedAddress: '456 Main Street, Unit 302, Vancouver, BC V6B 2W5',
      residencySources: [
        {
          source: 'Canada Revenue Agency',
          address: '789 Kingsway Avenue, Unit 12, Burnaby, BC V5H 2E3',
          lastUpdated: 'April 2025 (Tax Year 2024)',
          authorityLevel: 'high',
          matches: false,
          note: 'Reflects address at time of tax filing, not current residence',
          interpretation: 'Commonly lags behind real-world moves. Supports historical presence, not current occupancy.'
        },
        {
          source: 'ICBC',
          address: '456 Main Street, Unit 302, Vancouver, BC V6B 2W5',
          lastUpdated: 'December 15, 2025',
          authorityLevel: 'high',
          matches: true,
          note: 'Address reported by the licensee for driver licensing purposes',
          interpretation: 'Self-reported by the licensee. Typically updated soon after a move, but not independently verified. Indicates current address intent, not duration of residence.'
        },
        {
          source: 'MSP',
          address: '456 Main Street, Unit 302, Vancouver, BC V6B 2W5',
          lastUpdated: 'November 3, 2025',
          authorityLevel: 'high',
          matches: true,
          note: 'Registered address for BC health care coverage and service eligibility region',
          interpretation: 'Confirms administrative registration within BC systems. Indicates presence in BC, not physical occupancy or residency duration. Address updates may lag behind actual move dates.'
        },
        {
          source: 'BC Hydro',
          address: '456 Main Street, Unit 302, Vancouver, BC V6B 2W5',
          lastUpdated: 'January 2026',
          authorityLevel: 'medium',
          matches: true,
          note: 'Active utility service account address',
          interpretation: 'Indicates utility service established at this location. Suggests physical occupancy, but does not confirm who resides there. Does not confirm length or continuity of residence.'
        }
      ]
    },
    {
      id: 'ei-status',
      title: 'Active EI Claim Status',
      description: 'Verify if applicant has an active Employment Insurance claim',
      status: 'verified',
      dataSource: 'Employment and Social Development Canada (ESDC)',
      authorityLevel: 'high',
      subCriteriaCount: 2,
      expanded: false
    },
    {
      id: 'education',
      title: 'Educational Enrollment Status',
      description: 'Verify active enrollment in an approved educational institution',
      status: 'failed',
      dataSource: 'Ministry of Education - Student Records',
      authorityLevel: 'medium',
      subCriteriaCount: 2,
      expanded: false
    }
  ]);

  const auditLog: AuditLogEntry[] = [
    {
      id: '1',
      timestamp: 'January 12, 2026 10:21 AM',
      action: 'Manual Review Requested',
      factor: 'Identity Confirmation',
      details: 'A. System (Automated)',
      type: 'review'
    },
    {
      id: '2',
      timestamp: 'January 12, 2026 10:26 AM',
      action: 'Verification Completed',
      factor: 'Income Within Defined Range',
      details: 'Income verified below threshold. One sub-criteria flagged for manual review. A. System (Automated)',
      type: 'verification'
    },
    {
      id: '3',
      timestamp: 'January 12, 2026 10:26 AM',
      action: 'Address Triangulation Completed',
      factor: 'BC Residency Verification',
      details: '4 of 5 sources match Vancouver address. BC Hydro account shows Victoria address. Flagged for manual review to verify recent move or multiple residences. A. System (Automated)',
      type: 'review'
    },
    {
      id: '4',
      timestamp: 'January 12, 2026 10:26 AM',
      action: 'Verification Completed',
      factor: 'Active EI Claim Status',
      details: 'Active EI claim confirmed via ESDC data sharing agreement. A. System (Automated)',
      type: 'verification'
    },
    {
      id: '5',
      timestamp: 'January 12, 2026 10:28 AM',
      action: 'Verification Failed',
      factor: 'Educational Enrollment Status',
      details: 'No current term enrollment found. Factor marked for manual review. A. System (Automated)',
      type: 'verification'
    }
  ];

  const toggleExpanded = (id: string) => {
    setVerificationFactors(factors =>
      factors.map(f => f.id === id ? { ...f, expanded: !f.expanded } : f)
    );
  };

  const getStatusColor = (status: VerificationFactor['status']) => {
    switch (status) {
      case 'verified': return 'success';
      case 'failed': return 'danger';
      case 'pending': return 'warning';
      case 'manual-review': return 'warning';
      default: return 'info';
    }
  };

  const getStatusLabel = (status: VerificationFactor['status']) => {
    switch (status) {
      case 'verified': return 'verified';
      case 'failed': return 'failed';
      case 'pending': return 'pending';
      case 'manual-review': return 'manual review';
      default: return status;
    }
  };

  const getAuthorityBadge = (level: 'high' | 'medium' | 'low') => {
    const className = level === 'high' ? 'badge-success' : level === 'medium' ? 'badge-info' : 'badge-warning';
    return (
      <span className={`badge ${className}`}>
        {level}
      </span>
    );
  };

  const verifiedCount = verificationFactors.filter(f => f.status === 'verified').length;
  const failedCount = verificationFactors.filter(f => f.status === 'failed').length;
  const manualReviewCount = verificationFactors.filter(f => f.status === 'manual-review').length;
  const completionProgress = Math.round((verifiedCount / verificationFactors.length) * 100);

  return (
    <div className="caseworker-dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Eligibility Verification Factor Tool</h1>
          <p>Assistive decision support for social assistance programs</p>
        </div>
      </header>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="applicant-info-card">
            <div className="card-header">
              <h2>Applicant Information</h2>
              <span className="badge badge-warning">medium identity confidence</span>
            </div>
            <p className="info-subtitle">Identity and context for verification</p>

            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Full Name</span>
                <span className="info-value">Amina Ahmed</span>
              </div>
              <div className="info-item">
                <span className="info-label">Date of Birth</span>
                <span className="info-value">January 01, 1999</span>
              </div>
              <div className="info-item">
                <span className="info-label">Location</span>
                <span className="info-value">British Columbia, Canada</span>
              </div>
              <div className="info-item">
                <span className="info-label">Program Context</span>
                <span className="info-value">Disability Assistance Program</span>
              </div>
            </div>

            <Callout variant="lightGold">
              Identity confidence based on Name + DOB matching. 
              Weak identity matching may require additional verification steps or manual review.
            </Callout>
          </div>

          <div className="summary-card">
            <h2>Verification Summary</h2>
            
            <div className="progress-section">
              <div className="progress-header">
                <span>Completion Progress</span>
                <span className="progress-value">{completionProgress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${completionProgress}%` }} />
              </div>
            </div>

            <div className="summary-grid">
              <div className="summary-item verified">
                <div className="summary-count">{verifiedCount}</div>
                <div className="summary-label">Verified</div>
              </div>
              <div className="summary-item failed">
                <div className="summary-count">{failedCount}</div>
                <div className="summary-label">Failed</div>
              </div>
              <div className="summary-item pending">
                <div className="summary-count">0</div>
                <div className="summary-label">Pending</div>
              </div>
              <div className="summary-item review">
                <div className="summary-count">{manualReviewCount}</div>
                <div className="summary-label">Manual Review</div>
              </div>
            </div>

            <Button variant="primary" className="report-button">
              Generate Verification Report
            </Button>

            <Callout variant="lightBlue">
              This tool verifies facts and provides signals. 
              Final eligibility decisions require human judgment and program-specific logic.
            </Callout>
          </div>
        </aside>

        <main className="main-content">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'verification' ? 'active' : ''}`}
              onClick={() => setActiveTab('verification')}
            >
              Verification Factors
            </button>
            <button 
              className={`tab ${activeTab === 'audit' ? 'active' : ''}`}
              onClick={() => setActiveTab('audit')}
            >
              Audit Log
            </button>
          </div>

          {activeTab === 'verification' && (
            <div className="verification-factors">
              {verificationFactors.map(factor => (
                <div key={factor.id} className={`factor-card status-${factor.status}`}>
                  <div className="factor-header">
                    <div className="factor-title-row">
                      <h3>{factor.title}</h3>
                      <span className={`badge badge-${getStatusColor(factor.status)}`}>
                        {getStatusLabel(factor.status)}
                      </span>
                    </div>
                    <p className="factor-description">{factor.description}</p>
                  </div>

                  <div className="factor-meta">
                    <div className="meta-item">
                      <span className="meta-label">Data Source</span>
                      <span className="meta-value">{factor.dataSource}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Authority Level</span>
                      {getAuthorityBadge(factor.authorityLevel)}
                    </div>
                  </div>

                  <button 
                    className="expand-button"
                    onClick={() => toggleExpanded(factor.id)}
                  >
                    {factor.expanded ? 'Hide' : 'Show'} Detailed Sub-Criteria ({factor.subCriteriaCount})
                  </button>

                  {factor.expanded && (
                    <div className="sub-criteria">
                      {factor.id === 'residency' && factor.residencySources ? (
                        <div className="residency-verification">
                          <div className="submitted-address-section">
                            <div className="submitted-address-label">APPLICANT SUBMITTED ADDRESS</div>
                            <div className="submitted-address">{factor.submittedAddress}</div>
                          </div>
                          
                          <div className="residency-header">
                            <h4>Residency Signals (Decision Support)</h4>
                            <p className="residency-subtitle">
                              Multiple authoritative sources provide signals about residency. 3 of 4 sources aligned with submitted address.
                            </p>
                          </div>
                          
                          <div className="residency-sources">
                            {factor.residencySources.map((source, index) => (
                              <div key={index} className={`residency-source ${source.matches ? 'match' : 'mismatch'}`}>
                                <div className="source-header">
                                  <div className="source-info">
                                    <span className="source-name">{source.source}</span>
                                    <span className={`badge badge-${source.authorityLevel === 'high' ? 'success' : source.authorityLevel === 'medium' ? 'info' : 'warning'}`}>
                                      {source.authorityLevel} authority
                                    </span>
                                  </div>
                                  <span className={`match-indicator ${source.matches ? 'matches' : 'differs'}`}>
                                    {source.matches ? 'Aligned' : 'Differs'}
                                  </span>
                                </div>
                                <div className="source-details">
                                  <div className="source-address-label">AUTHORITATIVE FOR</div>
                                  <div className="source-note" style={{marginTop: 0, marginBottom: '0.75rem'}}>
                                    {source.note}
                                  </div>
                                  <div className="source-address-label">ADDRESS INDICATOR</div>
                                  <div className="source-address">{source.address}</div>
                                  <div className="source-meta">Updated: {source.lastUpdated}</div>
                                  <div className="source-address-label" style={{marginTop: '0.75rem'}}>SIGNAL INTERPRETATION</div>
                                  <div className="source-note" style={{marginTop: '0.5rem'}}>
                                    {source.interpretation}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <Callout variant="lightBlue">
                            <strong>Residency Decision Context:</strong> CRA address reflects historical presence at time of tax filing. 
                            Recent move from Burnaby to Vancouver is supported by 3 current data sources (ICBC, MSP, BC Hydro) 
                            all showing the submitted Vancouver address.
                          </Callout>
                        </div>
                      ) : factor.id === 'identity' ? (
                        <div className="identity-verification">
                          <div className="identity-checks">
                            <div className="identity-check verified">
                              <div className="check-header">
                                <h5>Legal Name Match Across Systems</h5>
                                <span className="check-status">Verified</span>
                              </div>
                              <p className="check-description">
                                Full legal name matches across Provincial Identity Registry, BC Services Card, and driver's license. 
                                No aliases or alternate spellings found.
                              </p>
                              <div className="check-source">Source: Provincial Identity Registry, ICBC</div>
                            </div>
                            
                            <div className="identity-check verified">
                              <div className="check-header">
                                <h5>Date of Birth Consistency</h5>
                                <span className="check-status">Verified</span>
                              </div>
                              <p className="check-description">
                                Date of birth consistent across all checked systems including birth registry, health records, and driver's license.
                              </p>
                              <div className="check-source">Source: Birth Registry, MSP, ICBC</div>
                            </div>
                            
                            <div className="identity-check verified">
                              <div className="check-header">
                                <h5>Photo Identification Verification</h5>
                                <span className="check-status">Verified</span>
                              </div>
                              <p className="check-description">
                                Government-issued photo ID verified in person at Service BC office. BC driver's license presented and validated.
                              </p>
                              <div className="check-source">Source: In-person verification at Service BC - Downtown Vancouver</div>
                            </div>
                            
                            <div className="identity-check verified">
                              <div className="check-header">
                                <h5>Address History Verification</h5>
                                <span className="check-status">Verified</span>
                              </div>
                              <p className="check-description">
                                5-year address history confirmed through driver's license updates and MSP records. No gaps in residency.
                              </p>
                              <div className="check-source">Source: ICBC, MSP</div>
                            </div>
                            
                            <div className="identity-check verified">
                              <div className="check-header">
                                <h5>Unique Identity Confirmation</h5>
                                <span className="check-status">Verified</span>
                              </div>
                              <p className="check-description">
                                No duplicate records found across systems. Identity is unique within provincial databases.
                              </p>
                              <div className="check-source">Source: Provincial Identity Registry</div>
                            </div>
                          </div>
                          
                          <div className="identity-limitations">
                            <h5>Limitations</h5>
                            <ul>
                              <li>Does not confirm current residency</li>
                              <li>Does not confirm legal status for program</li>
                              <li>Does not detect informal name usage</li>
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <p className="sub-criteria-placeholder">
                          Detailed sub-criteria would be displayed here...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="audit-log">
              <h2>Audit Log & History</h2>
              {auditLog.map(entry => (
                <div key={entry.id} className="audit-entry">
                  <div className="audit-header">
                    <span className={`badge ${entry.type === 'verification' ? 'badge-info' : 'badge-warning'}`}>
                      {entry.type}
                    </span>
                    <span className="audit-timestamp">{entry.timestamp}</span>
                  </div>
                  <h4>{entry.action}</h4>
                  <p className="audit-factor">{entry.factor}</p>
                  <p className="audit-details">{entry.details}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CaseWorkerDashboard;
