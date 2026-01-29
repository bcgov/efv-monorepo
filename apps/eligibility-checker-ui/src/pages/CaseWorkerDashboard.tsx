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
      description: 'Confirm applicant identity through government records',
      status: 'manual-review',
      dataSource: 'Multiple sources (ICBC, BC Services Card, MSP, CRA)',
      authorityLevel: 'medium',
      subCriteriaCount: 3,
      expanded: false
    },
    {
      id: 'ei-status',
      title: 'Active EI Claim Status',
      description: 'Verify if applicant has an active Employment Insurance claim',
      status: 'verified',
      dataSource: 'Service Canada - Employment Insurance (via federal data sharing)',
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
      action: 'Verification Completed',
      factor: 'Active EI Claim Status',
      details: 'Active EI claim confirmed via federal data sharing agreement. A. System (Automated)',
      type: 'verification'
    },
    {
      id: '4',
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
                      <p className="sub-criteria-placeholder">
                        Detailed sub-criteria would be displayed here...
                      </p>
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
