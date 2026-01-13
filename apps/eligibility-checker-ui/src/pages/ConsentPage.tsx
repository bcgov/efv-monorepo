import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Checkbox, TextField } from '@bcgov/design-system-react-components';
import { useApplication } from '../context/ApplicationContext';
import './ConsentPage.css';

const ConsentPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateConsent } = useApplication();

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [fullName, setFullName] = useState('');
  const [consentDate, setConsentDate] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setConsentDate(today);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (agreedToTerms && fullName.trim()) {
      updateConsent({
        consentId: `consent-${Date.now()}`,
        craDataAccess: agreedToTerms,
        electronicSignature: fullName,
        timestamp: new Date().toISOString(),
        ipAddress: '0.0.0.0',
        consentText: 'I have read and understand the above information, and I consent to the collection, use, and disclosure of my personal information as described'
      });
      navigate('/verification');
    }
  };

  const isFormValid = agreedToTerms && fullName.trim().length > 0;

  return (
    <div className="consent-page">
      <h1>Consent and Authorization</h1>
      
      <div className="consent-content">
        <h2>Authorization for Information Release</h2>
        <p>
          By providing your consent below, you authorize the BC Government to:
        </p>
        <ul>
          <li>Access your tax information from the Canada Revenue Agency (CRA)</li>
          <li>Verify your income and financial information for eligibility purposes</li>
          <li>Store and process your personal information in accordance with privacy laws</li>
          <li>Use the collected information to assess your eligibility for disability benefits</li>
        </ul>

        <h2>Privacy Notice</h2>
        <p>
          Your personal information is collected under the authority of the Freedom of Information 
          and Protection of Privacy Act. The information will be used to determine your eligibility 
          for disability benefits and will be protected according to the provisions of the Act.
        </p>

        <h2>Your Rights</h2>
        <p>
          You have the right to access and correct your personal information. For questions about 
          the collection and use of your information, please contact the Ministry of Citizens' Services.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="consent-checkbox">
          <Checkbox
            isSelected={agreedToTerms}
            onChange={(checked: boolean) => setAgreedToTerms(checked)}
          >
            I have read and understand the above information, and I consent to the collection, use, and disclosure of my personal information as described
          </Checkbox>
        </div>

        <div className="signature-section">
          <TextField
            label="Electronic Signature"
            value={fullName}
            onChange={(value: string) => setFullName(value)}
            description="By typing your name, you are providing your electronic signature"
            isRequired
          />

          <TextField
            label="Date"
            type="date"
            value={consentDate}
            isReadOnly
            isDisabled
          />
        </div>

        <div className="form-actions">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            isDisabled={!isFormValid}
          >
            Submit Consent
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ConsentPage;
