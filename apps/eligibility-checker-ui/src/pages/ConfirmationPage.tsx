import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Callout } from '@bcgov/design-system-react-components';
import { useApplication } from '../context/ApplicationContext';
import './ConfirmationPage.css';

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const { user, state, resetApplication } = useApplication();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!state.tracking) {
      navigate('/personal-info');
    }
  }, [user, state.tracking, navigate]);

  if (!user || !state.tracking || !state.personalInfo) return null;

  const handleStartNew = () => {
    resetApplication();
    navigate('/');
  };

  return (
    <div className="confirmation-page">
      <div className="success-icon">✓</div>
      <h1>Application Successfully Submitted!</h1>
      <p className="page-description">
        Thank you, {state.personalInfo.firstName}. Your disability benefits application has been received
        and is now being processed.
      </p>

      <Callout variant="lightGrey">
        <p>
          <strong>What Happens Next:</strong> Your application will be reviewed by a case worker. You will receive updates via email at
          <strong> {state.personalInfo.email}</strong>. Please allow 5-10 business days for initial review.
        </p>
      </Callout>

      <div className="confirmation-card">
        <h2>Application Reference Information</h2>
        
        <div className="ref-section">
          <div className="ref-item">
            <span className="ref-label">Application ID</span>
            <span className="ref-value">{state.tracking.applicationId}</span>
          </div>
          <div className="ref-item">
            <span className="ref-label">Check ID</span>
            <span className="ref-value">{state.tracking.checkId}</span>
          </div>
          <div className="ref-item">
            <span className="ref-label">Submission Date</span>
            <span className="ref-value">
              {new Date(state.tracking.submittedAt).toLocaleDateString('en-CA')}
            </span>
          </div>
          <div className="ref-item">
            <span className="ref-label">Submission Time</span>
            <span className="ref-value">
              {new Date(state.tracking.submittedAt).toLocaleTimeString('en-CA')}
            </span>
          </div>
        </div>

        <div className="save-instructions">
          <p>
            <strong>Important:</strong> Please save your Application ID for your records. You may need
            it to check the status of your application or when contacting us.
          </p>
        </div>
      </div>

      <div className="next-steps-card">
        <h2>Next Steps</h2>
        <div className="steps-list">
          <div className="step-item">
            <span className="step-number">1</span>
            <div className="step-content">
              <h3>Application Review</h3>
              <p>
                A case worker will review your application and verified income information. This typically
                takes 5-10 business days.
              </p>
            </div>
          </div>
          <div className="step-item">
            <span className="step-number">2</span>
            <div className="step-content">
              <h3>Medical Documentation</h3>
              <p>
                If you indicated you have medical documentation, you will receive instructions on how to
                submit it securely.
              </p>
            </div>
          </div>
          <div className="step-item">
            <span className="step-number">3</span>
            <div className="step-content">
              <h3>Decision Notification</h3>
              <p>
                You will be notified of the decision via email and mail. If approved, you will receive
                information about your benefits.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h2>Need Help?</h2>
        <Callout variant="lightBlue">
          <p>
            If you have questions about your application, please contact the Ministry of Citizens' Services:
          </p>
          <ul>
            <li><strong>Phone:</strong> 1-866-866-0800 (toll-free)</li>
            <li><strong>Email:</strong> sdpr.info@gov.bc.ca</li>
            <li><strong>Hours:</strong> Monday to Friday, 8:30 AM - 4:30 PM (Pacific Time)</li>
          </ul>
        </Callout>
      </div>

      <div className="form-actions">
        <Button variant="primary" onClick={handleStartNew}>
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
