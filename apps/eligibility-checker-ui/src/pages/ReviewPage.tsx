import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Callout } from '@bcgov/design-system-react-components';
import { useApplication } from '../context/ApplicationContext';
import './ReviewPage.css';

const ReviewPage = () => {
  const navigate = useNavigate();
  const { user, state, setCurrentStep } = useApplication();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!state.personalInfo || !state.disabilityApplication || 
               !state.consent || !state.craVerification) {
      navigate('/personal-info');
    }
  }, [user, state, navigate]);

  if (!user || !state.personalInfo || !state.disabilityApplication || 
      !state.consent || !state.craVerification) {
    return null;
  }

  const handleSubmit = () => {
    setCurrentStep('confirmation');
    navigate('/confirmation');
  };

  const handleEdit = (section: string) => {
    navigate(`/${section}`);
  };

  return (
    <div className="review-page">
      <h1>Review Your Application</h1>
      <p className="page-description">
        Please review all the information below before submitting your disability benefits application.
      </p>

      <Callout variant="lightBlue">
        <p>
          <strong>Almost done!</strong> Please carefully review all sections. You can edit any section
          by clicking the "Edit" button next to it.
        </p>
      </Callout>

      <div className="review-container">
        {/* Personal Information */}
        <div className="review-section">
          <div className="section-header">
            <h2>Personal Information</h2>
            <Button 
              variant="secondary" 
              size="small"
              onClick={() => handleEdit('personal-info')}
            >
              Edit
            </Button>
          </div>
          <div className="section-content">
            <div className="info-row">
              <span className="info-label">Name</span>
              <span className="info-value">
                {state.personalInfo.firstName} {state.personalInfo.lastName}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Date of Birth</span>
              <span className="info-value">
                {new Date(state.personalInfo.dateOfBirth).toLocaleDateString('en-CA')}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">SIN</span>
              <span className="info-value">{state.personalInfo.sin}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Phone</span>
              <span className="info-value">{state.personalInfo.phoneNumber}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email</span>
              <span className="info-value">{state.personalInfo.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Address</span>
              <span className="info-value">
                {state.personalInfo.address.streetAddress}, {state.personalInfo.address.city}, 
                {state.personalInfo.address.province} {state.personalInfo.address.postalCode}
              </span>
            </div>
          </div>
        </div>

        {/* Disability Information */}
        <div className="review-section">
          <div className="section-header">
            <h2>Disability Information</h2>
            <Button 
              variant="secondary" 
              size="small"
              onClick={() => handleEdit('disability-info')}
            >
              Edit
            </Button>
          </div>
          <div className="section-content">
            <div className="info-row">
              <span className="info-label">Physical Disability</span>
              <span className="info-value">
                {state.disabilityApplication.hasPhysicalDisability ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Mental Health Condition</span>
              <span className="info-value">
                {state.disabilityApplication.hasMentalHealthCondition ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Requires Assistance</span>
              <span className="info-value">
                {state.disabilityApplication.requiresAssistance ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Medical Documentation</span>
              <span className="info-value">
                {state.disabilityApplication.medicalDocumentation ? 'Available' : 'Not Available'}
              </span>
            </div>
            <div className="info-row full-width">
              <span className="info-label">Description</span>
              <p className="info-description">
                {state.disabilityApplication.disabilityDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Income Verification */}
        <div className="review-section">
          <div className="section-header">
            <h2>Income Verification (CRA)</h2>
            <span className="verified-badge">✓ Verified</span>
          </div>
          <div className="section-content">
            <div className="info-row">
              <span className="info-label">Tax Year</span>
              <span className="info-value">{state.craVerification.taxYear}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Total Income</span>
              <span className="info-value amount">
                ${state.craVerification.totalIncome.toLocaleString('en-CA')}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Employment Income</span>
              <span className="info-value amount">
                ${state.craVerification.employmentIncome.toLocaleString('en-CA')}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Eligibility Status</span>
              <span className="info-value eligible">
                {state.craVerification.factors.incomeEligibility ? 'Eligible' : 'Review Required'}
              </span>
            </div>
          </div>
        </div>

        {/* Consent */}
        <div className="review-section">
          <div className="section-header">
            <h2>Consent</h2>
            <span className="verified-badge">✓ Provided</span>
          </div>
          <div className="section-content">
            <div className="info-row">
              <span className="info-label">CRA Data Access</span>
              <span className="info-value">
                {state.consent.craDataAccess ? 'Authorized' : 'Not Authorized'}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Electronic Signature</span>
              <span className="info-value">{state.consent.electronicSignature}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Date</span>
              <span className="info-value">
                {new Date(state.consent.timestamp).toLocaleDateString('en-CA')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Callout variant="lightGold">
        <h3>Before You Submit</h3>
        <p>
          By submitting this application, you confirm that all information provided is true and accurate
          to the best of your knowledge. Providing false information may result in denial of benefits or
          legal consequences.
        </p>
      </Callout>

      <div className="form-actions">
        <Button variant="secondary" onClick={() => navigate('/results')}>
          Back to Results
        </Button>
        <Button variant="primary" onClick={handleSubmit} size="large">
          Submit Application
        </Button>
      </div>
    </div>
  );
};

export default ReviewPage;
