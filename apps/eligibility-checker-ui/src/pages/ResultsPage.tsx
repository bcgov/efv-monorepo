import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Callout } from '@bcgov/design-system-react-components';
import { useApplication } from '../context/ApplicationContext';
import './ResultsPage.css';

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useApplication();

  const formatCurrency = (amount: number | undefined): string => {
    if (amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  const verification = state.craVerification;

  if (!verification) {
    return (
      <div className="results-page">
        <h1>No Verification Data</h1>
        <p>No verification data is available. Please complete the verification process first.</p>
        <Button variant="primary" onClick={() => navigate('/verification')}>
          Go to Verification
        </Button>
      </div>
    );
  }

  return (
    <div className="results-page">
      <h1>Verification Results</h1>
      <p>Your income information has been successfully verified with the Canada Revenue Agency.</p>
      
      <Callout variant="lightBlue">
        <p>
          <strong>Verification Complete:</strong> We have successfully retrieved and verified your tax information for {verification.taxYear || 'the current year'}.
        </p>
      </Callout>

      <div className="results-content">
        <section className="results-section">
          <h2>Tax Year Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Tax Year:</span>
              <span className="info-value">{verification.taxYear || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Verification Date:</span>
              <span className="info-value">
                {verification.verifiedAt 
                  ? new Date(verification.verifiedAt).toLocaleDateString('en-CA')
                  : 'N/A'}
              </span>
            </div>
          </div>
        </section>

        <section className="results-section">
          <h2>Income Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Total Income:</span>
              <span className="info-value">{formatCurrency(verification.totalIncome)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Employment Income:</span>
              <span className="info-value">{formatCurrency(verification.employmentIncome)}</span>
            </div>
          </div>
        </section>

        <section className="results-section">
          <h2>Eligibility Factors</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Income Eligibility:</span>
              <span className="info-value">
                {verification.factors?.incomeEligibility ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Threshold Met:</span>
              <span className="info-value">
                {verification.factors?.thresholdMet ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </section>

        {verification.factors?.additionalFactors && verification.factors.additionalFactors.length > 0 && (
          <section className="results-section">
            <h2>Additional Eligibility Factors</h2>
            <ul>
              {verification.factors.additionalFactors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <Callout variant="lightGrey">
        <p>
          <strong>Next Steps:</strong> Please review all the information carefully. If everything looks correct, 
          proceed to the review page to finalize your application.
        </p>
      </Callout>

      <div className="form-actions">
        <Button variant="secondary" onClick={() => navigate('/verification')}>
          Back to Verification
        </Button>
        <Button variant="primary" onClick={() => navigate('/review')}>
          Proceed to Review
        </Button>
      </div>
    </div>
  );
};

export default ResultsPage;
