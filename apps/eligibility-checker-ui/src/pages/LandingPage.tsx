import { useNavigate } from 'react-router-dom';
import { Button, Callout } from '@bcgov/design-system-react-components';
import { useApplication } from '../context/ApplicationContext';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { setCurrentStep } = useApplication();

  const handleGetStarted = () => {
    setCurrentStep('login');
    navigate('/login');
  };

  return (
    <div className="landing-page">
      <div className="hero-section">
        <h1>Electronic Factor Verification (EFV)</h1>
        <p className="subtitle">
          Streamlined access to disability benefits with automated income verification
        </p>
      </div>

      <div className="content-section">
        <h2>What is EFV?</h2>
        <Callout variant="lightBlue">
          <p>
            The Electronic Factor Verification service helps you apply for disability benefits by
            securely accessing your income information directly from the Canada Revenue Agency (CRA).
            This means you don't need to manually gather and submit income documents.
          </p>
        </Callout>
      </div>

      <div className="content-section">
        <h2>How it works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Sign in with BC Services Card</h3>
            <p>Securely authenticate your identity using your BC Services Card.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Provide your information</h3>
            <p>Tell us about yourself and your disability support needs.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Authorize income verification</h3>
            <p>Give us permission to securely access your income information from CRA.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Review and submit</h3>
            <p>Review your application with verified income data and submit.</p>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h2>What you'll need</h2>
        <ul className="requirements-list">
          <li>BC Services Card for authentication</li>
          <li>Social Insurance Number (SIN)</li>
          <li>Contact information</li>
          <li>Information about your disability or health condition</li>
          <li>Approximately 10-15 minutes to complete</li>
        </ul>
      </div>

      <div className="content-section">
        <h2>Privacy and Security</h2>
        <Callout variant="lightGrey">
          <p>
            Your information is protected and will only be used to process your disability benefits
            application. We follow strict privacy and security protocols in accordance with BC's
            Freedom of Information and Protection of Privacy Act.
          </p>
        </Callout>
      </div>

      <div className="action-section">
        <Button onClick={handleGetStarted} variant="primary" size="large">
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
