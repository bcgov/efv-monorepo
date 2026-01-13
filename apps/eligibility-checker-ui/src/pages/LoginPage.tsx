import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Callout } from '@bcgov/design-system-react-components';
import { useApplication } from '../context/ApplicationContext';
import { mockAuthService } from '../services/efvApi';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser, setCurrentStep } = useApplication();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginAsAmina = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await mockAuthService.loginWithBCServicesCard();
      
      if (response.success && response.data) {
        // BC Services Card data includes all personal information
        setUser(response.data);
        setCurrentStep('personal-info');
        navigate('/personal-info');
      } else {
        setError('Authentication failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <h1>Sign in</h1>
      <p className="description">
        To access the Electronic Factor Verification service, you need to authenticate your identity
        using your BC Services Card.
      </p>

      <Callout variant="lightBlue">
        <p>
          <strong>Prototype:</strong> This is a demonstration. In production, users would authenticate with their actual BC Services Card.
          For this demo, you can sign in as Amina to experience the application workflow.
        </p>
      </Callout>

      {error && (
        <Callout variant="lightGrey">
          <p>{error}</p>
        </Callout>
      )}

      <div className="login-card">
        <div className="user-profile">
          <div className="profile-icon">👤</div>
          <div className="profile-info">
            <h2>Amina Ahmed</h2>
            <p className="profile-detail">BC Services Card Holder</p>
            <p className="profile-detail">Victoria, BC</p>
          </div>
        </div>
        
        <div className="card-content">
          <p className="login-instruction">
            Sign in as Amina to explore the disability benefits application process with
            automated income verification through CRA.
          </p>
          
          <Button
            onClick={handleLoginAsAmina}
            variant="primary"
            size="large"
            isDisabled={loading}
            className="login-button"
          >
            {loading ? 'Authenticating...' : 'Sign in as Amina'}
          </Button>
        </div>
      </div>

      <div className="help-section">
        <h3>Need help?</h3>
        <ul>
          <li>
            <a href="https://www2.gov.bc.ca/gov/content/governments/government-id/bc-services-card" 
               target="_blank" 
               rel="noopener noreferrer">
              Learn about BC Services Card
            </a>
          </li>
          <li>
            <a href="https://www2.gov.bc.ca/gov/content/governments/government-id/bc-services-card/get-a-card" 
               target="_blank" 
               rel="noopener noreferrer">
              How to get a BC Services Card
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LoginPage;
