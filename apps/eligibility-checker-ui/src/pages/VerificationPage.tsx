import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@bcgov/design-system-react-components';
import { useApplication } from '../context/ApplicationContext';
import { mockEFVService } from '../services/efvApi';
import type { VerificationStatusResponse } from '../types';
import './VerificationPage.css';

const VerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, updateVerification, setTracking } = useApplication();

  const [message, setMessage] = useState<string>('Initializing verification...');
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const startVerification = async () => {
      try {
        // Ensure we have the required data
        if (!state.personalInfo || !state.disabilityApplication || !state.consent) {
          setError('Missing required application data');
          return;
        }

        // Submit the application first
        const submitResponse = await mockEFVService.submitApplication(
          state.personalInfo,
          state.disabilityApplication,
          state.consent
        );

        if (!submitResponse.success || !submitResponse.data) {
          setError('Failed to submit application');
          return;
        }

        const { packId, applicationId } = submitResponse.data;

        // Store tracking info
        setTracking({
          applicationId,
          checkId: submitResponse.data.checkId,
          packId,
          submittedAt: new Date().toISOString(),
          status: 'pending'
        });

        // Poll for verification results
        const onProgress = (statusData: VerificationStatusResponse) => {
          setProgress(statusData.progress || 0);

          // Update status messages based on progress
          if (statusData.progress && statusData.progress <= 25) {
            setMessage('Initiating secure connection...');
          } else if (statusData.progress && statusData.progress <= 50) {
            setMessage('Authenticating with CRA...');
          } else if (statusData.progress && statusData.progress <= 75) {
            setMessage('Retrieving income data...');
          } else if (statusData.progress && statusData.progress < 100) {
            setMessage('Processing verification...');
          } else {
            setMessage(statusData.message || 'Verification complete!');
          }
        };

        const verificationResponse = await mockEFVService.pollVerificationStatus(
          packId,
          onProgress,
          60 // max attempts
        );

        if (verificationResponse.success && verificationResponse.data) {
          updateVerification(verificationResponse.data);
          setMessage('Verification complete!');
          setProgress(100);
          setTimeout(() => {
            navigate('/results');
          }, 1500);
        } else {
          setError(verificationResponse.error || 'Verification failed');
        }
      } catch (err) {
        console.error('Verification error:', err);
        setError('An error occurred during verification. Please try again.');
      }
    };

    startVerification();
  }, [navigate, updateVerification, setTracking, state.personalInfo, state.disabilityApplication, state.consent]);

  return (
    <div className="verification-page">
      <h1>Verifying Your Information</h1>
      <p>Please wait while we securely verify your information with the Canada Revenue Agency.</p>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <Button onClick={() => navigate('/consent')}>Try Again</Button>
        </div>
      )}

      {!error && (
        <>
          <div className="verification-status">
            <div className="status-message">
              <h2>{message}</h2>
            </div>

            <div className="spinner-container">
              <div className="spinner"></div>
            </div>

            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="progress-text">{progress}% Complete</span>
            </div>
          </div>

          <div className="verification-info">
            <h3>What we are doing:</h3>
            <ul>
              <li>Establishing a secure connection with CRA systems</li>
              <li>Authenticating your identity using the information provided</li>
              <li>Retrieving your tax and income information</li>
              <li>Verifying the data for accuracy</li>
            </ul>
            <p className="privacy-note">
              All data is transmitted securely and encrypted. Your privacy is our priority.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default VerificationPage;
