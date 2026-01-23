import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@bcgov/design-system-react-components';
import './IndexPage.css';

const IndexPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="index-page">
      <div className="index-header">
        <h1>Electronic Factor Verification (EFV)</h1>
        <p className="subtitle">Prototype Demonstrations for EFV</p>
      </div>

      <div className="prototype-grid">
        <div className="prototype-card">
          <h2>Applicant Workflow</h2>
          <p>Submit disability benefit applications with automated CRA income verification</p>
          <div className="card-features">
            <span className="feature-badge">BC Services Card Login</span>
            <span className="feature-badge">Personal Information</span>
            <span className="feature-badge">Disability Details</span>
            <span className="feature-badge">CRA Integration</span>
          </div>
          <Button 
            variant="primary" 
            onClick={() => navigate('/landing')}
            className="prototype-button"
          >
            Sign In as Applicant
          </Button>
        </div>

        <div className="prototype-card">
          <h2>Case Worker Dashboard</h2>
          <p>Review applications with assistive decision support and verification factors</p>
          <div className="card-features">
            <span className="feature-badge">Application Review</span>
            <span className="feature-badge">Verification Factors</span>
            <span className="feature-badge">Data Attribution</span>
            <span className="feature-badge">Audit Trail</span>
          </div>
          <Button 
            variant="primary" 
            onClick={() => navigate('/caseworker')}
            className="prototype-button"
          >
            Sign In as Case Worker
          </Button>
        </div>
      </div>

      <div className="prototype-disclaimer">
        <div className="disclaimer-content">
          <h3>Prototype Demonstration</h3>
          <p>
            These are interactive prototypes for stakeholder review and testing. They demonstrate potential 
            workflows and are not production systems. All data is simulated for demonstration purposes.
          </p>
        </div>
      </div>

      <div className="design-principles">
        <h3>Design Principles</h3>
        <div className="principles-grid">
          <div className="principle">
            <strong>Verifies facts, does not make eligibility decisions</strong>
          </div>
          <div className="principle">
            <strong>Shows sub-criteria and detailed reasoning</strong>
          </div>
          <div className="principle">
            <strong>Maintains data source attribution</strong>
          </div>
          <div className="principle">
            <strong>Supports human judgment and manual review</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
